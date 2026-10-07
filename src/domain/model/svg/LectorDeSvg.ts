import { InvalidPetSvgError } from '../DomainError.js';

/**
 * Un lector de XML **estricto**, para SVG (SCRUM-122).
 *
 * No es un lector de XML general: entiende lo justo para leer un SVG de
 * trazos y **rechaza todo lo demas**. Eso es lo que lo hace seguro:
 *
 * - **Sin DOCTYPE ni entidades propias.** Es por donde entran los ataques de
 *   expansion de entidades («billion laughs») y los de lectura de archivos del
 *   servidor (XXE). Aqui ni se miran: un `<!` que no sea un comentario es un
 *   rechazo.
 * - **Sin CDATA ni instrucciones de procesamiento.** Es donde se esconden los
 *   scripts y las hojas de estilo externas (`<?xml-stylesheet ...?>`).
 * - **Solo las cinco entidades predefinidas y las referencias numericas**, y
 *   se resuelven antes de mirar el valor: `&#106;avascript:` se ve como lo que
 *   es.
 * - **Nombres de espacio limitados** a los del propio SVG y a los de los
 *   editores conocidos. Aceptar un prefijo cualquiera permitiria un
 *   `<s:script>` con `xmlns:s` apuntando al espacio de nombres del SVG.
 * - **Limites de profundidad y de cantidad de elementos**, para que un archivo
 *   pequeno no obligue a recorrer un arbol enorme.
 *
 * Devuelve un arbol. Quien lo use **nunca** reproduce el texto original: lo
 * escribe de nuevo desde el arbol, con lo que cada parte pasa por una lista
 * blanca.
 */

export interface NodoDeSvg {
  readonly nombre: string;
  /** En el orden del archivo. Los valores ya vienen con las entidades resueltas. */
  readonly atributos: readonly (readonly [nombre: string, valor: string])[];
  readonly hijos: readonly NodoDeSvg[];
  /** Si entre sus etiquetas habia texto que no era espacio en blanco. */
  readonly conTexto: boolean;
}

/** Lo mas profundo que puede anidarse un SVG. */
export const PROFUNDIDAD_MAXIMA = 20;

/** Cuantos elementos puede tener un SVG, contando los que se ignoran. */
export const ELEMENTOS_MAXIMOS = 2000;

/** Cuantos atributos puede tener un elemento. */
export const ATRIBUTOS_MAXIMOS = 64;

/** Los prefijos de espacio de nombres que se aceptan, con su direccion exacta. */
export const ESPACIOS_DE_NOMBRES: Readonly<Record<string, string>> = {
  xlink: 'http://www.w3.org/1999/xlink',
  // Lo que dejan los editores (Inkscape y Sodipodi). Son metadatos del
  // programa: se reconocen para no rechazar un archivo valido, y se descartan.
  inkscape: 'http://www.inkscape.org/namespaces/inkscape',
  sodipodi: 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  cc: 'http://creativecommons.org/ns#',
  dc: 'http://purl.org/dc/elements/1.1/',
  // Inkscape declara el del propio SVG con prefijo, sin usarlo.
  svg: 'http://www.w3.org/2000/svg',
};

export const ESPACIO_DE_NOMBRES_DEL_SVG = 'http://www.w3.org/2000/svg';

const NOMBRE = /[A-Za-z_][A-Za-z0-9_.-]*(?::[A-Za-z_][A-Za-z0-9_.-]*)?/y;

const DECLARACION_XML =
  /<\?xml\s+version\s*=\s*(["'])1\.[01]\1(?:\s+encoding\s*=\s*(["'])[Uu][Tt][Ff]-8\2)?(?:\s+standalone\s*=\s*(["'])(?:yes|no)\3)?\s*\?>/y;

/**
 * El DOCTYPE que escriben Illustrator y otros editores antiguos, y solo ese:
 * uno de los oficiales de SVG 1.0 o 1.1, **sin subconjunto interno** (sin `[`),
 * que es donde se declaran las entidades. Se descarta. Cualquier otro DOCTYPE
 * es un rechazo.
 */
