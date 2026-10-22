import type { UserId } from '../../model/Identifier.js';
import type { User } from '../../model/User.js';

/**
 * Lo que la persona manda al volver a aceptar: las casillas y la version de cada texto que
 * ve en pantalla, como en el registro. Solo cuenta lo que esta pendiente.
 */
export interface AceptarTextosCommand {
  readonly aceptaAviso?: boolean | undefined;
  readonly versionPolitica?: string | undefined;
  readonly aceptaTerminos?: boolean | undefined;
  readonly versionTerminos?: string | undefined;
}

/**
 * Puerto de entrada: volver a aceptar el aviso de privacidad y los terminos cuando cambian
 * (SCRUM-237).
 *
 * Recibe el identificador de la cuenta, que el controlador saca de la sesion y nunca del
 * cuerpo: nadie acepta en nombre de otra persona.
 */
export interface AceptarTextosVigentesUseCase {
  /**
   * Guarda la aceptacion de **todo** lo que esta pendiente y devuelve la cuenta como quedo.
   * Sin nada pendiente no cambia nada.
   */
  execute(cuenta: UserId, aceptacion: AceptarTextosCommand): Promise<User>;
}
