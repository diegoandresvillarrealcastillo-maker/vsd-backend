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

  const { NODE_ENV, PORT, CORS_ORIGIN, DATABASE_URL } = resultado.data;

  return {
    ambiente: NODE_ENV,
    puerto: PORT,
    origenesAutorizados: CORS_ORIGIN.split(',')
      .map((origen) => origen.trim())
      .filter((origen) => origen.length > 0),
    esProduccion: NODE_ENV === Ambiente.PRODUCCION,
    urlBaseDeDatos: (DATABASE_URL ?? '').trim() === '' ? undefined : DATABASE_URL,
  };
}
