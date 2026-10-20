import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from '../../../domain/model/AvisoDePrivacidad.js';

/**
 * Cuerpo de la peticion para volver a aceptar el aviso y los terminos (SCRUM-237).
 *
 * Como en el alta, todo es opcional aqui y obligatorio **donde hay algo pendiente**: que falte una
 * casilla o una version no se resuelve en el DTO sino en el caso de uso, que es quien sabe cual de
 * los dos textos cambio, y responde 400 con el codigo del motivo.
 *
 * Lo que **no** lleva: ni identificador de cuenta ni fecha. La cuenta sale del token, y la fecha de
 * la aceptacion la pone el servidor: es la prueba de cuando se acepto y no la dice quien acepta.
 */
export class AceptarTextosDto {
  @ApiPropertyOptional({
    description:
      'Que la persona marcó la casilla del aviso de privacidad. Tiene que ser true si el aviso está pendiente (`textosPendientes` de la cuenta lo incluye); si no lo está, se ignora.',
  })
  @IsOptional()
  @IsBoolean()
  aceptaAviso?: boolean;

  @ApiPropertyOptional({
    description:
      'Versión del aviso que la persona aceptó. Tiene que ser la vigente, que devuelve `GET /api/aviso`; otra se rechaza con 409.',
    example: VERSION_VIGENTE_DEL_AVISO,
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  versionPolitica?: string;

  @ApiPropertyOptional({
    description:
      'Que la persona marcó la casilla de los términos. Tiene que ser true si los términos están pendientes; si no lo están, se ignora.',
  })
  @IsOptional()
  @IsBoolean()
  aceptaTerminos?: boolean;

  @ApiPropertyOptional({
    description:
      'Versión de los términos que la persona aceptó. Tiene que ser la vigente, que devuelve `GET /api/aviso`; otra se rechaza con 409.',
    example: VERSION_VIGENTE_DE_LOS_TERMINOS,
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  versionTerminos?: string;
}
