import { describe, expect, it } from 'vitest';
import { Motor, MOTORES } from './Motor.js';
import {
  MOTORES_CON_CONTRATO,
  problemaDeLosParametros,
  type ParametrosDeMotor,
} from './ParametrosDelMotor.js';

/**
 * El contrato de `parametros` por motor (PLAN-FASE-0-Y-PILOTO §4, SCRUM-206).
 *
 * Cada motor tiene una sesion valida de referencia que copia la forma de lo que hoy esta escrito en
 * el codigo del frontend (la Fase 0) o de lo que pide el piloto. Cada regla se prueba cambiando UN
 * campo de esa sesion, de modo que un caso rechazado lo es por esa regla y no por otra.
 */

const PREGUNTAS_DE_CARGA = [
  { clave: 'agobio', texto: 'Esta semana, ¿cuánto te agobiaron tus pendientes?' },
  { clave: 'tiempo', texto: '¿Sentiste que el tiempo no te alcanzaba?' },
  { clave: 'descanso', texto: '¿Te costó descansar entre una cosa y otra?' },
  { clave: 'sueno', texto: '¿Se te fue el sueño pensando en lo que tenías por hacer?' },
  { clave: 'ayuda', texto: '¿Hubo algo en lo que habrías querido ayuda?' },
];

const cuestionario = (): ParametrosDeMotor => ({
  indicacion: 'Piensa en los últimos siete días. No hay respuestas buenas ni malas.',
  preguntas: PREGUNTAS_DE_CARGA,
  opciones: [
    { valor: 0, texto: 'Nada' },
    { valor: 1, texto: 'Poco' },
    { valor: 2, texto: 'Algo' },
    { valor: 3, texto: 'Bastante' },
    { valor: 4, texto: 'Mucho' },
  ],
});

const secuenciaDeNumeros = (): ParametrosDeMotor => ({
  casillas: Array.from({ length: 10 }, (_, i) => ({ clave: String(i), nombre: String(i) })),
  largoInicial: 3,
  rondas: 12,
  msPorElemento: 700,
  msDeMargen: 1000,
});

const secuenciaDeColores = (): ParametrosDeMotor => ({
  casillas: [
    { clave: 'circulo', nombre: 'círculo verde', forma: 'círculo', color: 'verde' },
    { clave: 'cuadrado', nombre: 'cuadrado azul', forma: 'cuadrado', color: 'azul' },
    { clave: 'triangulo', nombre: 'triángulo ámbar', forma: 'triángulo', color: 'ámbar' },
    { clave: 'rombo', nombre: 'rombo violeta', forma: 'rombo', color: 'violeta' },
  ],
  largoInicial: 3,
  rondas: 12,
  msPorElemento: 700,
  msDeMargen: 1000,
  msDestello: 700,
});

const diferencia = (): ParametrosDeMotor => ({
  rondas: 15,
  segundosPorRonda: 15,
  lados: [3, 4, 5],
});

const momentoBueno = (): ParametrosDeMotor => ({
  invitacion: '¿Qué estuvo bien hoy?',
  ideas: [
    'Un café a buena hora',
    'Una conversación bonita',
    'Algo salió mejor de lo esperado',
    'Un rato de descanso',
    'Algo rico para comer',
  ],
  campos: 1,
  minimo: 1,
  largoMaximo: 500,
  permiteNingunaHoy: true,
});

const respiracion = (): ParametrosDeMotor => ({
  advertenciaInicial:
    'Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.',
  patron: { inhalaSegundos: 4, exhalaSegundos: 6, pausaSegundos: 0 },
  duracionSegundos: 120,
  ambientacion: 'bosque',
  frases: ['Sin prisa.', 'Deja que el aire entre y salga a tu ritmo.'],
  haptico: true,
});

/** Una copia profunda de `base` con `cambio` aplicado: asi cada caso modifica un solo campo. */
function con(base: ParametrosDeMotor, cambio: (copia: Record<string, unknown>) => void) {
  const copia = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
  cambio(copia);

  return copia as ParametrosDeMotor;
}

/** Rechaza con un mensaje que nombra el campo, de una sola linea y sin punto final. */
function rechazaCon(motor: Motor, parametros: ParametrosDeMotor, nombra: string) {
  const problema = problemaDeLosParametros(motor, parametros);

  expect(problema).toBeDefined();
  expect(problema).toContain(nombra);
  expect(problema).not.toMatch(/\.$/u);
  expect(problema).not.toContain('\n');
}

/** Quita una clave. */
const sin = (base: ParametrosDeMotor, clave: string) =>
  con(base, (copia) => {
    delete copia[clave];
  });

