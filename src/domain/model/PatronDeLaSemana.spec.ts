import { describe, expect, it } from 'vitest';
import {
  DIAS_CON_ATENCION_PARA_UN_PATRON,
  DIAS_DE_LA_VENTANA,
  hayPatronEnLaSemana,
  type ResultadoDeUnDia,
} from './PatronDeLaSemana.js';
import { NivelOrientativo } from './OrientativeScore.js';

const { FAVORABLE, EN_SEGUIMIENTO, REQUIERE_ATENCION } = NivelOrientativo;

/** Un resultado que requiere atencion en ese dia. */
function mal(dia: string): ResultadoDeUnDia {
  return { dia, nivel: REQUIERE_ATENCION };
}

/** Un resultado que no requiere atencion en ese dia. */
function bien(dia: string, nivel: NivelOrientativo = FAVORABLE): ResultadoDeUnDia {
  return { dia, nivel };
}

describe('hayPatronEnLaSemana (SCRUM-200)', () => {
  it('son 4 dias de 7: la decision de Samuel del 15/10/2026', () => {
    expect(DIAS_DE_LA_VENTANA).toBe(7);
    expect(DIAS_CON_ATENCION_PARA_UN_PATRON).toBe(4);
  });

  it('sin resultados no hay patron', () => {
    expect(hayPatronEnLaSemana([], '2026-10-15')).toBe(false);
  });

  it('un solo resultado que requiere atencion no es un patron', () => {
    expect(hayPatronEnLaSemana([mal('2026-10-15')], '2026-10-15')).toBe(false);
  });

  it('3 dias de 7 no bastan', () => {
    const resultados = [mal('2026-10-15'), mal('2026-10-13'), mal('2026-10-11')];

    expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(false);
  });

  it('4 dias de 7 si son un patron', () => {
    const resultados = [mal('2026-10-15'), mal('2026-10-13'), mal('2026-10-11'), mal('2026-10-10')];

    expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(true);
  });

  it('cuenta 4 dias aunque haya muchos dias buenos entre medias', () => {
    const resultados = [
      mal('2026-10-15'),
      bien('2026-10-14'),
      mal('2026-10-13'),
      bien('2026-10-12'),
      mal('2026-10-11'),
      bien('2026-10-10'),
      mal('2026-10-09'),
    ];

    expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(true);
  });

  describe('la ventana: los 7 dias que terminan hoy', () => {
    it('hoy menos 6 todavia cuenta', () => {
      const resultados = [
        mal('2026-10-15'),
        mal('2026-10-14'),
        mal('2026-10-12'),
        mal('2026-10-09'),
      ];

      expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(true);
    });

    it('hoy menos 7 ya no cuenta', () => {
      const resultados = [
        mal('2026-10-15'),
        mal('2026-10-14'),
        mal('2026-10-12'),
        mal('2026-10-08'),
      ];

      expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(false);
    });

    it('un dia posterior a hoy (un reloj adelantado) se ignora', () => {
      const resultados = [
        mal('2026-10-15'),
        mal('2026-10-14'),
        mal('2026-10-13'),
        mal('2026-10-16'),
      ];

      expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(false);
    });

    it('cruza el cambio de mes y de ano', () => {
      const resultados = [
        mal('2027-01-03'),
        mal('2027-01-01'),
        mal('2026-12-31'),
        mal('2026-12-29'),
      ];

      expect(hayPatronEnLaSemana(resultados, '2027-01-04')).toBe(true);
      // Al dia siguiente el 29 de diciembre queda fuera: hoy menos 7.
      expect(hayPatronEnLaSemana(resultados, '2027-01-05')).toBe(false);
    });

    it('un 29 de febrero cuenta como un dia mas', () => {
      const resultados = [
        mal('2028-03-03'),
        mal('2028-03-01'),
        mal('2028-02-29'),
        mal('2028-02-28'),
      ];

      expect(hayPatronEnLaSemana(resultados, '2028-03-03')).toBe(true);
    });
  });

  describe('que cuenta como un dia', () => {
    it('varios resultados el mismo dia son un solo dia', () => {
      const resultados = [
        mal('2026-10-15'),
        mal('2026-10-15'),
        mal('2026-10-15'),
        mal('2026-10-14'),
        mal('2026-10-13'),
      ];

      expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(false);
    });

    it('un dia con un resultado bueno y otro que requiere atencion cuenta como dia con atencion', () => {
      const resultados = [
        bien('2026-10-15'),
        mal('2026-10-15'),
        mal('2026-10-14'),
        mal('2026-10-13'),
        mal('2026-10-12'),
      ];

      expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(true);
    });

    it('un resultado en seguimiento no es un dia con atencion', () => {
      const resultados = [
        mal('2026-10-15'),
        mal('2026-10-14'),
        mal('2026-10-13'),
        bien('2026-10-12', EN_SEGUIMIENTO),
      ];

      expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(false);
    });

    it('lo que no puntua no cuenta: ni como dia con atencion ni como dia registrado', () => {
      const resultados = [
        mal('2026-10-15'),
        mal('2026-10-14'),
        mal('2026-10-13'),
        { dia: '2026-10-12', nivel: undefined },
        { dia: '2026-10-11', nivel: undefined },
      ];

      expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(false);
    });
  });

  it('el orden en que llegan no cambia el resultado', () => {
    const resultados = [mal('2026-10-10'), mal('2026-10-15'), mal('2026-10-11'), mal('2026-10-13')];

    expect(hayPatronEnLaSemana(resultados, '2026-10-15')).toBe(true);
    expect(hayPatronEnLaSemana([...resultados].reverse(), '2026-10-15')).toBe(true);
  });

  it('rechaza un dia de hoy que no es un dia del calendario', () => {
    expect(() => hayPatronEnLaSemana([], '2026-02-30')).toThrow(RangeError);
  });
});
