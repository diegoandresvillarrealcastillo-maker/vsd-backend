import { describe, expect, it } from 'vitest';
import { horaDelDispositivo, MAXIMO_SIN_CONEXION_EN_DIAS } from './HoraDelDispositivo.js';
import { TOLERANCIA_DEL_RELOJ_EN_MS } from './ToleranciaDelReloj.js';

const AHORA = new Date('2026-10-07T19:00:00.000Z'); // 2 p. m. en Colombia
const DIA_EN_MS = 24 * 60 * 60 * 1000;

describe('horaDelDispositivo (SCRUM-144)', () => {
  describe('lo que sirve', () => {
    it('una hora de hace unas horas se respeta tal cual: es lo que ocurrio sin conexion', () => {
      // Escrita a las 9:00 en Colombia, recibida a las 14:00.
      const nueve = '2026-10-07T14:00:00.000Z';

      expect(horaDelDispositivo(nueve, AHORA)).toEqual(new Date(nueve));
    });

    it('con desplazamiento horario se lleva al mismo instante', () => {
      expect(horaDelDispositivo('2026-10-07T09:00:00-05:00', AHORA)).toEqual(
        new Date('2026-10-07T14:00:00.000Z'),
      );
      expect(horaDelDispositivo('2026-10-07T16:00:00+02:00', AHORA)).toEqual(
        new Date('2026-10-07T14:00:00.000Z'),
      );
    });

    it('sin segundos o con fracciones de segundo tambien vale', () => {
      expect(horaDelDispositivo('2026-10-07T14:30Z', AHORA)).toEqual(
        new Date('2026-10-07T14:30:00.000Z'),
      );
      expect(horaDelDispositivo('2026-10-07T14:30:15.123456Z', AHORA)).toEqual(
        new Date('2026-10-07T14:30:15.123Z'),
      );
    });

    it('lo que acaba de ocurrir (la misma hora) se respeta', () => {
      expect(horaDelDispositivo(AHORA.toISOString(), AHORA)).toEqual(AHORA);
    });

    it('devuelve una copia de la fecha, no la misma instancia que se le paso', () => {
      const devuelta = horaDelDispositivo('2026-10-07T14:00:00.000Z', AHORA);

      devuelta.setTime(0);

      expect(horaDelDispositivo('2026-10-07T14:00:00.000Z', AHORA).getTime()).not.toBe(0);
    });
  });

  describe('el futuro', () => {
    it('un reloj adelantado hasta la tolerancia queda en "ahora": no pudo ocurrir despues', () => {
      const adelantada = new Date(AHORA.getTime() + TOLERANCIA_DEL_RELOJ_EN_MS).toISOString();

      expect(horaDelDispositivo(adelantada, AHORA)).toEqual(AHORA);
      expect(horaDelDispositivo(new Date(AHORA.getTime() + 1).toISOString(), AHORA)).toEqual(AHORA);
    });

    it('uno adelantado mas alla de la tolerancia se ignora, sin error', () => {
      const lejos = new Date(AHORA.getTime() + TOLERANCIA_DEL_RELOJ_EN_MS + 1).toISOString();

      expect(horaDelDispositivo(lejos, AHORA)).toEqual(AHORA);
      expect(horaDelDispositivo('2999-01-01T00:00:00Z', AHORA)).toEqual(AHORA);
    });
  });

  describe('lo muy antiguo', () => {
    it('hasta 30 dias atras se respeta', () => {
      const limite = new Date(AHORA.getTime() - MAXIMO_SIN_CONEXION_EN_DIAS * DIA_EN_MS);

      expect(MAXIMO_SIN_CONEXION_EN_DIAS).toBe(30);
      expect(horaDelDispositivo(limite.toISOString(), AHORA)).toEqual(limite);
    });

    it('un milisegundo mas antiguo se ignora', () => {
      const pasado = new Date(AHORA.getTime() - MAXIMO_SIN_CONEXION_EN_DIAS * DIA_EN_MS - 1);

      expect(horaDelDispositivo(pasado.toISOString(), AHORA)).toEqual(AHORA);
      expect(horaDelDispositivo('2000-01-01T00:00:00Z', AHORA)).toEqual(AHORA);
    });
  });

  describe('el limite inferior que pone quien llama', () => {
    const DESDE = new Date('2026-10-07T05:00:00.000Z'); // la medianoche de Colombia

    it('una hora anterior se ignora', () => {
      expect(horaDelDispositivo('2026-10-07T04:59:59.999Z', AHORA, DESDE)).toEqual(AHORA);
    });

    it('justo en el limite se respeta', () => {
      expect(horaDelDispositivo(DESDE.toISOString(), AHORA, DESDE)).toEqual(DESDE);
    });

    it('una posterior se respeta', () => {
      expect(horaDelDispositivo('2026-10-07T10:00:00Z', AHORA, DESDE)).toEqual(
        new Date('2026-10-07T10:00:00Z'),
      );
    });

    it('sin limite, solo mandan los demas', () => {
      expect(horaDelDispositivo('2026-10-01T00:00:00Z', AHORA)).toEqual(
        new Date('2026-10-01T00:00:00Z'),
      );
    });
  });

  describe('lo que no es una hora nunca rompe nada: se usa la del servidor', () => {
    it.each([
      ['nada', undefined],
      ['nulo', null],
      ['un numero', 1_790_000_000_000],
      ['un booleano', true],
      ['un objeto', { hora: '2026-10-07T14:00:00Z' }],
      ['una lista', ['2026-10-07T14:00:00Z']],
      ['texto vacio', ''],
      ['texto cualquiera', 'ayer por la tarde'],
      ['un numero escrito', '5'],
      ['un decimal escrito', '1.5'],
      ['un numero negativo escrito', '-5'],
      ['solo la fecha', '2026-10-07'],
      ['sin desplazamiento', '2026-10-07T14:00:00'],
      ['con espacio en vez de T', '2026-10-07 14:00:00Z'],
      ['con texto detras', '2026-10-07T14:00:00Z y algo mas'],
      ['con texto delante', 'a las 2026-10-07T14:00:00Z'],
      ['hora 24', '2026-10-07T24:00:00Z'],
      ['minuto 60', '2026-10-07T14:60:00Z'],
      ['segundo 60', '2026-10-07T14:00:60Z'],
      ['mes 13', '2026-13-07T14:00:00Z'],
      ['dia 32', '2026-10-32T14:00:00Z'],
      // Dentro de los ultimos 30 dias: `Date` los lee como el 1 de octubre, que
      // serviria, en lugar de rechazarlos.
      ['dia que no existe (31 de septiembre)', '2026-09-31T10:00:00Z'],
      ['dia 32 de septiembre', '2026-09-32T10:00:00Z'],
      ['desplazamiento imposible', '2026-10-07T14:00:00+25:00'],
    ])('%s', (_nombre, valor) => {
      expect(horaDelDispositivo(valor, AHORA)).toEqual(AHORA);
    });

    it('el 30 de febrero y el 29 de uno que no es bisiesto no existen, y se descartan aunque Date los lea como marzo', () => {
      const ahora = new Date('2026-03-10T12:00:00Z');

      expect(horaDelDispositivo('2026-02-30T10:00:00Z', ahora)).toBe(ahora);
      expect(horaDelDispositivo('2026-02-29T10:00:00Z', ahora)).toBe(ahora);
      expect(horaDelDispositivo('2026-02-28T10:00:00Z', ahora)).toEqual(
        new Date('2026-02-28T10:00:00Z'),
      );
    });

    it('el 29 de febrero de un ano bisiesto si existe', () => {
      const ahora = new Date('2028-03-05T12:00:00Z');

      expect(horaDelDispositivo('2028-02-29T10:00:00Z', ahora)).toEqual(
        new Date('2028-02-29T10:00:00Z'),
      );
    });

    it('devuelve la misma "ahora" que recibio, no una copia con otra hora', () => {
      expect(horaDelDispositivo('basura', AHORA)).toBe(AHORA);
    });
  });
});
