import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala, type Frecuencia } from './Activity.js';
import { ActivityId } from './Identifier.js';
import { Modulo } from './Preferencias.js';
import { type Hecho, MINIMO_SUGERIDO_POR_DIA, etapaPara, progresoDelModulo } from './Sendero.js';

const HOY = '2026-10-02';
const AYER = '2026-10-01';
const VIERNES = 5;

let siguiente = 0;

function actividad(frecuencia: Frecuencia = { tipo: 'diaria' }, desdeSesion = 1): Activity {
  siguiente++;

  return Activity.create({
    id: new ActivityId(`00000000-0000-4000-8000-${String(siguiente).padStart(12, '0')}`),
    nombre: `Actividad ${siguiente}`,
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
    frecuencia,
    desdeSesion,
  });
}

function hecho(cual: Activity, dia: string): Hecho {
  return { actividad: cual.id.value, dia };
}

function progreso(actividades: Activity[], hechos: Hecho[] = []) {
  return progresoDelModulo({
    modulo: Modulo.BIENESTAR,
    actividades,
    hechos,
    hoy: HOY,
    diaDeLaSemana: VIERNES,
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
