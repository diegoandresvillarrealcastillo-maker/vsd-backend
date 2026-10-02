/**
 * Puerto de salida hacia el proveedor de autenticacion.
 *
 * La identidad de cada persona —su correo y su contrasena— la guarda el
 * proveedor, no nosotros. Borrar una cuenta exige borrarla tambien alli: si
 * no, quedaria un registro con su correo en un sistema que ya no usa.
 */
export interface ProveedorDeIdentidadPort {
  /**
   * Borra la identidad en el proveedor.
   *
   * Si ya no existia, no es un error: el resultado buscado es que no exista.
   * Cualquier otro fallo se lanza, para que el borrado de los datos propios se
   * deshaga con el.
   */
  borrarIdentidad(idProveedorAuth: string): Promise<void>;
}
