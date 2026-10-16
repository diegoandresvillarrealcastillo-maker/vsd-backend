import { describe, expect, it } from 'vitest';
import { claveDeLaMecanica, claveDeLaSesion, claveEstable } from './ClaveEstable.js';

describe('claveEstable', () => {
  // Vectores de prueba publicados de FNV-1a de 64 bits (Fowler, Noll y Vo). Si cambian, cambia el
  // orden que ve cada persona, y con el la rotacion de su sendero.
  it.each([
    ['', 0xcbf29ce484222325n],
    ['a', 0xaf63dc4c8601ec8cn],
    ['foobar', 0x85944171f73967e8n],
  ])('la clave de «%s» es la de FNV-1a de 64 bits', (texto, esperada) => {
    expect(claveEstable(texto)).toBe(esperada);
  });

  it('es la misma cada vez: el orden de una persona no cambia entre dos peticiones', () => {
    expect(claveEstable('mecanica:persona:2026-10-16')).toBe(
      claveEstable('mecanica:persona:2026-10-16'),
    );
  });

  it('cabe en 64 bits sin signo', () => {
    for (const texto of ['', 'a', 'x'.repeat(500), 'ñandú: tildes y eñes']) {
      const clave = claveEstable(texto);

      expect(clave).toBeGreaterThanOrEqual(0n);
      expect(clave).toBeLessThan(1n << 64n);
    }
  });

  it('textos distintos dan claves distintas', () => {
    const claves = new Set<bigint>();

    for (let i = 0; i < 2000; i++) {
      claves.add(claveEstable(`sesion-${i}`));
    }

    expect(claves.size).toBe(2000);
  });
});

describe('claveDeLaMecanica: el orden de la rotacion de cada persona y dia (ADR 0030, punto 7)', () => {
  const MECANICA = '33333333-3333-4333-a333-333333333333';
  const PERSONA = '11111111-1111-4111-8111-111111111111';
  const OTRA = '22222222-2222-4222-8222-222222222222';

  it('es estable para la misma mecanica, persona y dia', () => {
    expect(claveDeLaMecanica(MECANICA, PERSONA, '2026-10-16')).toBe(
      claveDeLaMecanica(MECANICA, PERSONA, '2026-10-16'),
    );
  });

  it('cambia con la persona: cada una tiene su propio orden', () => {
    expect(claveDeLaMecanica(MECANICA, PERSONA, '2026-10-16')).not.toBe(
      claveDeLaMecanica(MECANICA, OTRA, '2026-10-16'),
    );
  });

  it('cambia con el dia: la misma persona no ve cada dia el mismo desempate', () => {
    expect(claveDeLaMecanica(MECANICA, PERSONA, '2026-10-16')).not.toBe(
      claveDeLaMecanica(MECANICA, PERSONA, '2026-10-17'),
    );
  });

  it('cambia con la mecanica', () => {
    expect(claveDeLaMecanica(MECANICA, PERSONA, '2026-10-16')).not.toBe(
      claveDeLaMecanica('44444444-4444-4444-b444-444444444444', PERSONA, '2026-10-16'),
    );
  });
});

describe('claveDeLaSesion: el orden de las sesiones de cada persona (ADR 0030, punto 6)', () => {
  const SESION = '55555555-5555-4555-a555-555555555555';

  it('es estable y no depende del dia', () => {
    expect(claveDeLaSesion(SESION, 'persona')).toBe(claveDeLaSesion(SESION, 'persona'));
  });

  it('cambia con la persona', () => {
    expect(claveDeLaSesion(SESION, 'persona-a')).not.toBe(claveDeLaSesion(SESION, 'persona-b'));
  });

  it('cambia con la sesion', () => {
    expect(claveDeLaSesion(SESION, 'persona')).not.toBe(claveDeLaSesion('otra-sesion', 'persona'));
  });

  it('no coincide con la de una mecanica con el mismo texto: son espacios de claves distintos', () => {
    // Una sesion y una mecanica nunca se comparan entre si, pero un identificador repetido no debe
    // dar la misma clave en los dos usos por casualidad del texto que se hashea.
    expect(claveDeLaSesion('x', 'p')).not.toBe(claveDeLaMecanica('x', 'p', '2026-10-16'));
  });
});
