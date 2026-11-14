import type { UserId } from '../../domain/model/Identifier.js';
import type {
  AlmacenPersonalPort,
  ArchivoPersonal,
} from '../../domain/ports/out/AlmacenPersonalPort.js';

/**
 * Almacen de archivos en memoria.
 *
 * Sirve para probar la capa de aplicacion sin Supabase, y para el arranque sin
 * `SUPABASE_SERVICE_ROLE_KEY` —en local—. Fuera de local nunca se usa: la
 * configuracion exige esa clave en preproduccion y produccion.
 *
 * Guarda una **copia** de lo que recibe y entrega otra copia de lo que tiene:
 * si guardara la referencia, quien la modificara despues cambiaria lo
 * guardado sin haber llamado a `guardar`, y un adaptador asi diria cosas que el
 * real no dice.
 *
 * Aviso, el mismo que llevan los otros adaptadores en memoria: esto no
 * sustituye a probar el adaptador real. Un `Map` no tiene limites de tamano ni
 * de tipo, ni autenticacion, ni red que falle.
 */
export class AlmacenPersonalEnMemoria implements AlmacenPersonalPort {
  private readonly archivos = new Map<string, ArchivoPersonal>();

  guardar(persona: UserId, archivo: ArchivoPersonal): Promise<void> {
    this.archivos.set(persona.value, {
      contenido: new Uint8Array(archivo.contenido),
      tipo: archivo.tipo,
    });

    return Promise.resolve();
  }

  leer(persona: UserId): Promise<ArchivoPersonal | undefined> {
    const guardado = this.archivos.get(persona.value);

    return Promise.resolve(
      guardado === undefined
        ? undefined
        : { contenido: new Uint8Array(guardado.contenido), tipo: guardado.tipo },
    );
  }

  borrar(persona: UserId): Promise<void> {
    this.archivos.delete(persona.value);

    return Promise.resolve();
  }

  /** Cuantos archivos hay guardados. Solo para pruebas. */
  get cantidad(): number {
    return this.archivos.size;
  }
}
