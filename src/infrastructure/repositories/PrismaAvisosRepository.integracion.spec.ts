import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TipoDeAviso } from '../../domain/model/Aviso.js';
import { UserId } from '../../domain/model/Identifier.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaAvisosRepository } from './PrismaAvisosRepository.js';

/**
 * Los avisos contra PostgreSQL de verdad (SCRUM-102).
 *
 * Lo que importa es que las dos excepciones al aislamiento se queden tan
 * estrechas como dice la migracion:
 *
 * - la tarea de avisos lee las horas de todos, y nada mas;
 * - quien presenta la direccion de un navegador puede soltarlo, y nada mas.
 *
 * Identificadores propios de esta suite.
 */
const URL_DUENO = process.env['DATABASE_URL'];

const ANA = '10210210-0000-4000-8000-0000000000a1';
const BETO = '10210210-0000-4000-8000-0000000000b2';
const HOY = '2026-10-05';

const NAVEGADOR = {
  endpoint: 'https://push.example.com/10210210-navegador-compartido',
  p256dh: 'clave-p256dh',
  auth: 'clave-auth',
};

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

async function limpiar(dueno: Client): Promise<void> {
  for (const tabla of ['suscripcion_push', 'preferencia_aviso', 'pendiente', 'usuario']) {
    await dueno.query(`DELETE FROM ${tabla} WHERE id_usuario = ANY($1)`, [[ANA, BETO]]);
  }
}

async function sembrarPersonas(dueno: Client): Promise<void> {
  for (const [persona, correo] of [
    [ANA, 'a@avisos-integracion.test'],
    [BETO, 'b@avisos-integracion.test'],
  ]) {
    await dueno.query('BEGIN');
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
    await dueno.query(
      `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, $2, $3, '1.0', now())`,
      [persona, correo, `proveedor-avisos-${persona}`],
    );
    await dueno.query('COMMIT');
  }
}

