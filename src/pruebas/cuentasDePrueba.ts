import type { UserId } from '../domain/model/Identifier.js';
import type { ConsentimientoAceptado, User } from '../domain/model/User.js';
import type { UserRepositoryPort } from '../domain/ports/out/UserRepositoryPort.js';

/**
 * Doble del repositorio de cuentas para probar la capa de aplicacion.
 *
 * Solo depende del dominio, como pide la frontera de `application/`. Se
 * comporta como la base en lo que importa a estas pruebas —guardar dos veces
 * deja la ultima, borrar es todo o nada— y deja contar cuantas veces se guardo,
 * para comprobar que no se guarda de mas.
 */
export class RepositorioDeCuentasDoble implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();

  /** Cuantas veces se guardo, con `save` o con `guardarCambios`. */
  guardados = 0;

  findById(id: UserId): Promise<User | null> {
    return Promise.resolve(this.porId.get(id.value) ?? null);
  }

  findByIdProveedorAuth(): Promise<User | null> {
    return Promise.resolve(null);
  }

  save(user: User): Promise<void> {
    this.guardados += 1;
    this.porId.set(user.id.value, user);

    return Promise.resolve();
  }

  guardarCambios(antes: User, despues: User): Promise<User | null> {
    const actual = this.porId.get(despues.id.value);

    if (actual === undefined) {
      return Promise.resolve(null);
    }

    const quedo = actual.conLosCamposDe(despues, despues.camposCambiadosDesde(antes));

    this.guardados += 1;
    this.porId.set(quedo.id.value, quedo);

    return Promise.resolve(quedo);
  }

  consentimientosDe(): Promise<readonly ConsentimientoAceptado[]> {
    return Promise.resolve([]);
  }

  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
  }

  async inactivarConTodo(
    id: UserId,
    _cuando: Date,
    antesDeConfirmar: () => Promise<void>,
  ): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
  }

  estaInactivadaPorProveedor(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
