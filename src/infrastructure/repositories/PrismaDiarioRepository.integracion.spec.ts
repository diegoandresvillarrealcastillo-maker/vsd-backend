import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaDiarioRepository } from './PrismaDiarioRepository.js';

/**
 * El diario contra PostgreSQL de verdad (SCRUM-95).
 *
 * La prueba que define la tarea es la de los 61 minutos: editar una anotacion
 * pasada su hora tiene que fallar **aunque se intente directo contra la base**,
 * con el rol de la aplicacion y saltandose la API entera. Si solo lo impidiera
 * el codigo, cualquiera con acceso a esa conexion podria reescribir el diario
 * de hace un mes.
 *
 * Identificadores propios de esta suite: las de integracion comparten base y
 * corren en paralelo.
 */
const URL_DUENO = process.env['DATABASE_URL'];

const PERSONA = '95959595-0000-4000-8000-0000000000a1';
const OTRA = '95959595-0000-4000-8000-0000000000b2';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

let contador = 0;
function nuevoId(): string {
  contador += 1;

  return '95959595-1111-4111-8111-' + String(contador).padStart(12, '0');
}

function anotacion(
  persona: string,
  texto: string,
  dia = '2026-09-30',
  extra: { id?: string; operacion?: string } = {},
): EntradaDeDiario {
  return EntradaDeDiario.nueva(
    {
      id: new EntradaId(extra.id ?? nuevoId()),
      userId: new UserId(persona),
      clientOperationId: new ClientOperationId(extra.operacion ?? nuevoId()),
      dia,
      documento: DocumentoDelDiario.desdeTextoPlano(texto),
    },
    '2999-12-31',
    new Date(),
  );
}

async function limpiar(dueno: Client): Promise<void> {
  await dueno.query('DELETE FROM entrada_diario WHERE id_usuario = ANY($1)', [[PERSONA, OTRA]]);
  await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [[PERSONA, OTRA]]);
}

async function sembrarPersonas(dueno: Client): Promise<void> {
  for (const [persona, correo] of [
    [PERSONA, 'a@diario-integracion.test'],
    [OTRA, 'b@diario-integracion.test'],
  ]) {
    await dueno.query('BEGIN');
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
    await dueno.query(
      `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, $2, $3, '1.0', now())`,
      [persona, correo, `proveedor-diario-${persona}`],
    );
    await dueno.query('COMMIT');
  }
}

