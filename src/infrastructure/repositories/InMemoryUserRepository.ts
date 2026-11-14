import type { BajaPendiente } from '../../domain/model/BajaPendiente.js';
import type { ConstanciaDeBaja } from '../../domain/model/ConstanciaDeBaja.js';
import { AccountInactiveError } from '../../domain/model/DomainError.js';
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

  /** Las cuentas dadas de baja (SCRUM-190), por el identificador del proveedor. */
  private readonly dadasDeBaja = new Map<string, ConstanciaDeBaja>();

  /** Las bajas pedidas que no terminaron (SCRUM-267), por cuenta. */
  private readonly bajas = new Map<string, BajaPendiente>();

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
    // Igual que la base: una orden que llega despues de la baja no vuelve a crear la cuenta.
    if ([...this.dadasDeBaja.values()].some((baja) => baja.idCuenta === user.id.value)) {
      return Promise.reject(new AccountInactiveError());
    }

    this.porId.set(user.id.value, user);
    this.anotarLoAceptado(user);

    return Promise.resolve();
  }

  guardarCambios(antes: User, despues: User): Promise<User | null> {
    const campos = despues.camposCambiadosDesde(antes);
    const actual = this.porId.get(despues.id.value);

    // Una cuenta borrada o dada de baja ya no esta aqui: no se vuelve a crear.
    if (actual === undefined) {
      return Promise.resolve(null);
    }

    const quedo = actual.conLosCamposDe(despues, campos);

    this.porId.set(quedo.id.value, quedo);
    this.anotarLoAceptado(quedo);

    return Promise.resolve(quedo);
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

  marcarBaja(id: UserId, conConstancia: boolean, pedidaEl: Date): Promise<boolean> {
    if (!this.porId.has(id.value)) {
      return Promise.resolve(false);
    }

    // La primera marca manda, como el `ON CONFLICT DO NOTHING` de la base.
    if (!this.bajas.has(id.value)) {
      this.bajas.set(id.value, { id, conConstancia, pedidaEl });
    }

    return Promise.resolve(true);
  }

  bajasPendientes(pedidasAntes: Date, limite: number): Promise<readonly BajaPendiente[]> {
    return Promise.resolve(
      [...this.bajas.values()]
        .filter((baja) => baja.pedidaEl.getTime() < pedidasAntes.getTime())
        .sort(
          (a, b) =>
            a.pedidaEl.getTime() - b.pedidaEl.getTime() || a.id.value.localeCompare(b.id.value),
        )
        .slice(0, limite),
    );
  }

  /**
   * No borra los resultados del adaptador en memoria de resultados: un Map no tiene claves
   * foraneas. Que el borrado alcance a todas las tablas lo garantiza la base, y lo prueba la suite
   * de integracion. La marca de la baja si se va, como por la cascada de la base.
   */
  borrarConTodo(id: UserId): Promise<void> {
    this.quitar(id);

    return Promise.resolve();
  }

  /** Da de baja la cuenta con constancia: la misma cuenta que se borra y su marca se van juntas. */
  inactivarConTodo(id: UserId, inactivadaEl: Date): Promise<void> {
    const cuenta = this.porId.get(id.value);

    if (cuenta === undefined) {
      return Promise.resolve();
    }

    this.dadasDeBaja.set(cuenta.idProveedorAuth, {
      idCuenta: id.value,
      idProveedorAuth: cuenta.idProveedorAuth,
      registradaEn: cuenta.registradoEn,
      inactivadaEl,
      consentimientos: [...(this.historial.get(id.value) ?? [])],
    });
    this.quitar(id);

    return Promise.resolve();
  }

  private quitar(id: UserId): void {
    this.porId.delete(id.value);
    this.historial.delete(id.value);
    this.bajas.delete(id.value);
  }

  estaInactivadaPorProveedor(idProveedorAuth: string): Promise<boolean> {
    return Promise.resolve(this.dadasDeBaja.has(idProveedorAuth));
  }

  /** Las constancias de las cuentas dadas de baja. Solo para pruebas. */
  get constancias(): readonly ConstanciaDeBaja[] {
    return [...this.dadasDeBaja.values()];
  }

  /** Numero de cuentas guardadas. Solo para pruebas. */
  get cantidad(): number {
    return this.porId.size;
  }
}
