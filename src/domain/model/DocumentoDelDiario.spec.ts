import { describe, expect, it } from 'vitest';
import {
  adjuntosDesde,
  DocumentoDelDiario,
  MAXIMO_DE_ADJUNTOS,
  TAMANO_MAXIMO_DE_LOS_ADJUNTOS,
  TAMANO_MAXIMO_DEL_DOCUMENTO,
} from './DocumentoDelDiario.js';
import { InvalidJournalEntryError } from './DomainError.js';

function parrafo(...textos: (string | { text: string; marks: { type: string }[] })[]) {
  return {
    type: 'paragraph',
    content: textos.map((texto) =>
      typeof texto === 'string' ? { type: 'text', text: texto } : { type: 'text', ...texto },
    ),
  };
}

function documento(...bloques: unknown[]) {
  return { type: 'doc', content: bloques };
}

const DIAGRAMA = '0d1a6a3a-0000-4000-8000-000000000001';

describe('DocumentoDelDiario: la forma', () => {
  it('acepta un documento normal del editor, con marcas y atributos', () => {
    const doc = DocumentoDelDiario.desde(
      documento(
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Martes' }] },
        parrafo('Salí a ', { text: 'caminar', marks: [{ type: 'bold' }] }, '.'),
        {
          type: 'bulletList',
          content: [{ type: 'listItem', content: [parrafo('agua')] }],
        },
      ),
    );

    expect(doc.textoPlano()).toBe('Martes\nSalí a caminar.\nagua');
  });

  it.each([
    ['un texto suelto', '<p>hola</p>'],
    ['un objeto sin type doc', { type: 'paragraph' }],
    ['una lista', [documento()]],
    ['null', null],
  ])('rechaza %s como contenido', (_caso, valor) => {
    expect(() => DocumentoDelDiario.desde(valor)).toThrow(InvalidJournalEntryError);
  });

  it.each([
    ['un nodo sin tipo', documento({ content: [] })],
    ['un tipo que no es un identificador', documento({ type: '<script>' })],
    ['una clave que el editor no usa', documento({ type: 'paragraph', html: '<b>x</b>' })],
    ['texto fuera de un nodo de texto', documento({ type: 'paragraph', text: 'hola' })],
    ['un nodo de texto sin texto', documento({ type: 'paragraph', content: [{ type: 'text' }] })],
    ['contenido que no es lista', documento({ type: 'paragraph', content: 'hola' })],
    ['marcas que no son lista', documento(parrafo({ text: 'a', marks: 'bold' as never }))],
    ['una marca sin tipo', documento(parrafo({ text: 'a', marks: [{} as never] }))],
    ['atributos que no son objeto', documento({ type: 'heading', attrs: 2 })],
  ])('rechaza %s', (_caso, valor) => {
    expect(() => DocumentoDelDiario.desde(valor)).toThrow(InvalidJournalEntryError);
  });

  it('rechaza un documento que anida demasiado', () => {
    let nodo: Record<string, unknown> = { type: 'text', text: 'fondo' };

    for (let i = 0; i < 60; i++) {
      nodo = { type: 'blockquote', content: [nodo] };
    }

    expect(() => DocumentoDelDiario.desde(documento(nodo))).toThrow(/anida/);
  });

  it('rechaza un documento por encima del tamano maximo', () => {
    const largo = 'a'.repeat(TAMANO_MAXIMO_DEL_DOCUMENTO);

    expect(() => DocumentoDelDiario.desde(documento(parrafo(largo)))).toThrow(/tamaño/);
  });

  it('el mensaje de error nunca repite lo escrito', () => {
    const intento = () =>
      DocumentoDelDiario.desde(documento({ type: 'paragraph', text: 'algo muy personal' }));

    expect(intento).toThrow(InvalidJournalEntryError);
    expect(() => intento()).not.toThrow(/muy personal/);
  });

  it('lo guardado no se puede cambiar desde fuera', () => {
    const original = documento(parrafo('hola'));
    const doc = DocumentoDelDiario.desde(original);

    (original.content[0] as { type: string }).type = 'heading';

    expect(doc.raiz.content?.[0]?.type).toBe('paragraph');
    expect(Object.isFrozen(doc.raiz)).toBe(true);
  });
});

