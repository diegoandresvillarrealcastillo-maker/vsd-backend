import {
  mensajeDeLaManana,
  mensajeDeLaNoche,
  mensajeDeLaRacha,
  mensajeDelSemaforo,
  semillaDelAviso,
  TipoDeAviso,
  type MensajeDeAviso,
} from '../../domain/model/Aviso.js';
import { Calendario } from '../../domain/model/Calendario.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type {
  ResumenDeLaRevision,
  RevisarAvisosUseCase,
} from '../../domain/ports/in/AvisosUseCase.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import { conTope } from '../conTope.js';

/**
 * Cuanto puede llegar tarde un aviso. Si el servidor estuvo parado a la hora
 * elegida, al volver manda lo de la ultima media hora; lo de antes ya no
 * tiene sentido (un "pendientes de la manana" a media tarde).
 */
export const MINUTOS_DE_GRACIA = 30;

/**
 * Cuantas personas se atienden a la vez en una revision.
 *
 * Cada persona toma una conexion de la base mientras se le reclama el aviso y
 * se lee lo suyo. El pool de conexiones del API es de 10 (el de `pg` por
 * defecto), y las peticiones de la gente salen del mismo: con 4, una revision
 * grande deja 6 libres para ellas. Subirlo sin subir el pool solo haria que las
 * peticiones esperen turno detras de los avisos.
 *
 * Lo que mas tarda no es la base sino esperar al servicio de push (hasta 10 s
 * por navegador), y mientras se espera la conexion ya esta libre: por eso unas
 * pocas personas a la vez bastan para que la revision no sea una fila de
 * esperas una detras de otra.
 */
export const PERSONAS_A_LA_VEZ = 4;

/** Para el registro: que fallo sin contar de quien. `zona` es una zona que no se pudo leer. */
export interface RegistroDeAvisos {
  fallo(tipo: TipoDeAviso | 'zona', error: unknown): void;
}

/** Las cuentas de una revision, que van sumando las personas atendidas a la vez. */
type Cuentas = { -readonly [clave in keyof ResumenDeLaRevision]: number };

/**
 * La revision de cada minuto (SCRUM-102).
 *
 * Cada persona tiene su zona horaria (SCRUM-123), y "las 8:00" son otro
 * instante en cada una. Por eso lo primero es saber en que zonas hay alguien
 * con un aviso encendido, y repetir lo de abajo para cada una con su propio
 * dia y su propio minuto. Son pocas.
 *
 * Para cada zona y cada clase de aviso:
 *
 * 1. Pregunta a quien le toca: su hora cae en la ultima media hora y hoy
 *    todavia no se reviso. Es lo unico que se mira de todos a la vez.
 * 2. Con varias personas a la vez (`PERSONAS_A_LA_VEZ`), a cada una:
 *    a. **Reclama** su aviso de hoy antes de mandar nada. El reclamo es una sola
 *       operacion de la base y solo uno lo gana: si otra revision se adelanto
 *       (dos instancias del API durante un despliegue), esta se aparta y no hay
 *       aviso doble. Y si mandar falla a medias se pierde un aviso; al reves se
 *       mandaria dos veces, y un aviso repetido molesta mas que uno que no llego.
 *    b. Decide el mensaje en nombre de la persona: sin pendientes no hay aviso
 *       del semaforo, y quien ya hizo una actividad hoy no recibe el de la
 *       racha ni el de la noche. El de la manana sale siempre.
 *    c. Lo entrega a cada navegador suyo, todos a la vez (son diez como
 *       maximo). Un navegador que ya no existe se suelta.
 *
 * Todo lo que se lee de una persona va en su nombre, con el aislamiento intacto:
 * no se abrio ninguna lectura de varias cuentas a la vez. Lo que falle con una
 * persona no detiene a las demas.
 */
