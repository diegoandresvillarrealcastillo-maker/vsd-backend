/**
 * Los identificadores del contenido: fijos, para que sean los mismos en los tres ambientes (como los de las
 * actividades, los de la Fase 0 y los del piloto).
 *
 * - Una mecanica: `0acd0000-0000-4000-8000-000000000CNN`, con `C` la categoria (1 Cognicion, 2 Bienestar,
 *   3 Emociones) y `NN` el numero de la ficha. `COG-02` es `...000000000102`; `EMO-03`, `...000000000303`.
 *   (Las nueve de siempre son `...000000000001` a `...000000000009`, y las del piloto `...00000000000a` a
 *   `...00000000000c`: ninguna choca.)
 * - Una sesion: `5e51CCNN-0000-4000-8000-0000000000SS`, con `CC` la categoria (`01`, `02`, `03`), `NN` el
 *   numero de la ficha y `SS` el de la sesion, de 01 a 40, en decimal. (La Fase 0 es `5e510000` y el piloto
 *   `5e510001`; con `CC` y `NN` este prefijo no se parece a ninguno.)
 */

const CATEGORIAS: Readonly<Record<string, number>> = { COG: 1, BIE: 2, EMO: 3 };

function partesDe(codigo: string): { categoria: number; numero: number } {
  const [prefijo, numero] = codigo.split('-');
  const categoria = prefijo === undefined ? undefined : CATEGORIAS[prefijo];

  if (categoria === undefined || numero === undefined || !/^\d{2}$/u.test(numero)) {
    throw new Error(`El codigo de ficha "${codigo}" no es COG-NN, BIE-NN ni EMO-NN`);
  }

  return { categoria, numero: Number(numero) };
}

export function idDeMecanica(codigo: string): string {
  const { categoria, numero } = partesDe(codigo);

  return `0acd0000-0000-4000-8000-000000000${categoria}${String(numero).padStart(2, '0')}`;
}

export function idDeSesion(codigo: string, sesion: number): string {
  const { categoria, numero } = partesDe(codigo);

  if (!Number.isInteger(sesion) || sesion < 1 || sesion > 99) {
    throw new Error(`La sesion ${String(sesion)} de ${codigo} no esta entre 1 y 99`);
  }

  const prefijo = `5e51${String(categoria).padStart(2, '0')}${String(numero).padStart(2, '0')}`;

  return `${prefijo}-0000-4000-8000-${String(sesion).padStart(12, '0')}`;
}
