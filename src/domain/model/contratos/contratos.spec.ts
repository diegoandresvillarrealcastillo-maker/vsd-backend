import { describe, expect, it } from 'vitest';
import { Motor } from '../Motor.js';
import { problemaDeLosParametros, type ParametrosDeMotor } from '../ParametrosDelMotor.js';

/**
 * Los contratos de los modos que suma SCRUM-220: M2 (flujo, puntos), M3 (lista, escena), M4 (intruso,
 * cestas), M5 (completar, anagrama), M6, M7 (pasos), M8 (tarjeta, lista, preguntas, rueda) y las
 * ampliaciones de M9.
 *
 * Cada motor tiene una sesion valida de referencia y cada regla se prueba cambiando UN campo de ella,
 * de modo que un caso rechazado lo es por esa regla y no por otra. Los contratos de antes (Fase 0 y piloto)
 * los prueba `ParametrosDelMotor.spec.ts`.
 */

type Copia = Record<string, unknown>;

/** Una copia profunda de `base` con `cambio` aplicado. */
function con(base: ParametrosDeMotor, cambio: (copia: Copia) => void): ParametrosDeMotor {
  const copia = JSON.parse(JSON.stringify(base)) as Copia;
  cambio(copia);

  return copia;
}

function rechazaCon(motor: Motor, parametros: ParametrosDeMotor, nombra: string) {
  const problema = problemaDeLosParametros(motor, parametros);

  expect(problema, `deberia rechazarse nombrando ${nombra}`).toBeDefined();
  expect(problema).toContain(nombra);
  expect(problema).not.toMatch(/\.$/u);
  expect(problema).not.toContain('\n');
}

type Caso = readonly [descripcion: string, cambio: (c: Copia) => void, nombra: string];

function pruebaLosCasos(motor: Motor, base: ParametrosDeMotor, casos: readonly Caso[]) {
  it('la sesion de referencia es valida', () => {
    expect(problemaDeLosParametros(motor, base)).toBeUndefined();
  });

  it.each(casos)('rechaza %s', (_descripcion, cambio, nombra) => {
    rechazaCon(motor, con(base, cambio), nombra);
  });
}

const simbolo = (clave: string, nombre: string) => ({ clave, nombre, pictograma: clave });

// ---------------------------------------------------------------------------
// M2, tocar_el_objetivo
// ---------------------------------------------------------------------------

describe('tocar_el_objetivo, modo flujo (COG-05)', () => {
  const flujo = (): ParametrosDeMotor => ({
    modo: 'flujo',
    objetivos: [simbolo('sol', 'sol')],
    otros: [simbolo('luna', 'luna'), simbolo('nube', 'nube'), simbolo('gota', 'gota')],
    secuencia: ['luna', 'sol', 'nube', 'gota', 'sol', 'luna', 'nube', 'sol', 'gota', 'luna'],
    msPorEstimulo: 1600,
    puntosMaximos: 3,
  });

  pruebaLosCasos(Motor.TOCAR_EL_OBJETIVO, flujo(), [
    [
      'un modo que no existe',
      (c) => {
        c['modo'] = 'rapido';
      },
      'modo',
    ],
    [
      'mas de un estimulo por segundo (baranda R10)',
      (c) => {
        c['msPorEstimulo'] = 900;
      },
      'msPorEstimulo',
    ],
    [
      'una clave que no es parametro',
      (c) => {
        c['rondas'] = 15;
      },
      'rondas',
    ],
    [
      'un simbolo sin pictograma',
      (c) => {
        delete (c['objetivos'] as Copia[])[0]?.['pictograma'];
      },
      'objetivos[0].pictograma',
    ],
    [
      'un simbolo en los objetivos y en los demas',
      (c) => {
        (c['otros'] as Copia[])[0] = simbolo('sol', 'otro sol');
      },
      'clave',
    ],
    [
      'dos simbolos con el mismo nombre',
      (c) => {
        (c['otros'] as Copia[])[0] = simbolo('estrella', 'sol');
      },
      'nombre',
    ],
    [
      'un estimulo que no es de la sesion',
      (c) => {
        (c['secuencia'] as string[])[3] = 'rayo';
      },
      'secuencia[3]',
    ],
    [
      'el mismo estimulo dos veces seguidas',
      (c) => {
        (c['secuencia'] as string[])[1] = 'luna';
      },
      'secuencia[1]',
    ],
    [
      'una secuencia sin ningun objetivo',
      (c) => {
        c['secuencia'] = [
          'luna',
          'nube',
          'gota',
          'luna',
          'nube',
          'gota',
          'luna',
          'nube',
          'gota',
          'luna',
        ];
        c['puntosMaximos'] = 1;
      },
      'ningún objetivo',
    ],
    [
      'un maximo que no es lo que se puede tocar',
      (c) => {
        c['puntosMaximos'] = 15;
      },
      'puntosMaximos',
    ],
    [
      'menos de 10 estimulos',
      (c) => {
        c['secuencia'] = ['sol', 'luna', 'sol'];
      },
      'secuencia',
    ],
  ]);

  it('con dos objetivos cuenta los dos', () => {
    const dos = con(flujo(), (c) => {
      c['objetivos'] = [simbolo('sol', 'sol'), simbolo('luna', 'luna')];
      c['otros'] = [simbolo('nube', 'nube'), simbolo('gota', 'gota')];
      c['secuencia'] = [
        'sol',
        'nube',
        'luna',
        'gota',
        'sol',
        'nube',
        'luna',
        'gota',
        'sol',
        'nube',
      ];
      c['puntosMaximos'] = 5;
    });

    expect(problemaDeLosParametros(Motor.TOCAR_EL_OBJETIVO, dos)).toBeUndefined();
  });
});

