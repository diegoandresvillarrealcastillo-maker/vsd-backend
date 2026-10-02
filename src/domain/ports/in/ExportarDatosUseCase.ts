import type { ActivityResult } from '../../model/ActivityResult.js';
import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';
import type { UserId } from '../../model/Identifier.js';
import type { User } from '../../model/User.js';

/** Todo lo que VSD Health guarda de una persona. */
export interface DatosExportados {
  readonly generadoEn: Date;
  readonly cuenta: User;
  readonly resultados: readonly ActivityResult[];
  readonly entradasDeDiario: readonly EntradaDeDiario[];
}

/**
 * Puerto de entrada: exportar los datos propios.
 *
 * Es el derecho de acceso de la Ley 1581 de 2012, y la otra mitad de lo que
 * promete `docs/seguridad.md`: poder llevarse la informacion, no solo
 * borrarla.
 */
export interface ExportarDatosUseCase {
  execute(cuenta: UserId): Promise<DatosExportados>;
}
