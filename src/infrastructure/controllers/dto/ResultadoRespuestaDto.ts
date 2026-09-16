import { ApiProperty } from '@nestjs/swagger';
import type { ActivityResult, Metadata } from '../../../domain/model/ActivityResult.js';

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

  @ApiProperty({
    description:
      'Nivel orientativo del resultado. Es una orientacion sobre como fue la actividad, nunca un diagnostico. Ausente en las actividades de registro, que no producen puntaje.',
    enum: ['favorable', 'en_seguimiento', 'requiere_atencion'],
    required: false,
  })
  nivelOrientativo?: string;

  @ApiProperty({
    description: 'Indica si conviene mostrar recursos de apoyo profesional junto al resultado.',
  })
  sugiereAcompanamiento!: boolean;

  @ApiProperty({
    description:
      'Informacion propia del tipo de actividad, tal como la envio el dispositivo. En una actividad de registro es todo su contenido.',
    required: false,
  })
  metadata!: Metadata;

  @ApiProperty({ type: String, format: 'date-time' })
  completedAt!: string;

  /**
   * No se expone `userId`. Quien hace la peticion ya sabe de quien es el
   * resultado, y devolverlo solo anadiria un dato personal mas circulando por
   * la red sin necesidad.
   *
   * **Tampoco se expone el puntaje numerico**, ni el maximo de la actividad.
   * El numero vive en la base de datos para calcular tendencias; lo que ve la
   * persona es el nivel, redactado con el lenguaje de su actividad. Un "38
   * sobre 100" en algo relacionado con el animo no informa: se lee como una
   * calificacion sobre uno mismo, y esta aplicacion existe para acompanar y no
   * para calificar. Ver docs/modelo-de-datos.md.
   */
  static desde(resultado: ActivityResult): ResultadoRespuestaDto {
    const dto = new ResultadoRespuestaDto();

    dto.id = resultado.id.value;
    dto.activityId = resultado.activityId.value;

    if (resultado.score !== undefined) {
      dto.nivelOrientativo = resultado.score.level;
    }

    dto.sugiereAcompanamiento = resultado.sugiereAcompanamiento();
    dto.metadata = resultado.metadata;
    dto.completedAt = resultado.completedAt.toISOString();

    return dto;
  }
}
