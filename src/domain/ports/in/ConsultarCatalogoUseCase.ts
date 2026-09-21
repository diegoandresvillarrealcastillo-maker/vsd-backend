import type { Categoria } from '../../model/Categoria.js';

/**
 * Puerto de entrada para consultar el catalogo.
 *
 * Es una lectura sin parametros: el catalogo es el mismo para todo el mundo.
 * No depende de quien pregunta y no toca ni un dato de nadie, que es lo que lo
 * distingue del resto de operaciones del sistema.
 */
export interface ConsultarCatalogoUseCase {
  /**
   * Devuelve las categorias con sus actividades disponibles.
   *
   * Las categorias que se quedaron sin actividades activas no salen: una
   * seccion vacia en pantalla deja a la persona pulsando algo que no lleva a
   * ningun sitio.
   */
  ejecutar(): Promise<readonly Categoria[]>;
}
