import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import {
  LIMITE_MAXIMO_DEL_HISTORIAL,
  LIMITE_POR_OMISION_DEL_HISTORIAL,
  type PaginaDelHistorial,
} from '../../../domain/model/HistorialDelModulo.js';
import { type Modulo, TODOS_LOS_MODULOS } from '../../../domain/model/Preferencias.js';

/** La ruta de `GET /api/progreso/:modulo/historial`. */
export class HistorialDelModuloParametrosDto {
  @ApiProperty({ enum: TODOS_LOS_MODULOS, example: 'bienestar' })
  @IsIn(TODOS_LOS_MODULOS, { message: 'modulo tiene que ser uno de los modulos conocidos' })
  modulo!: Modulo;
}

/** Los parametros de `GET /api/progreso/:modulo/historial`. */
export class HistorialDelModuloConsultaDto {
  @ApiPropertyOptional({
    description: `Cuantos hechos por pagina, de 1 a ${String(LIMITE_MAXIMO_DEL_HISTORIAL)}. Por omision ${String(LIMITE_POR_OMISION_DEL_HISTORIAL)}.`,
    minimum: 1,
    maximum: LIMITE_MAXIMO_DEL_HISTORIAL,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limite tiene que ser un numero entero' })
  @Min(1, { message: 'limite tiene que ser al menos 1' })
  @Max(LIMITE_MAXIMO_DEL_HISTORIAL, {
    message: `limite no puede pasar de ${String(LIMITE_MAXIMO_DEL_HISTORIAL)}`,
  })
  limite?: number;

  @ApiPropertyOptional({
    description:
      'El texto que dio la pagina anterior en siguientePagina. Es opaco: no se arma ni se interpreta. Sin el, la primera pagina.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{1,200}$/u, { message: 'pagina no es una pagina valida' })
  pagina?: string;
}

export class ActividadDelHechoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Cómo dormiste anoche' })
  nombre!: string;
}

/** Algo que la persona hizo. Sin puntaje, sin nivel y sin lo que escribio. */
export class HechoDelHistorialDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ type: ActividadDelHechoDto })
  actividad!: ActividadDelHechoDto;

  @ApiProperty({
    format: 'date',
    example: '2026-10-02',
    description: 'El dia, en la zona que la persona tenia al hacerlo.',
  })
  dia!: string;

  @ApiProperty({ format: 'date-time', description: 'La hora a la que termino la actividad.' })
  hechaEn!: string;
}

export class PaginaDelHistorialDto {
  @ApiProperty({
    type: [HechoDelHistorialDto],
    description: 'Del mas reciente al mas antiguo.',
  })
  hechos!: HechoDelHistorialDto[];

  @ApiProperty({
    type: String,
    nullable: true,
    description:
      'El texto para pedir la pagina siguiente en el parametro pagina, o null si no hay mas.',
  })
  siguientePagina!: string | null;

  static desde(pagina: PaginaDelHistorial): PaginaDelHistorialDto {
    const dto = new PaginaDelHistorialDto();

    dto.hechos = pagina.hechos.map((hecho) => ({
      id: hecho.id,
      actividad: { id: hecho.actividad.id, nombre: hecho.actividad.nombre },
      dia: hecho.dia,
      hechaEn: hecho.hechaEn.toISOString(),
    }));
    dto.siguientePagina = pagina.siguiente;

    return dto;
  }
}
