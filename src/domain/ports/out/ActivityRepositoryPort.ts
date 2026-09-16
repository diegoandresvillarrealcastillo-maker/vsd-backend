import type { Activity } from '../../model/Activity.js';
import type { ActivityId } from '../../model/Identifier.js';

/**
 * Puerto de salida para consultar el catalogo de actividades.
 *
 * El caso de uso necesita la actividad para poder interpretar el puntaje: sin
 * ella no sabe sobre que maximo se obtuvo, ni hacia donde va la escala, ni
 * donde estan los cortes de nivel.
 *
 * Antes ese maximo llegaba en la peticion, lo cual era un error de diseno: el
 * cliente podia declarar cualquier maximo y el nivel salia de ahi. La escala
 * es una propiedad de la actividad, no de quien la reporta.
 */
export interface ActivityRepositoryPort {
  /** Devuelve la actividad, o `null` si no existe en el catalogo. */
  findById(id: ActivityId): Promise<Activity | null>;
}
