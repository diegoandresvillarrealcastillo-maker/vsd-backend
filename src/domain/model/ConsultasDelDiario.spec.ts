import { describe, expect, it } from 'vitest';
import { entradaConId, entradaDeLaOperacion, entradasEntreDias } from './ConsultasDelDiario.js';
import { DocumentoDelDiario } from './DocumentoDelDiario.js';
import { EntradaDeDiario } from './EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from './Identifier.js';

const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');
const HOY = '2026-10-10';

/** Una anotacion del `dia`, escrita a la `hora` UTC de ese dia; `n` la distingue de las demas. */
function entrada(n: number, dia: string, hora: number): EntradaDeDiario {
  const cola = String(n).padStart(12, '0');

  return EntradaDeDiario.nueva(
    {
      id: new EntradaId(`33333333-3333-4333-a333-${cola}`),
      userId: PERSONA,
      clientOperationId: new ClientOperationId(`44444444-4444-4444-a444-${cola}`),
      dia,
      documento: DocumentoDelDiario.desdeTextoPlano(`Anotacion ${String(n)}`),
    },
    HOY,
    new Date(`${dia}T${String(hora).padStart(2, '0')}:00:00.000Z`),
  );
}

/** Los numeros de las anotaciones, en el orden en que salen. */
function numerosDe(entradas: readonly EntradaDeDiario[]): number[] {
  return entradas.map((e) => Number(e.id.value.slice(-12)));
}

describe('entradasEntreDias', () => {
  const lunes8 = entrada(1, '2026-10-08', 9);
  const lunes8Tarde = entrada(2, '2026-10-08', 18);
  const martes9 = entrada(3, '2026-10-09', 7);
  const miercoles10 = entrada(4, '2026-10-10', 7);
  const antes = entrada(5, '2026-10-07', 12);

  it('incluye los dos extremos y deja fuera lo de antes y lo de despues', () => {
    const todas = [lunes8, martes9, miercoles10, antes];

    expect(numerosDe(entradasEntreDias(todas, '2026-10-08', '2026-10-10'))).toEqual([1, 3, 4]);
    expect(numerosDe(entradasEntreDias(todas, '2026-10-08', '2026-10-09'))).toEqual([1, 3]);
    expect(numerosDe(entradasEntreDias(todas, '2026-10-09', '2026-10-10'))).toEqual([3, 4]);
  });

  it('va por dia y, dentro del dia, de la mas antigua a la mas reciente', () => {
    const desordenadas = [miercoles10, lunes8Tarde, martes9, lunes8];

    expect(numerosDe(entradasEntreDias(desordenadas, '2026-10-08', '2026-10-10'))).toEqual([
      1, 2, 3, 4,
    ]);
  });

  it('no cambia la lista que recibe', () => {
    const original = [miercoles10, lunes8Tarde, lunes8];

    entradasEntreDias(original, '2026-10-08', '2026-10-10');

    expect(numerosDe(original)).toEqual([4, 2, 1]);
  });

  it('sin anotaciones en esos dias, no devuelve nada', () => {
    expect(entradasEntreDias([antes], '2026-10-08', '2026-10-10')).toEqual([]);
    expect(entradasEntreDias([], '2026-10-08', '2026-10-10')).toEqual([]);
  });
});

describe('entradaConId', () => {
  const una = entrada(1, '2026-10-08', 9);
  const otra = entrada(2, '2026-10-08', 10);

  it('devuelve la que tiene ese identificador', () => {
    expect(entradaConId([una, otra], otra.id)).toBe(otra);
    expect(entradaConId([una, otra], una.id)).toBe(una);
  });

  it('si no esta, devuelve null', () => {
    expect(entradaConId([una], otra.id)).toBeNull();
    expect(entradaConId([], una.id)).toBeNull();
  });
});

describe('entradaDeLaOperacion', () => {
  const una = entrada(1, '2026-10-08', 9);
  const otra = entrada(2, '2026-10-08', 10);

  it('devuelve la que nacio de esa operacion', () => {
    expect(entradaDeLaOperacion([una, otra], otra.clientOperationId)).toBe(otra);
    expect(entradaDeLaOperacion([una, otra], una.clientOperationId)).toBe(una);
  });

  it('si no esta, devuelve null', () => {
    expect(entradaDeLaOperacion([una], otra.clientOperationId)).toBeNull();
    expect(entradaDeLaOperacion([], una.clientOperationId)).toBeNull();
  });
});
