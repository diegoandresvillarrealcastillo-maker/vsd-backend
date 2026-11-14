import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  REGISTRO_DE_PRUEBA,
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

    it('con la frase exacta da de baja la cuenta, y despues ya no existe', async () => {
      await request(servidor())
        .delete('/api/cuenta')
        .set(...comoUsuario(A))
        .send({ confirmacion: 'BORRAR MI CUENTA' })
        .expect(204);

      // 401 y no 403 (SCRUM-190): no falta completar un alta, falta una sesion que sirva. El
      // cliente la cierra al ver un 401, y asi terminan las de los demas dispositivos.
      const respuesta = await request(servidor())
        .get('/api/cuenta')
        .set(...comoUsuario(A))
        .expect(401);

      expect(respuesta.body).toMatchObject({ codigo: 'CUENTA_INACTIVA' });
    });

    describe('despues de dar de baja la cuenta (SCRUM-190, ADR 0026)', () => {
      // Cada prueba con su propia aplicacion: la cuenta A se da de baja y no puede repetirse.
      let appDeBaja: NestExpressApplication;

      const servidorDeBaja = () => appDeBaja.getHttpServer() as Parameters<typeof request>[0];

      beforeEach(async () => {
        appDeBaja = await levantarAplicacion();
        await darDeAlta(servidorDeBaja());
      });

      afterEach(async () => {
        await appDeBaja.close();
      });

      async function darDeBajaA(): Promise<void> {
        await request(servidorDeBaja())
          .delete('/api/cuenta')
          .set(...comoUsuario(A))
          .send({ confirmacion: 'BORRAR MI CUENTA' })
          .expect(204);
      }

      it('el mismo token no la resucita: el alta lo rechaza y no crea nada', async () => {
        await darDeBajaA();

        const respuesta = await request(servidorDeBaja())
          .post('/api/cuenta')
          .set(...comoUsuario(A))
          .send(REGISTRO_DE_PRUEBA)
          .expect(401);

        expect(respuesta.body).toMatchObject({ codigo: 'CUENTA_INACTIVA' });

        await request(servidorDeBaja())
          .get('/api/cuenta')
          .set(...comoUsuario(A))
          .expect(401);
      });

      it('tampoco puede exportar ni escribir nada con ese token', async () => {
        await darDeBajaA();

        await request(servidorDeBaja())
          .get('/api/cuenta/exportacion')
          .set(...comoUsuario(A))
          .expect(401);
        await request(servidorDeBaja())
          .get('/api/diario')
          .set(...comoUsuario(A))
          .expect(401);
      });

      it('la respuesta no ensena nada de la cuenta ni dice que existio', async () => {
        await darDeBajaA();

        const respuesta = await request(servidorDeBaja())
          .get('/api/cuenta')
          .set(...comoUsuario(A))
          .expect(401);
        const texto = JSON.stringify(respuesta.body);

        expect(texto).not.toContain(SESIONES[A]?.correo);
        expect(texto).not.toContain(SESIONES[A]?.id);
      });

      it('la misma persona puede volver a registrarse con el mismo correo', async () => {
        await darDeBajaA();

        // Una identidad nueva en el proveedor: otro identificador, el mismo correo.
        const nuevo = 'token-nuevo-de-A';

        SESIONES[nuevo] = {
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          correo: SESIONES[A]?.correo ?? '',
        };

        try {
          const respuesta = await request(servidorDeBaja())
            .post('/api/cuenta')
            .set(...comoUsuario(nuevo))
            .send(REGISTRO_DE_PRUEBA)
            .expect(200);

          expect(respuesta.body).toMatchObject({ correo: SESIONES[A]?.correo });
          // Es una cuenta nueva y vacia, con otro identificador.
          expect((respuesta.body as { id: string }).id).not.toBe(SESIONES[A]?.id);
        } finally {
          Reflect.deleteProperty(SESIONES, nuevo);
        }
      });

      it('lo de la otra persona sigue entero', async () => {
        await darDeBajaA();

        await request(servidorDeBaja())
          .get('/api/cuenta')
          .set(...comoUsuario(B))
          .expect(200);
      });

      it('darla de baja otra vez con el mismo token no destruye nada ni deja una cuenta nueva', async () => {
        await darDeBajaA();

        // Con la cuenta ya dada de baja, el token no pasa la guardia: 401, no 204 ni 500.
        await request(servidorDeBaja())
          .delete('/api/cuenta')
          .set(...comoUsuario(A))
          .send({ confirmacion: 'BORRAR MI CUENTA' })
          .expect(401);
      });
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
