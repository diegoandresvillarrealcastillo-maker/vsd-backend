import { describe, expect, it } from 'vitest';
import {
  basesDelPrimerAviso,
  basesDelSegundoAviso,
  FrecuenciaDelSemaforo,
  minutosDelSemaforo,
  type RangoDeMinutos,
} from './FrecuenciaDelSemaforo.js';

const OCHO = 8 * 60;
const DOCE = 12 * 60;
const SEIS_DE_LA_TARDE = 18 * 60;
const OCHO_DE_LA_NOCHE = 20 * 60;
const ULTIMO_MINUTO = 24 * 60 - 1;

describe('minutosDelSemaforo (SCRUM-146)', () => {
  it('sin hora base el semaforo esta apagado, con cualquier frecuencia', () => {
    for (const frecuencia of Object.values(FrecuenciaDelSemaforo)) {
      expect(minutosDelSemaforo(null, frecuencia)).toEqual({ primero: null, segundo: null });
    }
  });

  describe('con una hora base de la manana', () => {
    it('«solo en la manana» avisa a la hora base y nada mas', () => {
      expect(minutosDelSemaforo(OCHO, FrecuenciaDelSemaforo.MANANA)).toEqual({
        primero: OCHO,
        segundo: null,
      });
    });

    it('«solo en la noche» avisa doce horas despues', () => {
      expect(minutosDelSemaforo(OCHO, FrecuenciaDelSemaforo.NOCHE)).toEqual({
        primero: null,
        segundo: OCHO_DE_LA_NOCHE,
      });
    });

    it('«dos veces al dia» avisa a la hora base y doce horas despues', () => {
      expect(minutosDelSemaforo(OCHO, FrecuenciaDelSemaforo.DOS_VECES)).toEqual({
        primero: OCHO,
        segundo: OCHO_DE_LA_NOCHE,
      });
    });
  });

  describe('con una hora base desde las 12:00 (el punto abierto del ticket)', () => {
    it('«solo en la manana» sigue avisando a la hora que la persona tenia: no se le mueve nada', () => {
      expect(minutosDelSemaforo(SEIS_DE_LA_TARDE, FrecuenciaDelSemaforo.MANANA)).toEqual({
        primero: SEIS_DE_LA_TARDE,
        segundo: null,
      });
    });

    it('«solo en la noche» avisa a esa misma hora: nunca cruza la medianoche', () => {
      expect(minutosDelSemaforo(SEIS_DE_LA_TARDE, FrecuenciaDelSemaforo.NOCHE)).toEqual({
        primero: null,
        segundo: SEIS_DE_LA_TARDE,
      });
    });

    it('«dos veces al dia» avisa doce horas antes y a esa hora: las dos dentro del mismo dia', () => {
      expect(minutosDelSemaforo(SEIS_DE_LA_TARDE, FrecuenciaDelSemaforo.DOS_VECES)).toEqual({
        primero: SEIS_DE_LA_TARDE - DOCE,
        segundo: SEIS_DE_LA_TARDE,
      });
    });

    it('las 12:00 en punto es el borde: ya es hora de la tarde', () => {
      expect(minutosDelSemaforo(DOCE, FrecuenciaDelSemaforo.DOS_VECES)).toEqual({
        primero: 0,
        segundo: DOCE,
      });
    });

    it('las 11:59 todavia es hora de la manana', () => {
      expect(minutosDelSemaforo(DOCE - 1, FrecuenciaDelSemaforo.DOS_VECES)).toEqual({
        primero: DOCE - 1,
        segundo: ULTIMO_MINUTO,
      });
    });

    it('las 23:59 queda dentro del dia', () => {
      expect(minutosDelSemaforo(ULTIMO_MINUTO, FrecuenciaDelSemaforo.DOS_VECES)).toEqual({
        primero: DOCE - 1,
        segundo: ULTIMO_MINUTO,
      });
    });
  });

  it('con cualquier hora base y frecuencia, los avisos caen dentro del dia y no se repiten', () => {
    for (let base = 0; base <= ULTIMO_MINUTO; base += 1) {
      for (const frecuencia of Object.values(FrecuenciaDelSemaforo)) {
        const { primero, segundo } = minutosDelSemaforo(base, frecuencia);

        for (const minuto of [primero, segundo]) {
          if (minuto !== null) {
            expect(minuto).toBeGreaterThanOrEqual(0);
            expect(minuto).toBeLessThanOrEqual(ULTIMO_MINUTO);
          }
        }

        if (primero !== null && segundo !== null) {
          // Dos veces al dia, a doce horas una de otra: nunca el mismo minuto.
          expect(segundo - primero).toBe(DOCE);
        }
      }
    }
  });
});

