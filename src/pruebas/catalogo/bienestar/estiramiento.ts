import { sesion, ventana } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * BIE-02 · «Pausa de estiramiento» (motor `guia_paso_a_paso`, modo `pasos`): 40 sesiones de 4 movimientos.
 *
 * Seis zonas (cuello, hombros, manos, espalda, piernas y ojos) con 8 movimientos cada una = 48, y 6 rutinas
 * por zona (cada una toma 4 movimientos seguidos de la zona) = 36, mas 4 rutinas que mezclan zonas = 40.
 *
 * Barandas de la ficha: **«hazlo sin dolor; si algo duele, para»**, ninguna intensidad por encima de un
 * estiramiento suave, **nada de rotaciones bruscas de cuello**, no sustituye la atencion medica ni la
 * fisioterapia, y **todos se pueden hacer desde una silla**. Ningun movimiento promete resultados ni dice que
 * mejore la vista, la postura o nada. Pide revision profesional (fisioterapia o movimiento).
 *
 * El pictograma de cada movimiento es `zona:gesto`: el frontend dibuja una figura con la zona marcada y la
 * flecha del gesto (SCRUM-226). Son 48 claves, listadas en `pictogramasDeEstiramiento`.
 */

interface Movimiento {
  readonly gesto: string;
  readonly titulo: string;
  readonly texto: string;
}

const m = (gesto: string, titulo: string, texto: string): Movimiento => ({ gesto, titulo, texto });

