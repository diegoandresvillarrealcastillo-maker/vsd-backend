import { ApiProperty } from '@nestjs/swagger';
import type { DatosExportados } from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { CuentaRespuestaDto } from './CuentaRespuestaDto.js';
import { EntradaDelDiarioDto } from './EntradaDelDiarioDto.js';
import { PendienteDto } from './PendienteDto.js';
import { ResultadoRespuestaDto } from './ResultadoRespuestaDto.js';

/**
 * Todo lo que VSD Health guarda de una persona, en JSON.
 *
 * Los resultados salen igual que en el resto de la API: con su nivel
 * orientativo y sin el puntaje normalizado, que no sale por ninguna ruta. El
 * valor que la persona registro sigue en `metadata`.
 *
 * Las anotaciones del diario salen igual que en `GET /api/diario` (SCRUM-95):
 * con su dia, el documento del editor y sus diagramas.
 */
export class ExportacionDto {
  @ApiProperty({ type: String, format: 'date-time', description: 'Cuándo se generó.' })
  generadoEn!: string;

  @ApiProperty({ type: CuentaRespuestaDto })
  cuenta!: CuentaRespuestaDto;

  @ApiProperty({ type: [ResultadoRespuestaDto] })
  resultados!: ResultadoRespuestaDto[];

  @ApiProperty({ type: [EntradaDelDiarioDto] })
  entradasDeDiario!: EntradaDelDiarioDto[];

  @ApiProperty({ type: [PendienteDto], description: 'Los del semáforo, hechos o no.' })
  pendientes!: PendienteDto[];

  static desde(datos: DatosExportados): ExportacionDto {
    const dto = new ExportacionDto();

    dto.generadoEn = datos.generadoEn.toISOString();
    dto.cuenta = CuentaRespuestaDto.desde(datos.cuenta);
    dto.resultados = datos.resultados.map((resultado) => ResultadoRespuestaDto.desde(resultado));
    dto.entradasDeDiario = datos.entradasDeDiario.map((entrada) =>
      EntradaDelDiarioDto.desde(entrada),
    );
    dto.pendientes = datos.pendientes.map((pendiente) => PendienteDto.desde(pendiente));

    return dto;
  }
}
