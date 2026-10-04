import type { PreferenciasDeAviso, SuscripcionPush } from '../../domain/model/Aviso.js';
import { TipoDeAviso } from '../../domain/model/Aviso.js';
import type { Dia } from '../../domain/model/Calendario.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/** Un dia AAAA-MM-DD como valor de una columna DATE. */
function fechaDelDia(dia: Dia): Date {
  return new Date(`${dia}T00:00:00.000Z`);
}

/**
 * Los avisos contra PostgreSQL (SCRUM-102).
 *
 * Todo va en nombre de la persona, salvo `aQuienLeToca`, que usa la tarea de
 * avisos: solo puede leer la tabla de horas y solo devuelve identificadores.
 */
export class PrismaAvisosRepository implements AvisosRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async preferenciasDe(userId: UserId): Promise<PreferenciasDeAviso> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.preferenciaAviso.findUnique({ where: { idUsuario: userId.value } }),
    );

    return {
      userId,
      minutoSemaforo: fila?.minutoSemaforo ?? null,
      minutoRacha: fila?.minutoRacha ?? null,
    };
  }

  async guardarPreferencias(preferencias: PreferenciasDeAviso): Promise<PreferenciasDeAviso> {
    const { userId, minutoSemaforo, minutoRacha } = preferencias;

    await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.preferenciaAviso.upsert({
        where: { idUsuario: userId.value },
        create: { idUsuario: userId.value, minutoSemaforo, minutoRacha },
        update: { minutoSemaforo, minutoRacha },
      }),
    );

    return preferencias;
  }

  async suscribir(userId: UserId, suscripcion: SuscripcionPush): Promise<void> {
    await this.prisma.comoUsuarioEnSuNavegador(
      userId.value,
      suscripcion.endpoint,
      async (cliente) => {
        // Si este navegador entregaba los avisos de otra persona, deja de
        // hacerlo. Si era de esta misma, se reemplaza con las claves nuevas.
        await cliente.suscripcionPush.deleteMany({ where: { endpoint: suscripcion.endpoint } });
        await cliente.suscripcionPush.create({
          data: {
            idUsuario: userId.value,
            endpoint: suscripcion.endpoint,
            claveP256dh: suscripcion.p256dh,
            claveAuth: suscripcion.auth,
          },
        });
      },
    );
  }

  async desuscribir(userId: UserId, endpoint: string): Promise<void> {
    await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.suscripcionPush.deleteMany({ where: { idUsuario: userId.value, endpoint } }),
    );
  }

  async suscripcionesDe(userId: UserId): Promise<readonly SuscripcionPush[]> {
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.suscripcionPush.findMany({ where: { idUsuario: userId.value } }),
    );

    return filas.map((fila) => ({
      endpoint: fila.endpoint,
      p256dh: fila.claveP256dh,
      auth: fila.claveAuth,
    }));
  }

  async aQuienLeToca(
    tipo: TipoDeAviso,
    desde: number,
    hasta: number,
    dia: Dia,
  ): Promise<readonly UserId[]> {
    const hoy = fechaDelDia(dia);
    const filas = await this.prisma.comoTareaDeAvisos((cliente) =>
      cliente.preferenciaAviso.findMany({
        where:
          tipo === TipoDeAviso.SEMAFORO
            ? {
                minutoSemaforo: { gte: desde, lte: hasta },
                OR: [{ ultimoAvisoSemaforo: null }, { ultimoAvisoSemaforo: { lt: hoy } }],
              }
            : {
                minutoRacha: { gte: desde, lte: hasta },
                OR: [{ ultimoAvisoRacha: null }, { ultimoAvisoRacha: { lt: hoy } }],
              },
        select: { idUsuario: true },
      }),
    );

    return filas.map((fila) => new UserId(fila.idUsuario));
  }

  async marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia): Promise<void> {
    const hoy = fechaDelDia(dia);

    await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.preferenciaAviso.updateMany({
        where: { idUsuario: userId.value },
        data:
          tipo === TipoDeAviso.SEMAFORO ? { ultimoAvisoSemaforo: hoy } : { ultimoAvisoRacha: hoy },
      }),
    );
  }
}
