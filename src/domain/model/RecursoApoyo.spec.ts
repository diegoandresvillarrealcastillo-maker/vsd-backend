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

  describe('el telefono que se marca con «Llamar ahora» (SCRUM-257)', () => {
    it.each(['192', '123', '024', '8009112000', '+573112801363'])(
      'una linea verificada acepta "%s"',
      (telefono) => {
        expect(RecursoApoyo.create({ ...LINEA, telefono }).telefono).toBe(telefono);
      },
    );

    it('sin telefono, no lo tiene (el directorio internacional)', () => {
      expect(RecursoApoyo.create({ ...LINEA }).telefono).toBeUndefined();
    });

    it.each([
      '',
      '12',
      '1234567890123456',
      '192, opción 4',
      '192,4',
      '192 4',
      '800 911 2000',
      '(1) 234',
      'tel:192',
      '+',
      '++192',
      '192+',
      'uno',
      '192;4',
      '1.2.3',
    ])('no acepta "%s": no es algo que se pueda marcar tal cual', (telefono) => {
      expect(() => RecursoApoyo.create({ ...LINEA, telefono })).toThrow(InvalidResourceError);
    });

    it('una lectura o un ejercicio no pueden llevar telefono', () => {
      for (const tipo of [TipoDeRecurso.LECTURA, TipoDeRecurso.EJERCICIO]) {
        expect(() =>
          RecursoApoyo.create({ id: 'x', titulo: 'Algo para leer', tipo, telefono: '192' }),
        ).toThrow(InvalidResourceError);
      }
    });

    it('sin fuente o sin fecha no hay linea, y por tanto no hay telefono que marcar', () => {
      expect(() => RecursoApoyo.create({ ...LINEA, fuente: undefined, telefono: '192' })).toThrow(
        InvalidResourceError,
      );
      expect(() =>
        RecursoApoyo.create({ ...LINEA, verificadoEl: undefined, telefono: '192' }),
      ).toThrow(InvalidResourceError);
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
