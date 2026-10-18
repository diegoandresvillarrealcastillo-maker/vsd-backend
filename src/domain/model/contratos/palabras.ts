import {
  type Validador,
  entero,
  lista,
  objeto,
  opcional,
  palabraSuelta,
  porModo,
  repetido,
  requerido,
  texto,
  unoDe,
} from './piezas.js';

/**
 * M5, `palabras`: letras que faltan. Sirve a una mecanica, «Completa la palabra» (COG-07), en dos modos:
 *
 * - `completar`: una palabra con una a tres letras faltantes y una pista de categoria.
 * - `anagrama`: las letras de una palabra de cinco o seis, revueltas.
 *
 * La sesion trae las palabras (los elementos del banco viajan dentro de ella, ADR 0031) y, en el anagrama,
 * tambien el orden revuelto: no hay azar en el telefono, y asi se comprueba antes. La comparacion de lo que
 * escribe la persona acepta con y sin tilde: eso es de la pantalla, no del contrato.
 */

const LETRAS_MINIMAS = 3;
const LETRAS_MAXIMAS = 8;

/** Las letras de una palabra, sin tildes y en minusculas, para comparar. */
function letrasDe(palabra: string): string[] {
  return [...palabra.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()];
}

const PALABRA = objeto({
  pista: requerido(texto(80)),
  palabra: requerido(palabraSuelta(LETRAS_MINIMAS, LETRAS_MAXIMAS)),
  faltan: opcional(lista(1, 3, entero(0, LETRAS_MAXIMAS - 1))),
  revuelta: opcional(palabraSuelta(LETRAS_MINIMAS, LETRAS_MAXIMAS)),
});

function sinRepetirNiSalirse(palabras: Record<string, unknown>[], modo: string) {
  const repetida = repetido(palabras, 'palabras', 'palabra');

  if (repetida !== undefined) {
    return repetida;
  }

  for (const [posicion, entrada] of palabras.entries()) {
    const palabra = entrada['palabra'] as string;
    const largo = [...palabra].length;

    if (modo === 'completar') {
      if (!Object.hasOwn(entrada, 'faltan')) {
        return `palabras[${posicion}].faltan es obligatorio al completar`;
      }

      if (Object.hasOwn(entrada, 'revuelta')) {
        return `palabras[${posicion}].revuelta no va al completar: es del anagrama`;
      }

      const faltan = entrada['faltan'] as number[];

      if (new Set(faltan).size !== faltan.length) {
        return `palabras[${posicion}].faltan repite una posición`;
      }

      if (faltan.some((lugar) => lugar >= largo)) {
        return `palabras[${posicion}].faltan nombra una posición que no existe en "${palabra}"`;
      }

      // Con todas las letras ocultas no quedaria nada de donde partir.
      if (faltan.length >= largo - 1) {
        return `palabras[${posicion}].faltan deja "${palabra}" casi sin letras a la vista`;
      }

      continue;
    }

    if (!Object.hasOwn(entrada, 'revuelta')) {
      return `palabras[${posicion}].revuelta es obligatorio en el anagrama`;
    }

    if (Object.hasOwn(entrada, 'faltan')) {
      return `palabras[${posicion}].faltan no va en el anagrama: es de completar`;
    }

    const revuelta = entrada['revuelta'] as string;
    const esperadas = letrasDe(palabra).sort().join('');

    if (letrasDe(revuelta).sort().join('') !== esperadas) {
      return `palabras[${posicion}].revuelta no tiene las mismas letras que "${palabra}"`;
    }

    if (letrasDe(revuelta).join('') === letrasDe(palabra).join('')) {
      return `palabras[${posicion}].revuelta es la misma palabra: no habría nada que ordenar`;
    }
  }

  return undefined;
}

const esquemaDe = (modo: 'completar' | 'anagrama'): Validador =>
  objeto(
    {
      modo: requerido(unoDe([modo])),
      palabras: requerido(lista(3, 10, PALABRA)),
      puntosMaximos: requerido(entero(1, 100)),
    },
    (valor) => {
      const palabras = valor['palabras'] as Record<string, unknown>[];

      return (
        sinRepetirNiSalirse(palabras, modo) ??
        (valor['puntosMaximos'] === palabras.length
          ? undefined
          : `puntosMaximos (${String(valor['puntosMaximos'])}) tiene que ser las palabras (${palabras.length}): un acierto, un punto`)
      );
    },
  );

export const PALABRAS: Validador = porModo({
  completar: esquemaDe('completar'),
  anagrama: esquemaDe('anagrama'),
});
