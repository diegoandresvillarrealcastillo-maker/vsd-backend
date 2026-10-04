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

  /**
   * `causa` guarda el fallo tecnico que llevo a este error, cuando lo hay. No
   * sale en la respuesta: es para el registro del servidor.
   */
  protected constructor(message: string, causa?: unknown) {
    super(message, causa === undefined ? undefined : { cause: causa });
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
 * Se intento crear una cuenta aceptando un aviso que ya no es el vigente.
 *
 * No se acepta en silencio: quedaria registrado que la persona dio permiso a un
 * texto distinto del que esta en vigor, y esa diferencia es exactamente lo que
 * no se puede tener ante una reclamacion. Quien llama debe pedir la version
 * vigente a `GET /api/aviso` y volver a intentarlo.
 *
 * Solo aplica al crear la cuenta. Las cuentas que ya existen conservan la
 * version con la que se crearon.
 */
export class OutdatedPrivacyNoticeError extends DomainError {
  readonly code = 'VERSION_DEL_AVISO_NO_VIGENTE';

  constructor() {
    super(
      'La versión del aviso de privacidad que se envió ya no está vigente. Vuelve a cargar la página y acepta la versión actual.',
    );
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

/** Se pidio activar un modulo que no existe. */
export class UnknownModuleError extends DomainError {
  readonly code = 'MODULO_DESCONOCIDO';

  constructor(valor: string) {
    super(`El módulo "${valor}" no existe. Los módulos son cognicion, bienestar y emociones.`);
  }
}

/**
 * La eleccion dejaria la cuenta sin ningun modulo activo.
 *
 * Con cero modulos el dashboard quedaria vacio y la persona sin nada que hacer.
 */
export class NoActiveModulesError extends DomainError {
  readonly code = 'SIN_MODULOS_ACTIVOS';

  constructor() {
    super('Tiene que quedar al menos un módulo activo.');
  }
}

/** El nombre con el que la persona quiere que la llamen no se puede guardar. */
export class InvalidNameError extends DomainError {
  readonly code = 'NOMBRE_INVALIDO';

  constructor() {
    super('El nombre debe tener entre 1 y 100 caracteres, sin saltos de línea.');
  }
}

/**
 * El borrado de la cuenta no se pudo completar, y por eso no se borro nada.
 *
 * Borrar es todo o nada: las filas propias y la identidad en el proveedor de
 * autenticacion. Si una de las dos mitades falla, la otra se deshace. Un
 * borrado a medias dejaria datos huerfanos, y eso incumple el derecho de
 * supresion aunque la pantalla dijera que salio bien.
 */
export class AccountDeletionFailedError extends DomainError {
  readonly code = 'BORRADO_NO_COMPLETADO';

  constructor(causa?: unknown) {
    super(
      'No se pudo borrar la cuenta en este momento, así que no se borró nada. Inténtalo de nuevo en unos minutos.',
      causa,
    );
  }
}

/** La mascota recibida no se puede guardar tal cual. */
export class InvalidPetError extends DomainError {
  readonly code = 'MASCOTA_INVALIDA';

  constructor(motivo: string) {
    super(`No se pudo guardar la mascota: ${motivo}.`);
  }
}

/**
 * La anotacion del diario no tiene la forma que el diario guarda.
 *
 * El motivo dice que parte esta mal, nunca que trae: el mensaje viaja en la
 * respuesta, y repetir aqui un trozo de lo escrito seria sacarlo del diario.
 */
export class InvalidJournalEntryError extends DomainError {
  readonly code = 'ANOTACION_INVALIDA';

  constructor(motivo: string) {
    super(`La anotación no se puede guardar: ${motivo}.`);
  }
}

/** Se intento escribir en un dia que todavia no ha llegado. */
export class FutureJournalDayError extends DomainError {
  readonly code = 'DIA_EN_EL_FUTURO';

  constructor(dia: string) {
    super(`No se puede escribir en un día que todavía no ha llegado: ${dia}.`);
  }
}

/** El rango de dias pedido no se puede consultar. */
export class InvalidDayRangeError extends DomainError {
  readonly code = 'RANGO_DE_DIAS_INVALIDO';

  constructor(motivo: string) {
    super(`El rango de días no es válido: ${motivo}.`);
  }
}

/**
 * La anotacion no existe, o no es de quien la pide.
 *
 * Las dos cosas se responden igual a proposito: distinguirlas diria que
 * identificadores son de otra persona.
 */
export class JournalEntryNotFoundError extends DomainError {
  readonly code = 'ANOTACION_NO_ENCONTRADA';

  constructor() {
    super('Esa anotación no existe.');
  }
}

/**
 * Ya paso la hora para editar la anotacion.
 *
 * No se pierde nada: quien llama guarda lo que traia como una anotacion nueva
 * del mismo dia, y la original queda como se escribio (ADR 0009).
 */
export class EditWindowClosedError extends DomainError {
  readonly code = 'EDICION_FUERA_DE_PLAZO';

  constructor() {
    super(
      'Ya pasó la hora para editar esta anotación. Lo que escribiste se puede guardar como una anotación nueva del mismo día.',
    );
  }
}

/**
 * La anotacion cambio desde que quien llama la leyo.
 *
 * Pasa cuando se edita desde dos dispositivos. La regla del ADR 0009 es no
 * sobrescribir: lo que llega se guarda como anotacion nueva.
 */
export class StaleJournalEntryError extends DomainError {
  readonly code = 'VERSION_DESACTUALIZADA';

  constructor() {
    super(
      'Esta anotación cambió desde otro dispositivo. Para no perder ninguna de las dos versiones, guarda lo tuyo como una anotación nueva.',
    );
  }
}

/**
 * El pendiente no se puede guardar tal cual. Como en el diario, el motivo
 * dice que parte esta mal y nunca repite lo escrito.
 */
export class InvalidTaskError extends DomainError {
  readonly code = 'PENDIENTE_INVALIDO';

  constructor(motivo: string) {
    super(`El pendiente no se puede guardar: ${motivo}.`);
  }
}

/** El pendiente no existe, o no es de quien lo pide. Se responde igual. */
export class TaskNotFoundError extends DomainError {
  readonly code = 'PENDIENTE_NO_ENCONTRADO';

  constructor() {
    super('Ese pendiente no existe.');
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
