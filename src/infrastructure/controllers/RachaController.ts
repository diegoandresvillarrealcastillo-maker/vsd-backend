import { Controller, Get, Header, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { ConsultarRachaUseCase } from '../../domain/ports/in/ConsultarRachaUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { CONSULTAR_RACHA } from '../config/tokens.js';
import { RachaRespuestaDto } from './dto/RachaRespuestaDto.js';

/** La racha de la persona: dias seguidos con al menos una actividad (SCRUM-186). */
@ApiTags('Racha')
@ApiBearerAuth('sesion')
@Controller('api/racha')
export class RachaController {
  constructor(
    @Inject(CONSULTAR_RACHA)
    private readonly racha: ConsultarRachaUseCase,
  ) {}

  @Get()
  // Cambia cada vez que la persona hace algo: no tiene sentido guardarlo.
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar la racha de quien firma el token',
    description:
      'Los dias seguidos en que hizo al menos una actividad, contados en la zona horaria de la persona. Hoy no rompe la cadena hasta que termina. Tres dias sin actividad por mes calendario se cubren solos (congelamientos); al cuarto la llama descansa y vuelve con la siguiente actividad. Se calcula a partir de los resultados, no se guarda aparte.',
  })
  @ApiResponse({ status: 200, type: RachaRespuestaDto })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async consultar(@CuentaActual() cuenta: User): Promise<RachaRespuestaDto> {
    return RachaRespuestaDto.desde(await this.racha.execute(cuenta.id));
  }
}
