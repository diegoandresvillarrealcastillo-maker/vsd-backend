import type { Dia } from '../../domain/model/Calendario.js';
import {
  entradaConId,
  entradaDeLaOperacion,
  entradasEntreDias,
} from '../../domain/model/ConsultasDelDiario.js';
import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import type { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import { FILAS_POR_PAGINA } from '../../domain/ports/out/LecturaPorPaginas.js';

/**
 * Diario en memoria, para el arranque sin base de datos y para las pruebas.
 *
 * La hora para editar y las cotas de la hora del dispositivo (nunca en el
 * futuro, nunca de hace mas de 30 dias) las hace cumplir PostgreSQL. Aqui no hay
 * base, asi que solo las comprueba el dominio antes de llegar, que es suficiente
 * para un arranque local. Las pruebas de la regla de verdad van contra la base.
 */
export class InMemoryDiarioRepository implements DiarioRepositoryPort {
  private readonly porPersona = new Map<string, EntradaDeDiario[]>();

  async *paginasDeEntradas(
    userId: UserId,
  ): AsyncGenerator<readonly EntradaDeDiario[], void, undefined> {
    // De la mas antigua a la mas reciente y, a igual hora, por identificador: el orden de PostgreSQL.
    const todas = [...this.de(userId)].sort(
      (una, otra) =>
        una.creadaEn.getTime() - otra.creadaEn.getTime() ||
        Number(una.id.value > otra.id.value) - Number(una.id.value < otra.id.value),
    );

    for (let inicio = 0; inicio < todas.length; inicio += FILAS_POR_PAGINA) {
      yield await Promise.resolve(todas.slice(inicio, inicio + FILAS_POR_PAGINA));
    }
  }

  entreDias(userId: UserId, desde: Dia, hasta: Dia): Promise<readonly EntradaDeDiario[]> {
    return Promise.resolve(entradasEntreDias(this.de(userId), desde, hasta));
  }

  porId(userId: UserId, id: EntradaId): Promise<EntradaDeDiario | null> {
    return Promise.resolve(entradaConId(this.de(userId), id));
  }

  porOperacion(
    userId: UserId,
    clientOperationId: ClientOperationId,
  ): Promise<EntradaDeDiario | null> {
    return Promise.resolve(entradaDeLaOperacion(this.de(userId), clientOperationId));
  }

  async guardarNueva(entrada: EntradaDeDiario): Promise<EntradaDeDiario> {
    const existente = await this.porOperacion(entrada.userId, entrada.clientOperationId);

    if (existente !== null) {
      return existente;
    }

    this.porPersona.set(entrada.userId.value, [...this.de(entrada.userId), entrada]);

    return entrada;
  }

  guardarEdicion(
    editada: EntradaDeDiario,
    versionAnterior: number,
  ): Promise<EntradaDeDiario | null> {
    const entradas = this.de(editada.userId);
    const posicion = entradas.findIndex(
      (entrada) => entrada.id.equals(editada.id) && entrada.version === versionAnterior,
    );

    if (posicion === -1) {
      return Promise.resolve(null);
    }

    this.porPersona.set(
      editada.userId.value,
      entradas.map((entrada, i) => (i === posicion ? editada : entrada)),
    );

    return Promise.resolve(editada);
  }

  /** Solo para pruebas: deja una anotacion tal cual, sin pasar por las reglas. */
  agregar(entrada: EntradaDeDiario): void {
    this.porPersona.set(entrada.userId.value, [...this.de(entrada.userId), entrada]);
  }

  private de(userId: UserId): readonly EntradaDeDiario[] {
    return this.porPersona.get(userId.value) ?? [];
  }
}
