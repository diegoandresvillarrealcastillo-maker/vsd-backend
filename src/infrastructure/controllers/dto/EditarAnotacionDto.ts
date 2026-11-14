import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

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

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-10-07T14:30:00.000Z',
    description:
      'La hora en que el dispositivo hizo la corrección, en ISO 8601 con desplazamiento. El plazo de una hora se mide contra ella y no contra cuando llega la petición: corregida a las 9:30 sin conexión y recibida a las 14:00, se aplica como corrección. Nunca hace fallar la petición: si no sirve (mal formada, en el futuro, de hace más de 30 días o anterior a la hora en que se escribió la anotación) se ignora y se usa la hora del servidor.',
  })
  // Ver `EscribirEnElDiarioDto.escritaEn`.
  @Allow()
  @IsOptional()
  editadaEn?: unknown;
}
