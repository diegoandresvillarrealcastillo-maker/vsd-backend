import { beforeEach, describe, expect, it } from 'vitest';
import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import { AlmacenDoble } from '../../pruebas/almacenDePrueba.js';
import { RepositorioConBajas } from '../../pruebas/cuentasConBajaDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { PNG_REAL_DE_8_X_6 } from '../../pruebas/fotosDePrueba.js';
import { BajaDeCuenta } from '../services/BajaDeCuenta.js';
import { InactivarCuentaUseCaseImpl } from './InactivarCuentaUseCaseImpl.js';

/**
 * Dar de baja la cuenta propia (SCRUM-190, ADR 0026): se borra todo lo vivo y queda una constancia
 * mínima, sin nombre ni correo, de lo que la persona aceptó y de que la cuenta existió.
 *
 * El orden de los pasos y qué pasa si uno falla (SCRUM-267, ADR 0040) lo prueba `BajaDeCuenta`.
 * Aquí se vigila lo propio de esta baja: que lleva constancia, que una cuenta dada de baja no se
 * pueda resucitar con un token que todavía no caducó, y que los archivos son solo los de esa persona.
 */
const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const AHORA = new Date('2026-10-14T15:00:00.000Z');

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
  const FOTO = { contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' };
  let cuentas: RepositorioConBajas;
  let proveedor: ProveedorDoble;
  let fotos: AlmacenDoble;
  let casoDeUso: InactivarCuentaUseCaseImpl;

  beforeEach(async () => {
    cuentas = new RepositorioConBajas();
    proveedor = new ProveedorDoble();
    fotos = new AlmacenDoble();
    casoDeUso = new InactivarCuentaUseCaseImpl(
      new BajaDeCuenta(cuentas, proveedor, [fotos], () => AHORA),
    );

    await cuentas.save(unaCuenta({ idProveedorAuth: 'supabase|aaaa-1111', nombre: 'Ana' }));
    await fotos.guardar(new UserId(PERSONA), FOTO);
    await fotos.guardar(new UserId(OTRA), FOTO);
  });

  it('la cuenta deja de existir y su identidad se borra en el proveedor', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    await expect(cuentas.findById(new UserId(PERSONA))).resolves.toBeNull();
    expect(proveedor.borradas).toEqual(['supabase|aaaa-1111']);
  });

  it('queda dada de baja para su identificador, para que su token no la resucite', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(true);
    // Con la hora del reloj de la baja, no con la del equipo que corre la prueba.
    expect(cuentas.dadasDeBaja.get('supabase|aaaa-1111')).toEqual(AHORA);
  });

  it('borra la foto junto con la cuenta, y solo la de esa persona', async () => {
    await casoDeUso.execute(new UserId(PERSONA));

    expect(await fotos.leer(new UserId(PERSONA))).toBeUndefined();
    expect(await fotos.leer(new UserId(OTRA))).toEqual(FOTO);
  });

  it('si el proveedor falla, la cuenta sigue entera y la baja queda pedida', async () => {
    proveedor.falla = true;

    await expect(casoDeUso.execute(new UserId(PERSONA))).rejects.toThrow(
      AccountDeletionFailedError,
    );

    await expect(cuentas.findById(new UserId(PERSONA))).resolves.not.toBeNull();
    await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(false);
    // Es lo que hace que la baja se termine sola.
    expect(cuentas.pendientes.map((baja) => baja.conConstancia)).toEqual([true]);
  });

  it('una cuenta que no existe no es un error y no toca al proveedor ni a los almacenes', async () => {
    await expect(
      casoDeUso.execute(new UserId('33333333-3333-4333-a333-333333333333')),
    ).resolves.toBeUndefined();

    expect(proveedor.borradas).toEqual([]);
    expect(fotos.cantidad).toBe(2);
    await expect(cuentas.estaInactivadaPorProveedor('supabase|aaaa-1111')).resolves.toBe(false);
  });
});
