import { adjuntosDesde, DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import {
  EditWindowClosedError,
  JournalEntryNotFoundError,
  StaleJournalEntryError,
} from '../../domain/model/DomainError.js';
import { horaDelDispositivo } from '../../domain/model/HoraDelDispositivo.js';
import { EntradaId, UserId } from '../../domain/model/Identifier.js';
import { paisDeLaZona } from '../../domain/model/PaisDeAyuda.js';
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

    // La hora de la edicion es la que dijo el dispositivo, no la de cuando llega:
    // corregida a las 9:30 sin conexion y recibida a las 14:00, es una correccion
    // dentro de la hora y no una anotacion nueva (SCRUM-144). Nunca antes de haberse
    // escrito. Sin hora del dispositivo, o si no sirve, es la del servidor.
    const horaDeLaEdicion = horaDelDispositivo(command.editadaEn, this.reloj(), actual.creadaEn);

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
      horaDeLaEdicion,
    );

    const guardada = await this.diario.guardarEdicion(editada, actual.version);

    if (guardada !== null) {
      return acompanarAnotacion(
        guardada,
        this.recursos,
        command.conRecomendaciones,
        paisDeLaZona(command.zonaHoraria),
      );
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
