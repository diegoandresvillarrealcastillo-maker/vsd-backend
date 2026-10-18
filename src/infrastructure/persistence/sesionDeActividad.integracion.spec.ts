// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MOTORES } from '../../domain/model/Motor.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';

/**
 * El modelo «mecanica x sesion» comprobado contra PostgreSQL de verdad (SCRUM-204, ADR 0030).
 *
 * Lo que el ADR llama garantia tiene que serlo en la base y no solo en el codigo: el codigo puede
 * fallar, o alguien puede escribir contenido directo con SQL (que es como se agrega contenido).
 * Por eso estas pruebas **se saltan el dominio** y le piden a la base cosas que no debe aceptar.
 *
 * Todo lo de esta suite lleva el prefijo `20400000` para que las demas suites, que comparten la
 * base y corren en paralelo, no se crucen con estas filas.
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

function id(n: number): string {
  return `20400000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;
}

const CATEGORIA = id(1);
const ACTIVIDAD = id(2);
const OTRA_ACTIVIDAD = id(3);
const USUARIO = id(4);
const BORRADOR = id(0x10);
const PUBLICADA = id(0x11);
const REVISADA = id(0x12);
const NUEVA = id(0x13);
const DEL_RESULTADO = id(0x14);
const RESULTADO = id(0x20);
const OPERACION = id(0x21);

/** Las nueve que ya existian. */
const ACTUALES = [
  'Parejas de cartas',
  'Secuencia de números',
  'Encuentra la diferencia',
  'Cómo dormiste anoche',
  'La carga de tu semana',
  'Movimiento del día',
  'Cómo te sientes hoy',
  'Qué te está pesando',
  'Un momento bueno del día',
];

/** Las que pasan al modelo en la Fase 0 (SCRUM-207): las otras cuatro son pantallas propias, sin motor. */
const DE_LA_FASE_0 = [
  'Secuencia de números',
  'Encuentra la diferencia',
  'La carga de tu semana',
  'Cómo te sientes hoy',
  'Un momento bueno del día',
];

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

