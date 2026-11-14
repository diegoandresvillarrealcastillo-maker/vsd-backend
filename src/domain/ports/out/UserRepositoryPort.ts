import type { BajaPendiente } from '../../model/BajaPendiente.js';
import type { UserId } from '../../model/Identifier.js';
import type { ConsentimientoAceptado, User } from '../../model/User.js';

/**
 * Puerto de salida para las cuentas.
 *
 * El dominio ya tenia `User` completo desde el Ciclo 4 —rol, consentimiento
 * con su version y su fecha, `exigirConsentimiento()`, `puedeLeerDatosDe()`—
 * pero no habia forma de guardarlo ni de recuperarlo. Era codigo correcto que
 * no llegaba a usarse.
 *
 * Como los demas puertos, esto es una interfaz y nada mas. El dominio declara
 * que necesita encontrar y guardar cuentas, y no le importa si al otro lado
 * hay PostgreSQL o un Map.
 */
export interface UserRepositoryPort {
  /** Busca una cuenta por nuestro identificador. `null` si no existe. */
  findById(id: UserId): Promise<User | null>;

  /**
   * Busca una cuenta por el identificador que le asigna el proveedor de
   * autenticacion. `null` si no existe.
   *
   * Es la consulta con la que empieza cada peticion, y conviene entender por
   * que hacen falta las dos.
   *
   * Un token de Supabase dice quien eres **para Supabase**. Nuestra base usa
   * su propio identificador, y son distintos a proposito: atar la clave
   * primaria de todas nuestras tablas al proveedor de autenticacion
   * significaria que cambiar de proveedor obliga a reescribir la base entera.
   *
   * Asi que hay una traduccion, y este metodo es esa traduccion. Devolver
   * `null` no es un error: es lo que ocurre la primera vez que alguien entra,
   * cuando Supabase ya lo conoce y nosotros todavia no. Quien decide que hacer
   * entonces es el caso de uso de alta, no este puerto.
   */
  findByIdProveedorAuth(idProveedorAuth: string): Promise<User | null>;

  /**
   * Guarda una cuenta.
   *
   * Guardar dos veces la misma cuenta la deja como esta la segunda vez, no
   * crea otra. Es lo que permite reintentar sin mirar antes si existia.
   *
   * Escribe **la cuenta entera**, y por eso sirve para crearla (el alta) y no para cambiar una
   * que ya existe: quien la leyo, la cambio y la guarda entera pisa, con lo que leyo, lo que otra
   * peticion hubiera cambiado entretanto. Para eso, `guardarCambios` (SCRUM-258).
   */
  save(user: User): Promise<void>;

  /**
   * Guarda **solo lo que cambio** entre `antes`, la cuenta como se leyo, y `despues`, y devuelve la
   * cuenta tal como quedo guardada (SCRUM-258).
   *
   * Es la forma de cambiar una cuenta que ya existe. Una peticion que solo cambia la foto no puede
   * tocar nada mas: si la persona acababa de apagar un permiso, sigue apagado. Los campos que
   * cambian a la vez en dos peticiones los gana la ultima, campo por campo.
   *
   * Lo que devuelve es lo que hay guardado despues de escribir, con lo que otras peticiones
   * hubieran cambiado, y no lo que se habia leido: es lo que la respuesta tiene que contar.
   *
   * Devuelve `null` si la cuenta ya no existe (se borro o se dio de baja entretanto) y **no la crea
   * de nuevo**: una orden que cargo la cuenta antes de la baja no puede devolverle la vida con sus
   * datos personales (SCRUM-190, ADR 0026).
   *
   * Falla si `antes` y `despues` no son la misma cuenta, o si cambia el correo, el rol o el
   * proveedor: por aqui no se cambian y se perderian sin avisar.
   */
  guardarCambios(antes: User, despues: User): Promise<User | null>;

  /**
   * Todo lo que la persona ha aceptado, version por version, de la mas antigua
   * a la mas reciente.
   *
   * `save` anade al historial el aviso y los terminos de la cuenta y nunca
   * reescribe ni quita una fila: cuando la persona acepta un texto nuevo, el
   * anterior sigue ahi como prueba de lo que acepto antes.
   */
  consentimientosDe(id: UserId): Promise<readonly ConsentimientoAceptado[]>;

  /**
   * Deja la marca de que se pidio la baja de la cuenta (SCRUM-267, ADR 0040), **antes** de borrar
   * nada de lo de fuera de la base (los archivos y la identidad en el proveedor).
   *
   * Mientras la marca exista, la baja se termina sola: `bajasPendientes` la devuelve y la tarea del
   * API repite los pasos. La marca se va con la fila de `usuario`, asi que no hay que quitarla.
   *
   * Devuelve `false`, sin dejar nada, si la cuenta ya no existe. Marcar dos veces no es un error y
   * la primera marca manda: ni `conConstancia` ni `pedidaEl` cambian.
   */
  marcarBaja(id: UserId, conConstancia: boolean, pedidaEl: Date): Promise<boolean>;

  /**
   * Las bajas que se pidieron antes de `pedidasAntes` y no terminaron, las mas antiguas primero y
   * como mucho `limite`.
   *
   * El corte existe para no pisar una baja que sigue en curso: la persona que la pidio espera a lo
   * de fuera unos segundos, y solo pasado un rato se da por cortada.
   */
  bajasPendientes(pedidasAntes: Date, limite: number): Promise<readonly BajaPendiente[]>;

  /**
   * Termina la baja con constancia (SCRUM-190, ADR 0026): anota la constancia minima y borra todo lo
   * vivo, en una transaccion corta. Se llama cuando lo de fuera ya se borro (ADR 0040).
   *
   * La constancia dice que la cuenta existio, cuando, y lo que la persona acepto, version por
   * version. Sin nombre, sin correo, sin fecha de nacimiento: demuestra una autorizacion, no
   * identifica a nadie. Recuerda tambien el identificador que el proveedor le dio a la identidad,
   * para que `estaInactivadaPorProveedor` pueda rechazar un token que todavia no caduco.
   *
   * Es todo o nada: si algo falla no queda ni la baja ni la constancia. Dar de baja una cuenta que
   * no existe no es un error y no deja constancia, asi que repetirla es seguro.
   */
  inactivarConTodo(id: UserId, inactivadaEl: Date): Promise<void>;

  /**
   * Si ese identificador del proveedor perteneció a una cuenta que se dio de
   * baja.
   *
   * Es lo que separa «todavia no tiene cuenta» (alta pendiente) de «tenia una y
   * ya no» (sesion que hay que cerrar). Sin esta distincion, un token que no
   * caduco permitiria dar de alta una cuenta nueva para una identidad que ya no
   * existe.
   */
  estaInactivadaPorProveedor(idProveedorAuth: string): Promise<boolean>;

  /**
   * Borra la cuenta y todo lo que cuelga de ella: resultados, entradas de diario y cualquier tabla
   * que guarde algo de esa persona. Sin constancia: es lo que se hace con el rechazo de un menor.
   *
   * Es una transaccion corta y todo o nada. Lo que vive fuera de la base (los archivos, la
   * identidad) se borra antes, fuera de la transaccion (ADR 0040). Borrar una cuenta que no existe
   * no es un error.
   */
  borrarConTodo(id: UserId): Promise<void>;
}
