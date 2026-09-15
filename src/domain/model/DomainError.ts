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