export class RevisarAvisosUseCaseImpl implements RevisarAvisosUseCase {
  constructor(
    private readonly avisos: AvisosRepositoryPort,
    private readonly enviador: EnviadorDePushPort,
    private readonly pendientes: PendientesRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly registro: RegistroDeAvisos = { fallo: () => undefined },
    private readonly personasALaVez: number = PERSONAS_A_LA_VEZ,
  ) {}

  async revisar(ahora: Date): Promise<ResumenDeLaRevision> {
    const resumen = { personas: 0, entregados: 0, caducadas: 0, fallos: 0 };

    if (this.enviador.clavePublica === null) {
      return resumen;
    }

    for (const zona of await this.avisos.zonasEnUso()) {
      let calendario: Calendario;

      try {
        calendario = Calendario.de(zona);
      } catch (error) {
        // Una zona que este servidor no conoce no detiene las demas. Con la
        // validacion de la cuenta no deberia ocurrir; si ocurre, queda dicho.
        this.fallo('zona', error, resumen);
        continue;
      }

      await this.revisarZona(calendario, ahora, resumen);
    }

    return resumen;
  }

  private fallo(tipo: TipoDeAviso | 'zona', error: unknown, resumen: Cuentas): void {
    resumen.fallos += 1;
    this.registro.fallo(tipo, error);
  }

  private async revisarZona(calendario: Calendario, ahora: Date, resumen: Cuentas): Promise<void> {
    const dia = calendario.diaDe(ahora);
    const minuto = calendario.minutoDelDia(ahora);
    // La gracia no cruza la medianoche: el dia ya es otro.
    const desde = Math.max(0, minuto - MINUTOS_DE_GRACIA);

    for (const tipo of Object.values(TipoDeAviso)) {
      const personas = await this.avisos.aQuienLeToca(
        tipo,
        calendario.zonaHoraria,
        desde,
        minuto,
        dia,
      );

      await conTope(personas, this.personasALaVez, (userId) =>
        this.revisarPersona(userId, tipo, ahora, dia, calendario, resumen),
      );
    }
  }

  /** Todo lo de una persona. Nunca lanza: lo que falle queda dicho y contado. */
  private async revisarPersona(
    userId: UserId,
    tipo: TipoDeAviso,
    ahora: Date,
    dia: string,
    calendario: Calendario,
    resumen: Cuentas,
  ): Promise<void> {
    try {
      if (!(await this.avisos.marcarRevisado(userId, tipo, dia))) {
        // Otra revision ya lo reclamo hoy: no es nuestro.
        return;
      }

      resumen.personas += 1;

      const mensaje = await this.mensajePara(tipo, userId, ahora, dia, calendario);

      if (mensaje !== null) {
        await this.entregar(userId, mensaje, resumen);
      }
    } catch (error) {
      this.fallo(tipo, error, resumen);
    }
  }

  private async mensajePara(
    tipo: TipoDeAviso,
    userId: UserId,
    ahora: Date,
    dia: string,
    calendario: Calendario,
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

    if (tipo === TipoDeAviso.MANANA) {
      return mensajeDeLaManana(semillaDelAviso(userId, dia));
    }

    // La racha y la noche: una invitacion, solo si hoy no hizo nada todavia.
    // Basta saber si hubo algo, no que fue.
    const { desde } = calendario.limitesDelDia(dia);

    if (await this.resultados.hayActividadDesde(userId, desde)) {
      return null;
    }

    return tipo === TipoDeAviso.NOCHE
      ? mensajeDeLaNoche(semillaDelAviso(userId, dia))
      : mensajeDeLaRacha();
  }

  private async entregar(userId: UserId, mensaje: MensajeDeAviso, resumen: Cuentas): Promise<void> {
    const suscripciones = await this.avisos.suscripcionesDe(userId);

    // Todos a la vez: son como mucho diez por cuenta, y esperarlos uno tras otro
    // sumaria hasta diez veces la espera del servicio de push mas lento.
    await Promise.all(
      suscripciones.map(async (suscripcion) => {
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
          this.fallo(mensaje.tipo, error, resumen);
        }
      }),
    );
  }
}
