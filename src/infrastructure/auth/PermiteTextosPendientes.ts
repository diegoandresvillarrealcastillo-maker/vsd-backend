import { SetMetadata } from '@nestjs/common';

export const PERMITE_TEXTOS_PENDIENTES = 'vsd:permite-textos-pendientes';

/**
 * Marca una ruta a la que puede entrar una cuenta que tiene que volver a aceptar el aviso de
 * privacidad o los terminos porque cambiaron (SCRUM-237).
 *
 * Todas las demas rutas la rechazan con 403 `TEXTOS_PENDIENTES_DE_ACEPTAR`. Es **solo** la ruta que
 * registra la aceptacion: sin ella nadie podria aceptar, y sin aceptar no se podria usar nada.
 *
 * Es distinta de `@PermiteRegistroIncompleto()` a proposito. Esa deja entrar tambien a quien no ha
 * declarado su edad, y aceptar un texto no sustituye a declararla: esta ruta sigue exigiendo el
 * registro completo. Lo que no se le puede negar a nadie —ver, exportar y borrar la cuenta— lleva
 * la otra marca y entra tambien con textos pendientes.
 *
 * Si hay duda, no se pone: lo seguro de una ruta nueva es que exija estar al dia.
 */
export const PermiteTextosPendientes = (): MethodDecorator & ClassDecorator =>
  SetMetadata(PERMITE_TEXTOS_PENDIENTES, true);
