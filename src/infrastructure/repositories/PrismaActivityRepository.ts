import type { Actividad } from '@prisma/client';
import { Activity, type TextosNivel, type Umbrales } from '../../domain/model/Activity.js';
import { ActivityId } from '../../domain/model/Identifier.js';
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

  private aDominio(fila: Actividad): Activity {
    return Activity.create({
      id: new ActivityId(fila.id),
      nombre: fila.nombre,
      direccionEscala: fila.direccionEscala,
      puntajeMaximo: fila.puntajeMaximo === null ? undefined : Number(fila.puntajeMaximo),
      umbrales: (fila.umbrales as Umbrales | null) ?? undefined,
      textosNivel: (fila.textosNivel as TextosNivel | null) ?? undefined,
    });
  }
}
