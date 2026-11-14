import { existsSync } from 'node:fs';
import { Client } from 'pg';
import { leerLasOpcionesDeLaPurga } from './leerLasOpcionesDeLaPurga.js';
import {
  ANIOS_DE_CONSERVACION_DE_LA_CONSTANCIA,
  purgarConstancias,
  SinPermisoParaLaPurgaError,
} from './purgarConstancias.js';

/**
 * Borra las constancias de baja que cumplieron los 10 anos (SCRUM-236, ADR 0026).
 *
 * Lo usa `npm run mantenimiento:constancias`. Lo ejecuta una persona con acceso a la
 * base: no corre solo en ningun ambiente.
 *
 *   npm run mantenimiento:constancias                    ->  simulacro: dice que borraria
 *   npm run mantenimiento:constancias -- --aplicar       ->  borra de verdad
 *   npm run mantenimiento:constancias -- "postgresql://..." --aplicar
 *
 * Sin cadena de conexion usa DIRECT_URL del .env, que es la del dueno de las tablas:
 * la unica que puede borrar constancias. Compruebala antes de usarla: en una maquina de
 * desarrollo puede apuntar a un ambiente real, y por eso el comando muestra la base a la
 * que se conecta (sin la contrasena) y no borra nada si no se le pide con `--aplicar`.
 *
 * Cada cuanto: la primera constancia es de octubre de 2026 y no cumple 10 anos hasta
 * octubre de 2036, asi que no hay nada que borrar antes. Despues, una vez al ano basta.
 */
async function main(): Promise<void> {
  const { aplicar, url: urlPasada } = leerLasOpcionesDeLaPurga(process.argv.slice(2));

  if (urlPasada === undefined && process.env['DIRECT_URL'] === undefined && existsSync('.env')) {
    process.loadEnvFile('.env');
  }

  const url = urlPasada ?? process.env['DIRECT_URL'];

  if (url === undefined || url.trim() === '') {
    throw new Error('Falta la cadena de conexion del dueno de las tablas (DIRECT_URL).');
  }

  // Estos comandos imprimen la contrasena como ***, y es facil copiar esa version en vez
  // de la real. El sintoma seria un fallo de autenticacion que parece otra cosa.
  if (url.includes(':***@')) {
    throw new Error(
      'La cadena trae *** donde va la contrasena. Es lo que imprimen estos comandos para ' +
        'ocultarla, no un valor real.',
    );
  }

  console.log(`Base: ${url.replace(/:\/\/([^:]+):[^@]+@/, '://$1:***@')}`);
  console.log(aplicar ? 'Modo: APLICANDO\n' : 'Modo: simulacro (no se borra nada)\n');

  const cliente = new Client({ connectionString: url });

  await cliente.connect();

  try {
    const informe = await purgarConstancias(cliente, { ahora: new Date(), aplicar });

    console.log(
      `Constancias dadas de baja antes de ${informe.limite.toISOString()} ` +
        `(mas de ${ANIOS_DE_CONSERVACION_DE_LA_CONSTANCIA} anos):`,
    );
    console.log(`  cuentas:          ${informe.cuentas}`);
    console.log(`  consentimientos:  ${informe.consentimientos}`);
    console.log(
      informe.aplicada
        ? '\nBorradas.'
        : '\nNo se borro nada. Para borrar de verdad, repite el comando con --aplicar.',
    );
  } finally {
    await cliente.end();
  }
}

main().catch((error: unknown) => {
  // Sin traza: el mensaje ya dice que hacer, y una traza es ruido para quien corre esto
  // una vez al ano. Un error de conexion puede traer la direccion, nunca la contrasena.
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = error instanceof SinPermisoParaLaPurgaError ? 2 : 1;
});
