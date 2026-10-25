import { beforeEach, describe, expect, it } from 'vitest';
import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { AlmacenDoble } from '../../pruebas/almacenDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { PNG_REAL_DE_8_X_6 } from '../../pruebas/fotosDePrueba.js';
import { InactivarCuentaUseCaseImpl } from './InactivarCuentaUseCaseImpl.js';

/**
 * Dar de baja la cuenta propia (SCRUM-190, ADR 0026): se borra todo lo vivo y queda una constancia
 * mínima, sin nombre ni correo, de lo que la persona aceptó y de que la cuenta existió.
 *
 * Lo que se vigila: el orden (lo irreversible va al final), el todo-o-nada, que una cuenta dada de
 * baja no se pueda resucitar con un token que todavía no caducó, y que no quede nada personal.
 */
const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const AHORA = new Date('2026-10-14T15:00:00.000Z');

/**
 * Doble del repositorio que se comporta como la base: todo o nada, y una baja que se recuerda por el
 * identificador del proveedor. El contenido de la constancia lo prueba el contrato del repositorio.
 */
class RepositorioDoble implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();
  /** Cuándo se dio de baja cada cuenta, por el identificador del proveedor. */
  readonly dadasDeBaja = new Map<string, Date>();

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

  consentimientosDe(): Promise<[]> {
    return Promise.resolve([]);
  }

  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
  }

  async inactivarConTodo(
    id: UserId,
    inactivadaEl: Date,
    antesDeConfirmar: () => Promise<void>,
  ): Promise<void> {
    const cuenta = this.porId.get(id.value);

    if (cuenta === undefined) {
      return;
    }

    await antesDeConfirmar();
    this.dadasDeBaja.set(cuenta.idProveedorAuth, inactivadaEl);
    this.porId.delete(id.value);
  }

  estaInactivadaPorProveedor(idProveedorAuth: string): Promise<boolean> {
    return Promise.resolve(this.dadasDeBaja.has(idProveedorAuth));
  }
}

/** Doble del proveedor: anota a quién borra y puede fallar a voluntad. */
class ProveedorDoble implements ProveedorDeIdentidadPort {
  readonly borradas: string[] = [];
  falla = false;

  borrarIdentidad(idProveedorAuth: string): Promise<void> {
    if (this.falla) {
      return Promise.reject(new Error('Supabase no respondio'));
    }

    this.borradas.push(idProveedorAuth);

    return Promise.resolve();
  }
}

describe('InactivarCuentaUseCaseImpl', () => {
  let cuentas: RepositorioDoble;
  let proveedor: ProveedorDoble;
  let casoDeUso: InactivarCuentaUseCaseImpl;

  beforeEach(async () => {
    cuentas = new RepositorioDoble();
    proveedor = new ProveedorDoble();
    casoDeUso = new InactivarCuentaUseCaseImpl(cuentas, proveedor, [], () => AHORA);

    await cuentas.save(unaCuenta({ idProveedorAuth: 'supabase|aaaa-1111', nombre: 'Ana' }));
  });

  it('la cuenta deja de existir y su identidad se borra en el proveedor', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    await expect(cuentas.findById(new UserId(PERSONA))).resolves.toBeNull();
    expect(proveedor.borradas).toEqual(['supabase|aaaa-1111']);
  });

  it('queda dada de baja para su identificador, para que su token no la resucite', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(true);
    // Con la hora del reloj del caso de uso, no con la del equipo que corre la prueba.
    expect(cuentas.dadasDeBaja.get('supabase|aaaa-1111')).toEqual(AHORA);
  });

  it('si el proveedor falla, no se da de baja nada y se dice con un error claro', async () => {
    proveedor.falla = true;

    await expect(casoDeUso.execute(new UserId(PERSONA))).rejects.toThrow(
      AccountDeletionFailedError,
    );

    await expect(cuentas.findById(new UserId(PERSONA))).resolves.not.toBeNull();
    await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(false);
  });

  it('el error guarda la causa para el registro del servidor', async () => {
    proveedor.falla = true;

    const error = await casoDeUso.execute(new UserId(PERSONA)).catch((e: unknown) => e);

    expect((error as Error).cause).toBeInstanceOf(Error);
    expect((error as Error).message).not.toContain('Supabase');
  });

  it('una cuenta que no existe no es un error y no toca al proveedor', async () => {
    await expect(casoDeUso.execute(new UserId(OTRA))).resolves.toBeUndefined();

    expect(proveedor.borradas).toEqual([]);
    await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(false);
  });

  describe('los archivos de la persona (SCRUM-120)', () => {
    const FOTO = { contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' };
    let fotos: AlmacenDoble;

    beforeEach(async () => {
      fotos = new AlmacenDoble();
      casoDeUso = new InactivarCuentaUseCaseImpl(cuentas, proveedor, [fotos], () => AHORA);

      await fotos.guardar(new UserId(PERSONA), FOTO);
      await fotos.guardar(new UserId(OTRA), FOTO);
    });

    it('borra la foto junto con la cuenta, y solo la de esa persona', async () => {
      await casoDeUso.execute(new UserId(PERSONA));

      expect(await fotos.leer(new UserId(PERSONA))).toBeUndefined();
      expect(await fotos.leer(new UserId(OTRA))).toEqual(FOTO);
    });

    it('borra los archivos antes que la identidad: lo irreversible va al final', async () => {
      const orden: string[] = [];
      const almacen: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: () => Promise.resolve(undefined),
        borrar: () => {
          orden.push('archivos');

          return Promise.resolve();
        },
      };
      const borrarIdentidad = proveedor.borrarIdentidad.bind(proveedor);

      proveedor.borrarIdentidad = (id) => {
        orden.push('identidad');

        return borrarIdentidad(id);
      };

      await new InactivarCuentaUseCaseImpl(cuentas, proveedor, [almacen], () => AHORA).execute(
        new UserId(PERSONA),
      );

      expect(orden).toEqual(['archivos', 'identidad']);
    });

    it('si el almacenamiento falla, no se da de baja nada: ni la cuenta ni la identidad', async () => {
      const roto: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: () => Promise.resolve(undefined),
        borrar: () => Promise.reject(new Error('Storage no respondio')),
      };

      await expect(
        new InactivarCuentaUseCaseImpl(cuentas, proveedor, [roto], () => AHORA).execute(
          new UserId(PERSONA),
        ),
      ).rejects.toThrow(AccountDeletionFailedError);

      await expect(cuentas.findById(new UserId(PERSONA))).resolves.not.toBeNull();
      await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(false);
      expect(proveedor.borradas).toEqual([]);
    });

    it('una cuenta que ya no existe no toca los almacenes', async () => {
      await casoDeUso.execute(new UserId('33333333-3333-4333-a333-333333333333'));

      expect(fotos.cantidad).toBe(2);
    });
  });
});
