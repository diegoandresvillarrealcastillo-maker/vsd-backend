import { beforeEach, describe, expect, it } from 'vitest';
import {
  FutureCompletionDateError,
  InvalidIdentifierError,
  ScoreOutOfRangeError,
  SessionNotOfActivityError,
} from '../../domain/model/DomainError.js';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import type { Categoria } from '../../domain/model/Categoria.js';
import {
  ActivityId,
  ClientOperationId,
  ResultId,
  SesionId,
  UserId,
} from '../../domain/model/Identifier.js';
import { Revision, SesionDeActividad } from '../../domain/model/SesionDeActividad.js';
import { Cobertura, RecursoApoyo, TipoDeRecurso } from '../../domain/model/RecursoApoyo.js';
import type { RegistrarResultadoCommand } from '../../domain/ports/in/RegisterActivityResultUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { FilaDelHistorial } from '../../domain/model/HistorialDelModulo.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
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

  save(result: ActivityResult): Promise<ActivityResult> {
    // Como la base: si la operacion de esa persona ya estaba, gana la que estaba.
    const clave = `${result.userId.value}/${result.clientOperationId.value}`;
    const ganadora = this.porOperacion.get(clave);

    if (ganadora !== undefined) {
      return Promise.resolve(ganadora);
    }

    this.porOperacion.set(clave, result);

    return Promise.resolve(result);
  }

  ultimosDe(userId: UserId, desde: Date): Promise<readonly ActivityResult[]> {
    return Promise.resolve(
      [...this.porOperacion.values()].filter(
        (resultado) => resultado.perteneceA(userId) && resultado.completedAt >= desde,
      ),
    );
  }

  async *paginasDeResultados(userId: UserId, desde: Date) {
    yield await this.ultimosDe(userId, desde);
  }

  hayActividadDesde(userId: UserId, desde: Date): Promise<boolean> {
    return Promise.resolve(
      [...this.porOperacion.values()].some(
        (resultado) => resultado.perteneceA(userId) && resultado.completedAt >= desde,
      ),
    );
  }

  historialDe(): Promise<readonly FilaDelHistorial[]> {
    // El historial por modulo (SCRUM-184) no se ejercita aqui.
    return Promise.resolve([]);
  }

  diasConActividad(userId: UserId): Promise<readonly string[]> {
    return Promise.resolve(
      [
        ...new Set(
          [...this.porOperacion.values()]
            .filter((resultado) => resultado.perteneceA(userId))
            .map((resultado) => resultado.dia),
        ),
      ].sort(),
    );
  }

  diasConAtencion(): Promise<readonly string[]> {
    // El acompanamiento por dias seguidos (SCRUM-177) no se ejercita aqui.
    return Promise.resolve([]);
  }

  hechosDe(): Promise<readonly { actividad: string; dia: string }[]> {
    // El progreso (SCRUM-264) tampoco.
    return Promise.resolve([]);
  }

  get cantidad(): number {
    return this.porOperacion.size;
  }
}

/**
 * Un repositorio donde dos peticiones de la misma operacion **miran antes de que ninguna escriba**:
 * la ventana de la carrera. Cada consulta espera a que haya llegado la segunda.
 */
class RepositorioConCarrera extends RepositorioFalso {
  private llegadas = 0;

  private abrir: () => void = () => undefined;

  private readonly compuerta = new Promise<void>((resolver) => {
    this.abrir = resolver;
  });

