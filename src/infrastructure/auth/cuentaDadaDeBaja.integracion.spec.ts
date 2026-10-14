// Igual que las demas pruebas de integracion: vitest no lee `.env` por su cuenta y aqui hace falta
// saber si hay una base local a la que conectarse.
import 'dotenv/config';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Client } from 'pg';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { REGISTRO_DE_PRUEBA, comoUsuario } from '../../pruebas/sesionDePrueba.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';
import { TokenInvalidoError, VerificadorDeIdentidad } from './VerificadorDeIdentidad.js';
import type { Identidad } from './VerificadorDeIdentidad.js';

/**
 * Dar de baja la cuenta, de la cabecera HTTP a la fila de PostgreSQL (SCRUM-190, ADR 0026).
 *
 * Es la prueba que pide el ticket: **el re-registro y la revocación de sesiones**, contra la base
 * de verdad y con la aplicación conectada como `vsd_app` (el dueño de las tablas está exento de
 * las políticas, y conectada como dueño esta prueba pasaría sin comprobar nada).
 *
 * Lo que se comprueba, y por qué cada cosa:
 *
 * - **Nada vivo queda**: ninguna tabla con `id_usuario` conserva una fila de la persona.
 * - **La constancia no identifica a nadie**: ni nombre, ni correo, ni fecha de nacimiento en lo
 *   que sobrevive. Se comprueba por la estructura (las columnas) y por el contenido.
 * - **El token que todavía no caducó no resucita la cuenta**: ni para operar ni para el alta. Es
 *   la «revocación de sesiones»: la API lo rechaza con 401 y el cliente cierra la sesión.
 * - **El mismo correo puede volver a registrarse** sin colisión.
 * - **La aplicación no puede tocar las constancias**: ni leer las ajenas ni reescribir ni borrar.
 *
 * Las identidades y los correos son propios de esta suite: las suites de integración comparten
 * base y corren en paralelo, y reutilizar los de otra hace que se borren filas entre ellas.
 */

const URL_DUENO = process.env['DATABASE_URL'];

const IDENTIDADES: Record<string, Identidad> = {
  'token-baja-A': {
    id: 'b0b0b0b0-0001-4000-8000-000000000001',
    correo: 'a@baja-de-cuenta.test',
  },
  'token-baja-B': {
    id: 'b0b0b0b0-0002-4000-8000-000000000002',
    correo: 'b@baja-de-cuenta.test',
  },
  // La misma persona que A, con una identidad nueva en el proveedor: otro identificador y el
  // mismo correo.
  'token-baja-A-nuevo': {
    id: 'b0b0b0b0-0003-4000-8000-000000000003',
    correo: 'a@baja-de-cuenta.test',
  },
};

class VerificadorDeEstaSuite {
  verificar(token: string): Promise<Identidad> {
    const identidad = IDENTIDADES[token];

    return identidad === undefined
      ? Promise.reject(new TokenInvalidoError('token desconocido en esta suite'))
      : Promise.resolve(identidad);
  }
}

const A = 'token-baja-A';
const B = 'token-baja-B';
const A_NUEVO = 'token-baja-A-nuevo';

const CORREOS = [...new Set(Object.values(IDENTIDADES).map((i) => i.correo))];
const PROVEEDORES = Object.values(IDENTIDADES).map((i) => i.id);

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

