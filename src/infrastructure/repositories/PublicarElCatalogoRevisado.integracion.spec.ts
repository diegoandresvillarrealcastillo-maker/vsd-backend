// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client, type QueryResult } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { enElCatalogoComoSembrado } from '../../pruebas/catalogo/estadoDeRevision.ts';
import { generarLaPublicacion } from '../../pruebas/catalogo/revision/publicacion.ts';

/**
 * La migracion que publica las 720 sesiones revisadas por el equipo (SCRUM-238), la de verdad.
 *
 * `PublicacionDelCatalogo.integracion.spec.ts` prueba el **generador** con hojas inventadas. Esta prueba mira el
 * archivo que se va a aplicar:
 *
 * - sale **exactamente** de la hoja de respuestas guardada en `docs/revisiones/`, sin una linea tocada a mano;
 * - la hoja no dice que sea una revision profesional, porque no lo es;
 * - contra PostgreSQL de verdad, dentro de una transaccion que se deshace: publica las 720 a nombre de quien las
 *   reviso y con su fecha, aplicarla dos veces no cambia nada, y no toca nada mas.
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const MIGRACION = readFileSync(
  join(
    process.cwd(),
    'prisma',
    'migrations',
    '20261024120000_publicar_el_catalogo_revisado',
    'migration.sql',
  ),
  'utf8',
);
const HOJA = readFileSync(
  join(process.cwd(), 'docs', 'revisiones', '2026-10-20-samuel-villa-perez.txt'),
  'utf8',
);

const REVISOR =
  'Samuel Villa Pérez (Scrum Master; lectura y aprobación del equipo, sin revisión profesional)';

/** Cuantas filas cambio cada `UPDATE` de un script de varias sentencias. */
function filasCambiadas(resultado: QueryResult | QueryResult[]): number {
  return (Array.isArray(resultado) ? resultado : [resultado]).reduce(
    (suma, r) => suma + (r.rowCount ?? 0),
    0,
  );
}

describe('la publicacion de las 720 sesiones: el archivo', () => {
  it('sale exactamente de la hoja de respuestas guardada, sin una linea tocada a mano', () => {
    expect(generarLaPublicacion([HOJA], { exigirTodo: true }).sql).toBe(MIGRACION);
  });

  it('publica 720 sesiones de 18 mecanicas: las 714 del catalogo y las 6 del piloto', () => {
    const { publicadas, porMecanica, pendientes } = generarLaPublicacion([HOJA], {
      exigirTodo: true,
    });

    expect(publicadas).toBe(720);
    expect(porMecanica).toHaveLength(18);
    expect(porMecanica.every((m) => m.publicadas === 40 && m.sinSalir === 0)).toBe(true);
    expect(pendientes).toEqual([]);
  });

  it('esta a nombre de quien la reviso y NO dice que sea una revision profesional', () => {
    expect(HOJA).toContain(`Revisión a nombre de: ${REVISOR}`);
    expect(HOJA).toContain('Fecha de la revisión: 2026-10-20');
    expect(MIGRACION).toContain(`"revisada_por" = '${REVISOR}'`);
    // El rol dice lo que es: lectura del equipo. Decir «revision profesional» a secas viajaria hasta produccion.
    expect(REVISOR).toMatch(/sin revisión profesional/u);
    expect(REVISOR.length).toBeLessThanOrEqual(100);
  });

  it('es solo datos: ningun DDL, y cada UPDATE exige que la sesion siga pendiente', () => {
    expect(MIGRACION).not.toMatch(/\b(CREATE|ALTER|DROP|TRUNCATE|DELETE|INSERT)\b/iu);

    const updates = MIGRACION.match(/^UPDATE /gmu) ?? [];
    const exigenPendiente = MIGRACION.match(/AND "revision" = 'pendiente'/gu) ?? [];

    expect(updates).toHaveLength(18);
    expect(exigenPendiente).toHaveLength(18);
  });
});

describe.skipIf(URL_DUENO === undefined)(
  'la publicacion de las 720 sesiones, contra PostgreSQL',
  () => {
    let dueno: Client;

    beforeAll(async () => {
      dueno = new Client({ connectionString: URL_DUENO });
      await dueno.connect();
    });

    afterAll(async () => {
      await dueno.end();
    });

    async function publicadas(): Promise<number> {
      const { rows } = await dueno.query<{ n: string }>(
        'SELECT count(*) AS n FROM sesion_de_actividad WHERE publicado',
      );

      return Number(rows[0]?.n);
    }

    it('en cualquier estado de la base, nada esta publicado sin que alguien lo haya revisado', async () => {
      const { rows } = await dueno.query<{ publicadas_sin_revision: string; sin_firma: string }>(
        `SELECT count(*) FILTER (WHERE publicado AND revision = 'pendiente') AS publicadas_sin_revision,
                count(*) FILTER (WHERE revision = 'revisada'
                                   AND (coalesce(btrim(revisada_por), '') = '' OR revisada_el IS NULL)) AS sin_firma
           FROM sesion_de_actividad`,
      );

      expect(Number(rows[0]?.publicadas_sin_revision)).toBe(0);
      expect(Number(rows[0]?.sin_firma)).toBe(0);
    });

    it('publica las 720 a nombre de quien las reviso y con su fecha, y nada mas', async () => {
      await enElCatalogoComoSembrado(dueno, async () => {
        const antes = await publicadas();

        expect(filasCambiadas(await dueno.query(MIGRACION))).toBe(720);

        const { rows } = await dueno.query<{ revisada_por: string; dia: string; n: string }>(
          `SELECT revisada_por, to_char(revisada_el AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD') AS dia,
                  count(*) AS n
             FROM sesion_de_actividad WHERE revision = 'revisada' GROUP BY 1, 2`,
        );

        expect(rows.map((r) => [r.revisada_por, r.dia, Number(r.n)])).toEqual([
          [REVISOR, '2026-10-20', 720],
        ]);
        // Publica 720 y nada mas: lo que no pedia revision ya estaba publicado y no se toca.
        expect((await publicadas()) - antes).toBe(720);

        // Y no queda nada pendiente de las que tenian que revisarse.
        const pendientes = await dueno.query<{ n: string }>(
          `SELECT count(*) AS n FROM sesion_de_actividad WHERE revision = 'pendiente'`,
        );

        expect(Number(pendientes.rows[0]?.n)).toBe(0);
      });
    });

    it('aplicarla dos veces no cambia nada la segunda vez', async () => {
      await enElCatalogoComoSembrado(dueno, async () => {
        expect(filasCambiadas(await dueno.query(MIGRACION))).toBe(720);
        expect(filasCambiadas(await dueno.query(MIGRACION))).toBe(0);
      });
    });

    it('despues de aplicarla, la base no deja editar lo que quedo revisado', async () => {
      await enElCatalogoComoSembrado(dueno, async () => {
        await dueno.query(MIGRACION);

        await expect(
          dueno.query(
            `UPDATE sesion_de_actividad SET revisada_por = 'otra persona' WHERE revision = 'revisada'`,
          ),
        ).rejects.toThrow();
      });
    });
  },
);
