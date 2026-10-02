/**
 * Una entrada del diario, tal como se guarda.
 *
 * Hoy solo se lee para la exportacion de datos (SCRUM-75). Las reglas del
 * diario —el dia al que pertenece, la ventana de edicion— llegan con
 * SCRUM-95, y entonces esto pasa de ser una forma de datos a una entidad.
 */
export interface EntradaDeDiario {
  readonly id: string;
  readonly titulo: string | undefined;
  readonly contenido: string;
  readonly formato: 'texto_plano' | 'enriquecido';
  readonly etiquetas: unknown;
  readonly creadaEn: Date;
  readonly editadaEn: Date;
}
