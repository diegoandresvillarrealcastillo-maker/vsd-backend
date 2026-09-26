import { ApiProperty } from '@nestjs/swagger';

import type { Activity } from '../../../domain/model/Activity.js';
import type { Categoria } from '../../../domain/model/Categoria.js';

/**
 * Una actividad, tal como se ofrece en el catalogo.
 *
 * ---------------------------------------------------------------------------
 * Lo que deliberadamente NO sale
 * ---------------------------------------------------------------------------
 *
 * Ni el puntaje maximo, ni los umbrales, ni los textos de nivel. No es un
 * olvido.
 *
 * El catalogo sirve para **elegir** una actividad, y para eso basta con saber
 * que es, como se hace y cuanto dura. Interpretar un resultado es otra cosa y
 * ocurre en el servidor: si el cliente conociera el maximo y los cortes,
 * podria calcular el nivel por su cuenta y ensenarlo, y entonces habria dos
 * interpretaciones del mismo dato que pueden no coincidir.
 *
 * `produceNivel` es lo unico que se necesita saber de antemano, porque cambia
 * la pantalla: una bitacora no muestra resultado al terminar y un juego si.
 */
export class ActividadDelCatalogoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Parejas de cartas' })
  nombre!: string;

  @ApiProperty({
    required: false,
    example: 'juego',
    description: 'Como se realiza: juego, preguntas o bitacora.',
  })
  tipo?: string;

  @ApiProperty({
    required: false,
    example: 'Encuentra las parejas iguales en el menor número de intentos.',
  })
  descripcion?: string;

  @ApiProperty({
    example: true,
    description:
      'Si al terminar hay un nivel orientativo que mostrar. Las bitacoras no lo tienen: registran, no califican.',
  })
  produceNivel!: boolean;

  static desde(actividad: Activity): ActividadDelCatalogoDto {
    const dto = new ActividadDelCatalogoDto();

    dto.id = actividad.id.value;
    dto.nombre = actividad.nombre;
    dto.produceNivel = actividad.puntua();

    if (actividad.tipo !== undefined) {
      dto.tipo = actividad.tipo;
    }

    if (actividad.descripcion !== undefined) {
      dto.descripcion = actividad.descripcion;
    }

    return dto;
  }
}

/** Una categoria con las actividades que ofrece. */
export class CategoriaDelCatalogoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Cognición' })
  nombre!: string;

  @ApiProperty({ required: false })
  descripcion?: string;

  @ApiProperty({ type: [ActividadDelCatalogoDto] })
  actividades!: ActividadDelCatalogoDto[];

  static desde(categoria: Categoria): CategoriaDelCatalogoDto {
    const dto = new CategoriaDelCatalogoDto();

    dto.id = categoria.id.value;
    dto.nombre = categoria.nombre;
    dto.actividades = categoria.actividades.map((actividad) =>
      ActividadDelCatalogoDto.desde(actividad),
    );

    if (categoria.descripcion !== undefined) {
      dto.descripcion = categoria.descripcion;
    }

    return dto;
  }
}
