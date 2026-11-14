/**
 * Una lista del objeto JSON que no se tiene entera: sus elementos llegan de uno en uno y se
 * escriben sin acumularlos (SCRUM-262).
 */
export class ListaEnFlujo {
  constructor(readonly elementos: AsyncIterable<unknown>) {}
}

/** Entrega `convertir(elemento)` por cada elemento, sin leer el siguiente hasta que se consumio este. */
export async function* convertirEnFlujo<T, R>(
  elementos: AsyncIterable<T>,
  convertir: (elemento: T) => R,
): AsyncGenerator<R, void, undefined> {
  for await (const elemento of elementos) {
    yield convertir(elemento);
  }
}

/**
 * Escribe un objeto JSON pieza a pieza, en el orden dado.
 *
 * El texto es el mismo que daria `JSON.stringify` del objeto entero y compacto (sin espacios): las
 * claves en ese orden, los valores con `JSON.stringify` y cada `ListaEnFlujo` como un arreglo cuyos
 * elementos se escriben uno a uno. Lo que cambia es que nunca existe el objeto completo: en memoria
 * esta, como mucho, un elemento (SCRUM-262).
 *
 * Si la lista falla a mitad, la excepcion sale de aqui con el texto ya entregado **incompleto**: ese
 * JSON no se puede leer, que es lo correcto. Quien escribe la respuesta tiene que cortarla, no
 * cerrarla como si hubiera terminado.
 */
export async function* objetoJsonEnFlujo(
  entradas: ReadonlyArray<readonly [clave: string, valor: unknown]>,
): AsyncGenerator<string, void, undefined> {
  yield '{';

  let primera = true;

  for (const [clave, valor] of entradas) {
    yield `${primera ? '' : ','}${JSON.stringify(clave)}:`;
    primera = false;

    if (!(valor instanceof ListaEnFlujo)) {
      yield JSON.stringify(valor);
      continue;
    }

    yield '[';

    let primero = true;

    for await (const elemento of valor.elementos) {
      yield `${primero ? '' : ','}${JSON.stringify(elemento)}`;
      primero = false;
    }

    yield ']';
  }

  yield '}';
}
