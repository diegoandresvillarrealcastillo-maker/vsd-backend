import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/** Lectura del diario contra PostgreSQL, en nombre de la persona. */
export class PrismaDiarioRepository implements DiarioRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async todasDe(userId: UserId): Promise<readonly EntradaDeDiario[]> {
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.entradaDiario.findMany({
        where: { idUsuario: userId.value },
        orderBy: { fechaCreacion: 'asc' },
      }),
    );

    return filas.map((fila) => ({
      id: fila.id,
      titulo: fila.titulo ?? undefined,
      contenido: fila.contenido,
      formato: fila.formato,
      etiquetas: fila.etiquetas,
      creadaEn: fila.fechaCreacion,
      editadaEn: fila.fechaEdicion,
    }));
  }
}
