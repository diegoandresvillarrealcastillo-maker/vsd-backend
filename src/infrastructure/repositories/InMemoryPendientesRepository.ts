import type { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import type { Pendiente } from '../../domain/model/Pendiente.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';

/** El semaforo en memoria, para el arranque sin base de datos. */
export class InMemoryPendientesRepository implements PendientesRepositoryPort {
  private pendientes: Pendiente[] = [];

  vigentesDe(userId: UserId, hechosDesde: Date): Promise<readonly Pendiente[]> {
    return Promise.resolve(
      this.de(userId).filter(
        (pendiente) => !pendiente.hecho || pendiente.editadoEn.getTime() >= hechosDesde.getTime(),
      ),
    );
  }

  todosDe(userId: UserId): Promise<readonly Pendiente[]> {
    return Promise.resolve(this.de(userId));
  }

  porId(userId: UserId, id: PendienteId): Promise<Pendiente | null> {
    return Promise.resolve(this.de(userId).find((pendiente) => pendiente.id.equals(id)) ?? null);
  }

  porOperacion(userId: UserId, operacion: ClientOperationId): Promise<Pendiente | null> {
    return Promise.resolve(
      this.de(userId).find((pendiente) => pendiente.clientOperationId.equals(operacion)) ?? null,
    );
  }

  async guardarNuevo(pendiente: Pendiente): Promise<Pendiente> {
    const existente = await this.porOperacion(pendiente.userId, pendiente.clientOperationId);

    if (existente !== null) {
      return existente;
    }

    this.pendientes.push(pendiente);

    return pendiente;
  }

  actualizar(pendiente: Pendiente, versionAnterior: number): Promise<Pendiente | null> {
    const posicion = this.pendientes.findIndex(
      (uno) =>
        uno.id.equals(pendiente.id) &&
        uno.perteneceA(pendiente.userId) &&
        uno.version === versionAnterior,
    );

    if (posicion === -1) {
      return Promise.resolve(null);
    }

    this.pendientes[posicion] = pendiente;

    return Promise.resolve(pendiente);
  }

  borrar(userId: UserId, id: PendienteId): Promise<boolean> {
    const antes = this.pendientes.length;

    this.pendientes = this.pendientes.filter(
      (pendiente) => !(pendiente.id.equals(id) && pendiente.perteneceA(userId)),
    );

    return Promise.resolve(this.pendientes.length < antes);
  }

  private de(userId: UserId): Pendiente[] {
    return this.pendientes.filter((pendiente) => pendiente.perteneceA(userId));
  }
}
