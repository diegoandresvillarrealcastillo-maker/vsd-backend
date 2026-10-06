import {
  horaDeMinuto,
  minutoDeHora,
  suscripcionValida,
  type PreferenciasDeAviso,
  type SuscripcionPush,
} from '../../domain/model/Aviso.js';
import { UserId } from '../../domain/model/Identifier.js';
import type {
  AvisosUseCase,
  CambiarHorasCommand,
  EstadoDeLosAvisos,
} from '../../domain/ports/in/AvisosUseCase.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';

/** "HH:MM" a minutos; null apaga; undefined deja lo que habia. */
function nuevoMinuto(pedido: string | null | undefined, actual: number | null): number | null {
  if (pedido === undefined) {
    return actual;
  }

  return pedido === null ? null : minutoDeHora(pedido);
}

/**
 * Lo que la persona hace con sus avisos desde el perfil (SCRUM-102): ver si
 * estan disponibles, elegir la hora de cada uno o apagarlo, y suscribir o
 * soltar un navegador.
 */
export class AvisosUseCaseImpl implements AvisosUseCase {
  constructor(
    private readonly avisos: AvisosRepositoryPort,
    private readonly enviador: EnviadorDePushPort,
  ) {}

  async consultar(userId: string): Promise<EstadoDeLosAvisos> {
    return this.estado(await this.avisos.preferenciasDe(new UserId(userId)));
  }

  async cambiarHoras(command: CambiarHorasCommand): Promise<EstadoDeLosAvisos> {
    const userId = new UserId(command.userId);
    const actuales = await this.avisos.preferenciasDe(userId);

    const guardadas = await this.avisos.guardarPreferencias({
      userId,
      zonaHoraria: command.zonaHoraria,
      minutoSemaforo: nuevoMinuto(command.horaSemaforo, actuales.minutoSemaforo),
      minutoRacha: nuevoMinuto(command.horaRacha, actuales.minutoRacha),
    });

    return this.estado(guardadas);
  }

  async suscribir(userId: string, suscripcion: SuscripcionPush): Promise<void> {
    await this.avisos.suscribir(new UserId(userId), suscripcionValida(suscripcion));
  }

  async desuscribir(userId: string, endpoint: string): Promise<void> {
    await this.avisos.desuscribir(new UserId(userId), endpoint);
  }

  private estado(preferencias: PreferenciasDeAviso): EstadoDeLosAvisos {
    const { clavePublica } = this.enviador;

    return {
      disponible: clavePublica !== null,
      clavePublica,
      horaSemaforo:
        preferencias.minutoSemaforo === null ? null : horaDeMinuto(preferencias.minutoSemaforo),
      horaRacha: preferencias.minutoRacha === null ? null : horaDeMinuto(preferencias.minutoRacha),
    };
  }
}
