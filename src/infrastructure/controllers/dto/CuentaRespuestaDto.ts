import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { User } from '../../../domain/model/User.js';
import { MascotaDto } from './ActualizarPreferenciasDto.js';

/** El consentimiento tal como se devuelve. */
export class ConsentimientoDto {
  @ApiProperty({ description: 'Version del aviso aceptada.', example: '1.0' })
  versionPolitica!: string;

  @ApiProperty({ description: 'Cuando se acepto.', type: String, format: 'date-time' })
  aceptadoEn!: Date;
}

/** La foto de perfil, tal como la ve la cuenta: que hay y desde cuando, no los bytes. */
export class FotoDeLaCuentaDto {
  @ApiProperty({
    description:
      'Cuando se guardo la foto actual. Cambia con cada foto nueva: sirve para saber si la que se tenia ya no es la vigente.',
    type: String,
    format: 'date-time',
  })
  actualizadaEl!: Date;
}

/** La mascota propia, vista desde la cuenta: que hay y desde cuando, no el dibujo. */
export class MascotaPropiaDeLaCuentaDto {
  @ApiProperty({
    description:
      'Cuando se guardo la mascota propia actual. Cambia con cada una nueva: sirve para saber si la que se tenia ya no es la vigente.',
    type: String,
    format: 'date-time',
  })
  actualizadaEl!: Date;
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

  @ApiProperty({
    description:
      'Los términos que aceptó con su casilla, o null en las cuentas anteriores a que se pidieran.',
    type: ConsentimientoDto,
    nullable: true,
  })
  terminos!: ConsentimientoDto | null;

  @ApiProperty({
    description:
      'Si la cuenta tiene su registro completo: la fecha de nacimiento y el aviso y los términos aceptados con casilla. Si es false (cuentas anteriores a que se pidiera), la API responde 403 REGISTRO_INCOMPLETO a todo menos a ver, exportar y borrar la cuenta, y el frontend lleva a la pantalla «Completa tu registro».',
  })
  registroCompleto!: boolean;

  @ApiProperty({ description: 'Cuando se creo la cuenta.', type: String, format: 'date-time' })
  registradoEn!: Date;

  @ApiProperty({
    description:
      'Modulos activos, en orden. Vacio mientras la persona no ha elegido: el frontend la lleva a la bienvenida.',
    type: [String],
    enum: ['cognicion', 'bienestar', 'emociones'],
  })
  modulosActivos!: string[];

  @ApiProperty({
    description: 'La mascota guardada, o null para usar la de siempre.',
    type: MascotaDto,
    nullable: true,
  })
  mascota!: MascotaDto | null;

  @ApiProperty({
    description:
      'Si permite que el diario se lea para recomendarle algo. Apagado por defecto (SCRUM-108).',
  })
  diarioConRecomendaciones!: boolean;

  @ApiProperty({
    description:
      'Zona horaria de la persona, la que informo su dispositivo. Decide que dia es para ella (SCRUM-123).',
    example: 'America/Bogota',
  })
  zonaHoraria!: string;

  @ApiProperty({
    description:
      'La foto de perfil, o null si no tiene (SCRUM-120). Aqui solo dice que hay y desde cuando; la foto se pide a GET /api/cuenta/foto.',
    type: FotoDeLaCuentaDto,
    nullable: true,
  })
  foto!: FotoDeLaCuentaDto | null;

  @ApiProperty({
    description:
      'La mascota propia, un SVG, o null si no tiene (SCRUM-122). Aqui solo dice que hay y desde cuando; el dibujo se pide a GET /api/cuenta/mascota-propia. Para usarla como mascota, `mascota.forma` es `propia`.',
    type: MascotaPropiaDeLaCuentaDto,
    nullable: true,
  })
  mascotaPropia!: MascotaPropiaDeLaCuentaDto | null;

  static desde(cuenta: User): CuentaRespuestaDto {
    const dto = new CuentaRespuestaDto();

    dto.id = cuenta.id.value;
    dto.correo = cuenta.correo;
    dto.rol = cuenta.rol;
    dto.registradoEn = cuenta.registradoEn;
    dto.modulosActivos = [...cuenta.modulosActivos];
    dto.mascota = cuenta.mascota === undefined ? null : { ...cuenta.mascota };
    dto.diarioConRecomendaciones = cuenta.diarioConRecomendaciones;
    dto.zonaHoraria = cuenta.zonaHoraria;
    dto.foto =
      cuenta.fotoActualizadaEl === undefined ? null : { actualizadaEl: cuenta.fotoActualizadaEl };
    dto.mascotaPropia =
      cuenta.mascotaPropiaActualizadaEl === undefined
        ? null
        : { actualizadaEl: cuenta.mascotaPropiaActualizadaEl };

    if (cuenta.nombre !== undefined) {
      dto.nombre = cuenta.nombre;
    }

    // La tabla exige consentimiento, asi que toda cuenta guardada lo tiene.
    // Si faltara seria un fallo nuestro, no un caso que deba tratarse aqui.
    const consentimiento = new ConsentimientoDto();

    consentimiento.versionPolitica = cuenta.consentimiento?.versionPolitica ?? '';
    consentimiento.aceptadoEn = cuenta.consentimiento?.aceptadoEn ?? cuenta.registradoEn;

    dto.consentimiento = consentimiento;
    dto.registroCompleto = cuenta.registroCompleto();
    dto.terminos =
      cuenta.terminos === undefined
        ? null
        : {
            versionPolitica: cuenta.terminos.versionPolitica,
            aceptadoEn: cuenta.terminos.aceptadoEn,
          };

    return dto;
  }
}
