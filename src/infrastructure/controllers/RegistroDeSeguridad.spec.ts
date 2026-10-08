import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  SESIONES,
  VerificadorFalso,
  comoUsuario,
  darDeAlta,
} from '../../pruebas/sesionDePrueba.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import { AppModule } from '../config/AppModule.js';
import { configurarAplicacion } from '../config/aplicacion.js';
import type { Configuracion } from '../config/environment.js';
import { CONFIGURACION, REGISTRO_DE_SEGURIDAD } from '../config/tokens.js';
import { crearHuellaDeIp } from '../seguridad/huellaDeIp.js';
import { RegistroDeSeguridadEnSalida } from '../seguridad/RegistroDeSeguridadEnSalida.js';
import { FRASE_DE_CONFIRMACION } from './dto/BorrarCuentaDto.js';

/**
 * El registro de seguridad por HTTP (SCRUM-163): cada hecho que importa deja su
 * linea, y en ninguna aparece nada de la persona.
 *
 * Es la API de verdad con el adaptador de verdad; solo cambia donde escribe (una
 * lista en lugar de la salida estandar) y la firma del token.
 */
const A = 'token-de-A';
const TOKEN_QUE_ROMPE = 'token-que-rompe';

/** Un verificador al que se le puede caer el servicio de claves. */
class VerificadorQueSeCae extends VerificadorFalso {
  override verificar(token: string): ReturnType<VerificadorFalso['verificar']> {
    return token === TOKEN_QUE_ROMPE
      ? Promise.reject(new Error('el servicio de claves no responde'))
      : super.verificar(token);
  }
}

type Linea = Record<string, unknown>;

