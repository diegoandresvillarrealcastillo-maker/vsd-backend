import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RecursoApoyo } from '../../../domain/model/RecursoApoyo.js';
import type { RespuestaDelAsistente } from '../../../domain/ports/in/AsistentePort.js';

/** Un recurso tal y como sale por la API. */
export class RecursoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Línea 192, opción 4' })
  titulo!: string;

  @ApiPropertyOptional()
  descripcion?: string;

  @ApiProperty({ example: 'contacto', enum: ['contacto', 'lectura', 'ejercicio'] })
  tipo!: string;

  @ApiPropertyOptional({
    description:
      'Donde sirve el recurso. La interfaz deberia mostrarlo: un telefono que solo atiende en una ciudad no ayuda a quien esta fuera de ella.',
    example: 'nacional',
  })
  cobertura?: string;

  @ApiPropertyOptional({ format: 'uri' })
  enlace?: string;
}

/**
 * Respuesta del asistente.
 *
 * Fijate en lo que **no** sale: ni el texto que escribio la persona, ni nada
 * derivado de el. Lo que alguien le cuenta al asistente no vuelve en la
 * respuesta, no se guarda y no aparece en ningun registro.
 */
export class AsistenteRespuestaDto {
  @ApiProperty({
    description: 'Que se entendio de la pregunta.',
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
    dto.recursos = respuesta.recursos.map((recurso) => AsistenteRespuestaDto.recurso(recurso));
    dto.senalDeRiesgo = respuesta.senalDeRiesgo;
    dto.incluyeLineasDeAtencion = respuesta.incluyeLineasDeAtencion;

    return dto;
  }

  private static recurso(recurso: RecursoApoyo): RecursoDto {
    const dto = new RecursoDto();

    dto.id = recurso.id;
    dto.titulo = recurso.titulo;
    dto.tipo = recurso.tipo;

    if (recurso.descripcion !== undefined) {
      dto.descripcion = recurso.descripcion;
    }

    if (recurso.cobertura !== undefined) {
      dto.cobertura = recurso.cobertura;
    }

    if (recurso.enlace !== undefined) {
      dto.enlace = recurso.enlace;
    }

    return dto;
  }
}
