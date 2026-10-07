import { beforeEach, describe, expect, it } from 'vitest';
import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
  InvalidPetSvgError,
  OwnPetNotFoundError,
} from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import { AlmacenDoble } from '../../pruebas/almacenDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { RepositorioDeCuentasDoble } from '../../pruebas/cuentasDePrueba.js';
import { MascotaPropiaUseCaseImpl } from './MascotaPropiaUseCaseImpl.js';

const ANA = '11111111-1111-4111-8111-111111111111';
const BETO = '22222222-2222-4222-9222-222222222222';
const AHORA = new Date('2026-10-12T09:00:00.456Z');
const SVG_TIPO = 'image/svg+xml';

const bytes = (texto: string): Uint8Array => new TextEncoder().encode(texto);
const texto = (contenido: Uint8Array | undefined): string | undefined =>
  contenido === undefined ? undefined : new TextDecoder().decode(contenido);

const CABECERA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
const svg = (interior: string): string => `${CABECERA}${interior}</svg>`;

/** Un dibujo valido y sencillo. */
const DIBUJO = svg('<circle cx="50" cy="50" r="40" fill="#ff0000"/>');
const DIBUJO_LIMPIO =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"><circle fill="#ff0000" cx="50" cy="50" r="40"/></svg>';

/** Uno que trae de todo lo que se descarta: lo que subio no es lo que debe quedar. */
const DIBUJO_CON_RESTOS = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!-- hecho con un editor -->',
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 100 100" width="9999" height="9999" inkscape:version="1.2">`,
  '<metadata>datos del editor</metadata>',
  '<title>Mi mascota</title>',
  '<circle cx="50" cy="50" r="40" style="fill:#ff0000;cursor:pointer" class="cara" inkscape:label="cara"/>',
  '</svg>',
].join('\n');

