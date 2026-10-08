import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { darDeAlta, VerificadorFalso, comoUsuario } from '../../pruebas/sesionDePrueba.js';
import { AsistenteController } from '../controllers/AsistenteController.js';
import { CuentaController } from '../controllers/CuentaController.js';
import { FotoDePerfilController } from '../controllers/FotoDePerfilController.js';
import { MascotaPropiaController } from '../controllers/MascotaPropiaController.js';
import { NotificacionesController } from '../controllers/NotificacionesController.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion, LIMITE_DE_PETICIONES } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';
import { LIMITE_POR_CUENTA } from './LimitePorCuenta.js';

/**
 * El limite de peticiones, comprobado con la aplicacion de verdad (S-03 de la
 * auditoria 360): el general por direccion IP detras de un proxy, y el tope por
 * cuenta de las rutas que cuestan.
 *
 * Cada prueba levanta su propia aplicacion: el contador del limite vive dentro de
 * ella, asi que una nueva parte de cero.
 */
const A = 'token-de-A';
const B = 'token-de-B';

let abiertas: NestExpressApplication[] = [];

async function levantar(saltosDeProxy?: number): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  delete process.env.DATABASE_URL;

  if (saltosDeProxy === undefined) {
    delete process.env.TRUST_PROXY_HOPS;
  } else {
    process.env.TRUST_PROXY_HOPS = String(saltosDeProxy);
  }

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));
  await app.init();
  abiertas.push(app);

  return app;
}

afterEach(async () => {
  delete process.env.TRUST_PROXY_HOPS;
  await Promise.all(abiertas.map((app) => app.close()));
  abiertas = [];
});

/** Una peticion publica desde la direccion que dice un proxy (X-Forwarded-For). */
function desde(app: NestExpressApplication, direccion: string): request.Test {
  return request(app.getHttpServer()).get('/api/aviso').set('X-Forwarded-For', direccion);
}

/** Gasta todo el cupo general de una direccion. */
async function agotar(app: NestExpressApplication, direccion: string): Promise<void> {
  for (let i = 0; i < LIMITE_DE_PETICIONES; i += 1) {
    await desde(app, direccion).expect(200);
  }
}

describe('El limite general por direccion IP, detras de un proxy', () => {
  it('sin proxy de confianza, todo el mundo comparte un solo cupo: es el problema', async () => {
    // Express ve siempre la direccion del propio proxy, sea quien sea quien llame.
    const app = await levantar();

    await agotar(app, '203.0.113.10');

    await desde(app, '203.0.113.10').expect(429);
    // Otra persona, con otra direccion, tambien se queda sin servicio.
    await desde(app, '198.51.100.7').expect(429);
  });

  it('con un salto de confianza, cada direccion tiene su propio cupo', async () => {
    const app = await levantar(1);

    await agotar(app, '203.0.113.10');

    await desde(app, '203.0.113.10').expect(429);
    // La otra persona sigue entrando: una abusiva ya no deja a todas en 429.
    await desde(app, '198.51.100.7').expect(200);
  });

  it('el 429 sale con el mismo cuerpo y con el identificador de la peticion', async () => {
    const app = await levantar(1);

    await agotar(app, '203.0.113.10');
    const respuesta = await desde(app, '203.0.113.10').expect(429);

    expect(respuesta.body).toMatchObject({ codigo: 'DEMASIADAS_PETICIONES' });
    expect(respuesta.headers['x-request-id']).toBeTruthy();
  });

  it('no se esquiva escribiendo otra direccion antes: cuenta la que anadio el proxy', async () => {
    // Render no reescribe X-Forwarded-For: anade la direccion que ve al final de lo
    // que traiga quien llama. Contando saltos desde la derecha se toma esa, y lo
    // que se escriba a la izquierda no cambia de cupo.
    const app = await levantar(1);

    await agotar(app, '203.0.113.10');

    await desde(app, '1.1.1.1, 203.0.113.10').expect(429);
    await desde(app, '8.8.8.8, 9.9.9.9, 203.0.113.10').expect(429);
  });

  it('con mas saltos de los que hay no se debe confiar: se toma lo que escribio quien llama', async () => {
    // Es lo que hace peligroso contar de mas, y por eso la documentacion manda
    // comprobar el numero y empezar por 1: con 2 saltos y un solo proxy, la
    // direccion que se toma es la que escribio quien llama, y cambiarla da cupo
    // nuevo. Se deja escrito para que nadie ponga un numero "por si acaso".
    const app = await levantar(2);

    await agotar(app, '1.1.1.1, 203.0.113.10');

    await desde(app, '1.1.1.1, 203.0.113.10').expect(429);
    await desde(app, '2.2.2.2, 203.0.113.10').expect(200);
  });
});

