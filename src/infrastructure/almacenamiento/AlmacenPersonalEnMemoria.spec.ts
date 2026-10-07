import { describe, expect, it } from 'vitest';
import { UserId } from '../../domain/model/Identifier.js';
import { AlmacenPersonalEnMemoria } from './AlmacenPersonalEnMemoria.js';

const ANA = new UserId('11111111-1111-4111-8111-111111111111');
const BETO = new UserId('22222222-2222-4222-9222-222222222222');

const bytes = (...valores: number[]): Uint8Array => Uint8Array.from(valores);

describe('AlmacenPersonalEnMemoria', () => {
  it('guarda y devuelve el archivo de una persona', async () => {
    const almacen = new AlmacenPersonalEnMemoria();

    await almacen.guardar(ANA, { contenido: bytes(1, 2, 3), tipo: 'image/png' });

    expect(await almacen.leer(ANA)).toEqual({ contenido: bytes(1, 2, 3), tipo: 'image/png' });
  });

  it('quien no tiene archivo recibe undefined', async () => {
    expect(await new AlmacenPersonalEnMemoria().leer(ANA)).toBeUndefined();
  });

  it('guardar otra vez reemplaza el anterior', async () => {
    const almacen = new AlmacenPersonalEnMemoria();

    await almacen.guardar(ANA, { contenido: bytes(1), tipo: 'image/png' });
    await almacen.guardar(ANA, { contenido: bytes(9, 9), tipo: 'image/jpeg' });

    expect(almacen.cantidad).toBe(1);
    expect(await almacen.leer(ANA)).toEqual({ contenido: bytes(9, 9), tipo: 'image/jpeg' });
  });

  it('cada persona tiene el suyo', async () => {
    const almacen = new AlmacenPersonalEnMemoria();

    await almacen.guardar(ANA, { contenido: bytes(1), tipo: 'image/png' });
    await almacen.guardar(BETO, { contenido: bytes(2), tipo: 'image/jpeg' });

    expect((await almacen.leer(ANA))?.contenido).toEqual(bytes(1));
    expect((await almacen.leer(BETO))?.contenido).toEqual(bytes(2));
  });

  it('borrar quita solo el de esa persona', async () => {
    const almacen = new AlmacenPersonalEnMemoria();

    await almacen.guardar(ANA, { contenido: bytes(1), tipo: 'image/png' });
    await almacen.guardar(BETO, { contenido: bytes(2), tipo: 'image/png' });
    await almacen.borrar(ANA);

    expect(await almacen.leer(ANA)).toBeUndefined();
    expect(await almacen.leer(BETO)).toBeDefined();
  });

  it('borrar el que no existe no es un error', async () => {
    await expect(new AlmacenPersonalEnMemoria().borrar(ANA)).resolves.toBeUndefined();
  });

  it('guarda una copia: cambiar lo que se entrego despues no cambia lo guardado', async () => {
    const almacen = new AlmacenPersonalEnMemoria();
    const original = bytes(1, 2, 3);

    await almacen.guardar(ANA, { contenido: original, tipo: 'image/png' });
    original[0] = 99;

    expect((await almacen.leer(ANA))?.contenido).toEqual(bytes(1, 2, 3));
  });

  it('entrega una copia: cambiar lo que se recibio no cambia lo guardado', async () => {
    const almacen = new AlmacenPersonalEnMemoria();

    await almacen.guardar(ANA, { contenido: bytes(1, 2, 3), tipo: 'image/png' });

    const leido = await almacen.leer(ANA);

    if (leido !== undefined) {
      leido.contenido[0] = 99;
    }

    expect((await almacen.leer(ANA))?.contenido).toEqual(bytes(1, 2, 3));
  });
});
