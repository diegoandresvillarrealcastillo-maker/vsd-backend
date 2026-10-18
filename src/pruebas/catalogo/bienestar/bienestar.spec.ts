/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call --
   Esta prueba lee el JSON de las sesiones sin tipos a proposito: su forma ya la comprueba el contrato del
   motor (catalogo.spec.ts), y aqui se mira lo que afirma cada ficha, no la forma. */
import { describe, expect, it } from 'vitest';
import { textosDe } from '../../contenidoDeSesiones.js';
import { loteDeBienestar } from './index.ts';
import { AMBIENTACIONES, sesionesDeRespiracion } from './respiracion.ts';
import { MOVIMIENTOS, pictogramasDeEstiramiento, sesionesDeEstiramiento } from './estiramiento.ts';
import { CUANTAS, sesionesDeCaminatas, sesionesDeCuidados, sesionesDeSueno } from './habitos.ts';
import { sesionesDeEscaneo } from './escaneo.ts';
import { sesionesDeAntesDeDormir, sesionesDeDescanso } from './noche.ts';
import { NUMERO_DE_MICRO_PAUSAS, sesionesDeRespiro } from './respiro.ts';

/**
 * Lo propio de cada mecanica de Bienestar (SCRUM-223): las barandas de las fichas BIE-01 a BIE-09 hechas
 * prueba. Lo general (contrato, lenguaje clinico, tono, 40 sesiones) lo comprueba `catalogo.spec.ts`.
 */

type Parametros = Record<string, any>;

const parametrosDe = (sesiones: { parametros: unknown }[]) =>
  sesiones.map((s) => s.parametros as Parametros);

describe('el lote de Bienestar', () => {
  const lote = loteDeBienestar();

  it('ninguna puntua y todas piden revision: nada sale publicado', () => {
    expect(lote.mecanicas).toHaveLength(9);

    for (const mecanica of lote.mecanicas) {
      expect(mecanica.direccion, mecanica.codigo).toBe('sin_puntaje');
      expect(mecanica.revision, mecanica.codigo).toBe('pendiente');
      expect(mecanica.publicar, mecanica.codigo).toBe(false);
    }
  });

  it('solo «Antes de dormir» tiene franja, y es la noche', () => {
    expect(
      lote.mecanicas.filter((m) => m.franja !== undefined).map((m) => [m.codigo, m.franja]),
    ).toEqual([['BIE-07', 'noche']]);
  });

  it('BIE-04 es «Un cuidado pequeno de hoy» y no el registro de agua y comida (D-C3)', () => {
    const bie04 = lote.mecanicas.find((m) => m.codigo === 'BIE-04');

    expect(bie04?.nombre).toBe('Un cuidado pequeño de hoy');
    expect(JSON.stringify(bie04)).not.toMatch(/comida|dieta|peso|calor[ií]a|adelgaz|cuerpo ideal/i);
  });
});

describe('BIE-01 · Respiracion guiada', () => {
  const sesiones = sesionesDeRespiracion();
  const p = parametrosDe(sesiones);

  it('suma 37 a las 3 del piloto: 3 patrones x 3 duraciones x 4 fondos, y una sin fondo', () => {
    expect(sesiones).toHaveLength(37);
    expect(p.filter((x) => x['ambientacion'] === undefined)).toHaveLength(1);

    for (const fondo of AMBIENTACIONES) {
      expect(p.filter((x) => x['ambientacion'] === fondo)).toHaveLength(9);
    }
  });

  it('ninguna retencion de mas de 4 s, ningun ritmo rapido y la advertencia va en todas (baranda de la ficha)', () => {
    for (const x of p) {
      expect(x['patron'].pausaSegundos).toBeLessThanOrEqual(4);
      expect(x['patron'].inhalaSegundos).toBeGreaterThanOrEqual(3);
      expect(x['patron'].exhalaSegundos).toBeGreaterThanOrEqual(3);
      // A lo sumo 10 respiraciones por minuto.
      expect(
        60 / (x['patron'].inhalaSegundos + x['patron'].pausaSegundos + x['patron'].exhalaSegundos),
      ).toBeLessThanOrEqual(10);
      expect(x['advertenciaInicial']).toMatch(/mareas o te incomoda/);
    }
  });

  it('la pausa solo esta en el patron de cuatro y cuatro, y dura 2 s', () => {
    for (const x of p) {
      expect(x['patron'].pausaSegundos).toBe(
        x['patron'].inhalaSegundos === 4 && x['patron'].exhalaSegundos === 4 ? 2 : 0,
      );
    }
  });

  it('nunca se presenta como tratamiento ni promete nada', () => {
    expect(JSON.stringify(p)).not.toMatch(
      /trata|cura|sana|mejora|reduce|baja la ansiedad|estr[eé]s/i,
    );
  });
});

