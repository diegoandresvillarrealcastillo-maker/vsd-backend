import { DireccionEscala } from './Activity.js';
import { Calendario, type Dia } from './Calendario.js';
import type { Categoria } from './Categoria.js';
import type { ActivityId } from './Identifier.js';

/**
 * El acompanamiento por dias seguidos con atencion (SCRUM-177).
 *
 * ## Por que existe
 *
 * El patron de la semana (SCRUM-200) decide si el **resultado** de una actividad lleva texto de
 * apoyo. Esto es otra cosa: si lo que viene pasando, **dia tras dia**, merece que la aplicacion
 * se lo ofrezca a la persona de forma continua, mas alla de una actividad.
 *
 * ## La regla (propuesta, la confirma Diego: ADR 0034)
 *
 * Se cuentan los **dias seguidos** en que hubo al menos un resultado que requiere atencion:
 *
 * - **3 dias seguidos: moderado.** Un aviso discreto, que se puede cerrar.
 * - **7 dias seguidos: critico.** Un aviso que se queda a la vista, con las lineas de atencion.
 *
 * Detalles que importan:
 *
 * - **Un dia es un dia**, tenga uno o cinco resultados. Si en el mismo dia hay uno bueno y uno
 *   que requiere atencion, cuenta como dia con atencion (igual que en `PatronDeLaSemana`).
 * - **Un dia sin atencion rompe la cadena**, tambien un dia sin ningun dato. Es la lectura
 *   estricta de «seguidos»: pide mas para avisar, y por eso es la que se propone para empezar.
 * - **Hoy no rompe nada hasta que termina**, como en la racha: si todavia no hay nada hoy, la
 *   cadena de ayer sigue en pie. La cadena mas reciente es la que vale; una anterior, rota, no.
 * - **Lo posterior a hoy se ignora**: un reloj adelantado no puede adelantar un aviso.
 *
 * Como la racha (ADR 0024) y el patron (ADR 0029), **es una funcion de los resultados**: no hay un
 * contador que pueda desincronizarse. Los dias llegan ya como dias del calendario local de la
 * persona (`resultado.dia`, SCRUM-123): aqui no hay zonas horarias ni relojes. **No sale ningun
 * puntaje**: lo unico que se dice es el nivel.
 */

/** Cuantos dias seguidos con atencion ofrecen acompanamiento. */
export const DIAS_PARA_ACOMPANAR = 3;

/** Cuantos dias seguidos con atencion dejan las lineas de atencion a la vista. */
export const DIAS_PARA_LAS_LINEAS = 7;

export const NivelDeAcompanamiento = {
  NINGUNO: 'ninguno',
  MODERADO: 'moderado',
  CRITICO: 'critico',
} as const;

export type NivelDeAcompanamiento =
  (typeof NivelDeAcompanamiento)[keyof typeof NivelDeAcompanamiento];

/**
 * Las actividades cuyo resultado puede encender el acompanamiento: las de escala «mayor requiere
 * atencion» (carga y emociones). Un puntaje bajo en un juego de cognicion no dice nada de como se
 * siente la persona, y contarlo daria falsas alarmas (ADR 0034, pregunta 1).
 */
export function actividadesQueCuentanParaAcompanar(
  catalogo: readonly Categoria[],
): readonly ActivityId[] {
  return catalogo
    .flatMap((categoria) => categoria.actividades)
    .filter((actividad) => actividad.direccionEscala === DireccionEscala.MAYOR_REQUIERE_ATENCION)
    .map((actividad) => actividad.id);
}

/**
 * Cuantos dias seguidos con atencion lleva la persona, contando hacia atras desde hoy (o desde
 * ayer, si hoy todavia no tiene nada).
 *
 * `diasConAtencion` puede venir en cualquier orden y con dias repetidos o posteriores a hoy.
 */
export function diasSeguidosConAtencion(diasConAtencion: Iterable<Dia>, hoy: Dia): number {
  if (!Calendario.esDia(hoy)) {
    throw new RangeError(`"${hoy}" no es un dia con formato AAAA-MM-DD.`);
  }

  // Cuantos dias atras esta cada dia con atencion. Lo posterior a hoy (negativo) no cuenta.
  const atras = new Set<number>();

  for (const dia of diasConAtencion) {
    const cuantos = Calendario.diasEntre(dia, hoy);

    if (cuantos >= 0) {
      atras.add(cuantos);
    }
  }

  // Hoy todavia no termino: sin atencion hoy, la cadena se mira desde ayer.
  let posicion = atras.has(0) ? 0 : 1;
  let seguidos = 0;

  while (atras.has(posicion)) {
    seguidos += 1;
    posicion += 1;
  }

  return seguidos;
}

/** El nivel que corresponde a los dias seguidos con atencion que terminan hoy. */
export function nivelDeAcompanamiento(
  diasConAtencion: Iterable<Dia>,
  hoy: Dia,
): NivelDeAcompanamiento {
  const seguidos = diasSeguidosConAtencion(diasConAtencion, hoy);

  if (seguidos >= DIAS_PARA_LAS_LINEAS) {
    return NivelDeAcompanamiento.CRITICO;
  }

  return seguidos >= DIAS_PARA_ACOMPANAR
    ? NivelDeAcompanamiento.MODERADO
    : NivelDeAcompanamiento.NINGUNO;
}
