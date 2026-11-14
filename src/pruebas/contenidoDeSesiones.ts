/**
 * Las pruebas automaticas del contenido que se siembra (ADR 0030, fichas R6 y R14).
 *
 * El contrato de `parametros` (`ParametrosDelMotor.ts`) comprueba la **forma**. Esto comprueba lo que
 * **dicen** los textos que lee la persona, y se ejecuta con el contenido de verdad: cada migracion que
 * siembra sesiones pasa por aqui desde la prueba de integracion `SesionesSembradas`.
 *
 * - **R6, lenguaje clinico.** VSD Health no diagnostica: un texto que nombre una condicion convierte una
 *   orientacion en un dictamen. Se buscan las raices con y sin tilde, en cualquier parte de la palabra.
 * - **R14, lista de exclusion.** Muerte, suicidio, sangre, arma, droga y violencia, con sus derivados.
 *   Se busca la **raiz al inicio de la palabra** (`armario` no es `arma`, pero `drogueria` sí se marca):
 *   un falso positivo cuesta una conversacion con quien revisa; uno negativo, un texto que no debio salir.
 *
 * No sustituye a quien revisa: encuentra lo evidente para que la revision se dedique a lo que no lo es.
 */
export const LENGUAJE_CLINICO =
  /depres|deprim|ansiedad|ansios|trastorno|patol[oó]g|diagn[oó]st|enferm|s[ií]ndrome/iu;

export const PALABRAS_EXCLUIDAS =
  /(?<!\p{L})(?:muert\p{L}*|suicid\p{L}*|sangr\p{L}*|armas?(?!\p{L})|drog\p{L}*|violen\p{L}*)/iu;

/** Todos los textos de un valor JSON, a cualquier profundidad. Las claves no cuentan. */
export function textosDe(valor: unknown): string[] {
  if (typeof valor === 'string') {
    return [valor];
  }

  if (Array.isArray(valor)) {
    return valor.flatMap((elemento) => textosDe(elemento));
  }

  if (typeof valor === 'object' && valor !== null) {
    return Object.values(valor).flatMap((elemento) => textosDe(elemento));
  }

  return [];
}

/** Lo que hay que corregir en el contenido de una sesion, uno por linea. Vacio si no hay nada. */
export function problemasDeContenido(sesion: {
  readonly titulo: string;
  readonly parametros: unknown;
}): string[] {
  const textos = [
    { donde: 'el título', texto: sesion.titulo },
    ...textosDe(sesion.parametros).map((texto) => ({ donde: 'un texto', texto })),
  ];
  const problemas: string[] = [];

  for (const { donde, texto } of textos) {
    if (LENGUAJE_CLINICO.test(texto)) {
      problemas.push(`${donde} usa lenguaje clínico (R6): «${texto}»`);
    }

    if (PALABRAS_EXCLUIDAS.test(texto)) {
      problemas.push(`${donde} usa una palabra de la lista de exclusión (R14): «${texto}»`);
    }
  }

  return problemas;
}
