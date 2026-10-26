import 'reflect-metadata';

import { appendFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import EmbeddedPostgres from 'embedded-postgres';
import { Client } from 'pg';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import { it, vi } from 'vitest';

// Estos reemplazos solo existen dentro de este proceso de Vitest.
vi.mock('@nestjs/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@nestjs/config')>();
  const original = actual.ConfigModule.forRoot.bind(actual.ConfigModule);

  vi.spyOn(actual.ConfigModule, 'forRoot').mockImplementation((options) =>
    original({ ...options, ignoreEnvFile: true }),
  );

  return actual;
});

vi.mock('express-rate-limit', () => ({
  default: () => (_request: Request, _response: Response, next: NextFunction) => next(),
}));

import { AppModule } from '../../src/infrastructure/config/AppModule.js';
import { configurarAplicacion } from '../../src/infrastructure/config/aplicacion.js';
import { validarConfiguracion } from '../../src/infrastructure/config/environment.js';
import { CONFIGURACION } from '../../src/infrastructure/config/tokens.js';
import {
  TokenInvalidoError,
  VerificadorDeIdentidad,
} from '../../src/infrastructure/auth/VerificadorDeIdentidad.js';
import { ContadorPorVentana } from '../../src/infrastructure/limites/LimitePorCuenta.js';
import { REGISTRO_DE_PRUEBA } from '../../src/pruebas/sesionDePrueba.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../src/pruebas/rolDeLaAplicacion.js';

it('runs the isolated local load-test server', async () => {
  vi.stubGlobal('fetch', () =>
    Promise.reject(new Error('External fetch is disabled in this test process')),
  );

  vi.spyOn(ContadorPorVentana.prototype, 'contar').mockReturnValue({
    permitido: true,
    reinicioEnMs: 60_000,
    primerRechazo: false,
  });

  const directory = mkdtempSync(join(tmpdir(), 'vsd-k6-'));

  const postgres = new EmbeddedPostgres({
    databaseDir: join(directory, 'postgres'),
    user: 'qa_owner',
    password: 'qa_local_only',
    port: 55440,
    persistent: true,
    postgresFlags: ['-c', 'listen_addresses=127.0.0.1'],
    onLog: () => {},
    onError: () => {},
  });

  const owner = new Client({
    host: '127.0.0.1',
    port: 55440,
    database: 'vsd_qa_k6',
    user: 'qa_owner',
    password: 'qa_local_only',
  });

  let app: NestExpressApplication | undefined;
  let sampler: ReturnType<typeof setInterval> | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let databaseStarted = false;

  try {
    await postgres.initialise();
    await postgres.start();
    databaseStarted = true;
    await postgres.createDatabase('vsd_qa_k6');

    // No se pasan a Prisma URLs de base de datos, tokens de servicio ni opciones de PG.
    const migrationEnvironment: NodeJS.ProcessEnv = {
      NODE_ENV: 'test',
    };

    for (const key of [
      'PATH',
      'Path',
      'SystemRoot',
      'TEMP',
      'TMP',
      'USERPROFILE',
      'APPDATA',
      'LOCALAPPDATA',
    ]) {
      const value = process.env[key];
      if (value) migrationEnvironment[key] = value;
    }

    const migration = spawnSync(
      process.execPath,
      [
        resolve('node_modules/prisma/build/index.js'),
        'migrate',
        'deploy',
        '--config',
        resolve('scripts/carga/prisma.local.config.ts'),
      ],
      {
        env: migrationEnvironment,
        encoding: 'utf8',
      },
    );

    if (migration.error) throw migration.error;
    if (migration.status !== 0) {
      throw new Error(migration.stderr || 'Local migration failed');
    }

    await owner.connect();
    await prepararRolDeLaAplicacion(owner);

    const configuration = validarConfiguracion({
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://vsd_app:' + CLAVE_LOCAL + '@127.0.0.1:55440/vsd_qa_k6',
      SUPABASE_URL: 'http://127.0.0.1:1',
      CORS_ORIGIN: 'http://localhost:5173',
      TRUST_PROXY_HOPS: '0',
    });

    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CONFIGURACION)
      .useValue(configuration)
      .overrideProvider(VerificadorDeIdentidad)
      .useValue({
        verificar(token: string) {
          const match = /^qa-user-([1-9][0-9]?|100)$/.exec(token);

          if (!match) {
            return Promise.reject(
              new TokenInvalidoError('Only local test identities are accepted'),
            );
          }

          return Promise.resolve({
            id: 'aaaaaaaa-aaaa-4aaa-8aaa-' + match[1]!.padStart(12, '0'),
            correo: 'qa-' + match[1] + '@vsd-carga.test',
          });
        },
      })
      .compile();

    app = testingModule.createNestApplication<NestExpressApplication>({
      logger: false,
    });

    configurarAplicacion(app, configuration);

    let stop!: () => void;
    const finished = new Promise<void>((resolveFinished) => {
      stop = resolveFinished;
    });

    const server = app.getHttpAdapter().getInstance();

    server.get('/__qa/status', (_request: Request, response: Response) => {
      response.json({
        laboratory: 'vsd-k6-local-v1',
        users: 100,
        entriesPerUser: 201,
      });
    });

    server.get('/__qa/metrics', (_request: Request, response: Response) => {
      response.json(process.memoryUsage());
    });

    server.post('/__qa/stop', (_request: Request, response: Response) => {
      response.json({ ok: true });
      stop();
    });

    await app.init();

    const content = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Synthetic local test data. '.repeat(320),
            },
          ],
        },
      ],
    });

    for (let user = 1; user <= 100; user++) {
      const registration = await request(app.getHttpServer())
        .post('/api/cuenta')
        .set('Authorization', 'Bearer qa-user-' + user)
        .send(REGISTRO_DE_PRUEBA)
        .expect(200);

      const account = registration.body as { id: string };

      // Los datos masivos se insertan solo en la base local recien creada.
      await owner.query(
        `INSERT INTO entrada_diario
          (
            id_entrada,
            id_usuario,
            id_operacion_cliente,
            dia,
            titulo,
            contenido,
            formato,
            fecha_creacion,
            fecha_edicion
          )
         SELECT
           gen_random_uuid(),
           $1,
           gen_random_uuid(),
           (now() AT TIME ZONE 'America/Bogota')::date,
           'Local load fixture',
           $2,
           'enriquecido',
           now(),
           now()
         FROM generate_series(1, 201)`,
        [account.id, content],
      );
    }

    const memoryFile = resolve('ram-local.csv');
    writeFileSync(memoryFile, 'timestamp,rss,heapUsed,external,arrayBuffers\n');

    sampler = setInterval(() => {
      const memory = process.memoryUsage();

      appendFileSync(
        memoryFile,
        [
          new Date().toISOString(),
          memory.rss,
          memory.heapUsed,
          memory.external,
          memory.arrayBuffers,
        ].join(',') + '\n',
      );
    }, 1000);

    await app.listen(3000, '127.0.0.1');

    console.log('Local test server ready at http://localhost:3000');
    console.log('Memory samples: ' + memoryFile);
    console.log('Temporary database: ' + directory);

    timeout = setTimeout(stop, 12 * 60_000);
    await finished;
  } finally {
    if (timeout) clearTimeout(timeout);
    if (sampler) clearInterval(sampler);

    try {
      await app?.close();
    } finally {
      try {
        await owner.end();
      } finally {
        try {
          if (databaseStarted) await postgres.stop();
        } finally {
          vi.restoreAllMocks();
          vi.unstubAllGlobals();
        }
      }
    }
  }
});
