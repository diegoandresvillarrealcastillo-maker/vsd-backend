import { type Validador, entero, lista, objeto, repetido, requerido, texto } from './piezas.js';

/**
 * M6, `calculo`: cuentas cortas, **sin reloj** (R4). Sirve a «Cuentas con calma» (COG-04).
 *
 * Cada ronda trae su enunciado, tres opciones y cual es la correcta. La sesion se genera con una semilla al
 * sembrarla (no en el telefono), asi que una prueba comprueba que la cuenta sale como dice y que **solo una
 * opcion es la correcta** antes de que la vea nadie.
 *
 * Nunca «te equivocaste», sino «otra vez»: eso es de la pantalla. Aqui, que las tres opciones sean distintas
 * y que `correcta` sea una de ellas.
 */
const RONDA = objeto(
  {
    enunciado: requerido(texto(160)),
    opciones: requerido(lista(3, 3, texto(24))),
    correcta: requerido(entero(0, 2)),
  },
  (valor) => repetido(valor['opciones'], 'opciones', null),
);

export const CALCULO: Validador = objeto(
  {
    rondas: requerido(lista(3, 10, RONDA)),
    puntosMaximos: requerido(entero(1, 100)),
  },
  (valor) =>
    valor['puntosMaximos'] === (valor['rondas'] as unknown[]).length
      ? undefined
      : `puntosMaximos (${String(valor['puntosMaximos'])}) tiene que ser las rondas (${(valor['rondas'] as unknown[]).length}): un acierto, un punto`,
);
