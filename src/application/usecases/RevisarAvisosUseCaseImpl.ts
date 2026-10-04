import {
  mensajeDeLaRacha,
  mensajeDelSemaforo,
  TipoDeAviso,
  type MensajeDeAviso,
} from '../../domain/model/Aviso.js';
import type { Calendario } from '../../domain/model/Calendario.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type {
  ResumenDeLaRevision,
  RevisarAvisosUseCase,
} from '../../domain/ports/in/AvisosUseCase.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';

/**
 * Cuanto puede llegar tarde un aviso. Si el servidor estuvo parado a la hora
 * elegida, al volver manda lo de la ultima media hora; lo de antes ya no
 * tiene sentido (un "pendientes de la manana" a media tarde).
 */
export const MINUTOS_DE_GRACIA = 30;

/** Para el registro: que fallo sin contar de quien. */
export interface RegistroDeAvisos {
  fallo(tipo: TipoDeAviso, error: unknown): void;
}

/**
 * La revision de cada minuto (SCRUM-102).
 *
 * Para cada clase de aviso:
 *
 * 1. Pregunta a quien le toca: su hora cae en la ultima media hora y hoy
 *    todavia no se reviso. Es lo unico que se mira de todos a la vez.
 * 2. Lo marca revisado **antes** de mandar nada. Si mandar falla a medias,
 *    se pierde un aviso; al reves se mandaria dos veces, y un aviso repetido
 *    molesta mas que uno que no llego.
 * 3. Decide el mensaje en nombre de la persona: sin pendientes no hay aviso
 *    del semaforo, y quien ya hizo una actividad hoy no recibe el de la racha.
 * 4. Lo entrega a cada navegador suyo. Un navegador que ya no existe se suelta.
 *
 * Lo que falle con una persona no detiene a las demas.
 */
export class RevisarAvisosUseCaseImpl implements RevisarAvisosUseCase {
  constructor(
    private readonly avisos: AvisosRepositoryPort,
    private readonly enviador: EnviadorDePushPort,
    private readonly pendientes: PendientesRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly calendario: Calendario,
    private readonly registro: RegistroDeAvisos = { fallo: () => undefined },
  ) {}

  async revisar(ahora: Date): Promise<ResumenDeLaRevision> {
    const resumen = { entregados: 0, caducadas: 0 };

    if (this.enviador.clavePublica === null) {
      return resumen;
    }

    const dia = this.calendario.diaDe(ahora);
    const minuto = this.calendario.minutoDelDia(ahora);
    // La gracia no cruza la medianoche: el dia ya es otro.
    const desde = Math.max(0, minuto - MINUTOS_DE_GRACIA);

    for (const tipo of Object.values(TipoDeAviso)) {
      const personas = await this.avisos.aQuienLeToca(tipo, desde, minuto, dia);

      for (const userId of personas) {
        try {
          await this.avisos.marcarRevisado(userId, tipo, dia);

          const mensaje = await this.mensajePara(tipo, userId, ahora, dia);

          if (mensaje !== null) {
            await this.entregar(userId, mensaje, resumen);
          }
        } catch (error) {
          this.registro.fallo(tipo, error);
        }
      }
    }

    return resumen;
  }

  private async mensajePara(
    tipo: TipoDeAviso,
    userId: UserId,
    ahora: Date,
    dia: string,
  ): Promise<MensajeDeAviso | null> {
    if (tipo === TipoDeAviso.SEMAFORO) {
      // Los hechos no cuentan: `ahora` como corte deja fuera los de antes.
      const vigentes = await this.pendientes.vigentesDe(userId, ahora);

      return mensajeDelSemaforo(
        vigentes
          .filter((pendiente) => !pendiente.hecho)
          .sort((uno, otro) => uno.creadoEn.getTime() - otro.creadoEn.getTime())
          .map((pendiente) => pendiente.texto),
      );
    }

    const { desde } = this.calendario.limitesDelDia(dia);
    const deHoy = await this.resultados.ultimosDe(userId, desde);

    return deHoy.length > 0 ? null : mensajeDeLaRacha();
  }

  private async entregar(
    userId: UserId,
    mensaje: MensajeDeAviso,
    resumen: { entregados: number; caducadas: number },
  ): Promise<void> {
    for (const suscripcion of await this.avisos.suscripcionesDe(userId)) {
      try {
        const entrega = await this.enviador.enviar(suscripcion, mensaje);

        if (entrega === 'caducada') {
          await this.avisos.desuscribir(userId, suscripcion.endpoint);
          resumen.caducadas += 1;
        } else {
          resumen.entregados += 1;
        }
      } catch (error) {
        // Un navegador que falla no impide los demas de la misma persona.
        this.registro.fallo(mensaje.tipo, error);
      }
    }
  }
}
