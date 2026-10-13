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

interface DatoDelDia {
  dia: string;
  dato: { id: string; texto: string; tema: string } | null;
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

describe('GET /api/datos-curiosos/hoy (SCRUM-185)', () => {
  let app: NestExpressApplication;

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  async function deHoy(token: string): Promise<DatoDelDia> {
    const respuesta = await request(servidor())
      .get('/api/datos-curiosos/hoy')
      .set(...comoUsuario(token))
      .expect(200);

    return respuesta.body as DatoDelDia;
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(servidor());
  });

  afterAll(async () => {
    await app.close();
  });

  it('da un dato con su texto y el dia de hoy', async () => {
    const hoy = await deHoy(A);

    expect(hoy.dia).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(hoy.dato).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      texto: expect.stringMatching(/\S/),
      tema: expect.stringMatching(/\S/),
    });
  });

  it('es el mismo dato todo el dia', async () => {
    const primero = await deHoy(A);
    const segundo = await deHoy(A);

    expect(segundo.dato?.id).toBe(primero.dato?.id);
    expect(segundo.dia).toBe(primero.dia);
  });

  it('cada persona tiene su propio cursor: lo de una no mueve lo de otra', async () => {
    const deA = await deHoy(A);
    const deB = await deHoy(B);

    // Pueden coincidir por azar en el primero (el catalogo de ejemplo es corto); lo que se
    // exige es que ambas reciban un dato y que pedirlo otra vez no cambie el de ninguna.
    expect(deA.dato).not.toBeNull();
    expect(deB.dato).not.toBeNull();
    expect((await deHoy(A)).dato?.id).toBe(deA.dato?.id);
    expect((await deHoy(B)).dato?.id).toBe(deB.dato?.id);
  });

  it('no se guarda en cache: cambia con el dia y es de cada persona', async () => {
    const respuesta = await request(servidor())
      .get('/api/datos-curiosos/hoy')
      .set(...comoUsuario(A))
      .expect(200);

    expect(respuesta.headers['cache-control']).toContain('no-store');
  });

  it('sin token responde 401', async () => {
    await request(servidor()).get('/api/datos-curiosos/hoy').expect(401);
  });
});
