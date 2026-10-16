import type { ActivityResult } from '../../model/ActivityResult.js';
import type { PreferenciasDeAviso } from '../../model/Aviso.js';
import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';
import type { UserId } from '../../model/Identifier.js';
import type { Pendiente } from '../../model/Pendiente.js';
import type { Dia } from '../../model/Calendario.js';
import type { ConsentimientoAceptado, User } from '../../model/User.js';
import type { FotoLeida } from './FotoDePerfilUseCase.js';
import type { MascotaPropiaLeida } from './MascotaPropiaUseCase.js';

/** Todo lo que VSD Health guarda de una persona. */
export interface DatosExportados {
  readonly generadoEn: Date;
  readonly cuenta: User;
  /**
   * Todo lo que acepto alguna vez, version por version (L-05 de la auditoria
   * 360). La cuenta dice lo vigente; aqui esta tambien lo anterior.
   */
  readonly consentimientos: readonly ConsentimientoAceptado[];
  readonly resultados: readonly ActivityResult[];
  /**
   * El titulo de cada sesion que hizo, por el identificador de la sesion (SCRUM-205, ADR 0030). Es lo
   * unico de la sesion que sale: ni su identificador ni sus parametros, que son contenido de todos y
   * no le dicen nada a la persona. Vacio si no hizo ninguna.
   */
  readonly titulosDeSesiones: ReadonlyMap<string, string>;
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
  /**
   * El ultimo dato curioso que se le dio y el dia (SCRUM-185). El cursor lleva su identificador
   * y es un dato personal como cualquiera; `null` si todavia no se le ha dado ninguno o si el
   * dato se borro del catalogo.
   */
  readonly datoCurioso: { readonly dia: Dia; readonly texto: string } | null;
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
