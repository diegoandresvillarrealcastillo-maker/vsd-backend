/**
 * Los hechos de seguridad que quedan registrados (SCRUM-163).
 *
 * ## Un catalogo cerrado, a proposito
 *
 * Un registro de seguridad sirve para reconstruir un incidente: quien borro su
 * cuenta, quien se llevo sus datos, quien probo tokens falsos. Si cada quien
 * escribe lo que quiere, acaba lleno de texto libre donde un dia alguien pega
 * un correo, y el registro que debia proteger a las personas pasa a exponerlas.
 *
 * Por eso aqui no hay mensajes: hay **tipos**, y cada tipo declara los unicos
 * campos que lleva. Lo que no esta en la lista no se puede escribir, y el
 * adaptador lo vuelve a comprobar en tiempo de ejecucion.
 *
 * ## Que nunca lleva
 *
 * Ningun evento lleva correo, nombre, fecha de nacimiento, contenido del
 * diario, resultados, tokens ni la IP en claro. La persona se identifica con su
 * identificador interno (un UUID sin significado fuera de la base) y el origen
 * con una huella de la IP que calcula el adaptador.
 */

/** Por que se rechazo un token. Solo dos: distinguir mas ayudaria a quien prueba. */
export type MotivoDeTokenRechazado = 'TOKEN_INVALIDO' | 'VERIFICACION_NO_DISPONIBLE';

/**
 * Los codigos de error que cuentan como «archivo peligroso rechazado»: alguien
 * subio algo que no es lo que dice ser, o que trae algo que no debe. Los demas
 * motivos de rechazo (demasiado pesado, demasiado complejo) son descuidos y no
 * se registran aqui.
 */
export const CODIGOS_DE_ARCHIVO_PELIGROSO = [
  'FOTO_TIPO_NO_PERMITIDO',
  'FOTO_NO_ES_UNA_IMAGEN',
  'MASCOTA_SVG_TIPO_NO_PERMITIDO',
  'MASCOTA_SVG_NO_ES_UN_SVG',
  'MASCOTA_SVG_PELIGROSO',
] as const;

export type CodigoDeArchivoPeligroso = (typeof CODIGOS_DE_ARCHIVO_PELIGROSO)[number];

/** Si un codigo de error del dominio es de los que se registran como archivo peligroso. */
export function esArchivoPeligroso(codigo: string): codigo is CodigoDeArchivoPeligroso {
  return (CODIGOS_DE_ARCHIVO_PELIGROSO as readonly string[]).includes(codigo);
}

/**
 * De donde viene la peticion. Lo pone quien registra; el adaptador convierte la
 * IP en una huella antes de escribir nada.
 */
export interface ContextoDeLaPeticion {
  /** El `x-request-id` que genera el servidor: une el evento con la linea de la peticion. */
  readonly idPeticion?: string;
  /** La IP tal como la ve Express. **Nunca se escribe**: solo su huella. */
  readonly ip?: string;
}

export type EventoDeSeguridad = ContextoDeLaPeticion &
  (
    | { readonly tipo: 'CUENTA_BORRADA'; readonly idUsuario: string }
    | { readonly tipo: 'DATOS_EXPORTADOS'; readonly idUsuario: string }
    | {
        readonly tipo: 'PERMISO_DEL_DIARIO_CAMBIADO';
        readonly idUsuario: string;
        readonly activado: boolean;
      }
    | { readonly tipo: 'TOKEN_RECHAZADO'; readonly motivo: MotivoDeTokenRechazado }
    | {
        readonly tipo: 'CUENTA_NO_REGISTRADA';
        /** El identificador de la identidad en el proveedor: un UUID sin correo. */
        readonly idProveedor: string;
      }
    | {
        readonly tipo: 'ARCHIVO_PELIGROSO_RECHAZADO';
        readonly idUsuario: string;
        readonly motivo: CodigoDeArchivoPeligroso;
      }
  );

export type TipoDeEventoDeSeguridad = EventoDeSeguridad['tipo'];

/**
 * Los campos que cada tipo puede escribir, ademas de los comunes. Es la
 * segunda cerradura: aunque alguien le pase al adaptador un objeto con mas
 * cosas (por descuido o por un `as`), lo que no figura aqui se descarta.
 */
export const CAMPOS_POR_TIPO: Readonly<Record<TipoDeEventoDeSeguridad, readonly string[]>> = {
  CUENTA_BORRADA: ['idUsuario'],
  DATOS_EXPORTADOS: ['idUsuario'],
  PERMISO_DEL_DIARIO_CAMBIADO: ['idUsuario', 'activado'],
  TOKEN_RECHAZADO: ['motivo'],
  CUENTA_NO_REGISTRADA: ['idProveedor'],
  ARCHIVO_PELIGROSO_RECHAZADO: ['idUsuario', 'motivo'],
};
