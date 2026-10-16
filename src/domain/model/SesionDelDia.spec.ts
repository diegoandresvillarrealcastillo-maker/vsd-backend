import { describe, expect, it } from 'vitest';
import { ActivityId, SesionId } from './Identifier.js';
import {
  type CandidataDeSesion,
  DIAS_SIN_REPETIR,
  type HechoDeSesion,
  elegirSesionDeHoy,
} from './SesionDelDia.js';
import { Revision, SesionDeActividad } from './SesionDeActividad.js';

const MECANICA = new ActivityId('33333333-3333-4333-a333-333333333333');
const HOY = '2026-10-16';

function id(n: number): string {
  return `55555555-5555-4555-a555-${n.toString(16).padStart(12, '0')}`;
}

function candidata(n: number, clave: bigint, publicado = true): CandidataDeSesion {
  return {
    sesion: SesionDeActividad.create({
      id: new SesionId(id(n)),
      idActividad: MECANICA,
      titulo: `Sesión ${n}`,
      nivel: 1,
      parametros: {},
      publicado,
      revision: Revision.NO_REQUIERE,
    }),
    clave,
  };
}

/** Un dia antes (o despues) de `base`: la aritmetica de calendario que usa el sistema. */
function dia(base: string, delta: number): string {
  return new Date(Date.parse(`${base}T00:00:00Z`) + delta * 86_400_000).toISOString().slice(0, 10);
}

function hecho(n: number, diaDelHecho: string, hora = '12:00:00'): HechoDeSesion {
  return { idSesion: id(n), dia: diaDelHecho, hechaEn: new Date(`${diaDelHecho}T${hora}Z`) };
}

function elegida(
  candidatas: readonly CandidataDeSesion[],
  hechos: readonly HechoDeSesion[] = [],
  hoy = HOY,
): string | null {
  return elegirSesionDeHoy(candidatas, hechos, hoy)?.id.value ?? null;
}

describe('elegirSesionDeHoy: sin historial (ADR 0030, punto 6)', () => {
  it('sin ninguna sesion, no hay cual elegir', () => {
    expect(elegida([])).toBeNull();
  });

  it('una sesion sin publicar no se ofrece', () => {
    expect(elegida([candidata(1, 5n, false)])).toBeNull();
  });

  it('entre las publicadas, la de menor clave', () => {
    expect(elegida([candidata(1, 30n), candidata(2, 10n), candidata(3, 20n)])).toBe(id(2));
  });

  it('a igual clave, la de menor identificador: el orden nunca queda al azar', () => {
    expect(elegida([candidata(3, 7n), candidata(1, 7n), candidata(2, 7n)])).toBe(id(1));
  });

  it('la de menor clave que esta sin publicar se salta', () => {
    expect(elegida([candidata(1, 1n, false), candidata(2, 50n)])).toBe(id(2));
  });

  it('el orden en que llegan las candidatas no cambia nada', () => {
    const todas = [candidata(1, 30n), candidata(2, 10n), candidata(3, 20n), candidata(4, 40n)];

    expect(elegida([...todas].reverse())).toBe(elegida(todas));
    expect(elegida([todas[2]!, todas[0]!, todas[3]!, todas[1]!])).toBe(elegida(todas));
  });
});

describe('elegirSesionDeHoy: lo que ya hizo hoy', () => {
  it('si ya hizo una hoy, es esa aunque otra tenga menor clave', () => {
    const candidatas = [candidata(1, 1n), candidata(2, 99n)];

    expect(elegida(candidatas, [hecho(2, HOY)])).toBe(id(2));
  });

  it('si la repitio, la ultima que hizo', () => {
    const candidatas = [candidata(1, 1n), candidata(2, 2n), candidata(3, 3n)];
    const hechos = [
      hecho(1, HOY, '08:00:00'),
      hecho(3, HOY, '20:00:00'),
      hecho(2, HOY, '12:00:00'),
    ];

    expect(elegida(candidatas, hechos)).toBe(id(3));
  });

  it('si hizo la misma dos veces hoy, sigue siendo esa', () => {
    const candidatas = [candidata(1, 1n), candidata(2, 2n)];

    expect(elegida(candidatas, [hecho(2, HOY, '08:00:00'), hecho(2, HOY, '09:00:00')])).toBe(id(2));
  });

  it('una sesion retirada despues de servirse se sigue ofreciendo a quien la hizo hoy', () => {
    // Quien la tenia abierta puede terminarla; y hasta manana es «la de hoy».
    const candidatas = [candidata(1, 1n), candidata(2, 99n, false)];

    expect(elegida(candidatas, [hecho(2, HOY)])).toBe(id(2));
  });

  it('una retirada que hizo ayer no vuelve', () => {
    const candidatas = [candidata(1, 99n), candidata(2, 1n, false)];

    expect(elegida(candidatas, [hecho(2, dia(HOY, -1))])).toBe(id(1));
  });

  it('lo que hizo de otra mecanica (una sesion que no esta entre las candidatas) no cuenta', () => {
    expect(
      elegida([candidata(1, 5n), candidata(2, 9n)], [hecho(99, HOY), hecho(98, dia(HOY, -1))]),
    ).toBe(id(1));
  });
});