describe('BIE-02 · Pausa de estiramiento', () => {
  const sesiones = sesionesDeEstiramiento();
  const p = parametrosDe(sesiones);

  it('48 movimientos, 8 por zona, y 48 figuras distintas', () => {
    expect(Object.values(MOVIMIENTOS).map((zona) => zona.length)).toEqual([8, 8, 8, 8, 8, 8]);
    expect(new Set(pictogramasDeEstiramiento()).size).toBe(48);
  });

  it('cada rutina son cuatro movimientos distintos, con su figura, y todo se puede hacer sin dolor', () => {
    expect(sesiones).toHaveLength(40);

    for (const x of p) {
      expect(x['pasos']).toHaveLength(4);
      expect(new Set(x['pasos'].map((paso: any) => paso.pictograma)).size).toBe(4);
      expect(x['advertenciaInicial']).toMatch(/sin dolor/);
      expect(x['advertenciaInicial']).toMatch(/atención médica ni la fisioterapia/);
      expect(x['avisoSiempre']).toMatch(/duele, para/);
      expect(x['avance']).toBe('manual');
    }
  });

  it('nada de giros bruscos de cuello ni de intensidad: ningun movimiento pide fuerza, saltos ni rapidez', () => {
    // Se miran los pasos y no la advertencia, que dice justamente que NO es un ejercicio fuerte.
    // «sin empujar fuerte» y «sin apretar fuerte» son justo la baranda.
    const texto = JSON.stringify(p.map((x) => x['pasos'])).replace(
      /sin (empujar|apretar) fuerte/g,
      '',
    );

    expect(texto).not.toMatch(
      /fuerte|r[aá]pid|brusc|salt[ao]|con fuerza|hasta el l[ií]mite|duele m[aá]s|\btira(r)? de\b/i,
    );
  });

  it('todos los movimientos se hacen desde una silla (R: opcion sentada para todas)', () => {
    expect(JSON.stringify(p)).not.toMatch(
      /acuéstate|ponte de pie|agáchate|arrodíllate|siéntate en el suelo/i,
    );
  });

  it('ninguna rutina de zona repite a otra de la misma zona', () => {
    const huellas = sesiones.map((s) =>
      (s.parametros as Parametros)['pasos'].map((paso: any) => paso.pictograma).join('|'),
    );

    expect(new Set(huellas).size).toBe(40);
  });
});

