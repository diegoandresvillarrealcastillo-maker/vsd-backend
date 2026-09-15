import { ActivityResultService } from '../../application/services/ActivityResultService.js';
import { RegisterActivityResultUseCaseImpl } from '../../application/usecases/RegisterActivityResultUseCaseImpl.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';

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
}

export function construirActivityResultService(
  dependencias: Dependencias = { activityResultRepository: new InMemoryActivityResultRepository() },
): ActivityResultService {
  const casoDeUso = new RegisterActivityResultUseCaseImpl(dependencias.activityResultRepository);

  return new ActivityResultService(casoDeUso);
}