  override async findByClientOperationId(
    clientOperationId: ClientOperationId,
    userId: UserId,
  ): Promise<ActivityResult | null> {
    const encontrado = await super.findByClientOperationId(clientOperationId, userId);

    this.llegadas++;

    if (this.llegadas === 2) {
      this.abrir();
    }

    await this.compuerta;

    return encontrado;
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

/**
 * Doble de las sesiones: solo `porId`, que es lo unico que usa registrar un resultado. Lo demas
 * lanza, para que si algun dia empezara a usarse la prueba falle en vez de pasar con datos inventados.
 */
class SesionesFalsas implements SesionesRepositoryPort {
  /** Cuantas veces se pregunto por una sesion. */
  consultas = 0;

  private readonly sesiones = new Map<string, SesionDeActividad>();

  agregar(sesion: SesionDeActividad): void {
    this.sesiones.set(sesion.id.value, sesion);
  }

  porId(id: SesionId): Promise<SesionDeActividad | null> {
    this.consultas++;

    return Promise.resolve(this.sesiones.get(id.value) ?? null);
  }

  mecanicasConSesion(): Promise<ReadonlySet<string>> {
    return Promise.reject(new Error('No se usa al registrar un resultado.'));
  }

  sesionesDeHoy(): Promise<ReadonlyMap<string, SesionDeActividad>> {
    return Promise.reject(new Error('No se usa al registrar un resultado.'));
  }

  titulosDe(): Promise<ReadonlyMap<string, string>> {
    return Promise.reject(new Error('No se usa al registrar un resultado.'));
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
  let sesiones: SesionesFalsas;
  let casoDeUso: RegisterActivityResultUseCaseImpl;

  /** Lo registrado, para las pruebas que no miran las lineas de atencion. */
  async function registrar(orden: RegistrarResultadoCommand): Promise<ActivityResult> {
    return (await casoDeUso.execute(orden)).resultado;
  }

  /** Un identificador de operacion valido y distinto por cada numero. */
  function operacion(n: number): string {
    return `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
  }

  /**
   * Un resultado que requiere atencion por cada dia, a las 11:00 UTC (las 6:00 en Bogota).
   * `desde` aparta los identificadores de operacion de los de la orden y de otras siembras.
   */
  async function sembrar(
    dias: readonly string[],
    desde = 100,
    usuario: string = USUARIO_A,
  ): Promise<void> {
    for (const [indice, dia] of dias.entries()) {
      await registrar(
        comando({
          userId: usuario,
          clientOperationId: operacion(desde + indice),
          completedAt: new Date(`${dia}T11:00:00.000Z`),
          score: 1,
        }),
      );
    }
  }

  /** Los `previos` dias anteriores a hoy (el 14), cada uno con un resultado que requiere atencion. */
  async function semanaDificil(previos = 3, usuario: string = USUARIO_A): Promise<void> {
    await sembrar(['2026-09-13', '2026-09-12', '2026-09-11'].slice(0, previos), 100, usuario);
  }

  beforeEach(() => {
    repositorio = new RepositorioFalso();
    recursos = new RecursosFalsos();
    sesiones = new SesionesFalsas();
    casoDeUso = new RegisterActivityResultUseCaseImpl(
      repositorio,
      new CatalogoFalso([actividad(), bitacora()]),
      recursos,
      sesiones,
      () => new ResultId(RESULTADO),
      () => AHORA,
    );
  });

  describe('las lineas de atencion (SCRUM-94)', () => {
    it('no acompanan a un resultado que no lo sugiere', async () => {
      const { lineasDeAtencion } = await casoDeUso.execute(comando({ score: 8 }));

      expect(lineasDeAtencion).toEqual([]);
    });

    it('acompanan a un resultado que requiere atencion cuando hay un patron de la semana, ordenadas por alcance', async () => {
      await semanaDificil();

      const registro = await casoDeUso.execute(comando({ score: 1 }));

      expect(registro.sugiereAcompanamiento).toBe(true);
      expect(registro.lineasDeAtencion.map((linea) => linea.id)).toEqual([
        'linea-192',
        'linea-106',
      ]);
    });

    it('acompanan a lo escrito con una senal de riesgo, aunque la actividad no puntue', async () => {
      const { resultado, lineasDeAtencion, sugiereAcompanamiento } = await casoDeUso.execute(
        comando({
          activityId: SIN_PUNTAJE,
          score: undefined,
          metadata: { texto: 'Hoy nada, ya no puedo más con esto' },
        }),
      );

      expect(resultado.tienePuntaje()).toBe(false);
      expect(sugiereAcompanamiento).toBe(true);
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
        await semanaDificil();

        await casoDeUso.execute(comando({ score: 1, zonaHoraria }));

        expect(recursos.paises).toEqual([pais]);
      },
    );

    it('una zona sin pais con lineas verificadas las pide sin pais, y nunca como Colombia', async () => {
      await semanaDificil();

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

  describe('el patron de la semana: 4 de 7 dias (SCRUM-200)', () => {
    it('un solo resultado que requiere atencion se registra, pero no acompana ni trae lineas', async () => {
      const registro = await casoDeUso.execute(comando({ score: 1 }));

      expect(registro.resultado.score?.level).toBe('requiere_atencion');
      expect(registro.sugiereAcompanamiento).toBe(false);
      expect(registro.lineasDeAtencion).toEqual([]);
      // Ni siquiera se piden: sin acompanamiento no hay consulta de lineas.
      expect(recursos.paises).toEqual([]);
    });

    it.each([0, 1, 2])(
      '%i dias con atencion antes de hoy y hoy: no llegan a 4 de 7',
      async (previos) => {
        await semanaDificil(previos);

        const registro = await casoDeUso.execute(comando({ score: 1 }));

        expect(registro.sugiereAcompanamiento).toBe(false);
        expect(registro.lineasDeAtencion).toEqual([]);
      },
    );

    it('3 dias previos con atencion y hoy otro: son 4 de 7 y acompana', async () => {
      await semanaDificil(3);

      const registro = await casoDeUso.execute(comando({ score: 1 }));

      expect(registro.sugiereAcompanamiento).toBe(true);
      expect(registro.lineasDeAtencion).toHaveLength(2);
    });

    it('un buen resultado de hoy no trae lineas aunque la semana haya sido dificil', async () => {
      await semanaDificil(5);

      const registro = await casoDeUso.execute(comando({ score: 9 }));

      expect(registro.resultado.score?.level).toBe('favorable');
      expect(registro.sugiereAcompanamiento).toBe(false);
      expect(registro.lineasDeAtencion).toEqual([]);
    });

    it('varios resultados que requieren atencion el mismo dia cuentan como un dia', async () => {
      // Tres resultados el dia 13 y ninguno mas: son 2 dias con hoy, no 4.
      for (const n of [1, 2, 3]) {
        await registrar(
          comando({
            clientOperationId: operacion(n),
            completedAt: new Date(`2026-09-13T1${String(n)}:00:00.000Z`),
            score: 1,
          }),
        );
      }

      const registro = await casoDeUso.execute(comando({ score: 1 }));

      expect(registro.sugiereAcompanamiento).toBe(false);
    });

    it('lo de hace 7 dias o mas ya no cuenta: la ventana son los 7 dias que terminan hoy', async () => {
      // Hoy es el 14. El 8 es hoy menos 6 (cuenta); el 7 es hoy menos 7 (no cuenta).
      await sembrar(['2026-09-13', '2026-09-12', '2026-09-07']);

      const registro = await casoDeUso.execute(comando({ score: 1 }));

      expect(registro.sugiereAcompanamiento).toBe(false);

      await sembrar(['2026-09-08'], 10);

      const otroRegistro = await casoDeUso.execute(
        comando({ clientOperationId: operacion(99), score: 1 }),
      );

      expect(otroRegistro.sugiereAcompanamiento).toBe(true);
    });

    it('lo de otra persona no cuenta', async () => {
      await semanaDificil(3, USUARIO_B);

      const registro = await casoDeUso.execute(comando({ score: 1 }));

      expect(registro.sugiereAcompanamiento).toBe(false);
    });

    it('lo escrito con una senal de riesgo no espera a ninguna semana', async () => {
      const registro = await casoDeUso.execute(
        comando({
          activityId: SIN_PUNTAJE,
          score: undefined,
          metadata: { texto: 'quiero morirme' },
        }),
      );

      expect(registro.sugiereAcompanamiento).toBe(true);
      expect(registro.lineasDeAtencion).toHaveLength(2);
    });

    it('una actividad que no puntua no es un dia con atencion ni dispara el patron', async () => {
      await semanaDificil(3);

      const registro = await casoDeUso.execute(
        comando({ activityId: SIN_PUNTAJE, score: undefined, metadata: { texto: 'hoy caminé' } }),
      );

      expect(registro.sugiereAcompanamiento).toBe(false);
    });

    it('un reintento ve lo mismo aunque despues se hayan registrado mas dias', async () => {
      // Un resultado hecho el 10: la semana que le toca es del 4 al 10.
      await sembrar(['2026-09-09', '2026-09-08']);
      const orden = comando({ completedAt: new Date('2026-09-10T11:00:00.000Z'), score: 1 });

      const primero = await casoDeUso.execute(orden);

      // Tres dias dificiles que llegan despues, todos posteriores al de la orden. Medido contra
      // hoy (el 14) serian 4 de 7 y cambiarian lo que ve quien reintenta.
      await sembrar(['2026-09-11', '2026-09-12', '2026-09-13'], 30);
      const reintento = await casoDeUso.execute(orden);

      expect(primero.sugiereAcompanamiento).toBe(false);
      expect(reintento.sugiereAcompanamiento).toBe(false);
    });

    it('un resultado hecho sin conexion se mide contra su propio dia, no contra hoy', async () => {
      // Hecho el 10 y recibido el 14: la semana que importa es la del 4 al 10.
      await sembrar(['2026-09-09', '2026-09-08', '2026-09-07']);

      const registro = await casoDeUso.execute(
        comando({
          clientOperationId: operacion(77),
          completedAt: new Date('2026-09-10T11:00:00.000Z'),
          score: 1,
        }),
      );

      expect(registro.sugiereAcompanamiento).toBe(true);
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

  it('dos reintentos simultaneos reciben el mismo resultado: el segundo ni falla ni duplica (SCRUM-258)', async () => {
    // Los dos miran, no ven nada, y los dos intentan guardar. Gana uno; el otro tiene que recibir
    // lo que guardo el ganador, no su propio resultado ni un error.
    const carrera = new RepositorioConCarrera();
    let generados = 0;
    const simultaneo = new RegisterActivityResultUseCaseImpl(
      carrera,
      new CatalogoFalso([actividad(), bitacora()]),
      recursos,
      sesiones,
      () => new ResultId(`77777777-7777-4777-8777-${String(++generados).padStart(12, '0')}`),
      () => AHORA,
    );

    const [uno, otro] = await Promise.all([
      simultaneo.execute(comando()),
      simultaneo.execute(comando()),
    ]);

    expect(otro.resultado.id.value).toBe(uno.resultado.id.value);
    expect(carrera.cantidad).toBe(1);
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
  describe('la sesion que se hizo (ADR 0030)', () => {
    const SESION = '77777777-7777-4777-a777-777777777777';
    const DE_OTRA_ACTIVIDAD = '88888888-8888-4888-a888-888888888888';
    const RETIRADA = '99999999-9999-4999-a999-999999999999';

    function sesionDe(id: string, actividadId: string, publicado = true): SesionDeActividad {
      return SesionDeActividad.create({
        id: new SesionId(id),
        idActividad: new ActivityId(actividadId),
        titulo: 'Una sesión',
        nivel: 1,
        parametros: {},
        publicado,
        revision: Revision.NO_REQUIERE,
      });
    }

    beforeEach(() => {
      sesiones.agregar(sesionDe(SESION, ACTIVIDAD));
      sesiones.agregar(sesionDe(DE_OTRA_ACTIVIDAD, SIN_PUNTAJE));
      sesiones.agregar(sesionDe(RETIRADA, ACTIVIDAD, false));
    });

    it('sin sesion es lo de siempre: asi se registran las nueve actividades actuales', async () => {
      const resultado = await registrar(comando());

      expect(resultado.sessionId).toBeUndefined();
      expect(sesiones.consultas).toBe(0);
    });

    it('guarda la sesion que se hizo', async () => {
      const resultado = await registrar(comando({ sessionId: SESION }));

      expect(resultado.sessionId?.value).toBe(SESION);
    });

    it('una sesion de otra actividad se rechaza y no se guarda nada', async () => {
      await expect(registrar(comando({ sessionId: DE_OTRA_ACTIVIDAD }))).rejects.toThrow(
        SessionNotOfActivityError,
      );
      expect(repositorio.cantidad).toBe(0);
    });

    it('una sesion que no existe se rechaza igual: quien llama no necesita saber cual de las dos cosas pasa', async () => {
      await expect(
        registrar(comando({ sessionId: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa' })),
      ).rejects.toThrow(SessionNotOfActivityError);
      expect(repositorio.cantidad).toBe(0);
    });

    it('una sesion retirada despues de servirse se acepta: quien la tenia abierta puede terminarla', async () => {
      const resultado = await registrar(comando({ sessionId: RETIRADA }));

      expect(resultado.sessionId?.value).toBe(RETIRADA);
    });

    it('un identificador de sesion mal formado es un identificador invalido', async () => {
      await expect(registrar(comando({ sessionId: 'no-es-un-uuid' }))).rejects.toThrow(
        InvalidIdentifierError,
      );
      expect(repositorio.cantidad).toBe(0);
    });

    it('un reintento devuelve lo ya registrado sin volver a mirar la sesion', async () => {
      const primero = await registrar(comando({ sessionId: SESION }));
      const consultasAntes = sesiones.consultas;

      // Mismo clientOperationId: es la misma operacion, aunque llegue con otra sesion.
      const reintento = await registrar(comando({ sessionId: DE_OTRA_ACTIVIDAD }));

      expect(reintento).toBe(primero);
      expect(sesiones.consultas).toBe(consultasAntes);
      expect(repositorio.cantidad).toBe(1);
    });
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
        sesiones,
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
