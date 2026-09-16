import type { RecursoApoyo } from '../../model/RecursoApoyo.js';

/**
 * Lo que el asistente es capaz de reconocer.
 *
 * Es una lista corta y cerrada a proposito. Un asistente que dice entenderlo
 * todo acaba respondiendo cualquier cosa a cualquier cosa, y aqui eso no es
 * una molestia: es alguien que pregunto algo delicado y recibio una respuesta
 * que no venia al caso.
 */
export const Intencion = {
  QUE_SIGNIFICA_MI_RESULTADO: 'que_significa_mi_resultado',
  COMO_DUERMO_MEJOR: 'como_duermo_mejor',
  ME_SIENTO_MAL: 'me_siento_mal',
  DONDE_BUSCO_AYUDA: 'donde_busco_ayuda',
  /** No se reconocio nada. Se responde igual, con algo util. */
  NO_RECONOCIDA: 'no_reconocida',
} as const;

export type Intencion = (typeof Intencion)[keyof typeof Intencion];

/** Lo que el asistente devuelve. */
export interface RespuestaDelAsistente {
  /** Que se entendio. Sirve para medir que preguntan y que no sabemos responder. */
  readonly intencion: Intencion;
  /** El mensaje, corto. */
  readonly mensaje: string;
  /** Recursos de la base que acompanan al mensaje. */
  readonly recursos: readonly RecursoApoyo[];
  /**
   * Cierto cuando el texto contenia una expresion de riesgo.
   *
   * Existe para que la interfaz pueda tratar esa respuesta distinto, no para
   * decidir si se muestran los telefonos: eso ya esta decidido.
   */
  readonly senalDeRiesgo: boolean;
  /**
   * Cierto cuando la respuesta trae al menos un contacto al que acudir.
   *
   * **La garantia dura de esta interfaz: si `senalDeRiesgo` es cierto, este
   * tambien lo es.** Hay una prueba por cada expresion de la lista de riesgo
   * que lo comprueba una por una.
   */
  readonly incluyeLineasDeAtencion: boolean;
}

/** Lo que se le pregunta al asistente. */
export interface ConsultaAlAsistente {
  /** Quien pregunta. Es lo que permite personalizar con su historial real. */
  readonly userId: string;
  /** Lo que escribio, tal cual. */
  readonly texto: string;
}

/**
 * Puerto de entrada del asistente.
 *
 * ## Por que un puerto y no una clase suelta
 *
 * En la Fase 2 se anade un segundo adaptador que usa un modelo de lenguaje
 * para redactar el mensaje, recibiendo el nivel **ya calculado** por codigo
 * determinista. Ese cambio no puede tocar el dominio ni la aplicacion, y con
 * un puerto no los toca.
 *
 * El adaptador de reglas no se retira cuando llegue ese: se queda como
 * respaldo permanente. Una llamada a una API necesita conexion, y el RF9 dice
 * que la aplicacion funciona sin ella.
 *
 * ## Lo que ningun adaptador puede cambiar
 *
 * La deteccion de senales de riesgo se ejecuta **antes** que cualquier
 * redaccion y su resultado no se negocia. Un modelo puede escribir mejor el
 * mensaje; no puede decidir si alguien recibe un telefono de ayuda.
 */
export interface AsistentePort {
  responder(consulta: ConsultaAlAsistente): Promise<RespuestaDelAsistente>;
}
