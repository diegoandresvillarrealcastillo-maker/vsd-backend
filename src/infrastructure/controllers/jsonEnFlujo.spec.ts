import { describe, expect, it } from 'vitest';
import { convertirEnFlujo, ListaEnFlujo, objetoJsonEnFlujo } from './jsonEnFlujo.js';

async function texto(flujo: AsyncIterable<string>): Promise<string> {
  let junto = '';

  for await (const trozo of flujo) {
    junto += trozo;
  }

  return junto;
}

async function* de<T>(elementos: readonly T[]): AsyncGenerator<T, void, undefined> {
  for (const elemento of elementos) {
    yield await Promise.resolve(elemento);
  }
}

/**
 * Escribir un objeto JSON por piezas (SCRUM-262): el texto tiene que ser el mismo que el de
 * `JSON.stringify` del objeto entero, porque el cliente no sabe (ni tiene por que saber) que se
 * escribio de otra manera.
 */
describe('objetoJsonEnFlujo', () => {
  it('escribe lo mismo que JSON.stringify del objeto entero, claves en el mismo orden', async () => {
    const objeto = {
      generadoEn: '2026-10-25T12:00:00.000Z',
      nulo: null,
      numero: 3.5,
      verdadero: true,
      anidado: { a: [1, 2, { b: 'c' }] },
      lista: [{ id: 1 }, { id: 2 }, { id: 3 }],
      despues: 'x',
    };

    const escrito = await texto(
      objetoJsonEnFlujo([
        ['generadoEn', objeto.generadoEn],
        ['nulo', objeto.nulo],
        ['numero', objeto.numero],
        ['verdadero', objeto.verdadero],
        ['anidado', objeto.anidado],
        ['lista', new ListaEnFlujo(de(objeto.lista))],
        ['despues', objeto.despues],
      ]),
    );

    expect(escrito).toBe(JSON.stringify(objeto));
  });

  it('una lista sin elementos es un arreglo vacio', async () => {
    const escrito = await texto(
      objetoJsonEnFlujo([
        ['antes', 1],
        ['lista', new ListaEnFlujo(de([]))],
        ['despues', 2],
      ]),
    );

    expect(escrito).toBe('{"antes":1,"lista":[],"despues":2}');
  });

  it('un objeto sin entradas es un objeto vacio', async () => {
    await expect(texto(objetoJsonEnFlujo([]))).resolves.toBe('{}');
  });

  it('dos listas seguidas no se pegan ni pierden la coma', async () => {
    const escrito = await texto(
      objetoJsonEnFlujo([
        ['a', new ListaEnFlujo(de([1, 2]))],
        ['b', new ListaEnFlujo(de(['x']))],
      ]),
    );

    expect(JSON.parse(escrito)).toEqual({ a: [1, 2], b: ['x'] });
  });

  it('los textos con comillas, saltos de linea, tildes y emojis salen escapados igual', async () => {
    const delicado = ['dijo "hola"\nsegunda línea\t\\', 'ñandú áéíóú', '🙂', '\u{2028}'];
    const escrito = await texto(
      objetoJsonEnFlujo([
        ['lista', new ListaEnFlujo(de(delicado))],
        ['unico', delicado[0]],
      ]),
    );

    expect(escrito).toBe(JSON.stringify({ lista: delicado, unico: delicado[0] }));
    expect(JSON.parse(escrito)).toEqual({ lista: delicado, unico: delicado[0] });
  });

  it('no lee un elemento hasta que el anterior se consumio: nunca los junta', async () => {
    let pedidos = 0;
    const origen = (async function* () {
      for (let i = 0; i < 1000; i++) {
        pedidos += 1;

        yield await Promise.resolve({ i });
      }
    })();

    const flujo = objetoJsonEnFlujo([['lista', new ListaEnFlujo(origen)]]);

    // '{', la clave, '[' y el primer elemento.
    for (let trozos = 0; trozos < 4; trozos++) {
      await flujo.next();
    }

    expect(pedidos).toBe(1);
  });

  it('si la lista falla a mitad, lo que ya salio no es un JSON valido y el error sale', async () => {
    const origen = (async function* () {
      yield await Promise.resolve({ i: 1 });
      yield await Promise.resolve({ i: 2 });
      throw new Error('la base se cayo');
    })();

    const salido: string[] = [];
    const escribir = async () => {
      for await (const trozo of objetoJsonEnFlujo([['lista', new ListaEnFlujo(origen)]])) {
        salido.push(trozo);
      }
    };

    await expect(escribir()).rejects.toThrow('la base se cayo');
    expect(() => JSON.parse(salido.join('')) as unknown).toThrow();
  });
});

describe('convertirEnFlujo', () => {
  it('convierte cada elemento en su orden y sin adelantarse', async () => {
    const vistos: number[] = [];
    const convertidos = convertirEnFlujo(de([1, 2, 3]), (n) => {
      vistos.push(n);

      return n * 10;
    });

    await expect(convertidos.next()).resolves.toEqual({ value: 10, done: false });
    expect(vistos).toEqual([1]);

    const resto: number[] = [];

    for await (const n of convertidos) {
      resto.push(n);
    }

    expect(resto).toEqual([20, 30]);
  });
});
