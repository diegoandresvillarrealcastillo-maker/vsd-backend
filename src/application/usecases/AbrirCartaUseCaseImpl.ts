import { Calendario } from '../../domain/model/Calendario.js';
import { JournalEntryNotFoundError, SealedLetterError } from '../../domain/model/DomainError.js';
import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { EntradaId, UserId } from '../../domain/model/Identifier.js';
import type {
  AbrirCartaCommand,
  AbrirCartaUseCase,
} from '../../domain/ports/in/AbrirCartaUseCase.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';

/** Abre una carta a mi de manana: desde el dia siguiente, nunca el mismo dia (SCRUM-230). */
export class AbrirCartaUseCaseImpl implements AbrirCartaUseCase {
  constructor(
    private readonly diario: DiarioRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(command: AbrirCartaCommand): Promise<EntradaDeDiario> {
    const userId = new UserId(command.userId);
    const id = new EntradaId(command.entradaId);

    // Una ajena, una que no existe y una anotacion que no es carta se responden igual.
    const actual = await this.diario.porId(userId, id);

    if (actual === null || !actual.cartaAManana) {
      throw new JournalEntryNotFoundError();
    }

    const ahora = this.reloj();

    if (!actual.sePuedeAbrir(Calendario.de(command.zonaHoraria).diaDe(ahora))) {
      throw new SealedLetterError();
    }

    const abierta = await this.diario.abrirCarta(userId, id, ahora);

    // La borraron entre una lectura y otra.
    if (abierta === null) {
      throw new JournalEntryNotFoundError();
    }

    return abierta;
  }
}
