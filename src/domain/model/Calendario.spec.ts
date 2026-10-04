import { describe, expect, it } from 'vitest';
import { Calendario, ZONA_HORARIA_POR_DEFECTO } from './Calendario.js';

// Bogota va cinco horas por detras de UTC todo el ano: Colombia no tiene
// horario de verano. Las 7 p. m. de Bogota son la medianoche UTC.
const bogota = new Calendario();

describe('Calendario', () => {
  it('usa la hora de Colombia si no se le indica otra', () => {
    expect(bogota.zonaHoraria).toBe(ZONA_HORARIA_POR_DEFECTO);
    expect(ZONA_HORARIA_POR_DEFECTO).toBe('America/Bogota');
  });

  describe('diaDe', () => {
    it('las 23:30 de Bogota pertenecen a ese dia, aunque en UTC ya sea el siguiente', () => {
      // Es el criterio de aceptacion del ticket: con la fecha UTC, lo que se
      // hiciera esta noche contaria para manana.
      const instante = new Date('2026-10-03T04:30:00Z');

      expect(instante.toISOString().slice(0, 10)).toBe('2026-10-03');
      expect(bogota.diaDe(instante)).toBe('2026-10-02');
    });

    it('las 6:59 p. m. de Bogota son ese dia en las dos zonas', () => {
      expect(bogota.diaDe(new Date('2026-10-02T23:59:00Z'))).toBe('2026-10-02');
    });

    it('las 7:00 p. m. de Bogota siguen siendo ese dia, aunque en UTC ya cambio', () => {
      expect(bogota.diaDe(new Date('2026-10-03T00:00:00Z'))).toBe('2026-10-02');
    });

    it('el dia cambia a la medianoche de Bogota, no a la de UTC', () => {
      expect(bogota.diaDe(new Date('2026-10-03T04:59:59.999Z'))).toBe('2026-10-02');
      expect(bogota.diaDe(new Date('2026-10-03T05:00:00Z'))).toBe('2026-10-03');
    });

    it('cruza bien el cambio de ano', () => {
      expect(bogota.diaDe(new Date('2027-01-01T03:00:00Z'))).toBe('2026-12-31');
    });

    it('rechaza una fecha invalida en lugar de devolver un dia inventado', () => {
      expect(() => bogota.diaDe(new Date(Number.NaN))).toThrow(RangeError);
    });
  });

  describe('limitesDelDia', () => {
    it('un dia de Bogota va de las 05:00 UTC a las 05:00 UTC del siguiente', () => {
      const { desde, hasta } = bogota.limitesDelDia('2026-10-02');

      expect(desde.toISOString()).toBe('2026-10-02T05:00:00.000Z');
      expect(hasta.toISOString()).toBe('2026-10-03T05:00:00.000Z');
    });

    it('cada instante del rango pertenece a ese dia, y el limite superior al siguiente', () => {
      const { desde, hasta } = bogota.limitesDelDia('2026-10-02');

      expect(bogota.diaDe(desde)).toBe('2026-10-02');
      expect(bogota.diaDe(new Date(hasta.getTime() - 1))).toBe('2026-10-02');
      expect(bogota.diaDe(hasta)).toBe('2026-10-03');
    });

    it('respeta el horario de verano en zonas que lo tienen', () => {
      // En Madrid el 26 de octubre de 2025 tuvo 25 horas: los relojes se
      // atrasaron a las 3 a. m. Colombia no lo necesita, pero el calculo no
      // debe depender de que la zona sea fija.
      const madrid = new Calendario('Europe/Madrid');
      const { desde, hasta } = madrid.limitesDelDia('2025-10-26');

      expect(desde.toISOString()).toBe('2025-10-25T22:00:00.000Z');
      expect(hasta.toISOString()).toBe('2025-10-26T23:00:00.000Z');
    });

    it('rechaza algo que no es AAAA-MM-DD', () => {
      expect(() => bogota.limitesDelDia('2/10/2026')).toThrow(RangeError);
    });
  });

  describe('diaDeLaSemana', () => {
    it.each([
      ['2026-09-28', 1],
      ['2026-10-02', 5],
      ['2026-10-04', 7],
    ])('el %s es el dia %i (1 = lunes)', (dia, esperado) => {
      expect(bogota.diaDeLaSemana(dia)).toBe(esperado);
    });

    it('no depende de la zona del calendario: un dia ya es local', () => {
      expect(new Calendario('Asia/Tokyo').diaDeLaSemana('2026-10-02')).toBe(5);
    });
  });

  describe('esZonaValida', () => {
    it.each(['America/Bogota', 'UTC', 'Europe/Madrid'])('acepta %s', (zona) => {
      expect(Calendario.esZonaValida(zona)).toBe(true);
    });

    it.each(['', '   ', 'Bogota', 'America/Medellin', 'GMT-5x'])('rechaza "%s"', (zona) => {
      expect(Calendario.esZonaValida(zona)).toBe(false);
    });

    it('no se puede construir con una zona desconocida', () => {
      expect(() => new Calendario('Colombia')).toThrow(RangeError);
    });
  });
});

describe('Calendario, los dias como texto (SCRUM-95)', () => {
  it.each(['2026-10-03', '2024-02-29', '1999-12-31'])('"%s" es un dia', (dia) => {
    expect(Calendario.esDia(dia)).toBe(true);
  });

  it.each(['2026-02-30', '2025-02-29', '2026-13-01', '2026-1-3', '03/10/2026', ''])(
    '"%s" no lo es',
    (dia) => {
      expect(Calendario.esDia(dia)).toBe(false);
    },
  );

  it('cuenta los dias entre dos fechas, tambien hacia atras', () => {
    expect(Calendario.diasEntre('2026-10-03', '2026-10-03')).toBe(0);
    expect(Calendario.diasEntre('2026-09-27', '2026-10-03')).toBe(6);
    expect(Calendario.diasEntre('2026-10-03', '2026-09-27')).toBe(-6);
    expect(Calendario.diasEntre('2025-10-03', '2026-10-03')).toBe(365);
  });
});
