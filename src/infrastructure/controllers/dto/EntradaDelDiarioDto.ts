import { ApiProperty } from '@nestjs/swagger';
import type { Adjunto, NodoDelDocumento } from '../../../domain/model/DocumentoDelDiario.js';
import type { EntradaDeDiario } from '../../../domain/model/EntradaDeDiario.js';
import type { AnotacionGuardada } from '../../../domain/ports/in/EscribirEnElDiarioUseCase.js';
import { RecursoDto } from './RecursoDto.js';

const EJEMPLO_DE_DOCUMENTO = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Hoy salí a caminar con ' },
        { type: 'text', text: 'calma', marks: [{ type: 'bold' }] },
        { type: 'text', text: '.' },
      ],
    },
  ],
};

/** Una anotacion del diario, tal como sale por la API (SCRUM-95). */
export class EntradaDelDiarioDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({
    description: 'El día al que pertenece, en el calendario de Colombia.',
    example: '2026-10-03',
    format: 'date',
  })
  dia!: string;

  @ApiProperty({ nullable: true, type: String, maxLength: 120 })
  titulo!: string | null;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description:
      'El documento del editor: un árbol de nodos con "type", y opcionalmente "content", "text", "marks" y "attrs". Nunca HTML.',
    example: EJEMPLO_DE_DOCUMENTO,
  })
  contenido!: NodoDelDocumento;

  @ApiProperty({
    type: 'array',
    items: { type: 'object', additionalProperties: true },
    description:
      'Los diagramas de la anotación: { id, tipo: "diagrama", datos }. Los datos son la escena del editor de diagramas, tal cual.',
  })
  adjuntos!: Adjunto[];

  @ApiProperty({
    description:
      'Sube con cada edición. Hay que enviarla al editar: si no coincide, alguien la cambió desde otro dispositivo.',
    example: 1,
  })
  version!: number;

  @ApiProperty({ type: String, format: 'date-time', description: 'Cuándo se escribió de verdad.' })
  creadaEn!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  editadaEn!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description:
      'Hasta cuándo se puede editar: una hora después de escribirla. Después, lo nuevo va en otra anotación.',
  })
  editableHasta!: string;

  static desde(entrada: EntradaDeDiario): EntradaDelDiarioDto {
    return EntradaDelDiarioDto.llenar(new EntradaDelDiarioDto(), entrada);
  }

  protected static llenar<T extends EntradaDelDiarioDto>(dto: T, entrada: EntradaDeDiario): T {
    dto.id = entrada.id.value;
    dto.dia = entrada.dia;
    dto.titulo = entrada.titulo ?? null;
    dto.contenido = entrada.documento.raiz;
    dto.adjuntos = [...entrada.adjuntos];
    dto.version = entrada.version;
    dto.creadaEn = entrada.creadaEn.toISOString();
    dto.editadaEn = entrada.editadaEn.toISOString();
    dto.editableHasta = entrada.editableHasta().toISOString();

    return dto;
  }
}

/**
 * Lo que responden escribir y editar: la anotacion y su acompanamiento.
 *
 * Los mismos dos campos que un resultado (SCRUM-94), con el mismo sentido,
 * para que el cliente los trate igual vengan de donde vengan.
 */
export class AnotacionGuardadaDto extends EntradaDelDiarioDto {
  @ApiProperty({
    description:
      'Si lo escrito trae una señal de riesgo. Se calcula en cada respuesta y no se guarda con la anotación.',
  })
  sugiereAcompanamiento!: boolean;

  @ApiProperty({
    type: [RecursoDto],
    description:
      'Las líneas de atención, ordenadas por alcance (lo nacional primero), cuando sugiereAcompanamiento es cierto. Vacía en otro caso.',
  })
  lineasDeAtencion!: RecursoDto[];

  static deLaGuardada(guardada: AnotacionGuardada): AnotacionGuardadaDto {
    const dto = EntradaDelDiarioDto.llenar(new AnotacionGuardadaDto(), guardada.entrada);

    dto.sugiereAcompanamiento = guardada.sugiereAcompanamiento;
    dto.lineasDeAtencion = guardada.lineasDeAtencion.map((recurso) => RecursoDto.desde(recurso));

    return dto;
  }
}
