import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

const USUARIO = '11111111-1111-4111-8111-111111111111';

async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  // Estas pruebas son del comportamiento HTTP. Sin esto, tener un .env con
  // DATABASE_URL las haria hablar con PostgreSQL sin avisar.
  delete process.env.DATABASE_URL;

  const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  return app;
}

function cuerpoDe(respuesta: request.Response): Record<string, unknown> {
  return respuesta.body as Record<string, unknown>;
}

/**
 * El asistente a traves de HTTP.
 *
 * Las reglas se prueban en su propia capa; esto comprueba el camino completo,
 * que es donde se rompen las cosas: el cableado del modulo, la validacion de
 * la peticion y la forma de la respuesta.
 *
 * La prueba que importa es la del riesgo. Que la deteccion funcione en una
 * prueba unitaria no sirve de nada si el telefono no llega a salir por el
 * cable.
 */
describe('POST /api/asistente', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responde a una pregunta reconocida con recursos', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .send({ userId: USUARIO, texto: 'como puedo dormir mejor' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({ intencion: 'como_duermo_mejor', senalDeRiesgo: false });
    expect((cuerpoDe(respuesta).recursos as unknown[]).length).toBeGreaterThan(0);
  });

  it('ante una senal de riesgo devuelve lineas de atencion', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .send({ userId: USUARIO, texto: 'ya no aguanto mas' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      senalDeRiesgo: true,
      incluyeLineasDeAtencion: true,
    });

    const recursos = cuerpoDe(respuesta).recursos as { tipo: string; cobertura?: string }[];

    expect(recursos.length).toBeGreaterThan(0);
    expect(recursos.every((recurso) => recurso.tipo === 'contacto')).toBe(true);
    // Lo primero que se ve tiene que servir en todo el pais.
    expect(recursos[0]?.cobertura).toBe('nacional');
  });

  it('no devuelve el texto que escribio la persona', async () => {
    // Lo que alguien le cuenta al asistente no vuelve en la respuesta, no se
    // guarda y no aparece en ningun registro. Si algun dia se anadiera un eco
    // del texto "para depurar", esta prueba lo dice.
    const confesion = 'ayer discuti con mi mama y quiero morirme';

    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .send({ userId: USUARIO, texto: confesion });

    expect(JSON.stringify(respuesta.body)).not.toContain('mama');
    expect(JSON.stringify(respuesta.body)).not.toContain('discuti');
  });

  it('responde algo util cuando no entiende', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .send({ userId: USUARIO, texto: 'a que hora abre la biblioteca' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({ intencion: 'no_reconocida' });
    expect((cuerpoDe(respuesta).recursos as unknown[]).length).toBeGreaterThan(0);
  });

  it.each([
    ['sin texto', { userId: USUARIO }],
    ['texto vacio', { userId: USUARIO, texto: '' }],
    ['identificador mal formado', { userId: 'no-es-un-uuid', texto: 'hola' }],
    ['texto larguisimo', { userId: USUARIO, texto: 'a'.repeat(1001) }],
  ])('rechaza con 400 una peticion %s', async (_caso, cuerpo) => {
    const respuesta = await request(app.getHttpServer()).post('/api/asistente').send(cuerpo);

    expect(respuesta.status).toBe(400);
  });

  it('rechaza un campo que no existe en el contrato', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .send({ userId: USUARIO, texto: 'hola', modelo: 'gpt' });

    expect(respuesta.status).toBe(400);
  });
});
