import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';
import { FORMATO_DE_DIA } from './EscribirEnElDiarioDto.js';

/** Parametros de `GET /api/diario`. */
export class ConsultarDiarioDto {
  @ApiPropertyOptional({
    description: 'Primer día del rango, incluido. Si no viene, el mismo que "hasta".',
    example: '2026-09-27',
    format: 'date',
  })
  @IsOptional()
  @Matches(FORMATO_DE_DIA, { message: 'desde tiene que tener formato AAAA-MM-DD' })
  desde?: string;

  @ApiPropertyOptional({
    description: 'Último día del rango, incluido. Si no viene, hoy en la zona de la persona.',
    example: '2026-10-03',
    format: 'date',
  })
  @IsOptional()
  @Matches(FORMATO_DE_DIA, { message: 'hasta tiene que tener formato AAAA-MM-DD' })
  hasta?: string;
}
