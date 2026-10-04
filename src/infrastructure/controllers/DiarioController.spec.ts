import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { documentoCon } from '../../pruebas/diarioDePrueba.js';
import { VerificadorFalso, comoUsuario, darDeAlta } from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

/**
 * `/api/diario` por HTTP, con el diario en memoria (SCRUM-95).
 *
 * La hora para editar la hace cumplir la base; eso se prueba contra
 * PostgreSQL en `PrismaDiarioRepository.integracion.spec.ts`. Aqui se prueba
 * lo que ve quien llama: las respuestas, los codigos y que nada de lo escrito
 * salga por el registro.
 */
const A = 'token-de-A';
const B = 'token-de-B';

let contador = 0;
function operacion(): string {
  contador += 1;

  return '95959595-0000-4000-8000-' + String(contador).padStart(12, '0');
}

function cuerpoDe(respuesta: request.Response): Record<string, unknown> {
  return respuesta.body as Record<string, unknown>;
}

async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  // Comportamiento HTTP con el diario en memoria; la base va en su propia suite.
  delete process.env.DATABASE_URL;

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

describe('/api/diario', () => {
  let app: NestExpressApplication;

  function escribir(token: string, cuerpo: Record<string, unknown>): request.Test {
    return request(app.getHttpServer())
      .post('/api/diario')
      .set(...comoUsuario(token))
      .send(cuerpo);
  }

  function editar(token: string, id: string, cuerpo: Record<string, unknown>): request.Test {
    return request(app.getHttpServer())
      .patch(`/api/diario/${id}`)
      .set(...comoUsuario(token))
      .send(cuerpo);
  }

  function consultar(token: string, consulta = ''): request.Test {
    return request(app.getHttpServer())
      .get(`/api/diario${consulta}`)
      .set(...comoUsuario(token));
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST', () => {
    it('escribe una anotacion de hoy y devuelve todo lo que el cliente necesita', async () => {
      const respuesta = await escribir(A, {
        clientOperationId: operacion(),
        titulo: 'Sabado',
        contenido: documentoCon('Sali a caminar'),
      }).expect(201);

      const cuerpo = cuerpoDe(respuesta);

      expect(cuerpo).toMatchObject({
        titulo: 'Sabado',
        contenido: documentoCon('Sali a caminar'),
        adjuntos: [],
        version: 1,
        sugiereAcompanamiento: false,
        lineasDeAtencion: [],
      });
      expect(cuerpo['dia']).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(
        Date.parse(String(cuerpo['editableHasta'])) - Date.parse(String(cuerpo['creadaEn'])),
      ).toBe(60 * 60_000);
      expect(respuesta.headers['cache-control']).toBe('no-store');
    });

    it('un reintento con la misma operacion devuelve la misma anotacion', async () => {
      const cuerpo = { clientOperationId: operacion(), contenido: documentoCon('Una sola vez') };

      const primera = await escribir(A, cuerpo).expect(201);
      const segunda = await escribir(A, cuerpo).expect(201);

      expect(cuerpoDe(segunda)['id']).toBe(cuerpoDe(primera)['id']);
    });

    it('en un dia pasado si; en uno futuro, 400 DIA_EN_EL_FUTURO', async () => {
      await escribir(A, {
        clientOperationId: operacion(),
        dia: '2026-01-15',
        contenido: documentoCon('Algo de enero'),
      }).expect(201);

      const futura = await escribir(A, {
        clientOperationId: operacion(),
        dia: '2999-01-01',
        contenido: documentoCon('Algo del futuro'),
      }).expect(400);

      expect(cuerpoDe(futura)).toMatchObject({ codigo: 'DIA_EN_EL_FUTURO' });
    });

    it('HTML en lugar de un documento se rechaza', async () => {
      await escribir(A, {
        clientOperationId: operacion(),
        contenido: '<p>hola</p>',
      }).expect(400);

      const conHtml = await escribir(A, {
        clientOperationId: operacion(),
        contenido: { type: 'doc', content: [{ type: 'paragraph', html: '<b>hola</b>' }] },
      }).expect(400);

      expect(cuerpoDe(conHtml)).toMatchObject({ codigo: 'ANOTACION_INVALIDA' });
    });

    it('un campo que no existe se rechaza, como en el resto de la API', async () => {
      await escribir(A, {
        clientOperationId: operacion(),
        contenido: documentoCon('x'),
        idUsuario: '22222222-2222-4222-9222-222222222222',
      }).expect(400);
    });

    it('una senal de riesgo trae las lineas, y el texto no queda en ningun registro', async () => {
      const anotado: string[] = [];

      for (const nivel of ['log', 'warn', 'error', 'debug', 'verbose'] as const) {
        vi.spyOn(Logger.prototype, nivel).mockImplementation((...partes: unknown[]) => {
          anotado.push(partes.map(String).join(' '));
        });
      }

      const respuesta = await escribir(A, {
        clientOperationId: operacion(),
        titulo: 'Martes',
        contenido: documentoCon('Hoy pense que ya no puedo mas'),
      }).expect(201);

      const cuerpo = cuerpoDe(respuesta) as {
        sugiereAcompanamiento: boolean;
        lineasDeAtencion: { cobertura?: string }[];
      };

      expect(cuerpo.sugiereAcompanamiento).toBe(true);
      expect(cuerpo.lineasDeAtencion.length).toBeGreaterThan(0);
      expect(cuerpo.lineasDeAtencion[0]?.cobertura).toBe('nacional');

      // El registro si anoto la peticion: la prueba escucha donde de verdad
      // se escribe, y aun asi el texto no aparece.
      await vi.waitFor(() => expect(anotado.join('\n')).toContain('POST /api/diario 201'));
      expect(anotado.join('\n')).not.toContain('ya no puedo');
    });

    it('un error de validacion no repite lo escrito, ni en la respuesta ni en el registro', async () => {
      const anotado: string[] = [];

      for (const nivel of ['log', 'warn', 'error', 'debug', 'verbose'] as const) {
        vi.spyOn(Logger.prototype, nivel).mockImplementation((...partes: unknown[]) => {
          anotado.push(partes.map(String).join(' '));
        });
      }

      const respuesta = await escribir(A, {
        clientOperationId: operacion(),
        contenido: {
          type: 'doc',
          content: [{ type: 'paragraph', text: 'secreto que nadie deberia leer' }],
        },
      }).expect(400);

      await vi.waitFor(() => expect(anotado.join('\n')).toContain('POST /api/diario 400'));
      expect(JSON.stringify(respuesta.body)).not.toContain('secreto');
      expect(anotado.join('\n')).not.toContain('secreto');
    });
  });

  describe('GET', () => {
    it('trae las propias de un rango, y nunca las de otra persona', async () => {
      await escribir(A, {
        clientOperationId: operacion(),
        dia: '2026-02-10',
        contenido: documentoCon('De A en febrero'),
      }).expect(201);

      const deA = await consultar(A, '?desde=2026-02-01&hasta=2026-02-28').expect(200);
      const deB = await consultar(B, '?desde=2026-02-01&hasta=2026-02-28').expect(200);

      expect((deA.body as unknown[]).length).toBe(1);
      expect(deB.body).toEqual([]);
      expect(deA.headers['cache-control']).toBe('no-store');
    });

    it('un rango al reves responde 400 RANGO_DE_DIAS_INVALIDO', async () => {
      const respuesta = await consultar(A, '?desde=2026-02-28&hasta=2026-02-01').expect(400);

      expect(cuerpoDe(respuesta)).toMatchObject({ codigo: 'RANGO_DE_DIAS_INVALIDO' });
    });

    it('un dia mal escrito responde 400', async () => {
      await consultar(A, '?desde=ayer').expect(400);
    });
  });

  describe('PATCH', () => {
    async function nueva(token = A): Promise<string> {
      const respuesta = await escribir(token, {
        clientOperationId: operacion(),
        titulo: 'Antes',
        contenido: documentoCon('Primera version'),
      }).expect(201);

      return String(cuerpoDe(respuesta)['id']);
    }

    it('dentro de la hora corrige y sube la version', async () => {
      const id = await nueva();

      const respuesta = await editar(A, id, {
        version: 1,
        contenido: documentoCon('Segunda version'),
      }).expect(200);

      expect(cuerpoDe(respuesta)).toMatchObject({
        id,
        titulo: 'Antes',
        version: 2,
        contenido: documentoCon('Segunda version'),
      });
    });

    it('con una version vieja responde 409 VERSION_DESACTUALIZADA', async () => {
      const id = await nueva();

      await editar(A, id, { version: 1, titulo: 'Desde el celular' }).expect(200);
      const respuesta = await editar(A, id, { version: 1, titulo: 'Desde el computador' }).expect(
        409,
      );

      expect(cuerpoDe(respuesta)).toMatchObject({ codigo: 'VERSION_DESACTUALIZADA' });
    });

    it('pasada la hora responde 409 EDICION_FUERA_DE_PLAZO', async () => {
      const id = await nueva();

      // Solo se mueve la fecha; los temporizadores y la red siguen reales.
      vi.useFakeTimers({ toFake: ['Date'], now: Date.now() + 61 * 60_000 });

      const respuesta = await editar(A, id, {
        version: 1,
        contenido: documentoCon('Tarde'),
      }).expect(409);

      expect(cuerpoDe(respuesta)).toMatchObject({ codigo: 'EDICION_FUERA_DE_PLAZO' });
    });

    it('la anotacion de otra persona responde 404, igual que una que no existe', async () => {
      const id = await nueva(A);

      const ajena = await editar(B, id, { version: 1, titulo: 'Intento' }).expect(404);
      const inexistente = await editar(B, '95959595-ffff-4fff-8fff-ffffffffffff', {
        version: 1,
        titulo: 'Intento',
      }).expect(404);

      expect(cuerpoDe(ajena)).toEqual(cuerpoDe(inexistente));
      expect(cuerpoDe(ajena)).toMatchObject({ codigo: 'ANOTACION_NO_ENCONTRADA' });
    });

    it('sin version responde 400', async () => {
      const id = await nueva();

      await editar(A, id, { titulo: 'Sin version' }).expect(400);
    });
  });

  describe('El tamano del cuerpo', () => {
    function documentoDe(caracteres: number): Record<string, unknown> {
      return documentoCon('a'.repeat(caracteres));
    }

    it('el diario acepta cuerpos de mas de 100 KB, por los diagramas', async () => {
      await escribir(A, {
        clientOperationId: operacion(),
        contenido: documentoDe(150_000),
      }).expect(201);
    });

    it('pero no de mas de 1 MB', async () => {
      await escribir(A, {
        clientOperationId: operacion(),
        contenido: documentoDe(1_100_000),
      }).expect(413);
    });

    it('un JSON mal formado responde 400 y no cita lo escrito en ningun registro', async () => {
      // El mensaje del error de JSON.parse cita un trozo de la entrada. NestJS
      // lo convierte en un 400 para quien lo envio; lo que se comprueba aqui
      // es que no termine en el registro del servidor.
      const anotado: string[] = [];

      for (const nivel of ['log', 'warn', 'error', 'debug', 'verbose'] as const) {
        vi.spyOn(Logger.prototype, nivel).mockImplementation((...partes: unknown[]) => {
          anotado.push(partes.map(String).join(' '));
        });
      }

      const respuesta = await request(app.getHttpServer())
        .post('/api/diario')
        .set(...comoUsuario(A))
        .set('Content-Type', 'application/json')
        .send('lo que escribi y nadie debe leer')
        .expect(400);

      expect(respuesta.status).toBe(400);
      // Falla antes de llegar a la ruta, asi que ni el registro de peticiones
      // la ve: no se anota nada, y menos el texto.
      expect(anotado.join('\n')).not.toContain('nadie debe leer');
    });

    it('el resto de la API sigue en los 100 KB', async () => {
      await request(app.getHttpServer())
        .post('/api/resultados')
        .set(...comoUsuario(A))
        .send({ relleno: 'a'.repeat(150_000) })
        .expect(413);
    });
  });
});
