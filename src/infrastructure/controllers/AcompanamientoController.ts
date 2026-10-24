import { Controller, Get, Header, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { ConsultarAcompanamientoUseCase } from '../../domain/ports/in/ConsultarAcompanamientoUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { CONSULTAR_ACOMPANAMIENTO } from '../config/tokens.js';
import { AcompanamientoRespuestaDto } from './dto/AcompanamientoRespuestaDto.js';

/** El acompanamiento por dias seguidos con atencion (SCRUM-177). */
@ApiTags('Acompanamiento')
@ApiBearerAuth('sesion')
@Controller('api/acompanamiento')
export class AcompanamientoController {
  constructor(
    @Inject(CONSULTAR_ACOMPANAMIENTO)
    private readonly acompanamiento: ConsultarAcompanamientoUseCase,
  ) {}

  @Get()
  // Cambia cada vez que la persona hace algo, y es sobre ella: no se guarda en ninguna cache.
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar si conviene ofrecer acompanamiento a quien firma el token',
    description:
      'Cuenta los dias seguidos, en la zona horaria de la persona, con al menos un resultado que requiere atencion. Hoy no rompe la cadena hasta que termina; un dia sin atencion o sin datos la rompe. 3 dias seguidos son nivel moderado y 7, critico; con el critico vienen las lineas de atencion de su pais. Se calcula a partir de los resultados, no se guarda aparte, y no devuelve puntajes ni cuantos dias van. Es una senal de acompanamiento, nunca un diagnostico.',
  })
  @ApiResponse({ status: 200, type: AcompanamientoRespuestaDto })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async consultar(@CuentaActual() cuenta: User): Promise<AcompanamientoRespuestaDto> {
    return AcompanamientoRespuestaDto.desde(await this.acompanamiento.execute(cuenta.id));
  }
}
