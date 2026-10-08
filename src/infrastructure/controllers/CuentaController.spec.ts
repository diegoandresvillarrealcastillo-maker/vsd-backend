import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from '../../domain/model/AvisoDePrivacidad.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import {
  REGISTRO_DE_PRUEBA,
  SESIONES,
  VerificadorFalso,
  comoUsuario,
} from '../../pruebas/sesionDePrueba.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION, USER_REPOSITORY } from '../config/tokens.js';

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
    const respuesta = await alta(app, A).send(REGISTRO_DE_PRUEBA).expect(200);

    expect(respuesta.body).toMatchObject({
      correo: SESIONES[A]?.correo,
      rol: 'usuario',
      consentimiento: { versionPolitica: VERSION_VIGENTE_DEL_AVISO },
    });
  });

  it('el identificador que devuelve es el nuestro, no el del proveedor', async () => {
    const respuesta = await alta(app, A).send(REGISTRO_DE_PRUEBA);

    expect((respuesta.body as { id: string }).id).not.toBe(SESIONES[A]?.id);
  });

  it('no devuelve el identificador del proveedor', async () => {
    // Es un detalle de como se autentica la persona y no aporta nada a quien
    // consume la API.
    const respuesta = await alta(app, A).send(REGISTRO_DE_PRUEBA);

    expect(respuesta.body).not.toHaveProperty('idProveedorAuth');
    expect(JSON.stringify(respuesta.body)).not.toContain(SESIONES[A]?.id);
  });

  it('llamarlo dos veces devuelve la misma cuenta', async () => {
    const primera = await alta(app, A).send(REGISTRO_DE_PRUEBA);
    const segunda = await alta(app, A).send(REGISTRO_DE_PRUEBA);

    expect((segunda.body as { id: string }).id).toBe((primera.body as { id: string }).id);
  });

  it('sin consentimiento no crea nada', async () => {
    const respuesta = await alta(app, B).send({ versionPolitica: '' }).expect(400);

    expect(JSON.stringify(respuesta.body)).toContain('versionPolitica');
  });

  it('sin token responde 401', async () => {
    await request(app.getHttpServer()).post('/api/cuenta').send(REGISTRO_DE_PRUEBA).expect(401);
  });

  it('un aviso que no es el vigente responde 409 y no crea la cuenta', async () => {
    const respuesta = await alta(app, B)
      .send({ ...REGISTRO_DE_PRUEBA, versionPolitica: '1.0' })
      .expect(409);

    expect(respuesta.body).toMatchObject({ codigo: 'VERSION_DEL_AVISO_NO_VIGENTE' });

    // Sigue sin cuenta: consultarla responde 403, no 200.
    await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(B))
      .expect(403);
  });
});

describe('GET /api/aviso', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('devuelve la version vigente sin pedir sesion', async () => {
    // Publica porque se necesita antes de que exista la cuenta, y porque no
    // contiene nada de nadie.
    const respuesta = await request(app.getHttpServer()).get('/api/aviso').expect(200);

    expect(respuesta.body).toEqual({
      version: VERSION_VIGENTE_DEL_AVISO,
      versionTerminos: VERSION_VIGENTE_DE_LOS_TERMINOS,
    });
  });

  it('lo que devuelve es exactamente lo que el alta acepta', async () => {
    // La garantia de que hay una sola fuente: pedir la version y darse de alta
    // con ella siempre funciona.
    const aviso = await request(app.getHttpServer()).get('/api/aviso').expect(200);

    await alta(app, A)
      .send({
        ...REGISTRO_DE_PRUEBA,
        versionPolitica: (aviso.body as { version: string }).version,
        versionTerminos: (aviso.body as { versionTerminos: string }).versionTerminos,
      })
      .expect(200);
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
      .send({ ...REGISTRO_DE_PRUEBA, rol: 'administrador' })
      .expect(400);

    expect(JSON.stringify(respuesta.body)).toContain('rol');
  });

  it('y la cuenta que se crea sin ese campo sale con rol usuario', async () => {
    const respuesta = await alta(app, A).send(REGISTRO_DE_PRUEBA).expect(200);

    expect((respuesta.body as { rol: string }).rol).toBe('usuario');
  });

  it('tampoco se cuela por otros campos inventados', async () => {
    await alta(app, A)
      .send({ ...REGISTRO_DE_PRUEBA, esAdministrador: true })
      .expect(400);
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
    await alta(app, A).send(REGISTRO_DE_PRUEBA).expect(200);

    await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(A))
      .expect(200);
  });
});

