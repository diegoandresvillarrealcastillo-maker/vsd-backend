import { describe, expect, it } from 'vitest';
import { InvalidIdentifierError } from './DomainError.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from './Identifier.js';

const UUID_VALIDO = '11111111-1111-4111-8111-111111111111';

describe('Identifier', () => {
  it('acepta un UUID con formato valido', () => {
    expect(new UserId(UUID_VALIDO).value).toBe(UUID_VALIDO);
  });

  it('normaliza mayusculas y espacios sobrantes', () => {
    expect(new UserId(`  ${UUID_VALIDO.toUpperCase()}  `).value).toBe(UUID_VALIDO);
  });

  it.each([
    ['texto que no es un UUID', 'no-soy-un-uuid'],
    ['cadena vacia', ''],
    ['UUID incompleto', '11111111-1111-4111-8111'],
    ['caracteres fuera de hexadecimal', 'zzzzzzzz-1111-4111-8111-111111111111'],
    ['variante invalida', '11111111-1111-4111-0111-111111111111'],
  ])('rechaza %s', (_caso, valor) => {
    expect(() => new UserId(valor)).toThrow(InvalidIdentifierError);
  });

  it('indica en el error de que tipo de identificador se trata', () => {
    expect(() => new ActivityId('roto')).toThrow(/actividad/);
    expect(() => new ClientOperationId('roto')).toThrow(/operacion del cliente/);
  });

  it('considera iguales dos identificadores del mismo tipo y valor', () => {
    expect(new UserId(UUID_VALIDO).equals(new UserId(UUID_VALIDO))).toBe(true);
  });

  it('no confunde identificadores de tipos distintos aunque compartan el valor', () => {
    // Es la razon de que cada identificador sea una clase propia: pasar un
    // ActivityId donde se espera un UserId debe ser imposible.
    expect(new UserId(UUID_VALIDO).equals(new ActivityId(UUID_VALIDO))).toBe(false);
  });

  it('se convierte a texto devolviendo su valor', () => {
    expect(String(new ResultId(UUID_VALIDO))).toBe(UUID_VALIDO);
  });
});
