import { mecanicaSinPuntaje, opcionesDeTarjeta, sesion, tarjeta } from '../comun.ts';
import { idDeMecanica } from '../ids.ts';
import type { Lote, MecanicaDeContenido, Parametros } from '../tipos.ts';
import { sesionesDeRueda } from './rueda.ts';

/**
 * Fichas EMO-10 a EMO-366: 357 actividades únicas para completar 365 junto a las ocho fichas
 * originales. Cada fila tiene un nombre y una consigna escritos para una acción emocional distinta;
 * no se repite una plantilla rellenando el día, la emoción o el número.
 *
 * Son borradores del módulo emocional: ninguna puntúa ni se publica sin revisión profesional.
 * Para la experiencia visual se usan los motores y componentes VSD existentes (rueda, preguntas,
 * lista, tarjeta, escritura y guía paso a paso); este catálogo no añade fuentes, colores ni CSS.
 */

type Formato = 'preguntas' | 'lista' | 'escritura' | 'tarjeta' | 'pasos' | 'rueda';

interface Idea {
  readonly tema: string;
  readonly nombre: string;
  readonly consigna: string;
  readonly formato: Formato;
  readonly respuestas?: readonly [string, string, string];
  readonly elementos?: readonly string[];
  readonly pasos?: readonly (readonly [string, string])[];
}

/** Indicaciones concretas para las pausas sensoriales que podían quedarse demasiado abiertas. */
const PASOS_DE_PAUSA: Readonly<Record<string, readonly (readonly [string, string])[]>> = {
  'Ventana de sonidos': [
    [
      'Elige un sonido',
      'Quédate en una postura cómoda y elige un sonido cercano o lejano. Escúchalo unos segundos sin intentar cambiarlo.',
    ],
    [
      'Amplía la escucha',
      'Deja que aparezcan otros sonidos. Nota cuál parece más cerca y cuál más lejos; no hace falta nombrarlos.',
    ],
    ['Vuelve al espacio', 'Escucha el conjunto del lugar una vez más y termina cuando quieras.'],
  ],
  'Texturas a mano': [
    [
      'Elige una textura',
      'Busca un objeto que ya tengas cerca. Si te resulta cómodo, tócala; también puedes observarla sin tocarla.',
    ],
    [
      'Nota dos detalles',
      'Fíjate si se siente lisa, rugosa, blanda o firme. Elige solo una o dos palabras, sin buscar una respuesta correcta.',
    ],
    ['Deja el objeto', 'Vuelve a apoyar el objeto donde estaba y sigue a tu ritmo.'],
  ],
  'Mirada que descansa': [
    [
      'Busca un punto cómodo',
      'Elige un objeto o una zona tranquila del entorno. No hace falta mantener la mirada fija.',
    ],
    [
      'Suaviza la mirada',
      'Mira ese punto y permite que también aparezca lo que lo rodea. Parpadea con normalidad.',
    ],
    ['Mira alrededor', 'Aparta la vista cuando lo prefieras y nota de nuevo el espacio completo.'],
  ],
  'Orientarme en el lugar': [
    [
      'Mira una señal',
      'Encuentra un detalle visible del lugar, como una puerta, una ventana o una lámpara.',
    ],
    [
      'Encuentra otra',
      'Elige una segunda señal y nómbrala mentalmente, si te sirve. No necesitas moverte.',
    ],
    [
      'Ubícate a tu manera',
      'Piensa dónde estás ahora o simplemente vuelve a mirar alrededor. Puedes cerrar la pausa aquí.',
    ],
  ],
  'Una pausa visual': [
    [
      'Elige una distancia',
      'Decide si te apetece mirar algo cercano o algo más lejano desde donde estás.',
    ],
    [
      'Observa sin fijar',
      'Nota una forma o un color durante unos segundos, sin forzar la vista ni sostener la mirada.',
    ],
    ['Cambia el foco', 'Mira otro punto del espacio cuando quieras y continúa con tu día.'],
  ],
  'Sonido que se aleja': [
    ['Escoge un sonido', 'Escucha un sonido que ya esté ocurriendo desde donde estás.'],
    [
      'Nota el cambio',
      'Escucha si se vuelve más suave, cambia o termina. Si sigue igual, también está bien.',
    ],
    ['Suelta la escucha', 'Deja de seguir ese sonido y vuelve a escuchar el ambiente completo.'],
  ],
  'Una forma en el entorno': [
    [
      'Encuentra una forma',
      'Mira un objeto que tenga un contorno fácil de ver, como una mesa, una ventana o un libro.',
    ],
    [
      'Recorre el contorno',
      'Sigue su borde solo con la mirada, a la velocidad que te resulte cómoda.',
    ],
    [
      'Vuelve al conjunto',
      'Aparta la mirada y nota el resto del espacio. No hace falta encontrar otra forma.',
    ],
  ],
  'Un color presente': [
    ['Elige un color', 'Mira alrededor y quédate con un color que ya esté en el lugar.'],
    [
      'Encuentra sus apariciones',
      'Busca hasta tres objetos de ese color. Si solo encuentras uno, basta.',
    ],
    ['Cierra la búsqueda', 'Deja de buscar y mira el espacio como un todo.'],
  ],
  'La habitación en silencio': [
    [
      'Haz una pausa',
      'Quédate donde estás y escucha durante unos segundos, sin necesidad de cerrar los ojos.',
    ],
    [
      'Nota lo que sí suena',
      'Si hay sonidos suaves, elige uno; si no distingues ninguno, nota esa quietud.',
    ],
    [
      'Regresa cuando quieras',
      'Mueve la atención de nuevo a lo que estabas haciendo o termina aquí.',
    ],
  ],
  'El peso de un objeto': [
    [
      'Elige algo liviano',
      'Si tienes un objeto a mano y te resulta cómodo, apóyalo en la palma o sostenlo con suavidad.',
    ],
    [
      'Nota cómo se apoya',
      'Percibe su peso y dónde descansa en tu mano. No necesitas calcularlo ni describirlo.',
    ],
    ['Déjalo en su sitio', 'Apoya el objeto de nuevo y nota cómo queda tu mano después.'],
  ],
  'Un punto de apoyo': [
    [
      'Escoge un apoyo',
      'Puede ser el asiento, el respaldo, los pies o cualquier contacto cómodo. Conserva la postura que prefieras.',
    ],
    [
      'Percibe el contacto',
      'Nota durante unos segundos dónde sientes ese apoyo, o elige otro si este no te resulta cómodo.',
    ],
    [
      'Sigue a tu ritmo',
      'Vuelve a la actividad que prefieras; no hay una sensación que debas encontrar.',
    ],
  ],
  'Una línea que guía': [
    [
      'Encuentra una línea',
      'Elige un borde visible del entorno, como el de una mesa, una pared o una página.',
    ],
    [
      'Sigue su recorrido',
      'Recórrela con la mirada desde un extremo hasta donde te resulte fácil; no necesitas mover la cabeza.',
    ],
    ['Suelta el recorrido', 'Mira otro punto y deja que la vista descanse donde prefiera.'],
  ],
  'Distancias del lugar': [
    ['Mira algo cercano', 'Desde donde estás, encuentra un objeto que tengas a poca distancia.'],
    [
      'Busca dos distancias más',
      'Mira algo a media distancia y luego algo más lejano. No necesitas acercarte a nada.',
    ],
    ['Vuelve a tu ritmo', 'Elige dónde quieres dejar la mirada y continúa cuando estés listo.'],
  ],
  'Un minuto sin tarea': [
    [
      'Deja la tarea en pausa',
      'Durante unos segundos, no intentes resolver ni completar nada. Puedes dejar las manos como están.',
    ],
    [
      'Permite un momento libre',
      'Mira el entorno o descansa la atención. Respira como te resulte natural.',
    ],
    ['Retoma o termina', 'Cuando quieras, elige si vuelves a tu tarea o cierras esta pausa.'],
  ],
  'Vuelvo a mis sentidos': [
    [
      'Encuentra algo que ves',
      'Elige un detalle visible del lugar y nómbralo mentalmente, si quieres.',
    ],
    [
      'Escucha y nota el tacto',
      'Reconoce un sonido y una sensación de contacto que ya esté presente. No busques sensaciones nuevas.',
    ],
    [
      'Reúne los tres detalles',
      'Recuerda lo que viste, oíste y sentiste al tacto. Puedes terminar aquí.',
    ],
  ],
  'El entorno por capas': [
    ['Elige un objeto', 'Mira un objeto concreto que esté en tu entorno.'],
    ['Añade un sonido', 'Sin dejar de estar donde estás, nota un sonido cercano o lejano.'],
    [
      'Mira el espacio entre ambos',
      'Nota el espacio que parece separarlos y vuelve a mirar alrededor.',
    ],
  ],
  'Una luz del lugar': [
    [
      'Encuentra una zona iluminada',
      'Mira una parte del lugar donde llegue más luz, sin mirar directamente a una lámpara o al sol.',
    ],
    ['Encuentra una sombra', 'Observa una zona más oscura y nota el contraste entre ambas.'],
    ['Vuelve al espacio', 'Mira alrededor con naturalidad y termina cuando te resulte bien.'],
  ],
  'Una respiración libre': [
    [
      'Deja que ocurra',
      'No cambies el ritmo ni tomes una respiración más grande: solo nota una respiración tal como llega.',
    ],
    [
      'Sigue con normalidad',
      'Deja que la siguiente respiración ocurra sola, sin contarla ni alargarla.',
    ],
    ['Vuelve a lo que hacías', 'Suelta la atención de la respiración y continúa a tu ritmo.'],
  ],
};

