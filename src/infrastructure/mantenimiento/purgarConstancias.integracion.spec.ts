import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { purgarConstancias, SinPermisoParaLaPurgaError } from './purgarConstancias.js';

/**
 * El borrado de las constancias de baja a los 10 anos (SCRUM-236), contra
 * PostgreSQL de verdad.
 *
 * ## Por que contra la base y no con un doble
 *
 * Lo que esta herramienta puede hacer mal no es una cuenta: es no borrar nada
 * sin avisar. Las constancias tienen RLS forzado y la aplicacion no tiene
 * permiso de borrado, asi que un `DELETE` con un rol sin permiso para saltarse
 * las politicas **no da error: borra cero filas**. Solo una base real lo muestra.
 *
 * ## Fechas de esta suite
 *
 * Todo lo sembrado cae entre 2001 y 2008, y el "ahora" de las pruebas es 2012:
 * el limite queda en 2002, mucho antes de cualquier constancia que otra suite
 * escriba con la fecha de hoy. Asi el borrado de aqui no puede llevarse la fila
 * de otra suite que corre a la vez, y los conteos se pueden comprobar exactos.
 *
 * Identificadores propios de esta suite.
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const AHORA = new Date('2012-06-15T12:00:00.000Z');
const LIMITE = new Date('2002-06-15T12:00:00.000Z');

const VENCIDA_DE_SIEMPRE = '23623623-0000-4000-8000-0000000000a1';
const UN_MILISEGUNDO_ANTES = '23623623-0000-4000-8000-0000000000b2';
const JUSTO_EN_EL_LIMITE = '23623623-0000-4000-8000-0000000000c3';
const VIGENTE = '23623623-0000-4000-8000-0000000000d4';

const TODAS = [VENCIDA_DE_SIEMPRE, UN_MILISEGUNDO_ANTES, JUSTO_EN_EL_LIMITE, VIGENTE];

/** La misma URL pero conectando con el rol de la aplicacion. */
function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

