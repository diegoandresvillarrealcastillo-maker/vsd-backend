import { describe, expect, it } from 'vitest';
import {
  Activity,
  DireccionEscala,
  type Frecuencia,
  MECANICAS_ROTATIVAS_POR_DIA,
} from './Activity.js';
import { ActivityId } from './Identifier.js';
import type { Motor } from './Motor.js';
import { Modulo } from './Preferencias.js';
import { type Hecho, MINIMO_SUGERIDO_POR_DIA, etapaPara, progresoDelModulo } from './Sendero.js';

const HOY = '2026-10-02';
const AYER = '2026-10-01';
const VIERNES = 5;

let siguiente = 0;

function actividad(
  frecuencia: Frecuencia = { tipo: 'diaria' },
  desdeSesion = 1,
  motor?: Motor,
): Activity {
  siguiente++;

  return Activity.create({
    id: new ActivityId(`00000000-0000-4000-8000-${String(siguiente).padStart(12, '0')}`),
    nombre: `Actividad ${siguiente}`,
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
    frecuencia,
    desdeSesion,
    motor,
  });
}

const PERSONA = '11111111-1111-4111-8111-111111111111';

function hecho(cual: Activity, dia: string): Hecho {
  return { actividad: cual.id.value, dia };
}

function progreso(
  actividades: Activity[],
  hechos: Hecho[] = [],
  extra: { persona?: string; conSesion?: ReadonlySet<string>; hoy?: string } = {},
) {
  return progresoDelModulo({
    modulo: Modulo.BIENESTAR,
    actividades,
    hechos,
    hoy: extra.hoy ?? HOY,
    diaDeLaSemana: VIERNES,
    persona: extra.persona ?? PERSONA,
    // Por defecto, toda mecanica con motor tiene una sesion que ofrecer.
    conSesion: extra.conSesion ?? new Set(actividades.map((una) => una.id.value)),
  });
}

describe('etapaPara', () => {
  it.each([
    [0, 1, 0, 5],
    [4, 1, 4, 5],
    [5, 2, 0, 10],
    [14, 2, 9, 10],
    [15, 3, 0, 15],
    [30, 4, 0, 20],
    [49, 4, 19, 20],
  ])('con %i sesiones va en la etapa %i (%i de %i)', (sesiones, numero, hechas, total) => {
    expect(etapaPara(sesiones)).toEqual({
      numero,
      esTemporada: false,
      sesionesHechas: hechas,
      sesionesDeLaEtapa: total,
    });
  });

  it.each([
    [50, 1, 0],
    [74, 1, 24],
    [75, 2, 0],
    [130, 4, 5],
  ])(
    'despues de la cuarta etapa vienen temporadas: %i sesiones es la temporada %i',
    (sesiones, numero, hechas) => {
      expect(etapaPara(sesiones)).toEqual({
        numero,
        esTemporada: true,
        sesionesHechas: hechas,
        sesionesDeLaEtapa: 25,
      });
    },
  );
});

