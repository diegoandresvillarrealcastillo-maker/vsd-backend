import { Calendario, type Dia } from './Calendario.js';
import { InvalidTaskError } from './DomainError.js';
import type { ClientOperationId, PendienteId, UserId } from './Identifier.js';

/**
 * Un pendiente del semaforo (SCRUM-97).
 *
 * Tres colores: **urgente**, **prioridad** y **aplazable**. La persona elige
 * el suyo y solo ella lo cambia: el sistema puede sugerir subirlo, nunca lo
 * sube solo.
 *
 * ## Cada color es un plazo
 *
 * Asi lo definio Diego (SCRUM-107): **urgente** es para esta semana,
 * **prioridad** para entre 7 y 21 dias, y **aplazable** para 21 dias o mas.
 *
 * ## Recordatorios con calma
 *
 * Un pendiente sin hacer recuerda que sigue ahi cuando se le acaba el plazo:
 * a los 7 dias si es urgente, a los 21 si es prioridad y a los 30 si es
 * aplazable. El del aplazable es el suave: no es urgente, pero que no se
 * acumule. Es un recordatorio, no una alarma, y por eso hay uno por visita
 * como mucho (ver `elegirRecordatorio`). Posponerlo lo calla hasta la fecha
 * elegida.
 *
 * ## La fecha limite es opcional (SCRUM-119)
 *
 * Un pendiente puede tener un dia limite, o no tenerlo: hay cosas que no
 * vencen un dia concreto, como una tarea recurrente o algo general. Sin fecha,
 * todo funciona como antes. Con fecha, el recordatorio no espera los 7, 21 o 30
 * dias del color: llega cuando llega ese dia, que es el plazo que la persona
 * eligio. La fecha es un dia del calendario de la persona y no un instante:
 * "el 12" es el 12 donde ella esta.
 */
export const NivelDePendiente = {
  URGENTE: 'urgente',
  PRIORIDAD: 'prioridad',
  APLAZABLE: 'aplazable',
} as const;

export type NivelDePendiente = (typeof NivelDePendiente)[keyof typeof NivelDePendiente];

const NIVELES: readonly NivelDePendiente[] = Object.values(NivelDePendiente);

/** Cuantos dias espera cada nivel antes de recordar: el final de su plazo. */
export const DIAS_PARA_RECORDAR: Readonly<Record<NivelDePendiente, number>> = {
  urgente: 7,
  prioridad: 21,
  aplazable: 30,
};

/**
 * Como suena el recordatorio. `plazo`: se acabo el tiempo que se le dio.
 * `suave`: no es urgente, pero que no se acumule. Lo redacta la pantalla.
 */
export type TonoDelRecordatorio = 'plazo' | 'suave';

const TONO: Readonly<Record<NivelDePendiente, TonoDelRecordatorio>> = {
  urgente: 'plazo',
  prioridad: 'plazo',
  aplazable: 'suave',
};

/** Lo que se sugiere al recordar: subir un escalon. Urgente ya no tiene donde subir. */
const NIVEL_SUGERIDO: Readonly<Record<NivelDePendiente, NivelDePendiente | null>> = {
  urgente: null,
  prioridad: 'urgente',
  aplazable: 'prioridad',
};

/** Coincide con la columna `texto`, VARCHAR(280). */
export const LARGO_MAXIMO_DEL_TEXTO = 280;

/** Posponer es para un rato, no para olvidarlo: como mucho tres meses. */
export const DIAS_MAXIMOS_PARA_POSPONER = 90;

const UN_DIA_EN_MS = 24 * 60 * 60 * 1000;

// Saltos de linea, tabuladores y demas caracteres de control: un pendiente
// es una linea.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f]/u;

export function esNivelDePendiente(valor: string): valor is NivelDePendiente {
  return (NIVELES as readonly string[]).includes(valor);
}

