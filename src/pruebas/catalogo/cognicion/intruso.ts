import { generadorDe, repartir, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-02 · «La palabra que sobra» (motor `clasificar`, modo `intruso`): 40 sesiones de 6 rondas.
 *
 * Cada grupo son cuatro palabras: tres comparten algo y una no. La razon se muestra **despues**, sin
 * senalar el fallo. Vocabulario cotidiano de Colombia y Latinoamerica, **sin marcas**, sin categorias
 * sensibles (religion, partidos, etnias) y sin las palabras de la lista de exclusion (R14).
 *
 * El banco son 122 grupos: 40 de nivel 1 (intruso evidente), 40 de nivel 2 (categorias cercanas) y 42 de
 * nivel 3 (un criterio menos obvio). Las sesiones se reparten por nivel, 13 + 13 + 14, y cada grupo sale
 * en **dos sesiones** a lo sumo (ADR 0031): 13 x 6 = 78 plazas para 40 grupos, y 14 x 6 = 84 para 42.
 */

interface Grupo {
  /** Lo que comparten las tres. Solo para quien escribe y revisa; no sale en la sesion. */
  readonly categoria: string;
  readonly juntas: readonly [string, string, string];
  readonly intruso: string;
  /** Lo que se lee despues de responder. */
  readonly razon: string;
}

const g = (
  categoria: string,
  juntas: readonly [string, string, string],
  intruso: string,
  razon: string,
): Grupo => ({ categoria, juntas, intruso, razon });

export const GRUPOS_DE_NIVEL_1: readonly Grupo[] = [
  g('animales', ['perro', 'gato', 'caballo'], 'mesa', 'Las otras son animales.'),
  g('frutas', ['mango', 'lulo', 'papaya'], 'zanahoria', 'Las otras son frutas.'),
  g('muebles', ['silla', 'cama', 'sofá'], 'banano', 'Las otras son muebles.'),
  g('transporte', ['bus', 'taxi', 'bicicleta'], 'cuchara', 'Las otras sirven para moverse.'),
  g('ropa', ['camisa', 'pantalón', 'falda'], 'piedra', 'Las otras son ropa.'),
  g('colores', ['rojo', 'azul', 'verde'], 'lápiz', 'Las otras son colores.'),
  g('bebidas', ['tinto', 'jugo', 'agua'], 'zapato', 'Las otras se toman.'),
  g('cuerpo', ['mano', 'pie', 'cabeza'], 'puerta', 'Las otras son partes del cuerpo.'),
  g(
    'instrumentos',
    ['guitarra', 'tambor', 'flauta'],
    'pelota',
    'Las otras son instrumentos musicales.',
  ),
  g('aves', ['loro', 'águila', 'colibrí'], 'vaca', 'Las otras son aves.'),
  g('útiles', ['cuaderno', 'lápiz', 'borrador'], 'sartén', 'Las otras son útiles escolares.'),
  g('cocina', ['olla', 'cuchara', 'plato'], 'árbol', 'Las otras se usan en la cocina.'),
  g('verduras', ['cebolla', 'zanahoria', 'lechuga'], 'mango', 'Las otras son verduras.'),
  g('lugares', ['parque', 'escuela', 'tienda'], 'nube', 'Las otras son lugares de una ciudad.'),
  g('clima', ['lluvia', 'viento', 'nieve'], 'silla', 'Las otras tienen que ver con el clima.'),
  g(
    'herramientas',
    ['martillo', 'destornillador', 'serrucho'],
    'helado',
    'Las otras son herramientas.',
  ),
  g('flores', ['rosa', 'margarita', 'girasol'], 'camión', 'Las otras son flores.'),
  g('días', ['lunes', 'martes', 'jueves'], 'enero', 'Las otras son días de la semana.'),
  g('meses', ['enero', 'marzo', 'julio'], 'domingo', 'Las otras son meses del año.'),
  g('números', ['uno', 'cinco', 'nueve'], 'azul', 'Las otras son números.'),
  g('figuras', ['círculo', 'cuadrado', 'triángulo'], 'mesa', 'Las otras son figuras geométricas.'),
  g('postres', ['helado', 'torta', 'galleta'], 'tenedor', 'Las otras son postres.'),
  g('peces', ['trucha', 'atún', 'sardina'], 'pato', 'Las otras son peces.'),
  g('juguetes', ['balón', 'cometa', 'trompo'], 'martillo', 'Las otras son juguetes.'),
  g('casa', ['cocina', 'baño', 'sala'], 'carro', 'Las otras son partes de una casa.'),
  g(
    'oficios',
    ['panadero', 'pintor', 'maestro'],
    'tijera',
    'Las otras son personas con un oficio.',
  ),
  g('insectos', ['abeja', 'hormiga', 'mosca'], 'elefante', 'Las otras son insectos.'),
  g('deportes', ['fútbol', 'natación', 'ciclismo'], 'sombrero', 'Las otras son deportes.'),
  g('playa', ['arena', 'ola', 'concha'], 'bufanda', 'Las otras son de la playa.'),
  g('dormir', ['almohada', 'cobija', 'cama'], 'balón', 'Las otras sirven para dormir.'),
  g('comunicar', ['teléfono', 'carta', 'correo'], 'árbol', 'Las otras sirven para comunicarse.'),
  g('árbol', ['raíz', 'tronco', 'hoja'], 'pared', 'Las otras son partes de un árbol.'),
  g('granos', ['arroz', 'maíz', 'fríjol'], 'pantalón', 'Las otras son granos.'),
  g('lácteos', ['leche', 'queso', 'yogur'], 'pan', 'Las otras se hacen con leche.'),
  g('granja', ['gallina', 'cerdo', 'oveja'], 'pingüino', 'Las otras son animales de granja.'),
  g('escribir', ['lápiz', 'esfero', 'marcador'], 'cuchara', 'Las otras sirven para escribir.'),
  g('agua', ['barco', 'lancha', 'canoa'], 'bicicleta', 'Las otras van por el agua.'),
  g('cítricos', ['limón', 'naranja', 'mandarina'], 'banano', 'Las otras son frutas cítricas.'),
  g('cielo', ['sol', 'luna', 'estrella'], 'zapato', 'Las otras se ven en el cielo.'),
  g(
    'mascotas',
    ['perro', 'gato', 'hámster'],
    'tambor',
    'Las otras son animales que se tienen en casa.',
  ),
];

export const GRUPOS_DE_NIVEL_2: readonly Grupo[] = [
  g(
    'frutas',
    ['mango', 'papaya', 'guayaba'],
    'papa',
    'Las otras son frutas; la papa es un tubérculo.',
  ),
  g('raíces', ['papa', 'yuca', 'arracacha'], 'lechuga', 'Las otras son raíces que se cocinan.'),
  g('mamíferos', ['perro', 'vaca', 'delfín'], 'gallina', 'Las otras son mamíferos.'),
  g(
    'aves',
    ['pato', 'gallina', 'pavo'],
    'murciélago',
    'Las otras son aves; el murciélago es un mamífero.',
  ),
  g(
    'reptiles',
    ['lagarto', 'tortuga', 'iguana'],
    'rana',
    'Las otras son reptiles; la rana es un anfibio.',
  ),
  g('vuelan', ['avión', 'helicóptero', 'cometa'], 'bicicleta', 'Las otras vuelan.'),
  g('cuerdas', ['guitarra', 'violín', 'arpa'], 'tambor', 'Las otras tienen cuerdas.'),
  g('viento', ['flauta', 'trompeta', 'clarinete'], 'piano', 'Las otras se soplan.'),
  g('calientes', ['tinto', 'chocolate', 'aguapanela'], 'limonada', 'Las otras se toman calientes.'),
  g('desayuno', ['arepa', 'huevo', 'pan'], 'sancocho', 'Las otras son comunes en el desayuno.'),
  g('sopas', ['sancocho', 'ajiaco', 'mondongo'], 'arepa', 'Las otras son sopas.'),
  g('público', ['bus', 'metro', 'taxi'], 'patineta', 'Las otras son transporte público.'),
  g('ruedas', ['carro', 'bicicleta', 'patineta'], 'canoa', 'Las otras tienen ruedas.'),
  g(
    'lados rectos',
    ['cuadrado', 'triángulo', 'rectángulo'],
    'círculo',
    'Las otras tienen lados rectos.',
  ),
  g('dulces', ['panela', 'miel', 'azúcar'], 'limón', 'Las otras son dulces.'),
  g('aseo', ['jabón', 'cepillo', 'toalla'], 'cuchara', 'Las otras son para el aseo personal.'),
  g('cocina', ['nevera', 'estufa', 'licuadora'], 'almohada', 'Las otras se usan en la cocina.'),
  g(
    'construcción',
    ['albañil', 'plomero', 'carpintero'],
    'pastelero',
    'Las otras trabajan en construcción.',
  ),
  g('libro', ['capítulo', 'página', 'portada'], 'tinta', 'Las otras son partes de un libro.'),
  g('papel', ['carta', 'cuaderno', 'periódico'], 'vidrio', 'Las otras son de papel.'),
  g('vidrio', ['ventana', 'vaso', 'espejo'], 'cartón', 'Las otras son de vidrio.'),
  g('madera', ['mesa', 'puerta', 'escritorio'], 'cadena', 'Las otras suelen ser de madera.'),
  g('redondas', ['pelota', 'moneda', 'plato'], 'libro', 'Las otras son redondas.'),
  g('se encienden', ['lámpara', 'vela', 'estufa'], 'cobija', 'Las otras se encienden.'),
  g('se leen', ['libro', 'revista', 'periódico'], 'tambor', 'Las otras se leen.'),
  g('cielo', ['nube', 'luna', 'estrella'], 'montaña', 'Las otras se ven en el cielo.'),
  g(
    'campo',
    ['río', 'piedra', 'camino'],
    'ola',
    'Las otras se ven en el campo; la ola es del mar.',
  ),
  g('hojas', ['lechuga', 'espinaca', 'acelga'], 'zanahoria', 'Las otras son verduras de hoja.'),
  g('rojas', ['fresa', 'cereza', 'mora'], 'banano', 'Las otras son frutas rojas o moradas.'),
  g('de noche', ['búho', 'murciélago', 'luciérnaga'], 'gallina', 'Las otras salen de noche.'),
  g('jardín', ['pala', 'azadón', 'rastrillo'], 'martillo', 'Las otras se usan en el jardín.'),
  g('medir', ['regla', 'metro', 'balanza'], 'tijera', 'Las otras sirven para medir.'),
  g('lluvia', ['paraguas', 'botas', 'impermeable'], 'sombrero', 'Las otras sirven cuando llueve.'),
  g('sol', ['gorra', 'bloqueador', 'sombrero'], 'bufanda', 'Las otras protegen del sol.'),
  g(
    'pagos',
    ['efectivo', 'tarjeta', 'transferencia'],
    'cuaderno',
    'Las otras son maneras de pagar.',
  ),
  g(
    'idiomas',
    ['español', 'inglés', 'francés'],
    'colombiano',
    'Las otras son idiomas; colombiano es un gentilicio.',
  ),
  g('ciudades', ['Bogotá', 'Cali', 'Medellín'], 'Quito', 'Las otras son ciudades de Colombia.'),
  g('países', ['Perú', 'Chile', 'Brasil'], 'España', 'Las otras son países de Sudamérica.'),
  g('horno', ['almojábana', 'pan', 'torta'], 'yogur', 'Las otras se hornean.'),
  g('momentos', ['mañana', 'tarde', 'noche'], 'lunes', 'Las otras son momentos del día.'),
];

export const GRUPOS_DE_NIVEL_3: readonly Grupo[] = [
  g('doblar', ['papel', 'toalla', 'camisa'], 'piedra', 'Las otras se pueden doblar.'),
  g('teclas', ['piano', 'computador', 'calculadora'], 'cuaderno', 'Las otras tienen teclas.'),
  g('alas', ['ave', 'avión', 'mariposa'], 'pez', 'Las otras tienen alas.'),
  g(
    'abrir y cerrar',
    ['puerta', 'ventana', 'paraguas'],
    'piedra',
    'Las otras se abren y se cierran.',
  ),
  g('pelar', ['naranja', 'banano', 'papa'], 'uva', 'Las otras se pelan antes de comerlas.'),
  g('patas', ['mesa', 'silla', 'cama'], 'cuaderno', 'Las otras tienen patas.'),
  g('girar', ['rueda', 'trompo', 'ventilador'], 'mesa', 'Las otras giran.'),
  g('absorber', ['esponja', 'toalla', 'pañuelo'], 'plástico', 'Las otras absorben agua.'),
  g('luz', ['estrella', 'luciérnaga', 'linterna'], 'piedra', 'Las otras producen luz.'),
  g('atar', ['zapato', 'cinta', 'globo'], 'libro', 'Las otras se atan.'),
  g('agujas', ['reloj', 'brújula', 'pino'], 'taza', 'Las otras tienen agujas.'),
  g('pico', ['ave', 'montaña', 'jarra'], 'mano', 'Las otras tienen pico.'),
  g('cola', ['cometa', 'perro', 'avión'], 'mesa', 'Las otras tienen cola.'),
  g('boca', ['río', 'botella', 'cueva'], 'mesa', 'Las otras tienen boca.'),
  g('lomo', ['libro', 'burro', 'montaña'], 'taza', 'Las otras tienen lomo.'),
  g('cuello', ['botella', 'camisa', 'jirafa'], 'mesa', 'Las otras tienen cuello.'),
  g('estirar', ['resorte', 'chicle', 'liga'], 'vidrio', 'Las otras se estiran.'),
  g('prender', ['luz', 'radio', 'televisor'], 'puerta', 'Las otras se prenden y se apagan.'),
  g('tocar', ['guitarra', 'tambor', 'piano'], 'libro', 'Las otras se tocan para hacer música.'),
  g('hornear', ['pan', 'torta', 'galleta'], 'gelatina', 'Las otras se hornean.'),
  g('sembrar', ['maíz', 'fríjol', 'cebolla'], 'camisa', 'Las otras se siembran.'),
  g('escamas', ['pez', 'serpiente', 'lagarto'], 'gato', 'Las otras tienen escamas.'),
  g('espinas', ['rosa', 'cactus', 'pescado'], 'manzana', 'Las otras tienen espinas.'),
  g('derretir', ['helado', 'mantequilla', 'vela'], 'piedra', 'Las otras se derriten con el calor.'),
  g('enrollar', ['cable', 'manguera', 'cinta'], 'puerta', 'Las otras se pueden enrollar.'),
  g('exprimir', ['naranja', 'limón', 'esponja'], 'zapato', 'Las otras se exprimen.'),
  g('colgar', ['cuadro', 'ropa', 'lámpara'], 'piedra', 'Las otras se cuelgan.'),
  g('apilar', ['platos', 'libros', 'cajas'], 'agua', 'Las otras se pueden apilar.'),
  g(
    'cambian de color',
    ['hoja', 'banano', 'cielo'],
    'piedra',
    'Las otras cambian de color con el tiempo.',
  ),
  g('rodar', ['balón', 'moneda', 'rueda'], 'cuadrado', 'Las otras ruedan.'),
  g('tapas', ['olla', 'frasco', 'caja'], 'lápiz', 'Las otras tienen tapa.'),
  g('cierres', ['maleta', 'chaqueta', 'cartuchera'], 'plato', 'Las otras tienen cremallera.'),
  g('sonido', ['campana', 'timbre', 'alarma'], 'almohada', 'Las otras hacen sonido.'),
  g('mangos', ['sartén', 'paraguas', 'escoba'], 'balón', 'Las otras tienen mango.'),
  g('rayas', ['cebra', 'cuaderno', 'bandera'], 'moneda', 'Las otras tienen rayas.'),
  g('botones', ['camisa', 'control', 'timbre'], 'jabón', 'Las otras tienen botones.'),
  g('ventanas', ['casa', 'bus', 'avión'], 'maleta', 'Las otras tienen ventanas.'),
  g('hélices', ['ventilador', 'helicóptero', 'barco'], 'cama', 'Las otras tienen hélices.'),
  g('escalones', ['escalera', 'estadio', 'edificio'], 'espejo', 'Las otras tienen escalones.'),
  g('pantalla', ['televisor', 'computador', 'celular'], 'cuaderno', 'Las otras tienen pantalla.'),
  g('pedales', ['bicicleta', 'piano', 'máquina de coser'], 'mesa', 'Las otras tienen pedales.'),
  g('sombra', ['árbol', 'sombrilla', 'edificio'], 'espejo', 'Las otras dan sombra.'),
];

export const LAS_RONDAS = 6;

/** Cuantas sesiones salen de cada nivel: 13 + 13 + 14 = 40. */
export const SESIONES_POR_NIVEL = [13, 13, 14] as const;

function aRonda(grupo: Grupo, azar: ReturnType<typeof generadorDe>) {
  const palabras = revolver(azar, [...grupo.juntas, grupo.intruso]);

  return { palabras, intruso: palabras.indexOf(grupo.intruso), razon: grupo.razon };
}

export function sesionesDeIntruso(): SesionDeContenido[] {
  const niveles = [GRUPOS_DE_NIVEL_1, GRUPOS_DE_NIVEL_2, GRUPOS_DE_NIVEL_3] as const;
  const titulos = ['evidente', 'cercanas', 'menos obvio'] as const;
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  niveles.forEach((banco, indice) => {
    const nivel = (indice + 1) as 1 | 2 | 3;
    const cuantas = SESIONES_POR_NIVEL[indice] as number;

    repartir(banco, cuantas, LAS_RONDAS).forEach((grupos, dentro) => {
      numero += 1;

      const azar = generadorDe(0x1a2b0000 + numero);

      sesiones.push({
        id: idDeSesion('COG-02', numero),
        titulo: `Intruso ${titulos[indice]}, ${dentro + 1}`,
        nivel,
        parametros: {
          modo: 'intruso',
          rondas: grupos.map((grupo) => aRonda(grupo, azar)),
          puntosMaximos: LAS_RONDAS,
        },
      });
    });
  });

  return sesiones;
}
