export interface OpcionesDelComando {
  /** Sin la marca `--aplicar` el comando solo informa. */
  readonly aplicar: boolean;
  /** La cadena de conexion pasada a mano; si falta se usa la del entorno. */
  readonly url: string | undefined;
}

const MARCA_PARA_APLICAR = '--aplicar';

/**
 * Lee lo que se escribio despues del nombre del comando.
 *
 * Una marca que no se conoce **se rechaza** en lugar de ignorarla: quien escribe
 * `--apply` cree que esta borrando, y recibir un simulacro sin un solo aviso lo
 * deja creyendo que la purga se hizo. Los mensajes no repiten la cadena de conexion,
 * que lleva la contrasena.
 */
export function leerLasOpcionesDeLaPurga(argumentos: readonly string[]): OpcionesDelComando {
  let aplicar = false;
  let url: string | undefined;

  for (const argumento of argumentos) {
    if (argumento === MARCA_PARA_APLICAR) {
      aplicar = true;
      continue;
    }

    if (argumento.startsWith('--')) {
      throw new Error(`La marca ${argumento} no existe. La unica valida es ${MARCA_PARA_APLICAR}.`);
    }

    if (url !== undefined) {
      throw new Error('Se pasaron dos cadenas de conexion. Deja una sola.');
    }

    url = argumento;
  }

  return { aplicar, url };
}
