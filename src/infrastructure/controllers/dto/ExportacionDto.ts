import { ApiProperty } from '@nestjs/swagger';
import { horaDeMinuto } from '../../../domain/model/Aviso.js';
import type { DatosExportados } from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { CuentaRespuestaDto } from './CuentaRespuestaDto.js';
import { EntradaDelDiarioDto } from './EntradaDelDiarioDto.js';
import { PendienteDto } from './PendienteDto.js';
import { ResultadoRespuestaDto } from './ResultadoRespuestaDto.js';

/** Los avisos, en la exportacion: las horas y en cuantos navegadores (SCRUM-102). */
export class AvisosExportadosDto {
  @ApiProperty({ type: String, nullable: true, example: '08:00' })
  horaSemaforo!: string | null;

  @ApiProperty({ type: String, nullable: true, example: '19:30' })
  horaRacha!: string | null;

  @ApiProperty({ description: 'Recordatorio de las 8:00 (SCRUM-126).' })
  recordatorioManana!: boolean;

  @ApiProperty({ description: 'Recordatorio de las 20:00 (SCRUM-126).' })
  recordatorioNoche!: boolean;

  @ApiProperty({ description: 'En cuántos navegadores recibe avisos.' })
  navegadores!: number;
}

/** La foto de perfil, en la exportacion: el archivo mismo, para poder llevarselo (SCRUM-120). */
export class FotoExportadaDto {
  @ApiProperty({ example: 'image/jpeg' })
  tipo!: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Cuándo se guardó.' })
  actualizadaEl!: string;

  @ApiProperty({
    description: 'El archivo, en base64. Es la imagen tal como se guardó.',
    type: String,
    format: 'byte',
  })
  contenidoBase64!: string;
}

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

  @ApiProperty({ type: AvisosExportadosDto })
  avisos!: AvisosExportadosDto;

  @ApiProperty({
    type: FotoExportadaDto,
    nullable: true,
    description: 'La foto de perfil, si tiene (SCRUM-120).',
  })
  foto!: FotoExportadaDto | null;

  static desde(datos: DatosExportados): ExportacionDto {
    const dto = new ExportacionDto();

    dto.generadoEn = datos.generadoEn.toISOString();
    dto.cuenta = CuentaRespuestaDto.desde(datos.cuenta);
    dto.resultados = datos.resultados.map((resultado) => ResultadoRespuestaDto.desde(resultado));
    dto.entradasDeDiario = datos.entradasDeDiario.map((entrada) =>
      EntradaDelDiarioDto.desde(entrada),
    );
    dto.pendientes = datos.pendientes.map((pendiente) => PendienteDto.desde(pendiente));

    const { preferencias, navegadores } = datos.avisos;

    dto.avisos = {
      horaSemaforo:
        preferencias.minutoSemaforo === null ? null : horaDeMinuto(preferencias.minutoSemaforo),
      horaRacha: preferencias.minutoRacha === null ? null : horaDeMinuto(preferencias.minutoRacha),
      recordatorioManana: preferencias.minutoManana !== null,
      recordatorioNoche: preferencias.minutoNoche !== null,
      navegadores,
    };

    dto.foto =
      datos.foto === null
        ? null
        : {
            tipo: datos.foto.tipo,
            actualizadaEl: datos.foto.actualizadaEl.toISOString(),
            contenidoBase64: Buffer.from(datos.foto.contenido).toString('base64'),
          };

    return dto;
  }
}
