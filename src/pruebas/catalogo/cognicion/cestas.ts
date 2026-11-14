import { generadorDe, revolver } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-03 · «Ordena por categoria» (motor `clasificar`, modo `cestas`): 40 sesiones de 8 elementos.
 *
 * Cada «mesa» tiene dos o tres cestas y ocho elementos que aparecen de uno en uno. Nivel 1: dos cestas.
 * Nivel 2: tres cestas. Nivel 3: tres cestas con elementos ambiguos que tienen su sitio por una razon
 * (el tomate es fruta **o** verdura): la ficha acepta **ambas** y la pantalla no senala la otra como error.
 *
 * Sin categorias sobre personas ni cuerpos (R13). La pantalla ofrece siempre la alternativa de tocar sin
 * arrastrar (R10). Cada mesa es una sesion y ningun elemento esta en mas de dos (ADR 0031).
 */

type Sitio = string | readonly string[];
type Entrada = readonly [nombre: string, sitio: Sitio];

interface Mesa {
  readonly cestas: readonly string[];
  readonly elementos: readonly Entrada[];
}

const m = (cestas: readonly string[], elementos: readonly Entrada[]): Mesa => ({
  cestas,
  elementos,
});

// ---------------------------------------------------------------------------
// Nivel 1: dos cestas
// ---------------------------------------------------------------------------

const NIVEL_1: readonly Mesa[] = [
  m(
    ['Frutas', 'Verduras'],
    [
      ['mango', 'Frutas'],
      ['lulo', 'Frutas'],
      ['mora', 'Frutas'],
      ['guayaba', 'Frutas'],
      ['zanahoria', 'Verduras'],
      ['espinaca', 'Verduras'],
      ['cebolla', 'Verduras'],
      ['pepino', 'Verduras'],
    ],
  ),
  m(
    ['Animales', 'Plantas'],
    [
      ['perro', 'Animales'],
      ['gato', 'Animales'],
      ['loro', 'Animales'],
      ['pez', 'Animales'],
      ['árbol', 'Plantas'],
      ['flor', 'Plantas'],
      ['cactus', 'Plantas'],
      ['helecho', 'Plantas'],
    ],
  ),
  m(
    ['Cocina', 'Baño'],
    [
      ['olla', 'Cocina'],
      ['sartén', 'Cocina'],
      ['cuchara', 'Cocina'],
      ['plato', 'Cocina'],
      ['jabón', 'Baño'],
      ['cepillo', 'Baño'],
      ['toalla', 'Baño'],
      ['espejo', 'Baño'],
    ],
  ),
  m(
    ['Ropa de abrigo', 'Ropa fresca'],
    [
      ['bufanda', 'Ropa de abrigo'],
      ['chaqueta', 'Ropa de abrigo'],
      ['gorro', 'Ropa de abrigo'],
      ['guantes', 'Ropa de abrigo'],
      ['camiseta', 'Ropa fresca'],
      ['pantaloneta', 'Ropa fresca'],
      ['sandalias', 'Ropa fresca'],
      ['gorra', 'Ropa fresca'],
    ],
  ),
  m(
    ['Se come', 'Se toma'],
    [
      ['arepa', 'Se come'],
      ['papa', 'Se come'],
      ['queso', 'Se come'],
      ['huevo', 'Se come'],
      ['jugo', 'Se toma'],
      ['agua', 'Se toma'],
      ['tinto', 'Se toma'],
      ['leche', 'Se toma'],
    ],
  ),
  m(
    ['De día', 'De noche'],
    [
      ['sol', 'De día'],
      ['recreo', 'De día'],
      ['almuerzo', 'De día'],
      ['amanecer', 'De día'],
      ['luna', 'De noche'],
      ['estrellas', 'De noche'],
      ['pijama', 'De noche'],
      ['cobija', 'De noche'],
    ],
  ),
  m(
    ['Para escribir', 'Para leer'],
    [
      ['lápiz', 'Para escribir'],
      ['esfero', 'Para escribir'],
      ['marcador', 'Para escribir'],
      ['tiza', 'Para escribir'],
      ['libro', 'Para leer'],
      ['revista', 'Para leer'],
      ['periódico', 'Para leer'],
      ['cuento', 'Para leer'],
    ],
  ),
  m(
    ['Por tierra', 'Por agua o aire'],
    [
      ['bus', 'Por tierra'],
      ['moto', 'Por tierra'],
      ['bicicleta', 'Por tierra'],
      ['tren', 'Por tierra'],
      ['barco', 'Por agua o aire'],
      ['lancha', 'Por agua o aire'],
      ['avión', 'Por agua o aire'],
      ['helicóptero', 'Por agua o aire'],
    ],
  ),
  m(
    ['De cuerda', 'De percusión'],
    [
      ['guitarra', 'De cuerda'],
      ['violín', 'De cuerda'],
      ['arpa', 'De cuerda'],
      ['tiple', 'De cuerda'],
      ['tambor', 'De percusión'],
      ['maracas', 'De percusión'],
      ['bongó', 'De percusión'],
      ['pandereta', 'De percusión'],
    ],
  ),
  m(
    ['Herramientas', 'Útiles escolares'],
    [
      ['martillo', 'Herramientas'],
      ['serrucho', 'Herramientas'],
      ['destornillador', 'Herramientas'],
      ['taladro', 'Herramientas'],
      ['cuaderno', 'Útiles escolares'],
      ['regla', 'Útiles escolares'],
      ['borrador', 'Útiles escolares'],
      ['sacapuntas', 'Útiles escolares'],
    ],
  ),
  m(
    ['En la casa', 'En el colegio'],
    [
      ['cama', 'En la casa'],
      ['nevera', 'En la casa'],
      ['sofá', 'En la casa'],
      ['estufa', 'En la casa'],
      ['pupitre', 'En el colegio'],
      ['tablero', 'En el colegio'],
      ['biblioteca', 'En el colegio'],
      ['patio de recreo', 'En el colegio'],
    ],
  ),
  m(
    ['Dulce', 'Salado'],
    [
      ['panela', 'Dulce'],
      ['helado', 'Dulce'],
      ['torta', 'Dulce'],
      ['miel', 'Dulce'],
      ['chicharrón', 'Salado'],
      ['empanada', 'Salado'],
      ['maní', 'Salado'],
      ['aceitunas', 'Salado'],
    ],
  ),
  m(
    ['Grande', 'Pequeño'],
    [
      ['elefante', 'Grande'],
      ['ballena', 'Grande'],
      ['camión', 'Grande'],
      ['edificio', 'Grande'],
      ['hormiga', 'Pequeño'],
      ['botón', 'Pequeño'],
      ['grano de arroz', 'Pequeño'],
      ['moneda', 'Pequeño'],
    ],
  ),
];

