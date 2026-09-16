// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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

  it('las lineas de atencion estan sembradas', async () => {
    const lineas = await repositorio.lineasDeAtencion();
    const titulos = lineas.map((linea) => linea.titulo);

    expect(titulos).toContain('Linea 192, opcion 4');
    expect(titulos).toContain('Linea 123');
    expect(titulos).toContain('Linea 106, el poder de ser escuchado');
  });

  it('la primera que se ve sirve en todo el pais', async () => {
    // La Linea 106 se marca desde Bogota, y la sede principal de la
    // Universidad de Cundinamarca esta en Fusagasuga. Si la lista llegara con
    // ese numero delante, a la mayoria de la gente le estariamos dando un
    // telefono que no contesta.
    const lineas = await repositorio.lineasDeAtencion();

    expect(lineas[0]?.cobertura).toBe('nacional');
  });

  it('todas las lineas son de tipo contacto', async () => {
    const lineas = await repositorio.lineasDeAtencion();

    expect(lineas.every((linea) => linea.esLineaDeAtencion())).toBe(true);
  });

  it('hay contenido para cada tema que el asistente reconoce', async () => {
    for (const tema of ['resultado', 'sueno', 'animo', 'ayuda']) {
      const recursos = await repositorio.porTema(tema);

      expect(recursos.length).toBeGreaterThan(0);
    }
  });

  it('el catalogo en memoria dice lo mismo que la base', async () => {
    // El adaptador en memoria es lo que responde cuando la aplicacion corre
    // sin base de datos, y lo que llevara el dispositivo cuando el asistente
    // viva tambien en la PWA. Que las dos fuentes se separen significaria que
    // el mismo telefono se ve distinto segun haya conexion o no.
    const enMemoria = await new InMemoryRecursoApoyoRepository().lineasDeAtencion();
    const enLaBase = await repositorio.lineasDeAtencion();

    const resumir = (recursos: readonly { id: string; titulo: string }[]) =>
      recursos.map((recurso) => `${recurso.id} ${recurso.titulo}`).sort();

    expect(resumir(enMemoria)).toEqual(resumir(enLaBase));
  });

  it('ningun texto de la base usa terminologia diagnostica', async () => {
    // Los textos viven en la base para poder cambiarlos sin desplegar. Eso
    // tambien significa que pueden cambiarse sin que los vea un programador,
    // asi que la regla se comprueba aqui y no solo sobre el codigo.
    const prohibidas = /depresion|ansiedad|trastorno|patolog|diagnost|enferm|sindrome/iu;

    const todos = [
      ...(await repositorio.lineasDeAtencion()),
      ...(await repositorio.porTema('resultado')),
      ...(await repositorio.porTema('sueno')),
      ...(await repositorio.porTema('animo')),
      ...(await repositorio.porTema('ayuda')),
    ];

    for (const recurso of todos) {
      expect(`${recurso.titulo} ${recurso.descripcion ?? ''}`).not.toMatch(prohibidas);
    }
  });
});
