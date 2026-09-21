// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { DireccionEscala } from '../../domain/model/Activity.js';
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

    expect(nombres).toContain('Cognicion');
    expect(nombres).toContain('Bienestar');
    expect(nombres).toContain('Emociones');
  });

  it('cada categoria llega con sus actividades dentro', async () => {
    const catalogo = await repositorio.listarCatalogo();
    const cognicion = catalogo.find((categoria) => categoria.nombre === 'Cognicion');

    expect(cognicion?.actividades.map((a) => a.nombre)).toEqual([
      'Encuentra la diferencia',
      'Parejas de cartas',
      'Secuencia de numeros',
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
    const bitacora = todas.find((actividad) => actividad.nombre === 'Movimiento del dia');

    expect(parejas?.tipo).toBe('juego');
    expect(parejas?.descripcion).toBeTruthy();
    expect(parejas?.direccionEscala).toBe(DireccionEscala.MAYOR_ES_MEJOR);

    // La que no puntua tiene que llegar como tal: de eso depende que la
    // pantalla no prometa un resultado que no va a existir.
    expect(bitacora?.puntua()).toBe(false);
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
