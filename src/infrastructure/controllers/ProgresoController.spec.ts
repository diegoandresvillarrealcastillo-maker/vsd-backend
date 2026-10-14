import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { VerificadorFalso, comoUsuario, darDeAlta } from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

const A = 'token-de-A';
const B = 'token-de-B';

/** Secuencias, del catalogo en memoria. Va en Cognicion. */
const SECUENCIAS = '33333333-3333-4333-a333-333333333333';

interface Progreso {
  modulo: string;
  sesiones: number;
  etapa: { numero: number; sesionesHechas: number; sesionesDeLaEtapa: number };
  hoy: {
    id: string;
    nombre: string;
    hecha: boolean;
    frecuencia: { tipo: string; dias?: number[] };
  }[];
}

async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  delete process.env.DATABASE_URL;

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  return app;
}

describe('GET /api/progreso', () => {
  let app: NestExpressApplication;

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  async function progresoDe(token: string): Promise<Progreso[]> {
    const respuesta = await request(servidor())
      .get('/api/progreso')
      .set(...comoUsuario(token))
      .expect(200);

    return respuesta.body as Progreso[];
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(servidor());
  });

  afterAll(async () => {
    await app.close();
  });

  it('sin modulos elegidos responde una lista vacia', async () => {
    await expect(progresoDe(B)).resolves.toEqual([]);
  });

  it('con modulos elegidos, devuelve uno por modulo activo y ninguno mas', async () => {
    await request(servidor())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario(A))
      .send({ modulosActivos: ['bienestar', 'cognicion'] })
      .expect(200);

    const progreso = await progresoDe(A);

    expect(progreso.map((uno) => uno.modulo)).toEqual(['cognicion', 'bienestar']);
    expect(progreso.every((uno) => uno.sesiones === 0)).toBe(true);
    expect(progreso[0]?.etapa).toMatchObject({
      numero: 1,
      sesionesHechas: 0,
      sesionesDeLaEtapa: 5,
    });
  });

  it('hacer una actividad hoy suma una sesion a su modulo y la marca como hecha', async () => {
    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(A))
      .send({
        activityId: SECUENCIAS,
        clientOperationId: '44444444-4444-4444-b444-444444444441',
        score: 8,
        completedAt: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);

    const [cognicion, bienestar] = await progresoDe(A);

    expect(cognicion?.sesiones).toBe(1);
    expect(cognicion?.hoy).toEqual([expect.objectContaining({ id: SECUENCIAS, hecha: true })]);
    // La frecuencia viaja con cada actividad, para la etiqueta del sendero
    // (SCRUM-92). Las del catalogo en memoria son diarias.
    expect(cognicion?.hoy[0]).toMatchObject({ frecuencia: { tipo: 'diaria' } });
    expect(cognicion?.hoy[0]?.frecuencia).not.toHaveProperty('dias');
    expect(bienestar?.sesiones).toBe(0);
  });

  it('una segunda actividad del mismo modulo el mismo dia no vuelve a sumar', async () => {
    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(A))
      .send({
        activityId: SECUENCIAS,
        clientOperationId: '44444444-4444-4444-b444-444444444442',
        score: 6,
        completedAt: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);

    const [cognicion] = await progresoDe(A);

    expect(cognicion?.sesiones).toBe(1);
  });

  it('lo de una persona no cuenta para otra', async () => {
    await expect(progresoDe(B)).resolves.toEqual([]);
  });

  it('no se guarda en cache', async () => {
    const respuesta = await request(servidor())
      .get('/api/progreso')
      .set(...comoUsuario(A))
      .expect(200);

    expect(respuesta.headers['cache-control']).toContain('no-store');
  });

  it('sin token responde 401', async () => {
    await request(servidor()).get('/api/progreso').expect(401);
  });
});

