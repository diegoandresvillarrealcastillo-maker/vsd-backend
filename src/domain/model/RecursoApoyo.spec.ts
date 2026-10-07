import { describe, expect, it } from 'vitest';
import { InvalidResourceError } from './DomainError.js';
import { Cobertura, RecursoApoyo, TipoDeRecurso } from './RecursoApoyo.js';

const LINEA = {
  id: 'linea-1',
  titulo: 'Línea de prueba',
  tipo: TipoDeRecurso.CONTACTO,
  fuente: 'https://pruebas.test/linea',
  verificadoEl: '2026-10-06',
} as const;

describe('RecursoApoyo', () => {
  describe('una linea de atencion sin fuente o sin fecha no se puede crear (SCRUM-124)', () => {
    it('con fuente y fecha, se crea', () => {
      const linea = RecursoApoyo.create({ ...LINEA, pais: 'CO' });

      expect(linea.fuente).toBe('https://pruebas.test/linea');
      expect(linea.verificadoEl).toBe('2026-10-06');
      expect(linea.pais).toBe('CO');
    });

    it('sin fuente, falla', () => {
      expect(() => RecursoApoyo.create({ ...LINEA, fuente: undefined })).toThrow(
        InvalidResourceError,
      );
    });

    it('con una fuente en blanco, falla', () => {
      expect(() => RecursoApoyo.create({ ...LINEA, fuente: '   ' })).toThrow(InvalidResourceError);
    });

    it('sin fecha, falla', () => {
      expect(() => RecursoApoyo.create({ ...LINEA, verificadoEl: undefined })).toThrow(
        InvalidResourceError,
      );
    });

    it.each(['2026-13-01', '2026-00-10', '2026-10-32', '06/10/2026', '2026-10-6', 'ayer', ''])(
      'con la fecha "%s", falla',
      (verificadoEl) => {
        expect(() => RecursoApoyo.create({ ...LINEA, verificadoEl })).toThrow(InvalidResourceError);
      },
    );

    it('una lectura no la necesita: no es un telefono', () => {
      const lectura = RecursoApoyo.create({
        id: 'lectura-1',
        titulo: 'Rutina para descansar mejor',
        tipo: TipoDeRecurso.LECTURA,
      });

      expect(lectura.fuente).toBeUndefined();
    });
  });

  describe('el pais', () => {
    it.each(['CO', 'MX', 'ES', 'US'])('acepta "%s"', (pais) => {
      expect(RecursoApoyo.create({ ...LINEA, pais }).pais).toBe(pais);
    });

    it.each(['co', 'COL', 'C', '1A', ''])('rechaza "%s"', (pais) => {
      expect(() => RecursoApoyo.create({ ...LINEA, pais })).toThrow(InvalidResourceError);
    });

    it('puede faltar: sirve en cualquier parte', () => {
      expect(RecursoApoyo.create(LINEA).pais).toBeUndefined();
    });
  });

  describe('ordenarPorAlcance', () => {
    it('lo nacional va primero y el directorio internacional, al final', () => {
      const lineas = [
        RecursoApoyo.create({ ...LINEA, id: 'i', cobertura: Cobertura.INTERNACIONAL }),
        RecursoApoyo.create({ ...LINEA, id: 'b', cobertura: Cobertura.BOGOTA }),
        RecursoApoyo.create({ ...LINEA, id: 'n', cobertura: Cobertura.NACIONAL }),
        RecursoApoyo.create({ ...LINEA, id: 'u', cobertura: Cobertura.UNIVERSIDAD }),
      ];

      expect(RecursoApoyo.ordenarPorAlcance(lineas).map((linea) => linea.id)).toEqual([
        'n',
        'u',
        'b',
        'i',
      ]);
    });

    it('una cobertura desconocida va al final', () => {
      const lineas = [
        RecursoApoyo.create({ ...LINEA, id: 'x', cobertura: 'planetaria' }),
        RecursoApoyo.create({ ...LINEA, id: 'i', cobertura: Cobertura.INTERNACIONAL }),
      ];

      expect(RecursoApoyo.ordenarPorAlcance(lineas).map((linea) => linea.id)).toEqual(['i', 'x']);
    });
  });
});
