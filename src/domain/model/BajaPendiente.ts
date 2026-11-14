import type { UserId } from './Identifier.js';

/**
 * Una baja de cuenta que se pidio y todavia no termino (SCRUM-267, ADR 0040).
 *
 * Es la marca que se deja antes de borrar lo de fuera de la base (archivos e identidad): mientras
 * exista, la baja se termina sola. No guarda nada personal, solo de quien es, si lleva constancia
 * y cuando se pidio.
 */
export interface BajaPendiente {
  readonly id: UserId;
  /** Si al terminar se deja la constancia minima (la baja que pide la persona) o no (un menor). */
  readonly conConstancia: boolean;
  readonly pedidaEl: Date;
}
