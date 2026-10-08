import { z } from 'zod';

/**
 * Esquema de la configuracion del servicio.
 *
 * El servicio se niega a arrancar si algo falta o esta mal. Es preferible
 * fallar en el arranque, con un mensaje que dice exactamente que variable
 * esta mal, que arrancar y romperse mas tarde con un error confuso.
 *
 * Es el factor "configuracion" de los doce factores: el mismo codigo corre en
 * los tres ambientes y lo unico que cambia son estos valores.
 * Ver docs/ambientes.md
 */

export const Ambiente = {
  DESARROLLO: 'development',
  PREPRODUCCION: 'preproduction',
  PRODUCCION: 'production',
  PRUEBAS: 'test',
} as const;

export type Ambiente = (typeof Ambiente)[keyof typeof Ambiente];

/** Direcciones que cuentan como la propia maquina, las unicas donde se tolera `http`. */
const MAQUINA_LOCAL = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Las variables del registro de seguridad van juntas o no van, y la direccion
 * tiene que ser segura: lo que se manda ahi son hechos de seguridad con
 * identificadores de personas, y una clave de autorizacion.
 */
function validarElRegistroDeSeguridad(
  valores: {
    NODE_ENV: string;
    REGISTRO_SEGURIDAD_URL?: string | undefined;
    REGISTRO_SEGURIDAD_TOKEN?: string | undefined;
    REGISTRO_SEGURIDAD_CABECERA?: string | undefined;
    REGISTRO_SEGURIDAD_CLAVE_IP?: string | undefined;
  },
  ctx: z.RefinementCtx,
): void {
  const url = valores.REGISTRO_SEGURIDAD_URL ?? '';

  if (url === '') {
    for (const nombre of ['REGISTRO_SEGURIDAD_TOKEN', 'REGISTRO_SEGURIDAD_CABECERA'] as const) {
      if ((valores[nombre] ?? '') !== '') {
        ctx.addIssue({
          code: 'custom',
          path: [nombre],
          message: 'Solo tiene sentido junto con REGISTRO_SEGURIDAD_URL.',
        });
      }
    }
  } else if (!URL.canParse(url)) {
    ctx.addIssue({
      code: 'custom',
      path: ['REGISTRO_SEGURIDAD_URL'],
      message: 'Debe ser una URL completa, como https://registros.ejemplo.co/ingesta',
    });
  } else {
    const direccion = new URL(url);
    const esLocal = MAQUINA_LOCAL.has(direccion.hostname);
    const aceptaHttp = esLocal && valores.NODE_ENV !== Ambiente.PRODUCCION;

    if (direccion.protocol !== 'https:' && !(direccion.protocol === 'http:' && aceptaHttp)) {
      ctx.addIssue({
        code: 'custom',
        path: ['REGISTRO_SEGURIDAD_URL'],
        message:
          'Debe empezar por https://. Los hechos de seguridad no viajan sin cifrar (solo se tolera http en la propia maquina, fuera de produccion).',
      });
    }

    if (direccion.username !== '' || direccion.password !== '') {
      ctx.addIssue({
        code: 'custom',
        path: ['REGISTRO_SEGURIDAD_URL'],
        message:
          'No debe llevar usuario ni contrasena dentro de la direccion: usa REGISTRO_SEGURIDAD_TOKEN.',
      });
    }
  }

  const cabecera = valores.REGISTRO_SEGURIDAD_CABECERA ?? '';

  if (cabecera !== '' && !/^[A-Za-z0-9-]+$/.test(cabecera)) {
    ctx.addIssue({
      code: 'custom',
      path: ['REGISTRO_SEGURIDAD_CABECERA'],
      message: 'Solo letras, numeros y guiones, como Authorization o DD-API-KEY.',
    });
  }

  const claveDeIp = valores.REGISTRO_SEGURIDAD_CLAVE_IP ?? '';

  if (claveDeIp !== '' && claveDeIp.length < 16) {
    ctx.addIssue({
      code: 'custom',
      path: ['REGISTRO_SEGURIDAD_CLAVE_IP'],
      message: 'Debe tener al menos 16 caracteres; una clave corta se adivina.',
    });
  }
}

