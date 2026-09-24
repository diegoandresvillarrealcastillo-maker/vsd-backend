import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * Cuerpo de la peticion al asistente.
 *
 * Quien pregunta **no viaja aqui**: sale del token verificado. Ver
 * SCRUM-66 y el comentario de `RegistrarResultadoDto`.
 *
 * En esta ruta importaba especialmente. El asistente personaliza su respuesta
 * con el historial reciente de quien pregunta, asi que recibir el
 * identificador en el cuerpo permitia preguntarle por la constancia de otra
 * persona y leerla en la respuesta.
 */
export class ConsultarAsistenteDto {
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
