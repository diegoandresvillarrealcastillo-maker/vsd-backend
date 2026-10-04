import { describe, expect, it } from 'vitest';
import { Calendario } from '../../domain/model/Calendario.js';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { InvalidDayRangeError } from '../../domain/model/DomainError.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba } from '../../pruebas/diarioDePrueba.js';
import { ConsultarDiarioUseCaseImpl } from './ConsultarDiarioUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
// 9 p. m. del 2 de octubre en Bogota.
const AHORA = new Date('2026-10-03T02:00:00.000Z');

let contador = 0;
function anotacion(persona: string, dia: string, texto: string, creadaEn: Date): EntradaDeDiario {
  contador += 1;
  const sufijo = String(contador).padStart(12, '0');

  return EntradaDeDiario.guardada({
    id: new EntradaId('33333333-3333-4333-a333-' + sufijo),
    userId: new UserId(persona),
    clientOperationId: new ClientOperationId('44444444-4444-4444-b444-' + sufijo),
    dia,
    documento: DocumentoDelDiario.desdeTextoPlano(texto),
    version: 1,
    creadaEn,
    editadaEn: creadaEn,
  });
}

function armar() {
  const diario = new DiarioDePrueba();

  diario.agregar(anotacion(PERSONA, '2026-10-02', 'la noche', new Date('2026-10-03T01:00:00Z')));
  diario.agregar(anotacion(PERSONA, '2026-10-02', 'la manana', new Date('2026-10-02T13:00:00Z')));
  // Escrita hoy, pero del lunes.
  diario.agregar(anotacion(PERSONA, '2026-09-28', 'el lunes', new Date('2026-10-02T20:00:00Z')));
  diario.agregar(
    anotacion(OTRA, '2026-10-02', 'de otra persona', new Date('2026-10-02T14:00:00Z')),
  );

  return new ConsultarDiarioUseCaseImpl(diario, new Calendario('America/Bogota'), () => AHORA);
}

function textos(entradas: readonly EntradaDeDiario[]): string[] {
  return entradas.map((entrada) => entrada.documento.textoPlano());
}

describe('ConsultarDiarioUseCaseImpl', () => {
  it('sin rango, las de hoy en Colombia, por hora', async () => {
    const entradas = await armar().execute({ userId: PERSONA });

    expect(textos(entradas)).toEqual(['la manana', 'la noche']);
  });

  it('con rango, por dia y despues por hora; cuenta el dia, no cuando se escribio', async () => {
    const entradas = await armar().execute({
      userId: PERSONA,
      desde: '2026-09-27',
      hasta: '2026-10-02',
    });

    expect(textos(entradas)).toEqual(['el lunes', 'la manana', 'la noche']);
  });

  it('nunca trae las de otra persona', async () => {
    const entradas = await armar().execute({
      userId: OTRA,
      desde: '2026-09-01',
      hasta: '2026-10-02',
    });

    expect(textos(entradas)).toEqual(['de otra persona']);
  });

  it('solo con hasta, las de ese dia', async () => {
    const entradas = await armar().execute({ userId: PERSONA, hasta: '2026-09-28' });

    expect(textos(entradas)).toEqual(['el lunes']);
  });

  it('un rango al reves se rechaza', async () => {
    await expect(
      armar().execute({ userId: PERSONA, desde: '2026-10-02', hasta: '2026-09-28' }),
    ).rejects.toThrow(InvalidDayRangeError);
  });

  it('un dia que no existe se rechaza', async () => {
    await expect(armar().execute({ userId: PERSONA, desde: '2026-02-30' })).rejects.toThrow(
      /fecha real/,
    );
  });

  it('un ano entero se puede pedir; mas, no', async () => {
    await expect(
      armar().execute({ userId: PERSONA, desde: '2025-10-02', hasta: '2026-10-02' }),
    ).resolves.toBeDefined();
    await expect(
      armar().execute({ userId: PERSONA, desde: '2025-10-01', hasta: '2026-10-02' }),
    ).rejects.toThrow(/como mucho/);
  });
});
