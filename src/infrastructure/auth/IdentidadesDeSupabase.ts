import { Logger } from '@nestjs/common';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';

/**
 * Tiempo maximo para que Supabase responda. El borrado ocurre dentro de una
 * transaccion abierta, y una transaccion no puede quedarse esperando a la red
 * indefinidamente.
 */
const ESPERA_MAXIMA_MS = 4000;

/**
 * Borra identidades con la API de administracion de Supabase Auth.
 *
 * Es el unico sitio del backend que usa la clave de servicio, y solo para
 * esto. Esa clave salta todas las politicas de seguridad: por eso no se usa
 * para leer ni escribir datos, que siguen pasando por `vsd_app` y sus
 * politicas.
 */
export class IdentidadesDeSupabase implements ProveedorDeIdentidadPort {
  constructor(
    private readonly urlDeSupabase: string,
    private readonly claveDeServicio: string,
    private readonly pedir: typeof fetch = globalThis.fetch,
  ) {}

  async borrarIdentidad(idProveedorAuth: string): Promise<void> {
    const respuesta = await this.pedir(
      `${this.urlDeSupabase}/auth/v1/admin/users/${encodeURIComponent(idProveedorAuth)}`,
      {
        method: 'DELETE',
        headers: {
          apikey: this.claveDeServicio,
          Authorization: `Bearer ${this.claveDeServicio}`,
        },
        signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
      },
    );

    // 404: ya no existia, que es justo lo que se queria.
    if (respuesta.ok || respuesta.status === 404) {
      return;
    }

    // El cuerpo no va en el error: podria traer detalles del proyecto. El
    // estado basta para saber si fue la clave, un limite o una caida.
    throw new Error(`Supabase no borro la identidad: respondio ${respuesta.status}.`);
  }
}

/**
 * Sustituto para desarrollo y pruebas, donde no hay clave de servicio.
 *
 * No borra nada en Supabase y lo dice en el registro cada vez. Fuera de local
 * nunca se usa: la configuracion exige la clave en preproduccion y produccion.
 */
export class IdentidadesSinAdministracion implements ProveedorDeIdentidadPort {
  private readonly registro = new Logger('Identidades');

  borrarIdentidad(): Promise<void> {
    this.registro.warn(
      'Sin SUPABASE_SERVICE_ROLE_KEY: la cuenta se borra aqui, pero la identidad queda en Supabase.',
    );

    return Promise.resolve();
  }
}
