import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Borra la cuenta propia: los datos en nuestra base y la identidad en el
 * proveedor, las dos cosas o ninguna.
 *
 * El orden importa. Primero se borran las filas sin confirmar; despues los
 * archivos de la persona (SCRUM-120); con eso hecho se borra la identidad; y
 * solo si todo sale bien se confirma. Si el proveedor falla, las filas vuelven
 * y la persona puede intentarlo otra vez. Lo irreversible va al final: un
 * archivo que ya no esta es mucho menos grave que una identidad borrada con
 * las filas todavia en pie.
 *
 * Queda un hueco que no se puede cerrar del todo: que la base falle al
 * confirmar justo despues de que el proveedor ya borro. Es mucho menos
 * probable que un fallo de red, que es el caso que este orden cubre. Si
 * ocurre, la persona ya no puede entrar y sus filas quedan sin dueno: el
 * error se registra para limpiarlas a mano.
 */
export class BorrarCuentaUseCaseImpl implements BorrarCuentaUseCase {
  /**
   * @param almacenes Los almacenes de archivos de la persona (su foto, su
   *   mascota propia): lo que vive fuera de la base y no se va con el
   *   `ON DELETE CASCADE`. Se borran **antes** de la identidad, para que si
   *   alguno falla no se haya perdido nada irrecuperable.
   */
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly identidades: ProveedorDeIdentidadPort,
    private readonly almacenes: readonly AlmacenPersonalPort[] = [],
  ) {}

  async execute(id: UserId): Promise<void> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      // Ya no existe: el resultado que se buscaba.
      return;
    }

    try {
      await this.cuentas.borrarConTodo(id, async () => {
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
