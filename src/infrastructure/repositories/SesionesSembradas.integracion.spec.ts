// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ActivityId, UserId } from '../../domain/model/Identifier.js';
import { Motor } from '../../domain/model/Motor.js';
import { problemaDeLosParametros } from '../../domain/model/ParametrosDelMotor.js';
import { problemasDeContenido } from '../../pruebas/contenidoDeSesiones.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaSesionesRepository } from './PrismaSesionesRepository.js';

/**
 * El contenido que se siembra con migraciones, comprobado contra la base de verdad (SCRUM-207, ADR 0030).
 *
 * Es el sitio de las pruebas automaticas del contenido: **toda sesion de las categorias del catalogo**
 * pasa por el contrato de su motor, el filtro de lenguaje clinico (R6) y la lista de exclusion (R14), sea
 * de la Fase 0 o de un lote posterior. Un lote nuevo no necesita una prueba nueva: entra aqui solo.
 *
 * Solo se miran las categorias del catalogo (`Cognición`, `Bienestar`, `Emociones`) y no toda la tabla:
 * otras suites de integracion siembran mecanicas de prueba a la vez, y una sesion rota a proposito en
 * una de ellas no puede hacer fallar esta.
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const CATEGORIAS = ['Cognición', 'Bienestar', 'Emociones'];

/** Las que pasan al modelo en la Fase 0, con el motor y el maximo del catalogo que tienen que conservar. */
const DE_LA_FASE_0 = [
  {
    id: '0acd0000-0000-4000-8000-000000000002',
    sesion: '5e510000-0000-4000-8000-000000000002',
    nombre: 'Secuencia de números',
    motor: Motor.SECUENCIA,
    maximo: 12,
  },
  {
    id: '0acd0000-0000-4000-8000-000000000003',
    sesion: '5e510000-0000-4000-8000-000000000003',
    nombre: 'Encuentra la diferencia',
    motor: Motor.TOCAR_EL_OBJETIVO,
    maximo: 15,
  },
  {
    id: '0acd0000-0000-4000-8000-000000000005',
    sesion: '5e510000-0000-4000-8000-000000000005',
    nombre: 'La carga de tu semana',
    motor: Motor.CUESTIONARIO_CORTO,
    maximo: 20,
  },
  {
    id: '0acd0000-0000-4000-8000-000000000007',
    sesion: '5e510000-0000-4000-8000-000000000007',
    nombre: 'Cómo te sientes hoy',
    motor: Motor.CUESTIONARIO_CORTO,
    maximo: 10,
  },
  {
    id: '0acd0000-0000-4000-8000-000000000009',
    sesion: '5e510000-0000-4000-8000-000000000009',
    nombre: 'Un momento bueno del día',
    motor: Motor.ESCRITURA_BREVE,
    maximo: null,
  },
] as const;

/** Pantallas propias: se quedan sin motor hasta que existan los motores que las lleven. */
const SIN_MOTOR = [
  '0acd0000-0000-4000-8000-000000000001', // Parejas de cartas
  '0acd0000-0000-4000-8000-000000000004', // Cómo dormiste anoche
  '0acd0000-0000-4000-8000-000000000006', // Movimiento del día
  '0acd0000-0000-4000-8000-000000000008', // Qué te está pesando
];

/**
 * El piloto (SCRUM-212, ADR 0030): tres mecanicas nuevas, rotativas, con sus diez sesiones. COG-01 no
 * pide revision; BIE-01 y EMO-02 si, y esperan a quien las revise (`[C7-43]`).
 */
const DEL_PILOTO = [
  {
    id: '0acd0000-0000-4000-8000-00000000000a',
    nombre: 'Recuerda los colores',
    categoria: 'Cognición',
    tipo: 'juego',
    motor: Motor.SECUENCIA,
    maximo: 12,
    revision: 'no_requiere',
  },
  {
    id: '0acd0000-0000-4000-8000-00000000000b',
    nombre: 'Respiración guiada',
    categoria: 'Bienestar',
    tipo: 'bitacora',
    motor: Motor.GUIA_PASO_A_PASO,
    maximo: null,
    revision: 'pendiente',
  },
  {
    id: '0acd0000-0000-4000-8000-00000000000c',
    nombre: 'Tres cosas buenas',
    categoria: 'Emociones',
    tipo: 'bitacora',
    motor: Motor.ESCRITURA_BREVE,
    maximo: null,
    revision: 'pendiente',
  },
] as const;

