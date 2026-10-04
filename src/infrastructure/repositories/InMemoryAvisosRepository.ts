import type { PreferenciasDeAviso, SuscripcionPush } from '../../domain/model/Aviso.js';
import { TipoDeAviso } from '../../domain/model/Aviso.js';
import type { Dia } from '../../domain/model/Calendario.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';

interface Fila {
  minutoSemaforo: number | null;
  minutoRacha: number | null;
  ultimoAvisoSemaforo: Dia | null;
  ultimoAvisoRacha: Dia | null;
}

/**
 * Los avisos en memoria, para desarrollo sin base de datos y para las
 * pruebas. Se comporta como el de PostgreSQL: un navegador entrega los avisos
 * de una sola persona.
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
    });
  }

  guardarPreferencias(preferencias: PreferenciasDeAviso): Promise<PreferenciasDeAviso> {
    const actual = this.preferencias.get(preferencias.userId.value);

    this.preferencias.set(preferencias.userId.value, {
      ultimoAvisoSemaforo: actual?.ultimoAvisoSemaforo ?? null,
      ultimoAvisoRacha: actual?.ultimoAvisoRacha ?? null,
      minutoSemaforo: preferencias.minutoSemaforo,
      minutoRacha: preferencias.minutoRacha,
    });

    return Promise.resolve(preferencias);
  }

  suscribir(userId: UserId, suscripcion: SuscripcionPush): Promise<void> {
    this.suscripciones.set(suscripcion.endpoint, { userId: userId.value, suscripcion });

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

  aQuienLeToca(
    tipo: TipoDeAviso,
    desde: number,
    hasta: number,
    dia: Dia,
  ): Promise<readonly UserId[]> {
    return Promise.resolve(
      [...this.preferencias.entries()]
        .filter(([, fila]) => {
          const minuto = tipo === TipoDeAviso.SEMAFORO ? fila.minutoSemaforo : fila.minutoRacha;
          const ultimo =
            tipo === TipoDeAviso.SEMAFORO ? fila.ultimoAvisoSemaforo : fila.ultimoAvisoRacha;

          return (
            minuto !== null &&
            minuto >= desde &&
            minuto <= hasta &&
            (ultimo === null || ultimo < dia)
          );
        })
        .map(([id]) => new UserId(id)),
    );
  }

  marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia): Promise<void> {
    const fila = this.preferencias.get(userId.value);

    if (fila !== undefined) {
      if (tipo === TipoDeAviso.SEMAFORO) {
        fila.ultimoAvisoSemaforo = dia;
      } else {
        fila.ultimoAvisoRacha = dia;
      }
    }

    return Promise.resolve();
  }
}
