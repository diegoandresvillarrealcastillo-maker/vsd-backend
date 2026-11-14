import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PESO_MAXIMO_DEL_SVG } from '../../domain/model/svg/SvgDeMascota.js';
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
import { ALMACEN_DE_FOTOS, ALMACEN_DE_MASCOTAS, CONFIGURACION } from '../config/tokens.js';

const A = 'token-de-A';
const B = 'token-de-B';
const SVG = 'image/svg+xml';

const CABECERA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
const svg = (interior: string, cabecera = CABECERA): string => `${cabecera}${interior}</svg>`;

const DIBUJO = svg('<circle cx="50" cy="50" r="40" fill="#ff0000"/>');
const DIBUJO_LIMPIO =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"><circle fill="#ff0000" cx="50" cy="50" r="40"/></svg>';
const OTRO_DIBUJO = svg('<rect width="30" height="30" fill="#00ff00"/>');

/**
 * La mascota propia por HTTP, con la tuberia de verdad: el lector de cuerpos,
 * el guardia, el caso de uso, el saneador y el filtro de errores. Solo cambian
 * dos cosas: la firma del token y el almacen, que al no haber clave de servicio
 * es el de memoria.
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

/** Lee la respuesta como texto si es un SVG, y como JSON si es un error. */
function comoTextoOComoJson(
  res: request.Response,
  hecho: (error: Error | null, cuerpo: unknown) => void,
): void {
  const trozos: Buffer[] = [];

  res.on('data', (trozo: Buffer) => trozos.push(trozo));
  res.on('end', () => {
    const todo = Buffer.concat(trozos).toString('utf8');
    const tipo = String(res.headers['content-type'] ?? '');

    hecho(null, tipo.includes('json') ? JSON.parse(todo) : todo);
  });
}