describe('GET /api/progreso/:modulo/historial (SCRUM-184)', () => {
  let app: NestExpressApplication;

  const servidor = () => app.getHttpServer() as Parameters<typeof request>[0];

  interface Hecho {
    id: string;
    actividad: { id: string; nombre: string };
    dia: string;
    hechaEn: string;
  }
  interface Pagina {
    hechos: Hecho[];
    siguientePagina: string | null;
  }

  async function registrar(token: string, n: number, minutosAtras: number): Promise<void> {
    await request(servidor())
      .post('/api/resultados')
      .set(...comoUsuario(token))
      .send({
        activityId: SECUENCIAS,
        clientOperationId: `44444444-4444-4444-b444-0000000184${String(n).padStart(2, '0')}`,
        score: 7,
        // Un texto libre: el historial no lo puede dejar salir.
        metadata: { nota: 'algo muy mio' },
        completedAt: new Date(Date.now() - minutosAtras * 60_000).toISOString(),
      })
      .expect(201);
  }

  function historial(token: string, ruta: string) {
    return request(servidor())
      .get(`/api/progreso/${ruta}`)
      .set(...comoUsuario(token));
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
    await darDeAlta(servidor());

    // Cinco hechos de A, del mas viejo (n=1, hace 50 min) al mas reciente (n=5, hace 10).
    for (let n = 1; n <= 5; n += 1) {
      await registrar(A, n, (6 - n) * 10);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('devuelve lo que hizo en ese modulo, del mas reciente al mas antiguo', async () => {
    const respuesta = await historial(A, 'cognicion/historial').expect(200);
    const pagina = respuesta.body as Pagina;

    expect(pagina.hechos).toHaveLength(5);
    expect(pagina.siguientePagina).toBeNull();
    expect(pagina.hechos[0]).toMatchObject({
      actividad: { id: SECUENCIAS, nombre: 'Secuencias' },
    });

    const horas = pagina.hechos.map((hecho) => Date.parse(hecho.hechaEn));

    expect([...horas].sort((a, b) => b - a)).toEqual(horas);
    expect(pagina.hechos[0]?.dia).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
  });

  it('solo el que hizo y cuando: ni puntaje, ni nivel, ni lo escrito', async () => {
    const respuesta = await historial(A, 'cognicion/historial').expect(200);
    const texto = JSON.stringify(respuesta.body);

    expect(texto).not.toMatch(/score|puntaje|nivel|metadata|algo muy mio/iu);
    expect(Object.keys((respuesta.body as Pagina).hechos[0] ?? {}).sort()).toEqual([
      'actividad',
      'dia',
      'hechaEn',
      'id',
    ]);
  });

  it('por paginas: la siguiente empieza justo despues, sin repetir ni saltar', async () => {
    const vistos: string[] = [];
    let siguiente: string | null = null;
    let paginas = 0;

    do {
      const consulta: string =
        siguiente === null ? 'limite=2' : `limite=2&pagina=${encodeURIComponent(siguiente)}`;
      const respuesta = await historial(A, `cognicion/historial?${consulta}`).expect(200);
      const pagina = respuesta.body as Pagina;

      vistos.push(...pagina.hechos.map((hecho) => hecho.id));
      siguiente = pagina.siguientePagina;
      paginas += 1;
    } while (siguiente !== null && paginas < 10);

    expect(paginas).toBe(3);
    expect(vistos).toHaveLength(5);
    expect(new Set(vistos).size).toBe(5);
  });

  it('un modulo sin nada hecho responde vacio, no un error', async () => {
    const respuesta = await historial(A, 'bienestar/historial').expect(200);

    expect(respuesta.body).toEqual({ hechos: [], siguientePagina: null });
  });

  it('lo de una persona no aparece en el historial de otra', async () => {
    const respuesta = await historial(B, 'cognicion/historial').expect(200);

    expect(respuesta.body).toEqual({ hechos: [], siguientePagina: null });
  });

  it('no se guarda en cache', async () => {
    const respuesta = await historial(A, 'cognicion/historial').expect(200);

    expect(respuesta.headers['cache-control']).toContain('no-store');
  });

  it.each([
    ['un modulo que no existe', 'astrologia/historial'],
    ['un limite en cero', 'cognicion/historial?limite=0'],
    ['un limite de mas', 'cognicion/historial?limite=51'],
    ['un limite que no es un numero', 'cognicion/historial?limite=muchos'],
    ['una pagina que no es de este sistema', 'cognicion/historial?pagina=hola-mundo'],
    ['un campo que no existe', 'cognicion/historial?desde=2026-10-01'],
  ])('%s responde 400', async (_motivo, ruta) => {
    await historial(A, ruta).expect(400);
  });

  it('una pagina bien formada pero inventada responde 400 y no repite lo que mando', async () => {
    const inventada = Buffer.from('no-es-una-fecha|no-es-un-id').toString('base64url');

    const respuesta = await historial(A, `cognicion/historial?pagina=${inventada}`).expect(400);

    expect(respuesta.body).toMatchObject({ codigo: 'PAGINA_DEL_HISTORIAL_INVALIDA' });
    expect(JSON.stringify(respuesta.body)).not.toContain(inventada);
  });

  it('sin token responde 401', async () => {
    await request(servidor()).get('/api/progreso/cognicion/historial').expect(401);
  });
});
