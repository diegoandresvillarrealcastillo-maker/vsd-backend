/**
 * Cuantas filas trae a la vez una lectura que recorre **todo** lo de una persona (SCRUM-262).
 *
 * Esas lecturas (la exportacion de sus datos, su historial completo) no tienen un tope natural: lo
 * que crece con los anos de uso es lo de ella. Se piden por paginas con un cursor, de a este
 * numero de filas, y se entregan como `AsyncIterable<readonly T[]>` para que quien las consume las
 * escriba o las cuente sin tenerlas todas juntas en memoria. Una pagina es una consulta corta con
 * su propia sesion: no se mantiene abierta una transaccion mientras el cliente lee despacio.
 *
 * El numero no es un parametro de las lecturas a proposito: que una peticion pueda pedir paginas de
 * un millon de filas es justo lo que esto evita.
 */
export const FILAS_POR_PAGINA = 200;
