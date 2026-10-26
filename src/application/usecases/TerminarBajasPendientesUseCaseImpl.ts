import type {
  ResumenDeLasBajas,
  TerminarBajasPendientesUseCase,
} from '../../domain/ports/in/BajasPendientesUseCase.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import type { BajaDeCuenta } from '../services/BajaDeCuenta.js';

/**
 * Cuanto tiene que llevar pedida una baja para que la tarea la tome: dos minutos.
 *
 * Quien la pidio espera a lo de fuera unos segundos (los almacenes de 5 s de tope y la identidad de
 * 4 s caben en 14 s). Pasado este rato, esa peticion ya termino o murio, y la baja se da por
 * cortada. Antes no: se estaria repitiendo una baja que sigue en curso.
 */
export const ESPERA_ANTES_DE_REINTENTAR_MS = 2 * 60_000;

/** Cuantas bajas toma cada vuelta. Si muchas fallan a la vez (el proveedor caido), van por turnos. */
export const BAJAS_POR_VUELTA = 20;

/** Para el registro: que fallo, sin contar de quien. */
export interface RegistroDeBajas {
  fallo(error: unknown): void;
}

/**
 * Termina las bajas de cuenta que se pidieron y no llegaron al final (SCRUM-267, ADR 0040): la
 * base fallo al confirmar, el proveedor no respondio, o el proceso se cayo a mitad.
 *
 * Repite los mismos pasos que la peticion original, con `BajaDeCuenta.terminar`, que es
 * idempotente. Una baja que falla no detiene a las demas: sigue marcada y se vuelve a intentar en
 * la proxima vuelta. Dos instancias del API pueden tomar la misma baja sin problema: la segunda no
 * encuentra la cuenta.
 */
export class TerminarBajasPendientesUseCaseImpl implements TerminarBajasPendientesUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly baja: BajaDeCuenta,
    private readonly registro: RegistroDeBajas = { fallo: () => undefined },
  ) {}

  async terminar(ahora: Date): Promise<ResumenDeLasBajas> {
    const pendientes = await this.cuentas.bajasPendientes(
      new Date(ahora.getTime() - ESPERA_ANTES_DE_REINTENTAR_MS),
      BAJAS_POR_VUELTA,
    );

    let terminadas = 0;
    let fallos = 0;

    for (const pendiente of pendientes) {
      try {
        await this.baja.terminar(pendiente.id, pendiente.conConstancia);
        terminadas += 1;
      } catch (error) {
        fallos += 1;
        this.registro.fallo(error);
      }
    }

    return { tomadas: pendientes.length, terminadas, fallos };
  }
}
