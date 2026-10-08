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
import type { FotoDePerfilUseCase } from '../../domain/ports/in/FotoDePerfilUseCase.js';
import { CuentaActual } from '../auth/CuentaActual.js';
import { FOTO_DE_PERFIL } from '../config/tokens.js';
import { LimitePorCuenta } from '../limites/LimitePorCuenta.js';
import { LIMITE_DE_ESCRIBIR_ARCHIVOS } from '../limites/limites.js';
import { CuentaRespuestaDto } from './dto/CuentaRespuestaDto.js';

/**
 * La foto de perfil de la cuenta propia (SCRUM-120).
 *
 * **Ninguna ruta lleva un identificador.** La foto que se sube, se pide o se
 * quita es siempre la de quien firma el token: no hay parametro con el que
 * nombrar la de otra persona, asi que no hay nada que validar ni que se pueda
 * olvidar validar.
 *
 * El cuerpo de `PUT` son los **bytes de la imagen**, no JSON ni un formulario:
 * es lo que el navegador ya tiene despues de recortarla y comprimirla, y evita
 * convertirla a texto y volver. Lo lee un lector propio —ver `aplicacion.ts`—
 * que solo atiende `image/jpeg` y `image/png`.
 */
@ApiTags('Cuenta')
@ApiBearerAuth('sesion')
@Controller('api/cuenta/foto')
export class FotoDePerfilController {
  constructor(
    @Inject(FOTO_DE_PERFIL)
    private readonly fotos: FotoDePerfilUseCase,
  ) {}

  @Put()
  @LimitePorCuenta(LIMITE_DE_ESCRIBIR_ARCHIVOS)
  @ApiOperation({
    summary: 'Guardar la foto de perfil',
    description:
      'El cuerpo es la imagen misma, como `image/jpeg` o `image/png`, de menos de 50 KB y de no más de 1024 píxeles por lado. Reemplaza la que hubiera. El servidor comprueba el tipo, el peso, que el contenido sea de verdad lo que dice ser y su tamaño en píxeles: no se fía de lo que haya hecho el navegador.',
  })
  @ApiConsumes('image/jpeg', 'image/png')
  @ApiBody({ schema: { type: 'string', format: 'binary' } })
  @ApiResponse({ status: 200, description: 'La cuenta como quedó.', type: CuentaRespuestaDto })
  @ApiResponse({
    status: 400,
    description: 'FOTO_NO_ES_UNA_IMAGEN o FOTO_DEMASIADO_GRANDE (más de 1024 píxeles por lado).',
  })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  @ApiResponse({
    status: 413,
    description: 'FOTO_DEMASIADO_PESADA, o CUERPO_DEMASIADO_GRANDE si pasa de 60 KB.',
  })
  @ApiResponse({ status: 415, description: 'FOTO_TIPO_NO_PERMITIDO: solo .jpg y .png.' })
  @ApiResponse({
    status: 503,
    description: 'ALMACENAMIENTO_NO_DISPONIBLE: no se guardó nada. Reintentar.',
  })
  async guardar(
    @Body() cuerpo: unknown,
    @Headers('content-type') tipo: string | undefined,
    @CuentaActual() cuenta: User,
  ): Promise<CuentaRespuestaDto> {
    // Si el tipo no era una imagen, el lector no tocó el cuerpo y aqui llega
    // otra cosa. No importa: el tipo se mira primero y falla con su motivo.
    const contenido = Buffer.isBuffer(cuerpo) ? cuerpo : new Uint8Array(0);

    return CuentaRespuestaDto.desde(await this.fotos.guardar(cuenta.id, contenido, tipo ?? ''));
  }

  @Get()
  // Es una foto de una persona: ni el navegador ni un proxy guardan copia.
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Pedir la foto de perfil propia',
    description:
      'Devuelve la imagen. Solo la de quien firma el token. Va por la API y no por un enlace directo a Storage, para que cada petición lleve la sesión.',
  })
  @ApiProduces('image/jpeg', 'image/png')
  @ApiResponse({ status: 200, description: 'La imagen.' })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  @ApiResponse({ status: 404, description: 'FOTO_NO_ENCONTRADA: no tiene foto.' })
  @ApiResponse({ status: 503, description: 'ALMACENAMIENTO_NO_DISPONIBLE. Reintentar.' })
  async leer(
    @CuentaActual() cuenta: User,
    @Res({ passthrough: true }) respuesta: Response,
  ): Promise<StreamableFile> {
    const foto = await this.fotos.leer(cuenta.id);

    respuesta.setHeader('Content-Type', foto.tipo);

    return new StreamableFile(foto.contenido);
  }

  @Delete()
  @LimitePorCuenta(LIMITE_DE_ESCRIBIR_ARCHIVOS)
  @ApiOperation({
    summary: 'Quitar la foto de perfil',
    description:
      'Borra el archivo y deja la cuenta sin foto. Quitar la que no existe no es un error.',
  })
  @ApiResponse({ status: 200, description: 'La cuenta como quedó.', type: CuentaRespuestaDto })
  @ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' })
  @ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' })
  @ApiResponse({ status: 503, description: 'ALMACENAMIENTO_NO_DISPONIBLE. Reintentar.' })
  async quitar(@CuentaActual() cuenta: User): Promise<CuentaRespuestaDto> {
    return CuentaRespuestaDto.desde(await this.fotos.quitar(cuenta.id));
  }
}
