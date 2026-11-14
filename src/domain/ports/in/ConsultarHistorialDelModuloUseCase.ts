import type { PaginaDelHistorial } from '../../model/HistorialDelModulo.js';
import type { UserId } from '../../model/Identifier.js';
import type { Modulo } from '../../model/Preferencias.js';

export interface ConsultarHistorialDelModuloCommand {
  readonly userId: UserId;
  readonly modulo: Modulo;
  /** Cuantos hechos por pagina. Se acota: nunca menos de uno ni mas del maximo. */
  readonly limite?: number | undefined;
  /** El texto que dio la pagina anterior. Sin el, la primera. */
  readonly pagina?: string | undefined;
}

/**
 * Puerto de entrada: el historial de un modulo de la cuenta propia (SCRUM-184), del mas
 * reciente al mas antiguo, por paginas que arma el servidor.
 */
export interface ConsultarHistorialDelModuloUseCase {
  execute(command: ConsultarHistorialDelModuloCommand): Promise<PaginaDelHistorial>;
}
