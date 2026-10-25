import type { ActivityResult } from '../../model/ActivityResult.js';
import type { PreferenciasDeAviso } from '../../model/Aviso.js';
import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';
import type { UserId } from '../../model/Identifier.js';
import type { Pendiente } from '../../model/Pendiente.js';
import type { Dia } from '../../model/Calendario.js';
import type { ConsentimientoAceptado, User } from '../../model/User.js';
import type { FotoLeida } from './FotoDePerfilUseCase.js';
import type { MascotaPropiaLeida } from './MascotaPropiaUseCase.js';

/** Un resultado de la exportacion, con el titulo de la sesion que hizo si la actividad las tiene. */
export interface ResultadoExportado {
  readonly resultado: ActivityResult;
  /**
   * El titulo de la sesion que hizo (SCRUM-205, ADR 0030). Es lo unico de la sesion que sale: ni su
   * identificador ni sus parametros, que son contenido de todos y no le dicen nada a la persona.
   * Ausente si no hizo ninguna o si la sesion ya no existe.
   */
  readonly titulo?: string | undefined;
}

/**
 * Todo lo que VSD Health guarda de una persona.
 *
 * Lo que crece con los anos de uso (resultados, diario, pendientes) no viene en listas sino en
 * flujos que se leen **por paginas y se consumen una sola vez, en orden** (SCRUM-262): quien
 * escribe la respuesta los recorre y los suelta, sin tenerlos todos en memoria. Lo demas (la cuenta,
 * las aceptaciones, los avisos, los dos archivos) tiene un tamano acotado y viene ya leido.
 */
export interface DatosExportados {
  readonly generadoEn: Date;
  readonly cuenta: User;
  /**
   * Todo lo que acepto alguna vez, version por version (L-05 de la auditoria
   * 360). La cuenta dice lo vigente; aqui esta tambien lo anterior.
   */
  readonly consentimientos: readonly ConsentimientoAceptado[];
  /** Del mas reciente al mas antiguo. */
  readonly resultados: AsyncIterable<ResultadoExportado>;
  /** De la mas antigua a la mas reciente. */
  readonly entradasDeDiario: AsyncIterable<EntradaDeDiario>;
  /** Los del semaforo, hechos o no (SCRUM-97), del mas antiguo al mas reciente. */
  readonly pendientes: AsyncIterable<Pendiente>;
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
