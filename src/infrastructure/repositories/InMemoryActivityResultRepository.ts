import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import type { ClientOperationId, UserId } from '../../domain/model/Identifier.js';
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

  save(result: ActivityResult): Promise<void> {
    this.porOperacion.set(this.clave(result.clientOperationId, result.userId), result);

    return Promise.resolve();
  }

  private clave(clientOperationId: ClientOperationId, userId: UserId): string {
    return `${userId.value}/${clientOperationId.value}`;
  }

  /** Numero de resultados guardados. Solo para pruebas. */
  get cantidad(): number {
    return this.porOperacion.size;
  }
}
