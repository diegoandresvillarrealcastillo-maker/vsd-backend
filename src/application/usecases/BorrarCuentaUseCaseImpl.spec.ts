import { beforeEach, describe, expect, it } from 'vitest';
import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import { AlmacenDoble } from '../../pruebas/almacenDePrueba.js';
import { RepositorioConBajas } from '../../pruebas/cuentasConBajaDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { PNG_REAL_DE_8_X_6 } from '../../pruebas/fotosDePrueba.js';
import { BajaDeCuenta } from '../services/BajaDeCuenta.js';
import { BorrarCuentaUseCaseImpl } from './BorrarCuentaUseCaseImpl.js';

/**
 * Borrar la cuenta sin dejar constancia: es lo que se hace con el rechazo de un menor (ADR 0026).
 *
 * El orden de los pasos y qué pasa si uno falla (SCRUM-267, ADR 0040) lo prueba `BajaDeCuenta`.
 * Aquí se vigila lo propio de este borrado: que no deja constancia de nada, y que los archivos son
 * solo los de esa persona.
 */
const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';

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
  const FOTO = { contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' };
  let cuentas: RepositorioConBajas;
  let proveedor: ProveedorDoble;
  let fotos: AlmacenDoble;
  let casoDeUso: BorrarCuentaUseCaseImpl;

  beforeEach(async () => {
    cuentas = new RepositorioConBajas();
    proveedor = new ProveedorDoble();
    fotos = new AlmacenDoble();
    casoDeUso = new BorrarCuentaUseCaseImpl(new BajaDeCuenta(cuentas, proveedor, [fotos]));

    await cuentas.save(unaCuenta({ idProveedorAuth: 'supabase|aaaa-1111' }));
    await fotos.guardar(new UserId(PERSONA), FOTO);
    await fotos.guardar(new UserId(OTRA), FOTO);
  });

  it('borra la cuenta y la identidad en el proveedor', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    await expect(cuentas.findById(new UserId(PERSONA))).resolves.toBeNull();
    expect(proveedor.borradas).toEqual(['supabase|aaaa-1111']);
  });

  it('no deja constancia: la identidad no queda marcada como dada de baja', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    expect(cuentas.dadasDeBaja.size).toBe(0);
    await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(false);
  });

  it('borra la foto junto con la cuenta, y solo la de esa persona', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    expect(await fotos.leer(new UserId(PERSONA))).toBeUndefined();
    expect(await fotos.leer(new UserId(OTRA))).toEqual(FOTO);
  });

  it('si el proveedor falla, la cuenta sigue entera y la baja queda pedida sin constancia', async () => {
    proveedor.falla = true;

    await expect(casoDeUso.execute(new UserId(PERSONA))).rejects.toThrow(
      AccountDeletionFailedError,
    );

    await expect(cuentas.findById(new UserId(PERSONA))).resolves.not.toBeNull();
    expect(cuentas.pendientes.map((baja) => baja.conConstancia)).toEqual([false]);
  });

  it('una cuenta que ya no existe no toca el proveedor ni los almacenes', async () => {
    await casoDeUso.execute(new UserId('33333333-3333-4333-a333-333333333333'));

    expect(proveedor.borradas).toEqual([]);
    expect(fotos.cantidad).toBe(2);
  });
});
