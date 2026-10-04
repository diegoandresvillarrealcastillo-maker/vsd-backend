import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RevisarAvisosUseCase } from '../../domain/ports/in/AvisosUseCase.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import { Ambiente, type Configuracion } from '../config/environment.js';
import { CADA_MINUTO_MS, RelojDeAvisos } from './RelojDeAvisos.js';

function armar({
  ambiente = Ambiente.PRODUCCION,
  clavePublica = 'clave',
  revisar = vi.fn(() => Promise.resolve({ entregados: 0, caducadas: 0 })),
}: {
  ambiente?: Configuracion['ambiente'];
  clavePublica?: string | null;
  revisar?: RevisarAvisosUseCase['revisar'];
} = {}) {
  const revision: RevisarAvisosUseCase = { revisar };
  const enviador: EnviadorDePushPort = { clavePublica, enviar: vi.fn() };
  const reloj = new RelojDeAvisos(revision, enviador, { ambiente } as Configuracion);

  return { reloj, revisar };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('RelojDeAvisos', () => {
  it('revisa cada minuto', async () => {
    vi.useFakeTimers();
    const { reloj, revisar } = armar();

    reloj.onApplicationBootstrap();
    await vi.advanceTimersByTimeAsync(CADA_MINUTO_MS * 3);
    reloj.onApplicationShutdown();
    await vi.advanceTimersByTimeAsync(CADA_MINUTO_MS * 3);

    expect(revisar).toHaveBeenCalledTimes(3);
  });

  it.each([
    ['en las pruebas', { ambiente: Ambiente.PRUEBAS }],
    ['sin claves VAPID', { clavePublica: null }],
  ])('no arranca %s', async (_caso, opciones) => {
    vi.useFakeTimers();
    const { reloj, revisar } = armar(opciones);

    reloj.onApplicationBootstrap();
    await vi.advanceTimersByTimeAsync(CADA_MINUTO_MS * 2);

    expect(revisar).not.toHaveBeenCalled();
  });

  it('una revision no empieza mientras la anterior sigue', async () => {
    let terminar: () => void = () => undefined;
    const revisar = vi.fn(
      () =>
        new Promise<{ entregados: number; caducadas: number }>((resolver) => {
          terminar = () => resolver({ entregados: 0, caducadas: 0 });
        }),
    );
    const { reloj } = armar({ revisar });

    const primera = reloj.revisar();
    await reloj.revisar();
    terminar();
    await primera;

    expect(revisar).toHaveBeenCalledTimes(1);
  });

  it('si una revision falla, no tumba el servicio', async () => {
    const { reloj } = armar({ revisar: vi.fn(() => Promise.reject(new Error('sin base'))) });

    await expect(reloj.revisar()).resolves.toBeUndefined();
  });
});
