import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import type { Pendiente, Recordatorio } from '../../../domain/model/Pendiente.js';
import type { SemaforoDePendientes } from '../../../domain/ports/in/PendientesUseCase.js';

const NIVELES = ['urgente', 'prioridad', 'aplazable'] as const;

/** Forma de un dia; que sea un dia real lo comprueba el dominio. */
const FORMATO_DE_DIA = /^\d{4}-\d{2}-\d{2}$/;

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

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    example: '2026-10-12',
    description:
      'Día límite, en el calendario de la persona (SCRUM-119). Null: no vence un día concreto.',
  })
  fechaLimite!: string | null;

  @ApiProperty({
    type: 'integer',
    minimum: 1,
    description:
      'Empieza en 1 y sube con cada edición. Hay que devolverla al editar: si otro dispositivo lo cambió entretanto, la edición se rechaza con 409 en vez de pisarlo.',
  })
  version!: number;

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
    dto.fechaLimite = pendiente.fechaLimite ?? null;
    dto.version = pendiente.version;
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

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    description:
      'El día límite que llegó, o null si el recordatorio es por los días de su color (SCRUM-119).',
  })
  fechaLimite!: string | null;

  static desde(recordatorio: Recordatorio): RecordatorioDto {
    const dto = new RecordatorioDto();

    dto.pendienteId = recordatorio.pendienteId.value;
    dto.nivel = recordatorio.nivel;
    dto.dias = recordatorio.dias;
    dto.nivelSugerido = recordatorio.nivelSugerido;
    dto.tono = recordatorio.tono;
    dto.fechaLimite = recordatorio.fechaLimite;

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

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    example: '2026-10-12',
    description:
      'Día límite AAAA-MM-DD, en el calendario de la persona. Opcional: sin ella el pendiente no vence un día concreto.',
  })
  @IsOptional()
  @Matches(FORMATO_DE_DIA, { message: 'fechaLimite debe tener el formato AAAA-MM-DD' })
  fechaLimite?: string;
}

/**
 * Cuerpo de `PATCH /api/pendientes/:id`. Lo que no viene se queda como estaba;
 * `posponerHasta: null` deja de posponer.
 */
export class EditarPendienteDto {
  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    description:
      'La versión que el dispositivo tenía del pendiente. Si ya no es la vigente, la edición se rechaza con 409, salvo que solo lo marque como hecho o que el pendiente ya esté como se pide. Sin ella no se comprueba nada.',
  })
  // No `@IsOptional()`: trata null como ausente, y un null llegaria al caso de uso
  // como si fuera una version vieja. Aqui solo puede faltar (undefined); si viene,
  // tiene que ser un entero positivo.
  @ValidateIf((dto: EditarPendienteDto) => dto.version !== undefined)
  @IsInt()
  @Min(1)
  version?: number;

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

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    nullable: true,
    example: '2026-10-12',
    description: 'Día límite AAAA-MM-DD, en el calendario de la persona. Null la quita.',
  })
  // Null tiene sentido propio (quitar la fecha): solo se valida si es un texto.
  @ValidateIf(
    (dto: EditarPendienteDto) => dto.fechaLimite !== null && dto.fechaLimite !== undefined,
  )
  @Matches(FORMATO_DE_DIA, { message: 'fechaLimite debe tener el formato AAAA-MM-DD' })
  fechaLimite?: string | null;
}
