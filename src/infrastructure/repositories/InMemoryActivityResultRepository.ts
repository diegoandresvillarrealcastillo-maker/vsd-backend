import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import type { Dia } from '../../domain/model/Calendario.js';
import type { FilaDelHistorial, PuntoDeLaPagina } from '../../domain/model/HistorialDelModulo.js';
import type { ActivityId, ClientOperationId, UserId } from '../../domain/model/Identifier.js';
import { NivelOrientativo } from '../../domain/model/OrientativeScore.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';

/**
 * Adaptador de persistencia en memoria.
 *
 * Implementa el puerto de salida guardando en un Map. Sirve para probar la
 * capa de aplicacion sin levantar una base de datos, y para demostrar el
 * punto de la arquitectura: el caso de uso funciona igual contra memoria que
 * contra PostgreSQL, sin cambiar una linea del dominio.
 *
 * En el Ciclo 4 aparecera junto a este un adaptador de Prisma. Los dos
 * implementaran la misma interfaz y el caso de uso no se entera de cual esta
 * usando.
 *
 * Aviso: no sustituye a las pruebas de integracion. Un Map no tiene
 * restricciones UNIQUE, ni transacciones, ni concurrencia real. La garantia
 * de que no haya duplicados en produccion la da la restriccion UNIQUE sobre
 * (id_usuario, id_operacion_cliente) en la base de datos, no este adaptador.
 */
export class InMemoryActivityResultRepository implements ActivityResultRepositoryPort {
  /**
   * La clave incluye a la persona, igual que el indice UNIQUE de la base.
   *
   * Si aqui la clave fuera solo la operacion, este adaptador se comportaria
   * distinto que PostgreSQL ante el mismo caso, y las pruebas que lo usan
   * pasarian describiendo un sistema que no existe.
   */
  private readonly porOperacion = new Map<string, ActivityResult>();

  findByClientOperationId(
    clientOperationId: ClientOperationId,
    userId: UserId,
  ): Promise<ActivityResult | null> {
    // El puerto es asincrono porque el adaptador real hablara con PostgreSQL.
    // Aqui no hay nada que esperar, asi que se devuelve una promesa resuelta
    // en lugar de declarar el metodo async sin usar await.
    return Promise.resolve(this.porOperacion.get(this.clave(clientOperationId, userId)) ?? null);
  }

  save(result: ActivityResult): Promise<ActivityResult> {
    const clave = this.clave(result.clientOperationId, result.userId);
    const ganadora = this.porOperacion.get(clave);

    // Como la clave unica de la base: si la operacion de esa persona ya estaba, gana la que estaba.
    if (ganadora !== undefined) {
      return Promise.resolve(ganadora);
    }

    this.porOperacion.set(clave, result);

    return Promise.resolve(result);
  }

  ultimosDe(userId: UserId, desde: Date): Promise<readonly ActivityResult[]> {
    const suyos = [...this.porOperacion.values()]
      .filter((resultado) => resultado.perteneceA(userId) && resultado.completedAt >= desde)
      .sort((uno, otro) => otro.completedAt.getTime() - uno.completedAt.getTime());

    return Promise.resolve(suyos);
  }

  hayActividadDesde(userId: UserId, desde: Date): Promise<boolean> {
    return Promise.resolve(
      [...this.porOperacion.values()].some(
        (resultado) => resultado.perteneceA(userId) && resultado.completedAt >= desde,
      ),
    );
  }

  diasConActividad(userId: UserId): Promise<readonly Dia[]> {
    const dias = new Set(
      [...this.porOperacion.values()]
        .filter((resultado) => resultado.perteneceA(userId))
        .map((resultado) => resultado.dia),
    );

    // AAAA-MM-DD: el orden de texto es el del calendario.
    return Promise.resolve([...dias].sort());
  }

  diasConAtencion(userId: UserId, actividades: readonly ActivityId[]): Promise<readonly Dia[]> {
    const cuentan = new Set(actividades.map((actividad) => actividad.value));
    const dias = new Set(
      [...this.porOperacion.values()]
        .filter(
          (resultado) =>
            resultado.perteneceA(userId) &&
            cuentan.has(resultado.activityId.value) &&
            resultado.score?.level === NivelOrientativo.REQUIERE_ATENCION,
        )
        .map((resultado) => resultado.dia),
    );

    return Promise.resolve([...dias].sort());
  }

  historialDe(
    userId: UserId,
    actividades: readonly ActivityId[],
    pagina: { readonly limite: number; readonly despuesDe?: PuntoDeLaPagina | undefined },
  ): Promise<readonly FilaDelHistorial[]> {
    const pedidas = new Set(actividades.map((actividad) => actividad.value));
    const { despuesDe } = pagina;

    const filas = [...this.porOperacion.values()]
      .filter(
        (resultado) => resultado.perteneceA(userId) && pedidas.has(resultado.activityId.value),
      )
      .map((resultado): FilaDelHistorial => ({
        id: resultado.id.value,
        idActividad: resultado.activityId.value,
        dia: resultado.dia,
        hechaEn: resultado.completedAt,
      }))
      // Del mas reciente al mas antiguo y, a igual hora, por identificador: el mismo orden
      // total que usa la base, para que el cursor no repita ni salte nada.
      .sort(
        (uno, otro) =>
          otro.hechaEn.getTime() - uno.hechaEn.getTime() ||
          (otro.id < uno.id ? -1 : otro.id > uno.id ? 1 : 0),
      )
      .filter((fila) => {
        if (despuesDe === undefined) {
          return true;
        }

        const lugar = fila.hechaEn.getTime() - despuesDe.hechaEn.getTime();

        return lugar < 0 || (lugar === 0 && fila.id < despuesDe.id);
      })
      .slice(0, pagina.limite);

    return Promise.resolve(filas);
  }

  private clave(clientOperationId: ClientOperationId, userId: UserId): string {
    return `${userId.value}/${clientOperationId.value}`;
  }

  /** Numero de resultados guardados. Solo para pruebas. */
  get cantidad(): number {
    return this.porOperacion.size;
  }
}
