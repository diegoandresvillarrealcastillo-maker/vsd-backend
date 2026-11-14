/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call --
   Esta prueba lee el JSON de las sesiones sin tipos a proposito: su forma ya la comprueba el contrato del
   motor (catalogo.spec.ts), y aqui se mira lo que afirma cada ficha, no la forma. */
import { describe, expect, it } from 'vitest';
import { sesionesDeAcompanamiento } from './acompanan.ts';
import { sesionesDeAncla } from './ancla.ts';
import { sesionesDeControlo } from './controlo.ts';
import { sesionesDeCarta, sesionesDeCierre, sesionesDeTresCosas } from './escritura.ts';
import { loteDeEmociones } from './index.ts';
import { sesionesDeLugar } from './lugar.ts';
import { FAMILIAS, laRueda, sesionesDeRueda } from './rueda.ts';

/**
 * Lo propio de cada mecanica de Emociones (SCRUM-224): las barandas de las fichas EMO-01 a EMO-09 hechas
 * prueba. Lo general (contrato, lenguaje clinico, tono, 40 sesiones) lo comprueba `catalogo.spec.ts`.
 */

type Parametros = Record<string, any>;

const parametrosDe = (sesiones: { parametros: unknown }[]) =>
  sesiones.map((s) => s.parametros as Parametros);

describe('el lote de Emociones', () => {
  const lote = loteDeEmociones();

  it('ocho mecanicas, sin EMO-06 (diferida, D-C4): ninguna puntua y nada sale publicado', () => {
    expect(lote.mecanicas.map((m) => m.codigo)).toEqual([
      'EMO-01',
      'EMO-02',
      'EMO-03',
      'EMO-04',
      'EMO-05',
      'EMO-07',
      'EMO-08',
      'EMO-09',
    ]);

    for (const mecanica of lote.mecanicas) {
      expect(mecanica.direccion, mecanica.codigo).toBe('sin_puntaje');
      expect(mecanica.revision, mecanica.codigo).toBe('pendiente');
      expect(mecanica.publicar, mecanica.codigo).toBe(false);
    }
  });

  it('solo «El cierre del dia» tiene franja, y es la noche', () => {
    expect(
      lote.mecanicas.filter((m) => m.franja !== undefined).map((m) => [m.codigo, m.franja]),
    ).toEqual([['EMO-09', 'noche']]);
  });
});

describe('EMO-01 · Rueda de emociones', () => {
  const hojas = FAMILIAS.flatMap((f) => f.matices.flatMap((matiz) => matiz.hojas));

  it('6 circulos grandes, 30 mas finos y 90 emociones, todas con su definicion', () => {
    expect(FAMILIAS).toHaveLength(6);
    expect(FAMILIAS.flatMap((f) => f.matices)).toHaveLength(30);
    expect(hojas).toHaveLength(90);
    expect(
      hojas.every((hoja) => hoja.definicion.length > 10 && hoja.definicion.length <= 160),
    ).toBe(true);
  });

  it('ninguna emocion se repite, y las claves de toda la rueda son unicas', () => {
    expect(new Set(hojas.map((hoja) => hoja.nombre)).size).toBe(90);

    const claves: string[] = [];
    const recorrer = (nodos: any[]) => {
      for (const nodo of nodos) {
        claves.push(nodo.clave);
        recorrer(nodo.hijos ?? []);
      }
    };

    recorrer(laRueda());
    expect(new Set(claves).size).toBe(claves.length);
  });

  it('no hay emociones buenas ni malas, ninguna definicion interpreta ni sugiere una causa, y nada suena a diagnostico', () => {
    const definiciones = hojas.map((hoja) => hoja.definicion).join(' ');

    expect(definiciones).not.toMatch(
      /significa que|eso quiere decir|porque (tú|tu|te)|por tu culpa|es normal que|deber[ií]as|est[aá]s mal|est[aá]s bien|negativ|positiv|malo|mala\b/i,
    );
  });

  it('incluye emociones que cuesta nombrar: vacio, sin palabras, mezcladas, ambivalencia', () => {
    const nombres = hojas.map((hoja) => hoja.nombre);

    for (const esperada of [
      'Vacío',
      'Sin palabras',
      'Emociones mezcladas',
      'Ambivalencia',
      'Neutralidad',
    ]) {
      expect(nombres).toContain(esperada);
    }
  });

  it('40 sesiones: seis puertas de entrada por siete cierres, la misma rueda en todas, con una linea opcional', () => {
    const sesiones = sesionesDeRueda();
    const p = parametrosDe(sesiones);

    expect(sesiones).toHaveLength(40);
    expect(new Set(p.map((x) => x['puerta'].titulo)).size).toBe(6);
    expect(new Set(p.map((x) => `${x['puerta'].titulo}|${x['cierre']}`)).size).toBe(40);
    expect(new Set(p.map((x) => JSON.stringify(x['rueda']))).size).toBe(1);

    for (const x of p) {
      expect(x['linea']).toMatchObject({ largoMaximo: 200 });
    }
  });
});

