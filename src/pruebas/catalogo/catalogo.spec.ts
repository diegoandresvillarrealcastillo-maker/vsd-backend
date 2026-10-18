import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { esMotor, type Motor } from '../../domain/model/Motor.js';
import { problemaDeLosParametros } from '../../domain/model/ParametrosDelMotor.js';
import { SesionDeActividad } from '../../domain/model/SesionDeActividad.js';
import { ActivityId, SesionId } from '../../domain/model/Identifier.js';
import { problemasDeContenido } from '../contenidoDeSesiones.js';
import { PICTOGRAMAS } from './pictogramas.ts';
import { idDeMecanica, idDeSesion } from './ids.ts';
import { sqlDe, todosLosLotes } from './lotes.ts';
import type { MecanicaDeContenido, SesionDeContenido } from './tipos.ts';

/**
 * El contenido del catalogo, antes de que llegue a una base (SCRUM-222 a SCRUM-224, ADR 0030 y 0031).
 *
 * Esta prueba es el sitio donde se decide si un lote se puede sembrar: **cada sesion** pasa por el contrato
 * de su motor, el filtro de lenguaje clinico (R6) y la lista de exclusion (R14); el maximo de la sesion es
 * el de la mecanica; ningun elemento de un banco esta en mas de dos sesiones; y el SQL que esta en el
 * repositorio es el que el generador produce. Un lote nuevo entra aqui solo, sin una prueba nueva.
 */

const carpeta = join(process.cwd(), 'prisma', 'migrations');
const LOTES = todosLosLotes();
const MECANICAS: readonly MecanicaDeContenido[] = LOTES.flatMap((una) => una.lote.mecanicas);
const SESIONES: readonly { mecanica: MecanicaDeContenido; sesion: SesionDeContenido }[] =
  MECANICAS.flatMap((mecanica) => mecanica.sesiones.map((sesion) => ({ mecanica, sesion })));

/** Los caracteres de un texto que la codificacion WIN1252 no tiene. */
export function caracteresFueraDeWin1252(texto: string): string[] {
  // Latin-1 completo (menos los controles C1, que WIN1252 reemplaza) y los 27 signos de 0x80 a 0x9F.
  const extras = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ');
  const fuera = new Set<string>();

  for (const caracter of texto) {
    const codigo = caracter.codePointAt(0) as number;
    const cabe = codigo <= 0x7f || (codigo >= 0xa0 && codigo <= 0xff) || extras.has(caracter);

    if (!cabe) {
      fuera.add(`${caracter} (U+${codigo.toString(16).toUpperCase().padStart(4, '0')})`);
    }
  }

  return [...fuera];
}

/** Cuantas sesiones tiene cada mecanica en total: las que ya estaban sembradas mas las del lote. */
const YA_SEMBRADAS: Readonly<Record<string, number>> = { 'COG-01': 4 };
const SESIONES_POR_MECANICA = 40;

describe.each(LOTES)('el lote $lote.migracion', (una) => {
  it('el SQL que esta en el repositorio es el que produce el generador', () => {
    const archivo = join(carpeta, una.lote.migracion, 'migration.sql');

    expect(
      existsSync(archivo),
      `falta ${archivo}: ejecuta «node src/pruebas/catalogo/generar.ts»`,
    ).toBe(true);
    expect(
      readFileSync(archivo, 'utf8'),
      'el contenido cambio: ejecuta «node src/pruebas/catalogo/generar.ts»',
    ).toBe(sqlDe(una));
  });

  it('solo usa caracteres que entiende una base WIN1252 (el PostgreSQL local de Windows)', () => {
    // Supabase es UTF-8, pero `npm run db:local` en Windows crea la base en WIN1252: un signo como «−»
    // (U+2212) hace fallar la migracion a la mitad y deja la base local a medias.
    expect(caracteresFueraDeWin1252(sqlDe(una))).toEqual([]);
  });

  it('es solo de datos: ni esquema, ni borrados, ni nada que no sea sembrar', () => {
    const sentencias = sqlDe(una)
      .split('\n')
      .filter((linea) => !linea.trimStart().startsWith('--'))
      .join('\n');

    expect(sentencias).not.toMatch(/\b(DROP|ALTER|TRUNCATE|DELETE|UPDATE|CREATE)\b/);
    expect(sentencias.match(/\bINSERT INTO\b/g)?.length).toBeGreaterThan(0);
  });

  it('siembra primero las mecanicas y despues sus sesiones', () => {
    const sentencias = sqlDe(una)
      .split('\n')
      .filter((linea) => !linea.trimStart().startsWith('--'))
      .join('\n');
    const actividades = sentencias.indexOf('INSERT INTO "actividad"');
    const sesiones = sentencias.indexOf('INSERT INTO "sesion_de_actividad"');

    if (una.lote.mecanicas.some((m) => m.yaExiste !== true)) {
      expect(actividades).toBeGreaterThanOrEqual(0);
      expect(sesiones).toBeGreaterThan(actividades);
    }
  });

  it('todas las mecanicas son de la categoria del lote', () => {
    for (const mecanica of una.lote.mecanicas) {
      expect(mecanica.categoria, mecanica.nombre).toBe(una.lote.categoria);
    }
  });
});

