import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CARPETA_DE_GENERADOS,
  CLASES_CON_MODO_OSCURO,
  construirCorreos,
  escaparTexto,
  rellenar,
} from './construirCorreos.js';
import { CORREOS } from './contenidos.js';
import { CLARO, OSCURO, contraste, type Paleta } from './paleta.js';

/**
 * Los correos de Supabase Auth (SCRUM-125).
 *
 * Un correo no se puede probar en un navegador: lo que importa es que respete
 * lo que los clientes de correo entienden. Estas pruebas vigilan esas reglas, y
 * que lo que hay en `correos/generados/` sea exactamente lo que se genera.
 */

const correos = construirCorreos();

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
  it('son los tres de la primera etapa, cada uno con su plantilla de Supabase', () => {
    expect(correos.map((correo) => correo.plantillaEnSupabase)).toEqual([
      'Confirm sign up',
      'Reset password',
      'Change email address',
    ]);
    expect(new Set(correos.map((correo) => correo.asunto)).size).toBe(3);
  });

  describe.each(correos)('$archivo', (correo) => {
    const { html } = correo;
    const limpio = sinCondicionales(html);

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

      expect(botones).toHaveLength(2);
      expect(limpio).toMatch(/>\s*\{\{ \.ConfirmationURL \}\}\s*<\/a/);
      expect(limpio).toContain('Si el botón no funciona');
    });

    it('usa solo variables de Supabase que existen y sirven aqui', () => {
      const usadas = new Set(variablesDe(html));
      const permitidas = new Set(['.ConfirmationURL', '.SiteURL']);

      if (correo.archivo === 'cambiar-correo') {
        permitidas.add('.NewEmail');
      }

      for (const variable of usadas) {
        expect(permitidas, `${variable} no se puede usar en ${correo.archivo}`).toContain(variable);
      }

      expect(usadas).toContain('.ConfirmationURL');
      // Ni el correo anterior, ni los metadatos de la persona, ni el codigo.
      for (const prohibida of ['.Email', '.Data', '.Token', '.TokenHash', '.RedirectTo']) {
        expect(usadas).not.toContain(prohibida);
      }
    });

    it('solo enlaza a la confirmacion y al sitio de la aplicacion: ningun dominio fijo', () => {
      const enlaces = [...limpio.matchAll(/href="([^"]*)"/g)].map(
        (coincidencia) => coincidencia[1],
      );

      expect(enlaces.length).toBeGreaterThan(0);

      for (const enlace of enlaces) {
        expect(['{{ .ConfirmationURL }}', '{{ .SiteURL }}']).toContain(enlace);
      }
    });

    it('trae sus estilos dentro de cada etiqueta, porque los clientes ignoran las hojas', () => {
      const etiquetas = [...limpio.matchAll(/<(h1|p|a|img|td|div|body)\b[^>]*>/g)];

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

    it('la unica imagen es el logo del propio sitio, con tamano y sin texto alternativo ruidoso', () => {
      const imagenes = [...limpio.matchAll(/<img\b[^>]*>/g)].map((coincidencia) => coincidencia[0]);

      expect(imagenes).toHaveLength(1);
      expect(imagenes[0]).toContain('src="{{ .SiteURL }}/icono-192.png"');
      expect(imagenes[0]).toMatch(/width="44"/);
      expect(imagenes[0]).toMatch(/height="44"/);
      // El nombre va al lado en texto: la imagen es decorativa.
      expect(imagenes[0]).toContain('alt=""');
      expect(textoVisible(html)).toContain('VSD Health');
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

    it('no culpa ni mete miedo: dice que no pasa nada si no fue la persona', () => {
      const texto = textoVisible(html).toLowerCase();

      expect(texto).toMatch(/ignora este correo|puedes ignorar este correo/);
      expect(texto).not.toMatch(
        /urgente|inmediatamente|cuenta (será )?(bloqueada|suspendida|eliminada)/,
      );
    });
  });

  it('lo que cada uno dice llega al HTML, con sus tildes', () => {
    for (const contenido of CORREOS) {
      const correo = correos.find((uno) => uno.archivo === contenido.archivo)!;
      const texto = textoVisible(correo.html);

      expect(texto).toContain(contenido.titulo);
      expect(texto).toContain(contenido.boton);
      expect(texto).toContain(contenido.nota.slice(0, 40));

      for (const parrafo of contenido.parrafos) {
        // Hasta donde empieza una variable de Supabase, si la hay.
        expect(texto).toContain((parrafo.split('{{')[0] ?? '').trim().slice(0, 25));
      }
    }
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
});

describe('escaparTexto', () => {
  it('escapa lo que HTML interpreta, y deja las variables de Supabase como estan', () => {
    expect(escaparTexto('a & b <c> {{ .NewEmail }}')).toBe('a &amp; b &lt;c&gt; {{ .NewEmail }}');
  });

  it('deja pasar las tildes y los signos del espanol', () => {
    expect(escaparTexto('¿Cuándo? ¡Ya!')).toBe('¿Cuándo? ¡Ya!');
  });
});
