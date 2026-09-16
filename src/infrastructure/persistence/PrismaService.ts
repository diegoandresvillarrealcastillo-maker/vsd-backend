import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Lo que una transaccion con sesion puede hacer.
 *
 * Es un subconjunto de `PrismaClient` en lugar del tipo completo porque dentro
 * de una transaccion interactiva no existen `$connect`, `$disconnect` ni
 * `$transaction`. Se declara a mano para no importar tipos internos del
 * runtime de Prisma, que cambian entre versiones sin avisar.
 */
export type ClienteConSesion = Pick<
  PrismaClient,
  'usuario' | 'categoria' | 'actividad' | 'resultado' | 'recursoApoyo' | 'entradaDiario'
>;

/** Rol con el que se declara una sesion. Coincide con el enum `rol` de la base. */
export const RolDeSesion = {
  USUARIO: 'usuario',
  ADMINISTRADOR: 'administrador',
} as const;

export type RolDeSesion = (typeof RolDeSesion)[keyof typeof RolDeSesion];

/**
 * Se lanza cuando la conexion no esta sujeta a las politicas de la base.
 *
 * Es el fallo que el Row Level Security no puede avisar por su cuenta: si la
 * aplicacion se conecta como dueno de las tablas o con un rol privilegiado,
 * las politicas no se evaluan y todo parece funcionar igual de bien mientras
 * el aislamiento ya no existe.
 */
export class AislamientoInactivoError extends Error {
  constructor(rol: string, motivo: string) {
    super(
      `La conexion a PostgreSQL usa el rol "${rol}", que ${motivo}. ` +
        'Las politicas de aislamiento entre personas no se aplicarian. ' +
        'Conecta la aplicacion con el rol vsd_app (ver la migracion 20260916120000_aislamiento_por_rls).',
    );
    this.name = 'AislamientoInactivoError';
  }
}

/**
 * Cliente de Prisma, con su ciclo de vida atado al de la aplicacion.
 *
 * Es el **unico** punto del sistema que abre una conexion a PostgreSQL. Vive
 * en `infrastructure/` porque una base de datos es un detalle de
 * infraestructura: el dominio declara que necesita guardar resultados y no le
 * importa si al otro lado hay Prisma, memoria o un archivo.
 *
 * El cierre ordenado importa mas de lo que parece. Render reinicia el servicio
 * cada vez que despliega, y el plan gratuito de Supabase tiene un limite bajo
 * de conexiones: dejar conexiones colgando al apagar acaba agotandolo.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly registro = new Logger('BaseDeDatos');

  constructor(
    connectionString: string,
    /**
     * Si una conexion sin aislamiento debe impedir el arranque.
     *
     * En local se avisa y se sigue: quien desarrolla suele conectarse como
     * dueno de las tablas y obligarle a crear un rol aparte para cada prueba
     * rapida solo conseguiria que se ignorara el aviso. Fuera de local no se
     * negocia.
     */
    private readonly exigirAislamiento: boolean = false,
  ) {
    // Desde Prisma 7 la URL no viaja en el esquema: la recibe el cliente a
    // traves de un adaptador. Quien la lee del entorno es la capa de
    // configuracion, no esta clase.
    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.registro.log('Conexion establecida.');

    await this.comprobarAislamiento();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.registro.log('Conexion cerrada.');
  }

  /**
   * Ejecuta un trabajo en nombre de una persona concreta.
   *
   * Todo lo que ocurra dentro ve exactamente las filas de esa persona: la
   * base lo impone, no el codigo de la consulta. Una consulta que olvide
   * filtrar no devuelve de mas, devuelve de menos.
   *
   * El `true` de `set_config` es lo que lo hace local a la transaccion. Sin
   * el, la variable quedaria pegada a la conexion, y con un pool en modo
   * transaccion como el de Supabase la siguiente peticion heredaria la
   * identidad de la anterior. Ese fallo es de los que no se notan hasta que
   * alguien ve datos ajenos.
   */
  async comoUsuario<T>(
    userId: string,
    tarea: (cliente: ClienteConSesion) => Promise<T>,
    rol: RolDeSesion = RolDeSesion.USUARIO,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT set_config('vsd.usuario_actual', ${userId}, true), set_config('vsd.rol_actual', ${rol}, true)`;

      return tarea(tx);
    });
  }

  /**
   * Comprueba que el rol de la conexion esta realmente sujeto a las politicas.
   *
   * Row Level Security tiene una propiedad incomoda: cuando no se aplica, no
   * falla. Un superusuario, un rol con BYPASSRLS o el dueno de las tablas
   * obtienen las mismas respuestas que antes de existir las politicas, y no
   * hay forma de notar la diferencia mirando la aplicacion.
   *
   * De ahi esta comprobacion al arrancar. Es el unico momento en que la
   * pregunta "esto esta protegido?" tiene una respuesta barata.
   */
  private async comprobarAislamiento(): Promise<void> {
    const [estado] = await this.$queryRaw<
      { rol: string; privilegiado: boolean; es_dueno: boolean }[]
    >`
      SELECT current_user::text AS rol,
             COALESCE((SELECT rolsuper OR rolbypassrls
                       FROM pg_roles WHERE rolname = current_user), false) AS privilegiado,
             EXISTS (SELECT 1 FROM pg_tables
                     WHERE schemaname = 'public'
                       AND tablename = 'resultado'
                       AND tableowner = current_user) AS es_dueno
    `;

    if (estado === undefined) {
      return;
    }

    const motivo = estado.privilegiado
      ? 'es superusuario o tiene BYPASSRLS'
      : estado.es_dueno
        ? 'es el dueno de las tablas'
        : null;

    if (motivo === null) {
      this.registro.log(`Aislamiento activo: la conexion usa el rol "${estado.rol}".`);

      return;
    }

    if (this.exigirAislamiento) {
      throw new AislamientoInactivoError(estado.rol, motivo);
    }

    this.registro.warn(`El rol "${estado.rol}" ${motivo}: las politicas no se aplican.`);
    this.registro.warn('Aceptable en local. Fuera de local el servicio no arrancaria.');
  }
}
