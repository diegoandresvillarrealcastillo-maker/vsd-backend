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
import { BorrarCuentaUseCaseImpl } from './BorrarCuentaUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';

/** Doble del repositorio que se comporta como la base: todo o nada. */
class RepositorioDoble implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();

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

  consentimientosDe(): Promise<[]> {
    return Promise.resolve([]);
  }

  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
  }
}

/** Doble del proveedor: anota a quien borra y puede fallar a voluntad. */
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

describe('BorrarCuentaUseCaseImpl', () => {
  let cuentas: RepositorioDoble;
  let proveedor: ProveedorDoble;
  let casoDeUso: BorrarCuentaUseCaseImpl;

  beforeEach(async () => {
    cuentas = new RepositorioDoble();
    proveedor = new ProveedorDoble();
    casoDeUso = new BorrarCuentaUseCaseImpl(cuentas, proveedor);

    await cuentas.save(unaCuenta({ idProveedorAuth: 'supabase|aaaa-1111' }));
  });

  it('borra la cuenta y la identidad en el proveedor', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    await expect(cuentas.findById(new UserId(PERSONA))).resolves.toBeNull();
    expect(proveedor.borradas).toEqual(['supabase|aaaa-1111']);
  });

  it('si el proveedor falla, no se borra nada y se dice con un error claro', async () => {
    proveedor.falla = true;

    await expect(casoDeUso.execute(new UserId(PERSONA))).rejects.toThrow(
      AccountDeletionFailedError,
    );
    await expect(cuentas.findById(new UserId(PERSONA))).resolves.not.toBeNull();
  });

  it('el error guarda la causa para el registro del servidor', async () => {
    proveedor.falla = true;

    const error = await casoDeUso.execute(new UserId(PERSONA)).catch((e: unknown) => e);

    expect((error as Error).cause).toBeInstanceOf(Error);
    expect((error as Error).message).not.toContain('Supabase');
  });

  it('una cuenta que ya no existe no toca el proveedor', async () => {
    await casoDeUso.execute(new UserId('22222222-2222-4222-9222-222222222222'));

    expect(proveedor.borradas).toEqual([]);
  });

  describe('los archivos de la persona (SCRUM-120)', () => {
    const OTRA = '22222222-2222-4222-9222-222222222222';
    const FOTO = { contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' };
    let fotos: AlmacenDoble;

    beforeEach(async () => {
      fotos = new AlmacenDoble();
      casoDeUso = new BorrarCuentaUseCaseImpl(cuentas, proveedor, [fotos]);

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

      await new BorrarCuentaUseCaseImpl(cuentas, proveedor, [almacen]).execute(new UserId(PERSONA));

      expect(orden).toEqual(['archivos', 'identidad']);
    });

    it('si el almacenamiento falla, no se borra nada: ni la cuenta ni la identidad', async () => {
      const roto: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: () => Promise.resolve(undefined),
        borrar: () => Promise.reject(new Error('Storage no respondio')),
      };

      await expect(
        new BorrarCuentaUseCaseImpl(cuentas, proveedor, [roto]).execute(new UserId(PERSONA)),
      ).rejects.toThrow(AccountDeletionFailedError);

      await expect(cuentas.findById(new UserId(PERSONA))).resolves.not.toBeNull();
      expect(proveedor.borradas).toEqual([]);
    });

    it('con varios almacenes, borra de todos', async () => {
      const mascota = new AlmacenDoble();

      await mascota.guardar(new UserId(PERSONA), FOTO);

      await new BorrarCuentaUseCaseImpl(cuentas, proveedor, [fotos, mascota]).execute(
        new UserId(PERSONA),
      );

      expect(mascota.cantidad).toBe(0);
      expect(await fotos.leer(new UserId(PERSONA))).toBeUndefined();
    });

    it('una cuenta que ya no existe no toca los almacenes', async () => {
      await casoDeUso.execute(new UserId('33333333-3333-4333-a333-333333333333'));

      expect(fotos.cantidad).toBe(2);
    });
  });
});
