import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ActivityId, SesionId, UserId } from '../../domain/model/Identifier.js';
import { type Motor } from '../../domain/model/Motor.js';
import { problemaDeLosParametros } from '../../domain/model/ParametrosDelMotor.js';
import { problemaDeLaRevision } from '../../pruebas/catalogo/estadoDeRevision.ts';
import { todosLosLotes } from '../../pruebas/catalogo/lotes.ts';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaSesionesRepository } from './PrismaSesionesRepository.js';
import { urlDeLaBaseDePruebas } from '../../pruebas/baseDePruebas.js';

/**
 * El contenido del catalogo (SCRUM-222 a SCRUM-224), comprobado contra PostgreSQL de verdad: lo que cada
 * migracion siembra es exactamente el contenido que revisaron las pruebas, las que no piden revision salen
 * publicadas, las que la piden **no salen sin su revisor**, y todo se lee por el dominio. Un lote nuevo entra
 * aqui solo.
 *
 * La base de estas pruebas tiene todas las migraciones, incluidas las que publican lo revisado (SCRUM-238):
 * por eso lo que pide revision puede estar todavia pendiente o ya revisado a nombre de alguien, y lo que se
 * exige es el estado que la base permite (`problemaDeLaRevision`), no el de la siembra.
 */
const URL_DUENO = urlDeLaBaseDePruebas();

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin TEST_DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const LOTES = todosLosLotes().map((una) => una.lote);
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
  readonly revisadaPor: string | null;
  readonly revisadaEl: Date | null;
}

