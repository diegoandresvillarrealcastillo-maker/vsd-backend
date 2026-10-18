import { opcionesDeTarjeta, sesion, tarjeta } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * BIE-03 · «El habito de sueno de hoy», BIE-04 · «Un cuidado pequeno de hoy» y BIE-05 · «La caminata del
 * dia» (motor `cuestionario_corto`, modo `tarjeta`): 40 sesiones cada una.
 *
 * Una practica o una invitacion del dia, y tres respuestas que **cuentan igual** (la ficha lo pide: ninguna es
 * la buena). Sin puntaje. Ninguna promete curar ni mejorar nada: a lo sumo, «suele ayudar».
 *
 * - BIE-03: ninguna practica sustituye una consulta; sin alcohol como «ayuda para dormir», sin suplementos ni
 *   medicamentos. Coherente con «Como dormiste anoche»: aquella registra, esta propone.
 * - BIE-04 reemplaza a «Agua y comida» (D-C3): nada de dieta, peso, cuerpo ideal ni comida «buena o mala», y
 *   ningun acto relacionado con restriccion o compensacion. El agua es uno de los 40; la comida no se registra.
 * - BIE-05: sin metas, sin pasos contados, sin comparar con ayer; alternativa para quien no puede caminar; nada
 *   que invite a salir de noche ni a sitios inseguros.
 */

type Tarjeta = readonly [titulo: string, texto: string, porQue?: string];

// ---------------------------------------------------------------------------
// BIE-03 · El habito de sueno de hoy
// ---------------------------------------------------------------------------

