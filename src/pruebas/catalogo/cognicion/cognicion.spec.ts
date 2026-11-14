/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return --
   Esta prueba lee el JSON de las sesiones sin tipos a proposito: su forma ya la comprueba el contrato del
   motor (catalogo.spec.ts), y aqui se mira lo que afirma cada ficha, no la forma. */
import { describe, expect, it } from 'vitest';
import { PICTOGRAMAS } from '../pictogramas.ts';
import { sesionesDeAtencion } from './atencion.ts';
import {
  MESAS_DE_NIVEL_1,
  MESAS_DE_NIVEL_2,
  MESAS_DE_NIVEL_3,
  sesionesDeCestas,
} from './cestas.ts';
import { sesionesDeColores } from './colores.ts';
import { sesionesDeCuentas } from './cuentas.ts';
import { sesionesDeEscenas } from './escena.ts';
import {
  GRUPOS_DE_NIVEL_1,
  GRUPOS_DE_NIVEL_2,
  GRUPOS_DE_NIVEL_3,
  sesionesDeIntruso,
} from './intruso.ts';
import {
  LISTAS_DE_NIVEL_1,
  LISTAS_DE_NIVEL_2,
  LISTAS_DE_NIVEL_3,
  sesionesDeListas,
} from './lista.ts';
import {
  PALABRAS_DE_NIVEL_1,
  PALABRAS_DE_NIVEL_2,
  PALABRAS_DE_NIVEL_3,
  sesionesDePalabras,
} from './palabras.ts';
import { sesionesDePuntos } from './puntos.ts';

/**
 * Lo propio de cada mecanica de Cognicion (SCRUM-222): lo que `catalogo.spec.ts` no puede saber porque es de
 * una sola ficha. Aqui se recalcula lo que el contenido afirma (las cuentas, los repartos) con una cuenta
 * independiente.
 */

type Parametros = Record<string, any>;

const parametrosDe = (sesiones: { parametros: unknown }[]) =>
  sesiones.map((s) => s.parametros as Parametros);

/** Cuantas veces sale cada cosa; las que pasan de `tope`. */
function repetidas(vistas: readonly string[], tope: number): string[] {
  const cuenta = new Map<string, number>();

  for (const una of vistas) {
    cuenta.set(una, (cuenta.get(una) ?? 0) + 1);
  }

  return [...cuenta].filter(([, veces]) => veces > tope).map(([una, veces]) => `${una} (${veces})`);
}

describe('COG-01 · Recuerda los colores', () => {
  const sesiones = sesionesDeColores();

  it('suma 36 sesiones a las 4 del piloto: 9 temas de 3 niveles y una lenta', () => {
    expect(sesiones).toHaveLength(36);
    expect(sesiones.filter((s) => s.titulo.endsWith('con calma'))).toHaveLength(9);
    expect(sesiones.filter((s) => s.nivel === 2)).toHaveLength(9);
    expect(sesiones.filter((s) => s.nivel === 3)).toHaveLength(9);
  });

  it('cada casilla lleva forma, nombre y color (R10), y el destello cabe en el turno y dura 600 ms o mas', () => {
    for (const p of parametrosDe(sesiones)) {
      for (const casilla of p['casillas']) {
        expect(casilla.forma, casilla.nombre).toBeTruthy();
        expect(casilla.color, casilla.nombre).toBeTruthy();
        expect(casilla.nombre, casilla.clave).toBeTruthy();
      }

      expect(p['msDestello']).toBeGreaterThanOrEqual(600);
      expect(p['msDestello']).toBeLessThanOrEqual(p['msPorElemento']);
      expect(p['rondas']).toBe(12);
    }
  });

  it('el nivel dice cuantas casillas: 4, 6 o 9, con el largo inicial de la ficha', () => {
    for (const sesion of sesiones.filter((s) => !s.titulo.endsWith('con calma'))) {
      const p = sesion.parametros as Parametros;

      expect(p['casillas']).toHaveLength([4, 6, 9][sesion.nivel - 1] as number);
      expect(p['largoInicial']).toBe(sesion.nivel === 3 ? 4 : 3);
    }
  });

  it('las lentas dan mas tiempo: 1.100 ms iluminada y 600 de pausa', () => {
    for (const sesion of sesiones.filter((s) => s.titulo.endsWith('con calma'))) {
      expect(sesion.parametros).toMatchObject({ msPorElemento: 1700, msDestello: 1100 });
    }
  });

  it('no hay dos sesiones iguales', () => {
    const huellas = sesiones.map((s) => JSON.stringify(s.parametros));

    expect(new Set(huellas).size).toBe(huellas.length);
  });
});

