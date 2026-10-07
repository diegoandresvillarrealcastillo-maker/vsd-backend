import { Calendario } from '../../domain/model/Calendario.js';
import { paisDeLaZona } from '../../domain/model/PaisDeAyuda.js';
import { adjuntosDesde, DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { conTolerancia } from '../../domain/model/ToleranciaDelReloj.js';
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
      return acompanarAnotacion(
        existente,
        this.recursos,
        command.conRecomendaciones,
        paisDeLaZona(command.zonaHoraria),
      );
    }

    const ahora = this.reloj();
    const calendario = Calendario.de(command.zonaHoraria);
    const hoy = calendario.diaDe(ahora);

    // El dia lo elige el dispositivo, con su reloj. Un reloj adelantado unos
    // minutos, pasada la medianoche, diria que ya es "manana" (ver
    // ToleranciaDelReloj): se admite hasta el dia que seria con esa tolerancia,
    // y no un dia mas.
    const ultimoDiaAdmitido = calendario.diaDe(conTolerancia(ahora));

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
      ultimoDiaAdmitido,
      ahora,
    );

    return acompanarAnotacion(
      await this.diario.guardarNueva(entrada),
      this.recursos,
      command.conRecomendaciones,
      paisDeLaZona(command.zonaHoraria),
    );
  }
}
