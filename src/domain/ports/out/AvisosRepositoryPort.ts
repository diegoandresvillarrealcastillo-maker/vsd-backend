import type { PreferenciasDeAviso, SuscripcionPush, TipoDeAviso } from '../../model/Aviso.js';
import type { Dia } from '../../model/Calendario.js';
import type { UserId } from '../../model/Identifier.js';

/**
 * Donde se guardan las horas de los avisos y los navegadores suscritos
 * (SCRUM-102).
 */
export interface AvisosRepositoryPort {
  /** Sin nada guardado, los dos avisos apagados. */
  preferenciasDe(userId: UserId): Promise<PreferenciasDeAviso>;

  guardarPreferencias(preferencias: PreferenciasDeAviso): Promise<PreferenciasDeAviso>;

  /**
   * Este navegador entrega desde ahora los avisos de esta persona. Si
   * entregaba los de otra, deja de hacerlo: un navegador es de una sola.
   */
  suscribir(userId: UserId, suscripcion: SuscripcionPush): Promise<void>;

  desuscribir(userId: UserId, endpoint: string): Promise<void>;

  suscripcionesDe(userId: UserId): Promise<readonly SuscripcionPush[]>;

  /**
   * A quien le toca un aviso: su hora cae entre `desde` y `hasta` (minutos
   * del dia, ambos incluidos) y ese aviso todavia no se reviso `dia`.
   *
   * Es lo unico que se mira de todos a la vez, y devuelve solo
   * identificadores. Lo demas se lee en nombre de cada persona.
   */
  aQuienLeToca(
    tipo: TipoDeAviso,
    desde: number,
    hasta: number,
    dia: Dia,
  ): Promise<readonly UserId[]>;

  /** Ese aviso ya se reviso hoy: no vuelve a salir hasta manana. */
  marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia): Promise<void>;
}
