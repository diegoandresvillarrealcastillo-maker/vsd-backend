import { describe, expect, it } from 'vitest';
import { Ambiente, validarConfiguracion } from './environment.js';

const VALIDA = {
  NODE_ENV: 'development',
  PORT: '3000',
  CORS_ORIGIN: 'http://localhost:5173',
  SUPABASE_URL: 'https://abcdefgh.supabase.co',
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
      SUPABASE_SERVICE_ROLE_KEY: 'clave-de-servicio-de-prueba',
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

  describe('TRUST_PROXY_HOPS (S-03 de la auditoria 360)', () => {
    it('sin ponerla no hay proxy de confianza: es lo correcto en local y en las pruebas', () => {
      expect(validarConfiguracion(VALIDA).saltosDeProxyDeConfianza).toBe(0);
    });

    it.each([
      ['0', 0],
      ['1', 1],
      ['2', 2],
      ['5', 5],
    ])('acepta %s saltos', (texto, esperado) => {
      expect(
        validarConfiguracion({ ...VALIDA, TRUST_PROXY_HOPS: texto }).saltosDeProxyDeConfianza,
      ).toBe(esperado);
    });

    it.each(['-1', '1.5', 'true', 'uno', '6', '100'])(
      'rechaza %s: tiene que ser un numero entero de 0 a 5, nunca `true`',
      (valor) => {
        // `true` confiaria en lo que escriba quien llama en X-Forwarded-For, y
        // Render no reescribe esa cabecera: el limite se esquivaria cambiandola.
        expect(() => validarConfiguracion({ ...VALIDA, TRUST_PROXY_HOPS: valor })).toThrow(
          /TRUST_PROXY_HOPS/,
        );
      },
    );

    it('el error no repite el valor recibido', () => {
      expect(() => validarConfiguracion({ ...VALIDA, TRUST_PROXY_HOPS: 'valor-raro-123' })).toThrow(
        expect.objectContaining({ message: expect.not.stringContaining('valor-raro-123') }),
      );
    });
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
    const configuracion = validarConfiguracion({
      CORS_ORIGIN: 'http://localhost:5173',
      SUPABASE_URL: 'https://abcdefgh.supabase.co',
    });

    expect(configuracion.puerto).toBe(3000);
    expect(configuracion.ambiente).toBe(Ambiente.DESARROLLO);
  });
});

describe('las claves VAPID (SCRUM-102)', () => {
  const CLAVES = {
    VAPID_PUBLIC_KEY: 'clave-publica',
    VAPID_PRIVATE_KEY: 'clave-privada',
    VAPID_SUBJECT: 'mailto:soporte@ejemplo.co',
  };

  it('sin ninguna no hay avisos, y el servicio arranca igual', () => {
    expect(validarConfiguracion(VALIDA).vapid).toBeUndefined();
  });

  it('con las tres, hay avisos', () => {
    expect(validarConfiguracion({ ...VALIDA, ...CLAVES }).vapid).toEqual({
      publica: 'clave-publica',
      privada: 'clave-privada',
      contacto: 'mailto:soporte@ejemplo.co',
    });
  });

  it('una suelta no deja arrancar, y el error no la muestra', () => {
    try {
      validarConfiguracion({ ...VALIDA, VAPID_PRIVATE_KEY: 'secreto-que-no-debe-salir' });
      expect.unreachable('deberia haber lanzado');
    } catch (error) {
      expect((error as Error).message).toMatch(/van las tres juntas/);
      expect((error as Error).message).not.toContain('secreto-que-no-debe-salir');
    }
  });

  it('el contacto es un correo o una web', () => {
    expect(() =>
      validarConfiguracion({ ...VALIDA, ...CLAVES, VAPID_SUBJECT: 'soporte@ejemplo.co' }),
    ).toThrow(/VAPID_SUBJECT/);
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
      SUPABASE_SERVICE_ROLE_KEY: 'clave-de-servicio-de-prueba',
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

describe('Supabase es obligatorio en todos los ambientes', () => {
  // A diferencia de DATABASE_URL, esta no tiene excepcion en desarrollo. Sin
  // ella la API no puede comprobar la firma de ningun token, y un ambiente
  // donde no se comprueba quien llama no es un ambiente comodo: es el
  // ambiente en el que se trabaja a diario.

  it.each(['development', 'test', 'preproduction', 'production'])(
    'no arranca en %s sin SUPABASE_URL',
    (ambiente) => {
      const { SUPABASE_URL: _omitida, ...sinSupabase } = VALIDA;

      expect(() =>
        validarConfiguracion({
          ...sinSupabase,
          NODE_ENV: ambiente,
          CORS_ORIGIN: 'https://vsd.example',
          DATABASE_URL: 'postgresql://x:y@z:5432/db',
        }),
      ).toThrow(/SUPABASE_URL/);
    },
  );

  it('rechaza algo que no es una URL', () => {
    // Confundir la referencia del proyecto con su URL es un despiste comun, y
    // aceptarlo daria un 401 en cada peticion sin decir por que.
    expect(() => validarConfiguracion({ ...VALIDA, SUPABASE_URL: 'abcdefgh' })).toThrow(
      /SUPABASE_URL/,
    );
  });

  it('quita la barra final para que la URL del JWKS no lleve dos', () => {
    const configuracion = validarConfiguracion({
      ...VALIDA,
      SUPABASE_URL: 'https://abcdefgh.supabase.co/',
    });

    expect(configuracion.urlDeSupabase).toBe('https://abcdefgh.supabase.co');
  });
});

describe('La clave de servicio es obligatoria fuera de local', () => {
  // Sin ella, borrar una cuenta dejaria la identidad de esa persona en
  // Supabase: el derecho de supresion a medias, y sin que nadie se entere.
  const PRODUCTIVA = {
    ...VALIDA,
    CORS_ORIGIN: 'https://vsd.example',
    DATABASE_URL: 'postgresql://x:y@z:5432/db',
  };

  it.each(['preproduction', 'production'])('no arranca en %s sin la clave', (ambiente) => {
    expect(() => validarConfiguracion({ ...PRODUCTIVA, NODE_ENV: ambiente })).toThrow(
      /SUPABASE_SERVICE_ROLE_KEY/,
    );
  });

  it('en desarrollo es opcional', () => {
    expect(validarConfiguracion(VALIDA).claveDeServicioDeSupabase).toBeUndefined();
  });

  it('el mensaje de error no incluye la clave recibida', () => {
    // La clave salta todas las politicas. Si apareciera en el error, acabaria
    // impresa en el registro del despliegue.
    try {
      validarConfiguracion({
        ...PRODUCTIVA,
        NODE_ENV: 'production',
        SUPABASE_SERVICE_ROLE_KEY: 'valor-que-no-debe-salir',
        PORT: 'no-es-un-numero',
      });
      expect.unreachable('deberia haber lanzado');
    } catch (error) {
      expect((error as Error).message).not.toContain('valor-que-no-debe-salir');
    }
  });
});
