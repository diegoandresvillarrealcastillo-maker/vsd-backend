import { ApiProperty } from '@nestjs/swagger';
import { VERSION_VIGENTE_DEL_AVISO } from '../../../domain/model/AvisoDePrivacidad.js';

/** La version del aviso de tratamiento de datos que esta en vigor. */
export class AvisoRespuestaDto {
  @ApiProperty({
    description:
      'Version vigente del aviso. Es la que hay que enviar en `versionPolitica` al dar de alta una cuenta; cualquier otra se rechaza con 409.',
    example: VERSION_VIGENTE_DEL_AVISO,
  })
  version!: string;
}
