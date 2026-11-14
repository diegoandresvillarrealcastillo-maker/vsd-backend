/**
 * Cómo VSD IA lee lo que escribe una persona, y cuánto tolera sus erratas (SCRUM-193).
 *
 * Es lo primero que le pasa a un mensaje, antes de la detección de riesgo y antes de reconocer qué
 * se dijo, y está en el dominio porque lo comparten el servidor, el paquete que se publica para
 * responder sin conexión y la propia detección de riesgo.
 *
 * ## Qué se tolera y qué no
 *
 * La gente escribe desde el teléfono, de prisa, y a veces mal: «ola», «cómo bamos», «kiero»,
 * «suisidarme». Un asistente que solo entiende la ortografía perfecta deja sin respuesta (y, peor,
 * sin detectar el riesgo) justo a quien escribe sin cuidar la forma. Hay dos mecanismos, y los dos
 * son **deliberadamente cortos**:
 *
 * 1. **Una tabla de erratas frecuentes**, escritas tal cual se tipean («ola», «bamos», «kiero»).
 *    Sirve para las palabras cortas, donde la distancia no es de fiar.
 * 2. **Distancia de edición de uno**, hacia una palabra que **ya está en el vocabulario** del
 *    asistente, y solo si:
 *    - la palabra tiene cinco letras o más (casi toda palabra corta está a una letra de otra);
 *    - empieza y termina con las mismas letras (lo que cambia al final suele ser de quién se
 *      habla: «aguanto» y «aguanta» no son la misma palabra);
 *    - hay **un solo** candidato. Ante la duda, se deja como está.
 *
 * ## La tolerancia amplía el riesgo, nunca lo debilita
 *
 * Lo que ya se detectaba se sigue detectando: la corrección **suma** coincidencias, no quita
 * ninguna. «Quiero morirme» con una errata («kiero morirme», «quiero morirne») dispara igual que
 * sin ella.
 *
 * ## Lo que NO usa esto
 *
 * El lenguaje ofensivo solo usa la tabla, **nunca** la distancia: «tanto» está a una letra de
 * «tonto», y una errata no puede convertirle a nadie una frase cualquiera en un insulto.
 */

/**
 * Lo que no se dibuja pero está en el texto: guiones blandos, espacios y uniones de ancho cero,
 * marcas de dirección, selectores de variación, etiquetas (`Default_Ignorable_Code_Point`).
 */
const INVISIBLES = /\p{Default_Ignorable_Code_Point}/gu;

/**
 * Deja el texto comparable: sin tildes, sin invisibles, en minúsculas y con los espacios
 * colapsados.
 *
 * - NFKD separa cada letra de su tilde y, además, lleva a su forma corriente las letras de ancho
 *   completo y las matemáticas. Sin esto, «quiero morír» no coincidiría con «quiero morir» por un
 *   acento.
 * - Los invisibles se **quitan**: «mo» + U+200B + «rir» no se ve distinto de «morir», y que una
 *   comparación de texto sí los distinga sería la forma más barata de que lo escrito no se
 *   detecte (SCRUM-258). Se quitan antes que las marcas, porque NFKD puede dejar alguno suelto.
 * - Se quitan **todas** las marcas combinadas (`\p{M}`), no solo el rango de las tildes.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFKD')
    .replace(INVISIBLES, '')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/gu, ' ')
    .trim();
}

/**
 * El mismo texto con los invisibles convertidos en espacio, o el mismo texto si no tiene ninguno.
 *
 * `normalizar` los quita, y eso cierra «mo» + U+200B + «rir». Pero alguien también puede usar
 * uno **en lugar de** el espacio: quitado, «quiero» + U+200B + «morir» quedaría «quieromorir».
 * Quien detecta riesgo mira las dos lecturas (SCRUM-258).
 */
export function conInvisiblesComoEspacio(texto: string): string {
  return texto.replace(INVISIBLES, ' ');
}

/**
 * Donde había invisibles, en un texto leído con `leerConInvisibles`. Es un carácter de control que
 * `normalizar` no toca; si ya venía uno en lo escrito, se lee igual: como un invisible más.
 */
const MARCA_DE_INVISIBLE = '\u{1}';

