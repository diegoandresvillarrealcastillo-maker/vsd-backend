import { describe, expect, it } from 'vitest';
import { EXPRESIONES_DE_RIESGO, hayRiesgo, normalizar } from './SenalesDeRiesgo.js';

/**
 * La deteccion de senales de riesgo.
 *
 * De todo lo que hay en este repositorio, esto es lo que peor puede salir. Un
 * fallo aqui no rompe nada, no sale en ningun registro y no lo nota nadie:
 * simplemente alguien escribio algo grave y la aplicacion respondio como si
 * hubiera preguntado por el clima.
 *
 * De ahi que haya una prueba por cada expresion de la lista, y no una prueba
 * con tres ejemplos.
 */
describe('el riesgo con erratas (SCRUM-193): la tolerancia amplia la lista, no la debilita', () => {
  it.each([
    'kiero morirme',
    'quiero morirne',
    'quiero mrirme',
    'me kiero matar',
    'a veces pienso en suisidarme',
    'quiero suicdarme',
    'no aguanto mass',
    'KIERO MORIRME',
    'quiero morirmeee',
    'quiero  morirme',
    'hola, kiero morirme',
  ])('«%s» sigue siendo una senal de riesgo', (texto) => {
    expect(hayRiesgo(texto)).toBe(true);
  });

  it.each(EXPRESIONES_DE_RIESGO)(
    'lo que ya se detectaba se sigue detectando: «%s»',
    (expresion) => {
      expect(hayRiesgo(expresion)).toBe(true);
      expect(hayRiesgo(`hola, ${expresion}, gracias`)).toBe(true);
    },
  );

  it.each([
    'mi abuela no aguanta mas',
    'ya no puede mas con el trabajo',
    'quiere morir de la risa',
    'tanto tiempo sin verte',
    'esto es normal',
    'quiero comer',
    'voy a casa',
    'todo bien por aqui',
  ])(
    '«%s» no dispara por una errata: lo que cambia es de quien se habla, y no se corrige',
    (texto) => {
      expect(hayRiesgo(texto)).toBe(false);
    },
  );
});

describe('el riesgo con caracteres invisibles (SCRUM-258): lo que no se ve no esconde lo que se dice', () => {
  const INVISIBLES = [
    ['U+00AD', '\u{AD}'],
    ['U+200B', '\u{200B}'],
    ['U+200C', '\u{200C}'],
    ['U+200D', '\u{200D}'],
    ['U+200E', '\u{200E}'],
    ['U+2060', '\u{2060}'],
    ['U+FEFF', '\u{FEFF}'],
  ] as const;

  it.each(EXPRESIONES_DE_RIESGO)(
    '«%s» se detecta con un invisible entre cada caracter',
    (expresion) => {
      expect(hayRiesgo([...expresion].join('\u{200B}'))).toBe(true);
    },
  );

  it.each(INVISIBLES)(
    'el invisible %s en medio de la palabra no la esconde',
    (_codigo, invisible) => {
      expect(hayRiesgo(`quiero mo${invisible}rirme`)).toBe(true);
      expect(hayRiesgo(`quiero${invisible} morirme`)).toBe(true);
    },
  );

  it.each(INVISIBLES)(
    'el invisible %s usado como separador, sin espacio, tampoco',
    (_codigo, invisible) => {
      expect(hayRiesgo(`quiero${invisible}morirme`)).toBe(true);
    },
  );

  it('con una errata y un invisible a la vez', () => {
    expect(hayRiesgo('kiero mo\u{200B}rirme')).toBe(true);
    expect(hayRiesgo('me kie\u{AD}ro matar')).toBe(true);
    // El invisible hace de espacio entre dos palabras y una de ellas lleva la errata (SCRUM-318).
    expect(hayRiesgo('kiero\u{200B}morirme')).toBe(true);
    expect(hayRiesgo('a veces\u{200B}suisidarme')).toBe(true);
  });

  it('con letras de ancho completo', () => {
    expect(hayRiesgo('ｑｕｉｅｒｏ ｍｏｒｉｒｍｅ')).toBe(true);
  });

  it('un texto sin riesgo no empieza a dispararlo por llevar invisibles', () => {
    expect(hayRiesgo('hola\u{200B} buenas\u{AD}tardes\u{FEFF}')).toBe(false);
    expect(hayRiesgo('\u{200B}\u{200C}\u{200D}')).toBe(false);
  });
});

