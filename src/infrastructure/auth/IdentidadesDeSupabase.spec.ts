import { describe, expect, it, vi } from 'vitest';
import { IdentidadesDeSupabase } from './IdentidadesDeSupabase.js';

const URL_DE_PRUEBA = 'https://pruebas.supabase.co';
// Deliberadamente sin pinta de credencial: el escaneo de secretos marca
// cualquier cadena con entropia en un campo que se llame clave.
const CLAVE = 'clave-de-servicio-de-prueba';

function proveedorQueResponde(estado: number) {
  const pedir = vi.fn<typeof fetch>(() =>
    Promise.resolve(new Response(estado === 204 ? null : 'detalle interno', { status: estado })),
  );

  return { pedir, identidades: new IdentidadesDeSupabase(URL_DE_PRUEBA, CLAVE, pedir) };
}

describe('IdentidadesDeSupabase', () => {
  it('borra con la API de administracion y la clave de servicio', async () => {
    const { pedir, identidades } = proveedorQueResponde(200);

    await identidades.borrarIdentidad('abc-123');

    const [url, opciones] = pedir.mock.calls[0] ?? [];

    expect(url).toBe('https://pruebas.supabase.co/auth/v1/admin/users/abc-123');
    expect(opciones?.method).toBe('DELETE');
    expect(opciones?.headers).toMatchObject({ apikey: CLAVE, Authorization: `Bearer ${CLAVE}` });
  });

  it('codifica el identificador para que no se pueda salir de la ruta', async () => {
    const { pedir, identidades } = proveedorQueResponde(200);

    await identidades.borrarIdentidad('../../otra/ruta');

    expect(pedir.mock.calls[0]?.[0]).toBe(
      'https://pruebas.supabase.co/auth/v1/admin/users/..%2F..%2Fotra%2Fruta',
    );
  });

  it('si la identidad ya no existia, no es un error', async () => {
    const { identidades } = proveedorQueResponde(404);

    await expect(identidades.borrarIdentidad('abc-123')).resolves.toBeUndefined();
  });

  it.each([401, 429, 500])('si Supabase responde %i, lanza', async (estado) => {
    const { identidades } = proveedorQueResponde(estado);

    await expect(identidades.borrarIdentidad('abc-123')).rejects.toThrow(String(estado));
  });

  it('el error no lleva la clave ni el cuerpo de la respuesta', async () => {
    const { identidades } = proveedorQueResponde(500);

    const error = await identidades.borrarIdentidad('abc-123').catch((e: unknown) => e);

    expect((error as Error).message).not.toContain(CLAVE);
    expect((error as Error).message).not.toContain('detalle interno');
  });
});
