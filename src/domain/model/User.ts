import { Calendario, ZONA_HORARIA_POR_DEFECTO } from './Calendario.js';
import {
  FutureConsentDateError,
  InvalidNameError,
  InvalidRoleError,
  InvalidTimeZoneError,
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
  /** Si la persona permite que lo que escribe en el diario se lea para recomendarle. Por defecto, no. */
  readonly diarioConRecomendaciones?: boolean | undefined;
  /** Zona IANA de la persona (SCRUM-123). Sin ella, `America/Bogota`. */
  readonly zonaHoraria?: string | undefined;
  /** Cuando se guardo su foto de perfil (SCRUM-120). Sin ella, no tiene foto. */
  readonly fotoActualizadaEl?: Date | undefined;
}

/** Lo que una persona puede cambiar de sus preferencias. Lo que no venga, se queda igual. */
export interface CambiosDePreferencias {
  /** Como quiere que la llamen. */
  readonly nombre?: string | undefined;
  readonly modulosActivos?: readonly string[] | undefined;
  readonly mascota?: Mascota | undefined;
  readonly diarioConRecomendaciones?: boolean | undefined;
}

const LARGO_MAXIMO_DEL_NOMBRE = 100;

/** La zona como la escribe IANA, o falla: una zona que el servidor no conoce no se guarda. */
function validarZona(zona: string): string {
  if (!Calendario.esZonaValida(zona)) {
    throw new InvalidTimeZoneError();
  }

  return Calendario.canonica(zona);
}

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

  /**
   * Si la persona permite que el servidor lea lo que escribe en su diario
   * para recomendarle algo (SCRUM-108).
   *
   * Apagado por defecto, y asi quedan las cuentas que ya existian. Con esto
   * apagado, el diario se guarda y se devuelve, y nada mas: ni se busca una
   * senal de riesgo ni se ofrece nada. Nadie se mete en el diario de nadie
   * sin que lo pida. Solo lo cambia la propia persona, desde su perfil.
   */
  readonly diarioConRecomendaciones: boolean;

  /**
   * Donde esta la persona, como zona IANA (SCRUM-123, ADR 0014).
   *
   * Es lo que decide que dia es para ella: sus actividades, su sendero, su
   * diario, su semaforo y la hora de sus avisos. El dispositivo la informa al
   * entrar, de modo que viajar no obliga a configurar nada.
   */
  readonly zonaHoraria: string;

  /**
   * Cuando se guardo la foto de perfil, o `undefined` si no tiene (SCRUM-120).
   *
   * La foto en si no vive en la cuenta: esta en el almacenamiento de archivos.
   * Aqui solo queda **si hay** y **desde cuando**, que es lo que la pantalla
   * necesita para pedirla y para saber cuando dejo de ser la que tenia
   * guardada.
   */
  readonly fotoActualizadaEl: Date | undefined;

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
    this.diarioConRecomendaciones = datos.diarioConRecomendaciones ?? false;
    this.zonaHoraria = datos.zonaHoraria ?? ZONA_HORARIA_POR_DEFECTO;
    this.fotoActualizadaEl =
      datos.fotoActualizadaEl === undefined
        ? undefined
        : new Date(datos.fotoActualizadaEl.getTime());
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
      zonaHoraria: datos.zonaHoraria === undefined ? undefined : validarZona(datos.zonaHoraria),
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
   * los modulos, la mascota y el permiso sobre el diario: el correo y el rol no
   * se cambian por aqui, y no hay forma de pasarlos.
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
      diarioConRecomendaciones: cambios.diarioConRecomendaciones ?? this.diarioConRecomendaciones,
      zonaHoraria: this.zonaHoraria,
      fotoActualizadaEl: this.fotoActualizadaEl,
    });
  }

  /**
   * La misma cuenta en otra zona horaria.
   *
   * Aparte de `conPreferencias` a proposito: no es algo que la persona elija en
   * una pantalla, sino lo que informa su dispositivo. Devuelve esta misma
   * cuenta si la zona es la que ya tiene, para que quien la llame pueda
   * comparar y no guardar de mas.
   */
  conZonaHoraria(zona: string): User {
    const nueva = validarZona(zona);

    if (nueva === this.zonaHoraria) {
      return this;
    }

    return new User({
      id: this.id,
      correo: this.correo,
      idProveedorAuth: this.idProveedorAuth,
      rol: this.rol,
      consentimiento: this.consentimiento,
      registradoEn: this.registradoEn,
      nombre: this.nombre,
      modulosActivos: this.modulosActivos,
      mascota: this.mascota,
      diarioConRecomendaciones: this.diarioConRecomendaciones,
      zonaHoraria: nueva,
      fotoActualizadaEl: this.fotoActualizadaEl,
    });
  }

  /**
   * La misma cuenta con una foto de perfil guardada ahora (SCRUM-120).
   *
   * Aparte de `conPreferencias` a proposito: la foto no entra por el cuerpo de
   * `PATCH /api/cuenta/preferencias`, que solo acepta lo que la persona escribe.
   * Se sube con su propia ruta, que es la que valida el archivo.
   */
  conFoto(guardadaEl: Date): User {
    return this.copiaCon({ fotoActualizadaEl: guardadaEl });
  }

  /** La misma cuenta sin foto de perfil. Quitar la que no hay deja todo igual. */
  sinFoto(): User {
    return this.fotoActualizadaEl === undefined
      ? this
      : this.copiaCon({ fotoActualizadaEl: undefined });
  }

  private copiaCon(cambios: { readonly fotoActualizadaEl: Date | undefined }): User {
    return new User({
      id: this.id,
      correo: this.correo,
      idProveedorAuth: this.idProveedorAuth,
      rol: this.rol,
      consentimiento: this.consentimiento,
      registradoEn: this.registradoEn,
      nombre: this.nombre,
      modulosActivos: this.modulosActivos,
      mascota: this.mascota,
      diarioConRecomendaciones: this.diarioConRecomendaciones,
      zonaHoraria: this.zonaHoraria,
      fotoActualizadaEl: cambios.fotoActualizadaEl,
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
