import {
  type Validador,
  entero,
  esObjeto,
  lista,
  objeto,
  repetido,
  requerido,
  texto,
  unoDe,
} from './piezas.js';

const CODIGOS = Array.from(
  { length: 11 },
  (_, indice) => `COG-${String(indice + 1).padStart(2, '0')}`,
);

const FASE = objeto({
  codigo: requerido(unoDe(CODIGOS)),
  idSesion: requerido(texto(36)),
  titulo: requerido(texto(120)),
  nivel: requerido(entero(1, 3)),
  maximo: requerido(entero(1, 15)),
  parametros: requerido((valor, ruta) =>
    esObjeto(valor) ? undefined : `${ruta} debe ser un objeto de parametros`,
  ),
});

const RETO = objeto(
  {
    modo: requerido((valor, ruta) =>
      valor === 'reto_compuesto_cognitivo'
        ? undefined
        : `${ruta} debe ser reto_compuesto_cognitivo`,
    ),
    fases: requerido(lista(3, 4, FASE)),
    puntosMaximos: requerido(entero(3, 45)),
  },
  (valor) => {
    const fases = valor['fases'] as readonly { codigo: string }[];
    const repetidas = repetido(fases, 'fases', 'codigo');

    if (repetidas !== undefined) {
      return repetidas;
    }

    return undefined;
  },
);

/** La actividad compuesta debe encadenar tres mecanicas base distintas. */
export const RETO_COMPUESTO_COGNITIVO: Validador = (valor, ruta) => RETO(valor, ruta);
