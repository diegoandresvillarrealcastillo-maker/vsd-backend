import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  BaseDePruebasNoPermitidaError,
  esHostLocal,
  urlDeLaBaseDePruebas,
} from './baseDePruebas.js';
import { prepararRolDeLaAplicacion } from './rolDeLaAplicacion.js';

/**
 * Las pruebas de integracion solo pueden tocar la base que se les indica **a ellas** (SCRUM-261).
 *
 * Insertan, borran y hasta cambian la contrasena del rol `vsd_app`. Con `DATABASE_URL`, que es la
 * de la aplicacion, bastaba un `.env` apuntando a preproduccion para que todo eso ocurriera alli.
 * Ahora se lee solo `TEST_DATABASE_URL` y se comprueba que el destino es esta maquina antes de
 * construir ningun cliente.
 */
const CLAVE = 'clave-que-no-debe-salir-en-ningun-mensaje';

describe('urlDeLaBaseDePruebas', () => {
  it.each([undefined, '', '   '])('sin TEST_DATABASE_URL (%j) no hay base de pruebas', (valor) => {
    expect(urlDeLaBaseDePruebas({ TEST_DATABASE_URL: valor })).toBeUndefined();
  });

  it('no mira DATABASE_URL, que es la de la aplicacion y puede ser la de preproduccion', () => {
    const remota = `postgresql://postgres:${CLAVE}@db.abcdefgh.supabase.co:5432/postgres`;

    // Ni la usa como respaldo ni protesta: para estas pruebas no existe.
    expect(urlDeLaBaseDePruebas({ DATABASE_URL: remota })).toBeUndefined();
  });

  it.each([
    'postgresql://vsd:vsd_local@localhost:5432/vsd_health?schema=public',
    'postgresql://vsd:vsd_local@localhost:5433/vsd_health_pruebas',
    'postgresql://vsd:vsd_ci@127.0.0.1:5432/vsd_health',
    'postgresql://vsd:vsd_ci@[::1]:5432/vsd_health',
    'postgres://vsd@LOCALHOST/vsd_health',
  ])('acepta una base de esta maquina: %s', (url) => {
    expect(urlDeLaBaseDePruebas({ TEST_DATABASE_URL: url })).toBe(url);
  });

  it.each([
    [
      'la directa de Supabase',
      `postgresql://postgres:${CLAVE}@db.abcdefgh.supabase.co:5432/postgres`,
    ],
    [
      'el pooler de Supabase',
      `postgresql://postgres.abcdefgh:${CLAVE}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    ],
    ['una direccion de la red', `postgresql://vsd:${CLAVE}@10.0.0.5:5432/vsd_health`],
    [
      'un nombre que empieza como local',
      `postgresql://vsd:${CLAVE}@localhost.ejemplo.com/vsd_health`,
    ],
    [
      'una direccion que empieza como local',
      `postgresql://vsd:${CLAVE}@127.0.0.1.nip.io/vsd_health`,
    ],
    [
      'un servidor puesto en la consulta',
      `postgresql://vsd:${CLAVE}@localhost/vsd_health?host=db.ejemplo.com`,
    ],
    [
      'una direccion puesta en la consulta',
      `postgresql://vsd:${CLAVE}@localhost/vsd_health?hostaddr=10.0.0.5`,
    ],
    [
      'un servicio de pg_service.conf',
      `postgresql://vsd:${CLAVE}@localhost/vsd_health?service=preproduccion`,
    ],
    ['una URL sin servidor', 'postgresql:///vsd_health'],
    ['algo que no es una URL', `esto-no-es-una-url:${CLAVE}`],
  ])('rechaza %s', (_caso, url) => {
    expect(() => urlDeLaBaseDePruebas({ TEST_DATABASE_URL: url })).toThrow(
      BaseDePruebasNoPermitidaError,
    );
  });

  it('el mensaje de rechazo no lleva ni la contrasena ni la URL', () => {
    const url = `postgresql://postgres:${CLAVE}@db.abcdefgh.supabase.co:5432/postgres`;

    let mensaje = '';

    try {
      urlDeLaBaseDePruebas({ TEST_DATABASE_URL: url });
    } catch (error) {
      mensaje = (error as Error).message;
    }

    expect(mensaje).toContain('TEST_DATABASE_URL');
    expect(mensaje).not.toContain(CLAVE);
    expect(mensaje).not.toContain('supabase');
    expect(mensaje).not.toContain('postgres:');
  });
});

describe('esHostLocal', () => {
  it.each(['localhost', 'LOCALHOST', '127.0.0.1', '::1', '[::1]'])('%s es esta maquina', (host) => {
    expect(esHostLocal(host)).toBe(true);
  });

  it.each(['', 'db.supabase.co', '10.0.0.5', '0.0.0.0', 'localhost.ejemplo.com', '127.0.0.2'])(
    '«%s» no',
    (host) => {
      expect(esHostLocal(host)).toBe(false);
    },
  );
});

describe('prepararRolDeLaAplicacion', () => {
  /** Un cliente que solo anota lo que le piden, con el servidor al que dice estar conectado. */
  function clienteEn(host: string) {
    const query = vi.fn().mockResolvedValue({ rows: [] });

    return {
      cliente: { host, query } as unknown as Parameters<typeof prepararRolDeLaAplicacion>[0],
      query,
    };
  }

  it('no cambia la contrasena del rol si el cliente no esta conectado a esta maquina', async () => {
    const { cliente, query } = clienteEn('aws-0-us-east-1.pooler.supabase.com');

    await expect(prepararRolDeLaAplicacion(cliente)).rejects.toThrow(BaseDePruebasNoPermitidaError);

    // Ninguna consulta: ni el ALTER ROLE ni nada.
    expect(query).not.toHaveBeenCalled();
  });

  it('en esta maquina deja el rol listo', async () => {
    const { cliente, query } = clienteEn('localhost');

    await prepararRolDeLaAplicacion(cliente);

    expect(query).toHaveBeenCalledOnce();
    expect(String(query.mock.calls[0]?.[0])).toContain('ALTER ROLE vsd_app');
  });
});

describe('las suites de integracion no se saltan la regla', () => {
  /** Todos los `*.spec.ts` de `src`, sin ejecutarlos. */
  function especificaciones(carpeta: string): string[] {
    return readdirSync(carpeta).flatMap((nombre) => {
      const ruta = join(carpeta, nombre);

      if (statSync(ruta).isDirectory()) {
        return especificaciones(ruta);
      }

      return ruta.endsWith('.spec.ts') ? [ruta] : [];
    });
  }

  // Se arma por partes para que este archivo no se encuentre a si mismo.
  const CARGA_DEL_ENV = ['dot', 'env'].join('');
  const LECTURA_DE_LA_URL_DE_LA_APLICACION = ['process.env[', "'DATABASE", "_URL']"].join('');
  const archivos = especificaciones(join(process.cwd(), 'src'));

  it('hay archivos que revisar', () => {
    expect(archivos.length).toBeGreaterThan(100);
  });

  it('ninguna carga el .env por su cuenta', () => {
    const cargan = archivos.filter((ruta) => readFileSync(ruta, 'utf8').includes(CARGA_DEL_ENV));

    expect(cargan).toEqual([]);
  });

  it('ninguna lee DATABASE_URL como si fuera su base', () => {
    const leen = archivos.filter((ruta) =>
      readFileSync(ruta, 'utf8').includes(LECTURA_DE_LA_URL_DE_LA_APLICACION),
    );

    expect(leen).toEqual([]);
  });
});
