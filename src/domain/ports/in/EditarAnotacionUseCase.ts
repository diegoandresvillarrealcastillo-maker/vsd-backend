import type { AnotacionGuardada } from './EscribirEnElDiarioUseCase.js';

export interface EditarAnotacionCommand {
  readonly userId: string;
  readonly entradaId: string;
  /** La version que tenia quien edita cuando abrio la anotacion. */
  readonly version: number;
  /** `null` quita el titulo; `undefined` lo deja como estaba. */
  readonly titulo?: string | null | undefined;
  readonly contenido?: unknown;
  readonly adjuntos?: unknown;
  /**
   * La hora en que el dispositivo hizo la edicion (ISO 8601), si la mando. El plazo
   * de una hora se mide contra ella y no contra cuando llega (SCRUM-144). Ver
   * `EscribirEnElDiarioCommand.escritaEn` para lo que pasa si no sirve.
   */
  readonly editadaEn?: unknown;
  /** Ver `EscribirEnElDiarioCommand.conRecomendaciones`. */
  readonly conRecomendaciones: boolean;
  /**
   * La zona de la cuenta. De ella sale el pais de las lineas de atencion
   * (SCRUM-124).
   */
  readonly zonaHoraria: string;
}

/**
 * Puerto de entrada: corregir una anotacion propia durante su primera hora
 * (SCRUM-95).
 */
export interface EditarAnotacionUseCase {
  execute(command: EditarAnotacionCommand): Promise<AnotacionGuardada>;
}
