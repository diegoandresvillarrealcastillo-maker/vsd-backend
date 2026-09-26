import type { User } from '../../model/User.js';

/**
 * Orden de dar de alta una cuenta de VSD Health.
 *
 * Los datos salen del token ya verificado, no del cuerpo de la peticion. Lo
 * unico que aporta quien llama es el consentimiento, porque es lo unico que
 * el token no puede saber: aceptar una politica es un acto de la persona, no
 * un dato de su identidad.
 */
export interface RegistrarCuentaCommand {
  /** El `sub` del token: quien es esta persona para el proveedor. */
  readonly idProveedorAuth: string;

  /** El correo que trae el token, ya verificado por el proveedor. */
  readonly correo: string;

  /**
   * Version del aviso de tratamiento de datos que la persona acepto.
   *
   * No basta con un si o un no. Las politicas cambian, y ante una reclamacion
   * hay que poder demostrar **a que** dio permiso cada quien y **cuando**. Es
   * lo que exige la Ley 1581 de 2012 para datos sensibles, categoria en la que
   * entra la informacion relacionada con salud.
   */
  readonly versionPolitica: string;

  /** Como quiere que la llamen. Opcional. */
  readonly nombre?: string | undefined;
}

/**
 * Puerto de entrada del alta de cuenta.
 *
 * ## Por que existe este paso
 *
 * Supabase autentica, pero no sabe nada del dominio: no conoce el rol ni el
 * consentimiento. La cuenta de VSD Health es una entidad propia, con su
 * identificador propio, y se crea la primera vez que aparece un identificador
 * del proveedor que no habiamos visto antes.
 *
 * ## La contrasena no pasa por aqui
 *
 * La recibe, valida y custodia Supabase. Lo que llega a este caso de uso es un
 * token ya emitido y verificado. `User` sigue sin campo de contrasena y eso no
 * cambia.
 */
export interface RegistrarCuentaUseCase {
  /**
   * Devuelve la cuenta existente o crea una nueva.
   *
   * Es idempotente a proposito: llamarlo dos veces con el mismo identificador
   * del proveedor devuelve la misma cuenta en lugar de fallar. El frontend
   * puede invocarlo en cada inicio de sesion sin tener que averiguar antes si
   * es la primera vez.
   */
  execute(command: RegistrarCuentaCommand): Promise<User>;

  /**
   * Busca la cuenta que corresponde a un identificador del proveedor.
   *
   * Devuelve `null` cuando todavia no existe. Esa ausencia no es un error: es
   * lo que ocurre entre que alguien se autentica por primera vez y completa su
   * alta.
   */
  buscarPorProveedor(idProveedorAuth: string): Promise<User | null>;
}
