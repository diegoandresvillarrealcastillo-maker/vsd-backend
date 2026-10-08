import { Logger } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EnvioHttpDeEventos } from './EnvioHttpDeEventos.js';

const URL_SECRETA = 'https://registros.ejemplo.co/ingesta/abc123-secreto-en-la-ruta';
const TOKEN = 'Bearer token-secreto-de-prueba';

const evento = (n: number): Record<string, unknown> => ({
  canal: 'seguridad',
  tipo: 'CUENTA_BORRADA',
  idUsuario: `usuario-${n}`,
});

type Peticion = (url: string | URL | Request, init?: RequestInit) => Promise<Response>;

/** Lo que se mando, ya leido: el cuerpo siempre es un arreglo JSON en texto. */
function cuerpoEnviado(init: RequestInit | undefined): unknown {
  return JSON.parse(typeof init?.body === 'string' ? init.body : 'null');
}

function respuestaCon(estado: number): Response {
  return new Response(null, { status: estado });
}

function armar(
  peticion: Peticion,
  ajustes: ConstructorParameters<typeof EnvioHttpDeEventos>[2] = {},
  reloj: () => number = () => 0,
) {
  const mock = vi.fn(peticion);
  const envio = new EnvioHttpDeEventos(URL_SECRETA, TOKEN, ajustes, mock, reloj);

  return { envio, mock };
}

