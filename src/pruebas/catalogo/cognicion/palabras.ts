import { type Azar, generadorDe, repartir, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-07 · «Completa la palabra» (motor `palabras`): 40 sesiones de 6 palabras.
 *
 * Nivel 1: una letra faltante. Nivel 2: dos. Nivel 3: un anagrama (las letras revueltas). Cada palabra
 * trae una pista de categoria. Espanol de Colombia, en la forma neutra (sin regionalismos que no entienda
 * todo el mundo), **sin tiempo**, y sin las palabras de la lista de exclusion (R14). La pantalla acepta con
 * y sin tilde.
 *
 * El banco son 122 palabras: 40, 40 y 42, y cada una sale en **dos sesiones** a lo sumo (ADR 0031): 13 x 6 =
 * 78 plazas para 40, y 14 x 6 = 84 para 42. Las ocho letras son el largo maximo del contrato.
 */

type Palabra = readonly [pista: string, palabra: string];

const NIVEL_1: readonly Palabra[] = [
  ['Una fruta', 'manzana'],
  ['Una fruta amarilla', 'banano'],
  ['Un animal que ladra', 'perro'],
  ['Un animal de casa', 'gato'],
  ['Sirve para escribir', 'lápiz'],
  ['Un lugar para aprender', 'escuela'],
  ['Un medio de transporte', 'tren'],
  ['Una verdura', 'cebolla'],
  ['Una fruta y un color', 'naranja'],
  ['Se abre y se cierra', 'puerta'],
  ['Deja entrar la luz', 'ventana'],
  ['Se usa para tomar la sopa', 'cuchara'],
  ['Una prenda de vestir', 'camisa'],
  ['Se usa en los pies', 'zapato'],
  ['Está en el cielo', 'nube'],
  ['Un lugar muy alto', 'montaña'],
  ['Donde crecen las flores', 'jardín'],
  ['Un lugar para jugar', 'parque'],
  ['Allí se compra', 'tienda'],
  ['Dice la hora', 'reloj'],
  ['Se lee', 'libro'],
  ['Un mueble para comer', 'mesa'],
  ['Un mueble para sentarse', 'silla'],
  ['Sirve para dormir', 'cama'],
  ['La comida del mediodía', 'almuerzo'],
  ['La primera comida del día', 'desayuno'],
  ['La comida de la noche', 'cena'],
  ['Un familiar mayor', 'abuelo'],
  ['Un familiar', 'hermano'],
  ['Alguien cercano', 'amigo'],
  ['Enseña en la escuela', 'maestro'],
  ['Hace el pan', 'panadero'],
  ['Pinta cuadros', 'pintor'],
  ['Un animal grande', 'caballo'],
  ['Un animal de orejas largas', 'conejo'],
  ['Un animal lento', 'tortuga'],
  ['Un insecto de colores', 'mariposa'],
  ['Hace la miel', 'abeja'],
  ['Se usa en la cabeza', 'sombrero'],
  ['Un instrumento de cuerdas', 'guitarra'],
];

const NIVEL_2: readonly Palabra[] = [
  ['Se cocina o se come maduro', 'plátano'],
  ['Una fruta tropical', 'mango'],
  ['Una fruta dulce', 'guayaba'],
  ['Vive en el agua', 'pescado'],
  ['Pone huevos', 'gallina'],
  ['Da lana', 'oveja'],
  ['Sirve para tomar notas', 'cuaderno'],
  ['Está en el salón de clase', 'tablero'],
  ['Da aire', 'abanico'],
  ['Abriga el cuello', 'bufanda'],
  ['Una prenda que abriga', 'chaqueta'],
  ['Protege de la lluvia', 'paraguas'],
  ['Brilla de noche', 'estrella'],
  ['Suena en la tormenta', 'trueno'],
  ['Tiene arena y mar', 'playa'],
  ['Cruza un río', 'puente'],
  ['Lleva de un lugar a otro', 'camino'],
  ['Tiene muchas casas y calles', 'ciudad'],
  ['Más pequeño que una ciudad', 'pueblo'],
  ['Un lugar abierto en el centro', 'plaza'],
  ['Allí se vende comida', 'mercado'],
  ['Donde se prepara la comida', 'cocina'],
  ['Un cuarto de la casa', 'cuarto'],
  ['Se asoma a la calle', 'balcón'],
  ['Sirve para subir', 'escalera'],
  ['Da luz', 'bombilla'],
  ['Sirve para abrigarse', 'cobija'],
  ['Para apoyar la cabeza', 'almohada'],
  ['Muestra el reflejo', 'espejo'],
  ['Sirve para peinarse', 'peine'],
  ['Sirve para lavarse', 'jabón'],
  ['Sirve para secarse', 'toalla'],
  ['Sirve para viajar', 'maleta'],
  ['Para subir al bus', 'tiquete'],
  ['Representa la Tierra', 'globo'],
  ['Señala el norte', 'brújula'],
  ['Da luz y se lleva en la mano', 'linterna'],
  ['Tiene muchos árboles', 'bosque'],
  ['Agua que cae desde lo alto', 'cascada'],
  ['Un ave pequeña', 'colibrí'],
];

const NIVEL_3: readonly Palabra[] = [
  ['Un instrumento que se golpea', 'tambor'],
  ['Un instrumento que se sopla', 'flauta'],
  ['Un instrumento de cuerda con arco', 'violín'],
  ['Una fruta ácida', 'limón'],
  ['Una fruta grande y roja por dentro', 'sandía'],
  ['Una fruta de piel suave', 'durazno'],
  ['Una verdura verde y alargada', 'pepino'],
  ['Una verdura de hoja', 'lechuga'],
  ['Una semilla verde y pequeña', 'arveja'],
  ['Un espacio de la casa para dormir', 'alcoba'],
  ['Cubre la ventana', 'cortina'],
  ['Cubre el piso', 'tapete'],
  ['Se cuelga en la pared', 'cuadro'],
  ['Sostiene las flores', 'florero'],
  ['Suave, para apoyarse', 'cojín'],
  ['Un río muy pequeño', 'arroyo'],
  ['Agua rodeada de tierra', 'laguna'],
  ['Una montaña pequeña', 'colina'],
  ['Tierra entre montañas', 'valle'],
  ['Muchos árboles y animales', 'selva'],
  ['Transporta cargas grandes', 'camión'],
  ['Vuela con pasajeros', 'avión'],
  ['Navega por el agua', 'barco'],
  ['Un tren de ciudad', 'metro'],
  ['Con ruedas, para deslizarse', 'patines'],
  ['Se lanza y se patea', 'pelota'],
  ['Vuela con el viento', 'cometa'],
  ['Gira en el suelo', 'trompo'],
  ['El último día de la semana', 'domingo'],
  ['El día después del lunes', 'martes'],
  ['Un mes del año', 'octubre'],
  ['Siete días', 'semana'],
  ['La primera parte del día', 'mañana'],
  ['Después del mediodía', 'tarde'],
  ['Cuando oscurece', 'noche'],
  ['La hija de tus padres', 'hermana'],
  ['Vive cerca de ti', 'vecino'],
  ['Conduce un bus', 'chofer'],
  ['Prepara la comida', 'cocinero'],
  ['Construye casas', 'albañil'],
  ['Un gesto cariñoso con los brazos', 'abrazo'],
  ['Un gesto alegre en la cara', 'sonrisa'],
];

export const PALABRAS_DE_NIVEL_1 = NIVEL_1;
export const PALABRAS_DE_NIVEL_2 = NIVEL_2;
export const PALABRAS_DE_NIVEL_3 = NIVEL_3;

export const SESIONES_POR_NIVEL = [13, 13, 14] as const;
const PALABRAS_POR_SESION = 6;

/** Cuantas letras faltan al completar, segun el nivel. */
function posicionesFaltantes(azar: Azar, palabra: string, cuantas: number): number[] {
  const largo = [...palabra].length;
  // Letras del interior: la primera y la ultima son el ancla para quien lee.
  const interior = Array.from({ length: Math.max(0, largo - 2) }, (_, i) => i + 1);
  const elegidas = revolver(azar, interior).slice(0, cuantas);

  return elegidas.sort((una, otra) => una - otra);
}

/** Las letras de la palabra revueltas, distintas del orden original. */
function revuelta(azar: Azar, palabra: string): string {
  const letras = [...palabra];

  for (let intento = 0; intento < 50; intento++) {
    const mezcla = revolver(azar, letras).join('');

    if (mezcla.toLowerCase() !== palabra.toLowerCase()) {
      return mezcla;
    }
  }

  // Una palabra de una sola letra repetida no tiene otro orden; no hay ninguna asi en el banco.
  throw new Error(`No se pudo revolver "${palabra}"`);
}

export function sesionesDePalabras(): SesionDeContenido[] {
  const niveles = [
    { banco: NIVEL_1, nivel: 1, titulo: 'Una letra' },
    { banco: NIVEL_2, nivel: 2, titulo: 'Dos letras' },
    { banco: NIVEL_3, nivel: 3, titulo: 'Anagramas' },
  ] as const;
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  for (const { banco, nivel, titulo } of niveles) {
    const cuantas = SESIONES_POR_NIVEL[nivel - 1] as number;

    repartir(banco, cuantas, PALABRAS_POR_SESION).forEach((palabras, dentro) => {
      numero += 1;

      const azar = generadorDe(0x77770000 + numero * 2654435);

      sesiones.push({
        id: idDeSesion('COG-07', numero),
        titulo: `${titulo}, ${dentro + 1}`,
        nivel,
        parametros: {
          modo: nivel === 3 ? 'anagrama' : 'completar',
          palabras: palabras.map(([pista, palabra]) =>
            nivel === 3
              ? { pista, palabra, revuelta: revuelta(azar, palabra) }
              : { pista, palabra, faltan: posicionesFaltantes(azar, palabra, nivel) },
          ),
          puntosMaximos: PALABRAS_POR_SESION,
        },
      });
    });
  }

  return sesiones;
}
