import { describe, expect, it } from 'vitest';
import { Calendario } from '../../domain/model/Calendario.js';
import {
  FutureJournalDayError,
  InvalidIdentifierError,
  InvalidJournalEntryError,
} from '../../domain/model/DomainError.js';
import { EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba, documentoCon, LineasDePrueba } from '../../pruebas/diarioDePrueba.js';
import { EscribirEnElDiarioUseCaseImpl } from './EscribirEnElDiarioUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
// 9 p. m. del 2 de octubre en Bogota, que en UTC ya es el 3.
const AHORA = new Date('2026-10-03T02:00:00.000Z');

let contador = 0;
function operacion(): string {
  contador += 1;

  return '44444444-4444-4444-b444-' + String(contador).padStart(12, '0');
}

function armar() {
  const diario = new DiarioDePrueba();
  const lineas = new LineasDePrueba();
  let ids = 0;
  const casoDeUso = new EscribirEnElDiarioUseCaseImpl(
    diario,
    lineas,
    new Calendario('America/Bogota'),
    () => {
      ids += 1;

      return new EntradaId('33333333-3333-4333-a333-' + String(ids).padStart(12, '0'));
    },
    () => AHORA,
  );

  return { diario, lineas, casoDeUso };
}

describe('EscribirEnElDiarioUseCaseImpl', () => {
  it('sin dia, la anotacion es de hoy en Colombia, no en UTC', async () => {
    const { casoDeUso } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      clientOperationId: operacion(),
      contenido: documentoCon('Cene con mi familia'),
    });

    expect(entrada.dia).toBe('2026-10-02');
    expect(entrada.creadaEn).toEqual(AHORA);
  });

  it('se puede escribir en un dia pasado, con la hora real de creacion', async () => {
    const { casoDeUso } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      clientOperationId: operacion(),
      dia: '2026-09-28',
      contenido: documentoCon('Me acorde de algo del domingo'),
    });

    expect(entrada.dia).toBe('2026-09-28');
    expect(entrada.creadaEn).toEqual(AHORA);
  });

  it('en un dia futuro no', async () => {
    const { casoDeUso, diario } = armar();

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        clientOperationId: operacion(),
        dia: '2026-10-03',
        contenido: documentoCon('Manana'),
      }),
    ).rejects.toThrow(FutureJournalDayError);
    expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(0);
  });

  it('el mismo clientOperationId devuelve la misma anotacion, sin duplicarla', async () => {
    const { casoDeUso, diario } = armar();
    const op = operacion();

    const primera = await casoDeUso.execute({
      userId: PERSONA,
      clientOperationId: op,
      contenido: documentoCon('Una vez'),
    });
    const segunda = await casoDeUso.execute({
      userId: PERSONA,
      clientOperationId: op,
      contenido: documentoCon('Una vez'),
    });

    expect(segunda.entrada.id.equals(primera.entrada.id)).toBe(true);
    expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(1);
  });

  it('la operacion es por persona: la misma clave de otra crea la suya', async () => {
    const { casoDeUso, diario } = armar();
    const op = operacion();

    await casoDeUso.execute({
      userId: PERSONA,
      clientOperationId: op,
      contenido: documentoCon('A'),
    });
    await casoDeUso.execute({ userId: OTRA, clientOperationId: op, contenido: documentoCon('B') });

    expect(await diario.todasDe(new UserId(OTRA))).toHaveLength(1);
  });

  it('sin senal de riesgo no hay lineas, y ni se consultan', async () => {
    const { casoDeUso, lineas } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      clientOperationId: operacion(),
      contenido: documentoCon('Un dia tranquilo'),
    });

    expect(guardada.sugiereAcompanamiento).toBe(false);
    expect(guardada.lineasDeAtencion).toEqual([]);
    expect(lineas.consultas).toBe(0);
  });

  it('con una senal de riesgo vienen las lineas, la nacional primero', async () => {
    const { casoDeUso } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      clientOperationId: operacion(),
      contenido: documentoCon('Hoy pense que no quiero seguir viviendo'),
    });

    expect(guardada.sugiereAcompanamiento).toBe(true);
    expect(guardada.lineasDeAtencion.map((linea) => linea.id)).toEqual(['linea-192', 'linea-106']);
  });

  it('el reintento de una anotacion con senal vuelve a traer las lineas', async () => {
    const { casoDeUso } = armar();
    const op = operacion();
    const peticion = {
      userId: PERSONA,
      clientOperationId: op,
      contenido: documentoCon('ya no puedo mas'),
    };

    await casoDeUso.execute(peticion);
    const reintento = await casoDeUso.execute(peticion);

    expect(reintento.sugiereAcompanamiento).toBe(true);
    expect(reintento.lineasDeAtencion).toHaveLength(2);
  });

  it('un contenido que no es un documento no se guarda', async () => {
    const { casoDeUso, diario } = armar();

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        clientOperationId: operacion(),
        contenido: '<p>hola</p>',
      }),
    ).rejects.toThrow(InvalidJournalEntryError);
    expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(0);
  });

  it('una operacion mal formada se rechaza antes de buscar nada', async () => {
    const { casoDeUso } = armar();

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        clientOperationId: 'no-es-un-uuid',
        contenido: documentoCon('x'),
      }),
    ).rejects.toThrow(InvalidIdentifierError);
  });
});
