// Vitest no lee `.env` por su cuenta, y estas pruebas necesitan saber si hay
// una base local a la que conectarse. Se carga aqui y no en una configuracion
// global a proposito: el resto de la suite debe seguir corriendo con el
// entorno que cada archivo se prepara, sin heredar la maquina de quien ejecuta.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * Aislamiento entre personas, comprobado contra PostgreSQL de verdad.
 *
 * ## Por que no basta con probar la API
 *
 * La API ya responde bien: pedir datos de otra persona no devuelve nada. Pero
 * eso solo demuestra que el caso de uso filtra, y el caso de uso es
 * precisamente la capa que puede fallar. Una consulta nueva que olvide el
 * filtro, un endpoint escrito con prisa, un `findMany` sin `where`: la API
 * seguiria respondiendo con normalidad mientras entrega lo que no debe.
 *
 * Por eso estas pruebas **se saltan la aplicacion entera**. Abren una conexion
 * a PostgreSQL con el rol de la aplicacion, declaran ser una persona y piden
 * directamente las filas de otra, con su identificador exacto delante. Si la
 * base devolviera algo, la tarea no estaria hecha por bien que se viera la API.
 *
 * ## Cuando se ejecutan
 *
 * Solo si hay `DATABASE_URL`. En una maquina sin base local la suite pasa sin
 * estas pruebas, y eso es deliberado: obligar a levantar PostgreSQL para
 * cambiar una linea de dominio acabaria con alguien comentando la suite.
 *
 * La contrasena de aqui es de la base local y solo de la base local. En
 * cualquier otro ambiente, `vsd_app` recibe la suya a mano y nunca pasa por
 * Git: la migracion crea el rol sin contrasena justamente para eso.
 */
const URL_DUENO = process.env['DATABASE_URL'];
const CLAVE_LOCAL = 'clave_de_pruebas_locales';

// Donde estas pruebas son obligatorias no se permite saltarlas. Una prueba de
// seguridad que se ignora sola es peor que no tenerla: el trabajo sale en verde
// sin haber comprobado nada, y nadie mira el detalle de una suite que paso.
//
// La marca es una variable propia y no `CI`, porque en el CI hay otro trabajo
// que corre la suite entera sin base de datos a proposito. Ahi saltarselas es
// justo lo correcto.
if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const USUARIO_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const USUARIO_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const CATEGORIA = 'ccccccce-cccc-4ccc-8ccc-cccccccccccc';
const ACTIVIDAD = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const RESULTADO_DE_A = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const RESULTADO_DE_B = 'ffffffff-ffff-4fff-8fff-ffffffffffff';
const ENTRADA_DE_B = '99999999-9999-4999-8999-999999999999';

/** La misma URL pero conectando con el rol de la aplicacion. */
function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

/**
 * Crea las filas de prueba.
 *
 * Cada insercion declara de quien es, igual que hara la aplicacion. Podria
 * ahorrarse en local, donde el dueno de la base es superusuario y se salta las
 * politicas, pero entonces estas pruebas dependerian de un privilegio que en
 * CI o en Supabase puede no estar.
 */
async function sembrar(dueno: Client): Promise<void> {
  await dueno.query('BEGIN');
  await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', true)");
  await dueno.query(
    `INSERT INTO categoria (id_categoria, nombre) VALUES ($1, 'Pruebas de aislamiento')`,
    [CATEGORIA],
  );
  await dueno.query(
    `INSERT INTO actividad (id_actividad, id_categoria, nombre, tipo, direccion_escala, puntaje_maximo)
     VALUES ($1, $2, 'Actividad de prueba', 'cuestionario', 'mayor_es_mejor', 10)`,
    [ACTIVIDAD, CATEGORIA],
  );
  await dueno.query('COMMIT');

  for (const [usuario, correo] of [
    [USUARIO_A, 'a@ejemplo.test'],
    [USUARIO_B, 'b@ejemplo.test'],
  ]) {
    await dueno.query('BEGIN');
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [usuario]);
    await dueno.query(
      `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, $2, $3, '1.0', now())`,
      [usuario, correo, `proveedor-de-prueba-${usuario}`],
    );
    await dueno.query('COMMIT');
  }

  for (const [resultado, usuario, operacion] of [
    [RESULTADO_DE_A, USUARIO_A, '11111111-1111-4111-8111-111111111111'],
    [RESULTADO_DE_B, USUARIO_B, '22222222-2222-4222-8222-222222222222'],
  ]) {
    await dueno.query('BEGIN');
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [usuario]);
    await dueno.query(
      `INSERT INTO resultado (id_resultado, id_usuario, id_actividad, id_operacion_cliente, puntaje, nivel_orientativo, fecha)
       VALUES ($1, $2, $3, $4, 80, 'favorable', now())`,
      [resultado, usuario, ACTIVIDAD, operacion],
    );
    await dueno.query('COMMIT');
  }

  await dueno.query('BEGIN');
  await dueno.query("SELECT set_config('vsd.usuario_actual', $1, true)", [USUARIO_B]);
  await dueno.query(
    `INSERT INTO entrada_diario (id_entrada, id_usuario, contenido, id_operacion_cliente, fecha_creacion, fecha_edicion)
     VALUES ($1, $2, 'Algo que solo le importa a quien lo escribio', $3, now(), now())`,
    [ENTRADA_DE_B, USUARIO_B, '33333333-3333-4333-8333-333333333333'],
  );
  await dueno.query('COMMIT');
}

