import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import {
  CABECERA_DE_PETICION,
  identificadorDeLaRespuesta,
  identificadorDePeticion,
} from './identificadorDePeticion.js';

/** Forma de un UUID version 4, que es lo unico que se pone en la cabecera. */
const FORMA_DE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function peticionCon(recibido?: string | string[]): Request {
  return {
    headers: recibido === undefined ? {} : { [CABECERA_DE_PETICION]: recibido },
  } as unknown as Request;
}

/** Doble de la respuesta que guarda las cabeceras, como hace la de verdad. */
function respuestaDoble() {
  const cabeceras = new Map<string, string>();

  const respuesta = {
    setHeader(nombre: string, valor: string): void {
      cabeceras.set(nombre.toLowerCase(), valor);
    },
    getHeader(nombre: string): string | undefined {
      return cabeceras.get(nombre.toLowerCase());
    },
  } as unknown as Response;

  return { respuesta, puesto: () => cabeceras.get(CABECERA_DE_PETICION) };
}

/** Pasa una peticion por la funcion intermedia y cuenta que quedo. */
function pasar(recibido?: string | string[]): {
  identificador: string | undefined;
  siguio: boolean;
} {
  const { respuesta, puesto } = respuestaDoble();
  const siguiente = vi.fn() as unknown as NextFunction;

  identificadorDePeticion()(peticionCon(recibido), respuesta, siguiente);

  return { identificador: puesto(), siguio: vi.mocked(siguiente).mock.calls.length === 1 };
}

describe('identificadorDePeticion', () => {
  it('pone un UUID en la cabecera de la respuesta', () => {
    expect(pasar().identificador).toMatch(FORMA_DE_UUID);
  });

  it('deja seguir la peticion', () => {
    // Una funcion intermedia que no llama a la siguiente cuelga la peticion
    // entera. Es el fallo mas facil de cometer aqui y el mas visible.
    expect(pasar().siguio).toBe(true);
  });

  it('da uno distinto a cada peticion', () => {
    const vistos = new Set([pasar().identificador, pasar().identificador, pasar().identificador]);

    expect(vistos.size).toBe(3);
  });

  describe('no reutiliza el identificador que llega', () => {
    it('ignora uno con saltos de linea', () => {
      // Es la prueba que define esta tarea. El identificador acaba escrito en
      // el registro: aceptar saltos de linea permitiria fabricar entradas
      // falsas desde fuera, y el registro dejaria de ser fiable.
      const { identificador } = pasar('linea-uno\nERROR linea-falsificada');

      expect(identificador).not.toContain('falsificada');
      expect(identificador).toMatch(FORMA_DE_UUID);
    });

    it('ignora uno que parece inofensivo', () => {
      // No es solo cuestion de caracteres peligrosos. El identificador lo
      // escribimos nosotros en el registro, y ahi no entra nada personal: un
      // cliente descuidado que ponga un dato de la persona en esta cabecera
      // romperia esa regla sin que nos enteremos.
      const { identificador } = pasar('11111111-1111-4111-8111-111111111111');

      expect(identificador).not.toBe('11111111-1111-4111-8111-111111111111');
      expect(identificador).toMatch(FORMA_DE_UUID);
    });

    it('ignora uno que trae algo identificable', () => {
      const { identificador } = pasar('persona.identificable-ejemplo.test');

      expect(identificador).not.toContain('identificable');
    });

    it('ignora la cabecera repetida', () => {
      const { identificador } = pasar(['uno-cualquiera', 'otro-cualquiera']);

      expect(identificador).toMatch(FORMA_DE_UUID);
    });
  });
});

describe('identificadorDeLaRespuesta', () => {
  it('devuelve el que quedo puesto en la respuesta', () => {
    const { respuesta } = respuestaDoble();
    const siguiente = vi.fn() as unknown as NextFunction;

    identificadorDePeticion()(peticionCon(), respuesta, siguiente);

    expect(identificadorDeLaRespuesta(respuesta)).toMatch(FORMA_DE_UUID);
  });

  it('devuelve el nuestro y no el que mando el cliente', () => {
    const { respuesta } = respuestaDoble();
    const siguiente = vi.fn() as unknown as NextFunction;

    identificadorDePeticion()(peticionCon('el-del-cliente-largo'), respuesta, siguiente);

    expect(identificadorDeLaRespuesta(respuesta)).not.toContain('cliente');
  });

  it('devuelve indefinido cuando la respuesta no lo lleva', () => {
    const { respuesta } = respuestaDoble();

    expect(identificadorDeLaRespuesta(respuesta)).toBeUndefined();
  });
});
