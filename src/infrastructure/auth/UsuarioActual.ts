import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Identidad } from './VerificadorDeIdentidad.js';

/** Peticion HTTP despues de que el guardia haya verificado el token. */
export interface PeticionConIdentidad {
  identidad?: Identidad;
}

/**
 * Entrega al controlador la identidad de quien hace la peticion.
 *
 * Es la unica forma en que un controlador debe saber de quien es una
 * peticion. La alternativa —recibir el identificador en el cuerpo— es lo que
 * tenia esta API antes del ticket SCRUM-66, y significaba que cualquiera
 * podia escribir el identificador de otra persona y la API lo creia.
 *
 * Lo que llega aqui no lo eligio el cliente: salio de un token que Supabase
 * firmo y que este servidor comprobo.
 */
export const UsuarioActual = createParamDecorator((_dato: unknown, contexto: ExecutionContext) => {
  const peticion = contexto.switchToHttp().getRequest<PeticionConIdentidad>();

  if (peticion.identidad === undefined) {
    // Solo puede pasar si alguien usa este decorador en una ruta marcada como
    // publica. Es un error de programacion, no una peticion mal formada, y
    // por eso se rompe fuerte en lugar de devolver un 401 enganoso.
    throw new Error(
      'No hay identidad en la peticion. Este decorador solo funciona en rutas protegidas: ' +
        'quita el @Publico() de esta ruta o deja de pedir el usuario actual en ella.',
    );
  }

  return peticion.identidad;
});
