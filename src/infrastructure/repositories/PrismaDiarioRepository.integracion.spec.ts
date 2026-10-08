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
 * Desde SCRUM-144 la hora de una anotacion es la que dice el dispositivo (escrita
 * sin conexion a las 9:00 y recibida a las 14:00 sigue siendo de las 9:00) y la
 * base ya no la impone sino que la **acota**: nunca en el futuro y nunca de hace
 * mas de 30 dias. Ver el ADR 0020 y la migracion
 * 20261014120000_hora_del_dispositivo_en_el_diario.
 *
 * Identificadores propios de esta suite: las de integracion comparten base y
 * corren en paralelo.
 */
const URL_DUENO = process.env['DATABASE_URL'];

const MINUTO = 60_000;
const HORA = 60 * MINUTO;
const DIA_EN_MS = 24 * HORA;

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
  extra: { id?: string; operacion?: string; escritaEn?: Date } = {},
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
    extra.escritaEn ?? new Date(),
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

  /**
   * Deja las dos horas de la anotacion como se pidan, en minutos hacia atras desde
   * ahora: la de su creacion y la de su ultima edicion. Solo el dueno puede.
   *
   * El disparador de la edicion acotaria la hora de edicion que se le pone aqui
   * (nunca antes de la que ya tiene), asi que se apaga **dentro de la transaccion**:
   * ni otras conexiones lo ven apagado ni queda asi si algo falla.
   */
  async function fijarHoras(id: string, horas: { creada: number; editada: number }): Promise<void> {
    await dueno.query('BEGIN');

    try {
      await dueno.query(
        'ALTER TABLE entrada_diario DISABLE TRIGGER entrada_diario_hora_de_edicion',
      );
      await dueno.query(
        `UPDATE entrada_diario
            SET fecha_creacion = now() - make_interval(mins => $2),
                fecha_edicion  = now() - make_interval(mins => $3)
          WHERE id_entrada = $1`,
        [id, horas.creada, horas.editada],
      );
      await dueno.query('ALTER TABLE entrada_diario ENABLE TRIGGER entrada_diario_hora_de_edicion');
      await dueno.query('COMMIT');
    } catch (error) {
      await dueno.query('ROLLBACK');
      throw error;
    }

    // Si el disparador no hubiera dejado las horas donde se pidieron, todas las
    // pruebas que dependen de una anotacion antigua pasarian por el motivo equivocado.
    const datos = await fila(id);

    expect(Date.now() - (datos?.['fecha_creacion'] as Date).getTime()).toBeGreaterThan(
      (horas.creada - 1) * MINUTO,
    );
    expect(Date.now() - (datos?.['fecha_edicion'] as Date).getTime()).toBeGreaterThan(
      (horas.editada - 1) * MINUTO,
    );
  }

  /** Una anotacion que se escribio, y se edito por ultima vez, hace `minutos`. */
  async function envejecerTodo(id: string, minutos: number): Promise<void> {
    await fijarHoras(id, { creada: minutos, editada: minutos });
  }

  /** La envejece moviendo solo su hora de creacion. Solo el dueno puede. */
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

  describe('La hora de creacion la manda quien escribe, y la base la acota', () => {
    it('una escrita sin conexion hace unas horas se guarda con esa hora, no con la de la recepcion', async () => {
      const nueve = new Date(Date.now() - 5 * HORA);
      const guardada = await diario.guardarNueva(
        anotacion(PERSONA, 'Escrita sin conexion', '2026-09-30', { escritaEn: nueve }),
      );

      expect(guardada.creadaEn).toEqual(nueve);
      expect(guardada.editadaEn).toEqual(nueve);
      expect((await fila(guardada.id.value))?.['fecha_creacion']).toEqual(nueve);
    });

    it('con SQL directo, una hora adelantada mas de 5 minutos se acota a ahora mas 5 minutos', async () => {
      const id = nuevoId();

      await comoPersona(
        PERSONA,
        `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente, fecha_creacion, fecha_edicion)
         VALUES ($1, $2, 'Intento con fecha futura', $3, '2999-01-01', now())`,
        [id, PERSONA, nuevoId()],
      );

      const creada = (await fila(id))?.['fecha_creacion'] as Date;

      // Si valiera la del cliente, la hora para editar no acabaria nunca.
      expect(creada.getTime() - Date.now()).toBeLessThanOrEqual(5 * MINUTO + 1000);
      expect(creada.getTime() - Date.now()).toBeGreaterThan(5 * MINUTO - 60_000);
    });

    it('una de hace mas de 30 dias se acota a hace 30 dias', async () => {
      const id = nuevoId();

      await comoPersona(
        PERSONA,
        `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente, fecha_creacion, fecha_edicion)
         VALUES ($1, $2, 'Intento con fecha antigua', $3, '2000-01-01', now())`,
        [id, PERSONA, nuevoId()],
      );

      const creada = (await fila(id))?.['fecha_creacion'] as Date;

      expect(Date.now() - creada.getTime()).toBeLessThanOrEqual(30 * DIA_EN_MS + 60_000);
      expect(Date.now() - creada.getTime()).toBeGreaterThan(30 * DIA_EN_MS - 60_000);
    });

    it('sin mandarla, es la de la base', async () => {
      const id = nuevoId();

      await comoPersona(
        PERSONA,
        `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente, fecha_edicion)
         VALUES ($1, $2, 'Sin fecha', $3, now())`,
        [id, PERSONA, nuevoId()],
      );

      const creada = (await fila(id))?.['fecha_creacion'] as Date;

      expect(Math.abs(creada.getTime() - Date.now())).toBeLessThan(60_000);
    });

    it('la hora de la ultima edicion de una recien escrita es su hora de creacion, venga lo que venga', async () => {
      const id = nuevoId();

      await comoPersona(
        PERSONA,
        `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente, fecha_creacion, fecha_edicion)
         VALUES ($1, $2, 'Dos horas distintas', $3, now() - interval '3 hours', now())`,
        [id, PERSONA, nuevoId()],
      );

      const datos = await fila(id);

      expect(datos?.['fecha_edicion']).toEqual(datos?.['fecha_creacion']);
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

    it('un UPDATE directo que no toca la hora de edicion se mide con la hora de la base, aunque la anotacion sea vieja', async () => {
      // Sin esto, dejar `fecha_edicion` como estaba bastaria para editar siempre
      // "en el momento en que se escribio".
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Escrita hace tiempo'));
      await envejecerTodo(guardada.id.value, 3 * 24 * 60);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET contenido = 'Reescrito', version = version + 1 WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(0);
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

  describe('Corregir sin conexion (SCRUM-144)', () => {
    it('escrita a las 9:00 y corregida a las 9:30, aunque llegue 5 horas despues, se aplica como correccion', async () => {
      const nueve = new Date(Date.now() - 5 * HORA);
      const nueveYMedia = new Date(nueve.getTime() + 30 * MINUTO);
      const guardada = await diario.guardarNueva(
        anotacion(PERSONA, 'Primera version', '2026-09-30', { escritaEn: nueve }),
      );
      const editada = guardada.editar(
        { documento: DocumentoDelDiario.desdeTextoPlano('Corregida a las 9:30') },
        1,
        nueveYMedia,
      );

      const resultado = await diario.guardarEdicion(editada, 1);

      expect(resultado?.version).toBe(2);
      expect(resultado?.documento.textoPlano()).toBe('Corregida a las 9:30');
      expect(resultado?.creadaEn).toEqual(nueve);
      expect(resultado?.editadaEn).toEqual(nueveYMedia);
    });

    it('una hora de edicion fuera de la hora no se aplica aunque llegue ahora', async () => {
      const nueve = new Date(Date.now() - 5 * HORA);
      const guardada = await diario.guardarNueva(
        anotacion(PERSONA, 'Escrita a las 9:00', '2026-09-30', { escritaEn: nueve }),
      );

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET contenido = 'Tarde', version = version + 1, fecha_edicion = $2 WHERE id_entrada = $1`,
        [guardada.id.value, new Date(nueve.getTime() + 70 * MINUTO)],
      );

      expect(rowCount).toBe(0);
      expect((await fila(guardada.id.value))?.['version']).toBe(1);
    });

    it('justo en el limite de la hora no, y un minuto antes si', async () => {
      const nueve = new Date(Date.now() - 5 * HORA);
      const guardada = await diario.guardarNueva(
        anotacion(PERSONA, 'En el limite', '2026-09-30', { escritaEn: nueve }),
      );
      const corregir = (cuando: Date) =>
        comoPersona(
          PERSONA,
          `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = $2 WHERE id_entrada = $1`,
          [guardada.id.value, cuando],
        );

      // `EntradaDeDiario.sePuedeEditar` dice "antes de la hora", no "hasta ella".
      expect((await corregir(new Date(nueve.getTime() + HORA))).rowCount).toBe(0);
      expect((await corregir(new Date(nueve.getTime() + 59 * MINUTO))).rowCount).toBe(1);
    });

    it('una hora de edicion en el futuro no alarga la hora: se acota a ahora mas 5 minutos', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Escrita hace dos horas'));
      await envejecerTodo(guardada.id.value, 120);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = now() + interval '3 hours' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(0);
    });

    it('un reloj adelantado unos minutos se acota a ahora, no se rechaza', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Escrita hace media hora'));
      await envejecerTodo(guardada.id.value, 30);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = now() + interval '3 minutes' WHERE id_entrada = $1`,
        [guardada.id.value],
      );
      const editada = (await fila(guardada.id.value))?.['fecha_edicion'] as Date;

      expect(rowCount).toBe(1);
      expect(editada.getTime() - Date.now()).toBeLessThanOrEqual(5 * MINUTO + 1000);
    });

    it('una hora de edicion muy en el futuro no pasa de ahora mas 5 minutos, y la correccion se aplica', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Escrita hace media hora'));
      await envejecerTodo(guardada.id.value, 30);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = now() + interval '3 hours' WHERE id_entrada = $1`,
        [guardada.id.value],
      );
      const editada = (await fila(guardada.id.value))?.['fecha_edicion'] as Date;

      // Se acota en lugar de dar por perdida una correccion que de verdad se hizo
      // dentro de la hora.
      expect(rowCount).toBe(1);
      expect(editada.getTime() - Date.now()).toBeLessThanOrEqual(5 * MINUTO + 1000);
      expect(editada.getTime() - Date.now()).toBeGreaterThan(5 * MINUTO - 60_000);
    });

    it('en una de hace mas de 30 dias, aunque sea de hace 31, no se puede', async () => {
      const guardada = await diario.guardarNueva(
        anotacion(PERSONA, 'Escrita hace 30 dias y medio'),
      );
      await envejecerTodo(guardada.id.value, 30 * 24 * 60 + 12 * 60);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = now() - interval '30 days' - interval '12 hours' + interval '10 minutes' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(0);
    });

    it('en una de hace mas de 30 dias no se puede, diga la hora que diga', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Escrita hace 40 dias'));
      await envejecerTodo(guardada.id.value, 40 * 24 * 60);

      const { rowCount } = await comoPersona(
        PERSONA,
        // Una hora de edicion que, tomada al pie de la letra, caeria dentro de la hora.
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = now() - interval '40 days' + interval '10 minutes' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(0);
    });

    it('el limite del modo sin conexion: dentro de 30 dias, una hora declarada dentro de la hora se acepta', async () => {
      // Es el costo de poder corregir sin conexion y esta escrito en el ADR 0020:
      // nadie puede demostrar a que hora corrigio algo. Lo que se acota es cuanto.
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Escrita hace 10 dias'));
      await envejecerTodo(guardada.id.value, 10 * 24 * 60);

      const { rowCount } = await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = now() - interval '10 days' + interval '10 minutes' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      expect(rowCount).toBe(1);
    });

    it('la hora de la edicion nunca queda antes de haberse escrito', async () => {
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'Recien escrita'));

      await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = fecha_creacion - interval '1 hour' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      const datos = await fila(guardada.id.value);

      expect(datos?.['fecha_edicion']).toEqual(datos?.['fecha_creacion']);
    });

    it('ni antes de haberse escrito, aunque la ultima edicion que quedo guardada sea anterior', async () => {
      // Pasa con filas de antes de esta migracion: su hora de edicion la puso el reloj
      // de la API, que puede ir unos segundos por detras del de la base.
      const guardada = await diario.guardarNueva(anotacion(PERSONA, 'De antes de la migracion'));
      await fijarHoras(guardada.id.value, { creada: 30, editada: 40 });

      await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'T', fecha_edicion = now() - interval '50 minutes' WHERE id_entrada = $1`,
        [guardada.id.value],
      );

      const datos = await fila(guardada.id.value);

      expect((datos?.['fecha_edicion'] as Date).getTime()).toBeGreaterThanOrEqual(
        (datos?.['fecha_creacion'] as Date).getTime(),
      );
    });

    it('ni antes de la ultima edicion: dos dispositivos con el reloj distinto no van hacia atras', async () => {
      const escrita = new Date(Date.now() - 2 * HORA);
      const guardada = await diario.guardarNueva(
        anotacion(PERSONA, 'Dos dispositivos', '2026-09-30', { escritaEn: escrita }),
      );
      const treinta = new Date(escrita.getTime() + 30 * MINUTO);
      const diez = new Date(escrita.getTime() + 10 * MINUTO);

      await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'A', version = 2, fecha_edicion = $2 WHERE id_entrada = $1`,
        [guardada.id.value, treinta],
      );
      await comoPersona(
        PERSONA,
        `UPDATE entrada_diario SET titulo = 'B', version = 3, fecha_edicion = $2 WHERE id_entrada = $1`,
        [guardada.id.value, diez],
      );

      expect((await fila(guardada.id.value))?.['fecha_edicion']).toEqual(treinta);
    });

    it('por el repositorio, una hora de edicion fuera de la hora devuelve null y no toca nada', async () => {
      const nueve = new Date(Date.now() - 5 * HORA);
      const guardada = await diario.guardarNueva(
        anotacion(PERSONA, 'Escrita a las 9:00', '2026-09-30', { escritaEn: nueve }),
      );
      // El dominio admite la edicion porque se le da una hora de dentro del plazo;
      // la que llega a la base es la de despues.
      const editada = EntradaDeDiario.guardada({
        id: guardada.id,
        userId: guardada.userId,
        clientOperationId: guardada.clientOperationId,
        dia: guardada.dia,
        documento: DocumentoDelDiario.desdeTextoPlano('Tarde'),
        version: 2,
        creadaEn: guardada.creadaEn,
        editadaEn: new Date(nueve.getTime() + 2 * HORA),
      });

      expect(await diario.guardarEdicion(editada, 1)).toBeNull();
      expect((await fila(guardada.id.value))?.['version']).toBe(1);
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
