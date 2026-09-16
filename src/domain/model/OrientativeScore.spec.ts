import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala } from './Activity.js';
import { ScoreOutOfRangeError } from './DomainError.js';
import { ActivityId } from './Identifier.js';
import { NivelOrientativo, OrientativeScore } from './OrientativeScore.js';

const ID = new ActivityId('33333333-3333-4333-a333-333333333333');

/** Actividad de referencia: de 0 a 10, donde mas puntaje es mejor. */
function sobreDiez(): Activity {
  return Activity.create({
    id: ID,
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

describe('OrientativeScore', () => {
  it('guarda el puntaje ya normalizado a la escala comun', () => {
    // El crudo va de 0 a 10; lo que se guarda va de 0 a 100, para poder
    // comparar actividades de escalas distintas. Ver RF7.
    const puntaje = OrientativeScore.create(7, sobreDiez());

    expect(puntaje.value).toBe(70);
  });

  it.each([
    [0, NivelOrientativo.REQUIERE_ATENCION],
    [3, NivelOrientativo.REQUIERE_ATENCION],
    [4, NivelOrientativo.EN_SEGUIMIENTO],
    [6, NivelOrientativo.EN_SEGUIMIENTO],
    [7, NivelOrientativo.FAVORABLE],
    [10, NivelOrientativo.FAVORABLE],
  ])('deriva el nivel de %i sobre 10 como %s', (valor, esperado) => {
    expect(OrientativeScore.create(valor, sobreDiez()).level).toBe(esperado);
  });

  it.each([
    ['por encima del maximo', 11],
    ['negativo', -1],
  ])('rechaza un puntaje %s', (_caso, valor) => {
    expect(() => OrientativeScore.create(valor, sobreDiez())).toThrow(ScoreOutOfRangeError);
  });

  it('sugiere acompanamiento solo cuando el nivel requiere atencion', () => {
    expect(OrientativeScore.create(1, sobreDiez()).sugiereAcompanamiento()).toBe(true);
    expect(OrientativeScore.create(5, sobreDiez()).sugiereAcompanamiento()).toBe(false);
    expect(OrientativeScore.create(9, sobreDiez()).sugiereAcompanamiento()).toBe(false);
  });

  it('trae el texto en el lenguaje de la actividad', () => {
    const conTextos = Activity.create({
      id: ID,
      nombre: 'Secuencias',
      direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
      puntajeMaximo: 10,
      textosNivel: {
        favorable: 'Muy afinado',
        en_seguimiento: 'Con altibajos',
        requiere_atencion: 'Cuesta sostenerlo',
      },
    });

    expect(OrientativeScore.create(9, conTextos).texto).toBe('Muy afinado');
  });

  it('no usa terminologia clinica en los niveles', () => {
    // VSD Health no diagnostica. Esta prueba existe para que nadie cambie
    // las etiquetas por nombres de trastornos sin que el CI lo note.
    const prohibidos = ['depresion', 'ansiedad', 'trastorno', 'diagnostico', 'patologia'];
    const niveles = Object.values(NivelOrientativo).join(' ');

    for (const termino of prohibidos) {
      expect(niveles).not.toContain(termino);
    }
  });
});
