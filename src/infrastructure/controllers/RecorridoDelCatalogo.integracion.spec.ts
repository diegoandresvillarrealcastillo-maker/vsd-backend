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
import { urlDeLaBaseDePruebas } from '../../pruebas/baseDePruebas.js';

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
const URL_DUENO = urlDeLaBaseDePruebas();

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

/** Una lista de rondas como la arman «Recuerda los colores» y «Secuencia de números». */
function rondasDe(cuantas: number, campo: 'largo' | 'digitos') {
  return Array.from({ length: cuantas }, (_unused, i) => ({
    [campo]: 3 + Math.floor(i / 3),
    acerto: true,
  }));
}

const COLOCACIONES = {
  manzana: 'frutas',
  pera: 'frutas',
  uva: 'frutas',
  limon: 'frutas',
  zanahoria: 'verduras',
  lechuga: 'verduras',
  tomate: 'verduras',
  cebolla: 'verduras',
};

const PASOS_COMPLETOS = { completa: true, pasos: 5, total: 5, segundos: 180 };
const RESPUESTAS_DE_PREGUNTAS = { dormir: 'si', pantallas: ['antes', 'durante'], ruido: 'poco' };

/**
 * Lo que de verdad manda la pantalla de cada actividad al terminarla: su `metadata`, con las claves y los tipos
 * que arma el frontend (numeros, textos, booleanos, listas y objetos anidados) y no un `{}`. La clave es el final
 * del identificador de la actividad. Una actividad nueva en el catalogo obliga a anadir la suya (hay una prueba
 * que lo comprueba).
 */
const CARGAS: Readonly<Record<string, Record<string, unknown>>> = {
  // Cognicion
  '0001': { intentos: 8, parejas: 6, segundos: 95 },
  '0002': { aciertos: 12, rondas: rondasDe(12, 'digitos'), largoMaximo: 7, segundos: 140 },
  '0003': { aciertos: 15, fallos: 2, sinTiempo: 0, rondas: 15, segundos: 210 },
  '000a': { aciertos: 12, rondas: rondasDe(12, 'largo'), largoMaximo: 8, segundos: 130 },
  '0102': { aciertos: 6, rondas: 6, segundos: 70 },
  '0103': {
    colocaciones: COLOCACIONES,
    segundos: 80,
    aciertos: 8,
    tarjetas: 8,
    linea: 'Fue fácil',
  },
  '0104': { aciertos: 8, rondas: 8, segundos: 100 },
  '0105': { aciertos: 15, objetivos: 15, otrosIntentos: 3, segundos: 150 },
  '0106': { aciertos: 8, elementos: 8, elegidas: 8, segundos: 45 },
  '0107': { aciertos: 6, palabras: 6, segundos: 90 },
  '0108': { tocados: 12, puntos: 12, otrosIntentos: 1, segundos: 60 },
  '0109': { aciertos: 5, rondas: 5, segundos: 65 },

  // Bienestar
  '0004': { horaDeAcostarse: '23:00', horasDormidas: 7, despertares: 0, comoAmaneciste: 'normal' },
  '0005': { respuestas: { cansancio: 4, tension: 4, pendientes: 4, animo: 4, sueno: 4 } },
  '0006': { seMovio: true, tipos: ['caminar', 'estiramientos'], duracion: '15-a-30' },
  '000b': { segundos: 240, ciclos: 6, completa: true },
  '0202': { ...PASOS_COMPLETOS },
  '0203': { respuesta: 'ya-lo-hice' },
  '0204': { respuesta: 'lo-intento-mañana' },
  '0205': { respuesta: 'ya-lo-hice' },
  '0206': { ...PASOS_COMPLETOS },
  '0207': { marcados: ['agua', 'luz-baja'] },
  '0208': { respuestas: RESPUESTAS_DE_PREGUNTAS },
  '0209': { ...PASOS_COMPLETOS, eleccion: 'sentado' },

  // Emociones
  '0007': { respuestas: { animo: 2, energia: 2, calma: 2, compania: 2, esperanza: 2 } },
  '0008': { marcadas: ['cansancio', 'pendientes', 'dinero'] },
  '0009': { encontroUno: true, texto: 'Un café tranquilo con mi hermana' },
  '000c': {
    encontroUno: true,
    textos: ['Un paseo corto', 'Un mensaje de una amiga', 'Un café caliente'],
  },
  '0301': { emocion: 'serenidad', camino: ['alegria'], linea: 'Un día tranquilo' },
  '0303': { ...PASOS_COMPLETOS },
  '0304': { colocaciones: COLOCACIONES, segundos: 70 },
  '0305': { encontroUno: true, textos: ['Mañana empiezo con calma'] },
  '0307': { ...PASOS_COMPLETOS, eleccion: 'playa' },
  '0308': { respuestas: RESPUESTAS_DE_PREGUNTAS },
  '0309': { encontroUno: true, textos: ['Hoy terminé lo importante'] },
};

