import type { ActivityResult } from '../../model/ActivityResult.js';
import type { ClientOperationId, UserId } from '../../model/Identifier.js';

/**
 * Puerto de salida: lo que el dominio necesita del mundo para poder cumplir
 * sus reglas.
 *
 * Es una interfaz, no una implementacion. El dominio declara que necesita
 * guardar y recuperar resultados, y no le importa si al otro lado hay
 * PostgreSQL, memoria o un archivo. Quien lo implementa vive en
 * infrastructure/repositories/.
 *
 * Esta inversion es lo que permite probar la logica sin levantar una base de
 * datos, y cambiar de proveedor de persistencia tocando un adaptador en lugar
 * del nucleo del sistema.
 */
export interface ActivityResultRepositoryPort {
  /**
   * Busca, **entre los resultados de esa persona**, el asociado a un
   * identificador de operacion del cliente.
   *
   * Es la consulta que sostiene la idempotencia de la sincronizacion: antes
   * de crear un resultado hay que saber si esa misma operacion ya se
   * registro. Devuelve `null` si no existe.
   *
   * El identificador de la persona forma parte de la pregunta, no es un
   * filtro que se anade despues. Una firma que no lo pidiera dejaria a cada
   * implementacion la decision de acordarse de filtrar, y esa es exactamente
   * la clase de olvido que termina mostrando datos ajenos. Aqui no hay nada
   * que olvidar: sin persona no se puede ni llamar al metodo.
   */
  findByClientOperationId(
    clientOperationId: ClientOperationId,
    userId: UserId,
  ): Promise<ActivityResult | null>;

  /** Guarda un resultado nuevo. */
  save(result: ActivityResult): Promise<void>;

  /**
   * Los resultados de esa persona desde una fecha, del mas reciente al mas
   * antiguo.
   *
   * Es lo que permite al asistente decir algo cierto en lugar de algo bonito.
   * "Llevas tres semanas registrando tu descanso" sale de contar filas; si
   * saliera de otro sitio seria una frase amable e inventada, y a la tercera
   * vez que no cuadre con lo que la persona recuerda, deja de creerse el resto.
   */
  ultimosDe(userId: UserId, desde: Date): Promise<readonly ActivityResult[]>;
}
