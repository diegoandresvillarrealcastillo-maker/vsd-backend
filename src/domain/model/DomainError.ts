/**
 * Errores del dominio.
 *
 * El dominio no conoce HTTP ni codigos de estado: lanza errores propios y es
 * la infraestructura la que decide como traducirlos a una respuesta. Por eso
 * cada error lleva un `code` estable, que sirve de contrato entre las capas
 * sin acoplar el dominio al transporte.
 *
 * Los mensajes van con tildes y enes, al contrario que los comentarios. No son
 * texto de programador: `DomainExceptionFilter` los envia tal cual en el campo
 * `mensaje` de la respuesta, asi que terminan en la pantalla de alguien.
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
    super(`El identificador de ${tipo} no tiene un formato válido: "${valor}".`);
  }
}

/** El puntaje cae fuera del rango declarado por la actividad. */
export class ScoreOutOfRangeError extends DomainError {
  readonly code = 'PUNTAJE_FUERA_DE_RANGO';

  constructor(valor: number, maximo: number) {
    super(`El puntaje ${valor} está fuera del rango permitido (0 a ${maximo}).`);
  }
}

/** El rango maximo declarado por la actividad no es utilizable. */
export class InvalidScoreRangeError extends DomainError {
  readonly code = 'RANGO_DE_PUNTAJE_INVALIDO';

  constructor(maximo: number) {
    super(
      `El puntaje máximo de la actividad debe ser un entero mayor que cero, y se recibió ${maximo}.`,
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
    super(`La fecha de realización no puede estar en el futuro: ${fecha.toISOString()}.`);
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
    super('La actividad indicada no está disponible.');
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
    super(`La actividad "${nombre}" no produce puntaje, y se recibió uno.`);
  }
}

/**
 * La cuenta no tiene registrado el consentimiento de tratamiento de datos.
 *
 * VSD Health trata informacion relacionada con salud, que la Ley 1581 de 2012
 * clasifica como sensible. Sin consentimiento no hay base legal para tratarla,
 * asi que la ausencia bloquea la funcion en lugar de solo anotarse.
 */
export class MissingConsentError extends DomainError {
  readonly code = 'CONSENTIMIENTO_NO_REGISTRADO';

  constructor() {
    super('La cuenta no tiene registrado el consentimiento de tratamiento de datos.');
  }
}

/**
 * Quien llama tiene un token valido pero todavia no tiene cuenta aqui.
 *
 * Supabase y VSD Health guardan identidades distintas a proposito: el token
 * dice quien eres para el proveedor, y la cuenta es nuestra. Entre las dos hay
 * un paso, el alta, y hasta que ocurre no hay a nombre de quien guardar nada.
 *
 * No es un fallo de autenticacion —el token es autentico— sino una cuenta que
 * falta, y por eso se distingue de un 401.
 */
export class AccountNotProvisionedError extends DomainError {
  readonly code = 'CUENTA_NO_REGISTRADA';

  constructor() {
    super('Todavía no tienes una cuenta de VSD Health. Completa el registro para continuar.');
  }
}

/**
 * Ese correo ya pertenece a otra cuenta.
 *
 * Ocurre cuando alguien se registro con correo y despues entra con Google, o
 * al reves, y el proveedor entrega un identificador distinto para la misma
 * persona.
 *
 * No se comprueba antes de intentarlo, y no por descuido: con el aislamiento
 * activo no se puede preguntar si **otra** persona tiene un correo sin poder
 * leer filas ajenas, que es justo lo que las politicas impiden. La unicidad la
 * hace cumplir la base, y aqui solo se traduce a algo que se entienda.
 */
export class EmailAlreadyRegisteredError extends DomainError {
  readonly code = 'CORREO_YA_REGISTRADO';

  constructor() {
    super(
      'Ese correo ya está asociado a una cuenta. Entra con el método que usaste la primera vez.',
    );
  }
}

/** El rol recibido no es uno de los definidos por el sistema. */
export class InvalidRoleError extends DomainError {
  readonly code = 'ROL_INVALIDO';

  constructor(valor: string) {
    super(`El rol "${valor}" no existe.`);
  }
}

/**
 * La fecha de aceptacion de la politica esta en el futuro.
 *
 * Nadie puede haber aceptado algo que todavia no ha ocurrido, y una fecha asi
 * invalida la prueba de consentimiento justo cuando hace falta demostrarla.
 */
export class FutureConsentDateError extends DomainError {
  readonly code = 'FECHA_DE_CONSENTIMIENTO_EN_EL_FUTURO';

  constructor() {
    super('La fecha de aceptación de la política no puede estar en el futuro.');
  }
}

/**
 * Un recurso de apoyo esta mal formado y no se puede mostrar.
 *
 * Importa mas de lo que parece: los recursos son lo que el asistente responde
 * cuando detecta una senal de riesgo. Un recurso a medias ahi seria una
 * pantalla vacia en el peor momento posible, asi que se rechaza al construirlo
 * y no al pintarlo.
 */
export class InvalidResourceError extends DomainError {
  readonly code = 'RECURSO_INVALIDO';

  constructor(motivo: string) {
    super(`Recurso de apoyo inválido: ${motivo}.`);
  }
}
