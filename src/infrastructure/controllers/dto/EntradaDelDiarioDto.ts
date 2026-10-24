import { ApiProperty } from '@nestjs/swagger';
import type { Dia } from '../../../domain/model/Calendario.js';
import type { Adjunto, NodoDelDocumento } from '../../../domain/model/DocumentoDelDiario.js';
import type { EntradaDeDiario } from '../../../domain/model/EntradaDeDiario.js';
import type { AnotacionGuardada } from '../../../domain/ports/in/EscribirEnElDiarioUseCase.js';
import type { CartaEnEspera } from '../../../domain/ports/out/DiarioRepositoryPort.js';

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
    description: 'El día al que pertenece, en el calendario de la persona.',
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
      'Hasta cuándo se puede editar: una hora después de escribirla. Después, lo nuevo va en otra anotación. Una carta que espera no se edita: trae la hora en que se escribió, que ya pasó.',
  })
  editableHasta!: string;

  @ApiProperty({
    description:
      'Si es una «carta a mí de mañana» (SCRUM-230): se escribe hoy y se lee, si la persona quiere, desde mañana.',
  })
  carta!: boolean;

  @ApiProperty({
    description:
      'Si es una carta que todavía espera: sin abrir y dentro de su semana. Mientras espera, titulo, contenido y adjuntos vienen vacíos: el texto solo sale al abrirla (POST /api/diario/{id}/abrir). Pasada la semana sin abrir vuelve al diario como cualquier anotación.',
  })
  sellada!: boolean;

  /**
   * Una anotacion tal como sale por la API.
   *
   * Con `hoy` (el dia de la persona), una carta que espera sale **sin su texto**. Sin `hoy` sale
   * completa: es lo que usa la exportacion, que entrega todo lo de la persona, y abrir la carta.
   */
  static desde(entrada: EntradaDeDiario, hoy?: Dia): EntradaDelDiarioDto {
    return EntradaDelDiarioDto.llenar(new EntradaDelDiarioDto(), entrada, hoy);
  }

  protected static llenar<T extends EntradaDelDiarioDto>(
    dto: T,
    entrada: EntradaDeDiario,
    hoy?: Dia,
  ): T {
    const sellada = hoy !== undefined && entrada.estaSellada(hoy);

    dto.id = entrada.id.value;
    dto.dia = entrada.dia;
    dto.titulo = sellada ? null : (entrada.titulo ?? null);
    dto.contenido = sellada ? { type: 'doc' } : entrada.documento.raiz;
    dto.adjuntos = sellada ? [] : [...entrada.adjuntos];
    dto.version = entrada.version;
    dto.creadaEn = entrada.creadaEn.toISOString();
    dto.editadaEn = entrada.editadaEn.toISOString();
    dto.editableHasta = (sellada ? entrada.creadaEn : entrada.editableHasta()).toISOString();
    dto.carta = entrada.cartaAManana;
    dto.sellada = sellada;

    return dto;
  }
}

/**
 * Lo que responden escribir y editar: la anotacion y si conviene acompanarla.
 *
 * `sugiereAcompanamiento` tiene el sentido que en un resultado (SCRUM-94), pero
 * aqui **no viajan lineas de atencion** (SCRUM-194): el diario es lo mas
 * personal que hay, y el telefono pegado a lo recien escrito se siente como una
 * alarma. El cliente ofrece ayuda, y las lineas del pais las da el asistente.
 */
export class AnotacionGuardadaDto extends EntradaDelDiarioDto {
  @ApiProperty({
    description:
      'Si lo escrito trae una señal de riesgo y la persona permitió que su diario se lea (SCRUM-108). Se calcula en cada respuesta y no se guarda con la anotación. No trae líneas de atención: se ofrece ayuda y se piden al asistente.',
  })
  sugiereAcompanamiento!: boolean;

  static deLaGuardada(guardada: AnotacionGuardada, hoy?: Dia): AnotacionGuardadaDto {
    const dto = EntradaDelDiarioDto.llenar(new AnotacionGuardadaDto(), guardada.entrada, hoy);

    dto.sugiereAcompanamiento = guardada.sugiereAcompanamiento;

    return dto;
  }
}

/**
 * Una carta que espera (SCRUM-230): lo justo para ofrecerla en la tarjeta «Ayer te dejaste esto».
 * **No lleva su texto**: la persona decide si leerla (abrirla) o borrarla sin leerla.
 */
export class CartaEnEsperaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({
    description: 'El día en que se escribió, en el calendario de la persona.',
    example: '2026-10-03',
    format: 'date',
  })
  dia!: string;

  static desde(carta: CartaEnEspera): CartaEnEsperaDto {
    const dto = new CartaEnEsperaDto();

    dto.id = carta.id.value;
    dto.dia = carta.dia;

    return dto;
  }
}
