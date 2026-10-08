import { Calendario, ZONA_HORARIA_POR_DEFECTO } from './Calendario.js';
import {
  FutureConsentDateError,
  InvalidNameError,
  InvalidPetError,
  InvalidRoleError,
  InvalidTimeZoneError,
  MissingConsentError,
} from './DomainError.js';
import type { FechaDeNacimiento } from './FechaDeNacimiento.js';
import { UserId } from './Identifier.js';
import {
  crearMascota,
  elegirModulos,
  FORMA_DE_LA_MASCOTA_PROPIA,
  FORMA_POR_DEFECTO_DE_LA_MASCOTA,
  type Mascota,
  type Modulo,
} from './Preferencias.js';

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

/** Lo que una persona puede aceptar: son dos documentos y cada uno cambia por su lado. */
export const TipoDeConsentimiento = {
  AVISO_DE_PRIVACIDAD: 'aviso_de_privacidad',
  TERMINOS: 'terminos',
} as const;

export type TipoDeConsentimiento = (typeof TipoDeConsentimiento)[keyof typeof TipoDeConsentimiento];

/**
 * Una aceptacion del historial: que se acepto, que version y cuando.
 *
 * La cuenta guarda lo vigente; el historial guarda todo lo que se acepto
 * alguna vez, y solo admite altas (L-05 de la auditoria 360).
 */
export interface ConsentimientoAceptado {
  readonly tipo: TipoDeConsentimiento;
  readonly version: string;
  readonly aceptadoEn: Date;
}

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

/**
 * Lo que una persona declara y acepta para quedar registrada: su fecha de
 * nacimiento y, con casillas explicitas, el aviso de privacidad y los terminos.
 *
 * Una cuenta que no lo tiene —las anteriores a que se pidiera— no esta
 * completa y no puede usar nada hasta tenerlo (`User.registroCompleto`).
 */
export interface RegistroDeLaPersona {
  readonly fechaDeNacimiento: FechaDeNacimiento;
  readonly consentimiento: Consentimiento;
  readonly terminos: Consentimiento;
}

/** Datos necesarios para registrar una cuenta. */
export interface DatosDeUsuario {
  readonly id: UserId;
  readonly correo: string;
  readonly idProveedorAuth: string;
  readonly rol: Rol;
  readonly consentimiento?: Consentimiento | undefined;
  /**
   * Los terminos que acepto, con su version y su fecha, igual que el aviso. Sin
   * ellos —las cuentas anteriores— el registro esta incompleto.
   */
  readonly terminos?: Consentimiento | undefined;
  /** Lo que declaro. Sin ella —las cuentas anteriores— el registro esta incompleto. */
  readonly fechaDeNacimiento?: FechaDeNacimiento | undefined;
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
  /** Cuando se guardo su mascota propia (SCRUM-122). Sin ella, no tiene. */
  readonly mascotaPropiaActualizadaEl?: Date | undefined;
}

/**
 * Lo que `copiaCon` puede cambiar de una cuenta. Un campo que no viene se queda
 * como estaba; uno que viene como `undefined` se vacia.
 */
interface Cambios {
  readonly consentimiento?: Consentimiento | undefined;
  readonly terminos?: Consentimiento | undefined;
  readonly fechaDeNacimiento?: FechaDeNacimiento | undefined;
  readonly nombre?: string | undefined;
  readonly modulosActivos?: readonly Modulo[] | undefined;
  readonly mascota?: Mascota | undefined;
  readonly diarioConRecomendaciones?: boolean | undefined;
  readonly zonaHoraria?: string | undefined;
  readonly fotoActualizadaEl?: Date | undefined;
  readonly mascotaPropiaActualizadaEl?: Date | undefined;
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
  readonly terminos: Consentimiento | undefined;
  readonly fechaDeNacimiento: FechaDeNacimiento | undefined;
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

