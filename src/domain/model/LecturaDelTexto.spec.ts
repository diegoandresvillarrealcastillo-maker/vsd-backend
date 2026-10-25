import { describe, expect, it } from 'vitest';
import {
  ERRATAS_FRECUENTES,
  corregirPalabras,
  distanciaDeEdicion,
  normalizar,
  palabrasDe,
  vocabularioDe,
} from './LecturaDelTexto.js';

/**
 * Como VSD IA lee lo que escribe una persona, y como tolera las erratas (SCRUM-193).
 *
 * Lo que se vigila, mas que lo que se corrige: que la tolerancia **nunca** convierta una palabra
 * corriente en otra que cambie lo que se entiende. Una errata que se corrige de mas es una frase
 * que se lee distinta de lo que dijo la persona, y aqui eso no es una molestia.
 */
describe('palabrasDe', () => {
  it('deja palabras enteras, sin tildes, sin signos y en minuscula', () => {
    expect(palabrasDe('¿Cómo ESTÁS, hoy?')).toEqual(['como', 'estas', 'hoy']);
  });

  it('lee tres letras iguales seguidas como una', () => {
    expect(palabrasDe('holaaaa graciasss')).toEqual(['hola', 'gracias']);
  });

  it('un texto vacio no tiene palabras', () => {
    expect(palabrasDe('')).toEqual([]);
    expect(palabrasDe('  ¿?!  ')).toEqual([]);
  });

  it('normalizar quita tildes y colapsa espacios', () => {
    expect(normalizar('  Quiero   MORÍR ')).toBe('quiero morir');
  });
});

/**
 * Lo que no se ve no puede cambiar lo que se lee (SCRUM-258).
 *
 * Un carácter invisible en medio de una palabra no la cambia para quien la lee, pero sí para una
 * comparación de texto. Si `normalizar` los dejara, «mo\u{200B}rir» no se parecería a «morir», y la
 * detección de riesgo, que es lo primero que corre, no vería lo que la persona escribió.
 */
describe('caracteres invisibles', () => {
  // Cada uno es un `Default_Ignorable_Code_Point`: no se dibuja, pero está en el texto.
  const INVISIBLES = [
    ['guion blando', '\u{AD}'],
    ['unión de grafemas', '\u{34F}'],
    ['espacio de ancho cero', '\u{200B}'],
    ['no unión de ancho cero', '\u{200C}'],
    ['unión de ancho cero', '\u{200D}'],
    ['marca de izquierda a derecha', '\u{200E}'],
    ['marca de derecha a izquierda', '\u{200F}'],
    ['incrustación de derecha a izquierda', '\u{202B}'],
    ['unión de palabras', '\u{2060}'],
    ['selector de variación', '\u{FE0F}'],
    ['marca de orden de bytes', '\u{FEFF}'],
    ['relleno de hangul', '\u{3164}'],
    ['etiqueta', '\u{E0061}'],
  ] as const;

  it.each(INVISIBLES)('%s no cambia la palabra', (_nombre, invisible) => {
    expect(normalizar(`mo${invisible}rir`)).toBe('morir');
    expect(normalizar(`${invisible}morir${invisible}`)).toBe('morir');
    expect(palabrasDe(`quiero mo${invisible}rir`)).toEqual(['quiero', 'morir']);
  });

  it('varios seguidos tampoco', () => {
    expect(normalizar('m\u{200B}\u{200C}\u{200D}o\u{AD}r\u{FEFF}ir')).toBe('morir');
  });

  it('las letras de ancho completo y las matemáticas se leen como las normales', () => {
    expect(normalizar('ｑｕｉｅｒｏ ｍｏｒｉｒ')).toBe('quiero morir');
    expect(normalizar('𝗺𝗼𝗿𝗶𝗿')).toBe('morir');
  });

  it('una marca combinada fuera del rango de las tildes tampoco cambia la palabra', () => {
    expect(normalizar('mo\u{489}rir')).toBe('morir');
    expect(normalizar('mo\u{20DD}rir')).toBe('morir');
  });

  it('las tildes, la eñe y la diéresis se siguen quitando como siempre', () => {
    expect(normalizar('ÁÉÍÓÚ Ñandú pingüino')).toBe('aeiou nandu pinguino');
  });
});

describe('distanciaDeEdicion', () => {
  it.each([
    ['hola', 'hola', 0],
    ['suicidarme', 'suisidarme', 1], // una sustitucion
    ['suicidarme', 'suicdarme', 1], // un caracter de menos
    ['morirme', 'moriirme', 1], // uno de mas
    ['hola', 'hoal', 1], // dos letras cambiadas de sitio cuentan como una
    ['abc', 'xyz', 3],
    ['', 'abc', 3],
  ])('«%s» y «%s» estan a %s', (a, b, esperada) => {
    expect(distanciaDeEdicion(a, b)).toBe(esperada);
  });
});

