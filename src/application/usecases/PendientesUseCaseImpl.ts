import { Calendario } from '../../domain/model/Calendario.js';
import { StaleTaskError, TaskNotFoundError } from '../../domain/model/DomainError.js';
import { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import {
  elegirRecordatorio,
  NivelDePendiente,
  Pendiente,
  soloMarcaComoHecho,
  type CambiosDePendiente,
} from '../../domain/model/Pendiente.js';
import type {
  CrearPendienteCommand,
  EditarPendienteCommand,
  PendientesUseCase,
  SemaforoDePendientes,
} from '../../domain/ports/in/PendientesUseCase.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';

/** Cuanto siguen a la vista los ya hechos: lo justo para ver lo que se tacho. */
export const DIAS_QUE_SE_VEN_LOS_HECHOS = 7;

/**
 * Cuantas veces se reintenta una edicion que no choca con nada pero que otro
 * dispositivo cambio justo entre leer y escribir. Tres alcanza de sobra: hace
 * falta que otro dispositivo cambie el mismo pendiente tres veces en los
 * milisegundos que dura una edicion.
 */
const INTENTOS_AL_EDITAR = 3;

const ORDEN: readonly string[] = Object.values(NivelDePendiente);
const UN_DIA_EN_MS = 24 * 60 * 60 * 1000;

/**
 * El semaforo de pendientes (SCRUM-97).
 *
 * Ordena para la pantalla: primero lo que falta, por color (urgente,
 * prioridad, aplazable) y del mas antiguo al mas nuevo; despues lo hecho en
 * los ultimos siete dias, lo mas reciente arriba.
 */
export class PendientesUseCaseImpl implements PendientesUseCase {
  constructor(
    private readonly pendientes: PendientesRepositoryPort,
    private readonly generarId: () => PendienteId = () =>
      new PendienteId(globalThis.crypto.randomUUID()),
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async consultar(userId: string, zonaHoraria: string): Promise<SemaforoDePendientes> {
    const ahora = this.reloj();
    const suyos = await this.pendientes.vigentesDe(
      new UserId(userId),
      new Date(ahora.getTime() - DIAS_QUE_SE_VEN_LOS_HECHOS * UN_DIA_EN_MS),
    );

    const porHacer = suyos
      .filter((pendiente) => !pendiente.hecho)
      .sort(
        (uno, otro) =>
          ORDEN.indexOf(uno.nivel) - ORDEN.indexOf(otro.nivel) ||
          uno.creadoEn.getTime() - otro.creadoEn.getTime(),
      );
    const hechos = suyos
      .filter((pendiente) => pendiente.hecho)
      .sort((uno, otro) => otro.editadoEn.getTime() - uno.editadoEn.getTime());

    return {
      pendientes: [...porHacer, ...hechos],
      recordatorio: elegirRecordatorio(porHacer, ahora, Calendario.de(zonaHoraria).diaDe(ahora)),
    };
  }

  async crear(command: CrearPendienteCommand): Promise<Pendiente> {
    const userId = new UserId(command.userId);
    const clientOperationId = new ClientOperationId(command.clientOperationId);

    // Un reintento devuelve el que ya se guardo, sin duplicarlo.
    const existente = await this.pendientes.porOperacion(userId, clientOperationId);

    if (existente !== null) {
      return existente;
    }

    return this.pendientes.guardarNuevo(
      Pendiente.nuevo(
        {
          id: this.generarId(),
          userId,
          clientOperationId,
          texto: command.texto,
          nivel: command.nivel,
          fechaLimite: command.fechaLimite,
        },
        this.reloj(),
      ),
    );
  }

  /**
   * Edita un pendiente, detectando que otro dispositivo lo cambio (SCRUM-134).
   *
   * Que pasa cuando la version del dispositivo ya no es la vigente:
   *
   * 1. **Si el pendiente ya esta como se pide**, no hay nada que decidir: se
   *    devuelve tal cual. Es lo que le pasa a un reintento cuya respuesta se
   *    perdio (la edicion se aplico, el dispositivo no se entero y la reenvia
   *    con la version de antes) y lo que evita que se tope con un conflicto
   *    contra si mismo.
   * 2. **Si solo lo marca como hecho**, se aplica sobre lo vigente. Es un hecho
   *    que ocurrio y se lleva bien con cualquier otro cambio.
   * 3. **En cualquier otro caso**, es un conflicto (409): no se pisa lo del otro
   *    dispositivo, y el cliente consulta como quedo y la persona decide.
   *
   * Sin version (dispositivos anteriores) no se comprueba nada, como antes.
   *
   * La comparacion que cuenta la hace la base dentro del UPDATE (ver el puerto):
   * leer, comparar y escribir por separado dejaria pasar al que llega justo en
   * medio.
   */
  async editar(command: EditarPendienteCommand): Promise<Pendiente> {
    const userId = new UserId(command.userId);
    const id = new PendienteId(command.pendienteId);
    const cambios: CambiosDePendiente = {
      texto: command.texto,
      nivel: command.nivel,
      hecho: command.hecho,
      posponerHasta: command.posponerHasta,
      fechaLimite: command.fechaLimite,
    };

    // Lo que se lleva bien con cualquier otro cambio: si el choque es solo con
    // una escritura concurrente, se relee y se reaplica sobre lo vigente.
    const sinConflicto = command.version === undefined || soloMarcaComoHecho(cambios);

    for (let intento = 1; intento <= INTENTOS_AL_EDITAR; intento += 1) {
      const actual = await this.pendientes.porId(userId, id);

      if (actual === null) {
        throw new TaskNotFoundError();
      }

      if (command.version !== undefined && command.version !== actual.version) {
        if (actual.yaTiene(cambios)) {
          return actual;
        }

        if (!sinConflicto) {
          throw new StaleTaskError();
        }
      }

      const guardado = await this.pendientes.actualizar(
        actual.editar(cambios, this.reloj()),
        actual.version,
      );

      if (guardado !== null) {
        return guardado;
      }

      // La base no la dejo pasar: lo borraron, o lo cambio otro dispositivo
      // entre la lectura y la escritura.
      if (!sinConflicto) {
        if ((await this.pendientes.porId(userId, id)) === null) {
          throw new TaskNotFoundError();
        }

        throw new StaleTaskError();
      }
    }

    throw new StaleTaskError();
  }

  async borrar(userId: string, pendienteId: string): Promise<void> {
    // Borrar algo que ya no esta tiene el mismo resultado que borrarlo: que no
    // quede. Responder error aqui atascaria la sincronizacion sin conexion: si
    // la respuesta del primer borrado se pierde, el reintento llegaria a un
    // 404 que la cola no sabria distinguir de un fallo de verdad.
    //
    // No filtra nada: un pendiente de otra persona responde igual que uno que
    // no existe (ADR 0010), y tampoco se toca.
    await this.pendientes.borrar(new UserId(userId), new PendienteId(pendienteId));
  }
}
