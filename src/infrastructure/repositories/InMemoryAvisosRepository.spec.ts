import { beforeEach, describe, expect, it } from 'vitest';
import { MINUTO_DE_LA_MANANA, MINUTO_DE_LA_NOCHE, TipoDeAviso } from '../../domain/model/Aviso.js';
import { UserId } from '../../domain/model/Identifier.js';
import { InMemoryAvisosRepository } from './InMemoryAvisosRepository.js';

const ANA = new UserId('11111111-1111-4111-8111-111111111111');
const BETO = new UserId('22222222-2222-4222-9222-222222222222');
const ZONA = 'America/Bogota';
const HOY = '2026-10-05';
const MANANA = '2026-10-06';

function preferencias(userId: UserId, cambios: Record<string, number | null | string> = {}) {
  return {
    userId,
    zonaHoraria: ZONA,
    minutoSemaforo: null,
    minutoRacha: null,
    minutoManana: null,
    minutoNoche: null,
    ...cambios,
  };
}

/** A quien le toca ese aviso entre las 0:00 y las 23:59 de `dia`: la hora ya la prueban los de abajo. */
async function aQuien(repositorio: InMemoryAvisosRepository, tipo: TipoDeAviso, dia = HOY) {
  return (await repositorio.aQuienLeToca(tipo, ZONA, 0, 1439, dia)).map((id) => id.value);
}

