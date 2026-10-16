// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { DireccionEscala } from '../../domain/model/Activity.js';
import { ActivityId } from '../../domain/model/Identifier.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaActivityRepository } from './PrismaActivityRepository.js';

/**
 * El catalogo leido de PostgreSQL de verdad.
 *
 * La migracion siembra las filas y otra prueba comprueba que estan. Lo que se
 * comprueba aqui es distinto: que el adaptador las convierta en entidades del
 * dominio sin perder nada por el camino, y que respete las dos reglas que
 * tiene —ordenar, y no ofrecer lo que esta retirado.
 */
const URL_BASE = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_BASE === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

describe.skipIf(URL_BASE === undefined)('Catalogo leido de PostgreSQL', () => {
  let prisma: PrismaService;
  let repositorio: PrismaActivityRepository;

  beforeAll(async () => {
    prisma = new PrismaService(URL_BASE ?? '');
    await prisma.onModuleInit();
    repositorio = new PrismaActivityRepository(prisma);
  });

  afterAll(async () => {
    await prisma?.onModuleDestroy();
  });

  it('trae las tres categorias sembradas', async () => {
    const catalogo = await repositorio.listarCatalogo();
    const nombres = catalogo.map((categoria) => categoria.nombre);

    expect(nombres).toContain('Cognición');
    expect(nombres).toContain('Bienestar');
    expect(nombres).toContain('Emociones');
  });

  it('cada categoria llega con sus actividades dentro', async () => {
    const catalogo = await repositorio.listarCatalogo();
    const cognicion = catalogo.find((categoria) => categoria.nombre === 'Cognición');

    expect(cognicion?.actividades.map((a) => a.nombre)).toEqual([
      'Encuentra la diferencia',
      'Parejas de cartas',
      'Secuencia de números',
    ]);
  });

  it('las categorias vienen ordenadas por nombre', async () => {
    // El orden se decide aqui, en la consulta, y no en quien lo pinta. Si
    // dependiera del cliente, dos clientes mostrarian cosas distintas y esa
    // diferencia nadie la nota hasta que alguien pregunta por que.
    const catalogo = await repositorio.listarCatalogo();
    const nombres = catalogo.map((categoria) => categoria.nombre);

    expect(nombres).toEqual([...nombres].sort((a, b) => a.localeCompare(b)));
  });

  it('conserva el tipo, la descripcion y la direccion de la escala', async () => {
    const catalogo = await repositorio.listarCatalogo();
    const todas = catalogo.flatMap((categoria) => categoria.actividades);

    const parejas = todas.find((actividad) => actividad.nombre === 'Parejas de cartas');
    const bitacora = todas.find((actividad) => actividad.nombre === 'Movimiento del día');

    expect(parejas?.tipo).toBe('juego');
    expect(parejas?.descripcion).toBeTruthy();
    expect(parejas?.direccionEscala).toBe(DireccionEscala.MAYOR_ES_MEJOR);

    // La que no puntua tiene que llegar como tal: de eso depende que la
    // pantalla no prometa un resultado que no va a existir.
    expect(bitacora?.puntua()).toBe(false);
  });

  describe('el motor y la frecuencia rotativa de una mecanica (SCRUM-204, ADR 0030)', () => {
    // Filas propias, con identificadores que ninguna otra suite usa, y que se borran al terminar.
    const CATEGORIA = '20450000-0000-4000-8000-000000000001';
    const SIN_MOTOR = '20450000-0000-4000-8000-000000000002';
    const CON_MOTOR = '20450000-0000-4000-8000-000000000003';
    const ROTATIVA = '20450000-0000-4000-8000-000000000004';
    const SEMANAL = '20450000-0000-4000-8000-000000000005';

    beforeAll(async () => {
      await prisma.categoria.create({ data: { id: CATEGORIA, nombre: 'Pruebas del motor' } });

      const base = {
        idCategoria: CATEGORIA,
        tipo: 'juego',
        direccionEscala: 'sin_puntaje',
      } as const;

      await prisma.actividad.createMany({
        data: [
          { ...base, id: SIN_MOTOR, nombre: 'Sin motor' },
          { ...base, id: CON_MOTOR, nombre: 'Con motor', motor: 'guia_paso_a_paso' },
          { ...base, id: ROTATIVA, nombre: 'Rotativa', frecuencia: 'rotativa' },
          { ...base, id: SEMANAL, nombre: 'Semanal', frecuencia: 'semanal', diasSemana: [2, 4] },
        ],
      });
    });

    afterAll(async () => {
      await prisma.actividad.deleteMany({ where: { idCategoria: CATEGORIA } });
      await prisma.categoria.deleteMany({ where: { id: CATEGORIA } });
    });

    it('una mecanica sin motor llega sin motor', async () => {
      const actividad = await repositorio.findById(new ActivityId(SIN_MOTOR));

      expect(actividad?.motor).toBeUndefined();
    });

    it('conserva el motor de la mecanica', async () => {
      const actividad = await repositorio.findById(new ActivityId(CON_MOTOR));

      expect(actividad?.motor).toBe('guia_paso_a_paso');
    });

    it('una frecuencia rotativa llega como rotativa y no como diaria', async () => {
      const actividad = await repositorio.findById(new ActivityId(ROTATIVA));

      expect(actividad?.frecuencia).toEqual({ tipo: 'rotativa' });
    });

    it('las demas frecuencias llegan como antes', async () => {
      const semanal = await repositorio.findById(new ActivityId(SEMANAL));
      const diaria = await repositorio.findById(new ActivityId(SIN_MOTOR));

      expect(semanal?.frecuencia).toEqual({ tipo: 'semanal', dias: [2, 4] });
      expect(diaria?.frecuencia).toEqual({ tipo: 'diaria' });
    });

    it('las nueve actividades del catalogo llegan; solo las cinco de la Fase 0 traen motor', async () => {
      const catalogo = await repositorio.listarCatalogo();
      // Solo las sembradas por la migracion, que llevan este prefijo: otras suites comparten la
      // base y pueden dejar actividades suyas (CatalogoSembrado hace lo mismo).
      const nueve = catalogo
        .flatMap((categoria) => categoria.actividades)
        .filter((actividad) => actividad.id.value.startsWith('0acd0000-'));

      expect(nueve).toHaveLength(9);
      // Los identificadores de la migracion del catalogo inicial: 2 secuencia, 3 diferencia, 5 carga,
      // 7 como te sientes y 9 momento bueno. Las otras cuatro son pantallas propias.
      expect(
        Object.fromEntries(
          nueve.map((actividad) => [actividad.id.value.slice(-1), actividad.motor ?? null]),
        ),
      ).toEqual({
        '1': null,
        '2': 'secuencia',
        '3': 'tocar_el_objetivo',
        '4': null,
        '5': 'cuestionario_corto',
        '6': null,
        '7': 'cuestionario_corto',
        '8': null,
        '9': 'escritura_breve',
      });
    });
  });

  it('no ofrece una actividad retirada', async () => {
    // El administrador la desactiva por algun motivo. Ensenarla y despues no
    // dejar registrar el resultado es peor que no ensenarla.
    const nombre = 'Parejas de cartas';

    await prisma.actividad.updateMany({ where: { nombre }, data: { estado: false } });

    try {
      const catalogo = await repositorio.listarCatalogo();
      const todas = catalogo.flatMap((categoria) => categoria.actividades.map((a) => a.nombre));

      expect(todas).not.toContain(nombre);
    } finally {
      // Se restaura pase lo que pase: una prueba que deja la base distinta de
      // como la encontro hace fallar a la siguiente por un motivo que no es
      // el suyo.
      await prisma.actividad.updateMany({ where: { nombre }, data: { estado: true } });
    }
  });
});
