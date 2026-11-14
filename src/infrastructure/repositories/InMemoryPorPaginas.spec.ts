import { describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import {
  ActivityId,
  ClientOperationId,
  EntradaId,
  PendienteId,
  ResultId,
  UserId,
} from '../../domain/model/Identifier.js';
import { Pendiente } from '../../domain/model/Pendiente.js';
import { InMemoryActivityResultRepository } from './InMemoryActivityResultRepository.js';
import { InMemoryDiarioRepository } from './InMemoryDiarioRepository.js';
import { InMemoryPendientesRepository } from './InMemoryPendientesRepository.js';

const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');
const OTRA = new UserId('22222222-2222-4222-8222-222222222222');
const BASE = new Date('2026-09-01T00:00:00.000Z');
const TOTAL = 450;

function sufijo(n: number): string {
  return String(n).padStart(12, '0');
}

/** Cada hora la comparten tres: con 200 por pagina, el limite parte un empate. */
function hora(n: number): Date {
  return new Date(BASE.getTime() + Math.floor(n / 3) * 60_000);
}

async function recorrer<T>(paginas: AsyncIterable<readonly T[]>): Promise<T[][]> {
  const todas: T[][] = [];

  for await (const pagina of paginas) {
    todas.push([...pagina]);
  }

  return todas;
}

/**
 * Los adaptadores en memoria cumplen el mismo contrato de lectura por paginas que los de
 * PostgreSQL (SCRUM-262): paginas de 200, en el orden del puerto, sin repetir ni saltarse nada, y
 * solo lo de esa persona. Es lo que permite probar los casos de uso contra memoria.
 */
describe('las lecturas por paginas en memoria', () => {
  it('resultados: del mas reciente al mas antiguo, de a 200', async () => {
    const repositorio = new InMemoryActivityResultRepository();

    for (let n = 1; n <= TOTAL; n++) {
      await repositorio.save(
        ActivityResult.create(
          {
            id: new ResultId(`40000000-0000-4000-8000-${sufijo(n)}`),
            userId: PERSONA,
            activityId: new ActivityId('33333333-3333-4333-a333-333333333333'),
            clientOperationId: new ClientOperationId(`50000000-0000-4000-8000-${sufijo(n)}`),
            completedAt: hora(n),
            dia: '2026-09-01',
          },
          new Date('2026-12-01T00:00:00.000Z'),
        ),
      );
    }

    const paginas = await recorrer(repositorio.paginasDeResultados(PERSONA, new Date(0)));

    expect(paginas.map((pagina) => pagina.length)).toEqual([200, 200, 50]);

    const ids = paginas.flat().map((resultado) => resultado.id.value);
    const esperado = Array.from({ length: TOTAL }, (_, i) => i + 1)
      .sort((a, b) => hora(b).getTime() - hora(a).getTime() || (sufijo(b) > sufijo(a) ? 1 : -1))
      .map((n) => `40000000-0000-4000-8000-${sufijo(n)}`);

    expect(ids).toEqual(esperado);
    await expect(recorrer(repositorio.paginasDeResultados(OTRA, new Date(0)))).resolves.toEqual([]);
  });

  it('diario: de la mas antigua a la mas reciente, de a 200', async () => {
    const repositorio = new InMemoryDiarioRepository();

    for (let n = 1; n <= TOTAL; n++) {
      await repositorio.guardarNueva(
        EntradaDeDiario.guardada({
          id: new EntradaId(`33333333-3333-4333-a333-${sufijo(n)}`),
          userId: PERSONA,
          clientOperationId: new ClientOperationId(`44444444-4444-4444-a444-${sufijo(n)}`),
          dia: '2026-09-01',
          documento: DocumentoDelDiario.desdeTextoPlano(`Entrada ${n}`),
          version: 1,
          creadaEn: hora(n),
          editadaEn: hora(n),
        }),
      );
    }

    const paginas = await recorrer(repositorio.paginasDeEntradas(PERSONA));

    expect(paginas.map((pagina) => pagina.length)).toEqual([200, 200, 50]);

    const ids = paginas.flat().map((entrada) => entrada.id.value);

    expect(new Set(ids).size).toBe(TOTAL);
    expect(ids).toEqual(
      Array.from({ length: TOTAL }, (_, i) => i + 1)
        .sort((a, b) => hora(a).getTime() - hora(b).getTime() || (sufijo(a) > sufijo(b) ? 1 : -1))
        .map((n) => `33333333-3333-4333-a333-${sufijo(n)}`),
    );
    await expect(recorrer(repositorio.paginasDeEntradas(OTRA))).resolves.toEqual([]);
  });

  it('pendientes: del mas antiguo al mas reciente, de a 200', async () => {
    const repositorio = new InMemoryPendientesRepository();

    for (let n = 1; n <= TOTAL; n++) {
      await repositorio.guardarNuevo(
        Pendiente.nuevo(
          {
            id: new PendienteId(`55555555-5555-4555-a555-${sufijo(n)}`),
            userId: PERSONA,
            clientOperationId: new ClientOperationId(`66666666-6666-4666-a666-${sufijo(n)}`),
            texto: `Pendiente ${n}`,
            nivel: 'urgente',
          },
          hora(n),
        ),
      );
    }

    const paginas = await recorrer(repositorio.paginasDePendientes(PERSONA));

    expect(paginas.map((pagina) => pagina.length)).toEqual([200, 200, 50]);

    const ids = paginas.flat().map((pendiente) => pendiente.id.value);

    expect(new Set(ids).size).toBe(TOTAL);
    expect(ids).toEqual(
      Array.from({ length: TOTAL }, (_, i) => i + 1)
        .sort((a, b) => hora(a).getTime() - hora(b).getTime() || (sufijo(a) > sufijo(b) ? 1 : -1))
        .map((n) => `55555555-5555-4555-a555-${sufijo(n)}`),
    );
    await expect(recorrer(repositorio.paginasDePendientes(OTRA))).resolves.toEqual([]);
  });
});
