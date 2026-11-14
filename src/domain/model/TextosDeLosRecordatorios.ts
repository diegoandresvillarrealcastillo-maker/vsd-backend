/**
 * Lo que dicen los recordatorios de la manana y de la noche (SCRUM-126).
 *
 * Cada uno sale en la pantalla bloqueada, a la vista de quien este al lado, y
 * llega todos los dias. Por eso hay varios y rotan: el mismo texto cada dia se
 * vuelve ruido, y el ruido se silencia.
 *
 * ## Como se escriben
 *
 * - **Con juego, sin culpa.** Misiones, pasos, el sendero. Nunca "no pierdas",
 *   "todavia no", "te falta" ni una cuenta de dias: quien no hizo nada hoy no
 *   debe sentir que le deben algo. Siempre dicen que se puede dejar para
 *   manana.
 * - **Sin salud.** Ni un resultado, un nivel, una emocion o el nombre de una
 *   condicion: un aviso no puede delatar para que se usa la aplicacion. Hay
 *   una prueba que lo vigila.
 * - **Cortos.** El titulo y el cuerpo se recortan en la pantalla bloqueada.
 *
 * Son texto de producto: se pueden cambiar o ampliar sin tocar nada mas, con
 * tal de pasar esa prueba.
 */

export interface TextoDeAviso {
  readonly titulo: string;
  readonly cuerpo: string;
}

/** A las 8:00. Invitan a empezar el dia; salen siempre. */
export const TEXTOS_DE_LA_MANANA: readonly TextoDeAviso[] = [
  {
    titulo: 'Buenos días, hay una misión nueva',
    cuerpo: 'Una actividad pequeña te espera en tu sendero. A tu ritmo.',
  },
  {
    titulo: 'Un día nuevo, un paso nuevo',
    cuerpo: 'Elige una actividad cuando quieras y suma un paso a tu sendero.',
  },
  {
    titulo: '¡Arrancamos! Tu sendero ya abrió',
    cuerpo: 'Hoy hay algo para ti. Sin prisa, cuando te quede bien.',
  },
  {
    titulo: 'Tu momento del día está listo',
    cuerpo: 'Unos minutos para ti caben en cualquier parte de la mañana.',
  },
  {
    titulo: 'Hoy puedes ganar un paso más',
    cuerpo: 'Una actividad corta y tu sendero avanza. Tú decides cuándo.',
  },
  {
    titulo: 'Tu sendero te da los buenos días',
    cuerpo: 'Hoy tiene una parada nueva. Pasa por ella cuando quieras.',
  },
  {
    titulo: 'Misión del día disponible',
    cuerpo: 'Elige una de las actividades que te gustan y empieza con calma.',
  },
  {
    titulo: 'Empieza el día con algo para ti',
    cuerpo: 'Un ratito propio, antes de que el día se llene. Cuando quieras.',
  },
  {
    titulo: 'Un nuevo día en tu sendero',
    cuerpo: 'Mira qué actividad te llama hoy. Todas suman.',
  },
  {
    titulo: '¡Buen día! Tu momento te espera',
    cuerpo: 'Dos o tres minutos bastan para dar el primer paso de hoy.',
  },
  {
    titulo: 'Hoy también tienes tu espacio',
    cuerpo: 'Tu sendero sigue en pie. Entra cuando te nazca.',
  },
  {
    titulo: 'La mañana es buena para dar un paso',
    cuerpo: 'Una actividad ligera y listo. Sin presión.',
  },
];

/** A las 20:00. Solo salen si ese dia no se hizo ninguna actividad. */
export const TEXTOS_DE_LA_NOCHE: readonly TextoDeAviso[] = [
  {
    titulo: '¿Cerramos el día con un paso pequeño?',
    cuerpo: 'Una actividad corta antes de dormir. Si hoy no se pudo, mañana seguimos.',
  },
  {
    titulo: 'Aún queda un ratito del día',
    cuerpo: 'Si te provoca, tu sendero te espera. Si no, descansa: mañana hay otro día.',
  },
  {
    titulo: 'Tu sendero te guarda el lugar',
    cuerpo: 'Pasa a saludar cuando quieras; nada corre prisa.',
  },
  {
    titulo: 'Un último paso del día, si te apetece',
    cuerpo: 'Tus actividades están a un toque de distancia.',
  },
  {
    titulo: '¿Un momento para ti antes de dormir?',
    cuerpo: 'Unos minutos de calma pueden cerrar bien la jornada.',
  },
  {
    titulo: 'La noche también sirve para sumar',
    cuerpo: 'Una actividad ligera y tu día cierra con un paso más.',
  },
  {
    titulo: 'Hoy tu sendero está tranquilo',
    cuerpo: 'Si quieres darle vida, escoge una actividad corta. Sin presión.',
  },
  {
    titulo: 'Buenas noches, tu misión sigue disponible',
    cuerpo: 'No hay apuro: entra cuando te quede bien.',
  },
  {
    titulo: 'Antes de apagar el día…',
    cuerpo: 'Un ratito para ti, si te quedan ganas. Tu sendero te espera.',
  },
  {
    titulo: 'Un cierre suave para hoy',
    cuerpo: 'Elige algo ligero y date ese momento. Mañana seguimos juntos.',
  },
  {
    titulo: 'Un pequeño cierre para el día',
    cuerpo: 'Una actividad breve y a descansar. Tú decides.',
  },
  {
    titulo: 'Tu espacio sigue abierto esta noche',
    cuerpo: 'Entra solo si te nace. Aquí estaremos mañana también.',
  },
];
