import type { Dia } from '../../model/Calendario.js';
import type { ActivityId, SesionId, UserId } from '../../model/Identifier.js';
import type { SesionDeActividad } from '../../model/SesionDeActividad.js';

/**
 * Puerto de salida: las sesiones de las mecanicas y la que le toca a cada persona (SCRUM-205, ADR 0030).
 *
 * Las sesiones son contenido de todos: lectura abierta. Lo que depende de la persona es **cual le toca**,
 * y eso sale de lo que ella hizo (`resultado.id_sesion`). No hay cursor: el historial es la unica verdad.
 *
 * La regla de «cual toca» es `elegirSesionDeHoy`. El adaptador en memoria la aplica tal cual; el de
 * PostgreSQL la hace en una consulta, para no traer al servidor todo el contenido de todas las mecanicas
 * en cada lectura del sendero, y una prueba compara las dos.
 */
export interface SesionesRepositoryPort {
  /**
   * Una sesion por su identificador, **publicada o no**: una retirada despues de servirse se sigue
   * aceptando, porque quien la tenia abierta puede terminarla. `null` si no existe.
   */
  porId(id: SesionId): Promise<SesionDeActividad | null>;

  /**
   * De esas mecanicas, las que hoy tienen una sesion que ofrecerle a esa persona: alguna publicada, o
   * una que ella ya hizo hoy aunque se haya retirado despues.
   *
   * Es lo que el sendero necesita para no ofrecer una mecanica que no se puede abrir. Es una pregunta
   * mas barata que traer las sesiones.
   */
  mecanicasConSesion(
    userId: UserId,
    actividades: readonly ActivityId[],
    hoy: Dia,
  ): Promise<ReadonlySet<string>>;

  /**
   * La sesion que le toca hoy a esa persona en cada una de esas mecanicas (`elegirSesionDeHoy`). La
   * clave del mapa es el identificador de la mecanica; las que no tienen sesion que ofrecer no figuran.
   */
  sesionesDeHoy(
    userId: UserId,
    actividades: readonly ActivityId[],
    hoy: Dia,
  ): Promise<ReadonlyMap<string, SesionDeActividad>>;

  /**
   * El titulo de cada una de esas sesiones, por su identificador. Es lo unico de la sesion que sale en la
   * exportacion de datos (Ley 1581): ni el identificador ni los parametros. Las que no existen no figuran.
   */
  titulosDe(ids: readonly SesionId[]): Promise<ReadonlyMap<string, string>>;
}