describe.skipIf(URL_DUENO === undefined)('el contenido del catalogo, contra PostgreSQL', () => {
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
              parametros, publicado, revision,
              revisada_por AS "revisadaPor", revisada_el AS "revisadaEl"
       FROM sesion_de_actividad WHERE id_actividad = $1 ORDER BY id_sesion`,
      [idActividad],
    );

    return rows;
  }

  describe.each(LOTES.map((lote) => [lote.migracion, lote] as const))('%s', (_nombre, lote) => {
    const MIGRACION = readFileSync(
      join(process.cwd(), 'prisma', 'migrations', lote.migracion, 'migration.sql'),
      'utf8',
    );

    describe.each(lote.mecanicas.map((m) => [m.codigo, m] as const))('%s', (_codigo, mecanica) => {
      it('tiene 40 sesiones contando las que ya estaban sembradas', async () => {
        // Las del piloto (COG-01, BIE-01 y EMO-02) ya tenian 4, 3 y 3; el lote suma las demas.
        const total = mecanica.yaExiste === true ? 40 : mecanica.sesiones.length;

        expect(await sesionesDe(mecanica.id)).toHaveLength(total);
      });

      it('lo sembrado es el contenido que reviso la prueba: titulo, nivel y parametros, uno por uno', async () => {
        const filas = new Map((await sesionesDe(mecanica.id)).map((fila) => [fila.id, fila]));

        for (const sesion of mecanica.sesiones) {
          const fila = filas.get(sesion.id);

          expect(fila, `${mecanica.codigo} ${sesion.titulo}`).toBeDefined();
          expect(fila?.titulo).toBe(sesion.titulo);
          expect(fila?.nivel).toBe(sesion.nivel);
          expect(fila?.parametros).toEqual(JSON.parse(JSON.stringify(sesion.parametros)));
          expect(
            fila === undefined ? 'no esta' : problemaDeLaRevision(mecanica, fila),
            `${mecanica.codigo} ${sesion.titulo}`,
          ).toBeUndefined();
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

      it.runIf(mecanica.revision === 'pendiente')(
        'pide revision: ninguna sesion nueva esta publicada sin su revisor, y la base impide publicar una pendiente',
        async () => {
          const nuevas = new Set(mecanica.sesiones.map((s) => s.id));
          const filas = (await sesionesDe(mecanica.id)).filter((fila) => nuevas.has(fila.id));

          expect(filas.length).toBeGreaterThan(0);

          for (const fila of filas) {
            // Pendiente y sin publicar, o revisada a nombre de alguien y con su fecha. Nunca publicada sin eso.
            expect(problemaDeLaRevision(mecanica, fila), fila.titulo).toBeUndefined();
            expect(!fila.publicado || fila.revision === 'revisada', fila.titulo).toBe(true);
          }

          // Y lo que la base impide es publicar una que sigue pendiente. Si ya no queda ninguna (se publico
          // lo revisado), se crea una de esta mecanica en una transaccion que se deshace.
          await dueno.query('BEGIN');

          try {
            await dueno.query(
              `INSERT INTO sesion_de_actividad (id_sesion, id_actividad, titulo, nivel, parametros)
               SELECT gen_random_uuid(), id_actividad, 'Pendiente de prueba', nivel, parametros
                 FROM sesion_de_actividad WHERE id_sesion = $1`,
              [filas[0]?.id],
            );

            await expect(
              dueno.query(
                `UPDATE sesion_de_actividad SET publicado = true
                  WHERE id_actividad = $1 AND titulo = 'Pendiente de prueba'`,
                [mecanica.id],
              ),
            ).rejects.toThrow(/sesion_de_actividad_publicada_revisada/);
          } finally {
            await dueno.query('ROLLBACK');
          }
        },
      );
    });

    it('el sendero ofrece una sesion de cada mecanica que tiene alguna publicada, y ninguna de las demas', async () => {
      const persona = new UserId(randomUUID());
      const ids = lote.mecanicas.map((m) => new ActivityId(m.id));
      const deHoy = await repositorio.sesionesDeHoy(persona, ids, HOY);
      const conSesion = await repositorio.mecanicasConSesion(persona, ids, HOY);
      // Las que tienen alguna sesion publicada: las que no piden revision y las que ya publico una revision.
      // Una que espera revision no tiene ninguna, y no se ofrece.
      const { rows } = await dueno.query<{ id: string }>(
        `SELECT DISTINCT id_actividad::text AS id FROM sesion_de_actividad
          WHERE publicado AND id_actividad = ANY($1::uuid[])`,
        [lote.mecanicas.map((m) => m.id)],
      );
      const publicadas = rows.map((fila) => fila.id);

      expect([...deHoy.keys()].sort()).toEqual([...publicadas].sort());
      expect([...conSesion].sort()).toEqual([...publicadas].sort());

      for (const [idActividad, sesion] of deHoy) {
        expect(sesion.idActividad.value).toBe(idActividad);
        expect(sesion.publicado).toBe(true);
      }
    });

    it('aplicar la migracion dos veces deja todo igual', async () => {
      const ids = lote.mecanicas.map((m) => m.id);
      const foto = async () => {
        const { rows } = await dueno.query<{ huella: string }>(
          `SELECT md5(string_agg(concat_ws('|', id_sesion::text, id_actividad::text, titulo, nivel::text,
                                           parametros::text, publicado::text, revision), ';' ORDER BY id_sesion)) AS huella
           FROM sesion_de_actividad WHERE id_actividad = ANY($1::uuid[])`,
          [ids],
        );
        const { rows: mecanicas } = await dueno.query<{ huella: string }>(
          `SELECT md5(string_agg(concat_ws('|', id_actividad::text, nombre, tipo, descripcion, direccion_escala::text,
                                           puntaje_maximo::text, umbrales::text, textos_nivel::text,
                                           frecuencia::text, motor, coalesce(franja, '')), ';' ORDER BY id_actividad)) AS huella
           FROM actividad WHERE id_actividad = ANY($1::uuid[])`,
          [ids],
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
      const publicada = lote.mecanicas.find((m) => m.publicar);

      if (publicada === undefined) {
        return;
      }

      await dueno.query('BEGIN');

      try {
        await dueno.query(
          'UPDATE sesion_de_actividad SET publicado = false WHERE id_actividad = $1',
          [publicada.id],
        );
        await dueno.query(MIGRACION);

        const { rows } = await dueno.query<{ n: number }>(
          'SELECT count(*)::int AS n FROM sesion_de_actividad WHERE id_actividad = $1 AND publicado',
          [publicada.id],
        );

        expect(rows[0]?.n).toBe(0);
      } finally {
        await dueno.query('ROLLBACK');
      }
    });
  });

  it('la franja de cada mecanica es la que dice el contenido', async () => {
    const mecanicas = LOTES.flatMap((lote) => lote.mecanicas.filter((m) => m.yaExiste !== true));
    const { rows } = await dueno.query<{ id: string; franja: string | null }>(
      'SELECT id_actividad::text AS id, franja FROM actividad WHERE id_actividad = ANY($1::uuid[])',
      [mecanicas.map((m) => m.id)],
    );
    const dePrueba = new Map(rows.map((fila) => [fila.id, fila.franja]));

    for (const mecanica of mecanicas) {
      expect(dePrueba.get(mecanica.id), mecanica.codigo).toBe(mecanica.franja ?? null);
    }
  });
});
