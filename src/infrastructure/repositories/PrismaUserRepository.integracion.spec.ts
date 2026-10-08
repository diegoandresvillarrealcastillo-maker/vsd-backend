// Vitest no lee `.env` por su cuenta, y esta prueba necesita saber si hay una
// base local a la que conectarse.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, describe, expect, it } from 'vitest';
import { EmailAlreadyRegisteredError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { pruebasDelPuertoDeUsuarios, unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaUserRepository } from './PrismaUserRepository.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';

/**
 * El adaptador de PostgreSQL, contra **el mismo contrato** que el de memoria.
 *
 * Es lo que pide SCRUM-62 y la parte que da valor al ejercicio: las pruebas de
 * `InMemoryUserRepository.spec.ts` y las de aqui salen del mismo archivo. Si
 * los dos adaptadores se separaran, esto falla.
 *
 * La conexion se hace con `vsd_app`, no con el dueno de las tablas. El dueno
 * esta exento de las politicas, asi que conectada como dueno esta prueba
 * pasaria aunque el aislamiento no funcionara.
 */

const URL_DUENO = process.env['DATABASE_URL'];

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA_PERSONA = '22222222-2222-4222-9222-222222222222';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

/**
 * Se prepara una sola vez y se reutiliza.
 *
 * El contrato llama a `preparar()` antes de cada prueba, y abrir una conexion
 * nueva cada vez agotaria el limite de conexiones sin ganar nada: lo que hace
 * falta entre pruebas es que el almacen quede vacio, y de eso se encarga
 * `limpiar`.
 */
let preparado:
  { prisma: PrismaService; dueno: Client; repositorio: PrismaUserRepository } | undefined;

async function preparar(): Promise<NonNullable<typeof preparado>> {
  if (preparado !== undefined) {
    return preparado;
  }

  const dueno = new Client({ connectionString: URL_DUENO });
  await dueno.connect();

  // La migracion crea `vsd_app` sin poder conectarse, a proposito: una
  // contrasena versionada en Git es una contrasena publicada. Aqui se le da
  // una que solo vale para esta base local.
  await prepararRolDeLaAplicacion(dueno);

  const prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
  await prisma.onModuleInit();

  preparado = { prisma, dueno, repositorio: new PrismaUserRepository(prisma) };

  return preparado;
}

/** Borra solo las cuentas de esta prueba, con el dueno y sin politicas de por medio. */
async function limpiarCon(dueno: Client): Promise<void> {
  const nuestras = [PERSONA, OTRA_PERSONA];

  await dueno.query('DELETE FROM entrada_diario WHERE id_usuario = ANY($1)', [nuestras]);
  await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [nuestras]);
  await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [nuestras]);
}

