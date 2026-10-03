import {
  FutureConsentDateError,
  InvalidNameError,
  InvalidRoleError,
  MissingConsentError,
} from './DomainError.js';
import { UserId } from './Identifier.js';
import { crearMascota, elegirModulos, type Mascota, type Modulo } from './Preferencias.js';

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
  /**
   * Vacio mientras la persona no ha elegido. Ver `haElegidoModulos`. Llega
   * como texto porque `create` lo valida: lo que venga de la base pasa por la
   * misma regla que lo que llega por la API.
   */
  readonly modulosActivos?: readonly string[] | undefined;
  /** Sin mascota guardada se usa la de siempre. */
  readonly mascota?: Mascota | undefined;
}

/** Lo que una persona puede cambiar de sus preferencias. Lo que no venga, se queda igual. */
export interface CambiosDePreferencias {
  /** Como quiere que la llamen. */
  readonly nombre?: string | undefined;
  readonly modulosActivos?: readonly string[] | undefined;
  readonly mascota?: Mascota | undefined;
}

const LARGO_MAXIMO_DEL_NOMBRE = 100;

// Un nombre se pinta en el saludo; un salto de linea o un caracter invisible
// ahi no es un nombre.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f]/;

function validarNombre(nombre: string): string {
  const limpio = nombre.trim();

  if (limpio === '' || [...limpio].length > LARGO_MAXIMO_DEL_NOMBRE || CONTROL.test(limpio)) {
    throw new InvalidNameError();
  }

  return limpio;
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
  readonly modulosActivos: readonly Modulo[];
  readonly mascota: Mascota | undefined;

  private constructor(datos: DatosDeUsuario & { readonly modulosActivos: readonly Modulo[] }) {
    this.id = datos.id;
    this.correo = datos.correo;
    this.idProveedorAuth = datos.idProveedorAuth;
    this.rol = datos.rol;
    this.consentimiento = datos.consentimiento;
    this.registradoEn = new Date(datos.registradoEn.getTime());
    this.nombre = datos.nombre;
    this.modulosActivos = [...datos.modulosActivos];
    this.mascota = datos.mascota;
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

    // Una lista vacia es valida aqui: es la cuenta recien creada que todavia
    // no paso por la bienvenida. Lo que no se admite es elegir cero, y eso lo
    // impide `conPreferencias`.
    const modulosActivos =
      datos.modulosActivos === undefined || datos.modulosActivos.length === 0
        ? []
        : elegirModulos(datos.modulosActivos);

    return new User({
      ...datos,
      modulosActivos,
      mascota: datos.mascota === undefined ? undefined : crearMascota(datos.mascota),
    });
  }

  /**
   * Si la persona ya eligio con que modulos empezar.
   *
   * Una cuenta nueva no los tiene, y el frontend la lleva a la bienvenida
   * antes del dashboard (SCRUM-90).
   */
  haElegidoModulos(): boolean {
    return this.modulosActivos.length > 0;
  }

  /**
   * La misma cuenta con otras preferencias.
   *
   * Devuelve una cuenta nueva en lugar de modificar esta. Solo toca el nombre,
   * los modulos y la mascota: el correo y el rol no se cambian por aqui, y no
   * hay forma de pasarlos.
   */
  conPreferencias(cambios: CambiosDePreferencias): User {
    return new User({
      id: this.id,
      correo: this.correo,
      idProveedorAuth: this.idProveedorAuth,
      rol: this.rol,
      consentimiento: this.consentimiento,
      registradoEn: this.registradoEn,
      nombre: cambios.nombre === undefined ? this.nombre : validarNombre(cambios.nombre),
      modulosActivos:
        cambios.modulosActivos === undefined
          ? this.modulosActivos
          : elegirModulos(cambios.modulosActivos),
      mascota: cambios.mascota === undefined ? this.mascota : crearMascota(cambios.mascota),
    });
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
