import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Da de baja la cuenta propia (SCRUM-190, ADR 0026): borra todo lo suyo, la identidad en el
 * proveedor incluida, y deja una **constancia mínima** de lo que aceptó.
 *
 * Es el derecho de supresión (Ley 1581 de 2012) sin perder la prueba de la autorización, que la
 * misma ley obliga a poder demostrar. La constancia no lleva nombre, correo ni fecha de
 * nacimiento: dice que existió una cuenta, cuándo y qué aceptó.
 *
 * ## El orden importa
 *
 * Igual que al borrar: primero el repositorio hace la baja sin confirmar; dentro de ella se
 * borran los archivos de la persona (su foto, su mascota propia) y después la identidad; y solo
 * si todo sale bien se confirma. Si el proveedor falla, la baja se deshace y la persona puede
 * intentarlo otra vez. Lo irreversible va al final: un archivo que ya no está es mucho menos
 * grave que una identidad borrada con las filas todavía en pie.
 *
 * ## Qué impide una cuenta dada de baja
 *
 * Que un token que todavía no caducó la resucite. Eso lo resuelve `estaInactivadaPorProveedor`,
 * que la guardia y el alta consultan: ver `GuardiaDeCuenta` y `RegistrarCuentaUseCaseImpl`.
 */
export class InactivarCuentaUseCaseImpl implements BorrarCuentaUseCase {
  /**
   * @param almacenes Los almacenes de archivos de la persona: lo que vive fuera de la base y no
   *   se va con el borrado en cascada. Se borran **antes** de la identidad.
   */
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly identidades: ProveedorDeIdentidadPort,
    private readonly almacenes: readonly AlmacenPersonalPort[] = [],
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId): Promise<void> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      // Ya no existe: el resultado que se buscaba.
      return;
    }

    try {
      await this.cuentas.inactivarConTodo(id, this.reloj(), async () => {
        for (const almacen of this.almacenes) {
          await almacen.borrar(id);
        }

        await this.identidades.borrarIdentidad(cuenta.idProveedorAuth);
      });
    } catch (error) {
      throw new AccountDeletionFailedError(error);
    }
  }
}
