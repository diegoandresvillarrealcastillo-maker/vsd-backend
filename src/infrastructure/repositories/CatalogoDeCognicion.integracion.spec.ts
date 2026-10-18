// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ActivityId, SesionId, UserId } from '../../domain/model/Identifier.js';
import { type Motor } from '../../domain/model/Motor.js';
import { problemaDeLosParametros } from '../../domain/model/ParametrosDelMotor.js';
import { loteDeCognicion } from '../../pruebas/catalogo/cognicion/index.ts';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaSesionesRepository } from './PrismaSesionesRepository.js';

/**
 * El catalogo de Cognicion (SCRUM-222), comprobado contra PostgreSQL de verdad: lo que la migracion siembra
 * es exactamente el contenido que revisaron las pruebas, las que no piden revision salen publicadas, la que
 * la pide no, y todo se lee por el dominio.
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const LOTE = loteDeCognicion();
const MIGRACION = readFileSync(
  join(process.cwd(), 'prisma', 'migrations', LOTE.migracion, 'migration.sql'),
  'utf8',
);
const HOY = '2026-10-19';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

interface FilaDeSesion {
  readonly id: string;
  readonly idActividad: string;
  readonly titulo: string;
  readonly nivel: number;
  readonly parametros: unknown;
  readonly publicado: boolean;
  readonly revision: string;
}

describe.skipIf(URL_DUENO === undefined)('el catalogo de Cognicion, contra PostgreSQL', () => {
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

  async function sesionesDe(idActividad: string): Promise<FilaDeSesion[]> {
    const { rows } = await dueno.query<FilaDeSesion>(
      `SELECT id_sesion::text AS id, id_actividad::text AS "idActividad", titulo, nivel::int AS nivel,
              parametros, publicado, revision
       FROM sesion_de_actividad WHERE id_actividad = $1 ORDER BY id_sesion`,
      [idActividad],
    );

    return rows;
  }

  describe.each(LOTE.mecanicas.map((m) => [m.codigo, m] as const))('%s', (_codigo, mecanica) => {
    it('tiene 40 sesiones contando las que ya estaban sembradas', async () => {
      expect(await sesionesDe(mecanica.id)).toHaveLength(
        mecanica.yaExiste === true ? 40 : mecanica.sesiones.length,
      );
    });

    it('lo sembrado es el contenido que reviso la prueba: titulo, nivel y parametros, uno por uno', async () => {
      const filas = new Map((await sesionesDe(mecanica.id)).map((fila) => [fila.id, fila]));

      for (const sesion of mecanica.sesiones) {
        const fila = filas.get(sesion.id);

        expect(fila, `${mecanica.codigo} ${sesion.titulo}`).toBeDefined();
        expect(fila?.titulo).toBe(sesion.titulo);
        expect(fila?.nivel).toBe(sesion.nivel);
        expect(fila?.parametros).toEqual(JSON.parse(JSON.stringify(sesion.parametros)));
        expect(fila?.publicado, sesion.titulo).toBe(mecanica.publicar);
        expect(fila?.revision, sesion.titulo).toBe(mecanica.revision);
      }
    });

    it('cada sesion cumple el contrato de su motor, tal como quedo en la base', async () => {
      for (const fila of await sesionesDe(mecanica.id)) {
        expect(
          problemaDeLosParametros(
            mecanica.motor as Motor,
            fila.parametros as Record<string, unknown>,
          ),
          `${mecanica.codigo} ${fila.titulo}`,
        ).toBeUndefined();
      }
    });

    it('el dominio las lee todas', async () => {
      for (const fila of await sesionesDe(mecanica.id)) {
        const sesion = await repositorio.porId(new SesionId(fila.id));

        expect(sesion?.titulo, fila.titulo).toBe(fila.titulo);
        expect(sesion?.publicado).toBe(fila.publicado);
      }
    });
  });

  it('COG-08 pide revision: ninguna sesion sale publicada y la base impide publicarla', async () => {
    const cog08 = LOTE.mecanicas.find((m) => m.codigo === 'COG-08');

    expect(cog08).toBeDefined();
    expect(
      (await sesionesDe(cog08?.id ?? '')).every(
        (fila) => !fila.publicado && fila.revision === 'pendiente',
      ),
    ).toBe(true);

    await dueno.query('BEGIN');

    try {
      await expect(
        dueno.query('UPDATE sesion_de_actividad SET publicado = true WHERE id_actividad = $1', [
          cog08?.id,
        ]),
      ).rejects.toThrow(/sesion_de_actividad_publicada_revisada/);
    } finally {
      await dueno.query('ROLLBACK');
    }
  });

  it('el sendero ofrece una sesion de cada mecanica publicada y ninguna de la que espera revision', async () => {
    const persona = new UserId(randomUUID());
    const ids = LOTE.mecanicas.map((m) => new ActivityId(m.id));
    const deHoy = await repositorio.sesionesDeHoy(persona, ids, HOY);
    const publicadas = LOTE.mecanicas.filter((m) => m.publicar).map((m) => m.id);

    expect([...deHoy.keys()].sort()).toEqual([...publicadas].sort());

    for (const [idActividad, sesion] of deHoy) {
      expect(sesion.idActividad.value).toBe(idActividad);
      expect(sesion.publicado).toBe(true);
    }
  });

  it('aplicar la migracion dos veces deja todo igual', async () => {
    const foto = async () => {
      const { rows } = await dueno.query<{ huella: string }>(
        `SELECT md5(string_agg(concat_ws('|', id_sesion::text, id_actividad::text, titulo, nivel::text,
                                         parametros::text, publicado::text, revision), ';' ORDER BY id_sesion)) AS huella
         FROM sesion_de_actividad WHERE id_sesion::text LIKE '5e5101%'`,
      );
      const { rows: mecanicas } = await dueno.query<{ huella: string }>(
        `SELECT md5(string_agg(concat_ws('|', id_actividad::text, nombre, tipo, descripcion, direccion_escala::text,
                                         puntaje_maximo::text, umbrales::text, textos_nivel::text,
                                         frecuencia::text, motor, coalesce(franja, '')), ';' ORDER BY id_actividad)) AS huella
         FROM actividad WHERE id_actividad::text LIKE '0acd0000-0000-4000-8000-0000000001%'`,
      );

      return [rows[0]?.huella, mecanicas[0]?.huella];
    };

    await dueno.query('BEGIN');

    try {
      const antes = await foto();

      await dueno.query(MIGRACION);
      await dueno.query(MIGRACION);

      expect(await foto()).toEqual(antes);
    } finally {
      await dueno.query('ROLLBACK');
    }
  });

  it('lo retirado despues no se vuelve a publicar al aplicarla otra vez', async () => {
    const cog02 = LOTE.mecanicas.find((m) => m.codigo === 'COG-02');

    await dueno.query('BEGIN');

    try {
      await dueno.query(
        'UPDATE sesion_de_actividad SET publicado = false WHERE id_actividad = $1',
        [cog02?.id],
      );
      await dueno.query(MIGRACION);

      const { rows } = await dueno.query<{ n: number }>(
        'SELECT count(*)::int AS n FROM sesion_de_actividad WHERE id_actividad = $1 AND publicado',
        [cog02?.id],
      );

      expect(rows[0]?.n).toBe(0);
    } finally {
      await dueno.query('ROLLBACK');
    }
  });
});
