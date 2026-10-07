import { describe, expect, it } from 'vitest';
import { contiene, contieneAlguno, palabrasDe, reconocerCharla } from './Reconocimiento.js';

describe('palabrasDe', () => {
  it('deja palabras sueltas, sin tildes, sin signos y en minuscula', () => {
    expect(palabrasDe('¿Cómo ESTÁS, Amigo?')).toEqual(['como', 'estas', 'amigo']);
  });

  it('lee la ene como una ene sin tilde, igual que las reglas', () => {
    expect(palabrasDe('No tengo sueño')).toEqual(['no', 'tengo', 'sueno']);
  });

  it('lee las letras alargadas como una sola', () => {
    expect(palabrasDe('holaaaa graciasss')).toEqual(['hola', 'gracias']);
  });

  it('no toca lo que tiene dos letras iguales', () => {
    expect(palabrasDe('llorar')).toEqual(['llorar']);
  });

  it('un emoji o un signo suelto separan palabras y no cuentan', () => {
    expect(palabrasDe('hola 😊 !!')).toEqual(['hola']);
  });

  it('un texto vacio o de puros signos no tiene palabras', () => {
    expect(palabrasDe('   ')).toEqual([]);
    expect(palabrasDe('¿?!')).toEqual([]);
  });
});

describe('contiene', () => {
  it('lee palabras completas: "mal" no esta dentro de "normal"', () => {
    expect(contiene(palabrasDe('todo normal por aqui'), 'mal')).toBe(false);
    expect(contiene(palabrasDe('me fue mal'), 'mal')).toBe(true);
  });

  it('"solo" no esta dentro de "solos" ni de "soloc"', () => {
    expect(contiene(palabrasDe('estamos solos'), 'solo')).toBe(false);
  });

  it('una frase pide las palabras seguidas y en ese orden', () => {
    expect(contiene(palabrasDe('como estas hoy'), 'como estas')).toBe(true);
    expect(contiene(palabrasDe('estas como hoy'), 'como estas')).toBe(false);
    expect(contiene(palabrasDe('como no estas'), 'como estas')).toBe(false);
  });

  it('un patron con asterisco admite terminaciones, pero no empieza a mitad de palabra', () => {
    expect(contiene(palabrasDe('hablar con una psicologa'), 'psicolog*')).toBe(true);
    expect(contiene(palabrasDe('la psicologia'), 'psicolog*')).toBe(true);
    expect(contiene(palabrasDe('un anti psicologo'), 'psicolog*')).toBe(true);
    expect(contiene(palabrasDe('antipsicologo'), 'psicolog*')).toBe(false);
  });

  it('un patron mas largo que el texto no coincide ni falla', () => {
    expect(contiene(palabrasDe('hola'), 'como estas')).toBe(false);
  });

  it('contieneAlguno basta con una', () => {
    expect(contieneAlguno(palabrasDe('me siento bien'), ['triste', 'me siento'])).toBe(true);
    expect(contieneAlguno(palabrasDe('me siento bien'), ['triste', 'mal'])).toBe(false);
  });
});

describe('reconocerCharla', () => {
  const reglas = [
    { nombre: 'pregunta', patrones: ['como estas'] },
    { nombre: 'saludo', patrones: ['hola', 'buenas'] },
  ] as const;
  const relleno = new Set(['muy', 'vsd']);

  it('reconoce un mensaje que es solo charla', () => {
    expect(reconocerCharla(palabrasDe('hola'), reglas, relleno)?.nombre).toBe('saludo');
  });

  it('gana la primera regla de la lista, aunque el saludo este antes en el texto', () => {
    expect(reconocerCharla(palabrasDe('hola como estas'), reglas, relleno)?.nombre).toBe(
      'pregunta',
    );
  });

  it('acepta palabras de relleno alrededor', () => {
    expect(reconocerCharla(palabrasDe('hola muy buenas vsd'), reglas, relleno)?.nombre).toBe(
      'saludo',
    );
  });

  it('una sola palabra que no es charla ni relleno lo deja fuera', () => {
    expect(reconocerCharla(palabrasDe('hola desaparecer'), reglas, relleno)).toBeUndefined();
    expect(reconocerCharla(palabrasDe('desaparecer hola'), reglas, relleno)).toBeUndefined();
  });

  it('solo relleno no es charla: tiene que haber algo que reconocer', () => {
    expect(reconocerCharla(palabrasDe('muy vsd'), reglas, relleno)).toBeUndefined();
  });

  it('un mensaje vacio no es charla', () => {
    expect(reconocerCharla([], reglas, relleno)).toBeUndefined();
  });
});
