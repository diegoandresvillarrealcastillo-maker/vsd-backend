import { SetMetadata } from '@nestjs/common';

export const PERMITE_REGISTRO_INCOMPLETO = 'vsd:permite-registro-incompleto';

/**
 * Marca una ruta a la que puede entrar una cuenta que aun no completo su
 * registro (su fecha de nacimiento y la aceptacion del aviso y de los terminos).
 *
 * Todas las demas rutas la rechazan con 403 `REGISTRO_INCOMPLETO`. Las que la
 * llevan son las que no se le pueden negar a nadie:
 *
 * - **Consultar la cuenta**, para saber que le falta.
 * - **Exportar** y **borrar** sus datos: son derechos (Ley 1581 de 2012) y no
 *   dependen de haber aceptado nada. Quien no quiere completar el registro
 *   tiene que poder irse y llevarse lo suyo.
 *
 * Si hay duda, no se pone: lo seguro de una ruta nueva es que exija el registro
 * completo.
 */
export const PermiteRegistroIncompleto = (): MethodDecorator & ClassDecorator =>
  SetMetadata(PERMITE_REGISTRO_INCOMPLETO, true);
