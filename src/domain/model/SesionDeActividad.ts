import { InvalidSessionConfigurationError } from './DomainError.js';
import type { ActivityId, SesionId } from './Identifier.js';

/**
 * Si el contenido de una sesion paso por una persona con formacion (ADR 0030, regla de Samuel del
 * 15/10/2026: lo que pide revision no sale hasta que alguien lo aprueba).
 *
 * - `no_requiere`: la ficha de la mecanica no pide revision profesional.
 * - `pendiente`: la pide y todavia no se hizo. **No se puede publicar.**
 * - `revisada`: la hizo alguien, y quedo dicho quien y cuando.
 */
export const Revision = {
  NO_REQUIERE: 'no_requiere',
  PENDIENTE: 'pendiente',
  REVISADA: 'revisada',
} as const;

export type Revision = (typeof Revision)[keyof typeof Revision];

/** Las tres, tal cual las acepta el CHECK de `sesion_de_actividad.revision`. */
export const REVISIONES: readonly Revision[] = Object.values(Revision);

/**
 * Lo que el motor necesita para pintar esta sesion: tamano, simbolos, guion, invitacion, pasos...
 *
 * Es JSON (ADR 0008). La base no mira dentro; este dominio comprueba que sea JSON de verdad y
 * ninguno mas. La forma de cada motor la fija el motor, y se valida con el en el ticket que lo
 * construye.
 */
export type ParametrosDeSesion = Readonly<Record<string, unknown>>;

const NIVEL_MINIMO = 1;
const NIVEL_MAXIMO = 3;
const LARGO_MAXIMO_DEL_TITULO = 100;
const LARGO_MAXIMO_DEL_REVISOR = 100;

/** Un correo o siete cifras seguidas (con a lo sumo un separador entre cada una). */
const DATO_DE_CONTACTO = /@|\d(?:[\s.-]?\d){6,}/u;

/** Datos necesarios para describir una sesion. */
export interface DatosDeSesion {
  readonly id: SesionId;
  /** La mecanica a la que pertenece. */
  readonly idActividad: ActivityId;
  /** Nombre corto, para la exportacion y la revision. No es lo que lee la persona al hacerla. */
  readonly titulo: string;
  /** Dificultad o profundidad, de 1 a 3, para las mecanicas que tienen niveles. */
  readonly nivel: number;
  readonly parametros: ParametrosDeSesion;
  /** Solo se sirven las publicadas. Retirar no borra (ADR 0025). */
  readonly publicado: boolean;
  readonly revision: Revision;
  /** Rol o nombre de quien reviso. Sin datos de contacto. */
  readonly revisadaPor?: string | undefined;
  readonly revisadaEl?: Date | undefined;
}

/**
 * El contenido de una vez de una mecanica (ADR 0030).
 *
 * Una actividad del catalogo es una mecanica; lo que cambia cada dia es su **sesion**. Una sesion no
 * es una actividad: no sale en el catalogo ni en el sendero como un elemento propio.
 *
 * Es inmutable. Una sesion revisada no se edita: si el texto cambia, se retira y se agrega otra con
 * otro identificador, que queda pendiente hasta que se revise. Asi el historial de una persona
 * siempre apunta al contenido que de verdad vio.
 */
export class SesionDeActividad {
  readonly id: SesionId;
  readonly idActividad: ActivityId;
  readonly titulo: string;
  readonly nivel: number;
  readonly parametros: ParametrosDeSesion;
  readonly publicado: boolean;
  readonly revision: Revision;
  readonly revisadaPor: string | undefined;
  readonly revisadaEl: Date | undefined;

  private constructor(
    datos: DatosDeSesion,
    titulo: string,
    parametros: ParametrosDeSesion,
    revisadaPor: string | undefined,
  ) {
    this.id = datos.id;
    this.idActividad = datos.idActividad;
    this.titulo = titulo;
    this.nivel = datos.nivel;
    this.parametros = parametros;
    this.publicado = datos.publicado;
    this.revision = datos.revision;
    this.revisadaPor = revisadaPor;
    this.revisadaEl = datos.revisadaEl === undefined ? undefined : new Date(datos.revisadaEl);
  }