describe('progresoDelModulo: sin tope y con un minimo sugerido (SCRUM-184)', () => {
  const nombres = (actividades: readonly { actividad: Activity }[]) =>
    actividades.map(({ actividad: una }) => una.nombre);

  it('el minimo sugerido es de tres', () => {
    expect(MINIMO_SUGERIDO_POR_DIA).toBe(3);
  });

  it('no hay tope: con cinco que tocan hoy salen las cinco', () => {
    const cinco = [actividad(), actividad(), actividad(), actividad(), actividad()];

    const resultado = progreso(cinco);

    expect(resultado.hoy).toHaveLength(5);
    expect(resultado.sugeridas).toEqual([]);
  });

  it('hacer mas de tres el mismo dia es lo normal: todas siguen en la lista, hechas', () => {
    const cuatro = [actividad(), actividad(), actividad(), actividad()];
    const hechos = cuatro.map((una) => hecho(una, HOY));

    const resultado = progreso(cuatro, hechos);

    expect(resultado.hoy.filter(({ hecha }) => hecha)).toHaveLength(4);
    expect(resultado.sesiones).toBe(1);
  });

  it('con menos de tres hoy, sugiere otras del modulo hasta llegar a tres', () => {
    const hoyToca = actividad();
    const otroDia = actividad({ tipo: 'semanal', dias: [1] });
    const otroDiaMas = actividad({ tipo: 'semanal', dias: [2] });
    const otraMas = actividad({ tipo: 'semanal', dias: [3] });

    const resultado = progreso([hoyToca, otroDia, otroDiaMas, otraMas]);

    expect(nombres(resultado.hoy)).toEqual([hoyToca.nombre]);
    // Hasta completar el minimo, en el orden del catalogo.
    expect(nombres(resultado.sugeridas)).toEqual([otroDia.nombre, otroDiaMas.nombre]);
  });

  it('no sugiere de mas: con tres que tocan no sugiere ninguna', () => {
    const tres = [actividad(), actividad(), actividad()];
    const otra = actividad({ tipo: 'semanal', dias: [1] });

    expect(progreso([...tres, otra]).sugeridas).toEqual([]);
  });

  it('una sugerida no es una que toca: nunca se mezcla con lo de hoy', () => {
    const toca = actividad();
    const noToca = actividad({ tipo: 'semanal', dias: [1] });

    const resultado = progreso([toca, noToca]);

    expect(nombres(resultado.hoy)).toEqual([toca.nombre]);
    expect(nombres(resultado.sugeridas)).toEqual([noToca.nombre]);
  });

  it('no sugiere lo que todavia no se abre en la sesion en la que va', () => {
    const toca = actividad();
    const cerrada = actividad({ tipo: 'semanal', dias: [1] }, 9);

    expect(progreso([toca, cerrada]).sugeridas).toEqual([]);
  });

  it('no sugiere una unica que ya hizo otro dia: no vuelve', () => {
    const toca = actividad();
    const unica = actividad({ tipo: 'unica' });

    const resultado = progreso([toca, unica], [hecho(unica, AYER)]);

    expect(resultado.hoy.map(({ actividad: una }) => una.id.value)).toEqual([toca.id.value]);
    expect(resultado.sugeridas).toEqual([]);
  });

  it('una sugerida que ya hizo hoy se ve como hecha', () => {
    const toca = actividad();
    const noToca = actividad({ tipo: 'semanal', dias: [1] });

    const resultado = progreso([toca, noToca], [hecho(noToca, HOY)]);

    expect(resultado.sugeridas).toEqual([{ actividad: noToca, hecha: true }]);
  });

  it('la sugerencia no cuenta para la sesion: no suma sesiones ni cambia la etapa', () => {
    const toca = actividad();
    const noToca = actividad({ tipo: 'semanal', dias: [1] });

    const sin = progreso([toca]);
    const con = progreso([toca, noToca]);

    expect(con.sesiones).toBe(sin.sesiones);
    expect(con.etapa).toEqual(sin.etapa);
  });
});

