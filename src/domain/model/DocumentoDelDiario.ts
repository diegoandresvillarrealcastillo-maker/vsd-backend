import { InvalidJournalEntryError } from './DomainError.js';

/**
 * Lo que alguien escribe en el diario, tal como lo produce el editor
 * (SCRUM-95).
 *
 * ## Por que un documento y no HTML
 *
 * El editor (SCRUM-96) trabaja con un arbol de nodos: un documento con
 * parrafos, los parrafos con texto, el texto con marcas como negrita. Se
 * guarda ese arbol y no el HTML que se pinta con el.
 *
 * Guardar HTML obligaria a limpiarlo en cada lectura, y un fallo de esa
 * limpieza es un script ajeno ejecutandose en el diario de alguien. Un arbol
 * de nodos no se ejecuta: quien lo pinta decide que hace con cada tipo, y un
 * tipo que no conoce no lo pinta.
 *
 * ## Que se comprueba
 *
 * La **forma** del arbol, no su vocabulario. Cada nodo tiene un `type` con
 * nombre de identificador y solo las claves que usa el editor. No se cierra la
 * lista de tipos: eso lo decide el editor, y una lista aqui obligaria a tocar
 * el servidor cada vez que se le anada una extension.
 */

/** Un nodo del documento. Es la forma JSON de ProseMirror, que usa TipTap. */
export interface NodoDelDocumento {
  readonly type: string;
  readonly attrs?: Readonly<Record<string, unknown>>;
  readonly content?: readonly NodoDelDocumento[];
  readonly marks?: readonly MarcaDelTexto[];
  readonly text?: string;
}

/** Una marca sobre un trozo de texto: negrita, cursiva, enlace. */
export interface MarcaDelTexto {
  readonly type: string;
  readonly attrs?: Readonly<Record<string, unknown>>;
}

/**
 * Un diagrama dibujado en la anotacion.
 *
 * `datos` es la escena del editor de diagramas tal cual. No se interpreta: se
 * guarda y se devuelve. Lo unico que el servidor lee de ella es su texto, para
 * la deteccion de riesgo.
 */
export interface Adjunto {
  readonly id: string;
  readonly tipo: 'diagrama';
  readonly datos: Readonly<Record<string, unknown>>;
}

/** Caracteres del documento serializado. Una anotacion larga cabe de sobra. */
export const TAMANO_MAXIMO_DEL_DOCUMENTO = 200_000;

/** Los diagramas pesan mucho mas que el texto, y por eso van aparte. */
export const MAXIMO_DE_ADJUNTOS = 10;
export const TAMANO_MAXIMO_DE_LOS_ADJUNTOS = 700_000;

/** Ningun documento real del editor anida tanto; uno malicioso si podria. */
const PROFUNDIDAD_MAXIMA = 40;

