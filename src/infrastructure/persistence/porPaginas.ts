import { FILAS_POR_PAGINA } from '../../domain/ports/out/LecturaPorPaginas.js';

/**
 * Recorre una lectura por cursor de a `FILAS_POR_PAGINA` filas (SCRUM-262).
 *
 * `leer(ultima, limite)` devuelve las siguientes `limite` filas **estrictamente despues** de
 * `ultima` (o las primeras si todavia no hay ninguna), en un orden total: el cursor es la ultima
 * fila de la pagina anterior, asi que dos filas con la misma hora no pueden quedar una en cada
 * lado ni repetirse. Cada pagina es su propia consulta y su propia sesion.
 *
 * Se detiene al recibir una pagina corta; si la ultima pagina llena era justo la ultima, la
 * siguiente consulta vuelve vacia y no produce nada.
 */
export async function* porPaginas<Fila>(
  leer: (ultima: Fila | undefined, limite: number) => Promise<readonly Fila[]>,
): AsyncGenerator<readonly Fila[], void, undefined> {
  let ultima: Fila | undefined;

  for (;;) {
    const pagina = await leer(ultima, FILAS_POR_PAGINA);

    if (pagina.length === 0) {
      return;
    }

    yield pagina;

    if (pagina.length < FILAS_POR_PAGINA) {
      return;
    }

    ultima = pagina.at(-1);
  }
}
