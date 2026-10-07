import { describe, expect, it } from 'vitest';
import { PAISES_CON_LINEAS } from '../../domain/model/PaisDeAyuda.js';
import {
  catalogoDeLineas,
  InMemoryRecursoApoyoRepository,
} from './InMemoryRecursoApoyoRepository.js';

/**
 * El catalogo de lineas de ayuda por pais (SCRUM-124), sin base de datos.
 *
 * Es el mismo que siembra la migracion `20261009120000_lineas_de_ayuda_por_pais`,
 * y una prueba de integracion comprueba que dicen lo mismo, campo por campo.
 * Aqui se comprueban sus reglas, que son las que importan cuando alguien esta
 * mal y la aplicacion tiene que acertar con el telefono.
 */
describe('InMemoryRecursoApoyoRepository: lineas por pais', () => {
  const repositorio = new InMemoryRecursoApoyoRepository();

  it('cada linea del catalogo tiene fuente y fecha de verificacion', () => {
    for (const linea of catalogoDeLineas()) {
      expect(linea.fuente, linea.titulo).toMatch(/^https:\/\//u);
      expect(linea.verificadoEl, linea.titulo).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
    }
  });

  it('ninguna fecha de verificacion esta en el futuro', () => {
    // Una fecha que todavia no llego es una verificacion que nadie hizo.
    const hoy = new Date().toISOString().slice(0, 10);

    for (const linea of catalogoDeLineas()) {
      expect((linea.verificadoEl ?? '') <= hoy, linea.titulo).toBe(true);
    }
  });

  it('los paises con lineas son exactamente los que sabe reconocer la zona horaria', () => {
    // Un pais en la lista de zonas sin lineas recibiria el directorio sin
    // motivo; un pais con lineas y sin zonas no las recibiria nunca.
    const conLineas = new Set(
      catalogoDeLineas()
        .map((linea) => linea.pais)
        .filter((pais): pais is string => pais !== undefined),
    );

    expect([...conLineas].sort()).toEqual([...PAISES_CON_LINEAS].sort());
  });

  it.each(PAISES_CON_LINEAS)('%s recibe sus lineas y solo las suyas', async (pais) => {
    const lineas = await repositorio.lineasDeAtencion(pais);

    expect(lineas.length).toBeGreaterThan(0);
    expect(lineas.every((linea) => linea.pais === pais)).toBe(true);
    expect(lineas.every((linea) => linea.esLineaDeAtencion())).toBe(true);
  });

  it.each(PAISES_CON_LINEAS)('%s tiene un numero de emergencias', async (pais) => {
    const lineas = await repositorio.lineasDeAtencion(pais);

    expect(
      lineas.some((linea) => /riesgo inmediato para la vida/u.test(linea.descripcion ?? '')),
    ).toBe(true);
  });

  it('Colombia conserva sus tres lineas y la nacional va primero', async () => {
    const lineas = await repositorio.lineasDeAtencion('CO');

    expect(lineas.map((linea) => linea.titulo)).toEqual([
      'Línea 192, opción 4',
      'Línea 123',
      'Línea 106, el poder de ser escuchado',
    ]);
    expect(lineas[0]?.cobertura).toBe('nacional');
    expect(lineas[2]?.cobertura).toBe('bogota');
  });

  it('un pais nunca recibe el telefono de otro', async () => {
    const porPais = new Map(
      await Promise.all(
        PAISES_CON_LINEAS.map(
          async (pais) =>
            [pais, (await repositorio.lineasDeAtencion(pais)).map((linea) => linea.id)] as const,
        ),
      ),
    );

    for (const [pais, ids] of porPais) {
      for (const [otro, idsDelOtro] of porPais) {
        if (otro !== pais) {
          expect(
            ids.filter((id) => idsDelOtro.includes(id)),
            `${pais} ve las de ${otro}`,
          ).toEqual([]);
        }
      }
    }
  });

  it.each([undefined, 'PE', 'CL', 'FR', 'ZZ'])(
    'quien no tiene pais con lineas (%s) recibe solo el directorio internacional',
    async (pais) => {
      const lineas = await repositorio.lineasDeAtencion(pais);

      expect(lineas.map((linea) => linea.titulo)).toEqual([
        'Directorio internacional de líneas de ayuda',
      ]);
      expect(lineas[0]?.pais).toBeUndefined();
      expect(lineas[0]?.cobertura).toBe('internacional');
      expect(lineas[0]?.enlace).toBe('https://findahelpline.com/');
    },
  );

  it('el directorio no lleva ningun numero de telefono', async () => {
    // No se sabe cual seria el de esa persona. Darle uno, cualquiera, es el
    // error que este ticket existe para evitar.
    const [directorio] = await repositorio.lineasDeAtencion(undefined);

    expect(directorio?.descripcion).not.toMatch(/\d/u);
  });

  it('el directorio le dice a la persona que no tenemos sus lineas, sin disimular', async () => {
    const [directorio] = await repositorio.lineasDeAtencion(undefined);

    expect(directorio?.descripcion).toMatch(/Todavía no tenemos verificadas/u);
    expect(directorio?.descripcion).toMatch(/emergencias del lugar donde estás/u);
  });

  it('ningun texto del catalogo usa terminologia diagnostica', () => {
    const prohibidas = /depresion|ansiedad|trastorno|patolog|diagnost|enferm|sindrome/iu;

    for (const linea of catalogoDeLineas()) {
      expect(`${linea.titulo} ${linea.descripcion ?? ''}`).not.toMatch(prohibidas);
    }
  });

  it('los textos llevan sus tildes y enes', () => {
    // Es lo que alguien lee en el peor momento: "Linea" sin tilde se nota.
    for (const linea of catalogoDeLineas()) {
      expect(linea.titulo, linea.titulo).not.toMatch(/\bLinea\b/u);
      expect(linea.descripcion ?? '', linea.titulo).not.toMatch(
        /\b(linea|telefono|numero|organizacion|atencion|asociacion|prevencion)\b/iu,
      );
    }
  });
});
