import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { htmlDeLaHoja } from './hoja.ts';
import { NUCLEO } from './guion.ts';
import { PEDIDOS_DE_REVISION } from './pedidos.ts';
import { mecanicasPorRevisar, numeroDeSesion, referenciaDeSesion } from './porRevisar.ts';
import {
  Detenido,
  generarLaPublicacion,
  leerLasRespuestas,
  momentoDeLaRevision,
  SESIONES_DEL_PILOTO,
} from './publicacion.ts';
import {
  cadenasQueLeeLaPersona,
  CLAVES_TECNICAS,
  lineasParaRevisar,
  textosDelArbol,
} from './texto.ts';

/**
 * La revision del catalogo antes de publicarlo (SCRUM-228): que hay por revisar, como se lee, la hoja que se le da a
 * quien revisa y la migracion que sale de sus respuestas.
 *
 * Lo que se protege: que **todo texto que la persona va a leer salga en la hoja** (un texto que nadie vio no esta
 * revisado), que la hoja no publique nada por si sola y que la migracion **no invente una revision**: sin
 * revisor, sin fecha, con cambios o sin marcar, no hay sentencia.
 */

const catalogo = mecanicasPorRevisar();

type ConstruirRespuestas = (datos: unknown) => string;

/** La funcion de la hoja, tal como corre en el navegador de quien revisa. */
const construirRespuestas = runInNewContext(
  `${NUCLEO}; construirRespuestas`,
) as ConstruirRespuestas;

interface Marca {
  readonly decision: 'si' | 'cambios' | 'no' | 'nada';
  readonly noSale?: readonly number[];
  readonly comentario?: string;
}

/** Lo que produce la hoja al marcar las mecanicas dadas (las demas, sin marcar). */
function respuestasDe(
  revisor: string,
  fecha: string | undefined,
  marcas: Readonly<Record<string, Marca>>,
): string {
  return construirRespuestas({
    revisor,
    fecha,
    mecanicas: catalogo.map((m) => ({
      codigo: m.codigo,
      nombre: m.nombre,
      decision: marcas[m.codigo]?.decision ?? 'nada',
      comentario: marcas[m.codigo]?.comentario ?? '',
      sesiones: m.sesiones.map((s, i) => ({
        referencia: s.referencia,
        titulo: s.titulo,
        noSale: marcas[m.codigo]?.noSale?.includes(i) ?? false,
      })),
    })),
  });
}

function deLaMecanica(codigo: string) {
  const mecanica = catalogo.find((m) => m.codigo === codigo);

  if (mecanica === undefined) {
    throw new Error(`No hay ${codigo} por revisar`);
  }

  return mecanica;
}

// ---------------------------------------------------------------------------
// Lo que hay por revisar
// ---------------------------------------------------------------------------