describe('progresoDelModulo: las rotativas (ADR 0030, punto 7)', () => {
  const ids = (lista: readonly { actividad: Activity }[]) =>
    lista.map(({ actividad: una }) => una.id.value);

  const rotativa = () => actividad({ tipo: 'rotativa' }, 1, 'guia_paso_a_paso');

  /** El dia de hoy menos `n`, con la misma aritmetica de calendario del sistema. */
  const haceDias = (n: number) =>
    new Date(Date.parse(`${HOY}T00:00:00Z`) - n * 86_400_000).toISOString().slice(0, 10);

  it('se ofrecen hasta tres por modulo y por dia', () => {
    const seis = Array.from({ length: 6 }, rotativa);

    expect(MECANICAS_ROTATIVAS_POR_DIA).toBe(3);
    expect(progreso(seis).hoy).toHaveLength(3);
  });

  it('con menos de tres, se ofrecen todas', () => {
    const dos = [rotativa(), rotativa()];

    expect(ids(progreso(dos).hoy).sort()).toEqual(dos.map((una) => una.id.value).sort());
  });

  it('no le quitan lugar a lo demas: las diarias salen todas y ademas tres rotativas', () => {
    const diarias = [actividad(), actividad()];
    const rotativas = Array.from({ length: 5 }, rotativa);

    const resultado = progreso([...diarias, ...rotativas]);

    expect(resultado.hoy).toHaveLength(2 + 3);
    expect(ids(resultado.hoy)).toEqual(expect.arrayContaining(diarias.map((una) => una.id.value)));
  });

  it('primero las que nunca hizo', () => {
    const [r1, r2, r3, r4, r5] = Array.from({ length: 5 }, rotativa) as [
      Activity,
      Activity,
      Activity,
      Activity,
      Activity,
    ];
    const hechos = [hecho(r1, haceDias(1)), hecho(r2, haceDias(3)), hecho(r3, haceDias(10))];

    // Las dos que nunca hizo, y despues la que hace mas tiempo.
    expect(new Set(ids(progreso([r1, r2, r3, r4, r5], hechos).hoy))).toEqual(
      new Set([r4.id.value, r5.id.value, r3.id.value]),
    );
  });

  it('luego las que hace mas dias que no hace', () => {
    const [r1, r2, r3, r4] = Array.from({ length: 4 }, rotativa) as [
      Activity,
      Activity,
      Activity,
      Activity,
    ];
    const hechos = [
      hecho(r1, haceDias(1)),
      hecho(r2, haceDias(5)),
      hecho(r3, haceDias(2)),
      hecho(r4, haceDias(9)),
    ];

    // Se queda fuera la que hizo ayer.
    expect(new Set(ids(progreso([r1, r2, r3, r4], hechos).hoy))).toEqual(
      new Set([r4.id.value, r2.id.value, r3.id.value]),
    );
  });

  it('para saber hace cuanto la hizo cuenta la ultima vez, no la primera', () => {
    const [r1, r2, r3, r4] = Array.from({ length: 4 }, rotativa) as [
      Activity,
      Activity,
      Activity,
      Activity,
    ];
    const hechos = [
      hecho(r1, haceDias(30)),
      hecho(r1, haceDias(1)),
      hecho(r2, haceDias(4)),
      hecho(r3, haceDias(5)),
      hecho(r4, haceDias(6)),
    ];

    // La 1 la hizo hace 30 dias, pero tambien ayer: es la mas reciente y se queda fuera.
    expect(new Set(ids(progreso([r1, r2, r3, r4], hechos).hoy))).toEqual(
      new Set([r2.id.value, r3.id.value, r4.id.value]),
    );
  });

  it('las hechas hoy siguen visibles, como hechas, y ocupan sitio', () => {
    const cinco = Array.from({ length: 5 }, rotativa);
    const [, , , , hecha] = cinco as [Activity, Activity, Activity, Activity, Activity];

    const resultado = progreso(cinco, [hecho(hecha, HOY)]);

    expect(resultado.hoy).toHaveLength(3);
    expect(resultado.hoy.filter((una) => una.hecha).map((una) => una.actividad.id.value)).toEqual([
      hecha.id.value,
    ]);
  });

  it('si hizo mas de tres hoy, todas siguen visibles aunque pasen de tres: nada que ya hizo desaparece', () => {
    const cinco = Array.from({ length: 5 }, rotativa);
    const hechos = cinco.slice(0, 4).map((una) => hecho(una, HOY));

    const resultado = progreso(cinco, hechos);

    expect(resultado.hoy).toHaveLength(4);
    expect(resultado.hoy.every((una) => una.hecha)).toBe(true);
  });

  it('durante el dia, hacer una de las ofrecidas no cambia las otras', () => {
    const seis = Array.from({ length: 6 }, rotativa);
    const ofrecidas = new Set(ids(progreso(seis).hoy));

    expect(ofrecidas.size).toBe(3);

    for (const id of ofrecidas) {
      const hechaHoy = seis.find((una) => una.id.value === id)!;

      expect(new Set(ids(progreso(seis, [hecho(hechaHoy, HOY)]).hoy))).toEqual(ofrecidas);
    }
  });

  it('con historial tambien: hacer una de las ofrecidas no cambia las otras', () => {
    const seis = Array.from({ length: 6 }, rotativa);
    const historial = seis.map((una, i) => hecho(una, haceDias(i + 2)));
    const ofrecidas = new Set(ids(progreso(seis, historial).hoy));

    for (const id of ofrecidas) {
      const hechaHoy = seis.find((una) => una.id.value === id)!;

      expect(new Set(ids(progreso(seis, [...historial, hecho(hechaHoy, HOY)]).hoy))).toEqual(
        ofrecidas,
      );
    }
  });

  it('la misma persona ve lo mismo el mismo dia, en cada consulta', () => {
    const seis = Array.from({ length: 6 }, rotativa);

    expect(ids(progreso(seis).hoy)).toEqual(ids(progreso(seis).hoy));
  });

  it('cada persona tiene su propio orden cuando todo empata', () => {
    const seis = Array.from({ length: 6 }, rotativa);
    const conjuntos = new Set<string>();

    for (let i = 0; i < 40; i++) {
      const persona = `10000000-0000-4000-8000-${String(i).padStart(12, '0')}`;

      conjuntos.add(
        ids(progreso(seis, [], { persona }).hoy)
          .sort()
          .join(','),
      );
    }

    // Con 6 mecanicas y 3 lugares hay 20 conjuntos posibles: 40 personas no pueden ver todas lo mismo.
    expect(conjuntos.size).toBeGreaterThan(1);
  });

  it('el desempate cambia con el dia: sin hacer nada, no se queda siempre la misma tanda', () => {
    const seis = Array.from({ length: 6 }, rotativa);
    const conjuntos = new Set<string>();

    for (let i = 0; i < 40; i++) {
      conjuntos.add(
        ids(progreso(seis, [], { hoy: haceDias(-i) }).hoy)
          .sort()
          .join(','),
      );
    }

    expect(conjuntos.size).toBeGreaterThan(1);
  });

  it('conserva el orden del catalogo en lo que sale', () => {
    const lista = [actividad(), rotativa(), rotativa(), actividad(), rotativa(), rotativa()];

    const salida = ids(progreso(lista).hoy);
    const enElOrdenDeEntrada = lista.map((una) => una.id.value).filter((id) => salida.includes(id));

    expect(salida).toEqual(enElOrdenDeEntrada);
  });

  it('respeta desdeSesion como cualquier otra', () => {
    const cerrada = actividad({ tipo: 'rotativa' }, 9, 'guia_paso_a_paso');

    expect(ids(progreso([cerrada]).hoy)).toEqual([]);
  });

  it('una rotativa hecha hoy suma la sesion de hoy como cualquier otra', () => {
    const una = rotativa();

    expect(progreso([una], [hecho(una, HOY)]).sesiones).toBe(1);
  });

  it('las rotativas que no se ofrecen no se sugieren aparte: ya salen tres', () => {
    const seis = Array.from({ length: 6 }, rotativa);

    expect(progreso(seis).sugeridas).toEqual([]);
  });

  it('con una sola rotativa, las sugeridas completan el minimo con otras abiertas', () => {
    const una = rotativa();
    const semanal = actividad({ tipo: 'semanal', dias: [1] });

    const resultado = progreso([una, semanal]);

    expect(ids(resultado.hoy)).toEqual([una.id.value]);
    expect(ids(resultado.sugeridas)).toEqual([semanal.id.value]);
  });
});

