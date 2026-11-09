/**
 * Los identificadores del contenido: fijos, para que sean los mismos en los tres ambientes (como los de las
 * actividades, los de la Fase 0 y los del piloto).
 *
 * - Una mecanica: `0acd0000-0000-4000-8000-<12 hex>`. El final codifica la categoria y el numero de ficha,
 *   conserva los identificadores historicos hasta COG-99, y admite fichas de tres cifras para planes anuales.
 *   (Las nueve de siempre son `...000000000001` a `...000000000009`, y las del piloto `...00000000000a` a
 *   `...00000000000c`: ninguna choca.)
 * - Una sesion: `5e51CCNN-0000-4000-8000-<12 hex>` para fichas de hasta dos cifras. Las de tres cifras usan
 *   el prefijo `5e5CCNNN`; asi no se mueven los identificadores historicos y caben cientos de mecanicas.
 */

const CATEGORIAS: Readonly<Record<string, number>> = { COG: 1, BIE: 2, EMO: 3 };

function partesDe(codigo: string): { categoria: number; numero: number } {
  const [prefijo, numero] = codigo.split('-');
  const categoria = prefijo === undefined ? undefined : CATEGORIAS[prefijo];

  if (
    categoria === undefined ||
    numero === undefined ||
    !/^(?:0[1-9]|[1-9]\d{1,2})$/u.test(numero)
  ) {
    throw new Error(`El codigo de ficha "${codigo}" no es COG-NN, COG-NNN, BIE-NN ni EMO-NN`);
  }

  return { categoria, numero: Number(numero) };
}

export function idDeMecanica(codigo: string): string {
  const { categoria, numero } = partesDe(codigo);

  const final = `${categoria}${String(numero).padStart(2, '0')}`;
  const ultimosBits = final.padStart(12, '0');

  return `0acd0000-0000-4000-8000-${ultimosBits}`;
}

export function idDeSesion(codigo: string, sesion: number): string {
  const { categoria, numero } = partesDe(codigo);

  if (!Number.isInteger(sesion) || sesion < 1 || sesion > 99) {
    throw new Error(`La sesion ${String(sesion)} de ${codigo} no esta entre 1 y 99`);
  }

  const categoriaCodificada = String(categoria).padStart(2, '0');
  const prefijo =
    numero < 100
      ? `5e51${categoriaCodificada}${String(numero).padStart(2, '0')}`
      : `5e5${categoriaCodificada}${String(numero).padStart(3, '0')}`;

  return `${prefijo}-0000-4000-8000-${String(sesion).padStart(12, '0')}`;
}
