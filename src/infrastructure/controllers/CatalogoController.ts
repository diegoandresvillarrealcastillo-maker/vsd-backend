import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { ConsultarCatalogoUseCase } from '../../domain/ports/in/ConsultarCatalogoUseCase.js';
import { Publico } from '../auth/Publico.js';
import { CONSULTAR_CATALOGO } from '../config/tokens.js';
import { PRISMA } from '../config/tokens.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { CategoriaDelCatalogoDto } from './dto/CatalogoRespuestaDto.js';

/**
 * El catalogo por HTTP.
 *
 * Es la unica lectura del sistema que no depende de quien pregunta: las
 * categorias y las actividades son las mismas para todo el mundo y no
 * contienen nada de nadie. Por eso no lleva identidad en la peticion ni la
 * llevara cuando exista la autenticacion.
 *
 * Eso se cumplio: con el guardia ya en pie, esta es una de las dos rutas que
 * se declaran abiertas. Lo que devuelve es el mismo texto para todo el mundo
 * y no sale de la cuenta de nadie, asi que exigir sesion para leerlo no
 * protegeria nada e impediria que la portada mostrara lo que ofrece la
 * aplicacion antes de registrarse.
 */
@ApiTags('Catalogo')
@Publico()
@Controller('api/catalogo')
export class CatalogoController {
  constructor(
    @Inject(CONSULTAR_CATALOGO)
    private readonly catalogo: ConsultarCatalogoUseCase,
    @Inject(PRISMA)
    private readonly prisma: PrismaService | null,
  ) {}

  @Get('sesiones/:modulo')
  @ApiOperation({ summary: 'Sesiones publicadas de un modulo, para elegir libremente' })
  async sesionesPublicadas(@Param('modulo') modulo: string) {
    if (!['bienestar', 'cognicion', 'emociones'].includes(modulo) || this.prisma === null) {
      return [];
    }

    const sesiones = await this.prisma.sesionDeActividad.findMany({
      where: { publicado: true, actividad: { estado: true, categoria: { modulo } } },
      select: {
        id: true,
        idActividad: true,
        titulo: true,
        nivel: true,
        actividad: { select: { nombre: true } },
      },
      orderBy: [
        { actividad: { nombre: 'asc' } },
        { nivel: 'asc' },
        { titulo: 'asc' },
        { id: 'asc' },
      ],
    });

    return sesiones.map((sesion) => ({
      id: sesion.id,
      idActividad: sesion.idActividad,
      titulo: sesion.titulo,
      nivel: sesion.nivel,
      actividad: sesion.actividad.nombre,
    }));
  }

  @Get('sesion/:id')
  @ApiOperation({ summary: 'Contenido de una sesion publicada seleccionada' })
  async sesionPublicada(@Param('id') id: string) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
      this.prisma === null
    ) {
      return null;
    }

    const sesion = await this.prisma.sesionDeActividad.findFirst({
      where: { id, publicado: true, actividad: { estado: true } },
      select: { id: true, idActividad: true, titulo: true, nivel: true, parametros: true },
    });

    return sesion;
  }

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
