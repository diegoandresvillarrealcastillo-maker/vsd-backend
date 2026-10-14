/**
 * El lenguaje ofensivo hacia VSD IA (SCRUM-192, decisión D5 del ciclo 7).
 *
 * **Este archivo es la lista que revisa una persona** (Diego): qué cuenta como insulto, qué no,
 * qué se le responde y a partir de cuántas veces se cierra la conversación. Está aparte del resto
 * de las reglas a propósito, para que la revisión lea una sola página y no código.
 *
 * ## Lo más importante: insulto no es desahogo
 *
 * Quien escribe «me siento una mierda» o «soy un inútil» **no está insultando al asistente**: está
 * contando cómo se siente, y es justo a quien el asistente tiene que seguir escuchando. Cerrarle la
 * conversación sería el peor error posible. Por eso esta lista es corta y conservadora, y por eso
 * hay dos listas y no una:
 *
 * - `TERMINOS_OFENSIVOS`: lo que, dicho al asistente, es un insulto o una orden de callar.
 * - `MARCAS_DE_DESAHOGO`: si el mensaje habla de quien lo escribe («soy», «me siento», «odio mi
 *   vida»), **no cuenta**, aunque lleve uno de los términos.
 *
 * Un falso negativo (no ver un insulto) cuesta una respuesta más amable. Un falso positivo (leer un
 * desahogo como insulto) le cierra la puerta a quien más la necesita. **Ante la duda no se cuenta.**
 *
 * ## El riesgo va antes
 *
 * Esto se evalúa **después** de la detección de riesgo, y nunca antes: «eres un idiota, quiero
 * morirme» es una señal de riesgo y recibe las líneas de atención, no una advertencia.
 *
 * ## Cómo se cuenta (lo hace el cliente, no el servidor)
 *
 * El servidor no guarda conversaciones, así que **no cuenta**: solo dice que un mensaje fue ofensivo
 * (`lenguaje_ofensivo`). La cuenta la lleva la ventana de chat que está abierta, en memoria: a las
 * `umbral` veces **seguidas** (cualquier mensaje que no sea ofensivo la reinicia) la conversación
 * se cierra. Cerrarla no bloquea a nadie: se abre otra cuando quiera.
 */

/**
 * Lo que, dicho al asistente, es un insulto o una orden de callar. Escritos ya normalizados (sin
 * tildes, en minúscula), como el resto de las listas. Un patrón son una o varias palabras seguidas;
 * si termina en `*` es una raíz que admite terminaciones (`idiota*`: idiota, idiotas).
 *
 * Deliberadamente **no** están palabras que en Colombia se usan también con cariño («marica»,
 * «parce», «gonorrea»), ni las que solo ofenden según el contexto («basura», «mierda» sueltas):
 * «saca la basura» no es un insulto.
 */
export const TERMINOS_OFENSIVOS: readonly string[] = [
  // Insultos directos.
  'idiota*',
  'imbecil*',
  'estupid*',
  'inutil',
  'inutiles',
  'tonto',
  'tonta',
  'pendej*',
  'gilipollas',
  'cabron*',
  'malparid*',
  'hijueputa*',
  'hijoputa*',
  'hdp',
  // Insultos que solo lo son dichos a alguien.
  'eres una mierda',
  'eres mierda',
  'eres basura',
  'eres una basura',
  'eres un asco',
  // Órdenes de callar o de irse.
  'callate',
  'cierra la boca',
  'jodete',
  'largate',
  'vete a la mierda',
  'andate a la mierda',
  'vete al carajo',
  // En inglés, que también se escribe.
  'fuck you',
  'fuck off',
  'shut up',
];

/**
 * Lo que dice que el mensaje habla de quien lo escribe y no del asistente. Si aparece alguna, el
 * mensaje **no es ofensivo** aunque lleve un término de la lista.
 */
export const MARCAS_DE_DESAHOGO: readonly string[] = [
  'me siento',
  'me sentia',
  'siento que',
  'soy',
  'estoy',
  'fui',
  'parezco',
  'me veo',
  'me porto',
  'me comporto',
  'me odio',
  'odio mi',
  'mi vida',
  'mi culpa',
];

/**
 * A cuántos mensajes ofensivos **seguidos**, en la misma ventana de chat, se cierra la
 * conversación (el requisito original: «si insiste tres veces consecutivas»).
 */
export const UMBRAL_DE_OFENSAS = 3;

/** Lo que se responde a un insulto: asertivo, sin juicio y sin líneas de atención. */
export const MENSAJE_ANTE_LENGUAJE_OFENSIVO =
  'Entiendo cómo te sientes, pero por favor evita ese lenguaje si quieres que te siga ayudando. ' +
  'Aquí estoy cuando quieras retomar.';

/**
 * Lo que se dice al cerrar la conversación. No acusa: deja claro que se puede abrir otra, y que
 * en Recursos hay dónde apoyarse. No es una alerta: no hay una señal de riesgo.
 */
export const MENSAJE_AL_CERRAR_POR_OFENSAS =
  'Voy a cerrar esta conversación por ahora. Puedes abrir una nueva cuando quieras: aquí voy a ' +
  'estar. Y si quieres hablar con alguien, en Recursos encuentras dónde.';

/** Todo lo que el dispositivo necesita para aplicar la regla sin conexión. */
export const LENGUAJE_OFENSIVO = {
  terminos: TERMINOS_OFENSIVOS,
  desahogo: MARCAS_DE_DESAHOGO,
  umbral: UMBRAL_DE_OFENSAS,
  mensaje: MENSAJE_ANTE_LENGUAJE_OFENSIVO,
  mensajeAlCerrar: MENSAJE_AL_CERRAR_POR_OFENSAS,
} as const;
