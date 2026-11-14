import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MOTORES } from '../../../domain/model/Motor.js';
import type { ActividadDeHoy, ProgresoDelModulo } from '../../../domain/model/Sendero.js';

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
  @ApiProperty({ enum: ['diaria', 'semanal', 'unica', 'rotativa'] })
  tipo!: 'diaria' | 'semanal' | 'unica' | 'rotativa';

  @ApiPropertyOptional({
    type: [Number],
    description: 'Solo en las semanales: 1 es lunes y 7 domingo.',
    example: [1, 3, 5],
  })
  dias?: number[];
}

/**
 * El contenido de hoy de una mecanica (ADR 0030): lo que el motor necesita para pintarla.
 *
 * Salen solo estos cuatro campos. Si la sesion estuvo revisada, quien la reviso y cuando es una
 * constancia nuestra, no algo que la persona deba leer; y si esta publicada o no ya lo decidio el servidor
 * al elegirla. Va antes que `ActividadDeHoyDto` por la misma razon que `FrecuenciaDto`.
 */
export class SesionDelDiaDto {
  @ApiProperty({
    format: 'uuid',
    description:
      'Identificador de la sesión. Es el que se manda como idSesion al registrar el resultado.',
  })
  id!: string;

  @ApiProperty({ example: 'Respiración 4-6' })
  titulo!: string;

  @ApiProperty({ minimum: 1, maximum: 3, description: 'Dificultad o profundidad.' })
  nivel!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description:
      'Lo que el motor necesita para pintar la sesión: tamaño, símbolos, guion, pasos. Su forma depende del motor.',
  })
  parametros!: Record<string, unknown>;
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

  @ApiPropertyOptional({
    enum: MOTORES,
    description:
      'Qué componente pinta la mecánica (ADR 0030). Ausente en las actividades que se pintan como siempre, que son las nueve de hoy.',
  })
  motor?: string;

  @ApiPropertyOptional({
    type: SesionDelDiaDto,
    description:
      'El contenido de hoy de una mecánica con motor. Viaja con el sendero, que el dispositivo ya guarda: así se puede hacer la actividad sin conexión. Ausente cuando no hay motor.',
  })
  sesion?: SesionDelDiaDto;
}

/** El sendero de un modulo, tal como sale por la API. */
export class ProgresoRespuestaDto {
  @ApiProperty({ enum: ['cognicion', 'bienestar', 'emociones'] })
  modulo!: string;

  @ApiProperty({ description: 'Dias distintos en los que hizo algo de este modulo.', example: 7 })
  sesiones!: number;

  @ApiProperty({ type: EtapaDto })
  etapa!: EtapaDto;

  @ApiProperty({
    type: [ActividadDeHoyDto],
    description: 'Lo que toca hoy, con lo hecho. Sin tope: salen todas las que tocan.',
  })
  hoy!: ActividadDeHoyDto[];

  @ApiProperty({
    type: [ActividadDeHoyDto],
    description:
      'Otras actividades abiertas del modulo que hoy no tocan, hasta completar un minimo sugerido de tres con lo de hoy (SCRUM-184). Es una sugerencia: no forma parte del plan del dia, no suma sesiones ni cuenta para la racha. Vacia cuando hoy ya llega a tres.',
  })
  sugeridas!: ActividadDeHoyDto[];

  static desde(progreso: ProgresoDelModulo): ProgresoRespuestaDto {
    const dto = new ProgresoRespuestaDto();

    dto.modulo = progreso.modulo;
    dto.sesiones = progreso.sesiones;
    dto.etapa = { ...progreso.etapa };
    dto.hoy = progreso.hoy.map((actividad) => ProgresoRespuestaDto.actividad(actividad));
    dto.sugeridas = progreso.sugeridas.map((actividad) =>
      ProgresoRespuestaDto.actividad(actividad),
    );

    return dto;
  }

  private static actividad({ actividad, hecha, sesion }: ActividadDeHoy): ActividadDeHoyDto {
    return {
      id: actividad.id.value,
      nombre: actividad.nombre,
      ...(actividad.tipo === undefined ? {} : { tipo: actividad.tipo }),
      ...(actividad.descripcion === undefined ? {} : { descripcion: actividad.descripcion }),
      hecha,
      frecuencia:
        actividad.frecuencia.tipo === 'semanal'
          ? { tipo: 'semanal', dias: [...actividad.frecuencia.dias] }
          : { tipo: actividad.frecuencia.tipo },
      ...(actividad.motor === undefined ? {} : { motor: actividad.motor }),
      ...(sesion === undefined
        ? {}
        : {
            sesion: {
              id: sesion.id.value,
              titulo: sesion.titulo,
              nivel: sesion.nivel,
              parametros: { ...sesion.parametros },
            },
          }),
    };
  }
}
