import { Controller, Get, Header, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { ConsultarDatoCuriosoUseCase } from '../../domain/ports/in/ConsultarDatoCuriosoUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { CONSULTAR_DATO_CURIOSO } from '../config/tokens.js';
import { DatoCuriosoDelDiaRespuestaDto } from './dto/DatoCuriosoDelDiaRespuestaDto.js';

/** El dato curioso del dia (SCRUM-185, ADR 0025). */
@ApiTags('Datos curiosos')
@ApiBearerAuth('sesion')
@Controller('api/datos-curiosos')
export class DatosCuriososController {
  constructor(
    @Inject(CONSULTAR_DATO_CURIOSO)
    private readonly datos: ConsultarDatoCuriosoUseCase,
  ) {}

  @Get('hoy')
  // Cambia con el dia y es de cada persona: no tiene sentido guardarlo en un intermediario.
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar el dato curioso de hoy',
    description:
      'Una frase corta de cultura general, distinta cada dia hasta recorrer todo el catalogo una vez, en un orden propio de cada persona. Es el mismo dato durante todo el dia, contado en la zona horaria de la persona. El dato es null solo si todavia no hay ningun dato publicado.',
  })
  @ApiResponse({ status: 200, type: DatoCuriosoDelDiaRespuestaDto })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async hoy(@CuentaActual() cuenta: User): Promise<DatoCuriosoDelDiaRespuestaDto> {
    return DatoCuriosoDelDiaRespuestaDto.desde(await this.datos.execute(cuenta));
  }
}
