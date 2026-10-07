import { ApiProperty } from '@nestjs/swagger';
import type { RespuestaDelAsistente } from '../../../domain/ports/in/AsistentePort.js';
import { RecursoDto } from './RecursoDto.js';

/**
 * Respuesta del asistente.
 *
 * Fijate en lo que **no** sale: ni el texto que escribio la persona, ni nada
 * derivado de el. Lo que alguien le cuenta al asistente no vuelve en la
 * respuesta, no se guarda y no aparece en ningun registro.
 */
export class AsistenteRespuestaDto {
  @ApiProperty({
    description:
      'Que se entendio de la pregunta: que_significa_mi_resultado, como_duermo_mejor, me_siento_mal, donde_busco_ayuda, saludo, agradecimiento, despedida, como_estas, que_puedes_hacer o no_reconocida. La charla (saludo, agradecimiento, despedida, como_estas y que_puedes_hacer) responde sin recursos ni lineas de atencion.',
    example: 'como_duermo_mejor',
  })
  intencion!: string;

  @ApiProperty({ example: 'Descansar mejor casi siempre empieza por la rutina.' })
  mensaje!: string;

  @ApiProperty({ type: [RecursoDto] })
  recursos!: RecursoDto[];

  @ApiProperty({
    description:
      'Cierto cuando el texto contenia una expresion de riesgo. La interfaz deberia destacar esta respuesta.',
  })
  senalDeRiesgo!: boolean;

  @ApiProperty({
    description:
      'Cierto cuando la respuesta trae al menos un contacto. Si senalDeRiesgo es cierto, este tambien lo es, siempre.',
  })
  incluyeLineasDeAtencion!: boolean;

  static desde(respuesta: RespuestaDelAsistente): AsistenteRespuestaDto {
    const dto = new AsistenteRespuestaDto();

    dto.intencion = respuesta.intencion;
    dto.mensaje = respuesta.mensaje;
    dto.recursos = respuesta.recursos.map((recurso) => RecursoDto.desde(recurso));
    dto.senalDeRiesgo = respuesta.senalDeRiesgo;
    dto.incluyeLineasDeAtencion = respuesta.incluyeLineasDeAtencion;

    return dto;
  }
}
