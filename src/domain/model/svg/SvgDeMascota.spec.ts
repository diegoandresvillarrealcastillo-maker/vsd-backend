import { describe, expect, it } from 'vitest';
import { InvalidPetSvgError, type MotivoDeSvgInvalido } from '../DomainError.js';
import {
  ATRIBUTOS_MAXIMOS,
  ELEMENTOS_MAXIMOS,
  PROFUNDIDAD_MAXIMA,
  leerElSvg,
} from './LectorDeSvg.js';
import { PESO_MAXIMO_DEL_SVG, SvgDeMascota, TIPO_DEL_SVG } from './SvgDeMascota.js';

const bytes = (texto: string): Uint8Array => new TextEncoder().encode(texto);

const CABECERA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
const svg = (interior: string, cabecera = CABECERA): string => `${cabecera}${interior}</svg>`;

function crear(texto: string, tipo = TIPO_DEL_SVG): SvgDeMascota {
  return SvgDeMascota.crear(bytes(texto), tipo);
}

/** El SVG que se guardaria, como texto. */
function salida(texto: string): string {
  return new TextDecoder().decode(crear(texto).contenido);
}

/** El motivo con el que se rechaza, o `undefined` si se acepta. */
function rechazo(texto: string, tipo = TIPO_DEL_SVG): MotivoDeSvgInvalido | undefined {
  try {
    crear(texto, tipo);

    return undefined;
  } catch (error) {
    expect(error).toBeInstanceOf(InvalidPetSvgError);

    return (error as InvalidPetSvgError).motivo;
  }
}

const XMLNS = 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';

