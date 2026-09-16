import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

/** Cuerpo de la peticion al asistente. */
export class ConsultarAsistenteDto {
  @ApiProperty({
    description: 'Identificador de la persona que pregunta.',
    format: 'uuid',
    example: '11111111-1111-4111-8111-111111111111',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description:
      'Lo que escribio la persona, tal cual. No se guarda: se usa para responder y se descarta.',
    example: 'como puedo dormir mejor',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  // El maximo no es por rendimiento. Un campo sin limite es una via para
  // enviar megabytes en cada peticion, y mil caracteres sobran para una
  // pregunta.
  @Length(1, 1000)
  texto!: string;
}
