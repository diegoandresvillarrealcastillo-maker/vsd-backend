import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * EMO-03 · «Ancla 5-4-3-2-1» (motor `guia_paso_a_paso`, modo `pasos`): 40 sesiones.
 *
 * Volver al presente con los sentidos: 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que
 * saboreas. 5 entornos (en casa, en la calle, en el transporte, estudiando y de noche) x 4 guiones (corto, largo,
 * solo mirar y solo oir) x 2 voces (seca y calida) = 40.
 *
 * Barandas de la ficha: **no es una herramienta para una crisis**, y por eso la frase «si lo necesitas, hay
 * personas que pueden acompanarte» queda a la vista durante toda la guia, con el acceso a las lineas de
 * atencion; **no hay tiempo** (el avance es manual); **no obliga a cerrar los ojos**; nunca «relajate». Pide
 * revision de psicologia.
 */

type Entorno = 'casa' | 'calle' | 'transporte' | 'estudio' | 'noche';
type Guion = 'corto' | 'largo' | 'mirar' | 'oir';
type Voz = 'seca' | 'calida';

interface Ejemplos {
  readonly nombre: string;
  readonly ver: string;
  readonly tocar: string;
  readonly oir: string;
  readonly oler: string;
  readonly sabor: string;
  /** Cosas para mirar solamente, y sonidos para escuchar solamente. */
  readonly miradas: readonly [string, string, string];
  readonly sonidos: readonly [string, string, string];
}

const ENTORNOS: Readonly<Record<Entorno, Ejemplos>> = {
  casa: {
    nombre: 'en casa',
    ver: 'la lámpara, una taza, el piso, una ventana, algo de color',
    tocar: 'tu ropa, la silla, el piso bajo los pies, algo tibio entre las manos',
    oir: 'la nevera, pasos lejanos, tu respiración',
    oler: 'café, jabón, la ropa limpia',
    sabor: 'el sabor de tu boca, o lo último que tomaste',
    miradas: ['los muebles', 'las cosas que tienen color', 'las formas de la ventana y la puerta'],
    sonidos: ['los electrodomésticos', 'lo que viene de la calle', 'los sonidos de la casa'],
  },
  calle: {
    nombre: 'en la calle',
    ver: 'un árbol, un poste, alguien de lejos, una fachada, el cielo',
    tocar: 'el aire en la cara, tu ropa, el suelo bajo los pies, el bolso o las llaves',
    oir: 'carros, voces, pájaros',
    oler: 'el aire, algo que cocinan',
    sabor: 'el sabor de tu boca, o lo último que comiste',
    miradas: ['las fachadas', 'las cosas que tienen color', 'las formas de los letreros'],
    sonidos: ['los motores', 'las voces', 'los pájaros o el viento'],
  },
  transporte: {
    nombre: 'en el transporte',
    ver: 'una ventana, el asiento, un letrero, la luz, algo que se mueve afuera',
    tocar: 'el asiento, tu bolso, la barra, el movimiento del vehículo',
    oir: 'el motor, voces, música lejana',
    oler: 'el aire del vehículo, tu ropa',
    sabor: 'el sabor de tu boca',
    miradas: [
      'lo que pasa por la ventana',
      'las cosas que tienen color',
      'las formas de los letreros',
    ],
    sonidos: ['el motor', 'las voces', 'los sonidos de la calle'],
  },
  estudio: {
    nombre: 'mientras estudias',
    ver: 'tu cuaderno, la pantalla, un lápiz, la mesa, la luz',
    tocar: 'el lápiz, la hoja, la silla, la mesa',
    oir: 'las teclas, las hojas que pasan, el silencio',
    oler: 'papel, tu bebida',
    sabor: 'el sabor de tu boca, o un sorbo de lo que tengas',
    miradas: [
      'lo que hay sobre la mesa',
      'las cosas que tienen color',
      'las formas de los objetos',
    ],
    sonidos: ['las teclas', 'las hojas', 'el silencio entre los sonidos'],
  },
  noche: {
    nombre: 'de noche',
    ver: 'una luz lejana, tu cama, las sombras, la ventana, el techo',
    tocar: 'la cobija, la almohada, tu ropa, tus manos',
    oir: 'el silencio, un carro lejano, tu respiración',
    oler: 'la ropa limpia, el aire de la noche',
    sabor: 'el sabor de tu boca, o lo último que bebiste',
    miradas: [
      'las luces y las sombras',
      'los contornos de las cosas',
      'lo que se ve por la ventana',
    ],
    sonidos: ['el silencio', 'lo que suena lejos', 'tu respiración'],
  },
};

const AVISO_SIEMPRE = 'Si lo necesitas, hay personas que pueden acompañarte.';

const ADVERTENCIA =
  'No hace falta cerrar los ojos. Cada paso pasa cuando tú quieras, y puedes parar cuando quieras.';

interface Plantilla {
  readonly titulo: string;
  readonly texto: (e: Ejemplos, voz: Voz) => string;
}

const CALIDA = ' Sin prisa.';

