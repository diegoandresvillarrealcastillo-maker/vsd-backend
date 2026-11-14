import {
  DIAS_PARA_ACOMPANAR,
  DIAS_PARA_LAS_LINEAS,
  diasSeguidosConAtencion,
  NivelDeAcompanamiento,
} from './AcompanamientoPorRiesgo.js';
import { Calendario, type Dia } from './Calendario.js';

/**
 * El acompanamiento por abandono (SCRUM-256, ADR 0035).
 *
 * ## Por que existe
 *
 * El acompanamiento por dias seguidos (`AcompanamientoPorRiesgo`) se calla justo cuando la persona
 * deja de usar la aplicacion: un dia sin datos rompe la cadena. Diego lo dejo dicho al responder el
 * ADR 0034 (pregunta 2): quien esta peor puede irse, y eso es **una regla propia**, no un parche
 * sobre la de continuidad. Esta es esa regla.
 *
 * ## La regla (propuesta, la confirma Diego)
 *
 * Hay abandono cuando se cumplen las tres cosas a la vez:
 *
 * 1. **Lo ultimo que la persona registro requirio atencion**: su ultimo dia con actividad es un dia
 *    con atencion. Si despues de la mala racha hizo algo que no la requirio, no se fue mal.
 * 2. **Venia de al menos 3 dias seguidos asi** (`DIAS_PARA_ACOMPANAR`). Con 7 o mas
 *    (`DIAS_PARA_LAS_LINEAS`) el nivel es critico: las mismas varas que el acompanamiento por dias.
 * 3. **Lleva al menos 3 dias sin registrar nada** (hoy cuenta) y **no mas de 30**: pasado un mes ya
 *    no se le habla de «hace unos dias».
 *
 * En cuanto la persona registra cualquier cosa, su ultimo dia pasa a ser hoy y el aviso se va solo.
 *
 * Como la racha y el acompanamiento por dias, **es una funcion de los resultados**: no hay un
 * contador que pueda desincronizarse. Los dias llegan ya como dias del calendario local de la
 * persona (`resultado.dia`, SCRUM-123), y **no sale ningun puntaje ni cuantos dias fueron**.
 *
 * shortcut: «actividad» son solo los resultados; quien sigue escribiendo en el diario pero no
 * registra actividades cuenta como ausente. El diario no se lee para esto (privacidad); si Diego
 * quiere contarlo, hay que pasar los dias de sus entradas como un tercer parametro.
 */

/** Cuantos dias sin registrar nada (hoy incluido) hacen falta para hablar de abandono. */
export const DIAS_SIN_REGISTRAR_PARA_AVISAR = 3;

/** Cuantos dias sin registrar nada, como maximo, sigue valiendo el aviso. */
export const DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO = 30;

/**
 * Cuantos dias hacia atras, desde hoy, hay que leer de los dias con atencion para decidir el
 * acompanamiento (SCRUM-264). Mas atras no puede cambiar ningun resultado:
 *
 * - el nivel por dias cuenta hacia atras desde hoy (o ayer) y se detiene en 7 (`DIAS_PARA_LAS_LINEAS`);
 * - el abandono parte de su ultimo dia con actividad, que a lo mas esta 30 dias atras
 *   (`DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO`), y necesita la cadena de 7 que termina ahi.
 *
 * 30 + 7 = 37: el minimo exacto es 36 (la cadena de 7 que termina 30 dias atras empieza 36 atras) y
 * sobra uno. Si cambia alguna de las dos reglas, esto cambia con ellas.
 */
export const DIAS_QUE_MIRA_EL_ACOMPANAMIENTO =
  DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO + DIAS_PARA_LAS_LINEAS;

/**
 * El nivel de abandono de la persona hoy: `ninguno` si no hay, `moderado` si se fue tras 3 a 6 dias
 * con atencion, `critico` si fueron 7 o mas.
 *
 * Los dos conjuntos pueden venir en cualquier orden y con dias repetidos o posteriores a hoy.
 */
export function abandonoTrasAtencion(
  diasConAtencion: Iterable<Dia>,
  diasConActividad: Iterable<Dia>,
  hoy: Dia,
): NivelDeAcompanamiento {
  if (!Calendario.esDia(hoy)) {
    throw new RangeError(`"${hoy}" no es un dia con formato AAAA-MM-DD.`);
  }

  // Lo posterior a hoy se ignora: un reloj adelantado no puede inventar ni apagar un aviso.
  let ultimo: Dia | null = null;

  for (const dia of diasConActividad) {
    if (Calendario.diasEntre(dia, hoy) >= 0 && (ultimo === null || dia > ultimo)) {
      ultimo = dia;
    }
  }

  if (ultimo === null) {
    return NivelDeAcompanamiento.NINGUNO;
  }

  const sinRegistrar = Calendario.diasEntre(ultimo, hoy);

  if (
    sinRegistrar < DIAS_SIN_REGISTRAR_PARA_AVISAR ||
    sinRegistrar > DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO
  ) {
    return NivelDeAcompanamiento.NINGUNO;
  }

  const conAtencion = new Set(diasConAtencion);

  // Lo ultimo que registro tiene que haber requerido atencion: si no, no se fue mal.
  if (!conAtencion.has(ultimo)) {
    return NivelDeAcompanamiento.NINGUNO;
  }

  // La cadena que termina exactamente ese dia (con `ultimo` dentro, cuenta desde el mismo dia).
  const previos = diasSeguidosConAtencion(conAtencion, ultimo);

  if (previos >= DIAS_PARA_LAS_LINEAS) {
    return NivelDeAcompanamiento.CRITICO;
  }

  return previos >= DIAS_PARA_ACOMPANAR
    ? NivelDeAcompanamiento.MODERADO
    : NivelDeAcompanamiento.NINGUNO;
}
