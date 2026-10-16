import { type Activity, MECANICAS_ROTATIVAS_POR_DIA } from './Activity.js';
import type { Dia } from './Calendario.js';
import { claveDeLaMecanica } from './ClaveEstable.js';
import type { Modulo } from './Preferencias.js';
import type { SesionDeActividad } from './SesionDeActividad.js';

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

/**
 * Cuantas actividades se sugieren al dia, **como minimo y sin imponerlas** (SCRUM-184).
 *
 * No es un tope: no hay ninguno, y hacer cinco en un dia es lo normal. Es el piso de lo que se
 * ensena, para que un dia en que por frecuencia tocan pocas no quede una ruta casi vacia. Lo
 * sugerido no cuenta para el plan del dia, ni para la sesion, ni para la racha: nada castiga.
 */
export const MINIMO_SUGERIDO_POR_DIA = 3;

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
  /**
   * El contenido de hoy de una mecanica con motor (ADR 0030). Lo pone quien arma el sendero, que es
   * quien sabe que sesion le toca a esta persona; el calculo del sendero no la conoce. Ausente en las
   * actividades sin motor, que son las nueve de hoy.
   */
  readonly sesion?: SesionDeActividad | undefined;
}

export interface ProgresoDelModulo {
  readonly modulo: Modulo;
  /** Dias distintos en los que hizo algo de este modulo. */
  readonly sesiones: number;
  readonly etapa: Etapa;
  /** Lo que toca hoy por su frecuencia. Sin tope. */
  readonly hoy: readonly ActividadDeHoy[];
  /**
   * Otras del modulo, abiertas y que hoy no tocan, hasta completar `MINIMO_SUGERIDO_POR_DIA`
   * con `hoy` (SCRUM-184). Vacia cuando `hoy` ya llega al minimo. Es una **sugerencia**:
   * no entra al plan del dia ni a nada que se cuente.
   */
  readonly sugeridas: readonly ActividadDeHoy[];
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
  /** La persona. Solo para el orden propio de la rotacion (`claveDeLaMecanica`); no sale del dominio. */
  readonly persona: string;
  /**
   * Las mecanicas con motor que hoy tienen una sesion que ofrecer a esta persona (ADR 0030).
   *
   * Una mecanica con motor y sin sesion no se puede hacer: se deja fuera de lo de hoy y de lo
   * sugerido, y no ocupa uno de los lugares de la rotacion. Las que no tienen motor (las nueve de
   * hoy) no dependen de este conjunto. Es obligatorio a proposito: olvidarlo mostraria tarjetas que
   * no se pueden abrir.
   */
  readonly conSesion: ReadonlySet<string>;
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
 * - **No hay tope diario** (SCRUM-184): lo que toca hoy sale entero, y nada impide hacer mas.
 *   Si tocan menos de `MINIMO_SUGERIDO_POR_DIA`, se sugieren otras abiertas del modulo hasta
 *   completarlo; no son obligatorias ni cuentan para nada.
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

  const abiertas = datos.actividades.filter(
    (actividad) =>
      actividad.desdeSesion <= sesionDeHoy &&
      (actividad.motor === undefined || datos.conSesion.has(actividad.id.value)),
  );
  const rotativasDeHoy = elegirRotativasDeHoy(abiertas, datos.hechos, datos.hoy, datos.persona);
  const tocan = abiertas.filter((actividad) => {
    switch (actividad.frecuencia.tipo) {
      case 'diaria':
        return true;
      case 'semanal':
        return actividad.frecuencia.dias.includes(datos.diaDeLaSemana);
      case 'unica':
        return !hechasAntes.has(actividad.id.value);
      case 'rotativa':
        return rotativasDeHoy.has(actividad.id.value);
    }
  });
  const comoDeHoy = (actividad: Activity): ActividadDeHoy => ({
    actividad,
    hecha: hechasHoy.has(actividad.id.value),
  });