describe('las mecanicas', () => {
  it.each(MECANICAS.map((m) => [m.codigo, m] as const))(
    '%s: identificador, motor y escala coherentes',
    (_, m) => {
      expect(m.id, m.codigo).toBe(m.yaExiste === true ? m.id : idDeMecanica(m.codigo));
      expect(esMotor(m.motor), `${m.codigo} tiene un motor que no existe: ${m.motor}`).toBe(true);
      // El dominio la acepta tal cual.
      expect(() => new ActivityId(m.id)).not.toThrow();

      if (m.direccion === 'sin_puntaje') {
        expect(m.maximo, m.codigo).toBeNull();
        expect(m.umbrales, m.codigo).toBeNull();
        expect(m.textosNivel, m.codigo).toBeNull();
      } else {
        expect(m.maximo, m.codigo).toBeGreaterThan(0);
        expect(m.umbrales?.primero, m.codigo).toBeGreaterThan(0);
        expect(m.umbrales?.segundo, m.codigo).toBeGreaterThan(m.umbrales?.primero ?? 1);
        expect(m.umbrales?.segundo, m.codigo).toBeLessThan(1);
        expect(Object.keys(m.textosNivel ?? {}).sort(), m.codigo).toEqual([
          'en_seguimiento',
          'favorable',
          'requiere_atencion',
        ]);
      }
    },
  );

  it.each(MECANICAS.map((m) => [m.codigo, m] as const))(
    '%s: lo que dice de si misma pasa por el lenguaje clinico (R6) y la lista de exclusion (R14)',
    (_, m) => {
      const problemas = problemasDeContenido({
        titulo: m.nombre,
        parametros: [m.descripcion, m.textosNivel],
      });

      expect(problemas).toEqual([]);
    },
  );

  it.each(MECANICAS.map((m) => [m.codigo, m] as const))(
    '%s: solo sale publicado lo que no pide revision',
    (_, m) => {
      if (m.publicar) {
        expect(m.revision, m.codigo).toBe('no_requiere');
      }

      if (m.revision === 'pendiente') {
        expect(m.publicar, m.codigo).toBe(false);
      }
    },
  );

  it.each(MECANICAS.map((m) => [m.codigo, m] as const))(
    '%s: tiene 40 sesiones contando las que ya estaban sembradas',
    (_, m) => {
      expect(m.sesiones.length + (YA_SEMBRADAS[m.codigo] ?? 0), m.codigo).toBe(
        SESIONES_POR_MECANICA,
      );
    },
  );

  it('los codigos y los identificadores no se repiten', () => {
    expect(new Set(MECANICAS.map((m) => m.codigo)).size).toBe(MECANICAS.length);
    expect(new Set(MECANICAS.map((m) => m.id)).size).toBe(MECANICAS.length);
  });
});

