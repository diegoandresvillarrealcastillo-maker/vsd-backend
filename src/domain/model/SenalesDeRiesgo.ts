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

import { corregirPalabras, normalizar, palabrasDe, vocabularioDe } from './LecturaDelTexto.js';

// `normalizar` vive en `LecturaDelTexto` (SCRUM-193) y se sigue ofreciendo desde aqui: es de donde
// lo importa casi todo el sistema.
export { normalizar };

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
  // Despedidas que no dejan duda (SCRUM-176, SCRUM-193). Hasta entonces las protegia la red de
  // seguridad de «no reconocida», que ensenaba las lineas de atencion ante todo lo que no
  // entendia. Al quitarsela (con una pregunta fuera de dominio no hay crisis), estas frases
  // pasan a la lista: sin ello se quedaban sin telefono las mas peligrosas.
  'quiero desaparecer',
  'no quiero despertar',
  'adios a todo',
  'adios para siempre',
  'hasta nunca',
  'que nadie me busque',
  'me despido de este mundo',
];

/**
 * Las palabras que aparecen en las expresiones de riesgo: contra ellas se corrigen las erratas
 * (SCRUM-193). Solo estas: una errata nunca puede acercar una palabra a algo que no sea riesgo.
 */
const VOCABULARIO_DE_RIESGO = vocabularioDe([EXPRESIONES_DE_RIESGO]);

/**
 * Dice si el texto contiene alguna expresion de riesgo.
 *
 * Devuelve un booleano y no la expresion encontrada a proposito: nada de lo
 * que se registre despues debe permitir reconstruir lo que escribio la
 * persona.
 *
 * ## Tolera erratas, y solo en un sentido (SCRUM-193)
 *
 * Primero se busca el texto tal cual, como siempre. Despues se vuelve a buscar con las erratas
 * leidas como se quisieron escribir («kiero morirme», «suisidarme», «quiero morirne»). **La
 * segunda busqueda solo suma**: lo que se detectaba antes se sigue detectando, y la tolerancia
 * amplia la lista en lugar de debilitarla. Las reglas de la correccion (que no cambie quien
 * habla, que no corrija lo ambiguo) estan en `LecturaDelTexto.ts`.
 */
export function hayRiesgo(texto: string): boolean {
  const limpio = normalizar(texto);

  if (EXPRESIONES_DE_RIESGO.some((expresion) => limpio.includes(expresion))) {
    return true;
  }

  const corregido = corregirPalabras(palabrasDe(texto), VOCABULARIO_DE_RIESGO).join(' ');

  return EXPRESIONES_DE_RIESGO.some((expresion) => corregido.includes(expresion));
}

/**
 * Todo el texto de un valor JSON, a cualquier profundidad.
 *
 * Sirve para pasar por `hayRiesgo` lo que alguien escribio dentro de una
 * estructura: la metadata de un resultado, los diagramas del diario. Un campo
 * nuevo de texto libre queda cubierto sin acordarse de anadirlo. Los numeros y
 * los booleanos no cuentan, y las claves tampoco: las pone el programa, no la
 * persona.
 */
export function textosDe(valor: unknown): string[] {
  if (typeof valor === 'string') {
    return [valor];
  }

  if (Array.isArray(valor)) {
    return (valor as readonly unknown[]).flatMap(textosDe);
  }

  if (valor !== null && typeof valor === 'object') {
    return Object.values(valor).flatMap(textosDe);
  }

  return [];
}
