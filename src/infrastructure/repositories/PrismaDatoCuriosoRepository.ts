import type { CursorDelCiclo, DatoCurioso } from '../../domain/model/DatoCurioso.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { DatoCuriosoRepositoryPort } from '../../domain/ports/out/DatoCuriosoRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/** Un identificador menor que cualquier otro: el piso de la comparacion cuando no hay dato. */
const IDENTIFICADOR_MINIMO = '00000000-0000-0000-0000-000000000000';

interface FilaDelSiguiente {
  readonly id: string;
  readonly texto: string;
  readonly tema: string;
  readonly clave: bigint | number | string;
}

/**
 * Los datos curiosos, leidos de PostgreSQL (SCRUM-185, ADR 0025).
 *
 * ## El orden de cada persona
 *
 * No se guarda. En cada consulta se calcula con `hashtextextended(id_dato || ':' ||
 * id_usuario, 0)`, un hash de 64 bits propio de la persona, y el «siguiente» es el de clave
 * mayor mas cercana a la del cursor, con el identificador como desempate. Es una pasada por
 * el catalogo **una vez por persona y por dia** (despues el cursor ya tiene el del dia), asi
 * que un catalogo de 100 mil filas cuesta decenas de milisegundos al dia por persona y no
 * crece con las cuentas.
 *
 * ## Las sesiones
 *
 * El catalogo (`dato_curioso`) tiene lectura abierta: se lee sin abrir sesion de persona,
 * como `recurso_apoyo`. El cursor (`dato_curioso_cursor`) si es de su dueno: se lee y se
 * escribe con `comoUsuario`, y la base impone el aislamiento (RLS forzado).
 */
export class PrismaDatoCuriosoRepository implements DatoCuriosoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async cursorDe(userId: UserId): Promise<CursorDelCiclo | null> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.datoCuriosoCursor.findUnique({ where: { idUsuario: userId.value } }),
    );

    if (fila === null) {
      return null;
    }

    return {
      idDato: fila.idDato,
      clave: fila.clave,
      // Una columna DATE: Prisma la entrega como la medianoche UTC del dia.
      dia: fila.dia.toISOString().slice(0, 10),
    };
  }

  async porId(id: string): Promise<DatoCurioso | null> {
    const fila = await this.prisma.datoCurioso.findUnique({ where: { id } });

    return fila === null ? null : { id: fila.id, texto: fila.texto, tema: fila.tema };
  }

  async siguienteDespuesDe(
    userId: UserId,
    despuesDe: { readonly clave: bigint; readonly idDato: string | null } | null,
  ): Promise<{ readonly dato: DatoCurioso; readonly clave: bigint } | null> {
    const persona = userId.value;

    if (despuesDe !== null) {
      const filas = await this.prisma.$queryRaw<FilaDelSiguiente[]>`
        SELECT d.id_dato AS id, d.texto, d.tema, h.k AS clave
        FROM dato_curioso d
        CROSS JOIN LATERAL (
          SELECT hashtextextended(d.id_dato::text || ':' || ${persona}::text, 0) AS k
        ) h
        WHERE d.publicado
          AND (h.k, d.id_dato) > (${despuesDe.clave}::bigint, ${despuesDe.idDato ?? IDENTIFICADOR_MINIMO}::uuid)
        ORDER BY h.k, d.id_dato
        LIMIT 1`;

      if (filas[0] !== undefined) {
        return this.aDominio(filas[0]);
      }
    }

    // Sin cursor, o al llegar al final: el principio de su orden, que es un ciclo nuevo.
    const primeras = await this.prisma.$queryRaw<FilaDelSiguiente[]>`
      SELECT d.id_dato AS id, d.texto, d.tema, h.k AS clave
      FROM dato_curioso d
      CROSS JOIN LATERAL (
        SELECT hashtextextended(d.id_dato::text || ':' || ${persona}::text, 0) AS k
      ) h
      WHERE d.publicado
      ORDER BY h.k, d.id_dato
      LIMIT 1`;

    return primeras[0] === undefined ? null : this.aDominio(primeras[0]);
  }

  async guardarCursor(userId: UserId, cursor: CursorDelCiclo): Promise<void> {
    const datos = {
      idDato: cursor.idDato,
      clave: cursor.clave,
      dia: new Date(`${cursor.dia}T00:00:00.000Z`),
    };

    await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.datoCuriosoCursor.upsert({
        where: { idUsuario: userId.value },
        create: { idUsuario: userId.value, ...datos },
        update: datos,
      }),
    );
  }

  private aDominio(fila: FilaDelSiguiente): { dato: DatoCurioso; clave: bigint } {
    return {
      dato: { id: fila.id, texto: fila.texto, tema: fila.tema },
      // Segun el adaptador un int8 llega como bigint, numero o texto: se normaliza aqui.
      clave: BigInt(fila.clave),
    };
  }
}
