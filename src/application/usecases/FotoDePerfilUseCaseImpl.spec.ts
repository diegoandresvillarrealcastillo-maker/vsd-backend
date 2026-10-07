import { beforeEach, describe, expect, it } from 'vitest';
import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
  InvalidPhotoError,
  PhotoNotFoundError,
} from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import { AlmacenDoble } from '../../pruebas/almacenDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { RepositorioDeCuentasDoble } from '../../pruebas/cuentasDePrueba.js';
import {
  JPEG_REAL_DE_8_X_6,
  PNG_REAL_DE_8_X_6,
  unJpeg,
  unPng,
} from '../../pruebas/fotosDePrueba.js';
import { FotoDePerfilUseCaseImpl } from './FotoDePerfilUseCaseImpl.js';

const ANA = '11111111-1111-4111-8111-111111111111';
const BETO = '22222222-2222-4222-9222-222222222222';
const AHORA = new Date('2026-10-09T15:30:00.123Z');

const PNG = { contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' };
const JPEG = { contenido: JPEG_REAL_DE_8_X_6, tipo: 'image/jpeg' };

describe('FotoDePerfilUseCaseImpl (SCRUM-120)', () => {
  let cuentas: RepositorioDeCuentasDoble;
  let almacen: AlmacenDoble;
  let casoDeUso: FotoDePerfilUseCaseImpl;

  const cuentaDe = (persona: string): Promise<User | null> => cuentas.findById(new UserId(persona));

  beforeEach(async () => {
    cuentas = new RepositorioDeCuentasDoble();
    almacen = new AlmacenDoble();
    casoDeUso = new FotoDePerfilUseCaseImpl(cuentas, almacen, () => AHORA);

    await cuentas.save(
      unaCuenta({ id: ANA, correo: 'ana@ejemplo.test', idProveedorAuth: 'p-ana' }),
    );
    await cuentas.save(
      unaCuenta({ id: BETO, correo: 'beto@ejemplo.test', idProveedorAuth: 'p-beto' }),
    );

    cuentas.guardados = 0;
  });

  describe('guardar', () => {
    it('guarda el archivo y deja la marca en la cuenta', async () => {
      const cuenta = await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');

      expect(cuenta.fotoActualizadaEl).toEqual(AHORA);
      expect((await cuentaDe(ANA))?.fotoActualizadaEl).toEqual(AHORA);
      expect(almacen.mirar(new UserId(ANA))).toEqual(PNG);
    });

    it('una foto nueva reemplaza a la anterior, tambien en el tipo', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');
      await casoDeUso.guardar(new UserId(ANA), JPEG_REAL_DE_8_X_6, 'image/jpeg');

      expect(almacen.cantidad).toBe(1);
      expect(almacen.mirar(new UserId(ANA))).toEqual(JPEG);
    });

    it('la marca cambia con cada foto: es lo que dice que la anterior ya no vale', async () => {
      let ahora = AHORA;
      casoDeUso = new FotoDePerfilUseCaseImpl(cuentas, almacen, () => ahora);

      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');
      ahora = new Date(AHORA.getTime() + 60_000);
      const segunda = await casoDeUso.guardar(new UserId(ANA), JPEG_REAL_DE_8_X_6, 'image/jpeg');

      expect(segunda.fotoActualizadaEl).toEqual(ahora);
    });

    it.each([
      ['el tipo', PNG_REAL_DE_8_X_6, 'image/gif', 'FOTO_TIPO_NO_PERMITIDO'],
      ['el peso', unPng(256, 256, 60_000), 'image/png', 'FOTO_DEMASIADO_PESADA'],
      [
        'el contenido',
        new TextEncoder().encode('<svg onload=alert(1)>'),
        'image/png',
        'FOTO_NO_ES_UNA_IMAGEN',
      ],
      ['el tamano en pixeles', unJpeg(5000, 5000), 'image/jpeg', 'FOTO_DEMASIADO_GRANDE'],
    ])(
      'si no vale por %s, no se guarda nada: ni el archivo ni la marca',
      async (_motivo, contenido, tipo, codigo) => {
        const error = await casoDeUso
          .guardar(new UserId(ANA), contenido, tipo)
          .catch((e: unknown) => e);

        expect(error).toBeInstanceOf(InvalidPhotoError);
        expect((error as InvalidPhotoError).code).toBe(codigo);
        expect(almacen.llamadas).toEqual([]);
        expect(almacen.cantidad).toBe(0);
        expect(cuentas.guardados).toBe(0);
        expect((await cuentaDe(ANA))?.fotoActualizadaEl).toBeUndefined();
      },
    );

    it('una foto que no vale no pisa la que ya habia', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');

      await expect(
        casoDeUso.guardar(new UserId(ANA), new Uint8Array(0), 'image/png'),
      ).rejects.toThrow(InvalidPhotoError);

      expect(almacen.mirar(new UserId(ANA))).toEqual(PNG);
      expect((await cuentaDe(ANA))?.fotoActualizadaEl).toEqual(AHORA);
    });

    it('sin cuenta no hay donde guardarla, y no se toca el almacen', async () => {
      await expect(
        casoDeUso.guardar(
          new UserId('33333333-3333-4333-a333-333333333333'),
          PNG_REAL_DE_8_X_6,
          'image/png',
        ),
      ).rejects.toThrow(AccountNotProvisionedError);

      expect(almacen.llamadas).toEqual([]);
    });

    it('si el almacenamiento falla, se dice con un error claro y no queda marca', async () => {
      almacen.falla = true;

      const error = await casoDeUso
        .guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png')
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(FileStorageUnavailableError);
      expect(cuentas.guardados).toBe(0);
      expect((await cuentaDe(ANA))?.fotoActualizadaEl).toBeUndefined();
    });

    it('el error guarda la causa para el registro, y su mensaje no sale en la respuesta', async () => {
      almacen.falla = true;

      const error = (await casoDeUso
        .guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png')
        .catch((e: unknown) => e)) as Error;

      expect(error.cause).toBeInstanceOf(Error);
      expect(error.message).not.toContain('Supabase');
      expect(error.message).not.toContain('500');
    });

    it('guarda el archivo antes que la marca', async () => {
      // Si algo falla entre una cosa y otra, queda un archivo sin marca (que
      // nadie ve y la siguiente foto reemplaza) y no una marca que promete una
      // foto que no esta.
      const orden: string[] = [];
      const guardarEnElAlmacen = almacen.guardar.bind(almacen);
      const guardarLaCuenta = cuentas.save.bind(cuentas);

      almacen.guardar = (persona, archivo) => {
        orden.push('archivo');

        return guardarEnElAlmacen(persona, archivo);
      };
      cuentas.save = (cuenta) => {
        orden.push('marca');

        return guardarLaCuenta(cuenta);
      };

      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');

      expect(orden).toEqual(['archivo', 'marca']);
    });
  });

  describe('leer', () => {
    it('devuelve la foto, con su tipo y la fecha de la marca', async () => {
      await casoDeUso.guardar(new UserId(ANA), JPEG_REAL_DE_8_X_6, 'image/jpeg');

      expect(await casoDeUso.leer(new UserId(ANA))).toEqual({
        contenido: JPEG_REAL_DE_8_X_6,
        tipo: 'image/jpeg',
        actualizadaEl: AHORA,
      });
    });

    it('sin foto falla con FOTO_NO_ENCONTRADA, y ni pregunta al almacenamiento', async () => {
      const error = await casoDeUso.leer(new UserId(ANA)).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(PhotoNotFoundError);
      expect((error as PhotoNotFoundError).code).toBe('FOTO_NO_ENCONTRADA');
      expect(almacen.llamadas).toEqual([]);
    });

    it('con la marca pero sin el archivo, tambien es que no hay foto', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');
      await almacen.borrar(new UserId(ANA));

      await expect(casoDeUso.leer(new UserId(ANA))).rejects.toThrow(PhotoNotFoundError);
    });

    it('si el almacenamiento falla, no se confunde con que no hay foto', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');
      almacen.falla = true;

      await expect(casoDeUso.leer(new UserId(ANA))).rejects.toThrow(FileStorageUnavailableError);
    });

    it('sin cuenta falla como cualquier otra ruta de la cuenta', async () => {
      await expect(
        casoDeUso.leer(new UserId('33333333-3333-4333-a333-333333333333')),
      ).rejects.toThrow(AccountNotProvisionedError);
    });
  });

  describe('quitar', () => {
    it('borra el archivo y la marca', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');

      const cuenta = await casoDeUso.quitar(new UserId(ANA));

      expect(cuenta.fotoActualizadaEl).toBeUndefined();
      expect((await cuentaDe(ANA))?.fotoActualizadaEl).toBeUndefined();
      expect(almacen.cantidad).toBe(0);
    });

    it('quitar la que no hay no es un error, y no guarda la cuenta de nuevo', async () => {
      await expect(casoDeUso.quitar(new UserId(ANA))).resolves.toBeDefined();

      expect(cuentas.guardados).toBe(0);
    });

    it('borra el archivo aunque no haya marca: limpia lo que quedo de un intento a medias', async () => {
      almacen.sembrar(new UserId(ANA), PNG);

      await casoDeUso.quitar(new UserId(ANA));

      expect(almacen.cantidad).toBe(0);
    });

    it('si el almacenamiento falla, la marca se queda: no se anuncia un borrado que no ocurrio', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');
      almacen.falla = true;

      await expect(casoDeUso.quitar(new UserId(ANA))).rejects.toThrow(FileStorageUnavailableError);

      expect((await cuentaDe(ANA))?.fotoActualizadaEl).toEqual(AHORA);
    });
  });

  describe('cada persona solo ve y toca la suya', () => {
    it('la foto de una no sale cuando la otra la pide', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');

      await expect(casoDeUso.leer(new UserId(BETO))).rejects.toThrow(PhotoNotFoundError);
      expect((await casoDeUso.leer(new UserId(ANA))).contenido).toEqual(PNG_REAL_DE_8_X_6);
    });

    it('cada una guarda la suya sin pisar la de la otra', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');
      await casoDeUso.guardar(new UserId(BETO), JPEG_REAL_DE_8_X_6, 'image/jpeg');

      expect((await casoDeUso.leer(new UserId(ANA))).tipo).toBe('image/png');
      expect((await casoDeUso.leer(new UserId(BETO))).tipo).toBe('image/jpeg');
    });

    it('quitar la propia no quita la ajena', async () => {
      await casoDeUso.guardar(new UserId(ANA), PNG_REAL_DE_8_X_6, 'image/png');
      await casoDeUso.guardar(new UserId(BETO), JPEG_REAL_DE_8_X_6, 'image/jpeg');

      await casoDeUso.quitar(new UserId(BETO));

      expect((await casoDeUso.leer(new UserId(ANA))).contenido).toEqual(PNG_REAL_DE_8_X_6);
      await expect(casoDeUso.leer(new UserId(BETO))).rejects.toThrow(PhotoNotFoundError);
    });
  });
});