function grupo(
  tema: string,
  formato: Formato,
  filas: readonly (readonly [string, string])[],
  respuestas?: readonly [string, string, string],
  elementos?: readonly string[],
): Idea[] {
  return filas.map(([nombre, consigna]) => ({
    tema,
    nombre,
    consigna,
    formato,
    ...(respuestas === undefined ? {} : { respuestas }),
    ...(elementos === undefined ? {} : { elementos }),
    ...(formato === 'pasos'
      ? {
          pasos: PASOS_DE_PAUSA[nombre] ?? [
            ['Nota un detalle', consigna],
            ['Cierra la pausa', 'Puedes terminar aquí y seguir a tu ritmo.'],
          ],
        }
      : {}),
  }));
}

const IDEAS: readonly Idea[] = [
  ...grupo('Matices del ánimo', 'rueda', [
    [
      'El color del momento',
      'Elige en la rueda una emoción que se acerque a este instante, aunque no sea exacta.',
    ],
    [
      'Una palabra más precisa',
      'Busca un matiz más específico que la primera palabra que te vino.',
    ],
    [
      'Entre dos nombres',
      'Compara dos emociones cercanas en la rueda y elige la que hoy se aproxima más.',
    ],
    [
      'Lo que no sé nombrar',
      'Explora la rueda sin obligación de escoger; puedes dejarlo sin nombre.',
    ],
    [
      'Un matiz inesperado',
      'Recorre una familia que casi nunca eliges y mira si alguna palabra te sirve.',
    ],
    [
      'La emoción de fondo',
      'Elige una emoción suave que acompañe el momento, incluso si otra se nota más.',
    ],
    [
      'La emoción más visible',
      'Señala el matiz que ocupa más espacio ahora, o pasa si no quieres elegir.',
    ],
    [
      'Una mezcla posible',
      'Busca dos matices que puedan convivir hoy; no hace falta resolver la mezcla.',
    ],
    ['Cerca de la calma', 'Explora qué palabra queda cerca de la calma para ti, sin perseguirla.'],
    [
      'Cerca de la curiosidad',
      'Mira los matices vecinos de la curiosidad y escoge uno solo si te representa.',
    ],
    [
      'La emoción pequeña',
      'Busca una emoción de baja intensidad que normalmente podría pasar desapercibida.',
    ],
    [
      'Una emoción amplia',
      'Elige una familia general y observa cuál de sus matices te llama la atención.',
    ],
    [
      'La palabra de hoy',
      'Quédate con una palabra de la rueda que describa el día sin resumirlo todo.',
    ],
    [
      'Un matiz corporal',
      'Elige una palabra emocional y nota si te evoca alguna sensación, sin interpretarla.',
    ],
    [
      'La emoción que cambia',
      'Compara dos matices y escoge cuál describe mejor el momento presente.',
    ],
    [
      'Una emoción neutral',
      'Explora la neutralidad y decide si alguna palabra cercana te resulta útil hoy.',
    ],
    [
      'El matiz difícil',
      'Busca una emoción que cueste decir en voz alta; también puedes no elegir ninguna.',
    ],
    [
      'La emoción de una escena',
      'Piensa en una escena cotidiana y elige en la rueda un matiz que podría aparecer.',
    ],
    [
      'Un nombre prestado',
      'Prueba una palabra nueva de la rueda y decide si te sirve o la dejas pasar.',
    ],
    [
      'Emoción sin explicación',
      'Elige un matiz sin buscar la causa ni convertirlo en una conclusión.',
    ],
    [
      'La palabra que falta',
      'Recorre la rueda pensando en una sensación sin nombre y mira qué palabra se aproxima.',
    ],
    [
      'Dos emociones a la vez',
      'Marca dos matices que puedan estar juntos, sin escoger cuál debería ganar.',
    ],
    [
      'El matiz que acompaña',
      'Busca una emoción secundaria que esté junto a la más evidente, si la hay.',
    ],
    ['Emoción y energía', 'Elige un matiz y observa si se siente más quieto o más activo para ti.'],
    [
      'Lo que sí aparece',
      'Escoge una emoción presente, aunque sea tenue o distinta de la esperada.',
    ],
    [
      'Un matiz de alivio',
      'Mira la zona del alivio y decide si alguna palabra cercana encaja contigo hoy.',
    ],
    [
      'Una emoción sin etiqueta',
      'Navega por la rueda sin escoger; nota qué nombres te resultan familiares.',
    ],
    ['El matiz de una pausa', 'Piensa en una pausa reciente y busca una palabra que la acompañe.'],
    [
      'La emoción que se mueve',
      'Elige un matiz que haya cambiado durante el día, sin medir cuánto.',
    ],
    ['Un cierre con nombre', 'Escoge una emoción para cerrar este minuto o déjala sin nombrar.'],
  ]),
  ...grupo(
    'Señales que noto',
    'lista',
    [
      [
        'Mapa de señales',
        'Marca qué notas ahora: una sensación, un pensamiento, una acción o ninguna de ellas.',
      ],
      [
        'Ritmo interior',
        'Identifica si tu ritmo de este momento se siente pausado, cambiante o difícil de distinguir.',
      ],
      [
        'El primer aviso',
        'Elige una señal temprana que te avisa que algo se está moviendo por dentro.',
      ],
      [
        'Señal de descanso',
        'Marca qué gesto suele mostrarte que necesitas una pausa, sin convertirlo en una obligación.',
      ],
      [
        'Señal de interés',
        'Reconoce cómo se manifiesta la curiosidad en ti: pregunta, mirada, movimiento u otra forma.',
      ],
      [
        'Señal de incomodidad',
        'Escoge una señal que te ayuda a notar incomodidad y una opción para hacer una pausa.',
      ],
      [
        'Señal de conexión',
        'Marca qué te hace notar que estás a gusto con alguien, si aparece alguna señal.',
      ],
      [
        'Señal de distancia',
        'Identifica una señal de que quieres más espacio; puedes dejar la lista vacía.',
      ],
      [
        'Un cambio de energía',
        'Selecciona qué suele cambiar primero cuando varía tu energía: cuerpo, voz, atención o ganas.',
      ],
      [
        'La señal de curiosidad',
        'Marca qué haces cuando algo despierta tu interés, sin juzgar si es suficiente.',
      ],
      [
        'Tono de voz propio',
        'Nota si tu voz se siente hoy suave, firme, rápida, callada o de otra manera.',
      ],
      [
        'La postura del momento',
        'Observa una postura que tienes ahora y elige si quieres mantenerla o cambiarla.',
      ],
      [
        'Lo que pide atención',
        'Marca una señal que te indique dónde está puesta tu atención en este momento.',
      ],
      [
        'Señal de incertidumbre',
        'Elige cómo notas la incertidumbre: preguntas, quietud, búsqueda de información u otra opción.',
      ],
      [
        'Señal de entusiasmo',
        'Reconoce una señal personal de entusiasmo, aunque sea pequeña o poco visible.',
      ],
      [
        'Señal de fastidio',
        'Marca qué notas cuando algo te fastidia y qué distancia te resulta cómoda.',
      ],
      [
        'La señal de alivio',
        'Identifica cómo notas el alivio cuando llega, sin esperar que tenga una forma concreta.',
      ],
      [
        'Señal de saturación',
        'Elige qué te muestra que hay demasiados estímulos y cuál puedes pausar primero.',
      ],
      [
        'Un momento de quietud',
        'Marca si hoy hubo un instante de quietud; también vale no recordar ninguno.',
      ],
      [
        'Señal de confianza',
        'Selecciona un gesto propio que aparece cuando te sientes en confianza.',
      ],
      [
        'Señal de duda',
        'Reconoce cómo se nota una duda en ti y si necesitas tiempo antes de decidir.',
      ],
      [
        'Señal de cansancio emocional',
        'Marca una pista que te invita a bajar el ritmo; puedes dejarla aquí por ahora.',
      ],
      [
        'Señal de alegría tranquila',
        'Encuentra una forma discreta en que se asoma el disfrute en tu día.',
      ],
      [
        'Señal de necesidad',
        'Elige qué pista te ayuda a notar una necesidad: sensación, pensamiento, límite o petición.',
      ],
      [
        'Señal de pausa social',
        'Identifica cuándo una conversación te pide silencio, cambio de tema o un descanso.',
      ],
      [
        'La emoción en las manos',
        'Nota cómo están tus manos y elige si esa sensación te resulta cómoda, neutra o distinta.',
      ],
      [
        'La emoción en el rostro',
        'Observa tu expresión sin corregirla y elige una palabra que describa el gesto.',
      ],
      [
        'Una señal de seguridad',
        'Marca qué detalle del entorno te ayuda a sentirte más cómodo ahora, si lo hay.',
      ],
      [
        'Señal de cambio',
        'Escoge una pista que te muestre que tu estado actual no es exactamente igual al de antes.',
      ],
      [
        'Lo que prefiero no notar',
        'Elige qué señal puedes dejar para otro momento y cierra la lista cuando quieras.',
      ],
    ],
    undefined,
    ['Una sensación física', 'Un pensamiento o palabra', 'Un gesto o impulso', 'Prefiero pasar'],
  ),
  ...grupo(
    'Escenas cotidianas',
    'preguntas',
    [
      [
        'Un mensaje sin respuesta',
        'En una escena imaginaria, alguien no recibe respuesta a un mensaje. ¿Qué emociones podrían aparecer, sin adivinar una sola?',
      ],
      [
        'Un plan que cambia',
        'Una salida se aplaza por lluvia. ¿Qué respuestas emocionales distintas podrían ser válidas?',
      ],
      [
        'Una invitación inesperada',
        'Alguien recibe una invitación para mañana. ¿Qué podría sentir antes de decidir?',
      ],
      [
        'Una tarea terminada',
        'Una persona termina algo que le tomó tiempo. ¿Qué matices podrían acompañar ese cierre?',
      ],
      [
        'Un elogio en público',
        'Alguien recibe un elogio frente a otras personas. ¿Qué reacciones diferentes podría tener?',
      ],
      [
        'Una espera larga',
        'Una fila avanza despacio. ¿Qué podría notar la persona además de impaciencia?',
      ],
      [
        'La charla por empezar',
        'Dos personas deben hablar de un desacuerdo. ¿Qué emociones podrían coexistir antes de hablar?',
      ],
      [
        'Una noticia ambigua',
        'Llega una noticia que no queda del todo clara. ¿Qué respuesta emocional podría aparecer primero?',
      ],
      [
        'Un día con poco ruido',
        'Una persona pasa un rato en silencio. ¿Qué podría sentir además de tranquilidad?',
      ],
      [
        'Una despedida breve',
        'Alguien se despide por un tiempo. ¿Qué matices podrían acompañar el momento?',
      ],
      [
        'Una meta compartida',
        'Un grupo acuerda un objetivo. ¿Qué emociones distintas pueden aparecer entre sus integrantes?',
      ],
      [
        'Un error pequeño',
        'Alguien se equivoca en un detalle y lo corrige. ¿Qué podría sentir durante el proceso?',
      ],
      [
        'Una visita sorpresa',
        'Llega una visita sin aviso. ¿Qué respuestas posibles tendría quien abre la puerta?',
      ],
      [
        'Un recuerdo que aparece',
        'Una canción trae un recuerdo. ¿Qué emociones distintas podrían venir juntas?',
      ],
      [
        'Una decisión aplazada',
        'Una persona decide esperar antes de responder. ¿Qué podría sentir mientras se da ese tiempo?',
      ],
      [
        'Un lugar conocido',
        'Alguien vuelve a un sitio familiar después de mucho tiempo. ¿Qué matices podrían aparecer?',
      ],
      [
        'Un favor que cuesta pedir',
        'Una persona necesita ayuda con una tarea. ¿Qué puede sentir antes de hacer la petición?',
      ],
      [
        'Una opinión diferente',
        'En una conversación aparece un punto de vista distinto. ¿Qué respuestas emocionales podrían ser compatibles?',
      ],
      [
        'Una pausa en el trabajo',
        'Alguien deja una tarea por unos minutos. ¿Qué podría notar al cambiar de ritmo?',
      ],
      [
        'Una despedida de un objeto',
        'Una persona guarda un objeto querido. ¿Qué emociones variadas podría despertar ese gesto?',
      ],
      [
        'Una puerta que se abre',
        'Alguien empieza una actividad nueva sin saber cómo saldrá. ¿Qué podría sentir al comenzar?',
      ],
      [
        'Un logro ajeno',
        'Una amistad cuenta algo que logró. ¿Qué emociones pueden convivir al escuchar la noticia?',
      ],
      [
        'Una pregunta difícil',
        'En una reunión alguien recibe una pregunta inesperada. ¿Qué podría notar antes de responder?',
      ],
      [
        'Una tarde sin planes',
        'Una persona tiene una tarde libre. ¿Qué emociones podrían aparecer ante el espacio abierto?',
      ],
      [
        'Un cambio de horario',
        'Una cita cambia de hora el mismo día. ¿Qué respuestas diferentes podrían ser razonables?',
      ],
      [
        'Una conversación que termina',
        'Alguien cierra una charla importante. ¿Qué puede quedar después, además de alivio?',
      ],
      [
        'Una sorpresa agradable',
        'Una persona encuentra un detalle que no esperaba. ¿Qué matices podrían acompañar la sorpresa?',
      ],
      [
        'Una opinión propia',
        'Alguien comparte una preferencia y otra persona no coincide. ¿Qué podría sentir cada quien?',
      ],
      [
        'Un objeto perdido',
        'Una persona no encuentra sus llaves y luego aparecen. ¿Qué emociones pueden cambiar durante la búsqueda?',
      ],
      [
        'Un primer intento',
        'Alguien prueba una habilidad por primera vez. ¿Qué emociones podrían estar presentes al mismo tiempo?',
      ],
    ],
    ['Podrían aparecer varias', 'Depende de cada persona', 'Prefiero pasar'],
  ),
  ...grupo('Palabras propias', 'escritura', [
    [
      'Una frase para el ánimo',
      'Completa a tu manera: «Ahora mismo, por dentro se parece a…». Puedes dejarlo vacío.',
    ],
    [
      'Lo que me gustaría decir',
      'Escribe una frase que exprese algo que hoy te cuesta poner en palabras. Puedes guardarla para ti.',
    ],
    [
      'Un nombre provisional',
      'Ponle un nombre temporal a lo que sientes, sabiendo que puedes cambiarlo después.',
    ],
    [
      'La emoción como clima',
      'Describe tu momento con una imagen del clima, sin explicar por qué.',
    ],
    [
      'Un color sin significado',
      'Elige un color para este instante y escribe una palabra sobre él. No hace falta interpretarlo.',
    ],
    [
      'Una nota sin destinatario',
      'Escribe una nota breve sobre una emoción que pasó por tu día. Puedes borrarla al terminar.',
    ],
    [
      'Una pregunta amable',
      'Anota una pregunta que te gustaría hacerte con curiosidad, sin exigir una respuesta.',
    ],
    ['Un título para hoy', 'Ponle un título corto al momento que estás viviendo ahora.'],
    [
      'Lo que no voy a resolver',
      'Escribe una cosa que puedes dejar sin resolver durante este minuto.',
    ],
    [
      'La palabra más cercana',
      'Anota una palabra que se acerque a tu estado, aunque no lo describa del todo.',
    ],
    [
      'Una frase de permiso',
      'Completa: «Hoy puedo permitirme…». La respuesta puede ser «nada por ahora».',
    ],
    [
      'Un borde claro',
      'Escribe una frase que te ayude a expresar un límite sin explicar más de lo que quieres.',
    ],
    [
      'Una emoción en tres palabras',
      'Describe el momento usando hasta tres palabras, sin buscar que suene bonito.',
    ],
    [
      'Una respuesta que espero',
      'Escribe qué te gustaría escuchar de alguien, sin obligación de pedirlo.',
    ],
    [
      'Lo que quiero conservar',
      'Anota un detalle de hoy que quieras recordar, aunque sea pequeño o neutro.',
    ],
    [
      'Una frase para una pausa',
      'Escribe una frase breve que puedas usar para pedir un momento antes de responder.',
    ],
    ['Algo que cambió', 'Cuenta en una línea qué cambió en tu ánimo desde la mañana, si lo sabes.'],
    [
      'Algo que sigue igual',
      'Nombra una sensación o idea que se ha mantenido hoy, sin calificarla.',
    ],
    [
      'La emoción y su volumen',
      'Escribe si lo que sientes está bajo, medio, alto o sin volumen claro.',
    ],
    [
      'Un mensaje sin enviar',
      'Redacta una frase que puedes dejar sin enviar. Decide luego si la guardas o la borras.',
    ],
    [
      'La parte que necesita tiempo',
      'Completa: «Una parte de mí necesita tiempo para…». Puedes pasar.',
    ],
    [
      'Lo que me gustaría preguntar',
      'Escribe una pregunta que te ayude a entender tu preferencia en una situación cotidiana.',
    ],
    [
      'Una descripción sencilla',
      'Describe tu estado como si contaras el color de una pared: con palabras simples y sin explicación.',
    ],
    [
      'Una idea que puedo pausar',
      'Anota un pensamiento que puedes dejar en espera mientras haces otra cosa.',
    ],
    [
      'Mi espacio de hoy',
      'Completa: «Para estar a gusto ahora, me serviría…». La respuesta puede ser cualquier idea.',
    ],
    [
      'El recuerdo sin juicio',
      'Escribe un detalle de un momento reciente sin decir si fue bueno o malo.',
    ],
    [
      'Una palabra que aprendí',
      'Anota una palabra emocional nueva o una que hoy entiendas de otra manera.',
    ],
    ['Una línea para mañana', 'Deja una frase neutral para leer mañana, sin pedirte cambiar nada.'],
    [
      'El final de esta frase',
      'Completa: «Puedo sentir esto y aun así…». Si no te nace, déjala así.',
    ],
    ['Una nota para mí', 'Escríbete una nota breve como hablarías con alguien a quien respetas.'],
  ]),
  ...grupo('Necesidades y preferencias', 'escritura', [
    [
      'Necesito espacio',
      'En este momento, ¿te serviría más espacio, compañía, información o no decidir todavía?',
    ],
    [
      'Necesito claridad',
      '¿Qué dato concreto te ayudaría a sentirte orientado en una situación cotidiana?',
    ],
    [
      'Una preferencia pequeña',
      '¿Qué preferencia tuya podrías nombrar hoy, aunque sea sobre algo sencillo?',
    ],
    [
      'Lo que puede esperar',
      '¿Cuál de estas cosas puede esperar sin que tengas que resolverla ahora?',
    ],
    [
      'Necesito compañía',
      '¿Qué tipo de compañía te resulta más cómoda hoy: conversar, compartir silencio o escribir?',
    ],
    [
      'Un ritmo posible',
      '¿Qué ritmo te gustaría probar en la próxima tarea: lento, habitual o con pausas?',
    ],
    [
      'Necesito información',
      '¿Qué pregunta concreta te falta responder antes de tomar una decisión?',
    ],
    [
      'Una opción más cómoda',
      '¿Qué ajuste pequeño haría una actividad cotidiana más cómoda para ti?',
    ],
    [
      'Pedir una pausa',
      '¿Qué palabras podrías usar para pedir una pausa breve en una conversación?',
    ],
    [
      'Lo que quiero cuidar',
      '¿Qué aspecto de tu tiempo o energía te gustaría cuidar durante la próxima hora?',
    ],
    [
      'Necesito silencio',
      '¿Qué señal podrías dar para pedir un momento de silencio sin explicar el motivo?',
    ],
    [
      'Una decisión sin prisa',
      '¿Qué elección podrías dejar abierta hasta tener más información o ganas?',
    ],
    [
      'Puedo elegir el cómo',
      'En una tarea pendiente, ¿qué parte del modo de hacerla sí puedes escoger?',
    ],
    [
      'Una ayuda concreta',
      '¿Qué petición pequeña te resultaría clara y específica si decidieras hacerla?',
    ],
    ['Necesito un límite', '¿Qué límite de tiempo o espacio te gustaría tener presente hoy?'],
    [
      'Elijo no responder',
      '¿Qué frase breve podrías usar si hoy no quieres responder una pregunta personal?',
    ],
    [
      'La compañía adecuada',
      '¿Qué hace que una conversación se sienta cómoda para ti: escucha, humor, pausas u otra cosa?',
    ],
    [
      'Una actividad que sí quiero',
      '¿Qué actividad cotidiana te gustaría elegir por gusto, sin convertirla en tarea?',
    ],
    [
      'Necesito menos opciones',
      '¿Qué decisión sería más fácil si redujeras las alternativas a dos?',
    ],
    ['Necesito más tiempo', '¿En qué situación te vendría bien decir «lo pienso y te cuento»?'],
    [
      'Mi forma de participar',
      '¿Cómo te gusta participar cuando hay un plan grupal: proponiendo, escuchando o eligiendo después?',
    ],
    [
      'Una necesidad sin culpa',
      '¿Qué necesidad puedes reconocer sin tener que justificarla ante nadie?',
    ],
    [
      'Lo que sí puedo cambiar',
      '¿Qué detalle del entorno puedes ajustar para sentirte más cómodo?',
    ],
    [
      'Una expectativa propia',
      '¿Qué expectativa sobre ti podrías volver más flexible durante este día?',
    ],
    [
      'El tipo de apoyo',
      'Si quisieras apoyo, ¿preferirías una idea, compañía, escucha o ayuda práctica?',
    ],
    [
      'Un acuerdo conmigo',
      '¿Qué acuerdo pequeño y realista te gustaría hacer contigo para la próxima hora?',
    ],
    [
      'Lo que me resulta suficiente',
      '¿Qué cantidad de conversación, silencio o actividad te parece suficiente hoy?',
    ],
    ['Elegir con el cuerpo cómodo', '¿Qué postura o lugar te ayudaría a elegir con más comodidad?'],
    ['Un «no» posible', '¿Qué respuesta corta podrías dar cuando algo no te viene bien?'],
    ['Un «sí» propio', '¿Qué actividad te gustaría aceptar porque sí quieres, no por compromiso?'],
  ]),
  ...grupo(
    'Vínculos y comunicación',
    'tarjeta',
    [
      [
        'Escucha sin arreglar',
        'Lee una escena: una amistad cuenta que tuvo un día difícil. Elige una respuesta que primero escuche.',
      ],
      [
        'Agradecer a mi manera',
        'Piensa en alguien a quien quieras agradecer algo concreto. Elige si prefieres decirlo, escribirlo o guardarlo.',
      ],
      [
        'Una llamada de reencuentro',
        'Hace tiempo que no hablas con alguien y recibes un mensaje suyo. Elige cómo te gustaría empezar, si quieres responder.',
      ],
      [
        'Pedir que me escuchen',
        'Elige una frase para pedir escucha sin recibir consejos de inmediato.',
      ],
      [
        'Compartir una buena noticia',
        'Decide cómo te gustaría compartir una noticia que te alegra, si quieres compartirla.',
      ],
      [
        'Reparar un malentendido',
        'Ante un malentendido pequeño, elige entre preguntar, aclarar tu intención o tomar tiempo.',
      ],
      [
        'Una charla con pausas',
        'Escoge una manera de pausar una conversación si necesitas ordenar tus ideas.',
      ],
      [
        'Reconocer el esfuerzo ajeno',
        'Elige una forma concreta de reconocer algo que otra persona hizo, sin exagerar.',
      ],
      [
        'Un saludo que me representa',
        'Escoge cómo saludarías hoy a alguien importante para ti: con palabras, gesto o mensaje.',
      ],
      [
        'Hacer una pregunta abierta',
        'Elige una pregunta respetuosa que invite a alguien a contar solo lo que quiera.',
      ],
      [
        'Compartir silencio',
        'Piensa en una compañía con la que puedes estar en silencio. Decide si hoy te gustaría buscarla.',
      ],
      [
        'Responder más tarde',
        'Escoge una frase breve para avisar que responderás un mensaje cuando puedas.',
      ],
      ['Decir que no entendí', 'Elige una frase para pedir que expliquen algo de otra manera.'],
      [
        'Celebrar sin comparar',
        'Piensa en un logro ajeno y escoge una forma de alegrarte por esa persona a tu manera.',
      ],
      [
        'Cuidar una confidencia',
        'Si alguien te cuenta algo privado, elige qué conducta muestra respeto por su confianza.',
      ],
      [
        'Aclarar una preferencia',
        'Elige cómo podrías contar qué plan te gusta más sin descartar las ideas de otras personas.',
      ],
      [
        'Recibir un cumplido',
        'Cuando alguien te dice algo amable, escoge cómo te gustaría responder, incluso con un simple gracias.',
      ],
      [
        'Un contacto que me hace bien',
        'Elige si hoy te gustaría escribir, llamar, encontrarte o no contactar a nadie.',
      ],
      [
        'Poner fin a una charla',
        'Escoge una forma amable y clara de terminar una conversación cuando necesites seguir con tu día.',
      ],
      [
        'Escuchar otra experiencia',
        'Elige una pregunta que permita escuchar a alguien sin asumir que siente lo mismo que tú.',
      ],
      [
        'Pedir una aclaración',
        'Ante una frase que no entiendes, decide si prefieres preguntar, confirmar o volver al tema luego.',
      ],
      [
        'Expresar desacuerdo',
        'Escoge una manera de decir que ves una situación distinto y mantener el respeto.',
      ],
      [
        'Aceptar una invitación',
        'Una persona te invita a un plan. Elige cómo decidir según tus ganas y tu disponibilidad.',
      ],
      [
        'Rechazar un plan',
        'Escoge una frase honesta para declinar un plan sin inventar explicaciones.',
      ],
      [
        'Un mensaje de apoyo',
        'Elige una frase breve que podrías enviar a alguien sin prometer resolver su problema.',
      ],
      [
        'Pedir ayuda concreta',
        'Selecciona qué petición sería más clara: qué necesitas, cuándo y con qué parte.',
      ],
      [
        'Hablar desde mí',
        'Escoge una frase que empiece por «yo prefiero» para expresar una necesidad propia.',
      ],
      [
        'Dar espacio a otra voz',
        'En una conversación grupal, elige cómo invitar a participar sin presionar a nadie.',
      ],
      [
        'Cuidar mi intimidad',
        'Elige qué información personal prefieres no compartir en una conversación.',
      ],
      [
        'Reconectar sin obligación',
        'Piensa en alguien a quien extrañas y decide si escribirle, recordarle o dejarlo para otro día.',
      ],
    ],
    ['Escucho primero', 'Pregunto qué necesita', 'Prefiero pasar'],
  ),
  ...grupo('Límites y decisiones', 'escritura', [
    [
      'El límite del horario',
      '¿Qué frase usarías para cerrar una conversación cuando ya necesitas continuar con otra cosa?',
    ],
    [
      'Una tarea compartida',
      '¿Qué parte de una tarea compartida te corresponde y qué parte conviene conversar?',
    ],
    [
      'Una pregunta personal',
      '¿Qué podrías responder si no quieres hablar de un asunto personal ahora?',
    ],
    [
      'El espacio físico',
      '¿Cómo expresarías que necesitas más espacio físico en una situación cotidiana?',
    ],
    ['Cambiar de opinión', '¿Qué palabras te ayudarían a cambiar un plan que aceptaste antes?'],
    [
      'Una petición incómoda',
      '¿Qué dato necesitas para decidir si aceptas una petición de alguien?',
    ],
    [
      'El tiempo propio',
      '¿Qué actividad de tu día necesita un límite de tiempo para no ocuparlo todo?',
    ],
    [
      'Un límite digital',
      '¿Qué aviso del teléfono puedes silenciar por un rato si así lo decides?',
    ],
    ['Un tema que pauso', '¿Cómo podrías pedir que un tema se retome en otro momento?'],
    ['Decir «hasta aquí»', '¿Qué señal te indicaría que una actividad ya es suficiente por hoy?'],
    [
      'No decidir por presión',
      '¿Qué frase podrías usar para pedir tiempo antes de aceptar una propuesta?',
    ],
    [
      'Una decisión compartida',
      '¿Qué opción te permitiría expresar tu preferencia y escuchar la de otra persona?',
    ],
    [
      'Mi espacio de trabajo',
      '¿Qué límite sencillo haría más claro el inicio o el cierre de tu jornada?',
    ],
    [
      'Una expectativa ajena',
      '¿Qué parte de una expectativa de otra persona necesitas aclarar antes de responder?',
    ],
    ['El límite de una broma', '¿Qué frase breve usarías si una broma no te resulta cómoda?'],
    [
      'Un favor posible',
      '¿Qué parte de una petición sí podrías hacer y qué parte no te corresponde?',
    ],
    [
      'Cuidar una conversación',
      '¿Qué acuerdo ayudaría a que una conversación difícil tenga un principio y un final claros?',
    ],
    [
      'Elegir lo que cuento',
      '¿Qué detalle decides reservar para ti aunque otras personas pregunten?',
    ],
    [
      'Mi respuesta auténtica',
      '¿Cómo distinguirías entre aceptar por ganas y aceptar solo para evitar incomodidad?',
    ],
    ['Un cambio de plan', '¿Qué necesitas saber para decidir si un cambio de plan te viene bien?'],
    [
      'Una pausa antes del sí',
      '¿Qué pregunta podrías hacerte antes de comprometer tiempo que todavía no tienes?',
    ],
    [
      'Un límite con amabilidad',
      '¿Qué frase clara y respetuosa podría expresar un «no» en esta situación?',
    ],
    [
      'Una tarea que no me toca',
      '¿Qué pregunta te ayudaría a aclarar quién se encarga de un pendiente compartido?',
    ],
    [
      'El momento de retirarme',
      '¿Qué señal te indicaría que quieres dejar una reunión o cambiar de espacio?',
    ],
    [
      'Un acuerdo que revisar',
      '¿Qué acuerdo cotidiano podrías revisar si ya no te resulta práctico?',
    ],
    ['Lo que acepto hoy', '¿Qué compromiso de hoy eliges mantener, ajustar o conversar?'],
    [
      'El límite del consejo',
      '¿Qué frase usarías para agradecer un consejo y explicar que quieres decidir por tu cuenta?',
    ],
    ['La puerta entreabierta', '¿Qué tema preferirías conversar solo con alguien de confianza?'],
    [
      'Un espacio para pensar',
      '¿Cómo pedirías un momento a solas antes de responder a una situación?',
    ],
    [
      'Mi decisión pequeña',
      'Elige una decisión cotidiana que quieras tomar a tu ritmo y sin pedir permiso.',
    ],
  ]),
  ...grupo('Emociones mezcladas', 'escritura', [
    [
      'Dos cosas verdaderas',
      'Escribe dos emociones que puedan coexistir hoy sin tener que escoger una.',
    ],
    [
      'Agridulce',
      'Describe un momento que tuvo una parte agradable y otra difícil, solo si quieres.',
    ],
    ['Querer y dudar', 'Completa: «Me interesa… y todavía tengo dudas sobre…».'],
    [
      'Alivio con cansancio',
      'Anota cómo conviven el alivio y el cansancio después de terminar algo.',
    ],
    [
      'Alegría con nervios',
      'Pon en palabras una situación donde puedan aparecer ilusión y nervios al mismo tiempo.',
    ],
    [
      'Cariño y distancia',
      'Escribe una frase sobre querer a alguien y necesitar también tu espacio.',
    ],
    ['Nostalgia y presente', 'Nombra un recuerdo que extrañas y un detalle que te acompaña ahora.'],
    ['Orgullo y humildad', 'Describe un logro propio sin quitarle valor ni compararlo con nadie.'],
    ['Tranquilidad e incertidumbre', 'Completa: «Puedo sentir calma sobre… y no saber todavía…».'],
    [
      'Curiosidad con cautela',
      'Escribe qué te da curiosidad y qué prefieres observar antes de acercarte.',
    ],
    [
      'Fastidio y cuidado',
      'Anota algo que te molesta y una manera de cuidar tu espacio mientras pasa.',
    ],
    [
      'Pena y compañía',
      'Escribe qué tipo de compañía te gustaría tener cuando aparece la pena, si alguna.',
    ],
    [
      'Confianza con preguntas',
      'Nombra algo en lo que confías y una pregunta que todavía mantienes abierta.',
    ],
    ['Emoción sin conclusión', 'Describe dos sensaciones distintas sin explicar qué significan.'],
    ['Un sí y un no', 'Completa: «Una parte de mí dice sí a… y otra parte pide…».'],
    [
      'Recuerdo que cambia',
      'Escribe cómo puede sentirse distinto un mismo recuerdo según el día, sin decidir cuál versión vale.',
    ],
    [
      'Esperanza con paciencia',
      'Anota algo que esperas y cuánto espacio quieres darte mientras llega.',
    ],
    [
      'Duda con interés',
      'Escribe una pregunta que conserve tu interés sin obligarte a resolver la duda.',
    ],
    ['Energía irregular', 'Describe cómo es tener ganas para una cosa y poca energía para otra.'],
    [
      'Una mezcla sin nombre',
      'Pon una imagen o palabra a una combinación emocional que aún no sabes nombrar.',
    ],
    [
      'Risa y preocupación',
      'Nombra si hoy hubo un momento divertido junto a algo que todavía te ocupa.',
    ],
    ['Despedida y comienzo', 'Escribe dos palabras para algo que termina y algo que empieza.'],
    [
      'Deseo y realidad',
      'Describe algo que deseas y una condición real que necesitas considerar, sin juzgarla.',
    ],
    ['Satisfacción con cansancio', 'Nombra una tarea que te dejó satisfecho y también te agotó.'],
    [
      'Confusión con una pista',
      'Escribe una pequeña pista que sí tienes aunque el panorama siga confuso.',
    ],
    [
      'Entusiasmo y pausa',
      'Anota qué te entusiasma y qué pausa te ayudaría a disfrutarlo a tu ritmo.',
    ],
    ['Afecto y desacuerdo', 'Completa: «Puedo querer a alguien y pensar distinto sobre…».'],
    ['Cambio y familiaridad', 'Nombra algo que está cambiando y algo conocido que permanece.'],
    [
      'Lo que convive hoy',
      'Haz una lista de dos emociones presentes y deja ambas sin explicación.',
    ],
    ['Un final abierto', 'Termina esta frase: «No tengo que elegir entre… y…».'],
  ]),
  ...grupo(
    'Expresión creativa',
    'tarjeta',
    [
      [
        'Un paisaje interior',
        'Elige elementos para imaginar un paisaje emocional, sin darles una interpretación fija.',
      ],
      [
        'La paleta del momento',
        'Elige colores que se parezcan al momento actual; puedes elegir ninguno.',
      ],
      [
        'Una forma para la emoción',
        'Selecciona una forma, una textura y un tamaño para representar tu estado.',
      ],
      [
        'Ritmo emocional',
        'Marca qué ritmo tendría tu momento: pausado, entrecortado, constante, cambiante o silencioso.',
      ],
      [
        'Una canción sin letra',
        'Piensa en una melodía instrumental que acompañe tu ánimo y señala qué ritmo tendría.',
      ],
      [
        'Objeto imaginario',
        'Diseña un objeto imaginario que represente cómo quieres sentirte en tu espacio.',
      ],
      [
        'Un personaje de hoy',
        'Elige tres rasgos para un personaje que atraviesa una situación parecida a la de hoy.',
      ],
      [
        'La forma de una pausa',
        'Escoge una imagen para una pausa: banco, nube, ventana, manta u otra que inventes.',
      ],
      [
        'Un símbolo personal',
        'Selecciona un símbolo que represente una emoción sin convertirlo en una explicación.',
      ],
      [
        'Una viñeta sin palabras',
        'Imagina una viñeta de tres cuadros sobre tu día y elige qué aparece en cada uno.',
      ],
      [
        'Un mapa de colores',
        'Asigna un color a tres momentos distintos, sin decidir si alguno fue mejor.',
      ],
      [
        'La emoción como sonido',
        'Elige si tu emoción se parecería a un sonido largo, breve, suave, repetido o al silencio.',
      ],
      [
        'Un título de película',
        'Ponle un título de película a este momento, realista o disparatado.',
      ],
      [
        'Un objeto compañero',
        'Escoge un objeto cotidiano que acompañaría a tu estado de ánimo y cuenta por qué te llamó.',
      ],
      [
        'El clima en tres formas',
        'Elige una forma para el cielo, otra para el suelo y otra para tu estado de hoy.',
      ],
      [
        'Un movimiento de lápiz',
        'Imagina un trazo que acompañe tu emoción: recto, curvo, suave, fuerte o discontinuo.',
      ],
      [
        'Una escena con distancia',
        'Dibuja mentalmente una escena y decide dónde ubicarías a quien la observa.',
      ],
      [
        'Una metáfora propia',
        'Escoge una metáfora nueva para tu estado, evitando buscar una explicación.',
      ],
      [
        'Un color que falta',
        'Añade un color inesperado a la paleta de hoy y decide si quieres conservarlo.',
      ],
      [
        'Un ritmo con las manos',
        'Elige un patrón breve de palmas o dedos que acompañe tu energía, sin acelerar.',
      ],
      [
        'La emoción en una postal',
        'Compón una postal imaginaria con un lugar, un objeto y una frase corta.',
      ],
      [
        'Un collage de sensaciones',
        'Combina una textura, una temperatura y un sonido que describan este instante.',
      ],
      [
        'El nombre de una nube',
        'Inventa un nombre para una nube que se parezca a una emoción sin nombre.',
      ],
      [
        'Una escena en pausa',
        'Elige qué parte de una escena cotidiana dejarías quieta por un momento.',
      ],
      [
        'Un gesto de personaje',
        'Escoge un gesto que mostraría tu personaje y otro que preferiría guardar.',
      ],
      [
        'Una emoción con forma',
        'Elige entre círculo, espiral, línea o forma libre para representar una sensación.',
      ],
      [
        'Una palabra dibujada',
        'Escoge una palabra y piensa cómo cambiaría su forma si la dibujaras.',
      ],
      [
        'Una caja imaginaria',
        'Elige qué emoción guardarías en una caja por hoy y cuál dejarías afuera.',
      ],
      [
        'Una escena de dos colores',
        'Describe una escena usando solo dos colores que convivan en tu día.',
      ],
      [
        'El final que elijo',
        'Imagina un final para una escena cotidiana que te deje con una sensación de elección.',
      ],
    ],
    ['Una imagen o color', 'Un sonido o ritmo', 'Prefiero no elegir'],
  ),
  ...grupo('Pausa y presencia', 'pasos', [
    ['Ventana de sonidos', 'Escucha un instante sin intentar cambiar lo que sientes.'],
    ['Texturas a mano', 'Nota una textura cercana y elige si quieres seguir observándola.'],
    [
      'Mirada que descansa',
      'Deja que la vista se pose en un punto cómodo y vuelve cuando quieras.',
    ],
    [
      'Apoyo de los pies',
      'Nota el apoyo de tus pies o elige otra parte del cuerpo que te resulte cómoda.',
    ],
    ['Un objeto cercano', 'Mira un objeto cotidiano y observa un detalle que no habías notado.'],
    ['Temperatura del aire', 'Nota si el aire se siente fresco, tibio o difícil de distinguir.'],
    ['Orientarme en el lugar', 'Observa dos señales que te recuerden dónde estás ahora.'],
    [
      'Una pausa visual',
      'Elige algo lejano o cercano para mirar; puedes apartar la vista cuando quieras.',
    ],
    ['Sonido que se aleja', 'Escucha un sonido hasta que cambie o termine, sin perseguirlo.'],
    ['Contacto con la silla', 'Nota el contacto con el asiento y cambia de postura si lo deseas.'],
    [
      'Una forma en el entorno',
      'Encuentra una forma geométrica a la vista y sigue su contorno con los ojos.',
    ],
    ['Pausa entre tareas', 'Deja quietas las manos un momento y decide qué tarea viene después.'],
    ['Un color presente', 'Busca un color en el entorno y nota qué objetos lo tienen.'],
    [
      'La habitación en silencio',
      'Escucha el silencio o los sonidos suaves del lugar donde estás.',
    ],
    [
      'El peso de un objeto',
      'Sostén un objeto liviano si te resulta cómodo y nota su peso por un instante.',
    ],
    ['Un punto de apoyo', 'Elige un apoyo cómodo del cuerpo y nota que está ahí.'],
    [
      'Una línea que guía',
      'Sigue con la mirada una línea del entorno hasta donde te resulte fácil.',
    ],
    ['Distancias del lugar', 'Mira algo cercano, algo a media distancia y algo más lejano.'],
    ['Manos en reposo', 'Deja las manos en una posición cómoda y nota qué quieres hacer después.'],
    [
      'Una cosa estable',
      'Encuentra un detalle que permanezca quieto mientras otras cosas se mueven.',
    ],
    [
      'Un minuto sin tarea',
      'Durante este paso puedes descansar la atención y terminar cuando quieras.',
    ],
    ['Vuelvo a mis sentidos', 'Elige una cosa que ves, una que oyes y una que sientes al tacto.'],
    [
      'El borde de un objeto',
      'Observa el borde de un objeto cotidiano y vuelve al espacio a tu ritmo.',
    ],
    [
      'El entorno por capas',
      'Nota primero un objeto, después un sonido y luego el espacio entre ambos.',
    ],
    [
      'Una pausa en movimiento',
      'Si te resulta cómodo, cambia de postura una vez y observa el nuevo apoyo.',
    ],
    ['Una luz del lugar', 'Nota una zona iluminada y otra más oscura, sin necesidad de moverte.'],
    [
      'La distancia que prefiero',
      'Elige si quieres estar más cerca o más lejos de un objeto del entorno.',
    ],
    [
      'Una respiración libre',
      'Deja que una respiración ocurra a su ritmo; no la alargues ni la cuentes.',
    ],
    [
      'Vuelvo al presente sentado',
      'Nota el contacto con el lugar donde estás y nombra mentalmente el espacio.',
    ],
    ['Cerrar la pausa', 'Elige un detalle del entorno para llevarte al siguiente momento.'],
  ]),
  ...grupo(
    'Elecciones pequeñas',
    'tarjeta',
    [
      [
        'Elegir cómo seguir',
        'Piensa en una actividad pendiente y escoge una forma de continuar: empezar, pedir ayuda o pausarla.',
      ],
      [
        'Una opción amable',
        'Elige qué te conviene más para la siguiente hora: compañía, silencio o flexibilidad.',
      ],
      [
        'Cambiar el plan',
        'Escoge si quieres mantener, ajustar o aplazar un plan que no te resulta cómodo.',
      ],
      [
        'Pedir claridad',
        'Decide qué paso te serviría más: hacer una pregunta, revisar un dato o esperar.',
      ],
      [
        'Un gesto pequeño',
        'Elige un gesto de cuidado emocional: hablarlo, escribirlo, tomar aire libre o no hacer nada.',
      ],
      [
        'Una respuesta posible',
        'Ante una invitación, escoge la respuesta más honesta para tus ganas y tu tiempo.',
      ],
      [
        'El siguiente paso',
        'Elige entre avanzar un poco, dividir la tarea o dejarla para otro momento.',
      ],
      [
        'Mi espacio ahora',
        'Decide si quieres estar a solas, con alguien conocido o en un espacio compartido.',
      ],
      [
        'Lo que quiero escuchar',
        'Escoge una frase que te gustaría recibir hoy: una pregunta, una escucha o un ánimo.',
      ],
      [
        'Mi transición elegida',
        'Entre dos tareas, elige una transición que te sirva: ordenar el espacio, cambiar de actividad o tomar un momento.',
      ],
      [
        'Una idea para después',
        'Decide qué asunto dejarás en pausa y cuándo te gustaría retomarlo, si lo sabes.',
      ],
      [
        'Cómo cerrar una tarea',
        'Elige un cierre sencillo: guardar, anotar el siguiente paso o pedir que te releven.',
      ],
      [
        'Un plan flexible',
        'Escoge qué parte de un plan puedes cambiar si tus necesidades cambian.',
      ],
      [
        'Elijo mi compañía',
        'Decide qué compañía te gustaría tener en una actividad cotidiana, si alguna.',
      ],
      [
        'Un mensaje pendiente',
        'Escoge si responderás ahora, más tarde o cuando tengas claro qué quieres decir.',
      ],
      [
        'Una pregunta antes de sí',
        'Elige qué preguntarías antes de aceptar: duración, responsabilidades o posibilidad de cambiar.',
      ],
      [
        'Una versión más fácil',
        'Selecciona una forma de reducir una tarea sin abandonar lo que te importa de ella.',
      ],
      [
        'Hacer una pausa social',
        'Escoge una señal para darte una pausa en una reunión o conversación.',
      ],
      [
        'Un descanso elegido',
        'Decide qué tipo de descanso te apetece probar: quietud, distracción o compañía.',
      ],
      [
        'La primera prioridad',
        'Elige qué necesidad atender primero: tiempo, información, espacio o ayuda práctica.',
      ],
      [
        'Un compromiso posible',
        'Escoge una versión realista de un compromiso para hoy o decide no asumirlo.',
      ],
      [
        'Cambiar de tema',
        'Elige una frase para cambiar de tema cuando ya no quieres continuar con uno.',
      ],
      [
        'Dejar algo sin responder',
        'Decide si una pregunta puede quedarse abierta hasta que tengas más ganas.',
      ],
      [
        'Un lugar cómodo',
        'Escoge dónde te gustaría conversar: en un sitio familiar, neutral o por mensaje.',
      ],
      [
        'Hacerlo acompañado',
        'Elige si prefieres hacer una tarea con compañía, con apoyo puntual o por tu cuenta.',
      ],
      [
        'Mi manera de agradecer',
        'Decide cómo expresarías agradecimiento: en persona, con una nota o sin decirlo todavía.',
      ],
      ['Pedir un cambio', 'Elige una forma clara de proponer un cambio pequeño en un acuerdo.'],
      ['Decir lo que prefiero', 'Escoge una frase que exprese tu preferencia con naturalidad.'],
      [
        'Pausar el teléfono',
        'Elige si quieres silenciar avisos durante un rato, mantenerlos o decidirlo luego.',
      ],
      ['Terminar a mi ritmo', 'Decide qué señal te indicará que es suficiente por ahora.'],
    ],
    ['Lo intento ahora', 'Lo adapto a mi manera', 'Lo dejo para otro momento'],
  ),
  ...grupo('Preferencias y expresión', 'escritura', [
    [
      'Mi forma de recibir apoyo',
      'Completa: «Cuando quiero apoyo, me ayuda más…». Puedes escribir una opción o dejarlo vacío.',
    ],
    [
      'Una conversación cómoda',
      'Describe una condición que hace más cómoda para ti una conversación importante.',
    ],
    [
      'Una invitación ideal',
      'Escribe cómo sería una invitación que te permitiera responder con libertad.',
    ],
    ['Mi señal de pausa', 'Inventa una palabra o gesto que puedas usar para pedir una pausa.'],
    [
      'Una forma de celebrar',
      'Anota cómo te gusta celebrar algo pequeño, incluso si prefieres no celebrarlo.',
    ],
    [
      'Una preferencia que cambia',
      'Nombra una preferencia que puede variar según el día y está bien que cambie.',
    ],
    [
      'Mi espacio para decidir',
      'Escribe qué necesitas para sentir que una decisión es realmente tuya.',
    ],
    [
      'Una pregunta que me sirve',
      'Anota una pregunta que te ayude a reconocer lo que prefieres en un momento social.',
    ],
    [
      'Un límite que quiero cuidar',
      'Escribe un límite cotidiano que te gustaría recordar, sin tener que aplicarlo ahora.',
    ],
    [
      'La palabra para pedir tiempo',
      'Elige una palabra que te ayude a no responder con prisa y escribe una frase con ella.',
    ],
    [
      'Mi manera de decir gracias',
      'Describe qué forma de agradecimiento se siente más natural para ti.',
    ],
    [
      'Una conversación que puedo posponer',
      'Nombra un tema que no necesitas hablar hoy y una fecha o señal para retomarlo, si quieres.',
    ],
    ['Cómo me gusta escuchar', 'Completa: «Cuando cuento algo, prefiero que la otra persona…».'],
    [
      'Una frase que me representa',
      'Escribe una frase breve que exprese una opinión propia sin compararte con nadie.',
    ],
    ['Lo que prefiero reservar', 'Nombra un tema personal que eliges guardar para ti por ahora.'],
    [
      'Una forma de pedir claridad',
      'Redacta una pregunta sencilla que podrías hacer cuando algo no queda claro.',
    ],
    ['Mi ritmo al responder', 'Completa: «Para responder con calma, me sirve…».'],
    [
      'Un plan con alternativas',
      'Escribe dos maneras distintas de participar en un plan sin tener que elegir todavía.',
    ],
    [
      'La compañía que prefiero',
      'Describe qué tipo de compañía te apetece en una tarde tranquila.',
    ],
    ['Una voz que escucho', 'Anota una frase que te gustaría escuchar cuando compartes una duda.'],
    [
      'Lo que sí quiero compartir',
      'Elige algo que sí te gusta contar de ti y escríbelo en una línea.',
    ],
    [
      'Mi manera de cambiar de opinión',
      'Escribe una frase para explicar que cambiaste de parecer.',
    ],
    [
      'Un espacio propio',
      'Nombra un lugar o momento del día en el que te gusta tener espacio propio.',
    ],
    [
      'Una petición sencilla',
      'Redacta una petición concreta que te haría más fácil una tarea cotidiana.',
    ],
    ['Un acuerdo flexible', 'Completa: «Un acuerdo me funciona mejor cuando…».'],
    [
      'Mi señal de comodidad',
      'Describe un detalle que te hace sentir cómodo al conocer un lugar nuevo.',
    ],
    [
      'Una elección sin testigos',
      'Anota una decisión pequeña que prefieres tomar sin que nadie la califique.',
    ],
  ]),
];

