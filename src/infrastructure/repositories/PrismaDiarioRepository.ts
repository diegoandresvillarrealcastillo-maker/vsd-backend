import { Prisma, type EntradaDiario } from '@prisma/client';
import type { Dia } from '../../domain/model/Calendario.js';
import { adjuntosGuardados, DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/**
 * Si el error es el de la clave unica de la operacion: dos peticiones con el
 * mismo `clientOperationId` que llegaron a la vez. Se mira por su forma, como
 * en `PrismaUserRepository`, sin importar los tipos de error del cliente.
 *
 * Con el adaptador de PostgreSQL de Prisma 7 no viene `meta.target`: el
 * nombre del indice llega dentro de `meta.driverAdapterError`. Se busca en
 * toda la `meta` para que valga con cualquiera de las dos formas.
 */
function esOperacionRepetida(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const posible = error as { code?: unknown; meta?: unknown };

  return posible.code === 'P2002' && /operacion_?cliente/i.test(JSON.stringify(posible.meta ?? {}));
}

/** Un dia como lo guarda una columna DATE: la medianoche UTC de esa fecha. */
function aFecha(dia: Dia): Date {
  return new Date(`${dia}T00:00:00.000Z`);
}

/**
 * Lo que alguien escribio, como documento del editor.
 *
 * Las anotaciones de antes del editor se guardaron como texto sin formato y se
 * leen como un parrafo por linea. Si una enriquecida no se pudiera leer, se
 * ensena su texto tal cual antes que perderla.
 */
function documentoDe(fila: EntradaDiario): DocumentoDelDiario {
  if (fila.formato === 'enriquecido') {
    try {
      return DocumentoDelDiario.guardado(JSON.parse(fila.contenido));
    } catch {
      // Se cae al texto sin formato de abajo.
    }
  }

  return DocumentoDelDiario.desdeTextoPlano(fila.contenido);
}

/**
 * El diario contra PostgreSQL, siempre en nombre de la persona.
 *
 * Todo pasa por `comoUsuario`: las politicas de la base dejan ver y tocar solo
 * sus filas, y la de edicion solo durante la primera hora. Los filtros por
 * `idUsuario` de cada consulta son la primera defensa, no la unica.
 */
export class PrismaDiarioRepository implements DiarioRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async todasDe(userId: UserId): Promise<readonly EntradaDeDiario[]> {
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.entradaDiario.findMany({
        where: { idUsuario: userId.value },
        orderBy: { fechaCreacion: 'asc' },
      }),
    );

    return filas.map((fila) => this.aDominio(fila));
  }

  async entreDias(userId: UserId, desde: Dia, hasta: Dia): Promise<readonly EntradaDeDiario[]> {
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.entradaDiario.findMany({
        where: { idUsuario: userId.value, dia: { gte: aFecha(desde), lte: aFecha(hasta) } },
        orderBy: [{ dia: 'asc' }, { fechaCreacion: 'asc' }],
      }),
    );

    return filas.map((fila) => this.aDominio(fila));
  }

  async porId(userId: UserId, id: EntradaId): Promise<EntradaDeDiario | null> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.entradaDiario.findFirst({ where: { id: id.value, idUsuario: userId.value } }),
    );

    return fila === null ? null : this.aDominio(fila);
  }

  async porOperacion(
    userId: UserId,
    clientOperationId: ClientOperationId,
  ): Promise<EntradaDeDiario | null> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.entradaDiario.findUnique({
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

  async guardarNueva(entrada: EntradaDeDiario): Promise<EntradaDeDiario> {
    try {
      const fila = await this.prisma.comoUsuario(entrada.userId.value, (cliente) =>
        cliente.entradaDiario.create({
          data: {
            id: entrada.id.value,
            idUsuario: entrada.userId.value,
            idOperacionCliente: entrada.clientOperationId.value,
            // La hora que dijo el dispositivo, ya acotada por el dominio. La base
            // la acota otra vez (disparador): lo que llegue sin pasar por aqui no
            // puede adelantarse ni venir de hace mas de un mes.
            fechaCreacion: entrada.creadaEn,
            fechaEdicion: entrada.editadaEn,
            dia: aFecha(entrada.dia),
            titulo: entrada.titulo ?? null,
            contenido: entrada.documento.serializado(),
            formato: 'enriquecido',
            // Sin diagramas la columna queda en NULL, en lugar de una lista
            // vacia que no dice nada.
            ...(entrada.adjuntos.length > 0
              ? { adjuntos: entrada.adjuntos as unknown as Prisma.InputJsonValue }
              : {}),
          },
        }),
      );

      // Lo que devuelve la base, con su `fecha_creacion` tal como la dejo el
      // disparador: de ella se cuenta la hora para editar.
      return this.aDominio(fila);
    } catch (error) {
      // La misma operacion llego dos veces a la vez y la otra gano. Es un
      // reintento, no un error: se devuelve lo que ella guardo.
      if (esOperacionRepetida(error)) {
        const existente = await this.porOperacion(entrada.userId, entrada.clientOperationId);

        if (existente !== null) {
          return existente;
        }
      }

      throw error;
    }
  }

  async guardarEdicion(
    editada: EntradaDeDiario,
    versionAnterior: number,
  ): Promise<EntradaDeDiario | null> {
    return this.prisma.comoUsuario(editada.userId.value, async (cliente) => {
      // `updateMany` y no `update`: con la version en el WHERE, una fila que
      // cambio entretanto no se toca, y con la politica de la base, una fila
      // fuera de su hora tampoco. En los dos casos el resultado es cero filas,
      // sin error, y quien llama averigua el motivo.
      const { count } = await cliente.entradaDiario.updateMany({
        where: { id: editada.id.value, idUsuario: editada.userId.value, version: versionAnterior },
        data: {
          titulo: editada.titulo ?? null,
          contenido: editada.documento.serializado(),
          formato: 'enriquecido',
          adjuntos:
            editada.adjuntos.length > 0
              ? (editada.adjuntos as unknown as Prisma.InputJsonValue)
              : Prisma.DbNull,
          version: editada.version,
          // La hora de la edicion segun el dispositivo, ya acotada. El disparador
          // de la base decide si cae dentro de la hora para editar: si no, no toca
          // nada y esto devuelve cero filas.
          fechaEdicion: editada.editadaEn,
        },
      });

      if (count === 0) {
        return null;
      }

      const fila = await cliente.entradaDiario.findUnique({ where: { id: editada.id.value } });

      return fila === null ? null : this.aDominio(fila);
    });
  }

  private aDominio(fila: EntradaDiario): EntradaDeDiario {
    return EntradaDeDiario.guardada({
      id: new EntradaId(fila.id),
      userId: new UserId(fila.idUsuario),
      clientOperationId: new ClientOperationId(fila.idOperacionCliente),
      dia: fila.dia.toISOString().slice(0, 10),
      titulo: fila.titulo ?? undefined,
      documento: documentoDe(fila),
      adjuntos: adjuntosGuardados(fila.adjuntos),
      version: fila.version,
      creadaEn: fila.fechaCreacion,
      editadaEn: fila.fechaEdicion,
    });
  }
}
