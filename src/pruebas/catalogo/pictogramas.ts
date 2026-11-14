/**
 * La biblioteca de pictogramas del catalogo (SCRUM-222, SCRUM-226): las figuras con nombre que usan
 * «Recuerda los colores» (COG-01), «Toca solo lo que cambia» (COG-05) y «Lo que vi» (COG-09).
 *
 * Aqui estan **las claves y los nombres**; los dibujos viven en el frontend (`pictogramas/`), que tiene
 * que dibujar todas. Una clave que el frontend no conozca se pinta como una ficha neutra y el juego se juega
 * igual, por el nombre (R10: el nombre escrito es la pista, la figura es adorno). La lista se copia al
 * frontend en `pictogramasDelCatalogo.json`, y la prueba de cada repositorio comprueba la suya.
 *
 * Son 60, repartidas en siete temas de nueve (las nueve primeras son las figuras de siempre de «Recuerda los
 * colores»; `luna`, `nube` y `hoja` estan tambien en el clima y la naturaleza).
 */
export interface Pictograma {
  readonly clave: string;
  readonly nombre: string;
}

const p = (clave: string, nombre: string): Pictograma => ({ clave, nombre });

export const TEMAS_DE_PICTOGRAMAS = {
  formas: [
    p('circulo', 'círculo'),
    p('cuadrado', 'cuadrado'),
    p('triangulo', 'triángulo'),
    p('rombo', 'rombo'),
    p('estrella', 'estrella'),
    p('hoja', 'hoja'),
    p('gota', 'gota'),
    p('luna', 'luna'),
    p('nube', 'nube'),
  ],
  frutas: [
    p('manzana', 'manzana'),
    p('pera', 'pera'),
    p('uva', 'uvas'),
    p('naranja', 'naranja'),
    p('banano', 'banano'),
    p('fresa', 'fresa'),
    p('limon', 'limón'),
    p('cereza', 'cerezas'),
    p('pina', 'piña'),
  ],
  animales: [
    p('gato', 'gato'),
    p('perro', 'perro'),
    p('pez', 'pez'),
    p('ave', 'ave'),
    p('mariposa', 'mariposa'),
    p('tortuga', 'tortuga'),
    p('conejo', 'conejo'),
    p('abeja', 'abeja'),
    p('caracol', 'caracol'),
  ],
  clima: [
    p('sol', 'sol'),
    p('lluvia', 'lluvia'),
    p('rayo', 'rayo'),
    p('copo', 'copo de nieve'),
    p('viento', 'viento'),
    p('arcoiris', 'arcoíris'),
    p('sombrilla', 'sombrilla'),
    p('luna', 'luna'),
    p('nube', 'nube'),
  ],
  naturaleza: [
    p('arbol', 'árbol'),
    p('flor', 'flor'),
    p('montana', 'montaña'),
    p('ola', 'ola'),
    p('hongo', 'hongo'),
    p('palmera', 'palmera'),
    p('cactus', 'cactus'),
    p('trebol', 'trébol'),
    p('hoja', 'hoja'),
  ],
  casa: [
    p('llave', 'llave'),
    p('taza', 'taza'),
    p('silla', 'silla'),
    p('lampara', 'lámpara'),
    p('puerta', 'puerta'),
    p('ventana', 'ventana'),
    p('libro', 'libro'),
    p('reloj', 'reloj'),
    p('cama', 'cama'),
  ],
  transporte: [
    p('bus', 'bus'),
    p('bicicleta', 'bicicleta'),
    p('barco', 'barco'),
    p('avion', 'avión'),
    p('tren', 'tren'),
    p('carro', 'carro'),
    p('moto', 'moto'),
    p('cohete', 'cohete'),
    p('globo', 'globo aerostático'),
  ],
} as const satisfies Readonly<Record<string, readonly Pictograma[]>>;

/** Todas, sin repetir (60), en el orden de los temas. */
export const PICTOGRAMAS: readonly Pictograma[] = (() => {
  const vistas = new Set<string>();
  const todas: Pictograma[] = [];

  for (const tema of Object.values(TEMAS_DE_PICTOGRAMAS)) {
    for (const pictograma of tema) {
      if (!vistas.has(pictograma.clave)) {
        vistas.add(pictograma.clave);
        todas.push(pictograma);
      }
    }
  }

  return todas;
})();

const PORCLAVE = new Map(PICTOGRAMAS.map((una) => [una.clave, una]));

/** El pictograma de una clave. Falla si no existe: un contenido con una clave inventada no se siembra. */
export function pictogramaDe(clave: string): Pictograma {
  const encontrado = PORCLAVE.get(clave);

  if (encontrado === undefined) {
    throw new Error(`No hay un pictograma "${clave}" en la biblioteca`);
  }

  return encontrado;
}
