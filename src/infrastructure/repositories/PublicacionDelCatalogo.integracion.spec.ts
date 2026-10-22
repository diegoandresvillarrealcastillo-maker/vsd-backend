// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { Client, type QueryResult } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { enElCatalogoComoSembrado } from '../../pruebas/catalogo/estadoDeRevision.ts';
import { mecanicasPorRevisar } from '../../pruebas/catalogo/revision/porRevisar.ts';
import { generarLaPublicacion } from '../../pruebas/catalogo/revision/publicacion.ts';

/**
 * La migracion que publica lo revisado (SCRUM-228), aplicada a PostgreSQL de verdad.
 *
 * Cada prueba corre en una transaccion que se **deshace** al terminar y que parte del catalogo **como lo dejo la
 * siembra** (pendiente y sin publicar): la base de las pruebas ya tiene aplicada la publicacion real (SCRUM-238), y
 * `enElCatalogoComoSembrado` la «desaplica» solo dentro de esa transaccion, para poder probar el generador sin
 * que cambie nada fuera. Lo que se comprueba es lo que la base exige de verdad: que el SQL se aplica sin romper el
 * `CHECK` (lo que pide revision no se publica sin ella), que deja a cada sesion con su revisor y su fecha, que
 * aplicarla dos veces no cambia nada, y que lo que la hoja deja fuera o no aprueba se queda pendiente.
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const catalogo = mecanicasPorRevisar();

/** La hoja de una persona, en el formato que produce «Copiar mis respuestas». */
function hoja(
  revisor: string,
  fecha: string,
  aprobadas: readonly string[],
  sinSalir: readonly string[] = [],
): string {
  return [
    `Revisión a nombre de: ${revisor}`,
    `Fecha de la revisión: ${fecha}`,
    '',
    'Mecánicas',
    ...catalogo.map(
      (m) =>
        `${m.codigo} · ${m.nombre}: ${aprobadas.includes(m.codigo) ? 'Aprobada' : 'Sin marcar'}`,
    ),
    ...(sinSalir.length === 0
      ? []
      : ['', 'Sesiones que no salen', ...sinSalir.map((r) => `${r} · x: No sale`)]),
  ].join('\n');
}

/** Cuantas filas cambio cada `UPDATE` de un script de varias sentencias. */
function filasCambiadas(resultado: QueryResult | QueryResult[]): number {
  return (Array.isArray(resultado) ? resultado : [resultado]).reduce(
    (suma, r) => suma + (r.rowCount ?? 0),
    0,
  );
}