describe.skipIf(URL_DUENO === undefined)('El diario en PostgreSQL', () => {
  let dueno: Client;
  let comoApp: Client;
  let prisma: PrismaService;
  let diario: PrismaDiarioRepository;

  /**
   * Una sentencia con el rol de la aplicacion, declarandose `persona`. Es lo
   * mismo que haria la API, sin la API.
   */
  async function comoPersona(
    persona: string,
    sql: string,
    parametros: unknown[] = [],
  ): Promise<{ rowCount: number; rows: Record<string, unknown>[] }> {
    await comoApp.query('BEGIN');

    try {
      await comoApp.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);
      const resultado = await comoApp.query(sql, parametros);
      await comoApp.query('COMMIT');

      return { rowCount: resultado.rowCount ?? 0, rows: resultado.rows };
    } catch (error) {
      await comoApp.query('ROLLBACK');
      throw error;
    }
  }

  /** Lo que de verdad hay en la fila, leido por el dueno, sin politicas. */
  async function fila(id: string): Promise<Record<string, unknown> | undefined> {
    const { rows } = await dueno.query<Record<string, unknown>>(
      'SELECT * FROM entrada_diario WHERE id_entrada = $1',
      [id],
    );

    return rows[0];
  }

  /** La envejece moviendo su hora de creacion. Solo el dueno puede. */
  async function envejecer(id: string, minutos: number): Promise<void> {
    await dueno.query(
      `UPDATE entrada_diario SET fecha_creacion = now() - make_interval(mins => $2) WHERE id_entrada = $1`,
      [id, minutos],
    );
  }

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);

    comoApp = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
    await comoApp.connect();

    prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
    await prisma.onModuleInit();
    diario = new PrismaDiarioRepository(prisma);
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

  describe('Escribir y leer', () => {
    it('guarda el dia, el documento y los diagramas, y los devuelve igual', async () => {
      const entrada = EntradaDeDiario.nueva(
        {
          id: new EntradaId(nuevoId()),
          userId: new UserId(PERSONA),
          clientOperationId: new ClientOperationId(nuevoId()),
          dia: '2026-09-28',
          titulo: 'Domingo',
          documento: DocumentoDelDiario.desde({
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Cocine', marks: [{ type: 'bold' }] }],
              },
            ],
          }),
          adjuntos: [
            { id: nuevoId(), tipo: 'diagrama', datos: { elements: [{ type: 'rectangle' }] } },
          ],
        },
        '2999-12-31',
        new Date(),
      );

      const guardada = await diario.guardarNueva(entrada);
      const [leida] = await diario.entreDias(new UserId(PERSONA), '2026-09-28', '2026-09-28');

      for (const una of [guardada, leida]) {
        expect(una?.dia).toBe('2026-09-28');
        expect(una?.titulo).toBe('Domingo');
        expect(una?.documento.raiz).toEqual(entrada.documento.raiz);
        expect(una?.adjuntos).toEqual(entrada.adjuntos);
        expect(una?.version).toBe(1);
      }

      // Se guarda como documento, no como HTML.
      expect((await fila(entrada.id.value))?.['formato']).toBe('enriquecido');
    });

    it('el rango va por el dia de la anotacion, no por cuando se escribio', async () => {
      await diario.guardarNueva(anotacion(PERSONA, 'Del lunes', '2026-09-28'));
      await diario.guardarNueva(anotacion(PERSONA, 'Del martes', '2026-09-29'));

      const delLunes = await diario.entreDias(new UserId(PERSONA), '2026-09-28', '2026-09-28');

      expect(delLunes.map((una) => una.documento.textoPlano())).toEqual(['Del lunes']);
    });

    it('la misma operacion dos veces a la vez deja una sola anotacion', async () => {
      const operacion = nuevoId();

      const [una, otra] = await Promise.all([
        diario.guardarNueva(anotacion(PERSONA, 'Primera', '2026-09-30', { operacion })),
        diario.guardarNueva(anotacion(PERSONA, 'Segunda', '2026-09-30', { operacion })),
      ]);

      expect(una.id.equals(otra.id)).toBe(true);

      const { rows } = await dueno.query(
        'SELECT count(*)::int AS n FROM entrada_diario WHERE id_usuario = $1',
        [PERSONA],
      );

      expect(rows[0]).toEqual({ n: 1 });
    });
  });

  describe('La hora de creacion la pone la base', () => {
    it('aunque quien inserta mande otra, se guarda la de la base', async () => {
      const id = nuevoId();

      await comoPersona(
        PERSONA,
        `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente, fecha_creacion, fecha_edicion)
         VALUES ($1, $2, 'Intento con fecha futura', $3, '2999-01-01', now())`,
        [id, PERSONA, nuevoId()],
      );

      const creada = (await fila(id))?.['fecha_creacion'] as Date;

      // Si valiera la del cliente, la hora para editar no acabaria nunca.
      expect(Math.abs(creada.getTime() - Date.now())).toBeLessThan(60_000);
    });

    it('y no se puede cambiar despues, ni dentro de la hora', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Recien escrita'));

      await expect(
        comoPersona(
          PERSONA,
          `UPDATE entrada_diario SET fecha_creacion = '2999-01-01' WHERE id_entrada = $1`,
          [guardada.id.value],
        ),
      ).rejects.toThrow(/permission denied/);
    });

    it('ni el dia, ni de quien es', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Del dia que es'));

      for (const columna of ['dia', 'id_usuario', 'id_operacion_cliente']) {
        await expect(
          comoPersona(
            PERSONA,
            `UPDATE entrada_diario SET ${columna} = ${columna} WHERE id_entrada = $1`,
            [guardada.id.value],
          ),
        ).rejects.toThrow(/permission denied/);
      }
    });
  });

  describe('La hora para editar', () => {
    it('dentro de la hora, la edicion se guarda y sube la version', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Primera version'));
      const editada = guardada.editar(
        { documento: DocumentoDelDiario.desdeTextoPlano('Segunda version') },
        1,
        new Date(),
      );

      const resultado = await diario.guardarEdicion(editada, 1);

      expect(resultado?.version).toBe(2);
      expect(resultado?.documento.textoPlano()).toBe('Segunda version');
      expect(resultado?.creadaEn).toEqual(guardada.creadaEn);
    });

    it('a los 61 minutos, un UPDATE directo con el rol de la aplicacion no toca nada', async () => {
      // La prueba que define la tarea.
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Lo que escribi'));
      await envejecer(guardada.id.value, 61);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET contenido = 'Reescrito', version = version + 1 WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(0);
      expect(await fila(guardada.id.value)).toMatchObject({
        contenido: guardada.documento.serializado(),
        version: 1,
      });
    });

    it('a los 59 minutos todavia se puede', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Casi en el limite'));
      await envejecer(guardada.id.value, 59);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'Corregido' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(1);
    });

    it('por el repositorio, fuera de la hora no se guarda y devuelve null', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Lo de la manana'));
      await envejecer(guardada.id.value, 61);

      // El dominio no se entera de que paso la hora porque se le da un reloj
      // de dentro del plazo: es la base la que tiene que pararlo.
      const editada = guardada.editar(
        { documento: DocumentoDelDiario.desdeTextoPlano('Cambiado') },
        1,
        guardada.creadaEn,
      );

      expect(await diario.guardarEdicion(editada, 1)).toBeNull();
      expect((await fila(guardada.id.value))?.['version']).toBe(1);
    });

    it('con una version vieja tampoco: no se pisa otra edicion', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Original'));
      const primera = guardada.editar(
        { documento: DocumentoDelDiario.desdeTextoPlano('Desde el celular') },
        1,
        new Date(),
      );
      await diario.guardarEdicion(primera, 1);

      const segunda = guardada.editar(
        { documento: DocumentoDelDiario.desdeTextoPlano('Desde el computador') },
        1,
        new Date(),
      );

      expect(await diario.guardarEdicion(segunda, 1)).toBeNull();
      expect((await diario.porId(guardada.userId, guardada.id))?.documento.textoPlano()).toBe(
        'Desde el celular',
      );
    });
  });

  describe('Nadie mas', () => {
    it('otra persona no la lee ni sabiendo su identificador', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Solo mia'));

      const { rows } = await comoPersona(
        OTRA,
        'SELECT * FROM entrada_diario WHERE id_entrada = $1',
        [guardada.id.value],
      );

      expect(rows).toHaveLength(0);
      expect(await diario.porId(new UserId(OTRA), guardada.id)).toBeNull();
    });

    it('ni la edita, ni dentro de la hora', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Solo mia'));

      const { rowCount } = await comoPersona(
        OTRA,
        `UPDATE entrada_diario SET titulo = 'Ajeno' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(0);
    });

    it('ni escribe a su nombre', async () => {
      await expect(
        comoPersona(
          OTRA,
          `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente)
           VALUES ($1, $2, 'Suplantacion', $3)`,
          [nuevoId(), PERSONA, nuevoId()],
        ),
      ).rejects.toThrow(/row-level security/);
    });

    it('ni el administrador la lee', async () => {
      await diario.guardarNueva(anotacion(PERSONA, 'Tampoco para el administrador'));

      await comoApp.query('BEGIN');
      await comoApp.query("SELECT set_config('vsd.rol_actual', 'administrador', true)");
      const { rows } = await comoApp.query('SELECT * FROM entrada_diario WHERE id_usuario = $1', [
        PERSONA,
      ]);
      await comoApp.query('COMMIT');

      expect(rows).toHaveLength(0);
    });
  });
});
