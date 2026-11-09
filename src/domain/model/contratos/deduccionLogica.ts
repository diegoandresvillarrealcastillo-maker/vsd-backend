import { type Validador, entero, lista, objeto, repetido, requerido, texto } from './piezas.js';

const OPCION = objeto({
  clave: requerido(texto(24)),
  texto: requerido(texto(120)),
  correcta: requerido((valor, ruta) =>
    typeof valor === 'boolean' ? undefined : `${ruta} debe ser verdadero o falso`,
  ),
});

const RETO = objeto(
  {
    modo: requerido((valor, ruta) =>
      valor === 'deduccion_logica' ? undefined : `${ruta} debe ser deduccion_logica`,
    ),
    premisas: requerido(lista(2, 4, texto(180))),
    opciones: requerido(lista(3, 4, OPCION)),
    explicacion: requerido(texto(180)),
    puntosMaximos: requerido(entero(1, 1)),
  },
  (valor) => {
    const premisasRepetidas = repetido(valor['premisas'], 'premisas', null);

    if (premisasRepetidas !== undefined) {
      return premisasRepetidas;
    }

    const opciones = valor['opciones'] as readonly { clave: string; correcta: boolean }[];
    const claves = repetido(opciones, 'opciones', 'clave');

    if (claves !== undefined) {
      return claves;
    }

    const correctas = opciones.filter((opcion) => opcion.correcta);

    if (correctas.length !== 1) {
      return 'opciones debe tener una sola conclusion correcta';
    }

    return undefined;
  },
);

/** Una sesion de silogismo: varias premisas y una unica conclusion valida. */
export const DEDUCCION_LOGICA: Validador = (valor, ruta) => RETO(valor, ruta);
