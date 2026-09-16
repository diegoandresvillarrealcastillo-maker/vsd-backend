import type { LoggerService } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

/**
 * Comprueba que el registro de peticiones no filtra datos personales ni de
 * salud.
 *
 * Los registros parecen internos, pero los lee el personal del proveedor de
 * despliegue y acaban en sistemas de indexacion. Un puntaje o un nivel
 * orientativo ahi dentro es una fuga de informacion de salud, aunque nunca
 * salga en una respuesta HTTP.
 *
 * La comprobacion no se hace buscando valores prohibidos uno por uno, sino al
 * reves: se exige que **cada** linea encaje en una forma cerrada. Buscar
 * ausencias solo detecta lo que a alguien se le ocurrio prohibir; exigir una
 * forma detecta cualquier cosa que se anada manana sin pensarlo.
 */

/** Unica forma admitida: metodo, ruta, estado y duracion. Nada mas. */
const FORMA_ADMITIDA = /^(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD) [\w/:.-]+ \d{3} \d+ms$/;

/** Recoge lo que la aplicacion escribiria a la salida estandar. */
class RegistroDePrueba implements LoggerService {
  readonly lineas: string[] = [];

  private anotar(mensaje: unknown): void {
    this.lineas.push(typeof mensaje === 'string' ? mensaje : JSON.stringify(mensaje));
  }

  log(mensaje: unknown): void {
    this.anotar(mensaje);
  }

  error(mensaje: unknown): void {
    this.anotar(mensaje);
  }

  warn(mensaje: unknown): void {
    this.anotar(mensaje);
  }

  debug(mensaje: unknown): void {
    this.anotar(mensaje);
  }

  verbose(mensaje: unknown): void {
    this.anotar(mensaje);
  }
}

const USUARIO = '55555555-5555-4555-8555-555555555555';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';
const OPERACION = '77777777-7777-4777-a777-777777777777';

/**
 * Valores escogidos para que sean faciles de localizar en un texto y no
 * puedan confundirse con la duracion ni con el codigo de estado.
 */
// Dentro del maximo que declara la actividad del catalogo.
const PUNTAJE = 8;
const CORREO = 'persona.identificable@ejemplo-vsd-health.test';

let registro: RegistroDePrueba;
let app: NestExpressApplication;

async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  // Estas pruebas son del comportamiento HTTP, no de la persistencia, asi que
  // se fija el adaptador en memoria. Sin esto, tener un .env con DATABASE_URL
  // las haria hablar con PostgreSQL sin avisar, y pasarian o fallarian segun
  // lo que hubiera en la base de cada quien. Las pruebas contra la base real
  // son las de SCRUM-61 y viven aparte.
  delete process.env.DATABASE_URL;

  registro = new RegistroDePrueba();

  const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = modulo.createNestApplication<NestExpressApplication>({ logger: registro });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  return app;
}

/** Solo las lineas del registro de peticiones, sin el ruido del arranque. */
function lineasDePeticiones(): string[] {
  return registro.lineas.filter((linea) => /^[A-Z]+ \//.test(linea));
}

describe('El registro de peticiones no filtra datos personales ni de salud', () => {
  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('anota metodo, ruta, estado y duracion de una peticion correcta', async () => {
    await request(app.getHttpServer())
      .post('/api/resultados')
      .send({
        userId: USUARIO,
        activityId: ACTIVIDAD,
        clientOperationId: OPERACION,
        score: PUNTAJE,
        completedAt: '2026-09-14T11:00:00.000Z',
      })
      .expect(201);

    const anotadas = lineasDePeticiones();

    expect(anotadas).toHaveLength(1);
    expect(anotadas[0]).toMatch(/^POST \/api\/resultados 201 \d+ms$/);
  });

  it('no deja el nivel orientativo en el registro', () => {
    const texto = registro.lineas.join('\n');

    // No se comprueba el puntaje por su valor: un numero pequeno puede
    // coincidir por casualidad con una duracion en milisegundos, y una prueba
    // que falla a ratos acaba ignorandose. De que el puntaje no aparezca se
    // encarga la prueba de la forma cerrada, que es una garantia mas fuerte:
    // si se colara cualquier campo de mas, la linea deja de encajar.
    expect(texto).not.toContain('favorable');
    expect(texto).not.toContain('en_seguimiento');
    expect(texto).not.toContain('requiere_atencion');
  });

  it('no deja rastro de un correo aunque llegue en el cuerpo y se rechace', async () => {
    await request(app.getHttpServer())
      .post('/api/resultados')
      .send({
        userId: USUARIO,
        activityId: ACTIVIDAD,
        clientOperationId: OPERACION,
        score: PUNTAJE,
        completedAt: '2026-09-14T11:00:00.000Z',
        correo: CORREO,
      })
      .expect(400);

    expect(registro.lineas.join('\n')).not.toContain(CORREO);
  });

  it('anota el estado que de verdad recibio quien llamo, no el de exito', () => {
    // Una peticion rechazada se anotaba como 201: el codigo de exito ya esta
    // puesto en la respuesta cuando falla la validacion, y el estado se leia
    // en ese momento. Quien leyera el registro habria dado por buena una
    // peticion que en realidad fallo.
    expect(lineasDePeticiones()).toContainEqual(
      expect.stringMatching(/^POST \/api\/resultados 400 \d+ms$/),
    );
  });

  it('en una ruta inexistente no anota la cadena de consulta', async () => {
    await request(app.getHttpServer())
      .get('/ruta/que/no/existe')
      .query({ correo: CORREO, token: 'valor-secreto-de-prueba' })
      .expect(404);

    const texto = registro.lineas.join('\n');

    expect(texto).not.toContain(CORREO);
    expect(texto).not.toContain('valor-secreto-de-prueba');
  });

  it('cada linea anotada encaja en la forma cerrada, sin campos de mas', () => {
    const anotadas = lineasDePeticiones();

    expect(anotadas.length).toBeGreaterThan(0);

    for (const linea of anotadas) {
      expect(linea).toMatch(FORMA_ADMITIDA);
    }
  });
});
