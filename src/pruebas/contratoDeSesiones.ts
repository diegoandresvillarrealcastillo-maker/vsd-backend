import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Dia } from '../domain/model/Calendario.js';
import type { ActivityId } from '../domain/model/Identifier.js';
import { type SesionDeActividad } from '../domain/model/SesionDeActividad.js';
import type { SesionesRepositoryPort } from '../domain/ports/out/SesionesRepositoryPort.js';
import { UserId } from '../domain/model/Identifier.js';

/**
 * Lo que un adaptador de sesiones tiene que cumplir, sea cual sea (SCRUM-205, ADR 0030).
 *
 * El adaptador en memoria y el de PostgreSQL ordenan con hashes distintos (cada uno el que tiene a
 * mano), asi que aqui **no se comprueban valores sino propiedades**: valen sea cual sea el orden de
 * cada persona. Es el mismo criterio que las pruebas de los datos curiosos (ADR 0025).
 *
 * Cada adaptador pone un `BancoDeSesiones`: lo necesario para sembrar contenido y registrar lo que
 * una persona hizo, que en memoria es un Map y en PostgreSQL son filas.
 */
export interface BancoDeSesiones {
  readonly repositorio: SesionesRepositoryPort;
  /** Una mecanica nueva, que ninguna otra prueba usa. */
  mecanicaNueva(): Promise<ActivityId>;
  /** Una persona nueva, con su cuenta si el adaptador la necesita. */
  personaNueva(): Promise<string>;
  /** Agrega estas sesiones al contenido de la mecanica. */
  sembrar(sesiones: readonly SesionDeActividad[]): Promise<void>;
  /** Anota que la persona hizo esa sesion ese dia. */
  hacer(persona: string, sesion: SesionDeActividad, dia: Dia, hechaEn?: Date): Promise<void>;
  /** Devuelve las sesiones de una mecanica a como estaban al sembrarlas (por si la prueba las cambio). */
  cerrar(): Promise<void>;
}

/** Una sesion con un identificador nuevo, para la mecanica indicada. */
export type FabricaDeSesiones = (
  mecanica: ActivityId,
  opciones?: { readonly publicado?: boolean; readonly titulo?: string },
) => SesionDeActividad;

const HOY = '2026-10-16';

/** El dia `HOY` menos `n`. */
function haceDias(n: number, desde: Dia = HOY): Dia {
  return new Date(Date.parse(`${desde}T00:00:00Z`) - n * 86_400_000).toISOString().slice(0, 10);
}

