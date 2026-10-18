import { CABECERA_DE_COGNICION, loteDeCognicion } from './cognicion/index.ts';
import { sqlDelLote } from './sql.ts';
import type { Lote } from './tipos.ts';

/**
 * Los lotes de contenido del catalogo y su SQL (SCRUM-222 a SCRUM-224).
 *
 * Lo comparten el generador (`generar.ts`, que escribe las migraciones) y la prueba (`catalogo.spec.ts`,
 * que comprueba que lo escrito es lo que el generador produce y que cada sesion cumple el contrato).
 */
export interface LoteConCabecera {
  readonly lote: Lote;
  readonly cabecera: string;
}

export function todosLosLotes(): readonly LoteConCabecera[] {
  return [{ lote: loteDeCognicion(), cabecera: CABECERA_DE_COGNICION }];
}

export function sqlDe(una: LoteConCabecera): string {
  return sqlDelLote(una.lote, una.cabecera);
}
