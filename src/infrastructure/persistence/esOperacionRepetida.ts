/**
 * Si el error es el de la clave unica de la operacion: dos peticiones con el mismo
 * `clientOperationId` de la misma persona que llegaron a la vez.
 *
 * Se mira por su forma, como en `PrismaUserRepository`, sin importar los tipos de error del
 * cliente. Con el adaptador de PostgreSQL de Prisma 7 no viene `meta.target`: el nombre del
 * indice llega dentro de `meta.driverAdapterError`. Se busca en toda la `meta` para que valga con
 * cualquiera de las dos formas.
 */
export function esOperacionRepetida(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const posible = error as { code?: unknown; meta?: unknown };

  return posible.code === 'P2002' && /operacion_?cliente/i.test(JSON.stringify(posible.meta ?? {}));
}
