import { readFileSync } from 'node:fs';
import { CORREOS, type ContenidoDelCorreo } from './contenidos.js';
import {
  CLARO,
  FUENTE,
  FUENTE_DE_TITULOS,
  OSCURO,
  VERDE_DE_LA_MARCA,
  type Paleta,
} from './paleta.js';

/**
 * Arma los correos de Supabase Auth a partir de la plantilla maestra y del
 * texto de cada uno (SCRUM-125).
 *
 * Lo que sale de aqui es lo que se pega en Supabase. `npm run correos` lo deja
 * en `correos/generados/`, y una prueba comprueba que esos archivos son
 * exactamente lo que esta funcion produce: nadie edita uno a mano y se olvida
 * de los otros dos.
 */

/** Desde `src/correos` y desde `dist/correos` la raiz del repositorio queda dos niveles arriba. */
export const RUTA_DE_LA_PLANTILLA = new URL('../../correos/plantilla.html', import.meta.url);
export const CARPETA_DE_GENERADOS = new URL('../../correos/generados/', import.meta.url);

export interface CorreoGenerado {
  readonly archivo: string;
  readonly plantillaEnSupabase: string;
  readonly campoDelAsunto: string;
  readonly campoDelContenido: string;
  readonly asunto: string;
  readonly html: string;
}

/**
 * Lo que cambia de color en modo oscuro: la clase, la propiedad y el color de
 * la paleta oscura. La plantilla trae los colores claros en cada etiqueta, y
 * estas reglas los reemplazan en los clientes que entienden el modo oscuro.
 */
export const REGLAS_OSCURAS: readonly (readonly [
  clase: string,
  propiedad: string,
  color: keyof Paleta,
])[] = [
  ['fondo', 'background-color', 'fondo'],
  ['tarjeta', 'background-color', 'tarjeta'],
  ['tarjeta', 'border-color', 'borde'],
  ['texto', 'color', 'texto'],
  ['suave', 'color', 'suave'],
  ['enlace', 'color', 'enlace'],
  ['linea', 'border-top-color', 'borde'],
  ['boton', 'background-color', 'boton'],
  ['boton-texto', 'background-color', 'boton'],
  ['boton-texto', 'color', 'sobre_boton'],
  ['halo', 'background-color', 'halo'],
  ['halo', 'border-color', 'borde'],
];

export const CLASES_CON_MODO_OSCURO: readonly string[] = [
  ...new Set(REGLAS_OSCURAS.map(([clase]) => clase)),
];

/** Relleno para que el texto del cuerpo no se cuele en la vista previa de la lista de correos. */
const RELLENO_DEL_PREENCABEZADO = '&#847;&zwnj;&nbsp;'.repeat(40);

/** Una variable de Supabase, por ejemplo `{{ .NewEmail }}`: no se escapa. */
const VARIABLE_DE_SUPABASE = /(\{\{\s*\.[A-Za-z]+\s*\}\})/;

/** Texto plano a HTML, dejando intactas las variables de Supabase. */
export function escaparTexto(texto: string): string {
  return texto
    .split(VARIABLE_DE_SUPABASE)
    .map((trozo, indice) =>
      // Los trozos impares son las variables que separo `split`.
      indice % 2 === 1
        ? trozo
        : trozo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    )
    .join('');
}

/**
 * Reemplaza los `%%marcadores%%` de la plantilla.
 *
 * Es estricta en los dos sentidos: un marcador sin valor y un valor sin
 * marcador lanzan. La primera es una plantilla con un hueco que llegaria a
 * Supabase tal cual; la segunda, un texto que se escribio y nunca saldria.
 */
export function rellenar(plantilla: string, valores: Readonly<Record<string, string>>): string {
  const usados = new Set<string>();

  const resultado = plantilla.replace(/%%([a-z_.]+)%%/g, (_marcador, nombre: string) => {
    const valor = valores[nombre];

    if (valor === undefined) {
      throw new Error(`La plantilla usa %%${nombre}%% y no tiene valor para el.`);
    }

    usados.add(nombre);

    return valor;
  });

  const sinUsar = Object.keys(valores).filter((nombre) => !usados.has(nombre));

  if (sinUsar.length > 0) {
    throw new Error(`La plantilla no usa: ${sinUsar.map((nombre) => `%%${nombre}%%`).join(', ')}.`);
  }

  return resultado;
}

