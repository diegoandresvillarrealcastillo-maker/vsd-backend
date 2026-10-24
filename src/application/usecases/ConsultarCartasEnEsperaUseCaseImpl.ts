import { Calendario } from '../../domain/model/Calendario.js';
import { DIAS_DE_ESPERA_DE_LA_CARTA } from '../../domain/model/EntradaDeDiario.js';
import { UserId } from '../../domain/model/Identifier.js';
import type {
  ConsultarCartasEnEsperaQuery,
  ConsultarCartasEnEsperaUseCase,
} from '../../domain/ports/in/ConsultarCartasEnEsperaUseCase.js';
import type {
  CartaEnEspera,
  DiarioRepositoryPort,
} from '../../domain/ports/out/DiarioRepositoryPort.js';

/**
 * Las cartas que esperan ser leidas (SCRUM-230): de un dia que ya paso, sin abrir y dentro de la
 * semana de espera. El dia es el de la persona, no el del servidor: la carta de «ayer» cambia a
 * medianoche en su zona.
 */
export class ConsultarCartasEnEsperaUseCaseImpl implements ConsultarCartasEnEsperaUseCase {
  constructor(
    private readonly diario: DiarioRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  execute(query: ConsultarCartasEnEsperaQuery): Promise<readonly CartaEnEspera[]> {
    const hoy = Calendario.de(query.zonaHoraria).diaDe(this.reloj());

    return this.diario.cartasEnEspera(
      new UserId(query.userId),
      Calendario.sumarDias(hoy, -DIAS_DE_ESPERA_DE_LA_CARTA),
      Calendario.sumarDias(hoy, -1),
    );
  }
}