const DOCTYPE_DEL_SVG =
  /<!DOCTYPE\s+svg\s+PUBLIC\s+(["'])-\/\/W3C\/\/DTD SVG (?:1\.0|1\.1)\/\/EN\1\s+(["'])http:\/\/www\.w3\.org\/(?:Graphics\/SVG\/1\.[01]\/DTD\/svg1[01]|TR\/2001\/REC-SVG-20010904\/DTD\/svg10)\.dtd\2\s*>/y;

/** Una referencia valida: las cinco predefinidas o un numero. */
const REFERENCIA = /&(#x[0-9A-Fa-f]{1,6}|#[0-9]{1,7}|amp|lt|gt|quot|apos);/g;

const PREDEFINIDAS: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

// Caracteres de control que XML no permite, y los dos no-caracteres. Se
// rechazan antes de leer nada: un NUL a mitad de un nombre confunde a mas de un
// lector.
// eslint-disable-next-line no-control-regex
const CARACTERES_PROHIBIDOS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/;

function noEsUnSvg(): InvalidPetSvgError {
  return new InvalidPetSvgError('no-es-svg');
}

function peligroso(): InvalidPetSvgError {
  return new InvalidPetSvgError('peligroso');
}

function demasiadoComplejo(): InvalidPetSvgError {
  return new InvalidPetSvgError('demasiado-complejo');
}

/** Si un punto de codigo es un caracter que XML permite. */
function esCaracterDeXml(punto: number): boolean {
  return (
    punto === 0x9 ||
    punto === 0xa ||
    punto === 0xd ||
    (punto >= 0x20 && punto <= 0xd7ff) ||
    (punto >= 0xe000 && punto <= 0xfffd) ||
    (punto >= 0x10000 && punto <= 0x10ffff)
  );
}

/**
 * Resuelve las entidades de un valor o de un texto.
 *
 * Lo que quede con un `&` despues de quitar las referencias validas es una
 * entidad que no existe —o una propia, o un `&` suelto—, y se rechaza.
 */
export function resolverEntidades(valor: string): string {
  if (!valor.includes('&')) {
    return valor;
  }

  if (valor.replace(REFERENCIA, '').includes('&')) {
    throw noEsUnSvg();
  }

  return valor.replace(REFERENCIA, (_entera, referencia: string) => {
    const predefinida = PREDEFINIDAS[referencia];

    if (predefinida !== undefined) {
      return predefinida;
    }

    const punto =
      referencia.startsWith('#x') || referencia.startsWith('#X')
        ? Number.parseInt(referencia.slice(2), 16)
        : Number.parseInt(referencia.slice(1), 10);

    if (!esCaracterDeXml(punto)) {
      throw noEsUnSvg();
    }

    return String.fromCodePoint(punto);
  });
}

interface NodoEnConstruccion {
  readonly nombre: string;
  readonly atributos: (readonly [string, string])[];
  readonly hijos: NodoEnConstruccion[];
  conTexto: boolean;
}

/** Lee un nombre en la posicion dada, o `undefined` si ahi no empieza uno. */
function leerNombre(texto: string, desde: number): string | undefined {
  NOMBRE.lastIndex = desde;

  return NOMBRE.exec(texto)?.[0];
}

function esEspacio(caracter: string | undefined): boolean {
  return caracter === ' ' || caracter === '\t' || caracter === '\n' || caracter === '\r';
}

/**
 * Lee las declaraciones de espacios de nombres y comprueba que cada una sea
 * una de las conocidas y con su direccion exacta. Cualquier otra es un rechazo.
 */
function comprobarEspacios(
  atributos: readonly (readonly [string, string])[],
  esRaiz: boolean,
): void {
  for (const [nombre, valor] of atributos) {
    if (nombre === 'xmlns') {
      // El del SVG, y solo en la raiz: redeclararlo en otro sitio no aporta
      // nada y es la forma de cambiar lo que significa un nombre.
      if (!esRaiz) {
        throw peligroso();
      }

      if (valor !== ESPACIO_DE_NOMBRES_DEL_SVG) {
        throw noEsUnSvg();
      }
    } else if (nombre.startsWith('xmlns:')) {
      const prefijo = nombre.slice('xmlns:'.length);

      if (ESPACIOS_DE_NOMBRES[prefijo] !== valor) {
        throw peligroso();
      }
    }
  }
}

/**
 * Lee un SVG como arbol.
 *
 * @throws {InvalidPetSvgError} `no-es-svg` si no esta bien formado o no es un
 *   SVG, `peligroso` si trae algo de lo que este lector no admite nunca, y
 *   `demasiado-complejo` si pasa de los limites.
 */
export function leerElSvg(texto: string): NodoDeSvg {
  if (CARACTERES_PROHIBIDOS.test(texto)) {
    throw noEsUnSvg();
  }

  const n = texto.length;
  let posicion = texto.charCodeAt(0) === 0xfeff ? 1 : 0;

  // La declaracion de XML, que solo puede ir al principio y tal cual. Se
  // descarta. Cualquier otra cosa que empiece con `<?` es una instruccion de
  // procesamiento, y es un rechazo mas abajo.
  DECLARACION_XML.lastIndex = posicion;

  const declaracion = DECLARACION_XML.exec(texto);

  if (declaracion !== null) {
    posicion += declaracion[0].length;
  }

  const pila: NodoEnConstruccion[] = [];
  let raiz: NodoEnConstruccion | undefined;
  let elementos = 0;
  // Si ya se vio el DOCTYPE oficial: solo puede haber uno.
  let visto = false;

  while (posicion < n) {
    if (texto[posicion] !== '<') {
      // Texto. Se busca su final y se comprueba que las entidades sean validas.
      const final = texto.indexOf('<', posicion);
      const trozo = texto.slice(posicion, final < 0 ? n : final);
      const actual = pila[pila.length - 1];

      resolverEntidades(trozo);

      if (/\S/.test(trozo)) {
        if (actual === undefined) {
          // Texto antes o despues del unico elemento raiz.
          throw noEsUnSvg();
        }

        actual.conTexto = true;
      }

      posicion = final < 0 ? n : final;
      continue;
    }

    if (texto.startsWith('<!--', posicion)) {
      const final = texto.indexOf('-->', posicion + 4);

      // Un comentario sin cerrar, o con `--` dentro, no esta bien formado.
      if (final < 0 || texto.slice(posicion + 4, final).includes('--')) {
        throw noEsUnSvg();
      }

      posicion = final + 3;
      continue;
    }

    // El DOCTYPE oficial, una sola vez y antes del elemento raiz.
    if (texto.startsWith('<!DOCTYPE', posicion) && raiz === undefined && !visto) {
      DOCTYPE_DEL_SVG.lastIndex = posicion;

      const doctype = DOCTYPE_DEL_SVG.exec(texto);

      if (doctype !== null) {
        visto = true;
        posicion += doctype[0].length;
        continue;
      }
    }

    // Cualquier otro `<!DOCTYPE`, `<!ENTITY`, `<![CDATA[` y demas
    // declaraciones, y las instrucciones de procesamiento.
    if (texto.startsWith('<!', posicion) || texto.startsWith('<?', posicion)) {
      throw peligroso();
    }

    if (texto.startsWith('</', posicion)) {
      const nombre = leerNombre(texto, posicion + 2);
      const actual = pila[pila.length - 1];

      if (nombre === undefined || actual === undefined || nombre !== actual.nombre) {
        throw noEsUnSvg();
      }

      let cursor = posicion + 2 + nombre.length;

      while (esEspacio(texto[cursor])) {
        cursor += 1;
      }

      if (texto[cursor] !== '>') {
        throw noEsUnSvg();
      }

      pila.pop();
      posicion = cursor + 1;
      continue;
    }

    // Una etiqueta de apertura.
    const nombre = leerNombre(texto, posicion + 1);

    if (nombre === undefined) {
      throw noEsUnSvg();
    }

    // Un segundo elemento en la raiz, despues de haberla cerrado.
    if (pila.length === 0 && raiz !== undefined) {
      throw noEsUnSvg();
    }

    const nodo: NodoEnConstruccion = { nombre, atributos: [], hijos: [], conTexto: false };
    let cursor = posicion + 1 + nombre.length;
    let autocierre = false;

    for (;;) {
      const empiezaAqui = cursor;

      while (esEspacio(texto[cursor])) {
        cursor += 1;
      }

      if (cursor >= n) {
        throw noEsUnSvg();
      }

      if (texto[cursor] === '>') {
        cursor += 1;
        break;
      }

      if (texto.startsWith('/>', cursor)) {
        cursor += 2;
        autocierre = true;
        break;
      }

      // Entre un atributo y el siguiente tiene que haber un espacio.
      if (cursor === empiezaAqui) {
        throw noEsUnSvg();
      }

      const atributo = leerNombre(texto, cursor);

      if (atributo === undefined) {
        throw noEsUnSvg();
      }

      cursor += atributo.length;

      while (esEspacio(texto[cursor])) {
        cursor += 1;
      }

      if (texto[cursor] !== '=') {
        throw noEsUnSvg();
      }

      cursor += 1;

      while (esEspacio(texto[cursor])) {
        cursor += 1;
      }

      const comilla = texto[cursor];

      if (comilla !== '"' && comilla !== "'") {
        throw noEsUnSvg();
      }

      const cierre = texto.indexOf(comilla, cursor + 1);

      if (cierre < 0) {
        throw noEsUnSvg();
      }

      const crudo = texto.slice(cursor + 1, cierre);

      // XML no permite un `<` dentro de un valor.
      if (crudo.includes('<')) {
        throw noEsUnSvg();
      }

      if (nodo.atributos.some(([existente]) => existente === atributo)) {
        throw noEsUnSvg();
      }

      if (nodo.atributos.length >= ATRIBUTOS_MAXIMOS) {
        throw demasiadoComplejo();
      }

      nodo.atributos.push([atributo, resolverEntidades(crudo)]);
      cursor = cierre + 1;
    }

    elementos += 1;

    if (elementos > ELEMENTOS_MAXIMOS) {
      throw demasiadoComplejo();
    }

    comprobarEspacios(nodo.atributos, pila.length === 0);

    const padre = pila[pila.length - 1];

    if (padre === undefined) {
      raiz = nodo;
    } else {
      padre.hijos.push(nodo);
    }

    if (!autocierre) {
      pila.push(nodo);

      if (pila.length > PROFUNDIDAD_MAXIMA) {
        throw demasiadoComplejo();
      }
    }

    posicion = cursor;
  }

  // Un elemento que se abrio y no se cerro.
  if (pila.length > 0 || raiz === undefined) {
    throw noEsUnSvg();
  }

  return congelar(raiz);
}

function congelar(nodo: NodoEnConstruccion): NodoDeSvg {
  return {
    nombre: nodo.nombre,
    atributos: nodo.atributos,
    hijos: nodo.hijos.map(congelar),
    conTexto: nodo.conTexto,
  };
}
