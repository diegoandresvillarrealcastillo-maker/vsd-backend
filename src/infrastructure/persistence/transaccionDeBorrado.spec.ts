import { describe, expect, it } from 'vitest';
import { ESPERA_ANTES_DE_REINTENTAR_MS } from '../../application/usecases/TerminarBajasPendientesUseCaseImpl.js';
import { ESPERA_MAXIMA_MS as ESPERA_DEL_ALMACEN_MS } from '../almacenamiento/AlmacenPersonalEnSupabase.js';
import { ESPERA_MAXIMA_MS as ESPERA_DE_LA_IDENTIDAD_MS } from '../auth/IdentidadesDeSupabase.js';
import { TRANSACCION_DE_BORRADO } from './PrismaService.js';

/**
 * Los tiempos de la baja (SCRUM-260, ADR 0040).
 *
 * Desde el ADR 0040 lo externo de la baja ya no corre dentro de ninguna transaccion: la marca y el
 * borrado de las filas son transacciones cortas, y lo de fuera va entre las dos. Lo que hay que
 * vigilar ahora es que la tarea que termina las bajas cortadas no pise una que sigue en curso.
 */
describe('los tiempos de la baja', () => {
  /** Los almacenes que cablea `UsuariosModule` para la baja: la foto y la mascota propia. */
  const ALMACENES = 2;
  /** El tiempo por omision de una transaccion de Prisma, que es el de la marca. */
  const TRANSACCION_DE_LA_MARCA_MS = 5_000;

  it('una baja en curso, en el peor caso, termina mucho antes de que la tarea la tome', () => {
    const peorCaso =
      TRANSACCION_DE_LA_MARCA_MS +
      ALMACENES * ESPERA_DEL_ALMACEN_MS +
      ESPERA_DE_LA_IDENTIDAD_MS +
      TRANSACCION_DE_BORRADO.timeout;

    // Si alguien sube un tope o anade un almacen, y la espera de la tarea no crece con ellos, la
    // tarea repetiria una baja que todavia sigue. Es seguro (los pasos son idempotentes), pero
    // convierte el reintento en un choque. Esta prueba lo avisa antes.
    expect(peorCaso).toBeLessThanOrEqual(ESPERA_ANTES_DE_REINTENTAR_MS / 2);
  });

  it('esperar una conexion libre dura menos que la propia transaccion de borrado', () => {
    expect(TRANSACCION_DE_BORRADO.maxWait).toBeLessThan(TRANSACCION_DE_BORRADO.timeout);
  });
});
