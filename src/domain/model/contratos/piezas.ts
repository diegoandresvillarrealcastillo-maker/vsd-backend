/**
 * Las piezas pequenas con las que se arma el contrato de `parametros` de cada motor (ADR 0030,
 * SCRUM-206 y SCRUM-220).
 *
 * Cada motor tiene su archivo en esta carpeta y todos usan las mismas piezas: asi una regla como
 * «solo las claves del contrato» o «el primer problema, con la ruta del campo» es la misma en los nueve.
 *
 * Se informa **del primer problema**, con la ruta del campo (`opciones[3].valor`), sin punto final:
 * el error de dominio arma la frase.
 */
export type Problema = string | undefined;

export type Objeto = Readonly<Record<string, unknown>>;

export type Validador = (valor: unknown, ruta: string) => Problema;

export interface Campo {
  readonly requerido: boolean;
  readonly validar: Validador;
}

export type Esquema = Readonly<Record<string, Campo>>;

export const requerido = (validar: Validador): Campo => ({ requerido: true, validar });
export const opcional = (validar: Validador): Campo => ({ requerido: false, validar });

export const nombreDe = (padre: string, clave: string): string =>
  padre === '' ? clave : `${padre}.${clave}`;

export function esObjeto(valor: unknown): valor is Objeto {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

export const texto =
  (maximo: number): Validador =>
  (valor, ruta) => {
    if (typeof valor !== 'string') {
      return `${ruta} debe ser un texto`;
    }

    const limpio = valor.trim();

    if (limpio === '') {
      return `${ruta} no puede estar vacío`;
    }

    return limpio.length > maximo ? `${ruta} no puede pasar de ${maximo} caracteres` : undefined;
  };

export const entero =
  (minimo: number, maximo: number): Validador =>
  (valor, ruta) =>
    typeof valor === 'number' && Number.isInteger(valor) && valor >= minimo && valor <= maximo
      ? undefined
      : `${ruta} debe ser un número entero de ${minimo} a ${maximo}`;

export const enteroONulo =
  (minimo: number, maximo: number): Validador =>
  (valor, ruta) =>
    valor === null ? undefined : entero(minimo, maximo)(valor, ruta);

export const booleano: Validador = (valor, ruta) =>
  typeof valor === 'boolean' ? undefined : `${ruta} debe ser verdadero o falso`;

/** Uno de estos textos, tal cual. */
export const unoDe =
  (permitidos: readonly string[]): Validador =>
  (valor, ruta) =>
    typeof valor === 'string' && permitidos.includes(valor)
      ? undefined
      : `${ruta} debe ser uno de: ${permitidos.join(', ')}`;

export const lista =
  (minimo: number, maximo: number, elemento: Validador): Validador =>
  (valor, ruta) => {
    if (!Array.isArray(valor)) {
      return `${ruta} debe ser una lista`;
    }

    if (valor.length < minimo || valor.length > maximo) {
      return `${ruta} debe tener de ${minimo} a ${maximo} elementos`;
    }

    for (const [posicion, item] of (valor as unknown[]).entries()) {
      const problema = elemento(item, `${ruta}[${posicion}]`);

      if (problema !== undefined) {
        return problema;
      }
    }

    return undefined;
  };

/** Un objeto con exactamente estas claves, las requeridas presentes y cada una bien formada. */
export function objeto(
  esquema: Esquema,
  cruzada?: (valor: Objeto, ruta: string) => Problema,
): Validador {
  return (valor, ruta) => {
    if (!esObjeto(valor)) {
      return `${ruta === '' ? 'los parámetros' : ruta} debe ser un objeto`;
    }

    for (const clave of Object.keys(valor)) {
      if (!Object.hasOwn(esquema, clave)) {
        return `${nombreDe(ruta, clave)} no es un parámetro de este motor`;
      }
    }

    for (const [clave, campo] of Object.entries(esquema)) {
      if (!Object.hasOwn(valor, clave)) {
        if (campo.requerido) {
          return `${nombreDe(ruta, clave)} es obligatorio`;
        }

        continue;
      }

      const problema = campo.validar(valor[clave], nombreDe(ruta, clave));

      if (problema !== undefined) {
        return problema;
      }
    }

    return cruzada?.(valor, ruta);
  };
}

/**
 * Elige el contrato por el campo `modo`. Un motor que sirve a varias mecanicas (`tocar_el_objetivo`
 * juega a encontrar la diferencia, a tocar un objetivo y a unir puntos) tiene un contrato por modo, y
 * cada uno trae su `modo` como obligatorio.
 *
 * `porOmision` es el contrato de **antes de que existieran los modos**: las sesiones que ya estan
 * sembradas no traen `modo` y siguen siendo validas. Sin `porOmision`, el modo es obligatorio.
 */
export function porModo(
  modos: Readonly<Record<string, Validador>>,
  porOmision?: Validador,
): Validador {
  const nombres = Object.keys(modos);

  return (valor, ruta) => {
    if (!esObjeto(valor)) {
      return `${ruta === '' ? 'los parámetros' : ruta} debe ser un objeto`;
    }

    const modo = valor['modo'];

    if (modo === undefined) {
      return porOmision === undefined
        ? `${nombreDe(ruta, 'modo')} es obligatorio`
        : porOmision(valor, ruta);
    }

    if (typeof modo !== 'string' || !Object.hasOwn(modos, modo)) {
      return `${nombreDe(ruta, 'modo')} debe ser uno de: ${nombres.join(', ')}`;
    }

    return (modos[modo] as Validador)(valor, ruta);
  };
}

const igualSinMayusculas = (valor: string): string => valor.trim().toLowerCase();

/**
 * El primer valor repetido de `campo` (o del elemento mismo si `campo` es `null`) en una lista ya
 * validada. Los textos se comparan sin espacios de los bordes y sin distinguir mayusculas.
 */
export function repetido(valor: unknown, ruta: string, campo: string | null): Problema {
  const vistos = new Set<string>();

  for (const [posicion, elemento] of (valor as unknown[]).entries()) {
    const dato = campo === null ? elemento : (elemento as Objeto)[campo];
    const clave = typeof dato === 'string' ? igualSinMayusculas(dato) : String(dato);

    if (vistos.has(clave)) {
      const donde = `${ruta}[${posicion}]${campo === null ? '' : `.${campo}`}`;

      return `${donde} repite ${typeof dato === 'string' ? `"${dato.trim()}"` : String(dato)}`;
    }

    vistos.add(clave);
  }

  return undefined;
}

/**
 * El primer valor de `campo` que se repite **entre varias listas** ya validadas (por ejemplo, la clave de
 * un elemento que esta a la vez en los objetivos y en los demas).
 */
export function repetidoEntre(
  listas: readonly (readonly [ruta: string, valor: unknown])[],
  campo: string,
): Problema {
  const vistos = new Map<string, string>();

  for (const [ruta, valor] of listas) {
    for (const [posicion, elemento] of (valor as unknown[]).entries()) {
      const dato = (elemento as Objeto)[campo];
      const clave = typeof dato === 'string' ? igualSinMayusculas(dato) : String(dato);

      if (vistos.has(clave)) {
        return `${ruta}[${posicion}].${campo} repite "${String(dato).trim()}", que ya esta en ${vistos.get(clave) ?? ''}`;
      }

      vistos.set(clave, ruta);
    }
  }

  return undefined;
}

/** Una palabra suelta: solo letras (con tildes y enie), sin espacios, cifras ni signos. */
export const palabraSuelta =
  (minimo: number, maximo: number): Validador =>
  (valor, ruta) => {
    if (typeof valor !== 'string') {
      return `${ruta} debe ser un texto`;
    }

    const largo = [...valor].length;

    if (!/^\p{L}+$/u.test(valor)) {
      return `${ruta} debe ser una sola palabra, solo con letras`;
    }

    return largo < minimo || largo > maximo
      ? `${ruta} debe tener de ${minimo} a ${maximo} letras`
      : undefined;
  };
