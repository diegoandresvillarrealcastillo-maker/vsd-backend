import type { UserId } from '../../model/Identifier.js';
import type { User } from '../../model/User.js';

/** La foto de perfil, con lo que hace falta para mostrarla. */
export interface FotoLeida {
  readonly contenido: Uint8Array;
  readonly tipo: string;
  readonly actualizadaEl: Date;
}

/**
 * Puerto de entrada: la foto de perfil de la cuenta propia (SCRUM-120).
 *
 * Los tres metodos reciben **solo** la persona, que sale del token verificado.
 * No hay forma de pedir, cambiar ni quitar la foto de otra.
 */
export interface FotoDePerfilUseCase {
  /**
   * Valida y guarda la foto, y la deja anotada en la cuenta. Devuelve la cuenta
   * como quedo.
   */
  guardar(persona: UserId, contenido: Uint8Array, tipoDeclarado: string): Promise<User>;

  /** La foto de la persona. Falla con `FOTO_NO_ENCONTRADA` si no tiene. */
  leer(persona: UserId): Promise<FotoLeida>;

  /** Quita la foto, si la hay. Devuelve la cuenta como quedo. */
  quitar(persona: UserId): Promise<User>;
}
