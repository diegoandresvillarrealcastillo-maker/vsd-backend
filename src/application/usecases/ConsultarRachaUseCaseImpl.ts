import { Calendario } from '../../domain/model/Calendario.js';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import { calcularLaRacha, type Racha } from '../../domain/model/Racha.js';
import type { ConsultarRachaUseCase } from '../../domain/ports/in/ConsultarRachaUseCase.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Calcula la racha de una persona a partir de los dias en que hizo algo (SCRUM-186).
 *
 * «Hoy» sale del `Calendario` de la zona de la persona, nunca del reloj UTC ni del del
 * dispositivo: a las 9 p. m. en Bogota ya es el dia siguiente en UTC, y con ese dia el
 * viernes contaria como «ayer». Los dias hechos salen de `resultado.dia`, que quedo fijado
 * al registrar cada resultado, de modo que viajar o cambiar de zona no mueve los de antes
 * ni rompe una racha ya ganada (SCRUM-123).
 *
 * El reloj se recibe por constructor, como en el sendero, para fijarlo en las pruebas.
 */
export class ConsultarRachaUseCaseImpl implements ConsultarRachaUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId): Promise<Racha> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    const hoy = Calendario.de(cuenta.zonaHoraria).diaDe(this.reloj());

    return calcularLaRacha(await this.resultados.diasConActividad(id), hoy);
  }
}