describe('progresoDelModulo: una mecanica con motor solo se ofrece si tiene una sesion que dar', () => {
  const ids = (lista: readonly { actividad: Activity }[]) =>
    lista.map(({ actividad: una }) => una.id.value);

  it('una mecanica con motor y sin sesion disponible no sale ni en lo de hoy ni como sugerida', () => {
    const conSesion = actividad({ tipo: 'diaria' }, 1, 'secuencia');
    const sinSesion = actividad({ tipo: 'diaria' }, 1, 'secuencia');
    const semanalSinSesion = actividad({ tipo: 'semanal', dias: [1] }, 1, 'secuencia');

    const resultado = progreso([conSesion, sinSesion, semanalSinSesion], [], {
      conSesion: new Set([conSesion.id.value]),
    });

    expect(ids(resultado.hoy)).toEqual([conSesion.id.value]);
    expect(resultado.sugeridas).toEqual([]);
  });

  it('una rotativa sin sesion no ocupa uno de los tres lugares', () => {
    const buenas = Array.from({ length: 3 }, () => actividad({ tipo: 'rotativa' }, 1, 'calculo'));
    const sinSesion = actividad({ tipo: 'rotativa' }, 1, 'calculo');

    const resultado = progreso([sinSesion, ...buenas], [], {
      conSesion: new Set(buenas.map((una) => una.id.value)),
    });

    expect(new Set(ids(resultado.hoy))).toEqual(new Set(buenas.map((una) => una.id.value)));
  });

  it('las actividades sin motor (las nueve de hoy) salen igual aunque no figuren en el conjunto', () => {
    const sinMotor = actividad();

    expect(ids(progreso([sinMotor], [], { conSesion: new Set() }).hoy)).toEqual([
      sinMotor.id.value,
    ]);
  });
});