describe('La zona horaria por HTTP (SCRUM-123)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  const cuerpo = REGISTRO_DE_PRUEBA;

  it('una cuenta nueva nace en la zona del dispositivo y la devuelve', async () => {
    const respuesta = await alta(app, A)
      .send({ ...cuerpo, zonaHoraria: 'Europe/Madrid' })
      .expect(200);

    expect(respuesta.body).toMatchObject({ zonaHoraria: 'Europe/Madrid' });
  });

  it('al entrar desde otra zona la cuenta la cambia, y GET /api/cuenta la ve', async () => {
    await alta(app, A)
      .send({ ...cuerpo, zonaHoraria: 'Asia/Tokyo' })
      .expect(200);

    const cuenta = await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(A))
      .expect(200);

    expect(cuenta.body).toMatchObject({ zonaHoraria: 'Asia/Tokyo' });
  });

  it('al entrar sin zona deja la que hay', async () => {
    const respuesta = await alta(app, A).send(cuerpo).expect(200);

    expect(respuesta.body).toMatchObject({ zonaHoraria: 'Asia/Tokyo' });
  });

  it('una zona que no existe responde 400 y no crea la cuenta', async () => {
    const respuesta = await alta(app, B)
      .send({ ...cuerpo, zonaHoraria: 'Marte/Olympus' })
      .expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'ZONA_HORARIA_INVALIDA' });

    await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(B))
      .expect(403);
  });

  it('una zona demasiado larga se rechaza antes de llegar al dominio', async () => {
    const respuesta = await alta(app, B)
      .send({ ...cuerpo, zonaHoraria: 'A'.repeat(65) })
      .expect(400);

    expect(JSON.stringify(respuesta.body)).toContain('zonaHoraria');
  });

  it('al entrar con una zona invalida la cuenta que ya existe no cambia', async () => {
    await alta(app, A)
      .send({ ...cuerpo, zonaHoraria: 'Marte/Olympus' })
      .expect(400);

    const cuenta = await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(A))
      .expect(200);

    expect(cuenta.body).toMatchObject({ zonaHoraria: 'Asia/Tokyo' });
  });
});

describe('Lo que se guarda en el navegador y lo que no (SCRUM-133)', () => {
  // Sin conexion, la aplicacion guarda sus propias copias (IndexedDB, cifradas,
  // por persona). La cache HTTP del navegador es otra cosa: no se borra al
  // cerrar sesion y, en un equipo compartido, la ve quien se sienta despues.
  // Por eso lo privado no entra en ella, y lo publico se revalida en vez de
  // descargarse entero cada vez.
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('la cuenta propia no se guarda en la cache del navegador', async () => {
    await alta(app, A).send(REGISTRO_DE_PRUEBA).expect(200);

    const respuesta = await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(A))
      .expect(200);

    expect(respuesta.headers['cache-control']).toBe('no-store');
  });

  it.each(['/api/catalogo', '/api/aviso'])(
    '%s lleva ETag y responde 304 si no cambio, sin cuerpo',
    async (ruta) => {
      const primera = await request(app.getHttpServer()).get(ruta).expect(200);
      const etag = primera.headers['etag'];

      expect(etag).toBeTruthy();

      const revalidada = await request(app.getHttpServer())
        .get(ruta)
        .set('If-None-Match', String(etag))
        .expect(304);

      expect(revalidada.text).toBe('');
    },
  );

  it.each(['/api/catalogo', '/api/aviso'])(
    '%s con un ETag viejo devuelve el contenido entero',
    async (ruta) => {
      const respuesta = await request(app.getHttpServer())
        .get(ruta)
        .set('If-None-Match', 'W/"una-version-anterior"')
        .expect(200);

      expect(respuesta.body).toBeTruthy();
    },
  );

  it('la web puede leer el ETag desde su origen', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/aviso')
      .set('Origin', 'http://localhost:5173')
      .expect(200);

    const expuestas = String(respuesta.headers['access-control-expose-headers']).toLowerCase();

    expect(expuestas).toContain('etag');
    // Y lo que ya se exponia no se perdio.
    expect(expuestas).toContain('x-request-id');
  });
});

