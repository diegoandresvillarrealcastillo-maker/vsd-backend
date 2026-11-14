import { Controller, Get, Inject } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { ConsultarLasReglasLocalesUseCase } from '../../domain/ports/in/ConsultarLasReglasLocalesUseCase.js';
import { Publico } from '../auth/Publico.js';
import { CONSULTAR_REGLAS_LOCALES } from '../config/tokens.js';
import {
  PaisConLineasDto,
  ReglasLocalesDelAsistenteDto,
} from './dto/ReglasLocalesDelAsistenteDto.js';

/**
 * Las reglas de VSD IA para responder lo basico sin conexion (SCRUM-141).
 *
 * Es publica por la misma razon que el catalogo y el aviso: lo que devuelve es
 * lo mismo para todo el mundo y no sale de la cuenta de nadie. Y hay una razon
 * mas, propia: son las lineas de ayuda. **No pueden depender de que haya una
 * sesion** para poder leerse, porque se piden justo cuando algo falla.
 *
 * Lleva `ETag` (lo pone Express) para que la aplicacion pregunte con
 * `If-None-Match` y, si nada cambio, no baje nada: lo guarda en el dispositivo y
 * lo usa sin red.
 *
 * Esta ruta **solo baja**. Lo que una persona escribe sin conexion no se envia
 * despues ni pasa por aqui.
 */
@ApiTags('Asistente')
// El pais va dentro de un objeto con claves variables (`paises`), asi que Swagger no lo
// descubre solo: se declara para que su esquema exista en el contrato.
@ApiExtraModels(PaisConLineasDto)
@Publico()
@Controller('api/asistente/reglas-locales')
export class ReglasLocalesDelAsistenteController {
  constructor(
    @Inject(CONSULTAR_REGLAS_LOCALES)
    private readonly reglas: ConsultarLasReglasLocalesUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Consultar las reglas que responden lo basico sin conexion',
    description:
      'Los mismos datos que usa el asistente del servidor, para aplicarlos en el dispositivo: la deteccion de riesgo, la charla de todos los dias (saludo, agradecimiento y despedida), la pregunta por donde buscar ayuda y las lineas de atencion de cada pais. Es publica y lleva ETag: una lectura condicional con If-None-Match responde 304 si nada cambio. Todo lo demas que pregunte una persona exige conexion.',
  })
  @ApiResponse({
    status: 200,
    description: 'Las reglas y las lineas de ayuda de cada pais.',
    type: ReglasLocalesDelAsistenteDto,
  })
  @ApiResponse({ status: 304, description: 'Nada cambio desde el ETag que se envio.' })
  async consultar(): Promise<ReglasLocalesDelAsistenteDto> {
    return ReglasLocalesDelAsistenteDto.desde(await this.reglas.ejecutar());
  }
}
