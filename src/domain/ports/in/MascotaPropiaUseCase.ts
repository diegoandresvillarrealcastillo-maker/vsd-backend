import type { UserId } from '../../model/Identifier.js';
import type { User } from '../../model/User.js';

/** La mascota propia, con lo que hace falta para mostrarla. */
export interface MascotaPropiaLeida {
  /** El SVG, ya saneado: lo que se guardo, no lo que subio la persona. */
  readonly contenido: Uint8Array;
  readonly tipo: string;
  readonly actualizadaEl: Date;
}

/**
 * Puerto de entrada: la mascota propia de la cuenta propia (SCRUM-122).
 *
 * Los tres metodos reciben **solo** la persona, que sale del token verificado.
 * No hay forma de pedir, cambiar ni quitar la mascota de otra.
 */
export interface MascotaPropiaUseCase {
  /**
   * Valida y sanea el SVG, lo guarda y deja anotado en la cuenta que lo hay.
   * Devuelve la cuenta como quedo. **No** la elige como mascota: eso se hace
   * con las preferencias.
   */
  guardar(persona: UserId, contenido: Uint8Array, tipoDeclarado: string): Promise<User>;

  /** La mascota propia. Falla con `MASCOTA_PROPIA_NO_ENCONTRADA` si no tiene. */
  leer(persona: UserId): Promise<MascotaPropiaLeida>;

  /**
   * La quita, si la hay. Si era la mascota elegida, la persona vuelve al
   * personaje de siempre, con el nombre que le habia puesto. Devuelve la cuenta
   * como quedo.
   */
  quitar(persona: UserId): Promise<User>;
}
