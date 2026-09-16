import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidIdentifierError, ScoreOutOfRangeError } from '../../domain/model/DomainError.js';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import type { RegistrarResultadoCommand } from '../../domain/ports/in/RegisterActivityResultUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import { RegisterActivityResultUseCaseImpl } from './RegisterActivityResultUseCaseImpl.js';

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
  // La clave lleva a la persona delante, igual que el indice UNIQUE de la
  // base y que el adaptador en memoria. Un doble que se comportara distinto
  // haria pasar pruebas sobre un sistema que no existe.
  private readonly porOperacion = new Map<string, ActivityResult>();

  findByClientOperationId(
    clientOperationId: ClientOperationId,
    userId: UserId,
  ): Promise<ActivityResult | null> {
    return Promise.resolve(
      this.porOperacion.get(`${userId.value}/${clientOperationId.value}`) ?? null,
    );
  }

  save(result: ActivityResult): Promise<void> {
    this.porOperacion.set(`${result.userId.value}/${result.clientOperationId.value}`, result);

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
const OTRA_OPERACION = '55555555-5555-4555-b555-555555555555';
const RESULTADO = '55555555-5555-4555-8555-555555555555';

const AHORA = new Date('2026-09-14T12:00:00.000Z');

/**
 * La actividad que interpreta el puntaje. Antes el maximo viajaba en el
 * comando, lo cual permitia que quien reportara eligiera su propia escala.
 */
/**
 * Doble del catalogo. No se usa el adaptador real de `infrastructure/`
 * porque la capa de aplicacion no puede depender de esa capa, ni siquiera
 * en pruebas: la regla de fronteras lo impide, y con razon.
 */
class CatalogoFalso implements ActivityRepositoryPort {
  constructor(private readonly actividades: readonly Activity[]) {}

  findById(id: ActivityId): Promise<Activity | null> {
    return Promise.resolve(this.actividades.find((a) => a.id.value === id.value) ?? null);
  }
}

function actividad(): Activity {
  return Activity.create({
    id: new ActivityId(ACTIVIDAD),
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

function comando(sobrescribir: Partial<RegistrarResultadoCommand> = {}): RegistrarResultadoCommand {
  return {
    userId: USUARIO_A,
    activityId: ACTIVIDAD,
    clientOperationId: OPERACION,
    score: 8,
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
      new CatalogoFalso([actividad()]),
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
    expect(reintento.score?.value).toBe(80);
    expect(repositorio.cantidad).toBe(1);
  });

  it('no toca el resultado de otra persona aunque se use su identificador de operacion', async () => {
    await casoDeUso.execute(comando({ userId: USUARIO_A, score: 8 }));

    const ajeno = await casoDeUso.execute(comando({ userId: USUARIO_B, score: 2 }));

    // Son dos resultados distintos, cada uno de su dueno. Lo de A sigue
    // exactamente como estaba: ni se sobrescribio ni se devolvio a B.
    // No se compara el identificador: el generador esta fijado a proposito
    // para que otras pruebas puedan afirmar sobre el. Lo que demuestra que son
    // dos resultados distintos es que hay dos guardados y que el de A conserva
    // su puntaje.
    expect(ajeno.userId.value).toBe(USUARIO_B);
    expect(ajeno.score?.value).toBe(20);
    expect(repositorio.cantidad).toBe(2);

    const deA = await repositorio.findByClientOperationId(
      new ClientOperationId(OPERACION),
      new UserId(USUARIO_A),
    );

    expect(deA?.score?.value).toBe(80);
  });

  it('no responde distinto ante una operacion ajena que ante una inexistente', async () => {
    // Es el motivo entero del ADR 0010. Si usar el identificador de otra
    // persona diera un error y usar uno inventado diera un resultado, esa sola
    // diferencia permitiria ir probando identificadores hasta averiguar
    // cuales existen, sin llegar a ver ni un dato.
    await casoDeUso.execute(comando({ userId: USUARIO_A }));

    const conOperacionAjena = await casoDeUso.execute(comando({ userId: USUARIO_B }));
    const conOperacionNueva = await casoDeUso.execute(
      comando({ userId: USUARIO_B, clientOperationId: OTRA_OPERACION }),
    );

    expect(conOperacionAjena.userId.value).toBe(conOperacionNueva.userId.value);
    expect(conOperacionAjena.score?.value).toBe(conOperacionNueva.score?.value);
  });

  it('la idempotencia sigue valiendo dentro de la misma persona', async () => {
    const primero = await casoDeUso.execute(comando({ userId: USUARIO_B }));
    const reintento = await casoDeUso.execute(comando({ userId: USUARIO_B }));

    expect(reintento.id.value).toBe(primero.id.value);
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
