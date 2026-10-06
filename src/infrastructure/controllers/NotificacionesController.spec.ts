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

/**
 * `/api/notificaciones` por HTTP, con todo en memoria y sin claves VAPID (SCRUM-102).
 * El aislamiento en la base se prueba en `PrismaAvisosRepository.integracion`.
 */
const A = 'token-de-A';
const B = 'token-de-B';

const SUSCRIPCION = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/navegador-de-a',
  keys: { p256dh: 'clave-p256dh-de-prueba', auth: 'clave-auth-de-prueba' },
};

async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  delete process.env.DATABASE_URL;
  delete process.env.VAPID_PUBLIC_KEY;
  delete process.env.VAPID_PRIVATE_KEY;
  delete process.env.VAPID_SUBJECT;

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));
  await app.init();
  await darDeAlta(app.getHttpServer());

  return app;
}

describe('/api/notificaciones', () => {
  let app: NestExpressApplication;

  function consultar(token: string): request.Test {
    return request(app.getHttpServer())
      .get('/api/notificaciones')
      .set(...comoUsuario(token));
  }

  function horas(token: string, cuerpo: Record<string, unknown>): request.Test {
    return request(app.getHttpServer())
      .patch('/api/notificaciones/horas')
      .set(...comoUsuario(token))
      .send(cuerpo);
  }

  function recordatorios(token: string, cuerpo: Record<string, unknown>): request.Test {
    return request(app.getHttpServer())
      .patch('/api/notificaciones/recordatorios')
      .set(...comoUsuario(token))
      .send(cuerpo);
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('sin sesion no hay nada', async () => {
    await request(app.getHttpServer()).get('/api/notificaciones').expect(401);
  });

  it('sin claves VAPID no estan disponibles, y empiezan apagados', async () => {
    const respuesta = await consultar(A).expect(200);

    expect(respuesta.body).toEqual({
      disponible: false,
      clavePublica: null,
      horaSemaforo: null,
      horaRacha: null,
      recordatorioManana: false,
      recordatorioNoche: false,
    });
    expect(respuesta.headers['cache-control']).toBe('no-store');
  });

  it('cada aviso tiene su hora, y apagar uno no apaga el otro', async () => {
    await horas(A, { horaSemaforo: '08:00', horaRacha: '19:30' }).expect(200);

    const respuesta = await horas(A, { horaSemaforo: null }).expect(200);

    expect(respuesta.body).toMatchObject({ horaSemaforo: null, horaRacha: '19:30' });
    expect((await consultar(A)).body).toMatchObject({ horaSemaforo: null, horaRacha: '19:30' });
  });

  it('las horas de una persona no son las de otra', async () => {
    await horas(A, { horaRacha: '07:15' }).expect(200);

    expect((await consultar(B)).body).toMatchObject({ horaRacha: null });
  });

  it.each([
    ['una hora imposible', { horaSemaforo: '25:00' }, 'AVISO_INVALIDO'],
    ['una hora sin minutos', { horaSemaforo: '8' }, 'AVISO_INVALIDO'],
    ['un numero', { horaSemaforo: 800 }, undefined],
    ['un campo que no existe', { horaDeComer: '12:00' }, undefined],
  ])('rechaza %s', async (_caso, cuerpo, codigo) => {
    const respuesta = await horas(A, cuerpo).expect(400);

    if (codigo !== undefined) {
      expect(respuesta.body).toMatchObject({ codigo });
    }
  });

  describe('los recordatorios de las 8:00 y las 20:00 (SCRUM-126)', () => {
    it('se encienden y se apagan por separado, sin tocar las horas de los otros avisos', async () => {
      await horas(A, { horaSemaforo: '08:00', horaRacha: '19:30' }).expect(200);

      const encendido = await recordatorios(A, { manana: true }).expect(200);

      expect(encendido.body).toMatchObject({
        recordatorioManana: true,
        recordatorioNoche: false,
        horaSemaforo: '08:00',
        horaRacha: '19:30',
      });
      expect(encendido.headers['cache-control']).toBe('no-store');

      const ambos = await recordatorios(A, { noche: true }).expect(200);

      expect(ambos.body).toMatchObject({ recordatorioManana: true, recordatorioNoche: true });

      const apagado = await recordatorios(A, { manana: false }).expect(200);

      expect(apagado.body).toMatchObject({ recordatorioManana: false, recordatorioNoche: true });
      expect((await consultar(A)).body).toMatchObject({
        recordatorioManana: false,
        recordatorioNoche: true,
      });
    });

    it('cambiar las horas despues no los apaga', async () => {
      await recordatorios(A, { manana: true, noche: true }).expect(200);

      const respuesta = await horas(A, { horaSemaforo: '09:15' }).expect(200);

      expect(respuesta.body).toMatchObject({
        horaSemaforo: '09:15',
        recordatorioManana: true,
        recordatorioNoche: true,
      });
    });

    it('un cuerpo vacio no cambia nada', async () => {
      await recordatorios(A, { manana: true, noche: false }).expect(200);

      const respuesta = await recordatorios(A, {}).expect(200);

      expect(respuesta.body).toMatchObject({ recordatorioManana: true, recordatorioNoche: false });
    });

    it('los de una persona no son los de otra', async () => {
      await recordatorios(A, { manana: true, noche: true }).expect(200);

      expect((await consultar(B)).body).toMatchObject({
        recordatorioManana: false,
        recordatorioNoche: false,
      });
    });

    it.each([
      ['un texto', { manana: 'si' }],
      ['un numero', { noche: 1 }],
      ['null', { manana: null }],
      ['una hora, porque no se mueven', { manana: '09:00' }],
      ['un campo que no existe', { tarde: true }],
    ])('rechaza %s', async (_caso, cuerpo) => {
      await recordatorios(A, cuerpo).expect(400);
    });

    it('sin sesion no hay nada', async () => {
      await request(app.getHttpServer())
        .patch('/api/notificaciones/recordatorios')
        .send({ manana: true })
        .expect(401);
    });
  });

  it('suscribe y suelta un navegador', async () => {
    await request(app.getHttpServer())
      .post('/api/notificaciones/suscripciones')
      .set(...comoUsuario(A))
      .send(SUSCRIPCION)
      .expect(204);

    await request(app.getHttpServer())
      .delete('/api/notificaciones/suscripciones')
      .set(...comoUsuario(A))
      .send({ endpoint: SUSCRIPCION.endpoint })
      .expect(204);
  });

  it.each([
    ['sin https', { ...SUSCRIPCION, endpoint: 'http://push.example.com/abc' }],
    ['sin claves', { endpoint: SUSCRIPCION.endpoint }],
  ])('no acepta una suscripcion %s', async (_caso, cuerpo) => {
    await request(app.getHttpServer())
      .post('/api/notificaciones/suscripciones')
      .set(...comoUsuario(A))
      .send(cuerpo)
      .expect(400);
  });
});