const [COLORES, RESPIRACION, TRES_COSAS] = DEL_PILOTO;

/** Las diez sesiones, en el orden de la hoja de aprobacion del plan (COG-01, BIE-01, EMO-02). */
const SESIONES_DEL_PILOTO = [
  {
    id: '5e510001-0000-4000-8000-000000000001',
    actividad: COLORES,
    titulo: 'Cuatro colores',
    nivel: 1,
  },
  {
    id: '5e510001-0000-4000-8000-000000000002',
    actividad: COLORES,
    titulo: 'Seis colores',
    nivel: 2,
  },
  {
    id: '5e510001-0000-4000-8000-000000000003',
    actividad: COLORES,
    titulo: 'Nueve colores',
    nivel: 3,
  },
  {
    id: '5e510001-0000-4000-8000-000000000004',
    actividad: COLORES,
    titulo: 'Cuatro colores, con calma',
    nivel: 1,
  },
  {
    id: '5e510001-0000-4000-8000-000000000005',
    actividad: RESPIRACION,
    titulo: 'Inhalar 4, exhalar 6',
    nivel: 1,
  },
  {
    id: '5e510001-0000-4000-8000-000000000006',
    actividad: RESPIRACION,
    titulo: 'Cinco y cinco',
    nivel: 1,
  },
  {
    id: '5e510001-0000-4000-8000-000000000007',
    actividad: RESPIRACION,
    titulo: 'Cuatro y cuatro, con pausa',
    nivel: 1,
  },
  {
    id: '5e510001-0000-4000-8000-000000000008',
    actividad: TRES_COSAS,
    titulo: 'Algo que probaste',
    nivel: 1,
  },
  {
    id: '5e510001-0000-4000-8000-000000000009',
    actividad: TRES_COSAS,
    titulo: 'Alguien que…',
    nivel: 1,
  },
  {
    id: '5e510001-0000-4000-8000-000000000010',
    actividad: TRES_COSAS,
    titulo: 'Un lugar',
    nivel: 1,
  },
] as const;

/** Las nueve casillas del piloto, en orden: cada sesion usa las primeras. Las formas y los colores son los que dibuja el frontend. */
const CASILLAS_DEL_PILOTO = [
  { nombre: 'círculo verde', forma: 'circulo', color: 'verde' },
  { nombre: 'cuadrado azul', forma: 'cuadrado', color: 'azul' },
  { nombre: 'triángulo ámbar', forma: 'triangulo', color: 'ambar' },
  { nombre: 'rombo violeta', forma: 'rombo', color: 'violeta' },
  { nombre: 'estrella rosa', forma: 'estrella', color: 'rosa' },
  { nombre: 'hoja turquesa', forma: 'hoja', color: 'turquesa' },
  { nombre: 'gota gris', forma: 'gota', color: 'gris' },
  { nombre: 'luna naranja', forma: 'luna', color: 'naranja' },
  { nombre: 'nube marrón', forma: 'nube', color: 'marron' },
] as const;

const ADVERTENCIA_DE_LA_RESPIRACION =
  'Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.';

const HOY = '2026-10-19';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

/** El SQL de la migracion que publica «Recuerda los colores», leido tal cual esta en el repositorio. */
function migracionDeLaPublicacion(): string {
  const carpeta = join(process.cwd(), 'prisma', 'migrations');
  const nombres = readdirSync(carpeta).filter((nombre) => nombre.includes('publicar_recuerda'));

  expect(nombres, 'la migracion que publica COG-01').toHaveLength(1);

  return readFileSync(join(carpeta, nombres[0] as string, 'migration.sql'), 'utf8');
}

/** El SQL de la migracion del piloto, leido tal cual esta en el repositorio. */
function migracionDelPiloto(): string {
  const carpeta = join(process.cwd(), 'prisma', 'migrations');
  const nombres = readdirSync(carpeta).filter((nombre) => nombre.includes('piloto'));

  expect(nombres, 'la migracion del piloto').toHaveLength(1);

  return readFileSync(join(carpeta, nombres[0] as string, 'migration.sql'), 'utf8');
}

/** El SQL de la migracion de la Fase 0, leido tal cual esta en el repositorio. */
function migracionDeLaFase0(): string {
  const carpeta = join(process.cwd(), 'prisma', 'migrations');
  const nombres = readdirSync(carpeta).filter((nombre) => nombre.includes('fase_0'));

  expect(nombres, 'la migracion de la Fase 0').toHaveLength(1);

  return readFileSync(join(carpeta, nombres[0] as string, 'migration.sql'), 'utf8');
}