describe('tocar_el_objetivo, modo puntos (COG-08)', () => {
  const puntos = (): ParametrosDeMotor => ({
    modo: 'puntos',
    indicacion: 'Une los puntos en orden: 1, 2, 3…',
    puntos: [
      { etiqueta: '1', x: 10, y: 10 },
      { etiqueta: '2', x: 50, y: 15 },
      { etiqueta: '3', x: 85, y: 12 },
      { etiqueta: '4', x: 20, y: 50 },
      { etiqueta: '5', x: 70, y: 55 },
      { etiqueta: '6', x: 45, y: 85 },
    ],
    puntosMaximos: 10,
  });

  pruebaLosCasos(Motor.TOCAR_EL_OBJETIVO, puntos(), [
    [
      'menos de cinco puntos',
      (c) => {
        c['puntos'] = (c['puntos'] as Copia[]).slice(0, 4);
      },
      'puntos',
    ],
    [
      'una etiqueta repetida',
      (c) => {
        (c['puntos'] as Copia[])[2] = { etiqueta: '1', x: 85, y: 12 };
      },
      'etiqueta',
    ],
    [
      'dos puntos tan juntos que no se podrian tocar',
      (c) => {
        (c['puntos'] as Copia[])[1] = { etiqueta: '2', x: 15, y: 18 };
      },
      'distancia',
    ],
    [
      'un punto fuera de la tabla',
      (c) => {
        (c['puntos'] as Copia[])[0] = { etiqueta: '1', x: 2, y: 10 };
      },
      'puntos[0].x',
    ],
    [
      'sin indicacion',
      (c) => {
        delete c['indicacion'];
      },
      'indicacion',
    ],
    [
      'sin maximo',
      (c) => {
        delete c['puntosMaximos'];
      },
      'puntosMaximos',
    ],
  ]);
});

// ---------------------------------------------------------------------------
// M3, ver_ocultar_recordar
// ---------------------------------------------------------------------------

describe('ver_ocultar_recordar, modo lista (COG-06)', () => {
  const el = (clave: string) => ({ clave, nombre: clave });
  const lista = (): ParametrosDeMotor => ({
    modo: 'lista',
    contexto: 'En el mercado',
    segundosVista: 12,
    elementos: [el('pan'), el('leche'), el('arroz'), el('tomate')],
    distractores: [el('queso'), el('cebolla'), el('papa'), el('huevos')],
    puntosMaximos: 8,
  });

  pruebaLosCasos(Motor.VER_OCULTAR_RECORDAR, lista(), [
    [
      'sin modo',
      (c) => {
        delete c['modo'];
      },
      'modo',
    ],
    [
      'menos tiempo a la vista de lo razonable',
      (c) => {
        c['segundosVista'] = 3;
      },
      'segundosVista',
    ],
    [
      'un distractor que ya es un elemento',
      (c) => {
        (c['distractores'] as Copia[])[0] = el('pan');
      },
      'clave',
    ],
    [
      'un distractor con el mismo nombre que un elemento',
      (c) => {
        (c['distractores'] as Copia[])[0] = { clave: 'otro', nombre: 'Pan' };
      },
      'nombre',
    ],
    [
      'un solo distractor',
      (c) => {
        c['distractores'] = [el('queso')];
      },
      'distractores',
    ],
    [
      'nueve elementos',
      (c) => {
        c['elementos'] = Array.from({ length: 9 }, (_, i) => el(`e${i}`));
      },
      'elementos',
    ],
  ]);
});