const SUENO: readonly Tarjeta[] = [
  [
    'Luz de la mañana',
    'Sal a la luz natural un rato después de despertarte: a la ventana, al balcón o a la calle.',
    'Suele ayudar a que el cuerpo reconozca que ya es de día.',
  ],
  [
    'Una hora parecida',
    'Hoy intenta acostarte a una hora parecida a la de ayer.',
    'Un horario parecido suele ayudar al cuerpo a saber cuándo toca descansar.',
  ],
  [
    'Un cuarto fresco',
    'Ventila el cuarto antes de dormir y busca que quede fresco.',
    'Un cuarto fresco suele ser más cómodo para dormir.',
  ],
  [
    'Un cuarto oscuro',
    'Baja las luces del cuarto y tapa las que puedas.',
    'Menos luz suele ayudar a que llegue el sueño.',
  ],
  [
    'La pantalla lejos de la cama',
    'Deja el celular y las pantallas lejos de la cama un rato antes de dormir.',
    'Suele ayudar a que la mente baje el ritmo.',
  ],
  [
    'Una cena ligera',
    'Cena algo ligero y a una hora que te deje un rato antes de acostarte.',
    'Las comidas muy pesadas tarde suelen hacer más difícil descansar.',
  ],
  [
    'La cafeína, más temprano',
    'Si tomas café o bebidas con cafeína, hoy déjalas para antes de la tarde.',
    'La cafeína de la tarde suele quedarse en el cuerpo hasta la noche.',
  ],
  [
    'Una ducha tibia',
    'Date una ducha tibia antes de dormir, sin prisa.',
    'Suele ayudar a bajar el ritmo antes de acostarse.',
  ],
  [
    'Estirar un poco',
    'Estira el cuello y los hombros con suavidad antes de acostarte.',
    'Soltar la tensión suele hacer más cómodo el rato de dormir.',
  ],
  [
    'Un rincón ordenado',
    'Ordena un poco el cuarto antes de dormir: una silla, la mesa, la ropa.',
    'Un espacio ordenado suele sentirse más tranquilo.',
  ],
  [
    'Los pendientes en un papel',
    'Anota en un papel lo que te preocupa o te falta por hacer, y déjalo ahí.',
    'Sacar los pendientes de la cabeza suele ayudar a que se calme.',
  ],
  [
    'Tres respiraciones',
    'Ya en la cama, respira con calma tres veces antes de cerrar los ojos.',
    'Fijarse en la respiración suele ayudar a bajar el ritmo.',
  ],
  [
    'Unas páginas de papel',
    'Lee unas páginas de un libro de papel antes de dormir.',
    'Leer algo tranquilo suele ayudar a cambiar de ritmo.',
  ],
  [
    'Luces más suaves',
    'Una hora antes de dormir, usa luces más suaves en la casa.',
    'Las luces suaves suelen avisarle al cuerpo que se acerca la noche.',
  ],
  [
    'Sonidos suaves',
    'Si te gusta, pon sonidos tranquilos o música suave a poco volumen.',
    'Un fondo suave suele ayudar a algunas personas a soltar el día.',
  ],
  [
    'Una caminata en la tarde',
    'Si puedes, camina un rato en la tarde.',
    'Moverse durante el día suele ayudar a descansar mejor de noche.',
  ],
  [
    'Comer a sus horas',
    'Intenta comer hoy a horas parecidas a las de otros días.',
    'Los horarios parecidos suelen ayudar al cuerpo a organizarse.',
  ],
  [
    'Una almohada cómoda',
    'Revisa si tu almohada está cómoda; acomódala o cámbiala de posición.',
    'Sentirse a gusto suele hacer más fácil conciliar el sueño.',
  ],
  [
    'La cobija justa',
    'Elige la cobija según el clima, para no sentir ni frío ni calor.',
    'La temperatura cómoda suele ayudar a dormir sin interrupciones.',
  ],
  [
    'El ejercicio, antes de la noche',
    'Si haces ejercicio fuerte, déjalo para antes de que anochezca.',
    'El ejercicio intenso muy tarde suele dificultar el descanso a algunas personas.',
  ],
  [
    'La cama para dormir',
    'Usa la cama sobre todo para dormir y descansar.',
    'Asociar la cama con dormir suele ayudar.',
  ],
  [
    'Si el sueño no llega',
    'Si te acuestas y el sueño no llega, levántate un rato a hacer algo tranquilo con luz suave.',
    'Suele ayudar más que dar vueltas en la cama.',
  ],
  [
    'Despertar a la misma hora',
    'Intenta despertarte hoy a una hora parecida a la de ayer.',
    'Una hora de despertar estable suele ayudar a ordenar el resto del día.',
  ],
  [
    'Siestas cortas',
    'Si haces siesta, que sea corta y no muy tarde.',
    'Una siesta larga o tardía suele quitar sueño de la noche.',
  ],
  [
    'Una pijama cómoda',
    'Ponte una pijama o ropa cómoda para dormir.',
    'La ropa cómoda suele ayudar a sentirse más a gusto al acostarse.',
  ],
  [
    'Ventilar la casa',
    'Abre un rato las ventanas de la casa durante el día.',
    'El aire renovado suele hacer más agradable el cuarto por la noche.',
  ],
  [
    'Agua cerca',
    'Deja un vaso de agua cerca de la cama.',
    'Tenerla a mano suele evitar levantarse del todo si te da sed.',
  ],
  [
    'Notificaciones en silencio',
    'Silencia las notificaciones del celular para la noche.',
    'Menos avisos suelen significar menos interrupciones.',
  ],
  [
    'Una canción tranquila',
    'Escucha una canción lenta que te guste.',
    'Una música tranquila suele ayudar a cambiar de ritmo.',
  ],
  [
    'Algo agradable del día',
    'Antes de dormir, piensa en algo agradable que te pasó hoy, por pequeño que sea.',
    'Terminar el día con algo amable suele sentirse bien.',
  ],
  [
    'La ropa de mañana lista',
    'Deja lista la ropa que usarás mañana.',
    'Tener algo resuelto suele quitar peso de la cabeza.',
  ],
  [
    'El cargador fuera de la cama',
    'Carga el celular lejos de la cama.',
    'Tenerlo lejos suele ayudar a no revisarlo de más.',
  ],
  [
    'No mirar el reloj',
    'Si te despiertas de noche, intenta no mirar el reloj.',
    'Contar las horas que quedan suele hacer más difícil volver a dormirse.',
  ],
  [
    'Pensar el problema de día',
    'Si algo te preocupa, trata de pensarlo durante el día y no en la cama.',
    'Darle un momento al día suele dejar la noche más libre.',
  ],
  [
    'El sol de la tarde',
    'Si puedes, sal un rato a la luz de la tarde.',
    'La luz natural durante el día suele ayudar a que de noche haya sueño.',
  ],
  [
    'Cenar un poco antes',
    'Hoy intenta cenar un poco más temprano que de costumbre.',
    'Cenar con tiempo suele hacer más cómodo acostarse.',
  ],
  [
    'Una comida liviana',
    'Si cenas tarde, elige algo liviano.',
    'Las comidas livianas suelen caer mejor antes de dormir.',
  ],
  [
    'Un ritual corto',
    'Haz lo mismo cada noche unos diez minutos antes de acostarte: lavarte los dientes, apagar una luz, estirarte.',
    'Repetir los mismos gestos suele avisarle al cuerpo que ya es hora.',
  ],
  [
    'Cortinas o antifaz',
    'Si entra mucha luz, cierra las cortinas o usa un antifaz.',
    'Menos luz suele ayudar a dormir más seguido.',
  ],
  [
    'Una temperatura estable',
    'Busca que el cuarto no tenga cambios fuertes de temperatura en la noche.',
    'Una temperatura estable suele ayudar a no despertarse.',
  ],
];

