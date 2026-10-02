import type { Client } from 'pg';

/**
 * Contrasena de `vsd_app` en la base local de pruebas.
 *
 * La migracion crea el rol sin poder conectarse, a proposito: una contrasena
 * versionada en Git es una contrasena publicada. Esta solo vale para la base
 * local y la del CI, que no contienen datos de nadie.
 */
export const CLAVE_LOCAL = 'clave_de_pruebas_locales';

const INTENTOS = 8;

/**
 * Deja a `vsd_app` listo para conectarse, reintentando si otra suite lo hace
 * a la vez.
 *
 * Todas las suites de integracion necesitan este ALTER ROLE al arrancar, y
 * corren en paralelo. PostgreSQL rechaza dos cambios simultaneos del mismo rol
 * con "tuple concurrently updated", y eso hacia fallar de forma intermitente a
 * la suite que perdia la carrera. El cambio es identico en todas, asi que
 * reintentar es seguro.
 */
export async function prepararRolDeLaAplicacion(dueno: Client): Promise<void> {
  for (let intento = 1; ; intento++) {
    try {
      await dueno.query(`ALTER ROLE vsd_app WITH LOGIN PASSWORD '${CLAVE_LOCAL}'`);

      return;
    } catch (error) {
      if (intento >= INTENTOS || !String(error).includes('concurrently updated')) {
        throw error;
      }

      await new Promise((listo) => setTimeout(listo, 50 * intento + Math.random() * 50));
    }
  }
}
