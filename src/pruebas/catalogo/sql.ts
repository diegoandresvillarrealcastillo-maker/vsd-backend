import type { Lote, MecanicaDeContenido, SesionDeContenido } from './tipos.ts';

/**
 * El SQL de un lote de contenido (SCRUM-222 a SCRUM-224).
 *
 * Las migraciones que siembran contenido son **solo de datos, aditivas e idempotentes**: los `INSERT`
 * ignoran un identificador ya sembrado (`ON CONFLICT DO NOTHING`), asi que aplicarlas dos veces deja lo
 * mismo, y lo que alguien retire despues (`publicado = FALSE`) no se vuelve a publicar solo.
 *
 * Primero la mecanica y despues sus sesiones: una sesion necesita su actividad.
 */

/** Un texto SQL entre comillas simples, con las comillas internas dobladas. */
export function literal(texto: string): string {
  return `'${texto.replaceAll("'", "''")}'`;
}

const numero = (valor: number): string =>
  Number.isInteger(valor) ? String(valor) : valor.toFixed(2);

/** El JSON de `parametros`, en una linea, como `jsonb`. */
export function jsonb(valor: unknown): string {
  return `${literal(JSON.stringify(valor))}::jsonb`;
}

function filaDeMecanica(m: MecanicaDeContenido): string {
  const nulo = (valor: string | null) => (valor === null ? 'NULL' : valor);

  return [
    '  (',
    `    ${literal(m.id)},`,
    `    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = ${literal(m.categoria)}),`,
    `    ${literal(m.nombre)},`,
    `    ${literal(m.tipo)},`,
    `    ${literal(m.descripcion)},`,
    '    TRUE,',
    `    ${literal(m.direccion)},`,
    `    ${nulo(m.maximo === null ? null : numero(m.maximo))},`,
    `    ${nulo(m.umbrales === null ? null : jsonb(m.umbrales))},`,
    `    ${nulo(m.textosNivel === null ? null : jsonb(m.textosNivel))},`,
    "    'rotativa',",
    `    ${literal(m.motor)},`,
    `    ${nulo(m.franja === undefined ? null : literal(m.franja))}`,
    '  )',
  ].join('\n');
}

function filaDeSesion(m: MecanicaDeContenido, s: SesionDeContenido): string {
  return [
    '  (',
    `    ${literal(s.id)},`,
    `    ${literal(m.id)},`,
    `    ${literal(s.titulo)},`,
    `    ${s.nivel},`,
    `    ${jsonb(s.parametros)},`,
    `    ${m.publicar ? 'TRUE' : 'FALSE'},`,
    `    ${literal(m.revision)}`,
    '  )',
  ].join('\n');
}

function sesionesDe(m: MecanicaDeContenido): string {
  return [
    `-- ${m.codigo} · ${m.nombre}: ${m.sesiones.length} sesiones, ${
      m.publicar ? 'PUBLICADAS' : 'SIN PUBLICAR'
    } (revision: ${m.revision}).`,
    'INSERT INTO "sesion_de_actividad" (',
    '  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"',
    ')',
    'VALUES',
    m.sesiones.map((s) => filaDeSesion(m, s)).join(',\n'),
    'ON CONFLICT ("id_sesion") DO NOTHING;',
  ].join('\n');
}

/** El SQL completo de la migracion de un lote, sin la cabecera (esa la escribe quien presenta el lote). */
export function sqlDelLote(lote: Lote, cabecera: string): string {
  const nuevas = lote.mecanicas.filter((m) => m.yaExiste !== true);
  const partes: string[] = [cabecera.trimEnd(), ''];

  if (nuevas.length > 0) {
    partes.push(
      '-- ---------------------------------------------------------------------------',
      `-- 1. Las mecanicas, PRIMERO (${nuevas.length})`,
      '-- ---------------------------------------------------------------------------',
      '',
      'INSERT INTO "actividad" (',
      '  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",',
      '  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor", "franja"',
      ')',
      'VALUES',
      nuevas.map(filaDeMecanica).join(',\n'),
      'ON CONFLICT DO NOTHING;',
      '',
    );
  }

  partes.push(
    '-- ---------------------------------------------------------------------------',
    `-- 2. Sus sesiones (${lote.mecanicas.reduce((suma, m) => suma + m.sesiones.length, 0)})`,
    '-- ---------------------------------------------------------------------------',
    '',
  );

  for (const mecanica of lote.mecanicas) {
    partes.push(sesionesDe(mecanica), '');
  }

  return `${partes.join('\n').trimEnd()}\n`;
}
