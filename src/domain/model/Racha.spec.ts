import { describe, expect, it } from 'vitest';
import { CONGELAMIENTOS_POR_MES, calcularLaRacha, diaSiguiente, nivelDeLaLlama } from './Racha.js';

/**
 * La racha (SCRUM-186): dias seguidos con al menos una actividad.
 *
 * Es una funcion pura de "los dias en que hizo algo" y "que dia es hoy". No hay
 * contador guardado: lo que se ve sale siempre de los resultados, igual que el sendero.
 *
 * Los dias de estas pruebas se arman a partir de un dia de referencia para que cada caso
 * se lea como una historia, no como una lista de fechas.
 */

const HOY = '2026-10-14';

/** El dia que esta `n` dias antes de otro. */
function antes(n: number, desde: string = HOY): string {
  let dia = desde;

  for (let i = 0; i < n; i++) {
    // Un dia menos, con aritmetica de calendario en UTC.
    const [anio, mes, d] = dia.split('-').map(Number) as [number, number, number];
    dia = new Date(Date.UTC(anio, mes - 1, d - 1)).toISOString().slice(0, 10);
  }

  return dia;
}

/** Los `cuantos` dias que terminan `hasta` (incluido). */
function seguidos(cuantos: number, hasta: string = HOY): string[] {
  return Array.from({ length: cuantos }, (_, i) => antes(i, hasta));
}

describe('diaSiguiente', () => {
  it('suma un dia, tambien al cruzar de mes y de ano', () => {
    expect(diaSiguiente('2026-10-14')).toBe('2026-10-15');
    expect(diaSiguiente('2026-10-31')).toBe('2026-11-01');
    expect(diaSiguiente('2026-12-31')).toBe('2027-01-01');
  });

  it('conoce el 29 de febrero de un ano bisiesto y no lo inventa en uno que no lo es', () => {
    expect(diaSiguiente('2028-02-28')).toBe('2028-02-29');
    expect(diaSiguiente('2028-02-29')).toBe('2028-03-01');
    expect(diaSiguiente('2027-02-28')).toBe('2027-03-01');
  });
});

describe('nivelDeLaLlama', () => {
  it.each([
    [0, 0],
    [1, 0],
    [6, 0],
    [7, 1],
    [29, 1],
    [30, 2],
    [89, 2],
    [90, 3],
    [364, 3],
    [365, 4],
    [900, 4],
  ])('con %i dias esta en el nivel %i', (dias, nivel) => {
    expect(nivelDeLaLlama(dias)).toBe(nivel);
  });
});

