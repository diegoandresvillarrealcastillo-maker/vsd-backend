import { describe, expect, it } from 'vitest';
import { problemasDeContenido, textosDe } from './contenidoDeSesiones.js';

describe('textosDe', () => {
  it('junta todos los textos, a cualquier profundidad, y deja las claves y lo que no es texto', () => {
    const parametros = {
      invitacion: '¿Qué estuvo bien hoy?',
      ideas: ['Un café', 'Un paseo'],
      patron: { inhalaSegundos: 4, nota: 'Sin prisa.' },
      haptico: true,
      mas: null,
    };

    expect(textosDe(parametros).sort()).toEqual(
      ['¿Qué estuvo bien hoy?', 'Un café', 'Un paseo', 'Sin prisa.'].sort(),
    );
  });

  it('un valor que no es texto ni contenedor no aporta nada', () => {
    expect(textosDe(7)).toEqual([]);
    expect(textosDe(null)).toEqual([]);
    expect(textosDe(undefined)).toEqual([]);
  });
});

describe('problemasDeContenido: el lenguaje clínico (R6)', () => {
  it.each([
    'Una depresión que no se va',
    'estoy deprimido',
    'un ánimo depresivo',
    'una persona ansiosa',
    'depresion',
    'ANSIEDAD',
    'un trastorno del sueño',
    'algo patológico',
    'patologia',
    'un diagnóstico',
    'diagnostico',
    'una enfermedad',
    'enfermería',
    'el síndrome de',
    'sindrome',
  ])('rechaza «%s»', (texto) => {
    const problemas = problemasDeContenido({ titulo: 'Una sesión', parametros: { texto } });

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain('R6');
    expect(problemas[0]).toContain(texto);
  });

  it('lo revisa también en el título, que sale en la exportación', () => {
    const problemas = problemasDeContenido({ titulo: 'Contra la ansiedad', parametros: {} });

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain('título');
  });
});

describe('problemasDeContenido: la lista de exclusión (R14)', () => {
  it.each([
    'la muerte',
    'un muerto',
    'el suicidio',
    'suicida',
    'sangre',
    'sangrado',
    'un arma',
    'las armas',
    'la droga',
    'drogas',
    'violencia',
    'violento',
    'MUERTE',
  ])('rechaza «%s»', (texto) => {
    const problemas = problemasDeContenido({ titulo: 'Una sesión', parametros: { texto } });

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain('R14');
  });

  it.each(['armario', 'armar un plan', 'desarmar', 'alarma'])(
    'no confunde «%s» con «arma»',
    (texto) => {
      expect(problemasDeContenido({ titulo: 'Una sesión', parametros: { texto } })).toEqual([]);
    },
  );

  it.each(['drogueria', 'sangría de la mañana'])(
    'marca por la raíz «%s»: quien revisa decide si puede quedarse',
    (texto) => {
      const problemas = problemasDeContenido({ titulo: 'Una sesión', parametros: { texto } });

      expect(problemas).toHaveLength(1);
      expect(problemas[0]).toContain('R14');
    },
  );
});

describe('problemasDeContenido: lo que sí se puede decir', () => {
  it.each([
    'Piensa en los últimos siete días. No hay respuestas buenas ni malas.',
    '¿Cuánto te costó arrancar el día?',
    '¿Cuánto te han dado vueltas pensamientos que no te dejan en paz?',
    'Algo salió mejor de lo esperado',
    'Si te mareas o te incomoda, suelta el patrón y respira como siempre.',
  ])('acepta «%s»', (texto) => {
    expect(problemasDeContenido({ titulo: 'Una sesión', parametros: { texto } })).toEqual([]);
  });

  it('dice cada problema por separado', () => {
    const problemas = problemasDeContenido({
      titulo: 'Una sesión',
      parametros: { a: 'sin ansiedad', b: 'la violencia', c: 'todo bien' },
    });

    expect(problemas).toHaveLength(2);
  });
});
