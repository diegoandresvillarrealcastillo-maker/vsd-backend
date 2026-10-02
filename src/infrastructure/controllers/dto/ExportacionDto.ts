import { ApiProperty } from '@nestjs/swagger';
import type { DatosExportados } from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { CuentaRespuestaDto } from './CuentaRespuestaDto.js';
import { ResultadoRespuestaDto } from './ResultadoRespuestaDto.js';

/** Una entrada del diario, tal como se exporta. */
export class EntradaExportadaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ nullable: true, type: String })
  titulo!: string | null;

  @ApiProperty()
  contenido!: string;

  @ApiProperty({ enum: ['texto_plano', 'enriquecido'] })
  formato!: string;

  @ApiProperty({ nullable: true, description: 'Etiquetas de ánimo, si las hay.' })
  etiquetas!: unknown;

  @ApiProperty({ type: String, format: 'date-time' })
  creadaEn!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  editadaEn!: string;
}

/**
 * Todo lo que VSD Health guarda de una persona, en JSON.
 *
 * Los resultados salen igual que en el resto de la API: con su nivel
 * orientativo y sin el puntaje normalizado, que no sale por ninguna ruta. El
 * valor que la persona registro sigue en `metadata`.
 */
export class ExportacionDto {
  @ApiProperty({ type: String, format: 'date-time', description: 'Cuándo se generó.' })
  generadoEn!: string;

  @ApiProperty({ type: CuentaRespuestaDto })
  cuenta!: CuentaRespuestaDto;

  @ApiProperty({ type: [ResultadoRespuestaDto] })
  resultados!: ResultadoRespuestaDto[];

  @ApiProperty({ type: [EntradaExportadaDto] })
  entradasDeDiario!: EntradaExportadaDto[];

  static desde(datos: DatosExportados): ExportacionDto {
    const dto = new ExportacionDto();

    dto.generadoEn = datos.generadoEn.toISOString();
    dto.cuenta = CuentaRespuestaDto.desde(datos.cuenta);
    dto.resultados = datos.resultados.map((resultado) => ResultadoRespuestaDto.desde(resultado));
    dto.entradasDeDiario = datos.entradasDeDiario.map((entrada) => ({
      id: entrada.id,
      titulo: entrada.titulo ?? null,
      contenido: entrada.contenido,
      formato: entrada.formato,
      etiquetas: entrada.etiquetas ?? null,
      creadaEn: entrada.creadaEn.toISOString(),
      editadaEn: entrada.editadaEn.toISOString(),
    }));

    return dto;
  }
}
