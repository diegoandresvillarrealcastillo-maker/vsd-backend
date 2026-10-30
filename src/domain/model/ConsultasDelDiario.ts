import type { Dia } from './Calendario.js';
import type { EntradaDeDiario } from './EntradaDeDiario.js';
import type { ClientOperationId, EntradaId } from './Identifier.js';

/**
 * Las consultas del puerto del diario sobre una lista que ya esta en memoria.
 *
 * Las comparten el adaptador en memoria (`infrastructure/`) y el doble de prueba de los casos de
 * uso (`pruebas/`), que no pueden depender uno del otro: `application/` no ve `infrastructure/`.
 * El adaptador de PostgreSQL resuelve lo mismo con SQL.
 */

/** Las anotaciones de los dias `desde` a `hasta`, por dia y, dentro del dia, de la mas antigua. */
export function entradasEntreDias(
  entradas: readonly EntradaDeDiario[],
  desde: Dia,
  hasta: Dia,
): EntradaDeDiario[] {
  return entradas
    .filter((entrada) => entrada.dia >= desde && entrada.dia <= hasta)
    .sort(
      (una, otra) =>
        una.dia.localeCompare(otra.dia) || una.creadaEn.getTime() - otra.creadaEn.getTime(),
    );
}

/** La anotacion con ese identificador, o `null`. */
export function entradaConId(
  entradas: readonly EntradaDeDiario[],
  id: EntradaId,
): EntradaDeDiario | null {
  return entradas.find((entrada) => entrada.id.equals(id)) ?? null;
}

/** La anotacion que nacio de esa operacion del dispositivo, o `null`. */
export function entradaDeLaOperacion(
  entradas: readonly EntradaDeDiario[],
  operacion: ClientOperationId,
): EntradaDeDiario | null {
  return entradas.find((entrada) => entrada.clientOperationId.equals(operacion)) ?? null;
}
