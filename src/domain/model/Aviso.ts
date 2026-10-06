import { InvalidNotificationSettingError } from './DomainError.js';
import type { UserId } from './Identifier.js';

/**
 * Los avisos que la aplicacion manda aunque no este abierta (SCRUM-102).
 *
 * Dos clases, y cada una se enciende, se cambia de hora y se apaga por
 * separado:
 *
 * - **semaforo**: los pendientes sin hacer, a la hora que la persona elija;
 * - **racha**: una vez al dia, si ese dia todavia no hizo ninguna actividad.
 *
 * ## Nada de salud
 *
 * Un aviso aparece en la pantalla bloqueada, a la vista de quien este al
 * lado. Por eso solo dicen cuantos pendientes hay y como se llaman, o invitan
 * a un rato para la persona. Nunca un resultado, un nivel, una emocion ni
 * nada que salga de una actividad.
 */

export const TipoDeAviso = {
  SEMAFORO: 'semaforo',
  RACHA: 'racha',
} as const;

export type TipoDeAviso = (typeof TipoDeAviso)[keyof typeof TipoDeAviso];

export const MINUTOS_DEL_DIA = 24 * 60;

const HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** "08:30" a 510. Lanza si no es una hora del dia con formato HH:MM. */
export function minutoDeHora(hora: string): number {
  const coincidencia = HORA.exec(hora);

  if (coincidencia === null) {
    throw new InvalidNotificationSettingError(
      'la hora tiene que tener el formato HH:MM, de 00:00 a 23:59',
    );
  }

  return Number(coincidencia[1]) * 60 + Number(coincidencia[2]);
}

/** 510 a "08:30". */
export function horaDeMinuto(minuto: number): string {
  const horas = Math.floor(minuto / 60);
  const minutos = minuto % 60;

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

/** A que hora quiere cada aviso. `null` es apagado. */
export interface PreferenciasDeAviso {
  readonly userId: UserId;
  /** Minutos desde la medianoche, en la zona horaria de la persona. */
  readonly minutoSemaforo: number | null;
  readonly minutoRacha: number | null;
  /**
   * La zona en que se leen esas horas (SCRUM-123): las 8:00 de Bogota no son
   * las 8:00 de Madrid. Es la de la cuenta; en PostgreSQL la copia la base.
   */
  readonly zonaHoraria: string;
}

/**
 * Un navegador donde la persona acepto los avisos: la direccion de su
 * servicio de push y las claves para cifrar lo que se le manda.
 */
export interface SuscripcionPush {
  readonly endpoint: string;
  readonly p256dh: string;
  readonly auth: string;
}

/** Las claves vienen en base64 para URL; ninguna real pasa de unos cien caracteres. */
const CLAVE = /^[A-Za-z0-9_-]{1,200}={0,2}$/;
const LARGO_MAXIMO_DEL_ENDPOINT = 1000;

/** Comprueba una suscripcion que llega del navegador. */
export function suscripcionValida(suscripcion: SuscripcionPush): SuscripcionPush {
  let direccion: URL;

  try {
    direccion = new URL(suscripcion.endpoint);
  } catch {
    throw new InvalidNotificationSettingError('la direccion del navegador no es una URL');
  }

  if (direccion.protocol !== 'https:') {
    throw new InvalidNotificationSettingError('la direccion del navegador tiene que ser https');
  }

  if (suscripcion.endpoint.length > LARGO_MAXIMO_DEL_ENDPOINT) {
    throw new InvalidNotificationSettingError('la direccion del navegador es demasiado larga');
  }

  if (!CLAVE.test(suscripcion.p256dh) || !CLAVE.test(suscripcion.auth)) {
    throw new InvalidNotificationSettingError('las claves de la suscripcion no son validas');
  }

  return suscripcion;
}

/** Lo que llega a la pantalla del telefono. */
export interface MensajeDeAviso {
  readonly tipo: TipoDeAviso;
  readonly titulo: string;
  readonly cuerpo: string;
  /** A donde lleva tocarlo. */
  readonly ruta: string;
}

/** Cuantos pendientes se nombran; el resto se cuenta. */
const PENDIENTES_QUE_SE_NOMBRAN = 3;

/**
 * El aviso del semaforo, o `null` si no hay nada pendiente: un aviso para
 * decir que no hay nada no le sirve a nadie.
 */
export function mensajeDelSemaforo(pendientes: readonly string[]): MensajeDeAviso | null {
  if (pendientes.length === 0) {
    return null;
  }

  const nombrados = pendientes.slice(0, PENDIENTES_QUE_SE_NOMBRAN).join(' · ');
  const resto = pendientes.length - PENDIENTES_QUE_SE_NOMBRAN;

  return {
    tipo: TipoDeAviso.SEMAFORO,
    titulo:
      pendientes.length === 1
        ? 'Tienes 1 pendiente en tu semáforo'
        : `Tienes ${pendientes.length} pendientes en tu semáforo`,
    cuerpo: resto > 0 ? `${nombrados} y ${resto} más` : nombrados,
    ruta: '/panel',
  };
}

/** El recordatorio de la racha. Invita; no reclama. */
export function mensajeDeLaRacha(): MensajeDeAviso {
  return {
    tipo: TipoDeAviso.RACHA,
    titulo: '¿Un momento para ti hoy?',
    cuerpo: 'Tus actividades de hoy te esperan, cuando quieras.',
    ruta: '/panel',
  };
}
