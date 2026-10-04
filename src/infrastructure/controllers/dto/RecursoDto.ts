import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RecursoApoyo } from '../../../domain/model/RecursoApoyo.js';

/**
 * Un recurso de apoyo tal y como sale por la API.
 *
 * Lo comparten el asistente y el registro de resultados (SCRUM-94): las
 * lineas de atencion se ven igual vengan de donde vengan.
 */
export class RecursoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Línea 192, opción 4' })
  titulo!: string;

  @ApiPropertyOptional()
  descripcion?: string;

  @ApiProperty({ example: 'contacto', enum: ['contacto', 'lectura', 'ejercicio'] })
  tipo!: string;

  @ApiPropertyOptional({
    description:
      'Donde sirve el recurso. La interfaz deberia mostrarlo: un telefono que solo atiende en una ciudad no ayuda a quien esta fuera de ella.',
    example: 'nacional',
  })
  cobertura?: string;

  @ApiPropertyOptional({ format: 'uri' })
  enlace?: string;

  static desde(recurso: RecursoApoyo): RecursoDto {
    const dto = new RecursoDto();

    dto.id = recurso.id;
    dto.titulo = recurso.titulo;
    dto.tipo = recurso.tipo;

    if (recurso.descripcion !== undefined) {
      dto.descripcion = recurso.descripcion;
    }

    if (recurso.cobertura !== undefined) {
      dto.cobertura = recurso.cobertura;
    }

    if (recurso.enlace !== undefined) {
      dto.enlace = recurso.enlace;
    }

    return dto;
  }
}
