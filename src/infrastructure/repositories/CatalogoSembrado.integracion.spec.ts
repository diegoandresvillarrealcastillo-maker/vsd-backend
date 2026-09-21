// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { ActivityId } from '../../domain/model/Identifier.js';
import { NivelOrientativo } from '../../domain/model/OrientativeScore.js';
import { PrismaService } from '../persistence/PrismaService.js';

/**
 * El catalogo, comprobado contra la base de verdad.
 *
 * Las categorias y las actividades se siembran con una migracion para que sean
 * **las mismas en los tres ambientes**. Si en PRE hubiera un catalogo y en PROD
 * otro, probar en PRE dejaria de significar algo, y el fallo no daria ningun
 * error: la aplicacion se veria bien y mostraria cosas distintas.
 *
 * Por eso esta comprobacion corre en el CI contra una base creada desde cero.
 */
const URL_BASE = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_BASE === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

/** Lo que el catalogo tiene que traer, venga de donde venga la base. */
const CATEGORIAS = ['Cognicion', 'Bienestar', 'Emociones'];

const ACTIVIDADES = [
  'Parejas de cartas',
  'Secuencia de numeros',
  'Encuentra la diferencia',
  'Como dormiste anoche',
  'La carga de tu semana',
  'Movimiento del dia',
  'Como te sientes hoy',
  'Que te esta pesando',
  'Un momento bueno del dia',
];

interface FilaDeActividad {
  nombre: string;
  categoria: string;
  direccion_escala: string;
  puntaje_maximo: string | null;
  umbrales: { primero: number; segundo: number } | null;
  textos_nivel: Record<string, string> | null;
}

describe.skipIf(URL_BASE === undefined)('Catalogo sembrado en PostgreSQL', () => {
  let prisma: PrismaService;
  let filas: FilaDeActividad[];

  beforeAll(async () => {
    prisma = new PrismaService(URL_BASE ?? '');
    await prisma.onModuleInit();

    // Solo las filas sembradas por la migracion, que llevan un identificador
    // con este prefijo. Sin el filtro, la comprobacion recogeria tambien las
    // actividades que otras pruebas de integracion crean en la misma base, y
    // fallaria por datos que no son el catalogo.
    filas = await prisma.$queryRaw<FilaDeActividad[]>`
      SELECT a."nombre",
             c."nombre" AS categoria,
             a."direccion_escala"::text AS direccion_escala,
             a."puntaje_maximo"::text   AS puntaje_maximo,
             a."umbrales",
             a."textos_nivel"
        FROM "actividad" a
        JOIN "categoria" c ON c."id_categoria" = a."id_categoria"
       WHERE a."id_actividad"::text LIKE '0acd0000-0000-4000-8000-%'
    `;
  });

  afterAll(async () => {
    await prisma?.onModuleDestroy();
  });

  it('las tres categorias estan sembradas', async () => {
    const encontradas = await prisma.$queryRaw<{ nombre: string }[]>`
      SELECT "nombre" FROM "categoria"
    `;
    const nombres = encontradas.map((fila) => fila.nombre);

    for (const categoria of CATEGORIAS) {
      expect(nombres).toContain(categoria);
    }
  });

  it('las nueve actividades estan sembradas, y solo esas', () => {
    const nombres = filas.map((fila) => fila.nombre);

    for (const actividad of ACTIVIDADES) {
      expect(nombres).toContain(actividad);
    }

    // Que sean exactamente nueve importa tanto como que esten: una fila de mas
    // con este prefijo significaria que alguien sembro algo fuera de la
    // migracion, y entonces los ambientes ya no coinciden.
    expect(filas).toHaveLength(ACTIVIDADES.length);
  });

  it('cada actividad se puede construir en el dominio', () => {
    // Es la comprobacion que de verdad importa. Una fila puede estar bien
    // formada para PostgreSQL y ser incoherente para el dominio: declarar que
    // puntua sin decir sobre que maximo, o traer umbrales que no separan tres
    // bandas. Aqui eso sale ahora y no cuando alguien complete la actividad.
    for (const fila of filas) {
      const direccion = fila.direccion_escala as DireccionEscala;
      const maximo = fila.puntaje_maximo === null ? undefined : Number(fila.puntaje_maximo);

      expect(() =>
        Activity.create({
          id: new ActivityId(crypto.randomUUID()),
          nombre: fila.nombre,
          direccionEscala: direccion,
          puntajeMaximo: maximo,
          umbrales: fila.umbrales ?? undefined,
          textosNivel: (fila.textos_nivel as Record<NivelOrientativo, string> | null) ?? undefined,
        }),
      ).not.toThrow();
    }
  });

  it('la actividad que puntua trae texto para los tres niveles', () => {
    const queMiden = filas.filter((fila) => fila.direccion_escala !== DireccionEscala.SIN_PUNTAJE);

    expect(queMiden.length).toBeGreaterThan(0);

    for (const fila of queMiden) {
      // Sin los tres, el dominio devuelve el nombre del nivel tal cual:
      // "requiere_atencion" en pantalla, que es justo el tono que se evita.
      for (const nivel of Object.values(NivelOrientativo)) {
        expect(fila.textos_nivel?.[nivel], `${fila.nombre} sin texto para ${nivel}`).toBeTruthy();
      }
    }
  });

  it('la actividad que no puntua no trae maximo ni textos de nivel', () => {
    const bitacoras = filas.filter((fila) => fila.direccion_escala === DireccionEscala.SIN_PUNTAJE);

    expect(bitacoras.length).toBeGreaterThan(0);

    for (const fila of bitacoras) {
      expect(fila.puntaje_maximo).toBeNull();
      expect(fila.textos_nivel).toBeNull();
    }
  });

  it('ningun texto del catalogo usa lenguaje clinico', () => {
    // VSD Health no diagnostica. Un texto que nombre una condicion convierte
    // una orientacion en un dictamen, y quien lo lea no va a distinguirlo.
    const prohibidas = /depresion|ansiedad|trastorno|patolog|diagnost|enferm|sindrome/iu;

    for (const fila of filas) {
      expect(fila.nombre).not.toMatch(prohibidas);

      for (const texto of Object.values(fila.textos_nivel ?? {})) {
        expect(texto, `"${texto}" en ${fila.nombre}`).not.toMatch(prohibidas);
      }
    }
  });

  it('ningun texto del catalogo ensena el puntaje', () => {
    // Decision del proyecto: el numero no llega a la persona. Lo que ve es el
    // texto. Colarlo en la frase lo devolveria por la puerta de atras.
    for (const fila of filas) {
      for (const texto of Object.values(fila.textos_nivel ?? {})) {
        expect(texto, `"${texto}" en ${fila.nombre}`).not.toMatch(/\d+\s*(puntos?|\/|%)/iu);
      }
    }
  });
});
