import { UserId } from '../../domain/model/Identifier.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import { hayRiesgo, normalizar } from '../../domain/model/SenalesDeRiesgo.js';
import {
  type AsistentePort,
  type ConsultaAlAsistente,
  Intencion,
  type RespuestaDelAsistente,
} from '../../domain/ports/in/AsistentePort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';

/** Cuantos dias hacia atras se mira para personalizar. */
const DIAS_DE_HISTORIAL = 30;

/**
 * Como se reconoce cada intencion.
 *
 * Palabras sueltas y no frases completas: la gente escribe "no duermo", "duermo
 * mal", "por que no puedo dormir". Buscar una frase exacta habria fallado con
 * todas menos una.
 *
 * El orden de la lista es el orden en que se evalua, y la primera que coincide
 * gana. Por eso lo mas especifico va antes que lo mas general.
 */
const REGLAS: readonly {
  readonly intencion: Intencion;
  readonly tema: string;
  readonly palabras: readonly string[];
}[] = [
  {
    intencion: Intencion.DONDE_BUSCO_AYUDA,
    tema: 'ayuda',
    palabras: ['ayuda', 'psicolog', 'profesional', 'terapia', 'con quien hablo', 'donde acudo'],
  },
  {
    intencion: Intencion.COMO_DUERMO_MEJOR,
    tema: 'sueno',
    palabras: ['dormir', 'duermo', 'sueno', 'descansar', 'descanso', 'insomnio', 'trasnoch'],
  },
  {
    intencion: Intencion.QUE_SIGNIFICA_MI_RESULTADO,
    tema: 'resultado',
    palabras: ['resultado', 'nivel', 'puntaje', 'significa', 'que saque', 'como me fue'],
  },
  {
    intencion: Intencion.ME_SIENTO_MAL,
    tema: 'animo',
    palabras: ['me siento', 'triste', 'mal', 'animo', 'llorar', 'vacio', 'solo', 'sola', 'cansad'],
  },
];

/**
 * Mensajes del asistente.
 *
 * Cortos a proposito. Un parrafo largo en pantalla no lo lee nadie, y menos
 * alguien que esta pasando un mal rato.
 *
 * Ninguno nombra una condicion ni sugiere un diagnostico. VSD Health no
 * diagnostica, y hay una prueba que falla si estos textos empiezan a hacerlo.
 */
const MENSAJES: Record<Intencion, string> = {
  [Intencion.QUE_SIGNIFICA_MI_RESULTADO]:
    'Tu nivel resume como te fue en esa actividad, ese dia. No dice nada sobre ti como persona.',
  [Intencion.COMO_DUERMO_MEJOR]:
    'Descansar mejor casi siempre empieza por la rutina, no por la fuerza de voluntad.',
  [Intencion.ME_SIENTO_MAL]:
    'Gracias por escribirlo. Sentirte asi no necesita justificacion, y no tienes que resolverlo hoy.',
  [Intencion.DONDE_BUSCO_AYUDA]:
    'Pedir ayuda es una buena decision. Estos son lugares donde te van a escuchar.',
  [Intencion.NO_RECONOCIDA]:
    'No estoy seguro de haberte entendido, pero esto suele servir. Si quieres, escribelo de otra forma.',
};

/**
 * El mensaje cuando se detecta una senal de riesgo.
 *
 * No pregunta, no matiza y no intenta interpretar. Dice lo unico que hace
 * falta decir y pone los telefonos delante.
 */
const MENSAJE_DE_RIESGO =
  'Lo que escribiste es importante y no deberias cargarlo en solitario. ' +
  'Estas lineas atienden ahora mismo y son gratuitas.';

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

    const regla = this.reconocer(consulta.texto);
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

  private reconocer(texto: string): (typeof REGLAS)[number] | undefined {
    const limpio = normalizar(texto);

    return REGLAS.find((regla) => regla.palabras.some((palabra) => limpio.includes(palabra)));
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

    return `${mensaje} En el ultimo mes registraste ${veces}.`;
  }
}
