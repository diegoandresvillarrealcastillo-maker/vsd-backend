import { Calendario, type Dia } from './Calendario.js';
import { NivelOrientativo } from './OrientativeScore.js';

/**
 * El patron de la semana (SCRUM-200).
 *
 * ## Por que existe
 *
 * Hasta aqui un solo resultado que "requiere atencion" bastaba para ensenar el texto de apoyo y
 * las lineas de atencion. Un dia flojo, o un juego que no salio, no es una semana dificil, y
 * decirle a alguien que "lo esta pasando mal" por una respuesta es leer de mas. Lo que se mira
 * ahora es **como le fue la semana**, no un resultado.
 *
 * ## La regla (decision de Samuel, 15/10/2026: "4 de 7")
 *
 * Hay patron cuando, en los **7 dias que terminan hoy**, al menos **4 dias distintos** tienen
 * un resultado que requiere atencion.
 *
 * - **Un dia es un dia**, haya tenido uno o cinco resultados. Si en un mismo dia hay uno bueno y
 *   uno que requiere atencion, el dia cuenta como dia con atencion: es lo que hoy dispara el
 *   apoyo, y lo contrario dejaria a quien tuvo un mal rato sin cobertura.
 * - **Solo cuenta lo que puntua.** Una actividad de registro no produce nivel: no suma a favor ni
 *   en contra.
 * - **Lo posterior a hoy se ignora**: un reloj adelantado no puede adelantar un patron.
 * - **El minimo de datos queda implicito**: con 4 dias con atencion hay, por fuerza, al menos 4
 *   dias registrados. Si algun dia el umbral baja de 3, habra que anadirlo aqui.
 *
 * ## Lo que esto NO toca
 *
 * El riesgo en lo escrito (una frase de la lista de riesgo) **no espera una semana**: sigue
 * mostrando las lineas en el momento (ADR 0011, 0027 y 0028). Esta regla es solo para el nivel
 * que se calcula a partir de un puntaje.
 *
 * Como la racha (ADR 0024), es **una funcion de los resultados**: no hay un contador que pueda
 * desincronizarse. Los dias llegan ya como dias del calendario local de la persona
 * (`resultado.dia`, SCRUM-123): aqui no hay zonas horarias ni relojes.
 */

/** Cuantos dias mira: los 7 que terminan hoy. */
export const DIAS_DE_LA_VENTANA = 7;

/** Cuantos dias distintos con atencion hacen un patron. */
export const DIAS_CON_ATENCION_PARA_UN_PATRON = 4;

/** Lo unico que importa de un resultado para esta regla. */
export interface ResultadoDeUnDia {
  readonly dia: Dia;
  /** Ausente en las actividades que no puntuan. */
  readonly nivel: NivelOrientativo | undefined;
}

/**
 * Si los resultados de la semana que termina en `hoy` son un patron.
 *
 * `resultados` pueden venir en cualquier orden y con dias repetidos o fuera de la ventana: lo que
 * no cae en los 7 dias que terminan hoy se ignora.
 */
export function hayPatronEnLaSemana(resultados: Iterable<ResultadoDeUnDia>, hoy: Dia): boolean {
  if (!Calendario.esDia(hoy)) {
    throw new RangeError(`"${hoy}" no es un dia con formato AAAA-MM-DD.`);
  }

  const diasConAtencion = new Set<Dia>();

  for (const { dia, nivel } of resultados) {
    const atras = Calendario.diasEntre(dia, hoy);

    // Fuera de la ventana: de hace 7 dias o mas, o posterior a hoy.
    if (atras < 0 || atras >= DIAS_DE_LA_VENTANA) {
      continue;
    }

    if (nivel === NivelOrientativo.REQUIERE_ATENCION) {
      diasConAtencion.add(dia);
    }
  }

  return diasConAtencion.size >= DIAS_CON_ATENCION_PARA_UN_PATRON;
}
