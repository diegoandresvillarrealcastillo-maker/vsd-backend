import type { Actividad } from '@prisma/client';
import { Activity, type TextosNivel, type Umbrales } from '../../domain/model/Activity.js';
import { Categoria } from '../../domain/model/Categoria.js';
import { ActivityId, CategoryId } from '../../domain/model/Identifier.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/**
 * Catalogo de actividades leido de PostgreSQL.
 *
 * Igual que su gemelo en memoria, su unico trabajo es traducir filas a
 * entidades. Los tipos de Prisma no salen de este archivo.
 */
export class PrismaActivityRepository implements ActivityRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ActivityId): Promise<Activity | null> {
    const fila = await this.prisma.actividad.findUnique({ where: { id: id.value } });

    // Una actividad desactivada no se puede realizar. Se trata como si no
    // existiera en lugar de dejar registrar resultados contra ella: el
    // administrador la retiro por algun motivo.
    if (fila === null || !fila.estado) {
      return null;
    }

    return this.aDominio(fila);
  }

  /**
   * El catalogo entero en una sola consulta.
   *
   * Prisma resuelve la relacion con un `IN`, no con una consulta por
   * categoria: con tres categorias da igual, pero es la diferencia entre algo
   * que escala y algo que empieza a pesar en cuanto crezca el catalogo.
   *
   * Se ordena aqui y no en quien lo pinta. Que el orden dependa del cliente
   * significa que dos clientes muestran cosas distintas, y ese tipo de
   * diferencia nadie la nota hasta que alguien pregunta por que.
   */
  async listarCatalogo(): Promise<readonly Categoria[]> {
    const filas = await this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        actividades: {
          // Una actividad retirada no se ofrece. Ensenarla y despues no dejar
          // registrar el resultado es peor que no ensenarla.
          where: { estado: true },
          orderBy: { nombre: 'asc' },
        },
      },
    });

    return filas.map((fila) =>
      Categoria.create({
        id: new CategoryId(fila.id),
        nombre: fila.nombre,
        descripcion: fila.descripcion ?? undefined,
        actividades: fila.actividades.map((actividad) => this.aDominio(actividad)),
      }),
    );
  }

  private aDominio(fila: Actividad): Activity {
    return Activity.create({
      id: new ActivityId(fila.id),
      nombre: fila.nombre,
      tipo: fila.tipo,
      descripcion: fila.descripcion ?? undefined,
      direccionEscala: fila.direccionEscala,
      puntajeMaximo: fila.puntajeMaximo === null ? undefined : Number(fila.puntajeMaximo),
      umbrales: (fila.umbrales as Umbrales | null) ?? undefined,
      textosNivel: (fila.textosNivel as TextosNivel | null) ?? undefined,
    });
  }
}
