import { Intencion } from '../ports/in/AsistentePort.js';

/**
 * Las reglas de VSD IA y sus textos, en un solo sitio (SCRUM-128, SCRUM-141).
 *
 * ## Por que estan en el dominio
 *
 * Hasta SCRUM-141 vivian dentro del adaptador de reglas, y eso estaba bien
 * mientras solo el servidor las leia. Ahora el servidor **las publica** para que
 * la aplicacion responda sin conexion (`GET /api/asistente/reglas-locales`), y
 * lo que se publica y lo que se aplica tienen que ser **el mismo dato**, no dos
 * listas que alguien tiene que acordarse de mantener juntas. Por eso estan aqui:
 * el adaptador de reglas y el caso de uso que las publica las importan de este
 * archivo, y no hay otra copia en ninguna parte.
 *
 * ## Lo que se puede responder sin conexion
 *
 * La decision del equipo (SCRUM-141) es un asistente mixto: sin conexion
 * responde un saludo, un agradecimiento, una despedida y las lineas de
 * atencion, y **todo lo demas exige conexion**. Cada regla lo dice con
 * `sinConexion`. Una regla que no lo dice no se responde sin red: el cliente no
 * inventa nada, avisa que lo respondera cuando haya conexion.
 *
 * La lista completa se publica en orden, tambien lo que no se puede responder
 * sin red: asi "hola, como estas" sigue siendo una pregunta por el asistente y
 * no un saludo, que es lo que decide el orden.
 */

/**
 * Una regla de las que buscan una palabra o una frase dentro del mensaje.
 *
 * Palabras completas y no pedazos de texto (SCRUM-128): "mal" ya no se lee
 * dentro de "normal". Un patron son una o varias palabras seguidas ("con quien
 * hablo"), y uno que termina en `*` es una raiz que admite terminaciones
 * ("psicolog*": psicologo, psicologa, psicologia). La gente escribe "no
 * duermo", "duermo mal", "por que no puedo dormir": buscar una frase exacta
 * habria fallado con todas menos una.
 */
export interface ReglaDeIntencion {
  readonly intencion: Intencion;
  readonly tema: string;
  readonly patrones: readonly string[];
  /**
   * Cierto si se puede responder sin conexion. Solo lo que no necesita nada del
   * servidor: ni el historial de la persona ni una lectura de la base.
   */
  readonly sinConexion: boolean;
}

/**
 * Como se reconoce cada intencion.
 *
 * El orden de la lista es el orden en que se evalua, y la primera que coincide
 * gana. Por eso lo mas especifico va antes que lo mas general.
 */
export const REGLAS_DE_INTENCION: readonly ReglaDeIntencion[] = [
  {
    // Este tema no tiene lecturas propias, y es deliberado: a quien pregunta
    // donde buscar ayuda se le responde con telefonos, no con un articulo.
    // Al no encontrar nada, cae a las lineas de atencion, que es justo lo que
    // corresponde. Por eso se puede responder sin conexion: los telefonos van
    // en el dispositivo.
    intencion: Intencion.DONDE_BUSCO_AYUDA,
    tema: 'ayuda',
    patrones: ['ayud*', 'psicolog*', 'profesional*', 'terapia*', 'con quien hablo', 'donde acudo'],
    sinConexion: true,
  },
  {
    intencion: Intencion.COMO_DUERMO_MEJOR,
    tema: 'sueno',
    patrones: ['dormir*', 'duerm*', 'sueno', 'descans*', 'insomnio', 'trasnoch*'],
    sinConexion: false,
  },
  {
    intencion: Intencion.QUE_SIGNIFICA_MI_RESULTADO,
    tema: 'resultado',
    patrones: ['resultado*', 'nivel*', 'puntaje*', 'signific*', 'que saque', 'como me fue'],
    sinConexion: false,
  },
  {
    intencion: Intencion.ME_SIENTO_MAL,
    tema: 'animo',
    patrones: [
      'me siento',
      'triste*',
      'mal',
      'mala',
      'malo',
      'animo*',
      'desanim*',
      'llorar*',
      'vacio*',
      'cansad*',
      // "solo" y "sola" ya no valen sueltas: "solo queria saludar" no habla de
      // soledad. Se reconocen cuando dicen como esta la persona.
      'estoy solo',
      'estoy sola',
      'muy solo',
      'muy sola',
      'siempre solo',
      'siempre sola',
    ],
    sinConexion: false,
  },
];

