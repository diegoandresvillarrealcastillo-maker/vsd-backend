import { describe, expect, it } from 'vitest';
import { MOTORES, Motor, esMotor } from './Motor.js';

describe('Motor', () => {
  it('son los nueve motores de las fichas, de M1 a M9', () => {
    // El orden es el de CATALOGO-FICHAS-DE-MECANICAS.md §0.3 y el del CHECK de la base: si uno
    // cambia sin el otro, una mecanica valida en el dominio la rechaza la base (o al reves).
    expect(MOTORES).toEqual([
      'secuencia',
      'tocar_el_objetivo',
      'ver_ocultar_recordar',
      'clasificar',
      'palabras',
      'calculo',
      'guia_paso_a_paso',
      'cuestionario_corto',
      'escritura_breve',
    ]);
  });

  it('cada constante nombrada apunta a un motor distinto', () => {
    expect(new Set(Object.values(Motor)).size).toBe(9);
  });

  it.each(MOTORES)('reconoce %s', (motor) => {
    expect(esMotor(motor)).toBe(true);
  });

  it.each([
    ['un motor que no existe', 'memoria'],
    ['con otra capitalizacion', 'Secuencia'],
    ['con espacios', ' secuencia '],
    ['vacio', ''],
    ['un numero', 3],
    ['nulo', null],
    ['indefinido', undefined],
  ])('rechaza %s', (_caso, valor) => {
    expect(esMotor(valor)).toBe(false);
  });
});
