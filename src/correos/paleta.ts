/**
 * Los colores y tipografias de los correos de VSD Health (SCRUM-125).
 *
 * Salen de los tokens de la aplicacion (`--app-*` en vsd-frontend,
 * `src/estilos/aplicacion.css`): crema y verde en claro, el verde oscuro del
 * diseno en oscuro. Asi un correo y la pantalla que abre se sienten la misma
 * casa. Si cambia un color alli, hay que cambiarlo aqui y volver a generar.
 *
 * Cada texto cumple 4,5:1 sobre su fondo (WCAG AA), y hay una prueba que lo
 * calcula en los dos modos.
 */

export interface Paleta {
  /** El lienzo detras de la tarjeta. */
  readonly fondo: string;
  /** La tarjeta donde va lo que se dice. */
  readonly tarjeta: string;
  readonly borde: string;
  /** El texto principal. */
  readonly texto: string;
  /** El texto de apoyo: notas y pie. */
  readonly suave: string;
  readonly enlace: string;
  /** El fondo del boton y el color de su texto. */
  readonly boton: string;
  readonly sobre_boton: string;
  /** El fondo del boton al pasar el cursor; el texto es el mismo `sobre_boton`. */
  readonly boton_hover: string;
  /** El fondo de la cabecera donde posa la mascota. El texto alternativo va en `texto`. */
  readonly halo: string;
}

export const CLARO: Paleta = {
  fondo: '#f5f3ee',
  tarjeta: '#ffffff',
  borde: '#d9d3c8',
  texto: '#1d2420',
  suave: '#56635b',
  enlace: '#2f6b55',
  boton: '#3d7a6b',
  sobre_boton: '#ffffff',
  boton_hover: '#2f6355',
  halo: '#e7f0ea',
};

export const OSCURO: Paleta = {
  fondo: '#151c19',
  tarjeta: '#1d2722',
  borde: '#35463b',
  texto: '#f0eee5',
  suave: '#a8b8ad',
  enlace: '#a5cbb2',
  boton: '#87b89b',
  sobre_boton: '#15271d',
  boton_hover: '#a3cdb4',
  halo: '#26352c',
};

/**
 * El verde del isotipo, igual en todas partes (SCRUM-117). Es el fondo de
 * respaldo del logo mientras el cliente de correo no lo ha descargado, o si
 * bloquea las imagenes.
 */
export const VERDE_DE_LA_MARCA = '#3d7a6b';

/**
 * Tipografias del sistema: los clientes de correo no cargan fuentes web, y las
 * que si, cambian de un cliente a otro. Los titulos van en serif, como los de
 * la aplicacion (Newsreader); el resto, en sans.
 */
export const FUENTE =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
export const FUENTE_DE_TITULOS = "Georgia, 'Times New Roman', Times, serif";
/** Para el codigo de verificacion: de ancho fijo, para que las cifras no se confundan. */
export const FUENTE_MONOESPACIADA =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

/** La razon de contraste WCAG entre dos colores `#rrggbb`: de 1 a 21. */
export function contraste(uno: string, otro: string): number {
  const luminancia = (color: string): number => {
    const canales = [1, 3, 5].map((inicio) => parseInt(color.slice(inicio, inicio + 2), 16) / 255);
    const [rojo = 0, verde = 0, azul = 0] = canales.map((canal) =>
      canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4,
    );

    return 0.2126 * rojo + 0.7152 * verde + 0.0722 * azul;
  };

  const [claro, oscuro] = [luminancia(uno), luminancia(otro)].sort((a, b) => b - a);

  return ((claro ?? 0) + 0.05) / ((oscuro ?? 0) + 0.05);
}
