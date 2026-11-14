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

    // Solo se escribe lo que cambio, y se devuelve lo que quedo guardado: una peticion que cambia el
    // nombre no puede encender de nuevo un permiso que otra acababa de apagar (SCRUM-258).
    const quedo = await this.cuentas.guardarCambios(cuenta, cuenta.conPreferencias(cambios));

    if (quedo === null) {
      throw new AccountNotProvisionedError();
    }

    return quedo;
  }
}
