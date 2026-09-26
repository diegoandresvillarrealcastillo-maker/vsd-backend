import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Metadata } from '../../domain/model/ActivityResult.js';
import { ActivityResultService } from '../../application/services/ActivityResultService.js';
import type { User } from '../../domain/model/User.js';
import { CuentaActual } from '../auth/CuentaActual.js';
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
@ApiBearerAuth('sesion')
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
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({
    status: 403,
    description:
      'Hay sesion, pero todavia no hay cuenta. Hay que pasar antes por POST /api/cuenta.',
  })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones.' })
  async registrar(
    @Body() dto: RegistrarResultadoDto,
    @CuentaActual() cuenta: User,
  ): Promise<ResultadoRespuestaDto> {
    const resultado = await this.resultados.registrar({
      // Del token, no del cuerpo: es la diferencia entre "de quien dice el
      // cliente que es este resultado" y "de quien es".
      //
      // Y de la **cuenta**, no de la identidad del proveedor. Son dos
      // identificadores distintos, y `resultado.id_usuario` es clave foranea
      // contra el nuestro. Usar el de Supabase aqui hace que PostgreSQL
      // rechace la fila en cuanto existe una persona real, que es un fallo que
      // ninguna prueba unitaria puede ver.
      userId: cuenta.id.value,
      activityId: dto.activityId,
      clientOperationId: dto.clientOperationId,
      score: dto.score,
      completedAt: dto.completedAt,
      metadata: dto.metadata as Metadata | undefined,
    });

    return ResultadoRespuestaDto.desde(resultado);
  }
}
