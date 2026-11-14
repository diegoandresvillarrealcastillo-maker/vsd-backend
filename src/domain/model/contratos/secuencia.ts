import {
  type Validador,
  entero,
  lista,
  nombreDe,
  objeto,
  opcional,
  repetido,
  requerido,
  texto,
} from './piezas.js';

/**
 * M1, `secuencia`: repetir una secuencia que crece. El «alfabeto» son las casillas: para la secuencia de
 * numeros, los diez digitos; para «Recuerda los colores», figuras.
 *
 * `msDestello` solo lo usa el juego de casillas que destellan (la baranda R10 pide al menos 600 ms);
 * la secuencia de numeros muestra todos los digitos a la vez durante
 * `largo x msPorElemento + msDeMargen`.
 *
 * En el juego de casillas, `msPorElemento` es el **turno** de cada casilla y `msDestello` lo que se
 * queda iluminada: la pausa es la diferencia, asi que el destello **no puede pasar del turno**. La
 * pantalla ya lo exige; aqui se rechaza al sembrar, y no cuando alguien abre la sesion.
 *
 * Un color nunca es la unica pista (R10): una casilla con `color` tiene que traer tambien `forma`.
 * La `forma` puede ser una de las nueve figuras de siempre o un pictograma de la biblioteca (SCRUM-226).
 */
const CASILLA = objeto(
  {
    clave: requerido(texto(20)),
    nombre: requerido(texto(40)),
    forma: opcional(texto(20)),
    color: opcional(texto(20)),
  },
  (valor, ruta) =>
    Object.hasOwn(valor, 'color') && !Object.hasOwn(valor, 'forma')
      ? `${nombreDe(ruta, 'forma')} es obligatorio cuando la casilla tiene color: el color no puede ser la única pista`
      : undefined,
);

export const SECUENCIA: Validador = objeto(
  {
    casillas: requerido(lista(2, 12, CASILLA)),
    largoInicial: requerido(entero(1, 10)),
    rondas: requerido(entero(1, 50)),
    msPorElemento: requerido(entero(200, 5000)),
    msDeMargen: requerido(entero(0, 10000)),
    msDestello: opcional(entero(600, 5000)),
  },
  (valor) => {
    const destello = valor['msDestello'];
    const turno = valor['msPorElemento'] as number;

    return (
      repetido(valor['casillas'], 'casillas', 'clave') ??
      repetido(valor['casillas'], 'casillas', 'nombre') ??
      (typeof destello === 'number' && destello > turno
        ? `msDestello (${destello}) no puede ser mayor que msPorElemento (${turno}): el destello tiene que caber en el turno de la casilla`
        : undefined)
    );
  },
);
