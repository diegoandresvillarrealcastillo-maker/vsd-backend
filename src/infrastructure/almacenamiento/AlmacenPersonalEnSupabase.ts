import type { UserId } from '../../domain/model/Identifier.js';
import type {
  AlmacenPersonalPort,
  ArchivoPersonal,
} from '../../domain/ports/out/AlmacenPersonalPort.js';

/**
 * Tiempo maximo para que Storage responda. El borrado de la cuenta llama aqui
 * dentro de una transaccion abierta, y una transaccion no puede quedarse
 * esperando a la red indefinidamente.
 */
const ESPERA_MAXIMA_MS = 5000;

/** Lo que el bucket hace cumplir por su cuenta, aunque la API fallara. */
export interface RestriccionesDelBucket {
  readonly tiposPermitidos: readonly string[];
  /** En bytes. */
  readonly pesoMaximo: number;
}

/**
 * Lo que Storage dice cuando algo no esta, que **no siempre es un 404**: segun
 * la version, un objeto o un bucket que no existe responde 400 con
 * `statusCode: "404"` en el cuerpo, y uno que ya existe responde 400 con
 * `statusCode: "409"`. Se mira el cuerpo solo para decidir eso, y no se repite
 * en ningun error.
 */
async function dicePorElCuerpo(respuesta: Response, codigo: '404' | '409'): Promise<boolean> {
  try {
    const cuerpo = (await respuesta.json()) as { statusCode?: unknown };

    return String(cuerpo.statusCode) === codigo;
  } catch {
    return false;
  }
}

/**
 * Guarda **un archivo por persona** en un bucket privado de Supabase Storage
 * (SCRUM-120, ADR 0016).
 *
 * Usa la clave de servicio, que salta todas las politicas de seguridad. Es el
 * patron que Supabase documenta para un servidor propio, y por eso hay tres
 * protecciones que no dependen de ella:
 *
 * - **El navegador nunca habla con Storage.** Solo con nuestra API, que sale
 *   a Storage con la clave que el navegador no tiene.
 * - **El nombre del objeto es el identificador de la persona**, y ese sale del
 *   token verificado. No existe una entrada con la que pedir el archivo de
 *   otra: el puerto ni siquiera tiene un parametro para nombrarlo.
 * - **El bucket es privado y no tiene politicas**, asi que nadie con la clave
 *   publica ni con la sesion de otra persona puede abrirlo por su cuenta.
 *
 * Como `IdentidadesDeSupabase`, usa `fetch` y no el SDK: son tres llamadas, y
 * una dependencia entera para eso es mas superficie que vigilar.
 *
 * El bucket se crea solo la primera vez que se guarda algo, con su limite de
 * peso y sus tipos permitidos: asi no hay un paso manual que se pueda olvidar al
 * desplegar. Si ya existe, se deja como esta.
 */
export class AlmacenPersonalEnSupabase implements AlmacenPersonalPort {
  private bucketListo: Promise<void> | undefined;

  constructor(
    private readonly urlDeSupabase: string,
    private readonly claveDeServicio: string,
    private readonly bucket: string,
    private readonly restricciones: RestriccionesDelBucket,
    private readonly pedir: typeof fetch = globalThis.fetch,
  ) {}

  async guardar(persona: UserId, archivo: ArchivoPersonal): Promise<void> {
    await this.asegurarElBucket();

    const respuesta = await this.pedir(this.urlDelObjeto(persona), {
      method: 'POST',
      headers: {
        ...this.cabeceras(),
        'Content-Type': archivo.tipo,
        // Reemplaza el archivo anterior de la persona, si lo hay.
        'x-upsert': 'true',
      },
      // Una copia en un `Blob` y no los bytes sueltos: asi `fetch` manda justo
      // este contenido y no el bloque de memoria compartido que lo contiene.
      body: new Blob([new Uint8Array(archivo.contenido)], { type: archivo.tipo }),
      signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    });

    if (!respuesta.ok) {
      throw this.fallo('no guardo el archivo', respuesta);
    }
  }

  async leer(persona: UserId): Promise<ArchivoPersonal | undefined> {
    const respuesta = await this.pedir(this.urlDelObjeto(persona, 'authenticated'), {
      method: 'GET',
      headers: this.cabeceras(),
      signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    });

    if (respuesta.ok) {
      return {
        contenido: new Uint8Array(await respuesta.arrayBuffer()),
        tipo: respuesta.headers.get('content-type') ?? 'application/octet-stream',
      };
    }

    if (respuesta.status === 404 || (await dicePorElCuerpo(respuesta, '404'))) {
      return undefined;
    }

    throw this.fallo('no leyo el archivo', respuesta);
  }

  async borrar(persona: UserId): Promise<void> {
    const respuesta = await this.pedir(this.urlDelObjeto(persona), {
      method: 'DELETE',
      headers: this.cabeceras(),
      signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    });

    // No estaba: es justo lo que se queria.
    if (respuesta.ok || respuesta.status === 404 || (await dicePorElCuerpo(respuesta, '404'))) {
      return;
    }

    throw this.fallo('no borro el archivo', respuesta);
  }

  /**
   * Crea el bucket una sola vez por proceso. Si falla, la proxima vez lo
   * intenta de nuevo en lugar de recordar el fallo para siempre.
   */
  private asegurarElBucket(): Promise<void> {
    this.bucketListo ??= this.crearElBucket().catch((error: unknown) => {
      this.bucketListo = undefined;

      throw error;
    });

    return this.bucketListo;
  }

  private async crearElBucket(): Promise<void> {
    const respuesta = await this.pedir(`${this.urlDeSupabase}/storage/v1/bucket`, {
      method: 'POST',
      headers: { ...this.cabeceras(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.bucket,
        name: this.bucket,
        public: false,
        file_size_limit: this.restricciones.pesoMaximo,
        allowed_mime_types: [...this.restricciones.tiposPermitidos],
      }),
      signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    });

    // Ya existia: se deja como esta, que es lo que se quiere.
    if (respuesta.ok || respuesta.status === 409 || (await dicePorElCuerpo(respuesta, '409'))) {
      return;
    }

    throw this.fallo('no preparo el bucket', respuesta);
  }

  private urlDelObjeto(persona: UserId, via?: 'authenticated'): string {
    const ruta = `${encodeURIComponent(this.bucket)}/${encodeURIComponent(persona.value)}`;

    return `${this.urlDeSupabase}/storage/v1/object/${via === undefined ? '' : `${via}/`}${ruta}`;
  }

  private cabeceras(): Record<string, string> {
    return {
      apikey: this.claveDeServicio,
      Authorization: `Bearer ${this.claveDeServicio}`,
    };
  }

  /**
   * El cuerpo no va en el error: podria traer detalles del proyecto. El estado
   * basta para saber si fue la clave, un limite o una caida.
   */
  private fallo(que: string, respuesta: Response): Error {
    return new Error(`Supabase Storage ${que}: respondio ${respuesta.status}.`);
  }
}
