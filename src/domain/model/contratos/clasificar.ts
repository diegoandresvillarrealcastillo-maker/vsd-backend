import {
  type Validador,
  entero,
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
 * M4, `clasificar`: elegir o llevar a una cesta. Sirve a tres mecanicas:
 *
 * - `intruso`: «La palabra que sobra» (COG-02). Cuatro palabras, una no comparte lo que comparten las demas.
 *   La razon se muestra **despues**, sin senalar el fallo.
 * - `cestas`: «Ordena por categoria» (COG-03), con respuesta correcta, y «Lo que si controlo» (EMO-04), sin ella.
 *   Los elementos aparecen de uno en uno y se llevan a una cesta. La pantalla ofrece siempre la alternativa de
 *   **tocar sin arrastrar** (R10).
 *
 * Los elementos de un banco viajan **dentro de la sesion** (ADR 0031): no hay un banco que consultar ni un
 * cursor por persona. Que un elemento no salga mas de dos veces al ano lo comprueba la prueba del contenido.
 */

// ---------------------------------------------------------------------------
// intruso
// ---------------------------------------------------------------------------

const RONDA_DE_INTRUSO = objeto(
  {
    palabras: requerido(lista(4, 4, texto(30))),
    intruso: requerido(entero(0, 3)),
    razon: requerido(texto(140)),
  },
  (valor) => repetido(valor['palabras'], 'palabras', null),
);

const INTRUSO = objeto(
  {
    modo: requerido(unoDe(['intruso'])),
    rondas: requerido(lista(3, 10, RONDA_DE_INTRUSO)),
    puntosMaximos: requerido(entero(1, 100)),
  },
  (valor) =>
    valor['puntosMaximos'] === (valor['rondas'] as unknown[]).length
      ? undefined
      : `puntosMaximos (${String(valor['puntosMaximos'])}) tiene que ser las rondas (${(valor['rondas'] as unknown[]).length}): un acierto, un punto`,
);

// ---------------------------------------------------------------------------
// cestas
// ---------------------------------------------------------------------------

const CESTA = objeto({ clave: requerido(texto(20)), nombre: requerido(texto(40)) });

/** La cesta o las cestas donde el elemento tiene su sitio. Varias si es ambiguo y la ficha acepta ambas. */
const SITIO: Validador = (valor, ruta) =>
  Array.isArray(valor) ? lista(2, 3, texto(20))(valor, ruta) : texto(20)(valor, ruta);

const ELEMENTO_PARA_CLASIFICAR = objeto({
  clave: requerido(texto(20)),
  nombre: requerido(texto(60)),
  cesta: opcional(SITIO),
});

const CESTAS = objeto(
  {
    modo: requerido(unoDe(['cestas'])),
    indicacion: requerido(texto(200)),
    cestas: requerido(lista(2, 3, CESTA)),
    elementos: requerido(lista(4, 16, ELEMENTO_PARA_CLASIFICAR)),
    puntosMaximos: opcional(entero(1, 100)),
    linea: opcional(
      objeto({ invitacion: requerido(texto(160)), largoMaximo: requerido(entero(50, 500)) }),
    ),
  },
  (valor) => {
    const problema =
      repetido(valor['cestas'], 'cestas', 'clave') ??
      repetido(valor['cestas'], 'cestas', 'nombre') ??
      repetido(valor['elementos'], 'elementos', 'clave') ??
      repetido(valor['elementos'], 'elementos', 'nombre');

    if (problema !== undefined) {
      return problema;
    }

    const cestas = new Set((valor['cestas'] as { clave: string }[]).map((c) => c.clave));
    const elementos = valor['elementos'] as { cesta?: string | string[] }[];
    const conRespuesta = elementos.filter((e) => e.cesta !== undefined).length;

    // O todos tienen su sitio (se puntua) o ninguno (es un ejercicio de reflexion, que no se puntua).
    if (conRespuesta !== 0 && conRespuesta !== elementos.length) {
      return 'elementos mezcla los que tienen cesta y los que no: o todos la tienen, o ninguno';
    }

    for (const [posicion, elemento] of elementos.entries()) {
      const sitios = elemento.cesta === undefined ? [] : [elemento.cesta].flat();

      for (const sitio of sitios) {
        if (!cestas.has(sitio)) {
          return `${nombreDe(`elementos[${posicion}]`, 'cesta')} es "${sitio}", que no es una de las cestas`;
        }
      }

      if (Array.isArray(elemento.cesta) && new Set(elemento.cesta).size !== elemento.cesta.length) {
        return `${nombreDe(`elementos[${posicion}]`, 'cesta')} repite una cesta`;
      }
    }

    const puntua = conRespuesta === elementos.length;

    if (puntua && valor['puntosMaximos'] !== elementos.length) {
      return `puntosMaximos tiene que ser los elementos (${elementos.length}) cuando cada uno tiene su cesta: un acierto, un punto`;
    }

    if (!puntua && Object.hasOwn(valor, 'puntosMaximos')) {
      return 'puntosMaximos no va cuando los elementos no tienen cesta: no hay respuesta correcta que puntuar';
    }

    return undefined;
  },
);

export const CLASIFICAR: Validador = porModo({ intruso: INTRUSO, cestas: CESTAS });