describe('progresoDelModulo', () => {
  it('una sesion es un dia con algo hecho, no cada actividad', () => {
    // Es el criterio de aceptacion del ticket: hacer otra actividad del mismo
    // modulo el mismo dia no vuelve a sumar.
    const a = actividad();
    const b = actividad();

    expect(progreso([a, b], [hecho(a, HOY)]).sesiones).toBe(1);
    expect(progreso([a, b], [hecho(a, HOY), hecho(b, HOY)]).sesiones).toBe(1);
    expect(progreso([a, b], [hecho(a, AYER), hecho(b, HOY)]).sesiones).toBe(2);
  });

  it('faltar dias no deja hueco', () => {
    const a = actividad();

    expect(progreso([a], [hecho(a, '2026-09-01'), hecho(a, HOY)]).sesiones).toBe(2);
  });

  it('marca como hecha lo que se hizo hoy, y no lo de ayer', () => {
    const a = actividad();
    const b = actividad();

    const hoy = progreso([a, b], [hecho(a, HOY), hecho(b, AYER)]).hoy;

    expect(hoy.map((una) => una.hecha)).toEqual([true, false]);
  });

  it('las semanales solo salen los dias indicados', () => {
    const viernes = actividad({ tipo: 'semanal', dias: [VIERNES] });
    const lunes = actividad({ tipo: 'semanal', dias: [1] });

    expect(progreso([viernes, lunes]).hoy.map((una) => una.actividad)).toEqual([viernes]);
  });

  it('una actividad unica hecha otro dia no vuelve a aparecer', () => {
    const unica = actividad({ tipo: 'unica' });

    expect(progreso([unica], [hecho(unica, AYER)]).hoy).toEqual([]);
  });

  it('una actividad unica hecha hoy se ve como hecha hasta manana', () => {
    const unica = actividad({ tipo: 'unica' });

    expect(progreso([unica], [hecho(unica, HOY)]).hoy).toEqual([{ actividad: unica, hecha: true }]);
  });

  it('las actividades se abren segun la sesion en la que va la persona', () => {
    const desdeElPrincipio = actividad();
    const desdeLaTercera = actividad({ tipo: 'diaria' }, 3);

    // Sin nada hecho, hoy es la sesion 1.
    expect(progreso([desdeElPrincipio, desdeLaTercera]).hoy).toHaveLength(1);

    // Con dos dias anteriores, hoy es la tercera.
    const conDosDias = progreso(
      [desdeElPrincipio, desdeLaTercera],
      [hecho(desdeElPrincipio, '2026-09-29'), hecho(desdeElPrincipio, AYER)],
    );

    expect(conDosDias.hoy).toHaveLength(2);
  });

  it('hacer algo hoy no cambia lo que toca hoy', () => {
    // Si hoy contara como una sesion mas al hacer la primera actividad, se
    // abririan actividades nuevas a mitad del dia.
    const desdeElPrincipio = actividad();
    const desdeLaSegunda = actividad({ tipo: 'diaria' }, 2);

    expect(
      progreso([desdeElPrincipio, desdeLaSegunda], [hecho(desdeElPrincipio, HOY)]).hoy,
    ).toHaveLength(1);
  });

  it('calcula la etapa a partir de las sesiones', () => {
    const a = actividad();
    const dias = ['2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'];

    expect(
      progreso(
        [a],
        dias.map((dia) => hecho(a, dia)),
      ).etapa,
    ).toMatchObject({
      numero: 2,
      sesionesHechas: 0,
    });
  });
});