export const MOVIMIENTOS = {
  cuello: [
    m(
      'inclinar-der',
      'Cuello: la oreja al hombro derecho',
      'Deja caer la oreja derecha hacia el hombro derecho, despacio y sin forzar. Respira normal unos 25 segundos.',
    ),
    m(
      'inclinar-izq',
      'Cuello: la oreja al hombro izquierdo',
      'Ahora la oreja izquierda hacia el hombro izquierdo, despacio y sin forzar. Respira normal unos 25 segundos.',
    ),
    m(
      'girar-der',
      'Cuello: mirar un poco a la derecha',
      'Gira la cabeza un poco hacia la derecha, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.',
    ),
    m(
      'girar-izq',
      'Cuello: mirar un poco a la izquierda',
      'Gira la cabeza un poco hacia la izquierda, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.',
    ),
    m(
      'bajar',
      'Cuello: la barbilla al pecho',
      'Baja la barbilla hacia el pecho, despacio. Deja que el peso de la cabeza haga el trabajo, unos 25 segundos.',
    ),
    m(
      'alargar',
      'Cuello: alargarlo',
      'Imagina un hilo que te estira desde la coronilla. Alarga el cuello sin subir los hombros, unos 25 segundos.',
    ),
    m(
      'soltar',
      'Cuello: soltarlo',
      'Deja que los hombros bajen y el cuello se quede largo. Respira con calma unos 25 segundos.',
    ),
    m(
      'respirar',
      'Cuello: con las manos en las rodillas',
      'Apoya las manos en las rodillas, mira al frente y respira con calma tres veces, con el cuello suelto.',
    ),
  ],
  hombros: [
    m(
      'subir',
      'Hombros: subir y soltar',
      'Sube los hombros hacia las orejas al inhalar y suéltalos al exhalar. Repite tres veces, despacio.',
    ),
    m(
      'circulo-atras',
      'Hombros: círculos hacia atrás',
      'Dibuja círculos pequeños con los hombros hacia atrás, sin apurarte, unas cinco veces.',
    ),
    m(
      'circulo-adelante',
      'Hombros: círculos hacia adelante',
      'Ahora círculos pequeños con los hombros hacia adelante, sin apurarte, unas cinco veces.',
    ),
    m(
      'juntar',
      'Hombros: llevarlos atrás',
      'Lleva los hombros un poco hacia atrás, como juntando los omóplatos, y suelta. Dos o tres veces.',
    ),
    m(
      'abrazo',
      'Hombros: un abrazo',
      'Cruza los brazos sobre el pecho como en un abrazo y respira con calma unos 25 segundos.',
    ),
    m(
      'cruzar-der',
      'Hombros: el brazo derecho al otro lado',
      'Lleva el brazo derecho al otro lado del pecho y apóyalo con la mano izquierda, sin empujar fuerte. Unos 20 segundos.',
    ),
    m(
      'cruzar-izq',
      'Hombros: el brazo izquierdo al otro lado',
      'Lleva el brazo izquierdo al otro lado del pecho y apóyalo con la mano derecha, sin empujar fuerte. Unos 20 segundos.',
    ),
    m(
      'abrir',
      'Hombros: abrir los brazos',
      'Abre los brazos a los lados, como dejando entrar el aire, y vuelve a bajarlos despacio. Tres veces.',
    ),
  ],
  manos: [
    m(
      'circulo',
      'Muñecas: círculos suaves',
      'Haz círculos suaves con las muñecas, cinco hacia un lado y cinco hacia el otro.',
    ),
    m(
      'palma-arriba',
      'Muñecas: palma hacia arriba',
      'Estira un brazo al frente con la palma hacia arriba y, con la otra mano, lleva los dedos suavemente hacia abajo. Luego cambia.',
    ),
    m(
      'palma-abajo',
      'Muñecas: palma hacia abajo',
      'Estira un brazo al frente con la palma hacia abajo y, con la otra mano, lleva los dedos suavemente hacia ti. Luego cambia.',
    ),
    m(
      'abrir-cerrar',
      'Manos: abrir y cerrar',
      'Abre las manos bien y ciérralas despacio, varias veces, sin apretar fuerte.',
    ),
    m(
      'dedos',
      'Manos: dedos como una estrella',
      'Separa los dedos como una estrella y júntalos, despacio, unas cinco veces.',
    ),
    m(
      'oracion',
      'Manos: palmas juntas',
      'Junta las palmas frente al pecho y baja un poco las manos, sin separar las palmas. Unos 15 segundos.',
    ),
    m(
      'sacudir',
      'Manos: sacudirlas',
      'Sacude las manos con suavidad, como quitando gotas de agua, unos 10 segundos.',
    ),
    m(
      'presionar',
      'Manos: una pelota imaginaria',
      'Aprieta con suavidad una pelota imaginaria entre las manos y suelta, varias veces.',
    ),
  ],
  espalda: [
    m(
      'alargar',
      'Espalda: crecer sin tensar',
      'Siéntate con la espalda larga y los pies apoyados. Siente cómo te creces, sin tensar, unos 20 segundos.',
    ),
    m(
      'torcer-der',
      'Espalda: girar un poco a la derecha',
      'Con la espalda larga, gira el torso un poco hacia la derecha, apoyando la mano en el respaldo, solo hasta donde se sienta bien.',
    ),
    m(
      'torcer-izq',
      'Espalda: girar un poco a la izquierda',
      'Con la espalda larga, gira el torso un poco hacia la izquierda, apoyando la mano en el respaldo, solo hasta donde se sienta bien.',
    ),
    m(
      'redondear',
      'Espalda: redondearla',
      'Redondea la espalda hacia adelante, como un gato, y deja caer los brazos. Unos 15 segundos.',
    ),
    m(
      'arco',
      'Espalda: el pecho hacia adelante',
      'Lleva el pecho un poco hacia adelante, sin arquear de más, y vuelve al centro. Tres veces.',
    ),
    m(
      'inclinar-der',
      'Espalda: inclinarse a la derecha',
      'Con una mano en el muslo, inclina el torso un poco hacia la derecha; el otro brazo puede subir al lado.',
    ),
    m(
      'inclinar-izq',
      'Espalda: inclinarse a la izquierda',
      'Con una mano en el muslo, inclina el torso un poco hacia la izquierda; el otro brazo puede subir al lado.',
    ),
    m(
      'adelante',
      'Espalda: inclinarse hacia adelante',
      'Inclínate hacia adelante desde las caderas, con las manos en los muslos, y vuelve despacio.',
    ),
  ],
  piernas: [
    m(
      'tobillos',
      'Piernas: círculos con el tobillo',
      'Levanta un pie y haz círculos suaves con el tobillo, cinco para cada lado; luego cambia de pie.',
    ),
    m(
      'estirar',
      'Piernas: estirar una al frente',
      'Estira una pierna al frente, con el talón en el suelo, y nota el estiramiento detrás del muslo. Luego cambia.',
    ),
    m(
      'punta-talon',
      'Piernas: puntas y talones',
      'Sin levantar los pies del suelo, sube las puntas y luego los talones, alternando, unas diez veces.',
    ),
    m(
      'marchar',
      'Piernas: marchar desde la silla',
      'Desde la silla, sube una rodilla y luego la otra, como marchando despacio, unas diez veces.',
    ),
    m(
      'empujar',
      'Piernas: empujar el suelo',
      'Empuja el suelo con los pies, como para ponerte de pie, y suelta. Tres veces.',
    ),
    m(
      'cruzar',
      'Piernas: un tobillo sobre la rodilla',
      'Cruza un tobillo sobre la rodilla contraria, solo si es cómodo, y descansa la pierna. Luego cambia.',
    ),
    m(
      'pantorrillas',
      'Piernas: subir los talones',
      'Apoya las puntas de los pies y sube los talones un poco, bajando despacio, unas ocho veces.',
    ),
    m(
      'sacudir',
      'Piernas: sacudirlas',
      'Sacude las piernas con suavidad, una por una, para soltar el cansancio.',
    ),
  ],
  ojos: [
    m(
      'lejos',
      'Ojos: mirar lejos',
      'Mira por la ventana o hacia lo más lejos que veas, unos 20 segundos.',
    ),
    m(
      'cerca-lejos',
      'Ojos: de cerca a lejos',
      'Mira un objeto cercano unos segundos y luego uno lejano, alternando varias veces.',
    ),
    m(
      'parpadear',
      'Ojos: parpadear suave',
      'Parpadea suave y seguido unos 10 segundos, y luego cierra los ojos un momento.',
    ),
    m(
      'arriba-abajo',
      'Ojos: arriba y abajo',
      'Sin mover la cabeza, mira hacia arriba y luego hacia abajo, despacio, cinco veces.',
    ),
    m(
      'der-izq',
      'Ojos: derecha e izquierda',
      'Sin mover la cabeza, mira hacia la derecha y luego hacia la izquierda, despacio, cinco veces.',
    ),
    m(
      'palmas',
      'Ojos: las manos tibias',
      'Frota las manos para calentarlas y apóyalas sobre los ojos cerrados, sin presionar, unos 20 segundos.',
    ),
    m(
      'circulo',
      'Ojos: un círculo con la mirada',
      'Dibuja con la mirada un círculo grande, despacio, hacia un lado y luego hacia el otro.',
    ),
    m(
      'cerrar',
      'Ojos: dejarlos descansar',
      'Cierra los ojos y déjalos descansar unos 20 segundos, respirando normal.',
    ),
  ],
} as const satisfies Readonly<Record<string, readonly Movimiento[]>>;