describe('BIE-03, BIE-04 y BIE-05 · las tarjetas del dia', () => {
  it('40 cada una', () => {
    expect(CUANTAS).toEqual({ sueno: 40, cuidados: 40, caminatas: 40 });
  });

  it.each([
    ['BIE-03', sesionesDeSueno()],
    ['BIE-04', sesionesDeCuidados()],
    ['BIE-05', sesionesDeCaminatas()],
  ])('%s: tres respuestas que cuentan igual, sin valor ni puntaje', (_codigo, sesiones) => {
    for (const x of parametrosDe(sesiones)) {
      expect(x['modo']).toBe('tarjeta');
      expect(x['opciones']).toHaveLength(3);
      expect(x['opciones'].every((o: any) => !('valor' in o))).toBe(true);
      expect(x['opciones'].map((o: any) => o.texto).at(-1)).toBe('Hoy no');
      expect(x['cierre']).toBeTruthy();
    }
  });

  it('BIE-03: a lo sumo «suele ayudar», nunca cura; sin alcohol, suplementos ni medicamentos; y avisa que una consulta no se sustituye', () => {
    const texto = JSON.stringify(parametrosDe(sesionesDeSueno()));

    expect(texto).not.toMatch(
      /cura|insomnio|alcohol|vino|cerveza|suplemento|vitamina|melatonina|pastilla|medic|f[aá]rmaco|te dormir[aá]s|garantiza|siempre funciona/i,
    );

    for (const x of parametrosDe(sesionesDeSueno())) {
      expect(x['nota']).toMatch(/profesional de la salud/);
    }
  });

  it('BIE-03: cada practica dice por que, con «suele» (nunca una promesa)', () => {
    for (const x of parametrosDe(sesionesDeSueno())) {
      expect(x['porQue']).toMatch(/suele|suelen/i);
    }
  });

  it('BIE-04: nada de dieta, peso, cuerpo ideal, comida buena o mala, ni restriccion o compensacion; sin objetivos numericos', () => {
    // Se miran el titulo y el texto de cada gesto; la nota dice justamente «sin metas ni cuentas».
    const texto = JSON.stringify(
      parametrosDe(sesionesDeCuidados()).map((x) => [x['titulo'], x['texto']]),
    );

    expect(texto).not.toMatch(
      /dieta|peso\b|calor[ií]a|adelgaz|cuerpo ideal|comida (buena|mala)|castig|compens|restring|ayun|\bmetas?\b/i,
    );
    expect(texto).not.toMatch(/\b\d+ (vasos|veces|litros|pasos)\b/);
  });

  it('BIE-04: el agua es uno de los 40 y la comida no se registra', () => {
    const textos = parametrosDe(sesionesDeCuidados()).map((x) => x['texto'] as string);

    expect(textos.filter((t) => /agua/i.test(t)).length).toBeGreaterThanOrEqual(1);
    expect(textos.filter((t) => /comida|cena|almuerzo|desayuno/i.test(t))).toEqual([]);
  });

  it('BIE-05: sin metas ni pasos contados ni comparar; con alternativa para quien no puede caminar; nada de noche', () => {
    const sesiones = parametrosDe(sesionesDeCaminatas());
    const texto = JSON.stringify(sesiones);

    expect(texto).not.toMatch(
      /\bpasos? contados|\d+ pasos|meta de|comparad|que ayer|mejor que|r[eé]cord|kil[oó]metro/i,
    );
    expect(texto).not.toMatch(/de noche|oscurezca\s+(sin|y no)|a oscuras|madrugada/i);

    for (const x of sesiones) {
      expect(x['nota']).toMatch(/seguros/);
      expect(x['nota']).toMatch(/ventana/);
      expect(x['texto']).toMatch(/Unos (5|10|20) minutos/);
    }
  });

  it('BIE-05: hay de los tres tamanos: 5, 10 y 20 minutos', () => {
    const tamanos = new Set(
      parametrosDe(sesionesDeCaminatas()).map((x) => /Unos (\d+) minutos/.exec(x['texto'])?.[1]),
    );

    expect([...tamanos].sort()).toEqual(['10', '20', '5']);
  });
});

describe('BIE-06 · Escaneo corporal', () => {
  const sesiones = sesionesDeEscaneo();
  const p = parametrosDe(sesiones);

  it('40: 27 con la voz calida y 13 con otra', () => {
    expect(sesiones).toHaveLength(40);
    expect(sesiones.filter((s) => /voz seca/.test(s.titulo))).toHaveLength(7);
    expect(sesiones.filter((s) => /voz breve/.test(s.titulo))).toHaveLength(6);
  });

  it('«puedes saltarte una zona o parar cuando quieras» siempre a la vista, y la advertencia ofrece cambiar o cerrar', () => {
    for (const x of p) {
      expect(x['avisoSiempre']).toBe('Puedes saltarte una zona o parar cuando quieras.');
      expect(x['advertenciaInicial']).toMatch(/cambia a la respiración o cierra/);
    }
  });

  it('nada de «relajate»; no se insiste; y ninguna zona se nombra como lo que deberia sentirse', () => {
    expect(JSON.stringify(p)).not.toMatch(
      /rel[aá]j|deber[ií]a|siente que|tienes que sentir|tensi[oó]n acumulada/i,
    );
  });

  it('el orden es el que dice el titulo', () => {
    for (const s of sesiones.filter((u) => /de abajo a arriba/.test(u.titulo))) {
      const zonas = (s.parametros as Parametros)['pasos'].map((paso: any) => paso.titulo);

      expect(zonas[0]).toBe('Los pies');
      expect(zonas.at(-1)).toBe('La cabeza y la cara');
    }

    for (const s of sesiones.filter((u) => /de arriba a abajo/.test(u.titulo))) {
      const zonas = (s.parametros as Parametros)['pasos'].map((paso: any) => paso.titulo);

      expect(zonas[0]).toBe('La cabeza y la cara');
      expect(zonas.at(-1)).toBe('Los pies');
    }
  });

  it('las de una mitad llevan tres zonas, y las demas seis', () => {
    for (const s of sesiones) {
      const zonas = (s.parametros as Parametros)['pasos'].length;

      expect(zonas, s.titulo).toBe(/solo la mitad/.test(s.titulo) ? 3 : 6);
    }
  });

  it('no hay dos iguales', () => {
    expect(new Set(sesiones.map((s) => JSON.stringify(s.parametros))).size).toBe(40);
  });
});

