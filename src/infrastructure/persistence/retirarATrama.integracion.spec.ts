import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

/**
 * La migracion que retira a Trama (SCRUM-121), contra PostgreSQL de verdad.
 *
 * Una migracion de datos que se equivoca no falla: deja a alguien con otro
 * nombre o sin su color. Por eso aqui se siembran personas con cada caso que
 * importa, se ejecuta **el archivo de la migracion tal cual** y se lee lo que
 * quedo.
 *
 * Identificadores propios de esta suite.
 */
const URL_DUENO = process.env['DATABASE_URL'];

const RUTA = fileURLToPath(
  new URL(
    '../../../prisma/migrations/20261010120000_retirar_a_trama/migration.sql',
    import.meta.url,
  ),
);

const CON_NOMBRE_DE_FABRICA = '12112112-0000-4000-8000-0000000000a1';
const CON_NOMBRE_PROPIO = '12112112-0000-4000-8000-0000000000b2';
const CON_NOMBRE_DE_FABRICA_ESCRITO_A_SU_MANERA = '12112112-0000-4000-8000-0000000000c3';
const CON_OTRO_PERSONAJE = '12112112-0000-4000-8000-0000000000d4';
const SIN_MASCOTA = '12112112-0000-4000-8000-0000000000e5';

const TODAS = [
  CON_NOMBRE_DE_FABRICA,
  CON_NOMBRE_PROPIO,
  CON_NOMBRE_DE_FABRICA_ESCRITO_A_SU_MANERA,
  CON_OTRO_PERSONAJE,
  SIN_MASCOTA,
];

const MASCOTAS: Readonly<Record<string, object | null>> = {
  [CON_NOMBRE_DE_FABRICA]: { forma: 'trama', nombre: 'Trama' },
  [CON_NOMBRE_PROPIO]: {
    forma: 'trama',
    nombre: 'Hilo',
    color: '#a2d9b6',
    accesorio: 'bufanda',
  },
  [CON_NOMBRE_DE_FABRICA_ESCRITO_A_SU_MANERA]: { forma: 'trama', nombre: '  tRaMa ' },
  [CON_OTRO_PERSONAJE]: { forma: 'sparky', nombre: 'Chispa' },
  [SIN_MASCOTA]: null,
};

describe.skipIf(URL_DUENO === undefined)('La migracion que retira a Trama', () => {
  let dueno: Client;

  /** El dueno esta sujeto a las politicas: cada lectura dice de quien es. */
  async function mascotaDe(persona: string): Promise<unknown> {
    await dueno.query('BEGIN');

    try {
      await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
      const { rows } = await dueno.query('SELECT mascota FROM usuario WHERE id_usuario = $1', [
        persona,
      ]);

      return (rows[0] as { mascota: unknown } | undefined)?.mascota;
    } finally {
      await dueno.query('COMMIT');
    }
  }

  /** Una sentencia como esa persona; si falla, la transaccion no queda abierta. */
  async function como(persona: string, sql: string, parametros: unknown[]): Promise<void> {
    await dueno.query('BEGIN');

    try {
      await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
      await dueno.query(sql, parametros);
      await dueno.query('COMMIT');
    } catch (error) {
      await dueno.query('ROLLBACK');
      throw error;
    }
  }

  async function limpiar(): Promise<void> {
    for (const persona of TODAS) {
      await como(persona, 'DELETE FROM usuario WHERE id_usuario = $1', [persona]);
    }
  }

  async function sembrar(): Promise<void> {
    for (const persona of TODAS) {
      const mascota = MASCOTAS[persona];

      await como(
        persona,
        `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica, mascota)
         VALUES ($1, $2, $3, '1.0', now(), $4::jsonb)`,
        [
          persona,
          `${persona}@retirar-a-trama.test`,
          `proveedor-retirar-a-trama-${persona}`,
          // `null` en JSON es un valor, y la columna exige un objeto o NULL.
          mascota === null ? null : JSON.stringify(mascota),
        ],
      );
    }
  }

  /** El archivo de la migracion, entero, como lo ejecutaria `prisma migrate deploy`. */
  async function migrar(): Promise<void> {
    await dueno.query(readFileSync(RUTA, 'utf8'));
  }

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
  });

  beforeEach(async () => {
    await limpiar();
    await sembrar();
  });

  afterAll(async () => {
    await limpiar();
    await dueno.end();
  });

  it('a quien tenia a Trama con su nombre de fabrica le deja a Fungito, con su nombre', async () => {
    await migrar();

    expect(await mascotaDe(CON_NOMBRE_DE_FABRICA)).toEqual({ forma: 'fungito', nombre: 'Fungito' });
  });

  it('el nombre de fabrica se reconoce aunque este escrito a otra manera', async () => {
    await migrar();

    expect(await mascotaDe(CON_NOMBRE_DE_FABRICA_ESCRITO_A_SU_MANERA)).toEqual({
      forma: 'fungito',
      nombre: 'Fungito',
    });
  });

  it('un nombre que la persona eligio se respeta, y tambien su color y su accesorio', async () => {
    await migrar();

    expect(await mascotaDe(CON_NOMBRE_PROPIO)).toEqual({
      forma: 'fungito',
      nombre: 'Hilo',
      color: '#a2d9b6',
      accesorio: 'bufanda',
    });
  });

  it('no toca a quien tiene otro personaje ni a quien no tiene mascota', async () => {
    await migrar();

    expect(await mascotaDe(CON_OTRO_PERSONAJE)).toEqual({ forma: 'sparky', nombre: 'Chispa' });
    expect(await mascotaDe(SIN_MASCOTA)).toBeNull();
  });

  it('se puede ejecutar dos veces: la segunda no encuentra nada que cambiar', async () => {
    await migrar();
    await migrar();

    expect(await mascotaDe(CON_NOMBRE_PROPIO)).toEqual({
      forma: 'fungito',
      nombre: 'Hilo',
      color: '#a2d9b6',
      accesorio: 'bufanda',
    });
    expect(await mascotaDe(CON_OTRO_PERSONAJE)).toEqual({ forma: 'sparky', nombre: 'Chispa' });
  });

  it('deja el aislamiento por persona como lo encontro', async () => {
    await migrar();

    const { rows } = await dueno.query(
      `SELECT relrowsecurity, relforcerowsecurity FROM pg_class WHERE oid = 'public.usuario'::regclass`,
    );

    expect(rows).toEqual([{ relrowsecurity: true, relforcerowsecurity: true }]);
  });
});
