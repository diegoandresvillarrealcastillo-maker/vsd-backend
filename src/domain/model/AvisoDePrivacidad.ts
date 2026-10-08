/**
 * La version vigente del aviso de tratamiento de datos.
 *
 * Es la **unica** copia escrita a mano en todo el sistema. El frontend la pide
 * a `GET /api/aviso` antes de dar de alta la cuenta, y la coleccion de Postman
 * hace lo mismo. Antes habia tres valores para lo mismo —`2026-09-1` en el
 * frontend, `1.0` en Postman y otro `1.0` en el ejemplo del contrato— y eso
 * significaba que, segun por donde entrara alguien, quedaba registrado que
 * habia aceptado cosas distintas. Esta cadena es la prueba legal de a que dio
 * permiso cada persona (Ley 1581 de 2012), asi que no puede haber dos.
 *
 * Cuando el texto del aviso cambie, cambia esta cadena y nada mas. Las cuentas
 * existentes conservan la version con la que se crearon: eso es justamente lo
 * que documenta su consentimiento real.
 */
export const VERSION_VIGENTE_DEL_AVISO = '2026-09-1';

/** Si la version que trae alguien es la que esta vigente. */
export function esLaVersionVigente(version: string): boolean {
  return version.trim() === VERSION_VIGENTE_DEL_AVISO;
}

/**
 * La version vigente de los terminos y condiciones.
 *
 * Misma idea que la del aviso: una sola copia escrita a mano, que el frontend
 * pide a `GET /api/aviso` y que queda registrada con la fecha en que cada
 * persona la acepto. Se aceptan aparte del aviso de privacidad porque son dos
 * documentos distintos y cada uno cambia por su lado.
 *
 * La version cambia junto con el texto, que se publica en las paginas legales
 * del frontend (T-02 de la auditoria 360). Hasta entonces es provisional.
 */
export const VERSION_VIGENTE_DE_LOS_TERMINOS = '2026-10-1';

/** Si la version de los terminos que trae alguien es la que esta vigente. */
export function esLaVersionVigenteDeLosTerminos(version: string): boolean {
  return version.trim() === VERSION_VIGENTE_DE_LOS_TERMINOS;
}
