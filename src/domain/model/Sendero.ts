import type { Activity } from './Activity.js';
import type { Dia } from './Calendario.js';
import type { Modulo } from './Preferencias.js';

/**
 * El sendero de cada modulo: en que etapa va la persona y que le toca hoy
 * (SCRUM-91).
 *
 * Todo se calcula a partir de lo que ya hizo. No se guarda un contador aparte:
 * un contador puede desincronizarse de los resultados, y entonces la pantalla
 * diria una cosa y el historial otra.
 */

/**
 * Cuantas sesiones dura cada etapa. Despues de la ultima vienen temporadas de
 * `SESIONES_POR_TEMPORADA`, sin fin.
 *
 * Empiezan cortas a proposito: la primera etapa se completa en una semana, y
 * eso es lo que hace que alguien vuelva la segunda.
 */
export const SESIONES_POR_ETAPA = [5, 10, 15, 20] as const;
export const SESIONES_POR_TEMPORADA = 25;

/** Donde va la persona dentro del sendero de un modulo. */
export interface Etapa {
  /** 1 a 4 para las etapas; desde 1 otra vez para las temporadas. */
  readonly numero: number;
  readonly esTemporada: boolean;
  /** Sesiones hechas dentro de esta etapa. */
  readonly sesionesHechas: number;
  /** Cuantas tiene la etapa en total. */
  readonly sesionesDeLaEtapa: number;
}

/**
 * La etapa que corresponde a un numero de sesiones hechas.
 *
 * Al completar una etapa se pasa a la siguiente con cero hechas: con 5
 * sesiones ya se esta en la etapa 2, no al final de la 1.
 */
export function etapaPara(sesiones: number): Etapa {
  let restantes = Math.max(0, Math.floor(sesiones));

  for (const [indice, duracion] of SESIONES_POR_ETAPA.entries()) {
    if (restantes < duracion) {
      return {
        numero: indice + 1,
        esTemporada: false,
        sesionesHechas: restantes,
        sesionesDeLaEtapa: duracion,
      };
    }

    restantes -= duracion;
  }

  return {
    numero: Math.floor(restantes / SESIONES_POR_TEMPORADA) + 1,
    esTemporada: true,
    sesionesHechas: restantes % SESIONES_POR_TEMPORADA,
    sesionesDeLaEtapa: SESIONES_POR_TEMPORADA,
  };
}

/** Algo que la persona hizo, reducido a lo que importa aqui. */
export interface Hecho {
  readonly actividad: string;
  readonly dia: Dia;
}

/** Una actividad de hoy, con si ya esta hecha. */
export interface ActividadDeHoy {
  readonly actividad: Activity;
  readonly hecha: boolean;
}

export interface ProgresoDelModulo {
  readonly modulo: Modulo;
  /** Dias distintos en los que hizo algo de este modulo. */
  readonly sesiones: number;
  readonly etapa: Etapa;
  readonly hoy: readonly ActividadDeHoy[];
}

/** Lo que hace falta para calcular el progreso de un modulo. */
export interface DatosDelModulo {
  readonly modulo: Modulo;
  /** Las actividades del modulo que estan en el catalogo. */
  readonly actividades: readonly Activity[];
  /** Lo que la persona hizo de este modulo, de cualquier dia. */
  readonly hechos: readonly Hecho[];
  readonly hoy: Dia;
  /** 1 es lunes y 7 domingo. */
  readonly diaDeLaSemana: number;
}

/**
 * Calcula el progreso de un modulo.
 *
 * - **Una sesion es un dia** en el que hizo algo del modulo. Dos actividades
 *   el mismo dia suman una sesion, y faltar un dia no deja hueco: el sendero
 *   no castiga.
 * - **Lo que toca hoy** depende de la frecuencia de cada actividad y de la
 *   sesion en la que esta la persona. Hoy cuenta como la sesion siguiente a
 *   las que ya tenia, la haya empezado o no.
 * - Una actividad **unica** hecha otro dia no vuelve; hecha hoy, se ve como
 *   hecha hasta manana.
 */
export function progresoDelModulo(datos: DatosDelModulo): ProgresoDelModulo {
  const diasConAlgo = new Set(datos.hechos.map((hecho) => hecho.dia));
  const sesiones = diasConAlgo.size;
  const sesionesAntesDeHoy = sesiones - (diasConAlgo.has(datos.hoy) ? 1 : 0);
  const sesionDeHoy = sesionesAntesDeHoy + 1;

  const hechasHoy = new Set(
    datos.hechos.filter((hecho) => hecho.dia === datos.hoy).map((hecho) => hecho.actividad),
  );
  const hechasAntes = new Set(
    datos.hechos.filter((hecho) => hecho.dia < datos.hoy).map((hecho) => hecho.actividad),
  );

  const hoy = datos.actividades
    .filter((actividad) => actividad.desdeSesion <= sesionDeHoy)
    .filter((actividad) => {
      switch (actividad.frecuencia.tipo) {
        case 'diaria':
          return true;
        case 'semanal':
          return actividad.frecuencia.dias.includes(datos.diaDeLaSemana);
        case 'unica':
          return !hechasAntes.has(actividad.id.value);
      }
    })
    .map((actividad) => ({ actividad, hecha: hechasHoy.has(actividad.id.value) }));

  return { modulo: datos.modulo, sesiones, etapa: etapaPara(sesiones), hoy };
}
