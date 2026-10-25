import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { FrecuenciaDelSemaforo } from '../../../domain/model/FrecuenciaDelSemaforo.js';
import type { EstadoDeLosAvisos } from '../../../domain/ports/in/AvisosUseCase.js';

/** Lo que responde `GET /api/notificaciones` y `PATCH /api/notificaciones/horas` (SCRUM-102). */
export class EstadoDeLosAvisosDto {
  @ApiProperty({
    description: 'Si este servidor puede mandar avisos. Sin claves VAPID, false.',
  })
  disponible!: boolean;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Clave pública VAPID con la que el navegador se suscribe.',
  })
  clavePublica!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '08:00',
    description:
      'La hora que la persona eligió para el semáforo (la hora base), en su zona horaria. Null: apagado. Las horas a las que de verdad avisa están en horasDelSemaforo.',
  })
  horaSemaforo!: string | null;

  @ApiProperty({
    enum: Object.values(FrecuenciaDelSemaforo),
    example: 'manana',
    description:
      'Cuántas veces al día avisa el semáforo. manana: una vez, a la hora base (lo que hacía hasta ahora). noche: una vez, doce horas después de una hora base de la mañana, o a la propia hora base si es de las 12:00 en adelante. dos_veces: las dos. Nunca cruza la medianoche.',
  })
  frecuenciaSemaforo!: FrecuenciaDelSemaforo;

  @ApiProperty({
    type: [String],
    example: ['08:00', '20:00'],
    description:
      'Las horas HH:MM a las que avisa el semáforo, de la más temprana a la más tarde, con la frecuencia ya aplicada: una, o dos a doce horas de distancia. Vacía si está apagado.',
  })
  horasDelSemaforo!: string[];

  @ApiProperty({
    type: String,
    nullable: true,
    example: '19:30',
    description:
      'Hora del recordatorio de la racha, en la zona horaria de la persona. Null: apagado.',
  })
  horaRacha!: string | null;

  @ApiProperty({
    description:
      'Recordatorio de las 8:00, en la zona horaria de la persona. La hora no se mueve: se enciende o se apaga.',
  })
  recordatorioManana!: boolean;

  @ApiProperty({
    description:
      'Recordatorio de las 20:00, en la zona horaria de la persona. Solo sale si ese día no hizo ninguna actividad.',
  })
  recordatorioNoche!: boolean;

  static desde(estado: EstadoDeLosAvisos): EstadoDeLosAvisosDto {
    const dto = new EstadoDeLosAvisosDto();

    dto.disponible = estado.disponible;
    dto.clavePublica = estado.clavePublica;
    dto.horaSemaforo = estado.horaSemaforo;
    dto.frecuenciaSemaforo = estado.frecuenciaSemaforo;
    dto.horasDelSemaforo = [...estado.horasDelSemaforo];
    dto.horaRacha = estado.horaRacha;
    dto.recordatorioManana = estado.recordatorioManana;
    dto.recordatorioNoche = estado.recordatorioNoche;

    return dto;
  }
}

/**
 * Cuerpo de `PATCH /api/notificaciones/horas`. Lo que no viene se queda; null apaga
 * ese aviso. El formato fino (HH:MM) lo valida el dominio.
 */
export class CambiarHorasDto {
  @ApiPropertyOptional({ type: String, nullable: true, example: '08:00' })
  @IsOptional()
  // Null tiene sentido propio (apagar): solo se valida si es texto.
  @ValidateIf((dto: CambiarHorasDto) => dto.horaSemaforo !== null)
  @IsString()
  @MaxLength(5)
  horaSemaforo?: string | null;

  @ApiPropertyOptional({
    enum: Object.values(FrecuenciaDelSemaforo),
    description:
      'Cuántas veces al día avisa el semáforo: manana, noche o dos_veces. Lo que no viene se queda. No tiene null: apagar el aviso es horaSemaforo: null.',
  })
  // `IsOptional` dejaria pasar null, y null no es una frecuencia: solo se omite lo que no viene.
  @ValidateIf((dto: CambiarHorasDto) => dto.frecuenciaSemaforo !== undefined)
  @IsEnum(FrecuenciaDelSemaforo)
  frecuenciaSemaforo?: FrecuenciaDelSemaforo;

  @ApiPropertyOptional({ type: String, nullable: true, example: '19:30' })
  @IsOptional()
  @ValidateIf((dto: CambiarHorasDto) => dto.horaRacha !== null)
  @IsString()
  @MaxLength(5)
  horaRacha?: string | null;
}

/**
 * Cuerpo de `PATCH /api/notificaciones/recordatorios` (SCRUM-126). Lo que no
 * viene se queda. No hay hora que elegir: son las 8:00 y las 20:00 de la persona.
 */
export class CambiarRecordatoriosDto {
  // `IsOptional` dejaria pasar null, y null no es "no cambiar": apagaria el
  // recordatorio sin que nadie lo pidiera. Solo se omite lo que no viene.
  @ApiPropertyOptional({ description: 'Enciende o apaga el de las 8:00.' })
  @ValidateIf((dto: CambiarRecordatoriosDto) => dto.manana !== undefined)
  @IsBoolean()
  manana?: boolean;

  @ApiPropertyOptional({ description: 'Enciende o apaga el de las 20:00.' })
  @ValidateIf((dto: CambiarRecordatoriosDto) => dto.noche !== undefined)
  @IsBoolean()
  noche?: boolean;
}

/** Las claves de la suscripcion, como las entrega `PushSubscription.toJSON()`. */
export class ClavesDeSuscripcionDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  p256dh!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  auth!: string;
}

/** Cuerpo de `POST /api/notificaciones/suscripciones`: lo que da el navegador. */
export class SuscribirDto {
  @ApiProperty({ description: 'La dirección del servicio de push del navegador (https).' })
  @IsString()
  @MaxLength(1000)
  endpoint!: string;

  @ApiProperty({ type: ClavesDeSuscripcionDto })
  // Sin esto, un cuerpo sin claves pasaria: ValidateNested no exige que esten.
  @IsDefined()
  @ValidateNested()
  @Type(() => ClavesDeSuscripcionDto)
  keys!: ClavesDeSuscripcionDto;
}

/** Cuerpo de `DELETE /api/notificaciones/suscripciones`. */
export class DesuscribirDto {
  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  endpoint!: string;
}
