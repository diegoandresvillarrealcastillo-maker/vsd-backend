import { ApiProperty } from '@nestjs/swagger';
import type { EstadoDelDia, NivelDeLaLlama, Racha } from '../../../domain/model/Racha.js';

/** Un hito de la escalera de la racha (SCRUM-242). */
export class HitoDeLaEscaleraDto {
  @ApiProperty({ description: 'Dias seguidos que pide este hito.', example: 14 })
  dias!: number;

  @ApiProperty({ description: 'Si la racha de ahora ya lo alcanzo.', example: false })
  logrado!: boolean;
}

/** Un dia de la semana de la racha (SCRUM-242). */
export class DiaDeLaSemanaDto {
  @ApiProperty({ description: 'El dia del calendario local de la persona, AAAA-MM-DD.' })
  dia!: string;

  @ApiProperty({
    description:
      'hecho: hubo actividad; cubierto: lo cubrio un congelamiento; hoy: es hoy y todavia no hay actividad; sinActividad: paso sin actividad ni congelamiento; futuro: todavia no llega.',
    enum: ['hecho', 'cubierto', 'hoy', 'sinActividad', 'futuro'],
  })
  estado!: EstadoDelDia;
}

/** La racha de la persona, tal como sale por la API (SCRUM-186). */
export class RachaRespuestaDto {
  @ApiProperty({
    description:
      'Dias con al menos una actividad en la cadena de ahora. Los dias cubiertos por un congelamiento no suman.',
    example: 12,
  })
  dias!: number;

  @ApiProperty({
    description:
      'Nivel de la llama: 0 es el ascua (menos de 7 dias); 1 desde 7 dias, 2 desde 30, 3 desde 90 y 4 desde 365.',
    enum: [0, 1, 2, 3, 4],
    example: 1,
  })
  nivel!: NivelDeLaLlama;

  @ApiProperty({ description: 'Si ya hizo algo hoy, en el dia local de la persona.' })
  hechoHoy!: boolean;

  @ApiProperty({
    description:
      'La llama descansa: no hay cadena en pie. Es un estado, no un castigo: con la siguiente actividad vuelve con un dia.',
  })
  enDescanso!: boolean;

  @ApiProperty({ description: 'Congelamientos usados en el mes de hoy.', example: 1 })
  congelamientosUsados!: number;

  @ApiProperty({ description: 'Congelamientos que trae cada mes calendario.', example: 3 })
  congelamientosPorMes!: number;

  @ApiProperty({
    type: [String],
    description:
      'Los dias de la cadena de ahora que se cubrieron con un congelamiento, AAAA-MM-DD, del mas viejo al mas nuevo.',
    example: ['2026-10-11'],
  })
  diasCubiertos!: string[];

  @ApiProperty({
    description: 'Congelamientos que quedan este mes: los del mes menos los usados.',
    example: 2,
  })
  congelamientosDisponibles!: number;

  @ApiProperty({
    description: 'El proximo hito de la escalera, siempre mayor que los dias de ahora.',
    example: 14,
  })
  proximoHito!: number;

  @ApiProperty({
    type: [HitoDeLaEscaleraDto],
    description:
      'Los hitos logrados y los tres que siguen. Los hitos son 3, 7, 14, 30, 50, 100, 200 y 365 dias, y despues uno cada 365.',
  })
  escalera!: HitoDeLaEscaleraDto[];

  @ApiProperty({
    type: [DiaDeLaSemanaDto],
    description: 'La semana de hoy, de lunes a domingo: siete dias, cada uno con su estado.',
  })
  semana!: DiaDeLaSemanaDto[];

  static desde(racha: Racha): RachaRespuestaDto {
    const dto = new RachaRespuestaDto();

    dto.dias = racha.dias;
    dto.nivel = racha.nivel;
    dto.hechoHoy = racha.hechoHoy;
    dto.enDescanso = racha.enDescanso;
    dto.congelamientosUsados = racha.congelamientosUsados;
    dto.congelamientosPorMes = racha.congelamientosPorMes;
    dto.diasCubiertos = [...racha.diasCubiertos];
    dto.congelamientosDisponibles = racha.congelamientosDisponibles;
    dto.proximoHito = racha.proximoHito;
    dto.escalera = racha.escalera.map(({ dias, logrado }) => ({ dias, logrado }));
    dto.semana = racha.semana.map(({ dia, estado }) => ({ dia, estado }));

    return dto;
  }
}
