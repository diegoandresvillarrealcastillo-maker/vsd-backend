import type { Dia } from '../../model/Calendario.js';
import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';
import type { ClientOperationId, EntradaId, UserId } from '../../model/Identifier.js';

/** Una carta que espera ser leida. Sin su texto: solo lo que hace falta para ofrecerla. */
export interface CartaEnEspera {
  readonly id: EntradaId;
  readonly dia: Dia;
}

/**
 * Puerto de salida del diario.
 *
 * Todo se pide en nombre de una persona: no hay forma de leer ni de escribir
 * el diario de otra, ni siquiera conociendo el identificador de su anotacion.
 */
export interface DiarioRepositoryPort {
  /** Todas sus anotaciones, de la mas antigua a la mas reciente. Para la exportacion. */
  todasDe(userId: UserId): Promise<readonly EntradaDeDiario[]>;

  /** Las de un rango de dias, ambos incluidos, por dia y despues por hora. */
  entreDias(userId: UserId, desde: Dia, hasta: Dia): Promise<readonly EntradaDeDiario[]>;

  porId(userId: UserId, id: EntradaId): Promise<EntradaDeDiario | null>;

  /** La anotacion que ya dejo una operacion, si la hubo: es lo que hace seguro reintentar. */
  porOperacion(
    userId: UserId,
    clientOperationId: ClientOperationId,
  ): Promise<EntradaDeDiario | null>;

  /**
   * Guarda una anotacion nueva y devuelve lo guardado.
   *
   * Lo guardado y no lo recibido: la hora de creacion la pone la base, y es
   * de ella de donde se cuenta la hora para editar.
   */
  guardarNueva(entrada: EntradaDeDiario): Promise<EntradaDeDiario>;

  /**
   * Guarda una edicion, solo si la anotacion sigue en `versionAnterior` y
   * dentro de su hora para editar.
   *
   * Devuelve `null` si no se guardo. No dice por que: quien llama vuelve a
   * leer la anotacion y lo averigua. La base tiene la ultima palabra sobre la
   * hora, y por eso esto no puede decidirse antes de intentarlo.
   */
  guardarEdicion(
    editada: EntradaDeDiario,
    versionAnterior: number,
  ): Promise<EntradaDeDiario | null>;

  /**
   * Borra una anotacion propia, la lea o no. No dice si existia: una que ya no esta, o que es de otra
   * persona, se trata igual, para que se pueda reintentar sin que cambie nada (SCRUM-230). Tampoco
   * deja el texto en ningun otro sitio: la fila era lo unico que lo guardaba.
   */
  borrar(userId: UserId, id: EntradaId): Promise<void>;

  /**
   * Las cartas de un rango de dias que todavia no se abrieron, la mas reciente primero y **sin
   * su texto**. Lo que necesita la tarjeta para ofrecerlas y nada mas.
   */
  cartasEnEspera(userId: UserId, desde: Dia, hasta: Dia): Promise<readonly CartaEnEspera[]>;

  /**
   * Marca la carta como abierta en `cuando` y devuelve la anotacion. Si ya estaba abierta no cambia
   * la hora de la primera vez. Devuelve `null` si no existe, es de otra persona o no es una carta.
   */
  abrirCarta(userId: UserId, id: EntradaId, cuando: Date): Promise<EntradaDeDiario | null>;
}
