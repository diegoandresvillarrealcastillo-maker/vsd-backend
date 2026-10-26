import {
  Inject,
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from '@nestjs/common';
import type {
  ResumenDeLasBajas,
  TerminarBajasPendientesUseCase,
} from '../../domain/ports/in/BajasPendientesUseCase.js';
import { CADA_MINUTO_MS } from '../avisos/RelojDeAvisos.js';
import { Ambiente, type Configuracion } from '../config/environment.js';
import { CONFIGURACION, TERMINAR_BAJAS } from '../config/tokens.js';

/**
 * La tarea programada que termina las bajas de cuenta que se cortaron (SCRUM-267, ADR 0040):
 * cada minuto, y una vez al arrancar, toma las que llevan un rato pedidas y las termina.
 *
 * Vive dentro del API, como la de los avisos (`RelojDeAvisos`): no hay infraestructura nueva. En
 * el plan gratuito de Render el servicio se duerme tras un rato sin trafico, y una baja cortada
 * espera a que despierte: por eso corre tambien al arrancar y no solo cada minuto.
 *
 * No arranca en las pruebas. Una vuelta no empieza mientras la anterior sigue: con muchas bajas
 * fallando a la vez, cada una puede tardar hasta 14 s, y repetirlas en paralelo no ayuda.
 */
@Injectable()
export class RelojDeBajas implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly registro = new Logger('Bajas');
  private temporizador: ReturnType<typeof setInterval> | undefined;
  private terminando = false;

  constructor(
    @Inject(TERMINAR_BAJAS) private readonly bajas: TerminarBajasPendientesUseCase,
    @Inject(CONFIGURACION) private readonly configuracion: Configuracion,
  ) {}

  onApplicationBootstrap(): void {
    if (this.configuracion.ambiente === Ambiente.PRUEBAS) {
      return;
    }

    // Al arrancar, sin esperar el primer minuto, y sin retener el arranque.
    void this.terminar();
    this.temporizador = setInterval(() => void this.terminar(), CADA_MINUTO_MS);
    // No retiene el proceso: apagar el servicio no espera al siguiente minuto.
    this.temporizador.unref();
    this.registro.log('Terminando las bajas de cuenta pendientes cada minuto.');
  }

  onApplicationShutdown(): void {
    clearInterval(this.temporizador);
  }

  /** Una vuelta. Publica para las pruebas. */
  async terminar(ahora: Date = new Date()): Promise<void> {
    if (this.terminando) {
      return;
    }

    this.terminando = true;

    try {
      this.informar(await this.bajas.terminar(ahora));
    } catch (error) {
      // Sin datos de nadie: solo que fallo y por que.
      this.registro.error(
        `La vuelta de bajas pendientes fallo: ${error instanceof Error ? error.message : 'error desconocido'}`,
      );
    } finally {
      this.terminando = false;
    }
  }

  /**
   * Deja medida cada vuelta que hizo algo: cuantas bajas, cuantas terminaron y cuantas no. Solo
   * cuentas. Una vuelta sin nada pendiente no deja nada: ocurre casi todos los minutos.
   */
  private informar({ tomadas, terminadas, fallos }: ResumenDeLasBajas): void {
    if (tomadas === 0) {
      return;
    }

    const texto = `Bajas pendientes: ${tomadas} tomadas, ${terminadas} terminadas, ${fallos} con fallo.`;

    if (fallos > 0) {
      this.registro.warn(`${texto} Las que fallaron se vuelven a intentar en un minuto.`);

      return;
    }

    this.registro.log(texto);
  }
}
