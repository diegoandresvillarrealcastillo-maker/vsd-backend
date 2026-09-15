import { InvalidScoreRangeError, ScoreOutOfRangeError } from './DomainError.js';

/**
 * Nivel orientativo de un resultado.
 *
 * Los nombres son deliberadamente descriptivos y no clinicos. VSD Health no
 * diagnostica: un resultado describe como le fue a la persona en la actividad
 * y, cuando corresponde, sugiere buscar acompanamiento. Nunca nombra un
 * trastorno ni afirma una condicion.
 *
 * Cambiar estas etiquetas por terminologia clinica convertiria la aplicacion
 * en algo que no esta autorizada a ser, asi que la restriccion vive en el
 * dominio y no en la capa de presentacion.
 */
export const NivelOrientativo = {
  FAVORABLE: 'favorable',
  EN_SEGUIMIENTO: 'en_seguimiento',
  REQUIERE_ATENCION: 'requiere_atencion',
} as const;

export type NivelOrientativo = (typeof NivelOrientativo)[keyof typeof NivelOrientativo];

/**
 * Puntaje obtenido en una actividad, junto con su nivel orientativo.
 *
 * El nivel se deriva del puntaje por bandas y no se puede fijar a mano: asi
 * dos resultados con el mismo puntaje siempre significan lo mismo, sin que
 * dependa de quien construya el objeto.
 */
export class OrientativeScore {
  private constructor(
    readonly value: number,
    readonly maxValue: number,
    readonly level: NivelOrientativo,
  ) {}

  static create(value: number, maxValue: number): OrientativeScore {
    if (!Number.isInteger(maxValue) || maxValue <= 0) {
      throw new InvalidScoreRangeError(maxValue);
    }

    if (!Number.isInteger(value) || value < 0 || value > maxValue) {
      throw new ScoreOutOfRangeError(value, maxValue);
    }

    return new OrientativeScore(value, maxValue, OrientativeScore.derivarNivel(value, maxValue));
  }

  /**
   * Bandas: hasta un tercio del maximo requiere atencion, hasta dos tercios
   * queda en seguimiento, y por encima es favorable.
   *
   * Son bandas de producto, no un instrumento clinico validado. Los
   * instrumentos con licencia restringida quedan fuera del alcance del
   * proyecto, y por eso el dominio define su propia escala orientativa.
   */
  private static derivarNivel(value: number, maxValue: number): NivelOrientativo {
    const proporcion = value / maxValue;

    if (proporcion <= 1 / 3) {
      return NivelOrientativo.REQUIERE_ATENCION;
    }

    if (proporcion <= 2 / 3) {
      return NivelOrientativo.EN_SEGUIMIENTO;
    }

    return NivelOrientativo.FAVORABLE;
  }

  /**
   * Indica si conviene mostrar recursos de apoyo profesional junto al
   * resultado. Es una senal de acompanamiento, nunca una alerta clinica.
   */
  sugiereAcompanamiento(): boolean {
    return this.level === NivelOrientativo.REQUIERE_ATENCION;
  }
}
