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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { ActualizarPreferenciasUseCase } from '../../domain/ports/in/ActualizarPreferenciasUseCase.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { ExportarDatosUseCase } from '../../domain/ports/in/ExportarDatosUseCase.js';
import type { RegistrarCuentaUseCase } from '../../domain/ports/in/RegistrarCuentaUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { SinCuenta } from '../auth/SinCuenta.js';
import { UsuarioActual } from '../auth/UsuarioActual.js';
import type { Identidad } from '../auth/VerificadorDeIdentidad.js';
import {
  ACTUALIZAR_PREFERENCIAS,
  BORRAR_CUENTA,
  EXPORTAR_DATOS,
  REGISTRAR_CUENTA,
} from '../config/tokens.js';
import { ActualizarPreferenciasDto } from './dto/ActualizarPreferenciasDto.js';
import { BorrarCuentaDto } from './dto/BorrarCuentaDto.js';
import { CuentaRespuestaDto } from './dto/CuentaRespuestaDto.js';
import { ExportacionDto } from './dto/ExportacionDto.js';
import { RegistrarCuentaDto } from './dto/RegistrarCuentaDto.js';

/**
 * El alta de cuenta y la consulta de la propia.
 *
 * Es el puente entre la identidad del proveedor y la cuenta de VSD Health.
 * Supabase autentica, pero no sabe nada del dominio: no conoce el rol ni el
 * consentimiento.
 */
@ApiTags('Cuenta')
@ApiBearerAuth('sesion')
@Controller('api/cuenta')
export class CuentaController {
  constructor(
    @Inject(REGISTRAR_CUENTA)
    private readonly cuentas: RegistrarCuentaUseCase,
    @Inject(ACTUALIZAR_PREFERENCIAS)
    private readonly preferencias: ActualizarPreferenciasUseCase,
    @Inject(EXPORTAR_DATOS)
    private readonly exportacion: ExportarDatosUseCase,
    @Inject(BORRAR_CUENTA)
    private readonly borrado: BorrarCuentaUseCase,
  ) {}

