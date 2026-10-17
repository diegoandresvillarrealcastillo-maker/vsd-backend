import { Motor } from './Motor.js';

/**
 * La forma de `parametros` de cada motor: el contrato entre el servidor y el componente que pinta
 * la sesion (ADR 0030, PLAN-FASE-0-Y-PILOTO §4, SCRUM-206).
 *
 * La base de datos no mira dentro de `parametros` (es JSONB). Sin este contrato, una sesion mal
 * escrita (un cuestionario con una sola opcion, una respiracion con una pausa de diez segundos)
 * llegaria al telefono y romperia la pantalla de quien la abre. Se comprueba al cargar la sesion y
 * al sembrarla, con la misma funcion.
 *
 * Reglas que valen para todos los motores:
 *
 * - **Solo se admiten los parametros del contrato.** Una clave escrita mal (`rondaz`) se rechaza en
 *   lugar de ignorarse en silencio: el componente usaria su valor por omision y nadie se enteraria.
 * - Los textos que lee la persona no van vacios y tienen un largo maximo.
 * - Se informa **del primer problema**, con la ruta del campo (`opciones[3].valor`), sin punto final:
 *   el error de dominio arma la frase.
 *
 * Los motores que todavia no se construyeron aceptan cualquier objeto; su contrato llega con el
 * ticket de cada motor. Una actividad sin motor (las nueve de antes de la Fase 0) tampoco se valida.
 *
 * Lo que NO se comprueba aqui: el filtro de lenguaje clinico (R6) y la lista de exclusion (R14).
 * Son pruebas automaticas sobre el contenido que se siembra, y se ejecutan con ese contenido.
 */
export type ParametrosDeMotor = Readonly<Record<string, unknown>>;

type Problema = string | undefined;

type Objeto = Readonly<Record<string, unknown>>;

type Validador = (valor: unknown, ruta: string) => Problema;

interface Campo {
  readonly requerido: boolean;
  readonly validar: Validador;
}

type Esquema = Readonly<Record<string, Campo>>;

// ---------------------------------------------------------------------------
// Piezas pequenas con las que se arma cada contrato
// ---------------------------------------------------------------------------

const requerido = (validar: Validador): Campo => ({ requerido: true, validar });
const opcional = (validar: Validador): Campo => ({ requerido: false, validar });

const nombreDe = (padre: string, clave: string): string =>
  padre === '' ? clave : `${padre}.${clave}`;

