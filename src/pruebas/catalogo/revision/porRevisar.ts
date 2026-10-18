import { todosLosLotes } from '../lotes.ts';
import type { Categoria, MecanicaDeContenido, Parametros } from '../tipos.ts';
import { PEDIDOS_DE_REVISION, type PedidoDeRevision } from './pedidos.ts';

/**
 * Lo que hay por revisar en el catalogo antes de publicarlo (SCRUM-228): las mecanicas cuyas sesiones se
 * siembran `pendiente` y sin publicar.
 *
 * Cada ficha del catalogo dice quien tiene que revisarla: una **revision profesional** (psicologia, fisioterapia,
 * afirmaciones de salud) o una **ligera** (inclusion, redaccion, que no se confunda con una prueba). Aqui se
 * guarda esa decision de las fichas, junto con a que debe prestar atencion quien revise.
 *
 * Los textos son borradores. Que esten en la base no los aprueba: la base impide publicar lo que pide revision y
 * no la tiene (`CHECK sesion_de_actividad_publicada_revisada`).
 */

export interface SesionPorRevisar {
  readonly id: string;
  /** `BIE-02-017`: la ficha y el numero de la sesion. */
  readonly referencia: string;
  readonly titulo: string;
  readonly nivel: number;
  readonly parametros: Parametros;
}

export interface MecanicaPorRevisar {
  readonly codigo: string;
  readonly id: string;
  readonly categoria: Categoria;
  readonly nombre: string;
  readonly descripcion: string;
  readonly motor: string;
  readonly franja?: string;
  readonly pedido: PedidoDeRevision;
  readonly sesiones: readonly SesionPorRevisar[];
}

/** El numero de una sesion, de los dos ultimos digitos de su identificador (`...000000000017` es la 17). */
export function numeroDeSesion(id: string): number {
  return Number(id.slice(-2));
}

export function referenciaDeSesion(codigo: string, id: string): string {
  return `${codigo}-${String(numeroDeSesion(id)).padStart(3, '0')}`;
}

function porRevisar(mecanica: MecanicaDeContenido): MecanicaPorRevisar {
  const pedido = PEDIDOS_DE_REVISION[mecanica.codigo];

  if (pedido === undefined) {
    throw new Error(`${mecanica.codigo} pide revision y no esta en PEDIDOS_DE_REVISION.`);
  }

  return {
    codigo: mecanica.codigo,
    id: mecanica.id,
    categoria: mecanica.categoria,
    nombre: mecanica.nombre,
    descripcion: mecanica.descripcion,
    motor: mecanica.motor,
    ...(mecanica.franja === undefined ? {} : { franja: mecanica.franja }),
    pedido,
    sesiones: mecanica.sesiones.map((sesion) => ({
      id: sesion.id,
      referencia: referenciaDeSesion(mecanica.codigo, sesion.id),
      titulo: sesion.titulo,
      nivel: sesion.nivel,
      parametros: sesion.parametros,
    })),
  };
}

/** Todas las mecanicas con sesiones por revisar, por modulo y por numero de ficha. */
export function mecanicasPorRevisar(): readonly MecanicaPorRevisar[] {
  return todosLosLotes()
    .flatMap(({ lote }) => lote.mecanicas)
    .filter((mecanica) => mecanica.revision === 'pendiente' && !mecanica.publicar)
    .map(porRevisar);
}
