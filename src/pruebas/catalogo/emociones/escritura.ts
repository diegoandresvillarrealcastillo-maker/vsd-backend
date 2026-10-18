import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * Las mecanicas de escritura de Emociones (motor `escritura_breve`), todas sin puntaje y con texto libre que
 * pasa por la deteccion de riesgo del asistente (R8) y entra a la exportacion y al borrado (Ley 1581).
 *
 * - **EMO-02 · «Tres cosas buenas»:** 40 lentes. Las 3 primeras son las del piloto (ya sembradas, pendientes);
 *   aqui estan las otras 37. Hasta tres lineas, **con una basta**, y «hoy no me sale ninguna» se registra igual.
 *   Nada de «deberias estar agradecida». Sin lentes de comida (el riesgo que la ficha BIE-04 nombra).
 * - **EMO-05 · «Carta a mi de manana»:** 40 invitaciones. Una carta de hasta 500 caracteres. Lo escrito en un
 *   mal dia lo lee quien despierta manana: las invitaciones son amables y no presionan. **Se guarda como una
 *   entrada del diario (D-C5, la recomendacion de la ficha)**: ya tiene aislamiento, exportacion y borrado.
 *   El cierre dice lo que de verdad pasa («Quedo guardada en tu diario»): que la carta **reaparezca** manana
 *   al abrir la aplicacion, y se pueda borrar sin leerla, necesita un borrado en el diario y una tarjeta en el
 *   panel que todavia no existen (ticket aparte), y el diario no admite entradas con fecha de manana.
 * - **EMO-09 · «El cierre del dia»** (solo de noche): 40 pares de invitaciones, dos lineas («lo que dejo y lo
 *   que me llevo») y la opcion «hoy lo dejo todo para manana». No resume ni interpreta el dia.
 *
 * Piden revision (psicologia: EMO-02, tono; ligera: EMO-05 y EMO-09).
 */

// ---------------------------------------------------------------------------
// EMO-02 · Tres cosas buenas
// ---------------------------------------------------------------------------

const LENTES: readonly (readonly [titulo: string, invitacion: string])[] = [
  ['Algo de tu cuerpo', 'Algo de tu cuerpo que hoy te acompañó.'],
  ['Mejor de lo esperado', 'Algo que salió mejor de lo que esperabas.'],
  ['Un sonido', 'Un sonido que te gustó hoy.'],
  ['Un olor', 'Un olor que te agradó.'],
  ['Una conversación', 'Una conversación que te dejó bien.'],
  ['Algo que viste', 'Algo bonito que viste hoy.'],
  ['Un rato de descanso', 'Un rato en que pudiste descansar un poco.'],
  ['Algo que aprendiste', 'Algo que aprendiste hoy, por pequeño que sea.'],
  ['Un gesto amable', 'Un gesto amable que recibiste o que diste.'],
  ['Un momento de calma', 'Un momento de calma, aunque haya durado poco.'],
  ['Algo que terminaste', 'Algo que terminaste, aunque sea pequeño.'],
  ['Una música', 'Una canción o una música que te hizo bien.'],
  ['Un recuerdo', 'Un recuerdo que te vino a la mente y te gustó.'],
  ['Algo que te hizo reír', 'Algo que te hizo reír o sonreír.'],
  ['El clima', 'Algo del clima de hoy que te gustó.'],
  ['Algo de tu casa', 'Algo de tu casa o de tu cuarto que te gusta.'],
  ['Algo que esperas', 'Algo que viene y te da curiosidad.'],
  ['Un color', 'Un color que viste y te gustó.'],
  ['Alguien lejos', 'Alguien en quien pensaste con cariño.'],
  ['Una decisión pequeña', 'Una decisión pequeña que tomaste.'],
  ['Algo que funcionó', 'Algo que funcionó como esperabas.'],
  ['Un rato a solas', 'Un rato a solas que te sirvió.'],
  ['Una ayuda', 'Una ayuda que recibiste.'],
  ['Una palabra', 'Una palabra o una frase que te quedó.'],
  ['La naturaleza', 'Algo de la naturaleza que notaste.'],
  ['Algo que tienes', 'Algo que tienes y que te sirve.'],
  ['Una pequeña victoria', 'Una pequeña victoria del día.'],
  ['Un rato de distracción', 'Un rato en que te distrajiste de lo pesado.'],
  ['Algo que dijiste', 'Algo que dijiste y quedó bien dicho.'],
  ['Algo que cuidaste', 'Algo o alguien que cuidaste hoy.'],
  ['Un momento de la mañana', 'Un momento de la mañana que fue agradable.'],
  ['Un momento de la tarde', 'Un momento de la tarde que fue agradable.'],
  ['Sin saber por qué', 'Algo que te gustó hoy, sin saber bien por qué.'],
  ['Algo pequeño', 'Algo pequeño que casi nunca notas y hoy sí.'],
  ['Algo que te dijeron', 'Algo que alguien te dijo y te sentó bien.'],
  ['Lo que no salió mal', 'Algo que podía salir mal y no salió.'],
  ['Un lugar de camino', 'Un lugar por el que pasaste y te gustó.'],
];