describe('corregirPalabras', () => {
  const vocabulario = new Set([
    'quiero',
    'morir',
    'morirme',
    'suicidarme',
    'aguanto',
    'matarme',
    'hacerme',
    'vamos',
    'hola',
    'buenas',
    'buenos',
  ]);

  describe('por la tabla de erratas frecuentes', () => {
    it.each([
      ['ola', 'hola'],
      ['bamos', 'vamos'],
      ['kiero', 'quiero'],
      ['grasias', 'gracias'],
      ['sicologo', 'psicologo'],
    ])('«%s» se lee «%s»', (errata, correcta) => {
      expect(corregirPalabras([errata], vocabulario)).toEqual([correcta]);
    });

    it('«cómo bamos» se lee «como vamos»', () => {
      expect(corregirPalabras(palabrasDe('cómo bamos'), vocabulario)).toEqual(['como', 'vamos']);
    });

    it('la tabla esta escrita normalizada, sin tildes ni mayusculas', () => {
      for (const [errata, correcta] of Object.entries(ERRATAS_FRECUENTES)) {
        expect(errata, errata).toBe(normalizar(errata));
        expect(correcta, correcta).toBe(normalizar(correcta));
      }
    });

    it('ninguna errata se corrige hacia si misma ni hacia otra errata (no hay cadenas)', () => {
      for (const [errata, correcta] of Object.entries(ERRATAS_FRECUENTES)) {
        expect(correcta).not.toBe(errata);
        expect(Object.keys(ERRATAS_FRECUENTES)).not.toContain(correcta);
      }
    });
  });

  describe('por distancia de edicion', () => {
    it.each([
      ['suisidarme', 'suicidarme'],
      ['suicdarme', 'suicidarme'],
      ['morirne', 'morirme'],
      ['mrirme', 'morirme'],
      ['matarne', 'matarme'],
    ])('«%s» se lee «%s»', (errata, correcta) => {
      expect(corregirPalabras([errata], vocabulario)).toEqual([correcta]);
    });

    it('una palabra que ya esta en el vocabulario no se toca', () => {
      expect(corregirPalabras(['buenas', 'buenos', 'morir'], vocabulario)).toEqual([
        'buenas',
        'buenos',
        'morir',
      ]);
    });

    it('no corrige las palabras cortas (menos de cinco letras): casi todo esta a una letra de algo', () => {
      expect(corregirPalabras(['mas', 'mal', 'sol', 'hoal'], new Set(['hola', 'mal']))).toEqual([
        'mas',
        'mal',
        'sol',
        'hoal',
      ]);
    });

    it('no corrige si el cambio es la primera o la ultima letra: es lo que cambia de quien habla', () => {
      // «aguanta» (alguien mas) no es «aguanto» (quien escribe): no se confunden.
      expect(corregirPalabras(['aguanta', 'aguante'], vocabulario)).toEqual(['aguanta', 'aguante']);
      // Ni «quiere» es «quiero».
      expect(corregirPalabras(['quiere'], vocabulario)).toEqual(['quiere']);
    });

    it('no corrige si hay mas de un candidato: ante la duda se deja como esta', () => {
      // «buenas» y «buenos» estan a una letra de «buenis», y no hay como saber cual.
      expect(corregirPalabras(['buenis'], vocabulario)).toEqual(['buenis']);
    });

    it('no corrige lo que esta lejos de todo', () => {
      expect(corregirPalabras(['parqueadero', 'cuanto', 'biblioteca'], vocabulario)).toEqual([
        'parqueadero',
        'cuanto',
        'biblioteca',
      ]);
    });
  });

  describe('sin vocabulario solo corrige por la tabla', () => {
    it('es lo que se usa para el lenguaje ofensivo: ni una palabra se convierte en un insulto', () => {
      // «tanto» esta a una letra de «tonto»; con vocabulario se corregiria. No debe pasar.
      expect(corregirPalabras(['tanto', 'tiempo'], new Set())).toEqual(['tanto', 'tiempo']);
      expect(corregirPalabras(['ola'], new Set())).toEqual(['hola']);
    });
  });
});

describe('vocabularioDe', () => {
  it('junta las palabras de los patrones y las frases', () => {
    const vocabulario = vocabularioDe([['quiero morir', 'matarme'], ['como estas']]);

    expect([...vocabulario].sort()).toEqual(['como', 'estas', 'matarme', 'morir', 'quiero']);
  });

  it('deja fuera las raices (`psicolog*`): no son una palabra que se pueda corregir hacia ella', () => {
    const vocabulario = vocabularioDe([['psicolog*', 'con quien hablo']]);

    expect(vocabulario.has('psicolog')).toBe(false);
    expect(vocabulario.has('hablo')).toBe(true);
  });
});