async function limpiar(dueno: Client): Promise<void> {
  // El dueno es superusuario en local, asi que borra sin politicas de por
  // medio. Se borra por orden de dependencia para no chocar con las claves
  // foraneas.
  await dueno.query('DELETE FROM entrada_diario WHERE id_usuario = ANY($1)', [
    [USUARIO_A, USUARIO_B],
  ]);
  await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
  await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [[USUARIO_A, USUARIO_B]]);
  await dueno.query('DELETE FROM actividad WHERE id_actividad = $1', [ACTIVIDAD]);
  await dueno.query('DELETE FROM categoria WHERE id_categoria = $1', [CATEGORIA]);
}

describe.skipIf(URL_DUENO === undefined)('Aislamiento impuesto por PostgreSQL', () => {
  let dueno: Client;
  let aplicacion: Client;

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();

    // La migracion crea `vsd_app` sin poder conectarse, a proposito: una
    // contrasena versionada en Git es una contrasena publicada. Aqui se le da
    // una que solo vale para esta base local.
    await dueno.query(`ALTER ROLE vsd_app WITH LOGIN PASSWORD '${CLAVE_LOCAL}'`);

    await limpiar(dueno);
    await sembrar(dueno);

    aplicacion = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
    await aplicacion.connect();
  });

  afterAll(async () => {
    await aplicacion?.end();
    await limpiar(dueno);
    await dueno?.end();
  });

  /** Ejecuta una consulta declarando ser una persona, como hace la aplicacion. */
  async function comoUsuario(
    usuario: string,
    consulta: string,
    parametros: unknown[] = [],
    rol = 'usuario',
  ): Promise<Record<string, unknown>[]> {
    await aplicacion.query('BEGIN');

    try {
      await aplicacion.query(
        "SELECT set_config('vsd.usuario_actual', $1, true), set_config('vsd.rol_actual', $2, true)",
        [usuario, rol],
      );

      const { rows } = await aplicacion.query<Record<string, unknown>>(consulta, parametros);

      return rows;
    } finally {
      await aplicacion.query('COMMIT');
    }
  }

  describe('el rol de la aplicacion esta realmente sujeto a las politicas', () => {
    it('no es superusuario ni tiene BYPASSRLS', async () => {
      // Si esto fallara, todas las demas pruebas de este archivo pasarian sin
      // demostrar nada: un rol privilegiado obtiene las mismas respuestas
      // existan o no las politicas.
      const { rows } = await aplicacion.query(
        'SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname = current_user',
      );

      expect(rows[0]).toMatchObject({ rolsuper: false, rolbypassrls: false });
    });

    it('no es dueno de ninguna tabla', async () => {
      const { rows } = await aplicacion.query<{ propias: number }>(
        `SELECT count(*)::int AS propias FROM pg_tables
         WHERE schemaname = 'public' AND tableowner = current_user`,
      );

      expect(rows[0]).toMatchObject({ propias: 0 });
    });
  });

  describe('datos personales', () => {
    it('conocer el identificador exacto de un resultado ajeno no sirve de nada', async () => {
      const filas = await comoUsuario(
        USUARIO_A,
        'SELECT * FROM resultado WHERE id_resultado = $1',
        [RESULTADO_DE_B],
      );

      expect(filas).toHaveLength(0);
    });

    it('lo mismo con una entrada de diario', async () => {
      const filas = await comoUsuario(
        USUARIO_A,
        'SELECT * FROM entrada_diario WHERE id_entrada = $1',
        [ENTRADA_DE_B],
      );

      expect(filas).toHaveLength(0);
    });

    it('una consulta sin filtro solo devuelve lo propio', async () => {
      // Este es el caso que motiva toda la tarea: el olvido. Sin RLS esta
      // consulta devolveria los resultados de todo el mundo.
      const filas = await comoUsuario(USUARIO_A, 'SELECT id_usuario FROM resultado');

      expect(filas).toHaveLength(1);
      expect(filas[0]).toMatchObject({ id_usuario: USUARIO_A });
    });

    it('el administrador tampoco ve datos de otras personas', async () => {
      // El entregable dice que el administrador gestiona categorias,
      // actividades y recursos, y que no accede a resultados ni a informacion
      // personal. Aqui deja de ser una promesa del documento.
      const resultados = await comoUsuario(
        USUARIO_A,
        'SELECT * FROM resultado WHERE id_resultado = $1',
        [RESULTADO_DE_B],
        'administrador',
      );

      const entradas = await comoUsuario(
        USUARIO_A,
        'SELECT * FROM entrada_diario',
        [],
        'administrador',
      );

      const personas = await comoUsuario(
        USUARIO_A,
        'SELECT * FROM usuario WHERE id_usuario = $1',
        [USUARIO_B],
        'administrador',
      );

      expect(resultados).toHaveLength(0);
      expect(entradas).toHaveLength(0);
      expect(personas).toHaveLength(0);
    });

    it('sin declarar identidad no se ve absolutamente nada', async () => {
      // Se cierra por defecto. Una conexion que olvide fijar la sesion no
      // recibe datos de todos: no recibe ninguno.
      const { rows } = await aplicacion.query('SELECT * FROM resultado');

      expect(rows).toHaveLength(0);
    });

    it('no se puede escribir un resultado a nombre de otra persona', async () => {
      await expect(
        comoUsuario(
          USUARIO_A,
          `INSERT INTO resultado (id_resultado, id_usuario, id_actividad, id_operacion_cliente, fecha)
           VALUES (gen_random_uuid(), $1, $2, gen_random_uuid(), now())`,
          [USUARIO_B, ACTIVIDAD],
        ),
      ).rejects.toThrow(/row-level security/i);
    });

    it('cada persona si ve lo suyo', async () => {
      const filas = await comoUsuario(
        USUARIO_B,
        'SELECT id_resultado FROM resultado WHERE id_resultado = $1',
        [RESULTADO_DE_B],
      );

      expect(filas).toHaveLength(1);
    });
  });

  describe('catalogo', () => {
    it('lo lee cualquier sesion', async () => {
      const filas = await comoUsuario(
        USUARIO_A,
        'SELECT * FROM actividad WHERE id_actividad = $1',
        [ACTIVIDAD],
      );

      expect(filas).toHaveLength(1);
    });

    it('no lo modifica quien no es administrador', async () => {
      // Ojo con la forma del fallo: un UPDATE sin permiso **no da error**, no
      // encuentra filas que actualizar y termina en silencio. Es la trampa de
      // RLS que mas confunde, y por eso lo que se comprueba es el efecto (la
      // fila sigue igual) y no una excepcion que nunca llega.
      await comoUsuario(
        USUARIO_A,
        `UPDATE actividad SET nombre = 'Cambiado por quien no debe' WHERE id_actividad = $1`,
        [ACTIVIDAD],
      );

      const filas = await comoUsuario(
        USUARIO_A,
        'SELECT nombre FROM actividad WHERE id_actividad = $1',
        [ACTIVIDAD],
      );

      expect(filas[0]).toMatchObject({ nombre: 'Actividad de prueba' });
    });

    it('no lo amplia quien no es administrador', async () => {
      // Un INSERT si falla con error, porque lo rechaza el WITH CHECK. Dos
      // caminos distintos para la misma regla.
      await expect(
        comoUsuario(
          USUARIO_A,
          `INSERT INTO categoria (id_categoria, nombre) VALUES (gen_random_uuid(), 'Colada')`,
        ),
      ).rejects.toThrow(/row-level security/i);
    });

    it('lo escribe el administrador', async () => {
      await comoUsuario(
        USUARIO_A,
        `UPDATE actividad SET descripcion = 'Editada por el administrador' WHERE id_actividad = $1`,
        [ACTIVIDAD],
        'administrador',
      );

      const filas = await comoUsuario(
        USUARIO_A,
        'SELECT descripcion FROM actividad WHERE id_actividad = $1',
        [ACTIVIDAD],
      );

      expect(filas[0]).toMatchObject({ descripcion: 'Editada por el administrador' });
    });
  });

  it('ninguna tabla se queda sin Row Level Security', async () => {
    // Esta prueba no comprueba lo que hay: comprueba lo que venga despues.
    // El dia que alguien anada una tabla y se olvide de protegerla, falla
    // aqui y no en produccion.
    const { rows } = await dueno.query<{ tablename: string }>(
      `SELECT c.relname AS tablename
       FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
       WHERE n.nspname = 'public'
         AND c.relkind = 'r'
         AND c.relname NOT LIKE '\\_prisma%'
         AND c.relrowsecurity = false`,
    );

    expect(rows.map((fila) => fila.tablename)).toEqual([]);
  });

  it('las tablas con datos personales ademas fuerzan las politicas al dueno', async () => {
    // Sin FORCE, bastaria con conectar la aplicacion con el usuario de las
    // migraciones para que el aislamiento desapareciera sin dar ningun error.
    const { rows } = await dueno.query<{ relname: string }>(
      `SELECT c.relname
       FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
       WHERE n.nspname = 'public'
         AND c.relname IN ('usuario', 'resultado', 'entrada_diario')
         AND c.relforcerowsecurity = false`,
    );

    expect(rows.map((fila) => fila.relname)).toEqual([]);
  });
});