export function sesionesDeTresCosas(): SesionDeContenido[] {
  return LENTES.map(([titulo, invitacion], i) =>
    // Las tres primeras son las del piloto, asi que estas empiezan en la cuarta.
    sesion('EMO-02', i + 4, titulo, {
      invitacion,
      campos: 3,
      minimo: 1,
      largoMaximo: 200,
      permiteNingunaHoy: true,
      cierre: 'Gracias por compartirlo. Tómate tu tiempo.',
    }),
  );
}

// ---------------------------------------------------------------------------
// EMO-05 · Carta a mi de manana
// ---------------------------------------------------------------------------

const INVITACIONES_DE_CARTA: readonly string[] = [
  'Dile algo amable a quien despierta mañana.',
  'Cuéntale a mañana qué te gustaría recordar de hoy.',
  'Escríbele a quien despierta mañana algo que quieras que sepa.',
  'Deja una frase para mañana, sin tarea ni exigencia.',
  'Dile a mañana cómo te gustaría que empezara.',
  'Escribe algo que te gustaría leer mañana al despertar.',
  'Cuéntale a mañana una cosa pequeña que hoy fue bien.',
  'Deja un recuerdo de hoy para mañana.',
  'Escríbele a mañana lo que hoy no alcanzaste a decir.',
  'Dile a quien despierta mañana que va con calma.',
  'Deja una idea para mañana, solo si te nace.',
  'Escribe un saludo para mañana.',
  'Cuéntale a mañana algo que esperas con curiosidad.',
  'Deja una palabra amable para tu yo de mañana.',
  'Escribe algo que te gustaría recordar cuando despiertes.',
  'Dile a mañana qué te gustaría cuidar.',
  'Escribe lo que quieres que mañana sepa de hoy.',
  'Deja una nota breve para mañana, a tu manera.',
  'Cuéntale a mañana un detalle bonito de hoy.',
  'Escribe algo que le dirías a alguien querido que va a despertar.',
  'Dile a mañana que hoy hiciste lo que pudiste.',
  'Deja un deseo sencillo para mañana.',
  'Escribe una pregunta amable para mañana.',
  'Cuéntale a mañana qué te ayudó hoy.',
  'Dile algo bonito a quien lee esto mañana.',
  'Deja un recordatorio amable para mañana.',
  'Escribe tres palabras para mañana.',
  'Cuéntale a mañana cómo estuvo el día, a grandes rasgos.',
  'Deja un mensaje de ánimo, a tu manera, para mañana.',
  'Escribe lo que te gustaría escuchar mañana.',
  'Dile a mañana qué te dio gusto hoy.',
  'Deja una nota de calma para quien despierta mañana.',
  'Escribe algo pequeño que quieras recordar.',
  'Cuéntale a mañana algo que aprendiste.',
  'Dile a quien despierta mañana que puede ir paso a paso.',
  'Deja un pensamiento tranquilo para mañana.',
  'Escribe qué cosa pequeña te gustaría hacer mañana.',
  'Cuéntale a mañana una buena noticia, por pequeña que sea.',
  'Dile a mañana gracias por algo.',
  'Deja una carta corta, sin pensar en cómo queda.',
];

