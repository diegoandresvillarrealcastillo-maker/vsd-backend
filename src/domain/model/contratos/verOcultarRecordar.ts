import {
  type Validador,
  entero,
  lista,
  objeto,
  opcional,
  porModo,
  repetido,
  requerido,
  texto,
  unoDe,
} from './piezas.js';

/**
 * M3, `ver_ocultar_recordar`: se muestra, se oculta, se responde. Sirve a dos mecanicas de memoria:
 *
 * - `lista`: «Recuerda la lista» (COG-06). Se ve una lista unos segundos, se oculta y se eligen los elementos
 *   entre ellos y unos distractores.
 * - `escena`: «Lo que vi» (COG-09). Se ven unos pictogramas en una cuadricula, se ocultan y se responde que
 *   habia en cada lugar.
 *
 * La sesion trae todo lo que se muestra y lo que se pregunta (no hay azar en el telefono). El tiempo a la
 * vista es parte del juego, no una amenaza (R4): no hay cuenta atras en rojo. `puntosMaximos` es el maximo
 * de la mecanica; la prueba del contenido lo compara con el del catalogo.
 */

/** Un elemento con nombre escrito; el pictograma es adorno para quien ve. */
const ELEMENTO = objeto({
  clave: requerido(texto(20)),
  nombre: requerido(texto(40)),
  pictograma: opcional(texto(30)),
});

const LISTA = objeto(
  {
    modo: requerido(unoDe(['lista'])),
    contexto: requerido(texto(60)),
    segundosVista: requerido(entero(5, 30)),
    elementos: requerido(lista(3, 8, ELEMENTO)),
    distractores: requerido(lista(2, 6, ELEMENTO)),
    puntosMaximos: requerido(entero(1, 100)),
  },
  (valor) => {
    const juntos = [...(valor['elementos'] as unknown[]), ...(valor['distractores'] as unknown[])];

    // Una clave o un nombre repetidos entre lo que hay que recordar y lo que no volverian ambigua la respuesta.
    return (
      repetido(juntos, 'elementos y distractores', 'clave') ??
      repetido(juntos, 'elementos y distractores', 'nombre')
    );
  },
);

const CELDA = objeto({
  fila: requerido(entero(1, 4)),
  columna: requerido(entero(1, 4)),
  pictograma: requerido(texto(30)),
  nombre: requerido(texto(40)),
});

const OPCION_DE_ESCENA = objeto({
  pictograma: requerido(texto(30)),
  nombre: requerido(texto(40)),
});

const PREGUNTA_DE_ESCENA = objeto(
  {
    texto: requerido(texto(140)),
    fila: requerido(entero(1, 4)),
    columna: requerido(entero(1, 4)),
    opciones: requerido(lista(3, 4, OPCION_DE_ESCENA)),
    correcta: requerido(entero(0, 3)),
  },
  (valor) => {
    const opciones = valor['opciones'] as unknown[];

    return (
      repetido(opciones, 'opciones', 'nombre') ??
      ((valor['correcta'] as number) >= opciones.length
        ? `correcta (${String(valor['correcta'])}) no es una de las ${opciones.length} opciones`
        : undefined)
    );
  },
);

const ESCENA = objeto(
  {
    modo: requerido(unoDe(['escena'])),
    segundosVista: requerido(entero(5, 20)),
    filas: requerido(entero(2, 4)),
    columnas: requerido(entero(2, 4)),
    celdas: requerido(lista(4, 16, CELDA)),
    preguntas: requerido(lista(3, 8, PREGUNTA_DE_ESCENA)),
    puntosMaximos: requerido(entero(1, 100)),
  },
  (valor) => {
    const filas = valor['filas'] as number;
    const columnas = valor['columnas'] as number;
    const celdas = valor['celdas'] as { fila: number; columna: number; nombre: string }[];
    const lugares = new Set<string>();

    for (const [posicion, celda] of celdas.entries()) {
      if (celda.fila > filas || celda.columna > columnas) {
        return `celdas[${posicion}] está fuera de la cuadrícula de ${filas} por ${columnas}`;
      }

      const lugar = `${celda.fila},${celda.columna}`;

      if (lugares.has(lugar)) {
        return `celdas[${posicion}] repite el lugar de fila ${celda.fila}, columna ${celda.columna}`;
      }

      lugares.add(lugar);
    }

    // Dos cosas con el mismo nombre en la escena harian ambigua la pregunta «que habia aqui».
    const repetida = repetido(celdas, 'celdas', 'nombre');

    if (repetida !== undefined) {
      return repetida;
    }

    const preguntas = valor['preguntas'] as {
      fila: number;
      columna: number;
      opciones: { nombre: string }[];
      correcta: number;
    }[];

    for (const [posicion, pregunta] of preguntas.entries()) {
      const celda = celdas.find((c) => c.fila === pregunta.fila && c.columna === pregunta.columna);

      if (celda === undefined) {
        return `preguntas[${posicion}] pregunta por un lugar donde no hay nada`;
      }

      if (pregunta.opciones[pregunta.correcta]?.nombre !== celda.nombre) {
        return `preguntas[${posicion}].correcta no es lo que había en ese lugar (${celda.nombre})`;
      }
    }

    return valor['puntosMaximos'] === preguntas.length
      ? undefined
      : `puntosMaximos (${String(valor['puntosMaximos'])}) tiene que ser las preguntas (${preguntas.length}): un acierto, un punto`;
  },
);

export const VER_OCULTAR_RECORDAR: Validador = porModo({ lista: LISTA, escena: ESCENA });
