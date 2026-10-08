import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length, Matches } from 'class-validator';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from '../../../domain/model/AvisoDePrivacidad.js';

/**
 * Cuerpo de la peticion de alta de cuenta.
 *
 * Fijate en lo que **no** lleva: ni correo, ni identificador de persona, ni
 * rol. Los dos primeros salen del token verificado, y el tercero lo fija el
 * caso de uso.
 *
 * Que el rol pudiera llegar aqui convertiria el alta en una via de escalada de
 * privilegios: bastaria con anadir un campo al cuerpo. Con `forbidNonWhitelisted`
 * activo, intentarlo produce un 400.
 *
 * ## Todo es opcional aqui, y obligatorio al crear
 *
 * La misma llamada sirve para volver a entrar, y quien ya tiene su registro
 * completo no manda nada de esto. Que **falten** fecha o casillas al crear una
 * cuenta no se resuelve en el DTO sino en el caso de uso, que es quien sabe si
 * la cuenta existe: responde 400 con el codigo del motivo.
 */
export class RegistrarCuentaDto {
  @ApiPropertyOptional({
    description:
      'Fecha de nacimiento, AAAA-MM-DD. Obligatoria para crear la cuenta y para completar la de quien se registró antes de que se pidiera. VSD Health es solo para mayores de 18 años: con menos, la respuesta es 403 MENOR_DE_EDAD y no se guarda nada. La edad la calcula el servidor.',
    example: '1998-03-14',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaNacimiento debe tener el formato AAAA-MM-DD.' })
  fechaNacimiento?: string;

  @ApiPropertyOptional({
    description:
      'Versión del aviso de tratamiento de datos que la persona aceptó. No basta un sí o un no: las políticas cambian, y ante una reclamación hay que poder demostrar a qué se dio permiso y cuándo. Tiene que ser la vigente, que devuelve `GET /api/aviso`; otra se rechaza con 409.',
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
      'Versión de los términos que la persona aceptó. Tiene que ser la vigente, que devuelve `GET /api/aviso`; otra se rechaza con 409.',
    example: VERSION_VIGENTE_DE_LOS_TERMINOS,
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  versionTerminos?: string;

  @ApiPropertyOptional({
    description:
      'Que la persona marcó la casilla del aviso de privacidad. Tiene que ser true: enviar la versión sola ya no cuenta como aceptarlo.',
  })
  @IsOptional()
  @IsBoolean()
  aceptaAviso?: boolean;

  @ApiPropertyOptional({
    description: 'Que la persona marcó la casilla de los términos. Tiene que ser true.',
  })
  @IsOptional()
  @IsBoolean()
  aceptaTerminos?: boolean;

  @ApiPropertyOptional({
    description: 'Nombre con el que la persona quiere que la llamen.',
    example: 'Diego',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;

  @ApiPropertyOptional({
    description:
      'Zona horaria del dispositivo, como la entrega Intl.DateTimeFormat().resolvedOptions().timeZone. Decide que dia es para la persona, y con ella se cuenta su edad. Se manda en cada entrada: si la cuenta ya existe y la zona es otra, se actualiza. Una zona que el servidor no conoce se rechaza con 400 ZONA_HORARIA_INVALIDA.',
    example: 'America/Bogota',
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  zonaHoraria?: string;
}
