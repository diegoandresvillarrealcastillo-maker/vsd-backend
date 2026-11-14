import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RegistroDeSeguridadEnSalida,
  RegistroDeSeguridadNulo,
} from '../seguridad/RegistroDeSeguridadEnSalida.js';
import { validarConfiguracion } from './environment.js';
import { crearElRegistroDeSeguridad } from './SeguridadModule.js';

const EN_PRE = {
  NODE_ENV: 'preproduction',
  CORS_ORIGIN: 'https://vsd.example',
  DATABASE_URL: 'postgresql://x:y@z:5432/db',
  SUPABASE_URL: 'https://abcdefgh.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'clave-de-servicio-de-prueba',
};

const ID = '8f14e45f-ceea-467a-9575-0d9a1c3c7b11';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('crearElRegistroDeSeguridad', () => {
  it('en las pruebas no escribe nada: las suites que quieren verlo lo reemplazan', () => {
    const escritura = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const registro = crearElRegistroDeSeguridad(
      validarConfiguracion({ ...EN_PRE, NODE_ENV: 'test' }),
    );

    registro.registrar({ tipo: 'CUENTA_BORRADA', idUsuario: ID });

    expect(registro).toBeInstanceOf(RegistroDeSeguridadNulo);
    expect(escritura).not.toHaveBeenCalled();
  });

  it('fuera de las pruebas escribe una linea JSON por la salida estandar, sin la IP', () => {
    vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    const escritura = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const registro = crearElRegistroDeSeguridad(validarConfiguracion(EN_PRE));

    registro.registrar({ tipo: 'TOKEN_RECHAZADO', motivo: 'TOKEN_INVALIDO', ip: '203.0.113.9' });

    expect(registro).toBeInstanceOf(RegistroDeSeguridadEnSalida);
    expect(escritura).toHaveBeenCalledTimes(1);

    const escrito = String(escritura.mock.calls[0]?.[0]);

    expect(escrito.endsWith('\n')).toBe(true);
    expect(JSON.parse(escrito)).toMatchObject({
      canal: 'seguridad',
      ambiente: 'preproduction',
      tipo: 'TOKEN_RECHAZADO',
    });
    expect(escrito).not.toContain('203.0.113.9');
  });

  it('sin clave para las IP lo dice una vez al armarse, para que nadie lo descubra tarde', () => {
    const aviso = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    crearElRegistroDeSeguridad(validarConfiguracion(EN_PRE));

    expect(aviso).toHaveBeenCalledTimes(1);
    expect(String(aviso.mock.calls[0]?.[0])).toContain('REGISTRO_SEGURIDAD_CLAVE_IP');
  });

  it('con la clave puesta no avisa nada', () => {
    const aviso = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    crearElRegistroDeSeguridad(
      validarConfiguracion({
        ...EN_PRE,
        REGISTRO_SEGURIDAD_CLAVE_IP: 'una-clave-bien-larga-para-las-ip',
      }),
    );

    expect(aviso).not.toHaveBeenCalled();
  });

  it('con un servicio configurado, tambien manda la copia por HTTP al cerrar', async () => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const peticion = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(null, { status: 202 })),
    );

    vi.stubGlobal('fetch', peticion);

    const registro = crearElRegistroDeSeguridad(
      validarConfiguracion({
        ...EN_PRE,
        REGISTRO_SEGURIDAD_URL: 'https://registros.ejemplo.co/ingesta',
        REGISTRO_SEGURIDAD_TOKEN: 'Bearer abc123',
        REGISTRO_SEGURIDAD_CLAVE_IP: 'una-clave-bien-larga-para-las-ip',
      }),
    ) as RegistroDeSeguridadEnSalida;

    registro.registrar({ tipo: 'DATOS_EXPORTADOS', idUsuario: ID });
    await registro.onModuleDestroy();

    expect(peticion).toHaveBeenCalledTimes(1);

    const [url, init] = peticion.mock.calls[0] ?? [];

    expect(url).toBe('https://registros.ejemplo.co/ingesta');
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer abc123' });
    expect(JSON.parse(typeof init?.body === 'string' ? init.body : 'null')).toEqual([
      expect.objectContaining({ tipo: 'DATOS_EXPORTADOS', idUsuario: ID }),
    ]);
  });

  it('sin servicio configurado no hay copia: no se llama a la red', async () => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    const peticion = vi.fn<typeof fetch>();

    vi.stubGlobal('fetch', peticion);

    const registro = crearElRegistroDeSeguridad(
      validarConfiguracion(EN_PRE),
    ) as RegistroDeSeguridadEnSalida;

    registro.registrar({ tipo: 'DATOS_EXPORTADOS', idUsuario: ID });
    await registro.onModuleDestroy();

    expect(peticion).not.toHaveBeenCalled();
  });
});