describe('el riesgo con invisibles dentro y entre palabras a la vez (SCRUM-318)', () => {
  const ROTATIVOS = ['\u{200B}', '\u{AD}', '\u{200D}', '\u{2060}', '\u{FEFF}', '\u{200E}'];

  /**
   * La expresion con un invisible en cada hueco, de los dos tipos a la vez: uno tras la segunda
   * letra de cada palabra (escondido dentro de ella) y otro en lugar de cada espacio.
   */
  function mezclada(expresion: string, invisibles: readonly string[]): string {
    let n = 0;
    const siguiente = () => invisibles[n++ % invisibles.length] ?? '';

    return expresion
      .split(' ')
      .map((palabra) =>
        palabra.length > 2 ? `${palabra.slice(0, 2)}${siguiente()}${palabra.slice(2)}` : palabra,
      )
      .join(siguiente());
  }

  it('el caso de la auditoria: uno entre las palabras y otro dentro de la segunda', () => {
    expect(hayRiesgo('quiero​mo​rir')).toBe(true);
  });

  it.each(EXPRESIONES_DE_RIESGO)('«%s» se detecta mezclando los dos usos', (expresion) => {
    expect(hayRiesgo(mezclada(expresion, ['\u{200B}']))).toBe(true);
    expect(hayRiesgo(mezclada(expresion, ROTATIVOS))).toBe(true);
    expect(hayRiesgo(`hoy fue largo y ${mezclada(expresion, ROTATIVOS)} gracias`)).toBe(true);
  });

  it.each(EXPRESIONES_DE_RIESGO)(
    '«%s» se detecta con un invisible en cada hueco y alrededor de cada espacio',
    (expresion) => {
      const entreTodo = [...expresion].map((c) => (c === ' ' ? '\u{200B} \u{200D}' : c));

      expect(hayRiesgo(entreTodo.join('\u{200B}'))).toBe(true);
      expect(hayRiesgo(entreTodo.join('\u{AD}\u{200B}'))).toBe(true);
    },
  );

  it.each(EXPRESIONES_DE_RIESGO.filter((expresion) => expresion.split(' ').length >= 3))(
    '«%s» se detecta alternando espacios de verdad e invisibles entre las palabras',
    (expresion) => {
      // Con un espacio real en medio, ni quitar todos los invisibles ni leerlos todos como espacio
      // alcanza: hace falta decidir en cada hueco.
      let n = 0;
      const separador = () => (n++ % 2 === 0 ? '\u{200B}' : ' ');
      const texto = expresion
        .split(' ')
        .map((palabra) => `${palabra.slice(0, 2)}\u{200D}${palabra.slice(2)}`)
        .reduce((junto, palabra) => `${junto}${separador()}${palabra}`);

      expect(hayRiesgo(texto)).toBe(true);
    },
  );

  it('un invisible junto a un espacio de verdad tampoco separa de mas', () => {
    expect(hayRiesgo('quiero \u{200B}mo\u{200B}rir')).toBe(true);
    expect(hayRiesgo('quiero\u{200B} mo\u{200B}rir')).toBe(true);
    expect(hayRiesgo('qui\u{200B}ero\u{200B}\u{200B}\u{200D}morir')).toBe(true);
  });

  it.each([
    'hola\u{200B} bue\u{200B}nas tar\u{AD}des',
    'quiero\u{200B}comer',
    'quiero\u{200B}comer\u{200B}morir',
    'mo\u{200B}rir de risa',
    'no\u{200B}vale\u{200B}la\u{200B}pena',
    'quie\u{200B}ro un ca\u{200B}fe',
    'hoy me\u{200B} sentí\u{200B}bien',
  ])('«%s» no dispara por llevar invisibles mezclados', (texto) => {
    expect(hayRiesgo(texto)).toBe(false);
  });

  it('sin ningun separador entre las palabras no se inventa la expresion', () => {
    // Las palabras de la expresion tienen que estar separadas por algo: un espacio o un invisible.
    expect(hayRiesgo('hacerme\u{200B}dano')).toBe(true);
    expect(hayRiesgo('hacermedano')).toBe(false);
    expect(hayRiesgo('quieromorir')).toBe(false);
  });

  it('un texto largo de puros invisibles se resuelve sin variantes exponenciales', () => {
    const relleno = '\u{200B}'.repeat(20_000);

    expect(hayRiesgo(`quiero${relleno}x${relleno}morir`)).toBe(false);
    expect(hayRiesgo(`quiero${relleno}mo${relleno}rir`)).toBe(true);
    expect(hayRiesgo('quiero\u{200B}'.repeat(5_000))).toBe(false);
  });
});

