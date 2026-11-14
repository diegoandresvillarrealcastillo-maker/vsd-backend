import type { UserId } from '../../domain/model/Identifier.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { BajaDeCuenta } from '../services/BajaDeCuenta.js';

/**
 * Borra la cuenta propia sin dejar constancia: los datos en nuestra base, los archivos de la
 * persona y la identidad en el proveedor. Es lo que se hace con el rechazo de un menor, que no
 * tiene una autorizacion valida que demostrar (ADR 0026).
 *
 * Los pasos y su orden viven en `BajaDeCuenta` (SCRUM-267, ADR 0040): una marca, lo de fuera de la
 * base sin transaccion y las filas al final. Lo irreversible va despues de la marca, y si algo
 * falla la baja se termina sola: ya no queda el hueco de una identidad borrada con las filas en
 * pie y nadie que las limpie.
 */
export class BorrarCuentaUseCaseImpl implements BorrarCuentaUseCase {
  constructor(private readonly baja: BajaDeCuenta) {}

  execute(id: UserId): Promise<void> {
    return this.baja.pedir(id, false);
  }
}
