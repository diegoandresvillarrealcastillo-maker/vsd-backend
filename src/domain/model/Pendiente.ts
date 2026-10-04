import { InvalidTaskError } from './DomainError.js';
import type { ClientOperationId, PendienteId, UserId } from './Identifier.js';

/**
 * Un pendiente del semaforo (SCRUM-97).
 *
 * Tres colores: **urgente**, **prioridad** y **aplazable**. La persona elige
 * el suyo y solo ella lo cambia: el sistema puede sugerir subirlo, nunca lo
 * sube solo.
 *
 * ## Recordatorios con calma
 *
 * Un pendiente sin hacer recuerda que sigue ahi pasado un tiempo desde que se
 * anoto: 7 dias si es urgente, 14 si es aplazable y 30 si es prioridad. Es
 * un recordatorio, no una alarma, y por eso hay uno por visita como mucho
 * (ver `elegirRecordatorio`). Posponerlo lo calla hasta la fecha elegida.
 */
export const NivelDePendiente = {
  URGENTE: 'urgente',
  PRIORIDAD: 'prioridad',
  APLAZABLE: 'aplazable',
} as const;

export type NivelDePendiente = (typeof NivelDePendiente)[keyof typeof NivelDePendiente];

const NIVELES: readonly NivelDePendiente[] = Object.values(NivelDePendiente);

/** Cuantos dias espera cada nivel antes de recordar. */
export const DIAS_PARA_RECORDAR: Readonly<Record<NivelDePendiente, number>> = {
  urgente: 7,
  prioridad: 30,
  aplazable: 14,
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

/** Lo que dice un recordatorio. Se calcula al consultar; no se guarda. */
export interface Recordatorio {
  readonly pendienteId: PendienteId;
  readonly nivel: NivelDePendiente;
  /** Dias completos desde que se anoto. */
  readonly dias: number;
  /** El nivel que se sugiere, o `null` si ya es urgente. Nunca se aplica solo. */
  readonly nivelSugerido: NivelDePendiente | null;
}

export interface DatosDePendiente {
  readonly id: PendienteId;
  readonly userId: UserId;
  readonly clientOperationId: ClientOperationId;
  readonly texto: string;
  readonly nivel: NivelDePendiente;
  readonly hecho: boolean;
  readonly posponerHasta: Date | undefined;
  readonly creadoEn: Date;
  readonly editadoEn: Date;
}

/** Lo que cambia una edicion. Lo que no viene se queda; `posponerHasta: null` deja de posponer. */
export interface CambiosDePendiente {
  readonly texto?: string | undefined;
  readonly nivel?: string | undefined;
  readonly hecho?: boolean | undefined;
  readonly posponerHasta?: Date | null | undefined;
}

export class Pendiente {
  readonly id: PendienteId;
  readonly userId: UserId;
  readonly clientOperationId: ClientOperationId;
  readonly texto: string;
  readonly nivel: NivelDePendiente;
  readonly hecho: boolean;
  readonly posponerHasta: Date | undefined;
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
    this.creadoEn = new Date(datos.creadoEn.getTime());
    this.editadoEn = new Date(datos.editadoEn.getTime());
  }

  static nuevo(
    datos: Pick<DatosDePendiente, 'id' | 'userId' | 'clientOperationId'> & {
      readonly texto: string;
      readonly nivel: string;
    },
    ahora: Date,
  ): Pendiente {
    return new Pendiente({
      ...datos,
      texto: textoLimpio(datos.texto),
      nivel: nivelValido(datos.nivel),
      hecho: false,
      posponerHasta: undefined,
      creadoEn: ahora,
      editadoEn: ahora,
    });
  }

  /** Uno que ya estaba guardado. */
  static guardado(datos: DatosDePendiente): Pendiente {
    return new Pendiente(datos);
  }

  editar(cambios: CambiosDePendiente, ahora: Date): Pendiente {
    if (
      cambios.texto === undefined &&
      cambios.nivel === undefined &&
      cambios.hecho === undefined &&
      cambios.posponerHasta === undefined
    ) {
      throw new InvalidTaskError('la edición no trae nada que cambiar');
    }

    return new Pendiente({
      ...this,
      texto: cambios.texto === undefined ? this.texto : textoLimpio(cambios.texto),
      nivel: cambios.nivel === undefined ? this.nivel : nivelValido(cambios.nivel),
      hecho: cambios.hecho ?? this.hecho,
      posponerHasta: this.nuevaFechaParaPosponer(cambios.posponerHasta, ahora),
      editadoEn: ahora,
    });
  }

  perteneceA(userId: UserId): boolean {
    return this.userId.equals(userId);
  }

  /**
   * Si toca recordarlo ahora.
   *
   * No, si esta hecho, si esta pospuesto o si todavia no paso el tiempo de su
   * nivel desde que se anoto.
   */
  recordatorio(ahora: Date): Recordatorio | null {
    if (this.hecho) {
      return null;
    }

    if (this.posponerHasta !== undefined && ahora.getTime() < this.posponerHasta.getTime()) {
      return null;
    }

    const dias = Math.floor((ahora.getTime() - this.creadoEn.getTime()) / UN_DIA_EN_MS);

    if (dias < DIAS_PARA_RECORDAR[this.nivel]) {
      return null;
    }

    return {
      pendienteId: this.id,
      nivel: this.nivel,
      dias,
      nivelSugerido: NIVEL_SUGERIDO[this.nivel],
    };
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
): Recordatorio | null {
  const candidatos = pendientes
    .map((pendiente) => ({ pendiente, recordatorio: pendiente.recordatorio(ahora) }))
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
