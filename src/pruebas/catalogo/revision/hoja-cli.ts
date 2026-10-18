import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { htmlDeLaHoja } from './hoja.ts';
import { mecanicasPorRevisar, type MecanicaPorRevisar } from './porRevisar.ts';

/**
 * Escribe las hojas de revision del catalogo (SCRUM-228).
 *
 *   node src/pruebas/catalogo/revision/hoja-cli.ts <carpeta-de-salida>
 *   node src/pruebas/catalogo/revision/hoja-cli.ts <carpeta> --mecanicas=BIE-02,EMO-03 --nombre=hoja-de-fisioterapia
 *
 * Sin opciones escribe una hoja por modulo (Cognicion, Bienestar y Emociones). Con `--mecanicas` escribe una sola
 * hoja con esas mecanicas: sirve para dar a cada persona solo lo suyo (la de fisioterapia, solo BIE-02).
 *
 * Solo escribe archivos HTML en la carpeta que se le da: no toca ninguna base ni ningun repositorio.
 */
const MODULOS: readonly { categoria: MecanicaPorRevisar['categoria']; archivo: string }[] = [
  { categoria: 'Cognición', archivo: 'hoja-de-revision-cognicion' },
  { categoria: 'Bienestar', archivo: 'hoja-de-revision-bienestar' },
  { categoria: 'Emociones', archivo: 'hoja-de-revision-emociones' },
];

const argumentos = process.argv.slice(2);
const carpeta = argumentos.find((a) => !a.startsWith('--'));
const opcion = (nombre: string): string | undefined =>
  argumentos.find((a) => a.startsWith(`--${nombre}=`))?.slice(nombre.length + 3);

if (carpeta === undefined) {
  process.stderr.write(
    'Uso: node src/pruebas/catalogo/revision/hoja-cli.ts <carpeta-de-salida> [--mecanicas=BIE-02,EMO-03] [--nombre=archivo]\n',
  );
  process.exit(1);
}

const todas = mecanicasPorRevisar();
const destino = resolve(carpeta);

mkdirSync(destino, { recursive: true });

function escribir(archivo: string, titulo: string, mecanicas: readonly MecanicaPorRevisar[]): void {
  const ruta = join(destino, `${archivo}.html`);
  const sesiones = mecanicas.reduce((suma, m) => suma + m.sesiones.length, 0);

  writeFileSync(ruta, htmlDeLaHoja({ titulo, mecanicas }), 'utf8');
  process.stdout.write(
    `${ruta}: ${String(mecanicas.length)} mecanicas, ${String(sesiones)} sesiones\n`,
  );
}

const pedidas = opcion('mecanicas');

if (pedidas === undefined) {
  for (const { categoria, archivo } of MODULOS) {
    escribir(
      archivo,
      `Hoja de revisión: ${categoria}`,
      todas.filter((m) => m.categoria === categoria),
    );
  }
} else {
  const codigos = pedidas.split(',').map((c) => c.trim().toUpperCase());
  const desconocidas = codigos.filter((c) => !todas.some((m) => m.codigo === c));

  if (desconocidas.length > 0) {
    process.stderr.write(`No hay nada por revisar en: ${desconocidas.join(', ')}\n`);
    process.exit(2);
  }

  escribir(
    opcion('nombre') ?? 'hoja-de-revision',
    'Hoja de revisión del catálogo',
    todas.filter((m) => codigos.includes(m.codigo)),
  );
}
