import { describe, expect, it } from 'vitest';
import { FutureCompletionDateError } from './DomainError.js';
import { TOLERANCIA_DEL_RELOJ_EN_MS, ajustarAlReloj, conTolerancia } from './ToleranciaDelReloj.js';

const AHORA = new Date('2026-10-07T12:00:00.000Z');

function despues(ms: number): Date {
  return new Date(AHORA.getTime() + ms);
}

describe('ToleranciaDelReloj', () => {
  it('son cinco minutos', () => {
    expect(TOLERANCIA_DEL_RELOJ_EN_MS).toBe(300_000);
  });

  describe('ajustarAlReloj', () => {
    it('respeta lo que ocurrio antes: lo hecho sin conexion hace horas es asi de viejo', () => {
      const haceTresHoras = despues(-3 * 60 * 60 * 1000);

      expect(ajustarAlReloj(haceTresHoras, AHORA).toISOString()).toBe(haceTresHoras.toISOString());
    });

    it('respeta una fecha exactamente igual a ahora', () => {
      expect(ajustarAlReloj(AHORA, AHORA).toISOString()).toBe(AHORA.toISOString());
    });

    it('un reloj adelantado dentro de la tolerancia se registra como ahora', () => {
      const adelantado = despues(4 * 60 * 1000);

      expect(ajustarAlReloj(adelantado, AHORA).toISOString()).toBe(AHORA.toISOString());
    });

    it('acepta justo en el limite de la tolerancia', () => {
      const enElLimite = despues(TOLERANCIA_DEL_RELOJ_EN_MS);

      expect(ajustarAlReloj(enElLimite, AHORA).toISOString()).toBe(AHORA.toISOString());
    });

    it('rechaza un milisegundo mas alla del limite', () => {
      const pasado = despues(TOLERANCIA_DEL_RELOJ_EN_MS + 1);

      expect(() => ajustarAlReloj(pasado, AHORA)).toThrow(FutureCompletionDateError);
    });

    it('rechaza un dia en el futuro', () => {
      expect(() => ajustarAlReloj(despues(24 * 60 * 60 * 1000), AHORA)).toThrow(
        FutureCompletionDateError,
      );
    });

    it('devuelve una fecha nueva: quien la pidio no puede mutar la de ahora', () => {
      const adelantado = despues(60 * 1000);
      const ajustada = ajustarAlReloj(adelantado, AHORA);

      ajustada.setFullYear(1990);

      expect(AHORA.getFullYear()).toBe(2026);
      expect(adelantado.getFullYear()).toBe(2026);
    });

    it('no deja que un resultado de las 23:58 caiga en el dia siguiente', () => {
      // Servidor: 23:58 del 7. Reloj del dispositivo, adelantado: 00:01 del 8.
      const ahora = new Date('2026-10-07T23:58:00.000Z');
      const delDispositivo = new Date('2026-10-08T00:01:00.000Z');

      expect(ajustarAlReloj(delDispositivo, ahora).toISOString().slice(0, 10)).toBe('2026-10-07');
    });
  });

  describe('conTolerancia', () => {
    it('suma la tolerancia a ahora', () => {
      expect(conTolerancia(AHORA).getTime() - AHORA.getTime()).toBe(TOLERANCIA_DEL_RELOJ_EN_MS);
    });

    it('no muta la fecha original', () => {
      const original = new Date(AHORA.getTime());

      conTolerancia(original);

      expect(original.getTime()).toBe(AHORA.getTime());
    });
  });
});