describe('lo que hay por revisar', () => {
  it('son las 18 mecanicas que se siembran pendientes: COG-08, las nueve de Bienestar y ocho de Emociones', () => {
    expect(catalogo.map((m) => m.codigo)).toEqual([
      'COG-08',
      'BIE-01',
      'BIE-02',
      'BIE-03',
      'BIE-04',
      'BIE-05',
      'BIE-06',
      'BIE-07',
      'BIE-08',
      'BIE-09',
      'EMO-01',
      'EMO-02',
      'EMO-03',
      'EMO-04',
      'EMO-05',
      'EMO-07',
      'EMO-08',
      'EMO-09',
    ]);
  });

  it('suman 714 sesiones nuevas: las del piloto se revisan con su propia hoja', () => {
    const total = catalogo.reduce((suma, m) => suma + m.sesiones.length, 0);

    expect(total).toBe(40 + 357 + 317);
    expect(deLaMecanica('BIE-01').sesiones).toHaveLength(37);
    expect(deLaMecanica('EMO-02').sesiones).toHaveLength(37);
  });

  it('ninguna sesion por revisar se repite, y todas llevan el numero de su ficha', () => {
    const referencias = catalogo.flatMap((m) => m.sesiones.map((s) => s.referencia));

    expect(new Set(referencias).size).toBe(referencias.length);

    for (const mecanica of catalogo) {
      for (const sesion of mecanica.sesiones) {
        expect(sesion.referencia).toMatch(new RegExp(`^${mecanica.codigo}-\\d{3}$`, 'u'));
      }
    }
  });

  it('el numero de una sesion sale de su identificador', () => {
    expect(numeroDeSesion('5e510201-0000-4000-8000-000000000017')).toBe(17);
    expect(referenciaDeSesion('BIE-01', '5e510201-0000-4000-8000-000000000004')).toBe('BIE-01-004');
  });

  it('cada una dice quien la revisa y a que prestar atencion, y no sobra ninguna en la lista de pedidos', () => {
    for (const mecanica of catalogo) {
      expect(mecanica.pedido.quien.trim(), mecanica.codigo).not.toBe('');
      expect(mecanica.pedido.foco.trim(), mecanica.codigo).not.toBe('');
    }

    expect(Object.keys(PEDIDOS_DE_REVISION).sort()).toEqual(catalogo.map((m) => m.codigo).sort());
  });

  it('solo COG-08, BIE-05, BIE-08, BIE-09, EMO-05 y EMO-09 piden una revision ligera: las demas, profesional', () => {
    const ligeras = catalogo.filter((m) => m.pedido.revision === 'ligera').map((m) => m.codigo);

    expect(ligeras).toEqual(['COG-08', 'BIE-05', 'BIE-08', 'BIE-09', 'EMO-05', 'EMO-09']);
  });

  it('BIE-07 y EMO-09, que son solo de noche, lo dicen', () => {
    expect(deLaMecanica('BIE-07').franja).toBe('noche');
    expect(deLaMecanica('EMO-09').franja).toBe('noche');
    expect(deLaMecanica('BIE-02').franja).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// El texto que se lee
// ---------------------------------------------------------------------------

describe('el texto que lee quien revisa', () => {
  it('todo lo que la persona va a leer sale, en cada sesion pendiente del catalogo', () => {
    for (const mecanica of catalogo) {
      for (const sesion of mecanica.sesiones) {
        const mostrado = textosDelArbol(lineasParaRevisar(sesion.parametros)).join('\n');

        for (const cadena of cadenasQueLeeLaPersona(sesion.parametros)) {
          expect(mostrado, `${sesion.referencia}: falta «${cadena.slice(0, 60)}»`).toContain(
            cadena,
          );
        }
      }
    }
  });

  it('no sale nada tecnico: ni claves ni nombres de dibujos ni coordenadas', () => {
    const tecnicos = new Set<string>();

    for (const mecanica of catalogo) {
      for (const sesion of mecanica.sesiones) {
        const recorrer = (valor: unknown, clave: string): void => {
          if (CLAVES_TECNICAS.has(clave) && typeof valor === 'string') {
            tecnicos.add(valor);
          } else if (Array.isArray(valor)) {
            valor.forEach((v: unknown) => {
              recorrer(v, clave);
            });
          } else if (typeof valor === 'object' && valor !== null) {
            Object.entries(valor).forEach(([k, v]) => {
              recorrer(v, k);
            });
          }
        };

        recorrer(sesion.parametros, '');
      }
    }

    // Los nombres de dibujos (`cuello:inclinar-der`) y las claves (`calma`) no se le ensenan a quien revisa.
    const conDosPuntos = [...tecnicos].filter((valor) => valor.includes(':'));

    expect(conDosPuntos.length).toBeGreaterThan(0);

    for (const mecanica of catalogo.filter((m) => m.codigo === 'BIE-02')) {
      const hoja = textosDelArbol(lineasParaRevisar(mecanica.sesiones[0]?.parametros ?? {})).join(
        '\n',
      );

      for (const valor of conDosPuntos) {
        expect(hoja).not.toContain(valor);
      }
    }
  });

  it('el arbol pone una etiqueta a cada cosa y sube un texto unico a su etiqueta', () => {
    const lineas = lineasParaRevisar({
      indicacion: 'Elige una.',
      opciones: [
        { clave: 'a', texto: 'Una' },
        { clave: 'b', texto: 'Otra' },
      ],
    });

    expect(lineas).toEqual([
      { etiqueta: 'Indicación', texto: 'Elige una.' },
      {
        etiqueta: 'Opciones',
        hijos: [
          { etiqueta: 'Opción 1', texto: 'Una' },
          { etiqueta: 'Opción 2', texto: 'Otra' },
        ],
      },
    ]);
  });

  it('un nodo con nombre lo lleva en la etiqueta, y los hijos van dentro', () => {
    const [circulo] = lineasParaRevisar({
      rueda: [
        {
          clave: 'alegria',
          nombre: 'Alegría',
          hijos: [{ clave: 'calma', nombre: 'Calma', definicion: 'Estar en paz.' }],
        },
      ],
    });

    expect(circulo?.hijos?.[0]?.etiqueta).toBe('Círculo 1: Alegría');
    expect(circulo?.hijos?.[0]?.hijos?.[0]?.hijos?.[0]).toEqual({
      etiqueta: 'Opción 1: Calma',
      hijos: [{ etiqueta: 'Definición', texto: 'Estar en paz.' }],
    });
  });

  it('los numeros salen con su unidad y los «si» solo cuando la sesion los enciende', () => {
    const lineas = lineasParaRevisar({
      patron: { inhalaSegundos: 4, exhalaSegundos: 6, pausaSegundos: 0 },
      duracionSegundos: 120,
      conLineasDeAyuda: true,
      haptico: false,
      guardarParaManana: true,
    });
    const todo = JSON.stringify(lineas);

    expect(todo).toContain('4 s');
    expect(todo).toContain('120 s');
    expect(todo).toContain('Ofrece las líneas de atención');
    expect(todo).toContain('Se guarda en el diario');
    expect(todo).not.toContain('Vibra');
  });

  it('una clave que no conoce se muestra con su propio nombre: un texto que alguien no vio no esta revisado', () => {
    expect(lineasParaRevisar({ algoNuevo: 'Un texto nuevo' })).toEqual([
      { etiqueta: 'algoNuevo', texto: 'Un texto nuevo' },
    ]);
  });

  it('los puntos de COG-08 se resumen: sus coordenadas no son texto', () => {
    const [linea] = lineasParaRevisar({
      puntos: [
        { etiqueta: '1', x: 10, y: 20 },
        { etiqueta: '2', x: 30, y: 40 },
      ],
    });

    expect(linea).toEqual({ etiqueta: 'Puntos', texto: '2 puntos para unir en orden' });
  });
});

// ---------------------------------------------------------------------------
// La hoja
// ---------------------------------------------------------------------------

describe('la hoja de revision', () => {
  const bienestar = catalogo.filter((m) => m.categoria === 'Bienestar');
  const html = htmlDeLaHoja({ titulo: 'Hoja de prueba', mecanicas: bienestar });

  it('es un solo archivo: sin enlaces a otros sitios ni recursos externos', () => {
    expect(html).not.toMatch(/https?:\/\//u);
    expect(html).not.toMatch(/<link\b|<img\b|src=/u);
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<html lang="es">');
  });

  it('dice, antes que nada, que los textos son borradores y que nada se publica por llenarla', () => {
    expect(html).toContain('Estos textos son borradores.');
    expect(html).toContain('nada se publica por abrir ni llenar esta hoja');
    expect(html.indexOf('Estos textos son borradores.')).toBeLessThan(html.indexOf('Quién revisa'));
  });

  it('trae cada mecanica con su ficha, y cada sesion con su referencia y su casilla de «no sale»', () => {
    for (const mecanica of bienestar) {
      expect(html).toContain(`data-codigo="${mecanica.codigo}"`);
      expect(html).toContain(`Leer las ${String(mecanica.sesiones.length)} sesiones`);

      for (const sesion of mecanica.sesiones) {
        expect(html).toContain(`data-referencia="${sesion.referencia}"`);
      }
    }

    expect(html.match(/Esta no sale/gu)).toHaveLength(
      bienestar.reduce((s, m) => s + m.sesiones.length, 0),
    );
  });

  it('cada mecanica empieza sin marcar: lo que nadie marca no se publica', () => {
    expect(html.match(/value="nada" checked/gu)).toHaveLength(bienestar.length);
    expect(html.match(/ checked>/gu)).toHaveLength(bienestar.length);
  });

  it('cada decision tiene sus cuatro opciones, y «aprobada con cambios» avisa que nada sale mientras', () => {
    expect(html.match(/value="si"/gu)).toHaveLength(bienestar.length);
    expect(html.match(/value="cambios"/gu)).toHaveLength(bienestar.length);
    expect(html.match(/value="no"/gu)).toHaveLength(bienestar.length);
    expect(html).toContain('nada sale mientras');
  });

  it('pide el nombre o rol de quien revisa, sin datos de contacto, y la fecha', () => {
    expect(html).toContain('id="revisor"');
    expect(html).toContain('id="fecha"');
    expect(html).toContain('Sin teléfono ni correo');
  });

  it('el texto de las sesiones va escapado: un «<» en un texto no rompe la hoja', () => {
    const rara = {
      ...deLaMecanica('BIE-02'),
      sesiones: [
        {
          ...deLaMecanica('BIE-02').sesiones[0]!,
          titulo: 'Con <etiqueta> & "comillas"',
          parametros: { invitacion: '<script>alert(1)</script>' },
        },
      ],
    };
    const peligrosa = htmlDeLaHoja({ titulo: 'x', mecanicas: [rara] });

    expect(peligrosa).not.toContain('<script>alert(1)</script>');
    expect(peligrosa).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(peligrosa).toContain('Con &lt;etiqueta&gt; &amp; &quot;comillas&quot;');
  });

  it('con una sola mecanica o sesion habla en singular', () => {
    const una = htmlDeLaHoja({
      titulo: 'x',
      mecanicas: [
        { ...deLaMecanica('COG-08'), sesiones: deLaMecanica('COG-08').sesiones.slice(0, 1) },
      ],
    });

    expect(una).toContain('<strong>1 mecánica y 1 sesión</strong>');
  });

  it('lleva las mecanicas de una hoja nada mas: la de cada persona trae solo lo suyo', () => {
    const fisio = htmlDeLaHoja({ titulo: 'x', mecanicas: [deLaMecanica('BIE-02')] });

    expect(fisio).toContain('data-codigo="BIE-02"');
    expect(fisio).not.toContain('data-codigo="BIE-03"');
  });
});

// ---------------------------------------------------------------------------
// Las respuestas de la hoja
// ---------------------------------------------------------------------------

describe('lo que produce la hoja al copiar las respuestas', () => {
  it('dice a nombre de quien es, la fecha, y una fila por mecanica con su decision', () => {
    const texto = respuestasDe('Psicóloga clínica, revisión externa', '2026-10-23', {
      'COG-08': { decision: 'si' },
      'BIE-02': { decision: 'no' },
    });

    expect(texto).toContain('Revisión a nombre de: Psicóloga clínica, revisión externa');
    expect(texto).toContain('Fecha de la revisión: 2026-10-23');
    expect(texto).toContain('COG-08 · Une los puntos en orden: Aprobada');
    expect(texto).toContain('BIE-02 · Pausa de estiramiento: No sale');
    expect(texto).toContain('BIE-03 · El hábito de sueño de hoy: Sin marcar');
  });

  it('sin nombre dice «(sin indicar)»: la migracion no se escribe', () => {
    expect(respuestasDe('  ', '2026-10-23', {})).toContain('Revisión a nombre de: (sin indicar)');
  });

  it('las sesiones «no salen» solo cuentan si la mecanica esta aprobada', () => {
    const aprobada = respuestasDe('Ana', '2026-10-23', {
      'COG-08': { decision: 'si', noSale: [3] },
    });
    const rechazada = respuestasDe('Ana', '2026-10-23', {
      'COG-08': { decision: 'no', noSale: [3] },
    });

    expect(aprobada).toContain('COG-08-004 · ');
    expect(aprobada).toContain('Sesiones que no salen');
    expect(rechazada).not.toContain('COG-08-004');
  });

  it('el comentario va en una sola linea', () => {
    const texto = respuestasDe('Ana', '2026-10-23', {
      'COG-08': { decision: 'si', comentario: 'Una cosa.\n\n  Otra cosa.' },
    });

    expect(texto).toContain('Comentario COG-08: Una cosa. Otra cosa.');
  });
});

describe('leerLasRespuestas', () => {
  it('lee a nombre de quien es, la fecha, las decisiones, las que no salen y los comentarios', () => {
    const lectura = leerLasRespuestas(
      respuestasDe('Ana', '2026-10-23', {
        'BIE-02': { decision: 'si', noSale: [1, 5], comentario: 'Bien.' },
        'BIE-03': { decision: 'no' },
        'BIE-04': { decision: 'cambios' },
      }),
    );

    expect(lectura.revisor).toBe('Ana');
    expect(lectura.fecha).toBe('2026-10-23');
    expect(lectura.mecanicas['BIE-02']).toBe('aprobada');
    expect(lectura.mecanicas['BIE-03']).toBe('no_sale');
    expect(lectura.mecanicas['BIE-04']).toBe('con_cambios');
    expect(lectura.mecanicas['BIE-05']).toBe('sin_marcar');
    expect(lectura.sinSalir).toEqual(['BIE-02-002', 'BIE-02-006']);
    expect(lectura.comentarios['BIE-02']).toBe('Bien.');
  });

  it('un texto vacio o sin nada reconocible no inventa decisiones', () => {
    const lectura = leerLasRespuestas('hola');

    expect(lectura.revisor).toBe('');
    expect(lectura.fecha).toBeUndefined();
    expect(lectura.mecanicas).toEqual({});
  });

  it('entiende los saltos de linea de Windows', () => {
    const lectura = leerLasRespuestas('Revisión a nombre de: Ana\r\nBIE-02 · Pausa: Aprobada\r\n');

    expect(lectura.revisor).toBe('Ana');
    expect(lectura.mecanicas['BIE-02']).toBe('aprobada');
  });

  it('un titulo con dos puntos y comillas no confunde la decision', () => {
    const lectura = leerLasRespuestas('BIE-02-004 · Cuello: la oreja "al" hombro: No sale');

    expect(lectura.sinSalir).toEqual(['BIE-02-004']);
  });

  it('reconoce las filas de la hoja del piloto, con el mismo formato', () => {
    const lectura = leerLasRespuestas(
      [
        'Revisión a nombre de: Ana',
        'BIE-01-001 · Inhalar 4, exhalar 6: Aprobada',
        'EMO-02-003 · Algo: No sale',
      ].join('\n'),
    );

    expect(lectura.piloto).toEqual({ 'BIE-01-001': 'aprobada', 'EMO-02-003': 'no_sale' });
    expect(lectura.sinSalir).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// La migracion
// ---------------------------------------------------------------------------

describe('la migracion que publica lo revisado', () => {
  const FECHA = '2026-10-23';

  function publicar(...hojas: string[]) {
    return generarLaPublicacion(hojas);
  }

  function detenida(...hojas: string[]): string {
    try {
      generarLaPublicacion(hojas);
    } catch (error) {
      if (error instanceof Detenido) {
        return error.message;
      }

      throw error;
    }

    throw new Error('No se detuvo');
  }

  it('una mecanica aprobada publica todas sus sesiones, una por una, con quien revisó y cuando', () => {
    const { sql, publicadas, porMecanica } = publicar(
      respuestasDe("Ana 'la' revisora", FECHA, { 'COG-08': { decision: 'si' } }),
    );
    const cog08 = deLaMecanica('COG-08');

    expect(publicadas).toBe(40);
    expect(porMecanica).toEqual([
      { codigo: 'COG-08', revisor: "Ana 'la' revisora", publicadas: 40, sinSalir: 0 },
    ]);
    expect(sql).toContain(`"revisada_por" = 'Ana ''la'' revisora'`);
    expect(sql).toContain(`"revisada_el" = '${momentoDeLaRevision(FECHA)}'::timestamptz`);
    expect(sql).toContain(`WHERE "id_actividad" = '${cog08.id}'`);
    expect(sql).toContain(`AND "revision" = 'pendiente'`);

    for (const sesion of cog08.sesiones) {
      expect(sql).toContain(`'${sesion.id}'`);
    }
  });

  it('la fecha de una hoja es mediodia en Colombia', () => {
    expect(momentoDeLaRevision('2026-10-23')).toBe('2026-10-23T12:00:00-05:00');
  });

  it('las sesiones que la hoja deja fuera no se publican, y las demas si', () => {
    const { sql, publicadas, porMecanica } = publicar(
      respuestasDe('Ana', FECHA, { 'BIE-02': { decision: 'si', noSale: [1, 5] } }),
    );
    const sesiones = deLaMecanica('BIE-02').sesiones;

    expect(publicadas).toBe(38);
    expect(porMecanica[0]?.sinSalir).toBe(2);
    expect(sql).not.toContain(sesiones[1]?.id ?? 'x');
    expect(sql).not.toContain(sesiones[5]?.id ?? 'x');
    expect(sql).toContain(sesiones[0]?.id ?? 'x');
    expect(sql).toContain('2 no sale(n)');
  });

  it('lo que no se aprobo no genera ninguna sentencia: queda pendiente, con su motivo', () => {
    const { sql, pendientes } = publicar(
      respuestasDe('Ana', FECHA, { 'COG-08': { decision: 'si' }, 'BIE-02': { decision: 'no' } }),
    );

    expect(sql).not.toContain(deLaMecanica('BIE-02').id);
    expect(sql).not.toContain(deLaMecanica('BIE-03').id);
    expect(pendientes.find((p) => p.codigo === 'BIE-02')?.motivo).toContain('No sale');
    expect(pendientes.find((p) => p.codigo === 'BIE-03')?.motivo).toContain('Sin marcar');
    expect(pendientes).toHaveLength(17);
  });

  it('dos personas, dos mecanicas: cada sentencia lleva su revisor y su fecha', () => {
    const { sql, porMecanica } = publicar(
      respuestasDe('Fisioterapeuta', '2026-10-22', { 'BIE-02': { decision: 'si' } }),
      respuestasDe('Psicóloga', '2026-10-24', { 'EMO-03': { decision: 'si' } }),
    );

    expect(porMecanica.map((m) => [m.codigo, m.revisor])).toEqual([
      ['BIE-02', 'Fisioterapeuta'],
      ['EMO-03', 'Psicóloga'],
    ]);
    expect(sql).toContain(`'Fisioterapeuta'`);
    expect(sql).toContain(`'2026-10-22T12:00:00-05:00'::timestamptz`);
    expect(sql).toContain(`'2026-10-24T12:00:00-05:00'::timestamptz`);
  });

  describe('se detiene, sin escribir nada, cuando', () => {
    it('la hoja no dice a nombre de quien es', () => {
      expect(detenida(respuestasDe('', FECHA, { 'COG-08': { decision: 'si' } }))).toContain(
        'a nombre de quien',
      );
    });

    it('la hoja no dice la fecha', () => {
      expect(detenida(respuestasDe('Ana', undefined, { 'COG-08': { decision: 'si' } }))).toContain(
        'no dice la fecha',
      );
    });

    it('alguna mecanica esta aprobada con cambios: el texto nuevo lo escribe una persona', () => {
      const mensaje = detenida(
        respuestasDe('Ana', FECHA, {
          'COG-08': { decision: 'si' },
          'BIE-02': { decision: 'cambios' },
        }),
      );

      expect(mensaje).toContain('BIE-02');
      expect(mensaje).toContain('con cambios');
    });

    it('la misma mecanica esta aprobada en dos hojas', () => {
      const mensaje = detenida(
        respuestasDe('Ana', FECHA, { 'BIE-02': { decision: 'si' } }),
        respuestasDe('Luis', FECHA, { 'BIE-02': { decision: 'si' } }),
      );

      expect(mensaje).toContain('dos hojas');
    });

    it('una hoja habla de una sesion o de una mecanica que no existen', () => {
      expect(
        detenida(
          `Revisión a nombre de: Ana\nFecha de la revisión: ${FECHA}\nBIE-02-099 · Algo: No sale\nBIE-02 · Pausa: Aprobada\n`,
        ),
      ).toContain('no existe');
      expect(
        detenida(
          `Revisión a nombre de: Ana\nFecha de la revisión: ${FECHA}\nCOG-01 · Recuerda los colores: Aprobada\n`,
        ),
      ).toContain('no esta entre lo que se revisa');
    });

    it('ninguna mecanica quedo aprobada', () => {
      expect(detenida(respuestasDe('Ana', FECHA, { 'COG-08': { decision: 'no' } }))).toContain(
        'nada que publicar',
      );
    });

    it('no hay hojas', () => {
      expect(detenida()).toContain('ninguna hoja');
    });

    it('se pide que nada quede sin marcar y algo quedo', () => {
      expect(() =>
        generarLaPublicacion([respuestasDe('Ana', FECHA, { 'COG-08': { decision: 'si' } })], {
          exigirTodo: true,
        }),
      ).toThrow(Detenido);
    });
  });

  it('una fecha dada por --fecha pisa la de las hojas, y tiene que traer zona', () => {
    const conFecha = generarLaPublicacion(
      [respuestasDe('Ana', undefined, { 'COG-08': { decision: 'si' } })],
      {
        fecha: '2026-10-25T09:30:00-05:00',
      },
    );

    expect(conFecha.sql).toContain(`'2026-10-25T09:30:00-05:00'::timestamptz`);
    expect(() =>
      generarLaPublicacion([respuestasDe('Ana', undefined, { 'COG-08': { decision: 'si' } })], {
        fecha: '2026-10-25',
      }),
    ).toThrow(Detenido);
  });

  it('los comentarios de quien reviso salen como avisos: no se pierden', () => {
    const { avisos } = publicar(
      respuestasDe('Ana', FECHA, {
        'COG-08': { decision: 'si', comentario: 'Revisar el tono del 7.' },
      }),
    );

    expect(avisos).toContain('Comentario de Ana sobre COG-08: Revisar el tono del 7.');
  });

  describe('con las seis sesiones del piloto, de la hoja del piloto', () => {
    const PILOTO = `Revisión a nombre de: Ana
Fecha de la revisión: ${FECHA}
BIE-01-001 · Inhalar 4, exhalar 6: Aprobada
BIE-01-002 · Otra: No sale
BIE-01-003 · Una mas: Aprobada
EMO-02-001 · Algo: Aprobada
`;

    it('publica las aprobadas del piloto junto con la mecanica, en la misma sentencia de BIE-01', () => {
      const { sql, publicadas } = publicar(
        `${PILOTO}\n${respuestasDe('Ana', FECHA, { 'BIE-01': { decision: 'si' } })}`,
      );

      expect(publicadas).toBe(37 + 2 + 1);
      expect(sql).toContain(SESIONES_DEL_PILOTO['BIE-01-001']);
      expect(sql).toContain(SESIONES_DEL_PILOTO['BIE-01-003']);
      expect(sql).not.toContain(SESIONES_DEL_PILOTO['BIE-01-002']);
      expect(sql).toContain(SESIONES_DEL_PILOTO['EMO-02-001']);
    });

    it('las del piloto no salen si la hoja no las aprobo, aunque la mecanica si', () => {
      const { sql } = publicar(respuestasDe('Ana', FECHA, { 'BIE-01': { decision: 'si' } }));

      for (const id of Object.values(SESIONES_DEL_PILOTO)) {
        expect(sql).not.toContain(id);
      }
    });

    it('una sesion del piloto aprobada con cambios detiene todo', () => {
      expect(() =>
        generarLaPublicacion([
          `Revisión a nombre de: Ana\nFecha de la revisión: ${FECHA}\nBIE-01-001 · X: Aprobada con cambios\n`,
        ]),
      ).toThrow(Detenido);
    });
  });

  it('el SQL es solo datos: ni DDL ni borrados, y cada UPDATE cierra con punto y coma', () => {
    const { sql } = publicar(
      respuestasDe(
        'Ana',
        FECHA,
        Object.fromEntries(catalogo.map((m) => [m.codigo, { decision: 'si' as const }])),
      ),
    );

    expect(sql).not.toMatch(/\b(DROP|DELETE|TRUNCATE|ALTER|CREATE|INSERT)\b/iu);
    expect(sql.match(/^UPDATE /gmu)).toHaveLength(catalogo.length);
    expect(sql.match(/^ {2}\);$/gmu)).toHaveLength(catalogo.length);
  });

  it('aprobar todo publica las 714 sesiones nuevas, y cada identificador sale una sola vez', () => {
    const { sql, publicadas } = publicar(
      respuestasDe(
        'Ana',
        FECHA,
        Object.fromEntries(catalogo.map((m) => [m.codigo, { decision: 'si' as const }])),
      ),
    );
    const ids = [...sql.matchAll(/^ {4}'([0-9a-f-]{36})'/gmu)].map(([, id]) => id);

    expect(publicadas).toBe(714);
    expect(ids).toHaveLength(714);
    expect(new Set(ids).size).toBe(714);
  });

  it('es una funcion pura de lo que se le da: la misma entrada, el mismo SQL', () => {
    const hoja = respuestasDe('Ana', FECHA, { 'BIE-02': { decision: 'si', noSale: [2] } });

    expect(publicar(hoja).sql).toBe(publicar(hoja).sql);
  });
});
