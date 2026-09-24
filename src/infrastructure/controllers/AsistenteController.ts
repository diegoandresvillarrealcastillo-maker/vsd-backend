import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { AsistentePort } from '../../domain/ports/in/AsistentePort.js';
import { UsuarioActual } from '../auth/UsuarioActual.js';
import type { Identidad } from '../auth/VerificadorDeIdentidad.js';
import { ASISTENTE } from '../config/tokens.js';
import { AsistenteRespuestaDto } from './dto/AsistenteRespuestaDto.js';
import { ConsultarAsistenteDto } from './dto/ConsultarAsistenteDto.js';

/**
 * Adaptador de entrada HTTP del asistente.
 *
 * Depende del **puerto**, no del adaptador de reglas. Cuando en la Fase 2
 * exista una implementacion con modelo de lenguaje, este archivo no cambia:
 * cambia una linea del modulo que decide cual se inyecta.
 *
 * Responde 200 y no 201 porque no crea nada. Una consulta al asistente no deja
 * rastro: el texto se usa para responder y se descarta.
 */
@ApiTags('Asistente')
@ApiBearerAuth('sesion')
@Controller('api/asistente')
export class AsistenteController {
  constructor(
    @Inject(ASISTENTE)
    private readonly asistente: AsistentePort,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Preguntar al asistente',
    description:
      'VSD IA en su primera version: reglas, sin modelo de lenguaje. Si el texto contiene una expresion de riesgo, la respuesta incluye siempre lineas de atencion, y esa decision no depende de que se reconozca la pregunta. El asistente no diagnostica ni opina sobre la salud de nadie.',
  })
  @ApiBody({ type: ConsultarAsistenteDto })
  @ApiResponse({
    status: 200,
    description: 'Respuesta del asistente.',
    type: AsistenteRespuestaDto,
  })
  @ApiResponse({ status: 400, description: 'El cuerpo de la peticion no es valido.' })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones.' })
  async preguntar(
    @Body() dto: ConsultarAsistenteDto,
    @UsuarioActual() usuario: Identidad,
  ): Promise<AsistenteRespuestaDto> {
    // Quien pregunta sale del token. El asistente mira el historial reciente
    // de esta persona para personalizar el mensaje, asi que dejar que el
    // cuerpo eligiera el identificador era una forma de leer el de otra.
    const respuesta = await this.asistente.responder({ userId: usuario.id, texto: dto.texto });

    return AsistenteRespuestaDto.desde(respuesta);
  }
}
