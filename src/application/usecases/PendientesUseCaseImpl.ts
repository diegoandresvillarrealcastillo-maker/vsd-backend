import { Calendario } from '../../domain/model/Calendario.js';
import { TaskNotFoundError } from '../../domain/model/DomainError.js';
import { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import { elegirRecordatorio, NivelDePendiente, Pendiente } from '../../domain/model/Pendiente.js';
import type {
  CrearPendienteCommand,
  EditarPendienteCommand,
  PendientesUseCase,
  SemaforoDePendientes,
} from '../../domain/ports/in/PendientesUseCase.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';

/** Cuanto siguen a la vista los ya hechos: lo justo para ver lo que se tacho. */
export const DIAS_QUE_SE_VEN_LOS_HECHOS = 7;

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

  async editar(command: EditarPendienteCommand): Promise<Pendiente> {
    const userId = new UserId(command.userId);
    const id = new PendienteId(command.pendienteId);
    const actual = await this.pendientes.porId(userId, id);

    if (actual === null) {
      throw new TaskNotFoundError();
    }

    const editado = actual.editar(
      {
        texto: command.texto,
        nivel: command.nivel,
        hecho: command.hecho,
        posponerHasta: command.posponerHasta,
        fechaLimite: command.fechaLimite,
      },
      this.reloj(),
    );
    const guardado = await this.pendientes.actualizar(editado);

    if (guardado === null) {
      throw new TaskNotFoundError();
    }

    return guardado;
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
