import { type Azar, entre, generadorDe, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import { type Pictograma, pictogramaDe } from '../pictogramas.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-05 · «Toca solo lo que cambia» (motor `tocar_el_objetivo`, modo `flujo`): 40 sesiones.
 *
 * Unos simbolos aparecen de uno en uno y se toca solo cuando sale el objetivo. 10 objetivos x 3
 * velocidades (un estimulo cada 2,0, 1,6 o 1,2 s) = 30, y 10 variantes con **dos objetivos** = 40.
 *
 * - **El estimulo mas rapido es de 1 por segundo y nunca parpadea** (fotosensibilidad, R10): el contrato
 *   rechaza menos de 1.000 ms, y la secuencia nunca repite el mismo simbolo dos veces seguidas.
 * - **Quince objetivos por sesion**, el maximo de la mecanica (un toque acertado, un punto). Para que no
 *   queden pegados ni la secuencia sea un compas, el flujo trae 45 estimulos y no 30 (desvio de la ficha, que
 *   decia 30: con quince objetivos en treinta no cabe un simbolo distinto entre cada dos).
 * - Los toques de mas no cuentan como error: eso es de la pantalla.
 */

const ESTIMULOS = 45;
const OBJETIVOS = 15;

/** Los diez objetivos, cada uno con los cuatro simbolos con que se mezcla. */
const OBJETIVOS_Y_OTROS: readonly {
  readonly objetivo: string;
  readonly otros: readonly string[];
}[] = [
  { objetivo: 'estrella', otros: ['circulo', 'cuadrado', 'triangulo', 'rombo'] },
  { objetivo: 'sol', otros: ['luna', 'nube', 'gota', 'rayo'] },
  { objetivo: 'manzana', otros: ['pera', 'uva', 'naranja', 'banano'] },
  { objetivo: 'gato', otros: ['perro', 'pez', 'conejo', 'tortuga'] },
  { objetivo: 'arbol', otros: ['flor', 'hoja', 'hongo', 'cactus'] },
  { objetivo: 'llave', otros: ['taza', 'silla', 'libro', 'reloj'] },
  { objetivo: 'bus', otros: ['tren', 'barco', 'carro', 'moto'] },
  { objetivo: 'mariposa', otros: ['abeja', 'ave', 'caracol', 'pez'] },
  { objetivo: 'gota', otros: ['circulo', 'cuadrado', 'hoja', 'nube'] },
  { objetivo: 'lluvia', otros: ['sol', 'viento', 'copo', 'arcoiris'] },
];

const VELOCIDADES = [
  { ms: 2000, nivel: 1, palabra: 'a tu ritmo' },
  { ms: 1600, nivel: 2, palabra: 'con ritmo' },
  { ms: 1200, nivel: 3, palabra: 'ligero' },
] as const;

const simbolo = (clave: string) => {
  const { nombre }: Pictograma = pictogramaDe(clave);

  return { clave, nombre, pictograma: clave };
};

/**
 * La secuencia: `OBJETIVOS` apariciones de los objetivos repartidas entre `ESTIMULOS` lugares, **nunca dos
 * seguidas**, y entre medias simbolos que no se repiten seguidos. Con dos objetivos se alternan al azar.
 *
 * Los lugares se sacan de `ESTIMULOS - (OBJETIVOS - 1)` y se separan sumando la posicion: asi ningun par queda
 * pegado y todos los reparto posibles tienen la misma probabilidad.
 */
function secuenciaDe(azar: Azar, objetivos: readonly string[], otros: readonly string[]): string[] {
  const libres = ESTIMULOS - (OBJETIVOS - 1);
  const elegidos = revolver(
    azar,
    Array.from({ length: libres }, (_, i) => i),
  )
    .slice(0, OBJETIVOS)
    .sort((una, otra) => una - otra);
  const lugares = new Set(elegidos.map((lugar, posicion) => lugar + posicion));
  const quienes = revolver(
    azar,
    Array.from({ length: OBJETIVOS }, (_, i) => objetivos[i % objetivos.length] as string),
  );
  const secuencia: string[] = [];
  let siguienteObjetivo = 0;

  for (let lugar = 0; lugar < ESTIMULOS; lugar++) {
    if (lugares.has(lugar)) {
      secuencia.push(quienes[siguienteObjetivo] as string);
      siguienteObjetivo += 1;
      continue;
    }

    // Un simbolo igual al anterior no se veria como uno nuevo.
    const alternativas = otros.filter((una) => una !== secuencia[lugar - 1]);

    secuencia.push(alternativas[entre(azar, 0, alternativas.length - 1)] as string);
  }

  return secuencia;
}

function sesion(
  numero: number,
  titulo: string,
  nivel: 1 | 2 | 3,
  ms: number,
  objetivos: readonly string[],
  otros: readonly string[],
): SesionDeContenido {
  const azar = generadorDe(0x5e5e0000 + numero * 104729);
  const secuencia = secuenciaDe(azar, objetivos, otros);

  return {
    id: idDeSesion('COG-05', numero),
    titulo,
    nivel,
    parametros: {
      modo: 'flujo',
      objetivos: objetivos.map(simbolo),
      otros: otros.map(simbolo),
      secuencia,
      msPorEstimulo: ms,
      puntosMaximos: secuencia.filter((una) => objetivos.includes(una)).length,
    },
  };
}

export function sesionesDeAtencion(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  for (const { objetivo, otros } of OBJETIVOS_Y_OTROS) {
    for (const { ms, nivel, palabra } of VELOCIDADES) {
      numero += 1;
      sesiones.push(
        sesion(
          numero,
          `Toca ${simbolo(objetivo).nombre}, ${palabra}`,
          nivel,
          ms,
          [objetivo],
          otros,
        ),
      );
    }
  }

  // Diez con dos objetivos: el de la fila y el de la siguiente, a velocidad media.
  OBJETIVOS_Y_OTROS.forEach(({ objetivo, otros }, i) => {
    const segundo = OBJETIVOS_Y_OTROS[(i + 3) % OBJETIVOS_Y_OTROS.length]?.objetivo as string;
    const sinSegundo = otros.filter((una) => una !== segundo);

    numero += 1;
    sesiones.push(
      sesion(
        numero,
        `Toca ${simbolo(objetivo).nombre} y ${simbolo(segundo).nombre}`,
        2,
        1600,
        [objetivo, segundo],
        sinSegundo.filter((una) => una !== objetivo),
      ),
    );
  });

  return sesiones;
}
