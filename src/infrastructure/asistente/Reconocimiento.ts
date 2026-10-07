import { normalizar } from '../../domain/model/SenalesDeRiesgo.js';

/**
 * Como VSD IA lee lo que escribe una persona (SCRUM-128).
 *
 * Hasta ahora buscaba pedazos de texto: "mal" coincidia dentro de "normal" y
 * "solo" dentro de cualquier frase que lo llevara. Aqui se comparan **palabras
 * completas**.
 *
 * La deteccion de riesgo (`SenalesDeRiesgo.ts`) no pasa por aqui y no cambia:
 * sigue buscando expresiones sobre el texto normalizado, a proposito de forma
 * generosa. Esto solo decide que *intencion* se reconoce una vez descartado el
 * riesgo.
 */

/**
 * Las palabras de un texto: enteras, sin tildes, sin signos y en minuscula.
 *
 * Tres letras iguales seguidas se leen como una ("holaaaa", "graciasss"): en
 * espanol ninguna palabra las lleva, y asi la gente que escribe alargando no
 * queda sin respuesta.
 */
export function palabrasDe(texto: string): readonly string[] {
  return normalizar(texto)
    .replace(/(\p{L})\1{2,}/gu, '$1')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((palabra) => palabra !== '');
}

/**
 * Una palabra del patron contra una del texto: la misma, o un comienzo si el
 * patron termina en `*`.
 *
 * El `*` es para las raices que dan una familia ("psicolog*": psicologo,
 * psicologa, psicologia). Sigue siendo palabra completa por delante: "mal*" no
 * leeria "normal".
 */
function coincide(palabra: string, patron: string): boolean {
  return patron.endsWith('*') ? palabra.startsWith(patron.slice(0, -1)) : palabra === patron;
}

/**
 * Donde empieza cada aparicion del patron en el texto, como posiciones de
 * palabra. El patron son una o varias palabras seguidas, separadas por un
 * espacio: "como estas".
 */
function apariciones(palabras: readonly string[], patron: string): readonly number[] {
  const partes = patron.split(' ');

  return palabras
    .map((_palabra, inicio) => inicio)
    .filter(
      (inicio) =>
        inicio + partes.length <= palabras.length &&
        partes.every((parte, desplazamiento) =>
          coincide(palabras[inicio + desplazamiento] ?? '', parte),
        ),
    );
}

/** Cierto si el patron aparece completo, palabra por palabra. */
export function contiene(palabras: readonly string[], patron: string): boolean {
  return apariciones(palabras, patron).length > 0;
}

/** Cierto si alguno de los patrones aparece. */
export function contieneAlguno(palabras: readonly string[], patrones: readonly string[]): boolean {
  return patrones.some((patron) => contiene(palabras, patron));
}

/**
 * Cuando el mensaje entero es charla y no otra cosa.
 *
 * ## Por que "entero"
 *
 * Reconocer un "hola" dentro de una frase mas larga es el camino a una respuesta
 * alegre para quien no la necesita: "hola, quiero desaparecer" contiene un
 * saludo y contiene lo que importa. La lista de riesgo es un suelo y no lo
 * cubre todo, asi que aqui se hace lo contrario de lo generoso: **la charla se
 * reconoce solo si cada palabra del mensaje es charla**, ya sea de un patron o
 * de las palabras de relleno que la acompanan ("muchas", "por favor").
 *
 * Todo lo que no cumple eso sigue el camino de siempre. Y el camino de siempre,
 * cuando no entiende, ensena las lineas de atencion: el error se queda del lado
 * de ensenarlas de mas.
 *
 * Devuelve la posicion en `reglas` de la regla que gana, o `undefined`. Ganan
 * las primeras de la lista, asi que van de lo mas especifico a lo mas general:
 * "hola, como estas" es una pregunta por como esta el asistente, no un saludo.
 */
export function reconocerCharla<T extends { readonly patrones: readonly string[] }>(
  palabras: readonly string[],
  reglas: readonly T[],
  relleno: ReadonlySet<string>,
): T | undefined {
  if (palabras.length === 0) {
    return undefined;
  }

  const cubiertas = new Set<number>();
  const coinciden = reglas.filter((regla) => {
    const huellas = regla.patrones.flatMap((patron) =>
      apariciones(palabras, patron).flatMap((inicio) =>
        Array.from({ length: patron.split(' ').length }, (_valor, i) => inicio + i),
      ),
    );

    huellas.forEach((posicion) => cubiertas.add(posicion));

    return huellas.length > 0;
  });

  const sobra = palabras.some(
    (palabra, posicion) => !cubiertas.has(posicion) && !relleno.has(palabra),
  );

  return sobra ? undefined : coinciden[0];
}
