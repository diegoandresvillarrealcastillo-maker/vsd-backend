import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';

export interface AbrirCartaCommand {
  readonly userId: string;
  /** La zona horaria de la persona, de su cuenta: decide cual es "hoy". */
  readonly zonaHoraria: string;
  readonly entradaId: string;
}

/**
 * Puerto de entrada: abrir una carta a mi de manana para leerla (SCRUM-230). Es lo unico que
 * entrega su texto mientras espera. Solo desde el dia siguiente al que se escribio; abrirla otra vez
 * devuelve lo mismo.
 */
export interface AbrirCartaUseCase {
  execute(command: AbrirCartaCommand): Promise<EntradaDeDiario>;
}
