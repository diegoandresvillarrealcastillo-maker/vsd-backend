import type { UserId } from '../../domain/model/Identifier.js';
import {
  TipoDeConsentimiento,
  type ConsentimientoAceptado,
  type User,
} from '../../domain/model/User.js';
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

  /** El historial de lo aceptado por cuenta: solo se anade, como en la base. */
  private readonly historial = new Map<string, ConsentimientoAceptado[]>();

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
    this.anotarLoAceptado(user);

    return Promise.resolve();
  }

  consentimientosDe(id: UserId): Promise<readonly ConsentimientoAceptado[]> {
    return Promise.resolve([...(this.historial.get(id.value) ?? [])]);
  }

  /** Lo mismo que hace la base: una fila por aceptacion, sin repetir la que ya esta. */
  private anotarLoAceptado(user: User): void {
    const anotadas = this.historial.get(user.id.value) ?? [];
    const aceptadas = [
      { tipo: TipoDeConsentimiento.AVISO_DE_PRIVACIDAD, aceptado: user.consentimiento },
      { tipo: TipoDeConsentimiento.TERMINOS, aceptado: user.terminos },
    ];

    for (const { tipo, aceptado } of aceptadas) {
      if (aceptado === undefined) {
        continue;
      }

      const yaEsta = anotadas.some(
        (fila) =>
          fila.tipo === tipo &&
          fila.version === aceptado.versionPolitica &&
          fila.aceptadoEn.getTime() === aceptado.aceptadoEn.getTime(),
      );

      if (!yaEsta) {
        anotadas.push({ tipo, version: aceptado.versionPolitica, aceptadoEn: aceptado.aceptadoEn });
      }
    }

    this.historial.set(user.id.value, anotadas);
  }

  /**
   * Aqui no hay transaccion que deshacer, asi que el orden se invierte: primero
   * lo de fuera y, solo si sale bien, se borra. El efecto visible es el mismo
   * que en la base: o se borra todo o no se borra nada.
   *
   * No borra los resultados del adaptador en memoria de resultados: un Map no
   * tiene claves foraneas. Que el borrado alcance a todas las tablas lo
   * garantiza la base, y lo prueba la suite de integracion.
   */
  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
    this.historial.delete(id.value);
  }

  /** Numero de cuentas guardadas. Solo para pruebas. */
  get cantidad(): number {
    return this.porId.size;
  }
}
