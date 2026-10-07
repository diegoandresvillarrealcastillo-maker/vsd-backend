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
      'Los pendientes sin hacer y los hechos en los últimos 7 días, con un recordatorio como mucho. Sin fecha límite, cuando se le acaba el plazo a su color: a los 7 días un urgente, a los 21 una prioridad y a los 30 un aplazable (con tono suave). Con fecha límite, desde ese día, que se cuenta en la zona horaria de la persona. Un pendiente pospuesto no recuerda nada. El recordatorio sugiere subir de nivel; nunca lo sube solo.',
  })
  @ApiResponse({ status: 200, type: SemaforoDto })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  async consultar(@CuentaActual() cuenta: User): Promise<SemaforoDto> {
    return SemaforoDto.desde(await this.semaforo.consultar(cuenta.id.value, cuenta.zonaHoraria));
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
    description:
      'Texto vacío, de más de 280 caracteres, nivel desconocido o fecha límite que no es un día real.',
  })
  async crear(@Body() dto: CrearPendienteDto, @CuentaActual() cuenta: User): Promise<PendienteDto> {
    return PendienteDto.desde(
      await this.semaforo.crear({
        userId: cuenta.id.value,
        clientOperationId: dto.clientOperationId,
        texto: dto.texto,
        nivel: dto.nivel,
        fechaLimite: dto.fechaLimite,
      }),
    );
  }

  @Patch(':id')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Cambiar un pendiente',
    description:
      'Texto, nivel, fecha límite, marcarlo hecho o posponerlo. Para posponer una semana, posponerHasta es dentro de siete días; null deja de posponer. fechaLimite es un día AAAA-MM-DD; null la quita. Con version, detecta que otro dispositivo lo cambió: si ya no es la vigente, responde 409 sin tocar nada, salvo que la edición solo lo marque como hecho (se aplica) o que el pendiente ya esté como se pide (se devuelve tal cual, así un reintento tras una respuesta perdida no choca consigo mismo).',
  })
  @ApiResponse({ status: 200, type: PendienteDto })
  @ApiResponse({ status: 400, description: 'El cuerpo no es válido o no trae nada que cambiar.' })
  @ApiResponse({
    status: 409,
    description:
      'VERSION_DESACTUALIZADA: otro dispositivo lo cambió. No se tocó nada; consulta GET /api/pendientes para ver cómo quedó.',
  })
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
        fechaLimite: dto.fechaLimite,
        version: dto.version,
      }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Borrar un pendiente',
    description:
      'Es idempotente: borrar uno que ya no esta responde igual que borrarlo la primera vez. Asi un reintento tras una respuesta perdida no atasca la sincronizacion sin conexion. Un pendiente de otra persona responde igual y no se toca.',
  })
  @ApiResponse({ status: 204, description: 'Ya no esta: se borro, o no existia, o no era suyo.' })
  async borrar(@Param('id') id: string, @CuentaActual() cuenta: User): Promise<void> {
    await this.semaforo.borrar(cuenta.id.value, id);
  }
}
