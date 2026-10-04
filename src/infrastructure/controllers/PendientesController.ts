import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { PendientesUseCase } from '../../domain/ports/in/PendientesUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { PENDIENTES } from '../config/tokens.js';
import {
  CrearPendienteDto,
  EditarPendienteDto,
  PendienteDto,
  SemaforoDto,
} from './dto/PendienteDto.js';

/**
 * El semaforo de pendientes de quien firma el token (SCRUM-97).
 *
 * Nadie alcanza los pendientes de otra persona: el identificador sale de la
 * cuenta y la base lo comprueba otra vez con su politica.
 */
@ApiTags('Pendientes')
@ApiBearerAuth('sesion')
@Controller('api/pendientes')
export class PendientesController {
  constructor(@Inject(PENDIENTES) private readonly semaforo: PendientesUseCase) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar el semáforo',
    description:
      'Los pendientes sin hacer y los hechos en los últimos 7 días, con un recordatorio como mucho: a los 7 días un urgente, a los 30 una prioridad y a los 14 un aplazable, salvo que esté pospuesto. El recordatorio sugiere subir de nivel; nunca lo sube solo.',
  })
  @ApiResponse({ status: 200, type: SemaforoDto })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  async consultar(@CuentaActual() cuenta: User): Promise<SemaforoDto> {
    return SemaforoDto.desde(await this.semaforo.consultar(cuenta.id.value));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Anotar un pendiente',
    description: 'Idempotente por clientOperationId: un reintento devuelve el ya guardado.',
  })
  @ApiResponse({ status: 201, type: PendienteDto })
  @ApiResponse({
    status: 400,
    description: 'Texto vacío, de más de 280 caracteres o nivel desconocido.',
  })
  async crear(@Body() dto: CrearPendienteDto, @CuentaActual() cuenta: User): Promise<PendienteDto> {
    return PendienteDto.desde(
      await this.semaforo.crear({
        userId: cuenta.id.value,
        clientOperationId: dto.clientOperationId,
        texto: dto.texto,
        nivel: dto.nivel,
      }),
    );
  }

  @Patch(':id')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Cambiar un pendiente',
    description:
      'Texto, nivel, marcarlo hecho o posponerlo. Para posponer una semana, posponerHasta es dentro de siete días; null deja de posponer.',
  })
  @ApiResponse({ status: 200, type: PendienteDto })
  @ApiResponse({ status: 400, description: 'El cuerpo no es válido o no trae nada que cambiar.' })
  @ApiResponse({
    status: 404,
    description: 'No existe o es de otra persona; las dos se responden igual.',
  })
  async editar(
    @Param('id') id: string,
    @Body() dto: EditarPendienteDto,
    @CuentaActual() cuenta: User,
  ): Promise<PendienteDto> {
    return PendienteDto.desde(
      await this.semaforo.editar({
        userId: cuenta.id.value,
        pendienteId: id,
        texto: dto.texto,
        nivel: dto.nivel,
        hecho: dto.hecho,
        posponerHasta: dto.posponerHasta,
      }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Borrar un pendiente' })
  @ApiResponse({ status: 204, description: 'Borrado.' })
  @ApiResponse({
    status: 404,
    description: 'No existe o es de otra persona; las dos se responden igual.',
  })
  async borrar(@Param('id') id: string, @CuentaActual() cuenta: User): Promise<void> {
    await this.semaforo.borrar(cuenta.id.value, id);
  }
}