export function sesionesDeCarta(): SesionDeContenido[] {
  return INVITACIONES_DE_CARTA.map((invitacion, i) =>
    sesion('EMO-05', i + 1, `Carta ${i + 1}`, {
      invitacion,
      campos: 1,
      minimo: 1,
      largoMaximo: 500,
      guardarParaManana: true,
      cierre: 'Quedó guardada en tu diario.',
    }),
  );
}

// ---------------------------------------------------------------------------
// EMO-09 · El cierre del dia
// ---------------------------------------------------------------------------

const PARES_DE_CIERRE: readonly (readonly [izquierda: string, derecha: string])[] = [
  ['Lo que dejo', 'Lo que me llevo'],
  ['Algo que suelto por hoy', 'Algo que guardo'],
  ['Lo que ya pasó', 'Lo que sigue conmigo'],
  ['Lo que dejo para mañana', 'Lo que me alegra de hoy'],
  ['Algo que me pesó', 'Algo que me ayudó'],
  ['Lo que no resolví', 'Lo que sí pude'],
  ['Lo que dejo en el día', 'Lo que llevo a la noche'],
  ['Algo que quiero soltar', 'Algo que quiero conservar'],
  ['Lo que no me toca cargar ahora', 'Lo que sí quiero recordar'],
  ['Algo que quedó a medias', 'Algo que quedó bien'],
  ['Lo que dejo atrás', 'Lo que me acompaña'],
  ['Lo que me cansó', 'Lo que me dio energía'],
  ['Algo que prefiero no repasar', 'Algo que sí quiero recordar'],
  ['Lo que cierro hoy', 'Lo que abro mañana'],
  ['Lo que dejo en pausa', 'Lo que me gustó'],
  ['Algo que dejo sobre la mesa', 'Algo que me guardo en el bolsillo'],
  ['Lo que ya no necesito esta noche', 'Lo que me hace bien'],
  ['Algo que ya hice lo mejor que pude', 'Algo que agradezco'],
  ['Lo que se queda en el día', 'Lo que viene conmigo'],
  ['Algo que dejo descansar', 'Algo que celebro'],
  ['Lo que me preocupó', 'Lo que me tranquilizó'],
  ['Lo que prefiero dejar aquí', 'Lo que quiero llevarme'],
  ['Lo que dejó de importar hoy', 'Lo que sigue importando'],
  ['Algo que me costó', 'Algo que me salió natural'],
  ['Lo que suelto con el día', 'Lo que me llevo a dormir'],
  ['Algo que dejo a un lado', 'Algo que me hizo sonreír'],
  ['Lo que dejo en este día', 'Lo que traigo del día'],
  ['Algo que ya puede esperar', 'Algo que fue bueno'],
  ['Lo que guardo en un cajón', 'Lo que dejo a la vista'],
  ['Lo que no necesito repasar', 'Lo que me da gusto recordar'],
  ['Un peso que dejo', 'Una ligereza que me llevo'],
  ['Lo que cierro', 'Lo que conservo'],
  ['Algo que pasó y ya pasó', 'Algo que quiero repetir'],
  ['Lo que dejo en manos de mañana', 'Lo que me llevo en las manos'],
  ['Una cosa que dejo ir', 'Una cosa que me queda'],
  ['Lo que me sobró del día', 'Lo que me hizo falta y encontré'],
  ['Lo que dejo en el camino', 'Lo que llevo en la mochila'],
  ['Algo que ya no cargo', 'Algo que sí cargo con gusto'],
  ['Lo que dejo hasta aquí', 'Lo que me acompaña esta noche'],
  ['Lo que sale con el día', 'Lo que se queda conmigo'],
];

export function sesionesDeCierre(): SesionDeContenido[] {
  return PARES_DE_CIERRE.map(([izquierda, derecha], i) =>
    sesion('EMO-09', i + 1, `Cierre ${i + 1}: ${izquierda} / ${derecha}`, {
      invitacion: 'Dos líneas para cerrar el día, sin resumir ni evaluar nada.',
      campos: 2,
      minimo: 1,
      largoMaximo: 200,
      etiquetas: [izquierda, derecha],
      permiteNingunaHoy: true,
      textoNinguna: 'Hoy lo dejo todo para mañana',
      cierre: 'Día cerrado. Gracias por contarlo.',
    }),
  );
}
