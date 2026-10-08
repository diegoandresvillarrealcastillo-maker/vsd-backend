import { readFileSync } from 'node:fs';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { VerificadorFalso } from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

const RUTA = '/api/asistente/reglas-locales';

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

/** El contrato que se publica como archivo y que el frontend copia. */
function elContrato(): { paquete: Record<string, unknown> } {
  return JSON.parse(
    readFileSync(new URL('../../../docs/contratos/reglas-locales.json', import.meta.url), 'utf8'),
  ) as { paquete: Record<string, unknown> };
}

/**
 * Las reglas de VSD IA para responder sin conexion, por HTTP (SCRUM-141).
 *
 * Lo que importa de esta ruta es lo que **no** pide: ni sesion ni cuenta. Se
 * necesita justo cuando algo falla, y las lineas de ayuda no pueden quedarse
 * detras de un inicio de sesion que no se puede hacer.
 */
describe(`GET ${RUTA}`, () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('se lee sin sesion y sin cuenta', async () => {
    const respuesta = await request(app.getHttpServer()).get(RUTA).expect(200);

    expect(respuesta.body).toMatchObject({ esquema: 1 });
  });

  it('un token que no sirve no la rompe: no depende de quien pregunta', async () => {
    await request(app.getHttpServer())
      .get(RUTA)
      .set('Authorization', 'Bearer un-token-que-no-existe')
      .expect(200);
  });

  it('trae el riesgo, la charla, lo demas que se reconoce y las lineas de cada pais', async () => {
    interface Paquete {
      riesgo: { expresiones: string[]; mensaje: string };
      charla: { reglas: { intencion: string }[] };
      intenciones: unknown[];
      paises: Record<string, unknown>;
      internacional: unknown[];
    }

    const { body } = await request(app.getHttpServer()).get(RUTA).expect(200);
    const paquete = body as Paquete;

    expect(paquete.riesgo.expresiones.length).toBeGreaterThan(20);
    expect(paquete.riesgo.mensaje).toEqual(expect.any(String));
    expect(paquete.charla.reglas.map((regla) => regla.intencion)).toEqual(
      expect.arrayContaining(['saludo', 'agradecimiento', 'despedida']),
    );
    expect(paquete.intenciones.length).toBeGreaterThan(0);
    expect(Object.keys(paquete.paises)).toEqual(['CO', 'MX', 'ES', 'US']);
    expect(paquete.internacional.length).toBeGreaterThan(0);
  });

  it('es exactamente el contrato que se publica como archivo', async () => {
    // Si esto falla, lo que sale por HTTP cambio sin regenerar el contrato, y el
    // frontend estaria probando su motor contra otra cosa.
    const { body } = await request(app.getHttpServer()).get(RUTA).expect(200);

    expect(body).toEqual(elContrato().paquete);
  });

  it('las lineas salen como las de cualquier otra respuesta: con titulo, descripcion y cobertura', async () => {
    const { body } = await request(app.getHttpServer()).get(RUTA).expect(200);
    const colombia = (body as { paises: { CO: { lineas: Record<string, unknown>[] } } }).paises.CO;

    expect(colombia.lineas[0]).toMatchObject({
      titulo: expect.stringContaining('192'),
      tipo: 'contacto',
      cobertura: 'nacional',
    });
    // Lo de la fuente y la verificacion es de quien revisa la base, no de la pantalla.
    expect(colombia.lineas[0]).not.toHaveProperty('fuente');
  });

  it('lleva ETag y responde 304 si nada cambio, sin cuerpo', async () => {
    const primera = await request(app.getHttpServer()).get(RUTA).expect(200);
    const etag = primera.headers['etag'];

    expect(etag).toBeTruthy();

    const revalidada = await request(app.getHttpServer())
      .get(RUTA)
      .set('If-None-Match', String(etag))
      .expect(304);

    expect(revalidada.text).toBe('');
  });

  it('el mismo contenido tiene el mismo ETag: no cambia entre lecturas', async () => {
    const una = await request(app.getHttpServer()).get(RUTA).expect(200);
    const otra = await request(app.getHttpServer()).get(RUTA).expect(200);

    expect(otra.headers['etag']).toBe(una.headers['etag']);
  });

  it('con un ETag viejo devuelve el paquete entero', async () => {
    const respuesta = await request(app.getHttpServer())
      .get(RUTA)
      .set('If-None-Match', 'W/"una-version-anterior"')
      .expect(200);

    expect(respuesta.body).toMatchObject({ esquema: 1 });
  });

  it('la web puede leer el ETag desde su origen', async () => {
    const respuesta = await request(app.getHttpServer())
      .get(RUTA)
      .set('Origin', 'http://localhost:5173')
      .expect(200);

    expect(String(respuesta.headers['access-control-expose-headers']).toLowerCase()).toContain(
      'etag',
    );
  });

  it('no guarda nada de nadie: solo baja, y no acepta lo que alguien escriba', async () => {
    // Lo que una persona escribe sin conexion no se envia despues ni pasa por aqui.
    const respuesta = await request(app.getHttpServer())
      .post(RUTA)
      .send({ texto: 'quiero morirme' });

    expect(respuesta.status).toBeGreaterThanOrEqual(400);
  });
});
