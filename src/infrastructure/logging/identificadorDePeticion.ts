import { randomUUID } from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

/**
 * El identificador con el que se puede encontrar una peticion en los registros.
 *
 * Existe para una conversacion concreta: alguien dice "me fallo" y no sabe decir
 * mas. Con este codigo en la pantalla se puede buscar **su** peticion entre
 * todas las demas sin pedirle nada suyo.
 *
 * Por eso se le puede ensenar: no contiene nada de la persona. Es un UUID que
 * no dice ni quien es, ni que pidio, ni desde donde.
 */
export const CABECERA_DE_PETICION = 'x-request-id';

/**
 * Pone `x-request-id` en la respuesta.
 *
 * ## Se genera siempre, y nunca se reutiliza el que llega
 *
 * Es tentador reutilizar el `x-request-id` que manda el cliente o un proxy:
 * permitiria seguir una peticion desde el navegador hasta aqui. Se decidio no
 * hacerlo, por dos motivos que pesan mas que esa comodidad.
 *
 * El primero es **inyeccion de registros**. Este identificador acaba escrito en
 * el registro del servidor. Un valor con saltos de linea dentro permitiria
 * fabricar entradas falsas, y convertiria la unica fuente de verdad sobre lo
 * que paso en algo escribible desde fuera. Se podria validar la forma, pero eso
 * solo cierra la parte que se nos ocurra prohibir.
 *
 * El segundo es la regla que ya sigue `RequestLoggingInterceptor`: **en el
 * registro no entra ningun dato personal ni de salud**, porque esos registros
 * los lee el personal del proveedor de despliegue y acaban en sistemas de
 * indexacion. Un identificador que elige el cliente es un campo libre que
 * nosotros escribimos en el registro sin saber que trae. Basta un cliente
 * descuidado que ponga ahi un correo para que la regla se rompa, y el fallo no
 * seria nuestro pero la fuga si.
 *
 * Generarlo siempre cuesta nada y cierra las dos cosas de una vez. Lo que se
 * pierde es correlacionar con un identificador ajeno, que hoy nadie usa.
 *
 * ## Va primero en la cadena
 *
 * Antes incluso del limite de peticiones, para que hasta un 429 salga con su
 * identificador. Un error sin identificador es justamente el que nadie puede
 * rastrear despues.
 *
 * No registra nada por su cuenta: anotar una linea por peticion aqui duplicaria
 * lo que ya hace el interceptor. Quienes lo necesitan lo leen de la respuesta.
 */
export function identificadorDePeticion() {
  return function anotarElIdentificador(
    _peticion: Request,
    respuesta: Response,
    siguiente: NextFunction,
  ): void {
    respuesta.setHeader(CABECERA_DE_PETICION, randomUUID());

    siguiente();
  };
}

/**
 * Lee el identificador que lleva la respuesta.
 *
 * Se lee de la respuesta y no de la peticion a proposito: en la respuesta esta
 * el que generamos nosotros. En la peticion estaria el que mando el cliente,
 * que es justamente el que no se usa.
 */
export function identificadorDeLaRespuesta(respuesta: Response): string | undefined {
  const valor = respuesta.getHeader(CABECERA_DE_PETICION);

  return typeof valor === 'string' ? valor : undefined;
}
