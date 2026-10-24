import type { CartaEnEspera } from '../out/DiarioRepositoryPort.js';

export interface ConsultarCartasEnEsperaQuery {
  readonly userId: string;
  /** La zona horaria de la persona, de su cuenta: decide cual es "hoy". */
  readonly zonaHoraria: string;
}

/**
 * Puerto de entrada: las cartas que la persona se dejo y todavia no abrio ni borro, de un dia que
 * ya paso y dentro de su semana de espera, la mas reciente primero (SCRUM-230). **Sin su texto**: la
 * tarjeta «Ayer te dejaste esto» las ofrece y la persona decide si leerlas o borrarlas.
 */
export interface ConsultarCartasEnEsperaUseCase {
  execute(query: ConsultarCartasEnEsperaQuery): Promise<readonly CartaEnEspera[]>;
}
