import { adjuntosDesde, DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import {
  EditWindowClosedError,
  JournalEntryNotFoundError,
  StaleJournalEntryError,
} from '../../domain/model/DomainError.js';
import { EntradaId, UserId } from '../../domain/model/Identifier.js';
import type {
  EditarAnotacionCommand,
  EditarAnotacionUseCase,
} from '../../domain/ports/in/EditarAnotacionUseCase.js';
import type { AnotacionGuardada } from '../../domain/ports/in/EscribirEnElDiarioUseCase.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { acompanarAnotacion } from './acompanarAnotacion.js';

/**
 * Corrige una anotacion propia durante su primera hora (SCRUM-95).
 *
 * Fuera de esa hora, o si otro dispositivo la cambio entretanto, se responde
 * con un codigo claro y no se toca nada. Quien llama guarda lo que traia como
 * una anotacion nueva: asi lo dice el ADR 0009.
 */
export class EditarAnotacionUseCaseImpl implements EditarAnotacionUseCase {
  constructor(
    private readonly diario: DiarioRepositoryPort,
    private readonly recursos: RecursoApoyoRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(command: EditarAnotacionCommand): Promise<AnotacionGuardada> {
    const userId = new UserId(command.userId);
    const id = new EntradaId(command.entradaId);

    // Una anotacion ajena no se encuentra, y se responde igual que si no
    // existiera.
    const actual = await this.diario.porId(userId, id);

    if (actual === null) {
      throw new JournalEntryNotFoundError();
    }

    // El reloj de la API contesta antes y con el motivo exacto en el caso
    // corriente.
    const editada = actual.editar(
      {
        titulo: command.titulo,
        documento:
          command.contenido === undefined ? undefined : DocumentoDelDiario.desde(command.contenido),
        adjuntos: command.adjuntos === undefined ? undefined : adjuntosDesde(command.adjuntos),
      },
      command.version,
      this.reloj(),
    );

    const guardada = await this.diario.guardarEdicion(editada, actual.version);

    if (guardada !== null) {
      return acompanarAnotacion(guardada, this.recursos);
    }

    // La base no la dejo pasar. Puede que otro dispositivo la editara entre
    // la lectura y la escritura, o que la hora venciera justo entonces: la
    // hora la decide la base, y su reloj manda sobre el de la API.
    const ahora = await this.diario.porId(userId, id);

    if (ahora === null) {
      throw new JournalEntryNotFoundError();
    }

    if (ahora.version !== actual.version) {
      throw new StaleJournalEntryError();
    }

    throw new EditWindowClosedError();
  }
}
