// Vitest no lee `.env` por su cuenta y estas pruebas necesitan saber si hay
// una base local a la que conectarse.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { UserId } from '../../domain/model/Identifier.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaDatoCuriosoRepository } from './PrismaDatoCuriosoRepository.js';

/**
 * Los datos curiosos contra PostgreSQL de verdad (SCRUM-185, ADR 0025).
 *
 * El adaptador en memoria calcula el orden con otro hash, asi que lo que se prueba aqui no son
 * valores sino **propiedades**: que el «siguiente» recorre todo el catalogo publicado sin
 * repetir, que cada persona tiene su orden, que lo retirado no sale y que el cursor es de su
 * dueno. Valen sea cual sea el catalogo que haya en la base (la migracion trae un catalogo
 * inicial y otras suites comparten la base).
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const USUARIO_A = '10000000-0000-4000-8000-0000000000d1';
const USUARIO_B = '10000000-0000-4000-8000-0000000000d2';
const RETIRADO = '70000000-0000-4000-8000-0000000000d1';
const PASAJERO = '70000000-0000-4000-8000-0000000000d2';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

describe.skipIf(URL_DUENO === undefined)('PrismaDatoCuriosoRepository contra PostgreSQL', () => {
  let dueno: Client;
  let prisma: PrismaService;
  let repositorio: PrismaDatoCuriosoRepository;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);

    await limpiar();
    await sembrar();

    prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
    await prisma.onModuleInit();

    repositorio = new PrismaDatoCuriosoRepository(prisma);
  });

  afterAll(async () => {
    await prisma?.onModuleDestroy();
    await limpiar();
    await dueno?.end();
  });

  // Solo los cursores de esta suite: las suites de integracion comparten la base y corren en
  // paralelo.
  beforeEach(async () => {
    await dueno.query('DELETE FROM dato_curioso_cursor WHERE id_usuario = ANY($1)', [
      [USUARIO_A, USUARIO_B],
    ]);
  });

  async function limpiar(): Promise<void> {
    await dueno.query('DELETE FROM dato_curioso_cursor WHERE id_usuario = ANY($1)', [
      [USUARIO_A, USUARIO_B],
    ]);
    await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
    await dueno.query('DELETE FROM dato_curioso WHERE id_dato = ANY($1)', [[RETIRADO, PASAJERO]]);
  }

  async function sembrar(): Promise<void> {
    await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");

    // Un dato sin publicar: existe, pero no se sirve.
    await dueno.query(
      `INSERT INTO dato_curioso (id_dato, texto, tema, publicado)
       VALUES ($1, 'Un dato retirado que no debe salir.', 'prueba', false)`,
      [RETIRADO],
    );

    for (const usuario of [USUARIO_A, USUARIO_B]) {
      await dueno.query("SELECT set_config('vsd.usuario_actual', $1, false)", [usuario]);
      await dueno.query(
        `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
         VALUES ($1, $2, $3, '1.0', now())`,
        [usuario, `${usuario}@ejemplo.test`, `proveedor-de-prueba-${usuario}`],
      );
    }

    await dueno.query("SELECT set_config('vsd.usuario_actual', '', false)");
    await dueno.query("SELECT set_config('vsd.rol_actual', '', false)");
  }

  async function cuantosPublicados(): Promise<number> {
    const { rows } = await dueno.query<{ n: string }>(
      'SELECT count(*)::text AS n FROM dato_curioso WHERE publicado',
    );

    return Number(rows[0]?.n ?? 0);
  }

  /** Recorre el ciclo de una persona: `cuantos` datos seguidos desde el principio. */
  async function recorrer(
    persona: string,
    cuantos: number,
  ): Promise<{ id: string; clave: bigint }[]> {
    const salida: { id: string; clave: bigint }[] = [];
    let despuesDe: { clave: bigint; idDato: string | null } | null = null;

    for (let i = 0; i < cuantos; i++) {
      const siguiente = await repositorio.siguienteDespuesDe(new UserId(persona), despuesDe);

      if (siguiente === null) {
        break;
      }

      salida.push({ id: siguiente.dato.id, clave: siguiente.clave });
      despuesDe = { clave: siguiente.clave, idDato: siguiente.dato.id };
    }

    return salida;
  }

  it('recorre todo el catalogo publicado una vez, sin repetir ni sacar lo retirado', async () => {
    const publicados = await cuantosPublicados();

    expect(publicados).toBeGreaterThan(0);

    const ciclo = await recorrer(USUARIO_A, publicados);
    const ids = ciclo.map((uno) => uno.id);

    expect(ciclo).toHaveLength(publicados);
    expect(new Set(ids).size).toBe(publicados);
    expect(ids).not.toContain(RETIRADO);
  });

  it('las claves van en orden creciente dentro del ciclo', async () => {
    const ciclo = await recorrer(USUARIO_A, 25);

    for (let i = 1; i < ciclo.length; i++) {
      expect(
        (ciclo[i] as { clave: bigint }).clave > (ciclo[i - 1] as { clave: bigint }).clave,
      ).toBe(true);
    }
  });

  it('al terminar vuelve al principio: es un ciclo nuevo, en el mismo orden', async () => {
    const publicados = await cuantosPublicados();
    const dosCiclos = await recorrer(USUARIO_A, publicados + 3);

    expect(dosCiclos.slice(publicados).map((uno) => uno.id)).toEqual(
      dosCiclos.slice(0, 3).map((uno) => uno.id),
    );
  });

  it('cada persona tiene su propio orden', async () => {
    const deA = (await recorrer(USUARIO_A, 12)).map((uno) => uno.id);
    const deB = (await recorrer(USUARIO_B, 12)).map((uno) => uno.id);

    expect(deA).not.toEqual(deB);
  });

  it('es el mismo orden cada vez que se calcula', async () => {
    const uno = (await recorrer(USUARIO_A, 10)).map((x) => x.id);
    const otro = (await recorrer(USUARIO_A, 10)).map((x) => x.id);

    expect(otro).toEqual(uno);
  });

  it('un dato nuevo entra donde le toca y no hace repetir los ya vistos', async () => {
    const publicados = await cuantosPublicados();
    const antes = await recorrer(USUARIO_A, 5);
    const visto = antes.map((uno) => uno.id);
    const cursor = antes[4] as { id: string; clave: bigint };

    await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");
    await dueno.query(
      `INSERT INTO dato_curioso (id_dato, texto, tema, publicado)
       VALUES ($1, 'Un dato que llega con el ciclo en curso.', 'prueba', true)`,
      [PASAJERO],
    );
    await dueno.query("SELECT set_config('vsd.rol_actual', '', false)");

    try {
      // Lo que queda del ciclo, a partir del cursor: ninguno de los 5 ya vistos.
      let despuesDe: { clave: bigint; idDato: string | null } | null = {
        clave: cursor.clave,
        idDato: cursor.id,
      };
      const resto: string[] = [];

      for (let i = 0; i < publicados + 1 - 5; i++) {
        const siguiente = await repositorio.siguienteDespuesDe(new UserId(USUARIO_A), despuesDe);

        if (siguiente === null) {
          break;
        }

        // Si volvio al principio, el ciclo termino: lo que sigue ya es otro.
        if (siguiente.clave <= (despuesDe?.clave ?? 0n)) {
          break;
        }

        resto.push(siguiente.dato.id);
        despuesDe = { clave: siguiente.clave, idDato: siguiente.dato.id };
      }

      for (const id of resto) {
        expect(visto).not.toContain(id);
      }

      expect(new Set(resto).size).toBe(resto.length);
    } finally {
      await dueno.query('DELETE FROM dato_curioso WHERE id_dato = $1', [PASAJERO]);
    }
  });

  describe('porId', () => {
    it('da un dato sin publicar: quien ya lo tiene como el del dia lo conserva', async () => {
      await expect(repositorio.porId(RETIRADO)).resolves.toMatchObject({
        id: RETIRADO,
        texto: 'Un dato retirado que no debe salir.',
      });
    });

    it('un dato que no existe da nada', async () => {
      await expect(repositorio.porId('70000000-0000-4000-8000-0000000000ff')).resolves.toBeNull();
    });
  });

  describe('el cursor', () => {
    it('guarda y devuelve lo mismo, con la clave de 64 bits intacta', async () => {
      const [primero] = await recorrer(USUARIO_A, 1);
      const unaClave = -9_007_199_254_740_993n;

      await repositorio.guardarCursor(new UserId(USUARIO_A), {
        idDato: (primero as { id: string }).id,
        clave: unaClave,
        dia: '2026-10-13',
      });

      await expect(repositorio.cursorDe(new UserId(USUARIO_A))).resolves.toEqual({
        idDato: (primero as { id: string }).id,
        clave: unaClave,
        dia: '2026-10-13',
      });
    });

    it('guardarlo otra vez lo reemplaza: una sola fila por persona', async () => {
      const [primero] = await recorrer(USUARIO_A, 1);
      const id = (primero as { id: string }).id;

      await repositorio.guardarCursor(new UserId(USUARIO_A), {
        idDato: id,
        clave: 1n,
        dia: '2026-10-13',
      });
      await repositorio.guardarCursor(new UserId(USUARIO_A), {
        idDato: id,
        clave: 2n,
        dia: '2026-10-14',
      });

      const { rows } = await dueno.query<{ n: string }>(
        'SELECT count(*)::text AS n FROM dato_curioso_cursor WHERE id_usuario = $1',
        [USUARIO_A],
      );

      expect(rows[0]?.n).toBe('1');
      await expect(repositorio.cursorDe(new UserId(USUARIO_A))).resolves.toMatchObject({
        clave: 2n,
        dia: '2026-10-14',
      });
    });

    it('sin cursor da nada', async () => {
      await expect(repositorio.cursorDe(new UserId(USUARIO_A))).resolves.toBeNull();
    });

    it('el cursor de una persona no lo ve otra: el aislamiento lo pone la base', async () => {
      const [primero] = await recorrer(USUARIO_A, 1);

      await repositorio.guardarCursor(new UserId(USUARIO_A), {
        idDato: (primero as { id: string }).id,
        clave: 5n,
        dia: '2026-10-13',
      });

      await expect(repositorio.cursorDe(new UserId(USUARIO_B))).resolves.toBeNull();
    });

    it('si el dato se borra del catalogo, el cursor sigue sirviendo por su clave', async () => {
      await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");
      await dueno.query(
        `INSERT INTO dato_curioso (id_dato, texto, tema, publicado)
         VALUES ($1, 'Un dato que se borra enseguida.', 'prueba', true)`,
        [PASAJERO],
      );

      await repositorio.guardarCursor(new UserId(USUARIO_A), {
        idDato: PASAJERO,
        clave: 42n,
        dia: '2026-10-13',
      });

      await dueno.query('DELETE FROM dato_curioso WHERE id_dato = $1', [PASAJERO]);
      await dueno.query("SELECT set_config('vsd.rol_actual', '', false)");

      await expect(repositorio.cursorDe(new UserId(USUARIO_A))).resolves.toEqual({
        idDato: null,
        clave: 42n,
        dia: '2026-10-13',
      });
    });
  });
});
