import type { UserId } from '../../model/Identifier.js';
import type { Racha } from '../../model/Racha.js';

/**
 * Puerto de entrada: la racha de la cuenta propia (SCRUM-186).
 *
 * El identificador sale de la sesion. Se calcula a partir de los resultados, en el
 * calendario de la zona de la persona: no hay nada guardado aparte.
 */
export interface ConsultarRachaUseCase {
  execute(cuenta: UserId): Promise<Racha>;
}