describe.skipIf(URL_DUENO === undefined)('Mecanica x sesion en PostgreSQL (ADR 0030)', () => {
  let dueno: Client;
  let aplicacion: Client;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);

    aplicacion = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
    await aplicacion.connect();

    await limpiar();
    await sembrar();
  });

  afterAll(async () => {
    await limpiar();
    await aplicacion?.end();
    await dueno?.end();
  });

  // Cada prueba arranca con las sesiones de la suite en su estado inicial.
  beforeEach(async () => {
    await dueno.query('DELETE FROM resultado WHERE id_resultado = $1', [RESULTADO]);
    await dueno.query('DELETE FROM sesion_de_actividad WHERE id_actividad = ANY($1)', [
      [ACTIVIDAD, OTRA_ACTIVIDAD],
    ]);
    await dueno.query(
      'UPDATE actividad SET motor = NULL, frecuencia = $2 WHERE id_actividad = $1',
      [ACTIVIDAD, 'diaria'],
    );
  });

  async function limpiar(): Promise<void> {
    await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, false)", [USUARIO]);
    await dueno.query('DELETE FROM resultado WHERE id_usuario = $1', [USUARIO]);
    await dueno.query('DELETE FROM sesion_de_actividad WHERE id_actividad = ANY($1)', [
      [ACTIVIDAD, OTRA_ACTIVIDAD],
    ]);
    await dueno.query('DELETE FROM usuario WHERE id_usuario = $1', [USUARIO]);
    await dueno.query('DELETE FROM actividad WHERE id_actividad = ANY($1)', [
      [ACTIVIDAD, OTRA_ACTIVIDAD],
    ]);
    await dueno.query('DELETE FROM categoria WHERE id_categoria = $1', [CATEGORIA]);
  }

  async function sembrar(): Promise<void> {
    await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, false)", [USUARIO]);

    await dueno.query(
      `INSERT INTO categoria (id_categoria, nombre) VALUES ($1, 'Pruebas de sesiones')`,
      [CATEGORIA],
    );
    for (const [actividad, nombre] of [
      [ACTIVIDAD, 'Mecanica de prueba'],
      [OTRA_ACTIVIDAD, 'Otra mecanica de prueba'],
    ]) {
      await dueno.query(
        `INSERT INTO actividad (id_actividad, id_categoria, nombre, tipo, direccion_escala)
         VALUES ($1, $2, $3, 'juego', 'sin_puntaje')`,
        [actividad, CATEGORIA, nombre],
      );
    }
    await dueno.query(
      `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, 'sesiones@ejemplo.test', 'proveedor-de-prueba-sesiones', '1.0', now())`,
      [USUARIO],
    );
  }

  /** Inserta una sesion; lo que no se indique es un borrador que no pide revision. */
  async function sesion(
    cambios: Partial<{
      id: string;
      actividad: string;
      titulo: string;
      nivel: number;
      parametros: string;
      publicado: boolean;
      revision: string;
      revisadaPor: string | null;
      revisadaEl: string | null;
    }> = {},
  ): Promise<void> {
    const c = {
      id: BORRADOR,
      actividad: ACTIVIDAD,
      titulo: 'Cuatro colores',
      nivel: 1,
      parametros: '{"largo":4}',
      publicado: false,
      revision: 'no_requiere',
      revisadaPor: null,
      revisadaEl: null,
      ...cambios,
    };

    await dueno.query(
      `INSERT INTO sesion_de_actividad
         (id_sesion, id_actividad, titulo, nivel, parametros, publicado, revision, revisada_por, revisada_el)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)`,
      [
        c.id,
        c.actividad,
        c.titulo,
        c.nivel,
        c.parametros,
        c.publicado,
        c.revision,
        c.revisadaPor,
        c.revisadaEl,
      ],
    );
  }

  const REVISION = {
    revision: 'revisada',
    revisadaPor: 'Psicología',
    revisadaEl: '2026-10-20T15:00:00Z',
  };

  describe('actividad.motor y la frecuencia rotativa', () => {
    it.each(MOTORES)('acepta el motor %s', async (motor) => {
      await dueno.query('UPDATE actividad SET motor = $2 WHERE id_actividad = $1', [
        ACTIVIDAD,
        motor,
      ]);

      const { rows } = await dueno.query<{ motor: string }>(
        'SELECT motor FROM actividad WHERE id_actividad = $1',
        [ACTIVIDAD],
      );

      expect(rows[0]?.motor).toBe(motor);
    });

    it.each(['memoria', 'Secuencia', ' secuencia', ''])('rechaza el motor «%s»', async (motor) => {
      await expect(
        dueno.query('UPDATE actividad SET motor = $2 WHERE id_actividad = $1', [ACTIVIDAD, motor]),
      ).rejects.toThrow(/actividad_motor_valido/);
    });

    it('el motor es opcional: una actividad sin motor es valida', async () => {
      const { rows } = await dueno.query<{ motor: string | null }>(
        'SELECT motor FROM actividad WHERE id_actividad = $1',
        [ACTIVIDAD],
      );

      expect(rows[0]?.motor).toBeNull();
    });

    it('de las nueve que ya existian, solo las cinco de la Fase 0 tienen motor', async () => {
      // La migracion del modelo es aditiva y no puso motor a nadie. Lo pone la migracion de datos de la
      // Fase 0 (SCRUM-207), y solo en las cinco que ya tienen un motor compartido; el detalle esta en
      // SesionesSembradas.integracion.spec.ts.
      const { rows } = await dueno.query<{ nombre: string; motor: string | null }>(
        'SELECT nombre, motor FROM actividad WHERE nombre = ANY($1)',
        [ACTUALES],
      );

      expect(rows.map((fila) => fila.nombre).sort()).toEqual([...ACTUALES].sort());
      expect(
        rows
          .filter((fila) => fila.motor !== null)
          .map((fila) => fila.nombre)
          .sort(),
      ).toEqual([...DE_LA_FASE_0].sort());
    });

    it('acepta la frecuencia rotativa y deja las anteriores como estaban', async () => {
      await dueno.query("UPDATE actividad SET frecuencia = 'rotativa' WHERE id_actividad = $1", [
        ACTIVIDAD,
      ]);

      const { rows } = await dueno.query<{ valores: string[] }>(
        `SELECT array_agg(e.enumlabel::text ORDER BY e.enumsortorder) AS valores
         FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
         WHERE t.typname = 'frecuencia_actividad'`,
      );

      expect(rows[0]?.valores).toEqual(['diaria', 'semanal', 'unica', 'rotativa']);
    });
  });

  describe('actividad.franja (SCRUM-221)', () => {
    it.each(['manana', 'tarde', 'noche'])('acepta la franja %s', async (franja) => {
      await dueno.query('UPDATE actividad SET franja = $2 WHERE id_actividad = $1', [
        ACTIVIDAD,
        franja,
      ]);

      const { rows } = await dueno.query<{ franja: string }>(
        'SELECT franja FROM actividad WHERE id_actividad = $1',
        [ACTIVIDAD],
      );

      expect(rows[0]?.franja).toBe(franja);
    });

    it.each(['madrugada', 'Noche', ' noche', 'mañana', ''])(
      'rechaza la franja «%s»',
      async (franja) => {
        await expect(
          dueno.query('UPDATE actividad SET franja = $2 WHERE id_actividad = $1', [
            ACTIVIDAD,
            franja,
          ]),
        ).rejects.toThrow(/actividad_franja_valida/);
      },
    );

    it('la franja es opcional y ninguna de las nueve de siempre la tiene', async () => {
      const { rows } = await dueno.query<{ nombre: string; franja: string | null }>(
        'SELECT nombre, franja FROM actividad WHERE nombre = ANY($1)',
        [ACTUALES],
      );

      expect(rows).toHaveLength(ACTUALES.length);
      expect(rows.map((fila) => fila.franja)).toEqual(rows.map(() => null));
    });
  });

  describe('lo que no esta revisado no se publica', () => {
    it('rechaza publicar una sesion con revision pendiente', async () => {
      await expect(sesion({ publicado: true, revision: 'pendiente' })).rejects.toThrow(
        /sesion_de_actividad_publicada_revisada/,
      );
    });

    it('un borrador pendiente es valido', async () => {
      await expect(sesion({ publicado: false, revision: 'pendiente' })).resolves.toBeUndefined();
    });

    it('deja publicar lo que no requiere revision', async () => {
      await expect(sesion({ publicado: true, revision: 'no_requiere' })).resolves.toBeUndefined();
    });

    it('deja publicar lo revisado', async () => {
      await expect(sesion({ publicado: true, ...REVISION })).resolves.toBeUndefined();
    });

    it('no se puede publicar una pendiente con un UPDATE tampoco', async () => {
      await sesion({ publicado: false, revision: 'pendiente' });

      await expect(
        dueno.query('UPDATE sesion_de_actividad SET publicado = true WHERE id_sesion = $1', [
          BORRADOR,
        ]),
      ).rejects.toThrow(/sesion_de_actividad_publicada_revisada/);
    });

    it('rechaza una revision que no existe', async () => {
      await expect(sesion({ revision: 'aprobada' })).rejects.toThrow(
        /sesion_de_actividad_revision_valida/,
      );
    });
  });

  describe('la constancia de la revision', () => {
    it('una revisada sin decir quien la reviso, se rechaza', async () => {
      await expect(sesion({ ...REVISION, revisadaPor: null })).rejects.toThrow(
        /sesion_de_actividad_constancia_coherente/,
      );
    });

    it('una revisada sin decir cuando, se rechaza', async () => {
      await expect(sesion({ ...REVISION, revisadaEl: null })).rejects.toThrow(
        /sesion_de_actividad_constancia_coherente/,
      );
    });

    it.each(['no_requiere', 'pendiente'])(
      'una %s no puede traer constancia de una revision que no hubo',
      async (revision) => {
        await expect(
          sesion({ revision, revisadaPor: 'Psicología', revisadaEl: '2026-10-20T15:00:00Z' }),
        ).rejects.toThrow(/sesion_de_actividad_constancia_coherente/);
      },
    );
  });

  describe('la forma de una sesion', () => {
    it.each([1, 2, 3])('acepta el nivel %i', async (nivel) => {
      await expect(sesion({ nivel })).resolves.toBeUndefined();
    });

    it.each([0, 4, -1])('rechaza el nivel %i', async (nivel) => {
      await expect(sesion({ nivel })).rejects.toThrow(/sesion_de_actividad_nivel_valido/);
    });

    it.each(['', '   '])('rechaza el titulo «%s»', async (titulo) => {
      await expect(sesion({ titulo })).rejects.toThrow(/sesion_de_actividad_titulo_no_vacio/);
    });

    it('rechaza un titulo de mas de 100 caracteres', async () => {
      await expect(sesion({ titulo: 'a'.repeat(101) })).rejects.toThrow(/value too long/);
    });

    it('acepta parametros anidados y un objeto vacio', async () => {
      await expect(
        sesion({ parametros: '{"pasos":[{"texto":"Inhala","segundos":4}],"conSonido":false}' }),
      ).resolves.toBeUndefined();
      await expect(sesion({ id: PUBLICADA, parametros: '{}' })).resolves.toBeUndefined();
    });

    it.each(['[]', '"largo: 4"', '4', 'null'])(
      'rechaza parametros que no son un objeto: %s',
      async (parametros) => {
        await expect(sesion({ parametros })).rejects.toThrow(
          /sesion_de_actividad_parametros_objeto/,
        );
      },
    );

    it('los parametros no pueden faltar', async () => {
      await expect(
        dueno.query(
          `INSERT INTO sesion_de_actividad (id_sesion, id_actividad, titulo, nivel, revision)
           VALUES ($1, $2, 'Sin parametros', 1, 'no_requiere')`,
          [BORRADOR, ACTIVIDAD],
        ),
      ).rejects.toThrow(/parametros/);
    });
  });

  describe('las claves foraneas', () => {
    it('una sesion tiene que ser de una actividad que existe', async () => {
      await expect(sesion({ actividad: id(0x99) })).rejects.toThrow(
        /sesion_de_actividad_id_actividad_fkey/,
      );
    });

    it('no se borra una actividad que tiene sesiones', async () => {
      await sesion();

      await expect(
        dueno.query('DELETE FROM actividad WHERE id_actividad = $1', [ACTIVIDAD]),
      ).rejects.toThrow(/sesion_de_actividad_id_actividad_fkey/);
    });

    it('un resultado puede quedar sin sesion: asi son todos los de hoy', async () => {
      await insertarResultado(null);

      const { rows } = await dueno.query<{ id_sesion: string | null }>(
        'SELECT id_sesion FROM resultado WHERE id_resultado = $1',
        [RESULTADO],
      );

      expect(rows[0]?.id_sesion).toBeNull();
    });

    it('un resultado guarda la sesion que se hizo', async () => {
      await sesion({ id: DEL_RESULTADO, publicado: true });
      await insertarResultado(DEL_RESULTADO);

      const { rows } = await dueno.query<{ id_sesion: string }>(
        'SELECT id_sesion FROM resultado WHERE id_resultado = $1',
        [RESULTADO],
      );

      expect(rows[0]?.id_sesion).toBe(DEL_RESULTADO);
    });

    it('un resultado no apunta a una sesion que no existe', async () => {
      await expect(insertarResultado(id(0x98))).rejects.toThrow(/resultado_id_sesion_fkey/);
    });

    it('no se borra una sesion que alguien ya hizo: el historial apunta a ella', async () => {
      await sesion({ id: DEL_RESULTADO, publicado: true });
      await insertarResultado(DEL_RESULTADO);

      await expect(
        dueno.query('DELETE FROM sesion_de_actividad WHERE id_sesion = $1', [DEL_RESULTADO]),
      ).rejects.toThrow(/resultado_id_sesion_fkey/);
    });

    it('retirar una sesion que alguien ya hizo si se puede: queda sin publicar', async () => {
      await sesion({ id: DEL_RESULTADO, publicado: true });
      await insertarResultado(DEL_RESULTADO);

      await dueno.query('UPDATE sesion_de_actividad SET publicado = false WHERE id_sesion = $1', [
        DEL_RESULTADO,
      ]);

      const { rows } = await dueno.query<{ publicado: boolean }>(
        'SELECT publicado FROM sesion_de_actividad WHERE id_sesion = $1',
        [DEL_RESULTADO],
      );

      expect(rows[0]?.publicado).toBe(false);
    });

    async function insertarResultado(idSesion: string | null): Promise<void> {
      await dueno.query(
        `INSERT INTO resultado (id_resultado, id_usuario, id_actividad, id_operacion_cliente, id_sesion, fecha)
         VALUES ($1, $2, $3, $4, $5, now())`,
        [RESULTADO, USUARIO, ACTIVIDAD, OPERACION, idSesion],
      );
    }
  });

  describe('una sesion revisada no se edita', () => {
    beforeEach(async () => {
      await sesion({ id: REVISADA, publicado: true, ...REVISION });
    });

    it.each([
      ['el titulo', "titulo = 'Otro titulo'"],
      ['el nivel', 'nivel = 2'],
      ['los parametros', `parametros = '{"largo":9}'::jsonb`],
      ['la mecanica', `id_actividad = '${OTRA_ACTIVIDAD}'`],
    ])('no deja cambiar %s', async (_que, cambio) => {
      await expect(
        dueno.query(`UPDATE sesion_de_actividad SET ${cambio} WHERE id_sesion = $1`, [REVISADA]),
      ).rejects.toThrow(/revisada no se edita/);
    });

    it('no deja «des-revisarla» para poder editarla despues', async () => {
      await expect(
        dueno.query(
          `UPDATE sesion_de_actividad
           SET revision = 'pendiente', publicado = false, revisada_por = NULL, revisada_el = NULL
           WHERE id_sesion = $1`,
          [REVISADA],
        ),
      ).rejects.toThrow(/revisada no se edita/);
    });

    it('no deja cambiar quien la reviso ni cuando', async () => {
      await expect(
        dueno.query(
          "UPDATE sesion_de_actividad SET revisada_por = 'Otra persona' WHERE id_sesion = $1",
          [REVISADA],
        ),
      ).rejects.toThrow(/revisada no se edita/);
    });

    it('si deja retirarla y volver a publicarla: el contenido es el mismo', async () => {
      await dueno.query('UPDATE sesion_de_actividad SET publicado = false WHERE id_sesion = $1', [
        REVISADA,
      ]);
      await dueno.query('UPDATE sesion_de_actividad SET publicado = true WHERE id_sesion = $1', [
        REVISADA,
      ]);

      const { rows } = await dueno.query<{ publicado: boolean }>(
        'SELECT publicado FROM sesion_de_actividad WHERE id_sesion = $1',
        [REVISADA],
      );

      expect(rows[0]?.publicado).toBe(true);
    });

    it('una pendiente si se edita, y al revisarla queda con su constancia', async () => {
      await sesion({ id: NUEVA, publicado: false, revision: 'pendiente' });

      await dueno.query(
        `UPDATE sesion_de_actividad SET titulo = 'Corregida' WHERE id_sesion = $1`,
        [NUEVA],
      );
      await dueno.query(
        `UPDATE sesion_de_actividad
         SET revision = 'revisada', revisada_por = 'Psicología', revisada_el = now(), publicado = true
         WHERE id_sesion = $1`,
        [NUEVA],
      );

      const { rows } = await dueno.query<{ titulo: string; revision: string }>(
        'SELECT titulo, revision FROM sesion_de_actividad WHERE id_sesion = $1',
        [NUEVA],
      );

      expect(rows[0]).toEqual({ titulo: 'Corregida', revision: 'revisada' });
    });
  });

  describe('quien puede leer y quien escribir (ADR 0010)', () => {
    it('la aplicacion lee las sesiones: es contenido de todos, no de una persona', async () => {
      await sesion({ id: PUBLICADA, publicado: true });

      const { rows } = await aplicacion.query<{ titulo: string }>(
        'SELECT titulo FROM sesion_de_actividad WHERE id_sesion = $1',
        [PUBLICADA],
      );

      expect(rows).toEqual([{ titulo: 'Cuatro colores' }]);
    });

    it('la aplicacion no escribe sesiones, ni diciendo que es administradora', async () => {
      await aplicacion.query('BEGIN');
      await aplicacion.query("SELECT set_config('vsd.rol_actual', 'administrador', true)");

      await expect(
        aplicacion.query(
          `INSERT INTO sesion_de_actividad (id_sesion, id_actividad, titulo, nivel, parametros, revision)
           VALUES ($1, $2, 'Colada', 1, '{}', 'no_requiere')`,
          [NUEVA, ACTIVIDAD],
        ),
      ).rejects.toThrow(/permission denied/);

      await aplicacion.query('ROLLBACK');
    });

    it('la aplicacion no cambia ni borra lo que ya hay', async () => {
      await sesion({ id: PUBLICADA, publicado: true });

      await expect(
        aplicacion.query(
          "UPDATE sesion_de_actividad SET titulo = 'Cambiado' WHERE id_sesion = $1",
          [PUBLICADA],
        ),
      ).rejects.toThrow(/permission denied/);
      await expect(
        aplicacion.query('DELETE FROM sesion_de_actividad WHERE id_sesion = $1', [PUBLICADA]),
      ).rejects.toThrow(/permission denied/);
    });
  });

  describe('los indices de la consulta de «que sesion toca»', () => {
    it('resultado se consulta por persona, mecanica y dia', async () => {
      const { rows } = await dueno.query<{ indexdef: string }>(
        `SELECT indexdef FROM pg_indexes
         WHERE tablename = 'resultado' AND indexname = 'resultado_id_usuario_id_actividad_dia_idx'`,
      );

      expect(rows[0]?.indexdef).toMatch(/\(id_usuario, id_actividad, dia\)/);
    });

    it('la clave foranea hacia la sesion tiene su indice: borrar una no recorre todos los resultados', async () => {
      const { rows } = await dueno.query<{ indexdef: string }>(
        `SELECT indexdef FROM pg_indexes
         WHERE tablename = 'resultado' AND indexname = 'resultado_id_sesion_idx'`,
      );

      expect(rows[0]?.indexdef).toMatch(/\(id_sesion\)/);
    });

    it('las sesiones se buscan por mecanica y publicacion', async () => {
      const { rows } = await dueno.query<{ indexdef: string }>(
        `SELECT indexdef FROM pg_indexes
         WHERE tablename = 'sesion_de_actividad' AND indexname = 'sesion_de_actividad_id_actividad_publicado_idx'`,
      );

      expect(rows[0]?.indexdef).toMatch(/\(id_actividad, publicado\)/);
    });
  });
});
