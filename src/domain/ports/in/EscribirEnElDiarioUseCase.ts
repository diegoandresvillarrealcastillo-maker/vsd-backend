import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';
import type { RecursoApoyo } from '../../model/RecursoApoyo.js';

/**
 * Una anotacion recien guardada, con lo que conviene ensenar junto a ella.
 *
 * Lo devuelven escribir y editar. `sugiereAcompanamiento` y las lineas se
 * calculan en cada respuesta y no se guardan: la anotacion no lleva ninguna
 * marca de lo que se detecto en ella. Y solo se calculan si la persona lo
 * permitio (SCRUM-108); si no, van en falso y vacias.
 */
export interface AnotacionGuardada {
  readonly entrada: EntradaDeDiario;
  readonly sugiereAcompanamiento: boolean;
  readonly lineasDeAtencion: readonly RecursoApoyo[];
}

export interface EscribirEnElDiarioCommand {
  readonly userId: string;
  /** La zona horaria de la persona, de su cuenta: decide cual es "hoy". */
  readonly zonaHoraria: string;
  readonly clientOperationId: string;
  /** AAAA-MM-DD. Si no viene, hoy en el calendario de la persona. */
  readonly dia?: string | undefined;
  readonly titulo?: string | undefined;
  /** El documento del editor. Su forma la comprueba el dominio. */
  readonly contenido: unknown;
  readonly adjuntos?: unknown;
  /**
   * Si la persona permitio que su diario se lea para recomendarle (SCRUM-108).
   * Sin ese permiso, lo escrito no pasa por ninguna deteccion.
   */
  readonly conRecomendaciones: boolean;
}

/** Puerto de entrada: escribir una anotacion en el diario propio (SCRUM-95). */
export interface EscribirEnElDiarioUseCase {
  execute(command: EscribirEnElDiarioCommand): Promise<AnotacionGuardada>;
}
