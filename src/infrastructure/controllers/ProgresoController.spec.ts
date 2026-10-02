import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { VerificadorFalso, comoUsuario, darDeAlta } from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

const A = 'token-de-A';
const B = 'token-de-B';

/** Secuencias, del catalogo en memoria. Va en Cognicion. */
const SECUENCIAS = '33333333-3333-4333-a333-333333333333';

interface Progreso {
  modulo: string;
  sesiones: number;
  etapa: { numero: number; sesionesHechas: number; sesionesDeLaEtapa: number };
  hoy: { id: string; nombre: string; hecha: boolean }[];
}

async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  delete process.env.DATABASE_URL;

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  return app;
}

describe('GET /api/progreso', () => {
  let app: NestExpressApplication;

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  async function progresoDe(token: string): Promise<Progreso[]> {
    const respuesta = await request(servidor())
      .get('/api/progreso')
      .set(...comoUsuario(token))
      .expect(200);

    return respuesta.body as Progreso[];
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(servidor());
  });

  afterAll(async () => {
    await app.close();
  });

  it('sin modulos elegidos responde una lista vacia', async () => {
    await expect(progresoDe(B)).resolves.toEqual([]);
  });

  it('con modulos elegidos, devuelve uno por modulo activo y ninguno mas', async () => {
    await request(servidor())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario(A))
      .send({ modulosActivos: ['bienestar', 'cognicion'] })
      .expect(200);

    const progreso = await progresoDe(A);

    expect(progreso.map((uno) => uno.modulo)).toEqual(['cognicion', 'bienestar']);
    expect(progreso.every((uno) => uno.sesiones === 0)).toBe(true);
    expect(progreso[0]?.etapa).toMatchObject({
      numero: 1,
      sesionesHechas: 0,
      sesionesDeLaEtapa: 5,
    });
  });

  it('hacer una actividad hoy suma una sesion a su modulo y la marca como hecha', async () => {
    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(A))
      .send({
        activityId: SECUENCIAS,
        clientOperationId: '44444444-4444-4444-b444-444444444441',
        score: 8,
        completedAt: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);

    const [cognicion, bienestar] = await progresoDe(A);

    expect(cognicion?.sesiones).toBe(1);
    expect(cognicion?.hoy).toEqual([expect.objectContaining({ id: SECUENCIAS, hecha: true })]);
    expect(bienestar?.sesiones).toBe(0);
  });

  it('una segunda actividad del mismo modulo el mismo dia no vuelve a sumar', async () => {
    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(A))
      .send({
        activityId: SECUENCIAS,
        clientOperationId: '44444444-4444-4444-b444-444444444442',
        score: 6,
        completedAt: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);

    const [cognicion] = await progresoDe(A);

    expect(cognicion?.sesiones).toBe(1);
  });

  it('lo de una persona no cuenta para otra', async () => {
    await expect(progresoDe(B)).resolves.toEqual([]);
  });

  it('no se guarda en cache', async () => {
    const respuesta = await request(servidor())
      .get('/api/progreso')
      .set(...comoUsuario(A))
      .expect(200);

    expect(respuesta.headers['cache-control']).toContain('no-store');
  });

  it('sin token responde 401', async () => {
    await request(servidor()).get('/api/progreso').expect(401);
  });
});
