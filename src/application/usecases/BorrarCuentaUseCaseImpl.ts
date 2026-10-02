import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Borra la cuenta propia: los datos en nuestra base y la identidad en el
 * proveedor, las dos cosas o ninguna.
 *
 * El orden importa. Primero se borran las filas sin confirmar; con eso hecho
 * se borra la identidad; y solo si eso sale bien se confirma. Si el proveedor
 * falla, las filas vuelven y la persona puede intentarlo otra vez.
 *
 * Queda un hueco que no se puede cerrar del todo: que la base falle al
 * confirmar justo despues de que el proveedor ya borro. Es mucho menos
 * probable que un fallo de red, que es el caso que este orden cubre. Si
 * ocurre, la persona ya no puede entrar y sus filas quedan sin dueno: el
 * error se registra para limpiarlas a mano.
 */
export class BorrarCuentaUseCaseImpl implements BorrarCuentaUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly identidades: ProveedorDeIdentidadPort,
  ) {}

  async execute(id: UserId): Promise<void> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      // Ya no existe: el resultado que se buscaba.
      return;
    }

    try {
      await this.cuentas.borrarConTodo(id, () =>
        this.identidades.borrarIdentidad(cuenta.idProveedorAuth),
      );
    } catch (error) {
      throw new AccountDeletionFailedError(error);
    }
  }
}