const esquema = z
  .object({
    NODE_ENV: z
      .enum([Ambiente.DESARROLLO, Ambiente.PREPRODUCCION, Ambiente.PRODUCCION, Ambiente.PRUEBAS])
      .default(Ambiente.DESARROLLO),

    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    // Origenes autorizados para CORS, separados por coma.
    CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN es obligatoria'),

    // Conexion a PostgreSQL. Opcional en desarrollo y pruebas, donde el
    // adaptador en memoria alcanza y es mucho mas rapido.
    DATABASE_URL: z.string().optional(),

    // URL del proyecto de Supabase. De ella sale la direccion donde estan
    // publicadas las claves con las que se comprueba la firma de cada token.
    //
    // Es obligatoria en los cuatro ambientes, a diferencia de DATABASE_URL.
    // Permitir que faltara en desarrollo significaria tener un ambiente donde
    // la API no comprueba quien llama, y es justo el ambiente en el que se
    // trabaja todos los dias: el hueco pasaria de ser una excepcion a ser la
    // costumbre.
    //
    // No es un secreto. Es la direccion publica del proyecto, la misma que ya
    // conoce el navegador de cualquiera que use la aplicacion.
    SUPABASE_URL: z
      .string()
      .min(1, 'SUPABASE_URL es obligatoria')
      .refine((valor) => URL.canParse(valor), {
        message: 'Debe ser una URL completa, como https://abcdefgh.supabase.co',
      }),

    // Clave de servicio de Supabase. Se usa para una sola cosa: borrar la
    // identidad de quien borra su cuenta (SCRUM-75). Salta todas las
    // politicas, asi que nunca se usa para leer ni escribir datos.
    //
    // Obligatoria en preproduccion y produccion: sin ella, borrar una cuenta
    // dejaria el correo de esa persona en Supabase, y el derecho de supresion
    // quedaria a medias sin que nadie se enterara. En local es opcional.
    SUPABASE_SERVICE_ROLE_KEY: z.string().trim().optional(),

    // Claves VAPID para los avisos por Web Push (SCRUM-102). Las tres juntas o
    // ninguna. Sin ellas no hay avisos y todo lo demas funciona igual, por eso
    // no son obligatorias en ningun ambiente: se pueden poner despues de
    // desplegar. La privada es un secreto: vive en el panel del servicio,
    // nunca en el repositorio. Se generan con `npm run vapid:generar`.
    VAPID_PUBLIC_KEY: z.string().trim().optional(),
    VAPID_PRIVATE_KEY: z.string().trim().optional(),
    // Un contacto para los servicios de push: mailto: o https:.
    VAPID_SUBJECT: z.string().trim().optional(),

    // Registro de seguridad (SCRUM-163, decision D8). Los hechos de seguridad
    // siempre salen por la salida estandar, que es lo que Render conserva. Si
    // ademas se quiere una copia en un servicio externo de registros con
    // retencion de 90 dias, una persona pone aqui su direccion y su clave. Todo
    // opcional: sin esto, el servicio funciona igual.
    REGISTRO_SEGURIDAD_URL: z.string().trim().optional(),
    // El valor completo de la cabecera de autorizacion, como lo pide el
    // servicio (por ejemplo `Bearer abc123`). Es un secreto.
    REGISTRO_SEGURIDAD_TOKEN: z.string().trim().optional(),
    // El nombre de esa cabecera si no es `Authorization`.
    REGISTRO_SEGURIDAD_CABECERA: z.string().trim().optional(),
    // La clave con la que se calcula la huella de las IP. Un secreto: con ella
    // alguien podria comprobar si una IP concreta aparece en el registro. Sin
    // ella se usa una clave al azar por arranque, y las huellas no se pueden
    // comparar entre un despliegue y otro.
    REGISTRO_SEGURIDAD_CLAVE_IP: z.string().trim().optional(),
  })
  .superRefine((valores, ctx) => {
    // El comodin solo se tolera mientras se desarrolla en local. Dejarlo en
    // preproduccion o produccion permitiria que cualquier sitio web llamara a
    // la API desde el navegador de un usuario con sesion iniciada.
    if (valores.CORS_ORIGIN.includes('*') && valores.NODE_ENV !== Ambiente.DESARROLLO) {
      ctx.addIssue({
        code: 'custom',
        path: ['CORS_ORIGIN'],
        message: `El comodin solo se permite con NODE_ENV=${Ambiente.DESARROLLO}. Indica los dominios exactos separados por coma.`,
      });
    }

    // Sin base de datos el servicio guarda en memoria, y al reiniciarse no
    // queda nada. En desarrollo eso es comodo; en preproduccion o produccion
    // seria perder los resultados de personas reales sin que nadie se entere
    // hasta que alguien pregunte por su historial. Mejor no arrancar.
    const necesitaBase =
      valores.NODE_ENV === Ambiente.PREPRODUCCION || valores.NODE_ENV === Ambiente.PRODUCCION;

    if (necesitaBase && (valores.SUPABASE_SERVICE_ROLE_KEY ?? '') === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['SUPABASE_SERVICE_ROLE_KEY'],
        message: `Es obligatoria con NODE_ENV=${valores.NODE_ENV}. Sin ella, borrar una cuenta dejaria la identidad de esa persona en Supabase.`,
      });
    }

    // Una clave VAPID suelta es un error de configuracion, no "sin avisos":
    // quien la puso queria avisos y no los tendria sin enterarse.
    const vapid = [valores.VAPID_PUBLIC_KEY, valores.VAPID_PRIVATE_KEY, valores.VAPID_SUBJECT];
    const vapidPuestas = vapid.filter((valor) => (valor ?? '') !== '').length;

    if (vapidPuestas > 0 && vapidPuestas < vapid.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['VAPID_PUBLIC_KEY'],
        message:
          'VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY y VAPID_SUBJECT van las tres juntas o ninguna.',
      });
    }

    if (
      (valores.VAPID_SUBJECT ?? '') !== '' &&
      !/^(mailto:|https:\/\/)/.test(valores.VAPID_SUBJECT ?? '')
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['VAPID_SUBJECT'],
        message: 'Debe empezar por mailto: o https://, como mailto:soporte@ejemplo.co',
      });
    }

    validarElRegistroDeSeguridad(valores, ctx);

    if (necesitaBase && (valores.DATABASE_URL ?? '').trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: `Es obligatoria con NODE_ENV=${valores.NODE_ENV}. Sin ella el servicio guardaria en memoria y perderia los datos al reiniciarse.`,
      });
    }
  });

