import { EntradaId, UserId } from '../../domain/model/Identifier.js';
import type {
  BorrarAnotacionCommand,
  BorrarAnotacionUseCase,
} from '../../domain/ports/in/BorrarAnotacionUseCase.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';

/**
 * Borra una anotacion propia (SCRUM-230).
 *
 * Es idempotente por el identificador de la anotacion y no pregunta nada antes: leerla para decidir
 * si se borra seria justo lo que la persona quiere evitar con una carta de un mal dia.
 */
export class BorrarAnotacionUseCaseImpl implements BorrarAnotacionUseCase {
  constructor(private readonly diario: DiarioRepositoryPort) {}

  async execute(command: BorrarAnotacionCommand): Promise<void> {
    await this.diario.borrar(new UserId(command.userId), new EntradaId(command.entradaId));
  }
}
