import { UserId } from '../../domain/model/Identifier.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import { hayRiesgo } from '../../domain/model/SenalesDeRiesgo.js';
import {
  type AsistentePort,
  type ConsultaAlAsistente,
  Intencion,
  type RespuestaDelAsistente,
} from '../../domain/ports/in/AsistentePort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { contieneAlguno, palabrasDe, reconocerCharla } from './Reconocimiento.js';

/** Cuantos dias hacia atras se mira para personalizar. */
const DIAS_DE_HISTORIAL = 30;

/**
 * Como se reconoce cada intencion.
 *
 * Palabras completas y no pedazos de texto (SCRUM-128): "mal" ya no se lee
 * dentro de "normal". Un patron son una o varias palabras seguidas ("con quien
 * hablo"), y uno que termina en `*` es una raiz que admite terminaciones
 * ("psicolog*": psicologo, psicologa, psicologia). La gente escribe "no
 * duermo", "duermo mal", "por que no puedo dormir": buscar una frase exacta
 * habria fallado con todas menos una.
 *
 * El orden de la lista es el orden en que se evalua, y la primera que coincide
 * gana. Por eso lo mas especifico va antes que lo mas general.
 */
const REGLAS: readonly {
  readonly intencion: Intencion;
  readonly tema: string;
  readonly patrones: readonly string[];
}[] = [
  {
    // Este tema no tiene lecturas propias, y es deliberado: a quien pregunta
    // donde buscar ayuda se le responde con telefonos, no con un articulo.
    // Al no encontrar nada, cae a las lineas de atencion, que es justo lo que
    // corresponde.
    intencion: Intencion.DONDE_BUSCO_AYUDA,
    tema: 'ayuda',
    patrones: ['ayud*', 'psicolog*', 'profesional*', 'terapia*', 'con quien hablo', 'donde acudo'],
  },
  {
    intencion: Intencion.COMO_DUERMO_MEJOR,
    tema: 'sueno',
    patrones: ['dormir*', 'duerm*', 'sueno', 'descans*', 'insomnio', 'trasnoch*'],
  },
  {
    intencion: Intencion.QUE_SIGNIFICA_MI_RESULTADO,
    tema: 'resultado',
    patrones: ['resultado*', 'nivel*', 'puntaje*', 'signific*', 'que saque', 'como me fue'],
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
  },
];

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
const REGLAS_DE_CHARLA: readonly {
  readonly intencion: Intencion;
  readonly patrones: readonly string[];
}[] = [
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
  },
];

/**
 * Las palabras que pueden acompanar a la charla sin dejar de serlo: "muchas
 * gracias", "hola de nuevo", "solo queria saludar".
 *
 * Es corta a proposito. Cada palabra que se anade aqui es una que puede ir
 * pegada a una frase seria sin que el asistente lo note.
 */
