import { FutureCompletionDateError } from './DomainError';
import { ActivityId, ClientOperationId, ResultId, UserId } from './Identifier';
import { OrientativeScore } from './OrientativeScore';

/** Datos necesarios para registrar un resultado. */
export interface DatosDeResultado {
  readonly id: ResultId;
  readonly userId: UserId;
  readonly activityId: ActivityId;
  readonly clientOperationId: ClientOperationId;
  readonly score: OrientativeScore;
  readonly completedAt: Date;
}

/**
 * Resultado de una actividad realizada por una persona.
 *
 * Es la entidad central de VSD Health: lo que el usuario consulta en su
 * historial y sobre lo que se construye el progreso.
 *
 * Se trata como un hecho ocurrido, no como un registro editable. No expone
 * metodos para cambiar el puntaje ni la fecha: si algo se registro mal, se
 * registra una actividad nueva. Un historial que se puede reescribir no
 * sirve para observar como ha cambiado alguien con el tiempo.
 */
export class ActivityResult {
  readonly id: ResultId;
  readonly userId: UserId;
  readonly activityId: ActivityId;
  readonly clientOperationId: ClientOperationId;
  readonly score: OrientativeScore;
  readonly completedAt: Date;

  private constructor(datos: DatosDeResultado) {
    this.id = datos.id;
    this.userId = datos.userId;
    this.activityId = datos.activityId;
    this.clientOperationId = datos.clientOperationId;
    this.score = datos.score;
    // Se copia la fecha para que quien la paso no pueda mutarla despues.
    this.completedAt = new Date(datos.completedAt.getTime());
  }

  /**
   * Construye un resultado valido o falla.
   *
   * `ahora` se recibe como parametro en lugar de leer el reloj del sistema,
   * para que la regla de la fecha futura se pueda probar sin depender de la
   * hora a la que se ejecuten las pruebas.
   */
  static create(datos: DatosDeResultado, ahora: Date = new Date()): ActivityResult {
    if (datos.completedAt.getTime() > ahora.getTime()) {
      throw new FutureCompletionDateError(datos.completedAt);
    }

    return new ActivityResult(datos);
  }

  /** Indica si este resultado pertenece a la persona indicada. */
  perteneceA(userId: UserId): boolean {
    return this.userId.equals(userId);
  }

  /**
   * Indica si conviene acompanar el resultado con recursos de apoyo
   * profesional. Delega en el puntaje: la regla vive donde vive el nivel.
   */
  sugiereAcompanamiento(): boolean {
    return this.score.sugiereAcompanamiento();
  }
}
