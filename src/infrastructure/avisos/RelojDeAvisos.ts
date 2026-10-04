import {
  Inject,
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from '@nestjs/common';
import type { RevisarAvisosUseCase } from '../../domain/ports/in/AvisosUseCase.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import { Ambiente, type Configuracion } from '../config/environment.js';
import { CONFIGURACION, ENVIADOR_PUSH, REVISAR_AVISOS } from '../config/tokens.js';

export const CADA_MINUTO_MS = 60_000;

/**
 * La tarea programada de los avisos (SCRUM-102): cada minuto pregunta a quien
 * le toca un aviso y se lo manda.
 *
 * Vive dentro del API, por decision de Diego. En el plan gratuito de Render
 * el servicio se duerme tras un rato sin trafico, y dormido no revisa: los
 * avisos de esas horas se pierden. Al despertar manda lo de la ultima media
 * hora (ver `MINUTOS_DE_GRACIA`). En un plan que no duerme, no se pierde nada.
 *
 * No arranca en las pruebas ni sin claves VAPID. Una revision no empieza
 * mientras la anterior sigue: con muchas personas, mejor llegar un minuto
 * tarde que dos veces.
 */
@Injectable()
export class RelojDeAvisos implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly registro = new Logger('Avisos');
  private temporizador: ReturnType<typeof setInterval> | undefined;
  private revisando = false;

  constructor(
    @Inject(REVISAR_AVISOS) private readonly revision: RevisarAvisosUseCase,
    @Inject(ENVIADOR_PUSH) private readonly enviador: EnviadorDePushPort,
    @Inject(CONFIGURACION) private readonly configuracion: Configuracion,
  ) {}

  onApplicationBootstrap(): void {
    if (this.configuracion.ambiente === Ambiente.PRUEBAS) {
      return;
    }

    if (this.enviador.clavePublica === null) {
      this.registro.warn('Sin claves VAPID: no se mandan avisos. Ver .env.example.');
      return;
    }

    this.temporizador = setInterval(() => void this.revisar(), CADA_MINUTO_MS);
    // No retiene el proceso: apagar el servicio no espera al siguiente minuto.
    this.temporizador.unref();
    this.registro.log('Revisando los avisos cada minuto.');
  }

  onApplicationShutdown(): void {
    clearInterval(this.temporizador);
  }

  /** Una revision. Publica para las pruebas. */
  async revisar(ahora: Date = new Date()): Promise<void> {
    if (this.revisando) {
      return;
    }

    this.revisando = true;

    try {
      const { entregados, caducadas } = await this.revision.revisar(ahora);

      if (entregados > 0 || caducadas > 0) {
        this.registro.log(`Avisos entregados: ${entregados}. Navegadores soltados: ${caducadas}.`);
      }
    } catch (error) {
      // Sin datos de nadie: solo que fallo y por que.
      this.registro.error(
        `La revision de avisos fallo: ${error instanceof Error ? error.message : 'error desconocido'}`,
      );
    } finally {
      this.revisando = false;
    }
  }
}