function esObjeto(valor: unknown): valor is Objeto {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

const texto =
  (maximo: number): Validador =>
  (valor, ruta) => {
    if (typeof valor !== 'string') {
      return `${ruta} debe ser un texto`;
    }

    const limpio = valor.trim();

    if (limpio === '') {
      return `${ruta} no puede estar vacío`;
    }

    return limpio.length > maximo ? `${ruta} no puede pasar de ${maximo} caracteres` : undefined;
  };

const entero =
  (minimo: number, maximo: number): Validador =>
  (valor, ruta) =>
    typeof valor === 'number' && Number.isInteger(valor) && valor >= minimo && valor <= maximo
      ? undefined
      : `${ruta} debe ser un número entero de ${minimo} a ${maximo}`;

const enteroONulo =
  (minimo: number, maximo: number): Validador =>
  (valor, ruta) =>
    valor === null ? undefined : entero(minimo, maximo)(valor, ruta);

const booleano: Validador = (valor, ruta) =>
  typeof valor === 'boolean' ? undefined : `${ruta} debe ser verdadero o falso`;

const lista =
  (minimo: number, maximo: number, elemento: Validador): Validador =>
  (valor, ruta) => {
    if (!Array.isArray(valor)) {
      return `${ruta} debe ser una lista`;
    }

    if (valor.length < minimo || valor.length > maximo) {
      return `${ruta} debe tener de ${minimo} a ${maximo} elementos`;
    }

    for (const [posicion, item] of (valor as unknown[]).entries()) {
      const problema = elemento(item, `${ruta}[${posicion}]`);

      if (problema !== undefined) {
        return problema;
      }
    }

    return undefined;
  };

/** Un objeto con exactamente estas claves, las requeridas presentes y cada una bien formada. */
function objeto(esquema: Esquema, cruzada?: (valor: Objeto, ruta: string) => Problema): Validador {
  return (valor, ruta) => {
    if (!esObjeto(valor)) {
      return `${ruta === '' ? 'los parámetros' : ruta} debe ser un objeto`;
    }

    for (const clave of Object.keys(valor)) {
      if (!Object.hasOwn(esquema, clave)) {
        return `${nombreDe(ruta, clave)} no es un parámetro de este motor`;
      }
    }

    for (const [clave, campo] of Object.entries(esquema)) {
      if (!Object.hasOwn(valor, clave)) {
        if (campo.requerido) {
          return `${nombreDe(ruta, clave)} es obligatorio`;
        }

        continue;
      }

      const problema = campo.validar(valor[clave], nombreDe(ruta, clave));

      if (problema !== undefined) {
        return problema;
      }
    }

    return cruzada?.(valor, ruta);
  };
}

const igualSinMayusculas = (valor: string): string => valor.trim().toLowerCase();

/**
 * El primer valor repetido de `campo` (o del elemento mismo si `campo` es `null`) en una lista ya
 * validada. Los textos se comparan sin espacios de los bordes y sin distinguir mayusculas.
 */
function repetido(valor: unknown, ruta: string, campo: string | null): Problema {
  const vistos = new Set<string>();

  for (const [posicion, elemento] of (valor as unknown[]).entries()) {
    const dato = campo === null ? elemento : (elemento as Objeto)[campo];
    const clave = typeof dato === 'string' ? igualSinMayusculas(dato) : String(dato);

    if (vistos.has(clave)) {
      const donde = `${ruta}[${posicion}]${campo === null ? '' : `.${campo}`}`;

      return `${donde} repite ${typeof dato === 'string' ? `"${dato.trim()}"` : String(dato)}`;
    }

    vistos.add(clave);
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// M8, cuestionario_corto
// ---------------------------------------------------------------------------

/**
 * Preguntas cerradas, una a la vez, con las mismas opciones para todas. La `indicacion` es la frase
 * que enmarca el cuestionario («Piensa en los ultimos siete dias. No hay respuestas buenas ni malas»).
 *
 * El maximo del puntaje **no se guarda**: es `preguntas x valor mas alto`, asi que no puede quedar
 * desincronizado del `puntaje_maximo` de la actividad (el servidor rechaza con 400 un puntaje que
 * lo pase).
 */
const CUESTIONARIO = objeto(
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
// M1, secuencia
// ---------------------------------------------------------------------------

/**
 * Repetir una secuencia que crece. El «alfabeto» son las casillas: para la secuencia de numeros, los
 * diez digitos; para «Recuerda los colores», figuras.
 *
 * `msDestello` solo lo usa el juego de casillas que destellan (la baranda R10 pide al menos 600 ms);
 * la secuencia de numeros muestra todos los digitos a la vez durante
 * `largo x msPorElemento + msDeMargen`.
 *
 * En el juego de casillas, `msPorElemento` es el **turno** de cada casilla y `msDestello` lo que se
 * queda iluminada: la pausa es la diferencia, asi que el destello **no puede pasar del turno**. La
 * pantalla ya lo exige; aqui se rechaza al sembrar, y no cuando alguien abre la sesion.
 *
 * Un color nunca es la unica pista (R10): una casilla con `color` tiene que traer tambien `forma`.
 */
const CASILLA = objeto(
  {
    clave: requerido(texto(20)),
    nombre: requerido(texto(40)),
    forma: opcional(texto(20)),
    color: opcional(texto(20)),
  },
  (valor, ruta) =>
    Object.hasOwn(valor, 'color') && !Object.hasOwn(valor, 'forma')
      ? `${nombreDe(ruta, 'forma')} es obligatorio cuando la casilla tiene color: el color no puede ser la única pista`
      : undefined,
);

const SECUENCIA = objeto(
  {
    casillas: requerido(lista(2, 12, CASILLA)),
    largoInicial: requerido(entero(1, 10)),
    rondas: requerido(entero(1, 50)),
    msPorElemento: requerido(entero(200, 5000)),
    msDeMargen: requerido(entero(0, 10000)),
    msDestello: opcional(entero(600, 5000)),
  },
  (valor) => {
    const destello = valor['msDestello'];
    const turno = valor['msPorElemento'] as number;

    return (
      repetido(valor['casillas'], 'casillas', 'clave') ??
      repetido(valor['casillas'], 'casillas', 'nombre') ??
      (typeof destello === 'number' && destello > turno
        ? `msDestello (${destello}) no puede ser mayor que msPorElemento (${turno}): el destello tiene que caber en el turno de la casilla`
        : undefined)
    );
  },
);

// ---------------------------------------------------------------------------
// M2, tocar_el_objetivo
// ---------------------------------------------------------------------------

/**
 * Elegir en una cuadricula. `lados` son los tamanos de la cuadricula, de menor a mayor, y las
 * rondas se reparten entre ellos en tramos iguales. `segundosPorRonda: null` es «sin tiempo».
 */
const TOCAR_EL_OBJETIVO = objeto(
  {
    rondas: requerido(entero(1, 60)),
    segundosPorRonda: requerido(enteroONulo(3, 120)),
    lados: requerido(lista(1, 6, entero(2, 8))),
  },
  (valor) => {
    const lados = valor['lados'] as number[];

    for (let posicion = 1; posicion < lados.length; posicion++) {
      if ((lados[posicion] as number) <= (lados[posicion - 1] as number)) {
        return 'lados debe ir de menor a mayor y sin repetir';
      }
    }

    const rondas = valor['rondas'] as number;

    return rondas < lados.length
      ? `rondas (${rondas}) no puede ser menor que el número de lados (${lados.length}): algún tamaño no se jugaría nunca`
      : undefined;
  },
);

// ---------------------------------------------------------------------------
// M9, escritura_breve
// ---------------------------------------------------------------------------

/**
 * Texto libre corto: uno o varios campos, con una idea de arranque opcional. `minimo` es cuantos
 * campos hay que llenar (con «una basta», 1) y `permiteNingunaHoy` el boton «hoy no me sale ninguno».
 *
 * `minimo` es de **1 en adelante**: la pantalla pide al menos una respuesta, y un dia sin nada es
 * justamente lo que registra el boton de `permiteNingunaHoy`. Un `minimo` de 0 haria que el boton
 * de terminar sirviera para no escribir nada, que es otra cosa.
 */
const ESCRITURA_BREVE = objeto(
  {
    invitacion: requerido(texto(200)),
    campos: requerido(entero(1, 5)),
    largoMaximo: requerido(entero(50, 1000)),
    ideas: opcional(lista(0, 10, texto(80))),
    minimo: opcional(entero(1, 5)),
    permiteNingunaHoy: opcional(booleano),
  },
  (valor) => {
    if (typeof valor['minimo'] === 'number' && valor['minimo'] > (valor['campos'] as number)) {
      return `minimo (${valor['minimo']}) no puede ser mayor que los campos (${String(valor['campos'])})`;
    }

    return Object.hasOwn(valor, 'ideas') ? repetido(valor['ideas'], 'ideas', null) : undefined;
  },
);

// ---------------------------------------------------------------------------
// M7, guia_paso_a_paso
// ---------------------------------------------------------------------------

/**
 * Pasos con una animacion suave y texto; hoy, la respiracion acompasada (BIE-01).
 *
 * Barandas de la ficha, hechas rango: **ninguna retencion de mas de 4 s** (`pausaSegundos`) y
 * **nada de ritmos rapidos** (inhalar y exhalar de 3 s como minimo: a lo sumo 10 respiraciones por
 * minuto). Quien revisa la sesion puede pedir limites mas estrechos. La advertencia («si te
 * mareas...») es obligatoria y va a la vista **antes** de empezar.
 */
const GUIA_PASO_A_PASO = objeto(
  {
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
// La puerta
// ---------------------------------------------------------------------------

const CONTRATOS: ReadonlyMap<Motor, Validador> = new Map<Motor, Validador>([
  [Motor.CUESTIONARIO_CORTO, CUESTIONARIO],
  [Motor.SECUENCIA, SECUENCIA],
  [Motor.TOCAR_EL_OBJETIVO, TOCAR_EL_OBJETIVO],
  [Motor.ESCRITURA_BREVE, ESCRITURA_BREVE],
  [Motor.GUIA_PASO_A_PASO, GUIA_PASO_A_PASO],
]);

/** Los motores cuyo contrato ya esta fijado. El resto acepta cualquier objeto. */
export const MOTORES_CON_CONTRATO: readonly Motor[] = [...CONTRATOS.keys()];

/**
 * El primer problema de `parametros` para `motor`, o `undefined` si estan bien formados.
 *
 * `motor` es `null` para una actividad que no tiene (las nueve de antes de la Fase 0): sin contrato,
 * cualquier objeto vale.
 */
export function problemaDeLosParametros(
  motor: Motor | null,
  parametros: ParametrosDeMotor,
): Problema {
  if (motor === null) {
    return undefined;
  }

  return CONTRATOS.get(motor)?.(parametros, '');
}
