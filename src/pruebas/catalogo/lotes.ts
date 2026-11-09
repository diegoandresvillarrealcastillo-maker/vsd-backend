import { CABECERA_DE_BIENESTAR, loteDeBienestar } from './bienestar/index.ts';
import { CABECERA_DE_BIENESTAR_365, loteDeBienestar365 } from './bienestar/365.ts';
import { CABECERA_DE_COGNICION, loteDeCognicion } from './cognicion/index.ts';
import { CABECERA_DE_COGNICION_365, loteDeCognicion365 } from './cognicion/365.ts';
import {
  CABECERA_DE_RAZONAMIENTO_LOGICO,
  loteDeRazonamientoLogico,
} from './cognicion/razonamientoLogico.ts';
import {
  CABECERA_DE_RETOS_COMPUESTOS_365,
  loteDeRetosCompuestos365,
} from './cognicion/retosCompuestos.ts';
import { CABECERA_DE_EMOCIONES, loteDeEmociones } from './emociones/index.ts';
import {
  CABECERA_DE_EMOCIONES_365,
  loteDeEmociones365,
} from './emociones/365.ts';
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
  return [
    { lote: loteDeCognicion(), cabecera: CABECERA_DE_COGNICION },
    { lote: loteDeCognicion365(), cabecera: CABECERA_DE_COGNICION_365 },
    { lote: loteDeRazonamientoLogico(), cabecera: CABECERA_DE_RAZONAMIENTO_LOGICO },
    { lote: loteDeRetosCompuestos365(), cabecera: CABECERA_DE_RETOS_COMPUESTOS_365 },
    { lote: loteDeBienestar(), cabecera: CABECERA_DE_BIENESTAR },
    { lote: loteDeBienestar365(), cabecera: CABECERA_DE_BIENESTAR_365 },
    { lote: loteDeEmociones(), cabecera: CABECERA_DE_EMOCIONES },
    { lote: loteDeEmociones365(), cabecera: CABECERA_DE_EMOCIONES_365 },
  ];
}

export function sqlDe(una: LoteConCabecera): string {
  return sqlDelLote(una.lote, una.cabecera);
}