describe('los motores con contrato', () => {
  it('son los cinco de la Fase 0 y el piloto, y ninguno mas', () => {
    expect([...MOTORES_CON_CONTRATO].sort()).toEqual(
      [
        Motor.CUESTIONARIO_CORTO,
        Motor.ESCRITURA_BREVE,
        Motor.GUIA_PASO_A_PASO,
        Motor.SECUENCIA,
        Motor.TOCAR_EL_OBJETIVO,
      ].sort(),
    );
  });

  it.each(MOTORES.filter((motor) => !MOTORES_CON_CONTRATO.includes(motor)))(
    'el motor %s, que todavia no tiene motor construido, acepta cualquier objeto',
    (motor) => {
      expect(problemaDeLosParametros(motor, {})).toBeUndefined();
      expect(problemaDeLosParametros(motor, { loQueSea: [1, 2, 3] })).toBeUndefined();
    },
  );

  it('una actividad sin motor (las nueve de antes de la Fase 0) acepta cualquier objeto', () => {
    expect(problemaDeLosParametros(null, {})).toBeUndefined();
    expect(problemaDeLosParametros(null, { loQueSea: true })).toBeUndefined();
  });
});

describe('las sesiones de referencia son validas', () => {
  it.each([
    ['cuestionario_corto, 5 opciones de 0 a 4', Motor.CUESTIONARIO_CORTO, cuestionario()],
    [
      'cuestionario_corto, 3 opciones de 0 a 2',
      Motor.CUESTIONARIO_CORTO,
      con(cuestionario(), (c) => {
        c['opciones'] = [
          { valor: 0, texto: 'Nada' },
          { valor: 1, texto: 'Algo' },
          { valor: 2, texto: 'Mucho' },
        ];
      }),
    ],
    ['secuencia de numeros (sin destello)', Motor.SECUENCIA, secuenciaDeNumeros()],
    ['secuencia de colores (con forma y nombre)', Motor.SECUENCIA, secuenciaDeColores()],
    ['tocar_el_objetivo con tiempo', Motor.TOCAR_EL_OBJETIVO, diferencia()],
    [
      'tocar_el_objetivo sin tiempo',
      Motor.TOCAR_EL_OBJETIVO,
      con(diferencia(), (c) => {
        c['segundosPorRonda'] = null;
      }),
    ],
    ['escritura_breve de un campo', Motor.ESCRITURA_BREVE, momentoBueno()],
    [
      'escritura_breve de tres campos, con una basta',
      Motor.ESCRITURA_BREVE,
      con(momentoBueno(), (c) => {
        c['campos'] = 3;
        c['minimo'] = 1;
        c['ideas'] = [];
      }),
    ],
    [
      'escritura_breve minima (solo lo obligatorio)',
      Motor.ESCRITURA_BREVE,
      { invitacion: 'Algo que probaste hoy', campos: 3, largoMaximo: 300 },
    ],
    ['guia_paso_a_paso 4-6', Motor.GUIA_PASO_A_PASO, respiracion()],
    [
      'guia_paso_a_paso 4-4 con pausa de 2 s',
      Motor.GUIA_PASO_A_PASO,
      con(respiracion(), (c) => {
        c['patron'] = { inhalaSegundos: 4, exhalaSegundos: 4, pausaSegundos: 2 };
      }),
    ],
    [
      'guia_paso_a_paso minima (sin ambientacion, frases ni vibracion)',
      Motor.GUIA_PASO_A_PASO,
      {
        advertenciaInicial: 'Puedes parar cuando quieras.',
        patron: { inhalaSegundos: 5, exhalaSegundos: 5, pausaSegundos: 0 },
        duracionSegundos: 60,
      },
    ],
  ])('%s', (_caso, motor, parametros) => {
    expect(problemaDeLosParametros(motor, parametros)).toBeUndefined();
  });
});