describe('Quien puede registrarse: la edad y las casillas (S-01 y S-02)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  /** Que de verdad no quedo cuenta: consultarla responde 403 CUENTA_NO_REGISTRADA. */
  async function sinCuenta(token: string): Promise<void> {
    const respuesta = await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(token))
      .expect(403);

    expect(respuesta.body).toMatchObject({ codigo: 'CUENTA_NO_REGISTRADA' });
  }

  it('la cuenta que se crea sale con el registro completo y los terminos aceptados', async () => {
    const respuesta = await alta(app, A).send(REGISTRO_DE_PRUEBA).expect(200);

    expect(respuesta.body).toMatchObject({
      registroCompleto: true,
      terminos: { versionPolitica: VERSION_VIGENTE_DE_LOS_TERMINOS },
    });
  });

  it('la fecha de nacimiento no sale por la API normal', async () => {
    const respuesta = await alta(app, A).send(REGISTRO_DE_PRUEBA).expect(200);

    expect(JSON.stringify(respuesta.body)).not.toContain(REGISTRO_DE_PRUEBA.fechaNacimiento);
    expect(respuesta.body).not.toHaveProperty('fechaNacimiento');
  });

  it('sin fecha de nacimiento responde 400 y no crea la cuenta', async () => {
    const { fechaNacimiento: _fecha, ...sinFecha } = REGISTRO_DE_PRUEBA;

    const respuesta = await alta(app, B).send(sinFecha).expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'FECHA_DE_NACIMIENTO_INVALIDA' });
    await sinCuenta(B);
  });

  it.each(['14/03/1998', '1998-3-14', 'ayer', '1998-03-14T00:00:00Z', ''])(
    'una fecha escrita asi (%j) se rechaza antes de llegar al dominio',
    async (fechaNacimiento) => {
      const respuesta = await alta(app, B)
        .send({ ...REGISTRO_DE_PRUEBA, fechaNacimiento })
        .expect(400);

      expect(JSON.stringify(respuesta.body)).toContain('fechaNacimiento');
      await sinCuenta(B);
    },
  );

  it.each(['1998-02-30', '2999-01-01'])(
    'una fecha que no existe o que es del futuro (%s) responde 400 FECHA_DE_NACIMIENTO_INVALIDA',
    async (fechaNacimiento) => {
      const respuesta = await alta(app, B)
        .send({ ...REGISTRO_DE_PRUEBA, fechaNacimiento })
        .expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'FECHA_DE_NACIMIENTO_INVALIDA' });
      await sinCuenta(B);
    },
  );

  it('un menor de 18 responde 403 MENOR_DE_EDAD, con un mensaje amable, y no queda cuenta', async () => {
    const respuesta = await alta(app, B)
      .send({ ...REGISTRO_DE_PRUEBA, fechaNacimiento: '2015-05-05' })
      .expect(403);

    expect(respuesta.body).toMatchObject({ codigo: 'MENOR_DE_EDAD' });
    expect((respuesta.body as { mensaje: string }).mensaje).toMatch(/No guardamos ningún dato/);
    await sinCuenta(B);
  });

  it('el rechazo del menor no repite su fecha en la respuesta', async () => {
    const respuesta = await alta(app, B)
      .send({ ...REGISTRO_DE_PRUEBA, fechaNacimiento: '2015-05-05' })
      .expect(403);

    expect(JSON.stringify(respuesta.body)).not.toContain('2015');
  });

  it('enviar solo las versiones, sin marcar las casillas, ya no basta', async () => {
    const { aceptaAviso: _aviso, aceptaTerminos: _terminos, ...soloVersiones } = REGISTRO_DE_PRUEBA;

    const respuesta = await alta(app, B).send(soloVersiones).expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'CONSENTIMIENTO_NO_REGISTRADO' });
    await sinCuenta(B);
  });

  it.each([
    ['aviso', { aceptaAviso: false }],
    ['terminos', { aceptaTerminos: false }],
  ])('sin la casilla de %s responde 400 y no crea la cuenta', async (_cual, casilla) => {
    const respuesta = await alta(app, B)
      .send({ ...REGISTRO_DE_PRUEBA, ...casilla })
      .expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'CONSENTIMIENTO_NO_REGISTRADO' });
    await sinCuenta(B);
  });

  it('una casilla escrita como texto no vale: tiene que ser un booleano', async () => {
    const respuesta = await alta(app, B)
      .send({ ...REGISTRO_DE_PRUEBA, aceptaAviso: 'true' })
      .expect(400);

    expect(JSON.stringify(respuesta.body)).toContain('aceptaAviso');
    await sinCuenta(B);
  });

  it('unos terminos que no son los vigentes responden 409 y no crean la cuenta', async () => {
    const respuesta = await alta(app, B)
      .send({ ...REGISTRO_DE_PRUEBA, versionTerminos: '1.0' })
      .expect(409);

    expect(respuesta.body).toMatchObject({ codigo: 'VERSION_DE_LOS_TERMINOS_NO_VIGENTE' });
    await sinCuenta(B);
  });
});