describe.skipIf(URL_DUENO === undefined)('publicar lo revisado, contra PostgreSQL', () => {
  let dueno: Client;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
  });

  afterAll(async () => {
    await dueno.end();
  });

  /** Corre `prueba` con el catalogo como lo dejo la siembra, dentro de una transaccion que se deshace siempre. */
  function enUnaTransaccion(prueba: () => Promise<void>): Promise<void> {
    return enElCatalogoComoSembrado(dueno, prueba);
  }

  it('el catalogo sembrado esta pendiente y sin publicar: es lo que la publicacion va a publicar', async () => {
    await enUnaTransaccion(async () => {
      const { rows } = await dueno.query<{ n: string }>(
        `SELECT count(*) AS n FROM sesion_de_actividad
         WHERE id_sesion::text = ANY($1) AND revision = 'pendiente' AND NOT publicado`,
        [catalogo.flatMap((m) => m.sesiones.map((s) => s.id))],
      );

      expect(Number(rows[0]?.n)).toBe(714);
    });
  });

  it('aprobar todo publica las 714 sesiones, cada una con su revisor y su fecha', async () => {
    const { sql, publicadas } = generarLaPublicacion([
      hoja('Fisioterapeuta', '2026-10-22', ['BIE-02']),
      hoja(
        'Psicóloga',
        '2026-10-24',
        catalogo.map((m) => m.codigo).filter((c) => c !== 'BIE-02'),
      ),
    ]);

    expect(publicadas).toBe(714);

    await enUnaTransaccion(async () => {
      expect(filasCambiadas(await dueno.query(sql))).toBe(714);

      const { rows } = await dueno.query<{ revisada_por: string; dia: string; publicadas: string }>(
        `SELECT revisada_por, to_char(revisada_el AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD') AS dia,
                count(*) AS publicadas
         FROM sesion_de_actividad
         WHERE id_sesion::text = ANY($1) AND publicado AND revision = 'revisada'
         GROUP BY 1, 2 ORDER BY 1`,
        [catalogo.flatMap((m) => m.sesiones.map((s) => s.id))],
      );

      expect(rows.map((r) => [r.revisada_por, r.dia, Number(r.publicadas)])).toEqual([
        ['Fisioterapeuta', '2026-10-22', 40],
        ['Psicóloga', '2026-10-24', 674],
      ]);
    });
  });

  it('aplicarla dos veces no cambia nada la segunda vez', async () => {
    const { sql } = generarLaPublicacion([hoja('Ana', '2026-10-23', ['COG-08', 'BIE-02'])]);

    await enUnaTransaccion(async () => {
      expect(filasCambiadas(await dueno.query(sql))).toBe(80);
      expect(filasCambiadas(await dueno.query(sql))).toBe(0);
    });
  });

  it('las sesiones que la hoja deja fuera, y las mecanicas que no aprueba, se quedan pendientes y sin publicar', async () => {
    const fuera = catalogo[2]?.sesiones.slice(0, 3).map((s) => s.referencia) ?? [];
    const { sql, publicadas } = generarLaPublicacion([
      hoja('Ana', '2026-10-23', ['BIE-02'], fuera),
    ]);

    expect(publicadas).toBe(37);

    await enUnaTransaccion(async () => {
      expect(filasCambiadas(await dueno.query(sql))).toBe(37);

      const { rows } = await dueno.query<{ revision: string; publicado: boolean; n: string }>(
        `SELECT revision, publicado, count(*) AS n FROM sesion_de_actividad
         WHERE id_sesion::text = ANY($1) GROUP BY 1, 2 ORDER BY 1, 2`,
        [catalogo.flatMap((m) => m.sesiones.map((s) => s.id))],
      );

      expect(rows.map((r) => [r.revision, r.publicado, Number(r.n)])).toEqual([
        ['pendiente', false, 714 - 37],
        ['revisada', true, 37],
      ]);

      // Las tres que la hoja dejo fuera siguen sin publicar.
      const pendientes = await dueno.query<{ n: string }>(
        `SELECT count(*) AS n FROM sesion_de_actividad
         WHERE id_sesion::text = ANY($1) AND revision = 'pendiente'`,
        [catalogo[2]?.sesiones.slice(0, 3).map((s) => s.id) ?? []],
      );

      expect(Number(pendientes.rows[0]?.n)).toBe(3);
    });
  });

  it('no toca las del piloto si la hoja no las aprueba, ni las que no piden revision', async () => {
    const { sql } = generarLaPublicacion([
      hoja(
        'Ana',
        '2026-10-23',
        catalogo.map((m) => m.codigo),
      ),
    ]);

    await enUnaTransaccion(async () => {
      await dueno.query(sql);

      const piloto = await dueno.query<{ revision: string; publicado: boolean }>(
        `SELECT revision, publicado FROM sesion_de_actividad
         WHERE id_sesion::text LIKE '5e510001-%' AND id_sesion::text <> ALL($1)`,
        [catalogo.flatMap((m) => m.sesiones.map((s) => s.id))],
      );
      const sinRevision = await dueno.query<{ n: string }>(
        `SELECT count(*) AS n FROM sesion_de_actividad
         WHERE revision = 'no_requiere' AND revisada_por IS NOT NULL`,
      );

      // Las seis del piloto (y la de COG-01 ya publicada) siguen como estaban.
      expect(piloto.rows.filter((f) => f.revision === 'revisada')).toHaveLength(0);
      expect(Number(sinRevision.rows[0]?.n)).toBe(0);
    });
  });

  it('la base no deja editar una sesion ya revisada: la publicacion es definitiva', async () => {
    const { sql } = generarLaPublicacion([hoja('Ana', '2026-10-23', ['COG-08'])]);
    const id = catalogo[0]?.sesiones[0]?.id ?? '';

    await enUnaTransaccion(async () => {
      await dueno.query(sql);

      await expect(
        dueno.query(
          `UPDATE sesion_de_actividad SET parametros = '{}'::jsonb WHERE id_sesion = $1`,
          [id],
        ),
      ).rejects.toThrow();
    });
  });
});
