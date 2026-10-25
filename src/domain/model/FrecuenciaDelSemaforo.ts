/**
 * La frecuencia del aviso del semaforo (SCRUM-146, ADR 0036).
 *
 * El semaforo avisa de los pendientes a una hora que la persona elige (la **hora base**). La
 * frecuencia dice cuantas veces al dia y cuando, respecto de esa hora:
 *
 * - **manana**: una vez, a la hora base. Es lo que ya hacia, y lo que queda para todas las cuentas
 *   que existian: no se les mueve nada, ni siquiera a quien eligio una hora de la tarde.
 * - **noche**: una vez, en el **segundo aviso**: doce horas despues de una hora base de la manana, o a
 *   la propia hora base si ya es de la tarde (de las 12:00 en adelante).
 * - **dos veces**: los dos, a doce horas uno de otro.
 *
 * ## El punto abierto del ticket: una hora base desde las 12:00
 *
 * La semantica aprobada era «noche = base + 12 horas». Con una base desde las 12:00 eso cruza la
 * medianoche y cae de madrugada. Aqui nunca se cruza: el **primer aviso de «dos veces» cae siempre
 * en la manana (00:00 a 11:59) y el segundo siempre de las 12:00 en adelante**. Una base de la
 * tarde se toma como la del segundo aviso, y el primero es doce horas antes. La persona no tiene que
 * saber nada de esto: el servidor le devuelve las horas que le tocan.
 *
 * ## Por que son funciones y no columnas
 *
 * Los dos minutos salen de la hora base y la frecuencia; no se guardan. Asi no hay dos valores que
 * puedan quedar distintos. Para encontrar a quien le toca sin traer a todos, la base de datos
 * pregunta por las **horas base** que dan un aviso en la ventana (`basesDelPrimerAviso` y
 * `basesDelSegundoAviso`): son lo contrario de `minutosDelSemaforo`, y una prueba comprueba que
 * coinciden para todas las horas y ventanas del dia.
 */

export const FrecuenciaDelSemaforo = {
  MANANA: 'manana',
  NOCHE: 'noche',
  DOS_VECES: 'dos_veces',
} as const;

export type FrecuenciaDelSemaforo =
  (typeof FrecuenciaDelSemaforo)[keyof typeof FrecuenciaDelSemaforo];

export function esUnaFrecuenciaDelSemaforo(valor: unknown): valor is FrecuenciaDelSemaforo {
  return Object.values<unknown>(FrecuenciaDelSemaforo).includes(valor);
}

/** Las 12:00, en minutos desde la medianoche: la frontera entre la manana y la tarde. */
const MEDIO_DIA = 12 * 60;

/** Un tramo de minutos del dia, ambos extremos incluidos. */
export interface RangoDeMinutos {
  readonly desde: number;
  readonly hasta: number;
}

/**
 * Los minutos del dia en que sale cada aviso del semaforo para una hora base y una frecuencia:
 * `primero` es el de la manana y `segundo`, el de la tarde o la noche. `null` es que ese no sale.
 */
export function minutosDelSemaforo(
  base: number | null,
  frecuencia: FrecuenciaDelSemaforo,
): { readonly primero: number | null; readonly segundo: number | null } {
  if (base === null) {
    return { primero: null, segundo: null };
  }

  // La hora base se lee dentro de «medio dia»: 08:00 y 20:00 son la misma hora de la manana (480)
  // y de la noche (1200).
  const delaManana = base % MEDIO_DIA;
  const delaNoche = delaManana + MEDIO_DIA;

  switch (frecuencia) {
    case FrecuenciaDelSemaforo.MANANA:
      // Tal cual estaba: sin mover nada a quien ya tenia una hora de la tarde.
      return { primero: base, segundo: null };
    case FrecuenciaDelSemaforo.NOCHE:
      return { primero: null, segundo: delaNoche };
    case FrecuenciaDelSemaforo.DOS_VECES:
      return { primero: delaManana, segundo: delaNoche };
  }
}

/** Las horas base cuyo resto (dentro de medio dia) cae en `[desde, hasta]`, en sus dos mitades. */
function basesConResto(desde: number, hasta: number): readonly RangoDeMinutos[] {
  const inicio = Math.max(0, desde);
  const fin = Math.min(MEDIO_DIA - 1, hasta);

  return inicio > fin
    ? []
    : [
        { desde: inicio, hasta: fin },
        { desde: inicio + MEDIO_DIA, hasta: fin + MEDIO_DIA },
      ];
}

/**
 * Las horas base a las que el **primer** aviso les cae entre `desde` y `hasta` (minutos del dia).
 * Solo `manana` y `dos_veces` tienen primer aviso.
 */
export function basesDelPrimerAviso(
  frecuencia: typeof FrecuenciaDelSemaforo.MANANA | typeof FrecuenciaDelSemaforo.DOS_VECES,
  desde: number,
  hasta: number,
): readonly RangoDeMinutos[] {
  return frecuencia === FrecuenciaDelSemaforo.MANANA
    ? [{ desde, hasta }]
    : basesConResto(desde, hasta);
}

/**
 * Las horas base a las que el **segundo** aviso les cae entre `desde` y `hasta`. Es el mismo para
 * `noche` y `dos_veces`: el segundo aviso no depende de cual de las dos sea.
 */
export function basesDelSegundoAviso(desde: number, hasta: number): readonly RangoDeMinutos[] {
  return basesConResto(desde - MEDIO_DIA, hasta - MEDIO_DIA);
}
