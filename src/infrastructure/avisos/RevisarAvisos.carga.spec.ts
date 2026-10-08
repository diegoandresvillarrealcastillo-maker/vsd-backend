// Vitest no lee `.env` por su cuenta y esta prueba necesita saber a que base apuntar.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RevisarAvisosUseCaseImpl } from '../../application/usecases/RevisarAvisosUseCaseImpl.js';
import type { MensajeDeAviso, SuscripcionPush } from '../../domain/model/Aviso.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { Entrega, EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaAvisosRepository } from '../repositories/PrismaAvisosRepository.js';

/**
 * Prueba de carga de la revision de avisos (SCRUM-160). **Opcional**: no corre sola.
 *
 * Mide cuanto tarda una revision cuando a muchas cuentas les toca el aviso en el
 * mismo minuto (las 8:00, que es cuando todo el mundo lo elige), contra PostgreSQL
 * de verdad y con el aislamiento por persona intacto, y compara cuantas personas
 * a la vez se atienden.
 *
 * Para correrla, contra la base LOCAL (`npm run db:local`):
 *
 *   $env:CARGA_DE_AVISOS_PERSONAS = '2000'
 *   npx vitest run RevisarAvisos.carga
 *
 * Variables:
 * - `CARGA_DE_AVISOS_PERSONAS`: cuantas cuentas sinteticas (sin ella, se salta).
 * - `CARGA_DE_AVISOS_LATENCIA_MS`: lo que tarda el servicio de push en contestar
 *   (por defecto 20 ms; los reales rondan entre 50 y 300 ms).
 * - `CARGA_DE_AVISOS_A_LA_VEZ`: las configuraciones a comparar (por defecto `1,4,8`).
 *
 * Se niega a correr si la base no es la de este equipo: crea miles de cuentas
 * falsas y las borra al terminar, y eso no se hace en PRE.
 *
 * El servicio de push es de mentira (solo espera y cuenta): lo que se mide es
 * nuestro trabajo, la base y la coordinacion, no la red de Google ni de Mozilla.
 */
const URL_DUENO = process.env['DATABASE_URL'];
const PERSONAS = Number(process.env['CARGA_DE_AVISOS_PERSONAS'] ?? '0');
const LATENCIA_MS = Number(process.env['CARGA_DE_AVISOS_LATENCIA_MS'] ?? '20');
const A_LA_VEZ = (process.env['CARGA_DE_AVISOS_A_LA_VEZ'] ?? '1,4,8')
  .split(',')
  .map((una) => Number(una.trim()))
  .filter((una) => Number.isInteger(una) && una >= 1);

const OCHO = new Date('2026-10-05T13:00:00.000Z');
const MINUTO_DE_LAS_OCHO = 480;
const PREFIJO = 'c0ffee00-0000-4000-8000-';

