import type { MensajeDeAviso, SuscripcionPush } from '../../model/Aviso.js';

/** Que paso al entregar un aviso a un navegador. */
export type Entrega = 'entregado' | 'caducada';

/**
 * Quien entrega los avisos al servicio de push de cada navegador
 * (SCRUM-102).
 */
export interface EnviadorDePushPort {
  /**
   * La clave publica VAPID. `null` si este servidor no tiene claves: entonces
   * no hay avisos, y la aplicacion sigue funcionando sin ellos.
   */
  readonly clavePublica: string | null;

  /**
   * `caducada` si el navegador ya no existe (la persona desinstalo o borro
   * los permisos): hay que dejar de usarlo. Cualquier otro fallo lanza.
   */
  enviar(suscripcion: SuscripcionPush, mensaje: MensajeDeAviso): Promise<Entrega>;
}
