import type { Dia } from './Calendario.js';

const BASE_DE_FNV = 0xcbf29ce484222325n;
const PRIMO_DE_FNV = 0x100000001b3n;
const MASCARA_DE_64_BITS = (1n << 64n) - 1n;

/**
 * Una clave de 64 bits que depende solo del texto: FNV-1a.
 *
 * Sirve para **ordenar sin guardar nada**. El orden en que una persona ve las cosas (que mecanicas
 * rotativas le tocan hoy, que sesion le sigue) sale de una clave calculada con su identificador, no
 * de una tabla: agregar o retirar contenido no mueve a nadie y no hay una fila mas por cuenta (ADR 0025
 * y 0030).
 *
 * Es pura y no usa nada de Node, asi que el dominio la prueba sin base de datos y los dos adaptadores
 * dan la misma. No es un hash criptografico ni lo pretende: solo reparte de forma pareja y estable.
 */
export function claveEstable(texto: string): bigint {
  let clave = BASE_DE_FNV;

  for (let i = 0; i < texto.length; i++) {
    clave ^= BigInt(texto.charCodeAt(i));
    clave = (clave * PRIMO_DE_FNV) & MASCARA_DE_64_BITS;
  }

  return clave;
}

/**
 * El orden de la rotacion: dentro de un modulo, cual de dos mecanicas que empatan se ofrece primero a
 * esta persona hoy (ADR 0030, punto 7). Cambia con el dia, para que el desempate no sea siempre el
 * mismo.
 */
export function claveDeLaMecanica(actividad: string, persona: string, dia: Dia): bigint {
  return claveEstable(`mecanica:${actividad}:${persona}:${dia}`);
}

/**
 * El orden de las sesiones de una mecanica para esta persona (ADR 0030, punto 6). No depende del dia:
 * es lo que hace que "la siguiente" sea siempre la misma mientras no cambie el contenido.
 */
export function claveDeLaSesion(sesion: string, persona: string): bigint {
  return claveEstable(`sesion:${sesion}:${persona}`);
}
