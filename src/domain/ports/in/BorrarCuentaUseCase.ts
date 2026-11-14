import type { UserId } from '../../model/Identifier.js';

/**
 * Puerto de entrada: borrar la cuenta propia con todo lo suyo.
 *
 * Es el derecho de supresion de la Ley 1581 de 2012. El identificador sale de
 * la sesion; no hay forma de nombrar la cuenta de otra persona.
 *
 * Hay dos implementaciones, y la diferencia importa (SCRUM-190, ADR 0026):
 *
 * - `InactivarCuentaUseCaseImpl`, la que pide la persona: borra todo y deja una
 *   constancia minima de lo que acepto, que la ley obliga a poder demostrar.
 * - `BorrarCuentaUseCaseImpl`, la del rechazo de un menor: borra todo sin dejar
 *   nada, porque no hay una autorizacion valida que demostrar.
 */
export interface BorrarCuentaUseCase {
  execute(cuenta: UserId): Promise<void>;
}
