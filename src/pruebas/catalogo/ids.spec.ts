import { describe, expect, it } from 'vitest';
import { idDeMecanica, idDeSesion } from './ids.ts';

describe('identificadores de fichas', () => {
  it('conserva los identificadores de dos cifras existentes', () => {
    expect(idDeMecanica('COG-02')).toBe('0acd0000-0000-4000-8000-000000000102');
    expect(idDeSesion('COG-02', 7)).toBe('5e510102-0000-4000-8000-000000000007');
  });

  it('admite fichas de tres cifras sin colisionar con las anteriores', () => {
    const mecanicas = ['COG-99', 'COG-100', 'COG-101', 'BIE-100', 'EMO-365'].map(idDeMecanica);
    const sesiones = ['COG-99', 'COG-100', 'COG-101', 'BIE-100', 'EMO-365'].map((codigo) =>
      idDeSesion(codigo, 1),
    );

    expect(new Set(mecanicas).size).toBe(mecanicas.length);
    expect(new Set(sesiones).size).toBe(sesiones.length);
    expect(mecanicas.every((id) => id.length === 36)).toBe(true);
    expect(sesiones.every((id) => id.length === 36)).toBe(true);
  });

  it('rechaza códigos no canónicos y números fuera del límite', () => {
    expect(() => idDeMecanica('COG-001')).toThrow();
    expect(() => idDeMecanica('COG-1000')).toThrow();
    expect(() => idDeSesion('COG-10', 0)).toThrow();
  });
});
