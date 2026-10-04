import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';

export interface ConsultarDiarioQuery {
  readonly userId: string;
  /** AAAA-MM-DD. Si no viene, el mismo dia que `hasta`. */
  readonly desde?: string | undefined;
  /** AAAA-MM-DD. Si no viene, hoy en el calendario de la persona. */
  readonly hasta?: string | undefined;
}

/** Puerto de entrada: las anotaciones propias de un rango de dias (SCRUM-95). */
export interface ConsultarDiarioUseCase {
  execute(query: ConsultarDiarioQuery): Promise<readonly EntradaDeDiario[]>;
}
