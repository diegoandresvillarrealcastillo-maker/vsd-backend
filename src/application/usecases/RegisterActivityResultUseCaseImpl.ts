import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityNotFoundError, ScoreNotApplicableError } from '../../domain/model/DomainError.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { OrientativeScore } from '../../domain/model/OrientativeScore.js';
import type {
  RegisterActivityResultUseCase,
  RegistrarResultadoCommand,
} from '../../domain/ports/in/RegisterActivityResultUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';

/**
 * Registra el resultado de una actividad.
 *
 * Depende del puerto de salida, nunca de una implementacion concreta: quien
 * decide si al otro lado hay memoria o PostgreSQL es infrastructure/config.
 *
 * El generador de identificadores y el reloj se reciben por constructor con
 * un valor por defecto. Asi las pruebas pueden fijarlos y comprobar reglas
 * que dependen del tiempo sin que el resultado cambie segun la hora a la que
 * se ejecuten.
 */
export class RegisterActivityResultUseCaseImpl implements RegisterActivityResultUseCase {
  constructor(
    private readonly repositorio: ActivityResultRepositoryPort,
    private readonly actividades: ActivityRepositoryPort,
    private readonly generarId: () => ResultId = () => new ResultId(globalThis.crypto.randomUUID()),
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(command: RegistrarResultadoCommand): Promise<ActivityResult> {
    // Validar en la frontera: si algo viene mal formado, falla aqui y no
    // a medio camino con datos ya escritos.
    const userId = new UserId(command.userId);
    const activityId = new ActivityId(command.activityId);
    const clientOperationId = new ClientOperationId(command.clientOperationId);
    // La actividad es la que sabe interpretar el puntaje: sobre que maximo se
    // obtuvo, hacia donde va su escala y donde estan sus cortes de nivel. Sin
    // ella no se puede derivar un nivel que signifique algo.
    const actividad = await this.actividades.findById(activityId);

    if (actividad === null) {
      throw new ActivityNotFoundError();
    }

    // Un resultado sin puntaje es valido: las actividades de registro
    // producen datos, no una calificacion. Pero recibir un puntaje para una
    // actividad que no puntua si es un error, y se dice en vez de callarlo.
    if (command.score !== undefined && !actividad.puntua()) {
      throw new ScoreNotApplicableError(actividad.nombre);
    }

    const score =
      command.score !== undefined ? OrientativeScore.create(command.score, actividad) : undefined;

    // La busqueda esta acotada a esta persona. Un identificador de operacion
    // ajeno no se encuentra, y la peticion sigue su curso como cualquier otra:
    // se registra un resultado nuevo de quien pregunta.
    //
    // Antes la clave era unica en toda la tabla y este mismo caso se rechazaba.
    // Parecia lo prudente, pero la respuesta era distinta a la de un
    // identificador inexistente, y esa diferencia sola bastaba para ir
    // probando identificadores y averiguar cuales existen. Ver ADR 0010.
    const existente = await this.repositorio.findByClientOperationId(clientOperationId, userId);

    if (existente !== null) {
      // Reintento de la misma operacion. Se devuelve lo ya registrado en
      // lugar de crear un duplicado: es lo que hace seguro reintentar
      // cuando la red se cae a mitad de una sincronizacion.
      return existente;
    }

    const resultado = ActivityResult.create(
      {
        id: this.generarId(),
        userId,
        activityId,
        clientOperationId,
        score,
        completedAt: command.completedAt,
        metadata: command.metadata,
      },
      this.reloj(),
    );

    await this.repositorio.save(resultado);

    return resultado;
  }
}