describe('DocumentoDelDiario: el texto', () => {
  it('une los trozos de una frase partida por marcas', () => {
    // El editor parte "quiero morir" en dos nodos si una palabra va en
    // negrita. La deteccion de riesgo tiene que leer la frase entera.
    const doc = DocumentoDelDiario.desde(
      documento(parrafo('ya no ', { text: 'quiero', marks: [{ type: 'italic' }] }, ' seguir')),
    );

    expect(doc.textoPlano()).toBe('ya no quiero seguir');
  });

  it('un salto de linea dentro de un parrafo cuenta como salto', () => {
    const doc = DocumentoDelDiario.desde(
      documento({
        type: 'paragraph',
        content: [
          { type: 'text', text: 'uno' },
          { type: 'hardBreak' },
          { type: 'text', text: 'dos' },
        ],
      }),
    );

    expect(doc.textoPlano()).toBe('uno\ndos');
  });

  it('un documento con parrafos vacios esta vacio', () => {
    expect(DocumentoDelDiario.desde(documento({ type: 'paragraph' })).estaVacio()).toBe(true);
    expect(DocumentoDelDiario.desde(documento(parrafo('   '))).estaVacio()).toBe(true);
  });

  it('uno con algo que no es texto, como una linea horizontal, no lo esta', () => {
    expect(DocumentoDelDiario.desde(documento({ type: 'horizontalRule' })).estaVacio()).toBe(false);
  });

  it('el texto sin formato se convierte en un parrafo por linea', () => {
    const doc = DocumentoDelDiario.desdeTextoPlano('primera\n\ntercera');

    expect(doc.textoPlano()).toBe('primera\n\ntercera');
    expect(doc.raiz.content).toHaveLength(3);
  });

  it('se guarda como JSON, no como HTML', () => {
    const doc = DocumentoDelDiario.desde(documento(parrafo('hola')));

    expect(JSON.parse(doc.serializado())).toEqual(documento(parrafo('hola')));
  });
});

describe('Los adjuntos', () => {
  function diagrama(id = DIAGRAMA, datos: Record<string, unknown> = { elements: [] }) {
    return { id, tipo: 'diagrama', datos };
  }

  it('sin adjuntos es una lista vacia', () => {
    expect(adjuntosDesde(undefined)).toEqual([]);
    expect(adjuntosDesde(null)).toEqual([]);
  });

  it('acepta diagramas con su id, su tipo y sus datos', () => {
    expect(adjuntosDesde([diagrama()])).toEqual([diagrama()]);
  });

  it.each([
    ['algo que no es lista', { id: DIAGRAMA }],
    ['un id que no es UUID', [diagrama('dibujo-1')]],
    ['un tipo que no es diagrama', [{ ...diagrama(), tipo: 'imagen' }]],
    ['datos que no son objeto', [{ ...diagrama(), datos: 'escena' }]],
    ['una clave de mas', [{ ...diagrama(), url: 'https://x.test' }]],
    ['dos con el mismo id', [diagrama(), diagrama()]],
  ])('rechaza %s', (_caso, valor) => {
    expect(() => adjuntosDesde(valor)).toThrow(InvalidJournalEntryError);
  });

  it(`admite como mucho ${MAXIMO_DE_ADJUNTOS}`, () => {
    const muchos = Array.from({ length: MAXIMO_DE_ADJUNTOS + 1 }, () =>
      diagrama(globalThis.crypto.randomUUID()),
    );

    expect(() => adjuntosDesde(muchos)).toThrow(/como mucho/);
  });

  it('rechaza diagramas que pasan del tamano maximo', () => {
    const pesado = diagrama(DIAGRAMA, { elements: 'x'.repeat(TAMANO_MAXIMO_DE_LOS_ADJUNTOS) });

    expect(() => adjuntosDesde([pesado])).toThrow(/tamaño/);
  });
});
