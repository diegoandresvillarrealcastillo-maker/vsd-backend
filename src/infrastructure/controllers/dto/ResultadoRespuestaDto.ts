import { ApiProperty } from '@nestjs/swagger';
import type { ActivityResult } from '../../../domain/model/ActivityResult.js';

/**
 * Forma del resultado tal y como sale por HTTP.
 *
 * Existe para que la entidad del dominio no se serialice tal cual. Si el
 * dominio gana un campo interno manana, no se filtra solo porque alguien lo
 * anadio: hay que decidir explicitamente que sale por la API.
 */
export class ResultadoRespuestaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  activityId!: string;

  @ApiProperty({ example: 8 })
  score!: number;

  @ApiProperty({ example: 10 })
  maxScore!: number;

  @ApiProperty({
    description:
      'Nivel orientativo derivado del puntaje. Es una orientacion sobre como fue la actividad, nunca un diagnostico.',
    enum: ['favorable', 'en_seguimiento', 'requiere_atencion'],
  })
  nivelOrientativo!: string;

  @ApiProperty({
    description: 'Indica si conviene mostrar recursos de apoyo profesional junto al resultado.',
  })
  sugiereAcompanamiento!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  completedAt!: string;

  /**
   * Nota: no se expone `userId`. Quien hace la peticion ya sabe de quien es
   * el resultado, y devolverlo solo anadiria un dato personal mas circulando
   * por la red sin necesidad.
   */
  static desde(resultado: ActivityResult): ResultadoRespuestaDto {
    const dto = new ResultadoRespuestaDto();

    dto.id = resultado.id.value;
    dto.activityId = resultado.activityId.value;
    dto.score = resultado.score.value;
    dto.maxScore = resultado.score.maxValue;
    dto.nivelOrientativo = resultado.score.level;
    dto.sugiereAcompanamiento = resultado.sugiereAcompanamiento();
    dto.completedAt = resultado.completedAt.toISOString();

    return dto;
  }
}
