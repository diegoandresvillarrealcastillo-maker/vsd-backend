import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Inject,
  Put,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { User } from '../../domain/model/User.js';
import type { MascotaPropiaUseCase } from '../../domain/ports/in/MascotaPropiaUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { MASCOTA_PROPIA } from '../config/tokens.js';
import { CuentaRespuestaDto } from './dto/CuentaRespuestaDto.js';

/**
 * La mascota propia de la cuenta propia: un SVG que sube la persona (SCRUM-122).
 *
 * Como en la foto, **ninguna ruta lleva un identificador**: es siempre la de
 * quien firma el token. El cuerpo de `PUT` es el SVG mismo, con el tipo
 * `image/svg+xml`, que lee un lector propio —ver `aplicacion.ts`—.
 *
 * Lo que se guarda y lo que se devuelve **no es lo que subio la persona**: es
 * un SVG nuevo, reescrito desde una lista blanca (ADR 0017). Y aun asi, al
 * devolverlo se le pone una politica que lo deja inerte si alguien lo abre
 * suelto: sin scripts, sin cargar nada.
 */
@ApiTags('Cuenta')
@ApiBearerAuth('sesion')
@Controller('api/cuenta/mascota-propia')
export class MascotaPropiaController {
  constructor(
    @Inject(MASCOTA_PROPIA)
    private readonly mascotas: MascotaPropiaUseCase,
  ) {}

  @Put()
  @ApiOperation({
    summary: 'Guardar la mascota propia',
    description:
      'El cuerpo es el SVG mismo, como `image/svg+xml`, de menos de 100 KB. Reemplaza el que hubiera. El servidor **no guarda lo que llega: lo reescribe** desde una lista blanca de elementos y atributos. Rechaza lo peligroso (scripts, manejadores de eventos, enlaces y referencias fuera del archivo, animaciones, DOCTYPE y entidades) y lo que no admite todavía (textos, imágenes, filtros, estilos). No la elige como mascota: eso se hace con las preferencias, poniendo la forma `propia`.',
  })
  @ApiConsumes('image/svg+xml')
  @ApiBody({ schema: { type: 'string', format: 'binary' } })
  @ApiResponse({ status: 200, description: 'La cuenta como quedó.', type: CuentaRespuestaDto })
  @ApiResponse({
    status: 400,
    description:
      'MASCOTA_SVG_NO_ES_UN_SVG, MASCOTA_SVG_PELIGROSO, MASCOTA_SVG_NO_ADMITIDO o MASCOTA_SVG_DEMASIADO_COMPLEJO.',
  })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  @ApiResponse({
    status: 413,
    description: 'MASCOTA_SVG_DEMASIADO_PESADO, o CUERPO_DEMASIADO_GRANDE si pasa de 120 KB.',
  })
  @ApiResponse({ status: 415, description: 'MASCOTA_SVG_TIPO_NO_PERMITIDO: solo .svg.' })
  @ApiResponse({
    status: 503,
    description: 'ALMACENAMIENTO_NO_DISPONIBLE: no se guardó nada. Reintentar.',
  })
  async guardar(
    @Body() cuerpo: unknown,
    @Headers('content-type') tipo: string | undefined,
    @CuentaActual() cuenta: User,
  ): Promise<CuentaRespuestaDto> {
    // Si el tipo no era un SVG, el lector no toco el cuerpo y aqui llega otra
    // cosa. No importa: el tipo se mira primero y falla con su motivo.
    const contenido = Buffer.isBuffer(cuerpo) ? cuerpo : new Uint8Array(0);

    return CuentaRespuestaDto.desde(await this.mascotas.guardar(cuenta.id, contenido, tipo ?? ''));
  }

  @Get()
  // Es de una persona: ni el navegador ni un proxy guardan copia.
  @Header('Cache-Control', 'no-store')
  // Si alguien abriera esta respuesta suelta, no se ejecuta ni se carga nada.
  @Header('Content-Security-Policy', "default-src 'none'; style-src 'none'; sandbox")
  @Header('Content-Disposition', 'attachment; filename="mascota.svg"')
  @ApiOperation({
    summary: 'Pedir la mascota propia',
    description:
      'Devuelve el SVG ya saneado. Solo el de quien firma el token. La aplicación lo muestra siempre como `<img>`, nunca incrustado en la página.',
  })
  @ApiProduces('image/svg+xml')
  @ApiResponse({ status: 200, description: 'El SVG.' })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  @ApiResponse({ status: 404, description: 'MASCOTA_PROPIA_NO_ENCONTRADA: no tiene.' })
  @ApiResponse({ status: 503, description: 'ALMACENAMIENTO_NO_DISPONIBLE. Reintentar.' })
  async leer(
    @CuentaActual() cuenta: User,
    @Res({ passthrough: true }) respuesta: Response,
  ): Promise<StreamableFile> {
    const mascota = await this.mascotas.leer(cuenta.id);

    respuesta.setHeader('Content-Type', mascota.tipo);

    return new StreamableFile(mascota.contenido);
  }

  @Delete()
  @ApiOperation({
    summary: 'Quitar la mascota propia',
    description:
      'Borra el archivo. Si era la mascota elegida, la persona vuelve al personaje de siempre, con el nombre que le había puesto. Quitar la que no existe no es un error.',
  })
  @ApiResponse({ status: 200, description: 'La cuenta como quedó.', type: CuentaRespuestaDto })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  @ApiResponse({ status: 503, description: 'ALMACENAMIENTO_NO_DISPONIBLE. Reintentar.' })
  async quitar(@CuentaActual() cuenta: User): Promise<CuentaRespuestaDto> {
    return CuentaRespuestaDto.desde(await this.mascotas.quitar(cuenta.id));
  }
}