function parrafo(texto: string): string {
  return (
    `<p class="texto" style="margin: 0 0 16px 0; font-family: ${FUENTE}; font-size: 16px; ` +
    `line-height: 26px; color: ${CLARO.texto}">${escaparTexto(texto)}</p>`
  );
}

/**
 * Los pasos, como lista numerada: un lector de pantalla la anuncia como lista y
 * el numero lo pone el cliente de correo, sin tablas ni imagenes de por medio.
 */
function listaDePasos(pasos: readonly string[]): string {
  const elementos = pasos
    .map(
      (paso) =>
        `<li class="texto" style="margin: 0 0 8px 0; padding-left: 4px; font-family: ${FUENTE}; ` +
        `font-size: 16px; line-height: 26px; color: ${CLARO.texto}">${escaparTexto(paso)}</li>`,
    )
    .join('\n                  ');

  return (
    `<ol style="margin: 0 0 24px 0; padding: 0 0 0 24px">\n                  ${elementos}\n` +
    `                </ol>`
  );
}

/** Las reglas del modo oscuro, una por linea. `prefijo` es el selector que antecede a la clase. */
function reglasDelModoOscuro(prefijo: (propiedad: string) => string, sangria: string): string {
  return REGLAS_OSCURAS.map(
    ([clase, propiedad, color]) =>
      `${prefijo(propiedad)}.${clase} { ${propiedad}: ${OSCURO[color]} !important; }`,
  ).join(`\n${sangria}`);
}

/** Outlook.com y su app: el texto se pinta con `data-ogsc` y los fondos y bordes con `data-ogsb`. */
function selectorDeOutlook(propiedad: string): string {
  return propiedad === 'color' ? '[data-ogsc] ' : '[data-ogsb] ';
}

/** Los comentarios de mantenimiento no se envian; los condicionales de Outlook (`<!--[if ...`) si. */
function sinComentariosDeMantenimiento(html: string): string {
  return html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
}

function valoresDeLaPlantilla(contenido: ContenidoDelCorreo): Record<string, string> {
  const colores = Object.fromEntries(
    (Object.keys(CLARO) as (keyof Paleta)[]).map((nombre) => [`claro.${nombre}`, CLARO[nombre]]),
  );

  const cuerpo = [
    ...contenido.parrafos.map(parrafo),
    ...(contenido.pasos === undefined ? [] : [listaDePasos(contenido.pasos)]),
  ];

  return {
    ...colores,
    // El modo oscuro del boton y del foco vive en el bloque <style>, no en una clase.
    'oscuro.boton_hover': OSCURO.boton_hover,
    'oscuro.enlace': OSCURO.enlace,
    marca: VERDE_DE_LA_MARCA,
    fuente: FUENTE,
    fuente_titulos: FUENTE_DE_TITULOS,
    asunto: escaparTexto(contenido.asunto),
    preencabezado: escaparTexto(contenido.preencabezado),
    relleno_del_preencabezado: RELLENO_DEL_PREENCABEZADO,
    titulo: escaparTexto(contenido.titulo),
    'mascota.nombre': escaparTexto(contenido.mascota.nombre),
    'mascota.archivo': contenido.mascota.archivo,
    cuerpo: cuerpo.join('\n                '),
    boton: escaparTexto(contenido.boton),
    nota: escaparTexto(contenido.nota),
    reglas_oscuras: reglasDelModoOscuro(() => '', '        '),
    reglas_outlook_oscuras: reglasDelModoOscuro(selectorDeOutlook, '      '),
  };
}

export function construirCorreo(contenido: ContenidoDelCorreo, plantilla: string): CorreoGenerado {
  const html = rellenar(sinComentariosDeMantenimiento(plantilla), valoresDeLaPlantilla(contenido))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    archivo: contenido.archivo,
    plantillaEnSupabase: contenido.plantillaEnSupabase,
    campoDelAsunto: contenido.campoDelAsunto,
    campoDelContenido: contenido.campoDelContenido,
    asunto: contenido.asunto,
    html: `${html}\n`,
  };
}

/** Los tres correos, listos para pegar en Supabase. */
export function construirCorreos(): readonly CorreoGenerado[] {
  const plantilla = readFileSync(RUTA_DE_LA_PLANTILLA, 'utf8');

  return CORREOS.map((contenido) => construirCorreo(contenido, plantilla));
}
