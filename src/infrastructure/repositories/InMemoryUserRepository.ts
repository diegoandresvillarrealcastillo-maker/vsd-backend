import type { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Adaptador de cuentas en memoria.
 *
 * Sirve para probar la capa de aplicacion sin levantar una base de datos, y
 * para el arranque sin `DATABASE_URL`.
 *
 * Se guarda una sola coleccion, indexada por nuestro identificador, y la
 * busqueda por proveedor recorre los valores. Con un Map por cada forma de
 * buscar habria dos sitios que mantener sincronizados, y el dia que uno se
 * quedara atras este adaptador diria cosas que la base no dice. Recorrer es
 * de sobra: aqui dentro nunca hay mas que las cuentas de una prueba.
 *
 * Aviso, el mismo que lleva el adaptador de resultados: esto no sustituye a
 * las pruebas de integracion. Un Map no tiene restricciones UNIQUE, ni
 * transacciones, ni politicas de aislamiento. Que no se dupliquen cuentas en
 * produccion lo garantiza el UNIQUE sobre `id_proveedor_auth`, no esta clase.
 */
export class InMemoryUserRepository implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();

  findById(id: UserId): Promise<User | null> {
    // El puerto es asincrono porque el adaptador real habla con PostgreSQL.
    // Aqui no hay nada que esperar, asi que se devuelve una promesa resuelta
    // en lugar de declarar el metodo async sin usar await.
    return Promise.resolve(this.porId.get(id.value) ?? null);
  }

  findByIdProveedorAuth(idProveedorAuth: string): Promise<User | null> {
    const encontrada = [...this.porId.values()].find(
      (cuenta) => cuenta.idProveedorAuth === idProveedorAuth,
    );

    return Promise.resolve(encontrada ?? null);
  }

  save(user: User): Promise<void> {
    this.porId.set(user.id.value, user);

    return Promise.resolve();
  }

  /** Numero de cuentas guardadas. Solo para pruebas. */
  get cantidad(): number {
    return this.porId.size;
  }
}
