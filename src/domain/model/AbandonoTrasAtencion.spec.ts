import { describe, expect, it } from 'vitest';
import {
  abandonoTrasAtencion,
  DIAS_QUE_MIRA_EL_ACOMPANAMIENTO,
  DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO,
  DIAS_SIN_REGISTRAR_PARA_AVISAR,
} from './AbandonoTrasAtencion.js';
import { NivelDeAcompanamiento, nivelDeAcompanamiento } from './AcompanamientoPorRiesgo.js';
import { Calendario } from './Calendario.js';

/** Los dias de octubre de 2026 que se pidan, como AAAA-MM-DD. */
function dias(...numeros: number[]): string[] {
  return numeros.map((n) => `2026-10-${String(n).padStart(2, '0')}`);
}

const HOY = '2026-10-20';

describe('los umbrales del abandono (SCRUM-256)', () => {
  it('son 3 dias sin registrar para avisar y 30 de vigencia', () => {
    expect(DIAS_SIN_REGISTRAR_PARA_AVISAR).toBe(3);
    expect(DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO).toBe(30);
  });
});

describe('la ventana que mira el acompanamiento (SCRUM-264)', () => {
  /** Lo que decide el acompanamiento (los dos niveles), leyendo solo los dias con atencion desde `desde`. */
  function decision(
    conAtencion: readonly string[],
    conActividad: readonly string[],
    desde: string,
  ) {
    const leidos = conAtencion.filter((dia) => dia >= desde);

    return [
      nivelDeAcompanamiento(leidos, HOY),
      abandonoTrasAtencion(leidos, conActividad, HOY),
    ] as const;
  }

  const haceDias = (cuantos: number): string => Calendario.diasAntes(HOY, cuantos);

  it('son 37 dias: 30 de vigencia del abandono y 7 de la cadena que termina ahi', () => {
    expect(DIAS_QUE_MIRA_EL_ACOMPANAMIENTO).toBe(37);
  });

  it('en el borde, la cadena de 7 que termina 30 dias atras necesita 36: con 35 el resultado cambia', () => {
    // Su ultimo dia con actividad fue hace 30 dias, y venia de 7 seguidos con atencion (de 36 a 30).
    const cadena = Array.from({ length: 7 }, (_, i) => haceDias(36 - i));
    const completo = decision(cadena, cadena, '0000-01-01');

    expect(completo[1]).toBe(NivelDeAcompanamiento.CRITICO);
    expect(decision(cadena, cadena, haceDias(DIAS_QUE_MIRA_EL_ACOMPANAMIENTO))).toEqual(completo);
    expect(decision(cadena, cadena, haceDias(36))).toEqual(completo);
    expect(decision(cadena, cadena, haceDias(35))[1]).toBe(NivelDeAcompanamiento.MODERADO);
  });

  it('leer solo esa ventana da lo mismo que leer todo el historial, en 1.200 historias distintas', () => {
    let semilla = 20_261_025;
    // Un generador simple y fijo: la prueba no puede cambiar de una ejecucion a otra.
    const azar = (): number => {
      semilla = (semilla * 1_103_515_245 + 12_345) % 2_147_483_648;

      return semilla / 2_147_483_648;
    };

    for (let historia = 0; historia < 600; historia++) {
      // Rachas de actividad y de atencion de largos distintos sobre 90 dias, para que haya cadenas
      // de todos los tamanos y que terminen en todos los dias de la ventana y fuera de ella.
      const probabilidadDeActividad = 0.3 + azar() * 0.65;
      const probabilidadDeAtencion = 0.4 + azar() * 0.6;
      const conActividad: string[] = [];
      const conAtencion: string[] = [];

      for (let atras = 90; atras >= 0; atras--) {
        if (azar() < probabilidadDeActividad) {
          conActividad.push(haceDias(atras));

          if (azar() < probabilidadDeAtencion) {
            conAtencion.push(haceDias(atras));
          }
        }
      }

      expect(
        decision(conAtencion, conActividad, haceDias(DIAS_QUE_MIRA_EL_ACOMPANAMIENTO)),
        `historia ${historia}`,
      ).toEqual(decision(conAtencion, conActividad, '0000-01-01'));
    }

    // Las que importan en el borde: se fue hace `ultimo` dias tras una cadena de `largo` seguidos con
    // atencion, y lo anterior es ruido. Con 600 al azar de lo de arriba casi nunca se cae ahi.
    for (let historia = 0; historia < 600; historia++) {
      const ultimo = 3 + Math.floor(azar() * 28);
      const largo = 1 + Math.floor(azar() * 10);
      const conActividad = new Set<string>([haceDias(ultimo)]);
      const conAtencion = new Set<string>();

      for (let i = 0; i < largo; i++) {
        conAtencion.add(haceDias(ultimo + i));
        conActividad.add(haceDias(ultimo + i));
      }

      for (let atras = ultimo + largo; atras <= ultimo + largo + 40; atras++) {
        if (azar() < 0.5) {
          conActividad.add(haceDias(atras));

          if (azar() < 0.5) {
            conAtencion.add(haceDias(atras));
          }
        }
      }

      expect(
        decision([...conAtencion], [...conActividad], haceDias(DIAS_QUE_MIRA_EL_ACOMPANAMIENTO)),
        `borde ${historia}`,
      ).toEqual(decision([...conAtencion], [...conActividad], '0000-01-01'));
    }
  });
});

