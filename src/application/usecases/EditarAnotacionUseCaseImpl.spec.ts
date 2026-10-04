import { describe, expect, it } from 'vitest';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import {
  EditWindowClosedError,
  JournalEntryNotFoundError,
  StaleJournalEntryError,
} from '../../domain/model/DomainError.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba, documentoCon, LineasDePrueba } from '../../pruebas/diarioDePrueba.js';
import { EditarAnotacionUseCaseImpl } from './EditarAnotacionUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const ENTRADA = '33333333-3333-4333-a333-333333333333';
const ESCRITA = new Date('2026-10-03T15:00:00.000Z');

function minutosDespues(minutos: number): Date {
  return new Date(ESCRITA.getTime() + minutos * 60_000);
}

/** Un diario con una anotacion escrita a las 10 a. m. y un reloj que se puede mover. */
function armar() {
  const diario = new DiarioDePrueba();
  const reloj = { ahora: minutosDespues(10) };

  diario.agregar(
    EntradaDeDiario.guardada({
      id: new EntradaId(ENTRADA),
      userId: new UserId(PERSONA),
      clientOperationId: new ClientOperationId('44444444-4444-4444-b444-000000000001'),
      dia: '2026-10-03',
      titulo: 'Sabado',
      documento: DocumentoDelDiario.desdeTextoPlano('Desayune temprano'),
      version: 1,
      creadaEn: ESCRITA,
      editadaEn: ESCRITA,
    }),
  );

  const casoDeUso = new EditarAnotacionUseCaseImpl(diario, new LineasDePrueba(), () => reloj.ahora);

  return { diario, reloj, casoDeUso };
}

describe('EditarAnotacionUseCaseImpl', () => {
  it('dentro de la hora, guarda la correccion y sube la version', async () => {
    const { casoDeUso, diario } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      entradaId: ENTRADA,
      version: 1,
      contenido: documentoCon('Desayune temprano y sali a caminar'),
    });

    expect(entrada.version).toBe(2);
    expect(entrada.titulo).toBe('Sabado');

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA));

    expect(guardada?.documento.textoPlano()).toBe('Desayune temprano y sali a caminar');
  });

  it('pasada la hora responde fuera de plazo y no toca nada', async () => {
    const { casoDeUso, diario, reloj } = armar();
    reloj.ahora = minutosDespues(61);

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Algo que llego tarde'),
      }),
    ).rejects.toThrow(EditWindowClosedError);

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA));

    expect(guardada?.version).toBe(1);
    expect(guardada?.documento.textoPlano()).toBe('Desayune temprano');
  });

  it('con una version vieja responde desactualizada y no pisa la otra edicion', async () => {
    const { casoDeUso, diario } = armar();

    await casoDeUso.execute({
      userId: PERSONA,
      entradaId: ENTRADA,
      version: 1,
      contenido: documentoCon('Desde el celular'),
    });

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Desde el computador'),
      }),
    ).rejects.toThrow(StaleJournalEntryError);

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA));

    expect(guardada?.documento.textoPlano()).toBe('Desde el celular');
  });

  it('la anotacion de otra persona responde igual que una que no existe', async () => {
    const { casoDeUso } = armar();

    await expect(
      casoDeUso.execute({
        userId: OTRA,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Intento'),
      }),
    ).rejects.toThrow(JournalEntryNotFoundError);
  });

  it('si la base no la deja pasar con la misma version, es que paso la hora', async () => {
    // El reloj de la API todavia la ve dentro de plazo, pero la base, que es
    // quien manda, ya no: devuelve que no guardo nada.
    const { casoDeUso, diario } = armar();
    diario.guardarEdicion = () => Promise.resolve(null);

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Justo en el limite'),
      }),
    ).rejects.toThrow(EditWindowClosedError);
  });

  it('una correccion con una senal de riesgo trae las lineas', async () => {
    const { casoDeUso } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      entradaId: ENTRADA,
      version: 1,
      titulo: 'No aguanto mas',
    });

    expect(guardada.sugiereAcompanamiento).toBe(true);
    expect(guardada.lineasDeAtencion[0]?.id).toBe('linea-192');
  });

  it('adjuntos null quita los diagramas', async () => {
    const { casoDeUso } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      entradaId: ENTRADA,
      version: 1,
      adjuntos: null,
    });

    expect(entrada.adjuntos).toEqual([]);
  });
});