const TOTAL_NUEVAS = 357;
const IDEAS_ANUALES = IDEAS.slice(0, TOTAL_NUEVAS);

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLocaleLowerCase('es-CO')
    .trim();
}

const FINALES_INCOMPLETOS = new Set(
  'a al ante bajo con contra de del desde durante el ella en entre hacia hasta la las lo los no o para por que según sin sobre tras un una unos unas y'.split(
    ' ',
  ),
);

function resumenDe(nombre: string, usados: Set<string>): string {
  const palabras = nombre.match(/[\p{L}\p{N}]+/gu) ?? [];
  const opciones: string[][] = [palabras];
  const significativas = palabras.filter(
    (palabra) => !FINALES_INCOMPLETOS.has(palabra.toLocaleLowerCase('es-CO')),
  );

  if (significativas.length >= 2 && significativas.length !== palabras.length) {
    opciones.push(significativas);
  }

  for (const candidatas of opciones) {
    for (const largo of [3, 2]) {
      for (let inicio = 0; inicio <= candidatas.length - largo; inicio += 1) {
        const parte = candidatas.slice(inicio, inicio + largo);
        const primera = parte[0]?.toLocaleLowerCase('es-CO');
        const ultima = parte.at(-1)?.toLocaleLowerCase('es-CO');
        const resumen = parte.join(' ');
        const clave = normalizar(resumen);

        if (
          primera !== undefined &&
          ultima !== undefined &&
          !FINALES_INCOMPLETOS.has(primera) &&
          !FINALES_INCOMPLETOS.has(ultima) &&
          !usados.has(clave)
        ) {
          usados.add(clave);
          return `${resumen[0]?.toLocaleUpperCase('es-CO')}${resumen.slice(1)}`;
        }
      }
    }
  }

  throw new Error(`No se encontró una descripción breve única para «${nombre}».`);
}

