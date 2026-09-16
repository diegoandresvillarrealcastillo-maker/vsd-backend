import { FutureCompletionDateError, ReservedMetadataKeyError } from './DomainError.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from './Identifier.js';
import { OrientativeScore } from './OrientativeScore.js';

/**
 * Valores que admite `metadata`. Es lo que cabe en un JSONB de PostgreSQL.
 */
export type ValorDeMetadata =
  | string
  | number
  | boolean
  | null
  | readonly ValorDeMetadata[]
  | { readonly [clave: string]: ValorDeMetadata };

/** Informacion propia del tipo de actividad. */
export type Metadata = Readonly<Record<string, ValorDeMetadata>>;

/**
 * Claves que no pueden aparecer en `metadata` porque ya son campos propios.
 *
 * Se listan tanto en el nombre del dominio como en el de la tabla, porque el
 * cliente puede enviar cualquiera de los dos. Ver ADR 0008.
 */
const CLAVES_RESERVADAS: ReadonlySet<string> = new Set([
  'id',
  'userId',
  'activityId',
  'clientOperationId',
  'score',
  'completedAt',
  'id_resultado',
  'id_usuario',
  'id_actividad',
  'id_operacion_cliente',
  'puntaje',
  'nivel_orientativo',
  'fecha',
]);

/** Datos necesarios para registrar un resultado. */
export interface DatosDeResultado {
  readonly id: ResultId;
  readonly userId: UserId;
  readonly activityId: ActivityId;
  readonly clientOperationId: ClientOperationId;
  /**
   * Ausente en las actividades de registro, que producen datos y no puntaje:
   * una bitacora de sueno o un registro de animo no se califican.
   */
  readonly score?: OrientativeScore | undefined;
  readonly completedAt: Date;
  readonly metadata?: Metadata | undefined;
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
  readonly score: OrientativeScore | undefined;
  readonly completedAt: Date;
  readonly metadata: Metadata;

  private constructor(datos: DatosDeResultado) {
    this.id = datos.id;
    this.userId = datos.userId;
    this.activityId = datos.activityId;
    this.clientOperationId = datos.clientOperationId;
    this.score = datos.score;
    // Se copia la fecha para que quien la paso no pueda mutarla despues.
    this.completedAt = new Date(datos.completedAt.getTime());
    this.metadata = Object.freeze({ ...datos.metadata });
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

    for (const clave of Object.keys(datos.metadata ?? {})) {
      if (CLAVES_RESERVADAS.has(clave)) {
        throw new ReservedMetadataKeyError(clave);
      }
    }

    return new ActivityResult(datos);
  }

  /** Indica si este resultado pertenece a la persona indicada. */
  perteneceA(userId: UserId): boolean {
    return this.userId.equals(userId);
  }

  /** Indica si la actividad produjo un puntaje. */
  tienePuntaje(): boolean {
    return this.score !== undefined;
  }

  /**
   * Indica si conviene acompanar el resultado con recursos de apoyo
   * profesional. Delega en el puntaje: la regla vive donde vive el nivel.
   *
   * Un resultado sin puntaje no sugiere nada por si mismo. Una bitacora de
   * sueno cobra sentido en la tendencia, no en una anotacion suelta, y hacer
   * que una sola noche mala dispare una sugerencia seria leer de mas.
   */
  sugiereAcompanamiento(): boolean {
    return this.score?.sugiereAcompanamiento() ?? false;
  }
}
