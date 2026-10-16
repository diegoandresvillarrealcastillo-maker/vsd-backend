import { type Dia, Calendario } from './Calendario.js';
import type { SesionDeActividad } from './SesionDeActividad.js';

/**
 * Cuantos dias tienen que pasar para que una persona vuelva a ver una sesion que ya hizo (ADR 0030).
 *
 * Una sesion hecha el dia D vuelve a ser elegible el dia D + 365: con 365 sesiones y una por dia, la del
 * primer dia es la que toca el dia 366.
 */
export const DIAS_SIN_REPETIR = 365;

/** Una sesion de la mecanica y su lugar en el orden de esta persona. */
export interface CandidataDeSesion {
  readonly sesion: SesionDeActividad;
  /** `claveDeLaSesion(sesion, persona)`: el orden propio de esta persona. */
  readonly clave: bigint;
}

/** Una vez que la persona hizo una sesion. */
export interface HechoDeSesion {
  readonly idSesion: string;
  /** El dia, en la zona de la persona, en que la hizo (el de `resultado.dia`). */
  readonly dia: Dia;
  readonly hechaEn: Date;
}

function porClave(uno: CandidataDeSesion, otro: CandidataDeSesion): number {
  if (uno.clave !== otro.clave) {
    return uno.clave < otro.clave ? -1 : 1;
  }

  return uno.sesion.id.value.localeCompare(otro.sesion.id.value);
}

/**
 * Que sesion de una mecanica le toca hoy a una persona (ADR 0030, punto 6).
 *
 * `candidatas` son **todas** las sesiones de esa mecanica, publicadas o no; `hechos`, lo que esa
 * persona hizo de ellas. En orden:
 *
 * 1. **Si ya hizo una hoy, es esa** (la ultima, si repitio). Aunque se haya retirado despues de
 *    servirse: quien la tenia abierta puede terminarla, y la actividad sale como hecha sin ofrecerle
 *    otra el mismo dia.
 * 2. Si no, entre las publicadas, **la de menor clave que no hizo en los ultimos 365 dias**.
 * 3. Si ya las hizo todas, **la que hizo hace mas tiempo**: el ciclo empieza otra vez, en el mismo
 *    orden.
 *
 * Es una funcion de lo que la persona hizo, y de nada mas. No depende del orden en que llegaron los
 * resultados (ADR 0019: algunos llegan horas despues, desde una cola sin conexion) y no guarda un
 * cursor que pueda desincronizarse del historial. Una sesion nueva entra donde le toca por su clave;
 * una retirada se salta.
 *
 * Devuelve `null` si la mecanica no tiene ninguna sesion que ofrecer.
 */
export function elegirSesionDeHoy(
  candidatas: readonly CandidataDeSesion[],
  hechos: readonly HechoDeSesion[],
  hoy: Dia,
): SesionDeActividad | null {
  const conocidas = new Set(candidatas.map((candidata) => candidata.sesion.id.value));
  const ultimoDia = new Map<string, Dia>();
  const ultimaHoraDeHoy = new Map<string, number>();

  for (const hecho of hechos) {
    if (!conocidas.has(hecho.idSesion)) {
      continue;
    }

    const previo = ultimoDia.get(hecho.idSesion);

    // Un dia es un texto AAAA-MM-DD: comparado como texto, ordena como fecha.
    if (previo === undefined || hecho.dia > previo) {
      ultimoDia.set(hecho.idSesion, hecho.dia);
    }

    if (hecho.dia === hoy) {
      const hora = hecho.hechaEn.getTime();
      const anterior = ultimaHoraDeHoy.get(hecho.idSesion);

      if (anterior === undefined || hora > anterior) {
        ultimaHoraDeHoy.set(hecho.idSesion, hora);
      }
    }
  }

  const deHoy = candidatas
    .filter((candidata) => ultimaHoraDeHoy.has(candidata.sesion.id.value))
    .sort((uno, otro) => {
      const diferencia =
        (ultimaHoraDeHoy.get(otro.sesion.id.value) ?? 0) -
        (ultimaHoraDeHoy.get(uno.sesion.id.value) ?? 0);

      return diferencia !== 0 ? diferencia : porClave(uno, otro);
    })[0];

  if (deHoy !== undefined) {
    return deHoy.sesion;
  }

  const publicadas = candidatas.filter((candidata) => candidata.sesion.publicado);

  const libres = publicadas.filter((candidata) => {
    const hizoElDia = ultimoDia.get(candidata.sesion.id.value);

    return hizoElDia === undefined || Calendario.diasEntre(hizoElDia, hoy) >= DIAS_SIN_REPETIR;
  });

  if (libres.length > 0) {
    return [...libres].sort(porClave)[0]?.sesion ?? null;
  }

  // Las hizo todas dentro de la ventana: la que hizo hace mas tiempo; a igual dia, por clave.
  const masAntigua = [...publicadas].sort((uno, otro) => {
    const delUno = ultimoDia.get(uno.sesion.id.value) ?? '';
    const delOtro = ultimoDia.get(otro.sesion.id.value) ?? '';

    return delUno === delOtro ? porClave(uno, otro) : delUno < delOtro ? -1 : 1;
  })[0];

  return masAntigua?.sesion ?? null;
}
