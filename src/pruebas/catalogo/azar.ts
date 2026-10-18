/**
 * Azar con semilla, para generar contenido que sea siempre el mismo (SCRUM-222).
 *
 * El contenido procedural (las cuentas, las secuencias, las distribuciones de puntos) se genera **al
 * sembrar**, no en el telefono, y tiene que salir igual cada vez: la migracion que se aplica es la que se
 * reviso, y una prueba compara lo generado con lo escrito. Por eso aqui no hay `Math.random`.
 */

/** Un generador `mulberry32`: pequeno, rapido y de sobra para repartir contenido. Devuelve [0, 1). */
export function generadorDe(semilla: number): () => number {
  let estado = semilla >>> 0;

  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Azar = ReturnType<typeof generadorDe>;

/** Un entero de `minimo` a `maximo`, los dos incluidos. */
export function entre(azar: Azar, minimo: number, maximo: number): number {
  return minimo + Math.floor(azar() * (maximo - minimo + 1));
}

/** Una copia de la lista, revuelta (Fisher-Yates). */
export function revolver<T>(azar: Azar, elementos: readonly T[]): T[] {
  const copia = [...elementos];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    const guardado = copia[i] as T;

    copia[i] = copia[j] as T;
    copia[j] = guardado;
  }

  return copia;
}

/** Un elemento cualquiera de la lista. */
export function uno<T>(azar: Azar, elementos: readonly T[]): T {
  return elementos[Math.floor(azar() * elementos.length)] as T;
}

/**
 * Reparte `elementos` en `sesiones` grupos de `porSesion`, recorriendo la lista en circulo: la sesion `s`
 * toma los que van desde `s * porSesion`. Con `porSesion` menor que la lista, **ningun grupo repite un
 * elemento**, y cada elemento sale `floor` o `ceil` de `sesiones * porSesion / elementos.length` veces.
 *
 * Es la regla del ADR 0031: un elemento no aparece en mas de dos sesiones. Con 40 elementos y 13 sesiones de
 * 6, ninguno pasa de dos; con 42 y 14, todos salen exactamente dos veces.
 */
export function repartir<T>(elementos: readonly T[], sesiones: number, porSesion: number): T[][] {
  if (porSesion > elementos.length) {
    throw new Error(`No se pueden repartir ${porSesion} de ${elementos.length} sin repetir`);
  }

  return Array.from({ length: sesiones }, (_, s) =>
    Array.from(
      { length: porSesion },
      (_, k) => elementos[(s * porSesion + k) % elementos.length] as T,
    ),
  );
}