  const idsQueTocan = new Set(tocan.map((actividad) => actividad.id.value));
  const faltan = Math.max(0, MINIMO_SUGERIDO_POR_DIA - tocan.length);
  const sugeridas = abiertas
    .filter((actividad) => !idsQueTocan.has(actividad.id.value))
    // Una unica ya hecha en otro dia no vuelve, ni como sugerencia.
    .filter(
      (actividad) =>
        !(actividad.frecuencia.tipo === 'unica' && hechasAntes.has(actividad.id.value)),
    )
    .slice(0, faltan)
    .map(comoDeHoy);

  return {
    modulo: datos.modulo,
    sesiones,
    etapa: etapaPara(sesiones),
    hoy: tocan.map(comoDeHoy),
    sugeridas,
  };
}

/**
 * Cuales de las mecanicas rotativas de un modulo se ofrecen hoy (ADR 0030, punto 7): hasta
 * `MECANICAS_ROTATIVAS_POR_DIA`, elegidas por
 *
 * 1. **las hechas hoy**, que siguen visibles: nada que la persona ya hizo desaparece de su lista;
 * 2. luego **las que hace mas dias que no hace**, y antes que todas las que nunca hizo;
 * 3. y a igual antiguedad, **la clave propia de cada persona y dia**.
 *
 * Es estable durante el dia: hacer una de las ofrecidas la pasa al primer grupo y deja el mismo conjunto,
 * porque las demas ya estaban por delante de las que se quedaron fuera. Solo se mueve si la persona
 * hace algo que no se le ofrecia, y entonces se queda con tres sitios contando lo hecho.
 *
 * Las hechas hoy pueden pasar de tres: no se esconde lo que alguien acaba de hacer para cumplir una cifra.
 * La rotacion tampoco limita lo que se puede hacer (SCRUM-184), solo reparte lo que se muestra.
 */
function elegirRotativasDeHoy(
  abiertas: readonly Activity[],
  hechos: readonly Hecho[],
  hoy: Dia,
  persona: string,
): ReadonlySet<string> {
  const rotativas = abiertas.filter((actividad) => actividad.frecuencia.tipo === 'rotativa');

  if (rotativas.length === 0) {
    return new Set();
  }

  const hechasHoy = new Set(
    hechos.filter((hecho) => hecho.dia === hoy).map((hecho) => hecho.actividad),
  );
  const ultimoDia = new Map<string, Dia>();

  for (const hecho of hechos) {
    const previo = ultimoDia.get(hecho.actividad);

    // Un dia es un texto AAAA-MM-DD: comparado como texto, ordena como fecha.
    if (previo === undefined || hecho.dia > previo) {
      ultimoDia.set(hecho.actividad, hecho.dia);
    }
  }

  const deHoy = rotativas.filter((actividad) => hechasHoy.has(actividad.id.value));
  const claves = new Map(
    rotativas.map((actividad) => [
      actividad.id.value,
      claveDeLaMecanica(actividad.id.value, persona, hoy),
    ]),
  );

  const candidatas = rotativas
    .filter((actividad) => !hechasHoy.has(actividad.id.value))
    .sort((una, otra) => {
      // Las que nunca hizo van primero (no tienen ultimo dia), y luego la mas antigua.
      const delaUna = ultimoDia.get(una.id.value) ?? '';
      const delaOtra = ultimoDia.get(otra.id.value) ?? '';

      if (delaUna !== delaOtra) {
        return delaUna < delaOtra ? -1 : 1;
      }

      const claveDeUna = claves.get(una.id.value) ?? 0n;
      const claveDeOtra = claves.get(otra.id.value) ?? 0n;

      if (claveDeUna !== claveDeOtra) {
        return claveDeUna < claveDeOtra ? -1 : 1;
      }

      return una.id.value.localeCompare(otra.id.value);
    });

  const lugares = Math.max(0, MECANICAS_ROTATIVAS_POR_DIA - deHoy.length);

  return new Set(
    [...deHoy, ...candidatas.slice(0, lugares)].map((actividad) => actividad.id.value),
  );
}
