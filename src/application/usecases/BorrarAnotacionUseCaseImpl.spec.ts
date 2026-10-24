import { describe, expect, it } from 'vitest';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { InvalidIdentifierError } from '../../domain/model/DomainError.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba } from '../../pruebas/diarioDePrueba.js';
import { BorrarAnotacionUseCaseImpl } from './BorrarAnotacionUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const DE_PERSONA = '33333333-3333-4333-a333-000000000001';
const DE_OTRA = '33333333-3333-4333-a333-000000000002';
const ESCRITA = new Date('2026-10-03T15:00:00.000Z');

function entrada(id: string, dueno: string, cartaAManana: boolean) {
  return EntradaDeDiario.guardada({
    id: new EntradaId(id),
    userId: new UserId(dueno),
    clientOperationId: new ClientOperationId('44444444-4444-4444-b444-' + id.slice(-12)),
    dia: '2026-10-03',
    documento: DocumentoDelDiario.desdeTextoPlano('Un mal dia'),
    cartaAManana,
    version: 1,
    creadaEn: ESCRITA,
    editadaEn: ESCRITA,
  });
}

function armar() {
  const diario = new DiarioDePrueba();

  diario.agregar(entrada(DE_PERSONA, PERSONA, true));
  diario.agregar(entrada(DE_OTRA, OTRA, false));

  return { diario, casoDeUso: new BorrarAnotacionUseCaseImpl(diario) };
}

describe('BorrarAnotacionUseCaseImpl (SCRUM-230)', () => {
  it('borra una anotacion propia, sea carta o no, sin leerla antes', async () => {
    const { casoDeUso, diario } = armar();

    await casoDeUso.execute({ userId: PERSONA, entradaId: DE_PERSONA });

    expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(0);
  });

  it('borrar dos veces es lo mismo que una: la segunda no es un error', async () => {
    const { casoDeUso } = armar();

    await casoDeUso.execute({ userId: PERSONA, entradaId: DE_PERSONA });

    await expect(
      casoDeUso.execute({ userId: PERSONA, entradaId: DE_PERSONA }),
    ).resolves.toBeUndefined();
  });

  it('la de otra persona no se toca, ni conociendo su identificador, y tampoco falla', async () => {
    const { casoDeUso, diario } = armar();

    await expect(
      casoDeUso.execute({ userId: PERSONA, entradaId: DE_OTRA }),
    ).resolves.toBeUndefined();

    expect(await diario.todasDe(new UserId(OTRA))).toHaveLength(1);
  });

  it('un identificador mal formado se rechaza', async () => {
    const { casoDeUso } = armar();

    await expect(
      casoDeUso.execute({ userId: PERSONA, entradaId: 'no-es-un-uuid' }),
    ).rejects.toThrow(InvalidIdentifierError);
  });
});