describe('abandonoTrasAtencion', () => {
  it('sin ninguna actividad no hay nada que decir', () => {
    expect(abandonoTrasAtencion([], [], HOY)).toBe(NivelDeAcompanamiento.NINGUNO);
  });

  it('3 dias con atencion, el ultimo hace 3 dias y nada despues: moderado', () => {
    const atencion = dias(15, 16, 17);

    expect(abandonoTrasAtencion(atencion, atencion, HOY)).toBe(NivelDeAcompanamiento.MODERADO);
  });

  it('7 dias con atencion antes de irse: critico', () => {
    const atencion = dias(10, 11, 12, 13, 14, 15, 16, 17);

    expect(abandonoTrasAtencion(atencion, atencion, HOY)).toBe(NivelDeAcompanamiento.CRITICO);
  });

  it('con 6 dias seguidos todavia es moderado, con 7 ya es critico', () => {
    const seis = dias(12, 13, 14, 15, 16, 17);
    const siete = dias(11, 12, 13, 14, 15, 16, 17);

    expect(abandonoTrasAtencion(seis, seis, HOY)).toBe(NivelDeAcompanamiento.MODERADO);
    expect(abandonoTrasAtencion(siete, siete, HOY)).toBe(NivelDeAcompanamiento.CRITICO);
  });

  it('con solo 2 dias con atencion antes de irse no hay abandono', () => {
    const atencion = dias(16, 17);

    expect(abandonoTrasAtencion(atencion, atencion, HOY)).toBe(NivelDeAcompanamiento.NINGUNO);
  });

  it('no avisa antes de tiempo: con 2 dias sin registrar todavia no', () => {
    const atencion = dias(16, 17, 18);

    expect(abandonoTrasAtencion(atencion, atencion, HOY)).toBe(NivelDeAcompanamiento.NINGUNO);
  });

  it('si la persona registro algo hoy, ya volvio: nada', () => {
    const atencion = dias(15, 16, 17);

    expect(abandonoTrasAtencion(atencion, [...atencion, ...dias(20)], HOY)).toBe(
      NivelDeAcompanamiento.NINGUNO,
    );
  });

  it('si despues de la mala racha hubo un dia sin atencion, no se fue mal: nada', () => {
    const atencion = dias(14, 15, 16);

    // El dia 17 hizo algo que no requirio atencion: lo ultimo que registro no fue de atencion.
    expect(abandonoTrasAtencion(atencion, [...atencion, ...dias(17)], HOY)).toBe(
      NivelDeAcompanamiento.NINGUNO,
    );
  });

  it('un dia con atencion y otro sin ella en medio parte la mala racha: cuenta solo la ultima', () => {
    // 10, 11, 12 con atencion; el 13 sin atencion (pero con actividad); 14, 15, 16 con atencion.
    const atencion = dias(10, 11, 12, 14, 15, 16);
    const actividad = dias(10, 11, 12, 13, 14, 15, 16);

    expect(abandonoTrasAtencion(atencion, actividad, HOY)).toBe(NivelDeAcompanamiento.MODERADO);
  });

  it('hace 30 dias todavia vale; hace 31 ya no se le habla de «hace unos dias»', () => {
    const atencion = ['2026-09-19', '2026-09-20', '2026-09-21'];

    expect(abandonoTrasAtencion(atencion, atencion, '2026-10-21')).toBe(
      NivelDeAcompanamiento.MODERADO,
    );
    expect(abandonoTrasAtencion(atencion, atencion, '2026-10-22')).toBe(
      NivelDeAcompanamiento.NINGUNO,
    );
  });

  it('lo posterior a hoy se ignora: un reloj adelantado no cambia nada', () => {
    const atencion = dias(15, 16, 17);

    expect(abandonoTrasAtencion(atencion, [...atencion, ...dias(25)], HOY)).toBe(
      NivelDeAcompanamiento.MODERADO,
    );
  });

  it('el orden y los dias repetidos no importan', () => {
    const atencion = dias(17, 15, 16, 16, 15);

    expect(abandonoTrasAtencion(atencion, atencion, HOY)).toBe(NivelDeAcompanamiento.MODERADO);
  });

  it('cruza el cambio de mes', () => {
    const atencion = ['2026-09-28', '2026-09-29', '2026-09-30'];

    expect(abandonoTrasAtencion(atencion, atencion, '2026-10-03')).toBe(
      NivelDeAcompanamiento.MODERADO,
    );
  });

  it('un dia que no es AAAA-MM-DD es un error de quien llama', () => {
    expect(() => abandonoTrasAtencion([], [], '20/10/2026')).toThrow(RangeError);
  });
});
