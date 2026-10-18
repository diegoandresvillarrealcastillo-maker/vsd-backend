/**
 * La franja del dia en que tiene sentido ofrecer una mecanica (ADR 0030, punto 8, SCRUM-221).
 *
 * Casi todas las mecanicas valen a cualquier hora. Dos no: «Antes de dormir» (BIE-07) y «El cierre del dia»
 * (EMO-09) hablan de la noche, y ofrecerlas a las diez de la manana les quita el sentido. Una mecanica sin
 * franja se ofrece siempre.
 *
 * Se calcula con la hora **de la persona** (ADR 0014), no la del servidor: las ocho de la noche en Bogota son
 * la una de la madrugada en UTC.
 *
 * - `manana`: de 5:00 a 11:59.
 * - `tarde`: de 12:00 a 18:59.
 * - `noche`: de 19:00 a 4:59. Cruza la medianoche, y la ficha de BIE-07 la define asi: «solo de 7 p. m. a
 *   5 a. m. en la hora de la persona».
 *
 * La franja decide **que se ofrece**, no que se puede hacer: la actividad sigue en el catalogo y se puede abrir
 * a cualquier hora (SCRUM-184, no hay tope ni horario obligatorio).
 */
export const Franja = {
  MANANA: 'manana',
  TARDE: 'tarde',
  NOCHE: 'noche',
} as const;

export type Franja = (typeof Franja)[keyof typeof Franja];

/** Las tres, tal cual las acepta el CHECK de `actividad.franja`. */
export const FRANJAS: readonly Franja[] = Object.values(Franja);

export function esFranja(valor: unknown): valor is Franja {
  return typeof valor === 'string' && (FRANJAS as readonly string[]).includes(valor);
}

const MINUTOS_POR_HORA = 60;
const MANANA_DESDE = 5 * MINUTOS_POR_HORA;
const TARDE_DESDE = 12 * MINUTOS_POR_HORA;
const NOCHE_DESDE = 19 * MINUTOS_POR_HORA;

/**
 * La franja de un minuto del dia local (0 a 1439, desde la medianoche: las 8:30 son 510), como lo da
 * `Calendario.minutoDelDia`.
 */
export function franjaDe(minutoDelDia: number): Franja {
  if (minutoDelDia >= NOCHE_DESDE || minutoDelDia < MANANA_DESDE) {
    return Franja.NOCHE;
  }

  return minutoDelDia >= TARDE_DESDE ? Franja.TARDE : Franja.MANANA;
}
