import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SESIONES, VerificadorFalso, comoUsuario } from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

const A = 'token-de-A';
const B = 'token-de-B';

/**
 * El alta de cuenta por HTTP.
 *
 * Deliberadamente **no** se llama a `darDeAlta()` al levantar: estas pruebas
 * son las del alta, asi que tienen que partir de que no hay ninguna.
 */
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

function alta(app: NestExpressApplication, token: string): request.Test {
  return request(app.getHttpServer())
    .post('/api/cuenta')
    .set(...comoUsuario(token));
}

describe('POST /api/cuenta', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('crea la cuenta la primera vez', async () => {
    const respuesta = await alta(app, A).send({ versionPolitica: '1.0' }).expect(200);

    expect(respuesta.body).toMatchObject({
      correo: SESIONES[A]?.correo,
      rol: 'usuario',
      consentimiento: { versionPolitica: '1.0' },
    });
  });

  it('el identificador que devuelve es el nuestro, no el del proveedor', async () => {
    const respuesta = await alta(app, A).send({ versionPolitica: '1.0' });

    expect((respuesta.body as { id: string }).id).not.toBe(SESIONES[A]?.id);
  });

  it('no devuelve el identificador del proveedor', async () => {
    // Es un detalle de como se autentica la persona y no aporta nada a quien
    // consume la API.
    const respuesta = await alta(app, A).send({ versionPolitica: '1.0' });

    expect(respuesta.body).not.toHaveProperty('idProveedorAuth');
    expect(JSON.stringify(respuesta.body)).not.toContain(SESIONES[A]?.id);
  });

  it('llamarlo dos veces devuelve la misma cuenta', async () => {
    const primera = await alta(app, A).send({ versionPolitica: '1.0' });
    const segunda = await alta(app, A).send({ versionPolitica: '1.0' });

    expect((segunda.body as { id: string }).id).toBe((primera.body as { id: string }).id);
  });

  it('sin consentimiento no crea nada', async () => {
    const respuesta = await alta(app, B).send({ versionPolitica: '' }).expect(400);

    expect(JSON.stringify(respuesta.body)).toContain('versionPolitica');
  });

  it('sin token responde 401', async () => {
    await request(app.getHttpServer())
      .post('/api/cuenta')
      .send({ versionPolitica: '1.0' })
      .expect(401);
  });
});

describe('El alta no concede privilegios', () => {
  // La prueba que define SCRUM-63. Una escalada de privilegios por confiar en
  // el cuerpo de la peticion es el error clasico, y aqui tiene que ser
  // imposible por construccion.

  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('mandar rol administrador en el alta se rechaza', async () => {
    const respuesta = await alta(app, A)
      .send({ versionPolitica: '1.0', rol: 'administrador' })
      .expect(400);

    expect(JSON.stringify(respuesta.body)).toContain('rol');
  });

  it('y la cuenta que se crea sin ese campo sale con rol usuario', async () => {
    const respuesta = await alta(app, A).send({ versionPolitica: '1.0' }).expect(200);

    expect((respuesta.body as { rol: string }).rol).toBe('usuario');
  });

  it('tampoco se cuela por otros campos inventados', async () => {
    await alta(app, A).send({ versionPolitica: '1.0', esAdministrador: true }).expect(400);
  });
});

describe('Sin cuenta no se puede operar', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registrar un resultado sin haberse dado de alta responde 403', async () => {
    // 403 y no 401: el token es autentico y la sesion vale. Lo que falta es la
    // cuenta. Decir "no estas autenticado" mandaria a la persona a iniciar
    // sesion otra vez, que es justo lo que no lo arregla.
    const respuesta = await request(app.getHttpServer())
      .post('/api/resultados')
      .set(...comoUsuario(A))
      .send({
        activityId: '33333333-3333-4333-a333-333333333333',
        clientOperationId: '44444444-4444-4444-b444-444444444444',
        score: 8,
        completedAt: '2026-09-14T11:00:00.000Z',
      })
      .expect(403);

    expect(respuesta.body).toMatchObject({ codigo: 'CUENTA_NO_REGISTRADA' });
  });

  it('consultar la cuenta propia sin tenerla responde 403', async () => {
    await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(A))
      .expect(403);
  });

  it('pero el catalogo sigue siendo publico', async () => {
    await request(app.getHttpServer()).get('/api/catalogo').expect(200);
  });

  it('y despues del alta ya se puede operar', async () => {
    await alta(app, A).send({ versionPolitica: '1.0' }).expect(200);

    await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(A))
      .expect(200);
  });
});
