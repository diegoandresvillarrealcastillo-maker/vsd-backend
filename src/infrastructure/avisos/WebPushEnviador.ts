import webPush from 'web-push';
import type { MensajeDeAviso, SuscripcionPush } from '../../domain/model/Aviso.js';
import type { Entrega, EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import type { ClavesVapid } from '../config/environment.js';

/** Cuanto guarda el servicio de push un aviso para un telefono apagado. */
const VIGENCIA_EN_SEGUNDOS = 60 * 60 * 6;

/**
 * Error de la entrega, sin nada de la persona. El de `web-push` lleva la
 * direccion del navegador y la respuesta completa; al registro solo va el
 * estado.
 */
export class EntregaFallidaError extends Error {
  constructor(readonly estado: number | undefined) {
    super(
      estado === undefined
        ? 'No se pudo entregar el aviso al servicio de push.'
        : `El servicio de push respondio ${estado}.`,
    );
    this.name = 'EntregaFallidaError';
  }
}

/**
 * Entrega los avisos con el protocolo Web Push, firmados con las claves VAPID
 * (SCRUM-102).
 *
 * Cada aviso va cifrado para su navegador: el servicio de push de Google,
 * Mozilla o Apple lo transporta sin poder leerlo.
 */
export class WebPushEnviador implements EnviadorDePushPort {
  readonly clavePublica: string | null;

  constructor(private readonly claves: ClavesVapid | undefined) {
    this.clavePublica = claves?.publica ?? null;
  }

  async enviar(suscripcion: SuscripcionPush, mensaje: MensajeDeAviso): Promise<Entrega> {
    if (this.claves === undefined) {
      throw new EntregaFallidaError(undefined);
    }

    try {
      await webPush.sendNotification(
        {
          endpoint: suscripcion.endpoint,
          keys: { p256dh: suscripcion.p256dh, auth: suscripcion.auth },
        },
        JSON.stringify({
          tipo: mensaje.tipo,
          titulo: mensaje.titulo,
          cuerpo: mensaje.cuerpo,
          ruta: mensaje.ruta,
        }),
        {
          TTL: VIGENCIA_EN_SEGUNDOS,
          // Un aviso nuevo del mismo tipo reemplaza al que no llego: si el
          // telefono estuvo apagado, al encenderlo ve uno, no tres.
          topic: mensaje.tipo,
          vapidDetails: {
            subject: this.claves.contacto,
            publicKey: this.claves.publica,
            privateKey: this.claves.privada,
          },
        },
      );

      return 'entregado';
    } catch (error) {
      const estado = error instanceof webPush.WebPushError ? error.statusCode : undefined;

      // 404 y 410: ese navegador ya no existe para el servicio de push.
      if (estado === 404 || estado === 410) {
        return 'caducada';
      }

      throw new EntregaFallidaError(estado);
    }
  }
}
