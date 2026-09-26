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

/**
 * Lo que el catalogo tiene que traer, venga de donde venga la base.
 *
 * Estos nombres van con tildes porque son texto de pantalla, no codigo. La
 * migracion `20260926120000_tildes_en_los_textos_visibles` los corrigio, y la
 * comprobacion del final de este archivo impide que vuelvan atras.
 */
const CATEGORIAS = ['Cognición', 'Bienestar', 'Emociones'];

const ACTIVIDADES = [
  'Parejas de cartas',
  'Secuencia de números',
  'Encuentra la diferencia',
  'Cómo dormiste anoche',
  'La carga de tu semana',
  'Movimiento del día',
  'Cómo te sientes hoy',
  'Qué te está pesando',
  'Un momento bueno del día',
];

/**
 * Palabras que en castellano solo existen con tilde.
 *
 * La lista es corta a proposito: solo entra lo que no tiene ninguna forma valida
 * sin acento, para que la comprobacion no de falsos positivos. "como" y "que",
 * por ejemplo, se quedan fuera aunque aqui casi siempre vayan acentuadas,
 * porque tambien son palabras correctas sin tilde.
 *
 * "ano" merece mencion aparte: sin la ene no es una falta de ortografia, es otra
 * palabra, y en una aplicacion de bienestar aparecer en pantalla seria bastante
 * mas que un descuido.
 */
const SIN_TILDE =
  /\b(numero|numeros|dia|dias|pais|tambien|atencion|orientacion|explicacion|solucion|descripcion|concentracion|habito|habitos|psicologico|psicologica|facil|faciles|ultimo|ultima|proximo|segun|ano|pequena|manana)\b/iu;

interface FilaDeActividad {
  nombre: string;
  descripcion: string | null;
  tipo: string;
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
             a."descripcion",
             a."tipo",
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
    // Se filtra por la escala y no por el tipo, que no son lo mismo: hay
    // bitacoras que si puntuan. Llamar "bitacoras" a este grupo seria darle un
    // nombre que no le corresponde.
    const sinValorar = filas.filter(
      (fila) => fila.direccion_escala === DireccionEscala.SIN_PUNTAJE,
    );

    expect(sinValorar.length).toBeGreaterThan(0);

    for (const fila of sinValorar) {
      expect(fila.puntaje_maximo).toBeNull();
      expect(fila.textos_nivel).toBeNull();
    }
  });

  it('que una actividad puntue no depende de su tipo', () => {
    // Es la comprobacion que impide volver a atar las dos columnas. Durante un
    // tiempo la documentacion afirmo que las bitacoras no producen nivel, y el
    // contraejemplo estaba sembrado desde el principio: la del sueno si.
    //
    // Importa para el motor de actividades. Decidir si se muestra resultado
    // mirando el tipo dejaria sin su nivel a quien registre el sueno, y no
    // daria ningun error.
    const bitacoras = filas.filter((fila) => fila.tipo === 'bitacora');

    expect(bitacoras.length).toBeGreaterThan(1);

    const puntuan = bitacoras.filter(
      (fila) => fila.direccion_escala !== DireccionEscala.SIN_PUNTAJE,
    );

    expect(puntuan.length).toBeGreaterThan(0);
    expect(puntuan.length).toBeLessThan(bitacoras.length);
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

  it('todo el texto visible del catalogo esta bien escrito', async () => {
    // Se sembro sin tildes por arrastrar al contenido la costumbre del codigo,
    // donde no llevarlas evita problemas de codificacion entre editores. Pero
    // esto no es codigo: es lo que la persona lee. La comprobacion esta aqui
    // para que la correccion no dependa de que nadie se despiste otra vez.
    const categorias = await prisma.$queryRaw<{ nombre: string; descripcion: string | null }[]>`
      SELECT "nombre", "descripcion" FROM "categoria"
       WHERE "nombre" = ANY(${CATEGORIAS})
    `;

    const visibles = [
      ...categorias.flatMap((fila) => [fila.nombre, fila.descripcion ?? '']),
      ...filas.flatMap((fila) => [
        fila.nombre,
        fila.descripcion ?? '',
        ...Object.values(fila.textos_nivel ?? {}),
      ]),
    ];

    for (const texto of visibles) {
      expect(texto, `"${texto}" lleva una palabra sin tilde`).not.toMatch(SIN_TILDE);
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
