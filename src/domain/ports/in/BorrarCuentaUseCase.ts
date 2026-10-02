import type { UserId } from '../../model/Identifier.js';

/**
 * Puerto de entrada: borrar la cuenta propia con todo lo suyo.
 *
 * Es el derecho de supresion de la Ley 1581 de 2012. El identificador sale de
 * la sesion; no hay forma de nombrar la cuenta de otra persona.
 */
export interface BorrarCuentaUseCase {
  execute(cuenta: UserId): Promise<void>;
}