describe('El registro de seguridad por HTTP (SCRUM-163)', () => {
  let app: NestExpressApplication;
  let lineas: string[];

  const eventos = (): Linea[] => lineas.map((linea) => JSON.parse(linea) as Linea);
  const tipos = (): unknown[] => eventos().map((evento) => evento['tipo']);

  const como = (token: string) => ({
    get: (ruta: string) =>
      request(app.getHttpServer())
        .get(ruta)
        .set(...comoUsuario(token)),
    patch: (ruta: string, cuerpo: object) =>
      request(app.getHttpServer())
        .patch(ruta)
        .set(...comoUsuario(token))
        .send(cuerpo),
    borrar: (ruta: string, cuerpo: object = {}) =>
      request(app.getHttpServer())
        .delete(ruta)
        .set(...comoUsuario(token))
        .send(cuerpo),
    subir: (ruta: string, tipo: string, contenido: string) =>
      request(app.getHttpServer())
        .put(ruta)
        .set(...comoUsuario(token))
        .set('Content-Type', tipo)
        .send(Buffer.from(contenido, 'utf8')),
  });

  async function levantar(conCuentas: boolean): Promise<void> {
    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:5173';
    process.env.SUPABASE_URL = 'https://pruebas.supabase.co';
    delete process.env.DATABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    lineas = [];

    const registro = new RegistroDeSeguridadEnSalida({
      ambiente: 'test',
      huellaDeIp: crearHuellaDeIp('una-clave-de-prueba-bien-larga'),
      escribir: (linea) => lineas.push(linea),
    });

    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(VerificadorDeIdentidad)
      .useClass(VerificadorQueSeCae)
      .overrideProvider(REGISTRO_DE_SEGURIDAD)
      .useValue(registro)
      .compile();

    app = modulo.createNestApplication<NestExpressApplication>({ logger: false });
    configurarAplicacion(app, app.get<Configuracion>(CONFIGURACION));
    await app.init();

    if (conCuentas) {
      await darDeAlta(app.getHttpServer());
      lineas.length = 0;
    }
  }

  afterEach(async () => {
    await app.close();
  });

  describe('quien llega con un token', () => {
    beforeEach(async () => {
      await levantar(true);
    });

    it('uno falso se anota como TOKEN_INVALIDO, con el identificador de la peticion y sin el token', async () => {
      const falso = 'eyJhbGciOiJFUzI1NiJ9.cuerpo-falso.firma-falsa';
      const respuesta = await como(falso).get('/api/cuenta').expect(401);

      expect(eventos()).toEqual([
        expect.objectContaining({
          canal: 'seguridad',
          tipo: 'TOKEN_RECHAZADO',
          motivo: 'TOKEN_INVALIDO',
          idPeticion: respuesta.headers['x-request-id'],
          huellaDeIp: expect.stringMatching(/^[0-9a-f]{16}$/) as unknown,
        }),
      ]);
      expect(lineas.join('')).not.toContain('cuerpo-falso');
      expect(lineas.join('')).not.toContain('firma-falsa');
    });

    it('si no se puede comprobar la firma se anota aparte: no es culpa de quien llama', async () => {
      await como(TOKEN_QUE_ROMPE).get('/api/cuenta').expect(401);

      expect(eventos()).toEqual([
        expect.objectContaining({ tipo: 'TOKEN_RECHAZADO', motivo: 'VERIFICACION_NO_DISPONIBLE' }),
      ]);
    });

    it('sin cabecera no se anota nada: es ruido, no un intento', async () => {
      await request(app.getHttpServer()).get('/api/cuenta').expect(401);

      expect(eventos()).toEqual([]);
    });

    it('una ruta publica no anota nada', async () => {
      await request(app.getHttpServer()).get('/health').expect(200);

      expect(eventos()).toEqual([]);
    });

    it('un token bueno no anota nada por consultar', async () => {
      await como(A).get('/api/cuenta').expect(200);

      expect(eventos()).toEqual([]);
    });
  });

  describe('una sesion valida sin cuenta', () => {
    beforeEach(async () => {
      await levantar(false);
    });

    it('se anota como CUENTA_NO_REGISTRADA con el identificador del proveedor, no con el correo', async () => {
      await como(A).get('/api/cuenta').expect(403);

      expect(eventos()).toEqual([
        expect.objectContaining({
          tipo: 'CUENTA_NO_REGISTRADA',
          idProveedor: SESIONES[A]?.id,
        }),
      ]);
      expect(lineas.join('')).not.toContain('sesion-de-prueba.test');
    });

    it('darse de alta no es un hecho de seguridad', async () => {
      await darDeAlta(app.getHttpServer(), [A]);

      expect(eventos()).toEqual([]);
    });
  });

  describe('lo que la persona hace con su cuenta', () => {
    let idDeLaCuenta: string;

    beforeEach(async () => {
      await levantar(true);

      const cuenta = await como(A).get('/api/cuenta').expect(200);

      idDeLaCuenta = String((cuenta.body as Linea)['id']);
    });

    it('exportar sus datos se anota como DATOS_EXPORTADOS con su identificador interno', async () => {
      const respuesta = await como(A).get('/api/cuenta/exportacion').expect(200);

      expect(eventos()).toEqual([
        expect.objectContaining({
          tipo: 'DATOS_EXPORTADOS',
          idUsuario: idDeLaCuenta,
          idPeticion: respuesta.headers['x-request-id'],
        }),
      ]);
    });

    it('cambiar el permiso del diario se anota; repetir el mismo valor, no', async () => {
      await como(A)
        .patch('/api/cuenta/preferencias', { diarioConRecomendaciones: true })
        .expect(200);
      await como(A)
        .patch('/api/cuenta/preferencias', { diarioConRecomendaciones: true })
        .expect(200);
      await como(A)
        .patch('/api/cuenta/preferencias', { diarioConRecomendaciones: false })
        .expect(200);

      expect(eventos()).toEqual([
        expect.objectContaining({
          tipo: 'PERMISO_DEL_DIARIO_CAMBIADO',
          idUsuario: idDeLaCuenta,
          activado: true,
        }),
        expect.objectContaining({
          tipo: 'PERMISO_DEL_DIARIO_CAMBIADO',
          idUsuario: idDeLaCuenta,
          activado: false,
        }),
      ]);
    });

    it('cambiar otra preferencia no anota nada, y el nombre menos', async () => {
      await como(A)
        .patch('/api/cuenta/preferencias', { nombre: 'Una Persona Secreta' })
        .expect(200);

      expect(eventos()).toEqual([]);
    });

    it('borrar la cuenta se anota como CUENTA_BORRADA cuando termina', async () => {
      await como(A).borrar('/api/cuenta', { confirmacion: FRASE_DE_CONFIRMACION }).expect(204);

      expect(eventos()).toEqual([
        expect.objectContaining({ tipo: 'CUENTA_BORRADA', idUsuario: idDeLaCuenta }),
      ]);
    });

    it('un borrado que no se confirma no se anota: no paso', async () => {
      await como(A).borrar('/api/cuenta', { confirmacion: 'borrar' }).expect(400);

      expect(eventos()).toEqual([]);
    });

    it('un SVG peligroso se anota como ARCHIVO_PELIGROSO_RECHAZADO, sin lo que traia', async () => {
      const respuesta = await como(A)
        .subir(
          '/api/cuenta/mascota-propia',
          'image/svg+xml',
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><script>robarTodo()</script></svg>',
        )
        .expect(400);

      expect(respuesta.body).toMatchObject({ codigo: 'MASCOTA_SVG_PELIGROSO' });
      expect(eventos()).toEqual([
        expect.objectContaining({
          tipo: 'ARCHIVO_PELIGROSO_RECHAZADO',
          idUsuario: idDeLaCuenta,
          motivo: 'MASCOTA_SVG_PELIGROSO',
        }),
      ]);
      expect(lineas.join('')).not.toContain('robarTodo');
    });

    it('una foto de un tipo que no es se anota con su motivo', async () => {
      await como(A).subir('/api/cuenta/foto', 'text/html', '<html></html>').expect(415);

      expect(eventos()).toEqual([
        expect.objectContaining({
          tipo: 'ARCHIVO_PELIGROSO_RECHAZADO',
          idUsuario: idDeLaCuenta,
          motivo: 'FOTO_TIPO_NO_PERMITIDO',
        }),
      ]);
    });
  });

  describe('lo que nunca debe aparecer', () => {
    it('tras recorrer todos los hechos, ninguna linea lleva datos de la persona ni su IP', async () => {
      await levantar(true);

      const secretos = [
        SESIONES[A]?.correo ?? 'sin-correo',
        'Una Persona Secreta',
        'eyJhbGciOiJFUzI1NiJ9.cuerpo-falso.firma-falsa',
        'robarTodo',
        'Bearer',
        '127.0.0.1',
        '::1',
      ];

      await como('eyJhbGciOiJFUzI1NiJ9.cuerpo-falso.firma-falsa').get('/api/cuenta').expect(401);
      await como(TOKEN_QUE_ROMPE).get('/api/cuenta').expect(401);
      await como(A)
        .patch('/api/cuenta/preferencias', { nombre: 'Una Persona Secreta' })
        .expect(200);
      await como(A)
        .patch('/api/cuenta/preferencias', { diarioConRecomendaciones: true })
        .expect(200);
      await como(A).get('/api/cuenta/exportacion').expect(200);
      await como(A)
        .subir(
          '/api/cuenta/mascota-propia',
          'image/svg+xml',
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><script>robarTodo()</script></svg>',
        )
        .expect(400);
      await como(A).borrar('/api/cuenta', { confirmacion: FRASE_DE_CONFIRMACION }).expect(204);

      expect(tipos()).toEqual([
        'TOKEN_RECHAZADO',
        'TOKEN_RECHAZADO',
        'PERMISO_DEL_DIARIO_CAMBIADO',
        'DATOS_EXPORTADOS',
        'ARCHIVO_PELIGROSO_RECHAZADO',
        'CUENTA_BORRADA',
      ]);

      const todo = lineas.join('\n');

      for (const secreto of secretos) {
        expect(todo, `la linea no debe llevar "${secreto}"`).not.toContain(secreto);
      }

      // Cada linea es JSON de una sola linea y lleva su canal.
      for (const linea of lineas) {
        expect(linea).not.toContain('\n');
        expect(JSON.parse(linea)).toMatchObject({ canal: 'seguridad', version: 1 });
      }
    });
  });
});
