import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { ConsultarCatalogoUseCase } from '../../domain/ports/in/ConsultarCatalogoUseCase.js';
import { CONSULTAR_CATALOGO } from '../config/tokens.js';
import { CategoriaDelCatalogoDto } from './dto/CatalogoRespuestaDto.js';

/**
 * El catalogo por HTTP.
 *
 * Es la unica lectura del sistema que no depende de quien pregunta: las
 * categorias y las actividades son las mismas para todo el mundo y no
 * contienen nada de nadie. Por eso no lleva identidad en la peticion ni la
 * llevara cuando exista la autenticacion.
 */
@ApiTags('Catalogo')
@Controller('api/catalogo')
export class CatalogoController {
  constructor(
    @Inject(CONSULTAR_CATALOGO)
    private readonly catalogo: ConsultarCatalogoUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Consultar el catalogo de actividades',
    description:
      'Las categorias con sus actividades disponibles. No incluye el puntaje maximo ni los cortes de nivel: eso sirve para interpretar un resultado, y esa interpretacion ocurre en el servidor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Categorias con sus actividades.',
    type: [CategoriaDelCatalogoDto],
  })
  async consultar(): Promise<CategoriaDelCatalogoDto[]> {
    const categorias = await this.catalogo.ejecutar();

    return categorias.map((categoria) => CategoriaDelCatalogoDto.desde(categoria));
  }
}