describe('elegirSesionDeHoy: no se repite hasta agotar las demas', () => {
  it('lo que hizo ayer pasa a la siguiente por clave', () => {
    const candidatas = [candidata(1, 10n), candidata(2, 20n), candidata(3, 30n)];

    expect(elegida(candidatas, [hecho(1, dia(HOY, -1))])).toBe(id(2));
    expect(elegida(candidatas, [hecho(1, dia(HOY, -2)), hecho(2, dia(HOY, -1))])).toBe(id(3));
  });

  it('recorre todas en el orden de su clave, una por dia, y luego empieza otra vez en el mismo orden', () => {
    const candidatas = Array.from({ length: 12 }, (_, i) =>
      candidata(i + 1, BigInt((i * 7919) % 101)),
    );
    const hechos: HechoDeSesion[] = [];
    const vistas: string[] = [];

    for (let d = 0; d < 36; d++) {
      const hoy = dia('2026-01-01', d);
      const sesion = elegida(candidatas, hechos, hoy);

      expect(sesion).not.toBeNull();
      vistas.push(sesion!);
      hechos.push({ idSesion: sesion!, dia: hoy, hechaEn: new Date(`${hoy}T12:00:00Z`) });
    }

    const primeraVuelta = vistas.slice(0, 12);

    // Ninguna se repite antes de haber salido las doce...
    expect(new Set(primeraVuelta).size).toBe(12);
    // ... y el ciclo vuelve a empezar en el mismo orden.
    expect(vistas.slice(12, 24)).toEqual(primeraVuelta);
    expect(vistas.slice(24, 36)).toEqual(primeraVuelta);
  });

  it('una sesion nueva entra donde le toca por su clave: si es menor que las que faltan, es la siguiente', () => {
    const antes = [candidata(1, 10n), candidata(2, 20n), candidata(3, 30n)];
    const hechos = [hecho(1, dia(HOY, -2)), hecho(2, dia(HOY, -1))];

    expect(elegida(antes, hechos)).toBe(id(3));
    // Llega una con clave menor que la 3: se ofrece antes, sin mover lo ya visto.
    expect(elegida([...antes, candidata(4, 25n)], hechos)).toBe(id(4));
    // Una con clave mayor espera su turno.
    expect(elegida([...antes, candidata(5, 99n)], hechos)).toBe(id(3));
  });

  it('retirar una que faltaba la salta sin repetir ninguna', () => {
    const candidatas = [candidata(1, 10n), candidata(2, 20n, false), candidata(3, 30n)];

    expect(elegida(candidatas, [hecho(1, dia(HOY, -1))])).toBe(id(3));
  });

  it('el resultado no depende del orden en que llegaron los hechos (ADR 0019: sin conexion)', () => {
    const candidatas = [candidata(1, 10n), candidata(2, 20n), candidata(3, 30n), candidata(4, 40n)];
    const hechos = [hecho(1, dia(HOY, -3)), hecho(2, dia(HOY, -2)), hecho(3, dia(HOY, -1))];

    expect(elegida(candidatas, [...hechos].reverse())).toBe(elegida(candidatas, hechos));
    expect(elegida(candidatas, hechos)).toBe(id(4));
  });
});