describe.skipIf(URL_DUENO === undefined)('Dar de baja la cuenta, de HTTP a PostgreSQL', () => {
  let dueno: Client;
  let app: NestExpressApplication;
  let urlApp: string;

  /** Los identificadores nuestros que genero el alta, por token. */
  const cuentas = new Map<string, string>();

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  async function limpiar(): Promise<void> {
    // La constancia no cuelga de `usuario`: se va por el identificador del proveedor.
    const { rows } = await dueno.query<{ id_cuenta: string }>(
      'SELECT id_cuenta FROM cuenta_inactiva WHERE id_proveedor_auth = ANY($1)',
      [PROVEEDORES],
    );
    const ids = rows.map((fila) => fila.id_cuenta);

    await dueno.query('DELETE FROM consentimiento_de_cuenta_inactiva WHERE id_cuenta = ANY($1)', [
      ids,
    ]);
    await dueno.query('DELETE FROM cuenta_inactiva WHERE id_proveedor_auth = ANY($1)', [
      PROVEEDORES,
    ]);
    await dueno.query('DELETE FROM usuario WHERE correo = ANY($1)', [CORREOS]);
  }

  async function altaDe(token: string): Promise<string> {
    const respuesta = await request(servidor())
      .post('/api/cuenta')
      .set(...comoUsuario(token))
      .send({ ...REGISTRO_DE_PRUEBA, nombre: 'Persona de la baja' })
      .expect(200);

    return (respuesta.body as { id: string }).id;
  }

  async function filasVivas(persona: string): Promise<Record<string, number>> {
    const { rows: tablas } = await dueno.query<{ tabla: string }>(
      `SELECT table_name AS tabla FROM information_schema.columns
        WHERE table_schema = 'public' AND column_name = 'id_usuario' ORDER BY table_name`,
    );
    const rastro: Record<string, number> = {};

    for (const { tabla } of tablas) {
      const { rows } = await dueno.query<{ n: string }>(
        `SELECT count(*) AS n FROM "${tabla}" WHERE id_usuario = $1`,
        [persona],
      );

      rastro[tabla] = Number(rows[0]?.n ?? 0);
    }

    return rastro;
  }

  beforeAll(async () => {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);
    await limpiar();

    urlApp = urlDeLaAplicacion(URL_DUENO ?? '');

    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:5173';
    process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
    process.env.DATABASE_URL = urlApp;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(VerificadorDeIdentidad)
      .useClass(VerificadorDeEstaSuite)
      .compile();

    app = modulo.createNestApplication<NestExpressApplication>({ logger: false });
    configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));
    await app.init();

    for (const token of [A, B]) {
      cuentas.set(token, await altaDe(token));
    }

    // Algo vivo de A en una tabla mas, para que la prueba no pase por estar todo vacio.
    await dueno.query(
      `INSERT INTO pendiente (id_pendiente, id_usuario, texto, nivel, id_operacion_cliente, fecha_edicion)
       VALUES ($1, $2, 'Llamar a la medica', 'urgente', $3, now())`,
      [globalThis.crypto.randomUUID(), cuentas.get(A), globalThis.crypto.randomUUID()],
    );
  });

  afterAll(async () => {
    await app?.close();
    await limpiar();
    await dueno?.end();
  });

  it('antes de darla de baja, A tiene cuenta y cosas suyas en varias tablas', async () => {
    const rastro = await filasVivas(cuentas.get(A) ?? '');

    expect(rastro['usuario']).toBe(1);
    expect(rastro['pendiente']).toBe(1);
    expect(rastro['consentimiento']).toBeGreaterThanOrEqual(1);
  });

  describe('al darla de baja', () => {
    beforeAll(async () => {
      await request(servidor())
        .delete('/api/cuenta')
        .set(...comoUsuario(A))
        .send({ confirmacion: 'BORRAR MI CUENTA' })
        .expect(204);
    });

    it('no queda ninguna fila viva suya en ninguna tabla', async () => {
      const rastro = await filasVivas(cuentas.get(A) ?? '');

      expect(Object.values(rastro).every((filas) => filas === 0)).toBe(true);
      expect(Object.keys(rastro)).toEqual(
        expect.arrayContaining(['usuario', 'pendiente', 'consentimiento']),
      );
    });

    it('queda su constancia: cuando existio y con que identificador del proveedor', async () => {
      const { rows } = await dueno.query<{
        id_cuenta: string;
        id_proveedor_auth: string;
        inactivada_el: Date;
      }>('SELECT * FROM cuenta_inactiva WHERE id_proveedor_auth = $1', [IDENTIDADES[A]?.id]);

      expect(rows).toHaveLength(1);
      expect(rows[0]?.id_cuenta).toBe(cuentas.get(A));
      expect(rows[0]?.inactivada_el).toBeInstanceOf(Date);
    });

    it('y lo que acepto, version por version', async () => {
      const { rows } = await dueno.query<{ tipo: string; version: string }>(
        `SELECT tipo, version FROM consentimiento_de_cuenta_inactiva
          WHERE id_cuenta = $1 ORDER BY tipo`,
        [cuentas.get(A)],
      );

      expect(rows.map((fila) => fila.tipo)).toEqual(['aviso_de_privacidad', 'terminos']);
      expect(rows.every((fila) => fila.version.trim() !== '')).toBe(true);
    });

    it('la constancia no identifica a nadie: ni columnas ni contenido de nombre, correo o fecha de nacimiento', async () => {
      const { rows: columnas } = await dueno.query<{ column_name: string }>(
        `SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name IN ('cuenta_inactiva', 'consentimiento_de_cuenta_inactiva')`,
      );

      for (const { column_name: columna } of columnas) {
        expect(columna).not.toMatch(/correo|nombre|nacimiento|mascota|foto|zona|modulos/);
      }

      const { rows: contenido } = await dueno.query<{ texto: string }>(
        `SELECT row_to_json(c)::text AS texto FROM cuenta_inactiva c WHERE id_cuenta = $1
         UNION ALL
         SELECT row_to_json(k)::text FROM consentimiento_de_cuenta_inactiva k WHERE id_cuenta = $1`,
        [cuentas.get(A)],
      );
      const todo = contenido.map((fila) => fila.texto).join('\n');

      expect(todo).not.toContain(IDENTIDADES[A]?.correo);
      expect(todo).not.toContain('Persona de la baja');
      expect(todo).not.toContain(REGISTRO_DE_PRUEBA.fechaNacimiento);
    });

    it('el correo ya no aparece en ninguna tabla de usuarios', async () => {
      const { rows } = await dueno.query('SELECT 1 FROM usuario WHERE correo = $1', [
        IDENTIDADES[A]?.correo,
      ]);

      expect(rows).toHaveLength(0);
    });

    it('lo de B sigue entero', async () => {
      await request(servidor())
        .get('/api/cuenta')
        .set(...comoUsuario(B))
        .expect(200);

      expect((await filasVivas(cuentas.get(B) ?? ''))['usuario']).toBe(1);
    });

    describe('la sesion que todavia no caduco (revocacion de sesiones)', () => {
      it('no sirve para consultar la cuenta: 401 CUENTA_INACTIVA', async () => {
        const respuesta = await request(servidor())
          .get('/api/cuenta')
          .set(...comoUsuario(A))
          .expect(401);

        expect(respuesta.body).toMatchObject({ codigo: 'CUENTA_INACTIVA' });
      });

      it('no sirve para exportar, para operar, ni para volver a darse de alta', async () => {
        // Cada peticion se arma en su momento: una ya armada abre su propio servidor al
        // encadenar, y esperarlas en fila las dejaria sin el.
        const peticiones: (() => request.Test)[] = [
          () => request(servidor()).get('/api/cuenta/exportacion'),
          () => request(servidor()).get('/api/diario'),
          () =>
            request(servidor()).delete('/api/cuenta').send({ confirmacion: 'BORRAR MI CUENTA' }),
          () => request(servidor()).post('/api/cuenta').send(REGISTRO_DE_PRUEBA),
        ];

        for (const armar of peticiones) {
          await armar()
            .set(...comoUsuario(A))
            .expect(401);
        }

        // El alta rechazada no creo nada: ni cuenta ni una segunda constancia.
        const { rows: cuentasConEseProveedor } = await dueno.query(
          'SELECT 1 FROM usuario WHERE id_proveedor_auth = $1',
          [IDENTIDADES[A]?.id],
        );
        const { rows: constancias } = await dueno.query(
          'SELECT 1 FROM cuenta_inactiva WHERE id_proveedor_auth = $1',
          [IDENTIDADES[A]?.id],
        );

        expect(cuentasConEseProveedor).toHaveLength(0);
        expect(constancias).toHaveLength(1);
      });
    });

    describe('volver a registrarse con el mismo correo', () => {
      let idNuevo = '';

      beforeAll(async () => {
        idNuevo = await altaDe(A_NUEVO);
      });

      it('no colisiona: es una cuenta nueva, con otro identificador', async () => {
        expect(idNuevo).not.toBe('');
        expect(idNuevo).not.toBe(cuentas.get(A));

        const respuesta = await request(servidor())
          .get('/api/cuenta')
          .set(...comoUsuario(A_NUEVO))
          .expect(200);

        expect(respuesta.body).toMatchObject({ correo: IDENTIDADES[A]?.correo, id: idNuevo });
      });

      it('empieza vacia: no hereda nada de la anterior', async () => {
        const rastro = await filasVivas(idNuevo);

        expect(rastro['usuario']).toBe(1);
        expect(rastro['pendiente']).toBe(0);
      });

      it('la sesion de la cuenta anterior sigue sin servir', async () => {
        await request(servidor())
          .get('/api/cuenta')
          .set(...comoUsuario(A))
          .expect(401);
      });
    });
  });

  describe('la aplicacion no puede tocar las constancias (aislamiento)', () => {
    /** Una conexion como la de la aplicacion, con la sesion de una persona declarada. */
    async function comoLaAplicacion<T>(
      persona: string,
      tarea: (cliente: Client) => Promise<T>,
    ): Promise<T> {
      const cliente = new Client({ connectionString: urlApp });

      await cliente.connect();
      await cliente.query('BEGIN');
      await cliente.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);

      try {
        return await tarea(cliente);
      } finally {
        await cliente.query('ROLLBACK');
        await cliente.end();
      }
    }

    it('otra persona no ve la constancia de A', async () => {
      const filas = await comoLaAplicacion(cuentas.get(B) ?? '', async (cliente) => {
        const { rows } = await cliente.query<Record<string, unknown>>(
          'SELECT * FROM cuenta_inactiva',
        );

        return rows;
      });

      expect(filas).toHaveLength(0);
    });

    it('nadie puede leer el historial de lo aceptado desde la aplicacion', async () => {
      await expect(
        comoLaAplicacion(cuentas.get(A) ?? '', (cliente) =>
          cliente.query('SELECT * FROM consentimiento_de_cuenta_inactiva'),
        ),
      ).rejects.toThrow(/permission denied|permiso denegado/i);
    });

    it('no se puede reescribir ni borrar una constancia', async () => {
      await expect(
        comoLaAplicacion(cuentas.get(A) ?? '', (cliente) =>
          cliente.query('UPDATE cuenta_inactiva SET inactivada_el = now() WHERE id_cuenta = $1', [
            cuentas.get(A),
          ]),
        ),
      ).rejects.toThrow(/permission denied|permiso denegado/i);

      await expect(
        comoLaAplicacion(cuentas.get(A) ?? '', (cliente) =>
          cliente.query('DELETE FROM cuenta_inactiva WHERE id_cuenta = $1', [cuentas.get(A)]),
        ),
      ).rejects.toThrow(/permission denied|permiso denegado/i);
    });

    it('no se puede anotar una constancia a nombre de otra persona', async () => {
      await expect(
        comoLaAplicacion(cuentas.get(B) ?? '', (cliente) =>
          cliente.query(
            `INSERT INTO cuenta_inactiva
               (id_cuenta, id_proveedor_auth, fecha_registro, inactivada_el,
                version_politica_aceptada, fecha_aceptacion_politica)
             VALUES ($1, 'proveedor-inventado', now(), now(), '1', now())`,
            [globalThis.crypto.randomUUID()],
          ),
        ),
      ).rejects.toThrow(/row-level security|seguridad a nivel de fila/i);
    });
  });
});
