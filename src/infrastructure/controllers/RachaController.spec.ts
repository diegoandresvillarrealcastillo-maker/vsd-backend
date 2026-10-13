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

/** Secuencias, del catalogo en memoria. */
const SECUENCIAS = '33333333-3333-4333-a333-333333333333';

interface Racha {
  dias: number;
  nivel: number;
  hechoHoy: boolean;
  enDescanso: boolean;
  congelamientosUsados: number;
  congelamientosPorMes: number;
  diasCubiertos: string[];
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

describe('GET /api/racha (SCRUM-186)', () => {
  let app: NestExpressApplication;

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  async function rachaDe(token: string): Promise<Racha> {
    const respuesta = await request(servidor())
      .get('/api/racha')
      .set(...comoUsuario(token))
      .expect(200);

    return respuesta.body as Racha;
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(servidor());
  });

  afterAll(async () => {
    await app.close();
  });

  it('sin actividad la llama descansa, y dice cuantos congelamientos hay', async () => {
    await expect(rachaDe(B)).resolves.toEqual({
      dias: 0,
      nivel: 0,
      hechoHoy: false,
      enDescanso: true,
      congelamientosUsados: 0,
      congelamientosPorMes: 3,
      diasCubiertos: [],
    });
  });

  it('hacer una actividad hoy enciende la racha con un dia', async () => {
    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(A))
      .send({
        activityId: SECUENCIAS,
        clientOperationId: '44444444-4444-4444-b444-444444444481',
        score: 8,
        completedAt: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);

    await expect(rachaDe(A)).resolves.toMatchObject({
      dias: 1,
      hechoHoy: true,
      enDescanso: false,
      nivel: 0,
    });
  });

  it('otra actividad el mismo dia no suma otro dia', async () => {
    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(A))
      .send({
        activityId: SECUENCIAS,
        clientOperationId: '44444444-4444-4444-b444-444444444482',
        score: 6,
        completedAt: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);

    expect((await rachaDe(A)).dias).toBe(1);
  });

  it('lo de una persona no cuenta para otra', async () => {
    expect((await rachaDe(B)).dias).toBe(0);
  });

  it('no se guarda en cache: cambia cada vez que la persona hace algo', async () => {
    const respuesta = await request(servidor())
      .get('/api/racha')
      .set(...comoUsuario(A))
      .expect(200);

    expect(respuesta.headers['cache-control']).toContain('no-store');
  });

  it('sin token responde 401', async () => {
    await request(servidor()).get('/api/racha').expect(401);
  });
});
