import { generadorDe, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import type { SesionDeContenido } from '../tipos.ts';
import { clave } from './cestas.ts';

/**
 * COG-06 · «Recuerda la lista» (motor `ver_ocultar_recordar`, modo `lista`): 40 sesiones, una lista cada una.
 *
 * Se ve una lista (4, 6 u 8 cosas) unos segundos, se oculta y se eligen los elementos entre ellos y cuatro
 * distractores plausibles. Contextos cotidianos; **ningun elemento de salud ni de medicinas** (el «botiquin»
 * es de curitas y gasas, sin farmacos) y sin las palabras de la lista de exclusion (R14).
 *
 * El tiempo a la vista es parte del juego, no una amenaza (R4): 10, 12 y 15 s segun el nivel, y no hay cuenta
 * atras en rojo. Ocho puntos en total, repartidos entre los elementos: con 4 elementos cada uno vale 2.
 *
 * Son 40 listas y no las 60 de la ficha: una por sesion, ninguna repetida (ADR 0031).
 */

interface Lista {
  readonly contexto: string;
  readonly elementos: readonly string[];
  readonly distractores: readonly [string, string, string, string];
}

const l = (
  contexto: string,
  elementos: readonly string[],
  distractores: readonly [string, string, string, string],
): Lista => ({ contexto, elementos, distractores });

const NIVEL_1: readonly Lista[] = [
  l(
    'En el mercado',
    ['papa', 'tomate', 'arroz', 'huevos'],
    ['cebolla', 'leche', 'pan', 'aguacate'],
  ),
  l(
    'Para el desayuno',
    ['arepa', 'huevo', 'café', 'queso'],
    ['chocolate', 'pan', 'jugo', 'mantequilla'],
  ),
  l(
    'En la mochila del colegio',
    ['cuaderno', 'lápiz', 'regla', 'borrador'],
    ['tijeras', 'colores', 'libro', 'calculadora'],
  ),
  l(
    'En la maleta de viaje',
    ['camisa', 'zapatos', 'cepillo', 'toalla'],
    ['chaqueta', 'pijama', 'gorra', 'medias'],
  ),
  l(
    'Para una caminata',
    ['agua', 'gorra', 'bloqueador', 'mapa'],
    ['linterna', 'cuerda', 'binoculares', 'pañuelo'],
  ),
  l(
    'En el botiquín de la casa',
    ['curitas', 'gasas', 'algodón', 'venda'],
    ['tijeras', 'cinta', 'guantes', 'toallitas'],
  ),
  l(
    'En la cocina',
    ['olla', 'sartén', 'cuchara', 'colador'],
    ['tabla', 'tenedor', 'plato', 'jarra'],
  ),
  l(
    'En el jardín',
    ['pala', 'regadera', 'semillas', 'guantes'],
    ['maceta', 'tierra', 'manguera', 'rastrillo'],
  ),
  l(
    'Para una fiesta de cumpleaños',
    ['globos', 'torta', 'velas', 'serpentinas'],
    ['platos', 'vasos', 'regalo', 'mantel'],
  ),
  l(
    'En el escritorio',
    ['lámpara', 'libreta', 'esfero', 'computador'],
    ['calculadora', 'grapadora', 'agenda', 'reloj'],
  ),
  l(
    'Para el picnic',
    ['manta', 'sándwiches', 'jugo', 'frutas'],
    ['termo', 'servilletas', 'canasta', 'galletas'],
  ),
  l(
    'En la sala',
    ['sofá', 'televisor', 'lámpara', 'tapete'],
    ['cuadro', 'mesa', 'cojín', 'planta'],
  ),
  l(
    'Para un día de lluvia',
    ['paraguas', 'botas', 'impermeable', 'toalla'],
    ['gorra', 'sombrilla', 'medias secas', 'bolsa'],
  ),
];

const NIVEL_2: readonly Lista[] = [
  l(
    'En el mercado grande',
    ['plátano', 'yuca', 'cilantro', 'pollo', 'fríjol', 'panela'],
    ['maíz', 'cebolla', 'tomate', 'limón'],
  ),
  l(
    'Los útiles del colegio',
    ['cuaderno', 'lápiz', 'borrador', 'regla', 'sacapuntas', 'colores'],
    ['marcador', 'tijeras', 'pegante', 'carpeta'],
  ),
  l(
    'En la maleta de playa',
    ['toalla', 'sandalias', 'bloqueador', 'gorra', 'gafas', 'botella'],
    ['sombrilla', 'libro', 'pelota', 'bañador'],
  ),
  l(
    'En la cocina',
    ['olla', 'sartén', 'cuchara', 'colador', 'plato', 'vaso'],
    ['jarra', 'licuadora', 'tenedor', 'taza'],
  ),
  l(
    'En el taller',
    ['martillo', 'serrucho', 'lija', 'clavos', 'metro', 'tornillos'],
    ['taladro', 'pintura', 'pegante', 'gafas'],
  ),
  l(
    'En la papelería',
    ['hojas', 'carpeta', 'sobres', 'grapas', 'clips', 'resaltador'],
    ['regla', 'tijeras', 'cuaderno', 'pegante'],
  ),
  l(
    'El desayuno del domingo',
    ['arepas', 'huevos', 'queso', 'café', 'chocolate', 'mantequilla'],
    ['pan', 'jugo', 'fruta', 'tamal'],
  ),
  l(
    'En el cuarto',
    ['cama', 'almohada', 'cobija', 'lámpara', 'ropero', 'tapete'],
    ['espejo', 'cortina', 'silla', 'reloj'],
  ),
  l(
    'Para una excursión',
    ['mochila', 'botella', 'linterna', 'mapa', 'gorra', 'impermeable'],
    ['cámara', 'snacks', 'bastón', 'binoculares'],
  ),
  l(
    'En el baño',
    ['jabón', 'toalla', 'cepillo', 'peine', 'champú', 'espejo'],
    ['crema', 'esponja', 'vaso', 'tapete'],
  ),
  l(
    'En la floristería',
    ['rosas', 'margaritas', 'girasoles', 'lirios', 'jarrón', 'cinta'],
    ['tulipanes', 'orquídeas', 'maceta', 'tijeras'],
  ),
  l(
    'En la frutería',
    ['mango', 'lulo', 'mora', 'guayaba', 'papaya', 'piña'],
    ['banano', 'naranja', 'fresa', 'uvas'],
  ),
  l(
    'En la biblioteca',
    ['libro', 'revista', 'mapa', 'diccionario', 'periódico', 'enciclopedia'],
    ['cuaderno', 'folleto', 'atlas', 'novela'],
  ),
];

const NIVEL_3: readonly Lista[] = [
  l(
    'El mercado de la semana',
    ['papa', 'yuca', 'plátano', 'cebolla', 'tomate', 'zanahoria', 'huevos', 'arroz'],
    ['lentejas', 'ajo', 'pimentón', 'leche'],
  ),
  l(
    'La maleta de una semana',
    ['camisas', 'pantalones', 'medias', 'zapatos', 'cepillo', 'toalla', 'chaqueta', 'pijama'],
    ['gorra', 'paraguas', 'cargador', 'libro'],
  ),
  l(
    'Una cocina completa',
    ['olla', 'sartén', 'cuchara', 'tenedor', 'plato', 'vaso', 'colador', 'licuadora'],
    ['jarra', 'tabla', 'taza', 'cucharón'],
  ),
  l(
    'Una oficina',
    ['lápiz', 'esfero', 'resaltador', 'grapadora', 'clips', 'carpeta', 'calculadora', 'agenda'],
    ['tijeras', 'sobres', 'libreta', 'regla'],
  ),
  l(
    'La fiesta',
    ['globos', 'torta', 'velas', 'serpentinas', 'platos', 'vasos', 'mantel', 'regalo'],
    ['música', 'sillas', 'gorros', 'piñata'],
  ),
  l(
    'El jardín',
    ['pala', 'regadera', 'semillas', 'guantes', 'maceta', 'tierra', 'manguera', 'rastrillo'],
    ['tijeras de podar', 'abono', 'carretilla', 'sombrero'],
  ),
  l(
    'La casa',
    ['sofá', 'mesa', 'silla', 'lámpara', 'tapete', 'cuadro', 'cojín', 'cortina'],
    ['espejo', 'planta', 'reloj', 'florero'],
  ),
  l(
    'El salón de clase',
    ['cuaderno', 'lápiz', 'regla', 'borrador', 'sacapuntas', 'colores', 'tijeras', 'pegante'],
    ['carpeta', 'marcadores', 'compás', 'calculadora'],
  ),
  l(
    'La tienda del barrio',
    ['arroz', 'aceite', 'sal', 'azúcar', 'panela', 'fríjol', 'café', 'pasta'],
    ['harina', 'leche', 'huevos', 'galletas'],
  ),
  l(
    'Una excursión larga',
    ['mochila', 'botella', 'linterna', 'mapa', 'gorra', 'impermeable', 'bloqueador', 'snacks'],
    ['brújula', 'cuerda', 'binoculares', 'manta'],
  ),
  l(
    'Un cuarto',
    ['cama', 'almohada', 'cobija', 'lámpara', 'ropero', 'tapete', 'espejo', 'cortina'],
    ['silla', 'cajonera', 'reloj', 'cuadro'],
  ),
  l(
    'La panadería',
    ['pan', 'almojábana', 'pandebono', 'buñuelo', 'torta', 'galleta', 'croissant', 'mantecada'],
    ['arepa', 'empanada', 'tamal', 'mogolla'],
  ),
  l(
    'La tienda de ropa',
    ['camisa', 'pantalón', 'falda', 'chaqueta', 'vestido', 'bufanda', 'gorra', 'zapatos'],
    ['medias', 'correa', 'guantes', 'saco'],
  ),
  l(
    'Un viaje en bus',
    ['tiquete', 'documento', 'cargador', 'audífonos', 'botella', 'snack', 'cobija', 'libro'],
    ['maleta', 'almohada', 'revista', 'pañuelo'],
  ),
];

export const LISTAS_DE_NIVEL_1 = NIVEL_1;
export const LISTAS_DE_NIVEL_2 = NIVEL_2;
export const LISTAS_DE_NIVEL_3 = NIVEL_3;

const SEGUNDOS = [10, 12, 15] as const;

function sesion(lista: Lista, nivel: 1 | 2 | 3, numero: number): SesionDeContenido {
  const azar = generadorDe(0x66660000 + numero * 15485863);
  const elemento = (nombre: string) => ({ clave: clave(nombre), nombre });

  return {
    id: idDeSesion('COG-06', numero),
    titulo: `${lista.contexto} (${lista.elementos.length} cosas)`.slice(0, 100),
    nivel,
    parametros: {
      modo: 'lista',
      contexto: lista.contexto,
      segundosVista: SEGUNDOS[nivel - 1],
      // En la sesion los elementos van en el orden de la lista: es el que se ve. Los distractores, aparte.
      elementos: lista.elementos.map(elemento),
      distractores: revolver(azar, lista.distractores).map(elemento),
      puntosMaximos: 8,
    },
  };
}

export function sesionesDeListas(): SesionDeContenido[] {
  const niveles = [
    { listas: NIVEL_1, nivel: 1 },
    { listas: NIVEL_2, nivel: 2 },
    { listas: NIVEL_3, nivel: 3 },
  ] as const;
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  for (const { listas, nivel } of niveles) {
    for (const lista of listas) {
      numero += 1;
      sesiones.push(sesion(lista, nivel, numero));
    }
  }

  return sesiones;
}
