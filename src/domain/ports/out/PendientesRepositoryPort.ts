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

  /**
   * Guarda una edicion, solo si el pendiente sigue en `versionAnterior`.
   *
   * La comparacion la hace la propia base dentro del UPDATE y no el codigo que
   * llama: dos ediciones que lleguen a la vez no se pisan, una gana y la otra
   * recibe `null` (SCRUM-134).
   *
   * `null` no dice por que (ya no existe, o lo cambio otro dispositivo): quien
   * llama vuelve a leer y lo averigua.
   */
  actualizar(pendiente: Pendiente, versionAnterior: number): Promise<Pendiente | null>;

  /** `false` si no habia nada que borrar. */
  borrar(userId: UserId, id: PendienteId): Promise<boolean>;
}
