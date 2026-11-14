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
   * Los telefonos y servicios a los que se puede acudir **en ese pais**.
   *
   * `pais` es el codigo ISO de dos letras que sale de la zona horaria de la
   * persona (`paisDeLaZona`), o `undefined` si esa zona no es de ningun pais
   * con lineas verificadas. En ese caso, y tambien si de un pais no hubiera
   * ninguna fila, la respuesta es el directorio internacional: **nunca** el
   * telefono de otro pais como si fuera suyo (SCRUM-124).
   *
   * El parametro es obligatorio a proposito: un `lineasDeAtencion()` sin pais
   * que "devuelve todas" es justo la llamada que hay que impedir.
   *
   * Ordenados por alcance: lo que sirve en todo el pais va primero.
   */
  lineasDeAtencion(pais: string | undefined): Promise<readonly RecursoApoyo[]>;

  /** Recursos sobre un tema concreto. Lista vacia si no hay ninguno. */
  porTema(tema: string): Promise<readonly RecursoApoyo[]>;
}
