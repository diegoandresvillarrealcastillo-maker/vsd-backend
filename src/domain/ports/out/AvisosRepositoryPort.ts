import type { PreferenciasDeAviso, SuscripcionPush, TipoDeAviso } from '../../model/Aviso.js';
import type { Dia } from '../../model/Calendario.js';
import type { UserId } from '../../model/Identifier.js';

/**
 * Donde se guardan las horas de los avisos y los navegadores suscritos
 * (SCRUM-102).
 */
export interface AvisosRepositoryPort {
  /** Sin nada guardado, todos los avisos apagados. */
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
   * Las zonas horarias en que hay alguien con algun aviso encendido
   * (SCRUM-123). Cada minuto se mira la hora de cada una, y son pocas.
   */
  zonasEnUso(): Promise<readonly string[]>;

  /**
   * A quien le toca un aviso: su zona es `zona`, su hora cae entre `desde` y
   * `hasta` (minutos del dia en esa zona, ambos incluidos) y ese aviso
   * todavia no se reviso `dia`.
   *
   * Es lo unico que se mira de todos a la vez, y devuelve solo
   * identificadores. Lo demas se lee en nombre de cada persona.
   *
   * La racha y la noche (SCRUM-126) son la misma invitacion con otras
   * palabras: si la persona tiene las dos encendidas, la primera que se revise
   * cada dia es la unica. Una de las dos no le toca si la otra ya se reviso
   * `dia`, haya salido o no (si no salio fue porque ya hizo una actividad, y
   * entonces la otra tampoco saldria).
   */
  aQuienLeToca(
    tipo: TipoDeAviso,
    zona: string,
    desde: number,
    hasta: number,
    dia: Dia,
  ): Promise<readonly UserId[]>;

  /**
   * Reclama el aviso de hoy: queda revisado y no vuelve a salir hasta manana.
   *
   * **Devuelve `true` solo a quien lo reclamo.** Si ya estaba revisado hoy,
   * porque otra revision se adelanto, devuelve `false` y quien llamo no debe
   * mandar nada. Es lo que impide un aviso doble cuando dos revisiones corren
   * a la vez (un despliegue que solapa dos instancias del API, por ejemplo), y
   * por eso la comprobacion y la marca ocurren en una sola operacion, no en
   * dos: mirar y despues escribir dejaria una ventana para que pasen las dos.
   *
   * Con la racha y la noche, que son la misma invitacion, reclamar una cierra
   * tambien la otra: el reclamo falla si cualquiera de las dos ya se reviso hoy.
   */
  marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia): Promise<boolean>;
}
