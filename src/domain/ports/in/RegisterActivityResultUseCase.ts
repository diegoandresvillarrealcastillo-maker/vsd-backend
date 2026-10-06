import type { ActivityResult, Metadata } from '../../model/ActivityResult.js';
import type { RecursoApoyo } from '../../model/RecursoApoyo.js';

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
  /**
   * Puntaje crudo, en la escala de la actividad. Ausente en las actividades
   * de registro, que producen datos y no una calificacion.
   *
   * El maximo **no** viaja en el comando: lo declara la actividad. Que lo
   * enviara el cliente permitia elegir el maximo y con el, el nivel.
   */
  readonly score?: number | undefined;
  readonly completedAt: Date;
  /**
   * La zona horaria de la persona, de su cuenta (SCRUM-123). Decide a que dia
   * pertenece el resultado, que queda guardado y no se recalcula.
   */
  readonly zonaHoraria: string;
  /** Informacion propia del tipo de actividad. Ver ADR 0008. */
  readonly metadata?: Metadata | undefined;
}

/**
 * Lo que devuelve registrar un resultado: el resultado y, si sugiere
 * acompanamiento, con que acompanarlo (SCRUM-94).
 *
 * Las lineas viajan en la misma respuesta a proposito. Quien recibe la senal
 * de que conviene apoyo recibe tambien los telefonos, sin depender de una
 * segunda peticion que podria fallar justo en ese momento.
 */
export interface RegistroDeResultado {
  readonly resultado: ActivityResult;
  /** Vacia cuando el resultado no sugiere acompanamiento. */
  readonly lineasDeAtencion: readonly RecursoApoyo[];
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
   * Registra el resultado y lo devuelve, con las lineas de atencion si
   * sugiere acompanamiento.
   *
   * La operacion es idempotente: si la misma operacion del cliente ya se
   * registro, devuelve el resultado existente en lugar de crear otro. Un
   * reintento tras una caida de red es seguro.
   */
  execute(command: RegistrarResultadoCommand): Promise<RegistroDeResultado>;
}