describe('COG-02 · La palabra que sobra', () => {
  it('el banco son 122 grupos: 40, 40 y 42', () => {
    expect([GRUPOS_DE_NIVEL_1, GRUPOS_DE_NIVEL_2, GRUPOS_DE_NIVEL_3].map((b) => b.length)).toEqual([
      40, 40, 42,
    ]);
  });

  it('cada grupo sale en dos sesiones a lo sumo (ADR 0031)', () => {
    const grupos = parametrosDe(sesionesDeIntruso()).flatMap((p) =>
      (p['rondas'] as { palabras: string[] }[]).map((r) => [...r.palabras].sort().join('|')),
    );

    expect(repetidas(grupos, 2)).toEqual([]);
    expect(new Set(grupos).size).toBe(122);
  });

  it('en cada ronda, el intruso es la palabra que no comparte nada con el grupo de los otros tres', () => {
    const bancos = [...GRUPOS_DE_NIVEL_1, ...GRUPOS_DE_NIVEL_2, ...GRUPOS_DE_NIVEL_3];
    const intrusos = new Map(
      bancos.map((g) => [[...g.juntas, g.intruso].sort().join('|'), g.intruso]),
    );

    for (const p of parametrosDe(sesionesDeIntruso())) {
      for (const ronda of p['rondas'] as { palabras: string[]; intruso: number }[]) {
        const llave = [...ronda.palabras].sort().join('|');

        expect(ronda.palabras[ronda.intruso], llave).toBe(intrusos.get(llave));
      }
    }
  });

  it('la razon no nombra al intruso salvo para explicar el cambio de categoria, y nunca senala el fallo', () => {
    for (const p of parametrosDe(sesionesDeIntruso())) {
      for (const ronda of p['rondas'] as { razon: string }[]) {
        expect(ronda.razon).not.toMatch(/te equivoc|incorrect|mal\b|error|fall/i);
      }
    }
  });

  it('las sesiones se reparten 13, 13 y 14 por nivel, y el intruso cae en todas las posiciones', () => {
    const sesiones = sesionesDeIntruso();

    expect([1, 2, 3].map((n) => sesiones.filter((s) => s.nivel === n).length)).toEqual([
      13, 13, 14,
    ]);

    const posiciones = new Set(
      parametrosDe(sesiones).flatMap((p) =>
        (p['rondas'] as { intruso: number }[]).map((r) => r.intruso),
      ),
    );

    expect([...posiciones].sort()).toEqual([0, 1, 2, 3]);
  });
});

