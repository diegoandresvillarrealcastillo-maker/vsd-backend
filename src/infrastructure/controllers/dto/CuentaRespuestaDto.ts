import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { User } from '../../../domain/model/User.js';

/** El consentimiento tal como se devuelve. */
export class ConsentimientoDto {
  @ApiProperty({ description: 'Version del aviso aceptada.', example: '1.0' })
  versionPolitica!: string;

  @ApiProperty({ description: 'Cuando se acepto.', type: String, format: 'date-time' })
  aceptadoEn!: Date;
}

/**
 * La cuenta, tal como sale por la API.
 *
 * Devuelve el identificador **nuestro**, que es el que las demas operaciones
 * relacionan. El del proveedor no sale: es un detalle de como se autentica la
 * persona y no aporta nada a quien consume la API.
 */
export class CuentaRespuestaDto {
  @ApiProperty({ description: 'Identificador de la cuenta en VSD Health.', format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Correo de la cuenta.', format: 'email' })
  correo!: string;

  @ApiProperty({ description: 'Rol de la cuenta.', enum: ['usuario', 'administrador'] })
  rol!: string;

  @ApiPropertyOptional({ description: 'Nombre con el que quiere que la llamen.' })
  nombre?: string;

  @ApiProperty({ description: 'Consentimiento registrado.', type: ConsentimientoDto })
  consentimiento!: ConsentimientoDto;

  @ApiProperty({ description: 'Cuando se creo la cuenta.', type: String, format: 'date-time' })
  registradoEn!: Date;

  static desde(cuenta: User): CuentaRespuestaDto {
    const dto = new CuentaRespuestaDto();

    dto.id = cuenta.id.value;
    dto.correo = cuenta.correo;
    dto.rol = cuenta.rol;
    dto.registradoEn = cuenta.registradoEn;

    if (cuenta.nombre !== undefined) {
      dto.nombre = cuenta.nombre;
    }

    // La tabla exige consentimiento, asi que toda cuenta guardada lo tiene.
    // Si faltara seria un fallo nuestro, no un caso que deba tratarse aqui.
    const consentimiento = new ConsentimientoDto();

    consentimiento.versionPolitica = cuenta.consentimiento?.versionPolitica ?? '';
    consentimiento.aceptadoEn = cuenta.consentimiento?.aceptadoEn ?? cuenta.registradoEn;

    dto.consentimiento = consentimiento;

    return dto;
  }
}