describe('SvgDeMascota (SCRUM-122)', () => {
  describe('un dibujo valido', () => {
    it('se reescribe desde cero, con un orden fijo', () => {
      expect(salida(svg('<circle cx="50" cy="50" r="40" fill="#ff0000"/>'))).toBe(
        `<svg ${XMLNS} viewBox="0 0 100 100"><circle fill="#ff0000" cx="50" cy="50" r="40"/></svg>`,
      );
    });

    it('devuelve el tipo y los bytes del SVG nuevo', () => {
      const resultado = crear(svg('<rect width="10" height="10"/>'));

      expect(resultado.tipo).toBe('image/svg+xml');
      expect(new TextDecoder().decode(resultado.contenido)).toContain('<rect');
    });

    it('con el tipo en mayusculas o con parametros', () => {
      expect(rechazo(svg('<g/>'), 'IMAGE/SVG+XML; charset=utf-8')).toBeUndefined();
    });

    it('escribir el resultado y volver a leerlo da lo mismo: es estable', () => {
      const una = salida(
        svg(
          '<defs><linearGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs>' +
            '<path d="M 10 10 L 90 10 L 50 90 Z" fill="url(#g)" stroke="#333" stroke-width="2"/>',
        ),
      );

      expect(salida(una)).toBe(una);
    });

    it('conserva la estructura: grupos, formas y degradados', () => {
      const resultado = salida(
        svg(
          '<g transform="translate(5, 5)"><ellipse cx="1" cy="2" rx="3" ry="4"/><line x1="0" y1="0" x2="9" y2="9" stroke="red"/></g>' +
            '<polygon points="0,0 10,0 5,10"/><polyline points="0 0 5 5 10 0" fill="none"/>',
        ),
      );

      for (const parte of [
        '<g transform="translate(5, 5)">',
        '<ellipse',
        '<line',
        '<polygon',
        '<polyline',
      ]) {
        expect(resultado).toContain(parte);
      }
    });

    it('un SVG de Figma: declaracion de XML, recortes y xlink', () => {
      const figma =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
        '<g clip-path="url(#clip0_1_2)">\n' +
        '<path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110Z" fill="#FFD166"/>\n' +
        '<circle cx="45" cy="50" r="6" fill="#1B1B1B"/>\n' +
        '</g>\n' +
        '<defs>\n' +
        '<clipPath id="clip0_1_2"><rect width="120" height="120" fill="white"/></clipPath>\n' +
        '</defs>\n' +
        '</svg>\n';

      const resultado = salida(figma);

      expect(resultado).toContain('viewBox="0 0 120 120"');
      expect(resultado).toContain('clip-path="url(#clip0_1_2)"');
      expect(resultado).toContain('<clipPath id="clip0_1_2">');
      expect(resultado).not.toContain('<?xml');
    });

    it('un SVG de Inkscape: se descartan sus metadatos y el estilo pasa a atributos', () => {
      const inkscape =
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ' +
        'xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" ' +
        'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cc="http://creativecommons.org/ns#" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" width="64mm" height="64mm" viewBox="0 0 64 64" version="1.1" ' +
        'inkscape:version="1.2" sodipodi:docname="mascota.svg">\n' +
        '<sodipodi:namedview id="base" inkscape:zoom="2"/>\n' +
        '<metadata id="m"><rdf:RDF><cc:Work rdf:about=""><dc:title>mi mascota</dc:title></cc:Work></rdf:RDF></metadata>\n' +
        '<g inkscape:label="Capa 1" inkscape:groupmode="layer" id="layer1">\n' +
        '<circle style="fill:#ff6600;stroke:#000000;stroke-width:2;fill-opacity:1" cx="32" cy="32" r="20" id="c1" inkscape:label="cara"/>\n' +
        '</g>\n</svg>\n';

      const resultado = salida(inkscape);

      expect(resultado).toContain(
        '<circle id="c1" fill="#ff6600" fill-opacity="1" stroke="#000000" stroke-width="2"',
      );
      expect(resultado).not.toContain('inkscape');
      expect(resultado).not.toContain('sodipodi');
      expect(resultado).not.toContain('metadata');
      expect(resultado).not.toContain('style=');
    });

    it('un SVG de Illustrator, con su DOCTYPE oficial, que se descarta', () => {
      const illustrator =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<!-- Generator: Adobe Illustrator 24.0.0 -->\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
        '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" ' +
        'viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">\n' +
        '<style type="text/css">.st0{fill:#FF0000;}</style>' +
        '</svg>';

      // Esta lleva una hoja de estilos: no se admite, pero el DOCTYPE no es el motivo.
      expect(rechazo(illustrator)).toBe('no-admitido');

      const sinEstilos = illustrator.replace(
        /<style.*<\/style>/,
        '<circle cx="25" cy="25" r="20" fill="#FF0000"/>',
      );

      expect(salida(sinEstilos)).toContain('fill="#FF0000"');
      expect(salida(sinEstilos)).not.toContain('DOCTYPE');
    });

    it('un degradado que hereda de otro con xlink:href, y una pintura con color de respaldo', () => {
      const resultado = salida(
        svg(
          '<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="red"/></linearGradient>' +
            '<linearGradient id="b" xlink:href="#a"/></defs>' +
            '<rect width="10" height="10" fill="url(#b) blue"/>',
          `<svg ${XMLNS} viewBox="0 0 100 100">`,
        ),
      );

      expect(resultado).toContain('<linearGradient id="b" xlink:href="#a"/>');
      expect(resultado).toContain('fill="url(#b) blue"');
    });

    it('un href sin prefijo se escribe como xlink:href, que entienden todos los navegadores', () => {
      expect(salida(svg('<defs><circle id="c" r="5"/></defs><use href="#c" x="10"/>'))).toContain(
        '<use x="10" xlink:href="#c"/>',
      );
    });

    it('se pueden reutilizar formas con use', () => {
      expect(
        rechazo(svg('<defs><circle id="c" r="5"/></defs><use href="#c"/><use href="#c" x="20"/>')),
      ).toBeUndefined();
    });

    it('las entidades se resuelven antes de mirar el valor', () => {
      expect(salida(svg('<rect width="1" height="1" fill="&#35;ff0000"/>'))).toContain(
        'fill="#ff0000"',
      );
      expect(salida(svg('<rect width="1" height="1" fill="&#x23;00ff00"/>'))).toContain(
        'fill="#00ff00"',
      );
    });

    it('comillas simples, saltos de linea de Windows, comentarios y espacio de sobra', () => {
      const texto =
        "<svg\r\n  xmlns='http://www.w3.org/2000/svg'\r\n  viewBox='0 0 10 10'>\r\n<!-- un comentario -->\r\n  <rect   width='5'  height='5' />\r\n</svg>\r\n\r\n";

      expect(salida(texto)).toContain('<rect width="5" height="5"/>');
      expect(salida(texto)).not.toContain('comentario');
    });

    it('un data: de una imagen de mapa de bits en un atributo que se descarta, no es peligroso: solo se descarta', () => {
      // Es lo que dejan algunos editores en atributos propios. No se admite como
      // imagen —`<image>` no esta en la lista—, pero tampoco es un ataque.
      const resultado = salida(
        svg('<g data-foto="data:image/png;base64,iVBORw0KGgo="><rect width="1" height="1"/></g>'),
      );

      expect(resultado).toContain('<g><rect width="1" height="1"/></g>');
      expect(resultado).not.toContain('data:');
    });

    it('sin el espacio de nombres del SVG se acepta, y se escribe con el que corresponde', () => {
      // Hecho a mano, es un olvido comun. No cambia lo que se acepta: el SVG
      // nuevo se escribe entero desde la lista blanca.
      expect(salida('<svg viewBox="0 0 1 1"><g/></svg>')).toBe(
        `<svg ${XMLNS} viewBox="0 0 1 1"><g/></svg>`,
      );
    });

    it('una marca de orden de bytes al principio no estorba', () => {
      expect(rechazo('﻿' + svg('<g/>'))).toBeUndefined();
    });

    it('sin viewBox, se saca del ancho y el alto, y estos no se guardan', () => {
      const resultado = salida(
        '<svg xmlns="http://www.w3.org/2000/svg" width="80px" height="60"><g/></svg>',
      );

      expect(resultado).toContain('viewBox="0 0 80 60"');
      expect(resultado).not.toContain('width=');
      expect(resultado).not.toContain('height=');
    });

    it('un ancho y un alto desmesurados en la raiz no se conservan', () => {
      const resultado = salida(
        '<svg xmlns="http://www.w3.org/2000/svg" width="900000" height="900000" viewBox="0 0 10 10"><g/></svg>',
      );

      expect(resultado).not.toContain('900000');
    });

    it('lo que se descarta no deja rastro: titulo, descripcion, clases, data-*, aria-*', () => {
      const resultado = salida(
        svg(
          '<title>Mi mascota</title><desc>una descripcion</desc><g class="uno" data-x="1" aria-hidden="true" role="img"><rect width="2" height="2" class="dos"/></g>',
        ),
      );

      for (const resto of ['Mi mascota', 'descripcion', 'class', 'data-', 'aria', 'role']) {
        expect(resultado).not.toContain(resto);
      }

      expect(resultado).toContain('<g><rect width="2" height="2"/></g>');
    });

    it('el estilo en linea gana sobre el atributo, como en CSS', () => {
      expect(salida(svg('<rect width="1" height="1" fill="red" style="fill:blue"/>'))).toContain(
        'fill="blue"',
      );
    });

    it('del estilo se quedan solo las propiedades de dibujo; el resto se descarta', () => {
      const resultado = salida(
        svg(
          '<rect width="1" height="1" style="fill:red; cursor:pointer; mix-blend-mode:multiply; stroke:#000 !important"/>',
        ),
      );

      expect(resultado).toContain('fill="red"');
      expect(resultado).toContain('stroke="#000"');
      expect(resultado).not.toContain('cursor');
      expect(resultado).not.toContain('blend');
    });
  });

  describe('el archivo', () => {
    it.each([
      'image/png',
      'image/svg',
      'text/xml',
      'text/html',
      'application/xml',
      'image/jpeg',
      '',
    ])('con el tipo «%s» no se acepta', (tipo) => {
      expect(rechazo(svg('<g/>'), tipo)).toBe('tipo');
    });

    it('un archivo vacio no es un SVG', () => {
      expect(rechazo('')).toBe('no-es-svg');
    });

    it('justo en 100 KB se mira, y un byte de mas se rechaza por su peso antes de abrirlo', () => {
      const relleno = (bytesDeMas: number): string =>
        svg('<g/>') + '\n'.repeat(bytesDeMas - svg('<g/>').length);

      expect(PESO_MAXIMO_DEL_SVG).toBe(102_400);
      expect(rechazo(relleno(PESO_MAXIMO_DEL_SVG))).toBeUndefined();
      expect(rechazo(relleno(PESO_MAXIMO_DEL_SVG + 1))).toBe('peso');
    });

    it('el peso se mira antes que el contenido: un archivo enorme no se recorre', () => {
      expect(rechazo('x'.repeat(PESO_MAXIMO_DEL_SVG + 1))).toBe('peso');
    });

    it('lo que no es UTF-8 valido no es un SVG', () => {
      const roto = new Uint8Array([
        ...bytes('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><g id="'),
        0xff,
        0xfe,
        ...bytes('"/></svg>'),
      ]);

      expect(() => SvgDeMascota.crear(roto, TIPO_DEL_SVG)).toThrow(InvalidPetSvgError);

      try {
        SvgDeMascota.crear(roto, TIPO_DEL_SVG);
        expect.unreachable();
      } catch (error) {
        // Con una lectura que reemplazara lo que no entiende, esto saldria
        // como otra cosa: un identificador raro.
        expect((error as InvalidPetSvgError).motivo).toBe('no-es-svg');
      }
    });

    it.each([
      ['un HTML', '<html><body>hola</body></html>'],
      ['un JSON', '{"svg": true}'],
      ['un texto cualquiera', 'esto no es un svg'],
      ['un PNG', '\u0089PNG\r\n\u001a\n'],
    ])('%s no es un SVG', (_cual, texto) => {
      expect(rechazo(texto)).toBe('no-es-svg');
    });
  });

  describe('lo que no esta bien formado', () => {
    it.each([
      ['una etiqueta sin cerrar', `${CABECERA}<g>`],
      ['etiquetas cruzadas', svg('<g><rect></g></rect>')],
      ['un atributo repetido', svg('<rect width="1" width="2"/>')],
      ['un atributo sin comillas', svg('<rect width=1/>')],
      ['un atributo sin valor', svg('<rect width/>')],
      ['dos atributos sin un espacio en medio', svg('<rect width="1"height="1"/>')],
      ['un valor que lleva un <', svg('<rect fill="a<b"/>')],
      [
        'dos elementos raiz',
        svg('<g/>') + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>',
      ],
      ['texto antes del elemento raiz', 'hola ' + svg('<g/>')],
      ['texto despues del elemento raiz', svg('<g/>') + ' hola'],
      ['un comentario sin cerrar', svg('<g/><!-- sin cerrar')],
      ['un comentario con -- dentro', svg('<g/><!-- uno -- dos -->')],
      ['una entidad que no existe', svg('<rect fill="&nada;"/>')],
      ['un & suelto', svg('<rect fill="a&b"/>')],
      ['una referencia a un caracter que XML no admite', svg('<rect fill="&#0;"/>')],
      ['un prefijo que no se declaro', svg('<rect foo:bar="1"/>')],
      ['un caracter de control', svg('<g id="a\u0001b"/>')],
      ['un NUL', svg('<g/>') + '\u0000'],
      ['el elemento raiz no es svg', '<g xmlns="http://www.w3.org/2000/svg"/>'],
      ['svg en mayusculas', '<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>'],
      [
        'con otro espacio de nombres',
        '<svg xmlns="http://www.w3.org/1999/xhtml" viewBox="0 0 1 1"/>',
      ],
      ['sin viewBox ni medidas', '<svg xmlns="http://www.w3.org/2000/svg"><g/></svg>'],
      [
        'con un viewBox de ancho cero',
        svg('<g/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 10">'),
      ],
      [
        'con un viewBox negativo',
        svg('<g/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 -10">'),
      ],
      [
        'con un viewBox que no son cuatro numeros',
        svg('<g/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10">'),
      ],
      [
        'con un viewBox desmesurado',
        svg('<g/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1e99 10">'),
      ],
      ['con un identificador repetido', svg('<g id="a"/><g id="a"/>')],
      [
        'con un href y un xlink:href a la vez',
        svg(`<use ${XMLNS.split(' ')[1]} href="#a" xlink:href="#b"/>`),
      ],
    ])('%s', (_caso, texto) => {
      expect(rechazo(texto)).toBe('no-es-svg');
    });
  });

  describe('lo que se rechaza por peligroso: el criterio de aceptacion de SCRUM-122', () => {
    it.each([
      ['un script', svg('<script>alert(1)</script>')],
      ['un script en mayusculas', svg('<SCRIPT>alert(1)</SCRIPT>')],
      ['un script con tipo', svg('<script type="text/javascript">alert(1)</script>')],
      ['un script escondido en un grupo', svg('<g><g><script>alert(1)</script></g></g>')],
      [
        'un script escondido entre los metadatos',
        svg('<metadata><script>alert(1)</script></metadata>'),
      ],
      ['un script escondido en un titulo', svg('<title><script>alert(1)</script></title>')],
      [
        'un script escrito con un espacio de nombres propio',
        svg('<s:script xmlns:s="http://www.w3.org/2000/svg">alert(1)</s:script>'),
      ],
      [
        'un script con el prefijo svg',
        `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><svg:script>alert(1)</svg:script></svg>`,
      ],
      ['un script con CDATA', svg('<script><![CDATA[alert(1)]]></script>')],
      [
        'onload en la raiz',
        svg('<g/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" onload="alert(1)">'),
      ],
      [
        'onload en mayusculas',
        svg('<g/>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" ONLOAD="alert(1)">'),
      ],
      ['onclick en una forma', svg('<rect width="1" height="1" onclick="alert(1)"/>')],
      ['onmouseover', svg('<circle r="1" onmouseover="alert(1)"/>')],
      ['onerror', svg('<g onerror="alert(1)"/>')],
      ['onfocusin', svg('<g onfocusin="alert(1)"/>')],
      ['un manejador con prefijo', svg(`<g ${XMLNS.split(' ')[1]} xlink:onload="alert(1)"/>`)],
      ['un manejador entre los metadatos', svg('<metadata><x onload="alert(1)"/></metadata>')],
      [
        'un enlace con javascript',
        svg(`<a ${XMLNS.split(' ')[1]} xlink:href="javascript:alert(1)"><rect/></a>`),
      ],
      ['un enlace a otro sitio', svg('<a href="https://ejemplo.invalid"><rect/></a>')],
      ['un enlace dentro de un grupo', svg('<g><a href="#x"><rect/></a></g>')],
      ['use hacia otro sitio', svg('<use href="https://ejemplo.invalid/x.svg#a"/>')],
      ['use con un data:', svg('<use href="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="/>')],
      ['use con una ruta relativa', svg('<use href="otro.svg#a"/>')],
      ['use con un href que lleva javascript', svg('<use href="javascript:alert(1)"/>')],
      ['un href en una forma que no lo admite', svg('<rect href="#a"/>')],
      ['un href vacio', svg('<use href=""/>')],
      [
        'un degradado que apunta a otro sitio',
        svg('<linearGradient id="g" href="https://ejemplo.invalid/g.svg#a"/>'),
      ],
      ['foreignObject', svg('<foreignObject><div>hola</div></foreignObject>')],
      [
        'foreignObject con un iframe',
        svg('<foreignObject><iframe src="https://ejemplo.invalid"/></foreignObject>'),
      ],
      ['foreignObject escrito distinto', svg('<foreignobject/>')],
      ['un iframe', svg('<iframe src="https://ejemplo.invalid"/>')],
      ['un object', svg('<object data="x"/>')],
      ['un embed', svg('<embed src="x"/>')],
      [
        'una animacion de un enlace',
        svg('<a href="#x"><animate attributeName="href" values="javascript:alert(1)"/></a>'),
      ],
      [
        'un set que cambia un manejador',
        svg('<rect><set attributeName="onmouseover" to="alert(1)"/></rect>'),
      ],
      ['una animacion', svg('<rect><animate attributeName="x" from="0" to="10" dur="1s"/></rect>')],
      [
        'una animacion de transformacion',
        svg(
          '<rect><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s"/></rect>',
        ),
      ],
      [
        'una animacion de movimiento',
        svg('<rect><animateMotion path="M0,0 L10,10" dur="1s"/></rect>'),
      ],
      [
        'un fill que apunta a otro sitio',
        svg('<rect fill="url(https://ejemplo.invalid/x.svg#a)"/>'),
      ],
      ['un fill con url sin cerrar', svg('<rect fill="url(#a"/>')],
      ['un clip-path con url a otro sitio', svg('<g clip-path="url(//ejemplo.invalid/a.svg#c)"/>')],
      [
        'un url con comillas hacia otro sitio',
        svg(`<rect fill="url('https://ejemplo.invalid/a')"/>`),
      ],
      [
        'un estilo con url a otro sitio',
        svg('<rect style="fill:url(https://ejemplo.invalid/a)"/>'),
      ],
      [
        'un estilo con javascript',
        svg('<rect style="fill:red; background:url(javascript:alert(1))"/>'),
      ],
      ['un estilo con expression', svg('<rect style="width:expression(alert(1))"/>')],
      [
        'un estilo con -moz-binding',
        svg('<rect style="-moz-binding:url(https://ejemplo.invalid/x.xml#b)"/>'),
      ],
      ['un estilo con @import', svg('<rect style="@import url(https://ejemplo.invalid/x.css)"/>')],
      [
        'un estilo con url escrito con una barra invertida',
        svg('<rect style="fill:\\75rl(https://ejemplo.invalid/a)"/>'),
      ],
      [
        'un estilo con un comentario que parte la palabra',
        svg('<rect style="fill:ur/**/l(https://ejemplo.invalid/a)"/>'),
      ],
      ['un valor con javascript:', svg('<rect fill="javascript:alert(1)"/>')],
      ['javascript: con espacios', svg('<use href=" javascript:alert(1)"/>')],
      ['javascript: con un salto de linea en medio', svg('<use href="java&#10;script:alert(1)"/>')],
      ['javascript: con un tabulador en medio', svg('<use href="java&#9;script:alert(1)"/>')],
      ['javascript: escrito con entidades', svg('<use href="jav&#x61;script:alert(1)"/>')],
      ['javascript: en mayusculas', svg('<use href="JAVASCRIPT:alert(1)"/>')],
      [
        'javascript: ofuscado en un atributo que se descartaria',
        svg('<g data-x="java&#10;script:alert(1)"/>'),
      ],
      [
        'javascript: con mayusculas y un tabulador en un atributo que se descartaria',
        svg('<g data-x="JaVa&#9;ScRiPt:alert(1)"/>'),
      ],
      [
        'javascript: con espacios al principio en un atributo que se descartaria',
        svg('<g data-x="  javascript:alert(1)"/>'),
      ],
      [
        'un url con un espacio antes del parentesis, hacia otro sitio',
        svg('<rect style="fill:url (https://ejemplo.invalid/a)"/>'),
      ],
      [
        'un url con un salto de linea antes del parentesis, en un atributo que se descartaria',
        svg('<g data-x="url&#10;(https://ejemplo.invalid/a)"/>'),
      ],
      ['vbscript:', svg('<use href="vbscript:msgbox(1)"/>')],
      [
        'un data: de HTML',
        svg('<use href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="/>'),
      ],
      ['un valor con <script', svg('<g id="&lt;script&gt;"/>')],
      [
        'un elemento con el prefijo xlink',
        svg('<xlink:rect width="1" height="1"/>', `<svg ${XMLNS} viewBox="0 0 1 1">`),
      ],
      [
        'un elemento de una forma permitida pero con un prefijo ajeno',
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><svg:circle r="1"/></svg>`,
      ],
      [
        'un data: de HTML en un atributo que se descartaria',
        svg('<g data-x="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="/>'),
      ],
      [
        'un data: de un SVG en un atributo que se descartaria',
        svg('<g data-x="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="/>'),
      ],
      ['un data: de texto en un atributo que se descartaria', svg('<g data-x="data:,hola"/>')],
      [
        'un DOCTYPE con entidades (billion laughs)',
        '<!DOCTYPE svg [<!ENTITY a "aaaaaaaaaa"><!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;">]>' +
          svg('<text>&b;</text>'),
      ],
      [
        'un DOCTYPE que lee un archivo del servidor (XXE)',
        '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + svg('<g id="&x;"/>'),
      ],
      [
        'un DOCTYPE con un DTD externo',
        '<!DOCTYPE svg SYSTEM "https://ejemplo.invalid/evil.dtd">' + svg('<g/>'),
      ],
      [
        'un DOCTYPE oficial pero con subconjunto interno',
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY a "b">]>' +
          svg('<g/>'),
      ],
      [
        'un DOCTYPE oficial repetido',
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
          svg('<g/>'),
      ],
      [
        'un DOCTYPE despues del elemento raiz',
        svg('<g/>') +
          '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
      ],
      [
        'una hoja de estilo externa',
        '<?xml-stylesheet type="text/css" href="https://ejemplo.invalid/x.css"?>' + svg('<g/>'),
      ],
      ['una instruccion de procesamiento dentro', svg('<?php echo 1 ?>')],
      ['CDATA suelto', svg('<![CDATA[hola]]>')],
      [
        'una declaracion de XML que no es la normal',
        '<?xml version="1.0" encoding="UTF-16"?>' + svg('<g/>'),
      ],
      ['un espacio de nombres propio', svg('<g xmlns:evil="http://ejemplo.invalid/ns"/>')],
      [
        'xlink apuntando a otro espacio',
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://ejemplo.invalid/xlink" viewBox="0 0 1 1"/>`,
      ],
      ['xmlns redeclarado en un hijo', svg('<g xmlns="http://www.w3.org/1999/xhtml"/>')],
    ])('%s', (_caso, texto) => {
      expect(rechazo(texto)).toBe('peligroso');
    });

    it('un SVG con un script no se limpia en silencio: se rechaza, y asi se sabe', () => {
      expect(() => crear(svg('<rect width="1" height="1"/><script>alert(1)</script>'))).toThrow(
        InvalidPetSvgError,
      );
    });

    it('un SVG con un manejador de eventos no se limpia en silencio: se rechaza', () => {
      expect(() =>
        crear(
          svg(
            '<rect width="1" height="1"/>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" onload="alert(1)">',
          ),
        ),
      ).toThrow(InvalidPetSvgError);
    });
  });

  describe('lo que es inofensivo pero no se admite: se dice claro', () => {
    it.each([
      ['un texto', svg('<text x="1" y="1">hola</text>')],
      ['un texto con tspan', svg('<text><tspan>hola</tspan></text>')],
      ['una imagen de mapa de bits', svg('<image width="10" height="10" href="#a"/>')],
      [
        'una imagen incrustada',
        svg('<image width="1" height="1" href="data:image/png;base64,iVBORw0KGgo="/>'),
      ],
      ['una hoja de estilos', svg('<style>.a{fill:red}</style><rect class="a"/>')],
      ['un filtro', svg('<filter id="f"><feGaussianBlur stdDeviation="2"/></filter>')],
      ['un atributo filter', svg('<rect width="1" height="1" filter="url(#f)"/>')],
      ['un filtro en el estilo', svg('<rect width="1" height="1" style="filter:url(#f)"/>')],
      ['un patron', svg('<pattern id="p" width="1" height="1"/>')],
      ['un simbolo', svg('<symbol id="s"/>')],
      ['un marcador', svg('<marker id="m"/>')],
      ['un marcador en una linea', svg('<line x1="0" y1="0" x2="1" y2="1" marker-end="url(#m)"/>')],
      ['un svg dentro de otro', svg('<svg viewBox="0 0 1 1"/>')],
      ['un switch', svg('<switch><g/></switch>')],
      ['un elemento que no existe', svg('<cosa/>')],
      ['texto suelto dentro de un grupo', svg('<g>hola</g>')],
      ['un valor de color que no es un color', svg('<rect fill="var(--color)"/>')],
      ['una variable de CSS', svg('<rect style="fill:var(--color)"/>')],
      ['un numero que no es un numero', svg('<rect width="diez"/>')],
      ['un numero desmesurado', svg('<rect width="1e99"/>')],
      ['una opacidad desmesurada', svg('<rect opacity="1e99"/>')],
      ['un limite de la esquina desmesurado', svg('<rect stroke-miterlimit="1e99"/>')],
      ['unos puntos desmesurados', svg('<polygon points="0,0 1e99,5 3,3"/>')],
      ['un trazo punteado desmesurado', svg('<rect stroke-dasharray="1e99 2"/>')],
      ['una opacidad que no es un numero', svg('<rect opacity="media"/>')],
      [
        'un color de parada que no es un color',
        svg(
          '<linearGradient id="g"><stop offset="0" stop-color="no es un color!"/></linearGradient>',
        ),
      ],
      [
        'un color de parada con una funcion de CSS',
        svg('<linearGradient id="g"><stop offset="0" stop-color="var(--c)"/></linearGradient>'),
      ],
      [
        'un color de parada con punto y coma',
        svg('<linearGradient id="g"><stop offset="0" stop-color="red; evil:1"/></linearGradient>'),
      ],
      ['un color de texto que no es un color', svg('<g color="@@@"/>')],
      [
        'una opacidad de parada que no es un numero',
        svg('<linearGradient id="g"><stop offset="0" stop-opacity="x"/></linearGradient>'),
      ],
      ['unos datos de trazo con letras de mas', svg('<path d="M 0 0 L 10 10 hola"/>')],
      ['una transformacion con una funcion que no existe', svg('<g transform="evil(1)"/>')],
      ['una transformacion con un script', svg('<g transform="translate(1) alert(1)"/>')],
      ['un valor de enumeracion que no existe', svg('<rect fill-rule="cualquiera"/>')],
      ['un identificador con caracteres raros', svg('<g id="a b"/>')],
      ['una cantidad de puntos que no son numeros', svg('<polygon points="0,0 a,b"/>')],
      [
        'un dibujo cuyo uso apunta a una forma que tiene otro uso',
        svg('<g id="a"><use href="#b"/></g><circle id="b" r="1"/><use href="#a"/>'),
      ],
      ['un uso que se apunta a si mismo', svg('<g id="a"><use href="#a"/></g>')],
    ])('%s', (_caso, texto) => {
      expect(rechazo(texto)).toBe('no-admitido');
    });
  });

  describe('lo demasiado complejo', () => {
    it('anidado mas alla del limite', () => {
      const abiertos = '<g>'.repeat(PROFUNDIDAD_MAXIMA);

      expect(rechazo(svg(abiertos + '</g>'.repeat(PROFUNDIDAD_MAXIMA)))).toBe('demasiado-complejo');
      // Justo dentro del limite: la raiz cuenta como un nivel.
      const dentro = '<g>'.repeat(PROFUNDIDAD_MAXIMA - 1);

      expect(rechazo(svg(dentro + '</g>'.repeat(PROFUNDIDAD_MAXIMA - 1)))).toBeUndefined();
    });

    it('con demasiados elementos', () => {
      expect(rechazo(svg('<g/>'.repeat(ELEMENTOS_MAXIMOS)))).toBe('demasiado-complejo');
      expect(rechazo(svg('<g/>'.repeat(ELEMENTOS_MAXIMOS - 1)))).toBeUndefined();
    });

    it('con demasiados atributos en un elemento', () => {
      const atributos = Array.from(
        { length: ATRIBUTOS_MAXIMOS + 1 },
        (_, i) => `data-a${i}="1"`,
      ).join(' ');

      expect(rechazo(svg(`<g ${atributos}/>`))).toBe('demasiado-complejo');
    });

    it('con demasiados usos de una misma forma', () => {
      const usos = '<use href="#c"/>'.repeat(101);

      expect(rechazo(svg(`<defs><circle id="c" r="1"/></defs>${usos}`))).toBe('demasiado-complejo');
      expect(
        rechazo(svg(`<defs><circle id="c" r="1"/></defs>${'<use href="#c"/>'.repeat(100)}`)),
      ).toBeUndefined();
    });

    it('con trazos que suman demasiado', () => {
      const trazo = `<path d="${'M 0 0 L 1 1 '.repeat(2500)}"/>`;

      expect(rechazo(svg(trazo.repeat(3)))).toBe('demasiado-complejo');
      expect(rechazo(svg(trazo.repeat(2)))).toBeUndefined();
    });

    it('con un valor demasiado largo en un atributo que no es un trazo', () => {
      expect(rechazo(svg(`<g id="${'a'.repeat(6000)}"/>`))).not.toBeUndefined();
      expect(rechazo(svg(`<rect width="${'1'.repeat(6000)}"/>`))).toBe('demasiado-complejo');
    });
  });

  describe('el error no cuenta lo que traia el archivo', () => {
    it.each([
      svg('<script>secreto-que-no-debe-salir</script>'),
      svg('<cosa-que-no-debe-salir/>'),
      svg('<rect fill="valor-que-no-debe-salir"/>'),
      'texto-que-no-debe-salir',
    ])('el mensaje no repite el contenido', (texto) => {
      try {
        crear(texto);
        expect.unreachable();
      } catch (error) {
        expect((error as Error).message).not.toContain('no-debe-salir');
      }
    });

    it('cada motivo tiene su codigo y su mensaje', () => {
      const codigos = (
        ['tipo', 'peso', 'no-es-svg', 'peligroso', 'no-admitido', 'demasiado-complejo'] as const
      ).map((motivo) => new InvalidPetSvgError(motivo).code);

      expect(new Set(codigos).size).toBe(6);
      expect(codigos.every((codigo) => codigo.startsWith('MASCOTA_SVG_'))).toBe(true);
    });
  });

  describe('lo que sale nunca lleva nada de lo que se rechaza', () => {
    it('ni la declaracion de XML ni el DOCTYPE ni los comentarios', () => {
      const resultado = salida(
        '<?xml version="1.0"?><!-- x --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
          svg('<!-- y --><g/>'),
      );

      expect(resultado).not.toMatch(/<\?|<!|-->/);
    });

    it('lo escapa todo lo que escribe', () => {
      // Un identificador no puede llevar comillas, pero la salida se escapa igual.
      const resultado = salida(svg('<rect width="1" height="1" fill="&#x23;aabbcc"/>'));

      expect(resultado).not.toContain('&#');
    });

    it('las unicas direcciones que escribe son las de los espacios de nombres', () => {
      const resultado = salida(
        svg(
          '<defs><linearGradient id="g"/></defs><rect width="1" height="1" fill="url(#g)"/><use href="#g"/>',
        ),
      );

      expect(
        resultado
          .replaceAll('http://www.w3.org/2000/svg', '')
          .replaceAll('http://www.w3.org/1999/xlink', ''),
      ).not.toMatch(/https?:|\/\//);
    });
  });
});

describe('leerElSvg: el lector estricto', () => {
  it('lee un arbol con sus atributos ya resueltos', () => {
    const arbol = leerElSvg(svg('<rect width="&#49;0" height="5"/>'));

    expect(arbol.nombre).toBe('svg');
    expect(arbol.hijos[0]?.atributos).toEqual([
      ['width', '10'],
      ['height', '5'],
    ]);
  });

  it('marca los elementos que traen texto', () => {
    expect(leerElSvg(svg('<g>hola</g>')).hijos[0]?.conTexto).toBe(true);
    expect(leerElSvg(svg('<g>   \n  </g>')).hijos[0]?.conTexto).toBe(false);
  });
});

describe('probado contra miles de variaciones de ataques y de dibujos validos', () => {
  /**
   * Un generador de numeros que da siempre la misma secuencia: si algo falla,
   * se puede repetir.
   */
  function generador(semilla: number): () => number {
    let estado = semilla >>> 0;

    return () => {
      estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;

      return estado / 0x1_0000_0000;
    };
  }

  const SEMILLAS = [
    svg('<circle cx="50" cy="50" r="40" fill="#ff0000" stroke="#000" stroke-width="2"/>'),
    svg(
      '<defs><linearGradient id="g"><stop offset="0" stop-color="red"/></linearGradient></defs><rect width="9" height="9" fill="url(#g)"/>',
    ),
    svg(
      '<g transform="translate(5,5)"><path d="M0 0L10 10Z" style="fill:blue;stroke:#000"/></g><use href="#a"/>',
    ),
    svg(
      '<defs><clipPath id="c"><rect width="50" height="50"/></clipPath></defs><g clip-path="url(#c)"><ellipse cx="25" cy="25" rx="20" ry="10" fill="#ffd166"/></g>',
    ),
    svg(
      '<polygon points="0,0 10,0 5,10" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/><line x1="0" y1="0" x2="9" y2="9" stroke="red"/>',
    ),
    svg(
      '<defs><circle id="a" r="4"/></defs><use href="#a" x="10" y="10"/><use xlink:href="#a" x="30" y="30"/>',
      `<svg ${XMLNS} viewBox="0 0 100 100">`,
    ),
    svg('<script>alert(1)</script><rect onload="alert(1)"/>'),
    svg('<a href="javascript:alert(1)"><rect/></a><use href="https://ejemplo.invalid/x.svg#a"/>'),
    svg(
      '<foreignObject><iframe src="x"/></foreignObject><animate attributeName="href" values="javascript:alert(1)"/>',
    ),
    '<!DOCTYPE svg [<!ENTITY a "b">]>' + svg('<g id="&a;"/>'),
    '<?xml version="1.0"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
      svg('<g/>'),
  ];

  const PIEZAS = [
    '<script>',
    '</script>',
    'onload="x"',
    'javascript:',
    ' href="http://x/y#a"',
    '<![CDATA[',
    ']]>',
    '<!',
    '<?',
    '&#x6a;avascript:',
    'url(http://x)',
    '<foreignObject>',
    '<iframe/>',
    '\u0000',
    '"',
    "'",
    '<',
    '>',
    '&',
    ';',
    ':',
    ' xmlns:x="http://x"',
    '<x:script/>',
    'style="fill:url(//x)"',
    '<style>',
    '<animate/>',
    '<set/>',
  ];

  /** Cosas que no rompen nada: para que tambien salgan variaciones que se aceptan. */
  const INOFENSIVAS = [
    ' ',
    '\n',
    '<!-- un comentario -->',
    ' opacity="0.5"',
    ' fill="red"',
    ' stroke="#123456"',
    ' id="x1"',
    '<g/>',
    '<rect width="2" height="2"/>',
    '<circle r="3"/>',
    '<title>algo</title>',
  ];
  const TODAS = [...PIEZAS, ...INOFENSIVAS, ...INOFENSIVAS, ...INOFENSIVAS];

  function mutar(texto: string, azar: () => number): string {
    let resultado = texto;
    const cambios = 1 + Math.floor(azar() * 2);

    for (let i = 0; i < cambios; i += 1) {
      const donde = Math.floor(azar() * (resultado.length + 1));
      const que = azar();

      if (que < 0.4) {
        resultado =
          resultado.slice(0, donde) +
          TODAS[Math.floor(azar() * TODAS.length)] +
          resultado.slice(donde);
      } else if (que < 0.7) {
        resultado = resultado.slice(0, donde) + resultado.slice(donde + 1 + Math.floor(azar() * 8));
      } else if (que < 0.9) {
        resultado =
          resultado.slice(0, donde) +
          String.fromCharCode(32 + Math.floor(azar() * 95)) +
          resultado.slice(donde + 1);
      } else {
        const otro = SEMILLAS[Math.floor(azar() * SEMILLAS.length)] ?? '';
        const desde = Math.floor(azar() * otro.length);

        resultado =
          resultado.slice(0, donde) +
          otro.slice(desde, desde + 1 + Math.floor(azar() * 40)) +
          resultado.slice(donde);
      }
    }

    return resultado;
  }

  const DIRECCIONES_PERMITIDAS = /http:\/\/www\.w3\.org\/(?:2000\/svg|1999\/xlink)/g;
  const ELEMENTOS_QUE_SALEN = new Set([
    'svg',
    'g',
    'defs',
    'path',
    'circle',
    'ellipse',
    'rect',
    'line',
    'polyline',
    'polygon',
    'linearGradient',
    'radialGradient',
    'stop',
    'clipPath',
    'mask',
    'use',
  ]);

  it('de 6000 variaciones, cada una se rechaza con un motivo o sale limpia, y nunca falla de otra manera', () => {
    const azar = generador(20_261_011);
    let aceptadas = 0;
    let rechazadas = 0;

    for (let vuelta = 0; vuelta < 6000; vuelta += 1) {
      const original = SEMILLAS[vuelta % SEMILLAS.length] ?? '';
      const texto = mutar(original, azar);
      let resultado: string;

      try {
        resultado = new TextDecoder().decode(
          SvgDeMascota.crear(bytes(texto), TIPO_DEL_SVG).contenido,
        );
      } catch (error) {
        // Solo se admite uno de los errores del dominio: ni un TypeError ni un
        // RangeError ni nada que se escape.
        expect(error, `la variacion ${vuelta} fallo con otro error:\n${texto}`).toBeInstanceOf(
          InvalidPetSvgError,
        );
        rechazadas += 1;
        continue;
      }

      aceptadas += 1;

      const pistas = `variacion ${vuelta}:\n${texto}\n--- salio:\n${resultado}`;
      const sinEspacios = resultado.replace(DIRECCIONES_PERMITIDAS, '');

      expect(sinEspacios, pistas).not.toMatch(
        /https?:|\/\/|javascript|vbscript|data:|<script|<!|<\?|\son[a-z]+\s*=|expression\(|@import|\\|<foreignobject|<iframe|<a[\s>]/i,
      );

      // Los unicos elementos que salen son los de la lista.
      for (const etiqueta of resultado.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)/g)) {
        expect(ELEMENTOS_QUE_SALEN.has(etiqueta[1] ?? ''), pistas).toBe(true);
      }

      // Y es estable: volver a limpiarlo no cambia nada.
      expect(
        new TextDecoder().decode(SvgDeMascota.crear(bytes(resultado), TIPO_DEL_SVG).contenido),
        pistas,
      ).toBe(resultado);
    }

    // Que la prueba no sea vacia: tiene que haber de las dos cosas.
    expect(aceptadas).toBeGreaterThan(150);
    expect(rechazadas).toBeGreaterThan(1000);
  });
});
