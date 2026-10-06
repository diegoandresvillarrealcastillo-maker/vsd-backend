import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import { Pendiente } from '../../domain/model/Pendiente.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaPendientesRepository } from './PrismaPendientesRepository.js';

/**
 * El semaforo contra PostgreSQL de verdad (SCRUM-97).
 *
 * La prueba que define la tarea: nadie lee ni modifica los pendientes de otra
 * persona, **aunque lo intente directo contra la base** con el rol de la
 * aplicacion. Identificadores propios de esta suite.
 */
const URL_DUENO = process.env['DATABASE_URL'];

const PERSONA = '97979797-0000-4000-8000-0000000000a1';
const OTRA = '97979797-0000-4000-8000-0000000000b2';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

let contador = 0;
function nuevoId(): string {
  contador += 1;

  return '97979797-1111-4111-8111-' + String(contador).padStart(12, '0');
}

function pendiente(
  persona: string,
  texto: string,
  operacion = nuevoId(),
  fechaLimite?: string,
): Pendiente {
  return Pendiente.nuevo(
    {
      id: new PendienteId(nuevoId()),
      userId: new UserId(persona),
      clientOperationId: new ClientOperationId(operacion),
      texto,
      nivel: 'urgente',
      fechaLimite,
    },
    new Date(),
  );
}

async function limpiar(dueno: Client): Promise<void> {
  await dueno.query('DELETE FROM pendiente WHERE id_usuario = ANY($1)', [[PERSONA, OTRA]]);
  await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [[PERSONA, OTRA]]);
}

async function sembrarPersonas(dueno: Client): Promise<void> {
  for (const [persona, correo] of [
    [PERSONA, 'a@pendientes-integracion.test'],
    [OTRA, 'b@pendientes-integracion.test'],
  ]) {
    await dueno.query('BEGIN');
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
    await dueno.query(
      `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, $2, $3, '1.0', now())`,
      [persona, correo, `proveedor-pendientes-${persona}`],
    );
    await dueno.query('COMMIT');
  }
}