describe('COG-03 · Ordena por categoria', () => {
  const sesiones = sesionesDeCestas();

  it('40 mesas: 13 de dos cestas, 13 de tres y 14 de tres con elementos ambiguos', () => {
    expect([MESAS_DE_NIVEL_1, MESAS_DE_NIVEL_2, MESAS_DE_NIVEL_3].map((b) => b.length)).toEqual([
      13, 13, 14,
    ]);
    expect(
      sesiones
        .filter((s) => s.nivel === 1)
        .every((s) => (s.parametros['cestas'] as unknown[]).length === 2),
    ).toBe(true);
    expect(
      sesiones
        .filter((s) => s.nivel >= 2)
        .every((s) => (s.parametros['cestas'] as unknown[]).length === 3),
    ).toBe(true);
  });

  it('cada mesa tiene ocho elementos, y en el nivel 3 hay dos ambiguos que valen en dos cestas', () => {
    for (const sesion of sesiones) {
      const elementos = (sesion.parametros as Parametros)['elementos'] as {
        cesta: string | string[];
      }[];
      const ambiguos = elementos.filter((e) => Array.isArray(e.cesta));

      expect(elementos).toHaveLength(8);

      if (sesion.nivel === 3) {
        expect(ambiguos.length, sesion.titulo).toBeGreaterThanOrEqual(1);
        expect(ambiguos.length, sesion.titulo).toBeLessThanOrEqual(2);
      } else {
        expect(ambiguos, sesion.titulo).toHaveLength(0);
      }
    }
  });

  it('ninguna mesa se repite', () => {
    const mesas = parametrosDe(sesiones).map((p) =>
      (p['elementos'] as { clave: string }[])
        .map((e) => e.clave)
        .sort()
        .join('|'),
    );

    expect(repetidas(mesas, 1)).toEqual([]);
  });

  it('una cesta no tiene todos los elementos: hay algo que clasificar en cada una', () => {
    for (const p of parametrosDe(sesiones)) {
      for (const cesta of p['cestas'] as { clave: string }[]) {
        const suyos = (p['elementos'] as { cesta: string | string[] }[]).filter((e) =>
          [e.cesta].flat().includes(cesta.clave),
        );

        expect(suyos.length, cesta.clave).toBeGreaterThanOrEqual(2);
        expect(suyos.length, cesta.clave).toBeLessThan(8);
      }
    }
  });
});