function textoLimpio(texto: string): string {
  const limpio = texto.trim();

  if (limpio === '') {
    throw new InvalidTaskError('el texto está vacío');
  }

  if ([...limpio].length > LARGO_MAXIMO_DEL_TEXTO) {
    throw new InvalidTaskError(`el texto admite como mucho ${LARGO_MAXIMO_DEL_TEXTO} caracteres`);
  }

  if (CONTROL.test(limpio)) {
    throw new InvalidTaskError('el texto tiene que ser una sola línea');
  }

  return limpio;
}

function nivelValido(nivel: string): NivelDePendiente {
  if (!esNivelDePendiente(nivel)) {
    throw new InvalidTaskError('el nivel tiene que ser urgente, prioridad o aplazable');
  }

  return nivel;
}

/** La fecha limite como dia real AAAA-MM-DD, o falla: "2026-02-30" no existe. */
function fechaLimiteValida(fecha: string): Dia {
  if (!Calendario.esDia(fecha)) {
    throw new InvalidTaskError('la fecha límite tiene que ser un día real, con formato AAAA-MM-DD');
  }

  return fecha;
}

/** Lo que dice un recordatorio. Se calcula al consultar; no se guarda. */
export interface Recordatorio {
  readonly pendienteId: PendienteId;
  readonly nivel: NivelDePendiente;
  /** Dias completos desde que se anoto. */
  readonly dias: number;
  /** El nivel que se sugiere, o `null` si ya es urgente. Nunca se aplica solo. */
  readonly nivelSugerido: NivelDePendiente | null;
  readonly tono: TonoDelRecordatorio;
  /**
   * El dia limite que llego, o `null` si el recordatorio es por los dias del
   * color (SCRUM-119). La pantalla lo dice distinto: "llego el dia" no es lo
   * mismo que "ya lleva un tiempo".
   */
  readonly fechaLimite: Dia | null;
}

/** Si la edicion trae algo que cambiar. */
function traeCambios(cambios: CambiosDePendiente): boolean {
  return (
    cambios.texto !== undefined ||
    cambios.nivel !== undefined ||
    cambios.hecho !== undefined ||
    cambios.posponerHasta !== undefined ||
    cambios.fechaLimite !== undefined
  );
}

/**
 * Si la edicion **solo** marca el pendiente como hecho (SCRUM-134).
 *
 * Es la unica que no entra en conflicto con lo que otro dispositivo haya
 * cambiado: marcar algo como hecho es un hecho que ocurrio, no una opinion, y
 * se lleva bien con cualquier otro cambio (el texto, el color, la fecha). Si
 * un dispositivo lo marco sin conexion mientras otro le cambiaba el texto, no
 * hay nada que preguntarle a la persona: sigue hecho y con el texto nuevo.
 *
 * Reabrirlo (`hecho: false`) no es asi: depende de lo que se vio, y se trata
 * como cualquier otra edicion.
 */
export function soloMarcaComoHecho(cambios: CambiosDePendiente): boolean {
  return (
    cambios.hecho === true &&
    cambios.texto === undefined &&
    cambios.nivel === undefined &&
    cambios.posponerHasta === undefined &&
    cambios.fechaLimite === undefined
  );
}

export interface DatosDePendiente {
  readonly id: PendienteId;
  readonly userId: UserId;
  readonly clientOperationId: ClientOperationId;
  readonly texto: string;
  readonly nivel: NivelDePendiente;
  readonly hecho: boolean;
  readonly posponerHasta: Date | undefined;
  /** Dia limite, en el calendario de la persona. Sin el, no vence un dia concreto. */
  readonly fechaLimite: Dia | undefined;
  /**
   * Empieza en 1 y sube en uno con cada edicion (SCRUM-134). Sirve para saber
   * que otro dispositivo lo cambio entretanto.
   */
  readonly version: number;
  readonly creadoEn: Date;
  readonly editadoEn: Date;
}

/** Lo que cambia una edicion. Lo que no viene se queda; `posponerHasta: null` deja de posponer. */
export interface CambiosDePendiente {
  readonly texto?: string | undefined;
  readonly nivel?: string | undefined;
  readonly hecho?: boolean | undefined;
  readonly posponerHasta?: Date | null | undefined;
  /** AAAA-MM-DD. `null` quita la fecha limite. */
  readonly fechaLimite?: string | null | undefined;
}

