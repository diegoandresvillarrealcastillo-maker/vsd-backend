import { beforeEach, describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { OrientativeScore } from '../../domain/model/OrientativeScore.js';
import { construirActivityResultService } from '../config/ApplicationConfig.js';
import { InMemoryActivityResultRepository } from './InMemoryActivityResultRepository.js';

const USUARIO = '11111111-1111-4111-8111-111111111111';
const OTRO_USUARIO = '22222222-2222-4222-9222-222222222222';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';
const OPERACION = '44444444-4444-4444-b444-444444444444';
const OTRA_OPERACION = '66666666-6666-4666-8666-666666666666';
const RESULTADO = '55555555-5555-4555-8555-555555555555';
const OTRO_RESULTADO = '77777777-7777-4777-8777-777777777777';

/** Actividad de referencia: de 0 a 10, donde mas puntaje es mejor. */
function actividad(): Activity {
  return Activity.create({
    id: new ActivityId(ACTIVIDAD),
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

function unResultado(
  operacion = OPERACION,
  usuario = USUARIO,
  resultado = RESULTADO,
): ActivityResult {
  return ActivityResult.create({
    id: new ResultId(resultado),
    userId: new UserId(usuario),
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

    const encontrado = await repositorio.findByClientOperationId(
      new ClientOperationId(OPERACION),
      new UserId(USUARIO),
    );

    expect(encontrado?.clientOperationId.value).toBe(OPERACION);
  });

  it('devuelve null cuando la operacion no existe', async () => {
    const encontrado = await repositorio.findByClientOperationId(
      new ClientOperationId(OTRA_OPERACION),
      new UserId(USUARIO),
    );

    expect(encontrado).toBeNull();
  });

  it('no encuentra la operacion de una persona preguntando como otra', async () => {
    // Es la misma operacion, con el identificador exacto. Lo que cambia es
    // quien pregunta, y con eso basta para que no exista.
    await repositorio.save(unResultado());

    const encontrado = await repositorio.findByClientOperationId(
      new ClientOperationId(OPERACION),
      new UserId(OTRO_USUARIO),
    );

    expect(encontrado).toBeNull();
  });

  it('deja convivir la misma operacion en dos personas distintas', async () => {
    await repositorio.save(unResultado());
    await repositorio.save(unResultado(OPERACION, OTRO_USUARIO, OTRO_RESULTADO));

    expect(repositorio.cantidad).toBe(2);
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
    expect(resultado.score?.level).toBe('favorable');
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
