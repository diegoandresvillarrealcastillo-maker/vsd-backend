import { InvalidPetSvgError } from '../DomainError.js';
import {
  ESPACIOS_DE_NOMBRES,
  ESPACIO_DE_NOMBRES_DEL_SVG,
  leerElSvg,
  type NodoDeSvg,
} from './LectorDeSvg.js';

/**
 * El SVG de una mascota propia (SCRUM-122).
 *
 * Un SVG no es una imagen como un JPEG: es un documento que puede llevar
 * scripts, enlaces a otros sitios, otros documentos incrustados y hojas de
 * estilo. Aceptar uno que subio una persona y devolverselo tal cual seria
 * guardar y servir codigo ajeno. Por eso aqui **no se limpia el archivo, se
 * reconstruye**:
 *
 * 1. Se lee con un lector estricto (`LectorDeSvg`), que rechaza lo que no
 *    entiende en lugar de intentar adivinarlo.
 * 2. Se recorre el arbol con una **lista blanca** de elementos y de atributos.
 *    Lo que no esta en la lista, o se descarta si es inofensivo (los metadatos
 *    de un editor), o se rechaza el archivo entero si es peligroso o no se
 *    admite. Nunca se deja pasar «por si acaso».
 * 3. Cada valor que se queda se **valida contra su tipo**: un numero es un
 *    numero, un color es un color, una referencia es `#algo`. Un valor que no
 *    cumple no se corrige: se rechaza.
 * 4. Lo que se guarda es **un SVG nuevo, escrito desde ese arbol**. No queda
 *    ni un byte del archivo original que no haya pasado por los pasos de
 *    arriba.
 *
 * Y aun asi, el SVG se muestra solo como `<img>` y nunca incrustado en la
 * pagina: en ese modo el navegador no ejecuta scripts ni carga nada externo. Es
 * la segunda barrera; esta es la primera.
 *
 * ## Rechazar o descartar
 *
 * - **Se rechaza** (`peligroso`): scripts, manejadores de eventos (`onload`...),
 *   `foreignObject`, enlaces y referencias fuera del propio documento,
 *   animaciones, DOCTYPE y entidades, CDATA, instrucciones de procesamiento.
 * - **Se rechaza** (`no-admitido`): lo que es inofensivo pero que esta version
 *   no sabe pintar bien: textos, imagenes de mapa de bits, filtros, estilos,
 *   patrones. Decirlo claro evita que alguien suba un dibujo al que le faltan
 *   partes sin saber por que.
 * - **Se descarta**: titulos, descripciones, metadatos, y todo lo que dejan los
 *   editores (`inkscape:*`, `sodipodi:*`, `data-*`, clases).
 */

export const TIPO_DEL_SVG = 'image/svg+xml';

/** 100 KB. Un dibujo de trazos limpio pesa mucho menos. */
export const PESO_MAXIMO_DEL_SVG = 100 * 1024;

/** Cuantas veces se puede reutilizar una forma con `<use>`. */
const USOS_MAXIMOS = 100;

/** Lo mas largo que puede ser un trazo entero, sumados todos. */
const LARGO_MAXIMO_DE_LOS_TRAZOS = 80_000;

const LARGO_MAXIMO_DE_UN_VALOR = 5_000;

const DECODIFICADOR = new TextDecoder('utf-8', { fatal: true });
const CODIFICADOR = new TextEncoder();

function noEsUnSvg(): InvalidPetSvgError {
  return new InvalidPetSvgError('no-es-svg');
}

function peligroso(): InvalidPetSvgError {
  return new InvalidPetSvgError('peligroso');
}

function noAdmitido(): InvalidPetSvgError {
  return new InvalidPetSvgError('no-admitido');
}

function demasiadoComplejo(): InvalidPetSvgError {
  return new InvalidPetSvgError('demasiado-complejo');
}

// ---------------------------------------------------------------------------
// Los elementos
// ---------------------------------------------------------------------------

