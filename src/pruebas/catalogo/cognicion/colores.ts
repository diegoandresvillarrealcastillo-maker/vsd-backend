import { idDeSesion } from '../ids.ts';
import { TEMAS_DE_PICTOGRAMAS, type Pictograma } from '../pictogramas.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-01 · «Recuerda los colores» (motor `secuencia`): 40 sesiones. Las cuatro primeras son las del
 * piloto (`5e510001-...`, publicadas) y **no se tocan**; aqui estan las otras 36.
 *
 * Diez temas, cada uno de 3 niveles (4, 6 y 9 casillas; largo inicial 3, 3 y 4) mas una variante lenta
 * (para quien necesita mas tiempo): 10 x 4 = 40. El primer tema, «formas y colores», es el del piloto.
 *
 * - Tres **paletas** (amanecer, bosque y mar): las mismas nueve figuras de siempre con otros colores.
 * - Seis **temas de simbolos** (frutas, animales, clima, naturaleza, casa y transporte): pictogramas.
 *
 * Cada casilla lleva **forma, nombre y color**, no solo color (R10), se ilumina al menos 600 ms y no hay
 * sonido. Una ronda acertada vale un punto y todas las sesiones juegan 12 rondas, el maximo de la mecanica.
 */

export const NOMBRE_DE_COG_01 = 'Recuerda los colores';

const COLORES = [
  'verde',
  'azul',
  'ambar',
  'violeta',
  'rosa',
  'turquesa',
  'gris',
  'naranja',
  'marron',
] as const;

const CON_TILDE: Readonly<Record<string, string>> = { ambar: 'ámbar', marron: 'marrón' };

const nombreDelColor = (color: string): string => CON_TILDE[color] ?? color;

interface Casilla {
  readonly clave: string;
  readonly nombre: string;
  readonly forma: string;
  readonly color: string;
}

const LAS_FORMAS = TEMAS_DE_PICTOGRAMAS.formas;

/** Las formas de siempre con un color en cada una, en un orden que las distingue ya con cuatro. */
function paleta(colores: readonly string[], orden: readonly number[]): Casilla[] {
  return orden.map((indiceDeLaForma, posicion) => {
    const forma = LAS_FORMAS[indiceDeLaForma] as Pictograma;
    const color = colores[posicion] as string;

    return {
      clave: forma.clave,
      nombre: `${forma.nombre} ${nombreDelColor(color)}`,
      forma: forma.clave,
      color,
    };
  });
}

/** Un tema de simbolos: cada pictograma con un color, rotando la lista para que cada tema se vea distinto. */
function simbolos(tema: readonly Pictograma[], desplazamiento: number): Casilla[] {
  return tema.map((pictograma, posicion) => ({
    clave: pictograma.clave,
    nombre: pictograma.nombre,
    forma: pictograma.clave,
    color: COLORES[(posicion + desplazamiento) % COLORES.length] as string,
  }));
}

interface Tema {
  /** Una palabra para el titulo y para el identificador: «Frutas», «Paleta del mar». */
  readonly nombre: string;
  readonly casillas: readonly Casilla[];
}

const TEMAS: readonly Tema[] = [
  {
    nombre: 'Paleta del amanecer',
    casillas: paleta(
      ['ambar', 'naranja', 'rosa', 'violeta', 'marron', 'verde', 'turquesa', 'gris', 'azul'],
      [4, 0, 2, 3, 1, 5, 6, 7, 8],
    ),
  },
  {
    nombre: 'Paleta del bosque',
    casillas: paleta(
      ['verde', 'marron', 'ambar', 'turquesa', 'naranja', 'gris', 'azul', 'violeta', 'rosa'],
      [5, 6, 2, 1, 0, 3, 8, 4, 7],
    ),
  },
  {
    nombre: 'Paleta del mar',
    casillas: paleta(
      ['azul', 'turquesa', 'gris', 'verde', 'violeta', 'rosa', 'ambar', 'naranja', 'marron'],
      [6, 7, 8, 0, 1, 3, 4, 2, 5],
    ),
  },
  { nombre: 'Frutas', casillas: simbolos(TEMAS_DE_PICTOGRAMAS.frutas, 0) },
  { nombre: 'Animales', casillas: simbolos(TEMAS_DE_PICTOGRAMAS.animales, 2) },
  { nombre: 'Clima', casillas: simbolos(TEMAS_DE_PICTOGRAMAS.clima, 4) },
  { nombre: 'Naturaleza', casillas: simbolos(TEMAS_DE_PICTOGRAMAS.naturaleza, 6) },
  { nombre: 'En casa', casillas: simbolos(TEMAS_DE_PICTOGRAMAS.casa, 8) },
  { nombre: 'Transporte', casillas: simbolos(TEMAS_DE_PICTOGRAMAS.transporte, 1) },
];

const NIVELES = [
  { nivel: 1, casillas: 4, largoInicial: 3, palabra: 'cuatro símbolos' },
  { nivel: 2, casillas: 6, largoInicial: 3, palabra: 'seis símbolos' },
  { nivel: 3, casillas: 9, largoInicial: 4, palabra: 'nueve símbolos' },
] as const;

/** Las 36 sesiones nuevas, de la quinta a la cuadragesima. */
export function sesionesDeColores(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let numero = 4;

  const parametros = (
    casillas: readonly Casilla[],
    largoInicial: number,
    lenta: boolean,
  ): Record<string, unknown> => ({
    casillas,
    largoInicial,
    rondas: 12,
    msPorElemento: lenta ? 1700 : 1000,
    msDeMargen: 1000,
    msDestello: lenta ? 1100 : 700,
  });

  for (const tema of TEMAS) {
    for (const { nivel, casillas, largoInicial, palabra } of NIVELES) {
      numero += 1;
      sesiones.push({
        id: idDeSesion('COG-01', numero),
        titulo: `${tema.nombre}, ${palabra}`,
        nivel,
        parametros: parametros(tema.casillas.slice(0, casillas), largoInicial, false),
      });
    }

    numero += 1;
    sesiones.push({
      id: idDeSesion('COG-01', numero),
      titulo: `${tema.nombre}, cuatro símbolos, con calma`,
      nivel: 1,
      parametros: parametros(tema.casillas.slice(0, 4), 3, true),
    });
  }

  return sesiones;
}
