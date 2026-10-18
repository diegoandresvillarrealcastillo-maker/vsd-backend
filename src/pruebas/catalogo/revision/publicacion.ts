import { mecanicasPorRevisar, type MecanicaPorRevisar } from './porRevisar.ts';

/**
 * De las respuestas de la hoja de revision a **una** migracion que publica lo revisado (SCRUM-228, ADR 0030).
 *
 * Quien revisa llena la hoja (`hoja.ts`), pulsa «Copiar mis respuestas» y esas respuestas son la entrada de aqui.
 * Hay una hoja por persona: cada una dice a nombre de quien es y cuando termino, y cada sentencia del SQL lleva
 * **esa** persona y **esa** fecha, porque es lo que queda en `revisada_por` y `revisada_el`.
 *
 * ## No inventa nada
 *
 * - Sin el nombre de quien revisa o sin la fecha, no escribe nada. **No existe una revision sin revisor.**
 * - «Aprobada con cambios» detiene todo: el texto nuevo lo escribe una persona en el contenido, no este programa.
 * - «No sale» y «Sin marcar» no generan ninguna sentencia: lo que no se aprobo queda `pendiente` y sin publicar.
 * - Una sesion que la hoja marca como «no sale» dentro de una mecanica aprobada se deja fuera, una por una.
 * - Dos hojas que aprueban la misma mecanica detienen todo: no se sabe a nombre de quien va cada sesion.
 * - Una referencia que no existe (`BIE-02-099`) o una mecanica que no esta en el catalogo detienen todo.
 *
 * Cada `UPDATE` nombra **las sesiones una por una** y exige `revision = 'pendiente'`: aplicarla dos veces no hace
 * nada la segunda vez, y no puede publicar una sesion que nadie vio. La base lo vuelve a comprobar
 * (`CHECK sesion_de_actividad_publicada_revisada`: lo que pide revision y no la tiene, no se publica).
 *
 * Solo produce texto: no toca ninguna base ni ningun repositorio. La migracion la aplica una persona.
 */

export class Detenido extends Error {}

export type Decision = 'aprobada' | 'con_cambios' | 'no_sale' | 'sin_marcar';

const DECISIONES: Readonly<Record<string, Decision>> = {
  Aprobada: 'aprobada',
  'Aprobada con cambios': 'con_cambios',
  'No sale': 'no_sale',
  'Sin marcar': 'sin_marcar',
};

/** Las seis sesiones del piloto (SCRUM-212) que revisa la hoja del piloto, con el mismo formato de fila. */
export const SESIONES_DEL_PILOTO: Readonly<Record<string, string>> = {
  'BIE-01-001': '5e510001-0000-4000-8000-000000000005',
  'BIE-01-002': '5e510001-0000-4000-8000-000000000006',
  'BIE-01-003': '5e510001-0000-4000-8000-000000000007',
  'EMO-02-001': '5e510001-0000-4000-8000-000000000008',
  'EMO-02-002': '5e510001-0000-4000-8000-000000000009',
  'EMO-02-003': '5e510001-0000-4000-8000-000000000010',
};

const MECANICA_DE_LAS_DEL_PILOTO: Readonly<Record<string, string>> = {
  'BIE-01': '0acd0000-0000-4000-8000-00000000000b',
  'EMO-02': '0acd0000-0000-4000-8000-00000000000c',
};

export interface RespuestasDeUnaHoja {
  readonly revisor: string;
  /** La fecha que dice la hoja (`AAAA-MM-DD`), si la dice. */
  readonly fecha: string | undefined;
  readonly mecanicas: Readonly<Record<string, Decision>>;
  /** Las sesiones que la hoja marca como «no sale». */
  readonly sinSalir: readonly string[];
  /** Las sesiones del piloto, si la hoja del piloto se pego junto. */
  readonly piloto: Readonly<Record<string, Decision>>;
  readonly comentarios: Readonly<Record<string, string>>;
}

const PARTE_DE_LA_DECISION = '(Aprobada con cambios|Aprobada|No sale|Sin marcar)';

