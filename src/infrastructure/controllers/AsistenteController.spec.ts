import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  SESIONES,
  VerificadorFalso,
  comoUsuario,
  darDeAlta,
} from '../../pruebas/sesionDePrueba.js';
import { VERSION_VIGENTE_DEL_AVISO } from '../../domain/model/AvisoDePrivacidad.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION } from '../config/tokens.js';

async function levantarAplicacion(): Promise<NestExpressApplication> {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  // No se llega a consultar: el verificador de verdad esta sustituido. Hace
  // falta igual porque la configuracion la exige para arrancar.
  process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
  // Estas pruebas son del comportamiento HTTP. Sin esto, tener un .env con
  // DATABASE_URL las haria hablar con PostgreSQL sin avisar.
  delete process.env.DATABASE_URL;

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    // Se sustituye la criptografia, no el guardia. Ver src/pruebas.
    .overrideProvider(VerificadorDeIdentidad)
    .useClass(VerificadorFalso)
    .compile();

  const app = modulo.createNestApplication<NestExpressApplication>({ logger: false });

  configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));

  await app.init();

  // Desde SCRUM-63 tener token no basta para operar: hace falta cuenta.
  await darDeAlta(app.getHttpServer());

  return app;
}

function cuerpoDe(respuesta: request.Response): Record<string, unknown> {
  return respuesta.body as Record<string, unknown>;
}

/**
 * El asistente a traves de HTTP.
 *
 * Las reglas se prueban en su propia capa; esto comprueba el camino completo,
 * que es donde se rompen las cosas: el cableado del modulo, la validacion de
 * la peticion y la forma de la respuesta.
 *
 * La prueba que importa es la del riesgo. Que la deteccion funcione en una
 * prueba unitaria no sirve de nada si el telefono no llega a salir por el
 * cable.
 */
describe('POST /api/asistente', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responde a una pregunta reconocida con recursos', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ texto: 'como puedo dormir mejor' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({ intencion: 'como_duermo_mejor', senalDeRiesgo: false });
    expect((cuerpoDe(respuesta).recursos as unknown[]).length).toBeGreaterThan(0);
  });

  it('responde a un saludo con calidez y sin lineas de atencion (SCRUM-128)', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ texto: 'Hola' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      intencion: 'saludo',
      senalDeRiesgo: false,
      incluyeLineasDeAtencion: false,
      recursos: [],
    });
  });

  it('lee el nombre de la mascota de la cuenta como parte de un saludo', async () => {
    // El nombre sale de la cuenta del token, no del cuerpo: el cuerpo no puede
    // declararlo, y la validacion lo rechaza.
    const antes = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-B'))
      .send({ texto: 'hola, Luma' });

    expect(antes.body).toMatchObject({ intencion: 'no_reconocida' });

    await request(app.getHttpServer())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario('token-de-B'))
      .send({ mascota: { forma: 'fungito', nombre: 'Luma' } })
      .expect(200);

    const despues = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-B'))
      .send({ texto: 'hola, Luma' });

    expect(despues.body).toMatchObject({ intencion: 'saludo', recursos: [] });

    const intento = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-B'))
      .send({ texto: 'hola, Luma', nombreDeLaMascota: 'Luma' });

    expect(intento.status).toBe(400);
  });

  it('ante una senal de riesgo devuelve lineas de atencion', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ texto: 'ya no aguanto mas' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      senalDeRiesgo: true,
      incluyeLineasDeAtencion: true,
    });

    const recursos = cuerpoDe(respuesta).recursos as { tipo: string; cobertura?: string }[];

    expect(recursos.length).toBeGreaterThan(0);
    expect(recursos.every((recurso) => recurso.tipo === 'contacto')).toBe(true);
    // Lo primero que se ve tiene que servir en todo el pais.
    expect(recursos[0]?.cobertura).toBe('nacional');
  });

  it('no devuelve el texto que escribio la persona', async () => {
    // Lo que alguien le cuenta al asistente no vuelve en la respuesta, no se
    // guarda y no aparece en ningun registro. Si algun dia se anadiera un eco
    // del texto "para depurar", esta prueba lo dice.
    const confesion = 'ayer discuti con mi mama y quiero morirme';

    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ texto: confesion });

    expect(JSON.stringify(respuesta.body)).not.toContain('mama');
    expect(JSON.stringify(respuesta.body)).not.toContain('discuti');
  });

  it('responde algo util cuando no entiende', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ texto: 'a que hora abre la biblioteca' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({ intencion: 'no_reconocida' });
    expect((cuerpoDe(respuesta).recursos as unknown[]).length).toBeGreaterThan(0);
  });

  it.each([
    ['sin texto', {}],
    ['texto vacio', { texto: '' }],
    ['texto larguisimo', { texto: 'a'.repeat(1001) }],
  ])('rechaza con 400 una peticion %s', async (_caso, cuerpo) => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send(cuerpo);

    expect(respuesta.status).toBe(400);
  });

  it('rechaza un campo que no existe en el contrato', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ texto: 'hola', modelo: 'gpt' });

    expect(respuesta.status).toBe(400);
  });
});

/**
 * Las lineas de atencion segun el pais de la cuenta (SCRUM-124), por HTTP.
 *
 * Lo importante es el cableado: que la zona de la cuenta que firma el token
 * llegue a cada camino que ensena telefonos (el asistente, los resultados y el
 * diario) y que nadie pueda elegir el pais desde el cuerpo.
 */
