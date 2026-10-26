import type { Prisma } from '@prisma/client';
import type {
  MascotaDelAviso,
  PreferenciasDeAviso,
  SuscripcionPush,
} from '../../domain/model/Aviso.js';
import { MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA, TipoDeAviso } from '../../domain/model/Aviso.js';
import { ZONA_HORARIA_POR_DEFECTO, type Dia } from '../../domain/model/Calendario.js';
import {
  basesDelPrimerAviso,
  basesDelSegundoAviso,
  FrecuenciaDelSemaforo,
  type RangoDeMinutos,
} from '../../domain/model/FrecuenciaDelSemaforo.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/** Un dia AAAA-MM-DD como valor de una columna DATE. */
function fechaDelDia(dia: Dia): Date {
  return new Date(`${dia}T00:00:00.000Z`);
}

/**
 * Que ese aviso todavia no se haya revisado hoy.
 *
 * Es la misma condicion para saber a quien le toca y para reclamar el aviso
 * (`marcarRevisado`), y tiene que serlo: si las dos preguntaran cosas distintas,
 * a alguien le tocaria un aviso que despues no se le deja reclamar, o al reves.
 */
function sinRevisarHoy(tipo: TipoDeAviso, hoy: Date): Prisma.PreferenciaAvisoWhereInput {
  const semaforoSinRevisar = [{ ultimoAvisoSemaforo: null }, { ultimoAvisoSemaforo: { lt: hoy } }];
  const semaforoNocheSinRevisar = [
    { ultimoAvisoSemaforoNoche: null },
    { ultimoAvisoSemaforoNoche: { lt: hoy } },
  ];
  const mananaSinRevisar = [{ ultimoAvisoManana: null }, { ultimoAvisoManana: { lt: hoy } }];
  const rachaSinRevisar = [{ ultimoAvisoRacha: null }, { ultimoAvisoRacha: { lt: hoy } }];
  const nocheSinRevisar = [{ ultimoAvisoNoche: null }, { ultimoAvisoNoche: { lt: hoy } }];

  switch (tipo) {
    case TipoDeAviso.SEMAFORO:
      return { OR: semaforoSinRevisar };
    case TipoDeAviso.SEMAFORO_NOCHE:
      return { OR: semaforoNocheSinRevisar };
    case TipoDeAviso.MANANA:
      return { OR: mananaSinRevisar };
    // La racha y la noche invitan a lo mismo: una sola por dia, la primera
    // que llegue. Si la otra ya se reviso hoy, esta no le toca.
    case TipoDeAviso.RACHA:
      return { AND: [{ OR: rachaSinRevisar }, { OR: nocheSinRevisar }] };
    case TipoDeAviso.NOCHE:
      return { AND: [{ OR: nocheSinRevisar }, { OR: rachaSinRevisar }] };
  }
}

/** Las horas base de una frecuencia cuya hora cae en esos rangos, como condicion de la base. */
function horasBaseDe(
  frecuencia: FrecuenciaDelSemaforo,
  rangos: readonly RangoDeMinutos[],
): Prisma.PreferenciaAvisoWhereInput[] {
  return rangos.map((rango) => ({
    frecuenciaSemaforo: frecuencia,
    minutoSemaforo: { gte: rango.desde, lte: rango.hasta },
  }));
}

/**
 * Que la hora del aviso caiga en la ventana (SCRUM-146).
 *
 * Los dos avisos del semaforo salen de la hora base y de la frecuencia (`FrecuenciaDelSemaforo`), y
 * se buscan **por la hora base**, que es la columna con indice: se le pregunta a la base por las
 * horas base cuyo aviso cae entre `desde` y `hasta`. Una lista vacia de condiciones no encuentra a
 * nadie, que es lo correcto (por ejemplo, el segundo aviso antes de las 12:00).
 */