describe('elegirSesionDeHoy: la ventana de 365 dias', () => {
  const candidatas = [candidata(1, 10n), candidata(2, 20n)];

  it('la ventana es de 365 dias', () => {
    expect(DIAS_SIN_REPETIR).toBe(365);
  });

  it('con una hecha hace 364 dias y la otra hace 363, ninguna esta libre: la que hizo hace mas tiempo', () => {
    const hechos = [hecho(2, dia(HOY, -363)), hecho(1, dia(HOY, -364))];

    expect(elegida(candidatas, hechos)).toBe(id(1));
  });

  it('una hecha hace exactamente 365 dias vuelve a estar libre', () => {
    // Con 365 sesiones y una por dia, la del primer dia es la que toca el dia 366.
    const hechos = [hecho(1, dia(HOY, -365)), hecho(2, dia(HOY, -1))];

    expect(elegida(candidatas, hechos)).toBe(id(1));
  });

  it('a los 365 dias vuelve a competir por su clave con las que ya estaban libres', () => {
    // Si el borde fuera 366, la 2 seria la unica libre y ganaria; con 365 las dos lo estan y gana la
    // de menor clave, que es la 1.
    const hechos = [hecho(1, dia(HOY, -365)), hecho(2, dia(HOY, -366))];

    expect(elegida(candidatas, hechos)).toBe(id(1));
  });

  it('a los 364 dias todavia no compite: gana otra libre aunque tenga mayor clave', () => {
    // Si el borde fuera 364, la 1 estaria libre y ganaria por su clave; con 365 solo lo esta la 2.
    const hechos = [hecho(1, dia(HOY, -364)), hecho(2, dia(HOY, -400))];

    expect(elegida(candidatas, hechos)).toBe(id(2));
  });

  it('una hecha hace 364 dias todavia no esta libre', () => {
    const hechos = [hecho(1, dia(HOY, -364)), hecho(2, dia(HOY, -1))];

    // Ninguna libre: la que hizo hace mas tiempo es la 1.
    expect(elegida(candidatas, hechos)).toBe(id(1));
    // Y con una tercera que nunca hizo, esa va primero.
    expect(elegida([...candidatas, candidata(3, 99n)], hechos)).toBe(id(3));
  });

  it('entre las libres por vencimiento, manda la clave y no cuanto hace que las hizo', () => {
    // La 2 la hizo hace 800 dias y la 1 hace 400: las dos estan libres, y la de menor clave es la 1.
    const hechos = [hecho(1, dia(HOY, -400)), hecho(2, dia(HOY, -800))];

    expect(elegida(candidatas, hechos)).toBe(id(1));
  });

  it('cuando ya hizo todas dentro de la ventana, la que hizo hace mas tiempo; a igual dia, la de menor clave', () => {
    const tres = [candidata(1, 30n), candidata(2, 20n), candidata(3, 10n)];

    expect(
      elegida(tres, [hecho(1, dia(HOY, -3)), hecho(2, dia(HOY, -2)), hecho(3, dia(HOY, -1))]),
    ).toBe(id(1));
    expect(
      elegida(tres, [hecho(1, dia(HOY, -2)), hecho(2, dia(HOY, -2)), hecho(3, dia(HOY, -1))]),
    ).toBe(id(2));
  });

  it('para una sesion cuenta su hecho mas reciente, no el primero', () => {
    const hechos = [hecho(1, dia(HOY, -400)), hecho(1, dia(HOY, -5)), hecho(2, dia(HOY, -3))];

    // La 1 la hizo hace 400 dias pero tambien hace 5: no esta libre. Ninguna lo esta; la mas antigua
    // por su ultimo hecho es la 1 (hace 5 dias contra hace 3).
    expect(elegida(candidatas, hechos)).toBe(id(1));
  });
});

describe('elegirSesionDeHoy: no cambia lo que recibe', () => {
  it('no modifica las candidatas ni los hechos', () => {
    const candidatas = [candidata(2, 20n), candidata(1, 10n)];
    const hechos = [hecho(1, dia(HOY, -1))];
    const copiaDeCandidatas = [...candidatas];
    const copiaDeHechos = [...hechos];

    elegirSesionDeHoy(candidatas, hechos, HOY);

    expect(candidatas).toEqual(copiaDeCandidatas);
    expect(hechos).toEqual(copiaDeHechos);
  });
});
