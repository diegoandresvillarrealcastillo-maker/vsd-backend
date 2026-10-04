import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/**
 * Cuerpo de `PATCH /api/diario/:id`.
 *
 * Lo que no viene se queda como estaba. `titulo: null` lo quita, y
 * `adjuntos: null` quita los diagramas.
 */
export class EditarAnotacionDto {
  @ApiProperty({
    description:
      'La versión de la anotación cuando se abrió para editar. Si ya no es la actual, la edición se rechaza con 409 VERSION_DESACTUALIZADA.',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  version!: number;

  @ApiPropertyOptional({ maxLength: 120, nullable: true, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  titulo?: string | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description: 'El documento del editor completo, con "type": "doc".',
  })
  @IsOptional()
  @IsObject()
  contenido?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: 'array',
    nullable: true,
    items: { type: 'object', additionalProperties: true },
  })
  @IsOptional()
  @IsArray()
  adjuntos?: unknown[] | null;
}
