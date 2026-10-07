import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

/** AAAA-MM-DD. Que sea una fecha real lo comprueba el dominio. */
export const FORMATO_DE_DIA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Cuerpo de `POST /api/diario`.
 *
 * Aqui solo se comprueba el formato. La forma del documento, que el dia no
 * este en el futuro y que la anotacion no este vacia los decide el dominio.
 */
export class EscribirEnElDiarioDto {
  @ApiProperty({
    description:
      'Identificador de la operación, generado por el dispositivo. Reenviar el mismo valor en un reintento devuelve la anotación ya guardada en lugar de crear otra.',
    format: 'uuid',
  })
  @IsUUID()
  clientOperationId!: string;

  @ApiPropertyOptional({
    description:
      'El día al que pertenece, en el calendario de la persona. Si no viene, hoy. Puede ser un día pasado, nunca uno futuro.',
    example: '2026-10-03',
    format: 'date',
  })
  @IsOptional()
  @Matches(FORMATO_DE_DIA, { message: 'dia tiene que tener formato AAAA-MM-DD' })
  dia?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  titulo?: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description: 'El documento del editor, con "type": "doc". Nunca HTML.',
  })
  @IsObject()
  contenido!: Record<string, unknown>;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'object', additionalProperties: true },
    description: 'Los diagramas: { id, tipo: "diagrama", datos }. Como mucho diez.',
  })
  @IsOptional()
  @IsArray()
  adjuntos?: unknown[];
}