interface FilaDeActividad {
  readonly id: string;
  readonly nombre: string;
  readonly motor: string | null;
  readonly frecuencia: string;
  readonly maximo: number | null;
}

interface FilaDeSesion {
  readonly id: string;
  readonly idActividad: string;
  readonly titulo: string;
  readonly nivel: number;
  readonly parametros: Record<string, unknown>;
  readonly publicado: boolean;
  readonly revision: string;
}

describe.skipIf(URL_DUENO === undefined)('las sesiones sembradas, contra PostgreSQL', () => {
  let dueno: Client;
  let prisma: PrismaService;
  let repositorio: PrismaSesionesRepository;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);

    prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
    await prisma.onModuleInit();
    repositorio = new PrismaSesionesRepository(prisma);
  });

  afterAll(async () => {
    await prisma?.onModuleDestroy();
    await dueno?.end();
  });

  async function actividades(ids: readonly string[]): Promise<FilaDeActividad[]> {
    const { rows } = await dueno.query<FilaDeActividad>(
      `SELECT id_actividad::text AS id, nombre, motor, frecuencia::text AS frecuencia,
              puntaje_maximo::float8 AS maximo
       FROM actividad WHERE id_actividad = ANY($1::uuid[]) ORDER BY id_actividad`,
      [ids],
    );

    return rows;
  }

  async function sesionesDe(ids: readonly string[]): Promise<FilaDeSesion[]> {
    const { rows } = await dueno.query<FilaDeSesion>(
      `SELECT id_sesion::text AS id, id_actividad::text AS "idActividad", titulo, nivel::int AS nivel,
              parametros, publicado, revision
       FROM sesion_de_actividad WHERE id_actividad = ANY($1::uuid[]) ORDER BY id_actividad, id_sesion`,
      [ids],
    );

    return rows;
  }

  describe('la Fase 0: cinco actividades pasan al modelo sin cambiar lo que se ve', () => {
    const ids = DE_LA_FASE_0.map((actividad) => actividad.id);

    it('cada una tiene el motor que le toca', async () => {
      const filas = await actividades(ids);

      expect(filas.map((fila) => [fila.id, fila.motor])).toEqual(
        DE_LA_FASE_0.map((esperada) => [esperada.id, esperada.motor]),
      );
    });

    it('el catalogo no cambia: mismo maximo y ninguna pasa a rotativa, conservan su frecuencia', async () => {
      const filas = await actividades(ids);

      expect(filas.map((fila) => fila.maximo)).toEqual(
        DE_LA_FASE_0.map((esperada) => esperada.maximo),
      );
      expect(filas.map((fila) => fila.frecuencia)).not.toContain('rotativa');
    });

    it('las cuatro pantallas propias siguen sin motor', async () => {
      const filas = await actividades(SIN_MOTOR);

      expect(filas).toHaveLength(4);
      expect(filas.map((fila) => fila.motor)).toEqual([null, null, null, null]);
      expect(await sesionesDe(SIN_MOTOR)).toEqual([]);
    });

    it('cada una tiene una sola sesion: la de siempre, publicada, de nivel 1 y que no pide revision', async () => {
      const sesiones = await sesionesDe(ids);

      expect(sesiones.map((sesion) => [sesion.idActividad, sesion.id])).toEqual(
        DE_LA_FASE_0.map((esperada) => [esperada.id, esperada.sesion]),
      );

      for (const sesion of sesiones) {
        expect(sesion.publicado, sesion.titulo).toBe(true);
        expect(sesion.nivel, sesion.titulo).toBe(1);
        expect(sesion.revision, sesion.titulo).toBe('no_requiere');
      }
    });

    it('el dominio las lee: cumplen el contrato de su motor', async () => {
      const persona = new UserId(randomUUID());
      const mapa = await repositorio.sesionesDeHoy(
        persona,
        ids.map((id) => new ActivityId(id)),
        HOY,
      );

      expect([...mapa.keys()].sort()).toEqual([...ids].sort());

      for (const esperada of DE_LA_FASE_0) {
        expect(mapa.get(esperada.id)?.id.value, esperada.nombre).toBe(esperada.sesion);
      }
    });

    it('el maximo del cuestionario sale de sus preguntas y opciones y coincide con el catalogo', async () => {
      const cuestionarios = DE_LA_FASE_0.filter(
        (esperada) => esperada.motor === Motor.CUESTIONARIO_CORTO,
      );
      const sesiones = await sesionesDe(cuestionarios.map((c) => c.id));

      expect(sesiones).toHaveLength(2);

      for (const sesion of sesiones) {
        const preguntas = sesion.parametros['preguntas'] as unknown[];
        const opciones = sesion.parametros['opciones'] as { valor: number }[];
        const esperado = cuestionarios.find((c) => c.id === sesion.idActividad)?.maximo;

        expect(preguntas.length * Math.max(...opciones.map((o) => o.valor)), sesion.titulo).toBe(
          esperado,
        );
      }
    });

    it('las rondas de los juegos coinciden con el maximo del catalogo: una ronda acertada, un punto', async () => {
      const juegos = DE_LA_FASE_0.filter(
        (esperada) =>
          esperada.motor === Motor.SECUENCIA || esperada.motor === Motor.TOCAR_EL_OBJETIVO,
      );
      const sesiones = await sesionesDe(juegos.map((juego) => juego.id));

      expect(sesiones).toHaveLength(2);

      for (const sesion of sesiones) {
        const esperado = juegos.find((juego) => juego.id === sesion.idActividad)?.maximo;

        expect(sesion.parametros['rondas'], sesion.titulo).toBe(esperado);
      }
    });

    it('la migracion siembra la sesion ANTES de poner el motor: ninguna mecanica queda con motor y sin sesion', () => {
      // Una mecanica con motor y sin sesion que dar desaparece del sendero. Si la migracion se
      // interrumpiera a la mitad, el orden contrario deja una sesion sin usar, que no hace dano.
      const sentencias = migracionDeLaFase0()
        .split('\n')
        .filter((linea) => !linea.trimStart().startsWith('--'))
        .join('\n');
      const sesiones = sentencias.indexOf('INSERT INTO "sesion_de_actividad"');
      const motores = sentencias.indexOf('UPDATE "actividad" SET "motor"');

      expect(sesiones).toBeGreaterThanOrEqual(0);
      expect(motores).toBeGreaterThan(sesiones);
    });

    it('aplicar la migracion dos veces deja todo igual', async () => {
      const sql = migracionDeLaFase0();
      const foto = async () => ({
        actividades: await actividades(ids),
        sesiones: await sesionesDe(ids),
      });

      await dueno.query('BEGIN');

      try {
        const antes = await foto();

        await dueno.query(sql);
        await dueno.query(sql);

        expect(await foto()).toEqual(antes);
      } finally {
        await dueno.query('ROLLBACK');
      }
    });
  });

  describe('el piloto: tres mecanicas nuevas y diez sesiones', () => {
    const idsDeLasActividades = DEL_PILOTO.map((actividad) => actividad.id);

    interface FichaDeActividad {
      readonly id: string;
      readonly nombre: string;
      readonly categoria: string;
      readonly tipo: string;
      readonly motor: string | null;
      readonly frecuencia: string;
      readonly estado: boolean;
      readonly desdeSesion: number;
      readonly direccion: string;
      readonly maximo: number | null;
      readonly umbrales: Record<string, number> | null;
      readonly textosNivel: Record<string, string> | null;
      readonly descripcion: string;
    }

    async function fichas(): Promise<FichaDeActividad[]> {
      const { rows } = await dueno.query<FichaDeActividad>(
        `SELECT a.id_actividad::text AS id, a.nombre, c.nombre AS categoria, a.tipo, a.motor,
                a.frecuencia::text AS frecuencia, a.estado, a.desde_sesion::int AS "desdeSesion",
                a.direccion_escala::text AS direccion, a.puntaje_maximo::float8 AS maximo,
                a.umbrales, a.textos_nivel AS "textosNivel", a.descripcion
         FROM actividad a JOIN categoria c ON c.id_categoria = a.id_categoria
         WHERE a.id_actividad = ANY($1::uuid[]) ORDER BY a.id_actividad`,
        [idsDeLasActividades],
      );

      return rows;
    }

    it('las tres mecanicas existen, en su categoria, con su motor y rotativas', async () => {
      const filas = await fichas();

      expect(
        filas.map((fila) => ({
          id: fila.id,
          nombre: fila.nombre,
          categoria: fila.categoria,
          tipo: fila.tipo,
          motor: fila.motor,
          frecuencia: fila.frecuencia,
          estado: fila.estado,
          desdeSesion: fila.desdeSesion,
        })),
      ).toEqual(
        DEL_PILOTO.map((esperada) => ({
          id: esperada.id,
          nombre: esperada.nombre,
          categoria: esperada.categoria,
          tipo: esperada.tipo,
          motor: esperada.motor,
          frecuencia: 'rotativa',
          estado: true,
          desdeSesion: 1,
        })),
      );
    });

    it('«Recuerda los colores» puntua como un juego, y las otras dos no puntuan', async () => {
      const [juego, ...bitacoras] = await fichas();

      expect(juego?.direccion).toBe('mayor_es_mejor');
      expect(juego?.maximo).toBe(12);
      expect(Object.keys(juego?.umbrales ?? {}).sort()).toEqual(['primero', 'segundo']);
      expect(juego?.umbrales?.['primero']).toBeGreaterThan(0);
      expect(juego?.umbrales?.['segundo']).toBeGreaterThan(juego?.umbrales?.['primero'] ?? 1);
      expect(juego?.umbrales?.['segundo']).toBeLessThan(1);
      expect(Object.keys(juego?.textosNivel ?? {}).sort()).toEqual([
        'en_seguimiento',
        'favorable',
        'requiere_atencion',
      ]);

      expect(bitacoras).toHaveLength(2);

      for (const bitacora of bitacoras) {
        expect(bitacora.direccion, bitacora.nombre).toBe('sin_puntaje');
        expect(bitacora.maximo, bitacora.nombre).toBeNull();
        expect(bitacora.umbrales, bitacora.nombre).toBeNull();
        expect(bitacora.textosNivel, bitacora.nombre).toBeNull();
      }
    });

    it('lo que dicen las tres de si mismas pasa por el lenguaje clinico (R6) y la lista de exclusion (R14)', async () => {
      const filas = await fichas();

      // Sin filas no hay nada que mirar, y «no hay problemas» seria cierto por no haber nada.
      expect(filas).toHaveLength(3);

      const problemas = filas.flatMap((ficha) =>
        problemasDeContenido({
          titulo: ficha.nombre,
          parametros: [ficha.descripcion, ficha.textosNivel],
        }).map((problema) => `${ficha.nombre}: ${problema}`),
      );

      expect(problemas).toEqual([]);
    });

    it('hay diez sesiones, cuatro, tres y tres, cada una en su mecanica y con su nivel', async () => {
      const sesiones = await sesionesDe(idsDeLasActividades);

      expect(
        sesiones.map((sesion) => [sesion.id, sesion.idActividad, sesion.titulo, sesion.nivel]),
      ).toEqual(
        SESIONES_DEL_PILOTO.map((esperada) => [
          esperada.id,
          esperada.actividad.id,
          esperada.titulo,
          esperada.nivel,
        ]),
      );
    });

    it('las cuatro de COG-01 estan publicadas y las seis de BIE-01 y EMO-02 siguen sin publicar y pendientes', async () => {
      const sesiones = await sesionesDe(idsDeLasActividades);

      expect(sesiones).toHaveLength(10);

      for (const sesion of sesiones) {
        const esperada = SESIONES_DEL_PILOTO.find((una) => una.id === sesion.id);
        const esDeColores = sesion.idActividad === COLORES.id;

        // COG-01 no pide revision y se publico (SCRUM-217); las otras dos esperan a quien las revise.
        expect(sesion.publicado, sesion.titulo).toBe(esDeColores);
        expect(sesion.revision, sesion.titulo).toBe(esperada?.actividad.revision);
      }
    });

    it('cada una cumple el contrato de su motor', async () => {
      const sesiones = await sesionesDe(idsDeLasActividades);

      expect(sesiones).toHaveLength(10);

      for (const sesion of sesiones) {
        const motor = DEL_PILOTO.find((actividad) => actividad.id === sesion.idActividad)?.motor;

        expect(motor, sesion.titulo).toBeDefined();
        expect(
          problemaDeLosParametros(motor ?? null, sesion.parametros),
          sesion.titulo,
        ).toBeUndefined();
      }
    });

    it('solo se ofrece «Recuerda los colores»: BIE-01 y EMO-02 no salen mientras esperen revision', async () => {
      // Existen las tres, y solo la que tiene una sesion publicada se ofrece.
      expect(await fichas()).toHaveLength(3);

      const persona = new UserId(randomUUID());
      const actividades = idsDeLasActividades.map((id) => new ActivityId(id));

      // Las dos lecturas que usa el sendero: la sesion que toca, y si la mecanica tiene alguna.
      const hoy = await repositorio.sesionesDeHoy(persona, actividades, HOY);

      expect([...hoy.keys()]).toEqual([COLORES.id]);
      expect(
        (await repositorio.mecanicasConSesion(persona, actividades, HOY)).has(COLORES.id),
      ).toBe(true);
      expect((await repositorio.mecanicasConSesion(persona, actividades, HOY)).size).toBe(1);

      // Y la que se ofrece es una de las cuatro, ya leida por el dominio: cumple el contrato de su
      // motor (un contenido que no lo cumpliera haria fallar esta lectura).
      const sesionDeHoy = hoy.get(COLORES.id);
      const lasCuatro = SESIONES_DEL_PILOTO.filter((una) => una.actividad.id === COLORES.id);

      expect(lasCuatro.map((una) => una.id)).toContain(sesionDeHoy?.id.value);
      expect(sesionDeHoy?.publicado).toBe(true);
    });

    it.each(SESIONES_DEL_PILOTO.filter((sesion) => sesion.actividad.revision === 'pendiente'))(
      '«$titulo» espera revision: la base impide publicarla',
      async ({ id }) => {
        await dueno.query('BEGIN');

        try {
          await expect(
            dueno.query('UPDATE sesion_de_actividad SET publicado = true WHERE id_sesion = $1', [
              id,
            ]),
          ).rejects.toThrow(/sesion_de_actividad_publicada_revisada/);
        } finally {
          await dueno.query('ROLLBACK');
        }
      },
    );

    it('«Recuerda los colores»: forma, nombre y color en cada casilla, y el destello cabe en el turno', async () => {
      const sesiones = await sesionesDe([COLORES.id]);
      const esperadas = [
        { casillas: 4, largoInicial: 3, msPorElemento: 1000, msDestello: 700 },
        { casillas: 6, largoInicial: 3, msPorElemento: 1000, msDestello: 700 },
        { casillas: 9, largoInicial: 4, msPorElemento: 1000, msDestello: 700 },
        // La lenta: 1.100 ms iluminada y 600 ms de pausa.
        { casillas: 4, largoInicial: 3, msPorElemento: 1700, msDestello: 1100 },
      ];

      expect(sesiones).toHaveLength(4);

      sesiones.forEach((sesion, i) => {
        const esperada = esperadas[i];
        const p = sesion.parametros as {
          casillas: { clave: string; nombre: string; forma: string; color: string }[];
          [clave: string]: unknown;
        };

        // Las primeras de la misma paleta, en el mismo orden: cada casilla con forma y color.
        expect(
          p.casillas.map(({ nombre, forma, color }) => ({ nombre, forma, color })),
          sesion.titulo,
        ).toEqual(CASILLAS_DEL_PILOTO.slice(0, esperada?.casillas));
        expect(p['largoInicial'], sesion.titulo).toBe(esperada?.largoInicial);
        expect(p['msPorElemento'], sesion.titulo).toBe(esperada?.msPorElemento);
        expect(p['msDestello'], sesion.titulo).toBe(esperada?.msDestello);
        expect(p['msDeMargen'], sesion.titulo).toBe(1000);
        // Una ronda acertada, un punto: el maximo del catalogo es el de las rondas.
        expect(p['rondas'], sesion.titulo).toBe(COLORES.maximo);
      });
    });

    it('«Respiración guiada»: el aviso va con cada una, el patron es el de su titulo y ninguna pausa pasa de 4 s', async () => {
      const sesiones = await sesionesDe([RESPIRACION.id]);
      const patrones = [
        { inhalaSegundos: 4, exhalaSegundos: 6, pausaSegundos: 0 },
        { inhalaSegundos: 5, exhalaSegundos: 5, pausaSegundos: 0 },
        { inhalaSegundos: 4, exhalaSegundos: 4, pausaSegundos: 2 },
      ];

      expect(sesiones).toHaveLength(3);

      sesiones.forEach((sesion, i) => {
        const p = sesion.parametros as {
          patron: { pausaSegundos: number };
          frases: string[];
          [clave: string]: unknown;
        };

        expect(p['advertenciaInicial'], sesion.titulo).toBe(ADVERTENCIA_DE_LA_RESPIRACION);
        expect(p.patron, sesion.titulo).toEqual(patrones[i]);
        expect(p.patron.pausaSegundos, sesion.titulo).toBeLessThanOrEqual(4);
        expect(p['duracionSegundos'], sesion.titulo).toBe(120);
        expect(p.frases.length, sesion.titulo).toBeGreaterThan(0);
      });
    });

    it('«Tres cosas buenas»: tres campos, con una basta, y se puede decir que hoy no sale ninguna', async () => {
      const sesiones = await sesionesDe([TRES_COSAS.id]);
      const invitaciones = [
        'Algo que probaste hoy, aunque sea pequeño.',
        'Alguien que te hizo el rato más fácil.',
        'Un lugar donde estuviste a gusto.',
      ];

      expect(sesiones).toHaveLength(3);

      sesiones.forEach((sesion, i) => {
        expect(sesion.parametros, sesion.titulo).toEqual({
          invitacion: invitaciones[i],
          campos: 3,
          minimo: 1,
          largoMaximo: 200,
          permiteNingunaHoy: true,
        });
      });
    });

    it('la migracion siembra la actividad ANTES que sus sesiones: una sesion necesita su mecanica', () => {
      const sentencias = migracionDelPiloto()
        .split('\n')
        .filter((linea) => !linea.trimStart().startsWith('--'))
        .join('\n');
      const actividadesPrimero = sentencias.indexOf('INSERT INTO "actividad"');
      const sesionesDespues = sentencias.indexOf('INSERT INTO "sesion_de_actividad"');

      expect(actividadesPrimero).toBeGreaterThanOrEqual(0);
      expect(sesionesDespues).toBeGreaterThan(actividadesPrimero);
    });

    it('aplicar la migracion dos veces deja todo igual', async () => {
      const sql = migracionDelPiloto();
      const foto = async () => ({
        actividades: await fichas(),
        sesiones: await sesionesDe(idsDeLasActividades),
      });

      await dueno.query('BEGIN');

      try {
        const antes = await foto();

        await dueno.query(sql);
        await dueno.query(sql);

        expect(await foto()).toEqual(antes);
      } finally {
        await dueno.query('ROLLBACK');
      }
    });
  });

  describe('la publicacion de «Recuerda los colores» (SCRUM-217)', () => {
    const LAS_CUATRO: readonly string[] = SESIONES_DEL_PILOTO.filter(
      (una) => una.actividad.id === COLORES.id,
    ).map((una) => una.id);

    /** Todas las sesiones del catalogo y su estado, para comparar antes y despues. */
    async function todas() {
      const { rows } = await dueno.query<{
        id: string;
        publicado: boolean;
        revision: string;
        huella: string;
      }>(
        `SELECT s.id_sesion::text AS id, s.publicado, s.revision,
                md5(convert_to(concat_ws('|', s.titulo, s.nivel::text, s.parametros::text), 'UTF8')) AS huella
         FROM sesion_de_actividad s
         JOIN actividad a ON a.id_actividad = s.id_actividad
         JOIN categoria c ON c.id_categoria = a.id_categoria
         WHERE c.nombre = ANY($1) ORDER BY s.id_sesion`,
        [CATEGORIAS],
      );

      return rows;
    }

    /** Deja las cuatro sin publicar, como estaban antes de la migracion, dentro de la transaccion. */
    async function quitarLaPublicacion() {
      await dueno.query(
        'UPDATE sesion_de_actividad SET publicado = false WHERE id_sesion = ANY($1::uuid[])',
        [LAS_CUATRO],
      );
    }

    it('publica las cuatro de COG-01 y nada mas: el resto del catalogo queda como estaba', async () => {
      await dueno.query('BEGIN');

      try {
        await quitarLaPublicacion();

        const antes = await todas();

        await dueno.query(migracionDeLaPublicacion());

        const despues = await todas();

        expect(
          antes.filter((fila) => LAS_CUATRO.includes(fila.id)).map((fila) => fila.publicado),
        ).toEqual([false, false, false, false]);
        expect(
          despues.filter((fila) => LAS_CUATRO.includes(fila.id)).map((fila) => fila.publicado),
        ).toEqual([true, true, true, true]);
        // Todo lo demas, igual: ni el estado, ni la revision, ni el contenido.
        const otras = (filas: typeof antes) =>
          filas.filter((fila) => !LAS_CUATRO.includes(fila.id));

        expect(otras(despues)).toEqual(otras(antes));
        expect(otras(despues).length).toBeGreaterThanOrEqual(11);
      } finally {
        await dueno.query('ROLLBACK');
      }
    });

    it('no cambia el contenido de las cuatro: solo su publicacion', async () => {
      await dueno.query('BEGIN');

      try {
        await quitarLaPublicacion();

        const antes = await todas();

        await dueno.query(migracionDeLaPublicacion());

        const despues = await todas();

        expect(despues.map((fila) => [fila.id, fila.huella, fila.revision])).toEqual(
          antes.map((fila) => [fila.id, fila.huella, fila.revision]),
        );
      } finally {
        await dueno.query('ROLLBACK');
      }
    });

    it('aplicarla dos veces deja todo igual', async () => {
      await dueno.query('BEGIN');

      try {
        await quitarLaPublicacion();
        await dueno.query(migracionDeLaPublicacion());

        const unaVez = await todas();

        await dueno.query(migracionDeLaPublicacion());

        expect(await todas()).toEqual(unaVez);
      } finally {
        await dueno.query('ROLLBACK');
      }
    });

    it('no publica una que pida revision: si una de las cuatro llegara a ser pendiente, se queda como esta', async () => {
      await dueno.query('BEGIN');

      try {
        await quitarLaPublicacion();
        // Pasa a pendiente sin publicar (la base no deja publicar una pendiente).
        await dueno.query(
          "UPDATE sesion_de_actividad SET revision = 'pendiente' WHERE id_sesion = $1",
          [LAS_CUATRO[0]],
        );
        await dueno.query(migracionDeLaPublicacion());

        const filas = await todas();
        const estado = (id: string | undefined) => filas.find((fila) => fila.id === id)?.publicado;

        expect(estado(LAS_CUATRO[0])).toBe(false);
        expect(LAS_CUATRO.slice(1).map(estado)).toEqual([true, true, true]);
      } finally {
        await dueno.query('ROLLBACK');
      }
    });

    it('nombra las cuatro por su identificador: una sesion que se siembre despues en la mecanica no se publica sola', async () => {
      await dueno.query('BEGIN');

      try {
        // Una con un identificador cualquiera y otra con el prefijo del piloto: ninguna es de las cuatro.
        const posteriores = [randomUUID(), '5e510001-0000-4000-8000-0000000000aa'];

        for (const nueva of posteriores) {
          await dueno.query(
            `INSERT INTO sesion_de_actividad (id_sesion, id_actividad, titulo, nivel, parametros, publicado, revision)
             SELECT $1, id_actividad, 'Una posterior', 1, parametros, false, 'no_requiere'
             FROM sesion_de_actividad WHERE id_sesion = $2`,
            [nueva, LAS_CUATRO[0]],
          );
        }

        await dueno.query(migracionDeLaPublicacion());

        const { rows } = await dueno.query<{ id: string; publicado: boolean }>(
          'SELECT id_sesion::text AS id, publicado FROM sesion_de_actividad WHERE id_sesion = ANY($1::uuid[])',
          [posteriores],
        );

        expect(rows).toHaveLength(2);
        expect(rows.map((fila) => fila.publicado)).toEqual([false, false]);
      } finally {
        await dueno.query('ROLLBACK');
      }
    });

    it('lo unico que hace es publicar: una sola sentencia UPDATE de publicado, sin borrar ni sembrar', () => {
      const sentencias = migracionDeLaPublicacion()
        .split('\n')
        .filter((linea) => !linea.trimStart().startsWith('--'))
        .join('\n');

      expect(sentencias.match(/\bUPDATE\b/g)).toHaveLength(1);
      expect(sentencias).toMatch(/SET "publicado" = TRUE/);
      expect(sentencias).not.toMatch(/\b(INSERT|DELETE|DROP|ALTER|TRUNCATE)\b/);
    });
  });

  describe('todo el contenido del catalogo', () => {
    it('cada sesion pasa por las pruebas del contenido: lenguaje clinico (R6) y lista de exclusion (R14)', async () => {
      const { rows } = await dueno.query<FilaDeSesion>(
        `SELECT s.id_sesion::text AS id, s.titulo, s.parametros
         FROM sesion_de_actividad s
         JOIN actividad a ON a.id_actividad = s.id_actividad
         JOIN categoria c ON c.id_categoria = a.id_categoria
         WHERE c.nombre = ANY($1)`,
        [CATEGORIAS],
      );

      expect(rows.length).toBeGreaterThanOrEqual(DE_LA_FASE_0.length);

      const problemas = rows.flatMap((fila) =>
        problemasDeContenido(fila).map((problema) => `${fila.titulo}: ${problema}`),
      );

      expect(problemas).toEqual([]);
    });
  });
});