export interface Configuracion {
  readonly ambiente: Ambiente;
  readonly puerto: number;
  readonly origenesAutorizados: readonly string[];
  readonly esProduccion: boolean;
  /**
   * Conexion a PostgreSQL. Ausente solo en desarrollo y pruebas, donde el
   * servicio usa el adaptador en memoria.
   */
  readonly urlBaseDeDatos: string | undefined;
  /**
   * URL base del proyecto de Supabase, sin barra final.
   *
   * De aqui salen el emisor que se exige en cada token y la direccion del
   * JWKS. Ver `VerificadorDeIdentidad`.
   */
  readonly urlDeSupabase: string;
  /**
   * Clave de servicio de Supabase, solo para borrar identidades. Ausente en
   * local, donde el borrado no toca Supabase.
   */
  readonly claveDeServicioDeSupabase: string | undefined;
  /** Claves para los avisos por Web Push. Ausentes, no hay avisos (SCRUM-102). */
  readonly vapid: ClavesVapid | undefined;
  /** Registro de eventos de seguridad (SCRUM-163). */
  readonly registroDeSeguridad: AjustesDelRegistroDeSeguridad;
}

export interface AjustesDelRegistroDeSeguridad {
  /**
   * La copia por HTTP en un servicio externo de registros. Ausente, los eventos
   * solo salen por la salida estandar.
   */
  readonly envio:
    | {
        readonly url: string;
        readonly token: string | undefined;
        readonly cabecera: string | undefined;
      }
    | undefined;
  /** La clave de la huella de las IP. Ausente, se usa una al azar por arranque. */
  readonly claveDeIp: string | undefined;
}

