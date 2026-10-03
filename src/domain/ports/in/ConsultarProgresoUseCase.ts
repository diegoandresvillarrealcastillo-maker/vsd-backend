import type { UserId } from '../../model/Identifier.js';
import type { ProgresoDelModulo } from '../../model/Sendero.js';

/**
 * Puerto de entrada: el sendero de cada modulo activo de la cuenta propia.
 *
 * El identificador sale de la sesion. Solo devuelve los modulos que esa
 * persona tiene activos, en el orden en que se muestran.
 */
export interface ConsultarProgresoUseCase {
  execute(cuenta: UserId): Promise<readonly ProgresoDelModulo[]>;
}