describe('BIE-07 · Antes de dormir', () => {
  const sesiones = sesionesDeAntesDeDormir();
  const p = parametrosDe(sesiones);

  it('40 listas de cuatro gestos, sin repetir dentro de una lista y ninguna lista igual a otra', () => {
    expect(sesiones).toHaveLength(40);

    for (const x of p) {
      expect(x['items']).toHaveLength(4);
      expect(new Set(x['items'].map((i: any) => i.texto)).size).toBe(4);
    }

    const listas = p.map((x) =>
      x['items']
        .map((i: any) => i.texto)
        .sort()
        .join('|'),
    );

    expect(new Set(listas).size).toBe(40);
  });

  it('el banco son 30 gestos y cada uno sale en cuatro o cinco listas', () => {
    const cuenta = new Map<string, number>();

    for (const x of p) {
      for (const item of x['items']) {
        cuenta.set(item.texto, (cuenta.get(item.texto) ?? 0) + 1);
      }
    }

    expect(cuenta.size).toBe(30);
    expect(Math.min(...cuenta.values())).toBeGreaterThanOrEqual(3);
    expect(Math.max(...cuenta.values())).toBeLessThanOrEqual(6);
  });

  it('no hay obligacion de marcar nada, y misma baranda de sueno que BIE-03: sin alcohol ni suplementos', () => {
    for (const x of p) {
      expect(x['indicacion']).toMatch(/Si no marcas ninguno, también está bien/);
    }

    expect(JSON.stringify(p)).not.toMatch(
      /alcohol|vino|cerveza|suplemento|pastilla|medic|f[aá]rmaco/i,
    );
  });
});

describe('BIE-08 · El descanso de manana', () => {
  const sesiones = sesionesDeDescanso();
  const p = parametrosDe(sesiones);

  it('8 preguntas de plan x 5 gestos de apoyo = 40, y ninguna pareja se repite', () => {
    expect(sesiones).toHaveLength(40);

    const parejas = p.map((x) => `${x['preguntas'][1].texto}|${x['preguntas'][2].texto}`);

    expect(new Set(parejas).size).toBe(40);
  });

  it('pide la hora de acostarse (campo nativo), ofrece el aviso de la noche sin activarlo y no sugiere horas ideales', () => {
    for (const x of p) {
      expect(x['preguntas'][0]).toMatchObject({ clave: 'hora', tipo: 'hora' });
      expect(x['enlaceAlAviso']).toBe(true);
    }

    const texto = JSON.stringify(p);

    expect(texto).not.toMatch(
      /ideal|horas de sueño|8 horas|ocho horas|levantarte a las|despertarte a las|meta/i,
    );
    expect(texto).not.toMatch(/\d{1,2}\s*(:|h\b|a\.\s*m|p\.\s*m)/i);
  });
});

describe('BIE-09 · Un respiro en medio del dia', () => {
  const sesiones = sesionesDeRespiro();
  const p = parametrosDe(sesiones);

  it('40 micro-pausas; cada sesion ofrece tres distintas de tres pasos', () => {
    expect(NUMERO_DE_MICRO_PAUSAS).toBe(40);
    expect(sesiones).toHaveLength(40);

    for (const x of p) {
      expect(x['elecciones']).toHaveLength(3);
      expect(new Set(x['elecciones'].map((e: any) => e.nombre)).size).toBe(3);

      for (const eleccion of x['elecciones']) {
        expect(eleccion.pasos).toHaveLength(3);
      }
    }
  });

  it('cada micro-pausa sale en tres menus: la persona escoge una por vez (excepcion razonada al tope de dos del ADR 0031)', () => {
    const cuenta = new Map<string, number>();

    for (const x of p) {
      for (const eleccion of x['elecciones']) {
        cuenta.set(eleccion.nombre, (cuenta.get(eleccion.nombre) ?? 0) + 1);
      }
    }

    expect(cuenta.size).toBe(40);
    expect([...new Set(cuenta.values())]).toEqual([3]);
  });

  it('no obliga a levantarse ni promete productividad', () => {
    const texto = textosDe(p).join(' ');

    expect(texto).not.toMatch(
      /lev[aá]ntate|ponte de pie|camina|sal de|productiv|rendir|concentra(rte)? mejor|trabajar mejor|eficien/i,
    );
  });
});
