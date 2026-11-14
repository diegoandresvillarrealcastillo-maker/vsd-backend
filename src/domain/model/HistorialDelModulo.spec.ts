import { describe, expect, it } from 'vitest';
import {
  LIMITE_MAXIMO_DEL_HISTORIAL,
  LIMITE_POR_OMISION_DEL_HISTORIAL,
  codificarLaPagina,
  decodificarLaPagina,
  limiteDelHistorial,
} from './HistorialDelModulo.js';

const PUNTO = {
  hechaEn: new Date('2026-10-02T15:30:45.123Z'),
  id: '33333333-3333-4333-a333-000000000001',
};

describe('la pagina del historial (SCRUM-184)', () => {
  it('lo que se codifica se decodifica igual, con los milisegundos', () => {
    expect(decodificarLaPagina(codificarLaPagina(PUNTO))).toEqual(PUNTO);
  });

  it('es un texto opaco y seguro para una direccion', () => {
    const pagina = codificarLaPagina(PUNTO);

    expect(pagina).toMatch(/^[A-Za-z0-9_-]+$/u);
    expect(pagina).not.toContain(PUNTO.id);
  });

  it.each([
    ['vacio', ''],
    ['no es base64', '!!!'],
    ['sin identificador', Buffer.from('2026-10-02T15:30:45.123Z').toString('base64url')],
    [
      'fecha que no existe',
      Buffer.from(`2026-13-45T25:61:61.000Z|${PUNTO.id}`).toString('base64url'),
    ],
    [
      'identificador que no es uno',
      Buffer.from('2026-10-02T15:30:45.123Z|hola').toString('base64url'),
    ],
    [
      'con algo de mas',
      Buffer.from(`2026-10-02T15:30:45.123Z|${PUNTO.id}|x`).toString('base64url'),
    ],
  ])('una pagina mal formada (%s) no se decodifica', (_motivo, texto) => {
    expect(decodificarLaPagina(texto)).toBeNull();
  });

  describe('el limite', () => {
    it('sin pedirlo, el de siempre', () => {
      expect(limiteDelHistorial(undefined)).toBe(LIMITE_POR_OMISION_DEL_HISTORIAL);
    });

    it.each([
      [1, 1],
      [20, 20],
      [LIMITE_MAXIMO_DEL_HISTORIAL, LIMITE_MAXIMO_DEL_HISTORIAL],
      [LIMITE_MAXIMO_DEL_HISTORIAL + 1, LIMITE_MAXIMO_DEL_HISTORIAL],
      [10_000, LIMITE_MAXIMO_DEL_HISTORIAL],
      [0, 1],
      [-5, 1],
      [2.7, 2],
    ])('%s pasa a %s', (pedido, esperado) => {
      expect(limiteDelHistorial(pedido)).toBe(esperado);
    });

    it('algo que no es un numero cae al de siempre', () => {
      expect(limiteDelHistorial(Number.NaN)).toBe(LIMITE_POR_OMISION_DEL_HISTORIAL);
    });
  });
});
