/**
 * Deteccion de senales de riesgo en lo que escribe una persona.
 *
 * ## Por que es una lista y no un modelo
 *
 * Un modelo de lenguaje acertaria mas veces que esta lista. Acertaria casi
 * siempre. El problema es el casi: cuando falla, al otro lado hay una persona
 * sola que pidio ayuda y no la recibio, y nadie se entera de que fallo.
 *
 * Esta lista es peor reconociendo y mejor rindiendo cuentas. Se puede leer
 * entera, se puede discutir en una reunion, se puede probar frase por frase, y
 * hace exactamente lo mismo hoy que dentro de un ano. Cuando en la Fase 2
 * exista un adaptador con un modelo de lenguaje, **esta comprobacion se sigue
 * ejecutando antes que el**, y su resultado no se negocia.
 *
 * ## Como se equivoca a proposito
 *
 * Se compara sobre texto normalizado, sin tildes y en minusculas, porque nadie
 * escribe con tildes cuando esta mal.
 *
 * No se interpretan negaciones. "no quiero morirme" contiene "quiero morirme" y
 * dispara igual. Es un falso positivo conocido y se deja: el coste de ensenarle
 * lineas de atencion a quien no las necesita es una pantalla que se ignora; el
 * coste de no ensenarselas a quien si, no tiene arreglo.
 *
 * La lista **no es exhaustiva y no pretende serlo**. Es un suelo, no un techo.
 * Que una frase no este aqui no significa que no haya riesgo, significa que
 * esta capa no lo vio.
 */

/**
 * Deja el texto comparable: sin tildes, en minusculas y con los espacios
 * colapsados.
 *
 * La forma NFD separa cada letra de su tilde, y el rango de marcas
 * diacriticas las borra. Sin esto, "quiero morír" no coincidiria con
 * "quiero morir" por un acento.
 */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/gu, '').toLowerCase().replace(/\s+/gu, ' ').trim();
}

/**
 * Expresiones que obligan a mostrar las lineas de atencion.
 *
 * Se escriben ya normalizadas, sin tildes, para que lo que se lee aqui sea
 * exactamente lo que se compara.
 *
 * Antes de anadir o quitar una, conviene recordar que cada linea de esta lista
 * se traduce en una persona que recibe un telefono o no lo recibe.
 */
export const EXPRESIONES_DE_RIESGO: readonly string[] = [
  'quiero morir',
  'quiero morirme',
  'me quiero morir',
  'quiero matarme',
  'me quiero matar',
  'voy a matarme',
  'matarme',
  'suicidarme',
  'suicidio',
  'quitarme la vida',
  'acabar con todo',
  'no quiero seguir viviendo',
  'no quiero vivir',
  'no vale la pena vivir',
  'estaria mejor muerto',
  'estaria mejor muerta',
  'seria mejor no estar',
  'hacerme dano',
  'lastimarme',
  'cortarme',
  'nadie me va a extranar',
  'ya no puedo mas',
  'no aguanto mas',
];

/**
 * Dice si el texto contiene alguna expresion de riesgo.
 *
 * Devuelve un booleano y no la expresion encontrada a proposito: nada de lo
 * que se registre despues debe permitir reconstruir lo que escribio la
 * persona.
 */
export function hayRiesgo(texto: string): boolean {
  const limpio = normalizar(texto);

  return EXPRESIONES_DE_RIESGO.some((expresion) => limpio.includes(expresion));
}
