import { describe, expect, it } from 'vitest';
import { ActivityResult, type DatosDeResultado } from './ActivityResult';
import { FutureCompletionDateError } from './DomainError';
import { ActivityId, ClientOperationId, ResultId, UserId } from './Identifier';
import { OrientativeScore } from './OrientativeScore';

const USUARIO_A = '11111111-1111-4111-8111-111111111111';
const USUARIO_B = '22222222-2222-4222-9222-222222222222';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';
const OPERACION = '44444444-4444-4444-b444-444444444444';
const RESULTADO = '55555555-5555-4555-8555-555555555555';

const AHORA = new Date('2026-09-14T12:00:00.000Z');

function datos(sobrescribir: Partial<DatosDeResultado> = {}): DatosDeResultado {
  return {
    id: new ResultId(RESULTADO),
    userId: new UserId(USUARIO_A),
    activityId: new ActivityId(ACTIVIDAD),
    clientOperationId: new ClientOperationId(OPERACION),
    score: OrientativeScore.create(8, 10),
    completedAt: new Date('2026-09-14T11:00:00.000Z'),
    ...sobrescribir,
  };
}

describe('ActivityResult', () => {
  it('se construye con datos validos', () => {
    const resultado = ActivityResult.create(datos(), AHORA);

    expect(resultado.userId.value).toBe(USUARIO_A);
    expect(resultado.activityId.value).toBe(ACTIVIDAD);
    expect(resultado.clientOperationId.value).toBe(OPERACION);
    expect(resultado.score.value).toBe(8);
  });

  it('acepta una fecha igual al instante actual', () => {
    expect(() => ActivityResult.create(datos({ completedAt: AHORA }), AHORA)).not.toThrow();
  });

  it('rechaza una fecha de realizacion futura', () => {
    // El reloj del dispositivo puede estar desajustado cuando se trabaja sin
    // conexion. Aceptar una fecha futura desordenaria el historial.
    const futuro = new Date('2026-09-15T12:00:00.000Z');

    expect(() => ActivityResult.create(datos({ completedAt: futuro }), AHORA)).toThrow(
      FutureCompletionDateError,
    );
  });

  it('copia la fecha para que no se pueda mutar desde fuera', () => {
    const fecha = new Date('2026-09-14T11:00:00.000Z');
    const resultado = ActivityResult.create(datos({ completedAt: fecha }), AHORA);

    fecha.setFullYear(1990);

    expect(resultado.completedAt.getFullYear()).toBe(2026);
  });

  it('reconoce a su dueno', () => {
    const resultado = ActivityResult.create(datos(), AHORA);

    expect(resultado.perteneceA(new UserId(USUARIO_A))).toBe(true);
    expect(resultado.perteneceA(new UserId(USUARIO_B))).toBe(false);
  });

  it('sugiere acompanamiento cuando el puntaje lo indica', () => {
    const bajo = ActivityResult.create(datos({ score: OrientativeScore.create(1, 10) }), AHORA);
    const alto = ActivityResult.create(datos({ score: OrientativeScore.create(9, 10) }), AHORA);

    expect(bajo.sugiereAcompanamiento()).toBe(true);
    expect(alto.sugiereAcompanamiento()).toBe(false);
  });
});
