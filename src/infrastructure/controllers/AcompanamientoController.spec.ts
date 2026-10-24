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

/**
 * «Tu semana en una hoja», del catalogo en memoria: de 0 a 20 y de «mayor requiere atencion», asi
 * que 20 es una semana pesada. Es de las que cuentan para el acompanamiento (ADR 0034).
 */
const CARGA = '77777777-7777-4777-a777-777777777777';

/** Secuencias, un juego de cognicion: aunque le vaya mal, no cuenta para el acompanamiento. */
const SECUENCIAS = '33333333-3333-4333-a333-333333333333';

const UN_DIA_EN_MS = 24 * 60 * 60 * 1000;

interface Acompanamiento {
  nivel: string;
  lineasDeAtencion: { id: string; titulo: string; tipo: string }[];
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

describe('GET /api/acompanamiento (SCRUM-177)', () => {
  let app: NestExpressApplication;
  let contador = 0;

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  async function acompanamientoDe(token: string): Promise<Acompanamiento> {
    const respuesta = await request(servidor())
      .get('/api/acompanamiento')
      .set(...comoUsuario(token))
      .expect(200);

    return respuesta.body as Acompanamiento;
  }

  /** Da o quita el permiso del acompanamiento, como lo hace la persona desde su perfil. */
  async function darPermiso(token: string, permiso: boolean): Promise<void> {
    await request(servidor())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario(token))
      .send({ acompanamientoPorDias: permiso })
      .expect(200);
  }

  /**
   * Registra un resultado que lo pone en «requiere atencion» de hace `diasAtras` dias, como lo hace
   * el dispositivo: 20 de 20 en la carga, o 1 de 10 en un juego de cognicion.
   */
  async function conAtencionHace(
    token: string,
    diasAtras: number,
    actividad: string = CARGA,
  ): Promise<void> {
    contador += 1;

    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(token))
      .send({
        activityId: actividad,
        clientOperationId: `44444444-4444-4444-b444-${String(contador).padStart(12, '0')}`,
        score: actividad === CARGA ? 20 : 1,
        completedAt: new Date(Date.now() - diasAtras * UN_DIA_EN_MS - 1000).toISOString(),
      })
      .expect(201);
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(servidor());
    // Solo A da su permiso al empezar: sin el, el acompanamiento no mira nada (ADR 0034, pregunta 3).
    await darPermiso(A, true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('sin resultados, ninguno y sin lineas', async () => {
    await expect(acompanamientoDe(A)).resolves.toEqual({ nivel: 'ninguno', lineasDeAtencion: [] });
  });

  it('2 dias seguidos con atencion todavia no son nada', async () => {
    await conAtencionHace(A, 0);
    await conAtencionHace(A, 1);

    await expect(acompanamientoDe(A)).resolves.toEqual({ nivel: 'ninguno', lineasDeAtencion: [] });
  });

  it('a los 3 dias seguidos, moderado y sin lineas', async () => {
    await conAtencionHace(A, 2);

    await expect(acompanamientoDe(A)).resolves.toEqual({ nivel: 'moderado', lineasDeAtencion: [] });
  });

  it('a los 7 dias seguidos, critico, con las lineas de atencion de su pais', async () => {
    for (const diasAtras of [3, 4, 5, 6]) {
      await conAtencionHace(A, diasAtras);
    }

    const acompanamiento = await acompanamientoDe(A);

    expect(acompanamiento.nivel).toBe('critico');
    expect(acompanamiento.lineasDeAtencion.length).toBeGreaterThan(0);
    expect(acompanamiento.lineasDeAtencion.every((linea) => linea.tipo === 'contacto')).toBe(true);
  });

  it('no sale ningun puntaje ni cuantos dias van: solo el nivel y las lineas', async () => {
    const respuesta = await request(servidor())
      .get('/api/acompanamiento')
      .set(...comoUsuario(A))
      .expect(200);

    expect(Object.keys(respuesta.body as object).sort()).toEqual(['lineasDeAtencion', 'nivel']);
  });

  it('lo de una persona no cuenta para otra', async () => {
    await expect(acompanamientoDe(B)).resolves.toEqual({ nivel: 'ninguno', lineasDeAtencion: [] });
  });

  it('un juego de cognicion que le va mal no cuenta, ni siquiera con permiso', async () => {
    await darPermiso(B, true);

    // Tres dias seguidos que terminan hoy, con lo mas bajo en un juego de cognicion.
    for (const diasAtras of [0, 1, 2]) {
      await conAtencionHace(B, diasAtras, SECUENCIAS);
    }

    await expect(acompanamientoDe(B)).resolves.toEqual({ nivel: 'ninguno', lineasDeAtencion: [] });

    await darPermiso(B, false);
  });

  it('sin el permiso de la persona no mira nada, aunque lleve siete dias con atencion', async () => {
    for (const diasAtras of [0, 1, 2, 3, 4, 5, 6]) {
      await conAtencionHace(B, diasAtras);
    }

    await expect(acompanamientoDe(B)).resolves.toEqual({ nivel: 'ninguno', lineasDeAtencion: [] });

    // En cuanto la persona da su permiso, lo que ya hizo cuenta; al quitarlo, deja de contar.
    await darPermiso(B, true);
    expect((await acompanamientoDe(B)).nivel).toBe('critico');

    await darPermiso(B, false);
    await expect(acompanamientoDe(B)).resolves.toEqual({ nivel: 'ninguno', lineasDeAtencion: [] });
  });

  it('no se guarda en cache: es sobre la persona y cambia cada vez que hace algo', async () => {
    const respuesta = await request(servidor())
      .get('/api/acompanamiento')
      .set(...comoUsuario(A))
      .expect(200);

    expect(respuesta.headers['cache-control']).toContain('no-store');
  });

  it('sin token responde 401', async () => {
    await request(servidor()).get('/api/acompanamiento').expect(401);
  });
});
