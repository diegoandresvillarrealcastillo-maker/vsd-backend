import type { Resultado } from '@prisma/client';
import { Activity } from '../../domain/model/Activity.js';
import { ActivityResult, type Metadata } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { OrientativeScore } from '../../domain/model/OrientativeScore.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
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
  ): Promise<ActivityResult | null> {
    const fila = await this.prisma.resultado.findUnique({
      where: { idOperacionCliente: clientOperationId.value },
    });

    if (fila === null) {
      return null;
    }

    const actividad = await this.actividades.findById(new ActivityId(fila.idActividad));

    return this.aDominio(fila, actividad);
  }

  async save(result: ActivityResult): Promise<void> {
    const tieneMetadata = Object.keys(result.metadata).length > 0;

    await this.prisma.resultado.create({
      data: {
        id: result.id.value,
        idUsuario: result.userId.value,
        idActividad: result.activityId.value,
        idOperacionCliente: result.clientOperationId.value,
        // El puntaje se guarda ya normalizado de 0 a 100. El valor crudo, si
        // hace falta, vive en `metadata`.
        puntaje: result.score?.value ?? null,
        nivelOrientativo: result.score?.level ?? null,
        // La clave se omite cuando no hay nada, en lugar de mandarla en
        // `undefined`: el modo estricto del proyecto no acepta lo segundo, y
        // omitirla deja la columna en NULL, que es lo que queremos.
        ...(tieneMetadata ? { metadata: result.metadata } : {}),
        fecha: result.completedAt,
      },
    });
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
    const puntajeCrudo = fila.puntaje === null ? null : Number(fila.puntaje);

    const score =
      puntajeCrudo !== null && actividad !== null && actividad.puntua()
        ? OrientativeScore.create(
            // Lo guardado esta normalizado a 0-100; `create` espera el valor
            // en la escala de la actividad, asi que se deshace la conversion.
            (puntajeCrudo / 100) * (actividad.puntajeMaximo ?? 0),
            actividad,
          )
        : undefined;

    return ActivityResult.create(
      {
        id: new ResultId(fila.id),
        userId: new UserId(fila.idUsuario),
        activityId: new ActivityId(fila.idActividad),
        clientOperationId: new ClientOperationId(fila.idOperacionCliente),
        score,
        completedAt: fila.fecha,
        metadata: (fila.metadata ?? {}) as Metadata,
      },
      // La fecha ya paso la validacion al guardarse. Se usa la propia fila
      // como referencia para que recuperar un resultado nunca falle por el
      // reloj, aunque el del servidor se haya movido.
      fila.fecha,
    );
  }
}
