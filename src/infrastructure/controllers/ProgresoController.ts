import { Controller, Get, Header, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { ConsultarProgresoUseCase } from '../../domain/ports/in/ConsultarProgresoUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { CONSULTAR_PROGRESO } from '../config/tokens.js';
import { ProgresoRespuestaDto } from './dto/ProgresoRespuestaDto.js';

/** El sendero de cada modulo activo (SCRUM-91). */
@ApiTags('Progreso')
@ApiBearerAuth('sesion')
@Controller('api/progreso')
export class ProgresoController {
  constructor(
    @Inject(CONSULTAR_PROGRESO)
    private readonly progreso: ConsultarProgresoUseCase,
  ) {}

  @Get()
  // Cambia cada vez que la persona hace algo: no tiene sentido guardarlo.
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar el progreso de cada modulo activo',
    description:
      'Por cada modulo activo de quien firma el token: la etapa en la que va, las sesiones hechas y lo que le toca hoy, con lo que ya hizo. Una sesion es un dia en el que hizo algo del modulo, contado en hora de Colombia. Se calcula a partir de los resultados; no se guarda aparte. Lista vacia si todavia no eligio modulos.',
  })
  @ApiResponse({ status: 200, type: [ProgresoRespuestaDto] })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async consultar(@CuentaActual() cuenta: User): Promise<ProgresoRespuestaDto[]> {
    const progreso = await this.progreso.execute(cuenta.id);

    return progreso.map((modulo) => ProgresoRespuestaDto.desde(modulo));
  }
}