// ---------------------------------------------------------------------------
// Nivel 2: tres cestas
// ---------------------------------------------------------------------------

const NIVEL_2: readonly Mesa[] = [
  m(
    ['Frutas', 'Verduras', 'Granos'],
    [
      ['mango', 'Frutas'],
      ['lulo', 'Frutas'],
      ['mora', 'Frutas'],
      ['zanahoria', 'Verduras'],
      ['cebolla', 'Verduras'],
      ['lechuga', 'Verduras'],
      ['arroz', 'Granos'],
      ['fríjol', 'Granos'],
    ],
  ),
  m(
    ['Mamíferos', 'Aves', 'Peces'],
    [
      ['perro', 'Mamíferos'],
      ['vaca', 'Mamíferos'],
      ['ballena', 'Mamíferos'],
      ['loro', 'Aves'],
      ['gallina', 'Aves'],
      ['águila', 'Aves'],
      ['atún', 'Peces'],
      ['trucha', 'Peces'],
    ],
  ),
  m(
    ['Sala', 'Cocina', 'Baño'],
    [
      ['sofá', 'Sala'],
      ['televisor', 'Sala'],
      ['lámpara de pie', 'Sala'],
      ['nevera', 'Cocina'],
      ['estufa', 'Cocina'],
      ['olla', 'Cocina'],
      ['ducha', 'Baño'],
      ['lavamanos', 'Baño'],
    ],
  ),
  m(
    ['Mañana', 'Tarde', 'Noche'],
    [
      ['desayuno', 'Mañana'],
      ['amanecer', 'Mañana'],
      ['despertador', 'Mañana'],
      ['almuerzo', 'Tarde'],
      ['siesta', 'Tarde'],
      ['atardecer', 'Tarde'],
      ['cena', 'Noche'],
      ['luna', 'Noche'],
    ],
  ),
  m(
    ['Trabajo', 'Estudio', 'Descanso'],
    [
      ['oficina', 'Trabajo'],
      ['reunión', 'Trabajo'],
      ['factura', 'Trabajo'],
      ['cuaderno', 'Estudio'],
      ['examen', 'Estudio'],
      ['tarea', 'Estudio'],
      ['hamaca', 'Descanso'],
      ['siesta', 'Descanso'],
    ],
  ),
  m(
    ['Tierra', 'Agua', 'Aire'],
    [
      ['caballo', 'Tierra'],
      ['hormiga', 'Tierra'],
      ['conejo', 'Tierra'],
      ['pez', 'Agua'],
      ['delfín', 'Agua'],
      ['medusa', 'Agua'],
      ['águila', 'Aire'],
      ['mariposa', 'Aire'],
    ],
  ),
  m(
    ['Papel', 'Vidrio', 'Metal'],
    [
      ['cuaderno', 'Papel'],
      ['periódico', 'Papel'],
      ['carta', 'Papel'],
      ['ventana', 'Vidrio'],
      ['espejo', 'Vidrio'],
      ['vaso', 'Vidrio'],
      ['llave', 'Metal'],
      ['olla', 'Metal'],
    ],
  ),
  m(
    ['Con balón', 'En el agua', 'En pista'],
    [
      ['fútbol', 'Con balón'],
      ['baloncesto', 'Con balón'],
      ['voleibol', 'Con balón'],
      ['natación', 'En el agua'],
      ['buceo', 'En el agua'],
      ['remo', 'En el agua'],
      ['atletismo', 'En pista'],
      ['ciclismo', 'En pista'],
    ],
  ),
  m(
    ['Cálidos', 'Fríos', 'Neutros'],
    [
      ['rojo', 'Cálidos'],
      ['naranja', 'Cálidos'],
      ['amarillo', 'Cálidos'],
      ['azul', 'Fríos'],
      ['verde', 'Fríos'],
      ['violeta', 'Fríos'],
      ['blanco', 'Neutros'],
      ['gris', 'Neutros'],
    ],
  ),
  m(
    ['De cuerda', 'De viento', 'De percusión'],
    [
      ['guitarra', 'De cuerda'],
      ['violín', 'De cuerda'],
      ['arpa', 'De cuerda'],
      ['flauta', 'De viento'],
      ['trompeta', 'De viento'],
      ['clarinete', 'De viento'],
      ['tambor', 'De percusión'],
      ['maracas', 'De percusión'],
    ],
  ),
  m(
    ['En el mar', 'En el río', 'En la montaña'],
    [
      ['ola', 'En el mar'],
      ['playa', 'En el mar'],
      ['concha', 'En el mar'],
      ['canoa', 'En el río'],
      ['orilla', 'En el río'],
      ['puente', 'En el río'],
      ['cima', 'En la montaña'],
      ['neblina', 'En la montaña'],
    ],
  ),
  m(
    ['Cabeza', 'Brazos y manos', 'Piernas y pies'],
    [
      ['ojo', 'Cabeza'],
      ['oreja', 'Cabeza'],
      ['nariz', 'Cabeza'],
      ['codo', 'Brazos y manos'],
      ['muñeca', 'Brazos y manos'],
      ['dedo', 'Brazos y manos'],
      ['rodilla', 'Piernas y pies'],
      ['tobillo', 'Piernas y pies'],
    ],
  ),
  m(
    ['Pueblo', 'Ciudad', 'Campo'],
    [
      ['plaza', 'Pueblo'],
      ['mercado', 'Pueblo'],
      ['kiosco', 'Pueblo'],
      ['metro', 'Ciudad'],
      ['rascacielos', 'Ciudad'],
      ['semáforo', 'Ciudad'],
      ['finca', 'Campo'],
      ['cosecha', 'Campo'],
    ],
  ),
];

