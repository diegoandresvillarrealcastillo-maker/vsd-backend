import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  ResumenDeLasBajas,
  TerminarBajasPendientesUseCase,
} from '../../domain/ports/in/BajasPendientesUseCase.js';
import { CADA_MINUTO_MS } from '../avisos/RelojDeAvisos.js';
import { Ambiente, type Configuracion } from '../config/environment.js';
import { RelojDeBajas } from './RelojDeBajas.js';

const NADA: ResumenDeLasBajas = { tomadas: 0, terminadas: 0, fallos: 0 };

function armar({
  ambiente = Ambiente.PRODUCCION,
  terminar = vi.fn(() => Promise.resolve(NADA)),
}: {
  ambiente?: Configuracion['ambiente'];
  terminar?: TerminarBajasPendientesUseCase['terminar'];
} = {}) {
  const bajas: TerminarBajasPendientesUseCase = { terminar };
  const reloj = new RelojDeBajas(bajas, { ambiente } as Configuracion);

  return { reloj, terminar };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('RelojDeBajas (SCRUM-267)', () => {
  it('termina las bajas pendientes al arrancar y despues cada minuto', async () => {
    vi.useFakeTimers();
    const { reloj, terminar } = armar();

    reloj.onApplicationBootstrap();
    // Una al arrancar, sin esperar el primer minuto.
    await vi.advanceTimersByTimeAsync(0);
    expect(terminar).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(CADA_MINUTO_MS * 3);
    reloj.onApplicationShutdown();
    await vi.advanceTimersByTimeAsync(CADA_MINUTO_MS * 3);

    expect(terminar).toHaveBeenCalledTimes(4);
  });

  it('no arranca en las pruebas', async () => {
    vi.useFakeTimers();
    const { reloj, terminar } = armar({ ambiente: Ambiente.PRUEBAS });

    reloj.onApplicationBootstrap();
    await vi.advanceTimersByTimeAsync(CADA_MINUTO_MS * 2);

    expect(terminar).not.toHaveBeenCalled();
  });

  it('una vuelta no empieza mientras la anterior sigue', async () => {
    let acabar: () => void = () => undefined;
    const terminar = vi.fn(
      () =>
        new Promise<ResumenDeLasBajas>((resolver) => {
          acabar = () => resolver(NADA);
        }),
    );
    const { reloj } = armar({ terminar });

    const primera = reloj.terminar();
    await reloj.terminar();
    acabar();
    await primera;

    expect(terminar).toHaveBeenCalledTimes(1);
  });

  it('si una vuelta falla, no tumba el servicio y la siguiente se hace', async () => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const terminar = vi
      .fn<TerminarBajasPendientesUseCase['terminar']>()
      .mockRejectedValueOnce(new Error('sin base'))
      .mockResolvedValue(NADA);
    const { reloj } = armar({ terminar });

    await expect(reloj.terminar()).resolves.toBeUndefined();
    await expect(reloj.terminar()).resolves.toBeUndefined();

    expect(terminar).toHaveBeenCalledTimes(2);
  });

  describe('lo que deja dicho', () => {
    it('una vuelta sin nada pendiente no deja nada: pasa casi cada minuto', async () => {
      const log = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
      const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
      const { reloj } = armar();

      await reloj.terminar();

      expect(log).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
    });

    it('una vuelta que termino bajas deja las cuentas, sin decir de quien', async () => {
      const log = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
      const { reloj } = armar({
        terminar: vi.fn(() => Promise.resolve({ tomadas: 3, terminadas: 3, fallos: 0 })),
      });

      await reloj.terminar();

      expect(log).toHaveBeenCalledWith('Bajas pendientes: 3 tomadas, 3 terminadas, 0 con fallo.');
    });

    it('una vuelta con fallos avisa que se vuelven a intentar', async () => {
      const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
      const { reloj } = armar({
        terminar: vi.fn(() => Promise.resolve({ tomadas: 2, terminadas: 1, fallos: 1 })),
      });

      await reloj.terminar();

      expect(warn).toHaveBeenCalledWith(
        'Bajas pendientes: 2 tomadas, 1 terminadas, 1 con fallo. Las que fallaron se vuelven a intentar en un minuto.',
      );
    });
  });
});
