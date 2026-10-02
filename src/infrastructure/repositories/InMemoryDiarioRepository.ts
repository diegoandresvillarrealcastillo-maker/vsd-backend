import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';

/**
 * Diario en memoria, para el arranque sin base de datos y para las pruebas.
 *
 * Hasta SCRUM-95 no hay forma de escribir entradas por la API, asi que en
 * memoria siempre esta vacio salvo que una prueba lo siembre con `agregar`.
 */
export class InMemoryDiarioRepository implements DiarioRepositoryPort {
  private readonly porPersona = new Map<string, EntradaDeDiario[]>();

  todasDe(userId: UserId): Promise<readonly EntradaDeDiario[]> {
    return Promise.resolve([...(this.porPersona.get(userId.value) ?? [])]);
  }

  /** Solo para pruebas. */
  agregar(userId: UserId, entrada: EntradaDeDiario): void {
    this.porPersona.set(userId.value, [...(this.porPersona.get(userId.value) ?? []), entrada]);
  }
}
