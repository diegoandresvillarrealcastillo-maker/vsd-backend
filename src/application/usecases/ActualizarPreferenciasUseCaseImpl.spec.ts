import { beforeEach, describe, expect, it } from 'vitest';
import {
  AccountNotProvisionedError,
  NoActiveModulesError,
} from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { ActualizarPreferenciasUseCaseImpl } from './ActualizarPreferenciasUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const LUMA = { forma: 'brote', color: '#a2d9b6', accesorio: 'ninguno', nombre: 'Luma' };

/** Doble del repositorio, igual que en las pruebas del alta. */
class RepositorioDoble implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();

  findById(id: UserId): Promise<User | null> {
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

  consentimientosDe(): Promise<[]> {
    return Promise.resolve([]);
  }

  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
  }
}

describe('ActualizarPreferenciasUseCaseImpl', () => {
  let cuentas: RepositorioDoble;
  let casoDeUso: ActualizarPreferenciasUseCaseImpl;

  beforeEach(async () => {
    cuentas = new RepositorioDoble();
    casoDeUso = new ActualizarPreferenciasUseCaseImpl(cuentas);

    await cuentas.save(unaCuenta());
    await cuentas.save(
      unaCuenta({ id: OTRA, correo: 'otra@ejemplo.test', idProveedorAuth: 'supabase|bbbb' }),
    );
  });

  it('guarda los modulos y la mascota', async () => {
    await casoDeUso.execute(new UserId(PERSONA), {
      modulosActivos: ['emociones', 'cognicion'],
      mascota: LUMA,
    });

    const guardada = await cuentas.findById(new UserId(PERSONA));

    expect(guardada?.modulosActivos).toEqual(['cognicion', 'emociones']);
    expect(guardada?.mascota).toEqual(LUMA);
  });

  it('devuelve la cuenta como quedo', async () => {
    const cuenta = await casoDeUso.execute(new UserId(PERSONA), { modulosActivos: ['bienestar'] });

    expect(cuenta.modulosActivos).toEqual(['bienestar']);
  });

  it('solo cambia la cuenta indicada', async () => {
    await casoDeUso.execute(new UserId(PERSONA), { modulosActivos: ['bienestar'] });

    const otra = await cuentas.findById(new UserId(OTRA));

    expect(otra?.modulosActivos).toEqual([]);
  });

  it('si la regla falla no se guarda nada', async () => {
    await casoDeUso.execute(new UserId(PERSONA), { modulosActivos: ['bienestar'] });

    await expect(
      casoDeUso.execute(new UserId(PERSONA), { modulosActivos: [], mascota: LUMA }),
    ).rejects.toThrow(NoActiveModulesError);

    const guardada = await cuentas.findById(new UserId(PERSONA));

    expect(guardada?.modulosActivos).toEqual(['bienestar']);
    expect(guardada?.mascota).toBeUndefined();
  });

  it('sin cuenta no hay nada que cambiar', async () => {
    await expect(
      casoDeUso.execute(new UserId('33333333-3333-4333-a333-333333333333'), {
        modulosActivos: ['bienestar'],
      }),
    ).rejects.toThrow(AccountNotProvisionedError);
  });
});
