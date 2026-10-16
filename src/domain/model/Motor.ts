/**
 * Que componente pinta una mecanica y como se leen los parametros de sus sesiones (ADR 0030).
 *
 * Una actividad del catalogo es una **mecanica**; lo que cambia cada dia es su sesion. Dos mecanicas
 * que se hacen de la misma manera comparten motor: sumar una nueva sobre un motor que ya existe es
 * una fila, no codigo de pantalla. Son los nueve de `CATALOGO-FICHAS-DE-MECANICAS.md` §0.3, de M1
 * a M9, y los mismos nueve que acepta el CHECK de `actividad.motor` en la base.
 *
 * Las nueve actividades que ya existen tienen el motor vacio hasta la Fase 0.
 */
export const Motor = {
  /** M1: repetir una secuencia que crece. */
  SECUENCIA: 'secuencia',
  /** M2: elegir en una cuadricula o flujo. */
  TOCAR_EL_OBJETIVO: 'tocar_el_objetivo',
  /** M3: se muestra, se oculta, se responde. */
  VER_OCULTAR_RECORDAR: 'ver_ocultar_recordar',
  /** M4: elegir o llevar a una cesta. */
  CLASIFICAR: 'clasificar',
  /** M5: letras que faltan. */
  PALABRAS: 'palabras',
  /** M6: cuentas cortas, sin reloj. */
  CALCULO: 'calculo',
  /** M7: pasos con una animacion suave y texto. El mas reutilizado. */
  GUIA_PASO_A_PASO: 'guia_paso_a_paso',
  /** M8: preguntas cerradas, una a la vez. */
  CUESTIONARIO_CORTO: 'cuestionario_corto',
  /** M9: texto libre corto, con una idea de arranque. */
  ESCRITURA_BREVE: 'escritura_breve',
} as const;

export type Motor = (typeof Motor)[keyof typeof Motor];

/** Los nueve, en el orden de las fichas (M1 a M9). */
export const MOTORES: readonly Motor[] = Object.values(Motor);

/** Indica si un valor, venga de donde venga, es uno de los nueve motores. */
export function esMotor(valor: unknown): valor is Motor {
  return typeof valor === 'string' && (MOTORES as readonly string[]).includes(valor);
}
