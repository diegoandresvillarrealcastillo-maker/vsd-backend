import { Controller, Get, Header, Inject, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { ConsultarHistorialDelModuloUseCase } from '../../domain/ports/in/ConsultarHistorialDelModuloUseCase.js';
import type { ConsultarProgresoUseCase } from '../../domain/ports/in/ConsultarProgresoUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { CONSULTAR_HISTORIAL_DEL_MODULO, CONSULTAR_PROGRESO } from '../config/tokens.js';
import {
  HistorialDelModuloConsultaDto,
  HistorialDelModuloParametrosDto,
  PaginaDelHistorialDto,
} from './dto/HistorialDelModuloDto.js';
import { ProgresoRespuestaDto } from './dto/ProgresoRespuestaDto.js';

/** El sendero de cada modulo activo (SCRUM-91). */
@ApiTags('Progreso')
@ApiBearerAuth('sesion')
@Controller('api/progreso')
export class ProgresoController {
  constructor(
    @Inject(CONSULTAR_PROGRESO)
    private readonly progreso: ConsultarProgresoUseCase,
    @Inject(CONSULTAR_HISTORIAL_DEL_MODULO)
    private readonly historial: ConsultarHistorialDelModuloUseCase,
  ) {}

  @Get()
  // Cambia cada vez que la persona hace algo: no tiene sentido guardarlo.
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar el progreso de cada modulo activo',
    description:
      'Por cada modulo activo de quien firma el token: la etapa en la que va, las sesiones hechas, lo que le toca hoy (sin tope) y, en sugeridas, otras abiertas hasta completar un minimo sugerido de tres, que no cuentan para nada. Una sesion es un dia en el que hizo algo del modulo, contado en la zona horaria de la persona. Se calcula a partir de los resultados; no se guarda aparte. Lista vacia si todavia no eligio modulos.',
  })
  @ApiResponse({ status: 200, type: [ProgresoRespuestaDto] })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async consultar(@CuentaActual() cuenta: User): Promise<ProgresoRespuestaDto[]> {
    const progreso = await this.progreso.execute(cuenta.id);

    return progreso.map((modulo) => ProgresoRespuestaDto.desde(modulo));
  }

  @Get(':modulo/historial')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar el historial de un modulo',
    description:
      'Lo que la persona hizo en ese modulo, del mas reciente al mas antiguo, por paginas que arma el servidor: la actividad, su dia y la hora. Nunca el puntaje, ni el nivel, ni lo que escribio. Paginado por cursor: se pide la siguiente con el texto de siguientePagina. Es de cualquier modulo conocido, este activo o no. Sale de los resultados, asi que entra en la exportacion y se borra con la cuenta.',
  })
  @ApiResponse({ status: 200, type: PaginaDelHistorialDto })
  @ApiResponse({
    status: 400,
    description: 'Un modulo que no existe, un limite fuera de rango o una pagina que no es valida.',
  })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async historialDelModulo(
    @Param() parametros: HistorialDelModuloParametrosDto,
    @Query() consulta: HistorialDelModuloConsultaDto,
    @CuentaActual() cuenta: User,
  ): Promise<PaginaDelHistorialDto> {
    const pagina = await this.historial.execute({
      userId: cuenta.id,
      modulo: parametros.modulo,
      limite: consulta.limite,
      pagina: consulta.pagina,
    });

    return PaginaDelHistorialDto.desde(pagina);
  }
}
