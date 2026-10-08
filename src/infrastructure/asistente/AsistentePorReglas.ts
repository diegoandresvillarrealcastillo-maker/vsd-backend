import { UserId } from '../../domain/model/Identifier.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import { paisDeLaZona } from '../../domain/model/PaisDeAyuda.js';
import {
  MENSAJES,
  MENSAJE_DE_RIESGO,
  REGLAS_DE_CHARLA,
  REGLAS_DE_INTENCION,
  RELLENO_DE_LA_CHARLA,
  type ReglaDeCharla,
} from '../../domain/model/ReglasDelAsistente.js';
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

/** Las palabras de relleno, mas las del nombre que la persona le puso a su mascota. */
function relleno(nombreDeLaMascota: string | undefined): ReadonlySet<string> {
  return new Set([...RELLENO_DE_LA_CHARLA, ...palabrasDe(nombreDeLaMascota ?? '')]);
}

/**
 * Lo que se responde a una charla: la variante que el mensaje pida (por ejemplo,
 * "buenas noches" dentro de una despedida) o, si no, el mensaje de la intencion.
 */
function mensajeDeLaCharla(regla: ReglaDeCharla, palabras: readonly string[]): string {
  const variante = regla.variantes?.find((una) => contieneAlguno(palabras, una.patrones));

  return variante?.mensaje ?? MENSAJES[regla.intencion];
}

/**
 * VSD IA en su primera version: un asistente por reglas.
 *
 * Sin modelo de lenguaje, sin costo y sin llamadas a ninguna API. Lo que
 * responde sale de dos sitios: una tabla de reglas que se puede leer entera
 * (`ReglasDelAsistente.ts`), y los recursos de la base de datos.
 *
 * ## Lo que se gana escribiendolo asi
 *
 * Se puede explicar. Ante cualquier respuesta se puede senalar la regla exacta
 * que la produjo, y eso en una herramienta de bienestar no es un lujo: es lo
 * que permite que alguien revise lo que la aplicacion le dice a la gente antes
 * de que se lo diga.
 *
 * Tambien funciona sin conexion, que es el RF9. Las reglas y los recursos
 * caben en el dispositivo; una llamada a una API, no. Desde SCRUM-141 el servidor
 * **publica esos mismos datos** (`GET /api/asistente/reglas-locales`) y la
 * aplicacion los aplica sin conexion; este adaptador y esa ruta leen el mismo
 * archivo de reglas, y una prueba falla si dejan de decir lo mismo.
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
    const pais = paisDeLaZona(consulta.zonaHoraria);

    if (hayRiesgo(consulta.texto)) {
      const lineas = await this.recursos.lineasDeAtencion(pais);

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
        mensaje: mensajeDeLaCharla(charla, palabras),
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
      encontrados.length > 0 ? encontrados : await this.recursos.lineasDeAtencion(pais);

    return {
      intencion,
      mensaje: await this.personalizar(MENSAJES[intencion], consulta.userId),
      recursos: RecursoApoyo.ordenarPorAlcance(acompanamiento),
      senalDeRiesgo: false,
      incluyeLineasDeAtencion: acompanamiento.some((recurso) => recurso.esLineaDeAtencion()),
    };
  }

  private reconocer(palabras: readonly string[]): (typeof REGLAS_DE_INTENCION)[number] | undefined {
    return REGLAS_DE_INTENCION.find((regla) => contieneAlguno(palabras, regla.patrones));
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
