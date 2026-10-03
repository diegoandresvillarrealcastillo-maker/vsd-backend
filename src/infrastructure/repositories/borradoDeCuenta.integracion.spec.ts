import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { UserId } from '../../domain/model/Identifier.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaDiarioRepository } from './PrismaDiarioRepository.js';
import { PrismaUserRepository } from './PrismaUserRepository.js';

/**
 * La prueba que define SCRUM-75: borrar una cuenta y comprobar **contra la
 * base directamente** que no queda rastro.
 *
 * No se fia de una lista de tablas escrita a mano. Pregunta a PostgreSQL por
 * cada tabla que tenga una columna `id_usuario` y cuenta las filas de esa
 * persona en todas. Si manana aparece una tabla nueva sin `ON DELETE CASCADE`,
 * esta prueba falla sin que nadie tenga que acordarse de anadirla.
 *
 * Los identificadores son propios de esta suite. Las suites de integracion
 * comparten base y corren en paralelo, y reutilizar los de otra hace que se
 * borren filas entre ellas.
 */

const URL_DUENO = process.env['DATABASE_URL'];

const PERSONA = '75757575-7575-4575-8575-757575757575';
const OTRA = '75757575-7575-4575-8575-757575757576';
const ENTRADA = '75757575-7575-4575-8575-757575757577';
// Categoria y actividad propias: otras suites borran resultados por actividad,
// y compartir una del catalogo hacia que se llevaran los de esta.
const CATEGORIA = '75757575-7575-4575-8575-757575757578';
const ACTIVIDAD = '75757575-7575-4575-8575-757575757579';

/** La categoria y la actividad de esta suite, declarandose administrador como haria la aplicacion. */
async function sembrarCatalogo(dueno: Client): Promise<void> {
  await dueno.query('BEGIN');
  await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', true)");
  await dueno.query(
    `INSERT INTO categoria (id_categoria, nombre) VALUES ($1, 'Pruebas de borrado de cuenta')
     ON CONFLICT DO NOTHING`,
    [CATEGORIA],
  );
  await dueno.query(
    `INSERT INTO actividad (id_actividad, id_categoria, nombre, tipo, direccion_escala, puntaje_maximo)
     VALUES ($1, $2, 'Actividad de prueba de borrado', 'cuestionario', 'mayor_es_mejor', 10)
     ON CONFLICT DO NOTHING`,
    [ACTIVIDAD, CATEGORIA],
  );
  await dueno.query('COMMIT');
}

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

/** Cuantas filas de esa persona hay, tabla por tabla. */
async function rastroDe(dueno: Client, persona: string): Promise<Record<string, number>> {
  const { rows: tablas } = await dueno.query<{ tabla: string }>(
    `SELECT table_name AS tabla
       FROM information_schema.columns
      WHERE table_schema = 'public' AND column_name = 'id_usuario'
      ORDER BY table_name`,
  );

  const rastro: Record<string, number> = {};

  for (const { tabla } of tablas) {
    const { rows } = await dueno.query<{ n: string }>(
      `SELECT count(*) AS n FROM "${tabla}" WHERE id_usuario = $1`,
      [persona],
    );

    rastro[tabla] = Number(rows[0]?.n ?? 0);
  }

  return rastro;
}

/** Una cuenta con un resultado y una entrada de diario, como dejaria la aplicacion. */
async function sembrar(dueno: Client, persona: string, correo: string): Promise<void> {
  // Los identificadores van explicitos: el `uuid()` de Prisma lo genera el
  // cliente, no la base, y aqui no hay cliente de Prisma.
  const entrada = persona === PERSONA ? ENTRADA : globalThis.crypto.randomUUID();

  await dueno.query('BEGIN');

  try {
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
    await dueno.query(
      `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, $2, $3, '1.0', now())`,
      [persona, correo, `proveedor-borrado-${persona}`],
    );
    await dueno.query(
      `INSERT INTO resultado (id_resultado, id_usuario, id_actividad, id_operacion_cliente, nivel_orientativo, fecha)
       VALUES ($1, $2, $3, $4, 'favorable', now())`,
      [globalThis.crypto.randomUUID(), persona, ACTIVIDAD, globalThis.crypto.randomUUID()],
    );
    await dueno.query(
      `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente, fecha_creacion, fecha_edicion)
       VALUES ($1, $2, 'Lo que escribi hoy', $3, now(), now())`,
      [entrada, persona, globalThis.crypto.randomUUID()],
    );
    await dueno.query('COMMIT');
  } catch (error) {
    await dueno.query('ROLLBACK');
    throw error;
  }
}