describe('cuestionario_corto', () => {
  const M = Motor.CUESTIONARIO_CORTO;

  it.each([
    ['sin indicacion', sin(cuestionario(), 'indicacion'), 'indicacion'],
    [
      'con la indicacion vacia',
      con(cuestionario(), (c) => {
        c['indicacion'] = '   ';
      }),
      'indicacion',
    ],
    [
      'con una indicacion de mas de 200 caracteres',
      con(cuestionario(), (c) => {
        c['indicacion'] = 'a'.repeat(201);
      }),
      'indicacion',
    ],
    ['sin preguntas', sin(cuestionario(), 'preguntas'), 'preguntas'],
    ['sin opciones', sin(cuestionario(), 'opciones'), 'opciones'],
    [
      'con una clave que no es parametro',
      con(cuestionario(), (c) => {
        c['maximo'] = 20;
      }),
      'maximo',
    ],
    [
      'con la lista de preguntas vacia',
      con(cuestionario(), (c) => {
        c['preguntas'] = [];
      }),
      'preguntas',
    ],
    [
      'con 11 preguntas',
      con(cuestionario(), (c) => {
        c['preguntas'] = Array.from({ length: 11 }, (_, i) => ({
          clave: `p${i}`,
          texto: `Texto ${i}`,
        }));
      }),
      'preguntas',
    ],
    [
      'con preguntas que no son una lista',
      con(cuestionario(), (c) => {
        c['preguntas'] = 'una pregunta';
      }),
      'preguntas',
    ],
    [
      'con una pregunta sin texto',
      con(cuestionario(), (c) => {
        (c['preguntas'] as Record<string, unknown>[])[2] = { clave: 'tiempo' };
      }),
      'preguntas[2]',
    ],
    [
      'con una pregunta de texto vacio',
      con(cuestionario(), (c) => {
        (c['preguntas'] as { texto: string }[])[0]!.texto = '   ';
      }),
      'preguntas[0].texto',
    ],
    [
      'con una pregunta de mas de 200 caracteres',
      con(cuestionario(), (c) => {
        (c['preguntas'] as { texto: string }[])[0]!.texto = 'a'.repeat(201);
      }),
      'preguntas[0].texto',
    ],
    [
      'con una clave de pregunta repetida',
      con(cuestionario(), (c) => {
        (c['preguntas'] as { clave: string }[])[1]!.clave = 'agobio';
      }),
      'agobio',
    ],
    [
      'con una pregunta con una clave de mas',
      con(cuestionario(), (c) => {
        (c['preguntas'] as Record<string, unknown>[])[0]!['peso'] = 2;
      }),
      'peso',
    ],
    [
      'con una sola opcion',
      con(cuestionario(), (c) => {
        c['opciones'] = [{ valor: 0, texto: 'Nada' }];
      }),
      'opciones',
    ],
    [
      'con 8 opciones',
      con(cuestionario(), (c) => {
        c['opciones'] = Array.from({ length: 8 }, (_, i) => ({ valor: i, texto: `Opción ${i}` }));
      }),
      'opciones',
    ],
    [
      'con un valor repetido',
      con(cuestionario(), (c) => {
        (c['opciones'] as { valor: number }[])[1]!.valor = 0;
      }),
      'valor',
    ],
    [
      'con un valor negativo',
      con(cuestionario(), (c) => {
        (c['opciones'] as { valor: number }[])[0]!.valor = -1;
      }),
      'opciones[0].valor',
    ],
    [
      'con un valor decimal',
      con(cuestionario(), (c) => {
        (c['opciones'] as { valor: number }[])[0]!.valor = 0.5;
      }),
      'opciones[0].valor',
    ],
    [
      'con un valor de mas de 10',
      con(cuestionario(), (c) => {
        (c['opciones'] as { valor: number }[])[4]!.valor = 11;
      }),
      'opciones[4].valor',
    ],
    [
      'con dos opciones con el mismo texto',
      con(cuestionario(), (c) => {
        (c['opciones'] as { texto: string }[])[1]!.texto = ' nada ';
      }),
      'texto',
    ],
    [
      'con una opcion de mas de 40 caracteres',
      con(cuestionario(), (c) => {
        (c['opciones'] as { texto: string }[])[2]!.texto = 'a'.repeat(41);
      }),
      'opciones[2].texto',
    ],
  ])('rechaza %s', (_caso, parametros, nombra) => {
    rechazaCon(M, parametros, nombra);
  });

  it('la clave de una pregunta admite hasta 40 caracteres y no mas', () => {
    const conLargo = (n: number) =>
      con(cuestionario(), (c) => {
        (c['preguntas'] as { clave: string }[])[0]!.clave = 'a'.repeat(n);
      });

    expect(problemaDeLosParametros(M, conLargo(40))).toBeUndefined();
    rechazaCon(M, conLargo(41), 'preguntas[0].clave');
  });

  it('acepta el borde: 10 preguntas, 7 opciones y textos de exactamente el largo maximo', () => {
    const borde = con(cuestionario(), (c) => {
      c['indicacion'] = 'a'.repeat(200);
      c['preguntas'] = Array.from({ length: 10 }, (_, i) => ({
        clave: `p${i}`,
        texto: 'a'.repeat(200),
      }));
      c['opciones'] = Array.from({ length: 7 }, (_, i) => ({
        valor: i === 6 ? 10 : i,
        texto: `${'b'.repeat(39)}${i}`,
      }));
    });

    expect(problemaDeLosParametros(M, borde)).toBeUndefined();
  });
});

