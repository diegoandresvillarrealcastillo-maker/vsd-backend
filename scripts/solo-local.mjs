/**
 * Corre una orden de Prisma de desarrollo, y solo contra una base de esta maquina (SCRUM-265).
 *
 * ---------------------------------------------------------------------------
 * Por que existe
 * ---------------------------------------------------------------------------
 *
 * `prisma.config.ts` lee `DIRECT_URL` del `.env`, y en el `.env` real de quien opera el proyecto esa
 * variable apunta a preproduccion: es la que usan las migraciones de verdad. Con eso, `prisma migrate
 * dev` (que crea una base sombra y puede proponer borrarlo todo) y Prisma Studio (que escribe) salian
 * hacia PRE desde una maquina de desarrollo sin que nada lo impidiera.
 *
 * Esto las encadena a una base local:
 *
 * - Lee `DIRECT_URL` **solo** de `.env.desarrollo` (un archivo aparte, ignorado por Git). Sin ese
 *   archivo usa la base local de siempre: `postgresql://vsd:vsd_local@localhost:5432/vsd_health`.
 * - No mira el `.env` ni una `DIRECT_URL` que haya en la terminal.
 * - Si la URL no es de esta maquina, se niega antes de lanzar nada. El mensaje no la repite: trae la
 *   contrasena, y el servidor diria a que ambiente se estuvo a punto de llegar.
 *
 * `npm run db:aplicar` y `npm run db:estado` siguen leyendo el `.env`: son las que una persona usa
 * contra PRE y PROD, y no destruyen nada.
 *
 * shortcut: solo compara el NOMBRE del servidor. Un tunel (`ssh -L 5432:...`) o un reenvio de puertos
 * hacia una base remota se ve como `localhost` y pasa. No hay forma de saberlo desde aqui; si hace
 * falta, lo que cierra el hueco es una cuenta de base de datos sin permisos en PRE.
 *
 * ---------------------------------------------------------------------------
 * Como se usa
 * ---------------------------------------------------------------------------
 *
 *   npm run db:migrar -- --name lo_que_cambia
 *   npm run db:ver
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { parseEnv } from 'node:util';

/** La base local de `npm run db:local` y de Docker. */
export const URL_LOCAL_POR_OMISION =
  'postgresql://vsd:vsd_local@localhost:5432/vsd_health?schema=public';

const ARCHIVO_DE_DESARROLLO = '.env.desarrollo';

const HOSTS_DE_ESTA_MAQUINA = new Set(['localhost', '127.0.0.1', '::1']);

/** Parametros de la URL con los que el cliente cambia de servidor aunque el de la URL sea local. */
const PARAMETROS_QUE_CAMBIAN_DE_SERVIDOR = ['host', 'hostaddr', 'service'];

/** Si la URL apunta a esta maquina. Compara el nombre entero: `localhost.ejemplo.com` no lo es. */
export function esDeEstaMaquina(url) {
  let partes;

  try {
    partes = new URL(url);
  } catch {
    return false;
  }

  const host = partes.hostname.toLowerCase().replace(/^\[(.*)\]$/u, '$1');

  return (
    HOSTS_DE_ESTA_MAQUINA.has(host) &&
    !PARAMETROS_QUE_CAMBIAN_DE_SERVIDOR.some((nombre) => partes.searchParams.has(nombre))
  );
}

/**
 * La `DIRECT_URL` con la que corre la orden: la de `.env.desarrollo` si trae una, y si no la local.
 * Lanza si no es de esta maquina.
 *
 * @param textoDelArchivo El contenido de `.env.desarrollo`, o `undefined` si no existe.
 */
export function urlDeDesarrollo(textoDelArchivo) {
  const propia =
    textoDelArchivo === undefined ? undefined : parseEnv(textoDelArchivo)['DIRECT_URL']?.trim();
  const url = propia === undefined || propia === '' ? URL_LOCAL_POR_OMISION : propia;

  if (!esDeEstaMaquina(url)) {
    throw new Error(
      `La DIRECT_URL de ${ARCHIVO_DE_DESARROLLO} no es de esta maquina. ` +
        'Estas ordenes solo trabajan con una base local (localhost, 127.0.0.1 o ::1). ' +
        'Para PRE o PROD usa npm run db:aplicar o npm run db:estado.',
    );
  }

  return url;
}

function principal() {
  const argumentos = process.argv.slice(2);

  if (argumentos.length === 0) {
    throw new Error('Falta la orden de Prisma: node scripts/solo-local.mjs migrate dev');
  }

  const texto = existsSync(ARCHIVO_DE_DESARROLLO)
    ? readFileSync(ARCHIVO_DE_DESARROLLO, 'utf8')
    : undefined;
  const url = urlDeDesarrollo(texto);

  // `dotenv/config` de prisma.config.ts no pisa una variable que ya existe: la de aqui gana al `.env`.
  const resultado = spawnSync('npx', ['prisma', ...argumentos], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, DIRECT_URL: url },
  });

  process.exitCode = resultado.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    principal();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
