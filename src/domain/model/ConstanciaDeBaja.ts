import type { ConsentimientoAceptado } from './User.js';

/**
 * Lo único que queda de una cuenta que se dio de baja (SCRUM-190, ADR 0026).
 *
 * La Ley 1581 de 2012 pide poder demostrar que la persona autorizó el tratamiento de sus datos, y
 * eso no se puede demostrar si se borra la prueba junto con la cuenta. Pero la prueba no necesita
 * saber **quién** es: basta con qué se aceptó, qué versión y cuándo.
 *
 * Por eso esta constancia **no lleva** el nombre, el correo, la fecha de nacimiento ni nada de lo
 * que la persona escribió o hizo. Lleva:
 *
 * - el identificador que tuvo la cuenta (nuestro, sin significado fuera de aquí) y el que le dio
 *   el proveedor, que sirve para rechazar un token que todavía no caducó;
 * - cuándo se creó la cuenta y cuándo se dio de baja;
 * - todo lo que aceptó, versión por versión.
 */
export interface ConstanciaDeBaja {
  readonly idCuenta: string;
  /** El identificador que el proveedor le dio a la identidad que ya no existe. */
  readonly idProveedorAuth: string;
  readonly registradaEn: Date;
  readonly inactivadaEl: Date;
  readonly consentimientos: readonly ConsentimientoAceptado[];
}