describe('EMO-02 · Tres cosas buenas', () => {
  const sesiones = sesionesDeTresCosas();
  const p = parametrosDe(sesiones);

  it('37 lentes nuevas, hasta tres lineas, con una basta y siempre «hoy no sale ninguna»', () => {
    expect(sesiones).toHaveLength(37);

    for (const x of p) {
      expect(x).toMatchObject({ campos: 3, minimo: 1, largoMaximo: 200, permiteNingunaHoy: true });
    }
  });

  it('nada de «deberias estar agradecida», ni de comida, ni positividad forzada', () => {
    expect(JSON.stringify(p)).not.toMatch(
      /deber[ií]as|tienes que|siempre hay|todo pasa por algo|piensa en positivo|comiste|bebiste|cenaste|almorzaste|desayunaste|comida|alimento/i,
    );
  });

  it('las 40 lentes son distintas (con las 3 del piloto)', () => {
    const invitaciones = p.map((x) => x['invitacion'].toLowerCase());

    expect(new Set(invitaciones).size).toBe(37);
    expect(invitaciones).not.toContain('algo que probaste hoy, aunque sea pequeño.');
  });
});

describe('EMO-03 · Ancla 5-4-3-2-1', () => {
  const sesiones = sesionesDeAncla();
  const p = parametrosDe(sesiones);

  it('40: 5 entornos x 4 guiones x 2 voces, todos de cinco pasos y sin tiempo', () => {
    expect(sesiones).toHaveLength(40);
    expect(new Set(sesiones.map((s) => s.titulo)).size).toBe(40);

    for (const x of p) {
      expect(x['pasos']).toHaveLength(5);
      expect(x['avance']).toBe('manual');
      expect(JSON.stringify(x['pasos'])).not.toMatch(/segundos|minutos|cronometr/i);
    }
  });

  it('«si lo necesitas, hay personas que pueden acompanarte» siempre visible, con el acceso a las lineas', () => {
    for (const x of p) {
      expect(x['avisoSiempre']).toBe('Si lo necesitas, hay personas que pueden acompañarte.');
      expect(x['conLineasDeAyuda']).toBe(true);
    }
  });

  it('no obliga a cerrar los ojos y nunca dice «relajate»', () => {
    for (const x of p) {
      expect(x['advertenciaInicial']).toMatch(/No hace falta cerrar los ojos/);
      expect(JSON.stringify(x['pasos'])).not.toMatch(/cierra los ojos|rel[aá]j/i);
    }
  });

  it('el guion corto y el largo recorren los cinco sentidos en orden: 5, 4, 3, 2, 1', () => {
    const titulos = (s: any) => s.parametros['pasos'].map((paso: any) => paso.titulo);
    const completos = sesiones.filter((s) => /corto|largo/.test(s.titulo));

    expect(completos).toHaveLength(20);

    for (const s of completos) {
      expect(titulos(s)).toEqual([
        'Cinco cosas que ves',
        'Cuatro cosas que tocas',
        'Tres cosas que oyes',
        'Dos olores',
        'Un sabor',
      ]);
    }
  });
});

