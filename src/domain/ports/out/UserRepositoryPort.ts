import type { UserId } from '../../model/Identifier.js';
import type { User } from '../../model/User.js';

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
