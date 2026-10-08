import type { User } from '../../model/User.js';

/**
 * Orden de dar de alta una cuenta de VSD Health.
 *
 * Los datos salen del token ya verificado, no del cuerpo de la peticion. Lo
 * unico que aporta quien llama es lo que el token no puede saber porque es un
 * acto de la persona y no un dato de su identidad: su fecha de nacimiento y la
 * aceptacion del aviso de privacidad y de los terminos.
 *
 * Todo eso es opcional en la orden, porque la misma llamada sirve para entrar
 * de nuevo (una cuenta ya registrada no necesita nada de esto). Para **crear**
 * una cuenta, o completar la de quien no lo hizo, es obligatorio.
 */
export interface RegistrarCuentaCommand {
  /** El `sub` del token: quien es esta persona para el proveedor. */
  readonly idProveedorAuth: string;

  /** El correo que trae el token, ya verificado por el proveedor. */
  readonly correo: string;

  /**
   * Fecha de nacimiento declarada, AAAA-MM-DD.
   *
   * VSD Health es solo para mayores de 18 anos. Quien declara menos no queda
   * registrado: se borra su identidad y se rechaza con `MENOR_DE_EDAD`. La
   * edad se calcula en el servidor, con el dia local de la persona.
   */
  readonly fechaNacimiento?: string | undefined;

  /**
   * Version del aviso de tratamiento de datos que la persona acepto.
   *
   * No basta con un si o un no. Las politicas cambian, y ante una reclamacion
   * hay que poder demostrar **a que** dio permiso cada quien y **cuando**. Es
   * lo que exige la Ley 1581 de 2012 para datos sensibles, categoria en la que
   * entra la informacion relacionada con salud.
   */
  readonly versionPolitica?: string | undefined;

  /** Version de los terminos que la persona acepto. Misma razon que el aviso. */
  readonly versionTerminos?: string | undefined;

  /**
   * Que marco la casilla del aviso de privacidad. Tiene que ser `true`: la
   * version sola no es una aceptacion, y antes bastaba con enviarla.
   */
  readonly aceptaAviso?: boolean | undefined;

  /** Que marco la casilla de los terminos. Tiene que ser `true`. */
  readonly aceptaTerminos?: boolean | undefined;

  /** Como quiere que la llamen. Opcional. */
  readonly nombre?: string | undefined;

  /**
   * La zona horaria que informa el dispositivo (SCRUM-123). Opcional.
   *
   * Se manda en cada entrada, no solo en el alta: es lo que hace que viajar no
   * obligue a configurar nada. Si la cuenta ya existe y la zona es otra, se
   * actualiza; si no viene, se deja la que hay. Una zona que el servidor no
   * conoce se rechaza con `ZONA_HORARIA_INVALIDA`.
   */
  readonly zonaHoraria?: string | undefined;
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
   * Devuelve la cuenta existente, crea una nueva o completa la de quien aun no
   * tenia su registro completo.
   *
   * Es idempotente a proposito: llamarlo dos veces con el mismo identificador
   * del proveedor devuelve la misma cuenta en lugar de fallar. El frontend
   * puede invocarlo en cada inicio de sesion sin tener que averiguar antes si
   * es la primera vez.
   *
   * - Cuenta nueva: exige la fecha de nacimiento, ser mayor de 18 anos y las
   *   dos casillas. Un menor no queda registrado y su identidad se borra.
   * - Cuenta con el registro completo: se devuelve tal cual. Lo que traiga la
   *   orden sobre edad y consentimiento se ignora, de modo que no se puede
   *   cambiar la fecha ni reescribir lo aceptado por aqui.
   * - Cuenta con el registro incompleto (anterior a que se pidiera): si la
   *   orden trae el registro, se completa; si no, se devuelve tal cual y
   *   `registroCompleto()` dice que falta.
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