type Zona = keyof typeof MOVIMIENTOS;

const ZONAS: readonly Zona[] = ['cuello', 'hombros', 'manos', 'espalda', 'piernas', 'ojos'];

const NOMBRE_DE_LA_ZONA: Readonly<Record<Zona, string>> = {
  cuello: 'Cuello',
  hombros: 'Hombros',
  manos: 'Muñecas y manos',
  espalda: 'Espalda',
  piernas: 'Piernas',
  ojos: 'Ojos',
};

/** Las 48 claves de pictograma (`zona:gesto`), para que el frontend compruebe que dibuja todas. */
export function pictogramasDeEstiramiento(): string[] {
  return ZONAS.flatMap((zona) => MOVIMIENTOS[zona].map((mov) => `${zona}:${mov.gesto}`));
}

const paso = (zona: Zona, indice: number) => {
  const mov = MOVIMIENTOS[zona][indice] as Movimiento;

  return { titulo: mov.titulo, texto: mov.texto, pictograma: `${zona}:${mov.gesto}` };
};

const ADVERTENCIA =
  'Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.';

function rutina(
  titulo: string,
  pasos: ReturnType<typeof paso>[],
  posicion: number,
): SesionDeContenido {
  return sesion('BIE-02', posicion, titulo, {
    modo: 'pasos',
    advertenciaInicial: ADVERTENCIA,
    intro:
      'Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.',
    avance: 'manual',
    pasos,
    cierre: 'Eso es todo. Tu cuerpo lo nota.',
    avisoSiempre: 'Si algo duele, para.',
  });
}

/** Cuatro rutinas que mezclan zonas, para llegar a 40. */
const MEZCLAS: readonly { readonly titulo: string; readonly pasos: readonly [Zona, number][] }[] = [
  {
    titulo: 'Pausa de escritorio',
    pasos: [
      ['cuello', 0],
      ['hombros', 0],
      ['manos', 0],
      ['ojos', 0],
    ],
  },
  {
    titulo: 'Pausa larga desde la silla',
    pasos: [
      ['espalda', 0],
      ['espalda', 1],
      ['espalda', 2],
      ['piernas', 1],
    ],
  },
  {
    titulo: 'Pausa de la tarde',
    pasos: [
      ['hombros', 4],
      ['manos', 6],
      ['piernas', 0],
      ['ojos', 5],
    ],
  },
  {
    titulo: 'Pausa de la mañana',
    pasos: [
      ['cuello', 5],
      ['hombros', 1],
      ['espalda', 3],
      ['piernas', 3],
    ],
  },
];

export function sesionesDeEstiramiento(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let posicion = 0;

  for (const zona of ZONAS) {
    for (let rutinaDeLaZona = 0; rutinaDeLaZona < 6; rutinaDeLaZona++) {
      posicion += 1;
      // Cuatro movimientos seguidos de la zona, empezando en uno distinto cada vez.
      const indices = ventana(
        [0, 1, 2, 3, 4, 5, 6, 7],
        rutinaDeLaZona + (rutinaDeLaZona > 3 ? 1 : 0),
        4,
      );

      sesiones.push(
        rutina(
          `${NOMBRE_DE_LA_ZONA[zona]}, rutina ${rutinaDeLaZona + 1}`,
          indices.map((i) => paso(zona, i)),
          posicion,
        ),
      );
    }
  }

  for (const mezcla of MEZCLAS) {
    posicion += 1;
    sesiones.push(
      rutina(
        mezcla.titulo,
        mezcla.pasos.map(([zona, i]) => paso(zona, i)),
        posicion,
      ),
    );
  }

  return sesiones;
}
