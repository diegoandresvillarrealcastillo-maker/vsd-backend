import { beforeEach, describe, expect, it } from 'vitest';
import {
  FutureCompletionDateError,
  InvalidIdentifierError,
  ScoreOutOfRangeError,
} from '../../domain/model/DomainError.js';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import type { Categoria } from '../../domain/model/Categoria.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { Cobertura, RecursoApoyo, TipoDeRecurso } from '../../domain/model/RecursoApoyo.js';
import type { RegistrarResultadoCommand } from '../../domain/ports/in/RegisterActivityResultUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
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

  ultimosDe(userId: UserId, desde: Date): Promise<readonly ActivityResult[]> {
    return Promise.resolve(
      [...this.porOperacion.values()].filter(
        (resultado) => resultado.perteneceA(userId) && resultado.completedAt >= desde,
      ),
    );
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

  /**
   * Este caso de uso no lista nada, pero el doble tiene que implementar el
   * puerto entero. Devolver una lista vacia lo deja explicito: si algun dia
   * empezara a usarlo, la prueba fallaria en vez de pasar con datos
   * inventados.
   */
  listarCatalogo(): Promise<readonly Categoria[]> {
    return Promise.resolve([]);
  }
}

/**
 * Doble de la base de conocimiento: dos lineas, la de Bogota primero, para
 * comprobar que salen ordenadas por alcance.
 */
class RecursosFalsos implements RecursoApoyoRepositoryPort {
  /** El pais con el que se pidieron las lineas, en el orden en que se pidieron. */
  paises: (string | undefined)[] = [];

  lineasDeAtencion(pais: string | undefined): Promise<readonly RecursoApoyo[]> {
    this.paises.push(pais);

    return Promise.resolve([
      RecursoApoyo.create({
        id: 'linea-106',
        titulo: 'Línea 106',
        tipo: TipoDeRecurso.CONTACTO,
        cobertura: Cobertura.BOGOTA,
        fuente: 'https://pruebas.test/106',
        verificadoEl: '2026-10-06',
      }),
      RecursoApoyo.create({
        id: 'linea-192',
        titulo: 'Línea 192, opción 4',
        tipo: TipoDeRecurso.CONTACTO,
        cobertura: Cobertura.NACIONAL,
        fuente: 'https://pruebas.test/192',
        verificadoEl: '2026-10-06',
      }),
    ]);
  }

  porTema(): Promise<readonly RecursoApoyo[]> {
    return Promise.resolve([]);
  }
}

const SIN_PUNTAJE = '66666666-6666-4666-8666-666666666666';