/** Si `valor` cae dentro de alguno de los rangos. */
function dentro(rangos: readonly RangoDeMinutos[], valor: number): boolean {
  return rangos.some((rango) => valor >= rango.desde && valor <= rango.hasta);
}

describe('las bases a las que les toca un aviso en una ventana (SCRUM-146)', () => {
  /**
   * Es lo que la base de datos usa para encontrar a quien le toca sin traer a todos: tiene que dar
   * **exactamente** lo mismo que `minutosDelSemaforo`, para cada hora base, cada frecuencia y cada
   * ventana. Se comprueba con todas las horas base y ventanas de uno y de treinta y un minutos
   * (la gracia de la revision) en todo el dia.
   */
  it('coinciden con minutosDelSemaforo para todas las horas base y todas las ventanas', () => {
    // Sin un `expect` por comparacion: son millones, y una sola lista de diferencias dice cuales.
    const diferencias: string[] = [];
    const cae = (minuto: number | null, desde: number, hasta: number): boolean =>
      minuto !== null && minuto >= desde && minuto <= hasta;

    for (const ancho of [0, 30]) {
      for (let desde = 0; desde <= ULTIMO_MINUTO; desde += ancho === 0 ? 1 : 5) {
        const hasta = Math.min(ULTIMO_MINUTO, desde + ancho);
        const primeroDosVeces = basesDelPrimerAviso(FrecuenciaDelSemaforo.DOS_VECES, desde, hasta);
        const primeroManana = basesDelPrimerAviso(FrecuenciaDelSemaforo.MANANA, desde, hasta);
        const segundo = basesDelSegundoAviso(desde, hasta);

        for (let base = 0; base <= ULTIMO_MINUTO; base += 1) {
          const manana = minutosDelSemaforo(base, FrecuenciaDelSemaforo.MANANA);
          const dosVeces = minutosDelSemaforo(base, FrecuenciaDelSemaforo.DOS_VECES);
          const noche = minutosDelSemaforo(base, FrecuenciaDelSemaforo.NOCHE);

          if (dentro(primeroManana, base) !== cae(manana.primero, desde, hasta)) {
            diferencias.push(`manana: base ${base} en ${desde}-${hasta}`);
          }

          if (dentro(primeroDosVeces, base) !== cae(dosVeces.primero, desde, hasta)) {
            diferencias.push(`dos veces, primero: base ${base} en ${desde}-${hasta}`);
          }

          // El segundo aviso es el mismo para «solo en la noche» y para «dos veces».
          if (
            dentro(segundo, base) !== cae(dosVeces.segundo, desde, hasta) ||
            noche.segundo !== dosVeces.segundo
          ) {
            diferencias.push(`segundo: base ${base} en ${desde}-${hasta}`);
          }
        }
      }
    }

    expect(diferencias.slice(0, 10)).toEqual([]);
  });

  it('el primer aviso de «dos veces» nunca cae por la tarde: una ventana de las 20:00 no encuentra a nadie', () => {
    const rangos = basesDelPrimerAviso(FrecuenciaDelSemaforo.DOS_VECES, 1200, 1200);

    expect(rangos).toEqual([]);
  });

  it('la ventana 07:30-08:00 encuentra a quien tiene base 08:00 y a quien tiene base 20:00 en «dos veces»', () => {
    const rangos = basesDelPrimerAviso(FrecuenciaDelSemaforo.DOS_VECES, 450, 480);

    expect(dentro(rangos, OCHO)).toBe(true);
    expect(dentro(rangos, OCHO_DE_LA_NOCHE)).toBe(true);
    expect(dentro(rangos, OCHO + 60)).toBe(false);
  });
});