describe('Senales de riesgo', () => {
  describe('normalizar', () => {
    it('quita las tildes', () => {
      // Nadie escribe con tildes cuando esta mal. Si la comparacion las
      // exigiera, la mitad de la lista no serviria para nada.
      expect(normalizar('Quiero morír')).toBe('quiero morir');
    });

    it('pasa a minusculas y recorta los espacios de sobra', () => {
      expect(normalizar('  YA   NO   PUEDO  MAS  ')).toBe('ya no puedo mas');
    });
  });

  describe('cada expresion de la lista se reconoce', () => {
    // Una por una, a proposito. Si alguien anade una expresion nueva y se
    // equivoca al escribirla, esta prueba lo dice; una prueba con tres
    // ejemplos representativos no.
    it.each(EXPRESIONES_DE_RIESGO)('reconoce "%s"', (expresion) => {
      expect(hayRiesgo(expresion)).toBe(true);
    });

    it.each(EXPRESIONES_DE_RIESGO)('reconoce "%s" dentro de una frase', (expresion) => {
      expect(hayRiesgo(`hoy fue un dia horrible y la verdad ${expresion} ya no se que hacer`)).toBe(
        true,
      );
    });

    it.each(EXPRESIONES_DE_RIESGO)('reconoce "%s" escrito en mayusculas', (expresion) => {
      expect(hayRiesgo(expresion.toUpperCase())).toBe(true);
    });
  });

  describe('lo que no dispara', () => {
    it.each([
      'me fue bien en la actividad de memoria',
      'quiero mejorar mi rutina de descanso',
      'como interpreto mi nivel',
      'gracias por la ayuda',
      '',
    ])('no ve riesgo en "%s"', (texto) => {
      expect(hayRiesgo(texto)).toBe(false);
    });
  });

  it('prefiere equivocarse de mas: "no quiero morirme" tambien dispara', () => {
    // Es un falso positivo y se deja a proposito. Interpretar negaciones
    // significaria decidir cuando NO mostrar los telefonos, y esa decision no
    // la queremos tomar con una regla de texto.
    //
    // El coste de equivocarse por exceso es una pantalla que alguien ignora.
    // El de equivocarse por defecto no tiene arreglo.
    expect(hayRiesgo('no quiero morirme, solo estoy cansado')).toBe(true);
  });

  it('la lista no esta vacia', () => {
    // Suena tonto hasta el dia que alguien la vacia para depurar algo y se le
    // olvida devolverla. Nada mas fallaria.
    expect(EXPRESIONES_DE_RIESGO.length).toBeGreaterThan(15);
  });

  it('todas las expresiones estan ya normalizadas', () => {
    // Si alguien anade "Quiero Morír" con tilde y mayuscula, no coincidiria
    // nunca, porque lo que se compara ya viene normalizado. El fallo seria
    // invisible: la expresion esta en la lista y aun asi no se reconoce.
    for (const expresion of EXPRESIONES_DE_RIESGO) {
      expect(normalizar(expresion)).toBe(expresion);
    }
  });
});