describe.skipIf(URL_DUENO === undefined)('El borrado de constancias a los 10 anos', () => {
  let dueno: Client;
  let aplicacion: Client;

  async function limpiar(): Promise<void> {
    await dueno.query('DELETE FROM consentimiento_de_cuenta_inactiva WHERE id_cuenta = ANY($1)', [
      TODAS,
    ]);
    await dueno.query('DELETE FROM cuenta_inactiva WHERE id_cuenta = ANY($1)', [TODAS]);
  }

  async function sembrar(
    cuenta: string,
    inactivadaEl: string,
    consentimientos: number,
  ): Promise<void> {
    await dueno.query(
      `INSERT INTO cuenta_inactiva
         (id_cuenta, id_proveedor_auth, fecha_registro, inactivada_el,
          version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, $2, $3, $3, '2026-10-3', $3)`,
      [cuenta, `proveedor-${cuenta}`, inactivadaEl],
    );

    for (let numero = 1; numero <= consentimientos; numero++) {
      await dueno.query(
        `INSERT INTO consentimiento_de_cuenta_inactiva
           (id_consentimiento, id_cuenta, tipo, version, aceptado_en)
         VALUES (gen_random_uuid(), $1, $2, '2026-10-3', $3)`,
        [cuenta, numero % 2 === 1 ? 'aviso_de_privacidad' : 'terminos', inactivadaEl],
      );
    }
  }

  async function cuentasQueQuedan(): Promise<string[]> {
    const { rows } = await dueno.query<{ id_cuenta: string }>(
      'SELECT id_cuenta FROM cuenta_inactiva WHERE id_cuenta = ANY($1) ORDER BY id_cuenta',
      [TODAS],
    );

    return rows.map((fila) => fila.id_cuenta);
  }

  async function consentimientosQueQuedan(cuenta: string): Promise<number> {
    const { rows } = await dueno.query<{ n: number }>(
      'SELECT count(*)::int AS n FROM consentimiento_de_cuenta_inactiva WHERE id_cuenta = $1',
      [cuenta],
    );

    return rows[0]?.n ?? 0;
  }

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();

    await prepararRolDeLaAplicacion(dueno);

    aplicacion = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
    await aplicacion.connect();
  });

  afterAll(async () => {
    await aplicacion?.end();
    await limpiar();
    await dueno?.end();
  });

  beforeEach(async () => {
    await limpiar();

    await sembrar(VENCIDA_DE_SIEMPRE, '2001-03-10T08:00:00.000Z', 2);
    await sembrar(UN_MILISEGUNDO_ANTES, '2002-06-15T11:59:59.999Z', 1);
    await sembrar(JUSTO_EN_EL_LIMITE, '2002-06-15T12:00:00.000Z', 1);
    await sembrar(VIGENTE, '2008-01-01T00:00:00.000Z', 2);
  });

  describe('en simulacro', () => {
    it('dice que borraria, sin borrar nada', async () => {
      const informe = await purgarConstancias(dueno, { ahora: AHORA, aplicar: false });

      expect(informe).toEqual({
        limite: LIMITE,
        cuentas: 2,
        consentimientos: 3,
        aplicada: false,
      });
      expect(await cuentasQueQuedan()).toHaveLength(4);
      expect(await consentimientosQueQuedan(VENCIDA_DE_SIEMPRE)).toBe(2);
      expect(await consentimientosQueQuedan(UN_MILISEGUNDO_ANTES)).toBe(1);
    });

    it('cuenta el 29 de febrero como el 28: la constancia no se borra un dia antes', async () => {
      const informe = await purgarConstancias(dueno, {
        ahora: new Date('2036-02-29T00:00:00.000Z'),
        aplicar: false,
      });

      expect(informe.limite).toEqual(new Date('2026-02-28T00:00:00.000Z'));
    });
  });

  describe('aplicando', () => {
    it('borra la cuenta vencida con todos sus consentimientos', async () => {
      const informe = await purgarConstancias(dueno, { ahora: AHORA, aplicar: true });

      expect(informe).toEqual({
        limite: LIMITE,
        cuentas: 2,
        consentimientos: 3,
        aplicada: true,
      });
      expect(await cuentasQueQuedan()).toEqual([JUSTO_EN_EL_LIMITE, VIGENTE].sort());
      expect(await consentimientosQueQuedan(VENCIDA_DE_SIEMPRE)).toBe(0);
      expect(await consentimientosQueQuedan(UN_MILISEGUNDO_ANTES)).toBe(0);
    });

    it('borra la que cumplio el plazo por un milisegundo y conserva la que lo cumple justo hoy', async () => {
      await purgarConstancias(dueno, { ahora: AHORA, aplicar: true });

      const quedan = await cuentasQueQuedan();

      expect(quedan).not.toContain(UN_MILISEGUNDO_ANTES);
      expect(quedan).toContain(JUSTO_EN_EL_LIMITE);
    });

    it('no toca los consentimientos de las constancias que se conservan', async () => {
      await purgarConstancias(dueno, { ahora: AHORA, aplicar: true });

      expect(await consentimientosQueQuedan(JUSTO_EN_EL_LIMITE)).toBe(1);
      expect(await consentimientosQueQuedan(VIGENTE)).toBe(2);
    });

    it('repetirlo no hace nada mas', async () => {
      await purgarConstancias(dueno, { ahora: AHORA, aplicar: true });

      const otraVez = await purgarConstancias(dueno, { ahora: AHORA, aplicar: true });

      expect(otraVez).toEqual({ limite: LIMITE, cuentas: 0, consentimientos: 0, aplicada: true });
      expect(await cuentasQueQuedan()).toHaveLength(2);
    });

    it('con un "ahora" anterior a todas las constancias no borra ninguna', async () => {
      const informe = await purgarConstancias(dueno, {
        ahora: new Date('2005-01-01T00:00:00.000Z'),
        aplicar: true,
      });

      expect(informe.cuentas).toBe(0);
      expect(await cuentasQueQuedan()).toHaveLength(4);
    });
  });

  describe('con el rol de la aplicacion', () => {
    it('se niega a trabajar, aunque sea en simulacro, y lo dice', async () => {
      await expect(
        purgarConstancias(aplicacion, { ahora: AHORA, aplicar: false }),
      ).rejects.toBeInstanceOf(SinPermisoParaLaPurgaError);
    });

    it('no borra nada: no deja que una consulta "con exito" borre cero filas', async () => {
      await expect(purgarConstancias(aplicacion, { ahora: AHORA, aplicar: true })).rejects.toThrow(
        /vsd_app/,
      );

      expect(await cuentasQueQuedan()).toHaveLength(4);
      expect(await consentimientosQueQuedan(VENCIDA_DE_SIEMPRE)).toBe(2);
    });
  });

  describe('la aplicacion misma', () => {
    it('sigue sin poder borrar una constancia', async () => {
      // Sin permiso de DELETE la base lo rechaza; si esto empezara a pasar, la
      // constancia dejaria de probar nada. Esta herramienta no lo cambia.
      await expect(
        aplicacion.query('DELETE FROM cuenta_inactiva WHERE id_cuenta = $1', [VENCIDA_DE_SIEMPRE]),
      ).rejects.toThrow();

      expect(await cuentasQueQuedan()).toContain(VENCIDA_DE_SIEMPRE);
    });
  });
});
