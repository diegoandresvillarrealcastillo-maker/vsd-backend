import type { DatoCuriosoDelDia } from '../../model/DatoCurioso.js';
import type { User } from '../../model/User.js';

/**
 * Puerto de entrada: el dato curioso de hoy para la cuenta propia (SCRUM-185).
 *
 * Es el mismo dato todo el dia, y distinto al del dia anterior hasta recorrer el catalogo
 * entero. El dato es `null` solo si no hay ningun dato publicado.
 *
 * Recibe la cuenta ya cargada y no su identificador: el dia sale de su zona horaria, y volver a
 * leerla en cada peticion seria una consulta de mas.
 */
export interface ConsultarDatoCuriosoUseCase {
  execute(cuenta: User): Promise<DatoCuriosoDelDia>;
}
