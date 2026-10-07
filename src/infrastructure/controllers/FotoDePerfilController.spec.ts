import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PESO_MAXIMO_DE_LA_FOTO } from '../../domain/model/FotoDePerfil.js';
import {
  JPEG_REAL_DE_8_X_6,
  PNG_REAL_DE_8_X_6,
  unJpeg,
  unPng,
} from '../../pruebas/fotosDePrueba.js';
import {
  SESIONES,
  VerificadorFalso,
  comoUsuario,
  darDeAlta,
} from '../../pruebas/sesionDePrueba.js';
import type { AlmacenPersonalEnMemoria } from '../almacenamiento/AlmacenPersonalEnMemoria.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { ALMACEN_DE_FOTOS, CONFIGURACION } from '../config/tokens.js';

const A = 'token-de-A';
const B = 'token-de-B';

/**
 * La foto de perfil por HTTP, con la tuberia de verdad: el lector de cuerpos,
 * el guardia, el caso de uso y el filtro de errores. Solo cambian dos cosas:
 * la firma del token, que no se comprueba contra Supabase, y el almacen, que
 * al no haber clave de servicio es el de memoria.
 */
async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  delete process.env.DATABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  return app;
}

/**
 * Lee la respuesta como **bytes** si es una imagen, y como JSON si es un error.
 * Sin esto, supertest intentaria leer una imagen como texto y la estropearia.
 */
function comoBytesOComoJson(
  res: request.Response,
  hecho: (error: Error | null, cuerpo: unknown) => void,
): void {
  const trozos: Buffer[] = [];

  res.on('data', (trozo: Buffer) => trozos.push(trozo));
  res.on('end', () => {
    const todo = Buffer.concat(trozos);
    const tipo = String(res.headers['content-type'] ?? '');

    hecho(null, tipo.includes('json') ? JSON.parse(todo.toString('utf8')) : todo);
  });
}