// ---------------------------------------------------------------------------
// BIE-04 · Un cuidado pequeno de hoy
// ---------------------------------------------------------------------------

const CUIDADOS: readonly Tarjeta[] = [
  ['Un vaso de agua, despacio', 'Toma un vaso de agua despacio, notando cómo se siente.'],
  ['Mirar el cielo', 'Sal a mirar el cielo un minuto, o míralo desde una ventana.'],
  ['Lavarte la cara con calma', 'Lávate la cara con agua tibia, sin prisa.'],
  ['Ordenar un solo rincón', 'Elige un solo rincón y déjalo ordenado, solo ese.'],
  ['Escribirle a alguien que quieres', 'Mándale un mensaje breve a alguien que quieres.'],
  ['Estirar los brazos', 'Estira los brazos hacia arriba y suéltalos, despacio.'],
  ['Abrir una ventana', 'Abre una ventana y respira el aire de afuera.'],
  ['Poner una canción que te guste', 'Escucha una canción que te guste, de principio a fin.'],
  ['Mirar una foto bonita', 'Busca una foto que te guste y mírala un momento.'],
  ['Regar una planta', 'Riega una planta, o míralas un rato si tienes.'],
  ['Tu bebida favorita, sin pantalla', 'Toma algo que te guste sin mirar ninguna pantalla.'],
  ['Ropa cómoda', 'Cámbiate a algo cómodo si puedes.'],
  ['Peinarte con calma', 'Péinate o arréglate el cabello sin apuro.'],
  ['Tres respiraciones', 'Respira con calma tres veces, a tu ritmo.'],
  ['Un minuto junto a la ventana', 'Quédate un minuto mirando por la ventana.'],
  ['Cantar', 'Canta una canción, aunque sea bajito.'],
  ['Un abrazo', 'Si te nace, abraza a alguien que quieras.'],
  ['Saludar a una mascota', 'Si tienes mascota, dale unos minutos de tu atención.'],
  ['Algo rico para ti', 'Prepárate algo rico que te guste, sin pensar en cuentas.'],
  ['Una luz cálida', 'Prende una luz cálida en el lugar donde estás.'],
  ['Crema en las manos', 'Ponte crema en las manos y masajéalas un momento.'],
  ['Caminar descalzo en casa', 'Camina un rato por la casa sin zapatos, notando el suelo.'],
  ['Sentarte al sol', 'Siéntate donde dé el sol unos minutos.'],
  ['Una frase amable', 'Escribe una frase amable para ti.'],
  ['Ordenar el escritorio', 'Deja ordenada una parte de tu escritorio o mesa.'],
  ['Cerrar los ojos un minuto', 'Cierra los ojos un minuto, si estás en un lugar cómodo.'],
  ['Llamar a alguien', 'Llama a alguien con quien te guste hablar.'],
  ['Tender la cama', 'Tiende la cama con calma.'],
  ['Tu sitio favorito', 'Siéntate un rato en tu sitio favorito de la casa.'],
  ['Oler algo agradable', 'Huele algo que te guste: café, una fruta, un jabón.'],
  ['Recordar un buen día', 'Piensa en un día que recuerdes con cariño.'],
  ['Tres palabras que te gustan', 'Escribe tres palabras que te gusten.'],
  ['Cambiar de aire', 'Sal un momento al balcón, al patio o a la puerta.'],
  ['Lavar una taza con calma', 'Lava una taza o un plato sin apuro.'],
  ['Una alarma amable', 'Pon una alarma con un sonido suave para algo que quieras hacer.'],
  ['Dar las gracias', 'Dale las gracias a alguien por algo pequeño.'],
  ['El celular lejos un rato', 'Deja el celular lejos diez minutos.'],
  ['Una pausa sin hacer nada', 'Siéntate un momento sin hacer nada.'],
  ['Mirar algo verde', 'Busca algo verde y míralo un momento: una planta, una hoja.'],
  ['Estirar el cuello', 'Estira el cuello con suavidad hacia un lado y hacia el otro.'],
];

