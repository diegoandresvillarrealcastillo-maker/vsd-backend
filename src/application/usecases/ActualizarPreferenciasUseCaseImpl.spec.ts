import { beforeEach, describe, expect, it } from 'vitest';
import {
  AccountNotProvisionedError,
  NoActiveModulesError,
} from '../../domain/model/DomainError.js';
import type { BajaPendiente } from '../../domain/model/BajaPendiente.js';
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

  guardarCambios(antes: User, despues: User): Promise<User | null> {
    const actual = this.porId.get(despues.id.value);

    if (actual === undefined) {
      return Promise.resolve(null);
    }

    const quedo = actual.conLosCamposDe(despues, despues.camposCambiadosDesde(antes));

    this.porId.set(quedo.id.value, quedo);

    return Promise.resolve(quedo);
  }

  consentimientosDe(): Promise<[]> {
    return Promise.resolve([]);
  }

  borrarConTodo(id: UserId): Promise<void> {
    this.porId.delete(id.value);

    return Promise.resolve();
  }

  inactivarConTodo(id: UserId): Promise<void> {
    this.porId.delete(id.value);

    return Promise.resolve();
  }

  marcarBaja(id: UserId): Promise<boolean> {
    return Promise.resolve(this.porId.has(id.value));
  }

  bajasPendientes(): Promise<readonly BajaPendiente[]> {
    return Promise.resolve([]);
  }

  estaInactivadaPorProveedor(): Promise<boolean> {
    return Promise.resolve(false);
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

describe('ActualizarPreferenciasUseCaseImpl: lo que otra peticion cambio entretanto (SCRUM-258)', () => {
  it('guardar el nombre no enciende los permisos que otra peticion acababa de apagar', async () => {
    const cuentas = new RepositorioDoble();
    const casoDeUso = new ActualizarPreferenciasUseCaseImpl(cuentas);
    const persona = new UserId(PERSONA);

    await cuentas.save(
      unaCuenta().conPreferencias({ diarioConRecomendaciones: true, acompanamientoPorDias: true }),
    );

    // Justo despues de que este caso de uso lee la cuenta, otra peticion apaga los permisos.
    const leer = cuentas.findById.bind(cuentas);

    cuentas.findById = async (id) => {
      const leida = await leer(id);

      if (leida !== null) {
        await cuentas.guardarCambios(
          leida,
          leida.conPreferencias({ diarioConRecomendaciones: false, acompanamientoPorDias: false }),
        );
      }

      return leida;
    };

    const respuesta = await casoDeUso.execute(persona, { nombre: 'Ana' });
    const guardada = await leer(persona);

    expect(respuesta.nombre).toBe('Ana');
    expect(respuesta.diarioConRecomendaciones).toBe(false);
    expect(respuesta.acompanamientoPorDias).toBe(false);
    expect(guardada?.nombre).toBe('Ana');
    expect(guardada?.diarioConRecomendaciones).toBe(false);
    expect(guardada?.acompanamientoPorDias).toBe(false);
  });

  it('si la cuenta se borra entre leerla y guardarla, no se vuelve a crear', async () => {
    const cuentas = new RepositorioDoble();
    const casoDeUso = new ActualizarPreferenciasUseCaseImpl(cuentas);

    await cuentas.save(unaCuenta());

    const leer = cuentas.findById.bind(cuentas);

    cuentas.findById = async (id) => {
      const leida = await leer(id);

      await cuentas.borrarConTodo(id);

      return leida;
    };

    await expect(casoDeUso.execute(new UserId(PERSONA), { nombre: 'Ana' })).rejects.toThrow(
      AccountNotProvisionedError,
    );
    expect(await leer(new UserId(PERSONA))).toBeNull();
  });
});
