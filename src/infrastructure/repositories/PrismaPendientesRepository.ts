import type { Pendiente as FilaDePendiente } from '@prisma/client';
import { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import { Pendiente } from '../../domain/model/Pendiente.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/**
 * Si el error es el de la clave unica de la operacion. Como en el diario, se
 * busca en toda la `meta`: con el adaptador de Prisma 7 no llega `target`.
 */
function esOperacionRepetida(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const posible = error as { code?: unknown; meta?: unknown };

  return posible.code === 'P2002' && /operacion_?cliente/i.test(JSON.stringify(posible.meta ?? {}));
}

/** Un dia AAAA-MM-DD como valor de una columna DATE, o `null` si no hay. */
function aFecha(dia: string | undefined): Date | null {
  return dia === undefined ? null : new Date(`${dia}T00:00:00.000Z`);
}

/**
 * El semaforo contra PostgreSQL, siempre en nombre de la persona: la politica
 * de la base solo deja ver y tocar sus filas. Los filtros por `idUsuario` son
 * la primera defensa, no la unica.
 */
export class PrismaPendientesRepository implements PendientesRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async vigentesDe(userId: UserId, hechosDesde: Date): Promise<readonly Pendiente[]> {
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.pendiente.findMany({
        where: {
          idUsuario: userId.value,
          OR: [{ hecho: false }, { hecho: true, fechaEdicion: { gte: hechosDesde } }],
        },
      }),
    );

    return filas.map((fila) => this.aDominio(fila));
  }

  async todosDe(userId: UserId): Promise<readonly Pendiente[]> {
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.pendiente.findMany({
        where: { idUsuario: userId.value },
        orderBy: { fechaCreacion: 'asc' },
      }),
    );

    return filas.map((fila) => this.aDominio(fila));
  }

  async porId(userId: UserId, id: PendienteId): Promise<Pendiente | null> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.pendiente.findFirst({ where: { id: id.value, idUsuario: userId.value } }),
    );

    return fila === null ? null : this.aDominio(fila);
  }

  async porOperacion(
    userId: UserId,
    clientOperationId: ClientOperationId,
  ): Promise<Pendiente | null> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.pendiente.findUnique({
        where: {
          idUsuario_idOperacionCliente: {
            idUsuario: userId.value,
            idOperacionCliente: clientOperationId.value,
          },
        },
      }),
    );

    return fila === null ? null : this.aDominio(fila);
  }

  async guardarNuevo(pendiente: Pendiente): Promise<Pendiente> {
    try {
      const fila = await this.prisma.comoUsuario(pendiente.userId.value, (cliente) =>
        cliente.pendiente.create({
          data: {
            id: pendiente.id.value,
            idUsuario: pendiente.userId.value,
            idOperacionCliente: pendiente.clientOperationId.value,
            texto: pendiente.texto,
            nivel: pendiente.nivel,
            hecho: pendiente.hecho,
            fechaLimite: aFecha(pendiente.fechaLimite),
            fechaCreacion: pendiente.creadoEn,
          },
        }),
      );

      return this.aDominio(fila);
    } catch (error) {
      // La misma operacion llego dos veces a la vez: es un reintento.
      if (esOperacionRepetida(error)) {
        const existente = await this.porOperacion(pendiente.userId, pendiente.clientOperationId);

        if (existente !== null) {
          return existente;
        }
      }

      throw error;
    }
  }

  async actualizar(pendiente: Pendiente, versionAnterior: number): Promise<Pendiente | null> {
    return this.prisma.comoUsuario(pendiente.userId.value, async (cliente) => {
      const { count } = await cliente.pendiente.updateMany({
        // La version va en el WHERE: la comprueba la base, en el mismo UPDATE.
        // Comprobarla antes en el codigo dejaria una ventana entre leer y
        // escribir por la que se colaria el cambio del otro dispositivo.
        where: {
          id: pendiente.id.value,
          idUsuario: pendiente.userId.value,
          version: versionAnterior,
        },
        data: {
          texto: pendiente.texto,
          nivel: pendiente.nivel,
          hecho: pendiente.hecho,
          posponerHasta: pendiente.posponerHasta ?? null,
          fechaLimite: aFecha(pendiente.fechaLimite),
          version: { increment: 1 },
        },
      });

      if (count === 0) {
        return null;
      }

      const fila = await cliente.pendiente.findUnique({ where: { id: pendiente.id.value } });

      return fila === null ? null : this.aDominio(fila);
    });
  }

  async borrar(userId: UserId, id: PendienteId): Promise<boolean> {
    const { count } = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.pendiente.deleteMany({ where: { id: id.value, idUsuario: userId.value } }),
    );

    return count > 0;
  }

  private aDominio(fila: FilaDePendiente): Pendiente {
    return Pendiente.guardado({
      id: new PendienteId(fila.id),
      userId: new UserId(fila.idUsuario),
      clientOperationId: new ClientOperationId(fila.idOperacionCliente),
      texto: fila.texto,
      nivel: fila.nivel,
      hecho: fila.hecho,
      posponerHasta: fila.posponerHasta ?? undefined,
      fechaLimite: fila.fechaLimite?.toISOString().slice(0, 10),
      version: fila.version,
      creadoEn: fila.fechaCreacion,
      editadoEn: fila.fechaEdicion,
    });
  }
}
