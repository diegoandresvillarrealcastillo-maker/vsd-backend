import type { UserId } from '../../model/Identifier.js';
import type { CursorDelCiclo, DatoCurioso } from '../../model/DatoCurioso.js';

/**
 * Puerto de salida: el catalogo de datos curiosos y el cursor de cada persona
 * (SCRUM-185, ADR 0025).
 *
 * **El orden de cada persona no se guarda.** Cada adaptador lo calcula con un hash del
 * identificador de la persona y el del dato, de modo que el catalogo puede tener 100 mil
 * filas sin una sola mas por cuenta. Lo unico que se guarda de ella es el cursor.
 */
export interface DatoCuriosoRepositoryPort {
  /** El cursor de esa persona, o `null` si todavia no se le ha dado ningun dato. */
  cursorDe(userId: UserId): Promise<CursorDelCiclo | null>;

  /**
   * Un dato por su identificador, **publicado o no**: quien ya lo tiene como el del dia lo
   * conserva hasta que termine el dia aunque se retire. `null` si se borro.
   */
  porId(id: string): Promise<DatoCurioso | null>;

  /**
   * El dato publicado que sigue, en el orden de esa persona, despues de donde va.
   *
   * Sin cursor, el primero de su orden. Si no queda ninguno despues del cursor, vuelve al
   * principio: empieza un ciclo nuevo. `null` solo si no hay ningun dato publicado.
   */
  siguienteDespuesDe(
    userId: UserId,
    despuesDe: { readonly clave: bigint; readonly idDato: string | null } | null,
  ): Promise<{ readonly dato: DatoCurioso; readonly clave: bigint } | null>;

  /** Deja el cursor de esa persona donde se dice. Una fila por persona. */
  guardarCursor(userId: UserId, cursor: CursorDelCiclo): Promise<void>;
}