/** Otra respuesta para la misma intencion, segun lo que diga el mensaje. */
export interface VarianteDeLaCharla {
  readonly patrones: readonly string[];
  readonly mensaje: string;
}

/** Una regla de charla de todos los dias. */
export interface ReglaDeCharla {
  readonly intencion: Intencion;
  readonly patrones: readonly string[];
  /** Cierto si se responde igual sin conexion. */
  readonly sinConexion: boolean;
  /**
   * Lo que se dice sin conexion cuando no es lo mismo que con ella. Un saludo
   * con conexion invita a preguntar por el descanso o por un resultado, y sin
   * conexion eso no se puede responder: prometerlo seria enganar.
   */
  readonly mensajeSinConexion?: string;
  /**
   * Respuestas distintas segun el mensaje. La primera cuyo patron aparezca
   * gana; si ninguna, vale el mensaje de la intencion.
   */
  readonly variantes?: readonly VarianteDeLaCharla[];
}

/**
 * La charla de todos los dias (SCRUM-128), de lo mas especifico a lo mas
 * general: gana la primera que aparece en el mensaje.
 *
 * Solo cuenta cuando **el mensaje entero** es charla (ver `reconocerCharla`).
 * Por eso aqui no hay nada que pueda esconder una frase seria: "adios a todo"
 * o "gracias por todo" no son charla, porque "todo" no esta en ninguna lista.
 *
 * "Buenas noches" va en la despedida y no en el saludo: es lo que mas se
 * escribe al cerrar el dia. Su respuesta sirve tambien a quien lo escribe al
 * llegar.
 */
export const REGLAS_DE_CHARLA: readonly ReglaDeCharla[] = [
  {
    intencion: Intencion.QUE_PUEDES_HACER,
    patrones: [
      'que puedes hacer',
      'que sabes hacer',
      'que sabes',
      'que haces',
      'para que sirves',
      'quien eres',
      'que eres',
      'como te llamas',
      'como funcionas',
      'que es vsd ia',
      'en que me puedes ayudar',
      'en que puedes ayudarme',
      'en que me ayudas',
      'como me puedes ayudar',
      'que puedo preguntarte',
      'que puedo preguntar',
    ],
    sinConexion: false,
  },
  {
    intencion: Intencion.COMO_ESTAS,
    patrones: [
      'como estas',
      'como te va',
      'como vas',
      'como andas',
      'como te encuentras',
      'como te sientes',
      'como amaneciste',
      'que tal',
    ],
    sinConexion: false,
  },
  {
    intencion: Intencion.DESPEDIDA,
    patrones: [
      'adios',
      'chao',
      'chau',
      'bye',
      'hasta luego',
      'hasta manana',
      'hasta pronto',
      'hasta la proxima',
      'nos vemos',
      'nos hablamos',
      'me despido',
      'cuidate',
      'buenas noches',
      'que descanses',
      'que duermas bien',
      'me voy a dormir',
      'voy a dormir',
    ],
    sinConexion: true,
    variantes: [
      {
        patrones: ['buenas noches'],
        mensaje:
          '¡Buenas noches! Aquí estoy si quieres preguntarme algo. Y si ya vas a descansar, que sea una noche tranquila.',
      },
    ],
  },
  {
    intencion: Intencion.AGRADECIMIENTO,
    patrones: [
      'gracias*',
      'agradezco',
      'agradecid*',
      'muy amable',
      'thanks',
      'thx',
      'dar las gracias',
      'darte las gracias',
    ],
    sinConexion: true,
  },
  {
    intencion: Intencion.SALUDO,
    patrones: [
      'hola',
      'holi',
      'holis',
      'hey',
      'ey',
      'hello',
      'hi',
      'buenas',
      'buenos dias',
      'buen dia',
      'buenas tardes',
      'saludo*',
      'saludar*',
    ],
    sinConexion: true,
    mensajeSinConexion:
      '¡Hola! Qué bueno tenerte por aquí. Sin conexión puedo saludarte y decirte dónde buscar ayuda; lo demás te lo respondo cuando vuelvas a tener conexión.',
  },
];

