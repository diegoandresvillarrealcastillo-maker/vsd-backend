import type { ReglaDeLimite } from './LimitePorCuenta.js';

/**
 * Los topes por cuenta de las rutas que cuestan (S-03 de la auditoria 360).
 *
 * Todos son por minuto y por cuenta, y todos son mas bajos que el general (120 por
 * direccion IP): una persona normal no los toca, y quien repite una de estas
 * llamadas sin parar si.
 *
 * Estan escritos aqui, juntos, y no repartidos por los controladores, para que
 * comparar uno con otro y ajustarlos sea cuestion de mirar un solo archivo.
 */
const UN_MINUTO_MS = 60_000;

/**
 * Exportar todo lo de la persona: la cuenta, los resultados, el diario y sus
 * archivos. Es lo mas pesado que se puede pedir, y nadie lo necesita mas de un par
 * de veces seguidas.
 */
export const LIMITE_DE_EXPORTAR: ReglaDeLimite = { maximo: 5, ventanaMs: UN_MINUTO_MS };

/**
 * Preguntarle al asistente. Es una conversacion, asi que admite mas que las demas:
 * alguien que escribe con calma no llega a 30 en un minuto.
 */
export const LIMITE_DEL_ASISTENTE: ReglaDeLimite = { maximo: 30, ventanaMs: UN_MINUTO_MS };

/**
 * Guardar o quitar la foto o la mascota propia. Cada una pasa por el almacenamiento
 * de archivos, que es de un tercero, y subir diez veces en un minuto ya es un
 * error o un abuso. Leerlas no lleva tope propio: las pide la pantalla cada vez que
 * se abre.
 */
export const LIMITE_DE_ESCRIBIR_ARCHIVOS: ReglaDeLimite = {
  maximo: 10,
  ventanaMs: UN_MINUTO_MS,
};

/** Registrar o soltar un navegador para los avisos. Es algo que se hace una vez. */
export const LIMITE_DE_SUSCRIBIR_AVISOS: ReglaDeLimite = {
  maximo: 10,
  ventanaMs: UN_MINUTO_MS,
};
