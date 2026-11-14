import { describe, expect, it } from 'vitest';
import { leerLasOpcionesDeLaPurga } from './leerLasOpcionesDeLaPurga.js';

const URL = 'postgresql://postgres.abc:secreto@host.example:5432/postgres';

describe('leerLasOpcionesDeLaPurga', () => {
  it('sin nada es un simulacro y usa la conexion del entorno', () => {
    expect(leerLasOpcionesDeLaPurga([])).toEqual({ aplicar: false, url: undefined });
  });

  it('solo borra si se pide con --aplicar', () => {
    expect(leerLasOpcionesDeLaPurga(['--aplicar'])).toEqual({ aplicar: true, url: undefined });
  });

  it('acepta la cadena de conexion antes o despues de la marca', () => {
    expect(leerLasOpcionesDeLaPurga([URL, '--aplicar'])).toEqual({ aplicar: true, url: URL });
    expect(leerLasOpcionesDeLaPurga(['--aplicar', URL])).toEqual({ aplicar: true, url: URL });
    expect(leerLasOpcionesDeLaPurga([URL])).toEqual({ aplicar: false, url: URL });
  });

  it('rechaza una marca que no conoce, en lugar de hacer un simulacro creyendo que borra', () => {
    expect(() => leerLasOpcionesDeLaPurga(['--apply'])).toThrow(/--apply/);
    expect(() => leerLasOpcionesDeLaPurga(['--aplicar', '--si'])).toThrow(/--si/);
  });

  it('rechaza dos cadenas de conexion: no adivina cual era la buena', () => {
    expect(() => leerLasOpcionesDeLaPurga([URL, `${URL}x`])).toThrow(/una sola/);
  });

  it('no deja el secreto en el mensaje de error', () => {
    try {
      leerLasOpcionesDeLaPurga([URL, `${URL}x`]);
    } catch (error) {
      expect(String(error)).not.toContain('secreto');
    }
  });
});
