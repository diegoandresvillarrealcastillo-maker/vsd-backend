import { Prisma, type Usuario } from '@prisma/client';
import { EmailAlreadyRegisteredError } from '../../domain/model/DomainError.js';
import { FechaDeNacimiento } from '../../domain/model/FechaDeNacimiento.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { Mascota } from '../../domain/model/Preferencias.js';
import {
  TipoDeConsentimiento,
  User,
  type ConsentimientoAceptado,
} from '../../domain/model/User.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/**
 * Reconoce el fallo de unicidad sobre la columna `correo`.
 *
 * Se mira el codigo `P2002` y el campo afectado en lugar de fiarse del texto
 * del mensaje, que cambia entre versiones de Prisma. No se importa el tipo de
 * error del cliente generado: esos tipos cambian sin avisar y este archivo es
 * justo el que no debe dejarlos salir hacia el dominio.
 *
 * Con el adaptador de PostgreSQL de Prisma 7 no llega `meta.target`: el
 * nombre del indice (`usuario_correo_key`) viene dentro de
 * `meta.driverAdapterError`. Se busca en toda la `meta` para que valga con las
 * dos formas (SCRUM-105). Sin esto, un correo repetido salia como un 500.
 */
function esCorreoDuplicado(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const posible = error as { code?: unknown; meta?: unknown };

  return posible.code === 'P2002' && /correo/i.test(JSON.stringify(posible.meta ?? {}));
}

/**
 * Lee la mascota guardada en JSONB.
 *
 * Solo copia los campos que el dominio conoce, como texto. Si a la columna
 * llegara otra cosa, `User.create` la rechaza con un error que dice que esta
 * mal, en lugar de que salga por la API algo a medias. Color y accesorio son
 * opcionales: solo se copian si estan guardados.
 */
function mascotaDesde(valor: Prisma.JsonValue): Mascota {
  const objeto =
    typeof valor === 'object' && valor !== null && !Array.isArray(valor)
      ? (valor as Record<string, unknown>)
      : {};
  const texto = (clave: string): string => {
    const campo = objeto[clave];

    return typeof campo === 'string' ? campo : '';
  };
  const opcional = (clave: 'color' | 'accesorio') =>
    objeto[clave] === undefined ? {} : { [clave]: texto(clave) };

  return {
    forma: texto('forma'),
    nombre: texto('nombre'),
    ...opcional('color'),
    ...opcional('accesorio'),
  };
}

