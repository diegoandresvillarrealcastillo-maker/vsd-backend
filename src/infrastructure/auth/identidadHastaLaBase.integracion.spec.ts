// Igual que las demas pruebas de integracion: vitest no lee `.env` por su
// cuenta y aqui hace falta saber si hay una base local a la que conectarse.
import 'dotenv/config';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Client } from 'pg';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SESIONES, VerificadorFalso, comoUsuario } from '../../pruebas/sesionDePrueba.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';
import { VerificadorDeIdentidad } from './VerificadorDeIdentidad.js';

/**
 * De la cabecera HTTP hasta la fila de PostgreSQL.
 *
 * ## Que prueba esto que no prueben las otras
 *
 * Hay tres piezas y cada una ya tiene su prueba: el verificador acepta o
 * rechaza tokens, el controlador usa la identidad en lugar del cuerpo, y la
 * base aisla por `vsd.usuario_actual`. Las tres pueden estar bien y el
 * conjunto estar roto, porque **nada demuestra que lo que llega a la base sea
 * lo que salio del token**.
 *
 * Es el fallo mas facil de cometer al hacer esta tarea: dejar el guardia
 * puesto, quitar el campo del cuerpo y seguir pasando a la base un
 * identificador que vino por otro camino. Todo en verde, y el aislamiento
 * decidido por el cliente.
 *
 * Asi que esto recorre el camino entero: se manda una peticion con el token de
 * una persona y se mira, conectando a PostgreSQL por fuera de la aplicacion,
 * de quien quedo la fila.
 *
 * ## Por que la aplicacion se conecta como vsd_app
 *
 * Porque el dueno de las tablas esta exento de las politicas. Conectada como
 * dueno, la aplicacion escribiria y leeria igual aunque `set_config` no se
 * llamara nunca, y esta prueba pasaria sin comprobar nada.
 */

const URL_DUENO = process.env['DATABASE_URL'];
const CLAVE_LOCAL = 'clave_de_pruebas_locales';

const A = 'token-de-A';
const B = 'token-de-B';
const PERSONA_A = SESIONES[A]?.id ?? '';
const PERSONA_B = SESIONES[B]?.id ?? '';

const CATEGORIA = 'caaaaaaa-cccc-4ccc-8ccc-cccccccccccc';
const ACTIVIDAD = 'daaaaaaa-dddd-4ddd-8ddd-dddddddddddd';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

/** Cada prueba usa su propia operacion para no chocar con las demas. */
let contador = 0;
function nuevaOperacion(): string {
  contador += 1;

  return '4a4a4a4a-4444-4444-b444-' + String(contador).padStart(12, '0');
}

function cuerpo(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    activityId: ACTIVIDAD,
    clientOperationId: nuevaOperacion(),
    score: 8,
    completedAt: '2026-09-14T11:00:00.000Z',
    ...extra,
  };
}

