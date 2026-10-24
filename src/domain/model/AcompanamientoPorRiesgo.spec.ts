import { describe, expect, it } from 'vitest';
import {
  actividadesQueCuentanParaAcompanar,
  DIAS_PARA_ACOMPANAR,
  DIAS_PARA_LAS_LINEAS,
  diasSeguidosConAtencion,
  nivelDeAcompanamiento,
} from './AcompanamientoPorRiesgo.js';
import { Activity, DireccionEscala } from './Activity.js';
import { Categoria } from './Categoria.js';
import { ActivityId, CategoryId } from './Identifier.js';

/** Los dias de octubre de 2026 que se pidan, como AAAA-MM-DD. */
function dias(...numeros: number[]): string[] {
  return numeros.map((n) => `2026-10-${String(n).padStart(2, '0')}`);
}

const HOY = '2026-10-15';

describe('los umbrales (SCRUM-177)', () => {
  it('son 3 dias seguidos para acompanar y 7 para ensenar las lineas', () => {
    expect(DIAS_PARA_ACOMPANAR).toBe(3);
    expect(DIAS_PARA_LAS_LINEAS).toBe(7);
  });
});

describe('diasSeguidosConAtencion', () => {
  it('sin dias con atencion son 0', () => {
    expect(diasSeguidosConAtencion([], HOY)).toBe(0);
  });

  it('cuenta los dias seguidos que terminan hoy', () => {
    expect(diasSeguidosConAtencion(dias(13, 14, 15), HOY)).toBe(3);
  });

  it('hoy no rompe la cadena hasta que termina: si hoy no hay nada, cuenta la de ayer', () => {
    expect(diasSeguidosConAtencion(dias(12, 13, 14), HOY)).toBe(3);
  });

  it('un dia sin atencion rompe la cadena: solo cuentan los de despues del hueco', () => {
    expect(diasSeguidosConAtencion(dias(9, 10, 11, 13, 14, 15), HOY)).toBe(3);
  });

  it('si el ultimo dia con atencion es de antes de ayer, la cadena ya se rompio', () => {
    expect(diasSeguidosConAtencion(dias(11, 12, 13), HOY)).toBe(0);
  });

  it('un dia repetido cuenta una vez, y el orden no importa', () => {
    expect(diasSeguidosConAtencion(dias(15, 13, 14, 14, 15), HOY)).toBe(3);
  });

  it('lo posterior a hoy se ignora: un reloj adelantado no adelanta nada', () => {
    expect(diasSeguidosConAtencion(dias(16, 17, 18), HOY)).toBe(0);
    expect(diasSeguidosConAtencion(dias(14, 15, 16, 17), HOY)).toBe(2);
  });

  it('cruza el cambio de mes', () => {
    expect(diasSeguidosConAtencion(['2026-09-29', '2026-09-30', '2026-10-01'], '2026-10-01')).toBe(
      3,
    );
  });

  it('rechaza un hoy que no es un dia con formato AAAA-MM-DD', () => {
    expect(() => diasSeguidosConAtencion([], '15/10/2026')).toThrow(RangeError);
  });
});

describe('nivelDeAcompanamiento', () => {
  it('sin nada, ninguno', () => {
    expect(nivelDeAcompanamiento([], HOY)).toBe('ninguno');
  });

  it('2 dias seguidos todavia no son nada', () => {
    expect(nivelDeAcompanamiento(dias(14, 15), HOY)).toBe('ninguno');
  });

  it('a los 3 dias seguidos, moderado', () => {
    expect(nivelDeAcompanamiento(dias(13, 14, 15), HOY)).toBe('moderado');
  });

  it('hasta los 6 sigue siendo moderado', () => {
    expect(nivelDeAcompanamiento(dias(10, 11, 12, 13, 14, 15), HOY)).toBe('moderado');
  });

  it('a los 7 dias seguidos, critico', () => {
    expect(nivelDeAcompanamiento(dias(9, 10, 11, 12, 13, 14, 15), HOY)).toBe('critico');
  });

  it('una semana con un dia sin atencion en medio no es critica', () => {
    expect(nivelDeAcompanamiento(dias(9, 10, 11, 13, 14, 15), HOY)).toBe('moderado');
  });

  it('sin actividad hoy, la cadena de ayer sigue contando', () => {
    expect(nivelDeAcompanamiento(dias(8, 9, 10, 11, 12, 13, 14), HOY)).toBe('critico');
  });

  it('si ni ayer ni hoy hubo atencion, la cadena ya se rompio y no hay nada que ofrecer', () => {
    expect(nivelDeAcompanamiento(dias(10, 11, 12, 13), HOY)).toBe('ninguno');
  });
});

describe('actividadesQueCuentanParaAcompanar (ADR 0034, pregunta 1)', () => {
  const MEMORIA = '33333333-3333-4333-a333-333333333331';
  const CARGA = '33333333-3333-4333-a333-333333333332';
  const ANIMO = '33333333-3333-4333-a333-333333333333';
  const RESPIRACION = '33333333-3333-4333-a333-333333333334';

  function actividad(id: string, direccionEscala: DireccionEscala): Activity {
    return Activity.create({
      id: new ActivityId(id),
      nombre: `Actividad ${id.slice(-1)}`,
      direccionEscala,
      puntajeMaximo: direccionEscala === DireccionEscala.SIN_PUNTAJE ? undefined : 10,
    });
  }

  function catalogo(): readonly Categoria[] {
    return [
      Categoria.create({
        id: new CategoryId('44444444-4444-4444-8444-444444444441'),
        nombre: 'Cognición',
        actividades: [actividad(MEMORIA, DireccionEscala.MAYOR_ES_MEJOR)],
      }),
      Categoria.create({
        id: new CategoryId('44444444-4444-4444-8444-444444444442'),
        nombre: 'Emociones',
        actividades: [
          actividad(CARGA, DireccionEscala.MAYOR_REQUIERE_ATENCION),
          actividad(ANIMO, DireccionEscala.MAYOR_REQUIERE_ATENCION),
          actividad(RESPIRACION, DireccionEscala.SIN_PUNTAJE),
        ],
      }),
    ];
  }

  it('solo cuentan las de «mayor requiere atencion»: un juego de memoria bajo no es una senal emocional', () => {
    expect(actividadesQueCuentanParaAcompanar(catalogo()).map((id) => id.value)).toEqual([
      CARGA,
      ANIMO,
    ]);
  });

  it('sin catalogo no cuenta ninguna', () => {
    expect(actividadesQueCuentanParaAcompanar([])).toEqual([]);
  });
});
