import type { UserId } from '../../model/Identifier.js';
import type { CambiosDePreferencias, User } from '../../model/User.js';

/**
 * Puerto de entrada: cambiar las preferencias de la cuenta propia.
 *
 * Recibe el identificador de la cuenta, que el controlador saca de la sesion y
 * nunca del cuerpo. No hay forma de nombrar la cuenta de otra persona.
 */
export interface ActualizarPreferenciasUseCase {
  /** Aplica los cambios, los guarda y devuelve la cuenta como quedo. */
  execute(cuenta: UserId, cambios: CambiosDePreferencias): Promise<User>;
}
