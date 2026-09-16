// Vitest no lee `.env` por su cuenta y estas pruebas necesitan saber si hay
// una base local a la que conectarse.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { OrientativeScore } from '../../domain/model/OrientativeScore.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaActivityRepository } from './PrismaActivityRepository.js';
import { PrismaActivityResultRepository } from './PrismaActivityResultRepository.js';

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
const CLAVE_LOCAL = 'clave_de_pruebas_locales';

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
    await dueno.query(`ALTER ROLE vsd_app WITH LOGIN PASSWORD '${CLAVE_LOCAL}'`);

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
  beforeEach(async () => {
    await dueno.query('DELETE FROM resultado');
  });

  async function limpiarTodo(): Promise<void> {
    await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
    await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
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
      completedAt: new Date('2026-09-14T11:00:00.000Z'),
      metadata: opciones.metadata,
    });
  }

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
    expect(recuperado?.sugiereAcompanamiento()).toBe(false);
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
    expect(recuperado?.sugiereAcompanamiento()).toBe(true);
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
});
