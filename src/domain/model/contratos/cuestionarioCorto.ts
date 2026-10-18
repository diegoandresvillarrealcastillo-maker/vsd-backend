import {
  type Validador,
  booleano,
  entero,
  esObjeto,
  lista,
  nombreDe,
  objeto,
  opcional,
  porModo,
  repetido,
  requerido,
  texto,
  unoDe,
} from './piezas.js';

/**
 * M8, `cuestionario_corto`: preguntas cerradas, una a la vez.
 *
 * Sin `modo` es el cuestionario de siempre, **con puntaje** («La carga de tu semana», «Como te sientes
 * hoy»). Los cuatro modos nuevos (SCRUM-220) son los de las mecanicas que **no puntuan** (`sin_puntaje`):
 *
 * - `tarjeta`: una practica del dia y tres respuestas que cuentan igual (BIE-03, BIE-04, BIE-05).
 * - `lista`: unos gestos que se marcan los que se hicieron o se haran (BIE-07).
 * - `preguntas`: preguntas con respuesta por tipo o con una hora (BIE-08, EMO-08).
 * - `rueda`: la rueda de emociones, de lo mas amplio a lo mas fino (EMO-01).
 *
 * Ninguno lleva `valor` en sus opciones: lo que se responde no suma ni se interpreta (R7).
 */

// ---------------------------------------------------------------------------
// El cuestionario con puntaje (sin `modo`)
// ---------------------------------------------------------------------------

/**
 * La `indicacion` es la frase que enmarca el cuestionario («Piensa en los ultimos siete dias. No hay
 * respuestas buenas ni malas»).
 *
 * El maximo del puntaje **no se guarda**: es `preguntas x valor mas alto`, asi que no puede quedar
 * desincronizado del `puntaje_maximo` de la actividad (el servidor rechaza con 400 un puntaje que
 * lo pase).
 */
const CUESTIONARIO_CON_PUNTAJE = objeto(
  {
    indicacion: requerido(texto(200)),
    preguntas: requerido(
      lista(1, 10, objeto({ clave: requerido(texto(40)), texto: requerido(texto(200)) })),
    ),
    opciones: requerido(
      lista(2, 7, objeto({ valor: requerido(entero(0, 10)), texto: requerido(texto(40)) })),
    ),
  },
  (valor) =>
    repetido(valor['preguntas'], 'preguntas', 'clave') ??
    repetido(valor['opciones'], 'opciones', 'valor') ??
    repetido(valor['opciones'], 'opciones', 'texto'),
);

// ---------------------------------------------------------------------------
// Sin puntaje
// ---------------------------------------------------------------------------

const OPCION_SIN_VALOR = objeto({ clave: requerido(texto(20)), texto: requerido(texto(60)) });

/** Un texto libre opcional al final, con la misma deteccion de riesgo que cualquier otro (R8). */
const LINEA_OPCIONAL = objeto({
  invitacion: requerido(texto(160)),
  largoMaximo: requerido(entero(50, 500)),
});

const TARJETA = objeto(
  {
    modo: requerido(unoDe(['tarjeta'])),
    indicacion: opcional(texto(200)),
    titulo: requerido(texto(80)),
    texto: requerido(texto(300)),
    porQue: opcional(texto(300)),
    opciones: requerido(lista(2, 4, OPCION_SIN_VALOR)),
    nota: opcional(texto(200)),
    cierre: opcional(texto(160)),
  },
  (valor) =>
    repetido(valor['opciones'], 'opciones', 'clave') ??
    repetido(valor['opciones'], 'opciones', 'texto'),
);

const LISTA = objeto(
  {
    modo: requerido(unoDe(['lista'])),
    indicacion: requerido(texto(200)),
    items: requerido(
      lista(3, 6, objeto({ clave: requerido(texto(20)), texto: requerido(texto(100)) })),
    ),
    nota: opcional(texto(200)),
    cierre: opcional(texto(160)),
  },
  (valor) =>
    repetido(valor['items'], 'items', 'clave') ?? repetido(valor['items'], 'items', 'texto'),
);

const TIPOS_DE_PREGUNTA = ['opcion', 'varias', 'hora'];

/**
 * `opcion` elige una, `varias` elige las que quiera (o ninguna) y `hora` pide una hora con el campo
 * nativo del dispositivo. Una pregunta de `hora` no trae opciones; las otras dos las necesitan.
 */
const PREGUNTA_SIN_PUNTAJE = objeto(
  {
    clave: requerido(texto(20)),
    texto: requerido(texto(160)),
    tipo: requerido(unoDe(TIPOS_DE_PREGUNTA)),
    opciones: opcional(lista(2, 8, OPCION_SIN_VALOR)),
    pista: opcional(texto(100)),
  },
  (valor, ruta) => {
    const tieneOpciones = Object.hasOwn(valor, 'opciones');

    if (valor['tipo'] === 'hora') {
      return tieneOpciones
        ? `${nombreDe(ruta, 'opciones')} no va en una pregunta de hora: se responde con el campo de hora`
        : undefined;
    }

    if (!tieneOpciones) {
      return `${nombreDe(ruta, 'opciones')} es obligatorio en una pregunta de tipo ${String(valor['tipo'])}`;
    }

    return (
      repetido(valor['opciones'], nombreDe(ruta, 'opciones'), 'clave') ??
      repetido(valor['opciones'], nombreDe(ruta, 'opciones'), 'texto')
    );
  },
);

