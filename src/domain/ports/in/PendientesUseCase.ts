import type { Pendiente, Recordatorio } from '../../model/Pendiente.js';

/**
 * Puerto de entrada del semaforo de pendientes (SCRUM-97).
 *
 * Las cuatro operaciones van juntas, como el asistente: son la misma cosa
 * vista desde cuatro verbos, y separarlas en cuatro puertos solo multiplicaria
 * el cableado.
 */
export interface SemaforoDePendientes {
  readonly pendientes: readonly Pendiente[];
  /** Uno como mucho por visita. */
  readonly recordatorio: Recordatorio | null;
}

export interface CrearPendienteCommand {
  readonly userId: string;
  readonly clientOperationId: string;
  readonly texto: string;
  readonly nivel: string;
}

export interface EditarPendienteCommand {
  readonly userId: string;
  readonly pendienteId: string;
  readonly texto?: string | undefined;
  readonly nivel?: string | undefined;
  readonly hecho?: boolean | undefined;
  /** `null` deja de posponer. */
  readonly posponerHasta?: Date | null | undefined;
}

export interface PendientesUseCase {
  consultar(userId: string): Promise<SemaforoDePendientes>;
  crear(command: CrearPendienteCommand): Promise<Pendiente>;
  editar(command: EditarPendienteCommand): Promise<Pendiente>;
  borrar(userId: string, pendienteId: string): Promise<void>;
}
