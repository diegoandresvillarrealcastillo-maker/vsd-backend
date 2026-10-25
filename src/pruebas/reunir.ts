/**
 * Junta en una lista lo que una lectura por paginas entrega (SCRUM-262), para las pruebas que
 * quieren mirar todo a la vez. Nada de `src/` fuera de las pruebas debe usarlo: juntar las paginas
 * es justo lo que la lectura por paginas evita.
 */
export async function reunir<T>(paginas: AsyncIterable<readonly T[]>): Promise<T[]> {
  const todos: T[] = [];

  for await (const pagina of paginas) {
    todos.push(...pagina);
  }

  return todos;
}

/** Una lista por paginas sin nada que entregar. */
export function sinFilas<T = never>(): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]: () => ({
      next: () => Promise.resolve({ done: true as const, value: undefined }),
    }),
  };
}
