import { sesion, ventana } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * BIE-01 · «Respiracion guiada» (motor `guia_paso_a_paso`, modo respiracion): 40 sesiones. Las tres primeras son
 * las del piloto (`5e510001-...`, ya sembradas, pendientes) y **no se tocan**; aqui estan las otras 37.
 *
 * La ficha es compuesta: 3 patrones suaves x 3 duraciones (1, 2 y 3 min) x 4 ambientaciones = 36, y una
 * sesion mas de un minuto sin fondo para llegar a 40 con las del piloto. (Los 4 «especiales de temporada» de
 * la ficha no estan: las sesiones de temporada piden una ventana de fechas que el ADR 0030 deja para cuando
 * haya una.)
 *
 * Barandas de la ficha: **ninguna retencion de mas de 4 s y siempre opcional**, ningun ritmo rapido, y «si
 * te mareas o te incomoda, suelta el patron y respira como siempre» **antes** de empezar. No se presenta como
 * un tratamiento. Los patrones y la advertencia piden revision profesional (corta).
 */

export const ADVERTENCIA_DE_LA_RESPIRACION =
  'Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.';

const PATRONES = [
  { nombre: 'Inhalar 4, exhalar 6', inhalaSegundos: 4, exhalaSegundos: 6, pausaSegundos: 0 },
  { nombre: 'Cinco y cinco', inhalaSegundos: 5, exhalaSegundos: 5, pausaSegundos: 0 },
  { nombre: 'Cuatro y cuatro, con pausa', inhalaSegundos: 4, exhalaSegundos: 4, pausaSegundos: 2 },
] as const;

const DURACIONES = [
  { segundos: 60, palabra: '1 min' },
  { segundos: 120, palabra: '2 min' },
  { segundos: 180, palabra: '3 min' },
] as const;

/** Los fondos de la pantalla (`data-ambientacion`): cada uno es una paleta y un fondo suave. */
export const AMBIENTACIONES = ['bosque', 'mar', 'amanecer', 'noche'] as const;

/** Frases breves de acompanamiento: una por ciclo. Ninguna manda, ninguna promete, ninguna dice «relajate». */
const FRASES = [
  'Sin prisa.',
  'Deja que el aire entre y salga a tu ritmo.',
  'Si se te va la atención, vuelve cuando quieras.',
  'Un poco más suave.',
  'No hay una manera correcta de hacerlo.',
  'Nota cómo se mueve tu pecho.',
  'Si quieres, baja la mirada.',
  'Puedes parar cuando quieras.',
  'Cada respiración es una nueva.',
  'Aquí no hay nada que lograr.',
  'Respira como te salga.',
  'Nota el aire que entra y el que sale.',
  'Un ciclo a la vez.',
  'Tu cuerpo ya sabe hacerlo.',
  'Sigue el círculo con la mirada.',
  'Si te distraes, es normal.',
  'Puedes cerrar los ojos o dejarlos abiertos.',
  'Mira cómo se abre el círculo.',
  'Suelta el aire con calma.',
  'No hace falta apurarse.',
  'El círculo te marca el ritmo.',
  'Así está bien.',
  'Un momento solo para ti.',
  'Acompaña el círculo, sin forzar.',
  'Si algo molesta, vuelve a respirar como siempre.',
  'Poco a poco.',
  'A tu manera.',
  'Un respiro más.',
  'Quédate aquí un rato.',
  'Respira suave.',
];

const FRASES_POR_SESION = 5;

function parametros(
  patron: (typeof PATRONES)[number],
  segundos: number,
  ambientacion: string | undefined,
  posicion: number,
) {
  return {
    advertenciaInicial: ADVERTENCIA_DE_LA_RESPIRACION,
    patron: {
      inhalaSegundos: patron.inhalaSegundos,
      exhalaSegundos: patron.exhalaSegundos,
      pausaSegundos: patron.pausaSegundos,
    },
    duracionSegundos: segundos,
    ...(ambientacion === undefined ? {} : { ambientacion }),
    frases: ventana(FRASES, posicion * FRASES_POR_SESION, FRASES_POR_SESION),
  };
}

/** Las 37 sesiones nuevas, de la cuarta a la cuadragesima. */
export function sesionesDeRespiracion(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let posicion = 3;

  for (const ambientacion of AMBIENTACIONES) {
    for (const patron of PATRONES) {
      for (const { segundos, palabra } of DURACIONES) {
        posicion += 1;
        sesiones.push(
          sesion(
            'BIE-01',
            posicion,
            `${patron.nombre} · ${palabra} · ${ambientacion}`,
            parametros(patron, segundos, ambientacion, posicion),
          ),
        );
      }
    }
  }

  // La cuadragesima: un minuto y sin fondo, para quien prefiere la pantalla neutra.
  posicion += 1;
  sesiones.push(
    sesion(
      'BIE-01',
      posicion,
      'Inhalar 4, exhalar 6 · 1 min · sin fondo',
      parametros(PATRONES[0], 60, undefined, posicion),
    ),
  );

  return sesiones;
}