describe('La mascota propia por HTTP (SCRUM-122)', () => {
  let app: NestExpressApplication;

  const subir = (token: string, contenido: string, tipo = SVG): request.Test =>
    request(app.getHttpServer())
      .put('/api/cuenta/mascota-propia')
      .set(...comoUsuario(token))
      .set('Content-Type', tipo)
      .send(Buffer.from(contenido, 'utf8'));

  const pedir = (token: string): request.Test =>
    request(app.getHttpServer())
      .get('/api/cuenta/mascota-propia')
      .set(...comoUsuario(token))
      .buffer(true)
      .parse(comoTextoOComoJson);

  const quitar = (token: string): request.Test =>
    request(app.getHttpServer())
      .delete('/api/cuenta/mascota-propia')
      .set(...comoUsuario(token));

  const cuenta = (token: string): request.Test =>
    request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(token));

  const preferencias = (token: string, cuerpo: object): request.Test =>
    request(app.getHttpServer())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario(token))
      .send(cuerpo);

  const almacenDeMascotas = (): AlmacenPersonalEnMemoria =>
    app.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_MASCOTAS);

  beforeEach(async () => {
    app = await levantarAplicacion();
    await darDeAlta(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  describe('subirla y pedirla', () => {
    it('guarda la mascota, la cuenta lo dice y la devuelve', async () => {
      const subida = await subir(A, DIBUJO).expect(200);

      expect(
        (subida.body as { mascotaPropia: { actualizadaEl: string } }).mascotaPropia.actualizadaEl,
      ).toMatch(/^\d{4}-\d{2}-\d{2}T/);

      const respuesta = await pedir(A).expect(200);

      expect(respuesta.headers['content-type']).toContain('image/svg+xml');
      expect(respuesta.body).toBe(DIBUJO_LIMPIO);
    });

    it('lo que devuelve NO es lo que subio la persona: es el SVG reescrito', async () => {
      const original = [
        '<?xml version="1.0"?>',
        '<!-- comentario -->',
        svg(
          '<metadata>datos</metadata><title>Mi mascota</title><circle cx="5" cy="5" r="4" style="fill:red" class="uno"/>',
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="9999">',
        ),
      ].join('\n');

      await subir(A, original).expect(200);

      const { body } = await pedir(A).expect(200);

      expect(body).not.toBe(original);
      expect(body).toBe(
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10"><circle fill="red" cx="5" cy="5" r="4"/></svg>',
      );
    });

    it('el tipo con parametros y en mayusculas tambien vale', async () => {
      await subir(A, DIBUJO, 'IMAGE/SVG+XML; charset=utf-8').expect(200);
    });

    it('un identificador con tildes o enes no se admite: el saneador solo acepta ASCII', async () => {
      await subir(A, svg('<g id="ñandú"/>')).expect(400);
    });

    it('no se guarda en ninguna cache: es de una persona', async () => {
      await subir(A, DIBUJO).expect(200);

      expect((await pedir(A).expect(200)).headers['cache-control']).toBe('no-store');
    });

    it('si alguien abriera la respuesta suelta, no ejecuta ni carga nada: lleva una politica que la deja inerte', async () => {
      await subir(A, DIBUJO).expect(200);

      const { headers } = await pedir(A).expect(200);

      expect(headers['content-security-policy']).toBe(
        "default-src 'none'; style-src 'none'; sandbox",
      );
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['content-disposition']).toContain('attachment');
    });

    it('subir otra reemplaza la anterior', async () => {
      await subir(A, DIBUJO).expect(200);
      await subir(A, OTRO_DIBUJO).expect(200);

      expect((await pedir(A).expect(200)).body).toContain('<rect');
      expect(almacenDeMascotas().cantidad).toBe(1);
    });

    it('sin mascota propia, pedirla responde 404 con su codigo', async () => {
      const respuesta = await request(app.getHttpServer())
        .get('/api/cuenta/mascota-propia')
        .set(...comoUsuario(A))
        .expect(404);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_PROPIA_NO_ENCONTRADA' });
    });
  });

  describe('la cuenta cuenta lo de la mascota propia', () => {
    it('sin ella, dice mascotaPropia: null', async () => {
      expect((await cuenta(A).expect(200)).body).toMatchObject({ mascotaPropia: null });
    });

    it('con ella, dice desde cuando y nunca el dibujo', async () => {
      await subir(A, DIBUJO).expect(200);

      const { body } = await cuenta(A).expect(200);

      expect(
        (body as { mascotaPropia: { actualizadaEl: string } }).mascotaPropia.actualizadaEl,
      ).toMatch(/^\d{4}-/);
      expect(Object.keys((body as { mascotaPropia: object }).mascotaPropia)).toEqual([
        'actualizadaEl',
      ]);
      expect(JSON.stringify(body)).not.toContain('<svg');
    });

    it('cambiar las preferencias no la quita, ni la foto la toca', async () => {
      await subir(A, DIBUJO).expect(200);
      await preferencias(A, { nombre: 'Ana' }).expect(200);

      expect((await cuenta(A).expect(200)).body).not.toMatchObject({ mascotaPropia: null });
      await pedir(A).expect(200);
    });
  });

  describe('elegirla como mascota', () => {
    it('sin haberla subido, no se puede: responde 400 con el codigo de siempre', async () => {
      const respuesta = await preferencias(A, {
        mascota: { forma: 'propia', nombre: 'Luma' },
      }).expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_INVALIDA' });
      expect((await cuenta(A).expect(200)).body).toMatchObject({ mascota: null });
    });

    it('subida, se elige y la cuenta lo dice', async () => {
      await subir(A, DIBUJO).expect(200);

      const respuesta = await preferencias(A, {
        mascota: { forma: 'propia', nombre: 'Luma' },
      }).expect(200);

      expect(respuesta.body).toMatchObject({
        mascota: { forma: 'propia', nombre: 'Luma' },
        mascotaPropia: { actualizadaEl: expect.any(String) as string },
      });
    });

    it('lo que sube B no deja que A la elija', async () => {
      await subir(B, DIBUJO).expect(200);

      await preferencias(A, { mascota: { forma: 'propia', nombre: 'Luma' } }).expect(400);
    });

    it('al quitarla, quien la tenia elegida vuelve al personaje de siempre con su nombre', async () => {
      await subir(A, DIBUJO).expect(200);
      await preferencias(A, { mascota: { forma: 'propia', nombre: 'Luma' } }).expect(200);

      const respuesta = await quitar(A).expect(200);

      expect(respuesta.body).toMatchObject({
        mascota: { forma: 'fungito', nombre: 'Luma' },
        mascotaPropia: null,
      });
      expect((await cuenta(A).expect(200)).body).toMatchObject({
        mascota: { forma: 'fungito', nombre: 'Luma' },
      });
    });

    it('al quitarla, quien tiene elegida otra no cambia de mascota', async () => {
      await subir(A, DIBUJO).expect(200);
      await preferencias(A, { mascota: { forma: 'sparky', nombre: 'Chispa' } }).expect(200);

      const respuesta = await quitar(A).expect(200);

      expect(respuesta.body).toMatchObject({ mascota: { forma: 'sparky', nombre: 'Chispa' } });
    });
  });

  describe('quitarla', () => {
    it('borra el archivo y la cuenta queda sin mascota propia', async () => {
      await subir(A, DIBUJO).expect(200);

      const respuesta = await quitar(A).expect(200);

      expect(respuesta.body).toMatchObject({ mascotaPropia: null });
      await pedir(A).expect(404);
      expect(almacenDeMascotas().cantidad).toBe(0);
    });

    it('quitar la que no hay tambien responde 200', async () => {
      await quitar(A).expect(200);
      await quitar(A).expect(200);
    });
  });

  describe('lo que no se acepta: el criterio de aceptacion de SCRUM-122', () => {
    it.each([
      ['un script', svg('<script>alert(1)</script>'), 'MASCOTA_SVG_PELIGROSO'],
      [
        'onload en la raiz',
        svg('<g/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" onload="alert(1)">'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      ['onclick en una forma', svg('<rect onclick="alert(1)"/>'), 'MASCOTA_SVG_PELIGROSO'],
      [
        'un enlace con javascript',
        svg('<a href="javascript:alert(1)"><rect/></a>'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      [
        'una referencia a otro sitio',
        svg('<use href="https://ejemplo.invalid/x.svg#a"/>'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      [
        'un fill que apunta a otro sitio',
        svg('<rect fill="url(https://ejemplo.invalid/x.svg#a)"/>'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      [
        'foreignObject con un iframe',
        svg('<foreignObject><iframe src="x"/></foreignObject>'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      [
        'una animacion que cambia un enlace',
        svg('<a href="#x"><animate attributeName="href" values="javascript:alert(1)"/></a>'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      [
        'un DOCTYPE con entidades',
        '<!DOCTYPE svg [<!ENTITY a "b">]>' + svg('<g id="&a;"/>'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      [
        'un DOCTYPE que lee un archivo (XXE)',
        '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + svg('<g id="&x;"/>'),
        'MASCOTA_SVG_PELIGROSO',
      ],
      ['un texto', svg('<text>hola</text>'), 'MASCOTA_SVG_NO_ADMITIDO'],
      ['una hoja de estilos', svg('<style>.a{fill:red}</style>'), 'MASCOTA_SVG_NO_ADMITIDO'],
      ['un filtro', svg('<filter id="f"/>'), 'MASCOTA_SVG_NO_ADMITIDO'],
      ['un archivo que no es un SVG', '<html><body>hola</body></html>', 'MASCOTA_SVG_NO_ES_UN_SVG'],
      ['un texto cualquiera', 'esto no es un svg', 'MASCOTA_SVG_NO_ES_UN_SVG'],
    ])('%s se rechaza con 400 y su codigo', async (_cual, contenido, codigo) => {
      const respuesta = await subir(A, contenido).expect(400);

      expect(respuesta.body).toMatchObject({ codigo });
      await pedir(A).expect(404);
      expect(almacenDeMascotas().cantidad).toBe(0);
    });

    it.each([
      ['un PNG', 'image/png', 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
      ['un JPEG', 'image/jpeg', 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
      ['un HTML', 'text/html', 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
      ['un XML', 'application/xml', 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
      ['un texto xml', 'text/xml', 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
      ['un archivo cualquiera', 'application/octet-stream', 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
    ])('con el tipo de %s se rechaza con 415', async (_cual, tipo, codigo) => {
      const respuesta = await subir(A, DIBUJO, tipo).expect(415);

      expect(respuesta.body).toMatchObject({ codigo });
    });

    it('un JSON no es un SVG, y no se lee como cuerpo de la mascota', async () => {
      const respuesta = await request(app.getHttpServer())
        .put('/api/cuenta/mascota-propia')
        .set(...comoUsuario(A))
        .send({ mascota: 'hola' })
        .expect(415);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_SVG_TIPO_NO_PERMITIDO' });
    });

    it('un cuerpo vacio se rechaza con 400', async () => {
      const respuesta = await subir(A, '').expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_SVG_NO_ES_UN_SVG' });
    });

    it('un SVG de mas de 100 KB se rechaza con 413 y su codigo', async () => {
      const grande = DIBUJO + '\n'.repeat(PESO_MAXIMO_DEL_SVG + 1000 - DIBUJO.length);
      const respuesta = await subir(A, grande).expect(413);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_SVG_DEMASIADO_PESADO' });
      expect((respuesta.body as { mensaje: string }).mensaje).toContain('100 KB');
    });

    it('un cuerpo enorme se corta sin leerlo entero, con el mensaje generico', async () => {
      const respuesta = await subir(A, DIBUJO + ' '.repeat(300_000)).expect(413);

      expect(respuesta.body).toMatchObject({ codigo: 'CUERPO_DEMASIADO_GRANDE' });
    });

    it('un SVG demasiado complejo se rechaza con 400', async () => {
      const respuesta = await subir(A, svg('<g/>'.repeat(2500))).expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_SVG_DEMASIADO_COMPLEJO' });
    });

    it('lo rechazado no deja nada guardado ni marcado', async () => {
      await subir(A, svg('<script/>')).expect(400);
      await subir(A, DIBUJO, 'image/png').expect(415);
      await subir(A, '').expect(400);

      expect(almacenDeMascotas().cantidad).toBe(0);
      expect((await cuenta(A).expect(200)).body).toMatchObject({ mascotaPropia: null });
    });

    it('el mensaje de error no repite lo que traia el archivo', async () => {
      const secreto = 'contenido-que-no-debe-salir';
      const respuesta = await subir(A, svg(`<${secreto}/>`)).expect(400);

      expect(JSON.stringify(respuesta.body)).not.toContain(secreto);
    });

    it('un SVG rechazado no pisa el que ya estaba', async () => {
      await subir(A, DIBUJO).expect(200);
      await subir(A, svg('<script/>')).expect(400);

      expect((await pedir(A).expect(200)).body).toBe(DIBUJO_LIMPIO);
    });
  });

  describe('sin sesion o sin cuenta', () => {
    it.each([
      ['PUT', 'put'],
      ['GET', 'get'],
      ['DELETE', 'delete'],
    ] as const)('%s sin token responde 401', async (_metodo, metodo) => {
      await request(app.getHttpServer())[metodo]('/api/cuenta/mascota-propia').expect(401);
    });

    it('con sesion pero sin cuenta responde 403 y no guarda nada', async () => {
      const sinAlta = await levantarAplicacion();

      try {
        await request(sinAlta.getHttpServer())
          .put('/api/cuenta/mascota-propia')
          .set(...comoUsuario(A))
          .set('Content-Type', SVG)
          .send(Buffer.from(DIBUJO))
          .expect(403);

        expect(sinAlta.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_MASCOTAS).cantidad).toBe(0);
      } finally {
        await sinAlta.close();
      }
    });
  });

  describe('la peticion previa del navegador (CORS)', () => {
    it('deja pasar el PUT con sesion y con el tipo del SVG, desde el origen de la aplicacion', async () => {
      const respuesta = await request(app.getHttpServer())
        .options('/api/cuenta/mascota-propia')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'PUT')
        .set('Access-Control-Request-Headers', 'authorization,content-type')
        .expect(204);

      expect(respuesta.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(respuesta.headers['access-control-allow-methods']).toContain('PUT');
    });
  });

  describe('cada persona solo ve y toca la suya', () => {
    it('B no ve la de A: ni siquiera sabe que existe', async () => {
      await subir(A, DIBUJO).expect(200);

      const respuesta = await pedir(B).expect(404);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_PROPIA_NO_ENCONTRADA' });
      expect((await cuenta(B).expect(200)).body).toMatchObject({ mascotaPropia: null });
    });

    it('cada una pide la suya', async () => {
      await subir(A, DIBUJO).expect(200);
      await subir(B, OTRO_DIBUJO).expect(200);

      expect((await pedir(A).expect(200)).body).toContain('<circle');
      expect((await pedir(B).expect(200)).body).toContain('<rect');
    });

    it('quitar la propia no quita la ajena', async () => {
      await subir(A, DIBUJO).expect(200);
      await quitar(B).expect(200);

      await pedir(A).expect(200);
    });

    it('no hay ruta con un identificador: pedir la de otra por la direccion no existe', async () => {
      await subir(B, OTRO_DIBUJO).expect(200);

      await request(app.getHttpServer())
        .get(`/api/cuenta/mascota-propia/${SESIONES[B]?.id ?? ''}`)
        .set(...comoUsuario(A))
        .expect(404);
    });

    it('un identificador en la consulta se ignora: se devuelve la propia', async () => {
      await subir(A, DIBUJO).expect(200);
      await subir(B, OTRO_DIBUJO).expect(200);

      const idDeB = SESIONES[B]?.id ?? '';
      const respuesta = await request(app.getHttpServer())
        .get(`/api/cuenta/mascota-propia?id=${idDeB}&persona=${idDeB}`)
        .set(...comoUsuario(A))
        .buffer(true)
        .parse(comoTextoOComoJson)
        .expect(200);

      expect(respuesta.body).toContain('<circle');
    });
  });

  describe('la foto y la mascota propia son cosas distintas', () => {
    const PNG = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAIAAABxZ0isAAAAFUlEQVR42mM8UWHDgA0wMeAA9JAAAOBWAYhnDE3RAAAAAElFTkSuQmCC',
      'base64',
    );

    it('subir una no toca la otra, ni sus almacenes', async () => {
      await request(app.getHttpServer())
        .put('/api/cuenta/foto')
        .set(...comoUsuario(A))
        .set('Content-Type', 'image/png')
        .send(PNG)
        .expect(200);
      await subir(A, DIBUJO).expect(200);

      expect(app.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_FOTOS).cantidad).toBe(1);
      expect(almacenDeMascotas().cantidad).toBe(1);

      await quitar(A).expect(200);

      expect(app.get<AlmacenPersonalEnMemoria>(ALMACEN_DE_FOTOS).cantidad).toBe(1);
      expect((await cuenta(A).expect(200)).body).toMatchObject({
        foto: { actualizadaEl: expect.any(String) as string },
        mascotaPropia: null,
      });
    });

    it('un SVG no se acepta como foto, y un PNG no se acepta como mascota propia', async () => {
      await request(app.getHttpServer())
        .put('/api/cuenta/foto')
        .set(...comoUsuario(A))
        .set('Content-Type', SVG)
        .send(Buffer.from(DIBUJO))
        .expect(415);
      await subir(A, 'x', 'image/png').expect(415);
    });
  });

  describe('la exportacion y el borrado de la cuenta', () => {
    it('la exportacion lleva el SVG saneado, como texto, y el de nadie mas', async () => {
      await subir(A, DIBUJO).expect(200);
      await subir(B, OTRO_DIBUJO).expect(200);

      const { body } = await request(app.getHttpServer())
        .get('/api/cuenta/exportacion')
        .set(...comoUsuario(A))
        .expect(200);
      const mascota = (body as { mascotaPropia: { tipo: string; contenido: string } })
        .mascotaPropia;

      expect(mascota.tipo).toBe(SVG);
      expect(mascota.contenido).toBe(DIBUJO_LIMPIO);
    });

    it('sin mascota propia, la exportacion dice mascotaPropia: null', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/api/cuenta/exportacion')
        .set(...comoUsuario(A))
        .expect(200);

      expect(body).toMatchObject({ mascotaPropia: null });
    });

    it('borrar la cuenta borra tambien el archivo, y solo el suyo', async () => {
      await subir(A, DIBUJO).expect(200);
      await subir(B, OTRO_DIBUJO).expect(200);

      expect(almacenDeMascotas().cantidad).toBe(2);

      await request(app.getHttpServer())
        .delete('/api/cuenta')
        .set(...comoUsuario(A))
        .send({ confirmacion: 'BORRAR MI CUENTA' })
        .expect(204);

      expect(almacenDeMascotas().cantidad).toBe(1);
      await pedir(B).expect(200);
    });
  });
});