// ---------------------------------------------------------------------------
// BIE-05 · La caminata del dia
// ---------------------------------------------------------------------------

const CAMINATAS: readonly Tarjeta[] = [
  ['Una cuadra sin el celular', 'Camina una cuadra sin el celular en la mano. Unos 5 minutos.'],
  [
    'Mirar hacia arriba',
    'Mientras camines, mira hacia arriba una vez: al cielo, a los árboles, a un balcón. Unos 5 minutos.',
  ],
  [
    'Una calle distinta',
    'Toma hoy una calle distinta a la de siempre, si es un lugar que conoces. Unos 10 minutos.',
  ],
  ['Al ritmo de una canción', 'Camina al ritmo de una canción que te guste. Unos 5 minutos.'],
  ['Contar colores', 'Mientras caminas, cuenta cuántos colores distintos ves. Unos 10 minutos.'],
  [
    'Hasta la tienda de la esquina',
    'Camina hasta la tienda más cercana y vuelve despacio. Unos 10 minutos.',
  ],
  [
    'Al patio o al balcón',
    'Sal al patio, al balcón o a la puerta y camina ahí unos pasos. Unos 5 minutos.',
  ],
  [
    'Dar una vuelta por la casa',
    'Camina por dentro de la casa, de un cuarto a otro, despacio. Unos 5 minutos.',
  ],
  ['Tres árboles', 'Fíjate en tres árboles o plantas distintas mientras caminas. Unos 10 minutos.'],
  ['Una vuelta a la manzana', 'Da una vuelta a la manzana, sin prisa. Unos 10 minutos.'],
  [
    'Escuchar los sonidos',
    'Camina escuchando los sonidos que te rodean, sin audífonos. Unos 10 minutos.',
  ],
  [
    'Hasta el parque',
    'Camina hasta un parque cercano y siéntate un rato, si puedes. Unos 20 minutos.',
  ],
  ['Un paso un poco más lento', 'Camina hoy un poco más lento que de costumbre. Unos 5 minutos.'],
  [
    'Saludar a alguien',
    'Mientras caminas, saluda a alguien con una sonrisa o un gesto. Unos 10 minutos.',
  ],
  [
    'Mirar los techos',
    'Fíjate en cómo son los techos de las casas por donde pasas. Unos 10 minutos.',
  ],
  ['Sentir el suelo', 'Camina notando cómo apoyas los pies. Unos 5 minutos.'],
  [
    'Una caminata con una persona',
    'Si puedes, invita a alguien a caminar contigo. Unos 20 minutos.',
  ],
  [
    'Hasta donde llegue la luz',
    'Camina mientras haya luz natural y regresa antes de que oscurezca. Unos 20 minutos.',
  ],
  ['Un lugar con sombra', 'Busca un lugar con sombra y camina ahí un rato. Unos 10 minutos.'],
  ['Observar el cielo', 'Camina y mira cómo está el cielo hoy. Unos 5 minutos.'],
  ['Al sol de la mañana', 'Si puedes, camina un rato al sol de la mañana. Unos 10 minutos.'],
  ['Sin destino', 'Camina sin un destino fijo, por un lugar seguro y conocido. Unos 20 minutos.'],
  ['Hasta la panadería', 'Camina hasta donde compres el pan y vuelve. Unos 10 minutos.'],
  ['Notar los olores', 'Camina notando qué olores encuentras. Unos 10 minutos.'],
  ['Contar flores', 'Cuenta las flores que veas en el camino. Unos 10 minutos.'],
  [
    'Una caminata pequeña',
    'Camina lo que hoy te parezca razonable, aunque sea muy poco. Unos 5 minutos.',
  ],
  [
    'Mirar las nubes',
    'Mira las nubes un rato mientras caminas o desde una ventana. Unos 5 minutos.',
  ],
  ['Cambiar de acera', 'Camina por la otra acera hoy, si es seguro. Unos 10 minutos.'],
  ['Hasta un lugar que te guste', 'Camina hasta un lugar cercano que te guste. Unos 20 minutos.'],
  [
    'Sacudir las piernas al salir',
    'Al empezar, sacude un poco las piernas y camina despacio. Unos 5 minutos.',
  ],
  [
    'Notar tu respiración',
    'Mientras caminas, fíjate en cómo respiras, sin cambiarla. Unos 10 minutos.',
  ],
  ['Un recado a pie', 'Haz un recado cercano a pie en vez de en transporte. Unos 20 minutos.'],
  ['Escuchar a los pájaros', 'Camina fijándote si hay pájaros cerca. Unos 10 minutos.'],
  [
    'Una caminata en la tarde',
    'Si puedes, sal a caminar al final de la tarde, con luz. Unos 20 minutos.',
  ],
  [
    'Caminar con una intención',
    'Camina pensando en algo que te gustaría agradecer. Unos 10 minutos.',
  ],
  [
    'Una pausa en el camino',
    'Camina y detente un momento en algún lugar agradable. Unos 10 minutos.',
  ],
  [
    'Mirar a lo lejos',
    'Mientras caminas, mira de vez en cuando lo más lejano que veas. Unos 5 minutos.',
  ],
  [
    'Cambiar de paso',
    'Camina un rato más rápido y otro más lento, como te sientas. Unos 10 minutos.',
  ],
  [
    'Junto a una ventana',
    'Si hoy no puedes salir, pasa un rato junto a una ventana, mirando afuera. Unos 5 minutos.',
  ],
  [
    'Una caminata de ida y vuelta',
    'Camina hasta donde quieras y regresa por el mismo camino. Unos 20 minutos.',
  ],
];

