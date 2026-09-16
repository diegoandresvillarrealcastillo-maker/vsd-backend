/**
 * Errores del dominio.
 *
 * El dominio no conoce HTTP ni codigos de estado: lanza errores propios y es
 * la infraestructura la que decide como traducirlos a una respuesta. Por eso
 * cada error lleva un `code` estable, que sirve de contrato entre las capas
 * sin acoplar el dominio al transporte.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** El texto recibido no tiene forma de UUID. */
export class InvalidIdentifierError extends DomainError {
  readonly code = 'IDENTIFICADOR_INVALIDO';

  constructor(tipo: string, valor: string) {
    super(`El identificador de ${tipo} no tiene un formato valido: "${valor}".`);
  }
}

/** El puntaje cae fuera del rango declarado por la actividad. */
export class ScoreOutOfRangeError extends DomainError {
  readonly code = 'PUNTAJE_FUERA_DE_RANGO';

  constructor(valor: number, maximo: number) {
    super(`El puntaje ${valor} esta fuera del rango permitido (0 a ${maximo}).`);
  }
}

/** El rango maximo declarado por la actividad no es utilizable. */
export class InvalidScoreRangeError extends DomainError {
  readonly code = 'RANGO_DE_PUNTAJE_INVALIDO';

  constructor(maximo: number) {
    super(
      `El puntaje maximo de la actividad debe ser un entero mayor que cero, y se recibio ${maximo}.`,
    );
  }
}

/**
 * La fecha de realizacion esta en el futuro.
 *
 * Importa en el modo sin conexion: el reloj del dispositivo puede estar
 * desajustado, y aceptar una fecha futura desordenaria el historial.
 */
export class FutureCompletionDateError extends DomainError {
  readonly code = 'FECHA_EN_EL_FUTURO';

  constructor(fecha: Date) {
    super(`La fecha de realizacion no puede estar en el futuro: ${fecha.toISOString()}.`);
  }
}

/**
 * El identificador de operacion recibido ya pertenece a otro usuario.
 *
 * No es un problema de integridad sino de seguridad: impide que alguien use
 * un identificador ajeno para escribir sobre datos de otra persona o para
 * deducir que ese registro existe.
 */
export class OperationBelongsToAnotherUserError extends DomainError {
  readonly code = 'OPERACION_DE_OTRO_USUARIO';

  constructor() {
    super('La operacion solicitada no esta disponible.');
  }
}

/**
 * `metadata` trae una clave que ya existe como columna.
 *
 * Dos verdades sobre el mismo dato terminan divergiendo: si el puntaje vive
 * en su columna y tambien dentro de `metadata`, tarde o temprano dejan de
 * coincidir y nadie sabe cual mandaba. Ver ADR 0008.
 */
export class ReservedMetadataKeyError extends DomainError {
  readonly code = 'CLAVE_DE_METADATA_RESERVADA';

  constructor(clave: string) {
    super(`La clave "${clave}" ya existe como campo propio y no puede ir en metadata.`);
  }
}

/**
 * La configuracion de la actividad es incoherente.
 *
 * Por ejemplo: declara que produce puntaje pero no dice sobre que maximo, o
 * trae umbrales que no separan tres bandas. Una actividad mal configurada
 * produciria niveles sin sentido, y es preferible que falle al cargarse el
 * catalogo y no cuando alguien ya termino la actividad.
 */
export class InvalidActivityConfigurationError extends DomainError {
  readonly code = 'CONFIGURACION_DE_ACTIVIDAD_INVALIDA';

  constructor(nombre: string, motivo: string) {
    super(`La actividad "${nombre}" ${motivo}.`);
  }
}

/**
 * La actividad reportada no existe en el catalogo.
 *
 * Sin la actividad no se puede interpretar el puntaje: no se sabe sobre que
 * maximo se obtuvo ni hacia donde va la escala. Es preferible rechazar el
 * resultado a guardarlo con un nivel derivado de suposiciones.
 */
export class ActivityNotFoundError extends DomainError {
  readonly code = 'ACTIVIDAD_NO_ENCONTRADA';

  constructor() {
    super('La actividad indicada no esta disponible.');
  }
}

/**
 * Llego un puntaje para una actividad que no puntua.
 *
 * Se rechaza en lugar de ignorarlo en silencio. Descartar sin avisar un dato
 * que alguien envio esconde el error de quien llama, y ese dato podria ser
 * justo lo que la persona respondio.
 */
export class ScoreNotApplicableError extends DomainError {
  readonly code = 'LA_ACTIVIDAD_NO_PUNTUA';

  constructor(nombre: string) {
    super(`La actividad "${nombre}" no produce puntaje, y se recibio uno.`);
  }
}
