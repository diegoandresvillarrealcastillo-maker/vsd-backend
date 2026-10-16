import type { Dia } from '../../domain/model/Calendario.js';
import { ActivityId, SesionId, type UserId } from '../../domain/model/Identifier.js';
import {
  type ParametrosDeSesion,
  type Revision,
  SesionDeActividad,
} from '../../domain/model/SesionDeActividad.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/** La fila de `sesion_de_actividad`, venga de Prisma o de una consulta cruda. */
interface FilaDeSesion {
  readonly id: string;
  readonly idActividad: string;
  readonly titulo: string;
  readonly nivel: number;
  readonly parametros: unknown;
  readonly publicado: boolean;
  readonly revision: string;
  readonly revisadaPor: string | null;
  readonly revisadaEl: Date | null;
}

/**
 * Las sesiones de las mecanicas, leidas de PostgreSQL (SCRUM-205, ADR 0030).
 *
 * ## Que sesion toca
 *
 * Es `elegirSesionDeHoy`, escrita como una consulta: para cada mecanica pedida se ordenan sus sesiones
 * y se queda la primera, **sin traer al servidor las que no se ofrecen**. Traer todo el contenido de
 * todas las mecanicas en cada lectura del sendero serian cientos de filas de 1 a 3 KB para mostrar
 * nueve. El orden es:
 *
 * 1. las que la persona **hizo hoy** (la ultima, si repitio), publicadas o no;
 * 2. entre las publicadas, las **libres**: no las hizo en los ultimos 365 dias, por la clave
 *    `hashtextextended(id_sesion || ':' || id_usuario, 0)`, que es propia de cada persona;
 * 3. si no queda ninguna libre, la que hizo **hace mas tiempo**.
 *
 * Una prueba contra PostgreSQL compara esta consulta con `elegirSesionDeHoy` sobre cientos de
 * historiales al azar: si las dos reglas se separaran, fallaria.
 *
 * ## Las sesiones de la persona
 *
 * El contenido (`sesion_de_actividad`) tiene lectura abierta. Lo que la persona hizo (`resultado`) es de
 * su dueno: se lee con `comoUsuario` y la base impone el aislamiento (RLS forzado).
 */
export class PrismaSesionesRepository implements SesionesRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async porId(id: SesionId): Promise<SesionDeActividad | null> {
    const fila = await this.prisma.sesionDeActividad.findUnique({ where: { id: id.value } });

    return fila === null ? null : this.aDominio(fila);
  }

  async mecanicasConSesion(
    userId: UserId,
    actividades: readonly ActivityId[],
    hoy: Dia,
  ): Promise<ReadonlySet<string>> {
    if (actividades.length === 0) {
      return new Set();
    }

    const ids = actividades.map((actividad) => actividad.value);
    const persona = userId.value;

    const filas = await this.prisma.comoUsuario(
      persona,
      (cliente) =>
        cliente.$queryRaw<{ id: string }[]>`
        SELECT a.id::text AS id
        FROM unnest(${ids}::uuid[]) AS a(id)
        WHERE EXISTS (
            SELECT 1 FROM sesion_de_actividad s
            WHERE s.id_actividad = a.id AND s.publicado
          )
          OR EXISTS (
            SELECT 1 FROM resultado r
            WHERE r.id_usuario = ${persona}::uuid
              AND r.id_actividad = a.id
              AND r.id_sesion IS NOT NULL
              AND r.dia = ${hoy}::date
          )`,
    );

    return new Set(filas.map((fila) => fila.id));
  }

  async sesionesDeHoy(
    userId: UserId,
    actividades: readonly ActivityId[],
    hoy: Dia,
  ): Promise<ReadonlyMap<string, SesionDeActividad>> {
    if (actividades.length === 0) {
      return new Map();
    }

    const ids = actividades.map((actividad) => actividad.value);
    const persona = userId.value;

    // `ultimo_dia` y `hecha_hoy` salen de lo que esta persona hizo de cada sesion. Una sesion es
    // «libre» si nunca la hizo o la hizo hace 365 dias o mas.
    const filas = await this.prisma.comoUsuario(
      persona,
      (cliente) =>
        cliente.$queryRaw<FilaDeSesion[]>`
        SELECT DISTINCT ON (s.id_actividad)
          s.id_sesion::text AS id,
          s.id_actividad::text AS "idActividad",
          s.titulo,
          s.nivel::int AS nivel,
          s.parametros,
          s.publicado,
          s.revision,
          s.revisada_por AS "revisadaPor",
          s.revisada_el AS "revisadaEl"
        FROM sesion_de_actividad s
        LEFT JOIN LATERAL (
          SELECT max(r.dia) AS ultimo_dia,
                 max(r.fecha) FILTER (WHERE r.dia = ${hoy}::date) AS hecha_hoy
          FROM resultado r
          WHERE r.id_usuario = ${persona}::uuid
            AND r.id_actividad = s.id_actividad
            AND r.id_sesion = s.id_sesion
        ) h ON true
        WHERE s.id_actividad = ANY(${ids}::uuid[])
          AND (s.publicado OR h.hecha_hoy IS NOT NULL)
        ORDER BY
          s.id_actividad,
          (h.hecha_hoy IS NOT NULL) DESC,
          h.hecha_hoy DESC NULLS LAST,
          (h.ultimo_dia IS NULL OR h.ultimo_dia <= ${hoy}::date - 365) DESC,
          CASE WHEN h.ultimo_dia IS NULL OR h.ultimo_dia <= ${hoy}::date - 365
               THEN NULL ELSE h.ultimo_dia END ASC NULLS FIRST,
          hashtextextended(s.id_sesion::text || ':' || ${persona}::text, 0) ASC,
          s.id_sesion ASC`,
    );

    return new Map(filas.map((fila) => [fila.idActividad, this.aDominio(fila)]));
  }

  async titulosDe(ids: readonly SesionId[]): Promise<ReadonlyMap<string, string>> {
    if (ids.length === 0) {
      return new Map();
    }

    const filas = await this.prisma.sesionDeActividad.findMany({
      where: { id: { in: ids.map((id) => id.value) } },
      select: { id: true, titulo: true },
    });

    return new Map(filas.map((fila) => [fila.id, fila.titulo]));
  }

  private aDominio(fila: FilaDeSesion): SesionDeActividad {
    return SesionDeActividad.create({
      id: new SesionId(fila.id),
      idActividad: new ActivityId(fila.idActividad),
      titulo: fila.titulo,
      nivel: fila.nivel,
      parametros: fila.parametros as ParametrosDeSesion,
      publicado: fila.publicado,
      // La base solo admite los tres (CHECK) y `SesionDeActividad.create` lo vuelve a comprobar.
      revision: fila.revision as Revision,
      revisadaPor: fila.revisadaPor ?? undefined,
      revisadaEl: fila.revisadaEl ?? undefined,
    });
  }
}
