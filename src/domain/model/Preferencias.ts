import { InvalidPetError, NoActiveModulesError, UnknownModuleError } from './DomainError.js';

/**
 * Lo que cada persona elige para su experiencia: que modulos tiene activos y
 * como es su mascota.
 */

/**
 * Los tres modulos de VSD Health, uno por categoria del catalogo.
 *
 * Se identifican con una clave estable y no con el nombre ni con el
 * identificador de la categoria. El nombre es texto visible y ya cambio una vez
 * ('Cognicion' paso a 'Cognición'), y el identificador puede ser distinto en
 * cada base porque la siembra empareja por nombre. Una preferencia guardada no
 * puede depender de ninguno de los dos.
 */
export const Modulo = {
  COGNICION: 'cognicion',
  BIENESTAR: 'bienestar',
  EMOCIONES: 'emociones',
} as const;

export type Modulo = (typeof Modulo)[keyof typeof Modulo];

/** Los modulos en el orden en que se muestran. */
export const TODOS_LOS_MODULOS: readonly Modulo[] = [
  Modulo.COGNICION,
  Modulo.BIENESTAR,
  Modulo.EMOCIONES,
];

function esModulo(valor: string): valor is Modulo {
  return (TODOS_LOS_MODULOS as readonly string[]).includes(valor);
}

/**
 * Valida una eleccion de modulos y la deja en orden canonico, sin repetidos.
 *
 * Quedarse con cero modulos no se permite: el dashboard quedaria vacio y la
 * persona sin nada que hacer. Para dejar de usar la aplicacion esta borrar la
 * cuenta, no apagarla modulo a modulo.
 */
export function elegirModulos(elegidos: readonly string[]): readonly Modulo[] {
  for (const valor of elegidos) {
    if (!esModulo(valor)) {
      throw new UnknownModuleError(valor);
    }
  }

  const unicos = TODOS_LOS_MODULOS.filter((modulo) => elegidos.includes(modulo));

  if (unicos.length === 0) {
    throw new NoActiveModulesError();
  }

  return unicos;
}

/**
 * Como es la mascota de la persona.
 *
 * Forma y accesorio se validan por formato y no contra una lista cerrada. Los
 * modelos definitivos todavia no existen —hoy se usa Luma, la del diseño de
 * Figma—, y con una lista aqui cada modelo nuevo exigiria desplegar el backend.
 * Es el frontend quien sabe dibujar cada forma, y si recibe una que no conoce
 * usa la de siempre.
 */
export interface Mascota {
  readonly forma: string;
  readonly color: string;
  readonly accesorio: string;
  readonly nombre: string;
}

/** Una clave corta en minusculas: `brote`, `gato`, `bufanda-roja`. */
const CLAVE = /^[a-z][a-z0-9-]{0,29}$/;

const COLOR = /^#[0-9a-f]{6}$/;

const LARGO_MAXIMO_DEL_NOMBRE = 30;

// Caracteres de control: un nombre se pinta en un globo de texto, y un salto de
// linea o un caracter invisible ahi no es un nombre.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f]/;

/** Valida la mascota y la normaliza: color en minusculas, nombre sin espacios sobrantes. */
export function crearMascota(datos: Mascota): Mascota {
  const forma = datos.forma.trim();
  const accesorio = datos.accesorio.trim();
  const color = datos.color.trim().toLowerCase();
  const nombre = datos.nombre.trim();

  if (!CLAVE.test(forma)) {
    throw new InvalidPetError('la forma no es válida');
  }

  if (!CLAVE.test(accesorio)) {
    throw new InvalidPetError('el accesorio no es válido');
  }

  if (!COLOR.test(color)) {
    throw new InvalidPetError('el color debe tener la forma #RRGGBB');
  }

  if (nombre === '' || [...nombre].length > LARGO_MAXIMO_DEL_NOMBRE || CONTROL.test(nombre)) {
    throw new InvalidPetError(
      `el nombre debe tener entre 1 y ${LARGO_MAXIMO_DEL_NOMBRE} caracteres`,
    );
  }

  return { forma, color, accesorio, nombre };
}
