// Vitest no lee `.env` por su cuenta y estas pruebas necesitan saber si hay
// una base local a la que conectarse.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import {
  ActivityId,
  ClientOperationId,
  ResultId,
  SesionId,
  UserId,
} from '../../domain/model/Identifier.js';
import { OrientativeScore } from '../../domain/model/OrientativeScore.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaActivityRepository } from './PrismaActivityRepository.js';
import { PrismaActivityResultRepository } from './PrismaActivityResultRepository.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';

/**
 * El adaptador de Prisma contra PostgreSQL de verdad.
 *
 * ## Por que hace falta si ya hay pruebas
 *
 * Las de dominio y aplicacion corren contra el adaptador en memoria, que es un
 * `Map`. Un `Map` no tiene restricciones UNIQUE, ni tipos, ni decimales con
 * precision fija, ni politicas de acceso. Puede comportarse distinto que la
 * base y esconder el error en lugar de mostrarlo. Se anoto como riesgo en el
 * Ciclo 2, cuando se escribio ese adaptador; esto lo salda.
 *
 * La conexion se hace con `vsd_app`, el mismo rol que usa el servicio, no con
 * el dueno de las tablas. Asi lo que se prueba es el camino real: si una
 * politica de aislamiento estorbara a una operacion legitima, se ve aqui y no
 * en produccion.
 *
 * Las comprobaciones de aislamiento a nivel de SQL, saltandose la aplicacion,
 * viven en `persistence/aislamiento.spec.ts`. Aqui se comprueba que el
 * adaptador funciona **dentro** de esas politicas.
 */
const URL_DUENO = process.env['DATABASE_URL'];

// Donde estas pruebas son obligatorias no se permite saltarlas. Una prueba de
// seguridad que se ignora sola es peor que no tenerla: el trabajo sale en verde
// sin haber comprobado nada, y nadie mira el detalle de una suite que paso.
//
// La marca es una variable propia y no `CI`, porque en el CI hay otro trabajo
// que corre la suite entera sin base de datos a proposito. Ahi saltarselas es
// justo lo correcto.
if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const USUARIO_A = '10000000-0000-4000-8000-000000000001';
const USUARIO_B = '10000000-0000-4000-8000-000000000002';
const CATEGORIA = '20000000-0000-4000-8000-000000000001';
const ACTIVIDAD_MEMORIA = '30000000-0000-4000-8000-000000000001';
const ACTIVIDAD_CARGA = '30000000-0000-4000-8000-000000000002';
const ACTIVIDAD_BITACORA = '30000000-0000-4000-8000-000000000003';
const SESION = '60000000-0000-4000-8000-000000000001';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

