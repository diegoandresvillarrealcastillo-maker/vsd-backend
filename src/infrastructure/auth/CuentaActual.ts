import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { User } from '../../domain/model/User.js';
import type { Identidad } from './VerificadorDeIdentidad.js';

/** Peticion HTTP despues de pasar por los dos guardias. */
export interface PeticionConCuenta {
  /** Quien dice el token que es. La pone `GuardiaDeSesion`. */
  identidad?: Identidad;
  /** Quien es aqui dentro. La pone `GuardiaDeCuenta`. */
  cuenta?: User;
}

/**
 * Entrega al controlador la cuenta de VSD Health de quien hace la peticion.
 *
 * Es lo que hay que usar siempre que haga falta un identificador para guardar
 * o consultar algo. La diferencia con `@UsuarioActual()` no es un matiz:
 *
 * - `@UsuarioActual()` da la identidad del **proveedor**. Sirve para saber
 *   quien se autentico, y para poco mas.
 * - `@CuentaActual()` da la cuenta **nuestra**, con nuestro `id_usuario`, que
 *   es el que apuntan las claves foraneas de `resultado` y `entrada_diario`.
 *
 * Confundirlos produce un fallo que no se ve en las pruebas unitarias y si en
 * cuanto hay una persona real: la base rechaza la fila porque el identificador
 * del proveedor no existe en la tabla `usuario`.
 */
export const CuentaActual = createParamDecorator((_dato: unknown, contexto: ExecutionContext) => {
  const peticion = contexto.switchToHttp().getRequest<PeticionConCuenta>();

  if (peticion.cuenta === undefined) {
    // Solo puede pasar si alguien usa este decorador en una ruta marcada con
    // @Publico() o con @SinCuenta(). Es un error de programacion, no una
    // peticion mal formada, y por eso se rompe fuerte en lugar de devolver
    // una respuesta enganosa.
    throw new Error(
      'No hay cuenta en la peticion. Este decorador solo funciona en rutas que exigen cuenta: ' +
        'quita el @Publico() o el @SinCuenta() de esta ruta, o usa @UsuarioActual() si lo que ' +
        'necesitas es la identidad del proveedor.',
    );
  }

  return peticion.cuenta;
});
