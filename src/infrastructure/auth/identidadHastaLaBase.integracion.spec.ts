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
 * Hay cuatro piezas y cada una tiene su prueba: el verificador acepta o
 * rechaza tokens, el alta traduce la identidad del proveedor en una cuenta
 * nuestra, el controlador usa esa cuenta, y la base aisla por
 * `vsd.usuario_actual`. Las cuatro pueden estar bien y el conjunto estar roto,
 * porque nada demuestra que **lo que llega a la base sea lo que salio del
 * token**.
 *
 * No es hipotetico: antes de SCRUM-63 el controlador escribia en
 * `resultado.id_usuario` el identificador del proveedor, y esa columna es
 * clave foranea contra `usuario.id_usuario`. Ninguna prueba unitaria lo veia
 * —los adaptadores en memoria no tienen claves foraneas— y aparecio con la
 * primera persona real, como un 500.
 *
 * ## Como se dan de alta las cuentas
 *
 * Llamando a la API, no sembrando filas a mano. Si se sembraran, se estaria
 * eligiendo el identificador de la cuenta, que es exactamente el dato cuya
 * procedencia se quiere comprobar.
 *
 * ## Por que la aplicacion se conecta como vsd_app
 *
 * Porque el dueno de las tablas esta exento de las politicas. Conectada como
 * dueno, escribiria y leeria igual aunque `set_config` no se llamara nunca, y
 * esta prueba pasaria sin comprobar nada.
 */

const URL_DUENO = process.env['DATABASE_URL'];
const CLAVE_LOCAL = 'clave_de_pruebas_locales';

const A = 'token-de-A';
const B = 'token-de-B';

const CATEGORIA = 'caaaaaaa-cccc-4ccc-8ccc-cccccccccccc';
const ACTIVIDAD = 'daaaaaaa-dddd-4ddd-8ddd-dddddddddddd';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

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

  /** Los identificadores que genero **el alta**, no la prueba. */
  const cuentas = new Map<string, string>();

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();

    await dueno.query(`ALTER ROLE vsd_app WITH LOGIN PASSWORD '${CLAVE_LOCAL}'`);
    await limpiar();

    // Catalogo sembrado por el dueno. Las cuentas no: esas las crea el alta.
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

    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:5173';
    process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
    process.env.DATABASE_URL = urlDeLaAplicacion(URL_DUENO ?? '');

    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(VerificadorDeIdentidad)
      .useClass(VerificadorFalso)
      .compile();

    app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

    configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

    await app.init();

    for (const token of [A, B]) {
      const respuesta = await request(app.getHttpServer())
        .post('/api/cuenta')
        .set(...comoUsuario(token))
        .send({ versionPolitica: '1.0' })
        .expect(200);

      cuentas.set(token, (respuesta.body as { id: string }).id);
    }
  });

  afterAll(async () => {
    await app?.close();
    await limpiar();
    await dueno?.end();
  });

  /** Borra lo de esta prueba, con el dueno y sin politicas de por medio. */
  async function limpiar(): Promise<void> {
    const correos = Object.values(SESIONES).map((s) => s.correo);

    await dueno.query(
      `DELETE FROM resultado WHERE id_usuario IN (SELECT id_usuario FROM usuario WHERE correo = ANY($1))`,
      [correos],
    );
    await dueno.query('DELETE FROM usuario WHERE correo = ANY($1)', [correos]);
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

  it('el alta crea un identificador propio, distinto del proveedor', () => {
    expect(cuentas.get(A)).toBeDefined();
    expect(cuentas.get(A)).not.toBe(SESIONES[A]?.id);
  });

  it('la fila queda a nombre de la cuenta de quien traia el token', async () => {
    const respuesta = await registrarComo(A).send(cuerpo()).expect(201);

    const id = (respuesta.body as { id: string }).id;

    expect(await duenoDelResultado(id)).toBe(cuentas.get(A));
  });

  it('dos personas distintas producen filas de cada cual', async () => {
    const deA = await registrarComo(A).send(cuerpo()).expect(201);
    const deB = await registrarComo(B).send(cuerpo()).expect(201);

    expect(await duenoDelResultado((deA.body as { id: string }).id)).toBe(cuentas.get(A));
    expect(await duenoDelResultado((deB.body as { id: string }).id)).toBe(cuentas.get(B));
  });

  it('el mismo identificador de operacion en dos personas son dos filas', async () => {
    // La unicidad es por persona, no global. Que dos dispositivos coincidan no
    // puede hacer que una vea el resultado de la otra. Ver ADR 0010.
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
    expect(await duenoDelResultado(idA)).toBe(cuentas.get(A));
    expect(await duenoDelResultado(idB)).toBe(cuentas.get(B));
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
    const operacion = nuevaOperacion();

    const deB = await registrarComo(B)
      .send(cuerpo({ clientOperationId: operacion }))
      .expect(201);
    const deA = await registrarComo(A)
      .send(cuerpo({ clientOperationId: operacion }))
      .expect(201);

    expect((deA.body as { id: string }).id).not.toBe((deB.body as { id: string }).id);
    expect(await duenoDelResultado((deA.body as { id: string }).id)).toBe(cuentas.get(A));
  });

  it('el alta es idempotente tambien contra la base', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/cuenta')
      .set(...comoUsuario(A))
      .send({ versionPolitica: '1.0' })
      .expect(200);

    expect((respuesta.body as { id: string }).id).toBe(cuentas.get(A));

    const { rows } = await dueno.query<{ cuantas: number }>(
      'SELECT count(*)::int AS cuantas FROM usuario WHERE correo = $1',
      [SESIONES[A]?.correo],
    );

    expect(rows[0]?.cuantas).toBe(1);
  });
});
