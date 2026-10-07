import type { UserId } from '../domain/model/Identifier.js';
import type {
  AlmacenPersonalPort,
  ArchivoPersonal,
} from '../domain/ports/out/AlmacenPersonalPort.js';

/**
 * Doble del almacen de archivos para probar la capa de aplicacion (SCRUM-120).
 *
 * Solo depende del dominio, como pide la frontera de `application/`: no usa el
 * adaptador en memoria de `infrastructure/`. Hace tres cosas que ese no hace y
 * que las pruebas necesitan:
 *
 * - **anota las llamadas**, para comprobar que no se pregunto al almacenamiento
 *   cuando no habia nada que preguntar;
 * - **puede fallar a voluntad**, con un mensaje que no debe salir en ninguna
 *   respuesta;
 * - **deja mirar lo guardado sin contar como una llamada**, para comprobar el
 *   resultado sin ensuciar lo anotado.
 */
export class AlmacenDoble implements AlmacenPersonalPort {
  private readonly archivos = new Map<string, ArchivoPersonal>();

  /** `guardar`, `leer` o `borrar`, en el orden en que se pidieron. */
  readonly llamadas: string[] = [];

  /** Con esto en `true`, la proxima llamada falla como si Storage no respondiera. */
  falla = false;

  guardar(persona: UserId, archivo: ArchivoPersonal): Promise<void> {
    return this.anotar('guardar', () => {
      this.archivos.set(persona.value, {
        contenido: new Uint8Array(archivo.contenido),
        tipo: archivo.tipo,
      });
    });
  }

  leer(persona: UserId): Promise<ArchivoPersonal | undefined> {
    return this.anotar('leer', () => this.mirar(persona));
  }

  borrar(persona: UserId): Promise<void> {
    return this.anotar('borrar', () => {
      this.archivos.delete(persona.value);
    });
  }

  /** Lo guardado de esa persona, sin contar como una llamada. */
  mirar(persona: UserId): ArchivoPersonal | undefined {
    const guardado = this.archivos.get(persona.value);

    return guardado === undefined
      ? undefined
      : { contenido: new Uint8Array(guardado.contenido), tipo: guardado.tipo };
  }

  /** Deja un archivo ahi sin pasar por `guardar`: un resto de un intento a medias. */
  sembrar(persona: UserId, archivo: ArchivoPersonal): void {
    this.archivos.set(persona.value, archivo);
  }

  get cantidad(): number {
    return this.archivos.size;
  }

  private anotar<T>(que: string, accion: () => T): Promise<T> {
    this.llamadas.push(que);

    if (this.falla) {
      return Promise.reject(
        new Error('Supabase Storage respondio 500 con detalles que no deben salir'),
      );
    }

    return Promise.resolve(accion());
  }
}
