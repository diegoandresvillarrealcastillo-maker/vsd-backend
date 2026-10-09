import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CARPETA_DE_GENERADOS,
  CARPETA_DE_PIEZAS,
  CLASES_CON_MODO_OSCURO,
  RUTA_DE_LA_PLANTILLA,
  construirCorreo,
  construirCorreos,
  escaparTexto,
  rellenar,
  type PiezasDeLaPlantilla,
} from './construirCorreos.js';
import { CORREOS, type ContenidoDelCorreo } from './contenidos.js';
import { CLARO, OSCURO, contraste, type Paleta } from './paleta.js';

/**
 * Los correos de Supabase Auth (SCRUM-125).
 *
 * Un correo no se puede probar en un navegador: lo que importa es que respete
 * lo que los clientes de correo entienden. Estas pruebas vigilan esas reglas, y
 * que lo que hay en `correos/generados/` sea exactamente lo que se genera.
 */

const correos = construirCorreos();

/**
 * Las variables de Supabase que lleva cada correo ademas de `{{ .SiteURL }}`. Se
 * escriben aqui aparte de `contenidos.ts`, a proposito: la prueba es la que
 * dice que cada plantilla de Supabase recibe solo lo que Supabase le da.
 */
const VARIABLES_PROPIAS: Readonly<Record<string, readonly string[]>> = {
  'confirmar-cuenta': ['.ConfirmationURL'],
  'recuperar-contrasena': ['.ConfirmationURL'],
  'cambiar-correo': ['.ConfirmationURL', '.NewEmail'],
  'codigo-de-verificacion': ['.Token'],
  'aviso-contrasena-cambiada': [],
  'aviso-correo-cambiado': ['.OldEmail', '.Email'],
  'aviso-metodo-vinculado': ['.Provider'],
};