describe('ver_ocultar_recordar, modo escena (COG-09)', () => {
  const celda = (fila: number, columna: number, nombre: string) => ({
    fila,
    columna,
    pictograma: nombre,
    nombre,
  });
  const opcion = (nombre: string) => ({ pictograma: nombre, nombre });
  const pregunta = (fila: number, columna: number, texto: string, correcta: string) => ({
    texto,
    fila,
    columna,
    opciones: [opcion(correcta), opcion('rayo'), opcion('vela'), opcion('pez')],
    correcta: 0,
  });
  const escena = (): ParametrosDeMotor => ({
    modo: 'escena',
    segundosVista: 10,
    filas: 3,
    columnas: 3,
    celdas: [
      celda(1, 1, 'sol'),
      celda(1, 3, 'luna'),
      celda(2, 2, 'casa'),
      celda(3, 1, 'arbol'),
      celda(3, 3, 'taza'),
      celda(2, 3, 'llave'),
    ],
    preguntas: [
      pregunta(1, 1, '¿Qué había en la esquina de arriba, a la izquierda?', 'sol'),
      pregunta(1, 3, '¿Qué había en la esquina de arriba, a la derecha?', 'luna'),
      pregunta(2, 2, '¿Qué había en el centro?', 'casa'),
      pregunta(3, 1, '¿Qué había en la esquina de abajo, a la izquierda?', 'arbol'),
      pregunta(3, 3, '¿Qué había en la esquina de abajo, a la derecha?', 'taza'),
    ],
    puntosMaximos: 5,
  });

  pruebaLosCasos(Motor.VER_OCULTAR_RECORDAR, escena(), [
    [
      'una celda fuera de la cuadricula',
      (c) => {
        (c['celdas'] as Copia[])[0] = celda(4, 1, 'sol');
      },
      'celdas[0]',
    ],
    [
      'dos cosas en el mismo lugar',
      (c) => {
        (c['celdas'] as Copia[])[1] = celda(1, 1, 'luna');
      },
      'celdas[1]',
    ],
    [
      'dos cosas con el mismo nombre en la escena',
      (c) => {
        (c['celdas'] as Copia[])[1] = celda(1, 3, 'sol');
      },
      'nombre',
    ],
    [
      'una pregunta por un lugar vacio',
      (c) => {
        (c['preguntas'] as Copia[])[0] = pregunta(3, 2, '¿Qué había abajo?', 'sol');
      },
      'preguntas[0]',
    ],
    [
      'una respuesta correcta que no es lo que habia',
      (c) => {
        (c['preguntas'] as Copia[])[2]!['correcta'] = 1;
      },
      'preguntas[2].correcta',
    ],
    [
      'una respuesta correcta que no es una opcion',
      (c) => {
        (c['preguntas'] as Copia[])[2]!['correcta'] = 3;
        (c['preguntas'] as Copia[])[2]!['opciones'] = [
          opcion('casa'),
          opcion('rayo'),
          opcion('vela'),
        ];
      },
      'correcta',
    ],
    [
      'opciones con el mismo nombre',
      (c) => {
        ((c['preguntas'] as Copia[])[0]!['opciones'] as Copia[])[1] = opcion('sol');
      },
      'opciones',
    ],
    [
      'un maximo que no es el numero de preguntas',
      (c) => {
        c['puntosMaximos'] = 6;
      },
      'puntosMaximos',
    ],
  ]);
});

// ---------------------------------------------------------------------------
// M4, clasificar
// ---------------------------------------------------------------------------

describe('clasificar, modo intruso (COG-02)', () => {
  const ronda = (palabras: string[], intruso: number, razon: string) => ({
    palabras,
    intruso,
    razon,
  });
  const intruso = (): ParametrosDeMotor => ({
    modo: 'intruso',
    rondas: [
      ronda(['perro', 'gato', 'caballo', 'mesa'], 3, 'Las otras son animales.'),
      ronda(['arepa', 'pan', 'tinto', 'almojábana'], 2, 'Las otras se comen.'),
      ronda(['bus', 'taxi', 'metro', 'tomate'], 3, 'Las otras sirven para moverse.'),
    ],
    puntosMaximos: 3,
  });

  pruebaLosCasos(Motor.CLASIFICAR, intruso(), [
    [
      'menos de tres rondas',
      (c) => {
        c['rondas'] = (c['rondas'] as Copia[]).slice(0, 2);
      },
      'rondas',
    ],
    [
      'una ronda con tres palabras',
      (c) => {
        ((c['rondas'] as Copia[])[0]!['palabras'] as string[]).pop();
      },
      'rondas[0].palabras',
    ],
    [
      'una palabra repetida en la ronda',
      (c) => {
        ((c['rondas'] as Copia[])[0]!['palabras'] as string[])[1] = 'Perro';
      },
      'repite',
    ],
    [
      'un intruso que no es una de las cuatro',
      (c) => {
        (c['rondas'] as Copia[])[0]!['intruso'] = 4;
      },
      'rondas[0].intruso',
    ],
    [
      'una ronda sin razon',
      (c) => {
        delete (c['rondas'] as Copia[])[1]?.['razon'];
      },
      'rondas[1].razon',
    ],
    [
      'un maximo que no es el numero de rondas',
      (c) => {
        c['puntosMaximos'] = 6;
      },
      'puntosMaximos',
    ],
  ]);
});

