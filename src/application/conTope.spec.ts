import { describe, expect, it } from 'vitest';
import { conTope } from './conTope.js';

/** Una espera que deja pasar a los demas: lo justo para que las tareas se solapen. */
const ceder = () => new Promise<void>((resolver) => setTimeout(resolver, 1));

describe('conTope', () => {
  it('hace la tarea con cada elemento, una sola vez', async () => {
    const vistos: number[] = [];

    await conTope([1, 2, 3, 4, 5, 6, 7], 3, (n) => {
      vistos.push(n);

      return Promise.resolve();
    });

    expect(vistos.sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('nunca hay mas tareas en vuelo que el tope, y se llega a usarlo entero', async () => {
    let enVuelo = 0;
    let maximo = 0;

    await conTope(
      Array.from({ length: 40 }, (_, i) => i),
      4,
      async () => {
        enVuelo += 1;
        maximo = Math.max(maximo, enVuelo);
        await ceder();
        enVuelo -= 1;
      },
    );

    expect(maximo).toBe(4);
    expect(enVuelo).toBe(0);
  });

  it('con menos elementos que el tope no lanza trabajadores de mas', async () => {
    let maximo = 0;
    let enVuelo = 0;

    await conTope([1, 2], 10, async () => {
      enVuelo += 1;
      maximo = Math.max(maximo, enVuelo);
      await ceder();
      enVuelo -= 1;
    });

    expect(maximo).toBe(2);
  });

  it('una tarea lenta no frena a las demas', async () => {
    const terminadas: number[] = [];

    await conTope([1, 2, 3, 4], 2, async (n) => {
      if (n === 1) {
        // La primera tarda mucho mas que las otras tres juntas.
        await new Promise<void>((resolver) => setTimeout(resolver, 30));
      }

      terminadas.push(n);
    });

    // El otro trabajador despacho 2, 3 y 4 mientras el primero seguia con la 1.
    expect(terminadas).toEqual([2, 3, 4, 1]);
  });

  it('un fallo no deja a las demas a medias, y se lanza al final', async () => {
    const hechas: number[] = [];

    await expect(
      conTope([1, 2, 3, 4, 5], 2, async (n) => {
        await ceder();

        if (n === 2) {
          throw new Error('fallo del 2');
        }

        hechas.push(n);
      }),
    ).rejects.toThrow('fallo del 2');

    expect(hechas.sort()).toEqual([1, 3, 4, 5]);
  });

  it('sin elementos no hace nada', async () => {
    await expect(conTope([], 4, () => Promise.reject(new Error('no')))).resolves.toBeUndefined();
  });

  it.each([0, -1, 1.5, Number.NaN])(
    'rechaza un tope que no es un entero positivo (%s)',
    async (tope) => {
      await expect(conTope([1], tope, () => Promise.resolve())).rejects.toThrow(RangeError);
    },
  );
});
