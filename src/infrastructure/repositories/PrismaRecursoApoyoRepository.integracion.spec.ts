// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PAISES_CON_LINEAS } from '../../domain/model/PaisDeAyuda.js';
import type { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryRecursoApoyoRepository } from './InMemoryRecursoApoyoRepository.js';
import { PrismaRecursoApoyoRepository } from './PrismaRecursoApoyoRepository.js';

/**
 * Las lineas de atencion, comprobadas contra la base de verdad.
 *
 * Estas filas se siembran con una migracion porque el asistente las devuelve
 * cada vez que detecta una senal de riesgo. Si faltaran, respondería una lista
 * vacia en el unico momento en el que no puede fallar, y sin dar ningun error.
 *
 * De ahi que esta comprobacion exista y corra en el CI contra una base creada
 * desde cero en cada ejecucion.
 */
const URL_BASE = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_BASE === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

/** Todo lo que se ve de una linea, para comparar dos fuentes campo por campo. */
function ficha(linea: RecursoApoyo): Record<string, string | undefined> {
  return {
    id: linea.id,
    titulo: linea.titulo,
    descripcion: linea.descripcion,
    cobertura: linea.cobertura,
    enlace: linea.enlace,
    pais: linea.pais,
    fuente: linea.fuente,
    verificadoEl: linea.verificadoEl,
  };
}

function porId(lineas: readonly RecursoApoyo[]): Record<string, string | undefined>[] {
  return lineas.map(ficha).sort((uno, otro) => (uno['id'] ?? '').localeCompare(otro['id'] ?? ''));
}

