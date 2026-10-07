import type { ActivityResult } from '../../model/ActivityResult.js';
import type { PreferenciasDeAviso } from '../../model/Aviso.js';
import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';
import type { UserId } from '../../model/Identifier.js';
import type { Pendiente } from '../../model/Pendiente.js';
import type { User } from '../../model/User.js';
import type { FotoLeida } from './FotoDePerfilUseCase.js';
import type { MascotaPropiaLeida } from './MascotaPropiaUseCase.js';

/** Todo lo que VSD Health guarda de una persona. */
export interface DatosExportados {
  readonly generadoEn: Date;
  readonly cuenta: User;
  readonly resultados: readonly ActivityResult[];
  readonly entradasDeDiario: readonly EntradaDeDiario[];
  /** Los del semaforo, hechos o no (SCRUM-97). */
  readonly pendientes: readonly Pendiente[];
  /**
   * A que hora quiere cada aviso, y en cuantos navegadores (SCRUM-102). Las
   * direcciones y claves de los navegadores no salen: sirven para mandarle
   * avisos a ese equipo, no para que la persona las lea.
   */
  readonly avisos: {
    readonly preferencias: PreferenciasDeAviso;
    readonly navegadores: number;
  };
  /** La foto de perfil, si tiene (SCRUM-120). Es un dato personal como cualquiera. */
  readonly foto: FotoLeida | null;
  /** La mascota propia, el SVG ya saneado, si tiene (SCRUM-122). */
  readonly mascotaPropia: MascotaPropiaLeida | null;
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
