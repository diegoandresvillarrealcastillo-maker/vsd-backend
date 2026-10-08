import { afterEach, describe, expect, it, vi } from 'vitest';
import { mensajeDeLaRacha } from '../../domain/model/Aviso.js';

const { sendNotification } = vi.hoisted(() => ({ sendNotification: vi.fn() }));

vi.mock('web-push', () => {
  // Como el de verdad: (mensaje, estado, cabeceras, cuerpo, direccion).
  class WebPushError extends Error {
    constructor(
      message: string,
      readonly statusCode: number,
    ) {
      super(message);
    }
  }

  return { default: { sendNotification, WebPushError }, WebPushError };
});

const { WebPushEnviador, EntregaFallidaError } = await import('./WebPushEnviador.js');
const webPush = (await import('web-push')).default;

const CLAVES = { publica: 'publica', privada: 'privada', contacto: 'mailto:a@ejemplo.co' };
const SUSCRIPCION = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/direccion-del-navegador',
  p256dh: 'p',
  auth: 'a',
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('WebPushEnviador', () => {
  it('sin claves no esta disponible', () => {
    expect(new WebPushEnviador(undefined).clavePublica).toBeNull();
    expect(new WebPushEnviador(CLAVES).clavePublica).toBe('publica');
  });

  it('entrega el aviso firmado, cifrado para el navegador y con su tema', async () => {
    sendNotification.mockResolvedValue({ statusCode: 201 });

    await expect(new WebPushEnviador(CLAVES).enviar(SUSCRIPCION, mensajeDeLaRacha())).resolves.toBe(
      'entregado',
    );

    const [suscripcion, cuerpo, opciones] = sendNotification.mock.calls[0] as [
      unknown,
      string,
      Record<string, unknown>,
    ];

    expect(suscripcion).toEqual({
      endpoint: SUSCRIPCION.endpoint,
      keys: { p256dh: 'p', auth: 'a' },
    });
    expect(JSON.parse(cuerpo)).toEqual({
      tipo: 'racha',
      titulo: '¿Un momento para ti hoy?',
      cuerpo: 'Tus actividades de hoy te esperan, cuando quieras.',
      ruta: '/panel',
    });
    expect(opciones).toMatchObject({
      topic: 'racha',
      vapidDetails: { subject: 'mailto:a@ejemplo.co', publicKey: 'publica', privateKey: 'privada' },
    });
  });

  it('no espera para siempre a un servicio que no contesta (SCRUM-153)', async () => {
    sendNotification.mockResolvedValue({ statusCode: 201 });

    await new WebPushEnviador(CLAVES).enviar(SUSCRIPCION, mensajeDeLaRacha());

    const [, , opciones] = sendNotification.mock.calls[0] as [unknown, string, { timeout: number }];

    // Diez segundos: de sobra para uno sano, y la revision entrega de a uno.
    expect(opciones.timeout).toBe(10_000);
  });

  it('no manda nada a una direccion que no es de un servicio de push conocido (SCRUM-153)', async () => {
    const guardadaAntes = { ...SUSCRIPCION, endpoint: 'https://push.example.com/abc' };

    // 'caducada' es lo que hace que la revision la quite de la base.
    await expect(
      new WebPushEnviador(CLAVES).enviar(guardadaAntes, mensajeDeLaRacha()),
    ).resolves.toBe('caducada');
    expect(sendNotification).not.toHaveBeenCalled();
  });

  it.each([404, 410])('un %i es un navegador que ya no existe', async (estado) => {
    sendNotification.mockRejectedValue(
      new webPush.WebPushError('Gone', estado, {}, '', SUSCRIPCION.endpoint),
    );

    await expect(new WebPushEnviador(CLAVES).enviar(SUSCRIPCION, mensajeDeLaRacha())).resolves.toBe(
      'caducada',
    );
  });

  it('cualquier otro fallo lanza sin la direccion del navegador', async () => {
    sendNotification.mockRejectedValue(
      new webPush.WebPushError('Server error', 500, {}, '', SUSCRIPCION.endpoint),
    );

    const promesa = new WebPushEnviador(CLAVES).enviar(SUSCRIPCION, mensajeDeLaRacha());

    await expect(promesa).rejects.toBeInstanceOf(EntregaFallidaError);
    await expect(promesa).rejects.not.toThrow(/direccion-del-navegador/);
  });
});
