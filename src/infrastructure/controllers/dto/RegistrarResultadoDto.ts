import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsObject, IsOptional, IsUUID, Min } from 'class-validator';

/**
 * Cuerpo de la peticion para registrar el resultado de una actividad.
 *
 * Valida el **formato** de lo que llega por HTTP. Las reglas de negocio las
 * sigue haciendo cumplir el dominio.
 *
 * No es duplicar trabajo: esta capa protege la frontera y devuelve un 400 con
 * detalle util, mientras que el dominio garantiza sus invariantes venga la
 * llamada de donde venga. Si manana el caso de uso se invoca desde la cola de
 * sincronizacion sin pasar por HTTP, las reglas siguen aplicandose igual.
 *
 * ## Donde esta el identificador de la persona
 *
 * No esta aqui, y es el cambio del ticket SCRUM-66. Antes se recibia en este
 * cuerpo, lo que significaba que quien llamaba elegia de quien era el
 * resultado: bastaba con escribir el identificador de otra persona.
 *
 * Ahora sale del token que verifica `GuardiaDeSesion`. Un dato que el cliente
 * no puede elegir no necesita validacion de formato, y por eso el campo
 * desaparece del DTO en lugar de quedarse como opcional.
 *
 * Consecuencia practica: la aplicacion valida con `forbidNonWhitelisted`, asi
 * que quien siga enviando `userId` recibe un 400 que lo dice. Es a proposito.
 * Ignorarlo en silencio dejaria a un cliente viejo creyendo que elige el
 * usuario mientras el servidor usa otro, que es la clase de desacuerdo que se
 * descubre tarde y mirando datos raros.
 */
export class RegistrarResultadoDto {
  @ApiProperty({
    description: 'Identificador de la actividad realizada.',
    format: 'uuid',
    example: '33333333-3333-4333-a333-333333333333',
  })
  @IsUUID()
  activityId!: string;

  @ApiProperty({
    description:
      'Identificador de la operacion, generado por el dispositivo. Reenviar el mismo valor en un reintento evita que se duplique el resultado.',
    format: 'uuid',
    example: '44444444-4444-4444-b444-444444444444',
  })
  @IsUUID()
  clientOperationId!: string;

  @ApiPropertyOptional({
    description:
      'Puntaje crudo obtenido, en la escala de la actividad, con hasta dos decimales: son los de la columna donde se guarda, y los de un juego que escala lo logrado al maximo (3 puntos de 8 en una escala de 10 son 3,75). Se omite en las actividades que no se valoran, como anotar el movimiento del dia, que producen datos y no una calificacion. Que una actividad se valore lo dice su escala y no su tipo: hay bitacoras que si puntuan. El maximo lo declara la actividad, no esta peticion.',
    type: Number,
    example: 8,
    minimum: 0,
  })
  @IsOptional()
  // Dos decimales y no un entero (SCRUM-240): una partida a medias escala lo logrado al maximo de la actividad
  // y casi nunca da un entero. Mas de dos se rechaza en lugar de redondearse en silencio: el dato que se guarda
  // es el que se mando.
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0)
  score?: number;

  @ApiPropertyOptional({
    description:
      'La sesión (el contenido) que se hizo, cuando la actividad las tiene (ADR 0030): la que vino en `sesion` del sendero. Tiene que ser una sesión de esa actividad. Una sesión que se retiró después de servirse se acepta: quien la tenía abierta puede terminarla. Se omite en las actividades que no tienen sesiones.',
    format: 'uuid',
    example: '55555555-5555-4555-a555-555555555555',
  })
  @IsOptional()
  @IsUUID()
  idSesion?: string;

  @ApiPropertyOptional({
    description:
      'Informacion propia del tipo de actividad: las horas de una bitacora de sueno, las respuestas de un registro emocional. No puede traer claves que ya sean campos propios.',
    example: { horasDormidas: 6.5, despertares: 2 },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Momento en que se completo la actividad. No puede estar en el futuro.',
    type: String,
    format: 'date-time',
    example: '2026-09-14T11:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  completedAt!: Date;
}
