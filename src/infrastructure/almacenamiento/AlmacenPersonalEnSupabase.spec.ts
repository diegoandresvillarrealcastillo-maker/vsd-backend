import { describe, expect, it, vi } from 'vitest';
import { UserId } from '../../domain/model/Identifier.js';
import { AlmacenPersonalEnSupabase } from './AlmacenPersonalEnSupabase.js';

const URL_DE_SUPABASE = 'https://abcdefgh.supabase.co';
// Deliberadamente sin pinta de credencial: el escaneo de secretos marca
// cualquier cadena con entropia que parezca una clave.
const CLAVE = 'clave-de-servicio-de-prueba';
const ANA = new UserId('11111111-1111-4111-8111-111111111111');

interface Peticion {
  readonly url: string;
  readonly metodo: string;
  readonly cabeceras: Record<string, string>;
  readonly cuerpo: unknown;
  readonly tieneLimiteDeEspera: boolean;
}

/** Un `fetch` que anota lo que le piden y contesta lo que se le diga, en orden. */
function armar(...respuestas: Response[]) {
  const peticiones: Peticion[] = [];
  const pendientes = [...respuestas];

  const pedir = vi.fn((url: string | URL | Request, init?: RequestInit) => {
    peticiones.push({
      url: typeof url === 'string' ? url : url instanceof URL ? url.href : url.url,
      metodo: init?.method ?? 'GET',
      cabeceras: { ...(init?.headers as Record<string, string>) },
      cuerpo: init?.body,
      tieneLimiteDeEspera: init?.signal instanceof AbortSignal,
    });

    return Promise.resolve(pendientes.shift() ?? new Response('{}', { status: 200 }));
  }) as unknown as typeof fetch;

  const almacen = new AlmacenPersonalEnSupabase(
    URL_DE_SUPABASE,
    CLAVE,
    'fotos-de-perfil',
    { tiposPermitidos: ['image/jpeg', 'image/png'], pesoMaximo: 51_200 },
    pedir,
  );

  return { almacen, peticiones };
}

const ok = (): Response => new Response('{}', { status: 200 });
const estado = (codigo: number, cuerpo = '{}'): Response =>
  new Response(cuerpo, { status: codigo });

const ARCHIVO = { contenido: Uint8Array.from([1, 2, 3, 4]), tipo: 'image/png' };

async function bytesDe(cuerpo: unknown): Promise<Uint8Array> {
  return new Uint8Array(await new Response(cuerpo as Blob).arrayBuffer());
}

