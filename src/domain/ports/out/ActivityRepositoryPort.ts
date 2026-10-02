import type { Activity } from '../../model/Activity.js';
import type { Categoria } from '../../model/Categoria.js';
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

  /**
   * Devuelve el catalogo completo: las categorias con sus actividades activas.
   *
   * Es una sola operacion y no dos —categorias por un lado, actividades por
   * otro— porque asi es como se pide y como se muestra. Separarlas obligaria a
   * cruzarlas despues y, contra la base, a una consulta por categoria.
   *
   * **Las actividades desactivadas no salen.** El administrador las retira por
   * algun motivo, y ofrecer una que luego no deja registrar el resultado es
   * peor que no ofrecerla.
   */
  listarCatalogo(): Promise<readonly Categoria[]>;
}