export function contratoDeSesiones(
  abrir: () => Promise<BancoDeSesiones>,
  nueva: FabricaDeSesiones,
): void {
  let banco: BancoDeSesiones;

  beforeAll(async () => {
    banco = await abrir();
  });

  afterAll(async () => {
    await banco?.cerrar();
  });

  /** La sesion de hoy para una persona en una mecanica. */
  async function deHoy(
    persona: string,
    mecanica: ActivityId,
    dia: Dia = HOY,
  ): Promise<SesionDeActividad | undefined> {
    const mapa = await banco.repositorio.sesionesDeHoy(new UserId(persona), [mecanica], dia);

    return mapa.get(mecanica.value);
  }

  /** Una mecanica con `n` sesiones publicadas. */
  async function mecanicaCon(n: number): Promise<{
    mecanica: ActivityId;
    sesiones: SesionDeActividad[];
  }> {
    const mecanica = await banco.mecanicaNueva();
    const sesiones = Array.from({ length: n }, () => nueva(mecanica));

    await banco.sembrar(sesiones);

    return { mecanica, sesiones };
  }

  describe('que sesion ofrece', () => {
    it('una mecanica sin sesiones no tiene nada que ofrecer', async () => {
      const mecanica = await banco.mecanicaNueva();
      const persona = await banco.personaNueva();

      expect(await deHoy(persona, mecanica)).toBeUndefined();
    });

    it('con sesiones publicadas ofrece una de ellas, y la misma en cada consulta', async () => {
      const { mecanica, sesiones } = await mecanicaCon(5);
      const persona = await banco.personaNueva();

      const primera = await deHoy(persona, mecanica);
      const segunda = await deHoy(persona, mecanica);

      expect(sesiones.map((s) => s.id.value)).toContain(primera?.id.value);
      expect(segunda?.id.value).toBe(primera?.id.value);
    });

    it('devuelve la sesion completa, con su contenido', async () => {
      const mecanica = await banco.mecanicaNueva();
      const unica = nueva(mecanica, { titulo: 'Con contenido' });
      const persona = await banco.personaNueva();
      await banco.sembrar([unica]);

      const ofrecida = await deHoy(persona, mecanica);

      expect(ofrecida?.titulo).toBe('Con contenido');
      expect(ofrecida?.idActividad.value).toBe(mecanica.value);
      expect(ofrecida?.nivel).toBe(unica.nivel);
      expect(ofrecida?.parametros).toEqual(unica.parametros);
    });

    it('solo ofrece sesiones de esa mecanica', async () => {
      const una = await mecanicaCon(3);
      const otra = await mecanicaCon(3);
      const persona = await banco.personaNueva();

      expect(una.sesiones.map((s) => s.id.value)).toContain(
        (await deHoy(persona, una.mecanica))?.id.value,
      );
      expect(otra.sesiones.map((s) => s.id.value)).toContain(
        (await deHoy(persona, otra.mecanica))?.id.value,
      );
    });

    it('una sesion sin publicar no se ofrece', async () => {
      const mecanica = await banco.mecanicaNueva();
      const publicada = nueva(mecanica);
      const sinPublicar = nueva(mecanica, { publicado: false });
      await banco.sembrar([publicada, sinPublicar]);

      for (let i = 0; i < 10; i++) {
        const persona = await banco.personaNueva();

        expect((await deHoy(persona, mecanica))?.id.value).toBe(publicada.id.value);
      }
    });

    it('con varias mecanicas a la vez, da una por mecanica', async () => {
      const a = await mecanicaCon(2);
      const b = await mecanicaCon(2);
      const sinNada = await banco.mecanicaNueva();
      const persona = await banco.personaNueva();

      const mapa = await banco.repositorio.sesionesDeHoy(
        new UserId(persona),
        [a.mecanica, b.mecanica, sinNada],
        HOY,
      );

      expect([...mapa.keys()].sort()).toEqual([a.mecanica.value, b.mecanica.value].sort());
    });

    it('sin mecanicas que consultar, no hay nada', async () => {
      const persona = await banco.personaNueva();

      expect((await banco.repositorio.sesionesDeHoy(new UserId(persona), [], HOY)).size).toBe(0);
      expect((await banco.repositorio.mecanicasConSesion(new UserId(persona), [], HOY)).size).toBe(
        0,
      );
    });
  });

  describe('lo que la persona ya hizo', () => {
    it('si ya hizo una hoy, esa es la de hoy aunque haya otras', async () => {
      const { mecanica, sesiones } = await mecanicaCon(6);
      const persona = await banco.personaNueva();
      const ofrecida = await deHoy(persona, mecanica);
      const otra = sesiones.find((s) => s.id.value !== ofrecida?.id.value)!;

      await banco.hacer(persona, otra, HOY);

      expect((await deHoy(persona, mecanica))?.id.value).toBe(otra.id.value);
    });

    it('si repitio, la ultima que hizo hoy', async () => {
      const { mecanica, sesiones } = await mecanicaCon(4);
      const persona = await banco.personaNueva();

      await banco.hacer(persona, sesiones[0]!, HOY, new Date(`${HOY}T08:00:00Z`));
      await banco.hacer(persona, sesiones[2]!, HOY, new Date(`${HOY}T20:00:00Z`));
      await banco.hacer(persona, sesiones[1]!, HOY, new Date(`${HOY}T12:00:00Z`));

      expect((await deHoy(persona, mecanica))?.id.value).toBe(sesiones[2]!.id.value);
    });

    it('si la hizo hoy y despues se retiro, sigue siendo la de hoy', async () => {
      const mecanica = await banco.mecanicaNueva();
      const retirada = nueva(mecanica, { publicado: false });
      const vigente = nueva(mecanica);
      const persona = await banco.personaNueva();
      await banco.sembrar([retirada, vigente]);

      await banco.hacer(persona, retirada, HOY);

      expect((await deHoy(persona, mecanica))?.id.value).toBe(retirada.id.value);
      // Y manana ya no: una retirada que hizo ayer no vuelve.
      expect((await deHoy(persona, mecanica, haceDias(-1)))?.id.value).toBe(vigente.id.value);
    });

    it('lo que hizo ayer no vuelve mientras queden otras', async () => {
      const { mecanica, sesiones } = await mecanicaCon(5);
      const persona = await banco.personaNueva();
      const ayer = await deHoy(persona, mecanica, haceDias(1));

      await banco.hacer(
        persona,
        sesiones.find((s) => s.id.value === ayer?.id.value)!,
        haceDias(1),
      );

      expect((await deHoy(persona, mecanica))?.id.value).not.toBe(ayer?.id.value);
    });

    it('recorre todas sin repetir y luego vuelve a empezar en el mismo orden', async () => {
      const { mecanica, sesiones } = await mecanicaCon(7);
      const persona = await banco.personaNueva();
      const vistas: string[] = [];

      for (let d = 0; d < 21; d++) {
        const dia = haceDias(-d, '2026-02-01');
        const sesion = await deHoy(persona, mecanica, dia);

        expect(sesion).toBeDefined();
        vistas.push(sesion!.id.value);
        await banco.hacer(
          persona,
          sesiones.find((s) => s.id.value === sesion!.id.value)!,
          dia,
        );
      }

      const primeraVuelta = vistas.slice(0, 7);

      expect(new Set(primeraVuelta).size).toBe(7);
      expect(vistas.slice(7, 14)).toEqual(primeraVuelta);
      expect(vistas.slice(14, 21)).toEqual(primeraVuelta);
    });

    it('una sesion hecha hace mas de un ano vuelve a estar disponible', async () => {
      const mecanica = await banco.mecanicaNueva();
      const unica = nueva(mecanica);
      const persona = await banco.personaNueva();
      await banco.sembrar([unica]);
      await banco.hacer(persona, unica, haceDias(400));

      expect((await deHoy(persona, mecanica))?.id.value).toBe(unica.id.value);
    });

    it('si ya las hizo todas dentro del ano, ofrece la que hizo hace mas tiempo', async () => {
      const mecanica = await banco.mecanicaNueva();
      const [vieja, reciente] = [nueva(mecanica), nueva(mecanica)] as const;
      const persona = await banco.personaNueva();
      await banco.sembrar([vieja, reciente]);
      await banco.hacer(persona, vieja, haceDias(50));
      await banco.hacer(persona, reciente, haceDias(3));

      expect((await deHoy(persona, mecanica))?.id.value).toBe(vieja.id.value);
    });

    it('una sesion que se agrega despues entra donde le toca, sin repetir lo ya visto', async () => {
      const { mecanica, sesiones } = await mecanicaCon(3);
      const persona = await banco.personaNueva();
      const hechas = new Set<string>();

      for (let d = 2; d >= 1; d--) {
        const sesion = await deHoy(persona, mecanica, haceDias(d));

        hechas.add(sesion!.id.value);
        await banco.hacer(
          persona,
          sesiones.find((s) => s.id.value === sesion!.id.value)!,
          haceDias(d),
        );
      }

      await banco.sembrar([nueva(mecanica)]);
      const hoy = await deHoy(persona, mecanica);

      // Quedan una sin hacer y la nueva: hoy sale una de las dos, nunca una repetida.
      expect(hechas.has(hoy!.id.value)).toBe(false);
    });
  });

  describe('cada persona', () => {
    it('tiene su propio orden', async () => {
      const { mecanica } = await mecanicaCon(8);
      const primeras = new Set<string>();

      for (let i = 0; i < 25; i++) {
        const persona = await banco.personaNueva();

        primeras.add((await deHoy(persona, mecanica))!.id.value);
      }

      // Con 8 sesiones, 25 personas no pueden empezar todas por la misma.
      expect(primeras.size).toBeGreaterThan(1);
    });

    it('lo que hace una no cambia lo que ve otra', async () => {
      const { mecanica, sesiones } = await mecanicaCon(5);
      const ana = await banco.personaNueva();
      const beto = await banco.personaNueva();
      const antes = (await deHoy(beto, mecanica))?.id.value;

      for (let d = 1; d <= 4; d++) {
        const sesion = await deHoy(ana, mecanica, haceDias(d));

        await banco.hacer(
          ana,
          sesiones.find((s) => s.id.value === sesion!.id.value)!,
          haceDias(d),
        );
      }

      expect((await deHoy(beto, mecanica))?.id.value).toBe(antes);
    });
  });

  describe('mecanicasConSesion', () => {
    it('dice cuales tienen algo que ofrecer', async () => {
      const con = await mecanicaCon(2);
      const sin = await banco.mecanicaNueva();
      const soloSinPublicar = await banco.mecanicaNueva();
      await banco.sembrar([nueva(soloSinPublicar, { publicado: false })]);
      const persona = await banco.personaNueva();

      const mapa = await banco.repositorio.mecanicasConSesion(
        new UserId(persona),
        [con.mecanica, sin, soloSinPublicar],
        HOY,
      );

      expect([...mapa]).toEqual([con.mecanica.value]);
    });

    it('cuenta tambien la que se retiro despues de que la persona la hiciera hoy', async () => {
      const mecanica = await banco.mecanicaNueva();
      const retirada = nueva(mecanica, { publicado: false });
      const persona = await banco.personaNueva();
      await banco.sembrar([retirada]);
      await banco.hacer(persona, retirada, HOY);

      const mapa = await banco.repositorio.mecanicasConSesion(new UserId(persona), [mecanica], HOY);

      expect(mapa.has(mecanica.value)).toBe(true);
    });

    it('coincide siempre con las que de verdad tienen una sesion de hoy', async () => {
      const a = await mecanicaCon(2);
      const b = await banco.mecanicaNueva();
      const persona = await banco.personaNueva();
      const mecanicas = [a.mecanica, b];

      const con = await banco.repositorio.mecanicasConSesion(new UserId(persona), mecanicas, HOY);
      const sesiones = await banco.repositorio.sesionesDeHoy(new UserId(persona), mecanicas, HOY);

      expect([...con].sort()).toEqual([...sesiones.keys()].sort());
    });
  });

  describe('porId y titulosDe', () => {
    it('trae una sesion publicada o no, y null si no existe', async () => {
      const mecanica = await banco.mecanicaNueva();
      const publicada = nueva(mecanica);
      const retirada = nueva(mecanica, { publicado: false });
      await banco.sembrar([publicada, retirada]);

      expect((await banco.repositorio.porId(publicada.id))?.id.value).toBe(publicada.id.value);
      expect((await banco.repositorio.porId(retirada.id))?.publicado).toBe(false);
      expect(await banco.repositorio.porId(nueva(mecanica).id)).toBeNull();
    });

    it('trae los titulos y deja fuera lo que no existe', async () => {
      const mecanica = await banco.mecanicaNueva();
      const uno = nueva(mecanica, { titulo: 'Primera' });
      const dos = nueva(mecanica, { titulo: 'Segunda', publicado: false });
      await banco.sembrar([uno, dos]);

      const titulos = await banco.repositorio.titulosDe([uno.id, dos.id, nueva(mecanica).id]);

      expect(Object.fromEntries(titulos)).toEqual({
        [uno.id.value]: 'Primera',
        [dos.id.value]: 'Segunda',
      });
    });

    it('sin identificadores, nada', async () => {
      expect((await banco.repositorio.titulosDe([])).size).toBe(0);
    });
  });
}