describe('El tope por cuenta de las rutas que cuestan', () => {
  const exportar = (app: NestExpressApplication, token: string, direccion?: string) => {
    const peticion = request(app.getHttpServer())
      .get('/api/cuenta/exportacion')
      .set(...comoUsuario(token));

    return direccion === undefined ? peticion : peticion.set('X-Forwarded-For', direccion);
  };

  it('deja exportar cinco veces por minuto y corta la sexta', async () => {
    const app = await levantar();
    await darDeAlta(app.getHttpServer());

    for (let i = 0; i < 5; i += 1) {
      await exportar(app, A).expect(200);
    }

    const cortada = await exportar(app, A).expect(429);

    expect(cortada.body).toMatchObject({ codigo: 'DEMASIADAS_PETICIONES' });
    expect(cortada.body).toHaveProperty('mensaje');
  });

  it('dice cuanto esperar con Retry-After, en segundos y dentro de la ventana', async () => {
    const app = await levantar();
    await darDeAlta(app.getHttpServer());

    for (let i = 0; i < 5; i += 1) {
      await exportar(app, A).expect(200);
    }

    const cortada = await exportar(app, A).expect(429);
    const espera = Number(cortada.headers['retry-after']);

    expect(Number.isInteger(espera)).toBe(true);
    expect(espera).toBeGreaterThanOrEqual(1);
    expect(espera).toBeLessThanOrEqual(60);
  });

  it('es por cuenta: que una la agote no deja sin exportar a la otra', async () => {
    const app = await levantar();
    await darDeAlta(app.getHttpServer());

    for (let i = 0; i < 5; i += 1) {
      await exportar(app, A).expect(200);
    }

    await exportar(app, A).expect(429);
    await exportar(app, B).expect(200);
  });

  it('no depende de la direccion: cambiar de IP no da cupo nuevo', async () => {
    // Es lo que el limite por direccion no puede hacer: una persona que cambia de
    // direccion sigue siendo la misma cuenta.
    const app = await levantar(1);
    await darDeAlta(app.getHttpServer());

    for (let i = 0; i < 5; i += 1) {
      await exportar(app, A, `203.0.113.${i + 1}`).expect(200);
    }

    await exportar(app, A, '198.51.100.99').expect(429);
  });

  it('cada ruta cuenta aparte: agotar la exportacion no gasta el cupo de quitar la foto', async () => {
    const app = await levantar();
    await darDeAlta(app.getHttpServer());

    for (let i = 0; i < 6; i += 1) {
      await exportar(app, A);
    }

    await exportar(app, A).expect(429);
    await request(app.getHttpServer())
      .delete('/api/cuenta/foto')
      .set(...comoUsuario(A))
      .expect(200);
  });

  it('quitar la foto admite diez por minuto y corta la once', async () => {
    const app = await levantar();
    await darDeAlta(app.getHttpServer());
    const quitar = () =>
      request(app.getHttpServer())
        .delete('/api/cuenta/foto')
        .set(...comoUsuario(A));

    for (let i = 0; i < 10; i += 1) {
      await quitar().expect(200);
    }

    await quitar().expect(429);
  });

  it('las rutas sin tope propio no lo tienen: consultar la cuenta no se corta a las veinte', async () => {
    const app = await levantar();
    await darDeAlta(app.getHttpServer());

    for (let i = 0; i < 20; i += 1) {
      await request(app.getHttpServer())
        .get('/api/cuenta')
        .set(...comoUsuario(A))
        .expect(200);
    }
  });

  it('sin sesion no se llega a contar nada: responde 401 como siempre', async () => {
    const app = await levantar();

    for (let i = 0; i < 7; i += 1) {
      await request(app.getHttpServer()).get('/api/cuenta/exportacion').expect(401);
    }
  });
});

// La regla de tope que lleva un metodo de un controlador, si la lleva.
function reglaDe(
  prototipo: object,
  metodo: string,
): { maximo: number; ventanaMs: number } | undefined {
  return Reflect.getMetadata(LIMITE_POR_CUENTA, Reflect.get(prototipo, metodo) as object) as
    { maximo: number; ventanaMs: number } | undefined;
}

describe('Las rutas que cuestan llevan su tope', () => {
  const RUTAS_CON_TOPE: readonly [string, object, string][] = [
    ['exportar los datos', CuentaController.prototype, 'exportar'],
    ['preguntarle al asistente', AsistenteController.prototype, 'preguntar'],
    ['guardar la foto', FotoDePerfilController.prototype, 'guardar'],
    ['quitar la foto', FotoDePerfilController.prototype, 'quitar'],
    ['guardar la mascota propia', MascotaPropiaController.prototype, 'guardar'],
    ['quitar la mascota propia', MascotaPropiaController.prototype, 'quitar'],
    ['registrar un navegador para los avisos', NotificacionesController.prototype, 'suscribir'],
    ['soltar un navegador de los avisos', NotificacionesController.prototype, 'desuscribir'],
  ];

  it.each(RUTAS_CON_TOPE)('%s', (_nombre, prototipo, metodo) => {
    const regla = reglaDe(prototipo, metodo);

    expect(regla).toBeDefined();
    expect(regla?.maximo).toBeLessThan(LIMITE_DE_PETICIONES);
  });

  it.each([
    ['leer la foto', FotoDePerfilController.prototype, 'leer'],
    ['leer la mascota propia', MascotaPropiaController.prototype, 'leer'],
    ['consultar la cuenta', CuentaController.prototype, 'consultar'],
  ])('%s no lo lleva: la pide la pantalla cada vez que se abre', (_nombre, prototipo, metodo) => {
    expect(reglaDe(prototipo, metodo)).toBeUndefined();
  });
});
