import type { ActivityResult } from '../../model/ActivityResult';

/**
 * Orden de registrar el resultado de una actividad.
 *
 * Los identificadores llegan como texto plano, tal y como entran por HTTP o
 * desde la cola de sincronizacion. Convertirlos en objetos de valor y
 * validarlos es tarea del caso de uso: la frontera del dominio es el lugar
 * donde se comprueba lo que viene de fuera.
 */
export interface RegistrarResultadoCommand {
  readonly userId: string;
  readonly activityId: string;
  readonly clientOperationId: string;
  readonly score: number;
  readonly maxScore: number;
  readonly completedAt: Date;
}

/**
 * Puerto de entrada: lo que el dominio ofrece al mundo.
 *
 * La infraestructura (un controlador HTTP en el Ciclo 3) depende de esta
 * interfaz, nunca de la clase que la implementa. Asi el controlador se puede
 * probar con un doble, y la implementacion se puede cambiar sin tocar el
 * transporte.
 */
export interface RegisterActivityResultUseCase {
  /**
   * Registra el resultado y lo devuelve.
   *
   * La operacion es idempotente: si la misma operacion del cliente ya se
   * registro, devuelve el resultado existente en lugar de crear otro. Un
   * reintento tras una caida de red es seguro.
   */
  execute(command: RegistrarResultadoCommand): Promise<ActivityResult>;
}