/** Sin los comentarios condicionales de Outlook, que son otro documento para otro motor. */
function sinCondicionales(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

/** Las variables de Supabase que usa un correo, sin los espacios. */
function variablesDe(html: string): string[] {
  return [...html.matchAll(/\{\{\s*(\.[A-Za-z]+)\s*\}\}/g)].map((coincidencia) => coincidencia[1]!);
}

function textoVisible(html: string): string {
  return sinCondicionales(html)
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ');
}

describe('los correos generados', () => {
  it('son siete, cada uno con su plantilla de Supabase y sus dos campos de la API', () => {
    expect(correos.map((correo) => correo.plantillaEnSupabase)).toEqual([
      'Confirm sign up',
      'Reset password',
      'Change email address',
      'Reauthentication',
      'Password changed',
      'Email address changed',
      'Sign-in method linked',
    ]);
    expect(new Set(correos.map((correo) => correo.asunto)).size).toBe(7);
    expect(new Set(correos.map((correo) => correo.campoDelContenido)).size).toBe(7);
    expect(correos.map((correo) => correo.campoDelContenido)).toEqual([
      'mailer_templates_confirmation_content',
      'mailer_templates_recovery_content',
      'mailer_templates_email_change_content',
      'mailer_templates_reauthentication_content',
      'mailer_templates_password_changed_notification_content',
      'mailer_templates_email_changed_notification_content',
      'mailer_templates_identity_linked_notification_content',
    ]);
  });

  it('cada tipo hace una cosa: el enlace se toca, el codigo se escribe y el aviso solo se lee', () => {
    expect(CORREOS.map((contenido) => [contenido.archivo, contenido.tipo])).toEqual([
      ['confirmar-cuenta', 'enlace'],
      ['recuperar-contrasena', 'enlace'],
      ['cambiar-correo', 'enlace'],
      ['codigo-de-verificacion', 'codigo'],
      ['aviso-contrasena-cambiada', 'aviso'],
      ['aviso-correo-cambiado', 'aviso'],
      ['aviso-metodo-vinculado', 'aviso'],
    ]);
  });

  describe.each(correos)('$archivo', (correo) => {
    const { html } = correo;
    const limpio = sinCondicionales(html);
    const contenido = CORREOS.find((uno) => uno.archivo === correo.archivo)!;
    const conBoton = contenido.tipo === 'enlace';

    it('es lo mismo que hay guardado en correos/generados (si falla: npm run correos)', () => {
      const guardado = readFileSync(
        new URL(`${correo.archivo}.html`, CARPETA_DE_GENERADOS),
        'utf8',
      );

      expect(guardado).toBe(html);
    });

    it('no deja marcadores sin reemplazar ni comentarios de mantenimiento', () => {
      expect(html).not.toContain('%%');
      expect(html).not.toContain('plantilla maestra');
      expect(html).not.toMatch(/<!--(?!\[if)/);
    });

    it('lleva el asunto como titulo del documento, en espanol y con su doctype', () => {
      expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
      expect(html).toContain('<html\n  lang="es"');
      expect(html).toContain(`<title>${correo.asunto}</title>`);
    });

    it('lleva el enlace de confirmacion en el boton y, escrito, por si el boton no funciona', () => {
      const botones = [...limpio.matchAll(/<a\s[^>]*href="\{\{ \.ConfirmationURL \}\}"[^>]*>/g)];

      if (!conBoton) {
        // Ni el codigo ni un aviso llevan enlace de confirmacion: no hay nada que confirmar.
        expect(botones).toHaveLength(0);
        expect(limpio).not.toContain('Si el botón no funciona');
        expect(limpio).not.toContain('class="boton-texto"');
        return;
      }

      expect(botones).toHaveLength(2);
      expect(limpio).toMatch(/>\s*\{\{ \.ConfirmationURL \}\}\s*<\/a/);
      expect(limpio).toContain('Si el botón no funciona');
    });

    it('usa solo variables de Supabase que existen y sirven en su plantilla', () => {
      const usadas = new Set(variablesDe(html));
      const propias = VARIABLES_PROPIAS[correo.archivo]!;
      const permitidas = new Set(['.SiteURL', ...propias]);

      for (const variable of usadas) {
        expect(permitidas, `${variable} no se puede usar en ${correo.archivo}`).toContain(variable);
      }

      // Y las que le corresponden, las usa: un aviso sin su variable diria menos de lo que debe.
      for (const variable of propias) {
        expect(usadas, `${correo.archivo} no usa ${variable}`).toContain(variable);
      }

      // Ni los metadatos de la persona, ni el hash del codigo, ni la ruta de retorno.
      for (const prohibida of ['.Data', '.TokenHash', '.RedirectTo']) {
        expect(usadas).not.toContain(prohibida);
      }
    });

    it('solo enlaza a la confirmacion y al sitio de la aplicacion: ningun dominio fijo', () => {
      const enlaces = [...limpio.matchAll(/href="([^"]*)"/g)].map(
        (coincidencia) => coincidencia[1],
      );

      expect(enlaces.length).toBeGreaterThan(0);

      for (const enlace of enlaces) {
        expect(
          conBoton ? ['{{ .ConfirmationURL }}', '{{ .SiteURL }}'] : ['{{ .SiteURL }}'],
        ).toContain(enlace);
      }
    });

    it('no pone variables en el asunto: se leeria en la pantalla bloqueada', () => {
      // El codigo de verificacion, en particular, no tiene por que verse sin abrir el correo.
      expect(correo.asunto).not.toContain('{{');
    });

    it('trae sus estilos dentro de cada etiqueta, porque los clientes ignoran las hojas', () => {
      const etiquetas = [...limpio.matchAll(/<(h1|p|a|img|td|div|body|ol|li)\b[^>]*>/g)];

      expect(etiquetas.length).toBeGreaterThan(15);

      for (const [etiqueta] of etiquetas) {
        expect(etiqueta, 'etiqueta sin style=').toMatch(/\sstyle="/);
      }
    });

    it('el bloque <style> solo mejora: modo oscuro y pantallas pequenas, nunca lo esencial', () => {
      const bloques = [...limpio.matchAll(/<style>([\s\S]*?)<\/style>/g)];

      expect(bloques).toHaveLength(1);

      const css = bloques[0]![1]!;

      // Sin el bloque, los colores y el tamano ya estan en cada etiqueta.
      expect(css).not.toMatch(/@import/);
      expect(css).not.toMatch(/url\(/);
      expect(css.match(/\{/g)!.length).toBeGreaterThan(5);
    });

    it('no trae scripts, hojas externas, fuentes web ni imagenes incrustadas', () => {
      expect(limpio).not.toMatch(/<script/i);
      expect(limpio).not.toMatch(/<link\b/i);
      expect(limpio).not.toMatch(/<iframe|<form|<input|<video|<object/i);
      expect(limpio).not.toMatch(/data:image/i);
      expect(limpio).not.toMatch(/fonts\.googleapis|@font-face/i);
    });

    it('solo trae dos imagenes, las dos del propio sitio y con tamano: el logo y la mascota', () => {
      const imagenes = [...limpio.matchAll(/<img\b[^>]*>/g)].map((coincidencia) => coincidencia[0]);

      expect(imagenes).toHaveLength(2);

      const [logo, mascota] = imagenes as [string, string];

      expect(logo).toContain('src="{{ .SiteURL }}/icono-192.png"');
      expect(logo).toMatch(/width="44"/);
      expect(logo).toMatch(/height="44"/);
      // El nombre va al lado en texto: el logo es decorativo.
      expect(logo).toContain('alt=""');
      expect(textoVisible(html)).toContain('VSD Health');

      // La mascota se pide al sitio de la aplicacion; Outlook de escritorio exige width y height.
      expect(mascota).toMatch(/src="\{\{ \.SiteURL \}\}\/correo\/[a-z-]+\.gif"/);
      expect(mascota).toMatch(/width="140"/);
      expect(mascota).toMatch(/height="140"/);
    });

    it('la mascota es la de este correo y, sin la imagen, se lee su nombre', () => {
      const mascota = [...limpio.matchAll(/<img\b[^>]*>/g)][1]![0];

      expect(mascota).toContain(`src="{{ .SiteURL }}/correo/${contenido.mascota.archivo}.gif"`);
      expect(mascota).toContain(`alt="${contenido.mascota.nombre}"`);
      // El texto alternativo hereda el color del texto, tambien en modo oscuro.
      expect(mascota).toContain('class="texto"');
      expect(mascota).toMatch(/color: #[0-9a-f]{6}/);
    });

    it('el boton es grande y redondo, y se estira a todo el ancho en el celular', () => {
      if (!conBoton) {
        return;
      }

      const enlace = limpio.match(/<a\s[^>]*class="boton-texto"[^>]*>/)![0];
      const alto = enlace.match(/padding: (\d+)px (\d+)px/)!;
      const lineaDeTexto = Number(enlace.match(/line-height: (\d+)px/)![1]);

      // 44 px es lo minimo que piden los dedos; aqui son 52.
      expect(Number(alto[1]) * 2 + lineaDeTexto).toBeGreaterThanOrEqual(48);
      expect(Number(alto[2])).toBeGreaterThanOrEqual(28);
      expect(Number(enlace.match(/font-size: (\d+)px/)![1])).toBeGreaterThanOrEqual(16);
      expect(enlace).toContain('border-radius: 9999px');
      expect(html).toMatch(/\.boton-tabla \{\s*width: 100% !important;/);
      expect(html).toMatch(/\.boton-texto \{\s*display: block !important;/);
    });

    it('el movimiento es solo una mejora: transicion en el bloque <style>, nunca en las etiquetas', () => {
      const css = html.match(/<style>([\s\S]*?)<\/style>/)![1]!;

      expect(css).toMatch(/\.boton-texto \{\s*transition:/);
      expect(css).toContain('.boton-texto:hover {');
      expect(css).toContain('.boton-texto:focus-visible {');
      // Quien pide menos movimiento no recibe transiciones ni desplazamiento.
      expect(css).toMatch(
        /@media \(prefers-reduced-motion: reduce\) \{\s*\.boton-texto \{\s*transition: none !important;/,
      );
      // Un cliente que no entiende `transition` no debe perder nada: nada esencial depende de ella.
      expect(limpio).not.toMatch(/style="[^"]*(transition|animation|@keyframes)/);
      expect(css).not.toMatch(/@keyframes|animation:/);
    });

    it('al pasar el cursor, el boton pasa al color de la paleta de cada modo', () => {
      const css = html.match(/<style>([\s\S]*?)<\/style>/)![1]!;
      const [antesDelOscuro, deElOscuro] = css.split('@media (prefers-color-scheme: dark)') as [
        string,
        string,
      ];

      expect(antesDelOscuro).toContain(`background-color: ${CLARO.boton_hover} !important`);
      expect(deElOscuro).toContain(`background-color: ${OSCURO.boton_hover} !important`);
    });

    it('trae la lista de pasos solo cuando el correo la tiene, y cada paso llega al HTML', () => {
      const listas = [...limpio.matchAll(/<ol\b/g)];

      if (contenido.pasos === undefined) {
        expect(listas).toHaveLength(0);
        return;
      }

      expect(listas).toHaveLength(1);
      expect(limpio.match(/<li\b/g)).toHaveLength(contenido.pasos.length);

      for (const paso of contenido.pasos) {
        expect(textoVisible(html)).toContain(paso);
      }
    });

    it('las tablas de maquetacion no se anuncian como tablas de datos', () => {
      const tablas = [...limpio.matchAll(/<table\b[^>]*>/g)].map((coincidencia) => coincidencia[0]);

      expect(tablas.length).toBeGreaterThan(0);

      for (const tabla of tablas) {
        expect(tabla).toContain('role="presentation"');
      }
    });

    it('prepara el modo oscuro: meta de esquema, reglas por clase y las clases en el HTML', () => {
      expect(html).toContain('<meta name="color-scheme" content="light dark" />');
      expect(html).toContain('<meta name="supported-color-schemes" content="light dark" />');
      expect(html).toContain('@media (prefers-color-scheme: dark)');
      // Outlook.com no entiende la consulta de medios: usa estos atributos.
      expect(html).toContain('[data-ogsc]');
      expect(html).toContain('[data-ogsb]');

      const clasesDelHtml = new Set(
        [...limpio.matchAll(/\sclass="([^"]*)"/g)].flatMap((coincidencia) =>
          coincidencia[1]!.split(/\s+/),
        ),
      );

      for (const clase of CLASES_CON_MODO_OSCURO) {
        // Un aviso o un codigo no llevan boton: sus clases no estan en el HTML, aunque la
        // regla este en el bloque <style>.
        if (!conBoton && clase.startsWith('boton')) {
          expect(html).toContain(`.${clase} {`);
          continue;
        }

        expect(clasesDelHtml, `.${clase} no se usa en el HTML`).toContain(clase);
        expect(html).toContain(`.${clase} {`);
      }

      for (const color of Object.values(OSCURO)) {
        expect(html).toContain(color);
      }
    });

    it('el claro usa los colores de la paleta clara en cada etiqueta', () => {
      for (const color of [CLARO.fondo, CLARO.tarjeta, CLARO.texto, CLARO.boton, CLARO.enlace]) {
        expect(limpio).toContain(color);
      }
    });

    it('tiene preencabezado oculto, para la lista de correos', () => {
      expect(html).toMatch(/display: none[^"]*mso-hide: all/);
    });

    it('pesa muy por debajo de lo que Gmail recorta (102 KB)', () => {
      expect(Buffer.byteLength(html, 'utf8')).toBeLessThan(30_000);
    });

    it('no lleva datos de salud ni nada que salga de la aplicacion', () => {
      const texto = `${correo.asunto} ${textoVisible(html)}`.toLowerCase();

      // Por palabra, y con letras unicode: `\b` no entiende las tildes.
      for (const palabra of [
        'salud',
        'ansiedad',
        'depres',
        'emoci',
        'ánimo',
        'estrés',
        'terapia',
        'síntoma',
        'diagnóst',
        'medic',
        'resultado',
        'nivel',
        'riesgo',
      ]) {
        expect(texto).not.toMatch(new RegExp(`(?<![\\p{L}])${palabra}`, 'u'));
      }
    });

    it('no culpa ni mete miedo: dice que no pasa nada, o que hacer, si no fue la persona', () => {
      const texto = textoVisible(html).toLowerCase();

      if (contenido.tipo === 'aviso') {
        // Un aviso de seguridad no puede decir "ignoralo": si no fue ella, tiene que actuar.
        // Dice que hacer, sin alarma, y deja tranquila a quien si fue.
        expect(texto).toContain('si fuiste tú, no tienes que hacer nada más');
        expect(texto).toMatch(/si no fuiste tú, [^.]*cambia tu contraseña|si no fuiste tú, entra/);
        expect(texto).not.toMatch(/ignora este correo|puedes ignorar este correo/);
      } else {
        expect(texto).toMatch(/ignora este correo|puedes ignorar este correo/);
      }

      expect(texto).not.toMatch(
        /urgente|inmediatamente|cuenta (será )?(bloqueada|suspendida|eliminada)/,
      );
    });

    it('el codigo va escrito en el correo, una sola vez y en una caja que se lee bien', () => {
      const cajas = [
        ...limpio.matchAll(/<td\b[^>]*class="halo texto"[^>]*>\s*\{\{ \.Token \}\}\s*<\/td>/g),
      ];

      if (contenido.tipo !== 'codigo') {
        expect(limpio).not.toContain('{{ .Token }}');
        return;
      }

      expect(limpio.match(/\{\{ \.Token \}\}/g)).toHaveLength(1);
      expect(cajas).toHaveLength(1);
      // Letra de ancho fijo y grande: las cifras no se confunden y se leen en el celular.
      expect(cajas[0]![0]).toMatch(/font-family: ui-monospace/);
      expect(Number(cajas[0]![0].match(/font-size: (\d+)px/)![1])).toBeGreaterThanOrEqual(28);
      // Sin boton ni enlace de confirmacion: el codigo se escribe en la aplicacion.
      expect(limpio).not.toContain('{{ .ConfirmationURL }}');
    });
  });

  it('lo que cada uno dice llega al HTML, con sus tildes', () => {
    for (const contenido of CORREOS) {
      const correo = correos.find((uno) => uno.archivo === contenido.archivo)!;
      const texto = textoVisible(correo.html);

      expect(texto).toContain(contenido.titulo);
      expect(texto).toContain(contenido.boton ?? contenido.titulo);
      expect(texto).toContain(contenido.nota.slice(0, 40));

      for (const parrafo of contenido.parrafos) {
        // Hasta donde empieza una variable de Supabase, si la hay.
        expect(texto).toContain((parrafo.split('{{')[0] ?? '').trim().slice(0, 25));
      }
    }
  });

  it('los tres de siempre los encabeza una mascota distinta, con el nombre que lleva en la app', () => {
    expect(CORREOS.slice(0, 3).map((contenido) => contenido.mascota)).toEqual([
      { nombre: 'Fungito', archivo: 'fungito' },
      { nombre: 'Obsidian', archivo: 'obsidian' },
      { nombre: 'Ojo de Gato', archivo: 'ojo-de-gato' },
    ]);
  });

  it('los nuevos usan las mismas tres mascotas: no piden ningun GIF mas', () => {
    // Obsidian protege la cuenta; Ojo de Gato vigila el cambio de correo y de metodo.
    expect(CORREOS.slice(3).map((contenido) => contenido.mascota.archivo)).toEqual([
      'obsidian',
      'obsidian',
      'ojo-de-gato',
      'ojo-de-gato',
    ]);
  });

  it('solo el de recuperar la contrasena trae pasos', () => {
    expect(
      CORREOS.filter((contenido) => contenido.pasos !== undefined).map((c) => c.archivo),
    ).toEqual(['recuperar-contrasena']);
  });

  it('solo el del cambio de correo nombra el correo nuevo', () => {
    const conNuevoCorreo = correos
      .filter((correo) => correo.html.includes('{{ .NewEmail }}'))
      .map((correo) => correo.archivo);

    expect(conNuevoCorreo).toEqual(['cambiar-correo']);
  });
});

describe('la paleta', () => {
  const pares = (paleta: Paleta): [string, string, string][] => [
    ['texto sobre la tarjeta', paleta.texto, paleta.tarjeta],
    ['texto sobre el lienzo', paleta.texto, paleta.fondo],
    ['texto de apoyo sobre la tarjeta', paleta.suave, paleta.tarjeta],
    ['texto de apoyo sobre el lienzo', paleta.suave, paleta.fondo],
    ['enlace sobre la tarjeta', paleta.enlace, paleta.tarjeta],
    ['texto del boton sobre el boton', paleta.sobre_boton, paleta.boton],
    ['texto del boton sobre el boton al pasar el cursor', paleta.sobre_boton, paleta.boton_hover],
    ['nombre de la mascota (texto alternativo) sobre la cabecera', paleta.texto, paleta.halo],
  ];

  it.each([
    ['clara', CLARO],
    ['oscura', OSCURO],
  ])('la %s cumple 4,5:1 (WCAG AA) en cada texto', (_nombre, paleta) => {
    for (const [que, texto, fondo] of pares(paleta)) {
      expect(contraste(texto, fondo), que).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('calcula el contraste: blanco sobre negro es 21 y un color sobre si mismo, 1', () => {
    expect(contraste('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contraste('#3d7a6b', '#3d7a6b')).toBeCloseTo(1, 5);
  });
});

describe('rellenar', () => {
  it('reemplaza cada marcador', () => {
    expect(rellenar('a %%uno%% b %%dos.tres%%', { uno: '1', 'dos.tres': '2' })).toBe('a 1 b 2');
  });

  it('lanza si la plantilla pide un valor que no hay', () => {
    expect(() => rellenar('%%falta%%', {})).toThrow('%%falta%%');
  });

  it('lanza si se escribio un valor que la plantilla no usa: nunca saldria', () => {
    expect(() => rellenar('sin marcadores', { sobra: 'x' })).toThrow('%%sobra%%');
  });

  it('deja sin usar solo lo que se nombra como opcional, y nada mas', () => {
    expect(rellenar('sin marcadores', { sobra: 'x' }, ['sobra'])).toBe('sin marcadores');
    expect(() => rellenar('sin marcadores', { sobra: 'x', otra: 'y' }, ['sobra'])).toThrow(
      '%%otra%%',
    );
  });
});

describe('construirCorreo', () => {
  const plantilla = readFileSync(RUTA_DE_LA_PLANTILLA, 'utf8');
  const piezas: PiezasDeLaPlantilla = {
    enlace: readFileSync(new URL('enlace.html', CARPETA_DE_PIEZAS), 'utf8'),
    codigo: readFileSync(new URL('codigo.html', CARPETA_DE_PIEZAS), 'utf8'),
  };
  const deEnlace = CORREOS.find((contenido) => contenido.tipo === 'enlace')!;
  const aviso = CORREOS.find((contenido) => contenido.tipo === 'aviso')!;

  it('lanza si un aviso trae texto de boton: no saldria nunca', () => {
    expect(() => construirCorreo({ ...aviso, boton: 'Ir' }, plantilla, piezas)).toThrow(
      'solo los correos de tipo enlace',
    );
  });

  it('lanza si un correo de enlace no trae texto de boton: saldria con el boton vacio', () => {
    const sinBoton = Object.fromEntries(
      Object.entries(deEnlace).filter(([nombre]) => nombre !== 'boton'),
    ) as unknown as ContenidoDelCorreo;

    expect(() => construirCorreo(sinBoton, plantilla, piezas)).toThrow(
      'solo los correos de tipo enlace',
    );
  });

  it('lanza si la plantilla ya no tiene donde poner el boton o el codigo', () => {
    expect(() => construirCorreo(deEnlace, plantilla.replace('%%accion%%', ''), piezas)).toThrow(
      '%%accion%%',
    );
  });

  it('no interpreta como patron lo que haya en una pieza ($& se queda como esta)', () => {
    const rara: PiezasDeLaPlantilla = {
      ...piezas,
      enlace: 'a $& b %%claro.boton%% %%claro.sobre_boton%% %%boton%%',
    };

    expect(construirCorreo(deEnlace, plantilla, rara).html).toContain(
      `a $& b ${CLARO.boton} ${CLARO.sobre_boton} ${deEnlace.boton}`,
    );
  });
});

describe('escaparTexto', () => {
  it('escapa lo que HTML interpreta, y deja las variables de Supabase como estan', () => {
    expect(escaparTexto('a & b <c> {{ .NewEmail }}')).toBe('a &amp; b &lt;c&gt; {{ .NewEmail }}');
  });

  it('deja pasar las tildes y los signos del espanol', () => {
    expect(escaparTexto('¿Cuándo? ¡Ya!')).toBe('¿Cuándo? ¡Ya!');
  });
});
