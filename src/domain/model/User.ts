import { FutureConsentDateError, InvalidRoleError, MissingConsentError } from './DomainError.js';
import { UserId } from './Identifier.js';

/**
 * Rol de la cuenta.
 *
 * El rol vive como campo del usuario y no como tabla aparte. El entregable lo
 * define asi, y con un equipo de dos personas una tabla de roles seria
 * estructura sin contenido.
 */
export const Rol = {
  USUARIO: 'usuario',
  ADMINISTRADOR: 'administrador',
} as const;

export type Rol = (typeof Rol)[keyof typeof Rol];

/** Edad minima para usar VSD Health. */
export const EDAD_MINIMA = 18;

/**
 * Consentimiento de tratamiento de datos.
 *
 * Se guarda **que version** acepto la persona y **cuando**. No basta con un si
 * o un no: las politicas cambian, y ante una reclamacion hay que poder
 * demostrar exactamente a que dio permiso cada quien y en que momento.
 *
 * Es lo que exige la Ley 1581 de 2012 para datos sensibles, categoria en la
 * que entra la informacion relacionada con salud que maneja la aplicacion.
 */
export interface Consentimiento {
  readonly versionPolitica: string;
  readonly aceptadoEn: Date;
}

/** Datos necesarios para registrar una cuenta. */
export interface DatosDeUsuario {
  readonly id: UserId;
  readonly correo: string;
  readonly idProveedorAuth: string;
  readonly rol: Rol;
  readonly consentimiento?: Consentimiento | undefined;
  readonly registradoEn: Date;
  readonly nombre?: string | undefined;
}

/**
 * Una cuenta de VSD Health.
 *
 * **No guarda contrasenas**, aunque el sistema si las use. Son dos cosas
 * distintas y conviene no confundirlas: se entra con correo y contrasena —o
 * con Google—, pero quien la recibe, la valida y la almacena es Supabase.
 * Nuestra API nunca la ve, y aqui solo queda el identificador que el proveedor
 * asigna a la persona.
 *
 * Por eso esta clase no tiene ni tendra un campo de contrasena: anadirlo
 * significaria haber traido de vuelta el problema que delegar evita.
 *
 * Ver ADR 0012, que reemplaza al ADR 0004.
 */
export class User {
  readonly id: UserId;
  readonly correo: string;
  readonly idProveedorAuth: string;
  readonly rol: Rol;
  readonly consentimiento: Consentimiento | undefined;
  readonly registradoEn: Date;
  readonly nombre: string | undefined;

  private constructor(datos: DatosDeUsuario) {
    this.id = datos.id;
    this.correo = datos.correo;
    this.idProveedorAuth = datos.idProveedorAuth;
    this.rol = datos.rol;
    this.consentimiento = datos.consentimiento;
    this.registradoEn = new Date(datos.registradoEn.getTime());
    this.nombre = datos.nombre;
  }

  static create(datos: DatosDeUsuario, ahora: Date = new Date()): User {
    if (!Object.values(Rol).includes(datos.rol)) {
      throw new InvalidRoleError(String(datos.rol));
    }

    if (datos.consentimiento !== undefined) {
      if (datos.consentimiento.versionPolitica.trim() === '') {
        throw new MissingConsentError();
      }

      if (datos.consentimiento.aceptadoEn.getTime() > ahora.getTime()) {
        throw new FutureConsentDateError();
      }
    }

    return new User(datos);
  }

  /**
   * Indica si la cuenta puede tratar datos relacionados con salud.
   *
   * Sin consentimiento registrado no hay base legal para guardar un resultado,
   * por mucho que la persona haya completado la actividad.
   */
  puedeTratarDatosDeSalud(): boolean {
    return this.consentimiento !== undefined;
  }

  /**
   * Comprueba el consentimiento o falla.
   *
   * Existe como metodo aparte para que quien lo necesite no tenga que
   * acordarse de mirar el booleano: olvidar una comprobacion es facil, y aqui
   * el olvido seria un incumplimiento legal.
   */
  exigirConsentimiento(): void {
    if (!this.puedeTratarDatosDeSalud()) {
      throw new MissingConsentError();
    }
  }

  esAdministrador(): boolean {
    return this.rol === Rol.ADMINISTRADOR;
  }

  /**
   * Indica si esta cuenta puede leer los resultados de la persona indicada.
   *
   * Solo su dueno. **El rol de administrador no da acceso**, y es deliberado:
   * el entregable dice que el administrador gestiona categorias, actividades y
   * recursos, y que no tiene acceso a los resultados, al historial ni a la
   * informacion personal de ningun usuario.
   *
   * Gestiona contenidos, no personas.
   */
  puedeLeerDatosDe(otro: UserId): boolean {
    return this.id.equals(otro);
  }
}