const RESUMENES = new Set<string>();
const CLAVES_OPCION = opcionesDeTarjeta(
  ['me-representa', 'Se parece a mí ahora'],
  ['no-lo-se', 'No lo tengo claro'],
  ['paso', 'Prefiero pasar'],
);

function opcionesPara(idea: Idea) {
  const respuestas = idea.respuestas;
  return respuestas === undefined
    ? CLAVES_OPCION
    : opcionesDeTarjeta(
        ['primera', respuestas[0]],
        ['segunda', respuestas[1]],
        ['paso', respuestas[2]],
      );
}

function parametrosDe(idea: Idea): Parametros {
  switch (idea.formato) {
    case 'rueda': {
      const base = sesionesDeRueda()[0]?.parametros;
      if (base === undefined) throw new Error('La rueda de emociones no tiene contenido base.');
      return {
        ...base,
        indicacion: 'Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.',
        puerta: { titulo: idea.nombre, texto: idea.consigna },
        linea: { invitacion: 'Si quieres, cuéntalo en una línea.', largoMaximo: 200 },
        cierre: 'Gracias por tomarte este momento.',
      };
    }
    case 'preguntas':
      return {
        modo: 'preguntas',
        indicacion: 'No hay respuestas correctas. Elige una o pasa.',
        preguntas: [
          { clave: 'eleccion', texto: idea.consigna, tipo: 'opcion', opciones: opcionesPara(idea) },
        ],
        enlaceAlAviso: false,
        cierre: 'Tu respuesta no necesita explicación.',
      };
    case 'lista':
      return {
        modo: 'lista',
        indicacion: idea.consigna,
        items: (idea.elementos ?? []).map((texto, indice) => ({
          clave: `opcion-${indice + 1}`,
          texto,
        })),
        cierre: 'Puedes marcar una, varias o ninguna.',
      };
    case 'escritura':
      return {
        invitacion: idea.consigna,
        campos: 1,
        minimo: 1,
        largoMaximo: 240,
        permiteNingunaHoy: true,
        cierre: 'Puedes guardar, borrar o dejarlo en blanco.',
      };
    case 'tarjeta':
      return tarjeta({
        titulo: idea.nombre,
        texto: idea.consigna,
        opciones: opcionesPara(idea),
        indicacion: 'No hay una respuesta que debas elegir.',
        cierre: 'Gracias por elegir a tu manera.',
      });
    case 'pasos':
      return {
        modo: 'pasos',
        intro: 'Esta pausa es breve y puedes terminarla cuando quieras.',
        avance: 'manual',
        pasos: idea.pasos?.map(([titulo, texto]) => ({ titulo, texto })) ?? [],
        cierre: 'Gracias por darte este momento.',
        avisoSiempre: 'Puedes saltarte un paso o parar cuando quieras.',
      };
  }
}

