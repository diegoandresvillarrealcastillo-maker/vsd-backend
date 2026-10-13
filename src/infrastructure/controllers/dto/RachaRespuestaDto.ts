import { ApiProperty } from '@nestjs/swagger';
import type { NivelDeLaLlama, Racha } from '../../../domain/model/Racha.js';

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

  static desde(racha: Racha): RachaRespuestaDto {
    const dto = new RachaRespuestaDto();

    dto.dias = racha.dias;
    dto.nivel = racha.nivel;
    dto.hechoHoy = racha.hechoHoy;
    dto.enDescanso = racha.enDescanso;
    dto.congelamientosUsados = racha.congelamientosUsados;
    dto.congelamientosPorMes = racha.congelamientosPorMes;
    dto.diasCubiertos = [...racha.diasCubiertos];

    return dto;
  }
}
