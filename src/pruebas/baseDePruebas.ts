/**
 * La base de datos a la que se les permite llegar a las pruebas de integracion (SCRUM-261).
 *
 * Esas pruebas insertan, borran y cambian la contrasena del rol `vsd_app`: no pueden tocar nada que
 * no sea una base desechable de esta maquina. De ahi dos reglas:
 *
 * - Se lee **solo** `TEST_DATABASE_URL`. `DATABASE_URL` es la de la aplicacion y en un `.env` puede
 *   apuntar a preproduccion; para estas pruebas no existe.
 * - El destino se comprueba **antes de construir ningun cliente**: tiene que ser esta maquina.
 *   Preproduccion y produccion estan en Supabase, y ninguna es `localhost`.
 *
 * No hay variable que levante la segunda regla, a proposito: una excepcion escrita para «un
 * momento» es la que acaba en el CI de otra persona.
 */
export class BaseDePruebasNoPermitidaError extends Error {
  /**
   * El mensaje no lleva la URL ni el servidor: la URL trae la contrasena, y el servidor dice a que
   * ambiente se estuvo a punto de llegar. Quien necesite saberlo mira su propia variable.
   */
  constructor(motivo: string) {
    super(
      `TEST_DATABASE_URL no es una base de pruebas permitida: ${motivo}. ` +
        'Las pruebas de integracion solo pueden usar una base de esta maquina (localhost, 127.0.0.1 o ::1).',
    );
    this.name = 'BaseDePruebasNoPermitidaError';
  }
}

const HOSTS_DE_ESTA_MAQUINA = new Set(['localhost', '127.0.0.1', '::1']);

/** Parametros de la URL con los que `pg` cambia de servidor aunque el de la URL sea local. */
const PARAMETROS_QUE_CAMBIAN_DE_SERVIDOR = ['host', 'hostaddr', 'service'];

/** Si `host` es esta maquina. Compara el nombre entero: `localhost.ejemplo.com` no lo es. */
export function esHostLocal(host: string): boolean {
  return HOSTS_DE_ESTA_MAQUINA.has(host.toLowerCase().replace(/^\[(.*)\]$/u, '$1'));
}

/**
 * La URL de la base de pruebas, o `undefined` si no hay una configurada (las suites se saltan, o
 * fallan si son obligatorias). Lanza `BaseDePruebasNoPermitidaError` si el destino no es local.
 */
export function urlDeLaBaseDePruebas(
  entorno: Readonly<Record<string, string | undefined>> = process.env,
): string | undefined {
  const url = entorno['TEST_DATABASE_URL']?.trim();

  if (url === undefined || url === '') {
    return undefined;
  }

  let partes: URL;

  try {
    partes = new URL(url);
  } catch {
    throw new BaseDePruebasNoPermitidaError('no es una URL');
  }

  if (!esHostLocal(partes.hostname)) {
    throw new BaseDePruebasNoPermitidaError('el servidor no es de esta maquina');
  }

  if (PARAMETROS_QUE_CAMBIAN_DE_SERVIDOR.some((nombre) => partes.searchParams.has(nombre))) {
    throw new BaseDePruebasNoPermitidaError('un parametro de la URL cambia el servidor');
  }

  return url;
}