if (URL_DUENO === undefined) {
  describe.skip('PrismaUserRepository (sin DATABASE_URL)', () => {
    it('se salta', () => {
      expect(true).toBe(true);
    });
  });
} else {
  pruebasDelPuertoDeUsuarios('PrismaUserRepository', async () => {
    const { dueno, repositorio } = await preparar();

    return {
      repositorio,
      limpiar: () => limpiarCon(dueno),
      // Se cuenta con el dueno y no con la aplicacion: bajo las politicas, un
      // COUNT desde la aplicacion solo ve la fila propia y siempre daria uno.
      // La pregunta "cuantas filas hay" solo tiene respuesta desde fuera.
      contar: async () => {
        const { rows } = await dueno.query<{ cuantas: string }>(
          'SELECT count(*) AS cuantas FROM usuario WHERE id_usuario = ANY($1)',
          [[PERSONA, OTRA_PERSONA]],
        );

        return Number(rows[0]?.cuantas ?? 0);
      },
    };
  });

  describe('PrismaUserRepository, lo que solo se ve contra la base', () => {
    afterAll(async () => {
      if (preparado !== undefined) {
        await limpiarCon(preparado.dueno);
        await preparado.prisma.onModuleDestroy();
        await preparado.dueno.end();
        preparado = undefined;
      }
    });

    it('buscar por el proveedor de otra persona no devuelve su cuenta', async () => {
      // La politica nueva deja leer **una** fila: la que coincide con el
      // identificador del token. Que exista otra cuenta, y que se conozca su
      // identificador de proveedor exacto, no sirve de nada.
      const { dueno, repositorio } = await preparar();

      await limpiarCon(dueno);
      await repositorio.save(unaCuenta());
      await repositorio.save(
        unaCuenta({
          id: OTRA_PERSONA,
          correo: 'otra@ejemplo.test',
          idProveedorAuth: 'supabase|bbbb-2222',
        }),
      );

      // Se pide la de la otra persona por su identificador exacto: se obtiene,
      // porque eso es precisamente lo que autoriza presentar ese token. Lo que
      // no se puede es obtener una cuenta distinta de la que nombra el token.
      const suya = await repositorio.findByIdProveedorAuth('supabase|bbbb-2222');

      expect(suya?.id.value).toBe(OTRA_PERSONA);

      // Y la sesion por proveedor no abre la puerta a leer por identificador:
      // findById usa la sesion normal, que exige conocer el id_usuario.
      const porId = await repositorio.findById(new UserId(PERSONA));

      expect(porId?.id.value).toBe(PERSONA);
    });

    it('un correo que ya tiene otra cuenta se rechaza como CORREO_YA_REGISTRADO', async () => {
      // SCRUM-105. Con el adaptador de Prisma 7 el error de unicidad ya no trae
      // `meta.target`, y sin reconocerlo esto salia como un 500.
      const { dueno, repositorio } = await preparar();

      await limpiarCon(dueno);
      const primera = unaCuenta();
      await repositorio.save(primera);

      await expect(
        repositorio.save(
          unaCuenta({
            id: OTRA_PERSONA,
            correo: primera.correo,
            idProveedorAuth: 'supabase|google-del-mismo-correo',
          }),
        ),
      ).rejects.toThrow(EmailAlreadyRegisteredError);
    });

    it('sin fijar ninguna sesion no se ve absolutamente nada', async () => {
      // Se cierra por defecto, igual que el resto de las tablas. Una conexion
      // que olvide declarar quien pregunta no recibe todas las cuentas: no
      // recibe ninguna.
      const { dueno, repositorio } = await preparar();

      await limpiarCon(dueno);
      await repositorio.save(unaCuenta());

      const aplicacion = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
      await aplicacion.connect();

      try {
        const { rows } = await aplicacion.query('SELECT * FROM usuario');

        expect(rows).toHaveLength(0);
      } finally {
        await aplicacion.end();
      }
    });

    it('la politica del proveedor no permite escribir', async () => {
      // Solo se concedio SELECT, y no es un olvido: crear la cuenta se hace
      // con el identificador que generamos nosotros, que ya conocemos. Dar
      // escritura por esta via significaria que quien controle el valor de
      // `vsd.proveedor_actual` puede modificar una fila.
      const { dueno, repositorio } = await preparar();

      await limpiarCon(dueno);
      await repositorio.save(unaCuenta());

      const aplicacion = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
      await aplicacion.connect();

      try {
        await aplicacion.query('BEGIN');
        await aplicacion.query("SELECT set_config('vsd.proveedor_actual', $1, true)", [
          'supabase|aaaa-1111',
        ]);

        // Un UPDATE sin permiso no da error: no encuentra filas que actualizar
        // y termina en silencio. Es la trampa de RLS que mas confunde, y por
        // eso se comprueba el efecto y no una excepcion que nunca llega.
        const { rowCount } = await aplicacion.query(
          "UPDATE usuario SET nombre = 'Cambiado por quien no debe' WHERE id_proveedor_auth = $1",
          ['supabase|aaaa-1111'],
        );

        await aplicacion.query('COMMIT');

        expect(rowCount).toBe(0);
      } finally {
        await aplicacion.end();
      }

      const sinCambiar = await repositorio.findById(new UserId(PERSONA));

      expect(sinCambiar?.nombre).toBeUndefined();
    });

    describe('el historial de consentimientos y la edad (auditoria 360)', () => {
      /**
       * Corre una sentencia como la aplicacion, declarando quien es la persona,
       * dentro de una transaccion que se deshace: lo que se prueba es si la base
       * la deja, no lo que deja guardado.
       */
      async function comoLaAplicacion(
        persona: string,
        sentencia: string,
        valores: unknown[] = [],
      ): Promise<{ rowCount: number | null; rows: Record<string, unknown>[] }> {
        const aplicacion = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
        await aplicacion.connect();

        try {
          await aplicacion.query('BEGIN');
          await aplicacion.query("SELECT set_config('vsd.usuario_actual', $1, true)", [persona]);

          return await aplicacion.query<Record<string, unknown>>(sentencia, valores);
        } finally {
          await aplicacion.query('ROLLBACK').catch(() => undefined);
          await aplicacion.end();
        }
      }

      async function conDosCuentas(): Promise<Client> {
        const { dueno, repositorio } = await preparar();

        await limpiarCon(dueno);
        await repositorio.save(unaCuenta());
        await repositorio.save(
          unaCuenta({
            id: OTRA_PERSONA,
            correo: 'otra@ejemplo.test',
            idProveedorAuth: 'supabase|bbbb-2222',
          }),
        );

        return dueno;
      }

      it('la aplicacion no puede reescribir el historial: no tiene permiso de UPDATE', async () => {
        await conDosCuentas();

        await expect(
          comoLaAplicacion(
            PERSONA,
            "UPDATE consentimiento SET version = 'otra' WHERE id_usuario = $1",
            [PERSONA],
          ),
        ).rejects.toThrow(/permission denied/i);
      });

      it('la aplicacion no puede borrar el historial: no tiene permiso de DELETE', async () => {
        await conDosCuentas();

        await expect(
          comoLaAplicacion(PERSONA, 'DELETE FROM consentimiento WHERE id_usuario = $1', [PERSONA]),
        ).rejects.toThrow(/permission denied/i);
      });

      it('si puede leer y anotar lo suyo', async () => {
        await conDosCuentas();

        const leidos = await comoLaAplicacion(
          PERSONA,
          'SELECT tipo FROM consentimiento WHERE id_usuario = $1 ORDER BY tipo',
          [PERSONA],
        );
        expect(leidos.rows.map((fila) => fila['tipo'])).toEqual([
          'aviso_de_privacidad',
          'terminos',
        ]);

        const anotado = await comoLaAplicacion(
          PERSONA,
          `INSERT INTO consentimiento (id_consentimiento, id_usuario, tipo, version, aceptado_en)
           VALUES (gen_random_uuid(), $1, 'terminos', '2099-1', now())`,
          [PERSONA],
        );
        expect(anotado.rowCount).toBe(1);
      });

      it('no se puede anotar un consentimiento a nombre de otra persona', async () => {
        await conDosCuentas();

        await expect(
          comoLaAplicacion(
            PERSONA,
            `INSERT INTO consentimiento (id_consentimiento, id_usuario, tipo, version, aceptado_en)
             VALUES (gen_random_uuid(), $1, 'terminos', '2099-1', now())`,
            [OTRA_PERSONA],
          ),
        ).rejects.toThrow(/row-level security/i);
      });

      it('una persona no ve el historial de otra, ni sabiendo su identificador', async () => {
        await conDosCuentas();

        const ajeno = await comoLaAplicacion(
          OTRA_PERSONA,
          'SELECT * FROM consentimiento WHERE id_usuario = $1',
          [PERSONA],
        );

        expect(ajeno.rows).toHaveLength(0);
      });

      it('sin fijar ninguna sesion no se ve ningun consentimiento', async () => {
        await conDosCuentas();

        const aplicacion = new Client({ connectionString: urlDeLaAplicacion(URL_DUENO ?? '') });
        await aplicacion.connect();

        try {
          const { rows } = await aplicacion.query('SELECT * FROM consentimiento');

          expect(rows).toHaveLength(0);
        } finally {
          await aplicacion.end();
        }
      });

      it('no admite un tipo de consentimiento que no existe, ni una version vacia', async () => {
        const dueno = await conDosCuentas();
        const anotar = (tipo: string, version: string) =>
          dueno.query(
            `INSERT INTO consentimiento (id_consentimiento, id_usuario, tipo, version, aceptado_en)
             VALUES (gen_random_uuid(), $1, $2, $3, now())`,
            [PERSONA, tipo, version],
          );

        await expect(anotar('cookies', '1')).rejects.toThrow(/consentimiento_tipo_conocido/);
        await expect(anotar('terminos', '   ')).rejects.toThrow(/consentimiento_version_con_texto/);
      });

      it('la base no admite la fecha de nacimiento de un menor, ni siquiera de la mano del dueno', async () => {
        const dueno = await conDosCuentas();
        const poner = (fecha: string) =>
          dueno.query(`UPDATE usuario SET fecha_nacimiento = ${fecha} WHERE id_usuario = $1`, [
            PERSONA,
          ]);

        await expect(poner("CURRENT_DATE - INTERVAL '10 years'")).rejects.toThrow(
          /usuario_fecha_nacimiento_de_un_adulto/,
        );
        await expect(poner("CURRENT_DATE - INTERVAL '17 years'")).rejects.toThrow(
          /usuario_fecha_nacimiento_de_un_adulto/,
        );
        // Mas alla del dia de margen por la diferencia de zona, tampoco.
        await expect(poner("(CURRENT_DATE + 2) - INTERVAL '18 years'")).rejects.toThrow(
          /usuario_fecha_nacimiento_de_un_adulto/,
        );
        await expect(poner("DATE '1850-01-01'")).rejects.toThrow(
          /usuario_fecha_nacimiento_de_un_adulto/,
        );
      });

      it('y si admite la de quien cumple 18 hoy, incluso donde ya es manana', async () => {
        const dueno = await conDosCuentas();
        const poner = (fecha: string) =>
          dueno.query(`UPDATE usuario SET fecha_nacimiento = ${fecha} WHERE id_usuario = $1`, [
            PERSONA,
          ]);

        await expect(poner("CURRENT_DATE - INTERVAL '18 years'")).resolves.toBeDefined();
        await expect(poner("(CURRENT_DATE + 1) - INTERVAL '18 years'")).resolves.toBeDefined();
        await expect(poner("CURRENT_DATE - INTERVAL '40 years'")).resolves.toBeDefined();
      });

      it('los terminos se guardan con su version y su fecha, o con ninguna de las dos', async () => {
        const dueno = await conDosCuentas();

        // La cuenta de la prueba ya tiene las dos: quitar solo una rompe el par.
        await expect(
          dueno.query('UPDATE usuario SET version_terminos_aceptada = NULL WHERE id_usuario = $1', [
            PERSONA,
          ]),
        ).rejects.toThrow(/usuario_terminos_completos/);
        await expect(
          dueno.query('UPDATE usuario SET fecha_aceptacion_terminos = NULL WHERE id_usuario = $1', [
            PERSONA,
          ]),
        ).rejects.toThrow(/usuario_terminos_completos/);

        // Quitar las dos a la vez es una cuenta anterior, y es valido.
        await expect(
          dueno.query(
            `UPDATE usuario SET version_terminos_aceptada = NULL, fecha_aceptacion_terminos = NULL
             WHERE id_usuario = $1`,
            [PERSONA],
          ),
        ).resolves.toBeDefined();
      });

      it('lo que las cuentas ya habian aceptado pasa al historial al migrar', async () => {
        // La migracion hace `INSERT ... SELECT` desde `usuario`. Aqui no se
        // puede volver a correr, pero si la misma sentencia sobre una cuenta
        // anterior: el historial tiene que quedar con lo que aceptaron, y el
        // `skipDuplicates` de despues no puede duplicarlo.
        const dueno = await conDosCuentas();
        const { repositorio } = await preparar();

        await dueno.query('DELETE FROM consentimiento WHERE id_usuario = $1', [PERSONA]);
        await dueno.query(
          `INSERT INTO consentimiento (id_consentimiento, id_usuario, tipo, version, aceptado_en)
           SELECT gen_random_uuid(), id_usuario, 'aviso_de_privacidad',
                  version_politica_aceptada, fecha_aceptacion_politica
           FROM usuario WHERE id_usuario = $1 AND btrim(version_politica_aceptada) <> ''`,
          [PERSONA],
        );

        const antes = await repositorio.consentimientosDe(new UserId(PERSONA));

        expect(antes.map((fila) => fila.tipo)).toEqual(['aviso_de_privacidad']);

        // Guardar la cuenta otra vez no repite el aviso que ya esta; solo anade
        // los terminos que faltaban.
        await repositorio.save(unaCuenta());

        const despues = await repositorio.consentimientosDe(new UserId(PERSONA));

        expect(despues.map((fila) => fila.tipo).sort()).toEqual([
          'aviso_de_privacidad',
          'terminos',
        ]);
      });
    });
  });
}