describe('EnvioHttpDeEventos', () => {
  let avisos: string[];

  beforeEach(() => {
    avisos = [];
    vi.spyOn(Logger.prototype, 'warn').mockImplementation((mensaje: unknown) => {
      avisos.push(String(mensaje));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('manda un arreglo JSON con una linea por evento y la cabecera de autorizacion', async () => {
    const { envio, mock } = armar(() => Promise.resolve(respuestaCon(202)));

    envio.encolar(evento(1));
    envio.encolar(evento(2));
    await envio.vaciar();

    expect(mock).toHaveBeenCalledTimes(1);

    const [url, init] = mock.mock.calls[0] ?? [];

    expect(url).toBe(URL_SECRETA);
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json', Authorization: TOKEN });
    expect(cuerpoEnviado(init)).toEqual([evento(1), evento(2)]);
    expect(envio.pendientes).toBe(0);
  });

  it('usa otra cabecera si el servicio la pide', async () => {
    const { envio, mock } = armar(() => Promise.resolve(respuestaCon(200)), {
      cabecera: 'DD-API-KEY',
    });

    envio.encolar(evento(1));
    await envio.vaciar();

    expect(mock.mock.calls[0]?.[1]?.headers).toMatchObject({ 'DD-API-KEY': TOKEN });
    expect(mock.mock.calls[0]?.[1]?.headers).not.toHaveProperty('Authorization');
  });

  it('sin clave no manda cabecera de autorizacion', async () => {
    const mock = vi.fn<Peticion>(() => Promise.resolve(respuestaCon(200)));
    const envio = new EnvioHttpDeEventos(URL_SECRETA, undefined, {}, mock);

    envio.encolar(evento(1));
    await envio.vaciar();

    expect(mock.mock.calls[0]?.[1]?.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('no sigue redirecciones: llevarian la clave a otro sitio', async () => {
    const { envio, mock } = armar(() => Promise.resolve(respuestaCon(200)));

    envio.encolar(evento(1));
    await envio.vaciar();

    expect(mock.mock.calls[0]?.[1]?.redirect).toBe('error');
  });

  it('manda por tandas: no pasa de lo que cabe en una peticion', async () => {
    const { envio, mock } = armar(() => Promise.resolve(respuestaCon(200)), {
      maximoPorEnvio: 3,
    });

    for (let n = 1; n <= 5; n += 1) {
      envio.encolar(evento(n));
    }

    await envio.vaciar();
    await envio.vaciar();

    const tamanos = mock.mock.calls.map(([, init]) => (cuerpoEnviado(init) as unknown[]).length);

    expect(tamanos.reduce((a, b) => a + b, 0)).toBe(5);
    expect(Math.max(...tamanos)).toBeLessThanOrEqual(3);
  });

  it('no manda nada si no hay nada que mandar', async () => {
    const { envio, mock } = armar(() => Promise.resolve(respuestaCon(200)));

    await envio.vaciar();

    expect(mock).not.toHaveBeenCalled();
  });

  it('dos vaciados a la vez no mandan lo mismo dos veces', async () => {
    let liberar: (() => void) | undefined;
    const { envio, mock } = armar(
      () =>
        new Promise<Response>((resolver) => {
          liberar = () => resolver(respuestaCon(200));
        }),
    );

    envio.encolar(evento(1));

    const primero = envio.vaciar();
    const segundo = envio.vaciar();

    liberar?.();
    await Promise.all([primero, segundo]);

    expect(mock).toHaveBeenCalledTimes(1);
  });

  describe('cuando el servicio falla', () => {
    it('devuelve los eventos a la cola para el siguiente intento', async () => {
      const { envio } = armar(() => Promise.resolve(respuestaCon(503)));

      envio.encolar(evento(1));
      envio.encolar(evento(2));
      await envio.vaciar();

      expect(envio.pendientes).toBe(2);
    });

    it('lo mismo si la red se cae', async () => {
      const { envio } = armar(() => Promise.reject(new Error('ECONNRESET')));

      envio.encolar(evento(1));
      await envio.vaciar();

      expect(envio.pendientes).toBe(1);
    });

    it('al volver el servicio se envia lo que quedo en espera, en orden', async () => {
      let responder: () => Promise<Response> = () => Promise.resolve(respuestaCon(500));
      const { envio, mock } = armar(() => responder());

      envio.encolar(evento(1));
      await envio.vaciar();
      envio.encolar(evento(2));

      responder = () => Promise.resolve(respuestaCon(200));
      await envio.vaciar();

      const ultimo = cuerpoEnviado(mock.mock.calls.at(-1)?.[1]) as unknown[];

      expect(ultimo).toEqual([evento(1), evento(2)]);
      expect(envio.pendientes).toBe(0);
    });

    it('no pasa del tope: descarta los mas viejos y lo cuenta', async () => {
      const { envio } = armar(() => Promise.resolve(respuestaCon(503)), {
        maximoEnCola: 3,
        maximoPorEnvio: 100,
      });

      for (let n = 1; n <= 6; n += 1) {
        envio.encolar(evento(n));
      }

      expect(envio.pendientes).toBe(3);
      expect(envio.perdidos).toBe(3);

      await envio.vaciar();

      expect(envio.pendientes).toBe(3);
    });

    it('no insiste con cada evento mientras el servicio no responde', async () => {
      const { envio, mock } = armar(() => Promise.resolve(respuestaCon(503)), {
        maximoPorEnvio: 2,
      });

      envio.encolar(evento(1));
      envio.encolar(evento(2));
      await envio.vaciar();

      const intentos = mock.mock.calls.length;

      for (let n = 3; n <= 10; n += 1) {
        envio.encolar(evento(n));
      }

      expect(mock.mock.calls.length).toBe(intentos);
    });

    it('avisa sin copiar la direccion, la clave ni el contenido de los eventos', async () => {
      const { envio } = armar(() =>
        Promise.reject(new Error(`fallo al conectar con ${URL_SECRETA} usando ${TOKEN}`)),
      );

      envio.encolar(evento(1));
      await envio.vaciar();

      expect(avisos).toHaveLength(1);

      const aviso = avisos[0] ?? '';

      expect(aviso).toContain('sin respuesta');
      expect(aviso).not.toContain('abc123');
      expect(aviso).not.toContain('secreto');
      expect(aviso).not.toContain('usuario-1');
    });

    it('avisa una vez por minuto, no una por cada fallo', async () => {
      let ahora = 0;
      const { envio } = armar(
        () => Promise.resolve(respuestaCon(503)),
        {},
        () => ahora,
      );

      envio.encolar(evento(1));
      await envio.vaciar();
      await envio.vaciar();
      await envio.vaciar();

      expect(avisos).toHaveLength(1);

      ahora = 61_000;
      await envio.vaciar();

      expect(avisos).toHaveLength(2);
    });
  });

  describe('el temporizador y el cierre', () => {
    it('manda lo pendiente cada cierto tiempo', async () => {
      vi.useFakeTimers();

      const { envio, mock } = armar(() => Promise.resolve(respuestaCon(200)), {
        intervaloEnMs: 5_000,
      });

      envio.iniciar();
      envio.encolar(evento(1));

      await vi.advanceTimersByTimeAsync(5_000);

      expect(mock).toHaveBeenCalledTimes(1);

      await envio.onModuleDestroy();
    });

    it('al cerrar la aplicacion manda lo ultimo y deja de programar envios', async () => {
      vi.useFakeTimers();

      const { envio, mock } = armar(() => Promise.resolve(respuestaCon(200)));

      envio.iniciar();
      envio.encolar(evento(1));
      await envio.onModuleDestroy();

      expect(mock).toHaveBeenCalledTimes(1);

      envio.encolar(evento(2));
      await vi.advanceTimersByTimeAsync(60_000);

      expect(mock).toHaveBeenCalledTimes(1);
    });
  });
});
