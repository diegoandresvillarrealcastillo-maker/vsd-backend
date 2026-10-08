import type { PreferenciasDeAviso, SuscripcionPush } from '../../domain/model/Aviso.js';
import { MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA, TipoDeAviso } from '../../domain/model/Aviso.js';
import { ZONA_HORARIA_POR_DEFECTO, type Dia } from '../../domain/model/Calendario.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';

interface Fila {
  zonaHoraria: string;
  minutoSemaforo: number | null;
  minutoRacha: number | null;
  minutoManana: number | null;
  minutoNoche: number | null;
  ultimoAvisoSemaforo: Dia | null;
  ultimoAvisoRacha: Dia | null;
  ultimoAvisoManana: Dia | null;
  ultimoAvisoNoche: Dia | null;
}

/** El minuto en que esa persona quiere ese aviso. */
function minutoDe(fila: Fila, tipo: TipoDeAviso): number | null {
  return {
    [TipoDeAviso.SEMAFORO]: fila.minutoSemaforo,
    [TipoDeAviso.RACHA]: fila.minutoRacha,
    [TipoDeAviso.MANANA]: fila.minutoManana,
    [TipoDeAviso.NOCHE]: fila.minutoNoche,
  }[tipo];
}

/** El ultimo dia en que se reviso ese aviso. */
function ultimoDe(fila: Fila, tipo: TipoDeAviso): Dia | null {
  return {
    [TipoDeAviso.SEMAFORO]: fila.ultimoAvisoSemaforo,
    [TipoDeAviso.RACHA]: fila.ultimoAvisoRacha,
    [TipoDeAviso.MANANA]: fila.ultimoAvisoManana,
    [TipoDeAviso.NOCHE]: fila.ultimoAvisoNoche,
  }[tipo];
}

/** Sin revisar hoy: nunca, o un dia anterior. */
function sinRevisarHoy(ultimo: Dia | null, dia: Dia): boolean {
  return ultimo === null || ultimo < dia;
}

/**
 * Los avisos en memoria, para desarrollo sin base de datos y para las
 * pruebas. Se comporta como el de PostgreSQL: un navegador entrega los avisos
 * de una sola persona.
 *
 * La zona es lo unico en que difiere: en PostgreSQL la copia la base desde la
 * cuenta cada vez que esta cambia; aqui queda la que traia el ultimo cambio de
 * horas.
 */
export class InMemoryAvisosRepository implements AvisosRepositoryPort {
  private readonly preferencias = new Map<string, Fila>();
  /** Por endpoint: un navegador, una persona. */
  private readonly suscripciones = new Map<
    string,
    { userId: string; suscripcion: SuscripcionPush }
  >();

  preferenciasDe(userId: UserId): Promise<PreferenciasDeAviso> {
    const fila = this.preferencias.get(userId.value);

    return Promise.resolve({
      userId,
      minutoSemaforo: fila?.minutoSemaforo ?? null,
      minutoRacha: fila?.minutoRacha ?? null,
      minutoManana: fila?.minutoManana ?? null,
      minutoNoche: fila?.minutoNoche ?? null,
      zonaHoraria: fila?.zonaHoraria ?? ZONA_HORARIA_POR_DEFECTO,
    });
  }

  guardarPreferencias(preferencias: PreferenciasDeAviso): Promise<PreferenciasDeAviso> {
    const actual = this.preferencias.get(preferencias.userId.value);

    this.preferencias.set(preferencias.userId.value, {
      ultimoAvisoSemaforo: actual?.ultimoAvisoSemaforo ?? null,
      ultimoAvisoRacha: actual?.ultimoAvisoRacha ?? null,
      ultimoAvisoManana: actual?.ultimoAvisoManana ?? null,
      ultimoAvisoNoche: actual?.ultimoAvisoNoche ?? null,
      zonaHoraria: preferencias.zonaHoraria,
      minutoSemaforo: preferencias.minutoSemaforo,
      minutoRacha: preferencias.minutoRacha,
      minutoManana: preferencias.minutoManana,
      minutoNoche: preferencias.minutoNoche,
    });

    return Promise.resolve(preferencias);
  }

  suscribir(userId: UserId, suscripcion: SuscripcionPush): Promise<void> {
    // Se borra antes de poner: una suscripcion renovada pasa a ser la mas
    // reciente, como en la base, donde se reemplaza la fila.
    this.suscripciones.delete(suscripcion.endpoint);
    this.suscripciones.set(suscripcion.endpoint, { userId: userId.value, suscripcion });

    // El `Map` recuerda el orden en que se agrego cada una: las primeras de la
    // persona son las mas antiguas, y son las que salen al pasar el tope.
    const deLaPersona = [...this.suscripciones.entries()].filter(
      ([, fila]) => fila.userId === userId.value,
    );

    for (const [endpoint] of deLaPersona.slice(
      0,
      Math.max(0, deLaPersona.length - MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA),
    )) {
      this.suscripciones.delete(endpoint);
    }

    return Promise.resolve();
  }

  desuscribir(userId: UserId, endpoint: string): Promise<void> {
    if (this.suscripciones.get(endpoint)?.userId === userId.value) {
      this.suscripciones.delete(endpoint);
    }

    return Promise.resolve();
  }

  suscripcionesDe(userId: UserId): Promise<readonly SuscripcionPush[]> {
    return Promise.resolve(
      [...this.suscripciones.values()]
        .filter((fila) => fila.userId === userId.value)
        .map((fila) => fila.suscripcion),
    );
  }

  zonasEnUso(): Promise<readonly string[]> {
    return Promise.resolve([
      ...new Set(
        [...this.preferencias.values()]
          .filter((fila) =>
            Object.values(TipoDeAviso).some((tipo) => minutoDe(fila, tipo) !== null),
          )
          .map((fila) => fila.zonaHoraria),
      ),
    ]);
  }

  aQuienLeToca(
    tipo: TipoDeAviso,
    zona: string,
    desde: number,
    hasta: number,
    dia: Dia,
  ): Promise<readonly UserId[]> {
    return Promise.resolve(
      [...this.preferencias.entries()]
        .filter(([, fila]) => {
          if (fila.zonaHoraria !== zona) {
            return false;
          }

          const minuto = minutoDe(fila, tipo);

          if (minuto === null || minuto < desde || minuto > hasta) {
            return false;
          }

          // La racha y la noche invitan a lo mismo: una sola por dia, la
          // primera que llegue.
          const hermano =
            tipo === TipoDeAviso.RACHA
              ? TipoDeAviso.NOCHE
              : tipo === TipoDeAviso.NOCHE
                ? TipoDeAviso.RACHA
                : undefined;

          return (
            sinRevisarHoy(ultimoDe(fila, tipo), dia) &&
            (hermano === undefined || sinRevisarHoy(ultimoDe(fila, hermano), dia))
          );
        })
        .map(([id]) => new UserId(id)),
    );
  }

  marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia): Promise<void> {
    const fila = this.preferencias.get(userId.value);

    if (fila !== undefined) {
      switch (tipo) {
        case TipoDeAviso.SEMAFORO:
          fila.ultimoAvisoSemaforo = dia;
          break;
        case TipoDeAviso.RACHA:
          fila.ultimoAvisoRacha = dia;
          break;
        case TipoDeAviso.MANANA:
          fila.ultimoAvisoManana = dia;
          break;
        case TipoDeAviso.NOCHE:
          fila.ultimoAvisoNoche = dia;
          break;
      }
    }

    return Promise.resolve();
  }
}