describe.skipIf(URL_DUENO === undefined)('PrismaActivityResultRepository contra PostgreSQL', () => {
  let dueno: Client;
  let prisma: PrismaService;
  let repositorio: PrismaActivityResultRepository;
  let catalogo: PrismaActivityRepository;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);

    await limpiarTodo();
    await sembrar();

    prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
    await prisma.onModuleInit();

    catalogo = new PrismaActivityRepository(prisma);
    repositorio = new PrismaActivityResultRepository(prisma, catalogo);
  });

  afterAll(async () => {
    await prisma?.onModuleDestroy();
    await limpiarTodo();
    await dueno?.end();
  });

  // Ninguna prueba depende de lo que dejo la anterior. Las que se apoyan en el
  // orden fallan de forma intermitente, y una prueba intermitente termina
  // ignorada por todo el mundo.
  //
  // Solo los resultados de esta suite: las suites de integracion comparten la
  // base y corren en paralelo, y un DELETE sin filtro se llevaba los de las
  // demas a mitad de sus pruebas.
  beforeEach(async () => {
    await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
  });

  async function limpiarTodo(): Promise<void> {
    await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
    await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
    await dueno.query('DELETE FROM sesion_de_actividad WHERE id_sesion = $1', [SESION]);
    await dueno.query('DELETE FROM actividad WHERE id_categoria = $1', [CATEGORIA]);
    await dueno.query('DELETE FROM categoria WHERE id_categoria = $1', [CATEGORIA]);
  }

  async function sembrar(): Promise<void> {
    await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");
    await dueno.query(`INSERT INTO categoria (id_categoria, nombre) VALUES ($1, 'Integracion')`, [
      CATEGORIA,
    ]);

    // Tres actividades que cubren las tres direcciones de escala. Los nombres
    // son los del catalogo real para que la prueba se lea como el sistema.
    for (const [id, nombre, direccion, maximo] of [
      [ACTIVIDAD_MEMORIA, 'Secuencias', 'mayor_es_mejor', 10],
      [ACTIVIDAD_CARGA, 'Tu semana en una hoja', 'mayor_requiere_atencion', 27],
      [ACTIVIDAD_BITACORA, 'Bitacora de sueno', 'sin_puntaje', null],
    ]) {
      await dueno.query(
        `INSERT INTO actividad (id_actividad, id_categoria, nombre, tipo, direccion_escala, puntaje_maximo)
         VALUES ($1, $2, $3, 'cuestionario', $4, $5)`,
        [id, CATEGORIA, nombre, direccion, maximo],
      );
    }

    // Una sesion de la memoria, para los resultados que dicen cual hicieron (ADR 0030).
    await dueno.query(
      `INSERT INTO sesion_de_actividad (id_sesion, id_actividad, titulo, nivel, parametros, publicado, revision)
       VALUES ($1, $2, 'Una sesión de prueba', 1, '{}', true, 'no_requiere')`,
      [SESION, ACTIVIDAD_MEMORIA],
    );

    for (const usuario of [USUARIO_A, USUARIO_B]) {
      await dueno.query("SELECT set_config('vsd.usuario_actual', $1, false)", [usuario]);
      await dueno.query(
        `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
         VALUES ($1, $2, $3, '1.0', now())`,
        [usuario, `${usuario}@ejemplo.test`, `proveedor-de-prueba-${usuario}`],
      );
    }

    await dueno.query("SELECT set_config('vsd.usuario_actual', '', false)");
    await dueno.query("SELECT set_config('vsd.rol_actual', '', false)");
  }

  /** Construye un resultado listo para guardar. */
  async function unResultado(opciones: {
    id: string;
    usuario: string;
    actividad: string;
    operacion: string;
    puntajeCrudo?: number;
    metadata?: Record<string, string | number | boolean>;
    completedAt?: Date;
    dia?: string;
    sesion?: string;
  }): Promise<ActivityResult> {
    const actividad = await catalogo.findById(new ActivityId(opciones.actividad));

    if (actividad === null) {
      throw new Error('La actividad de prueba no esta en el catalogo.');
    }

    return ActivityResult.create({
      id: new ResultId(opciones.id),
      userId: new UserId(opciones.usuario),
      activityId: new ActivityId(opciones.actividad),
      clientOperationId: new ClientOperationId(opciones.operacion),
      score:
        opciones.puntajeCrudo === undefined
          ? undefined
          : OrientativeScore.create(opciones.puntajeCrudo, actividad),
      completedAt: opciones.completedAt ?? new Date('2026-09-14T11:00:00.000Z'),
      dia: opciones.dia ?? '2026-09-14',
      metadata: opciones.metadata,
      sessionId: opciones.sesion === undefined ? undefined : new SesionId(opciones.sesion),
    });
  }

  describe('la sesion que se hizo (SCRUM-205, ADR 0030)', () => {
    it('guarda la sesion y la devuelve al recuperar el resultado', async () => {
      await repositorio.save(
        await unResultado({
          id: '40000000-0000-4000-8000-000000000051',
          usuario: USUARIO_A,
          actividad: ACTIVIDAD_MEMORIA,
          operacion: '50000000-0000-4000-8000-000000000051',
          puntajeCrudo: 8,
          sesion: SESION,
        }),
      );

      const recuperado = await repositorio.findByClientOperationId(
        new ClientOperationId('50000000-0000-4000-8000-000000000051'),
        new UserId(USUARIO_A),
      );
      const enLaLista = await repositorio.ultimosDe(new UserId(USUARIO_A), new Date(0));

      expect(recuperado?.sessionId?.value).toBe(SESION);
      expect(enLaLista.map((resultado) => resultado.sessionId?.value)).toEqual([SESION]);
    });

    it('sin sesion queda sin sesion: asi son todos los resultados de hoy', async () => {
      await repositorio.save(
        await unResultado({
          id: '40000000-0000-4000-8000-000000000052',
          usuario: USUARIO_A,
          actividad: ACTIVIDAD_MEMORIA,
          operacion: '50000000-0000-4000-8000-000000000052',
          puntajeCrudo: 8,
        }),
      );

      const recuperado = await repositorio.findByClientOperationId(
        new ClientOperationId('50000000-0000-4000-8000-000000000052'),
        new UserId(USUARIO_A),
      );

      expect(recuperado?.sessionId).toBeUndefined();
    });

    it('la base no deja guardar una sesion que no existe', async () => {
      await expect(
        repositorio.save(
          await unResultado({
            id: '40000000-0000-4000-8000-000000000053',
            usuario: USUARIO_A,
            actividad: ACTIVIDAD_MEMORIA,
            operacion: '50000000-0000-4000-8000-000000000053',
            puntajeCrudo: 8,
            sesion: '60000000-0000-4000-8000-0000000000ff',
          }),
        ),
      ).rejects.toThrow();
    });
  });

  it('guarda y recupera un resultado completo, con puntaje y con metadata', async () => {
    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-000000000001',
        usuario: USUARIO_A,
        actividad: ACTIVIDAD_MEMORIA,
        operacion: '50000000-0000-4000-8000-000000000001',
        puntajeCrudo: 8,
        metadata: { aciertos: 8, intentos: 10, duracionSegundos: 94 },
      }),
    );

    const recuperado = await repositorio.findByClientOperationId(
      new ClientOperationId('50000000-0000-4000-8000-000000000001'),
      new UserId(USUARIO_A),
    );

    expect(recuperado?.score?.value).toBe(80);
    expect(recuperado?.score?.level).toBe('favorable');
    expect(recuperado?.metadata).toMatchObject({ aciertos: 8, intentos: 10 });
  });

  // Una partida a medias escala lo logrado al maximo y casi nunca da un entero (SCRUM-240): lo que llega a la
  // base, ya normalizado de 0 a 100, tiene que caber en la columna (dos decimales) y volver con el mismo nivel.
  it.each([
    { crudo: 3.75, guardado: 37.5, id: 'a1' },
    { crudo: 5.33, guardado: 53.3, id: 'a2' },
    { crudo: 0.5, guardado: 5, id: 'a3' },
  ])(
    'un puntaje crudo con decimales ($crudo) se guarda como $guardado y vuelve con su nivel',
    async ({ crudo, guardado, id }) => {
      const resultado = await unResultado({
        id: `40000000-0000-4000-8000-0000000000${id}`,
        usuario: USUARIO_A,
        actividad: ACTIVIDAD_MEMORIA,
        operacion: `50000000-0000-4000-8000-0000000000${id}`,
        puntajeCrudo: crudo,
      });

      await repositorio.save(resultado);

      const { rows } = await dueno.query<{ puntaje: string }>(
        'SELECT puntaje FROM resultado WHERE id_resultado = $1',
        [resultado.id.value],
      );
      const recuperado = await repositorio.findByClientOperationId(
        resultado.clientOperationId,
        new UserId(USUARIO_A),
      );

      expect(Number(rows[0]?.puntaje)).toBeCloseTo(guardado, 2);
      expect(recuperado?.score?.level).toBe(resultado.score?.level);
      expect(recuperado?.score?.value).toBeCloseTo(guardado, 2);
    },
  );

  it('el dia queda guardado como se registro, no se recalcula al leer (SCRUM-123)', async () => {
    // El mismo instante, 9 p. m. del 14 en Bogota y 4 a. m. del 15 en Madrid,
    // registrado por dos personas que estaban en sitios distintos.
    const instante = new Date('2026-09-15T02:00:00.000Z');

    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-0000000000d1',
        usuario: USUARIO_A,
        actividad: ACTIVIDAD_MEMORIA,
        operacion: '50000000-0000-4000-8000-0000000000d1',
        completedAt: instante,
        dia: '2026-09-14',
      }),
    );
    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-0000000000d2',
        usuario: USUARIO_B,
        actividad: ACTIVIDAD_MEMORIA,
        operacion: '50000000-0000-4000-8000-0000000000d2',
        completedAt: instante,
        dia: '2026-09-15',
      }),
    );

    const enBogota = await repositorio.findByClientOperationId(
      new ClientOperationId('50000000-0000-4000-8000-0000000000d1'),
      new UserId(USUARIO_A),
    );
    const enMadrid = await repositorio.findByClientOperationId(
      new ClientOperationId('50000000-0000-4000-8000-0000000000d2'),
      new UserId(USUARIO_B),
    );

    expect(enBogota?.dia).toBe('2026-09-14');
    expect(enMadrid?.dia).toBe('2026-09-15');
  });

  it('guarda un resultado sin puntaje', async () => {
    // Una bitacora de sueno produce datos, no una calificacion. La columna de
    // puntaje queda en nulo y la de nivel tambien: no se inventa un cero, que
    // ademas se leeria como lo peor posible.
    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-000000000002',
        usuario: USUARIO_A,
        actividad: ACTIVIDAD_BITACORA,
        operacion: '50000000-0000-4000-8000-000000000002',
        metadata: { horas: 6.5, despertares: 2 },
      }),
    );

    const { rows } = await dueno.query<{
      puntaje: string | null;
      nivel_orientativo: string | null;
    }>('SELECT puntaje, nivel_orientativo FROM resultado WHERE id_resultado = $1', [
      '40000000-0000-4000-8000-000000000002',
    ]);

    expect(rows[0]).toMatchObject({ puntaje: null, nivel_orientativo: null });

    const recuperado = await repositorio.findByClientOperationId(
      new ClientOperationId('50000000-0000-4000-8000-000000000002'),
      new UserId(USUARIO_A),
    );

    expect(recuperado?.score).toBeUndefined();
    expect(recuperado?.sugiereAcompanamientoPorSiSolo()).toBe(false);
  });

  it('la base rechaza el duplicado, no la aplicacion', async () => {
    // El caso de uso ya evita llegar hasta aqui: consulta antes de escribir.
    // Esta prueba se salta esa proteccion a proposito, porque lo que
    // comprueba es la de abajo. Si el codigo fallara, si hubiera una carrera
    // entre dos peticiones simultaneas, el duplicado sigue sin entrar.
    const datos = {
      usuario: USUARIO_A,
      actividad: ACTIVIDAD_MEMORIA,
      operacion: '50000000-0000-4000-8000-000000000003',
      puntajeCrudo: 5,
    };

    await repositorio.save(
      await unResultado({ ...datos, id: '40000000-0000-4000-8000-000000000003' }),
    );

    await expect(
      repositorio.save(await unResultado({ ...datos, id: '40000000-0000-4000-8000-000000000004' })),
    ).rejects.toThrow();

    const { rows } = await dueno.query<{ total: string }>(
      'SELECT count(*)::text AS total FROM resultado WHERE id_operacion_cliente = $1',
      [datos.operacion],
    );

    expect(rows[0]).toMatchObject({ total: '1' });
  });

  it('la misma operacion en dos personas distintas si convive', async () => {
    // La restriccion es por persona. Dos dispositivos que generen el mismo
    // identificador no se estorban, y ninguno se entera de la existencia del
    // otro. Ver ADR 0010.
    const operacion = '50000000-0000-4000-8000-000000000004';

    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-000000000005',
        usuario: USUARIO_A,
        actividad: ACTIVIDAD_MEMORIA,
        operacion,
        puntajeCrudo: 9,
      }),
    );

    await expect(
      repositorio.save(
        await unResultado({
          id: '40000000-0000-4000-8000-000000000006',
          usuario: USUARIO_B,
          actividad: ACTIVIDAD_MEMORIA,
          operacion,
          puntajeCrudo: 3,
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('pedir la operacion de otra persona conociendo su identificador no devuelve nada', async () => {
    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-000000000007',
        usuario: USUARIO_B,
        actividad: ACTIVIDAD_MEMORIA,
        operacion: '50000000-0000-4000-8000-000000000005',
        puntajeCrudo: 7,
      }),
    );

    const recuperado = await repositorio.findByClientOperationId(
      new ClientOperationId('50000000-0000-4000-8000-000000000005'),
      new UserId(USUARIO_A),
    );

    expect(recuperado).toBeNull();
  });

  it('el catalogo se lee con la sesion de cualquier persona', async () => {
    const actividad = await catalogo.findById(new ActivityId(ACTIVIDAD_CARGA));

    expect(actividad?.nombre).toBe('Tu semana en una hoja');
    expect(actividad?.puntua()).toBe(true);
  });

  it('un puntaje alto donde mas es peor se recupera como requiere_atencion', async () => {
    // Este es el defecto que se corrigio en SCRUM-55, comprobado de extremo a
    // extremo: guardar en PostgreSQL y volver a leer no puede perder la
    // direccion de la escala. Si se perdiera, el sistema le diria "favorable"
    // justo a quien peor esta.
    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-000000000008',
        usuario: USUARIO_A,
        actividad: ACTIVIDAD_CARGA,
        operacion: '50000000-0000-4000-8000-000000000006',
        puntajeCrudo: 24,
      }),
    );

    const recuperado = await repositorio.findByClientOperationId(
      new ClientOperationId('50000000-0000-4000-8000-000000000006'),
      new UserId(USUARIO_A),
    );

    expect(recuperado?.score?.level).toBe('requiere_atencion');
    expect(recuperado?.sugiereAcompanamientoPorSiSolo()).toBe(true);
  });

  it('el nivel se recalcula al leer, no se toma de la columna', async () => {
    // Si manana se ajustan los umbrales de una actividad, los resultados
    // viejos deben interpretarse con los vigentes en lugar de quedarse
    // diciendo algo que ya no corresponde a su puntaje.
    await repositorio.save(
      await unResultado({
        id: '40000000-0000-4000-8000-000000000009',
        usuario: USUARIO_A,
        actividad: ACTIVIDAD_MEMORIA,
        operacion: '50000000-0000-4000-8000-000000000007',
        puntajeCrudo: 9,
      }),
    );

    // Se corrompe la columna a mano: dice lo contrario de lo que toca.
    await dueno.query(
      `UPDATE resultado SET nivel_orientativo = 'requiere_atencion' WHERE id_resultado = $1`,
      ['40000000-0000-4000-8000-000000000009'],
    );

    const recuperado = await repositorio.findByClientOperationId(
      new ClientOperationId('50000000-0000-4000-8000-000000000007'),
      new UserId(USUARIO_A),
    );

    expect(recuperado?.score?.level).toBe('favorable');
  });

  describe('hayActividadDesde (SCRUM-160)', () => {
    const HECHO = new Date('2026-09-14T11:00:00.000Z');

    async function guardarUno(usuario: string, numero: number): Promise<void> {
      await repositorio.save(
        await unResultado({
          id: `40000000-0000-4000-8000-0000000000e${numero}`,
          usuario,
          actividad: ACTIVIDAD_MEMORIA,
          operacion: `50000000-0000-4000-8000-0000000000e${numero}`,
          puntajeCrudo: 8,
          completedAt: HECHO,
        }),
      );
    }

    it('dice que si cuando hay un resultado desde esa fecha, y que no si es anterior', async () => {
      await guardarUno(USUARIO_A, 1);

      await expect(repositorio.hayActividadDesde(new UserId(USUARIO_A), HECHO)).resolves.toBe(true);
      await expect(
        repositorio.hayActividadDesde(new UserId(USUARIO_A), new Date('2026-09-14T00:00:00.000Z')),
      ).resolves.toBe(true);
      await expect(
        repositorio.hayActividadDesde(new UserId(USUARIO_A), new Date(HECHO.getTime() + 1)),
      ).resolves.toBe(false);
    });

    it('lo de otra persona no cuenta: el aislamiento lo pone la base', async () => {
      await guardarUno(USUARIO_B, 2);

      await expect(repositorio.hayActividadDesde(new UserId(USUARIO_A), new Date(0))).resolves.toBe(
        false,
      );
      await expect(repositorio.hayActividadDesde(new UserId(USUARIO_B), new Date(0))).resolves.toBe(
        true,
      );
    });

    it('sin resultados, no', async () => {
      await expect(repositorio.hayActividadDesde(new UserId(USUARIO_A), new Date(0))).resolves.toBe(
        false,
      );
    });

    it('coincide con lo que dice ultimosDe', async () => {
      await guardarUno(USUARIO_A, 3);

      for (const desde of [new Date(0), HECHO, new Date(HECHO.getTime() + 1)]) {
        const lista = await repositorio.ultimosDe(new UserId(USUARIO_A), desde);

        await expect(repositorio.hayActividadDesde(new UserId(USUARIO_A), desde)).resolves.toBe(
          lista.length > 0,
        );
      }
    });
  });

  describe('diasConActividad (SCRUM-186)', () => {
    async function guardarEnElDia(
      usuario: string,
      numero: number,
      dia: string,
      completedAt: Date,
    ): Promise<void> {
      await repositorio.save(
        await unResultado({
          id: `40000000-0000-4000-8000-0000000000f${numero}`,
          usuario,
          actividad: ACTIVIDAD_MEMORIA,
          operacion: `50000000-0000-4000-8000-0000000000f${numero}`,
          puntajeCrudo: 8,
          completedAt,
          dia,
        }),
      );
    }

    it('devuelve los dias sin repetir y del mas antiguo al mas reciente', async () => {
      await guardarEnElDia(USUARIO_A, 1, '2026-09-16', new Date('2026-09-16T15:00:00.000Z'));
      await guardarEnElDia(USUARIO_A, 2, '2026-09-14', new Date('2026-09-14T15:00:00.000Z'));
      // Dos resultados el mismo dia son un solo dia.
      await guardarEnElDia(USUARIO_A, 3, '2026-09-16', new Date('2026-09-16T18:00:00.000Z'));

      await expect(repositorio.diasConActividad(new UserId(USUARIO_A))).resolves.toEqual([
        '2026-09-14',
        '2026-09-16',
      ]);
    });

    it('usa el dia guardado y no el instante: lo de las 8 p. m. es de ese dia', async () => {
      // 01:00 UTC del 15 es la noche del 14 en Colombia.
      await guardarEnElDia(USUARIO_A, 4, '2026-09-14', new Date('2026-09-15T01:00:00.000Z'));

      await expect(repositorio.diasConActividad(new UserId(USUARIO_A))).resolves.toEqual([
        '2026-09-14',
      ]);
    });

    it('lo de otra persona no cuenta: el aislamiento lo pone la base', async () => {
      await guardarEnElDia(USUARIO_B, 5, '2026-09-14', new Date('2026-09-14T15:00:00.000Z'));

      await expect(repositorio.diasConActividad(new UserId(USUARIO_A))).resolves.toEqual([]);
      await expect(repositorio.diasConActividad(new UserId(USUARIO_B))).resolves.toEqual([
        '2026-09-14',
      ]);
    });

    it('sin resultados, una lista vacia', async () => {
      await expect(repositorio.diasConActividad(new UserId(USUARIO_A))).resolves.toEqual([]);
    });
  });

  describe('historialDe (SCRUM-184)', () => {
    async function guardarHecho(
      n: number,
      usuario: string,
      actividad: string,
      cuando: string,
      dia = cuando.slice(0, 10),
    ): Promise<string> {
      const sufijo = String(n).padStart(12, '0');
      const id = `41000000-0000-4000-8000-${sufijo}`;

      await repositorio.save(
        await unResultado({
          id,
          usuario,
          actividad,
          operacion: `51000000-0000-4000-8000-${sufijo}`,
          completedAt: new Date(cuando),
          dia,
        }),
      );

      return id;
    }

    it('devuelve lo de esa persona y de esas actividades, del mas reciente al mas antiguo', async () => {
      await guardarHecho(1, USUARIO_A, ACTIVIDAD_BITACORA, '2026-10-01T12:00:00.000Z');
      await guardarHecho(2, USUARIO_A, ACTIVIDAD_BITACORA, '2026-10-02T12:00:00.000Z');
      await guardarHecho(3, USUARIO_A, ACTIVIDAD_MEMORIA, '2026-10-03T12:00:00.000Z');

      const filas = await repositorio.historialDe(
        new UserId(USUARIO_A),
        [new ActivityId(ACTIVIDAD_BITACORA)],
        { limite: 10 },
      );

      expect(filas.map((fila) => fila.hechaEn.toISOString())).toEqual([
        '2026-10-02T12:00:00.000Z',
        '2026-10-01T12:00:00.000Z',
      ]);
      expect(filas.every((fila) => fila.idActividad === ACTIVIDAD_BITACORA)).toBe(true);
    });

    it('lo de otra persona no aparece: el aislamiento lo pone la base', async () => {
      await guardarHecho(4, USUARIO_B, ACTIVIDAD_BITACORA, '2026-10-02T12:00:00.000Z');

      await expect(
        repositorio.historialDe(new UserId(USUARIO_A), [new ActivityId(ACTIVIDAD_BITACORA)], {
          limite: 10,
        }),
      ).resolves.toEqual([]);
    });

    it('trae el dia guardado, no el que saldria de la hora', async () => {
      await guardarHecho(
        5,
        USUARIO_A,
        ACTIVIDAD_BITACORA,
        '2026-09-15T01:00:00.000Z',
        '2026-09-14',
      );

      const [fila] = await repositorio.historialDe(
        new UserId(USUARIO_A),
        [new ActivityId(ACTIVIDAD_BITACORA)],
        { limite: 10 },
      );

      expect(fila?.dia).toBe('2026-09-14');
    });

    it('la pagina siguiente empieza justo despues del cursor, aunque dos hechos compartan la hora', async () => {
      const misma = '2026-10-02T12:00:00.000Z';

      for (let n = 10; n < 14; n += 1) {
        await guardarHecho(n, USUARIO_A, ACTIVIDAD_BITACORA, misma);
      }

      await guardarHecho(14, USUARIO_A, ACTIVIDAD_BITACORA, '2026-10-01T12:00:00.000Z');

      const vistos: string[] = [];
      let despuesDe: { hechaEn: Date; id: string } | undefined;

      for (let pagina = 0; pagina < 6; pagina += 1) {
        const filas = await repositorio.historialDe(
          new UserId(USUARIO_A),
          [new ActivityId(ACTIVIDAD_BITACORA)],
          { limite: 2, ...(despuesDe === undefined ? {} : { despuesDe }) },
        );

        if (filas.length === 0) {
          break;
        }

        vistos.push(...filas.map((fila) => fila.id));
        const ultima = filas.at(-1)!;

        despuesDe = { hechaEn: ultima.hechaEn, id: ultima.id };
      }

      expect(vistos).toHaveLength(5);
      expect(new Set(vistos).size).toBe(5);
    });

    it('sin actividades pedidas, no hay nada', async () => {
      await guardarHecho(20, USUARIO_A, ACTIVIDAD_BITACORA, '2026-10-02T12:00:00.000Z');

      await expect(
        repositorio.historialDe(new UserId(USUARIO_A), [], { limite: 10 }),
      ).resolves.toEqual([]);
    });
  });
});