describe('MascotaPropiaUseCaseImpl (SCRUM-122)', () => {
  let cuentas: RepositorioDeCuentasDoble;
  let almacen: AlmacenDoble;
  let casoDeUso: MascotaPropiaUseCaseImpl;

  const cuentaDe = (persona: string): Promise<User | null> => cuentas.findById(new UserId(persona));

  beforeEach(async () => {
    cuentas = new RepositorioDeCuentasDoble();
    almacen = new AlmacenDoble();
    casoDeUso = new MascotaPropiaUseCaseImpl(cuentas, almacen, () => AHORA);

    await cuentas.save(
      unaCuenta({ id: ANA, correo: 'ana@ejemplo.test', idProveedorAuth: 'p-ana' }),
    );
    await cuentas.save(
      unaCuenta({ id: BETO, correo: 'beto@ejemplo.test', idProveedorAuth: 'p-beto' }),
    );

    cuentas.guardados = 0;
  });

  describe('guardar', () => {
    it('guarda el SVG y deja la marca en la cuenta', async () => {
      const cuenta = await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      expect(cuenta.mascotaPropiaActualizadaEl).toEqual(AHORA);
      expect((await cuentaDe(ANA))?.mascotaPropiaActualizadaEl).toEqual(AHORA);
      expect(almacen.mirar(new UserId(ANA))?.tipo).toBe(SVG_TIPO);
    });

    it('lo que se guarda es el SVG saneado, no el que subio la persona', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO_CON_RESTOS), SVG_TIPO);

      const guardado = texto(almacen.mirar(new UserId(ANA))?.contenido) ?? '';

      expect(guardado).not.toBe(DIBUJO_CON_RESTOS);

      for (const resto of [
        '<?xml',
        '<!--',
        'metadata',
        'title',
        'inkscape',
        'class',
        'style',
        '9999',
      ]) {
        expect(guardado).not.toContain(resto);
      }

      // El estilo en linea paso a atributos; lo demas, descartado.
      expect(guardado).toContain('<circle fill="#ff0000" cx="50" cy="50" r="40"/>');
    });

    it('lo guardado es exactamente el dibujo reescrito', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      expect(texto(almacen.mirar(new UserId(ANA))?.contenido)).toBe(DIBUJO_LIMPIO);
    });

    it('una mascota nueva reemplaza a la anterior, y la marca cambia', async () => {
      let ahora = AHORA;
      casoDeUso = new MascotaPropiaUseCaseImpl(cuentas, almacen, () => ahora);

      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);
      ahora = new Date(AHORA.getTime() + 60_000);
      const segunda = await casoDeUso.guardar(
        new UserId(ANA),
        bytes(svg('<rect width="9" height="9"/>')),
        SVG_TIPO,
      );

      expect(almacen.cantidad).toBe(1);
      expect(segunda.mascotaPropiaActualizadaEl).toEqual(ahora);
      expect(texto(almacen.mirar(new UserId(ANA))?.contenido)).toContain('<rect');
    });

    it('no la elige como mascota: eso se hace con las preferencias', async () => {
      const cuenta = await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      expect(cuenta.mascota).toBeUndefined();
    });

    it.each([
      ['el tipo', bytes(DIBUJO), 'image/png', 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
      ['el contenido', bytes('esto no es un svg'), SVG_TIPO, 'MASCOTA_SVG_NO_ES_UN_SVG'],
      ['un script', bytes(svg('<script>alert(1)</script>')), SVG_TIPO, 'MASCOTA_SVG_PELIGROSO'],
      [
        'un manejador de eventos',
        bytes(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" onload="alert(1)"/>`),
        SVG_TIPO,
        'MASCOTA_SVG_PELIGROSO',
      ],
      [
        'un enlace a otro sitio',
        bytes(svg('<use href="https://ejemplo.invalid/x.svg#a"/>')),
        SVG_TIPO,
        'MASCOTA_SVG_PELIGROSO',
      ],
      ['un texto', bytes(svg('<text>hola</text>')), SVG_TIPO, 'MASCOTA_SVG_NO_ADMITIDO'],
      ['el peso', new Uint8Array(200_000), SVG_TIPO, 'MASCOTA_SVG_DEMASIADO_PESADO'],
    ])(
      'si no vale por %s, no se guarda nada: ni el archivo ni la marca',
      async (_motivo, contenido, tipo, codigo) => {
        const error = await casoDeUso
          .guardar(new UserId(ANA), contenido, tipo)
          .catch((e: unknown) => e);

        expect(error).toBeInstanceOf(InvalidPetSvgError);
        expect((error as InvalidPetSvgError).code).toBe(codigo);
        expect(almacen.llamadas).toEqual([]);
        expect(almacen.cantidad).toBe(0);
        expect(cuentas.guardados).toBe(0);
        expect((await cuentaDe(ANA))?.mascotaPropiaActualizadaEl).toBeUndefined();
      },
    );

    it('un SVG que no vale no pisa el que ya habia', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      await expect(
        casoDeUso.guardar(new UserId(ANA), bytes(svg('<script/>')), SVG_TIPO),
      ).rejects.toThrow(InvalidPetSvgError);

      expect(texto(almacen.mirar(new UserId(ANA))?.contenido)).toBe(DIBUJO_LIMPIO);
      expect((await cuentaDe(ANA))?.mascotaPropiaActualizadaEl).toEqual(AHORA);
    });

    it('sin cuenta no hay donde guardarla, y no se toca el almacen', async () => {
      await expect(
        casoDeUso.guardar(
          new UserId('33333333-3333-4333-a333-333333333333'),
          bytes(DIBUJO),
          SVG_TIPO,
        ),
      ).rejects.toThrow(AccountNotProvisionedError);

      expect(almacen.llamadas).toEqual([]);
    });

    it('si el almacenamiento falla, se dice con un error claro y no queda marca', async () => {
      almacen.falla = true;

      const error = await casoDeUso
        .guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO)
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(FileStorageUnavailableError);
      expect(cuentas.guardados).toBe(0);
      expect((await cuentaDe(ANA))?.mascotaPropiaActualizadaEl).toBeUndefined();
    });

    it('guarda el archivo antes que la marca', async () => {
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

      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      expect(orden).toEqual(['archivo', 'marca']);
    });
  });

  describe('leer', () => {
    it('devuelve el SVG saneado, con su tipo y la fecha de la marca', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO_CON_RESTOS), SVG_TIPO);

      const mascota = await casoDeUso.leer(new UserId(ANA));

      expect(mascota.tipo).toBe(SVG_TIPO);
      expect(mascota.actualizadaEl).toEqual(AHORA);
      expect(texto(mascota.contenido)).not.toContain('inkscape');
    });

    it('sin mascota propia falla con su codigo, y ni pregunta al almacenamiento', async () => {
      const error = await casoDeUso.leer(new UserId(ANA)).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(OwnPetNotFoundError);
      expect((error as OwnPetNotFoundError).code).toBe('MASCOTA_PROPIA_NO_ENCONTRADA');
      expect(almacen.llamadas).toEqual([]);
    });

    it('con la marca pero sin el archivo, tambien es que no hay', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);
      await almacen.borrar(new UserId(ANA));

      await expect(casoDeUso.leer(new UserId(ANA))).rejects.toThrow(OwnPetNotFoundError);
    });

    it('si el almacenamiento falla, no se confunde con que no hay', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);
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
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      const cuenta = await casoDeUso.quitar(new UserId(ANA));

      expect(cuenta.mascotaPropiaActualizadaEl).toBeUndefined();
      expect((await cuentaDe(ANA))?.mascotaPropiaActualizadaEl).toBeUndefined();
      expect(almacen.cantidad).toBe(0);
    });

    it('si era la mascota elegida, vuelve al personaje de siempre con su nombre, y queda guardado', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      const conLaPropia = (await cuentaDe(ANA))?.conPreferencias({
        mascota: { forma: 'propia', nombre: 'Luma' },
      });

      if (conLaPropia !== undefined) {
        await cuentas.save(conLaPropia);
      }

      const cuenta = await casoDeUso.quitar(new UserId(ANA));

      expect(cuenta.mascota).toEqual({ forma: 'fungito', nombre: 'Luma' });
      expect((await cuentaDe(ANA))?.mascota).toEqual({ forma: 'fungito', nombre: 'Luma' });
    });

    it('quitar la que no hay no es un error, y no guarda la cuenta de nuevo', async () => {
      await expect(casoDeUso.quitar(new UserId(ANA))).resolves.toBeDefined();

      expect(cuentas.guardados).toBe(0);
    });

    it('borra el archivo aunque no haya marca: limpia lo que quedo de un intento a medias', async () => {
      almacen.sembrar(new UserId(ANA), { contenido: bytes(DIBUJO_LIMPIO), tipo: SVG_TIPO });

      await casoDeUso.quitar(new UserId(ANA));

      expect(almacen.cantidad).toBe(0);
    });

    it('si el almacenamiento falla, la marca se queda: no se anuncia un borrado que no ocurrio', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);
      almacen.falla = true;

      await expect(casoDeUso.quitar(new UserId(ANA))).rejects.toThrow(FileStorageUnavailableError);

      expect((await cuentaDe(ANA))?.mascotaPropiaActualizadaEl).toEqual(AHORA);
    });
  });

  describe('cada persona solo ve y toca la suya', () => {
    it('la de una no sale cuando la otra la pide', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);

      await expect(casoDeUso.leer(new UserId(BETO))).rejects.toThrow(OwnPetNotFoundError);
      expect(texto((await casoDeUso.leer(new UserId(ANA))).contenido)).toBe(DIBUJO_LIMPIO);
    });

    it('cada una guarda la suya sin pisar la de la otra', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);
      await casoDeUso.guardar(
        new UserId(BETO),
        bytes(svg('<rect width="3" height="3"/>')),
        SVG_TIPO,
      );

      expect(texto((await casoDeUso.leer(new UserId(ANA))).contenido)).toContain('<circle');
      expect(texto((await casoDeUso.leer(new UserId(BETO))).contenido)).toContain('<rect');
    });

    it('quitar la propia no quita la ajena', async () => {
      await casoDeUso.guardar(new UserId(ANA), bytes(DIBUJO), SVG_TIPO);
      await casoDeUso.guardar(new UserId(BETO), bytes(DIBUJO), SVG_TIPO);

      await casoDeUso.quitar(new UserId(BETO));

      expect((await casoDeUso.leer(new UserId(ANA))).tipo).toBe(SVG_TIPO);
      await expect(casoDeUso.leer(new UserId(BETO))).rejects.toThrow(OwnPetNotFoundError);
    });
  });
});
