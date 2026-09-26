import type { Usuario } from '@prisma/client';
import { EmailAlreadyRegisteredError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { User } from '../../domain/model/User.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/**
 * Reconoce el fallo de unicidad sobre la columna `correo`.
 *
 * Se mira el codigo `P2002` y el campo afectado en lugar de fiarse del texto
 * del mensaje, que cambia entre versiones de Prisma. No se importa el tipo de
 * error del cliente generado: esos tipos cambian sin avisar y este archivo es
 * justo el que no debe dejarlos salir hacia el dominio.
 */
function esCorreoDuplicado(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const posible = error as { code?: unknown; meta?: { target?: unknown } };

  if (posible.code !== 'P2002') {
    return false;
  }

  const campos = posible.meta?.target;

  return Array.isArray(campos)
    ? campos.includes('correo')
    : typeof campos === 'string' && campos.includes('correo');
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
      // Se omite en lugar de mandar undefined: el modo estricto del proyecto
      // no acepta lo segundo, y omitirla deja la columna en NULL.
      ...(user.nombre === undefined ? {} : { nombre: user.nombre }),
    };

    // Guardar dos veces la misma cuenta la actualiza en lugar de fallar, que
    // es lo que promete el puerto. `fechaRegistro` no se toca al actualizar:
    // es cuando aparecio la cuenta, y eso ocurrio una sola vez.
    try {
      await this.prisma.comoUsuario(user.id.value, (cliente) =>
        cliente.usuario.upsert({
          where: { id: user.id.value },
          create: { id: user.id.value, fechaRegistro: user.registradoEn, ...datos },
          update: datos,
        }),
      );
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
        registradoEn: fila.fechaRegistro,
        ...(fila.nombre === null ? {} : { nombre: fila.nombre }),
      },
      fila.fechaAceptacionPolitica,
    );
  }
}
