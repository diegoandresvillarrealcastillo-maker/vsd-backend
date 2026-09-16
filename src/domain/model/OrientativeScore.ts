import type { Activity } from './Activity.js';
import { ScoreOutOfRangeError } from './DomainError.js';

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
 *
 * Estos tres valores son los que se guardan y se consultan. El texto que ve la
 * persona lo define cada actividad, en su propio lenguaje: una misma
 * `requiere_atencion` se lee como "Cuesta sostenerlo" en un juego de memoria y
 * como "Semana pesada" en un cuestionario de carga.
 */
export const NivelOrientativo = {
  FAVORABLE: 'favorable',
  EN_SEGUIMIENTO: 'en_seguimiento',
  REQUIERE_ATENCION: 'requiere_atencion',
} as const;

export type NivelOrientativo = (typeof NivelOrientativo)[keyof typeof NivelOrientativo];

/**
 * Puntaje obtenido en una actividad, ya normalizado, junto con su nivel.
 *
 * El nivel no se puede fijar a mano: lo deriva la actividad. Asi dos
 * resultados de la misma actividad con el mismo puntaje significan siempre lo
 * mismo, sin que dependa de quien construya el objeto.
 *
 * **El valor no sale por la API.** Vive aqui para calcular tendencias; lo que
 * ve la persona es el nivel. Ver docs/modelo-de-datos.md.
 */
export class OrientativeScore {
  private constructor(
    /** Puntaje normalizado de 0 a 100. */
    readonly value: number,
    readonly level: NivelOrientativo,
    /** Texto en el lenguaje de la actividad. */
    readonly texto: string,
  ) {}

  /**
   * Construye el puntaje a partir del valor **crudo** y de la actividad que
   * lo produjo.
   *
   * Recibir la actividad es lo que resuelve la inversion de escala: sin ella,
   * un puntaje alto en un cuestionario de tension se leeria como favorable.
   */
  static create(puntajeCrudo: number, actividad: Activity): OrientativeScore {
    const maximo = actividad.puntajeMaximo ?? 0;

    if (!Number.isFinite(puntajeCrudo) || puntajeCrudo < 0 || puntajeCrudo > maximo) {
      throw new ScoreOutOfRangeError(puntajeCrudo, maximo);
    }

    const normalizado = actividad.normalizar(puntajeCrudo);
    const nivel = actividad.nivelPara(normalizado);

    return new OrientativeScore(normalizado, nivel, actividad.textoPara(nivel));
  }

  /**
   * Indica si conviene mostrar recursos de apoyo profesional junto al
   * resultado. Es una senal de acompanamiento, nunca una alerta clinica.
   */
  sugiereAcompanamiento(): boolean {
    return this.level === NivelOrientativo.REQUIERE_ATENCION;
  }
}
