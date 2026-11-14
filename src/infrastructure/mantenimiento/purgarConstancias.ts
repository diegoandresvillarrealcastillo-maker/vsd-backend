import type { Client } from 'pg';

/**
 * Cuantos anos se conserva la constancia de una cuenta dada de baja (ADR 0026).
 *
 * Es lo que el aviso de privacidad le promete a la persona («tras lo cual se
 * elimina»). Si este numero cambia, cambia ese texto y su version, y al reves.
 */
export const ANIOS_DE_CONSERVACION_DE_LA_CONSTANCIA = 10;

/** Lo que la purga hizo, o hubiera hecho si fue un simulacro. */
export interface InformeDeLaPurga {
  /** Se borra lo dado de baja **antes** de este instante. */
  readonly limite: Date;
  readonly cuentas: number;
  readonly consentimientos: number;
  readonly aplicada: boolean;
}

export interface OpcionesDeLaPurga {
  readonly ahora: Date;
  /** Sin `true` solo cuenta lo que borraria: la base no recibe ninguna escritura. */
  readonly aplicar: boolean;
}

/**
 * El rol con el que se conecto no puede saltarse las politicas de seguridad por fila.
 *
 * Las constancias tienen RLS forzado y ninguna politica de borrado, asi que con un
 * rol normal el `DELETE` **no falla: borra cero filas**. Es el peor resultado
 * posible para una purga, porque parece que funciono. Por eso se comprueba antes de
 * empezar y se detiene con un mensaje que dice que hacer.
 */
export class SinPermisoParaLaPurgaError extends Error {
  constructor(rol: string) {
    super(
      `El rol "${rol}" no puede saltarse las politicas de seguridad por fila, y sin eso ` +
        'la purga no borraria nada sin avisar. Conectate con el rol de mantenimiento ' +
        '(el dueno de las tablas, la cadena DIRECT_URL), no con el de la aplicacion.',
    );
    this.name = 'SinPermisoParaLaPurgaError';
  }
}

/**
 * Borra las constancias de baja que cumplieron su plazo de conservacion (SCRUM-236).
 *
 * Una cuenta se purga cuando se dio de baja hace **mas** de 10 anos: la que cumple el
 * plazo exacto hoy se conserva un dia mas, nunca uno menos. Se borran sus
 * consentimientos y despues la cuenta, todo o nada en una sola transaccion.
 *
 * Solo lo puede hacer el rol de mantenimiento: la aplicacion no tiene permiso de
 * borrado sobre las constancias, y eso no cambia (ADR 0026). La herramienta no corre
 * sola en ningun ambiente; la ejecuta una persona.
 *
 * @param cliente Una conexion ya abierta con el rol de mantenimiento.
 */
export async function purgarConstancias(
  cliente: Pick<Client, 'query'>,
  opciones: OpcionesDeLaPurga,
): Promise<InformeDeLaPurga> {
  const { rows: roles } = await cliente.query<{ rol: string; puede: boolean }>(
    `SELECT r.rolname AS rol, (r.rolsuper OR r.rolbypassrls) AS puede
       FROM pg_roles r
      WHERE r.rolname = current_user`,
  );
  const rol = roles[0];

  if (rol === undefined || !rol.puede) {
    throw new SinPermisoParaLaPurgaError(rol?.rol ?? 'desconocido');
  }

  // El simulacro abre la transaccion de solo lectura: no es que no escriba porque el
  // codigo se porte bien, es que la base no se lo permitiria.
  await cliente.query(opciones.aplicar ? 'BEGIN' : 'BEGIN READ ONLY');

  try {
    // La cuenta de los anos la hace PostgreSQL y en UTC: asi el 29 de febrero de 2036
    // resta al 28 de febrero de 2026 y no al 1 de marzo, y la constancia no se borra un
    // dia antes por un ano bisiesto.
    const { rows: limites } = await cliente.query<{ limite: Date }>(
      `SELECT (($1::timestamptz AT TIME ZONE 'UTC') - make_interval(years => $2::int))
              AT TIME ZONE 'UTC' AS limite`,
      [opciones.ahora, ANIOS_DE_CONSERVACION_DE_LA_CONSTANCIA],
    );
    const limite = limites[0]?.limite;

    if (limite === undefined) {
      throw new Error('PostgreSQL no devolvio el limite de conservacion.');
    }

    const { rows: cuentas } = await cliente.query<{ n: number }>(
      'SELECT count(*)::int AS n FROM cuenta_inactiva WHERE inactivada_el < $1',
      [limite],
    );
    const { rows: consentimientos } = await cliente.query<{ n: number }>(
      `SELECT count(*)::int AS n
         FROM consentimiento_de_cuenta_inactiva
        WHERE id_cuenta IN (SELECT id_cuenta FROM cuenta_inactiva WHERE inactivada_el < $1)`,
      [limite],
    );

    if (opciones.aplicar) {
      await cliente.query(
        `DELETE FROM consentimiento_de_cuenta_inactiva
          WHERE id_cuenta IN (SELECT id_cuenta FROM cuenta_inactiva WHERE inactivada_el < $1)`,
        [limite],
      );
      await cliente.query('DELETE FROM cuenta_inactiva WHERE inactivada_el < $1', [limite]);
    }

    await cliente.query('COMMIT');

    return {
      limite,
      cuentas: cuentas[0]?.n ?? 0,
      consentimientos: consentimientos[0]?.n ?? 0,
      aplicada: opciones.aplicar,
    };
  } catch (error) {
    await cliente.query('ROLLBACK');

    throw error;
  }
}
