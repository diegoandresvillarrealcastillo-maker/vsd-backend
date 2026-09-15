import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsObject, IsOptional, IsUUID, Max, Min, ValidateIf } from 'class-validator';

/**
 * Cuerpo de la peticion para registrar el resultado de una actividad.
 *
 * Valida el **formato** de lo que llega por HTTP. Las reglas de negocio las
 * sigue haciendo cumplir el dominio.
 *
 * No es duplicar trabajo: esta capa protege la frontera y devuelve un 400 con
 * detalle util, mientras que el dominio garantiza sus invariantes venga la
 * llamada de donde venga. Si manana el caso de uso se invoca desde la cola de
 * sincronizacion sin pasar por HTTP, las reglas siguen aplicandose igual.
 */
export class RegistrarResultadoDto {
  @ApiProperty({
    description: 'Identificador de la persona que realizo la actividad.',
    format: 'uuid',
    example: '11111111-1111-4111-8111-111111111111',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description: 'Identificador de la actividad realizada.',
    format: 'uuid',
    example: '33333333-3333-4333-a333-333333333333',
  })
  @IsUUID()
  activityId!: string;

  @ApiProperty({
    description:
      'Identificador de la operacion, generado por el dispositivo. Reenviar el mismo valor en un reintento evita que se duplique el resultado.',
    format: 'uuid',
    example: '44444444-4444-4444-b444-444444444444',
  })
  @IsUUID()
  clientOperationId!: string;

  @ApiPropertyOptional({
    description:
      'Puntaje obtenido. Se omite en las actividades de registro, como una bitacora de sueno, que producen datos y no una calificacion.',
    example: 8,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @ApiPropertyOptional({
    description:
      'Puntaje maximo posible de la actividad. Obligatorio si se envia score. Migrara a la propia actividad en SCRUM-55.',
    example: 10,
    minimum: 1,
  })
  @ValidateIf((dto: RegistrarResultadoDto) => dto.score !== undefined)
  @IsInt()
  @Min(1)
  @Max(1000)
  maxScore?: number;

  @ApiPropertyOptional({
    description:
      'Informacion propia del tipo de actividad: las horas de una bitacora de sueno, las respuestas de un registro emocional. No puede traer claves que ya sean campos propios.',
    example: { horasDormidas: 6.5, despertares: 2 },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Momento en que se completo la actividad. No puede estar en el futuro.',
    type: String,
    format: 'date-time',
    example: '2026-09-14T11:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  completedAt!: Date;
}
