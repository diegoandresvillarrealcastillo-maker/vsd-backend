import { describe, expect, it } from 'vitest';
import { Motor } from '../Motor.js';
import { problemaDeLosParametros } from '../ParametrosDelMotor.js';

const celdas = [
  { clave: 'a', etiqueta: 'Círculo azul', fila: 1, columna: 1 },
  { clave: 'b', etiqueta: 'Cuadrado verde', fila: 1, columna: 2 },
  { clave: 'c', etiqueta: 'Triángulo amarillo', fila: 2, columna: 1 },
  { clave: 'd', etiqueta: 'Estrella violeta', fila: 2, columna: 2 },
];

const valido = {
  modo: 'deduccion_espacial',
  filas: 2,
  columnas: 2,
  celdas,
  pistas: ['Tiene cuatro lados.', 'Está en la fila superior.'],
  solucion: 'b',
  explicacion: 'La respuesta cumple ambas pistas.',
  puntosMaximos: 1,
};

describe('el contrato de deduccion_espacial', () => {
  it('acepta un tablero completo y una solución dentro de él', () => {
    expect(problemaDeLosParametros(Motor.DEDUCCION_ESPACIAL, valido)).toBeUndefined();
  });

  it('rechaza soluciones que no pertenecen al tablero', () => {
    expect(
      problemaDeLosParametros(Motor.DEDUCCION_ESPACIAL, { ...valido, solucion: 'x' }),
    ).toContain('solucion');
  });

  it('rechaza posiciones repetidas', () => {
    const repetidas = [...celdas.slice(0, 3), { ...celdas[3]!, fila: 1, columna: 1 }];

    expect(
      problemaDeLosParametros(Motor.DEDUCCION_ESPACIAL, { ...valido, celdas: repetidas }),
    ).toContain('posición');
  });

  it('rechaza tableros incompletos', () => {
    expect(
      problemaDeLosParametros(Motor.DEDUCCION_ESPACIAL, {
        ...valido,
        celdas: celdas.slice(0, 3),
      }),
    ).toContain('de 4 a 16');
  });

  it('rechaza pistas duplicadas', () => {
    expect(
      problemaDeLosParametros(Motor.DEDUCCION_ESPACIAL, {
        ...valido,
        pistas: ['Tiene cuatro lados.', 'Tiene cuatro lados.'],
      }),
    ).toContain('pistas[1]');
  });
});
