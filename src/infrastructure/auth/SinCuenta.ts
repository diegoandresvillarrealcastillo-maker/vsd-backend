import { SetMetadata } from '@nestjs/common';

export const NO_EXIGE_CUENTA = 'vsd:no-exige-cuenta';

/**
 * Marca una ruta a la que se puede llegar con un token valido pero **sin
 * tener todavia cuenta** en VSD Health.
 *
 * Hoy la lleva una sola ruta: el alta. Tiene que ser asi por definicion, porque
 * es la que crea la cuenta que las demas exigen; sin esta marca, dar de alta
 * requeriria estar ya dado de alta.
 *
 * Es distinto de `@Publico()`. Una ruta publica no pide nada; esta si exige un
 * token verificado, y lo unico que no exige es que exista la cuenta detras.
 */
export const SinCuenta = (): MethodDecorator & ClassDecorator => SetMetadata(NO_EXIGE_CUENTA, true);
