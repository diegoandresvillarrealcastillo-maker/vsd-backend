import type { SuscripcionPush } from '../../model/Aviso.js';

/**
 * Puertos de entrada de los avisos por Web Push (SCRUM-102).
 *
 * Dos: lo que hace la persona desde su perfil, y la revision que el reloj
 * del servidor lanza cada minuto.
 */

export interface EstadoDeLosAvisos {
  /** Si este servidor puede mandar avisos: sin claves VAPID, no. */
  readonly disponible: boolean;
  /** La clave publica VAPID, para que el navegador se suscriba. */
  readonly clavePublica: string | null;
  /** "HH:MM" en hora de Colombia, o null si esta apagado. */
  readonly horaSemaforo: string | null;
  readonly horaRacha: string | null;
}

export interface CambiarHorasCommand {
  readonly userId: string;
  /** Lo que no viene se queda; null lo apaga. */
  readonly horaSemaforo?: string | null | undefined;
  readonly horaRacha?: string | null | undefined;
}

export interface AvisosUseCase {
  consultar(userId: string): Promise<EstadoDeLosAvisos>;
  cambiarHoras(command: CambiarHorasCommand): Promise<EstadoDeLosAvisos>;
  /** Este navegador entrega desde ahora los avisos de esta persona. */
  suscribir(userId: string, suscripcion: SuscripcionPush): Promise<void>;
  desuscribir(userId: string, endpoint: string): Promise<void>;
}

export interface ResumenDeLaRevision {
  /** Avisos que llegaron al servicio de push de algun navegador. */
  readonly entregados: number;
  /** Navegadores que ya no existen y se dejaron de usar. */
  readonly caducadas: number;
}

export interface RevisarAvisosUseCase {
  /** Manda los avisos a los que les toca en este minuto. */
  revisar(ahora: Date): Promise<ResumenDeLaRevision>;
}
