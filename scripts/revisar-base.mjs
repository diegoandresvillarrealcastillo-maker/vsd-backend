/**
 * Informe del estado real de una base de VSD Health.
 *
 * No consulta el esquema de Prisma ni las migraciones: pregunta a PostgreSQL
 * que tiene de verdad. Es la diferencia entre "deberia estar" y "esta".
 *
 * Uso:  node revisar-base.mjs "postgresql://..."
 * Si no se pasa URL, usa DATABASE_URL del entorno.
 */
import { existsSync } from 'node:fs';

import { Client } from 'pg';

// Si no se pasa una cadena, se lee la del .env local. Asi el caso habitual
// —revisar la base de desarrollo— no obliga a escribir nada, y revisar PRE o
// PROD es pasar su cadena como argumento sin tocar ningun archivo.
if (!process.argv[2] && !process.env.DATABASE_URL && existsSync('.env')) {
  process.loadEnvFile('.env');
}

const url = process.argv[2] ?? process.env.DATABASE_URL;

if (!url) {
  console.error('Falta la cadena de conexion.');
  process.exit(1);
}

// Nunca se imprime la contrasena, ni siquiera por accidente en un error.
const sinSecreto = url.replace(/:\/\/([^:]+):[^@]+@/, '://$1:***@');
console.log(`Base: ${sinSecreto}\n`);

const cliente = new Client({ connectionString: url });
await cliente.connect();

const TABLAS_ESPERADAS = [
  'usuario',
  'categoria',
  'actividad',
  'resultado',
  'recurso_apoyo',
  'entrada_diario',
];

// ---------- 1. Tablas ----------
const { rows: tablas } = await cliente.query(`
  SELECT c.relname AS tabla,
         c.relrowsecurity   AS rls_activo,
         c.relforcerowsecurity AS rls_forzado,
         (SELECT count(*) FROM pg_policies p
           WHERE p.schemaname = 'public' AND p.tablename = c.relname) AS politicas
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind = 'r'
     AND c.relname <> '_prisma_migrations'
   ORDER BY c.relname
`);

console.log('TABLAS');
console.log('tabla'.padEnd(16), 'RLS'.padEnd(6), 'FORCE'.padEnd(7), 'politicas');
for (const t of tablas) {
  console.log(
    t.tabla.padEnd(16),
    (t.rls_activo ? 'si' : 'NO').padEnd(6),
    (t.rls_forzado ? 'si' : 'no').padEnd(7),
    String(t.politicas),
  );
}

const encontradas = tablas.map((t) => t.tabla);
const faltan = TABLAS_ESPERADAS.filter((t) => !encontradas.includes(t));
console.log(
  faltan.length === 0
    ? `\nLas ${TABLAS_ESPERADAS.length} tablas esperadas estan.`
    : `\nFALTAN: ${faltan.join(', ')}`,
);

const sinRls = tablas.filter((t) => !t.rls_activo).map((t) => t.tabla);
console.log(sinRls.length === 0 ? 'Todas tienen RLS activo.' : `SIN RLS: ${sinRls.join(', ')}`);

// ---------- 2. Migraciones aplicadas ----------
const { rows: migraciones } = await cliente.query(`
  SELECT migration_name, finished_at, rolled_back_at
    FROM _prisma_migrations
   ORDER BY started_at
`);

console.log('\nMIGRACIONES APLICADAS');
for (const m of migraciones) {
  const estado = m.rolled_back_at
    ? 'REVERTIDA'
    : m.finished_at
      ? m.finished_at.toISOString().slice(0, 16).replace('T', ' ')
      : 'SIN TERMINAR';
  console.log(` ${m.migration_name.padEnd(42)} ${estado}`);
}

// ---------- 3. El rol de la aplicacion ----------
const { rows: roles } = await cliente.query(`
  SELECT rolname, rolcanlogin, rolsuper, rolbypassrls
    FROM pg_roles WHERE rolname = 'vsd_app'
`);

console.log('\nROL DE LA APLICACION');
if (roles.length === 0) {
  console.log(' vsd_app NO EXISTE');
} else {
  const r = roles[0];
  console.log(
    ` vsd_app  puede entrar: ${r.rolcanlogin ? 'si' : 'no (falta darle contrasena)'}` +
      `  superusuario: ${r.rolsuper ? 'SI (mal)' : 'no'}` +
      `  salta RLS: ${r.rolbypassrls ? 'SI (mal)' : 'no'}`,
  );
}

// ---------- 4. Contenido del catalogo ----------
const { rows: recursos } = await cliente.query(
  `SELECT titulo, cobertura FROM recurso_apoyo ORDER BY titulo`,
);
console.log(`\nRECURSOS DE APOYO SEMBRADOS: ${recursos.length}`);
for (const r of recursos) {
  console.log(` - ${r.titulo}${r.cobertura ? ` (${r.cobertura})` : ''}`);
}

// ---------- 5. Datos de personas ----------
for (const tabla of ['usuario', 'resultado', 'entrada_diario']) {
  const { rows } = await cliente.query(`SELECT count(*)::int AS n FROM "${tabla}"`);
  console.log(`Filas en ${tabla}: ${rows[0].n}`);
}

await cliente.end();
