import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

/** La mascota tal como llega. El formato fino lo valida el dominio. */
export class MascotaDto {
  @ApiProperty({ description: 'Forma del modelo.', example: 'brote', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  forma!: string;

  @ApiProperty({ description: 'Color principal, #RRGGBB.', example: '#a2d9b6', maxLength: 7 })
  @IsString()
  @MaxLength(7)
  color!: string;

  @ApiProperty({ description: 'Accesorio, o "ninguno".', example: 'bufanda', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  accesorio!: string;

  @ApiProperty({ description: 'Nombre de la mascota.', example: 'Luma', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  nombre!: string;
}

/**
 * Cuerpo de `PATCH /api/cuenta/preferencias`.
 *
 * Los dos campos son opcionales: lo que no venga se queda como estaba. Fijate
 * en lo que **no** lleva: ni correo, ni rol, ni identificador. Con
 * `forbidNonWhitelisted` activo, mandar cualquiera de ellos produce un 400.
 */
export class ActualizarPreferenciasDto {
  @ApiPropertyOptional({
    description:
      'Modulos activos. Al menos uno. Reemplaza la lista entera, no la mezcla con la anterior.',
    type: [String],
    enum: ['cognicion', 'bienestar', 'emociones'],
    example: ['cognicion', 'emociones'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  modulosActivos?: string[];

  @ApiPropertyOptional({ description: 'La mascota completa.', type: MascotaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MascotaDto)
  mascota?: MascotaDto;
}
