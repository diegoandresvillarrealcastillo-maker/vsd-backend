import { describe, expect, it } from 'vitest';
import { ContadorPorVentana } from './LimitePorCuenta.js';
import {
  LIMITE_DE_ESCRIBIR_ARCHIVOS,
  LIMITE_DE_EXPORTAR,
  LIMITE_DE_SUSCRIBIR_AVISOS,
  LIMITE_DEL_ASISTENTE,
} from './limites.js';

const REGLA = { maximo: 3, ventanaMs: 60_000 };

/** Un reloj que se mueve cuando la prueba lo dice. */
function relojFijo(inicio = 1_000_000): { ahora: () => number; avanzar: (ms: number) => void } {
  let tiempo = inicio;

  return {
    ahora: () => tiempo,
    avanzar: (ms) => {
      tiempo += ms;
    },
  };
}

describe('ContadorPorVentana', () => {
  it('deja pasar hasta el maximo y corta la siguiente', () => {
    const contador = new ContadorPorVentana(relojFijo().ahora);

    expect([1, 2, 3].map(() => contador.contar('ana', REGLA).permitido)).toEqual([
      true,
      true,
      true,
    ]);
    expect(contador.contar('ana', REGLA).permitido).toBe(false);
    expect(contador.contar('ana', REGLA).permitido).toBe(false);
  });

  it('cada clave cuenta por su lado: gastar el cupo de una no toca el de otra', () => {
    const contador = new ContadorPorVentana(relojFijo().ahora);

    for (let i = 0; i < 5; i += 1) {
      contador.contar('ana', REGLA);
    }

    expect(contador.contar('ana', REGLA).permitido).toBe(false);
    expect(contador.contar('beto', REGLA).permitido).toBe(true);
  });

  it('al vencer la ventana vuelve a dejar pasar, con la cuenta en uno', () => {
    const reloj = relojFijo();
    const contador = new ContadorPorVentana(reloj.ahora);

    for (let i = 0; i < 4; i += 1) {
      contador.contar('ana', REGLA);
    }

    expect(contador.contar('ana', REGLA).permitido).toBe(false);

    reloj.avanzar(REGLA.ventanaMs);

    expect(contador.contar('ana', REGLA).permitido).toBe(true);
    expect(contador.contar('ana', REGLA).permitido).toBe(true);
    expect(contador.contar('ana', REGLA).permitido).toBe(true);
    expect(contador.contar('ana', REGLA).permitido).toBe(false);
  });

  it('antes de que venza, sigue cortando', () => {
    const reloj = relojFijo();
    const contador = new ContadorPorVentana(reloj.ahora);

    for (let i = 0; i < 4; i += 1) {
      contador.contar('ana', REGLA);
    }

    reloj.avanzar(REGLA.ventanaMs - 1);

    expect(contador.contar('ana', REGLA).permitido).toBe(false);
  });

  it('dice cuanto falta para que se reinicie la ventana', () => {
    const reloj = relojFijo();
    const contador = new ContadorPorVentana(reloj.ahora);

    contador.contar('ana', REGLA);
    reloj.avanzar(20_000);

    expect(contador.contar('ana', REGLA).reinicioEnMs).toBe(40_000);
  });

  it('un maximo de cero no deja pasar ni la primera', () => {
    const contador = new ContadorPorVentana(relojFijo().ahora);

    expect(contador.contar('ana', { maximo: 0, ventanaMs: 1000 }).permitido).toBe(false);
  });

  describe('la memoria esta acotada', () => {
    it('barre las ventanas vencidas al llegar al tope', () => {
      const reloj = relojFijo();
      const contador = new ContadorPorVentana(reloj.ahora, 3);

      contador.contar('a', REGLA);
      contador.contar('b', REGLA);
      contador.contar('c', REGLA);
      reloj.avanzar(REGLA.ventanaMs);
      contador.contar('d', REGLA);

      // Las tres vencidas se fueron; solo queda la nueva.
      expect(contador.tamano).toBe(1);
    });

    it('si todas siguen vigentes, descarta las mas antiguas y nunca pasa del tope', () => {
      const contador = new ContadorPorVentana(relojFijo().ahora, 3);

      for (const clave of ['a', 'b', 'c', 'd', 'e', 'f']) {
        contador.contar(clave, REGLA);
      }

      expect(contador.tamano).toBeLessThanOrEqual(3);
    });

    it('descartar una ventana solo le regala un cupo nuevo a esa cuenta', () => {
      const contador = new ContadorPorVentana(relojFijo().ahora, 2);

      for (let i = 0; i < 4; i += 1) {
        contador.contar('ana', REGLA);
      }

      expect(contador.contar('ana', REGLA).permitido).toBe(false);

      // Dos cuentas nuevas desplazan a la mas antigua.
      contador.contar('beto', REGLA);
      contador.contar('carla', REGLA);

      expect(contador.contar('ana', REGLA).permitido).toBe(true);
    });
  });
});

describe('Los topes por cuenta', () => {
  const TODOS = {
    exportar: LIMITE_DE_EXPORTAR,
    asistente: LIMITE_DEL_ASISTENTE,
    archivos: LIMITE_DE_ESCRIBIR_ARCHIVOS,
    avisos: LIMITE_DE_SUSCRIBIR_AVISOS,
  };

  it.each(Object.entries(TODOS))(
    'el de %s es por minuto y mas bajo que el general',
    (_n, regla) => {
      // El general es de 120 por direccion IP: un tope por cuenta que no lo bajara
      // no protegeria nada.
      expect(regla.ventanaMs).toBe(60_000);
      expect(regla.maximo).toBeGreaterThan(0);
      expect(regla.maximo).toBeLessThan(120);
    },
  );

  it('exportar es lo mas estricto, y el asistente lo mas holgado: es una conversacion', () => {
    expect(LIMITE_DE_EXPORTAR.maximo).toBeLessThan(LIMITE_DE_ESCRIBIR_ARCHIVOS.maximo);
    expect(LIMITE_DEL_ASISTENTE.maximo).toBeGreaterThan(LIMITE_DE_ESCRIBIR_ARCHIVOS.maximo);
  });
});
