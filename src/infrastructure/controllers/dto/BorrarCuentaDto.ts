import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

/** La frase que hay que mandar para borrar la cuenta. */
export const FRASE_DE_CONFIRMACION = 'BORRAR MI CUENTA';

/**
 * Cuerpo de `DELETE /api/cuenta`.
 *
 * Borrar no tiene vuelta atras, asi que no basta con llamar a la ruta: hay que
 * mandar la frase exacta. Protege de un clic o un reintento automatico que
 * nadie quiso, no de una persona decidida, y esa es la idea.
 */
export class BorrarCuentaDto {
  @ApiProperty({
    description: `Tiene que ser exactamente "${FRASE_DE_CONFIRMACION}".`,
    example: FRASE_DE_CONFIRMACION,
  })
  @Equals(FRASE_DE_CONFIRMACION, {
    message: `Para borrar la cuenta hay que confirmar con la frase "${FRASE_DE_CONFIRMACION}".`,
  })
  confirmacion!: string;
}
