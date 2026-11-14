import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * BIE-09 · «Un respiro en medio del dia» (motor `guia_paso_a_paso`, modo `pasos`, con `elecciones`): 40 sesiones.
 *
 * Una micro-pausa de 60 a 90 segundos para el trabajo o el estudio, **a elegir entre tres**. Hay 40
 * micro-pausas de tres pasos cada una; cada sesion ofrece tres distintas, armadas a saltos de 13 en la lista
 * para que nunca coincidan dos iguales (cada micro-pausa sale en tres menus: la persona escoge una por vez,
 * asi que lo que se repite es una opcion, no un contenido impuesto).
 *
 * Barandas: **sin ejercicios que obliguen a levantarse** donde no hay permiso (aula, trabajo): todas se hacen
 * en el sitio; ninguna promete productividad ni resultados.
 */

interface MicroPausa {
  readonly nombre: string;
  readonly descripcion: string;
  readonly pasos: readonly [string, string, string];
}

const p = (
  nombre: string,
  descripcion: string,
  pasos: readonly [string, string, string],
): MicroPausa => ({
  nombre,
  descripcion,
  pasos,
});

const MICRO_PAUSAS: readonly MicroPausa[] = [
  p('Mirar lejos', 'Descansar la vista mirando hacia lo lejano.', [
    'Levanta la vista de lo que estás haciendo.',
    'Mira hacia lo más lejos que veas, por una ventana o al fondo del cuarto.',
    'Quédate ahí unos segundos y vuelve a lo tuyo.',
  ]),
  p('Soltar los hombros', 'Subirlos y soltarlos, tres veces.', [
    'Sube los hombros hacia las orejas al inhalar.',
    'Suéltalos al exhalar, despacio.',
    'Repite una vez más y nota cómo quedan.',
  ]),
  p('Un vaso de agua', 'Unos sorbos de agua, con atención.', [
    'Alcanza tu vaso o tu botella de agua.',
    'Toma unos sorbos despacio.',
    'Nota la temperatura y el sabor del agua.',
  ]),
  p('Abrir la ventana', 'Un poco de aire de afuera.', [
    'Si hay una ventana cerca, ábrela un poco; si no puedes, mírala.',
    'Respira el aire de afuera un par de veces.',
    'Escucha un sonido de afuera.',
  ]),
  p('Tres respiraciones', 'Respirar con calma, tres veces.', [
    'Apoya la espalda en la silla.',
    'Respira con calma tres veces, a tu ritmo.',
    'Vuelve a lo tuyo cuando quieras.',
  ]),
  p('Estirar las manos', 'Abrir, cerrar y sacudir las manos.', [
    'Abre las manos bien y ciérralas despacio.',
    'Sacúdelas con suavidad unos segundos.',
    'Apóyalas sobre las piernas y nota cómo se sienten.',
  ]),
  p('Cerrar los ojos', 'Un momento con los ojos cerrados.', [
    'Si puedes, cierra los ojos un momento.',
    'Deja que la cara se afloje.',
    'Ábrelos con calma cuando quieras.',
  ]),
  p('Mirar un color', 'Buscar un color a tu alrededor.', [
    'Busca un color a tu alrededor.',
    'Mira todas las cosas que tengan ese color.',
    'Quédate un momento con lo que viste.',
  ]),
  p('Escuchar los sonidos', 'Los cercanos y los lejanos.', [
    'Deja lo que haces un momento.',
    'Escucha los sonidos cercanos y los lejanos.',
    'Quédate con el que más te guste.',
  ]),
  p('Apoyar los pies', 'Sentir el contacto con el suelo.', [
    'Apoya los dos pies en el suelo.',
    'Nota el contacto y el peso de tus piernas.',
    'Respira una vez con calma.',
  ]),
  p('Sentir la silla', 'Notar cómo te sostiene.', [
    'Nota cómo te sostiene la silla.',
    'Deja que tu espalda se apoye un poco más.',
    'Respira con calma y sigue.',
  ]),
  p('Algo que te guste', 'Pensar en algo pequeño y bueno.', [
    'Piensa en algo que te guste, aunque sea pequeño.',
    'Deja que la cara se suavice, con o sin sonrisa.',
    'Vuelve a lo tuyo con eso en mente.',
  ]),
  p('Un rincón ordenado', 'Ordenar una sola cosa.', [
    'Elige una sola cosa de tu espacio.',
    'Colócala en su lugar.',
    'Mira el resultado un momento.',
  ]),
  p('Mirar por la ventana', 'Seguir algo que se mueva.', [
    'Mira por la ventana, si hay una cerca.',
    'Fíjate en algo que se mueva: una nube, una hoja, un carro.',
    'Sigue con la mirada unos segundos.',
  ]),
  p('Beber algo despacio', 'Una bebida, en sorbos pequeños.', [
    'Alcanza una bebida que te guste.',
    'Tómala en sorbos pequeños.',
    'Nota el calor o el frío en las manos.',
  ]),
  p('Calentar las manos', 'Frotarlas hasta que estén tibias.', [
    'Frota las palmas entre sí hasta calentarlas.',
    'Presiona suave el centro de cada palma.',
    'Apóyalas sobre las piernas.',
  ]),
  p('Mover los dedos de los pies', 'Dentro de los zapatos o sin ellos.', [
    'Mueve los dedos de los pies, dentro de los zapatos o sin ellos.',
    'Ábrelos y ciérralos, despacio.',
    'Nota cómo se sienten tus pies.',
  ]),
  p('Alargar el cuello', 'Espalda larga y hombros sueltos.', [
    'Siéntate con la espalda larga.',
    'Imagina un hilo que te estira desde la coronilla.',
    'Deja los hombros sueltos.',
  ]),
  p('Contar hacia atrás', 'De cinco a uno, soltando el aire.', [
    'Cuenta despacio de cinco a uno.',
    'En cada número, suelta un poco el aire.',
    'Al llegar a uno, mira a tu alrededor.',
  ]),
  p('Parpadear', 'Parpadear suave y cerrar un momento.', [
    'Parpadea suave y seguido unos segundos.',
    'Cierra los ojos un momento.',
    'Ábrelos y mira hacia lejos.',
  ]),
  p('Mirar algo lejano', 'Elegir un punto y mantener la mirada.', [
    'Elige un punto lejano.',
    'Mantén la mirada ahí unos segundos.',
    'Vuelve a mirar de cerca, con calma.',
  ]),
  p('Una canción por dentro', 'Recordar una canción que te guste.', [
    'Recuerda una canción que te guste.',
    'Escúchala por dentro un momento.',
    'Vuelve cuando termine.',
  ]),
  p('Estirar los brazos', 'Hacia el frente y hacia arriba.', [
    'Estira los brazos al frente, sin tensar.',
    'Llévalos hacia arriba si hay espacio, y bájalos.',
    'Respira con calma.',
  ]),
  p('Sentir las manos', 'Su peso y su temperatura.', [
    'Apoya las manos sobre las piernas.',
    'Nota su peso y su temperatura.',
    'Respira una vez con calma.',
  ]),
  p('Un pensamiento amable', 'Pensar en alguien que te cae bien.', [
    'Piensa en alguien que te cae bien.',
    'Imagina qué te diría hoy.',
    'Quédate con esa idea un momento.',
  ]),
  p('Dejar de hacer', 'Manos quietas, un momento.', [
    'Deja las manos quietas, sin hacer nada.',
    'Respira con calma un momento.',
    'Retoma cuando quieras.',
  ]),
  p('Oler algo agradable', 'Café, una fruta, un jabón.', [
    'Busca algo que huela rico: café, una fruta, un jabón.',
    'Acércalo y respira.',
    'Nota qué te recuerda.',
  ]),
  p('Ver tres cosas', 'Nombrarlas en voz baja.', [
    'Mira a tu alrededor.',
    'Nombra en voz baja tres cosas que ves.',
    'Respira y sigue.',
  ]),
  p('Aflojar la mandíbula', 'Dientes separados y lengua suelta.', [
    'Nota cómo está tu mandíbula.',
    'Separa un poco los dientes y suelta la lengua.',
    'Respira con calma.',
  ]),
  p('Moverte en la silla', 'Mover hombros y espalda, y acomodarte.', [
    'Mueve un poco los hombros y la espalda.',
    'Cambia de posición con calma.',
    'Vuelve a una posición cómoda.',
  ]),
  p('Mirar el cielo', 'Por una ventana, si hay una cerca.', [
    'Si hay una ventana, mira hacia el cielo.',
    'Fíjate en el color y en las nubes.',
    'Quédate un momento mirándolo.',
  ]),
  p('Un recuerdo bonito', 'Un lugar donde estuviste a gusto.', [
    'Recuerda un lugar donde estuviste a gusto.',
    'Mira por dentro un detalle: un color, un olor, un sonido.',
    'Vuelve cuando quieras.',
  ]),
  p('Las manos en el pecho', 'Sentir cómo suben y bajan al respirar.', [
    'Apoya una mano en el pecho y otra en el abdomen.',
    'Nota cómo suben y bajan con cada respiración.',
    'Respira como siempre.',
  ]),
  p('Estirar una pierna', 'Con el talón en el suelo, y luego la otra.', [
    'Estira una pierna al frente, con el talón en el suelo.',
    'Cambia de pierna.',
    'Vuelve a apoyar los pies.',
  ]),
  p('Mirar un objeto con atención', 'Su forma, su color y su textura.', [
    'Elige un objeto cerca de ti.',
    'Mira su forma, su color y su textura.',
    'Descríbelo en tu cabeza con tres palabras.',
  ]),
  p('Apoyar la espalda', 'Dejar los brazos sueltos.', [
    'Apoya la espalda contra el respaldo.',
    'Deja los brazos sueltos.',
    'Respira con calma dos veces.',
  ]),
  p('Escuchar tu respiración', 'Sin cambiarla.', [
    'Fíjate en tu respiración, sin cambiarla.',
    'Nota dónde la sientes más: nariz, pecho o abdomen.',
    'Sigue unos segundos.',
  ]),
  p('Círculos con los hombros', 'Pequeños y hacia atrás.', [
    'Dibuja círculos pequeños con los hombros.',
    'Cinco hacia atrás, despacio.',
    'Nota cómo quedan.',
  ]),
  p('Algo que salió bien', 'Recordar una cosa pequeña de hoy.', [
    'Piensa en algo que hoy salió bien, aunque sea pequeño.',
    'Recuerda cómo fue.',
    'Quédate con eso un momento.',
  ]),
  p('Descansar los ojos', 'Con las manos tibias encima.', [
    'Frota las manos para calentarlas.',
    'Apóyalas sobre los ojos cerrados, sin presionar.',
    'Quédate unos segundos y ábrelos.',
  ]),
];

export function sesionesDeRespiro(): SesionDeContenido[] {
  return Array.from({ length: 40 }, (_, n) => {
    // Tres micro-pausas distintas, a saltos de 13: 40 y 13 son primos entre si, asi que no coinciden dos.
    const elegidas = [0, 1, 2].map(
      (k) => MICRO_PAUSAS[(n + k * 13) % MICRO_PAUSAS.length] as MicroPausa,
    );

    return sesion(
      'BIE-09',
      n + 1,
      `Un respiro, ${n + 1}: ${elegidas.map((e) => e.nombre).join(', ')}`,
      {
        modo: 'pasos',
        intro:
          'Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.',
        avance: 'manual',
        elecciones: elegidas.map((e) => ({
          clave: e.nombre
            .normalize('NFD')
            .replace(/\p{M}/gu, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .slice(0, 20)
            .replace(/-+$/g, ''),
          nombre: e.nombre,
          descripcion: e.descripcion,
          pasos: e.pasos.map((texto) => ({ texto })),
        })),
        cierre: 'Volvamos con calma.',
        avisoSiempre: 'Puedes parar cuando quieras.',
      },
    );
  });
}

export const NUMERO_DE_MICRO_PAUSAS = MICRO_PAUSAS.length;
