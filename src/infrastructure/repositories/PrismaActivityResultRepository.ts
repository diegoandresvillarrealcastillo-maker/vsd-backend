import type { Resultado } from '@prisma/client';
import { Activity } from '../../domain/model/Activity.js';
import { ActivityResult, type Metadata } from '../../domain/model/ActivityResult.js';
import type { Dia } from '../../domain/model/Calendario.js';
import type { FilaDelHistorial, PuntoDeLaPagina } from '../../domain/model/HistorialDelModulo.js';
import {
  ActivityId,
  ClientOperationId,
  ResultId,
  SesionId,
  UserId,
} from '../../domain/model/Identifier.js';
import { NivelOrientativo, OrientativeScore } from '../../domain/model/OrientativeScore.js';
import type { Hecho } from '../../domain/model/Sendero.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import { esOperacionRepetida } from '../persistence/esOperacionRepetida.js';
import { porPaginas } from '../persistence/porPaginas.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/**
 * Adaptador de persistencia contra PostgreSQL.
 *
 * Vive junto al adaptador en memoria, que no se borra: las pruebas de dominio
 * y de aplicacion lo siguen usando porque es instantaneo. Cual se usa en cada
 * ambiente lo decide la configuracion, no el codigo de negocio.
 *
 * Su unico trabajo es traducir entre la fila de la base y la entidad del
 * dominio. Los tipos que genera Prisma **no salen de este archivo**: si se
 * filtraran a traves de una firma, el dominio pasaria a depender de la base de
 * datos y la arquitectura dejaria de sostenerse.
 */