/** Los unicos elementos que se escriben en el SVG nuevo. */
const ELEMENTOS_PERMITIDOS: ReadonlySet<string> = new Set([
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

/** Inofensivos y sin efecto en el dibujo: se descartan con todo lo que llevan. */
const ELEMENTOS_QUE_SE_DESCARTAN: ReadonlySet<string> = new Set(['title', 'desc', 'metadata']);

/** Los prefijos de los editores: lo que traen es del programa, no del dibujo. */
const PREFIJOS_DE_EDITOR: ReadonlySet<string> = new Set([
  'inkscape',
  'sodipodi',
  'rdf',
  'cc',
  'dc',
]);

/**
 * Elementos con los que un SVG puede ejecutar codigo, cargar algo de fuera o
 * incrustar otro documento. Se comparan en minusculas: no importa como los
 * escriba quien sube el archivo.
 */
const ELEMENTOS_PELIGROSOS: ReadonlySet<string> = new Set([
  'script',
  'foreignobject',
  'iframe',
  'frame',
  'frameset',
  'object',
  'embed',
  'applet',
  'audio',
  'video',
  'canvas',
  'link',
  'meta',
  'base',
  'html',
  'head',
  'body',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'template',
  'math',
  // Un enlace es una referencia a otro sitio.
  'a',
  // Las animaciones pueden cambiar un enlace o un valor despues de la
  // revision: `<set attributeName="href" to="javascript:...">`.
  'set',
  'animate',
  'animatemotion',
  'animatetransform',
  'animatecolor',
  'handler',
  'listener',
]);

// ---------------------------------------------------------------------------
// Los valores
// ---------------------------------------------------------------------------

const NUMERO = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const LONGITUD = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?(?:px|pt|pc|em|ex|cm|mm|in|%)?$/;
const IDENTIFICADOR = /^[A-Za-z_][A-Za-z0-9_.-]{0,63}$/;
const REFERENCIA_INTERNA = /^#[A-Za-z_][A-Za-z0-9_.-]{0,63}$/;
const URL_INTERNA = /^url\(\s*#[A-Za-z_][A-Za-z0-9_.-]{0,63}\s*\)$/;
const COLOR =
  /^(?:none|currentColor|transparent|inherit|#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})|[A-Za-z]{3,30}|(?:rgb|rgba|hsl|hsla)\([0-9.,%\s/+-]{1,60}\))$/;
const TRANSFORMACION =
  /^(?:\s*(?:matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*[-+0-9.eE]+(?:[\s,]+[-+0-9.eE]+)*\s*\)\s*,?)+\s*$/;
const DATOS_DEL_TRAZO = /^[MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]+$/;
const ASPECTO = /^(?:none|x(?:Min|Mid|Max)Y(?:Min|Mid|Max))(?:\s+(?:meet|slice))?$/;

const MAGNITUD_MAXIMA = 1e7;

type Validador = (valor: string) => string | undefined;

function esNumero(valor: string): boolean {
  return NUMERO.test(valor) && Math.abs(Number.parseFloat(valor)) <= MAGNITUD_MAXIMA;
}

const numero: Validador = (valor) => (esNumero(valor.trim()) ? valor.trim() : undefined);

const longitud: Validador = (valor) => {
  const limpio = valor.trim();

  return LONGITUD.test(limpio) && Math.abs(Number.parseFloat(limpio)) <= MAGNITUD_MAXIMA
    ? limpio
    : undefined;
};

/** Una lista de numeros separados por espacios o comas. */
const listaDeNumeros: Validador = (valor) => {
  const partes = valor.trim().split(/[\s,]+/);

  return partes.length > 0 && partes.length <= 20_000 && partes.every(esNumero)
    ? partes.join(' ')
    : undefined;
};

const color: Validador = (valor) => (COLOR.test(valor.trim()) ? valor.trim() : undefined);

/** `none`, un color, o una referencia a un degradado del propio dibujo. */
const pintura: Validador = (valor) => {
  const limpio = valor.trim();

  if (URL_INTERNA.test(limpio)) {
    return limpio;
  }

  // `url(#a) rojo`: la referencia y, despues, un color de respaldo.
  const respaldo = /^(url\(\s*#[A-Za-z_][A-Za-z0-9_.-]{0,63}\s*\))\s+(\S+)$/.exec(limpio);

  return respaldo?.[1] !== undefined && respaldo[2] !== undefined && COLOR.test(respaldo[2])
    ? limpio
    : COLOR.test(limpio)
      ? limpio
      : undefined;
};

const referenciaALaForma: Validador = (valor) => {
  const limpio = valor.trim();

  return limpio === 'none' || URL_INTERNA.test(limpio) ? limpio : undefined;
};

function enumeracion(...permitidos: string[]): Validador {
  return (valor) => (permitidos.includes(valor.trim()) ? valor.trim() : undefined);
}

const transformacion: Validador = (valor) =>
  valor.length <= 2_000 && TRANSFORMACION.test(valor) ? valor.trim() : undefined;

const identificador: Validador = (valor) => (IDENTIFICADOR.test(valor) ? valor : undefined);

const datosDelTrazo: Validador = (valor) =>
  DATOS_DEL_TRAZO.test(valor) ? valor.trim() : undefined;

const vistaDelDibujo: Validador = (valor) => {
  const partes = valor.trim().split(/[\s,]+/);

  return partes.length === 4 && partes.every(esNumero) ? partes.join(' ') : undefined;
};

const aspecto: Validador = (valor) => (ASPECTO.test(valor.trim()) ? valor.trim() : undefined);

/** Los atributos que se aceptan en cualquier elemento, y como se valida cada uno. */
const ATRIBUTOS_DE_PRESENTACION: Readonly<Record<string, Validador>> = {
  id: identificador,
  fill: pintura,
  'fill-opacity': numero,
  'fill-rule': enumeracion('nonzero', 'evenodd'),
  stroke: pintura,
  'stroke-width': longitud,
  'stroke-opacity': numero,
  'stroke-linecap': enumeracion('butt', 'round', 'square'),
  'stroke-linejoin': enumeracion('miter', 'round', 'bevel', 'miter-clip', 'arcs'),
  'stroke-miterlimit': numero,
  'stroke-dasharray': (valor) => (valor.trim() === 'none' ? 'none' : listaDeNumeros(valor)),
  'stroke-dashoffset': longitud,
  opacity: numero,
  transform: transformacion,
  'clip-path': referenciaALaForma,
  'clip-rule': enumeracion('nonzero', 'evenodd'),
  mask: referenciaALaForma,
  display: enumeracion('inline', 'block', 'none'),
  visibility: enumeracion('visible', 'hidden', 'collapse'),
  color: color,
};

/** Los atributos propios de cada elemento. */
const ATRIBUTOS_DE_CADA_ELEMENTO: Readonly<Record<string, Readonly<Record<string, Validador>>>> = {
  svg: { preserveAspectRatio: aspecto },
  g: {},
  defs: {},
  path: { d: datosDelTrazo, pathLength: numero },
  circle: { cx: longitud, cy: longitud, r: longitud },
  ellipse: { cx: longitud, cy: longitud, rx: longitud, ry: longitud },
  rect: { x: longitud, y: longitud, width: longitud, height: longitud, rx: longitud, ry: longitud },
  line: { x1: longitud, y1: longitud, x2: longitud, y2: longitud },
  polyline: { points: listaDeNumeros },
  polygon: { points: listaDeNumeros },
  linearGradient: {
    x1: longitud,
    y1: longitud,
    x2: longitud,
    y2: longitud,
    gradientUnits: enumeracion('userSpaceOnUse', 'objectBoundingBox'),
    gradientTransform: transformacion,
    spreadMethod: enumeracion('pad', 'reflect', 'repeat'),
  },
  radialGradient: {
    cx: longitud,
    cy: longitud,
    r: longitud,
    fx: longitud,
    fy: longitud,
    gradientUnits: enumeracion('userSpaceOnUse', 'objectBoundingBox'),
    gradientTransform: transformacion,
    spreadMethod: enumeracion('pad', 'reflect', 'repeat'),
  },
  stop: { offset: longitud, 'stop-color': color, 'stop-opacity': numero },
  clipPath: { clipPathUnits: enumeracion('userSpaceOnUse', 'objectBoundingBox') },
  mask: {
    maskUnits: enumeracion('userSpaceOnUse', 'objectBoundingBox'),
    maskContentUnits: enumeracion('userSpaceOnUse', 'objectBoundingBox'),
    x: longitud,
    y: longitud,
    width: longitud,
    height: longitud,
  },
  use: { x: longitud, y: longitud, width: longitud, height: longitud },
};

/** Los que pueden ir en un `style="..."`: los de presentacion, menos `id`. */
const PROPIEDADES_DE_ESTILO: ReadonlySet<string> = new Set(
  Object.keys(ATRIBUTOS_DE_PRESENTACION).filter((nombre) => nombre !== 'id'),
);

/** Elementos que pueden llevar `href` hacia algo del propio dibujo. */
const ELEMENTOS_CON_REFERENCIA: ReadonlySet<string> = new Set([
  'use',
  'linearGradient',
  'radialGradient',
]);

// ---------------------------------------------------------------------------
// Lo peligroso, mirado en todo el arbol antes de usar nada
// ---------------------------------------------------------------------------

/**
 * Lo que nunca deberia aparecer en un valor, escrito como se escriba.
 *
 * Un `data:` es un rechazo, salvo el de una imagen de mapa de bits en base64:
 * es lo que dejan los editores cuando incrustan una foto, y eso no es
 * peligroso sino que no se admite (`<image>` no esta en la lista), y asi se le
 * dice a la persona.
 */
const VALOR_PELIGROSO =
  /javascript:|vbscript:|livescript:|(?:^|[^a-z0-9])data:(?!image\/(?:png|jpe?g|gif|webp);base64,)|<script|expression\(|-moz-binding|@import|behavior:/;

/** La parte de un nombre que va despues de los dos puntos. */
function nombreLocal(nombre: string): string {
  const dosPuntos = nombre.indexOf(':');

  return dosPuntos < 0 ? nombre : nombre.slice(dosPuntos + 1);
}

function prefijoDe(nombre: string): string | undefined {
  const dosPuntos = nombre.indexOf(':');

  return dosPuntos < 0 ? undefined : nombre.slice(0, dosPuntos);
}

/**
 * Mira un valor sin importar donde este: si lleva codigo o una referencia a
 * otro sitio, es un rechazo. Se compacta antes —sin espacios ni caracteres de
 * control, en minusculas— porque `java\tscript:` y `JAVASCRIPT :` son lo mismo
 * para un navegador.
 */
function comprobarElValor(valor: string): void {
  // eslint-disable-next-line no-control-regex
  const compacto = valor.replace(/[\s\u0000-\u001f]+/g, '').toLowerCase();

  if (VALOR_PELIGROSO.test(compacto)) {
    throw peligroso();
  }

  // Toda referencia `url(...)` tiene que ser `url(#algo)`.
  for (const coincidencia of compacto.matchAll(/url\(([^)]*)\)?/g)) {
    const argumento = (coincidencia[1] ?? '').replace(/^["']|["']$/g, '');

    if (!coincidencia[0].endsWith(')') || !REFERENCIA_INTERNA.test(argumento)) {
      throw peligroso();
    }
  }
}

/**
 * Recorre **todo** el arbol —tambien lo que despues se descarta— buscando lo
 * que nunca se acepta: un elemento peligroso, un manejador de eventos, un valor
 * con codigo. Un archivo con un `<script>` escondido dentro de los metadatos se
 * rechaza igual: seria un archivo hecho para atacar, y es mejor decirlo.
 */
function buscarLoPeligroso(nodo: NodoDeSvg): void {
  const pendientes: NodoDeSvg[] = [nodo];

  while (pendientes.length > 0) {
    const actual = pendientes.pop();

    if (actual === undefined) {
      break;
    }

    const prefijo = prefijoDe(actual.nombre);

    // Un prefijo de elemento que no es el de un editor ni el del propio SVG:
    // es la forma de decir `<s:script>` con un espacio de nombres propio.
    if (prefijo !== undefined && !PREFIJOS_DE_EDITOR.has(prefijo)) {
      throw peligroso();
    }

    if (ELEMENTOS_PELIGROSOS.has(nombreLocal(actual.nombre).toLowerCase())) {
      throw peligroso();
    }

    for (const [nombre, valor] of actual.atributos) {
      // `onload`, `onclick`, `onmouseover`...: no hay uno inofensivo.
      if (nombreLocal(nombre).toLowerCase().startsWith('on')) {
        throw peligroso();
      }

      comprobarElValor(valor);
    }

    pendientes.push(...actual.hijos);
  }
}

// ---------------------------------------------------------------------------
// Reconstruir el dibujo
// ---------------------------------------------------------------------------

interface Contexto {
  readonly identificadores: Set<string>;
  readonly porIdentificador: Map<string, NodoDeSvg>;
  readonly usos: { readonly nodo: NodoDeSvg; readonly objetivo: string }[];
  largoDeLosTrazos: number;
}

/** Lo que se escribe de un elemento ya revisado. */
interface ElementoLimpio {
  readonly nombre: string;
  readonly atributos: readonly (readonly [string, string])[];
  readonly hijos: readonly ElementoLimpio[];
}

function escapar(valor: string): string {
  return valor
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escribir(elemento: ElementoLimpio): string {
  const atributos = elemento.atributos
    .map(([nombre, valor]) => ` ${nombre}="${escapar(valor)}"`)
    .join('');

  if (elemento.hijos.length === 0) {
    return `<${elemento.nombre}${atributos}/>`;
  }

  return `<${elemento.nombre}${atributos}>${elemento.hijos.map(escribir).join('')}</${elemento.nombre}>`;
}

/**
 * Separa un `style="a: b; c: d"` en sus declaraciones y deja solo las de
 * presentacion que se aceptan. Una declaracion con codigo, con una barra
 * invertida —que sirve para escribir `url` sin que se note— o con un comentario,
 * es un rechazo.
 */
function leerElEstilo(estilo: string): Map<string, string> {
  const declaraciones = new Map<string, string>();

  for (const declaracion of estilo.split(';')) {
    const limpia = declaracion.trim();

    if (limpia === '') {
      continue;
    }

    const dosPuntos = limpia.indexOf(':');

    if (dosPuntos < 1) {
      throw noEsUnSvg();
    }

    const propiedad = limpia.slice(0, dosPuntos).trim().toLowerCase();
    const valor = limpia
      .slice(dosPuntos + 1)
      .replace(/\s*!important\s*$/i, '')
      .trim();

    if (valor.includes('\\') || valor.includes('/*')) {
      throw peligroso();
    }

    if (propiedad === 'filter' || propiedad.startsWith('marker')) {
      throw noAdmitido();
    }

    if (PROPIEDADES_DE_ESTILO.has(propiedad)) {
      declaraciones.set(propiedad, valor);
    }
  }

  return declaraciones;
}

/**
 * Los atributos que se quedan de un elemento, validados, en un orden fijo.
 *
 * Lo desconocido se descarta, salvo lo que nunca se acepta: los filtros y los
 * marcadores son un rechazo, y un enlace fuera del documento tambien.
 */
function atributosDe(
  nodo: NodoDeSvg,
  extras: Readonly<Record<string, Validador>>,
  contexto: Contexto,
): [string, string][] {
  const valores = new Map<string, string>();
  let referencia: string | undefined;
  let estilo = new Map<string, string>();

  for (const [nombre, valor] of nodo.atributos) {
    if (nombre === 'xmlns' || nombre.startsWith('xmlns:')) {
      continue;
    }

    const prefijo = prefijoDe(nombre);
    const local = nombreLocal(nombre);

    if (prefijo !== undefined) {
      if (prefijo === 'xlink' && local === 'href') {
        if (referencia !== undefined) {
          throw noEsUnSvg();
        }

        referencia = valor;
      } else if (prefijo !== 'xml' && ESPACIOS_DE_NOMBRES[prefijo] === undefined) {
        // Un prefijo que ni se declaro: no esta bien formado.
        throw noEsUnSvg();
      }

      // `xml:space`, `inkscape:*`, `sodipodi:*`, `xlink:title`...: se descartan.
      continue;
    }

    if (nombre === 'href') {
      if (referencia !== undefined) {
        throw noEsUnSvg();
      }

      referencia = valor;
    } else if (nombre === 'style') {
      estilo = leerElEstilo(valor);
    } else if (nombre === 'filter' || nombre === 'marker' || nombre.startsWith('marker-')) {
      throw noAdmitido();
    } else {
      valores.set(nombre, valor);
    }
  }

  // El estilo en linea gana sobre los atributos, como en CSS.
  for (const [propiedad, valor] of estilo) {
    valores.set(propiedad, valor);
  }

  const resultado: [string, string][] = [];
  const validadores: Readonly<Record<string, Validador>> = {
    ...ATRIBUTOS_DE_PRESENTACION,
    ...extras,
  };

  for (const [nombre, validador] of Object.entries(validadores)) {
    const valor = valores.get(nombre);

    if (valor === undefined) {
      continue;
    }

    if (valor.length > LARGO_MAXIMO_DE_UN_VALOR && nombre !== 'd' && nombre !== 'points') {
      throw demasiadoComplejo();
    }

    const aceptado = validador(valor);

    if (aceptado === undefined) {
      throw noAdmitido();
    }

    if (nombre === 'd') {
      contexto.largoDeLosTrazos += aceptado.length;

      if (contexto.largoDeLosTrazos > LARGO_MAXIMO_DE_LOS_TRAZOS) {
        throw demasiadoComplejo();
      }
    }

    if (nombre === 'id') {
      if (contexto.identificadores.has(aceptado)) {
        throw noEsUnSvg();
      }

      contexto.identificadores.add(aceptado);
      contexto.porIdentificador.set(aceptado, nodo);
    }

    resultado.push([nombre, aceptado]);
  }

  if (referencia !== undefined) {
    // Un enlace solo puede llevar a algo del propio dibujo. Cualquier otro
    // —una direccion, un `data:`, una ruta— es ir a buscar algo fuera.
    if (!ELEMENTOS_CON_REFERENCIA.has(nodo.nombre) || !REFERENCIA_INTERNA.test(referencia.trim())) {
      throw peligroso();
    }

    resultado.push(['xlink:href', referencia.trim()]);

    if (nodo.nombre === 'use') {
      contexto.usos.push({ nodo, objetivo: referencia.trim().slice(1) });

      if (contexto.usos.length > USOS_MAXIMOS) {
        throw demasiadoComplejo();
      }
    }
  }

  return resultado;
}

function sanearElemento(nodo: NodoDeSvg, contexto: Contexto): ElementoLimpio | undefined {
  const prefijo = prefijoDe(nodo.nombre);

  // Lo que dejan los editores y lo que no aporta al dibujo.
  if (
    (prefijo !== undefined && PREFIJOS_DE_EDITOR.has(prefijo)) ||
    ELEMENTOS_QUE_SE_DESCARTAN.has(nodo.nombre)
  ) {
    return undefined;
  }

  if (prefijo !== undefined || !ELEMENTOS_PERMITIDOS.has(nodo.nombre)) {
    // Los peligrosos ya se rechazaron al mirar todo el arbol. Lo que queda es
    // inofensivo pero no se pinta: textos, imagenes, estilos, filtros...
    throw noAdmitido();
  }

  // Un `<svg>` dentro del dibujo es otro documento anidado.
  if (nodo.nombre === 'svg' || nodo.conTexto) {
    throw noAdmitido();
  }

  const extras = ATRIBUTOS_DE_CADA_ELEMENTO[nodo.nombre] ?? {};
  const hijos: ElementoLimpio[] = [];

  for (const hijo of nodo.hijos) {
    const limpio = sanearElemento(hijo, contexto);

    if (limpio !== undefined) {
      hijos.push(limpio);
    }
  }

  return { nombre: nodo.nombre, atributos: atributosDe(nodo, extras, contexto), hijos };
}

/** Si un elemento, o algo dentro de el, es un `<use>`. */
function contieneUnUso(nodo: NodoDeSvg): boolean {
  return nodo.nombre === 'use' || nodo.hijos.some(contieneUnUso);
}

/**
 * Un `<use>` no puede apuntar a algo que tenga otro `<use>` dentro: es como se
 * construye un dibujo que se multiplica a si mismo hasta agotar al navegador
 * («billion laughs» de los SVG), y tambien como se hace un ciclo.
 */
function comprobarLosUsos(contexto: Contexto): void {
  for (const uso of contexto.usos) {
    const objetivo = contexto.porIdentificador.get(uso.objetivo);

    if (objetivo !== undefined && contieneUnUso(objetivo)) {
      throw noAdmitido();
    }
  }
}

/** Los atributos de la raiz: el encuadre y lo de presentacion. */
function atributosDeLaRaiz(raiz: NodoDeSvg, contexto: Contexto): [string, string][] {
  const crudos = new Map(raiz.atributos);
  const atributos = atributosDe(raiz, ATRIBUTOS_DE_CADA_ELEMENTO['svg'] ?? {}, contexto);

  let vista = crudos.get('viewBox');

  if (vista === undefined) {
    // Sin encuadre, se saca del ancho y el alto, si son numeros.
    const ancho = crudos.get('width')?.trim().replace(/px$/, '');
    const alto = crudos.get('height')?.trim().replace(/px$/, '');

    if (ancho === undefined || alto === undefined || !esNumero(ancho) || !esNumero(alto)) {
      throw noEsUnSvg();
    }

    vista = `0 0 ${ancho} ${alto}`;
  }

  const encuadre = vistaDelDibujo(vista);
  const medidas = encuadre?.split(' ').map(Number.parseFloat);

  if (
    encuadre === undefined ||
    medidas === undefined ||
    (medidas[2] ?? 0) <= 0 ||
    (medidas[3] ?? 0) <= 0
  ) {
    throw noEsUnSvg();
  }

  // El ancho y el alto de la raiz no se guardan: el dibujo se muestra al
  // tamano que le de la pantalla, y un `width="100000"` no tiene que decidir.
  return [['viewBox', encuadre], ...atributos];
}

/**
 * Convierte el arbol leido en el SVG limpio, como texto.
 *
 * @throws {InvalidPetSvgError}
 */
export function sanearElSvg(raiz: NodoDeSvg): string {
  if (raiz.nombre !== 'svg' || raiz.conTexto) {
    throw noEsUnSvg();
  }

  buscarLoPeligroso(raiz);

  const contexto: Contexto = {
    identificadores: new Set(),
    porIdentificador: new Map(),
    usos: [],
    largoDeLosTrazos: 0,
  };

  const hijos: ElementoLimpio[] = [];

  for (const hijo of raiz.hijos) {
    const limpio = sanearElemento(hijo, contexto);

    if (limpio !== undefined) {
      hijos.push(limpio);
    }
  }

  comprobarLosUsos(contexto);

  return escribir({
    nombre: 'svg',
    atributos: [
      ['xmlns', ESPACIO_DE_NOMBRES_DEL_SVG],
      ['xmlns:xlink', ESPACIOS_DE_NOMBRES['xlink'] ?? ''],
      ...atributosDeLaRaiz(raiz, contexto),
    ],
    hijos,
  });
}

/** Un SVG de mascota que ya paso todas las reglas, reescrito. */
export class SvgDeMascota {
  private constructor(
    /** Lo que se guarda: el SVG nuevo, no el que subio la persona. */
    readonly contenido: Uint8Array,
    readonly tipo: typeof TIPO_DEL_SVG,
  ) {}

  /**
   * Valida lo que llego y devuelve el SVG limpio, o falla diciendo por que.
   *
   * @param tipoDeclarado El `Content-Type` de la peticion.
   */
  static crear(contenido: Uint8Array, tipoDeclarado: string): SvgDeMascota {
    const tipo = (tipoDeclarado.split(';')[0] ?? '').trim().toLowerCase();

    if (tipo !== TIPO_DEL_SVG) {
      throw new InvalidPetSvgError('tipo');
    }

    if (contenido.length === 0) {
      throw noEsUnSvg();
    }

    // El peso se mira antes de abrir nada: un archivo enorme no se recorre.
    if (contenido.length > PESO_MAXIMO_DEL_SVG) {
      throw new InvalidPetSvgError('peso');
    }

    let texto: string;

    try {
      texto = DECODIFICADOR.decode(contenido);
    } catch {
      // No es UTF-8 valido.
      throw noEsUnSvg();
    }

    const limpio = CODIFICADOR.encode(sanearElSvg(leerElSvg(texto)));

    if (limpio.length > PESO_MAXIMO_DEL_SVG) {
      throw new InvalidPetSvgError('peso');
    }

    return new SvgDeMascota(limpio, TIPO_DEL_SVG);
  }
}
