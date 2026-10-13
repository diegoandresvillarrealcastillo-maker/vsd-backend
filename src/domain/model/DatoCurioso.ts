import type { Dia } from './Calendario.js';

/**
 * Un dato curioso: una frase corta de cultura general que la persona ve cada dia
 * (SCRUM-185, ADR 0025).
 *
 * Es del catalogo, no de la persona. `tema` es para revisar y filtrar el catalogo, no para
 * mostrar. Ningun dato es un consejo de salud: lo cuida quien revisa el catalogo.
 */
export interface DatoCurioso {
  readonly id: string;
  readonly texto: string;
  readonly tema: string;
}

/**
 * Lo que se le entrega a una persona un dia: el dato y el dia al que pertenece.
 *
 * `dato` es `null` solo si no hay ningun dato publicado: la pantalla no inventa uno.
 */
export interface DatoCuriosoDelDia {
  readonly dia: Dia;
  readonly dato: DatoCurioso | null;
}

/**
 * Por donde va una persona en el ciclo: el ultimo dato que se le dio y el dia.
 *
 * `clave` es donde cayo ese dato **en el orden de esta persona** (un hash de su
 * identificador y el del dato). El siguiente es el de clave mayor mas cercana; al llegar al
 * final se vuelve al principio y empieza un ciclo nuevo.
 */
export interface CursorDelCiclo {
  /** `null` si el dato se borro del catalogo: el cursor sigue sirviendo por su clave. */
  readonly idDato: string | null;
  readonly clave: bigint;
  readonly dia: Dia;
}
