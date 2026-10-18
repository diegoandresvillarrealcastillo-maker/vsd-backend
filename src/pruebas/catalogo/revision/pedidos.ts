/**
 * Lo que cada ficha del catalogo pide de su revision (SCRUM-228), tomado de las fichas
 * (`CATALOGO-FICHAS-DE-MECANICAS.md`: «Revisión profesional» y «Barandas»).
 *
 * Una **revision profesional** la hace quien tenga la formacion que la ficha nombra (psicologia, fisioterapia,
 * afirmaciones de salud); una **ligera**, alguien que lea con criterio de inclusion, redaccion y seguridad. Quien
 * revisa se identifica en la hoja (nombre o rol, sin datos de contacto) y eso es lo que queda en la base:
 * **nunca se publica una revision que nadie hizo** (CHECK `sesion_de_actividad_publicada_revisada`).
 *
 * El `foco` es lo que la ficha pide mirar con mas cuidado. No reemplaza leer cada sesion.
 */

export type TipoDeRevision = 'profesional' | 'ligera';

export interface PedidoDeRevision {
  readonly revision: TipoDeRevision;
  /** Quien puede hacerla, segun la ficha. */
  readonly quien: string;
  /** A que prestar atencion: las barandas de la ficha. */
  readonly foco: string;
}

export const PEDIDOS_DE_REVISION: Readonly<Record<string, PedidoDeRevision>> = {
  'COG-08': {
    revision: 'ligera',
    quien: 'Revisión ligera: que no se confunda con una prueba',
    foco: 'No se cronometra y no se presenta como evaluación cognitiva (R13); el tamaño de los puntos cumple R10.',
  },
  'BIE-01': {
    revision: 'profesional',
    quien: 'Profesional de la salud (revisión corta)',
    foco: 'Los patrones y la advertencia: ninguna retención de más de 4 s, nada de ritmos rápidos ni de respiración forzada; «si te mareas o te incomoda, suelta el patrón» antes de empezar; no se presenta como tratamiento.',
  },
  'BIE-02': {
    revision: 'profesional',
    quien: 'Profesional del movimiento o fisioterapia',
    foco: '«Hazlo sin dolor; si algo duele, para»; ninguna intensidad por encima de un estiramiento suave; nada de rotaciones bruscas de cuello; no sustituye atención médica ni fisioterapia; opción sentada para todas.',
  },
  'BIE-03': {
    revision: 'profesional',
    quien: 'Profesional de la salud (afirmaciones de salud)',
    foco: 'Ninguna práctica sustituye consulta si el sueño es un problema persistente; sin alcohol como «ayuda para dormir»; sin suplementos ni medicamentos.',
  },
  'BIE-04': {
    revision: 'profesional',
    quien: 'Profesional de la salud (tono), aun con el reemplazo de «Agua y comida»',
    foco: 'Nada de «dieta», «peso», «cuerpo ideal» ni comida «buena/mala»; ningún acto relacionado con restricción o compensación (R13).',
  },
  'BIE-05': {
    revision: 'ligera',
    quien: 'Revisión ligera: inclusión y seguridad',
    foco: 'Sin metas, sin pasos contados, sin comparar con ayer; alternativa para quien no puede caminar; nada que invite a salir de noche o a sitios inseguros.',
  },
  'BIE-06': {
    revision: 'profesional',
    quien: 'Psicología',
    foco: '«Puedes saltarte una zona o parar cuando quieras» siempre visible; no se insiste en sensaciones; nada de «relájate»; puede no ser adecuada para quien tiene dolor crónico o ha vivido violencia o trauma.',
  },
  'BIE-07': {
    revision: 'profesional',
    quien: 'Profesional de la salud (se revisa junto con BIE-03)',
    foco: 'Misma baranda que BIE-03 en salud del sueño; no hay obligación de marcar nada.',
  },
  'BIE-08': {
    revision: 'ligera',
    quien: 'Revisión ligera',
    foco: 'No se pide la hora de levantarse como meta; ninguna sugerencia de horas de sueño «ideales»; el aviso se activa con permiso, no solo.',
  },
  'BIE-09': {
    revision: 'ligera',
    quien: 'Revisión ligera',
    foco: 'Sin ejercicios que obliguen a levantarse en espacios sin permiso (aula, trabajo); ninguna promete productividad.',
  },
  'EMO-01': {
    revision: 'profesional',
    quien: 'Psicología: la taxonomía y las definiciones',
    foco: 'No hay emociones «buenas» ni «malas»; ninguna definición interpreta («eso significa que…») ni sugiere una causa; nada que suene a diagnóstico (R6); la lista incluye emociones que cuesta nombrar.',
  },
  'EMO-02': {
    revision: 'profesional',
    quien: 'Psicología (tono)',
    foco: 'Nada de «deberías estar agradecida»; «hoy no sale ninguna» se registra igual; riesgo de positividad forzada si se usa en días difíciles.',
  },
  'EMO-03': {
    revision: 'profesional',
    quien: 'Psicología',
    foco: 'No es una herramienta para una crisis: siempre visible «si lo necesitas, hay personas que pueden acompañarte» con acceso a las líneas; no obliga a cerrar los ojos; nunca «relájate».',
  },
  'EMO-04': {
    revision: 'profesional',
    quien: 'Psicología',
    foco: 'No culpa («si tú quisieras, podrías») ni minimiza problemas estructurales (dinero, violencia, salud); siempre existen «No depende de mí» y «Depende en parte»; nunca una conclusión que diga cómo debe sentirse.',
  },
  'EMO-05': {
    revision: 'ligera',
    quien: 'Revisión ligera: que el tono de las invitaciones no presione',
    foco: 'Lo escrito en un mal día lo lee quien despierta mañana. Hoy la carta queda en el diario (reaparecer mañana y borrarla sin leer es un ticket aparte).',
  },
  'EMO-07': {
    revision: 'profesional',
    quien: 'Psicología',
    foco: 'Se elige siempre (nada impuesto); «si un lugar te incomoda, cámbialo» visible; evitar agua profunda o espacios cerrados como primera opción; nunca «imagina que estás a salvo».',
  },
  'EMO-08': {
    revision: 'profesional',
    quien: 'Psicología y datos',
    foco: 'No se guardan nombres ni teléfonos de terceras personas; «aún no sé» es una respuesta válida y se acompaña, no se corrige; enlaza a las líneas de atención; no lee si la persona tiene o no apoyo (R13).',
  },
  'EMO-09': {
    revision: 'ligera',
    quien: 'Revisión ligera',
    foco: 'Texto libre (R8); en la noche, con tono más lento; no resumir ni interpretar el día.',
  },
};
