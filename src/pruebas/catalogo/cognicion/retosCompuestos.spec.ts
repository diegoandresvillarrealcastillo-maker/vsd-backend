import { describe, expect, it } from 'vitest';
import { Motor } from '../../../domain/model/Motor.js';
import { problemaDeLosParametros } from '../../../domain/model/ParametrosDelMotor.js';
import { loteDeCognicion } from './index.ts';
import { loteDeCognicion365 } from './365.ts';
import { loteDeRazonamientoLogico } from './razonamientoLogico.ts';
import { loteDeRetosCompuestos365 } from './retosCompuestos.ts';

const RETOS = loteDeRetosCompuestos365().mecanicas;

describe('los retos compuestos de Cognición 365', () => {
  it('completa 365 mecánicas al sumar las once de base y las 354 nuevas', () => {
    const total =
      loteDeCognicion().mecanicas.length +
      loteDeCognicion365().mecanicas.length +
      loteDeRazonamientoLogico().mecanicas.length +
      RETOS.length;

    expect(RETOS).toHaveLength(354);
    expect(total).toBe(365);
    expect(RETOS[0]?.codigo).toBe('COG-12');
    expect(RETOS.at(-1)?.codigo).toBe('COG-365');
  });

  it('da a cada reto un conjunto único de tres o cuatro juegos distintos', () => {
    const combinaciones = RETOS.map((reto) => {
      const fases = reto.sesiones[0]?.parametros['fases'] as readonly { codigo: string }[];
      const codigos = fases.map((fase) => fase.codigo);

      expect(codigos.length).toBeGreaterThanOrEqual(3);
      expect(codigos.length).toBeLessThanOrEqual(4);
      expect(new Set(codigos).size).toBe(codigos.length);
      return [...codigos].sort().join('>');
    });

    expect(new Set(combinaciones).size).toBe(354);
  });

  it('no reutiliza la misma sesión o el mismo reto base entre fases', () => {
    const fases = RETOS.flatMap((reto) => {
      const datos = reto.sesiones[0]?.parametros['fases'] as readonly {
        codigo: string;
        idSesion: string;
        parametros: Readonly<Record<string, unknown>>;
      }[];
      return datos;
    });
    const sesiones = fases.map((fase) => `${fase.codigo}:${JSON.stringify(fase.parametros)}`);

    expect(fases).toHaveLength(1251);
    expect(new Set(fases.map((fase) => fase.idSesion)).size).toBe(fases.length);
    expect(new Set(sesiones).size).toBe(fases.length);
  });

  it('mantiene distintos los once juegos individuales y las fases de los retos', () => {
    const individuales = [
      ...loteDeCognicion().mecanicas,
      ...loteDeCognicion365().mecanicas,
      ...loteDeRazonamientoLogico().mecanicas,
    ].map((mecanica) => {
      const sesion = mecanica.sesiones[0];
      expect(sesion, mecanica.codigo).toBeDefined();
      return `${mecanica.codigo}:${JSON.stringify(sesion?.parametros)}`;
    });
    const compuestas = RETOS.flatMap((reto) => {
      const fases = reto.sesiones[0]?.parametros['fases'] as readonly {
        codigo: string;
        parametros: Readonly<Record<string, unknown>>;
      }[];
      return fases.map((fase) => `${fase.codigo}:${JSON.stringify(fase.parametros)}`);
    });

    expect(new Set([...individuales, ...compuestas]).size).toBe(
      individuales.length + compuestas.length,
    );
  });

  it('tiene descripciones de tres palabras y no repite ninguna', () => {
    const descripciones = RETOS.map((reto) => reto.descripcion.trim().split(/\s+/u));

    expect(descripciones.every((partes) => partes.length === 3)).toBe(true);
    expect(new Set(descripciones.map((partes) => partes.join(' '))).size).toBe(354);
  });

  it('mantiene validos los parámetros de cada juego base dentro de la composición', () => {
    const base = new Map(
      [
        ...loteDeCognicion().mecanicas,
        ...loteDeCognicion365().mecanicas,
        ...loteDeRazonamientoLogico().mecanicas,
      ].map((mecanica) => [mecanica.codigo, mecanica]),
    );

    for (const reto of RETOS) {
      const fases = reto.sesiones[0]?.parametros['fases'] as readonly {
        codigo: string;
        maximo: number;
        parametros: Readonly<Record<string, unknown>>;
      }[];

      for (const fase of fases) {
        const original = base.get(fase.codigo);

        expect(original, fase.codigo).toBeDefined();
        expect(
          problemaDeLosParametros(
            original?.motor as (typeof Motor)[keyof typeof Motor],
            fase.parametros,
          ),
        ).toBeUndefined();
        expect(fase.maximo).toBe(
          typeof fase.parametros['puntosMaximos'] === 'number'
            ? fase.parametros['puntosMaximos']
            : original?.maximo,
        );
      }

      expect(
        problemaDeLosParametros(Motor.RETO_COMPUESTO_COGNITIVO, reto.sesiones[0]?.parametros ?? {}),
      ).toBeUndefined();
    }
  });

  it('limita a siete respuestas cada bloque de las 354 actividades', () => {
    for (const reto of RETOS) {
      const fases = reto.sesiones[0]?.parametros['fases'] as readonly {
        codigo: string;
        parametros: Readonly<Record<string, unknown>>;
      }[];

      for (const fase of fases) {
        const parametros = fase.parametros;
        const rondas = (() => {
          switch (fase.codigo) {
            case 'COG-01':
              return parametros['rondas'];
            case 'COG-02':
            case 'COG-04':
              return Array.isArray(parametros['rondas']) ? parametros['rondas'].length : 0;
            case 'COG-03':
              return Array.isArray(parametros['elementos']) ? parametros['elementos'].length : 0;
            case 'COG-05': {
              const objetivos = new Set(
                Array.isArray(parametros['objetivos'])
                  ? parametros['objetivos'].flatMap((objetivo) =>
                      typeof objetivo === 'object' &&
                      objetivo !== null &&
                      'clave' in objetivo &&
                      typeof objetivo.clave === 'string'
                        ? [objetivo.clave]
                        : [],
                    )
                  : [],
              );
              return Array.isArray(parametros['secuencia'])
                ? parametros['secuencia'].filter((clave) => objetivos.has(clave)).length
                : 0;
            }
            case 'COG-06':
              return Array.isArray(parametros['elementos']) ? parametros['elementos'].length : 0;
            case 'COG-07':
              return Array.isArray(parametros['palabras']) ? parametros['palabras'].length : 0;
            case 'COG-08':
              return Array.isArray(parametros['puntos']) ? parametros['puntos'].length : 0;
            case 'COG-09':
              return Array.isArray(parametros['preguntas']) ? parametros['preguntas'].length : 0;
            default:
              return 1;
          }
        })();

        expect(rondas, `${reto.codigo} / ${fase.codigo}`).toBeLessThanOrEqual(7);
      }
    }
  });

  it('deja las nuevas actividades para revisión y no las publica todavía', () => {
    expect(RETOS.every((reto) => reto.revision === 'pendiente' && !reto.publicar)).toBe(true);
  });
});
