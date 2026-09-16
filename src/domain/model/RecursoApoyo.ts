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
} as const;

export type Cobertura = (typeof Cobertura)[keyof typeof Cobertura];

const PRIORIDAD: Record<string, number> = {
  [Cobertura.NACIONAL]: 0,
  [Cobertura.UNIVERSIDAD]: 1,
  [Cobertura.BOGOTA]: 2,
};

export interface DatosDeRecurso {
  readonly id: string;
  readonly titulo: string;
  readonly descripcion?: string | undefined;
  readonly tipo: string;
  readonly tema?: string | undefined;
  readonly cobertura?: string | undefined;
  readonly enlace?: string | undefined;
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
  ) {
    Object.freeze(this);
  }

  static create(datos: DatosDeRecurso): RecursoApoyo {
    if (datos.titulo.trim() === '') {
      throw new InvalidResourceError('un recurso sin titulo no se puede mostrar');
    }

    return new RecursoApoyo(
      datos.id,
      datos.titulo,
      datos.descripcion,
      datos.tipo,
      datos.tema,
      datos.cobertura,
      datos.enlace,
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