function pasosDe(entorno: Entorno, guion: Guion, voz: Voz): { titulo: string; texto: string }[] {
  const e = ENTORNOS[entorno];
  const cola = voz === 'calida' ? CALIDA : '';
  const amable = (seca: string, calida: string) => (voz === 'calida' ? calida : seca);

  const corto: Plantilla[] = [
    {
      titulo: 'Cinco cosas que ves',
      texto: (x) => `Nombra cinco cosas que ves, por ejemplo: ${x.ver}.${cola}`,
    },
    {
      titulo: 'Cuatro cosas que tocas',
      texto: (x) => `Nota cuatro cosas que puedes tocar o sentir: ${x.tocar}.${cola}`,
    },
    { titulo: 'Tres cosas que oyes', texto: (x) => `Escucha tres sonidos: ${x.oir}.${cola}` },
    {
      titulo: 'Dos olores',
      texto: (x) => `Nota dos olores, o recuerda dos que te gusten: ${x.oler}.${cola}`,
    },
    { titulo: 'Un sabor', texto: (x) => `Nota un sabor: ${x.sabor}.${cola}` },
  ];

  if (guion === 'corto') {
    return corto.map((p) => ({ titulo: p.titulo, texto: p.texto(e, voz) }));
  }

  if (guion === 'largo') {
    const extra = [
      amable(' Tómate el tiempo que necesites.', ' Tómate el tiempo que necesites, sin apuro.'),
      amable(
        ' Si algo no se alcanza a notar, pasa al siguiente.',
        ' Si algo no se alcanza a notar, no pasa nada: sigue.',
      ),
      amable(' Si te cuesta, quédate con uno.', ' Si te cuesta, con uno basta.'),
      amable(
        ' Si no huele a nada, también vale.',
        ' Si no huele a nada, también vale; el aire cuenta.',
      ),
      amable(' Con uno es suficiente.', ' Con uno es suficiente. Aquí estás.'),
    ];

    return corto.map((p, i) => ({ titulo: p.titulo, texto: `${p.texto(e, 'seca')}${extra[i]}` }));
  }

  if (guion === 'mirar') {
    const [a, b, c] = e.miradas;

    return [
      {
        titulo: 'Cinco cosas',
        texto: `Mira ${e.nombre} y fíjate en cinco cosas distintas.${cola}`,
      },
      {
        titulo: 'Cuatro colores',
        texto: `Busca cuatro colores a tu alrededor, empezando por ${b}.${cola}`,
      },
      { titulo: 'Tres formas', texto: `Fíjate en tres formas: ${c}.${cola}` },
      {
        titulo: 'Luz y sombra',
        texto: `Busca dos lugares con luz y dos con sombra, mirando ${a}.${cola}`,
      },
      {
        titulo: 'Una cosa que te guste',
        texto: `Elige una cosa que te guste mirar y quédate con ella un momento.${cola}`,
      },
    ];
  }

  const [a, b, c] = e.sonidos;

  return [
    {
      titulo: 'Cinco sonidos',
      texto: `Escucha ${e.nombre} y distingue cinco sonidos distintos.${cola}`,
    },
    {
      titulo: 'Cuatro cercanos',
      texto: `Busca cuatro sonidos cercanos, empezando por ${a}.${cola}`,
    },
    { titulo: 'Tres lejanos', texto: `Busca tres sonidos lejanos, como ${b}.${cola}` },
    { titulo: 'Dos suaves', texto: `Busca dos sonidos suaves: ${c}.${cola}` },
    {
      titulo: 'El que más te guste',
      texto: `Quédate con el sonido que más te guste, un momento.${cola}`,
    },
  ];
}

const NOMBRE_DEL_GUION: Readonly<Record<Guion, string>> = {
  corto: 'corto',
  largo: 'largo',
  mirar: 'solo mirar',
  oir: 'solo oír',
};

export function sesionesDeAncla(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  const entornos = Object.keys(ENTORNOS) as Entorno[];
  const guiones: Guion[] = ['corto', 'largo', 'mirar', 'oir'];
  const voces: Voz[] = ['seca', 'calida'];
  let posicion = 0;

  for (const entorno of entornos) {
    for (const guion of guiones) {
      for (const voz of voces) {
        posicion += 1;
        sesiones.push(
          sesion(
            'EMO-03',
            posicion,
            `${ENTORNOS[entorno].nombre}, ${NOMBRE_DEL_GUION[guion]}, voz ${voz === 'calida' ? 'cálida' : 'seca'}`,
            {
              modo: 'pasos',
              advertenciaInicial: ADVERTENCIA,
              intro: `Un ejercicio de cinco pasos para volver al presente con los sentidos, ${ENTORNOS[entorno].nombre}. No hay tiempo: pasa al siguiente cuando quieras.`,
              avance: 'manual',
              pasos: pasosDe(entorno, guion, voz),
              cierre: 'Aquí estás. Gracias por darte este rato.',
              avisoSiempre: AVISO_SIEMPRE,
              conLineasDeAyuda: true,
            },
          ),
        );
      }
    }
  }

  return sesiones;
}
