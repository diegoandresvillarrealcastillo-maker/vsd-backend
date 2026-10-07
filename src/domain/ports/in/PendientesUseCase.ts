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
  /** AAAA-MM-DD, en el calendario de la persona. Opcional: sin ella no vence un dia concreto. */
  readonly fechaLimite?: string | undefined;
}

export interface EditarPendienteCommand {
  readonly userId: string;
  readonly pendienteId: string;
  /**
   * La version que el dispositivo tenia del pendiente (SCRUM-134). Si ya no es
   * la vigente, la edicion se rechaza salvo que solo lo marque como hecho o que
   * el pendiente ya este como se pide. Sin ella no se comprueba nada: asi
   * funcionan los dispositivos anteriores a este cambio.
   */
  readonly version?: number | undefined;
  readonly texto?: string | undefined;
  readonly nivel?: string | undefined;
  readonly hecho?: boolean | undefined;
  /** `null` deja de posponer. */
  readonly posponerHasta?: Date | null | undefined;
  /** AAAA-MM-DD. `null` quita la fecha limite. */
  readonly fechaLimite?: string | null | undefined;
}

export interface PendientesUseCase {
  /**
   * `zonaHoraria` es la de la cuenta: con fecha limite, "hoy" decide si ya
   * llego el dia.
   */
  consultar(userId: string, zonaHoraria: string): Promise<SemaforoDePendientes>;
  crear(command: CrearPendienteCommand): Promise<Pendiente>;
  editar(command: EditarPendienteCommand): Promise<Pendiente>;
  borrar(userId: string, pendienteId: string): Promise<void>;
}
