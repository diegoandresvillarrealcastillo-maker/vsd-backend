import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivityResultService } from '../../application/services/ActivityResultService.js';
import { RegistrarResultadoDto } from './dto/RegistrarResultadoDto.js';
import { ResultadoRespuestaDto } from './dto/ResultadoRespuestaDto.js';

/**
 * Adaptador de entrada HTTP.
 *
 * Su unico trabajo es traducir entre HTTP y el lenguaje de la aplicacion.
 * No decide nada: si este archivo empieza a contener condiciones sobre
 * puntajes, usuarios o fechas, esas decisiones pertenecen a un caso de uso.
 *
 * La ruta nombra un recurso en plural y no una accion, siguiendo la guia de
 * APIs REST del curso: la accion la indica el verbo HTTP.
 */
@ApiTags('Resultados')
@Controller('api/resultados')
export class ActivityResultController {
  constructor(
    @Inject(ActivityResultService)
    private readonly resultados: ActivityResultService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar el resultado de una actividad',
    description:
      'La operacion es idempotente. Reenviar la misma peticion con el mismo clientOperationId devuelve el resultado ya registrado en lugar de crear otro, de modo que un reintento tras una caida de red es seguro.',
  })
  @ApiBody({ type: RegistrarResultadoDto })
  @ApiResponse({ status: 201, description: 'Resultado registrado.', type: ResultadoRespuestaDto })
  @ApiResponse({
    status: 400,
    description: 'El cuerpo de la peticion no es valido o incumple una regla del dominio.',
  })
  @ApiResponse({
    status: 404,
    description:
      'La operacion solicitada no esta disponible. Se responde asi tanto si no existe como si pertenece a otra persona, para no revelar cual de las dos cosas ocurre.',
  })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones.' })
  async registrar(@Body() dto: RegistrarResultadoDto): Promise<ResultadoRespuestaDto> {
    const resultado = await this.resultados.registrar({
      userId: dto.userId,
      activityId: dto.activityId,
      clientOperationId: dto.clientOperationId,
      score: dto.score,
      maxScore: dto.maxScore,
      completedAt: dto.completedAt,
    });

    return ResultadoRespuestaDto.desde(resultado);
  }
}
