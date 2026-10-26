import type { BajaPendiente } from '../domain/model/BajaPendiente.js';
import type { UserId } from '../domain/model/Identifier.js';
import type { ConsentimientoAceptado, User } from '../domain/model/User.js';
import type { UserRepositoryPort } from '../domain/ports/out/UserRepositoryPort.js';

/**
 * Doble del repositorio de cuentas que se comporta como la base en lo que importa a la baja
 * (SCRUM-267, ADR 0040): la marca se va con la cuenta, el borrado de las filas es todo o nada, y
 * puede fallar en el paso que se le diga.
 *
 * Solo depende del dominio, como pide la frontera de `application/`. Lo que la base garantiza de
 * verdad (la clave foranea, las politicas, la cascada) lo prueba el contrato del repositorio y la
 * suite de integracion, no esto.
 */
export class RepositorioConBajas implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();
  private readonly marcas = new Map<string, BajaPendiente>();

  /** Cuando se dio de baja cada cuenta con constancia, por el identificador del proveedor. */
  readonly dadasDeBaja = new Map<string, Date>();

  /** Con esto en `true`, `marcarBaja` falla como si la base no respondiera. */
  fallaAlMarcar = false;

  /** Con esto en `true`, el borrado de las filas falla y no cambia nada, como una transaccion. */
  fallaAlBorrarFilas = false;

  /** Lo que se hizo con la base, en orden: `marca`, `filas`. Para comprobar el orden de la baja. */
  constructor(private readonly orden: string[] = []) {}

  /** Las bajas marcadas que no terminaron. */
  get pendientes(): readonly BajaPendiente[] {
    return [...this.marcas.values()];
  }

  findById(id: UserId): Promise<User | null> {
    return Promise.resolve(this.porId.get(id.value) ?? null);
  }

  findByIdProveedorAuth(): Promise<User | null> {
    return Promise.resolve(null);
  }

  save(user: User): Promise<void> {
    this.porId.set(user.id.value, user);

    return Promise.resolve();
  }

  guardarCambios(): Promise<User | null> {
    return Promise.reject(new Error('no se usa en esta prueba'));
  }

  consentimientosDe(): Promise<readonly ConsentimientoAceptado[]> {
    return Promise.resolve([]);
  }

  marcarBaja(id: UserId, conConstancia: boolean, pedidaEl: Date): Promise<boolean> {
    if (this.fallaAlMarcar) {
      return Promise.reject(new Error('la base no respondio'));
    }

    if (!this.porId.has(id.value)) {
      return Promise.resolve(false);
    }

    this.orden.push('marca');

    // La primera marca manda.
    if (!this.marcas.has(id.value)) {
      this.marcas.set(id.value, { id, conConstancia, pedidaEl });
    }

    return Promise.resolve(true);
  }

  bajasPendientes(pedidasAntes: Date, limite: number): Promise<readonly BajaPendiente[]> {
    return Promise.resolve(
      this.pendientes
        .filter((baja) => baja.pedidaEl.getTime() < pedidasAntes.getTime())
        .sort((a, b) => a.pedidaEl.getTime() - b.pedidaEl.getTime())
        .slice(0, limite),
    );
  }

  inactivarConTodo(id: UserId, inactivadaEl: Date): Promise<void> {
    const cuenta = this.porId.get(id.value);

    if (cuenta === undefined) {
      return Promise.resolve();
    }

    if (this.fallaAlBorrarFilas) {
      return Promise.reject(new Error('la base fallo al confirmar'));
    }

    this.orden.push('filas');
    this.dadasDeBaja.set(cuenta.idProveedorAuth, inactivadaEl);
    this.quitar(id);

    return Promise.resolve();
  }

  borrarConTodo(id: UserId): Promise<void> {
    if (this.fallaAlBorrarFilas && this.porId.has(id.value)) {
      return Promise.reject(new Error('la base fallo al confirmar'));
    }

    if (this.porId.has(id.value)) {
      this.orden.push('filas');
    }

    this.quitar(id);

    return Promise.resolve();
  }

  estaInactivadaPorProveedor(idProveedorAuth: string): Promise<boolean> {
    return Promise.resolve(this.dadasDeBaja.has(idProveedorAuth));
  }

  private quitar(id: UserId): void {
    this.porId.delete(id.value);
    this.marcas.delete(id.value);
  }
}
