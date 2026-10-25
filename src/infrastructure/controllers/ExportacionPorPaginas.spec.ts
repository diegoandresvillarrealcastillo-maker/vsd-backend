import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import type {
  DatosExportados,
  ExportarDatosUseCase,
  ResultadoExportado,
} from '../../domain/ports/in/ExportarDatosUseCase.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { sinFilas } from '../../pruebas/reunir.js';
import { REGISTRO_DE_PRUEBA, VerificadorFalso, comoUsuario } from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION, EXPORTAR_DATOS } from '../config/tokens.js';

const A = 'token-de-A';
const AHORA = new Date('2026-10-25T15:00:00.000Z');

function resultado(n: number): ResultadoExportado {
  const sufijo = String(n).padStart(12, '0');

  return {
    resultado: ActivityResult.create(
      {
        id: new ResultId(`dddddddd-dddd-4ddd-8ddd-${sufijo}`),
        userId: new UserId('11111111-1111-4111-8111-111111111111'),
        activityId: new ActivityId('33333333-3333-4333-a333-333333333333'),
        clientOperationId: new ClientOperationId(`eeeeeeee-eeee-4eee-8eee-${sufijo}`),
        completedAt: new Date('2026-10-01T12:00:00.000Z'),
        dia: '2026-10-01',
      },
      AHORA,
    ),
  };
}

/** Lo que el caso de uso entregaria: la lista de resultados la pone cada prueba. */
function datosCon(resultados: AsyncIterable<ResultadoExportado>): DatosExportados {
  return {
    generadoEn: AHORA,
    cuenta: unaCuenta(),
    consentimientos: [],
    resultados,
    entradasDeDiario: sinFilas(),
    pendientes: sinFilas(),
    avisos: {
      preferencias: {
        userId: new UserId('11111111-1111-4111-8111-111111111111'),
        minutoSemaforo: null,
        frecuenciaSemaforo: 'manana',
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: null,
        zonaHoraria: 'America/Bogota',
      },
      navegadores: 0,
    },
    foto: null,
    mascotaPropia: null,
    datoCurioso: null,
  };
}

/**
 * `GET /api/cuenta/exportacion` por piezas (SCRUM-262): el mismo JSON, escrito sin armarlo entero.
 *
 * El caso de uso se sustituye por uno que entrega lo que cada prueba necesita; todo lo demas (la
 * guardia de la sesion, el limite, los encabezados, el flujo hacia la conexion) es el de la
 * aplicacion de verdad.
 */
describe('GET /api/cuenta/exportacion, por paginas', () => {
  let app: NestExpressApplication;
  let siguiente: () => DatosExportados;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:5173';
    process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
    delete process.env.DATABASE_URL;

    const casoDeUso: ExportarDatosUseCase = { execute: () => Promise.resolve(siguiente()) };

    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(VerificadorDeIdentidad)
      .useClass(VerificadorFalso)
      .overrideProvider(EXPORTAR_DATOS)
      .useValue(casoDeUso)
      .compile();

    app = modulo.createNestApplication<NestExpressApplication>({ logger: false });
    configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));
    await app.init();

    await request(app.getHttpServer())
      .post('/api/cuenta')
      .set(...comoUsuario(A))
      .send(REGISTRO_DE_PRUEBA)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

  function exportar(): request.Test {
    return request(app.getHttpServer())
      .get('/api/cuenta/exportacion')
      .set(...comoUsuario(A));
  }

  it('sale como un archivo JSON que no se guarda, y por partes: sin Content-Length', async () => {
    siguiente = () =>
      datosCon(
        (async function* () {
          yield await Promise.resolve(resultado(1));
        })(),
      );

    const respuesta = await exportar().expect(200);

    expect(respuesta.headers['content-type']).toMatch(/^application\/json/);
    expect(respuesta.headers['cache-control']).toBe('no-store');
    expect(respuesta.headers['content-disposition']).toBe(
      'attachment; filename="vsd-health-mis-datos.json"',
    );
    expect(respuesta.headers['content-length']).toBeUndefined();
    expect(respuesta.headers['transfer-encoding']).toBe('chunked');
  });

  it('con mucho que entregar sale todo y es un JSON valido', async () => {
    const CANTIDAD = 2500;

    siguiente = () =>
      datosCon(
        (async function* () {
          for (let n = 1; n <= CANTIDAD; n++) {
            yield await Promise.resolve(resultado(n));
          }
        })(),
      );

    const respuesta = await exportar().expect(200);
    const cuerpo = respuesta.body as { resultados: { id: string }[]; entradasDeDiario: unknown[] };

    expect(cuerpo.resultados).toHaveLength(CANTIDAD);
    expect(cuerpo.resultados[0]?.id).toBe('dddddddd-dddd-4ddd-8ddd-000000000001');
    expect(cuerpo.resultados.at(-1)?.id).toBe('dddddddd-dddd-4ddd-8ddd-000000002500');
    expect(cuerpo.entradasDeDiario).toEqual([]);
  });

  it('si una pagina falla a mitad, la conexion se corta: no queda un JSON cortado que parezca completo', async () => {
    siguiente = () =>
      datosCon(
        (async function* () {
          yield await Promise.resolve(resultado(1));
          yield await Promise.resolve(resultado(2));
          throw new Error('la base se cayo');
        })(),
      );

    // Cerrar la respuesta con normalidad entregaria un 200 con medio archivo, que el cliente
    // tardaria en descubrir roto. Cortada, la peticion falla en la conexion y se vuelve a intentar.
    const error = await exportar().then(
      () => undefined,
      (causa: unknown) => causa,
    );

    expect(error).toMatchObject({ code: 'ECONNRESET' });
  });

  it('despues de un corte, la siguiente exportacion funciona', async () => {
    siguiente = () =>
      datosCon(
        (async function* () {
          yield await Promise.resolve(resultado(1));
        })(),
      );

    const respuesta = await exportar().expect(200);

    expect((respuesta.body as { resultados: unknown[] }).resultados).toHaveLength(1);
  });
});
