import { ActivityResultService } from '../../application/services/ActivityResultService.js';
import { RegisterActivityResultUseCaseImpl } from '../../application/usecases/RegisterActivityResultUseCaseImpl.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
import { InMemoryActivityRepository } from '../repositories/InMemoryActivityRepository.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';
import { InMemorySesionesRepository } from '../repositories/InMemorySesionesRepository.js';

/**
 * Cableado de dependencias.
 *
 * Este es el unico archivo que sabe, a la vez, que existe un caso de uso y
 * que existe un adaptador concreto. Todo lo demas conoce solo interfaces.
 *
 * Esta escrito a mano y a proposito: se ve de un vistazo quien recibe que.
 * En el Ciclo 3 lo reemplaza el contenedor de NestJS, que hara lo mismo de
 * forma declarativa. Que hoy sea manual deja claro que la arquitectura no
 * depende de ningun framework para funcionar.
 */
export interface Dependencias {
  readonly activityResultRepository: ActivityResultRepositoryPort;
  readonly activityRepository: ActivityRepositoryPort;
  readonly recursoApoyoRepository: RecursoApoyoRepositoryPort;
  /** Por omision, las sesiones en memoria (sin contenido), que leen los resultados de arriba. */
  readonly sesionesRepository?: SesionesRepositoryPort;
}

const dependenciasEnMemoria = (): Dependencias => ({
  activityResultRepository: new InMemoryActivityResultRepository(),
  activityRepository: new InMemoryActivityRepository(),
  recursoApoyoRepository: new InMemoryRecursoApoyoRepository(),
});

export function construirActivityResultService(
  dependencias: Dependencias = dependenciasEnMemoria(),
): ActivityResultService {
  const casoDeUso = new RegisterActivityResultUseCaseImpl(
    dependencias.activityResultRepository,
    dependencias.activityRepository,
    dependencias.recursoApoyoRepository,
    dependencias.sesionesRepository ??
      new InMemorySesionesRepository(dependencias.activityResultRepository),
  );

  return new ActivityResultService(casoDeUso);
}