describe.skipIf(URL_DUENO === undefined)('Los avisos en PostgreSQL', () => {
  let dueno: Client;
  let comoApp: Client;
  let prisma: PrismaService;
  let avisos: PrismaAvisosRepository;

  /** Una sentencia con el rol de la aplicacion y los ajustes de sesion dados. */
  async function conAjustes(
    ajustes: Record<string, string>,
    sql: string,
    parametros: unknown[] = [],
  ): Promise<{ rowCount: number; rows: unknown[] }> {
    await comoApp.query('BEGIN');

    try {
      for (const [clave, valor] of Object.entries(ajustes)) {
        await comoApp.query('SELECT set_config($1, $2, true)', [clave, valor]);
      }

      const resultado = await comoApp.query(sql, parametros);
      await comoApp.query('COMMIT');

      return { rowCount: resultado.rowCount ?? 0, rows: resultado.rows };
    } catch (error) {
      await comoApp.query('ROLLBACK');
      throw error;
    }
  }

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);

    comoApp = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
    await comoApp.connect();

    prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
    await prisma.onModuleInit();
    avisos = new PrismaAvisosRepository(prisma);
  });

  beforeEach(async () => {
    await limpiar(dueno);
    await sembrarPersonas(dueno);
  });

  afterAll(async () => {
    await limpiar(dueno);
    await prisma.onModuleDestroy();
    await comoApp.end();
    await dueno.end();
  });

  it('guarda las horas de cada aviso por separado', async () => {
    await avisos.guardarPreferencias({
      userId: new UserId(ANA),
      minutoSemaforo: 480,
      minutoRacha: null,
    });

    await expect(avisos.preferenciasDe(new UserId(ANA))).resolves.toEqual({
      userId: new UserId(ANA),
      minutoSemaforo: 480,
      minutoRacha: null,
    });
    // Sin nada guardado, apagados.
    await expect(avisos.preferenciasDe(new UserId(BETO))).resolves.toMatchObject({
      minutoSemaforo: null,
      minutoRacha: null,
    });
  });

  it('nadie ve las horas de otra persona', async () => {
    await avisos.guardarPreferencias({
      userId: new UserId(ANA),
      minutoSemaforo: 480,
      minutoRacha: 600,
    });

    const { rowCount } = await conAjustes(
      { 'vsd.usuario_actual': BETO },
      'SELECT * FROM preferencia_aviso WHERE id_usuario = $1',
      [ANA],
    );

    expect(rowCount).toBe(0);
  });

  describe('la tarea de avisos', () => {
    it('encuentra a quien le toca, de todas las personas, y no lo repite el mismo dia', async () => {
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        minutoSemaforo: 480,
        minutoRacha: null,
      });
      await avisos.guardarPreferencias({
        userId: new UserId(BETO),
        minutoSemaforo: 470,
        minutoRacha: 480,
      });

      const tocan = await avisos.aQuienLeToca(TipoDeAviso.SEMAFORO, 450, 480, HOY);

      expect(tocan.map((uno) => uno.value).sort()).toEqual([ANA, BETO]);

      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.SEMAFORO, HOY);

      expect(
        (await avisos.aQuienLeToca(TipoDeAviso.SEMAFORO, 450, 480, HOY)).map((uno) => uno.value),
      ).toEqual([BETO]);
      // Revisar el semaforo no toca la racha.
      expect(
        (await avisos.aQuienLeToca(TipoDeAviso.RACHA, 450, 480, HOY)).map((uno) => uno.value),
      ).toEqual([BETO]);
      // Al dia siguiente vuelve a tocar.
      expect(
        (await avisos.aQuienLeToca(TipoDeAviso.SEMAFORO, 450, 480, '2026-10-06')).map(
          (uno) => uno.value,
        ),
      ).toContain(ANA);
    });

    it('solo lee las horas: ni las cambia ni alcanza ninguna otra tabla', async () => {
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        minutoSemaforo: 480,
        minutoRacha: null,
      });
      await avisos.suscribir(new UserId(ANA), NAVEGADOR);
      await dueno.query('BEGIN');
      await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [ANA]);
      await dueno.query(
        `INSERT INTO pendiente (id_pendiente, id_usuario, texto, nivel, id_operacion_cliente, fecha_edicion)
         VALUES (gen_random_uuid(), $1, 'Pagar la matrícula', 'urgente', gen_random_uuid(), now())`,
        [ANA],
      );
      await dueno.query('COMMIT');

      const tarea = { 'vsd.tarea_actual': 'avisos' };

      expect((await conAjustes(tarea, 'SELECT * FROM preferencia_aviso')).rowCount).toBeGreaterThan(
        0,
      );
      expect(
        (await conAjustes(tarea, 'UPDATE preferencia_aviso SET minuto_semaforo = 0')).rowCount,
      ).toBe(0);
      expect((await conAjustes(tarea, 'SELECT * FROM pendiente')).rowCount).toBe(0);
      expect((await conAjustes(tarea, 'SELECT * FROM suscripcion_push')).rowCount).toBe(0);
      expect((await conAjustes(tarea, 'SELECT * FROM usuario')).rowCount).toBe(0);
    });
  });

  describe('los navegadores', () => {
    it('un navegador entrega los avisos de una sola persona', async () => {
      await avisos.suscribir(new UserId(ANA), NAVEGADOR);
      // Ana cerro sesion sin apagar los avisos; Beto entra en el mismo equipo.
      await avisos.suscribir(new UserId(BETO), NAVEGADOR);

      await expect(avisos.suscripcionesDe(new UserId(ANA))).resolves.toEqual([]);
      await expect(avisos.suscripcionesDe(new UserId(BETO))).resolves.toEqual([NAVEGADOR]);
    });

    it('sin la direccion del navegador, nadie toca la suscripcion de otra persona', async () => {
      await avisos.suscribir(new UserId(ANA), NAVEGADOR);

      await avisos.desuscribir(new UserId(BETO), NAVEGADOR.endpoint);

      await expect(avisos.suscripcionesDe(new UserId(ANA))).resolves.toEqual([NAVEGADOR]);

      const comoBeto = { 'vsd.usuario_actual': BETO };

      expect((await conAjustes(comoBeto, 'SELECT * FROM suscripcion_push')).rowCount).toBe(0);
      expect((await conAjustes(comoBeto, 'DELETE FROM suscripcion_push')).rowCount).toBe(0);
    });

    it('con la direccion se puede soltar, pero no cambiar de dueno', async () => {
      await avisos.suscribir(new UserId(ANA), NAVEGADOR);

      const enElNavegador = {
        'vsd.usuario_actual': BETO,
        'vsd.endpoint_actual': NAVEGADOR.endpoint,
      };

      expect(
        (await conAjustes(enElNavegador, 'UPDATE suscripcion_push SET id_usuario = $1', [BETO]))
          .rowCount,
      ).toBe(0);
      expect((await conAjustes(enElNavegador, 'DELETE FROM suscripcion_push')).rowCount).toBe(1);
    });

    it('se borran con la cuenta', async () => {
      await avisos.suscribir(new UserId(ANA), NAVEGADOR);
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        minutoSemaforo: 480,
        minutoRacha: 480,
      });

      await dueno.query('DELETE FROM usuario WHERE id_usuario = $1', [ANA]);

      const quedan = await dueno.query(
        `SELECT (SELECT count(*) FROM suscripcion_push WHERE id_usuario = $1)
              + (SELECT count(*) FROM preferencia_aviso WHERE id_usuario = $1) AS filas`,
        [ANA],
      );

      expect(Number((quedan.rows[0] as { filas: string }).filas)).toBe(0);
    });
  });
});