describe('InMemoryAvisosRepository: los recordatorios (SCRUM-126)', () => {
  let repositorio: InMemoryAvisosRepository;

  beforeEach(() => {
    repositorio = new InMemoryAvisosRepository();
  });

  it('sin nada guardado, los cuatro avisos estan apagados', async () => {
    expect(await repositorio.preferenciasDe(ANA)).toMatchObject({
      minutoSemaforo: null,
      minutoRacha: null,
      minutoManana: null,
      minutoNoche: null,
    });
    expect(await repositorio.zonasEnUso()).toEqual([]);
  });

  it('guarda y devuelve la manana y la noche', async () => {
    await repositorio.guardarPreferencias(
      preferencias(ANA, { minutoManana: MINUTO_DE_LA_MANANA, minutoNoche: MINUTO_DE_LA_NOCHE }),
    );

    expect(await repositorio.preferenciasDe(ANA)).toMatchObject({
      minutoManana: 480,
      minutoNoche: 1200,
    });
  });

  it('una zona esta en uso si la persona tiene encendido solo uno de los dos nuevos', async () => {
    await repositorio.guardarPreferencias(
      preferencias(ANA, { minutoNoche: MINUTO_DE_LA_NOCHE, zonaHoraria: 'Asia/Tokyo' }),
    );

    expect(await repositorio.zonasEnUso()).toEqual(['Asia/Tokyo']);
  });

  it('la manana y la noche le tocan a quien las tiene encendidas, y a nadie mas', async () => {
    await repositorio.guardarPreferencias(preferencias(ANA, { minutoManana: MINUTO_DE_LA_MANANA }));
    await repositorio.guardarPreferencias(preferencias(BETO, { minutoNoche: MINUTO_DE_LA_NOCHE }));

    expect(await aQuien(repositorio, TipoDeAviso.MANANA)).toEqual([ANA.value]);
    expect(await aQuien(repositorio, TipoDeAviso.NOCHE)).toEqual([BETO.value]);
  });

  it('le toca a su hora y no antes ni despues de la ventana', async () => {
    await repositorio.guardarPreferencias(preferencias(ANA, { minutoManana: MINUTO_DE_LA_MANANA }));

    const a = (desde: number, hasta: number) =>
      repositorio.aQuienLeToca(TipoDeAviso.MANANA, ZONA, desde, hasta, HOY);

    expect(await a(450, 480)).toHaveLength(1);
    expect(await a(481, 510)).toHaveLength(0);
    expect(await a(0, 479)).toHaveLength(0);
  });

  it('una vez revisada hoy, no vuelve a tocar hasta manana', async () => {
    await repositorio.guardarPreferencias(preferencias(ANA, { minutoManana: MINUTO_DE_LA_MANANA }));
    await repositorio.marcarRevisado(ANA, TipoDeAviso.MANANA, HOY);

    expect(await aQuien(repositorio, TipoDeAviso.MANANA, HOY)).toEqual([]);
    expect(await aQuien(repositorio, TipoDeAviso.MANANA, MANANA)).toEqual([ANA.value]);
  });

  it('revisar la manana no cuenta como haber revisado la noche', async () => {
    await repositorio.guardarPreferencias(
      preferencias(ANA, { minutoManana: MINUTO_DE_LA_MANANA, minutoNoche: MINUTO_DE_LA_NOCHE }),
    );
    await repositorio.marcarRevisado(ANA, TipoDeAviso.MANANA, HOY);

    expect(await aQuien(repositorio, TipoDeAviso.NOCHE)).toEqual([ANA.value]);
  });

  it('cambiar las preferencias no borra lo que ya se reviso hoy', async () => {
    await repositorio.guardarPreferencias(preferencias(ANA, { minutoNoche: MINUTO_DE_LA_NOCHE }));
    await repositorio.marcarRevisado(ANA, TipoDeAviso.NOCHE, HOY);
    await repositorio.guardarPreferencias(
      preferencias(ANA, { minutoNoche: MINUTO_DE_LA_NOCHE, minutoSemaforo: 540 }),
    );

    expect(await aQuien(repositorio, TipoDeAviso.NOCHE)).toEqual([]);
  });

  describe('la racha y la noche invitan a lo mismo: una sola por dia', () => {
    beforeEach(async () => {
      await repositorio.guardarPreferencias(
        preferencias(ANA, { minutoRacha: 1140, minutoNoche: MINUTO_DE_LA_NOCHE }),
      );
    });

    it('con las dos encendidas, las dos le tocan antes de que salga alguna', async () => {
      expect(await aQuien(repositorio, TipoDeAviso.RACHA)).toEqual([ANA.value]);
      expect(await aQuien(repositorio, TipoDeAviso.NOCHE)).toEqual([ANA.value]);
    });

    it('si la racha ya se reviso hoy, la noche no le toca', async () => {
      await repositorio.marcarRevisado(ANA, TipoDeAviso.RACHA, HOY);

      expect(await aQuien(repositorio, TipoDeAviso.NOCHE)).toEqual([]);
    });

    it('si la noche ya se reviso hoy (aunque la hora de la racha sea mas tarde), la racha no le toca', async () => {
      await repositorio.marcarRevisado(ANA, TipoDeAviso.NOCHE, HOY);

      expect(await aQuien(repositorio, TipoDeAviso.RACHA)).toEqual([]);
    });

    it('al dia siguiente vuelven a tocar las dos', async () => {
      await repositorio.marcarRevisado(ANA, TipoDeAviso.RACHA, HOY);

      expect(await aQuien(repositorio, TipoDeAviso.NOCHE, MANANA)).toEqual([ANA.value]);
      expect(await aQuien(repositorio, TipoDeAviso.RACHA, MANANA)).toEqual([ANA.value]);
    });

    it('no afecta al semaforo ni a la manana, que dicen otra cosa', async () => {
      await repositorio.guardarPreferencias(
        preferencias(ANA, {
          minutoSemaforo: 480,
          minutoManana: MINUTO_DE_LA_MANANA,
          minutoRacha: 1140,
          minutoNoche: MINUTO_DE_LA_NOCHE,
        }),
      );
      await repositorio.marcarRevisado(ANA, TipoDeAviso.RACHA, HOY);
      await repositorio.marcarRevisado(ANA, TipoDeAviso.NOCHE, HOY);

      expect(await aQuien(repositorio, TipoDeAviso.SEMAFORO)).toEqual([ANA.value]);
      expect(await aQuien(repositorio, TipoDeAviso.MANANA)).toEqual([ANA.value]);
    });

    it('lo que se revisa para una persona no afecta a otra', async () => {
      await repositorio.guardarPreferencias(
        preferencias(BETO, { minutoNoche: MINUTO_DE_LA_NOCHE }),
      );
      await repositorio.marcarRevisado(ANA, TipoDeAviso.RACHA, HOY);

      expect(await aQuien(repositorio, TipoDeAviso.NOCHE)).toEqual([BETO.value]);
    });
  });
});