  /**
   * Lleva `@SinCuenta()` por definicion: es la ruta que crea la cuenta que
   * todas las demas exigen. Sin esa marca, darse de alta requeriria estar ya
   * dado de alta.
   */
  @Post()
  @SinCuenta()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dar de alta la cuenta, o recuperar la que ya existe',
    description:
      'Se invoca despues de iniciar sesion. Si la persona ya tenia cuenta se devuelve tal cual, sin volver a pedir el consentimiento ni sobrescribir el que hay: la fecha y la version guardadas son la prueba de lo que acepto ese dia. Es idempotente, asi que el frontend puede llamarlo en cada inicio de sesion.',
  })
  @ApiBody({ type: RegistrarCuentaDto })
  @ApiResponse({
    status: 200,
    description: 'La cuenta, nueva o existente.',
    type: CuentaRespuestaDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'El cuerpo no es valido, o falta el consentimiento. Sin el no hay base legal para tratar informacion relacionada con salud (Ley 1581 de 2012).',
  })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({
    status: 409,
    description: 'Ese correo ya pertenece a otra cuenta, creada con otro metodo de acceso.',
  })
  async registrar(
    @Body() dto: RegistrarCuentaDto,
    @UsuarioActual() identidad: Identidad,
  ): Promise<CuentaRespuestaDto> {
    const cuenta = await this.cuentas.execute({
      // Los dos salen del token verificado, no del cuerpo.
      idProveedorAuth: identidad.id,
      correo: identidad.correo ?? '',
      versionPolitica: dto.versionPolitica,
      ...(dto.nombre === undefined ? {} : { nombre: dto.nombre }),
      ...(dto.zonaHoraria === undefined ? {} : { zonaHoraria: dto.zonaHoraria }),
    });

    return CuentaRespuestaDto.desde(cuenta);
  }

  @Get()
  // Nombre, correo y preferencias: no deben quedar en la cache del navegador,
  // que no se borra al cerrar sesion (SCRUM-133).
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Consultar la cuenta propia',
    description:
      'Devuelve unicamente la cuenta de quien pregunta. No existe forma de consultar la de otra persona: el identificador sale del token y las politicas de la base filtran por el.',
  })
  @ApiResponse({ status: 200, description: 'La cuenta propia.', type: CuentaRespuestaDto })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  consultar(@CuentaActual() cuenta: User): CuentaRespuestaDto {
    return CuentaRespuestaDto.desde(cuenta);
  }

  @Patch('preferencias')
  @ApiOperation({
    summary: 'Cambiar el nombre, los modulos activos y la mascota',
    description:
      'Opera solo sobre la cuenta de quien firma el token. Lo que no venga en el cuerpo se queda como estaba. El correo y el rol no se pueden cambiar por aqui: mandarlos responde 400.',
  })
  @ApiBody({ type: ActualizarPreferenciasDto })
  @ApiResponse({ status: 200, description: 'La cuenta como quedo.', type: CuentaRespuestaDto })
  @ApiResponse({
    status: 400,
    description:
      'Un modulo que no existe (MODULO_DESCONOCIDO), una lista sin modulos (SIN_MODULOS_ACTIVOS), una mascota mal formada (MASCOTA_INVALIDA) o un campo que no se puede cambiar.',
  })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async actualizarPreferencias(
    @Body() dto: ActualizarPreferenciasDto,
    @CuentaActual() cuenta: User,
  ): Promise<CuentaRespuestaDto> {
    const actualizada = await this.preferencias.execute(cuenta.id, {
      ...(dto.nombre === undefined ? {} : { nombre: dto.nombre }),
      ...(dto.modulosActivos === undefined ? {} : { modulosActivos: dto.modulosActivos }),
      ...(dto.mascota === undefined ? {} : { mascota: dto.mascota }),
      ...(dto.diarioConRecomendaciones === undefined
        ? {}
        : { diarioConRecomendaciones: dto.diarioConRecomendaciones }),
    });

    return CuentaRespuestaDto.desde(actualizada);
  }

  @Get('exportacion')
  // Son datos personales: ni el navegador ni un proxy deben guardar copia.
  @Header('Cache-Control', 'no-store')
  @Header('Content-Disposition', 'attachment; filename="vsd-health-mis-datos.json"')
  @ApiOperation({
    summary: 'Exportar los datos propios',
    description:
      'Derecho de acceso (Ley 1581 de 2012). Devuelve todo lo que VSD Health guarda de quien firma el token: la cuenta, los resultados y las entradas del diario. Nada de nadie mas.',
  })
  @ApiResponse({ status: 200, description: 'Los datos, en JSON.', type: ExportacionDto })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero todavia no hay cuenta.' })
  async exportar(@CuentaActual() cuenta: User): Promise<ExportacionDto> {
    return ExportacionDto.desde(await this.exportacion.execute(cuenta.id));
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Borrar la cuenta propia con todo lo suyo',
    description:
      'Derecho de supresion (Ley 1581 de 2012). Borra la cuenta, sus resultados, sus entradas de diario y su identidad en Supabase Auth. Es todo o nada: si una parte falla, no se borra nada. No tiene vuelta atras, y por eso exige la frase de confirmacion.',
  })
  @ApiBody({ type: BorrarCuentaDto })
  @ApiResponse({ status: 204, description: 'La cuenta ya no existe.' })
  @ApiResponse({ status: 400, description: 'Falta la frase de confirmacion o no es exacta.' })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({ status: 403, description: 'Hay sesion pero no hay cuenta que borrar.' })
  @ApiResponse({
    status: 503,
    description:
      'BORRADO_NO_COMPLETADO: el proveedor de autenticacion no respondio y no se borro nada. Reintentar.',
  })
  async borrar(
    @Body() _confirmacion: BorrarCuentaDto,
    @CuentaActual() cuenta: User,
  ): Promise<void> {
    await this.borrado.execute(cuenta.id);
  }
}