describe('clasificar, modo cestas', () => {
  const elemento = (clave: string, cesta?: string | string[]) => ({
    clave,
    nombre: clave,
    ...(cesta === undefined ? {} : { cesta }),
  });
  const cestas = (): ParametrosDeMotor => ({
    modo: 'cestas',
    indicacion: 'Lleva cada cosa a su cesta.',
    cestas: [
      { clave: 'frutas', nombre: 'Frutas' },
      { clave: 'verduras', nombre: 'Verduras' },
    ],
    elementos: [
      elemento('mango', 'frutas'),
      elemento('lulo', 'frutas'),
      elemento('zanahoria', 'verduras'),
      elemento('espinaca', 'verduras'),
      elemento('tomate', ['frutas', 'verduras']),
    ],
    puntosMaximos: 5,
  });

  pruebaLosCasos(Motor.CLASIFICAR, cestas(), [
    [
      'una sola cesta',
      (c) => {
        c['cestas'] = [{ clave: 'frutas', nombre: 'Frutas' }];
      },
      'cestas',
    ],
    [
      'un elemento con una cesta que no existe',
      (c) => {
        (c['elementos'] as Copia[])[0]!['cesta'] = 'carnes';
      },
      'elementos[0].cesta',
    ],
    [
      'una cesta repetida en un elemento ambiguo',
      (c) => {
        (c['elementos'] as Copia[])[4]!['cesta'] = ['frutas', 'frutas'];
      },
      'repite una cesta',
    ],
    [
      'elementos repetidos',
      (c) => {
        (c['elementos'] as Copia[])[1] = elemento('mango', 'frutas');
      },
      'repite',
    ],
    [
      'unos con cesta y otros sin ella',
      (c) => {
        delete (c['elementos'] as Copia[])[0]?.['cesta'];
      },
      'mezcla',
    ],
    [
      'un maximo que no es el numero de elementos',
      (c) => {
        c['puntosMaximos'] = 8;
      },
      'puntosMaximos',
    ],
    [
      'sin maximo cuando hay respuestas',
      (c) => {
        delete c['puntosMaximos'];
      },
      'puntosMaximos',
    ],
  ]);

  describe('sin cesta correcta (EMO-04, se reflexiona, no se puntua)', () => {
    const reflexion = (): ParametrosDeMotor =>
      con(cestas(), (c) => {
        c['cestas'] = [
          { clave: 'mi', nombre: 'Depende de mí' },
          { clave: 'parte', nombre: 'Depende en parte' },
          { clave: 'no', nombre: 'No depende de mí' },
        ];
        c['elementos'] = ['hora', 'actitud', 'clima', 'nota'].map((n) => elemento(n));
        c['linea'] = { invitacion: 'Si quieres, escribe qué harás.', largoMaximo: 200 };
        delete c['puntosMaximos'];
      });

    it('es valida', () => {
      expect(problemaDeLosParametros(Motor.CLASIFICAR, reflexion())).toBeUndefined();
    });

    it('rechaza un maximo: no hay respuesta correcta que puntuar', () => {
      rechazaCon(
        Motor.CLASIFICAR,
        con(reflexion(), (c) => {
          c['puntosMaximos'] = 4;
        }),
        'puntosMaximos',
      );
    });

    it('rechaza una linea sin invitacion', () => {
      rechazaCon(
        Motor.CLASIFICAR,
        con(reflexion(), (c) => {
          c['linea'] = { largoMaximo: 200 };
        }),
        'linea.invitacion',
      );
    });
  });
});

// ---------------------------------------------------------------------------
// M5, palabras
// ---------------------------------------------------------------------------

describe('palabras, modo completar (COG-07)', () => {
  const completar = (): ParametrosDeMotor => ({
    modo: 'completar',
    palabras: [
      { pista: 'Una fruta', palabra: 'manzana', faltan: [2] },
      { pista: 'Un animal', palabra: 'caballo', faltan: [1] },
      { pista: 'Un lugar', palabra: 'parque', faltan: [3] },
    ],
    puntosMaximos: 3,
  });

  pruebaLosCasos(Motor.PALABRAS, completar(), [
    [
      'una palabra sin faltantes',
      (c) => {
        delete (c['palabras'] as Copia[])[0]?.['faltan'];
      },
      'palabras[0].faltan',
    ],
    [
      'una letra faltante que no existe en la palabra',
      (c) => {
        (c['palabras'] as Copia[])[0]!['faltan'] = [7];
      },
      'palabras[0].faltan',
    ],
    [
      'la misma posicion dos veces',
      (c) => {
        (c['palabras'] as Copia[])[0]!['faltan'] = [2, 2];
      },
      'repite',
    ],
    [
      'casi todas las letras ocultas',
      (c) => {
        (c['palabras'] as Copia[])[2]!['faltan'] = [0, 1, 2, 3, 4];
      },
      'palabras[2].faltan',
    ],
    [
      'un orden revuelto: es del anagrama',
      (c) => {
        (c['palabras'] as Copia[])[0]!['revuelta'] = 'zamnana';
      },
      'revuelta',
    ],
    [
      'una palabra con espacios',
      (c) => {
        (c['palabras'] as Copia[])[0]!['palabra'] = 'dos palabras';
      },
      'palabras[0].palabra',
    ],
    [
      'una palabra repetida',
      (c) => {
        (c['palabras'] as Copia[])[1]!['palabra'] = 'Manzana';
        (c['palabras'] as Copia[])[1]!['faltan'] = [2];
      },
      'repite',
    ],
    [
      'un maximo que no es el numero de palabras',
      (c) => {
        c['puntosMaximos'] = 6;
      },
      'puntosMaximos',
    ],
  ]);
});