export class Pendiente {
  readonly id: PendienteId;
  readonly userId: UserId;
  readonly clientOperationId: ClientOperationId;
  readonly texto: string;
  readonly nivel: NivelDePendiente;
  readonly hecho: boolean;
  readonly posponerHasta: Date | undefined;
  readonly fechaLimite: Dia | undefined;
  readonly version: number;
  readonly creadoEn: Date;
  readonly editadoEn: Date;

  private constructor(datos: DatosDePendiente) {
    this.id = datos.id;
    this.userId = datos.userId;
    this.clientOperationId = datos.clientOperationId;
    this.texto = datos.texto;
    this.nivel = datos.nivel;
    this.hecho = datos.hecho;
    this.posponerHasta =
      datos.posponerHasta === undefined ? undefined : new Date(datos.posponerHasta.getTime());
    this.fechaLimite = datos.fechaLimite;
    this.version = datos.version;
    this.creadoEn = new Date(datos.creadoEn.getTime());
    this.editadoEn = new Date(datos.editadoEn.getTime());
  }

  static nuevo(
    datos: Pick<DatosDePendiente, 'id' | 'userId' | 'clientOperationId'> & {
      readonly texto: string;
      readonly nivel: string;
      readonly fechaLimite?: string | undefined;
    },
    ahora: Date,
  ): Pendiente {
    return new Pendiente({
      ...datos,
      texto: textoLimpio(datos.texto),
      nivel: nivelValido(datos.nivel),
      hecho: false,
      posponerHasta: undefined,
      fechaLimite:
        datos.fechaLimite === undefined ? undefined : fechaLimiteValida(datos.fechaLimite),
      version: 1,
      creadoEn: ahora,
      editadoEn: ahora,
    });
  }

  /** Uno que ya estaba guardado. */
  static guardado(datos: DatosDePendiente): Pendiente {
    return new Pendiente(datos);
  }

  editar(cambios: CambiosDePendiente, ahora: Date): Pendiente {
    if (!traeCambios(cambios)) {
      throw new InvalidTaskError('la edición no trae nada que cambiar');
    }

    return new Pendiente({
      ...this,
      texto: cambios.texto === undefined ? this.texto : textoLimpio(cambios.texto),
      nivel: cambios.nivel === undefined ? this.nivel : nivelValido(cambios.nivel),
      hecho: cambios.hecho ?? this.hecho,
      posponerHasta: this.nuevaFechaParaPosponer(cambios.posponerHasta, ahora),
      fechaLimite: this.nuevaFechaLimite(cambios.fechaLimite),
      version: this.version + 1,
      editadoEn: ahora,
    });
  }

  /**
   * Si este pendiente ya esta como lo pide la edicion (SCRUM-134).
   *
   * Importa por los reintentos: sin conexion, una edicion se envia, el servidor
   * la aplica y la respuesta se pierde. El dispositivo la reenvia con la version
   * de antes, que ya no coincide, y sin esta comprobacion se toparia con un
   * conflicto contra si mismo. Si el pendiente ya tiene lo que se pide, ya esta
   * hecho y no hay nada que decidir. Tambien cubre a dos dispositivos que
   * coinciden sin saberlo.
   *
   * Una edicion vacia nunca "ya esta": esa es un error y lo dice `editar`.
   */
  yaTiene(cambios: CambiosDePendiente): boolean {
    if (!traeCambios(cambios)) {
      return false;
    }

    return (
      (cambios.texto === undefined || cambios.texto.trim() === this.texto) &&
      (cambios.nivel === undefined || cambios.nivel === this.nivel) &&
      (cambios.hecho === undefined || cambios.hecho === this.hecho) &&
      (cambios.posponerHasta === undefined ||
        (cambios.posponerHasta === null
          ? this.posponerHasta === undefined
          : this.posponerHasta?.getTime() === cambios.posponerHasta.getTime())) &&
      (cambios.fechaLimite === undefined ||
        (cambios.fechaLimite === null
          ? this.fechaLimite === undefined
          : this.fechaLimite === cambios.fechaLimite))
    );
  }