// ---------------------------------------------------------------------------
// Nivel 3: tres cestas, con elementos ambiguos (la ficha acepta ambas)
// ---------------------------------------------------------------------------

const NIVEL_3: readonly Mesa[] = [
  m(
    ['Fruta', 'Verdura', 'Condimento'],
    [
      ['mango', 'Fruta'],
      ['lulo', 'Fruta'],
      ['zanahoria', 'Verdura'],
      ['lechuga', 'Verdura'],
      ['cilantro', 'Condimento'],
      ['ajo', 'Condimento'],
      ['tomate', ['Fruta', 'Verdura']],
      ['aguacate', ['Fruta', 'Verdura']],
    ],
  ),
  m(
    ['Desayuno', 'Almuerzo', 'Postre'],
    [
      ['huevo', 'Desayuno'],
      ['chocolate', 'Desayuno'],
      ['sopa', 'Almuerzo'],
      ['arroz', 'Almuerzo'],
      ['flan', 'Postre'],
      ['helado', 'Postre'],
      ['arepa', ['Desayuno', 'Almuerzo']],
      ['fruta picada', ['Desayuno', 'Postre']],
    ],
  ),
  m(
    ['Vuela', 'Nada', 'Camina'],
    [
      ['águila', 'Vuela'],
      ['mariposa', 'Vuela'],
      ['delfín', 'Nada'],
      ['pez', 'Nada'],
      ['caballo', 'Camina'],
      ['conejo', 'Camina'],
      ['pato', ['Vuela', 'Nada', 'Camina']],
      ['tortuga', ['Nada', 'Camina']],
    ],
  ),
  m(
    ['Para escribir', 'Para pegar o cortar', 'Para medir'],
    [
      ['lápiz', 'Para escribir'],
      ['esfero', 'Para escribir'],
      ['tiza', 'Para escribir'],
      ['tijera', 'Para pegar o cortar'],
      ['pegante', 'Para pegar o cortar'],
      ['regla', 'Para medir'],
      ['metro', 'Para medir'],
      ['cinta', ['Para pegar o cortar', 'Para medir']],
    ],
  ),
  m(
    ['Madera', 'Metal', 'Plástico'],
    [
      ['mesa', 'Madera'],
      ['puerta', 'Madera'],
      ['llave', 'Metal'],
      ['olla', 'Metal'],
      ['botella', 'Plástico'],
      ['balde', 'Plástico'],
      ['silla', ['Madera', 'Plástico']],
      ['cuchara', ['Madera', 'Metal']],
    ],
  ),
  m(
    ['En equipo', 'Individual', 'Con raqueta'],
    [
      ['fútbol', 'En equipo'],
      ['baloncesto', 'En equipo'],
      ['natación', 'Individual'],
      ['atletismo', 'Individual'],
      ['bádminton', ['Individual', 'Con raqueta']],
      ['tenis', ['Individual', 'Con raqueta']],
      ['voleibol', 'En equipo'],
      ['tenis de mesa', 'Con raqueta'],
    ],
  ),
  m(
    ['Mañana', 'Tarde', 'Noche'],
    [
      ['desayuno', 'Mañana'],
      ['despertador', 'Mañana'],
      ['almuerzo', 'Tarde'],
      ['atardecer', 'Tarde'],
      ['cena', 'Noche'],
      ['pijama', 'Noche'],
      ['café', ['Mañana', 'Tarde']],
      ['tarea', ['Tarde', 'Noche']],
    ],
  ),
  m(
    ['Rojo', 'Verde', 'Amarillo'],
    [
      ['fresa', 'Rojo'],
      ['cereza', 'Rojo'],
      ['lechuga', 'Verde'],
      ['hoja', 'Verde'],
      ['banano', 'Amarillo'],
      ['girasol', 'Amarillo'],
      ['limón', ['Verde', 'Amarillo']],
      ['mango', ['Verde', 'Amarillo']],
    ],
  ),
  m(
    ['Se enciende', 'Se abre', 'Se llena'],
    [
      ['luz', 'Se enciende'],
      ['estufa', 'Se enciende'],
      ['puerta', 'Se abre'],
      ['ventana', 'Se abre'],
      ['vaso', 'Se llena'],
      ['tanque', 'Se llena'],
      ['nevera', ['Se abre', 'Se enciende']],
      ['llave del agua', ['Se abre', 'Se llena']],
    ],
  ),
  m(
    ['De hoja', 'De raíz', 'De fruto'],
    [
      ['lechuga', 'De hoja'],
      ['espinaca', 'De hoja'],
      ['zanahoria', 'De raíz'],
      ['yuca', 'De raíz'],
      ['pepino', 'De fruto'],
      ['ahuyama', 'De fruto'],
      ['remolacha', ['De raíz', 'De hoja']],
      ['pimentón', 'De fruto'],
    ],
  ),
  m(
    ['En la casa', 'En la calle', 'En el parque'],
    [
      ['cama', 'En la casa'],
      ['nevera', 'En la casa'],
      ['semáforo', 'En la calle'],
      ['andén', 'En la calle'],
      ['columpio', 'En el parque'],
      ['fuente', 'En el parque'],
      ['banca', ['En la calle', 'En el parque']],
      ['bicicleta', ['En la casa', 'En la calle']],
    ],
  ),
  m(
    ['Se escucha', 'Se ve', 'Se toca'],
    [
      ['música', 'Se escucha'],
      ['campana', 'Se escucha'],
      ['arcoíris', 'Se ve'],
      ['estrella', 'Se ve'],
      ['arena', 'Se toca'],
      ['lana', 'Se toca'],
      ['piano', ['Se escucha', 'Se toca']],
      ['fuego', ['Se ve', 'Se toca']],
    ],
  ),
  m(
    ['Se usa en la lluvia', 'Se usa con el sol', 'Se usa con frío'],
    [
      ['paraguas', 'Se usa en la lluvia'],
      ['botas de caucho', 'Se usa en la lluvia'],
      ['bloqueador', 'Se usa con el sol'],
      ['gafas', 'Se usa con el sol'],
      ['bufanda', 'Se usa con frío'],
      ['guantes', 'Se usa con frío'],
      ['sombrero', ['Se usa con el sol', 'Se usa en la lluvia']],
      ['chaqueta', ['Se usa con frío', 'Se usa en la lluvia']],
    ],
  ),
  m(
    ['Se cocina', 'Se come crudo', 'Se toma'],
    [
      ['arroz', 'Se cocina'],
      ['fríjol', 'Se cocina'],
      ['lechuga', 'Se come crudo'],
      ['mango', 'Se come crudo'],
      ['jugo', 'Se toma'],
      ['agua de panela', 'Se toma'],
      ['zanahoria', ['Se cocina', 'Se come crudo']],
      ['sopa', ['Se cocina', 'Se toma']],
    ],
  ),
];

