import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { sqlDe, todosLosLotes } from './lotes.ts';

/**
 * Escribe las migraciones que siembran el contenido del catalogo (SCRUM-222 a SCRUM-224).
 *
 *   node src/pruebas/catalogo/generar.ts
 *
 * Node 24 ejecuta TypeScript directamente, sin compilar: por eso los modulos de esta carpeta se importan con
 * la extension `.ts` y no usan nada del dominio. Las migraciones que escribe se versionan; lo que no se
 * versiona es la forma de hacerlas. La prueba `catalogo.spec.ts` falla si alguien cambia el contenido y no
 * vuelve a generar.
 *
 * Una sesion que ya se sembro no se edita (ADR 0030): si cambia, se retira y se agrega otra con otro
 * identificador. Esto sobrescribe el archivo de la migracion, asi que **solo se usa mientras la migracion
 * no se haya aplicado en ningun ambiente**.
 */
const carpeta = fileURLToPath(new URL('../../../prisma/migrations', import.meta.url));

for (const lote of todosLosLotes()) {
  const destino = join(carpeta, lote.lote.migracion);

  mkdirSync(destino, { recursive: true });
  writeFileSync(join(destino, 'migration.sql'), sqlDe(lote), 'utf8');

  const sesiones = lote.lote.mecanicas.reduce((suma, m) => suma + m.sesiones.length, 0);

  process.stdout.write(
    `${lote.lote.migracion}: ${lote.lote.mecanicas.length} mecanicas, ${sesiones} sesiones\n`,
  );
}
