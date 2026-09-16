import { beforeEach, describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { OrientativeScore } from '../../domain/model/OrientativeScore.js';
import { construirActivityResultService } from '../config/ApplicationConfig.js';
import { InMemoryActivityResultRepository } from './InMemoryActivityResultRepository.js';

const USUARIO = '11111111-1111-4111-8111-111111111111';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';
const OPERACION = '44444444-4444-4444-b444-444444444444';
const OTRA_OPERACION = '66666666-6666-4666-8666-666666666666';
const RESULTADO = '55555555-5555-4555-8555-555555555555';

/** Actividad de referencia: de 0 a 10, donde mas puntaje es mejor. */
function actividad(): Activity {
  return Activity.create({
    id: new ActivityId(ACTIVIDAD),
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

function unResultado(operacion = OPERACION): ActivityResult {
  return ActivityResult.create({
    id: new ResultId(RESULTADO),
    userId: new UserId(USUARIO),
    activityId: new ActivityId(ACTIVIDAD),
    clientOperationId: new ClientOperationId(operacion),
    score: OrientativeScore.create(8, actividad()),
    completedAt: new Date('2026-09-14T11:00:00.000Z'),
  });
}

describe('InMemoryActivityResultRepository', () => {
  let repositorio: InMemoryActivityResultRepository;

  beforeEach(() => {
    repositorio = new InMemoryActivityResultRepository();
  });

  it('guarda un resultado y lo recupera por su operacion', async () => {
    await repositorio.save(unResultado());

    const encontrado = await repositorio.findByClientOperationId(new ClientOperationId(OPERACION));

    expect(encontrado?.clientOperationId.value).toBe(OPERACION);
  });

  it('devuelve null cuando la operacion no existe', async () => {
    const encontrado = await repositorio.findByClientOperationId(
      new ClientOperationId(OTRA_OPERACION),
    );

    expect(encontrado).toBeNull();
  });

  it('empieza vacio', () => {
    expect(repositorio.cantidad).toBe(0);
  });
});

describe('Cableado completo', () => {
  // Esta es la unica prueba que junta las tres capas. Vive en
  // infrastructure/ porque es la unica capa autorizada a conocerlas todas.
  it('el servicio registra un resultado usando el adaptador real', async () => {
    const servicio = construirActivityResultService();

    const resultado = await servicio.registrar({
      userId: USUARIO,
      activityId: ACTIVIDAD,
      clientOperationId: OPERACION,
      score: 8,
      completedAt: new Date('2026-09-14T11:00:00.000Z'),
    });

    expect(resultado.userId.value).toBe(USUARIO);
    expect(resultado.score.level).toBe('favorable');
  });

  it('el mismo caso de uso sigue siendo idempotente contra el adaptador real', async () => {
    const servicio = construirActivityResultService();
    const comando = {
      userId: USUARIO,
      activityId: ACTIVIDAD,
      clientOperationId: OPERACION,
      score: 8,
      completedAt: new Date('2026-09-14T11:00:00.000Z'),
    };

    const primero = await servicio.registrar(comando);
    const segundo = await servicio.registrar(comando);

    expect(segundo.id.value).toBe(primero.id.value);
  });
});
