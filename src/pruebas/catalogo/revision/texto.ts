import type { Parametros } from '../tipos.ts';

/**
 * El texto de una sesion, tal como lo lee quien la revisa (SCRUM-228).
 *
 * Quien revisa el contenido (psicologia, fisioterapia, redaccion) no lee JSON: lee **lo que va a leer la persona**,
 * en el orden en que lo va a leer. Esto convierte los parametros de una sesion en un arbol de lineas con su
 * etiqueta («Invitación», «Paso 2», «Al terminar»).
 *
 * ## Lo que garantiza
 *
 * **Todo texto que la persona va a leer sale aqui.** Una prueba recorre cada sesion pendiente del catalogo y
 * comprueba que cada cadena de sus parametros aparece en lo que se muestra, salvo las claves tecnicas
 * (`CLAVES_TECNICAS`: identificadores, nombres de dibujos, coordenadas). Una clave nueva que no conozca se muestra
 * con su propio nombre en lugar de callarse: un texto que alguien no vio no esta revisado.
 *
 * No importa nada del dominio, igual que el resto de esta carpeta: lo lee `node` directamente, sin compilar.
 */

export interface LineaDeRevision {
  readonly etiqueta: string;
  /** El texto, si es una hoja. */
  readonly texto?: string;
  readonly hijos?: readonly LineaDeRevision[];
}

/** Lo que nunca lee la persona: identificadores, nombres de dibujos, coordenadas y modos del motor. */
export const CLAVES_TECNICAS: ReadonlySet<string> = new Set([
  'modo',
  'clave',
  'pictograma',
  'avance',
  'cesta',
  'fila',
  'columna',
  'x',
  'y',
  'etiqueta',
  'puntosMaximos',
  'correcta',
  'intruso',
  'faltan',
]);

const ETIQUETAS: Readonly<Record<string, string>> = {
  indicacion: 'Indicación',
  invitacion: 'Invitación',
  titulo: 'Título',
  texto: 'Texto',
  porQue: 'Por qué',
  nota: 'Nota',
  cierre: 'Al terminar',
  intro: 'Introducción',
  advertenciaInicial: 'Advertencia antes de empezar',
  avisoSiempre: 'Frase siempre a la vista',
  nombre: 'Nombre',
  descripcion: 'Descripción',
  definicion: 'Definición',
  pista: 'Pista',
  contexto: 'Contexto',
  textoNinguna: 'Botón de «hoy no»',
  ambientacion: 'Fondo',
  razon: 'Razón',
  tipo: 'Tipo de respuesta',
  invitacionDeLaLinea: 'Invitación',
};

const NUMEROS: Readonly<Record<string, readonly [etiqueta: string, unidad: string]>> = {
  duracionSegundos: ['Duración', 's'],
  inhalaSegundos: ['Inhala', 's'],
  exhalaSegundos: ['Exhala', 's'],
  pausaSegundos: ['Pausa', 's'],
  segundos: ['Dura', 's'],
  campos: ['Campos de texto', ''],
  minimo: ['Mínimo a llenar', ''],
  largoMaximo: ['Largo máximo', 'caracteres'],
};

const BANDERAS: Readonly<Record<string, string>> = {
  conLineasDeAyuda: 'Ofrece las líneas de atención',
  guardarParaManana: 'Se guarda en el diario',
  permiteNingunaHoy: 'Ofrece «hoy no»',
  enlaceAlAviso: 'Ofrece ir al aviso de la noche',
  haptico: 'Vibra suave al cambiar de paso',
};

/** Una lista o un objeto con nombre: su etiqueta y como se llama cada uno de sus elementos. */
const GRUPOS: Readonly<Record<string, readonly [etiqueta: string, singular: string]>> = {
  pasos: ['Pasos', 'Paso'],
  elecciones: ['Elecciones', 'Elección'],
  opciones: ['Opciones', 'Opción'],
  items: ['Gestos', 'Gesto'],
  preguntas: ['Preguntas', 'Pregunta'],
  rueda: ['Círculos grandes', 'Círculo'],
  hijos: ['Más fino', 'Opción'],
  cestas: ['Cestas', 'Cesta'],
  elementos: ['Tarjetas', 'Tarjeta'],
  puerta: ['Puerta de entrada', 'Puerta'],
  linea: ['Línea libre', 'Línea'],
  patron: ['Patrón de respiración', 'Patrón'],
  frases: ['Frases', 'Frase'],
  ideas: ['Ideas para empezar', 'Idea'],
  etiquetas: ['Lo que pide cada campo', 'Campo'],
};

const esObjeto = (valor: unknown): valor is Readonly<Record<string, unknown>> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

