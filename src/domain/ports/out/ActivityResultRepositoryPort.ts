import type { ActivityResult } from '../../model/ActivityResult';
import type { ClientOperationId } from '../../model/Identifier';

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
   * Busca el resultado asociado a un identificador de operacion del cliente.
   *
   * Es la consulta que sostiene la idempotencia de la sincronizacion: antes
   * de crear un resultado hay que saber si esa misma operacion ya se
   * registro. Devuelve `null` si no existe.
   */
  findByClientOperationId(clientOperationId: ClientOperationId): Promise<ActivityResult | null>;

  /** Guarda un resultado nuevo. */
  save(result: ActivityResult): Promise<void>;
}