describe('EMO-04 · Lo que si controlo', () => {
  const sesiones = sesionesDeControlo();
  const p = parametrosDe(sesiones);

  it('40 situaciones de 6 tarjetas = 240, tres cestas y sin respuesta correcta (no puntua)', () => {
    expect(sesiones).toHaveLength(40);

    for (const x of p) {
      expect(x['elementos']).toHaveLength(6);
      expect(x['cestas'].map((c: any) => c.nombre)).toEqual([
        'Depende de mí',
        'Depende en parte',
        'No depende de mí',
      ]);
      expect(x['elementos'].every((e: any) => !('cesta' in e))).toBe(true);
      expect('puntosMaximos' in x).toBe(false);
    }
  });

  it('las situaciones son de otra persona y neutras: nunca se pide la propia', () => {
    expect(JSON.stringify(p.map((x) => x['indicacion']))).not.toMatch(
      /tu situaci[oó]n|tu caso|cu[eé]ntanos|cuenta qu[eé] te pasa|lo que te pasa/i,
    );
  });

  it('no culpa ni minimiza: nada de «si quisieras», «basta con querer» ni «solo tienes que»', () => {
    expect(JSON.stringify(p)).not.toMatch(
      /si quisieras|si tú quisieras|bastar[ií]a con querer|basta con querer|solo tienes que|solo hace falta|es cuesti[oó]n de actitud|por tu culpa|tu error/i,
    );
  });

  it('ninguna situacion se repite y ninguna tarjeta se repite dentro de una situacion', () => {
    expect(new Set(sesiones.map((s) => s.titulo)).size).toBe(40);

    for (const x of p) {
      const nombres = x['elementos'].map((e: any) => e.nombre.toLowerCase());

      expect(new Set(nombres).size).toBe(6);
    }
  });
});

describe('EMO-05 · Carta a mi de manana', () => {
  const sesiones = sesionesDeCarta();
  const p = parametrosDe(sesiones);

  it('40 invitaciones distintas, una carta de hasta 500 caracteres que se guarda para manana', () => {
    expect(sesiones).toHaveLength(40);

    for (const x of p) {
      expect(x).toMatchObject({ campos: 1, largoMaximo: 500, guardarParaManana: true });
    }

    expect(new Set(p.map((x) => x['invitacion'])).size).toBe(40);
  });

  it('el cierre dice lo que de verdad pasa: queda en el diario, sin prometer que reaparecera ni que se podra borrar sin leer', () => {
    for (const x of p) {
      expect(x['cierre']).toBe('Quedó guardada en tu diario.');
      expect(String(x['cierre'])).not.toMatch(/ma[ñn]ana|aparecer|borr|devolver/i);
    }
  });

  it('lo escrito en un mal dia lo lee quien despierta manana: las invitaciones son amables y no presionan', () => {
    expect(JSON.stringify(p)).not.toMatch(
      /debes|tienes que|promete|prop[oó]n(te)?|meta|objetivo|resoluci[oó]n|mejor(ar)? ma[ñn]ana/i,
    );
  });
});