function lineasDeUnObjeto(objeto: Readonly<Record<string, unknown>>): LineaDeRevision[] {
  const lineas: LineaDeRevision[] = [];

  for (const [clave, valor] of Object.entries(objeto)) {
    if (CLAVES_TECNICAS.has(clave)) {
      continue;
    }

    const linea = lineaDe(clave, valor);

    if (linea !== null) {
      lineas.push(linea);
    }
  }

  return lineas;
}

/** Un elemento de una lista: «Paso 2», con lo que lleva dentro; si lleva un solo texto, queda en una linea. */
function lineaDeUnElemento(singular: string, posicion: number, valor: unknown): LineaDeRevision {
  const etiqueta = `${singular} ${String(posicion + 1)}`;

  if (typeof valor === 'string') {
    return { etiqueta, texto: valor };
  }

  if (!esObjeto(valor)) {
    return { etiqueta, texto: String(valor) };
  }

  // Un nodo con nombre (la rueda, las cestas): el nombre va en la etiqueta y no se repite dentro.
  const nombre = valor['nombre'];
  const conNombre = typeof nombre === 'string';
  const hijos = lineasDeUnObjeto(
    conNombre ? Object.fromEntries(Object.entries(valor).filter(([k]) => k !== 'nombre')) : valor,
  );
  const etiquetaFinal = conNombre ? `${etiqueta}: ${nombre}` : etiqueta;
  const [unico] = hijos;

  // Una sola linea de texto dentro (una opcion con su texto): se sube a la etiqueta.
  if (hijos.length === 1 && unico?.texto !== undefined && unico.hijos === undefined && !conNombre) {
    return { etiqueta, texto: unico.texto };
  }

  return hijos.length === 0 ? { etiqueta: etiquetaFinal } : { etiqueta: etiquetaFinal, hijos };
}

function lineaDe(clave: string, valor: unknown): LineaDeRevision | null {
  if (typeof valor === 'string') {
    return { etiqueta: ETIQUETAS[clave] ?? clave, texto: valor };
  }

  if (typeof valor === 'number') {
    const numero = NUMEROS[clave];

    return numero === undefined
      ? { etiqueta: ETIQUETAS[clave] ?? clave, texto: String(valor) }
      : {
          etiqueta: numero[0],
          texto: numero[1] === '' ? String(valor) : `${String(valor)} ${numero[1]}`,
        };
  }

  if (typeof valor === 'boolean') {
    // Solo se muestra lo que la sesion enciende: un «no» no cambia lo que lee la persona.
    return valor ? { etiqueta: BANDERAS[clave] ?? clave } : null;
  }

  if (Array.isArray(valor)) {
    if (clave === 'puntos') {
      return { etiqueta: 'Puntos', texto: `${String(valor.length)} puntos para unir en orden` };
    }

    const [etiqueta, singular] = GRUPOS[clave] ?? [ETIQUETAS[clave] ?? clave, 'Elemento'];

    return {
      etiqueta,
      hijos: valor.map((elemento: unknown, posicion) =>
        lineaDeUnElemento(singular, posicion, elemento),
      ),
    };
  }

  if (esObjeto(valor)) {
    const [etiqueta] = GRUPOS[clave] ?? [ETIQUETAS[clave] ?? clave];
    const hijos = lineasDeUnObjeto(valor);

    return hijos.length === 0 ? null : { etiqueta, hijos };
  }

  return null;
}

/** Lo que lee la persona en esta sesion, en el orden de sus parametros. */
export function lineasParaRevisar(parametros: Parametros): readonly LineaDeRevision[] {
  return lineasDeUnObjeto(parametros);
}

/** Todo el texto de un arbol, hoja por hoja: sirve para comprobar que no falta nada. */
export function textosDelArbol(lineas: readonly LineaDeRevision[]): string[] {
  return lineas.flatMap((linea) => [
    ...(linea.texto === undefined ? [] : [linea.texto]),
    ...(linea.hijos === undefined ? [] : textosDelArbol(linea.hijos)),
    // El nombre que sube a la etiqueta («Círculo 1: Alegría») tambien es texto de la persona.
    linea.etiqueta,
  ]);
}

/** Las cadenas de unos parametros que la persona va a leer (todas, menos las claves tecnicas). */
export function cadenasQueLeeLaPersona(valor: unknown, clave = ''): string[] {
  if (CLAVES_TECNICAS.has(clave)) {
    return [];
  }

  if (typeof valor === 'string') {
    return [valor];
  }

  if (Array.isArray(valor)) {
    return valor.flatMap((elemento: unknown) => cadenasQueLeeLaPersona(elemento, clave));
  }

  if (esObjeto(valor)) {
    return Object.entries(valor).flatMap(([k, v]) => cadenasQueLeeLaPersona(v, k));
  }

  return [];
}
