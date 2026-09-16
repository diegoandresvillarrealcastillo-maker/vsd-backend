import type { RecursoApoyo } from '../../model/RecursoApoyo.js';

/**
 * Puerto de salida hacia la base de conocimiento del asistente.
 *
 * Los dos metodos estan separados a proposito. `lineasDeAtencion` es el camino
 * que se recorre cuando alguien escribe algo preocupante, y no depende de
 * ningun tema, de ninguna coincidencia y de ninguna interpretacion: devuelve
 * siempre lo mismo. Mezclarlo con la busqueda por tema lo habria hecho
 * depender de que la consulta acertara.
 */
export interface RecursoApoyoRepositoryPort {
  /**
   * Los telefonos y servicios a los que se puede acudir.
   *
   * Ordenados por alcance: lo que sirve en todo el pais va primero.
   */
  lineasDeAtencion(): Promise<readonly RecursoApoyo[]>;

  /** Recursos sobre un tema concreto. Lista vacia si no hay ninguno. */
  porTema(tema: string): Promise<readonly RecursoApoyo[]>;
}