function crearMecanica(idea: Idea, indice: number): MecanicaDeContenido {
  const codigo = `EMO-${String(indice + 10).padStart(2, '0')}`;
  const nombre = `${idea.tema}: ${idea.nombre}`;
  const palabrasSignificativas = (idea.nombre.match(/[\p{L}\p{N}]+/gu) ?? []).filter(
    (palabra) => !FINALES_INCOMPLETOS.has(palabra.toLocaleLowerCase('es-CO')),
  );
  const resumen = resumenDe(
    palabrasSignificativas.length > 1 ? idea.nombre : `${idea.tema} ${idea.nombre}`,
    RESUMENES,
  );

  return mecanicaSinPuntaje({
    codigo,
    id: idDeMecanica(codigo),
    categoria: 'Emociones',
    nombre,
    descripcion: resumen,
    motor:
      idea.formato === 'rueda'
        ? 'cuestionario_corto'
        : idea.formato === 'pasos'
          ? 'guia_paso_a_paso'
          : idea.formato === 'escritura'
            ? 'escritura_breve'
            : 'cuestionario_corto',
    sesiones: [sesion(codigo, 1, idea.nombre, parametrosDe(idea))],
  });
}

if (IDEAS_ANUALES.length !== TOTAL_NUEVAS) {
  throw new Error(
    `Emociones 365 necesita ${TOTAL_NUEVAS} actividades nuevas; hay ${IDEAS_ANUALES.length}.`,
  );
}