describe('COG-04 · Cuentas con calma', () => {
  const sesiones = sesionesDeCuentas();

  /** El valor numerico de «$13.500» o «42». */
  const valor = (texto: string) => Number(texto.replace(/[$.]/g, ''));
  const numeros = (texto: string) => (texto.match(/\$?\d[\d.]*/g) ?? []).map(valor);

  /** Lo que da una cuenta, calculado aparte de como se genero. */
  function resolver(enunciado: string): number {
    const n = numeros(enunciado);
    const quien = (re: RegExp) => re.test(enunciado);

    if (quien(/^¿Cuánto es \d+ \+ \d+ \+ \d+\?$/)) return n[0]! + n[1]! + n[2]!;
    if (quien(/^¿Cuánto es \d+ \+ \d+\?$/)) return n[0]! + n[1]!;
    if (quien(/^¿Cuánto es \d+ - \d+\?$/)) return n[0]! - n[1]!;
    if (quien(/^¿Cuánto es \d+ × \d+\?$/)) return n[0]! * n[1]!;
    if (quien(/^¿Cuál es el doble de \d+\?$/)) return n[0]! * 2;
    if (quien(/^¿Cuál es la mitad de \d+\?$/)) return n[0]! / 2;
    if (quien(/^¿Cuánto falta para llegar a \d+ desde \d+\?$/)) return n[0]! - n[1]!;
    if (quien(/^\d+ \+ \? = \d+\. ¿Qué número falta\?$/)) return n[1]! - n[0]!;
    if (quien(/^Redondea \d+ a la decena más cercana\.$/)) return Math.round(n[0]! / 10) * 10;
    if (quien(/^Pagas con \$[\d.]+ una compra de \$[\d.]+\. ¿Cuánto te devuelven\?$/))
      return n[0]! - n[1]!;
    if (quien(/^Un pan cuesta \$[\d.]+ y un jugo \$[\d.]+\. ¿Cuánto pagas por los dos\?$/))
      return n[0]! + n[1]!;
    if (quien(/^\d+ empanadas de \$[\d.]+ cada una\. ¿Cuánto cuestan en total\?$/))
      return n[0]! * n[1]!;
    if (quien(/^La cuenta es de \$[\d.]+ y se divide entre dos\. ¿Cuánto pone cada quien\?$/))
      return n[0]! / 2;
    if (
      quien(
        /^Un trayecto dura \d+ minutos de ida y otros \d+ de vuelta\. ¿Cuántos minutos son en total\?$/,
      )
    )
      return n[0]! * 2;
    if (quien(/^Una camiseta de \$[\d.]+ tiene \$[\d.]+ de descuento\. ¿Cuánto pagas\?$/))
      return n[0]! - n[1]!;
    if (quien(/^Ahorras \$[\d.]+ cada semana\. ¿Cuánto tienes después de \d+ semanas\?$/))
      return n[0]! * n[1]!;
    if (quien(/^Un libro tiene \d+ páginas y llevas \d+\. ¿Cuántas te faltan\?$/))
      return n[0]! - n[1]!;
    if (
      quien(
        /^Tienes \d+ galletas para repartir entre \d+ personas\. ¿Cuántas le tocan a cada una\?$/,
      )
    )
      return n[0]! / n[1]!;
    if (quien(/^Tienes \d+ monedas de \$500 y \d+ de \$200\. ¿Cuánto dinero tienes\?$/))
      return n[0]! * 500 + n[2]! * 200;

    throw new Error(`No se sabe resolver «${enunciado}»`);
  }

  it('son 40: tres niveles de diez tipos y diez cuentas del dia a dia', () => {
    expect(sesiones).toHaveLength(40);
    expect(sesiones.filter((s) => s.titulo.startsWith('Día a día'))).toHaveLength(10);
  });

  it('en cada ronda, la opcion marcada como correcta es la que da la cuenta, calculada aparte', () => {
    for (const sesion of sesiones) {
      for (const ronda of (sesion.parametros as Parametros)['rondas'] as {
        enunciado: string;
        opciones: string[];
        correcta: number;
      }[]) {
        const esperada = resolver(ronda.enunciado);

        expect(
          valor(ronda.opciones[ronda.correcta] as string),
          `${sesion.titulo}: ${ronda.enunciado}`,
        ).toBe(esperada);
        // Ninguna otra opcion da lo mismo: una sola respuesta correcta.
        expect(
          ronda.opciones.filter((o) => valor(o) === esperada),
          ronda.enunciado,
        ).toHaveLength(1);
      }
    }
  });

  it('las divisiones y mitades dan siempre un entero, y ninguna opcion es negativa ni cero', () => {
    for (const sesion of sesiones) {
      for (const ronda of (sesion.parametros as Parametros)['rondas'] as {
        enunciado: string;
        opciones: string[];
      }[]) {
        expect(Number.isInteger(resolver(ronda.enunciado)), ronda.enunciado).toBe(true);
        expect(
          ronda.opciones.every((o) => valor(o) > 0),
          ronda.enunciado,
        ).toBe(true);
      }
    }
  });

  it('ninguna cuenta se repite dentro de una sesion', () => {
    for (const sesion of sesiones) {
      const enunciados = (
        (sesion.parametros as Parametros)['rondas'] as { enunciado: string }[]
      ).map((r) => r.enunciado);

      expect(new Set(enunciados).size, sesion.titulo).toBe(enunciados.length);
    }
  });

  it('no hay un tiempo limite en ninguna: ni segundos por ronda ni cuenta atras (R4)', () => {
    for (const sesion of sesiones) {
      expect(JSON.stringify(sesion.parametros)).not.toMatch(/segundos|cronometro|tiempo/i);
    }
  });

  it('las cuentas de dinero usan pesos colombianos con punto de miles', () => {
    for (const sesion of sesiones.filter((s) => s.titulo.startsWith('Día a día'))) {
      const texto = JSON.stringify(sesion.parametros);

      if (texto.includes('$')) {
        expect(texto).not.toMatch(/\$\d{4,}/);
      }
    }
  });
});

