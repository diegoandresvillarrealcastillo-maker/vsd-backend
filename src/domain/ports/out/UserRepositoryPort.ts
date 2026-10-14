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
   */
  save(user: User): Promise<void>;

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
   * Da de baja la cuenta (SCRUM-190, ADR 0026): borra todo lo que cuelga de
   * ella —igual que `borrarConTodo`— y deja **una constancia minima**: que la
   * cuenta existio, cuando, y lo que la persona acepto, version por version.
   * Sin nombre, sin correo, sin fecha de nacimiento: la constancia demuestra
   * una autorizacion, no identifica a nadie.
   *
   * La constancia tambien recuerda el identificador que el proveedor le dio a
   * la identidad, para que `estaInactivadaPorProveedor` pueda rechazar un token
   * que todavia no caduco.
   *
   * Es todo o nada, como `borrarConTodo`: `antesDeConfirmar` corre con todo ya
   * hecho pero sin confirmar, y si lanza no queda ni la baja ni la constancia.
   * Dar de baja una cuenta que no existe no es un error, no deja constancia y
   * no llama a `antesDeConfirmar`.
   */
  inactivarConTodo(
    id: UserId,
    inactivadaEl: Date,
    antesDeConfirmar: () => Promise<void>,
  ): Promise<void>;

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
   * Borra la cuenta y todo lo que cuelga de ella: resultados, entradas de
   * diario y cualquier tabla que guarde algo de esa persona.
   *
   * Es todo o nada. `antesDeConfirmar` se ejecuta con el borrado ya hecho pero
   * sin confirmar; si lanza, el borrado se deshace y la cuenta queda como
   * estaba. Asi se ata a este borrado lo que vive fuera de la base —la
   * identidad en el proveedor— sin dejar nunca una mitad hecha.
   *
   * Borrar una cuenta que no existe no es un error.
   */
  borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void>;
}