describe('palabras, modo anagrama (COG-07)', () => {
  const anagrama = (): ParametrosDeMotor => ({
    modo: 'anagrama',
    palabras: [
      { pista: 'Algo que haces con un libro', palabra: 'lectura', revuelta: 'tulecra' },
      { pista: 'Una fruta', palabra: 'naranja', revuelta: 'jarnana' },
      { pista: 'Un ave', palabra: 'canario', revuelta: 'rianaco' },
    ],
    puntosMaximos: 3,
  });

  it('la de referencia, con tildes y mayusculas, es valida', () => {
    const conTildes = con(anagrama(), (c) => {
      (c['palabras'] as Copia[])[0] = { pista: 'Una fruta', palabra: 'Limón', revuelta: 'nóLim' };
    });

    expect(problemaDeLosParametros(Motor.PALABRAS, conTildes)).toBeUndefined();
  });

  it.each([
    [
      'sin el orden revuelto',
      (c: Copia) => {
        delete (c['palabras'] as Copia[])[0]?.['revuelta'];
      },
      'revuelta',
    ],
    [
      'unas letras que no son las de la palabra',
      (c: Copia) => {
        (c['palabras'] as Copia[])[1]!['revuelta'] = 'jarnanz';
      },
      'las mismas letras',
    ],
    [
      'la palabra tal cual, sin revolver',
      (c: Copia) => {
        (c['palabras'] as Copia[])[1]!['revuelta'] = 'naranja';
      },
      'la misma palabra',
    ],
    [
      'letras faltantes: son de completar',
      (c: Copia) => {
        (c['palabras'] as Copia[])[1]!['faltan'] = [1];
      },
      'faltan',
    ],
  ])('rechaza %s', (_descripcion, cambio, nombra) => {
    rechazaCon(Motor.PALABRAS, con(anagrama(), cambio), nombra);
  });
});

// ---------------------------------------------------------------------------
// M6, calculo
// ---------------------------------------------------------------------------

describe('calculo (COG-04)', () => {
  const ronda = (enunciado: string, opciones: string[], correcta: number) => ({
    enunciado,
    opciones,
    correcta,
  });
  const calculo = (): ParametrosDeMotor => ({
    rondas: [
      ronda('27 + 15', ['41', '42', '43'], 1),
      ronda('50 − 18', ['32', '33', '38'], 0),
      ronda('El doble de 14', ['24', '28', '26'], 1),
    ],
    puntosMaximos: 3,
  });

  pruebaLosCasos(Motor.CALCULO, calculo(), [
    [
      'dos opciones',
      (c) => {
        (c['rondas'] as Copia[])[0]!['opciones'] = ['41', '42'];
      },
      'rondas[0].opciones',
    ],
    [
      'dos opciones iguales',
      (c) => {
        (c['rondas'] as Copia[])[0]!['opciones'] = ['42', '42', '43'];
      },
      'repite',
    ],
    [
      'una respuesta correcta fuera de las opciones',
      (c) => {
        (c['rondas'] as Copia[])[0]!['correcta'] = 3;
      },
      'rondas[0].correcta',
    ],
    [
      'un enunciado vacio',
      (c) => {
        (c['rondas'] as Copia[])[1]!['enunciado'] = '  ';
      },
      'rondas[1].enunciado',
    ],
    [
      'un maximo que no es el numero de rondas',
      (c) => {
        c['puntosMaximos'] = 8;
      },
      'puntosMaximos',
    ],
    [
      'un tiempo limite: no hay reloj (R4)',
      (c) => {
        c['segundosPorRonda'] = 10;
      },
      'segundosPorRonda',
    ],
  ]);
});

// ---------------------------------------------------------------------------
// M7, guia_paso_a_paso, modo pasos
// ---------------------------------------------------------------------------

