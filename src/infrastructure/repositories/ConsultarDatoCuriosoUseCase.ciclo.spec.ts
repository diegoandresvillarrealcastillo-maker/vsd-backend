import { describe, expect, it } from 'vitest';
import type { User } from '../../domain/model/User.js';
import { ConsultarDatoCuriosoUseCaseImpl } from '../../application/usecases/ConsultarDatoCuriosoUseCaseImpl.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { InMemoryDatoCuriosoRepository } from './InMemoryDatoCuriosoRepository.js';

/**
 * El dato curioso del dia (SCRUM-185, ADR 0025).
 *
 * Vive en `infrastructure/` porque junta el caso de uso con el adaptador en memoria, y la capa de
 * aplicacion no puede importar infraestructura.
 *
 * Lo que se prueba es lo que la persona nota: que el dato es el mismo todo el dia, que cambia
 * al dia siguiente, que no se repite hasta recorrer el catalogo, que cada persona tiene su
 * propio orden y que el catalogo puede cambiar a mitad del ciclo sin repetir ni inventar.
 */

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-9222-222222222222';

function dato(n: number) {
  return {
    id: `d0000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
    texto: `Dato ${String(n)}`,
    tema: 'prueba',
  };
}

function catalogo(cuantos: number) {
  return Array.from({ length: cuantos }, (_, i) => dato(i + 1));
}

/** Una hora de un dia en Bogota, que va 5 horas por detras de UTC. */
function elDia(dia: string, hora = 12): Date {
  return new Date(Date.parse(`${dia}T00:00:00.000Z`) + (hora + 5) * 3_600_000);
}

function dias(desde: string, cuantos: number): string[] {
  const base = Date.parse(`${desde}T00:00:00Z`);

  return Array.from({ length: cuantos }, (_, i) =>
    new Date(base + i * 86_400_000).toISOString().slice(0, 10),
  );
}

function armar(repositorio: InMemoryDatoCuriosoRepository) {
  let ahora = elDia('2026-10-01');
  const caso = new ConsultarDatoCuriosoUseCaseImpl(repositorio, () => ahora);

  return {
    caso,
    /** Cambia lo que el reloj dice que es ahora. */
    fijar: (nuevo: Date) => {
      ahora = nuevo;
    },
  };
}

/** Los textos que recibe una persona en una lista de dias consecutivos. */
async function recorrer(
  repositorio: InMemoryDatoCuriosoRepository,
  persona: string,
  lista: readonly string[],
): Promise<string[]> {
  const cuenta: User = unaCuenta({ id: persona });
  const { caso, fijar } = armar(repositorio);
  const textos: string[] = [];

  for (const dia of lista) {
    fijar(elDia(dia));
    const entregado = await caso.execute(cuenta);

    textos.push(entregado.dato?.texto ?? '(nada)');
  }

  return textos;
}

describe('ConsultarDatoCuriosoUseCaseImpl', () => {
  it('sin ningun dato publicado el dato es nulo, y el dia es el de hoy', async () => {
    const { caso } = armar(new InMemoryDatoCuriosoRepository([]));

    await expect(caso.execute(unaCuenta({ id: A }))).resolves.toEqual({
      dia: '2026-10-01',
      dato: null,
    });
  });

  it('un dato sin publicar no se sirve', async () => {
    const repositorio = new InMemoryDatoCuriosoRepository([]);

    repositorio.agregar(dato(1), false);

    const { caso } = armar(repositorio);

    await expect(caso.execute(unaCuenta({ id: A }))).resolves.toMatchObject({ dato: null });
  });

  describe('el mismo dia', () => {
    it('es el mismo dato todo el dia, vuelva a pedirlo cuando lo pida', async () => {
      const { caso, fijar } = armar(new InMemoryDatoCuriosoRepository(catalogo(10)));
      const cuenta = unaCuenta({ id: A });

      fijar(elDia('2026-10-01', 6));
      const manana = await caso.execute(cuenta);
      fijar(elDia('2026-10-01', 22));
      const noche = await caso.execute(cuenta);

      expect(noche.dato?.id).toBe(manana.dato?.id);
      expect(noche.dia).toBe('2026-10-01');
    });

    it('«hoy» es el dia de Colombia: a las 9 p. m. del jueves todavia es jueves', async () => {
      const { caso, fijar } = armar(new InMemoryDatoCuriosoRepository(catalogo(10)));

      // 02:00 UTC del viernes 2 de octubre son las 9 p. m. del jueves 1 en Bogota.
      fijar(new Date('2026-10-02T02:00:00.000Z'));

      await expect(caso.execute(unaCuenta({ id: A }))).resolves.toMatchObject({
        dia: '2026-10-01',
      });
    });

    it('cambia pasada la medianoche de Colombia', async () => {
      const { caso, fijar } = armar(new InMemoryDatoCuriosoRepository(catalogo(10)));
      const cuenta = unaCuenta({ id: A });

      fijar(new Date('2026-10-02T04:59:00.000Z'));
      const antes = await caso.execute(cuenta);
      fijar(new Date('2026-10-02T05:01:00.000Z'));
      const despues = await caso.execute(cuenta);

      expect(despues.dia).toBe('2026-10-02');
      expect(despues.dato?.id).not.toBe(antes.dato?.id);
    });

    it('si el reloj va hacia atras (un viaje) no avanza ni repite: sigue con el mismo', async () => {
      const { caso, fijar } = armar(new InMemoryDatoCuriosoRepository(catalogo(10)));
      const cuenta = unaCuenta({ id: A });

      fijar(elDia('2026-10-05'));
      const primero = await caso.execute(cuenta);
      fijar(elDia('2026-10-04'));
      const luego = await caso.execute(cuenta);

      expect(luego.dato?.id).toBe(primero.dato?.id);
    });
  });

  describe('el ciclo', () => {
    it('recorre todo el catalogo una vez sin repetir ninguno', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(12));
      const textos = await recorrer(repositorio, A, dias('2026-10-01', 12));

      expect(new Set(textos).size).toBe(12);
    });

    it('al terminar empieza un ciclo nuevo, y es el mismo orden', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(6));
      const textos = await recorrer(repositorio, A, dias('2026-10-01', 12));

      expect(textos.slice(6)).toEqual(textos.slice(0, 6));
    });

    it('cada persona tiene su propio orden', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(30));
      const deA = await recorrer(repositorio, A, dias('2026-10-01', 30));
      const deB = await recorrer(repositorio, B, dias('2026-10-01', 30));

      // Los dos ven todo el catalogo, pero no en el mismo orden.
      expect(new Set(deA)).toEqual(new Set(deB));
      expect(deA).not.toEqual(deB);
    });

    it('el orden de una persona es el mismo cada vez que se calcula', async () => {
      const uno = await recorrer(
        new InMemoryDatoCuriosoRepository(catalogo(15)),
        A,
        dias('2026-10-01', 15),
      );
      const otro = await recorrer(
        new InMemoryDatoCuriosoRepository(catalogo(15)),
        A,
        dias('2026-10-01', 15),
      );

      expect(otro).toEqual(uno);
    });

    it('funciona con un catalogo de un solo dato: sale cada dia, sin romperse', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(1));
      const textos = await recorrer(repositorio, A, dias('2026-10-01', 3));

      expect(textos).toEqual(['Dato 1', 'Dato 1', 'Dato 1']);
    });
  });

  describe('si el catalogo cambia con el ciclo en curso', () => {
    it('un dato nuevo no hace repetir ninguno de los ya vistos', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(20));
      const vistos = await recorrer(repositorio, A, dias('2026-10-01', 8));

      repositorio.agregar(dato(99));

      // Lo que queda del ciclo: nadie de los 8 ya vistos puede volver a salir.
      const siguientes = await recorrer(repositorio, A, dias('2026-10-09', 12));

      for (const texto of siguientes) {
        expect(vistos).not.toContain(texto);
      }

      expect(new Set(siguientes).size).toBe(siguientes.length);
    });

    it('un dato retirado se salta, y no sale ni como relleno', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(10));
      const todos = await recorrer(repositorio, A, dias('2026-10-01', 10));

      // Con el ciclo vuelto a empezar, se retira el dato que seria el de hoy.
      const retirado = todos[0] as string;
      const id = catalogo(10).find((uno) => uno.texto === retirado)?.id as string;

      repositorio.retirar(id);

      const otraVez = await recorrer(repositorio, A, dias('2026-10-11', 9));

      expect(otraVez).not.toContain(retirado);
      expect(new Set(otraVez).size).toBe(9);
    });

    it('un dato borrado del catalogo no rompe el cursor', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(10));
      const { caso, fijar } = armar(repositorio);
      const cuenta = unaCuenta({ id: A });

      fijar(elDia('2026-10-01'));
      const hoy = await caso.execute(cuenta);

      repositorio.borrar(hoy.dato?.id as string);

      // Mismo dia: el dato ya no existe, asi que se le da otro en lugar de fallar.
      const mismoDia = await caso.execute(cuenta);

      expect(mismoDia.dato?.id).not.toBe(hoy.dato?.id);
      expect(mismoDia.dia).toBe('2026-10-01');
    });

    it('un dato retirado a mitad del dia lo conserva quien ya lo tiene como el de hoy', async () => {
      const repositorio = new InMemoryDatoCuriosoRepository(catalogo(10));
      const { caso, fijar } = armar(repositorio);
      const cuenta = unaCuenta({ id: A });

      fijar(elDia('2026-10-01', 7));
      const hoy = await caso.execute(cuenta);

      repositorio.retirar(hoy.dato?.id as string);
      fijar(elDia('2026-10-01', 20));

      await expect(caso.execute(cuenta)).resolves.toMatchObject({
        dato: { id: hoy.dato?.id },
      });
    });
  });
});
