import { generadorDe, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import type { SesionDeContenido } from '../tipos.ts';

const FORMAS = [
  { clave: 'triangulo', nombre: 'Triángulo', lados: 3, pista: 'Tiene tres lados.' },
  { clave: 'cuadrado', nombre: 'Cuadrado', lados: 4, pista: 'Tiene cuatro lados.' },
  { clave: 'circulo', nombre: 'Círculo', lados: 0, pista: 'No tiene lados rectos.' },
] as const;

const COLORES = [
  { clave: 'rojo', nombre: 'rojo' },
  { clave: 'azul', nombre: 'azul' },
  { clave: 'amarillo', nombre: 'amarillo' },
] as const;

function nuevaCuadricula(numero: number): SesionDeContenido {
  const pares = FORMAS.flatMap((forma) =>
    COLORES.map((color) => ({ forma, color, clave: `${forma.clave}-${color.clave}` })),
  );
  const casillas = revolver(generadorDe(0x10ca0000 + numero), pares).map((par, indice) => ({
    clave: par.clave,
    etiqueta: `${par.forma.nombre} ${par.color.nombre}`,
    fila: Math.floor(indice / 3) + 1,
    columna: (indice % 3) + 1,
    forma: par.forma,
    color: par.color,
  }));
  const elegida = casillas[(numero * 7) % casillas.length];

  if (elegida === undefined) {
    throw new Error(`No se pudo construir la cuadrícula ${numero}`);
  }

  return {
    id: idDeSesion('COG-10', numero),
    titulo: `Cruce de pistas ${numero}`,
    nivel: (Math.floor((numero - 1) / 14) + 1) as 1 | 2 | 3,
    parametros: {
      modo: 'deduccion_espacial',
      filas: 3,
      columnas: 3,
      celdas: casillas.map(({ forma: _forma, color: _color, ...casilla }) => casilla),
      pistas: [
        elegida.forma.pista,
        `Es de color ${elegida.color.nombre}.`,
        `Está en la fila ${elegida.fila}.`,
      ],
      solucion: elegida.clave,
      explicacion: `La ${elegida.etiqueta.toLowerCase()} es la única que cumple las tres pistas.`,
      puntosMaximos: 1,
    },
  };
}

/** Cuarenta cuadrículas con disposiciones, soluciones y cruces de pistas distintos. */
export function sesionesDeDeduccionEspacial(): readonly SesionDeContenido[] {
  return Array.from({ length: 40 }, (_, indice) => nuevaCuadricula(indice + 1));
}
