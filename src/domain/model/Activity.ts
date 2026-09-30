import { InvalidActivityConfigurationError, InvalidScoreRangeError } from './DomainError.js';
import { ActivityId } from './Identifier.js';
import { NivelOrientativo } from './OrientativeScore.js';

/**
 * Como se interpreta el puntaje de una actividad.
 *
 * Es el campo que corrige un error silencioso: no rompe ninguna prueba, no
 * falla la compilacion, y solo se nota cuando alguien lee un resultado que
 * dice lo contrario de lo que siente.
 *
 * En un juego de memoria, un puntaje alto significa que le fue bien. En un
 * cuestionario sobre la carga de la semana, significa lo contrario. Derivar el
 * nivel igual para las dos le mostraria un resultado favorable justamente a
 * quien peor esta.
 */
export const DireccionEscala = {
  /** Mas puntaje es mejor: juegos de memoria, atencion, concentracion. */
  MAYOR_ES_MEJOR: 'mayor_es_mejor',
  /** Mas puntaje indica mas carga: cuestionarios de tension o animo. */
  MAYOR_REQUIERE_ATENCION: 'mayor_requiere_atencion',
  /**
   * No produce puntaje: la actividad registra y no valora.
   *
   * Es **esta columna**, y no el `tipo` de la actividad, la que decide si hay
   * nivel que mostrar. Las dos son independientes: `tipo` dice como se hace la
   * actividad y esto dice si se valora.
   *
   * El catalogo lo demuestra. "Movimiento del dia" y "Como dormiste anoche"
   * son las dos bitacoras, y la primera no puntua mientras la segunda si:
   * anotar cuanto dormiste es un registro, y aun asi tiene sentido decirte que
   * anoche descansaste bien o poco.
   */
  SIN_PUNTAJE: 'sin_puntaje',
} as const;

export type DireccionEscala = (typeof DireccionEscala)[keyof typeof DireccionEscala];

/**
 * Cortes que separan un nivel del siguiente, en proporcion de 0 a 1 sobre el
 * puntaje maximo.
 *
 * Cada actividad define los suyos. Partir en tercios es arbitrario: no hay
 * razon para que una bitacora de sueno y un juego de atencion quiebren en el
 * mismo punto.
 */
export interface Umbrales {
  /** Fin de la primera banda. */
  readonly primero: number;
  /** Fin de la segunda banda. */
  readonly segundo: number;
}

/** Texto que ve la persona para cada nivel, en el lenguaje de su actividad. */
export type TextosNivel = Readonly<Record<NivelOrientativo, string>>;

const UMBRALES_POR_DEFECTO: Umbrales = { primero: 1 / 3, segundo: 2 / 3 };

/** Datos necesarios para describir una actividad. */
export interface DatosDeActividad {
  readonly id: ActivityId;
  readonly nombre: string;
  /** Como se realiza: juego, preguntas o bitacora. */
  readonly tipo?: string | undefined;
  /** Que es y cuanto dura, en una frase. Se muestra en el catalogo. */
  readonly descripcion?: string | undefined;
  readonly direccionEscala: DireccionEscala;
  readonly puntajeMaximo?: number | undefined;
  readonly umbrales?: Umbrales | undefined;
  readonly textosNivel?: TextosNivel | undefined;
}

/**
 * Una actividad del catalogo.
 *
 * Ademas de describirse a si misma, **declara como se interpreta su puntaje**.
 * Esa responsabilidad vive aqui y no en el resultado porque la escala es una
 * propiedad de la actividad: no cambia de una ejecucion a otra.
 */
export class Activity {
  readonly id: ActivityId;
  readonly nombre: string;
  readonly tipo: string | undefined;
  readonly descripcion: string | undefined;
  readonly direccionEscala: DireccionEscala;
  readonly puntajeMaximo: number | undefined;
  readonly umbrales: Umbrales;
  readonly textosNivel: TextosNivel | undefined;

