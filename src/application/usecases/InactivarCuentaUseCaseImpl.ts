import type { UserId } from '../../domain/model/Identifier.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { BajaDeCuenta } from '../services/BajaDeCuenta.js';

/**
 * Da de baja la cuenta propia (SCRUM-190, ADR 0026): borra todo lo suyo, la identidad en el
 * proveedor incluida, y deja una **constancia minima** de lo que acepto.
 *
 * Es el derecho de supresion (Ley 1581 de 2012) sin perder la prueba de la autorizacion, que la
 * misma ley obliga a poder demostrar. La constancia no lleva nombre, correo ni fecha de
 * nacimiento: dice que existio una cuenta, cuando y que acepto.
 *
 * ## Como se hace
 *
 * Los pasos y su orden viven en `BajaDeCuenta` (SCRUM-267, ADR 0040): una marca, lo de fuera de la
 * base sin transaccion, y las filas al final. Si algo falla despues de la marca, la baja se termina
 * sola en unos minutos.
 *
 * ## Que impide una cuenta dada de baja
 *
 * Que un token que todavia no caduco la resucite. Eso lo resuelve `estaInactivadaPorProveedor`,
 * que la guardia y el alta consultan: ver `GuardiaDeCuenta` y `RegistrarCuentaUseCaseImpl`.
 */
export class InactivarCuentaUseCaseImpl implements BorrarCuentaUseCase {
  constructor(private readonly baja: BajaDeCuenta) {}

  execute(id: UserId): Promise<void> {
    return this.baja.pedir(id, true);
  }
}
