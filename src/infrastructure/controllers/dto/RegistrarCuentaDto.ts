import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

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
 */
export class RegistrarCuentaDto {
  @ApiProperty({
    description:
      'Version del aviso de tratamiento de datos que la persona acepto. No basta un si o un no: las politicas cambian, y ante una reclamacion hay que poder demostrar a que se dio permiso y cuando.',
    example: '1.0',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  @Length(1, 20)
  versionPolitica!: string;

  @ApiPropertyOptional({
    description: 'Nombre con el que la persona quiere que la llamen.',
    example: 'Diego',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;
}
