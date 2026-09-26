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

/**
 * Las dos personas con las que se prueba.
 *
 * Desde SCRUM-66 quien hace la peticion no se elige escribiendo un
 * identificador en el cuerpo: se elige **con que token se llama**. Por eso
 * aqui hay tokens y no UUID sueltos.
 */
const A = 'token-de-A';
const B = 'token-de-B';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';
/** Bitacora de sueno: es la actividad del catalogo que no puntua. */
const BITACORA = '88888888-8888-4888-a888-888888888888';

/** Cada prueba usa su propia operacion para no interferir con las demas. */
let contador = 0;
function nuevaOperacion(): string {
  contador += 1;

  return '44444444-4444-4444-b444-' + String(contador).padStart(12, '0');
}

/**
 * El cuerpo de la respuesta, con tipo.
 *
 * `response.body` de supertest es `any`, y el proyecto no deja usar valores
 * `any` sin mas. Pasar por aqui obliga a nombrar lo que se espera encontrar.
 */
function respuestaDe(respuesta: request.Response): Record<string, unknown> {
  return respuesta.body as Record<string, unknown>;
}

function cuerpo(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    activityId: ACTIVIDAD,
    clientOperationId: nuevaOperacion(),
    score: 8,
    completedAt: '2026-09-14T11:00:00.000Z',
    ...extra,
  };
}

/**
 * Levanta la aplicacion con la misma configuracion que usa main.ts.
 *
 * Si la prueba la configurara de otra forma, no demostraria nada sobre el
 * comportamiento real del servicio.
 */
async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  // No se llega a consultar: el verificador de verdad esta sustituido. Hace
  // falta igual porque la configuracion la exige para arrancar.
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  // Estas pruebas son del comportamiento HTTP, no de la persistencia, asi que
  // se fija el adaptador en memoria. Sin esto, tener un .env con DATABASE_URL
  // las haria hablar con PostgreSQL sin avisar, y pasarian o fallarian segun
  // lo que hubiera en la base de cada quien. Las pruebas contra la base real
  // son las de SCRUM-61 y viven aparte.
  delete process.env.DATABASE_URL;

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    // Se sustituye la criptografia, no el guardia. Ver src/pruebas.
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  // Desde SCRUM-63 tener token no basta para operar: hace falta cuenta. Se da
  // de alta llamando a la API, igual que hara una persona.
  await darDeAlta(app.getHttpServer());

  return app;
}

/**
 * Una peticion de registro en nombre de alguien.
 *
 * Existe para que en cada prueba se vea **quien llama**, que desde SCRUM-66
 * es lo que determina de quien es el resultado. Antes esa informacion estaba
 * enterrada en un campo del cuerpo y se leia como un dato mas.
 */
function registrarComo(app: NestExpressApplication, token: string): request.Test {
  return request(app.getHttpServer())
    .post('/api/resultados')
    .set(...comoUsuario(token));
}

describe('POST /api/resultados', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registra un resultado y devuelve 201', async () => {
    const respuesta = await registrarComo(app, A).send(cuerpo());

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject({
      activityId: ACTIVIDAD,
      nivelOrientativo: 'favorable',
      sugiereAcompanamiento: false,
    });
  });

  it('no devuelve el puntaje numerico en ninguna forma', async () => {
    // El numero vive en la base para calcular tendencias. Un "8 sobre 10" en
    // algo relacionado con el animo no informa: se lee como una calificacion
    // sobre uno mismo. Lo que ve la persona es el nivel.
    const respuesta = await registrarComo(app, A).send(cuerpo());

    expect(respuesta.body).not.toHaveProperty('score');
    expect(respuesta.body).not.toHaveProperty('maxScore');
    expect(respuesta.body).not.toHaveProperty('puntaje');
  });

  it('no devuelve el identificador del usuario en la respuesta', async () => {
    // Quien pregunta ya sabe de quien es el resultado. Devolverlo solo
    // anadiria un dato personal mas circulando por la red.
    const respuesta = await registrarComo(app, A).send(cuerpo());

    expect(respuesta.body).not.toHaveProperty('userId');
  });

  it('sugiere acompanamiento cuando el puntaje es bajo', async () => {
    const respuesta = await registrarComo(app, A).send(cuerpo({ score: 2 }));

    expect(respuesta.body).toMatchObject({
      nivelOrientativo: 'requiere_atencion',
      sugiereAcompanamiento: true,
    });
  });

  it('es idempotente: el reintento devuelve el mismo resultado', async () => {
    const peticion = cuerpo();

    const primera = await registrarComo(app, A).send(peticion);
    const segunda = await registrarComo(app, A).send(peticion);

    const idPrimera = (primera.body as { id: string }).id;
    const idSegunda = (segunda.body as { id: string }).id;

    expect(segunda.status).toBe(201);
    expect(idSegunda).toBe(idPrimera);
  });
});

