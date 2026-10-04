import type { ClientOperationId, PendienteId, UserId } from '../../model/Identifier.js';
import type { Pendiente } from '../../model/Pendiente.js';

/**
 * Puerto de salida del semaforo de pendientes (SCRUM-97).
 *
 * Todo en nombre de una persona: no hay forma de alcanzar los pendientes de
 * otra, ni conociendo su identificador.
 */
export interface PendientesRepositoryPort {
  /** Los sin hacer, y los hechos desde `hechosDesde`. */
  vigentesDe(userId: UserId, hechosDesde: Date): Promise<readonly Pendiente[]>;

  /** Todos, para la exportacion de datos. */
  todosDe(userId: UserId): Promise<readonly Pendiente[]>;

  porId(userId: UserId, id: PendienteId): Promise<Pendiente | null>;

  porOperacion(userId: UserId, clientOperationId: ClientOperationId): Promise<Pendiente | null>;

  /** Guarda uno nuevo y devuelve lo guardado. */
  guardarNuevo(pendiente: Pendiente): Promise<Pendiente>;

  /** Guarda una edicion. `null` si ya no existe. */
  actualizar(pendiente: Pendiente): Promise<Pendiente | null>;

  /** `false` si no habia nada que borrar. */
  borrar(userId: UserId, id: PendienteId): Promise<boolean>;
}
