import { ApiProperty } from '@nestjs/swagger';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from '../../../domain/model/AvisoDePrivacidad.js';

/** Las versiones de los textos legales que estan en vigor. */
export class AvisoRespuestaDto {
  @ApiProperty({
    description:
      'Version vigente del aviso de privacidad. Es la que hay que enviar en `versionPolitica` al dar de alta una cuenta; cualquier otra se rechaza con 409.',
    example: VERSION_VIGENTE_DEL_AVISO,
  })
  version!: string;

  @ApiProperty({
    description:
      'Version vigente de los terminos. Es la que hay que enviar en `versionTerminos` al dar de alta una cuenta; cualquier otra se rechaza con 409.',
    example: VERSION_VIGENTE_DE_LOS_TERMINOS,
  })
  versionTerminos!: string;
}
