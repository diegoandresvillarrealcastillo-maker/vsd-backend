import type { Dia } from './Calendario.js';

/**
 * El historial de un modulo (SCRUM-184): lo que la persona hizo, del mas reciente al mas
 * antiguo, por paginas que arma el servidor.
 *
 * ## Que dice y que no
 *
 * Solo **que** hizo y **cuando**: la actividad, su dia y la hora. Nunca el puntaje, ni el nivel,
 * ni lo que escribio (`metadata`): un historial es una lista de lo hecho y no una lectura de
 * como le fue. Nada castiga ni compara.
 *
 * ## Por que paginas con cursor y no con numero de pagina
 *
 * Mientras alguien lee el historial puede terminar otra actividad, y con numero de pagina eso
 * mueve todo un lugar: se repetiria una fila o se saltaria una. Un cursor (la hora y el
 * identificador del ultimo hecho) no se mueve: la pagina siguiente empieza justo despues.
 */

export const LIMITE_POR_OMISION_DEL_HISTORIAL = 20;
export const LIMITE_MAXIMO_DEL_HISTORIAL = 50;

/** Lo que el almacen devuelve de un resultado para armar el historial. */
export interface FilaDelHistorial {
  readonly id: string;
  readonly idActividad: string;
  /** El dia en la zona que la persona tenia al hacerlo (SCRUM-123). */
  readonly dia: Dia;
  readonly hechaEn: Date;
}

/** Algo que la persona hizo, con el nombre de la actividad, para mostrarlo. */
export interface HechoDelHistorial {
  readonly id: string;
  readonly actividad: { readonly id: string; readonly nombre: string };
  readonly dia: Dia;
  readonly hechaEn: Date;
}

/** Desde donde sigue la pagina siguiente: el ultimo hecho de la anterior. */
export interface PuntoDeLaPagina {
  readonly hechaEn: Date;
  readonly id: string;
}

export interface PaginaDelHistorial {
  readonly hechos: readonly HechoDelHistorial[];
  /** El texto para pedir la siguiente pagina, o `null` si no hay mas. */
  readonly siguiente: string | null;
}

const FECHA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const IDENTIFICADOR = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

/** El texto opaco que el cliente devuelve para pedir la pagina siguiente. */
export function codificarLaPagina(punto: PuntoDeLaPagina): string {
  return Buffer.from(`${punto.hechaEn.toISOString()}|${punto.id}`).toString('base64url');
}

/**
 * Lo contrario de `codificarLaPagina`, o `null` si el texto no es uno que este sistema haya
 * dado: el cliente lo manda de vuelta y no se le cree.
 */
export function decodificarLaPagina(texto: string): PuntoDeLaPagina | null {
  if (!/^[A-Za-z0-9_-]+$/u.test(texto)) {
    return null;
  }

  const partes = Buffer.from(texto, 'base64url').toString('utf8').split('|');

  if (partes.length !== 2) {
    return null;
  }

  const [fecha, id] = partes as [string, string];

  if (!FECHA.test(fecha) || !IDENTIFICADOR.test(id)) {
    return null;
  }

  const hechaEn = new Date(fecha);

  // `new Date` acepta algunos dias que no existen y los corre: se descarta lo que no vuelve igual.
  if (Number.isNaN(hechaEn.getTime()) || hechaEn.toISOString() !== fecha) {
    return null;
  }

  return { hechaEn, id: id.toLowerCase() };
}

/** El limite que se pidio, acotado: nunca menos de uno ni mas del maximo. */
export function limiteDelHistorial(pedido: number | undefined): number {
  if (pedido === undefined || Number.isNaN(pedido)) {
    return LIMITE_POR_OMISION_DEL_HISTORIAL;
  }

  return Math.min(LIMITE_MAXIMO_DEL_HISTORIAL, Math.max(1, Math.floor(pedido)));
}
