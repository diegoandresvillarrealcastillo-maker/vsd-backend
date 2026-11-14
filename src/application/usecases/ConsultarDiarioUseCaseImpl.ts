import { Calendario } from '../../domain/model/Calendario.js';
import { InvalidDayRangeError } from '../../domain/model/DomainError.js';
import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { UserId } from '../../domain/model/Identifier.js';
import type {
  ConsultarDiarioQuery,
  ConsultarDiarioUseCase,
} from '../../domain/ports/in/ConsultarDiarioUseCase.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';

/**
 * Cuantos dias se pueden pedir de una vez: un ano. Basta para cualquier vista
 * del diario y evita que una sola peticion arrastre todo un historial.
 */
export const MAXIMO_DE_DIAS_POR_CONSULTA = 366;

/**
 * Las anotaciones propias de un rango de dias (SCRUM-95).
 *
 * Sin rango, las de hoy. Con solo `hasta`, las de ese dia.
 */
export class ConsultarDiarioUseCaseImpl implements ConsultarDiarioUseCase {
  constructor(
    private readonly diario: DiarioRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(query: ConsultarDiarioQuery): Promise<readonly EntradaDeDiario[]> {
    const userId = new UserId(query.userId);
    const hasta = query.hasta ?? Calendario.de(query.zonaHoraria).diaDe(this.reloj());
    const desde = query.desde ?? hasta;

    for (const dia of [desde, hasta]) {
      if (!Calendario.esDia(dia)) {
        throw new InvalidDayRangeError(`"${dia}" no es una fecha real con formato AAAA-MM-DD`);
      }
    }

    const dias = Calendario.diasEntre(desde, hasta);

    if (dias < 0) {
      throw new InvalidDayRangeError('"desde" no puede ser posterior a "hasta"');
    }

    if (dias >= MAXIMO_DE_DIAS_POR_CONSULTA) {
      throw new InvalidDayRangeError(
        `se pueden pedir como mucho ${MAXIMO_DE_DIAS_POR_CONSULTA} días de una vez`,
      );
    }

    return this.diario.entreDias(userId, desde, hasta);
  }
}
