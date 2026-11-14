import { describe, expect, it } from 'vitest';
import { crearHuellaDeIp, normalizarIp } from './huellaDeIp.js';

const CLAVE = 'una-clave-de-prueba-bien-larga';

describe('normalizarIp', () => {
  it('lee igual una IPv4 y la misma escrita como IPv6', () => {
    expect(normalizarIp('::ffff:203.0.113.9')).toBe('203.0.113.9');
    expect(normalizarIp('::FFFF:203.0.113.9')).toBe('203.0.113.9');
  });

  it('no toca una IPv6 de verdad y la pone en minusculas', () => {
    expect(normalizarIp('2001:DB8::1')).toBe('2001:db8::1');
  });

  it('quita los espacios de los bordes', () => {
    expect(normalizarIp(' 203.0.113.9 ')).toBe('203.0.113.9');
  });
});

describe('crearHuellaDeIp', () => {
  const huella = crearHuellaDeIp(CLAVE);

  it('da 16 caracteres hexadecimales y no contiene la direccion', () => {
    const resultado = huella('203.0.113.9');

    expect(resultado).toMatch(/^[0-9a-f]{16}$/);
    expect(resultado).not.toContain('203');
  });

  it('es la misma para la misma IP, escrita como se escriba', () => {
    expect(huella('203.0.113.9')).toBe(huella('203.0.113.9'));
    expect(huella('::ffff:203.0.113.9')).toBe(huella('203.0.113.9'));
  });

  it('es distinta para IP distintas', () => {
    expect(huella('203.0.113.9')).not.toBe(huella('203.0.113.10'));
  });

  it('depende de la clave: sin ella no se puede comprobar si una IP aparece', () => {
    const otra = crearHuellaDeIp('otra-clave-de-prueba-bien-larga');

    expect(otra('203.0.113.9')).not.toBe(huella('203.0.113.9'));
  });
});