function actividad(): Activity {
  return Activity.create({
    id: new ActivityId(ACTIVIDAD),
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

/** Como "Un momento bueno del dia": registra texto y no puntua. */
function bitacora(): Activity {
  return Activity.create({
    id: new ActivityId(SIN_PUNTAJE),
    nombre: 'Un momento bueno del día',
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
  });
}

function comando(sobrescribir: Partial<RegistrarResultadoCommand> = {}): RegistrarResultadoCommand {
  return {
    userId: USUARIO_A,
    activityId: ACTIVIDAD,
    clientOperationId: OPERACION,
    score: 8,
    completedAt: new Date('2026-09-14T11:00:00.000Z'),
    zonaHoraria: 'America/Bogota',
    ...sobrescribir,
  };
}

describe('RegisterActivityResultUseCaseImpl', () => {
  let repositorio: RepositorioFalso;
  let recursos: RecursosFalsos;
  let casoDeUso: RegisterActivityResultUseCaseImpl;

  /** Lo registrado, para las pruebas que no miran las lineas de atencion. */
  async function registrar(orden: RegistrarResultadoCommand): Promise<ActivityResult> {
    return (await casoDeUso.execute(orden)).resultado;
  }

  beforeEach(() => {
    repositorio = new RepositorioFalso();
    recursos = new RecursosFalsos();
    casoDeUso = new RegisterActivityResultUseCaseImpl(
      repositorio,
      new CatalogoFalso([actividad(), bitacora()]),
      recursos,
      () => new ResultId(RESULTADO),
      () => AHORA,
    );
  });

  describe('las lineas de atencion (SCRUM-94)', () => {
    it('no acompanan a un resultado que no lo sugiere', async () => {
      const { lineasDeAtencion } = await casoDeUso.execute(comando({ score: 8 }));

      expect(lineasDeAtencion).toEqual([]);
    });

    it('acompanan a un resultado cuyo nivel requiere atencion, ordenadas por alcance', async () => {
      const { resultado, lineasDeAtencion } = await casoDeUso.execute(comando({ score: 1 }));

      expect(resultado.sugiereAcompanamiento()).toBe(true);
      expect(lineasDeAtencion.map((linea) => linea.id)).toEqual(['linea-192', 'linea-106']);
    });

    it('acompanan a lo escrito con una senal de riesgo, aunque la actividad no puntue', async () => {
      const { resultado, lineasDeAtencion } = await casoDeUso.execute(
        comando({
          activityId: SIN_PUNTAJE,
          score: undefined,
          metadata: { texto: 'Hoy nada, ya no puedo más con esto' },
        }),
      );

      expect(resultado.tienePuntaje()).toBe(false);
      expect(lineasDeAtencion).toHaveLength(2);
    });

    it.each([
      ['America/Bogota', 'CO'],
      ['America/Mexico_City', 'MX'],
      ['Europe/Madrid', 'ES'],
      ['America/New_York', 'US'],
    ])(
      'se piden con el pais de la zona de la cuenta: %s es %s (SCRUM-124)',
      async (zonaHoraria, pais) => {
        await casoDeUso.execute(comando({ score: 1, zonaHoraria }));

        expect(recursos.paises).toEqual([pais]);
      },
    );

    it('una zona sin pais con lineas verificadas las pide sin pais, y nunca como Colombia', async () => {
      // Lima comparte hora con Bogota. Pedirlas como Colombia le daria el 192.
      await casoDeUso.execute(comando({ score: 1, zonaHoraria: 'America/Lima' }));

      expect(recursos.paises).toEqual([undefined]);
    });

    it('un resultado que no sugiere acompanamiento no pide ninguna linea', async () => {
      await casoDeUso.execute(comando({ score: 8, zonaHoraria: 'Europe/Madrid' }));

      expect(recursos.paises).toEqual([]);
    });

    it('un reintento vuelve a traerlas: quien repite ve lo mismo que la primera vez', async () => {
      const orden = comando({
        activityId: SIN_PUNTAJE,
        score: undefined,
        metadata: { texto: 'quiero morirme' },
      });

      await casoDeUso.execute(orden);
      const { lineasDeAtencion } = await casoDeUso.execute(orden);

      expect(repositorio.cantidad).toBe(1);
      expect(lineasDeAtencion).toHaveLength(2);
    });
  });

  it('registra un resultado nuevo', async () => {
    const resultado = await registrar(comando());

    expect(resultado.id.value).toBe(RESULTADO);
    expect(resultado.userId.value).toBe(USUARIO_A);
    expect(repositorio.cantidad).toBe(1);
  });

  it('es idempotente: reintentar la misma operacion no duplica', async () => {
    // Es la regla que hace segura la sincronizacion. Si la red se cae
    // despues de que el servidor guardo pero antes de que el dispositivo
    // reciba la confirmacion, el reintento no debe crear un segundo
    // resultado en el historial del usuario.
    const primero = await registrar(comando());
    const segundo = await registrar(comando());

    expect(repositorio.cantidad).toBe(1);
    expect(segundo.id.value).toBe(primero.id.value);
  });

  it('devuelve el resultado ya registrado aunque cambien los demas datos', async () => {
    await registrar(comando({ score: 8 }));
    const reintento = await registrar(comando({ score: 2 }));

    // La operacion ya ocurrio: manda lo que se registro, no lo que llega
    // despues con el mismo identificador.
    expect(reintento.score?.value).toBe(80);
    expect(repositorio.cantidad).toBe(1);
  });

  it('no toca el resultado de otra persona aunque se use su identificador de operacion', async () => {
    await registrar(comando({ userId: USUARIO_A, score: 8 }));

    const ajeno = await registrar(comando({ userId: USUARIO_B, score: 2 }));

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
    await registrar(comando({ userId: USUARIO_A }));

    const conOperacionAjena = await registrar(comando({ userId: USUARIO_B }));
    const conOperacionNueva = await registrar(
      comando({ userId: USUARIO_B, clientOperationId: OTRA_OPERACION }),
    );

    expect(conOperacionAjena.userId.value).toBe(conOperacionNueva.userId.value);
    expect(conOperacionAjena.score?.value).toBe(conOperacionNueva.score?.value);
  });

  it('la idempotencia sigue valiendo dentro de la misma persona', async () => {
    const primero = await registrar(comando({ userId: USUARIO_B }));
    const reintento = await registrar(comando({ userId: USUARIO_B }));

    expect(reintento.id.value).toBe(primero.id.value);
    expect(repositorio.cantidad).toBe(1);
  });

  it.each([
    ['usuario', { userId: 'no-es-un-uuid' }],
    ['actividad', { activityId: 'no-es-un-uuid' }],
    ['operacion del cliente', { clientOperationId: 'no-es-un-uuid' }],
  ])('rechaza un identificador de %s mal formado', async (_caso, sobrescribir) => {
    await expect(registrar(comando(sobrescribir))).rejects.toThrow(InvalidIdentifierError);
    expect(repositorio.cantidad).toBe(0);
  });

  it('rechaza un puntaje fuera de rango sin guardar nada', async () => {
    await expect(registrar(comando({ score: 99 }))).rejects.toThrow(ScoreOutOfRangeError);
    expect(repositorio.cantidad).toBe(0);
  });

  it('valida antes de consultar el repositorio', async () => {
    // Si algo viene mal formado, debe fallar en la frontera y no despues de
    // haber tocado la persistencia.
    await expect(registrar(comando({ userId: 'roto' }))).rejects.toThrow();
    expect(repositorio.cantidad).toBe(0);
  });
  describe('el reloj del dispositivo (SCRUM-133)', () => {
    // Sin conexion, el resultado viaja despues con la hora del reloj del
    // dispositivo. Ese reloj puede ir unos minutos adelantado y eso no puede
    // dejar el resultado rechazado para siempre.
    const MINUTO = 60 * 1000;

    it('un resultado hecho sin conexion hace horas se registra con su hora, no con la de ahora', async () => {
      const haceTresHoras = new Date(AHORA.getTime() - 3 * 60 * MINUTO);

      const resultado = await registrar(comando({ completedAt: haceTresHoras }));

      expect(resultado.completedAt.toISOString()).toBe(haceTresHoras.toISOString());
    });

    it('un reloj adelantado unos minutos se registra como ahora', async () => {
      const resultado = await registrar(
        comando({ completedAt: new Date(AHORA.getTime() + 4 * MINUTO) }),
      );

      expect(resultado.completedAt.toISOString()).toBe(AHORA.toISOString());
    });

    it('acepta justo en el limite de la tolerancia y rechaza un milisegundo despues', async () => {
      const enElLimite = await registrar(
        comando({ completedAt: new Date(AHORA.getTime() + 5 * MINUTO) }),
      );

      expect(enElLimite.completedAt.toISOString()).toBe(AHORA.toISOString());

      await expect(
        registrar(
          comando({
            clientOperationId: OTRA_OPERACION,
            completedAt: new Date(AHORA.getTime() + 5 * MINUTO + 1),
          }),
        ),
      ).rejects.toThrow(FutureCompletionDateError);
      expect(repositorio.cantidad).toBe(1);
    });

    it('un dia en el futuro se sigue rechazando y no guarda nada', async () => {
      await expect(
        registrar(comando({ completedAt: new Date(AHORA.getTime() + 24 * 60 * MINUTO) })),
      ).rejects.toThrow(FutureCompletionDateError);
      expect(repositorio.cantidad).toBe(0);
    });

    it('con el reloj adelantado pasada la medianoche, el resultado no cae en el dia siguiente', async () => {
      // 23:58 del 14 en Bogota (UTC-5) es 04:58 del 15 en UTC. El dispositivo,
      // adelantado, dice 00:01 del 15 en Bogota.
      const alFinalDelDia = new RegisterActivityResultUseCaseImpl(
        repositorio,
        new CatalogoFalso([actividad(), bitacora()]),
        recursos,
        () => new ResultId(RESULTADO),
        () => new Date('2026-09-15T04:58:00.000Z'),
      );

      const { resultado } = await alFinalDelDia.execute(
        comando({ completedAt: new Date('2026-09-15T05:01:00.000Z') }),
      );

      expect(resultado.dia).toBe('2026-09-14');
      expect(resultado.completedAt.toISOString()).toBe('2026-09-15T04:58:00.000Z');
    });

    it('un reintento con la misma operacion sigue devolviendo lo ya registrado', async () => {
      const primero = await registrar(
        comando({ completedAt: new Date(AHORA.getTime() + 3 * MINUTO) }),
      );
      const reintento = await registrar(
        comando({ completedAt: new Date(AHORA.getTime() + 3 * MINUTO) }),
      );

      expect(reintento.id.value).toBe(primero.id.value);
      expect(repositorio.cantidad).toBe(1);
    });
  });
});
