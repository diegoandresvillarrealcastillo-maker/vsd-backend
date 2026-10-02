import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VERSION_VIGENTE_DEL_AVISO } from '../../domain/model/AvisoDePrivacidad.js';
import { Publico } from '../auth/Publico.js';
import { AvisoRespuestaDto } from './dto/AvisoRespuestaDto.js';

/**
 * La version vigente del aviso de tratamiento de datos.
 *
 * Existe para que la version tenga una sola fuente: el frontend y la coleccion
 * de Postman la piden aqui en lugar de llevar cada uno su copia. Es publica
 * porque no contiene nada de nadie y porque se necesita antes de que exista la
 * cuenta.
 */
@ApiTags('Cuenta')
@Publico()
@Controller('api/aviso')
export class AvisoController {
  @Get()
  @ApiOperation({
    summary: 'Consultar la version vigente del aviso de privacidad',
    description:
      'Devuelve la version que hay que aceptar al dar de alta una cuenta. Es la unica fuente de ese valor: ni el frontend ni las pruebas llevan una copia propia.',
  })
  @ApiResponse({ status: 200, description: 'La version vigente.', type: AvisoRespuestaDto })
  consultar(): AvisoRespuestaDto {
    const aviso = new AvisoRespuestaDto();

    aviso.version = VERSION_VIGENTE_DEL_AVISO;

    return aviso;
  }
}
