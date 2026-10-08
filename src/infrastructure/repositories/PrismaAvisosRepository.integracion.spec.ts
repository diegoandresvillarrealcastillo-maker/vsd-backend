import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA, TipoDeAviso } from '../../domain/model/Aviso.js';
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
const ZONA = 'America/Bogota';

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
      zonaHoraria: ZONA,
      minutoSemaforo: 480,
      minutoRacha: null,
      minutoManana: null,
      minutoNoche: null,
    });

    await expect(avisos.preferenciasDe(new UserId(ANA))).resolves.toEqual({
      userId: new UserId(ANA),
      zonaHoraria: ZONA,
      minutoSemaforo: 480,
      minutoRacha: null,
      minutoManana: null,
      minutoNoche: null,
    });
    // Sin nada guardado, apagados.
    await expect(avisos.preferenciasDe(new UserId(BETO))).resolves.toMatchObject({
      minutoSemaforo: null,
      minutoRacha: null,
      minutoManana: null,
      minutoNoche: null,
    });
  });

  it('nadie ve las horas de otra persona', async () => {
    await avisos.guardarPreferencias({
      userId: new UserId(ANA),
      zonaHoraria: ZONA,
      minutoSemaforo: 480,
      minutoRacha: 600,
      minutoManana: null,
      minutoNoche: null,
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
        zonaHoraria: ZONA,
        minutoSemaforo: 480,
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: null,
      });
      await avisos.guardarPreferencias({
        userId: new UserId(BETO),
        zonaHoraria: ZONA,
        minutoSemaforo: 470,
        minutoRacha: 480,
        minutoManana: null,
        minutoNoche: null,
      });

      const tocan = await avisos.aQuienLeToca(TipoDeAviso.SEMAFORO, ZONA, 450, 480, HOY);

      expect(tocan.map((uno) => uno.value).sort()).toEqual([ANA, BETO]);

      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.SEMAFORO, HOY);

      expect(
        (await avisos.aQuienLeToca(TipoDeAviso.SEMAFORO, ZONA, 450, 480, HOY)).map(
          (uno) => uno.value,
        ),
      ).toEqual([BETO]);
      // Revisar el semaforo no toca la racha.
      expect(
        (await avisos.aQuienLeToca(TipoDeAviso.RACHA, ZONA, 450, 480, HOY)).map((uno) => uno.value),
      ).toEqual([BETO]);
      // Al dia siguiente vuelve a tocar.
      expect(
        (await avisos.aQuienLeToca(TipoDeAviso.SEMAFORO, ZONA, 450, 480, '2026-10-06')).map(
          (uno) => uno.value,
        ),
      ).toContain(ANA);
    });

    it('solo lee las horas: ni las cambia ni alcanza ninguna otra tabla', async () => {
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        zonaHoraria: ZONA,
        minutoSemaforo: 480,
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: null,
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

  describe('los recordatorios de las 8:00 y las 20:00 (SCRUM-126)', () => {
    const MANANA_FIJA = 480;
    const NOCHE_FIJA = 1200;

    function preferencias(persona: string, cambios: Record<string, number | null> = {}) {
      return {
        userId: new UserId(persona),
        zonaHoraria: ZONA,
        minutoSemaforo: null,
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: null,
        ...cambios,
      };
    }

    async function aQuien(tipo: TipoDeAviso, desde = 0, hasta = 1439, dia = HOY) {
      return (await avisos.aQuienLeToca(tipo, ZONA, desde, hasta, dia)).map((uno) => uno.value);
    }

    it('se guardan y vuelven, cada uno por separado', async () => {
      await avisos.guardarPreferencias(preferencias(ANA, { minutoManana: MANANA_FIJA }));

      await expect(avisos.preferenciasDe(new UserId(ANA))).resolves.toMatchObject({
        minutoManana: 480,
        minutoNoche: null,
      });

      await avisos.guardarPreferencias(
        preferencias(ANA, { minutoManana: MANANA_FIJA, minutoNoche: NOCHE_FIJA }),
      );

      await expect(avisos.preferenciasDe(new UserId(ANA))).resolves.toMatchObject({
        minutoManana: 480,
        minutoNoche: 1200,
      });
    });

    it('quien tiene solo uno encendido ya cuenta como zona en uso', async () => {
      await avisos.guardarPreferencias(preferencias(ANA, { minutoNoche: NOCHE_FIJA }));

      await expect(avisos.zonasEnUso()).resolves.toEqual([ZONA]);
    });

    it('le toca a quien lo tiene encendido, a su hora, y una sola vez al dia', async () => {
      await avisos.guardarPreferencias(preferencias(ANA, { minutoManana: MANANA_FIJA }));
      await avisos.guardarPreferencias(preferencias(BETO, { minutoNoche: NOCHE_FIJA }));

      expect(await aQuien(TipoDeAviso.MANANA, 450, 480)).toEqual([ANA]);
      expect(await aQuien(TipoDeAviso.MANANA, 481, 510)).toEqual([]);
      expect(await aQuien(TipoDeAviso.NOCHE, 1170, 1200)).toEqual([BETO]);

      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.MANANA, HOY);

      expect(await aQuien(TipoDeAviso.MANANA)).toEqual([]);
      expect(await aQuien(TipoDeAviso.MANANA, 0, 1439, '2026-10-06')).toEqual([ANA]);
    });

    it('revisar uno no cuenta como revisar el otro', async () => {
      await avisos.guardarPreferencias(
        preferencias(ANA, { minutoManana: MANANA_FIJA, minutoNoche: NOCHE_FIJA }),
      );
      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.MANANA, HOY);

      expect(await aQuien(TipoDeAviso.NOCHE)).toEqual([ANA]);
    });

    it('la racha y la noche invitan a lo mismo: la primera que se revisa cada dia es la unica', async () => {
      await avisos.guardarPreferencias(
        preferencias(ANA, { minutoRacha: 1140, minutoNoche: NOCHE_FIJA }),
      );

      // Antes de que salga alguna, le tocan las dos.
      expect(await aQuien(TipoDeAviso.RACHA)).toEqual([ANA]);
      expect(await aQuien(TipoDeAviso.NOCHE)).toEqual([ANA]);

      // Salio la racha (19:00): la noche ya no le toca ese dia...
      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.RACHA, HOY);
      expect(await aQuien(TipoDeAviso.NOCHE)).toEqual([]);
      // ... y al dia siguiente vuelven las dos.
      expect(await aQuien(TipoDeAviso.NOCHE, 0, 1439, '2026-10-06')).toEqual([ANA]);
      expect(await aQuien(TipoDeAviso.RACHA, 0, 1439, '2026-10-06')).toEqual([ANA]);
    });

    it('y al reves: si salio la noche, la racha mas tarde ya no le toca', async () => {
      await avisos.guardarPreferencias(
        preferencias(ANA, { minutoRacha: 1260, minutoNoche: NOCHE_FIJA }),
      );
      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.NOCHE, HOY);

      expect(await aQuien(TipoDeAviso.RACHA)).toEqual([]);
    });

    it('lo de una persona no afecta a otra, ni a lo que dice otra cosa', async () => {
      await avisos.guardarPreferencias(
        preferencias(ANA, {
          minutoSemaforo: 480,
          minutoManana: MANANA_FIJA,
          minutoRacha: 1140,
          minutoNoche: NOCHE_FIJA,
        }),
      );
      await avisos.guardarPreferencias(preferencias(BETO, { minutoNoche: NOCHE_FIJA }));
      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.RACHA, HOY);
      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.NOCHE, HOY);

      expect(await aQuien(TipoDeAviso.NOCHE)).toEqual([BETO]);
      expect(await aQuien(TipoDeAviso.SEMAFORO)).toEqual([ANA]);
      expect(await aQuien(TipoDeAviso.MANANA)).toEqual([ANA]);
    });

    it('la tarea de avisos los lee, pero no los escribe', async () => {
      await avisos.guardarPreferencias(
        preferencias(ANA, { minutoManana: MANANA_FIJA, minutoNoche: NOCHE_FIJA }),
      );

      const tarea = { 'vsd.tarea_actual': 'avisos' };

      expect(
        (await conAjustes(tarea, 'SELECT minuto_manana, minuto_noche FROM preferencia_aviso'))
          .rowCount,
      ).toBeGreaterThan(0);
      expect(
        (await conAjustes(tarea, 'UPDATE preferencia_aviso SET minuto_manana = 0')).rowCount,
      ).toBe(0);
      expect(
        (await conAjustes(tarea, 'UPDATE preferencia_aviso SET ultimo_aviso_noche = now()'))
          .rowCount,
      ).toBe(0);
    });

    it('nadie ve ni toca los de otra persona', async () => {
      await avisos.guardarPreferencias(preferencias(ANA, { minutoManana: MANANA_FIJA }));

      const comoBeto = { 'vsd.usuario_actual': BETO };

      expect(
        (await conAjustes(comoBeto, 'SELECT * FROM preferencia_aviso WHERE id_usuario = $1', [ANA]))
          .rowCount,
      ).toBe(0);
      expect(
        (
          await conAjustes(
            comoBeto,
            'UPDATE preferencia_aviso SET minuto_manana = NULL WHERE id_usuario = $1',
            [ANA],
          )
        ).rowCount,
      ).toBe(0);
    });

    it.each(['minuto_manana', 'minuto_noche'])(
      '%s no puede ser un minuto que no existe',
      async (columna) => {
        await expect(
          dueno.query(`INSERT INTO preferencia_aviso (id_usuario, ${columna}) VALUES ($1, $2)`, [
            ANA,
            1440,
          ]),
        ).rejects.toThrow(/del_dia/);
      },
    );

    it('las cuentas que ya existian antes de la migracion quedan con los dos apagados', async () => {
      // Una fila como las de antes de SCRUM-126: sin tocar las columnas nuevas.
      await dueno.query('BEGIN');
      await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [ANA]);
      await dueno.query(
        'INSERT INTO preferencia_aviso (id_usuario, minuto_semaforo, minuto_racha) VALUES ($1, 480, 1140)',
        [ANA],
      );
      await dueno.query('COMMIT');

      await expect(avisos.preferenciasDe(new UserId(ANA))).resolves.toMatchObject({
        minutoSemaforo: 480,
        minutoRacha: 1140,
        minutoManana: null,
        minutoNoche: null,
      });
    });
  });

  describe('la zona de cada persona (SCRUM-123)', () => {
    /** Cambia la zona de la cuenta como lo hace la API: la persona, en su sesion. */
    async function cambiarZona(persona: string, zona: string): Promise<void> {
      await conAjustes(
        { 'vsd.usuario_actual': persona },
        'UPDATE usuario SET zona_horaria = $1 WHERE id_usuario = $2',
        [zona, persona],
      );
    }

    it('las preferencias nacen en la zona de la cuenta, aunque la aplicacion mande otra', async () => {
      await cambiarZona(ANA, 'Europe/Madrid');

      // La aplicacion no escribe la zona de los avisos: la copia la base.
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        zonaHoraria: 'Asia/Tokyo',
        minutoSemaforo: 480,
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: null,
      });

      await expect(avisos.preferenciasDe(new UserId(ANA))).resolves.toMatchObject({
        zonaHoraria: 'Europe/Madrid',
      });
    });

    it('si la persona cambia de zona, sus horas pasan a leerse en la nueva', async () => {
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        zonaHoraria: ZONA,
        minutoSemaforo: 480,
        minutoRacha: 600,
        minutoManana: null,
        minutoNoche: null,
      });

      await cambiarZona(ANA, 'Europe/Madrid');

      await expect(avisos.preferenciasDe(new UserId(ANA))).resolves.toMatchObject({
        zonaHoraria: 'Europe/Madrid',
        minutoSemaforo: 480,
        minutoRacha: 600,
        minutoManana: null,
        minutoNoche: null,
      });
    });

    it('cambiar la zona de una persona no toca las horas de otra', async () => {
      for (const persona of [ANA, BETO]) {
        await avisos.guardarPreferencias({
          userId: new UserId(persona),
          zonaHoraria: ZONA,
          minutoSemaforo: 480,
          minutoRacha: null,
          minutoManana: null,
          minutoNoche: null,
        });
      }

      await cambiarZona(ANA, 'Europe/Madrid');

      await expect(avisos.preferenciasDe(new UserId(BETO))).resolves.toMatchObject({
        zonaHoraria: ZONA,
      });
    });

    it('la tarea ve las zonas en uso y a quien le toca en cada una', async () => {
      await cambiarZona(BETO, 'Europe/Madrid');

      for (const persona of [ANA, BETO]) {
        await avisos.guardarPreferencias({
          userId: new UserId(persona),
          zonaHoraria: ZONA,
          minutoSemaforo: 480,
          minutoRacha: null,
          minutoManana: null,
          minutoNoche: null,
        });
      }

      expect([...(await avisos.zonasEnUso())].sort()).toEqual(['America/Bogota', 'Europe/Madrid']);

      const enBogota = await avisos.aQuienLeToca(
        TipoDeAviso.SEMAFORO,
        'America/Bogota',
        480,
        480,
        HOY,
      );
      const enMadrid = await avisos.aQuienLeToca(
        TipoDeAviso.SEMAFORO,
        'Europe/Madrid',
        480,
        480,
        HOY,
      );

      expect(enBogota.map((uno) => uno.value)).toEqual([ANA]);
      expect(enMadrid.map((uno) => uno.value)).toEqual([BETO]);
    });

    it('una persona con todos los avisos apagados no cuenta como zona en uso', async () => {
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        zonaHoraria: ZONA,
        minutoSemaforo: null,
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: null,
      });

      await expect(avisos.zonasEnUso()).resolves.toEqual([]);
    });
  });

  describe('reclamar el aviso del dia (SCRUM-160)', () => {
    function encendidos(persona: string) {
      return {
        userId: new UserId(persona),
        zonaHoraria: ZONA,
        minutoSemaforo: 480,
        minutoRacha: 1140,
        minutoManana: 480,
        minutoNoche: 1200,
      };
    }

    async function reclamosSimultaneos(
      persona: string,
      tipos: readonly TipoDeAviso[],
      cuantos: number,
      dia = HOY,
    ): Promise<boolean[]> {
      const llamadas: Promise<boolean>[] = [];

      for (let indice = 0; indice < cuantos; indice += 1) {
        const tipo = tipos[indice % tipos.length];

        if (tipo !== undefined) {
          llamadas.push(avisos.marcarRevisado(new UserId(persona), tipo, dia));
        }
      }

      return Promise.all(llamadas);
    }

    it('la primera llamada lo reclama y la segunda no', async () => {
      await avisos.guardarPreferencias(encendidos(ANA));

      await expect(avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.SEMAFORO, HOY)).resolves.toBe(
        true,
      );
      await expect(avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.SEMAFORO, HOY)).resolves.toBe(
        false,
      );
    });

    it('con 30 reclamos a la vez, exactamente uno lo gana', async () => {
      await avisos.guardarPreferencias(encendidos(ANA));

      // Son 30 llamadas contra el pool de la base: dependen de la base, no de
      // que el codigo de la aplicacion vaya en orden.
      const resultados = await reclamosSimultaneos(ANA, [TipoDeAviso.MANANA], 30);

      expect(resultados.filter(Boolean)).toHaveLength(1);
      expect(await avisos.aQuienLeToca(TipoDeAviso.MANANA, ZONA, 0, 1439, HOY)).toEqual([]);
    });

    it('la racha y la noche son la misma invitacion: a la vez, solo una sale', async () => {
      await avisos.guardarPreferencias(encendidos(ANA));

      const resultados = await reclamosSimultaneos(ANA, [TipoDeAviso.RACHA, TipoDeAviso.NOCHE], 30);

      expect(resultados.filter(Boolean)).toHaveLength(1);
      expect(await avisos.aQuienLeToca(TipoDeAviso.RACHA, ZONA, 0, 1439, HOY)).toEqual([]);
      expect(await avisos.aQuienLeToca(TipoDeAviso.NOCHE, ZONA, 0, 1439, HOY)).toEqual([]);
    });

    it('reclamar una clase de aviso no cierra las otras', async () => {
      await avisos.guardarPreferencias(encendidos(ANA));

      await expect(avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.MANANA, HOY)).resolves.toBe(
        true,
      );
      await expect(avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.SEMAFORO, HOY)).resolves.toBe(
        true,
      );
      await expect(avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.RACHA, HOY)).resolves.toBe(
        true,
      );
    });

    it('al dia siguiente se vuelve a poder reclamar', async () => {
      await avisos.guardarPreferencias(encendidos(ANA));
      await avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.MANANA, HOY);

      await expect(
        avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.MANANA, '2026-10-06'),
      ).resolves.toBe(true);
    });

    it('lo que reclama una persona no cierra el aviso de otra', async () => {
      await avisos.guardarPreferencias(encendidos(ANA));
      await avisos.guardarPreferencias(encendidos(BETO));

      const [deAna, deBeto] = await Promise.all([
        reclamosSimultaneos(ANA, [TipoDeAviso.SEMAFORO], 10),
        reclamosSimultaneos(BETO, [TipoDeAviso.SEMAFORO], 10),
      ]);

      expect(deAna.filter(Boolean)).toHaveLength(1);
      expect(deBeto.filter(Boolean)).toHaveLength(1);
    });

    it('quien no tiene nada guardado no tiene nada que reclamar', async () => {
      await expect(
        avisos.marcarRevisado(new UserId(BETO), TipoDeAviso.SEMAFORO, HOY),
      ).resolves.toBe(false);
    });

    it('no abre ninguna lectura de mas: reclamar sigue yendo en nombre de la persona', async () => {
      await avisos.guardarPreferencias(encendidos(ANA));

      // Con la sesion de otra persona la base no deja ni ver la fila: el reclamo
      // actualiza cero filas aunque el aviso siga sin revisar.
      const comoBeto = { 'vsd.usuario_actual': BETO };

      expect(
        (
          await conAjustes(
            comoBeto,
            'UPDATE preferencia_aviso SET ultimo_aviso_manana = $2 WHERE id_usuario = $1',
            [ANA, HOY],
          )
        ).rowCount,
      ).toBe(0);
      await expect(avisos.marcarRevisado(new UserId(ANA), TipoDeAviso.MANANA, HOY)).resolves.toBe(
        true,
      );
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

    describe('el tope por cuenta (SCRUM-153)', () => {
      const navegador = (numero: number) => ({
        endpoint: `https://fcm.googleapis.com/fcm/send/10210210-tope-${numero}`,
        p256dh: 'clave-p256dh',
        auth: 'clave-auth',
      });

      it('al pasar el tope sale la mas antigua y las demas se quedan', async () => {
        for (let numero = 1; numero <= MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA + 2; numero += 1) {
          await avisos.suscribir(new UserId(ANA), navegador(numero));
        }

        const quedan = (await avisos.suscripcionesDe(new UserId(ANA))).map((una) => una.endpoint);

        expect(quedan).toHaveLength(MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA);
        expect(quedan).not.toContain(navegador(1).endpoint);
        expect(quedan).not.toContain(navegador(2).endpoint);
        expect(quedan).toContain(navegador(3).endpoint);
        expect(quedan).toContain(navegador(MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA + 2).endpoint);
      });

      it('el tope es de cada cuenta', async () => {
        await avisos.suscribir(new UserId(BETO), navegador(500));

        for (let numero = 1; numero <= MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA + 3; numero += 1) {
          await avisos.suscribir(new UserId(ANA), navegador(numero));
        }

        await expect(avisos.suscripcionesDe(new UserId(BETO))).resolves.toEqual([navegador(500)]);
      });

      it('renovar un navegador ya guardado no hace salir a ninguno', async () => {
        for (let numero = 1; numero <= MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA; numero += 1) {
          await avisos.suscribir(new UserId(ANA), navegador(numero));
        }

        await avisos.suscribir(new UserId(ANA), navegador(1));

        await expect(avisos.suscripcionesDe(new UserId(ANA))).resolves.toHaveLength(
          MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA,
        );
      });
    });

    it('se borran con la cuenta', async () => {
      await avisos.suscribir(new UserId(ANA), NAVEGADOR);
      await avisos.guardarPreferencias({
        userId: new UserId(ANA),
        zonaHoraria: ZONA,
        minutoSemaforo: 480,
        minutoRacha: 480,
        minutoManana: null,
        minutoNoche: null,
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
