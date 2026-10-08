import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import type {
  PaisConLineas,
  ReglaLocalDeCharla,
  ReglaLocalDeIntencion,
  ReglasLocalesDelAsistente,
} from '../../../domain/ports/in/ConsultarLasReglasLocalesUseCase.js';
import { RecursoDto } from './RecursoDto.js';

/** Otra respuesta para la misma intencion, segun lo que diga el mensaje. */
export class VarianteDeCharlaDto {
  @ApiProperty({ type: [String], example: ['buenas noches'] })
  patrones!: string[];

  @ApiProperty({ example: '¡Buenas noches! Aquí estoy si quieres preguntarme algo.' })
  mensaje!: string;
}

export class ReglaDeCharlaDto {
  @ApiProperty({ example: 'saludo' })
  intencion!: string;

  @ApiProperty({
    type: [String],
    description:
      'Palabras completas, sin tildes y en minusculas. Un patron son una o varias palabras seguidas; si termina en `*` es una raiz que admite terminaciones.',
    example: ['hola', 'buenas tardes', 'saludo*'],
  })
  patrones!: string[];

  @ApiProperty({
    type: String,
    nullable: true,
    description:
      'Lo que se responde sin conexion, o null si esa intencion no se puede responder sin conexion. Una regla sin mensaje se publica igual: su sitio en el orden es lo que decide que "hola, como estas" no sea un saludo.',
  })
  mensaje!: string | null;

  @ApiProperty({
    type: [VarianteDeCharlaDto],
    description: 'Respuestas distintas segun el mensaje. La primera cuyo patron aparezca gana.',
  })
  variantes!: VarianteDeCharlaDto[];

  static desde(regla: ReglaLocalDeCharla): ReglaDeCharlaDto {
    const dto = new ReglaDeCharlaDto();

    dto.intencion = regla.intencion;
    dto.patrones = [...regla.patrones];
    dto.mensaje = regla.mensaje;
    dto.variantes = regla.variantes.map((variante) => ({
      patrones: [...variante.patrones],
      mensaje: variante.mensaje,
    }));

    return dto;
  }
}

export class ReglaDeIntencionDto {
  @ApiProperty({ example: 'donde_busco_ayuda' })
  intencion!: string;

  @ApiProperty({ type: [String], example: ['ayud*', 'psicolog*'] })
  patrones!: string[];

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Lo que se responde sin conexion, o null si esa intencion exige conexion.',
  })
  mensaje!: string | null;

  @ApiProperty({
    description: 'Cierto si la respuesta lleva las lineas de atencion del pais de la persona.',
  })
  conLineas!: boolean;

  static desde(regla: ReglaLocalDeIntencion): ReglaDeIntencionDto {
    const dto = new ReglaDeIntencionDto();

    dto.intencion = regla.intencion;
    dto.patrones = [...regla.patrones];
    dto.mensaje = regla.mensaje;
    dto.conLineas = regla.conLineas;

    return dto;
  }
}

export class PaisConLineasDto {
  @ApiProperty({
    type: [String],
    description:
      'Las zonas horarias de ese pais. El pais de una persona sale de la zona de su cuenta: nunca se pide ubicacion.',
    example: ['America/Bogota'],
  })
  zonas!: string[];

  @ApiProperty({
    type: [RecursoDto],
    description: 'Ordenadas por alcance: lo nacional va primero.',
  })
  lineas!: RecursoDto[];

  static desde(pais: PaisConLineas): PaisConLineasDto {
    const dto = new PaisConLineasDto();

    dto.zonas = [...pais.zonas];
    dto.lineas = pais.lineas.map((linea) => RecursoDto.desde(linea));

    return dto;
  }
}

export class RiesgoLocalDto {
  @ApiProperty({
    type: [String],
    description:
      'Las expresiones que obligan a mostrar las lineas de atencion, ya normalizadas. Se buscan dentro del texto normalizado (sin tildes, en minusculas, espacios colapsados).',
  })
  expresiones!: string[];

  @ApiProperty({ description: 'El mensaje que acompana a las lineas. Es el mismo con conexion.' })
  mensaje!: string;
}

export class CharlaLocalDto {
  @ApiProperty({
    type: [ReglaDeCharlaDto],
    description: 'En el orden en que se evaluan: la primera que coincide gana.',
  })
  reglas!: ReglaDeCharlaDto[];

  @ApiProperty({
    type: [String],
    description: 'Palabras que pueden acompanar a la charla sin dejar de serlo.',
  })
  relleno!: string[];
}

/**
 * Lo que hace falta para que VSD IA responda lo basico sin conexion (SCRUM-141).
 *
 * Es publico y es el mismo para todo el mundo: no lleva nada de nadie. Lo que
 * escribe una persona no viaja ni se guarda aqui: este paquete solo baja.
 */
export class ReglasLocalesDelAsistenteDto {
  @ApiProperty({
    example: 1,
    description:
      'La version de la forma de este paquete. Una aplicacion que no conozca el esquema que llega debe seguir con lo que ya tenia.',
  })
  esquema!: number;

  @ApiProperty({ type: RiesgoLocalDto })
  riesgo!: RiesgoLocalDto;

  @ApiProperty({ type: CharlaLocalDto })
  charla!: CharlaLocalDto;

  @ApiProperty({
    type: [ReglaDeIntencionDto],
    description: 'Lo demas que el servidor reconoce, en su orden.',
  })
  intenciones!: ReglaDeIntencionDto[];

  @ApiProperty({
    type: 'object',
    additionalProperties: { $ref: getSchemaPath(PaisConLineasDto) },
    description: 'Los paises con lineas verificadas, por su codigo ISO de dos letras.',
  })
  paises!: Record<string, PaisConLineasDto>;

  @ApiProperty({
    type: [RecursoDto],
    description:
      'Lo que recibe quien esta en una zona de un pais sin lineas verificadas: el directorio internacional, y ningun telefono.',
  })
  internacional!: RecursoDto[];

  static desde(reglas: ReglasLocalesDelAsistente): ReglasLocalesDelAsistenteDto {
    const dto = new ReglasLocalesDelAsistenteDto();

    dto.esquema = reglas.esquema;
    dto.riesgo = { expresiones: [...reglas.riesgo.expresiones], mensaje: reglas.riesgo.mensaje };
    dto.charla = {
      reglas: reglas.charla.reglas.map((regla) => ReglaDeCharlaDto.desde(regla)),
      relleno: [...reglas.charla.relleno],
    };
    dto.intenciones = reglas.intenciones.map((regla) => ReglaDeIntencionDto.desde(regla));
    dto.paises = Object.fromEntries(
      Object.entries(reglas.paises).map(([codigo, pais]) => [codigo, PaisConLineasDto.desde(pais)]),
    );
    dto.internacional = reglas.internacional.map((linea) => RecursoDto.desde(linea));

    return dto;
  }
}