/** Las pantallas donde la persona escribe, y el campo de texto libre de cada una. */
const DONDE_SE_ESCRIBE: Readonly<Record<string, (frase: string) => Record<string, unknown>>> = {
  '0009': (frase) => ({ encontroUno: true, texto: frase }),
  '000c': (frase) => ({ encontroUno: true, textos: [frase] }),
  '0103': (frase) => ({ ...CARGAS['0103'], linea: frase }),
  '0301': (frase) => ({ ...CARGAS['0301'], linea: frase }),
  '0305': (frase) => ({ encontroUno: true, textos: [frase] }),
  '0309': (frase) => ({ encontroUno: true, textos: [frase] }),
};

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
    const todas = respuesta.body as { nombre: string; actividades: { id: string }[] }[];
    // La base se comparte con otras suites, que pueden dejar una categoria suya (en CI aparecio una de otra
    // prueba): solo cuentan las que traen actividades del catalogo sembrado.
    const categorias = todas.filter((c) => c.actividades.some((a) => a.id.startsWith('0acd0000-')));

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

  describe('cada actividad guarda lo que manda su pantalla, y lo devuelve igual', () => {
    function actividadDe(sufijo: string): Actividad {
      const actividad = actividades.find((a) => a.id.endsWith(sufijo));

      if (actividad === undefined) {
        throw new Error(`No hay una actividad que termine en ${sufijo}.`);
      }

      return actividad;
    }

    it('hay una carga por cada actividad del catalogo, y ninguna de mas', () => {
      expect(Object.keys(CARGAS).sort()).toEqual(actividades.map((a) => a.id.slice(-4)).sort());
    });

    it.each(Object.keys(CARGAS))('la actividad ...%s', async (sufijo) => {
      const actividad = actividadDe(sufijo);
      const metadata = CARGAS[sufijo];
      const cuerpo = {
        ...resultadoDe(actividad, actividad.maximo === null ? undefined : actividad.maximo),
        metadata,
      };

      const respuesta = await conLaCuenta(request(servidor()).post('/api/resultados'))
        .send(cuerpo)
        .expect(201);
      const dicho = respuesta.body as Record<string, unknown>;

      // Vuelve como se mando: nada se pierde ni se cambia por el camino.
      expect(dicho['metadata'], actividad.nombre).toEqual(metadata);
      // Un resultado solo trae nivel si la actividad se valora, y uno solo no pide acompanamiento.
      expect('nivelOrientativo' in dicho, actividad.nombre).toBe(actividad.maximo !== null);
      expect(dicho['sugiereAcompanamiento'], actividad.nombre).toBe(false);

      // Y esta en la base como se mando.
      const { rows } = await dueno.query<{ metadata: unknown }>(
        'SELECT metadata FROM resultado WHERE id_operacion_cliente = $1',
        [cuerpo.clientOperationId],
      );

      expect(rows[0]?.metadata, actividad.nombre).toEqual(metadata);
    });

    describe('lo que la persona escribe pasa por la comprobacion de riesgo, en cada pantalla donde escribe', () => {
      const FRASE_DE_RIESGO = 'quiero morirme';

      it.each(Object.keys(DONDE_SE_ESCRIBE))('la actividad ...%s', async (sufijo) => {
        const actividad = actividadDe(sufijo);
        const escribir = DONDE_SE_ESCRIBE[sufijo];

        expect(escribir, sufijo).toBeDefined();

        const respuesta = await conLaCuenta(request(servidor()).post('/api/resultados'))
          .send({
            ...resultadoDe(actividad, actividad.maximo === null ? undefined : actividad.maximo),
            metadata: escribir?.(FRASE_DE_RIESGO),
          })
          .expect(201);
        const dicho = respuesta.body as {
          sugiereAcompanamiento: boolean;
          lineasDeAtencion: unknown[];
        };

        expect(dicho.sugiereAcompanamiento, actividad.nombre).toBe(true);
        expect(dicho.lineasDeAtencion.length, actividad.nombre).toBeGreaterThan(0);
      });
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