describe('Las cuentas anteriores a que se pidiera el registro', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  /** Una cuenta de las de antes: tiene aviso, pero ni fecha de nacimiento ni terminos. */
  async function conUnaCuentaAnterior(
    servidor: NestExpressApplication,
    token: string,
    id: string,
  ): Promise<void> {
    const identidad = SESIONES[token];

    await servidor.get<UserRepositoryPort>(USER_REPOSITORY).save(
      unaCuenta({
        id,
        idProveedorAuth: identidad?.id ?? '',
        correo: identidad?.correo ?? '',
        anteriorAlRegistro: true,
      }),
    );
  }

  const CUENTA_DE_A = '55555555-5555-4555-8555-555555555555';

  it('la consulta de la cuenta dice que le falta completar el registro', async () => {
    await conUnaCuentaAnterior(app, A, CUENTA_DE_A);

    const respuesta = await request(app.getHttpServer())
      .get('/api/cuenta')
      .set(...comoUsuario(A))
      .expect(200);

    expect(respuesta.body).toMatchObject({ registroCompleto: false, terminos: null });
  });

  it('entrar de nuevo sin mandar el registro devuelve la cuenta, incompleta', async () => {
    const respuesta = await alta(app, A)
      .send({ versionPolitica: VERSION_VIGENTE_DEL_AVISO })
      .expect(200);

    expect(respuesta.body).toMatchObject({ registroCompleto: false });
  });

  it.each([
    ['PATCH', '/api/cuenta/preferencias'],
    ['GET', '/api/pendientes'],
    ['GET', '/api/diario'],
    ['GET', '/api/progreso'],
    ['GET', '/api/cuenta/foto'],
  ] as const)(
    '%s %s responde 403 REGISTRO_INCOMPLETO hasta que lo complete',
    async (metodo, ruta) => {
      const servidor = request(app.getHttpServer());
      const peticion =
        metodo === 'PATCH' ? servidor.patch(ruta).send({ nombre: 'Ana' }) : servidor.get(ruta);

      const respuesta = await peticion.set(...comoUsuario(A)).expect(403);

      expect(respuesta.body).toMatchObject({ codigo: 'REGISTRO_INCOMPLETO' });
    },
  );

  it('pero puede exportar lo suyo: es un derecho', async () => {
    await request(app.getHttpServer())
      .get('/api/cuenta/exportacion')
      .set(...comoUsuario(A))
      .expect(200);
  });

  it('completarlo con la fecha y las casillas la deja usar la aplicacion', async () => {
    const respuesta = await alta(app, A).send(REGISTRO_DE_PRUEBA).expect(200);

    expect(respuesta.body).toMatchObject({
      id: CUENTA_DE_A,
      registroCompleto: true,
      terminos: { versionPolitica: VERSION_VIGENTE_DE_LOS_TERMINOS },
    });

    await request(app.getHttpServer())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario(A))
      .send({ nombre: 'Ana' })
      .expect(200);
  });

  it('y la exportacion ya trae la fecha y el historial de lo aceptado', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/cuenta/exportacion')
      .set(...comoUsuario(A))
      .expect(200);

    const cuerpo = respuesta.body as {
      fechaNacimiento: string;
      consentimientos: { tipo: string; version: string }[];
    };

    expect(cuerpo.fechaNacimiento).toBe(REGISTRO_DE_PRUEBA.fechaNacimiento);
    expect(cuerpo.consentimientos.map((c) => c.tipo)).toEqual(
      expect.arrayContaining(['aviso_de_privacidad', 'terminos']),
    );
  });

  it('una cuenta anterior puede borrarse sin haber completado nada', async () => {
    // Otra aplicacion: aqui la cuenta sigue incompleta. Quien no quiere
    // completar el registro tiene que poder irse.
    const otra = await levantarAplicacion();

    try {
      await conUnaCuentaAnterior(otra, B, '66666666-6666-4666-8666-666666666666');

      await request(otra.getHttpServer())
        .delete('/api/cuenta')
        .set(...comoUsuario(B))
        .send({ confirmacion: 'BORRAR MI CUENTA' })
        .expect(204);

      await request(otra.getHttpServer())
        .get('/api/cuenta')
        .set(...comoUsuario(B))
        .expect(403);
    } finally {
      await otra.close();
    }
  });
});
