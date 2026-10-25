import { describe, expect, it } from 'vitest';
import {
  abandonoTrasAtencion,
  DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO,
  DIAS_SIN_REGISTRAR_PARA_AVISAR,
} from './AbandonoTrasAtencion.js';
import { NivelDeAcompanamiento } from './AcompanamientoPorRiesgo.js';

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