describe('calcularLaRacha', () => {
  describe('sin cadena', () => {
    it('sin actividad la llama descansa', () => {
      const racha = calcularLaRacha([], HOY);

      expect(racha).toMatchObject({
        dias: 0,
        nivel: 0,
        hechoHoy: false,
        enDescanso: true,
        congelamientosUsados: 0,
        diasCubiertos: [],
      });
    });

    it('un dia suelto cuenta como uno', () => {
      const racha = calcularLaRacha([HOY], HOY);

      expect(racha).toMatchObject({ dias: 1, hechoHoy: true, enDescanso: false, nivel: 0 });
    });

    it('un dia repetido no cuenta dos veces', () => {
      expect(calcularLaRacha([HOY, HOY, HOY], HOY).dias).toBe(1);
    });

    it('lo que viene de dias que todavia no llegan se ignora', () => {
      // Un reloj adelantado puede dejar un resultado "de manana": no suma ni rompe nada.
      expect(calcularLaRacha([HOY, diaSiguiente(HOY)], HOY).dias).toBe(1);
    });
  });

  describe('dias seguidos', () => {
    it('cuenta los dias seguidos que terminan hoy', () => {
      expect(calcularLaRacha(seguidos(5), HOY).dias).toBe(5);
    });

    it('si hoy todavia no hizo nada, la cadena de ayer sigue en pie: hoy no ha terminado', () => {
      const racha = calcularLaRacha(seguidos(5, antes(1)), HOY);

      expect(racha).toMatchObject({ dias: 5, hechoHoy: false, enDescanso: false });
      // Y no gasta un congelamiento por un dia que aun esta en curso.
      expect(racha.congelamientosUsados).toBe(0);
    });

    it('cruza el cambio de mes y de ano', () => {
      const racha = calcularLaRacha(['2026-12-30', '2026-12-31', '2027-01-01'], '2027-01-01');

      expect(racha.dias).toBe(3);
    });

    it('sube de nivel en las fronteras (7, 30, 90 y 365 dias)', () => {
      expect(calcularLaRacha(seguidos(6), HOY).nivel).toBe(0);
      expect(calcularLaRacha(seguidos(7), HOY).nivel).toBe(1);
      expect(calcularLaRacha(seguidos(30), HOY).nivel).toBe(2);
      expect(calcularLaRacha(seguidos(90), HOY).nivel).toBe(3);
      expect(calcularLaRacha(seguidos(365), HOY).nivel).toBe(4);
    });
  });

  describe('los congelamientos', () => {
    it('son tres por mes', () => {
      expect(CONGELAMIENTOS_POR_MES).toBe(3);
    });

    it('un dia sin actividad dentro de una cadena se cubre y la cadena sigue', () => {
      // Hizo algo hace 4, 3, 1 y hoy; el de hace 2 dias quedo sin nada.
      const racha = calcularLaRacha([antes(4), antes(3), antes(1), HOY], HOY);

      expect(racha.dias).toBe(4);
      expect(racha.diasCubiertos).toEqual([antes(2)]);
      expect(racha.congelamientosUsados).toBe(1);
      expect(racha.enDescanso).toBe(false);
    });

    it('un dia cubierto no suma: la racha cuenta dias con actividad', () => {
      const conHueco = calcularLaRacha([antes(2), antes(0)], HOY);
      const sinHueco = calcularLaRacha([antes(1), antes(0)], HOY);

      expect(conHueco.dias).toBe(sinHueco.dias);
    });

    it('con tres huecos en el mes se cubren los tres', () => {
      // Todo en octubre: con actividad el 7, 9, 11, 13 y 14; sin nada el 8, 10 y 12.
      const racha = calcularLaRacha(
        ['2026-10-07', '2026-10-09', '2026-10-11', '2026-10-13', HOY],
        HOY,
      );

      expect(racha.dias).toBe(5);
      expect(racha.congelamientosUsados).toBe(3);
      expect(racha.diasCubiertos).toEqual(['2026-10-08', '2026-10-10', '2026-10-12']);
    });

    it('al cuarto hueco del mes la cadena se corta y la llama descansa', () => {
      const racha = calcularLaRacha(
        ['2026-10-01', '2026-10-03', '2026-10-05', '2026-10-07', '2026-10-09'],
        '2026-10-09',
      );

      // Huecos: 2, 4, 6 y 8. Los tres primeros se cubren; el cuarto (el 8) no alcanza.
      expect(racha.dias).toBe(1);
      expect(racha.diasCubiertos).toEqual([]);
    });

    it('cada mes trae los suyos: tres a finales de un mes y tres a comienzos del otro', () => {
      const racha = calcularLaRacha(
        ['2026-09-26', '2026-09-28', '2026-09-30', '2026-10-02', '2026-10-04'],
        '2026-10-04',
      );

      // Huecos: 27 y 29 de septiembre, y 1 y 3 de octubre. Dos por mes: todos se cubren.
      expect(racha.dias).toBe(5);
      expect(racha.diasCubiertos).toEqual(['2026-09-27', '2026-09-29', '2026-10-01', '2026-10-03']);
      // Solo se cuentan los del mes en curso.
      expect(racha.congelamientosUsados).toBe(2);
    });

    it('si la cadena ya se habia roto, un hueco posterior no gasta un congelamiento', () => {
      // Cadena del 1 al 3 de octubre; despues nada hasta hoy, que si hizo algo.
      const racha = calcularLaRacha(['2026-10-01', '2026-10-02', '2026-10-03', HOY], HOY);

      // Los huecos del 4 al 13 son diez: cubre tres y se corta en el cuarto.
      expect(racha.dias).toBe(1);
      expect(racha.congelamientosUsados).toBe(3);
      expect(racha.diasCubiertos).toEqual([]);
    });

    it('lo que sobra de la cadena rota no cuenta: cuenta solo la cadena de ahora', () => {
      // Una cadena larga que se rompio y una nueva de tres dias que termina hoy.
      const racha = calcularLaRacha([...seguidos(10, '2026-08-20'), ...seguidos(3, HOY)], HOY);

      expect(racha.dias).toBe(3);
      expect(racha.diasCubiertos).toEqual([]);
    });
  });

  describe('la cadena de ayer sin cubrir', () => {
    it('si ayer no hizo nada y no quedan congelamientos, hoy empieza de nuevo', () => {
      // Cuatro dias de cadena que gastaron los tres congelamientos de octubre antes de ayer.
      const racha = calcularLaRacha(
        ['2026-10-01', '2026-10-03', '2026-10-05', '2026-10-07', '2026-10-09', '2026-10-11'],
        '2026-10-13',
      );

      // Huecos 2, 4, 6, 8, 10 y 12: tres se cubren, el cuarto corta la cadena.
      expect(racha.enDescanso).toBe(true);
      expect(racha.dias).toBe(0);
    });

    it('y si hoy hace algo, la llama vuelve con un dia', () => {
      const racha = calcularLaRacha(
        [
          '2026-10-01',
          '2026-10-03',
          '2026-10-05',
          '2026-10-07',
          '2026-10-09',
          '2026-10-11',
          '2026-10-13',
        ],
        '2026-10-13',
      );

      expect(racha).toMatchObject({ dias: 1, hechoHoy: true, enDescanso: false });
    });
  });

  it('un dia de otra zona horaria no cambia nada: solo se comparan dias del calendario', () => {
    // La zona la resuelve quien llama (Calendario); aqui los dias ya son locales.
    expect(calcularLaRacha(['2026-10-13', '2026-10-14'], '2026-10-14').dias).toBe(2);
  });

  it('rechaza un "hoy" que no es un dia', () => {
    expect(() => calcularLaRacha([], 'hoy')).toThrow(RangeError);
    expect(() => calcularLaRacha([], '2026-02-30')).toThrow(RangeError);
  });
});
