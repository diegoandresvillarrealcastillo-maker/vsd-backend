import { beforeEach, describe, expect, it } from 'vitest';
import { AccountDeletionFailedError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import { RepositorioConBajas } from '../../pruebas/cuentasConBajaDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { BajaDeCuenta } from './BajaDeCuenta.js';

/**
 * La baja de la cuenta en tres pasos (SCRUM-267, ADR 0040): una marca, lo de fuera de la base y
 * las filas. Lo que se vigila es lo que el ADR promete: que ninguna transaccion espera a la red
 * (lo de fuera va entre dos pasos de la base, no dentro de uno), que **toda baja que dejo su marca
 * termina** aunque falle cualquiera de los pasos siguientes, y que repetirla es seguro.
 */
const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');
const OTRA = new UserId('22222222-2222-4222-9222-222222222222');
const AHORA = new Date('2026-10-25T15:00:00.000Z');
const IDENTIDAD = 'supabase|aaaa-1111';

/** El almacen de archivos: anota que se pidio y puede fallar a voluntad. */
class AlmacenQueFalla implements AlmacenPersonalPort {
  falla = false;
  borrados = 0;

  constructor(private readonly orden: string[]) {}

  guardar(): Promise<void> {
    return Promise.resolve();
  }

  leer(): Promise<undefined> {
    return Promise.resolve(undefined);
  }

  borrar(): Promise<void> {
    if (this.falla) {
      return Promise.reject(new Error('Storage no respondio'));
    }

    this.borrados += 1;
    this.orden.push('archivos');

    return Promise.resolve();
  }
}

/** El proveedor de identidad: anota a quien borra, y borrar dos veces la misma no es un error. */
class ProveedorQueFalla implements ProveedorDeIdentidadPort {
  falla = false;
  llamadas = 0;

  constructor(private readonly orden: string[]) {}

  borrarIdentidad(): Promise<void> {
    this.llamadas += 1;

    if (this.falla) {
      return Promise.reject(new Error('Supabase no respondio'));
    }

    this.orden.push('identidad');

    return Promise.resolve();
  }
}

describe('BajaDeCuenta (SCRUM-267, ADR 0040)', () => {
  let orden: string[];
  let cuentas: RepositorioConBajas;
  let almacen: AlmacenQueFalla;
  let proveedor: ProveedorQueFalla;
  let baja: BajaDeCuenta;

  beforeEach(async () => {
    orden = [];
    cuentas = new RepositorioConBajas(orden);
    almacen = new AlmacenQueFalla(orden);
    proveedor = new ProveedorQueFalla(orden);
    baja = new BajaDeCuenta(cuentas, proveedor, [almacen], () => AHORA);

    await cuentas.save(unaCuenta({ idProveedorAuth: IDENTIDAD }));
  });

  describe('cuando todo sale bien', () => {
    it('deja la marca antes de tocar nada de fuera y las filas al final', async () => {
      await baja.pedir(PERSONA, true);

      // Lo de fuera va entre dos pasos de la base, nunca dentro de uno: ninguna transaccion
      // espera a la red.
      expect(orden).toEqual(['marca', 'archivos', 'identidad', 'filas']);
    });

    it('con constancia: la cuenta deja de existir y queda dada de baja con la hora del reloj', async () => {
      await baja.pedir(PERSONA, true);

      await expect(cuentas.findById(PERSONA)).resolves.toBeNull();
      expect(cuentas.dadasDeBaja.get(IDENTIDAD)).toEqual(AHORA);
      expect(cuentas.pendientes).toEqual([]);
    });

    it('sin constancia: la cuenta deja de existir y no queda rastro de que se dio de baja', async () => {
      await baja.pedir(PERSONA, false);

      await expect(cuentas.findById(PERSONA)).resolves.toBeNull();
      expect(cuentas.dadasDeBaja.size).toBe(0);
      expect(cuentas.pendientes).toEqual([]);
    });

    it('la marca lleva si hay constancia y cuando se pidio', async () => {
      almacen.falla = true;

      await baja.pedir(PERSONA, false).catch(() => undefined);

      expect(cuentas.pendientes).toEqual([{ id: PERSONA, conConstancia: false, pedidaEl: AHORA }]);
    });
  });

  describe('si falla antes de la marca', () => {
    beforeEach(() => {
      cuentas.fallaAlMarcar = true;
    });

    it('no se toca nada: ni los archivos, ni la identidad, ni las filas', async () => {
      await expect(baja.pedir(PERSONA, true)).rejects.toThrow(AccountDeletionFailedError);

      expect(almacen.borrados).toBe(0);
      expect(proveedor.llamadas).toBe(0);
      await expect(cuentas.findById(PERSONA)).resolves.not.toBeNull();
    });

    it('el error dice la verdad: no se borro nada y se puede intentar de nuevo', async () => {
      const error = await baja.pedir(PERSONA, true).catch((e: unknown) => e);

      expect((error as Error).message).toContain('no se borró nada');
      expect((error as Error).cause).toBeInstanceOf(Error);
    });
  });

  describe('si falla despues de la marca, la marca se queda y la baja se puede terminar', () => {
    it('en los archivos: la cuenta y la identidad siguen enteras', async () => {
      almacen.falla = true;

      await expect(baja.pedir(PERSONA, true)).rejects.toThrow(AccountDeletionFailedError);

      expect(cuentas.pendientes).toHaveLength(1);
      expect(proveedor.llamadas).toBe(0);
      await expect(cuentas.findById(PERSONA)).resolves.not.toBeNull();

      almacen.falla = false;
      await baja.terminar(PERSONA, true);

      await expect(cuentas.findById(PERSONA)).resolves.toBeNull();
      expect(cuentas.pendientes).toEqual([]);
      expect(cuentas.dadasDeBaja.has(IDENTIDAD)).toBe(true);
    });

    it('en la identidad: los archivos ya no estan y la cuenta sigue entera', async () => {
      proveedor.falla = true;

      await expect(baja.pedir(PERSONA, true)).rejects.toThrow(AccountDeletionFailedError);

      expect(almacen.borrados).toBe(1);
      expect(cuentas.pendientes).toHaveLength(1);
      await expect(cuentas.findById(PERSONA)).resolves.not.toBeNull();

      proveedor.falla = false;
      await baja.terminar(PERSONA, true);

      await expect(cuentas.findById(PERSONA)).resolves.toBeNull();
      expect(cuentas.pendientes).toEqual([]);
    });

    it('al borrar las filas: la identidad ya no esta, pero la marca sigue y la baja termina', async () => {
      // El hueco que cierra el ADR 0040: antes, aqui la persona ya no podia entrar y sus filas
      // quedaban sin dueno, para limpiarlas a mano.
      cuentas.fallaAlBorrarFilas = true;

      await expect(baja.pedir(PERSONA, true)).rejects.toThrow(AccountDeletionFailedError);

      expect(proveedor.llamadas).toBe(1);
      expect(cuentas.pendientes).toHaveLength(1);
      await expect(cuentas.findById(PERSONA)).resolves.not.toBeNull();
      expect(cuentas.dadasDeBaja.size).toBe(0);

      cuentas.fallaAlBorrarFilas = false;
      await baja.terminar(PERSONA, true);

      // Repetir lo de fuera es seguro: la identidad se pide borrar otra vez.
      expect(proveedor.llamadas).toBe(2);
      await expect(cuentas.findById(PERSONA)).resolves.toBeNull();
      expect(cuentas.pendientes).toEqual([]);
      expect(cuentas.dadasDeBaja.get(IDENTIDAD)).toEqual(AHORA);
    });

    it('sin constancia, el fallo al borrar las filas tambien se termina', async () => {
      cuentas.fallaAlBorrarFilas = true;

      await expect(baja.pedir(PERSONA, false)).rejects.toThrow(AccountDeletionFailedError);

      cuentas.fallaAlBorrarFilas = false;
      await baja.terminar(PERSONA, false);

      await expect(cuentas.findById(PERSONA)).resolves.toBeNull();
      expect(cuentas.dadasDeBaja.size).toBe(0);
    });

    it('el error dice la verdad: la baja quedo pedida y se termina sola', async () => {
      proveedor.falla = true;

      const error = await baja.pedir(PERSONA, true).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(AccountDeletionFailedError);
      expect((error as Error).message).toContain('se termina sola');
      expect((error as Error).message).not.toContain('no se borró nada');
      expect((error as Error).message).not.toContain('Supabase');
      // La causa queda para el registro del servidor.
      expect((error as Error).cause).toBeInstanceOf(Error);
    });

    it('pedirla otra vez sigue el mismo camino y la termina', async () => {
      proveedor.falla = true;
      await baja.pedir(PERSONA, true).catch(() => undefined);

      proveedor.falla = false;
      await expect(baja.pedir(PERSONA, true)).resolves.toBeUndefined();

      await expect(cuentas.findById(PERSONA)).resolves.toBeNull();
      expect(cuentas.pendientes).toEqual([]);
    });

    it('pedirla otra vez no cambia la primera marca', async () => {
      proveedor.falla = true;
      await baja.pedir(PERSONA, false).catch(() => undefined);
      await new BajaDeCuenta(cuentas, proveedor, [almacen], () => new Date('2026-10-26T00:00:00Z'))
        .pedir(PERSONA, true)
        .catch(() => undefined);

      expect(cuentas.pendientes).toEqual([{ id: PERSONA, conConstancia: false, pedidaEl: AHORA }]);
    });
  });

  describe('una cuenta que ya no existe', () => {
    it('pedir la baja no es un error y no toca lo de fuera', async () => {
      await expect(baja.pedir(OTRA, true)).resolves.toBeUndefined();

      expect(orden).toEqual([]);
      expect(almacen.borrados).toBe(0);
      expect(proveedor.llamadas).toBe(0);
    });

    it('terminar una baja cuya cuenta ya no esta no hace nada', async () => {
      await expect(baja.terminar(OTRA, true)).resolves.toBeUndefined();

      expect(orden).toEqual([]);
    });
  });
});