/**
 * El texto comparable (como `normalizar`) pero **dejando una marca donde había invisibles**, en
 * lugar de decidir por adelantado qué eran (SCRUM-318).
 *
 * Quitarlos todos cierra «mo» + U+200B + «rir» y convertirlos todos en espacio cierra «quiero» +
 * U+200B + «morir», pero una sola frase puede llevar los dos usos a la vez («quiero» + U+200B +
 * «mo» + U+200B + «rir»), y ninguna de las dos lecturas globales la ve. Con la marca, quien compara
 * (`contieneLaExpresion`) decide en cada sitio: dentro de una palabra la marca no cuenta, y entre
 * dos palabras hace de separación.
 */
export function leerConInvisibles(texto: string): string {
  return texto
    .normalize('NFKD')
    .replace(INVISIBLES, MARCA_DE_INVISIBLE)
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/gu, ' ')
    .trim();
}

/**
 * Cierto si `leido` (de `leerConInvisibles`) contiene `expresion`, una expresión ya normalizada de
 * la lista de riesgo: palabras en minúscula y sin tildes separadas por un espacio.
 *
 * - Entre dos letras de una misma palabra puede haber invisibles: no cuentan.
 * - El espacio de la expresión coincide con **uno o más** espacios o invisibles, mezclados como
 *   sea. Tiene que haber al menos uno: «quieromorir» no es «quiero morir».
 * - Se busca como subcadena, igual que antes: no pide límites de palabra.
 *
 * ## Por qué es seguro
 *
 * La expresión es un dato de confianza y lo escrito por la persona **no se convierte en expresión
 * regular ni se enumeran variantes**: se recorre el texto una vez por cada aparición de la primera
 * letra, y cada intento avanza sin retroceder. El coste es, como mucho, el largo del texto por el de
 * la expresión, sin importar cuántos invisibles lleve.
 */
export function contieneLaExpresion(leido: string, expresion: string): boolean {
  const primera = expresion[0];

  if (primera === undefined) {
    return false;
  }

  for (
    let inicio = leido.indexOf(primera);
    inicio !== -1;
    inicio = leido.indexOf(primera, inicio + 1)
  ) {
    if (coincideDesde(leido, inicio, expresion)) {
      return true;
    }
  }

  return false;
}

function coincideDesde(leido: string, inicio: number, expresion: string): boolean {
  let posicion = inicio;

  for (let i = 0; i < expresion.length; i += 1) {
    if (expresion[i] === ' ') {
      const desde = posicion;

      while (leido[posicion] === ' ' || leido[posicion] === MARCA_DE_INVISIBLE) {
        posicion += 1;
      }

      // Sin ningun espacio ni invisible no hay separacion entre las palabras.
      if (posicion === desde) {
        return false;
      }

      continue;
    }

    // Dentro de una palabra, un invisible entre dos letras no cuenta.
    while (i > 0 && leido[posicion] === MARCA_DE_INVISIBLE) {
      posicion += 1;
    }

    if (leido[posicion] !== expresion[i]) {
      return false;
    }

    posicion += 1;
  }

  return true;
}

/**
 * Las palabras de un texto: enteras, sin tildes, sin signos y en minúscula.
 *
 * Tres letras iguales seguidas se leen como una («holaaaa», «graciasss»): en español ninguna
 * palabra las lleva, y así la gente que escribe alargando no queda sin respuesta.
 */
export function palabrasDe(texto: string): readonly string[] {
  return normalizar(texto)
    .replace(/(\p{L})\1{2,}/gu, '$1')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((palabra) => palabra !== '');
}

/**
 * Las erratas que más se tipean, hacia la palabra que se quiso escribir. Escritas ya normalizadas.
 *
 * Es una lista que se puede leer entera y ampliar con una línea. Se agrega aquí lo que se vea
 * escrito de verdad; no lo que «podría» escribirse.
 */