describe('EMO-07 · Mi lugar tranquilo', () => {
  const sesiones = sesionesDeLugar();
  const p = parametrosDe(sesiones);
  const ABIERTOS = new Set(['bosque', 'paramo', 'cafetal', 'montana', 'patio']);

  it('40: cinco momentos por ocho ternas, y cada sesion ofrece tres lugares de cinco pasos', () => {
    expect(sesiones).toHaveLength(40);

    for (const x of p) {
      expect(x['elecciones']).toHaveLength(3);
      expect(new Set(x['elecciones'].map((e: any) => e.clave)).size).toBe(3);

      for (const eleccion of x['elecciones']) {
        expect(eleccion.pasos).toHaveLength(5);
      }
    }
  });

  it('el primero que se ofrece es siempre un lugar abierto y sin agua: ni rio, ni playa, ni cuarto', () => {
    for (const x of p) {
      expect(ABIERTOS.has(x['elecciones'][0].clave), x['intro']).toBe(true);
    }
  });

  it('cada ambiente sale en tres menus de cada momento: la persona escoge, nada se impone', () => {
    for (let momento = 0; momento < 5; momento++) {
      const cuenta = new Map<string, number>();

      for (const x of p.slice(momento * 8, (momento + 1) * 8)) {
        for (const eleccion of x['elecciones']) {
          cuenta.set(eleccion.clave, (cuenta.get(eleccion.clave) ?? 0) + 1);
        }
      }

      expect(cuenta.size).toBe(8);
      expect([...new Set(cuenta.values())]).toEqual([3]);
    }
  });

  it('«si un lugar te incomoda, cambialo» a la vista; nunca «estas a salvo»; sin agua profunda ni tormenta', () => {
    for (const x of p) {
      expect(x['avisoSiempre']).toBe('Si un lugar te incomoda, cámbialo.');
      expect(x['advertenciaInicial']).toMatch(/cámbialo por otro o suéltalo/);
    }

    const texto = JSON.stringify(p);

    expect(texto).not.toMatch(
      /a salvo|seguro de|nada malo|profund[oa]s?(?<! poco profunda)|tormenta(?<!sin tormenta)|ahog|oscuridad total/i,
    );
  });
});

describe('EMO-08 · Quien me acompana', () => {
  const sesiones = sesionesDeAcompanamiento();
  const p = parametrosDe(sesiones);

  it('40 preguntas, cada una con seis tipos de persona y «aun no se»', () => {
    expect(sesiones).toHaveLength(40);
    expect(new Set(p.map((x) => x['preguntas'][0].texto)).size).toBe(40);

    for (const x of p) {
      expect(x['preguntas'][0].opciones.map((o: any) => o.clave)).toEqual([
        'familia',
        'amistad',
        'estudio-trabajo',
        'profesional',
        'comunidad',
        'aun-no-se',
      ]);
    }
  });

  it('no guarda nombres ni telefonos: la respuesta es un tipo y no hay ningun campo de texto', () => {
    for (const x of p) {
      expect(x['preguntas'].every((q: any) => q.tipo === 'opcion')).toBe(true);
      expect(x['indicacion']).toMatch(/No guardamos nombres ni teléfonos/);
    }
  });

  it('cada pantalla enlaza a las lineas de atencion sin esperar una semana, y el cierre no depende de lo respondido', () => {
    for (const x of p) {
      expect(x['conLineasDeAyuda']).toBe(true);
      expect(x['avisoSiempre']).toBe('Si lo necesitas, hay personas que pueden acompañarte.');
      expect(x['cierre']).toBe('Gracias por pensarlo con calma.');
    }
  });

  it('no presume que la persona tiene o no tiene a nadie (R13)', () => {
    expect(JSON.stringify(p.map((x) => x['preguntas'][0].texto))).not.toMatch(
      /est[aá]s solo|est[aá]s sola|nadie te|no tienes a nadie|siempre habr[aá]|tienes a alguien/i,
    );
  });
});

describe('EMO-09 · El cierre del dia', () => {
  const sesiones = sesionesDeCierre();
  const p = parametrosDe(sesiones);

  it('40 pares de invitaciones, dos lineas y la opcion «hoy lo dejo todo para manana»', () => {
    expect(sesiones).toHaveLength(40);
    expect(new Set(p.map((x) => x['etiquetas'].join('|'))).size).toBe(40);

    for (const x of p) {
      expect(x).toMatchObject({
        campos: 2,
        minimo: 1,
        permiteNingunaHoy: true,
        textoNinguna: 'Hoy lo dejo todo para mañana',
      });
      expect(x['etiquetas']).toHaveLength(2);
    }
  });

  it('no resume ni interpreta el dia, y el tono de la noche es mas lento', () => {
    for (const x of p) {
      expect(x['invitacion']).toBe('Dos líneas para cerrar el día, sin resumir ni evaluar nada.');
    }

    expect(JSON.stringify(p)).not.toMatch(
      /balance|logros|fracasos|qu[eé] tal te fue|c[oó]mo te fue/i,
    );
  });
});
