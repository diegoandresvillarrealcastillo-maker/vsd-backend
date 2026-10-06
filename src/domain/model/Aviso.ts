import type { Dia } from './Calendario.js';
import { InvalidNotificationSettingError } from './DomainError.js';
import type { UserId } from './Identifier.js';
import {
  TEXTOS_DE_LA_MANANA,
  TEXTOS_DE_LA_NOCHE,
  type TextoDeAviso,
} from './TextosDeLosRecordatorios.js';

/**
 * Los avisos que la aplicacion manda aunque no este abierta (SCRUM-102).
 *
 * Cuatro clases, y cada una se enciende y se apaga por separado:
 *
 * - **semaforo**: los pendientes sin hacer, a la hora que la persona elija;
 * - **racha**: una vez al dia, si ese dia todavia no hizo ninguna actividad,
 *   a la hora que la persona elija;
 * - **manana** (SCRUM-126): a las 8:00 de su zona, una invitacion a empezar el
 *   dia;
 * - **noche** (SCRUM-126): a las 20:00 de su zona, solo si ese dia no hizo
 *   ninguna actividad.
 *
 * La manana y la noche tienen la hora fija: se encienden o se apagan, no se
 * mueven. Las horas del semaforo y de la racha las elige cada persona.
 *
 * ## Una sola invitacion al dia
 *
 * La racha y la noche dicen lo mismo con otras palabras ("tus actividades de
 * hoy te esperan"). Si la persona tiene las dos encendidas, la que llegue
 * primero es la unica de ese dia: ver `AvisosRepositoryPort.aQuienLeToca`.
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
  MANANA: 'manana',
  NOCHE: 'noche',
} as const;

export type TipoDeAviso = (typeof TipoDeAviso)[keyof typeof TipoDeAviso];

export const MINUTOS_DEL_DIA = 24 * 60;

/** Las 8:00, en minutos desde la medianoche de la persona. */
export const MINUTO_DE_LA_MANANA = 8 * 60;

/** Las 20:00, en minutos desde la medianoche de la persona. */
export const MINUTO_DE_LA_NOCHE = 20 * 60;

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
  /** Encendido es `MINUTO_DE_LA_MANANA`; la hora no se mueve (SCRUM-126). */
  readonly minutoManana: number | null;
  /** Encendido es `MINUTO_DE_LA_NOCHE`; la hora no se mueve (SCRUM-126). */
  readonly minutoNoche: number | null;
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

const UN_DIA_EN_MS = 24 * 60 * 60 * 1000;

/**
 * Un numero que cambia cada dia y es distinto para cada persona, para elegir
 * cual de los textos le toca (SCRUM-126).
 *
 * Sin azar y sin estado: la misma persona el mismo dia siempre tiene el mismo
 * texto, y dos dias seguidos nunca se repite. Asi las pruebas no dependen de
 * la suerte y no hay nada que guardar. El desfase por persona evita que todas
 * reciban la misma frase el mismo dia.
 */
export function semillaDelAviso(userId: UserId, dia: Dia): number {
  const dias = Math.floor(Date.parse(`${dia}T00:00:00.000Z`) / UN_DIA_EN_MS);
  let desfase = 0;

  for (const caracter of userId.value) {
    desfase = (desfase * 31 + caracter.charCodeAt(0)) % 1000;
  }

  return dias + desfase;
}

function elegir(textos: readonly TextoDeAviso[], semilla: number): TextoDeAviso {
  // `semilla` es un entero no negativo para cualquier dia posterior a 1970; el
  // doble modulo cubre un valor negativo sin salirse del arreglo.
  const posicion = ((semilla % textos.length) + textos.length) % textos.length;

  return textos[posicion] as TextoDeAviso;
}

/** El de las 8:00: invita a empezar el dia. Sale siempre. */
export function mensajeDeLaManana(semilla: number): MensajeDeAviso {
  return { tipo: TipoDeAviso.MANANA, ...elegir(TEXTOS_DE_LA_MANANA, semilla), ruta: '/panel' };
}

/** El de las 20:00: solo se manda si ese dia no hubo ninguna actividad. */
export function mensajeDeLaNoche(semilla: number): MensajeDeAviso {
  return { tipo: TipoDeAviso.NOCHE, ...elegir(TEXTOS_DE_LA_NOCHE, semilla), ruta: '/panel' };
}
