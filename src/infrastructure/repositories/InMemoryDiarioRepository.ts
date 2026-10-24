import type { Dia } from '../../domain/model/Calendario.js';
import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import type { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import type {
  CartaEnEspera,
  DiarioRepositoryPort,
} from '../../domain/ports/out/DiarioRepositoryPort.js';

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

  todasDe(userId: UserId): Promise<readonly EntradaDeDiario[]> {
    return Promise.resolve(
      [...this.de(userId)].sort((una, otra) => una.creadaEn.getTime() - otra.creadaEn.getTime()),
    );
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

  porOperacion(
    userId: UserId,
    clientOperationId: ClientOperationId,
  ): Promise<EntradaDeDiario | null> {
    return Promise.resolve(
      this.de(userId).find((entrada) => entrada.clientOperationId.equals(clientOperationId)) ??
        null,
    );
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

  borrar(userId: UserId, id: EntradaId): Promise<void> {
    this.porPersona.set(
      userId.value,
      this.de(userId).filter((entrada) => !entrada.id.equals(id)),
    );

    return Promise.resolve();
  }

  cartasEnEspera(userId: UserId, desde: Dia, hasta: Dia): Promise<readonly CartaEnEspera[]> {
    return Promise.resolve(
      this.de(userId)
        .filter(
          (entrada) =>
            entrada.cartaAManana &&
            entrada.cartaAbiertaEn === undefined &&
            entrada.dia >= desde &&
            entrada.dia <= hasta,
        )
        .sort((una, otra) => otra.dia.localeCompare(una.dia))
        .map((entrada) => ({ id: entrada.id, dia: entrada.dia })),
    );
  }

  abrirCarta(userId: UserId, id: EntradaId, cuando: Date): Promise<EntradaDeDiario | null> {
    const actual = this.de(userId).find((entrada) => entrada.id.equals(id));

    if (actual === undefined || !actual.cartaAManana) {
      return Promise.resolve(null);
    }

    const abierta = actual.cartaAbiertaEn === undefined ? actual.abierta(cuando) : actual;

    this.porPersona.set(
      userId.value,
      this.de(userId).map((entrada) => (entrada === actual ? abierta : entrada)),
    );

    return Promise.resolve(abierta);
  }

  /** Solo para pruebas: deja una anotacion tal cual, sin pasar por las reglas. */
  agregar(entrada: EntradaDeDiario): void {
    this.porPersona.set(entrada.userId.value, [...this.de(entrada.userId), entrada]);
  }

  private de(userId: UserId): readonly EntradaDeDiario[] {
    return this.porPersona.get(userId.value) ?? [];
  }
}