describe.skipIf(URL_BASE === undefined)('Recursos de apoyo en PostgreSQL', () => {
  let prisma: PrismaService;
  let repositorio: PrismaRecursoApoyoRepository;

  beforeAll(async () => {
    prisma = new PrismaService(URL_BASE ?? '');
    await prisma.onModuleInit();
    repositorio = new PrismaRecursoApoyoRepository(prisma);
  });

  afterAll(async () => {
    await prisma?.onModuleDestroy();
  });

  it('las lineas de Colombia estan sembradas', async () => {
    const lineas = await repositorio.lineasDeAtencion('CO');
    const titulos = lineas.map((linea) => linea.titulo);

    expect(titulos).toContain('Línea 192, opción 4');
    expect(titulos).toContain('Línea 123');
    expect(titulos).toContain('Línea 106, el poder de ser escuchado');
  });

  it('la primera que se ve sirve en todo el pais', async () => {
    // La Linea 106 se marca desde Bogota, y la sede principal de la
    // Universidad de Cundinamarca esta en Fusagasuga. Si la lista llegara con
    // ese numero delante, a la mayoria de la gente le estariamos dando un
    // telefono que no contesta.
    const lineas = await repositorio.lineasDeAtencion('CO');

    expect(lineas[0]?.cobertura).toBe('nacional');
  });

  it('todas las lineas son de tipo contacto', async () => {
    for (const pais of [...PAISES_CON_LINEAS, undefined]) {
      const lineas = await repositorio.lineasDeAtencion(pais);

      expect(lineas.every((linea) => linea.esLineaDeAtencion())).toBe(true);
    }
  });

  describe('las lineas segun el pais (SCRUM-124)', () => {
    it.each(PAISES_CON_LINEAS)('%s recibe sus lineas y solo las suyas', async (pais) => {
      const lineas = await repositorio.lineasDeAtencion(pais);

      expect(lineas.length).toBeGreaterThan(0);
      expect(lineas.every((linea) => linea.pais === pais)).toBe(true);
    });

    it('Mexico, Espana y Estados Unidos no reciben ni una linea de Colombia', async () => {
      const colombianas = (await repositorio.lineasDeAtencion('CO')).map((linea) => linea.id);

      for (const pais of ['MX', 'ES', 'US']) {
        const ids = (await repositorio.lineasDeAtencion(pais)).map((linea) => linea.id);

        expect(ids.filter((id) => colombianas.includes(id))).toEqual([]);
      }
    });

    it.each([undefined, 'PE', 'CL', 'FR', 'ZZ'])(
      'quien no tiene un pais con lineas verificadas (%s) recibe el directorio y ningun telefono de otro pais',
      async (pais) => {
        const lineas = await repositorio.lineasDeAtencion(pais);

        expect(lineas.map((linea) => linea.titulo)).toEqual([
          'Directorio internacional de líneas de ayuda',
        ]);
        expect(lineas.every((linea) => linea.pais === undefined)).toBe(true);
        expect(lineas[0]?.cobertura).toBe('internacional');
      },
    );

    it('el directorio no lleva ningun numero de telefono', async () => {
      // No se sabe cual seria el de esa persona: darle uno, cualquiera, es el
      // error que este ticket existe para evitar.
      const [directorio] = await repositorio.lineasDeAtencion(undefined);

      expect(directorio?.descripcion).not.toMatch(/\d/u);
    });

    it('cada linea de la base tiene fuente y fecha de verificacion', async () => {
      for (const pais of [...PAISES_CON_LINEAS, undefined]) {
        for (const linea of await repositorio.lineasDeAtencion(pais)) {
          expect(linea.fuente, linea.titulo).toMatch(/^https:\/\//u);
          expect(linea.verificadoEl, linea.titulo).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
        }
      }
    });

    it('la base no deja entrar un contacto sin fuente ni fecha', async () => {
      // Es la forma de que "cada linea tiene fuente y fecha" no dependa de
      // acordarse: el dato falta y la tabla dice que no.
      await expect(
        prisma.$executeRawUnsafe(
          `INSERT INTO "recurso_apoyo" ("id_recurso", "titulo", "tipo", "pais")
           VALUES ('99999999-0000-4000-8000-000000000001', 'Sin fuente', 'contacto', 'CO')`,
        ),
      ).rejects.toThrow(/recurso_apoyo_contacto_con_fuente/u);

      await expect(
        prisma.$executeRawUnsafe(
          `INSERT INTO "recurso_apoyo" ("id_recurso", "titulo", "tipo", "pais", "fuente")
           VALUES ('99999999-0000-4000-8000-000000000002', 'Sin fecha', 'contacto', 'CO', 'https://x.test')`,
        ),
      ).rejects.toThrow(/recurso_apoyo_contacto_con_fuente/u);
    });

    it('la base no deja entrar un pais que no sea un codigo de dos letras', async () => {
      await expect(
        prisma.$executeRawUnsafe(
          `INSERT INTO "recurso_apoyo" ("id_recurso", "titulo", "tipo", "pais", "fuente", "verificado_el")
           VALUES ('99999999-0000-4000-8000-000000000003', 'Pais mal escrito', 'contacto', 'co', 'https://x.test', DATE '2026-10-06')`,
        ),
      ).rejects.toThrow(/recurso_apoyo_pais_iso/u);
    });

    it('el catalogo en memoria dice lo mismo que la base, campo por campo', async () => {
      // El adaptador en memoria es lo que responde cuando la aplicacion corre
      // sin base de datos, y lo que llevara el dispositivo cuando el asistente
      // viva tambien en la PWA. Que las dos fuentes se separen significaria que
      // el mismo telefono se ve distinto segun haya conexion o no.
      const enMemoria = new InMemoryRecursoApoyoRepository();

      for (const pais of [...PAISES_CON_LINEAS, undefined, 'PE']) {
        expect(porId(await enMemoria.lineasDeAtencion(pais)), String(pais)).toEqual(
          porId(await repositorio.lineasDeAtencion(pais)),
        );
      }
    });
  });

  it('hay contenido para los temas que lo tienen', async () => {
    for (const tema of ['resultado', 'sueno', 'animo']) {
      const recursos = await repositorio.porTema(tema);

      expect(recursos.length).toBeGreaterThan(0);
    }
  });

  it('un tema sin contenido devuelve vacio y no falla', async () => {
    // "Donde busco ayuda" no tiene lecturas propias: lo que corresponde
    // responder ahi son los telefonos, y de eso se encarga el asistente
    // cayendo a las lineas de atencion. Este adaptador solo tiene que decir
    // la verdad, que es que no hay nada con ese tema.
    expect(await repositorio.porTema('ayuda')).toEqual([]);
  });

  it('ningun texto de la base usa terminologia diagnostica', async () => {
    // Los textos viven en la base para poder cambiarlos sin desplegar. Eso
    // tambien significa que pueden cambiarse sin que los vea un programador,
    // asi que la regla se comprueba aqui y no solo sobre el codigo.
    const prohibidas = /depresion|ansiedad|trastorno|patolog|diagnost|enferm|sindrome/iu;

    const todos = [
      ...(
        await Promise.all(
          [...PAISES_CON_LINEAS, undefined].map((p) => repositorio.lineasDeAtencion(p)),
        )
      ).flat(),
      ...(await repositorio.porTema('resultado')),
      ...(await repositorio.porTema('sueno')),
      ...(await repositorio.porTema('animo')),
    ];

    for (const recurso of todos) {
      expect(`${recurso.titulo} ${recurso.descripcion ?? ''}`).not.toMatch(prohibidas);
    }
  });
});