// ---------------------------------------------------------------------------
// Las sesiones
// ---------------------------------------------------------------------------

export function sesionesDeSueno(): SesionDeContenido[] {
  return SUENO.map(([titulo, texto, porQue], i) =>
    sesion(
      'BIE-03',
      i + 1,
      titulo,
      tarjeta({
        indicacion: 'Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.',
        titulo,
        texto,
        ...(porQue === undefined ? {} : { porQue }),
        opciones: opcionesDeTarjeta(
          ['esta-noche', 'La pruebo esta noche'],
          ['ya', 'Ya la hago'],
          ['hoy-no', 'Hoy no'],
        ),
        nota: 'Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.',
        cierre: 'Anotado. Mañana, otra pequeña.',
      }),
    ),
  );
}

export function sesionesDeCuidados(): SesionDeContenido[] {
  return CUIDADOS.map(([titulo, texto], i) =>
    sesion(
      'BIE-04',
      i + 1,
      titulo,
      tarjeta({
        indicacion: 'Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.',
        titulo,
        texto,
        opciones: opcionesDeTarjeta(
          ['lo-hice', 'Lo hice'],
          ['luego', 'Lo hago luego'],
          ['hoy-no', 'Hoy no'],
        ),
        nota: 'Sin metas ni cuentas: lo que hagas hoy es suficiente.',
        cierre: 'Gracias por cuidarte un poquito.',
      }),
    ),
  );
}

export function sesionesDeCaminatas(): SesionDeContenido[] {
  return CAMINATAS.map(([titulo, texto], i) =>
    sesion(
      'BIE-05',
      i + 1,
      titulo,
      tarjeta({
        indicacion: 'Una invitación, siempre opcional. Las tres respuestas cuentan igual.',
        titulo,
        texto,
        opciones: opcionesDeTarjeta(
          ['la-hice', 'La hice'],
          ['un-poco', 'Hice un poco'],
          ['hoy-no', 'Hoy no'],
        ),
        nota: 'Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.',
        cierre: 'Gracias por contarlo. Cada paso suma, sin cuentas.',
      }),
    ),
  );
}

export const CUANTAS = {
  sueno: SUENO.length,
  cuidados: CUIDADOS.length,
  caminatas: CAMINATAS.length,
};