describe.skipIf(URL_DUENO === undefined)('El semaforo en PostgreSQL', () => {
  let dueno: Client;
  let comoApp: Client;
  let prisma: PrismaService;
  let pendientes: PrismaPendientesRepository;

  /** Una sentencia con el rol de la aplicacion, declarandose `persona`. */
  async function comoPersona(
    persona: string,
    sql: string,
    parametros: unknown[] = [],
    rol = 'usuario',
  ): Promise<{ rowCount: number; rows: unknown[] }> {
    await comoApp.query('BEGIN');

    try {
      await comoApp.query(
        "SELECT set_config('vsd.usuario_actual', $1, true), set_config('vsd.rol_actual', $2, true)",
        [persona, rol],
      );
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
    pendientes = new PrismaPendientesRepository(prisma);
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

  it('guarda y devuelve un pendiente, con su hora intacta', async () => {
    const nuevo = pendiente(PERSONA, 'Pagar la matrícula');

    const guardado = await pendientes.guardarNuevo(nuevo);
    const leido = await pendientes.porId(nuevo.userId, nuevo.id);

    for (const uno of [guardado, leido]) {
      expect(uno?.texto).toBe('Pagar la matrícula');
      expect(uno?.nivel).toBe('urgente');
      expect(uno?.creadoEn).toEqual(nuevo.creadoEn);
    }
  });

  describe('la fecha limite (SCRUM-119)', () => {
    it('un pendiente sin fecha vuelve sin fecha', async () => {
      const guardado = await pendientes.guardarNuevo(pendiente(PERSONA, 'General'));

      expect(guardado.fechaLimite).toBeUndefined();
      expect((await pendientes.porId(guardado.userId, guardado.id))?.fechaLimite).toBeUndefined();
    });

    it('guarda el dia tal cual, sin moverlo por la zona del servidor', async () => {
      const nuevo = pendiente(PERSONA, 'Entregar', nuevoId(), '2026-10-12');

      const guardado = await pendientes.guardarNuevo(nuevo);
      const leido = await pendientes.porId(nuevo.userId, nuevo.id);

      expect(guardado.fechaLimite).toBe('2026-10-12');
      expect(leido?.fechaLimite).toBe('2026-10-12');
    });

    it('se puede cambiar y quitar, y llega a la base', async () => {
      const guardado = await pendientes.guardarNuevo(
        pendiente(PERSONA, 'Entregar', nuevoId(), '2026-10-12'),
      );

      const cambiada = await pendientes.actualizar(
        guardado.editar({ fechaLimite: '2026-11-03' }, new Date()),
      );
      const quitada = await pendientes.actualizar(
        guardado.editar({ fechaLimite: null }, new Date()),
      );

      expect(cambiada?.fechaLimite).toBe('2026-11-03');
      expect(quitada?.fechaLimite).toBeUndefined();
    });

    it('la columna es un DATE: no guarda la hora', async () => {
      await pendientes.guardarNuevo(pendiente(PERSONA, 'Entregar', nuevoId(), '2026-10-12'));

      const { rows } = await dueno.query<{ tipo: string }>(
        `SELECT data_type AS tipo FROM information_schema.columns
          WHERE table_name = 'pendiente' AND column_name = 'fecha_limite'`,
      );

      expect(rows[0]?.tipo).toBe('date');
    });
  });

  it('posponer y marcar hecho llegan a la base', async () => {
    const guardado = await pendientes.guardarNuevo(pendiente(PERSONA, 'Llamar'));
    const ahora = new Date();
    const enUnaSemana = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

    const pospuesto = await pendientes.actualizar(
      guardado.editar({ posponerHasta: enUnaSemana }, ahora),
    );

    expect(pospuesto?.posponerHasta).toEqual(enUnaSemana);

    const hecho = await pendientes.actualizar(
      guardado.editar({ hecho: true, posponerHasta: null }, ahora),
    );

    expect(hecho).toMatchObject({ hecho: true, posponerHasta: undefined });
  });

  it('la misma operacion dos veces a la vez deja uno solo', async () => {
    const operacion = nuevoId();

    const [uno, otro] = await Promise.all([
      pendientes.guardarNuevo(pendiente(PERSONA, 'Primero', operacion)),
      pendientes.guardarNuevo(pendiente(PERSONA, 'Segundo', operacion)),
    ]);

    expect(uno.id.equals(otro.id)).toBe(true);

    const { rows } = await dueno.query(
      'SELECT count(*)::int AS n FROM pendiente WHERE id_usuario = $1',
      [PERSONA],
    );

    expect(rows[0]).toEqual({ n: 1 });
  });

  describe('Nadie mas', () => {
    it('otra persona no lo lee, ni sabiendo su identificador', async () => {
      const suyo = await pendientes.guardarNuevo(pendiente(PERSONA, 'Solo mío'));

      const { rows } = await comoPersona(OTRA, 'SELECT * FROM pendiente WHERE id_pendiente = $1', [
        suyo.id.value,
      ]);

      expect(rows).toHaveLength(0);
      expect(await pendientes.porId(new UserId(OTRA), suyo.id)).toBeNull();
    });

    it('ni lo modifica, ni lo borra', async () => {
      const suyo = await pendientes.guardarNuevo(pendiente(PERSONA, 'Solo mío'));

      const modificado = await comoPersona(
        OTRA,
        `UPDATE pendiente SET hecho = true WHERE id_pendiente = $1`,
        [suyo.id.value],
      );
      const borrado = await comoPersona(OTRA, `DELETE FROM pendiente WHERE id_pendiente = $1`, [
        suyo.id.value,
      ]);

      expect(modificado.rowCount).toBe(0);
      expect(borrado.rowCount).toBe(0);
      expect(await pendientes.borrar(new UserId(OTRA), suyo.id)).toBe(false);

      const { rows } = await dueno.query('SELECT hecho FROM pendiente WHERE id_pendiente = $1', [
        suyo.id.value,
      ]);

      expect(rows).toEqual([{ hecho: false }]);
    });

    it('ni lo crea a su nombre', async () => {
      await expect(
        comoPersona(
          OTRA,
          `INSERT INTO pendiente (id_pendiente, id_usuario, texto, nivel, id_operacion_cliente, fecha_edicion)
           VALUES ($1, $2, 'Suplantación', 'urgente', $3, now())`,
          [nuevoId(), PERSONA, nuevoId()],
        ),
      ).rejects.toThrow(/row-level security/);
    });

    it('ni el administrador lo lee', async () => {
      await pendientes.guardarNuevo(pendiente(PERSONA, 'Tampoco para el administrador'));

      const { rows } = await comoPersona(
        OTRA,
        'SELECT * FROM pendiente WHERE id_usuario = $1',
        [PERSONA],
        'administrador',
      );

      expect(rows).toHaveLength(0);
    });

    it('la politica esta forzada, tambien para el dueno de la tabla', async () => {
      const { rows } = await dueno.query<{ forzada: boolean }>(
        `SELECT relforcerowsecurity AS forzada FROM pg_class WHERE relname = 'pendiente'`,
      );

      expect(rows).toEqual([{ forzada: true }]);
    });
  });

  it('un texto vacio no entra ni escribiendo directo en la base', async () => {
    await expect(
      comoPersona(
        PERSONA,
        `INSERT INTO pendiente (id_pendiente, id_usuario, texto, nivel, id_operacion_cliente, fecha_edicion)
         VALUES ($1, $2, '   ', 'urgente', $3, now())`,
        [nuevoId(), PERSONA, nuevoId()],
      ),
    ).rejects.toThrow(/pendiente_texto_no_vacio/);
  });
});
