import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ProgresoDelModulo } from '../../../domain/model/Sendero.js';

export class EtapaDto {
  @ApiProperty({ description: 'Numero de etapa (1 a 4) o de temporada (desde 1).', example: 2 })
  numero!: number;

  @ApiProperty({ description: 'Si ya paso las cuatro etapas y va por temporadas.' })
  esTemporada!: boolean;

  @ApiProperty({ description: 'Sesiones hechas dentro de esta etapa.', example: 3 })
  sesionesHechas!: number;

  @ApiProperty({ description: 'Sesiones que tiene la etapa.', example: 10 })
  sesionesDeLaEtapa!: number;
}

/**
 * Cada cuanto toca una actividad. Va antes que `ActividadDeHoyDto` a proposito:
 * los decoradores leen el tipo de la propiedad al definir la clase, y una clase
 * declarada despues todavia no existiria en ese momento.
 */
export class FrecuenciaDto {
  @ApiProperty({ enum: ['diaria', 'semanal', 'unica'] })
  tipo!: 'diaria' | 'semanal' | 'unica';

  @ApiPropertyOptional({
    type: [Number],
    description: 'Solo en las semanales: 1 es lunes y 7 domingo.',
    example: [1, 3, 5],
  })
  dias?: number[];
}

export class ActividadDeHoyDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Cómo dormiste anoche' })
  nombre!: string;

  @ApiPropertyOptional({ example: 'bitacora' })
  tipo?: string;

  @ApiPropertyOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Si ya la hizo hoy.' })
  hecha!: boolean;

  @ApiProperty({
    type: FrecuenciaDto,
    description: 'Cada cuanto toca, para la etiqueta del sendero (Diaria, un dia, Una vez).',
  })
  frecuencia!: FrecuenciaDto;
}

/** El sendero de un modulo, tal como sale por la API. */
export class ProgresoRespuestaDto {
  @ApiProperty({ enum: ['cognicion', 'bienestar', 'emociones'] })
  modulo!: string;

  @ApiProperty({ description: 'Dias distintos en los que hizo algo de este modulo.', example: 7 })
  sesiones!: number;

  @ApiProperty({ type: EtapaDto })
  etapa!: EtapaDto;

  @ApiProperty({ type: [ActividadDeHoyDto], description: 'Lo que toca hoy, con lo hecho.' })
  hoy!: ActividadDeHoyDto[];

  static desde(progreso: ProgresoDelModulo): ProgresoRespuestaDto {
    const dto = new ProgresoRespuestaDto();

    dto.modulo = progreso.modulo;
    dto.sesiones = progreso.sesiones;
    dto.etapa = { ...progreso.etapa };
    dto.hoy = progreso.hoy.map(({ actividad, hecha }) => ({
      id: actividad.id.value,
      nombre: actividad.nombre,
      ...(actividad.tipo === undefined ? {} : { tipo: actividad.tipo }),
      ...(actividad.descripcion === undefined ? {} : { descripcion: actividad.descripcion }),
      hecha,
      frecuencia:
        actividad.frecuencia.tipo === 'semanal'
          ? { tipo: 'semanal', dias: [...actividad.frecuencia.dias] }
          : { tipo: actividad.frecuencia.tipo },
    }));

    return dto;
  }
}
