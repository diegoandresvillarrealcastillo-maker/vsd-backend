/**
 * Las formas del contenido del catalogo (SCRUM-222 a SCRUM-224, ADR 0030 y 0031).
 *
 * El contenido de las 26 mecanicas se escribe aqui, como datos, y `generar.ts` lo convierte en las
 * migraciones que lo siembran. Asi una prueba puede recorrer cada sesion con el contrato de su motor, el
 * lenguaje clinico (R6) y la lista de exclusion (R14) **antes** de que llegue a una base, y el SQL no se
 * escribe a mano.
 *
 * Este archivo no importa nada del dominio a proposito: lo lee `node` directamente, sin compilar (ver
 * `generar.ts`), y el dominio usa las extensiones `.js` de TypeScript.
 */

export type Categoria = 'Cognición' | 'Bienestar' | 'Emociones';

/** `no_requiere`: la ficha no pide revision. `pendiente`: la pide y todavia no se hizo; no se publica. */
export type RevisionDeContenido = 'no_requiere' | 'pendiente';

export type DireccionDeEscala = 'mayor_es_mejor' | 'sin_puntaje';

export type FranjaDeContenido = 'manana' | 'tarde' | 'noche';

export interface TextosDeNivel {
  readonly favorable: string;
  readonly en_seguimiento: string;
  readonly requiere_atencion: string;
}

export type Parametros = Readonly<Record<string, unknown>>;

export interface SesionDeContenido {
  /** El identificador estable (uuid): el mismo en los tres ambientes. */
  readonly id: string;
  /** Nombre corto para la exportacion y la revision. No es lo que lee la persona al hacerla. */
  readonly titulo: string;
  readonly nivel: 1 | 2 | 3;
  readonly parametros: Parametros;
}

export interface MecanicaDeContenido {
  /** El codigo de las fichas: `COG-02`, `BIE-07`, `EMO-03`. */
  readonly codigo: string;
  readonly id: string;
  readonly categoria: Categoria;
  readonly nombre: string;
  readonly tipo: 'juego' | 'bitacora' | 'preguntas';
  readonly descripcion: string;
  readonly motor: string;
  readonly direccion: DireccionDeEscala;
  readonly maximo: number | null;
  readonly umbrales: { readonly primero: number; readonly segundo: number } | null;
  readonly textosNivel: TextosDeNivel | null;
  readonly franja?: FranjaDeContenido;
  readonly revision: RevisionDeContenido;
  /** Si sale publicada al sembrarse. Solo puede serlo lo que no pide revision. */
  readonly publicar: boolean;
  /** Las sesiones que se siembran con esta migracion (pueden ser menos que las de la mecanica si ya hay). */
  readonly sesiones: readonly SesionDeContenido[];
  /** Si la mecanica ya esta sembrada por una migracion anterior: solo se agregan sesiones. */
  readonly yaExiste?: boolean;
}

/** Un lote de contenido: lo que una migracion siembra. */
export interface Lote {
  /** El nombre de la carpeta de la migracion: `20261023120000_catalogo_de_cognicion`. */
  readonly migracion: string;
  readonly titulo: string;
  readonly categoria: Categoria;
  readonly mecanicas: readonly MecanicaDeContenido[];
}
