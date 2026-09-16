import { describe, expect, it } from 'vitest';
import { Ambiente, validarConfiguracion } from './environment.js';

const VALIDA = {
  NODE_ENV: 'development',
  PORT: '3000',
  CORS_ORIGIN: 'http://localhost:5173',
};

describe('validarConfiguracion', () => {
  it('acepta una configuracion valida', () => {
    const configuracion = validarConfiguracion(VALIDA);

    expect(configuracion.ambiente).toBe(Ambiente.DESARROLLO);
    expect(configuracion.puerto).toBe(3000);
    expect(configuracion.origenesAutorizados).toEqual(['http://localhost:5173']);
    expect(configuracion.esProduccion).toBe(false);
  });

  it('separa varios origenes y descarta los espacios', () => {
    const configuracion = validarConfiguracion({
      ...VALIDA,
      CORS_ORIGIN: 'http://localhost:5173 , https://vsd.example ',
    });

    expect(configuracion.origenesAutorizados).toEqual([
      'http://localhost:5173',
      'https://vsd.example',
    ]);
  });

  it('marca produccion cuando corresponde', () => {
    const configuracion = validarConfiguracion({
      ...VALIDA,
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://vsd.example',
      DATABASE_URL: 'postgresql://x:y@z:5432/db',
    });

    expect(configuracion.esProduccion).toBe(true);
  });

  it('exige CORS_ORIGIN', () => {
    const { CORS_ORIGIN: _omitida, ...sinOrigen } = VALIDA;

    expect(() => validarConfiguracion(sinOrigen)).toThrow(/CORS_ORIGIN/);
  });

  it('rechaza un puerto que no es numero', () => {
    expect(() => validarConfiguracion({ ...VALIDA, PORT: 'ochenta' })).toThrow(/PORT/);
  });

  it('rechaza un ambiente desconocido', () => {
    expect(() => validarConfiguracion({ ...VALIDA, NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });

  it('permite el comodin de CORS solo en desarrollo', () => {
    expect(() => validarConfiguracion({ ...VALIDA, CORS_ORIGIN: '*' })).not.toThrow();
  });

  it.each(['preproduction', 'production'])('rechaza el comodin de CORS en %s', (ambiente) => {
    // Dejar el comodin fuera de desarrollo permitiria que cualquier sitio web
    // llamara a la API desde el navegador de un usuario con sesion iniciada.
    expect(() => validarConfiguracion({ ...VALIDA, NODE_ENV: ambiente, CORS_ORIGIN: '*' })).toThrow(
      /comodin/,
    );
  });

  it('el mensaje de error nunca incluye el valor recibido', () => {
    // Un valor invalido puede ser una credencial mal copiada, y el mensaje de
    // arranque acaba impreso en el registro del proveedor de despliegue.
    const secreto = 'postgres://usuario:contrasena-secreta@host:5432/db';

    try {
      validarConfiguracion({ ...VALIDA, PORT: secreto });
      expect.unreachable('deberia haber lanzado');
    } catch (error) {
      expect((error as Error).message).not.toContain('contrasena-secreta');
    }
  });

  it('usa valores por defecto razonables para lo que no es sensible', () => {
    const configuracion = validarConfiguracion({ CORS_ORIGIN: 'http://localhost:5173' });

    expect(configuracion.puerto).toBe(3000);
    expect(configuracion.ambiente).toBe(Ambiente.DESARROLLO);
  });
});

describe('La base de datos es obligatoria fuera de desarrollo', () => {
  // Sin DATABASE_URL el servicio guarda en memoria y al reiniciarse no queda
  // nada. En desarrollo eso es comodo. En preproduccion o produccion seria
  // perder resultados de personas reales sin que nadie se entere hasta que
  // alguien pregunte por su historial.

  it.each(['preproduction', 'production'])('no arranca en %s sin DATABASE_URL', (ambiente) => {
    expect(() =>
      validarConfiguracion({ ...VALIDA, NODE_ENV: ambiente, CORS_ORIGIN: 'https://vsd.example' }),
    ).toThrow(/DATABASE_URL/);
  });

  it.each(['preproduction', 'production'])('arranca en %s con DATABASE_URL', (ambiente) => {
    const configuracion = validarConfiguracion({
      ...VALIDA,
      NODE_ENV: ambiente,
      CORS_ORIGIN: 'https://vsd.example',
      DATABASE_URL: 'postgresql://x:y@z:5432/db',
    });

    expect(configuracion.urlBaseDeDatos).toBe('postgresql://x:y@z:5432/db');
  });

  it('en desarrollo si arranca sin base de datos', () => {
    const configuracion = validarConfiguracion({ ...VALIDA });

    expect(configuracion.urlBaseDeDatos).toBeUndefined();
  });

  it('una cadena vacia cuenta como ausente, no como valida', () => {
    // Un .env con la linea presente pero sin valor es un despiste comun, y
    // tratarlo como una URL valida haria fallar la conexion mucho mas tarde.
    expect(() =>
      validarConfiguracion({
        ...VALIDA,
        NODE_ENV: 'production',
        CORS_ORIGIN: 'https://vsd.example',
        DATABASE_URL: '   ',
      }),
    ).toThrow(/DATABASE_URL/);
  });

  it('el mensaje de error no incluye la cadena de conexion recibida', () => {
    // Una URL de conexion lleva usuario y contrasena dentro. Si apareciera en
    // el error, acabaria impresa en el registro del despliegue.
    try {
      validarConfiguracion({
        ...VALIDA,
        NODE_ENV: 'production',
        CORS_ORIGIN: 'https://vsd.example',
        DATABASE_URL: '',
        PORT: 'no-es-un-numero',
      });
      expect.unreachable('deberia haber lanzado');
    } catch (error) {
      expect((error as Error).message).not.toContain('no-es-un-numero');
    }
  });
});
