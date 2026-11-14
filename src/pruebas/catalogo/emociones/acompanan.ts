import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * EMO-08 · «Quien me acompana» (motor `cuestionario_corto`, modo `preguntas`): 40 sesiones.
 *
 * Recordar con quien se puede contar, **sin guardar nombres**: preguntas suaves cuya respuesta es un **tipo** de
 * persona (alguien de la familia, una amistad, alguien del estudio o del trabajo, un profesional, una comunidad
 * o «aun no se»). Una pregunta por sesion.
 *
 * Barandas de la ficha: **no se guardan nombres ni telefonos de terceras personas** (son datos de alguien que
 * no consintio, Ley 1581: la respuesta es un tipo, no una persona); **«aun no se» es una respuesta valida** y se
 * acompana, no se corrige; cada pantalla enlaza a las lineas de atencion del pais sin esperar una semana
 * (`conLineasDeAyuda`); y **no lee** si la persona tiene o no apoyo (R13): el cierre no depende de lo que se
 * respondio.
 *
 * El cierre no es el de la ficha («Saber con quien se cuenta ya es una compania»): leido despues de «aun no
 * se» sonaria a que no tiene a nadie. Pide revision de psicologia y datos.
 */

const TIPOS = [
  { clave: 'familia', texto: 'Alguien de la familia' },
  { clave: 'amistad', texto: 'Una amistad' },
  { clave: 'estudio-trabajo', texto: 'Alguien del estudio o del trabajo' },
  { clave: 'profesional', texto: 'Un profesional' },
  { clave: 'comunidad', texto: 'Una comunidad o un grupo' },
  { clave: 'aun-no-se', texto: 'Aún no sé' },
] as const;

const PREGUNTAS: readonly string[] = [
  '¿Quién te hace reír?',
  '¿A quién le contarías algo difícil?',
  '¿Con quién te sientes a gusto?',
  '¿A quién le pedirías ayuda con una tarea?',
  '¿Quién te escucha sin juzgar?',
  '¿Con quién compartes tus ratos libres?',
  '¿A quién le contarías una buena noticia?',
  '¿Con quién te gustaría hablar hoy?',
  '¿A quién le preguntarías una duda?',
  '¿Con quién podrías caminar un rato?',
  '¿A quién le pedirías un consejo?',
  '¿Quién te hace sentir en confianza?',
  '¿Con quién te gusta comer o tomar algo?',
  '¿A quién acudirías si necesitaras compañía?',
  '¿Quién te recuerda lo que haces bien?',
  '¿A quién le pedirías que te acompañe a un trámite?',
  '¿Con quién puedes hablar de lo que te gusta?',
  '¿Quién te ayuda a ver las cosas con calma?',
  '¿A quién le contarías un mal día?',
  '¿Con quién te gustaría celebrar algo?',
  '¿Quién te ha ayudado alguna vez?',
  '¿A quién le pedirías algo prestado?',
  '¿Con quién te sientes en casa?',
  '¿A quién le escribirías hoy?',
  '¿Con quién te gustaría hacer un plan sencillo?',
  '¿Quién te enseña cosas?',
  '¿A quién le agradecerías algo?',
  '¿Con quién podrías estudiar o trabajar a la par?',
  '¿Quién te da buenas ideas?',
  '¿A quién le contarías un miedo?',
  '¿Con quién puedes ser como eres?',
  '¿A quién llamarías si se te perdiera algo?',
  '¿Quién te hace sentir parte de algo?',
  '¿A quién le pedirías que te escuche un rato?',
  '¿Con quién te gustaría compartir una comida?',
  '¿Quién te da ánimo cuando habla contigo?',
  '¿A quién le preguntarías cómo está?',
  '¿Con quién compartes un interés?',
  '¿A quién le pedirías un abrazo?',
  '¿Quién te da tranquilidad cuando habla contigo?',
];

export function sesionesDeAcompanamiento(): SesionDeContenido[] {
  return PREGUNTAS.map((texto, i) =>
    sesion('EMO-08', i + 1, `Pregunta ${i + 1}: ${texto}`, {
      modo: 'preguntas',
      indicacion:
        'No guardamos nombres ni teléfonos de nadie: solo el tipo de persona. No hay respuestas buenas ni malas, y «aún no sé» también vale.',
      preguntas: [{ clave: 'quien', texto, tipo: 'opcion', opciones: TIPOS }],
      cierre: 'Gracias por pensarlo con calma.',
      avisoSiempre: 'Si lo necesitas, hay personas que pueden acompañarte.',
      conLineasDeAyuda: true,
    }),
  );
}
