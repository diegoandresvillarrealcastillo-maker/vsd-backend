import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

const USUARIO_A = '11111111-1111-4111-8111-111111111111';
const USUARIO_B = '22222222-2222-4222-9222-222222222222';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';

/** Cada prueba usa su propia operacion para no interferir con las demas. */
let contador = 0;
function nuevaOperacion(): string {
  contador += 1;

  return '44444444-4444-4444-b444-' + String(contador).padStart(12, '0');
}

function cuerpo(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    userId: USUARIO_A,
    activityId: ACTIVIDAD,
    clientOperationId: nuevaOperacion(),
    score: 8,
    maxScore: 10,
    completedAt: '2026-09-14T11:00:00.000Z',
    ...extra,
  };
}

/**
 * Levanta la aplicacion con la misma configuracion que usa main.ts.
 *
 * Si la prueba la configurara de otra forma, no demostraria nada sobre el
 * comportamiento real del servicio.
 */
async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';

  const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  return app;
}

describe('POST /api/resultados', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registra un resultado y devuelve 201', async () => {
    const respuesta = await request(app.getHttpServer()).post('/api/resultados').send(cuerpo());

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject({
      activityId: ACTIVIDAD,
      score: 8,
      maxScore: 10,
      nivelOrientativo: 'favorable',
      sugiereAcompanamiento: false,
    });
  });

  it('no devuelve el identificador del usuario en la respuesta', async () => {
    // Quien pregunta ya sabe de quien es el resultado. Devolverlo solo
    // anadiria un dato personal mas circulando por la red.
    const respuesta = await request(app.getHttpServer()).post('/api/resultados').send(cuerpo());

    expect(respuesta.body).not.toHaveProperty('userId');
  });

  it('sugiere acompanamiento cuando el puntaje es bajo', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/resultados')
      .send(cuerpo({ score: 2 }));

    expect(respuesta.body).toMatchObject({
      nivelOrientativo: 'requiere_atencion',
      sugiereAcompanamiento: true,
    });
  });

  it('es idempotente: el reintento devuelve el mismo resultado', async () => {
    const peticion = cuerpo();

    const primera = await request(app.getHttpServer()).post('/api/resultados').send(peticion);
    const segunda = await request(app.getHttpServer()).post('/api/resultados').send(peticion);

    const idPrimera = (primera.body as { id: string }).id;
    const idSegunda = (segunda.body as { id: string }).id;

    expect(segunda.status).toBe(201);
    expect(idSegunda).toBe(idPrimera);
  });
});

describe('Aislamiento entre usuarios y manejo de errores', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responde 404 si la operacion pertenece a otro usuario', async () => {
    const peticion = cuerpo();

    await request(app.getHttpServer()).post('/api/resultados').send(peticion);

    const ajena = await request(app.getHttpServer())
      .post('/api/resultados')
      .send({ ...peticion, userId: USUARIO_B });

    expect(ajena.status).toBe(404);
    expect(ajena.body).toMatchObject({ codigo: 'OPERACION_DE_OTRO_USUARIO' });
  });

  it('el mensaje de la operacion ajena no confirma que exista', async () => {
    // Un 403, o un mensaje que dijera "esa operacion ya existe", confirmaria
    // que hay algo detras de ese identificador. El 404 no distingue entre
    // "no existe" y "no es tuyo".
    const peticion = cuerpo();

    await request(app.getHttpServer()).post('/api/resultados').send(peticion);

    const ajena = await request(app.getHttpServer())
      .post('/api/resultados')
      .send({ ...peticion, userId: USUARIO_B });

    expect(JSON.stringify(ajena.body)).not.toMatch(/existe|registrad|otro usuario|duplicad/i);
  });

  it('rechaza un identificador mal formado con 400', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/resultados')
      .send(cuerpo({ userId: 'no-es-un-uuid' }));

    expect(respuesta.status).toBe(400);
  });

  it('rechaza un campo que no existe en el contrato', async () => {
    // Proteccion contra asignacion masiva: enviar un campo de mas no puede
    // colarse en silencio.
    const respuesta = await request(app.getHttpServer())
      .post('/api/resultados')
      .send(cuerpo({ esAdministrador: true }));

    expect(respuesta.status).toBe(400);
    expect(JSON.stringify(respuesta.body)).toContain('esAdministrador');
  });

  it('rechaza una fecha futura con el codigo del dominio', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/resultados')
      .send(cuerpo({ completedAt: '2030-01-01T00:00:00.000Z' }));

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toMatchObject({ codigo: 'FECHA_EN_EL_FUTURO' });
  });

  it('ningun error revela la traza ni nombres de clases internas', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/resultados')
      .send(cuerpo({ score: 999 }));

    expect(JSON.stringify(respuesta.body)).not.toMatch(
      /at \w+|\.ts:|node_modules|UseCaseImpl|Repository/,
    );
  });
});

describe('Protecciones y estado del servicio', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health responde 200 sin revelar detalles internos', async () => {
    const respuesta = await request(app.getHttpServer()).get('/health');

    expect(respuesta.status).toBe(200);
    expect(Object.keys(respuesta.body as object)).toEqual(['estado']);
  });

  it('incluye las cabeceras de seguridad', async () => {
    const respuesta = await request(app.getHttpServer()).get('/health');

    expect(respuesta.headers['x-content-type-options']).toBe('nosniff');
    expect(respuesta.headers['referrer-policy']).toBe('no-referrer');
    expect(respuesta.headers['x-frame-options']).toBeDefined();
  });

  it('no anuncia la tecnologia del servidor', async () => {
    const respuesta = await request(app.getHttpServer()).get('/health');

    expect(respuesta.headers['x-powered-by']).toBeUndefined();
  });

  it('no autoriza un origen que no esta en la lista blanca', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'https://sitio-no-autorizado.example');

    expect(respuesta.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('autoriza el origen configurado', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://localhost:5173');

    expect(respuesta.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});