/**
 * Adaptador de cuentas contra PostgreSQL.
 *
 * Como los demas adaptadores, traduce entre la fila y la entidad y no deja
 * salir de este archivo ni un tipo generado por Prisma: si uno se filtrara a
 * traves de una firma, el dominio pasaria a depender de la base de datos.
 *
 * ## Las dos sesiones
 *
 * Cada metodo abre la sesion que le corresponde, y no son la misma.
 *
 * `findById` y `save` saben nuestro identificador, asi que usan
 * `comoUsuario()` como todo el resto del sistema.
 *
 * `findByIdProveedorAuth` no lo sabe —es justo lo que esta buscando— y por eso
 * usa `comoProveedor()`, que abre una sesion en la que solo se puede leer la
 * fila cuyo `id_proveedor_auth` coincide con el del token. Ver la migracion
 * 20260924120000_leer_la_cuenta_propia_por_proveedor.
 */
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: UserId): Promise<User | null> {
    const fila = await this.prisma.comoUsuario(id.value, (cliente) =>
      cliente.usuario.findUnique({ where: { id: id.value } }),
    );

    return fila === null ? null : this.aDominio(fila);
  }

  async findByIdProveedorAuth(idProveedorAuth: string): Promise<User | null> {
    const fila = await this.prisma.comoProveedor(idProveedorAuth, (cliente) =>
      cliente.usuario.findUnique({ where: { idProveedorAuth } }),
    );

    return fila === null ? null : this.aDominio(fila);
  }

  async save(user: User): Promise<void> {
    const consentimiento = user.consentimiento;

    if (consentimiento === undefined) {
      // La tabla declara las dos columnas del consentimiento como NOT NULL, y
      // la Ley 1581 de 2012 es la razon: sin autorizacion registrada no hay
      // base legal para guardar nada de esta persona.
      //
      // El dominio permite construir un `User` sin consentimiento porque hay
      // un momento, durante el alta, en que la cuenta existe y todavia no se
      // ha aceptado nada. Lo que no puede es llegar a la base asi. Se para
      // aqui, con un mensaje que dice por que, en lugar de dejar que
      // PostgreSQL responda con una violacion de NOT NULL que no explica nada.
      throw new Error(
        'No se puede guardar una cuenta sin consentimiento registrado. ' +
          'Ver User.exigirConsentimiento() y la Ley 1581 de 2012.',
      );
    }

    const datos = {
      correo: user.correo,
      idProveedorAuth: user.idProveedorAuth,
      rol: user.rol,
      versionPoliticaAceptada: consentimiento.versionPolitica,
      fechaAceptacionPolitica: consentimiento.aceptadoEn,
      // Null y no omitidas: igual que la foto, guardar la cuenta tiene que dejar
      // estas columnas como la entidad las trae. La fecha es un dia y no un
      // instante: se escribe a medianoche UTC para que la columna DATE guarde
      // el mismo dia en cualquier zona del servidor.
      fechaNacimiento:
        user.fechaDeNacimiento === undefined
          ? null
          : new Date(`${user.fechaDeNacimiento.valor}T00:00:00.000Z`),
      versionTerminosAceptada: user.terminos?.versionPolitica ?? null,
      fechaAceptacionTerminos: user.terminos?.aceptadoEn ?? null,
      // Se omite en lugar de mandar undefined: el modo estricto del proyecto
      // no acepta lo segundo, y omitirla deja la columna en NULL.
      ...(user.nombre === undefined ? {} : { nombre: user.nombre }),
      modulosActivos: [...user.modulosActivos],
      // DbNull y no undefined: undefined le diria a Prisma "no toques la
      // columna", y quien no tiene mascota guardada debe quedar en NULL.
      mascota: user.mascota === undefined ? Prisma.DbNull : { ...user.mascota },
      diarioConRecomendaciones: user.diarioConRecomendaciones,
      zonaHoraria: user.zonaHoraria,
      // Null y no omitida: al quitar la foto, el UPDATE tiene que dejar la
      // columna vacia y no como estaba.
      fotoActualizadaEl: user.fotoActualizadaEl ?? null,
      mascotaPropiaActualizadaEl: user.mascotaPropiaActualizadaEl ?? null,
    };

    // Guardar dos veces la misma cuenta la actualiza en lugar de fallar, que
    // es lo que promete el puerto. `fechaRegistro` no se toca al actualizar:
    // es cuando aparecio la cuenta, y eso ocurrio una sola vez.
    try {
      await this.prisma.comoUsuario(user.id.value, async (cliente) => {
        await cliente.usuario.upsert({
          where: { id: user.id.value },
          create: { id: user.id.value, fechaRegistro: user.registradoEn, ...datos },
          update: datos,
        });

        // Lo aceptado pasa al historial en la misma transaccion que la cuenta:
        // o quedan las dos cosas o ninguna. `skipDuplicates` hace que guardar la
        // cuenta por otro motivo (cambiar el nombre, la zona) no repita lo que ya
        // esta; solo entra la version que todavia no estaba. Nunca se actualiza
        // ni se borra una fila: la aplicacion ni siquiera tiene permiso.
        const aceptados = [
          { tipo: TipoDeConsentimiento.AVISO_DE_PRIVACIDAD, aceptado: consentimiento },
          ...(user.terminos === undefined
            ? []
            : [{ tipo: TipoDeConsentimiento.TERMINOS, aceptado: user.terminos }]),
        ];

        await cliente.consentimiento.createMany({
          data: aceptados.map(({ tipo, aceptado }) => ({
            idUsuario: user.id.value,
            tipo,
            version: aceptado.versionPolitica,
            aceptadoEn: aceptado.aceptadoEn,
          })),
          skipDuplicates: true,
        });
      });
    } catch (error) {
      if (esCorreoDuplicado(error)) {
        // Alguien se registro con correo y ahora entra con Google, o al reves,
        // y el proveedor entrega un identificador distinto para la misma
        // persona.
        //
        // No se comprueba antes de intentarlo, y no por descuido: con el
        // aislamiento activo no se puede preguntar si **otra** persona tiene
        // ese correo sin poder leer filas ajenas, que es justo lo que las
        // politicas impiden. La unicidad la hace cumplir la base; aqui solo se
        // traduce a algo que se entienda.
        throw new EmailAlreadyRegisteredError();
      }

      throw error;
    }
  }

  async consentimientosDe(id: UserId): Promise<readonly ConsentimientoAceptado[]> {
    const filas = await this.prisma.comoUsuario(id.value, (cliente) =>
      cliente.consentimiento.findMany({
        where: { idUsuario: id.value },
        orderBy: [{ aceptadoEn: 'asc' }, { tipo: 'asc' }],
      }),
    );

    return filas.map((fila) => ({
      // La base solo admite los dos tipos (CHECK), asi que la conversion no
      // oculta nada.
      tipo: fila.tipo as TipoDeConsentimiento,
      version: fila.version,
      aceptadoEn: fila.aceptadoEn,
    }));
  }

  /**
   * Borra la fila de `usuario` dentro de una transaccion y deja que las claves
   * foraneas con `ON DELETE CASCADE` se lleven el resto: resultados y entradas
   * de diario. Toda tabla nueva que guarde algo de una persona tiene que
   * declarar su clave igual; la prueba de integracion lo comprueba recorriendo
   * cada tabla con columna `id_usuario`, no una lista escrita a mano.
   *
   * `antesDeConfirmar` corre dentro de la transaccion: si lanza, PostgreSQL
   * deshace el borrado.
   */
  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await this.prisma.comoUsuario(id.value, async (cliente) => {
      await cliente.usuario.deleteMany({ where: { id: id.value } });
      await antesDeConfirmar();
    });
  }

  /**
   * Reconstruye la entidad a partir de la fila.
   *
   * La fecha de aceptacion se pasa como referencia de "ahora" igual que hace
   * el adaptador de resultados con la suya. El dominio rechaza un
   * consentimiento fechado en el futuro, y sin esto un reloj de servidor
   * atrasado convertiria una fila perfectamente valida en un error al leerla.
   * Esa comprobacion existe para lo que entra, no para lo que ya estaba.
   */
  private aDominio(fila: Usuario): User {
    return User.create(
      {
        id: new UserId(fila.id),
        correo: fila.correo,
        idProveedorAuth: fila.idProveedorAuth,
        // Sin conversion: el enum `rol` de la base y el del dominio tienen los
        // mismos valores a proposito, y TypeScript lo comprueba. El dia que
        // alguien anada un rol en un sitio y no en el otro, esto deja de
        // compilar, que es exactamente cuando conviene enterarse.
        rol: fila.rol,
        consentimiento: {
          versionPolitica: fila.versionPoliticaAceptada,
          aceptadoEn: fila.fechaAceptacionPolitica,
        },
        ...(fila.versionTerminosAceptada === null || fila.fechaAceptacionTerminos === null
          ? {}
          : {
              terminos: {
                versionPolitica: fila.versionTerminosAceptada,
                aceptadoEn: fila.fechaAceptacionTerminos,
              },
            }),
        // `restaurar` y no `crear`: es una fecha que ya paso la prueba de la
        // mayoria de edad al entrar, y no se vuelve a juzgar al leerla.
        ...(fila.fechaNacimiento === null
          ? {}
          : {
              fechaDeNacimiento: FechaDeNacimiento.restaurar(
                fila.fechaNacimiento.toISOString().slice(0, 10),
              ),
            }),
        registradoEn: fila.fechaRegistro,
        ...(fila.nombre === null ? {} : { nombre: fila.nombre }),
        modulosActivos: fila.modulosActivos,
        ...(fila.mascota === null ? {} : { mascota: mascotaDesde(fila.mascota) }),
        diarioConRecomendaciones: fila.diarioConRecomendaciones,
        zonaHoraria: fila.zonaHoraria,
        ...(fila.fotoActualizadaEl === null ? {} : { fotoActualizadaEl: fila.fotoActualizadaEl }),
        ...(fila.mascotaPropiaActualizadaEl === null
          ? {}
          : { mascotaPropiaActualizadaEl: fila.mascotaPropiaActualizadaEl }),
      },
      fila.fechaAceptacionPolitica,
    );
  }
}
