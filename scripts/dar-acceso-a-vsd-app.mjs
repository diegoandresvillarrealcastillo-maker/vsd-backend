/**
 * Le da contrasena al rol `vsd_app` en un ambiente, y comprueba que el
 * aislamiento se le aplica de verdad.
 *
 * ---------------------------------------------------------------------------
 * Por que esto es un script y no una migracion
 * ---------------------------------------------------------------------------
 *
 * La migracion crea `vsd_app` con NOLOGIN a proposito. Si le pusiera
 * contrasena, esa contrasena estaria en Git, en el historial, y en la copia
 * que tiene cada persona del repositorio. Darsela es por eso un paso manual
 * por ambiente.
 *
 * ---------------------------------------------------------------------------
 * Como se usa
 * ---------------------------------------------------------------------------
 *
 * La contrasena entra por variable de entorno y no por argumento: los
 * argumentos quedan en el historial de la terminal y se ven en la lista de
 * procesos.
 *
 *   VSD_APP_PASSWORD='la-que-genere-el-gestor' \
 *     node scripts/dar-acceso-a-vsd-app.mjs "postgresql://postgres.xxx:...@..."
 *
 * En PowerShell:
 *
 *   $env:VSD_APP_PASSWORD = 'la-que-genere-el-gestor'
 *   node scripts/dar-acceso-a-vsd-app.mjs "postgresql://postgres.xxx:...@..."
 *   Remove-Item Env:\VSD_APP_PASSWORD
 *
 * Sin cadena de conexion usa DIRECT_URL del .env, que es la del dueno de las
 * tablas: es la unica que puede alterar un rol.
 *
 * La contrasena no se imprime, no se registra y no se guarda en ningun sitio.
 * Guardala en el gestor de contrasenas del equipo antes de ejecutar esto,
 * porque despues no hay forma de recuperarla.
 */
import { existsSync } from 'node:fs';

import { Client } from 'pg';

const contrasena = process.env.VSD_APP_PASSWORD;

if (!contrasena) {
  console.error('Falta VSD_APP_PASSWORD. Mira el comentario de arriba de este archivo.');
  process.exit(1);
}

if (contrasena.length < 16) {
  // No es burocracia: esta credencial vive en el gestor de secretos del
  // proveedor de despliegue y nadie la escribe nunca a mano, asi que no hay
  // ninguna razon para que sea corta.
  console.error('La contrasena tiene menos de 16 caracteres. Genera una larga: no se teclea.');
  process.exit(1);
}

if (!process.argv[2] && !process.env.DIRECT_URL && existsSync('.env')) {
  process.loadEnvFile('.env');
}

const urlDelDueno = process.argv[2] ?? process.env.DIRECT_URL;

if (!urlDelDueno) {
  console.error('Falta la cadena de conexion del dueno de las tablas.');
  process.exit(1);
}

// La salida de estos scripts enmascara la contrasena como ***, y es facil
// copiar esa version en vez de la real. El sintoma seria un fallo de
// autenticacion que parece un problema de credenciales sin serlo.
if (urlDelDueno.includes(':***@')) {
  console.error('La cadena trae *** donde va la contrasena.');
  console.error('Eso es lo que imprimen estos scripts para ocultarla, no un valor real.');
  console.error('Copiala del panel de Supabase y sustituye [YOUR-PASSWORD] por la tuya.');
  process.exit(1);
}

const sinSecreto = urlDelDueno.replace(/:\/\/([^:]+):[^@]+@/, '://$1:***@');
console.log(`Ambiente: ${sinSecreto}\n`);

const dueno = new Client({ connectionString: urlDelDueno });
await dueno.connect();

// ---------- 1. El rol tiene que existir ya ----------
const { rows: existe } = await dueno.query(`SELECT 1 FROM pg_roles WHERE rolname = 'vsd_app'`);

if (existe.length === 0) {
  console.error('El rol vsd_app no existe en esta base. Aplica primero las migraciones.');
  await dueno.end();
  process.exit(1);
}

// ---------- 2. Darle la contrasena ----------
// ALTER ROLE no admite parametros, asi que la contrasena tiene que acabar
// dentro del texto de la sentencia. Escaparla aqui a mano seria una inyeccion
// esperando a una comilla, de modo que se le pide a PostgreSQL que la escape
// el con format(%L) en una consulta normal —que si acepta parametros— y solo
// despues se ejecuta lo que devuelve.
const { rows: preparada } = await dueno.query(
  `SELECT format('ALTER ROLE vsd_app WITH LOGIN PASSWORD %L', $1::text) AS sentencia`,
  [contrasena],
);

await dueno.query(preparada[0].sentencia);

console.log('vsd_app ya puede entrar.');

// ---------- 3. Comprobar que NO es privilegiado ----------
const { rows: privilegios } = await dueno.query(`
  SELECT rolsuper, rolbypassrls, rolcreaterole, rolcreatedb
    FROM pg_roles WHERE rolname = 'vsd_app'
`);

