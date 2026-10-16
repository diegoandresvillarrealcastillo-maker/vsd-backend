import { claveDeLaSesion } from '../../domain/model/ClaveEstable.js';
import type { Dia } from '../../domain/model/Calendario.js';
import type { ActivityId, SesionId, UserId } from '../../domain/model/Identifier.js';
import type { SesionDeActividad } from '../../domain/model/SesionDeActividad.js';
import {
  type CandidataDeSesion,
  type HechoDeSesion,
  elegirSesionDeHoy,
} from '../../domain/model/SesionDelDia.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';

/** Desde cuando se mira lo que la persona hizo: desde siempre. */
const DESDE_EL_PRINCIPIO = new Date(0);

/**
 * Las sesiones en memoria (SCRUM-205, ADR 0030).
 *
 * Aplica `elegirSesionDeHoy` tal cual, con el orden de `claveDeLaSesion`. Lo que la persona hizo lo lee
 * del repositorio de resultados, que es la unica verdad: aqui no hay un cursor.
 *
 * Sin `DATABASE_URL` el contenido esta vacio, asi que el sendero sale como siempre. No sustituye a las
 * pruebas contra PostgreSQL: la consulta real la hace el otro adaptador, y una prueba compara las dos
 * reglas.
 */
export class InMemorySesionesRepository implements SesionesRepositoryPort {
  private readonly sesiones = new Map<string, SesionDeActividad>();

  constructor(
    private readonly resultados: ActivityResultRepositoryPort,
    sesiones: readonly SesionDeActividad[] = [],
  ) {
    this.agregar(...sesiones);
  }

  /** Suma contenido. Una sesion con el mismo identificador reemplaza a la anterior. */
  agregar(...nuevas: readonly SesionDeActividad[]): void {
    for (const sesion of nuevas) {
      this.sesiones.set(sesion.id.value, sesion);
    }
  }

  porId(id: SesionId): Promise<SesionDeActividad | null> {
    return Promise.resolve(this.sesiones.get(id.value) ?? null);
  }

  async mecanicasConSesion(
    userId: UserId,
    actividades: readonly ActivityId[],
    hoy: Dia,
  ): Promise<ReadonlySet<string>> {
    // Tiene algo que ofrecer exactamente cuando `elegirSesionDeHoy` encuentra una.
    return new Set((await this.sesionesDeHoy(userId, actividades, hoy)).keys());
  }

  async sesionesDeHoy(
    userId: UserId,
    actividades: readonly ActivityId[],
    hoy: Dia,
  ): Promise<ReadonlyMap<string, SesionDeActividad>> {
    if (actividades.length === 0) {
      return new Map();
    }

    const hechos = await this.hechosDe(userId);
    const elegidas = new Map<string, SesionDeActividad>();

    for (const actividad of actividades) {
      const candidatas: CandidataDeSesion[] = [...this.sesiones.values()]
        .filter((sesion) => sesion.idActividad.value === actividad.value)
        .map((sesion) => ({ sesion, clave: claveDeLaSesion(sesion.id.value, userId.value) }));
      const elegida = elegirSesionDeHoy(candidatas, hechos, hoy);

      if (elegida !== null) {
        elegidas.set(actividad.value, elegida);
      }
    }

    return elegidas;
  }

  titulosDe(ids: readonly SesionId[]): Promise<ReadonlyMap<string, string>> {
    const titulos = new Map<string, string>();

    for (const id of ids) {
      const sesion = this.sesiones.get(id.value);

      if (sesion !== undefined) {
        titulos.set(id.value, sesion.titulo);
      }
    }

    return Promise.resolve(titulos);
  }

  /** Lo que la persona hizo de cualquier sesion; `elegirSesionDeHoy` ignora lo que no es de la mecanica. */
  private async hechosDe(userId: UserId): Promise<readonly HechoDeSesion[]> {
    const resultados = await this.resultados.ultimosDe(userId, DESDE_EL_PRINCIPIO);

    return resultados.flatMap((resultado) =>
      resultado.sessionId === undefined
        ? []
        : [
            {
              idSesion: resultado.sessionId.value,
              dia: resultado.dia,
              hechaEn: resultado.completedAt,
            },
          ],
    );
  }
}
