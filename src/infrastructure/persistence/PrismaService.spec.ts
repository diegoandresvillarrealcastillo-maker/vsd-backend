import { describe, expect, it, vi } from 'vitest';
import { AislamientoInactivoError, PrismaService } from './PrismaService.js';

/**
 * El ciclo de vida de la conexion, y la comprobacion de que las politicas de
 * la base se aplican de verdad.
 *
 * Render reinicia el servicio en cada despliegue y el plan gratuito de
 * Supabase tiene un limite bajo de conexiones. Unas cuantas conexiones
 * huerfanas lo agotan, y el sintoma no se parece en nada a la causa: la
 * aplicacion empieza a fallar al conectar sin que nadie haya tocado nada.
 *
 * Lo que se comprueba aqui es que los ganchos hagan su trabajo. Que el sistema
 * operativo entregue la senal al proceso es cosa de Node y de NestJS, y en
 * Windows no se puede simular de forma fiable: `kill('SIGINT')` termina el
 * proceso de golpe en lugar de entregarle nada.
 *
 * Las politicas contra PostgreSQL real se prueban en `aislamiento.spec.ts`.
 * Aqui solo se prueba la reaccion del servicio a lo que la base le responde.
 */
describe('PrismaService', () => {
  const URL_FICTICIA = 'postgresql://x:y@localhost:1/db';

  /** Lo que devuelve la comprobacion de aislamiento para un rol dado. */
  function respuestaDeAislamiento(estado: {
    rol?: string;
    privilegiado?: boolean;
    es_dueno?: boolean;
  }) {
    return [
      {
        rol: estado.rol ?? 'vsd_app',
        privilegiado: estado.privilegiado ?? false,
        es_dueno: estado.es_dueno ?? false,
      },
    ];
  }

  function servicioCon(
    estado: Parameters<typeof respuestaDeAislamiento>[0],
    exigirAislamiento = false,
  ): PrismaService {
    const servicio = new PrismaService(URL_FICTICIA, exigirAislamiento);

    vi.spyOn(servicio, '$connect').mockResolvedValue(undefined);
    vi.spyOn(servicio, '$queryRaw').mockResolvedValue(respuestaDeAislamiento(estado));

    return servicio;
  }

  it('se conecta al iniciarse el modulo', async () => {
    const servicio = new PrismaService(URL_FICTICIA);
    const conectar = vi.spyOn(servicio, '$connect').mockResolvedValue(undefined);

    vi.spyOn(servicio, '$queryRaw').mockResolvedValue(respuestaDeAislamiento({}));

    await servicio.onModuleInit();

    expect(conectar).toHaveBeenCalledOnce();
  });

  it('cierra la conexion al destruirse el modulo', async () => {
    const servicio = new PrismaService(URL_FICTICIA);
    const desconectar = vi.spyOn(servicio, '$disconnect').mockResolvedValue(undefined);

    await servicio.onModuleDestroy();

    expect(desconectar).toHaveBeenCalledOnce();
  });

  it('no abre la conexion solo por construirse', () => {
    // Importa porque el cableado crea el servicio al levantar el modulo. Si
    // conectara en el constructor, cualquier prueba que arme el contenedor
    // abriria una conexion sin pedirla.
    const conectar = vi.spyOn(PrismaService.prototype, '$connect').mockResolvedValue(undefined);

    new PrismaService(URL_FICTICIA);

    expect(conectar).not.toHaveBeenCalled();
    conectar.mockRestore();
  });

  describe('comprobacion de aislamiento', () => {
    it('arranca cuando el rol esta sujeto a las politicas', async () => {
      await expect(servicioCon({ rol: 'vsd_app' }).onModuleInit()).resolves.toBeUndefined();
    });

    it.each([
      ['es superusuario o tiene BYPASSRLS', { privilegiado: true }],
      ['es dueno de las tablas', { es_dueno: true }],
    ])('fuera de desarrollo no arranca si el rol %s', async (_caso, estado) => {
      // Este es el fallo que el Row Level Security no sabe avisar por su
      // cuenta: cuando no se aplica, no falla. Todo responde igual que antes
      // de existir las politicas, y no hay forma de notarlo mirando la API.
      await expect(servicioCon(estado, true).onModuleInit()).rejects.toThrow(
        AislamientoInactivoError,
      );
    });

    it('en desarrollo avisa pero deja seguir', async () => {
      // Quien desarrolla se conecta como dueno de las tablas casi siempre.
      // Obligarle a crear un rol aparte para cada prueba rapida solo
      // conseguiria que el aviso se ignorara.
      await expect(servicioCon({ es_dueno: true }, false).onModuleInit()).resolves.toBeUndefined();
    });

    it('el error dice con que rol se conecto y que hacer', async () => {
      const servicio = servicioCon({ rol: 'postgres', privilegiado: true }, true);

      await expect(servicio.onModuleInit()).rejects.toThrow(/postgres[\s\S]*vsd_app/);
    });
  });

  describe('comoUsuario', () => {
    it('fija la identidad dentro de la transaccion antes de ejecutar nada', async () => {
      const servicio = new PrismaService(URL_FICTICIA);
      const consultas: unknown[] = [];
      const clienteFalso = {
        $queryRaw: (...argumentos: unknown[]) => {
          consultas.push(argumentos);

          return Promise.resolve([]);
        },
      };

      vi.spyOn(servicio, '$transaction').mockImplementation(
        // El tipo real de $transaction cubre tambien la forma por lotes; aqui
        // solo interesa la interactiva, que es la unica que usa comoUsuario.
        (async (tarea: (tx: unknown) => Promise<unknown>) =>
          tarea(clienteFalso)) as unknown as PrismaService['$transaction'],
      );

      const resultado = await servicio.comoUsuario('11111111-1111-4111-8111-111111111111', () =>
        Promise.resolve('hecho'),
      );

      expect(resultado).toBe('hecho');
      expect(consultas).toHaveLength(1);
      expect(JSON.stringify(consultas)).toContain('set_config');
      // El tercer argumento de set_config en true es lo que ata la variable a
      // la transaccion. Sin el se quedaria pegada a la conexion, y con un pool
      // en modo transaccion la siguiente peticion heredaria esta identidad.
      expect(JSON.stringify(consultas)).toContain('vsd.usuario_actual');
    });

    it('usa el rol usuario si no se pide otro', async () => {
      const servicio = new PrismaService(URL_FICTICIA);
      const valores: unknown[] = [];

      vi.spyOn(servicio, '$transaction').mockImplementation((async (
        tarea: (tx: unknown) => Promise<unknown>,
      ) =>
        tarea({
          $queryRaw: (_plantilla: unknown, ...resto: unknown[]) => {
            valores.push(...resto);

            return Promise.resolve([]);
          },
        })) as unknown as PrismaService['$transaction']);

      await servicio.comoUsuario('11111111-1111-4111-8111-111111111111', () =>
        Promise.resolve(null),
      );

      expect(valores).toContain('usuario');
      expect(valores).not.toContain('administrador');
    });
  });
});
