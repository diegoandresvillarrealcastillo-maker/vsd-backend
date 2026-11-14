import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
} from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Lo que comparten la foto de perfil (`FotoDePerfilUseCaseImpl`) y la mascota propia
 * (`MascotaPropiaUseCaseImpl`): un archivo en el almacenamiento y una marca en la cuenta.
 *
 * Cada una decide que archivo guarda y que marca pone; aqui solo esta lo que no cambia entre las
 * dos.
 */

/** La cuenta de la persona, o el error de que todavia no tiene. */
export async function cuentaDe(cuentas: UserRepositoryPort, persona: UserId): Promise<User> {
  const cuenta = await cuentas.findById(persona);

  if (cuenta === null) {
    throw new AccountNotProvisionedError();
  }

  return cuenta;
}

/** El almacenamiento es de fuera: si falla, se cuenta como lo que es y sin su detalle. */
export async function conAlmacen<T>(accion: () => Promise<T>): Promise<T> {
  try {
    return await accion();
  } catch (error) {
    throw new FileStorageUnavailableError(error);
  }
}

/** Guarda la cuenta con su marca nueva; si la cuenta ya no esta, es el error de que no tiene. */
export async function guardarLaMarca(
  cuentas: UserRepositoryPort,
  cuenta: User,
  conLaMarca: User,
): Promise<User> {
  const quedo = await cuentas.guardarCambios(cuenta, conLaMarca);

  if (quedo === null) {
    throw new AccountNotProvisionedError();
  }

  return quedo;
}