export interface ClavesVapid {
  readonly publica: string;
  readonly privada: string;
  readonly contacto: string;
}

/**
 * Valida las variables recibidas y devuelve la configuracion del servicio.
 *
 * Si algo falla lanza un error que enumera las variables problematicas.
 * **Nunca incluye el valor recibido**: podria ser una credencial y acabaria
 * impreso en el registro del despliegue.
 */
export function validarConfiguracion(variables: Record<string, unknown>): Configuracion {
  const resultado = esquema.safeParse(variables);

  if (!resultado.success) {
    const problemas = resultado.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(raiz)'}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `La configuracion del servicio no es valida y no se puede arrancar:\n${problemas}\n\n` +
        'Revisa tu archivo .env contra .env.example.',
    );
  }

  const {
    NODE_ENV,
    PORT,
    CORS_ORIGIN,
    DATABASE_URL,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
    VAPID_SUBJECT,
    REGISTRO_SEGURIDAD_URL,
    REGISTRO_SEGURIDAD_TOKEN,
    REGISTRO_SEGURIDAD_CABECERA,
    REGISTRO_SEGURIDAD_CLAVE_IP,
  } = resultado.data;

  return {
    ambiente: NODE_ENV,
    puerto: PORT,
    origenesAutorizados: CORS_ORIGIN.split(',')
      .map((origen) => origen.trim())
      .filter((origen) => origen.length > 0),
    esProduccion: NODE_ENV === Ambiente.PRODUCCION,
    urlBaseDeDatos: (DATABASE_URL ?? '').trim() === '' ? undefined : DATABASE_URL,
    // La barra final se quita aqui y no en cada sitio que use el valor: si un
    // .env la trae, la URL del JWKS acabaria con una barra doble.
    urlDeSupabase: SUPABASE_URL.trim().replace(/\/+$/, ''),
    claveDeServicioDeSupabase:
      (SUPABASE_SERVICE_ROLE_KEY ?? '') === '' ? undefined : SUPABASE_SERVICE_ROLE_KEY,
    vapid:
      (VAPID_PUBLIC_KEY ?? '') === ''
        ? undefined
        : {
            publica: VAPID_PUBLIC_KEY ?? '',
            privada: VAPID_PRIVATE_KEY ?? '',
            contacto: VAPID_SUBJECT ?? '',
          },
    registroDeSeguridad: {
      envio:
        (REGISTRO_SEGURIDAD_URL ?? '') === ''
          ? undefined
          : {
              url: REGISTRO_SEGURIDAD_URL ?? '',
              token: (REGISTRO_SEGURIDAD_TOKEN ?? '') === '' ? undefined : REGISTRO_SEGURIDAD_TOKEN,
              cabecera:
                (REGISTRO_SEGURIDAD_CABECERA ?? '') === ''
                  ? undefined
                  : REGISTRO_SEGURIDAD_CABECERA,
            },
      claveDeIp:
        (REGISTRO_SEGURIDAD_CLAVE_IP ?? '') === '' ? undefined : REGISTRO_SEGURIDAD_CLAVE_IP,
    },
  };
}