export const ERRATAS_FRECUENTES: Readonly<Record<string, string>> = {
  // El saludo, que tiene cuatro letras y por eso la distancia no lo alcanza.
  ola: 'hola',
  holaa: 'hola',
  hol: 'hola',
  hoa: 'hola',
  ohla: 'hola',
  // «Cómo vamos», «cómo estás».
  komo: 'como',
  cmo: 'como',
  bamos: 'vamos',
  bamo: 'vamos',
  vamo: 'vamos',
  etas: 'estas',
  // Los que se escriben de forma abreviada.
  ke: 'que',
  q: 'que',
  k: 'que',
  xq: 'porque',
  pq: 'porque',
  // «Quiero».
  kiero: 'quiero',
  kero: 'quiero',
  qiero: 'quiero',
  quero: 'quiero',
  // «Gracias».
  grasias: 'gracias',
  gracais: 'gracias',
  gracas: 'gracias',
  garcias: 'gracias',
  grcias: 'gracias',
  gracia: 'gracias',
  grax: 'gracias',
  // «Adiós».
  adio: 'adios',
  // «Psicólogo»: la «p» no se pronuncia y casi no se escribe.
  sicologo: 'psicologo',
  sicologa: 'psicologa',
  sicologia: 'psicologia',
  // «No aguanto más».
  mass: 'mas',
};

/**
 * La distancia de Damerau-Levenshtein: cuántas inserciones, borrados, sustituciones o cambios de
 * dos letras contiguas separan una palabra de otra.
 */
export function distanciaDeEdicion(a: string, b: string): number {
  const filas = a.length + 1;
  const columnas = b.length + 1;
  const tabla: number[][] = Array.from({ length: filas }, (_fila, i) =>
    Array.from({ length: columnas }, (_columna, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i < filas; i += 1) {
    for (let j = 1; j < columnas; j += 1) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      let mejor = Math.min(
        (tabla[i - 1]?.[j] ?? 0) + 1,
        (tabla[i]?.[j - 1] ?? 0) + 1,
        (tabla[i - 1]?.[j - 1] ?? 0) + costo,
      );

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        mejor = Math.min(mejor, (tabla[i - 2]?.[j - 2] ?? 0) + 1);
      }

      (tabla[i] as number[])[j] = mejor;
    }
  }

  return tabla[filas - 1]?.[columnas - 1] ?? 0;
}

/** Menos letras que esto y una palabra no se corrige por distancia. */
const LARGO_MINIMO_PARA_CORREGIR = 5;

/**
 * Las palabras que el asistente conoce, sacadas de listas de patrones y frases.
 *
 * Las raíces (`psicolog*`) quedan fuera: no son una palabra hacia la que se pueda corregir.
 */
export function vocabularioDe(listas: readonly (readonly string[])[]): ReadonlySet<string> {
  const vocabulario = new Set<string>();

  for (const lista of listas) {
    for (const patron of lista) {
      for (const palabra of patron.split(' ')) {
        if (palabra !== '' && !palabra.endsWith('*')) {
          vocabulario.add(palabra);
        }
      }
    }
  }

  return vocabulario;
}

/** La única palabra del vocabulario a una letra de ésta, o `undefined` si no hay una sola. */
function candidataUnica(palabra: string, vocabulario: ReadonlySet<string>): string | undefined {
  const primera = palabra[0];
  const ultima = palabra[palabra.length - 1];
  let encontrada: string | undefined;

  for (const candidata of vocabulario) {
    if (
      candidata.length < LARGO_MINIMO_PARA_CORREGIR ||
      Math.abs(candidata.length - palabra.length) > 1 ||
      candidata[0] !== primera ||
      candidata[candidata.length - 1] !== ultima ||
      distanciaDeEdicion(palabra, candidata) !== 1
    ) {
      continue;
    }

    if (encontrada !== undefined) {
      // Dos candidatas: no hay como saber cual quiso decir. Se deja como esta.
      return undefined;
    }

    encontrada = candidata;
  }

  return encontrada;
}

/**
 * Lee las palabras como se quisieron escribir.
 *
 * Primero la tabla de erratas; despues, si la palabra no esta en el vocabulario, la distancia de
 * edicion (con las condiciones de arriba). Una palabra que ya esta en el vocabulario no se toca.
 * Sin vocabulario solo corrige por la tabla.
 */
export function corregirPalabras(
  palabras: readonly string[],
  vocabulario: ReadonlySet<string>,
  erratas: Readonly<Record<string, string>> = ERRATAS_FRECUENTES,
): readonly string[] {
  return palabras.map((palabra) => {
    const porTabla = Object.hasOwn(erratas, palabra) ? erratas[palabra] : undefined;

    if (porTabla !== undefined) {
      return porTabla;
    }

    if (vocabulario.has(palabra) || palabra.length < LARGO_MINIMO_PARA_CORREGIR) {
      return palabra;
    }

    return candidataUnica(palabra, vocabulario) ?? palabra;
  });
}
