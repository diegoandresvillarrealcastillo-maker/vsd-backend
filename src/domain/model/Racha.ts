import { Calendario, type Dia } from './Calendario.js';

/**
 * La racha: dias seguidos con al menos una actividad (SCRUM-186).
 *
 * ## Una funcion, no un contador
 *
 * Todo sale de "en que dias hizo algo" y "que dia es hoy". No hay una columna
 * `racha` que pueda desincronizarse de los resultados, igual que el sendero
 * (`Sendero.ts`): lo que se ve y el historial no pueden contar cosas distintas.
 * Tampoco hay tabla de congelamientos: se deducen de los huecos, siempre igual.
 *
 * ## Que cuenta
 *
 * - **Un dia cuenta si hubo al menos una actividad**, de cualquier modulo. El "minimo 3"
 *   del dia es una sugerencia de la ruta, no una condicion de la racha (decision D1).
 * - **Hoy no rompe nada hasta que termina.** Si todavia no hizo algo hoy, la cadena de
 *   ayer sigue en pie y no se gasta un congelamiento por un dia en curso.
 * - **Los congelamientos** (D2) cubren un dia sin actividad *dentro de una cadena que ya
 *   empezo*: son tres por **mes calendario**, automaticos, y el dia cubierto no suma.
 *   Al cuarto hueco del mes la cadena se corta: la llama **descansa**, sin mensaje de
 *   perdida, y vuelve a un dia con la siguiente actividad.
 *
 * Los dias llegan ya como dias del calendario local de la persona (`resultado.dia`,
 * SCRUM-123): aqui no hay zonas horarias ni relojes.
 */

/** Cuantos dias sin actividad se cubren por mes calendario. */
export const CONGELAMIENTOS_POR_MES = 3;

/**
 * Los dias minimos de cada nivel de la llama: 7 dias, 1 mes, 3 meses (la etapa de 3 a 6
 * meses y mas) y 1 ano. Debajo de 7 es un ascua.
 */
export const DIAS_POR_NIVEL = [7, 30, 90, 365] as const;

/** 0 es el ascua; 1 a 4 son los cuatro niveles de la llama. */
export type NivelDeLaLlama = 0 | 1 | 2 | 3 | 4;

export interface Racha {
  /** Dias con actividad en la cadena de ahora. */
  readonly dias: number;
  readonly nivel: NivelDeLaLlama;
  /** Si ya hizo algo hoy. */
  readonly hechoHoy: boolean;
  /** La llama descansa: no hay cadena en pie. Es el principio, no un castigo. */
  readonly enDescanso: boolean;
  /** Cuantos congelamientos se usaron en el mes de hoy. */
  readonly congelamientosUsados: number;
  /** Cuantos hay por mes. */
  readonly congelamientosPorMes: number;
  /** Los dias de la cadena de ahora que se cubrieron, del mas viejo al mas nuevo. */
  readonly diasCubiertos: readonly Dia[];
}

const UN_DIA_EN_MS = 24 * 60 * 60 * 1000;

/** El dia siguiente de un dia del calendario, tambien al cruzar de mes, de ano y el 29 de febrero. */
export function diaSiguiente(dia: Dia): Dia {
  return new Date(Date.parse(`${dia}T00:00:00Z`) + UN_DIA_EN_MS).toISOString().slice(0, 10);
}

/** El nivel de la llama para una cadena de tantos dias. */
export function nivelDeLaLlama(dias: number): NivelDeLaLlama {
  if (dias >= DIAS_POR_NIVEL[3]) {
    return 4;
  }

  if (dias >= DIAS_POR_NIVEL[2]) {
    return 3;
  }

  if (dias >= DIAS_POR_NIVEL[1]) {
    return 2;
  }

  return dias >= DIAS_POR_NIVEL[0] ? 1 : 0;
}

/**
 * Calcula la racha de una persona.
 *
 * `dias` son los dias en que hizo algo, en cualquier orden y con repetidos. Los que
 * todavia no llegan (un reloj adelantado) se ignoran. `hoy` es un dia del calendario
 * local de la persona.
 */
export function calcularLaRacha(dias: Iterable<Dia>, hoy: Dia): Racha {
  if (!Calendario.esDia(hoy)) {
    throw new RangeError(`"${hoy}" no es un dia con formato AAAA-MM-DD.`);
  }

  // Los dias son AAAA-MM-DD: el orden de texto es el orden del calendario.
  const hechos = new Set([...dias].filter((dia) => dia <= hoy));
  const usadosPorMes = new Map<string, number>();
  let racha = 0;
  let cubiertos: Dia[] = [];

  const [primero] = [...hechos].sort();

  if (primero !== undefined) {
    // Hasta ayer: hoy se resuelve aparte, porque todavia puede cambiar.
    for (let dia = primero; dia < hoy; dia = diaSiguiente(dia)) {
      if (hechos.has(dia)) {
        racha += 1;
        continue;
      }

      // Sin cadena en pie, un dia vacio no es un hueco: no hay nada que cubrir.
      if (racha === 0) {
        continue;
      }

      const mes = dia.slice(0, 7);
      const usados = usadosPorMes.get(mes) ?? 0;

      if (usados < CONGELAMIENTOS_POR_MES) {
        usadosPorMes.set(mes, usados + 1);
        cubiertos.push(dia);
      } else {
        racha = 0;
        cubiertos = [];
      }
    }
  }

  const hechoHoy = hechos.has(hoy);

  if (hechoHoy) {
    racha += 1;
  }

  return {
    dias: racha,
    nivel: nivelDeLaLlama(racha),
    hechoHoy,
    enDescanso: racha === 0,
    congelamientosUsados: usadosPorMes.get(hoy.slice(0, 7)) ?? 0,
    congelamientosPorMes: CONGELAMIENTOS_POR_MES,
    diasCubiertos: cubiertos,
  };
}