export const MESAS_DE_NIVEL_1 = NIVEL_1;
export const MESAS_DE_NIVEL_2 = NIVEL_2;
export const MESAS_DE_NIVEL_3 = NIVEL_3;

/** Sin tildes, en minusculas y con guiones: la clave estable de una cesta o un elemento. */
export function clave(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20)
    .replace(/-+$/g, '');
}

function aParametros(mesa: Mesa, numero: number) {
  const azar = generadorDe(0x3c3c0000 + numero);
  const cestas = mesa.cestas.map((nombre) => ({ clave: clave(nombre), nombre }));
  const elementos = revolver(azar, mesa.elementos).map(([nombre, sitio]) => ({
    clave: clave(nombre),
    nombre,
    cesta: Array.isArray(sitio) ? sitio.map(clave) : clave(sitio as string),
  }));

  return {
    modo: 'cestas',
    indicacion:
      cestas.length === 2
        ? 'Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.'
        : 'Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.',
    cestas,
    elementos,
    puntosMaximos: elementos.length,
  };
}

export function sesionesDeCestas(): SesionDeContenido[] {
  const niveles = [
    { mesas: NIVEL_1, nivel: 1, nombre: 'Dos cestas' },
    { mesas: NIVEL_2, nivel: 2, nombre: 'Tres cestas' },
    { mesas: NIVEL_3, nivel: 3, nombre: 'Tres cestas, con dudas' },
  ] as const;
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  for (const { mesas, nivel, nombre } of niveles) {
    mesas.forEach((mesa, dentro) => {
      numero += 1;
      sesiones.push({
        id: idDeSesion('COG-03', numero),
        titulo: `${nombre}: ${mesa.cestas.join(', ').toLowerCase()} (${dentro + 1})`.slice(0, 100),
        nivel,
        parametros: aParametros(mesa, numero),
      });
    });
  }

  return sesiones;
}
