import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { VerificadorFalso } from '../../pruebas/sesionDePrueba.js';
import { AppModule } from './AppModule.js';
import { CABECERAS_PERMITIDAS, METODOS_PERMITIDOS, configurarAplicacion } from './aplicacion.js';
import { Ambiente, type Configuracion } from './environment.js';
import { configurarDocumentacion } from './openapi.js';
import { CONFIGURACION } from './tokens.js';

/**
 * Lo que la API deja ver y a quien deja llamarla desde un navegador (SCRUM-155).
 *
 * Son dos decisiones de configuracion sin ninguna regla de negocio detras, que
 * justamente por eso se rompen sin que nadie lo note: un `credentials: true`
 * que vuelve en un arreglo, o un ambiente nuevo que publica el mapa de la API.
 */
const ORIGEN = 'http://localhost:5173';

let app: NestExpressApplication | undefined;

async function levantar(ambiente: Ambiente): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = ORIGEN;
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  delete process.env.DATABASE_URL;

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const creada = modulo.createNestApplication<NestExpressApplication>({ logger: false });
  // El ambiente se simula en la configuracion, sin tocar las variables: los de
  // preproduccion y produccion exigen una base de datos y una clave de servicio.
  const configuracion: Configuracion = {
    ...creada.get<Configuracion>(CONFIGURACION),
    ambiente,
    esProduccion: ambiente === Ambiente.PRODUCCION,
  };

  configurarAplicacion(creada, configuracion);
  configurarDocumentacion(creada, configuracion);
  await creada.init();

  app = creada;

  return creada;
}

afterEach(async () => {
  await app?.close();
  app = undefined;
});

function preflight(
  servidor: NestExpressApplication,
  origen: string,
  metodo: string,
  cabeceras = '',
) {
  return request(servidor.getHttpServer())
    .options('/api/pendientes')
    .set('Origin', origen)
    .set('Access-Control-Request-Method', metodo)
    .set('Access-Control-Request-Headers', cabeceras);
}

describe('CORS (S-12)', () => {
  it('no permite credenciales: la API autentica con la cabecera, no con cookies', async () => {
    const servidor = await levantar(Ambiente.PRUEBAS);

    const respuesta = await preflight(servidor, ORIGEN, 'PATCH', 'authorization,content-type');

    expect(respuesta.headers['access-control-allow-origin']).toBe(ORIGEN);
    expect(respuesta.headers['access-control-allow-credentials']).toBeUndefined();

    // Tampoco en una peticion normal, no solo en el preflight.
    const normal = await request(servidor.getHttpServer()).get('/health').set('Origin', ORIGEN);

    expect(normal.headers['access-control-allow-origin']).toBe(ORIGEN);
    expect(normal.headers['access-control-allow-credentials']).toBeUndefined();
  });

  it('solo permite los metodos que usa el frontend', async () => {
    const servidor = await levantar(Ambiente.PRUEBAS);

    const respuesta = await preflight(servidor, ORIGEN, 'DELETE');
    const permitidos = String(respuesta.headers['access-control-allow-methods']).split(',');

    expect(permitidos).toEqual([...METODOS_PERMITIDOS]);
    for (const metodo of ['TRACE', 'CONNECT', 'OPTIONS']) {
      expect(permitidos).not.toContain(metodo);
    }
  });

  it('solo permite las cabeceras que escribe el frontend', async () => {
    const servidor = await levantar(Ambiente.PRUEBAS);

    const respuesta = await preflight(servidor, ORIGEN, 'POST', 'authorization');
    const permitidas = String(respuesta.headers['access-control-allow-headers']).split(',');

    expect(permitidas).toEqual([...CABECERAS_PERMITIDAS]);
    // Ni las que se usan para falsear de donde viene una peticion.
    for (const cabecera of ['X-Forwarded-For', 'X-Forwarded-Host', 'X-HTTP-Method-Override']) {
      expect(permitidas.map((una) => una.toLowerCase())).not.toContain(cabecera.toLowerCase());
    }
  });

  it('el navegador recuerda el preflight diez minutos', async () => {
    const servidor = await levantar(Ambiente.PRUEBAS);

    const respuesta = await preflight(servidor, ORIGEN, 'PATCH', 'authorization');

    expect(respuesta.headers['access-control-max-age']).toBe('600');
  });

  it('un origen que no esta autorizado no recibe nada', async () => {
    const servidor = await levantar(Ambiente.PRUEBAS);

    const respuesta = await preflight(servidor, 'https://sitio-ajeno.example', 'GET');

    // Sin `Access-Control-Allow-Origin` el navegador descarta la respuesta,
    // diga lo que diga el resto de las cabeceras.
    expect(respuesta.headers['access-control-allow-origin']).toBeUndefined();
    expect(respuesta.headers['access-control-allow-credentials']).toBeUndefined();
  });

  it('sigue dejando leer el identificador de la peticion y el ETag', async () => {
    const servidor = await levantar(Ambiente.PRUEBAS);

    const respuesta = await request(servidor.getHttpServer()).get('/health').set('Origin', ORIGEN);
    const expuestas = String(respuesta.headers['access-control-expose-headers']).toLowerCase();

    expect(expuestas).toContain('x-request-id');
    expect(expuestas).toContain('etag');
  });
});

describe('La documentacion de la API (S-11)', () => {
  it('en local, con NODE_ENV=development, se publica', async () => {
    const servidor = await levantar(Ambiente.DESARROLLO);

    const respuesta = await request(servidor.getHttpServer()).get('/api/docs');

    expect(respuesta.status).toBe(200);
  });

  it.each([Ambiente.PREPRODUCCION, Ambiente.PRODUCCION, Ambiente.PRUEBAS])(
    'con NODE_ENV=%s no se publica, ni la pagina ni el JSON',
    async (ambiente) => {
      const servidor = await levantar(ambiente);

      for (const ruta of ['/api/docs', '/api/docs-json', '/api/docs/swagger-ui-init.js']) {
        const respuesta = await request(servidor.getHttpServer()).get(ruta);

        expect(respuesta.status, `${ruta} en ${ambiente}`).toBe(404);
      }
    },
  );
});