/**
 * Las palabras que pueden acompanar a la charla sin dejar de serlo: "muchas
 * gracias", "hola de nuevo", "solo queria saludar".
 *
 * Es corta a proposito. Cada palabra que se anade aqui es una que puede ir
 * pegada a una frase seria sin que el asistente lo note.
 */
export const RELLENO_DE_LA_CHARLA: readonly string[] = [
  'vsd',
  'ia',
  'mil',
  'muy',
  'muchas',
  'mucho',
  'tambien',
  'igualmente',
  'amigo',
  'amiga',
  'por',
  'favor',
  'hoy',
  'otra',
  'vez',
  'de',
  'nuevo',
  'ok',
  'okay',
  'vale',
  'listo',
  'perfecto',
  'genial',
  'super',
  'excelente',
  'bueno',
  'entendido',
  'claro',
  'solo',
  'queria',
  'pasaba',
  'a',
  'te',
  'lo',
  'un',
  'ahi',
];

/**
 * Mensajes del asistente.
 *
 * Cortos a proposito. Un parrafo largo en pantalla no lo lee nadie, y menos
 * alguien que esta pasando un mal rato.
 *
 * Ninguno nombra una condicion ni sugiere un diagnostico. VSD Health no
 * diagnostica, y hay una prueba que falla si estos textos empiezan a hacerlo.
 *
 * Los de la charla no preguntan nada: el asistente no sabe contestar un "bien"
 * o un "mas o menos", y una pregunta abierta sin respuesta posible es peor que
 * no preguntar. Tampoco llevan el historial de la persona, ni lineas de atencion.
 */
export const MENSAJES: Readonly<Record<Intencion, string>> = {
  [Intencion.QUE_SIGNIFICA_MI_RESULTADO]:
    'Tu nivel resume cómo te fue en esa actividad, ese día. No dice nada sobre ti como persona.',
  [Intencion.COMO_DUERMO_MEJOR]:
    'Descansar mejor casi siempre empieza por la rutina, no por la fuerza de voluntad.',
  [Intencion.ME_SIENTO_MAL]:
    'Gracias por escribirlo. Sentirte así no necesita justificación, y no tienes que resolverlo hoy.',
  [Intencion.DONDE_BUSCO_AYUDA]:
    'Pedir ayuda es una buena decisión. Estos son lugares donde te van a escuchar.',
  [Intencion.SALUDO]:
    '¡Hola! Qué bueno tenerte por aquí. Puedes preguntarme por tu descanso, por lo que significa un resultado o por dónde buscar ayuda.',
  [Intencion.AGRADECIMIENTO]: '¡Con gusto! Si te surge otra duda, aquí estoy.',
  [Intencion.DESPEDIDA]: 'Hasta pronto. Aquí estaré cuando quieras volver.',
  [Intencion.COMO_ESTAS]:
    'Gracias por preguntar. Por aquí todo en orden, listo para acompañarte. Si quieres contarme cómo vas tú, te leo.',
  [Intencion.QUE_PUEDES_HACER]:
    'Soy VSD IA. Te puedo explicar qué significa tu nivel en una actividad, darte ideas para descansar mejor y decirte dónde buscar ayuda cuando la necesites. No reemplazo a un profesional: si quieres hablar con alguien, te digo con quién.',
  [Intencion.NO_RECONOCIDA]:
    'No estoy seguro de haberte entendido, pero esto suele servir. Si quieres, escríbelo de otra forma.',
};

/**
 * El mensaje cuando se detecta una senal de riesgo.
 *
 * No pregunta, no matiza y no intenta interpretar. Dice lo unico que hace
 * falta decir y pone los telefonos delante. Es el mismo con conexion y sin ella.
 */
export const MENSAJE_DE_RIESGO =
  'Lo que escribiste es importante y no deberías cargarlo en solitario. ' +
  'Estas líneas atienden ahora mismo y son gratuitas.';
