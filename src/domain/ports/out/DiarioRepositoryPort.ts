import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';
import type { UserId } from '../../model/Identifier.js';

/**
 * Puerto de salida del diario.
 *
 * Por ahora solo lee, para la exportacion de datos. Escribir llega con
 * SCRUM-95.
 */
export interface DiarioRepositoryPort {
  /** Todas las entradas de esa persona, de la mas antigua a la mas reciente. */
  todasDe(userId: UserId): Promise<readonly EntradaDeDiario[]>;
}
