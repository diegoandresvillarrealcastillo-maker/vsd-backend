import type { VarianteDeLaCharla } from '../../model/ReglasDelAsistente.js';
import type { RecursoApoyo } from '../../model/RecursoApoyo.js';
import type { Intencion } from './AsistentePort.js';

/**
 * La version de la **forma** de lo que se publica (no de su contenido).
 *
 * El contenido lo identifica el `ETag`: cambia cada vez que cambia una regla o
 * una linea. Esto cambia solo cuando cambia **como esta escrito** el paquete,
 * y existe para que una aplicacion vieja, guardada en el dispositivo de alguien,
 * no intente leer algo que ya no entiende: si el esquema que llega no es el que
 * conoce, no lo usa y sigue con lo que tenia.
 */
export const ESQUEMA_DE_LAS_REGLAS_LOCALES = 1;

/** Una regla de charla, lista para que el dispositivo la aplique. */
export interface ReglaLocalDeCharla {
  readonly intencion: Intencion;
  readonly patrones: readonly string[];
  /**
   * Lo que se responde sin conexion, o `null` si esa intencion no se puede
   * responder sin conexion. Una regla que no se responde sin red **se publica
   * igual**: su sitio en el orden es lo que impide que "hola, como estas" se lea
   * como un saludo.
   */
  readonly mensaje: string | null;
  readonly variantes: readonly VarianteDeLaCharla[];
}

/** Una regla de las que buscan una palabra o una frase dentro del mensaje. */
export interface ReglaLocalDeIntencion {
  readonly intencion: Intencion;
  readonly patrones: readonly string[];
  /** Lo que se responde sin conexion, o `null` si esa intencion exige conexion. */
  readonly mensaje: string | null;
  /** Cierto si la respuesta lleva las lineas de atencion del pais de la persona. */
  readonly conLineas: boolean;
}

/** Un pais con lineas verificadas: sus zonas horarias y sus lineas. */
export interface PaisConLineas {
  readonly zonas: readonly string[];
  readonly lineas: readonly RecursoApoyo[];
}

/**
 * Todo lo que hace falta para que VSD IA responda lo basico sin conexion.
 *
 * Son **los mismos datos que usa el servidor** para responder con conexion
 * (`ReglasDelAsistente.ts`, `SenalesDeRiesgo.ts`, `PaisDeAyuda.ts` y la tabla de
 * recursos): no hay una segunda lista.
 */
export interface ReglasLocalesDelAsistente {
  readonly esquema: number;
  /** La deteccion de riesgo. Va siempre primero, igual que en el servidor. */
  readonly riesgo: {
    /** Expresiones ya normalizadas (sin tildes, en minusculas). */
    readonly expresiones: readonly string[];
    readonly mensaje: string;
  };
  /** La charla de todos los dias: solo cuenta si el mensaje entero es charla. */
  readonly charla: {
    /** En el orden en que se evaluan: la primera que coincide gana. */
    readonly reglas: readonly ReglaLocalDeCharla[];
    readonly relleno: readonly string[];
  };
  /** Lo demas que el servidor reconoce, en su orden. */
  readonly intenciones: readonly ReglaLocalDeIntencion[];
  /** Los paises con lineas verificadas, por su codigo de dos letras. */
  readonly paises: Readonly<Record<string, PaisConLineas>>;
  /** Lo que recibe quien esta en una zona sin pais: el directorio internacional. */
  readonly internacional: readonly RecursoApoyo[];
}

/**
 * Puerto de entrada para consultar las reglas que se aplican en el dispositivo.
 *
 * Es una lectura sin parametros y publica: lo que devuelve es lo mismo para todo
 * el mundo y no sale de la cuenta de nadie. Se necesita justo cuando no hay red
 * ni, a veces, sesion, asi que no puede depender de ninguna de las dos.
 */
export interface ConsultarLasReglasLocalesUseCase {
  ejecutar(): Promise<ReglasLocalesDelAsistente>;
}
