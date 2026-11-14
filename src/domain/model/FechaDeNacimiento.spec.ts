import { describe, expect, it } from 'vitest';
import { InvalidBirthDateError } from './DomainError.js';
import { FechaDeNacimiento } from './FechaDeNacimiento.js';

const HOY = '2026-10-08';

describe('FechaDeNacimiento', () => {
  describe('que fechas admite', () => {
    it('una fecha real del pasado', () => {
      expect(FechaDeNacimiento.crear('1998-03-14', HOY).valor).toBe('1998-03-14');
    });

    it.each(['', 'ayer', '1998-3-14', '14/03/1998', '1998-03-14T00:00:00Z', ' 1998-03-14'])(
      'rechaza lo que no es AAAA-MM-DD: %j',
      (texto) => {
        expect(() => FechaDeNacimiento.crear(texto, HOY)).toThrow(InvalidBirthDateError);
      },
    );

    it.each(['2026-02-30', '2026-13-01', '1999-00-10', '2025-02-29'])(
      'rechaza un dia que no existe: %s',
      (texto) => {
        expect(() => FechaDeNacimiento.crear(texto, HOY)).toThrow(InvalidBirthDateError);
      },
    );

    it('rechaza una fecha del futuro, y tambien la de hoy', () => {
      expect(() => FechaDeNacimiento.crear('2026-10-09', HOY)).toThrow(InvalidBirthDateError);
      expect(() => FechaDeNacimiento.crear('2030-01-01', HOY)).toThrow(InvalidBirthDateError);
      expect(() => FechaDeNacimiento.crear(HOY, HOY)).toThrow(InvalidBirthDateError);
    });

    it('admite hasta los 120 anos y rechaza a quien tendria 121', () => {
      expect(FechaDeNacimiento.crear('1906-10-08', HOY).edadEn(HOY)).toBe(120);
      expect(() => FechaDeNacimiento.crear('1905-10-08', HOY)).toThrow(InvalidBirthDateError);
      expect(() => FechaDeNacimiento.crear('1900-01-01', HOY)).toThrow(InvalidBirthDateError);
    });
  });

  describe('la edad', () => {
    it('a un dia de cumplir 18 todavia tiene 17', () => {
      expect(FechaDeNacimiento.crear('2008-10-09', HOY).edadEn(HOY)).toBe(17);
    });

    it('el dia que cumple 18 ya tiene 18', () => {
      expect(FechaDeNacimiento.crear('2008-10-08', HOY).edadEn(HOY)).toBe(18);
    });

    it('un dia despues de cumplir 18 sigue teniendo 18', () => {
      expect(FechaDeNacimiento.crear('2008-10-07', HOY).edadEn(HOY)).toBe(18);
    });

    it('17 anos y 364 dias es 17', () => {
      expect(FechaDeNacimiento.crear('2008-10-09', HOY).edadEn(HOY)).toBe(17);
      expect(FechaDeNacimiento.crear('2008-12-31', HOY).edadEn(HOY)).toBe(17);
    });

    it('cuenta bien el cambio de mes y de ano', () => {
      expect(FechaDeNacimiento.crear('2008-11-01', '2026-10-31').edadEn('2026-10-31')).toBe(17);
      expect(FechaDeNacimiento.crear('2008-01-01', '2026-01-01').edadEn('2026-01-01')).toBe(18);
      expect(FechaDeNacimiento.crear('2007-12-31', '2025-12-30').edadEn('2025-12-30')).toBe(17);
    });

    describe('nacidos un 29 de febrero', () => {
      const bisiesto = FechaDeNacimiento.crear('2008-02-29', HOY);

      it('en un ano que no es bisiesto cumplen el 1 de marzo, no antes', () => {
        // 2026 no es bisiesto: el 28 de febrero todavia no han cumplido 18.
        expect(bisiesto.edadEn('2026-02-28')).toBe(17);
        expect(bisiesto.edadEn('2026-03-01')).toBe(18);
      });

      it('en un ano bisiesto cumplen el 29', () => {
        // 2028 es bisiesto.
        expect(bisiesto.edadEn('2028-02-28')).toBe(19);
        expect(bisiesto.edadEn('2028-02-29')).toBe(20);
      });
    });
  });

  it('compara por la fecha', () => {
    expect(
      FechaDeNacimiento.crear('1998-03-14', HOY).equals(FechaDeNacimiento.crear('1998-03-14', HOY)),
    ).toBe(true);
    expect(
      FechaDeNacimiento.crear('1998-03-14', HOY).equals(FechaDeNacimiento.crear('1998-03-15', HOY)),
    ).toBe(false);
  });
});
