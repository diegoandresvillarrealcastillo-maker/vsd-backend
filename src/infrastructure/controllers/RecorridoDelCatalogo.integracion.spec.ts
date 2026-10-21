// Igual que las demas pruebas de integracion: vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Client } from 'pg';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { REGISTRO_DE_PRUEBA, comoUsuario } from '../../pruebas/sesionDePrueba.js';
import { TokenInvalidoError, VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import type { Identidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

/**
 * El recorrido del catalogo entero, de la peticion HTTP a la fila de PostgreSQL (SCRUM-238).
 *
 * Con las 720 sesiones publicadas, las 35 actividades de los tres modulos salen a la gente. Esta prueba hace
 * lo que hara una persona con cada una, contra la base de verdad y con la aplicacion conectada como `vsd_app`
 * (el dueno de las tablas esta exento de las politicas, y asi la prueba no comprobaria nada):
 *
 * - el catalogo las ofrece todas, y el sendero de hoy da de una a tres por modulo, **cada una con su sesion**;
 * - **cada actividad registra un resultado** como lo hace su pantalla: con su sesion, y con el puntaje maximo si
 *   se valora o sin puntaje si no. Ninguna falla;
 * - los limites siguen en pie: un puntaje por encima del maximo y un puntaje en una actividad que no se valora se
 *   rechazan, y reintentar la misma operacion no duplica nada;
 * - la racha cuenta el dia, y el sendero marca como hechas las que se hicieron.
 *
 * Identidad y correo propios de esta suite: las suites de integracion comparten base y corren en paralelo.
 */
const URL_DUENO = process.env['DATABASE_URL'];

const IDENTIDAD: Identidad = {
  id: 'c4c4c4c4-0001-4000-8000-000000000001',
  correo: 'a@recorrido-del-catalogo.test',
};
const TOKEN = 'token-recorrido-del-catalogo';

class VerificadorDeEstaSuite {
  verificar(token: string): Promise<Identidad> {
    return token === TOKEN
      ? Promise.resolve(IDENTIDAD)
      : Promise.reject(new TokenInvalidoError('token desconocido en esta suite'));
  }
}

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

interface Actividad {
  readonly id: string;
  readonly nombre: string;
  readonly motor: string | null;
  readonly maximo: number | null;
  /** Una sesion publicada de la actividad, si tiene sesiones. */
  readonly sesion: string | null;
}

interface ActividadDeHoy {
  readonly id: string;
  readonly frecuencia: { readonly tipo: string };
  readonly motor?: string;
  readonly hecha: boolean;
  readonly sesion?: { readonly id: string; readonly parametros: Record<string, unknown> };
}

interface ModuloDelProgreso {
  readonly modulo: string;
  readonly hoy: readonly ActividadDeHoy[];
}

describe.skipIf(URL_DUENO === undefined)('el recorrido del catalogo, de HTTP a PostgreSQL', () => {
  let dueno: Client;
  let app: NestExpressApplication;
  let actividades: readonly Actividad[];

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];
  const conLaCuenta = (peticion: request.Test): request.Test => peticion.set(...comoUsuario(TOKEN));

  async function limpiar(): Promise<void> {
    await dueno.query('DELETE FROM usuario WHERE correo = $1', [IDENTIDAD.correo]);
  }

  /** Lo que manda la pantalla de una actividad al terminarla: con su sesion, y con puntaje solo si se valora. */
  function resultadoDe(actividad: Actividad, puntaje?: number) {
    return {
      activityId: actividad.id,
      clientOperationId: randomUUID(),
      completedAt: new Date().toISOString(),
      ...(actividad.sesion === null ? {} : { idSesion: actividad.sesion }),
      ...(puntaje === undefined ? {} : { score: puntaje }),
      metadata: {},
    };
  }

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);
    await limpiar();

    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:5173';
    process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
    process.env.DATABASE_URL = urlDeLaAplicacion(URL_DUENO ?? '');
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(VerificadorDeIdentidad)
      .useClass(VerificadorDeEstaSuite)
      .compile();

    app = modulo.createNestApplication<NestExpressApplication>({ logger: false });
    configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));
    await app.init();

    await conLaCuenta(request(servidor()).post('/api/cuenta'))
      .send({ ...REGISTRO_DE_PRUEBA, nombre: 'Recorrido del catalogo' })
      .expect(200);

    // Una cuenta nueva no tiene modulos activos hasta que la persona los elige, y el sendero solo ofrece los
    // de los modulos activos.
    await conLaCuenta(request(servidor()).patch('/api/cuenta/preferencias'))
      .send({ modulosActivos: ['cognicion', 'bienestar', 'emociones'] })
      .expect(200);

    const { rows } = await dueno.query<Actividad>(
      `SELECT a.id_actividad::text AS id, a.nombre, a.motor, a.puntaje_maximo::float8 AS maximo,
              (SELECT s.id_sesion::text FROM sesion_de_actividad s
                WHERE s.id_actividad = a.id_actividad AND s.publicado
                ORDER BY s.id_sesion LIMIT 1) AS sesion
         FROM actividad a
        -- Solo el catalogo sembrado por las migraciones: la base se comparte con otras pruebas, que pueden
        -- dejar una actividad suya en medio.
        WHERE a.estado AND a.id_actividad::text LIKE '0acd0000-%' ORDER BY a.nombre`,
    );

    actividades = rows;
  });

  afterAll(async () => {
    await limpiar();
    await app?.close();
    await dueno?.end();
  });

  it('hay 35 actividades y todas las que tienen mecanica tienen una sesion publicada', () => {
    expect(actividades).toHaveLength(35);

    const sinSesion = actividades.filter((a) => a.motor !== null && a.sesion === null);

    expect(sinSesion.map((a) => a.nombre)).toEqual([]);
  });

  it('el catalogo las ofrece todas, repartidas en los tres modulos', async () => {
    const respuesta = await request(servidor()).get('/api/catalogo').expect(200);
    const categorias = respuesta.body as { nombre: string; actividades: { id: string }[] }[];

    expect(categorias.map((c) => c.nombre).sort()).toEqual(['Bienestar', 'Cognición', 'Emociones']);

    const ofrecidas = new Set(categorias.flatMap((c) => c.actividades.map((a) => a.id)));

    expect(actividades.filter((a) => !ofrecidas.has(a.id)).map((a) => a.nombre)).toEqual([]);
  });

  it('el sendero de hoy da de una a tres mecanicas rotativas por modulo, cada una con su sesion', async () => {
    const respuesta = await conLaCuenta(request(servidor()).get('/api/progreso')).expect(200);
    const modulos = respuesta.body as ModuloDelProgreso[];

    expect(modulos.map((m) => m.modulo).sort()).toEqual(['bienestar', 'cognicion', 'emociones']);

    for (const modulo of modulos) {
      // Las actividades de siempre del modulo salen siempre; lo que rota son las mecanicas del catalogo nuevo,
      // y de esas el sendero ofrece hasta tres por dia.
      const rotativas = modulo.hoy.filter((hoy) => hoy.frecuencia.tipo === 'rotativa');

      expect(rotativas.length, modulo.modulo).toBeGreaterThanOrEqual(1);
      expect(rotativas.length, modulo.modulo).toBeLessThanOrEqual(3);

      for (const hoy of modulo.hoy) {
        // Lo que tiene mecanica llega con su sesion y sus parametros; sin ellos la pantalla no sabria que hacer.
        if (hoy.motor !== undefined) {
          expect(hoy.sesion?.id, `${modulo.modulo} ${hoy.id}`).toBeDefined();
          expect(typeof hoy.sesion?.parametros, `${modulo.modulo} ${hoy.id}`).toBe('object');
        }

        expect(hoy.hecha).toBe(false);
      }
    }
  });

  describe('cada actividad registra un resultado como lo hace su pantalla', () => {
    it.each(
      // El orden importa poco; el nombre si: si una falla, se sabe cual.
      Array.from({ length: 35 }, (_unused, i) => i),
    )('la actividad %i', async (indice) => {
      const actividad = actividades[indice];

      expect(actividad).toBeDefined();

      if (actividad === undefined) {
        return;
      }

      const respuesta = await conLaCuenta(request(servidor()).post('/api/resultados'))
        .send(resultadoDe(actividad, actividad.maximo === null ? undefined : actividad.maximo))
        .expect(201);

      expect(respuesta.body, actividad.nombre).toMatchObject({ activityId: actividad.id });
    });
  });

  describe('los limites siguen en pie', () => {
    const conPuntaje = () => actividades.find((a) => a.maximo !== null && a.motor !== null);
    const sinPuntaje = () => actividades.find((a) => a.maximo === null && a.motor !== null);

    it('un puntaje por encima del maximo se rechaza', async () => {
      const actividad = conPuntaje();

      expect(actividad).toBeDefined();

      const respuesta = await conLaCuenta(request(servidor()).post('/api/resultados'))
        .send(resultadoDe(actividad as Actividad, (actividad?.maximo ?? 0) + 1))
        .expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'PUNTAJE_FUERA_DE_RANGO' });
    });

    it('una actividad que no se valora no acepta puntaje', async () => {
      const actividad = sinPuntaje();

      expect(actividad).toBeDefined();

      const respuesta = await conLaCuenta(request(servidor()).post('/api/resultados'))
        .send(resultadoDe(actividad as Actividad, 1))
        .expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'LA_ACTIVIDAD_NO_PUNTUA' });
    });

    it('reintentar la misma operacion no duplica el resultado', async () => {
      const actividad = actividades.find((a) => a.motor !== null && a.maximo === null);
      const cuerpo = resultadoDe(actividad as Actividad);

      const primera = await conLaCuenta(request(servidor()).post('/api/resultados'))
        .send(cuerpo)
        .expect(201);
      const segunda = await conLaCuenta(request(servidor()).post('/api/resultados'))
        .send(cuerpo)
        .expect(201);

      expect((segunda.body as { id: string }).id).toBe((primera.body as { id: string }).id);

      const { rows } = await dueno.query<{ n: string }>(
        'SELECT count(*) AS n FROM resultado WHERE id_operacion_cliente = $1',
        [cuerpo.clientOperationId],
      );

      expect(Number(rows[0]?.n)).toBe(1);
    });
  });

  it('la racha cuenta el dia de hoy', async () => {
    const respuesta = await conLaCuenta(request(servidor()).get('/api/racha')).expect(200);

    expect(respuesta.body).toMatchObject({ hechoHoy: true });
    expect((respuesta.body as { dias: number }).dias).toBeGreaterThanOrEqual(1);
  });

  it('el sendero marca como hechas las que se hicieron', async () => {
    const respuesta = await conLaCuenta(request(servidor()).get('/api/progreso')).expect(200);
    const modulos = respuesta.body as ModuloDelProgreso[];

    const delCatalogo = new Set(actividades.map((a) => a.id));

    for (const modulo of modulos) {
      const ofrecidas = modulo.hoy.filter((hoy) => delCatalogo.has(hoy.id));

      expect(ofrecidas.length, modulo.modulo).toBeGreaterThan(0);
      expect(
        ofrecidas.every((hoy) => hoy.hecha),
        modulo.modulo,
      ).toBe(true);
    }
  });
});
