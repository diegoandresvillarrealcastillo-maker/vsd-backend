import { ApiProperty } from '@nestjs/swagger';
import { NivelDeAcompanamiento } from '../../../domain/model/AcompanamientoPorRiesgo.js';
import type { Acompanamiento } from '../../../domain/ports/in/ConsultarAcompanamientoUseCase.js';
import { RecursoDto } from './RecursoDto.js';

/** El acompanamiento de la persona, tal como sale por la API (SCRUM-177). */
export class AcompanamientoRespuestaDto {
  @ApiProperty({
    description:
      'ninguno: nada que ofrecer. moderado: 3 dias seguidos con atencion, se ofrece hablarlo con un profesional en un aviso que se puede cerrar. critico: 7 dias seguidos, el aviso se queda a la vista con las lineas de atencion. No sale ningun puntaje ni cuantos dias van.',
    enum: Object.values(NivelDeAcompanamiento),
    example: 'ninguno',
  })
  nivel!: NivelDeAcompanamiento;

  @ApiProperty({
    type: [RecursoDto],
    description:
      'Las lineas de atencion del pais de la persona, ordenadas por alcance. Solo con el nivel critico; vacio en los demas.',
  })
  lineasDeAtencion!: RecursoDto[];

  static desde(acompanamiento: Acompanamiento): AcompanamientoRespuestaDto {
    const dto = new AcompanamientoRespuestaDto();

    dto.nivel = acompanamiento.nivel;
    dto.lineasDeAtencion = acompanamiento.lineasDeAtencion.map((linea) => RecursoDto.desde(linea));

    return dto;
  }
}
