import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * EMO-07 · «Mi lugar tranquilo» (motor `guia_paso_a_paso`, modo `pasos`, con `elecciones`): 40 sesiones.
 *
 * Imaginar un lugar con los cinco sentidos. 8 ambientes (bosque, paramo, rio, playa, cafetal, patio, montana y
 * «mi cuarto») x 5 momentos (amanecer, mediodia, tarde, lluvia y noche) = 40 guiones de 5 pasos.
 *
 * **Se elige siempre, nada se impone**: cada sesion es un momento y ofrece **tres ambientes** entre los que la
 * persona escoge antes de empezar (8 ternas por momento: cada ambiente sale en tres). «Si un lugar te incomoda,
 * cambialo» esta a la vista durante toda la guia. En cada terna el primero es un lugar abierto, sin agua
 * profunda ni espacios cerrados (baranda de la ficha). El agua es siempre poco profunda y tranquila; la lluvia es
 * fina y sin tormenta. Nunca «imagina que estas a salvo» (si no lo esta, suena falso). Pide revision de
 * psicologia.
 *
 * Cada guion se compone de piezas de cada ambiente y de cada momento: se escribe cada pieza una vez (8 x 5 y 5 x
 * 4 frases) y no 40 guiones enteros, y la revision se hace sobre las piezas.
 */

type Ambiente = 'bosque' | 'paramo' | 'rio' | 'playa' | 'cafetal' | 'patio' | 'montana' | 'cuarto';
type Momento = 'amanecer' | 'mediodia' | 'tarde' | 'lluvia' | 'noche';

interface Piezas {
  readonly nombre: string;
  readonly lugar: string;
  readonly ver: string;
  readonly oir: string;
  readonly oler: string;
  readonly sentir: string;
}

const AMBIENTES: Readonly<Record<Ambiente, Piezas>> = {
  bosque: {
    nombre: 'El bosque',
    lugar: 'un bosque de árboles altos',
    ver: 'troncos, hojas y luz que se cuela entre las ramas',
    oir: 'pájaros y hojas que se mueven',
    oler: 'tierra húmeda y madera',
    sentir: 'el suelo firme bajo los pies',
  },
  paramo: {
    nombre: 'El páramo',
    lugar: 'un páramo abierto, con frailejones',
    ver: 'frailejones y un cielo muy grande',
    oir: 'el viento, lejos y suave',
    oler: 'hierba fresca y aire frío',
    sentir: 'el aire fresco en la cara',
  },
  rio: {
    nombre: 'La orilla de un río',
    lugar: 'la orilla de un río, con agua poco profunda y tranquila',
    ver: 'piedras claras y el agua que se mueve despacio',
    oir: 'el agua corriendo despacio sobre las piedras',
    oler: 'agua limpia y piedra tibia',
    sentir: 'la brisa en los brazos',
  },
  playa: {
    nombre: 'Una playa amplia',
    lugar: 'una playa amplia, lejos del agua',
    ver: 'arena clara y el horizonte, sin prisa',
    oir: 'olas suaves a lo lejos y el viento',
    oler: 'sal suave y sol en la piel',
    sentir: 'la arena tibia bajo los pies',
  },
  cafetal: {
    nombre: 'Un cafetal',
    lugar: 'un cafetal con sus hileras de matas',
    ver: 'hileras de matas con frutos y hojas verdes',
    oir: 'pájaros y el sonido de las hojas',
    oler: 'café y tierra',
    sentir: 'la sombra de las matas',
  },
  patio: {
    nombre: 'Un patio con plantas',
    lugar: 'un patio con plantas y macetas',
    ver: 'macetas, flores y una pared de color',
    oir: 'un sonido lejano de la casa y el viento',
    oler: 'plantas y tierra mojada',
    sentir: 'el piso bajo los pies',
  },
  montana: {
    nombre: 'Una ladera de montaña',
    lugar: 'una ladera de montaña con un camino ancho',
    ver: 'el camino que sube y el valle al fondo',
    oir: 'el viento y algún pájaro',
    oler: 'pasto y aire limpio',
    sentir: 'el sol en la cara',
  },
  cuarto: {
    nombre: 'Mi cuarto',
    lugar: 'tu cuarto, tal como más te gusta',
    ver: 'tus cosas favoritas, ordenadas a tu gusto',
    oir: 'los sonidos de la casa, bajitos',
    oler: 'ropa limpia y algo que te gusta',
    sentir: 'tu cama o tu silla favorita',
  },
};