describe('Aislamiento entre usuarios y manejo de errores', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('usar el identificador de operacion de otra persona no llega a sus datos', async () => {
    const peticion = cuerpo();

    const propia = await registrarComo(app, A).send(peticion);

    // La misma operacion, pero llamando con el token de la otra persona. Esta
    // es la version fuerte de la prueba: antes bastaba con cambiar un campo
    // del cuerpo, y lo que se comprobaba era que el codigo filtrara bien. Ahora
    // hay dos identidades distintas de verdad.
    const ajena = await registrarComo(app, B).send({ ...peticion, score: 2 });

    // Se registra un resultado nuevo, de quien pregunta. No se devuelve el de
    // la otra persona, no se sobrescribe y no se responde con un error que
    // delate que ese identificador estaba ocupado.
    expect(ajena.status).toBe(201);
    expect(respuestaDe(ajena).id).not.toBe(respuestaDe(propia).id);
    expect(ajena.body).toMatchObject({ nivelOrientativo: 'requiere_atencion' });
  });

  it('no responde distinto ante una operacion ajena que ante una nueva', async () => {
    // Si las dos respuestas se diferenciaran en algo, esa diferencia seria
    // suficiente para ir probando identificadores y averiguar cuales estan en
    // uso, sin llegar a ver ni un dato. Ver ADR 0010.
    const peticion = cuerpo();

    await registrarComo(app, A).send(peticion);

    const ajena = await registrarComo(app, B).send(peticion);
    const nueva = await registrarComo(app, B).send(cuerpo());

    expect(ajena.status).toBe(nueva.status);
    expect(Object.keys(respuestaDe(ajena)).sort()).toEqual(Object.keys(respuestaDe(nueva)).sort());
    expect(respuestaDe(ajena).nivelOrientativo).toBe(respuestaDe(nueva).nivelOrientativo);
  });

  it('el cuerpo ya no puede decir de quien es el resultado', async () => {
    // Era el agujero que cierra SCRUM-66: el identificador venia en el cuerpo
    // y la API se lo creia. Ahora el campo no esta en el contrato, y la
    // validacion rechaza lo que no esta declarado.
    //
    // Un 400 explicito y no un silencio: ignorarlo dejaria a un cliente viejo
    // creyendo que elige el usuario mientras el servidor usa otro.
    const respuesta = await registrarComo(app, A).send(cuerpo({ userId: SESIONES[B]?.id }));

    expect(respuesta.status).toBe(400);
    expect(JSON.stringify(respuesta.body)).toContain('userId');
  });

  it('sin token no se registra nada', async () => {
    const respuesta = await request(app.getHttpServer()).post('/api/resultados').send(cuerpo());

    expect(respuesta.status).toBe(401);
  });

  it('con un token que no se puede verificar tampoco', async () => {
    const respuesta = await registrarComo(app, 'token-inventado').send(cuerpo());

    expect(respuesta.status).toBe(401);
  });

  it('el 401 responde lo mismo sea cual sea el problema del token', async () => {
    // Lo que importa no es que el mensaje evite ciertas palabras, sino que
    // sea **el mismo** en todos los casos. Distinguir "caducado" de "firma
    // invalida" de "es de otro proyecto" le va diciendo a quien prueba
    // combinaciones cual de ellas se acerca.
    //
    // El motivo concreto se escribe en el registro del servidor, donde sirve
    // para diagnosticar y no lo lee quien llama.
    const unTokenMalo = await registrarComo(app, 'token-inventado').send(cuerpo());
    const otroTokenMalo = await registrarComo(app, 'otro-token-distinto').send(cuerpo());

    expect(unTokenMalo.status).toBe(otroTokenMalo.status);
    expect(unTokenMalo.body).toEqual(otroTokenMalo.body);
    // Y tampoco se cuela el texto interno del error.
    expect(JSON.stringify(unTokenMalo.body)).not.toContain('desconocido');
  });

  it('rechaza un campo que no existe en el contrato', async () => {
    // Proteccion contra asignacion masiva: enviar un campo de mas no puede
    // colarse en silencio.
    const respuesta = await registrarComo(app, A).send(cuerpo({ esAdministrador: true }));

    expect(respuesta.status).toBe(400);
    expect(JSON.stringify(respuesta.body)).toContain('esAdministrador');
  });

  it('responde 404 si la actividad no esta en el catalogo', async () => {
    // Sin la actividad no se puede interpretar el puntaje: no se sabe sobre
    // que maximo se obtuvo ni hacia donde va la escala. Es preferible
    // rechazarlo a guardarlo con un nivel derivado de suposiciones.
    const respuesta = await registrarComo(app, A).send(
      cuerpo({ activityId: '99999999-9999-4999-a999-999999999999' }),
    );

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toMatchObject({ codigo: 'ACTIVIDAD_NO_ENCONTRADA' });
  });

  it('rechaza una fecha futura con el codigo del dominio', async () => {
    const respuesta = await registrarComo(app, A).send(
      cuerpo({ completedAt: '2030-01-01T00:00:00.000Z' }),
    );

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toMatchObject({ codigo: 'FECHA_EN_EL_FUTURO' });
  });

  it('ningun error revela la traza ni nombres de clases internas', async () => {
    const respuesta = await registrarComo(app, A).send(cuerpo({ score: 999 }));

    expect(JSON.stringify(respuesta.body)).not.toMatch(
      /at \w+|\.ts:|node_modules|UseCaseImpl|Repository/,
    );
  });
});

