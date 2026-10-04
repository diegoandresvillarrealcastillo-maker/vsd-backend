import type { Dia } from '../domain/model/Calendario.js';
import type { EntradaDeDiario } from '../domain/model/EntradaDeDiario.js';
import type { ClientOperationId, EntradaId, UserId } from '../domain/model/Identifier.js';
import { Cobertura, RecursoApoyo, TipoDeRecurso } from '../domain/model/RecursoApoyo.js';
import type { DiarioRepositoryPort } from '../domain/ports/out/DiarioRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../domain/ports/out/RecursoApoyoRepositoryPort.js';

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

  todasDe(userId: UserId): Promise<readonly EntradaDeDiario[]> {
    return Promise.resolve(this.de(userId));
  }

  entreDias(userId: UserId, desde: Dia, hasta: Dia): Promise<readonly EntradaDeDiario[]> {
    return Promise.resolve(
      this.de(userId)
        .filter((entrada) => entrada.dia >= desde && entrada.dia <= hasta)
        .sort(
          (una, otra) =>
            una.dia.localeCompare(otra.dia) || una.creadaEn.getTime() - otra.creadaEn.getTime(),
        ),
    );
  }

  porId(userId: UserId, id: EntradaId): Promise<EntradaDeDiario | null> {
    return Promise.resolve(this.de(userId).find((entrada) => entrada.id.equals(id)) ?? null);
  }

  porOperacion(userId: UserId, operacion: ClientOperationId): Promise<EntradaDeDiario | null> {
    return Promise.resolve(
      this.de(userId).find((entrada) => entrada.clientOperationId.equals(operacion)) ?? null,
    );
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

/**
 * Lineas de atencion de prueba, a proposito en desorden: la de Bogota antes
 * que la nacional. Asi se ve que quien las devuelve las ordena.
 */
export class LineasDePrueba implements RecursoApoyoRepositoryPort {
  consultas = 0;

  lineasDeAtencion(): Promise<readonly RecursoApoyo[]> {
    this.consultas += 1;

    return Promise.resolve([
      RecursoApoyo.create({
        id: 'linea-106',
        titulo: 'Línea 106',
        tipo: TipoDeRecurso.CONTACTO,
        cobertura: Cobertura.BOGOTA,
      }),
      RecursoApoyo.create({
        id: 'linea-192',
        titulo: 'Línea 192, opción 4',
        tipo: TipoDeRecurso.CONTACTO,
        cobertura: Cobertura.NACIONAL,
      }),
    ]);
  }

  porTema(): Promise<readonly RecursoApoyo[]> {
    return Promise.resolve([]);
  }
}