const NOMBRE_DE_TIPO = /^[A-Za-z][A-Za-z0-9_]{0,39}$/;
const CLAVES_DE_NODO: ReadonlySet<string> = new Set(['type', 'attrs', 'content', 'marks', 'text']);
const CLAVES_DE_MARCA: ReadonlySet<string> = new Set(['type', 'attrs']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Los bloques cuyo texto se lee como una linea aparte. */
const EN_LINEA: ReadonlySet<string> = new Set(['text', 'hardBreak']);

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function invalido(motivo: string): never {
  throw new InvalidJournalEntryError(motivo);
}

function comprobarAtributos(valor: unknown): void {
  if (valor !== undefined && !esObjeto(valor)) {
    invalido('los atributos de un nodo tienen que ser un objeto');
  }
}

function comprobarMarca(valor: unknown): void {
  if (
    !esObjeto(valor) ||
    typeof valor['type'] !== 'string' ||
    !NOMBRE_DE_TIPO.test(valor['type'])
  ) {
    invalido('hay una marca de texto sin un tipo válido');
  }

  if (Object.keys(valor).some((clave) => !CLAVES_DE_MARCA.has(clave))) {
    invalido('una marca de texto trae claves que el editor no usa');
  }

  comprobarAtributos(valor['attrs']);
}

function comprobarNodo(valor: unknown, profundidad: number): void {
  if (profundidad > PROFUNDIDAD_MAXIMA) {
    invalido('el documento anida demasiados niveles');
  }

  if (
    !esObjeto(valor) ||
    typeof valor['type'] !== 'string' ||
    !NOMBRE_DE_TIPO.test(valor['type'])
  ) {
    invalido('hay un nodo sin un tipo válido');
  }

  if (Object.keys(valor).some((clave) => !CLAVES_DE_NODO.has(clave))) {
    invalido('un nodo trae claves que el editor no usa');
  }

  const { type, text, content, marks } = valor;

  // Solo los nodos de texto llevan texto, y siempre como cadena.
  if (type === 'text' ? typeof text !== 'string' : text !== undefined) {
    invalido('el texto solo puede ir en los nodos de texto');
  }

  comprobarAtributos(valor['attrs']);

  if (marks !== undefined) {
    if (!Array.isArray(marks)) {
      invalido('las marcas de un nodo tienen que ser una lista');
    }

    (marks as readonly unknown[]).forEach(comprobarMarca);
  }

  if (content !== undefined) {
    if (!Array.isArray(content)) {
      invalido('el contenido de un nodo tiene que ser una lista');
    }

    for (const hijo of content as readonly unknown[]) {
      comprobarNodo(hijo, profundidad + 1);
    }
  }
}

/** Copia profunda e inmutable: nadie fuera puede cambiar lo que se guardo. */
function congelado<T>(valor: T): T {
  if (typeof valor === 'object' && valor !== null) {
    for (const hijo of Object.values(valor)) {
      congelado(hijo);
    }

    Object.freeze(valor);
  }

  return valor;
}

/** El texto de un nodo, con cada bloque en su linea. */
function textoDe(nodo: NodoDelDocumento): string {
  if (nodo.type === 'text') {
    return nodo.text ?? '';
  }

  if (nodo.type === 'hardBreak') {
    return '\n';
  }

  const hijos = nodo.content ?? [];
  // El texto de una linea se une sin separador: el editor parte una frase en
  // varios nodos cuando cambia una marca, y "quiero **morir**" tiene que
  // leerse entera para que la deteccion de riesgo la vea.
  const enLinea = hijos.every((hijo) => EN_LINEA.has(hijo.type));

  return hijos.map(textoDe).join(enLinea ? '' : '\n');
}

export class DocumentoDelDiario {
  private constructor(readonly raiz: NodoDelDocumento) {}

  /**
   * Un documento recibido de fuera. Comprueba su forma y su tamano.
   */
  static desde(valor: unknown): DocumentoDelDiario {
    if (!esObjeto(valor) || valor['type'] !== 'doc') {
      invalido('el contenido tiene que ser un documento del editor, con "type": "doc"');
    }

    comprobarNodo(valor, 0);

    if (JSON.stringify(valor).length > TAMANO_MAXIMO_DEL_DOCUMENTO) {
      invalido('el contenido supera el tamaño máximo de una anotación');
    }

    return new DocumentoDelDiario(congelado(structuredClone(valor) as unknown as NodoDelDocumento));
  }

  /**
   * Un documento que ya estaba guardado.
   *
   * No vuelve a aplicar los limites: si algun dia cambian, lo escrito antes no
   * puede dejar de leerse. Solo exige que siga siendo un documento.
   */
  static guardado(valor: unknown): DocumentoDelDiario {
    if (!esObjeto(valor) || valor['type'] !== 'doc') {
      throw new InvalidJournalEntryError('lo guardado no es un documento del editor');
    }

    return new DocumentoDelDiario(congelado(valor as unknown as NodoDelDocumento));
  }

  /**
   * Un documento a partir de texto sin formato: un parrafo por linea.
   *
   * Es lo que hace legibles las anotaciones guardadas como `texto_plano`
   * antes de que existiera el editor.
   */
  static desdeTextoPlano(texto: string): DocumentoDelDiario {
    const parrafos = texto
      .split(/\r?\n/u)
      .map((linea) =>
        linea === ''
          ? { type: 'paragraph' }
          : { type: 'paragraph', content: [{ type: 'text', text: linea }] },
      );

    return new DocumentoDelDiario(congelado({ type: 'doc', content: parrafos }));
  }

  /** Todo el texto del documento, un bloque por linea. */
  textoPlano(): string {
    return textoDe(this.raiz);
  }

  /** Si no hay nada escrito, solo bloques vacios. */
  estaVacio(): boolean {
    return this.textoPlano().trim() === '' && !this.tieneNodosSinTexto(this.raiz);
  }

  /** Como se guarda en la base: JSON, nunca HTML. */
  serializado(): string {
    return JSON.stringify(this.raiz);
  }

  /**
   * Si hay algo que no es texto, como un diagrama incrustado o una linea
   * horizontal: una anotacion que solo tiene eso no esta vacia.
   */
  private tieneNodosSinTexto(nodo: NodoDelDocumento): boolean {
    const estructura = ['doc', 'paragraph', 'text', 'hardBreak'];

    return (
      !estructura.includes(nodo.type) ||
      (nodo.content ?? []).some((hijo) => this.tieneNodosSinTexto(hijo))
    );
  }
}

/**
 * Los diagramas de una anotacion, recibidos de fuera.
 */
export function adjuntosDesde(valor: unknown): readonly Adjunto[] {
  if (valor === undefined || valor === null) {
    return [];
  }

  if (!Array.isArray(valor)) {
    invalido('los adjuntos tienen que ser una lista');
  }

  const lista = valor as readonly unknown[];

  if (lista.length > MAXIMO_DE_ADJUNTOS) {
    invalido(`una anotación admite como mucho ${MAXIMO_DE_ADJUNTOS} diagramas`);
  }

  const ids = new Set<string>();

  for (const adjunto of lista) {
    if (
      !esObjeto(adjunto) ||
      typeof adjunto['id'] !== 'string' ||
      !UUID.test(adjunto['id']) ||
      adjunto['tipo'] !== 'diagrama' ||
      !esObjeto(adjunto['datos']) ||
      Object.keys(adjunto).length !== 3
    ) {
      invalido('cada adjunto tiene que ser un diagrama con su id, su tipo y sus datos');
    }

    if (ids.has(adjunto['id'])) {
      invalido('hay dos adjuntos con el mismo id');
    }

    ids.add(adjunto['id']);
  }

  if (JSON.stringify(lista).length > TAMANO_MAXIMO_DE_LOS_ADJUNTOS) {
    invalido('los diagramas superan el tamaño máximo de una anotación');
  }

  return congelado(structuredClone(lista) as unknown as readonly Adjunto[]);
}

/** Los diagramas ya guardados. Como con el documento, sin volver a limitar. */
export function adjuntosGuardados(valor: unknown): readonly Adjunto[] {
  return Array.isArray(valor) ? congelado(valor as readonly Adjunto[]) : [];
}
