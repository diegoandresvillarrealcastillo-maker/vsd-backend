import { type Azar, entre, generadorDe, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-08 · «Une los puntos en orden» (motor `tocar_el_objetivo`, modo `puntos`): 40 sesiones.
 *
 * Puntos repartidos que se tocan en orden, del primero al ultimo. Nivel 1: 8 puntos con numeros. Nivel 2:
 * 12. Nivel 3: 16 que **alternan numeros y letras** (1, A, 2, B...). Se parece a una prueba neuropsicologica
 * conocida, y por eso **no se mide el tiempo y no se interpreta** (R13): la ficha pide revision ligera de
 * que no se confunda con una prueba, asi que sale `pendiente`.
 *
 * Las posiciones se sacan de una cuadricula con un temblor, para que ningun par quede a menos de 14 de
 * distancia (el objetivo tactil minimo es de 44 px, R10); el contrato lo comprueba. El orden en que se
 * tocan es otro reparto al azar con semilla: las 40 distribuciones son distintas.
 */

const NIVELES = [
  { nivel: 1, puntos: 8, columnas: 3, filas: 3, sesiones: 13, titulo: 'Ocho puntos' },
  { nivel: 2, puntos: 12, columnas: 4, filas: 3, sesiones: 13, titulo: 'Doce puntos' },
  {
    nivel: 3,
    puntos: 16,
    columnas: 4,
    filas: 4,
    sesiones: 14,
    titulo: 'Dieciséis puntos, números y letras',
  },
] as const;

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Las etiquetas en orden: 1, 2, 3... o 1, A, 2, B... */
function etiquetas(cuantas: number, alternando: boolean): string[] {
  if (!alternando) {
    return Array.from({ length: cuantas }, (_, i) => String(i + 1));
  }

  return Array.from({ length: cuantas }, (_, i) =>
    i % 2 === 0 ? String(i / 2 + 1) : (LETRAS[(i - 1) / 2] as string),
  );
}

/** Los centros de las celdas de una cuadricula, en porcentajes de 12 a 88, con un temblor de hasta `temblor`. */
function celdas(azar: Azar, columnas: number, filas: number): { x: number; y: number }[] {
  const pasoX = 76 / (columnas - 1);
  const pasoY = 76 / (filas - 1);
  // Dos vecinos quedan a `paso - 2 x temblor` como minimo: con el temblor de aqui, nunca a menos de 16 (el
  // contrato pide 14). Y de 12 a 88 mas el temblor no se sale de la tabla (5 a 95).
  const temblor = Math.min(6, Math.floor((Math.min(pasoX, pasoY) - 16) / 2));
  const resultado: { x: number; y: number }[] = [];

  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      resultado.push({
        x: Math.round(12 + columna * pasoX) + entre(azar, -temblor, temblor),
        y: Math.round(12 + fila * pasoY) + entre(azar, -temblor, temblor),
      });
    }
  }

  return resultado;
}

export function sesionesDePuntos(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  for (const { nivel, puntos, columnas, filas, sesiones: cuantas, titulo } of NIVELES) {
    for (let dentro = 0; dentro < cuantas; dentro++) {
      numero += 1;

      const azar = generadorDe(0x88880000 + numero * 97);
      const lugares = revolver(azar, celdas(azar, columnas, filas)).slice(0, puntos);
      const alternando = nivel === 3;
      const marcas = etiquetas(puntos, alternando);

      sesiones.push({
        id: idDeSesion('COG-08', numero),
        titulo: `${titulo}, ${dentro + 1}`,
        nivel,
        parametros: {
          modo: 'puntos',
          indicacion: alternando
            ? 'Toca los puntos en orden, alternando números y letras: 1, A, 2, B…'
            : 'Toca los puntos en orden: 1, 2, 3…',
          // La lista va en el orden en que se tocan; la posicion de cada uno es la de su celda.
          puntos: marcas.map((etiqueta, i) => ({
            etiqueta,
            x: (lugares[i] as { x: number }).x,
            y: (lugares[i] as { y: number }).y,
          })),
          puntosMaximos: 10,
        },
      });
    }
  }

  return sesiones;
}
