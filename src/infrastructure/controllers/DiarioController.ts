import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { ConsultarDiarioUseCase } from '../../domain/ports/in/ConsultarDiarioUseCase.js';
import type { EditarAnotacionUseCase } from '../../domain/ports/in/EditarAnotacionUseCase.js';
import type { EscribirEnElDiarioUseCase } from '../../domain/ports/in/EscribirEnElDiarioUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { CONSULTAR_DIARIO, EDITAR_ANOTACION, ESCRIBIR_EN_EL_DIARIO } from '../config/tokens.js';
import { ConsultarDiarioDto } from './dto/ConsultarDiarioDto.js';
import { EditarAnotacionDto } from './dto/EditarAnotacionDto.js';
import { AnotacionGuardadaDto, EntradaDelDiarioDto } from './dto/EntradaDelDiarioDto.js';
import { EscribirEnElDiarioDto } from './dto/EscribirEnElDiarioDto.js';

/**
 * El diario de la persona que firma el token (SCRUM-95).
 *
 * Nadie lee ni escribe el diario de otra persona: el identificador sale de la
 * cuenta y la base lo comprueba otra vez con sus politicas.
 *
 * Nada de lo que se escribe aqui sale por el registro: el interceptor anota
 * metodo, ruta, estado y duracion, y nunca el cuerpo.
 */
@ApiTags('Diario')
@ApiBearerAuth('sesion')
@Controller('api/diario')
export class DiarioController {
  constructor(
    @Inject(CONSULTAR_DIARIO) private readonly consultarDiario: ConsultarDiarioUseCase,
    @Inject(ESCRIBIR_EN_EL_DIARIO) private readonly escribirEnElDiario: EscribirEnElDiarioUseCase,
    @Inject(EDITAR_ANOTACION) private readonly editarAnotacion: EditarAnotacionUseCase,
  ) {}

  @Get()
  // Es lo mas personal del sistema: ninguna cache intermedia lo guarda.
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar las anotaciones de un rango de días',
    description:
      'Ordenadas por día y, dentro de cada día, por hora. Sin parámetros, las de hoy en la zona horaria de la persona. Como mucho 366 días por consulta.',
  })
  @ApiResponse({ status: 200, type: [EntradaDelDiarioDto] })
  @ApiResponse({ status: 400, description: 'Un día mal escrito o un rango no válido.' })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  async consultar(
    @Query() consulta: ConsultarDiarioDto,
    @CuentaActual() cuenta: User,
  ): Promise<EntradaDelDiarioDto[]> {
    const entradas = await this.consultarDiario.execute({
      userId: cuenta.id.value,
      zonaHoraria: cuenta.zonaHoraria,
      desde: consulta.desde,
      hasta: consulta.hasta,
    });

    return entradas.map((entrada) => EntradaDelDiarioDto.desde(entrada));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Escribir una anotación',
    description:
      'Idempotente por clientOperationId: un reintento devuelve la anotación ya guardada. Se puede escribir en un día pasado; la anotación conserva la hora real en que se escribió, que es la del dispositivo si la manda en escritaEn (escrita sin conexión y recibida después). Si lo escrito trae una señal de riesgo, la respuesta lo indica y trae las líneas de atención; no se guarda ninguna marca.',
  })
  @ApiResponse({ status: 201, type: AnotacionGuardadaDto })
  @ApiResponse({
    status: 400,
    description: 'El cuerpo no es válido, la anotación está vacía o el día es futuro.',
  })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  @ApiResponse({ status: 413, description: 'El cuerpo supera 1 MB.' })
  async escribir(
    @Body() dto: EscribirEnElDiarioDto,
    @CuentaActual() cuenta: User,
  ): Promise<AnotacionGuardadaDto> {
    const guardada = await this.escribirEnElDiario.execute({
      userId: cuenta.id.value,
      zonaHoraria: cuenta.zonaHoraria,
      // El permiso es de la cuenta y lo cambia solo ella, desde su perfil.
      conRecomendaciones: cuenta.diarioConRecomendaciones,
      clientOperationId: dto.clientOperationId,
      dia: dto.dia,
      titulo: dto.titulo,
      contenido: dto.contenido,
      adjuntos: dto.adjuntos,
      escritaEn: dto.escritaEn,
    });

    return AnotacionGuardadaDto.deLaGuardada(guardada);
  }

  @Patch(':id')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Corregir una anotación durante su primera hora',
    description:
      'Lo que no viene se queda como estaba. Pasada una hora desde que se escribió responde 409 EDICION_FUERA_DE_PLAZO, y si otro dispositivo la cambió entretanto, 409 VERSION_DESACTUALIZADA. En los dos casos no se toca nada: el cliente guarda lo suyo como una anotación nueva (ADR 0009). El plazo se mide contra la hora de la corrección que manda el dispositivo en editadaEn (acotada: nunca en el futuro ni de hace más de 30 días) y, sin ella, contra la de la petición. Los límites los impone también la base de datos, no solo la API.',
  })
  @ApiResponse({ status: 200, type: AnotacionGuardadaDto })
  @ApiResponse({ status: 400, description: 'El cuerpo no es válido o no trae nada que cambiar.' })
  @ApiResponse({
    status: 404,
    description: 'La anotación no existe o es de otra persona; las dos se responden igual.',
  })
  @ApiResponse({
    status: 409,
    description: 'EDICION_FUERA_DE_PLAZO o VERSION_DESACTUALIZADA. Guardar como anotación nueva.',
  })
  async editar(
    @Param('id') id: string,
    @Body() dto: EditarAnotacionDto,
    @CuentaActual() cuenta: User,
  ): Promise<AnotacionGuardadaDto> {
    const guardada = await this.editarAnotacion.execute({
      userId: cuenta.id.value,
      zonaHoraria: cuenta.zonaHoraria,
      conRecomendaciones: cuenta.diarioConRecomendaciones,
      entradaId: id,
      version: dto.version,
      titulo: dto.titulo,
      contenido: dto.contenido,
      adjuntos: dto.adjuntos,
      editadaEn: dto.editadaEn,
    });

    return AnotacionGuardadaDto.deLaGuardada(guardada);
  }
}
