import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import type { Pendiente, Recordatorio } from '../../../domain/model/Pendiente.js';
import type { SemaforoDePendientes } from '../../../domain/ports/in/PendientesUseCase.js';

const NIVELES = ['urgente', 'prioridad', 'aplazable'] as const;

/** Un pendiente, tal como sale por la API (SCRUM-97). */
export class PendienteDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ maxLength: 280 })
  texto!: string;

  @ApiProperty({ enum: NIVELES })
  nivel!: string;

  @ApiProperty()
  hecho!: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: 'Mientras no llegue, no recuerda nada.',
  })
  posponerHasta!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  creadoEn!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  editadoEn!: string;

  static desde(pendiente: Pendiente): PendienteDto {
    const dto = new PendienteDto();

    dto.id = pendiente.id.value;
    dto.texto = pendiente.texto;
    dto.nivel = pendiente.nivel;
    dto.hecho = pendiente.hecho;
    dto.posponerHasta = pendiente.posponerHasta?.toISOString() ?? null;
    dto.creadoEn = pendiente.creadoEn.toISOString();
    dto.editadoEn = pendiente.editadoEn.toISOString();

    return dto;
  }
}

/** El recordatorio de esta visita. */
export class RecordatorioDto {
  @ApiProperty({ format: 'uuid' })
  pendienteId!: string;

  @ApiProperty({ enum: NIVELES })
  nivel!: string;

  @ApiProperty({ description: 'Días completos desde que se anotó.' })
  dias!: number;

  @ApiProperty({
    enum: NIVELES,
    nullable: true,
    type: String,
    description:
      'El nivel que se sugiere subir. Nunca se aplica solo: lo decide la persona. Null si ya es urgente.',
  })
  nivelSugerido!: string | null;

  @ApiProperty({
    enum: ['plazo', 'suave'],
    description:
      'Cómo suena. plazo: se acabó el tiempo que se le dio (urgente, prioridad). suave: no es urgente, pero que no se acumule (aplazable).',
  })
  tono!: string;

  static desde(recordatorio: Recordatorio): RecordatorioDto {
    const dto = new RecordatorioDto();

    dto.pendienteId = recordatorio.pendienteId.value;
    dto.nivel = recordatorio.nivel;
    dto.dias = recordatorio.dias;
    dto.nivelSugerido = recordatorio.nivelSugerido;
    dto.tono = recordatorio.tono;

    return dto;
  }
}

/** Lo que responde `GET /api/pendientes`. */
export class SemaforoDto {
  @ApiProperty({
    type: [PendienteDto],
    description:
      'Primero los sin hacer, por nivel y del más antiguo al más nuevo; después los hechos en los últimos 7 días.',
  })
  pendientes!: PendienteDto[];

  @ApiProperty({
    type: RecordatorioDto,
    nullable: true,
    description: 'Uno como mucho por visita, o null.',
  })
  recordatorio!: RecordatorioDto | null;

  static desde(semaforo: SemaforoDePendientes): SemaforoDto {
    const dto = new SemaforoDto();

    dto.pendientes = semaforo.pendientes.map((pendiente) => PendienteDto.desde(pendiente));
    dto.recordatorio =
      semaforo.recordatorio === null ? null : RecordatorioDto.desde(semaforo.recordatorio);

    return dto;
  }
}

/** Cuerpo de `POST /api/pendientes`. */
export class CrearPendienteDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Generado en el dispositivo. Reenviarlo en un reintento no duplica el pendiente.',
  })
  @IsUUID()
  clientOperationId!: string;

  @ApiProperty({ maxLength: 280 })
  @IsString()
  @MaxLength(280)
  texto!: string;

  @ApiProperty({ enum: NIVELES })
  @IsIn(NIVELES)
  nivel!: string;
}

/**
 * Cuerpo de `PATCH /api/pendientes/:id`. Lo que no viene se queda como estaba;
 * `posponerHasta: null` deja de posponer.
 */
export class EditarPendienteDto {
  @ApiPropertyOptional({ maxLength: 280 })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  texto?: string;

  @ApiPropertyOptional({ enum: NIVELES })
  @IsOptional()
  @IsIn(NIVELES)
  nivel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hecho?: boolean;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
    description:
      'Hasta cuándo no recuerda nada. Futura y como mucho a 90 días. Null deja de posponer.',
  })
  // Null tiene sentido propio (dejar de posponer): solo se valida si es fecha.
  @ValidateIf(
    (dto: EditarPendienteDto) => dto.posponerHasta !== null && dto.posponerHasta !== undefined,
  )
  @Type(() => Date)
  @IsDate()
  posponerHasta?: Date | null;
}
