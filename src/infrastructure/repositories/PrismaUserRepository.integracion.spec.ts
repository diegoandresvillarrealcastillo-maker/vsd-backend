// Vitest no lee `.env` por su cuenta, y esta prueba necesita saber si hay una
// base local a la que conectarse.
import 'dotenv/config';

import { Client } from 'pg';
import { afterAll, describe, expect, it } from 'vitest';
import { UserId } from '../../domain/model/Identifier.js';
import { pruebasDelPuertoDeUsuarios, unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaUserRepository } from './PrismaUserRepository.js';

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
const CLAVE_LOCAL = 'clave_de_pruebas_locales';

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
  await dueno.query(`ALTER ROLE vsd_app WITH LOGIN PASSWORD '${CLAVE_LOCAL}'`);

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
  });
}
