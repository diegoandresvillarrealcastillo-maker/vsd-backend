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
  /** "HH:MM" en la zona horaria de la persona, o null si esta apagado. */
  readonly horaSemaforo: string | null;
  readonly horaRacha: string | null;
  /** El recordatorio de las 8:00 de la persona (SCRUM-126): encendido o no. */
  readonly recordatorioManana: boolean;
  /** El de las 20:00, que solo sale si ese dia no hizo ninguna actividad. */
  readonly recordatorioNoche: boolean;
}

export interface CambiarHorasCommand {
  readonly userId: string;
  /** La zona horaria de la persona, de su cuenta: en ella se leen las horas. */
  readonly zonaHoraria: string;
  /** Lo que no viene se queda; null lo apaga. */
  readonly horaSemaforo?: string | null | undefined;
  readonly horaRacha?: string | null | undefined;
}

export interface CambiarRecordatoriosCommand {
  readonly userId: string;
  /** La zona horaria de la persona, de su cuenta: en ella se leen las 8:00 y las 20:00. */
  readonly zonaHoraria: string;
  /** Lo que no viene se queda. */
  readonly manana?: boolean | undefined;
  readonly noche?: boolean | undefined;
}

export interface AvisosUseCase {
  consultar(userId: string): Promise<EstadoDeLosAvisos>;
  cambiarHoras(command: CambiarHorasCommand): Promise<EstadoDeLosAvisos>;
  /** Enciende o apaga los recordatorios de las 8:00 y las 20:00 (SCRUM-126). */
  cambiarRecordatorios(command: CambiarRecordatoriosCommand): Promise<EstadoDeLosAvisos>;
  /** Este navegador entrega desde ahora los avisos de esta persona. */
  suscribir(userId: string, suscripcion: SuscripcionPush): Promise<void>;
  desuscribir(userId: string, endpoint: string): Promise<void>;
}

/**
 * Lo que dejo una revision, para medirla. Son solo cuentas: ni quien, ni que
 * mensaje.
 */
export interface ResumenDeLaRevision {
  /**
   * Personas a las que esta revision les toco un aviso y lo reclamo, lo
   * hayan recibido o no (sin pendientes, por ejemplo, no hay semaforo). No
   * cuenta a quien otra revision ya se le adelanto.
   */
  readonly personas: number;
  /** Avisos que llegaron al servicio de push de algun navegador. */
  readonly entregados: number;
  /** Navegadores que ya no existen y se dejaron de usar. */
  readonly caducadas: number;
  /** Cosas que fallaron (una persona, un navegador, una zona) sin detener a las demas. */
  readonly fallos: number;
}

export interface RevisarAvisosUseCase {
  /** Manda los avisos a los que les toca en este minuto. */
  revisar(ahora: Date): Promise<ResumenDeLaRevision>;
}
