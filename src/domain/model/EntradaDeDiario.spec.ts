import { describe, expect, it } from 'vitest';
import { DocumentoDelDiario } from './DocumentoDelDiario.js';
import {
  EditWindowClosedError,
  FutureJournalDayError,
  InvalidJournalEntryError,
  StaleJournalEntryError,
} from './DomainError.js';
import { EntradaDeDiario, MINUTOS_PARA_EDITAR } from './EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from './Identifier.js';

const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');
const HOY = '2026-10-03';
const AHORA = new Date('2026-10-03T15:00:00.000Z');

function texto(...lineas: string[]): DocumentoDelDiario {
  return DocumentoDelDiario.desdeTextoPlano(lineas.join('\n'));
}

function nueva(
  extra: Partial<Parameters<typeof EntradaDeDiario.nueva>[0]> = {},
  hoy = HOY,
): EntradaDeDiario {
  return EntradaDeDiario.nueva(
    {
      id: new EntradaId('33333333-3333-4333-a333-333333333333'),
      userId: PERSONA,
      clientOperationId: new ClientOperationId('44444444-4444-4444-a444-444444444444'),
      dia: HOY,
      documento: texto('Hoy fue un buen dia'),
      ...extra,
    },
    hoy,
    AHORA,
  );
}

function minutosDespues(minutos: number): Date {
  return new Date(AHORA.getTime() + minutos * 60_000);
}

describe('Una anotacion nueva', () => {
  it('empieza en la version 1, creada y editada ahora', () => {
    const entrada = nueva();

    expect(entrada.version).toBe(1);
    expect(entrada.creadaEn).toEqual(AHORA);
    expect(entrada.editadaEn).toEqual(AHORA);
  });

  it('se puede escribir en un dia pasado', () => {
    expect(nueva({ dia: '2026-09-20' }).dia).toBe('2026-09-20');
  });

  it('no en uno que todavia no llego', () => {
    expect(() => nueva({ dia: '2026-10-04' })).toThrow(FutureJournalDayError);
  });

  it.each(['2026-02-30', '03/10/2026', 'ayer', ''])('rechaza "%s" como dia', (dia) => {
    expect(() => nueva({ dia })).toThrow(InvalidJournalEntryError);
  });

  it('una anotacion vacia no se guarda', () => {
    expect(() => nueva({ documento: texto('   ', '') })).toThrow(/vacía/);
  });

  it('pero una con solo un diagrama si', () => {
    const entrada = nueva({
      documento: texto(''),
      adjuntos: [{ id: '0d1a6a3a-0000-4000-8000-000000000001', tipo: 'diagrama', datos: {} }],
    });

    expect(entrada.adjuntos).toHaveLength(1);
  });

  it('el titulo se recorta, y uno en blanco es ninguno', () => {
    expect(nueva({ titulo: '  Martes  ' }).titulo).toBe('Martes');
    expect(nueva({ titulo: '   ' }).titulo).toBeUndefined();
  });

  it('un titulo de mas de 120 caracteres se rechaza', () => {
    expect(() => nueva({ titulo: 'a'.repeat(121) })).toThrow(InvalidJournalEntryError);
  });
});

describe('La hora para editar', () => {
  it(`dura ${MINUTOS_PARA_EDITAR} minutos desde que se escribio`, () => {
    const entrada = nueva();

    expect(entrada.editableHasta()).toEqual(minutosDespues(MINUTOS_PARA_EDITAR));
    expect(entrada.sePuedeEditar(minutosDespues(59))).toBe(true);
    expect(entrada.sePuedeEditar(minutosDespues(60))).toBe(false);
  });

  it('dentro de la hora, editar sube la version y cambia solo lo que viene', () => {
    const editada = nueva({ titulo: 'Martes' }).editar(
      { documento: texto('Hoy fue un buen dia, y la tarde mejor') },
      1,
      minutosDespues(10),
    );

    expect(editada.version).toBe(2);
    expect(editada.titulo).toBe('Martes');
    expect(editada.documento.textoPlano()).toBe('Hoy fue un buen dia, y la tarde mejor');
    expect(editada.creadaEn).toEqual(AHORA);
    expect(editada.editadaEn).toEqual(minutosDespues(10));
  });

  it('un titulo null lo quita', () => {
    const editada = nueva({ titulo: 'Martes' }).editar({ titulo: null }, 1, minutosDespues(5));

    expect(editada.titulo).toBeUndefined();
  });

  it('pasada la hora no se puede: hay que escribir una nueva', () => {
    expect(() => nueva().editar({ documento: texto('otra cosa') }, 1, minutosDespues(61))).toThrow(
      EditWindowClosedError,
    );
  });

  it('con una version vieja no se pisa la de otro dispositivo', () => {
    const editada = nueva().editar({ documento: texto('desde el celular') }, 1, minutosDespues(5));

    expect(() =>
      editada.editar({ documento: texto('desde el computador') }, 1, minutosDespues(6)),
    ).toThrow(StaleJournalEntryError);
  });

  it('fuera de plazo manda el plazo, aunque la version tambien sea vieja', () => {
    expect(() => nueva().editar({ documento: texto('x') }, 7, minutosDespues(90))).toThrow(
      EditWindowClosedError,
    );
  });

  it('una edicion sin nada que cambiar se rechaza', () => {
    expect(() => nueva().editar({}, 1, minutosDespues(5))).toThrow(/nada que cambiar/);
  });

  it('una edicion no puede dejar la anotacion vacia', () => {
    expect(() => nueva().editar({ documento: texto('') }, 1, minutosDespues(5))).toThrow(/vacía/);
  });
});

describe('Las senales de riesgo', () => {
  it('se buscan en el texto del documento', () => {
    expect(nueva({ documento: texto('Hoy ya no puedo mas') }).contieneSenalDeRiesgo()).toBe(true);
  });

  it('aunque el editor parta la frase en trozos con marcas distintas', () => {
    const documento = DocumentoDelDiario.desde({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'a veces pienso que ' },
            { type: 'text', text: 'quiero', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' morir' },
          ],
        },
      ],
    });

    expect(nueva({ documento }).contieneSenalDeRiesgo()).toBe(true);
  });

  it('en el titulo', () => {
    expect(nueva({ titulo: 'No aguanto mas' }).contieneSenalDeRiesgo()).toBe(true);
  });

  it('y en el texto de los diagramas', () => {
    const entrada = nueva({
      adjuntos: [
        {
          id: '0d1a6a3a-0000-4000-8000-000000000001',
          tipo: 'diagrama',
          datos: { elements: [{ type: 'text', text: 'quiero matarme' }] },
        },
      ],
    });

    expect(entrada.contieneSenalDeRiesgo()).toBe(true);
  });

  it('un dia corriente no tiene ninguna', () => {
    expect(nueva({ titulo: 'Martes' }).contieneSenalDeRiesgo()).toBe(false);
  });
});
