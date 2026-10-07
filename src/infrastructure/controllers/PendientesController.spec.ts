import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { VerificadorFalso, comoUsuario, darDeAlta } from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

/**
 * `/api/pendientes` por HTTP, con el semaforo en memoria (SCRUM-97). El
 * aislamiento en la base se prueba en `PrismaPendientesRepository.integracion`.
 */
const A = 'token-de-A';
const B = 'token-de-B';

let contador = 0;
function operacion(): string {
  contador += 1;

  return '97979797-0000-4000-8000-' + String(contador).padStart(12, '0');
}

function cuerpoDe(respuesta: request.Response): Record<string, unknown> {
  return respuesta.body as Record<string, unknown>;
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
  await darDeAlta(app.getHttpServer());

  return app;
}

describe('/api/pendientes', () => {
  let app: NestExpressApplication;

  function crear(token: string, cuerpo: Record<string, unknown>): request.Test {
    return request(app.getHttpServer())
      .post('/api/pendientes')
      .set(...comoUsuario(token))
      .send(cuerpo);
  }

  function editar(token: string, id: string, cuerpo: Record<string, unknown>): request.Test {
    return request(app.getHttpServer())
      .patch(`/api/pendientes/${id}`)
      .set(...comoUsuario(token))
      .send(cuerpo);
  }

  function consultar(token: string): request.Test {
    return request(app.getHttpServer())
      .get('/api/pendientes')
      .set(...comoUsuario(token));
  }

  async function nuevo(token = A, nivel = 'urgente'): Promise<string> {
    const respuesta = await crear(token, {
      clientOperationId: operacion(),
      texto: 'Pedir la cita médica',
      nivel,
    }).expect(201);

    return String(cuerpoDe(respuesta)['id']);
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('anota un pendiente y lo devuelve en el semaforo', async () => {
    const id = await nuevo();

    const respuesta = await consultar(A).expect(200);
    const { pendientes, recordatorio } = cuerpoDe(respuesta) as {
      pendientes: Record<string, unknown>[];
      recordatorio: unknown;
    };

    expect(pendientes.find((uno) => uno['id'] === id)).toMatchObject({
      texto: 'Pedir la cita médica',
      nivel: 'urgente',
      hecho: false,
      posponerHasta: null,
    });
    expect(recordatorio).toBeNull();
    expect(respuesta.headers['cache-control']).toBe('no-store');
  });

  it('un reintento con la misma operacion devuelve el mismo', async () => {
    const cuerpo = { clientOperationId: operacion(), texto: 'Una vez', nivel: 'prioridad' };

    const uno = await crear(A, cuerpo).expect(201);
    const otro = await crear(A, cuerpo).expect(201);

    expect(cuerpoDe(otro)['id']).toBe(cuerpoDe(uno)['id']);
  });

  it.each([
    ['un nivel que no existe', { texto: 'x', nivel: 'critico' }],
    ['un texto vacio', { texto: '   ', nivel: 'urgente' }],
    ['un texto de mas de 280', { texto: 'a'.repeat(281), nivel: 'urgente' }],
    ['un campo que no existe', { texto: 'x', nivel: 'urgente', idUsuario: 'otra' }],
  ])('rechaza %s con 400', async (_caso, cuerpo) => {
    await crear(A, { clientOperationId: operacion(), ...cuerpo }).expect(400);
  });

  it('marcarlo hecho, cambiar de nivel y posponer', async () => {
    const id = await nuevo(A, 'aplazable');
    const enUnaSemana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const respuesta = await editar(A, id, {
      nivel: 'prioridad',
      posponerHasta: enUnaSemana,
    }).expect(200);

    expect(cuerpoDe(respuesta)).toMatchObject({ nivel: 'prioridad', posponerHasta: enUnaSemana });

    const hecho = await editar(A, id, { hecho: true, posponerHasta: null }).expect(200);

    expect(cuerpoDe(hecho)).toMatchObject({ hecho: true, posponerHasta: null });
  });

  describe('la fecha limite, opcional (SCRUM-119)', () => {
    it('sale como null cuando no se puso', async () => {
      const id = await nuevo();

      const { pendientes } = cuerpoDe(await consultar(A).expect(200)) as {
        pendientes: Record<string, unknown>[];
      };

      expect(pendientes.find((uno) => uno['id'] === id)).toMatchObject({ fechaLimite: null });
    });

    it('se anota con fecha y sale tal cual', async () => {
      const respuesta = await crear(A, {
        clientOperationId: operacion(),
        texto: 'Entregar el informe',
        nivel: 'prioridad',
        fechaLimite: '2026-10-12',
      }).expect(201);

      expect(cuerpoDe(respuesta)).toMatchObject({ fechaLimite: '2026-10-12' });
    });

    it('se puede poner, cambiar y quitar', async () => {
      const id = await nuevo();

      expect(
        cuerpoDe(await editar(A, id, { fechaLimite: '2026-10-12' }).expect(200)),
      ).toMatchObject({
        fechaLimite: '2026-10-12',
      });
      expect(cuerpoDe(await editar(A, id, { texto: 'otro' }).expect(200))).toMatchObject({
        fechaLimite: '2026-10-12',
      });
      expect(cuerpoDe(await editar(A, id, { fechaLimite: null }).expect(200))).toMatchObject({
        fechaLimite: null,
      });
    });

    it.each(['12/10/2026', '2026-10-12T10:00:00Z', 'pronto'])(
      'rechaza "%s" por el formato, antes de llegar al dominio',
      async (fecha) => {
        await crear(A, {
          clientOperationId: operacion(),
          texto: 'x',
          nivel: 'urgente',
          fechaLimite: fecha,
        }).expect(400);
      },
    );

    it('un dia que no existe responde 400 PENDIENTE_INVALIDO', async () => {
      const respuesta = await crear(A, {
        clientOperationId: operacion(),
        texto: 'x',
        nivel: 'urgente',
        fechaLimite: '2026-02-30',
      }).expect(400);

      expect(cuerpoDe(respuesta)).toMatchObject({ codigo: 'PENDIENTE_INVALIDO' });
    });

    it('el recordatorio llega el dia limite y dice cual era', async () => {
      const id = String(
        cuerpoDe(
          await crear(B, {
            clientOperationId: operacion(),
            texto: 'Entregar hoy',
            nivel: 'aplazable',
            fechaLimite: '2020-01-01',
          }).expect(201),
        )['id'],
      );

      const respuesta = await consultar(B).expect(200);

      expect(cuerpoDe(respuesta)['recordatorio']).toMatchObject({
        pendienteId: id,
        fechaLimite: '2020-01-01',
        tono: 'plazo',
      });

      // Se tacha para no dejarle un recordatorio a las pruebas que siguen.
      await editar(B, id, { hecho: true }).expect(200);
    });
  });

  it('posponer hacia el pasado se rechaza', async () => {
    const id = await nuevo();

    const respuesta = await editar(A, id, { posponerHasta: '2020-01-01T00:00:00.000Z' }).expect(
      400,
    );

    expect(cuerpoDe(respuesta)).toMatchObject({ codigo: 'PENDIENTE_INVALIDO' });
  });

  it('el recordatorio llega a los 7 dias de un urgente, y posponer lo calla', async () => {
    const id = await nuevo(B, 'urgente');

    // Solo se mueve la fecha; la red y los temporizadores siguen reales.
    vi.useFakeTimers({ toFake: ['Date'], now: Date.now() + 8 * 24 * 60 * 60 * 1000 });

    const conAviso = await consultar(B).expect(200);

    expect(cuerpoDe(conAviso)['recordatorio']).toMatchObject({
      pendienteId: id,
      nivel: 'urgente',
      nivelSugerido: null,
    });

    await editar(B, id, {
      posponerHasta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }).expect(200);

    const sinAviso = await consultar(B).expect(200);

    expect(cuerpoDe(sinAviso)['recordatorio']).toBeNull();
  });

  it('nadie alcanza los pendientes de otra persona: 404 igual que uno que no existe', async () => {
    const id = await nuevo(A);

    const ajeno = await editar(B, id, { hecho: true }).expect(404);
    const inexistente = await editar(B, '97979797-ffff-4fff-8fff-ffffffffffff', {
      hecho: true,
    }).expect(404);

    expect(cuerpoDe(ajeno)).toEqual(cuerpoDe(inexistente));
    expect(cuerpoDe(ajeno)).toMatchObject({ codigo: 'PENDIENTE_NO_ENCONTRADO' });

    // Borrar es idempotente (SCRUM-133): para B el de A responde 204, igual que
    // uno que no existe, sin confirmar que existe. Y lo que importa: no se toca.
    await request(app.getHttpServer())
      .delete(`/api/pendientes/${id}`)
      .set(...comoUsuario(B))
      .expect(204);

    const deB = cuerpoDe(await consultar(B).expect(200)) as { pendientes: { id: string }[] };
    const deA = cuerpoDe(await consultar(A).expect(200)) as { pendientes: { id: string }[] };

    expect(deB.pendientes.some((uno) => uno.id === id)).toBe(false);
    expect(deA.pendientes.some((uno) => uno.id === id)).toBe(true);
  });

  it('borrar dos veces responde 204 las dos: un reintento no atasca la cola sin conexion', async () => {
    const id = await nuevo(A);

    for (let vez = 0; vez < 2; vez += 1) {
      await request(app.getHttpServer())
        .delete(`/api/pendientes/${id}`)
        .set(...comoUsuario(A))
        .expect(204);
    }
  });

  it('borrar uno que nunca existio responde 204', async () => {
    await request(app.getHttpServer())
      .delete('/api/pendientes/97979797-ffff-4fff-8fff-ffffffffffff')
      .set(...comoUsuario(A))
      .expect(204);
  });

  it('borrar con un identificador mal formado sigue siendo un error de la peticion', async () => {
    await request(app.getHttpServer())
      .delete('/api/pendientes/no-es-un-uuid')
      .set(...comoUsuario(A))
      .expect(400);
  });

  it('borrar responde 204 y lo quita', async () => {
    const id = await nuevo(A);

    await request(app.getHttpServer())
      .delete(`/api/pendientes/${id}`)
      .set(...comoUsuario(A))
      .expect(204);

    const deA = cuerpoDe(await consultar(A).expect(200)) as { pendientes: { id: string }[] };

    expect(deA.pendientes.some((uno) => uno.id === id)).toBe(false);
  });

  it('el texto no sale por el registro', async () => {
    const anotado: string[] = [];

    for (const nivel of ['log', 'warn', 'error', 'debug', 'verbose'] as const) {
      vi.spyOn(Logger.prototype, nivel).mockImplementation((...partes: unknown[]) => {
        anotado.push(partes.map(String).join(' '));
      });
    }

    await crear(A, {
      clientOperationId: operacion(),
      texto: 'Algo muy personal por hacer',
      nivel: 'urgente',
    }).expect(201);

    await vi.waitFor(() => expect(anotado.join('\n')).toContain('POST /api/pendientes 201'));
    expect(anotado.join('\n')).not.toContain('muy personal');
  });
});
