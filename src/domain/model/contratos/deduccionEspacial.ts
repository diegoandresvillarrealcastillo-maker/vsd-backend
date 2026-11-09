import {
  type Validador,
  entero,
  lista,
  objeto,
  repetido,
  requerido,
  texto,
  unoDe,
} from './piezas.js';

const CELDA = objeto({
  clave: requerido(texto(24)),
  etiqueta: requerido(texto(48)),
  fila: requerido(entero(1, 4)),
  columna: requerido(entero(1, 4)),
});

const TABLERO = objeto(
  {
    modo: requerido(unoDe(['deduccion_espacial'])),
    filas: requerido(entero(2, 4)),
    columnas: requerido(entero(2, 4)),
    celdas: requerido(lista(4, 16, CELDA)),
    pistas: requerido(lista(2, 5, texto(180))),
    solucion: requerido(texto(24)),
    explicacion: requerido(texto(180)),
    puntosMaximos: requerido(entero(1, 1)),
  },
  (valor) => {
    const pistasRepetidas = repetido(valor['pistas'], 'pistas', null);

    if (pistasRepetidas !== undefined) {
      return pistasRepetidas;
    }

    const celdas = valor['celdas'] as readonly {
      clave: string;
      fila: number;
      columna: number;
    }[];
    const filas = valor['filas'] as number;
    const columnas = valor['columnas'] as number;
    const identidad = (celda: { fila: number; columna: number }) =>
      `${celda.fila}:${celda.columna}`;
    const claves = new Set(celdas.map((celda) => celda.clave));
    const posiciones = new Set(celdas.map(identidad));

    if (claves.size !== celdas.length) {
      return repetido(celdas, 'celdas', 'clave');
    }

    if (posiciones.size !== celdas.length) {
      return 'celdas repite una posición del tablero';
    }

    if (celdas.some((celda) => celda.fila > filas || celda.columna > columnas)) {
      return 'celdas tiene una posición que queda fuera del tablero';
    }

    if (celdas.length !== filas * columnas) {
      return 'celdas debe ocupar todas las posiciones del tablero';
    }

    if (!claves.has(valor['solucion'] as string)) {
      return 'solucion no coincide con una celda del tablero';
    }

    return undefined;
  },
);

/**
 * Deducción espacial: la persona cruza pistas con una cuadrícula y elige una única casilla.
 * Las posiciones, las pistas y la solución pertenecen a la sesión, no se generan en el cliente.
 */
export const DEDUCCION_ESPACIAL: Validador = (valor, ruta) => TABLERO(valor, ruta);