export function leerLasRespuestas(texto: string): RespuestasDeUnaHoja {
  const firma = /^Revisi[oó]n a nombre de: (.*)$/mu.exec(texto);
  const fecha = /^Fecha de la revisi[oó]n: (\d{4}-\d{2}-\d{2})\s*$/mu.exec(texto);
  const mecanicas: Record<string, Decision> = {};
  const piloto: Record<string, Decision> = {};
  const sinSalir: string[] = [];
  const comentarios: Record<string, string> = {};

  for (const linea of texto.split(/\r?\n/u)) {
    const mecanica = new RegExp(
      `^((?:COG|BIE|EMO)-\\d{2}) · .*: ${PARTE_DE_LA_DECISION}$`,
      'u',
    ).exec(linea);

    if (mecanica?.[1] !== undefined && mecanica[2] !== undefined) {
      mecanicas[mecanica[1]] = DECISIONES[mecanica[2]] ?? 'sin_marcar';
      continue;
    }

    const sesion = new RegExp(
      `^((?:COG|BIE|EMO)-\\d{2}-\\d{3}) · .*: ${PARTE_DE_LA_DECISION}$`,
      'u',
    ).exec(linea);

    if (sesion?.[1] !== undefined && sesion[2] !== undefined) {
      const decision = DECISIONES[sesion[2]] ?? 'sin_marcar';

      if (sesion[1] in SESIONES_DEL_PILOTO) {
        piloto[sesion[1]] = decision;
      } else if (decision === 'no_sale') {
        sinSalir.push(sesion[1]);
      }
      continue;
    }

    const comentario = /^Comentario ((?:COG|BIE|EMO)-\d{2}(?:-\d{3})?): (.+)$/u.exec(linea);

    if (comentario?.[1] !== undefined && comentario[2] !== undefined) {
      comentarios[comentario[1]] = comentario[2].trim();
    }
  }

  return {
    revisor: firma === null ? '' : (firma[1] ?? '').trim(),
    fecha: fecha?.[1],
    mecanicas,
    sinSalir,
    piloto,
    comentarios,
  };
}

function entreComillas(valor: string): string {
  return `'${valor.replace(/'/gu, "''")}'`;
}

/** Una fecha `AAAA-MM-DD` como el momento en que se cerro la revision: mediodia en Colombia (UTC-5, sin horario de verano). */
export function momentoDeLaRevision(fecha: string): string {
  return `${fecha}T12:00:00-05:00`;
}

const MOMENTO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/u;

export interface ResultadoDeLaPublicacion {
  readonly sql: string;
  /** Cuantas sesiones publica en total. */
  readonly publicadas: number;
  readonly porMecanica: readonly {
    codigo: string;
    revisor: string;
    publicadas: number;
    sinSalir: number;
  }[];
  /** Las mecanicas que quedan pendientes y sin publicar, con el motivo. */
  readonly pendientes: readonly { codigo: string; motivo: string }[];
  readonly avisos: readonly string[];
}

export interface OpcionesDeLaPublicacion {
  /** Un momento con zona (`2026-10-23T10:00:00-05:00`) que pisa la fecha de cada hoja. */
  readonly fecha?: string | undefined;
  /** Si algo queda sin marcar, se detiene en lugar de dejarlo pendiente. */
  readonly exigirTodo?: boolean;
  /** Para las pruebas: el catalogo con el que se compara. Por omision, el real. */
  readonly catalogo?: readonly MecanicaPorRevisar[];
}