describe('guia_paso_a_paso, modo pasos', () => {
  const paso = (texto: string, extra: Copia = {}) => ({ texto, ...extra });
  const pasos = (): ParametrosDeMotor => ({
    modo: 'pasos',
    advertenciaInicial: 'Hazlo sin dolor; si algo duele, para.',
    avance: 'manual',
    pasos: [paso('Siéntate derecha o derecho.'), paso('Inclina la cabeza hacia un lado.')],
    cierre: 'Eso es todo.',
    avisoSiempre: 'Puedes parar cuando quieras.',
  });

  pruebaLosCasos(Motor.GUIA_PASO_A_PASO, pasos(), [
    [
      'un solo paso',
      (c) => {
        c['pasos'] = [paso('Uno solo')];
      },
      'pasos',
    ],
    [
      'pasos y elecciones juntos',
      (c) => {
        const eleccion = (clave: string) => ({
          clave,
          nombre: `Opcion ${clave}`,
          pasos: [paso('Primero.'), paso('Después.')],
        });

        c['elecciones'] = [eleccion('a'), eleccion('b')];
      },
      'pasos y elecciones',
    ],
    [
      'ni pasos ni elecciones',
      (c) => {
        delete c['pasos'];
      },
      'pasos',
    ],
    [
      'un avance que no existe',
      (c) => {
        c['avance'] = 'rapido';
      },
      'avance',
    ],
    [
      'avance automatico con un paso sin segundos',
      (c) => {
        c['avance'] = 'auto';
        c['pasos'] = [paso('Uno', { segundos: 20 }), paso('Dos')];
      },
      'pasos[1].segundos',
    ],
    [
      'un paso de menos de cinco segundos',
      (c) => {
        (c['pasos'] as Copia[])[0]!['segundos'] = 2;
      },
      'pasos[0].segundos',
    ],
    [
      'el acceso a las lineas sin su frase',
      (c) => {
        c['conLineasDeAyuda'] = true;
        delete c['avisoSiempre'];
      },
      'avisoSiempre',
    ],
    [
      'unos parametros de respiracion mezclados',
      (c) => {
        c['patron'] = { inhalaSegundos: 4, exhalaSegundos: 6, pausaSegundos: 0 };
      },
      'patron',
    ],
  ]);

  it('con avance automatico y todos los segundos, es valida', () => {
    const auto = con(pasos(), (c) => {
      c['avance'] = 'auto';
      c['pasos'] = [paso('Uno', { segundos: 20 }), paso('Dos', { segundos: 25 })];
    });

    expect(problemaDeLosParametros(Motor.GUIA_PASO_A_PASO, auto)).toBeUndefined();
  });

  describe('con elecciones', () => {
    const eleccion = (clave: string) => ({
      clave,
      nombre: `Opcion ${clave}`,
      pasos: [paso('Primero.'), paso('Después.')],
    });
    const elecciones = (): ParametrosDeMotor =>
      con(pasos(), (c) => {
        delete c['pasos'];
        c['elecciones'] = [eleccion('a'), eleccion('b'), eleccion('c')];
      });

    it('es valida', () => {
      expect(problemaDeLosParametros(Motor.GUIA_PASO_A_PASO, elecciones())).toBeUndefined();
    });

    it.each([
      [
        'una sola eleccion',
        (c: Copia) => {
          c['elecciones'] = [eleccion('a')];
        },
        'elecciones',
      ],
      [
        'dos elecciones con la misma clave',
        (c: Copia) => {
          (c['elecciones'] as Copia[])[1] = eleccion('a');
        },
        'repite',
      ],
      [
        'una eleccion con un solo paso',
        (c: Copia) => {
          (c['elecciones'] as Copia[])[0]!['pasos'] = [paso('Uno')];
        },
        'elecciones[0].pasos',
      ],
      [
        'avance automatico con un paso de una eleccion sin segundos',
        (c: Copia) => {
          c['avance'] = 'auto';
        },
        'elecciones[0].pasos[0].segundos',
      ],
    ])('rechaza %s', (_descripcion, cambio, nombra) => {
      rechazaCon(Motor.GUIA_PASO_A_PASO, con(elecciones(), cambio), nombra);
    });
  });

  it('el modo respiracion se puede decir o callar: las sesiones de siempre no lo traen', () => {
    const respiracion = {
      advertenciaInicial: 'Puedes parar.',
      patron: { inhalaSegundos: 4, exhalaSegundos: 6, pausaSegundos: 0 },
      duracionSegundos: 120,
    };

    expect(problemaDeLosParametros(Motor.GUIA_PASO_A_PASO, respiracion)).toBeUndefined();
    expect(
      problemaDeLosParametros(Motor.GUIA_PASO_A_PASO, { ...respiracion, modo: 'respiracion' }),
    ).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// M8, cuestionario_corto, sin puntaje
// ---------------------------------------------------------------------------

describe('cuestionario_corto, modo tarjeta (BIE-03, BIE-04, BIE-05)', () => {
  const tarjeta = (): ParametrosDeMotor => ({
    modo: 'tarjeta',
    titulo: 'Luz de la mañana',
    texto: 'Salir a la luz natural un rato después de despertar.',
    porQue: 'Suele ayudar a que el cuerpo reconozca el día.',
    opciones: [
      { clave: 'esta-noche', texto: 'La pruebo esta noche' },
      { clave: 'ya', texto: 'Ya la hago' },
      { clave: 'hoy-no', texto: 'Hoy no' },
    ],
  });

  pruebaLosCasos(Motor.CUESTIONARIO_CORTO, tarjeta(), [
    [
      'una sola opcion',
      (c) => {
        c['opciones'] = [{ clave: 'ya', texto: 'Ya la hago' }];
      },
      'opciones',
    ],
    [
      'opciones con valor: no puntua',
      (c) => {
        (c['opciones'] as Copia[])[0]!['valor'] = 1;
      },
      'opciones[0].valor',
    ],
    [
      'dos opciones con el mismo texto',
      (c) => {
        (c['opciones'] as Copia[])[1]!['texto'] = 'La pruebo esta noche';
      },
      'repite',
    ],
    [
      'sin texto',
      (c) => {
        delete c['texto'];
      },
      'texto',
    ],
  ]);
});

describe('cuestionario_corto, modo lista (BIE-07)', () => {
  const lista = (): ParametrosDeMotor => ({
    modo: 'lista',
    indicacion: 'Marca los que hiciste o harás. Si no marcas ninguno, también está bien.',
    items: [
      { clave: 'celular', texto: 'Dejar el celular lejos de la cama' },
      { clave: 'luz', texto: 'Bajar la luz del cuarto' },
      { clave: 'agua', texto: 'Dejar un vaso de agua cerca' },
      { clave: 'ropa', texto: 'Dejar la ropa de mañana lista' },
    ],
  });

  pruebaLosCasos(Motor.CUESTIONARIO_CORTO, lista(), [
    [
      'dos gestos',
      (c) => {
        c['items'] = (c['items'] as Copia[]).slice(0, 2);
      },
      'items',
    ],
    [
      'un gesto repetido',
      (c) => {
        (c['items'] as Copia[])[1]!['texto'] = 'Dejar el celular lejos de la cama';
      },
      'repite',
    ],
    [
      'sin indicacion',
      (c) => {
        delete c['indicacion'];
      },
      'indicacion',
    ],
  ]);
});

describe('cuestionario_corto, modo preguntas (BIE-08, EMO-08)', () => {
  const preguntas = (): ParametrosDeMotor => ({
    modo: 'preguntas',
    indicacion: 'Sin respuestas buenas ni malas.',
    preguntas: [
      {
        clave: 'hora',
        texto: '¿A qué hora piensas acostarte?',
        tipo: 'hora',
      },
      {
        clave: 'gesto',
        texto: '¿Qué te ayudaría a bajar el ritmo?',
        tipo: 'opcion',
        opciones: [
          { clave: 'ropa', texto: 'Dejar la ropa lista' },
          { clave: 'alarma', texto: 'Poner una alarma de aviso' },
        ],
      },
    ],
    enlaceAlAviso: true,
  });

  pruebaLosCasos(Motor.CUESTIONARIO_CORTO, preguntas(), [
    [
      'una pregunta de hora con opciones',
      (c) => {
        (c['preguntas'] as Copia[])[0]!['opciones'] = [
          { clave: 'a', texto: 'A' },
          { clave: 'b', texto: 'B' },
        ];
      },
      'preguntas[0].opciones',
    ],
    [
      'una pregunta de opcion sin opciones',
      (c) => {
        delete (c['preguntas'] as Copia[])[1]?.['opciones'];
      },
      'preguntas[1].opciones',
    ],
    [
      'un tipo que no existe',
      (c) => {
        (c['preguntas'] as Copia[])[0]!['tipo'] = 'numero';
      },
      'preguntas[0].tipo',
    ],
    [
      'dos preguntas con la misma clave',
      (c) => {
        (c['preguntas'] as Copia[])[1]!['clave'] = 'hora';
      },
      'repite',
    ],
    [
      'opciones repetidas en una pregunta',
      (c) => {
        ((c['preguntas'] as Copia[])[1]!['opciones'] as Copia[])[1]!['texto'] =
          'Dejar la ropa lista';
      },
      'repite',
    ],
  ]);
});

describe('cuestionario_corto, modo rueda (EMO-01)', () => {
  const hoja = (clave: string, definicion = 'Una definición de una línea.') => ({
    clave,
    nombre: clave,
    definicion,
  });
  const medio = (clave: string, hijos: Copia[]) => ({ clave, nombre: clave, hijos });
  const rueda = (): ParametrosDeMotor => ({
    modo: 'rueda',
    indicacion: 'Elige un círculo, y después uno más fino.',
    puerta: { titulo: 'Por el cuerpo', texto: '¿Dónde lo sientes en el cuerpo?' },
    rueda: [
      medio('alegria', [
        medio('paz', [hoja('alivio'), hoja('calma')]),
        medio('ilusion', [hoja('esperanza'), hoja('animo')]),
      ]),
      medio('tristeza', [medio('soledad', [hoja('vacio'), hoja('nostalgia')]), hoja('pena')]),
    ],
    linea: { invitacion: 'Si quieres, cuéntalo en una línea.', largoMaximo: 200 },
  });

  pruebaLosCasos(Motor.CUESTIONARIO_CORTO, rueda(), [
    [
      'una emocion sin definicion',
      (c) => {
        (((c['rueda'] as Copia[])[0]!['hijos'] as Copia[])[0]!['hijos'] as Copia[])[0] = {
          clave: 'alivio',
          nombre: 'alivio',
        };
      },
      'definicion',
    ],
    [
      'una clave repetida en otra rama',
      (c) => {
        ((c['rueda'] as Copia[])[1]!['hijos'] as Copia[])[1] = hoja('alivio');
      },
      'repite',
    ],
    [
      'una sola rama',
      (c) => {
        c['rueda'] = (c['rueda'] as Copia[]).slice(0, 1);
      },
      'rueda',
    ],
    [
      'mas de tres niveles',
      (c) => {
        (((c['rueda'] as Copia[])[0]!['hijos'] as Copia[])[0]!['hijos'] as Copia[])[0] = medio(
          'alivio',
          [hoja('x1'), hoja('x2')],
        );
      },
      'niveles',
    ],
    [
      'un campo que no es parametro',
      (c) => {
        (c['rueda'] as Copia[])[0]!['color'] = 'rojo';
      },
      'color',
    ],
    [
      'sin puerta',
      (c) => {
        delete c['puerta'];
      },
      'puerta',
    ],
  ]);
});

// ---------------------------------------------------------------------------
// M9, escritura_breve, ampliaciones
// ---------------------------------------------------------------------------

describe('escritura_breve, ampliaciones de SCRUM-220', () => {
  const cierre = (): ParametrosDeMotor => ({
    invitacion: 'Cierra el día.',
    campos: 2,
    minimo: 1,
    largoMaximo: 200,
    etiquetas: ['Lo que dejo', 'Lo que me llevo'],
    permiteNingunaHoy: true,
    textoNinguna: 'Hoy lo dejo todo para mañana',
  });

  pruebaLosCasos(Motor.ESCRITURA_BREVE, cierre(), [
    [
      'menos etiquetas que campos',
      (c) => {
        c['etiquetas'] = ['Lo que dejo'];
      },
      'etiquetas',
    ],
    [
      'etiquetas repetidas',
      (c) => {
        c['etiquetas'] = ['Lo que dejo', 'lo que dejo'];
      },
      'repite',
    ],
    [
      'un texto para «hoy no» sin el boton',
      (c) => {
        c['permiteNingunaHoy'] = false;
      },
      'textoNinguna',
    ],
    [
      'guardar para manana con dos campos',
      (c) => {
        c['guardarParaManana'] = true;
      },
      'guardarParaManana',
    ],
  ]);

  it('«Carta a mi de manana»: un campo, guardada para manana', () => {
    const carta = {
      invitacion: 'Dile algo amable a quien despierta mañana.',
      campos: 1,
      largoMaximo: 500,
      guardarParaManana: true,
    };

    expect(problemaDeLosParametros(Motor.ESCRITURA_BREVE, carta)).toBeUndefined();
  });
});

describe('el cierre y el acceso a las lineas, que suma el contenido de Bienestar y Emociones (SCRUM-223 y 224)', () => {
  it.each([
    [
      'cuestionario_corto · tarjeta',
      Motor.CUESTIONARIO_CORTO,
      {
        modo: 'tarjeta',
        titulo: 'Luz de la mañana',
        texto: 'Salir a la luz natural un rato.',
        opciones: [
          { clave: 'a', texto: 'La pruebo esta noche' },
          { clave: 'b', texto: 'Hoy no' },
        ],
        cierre: 'Anotado. Mañana, otra pequeña.',
      },
    ],
    [
      'cuestionario_corto · lista',
      Motor.CUESTIONARIO_CORTO,
      {
        modo: 'lista',
        indicacion: 'Marca los que hiciste.',
        items: [
          { clave: 'a', texto: 'Uno' },
          { clave: 'b', texto: 'Dos' },
          { clave: 'c', texto: 'Tres' },
        ],
        cierre: 'Que descanses.',
      },
    ],
    [
      'cuestionario_corto · preguntas, con el acceso a las lineas',
      Motor.CUESTIONARIO_CORTO,
      {
        modo: 'preguntas',
        indicacion: 'Sin respuestas buenas ni malas.',
        preguntas: [
          {
            clave: 'quien',
            texto: '¿Quién te hace reír?',
            tipo: 'opcion',
            opciones: [
              { clave: 'familia', texto: 'Alguien de la familia' },
              { clave: 'aun-no-se', texto: 'Aún no sé' },
            ],
          },
        ],
        avisoSiempre: 'Si lo necesitas, hay personas que pueden acompañarte.',
        conLineasDeAyuda: true,
        cierre: 'Saber con quién se cuenta ya es una compañía.',
      },
    ],
    [
      'clasificar · cestas, con cierre',
      Motor.CLASIFICAR,
      {
        modo: 'cestas',
        indicacion: 'Lleva cada cosa a su cesta.',
        cestas: [
          { clave: 'a', nombre: 'Depende de mí' },
          { clave: 'b', nombre: 'No depende de mí' },
        ],
        elementos: ['uno', 'dos', 'tres', 'cuatro'].map((n) => ({ clave: n, nombre: n })),
        cierre: 'Separarlo ya ordena un poco. Gracias.',
      },
    ],
    [
      'escritura_breve, con cierre',
      Motor.ESCRITURA_BREVE,
      {
        invitacion: 'Cierra el día.',
        campos: 1,
        largoMaximo: 200,
        cierre: 'Día cerrado. Gracias por contarlo.',
      },
    ],
  ])('%s es valida', (_caso, motor, parametros) => {
    expect(problemaDeLosParametros(motor, parametros)).toBeUndefined();
  });

  it('el acceso a las lineas de una pregunta sin su frase se rechaza', () => {
    rechazaCon(
      Motor.CUESTIONARIO_CORTO,
      {
        modo: 'preguntas',
        indicacion: 'Sin respuestas buenas ni malas.',
        preguntas: [{ clave: 'h', texto: '¿A qué hora?', tipo: 'hora' }],
        conLineasDeAyuda: true,
      },
      'avisoSiempre',
    );
  });

  it('un cierre vacio se rechaza', () => {
    rechazaCon(
      Motor.ESCRITURA_BREVE,
      { invitacion: 'Cierra el día.', campos: 1, largoMaximo: 200, cierre: '  ' },
      'cierre',
    );
  });
});