interface PiezasDelMomento {
  readonly nombre: string;
  readonly frase: string;
  readonly luz: string;
  readonly sonido: string;
  readonly temperatura: string;
}

const MOMENTOS: Readonly<Record<Momento, PiezasDelMomento>> = {
  amanecer: {
    nombre: 'Al amanecer',
    frase: 'al amanecer',
    luz: 'La luz es suave y apenas empieza el día.',
    sonido: 'El día apenas despierta.',
    temperatura: 'El aire está fresco.',
  },
  mediodia: {
    nombre: 'Al mediodía',
    frase: 'al mediodía',
    luz: 'La luz es clara y alta.',
    sonido: 'Todo suena claro.',
    temperatura: 'El aire está tibio.',
  },
  tarde: {
    nombre: 'Al final de la tarde',
    frase: 'al final de la tarde',
    luz: 'La luz se pone dorada y baja.',
    sonido: 'Los sonidos se vuelven lentos.',
    temperatura: 'El aire se va enfriando.',
  },
  lluvia: {
    nombre: 'Con lluvia suave',
    frase: 'mientras llueve suave',
    luz: 'El cielo está gris y la luz es tenue.',
    sonido: 'La lluvia suena fina, sin tormenta.',
    temperatura: 'El aire está fresco y húmedo.',
  },
  noche: {
    nombre: 'De noche',
    frase: 'de noche, con poca luz',
    luz: 'Hay poca luz y todo se ve en calma.',
    sonido: 'Los sonidos son pocos y suaves.',
    temperatura: 'El aire está fresco y quieto.',
  },
};

const ORDEN_DE_MOMENTOS: readonly Momento[] = ['amanecer', 'mediodia', 'tarde', 'lluvia', 'noche'];

/** Las ocho ternas: el primero de cada una es un lugar abierto y sin agua. Cada ambiente sale en tres. */
const TERNAS: readonly (readonly [Ambiente, Ambiente, Ambiente])[] = [
  ['bosque', 'rio', 'patio'],
  ['paramo', 'playa', 'cuarto'],
  ['cafetal', 'bosque', 'playa'],
  ['montana', 'patio', 'rio'],
  ['patio', 'paramo', 'cuarto'],
  ['bosque', 'montana', 'cuarto'],
  ['cafetal', 'paramo', 'rio'],
  ['montana', 'cafetal', 'playa'],
];

function guion(ambiente: Ambiente, momento: Momento) {
  const a = AMBIENTES[ambiente];
  const m = MOMENTOS[momento];

  return [
    {
      titulo: 'Imagina el lugar',
      texto: `Imagina ${a.lugar}, ${m.frase}. Puedes cambiarlo por otro si no te acomoda.`,
    },
    { titulo: 'Mira', texto: `Mira lo que hay: ${a.ver}. ${m.luz}` },
    { titulo: 'Escucha', texto: `Escucha: ${a.oir}. ${m.sonido}` },
    {
      titulo: 'Siente y huele',
      texto: `Siente ${a.sentir}. Nota el olor a ${a.oler}. ${m.temperatura}`,
    },
    {
      titulo: 'Quédate un rato',
      texto: 'Quédate aquí un rato, a tu manera. Es tu lugar y puedes volver cuando quieras.',
    },
  ];
}

export function sesionesDeLugar(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let posicion = 0;

  for (const momento of ORDEN_DE_MOMENTOS) {
    for (const terna of TERNAS) {
      posicion += 1;
      sesiones.push(
        sesion(
          'EMO-07',
          posicion,
          `${MOMENTOS[momento].nombre}: ${terna.map((a) => AMBIENTES[a].nombre).join(', ')}`,
          {
            modo: 'pasos',
            advertenciaInicial:
              'Tú eliges el lugar. Si alguno te incomoda, cámbialo por otro o suéltalo: no pasa nada.',
            intro: `Elige un lugar para imaginar ${MOMENTOS[momento].frase}. Los tres son opcionales.`,
            avance: 'manual',
            elecciones: terna.map((ambiente) => ({
              clave: ambiente,
              nombre: AMBIENTES[ambiente].nombre,
              descripcion: `${AMBIENTES[ambiente].lugar}, ${MOMENTOS[momento].frase}.`.replace(
                /^./u,
                (c) => c.toUpperCase(),
              ),
              pasos: guion(ambiente, momento),
            })),
            cierre: 'Ese lugar es tuyo. Puedes volver cuando quieras.',
            avisoSiempre: 'Si un lugar te incomoda, cámbialo.',
          },
        ),
      );
    }
  }

  return sesiones;
}
