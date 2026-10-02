import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  SESIONES,
  VerificadorFalso,
  comoUsuario,
  darDeAlta,
} from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

const A = 'token-de-A';
const B = 'token-de-B';

const LUMA = { forma: 'brote', color: '#A2D9B6', accesorio: 'ninguno', nombre: 'Luma' };

interface Cuenta {
  correo: string;
  rol: string;
  modulosActivos: string[];
  mascota: typeof LUMA | null;
}

/** `PATCH /api/cuenta/preferencias` por HTTP, con la tuberia de verdad. */
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

describe('PATCH /api/cuenta/preferencias', () => {
  let app: NestExpressApplication;

  function preferencias(token: string): request.Test {
    return request(app.getHttpServer())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario(token));
  }

  async function cuentaDe(token: string): Promise<Cuenta> {
    const respuesta = await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(token))
      .expect(200);

    return respuesta.body as Cuenta;
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('una cuenta recien creada todavia no eligio modulos', async () => {
    const cuenta = await cuentaDe(B);

    expect(cuenta.modulosActivos).toEqual([]);
    expect(cuenta.mascota).toBeNull();
  });

  it('guarda los modulos y la mascota, y GET /api/cuenta los devuelve', async () => {
    const respuesta = await preferencias(A)
      .send({ modulosActivos: ['emociones', 'cognicion'], mascota: LUMA })
      .expect(200);

    expect(respuesta.body).toMatchObject({
      modulosActivos: ['cognicion', 'emociones'],
      mascota: { ...LUMA, color: '#a2d9b6' },
    });

    expect((await cuentaDe(A)).modulosActivos).toEqual(['cognicion', 'emociones']);
  });

  it('lo que no se manda se queda como estaba', async () => {
    await preferencias(A)
      .send({ modulosActivos: ['bienestar'] })
      .expect(200);

    const cuenta = await cuentaDe(A);

    expect(cuenta.modulosActivos).toEqual(['bienestar']);
    expect(cuenta.mascota?.nombre).toBe('Luma');
  });

  it('activar un modulo que no existe responde 400', async () => {
    const respuesta = await preferencias(A)
      .send({ modulosActivos: ['finanzas'] })
      .expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'MODULO_DESCONOCIDO' });
  });

  it('desactivar el ultimo modulo responde 400', async () => {
    const respuesta = await preferencias(A).send({ modulosActivos: [] }).expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'SIN_MODULOS_ACTIVOS' });
    expect((await cuentaDe(A)).modulosActivos).toEqual(['bienestar']);
  });

  it('una mascota mal formada responde 400', async () => {
    const respuesta = await preferencias(A)
      .send({ mascota: { ...LUMA, color: 'verde' } })
      .expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_INVALIDA' });
  });

  it.each([
    ['el correo', { correo: 'otro@ejemplo.test' }],
    ['el rol', { rol: 'administrador' }],
    ['el identificador', { id: '22222222-2222-4222-9222-222222222222' }],
  ])('%s no se puede cambiar por esta ruta', async (_campo, cuerpo) => {
    await preferencias(A).send(cuerpo).expect(400);

    const cuenta = await cuentaDe(A);

    expect(cuenta.correo).toBe(SESIONES[A]?.correo);
    expect(cuenta.rol).toBe('usuario');
  });

  it('cambiar las propias no toca las de otra persona', async () => {
    await preferencias(A)
      .send({ modulosActivos: ['cognicion'] })
      .expect(200);

    expect((await cuentaDe(B)).modulosActivos).toEqual([]);
  });

  it('sin token responde 401', async () => {
    await request(app.getHttpServer())
      .patch('/api/cuenta/preferencias')
      .send({ modulosActivos: ['cognicion'] })
      .expect(401);
  });
});

describe('Preferencias sin cuenta', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('con sesion pero sin alta responde 403', async () => {
    await request(app.getHttpServer())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario(A))
      .send({ modulosActivos: ['cognicion'] })
      .expect(403);
  });
});
