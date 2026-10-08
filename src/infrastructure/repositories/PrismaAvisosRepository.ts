import type { Prisma } from '@prisma/client';
import type { PreferenciasDeAviso, SuscripcionPush } from '../../domain/model/Aviso.js';
import { MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA, TipoDeAviso } from '../../domain/model/Aviso.js';
import { ZONA_HORARIA_POR_DEFECTO, type Dia } from '../../domain/model/Calendario.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/** Un dia AAAA-MM-DD como valor de una columna DATE. */
function fechaDelDia(dia: Dia): Date {
  return new Date(`${dia}T00:00:00.000Z`);
}

/** A quien le toca `tipo`: su zona, su hora en la ventana y ese aviso sin revisar hoy. */
function criterioDeQuienLeToca(
  tipo: TipoDeAviso,
  zona: string,
  desde: number,
  hasta: number,
  hoy: Date,
): Prisma.PreferenciaAvisoWhereInput {
  const ventana = { gte: desde, lte: hasta };
  // El mismo aviso ya se reviso hoy, o no.
  const semaforoSinRevisar = [{ ultimoAvisoSemaforo: null }, { ultimoAvisoSemaforo: { lt: hoy } }];
  const mananaSinRevisar = [{ ultimoAvisoManana: null }, { ultimoAvisoManana: { lt: hoy } }];
  const rachaSinRevisar = [{ ultimoAvisoRacha: null }, { ultimoAvisoRacha: { lt: hoy } }];
  const nocheSinRevisar = [{ ultimoAvisoNoche: null }, { ultimoAvisoNoche: { lt: hoy } }];

  switch (tipo) {
    case TipoDeAviso.SEMAFORO:
      return { zonaHoraria: zona, minutoSemaforo: ventana, OR: semaforoSinRevisar };
    case TipoDeAviso.MANANA:
      return { zonaHoraria: zona, minutoManana: ventana, OR: mananaSinRevisar };
    // La racha y la noche invitan a lo mismo: una sola por dia, la primera
    // que llegue. Si la otra ya se reviso hoy, esta no le toca.
    case TipoDeAviso.RACHA:
      return {
        zonaHoraria: zona,
        minutoRacha: ventana,
        AND: [{ OR: rachaSinRevisar }, { OR: nocheSinRevisar }],
      };
    case TipoDeAviso.NOCHE:
      return {
        zonaHoraria: zona,
        minutoNoche: ventana,
        AND: [{ OR: nocheSinRevisar }, { OR: rachaSinRevisar }],
      };
  }
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
      minutoManana: fila?.minutoManana ?? null,
      minutoNoche: fila?.minutoNoche ?? null,
      zonaHoraria: fila?.zonaHoraria ?? ZONA_HORARIA_POR_DEFECTO,
    };
  }

  async guardarPreferencias(preferencias: PreferenciasDeAviso): Promise<PreferenciasDeAviso> {
    // La zona no se escribe: la copia la base desde la cuenta, con los
    // disparadores de la migracion de SCRUM-123. Tener un solo camino evita
    // que las dos queden distintas.
    const { userId, minutoSemaforo, minutoRacha, minutoManana, minutoNoche } = preferencias;

    await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.preferenciaAviso.upsert({
        where: { idUsuario: userId.value },
        create: { idUsuario: userId.value, minutoSemaforo, minutoRacha, minutoManana, minutoNoche },
        update: { minutoSemaforo, minutoRacha, minutoManana, minutoNoche },
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

        // Un tope por cuenta (SCRUM-153): sale la mas antigua, no se rechaza la
        // nueva. Va en la misma transaccion, asi que nunca se ve de mas ni de
        // menos.
        const sobrantes = await cliente.suscripcionPush.findMany({
          where: { idUsuario: userId.value },
          orderBy: [{ fechaCreacion: 'desc' }, { id: 'desc' }],
          skip: MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA,
          select: { id: true },
        });

        if (sobrantes.length > 0) {
          await cliente.suscripcionPush.deleteMany({
            where: { id: { in: sobrantes.map((fila) => fila.id) } },
          });
        }
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

  async zonasEnUso(): Promise<readonly string[]> {
    const filas = await this.prisma.comoTareaDeAvisos((cliente) =>
      cliente.preferenciaAviso.findMany({
        where: {
          OR: [
            { minutoSemaforo: { not: null } },
            { minutoRacha: { not: null } },
            { minutoManana: { not: null } },
            { minutoNoche: { not: null } },
          ],
        },
        distinct: ['zonaHoraria'],
        select: { zonaHoraria: true },
      }),
    );

    return filas.map((fila) => fila.zonaHoraria);
  }

  async aQuienLeToca(
    tipo: TipoDeAviso,
    zona: string,
    desde: number,
    hasta: number,
    dia: Dia,
  ): Promise<readonly UserId[]> {
    const where = criterioDeQuienLeToca(tipo, zona, desde, hasta, fechaDelDia(dia));
    const filas = await this.prisma.comoTareaDeAvisos((cliente) =>
      cliente.preferenciaAviso.findMany({ where, select: { idUsuario: true } }),
    );

    return filas.map((fila) => new UserId(fila.idUsuario));
  }

  async marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia): Promise<void> {
    const hoy = fechaDelDia(dia);

    await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.preferenciaAviso.updateMany({
        where: { idUsuario: userId.value },
        data: {
          [TipoDeAviso.SEMAFORO]: { ultimoAvisoSemaforo: hoy },
          [TipoDeAviso.RACHA]: { ultimoAvisoRacha: hoy },
          [TipoDeAviso.MANANA]: { ultimoAvisoManana: hoy },
          [TipoDeAviso.NOCHE]: { ultimoAvisoNoche: hoy },
        }[tipo],
      }),
    );
  }
}
