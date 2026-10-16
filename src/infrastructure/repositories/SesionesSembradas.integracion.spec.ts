// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ActivityId, UserId } from '../../domain/model/Identifier.js';
import { Motor } from '../../domain/model/Motor.js';
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

const HOY = '2026-10-19';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
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