async function limpiar(dueno: Client): Promise<void> {
  const nuestras = [PERSONA, OTRA];

  await dueno.query('DELETE FROM entrada_diario WHERE id_usuario = ANY($1)', [nuestras]);
  await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [nuestras]);
  await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [nuestras]);
}

describe.skipIf(URL_DUENO === undefined)('Borrar una cuenta en PostgreSQL', () => {
  let dueno: Client;
  let prisma: PrismaService;
  let cuentas: PrismaUserRepository;
  let diario: PrismaDiarioRepository;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);
    await sembrarCatalogo(dueno);

    prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
    await prisma.onModuleInit();

    cuentas = new PrismaUserRepository(prisma);
    diario = new PrismaDiarioRepository(prisma);
  });

  beforeEach(async () => {
    await limpiar(dueno);
    await sembrar(dueno, PERSONA, 'borrado-a@borrado-de-cuenta.test');
    await sembrar(dueno, OTRA, 'borrado-b@borrado-de-cuenta.test');
  });

  afterAll(async () => {
    await limpiar(dueno);
    await dueno.query('DELETE FROM actividad WHERE id_actividad = $1', [ACTIVIDAD]);
    await dueno.query('DELETE FROM categoria WHERE id_categoria = $1', [CATEGORIA]);
    await prisma.onModuleDestroy();
    await dueno.end();
  });

  it('antes de borrar, la persona tiene filas en varias tablas', async () => {
    // Sin esto, la prueba siguiente pasaria tambien si la siembra no hiciera
    // nada.
    const rastro = await rastroDe(dueno, PERSONA);

    expect(rastro['usuario']).toBe(1);
    expect(rastro['resultado']).toBe(1);
    expect(rastro['entrada_diario']).toBe(1);
  });

  it('despues de borrar no queda ninguna fila suya en ninguna tabla', async () => {
    await cuentas.borrarConTodo(new UserId(PERSONA), () => Promise.resolve());

    const rastro = await rastroDe(dueno, PERSONA);

    expect(Object.values(rastro).every((filas) => filas === 0)).toBe(true);
    expect(Object.keys(rastro)).toEqual(
      expect.arrayContaining(['usuario', 'resultado', 'entrada_diario']),
    );
  });

  it('lo de la otra persona sigue entero', async () => {
    await cuentas.borrarConTodo(new UserId(PERSONA), () => Promise.resolve());

    const rastro = await rastroDe(dueno, OTRA);

    expect(rastro).toMatchObject({ usuario: 1, resultado: 1, entrada_diario: 1 });
  });

  it('si lo de fuera falla, PostgreSQL deshace el borrado entero', async () => {
    await expect(
      cuentas.borrarConTodo(new UserId(PERSONA), () =>
        Promise.reject(new Error('Supabase no respondio')),
      ),
    ).rejects.toThrow('Supabase no respondio');

    expect(await rastroDe(dueno, PERSONA)).toMatchObject({
      usuario: 1,
      resultado: 1,
      entrada_diario: 1,
    });
  });

  it('el diario se lee en nombre de la persona y solo trae lo suyo', async () => {
    const entradas = await diario.todasDe(new UserId(PERSONA));

    expect(entradas).toHaveLength(1);
    expect(entradas[0]).toMatchObject({ id: ENTRADA, contenido: 'Lo que escribi hoy' });
  });
});
