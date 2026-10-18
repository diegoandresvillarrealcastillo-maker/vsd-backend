import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { Detenido, generarLaPublicacion } from './publicacion.ts';

/**
 * Convierte las respuestas de las hojas de revision en la migracion que publica lo revisado (SCRUM-228).
 *
 *   node src/pruebas/catalogo/revision/publicar-cli.ts <respuestas.txt> [otra.txt ...] [opciones]
 *
 * Opciones:
 *   --fecha=2026-10-23T10:00:00-05:00   pisa la fecha de cada hoja (con zona)
 *   --exigir-todo                       detiene si alguna mecanica queda sin marcar
 *   --escribir=20261024120000_publicar_el_catalogo_revisado
 *                                       escribe `prisma/migrations/<nombre>/migration.sql` en lugar de imprimir
 *
 * Una hoja por persona que reviso. Sin `--escribir`, el SQL sale por la salida estandar y el resumen por la de
 * errores. Con `--escribir`, el nombre tiene que ser posterior a la ultima migracion y no existir todavia: no
 * pisa nada ni escribe una migracion fuera de orden.
 *
 * No toca ninguna base: la migracion que escribe la aplica una persona, por PR, como las demas.
 */
const argumentos = process.argv.slice(2);
const archivos = argumentos.filter((a) => !a.startsWith('--'));
const opcion = (nombre: string): string | undefined =>
  argumentos.find((a) => a.startsWith(`--${nombre}=`))?.slice(nombre.length + 3);

if (archivos.length === 0) {
  process.stderr.write(
    'Uso: node src/pruebas/catalogo/revision/publicar-cli.ts <respuestas.txt> [...] [--fecha=...] [--exigir-todo] [--escribir=<migracion>]\n',
  );
  process.exit(1);
}

try {
  const resultado = generarLaPublicacion(
    archivos.map((archivo) => readFileSync(archivo, 'utf8')),
    { fecha: opcion('fecha'), exigirTodo: argumentos.includes('--exigir-todo') },
  );
  const destino = opcion('escribir');

  if (destino === undefined) {
    process.stdout.write(resultado.sql);
  } else {
    const carpeta = fileURLToPath(new URL('../../../../prisma/migrations', import.meta.url));
    const ultima = readdirSync(carpeta)
      .filter((nombre) => /^\d{14}_/u.test(nombre))
      .sort()
      .at(-1);

    if (!/^\d{14}_[a-z0-9_]+$/u.test(destino)) {
      throw new Detenido(
        `El nombre de la migracion "${destino}" tiene que ser AAAAMMDDhhmmss_texto_en_minusculas.`,
      );
    }

    if (ultima !== undefined && destino.slice(0, 14) <= ultima.slice(0, 14)) {
      throw new Detenido(
        `La migracion "${destino}" no es posterior a la ultima (${ultima}): una migracion fuera de orden no se aplica bien.`,
      );
    }

    if (existsSync(join(carpeta, destino))) {
      throw new Detenido(`Ya existe prisma/migrations/${destino}: no se pisa.`);
    }

    mkdirSync(join(carpeta, destino), { recursive: true });
    writeFileSync(join(carpeta, destino, 'migration.sql'), resultado.sql, 'utf8');
    process.stderr.write(`Escrita prisma/migrations/${destino}/migration.sql\n`);
  }

  const resumen = [
    `Publica ${String(resultado.publicadas)} sesion(es):`,
    ...resultado.porMecanica.map(
      (m) =>
        `  ${m.codigo}: ${String(m.publicadas)} (revision de ${m.revisor})${m.sinSalir > 0 ? `, ${String(m.sinSalir)} no sale(n)` : ''}`,
    ),
    ...(resultado.pendientes.length === 0
      ? []
      : [
          `Quedan pendientes y sin publicar (${String(resultado.pendientes.length)}):`,
          ...resultado.pendientes.map((p) => `  ${p.codigo}: ${p.motivo}`),
        ]),
    ...resultado.avisos.map((a) => `AVISO: ${a}`),
  ];

  process.stderr.write(`${resumen.join('\n')}\n`);
} catch (error) {
  if (error instanceof Detenido) {
    process.stderr.write(`DETENIDO: ${error.message}\n`);
    process.exit(2);
  }

  throw error;
}
