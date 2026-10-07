import type { UserId } from '../../model/Identifier.js';

/** Un archivo guardado: sus bytes y el tipo con el que se guardo. */
export interface ArchivoPersonal {
  readonly contenido: Uint8Array;
  /** Por ejemplo `image/png`. */
  readonly tipo: string;
}

/**
 * Puerto de salida para los archivos de cada persona (SCRUM-120, ADR 0016).
 *
 * Guarda **un archivo por persona**: su foto de perfil, o su mascota propia.
 * Cada uso tiene su propia instancia del puerto, con su propio espacio, asi que
 * dos usos distintos nunca se pisan.
 *
 * Todo se pide **por persona y nunca por nombre de archivo**. Quien llama no
 * puede decir «dame tal archivo»: solo «dame el de esta persona», y la persona
 * sale del token verificado. No hay forma de nombrar el de otra, que es lo que
 * hace imposible el acceso cruzado en lugar de prohibirlo.
 *
 * Como los demas puertos, esto es una interfaz y nada mas. Al otro lado hay
 * Supabase Storage o un `Map`, y al dominio no le importa cual.
 */
export interface AlmacenPersonalPort {
  /** Guarda el archivo de la persona. Si ya tenia uno, lo reemplaza. */
  guardar(persona: UserId, archivo: ArchivoPersonal): Promise<void>;

  /** El archivo de la persona, o `undefined` si no tiene. */
  leer(persona: UserId): Promise<ArchivoPersonal | undefined>;

  /** Borra el archivo de la persona. Borrar el que no existe no es un error. */
  borrar(persona: UserId): Promise<void>;
}
