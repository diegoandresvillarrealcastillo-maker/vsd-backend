/**
 * Deja un ambiente listo de una sola vez: migraciones, rol y comprobacion.
 *
 * ---------------------------------------------------------------------------
 * Por que existe
 * ---------------------------------------------------------------------------
 *
 * Preparar PRE y PROD son tres comandos en un orden que importa —el rol
 * `vsd_app` lo crea una migracion, asi que darle contrasena antes no funciona—
 * y hay que repetirlos por ambiente. Seis oportunidades de equivocarse en algo
 * que se hace dos veces en la vida del proyecto y nadie recuerda.
 *
 * Esto los encadena y para en cuanto uno falla.
 *
 * ---------------------------------------------------------------------------
 * Como se usa
 * ---------------------------------------------------------------------------
 *
 *   VSD_APP_PASSWORD='la-que-genere-el-gestor' \
 *     npm run db:preparar -- "postgresql://postgres.xxx:...@...pooler...:5432/postgres"
 *
 * En PowerShell:
 *
 *   $env:VSD_APP_PASSWORD = 'la-que-genere-el-gestor'
 *   npm run db:preparar -- "postgresql://postgres.xxx:...@...pooler...:5432/postgres"
 *   Remove-Item Env:\VSD_APP_PASSWORD
 *
 * La cadena es la del **dueno de las tablas**, la misma que usan las
 * migraciones. Contra Supabase es la del session pooler, no la directa: la
 * directa solo resuelve por IPv6.
 *
 * Guarda la contrasena en el gestor del equipo **antes** de ejecutar esto.
 * Aqui no se imprime, no se registra y no se guarda en ningun sitio.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const contrasena = process.env.VSD_APP_PASSWORD;
const url = process.argv[2];

if (!url) {
  console.error('Falta la cadena de conexion del dueno de las tablas.');
  console.error('Mira el comentario de arriba de este archivo.');
  process.exit(1);
}

if (!contrasena) {
  console.error('Falta VSD_APP_PASSWORD.');
  console.error('Mira el comentario de arriba de este archivo.');
  process.exit(1);
}

// La salida de estos scripts enmascara la contrasena como ***, y es facil
// copiar esa version en vez de la real. El sintoma seria un fallo de
// autenticacion que parece un problema de credenciales sin serlo.
if (url.includes(':***@')) {
  console.error('La cadena trae *** donde va la contrasena.');
  console.error('Eso es lo que imprimen estos scripts para ocultarla, no un valor real.');
  console.error('Copiala del panel de Supabase y sustituye [YOUR-PASSWORD] por la tuya.');
  process.exit(1);
}

const sinSecreto = url.replace(/:\/\/([^:]+):[^@]+@/, '://$1:***@');

// Un despiste que cuesta caro: preparar PRE creyendo que es PROD, o al reves.
// Enseñar el destino antes de tocarlo es barato.
console.log('='.repeat(70));
console.log(`Preparando: ${sinSecreto}`);
console.log('='.repeat(70));

/**
 * Ejecuta un paso y corta la ejecucion entera si falla.
 *
 * La cadena de conexion viaja siempre por variable de entorno y nunca como
 * argumento. Un argumento se ve en la lista de procesos de la maquina, y esa
 * cadena lleva dentro la contrasena del dueno de las tablas. Es el mismo
 * motivo por el que `VSD_APP_PASSWORD` tampoco se pasa como argumento.
 *
 * Nunca se activa `shell`. Con el, Node avisa —con razon— de que los
 * argumentos se concatenan sin escapar, y no hace falta: los tres pasos se
 * lanzan con `node` sobre un archivo .js concreto.
 */
function paso(titulo, comando, argumentos, variables) {
  console.log(`\n--- ${titulo} ---\n`);

  const resultado = spawnSync(comando, argumentos, {
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, ...variables },
  });

  if (resultado.status !== 0) {
    console.error(`\nFallo en: ${titulo}. No se continua.`);
    process.exit(resultado.status ?? 1);
  }
}

// 1. Las migraciones primero, porque son las que crean el rol vsd_app. Las dos
//    variables apuntan al mismo sitio a proposito: Prisma usa DIRECT_URL para
//    migrar y DATABASE_URL para todo lo demas, y aqui quien manda es el dueno.
// Se llama al archivo de Prisma y no a `npx`. En Windows, `npx` es un .cmd y
// Node se niega a lanzarlo sin shell desde que eso se considera un riesgo;
// activar shell solo para esquivarlo seria cambiar un problema por otro.
const prisma = createRequire(import.meta.url).resolve('prisma/build/index.js');

paso('Aplicando migraciones', process.execPath, [prisma, 'migrate', 'deploy'], {
  DATABASE_URL: url,
  DIRECT_URL: url,
});

// 2. El rol de la aplicacion. Comprueba por su cuenta que no sea privilegiado
//    y que el aislamiento se le aplique.
paso('Dando acceso a vsd_app', 'node', ['scripts/dar-acceso-a-vsd-app.mjs'], {
  DIRECT_URL: url,
});

// 3. Y el informe de lo que quedo, que es lo unico que de verdad demuestra que
//    el ambiente esta listo.
paso('Comprobando el resultado', 'node', ['scripts/revisar-base.mjs'], {
  DATABASE_URL: url,
});

console.log(`\n${'='.repeat(70)}`);
console.log('Ambiente preparado.');
console.log('Guarda la contrasena de vsd_app en el gestor de secretos del despliegue.');
console.log('='.repeat(70));