describe('COG-05 · Toca solo lo que cambia', () => {
  const sesiones = sesionesDeAtencion();
  const p = parametrosDe(sesiones);

  it('40 sesiones: 10 objetivos a 3 velocidades y 10 con dos objetivos', () => {
    expect(sesiones).toHaveLength(40);
    expect(p.filter((x) => x['objetivos'].length === 2)).toHaveLength(10);
    expect(p.filter((x) => x['objetivos'].length === 1)).toHaveLength(30);
  });

  it('nunca mas de un estimulo por segundo (R10): las velocidades son 2,0, 1,6 y 1,2 s', () => {
    expect([...new Set(p.map((x) => x['msPorEstimulo']))].sort()).toEqual([1200, 1600, 2000]);
    expect(Math.min(...p.map((x) => x['msPorEstimulo']))).toBeGreaterThanOrEqual(1000);
  });

  it('cada sesion tiene quince objetivos en cuarenta y cinco estimulos, nunca dos objetivos seguidos', () => {
    for (const x of p) {
      const claves = new Set((x['objetivos'] as { clave: string }[]).map((o) => o.clave));
      const secuencia = x['secuencia'] as string[];

      expect(secuencia).toHaveLength(45);
      expect(x['puntosMaximos']).toBe(15);
      expect(secuencia.filter((una) => claves.has(una))).toHaveLength(15);

      secuencia.forEach((una, i) => {
        expect(i > 0 && claves.has(una) && claves.has(secuencia[i - 1] as string)).toBe(false);
      });
    }
  });

  it('con dos objetivos salen los dos, y ninguno domina', () => {
    for (const x of p.filter((y) => y['objetivos'].length === 2)) {
      const [a, b] = (x['objetivos'] as { clave: string }[]).map((o) => o.clave) as [
        string,
        string,
      ];
      const secuencia = x['secuencia'] as string[];
      const deA = secuencia.filter((una) => una === a).length;
      const deB = secuencia.filter((una) => una === b).length;

      expect(deA + deB).toBe(15);
      expect(Math.min(deA, deB)).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('COG-06 · Recuerda la lista', () => {
  const sesiones = sesionesDeListas();

  it('40 listas: 13 de 4 cosas, 13 de 6 y 14 de 8, siempre con 4 distractores', () => {
    expect([LISTAS_DE_NIVEL_1, LISTAS_DE_NIVEL_2, LISTAS_DE_NIVEL_3].map((b) => b.length)).toEqual([
      13, 13, 14,
    ]);

    for (const sesion of sesiones) {
      const x = sesion.parametros as Parametros;

      expect(x['elementos']).toHaveLength([4, 6, 8][sesion.nivel - 1] as number);
      expect(x['distractores']).toHaveLength(4);
    }
  });

  it('el tiempo a la vista sube con el nivel y el maximo es siempre 8', () => {
    for (const sesion of sesiones) {
      expect((sesion.parametros as Parametros)['segundosVista']).toBe(
        [10, 12, 15][sesion.nivel - 1],
      );
      expect((sesion.parametros as Parametros)['puntosMaximos']).toBe(8);
    }
  });

  it('ninguna lista se repite, y ningun contexto de salud o medicinas', () => {
    const contextos = parametrosDe(sesiones).map(
      (x) => `${x['contexto']}|${x['elementos'].length}`,
    );

    expect(repetidas(contextos, 1)).toEqual([]);
    expect(JSON.stringify(parametrosDe(sesiones))).not.toMatch(
      /pastilla|jarabe|medicin|f[aá]rmaco|ibuprofeno|acetaminof/i,
    );
  });
});

describe('COG-07 · Completa la palabra', () => {
  it('el banco son 122 palabras: 40, 40 y 42, y cada una sale en dos sesiones a lo sumo', () => {
    expect(
      [PALABRAS_DE_NIVEL_1, PALABRAS_DE_NIVEL_2, PALABRAS_DE_NIVEL_3].map((b) => b.length),
    ).toEqual([40, 40, 42]);

    const palabras = parametrosDe(sesionesDePalabras()).flatMap((x) =>
      (x['palabras'] as { palabra: string }[]).map((w) => w.palabra),
    );

    expect(repetidas(palabras, 2)).toEqual([]);
  });

  it('no hay palabras repetidas dentro de un nivel del banco', () => {
    for (const banco of [PALABRAS_DE_NIVEL_1, PALABRAS_DE_NIVEL_2, PALABRAS_DE_NIVEL_3]) {
      expect(
        repetidas(
          banco.map(([, palabra]) => palabra),
          1,
        ),
      ).toEqual([]);
    }
  });

  it('el nivel 1 oculta una letra, el 2 dos, y el 3 revuelve las letras', () => {
    for (const sesion of sesionesDePalabras()) {
      const x = sesion.parametros as Parametros;

      expect(x['modo']).toBe(sesion.nivel === 3 ? 'anagrama' : 'completar');

      for (const palabra of x['palabras'] as { faltan?: number[]; revuelta?: string }[]) {
        if (sesion.nivel === 3) {
          expect(palabra.revuelta).toBeDefined();
        } else {
          expect(palabra.faltan).toHaveLength(sesion.nivel);
        }
      }
    }
  });

  it('la primera y la ultima letra quedan a la vista al completar', () => {
    for (const sesion of sesionesDePalabras().filter((s) => s.nivel < 3)) {
      for (const palabra of (sesion.parametros as Parametros)['palabras'] as {
        palabra: string;
        faltan: number[];
      }[]) {
        expect(palabra.faltan).not.toContain(0);
        expect(palabra.faltan).not.toContain([...palabra.palabra].length - 1);
      }
    }
  });
});

describe('COG-08 · Une los puntos en orden', () => {
  const sesiones = sesionesDePuntos();

  it('40 sesiones: 8, 12 y 16 puntos, y en el nivel 3 se alternan numeros y letras', () => {
    expect(sesiones).toHaveLength(40);

    for (const sesion of sesiones) {
      const etiquetas = ((sesion.parametros as Parametros)['puntos'] as { etiqueta: string }[]).map(
        (q) => q.etiqueta,
      );

      expect(etiquetas).toHaveLength([8, 12, 16][sesion.nivel - 1] as number);

      if (sesion.nivel < 3) {
        expect(etiquetas).toEqual(etiquetas.map((_, i) => String(i + 1)));
      } else {
        expect(etiquetas.slice(0, 6)).toEqual(['1', 'A', '2', 'B', '3', 'C']);
      }
    }
  });

  it('no se cronometra: ningun parametro habla de tiempo (R13)', () => {
    for (const sesion of sesiones) {
      expect(JSON.stringify(sesion.parametros)).not.toMatch(/segundos|tiempo|cronometro/i);
    }
  });

  it('no hay dos distribuciones iguales', () => {
    const huellas = sesiones.map((s) => JSON.stringify((s.parametros as Parametros)['puntos']));

    expect(new Set(huellas).size).toBe(40);
  });
});

describe('COG-09 · Lo que vi', () => {
  const sesiones = sesionesDeEscenas();

  it('40 escenas: 6 figuras en 3 x 3, 8 en 3 x 4 y 10 en 4 x 4, con 5 preguntas', () => {
    expect(sesiones).toHaveLength(40);

    for (const sesion of sesiones) {
      const x = sesion.parametros as Parametros;

      expect(x['celdas']).toHaveLength([6, 8, 10][sesion.nivel - 1] as number);
      expect([x['filas'], x['columnas']]).toEqual(
        [
          [3, 3],
          [3, 4],
          [4, 4],
        ][sesion.nivel - 1],
      );
      expect(x['preguntas']).toHaveLength(5);
    }
  });

  it('nunca se pregunta dos veces por el mismo lugar', () => {
    for (const sesion of sesiones) {
      const lugares = (
        (sesion.parametros as Parametros)['preguntas'] as { fila: number; columna: number }[]
      ).map((q) => `${q.fila},${q.columna}`);

      expect(new Set(lugares).size, sesion.titulo).toBe(5);
    }
  });

  it('las figuras salen de la biblioteca de 60 y no hay dos escenas iguales', () => {
    expect(PICTOGRAMAS).toHaveLength(60);
    expect(
      new Set(sesiones.map((s) => JSON.stringify((s.parametros as Parametros)['celdas']))).size,
    ).toBe(40);
  });

  it('sin personas: ninguna figura es una persona', () => {
    expect(JSON.stringify(sesiones.map((s) => s.parametros))).not.toMatch(
      /persona|hombre|mujer|ni[ñn]o|ni[ñn]a/i,
    );
  });
});
