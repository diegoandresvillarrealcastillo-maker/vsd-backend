import { describe, expect, it } from 'vitest';
import { FRANJAS, Franja, esFranja, franjaDe } from './Franja.js';

const hora = (h: number, m = 0) => h * 60 + m;

describe('franjaDe', () => {
  it.each([
    [hora(0), Franja.NOCHE],
    [hora(4, 59), Franja.NOCHE],
    [hora(5), Franja.MANANA],
    [hora(11, 59), Franja.MANANA],
    [hora(12), Franja.TARDE],
    [hora(18, 59), Franja.TARDE],
    [hora(19), Franja.NOCHE],
    [hora(23, 59), Franja.NOCHE],
  ])('el minuto %i del dia es %s', (minuto, esperada) => {
    expect(franjaDe(minuto)).toBe(esperada);
  });

  it('cada minuto del dia tiene una franja, y las tres existen', () => {
    const vistas = new Set<string>();

    for (let minuto = 0; minuto < 24 * 60; minuto++) {
      vistas.add(franjaDe(minuto));
    }

    expect([...vistas].sort()).toEqual([...FRANJAS].sort());
  });

  it('la noche son diez horas: de 19:00 a 4:59', () => {
    let minutos = 0;

    for (let minuto = 0; minuto < 24 * 60; minuto++) {
      if (franjaDe(minuto) === Franja.NOCHE) {
        minutos += 1;
      }
    }

    expect(minutos).toBe(10 * 60);
  });
});

describe('esFranja', () => {
  it.each(['manana', 'tarde', 'noche'])('%s es una franja', (valor) => {
    expect(esFranja(valor)).toBe(true);
  });

  it.each(['mañana', 'madrugada', '', null, undefined, 3])('%s no lo es', (valor) => {
    expect(esFranja(valor)).toBe(false);
  });
});