function esLocal(url: string | undefined): boolean {
  if (url === undefined) {
    return false;
  }

  try {
    return ['localhost', '127.0.0.1', '[::1]'].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

/** Un servicio de push de mentira: espera lo que se diga y cuenta cada envio. */
class EnviadorDeCarga implements EnviadorDePushPort {
  readonly clavePublica = 'clave-de-carga';
  readonly porNavegador = new Map<string, number>();
  enVuelo = 0;
  maximoEnVuelo = 0;

  async enviar(suscripcion: SuscripcionPush, _mensaje: MensajeDeAviso): Promise<Entrega> {
    this.enVuelo += 1;
    this.maximoEnVuelo = Math.max(this.maximoEnVuelo, this.enVuelo);

    await new Promise<void>((resolver) => setTimeout(resolver, LATENCIA_MS));

    this.enVuelo -= 1;
    this.porNavegador.set(
      suscripcion.endpoint,
      (this.porNavegador.get(suscripcion.endpoint) ?? 0) + 1,
    );

    return 'entregado';
  }
}

interface Medida {
  alaVez: string;
  personas: number;
  entregados: number;
  fallos: number;
  ms: number;
  porSegundo: number;
  maximoEnVuelo: number;
  repetidos: number;
}

describe.skipIf(PERSONAS < 1 || !esLocal(URL_DUENO))(
  `La revision de avisos con ${PERSONAS} cuentas (SCRUM-160, prueba de carga)`,
  () => {
    let dueno: Client;
    let prisma: PrismaService;
    let avisos: PrismaAvisosRepository;

    async function limpiar(): Promise<void> {
      for (const tabla of ['suscripcion_push', 'preferencia_aviso', 'usuario']) {
        await dueno.query(`DELETE FROM ${tabla} WHERE id_usuario::text LIKE $1`, [`${PREFIJO}%`]);
      }
    }

    async function sembrar(): Promise<void> {
      const id = `('${PREFIJO}' || lpad(i::text, 12, '0'))::uuid`;

      await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");
      await dueno.query(
        `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
         SELECT ${id}, 'carga-' || i || '@avisos-carga.test', 'proveedor-carga-' || i, '1.0', now()
         FROM generate_series(1, $1::int) AS i`,
        [PERSONAS],
      );
      await dueno.query(
        `INSERT INTO preferencia_aviso (id_usuario, minuto_manana)
         SELECT ${id}, $2::int FROM generate_series(1, $1::int) AS i`,
        [PERSONAS, MINUTO_DE_LAS_OCHO],
      );
      await dueno.query(
        `INSERT INTO suscripcion_push (id_suscripcion, id_usuario, endpoint, clave_p256dh, clave_auth)
         SELECT gen_random_uuid(), ${id}, 'https://fcm.googleapis.com/fcm/send/carga-' || i, 'clave-p256dh', 'clave-auth'
         FROM generate_series(1, $1::int) AS i`,
        [PERSONAS],
      );
      await dueno.query("SELECT set_config('vsd.rol_actual', '', false)");
    }

    /** Vuelve a dejar el aviso de hoy sin revisar para cada cuenta. */
    async function reiniciar(): Promise<void> {
      await dueno.query(
        'UPDATE preferencia_aviso SET ultimo_aviso_manana = NULL WHERE id_usuario::text LIKE $1',
        [`${PREFIJO}%`],
      );
    }

    function revision(enviador: EnviadorDeCarga, personasALaVez: number) {
      return new RevisarAvisosUseCaseImpl(
        avisos,
        enviador,
        {} as PendientesRepositoryPort,
        {} as ActivityResultRepositoryPort,
        undefined,
        personasALaVez,
      );
    }

    async function medir(
      etiqueta: string,
      correr: (enviador: EnviadorDeCarga) => Promise<{ entregados: number; fallos: number }[]>,
    ): Promise<Medida> {
      await reiniciar();

      const enviador = new EnviadorDeCarga();
      const inicio = performance.now();
      const resumenes = await correr(enviador);
      const ms = Math.round(performance.now() - inicio);
      const entregados = resumenes.reduce((suma, uno) => suma + uno.entregados, 0);
      const fallos = resumenes.reduce((suma, uno) => suma + uno.fallos, 0);
      const repetidos = [...enviador.porNavegador.values()].filter((veces) => veces > 1).length;
      const medida = {
        alaVez: etiqueta,
        personas: PERSONAS,
        entregados,
        fallos,
        ms,
        porSegundo: Math.round((entregados / Math.max(ms, 1)) * 1000),
        maximoEnVuelo: enviador.maximoEnVuelo,
        repetidos,
      };

      // Directo a la salida y no con `console`: Vitest no muestra lo que se escribe con
      // `console` en una prueba que pasa, y esto es justo lo que se quiere leer.
      process.stdout.write(
        `[carga] ${etiqueta} a la vez: ${medida.personas} personas, ${medida.entregados} entregados, ` +
          `${medida.fallos} fallos, ${medida.ms} ms (${medida.porSegundo} avisos/s), ` +
          `maximo en vuelo ${medida.maximoEnVuelo}, repetidos ${medida.repetidos}\n`,
      );

      return medida;
    }

    beforeAll(async () => {
      dueno = new Client({ connectionString: URL_DUENO });
      await dueno.connect();
      await prepararRolDeLaAplicacion(dueno);
      await limpiar();
      await sembrar();

      prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
      await prisma.onModuleInit();
      avisos = new PrismaAvisosRepository(prisma);
    }, 120_000);

    afterAll(async () => {
      await limpiar();
      await prisma.onModuleDestroy();
      await dueno.end();
    }, 120_000);

    it.each(A_LA_VEZ)(
      'con %i personas a la vez: todas reciben su aviso, una sola vez',
      async (personasALaVez) => {
        const medida = await medir(String(personasALaVez), async (enviador) => [
          await revision(enviador, personasALaVez).revisar(OCHO),
        ]);

        expect(medida.entregados).toBe(PERSONAS);
        expect(medida.fallos).toBe(0);
        expect(medida.repetidos).toBe(0);
        expect(medida.maximoEnVuelo).toBeLessThanOrEqual(personasALaVez);
      },
      600_000,
    );

    it('dos instancias del API a la vez: nadie recibe el aviso dos veces', async () => {
      const medida = await medir('2 instancias x 4', async (enviador) =>
        Promise.all([revision(enviador, 4).revisar(OCHO), revision(enviador, 4).revisar(OCHO)]),
      );

      expect(medida.entregados).toBe(PERSONAS);
      expect(medida.fallos).toBe(0);
      expect(medida.repetidos).toBe(0);
    }, 600_000);
  },
);
