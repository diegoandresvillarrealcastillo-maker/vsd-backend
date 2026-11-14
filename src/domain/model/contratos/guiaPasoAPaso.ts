import {
  type Validador,
  booleano,
  entero,
  lista,
  objeto,
  opcional,
  porModo,
  repetido,
  requerido,
  texto,
  unoDe,
} from './piezas.js';

/**
 * M7, `guia_paso_a_paso`: pasos con una animacion suave y texto. El mas reutilizado: sirve a nueve mecanicas.
 *
 * - **sin `modo`, o `respiracion`**: la respiracion acompasada de siempre (BIE-01). Un circulo que se abre
 *   y se cierra al ritmo de un patron.
 * - `pasos`: una guia de pasos de texto, con o sin pictograma, que avanza con un toque o sola. Es el
 *   estiramiento (BIE-02), el escaneo corporal (BIE-06), el respiro del dia (BIE-09), el ancla 5-4-3-2-1
 *   (EMO-03) y el lugar tranquilo (EMO-07).
 *
 * ## Respiracion
 *
 * Barandas de la ficha, hechas rango: **ninguna retencion de mas de 4 s** (`pausaSegundos`) y
 * **nada de ritmos rapidos** (inhalar y exhalar de 3 s como minimo: a lo sumo 10 respiraciones por
 * minuto). Quien revisa la sesion puede pedir limites mas estrechos. La advertencia («si te
 * mareas...») es obligatoria y va a la vista **antes** de empezar.
 *
 * ## Pasos
 *
 * - `avance` es `manual` (la persona toca para seguir; **no hay tiempo**, EMO-03) o `auto` (cada paso dura
 *   sus `segundos`, y entonces todos los traen).
 * - Una guia tiene **o** `pasos` **o** `elecciones`. Con `elecciones`, la persona escoge antes de empezar
 *   entre 2 y 4 recorridos («se elige siempre, nada impuesto», EMO-07; «una micro-pausa a elegir entre 3»,
 *   BIE-09). Cada eleccion trae sus propios pasos.
 * - `avisoSiempre` es una frase que queda a la vista durante toda la guia («puedes saltarte una zona o parar
 *   cuando quieras»). `conLineasDeAyuda` agrega, junto a ella, el acceso a las lineas de atencion (EMO-03)
 *   y por eso pide el aviso.
 */

// ---------------------------------------------------------------------------
// respiracion
// ---------------------------------------------------------------------------

const RESPIRACION = objeto(
  {
    modo: opcional(unoDe(['respiracion'])),
    advertenciaInicial: requerido(texto(300)),
    patron: requerido(
      objeto({
        inhalaSegundos: requerido(entero(3, 8)),
        exhalaSegundos: requerido(entero(3, 10)),
        pausaSegundos: requerido(entero(0, 4)),
      }),
    ),
    duracionSegundos: requerido(entero(60, 600)),
    ambientacion: opcional(texto(40)),
    frases: opcional(lista(0, 40, texto(120))),
    haptico: opcional(booleano),
  },
  (valor) =>
    Object.hasOwn(valor, 'frases') ? repetido(valor['frases'], 'frases', null) : undefined,
);

// ---------------------------------------------------------------------------
// pasos
// ---------------------------------------------------------------------------

const PASO = objeto({
  titulo: opcional(texto(60)),
  texto: requerido(texto(300)),
  pictograma: opcional(texto(30)),
  segundos: opcional(entero(5, 180)),
});

const ELECCION = objeto({
  clave: requerido(texto(20)),
  nombre: requerido(texto(60)),
  descripcion: opcional(texto(160)),
  pictograma: opcional(texto(30)),
  pasos: requerido(lista(2, 12, PASO)),
});

/** Con `avance: auto`, un paso sin `segundos` no sabria cuando pasar. Se mira aparte, con el modo a mano. */
function sinSegundosFaltantes(pasos: readonly Record<string, unknown>[], ruta: string) {
  for (const [posicion, paso] of pasos.entries()) {
    if (!Object.hasOwn(paso, 'segundos')) {
      return `${ruta}[${posicion}].segundos es obligatorio cuando el avance es automático`;
    }
  }

  return undefined;
}

const PASOS = objeto(
  {
    modo: requerido(unoDe(['pasos'])),
    advertenciaInicial: opcional(texto(300)),
    intro: opcional(texto(300)),
    avance: requerido(unoDe(['manual', 'auto'])),
    pasos: opcional(lista(2, 12, PASO)),
    elecciones: opcional(lista(2, 4, ELECCION)),
    cierre: opcional(texto(200)),
    avisoSiempre: opcional(texto(200)),
    conLineasDeAyuda: opcional(booleano),
    ambientacion: opcional(texto(40)),
    haptico: opcional(booleano),
  },
  (valor) => {
    const tienePasos = Object.hasOwn(valor, 'pasos');
    const tieneElecciones = Object.hasOwn(valor, 'elecciones');

    if (tienePasos === tieneElecciones) {
      return tienePasos
        ? 'pasos y elecciones no van juntos: la guía tiene una cosa o la otra'
        : 'pasos es obligatorio, o elecciones: la guía no tiene nada que recorrer';
    }

    if (valor['conLineasDeAyuda'] === true && !Object.hasOwn(valor, 'avisoSiempre')) {
      return 'avisoSiempre es obligatorio cuando conLineasDeAyuda es verdadero: el acceso a las líneas va con su frase';
    }

    if (valor['avance'] === 'auto') {
      if (tienePasos) {
        const problema = sinSegundosFaltantes(valor['pasos'] as Record<string, unknown>[], 'pasos');

        if (problema !== undefined) {
          return problema;
        }
      } else {
        for (const [posicion, eleccion] of (
          valor['elecciones'] as Record<string, unknown>[]
        ).entries()) {
          const problema = sinSegundosFaltantes(
            eleccion['pasos'] as Record<string, unknown>[],
            `elecciones[${posicion}].pasos`,
          );

          if (problema !== undefined) {
            return problema;
          }
        }
      }
    }

    return tieneElecciones
      ? (repetido(valor['elecciones'], 'elecciones', 'clave') ??
          repetido(valor['elecciones'], 'elecciones', 'nombre'))
      : undefined;
  },
);

export const GUIA_PASO_A_PASO: Validador = porModo(
  { respiracion: RESPIRACION, pasos: PASOS },
  RESPIRACION,
);
