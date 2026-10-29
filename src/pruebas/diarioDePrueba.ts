import type { Dia } from '../domain/model/Calendario.js';
import {
  entradaConId,
  entradaDeLaOperacion,
  entradasEntreDias,
} from '../domain/model/ConsultasDelDiario.js';
import type { EntradaDeDiario } from '../domain/model/EntradaDeDiario.js';
import type { ClientOperationId, EntradaId, UserId } from '../domain/model/Identifier.js';
import type { DiarioRepositoryPort } from '../domain/ports/out/DiarioRepositoryPort.js';

/**
 * Lo que comparten las pruebas del diario (SCRUM-95).
 */

/**
 * Un diario de prueba sobre el puerto, para los casos de uso.
 *
 * No es el adaptador en memoria de `infrastructure/`: las pruebas de
 * `application/` no pueden depender de esa capa. Hace lo justo: guarda,
 * busca, y en la edicion respeta la version, que es lo que la base garantiza
 * con su WHERE.
 */
export class DiarioDePrueba implements DiarioRepositoryPort {
  private entradas: EntradaDeDiario[] = [];

  // Una sola pagina: el doble no necesita paginar, y asi los casos de uso no dependen de ello.
  async *paginasDeEntradas(
    userId: UserId,
  ): AsyncGenerator<readonly EntradaDeDiario[], void, undefined> {
    const todas = this.de(userId);

    if (todas.length > 0) {
      yield await Promise.resolve(todas);
    }
  }

  entreDias(userId: UserId, desde: Dia, hasta: Dia): Promise<readonly EntradaDeDiario[]> {
    return Promise.resolve(entradasEntreDias(this.de(userId), desde, hasta));
  }

  porId(userId: UserId, id: EntradaId): Promise<EntradaDeDiario | null> {
    return Promise.resolve(entradaConId(this.de(userId), id));
  }

  porOperacion(userId: UserId, operacion: ClientOperationId): Promise<EntradaDeDiario | null> {
    return Promise.resolve(entradaDeLaOperacion(this.de(userId), operacion));
  }

  guardarNueva(entrada: EntradaDeDiario): Promise<EntradaDeDiario> {
    this.entradas.push(entrada);

    return Promise.resolve(entrada);
  }

  guardarEdicion(
    editada: EntradaDeDiario,
    versionAnterior: number,
  ): Promise<EntradaDeDiario | null> {
    const actual = this.entradas.find(
      (entrada) => entrada.id.equals(editada.id) && entrada.version === versionAnterior,
    );

    if (actual === undefined) {
      return Promise.resolve(null);
    }

    this.entradas = this.entradas.map((entrada) => (entrada === actual ? editada : entrada));

    return Promise.resolve(editada);
  }

  /** Deja una anotacion tal cual, sin pasar por las reglas. */
  agregar(entrada: EntradaDeDiario): void {
    this.entradas.push(entrada);
  }

  private de(userId: UserId): EntradaDeDiario[] {
    return this.entradas.filter((entrada) => entrada.perteneceA(userId));
  }
}

/** Un documento del editor con un parrafo por cada texto. */
export function documentoCon(...parrafos: string[]): Record<string, unknown> {
  return {
    type: 'doc',
    content: parrafos.map((texto) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: texto }],
    })),
  };
}