describe('La foto de perfil por HTTP (SCRUM-120)', () => {
  let app: NestExpressApplication;

  const subir = (token: string, contenido: Uint8Array, tipo: string): request.Test =>
    request(app.getHttpServer())
      .put('/api/cuenta/foto')
      .set(...comoUsuario(token))
      .set('Content-Type', tipo)
      .send(Buffer.from(contenido));

  const pedir = (token: string): request.Test =>
    request(app.getHttpServer())
      .get('/api/cuenta/foto')
      .set(...comoUsuario(token))
      .buffer(true)
      .parse(comoBytesOComoJson);

  const quitar = (token: string): request.Test =>
    request(app.getHttpServer())
      .delete('/api/cuenta/foto')
      .set(...comoUsuario(token));

  const cuenta = (token: string): request.Test =>
    request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(token));

  beforeEach(async () => {
    app = await levantarAplicacion();
    await darDeAlta(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  describe('subirla y pedirla', () => {
    it('guarda la foto, la cuenta lo dice y la devuelve tal cual', async () => {
      const subida = await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);

      expect((subida.body as { foto: { actualizadaEl: string } }).foto.actualizadaEl).toMatch(
        /^\d{4}-\d{2}-\d{2}T/,
      );

      const respuesta = await pedir(A).expect(200);

      expect(respuesta.headers['content-type']).toContain('image/png');
      expect(new Uint8Array(respuesta.body as Buffer)).toEqual(PNG_REAL_DE_8_X_6);
    });

    it('un JPEG tambien, con su tipo', async () => {
      await subir(A, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      const respuesta = await pedir(A).expect(200);

      expect(respuesta.headers['content-type']).toContain('image/jpeg');
      expect(new Uint8Array(respuesta.body as Buffer)).toEqual(JPEG_REAL_DE_8_X_6);
    });

    it('el tipo con parametros y en mayusculas tambien vale', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'IMAGE/PNG; charset=binary').expect(200);
    });

    it('no se guarda en ninguna cache: es la foto de una persona', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);

      const respuesta = await pedir(A).expect(200);

      expect(respuesta.headers['cache-control']).toBe('no-store');
    });

    it('subir otra reemplaza la anterior', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);
      await subir(A, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      const respuesta = await pedir(A).expect(200);

      expect(new Uint8Array(respuesta.body as Buffer)).toEqual(JPEG_REAL_DE_8_X_6);
    });

    it('sin foto, pedirla responde 404 con su codigo', async () => {
      const respuesta = await request(app.getHttpServer())
        .get('/api/cuenta/foto')
        .set(...comoUsuario(A))
        .expect(404);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_NO_ENCONTRADA' });
    });
  });

  describe('la cuenta cuenta lo de la foto', () => {
    it('sin foto, la cuenta dice foto: null', async () => {
      expect((await cuenta(A).expect(200)).body).toMatchObject({ foto: null });
    });

    it('con foto, la cuenta dice desde cuando, y nunca los bytes', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);

      const { body } = await cuenta(A).expect(200);

      expect((body as { foto: { actualizadaEl: string } }).foto.actualizadaEl).toMatch(/^\d{4}-/);
      expect(Object.keys((body as { foto: object }).foto)).toEqual(['actualizadaEl']);
    });

    it('cambiar las preferencias no quita la foto', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);

      await request(app.getHttpServer())
        .patch('/api/cuenta/preferencias')
        .set(...comoUsuario(A))
        .send({ nombre: 'Ana' })
        .expect(200);

      expect((await cuenta(A).expect(200)).body).not.toMatchObject({ foto: null });
      await pedir(A).expect(200);
    });
  });

  describe('quitarla', () => {
    it('borra el archivo y la cuenta queda sin foto', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);

      const respuesta = await quitar(A).expect(200);

      expect(respuesta.body).toMatchObject({ foto: null });
      await pedir(A).expect(404);
      expect(app.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_FOTOS).cantidad).toBe(0);
    });

    it('quitar la que no hay tambien responde 200', async () => {
      await quitar(A).expect(200);
      await quitar(A).expect(200);
    });
  });

  describe('lo que no se acepta', () => {
    it.each([
      ['un GIF', 'image/gif'],
      ['un SVG', 'image/svg+xml'],
      ['un HTML', 'text/html'],
      ['un archivo cualquiera', 'application/octet-stream'],
    ])('%s se rechaza con 415 y su codigo', async (_cual, tipo) => {
      const respuesta = await subir(A, PNG_REAL_DE_8_X_6, tipo).expect(415);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_TIPO_NO_PERMITIDO' });
      await pedir(A).expect(404);
    });

    it('un JSON no es una foto, y no se lee como cuerpo de la foto', async () => {
      const respuesta = await request(app.getHttpServer())
        .put('/api/cuenta/foto')
        .set(...comoUsuario(A))
        .send({ foto: 'hola' })
        .expect(415);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_TIPO_NO_PERMITIDO' });
    });

    it('lo que dice ser un PNG y es un HTML se rechaza con 400', async () => {
      const respuesta = await subir(
        A,
        new TextEncoder().encode('<html><script>alert(1)</script></html>'),
        'image/png',
      ).expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_NO_ES_UNA_IMAGEN' });
      await pedir(A).expect(404);
    });

    it('un PNG que dice ser un JPEG se rechaza con 400', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/jpeg').expect(400);
    });

    it('un cuerpo vacio se rechaza con 400', async () => {
      const respuesta = await subir(A, new Uint8Array(0), 'image/png').expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_NO_ES_UNA_IMAGEN' });
    });

    it('una foto de mas de 50 KB se rechaza con 413 y su codigo', async () => {
      const respuesta = await subir(
        A,
        unPng(256, 256, PESO_MAXIMO_DE_LA_FOTO + 1000),
        'image/png',
      ).expect(413);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_DEMASIADO_PESADA' });
      expect((respuesta.body as { mensaje: string }).mensaje).toContain('50 KB');
    });

    it('justo en 50 KB se acepta', async () => {
      const foto = unPng(256, 256, PESO_MAXIMO_DE_LA_FOTO - unPng(256, 256).length);

      expect(foto.length).toBe(PESO_MAXIMO_DE_LA_FOTO);
      await subir(A, foto, 'image/png').expect(200);
    });

    it('un cuerpo enorme se corta sin leerlo entero, con el mensaje generico', async () => {
      const respuesta = await subir(A, unPng(256, 256, 200_000), 'image/png').expect(413);

      expect(respuesta.body).toMatchObject({ codigo: 'CUERPO_DEMASIADO_GRANDE' });
    });

    it('un archivo pequeno que declara millones de pixeles se rechaza con 400', async () => {
      const respuesta = await subir(A, unJpeg(30_000, 30_000), 'image/jpeg').expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_DEMASIADO_GRANDE' });
    });

    it('lo rechazado no deja nada guardado ni marcado', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/gif').expect(415);
      await subir(A, new Uint8Array(0), 'image/png').expect(400);

      expect(app.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_FOTOS).cantidad).toBe(0);
      expect((await cuenta(A).expect(200)).body).toMatchObject({ foto: null });
    });

    it('el mensaje de error no repite lo que traia el archivo', async () => {
      const secreto = 'contenido-que-no-debe-salir';
      const respuesta = await subir(A, new TextEncoder().encode(secreto), 'image/png').expect(400);

      expect(JSON.stringify(respuesta.body)).not.toContain(secreto);
    });
  });

  describe('sin sesion o sin cuenta', () => {
    it.each([
      ['PUT', 'put'],
      ['GET', 'get'],
      ['DELETE', 'delete'],
    ] as const)('%s sin token responde 401', async (_metodo, metodo) => {
      await request(app.getHttpServer())[metodo]('/api/cuenta/foto').expect(401);
    });

    it('con sesion pero sin cuenta responde 403 y no guarda nada', async () => {
      // Otra aplicacion, sin darse de alta.
      const sinAlta = await levantarAplicacion();

      try {
        await request(sinAlta.getHttpServer())
          .put('/api/cuenta/foto')
          .set(...comoUsuario(A))
          .set('Content-Type', 'image/png')
          .send(Buffer.from(PNG_REAL_DE_8_X_6))
          .expect(403);

        expect(sinAlta.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_FOTOS).cantidad).toBe(0);
      } finally {
        await sinAlta.close();
      }
    });
  });

  describe('la peticion previa del navegador (CORS)', () => {
    // El navegador, desde otro origen, pregunta antes de mandar un PUT con sesion
    // y con un tipo que no es de formulario. Si la API no contesta que si, la
    // foto no sube nunca y el sintoma es un error de red sin explicacion.
    const previa = (origen: string): request.Test =>
      request(app.getHttpServer())
        .options('/api/cuenta/foto')
        .set('Origin', origen)
        .set('Access-Control-Request-Method', 'PUT')
        .set('Access-Control-Request-Headers', 'authorization,content-type');

    it('deja pasar el PUT con sesion y con el tipo de la imagen, desde el origen de la aplicacion', async () => {
      const respuesta = await previa('http://localhost:5173').expect(204);

      expect(respuesta.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(respuesta.headers['access-control-allow-methods']).toContain('PUT');
      expect(respuesta.headers['access-control-allow-headers']?.toLowerCase()).toContain(
        'authorization',
      );
      expect(respuesta.headers['access-control-allow-headers']?.toLowerCase()).toContain(
        'content-type',
      );
    });

    it('tambien el DELETE', async () => {
      const respuesta = await request(app.getHttpServer())
        .options('/api/cuenta/foto')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'DELETE')
        .set('Access-Control-Request-Headers', 'authorization')
        .expect(204);

      expect(respuesta.headers['access-control-allow-methods']).toContain('DELETE');
    });

    it('desde otro origen, no', async () => {
      const respuesta = await previa('https://otro-sitio.example');

      expect(respuesta.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('cada persona solo ve y toca la suya', () => {
    it('B no ve la foto de A: ni siquiera sabe que existe', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);

      const respuesta = await pedir(B).expect(404);

      expect(respuesta.body).toMatchObject({ codigo: 'FOTO_NO_ENCONTRADA' });
      expect((await cuenta(B).expect(200)).body).toMatchObject({ foto: null });
    });

    it('cada una pide la suya', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);
      await subir(B, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      expect(new Uint8Array((await pedir(A).expect(200)).body as Buffer)).toEqual(
        PNG_REAL_DE_8_X_6,
      );
      expect(new Uint8Array((await pedir(B).expect(200)).body as Buffer)).toEqual(
        JPEG_REAL_DE_8_X_6,
      );
    });

    it('subir la propia no pisa la ajena', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);
      await subir(B, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);
      await subir(B, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      expect(new Uint8Array((await pedir(A).expect(200)).body as Buffer)).toEqual(
        PNG_REAL_DE_8_X_6,
      );
    });

    it('quitar la propia no quita la ajena', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);
      await quitar(B).expect(200);

      await pedir(A).expect(200);
    });

    it('no hay ruta con un identificador: pedir la de otra por la direccion no existe', async () => {
      await subir(B, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      const idDeB = SESIONES[B]?.id ?? '';

      await request(app.getHttpServer())
        .get(`/api/cuenta/foto/${idDeB}`)
        .set(...comoUsuario(A))
        .expect(404);
    });

    it('un identificador en la consulta se ignora: se devuelve la propia', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);
      await subir(B, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      const idDeB = SESIONES[B]?.id ?? '';
      const respuesta = await request(app.getHttpServer())
        .get(`/api/cuenta/foto?id=${idDeB}&persona=${idDeB}`)
        .set(...comoUsuario(A))
        .buffer(true)
        .parse(comoBytesOComoJson)
        .expect(200);

      expect(new Uint8Array(respuesta.body as Buffer)).toEqual(PNG_REAL_DE_8_X_6);
    });

    it('un identificador en el cuerpo de la foto tampoco cambia de quien es', async () => {
      await request(app.getHttpServer())
        .put(`/api/cuenta/foto?id=${SESIONES[B]?.id ?? ''}`)
        .set(...comoUsuario(A))
        .set('Content-Type', 'image/png')
        .send(Buffer.from(PNG_REAL_DE_8_X_6))
        .expect(200);

      await pedir(B).expect(404);
      await pedir(A).expect(200);
    });
  });

  describe('la exportacion y el borrado de la cuenta', () => {
    it('la exportacion lleva la foto, en base64, y la de nadie mas', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);
      await subir(B, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      const { body } = await request(app.getHttpServer())
        .get('/api/cuenta/exportacion')
        .set(...comoUsuario(A))
        .expect(200);
      const foto = (body as { foto: { tipo: string; contenidoBase64: string } }).foto;

      expect(foto.tipo).toBe('image/png');
      expect(new Uint8Array(Buffer.from(foto.contenidoBase64, 'base64'))).toEqual(
        PNG_REAL_DE_8_X_6,
      );
    });

    it('sin foto, la exportacion dice foto: null', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/api/cuenta/exportacion')
        .set(...comoUsuario(A))
        .expect(200);

      expect(body).toMatchObject({ foto: null });
    });

    it('borrar la cuenta borra tambien el archivo, y solo el suyo', async () => {
      await subir(A, PNG_REAL_DE_8_X_6, 'image/png').expect(200);
      await subir(B, JPEG_REAL_DE_8_X_6, 'image/jpeg').expect(200);

      const almacen = app.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_FOTOS);

      expect(almacen.cantidad).toBe(2);

      await request(app.getHttpServer())
        .delete('/api/cuenta')
        .set(...comoUsuario(A))
        .send({ confirmacion: 'BORRAR MI CUENTA' })
        .expect(204);

      expect(almacen.cantidad).toBe(1);
      await pedir(B).expect(200);
    });
  });
});
