import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * La baja de una cuenta, en tres pasos y sin esperar a la red dentro de ninguna transaccion
 * (SCRUM-267, ADR 0040). La usan quien pide la baja y la tarea que termina las que se cortaron.
 *
 * 1. **Se deja una marca** (`marcarBaja`), en una transaccion corta. Desde aqui la baja se termina
 *    si o si.
 * 2. **Se borra lo de fuera**, sin transaccion: los archivos de la persona (su foto, su mascota) y
 *    despues su identidad en el proveedor. Los dos pasos son **idempotentes**: que ya no existiera
 *    cuenta como hecho, asi que repetirlos es seguro.
 * 3. **Se borran las filas**, en una transaccion corta: con la constancia minima si la baja la pidio
 *    la persona (ADR 0026), sin ella si es el rechazo de un menor. La marca se va con la cuenta.
 *
 * El orden pone lo irreversible despues de la marca y las filas al final: si algo falla, la marca
 * se queda y `terminar` se puede repetir tal cual hasta que salga. Por eso no hay compensacion:
 * quitar la marca ante un fallo ambiguo (el proveedor si borro pero la respuesta se perdio) dejaria
 * filas sin dueno, que es justo el hueco que esto cierra.
 */
export class BajaDeCuenta {
  /**
   * @param almacenes Los almacenes de archivos de la persona: lo que vive fuera de la base y no se
   *   va con el borrado en cascada. Se borran **antes** de la identidad.
   */
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly identidades: ProveedorDeIdentidadPort,
    private readonly almacenes: readonly AlmacenPersonalPort[] = [],
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  /**
   * Lo que pide la persona (o el rechazo de un menor): deja la marca y trata de terminar.
   *
   * Pedir la baja de una cuenta que ya no existe no es un error: es el resultado que se buscaba. Si
   * algo falla se lanza `AccountDeletionFailedError`, que dice si la marca llego a quedar: con
   * marca la baja se termina sola, y volver a pedirla sigue el mismo camino.
   */
  async pedir(id: UserId, conConstancia: boolean): Promise<void> {
    let quedoPedida = false;

    try {
      quedoPedida = await this.cuentas.marcarBaja(id, conConstancia, this.reloj());

      if (quedoPedida) {
        await this.terminar(id, conConstancia);
      }
    } catch (error) {
      throw new AccountDeletionFailedError(error, quedoPedida);
    }
  }

  /**
   * Los pasos 2 y 3. Se puede repetir las veces que haga falta: lo de fuera es idempotente y, si la
   * cuenta ya no existe, no queda nada que hacer.
   *
   * No atrapa nada: quien llama decide que hacer con el fallo.
   */
  async terminar(id: UserId, conConstancia: boolean): Promise<void> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      return;
    }

    for (const almacen of this.almacenes) {
      await almacen.borrar(id);
    }

    await this.identidades.borrarIdentidad(cuenta.idProveedorAuth);

    if (conConstancia) {
      await this.cuentas.inactivarConTodo(id, this.reloj());
    } else {
      await this.cuentas.borrarConTodo(id);
    }
  }
}