const RELLENO_DE_LA_CHARLA: readonly string[] = [
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
const MENSAJES: Record<Intencion, string> = {
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

/** La despedida de "buenas noches": sirve igual a quien lo escribe al llegar. */
const MENSAJE_DE_LAS_NOCHES =
  '¡Buenas noches! Aquí estoy si quieres preguntarme algo. Y si ya vas a descansar, que sea una noche tranquila.';

/**
 * El mensaje cuando se detecta una senal de riesgo.
 *
 * No pregunta, no matiza y no intenta interpretar. Dice lo unico que hace
 * falta decir y pone los telefonos delante.
 */
const MENSAJE_DE_RIESGO =
  'Lo que escribiste es importante y no deberías cargarlo en solitario. ' +
  'Estas líneas atienden ahora mismo y son gratuitas.';

/** Las palabras de relleno, mas las del nombre que la persona le puso a su mascota. */
function relleno(nombreDeLaMascota: string | undefined): ReadonlySet<string> {
  return new Set([...RELLENO_DE_LA_CHARLA, ...palabrasDe(nombreDeLaMascota ?? '')]);
}

function mensajeDeLaCharla(intencion: Intencion, palabras: readonly string[]): string {
  return intencion === Intencion.DESPEDIDA && contieneAlguno(palabras, ['buenas noches'])
    ? MENSAJE_DE_LAS_NOCHES
    : MENSAJES[intencion];
}

/**
 * VSD IA en su primera version: un asistente por reglas.
 *
 * Sin modelo de lenguaje, sin costo y sin llamadas a ninguna API. Lo que
 * responde sale de dos sitios: una tabla de reglas que se puede leer entera en
 * esta pantalla, y los recursos de la base de datos.
 *
 * ## Lo que se gana escribiendolo asi
 *
 * Se puede explicar. Ante cualquier respuesta se puede senalar la regla exacta
 * que la produjo, y eso en una herramienta de bienestar no es un lujo: es lo
 * que permite que alguien revise lo que la aplicacion le dice a la gente antes
 * de que se lo diga.
 *
 * Tambien funciona sin conexion, que es el RF9. Las reglas y los recursos
 * caben en el dispositivo; una llamada a una API, no.
 *
 * ## El orden de las cosas
 *
 * La deteccion de riesgo va **primero y aparte**. No compite con las demas
 * reglas, no depende de que se reconozca la intencion y no se puede desactivar
 * desde la configuracion. Cuando en la Fase 2 exista un adaptador con modelo,
 * seguira ejecutandose antes que el.
 */
export class AsistentePorReglas implements AsistentePort {
  constructor(
    private readonly recursos: RecursoApoyoRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async responder(consulta: ConsultaAlAsistente): Promise<RespuestaDelAsistente> {
    // Primero lo que no se negocia. Si hay una senal de riesgo, la respuesta
    // ya esta decidida: no se mira la intencion, no se personaliza, no se
    // intenta ser ingenioso.
    if (hayRiesgo(consulta.texto)) {
      const lineas = await this.recursos.lineasDeAtencion();

      return {
        intencion: Intencion.ME_SIENTO_MAL,
        mensaje: MENSAJE_DE_RIESGO,
        recursos: RecursoApoyo.ordenarPorAlcance(lineas),
        senalDeRiesgo: true,
        incluyeLineasDeAtencion: true,
      };
    }

    // Despues, la charla de todos los dias, que solo cuenta si el mensaje entero
    // es charla. No lleva recursos ni lineas: quien dice "gracias" no necesita
    // un telefono, y ensenarlo en cada saludo lo convertiria en decorado.
    const palabras = palabrasDe(consulta.texto);
    const charla = reconocerCharla(palabras, REGLAS_DE_CHARLA, relleno(consulta.nombreDeLaMascota));

    if (charla !== undefined) {
      return {
        intencion: charla.intencion,
        mensaje: mensajeDeLaCharla(charla.intencion, palabras),
        recursos: [],
        senalDeRiesgo: false,
        incluyeLineasDeAtencion: false,
      };
    }

    const regla = this.reconocer(palabras);
    const intencion = regla?.intencion ?? Intencion.NO_RECONOCIDA;
    const encontrados = regla === undefined ? [] : await this.recursos.porTema(regla.tema);

    // Una intencion que no se reconoce no devuelve un error ni una disculpa
    // vacia: devuelve las lineas de atencion, que es lo que sirve siempre.
    const acompanamiento =
      encontrados.length > 0 ? encontrados : await this.recursos.lineasDeAtencion();

    return {
      intencion,
      mensaje: await this.personalizar(MENSAJES[intencion], consulta.userId),
      recursos: RecursoApoyo.ordenarPorAlcance(acompanamiento),
      senalDeRiesgo: false,
      incluyeLineasDeAtencion: acompanamiento.some((recurso) => recurso.esLineaDeAtencion()),
    };
  }

  private reconocer(palabras: readonly string[]): (typeof REGLAS)[number] | undefined {
    return REGLAS.find((regla) => contieneAlguno(palabras, regla.patrones));
  }

  /**
   * Anade una linea sobre lo que la persona ha hecho, si la ha hecho.
   *
   * Sale de contar filas suyas. Por eso es cierto, y por eso a veces no se
   * anade nada: quien no ha registrado actividades no recibe una frase
   * inventada sobre su constancia.
   */
  private async personalizar(mensaje: string, userId: string): Promise<string> {
    const desde = new Date(this.reloj().getTime() - DIAS_DE_HISTORIAL * 24 * 60 * 60 * 1000);
    const recientes = await this.resultados.ultimosDe(new UserId(userId), desde);

    if (recientes.length === 0) {
      return mensaje;
    }

    const veces = recientes.length === 1 ? 'una actividad' : `${recientes.length} actividades`;

    return `${mensaje} En el último mes registraste ${veces}.`;
  }
}
