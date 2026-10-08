/**
 * Hace `tarea` con cada elemento, con **a lo sumo `tope` a la vez**.
 *
 * Es un reparto de trabajo, no `Promise.all` sobre todo: con miles de elementos
 * lanzarlos todos juntos agotaria las conexiones a la base y los sockets de
 * salida. Aqui hay `tope` trabajadores y cada uno toma el siguiente elemento
 * cuando termina el suyo, asi que uno lento no frena a los demas.
 *
 * Un fallo de una tarea no deja a las demas a medias: el resto se completa y
 * despues se lanza el primer error. Lo normal es que `tarea` atrape lo suyo; esto
 * es la red por si no lo hace.
 */
export async function conTope<T>(
  elementos: readonly T[],
  tope: number,
  tarea: (elemento: T) => Promise<void>,
): Promise<void> {
  if (!Number.isInteger(tope) || tope < 1) {
    throw new RangeError('El tope tiene que ser un entero de al menos 1.');
  }

  const pendientes = elementos.values();
  const errores: unknown[] = [];

  async function trabajador(): Promise<void> {
    for (
      let siguiente = pendientes.next();
      siguiente.done !== true;
      siguiente = pendientes.next()
    ) {
      try {
        await tarea(siguiente.value);
      } catch (error) {
        errores.push(error);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(tope, elementos.length) }, trabajador));

  if (errores.length > 0) {
    throw errores[0];
  }
}
