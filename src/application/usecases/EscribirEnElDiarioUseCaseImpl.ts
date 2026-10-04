import type { Calendario } from '../../domain/model/Calendario.js';
import { adjuntosDesde, DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import type {
  AnotacionGuardada,
  EscribirEnElDiarioCommand,
  EscribirEnElDiarioUseCase,
} from '../../domain/ports/in/EscribirEnElDiarioUseCase.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { acompanarAnotacion } from './acompanarAnotacion.js';

/**
 * Escribe una anotacion en el diario propio (SCRUM-95).
 *
 * Es idempotente por `clientOperationId`, como el registro de resultados: el
 * diario tiene que poder escribirse sin conexion, y un reintento tras una
 * caida de red no puede dejar la misma anotacion dos veces.
 */
export class EscribirEnElDiarioUseCaseImpl implements EscribirEnElDiarioUseCase {
  constructor(
    private readonly diario: DiarioRepositoryPort,
    private readonly recursos: RecursoApoyoRepositoryPort,
    private readonly calendario: Calendario,
    private readonly generarId: () => EntradaId = () =>
      new EntradaId(globalThis.crypto.randomUUID()),
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(command: EscribirEnElDiarioCommand): Promise<AnotacionGuardada> {
    const userId = new UserId(command.userId);
    const clientOperationId = new ClientOperationId(command.clientOperationId);

    // Un reintento devuelve lo que ya se guardo, con su acompanamiento: quien
    // repite la operacion tiene que ver lo mismo que la primera vez.
    const existente = await this.diario.porOperacion(userId, clientOperationId);

    if (existente !== null) {
      return acompanarAnotacion(existente, this.recursos);
    }

    const ahora = this.reloj();
    const hoy = this.calendario.diaDe(ahora);

    const entrada = EntradaDeDiario.nueva(
      {
        id: this.generarId(),
        userId,
        clientOperationId,
        dia: command.dia ?? hoy,
        titulo: command.titulo,
        documento: DocumentoDelDiario.desde(command.contenido),
        adjuntos: adjuntosDesde(command.adjuntos),
      },
      hoy,
      ahora,
    );

    return acompanarAnotacion(await this.diario.guardarNueva(entrada), this.recursos);
  }
}
