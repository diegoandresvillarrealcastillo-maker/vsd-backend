import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { AvisosUseCase } from '../../domain/ports/in/AvisosUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { AVISOS } from '../config/tokens.js';
import {
  CambiarHorasDto,
  CambiarRecordatoriosDto,
  DesuscribirDto,
  EstadoDeLosAvisosDto,
  SuscribirDto,
} from './dto/NotificacionesDto.js';

/**
 * Los avisos por Web Push de quien firma el token (SCRUM-102).
 *
 * La persona elige si los quiere: el navegador le pide permiso, y sin
 * permiso la aplicacion sigue igual. Aqui solo se guardan las horas y los
 * navegadores suscritos.
 */
@ApiTags('Notificaciones')
@ApiBearerAuth('sesion')
@Controller('api/notificaciones')
export class NotificacionesController {
  constructor(@Inject(AVISOS) private readonly avisos: AvisosUseCase) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar los avisos',
    description:
      'Si el servidor puede mandar avisos, la clave pública para suscribirse y la hora de cada aviso.',
  })
  @ApiResponse({ status: 200, type: EstadoDeLosAvisosDto })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  async consultar(@CuentaActual() cuenta: User): Promise<EstadoDeLosAvisosDto> {
    return EstadoDeLosAvisosDto.desde(await this.avisos.consultar(cuenta.id.value));
  }

  @Patch('horas')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Elegir la hora de cada aviso',
    description:
      'HH:MM en la zona horaria de la persona. Lo que no viene se queda; null apaga ese aviso sin tocar el otro.',
  })
  @ApiResponse({ status: 200, type: EstadoDeLosAvisosDto })
  @ApiResponse({ status: 400, description: 'Una hora no tiene el formato HH:MM.' })
  async cambiarHoras(
    @Body() dto: CambiarHorasDto,
    @CuentaActual() cuenta: User,
  ): Promise<EstadoDeLosAvisosDto> {
    return EstadoDeLosAvisosDto.desde(
      await this.avisos.cambiarHoras({
        userId: cuenta.id.value,
        zonaHoraria: cuenta.zonaHoraria,
        horaSemaforo: dto.horaSemaforo,
        horaRacha: dto.horaRacha,
      }),
    );
  }

  @Patch('recordatorios')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Encender o apagar los recordatorios de las 8:00 y las 20:00',
    description:
      'A las 8:00 y a las 20:00 de la zona horaria de la persona, que no se pueden mover. ' +
      'El de la noche solo sale si ese día no hizo ninguna actividad. Lo que no viene se queda.',
  })
  @ApiResponse({ status: 200, type: EstadoDeLosAvisosDto })
  @ApiResponse({ status: 400, description: 'Un valor no es verdadero ni falso.' })
  async cambiarRecordatorios(
    @Body() dto: CambiarRecordatoriosDto,
    @CuentaActual() cuenta: User,
  ): Promise<EstadoDeLosAvisosDto> {
    return EstadoDeLosAvisosDto.desde(
      await this.avisos.cambiarRecordatorios({
        userId: cuenta.id.value,
        zonaHoraria: cuenta.zonaHoraria,
        manana: dto.manana,
        noche: dto.noche,
      }),
    );
  }

  @Post('suscripciones')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Recibir los avisos en este navegador',
    description:
      'Lo que entrega PushSubscription.toJSON(). Si este navegador recibía los avisos de otra persona, deja de hacerlo.',
  })
  @ApiResponse({ status: 204, description: 'Suscrito.' })
  @ApiResponse({ status: 400, description: 'La suscripción no es válida.' })
  async suscribir(@Body() dto: SuscribirDto, @CuentaActual() cuenta: User): Promise<void> {
    await this.avisos.suscribir(cuenta.id.value, {
      endpoint: dto.endpoint,
      p256dh: dto.keys.p256dh,
      auth: dto.keys.auth,
    });
  }

  @Delete('suscripciones')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Dejar de recibir los avisos en este navegador',
    description: 'No falla si ya no estaba suscrito.',
  })
  @ApiResponse({ status: 204, description: 'Listo.' })
  async desuscribir(@Body() dto: DesuscribirDto, @CuentaActual() cuenta: User): Promise<void> {
    await this.avisos.desuscribir(cuenta.id.value, dto.endpoint);
  }
}