describe('Protecciones y estado del servicio', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health responde 200 sin revelar detalles internos', async () => {
    const respuesta = await request(app.getHttpServer()).get('/health');

    expect(respuesta.status).toBe(200);
    expect(Object.keys(respuesta.body as object)).toEqual(['estado']);
  });

  it('incluye las cabeceras de seguridad', async () => {
    const respuesta = await request(app.getHttpServer()).get('/health');

    expect(respuesta.headers['x-content-type-options']).toBe('nosniff');
    expect(respuesta.headers['referrer-policy']).toBe('no-referrer');
    expect(respuesta.headers['x-frame-options']).toBeDefined();
  });

  it('no anuncia la tecnologia del servidor', async () => {
    const respuesta = await request(app.getHttpServer()).get('/health');

    expect(respuesta.headers['x-powered-by']).toBeUndefined();
  });

  it('no autoriza un origen que no esta en la lista blanca', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'https://sitio-no-autorizado.example');

    expect(respuesta.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('autoriza el origen configurado', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://localhost:5173');

    expect(respuesta.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});

describe('POST /api/resultados de una actividad sin puntaje', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  /** Una bitacora de sueno: produce datos, no una calificacion. */
  function bitacora(extra: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      activityId: BITACORA,
      clientOperationId: nuevaOperacion(),
      completedAt: '2026-09-14T11:00:00.000Z',
      metadata: { horasDormidas: 6.5, despertares: 2, comoAmanecio: 'cansado' },
      ...extra,
    };
  }

  it('registra un resultado sin puntaje y devuelve 201', async () => {
    const respuesta = await registrarComo(app, A).send(bitacora()).expect(201);

    expect(respuesta.body).toMatchObject({
      activityId: BITACORA,
      sugiereAcompanamiento: false,
      metadata: { horasDormidas: 6.5, despertares: 2, comoAmanecio: 'cansado' },
    });
  });

  it('no incluye nivel orientativo cuando no hubo puntaje', async () => {
    const respuesta = await registrarComo(app, A).send(bitacora());

    expect(respuesta.body).not.toHaveProperty('nivelOrientativo');
  });

  it('reintentar la misma operacion no crea un segundo resultado', async () => {
    const cuerpoFijo = bitacora();

    const primera = await registrarComo(app, A).send(cuerpoFijo);
    const segunda = await registrarComo(app, A).send(cuerpoFijo);

    expect(segunda.status).toBe(201);
    expect((segunda.body as { id: string }).id).toBe((primera.body as { id: string }).id);
  });

  it('rechaza un puntaje en una actividad que no puntua', async () => {
    // Se avisa en vez de descartarlo en silencio: ese dato podria ser justo
    // lo que la persona respondio.
    const respuesta = await registrarComo(app, A)
      .send(bitacora({ score: 8 }))
      .expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'LA_ACTIVIDAD_NO_PUNTUA' });
  });

  it('el maximo lo declara la actividad, no quien reporta', async () => {
    // Antes el maximo viajaba en la peticion, de modo que quien reportara
    // podia elegir su propia escala y con ella el nivel que salia.
    const respuesta = await registrarComo(app, A)
      .send({ ...cuerpo(), maxScore: 1000 })
      .expect(400);

    expect(JSON.stringify(respuesta.body)).toContain('maxScore');
  });

  it('un puntaje por encima del maximo de la actividad se rechaza', async () => {
    const respuesta = await registrarComo(app, A)
      .send(cuerpo({ score: 15 }))
      .expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'PUNTAJE_FUERA_DE_RANGO' });
  });

  it('rechaza metadata con una clave que ya es un campo propio', async () => {
    await registrarComo(app, A)
      .send(bitacora({ metadata: { puntaje: 99 } }))
      .expect(400);
  });
});
