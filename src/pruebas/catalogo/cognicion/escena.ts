import { type Azar, generadorDe, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import { PICTOGRAMAS, type Pictograma } from '../pictogramas.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-09 · «Lo que vi» (motor `ver_ocultar_recordar`, modo `escena`): 40 sesiones de 5 preguntas.
 *
 * Se ven unos pictogramas en una cuadricula unos segundos, se ocultan, y se pregunta que habia en 5 de los
 * lugares. Nivel 1: 6 pictogramas en 3 x 3. Nivel 2: 8 en 3 x 4. Nivel 3: 10 en 4 x 4. Sin escenas con
 * personas, para evitar sesgos, y distinta de «Encuentra la diferencia»: aqui se **ocultan** y se pregunta.
 *
 * Las escenas y las opciones salen de la biblioteca de 60 pictogramas con una semilla, asi que cada una es
 * distinta de las demas y siempre la misma. En el nivel 3 los distractores pueden ser de la propia escena
 * (otro lugar), que es mas dificil; en los otros dos son de fuera.
 */

const NIVELES = [
  {
    nivel: 1,
    pictogramas: 6,
    filas: 3,
    columnas: 3,
    vista: 10,
    sesiones: 13,
    titulo: 'Seis figuras',
  },
  {
    nivel: 2,
    pictogramas: 8,
    filas: 3,
    columnas: 4,
    vista: 10,
    sesiones: 13,
    titulo: 'Ocho figuras',
  },
  {
    nivel: 3,
    pictogramas: 10,
    filas: 4,
    columnas: 4,
    vista: 12,
    sesiones: 14,
    titulo: 'Diez figuras',
  },
] as const;

const PREGUNTAS = 5;

const figura = (una: Pictograma) => ({ pictograma: una.clave, nombre: una.nombre });

function sesion(
  numero: number,
  nivel: 1 | 2 | 3,
  titulo: string,
  pictogramas: number,
  filas: number,
  columnas: number,
  vista: number,
): SesionDeContenido {
  const azar: Azar = generadorDe(0x99990000 + numero * 7919);
  const delJuego = revolver(azar, PICTOGRAMAS).slice(0, pictogramas);
  const lugares = revolver(
    azar,
    Array.from({ length: filas * columnas }, (_, i) => ({
      fila: Math.floor(i / columnas) + 1,
      columna: (i % columnas) + 1,
    })),
  ).slice(0, pictogramas);
  const celdas = delJuego.map((una, i) => ({
    ...(lugares[i] as { fila: number; columna: number }),
    ...figura(una),
  }));
  const deFuera = PICTOGRAMAS.filter((una) => !delJuego.some((otra) => otra.clave === una.clave));
  const opcionesParaOtro = nivel === 3 ? [...delJuego, ...deFuera] : deFuera;

  const preguntas = revolver(azar, celdas)
    .slice(0, PREGUNTAS)
    .map((celda) => {
      const correcta = delJuego.find((una) => una.clave === celda.pictograma) as Pictograma;
      const cuantas = nivel === 1 ? 2 : 3;
      const distractores = revolver(
        azar,
        opcionesParaOtro.filter((una) => una.clave !== correcta.clave),
      ).slice(0, cuantas);
      const opciones = revolver(azar, [correcta, ...distractores]);

      return {
        texto: `¿Qué había en el lugar marcado? (fila ${celda.fila}, columna ${celda.columna})`,
        fila: celda.fila,
        columna: celda.columna,
        opciones: opciones.map(figura),
        correcta: opciones.indexOf(correcta),
      };
    });

  return {
    id: idDeSesion('COG-09', numero),
    titulo,
    nivel,
    parametros: {
      modo: 'escena',
      segundosVista: vista,
      filas,
      columnas,
      celdas,
      preguntas,
      puntosMaximos: PREGUNTAS,
    },
  };
}

export function sesionesDeEscenas(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  for (const { nivel, pictogramas, filas, columnas, vista, sesiones: cuantas, titulo } of NIVELES) {
    for (let dentro = 0; dentro < cuantas; dentro++) {
      numero += 1;
      sesiones.push(
        sesion(numero, nivel, `${titulo}, ${dentro + 1}`, pictogramas, filas, columnas, vista),
      );
    }
  }

  return sesiones;
}
