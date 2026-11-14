import { beforeEach, describe, expect, it } from 'vitest';
import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
} from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { RepositorioDeCuentasDoble } from '../../pruebas/cuentasDePrueba.js';
import { conAlmacen, cuentaDe, guardarLaMarca } from './ArchivoPersonalDeLaCuenta.js';

const ANA = '11111111-1111-4111-8111-111111111111';
const BETO = '22222222-2222-4222-9222-222222222222';
const AHORA = new Date('2026-10-09T15:30:00.123Z');

/**
 * Lo que comparten la foto de perfil y la mascota propia. Cada caso de uso prueba su flujo; aqui
 * se prueba cada pieza sola, con lo que dice cuando algo falla.
 */
describe('ArchivoPersonalDeLaCuenta', () => {
  let cuentas: RepositorioDeCuentasDoble;

  beforeEach(async () => {
    cuentas = new RepositorioDeCuentasDoble();

    await cuentas.save(
      unaCuenta({ id: ANA, correo: 'ana@ejemplo.test', idProveedorAuth: 'p-ana' }),
    );
  });

  describe('cuentaDe', () => {
    it('devuelve la cuenta de la persona', async () => {
      const cuenta = await cuentaDe(cuentas, new UserId(ANA));

      expect(cuenta.id.value).toBe(ANA);
      expect(cuenta.correo).toBe('ana@ejemplo.test');
    });

    it('si todavia no tiene cuenta, lo dice', async () => {
      await expect(cuentaDe(cuentas, new UserId(BETO))).rejects.toBeInstanceOf(
        AccountNotProvisionedError,
      );
    });
  });

  describe('conAlmacen', () => {
    it('devuelve lo que devuelve el almacenamiento', async () => {
      await expect(conAlmacen(() => Promise.resolve('listo'))).resolves.toBe('listo');
    });

    it('si falla, lo cuenta como almacenamiento no disponible y guarda la causa', async () => {
      const fallo = new Error('timeout con el proveedor');

      const error: unknown = await conAlmacen(() => Promise.reject(fallo)).catch(
        (capturado: unknown) => capturado,
      );

      expect(error).toBeInstanceOf(FileStorageUnavailableError);
      expect((error as FileStorageUnavailableError).cause).toBe(fallo);
      // El detalle tecnico no sale en el mensaje que ve la persona.
      expect((error as FileStorageUnavailableError).message).not.toContain('proveedor');
    });
  });

  describe('guardarLaMarca', () => {
    it('guarda la cuenta con su marca nueva y devuelve como quedo', async () => {
      const cuenta = await cuentaDe(cuentas, new UserId(ANA));

      const quedo = await guardarLaMarca(cuentas, cuenta, cuenta.conFoto(AHORA));

      expect(quedo.fotoActualizadaEl).toEqual(AHORA);
      expect((await cuentaDe(cuentas, new UserId(ANA))).fotoActualizadaEl).toEqual(AHORA);
    });

    it('si la cuenta ya no esta, dice que no tiene y no guarda nada', async () => {
      const cuenta = await cuentaDe(cuentas, new UserId(ANA));

      await cuentas.borrarConTodo(new UserId(ANA));
      cuentas.guardados = 0;

      await expect(guardarLaMarca(cuentas, cuenta, cuenta.conFoto(AHORA))).rejects.toBeInstanceOf(
        AccountNotProvisionedError,
      );
      expect(cuentas.guardados).toBe(0);
    });
  });
});