describe('secuencia', () => {
  const M = Motor.SECUENCIA;

  it.each([
    ['sin casillas', sin(secuenciaDeNumeros(), 'casillas'), 'casillas'],
    ['sin largoInicial', sin(secuenciaDeNumeros(), 'largoInicial'), 'largoInicial'],
    ['sin rondas', sin(secuenciaDeNumeros(), 'rondas'), 'rondas'],
    ['sin msPorElemento', sin(secuenciaDeNumeros(), 'msPorElemento'), 'msPorElemento'],
    ['sin msDeMargen', sin(secuenciaDeNumeros(), 'msDeMargen'), 'msDeMargen'],
    [
      'con un parametro que no existe',
      con(secuenciaDeNumeros(), (c) => {
        c['rondaz'] = 12;
      }),
      'rondaz',
    ],
    [
      'con una sola casilla',
      con(secuenciaDeNumeros(), (c) => {
        c['casillas'] = [{ clave: '0', nombre: '0' }];
      }),
      'casillas',
    ],
    [
      'con 13 casillas',
      con(secuenciaDeNumeros(), (c) => {
        c['casillas'] = Array.from({ length: 13 }, (_, i) => ({ clave: `c${i}`, nombre: `n${i}` }));
      }),
      'casillas',
    ],
    [
      'con una clave de casilla repetida',
      con(secuenciaDeNumeros(), (c) => {
        (c['casillas'] as { clave: string }[])[1]!.clave = '0';
      }),
      'clave',
    ],
    [
      'con un nombre de casilla repetido',
      con(secuenciaDeNumeros(), (c) => {
        (c['casillas'] as { nombre: string }[])[1]!.nombre = '0';
      }),
      'nombre',
    ],
    [
      'con una casilla sin nombre',
      con(secuenciaDeNumeros(), (c) => {
        (c['casillas'] as Record<string, unknown>[])[3] = { clave: '3' };
      }),
      'casillas[3]',
    ],
    [
      'con un nombre vacio',
      con(secuenciaDeNumeros(), (c) => {
        (c['casillas'] as { nombre: string }[])[0]!.nombre = '';
      }),
      'casillas[0].nombre',
    ],
    [
      'con una casilla solo de color (sin forma): el color no puede ser la unica pista',
      con(secuenciaDeColores(), (c) => {
        delete (c['casillas'] as Record<string, unknown>[])[2]!['forma'];
      }),
      'casillas[2]',
    ],
    [
      'con largoInicial 0',
      con(secuenciaDeNumeros(), (c) => {
        c['largoInicial'] = 0;
      }),
      'largoInicial',
    ],
    [
      'con largoInicial 11',
      con(secuenciaDeNumeros(), (c) => {
        c['largoInicial'] = 11;
      }),
      'largoInicial',
    ],
    [
      'con largoInicial decimal',
      con(secuenciaDeNumeros(), (c) => {
        c['largoInicial'] = 3.5;
      }),
      'largoInicial',
    ],
    [
      'con 0 rondas',
      con(secuenciaDeNumeros(), (c) => {
        c['rondas'] = 0;
      }),
      'rondas',
    ],
    [
      'con 51 rondas',
      con(secuenciaDeNumeros(), (c) => {
        c['rondas'] = 51;
      }),
      'rondas',
    ],
    [
      'con msPorElemento de 199',
      con(secuenciaDeNumeros(), (c) => {
        c['msPorElemento'] = 199;
      }),
      'msPorElemento',
    ],
    [
      'con msPorElemento de 5001',
      con(secuenciaDeNumeros(), (c) => {
        c['msPorElemento'] = 5001;
      }),
      'msPorElemento',
    ],
    [
      'con msDeMargen negativo',
      con(secuenciaDeNumeros(), (c) => {
        c['msDeMargen'] = -1;
      }),
      'msDeMargen',
    ],
    [
      'con msDeMargen de 10001',
      con(secuenciaDeNumeros(), (c) => {
        c['msDeMargen'] = 10001;
      }),
      'msDeMargen',
    ],
    [
      'con un destello de 599 ms (baranda de accesibilidad R10)',
      con(secuenciaDeColores(), (c) => {
        c['msDestello'] = 599;
      }),
      'msDestello',
    ],
    [
      'con un destello de 5001 ms',
      con(secuenciaDeColores(), (c) => {
        c['msDestello'] = 5001;
      }),
      'msDestello',
    ],
    [
      'con un destello de 1 ms mas que el turno de la casilla (701 de 700)',
      con(secuenciaDeColores(), (c) => {
        c['msDestello'] = 701;
      }),
      'msDestello',
    ],
    [
      'con un destello que no cabe en el turno (1100 ms de destello, 1000 de turno)',
      con(secuenciaDeColores(), (c) => {
        c['msPorElemento'] = 1000;
        c['msDestello'] = 1100;
      }),
      'msDestello',
    ],
    [
      'con un turno por debajo del destello minimo (500 ms de turno, 600 de destello)',
      con(secuenciaDeColores(), (c) => {
        c['msPorElemento'] = 500;
        c['msDestello'] = 600;
      }),
      'msDestello',
    ],
  ])('rechaza %s', (_caso, parametros, nombra) => {
    rechazaCon(M, parametros, nombra);
  });

  it.each([
    ['un destello de exactamente 600 ms', 'msDestello', 600],
    ['msPorElemento de exactamente 5000', 'msPorElemento', 5000],
    ['msDeMargen de 0', 'msDeMargen', 0],
    ['msDeMargen de exactamente 10000', 'msDeMargen', 10000],
    ['largoInicial de 1', 'largoInicial', 1],
    ['largoInicial de 10', 'largoInicial', 10],
    ['1 ronda', 'rondas', 1],
    ['50 rondas', 'rondas', 50],
  ])('acepta %s', (_caso, campo, valor) => {
    const parametros = con(secuenciaDeColores(), (c) => {
      c[campo] = valor;
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });

  it('acepta un destello igual al turno de la casilla: no queda pausa entre una y otra', () => {
    const parametros = con(secuenciaDeColores(), (c) => {
      c['msPorElemento'] = 1000;
      c['msDestello'] = 1000;
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });

  it('acepta la sesion lenta del piloto: 1100 ms iluminada y 600 ms de pausa', () => {
    const parametros = con(secuenciaDeColores(), (c) => {
      c['msPorElemento'] = 1700;
      c['msDestello'] = 1100;
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });

  it('sin destello, el turno puede ser tan corto como 200 ms (la secuencia de numeros)', () => {
    const parametros = con(secuenciaDeNumeros(), (c) => {
      c['msPorElemento'] = 200;
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });

  it('el mensaje del destello que no cabe dice cuanto era cada uno', () => {
    const problema = problemaDeLosParametros(
      M,
      con(secuenciaDeColores(), (c) => {
        c['msPorElemento'] = 1000;
        c['msDestello'] = 1100;
      }),
    );

    expect(problema).toContain('1100');
    expect(problema).toContain('1000');
    expect(problema).toContain('msPorElemento');
    expect(problema).not.toMatch(/\.$/u);
    expect(problema).not.toContain('\n');
  });

  it.each([
    ['la clave de una casilla', 'clave', 20],
    ['el nombre de una casilla', 'nombre', 40],
    ['la forma de una casilla', 'forma', 20],
    ['el color de una casilla', 'color', 20],
  ])('%s admite hasta %i caracteres y no mas', (_que, campo, largo) => {
    const conLargo = (n: number) =>
      con(secuenciaDeColores(), (c) => {
        (c['casillas'] as Record<string, unknown>[])[0]![campo] = 'a'.repeat(n);
      });

    expect(problemaDeLosParametros(M, conLargo(largo))).toBeUndefined();
    rechazaCon(M, conLargo(largo + 1), `casillas[0].${campo}`);
  });

  it('acepta 2 y 12 casillas', () => {
    const casillas = (n: number) =>
      con(secuenciaDeNumeros(), (c) => {
        c['casillas'] = Array.from({ length: n }, (_, i) => ({ clave: `c${i}`, nombre: `n${i}` }));
      });

    expect(problemaDeLosParametros(M, casillas(2))).toBeUndefined();
    expect(problemaDeLosParametros(M, casillas(12))).toBeUndefined();
  });
});

describe('tocar_el_objetivo', () => {
  const M = Motor.TOCAR_EL_OBJETIVO;

  it.each([
    ['sin rondas', sin(diferencia(), 'rondas'), 'rondas'],
    [
      'sin segundosPorRonda (hay que decir null si no hay tiempo)',
      sin(diferencia(), 'segundosPorRonda'),
      'segundosPorRonda',
    ],
    ['sin lados', sin(diferencia(), 'lados'), 'lados'],
    [
      'con un parametro que no existe',
      con(diferencia(), (c) => {
        c['tiempo'] = 15;
      }),
      'tiempo',
    ],
    [
      'con 0 rondas',
      con(diferencia(), (c) => {
        c['rondas'] = 0;
      }),
      'rondas',
    ],
    [
      'con 61 rondas',
      con(diferencia(), (c) => {
        c['rondas'] = 61;
      }),
      'rondas',
    ],
    [
      'con rondas decimales',
      con(diferencia(), (c) => {
        c['rondas'] = 7.5;
      }),
      'rondas',
    ],
    [
      'con 2 segundos por ronda',
      con(diferencia(), (c) => {
        c['segundosPorRonda'] = 2;
      }),
      'segundosPorRonda',
    ],
    [
      'con 121 segundos por ronda',
      con(diferencia(), (c) => {
        c['segundosPorRonda'] = 121;
      }),
      'segundosPorRonda',
    ],
    [
      'con segundosPorRonda como texto',
      con(diferencia(), (c) => {
        c['segundosPorRonda'] = '15';
      }),
      'segundosPorRonda',
    ],
    [
      'con lados vacios',
      con(diferencia(), (c) => {
        c['lados'] = [];
      }),
      'lados',
    ],
    [
      'con 7 lados',
      con(diferencia(), (c) => {
        c['lados'] = [2, 3, 4, 5, 6, 7, 8];
      }),
      'lados',
    ],
    [
      'con un lado de 1',
      con(diferencia(), (c) => {
        c['lados'] = [1, 3, 4];
      }),
      'lados[0]',
    ],
    [
      'con un lado de 9',
      con(diferencia(), (c) => {
        c['lados'] = [3, 4, 9];
      }),
      'lados[2]',
    ],
    [
      'con lados repetidos',
      con(diferencia(), (c) => {
        c['lados'] = [3, 3, 4];
      }),
      'lados',
    ],
    [
      'con lados que no crecen',
      con(diferencia(), (c) => {
        c['lados'] = [5, 4, 3];
      }),
      'lados',
    ],
    [
      'con menos rondas que lados (algun tamano no se jugaria nunca)',
      con(diferencia(), (c) => {
        c['rondas'] = 2;
      }),
      'rondas',
    ],
  ])('rechaza %s', (_caso, parametros, nombra) => {
    rechazaCon(M, parametros, nombra);
  });

  it.each([
    ['rondas 1 con un solo lado', { rondas: 1, lados: [3] }],
    ['rondas 60', { rondas: 60 }],
    ['rondas igual al numero de lados', { rondas: 3 }],
    ['3 segundos por ronda', { segundosPorRonda: 3 }],
    ['120 segundos por ronda', { segundosPorRonda: 120 }],
    ['lados de 2 a 8', { lados: [2, 3, 4, 5, 6, 8], rondas: 12 }],
  ])('acepta %s', (_caso, cambios) => {
    const parametros = con(diferencia(), (c) => {
      Object.assign(c, cambios);
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });
});

describe('escritura_breve', () => {
  const M = Motor.ESCRITURA_BREVE;

  it.each([
    ['sin invitacion', sin(momentoBueno(), 'invitacion'), 'invitacion'],
    ['sin campos', sin(momentoBueno(), 'campos'), 'campos'],
    ['sin largoMaximo', sin(momentoBueno(), 'largoMaximo'), 'largoMaximo'],
    [
      'con un parametro que no existe',
      con(momentoBueno(), (c) => {
        c['color'] = 'azul';
      }),
      'color',
    ],
    [
      'con la invitacion vacia',
      con(momentoBueno(), (c) => {
        c['invitacion'] = '  ';
      }),
      'invitacion',
    ],
    [
      'con una invitacion de mas de 200 caracteres',
      con(momentoBueno(), (c) => {
        c['invitacion'] = 'a'.repeat(201);
      }),
      'invitacion',
    ],
    [
      'con 0 campos',
      con(momentoBueno(), (c) => {
        c['campos'] = 0;
      }),
      'campos',
    ],
    [
      'con 0 campos y minimo 0 (el rango de los campos se comprueba por su cuenta)',
      con(momentoBueno(), (c) => {
        c['campos'] = 0;
        c['minimo'] = 0;
      }),
      'campos',
    ],
    [
      'con 6 campos',
      con(momentoBueno(), (c) => {
        c['campos'] = 6;
      }),
      'campos',
    ],
    [
      'con largoMaximo de 49',
      con(momentoBueno(), (c) => {
        c['largoMaximo'] = 49;
      }),
      'largoMaximo',
    ],
    [
      'con largoMaximo de 1001',
      con(momentoBueno(), (c) => {
        c['largoMaximo'] = 1001;
      }),
      'largoMaximo',
    ],
    [
      'con minimo negativo',
      con(momentoBueno(), (c) => {
        c['minimo'] = -1;
      }),
      'minimo',
    ],
    [
      'con minimo mayor que los campos',
      con(momentoBueno(), (c) => {
        c['minimo'] = 2;
      }),
      'minimo',
    ],
    [
      'con minimo 0: la pantalla pide al menos una respuesta (para un dia sin nada esta «hoy no me sale ninguna»)',
      con(momentoBueno(), (c) => {
        c['campos'] = 3;
        c['minimo'] = 0;
      }),
      'minimo',
    ],
    [
      'con minimo decimal',
      con(momentoBueno(), (c) => {
        c['campos'] = 3;
        c['minimo'] = 1.5;
      }),
      'minimo',
    ],
    [
      'con permiteNingunaHoy como texto',
      con(momentoBueno(), (c) => {
        c['permiteNingunaHoy'] = 'si';
      }),
      'permiteNingunaHoy',
    ],
    [
      'con ideas que no son una lista',
      con(momentoBueno(), (c) => {
        c['ideas'] = 'un cafe';
      }),
      'ideas',
    ],
    [
      'con mas de 10 ideas',
      con(momentoBueno(), (c) => {
        c['ideas'] = Array.from({ length: 11 }, (_, i) => `Idea ${i}`);
      }),
      'ideas',
    ],
    [
      'con una idea vacia',
      con(momentoBueno(), (c) => {
        (c['ideas'] as string[])[1] = '';
      }),
      'ideas[1]',
    ],
    [
      'con una idea de mas de 80 caracteres',
      con(momentoBueno(), (c) => {
        (c['ideas'] as string[])[0] = 'a'.repeat(81);
      }),
      'ideas[0]',
    ],
    [
      'con una idea repetida',
      con(momentoBueno(), (c) => {
        (c['ideas'] as string[])[1] = ' un café a buena hora ';
      }),
      'ideas',
    ],
  ])('rechaza %s', (_caso, parametros, nombra) => {
    rechazaCon(M, parametros, nombra);
  });

  it.each([
    ['campos 5', { campos: 5 }],
    ['campos 3 con minimo 3', { campos: 3, minimo: 3 }],
    ['campos 5 con minimo 5', { campos: 5, minimo: 5 }],
    ['campos 3 con una basta (minimo 1)', { campos: 3, minimo: 1 }],
    ['largoMaximo 50', { largoMaximo: 50 }],
    ['largoMaximo 1000', { largoMaximo: 1000 }],
    ['una invitacion de exactamente 200 caracteres', { invitacion: 'a'.repeat(200) }],
    ['10 ideas', { ideas: Array.from({ length: 10 }, (_, i) => `Idea ${i}`) }],
    ['una idea de exactamente 80 caracteres', { ideas: ['a'.repeat(80)] }],
    ['permiteNingunaHoy falso', { permiteNingunaHoy: false }],
  ])('acepta %s', (_caso, cambios) => {
    const parametros = con(momentoBueno(), (c) => {
      Object.assign(c, cambios);
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });
});

describe('guia_paso_a_paso', () => {
  const M = Motor.GUIA_PASO_A_PASO;

  /** La respiracion de referencia con `patron` cambiado en un campo. */
  const patron = (cambios: Record<string, unknown>) =>
    con(respiracion(), (c) => {
      c['patron'] = { ...(c['patron'] as object), ...cambios };
    });

  it.each([
    [
      'sin la advertencia inicial: tiene que estar a la vista antes de empezar',
      sin(respiracion(), 'advertenciaInicial'),
      'advertenciaInicial',
    ],
    ['sin patron', sin(respiracion(), 'patron'), 'patron'],
    ['sin duracion', sin(respiracion(), 'duracionSegundos'), 'duracionSegundos'],
    [
      'con un parametro que no existe',
      con(respiracion(), (c) => {
        c['ritmo'] = 'rapido';
      }),
      'ritmo',
    ],
    [
      'con la advertencia vacia',
      con(respiracion(), (c) => {
        c['advertenciaInicial'] = ' ';
      }),
      'advertenciaInicial',
    ],
    [
      'con una advertencia de mas de 300 caracteres',
      con(respiracion(), (c) => {
        c['advertenciaInicial'] = 'a'.repeat(301);
      }),
      'advertenciaInicial',
    ],
    [
      'con un patron que no es un objeto',
      con(respiracion(), (c) => {
        c['patron'] = '4-6';
      }),
      'patron debe ser un objeto',
    ],
    [
      'con un patron que es una lista y no un objeto',
      con(respiracion(), (c) => {
        c['patron'] = [4, 6, 0];
      }),
      'patron debe ser un objeto',
    ],
    [
      'con un patron sin inhalacion',
      con(respiracion(), (c) => {
        delete (c['patron'] as Record<string, unknown>)['inhalaSegundos'];
      }),
      'patron.inhalaSegundos',
    ],
    [
      'con un patron sin exhalacion',
      con(respiracion(), (c) => {
        delete (c['patron'] as Record<string, unknown>)['exhalaSegundos'];
      }),
      'patron.exhalaSegundos',
    ],
    [
      'con un patron sin pausa (hay que decir 0 si no hay)',
      con(respiracion(), (c) => {
        delete (c['patron'] as Record<string, unknown>)['pausaSegundos'];
      }),
      'patron.pausaSegundos',
    ],
    ['con un campo de mas en el patron', patron({ retencionSegundos: 7 }), 'retencionSegundos'],
    [
      'con una pausa de 5 s: ninguna retencion de mas de 4 s',
      patron({ pausaSegundos: 5 }),
      'patron.pausaSegundos',
    ],
    ['con una pausa negativa', patron({ pausaSegundos: -1 }), 'patron.pausaSegundos'],
    ['con una pausa decimal', patron({ pausaSegundos: 1.5 }), 'patron.pausaSegundos'],
    ['con una inhalacion de 2 s', patron({ inhalaSegundos: 2 }), 'patron.inhalaSegundos'],
    ['con una inhalacion de 9 s', patron({ inhalaSegundos: 9 }), 'patron.inhalaSegundos'],
    ['con una exhalacion de 2 s', patron({ exhalaSegundos: 2 }), 'patron.exhalaSegundos'],
    ['con una exhalacion de 11 s', patron({ exhalaSegundos: 11 }), 'patron.exhalaSegundos'],
    [
      'con una duracion de 59 s',
      con(respiracion(), (c) => {
        c['duracionSegundos'] = 59;
      }),
      'duracionSegundos',
    ],
    [
      'con una duracion de 601 s',
      con(respiracion(), (c) => {
        c['duracionSegundos'] = 601;
      }),
      'duracionSegundos',
    ],
    [
      'con una duracion decimal',
      con(respiracion(), (c) => {
        c['duracionSegundos'] = 90.5;
      }),
      'duracionSegundos',
    ],
    [
      'con una ambientacion vacia',
      con(respiracion(), (c) => {
        c['ambientacion'] = '';
      }),
      'ambientacion',
    ],
    [
      'con una ambientacion de mas de 40 caracteres',
      con(respiracion(), (c) => {
        c['ambientacion'] = 'a'.repeat(41);
      }),
      'ambientacion',
    ],
    [
      'con frases que no son una lista',
      con(respiracion(), (c) => {
        c['frases'] = 'Sin prisa.';
      }),
      'frases',
    ],
    [
      'con mas de 40 frases',
      con(respiracion(), (c) => {
        c['frases'] = Array.from({ length: 41 }, (_, i) => `Frase ${i}`);
      }),
      'frases',
    ],
    [
      'con una frase vacia',
      con(respiracion(), (c) => {
        (c['frases'] as string[])[0] = '';
      }),
      'frases[0]',
    ],
    [
      'con una frase de mas de 120 caracteres',
      con(respiracion(), (c) => {
        (c['frases'] as string[])[1] = 'a'.repeat(121);
      }),
      'frases[1]',
    ],
    [
      'con una frase repetida',
      con(respiracion(), (c) => {
        (c['frases'] as string[])[1] = ' sin prisa. ';
      }),
      'frases',
    ],
    [
      'con haptico como texto',
      con(respiracion(), (c) => {
        c['haptico'] = 'si';
      }),
      'haptico',
    ],
  ])('rechaza %s', (_caso, parametros, nombra) => {
    rechazaCon(M, parametros, nombra);
  });

  it.each([
    ['una pausa de exactamente 4 s', { pausaSegundos: 4 }],
    ['una pausa de 0 s', { pausaSegundos: 0 }],
    [
      'la respiracion mas rapida que cabe (3 s y 3 s: 10 respiraciones por minuto)',
      { inhalaSegundos: 3, exhalaSegundos: 3 },
    ],
    ['una inhalacion de 8 s', { inhalaSegundos: 8 }],
    ['una exhalacion de 10 s', { exhalaSegundos: 10 }],
  ])('acepta %s', (_caso, cambios) => {
    const parametros = con(respiracion(), (c) => {
      c['patron'] = { ...(c['patron'] as object), ...cambios };
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });

  it.each([
    ['60 s', 60],
    ['600 s', 600],
  ])('acepta una duracion de %s', (_caso, duracionSegundos) => {
    const parametros = con(respiracion(), (c) => {
      c['duracionSegundos'] = duracionSegundos;
    });

    expect(problemaDeLosParametros(M, parametros)).toBeUndefined();
  });
});

describe('el mensaje', () => {
  it('nombra el campo con su ruta completa, para que quien carga el contenido sepa donde mirar', () => {
    const parametros = con(cuestionario(), (c) => {
      (c['opciones'] as { valor: number }[])[3]!.valor = -2;
    });

    expect(problemaDeLosParametros(Motor.CUESTIONARIO_CORTO, parametros)).toMatch(
      /^opciones\[3\]\.valor /u,
    );
  });

  it('no termina en punto: el error de dominio lo agrega al armar la frase', () => {
    const problema = problemaDeLosParametros(Motor.SECUENCIA, {});

    expect(problema).toBeDefined();
    expect(problema).not.toMatch(/\.$/u);
  });

  it('informa del primer problema y no de todos a la vez', () => {
    const problema = problemaDeLosParametros(Motor.SECUENCIA, {});

    expect(typeof problema).toBe('string');
    expect((problema ?? '').split('\n')).toHaveLength(1);
  });
});
