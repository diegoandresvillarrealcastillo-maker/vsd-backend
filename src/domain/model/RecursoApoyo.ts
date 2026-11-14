import { InvalidResourceError } from './DomainError.js';

/** Que clase de recurso es. */
export const TipoDeRecurso = {
  /** Un telefono o un servicio al que se puede acudir. */
  CONTACTO: 'contacto',
  LECTURA: 'lectura',
  EJERCICIO: 'ejercicio',
} as const;

export type TipoDeRecurso = (typeof TipoDeRecurso)[keyof typeof TipoDeRecurso];

/**
 * Donde sirve el recurso.
 *
 * El orden importa y por eso esta declarado: lo nacional va primero. La Linea
 * 106 es un servicio del Distrito y se marca desde Bogota, mientras que la
 * sede principal de la universidad esta en Fusagasuga. Ensenar primero un
 * numero que no contesta donde esta la mayoria de la gente seria un error caro.
 */
export const Cobertura = {
  NACIONAL: 'nacional',
  BOGOTA: 'bogota',
  UNIVERSIDAD: 'universidad',
  /**
   * Sirve en cualquier parte: el directorio de lineas por pais que se ensena a
   * quien esta en un pais sin lineas verificadas (SCRUM-124).
   */
  INTERNACIONAL: 'internacional',
} as const;

export type Cobertura = (typeof Cobertura)[keyof typeof Cobertura];

const PRIORIDAD: Record<string, number> = {
  [Cobertura.NACIONAL]: 0,
  [Cobertura.UNIVERSIDAD]: 1,
  [Cobertura.BOGOTA]: 2,
  [Cobertura.INTERNACIONAL]: 3,
};

/** Una fecha sin hora, como AAAA-MM-DD. */
const FECHA = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Lo unico que puede ir en un `tel:`: cifras, con un `+` delante si lleva el
 * prefijo del pais. Sin espacios, letras ni signos de pausa: lo que se marca es
 * exactamente esto, y la base impone la misma forma.
 */
const TELEFONO = /^\+?\d{3,15}$/;

export interface DatosDeRecurso {
  readonly id: string;
  readonly titulo: string;
  readonly descripcion?: string | undefined;
  readonly tipo: string;
  readonly tema?: string | undefined;
  readonly cobertura?: string | undefined;
  readonly enlace?: string | undefined;
  /**
   * El pais donde sirve, como codigo ISO de dos letras (`CO`). Vacio cuando
   * sirve en cualquier parte, como las lecturas y el directorio internacional.
   */
  readonly pais?: string | undefined;
  /** De donde sale el dato: la pagina oficial donde se confirmo. */
  readonly fuente?: string | undefined;
  /** El dia en que una persona lo confirmo en esa fuente, como AAAA-MM-DD. */
  readonly verificadoEl?: string | undefined;
  /**
   * El numero que se marca desde el boton «Llamar ahora» (SCRUM-257, ADR 0037):
   * solo cifras, y solo en una linea de atencion que ya tiene fuente y fecha de
   * verificacion. Vacio cuando no hay nada que marcar, como en el directorio
   * internacional. Si la linea pide elegir una opcion al contestar, la opcion
   * va en la descripcion y no aqui: no se marca sola.
   */
  readonly telefono?: string | undefined;
}

/**
 * Un recurso de apoyo.
 *
 * Desde SCRUM-60 esta tabla dejo de ser una lista de enlaces y paso a ser la
 * base de conocimiento del asistente. Lo que el asistente responde sale de
 * aqui, no del codigo: cambiar un texto es cambiar una fila, sin desplegar
 * nada y sin que lo revise un programador.
 */
export class RecursoApoyo {
  private constructor(
    readonly id: string,
    readonly titulo: string,
    readonly descripcion: string | undefined,
    readonly tipo: string,
    readonly tema: string | undefined,
    readonly cobertura: string | undefined,
    readonly enlace: string | undefined,
    readonly pais: string | undefined,
    readonly fuente: string | undefined,
    readonly verificadoEl: string | undefined,
    readonly telefono: string | undefined,
  ) {
    Object.freeze(this);
  }

  static create(datos: DatosDeRecurso): RecursoApoyo {
    if (datos.titulo.trim() === '') {
      throw new InvalidResourceError('un recurso sin título no se puede mostrar');
    }

    // Un telefono sin fuente ni fecha es un telefono que nadie confirmo, y en
    // una crisis eso es peor que no tener ninguno (SCRUM-124). La base lo
    // impone tambien, con una restriccion; aqui falla antes de llegar a ella.
    if (datos.tipo === TipoDeRecurso.CONTACTO) {
      if (datos.fuente === undefined || datos.fuente.trim() === '') {
        throw new InvalidResourceError(`la línea "${datos.titulo}" no dice de dónde sale`);
      }

      if (datos.verificadoEl === undefined || !FECHA.test(datos.verificadoEl)) {
        throw new InvalidResourceError(
          `la línea "${datos.titulo}" no tiene fecha de verificación válida (AAAA-MM-DD)`,
        );
      }
    }

    if (datos.pais !== undefined && !/^[A-Z]{2}$/.test(datos.pais)) {
      throw new InvalidResourceError(`"${datos.pais}" no es un código de país de dos letras`);
    }

    // Un numero que se marca con un boton solo sale de una linea verificada: sin
    // fuente y fecha no hay contacto, y sin contacto no hay telefono (SCRUM-257).
    if (datos.telefono !== undefined) {
      if (datos.tipo !== TipoDeRecurso.CONTACTO) {
        throw new InvalidResourceError(
          `"${datos.titulo}" no es una línea de atención y no puede llevar un teléfono`,
        );
      }

      if (!TELEFONO.test(datos.telefono)) {
        throw new InvalidResourceError(
          `"${datos.telefono}" no es un teléfono que se pueda marcar (solo cifras, con un + opcional)`,
        );
      }
    }

    return new RecursoApoyo(
      datos.id,
      datos.titulo,
      datos.descripcion,
      datos.tipo,
      datos.tema,
      datos.cobertura,
      datos.enlace,
      datos.pais,
      datos.fuente,
      datos.verificadoEl,
      datos.telefono,
    );
  }

  esLineaDeAtencion(): boolean {
    return this.tipo === TipoDeRecurso.CONTACTO;
  }

  /**
   * Ordena una lista dejando delante lo que sirve en mas sitios.
   *
   * Una cobertura desconocida va al final en lugar de al principio: si alguien
   * siembra un recurso sin decir donde sirve, es preferible que quede detras
   * de los que si lo dicen.
   */
  static ordenarPorAlcance(recursos: readonly RecursoApoyo[]): RecursoApoyo[] {
    return [...recursos].sort(
      (uno, otro) =>
        (PRIORIDAD[uno.cobertura ?? ''] ?? Number.MAX_SAFE_INTEGER) -
        (PRIORIDAD[otro.cobertura ?? ''] ?? Number.MAX_SAFE_INTEGER),
    );
  }
}
