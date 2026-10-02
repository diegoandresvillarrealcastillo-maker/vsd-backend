import type { Categoria } from '../../domain/model/Categoria.js';
import type { ConsultarCatalogoUseCase } from '../../domain/ports/in/ConsultarCatalogoUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';

/**
 * Devuelve el catalogo, sin las categorias que se quedaron vacias.
 *
 * El filtro vive aqui y no en el adaptador a proposito. Que una categoria sin
 * actividades no se ofrezca es una decision de producto —una seccion vacia
 * deja a la persona pulsando algo que no lleva a ningun sitio—, no una
 * particularidad de como guarda las filas PostgreSQL. Si manana se decide
 * mostrarlas en gris en vez de esconderlas, se cambia esta linea y no el
 * adaptador.
 */
export class ConsultarCatalogoUseCaseImpl implements ConsultarCatalogoUseCase {
  constructor(private readonly actividades: ActivityRepositoryPort) {}

  async ejecutar(): Promise<readonly Categoria[]> {
    const catalogo = await this.actividades.listarCatalogo();

    return catalogo.filter((categoria) => categoria.tieneActividades());
  }
}
