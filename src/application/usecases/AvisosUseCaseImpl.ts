import {
  horaDeMinuto,
  MINUTO_DE_LA_MANANA,
  MINUTO_DE_LA_NOCHE,
  minutoDeHora,
  suscripcionValida,
  type PreferenciasDeAviso,
  type SuscripcionPush,
} from '../../domain/model/Aviso.js';
import { UserId } from '../../domain/model/Identifier.js';
import type {
  AvisosUseCase,
  CambiarHorasCommand,
  CambiarRecordatoriosCommand,
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

/** Encendido es la hora fija; apagado, null; sin pedir nada, lo que habia. */
function recordatorio(
  pedido: boolean | undefined,
  actual: number | null,
  horaFija: number,
): number | null {
  if (pedido === undefined) {
    return actual;
  }

  return pedido ? horaFija : null;
}

/**
 * Lo que la persona hace con sus avisos desde el perfil (SCRUM-102): ver si
 * estan disponibles, elegir la hora de cada uno o apagarlo, encender o apagar
 * los recordatorios de las 8:00 y las 20:00 (SCRUM-126), y suscribir o soltar
 * un navegador.
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
      minutoManana: actuales.minutoManana,
      minutoNoche: actuales.minutoNoche,
    });

    return this.estado(guardadas);
  }

  async cambiarRecordatorios(command: CambiarRecordatoriosCommand): Promise<EstadoDeLosAvisos> {
    const userId = new UserId(command.userId);
    const actuales = await this.avisos.preferenciasDe(userId);

    const guardadas = await this.avisos.guardarPreferencias({
      ...actuales,
      zonaHoraria: command.zonaHoraria,
      minutoManana: recordatorio(command.manana, actuales.minutoManana, MINUTO_DE_LA_MANANA),
      minutoNoche: recordatorio(command.noche, actuales.minutoNoche, MINUTO_DE_LA_NOCHE),
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
      recordatorioManana: preferencias.minutoManana !== null,
      recordatorioNoche: preferencias.minutoNoche !== null,
    };
  }
}