describe('AlmacenPersonalEnSupabase (SCRUM-120)', () => {
  describe('guardar', () => {
    it('crea el bucket privado, con su limite y sus tipos, y despues sube el archivo', async () => {
      const { almacen, peticiones } = armar(ok(), ok());

      await almacen.guardar(ANA, ARCHIVO);

      expect(peticiones).toHaveLength(2);

      const [bucket, subida] = peticiones;

      expect(bucket?.url).toBe(`${URL_DE_SUPABASE}/storage/v1/bucket`);
      expect(bucket?.metodo).toBe('POST');
      expect(JSON.parse(String(bucket?.cuerpo))).toEqual({
        id: 'fotos-de-perfil',
        name: 'fotos-de-perfil',
        public: false,
        file_size_limit: 51_200,
        allowed_mime_types: ['image/jpeg', 'image/png'],
      });

      expect(subida?.url).toBe(`${URL_DE_SUPABASE}/storage/v1/object/fotos-de-perfil/${ANA.value}`);
      expect(subida?.metodo).toBe('POST');
      expect(subida?.cabeceras['Content-Type']).toBe('image/png');
      expect(subida?.cabeceras['x-upsert']).toBe('true');
      expect(await bytesDe(subida?.cuerpo)).toEqual(ARCHIVO.contenido);
    });

    it('el bucket nunca es publico', async () => {
      const { almacen, peticiones } = armar(ok(), ok());

      await almacen.guardar(ANA, ARCHIVO);

      expect(JSON.parse(String(peticiones[0]?.cuerpo))).toMatchObject({ public: false });
    });

    it('el bucket se prepara una sola vez, no en cada foto', async () => {
      const { almacen, peticiones } = armar(ok(), ok(), ok());

      await almacen.guardar(ANA, ARCHIVO);
      await almacen.guardar(ANA, ARCHIVO);

      expect(peticiones.map((p) => p.url)).toEqual([
        `${URL_DE_SUPABASE}/storage/v1/bucket`,
        `${URL_DE_SUPABASE}/storage/v1/object/fotos-de-perfil/${ANA.value}`,
        `${URL_DE_SUPABASE}/storage/v1/object/fotos-de-perfil/${ANA.value}`,
      ]);
    });

    it('dos fotos a la vez comparten la misma preparacion del bucket', async () => {
      const { almacen, peticiones } = armar(ok(), ok(), ok());

      await Promise.all([almacen.guardar(ANA, ARCHIVO), almacen.guardar(ANA, ARCHIVO)]);

      expect(peticiones.filter((p) => p.url.endsWith('/storage/v1/bucket'))).toHaveLength(1);
    });

    it.each([
      ['409', estado(409, '{"statusCode":"409","error":"Duplicate"}')],
      ['400 con 409 en el cuerpo', estado(400, '{"statusCode":"409","error":"Duplicate"}')],
    ])('si el bucket ya existia (%s), se deja como esta y se sube', async (_caso, existe) => {
      const { almacen, peticiones } = armar(existe, ok());

      await almacen.guardar(ANA, ARCHIVO);

      expect(peticiones).toHaveLength(2);
    });

    it('si no se pudo preparar el bucket, falla y no sube nada', async () => {
      const { almacen, peticiones } = armar(estado(403));

      await expect(almacen.guardar(ANA, ARCHIVO)).rejects.toThrow(/403/);

      expect(peticiones).toHaveLength(1);
    });

    it('si fallo preparar el bucket, la proxima vez lo intenta de nuevo', async () => {
      const { almacen, peticiones } = armar(estado(500), ok(), ok());

      await expect(almacen.guardar(ANA, ARCHIVO)).rejects.toThrow();
      await almacen.guardar(ANA, ARCHIVO);

      expect(peticiones.filter((p) => p.url.endsWith('/storage/v1/bucket'))).toHaveLength(2);
    });

    it('si la subida falla, lo dice con el estado y sin el cuerpo', async () => {
      const { almacen } = armar(ok(), estado(500, '{"detalle":"secreto-del-proyecto"}'));

      const error = (await almacen.guardar(ANA, ARCHIVO).catch((e: unknown) => e)) as Error;

      expect(error.message).toContain('500');
      expect(error.message).not.toContain('secreto-del-proyecto');
    });

    it('sube exactamente el contenido, aunque venga de un bloque de memoria mayor', async () => {
      const bloque = new Uint8Array(100);

      bloque.set([7, 8, 9], 40);

      const { almacen, peticiones } = armar(ok(), ok());

      await almacen.guardar(ANA, { contenido: bloque.subarray(40, 43), tipo: 'image/png' });

      expect(await bytesDe(peticiones[1]?.cuerpo)).toEqual(Uint8Array.from([7, 8, 9]));
    });
  });

  describe('leer', () => {
    it('pide el objeto autenticado de esa persona y devuelve los bytes con su tipo', async () => {
      const { almacen, peticiones } = armar(
        new Response(Uint8Array.from([5, 6, 7]), {
          status: 200,
          headers: { 'content-type': 'image/jpeg' },
        }),
      );

      expect(await almacen.leer(ANA)).toEqual({
        contenido: Uint8Array.from([5, 6, 7]),
        tipo: 'image/jpeg',
      });
      expect(peticiones[0]?.url).toBe(
        `${URL_DE_SUPABASE}/storage/v1/object/authenticated/fotos-de-perfil/${ANA.value}`,
      );
      expect(peticiones[0]?.metodo).toBe('GET');
    });

    it('sin tipo en la respuesta, se queda con uno generico', async () => {
      const { almacen } = armar(new Response(Uint8Array.from([1]), { status: 200 }));

      expect((await almacen.leer(ANA))?.tipo).toMatch(/octet-stream|text\/plain/);
    });

    it.each([
      ['404', estado(404)],
      ['400 con 404 en el cuerpo', estado(400, '{"statusCode":"404","error":"not_found"}')],
    ])('si no esta (%s), devuelve undefined', async (_caso, noEsta) => {
      const { almacen } = armar(noEsta);

      expect(await almacen.leer(ANA)).toBeUndefined();
    });

    it('un error del servicio no se confunde con que no hay foto', async () => {
      const { almacen } = armar(estado(500));

      await expect(almacen.leer(ANA)).rejects.toThrow(/500/);
    });

    it('un 400 que no dice 404 tampoco es «no esta»', async () => {
      const { almacen } = armar(estado(400, '{"statusCode":"400","error":"Invalid"}'));

      await expect(almacen.leer(ANA)).rejects.toThrow(/400/);
    });

    it('no prepara el bucket: leer no lo necesita', async () => {
      const { almacen, peticiones } = armar(estado(404));

      await almacen.leer(ANA);

      expect(peticiones).toHaveLength(1);
    });
  });

  describe('borrar', () => {
    it('borra el objeto de esa persona', async () => {
      const { almacen, peticiones } = armar(ok());

      await almacen.borrar(ANA);

      expect(peticiones[0]?.url).toBe(
        `${URL_DE_SUPABASE}/storage/v1/object/fotos-de-perfil/${ANA.value}`,
      );
      expect(peticiones[0]?.metodo).toBe('DELETE');
    });

    it.each([
      ['404', estado(404)],
      ['400 con 404 en el cuerpo', estado(400, '{"statusCode":"404","error":"not_found"}')],
    ])('si ya no estaba (%s), no es un error', async (_caso, noEstaba) => {
      const { almacen } = armar(noEstaba);

      await expect(almacen.borrar(ANA)).resolves.toBeUndefined();
    });

    it('un error del servicio si lo es: se tiene que enterar quien borra la cuenta', async () => {
      const { almacen } = armar(estado(503));

      await expect(almacen.borrar(ANA)).rejects.toThrow(/503/);
    });

    it('no prepara el bucket: borrar no lo necesita', async () => {
      const { almacen, peticiones } = armar(ok());

      await almacen.borrar(ANA);

      expect(peticiones).toHaveLength(1);
    });
  });

  describe('en todas las llamadas', () => {
    it('lleva la clave de servicio, y solo en las cabeceras', async () => {
      const { almacen, peticiones } = armar(ok(), ok(), estado(404), ok());

      await almacen.guardar(ANA, ARCHIVO);
      await almacen.leer(ANA);
      await almacen.borrar(ANA);

      expect(peticiones).toHaveLength(4);

      for (const peticion of peticiones) {
        expect(peticion.cabeceras['apikey']).toBe(CLAVE);
        expect(peticion.cabeceras['Authorization']).toBe(`Bearer ${CLAVE}`);
        expect(peticion.url).not.toContain(CLAVE);
      }
    });

    it('espera un tiempo limitado: una transaccion no se queda colgada de la red', async () => {
      const { almacen, peticiones } = armar(ok(), ok(), estado(404), ok());

      await almacen.guardar(ANA, ARCHIVO);
      await almacen.leer(ANA);
      await almacen.borrar(ANA);

      expect(peticiones.every((p) => p.tieneLimiteDeEspera)).toBe(true);
    });

    it('el nombre del objeto es el identificador de la persona y nada mas', async () => {
      const { almacen, peticiones } = armar(estado(404));

      await almacen.leer(ANA);

      expect(peticiones[0]?.url.endsWith(`/fotos-de-perfil/${ANA.value}`)).toBe(true);
    });
  });
});