const p = privilegios[0];
const problemas = [];
if (p.rolsuper) problemas.push('es superusuario');
if (p.rolbypassrls) problemas.push('tiene BYPASSRLS');
if (p.rolcreaterole) problemas.push('puede crear roles');
if (p.rolcreatedb) problemas.push('puede crear bases');

if (problemas.length > 0) {
  console.error(`\nvsd_app ${problemas.join(', ')}. El aislamiento no se le aplicaria.`);
  await dueno.end();
  process.exit(1);
}

console.log('vsd_app no es superusuario, no salta RLS y no puede crear nada.');

// ---------- 4. Comprobar el aislamiento de verdad ----------
// Hasta aqui todo son propiedades declaradas. Esto es la prueba: se conecta
// como vsd_app, se hace pasar por una persona y se comprueba que no ve las
// filas de otra. Si esto pasara, el ambiente no esta bien preparado por muy
// bien que se vea todo lo anterior.
const urlDeLaApp = new URL(urlDelDueno);

// El pooler de Supabase no sabe a que proyecto va una conexion mirando el
// host: todos los proyectos de una region comparten el mismo. Lo deduce del
// usuario, que por eso viene como `postgres.<referencia-del-proyecto>`.
//
// Cambiar el usuario a `vsd_app` a secas tira esa referencia y el pooler
// responde "no tenant identifier provided", que no tiene nada que ver con la
// contrasena aunque lo parezca. Hay que conservar el sufijo.
//
// Contra PostgreSQL directo —local, Docker, el contenedor del CI— el usuario
// no lleva sufijo y no hay nada que conservar.
const [, referenciaDelProyecto] = decodeURIComponent(urlDeLaApp.username).split('.');

urlDeLaApp.username =
  referenciaDelProyecto === undefined ? 'vsd_app' : `vsd_app.${referenciaDelProyecto}`;
urlDeLaApp.password = contrasena;

console.log(`Comprobando el aislamiento como "${urlDeLaApp.username}"...`);

const app = new Client({ connectionString: urlDeLaApp.toString() });

try {
  await app.connect();
} catch (error) {
  console.error(`\nvsd_app no pudo conectarse: ${error.message}`);
  console.error(`Se intento con el usuario "${urlDeLaApp.username}".`);
  console.error('La contrasena SI quedo puesta: lo que fallo es esta comprobacion.');
  await dueno.end();
  process.exit(1);
}

// El dueno esta exento de las politicas, asi que lo que el cuenta es el total
// real. Es la referencia contra la que se compara.
const { rows: totales } = await dueno.query(`
  SELECT (SELECT count(*)::int FROM "resultado")       AS resultados,
         (SELECT count(*)::int FROM "entrada_diario")  AS entradas
`);

// Un identificador que no es de nadie. Quien se hace pasar por el no deberia
// ver una sola fila ajena.
const nadie = '00000000-0000-4000-8000-0000000000aa';

await app.query('BEGIN');
await app.query(`SELECT set_config('vsd.usuario_actual', $1, true)`, [nadie]);

const { rows: vistas } = await app.query(`
  SELECT (SELECT count(*)::int FROM "resultado")      AS resultados,
         (SELECT count(*)::int FROM "entrada_diario") AS entradas
`);

// El catalogo si tiene que leerse: son contenidos publicos.
const { rows: catalogo } = await app.query(`SELECT count(*)::int AS n FROM "actividad"`);

await app.query('ROLLBACK');
await app.end();
await dueno.end();

const filasReales = totales[0].resultados + totales[0].entradas;
const filasVistas = vistas[0].resultados + vistas[0].entradas;

console.log(`Filas de personas en la base:        ${filasReales}`);
console.log(`Las que ve vsd_app siendo un extrano: ${filasVistas} (tiene que ser 0)`);
console.log(`Actividades del catalogo visibles:   ${catalogo[0].n}`);

if (filasVistas !== 0) {
  console.error('\nEL AISLAMIENTO NO ESTA FUNCIONANDO en este ambiente.');
  process.exit(1);
}

if (filasReales === 0) {
  // Honestidad: con la base vacia, "ve 0 filas" tambien seria cierto si las
  // politicas estuvieran apagadas. La comprobacion no demuestra nada todavia.
  console.log(
    '\nAviso: no habia ninguna fila de persona con la que comprobarlo.\n' +
      'Que vea 0 no prueba nada mientras la base este vacia; las pruebas de\n' +
      'integracion del CI si lo comprueban con datos de verdad.',
  );
}

if (catalogo[0].n === 0) {
  console.error('\nEl catalogo esta vacio o vsd_app no puede leerlo. Revisa las migraciones.');
  process.exit(1);
}

console.log('\nAmbiente listo. Guarda la contrasena en el gestor de secretos del despliegue.');