export class PrismaActivityResultRepository implements ActivityResultRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    /**
     * Hace falta para reconstruir el puntaje: el nivel se deriva de la
     * actividad, no se guarda por su cuenta. La alternativa seria confiar en
     * el `nivel_orientativo` de la fila, pero entonces un cambio en los
     * umbrales de una actividad dejaria resultados viejos diciendo algo que
     * ya no se corresponde con su puntaje.
     */
    private readonly actividades: ActivityRepositoryPort,
  ) {}

  async findByClientOperationId(
    clientOperationId: ClientOperationId,
    userId: UserId,
  ): Promise<ActivityResult | null> {
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.resultado.findUnique({
        where: {
          idUsuario_idOperacionCliente: {
            idUsuario: userId.value,
            idOperacionCliente: clientOperationId.value,
          },
        },
      }),
    );

    if (fila === null) {
      return null;
    }

    const actividad = await this.actividades.findById(new ActivityId(fila.idActividad));

    return this.aDominio(fila, actividad);
  }

  async save(result: ActivityResult): Promise<ActivityResult> {
    const tieneMetadata = Object.keys(result.metadata).length > 0;

    try {
      // La sesion es lo que permite que la base aplique sus politicas: dentro
      // de ella solo existen las filas de esta persona. El WHERE de arriba y el
      // id_usuario de aqui dejan de ser la unica defensa y pasan a ser la
      // primera de dos.
      await this.prisma.comoUsuario(result.userId.value, (cliente) =>
        cliente.resultado.create({
          data: {
            id: result.id.value,
            idUsuario: result.userId.value,
            idActividad: result.activityId.value,
            idOperacionCliente: result.clientOperationId.value,
            // La sesion (contenido) que se hizo, si la mecanica las tiene (ADR 0030). La clave se omite
            // cuando no hay, como la metadata: el modo estricto no acepta `undefined` y asi queda NULL.
            ...(result.sessionId === undefined ? {} : { idSesion: result.sessionId.value }),
            // El puntaje se guarda ya normalizado de 0 a 100. El valor crudo, si
            // hace falta, vive en `metadata`.
            puntaje: result.score?.value ?? null,
            nivelOrientativo: result.score?.level ?? null,
            // La clave se omite cuando no hay nada, en lugar de mandarla en
            // `undefined`: el modo estricto del proyecto no acepta lo segundo, y
            // omitirla deja la columna en NULL, que es lo que queremos.
            ...(tieneMetadata ? { metadata: result.metadata } : {}),
            fecha: result.completedAt,
            // Una columna DATE: Prisma la recibe como la medianoche UTC del dia.
            dia: new Date(`${result.dia}T00:00:00.000Z`),
          },
        }),
      );

      return result;
    } catch (error) {
      // La misma operacion llego dos veces a la vez y la otra gano (SCRUM-258). Es un reintento, no
      // un error: se devuelve lo que ella guardo. Fuera de la transaccion que fallo: la clave unica
      // solo protesta cuando la otra ya confirmo, asi que la fila ya se ve.
      if (esOperacionRepetida(error)) {
        const ganadora = await this.findByClientOperationId(
          result.clientOperationId,
          result.userId,
        );

        if (ganadora !== null) {
          return ganadora;
        }
      }

      throw error;
    }
  }

  async ultimosDe(userId: UserId, desde: Date): Promise<readonly ActivityResult[]> {
    // Por paginas: ninguna consulta trae mas de `FILAS_POR_PAGINA` filas. Lo que se devuelve sigue
    // siendo todo lo de la ventana, para quien la necesita entera.
    const resultados: ActivityResult[] = [];

    for await (const pagina of this.paginasDeResultados(userId, desde)) {
      resultados.push(...pagina);
    }

    return resultados;
  }

  async *paginasDeResultados(
    userId: UserId,
    desde: Date,
  ): AsyncGenerator<readonly ActivityResult[], void, undefined> {
    // El catalogo se recuerda entre paginas: una actividad se consulta una sola vez en todo el recorrido.
    const catalogo = new Map<string, Activity | null>();

    // El cursor es (fecha, id), el orden total de la lectura: lo que sigue es lo estrictamente
    // anterior y, a igual fecha, el de menor identificador. Dos resultados con la misma hora no
    // quedan uno en cada lado de una pagina ni se repiten.
    const paginas = porPaginas<Resultado>((ultima, limite) =>
      this.prisma.comoUsuario(userId.value, (cliente) =>
        cliente.resultado.findMany({
          where: {
            idUsuario: userId.value,
            fecha: { gte: desde },
            ...(ultima === undefined
              ? {}
              : {
                  OR: [
                    { fecha: { lt: ultima.fecha } },
                    { fecha: ultima.fecha, id: { lt: ultima.id } },
                  ],
                }),
          },
          orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
          take: limite,
        }),
      ),
    );

    for await (const filas of paginas) {
      await this.catalogoDe(
        filas.map((fila) => fila.idActividad),
        catalogo,
      );

      yield filas.map((fila) => this.aDominio(fila, catalogo.get(fila.idActividad) ?? null));
    }
  }

  async hayActividadDesde(userId: UserId, desde: Date): Promise<boolean> {
    // Una sola fila y solo la columna que ya se conoce: no hace falta
    // reconstruir nada ni consultar el catalogo para saber si hubo algo.
    const fila = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.resultado.findFirst({
        where: { idUsuario: userId.value, fecha: { gte: desde } },
        select: { idUsuario: true },
      }),
    );

    return fila !== null;
  }

  async diasConActividad(userId: UserId): Promise<readonly Dia[]> {
    // Una fila por dia y ordenada **en la base** (`GROUP BY`). Ojo: `distinct` de Prisma no es un
    // `SELECT DISTINCT`: trae todas las filas y las repite menos en memoria (SCRUM-264).
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.resultado.groupBy({
        by: ['dia'],
        where: { idUsuario: userId.value },
        orderBy: { dia: 'asc' },
      }),
    );

    // Una columna DATE: Prisma la entrega como la medianoche UTC del dia.
    return filas.map((fila) => fila.dia.toISOString().slice(0, 10));
  }

  async hechosDe(userId: UserId): Promise<readonly Hecho[]> {
    // Una fila por actividad y dia, agrupadas en la base: dos columnas, sin repetir y sin traer
    // cada resultado. El orden solo hace que la salida sea estable.
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.resultado.groupBy({
        by: ['dia', 'idActividad'],
        where: { idUsuario: userId.value },
        orderBy: [{ dia: 'asc' }, { idActividad: 'asc' }],
      }),
    );

    return filas.map((fila) => ({
      actividad: fila.idActividad,
      // Una columna DATE: Prisma la entrega como la medianoche UTC del dia.
      dia: fila.dia.toISOString().slice(0, 10),
    }));
  }

  async diasConAtencion(
    userId: UserId,
    actividades: readonly ActivityId[],
    desde: Dia,
  ): Promise<readonly Dia[]> {
    if (actividades.length === 0) {
      return [];
    }

    // Tres columnas agrupadas en la base y solo desde `desde` (SCRUM-264): el dia, la actividad y el
    // puntaje. El nivel **no** se filtra por la columna `nivel_orientativo`: se deriva con la
    // actividad de hoy, igual que al reconstruir un resultado (SCRUM-259). Si se filtrara la columna,
    // un cambio de umbrales dejaria al acompanamiento y al patron de la semana leyendo cosas
    // distintas del mismo dia.
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.resultado.groupBy({
        by: ['dia', 'idActividad', 'puntaje'],
        where: {
          idUsuario: userId.value,
          idActividad: { in: actividades.map((actividad) => actividad.value) },
          puntaje: { not: null },
          dia: { gte: new Date(`${desde}T00:00:00.000Z`) },
        },
        orderBy: { dia: 'asc' },
      }),
    );

    const catalogo = await this.catalogoDe(filas.map((fila) => fila.idActividad));
    const dias = new Set<Dia>();

    for (const fila of filas) {
      const puntaje = this.puntajeDe(fila.puntaje, catalogo.get(fila.idActividad) ?? null);

      if (puntaje?.level === NivelOrientativo.REQUIERE_ATENCION) {
        // Una columna DATE: Prisma la entrega como la medianoche UTC del dia.
        dias.add(fila.dia.toISOString().slice(0, 10));
      }
    }

    // AAAA-MM-DD: el orden de texto es el del calendario.
    return [...dias].sort();
  }

  async historialDe(
    userId: UserId,
    actividades: readonly ActivityId[],
    pagina: { readonly limite: number; readonly despuesDe?: PuntoDeLaPagina | undefined },
  ): Promise<readonly FilaDelHistorial[]> {
    if (actividades.length === 0) {
      return [];
    }

    const { despuesDe } = pagina;

    // Solo las columnas que el historial ensena: ni el puntaje ni `metadata` salen de la base.
    // El cursor es (fecha, id), el mismo orden total de abajo: lo que sigue es lo estrictamente
    // anterior, y a igual fecha el de menor identificador.
    const filas = await this.prisma.comoUsuario(userId.value, (cliente) =>
      cliente.resultado.findMany({
        where: {
          idUsuario: userId.value,
          idActividad: { in: actividades.map((actividad) => actividad.value) },
          ...(despuesDe === undefined
            ? {}
            : {
                OR: [
                  { fecha: { lt: despuesDe.hechaEn } },
                  { fecha: despuesDe.hechaEn, id: { lt: despuesDe.id } },
                ],
              }),
        },
        select: { id: true, idActividad: true, dia: true, fecha: true },
        orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
        take: pagina.limite,
      }),
    );

    return filas.map((fila) => ({
      id: fila.id,
      idActividad: fila.idActividad,
      // Una columna DATE: Prisma la entrega como la medianoche UTC del dia.
      dia: fila.dia.toISOString().slice(0, 10),
      hechaEn: fila.fecha,
    }));
  }

  /**
   * El catalogo se consulta una vez por actividad distinta y no una vez por fila: un historial de
   * treinta resultados de la misma actividad no puede costar treinta consultas.
   */
  private async catalogoDe(
    ids: Iterable<string>,
    catalogo = new Map<string, Activity | null>(),
  ): Promise<Map<string, Activity | null>> {
    for (const idActividad of new Set(ids)) {
      if (!catalogo.has(idActividad)) {
        catalogo.set(idActividad, await this.actividades.findById(new ActivityId(idActividad)));
      }
    }

    return catalogo;
  }

  /**
   * El puntaje de una fila con la interpretacion vigente de su actividad. Es el **unico** sitio
   * donde se deriva el nivel al leer: todo lo que lo necesite pasa por aqui (SCRUM-259).
   */
  private puntajeDe(
    puntaje: Resultado['puntaje'],
    actividad: Activity | null,
  ): OrientativeScore | undefined {
    if (puntaje === null || actividad === null || !actividad.puntua()) {
      return undefined;
    }

    // Lo guardado esta normalizado a 0-100; `create` espera el valor en la escala de la
    // actividad, asi que se deshace la conversion.
    return OrientativeScore.create(
      (Number(puntaje) / 100) * (actividad.puntajeMaximo ?? 0),
      actividad,
    );
  }

  /**
   * Reconstruye la entidad a partir de la fila.
   *
   * El puntaje se vuelve a derivar desde la actividad en lugar de leer el
   * nivel guardado, para que la interpretacion sea siempre la vigente.
   *
   * Si la actividad ya no esta en el catalogo se devuelve el resultado sin
   * puntaje: los datos de la persona no se pierden porque alguien retirara una
   * actividad, pero tampoco se inventa un nivel sin con que calcularlo.
   */
  private aDominio(fila: Resultado, actividad: Activity | null): ActivityResult {
    const score = this.puntajeDe(fila.puntaje, actividad);

    return ActivityResult.create(
      {
        id: new ResultId(fila.id),
        userId: new UserId(fila.idUsuario),
        activityId: new ActivityId(fila.idActividad),
        clientOperationId: new ClientOperationId(fila.idOperacionCliente),
        score,
        completedAt: fila.fecha,
        dia: fila.dia.toISOString().slice(0, 10),
        metadata: (fila.metadata ?? {}) as Metadata,
        sessionId: fila.idSesion === null ? undefined : new SesionId(fila.idSesion),
      },
      // La fecha ya paso la validacion al guardarse. Se usa la propia fila
      // como referencia para que recuperar un resultado nunca falle por el
      // reloj, aunque el del servidor se haya movido.
      fila.fecha,
    );
  }
}