describe('las sesiones', () => {
  it('ningun identificador se repite', () => {
    const ids = SESIONES.map(({ sesion }) => sesion.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('el identificador de cada una es el de su ficha y su numero', () => {
    for (const { mecanica, sesion } of SESIONES) {
      const posicion = mecanica.sesiones.indexOf(sesion) + 1 + (YA_SEMBRADAS[mecanica.codigo] ?? 0);

      expect(sesion.id, `${mecanica.codigo} ${sesion.titulo}`).toBe(
        idDeSesion(mecanica.codigo, posicion),
      );
      expect(() => new SesionId(sesion.id)).not.toThrow();
    }
  });

  it('cada titulo es unico dentro de su mecanica', () => {
    for (const mecanica of MECANICAS) {
      const titulos = mecanica.sesiones.map((s) => s.titulo);

      expect(new Set(titulos).size, mecanica.codigo).toBe(titulos.length);
    }
  });

  it('cada una cumple el contrato de su motor y la acepta el dominio', () => {
    const problemas = SESIONES.flatMap(({ mecanica, sesion }) => {
      const contrato = problemaDeLosParametros(mecanica.motor as Motor, sesion.parametros);

      if (contrato !== undefined) {
        return [`${mecanica.codigo} «${sesion.titulo}»: ${contrato}`];
      }

      try {
        SesionDeActividad.create({
          id: new SesionId(sesion.id),
          idActividad: new ActivityId(mecanica.id),
          titulo: sesion.titulo,
          nivel: sesion.nivel,
          parametros: sesion.parametros,
          motor: mecanica.motor as Motor,
          publicado: mecanica.publicar,
          revision: mecanica.revision,
        });

        return [];
      } catch (error) {
        return [`${mecanica.codigo} «${sesion.titulo}»: ${(error as Error).message}`];
      }
    });

    expect(problemas).toEqual([]);
  });

  it('lo que dice cada una pasa por el lenguaje clinico (R6) y la lista de exclusion (R14)', () => {
    const problemas = SESIONES.flatMap(({ mecanica, sesion }) =>
      problemasDeContenido(sesion).map(
        (problema) => `${mecanica.codigo} «${sesion.titulo}»: ${problema}`,
      ),
    );

    expect(problemas).toEqual([]);
  });

  it('el maximo de cada sesion que puntua es el de su mecanica', () => {
    const problemas = SESIONES.flatMap(({ mecanica, sesion }) => {
      if (mecanica.direccion === 'sin_puntaje') {
        return 'puntosMaximos' in sesion.parametros
          ? [`${mecanica.codigo} «${sesion.titulo}» no puntua y trae puntosMaximos`]
          : [];
      }

      const declarado = (sesion.parametros['puntosMaximos'] ??
        sesion.parametros['rondas']) as number;

      return declarado === mecanica.maximo
        ? []
        : [
            `${mecanica.codigo} «${sesion.titulo}»: ${String(declarado)} y la mecanica dice ${String(mecanica.maximo)}`,
          ];
    });

    expect(problemas).toEqual([]);
  });

  it('el nivel de cada una esta entre 1 y 3', () => {
    for (const { mecanica, sesion } of SESIONES) {
      expect([1, 2, 3], `${mecanica.codigo} ${sesion.titulo}`).toContain(sesion.nivel);
    }
  });

  it('ninguna pesa mas de 6 KB en el sendero (el ADR 0030 calculaba de 1 a 3 KB)', () => {
    const pesadas = SESIONES.filter(
      ({ sesion }) => JSON.stringify(sesion.parametros).length > 6 * 1024,
    ).map(({ mecanica, sesion }) => `${mecanica.codigo} «${sesion.titulo}»`);

    expect(pesadas).toEqual([]);
  });

  it('los pictogramas que nombra existen en la biblioteca', () => {
    const conocidos = new Set(PICTOGRAMAS.map((una) => una.clave));
    const desconocidos: string[] = [];
    const mirar = (valor: unknown, donde: string) => {
      if (Array.isArray(valor)) {
        valor.forEach((item) => mirar(item, donde));
      } else if (typeof valor === 'object' && valor !== null) {
        for (const [clave, dentro] of Object.entries(valor)) {
          if (
            (clave === 'pictograma' || clave === 'forma') &&
            typeof dentro === 'string' &&
            !conocidos.has(dentro)
          ) {
            desconocidos.push(`${donde}: ${dentro}`);
          }

          mirar(dentro, donde);
        }
      }
    };

    for (const { mecanica, sesion } of SESIONES) {
      mirar(sesion.parametros, `${mecanica.codigo} «${sesion.titulo}»`);
    }

    expect(desconocidos).toEqual([]);
  });
});