const NOMBRES = IDEAS_ANUALES.map((idea) => normalizar(`${idea.tema}: ${idea.nombre}`));
const TITULOS = IDEAS_ANUALES.map((idea) => normalizar(idea.nombre));
const CONSIGNAS = IDEAS_ANUALES.map((idea) => normalizar(idea.consigna));

if (new Set(NOMBRES).size !== NOMBRES.length) {
  throw new Error('El catálogo Emociones 365 contiene nombres duplicados.');
}
if (new Set(TITULOS).size !== TITULOS.length) {
  throw new Error('El catálogo Emociones 365 contiene títulos de actividad duplicados.');
}
if (new Set(CONSIGNAS).size !== CONSIGNAS.length) {
  throw new Error('El catálogo Emociones 365 contiene consignas duplicadas.');
}

const MECANICAS = IDEAS_ANUALES.map((idea, indice) => crearMecanica(idea, indice));

export function loteDeEmociones365(): Lote {
  return {
    migracion: '20261106140000_emociones365',
    titulo: 'Plan anual de Emociones',
    categoria: 'Emociones',
    mecanicas: MECANICAS,
  };
}

export const CABECERA_DE_EMOCIONES_365 = `-- Emociones 365 · 357 actividades únicas que completan las ocho fichas existentes.
--
-- Cada ficha tiene identificador, nombre y consigna propios. Se usan solo motores y vistas VSD existentes;
-- no se alteran tipografía, paleta, botones, animaciones ni estilos.
--
-- El contenido emocional queda SIN PUBLICAR y pendiente de revisión profesional. Esta migración solo carga
-- borradores: ninguna actividad se ofrece a las personas hasta completar y registrar esa revisión.
-- Las invitaciones son optativas, no puntúan, no diagnostican ni interpretan lo que siente la persona.
--`;
