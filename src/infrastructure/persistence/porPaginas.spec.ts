import { describe, expect, it } from 'vitest';
import { FILAS_POR_PAGINA } from '../../domain/ports/out/LecturaPorPaginas.js';
import { porPaginas } from './porPaginas.js';

/** Una lectura por cursor sobre una lista: lo que sigue a `ultima`, de a `limite`. */
function lecturaSobre(filas: readonly number[]) {
  const llamadas: { ultima: number | undefined; limite: number }[] = [];

  const leer = (ultima: number | undefined, limite: number): Promise<readonly number[]> => {
    llamadas.push({ ultima, limite });

    const desde = ultima === undefined ? 0 : filas.indexOf(ultima) + 1;

    return Promise.resolve(filas.slice(desde, desde + limite));
  };

  return { leer, llamadas };
}

async function recorrer(leer: Parameters<typeof porPaginas<number>>[0]): Promise<number[][]> {
  const paginas: number[][] = [];

  for await (const pagina of porPaginas(leer)) {
    paginas.push([...pagina]);
  }

  return paginas;
}

describe('porPaginas', () => {
  it('pide de a FILAS_POR_PAGINA y cada pagina empieza donde acabo la anterior', async () => {
    const filas = Array.from({ length: 450 }, (_, i) => i);
    const { leer, llamadas } = lecturaSobre(filas);

    const paginas = await recorrer(leer);

    expect(FILAS_POR_PAGINA).toBe(200);
    expect(paginas.map((pagina) => pagina.length)).toEqual([200, 200, 50]);
    expect(paginas.flat()).toEqual(filas);
    expect(llamadas).toEqual([
      { ultima: undefined, limite: 200 },
      { ultima: 199, limite: 200 },
      { ultima: 399, limite: 200 },
    ]);
  });

  it('sin filas no produce ninguna pagina', async () => {
    await expect(recorrer(lecturaSobre([]).leer)).resolves.toEqual([]);
  });

  it('una pagina corta es la ultima: no pregunta otra vez', async () => {
    const { leer, llamadas } = lecturaSobre([1, 2, 3]);

    await expect(recorrer(leer)).resolves.toEqual([[1, 2, 3]]);
    expect(llamadas).toHaveLength(1);
  });

  it('con un numero exacto de paginas llenas, la consulta de mas vuelve vacia y no produce nada', async () => {
    const filas = Array.from({ length: 400 }, (_, i) => i);
    const { leer, llamadas } = lecturaSobre(filas);

    const paginas = await recorrer(leer);

    expect(paginas.map((pagina) => pagina.length)).toEqual([200, 200]);
    expect(llamadas).toHaveLength(3);
  });

  it('es perezosa: no lee la pagina siguiente hasta que se la piden', async () => {
    const { leer, llamadas } = lecturaSobre(Array.from({ length: 450 }, (_, i) => i));
    const iterador = porPaginas(leer)[Symbol.asyncIterator]();

    await iterador.next();

    expect(llamadas).toHaveLength(1);
  });

  it('un fallo a mitad se propaga y no deja pasar lo que faltaba', async () => {
    let paginasPedidas = 0;
    const leer = (): Promise<readonly number[]> => {
      paginasPedidas += 1;

      return paginasPedidas === 1
        ? Promise.resolve(Array.from({ length: FILAS_POR_PAGINA }, (_, i) => i))
        : Promise.reject(new Error('la base se cayo'));
    };

    await expect(recorrer(leer)).rejects.toThrow('la base se cayo');
  });
});