function criterioDeLaHora(
  tipo: TipoDeAviso,
  desde: number,
  hasta: number,
): Prisma.PreferenciaAvisoWhereInput {
  const ventana = { gte: desde, lte: hasta };

  switch (tipo) {
    case TipoDeAviso.SEMAFORO:
      return {
        OR: [
          { frecuenciaSemaforo: FrecuenciaDelSemaforo.MANANA, minutoSemaforo: ventana },
          ...horasBaseDe(
            FrecuenciaDelSemaforo.DOS_VECES,
            basesDelPrimerAviso(FrecuenciaDelSemaforo.DOS_VECES, desde, hasta),
          ),
        ],
      };
    case TipoDeAviso.SEMAFORO_NOCHE: {
      const rangos = basesDelSegundoAviso(desde, hasta);
      const condiciones = [
        ...horasBaseDe(FrecuenciaDelSemaforo.NOCHE, rangos),
        ...horasBaseDe(FrecuenciaDelSemaforo.DOS_VECES, rangos),
      ];

      // Una ventana de antes de las 12:00 no tiene ninguna hora base: el segundo aviso no cae ahi.
      // Un `OR` vacio NO sirve para decirlo: Prisma lo deja pasar como si no hubiera condicion y
      // el aviso le tocaria a todo el mundo. `in: []` si es siempre falso.
      return condiciones.length === 0 ? { minutoSemaforo: { in: [] } } : { OR: condiciones };
    }
    case TipoDeAviso.MANANA:
      return { minutoManana: ventana };
    case TipoDeAviso.RACHA:
      return { minutoRacha: ventana };
    case TipoDeAviso.NOCHE:
      return { minutoNoche: ventana };
  }
}

/** A quien le toca `tipo`: su zona, su hora en la ventana y ese aviso sin revisar hoy. */
function criterioDeQuienLeToca(
  tipo: TipoDeAviso,
  zona: string,
  desde: number,
  hasta: number,
  hoy: Date,
): Prisma.PreferenciaAvisoWhereInput {
  return {
    zonaHoraria: zona,
    AND: [criterioDeLaHora(tipo, desde, hasta), sinRevisarHoy(tipo, hoy)],
  };
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
      frecuenciaSemaforo: fila?.frecuenciaSemaforo ?? FrecuenciaDelSemaforo.MANANA,
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
    const { userId, minutoSemaforo, frecuenciaSemaforo, minutoRacha, minutoManana, minutoNoche } =
      preferencias;

    await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.preferenciaAviso.upsert({
        where: { idUsuario: userId.value },
        create: {
          idUsuario: userId.value,
          minutoSemaforo,
          frecuenciaSemaforo,
          minutoRacha,
          minutoManana,
          minutoNoche,
        },
        update: { minutoSemaforo, frecuenciaSemaforo, minutoRacha, minutoManana, minutoNoche },
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

  async mascotaDe(userId: UserId): Promise<MascotaDelAviso | null> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.usuario.findUnique({ where: { id: userId.value }, select: { mascota: true } }),
    );
    const valor = fila?.mascota;

    if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
      return null;
    }

    const { forma, nombre } = valor as Record<string, unknown>;

    return typeof forma === 'string' && forma !== '' && typeof nombre === 'string'
      ? { forma, nombre }
      : null;
  }

  async zonasEnUso(): Promise<readonly string[]> {
    // `GROUP BY` y no `distinct`: el `distinct` de Prisma trae todas las filas y las repite menos en
    // memoria, y esto corre cada minuto (SCRUM-264).
    const filas = await this.prisma.comoTareaDeAvisos((cliente) =>
      cliente.preferenciaAviso.groupBy({
        by: ['zonaHoraria'],
        where: {
          OR: [
            { minutoSemaforo: { not: null } },
            { minutoRacha: { not: null } },
            { minutoManana: { not: null } },
            { minutoNoche: { not: null } },
          ],
        },
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

  /**
   * Reclama el aviso de hoy con **una sola sentencia**: `UPDATE ... WHERE` el
   * aviso sigue sin revisar. Si dos revisiones llegan a la vez, PostgreSQL deja
   * pasar a una y a la otra la hace esperar a que termine; al reevaluar el
   * `WHERE` sobre la fila ya cambiada, ya no coincide, y actualiza cero filas.
   * Quien actualiza una fila lo gano; quien actualiza cero se aparta.
   *
   * Leer primero y escribir despues dejaria una ventana entre las dos cosas.
   */
  async marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia): Promise<boolean> {
    const hoy = fechaDelDia(dia);

    const { count } = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.preferenciaAviso.updateMany({
        where: { idUsuario: userId.value, ...sinRevisarHoy(tipo, hoy) },
        data: {
          [TipoDeAviso.SEMAFORO]: { ultimoAvisoSemaforo: hoy },
          [TipoDeAviso.SEMAFORO_NOCHE]: { ultimoAvisoSemaforoNoche: hoy },
          [TipoDeAviso.RACHA]: { ultimoAvisoRacha: hoy },
          [TipoDeAviso.MANANA]: { ultimoAvisoManana: hoy },
          [TipoDeAviso.NOCHE]: { ultimoAvisoNoche: hoy },
        }[tipo],
      }),
    );

    return count > 0;
  }
}