  /**
   * Comprueba todo al crearla, como `Activity.create`: un contenido roto tiene que fallar al
   * cargarse y no cuando alguien ya esta haciendo la sesion.
   */
  static create(datos: DatosDeSesion): SesionDeActividad {
    const titulo = datos.titulo.trim();
    const etiqueta = titulo === '' ? '(sin título)' : titulo;

    if (titulo === '' || titulo.length > LARGO_MAXIMO_DEL_TITULO) {
      rechazar(etiqueta, `debe tener un título de 1 a ${LARGO_MAXIMO_DEL_TITULO} caracteres`);
    }

    if (
      !Number.isInteger(datos.nivel) ||
      datos.nivel < NIVEL_MINIMO ||
      datos.nivel > NIVEL_MAXIMO
    ) {
      rechazar(etiqueta, `tiene un nivel fuera del rango de ${NIVEL_MINIMO} a ${NIVEL_MAXIMO}`);
    }

    const parametros = copiarComoJson(datos.parametros);

    if (parametros === undefined) {
      rechazar(etiqueta, 'trae parámetros que no son un objeto JSON válido');
    }

    if (!REVISIONES.includes(datos.revision)) {
      rechazar(etiqueta, `tiene una revisión que no existe: "${String(datos.revision)}"`);
    }

    // Lo que pide revision y no la tiene no sale. La base lo impone tambien con un CHECK.
    if (datos.publicado && datos.revision === Revision.PENDIENTE) {
      rechazar(etiqueta, 'no se puede publicar mientras su revisión esté pendiente');
    }

    const revisadaPor = datos.revisadaPor?.trim();

    if (datos.revision === Revision.REVISADA) {
      if (revisadaPor === undefined || revisadaPor === '') {
        rechazar(etiqueta, 'está revisada pero no dice quién la revisó');
      }

      if (datos.revisadaEl === undefined || Number.isNaN(datos.revisadaEl.getTime())) {
        rechazar(etiqueta, 'está revisada pero no dice cuándo se revisó');
      }

      if (revisadaPor.length > LARGO_MAXIMO_DEL_REVISOR) {
        rechazar(
          etiqueta,
          `nombra a quien revisó con más de ${LARGO_MAXIMO_DEL_REVISOR} caracteres`,
        );
      }

      if (DATO_DE_CONTACTO.test(revisadaPor)) {
        rechazar(etiqueta, 'guarda datos de contacto de quien revisó: solo un rol o un nombre');
      }
    } else if (revisadaPor !== undefined || datos.revisadaEl !== undefined) {
      rechazar(etiqueta, 'trae constancia de una revisión que no hubo');
    }

    return new SesionDeActividad(datos, titulo, parametros, revisadaPor);
  }
}

function rechazar(titulo: string, motivo: string): never {
  throw new InvalidSessionConfigurationError(titulo, motivo);
}

/**
 * Una copia congelada de `valor` si es un objeto JSON de verdad; `undefined` si no.
 *
 * "De verdad" es lo que sobrevive a `JSON.stringify` sin cambiar ni perderse: objetos planos,
 * listas, textos, numeros finitos, booleanos y nulos. Una fecha, una funcion, `undefined`, `NaN` o
 * una referencia circular llegarian a la base cambiados o perdidos en silencio.
 */
function copiarComoJson(valor: unknown): ParametrosDeSesion | undefined {
  if (!esObjetoPlano(valor)) {
    return undefined;
  }

  return copiar(valor, new Set()) as ParametrosDeSesion | undefined;
}

function esObjetoPlano(valor: unknown): valor is Record<string, unknown> {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    return false;
  }

  const prototipo: unknown = Object.getPrototypeOf(valor);

  return prototipo === Object.prototype || prototipo === null;
}

function copiar(valor: unknown, ancestros: Set<object>): unknown {
  if (valor === null || typeof valor === 'string' || typeof valor === 'boolean') {
    return valor;
  }

  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : undefined;
  }

  const esLista = Array.isArray(valor);

  if (!esLista && !esObjetoPlano(valor)) {
    return undefined;
  }

  const objeto = valor as object;

  // Un objeto que se contiene a si mismo no se puede copiar ni guardar.
  if (ancestros.has(objeto)) {
    return undefined;
  }

  ancestros.add(objeto);

  try {
    if (esLista) {
      const copia: unknown[] = [];

      for (const elemento of valor as unknown[]) {
        const copiado = copiar(elemento, ancestros);

        if (copiado === undefined) {
          return undefined;
        }

        copia.push(copiado);
      }

      return Object.freeze(copia);
    }

    const copia: Record<string, unknown> = {};

    for (const [clave, elemento] of Object.entries(valor)) {
      const copiado = copiar(elemento, ancestros);

      if (copiado === undefined) {
        return undefined;
      }

      // defineProperty y no una asignacion: una clave "__proto__" (JSON.parse la crea como propia)
      // cambiaria el prototipo de la copia en lugar de guardarse.
      Object.defineProperty(copia, clave, {
        value: copiado,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }

    return Object.freeze(copia);
  } finally {
    ancestros.delete(objeto);
  }
}