  private constructor(datos: DatosDeActividad, umbrales: Umbrales) {
    this.id = datos.id;
    this.nombre = datos.nombre;
    this.tipo = datos.tipo;
    this.descripcion = datos.descripcion;
    this.direccionEscala = datos.direccionEscala;
    this.puntajeMaximo = datos.puntajeMaximo;
    this.umbrales = umbrales;
    this.textosNivel = datos.textosNivel;
  }

  static create(datos: DatosDeActividad): Activity {
    const puntua = datos.direccionEscala !== DireccionEscala.SIN_PUNTAJE;

    // Una actividad que puntua sin decir sobre que maximo no se puede
    // interpretar: no hay forma de saber si un 7 es mucho o poco.
    if (puntua && datos.puntajeMaximo === undefined) {
      throw new InvalidActivityConfigurationError(
        datos.nombre,
        'declara una escala con puntaje pero no indica el máximo',
      );
    }

    if (puntua && (!Number.isFinite(datos.puntajeMaximo) || (datos.puntajeMaximo ?? 0) <= 0)) {
      throw new InvalidScoreRangeError(datos.puntajeMaximo ?? 0);
    }

    // Lo contrario tambien es incoherente y probablemente un descuido.
    if (!puntua && datos.puntajeMaximo !== undefined) {
      throw new InvalidActivityConfigurationError(
        datos.nombre,
        'declara que no puntúa pero indica un máximo',
      );
    }

    const umbrales = datos.umbrales ?? UMBRALES_POR_DEFECTO;

    if (
      umbrales.primero <= 0 ||
      umbrales.segundo >= 1 ||
      umbrales.primero >= umbrales.segundo ||
      !Number.isFinite(umbrales.primero) ||
      !Number.isFinite(umbrales.segundo)
    ) {
      throw new InvalidActivityConfigurationError(
        datos.nombre,
        'tiene umbrales que no separan tres bandas dentro del rango',
      );
    }

    return new Activity(datos, umbrales);
  }

  /** Indica si la actividad produce puntaje. */
  puntua(): boolean {
    return this.direccionEscala !== DireccionEscala.SIN_PUNTAJE;
  }

  /**
   * Convierte un puntaje crudo a la escala comun de 0 a 100.
   *
   * Normalizar es lo que permite cumplir el RF7: no se puede dibujar el
   * progreso de alguien si una actividad va de 0 a 20 y otra de 0 a 40. El
   * valor sin normalizar no se pierde, queda en `metadata`.
   */
  normalizar(puntajeCrudo: number): number {
    const maximo = this.puntajeMaximo ?? 0;

    return Math.round((puntajeCrudo / maximo) * 10000) / 100;
  }

  /**
   * Deriva el nivel a partir del puntaje ya normalizado, **respetando la
   * direccion de la escala**.
   */
  nivelPara(puntajeNormalizado: number): NivelOrientativo {
    const proporcion = puntajeNormalizado / 100;

    const bandaBaja =
      proporcion <= this.umbrales.primero
        ? 'baja'
        : proporcion <= this.umbrales.segundo
          ? 'media'
          : 'alta';

    if (bandaBaja === 'media') {
      return NivelOrientativo.EN_SEGUIMIENTO;
    }

    // Aqui esta el nudo: la misma banda significa cosas opuestas segun hacia
    // donde vaya la escala de la actividad.
    if (this.direccionEscala === DireccionEscala.MAYOR_REQUIERE_ATENCION) {
      return bandaBaja === 'alta' ? NivelOrientativo.REQUIERE_ATENCION : NivelOrientativo.FAVORABLE;
    }

    return bandaBaja === 'alta' ? NivelOrientativo.FAVORABLE : NivelOrientativo.REQUIERE_ATENCION;
  }

  /**
   * Texto que ve la persona para un nivel.
   *
   * Si la actividad no trae los suyos se devuelve el nivel tal cual, que es
   * feo pero honesto. Es preferible a inventar una frase que suene a dictamen.
   */
  textoPara(nivel: NivelOrientativo): string {
    return this.textosNivel?.[nivel] ?? nivel;
  }
}
