import { describe, expect, it } from 'vitest';
import { ActivityResult, type DatosDeResultado } from './ActivityResult.js';
import { FutureCompletionDateError, ReservedMetadataKeyError } from './DomainError.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from './Identifier.js';
import { OrientativeScore } from './OrientativeScore.js';

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

describe('ActivityResult sin puntaje', () => {
  // Una bitacora de sueno o un registro de animo producen datos, no una
  // calificacion. El diccionario de datos lo dice desde el entregable
  // inicial: el puntaje aplica "cuando aplique".

  it('es valido un resultado que no produjo puntaje', () => {
    const resultado = ActivityResult.create(datos({ score: undefined }), AHORA);

    expect(resultado.tienePuntaje()).toBe(false);
    expect(resultado.score).toBeUndefined();
  });

  it('conserva el resto de los datos aunque no haya puntaje', () => {
    const resultado = ActivityResult.create(datos({ score: undefined }), AHORA);

    expect(resultado.userId.value).toBe(USUARIO_A);
    expect(resultado.activityId.value).toBe(ACTIVIDAD);
    expect(resultado.clientOperationId.value).toBe(OPERACION);
    expect(resultado.completedAt.toISOString()).toBe('2026-09-14T11:00:00.000Z');
  });

  it('sigue rechazando una fecha futura aunque no haya puntaje', () => {
    const futuro = new Date(AHORA.getTime() + 1000);

    expect(() =>
      ActivityResult.create(datos({ score: undefined, completedAt: futuro }), AHORA),
    ).toThrow(FutureCompletionDateError);
  });

  it('no sugiere acompanamiento por si solo', () => {
    // Una sola noche mala no dispara nada. Un registro cobra sentido en la
    // tendencia, no en una anotacion suelta.
    const resultado = ActivityResult.create(datos({ score: undefined }), AHORA);

    expect(resultado.sugiereAcompanamiento()).toBe(false);
  });
});

describe('ActivityResult y su metadata', () => {
  it('guarda la informacion propia del tipo de actividad', () => {
    const resultado = ActivityResult.create(
      datos({
        score: undefined,
        metadata: { horasDormidas: 6.5, despertares: 2, comoAmanecio: 'cansado' },
      }),
      AHORA,
    );

    expect(resultado.metadata).toEqual({
      horasDormidas: 6.5,
      despertares: 2,
      comoAmanecio: 'cansado',
    });
  });

  it('deja metadata vacia cuando no se envia', () => {
    const resultado = ActivityResult.create(datos(), AHORA);

    expect(resultado.metadata).toEqual({});
  });

  it('admite estructuras anidadas', () => {
    const resultado = ActivityResult.create(
      datos({ metadata: { respuestas: [{ pregunta: 1, opcion: 'b' }] } }),
      AHORA,
    );

    expect(resultado.metadata['respuestas']).toEqual([{ pregunta: 1, opcion: 'b' }]);
  });

  it('rechaza una clave que ya es un campo propio', () => {
    // Dos verdades sobre el mismo dato terminan divergiendo. Ver ADR 0008.
    expect(() => ActivityResult.create(datos({ metadata: { puntaje: 99 } }), AHORA)).toThrow(
      ReservedMetadataKeyError,
    );
  });

  it('rechaza tambien la clave escrita como en el dominio', () => {
    expect(() => ActivityResult.create(datos({ metadata: { userId: 'otro' } }), AHORA)).toThrow(
      ReservedMetadataKeyError,
    );
  });

  it('no se puede modificar despues de construido', () => {
    const resultado = ActivityResult.create(datos({ metadata: { nota: 'algo' } }), AHORA);

    expect(Object.isFrozen(resultado.metadata)).toBe(true);
  });
});
