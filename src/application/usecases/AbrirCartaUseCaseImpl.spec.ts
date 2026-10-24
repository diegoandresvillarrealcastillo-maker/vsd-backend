import { describe, expect, it } from 'vitest';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { JournalEntryNotFoundError, SealedLetterError } from '../../domain/model/DomainError.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba } from '../../pruebas/diarioDePrueba.js';
import { AbrirCartaUseCaseImpl } from './AbrirCartaUseCaseImpl.js';

const ZONA = 'America/Bogota';
const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const CARTA = '33333333-3333-4333-a333-000000000001';
const CORRIENTE = '33333333-3333-4333-a333-000000000002';
const ESCRITA = new Date('2026-10-03T15:00:00.000Z');
// 10 a. m. del 4 de octubre en Bogota: el dia siguiente.
const MANANA = new Date('2026-10-04T15:00:00.000Z');
// 9 p. m. del 3 en Bogota, que en UTC ya es el 4: sigue siendo el mismo dia para la persona.
const NOCHE_DE_HOY = new Date('2026-10-04T02:00:00.000Z');

function armar(ahora: Date) {
  const diario = new DiarioDePrueba();
  const hacer = (id: string, cartaAManana: boolean) =>
    EntradaDeDiario.guardada({
      id: new EntradaId(id),
      userId: new UserId(PERSONA),
      clientOperationId: new ClientOperationId('44444444-4444-4444-b444-' + id.slice(-12)),
      dia: '2026-10-03',
      documento: DocumentoDelDiario.desdeTextoPlano('Manana, calma'),
      cartaAManana,
      version: 1,
      creadaEn: ESCRITA,
      editadaEn: ESCRITA,
    });

  diario.agregar(hacer(CARTA, true));
  diario.agregar(hacer(CORRIENTE, false));

  return { diario, casoDeUso: new AbrirCartaUseCaseImpl(diario, () => ahora) };
}

const abrir = (id: string, userId = PERSONA) => ({ userId, zonaHoraria: ZONA, entradaId: id });

describe('AbrirCartaUseCaseImpl (SCRUM-230)', () => {
  it('al dia siguiente entrega la carta con su texto y la deja abierta', async () => {
    const { casoDeUso, diario } = armar(MANANA);

    const carta = await casoDeUso.execute(abrir(CARTA));

    expect(carta.documento.textoPlano()).toBe('Manana, calma');
    expect(carta.cartaAbiertaEn).toEqual(MANANA);

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(CARTA));

    expect(guardada?.cartaAbiertaEn).toEqual(MANANA);
  });

  it('abrirla otra vez devuelve lo mismo y no cambia la hora de la primera', async () => {
    const { diario } = armar(MANANA);
    const luego = new AbrirCartaUseCaseImpl(diario, () => new Date('2026-10-05T15:00:00.000Z'));

    await new AbrirCartaUseCaseImpl(diario, () => MANANA).execute(abrir(CARTA));
    const segunda = await luego.execute(abrir(CARTA));

    expect(segunda.cartaAbiertaEn).toEqual(MANANA);
  });

  it('el mismo dia en que se escribio no se abre, aunque en UTC ya sea otro', async () => {
    const { casoDeUso, diario } = armar(NOCHE_DE_HOY);

    await expect(casoDeUso.execute(abrir(CARTA))).rejects.toThrow(SealedLetterError);

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(CARTA));

    expect(guardada?.cartaAbiertaEn).toBeUndefined();
  });

  it('una anotacion que no es carta se responde como si no existiera', async () => {
    const { casoDeUso } = armar(MANANA);

    await expect(casoDeUso.execute(abrir(CORRIENTE))).rejects.toThrow(JournalEntryNotFoundError);
  });

  it('la carta de otra persona se responde igual que una que no existe', async () => {
    const { casoDeUso } = armar(MANANA);

    await expect(casoDeUso.execute(abrir(CARTA, OTRA))).rejects.toThrow(JournalEntryNotFoundError);
  });
});
