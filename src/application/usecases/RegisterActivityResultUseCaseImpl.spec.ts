import { beforeEach, describe, expect, it } from 'vitest';
import {
  InvalidIdentifierError,
  OperationBelongsToAnotherUserError,
  ScoreOutOfRangeError,
} from '../../domain/model/DomainError';
import type { ActivityResult } from '../../domain/model/ActivityResult';
import { ClientOperationId, ResultId } from '../../domain/model/Identifier';
import type { RegistrarResultadoCommand } from '../../domain/ports/in/RegisterActivityResultUseCase';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort';
import { RegisterActivityResultUseCaseImpl } from './RegisterActivityResultUseCaseImpl';

/**
 * Doble del puerto de salida.
 *
 * La prueba del caso de uso no importa nada de infrastructure/: usa un doble
 * que implementa el puerto. Eso es justo lo que demuestra la arquitectura,
 * que la logica se puede ejercitar sin base de datos y sin adaptadores.
 *
 * El adaptador real se prueba aparte, en su propia capa.
 */
class RepositorioFalso implements ActivityResultRepositoryPort {
  private readonly porOperacion = new Map<string, ActivityResult>();

  findByClientOperationId(clientOperationId: ClientOperationId): Promise<ActivityResult | null> {
    return Promise.resolve(this.porOperacion.get(clientOperationId.value) ?? null);
  }

  save(result: ActivityResult): Promise<void> {
    this.porOperacion.set(result.clientOperationId.value, result);

    return Promise.resolve();
  }

  get cantidad(): number {
    return this.porOperacion.size;
  }
}

const USUARIO_A = '11111111-1111-4111-8111-111111111111';
const USUARIO_B = '22222222-2222-4222-9222-222222222222';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';
const OPERACION = '44444444-4444-4444-b444-444444444444';
const RESULTADO = '55555555-5555-4555-8555-555555555555';

const AHORA = new Date('2026-09-14T12:00:00.000Z');

function comando(sobrescribir: Partial<RegistrarResultadoCommand> = {}): RegistrarResultadoCommand {
  return {
    userId: USUARIO_A,
    activityId: ACTIVIDAD,
    clientOperationId: OPERACION,
    score: 8,
    maxScore: 10,
    completedAt: new Date('2026-09-14T11:00:00.000Z'),
    ...sobrescribir,
  };
}

describe('RegisterActivityResultUseCaseImpl', () => {
  let repositorio: RepositorioFalso;
  let casoDeUso: RegisterActivityResultUseCaseImpl;

  beforeEach(() => {
    repositorio = new RepositorioFalso();
    casoDeUso = new RegisterActivityResultUseCaseImpl(
      repositorio,
      () => new ResultId(RESULTADO),
      () => AHORA,
    );
  });

  it('registra un resultado nuevo', async () => {
    const resultado = await casoDeUso.execute(comando());

    expect(resultado.id.value).toBe(RESULTADO);
    expect(resultado.userId.value).toBe(USUARIO_A);
    expect(repositorio.cantidad).toBe(1);
  });

  it('es idempotente: reintentar la misma operacion no duplica', async () => {
    // Es la regla que hace segura la sincronizacion. Si la red se cae
    // despues de que el servidor guardo pero antes de que el dispositivo
    // reciba la confirmacion, el reintento no debe crear un segundo
    // resultado en el historial del usuario.
    const primero = await casoDeUso.execute(comando());
    const segundo = await casoDeUso.execute(comando());

    expect(repositorio.cantidad).toBe(1);
    expect(segundo.id.value).toBe(primero.id.value);
  });

  it('devuelve el resultado ya registrado aunque cambien los demas datos', async () => {
    await casoDeUso.execute(comando({ score: 8 }));
    const reintento = await casoDeUso.execute(comando({ score: 2 }));

    // La operacion ya ocurrio: manda lo que se registro, no lo que llega
    // despues con el mismo identificador.
    expect(reintento.score.value).toBe(8);
    expect(repositorio.cantidad).toBe(1);
  });

  it('rechaza una operacion que pertenece a otro usuario', async () => {
    // Control de seguridad, no solo de integridad: conocer un identificador
    // de operacion ajeno no puede servir para escribir sobre datos de otra
    // persona.
    await casoDeUso.execute(comando({ userId: USUARIO_A }));

    await expect(casoDeUso.execute(comando({ userId: USUARIO_B }))).rejects.toThrow(
      OperationBelongsToAnotherUserError,
    );
  });

  it('no revela en el mensaje de error que la operacion existe', async () => {
    await casoDeUso.execute(comando({ userId: USUARIO_A }));

    await expect(casoDeUso.execute(comando({ userId: USUARIO_B }))).rejects.toThrow(
      /no esta disponible/,
    );
  });

  it('no guarda nada cuando la operacion es de otro usuario', async () => {
    await casoDeUso.execute(comando({ userId: USUARIO_A }));

    await expect(casoDeUso.execute(comando({ userId: USUARIO_B }))).rejects.toThrow();
    expect(repositorio.cantidad).toBe(1);
  });

  it.each([
    ['usuario', { userId: 'no-es-un-uuid' }],
    ['actividad', { activityId: 'no-es-un-uuid' }],
    ['operacion del cliente', { clientOperationId: 'no-es-un-uuid' }],
  ])('rechaza un identificador de %s mal formado', async (_caso, sobrescribir) => {
    await expect(casoDeUso.execute(comando(sobrescribir))).rejects.toThrow(InvalidIdentifierError);
    expect(repositorio.cantidad).toBe(0);
  });

  it('rechaza un puntaje fuera de rango sin guardar nada', async () => {
    await expect(casoDeUso.execute(comando({ score: 99 }))).rejects.toThrow(ScoreOutOfRangeError);
    expect(repositorio.cantidad).toBe(0);
  });

  it('valida antes de consultar el repositorio', async () => {
    // Si algo viene mal formado, debe fallar en la frontera y no despues de
    // haber tocado la persistencia.
    await expect(casoDeUso.execute(comando({ userId: 'roto' }))).rejects.toThrow();
    expect(repositorio.cantidad).toBe(0);
  });
});