const PREGUNTAS = objeto(
  {
    modo: requerido(unoDe(['preguntas'])),
    indicacion: requerido(texto(200)),
    preguntas: requerido(lista(1, 6, PREGUNTA_SIN_PUNTAJE)),
    /** Ofrece ir a donde se activa el aviso de la noche. La persona decide; nunca se activa solo. */
    enlaceAlAviso: opcional(booleano),
    nota: opcional(texto(200)),
    cierre: opcional(texto(160)),
    /** Una frase siempre a la vista y, con ella, el acceso a las lineas de atencion (EMO-08). */
    avisoSiempre: opcional(texto(200)),
    conLineasDeAyuda: opcional(booleano),
  },
  (valor) => {
    if (valor['conLineasDeAyuda'] === true && !Object.hasOwn(valor, 'avisoSiempre')) {
      return 'avisoSiempre es obligatorio cuando conLineasDeAyuda es verdadero: el acceso a las líneas va con su frase';
    }

    return repetido(valor['preguntas'], 'preguntas', 'clave');
  },
);

// ---------------------------------------------------------------------------
// La rueda de emociones
// ---------------------------------------------------------------------------

const MAXIMO_DE_NIVELES_DE_LA_RUEDA = 3;

/**
 * Un nodo de la rueda: un circulo grande, uno mas fino, o una emocion. Las hojas (las emociones) llevan su
 * `definicion` de una linea: «Alivio: sentir que algo pesado ya paso». Ningun nivel pasa de tres.
 */
function nodoDeLaRueda(profundidad: number, claves: Set<string>): Validador {
  return (valor, ruta) => {
    if (!esObjeto(valor)) {
      return `${ruta} debe ser un objeto`;
    }

    const permitidas = ['clave', 'nombre', 'definicion', 'hijos'];

    for (const clave of Object.keys(valor)) {
      if (!permitidas.includes(clave)) {
        return `${nombreDe(ruta, clave)} no es un parámetro de este motor`;
      }
    }

    const problema =
      texto(20)(valor['clave'], nombreDe(ruta, 'clave')) ??
      texto(40)(valor['nombre'], nombreDe(ruta, 'nombre')) ??
      (Object.hasOwn(valor, 'definicion')
        ? texto(160)(valor['definicion'], nombreDe(ruta, 'definicion'))
        : undefined);

    if (problema !== undefined) {
      return problema;
    }

    const clave = (valor['clave'] as string).trim().toLowerCase();

    if (claves.has(clave)) {
      return `${nombreDe(ruta, 'clave')} repite "${String(valor['clave']).trim()}"`;
    }

    claves.add(clave);

    if (!Object.hasOwn(valor, 'hijos')) {
      return Object.hasOwn(valor, 'definicion')
        ? undefined
        : `${nombreDe(ruta, 'definicion')} es obligatorio en una emoción: es la que se lee al elegirla`;
    }

    if (profundidad >= MAXIMO_DE_NIVELES_DE_LA_RUEDA) {
      return `${nombreDe(ruta, 'hijos')} pasa de los ${MAXIMO_DE_NIVELES_DE_LA_RUEDA} niveles de la rueda`;
    }

    return lista(
      2,
      8,
      nodoDeLaRueda(profundidad + 1, claves),
    )(valor['hijos'], nombreDe(ruta, 'hijos'));
  };
}

const RUEDA = objeto({
  modo: requerido(unoDe(['rueda'])),
  indicacion: requerido(texto(200)),
  puerta: requerido(objeto({ titulo: requerido(texto(80)), texto: requerido(texto(300)) })),
  rueda: requerido((valor, ruta) => {
    // Las claves son unicas en toda la rueda, no solo entre hermanas.
    const claves = new Set<string>();

    return lista(2, 8, nodoDeLaRueda(1, claves))(valor, ruta);
  }),
  linea: opcional(LINEA_OPCIONAL),
  nota: opcional(texto(200)),
  cierre: opcional(texto(160)),
});

// ---------------------------------------------------------------------------
// La puerta del motor
// ---------------------------------------------------------------------------

export const CUESTIONARIO_CORTO: Validador = porModo(
  { tarjeta: TARJETA, lista: LISTA, preguntas: PREGUNTAS, rueda: RUEDA },
  CUESTIONARIO_CON_PUNTAJE,
);

/** Los modos sin puntaje, para las pruebas del contenido (no puntuan: no llevan maximo). */
export const MODOS_DEL_CUESTIONARIO_SIN_PUNTAJE: readonly string[] = [
  'tarjeta',
  'lista',
  'preguntas',
  'rueda',
];
