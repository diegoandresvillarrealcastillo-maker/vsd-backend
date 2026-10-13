import { ApiProperty } from '@nestjs/swagger';
import type { DatoCuriosoDelDia } from '../../../domain/model/DatoCurioso.js';

export class DatoCuriosoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Los pulpos tienen tres corazones.' })
  texto!: string;

  @ApiProperty({
    description: 'De que trata. Sirve para revisar el catalogo; no es para mostrar.',
    example: 'animales',
  })
  tema!: string;
}

/** El dato curioso de hoy, tal como sale por la API (SCRUM-185). */
export class DatoCuriosoDelDiaRespuestaDto {
  @ApiProperty({
    description: 'El dia, en el calendario de la persona, al que pertenece este dato. AAAA-MM-DD.',
    example: '2026-10-13',
  })
  dia!: string;

  @ApiProperty({
    type: DatoCuriosoDto,
    nullable: true,
    description: 'El dato de hoy, o `null` si todavia no hay ningun dato publicado.',
  })
  dato!: DatoCuriosoDto | null;

  static desde(entregado: DatoCuriosoDelDia): DatoCuriosoDelDiaRespuestaDto {
    const dto = new DatoCuriosoDelDiaRespuestaDto();

    dto.dia = entregado.dia;
    dto.dato =
      entregado.dato === null
        ? null
        : { id: entregado.dato.id, texto: entregado.dato.texto, tema: entregado.dato.tema };

    return dto;
  }
}
