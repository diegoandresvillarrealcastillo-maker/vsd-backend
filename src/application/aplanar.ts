/**
 * Entrega uno a uno lo que una lectura por paginas trae de a muchos (SCRUM-262).
 *
 * Es perezoso de punta a punta: la lectura ni se abre hasta que alguien pide el primer elemento, y
 * no se pide la pagina siguiente hasta que se consumio la anterior. Quien escribe a un cliente lento
 * no hace que se lea por adelantado, y quien no llega a recorrerla no dejo una consulta empezada.
 */
export async function* aplanar<T>(
  abrir: () => AsyncIterable<readonly T[]>,
): AsyncGenerator<T, void, undefined> {
  for await (const pagina of abrir()) {
    yield* pagina;
  }
}
