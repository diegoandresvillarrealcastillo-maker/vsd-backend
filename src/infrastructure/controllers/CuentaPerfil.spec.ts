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

/** El perfil propio por HTTP: nombre, exportacion y borrado (SCRUM-75). */
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

describe('El perfil propio', () => {
  let app: NestExpressApplication;

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(servidor());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('el nombre', () => {
    it('se cambia por la ruta de preferencias', async () => {
      const respuesta = await request(servidor())
        .patch('/api/cuenta/preferencias')
        .set(...comoUsuario(A))
        .send({ nombre: '  Diego  ' })
        .expect(200);

      expect((respuesta.body as { nombre: string }).nombre).toBe('Diego');
    });

    it('un nombre vacio responde 400', async () => {
      const respuesta = await request(servidor())
        .patch('/api/cuenta/preferencias')
        .set(...comoUsuario(A))
        .send({ nombre: '   ' })
        .expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'NOMBRE_INVALIDO' });
    });
  });

  describe('GET /api/cuenta/exportacion', () => {
    it('devuelve los datos propios como archivo descargable', async () => {
      const respuesta = await request(servidor())
        .get('/api/cuenta/exportacion')
        .set(...comoUsuario(A))
        .expect(200);

      expect(respuesta.headers['content-disposition']).toContain('attachment');
      expect(respuesta.headers['cache-control']).toContain('no-store');
      expect(respuesta.body).toMatchObject({
        cuenta: { correo: SESIONES[A]?.correo },
        resultados: [],
        entradasDeDiario: [],
      });
    });

    it('no trae nada de otra persona', async () => {
      const respuesta = await request(servidor())
        .get('/api/cuenta/exportacion')
        .set(...comoUsuario(A))
        .expect(200);

      expect(JSON.stringify(respuesta.body)).not.toContain(SESIONES[B]?.correo);
    });

    it('sin token responde 401', async () => {
      await request(servidor()).get('/api/cuenta/exportacion').expect(401);
    });
  });

  describe('DELETE /api/cuenta', () => {
    it('sin la frase de confirmacion responde 400 y no borra nada', async () => {
      await request(servidor())
        .delete('/api/cuenta')
        .set(...comoUsuario(A))
        .send({})
        .expect(400);

      await request(servidor())
        .get('/api/cuenta')
        .set(...comoUsuario(A))
        .expect(200);
    });

    it('con una frase parecida tampoco', async () => {
      await request(servidor())
        .delete('/api/cuenta')
        .set(...comoUsuario(A))
        .send({ confirmacion: 'borrar mi cuenta' })
        .expect(400);
    });

    it('con la frase exacta borra la cuenta, y despues ya no existe', async () => {
      await request(servidor())
        .delete('/api/cuenta')
        .set(...comoUsuario(A))
        .send({ confirmacion: 'BORRAR MI CUENTA' })
        .expect(204);

      await request(servidor())
        .get('/api/cuenta')
        .set(...comoUsuario(A))
        .expect(403);
    });

    it('la cuenta de otra persona sigue intacta', async () => {
      const respuesta = await request(servidor())
        .get('/api/cuenta')
        .set(...comoUsuario(B))
        .expect(200);

      expect((respuesta.body as { correo: string }).correo).toBe(SESIONES[B]?.correo);
    });

    it('sin token responde 401', async () => {
      await request(servidor())
        .delete('/api/cuenta')
        .send({ confirmacion: 'BORRAR MI CUENTA' })
        .expect(401);
    });
  });
});
