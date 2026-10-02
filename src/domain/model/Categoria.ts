import type { Activity } from './Activity.js';
import { InvalidActivityConfigurationError } from './DomainError.js';
import type { CategoryId } from './Identifier.js';

/** Datos necesarios para describir una categoria del catalogo. */
export interface DatosDeCategoria {
  readonly id: CategoryId;
  readonly nombre: string;
  readonly descripcion?: string | undefined;
  readonly actividades: readonly Activity[];
}

/**
 * Una categoria del catalogo, con las actividades que contiene.
 *
 * Lleva dentro sus actividades en lugar de ser una simple etiqueta porque es
 * asi como se pide y como se muestra: nadie quiere la lista de categorias por
 * un lado y la de actividades por otro para tener que cruzarlas despues. Con
 * la relacion resuelta aqui, la consulta a la base es una sola.
 */
export class Categoria {
  readonly id: CategoryId;
  readonly nombre: string;
  readonly descripcion: string | undefined;
  readonly actividades: readonly Activity[];

  private constructor(datos: DatosDeCategoria) {
    this.id = datos.id;
    this.nombre = datos.nombre;
    this.descripcion = datos.descripcion;
    this.actividades = datos.actividades;
  }

  static create(datos: DatosDeCategoria): Categoria {
    if (datos.nombre.trim() === '') {
      throw new InvalidActivityConfigurationError('(categoría sin nombre)', 'no tiene nombre');
    }

    return new Categoria({ ...datos, actividades: [...datos.actividades] });
  }

  /**
   * Indica si la categoria tiene algo que ofrecer.
   *
   * Una categoria sin actividades activas no es un error —el administrador
   * puede haberlas retirado todas— pero mostrarla vacia deja a la persona
   * mirando una pantalla que no hace nada.
   */
  tieneActividades(): boolean {
    return this.actividades.length > 0;
  }
}