describe.skipIf(URL_DUENO === undefined)('La identidad del token llega hasta la base', () => {
  let dueno: Client;
  let app: NestExpressApplication;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();

    await dueno.query(`ALTER ROLE vsd_app WITH LOGIN PASSWORD '${CLAVE_LOCAL}'`);
    await limpiar();

    // Catalogo y personas, sembrados por el dueno.
    await dueno.query('BEGIN');
    await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', true)");
    await dueno.query(
      `INSERT INTO categoria (id_categoria, nombre) VALUES ($1, 'Identidad de extremo a extremo')`,
      [CATEGORIA],
    );
    await dueno.query(
      `INSERT INTO actividad (id_actividad, id_categoria, nombre, tipo, direccion_escala, puntaje_maximo)
       VALUES ($1, $2, 'Actividad de prueba', 'cuestionario', 'mayor_es_mejor', 10)`,
      [ACTIVIDAD, CATEGORIA],
    );
    await dueno.query('COMMIT');

    for (const [persona, correo] of [
      [PERSONA_A, 'a@ejemplo.test'],
      [PERSONA_B, 'b@ejemplo.test'],
    ]) {
      await dueno.query('BEGIN');
      await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
      await dueno.query(
        `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
         VALUES ($1, $2, $3, '1.0', now())`,
        [persona, correo, `proveedor-de-prueba-${persona}`],
      );
      await dueno.query('COMMIT');
    }

    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:5173';
    process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
    // La aplicacion se conecta con el rol sujeto a las politicas. Ver arriba.
    process.env.DATABASE_URL = urlDeLaAplicacion(URL_DUENO ?? '');

    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      // Se sustituye la criptografia y nada mas: el guardia, el decorador y
      // todo el camino hasta la base son los de verdad.
      .overrideProvider(VerificadorDeIdentidad)
      .useClass(VerificadorFalso)
      .compile();

    app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

    configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await limpiar();
    await dueno?.end();
  });

  async function limpiar(): Promise<void> {
    await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [[PERSONA_A, PERSONA_B]]);
    await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [[PERSONA_A, PERSONA_B]]);
    await dueno.query('DELETE FROM actividad WHERE id_actividad = $1', [ACTIVIDAD]);
    await dueno.query('DELETE FROM categoria WHERE id_categoria = $1', [CATEGORIA]);
  }

  /** De quien es la fila, preguntado por fuera de la aplicacion. */
  async function duenoDelResultado(id: string): Promise<string | undefined> {
    const { rows } = await dueno.query<{ id_usuario: string }>(
      'SELECT id_usuario FROM resultado WHERE id_resultado = $1',
      [id],
    );

    return rows[0]?.id_usuario;
  }

  function registrarComo(token: string): request.Test {
    return request(app.getHttpServer())
      .post('/api/resultados')
      .set(...comoUsuario(token));
  }

  it('la fila queda a nombre de quien traia el token', async () => {
    const respuesta = await registrarComo(A).send(cuerpo()).expect(201);

    const id = (respuesta.body as { id: string }).id;

    expect(await duenoDelResultado(id)).toBe(PERSONA_A);
  });

  it('dos personas distintas producen filas de cada cual', async () => {
    // Si la identidad se perdiera por el camino y la aplicacion usara siempre
    // la misma, esto seria lo que lo delata.
    const deA = await registrarComo(A).send(cuerpo()).expect(201);
    const deB = await registrarComo(B).send(cuerpo()).expect(201);

    expect(await duenoDelResultado((deA.body as { id: string }).id)).toBe(PERSONA_A);
    expect(await duenoDelResultado((deB.body as { id: string }).id)).toBe(PERSONA_B);
  });

  it('el mismo identificador de operacion en dos personas son dos filas', async () => {
    // La unicidad es por persona, no global. Que dos personas coincidan en el
    // identificador que genera su dispositivo no puede hacer que una vea el
    // resultado de la otra ni que se pisen. Ver ADR 0010.
    const operacion = nuevaOperacion();

    const deA = await registrarComo(A)
      .send(cuerpo({ clientOperationId: operacion }))
      .expect(201);
    const deB = await registrarComo(B)
      .send(cuerpo({ clientOperationId: operacion }))
      .expect(201);

    const idA = (deA.body as { id: string }).id;
    const idB = (deB.body as { id: string }).id;

    expect(idA).not.toBe(idB);
    expect(await duenoDelResultado(idA)).toBe(PERSONA_A);
    expect(await duenoDelResultado(idB)).toBe(PERSONA_B);
  });

  it('reintentar con el mismo token devuelve la fila ya guardada', async () => {
    const peticion = cuerpo();

    const primera = await registrarComo(A).send(peticion).expect(201);
    const segunda = await registrarComo(A).send(peticion).expect(201);

    expect((segunda.body as { id: string }).id).toBe((primera.body as { id: string }).id);

    const { rows } = await dueno.query<{ cuantas: number }>(
      'SELECT count(*)::int AS cuantas FROM resultado WHERE id_operacion_cliente = $1',
      [peticion['clientOperationId']],
    );

    expect(rows[0]?.cuantas).toBe(1);
  });

  it('con el token de una persona no se alcanza el resultado de otra', async () => {
    // El reintento de A con la operacion de B no devuelve lo de B: crea lo
    // suyo. Es la misma garantia que ya comprueba la prueba de la API, pero
    // aqui con la base de verdad detras y con dos identidades que vienen de
    // dos tokens distintos.
    const operacion = nuevaOperacion();

    const deB = await registrarComo(B)
      .send(cuerpo({ clientOperationId: operacion }))
      .expect(201);
    const deA = await registrarComo(A)
      .send(cuerpo({ clientOperationId: operacion }))
      .expect(201);

    expect((deA.body as { id: string }).id).not.toBe((deB.body as { id: string }).id);
    expect(await duenoDelResultado((deA.body as { id: string }).id)).toBe(PERSONA_A);
  });
});
