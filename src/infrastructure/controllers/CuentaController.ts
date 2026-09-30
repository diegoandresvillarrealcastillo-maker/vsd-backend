import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from '../../domain/model/User.js';
import type { RegistrarCuentaUseCase } from '../../domain/ports/in/RegistrarCuentaUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { SinCuenta } from '../auth/SinCuenta.js';
import { UsuarioActual } from '../auth/UsuarioActual.js';
import type { Identidad } from '../auth/VerificadorDeIdentidad.js';
import { REGISTRAR_CUENTA } from '../config/tokens.js';
import { CuentaRespuestaDto } from './dto/CuentaRespuestaDto.js';
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
    });

    return CuentaRespuestaDto.desde(cuenta);
  }

  @Get()
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
}