  perteneceA(userId: UserId): boolean {
    return this.userId.equals(userId);
  }

  /**
   * Si toca recordarlo ahora.
   *
   * No, si esta hecho o si esta pospuesto. Despues, depende de si tiene fecha
   * limite (SCRUM-119):
   *
   * - **Con fecha**, toca desde ese dia en adelante. `hoy` es el dia de la
   *   persona, en su zona: el mismo instante es un dia distinto en cada sitio.
   *   El tono es el del plazo, porque el plazo lo puso ella.
   * - **Sin fecha**, cuando pasan los dias de su color desde que se anoto.
   */
  recordatorio(ahora: Date, hoy: Dia): Recordatorio | null {
    if (this.hecho) {
      return null;
    }

    if (this.posponerHasta !== undefined && ahora.getTime() < this.posponerHasta.getTime()) {
      return null;
    }

    const dias = Math.floor((ahora.getTime() - this.creadoEn.getTime()) / UN_DIA_EN_MS);

    if (this.fechaLimite !== undefined) {
      // Los dias AAAA-MM-DD se ordenan como texto.
      if (hoy < this.fechaLimite) {
        return null;
      }

      return {
        pendienteId: this.id,
        nivel: this.nivel,
        dias,
        nivelSugerido: NIVEL_SUGERIDO[this.nivel],
        tono: 'plazo',
        fechaLimite: this.fechaLimite,
      };
    }

    if (dias < DIAS_PARA_RECORDAR[this.nivel]) {
      return null;
    }

    return {
      pendienteId: this.id,
      nivel: this.nivel,
      dias,
      nivelSugerido: NIVEL_SUGERIDO[this.nivel],
      tono: TONO[this.nivel],
      fechaLimite: null,
    };
  }

  private nuevaFechaLimite(pedida: string | null | undefined): Dia | undefined {
    if (pedida === undefined) {
      return this.fechaLimite;
    }

    return pedida === null ? undefined : fechaLimiteValida(pedida);
  }

  private nuevaFechaParaPosponer(pedida: Date | null | undefined, ahora: Date): Date | undefined {
    if (pedida === undefined) {
      return this.posponerHasta;
    }

    if (pedida === null) {
      return undefined;
    }

    if (Number.isNaN(pedida.getTime()) || pedida.getTime() <= ahora.getTime()) {
      throw new InvalidTaskError('solo se puede posponer hasta una fecha futura');
    }

    if (pedida.getTime() - ahora.getTime() > DIAS_MAXIMOS_PARA_POSPONER * UN_DIA_EN_MS) {
      throw new InvalidTaskError(`se puede posponer como mucho ${DIAS_MAXIMOS_PARA_POSPONER} días`);
    }

    return pedida;
  }
}

/**
 * El recordatorio de esta visita: uno como mucho.
 *
 * Primero los urgentes, despues las prioridades y al final los aplazables; en
 * el mismo nivel, el mas antiguo. Un aviso cada vez se lee; cinco a la vez
 * se ignoran todos.
 */
export function elegirRecordatorio(
  pendientes: readonly Pendiente[],
  ahora: Date,
  hoy: Dia,
): Recordatorio | null {
  const candidatos = pendientes
    .map((pendiente) => ({ pendiente, recordatorio: pendiente.recordatorio(ahora, hoy) }))
    .filter(
      (uno): uno is { pendiente: Pendiente; recordatorio: Recordatorio } =>
        uno.recordatorio !== null,
    )
    .sort(
      (uno, otro) =>
        NIVELES.indexOf(uno.pendiente.nivel) - NIVELES.indexOf(otro.pendiente.nivel) ||
        uno.pendiente.creadoEn.getTime() - otro.pendiente.creadoEn.getTime(),
    );

  return candidatos[0]?.recordatorio ?? null;
}
