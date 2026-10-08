import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  ResumenDeLaRevision,
  RevisarAvisosUseCase,
} from '../../domain/ports/in/AvisosUseCase.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import { Ambiente, type Configuracion } from '../config/environment.js';
import { CADA_MINUTO_MS, REVISION_LENTA_MS, RelojDeAvisos } from './RelojDeAvisos.js';

const NADA: ResumenDeLaRevision = { personas: 0, entregados: 0, caducadas: 0, fallos: 0 };

function armar({
  ambiente = Ambiente.PRODUCCION,
  clavePublica = 'clave',
  revisar = vi.fn(() => Promise.resolve(NADA)),
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
  vi.restoreAllMocks();
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
        new Promise<ResumenDeLaRevision>((resolver) => {
          terminar = () => resolver(NADA);
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

  describe('la medicion (SCRUM-160)', () => {
    /** Una revision que "tarda" lo que se diga, sin esperar de verdad. */
    function conDuracion(ms: number, resumen: ResumenDeLaRevision) {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1_000)
        .mockReturnValueOnce(1_000 + ms);

      return armar({ revisar: vi.fn(() => Promise.resolve(resumen)) });
    }

    it('deja dicho cuantas personas, cuanto se entrego y cuanto tardo', async () => {
      const log = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
      const { reloj } = conDuracion(850, { personas: 40, entregados: 52, caducadas: 3, fallos: 1 });

      await reloj.revisar();

      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(
        'Avisos: 40 personas atendidas, 52 entregados, 3 navegadores soltados, 1 fallos, en 850 ms.',
      );
    });

    it('una revision sin nadie a quien avisar no deja nada: pasa casi cada minuto', async () => {
      const log = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
      const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
      const { reloj } = conDuracion(12, NADA);

      await reloj.revisar();

      expect(log).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
    });

    it('avisa cuando una revision tarda la mitad del minuto o mas', async () => {
      vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
      const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
      const { reloj } = conDuracion(REVISION_LENTA_MS, { ...NADA, personas: 900, entregados: 900 });

      await reloj.revisar();

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('La revision tardo 30000 ms'));
    });

    it('un milisegundo menos que el limite no avisa', async () => {
      vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
      const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
      const { reloj } = conDuracion(REVISION_LENTA_MS - 1, { ...NADA, personas: 1, entregados: 1 });

      await reloj.revisar();

      expect(warn).not.toHaveBeenCalled();
    });

    it('si se salta un minuto porque la anterior sigue, lo dice y cuenta los seguidos', async () => {
      const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
      let terminar: () => void = () => undefined;
      const revisar = vi.fn(
        () =>
          new Promise<ResumenDeLaRevision>((resolver) => {
            terminar = () => resolver(NADA);
          }),
      );
      const { reloj } = armar({ revisar });

      const primera = reloj.revisar();

      await reloj.revisar();
      await reloj.revisar();

      expect(warn).toHaveBeenCalledTimes(2);
      expect(warn).toHaveBeenNthCalledWith(1, expect.stringContaining('(1 seguidos)'));
      expect(warn).toHaveBeenNthCalledWith(2, expect.stringContaining('(2 seguidos)'));

      terminar();
      await primera;
    });
  });
});
