import EmbeddedPostgres from 'embedded-postgres';

/**
 * PostgreSQL local para desarrollo, sin Docker y sin permisos de
 * administrador.
 *
 * Docker Desktop en Windows exige elevacion, instalar WSL2 y reiniciar. No
 * todas las maquinas del equipo pueden hacerlo, y quedarse sin base de datos
 * local no es una opcion: las pruebas de integracion la necesitan.
 *
 * Esto descarga los binarios oficiales de PostgreSQL la primera vez y los
 * ejecuta como un proceso normal del usuario. Es PostgreSQL de verdad, no una
 * simulacion: las restricciones, los tipos y las migraciones se comportan
 * igual que en Supabase.
 *
 * Quien tenga Docker puede usar `npm run db:arriba` en su lugar. Las dos vias
 * levantan la misma base en el mismo puerto.
 *
 *   npm run db:local        arrancar
 *   Ctrl + C                parar
 *
 * ---
 *
 * NOTA SOBRE LA VERSION DEL PAQUETE
 *
 * `embedded-postgres` **solo publica versiones beta**: no existe una estable.
 * En este proyecto fijamos versiones estables a proposito, y en el Ciclo 2 nos
 * costo un rato descubrir que npm habia instalado TypeScript 7 sin avisar.
 *
 * Se acepta aqui, y solo aqui, por tres razones:
 *
 * 1. Es una dependencia **de desarrollo**. No entra en el paquete que se
 *    despliega ni la importa ningun archivo de `src/`.
 * 2. Los binarios que descarga son los oficiales de PostgreSQL. La base que
 *    levanta es PostgreSQL de verdad; lo unico beta es el envoltorio que la
 *    arranca.
 * 3. La alternativa sin permisos de administrador no existe, y quedarse sin
 *    base local significa no poder correr las pruebas de integracion.
 *
 * Si alguna vez falla, el camino de Docker sigue ahi y es el mismo puerto.
 */

const PUERTO = 5432;
const BASE = 'vsd_health';

const postgres = new EmbeddedPostgres({
  databaseDir: './.postgres-local',
  user: 'vsd',
  password: 'vsd_local',
  port: PUERTO,
  persistent: true,
});

console.log('Preparando PostgreSQL local...');
console.log('La primera vez descarga los binarios y tarda un poco.');

await postgres.initialise();
await postgres.start();

try {
  await postgres.createDatabase(BASE);
  console.log(`Base "${BASE}" creada.`);
} catch {
  // Ya existia de una ejecucion anterior. El directorio es persistente a
  // proposito: no queremos perder los datos de desarrollo cada vez.
  console.log(`Base "${BASE}" ya existia.`);
}

console.log('');
console.log(`PostgreSQL escuchando en localhost:${PUERTO}`);
console.log('Siguiente paso:  npm run db:aplicar');
console.log('Para parar:      Ctrl + C');

// Se cierra ordenadamente para que el siguiente arranque no encuentre la base
// en un estado a medias.
for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, () => {
    console.log('\nParando PostgreSQL...');
    void postgres.stop().then(() => process.exit(0));
  });
}