export function generarLaPublicacion(
  hojas: readonly string[],
  opciones: OpcionesDeLaPublicacion = {},
): ResultadoDeLaPublicacion {
  const catalogo = opciones.catalogo ?? mecanicasPorRevisar();
  const porCodigo = new Map(catalogo.map((m) => [m.codigo, m]));
  const referencias = new Map(
    catalogo.flatMap((m) =>
      m.sesiones.map((s) => [s.referencia, { mecanica: m.codigo, id: s.id }] as const),
    ),
  );
  const leidas = hojas.map(leerLasRespuestas);

  if (leidas.length === 0) {
    throw new Detenido('No hay ninguna hoja de respuestas.');
  }

  const avisos: string[] = [];
  /** Que hoja aprobo cada mecanica: una sola. */
  const aprobadaPor = new Map<string, number>();
  const marcadas = new Set<string>();

  leidas.forEach((hoja, numero) => {
    const nombreDeLaHoja = `La hoja ${String(numero + 1)}`;

    if (hoja.revisor === '' || hoja.revisor === '(sin indicar)') {
      throw new Detenido(`${nombreDeLaHoja} no dice a nombre de quien es la revision.`);
    }

    const momento =
      opciones.fecha ?? (hoja.fecha === undefined ? undefined : momentoDeLaRevision(hoja.fecha));

    if (momento === undefined || !MOMENTO.test(momento)) {
      throw new Detenido(
        `${nombreDeLaHoja} (${hoja.revisor}) no dice la fecha: pon «Fecha de la revision» en la hoja o pasa --fecha con zona, por ejemplo 2026-10-23T10:00:00-05:00.`,
      );
    }

    for (const [codigo, decision] of Object.entries(hoja.mecanicas)) {
      if (!porCodigo.has(codigo)) {
        throw new Detenido(
          `${nombreDeLaHoja} habla de ${codigo}, que no esta entre lo que se revisa.`,
        );
      }

      if (decision === 'con_cambios') {
        throw new Detenido(
          `${codigo} esta aprobada con cambios (${hoja.revisor}): el texto nuevo lo escribe una persona en el contenido, y despues se vuelve a generar. Este programa no lo hace.`,
        );
      }

      if (decision === 'aprobada') {
        const antes = aprobadaPor.get(codigo);

        if (antes !== undefined && antes !== numero) {
          throw new Detenido(
            `${codigo} esta aprobada en dos hojas (${leidas[antes]?.revisor ?? ''} y ${hoja.revisor}): no se sabe a nombre de quien va cada sesion.`,
          );
        }

        aprobadaPor.set(codigo, numero);
      }

      marcadas.add(codigo);
    }

    for (const referencia of hoja.sinSalir) {
      if (!referencias.has(referencia)) {
        throw new Detenido(`${nombreDeLaHoja} dice que no sale ${referencia}, que no existe.`);
      }
    }

    for (const [referencia, decision] of Object.entries(hoja.piloto)) {
      if (decision === 'con_cambios') {
        throw new Detenido(
          `La sesion del piloto ${referencia} esta aprobada con cambios: el texto nuevo lo escribe una persona.`,
        );
      }
    }
  });

  const sinSalir = new Set(leidas.flatMap((hoja) => hoja.sinSalir));
  const sentencias: string[] = [];
  const porMecanica: { codigo: string; revisor: string; publicadas: number; sinSalir: number }[] =
    [];
  const pendientes: { codigo: string; motivo: string }[] = [];
  let total = 0;

  for (const mecanica of catalogo) {
    const numero = aprobadaPor.get(mecanica.codigo);
    const hoja = numero === undefined ? undefined : leidas[numero];
    const delPiloto = Object.entries(SESIONES_DEL_PILOTO).filter(([referencia]) =>
      referencia.startsWith(`${mecanica.codigo}-`),
    );
    const pilotoAprobado = delPiloto.flatMap(([referencia, id]) => {
      const duena = leidas.find((una) => una.piloto[referencia] === 'aprobada');

      return duena === undefined ? [] : [{ referencia, id, revisor: duena.revisor, hoja: duena }];
    });

    const grupos: { revisor: string; momento: string; ids: string[]; fuera: number }[] = [];

    if (hoja !== undefined) {
      const aprobadas = mecanica.sesiones
        .filter((s) => !sinSalir.has(s.referencia))
        .map((s) => s.id);
      const momento = opciones.fecha ?? momentoDeLaRevision(hoja.fecha ?? '');

      grupos.push({
        revisor: hoja.revisor,
        momento,
        ids: aprobadas,
        fuera: mecanica.sesiones.length - aprobadas.length,
      });
    }

    for (const { id, revisor, hoja: duena } of pilotoAprobado) {
      const momento = opciones.fecha ?? momentoDeLaRevision(duena.fecha ?? '');
      const grupo = grupos.find((g) => g.revisor === revisor && g.momento === momento);

      if (grupo === undefined) {
        grupos.push({ revisor, momento, ids: [id], fuera: 0 });
      } else {
        grupo.ids.push(id);
      }
    }

    if (grupos.length === 0) {
      const decisiones = leidas
        .map((una) => una.mecanicas[mecanica.codigo])
        .filter((d) => d !== undefined);

      pendientes.push({
        codigo: mecanica.codigo,
        motivo: decisiones.includes('no_sale')
          ? 'No sale: la hoja la deja pendiente y sin publicar.'
          : 'Sin marcar: ninguna hoja la aprobo.',
      });

      if (opciones.exigirTodo === true && !decisiones.includes('no_sale')) {
        throw new Detenido(
          `${mecanica.codigo} quedo sin marcar (y se pidio que no quede nada sin marcar).`,
        );
      }

      continue;
    }

    for (const grupo of grupos) {
      if (grupo.ids.length === 0) {
        continue;
      }

      total += grupo.ids.length;
      porMecanica.push({
        codigo: mecanica.codigo,
        revisor: grupo.revisor,
        publicadas: grupo.ids.length,
        sinSalir: grupo.fuera,
      });
      sentencias.push(
        [
          `-- ${mecanica.codigo} · ${mecanica.nombre}: ${String(grupo.ids.length)} sesion(es), revision de ${grupo.revisor.replace(/\n/gu, ' ')}` +
            (grupo.fuera > 0 ? ` (${String(grupo.fuera)} no sale(n))` : ''),
          'UPDATE "sesion_de_actividad"',
          `SET "revision" = 'revisada',`,
          `    "revisada_por" = ${entreComillas(grupo.revisor)},`,
          `    "revisada_el" = ${entreComillas(grupo.momento)}::timestamptz,`,
          '    "publicado" = TRUE',
          `WHERE "id_actividad" = '${mecanica.id}'`,
          `  AND "revision" = 'pendiente'`,
          `  AND "id_sesion" IN (`,
          grupo.ids.map((id) => `    '${id}'`).join(',\n'),
          '  );',
          '',
        ].join('\n'),
      );
    }
  }

  // Lo que las hojas dicen de las del piloto y no se pudo ubicar, no se descarta en silencio.
  for (const hoja of leidas) {
    for (const [referencia, decision] of Object.entries(hoja.piloto)) {
      const codigo = referencia.slice(0, 6);

      if (!(codigo in MECANICA_DE_LAS_DEL_PILOTO)) {
        avisos.push(`${referencia} no es una sesion del piloto conocida.`);
      } else if (decision === 'sin_marcar') {
        avisos.push(`${referencia} (piloto) quedo sin marcar: sigue pendiente.`);
      }
    }

    for (const [referencia, comentario] of Object.entries(hoja.comentarios)) {
      avisos.push(`Comentario de ${hoja.revisor} sobre ${referencia}: ${comentario}`);
    }
  }

  if (total === 0) {
    throw new Detenido('Ninguna mecanica quedo aprobada: no hay nada que publicar.');
  }

  const revisores = [...new Set(porMecanica.map((m) => m.revisor))];
  const cabecera = [
    '-- Publicar el catalogo revisado (SCRUM-228, ADR 0030).',
    '--',
    `-- Revisiones de: ${revisores.map((r) => r.replace(/\n/gu, ' ')).join('; ')}.`,
    `-- Publica ${String(total)} sesion(es) de ${String(new Set(porMecanica.map((m) => m.codigo)).size)} mecanica(s).`,
    '-- Solo datos. La aplica una persona; nada se publica a mano en el panel de Supabase.',
    '-- Cada UPDATE nombra las sesiones una por una y exige `revision = pendiente`: aplicarla dos veces no hace',
    '-- nada la segunda vez, y la base no deja publicar lo que pide revision y no la tiene.',
    '',
  ].join('\n');

  return {
    sql: `${cabecera}${sentencias.join('\n')}`,
    publicadas: total,
    porMecanica,
    pendientes,
    avisos,
  };
}
