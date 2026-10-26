import { describe, expect, it } from 'vitest';

import { URL_LOCAL_POR_OMISION, esDeEstaMaquina, urlDeDesarrollo } from './solo-local.mjs';

const PRE =
  'postgresql://postgres.abc:clave-secreta@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

describe('esDeEstaMaquina', () => {
  it.each([
    'postgresql://vsd:x@localhost:5432/vsd_health',
    'postgresql://vsd:x@127.0.0.1:5433/vsd_health',
    'postgresql://vsd:x@[::1]:5432/vsd_health',
    'postgresql://vsd:x@LOCALHOST/vsd_health',
  ])('%s es de esta maquina', (url) => {
    expect(esDeEstaMaquina(url)).toBe(true);
  });

  it.each([
    PRE,
    'postgresql://vsd:x@localhost.ejemplo.com:5432/vsd_health',
    'postgresql://vsd:x@10.0.0.5:5432/vsd_health',
    'postgresql://vsd:x@localhost:5432/vsd_health?host=db.remota.com',
    'postgresql://vsd:x@localhost:5432/vsd_health?hostaddr=10.0.0.5',
    'postgresql://vsd:x@localhost:5432/vsd_health?service=pre',
    'esto no es una url',
    '',
  ])('%s no lo es', (url) => {
    expect(esDeEstaMaquina(url)).toBe(false);
  });
});

describe('urlDeDesarrollo', () => {
  it('sin archivo usa la base local de siempre', () => {
    expect(urlDeDesarrollo(undefined)).toBe(URL_LOCAL_POR_OMISION);
  });

  it('con un archivo sin DIRECT_URL tambien', () => {
    expect(urlDeDesarrollo('OTRA_COSA=1\n')).toBe(URL_LOCAL_POR_OMISION);
    expect(urlDeDesarrollo('DIRECT_URL=\n')).toBe(URL_LOCAL_POR_OMISION);
  });

  it('usa la del archivo si es local (la base de pruebas de Docker, por ejemplo)', () => {
    const propia = 'postgresql://vsd:vsd_local@localhost:5433/vsd_health_pruebas';

    expect(urlDeDesarrollo(`DIRECT_URL=${propia}\n`)).toBe(propia);
  });

  it('se niega si la del archivo es de PRE, y el mensaje no la repite', () => {
    const intento = () => urlDeDesarrollo(`DIRECT_URL=${PRE}\n`);

    expect(intento).toThrow(/no es de esta maquina/u);
    expect(intento).not.toThrow(/clave-secreta|supabase/u);
  });

  it('no mira la DIRECT_URL de la terminal: solo la del archivo', () => {
    const anterior = process.env['DIRECT_URL'];
    process.env['DIRECT_URL'] = PRE;

    try {
      expect(urlDeDesarrollo(undefined)).toBe(URL_LOCAL_POR_OMISION);
    } finally {
      if (anterior === undefined) {
        delete process.env['DIRECT_URL'];
      } else {
        process.env['DIRECT_URL'] = anterior;
      }
    }
  });
});