describe('Las lineas de atencion segun el pais de la cuenta', () => {
  let app: NestExpressApplication;

  const titulosDe = (respuesta: request.Response, campo?: string): string[] => {
    const cuerpo = respuesta.body as Record<string, unknown>;
    const recursos = (campo === undefined ? cuerpo['recursos'] : cuerpo[campo]) as {
      titulo: string;
    }[];

    return recursos.map((recurso) => recurso.titulo);
  };

  function enZona(token: string, zonaHoraria: string): request.Test {
    return request(app.getHttpServer())
      .post('/api/cuenta')
      .set(...comoUsuario(token))
      .send({ versionPolitica: VERSION_VIGENTE_DEL_AVISO, zonaHoraria });
  }

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('una cuenta en Bogota recibe las lineas de Colombia', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ texto: 'quiero morirme' })
      .expect(200);

    expect(titulosDe(respuesta)).toEqual([
      'Línea 192, opción 4',
      'Línea 123',
      'Línea 106, el poder de ser escuchado',
    ]);
  });

  it('la misma frase, desde una cuenta en Madrid, trae las lineas de Espana', async () => {
    await enZona('token-de-B', 'Europe/Madrid').expect(200);

    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-B'))
      .send({ texto: 'quiero morirme' })
      .expect(200);

    expect(titulosDe(respuesta)).toEqual(['Línea 024, llama a la vida', 'Línea 112']);
    expect(JSON.stringify(respuesta.body)).not.toMatch(/192|\b106\b/u);
  });

  it('una cuenta en un pais sin lineas verificadas recibe el directorio y ningun telefono', async () => {
    await enZona('token-de-B', 'America/Lima').expect(200);

    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-B'))
      .send({ texto: 'quiero morirme' })
      .expect(200);

    expect(titulosDe(respuesta)).toEqual(['Directorio internacional de líneas de ayuda']);
    expect(respuesta.body).toMatchObject({ senalDeRiesgo: true, incluyeLineasDeAtencion: true });
  });

  it('el pais no se puede elegir desde el cuerpo: sale de la cuenta', async () => {
    for (const campo of [{ zonaHoraria: 'Europe/Madrid' }, { pais: 'ES' }]) {
      const respuesta = await request(app.getHttpServer())
        .post('/api/asistente')
        .set(...comoUsuario('token-de-A'))
        .send({ texto: 'quiero morirme', ...campo });

      expect(respuesta.status).toBe(400);
    }
  });

  it('los resultados que sugieren acompanamiento traen las lineas del pais de la cuenta', async () => {
    await enZona('token-de-B', 'America/Mexico_City').expect(200);

    const respuesta = await request(app.getHttpServer())
      .post('/api/resultados')
      .set(...comoUsuario('token-de-B'))
      .send({
        activityId: '33333333-3333-4333-a333-333333333333',
        clientOperationId: '44444444-4444-4444-b444-0000000124a1',
        score: 1,
        completedAt: '2026-09-14T11:00:00.000Z',
      })
      .expect(201);

    expect(titulosDe(respuesta, 'lineasDeAtencion')).toEqual([
      'Línea de la Vida, 800 911 2000',
      'Línea 911',
    ]);
  });

  it('el diario, con permiso, trae las lineas del pais de la cuenta', async () => {
    await enZona('token-de-B', 'America/New_York').expect(200);
    await request(app.getHttpServer())
      .patch('/api/cuenta/preferencias')
      .set(...comoUsuario('token-de-B'))
      .send({ diarioConRecomendaciones: true })
      .expect(200);

    const respuesta = await request(app.getHttpServer())
      .post('/api/diario')
      .set(...comoUsuario('token-de-B'))
      .send({
        clientOperationId: '44444444-4444-4444-b444-0000000124a2',
        contenido: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hoy pense que ya no puedo mas' }],
            },
          ],
        },
      })
      .expect(201);

    expect(titulosDe(respuesta, 'lineasDeAtencion')).toEqual(['Línea 988', 'Línea 911']);
  });
});

describe('El asistente exige sesion', () => {
  // Importa mas aqui que en otras rutas: el asistente personaliza su
  // respuesta con el historial reciente de quien pregunta. Antes de SCRUM-66
  // ese identificador venia en el cuerpo, asi que cualquiera podia preguntar
  // en nombre de otra persona y leer en la respuesta cuanto habia usado la
  // aplicacion.

  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await levantarAplicacion();
  });

  afterAll(async () => {
    await app.close();
  });

  it('sin cabecera responde 401', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .send({ texto: 'hola' });

    expect(respuesta.status).toBe(401);
  });

  it('con un token que no reconoce responde 401', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-inventado'))
      .send({ texto: 'hola' });

    expect(respuesta.status).toBe(401);
  });

  it('ya no acepta que el cuerpo diga quien pregunta', async () => {
    // El campo desaparecio del contrato, y la validacion rechaza lo que no
    // esta declarado. Un 400 explicito, y no un silencio, para que un cliente
    // viejo se entere en lugar de creer que elige el usuario.
    const respuesta = await request(app.getHttpServer())
      .post('/api/asistente')
      .set(...comoUsuario('token-de-A'))
      .send({ userId: SESIONES['token-de-B']?.id, texto: 'hola' });

    expect(respuesta.status).toBe(400);
  });
});
