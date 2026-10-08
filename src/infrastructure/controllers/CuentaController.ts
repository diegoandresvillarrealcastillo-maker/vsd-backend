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
import type { ContextoDeLaPeticion } from '../../domain/model/EventoDeSeguridad.js';
import type { User } from '../../domain/model/User.js';
import type { ActualizarPreferenciasUseCase } from '../../domain/ports/in/ActualizarPreferenciasUseCase.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { ExportarDatosUseCase } from '../../domain/ports/in/ExportarDatosUseCase.js';
import type { RegistrarCuentaUseCase } from '../../domain/ports/in/RegistrarCuentaUseCase.js';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { PermiteRegistroIncompleto } from '../auth/PermiteRegistroIncompleto.js';
import { SinCuenta } from '../auth/SinCuenta.js';
import { UsuarioActual } from '../auth/UsuarioActual.js';
import type { Identidad } from '../auth/VerificadorDeIdentidad.js';
import {
  ACTUALIZAR_PREFERENCIAS,
  BORRAR_CUENTA,
  EXPORTAR_DATOS,
  REGISTRAR_CUENTA,
  REGISTRO_DE_SEGURIDAD,
} from '../config/tokens.js';
import { LimitePorCuenta } from '../limites/LimitePorCuenta.js';
import { LIMITE_DE_EXPORTAR } from '../limites/limites.js';
import { ContextoDeSeguridad } from '../seguridad/contextoDeLaPeticion.js';
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
    @Inject(REGISTRO_DE_SEGURIDAD)
    private readonly seguridad: RegistroDeSeguridadPort,
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
    summary: 'Dar de alta la cuenta, completar el registro, o recuperar la que ya existe',
    description:
      'Se invoca despues de iniciar sesion. Crear una cuenta exige la fecha de nacimiento, ser mayor de 18 anos y las dos casillas (aviso de privacidad y terminos) con las versiones vigentes; la edad la calcula el servidor. Un menor no queda registrado: su identidad se borra y la respuesta es 403 MENOR_DE_EDAD. Si la persona ya tenia cuenta se devuelve tal cual, sin sobrescribir lo que acepto: la fecha y la version guardadas son la prueba de lo que acepto ese dia. Las cuentas anteriores a que se pidiera la fecha y las casillas vienen con `registroCompleto: false`; mandar aqui el registro lo completa. Es idempotente, asi que el frontend puede llamarlo en cada inicio de sesion.',
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
      'El cuerpo no es valido, falta o no sirve la fecha de nacimiento (FECHA_DE_NACIMIENTO_INVALIDA), o falta el consentimiento (CONSENTIMIENTO_NO_REGISTRADO). Sin el no hay base legal para tratar informacion relacionada con salud (Ley 1581 de 2012).',
  })
  @ApiResponse({ status: 401, description: 'Falta la sesion o el token no es valido.' })
  @ApiResponse({
    status: 403,
    description:
      'MENOR_DE_EDAD: la plataforma es solo para mayores de 18 anos. No se guarda nada y la identidad se borra.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ese correo ya pertenece a otra cuenta, creada con otro metodo de acceso, o la version del aviso o de los terminos ya no es la vigente.',
  })
  async registrar(
    @Body() dto: RegistrarCuentaDto,
    @UsuarioActual() identidad: Identidad,
  ): Promise<CuentaRespuestaDto> {
    const cuenta = await this.cuentas.execute({
      // Los dos salen del token verificado, no del cuerpo.
      idProveedorAuth: identidad.id,
      correo: identidad.correo ?? '',
      ...(dto.fechaNacimiento === undefined ? {} : { fechaNacimiento: dto.fechaNacimiento }),
      ...(dto.versionPolitica === undefined ? {} : { versionPolitica: dto.versionPolitica }),
      ...(dto.versionTerminos === undefined ? {} : { versionTerminos: dto.versionTerminos }),
      ...(dto.aceptaAviso === undefined ? {} : { aceptaAviso: dto.aceptaAviso }),
      ...(dto.aceptaTerminos === undefined ? {} : { aceptaTerminos: dto.aceptaTerminos }),
      ...(dto.nombre === undefined ? {} : { nombre: dto.nombre }),
      ...(dto.zonaHoraria === undefined ? {} : { zonaHoraria: dto.zonaHoraria }),
    });

    return CuentaRespuestaDto.desde(cuenta);
  }

  @Get()
  // Es como el frontend se entera de que le falta completar el registro.
  @PermiteRegistroIncompleto()
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
    @ContextoDeSeguridad() origen: ContextoDeLaPeticion,
  ): Promise<CuentaRespuestaDto> {
    const actualizada = await this.preferencias.execute(cuenta.id, {
      ...(dto.nombre === undefined ? {} : { nombre: dto.nombre }),
      ...(dto.modulosActivos === undefined ? {} : { modulosActivos: dto.modulosActivos }),
      ...(dto.mascota === undefined ? {} : { mascota: dto.mascota }),
      ...(dto.diarioConRecomendaciones === undefined
        ? {}
        : { diarioConRecomendaciones: dto.diarioConRecomendaciones }),
    });

    // Dejar que el diario reciba recomendaciones es dar permiso sobre lo mas
    // intimo que guarda la aplicacion: queda anotado cuando cambia (SCRUM-163).
    if (actualizada.diarioConRecomendaciones !== cuenta.diarioConRecomendaciones) {
      this.seguridad.registrar({
        tipo: 'PERMISO_DEL_DIARIO_CAMBIADO',
        idUsuario: cuenta.id.value,
        activado: actualizada.diarioConRecomendaciones,
        ...origen,
      });
    }

    return CuentaRespuestaDto.desde(actualizada);
  }

  @Get('exportacion')
  // Un derecho: no depende de haber completado el registro.
  @PermiteRegistroIncompleto()
  @LimitePorCuenta(LIMITE_DE_EXPORTAR)
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
  async exportar(
    @CuentaActual() cuenta: User,
    @ContextoDeSeguridad() origen: ContextoDeLaPeticion,
  ): Promise<ExportacionDto> {
    const datos = await this.exportacion.execute(cuenta.id);

    // Todo lo de una persona sale en un solo archivo: si alguien lo hace con un
    // token robado, este es el rastro (SCRUM-163).
    this.seguridad.registrar({ tipo: 'DATOS_EXPORTADOS', idUsuario: cuenta.id.value, ...origen });

    return ExportacionDto.desde(datos);
  }

  @Delete()
  // Un derecho: quien no quiere completar el registro tiene que poder irse.
  @PermiteRegistroIncompleto()
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
    @ContextoDeSeguridad() origen: ContextoDeLaPeticion,
  ): Promise<void> {
    await this.borrado.execute(cuenta.id);

    // Solo si el borrado termino: el identificador interno ya no apunta a nada,
    // pero es lo que permite ligar este hecho con lo que se pidio antes.
    this.seguridad.registrar({ tipo: 'CUENTA_BORRADA', idUsuario: cuenta.id.value, ...origen });
  }
}
