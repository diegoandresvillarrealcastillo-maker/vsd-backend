import { describe, expect, it } from 'vitest';
import { problemaDeLaRevision, type RevisionDeLaSesion } from './estadoDeRevision.ts';

const REVISADA_POR = 'Alguien (rol)';
const CUANDO = new Date('2026-10-20T17:00:00.000Z');

function fila(cambios: Partial<RevisionDeLaSesion>): RevisionDeLaSesion {
  return {
    publicado: false,
    revision: 'pendiente',
    revisadaPor: null,
    revisadaEl: null,
    ...cambios,
  };
}

describe('problemaDeLaRevision', () => {
  describe('lo que no pide revision', () => {
    const sembrada = { publicar: true, revision: 'no_requiere' };

    it('sigue como se sembro: sin revision y publicado', () => {
      expect(
        problemaDeLaRevision(sembrada, fila({ revision: 'no_requiere', publicado: true })),
      ).toBeUndefined();
    });

    it('si cambia de estado, se dice', () => {
      expect(
        problemaDeLaRevision(sembrada, fila({ revision: 'no_requiere', publicado: false })),
      ).toMatch(/publicado=true/u);
      expect(problemaDeLaRevision(sembrada, fila({ revision: 'pendiente' }))).toMatch(/pendiente/u);
    });
  });

  describe('lo que pide revision', () => {
    const sembrada = { publicar: false, revision: 'pendiente' };

    it('sigue pendiente y sin publicar: nadie la ha revisado todavia', () => {
      expect(problemaDeLaRevision(sembrada, fila({}))).toBeUndefined();
    });

    it('esta revisada a nombre de alguien y con su fecha, publicada o retirada', () => {
      const revisada = { revision: 'revisada', revisadaPor: REVISADA_POR, revisadaEl: CUANDO };

      expect(
        problemaDeLaRevision(sembrada, fila({ ...revisada, publicado: true })),
      ).toBeUndefined();
      expect(
        problemaDeLaRevision(sembrada, fila({ ...revisada, publicado: false })),
      ).toBeUndefined();
    });

    it('publicada sin que nadie la haya revisado: es lo que esta prueba existe para detectar', () => {
      expect(problemaDeLaRevision(sembrada, fila({ publicado: true }))).toMatch(/sin que nadie/u);
    });

    it.each([
      ['sin revisor', { revisadaPor: null }],
      ['con el revisor en blanco', { revisadaPor: '   ' }],
      ['sin fecha', { revisadaEl: null }],
    ])('revisada %s: se dice', (_caso, falta) => {
      expect(
        problemaDeLaRevision(
          sembrada,
          fila({ revision: 'revisada', revisadaPor: REVISADA_POR, revisadaEl: CUANDO, ...falta }),
        ),
      ).toMatch(/sin decir quien ni cuando/u);
    });

    it('un estado que no existe', () => {
      expect(problemaDeLaRevision(sembrada, fila({ revision: 'aprobada' }))).toMatch(/aprobada/u);
    });
  });
});
