import type { UserId } from '../../model/Identifier.js';
import type { RecursoApoyo } from '../../model/RecursoApoyo.js';
import type { NivelDeAcompanamiento } from '../../model/AcompanamientoPorRiesgo.js';

/**
 * Lo que la persona ve del acompanamiento por dias seguidos con atencion (SCRUM-177).
 *
 * **Solo el nivel**: ni el puntaje, ni cuantos dias van, ni cuales fueron.
 */
export interface Acompanamiento {
  readonly nivel: NivelDeAcompanamiento;
  /**
   * Las lineas de atencion del pais de la persona, **solo con el nivel critico**. Vacio en los
   * demas: el aviso moderado ofrece hablarlo, no llena la pantalla de numeros.
   */
  readonly lineasDeAtencion: readonly RecursoApoyo[];
}

/**
 * Puerto de entrada: el acompanamiento de la cuenta propia (SCRUM-177).
 *
 * El identificador sale de la sesion. Se calcula a partir de los resultados, en el calendario de
 * la zona de la persona: no hay nada guardado aparte.
 */
export interface ConsultarAcompanamientoUseCase {
  execute(cuenta: UserId): Promise<Acompanamiento>;
}
