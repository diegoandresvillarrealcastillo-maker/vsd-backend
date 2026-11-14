import {
  type Objeto,
  type Validador,
  entero,
  enteroONulo,
  lista,
  objeto,
  porModo,
  repetido,
  repetidoEntre,
  requerido,
  texto,
  unoDe,
} from './piezas.js';

/**
 * M2, `tocar_el_objetivo`: elegir en una cuadricula o en un flujo. Sirve a tres mecanicas:
 *
 * - **sin `modo`**: «Encuentra la diferencia», de siempre (Fase 0): rondas sobre una cuadricula, con o sin
 *   tiempo por ronda.
 * - `flujo`: «Toca solo lo que cambia» (COG-05). Unos simbolos aparecen de uno en uno y se toca solo cuando
 *   sale el objetivo. **Nunca mas de un estimulo por segundo y nunca parpadea** (fotosensibilidad, R10).
 * - `puntos`: «Une los puntos en orden» (COG-08). Puntos repartidos que se tocan en el orden de la lista.
 *   **No se cronometra y no se interpreta** (R13).
 *
 * En los dos modos nuevos la sesion trae todo lo que pasa, sin azar en el telefono: el contenido se
 * escribe (o se genera con una semilla) al sembrar, y asi se comprueba antes de que lo vea nadie.
 * `puntosMaximos` es el maximo de la mecanica; la prueba del contenido lo compara con el del catalogo.
 */

// ---------------------------------------------------------------------------
// Sin `modo`: encontrar la diferencia
// ---------------------------------------------------------------------------

/**
 * Elegir en una cuadricula. `lados` son los tamanos de la cuadricula, de menor a mayor, y las
 * rondas se reparten entre ellos en tramos iguales. `segundosPorRonda: null` es «sin tiempo».
 */
const DIFERENCIA = objeto(
  {
    rondas: requerido(entero(1, 60)),
    segundosPorRonda: requerido(enteroONulo(3, 120)),
    lados: requerido(lista(1, 6, entero(2, 8))),
  },
  (valor) => {
    const lados = valor['lados'] as number[];

    for (let posicion = 1; posicion < lados.length; posicion++) {
      if ((lados[posicion] as number) <= (lados[posicion - 1] as number)) {
        return 'lados debe ir de menor a mayor y sin repetir';
      }
    }

    const rondas = valor['rondas'] as number;

    return rondas < lados.length
      ? `rondas (${rondas}) no puede ser menor que el número de lados (${lados.length}): algún tamaño no se jugaría nunca`
      : undefined;
  },
);

// ---------------------------------------------------------------------------
// flujo: toca solo lo que cambia
// ---------------------------------------------------------------------------

/** Cada simbolo lleva su nombre escrito: ni el color ni la figura son la unica pista (R10). */
const SIMBOLO = objeto({
  clave: requerido(texto(20)),
  nombre: requerido(texto(40)),
  pictograma: requerido(texto(30)),
});

/** Mas de un estimulo por segundo seria un destello rapido (R10). */
const MS_MINIMO_POR_ESTIMULO = 1000;

const FLUJO = objeto(
  {
    modo: requerido(unoDe(['flujo'])),
    objetivos: requerido(lista(1, 2, SIMBOLO)),
    otros: requerido(lista(2, 8, SIMBOLO)),
    secuencia: requerido(lista(10, 60, texto(20))),
    msPorEstimulo: requerido(entero(MS_MINIMO_POR_ESTIMULO, 3000)),
    puntosMaximos: requerido(entero(1, 100)),
  },
  (valor) => {
    const problema =
      repetidoEntre(
        [
          ['objetivos', valor['objetivos']],
          ['otros', valor['otros']],
        ],
        'clave',
      ) ??
      repetidoEntre(
        [
          ['objetivos', valor['objetivos']],
          ['otros', valor['otros']],
        ],
        'nombre',
      );

    if (problema !== undefined) {
      return problema;
    }

    const claveDe = (lugar: unknown) => (lugar as Objeto)['clave'] as string;
    const objetivos = new Set((valor['objetivos'] as unknown[]).map(claveDe));
    const conocidas = new Set([...objetivos, ...(valor['otros'] as unknown[]).map(claveDe)]);
    const secuencia = valor['secuencia'] as string[];
    let apariciones = 0;

    for (const [posicion, clave] of secuencia.entries()) {
      if (!conocidas.has(clave)) {
        return `secuencia[${posicion}] es "${clave}", que no es ni un objetivo ni uno de los demás`;
      }

      if (posicion > 0 && secuencia[posicion - 1] === clave) {
        return `secuencia[${posicion}] repite "${clave}" justo después de sí mismo: no se vería que apareció otro`;
      }

      if (objetivos.has(clave)) {
        apariciones += 1;
      }
    }

    if (apariciones === 0) {
      return 'secuencia no trae ningún objetivo: no habría nada que tocar';
    }

    return valor['puntosMaximos'] === apariciones
      ? undefined
      : `puntosMaximos (${String(valor['puntosMaximos'])}) tiene que ser las veces que sale un objetivo en la secuencia (${apariciones}): un toque acertado, un punto`;
  },
);

// ---------------------------------------------------------------------------
// puntos: une los puntos en orden
// ---------------------------------------------------------------------------

/**
 * La lista va **en el orden en que se tocan**; la `etiqueta` es lo que se lee en el punto («1», «A»).
 * `x` e `y` son porcentajes de la tabla. Dos puntos a menos de 14 puntos de distancia (unos 45 px en un
 * telefono de 320 px) no se podrian tocar bien: el objetivo tactil minimo es de 44 px (R10).
 */
const DISTANCIA_MINIMA_ENTRE_PUNTOS = 14;

const PUNTOS = objeto(
  {
    modo: requerido(unoDe(['puntos'])),
    indicacion: requerido(texto(160)),
    puntos: requerido(
      lista(
        5,
        20,
        objeto({
          etiqueta: requerido(texto(4)),
          x: requerido(entero(5, 95)),
          y: requerido(entero(5, 95)),
        }),
      ),
    ),
    puntosMaximos: requerido(entero(1, 100)),
  },
  (valor) => {
    const repetida = repetido(valor['puntos'], 'puntos', 'etiqueta');

    if (repetida !== undefined) {
      return repetida;
    }

    const puntos = valor['puntos'] as { etiqueta: string; x: number; y: number }[];

    for (const [i, uno] of puntos.entries()) {
      for (const [j, otro] of puntos.entries()) {
        if (j <= i) {
          continue;
        }

        if (Math.hypot(uno.x - otro.x, uno.y - otro.y) < DISTANCIA_MINIMA_ENTRE_PUNTOS) {
          return `puntos[${i}] y puntos[${j}] quedan a menos de ${DISTANCIA_MINIMA_ENTRE_PUNTOS} de distancia: no se podrían tocar bien`;
        }
      }
    }

    return undefined;
  },
);

export const TOCAR_EL_OBJETIVO: Validador = porModo({ flujo: FLUJO, puntos: PUNTOS }, DIFERENCIA);
