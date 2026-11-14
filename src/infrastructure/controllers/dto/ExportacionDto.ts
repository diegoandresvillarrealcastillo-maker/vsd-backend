import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { horaDeMinuto } from '../../../domain/model/Aviso.js';
import type {
  DatosExportados,
  ResultadoExportado,
} from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { CuentaRespuestaDto } from './CuentaRespuestaDto.js';
import { EntradaDelDiarioDto } from './EntradaDelDiarioDto.js';
import { PendienteDto } from './PendienteDto.js';
import { ResultadoRespuestaDto } from './ResultadoRespuestaDto.js';

/**
 * Un resultado tal como sale en la exportacion: como en el resto de la API y, si hizo una sesion, el
 * `titulo` de esa sesion (ADR 0030). Nunca el identificador de la sesion ni sus parametros: son
 * contenido de todos y no le dicen nada a quien se lleva sus datos.
 */
export class ResultadoExportadoDto extends ResultadoRespuestaDto {
  @ApiPropertyOptional({
    description:
      'El título de la sesión que hizo, si la actividad tiene sesiones y la sesión sigue existiendo. No incluye su identificador ni sus parámetros.',
    example: 'Respiración 4-6',
  })
  sesion?: string;
}

/** Una aceptacion del historial, en la exportacion: que, que version y cuando. */
export class ConsentimientoExportadoDto {
  @ApiProperty({ enum: ['aviso_de_privacidad', 'terminos'] })
  tipo!: string;

  @ApiProperty({ example: '2026-10-1' })
  version!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  aceptadoEn!: string;
}

/** Los avisos, en la exportacion: las horas y en cuantos navegadores (SCRUM-102). */
export class AvisosExportadosDto {
  @ApiProperty({ type: String, nullable: true, example: '08:00' })
  horaSemaforo!: string | null;

  @ApiProperty({
    enum: ['manana', 'noche', 'dos_veces'],
    description: 'Cuántas veces al día avisa el semáforo (SCRUM-146).',
  })
  frecuenciaSemaforo!: string;

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

/** La mascota propia, en la exportacion: el SVG tal como se guardo, ya saneado (SCRUM-122). */
export class MascotaPropiaExportadaDto {
  @ApiProperty({ example: 'image/svg+xml' })
  tipo!: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Cuándo se guardó.' })
  actualizadaEl!: string;

  @ApiProperty({
    description:
      'El SVG, como texto. Es el que guarda VSD Health, no el que subió la persona: se reescribió sin lo que no se admite.',
    type: String,
  })
  contenido!: string;
}

/** El último dato curioso que se le dio (SCRUM-185): lo que vio y el día, no su identificador. */
export class DatoCuriosoExportadoDto {
  @ApiProperty({ description: 'El día, AAAA-MM-DD, en el calendario de la persona.' })
  dia!: string;

  @ApiProperty({ example: 'Los pulpos tienen tres corazones.' })
  texto!: string;
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
 *
 * Esta clase **describe** la respuesta (es lo que documenta `openapi.json`); no se arma entera. Los
 * resultados, el diario y los pendientes salen por paginas, uno a uno, con el mismo JSON de
 * siempre (SCRUM-262): ver `exportacionEnFlujo.ts`. Aqui se arma cada pieza.
 */
export class ExportacionDto {
  @ApiProperty({ type: String, format: 'date-time', description: 'Cuándo se generó.' })
  generadoEn!: string;

  @ApiProperty({ type: CuentaRespuestaDto })
  cuenta!: CuentaRespuestaDto;

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    description:
      'La fecha de nacimiento que declaraste, o null si tu cuenta es anterior a que se pidiera. Solo sale aquí: el resto de la API no la devuelve.',
  })
  fechaNacimiento!: string | null;

  @ApiProperty({
    type: [ConsentimientoExportadoDto],
    description:
      'Todo lo que aceptaste, versión por versión, de lo más antiguo a lo más reciente: el aviso de privacidad y los términos. Solo se añade; nunca se reescribe.',
  })
  consentimientos!: ConsentimientoExportadoDto[];

  @ApiProperty({ type: [ResultadoExportadoDto] })
  resultados!: ResultadoExportadoDto[];

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

  @ApiProperty({
    type: MascotaPropiaExportadaDto,
    nullable: true,
    description: 'La mascota propia, si tiene (SCRUM-122).',
  })
  mascotaPropia!: MascotaPropiaExportadaDto | null;

  @ApiProperty({
    type: DatoCuriosoExportadoDto,
    nullable: true,
    description: 'El ultimo dato curioso que se le dio y el dia (SCRUM-185).',
  })
  datoCurioso!: DatoCuriosoExportadoDto | null;

  /** Un resultado de la lista `resultados`, con el titulo de su sesion si la hizo. */
  static resultado(exportado: ResultadoExportado): ResultadoExportadoDto {
    const dto: ResultadoExportadoDto = ResultadoRespuestaDto.desde(exportado.resultado);

    if (exportado.titulo !== undefined) {
      dto.sesion = exportado.titulo;
    }

    return dto;
  }

  /** Todo menos las tres listas, que no caben en una pieza: salen por paginas. */
  static sinListas(datos: DatosExportados): ExportacionSinListas {
    const { preferencias, navegadores } = datos.avisos;

    return {
      generadoEn: datos.generadoEn.toISOString(),
      cuenta: CuentaRespuestaDto.desde(datos.cuenta),
      fechaNacimiento: datos.cuenta.fechaDeNacimiento?.valor ?? null,
      consentimientos: datos.consentimientos.map((aceptado) => ({
        tipo: aceptado.tipo,
        version: aceptado.version,
        aceptadoEn: aceptado.aceptadoEn.toISOString(),
      })),
      avisos: {
        horaSemaforo:
          preferencias.minutoSemaforo === null ? null : horaDeMinuto(preferencias.minutoSemaforo),
        frecuenciaSemaforo: preferencias.frecuenciaSemaforo,
        horaRacha:
          preferencias.minutoRacha === null ? null : horaDeMinuto(preferencias.minutoRacha),
        recordatorioManana: preferencias.minutoManana !== null,
        recordatorioNoche: preferencias.minutoNoche !== null,
        navegadores,
      },
      foto:
        datos.foto === null
          ? null
          : {
              tipo: datos.foto.tipo,
              actualizadaEl: datos.foto.actualizadaEl.toISOString(),
              contenidoBase64: Buffer.from(datos.foto.contenido).toString('base64'),
            },
      mascotaPropia:
        datos.mascotaPropia === null
          ? null
          : {
              tipo: datos.mascotaPropia.tipo,
              actualizadaEl: datos.mascotaPropia.actualizadaEl.toISOString(),
              contenido: new TextDecoder().decode(datos.mascotaPropia.contenido),
            },
      datoCurioso: datos.datoCurioso,
    };
  }
}

/** De la exportacion, lo que se arma de una pieza: todo menos las tres listas por paginas. */
export type ExportacionSinListas = Omit<
  ExportacionDto,
  'resultados' | 'entradasDeDiario' | 'pendientes'
>;
