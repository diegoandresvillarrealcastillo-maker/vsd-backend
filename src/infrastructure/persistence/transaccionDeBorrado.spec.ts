import { describe, expect, it } from 'vitest';
import { ESPERA_MAXIMA_MS as ESPERA_DEL_ALMACEN_MS } from '../almacenamiento/AlmacenPersonalEnSupabase.js';
import { ESPERA_MAXIMA_MS as ESPERA_DE_LA_IDENTIDAD_MS } from '../auth/IdentidadesDeSupabase.js';
import { TRANSACCION_DE_BORRADO } from './PrismaService.js';

/**
 * Lo externo de una baja cabe en su transaccion (SCRUM-260).
 *
 * Cada llamada de fuera tiene su tope, pero lo que importa es la **suma**: si alguien sube uno de
 * los topes, o anade otro almacen, y la transaccion no crece con ellos, vuelve el fallo de que la
 * transaccion venza con los archivos y la identidad ya borrados y las filas de vuelta. Esta prueba
 * lo avisa antes.
 */
describe('la transaccion de borrado y lo externo que espera', () => {
  /** Los almacenes que cablea `UsuariosModule` para la baja: la foto y la mascota propia. */
  const ALMACENES = 2;

  it('los topes de lo externo, sumados, caben con holgura en el tiempo de la transaccion', () => {
    const peorCaso = ALMACENES * ESPERA_DEL_ALMACEN_MS + ESPERA_DE_LA_IDENTIDAD_MS;

    // Sin holgura no hay sitio para las consultas de la baja ni para un tropiezo de la red.
    expect(peorCaso).toBeLessThanOrEqual(TRANSACCION_DE_BORRADO.timeout * 0.75);
  });

  it('esperar una conexion libre dura menos que la propia transaccion', () => {
    expect(TRANSACCION_DE_BORRADO.maxWait).toBeLessThan(TRANSACCION_DE_BORRADO.timeout);
  });
});
