import { describe, expect, it } from 'vitest';
import { InvalidScoreRangeError, ScoreOutOfRangeError } from './DomainError.js';
import { NivelOrientativo, OrientativeScore } from './OrientativeScore.js';

describe('OrientativeScore', () => {
  it('guarda el puntaje y su maximo', () => {
    const puntaje = OrientativeScore.create(7, 10);

    expect(puntaje.value).toBe(7);
    expect(puntaje.maxValue).toBe(10);
  });

  it.each([
    [0, 10, NivelOrientativo.REQUIERE_ATENCION],
    [3, 10, NivelOrientativo.REQUIERE_ATENCION],
    [4, 10, NivelOrientativo.EN_SEGUIMIENTO],
    [6, 10, NivelOrientativo.EN_SEGUIMIENTO],
    [7, 10, NivelOrientativo.FAVORABLE],
    [10, 10, NivelOrientativo.FAVORABLE],
  ])('deriva el nivel de %i sobre %i como %s', (valor, maximo, esperado) => {
    expect(OrientativeScore.create(valor, maximo).level).toBe(esperado);
  });

  it.each([
    ['por encima del maximo', 11, 10],
    ['negativo', -1, 10],
    ['decimal', 5.5, 10],
  ])('rechaza un puntaje %s', (_caso, valor, maximo) => {
    expect(() => OrientativeScore.create(valor, maximo)).toThrow(ScoreOutOfRangeError);
  });

  it.each([
    ['cero', 0],
    ['negativo', -5],
    ['decimal', 10.5],
  ])('rechaza un maximo %s', (_caso, maximo) => {
    expect(() => OrientativeScore.create(1, maximo)).toThrow(InvalidScoreRangeError);
  });

  it('sugiere acompanamiento solo cuando el nivel requiere atencion', () => {
    expect(OrientativeScore.create(1, 10).sugiereAcompanamiento()).toBe(true);
    expect(OrientativeScore.create(5, 10).sugiereAcompanamiento()).toBe(false);
    expect(OrientativeScore.create(9, 10).sugiereAcompanamiento()).toBe(false);
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
