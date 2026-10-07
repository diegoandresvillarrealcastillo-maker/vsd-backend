import { FutureCompletionDateError } from './DomainError.js';

/**
 * Cuanto puede adelantarse el reloj de un dispositivo sin que se le rechace lo
 * que manda (SCRUM-133).
 *
 * Con conexion, una fecha en el futuro es casi siempre un error. Sin ella deja
 * de serlo: lo que una persona hace sin red queda guardado en su dispositivo y
 * viaja despues con la hora de ese reloj, y relojes adelantados dos o tres
 * minutos son lo normal (el de un celular sin sincronizar, el de un equipo
 * compartido). Sin tolerancia, ese resultado se rechazaria **para siempre**: no
 * es un fallo que se arregle reintentando, y la persona perderia lo que hizo
 * sin enterarse hasta mucho despues.
 *
 * Cinco minutos cubren los relojes desajustados sin abrir la puerta a fechas
 * que desordenen el historial. Lo que pase de ahi se sigue rechazando.
 */
export const TOLERANCIA_DEL_RELOJ_EN_MS = 5 * 60 * 1000;

/**
 * `ahora` mas la tolerancia: lo mas tarde que se admite que sea "hoy" para un
 * dispositivo. Sirve para decidir hasta que dia se acepta una anotacion.
 */
export function conTolerancia(ahora: Date): Date {
  return new Date(ahora.getTime() + TOLERANCIA_DEL_RELOJ_EN_MS);
}

/**
 * La hora que manda un dispositivo, ajustada al reloj del servidor.
 *
 * - Si es anterior o igual a `ahora`, se respeta tal cual: lo que se hizo sin
 *   conexion hace horas es exactamente asi de viejo y no se toca.
 * - Si se adelanta hasta la tolerancia, se registra como `ahora`. Es lo
 *   verdadero: no pudo ocurrir en el futuro, y asi un resultado de las 23:58
 *   con el reloj adelantado no cae en el dia siguiente.
 * - Si se adelanta mas, es un error y se rechaza.
 *
 * @throws {FutureCompletionDateError} Si pasa de la tolerancia.
 */
export function ajustarAlReloj(fecha: Date, ahora: Date): Date {
  const adelanto = fecha.getTime() - ahora.getTime();

  if (adelanto > TOLERANCIA_DEL_RELOJ_EN_MS) {
    throw new FutureCompletionDateError(fecha);
  }

  return new Date(adelanto > 0 ? ahora.getTime() : fecha.getTime());
}