  /**
   * Cuando se guardo la mascota propia, o `undefined` si no tiene (SCRUM-122).
   *
   * Como la foto, el archivo (un SVG) esta en el almacenamiento y aqui solo
   * queda **si hay** y **desde cuando**. Elegirla como mascota
   * (`mascota.forma === 'propia'`) exige que haya.
   */
  readonly mascotaPropiaActualizadaEl: Date | undefined;

  private constructor(datos: DatosDeUsuario & { readonly modulosActivos: readonly Modulo[] }) {
    this.id = datos.id;
    this.correo = datos.correo;
    this.idProveedorAuth = datos.idProveedorAuth;
    this.rol = datos.rol;
    this.consentimiento = datos.consentimiento;
    this.terminos = datos.terminos;
    this.fechaDeNacimiento = datos.fechaDeNacimiento;
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
    this.mascotaPropiaActualizadaEl =
      datos.mascotaPropiaActualizadaEl === undefined
        ? undefined
        : new Date(datos.mascotaPropiaActualizadaEl.getTime());
  }

  static create(datos: DatosDeUsuario, ahora: Date = new Date()): User {
    if (!Object.values(Rol).includes(datos.rol)) {
      throw new InvalidRoleError(String(datos.rol));
    }

    // Los terminos se validan como el aviso: una version vacia o una fecha del
    // futuro no son una aceptacion.
    for (const aceptado of [datos.consentimiento, datos.terminos]) {
      if (aceptado === undefined) {
        continue;
      }

      if (aceptado.versionPolitica.trim() === '') {
        throw new MissingConsentError();
      }

      if (aceptado.aceptadoEn.getTime() > ahora.getTime()) {
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
   * Si la persona declaro su fecha de nacimiento y acepto, con casillas, el aviso
   * y los terminos.
   *
   * Es lo que separa una cuenta que puede usar la aplicacion de una que primero
   * tiene que completar su registro. Las cuentas anteriores a que se pidiera no
   * lo estan: la fecha no existia, y el consentimiento de muchas se registro
   * solo al entrar, sin que nadie marcara nada (S-02 de la auditoria 360).
   */
  registroCompleto(): boolean {
    return this.fechaDeNacimiento !== undefined && this.terminos !== undefined;
  }

  /**
   * La misma cuenta con su registro completado.
   *
   * Reemplaza el consentimiento que hubiera por el nuevo, que es el que la
   * persona dio con una casilla. El anterior no se pierde: queda en el
   * historial de consentimientos, que solo admite altas.
   */
  conRegistroCompleto(registro: RegistroDeLaPersona, ahora: Date = new Date()): User {
    for (const aceptado of [registro.consentimiento, registro.terminos]) {
      if (aceptado.versionPolitica.trim() === '') {
        throw new MissingConsentError();
      }

      if (aceptado.aceptadoEn.getTime() > ahora.getTime()) {
        throw new FutureConsentDateError();
      }
    }

    return this.copiaCon({
      fechaDeNacimiento: registro.fechaDeNacimiento,
      consentimiento: registro.consentimiento,
      terminos: registro.terminos,
    });
  }

  /**
   * La misma cuenta con otras preferencias.
   *
   * Devuelve una cuenta nueva en lugar de modificar esta. Solo toca el nombre,
   * los modulos, la mascota y el permiso sobre el diario: el correo y el rol no
   * se cambian por aqui, y no hay forma de pasarlos.
   */
  conPreferencias(cambios: CambiosDePreferencias): User {
    const mascota = cambios.mascota === undefined ? undefined : crearMascota(cambios.mascota);

    // Elegir la mascota propia sin haberla subido dejaria a la persona con un
    // dibujo que no existe.
    if (
      mascota?.forma === FORMA_DE_LA_MASCOTA_PROPIA &&
      this.mascotaPropiaActualizadaEl === undefined
    ) {
      throw new InvalidPetError('primero hay que subir tu mascota propia');
    }

    return this.copiaCon({
      nombre: cambios.nombre === undefined ? this.nombre : validarNombre(cambios.nombre),
      modulosActivos:
        cambios.modulosActivos === undefined
          ? this.modulosActivos
          : elegirModulos(cambios.modulosActivos),
      mascota: mascota ?? this.mascota,
      diarioConRecomendaciones: cambios.diarioConRecomendaciones ?? this.diarioConRecomendaciones,
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

    return nueva === this.zonaHoraria ? this : this.copiaCon({ zonaHoraria: nueva });
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

  /**
   * La misma cuenta con una mascota propia guardada ahora (SCRUM-122). No la
   * elige como mascota: eso lo hace `conPreferencias`, y exige que exista.
   */
  conMascotaPropia(guardadaEl: Date): User {
    return this.copiaCon({ mascotaPropiaActualizadaEl: guardadaEl });
  }

  /**
   * La misma cuenta sin mascota propia.
   *
   * Si era la mascota elegida, la persona vuelve al personaje de siempre y
   * **conserva el nombre** que le habia puesto: no se queda con una mascota que
   * ya no tiene dibujo. Quitar la que no hay, y no estar elegida, deja todo
   * igual.
   */
  sinMascotaPropia(): User {
    const eraLaElegida = this.mascota?.forma === FORMA_DE_LA_MASCOTA_PROPIA;

    if (this.mascotaPropiaActualizadaEl === undefined && !eraLaElegida) {
      return this;
    }

    return this.copiaCon({
      mascotaPropiaActualizadaEl: undefined,
      mascota:
        eraLaElegida && this.mascota !== undefined
          ? { ...this.mascota, forma: FORMA_POR_DEFECTO_DE_LA_MASCOTA }
          : this.mascota,
    });
  }

  /**
   * La misma cuenta con lo que se diga cambiado, y **todo lo demas igual**.
   *
   * Es el unico sitio donde se reconstruye una cuenta a partir de otra, a
   * proposito. Antes cada metodo copiaba campo por campo, y cada campo nuevo
   * obligaba a acordarse de sumarlo a todos: quien se olvidaba hacia que, por
   * ejemplo, guardar el nombre borrara la foto. Aqui un campo nuevo se
   * conserva solo y hay que decidir expresamente cambiarlo.
   */
  private copiaCon(cambios: Cambios): User {
    const cambia = (clave: keyof Cambios): boolean => Object.hasOwn(cambios, clave);

    return new User({
      id: this.id,
      correo: this.correo,
      idProveedorAuth: this.idProveedorAuth,
      rol: this.rol,
      consentimiento: cambia('consentimiento') ? cambios.consentimiento : this.consentimiento,
      terminos: cambia('terminos') ? cambios.terminos : this.terminos,
      fechaDeNacimiento: cambia('fechaDeNacimiento')
        ? cambios.fechaDeNacimiento
        : this.fechaDeNacimiento,
      registradoEn: this.registradoEn,
      nombre: cambia('nombre') ? cambios.nombre : this.nombre,
      modulosActivos: cambia('modulosActivos')
        ? (cambios.modulosActivos ?? [])
        : this.modulosActivos,
      mascota: cambia('mascota') ? cambios.mascota : this.mascota,
      diarioConRecomendaciones: cambia('diarioConRecomendaciones')
        ? cambios.diarioConRecomendaciones
        : this.diarioConRecomendaciones,
      zonaHoraria: cambia('zonaHoraria') ? cambios.zonaHoraria : this.zonaHoraria,
      fotoActualizadaEl: cambia('fotoActualizadaEl')
        ? cambios.fotoActualizadaEl
        : this.fotoActualizadaEl,
      mascotaPropiaActualizadaEl: cambia('mascotaPropiaActualizadaEl')
        ? cambios.mascotaPropiaActualizadaEl
        : this.mascotaPropiaActualizadaEl,
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
