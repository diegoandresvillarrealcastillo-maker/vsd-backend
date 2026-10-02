import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { CambiosDePreferencias, User } from '../../domain/model/User.js';
import type { ActualizarPreferenciasUseCase } from '../../domain/ports/in/ActualizarPreferenciasUseCase.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Cambia los modulos activos y la mascota de la cuenta propia.
 *
 * Las reglas —al menos un modulo, solo los tres que existen, una mascota bien
 * formada— viven en `User.conPreferencias`. Este caso de uso solo busca la
 * cuenta, aplica y guarda.
 */
export class ActualizarPreferenciasUseCaseImpl implements ActualizarPreferenciasUseCase {
  constructor(private readonly cuentas: UserRepositoryPort) {}

  async execute(id: UserId, cambios: CambiosDePreferencias): Promise<User> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      // El guardia ya exige cuenta para llegar aqui, asi que esto solo pasa si
      // se borro entre una cosa y otra.
      throw new AccountNotProvisionedError();
    }

    const actualizada = cuenta.conPreferencias(cambios);

    await this.cuentas.save(actualizada);

    return actualizada;
  }
}
