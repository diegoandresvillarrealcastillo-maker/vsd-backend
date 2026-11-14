import { Calendario } from './Calendario.js';

/**
 * Cuanto tiempo atras se cree la hora que manda un dispositivo (SCRUM-144).
 *
 * Una persona puede escribir sin conexion y no volver a tenerla durante dias. Mas
 * de un mes ya no es "estuve sin red": es un reloj mal puesto o alguien probando
 * la regla de la hora para editar, y la hora del servidor es la respuesta segura.
 *
 * La misma cifra esta en el disparador de la base (migracion
 * 20261014120000_hora_del_dispositivo_en_el_diario), que la acota aunque llegue
 * algo sin pasar por aqui.
 */
export const MAXIMO_SIN_CONEXION_EN_DIAS = 30;

const MAXIMO_SIN_CONEXION_EN_MS = MAXIMO_SIN_CONEXION_EN_DIAS * 24 * 60 * 60 * 1000;

/**
 * ISO 8601 con fecha, hora y **desplazamiento** (`Z` o `+hh:mm`). Sin
 * desplazamiento la hora es ambigua —no se sabe de que zona es— y se descarta.
 *
 * Se comprueba la forma antes de leerla porque `Date.parse` acepta cosas que no
 * son una hora ("5", "1.5") y las lee como una fecha cualquiera.
 */
const FORMA_ISO =
  /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,9})?)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)$/;

/**
 * La hora en que, segun el dispositivo, se escribio o se edito algo; o la del
 * servidor si lo que mando no sirve.
 *
 * Una anotacion escrita sin conexion a las 9:00 y recibida a las 14:00 tiene que
 * mostrar las 9:00, y una correccion hecha a las 9:30 tiene que caer dentro de la
 * hora para editar aunque llegue a las 14:00. Esa hora la sabe el dispositivo.
 *
 * Pero el reloj de un dispositivo no es de fiar, y **mandar una hora mala no
 * puede romper la peticion**: lo que la persona escribio no se pierde porque su
 * reloj estaba mal. Por eso no lanza nunca; lo que no sirve se ignora y se usa
 * `ahora`.
 *
 * - **Respeta lo que ya paso**, hasta `MAXIMO_SIN_CONEXION_EN_DIAS`.
 * - **Nunca es posterior a `ahora`.** Si el reloj del dispositivo se adelanta unos
 *   minutos (dentro de la tolerancia, ver `ToleranciaDelReloj`) lo verdadero es
 *   `ahora`: no pudo ocurrir en el futuro. Si se adelanta mas, el reloj esta roto
 *   y se ignora. En los dos casos el resultado es el mismo.
 * - **Si es anterior a `noAntesDe`, se ignora.** Una anotacion no se escribe antes
 *   de que empiece su dia, ni se corrige antes de haberse escrito.
 * - **Si no es una hora** (no es texto, no tiene la forma de ISO 8601, no existe
 *   ese dia), se ignora.
 *
 * Es una regla de producto y no un limite de seguridad: nadie puede demostrar a
 * que hora escribio algo, y una persona que quiera mentirle a su propio diario
 * puede. Lo que se acota es **cuanto**: nunca mas alla de un mes ni del futuro
 * (ADR 0020).
 */
export function horaDelDispositivo(candidata: unknown, ahora: Date, noAntesDe?: Date): Date {
  if (typeof candidata !== 'string' || !FORMA_ISO.test(candidata)) {
    return ahora;
  }

  // "2026-02-30T10:00:00Z" tiene la forma pero ese dia no existe, y `Date` lo lee
  // como el 2 de marzo en lugar de rechazarlo.
  if (!Calendario.esDia(candidata.slice(0, 10))) {
    return ahora;
  }

  const hora = new Date(candidata);
  const instante = hora.getTime();

  if (Number.isNaN(instante)) {
    return ahora;
  }

  const antiguedad = ahora.getTime() - instante;

  if (antiguedad < 0) {
    return ahora;
  }

  if (antiguedad > MAXIMO_SIN_CONEXION_EN_MS) {
    return ahora;
  }

  if (noAntesDe !== undefined && instante < noAntesDe.getTime()) {
    return ahora;
  }

  return hora;
}
