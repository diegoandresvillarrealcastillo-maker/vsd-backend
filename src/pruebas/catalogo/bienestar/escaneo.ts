import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * BIE-06 · «Escaneo corporal» (motor `guia_paso_a_paso`, modo `pasos`): 40 sesiones.
 *
 * Llevar la atencion al cuerpo, zona por zona, **sin cambiar nada**. Seis zonas (pies, piernas, abdomen,
 * pecho, brazos y cabeza). 3 ordenes (de abajo a arriba, de arriba a abajo y solo una mitad) x 3 posiciones
 * (en la silla, de pie y en la cama) x 3 ritmos (20, 30 y 45 segundos por zona, como sugerencia) = 27 con la
 * voz calida, y 13 mas con otra voz (7 mas seca y 6 mas breve) = 40.
 *
 * Barandas de la ficha: **«puedes saltarte una zona o parar cuando quieras» siempre a la vista**; no se
 * insiste en sensaciones; **nada de «relajate»** (es una orden, no una invitacion); y puede no ser adecuada
 * para quien tiene dolor cronico o ha vivido violencia o trauma, asi que la advertencia ofrece cambiar a la
 * respiracion o cerrar. Pide revision de psicologia.
 *
 * El avance es manual (un toque); los segundos son una sugerencia dentro del texto, nunca un reloj (R4).
 */

type Zona = 'pies' | 'piernas' | 'abdomen' | 'pecho' | 'brazos' | 'cabeza';
type Voz = 'calida' | 'seca' | 'breve';
type Posicion = 'silla' | 'pie' | 'cama';
type Orden = 'abajo-arriba' | 'arriba-abajo' | 'mitad';

const DE_ABAJO_ARRIBA: readonly Zona[] = [
  'pies',
  'piernas',
  'abdomen',
  'pecho',
  'brazos',
  'cabeza',
];

const NOMBRE_DE_LA_ZONA: Readonly<Record<Zona, string>> = {
  pies: 'Los pies',
  piernas: 'Las piernas',
  abdomen: 'El abdomen',
  pecho: 'El pecho',
  brazos: 'Los brazos y las manos',
  cabeza: 'La cabeza y la cara',
};

/** Lo que toca el cuerpo, segun la posicion. */
const APOYO: Readonly<Record<Posicion, { pies: string; cuerpo: string }>> = {
  silla: { pies: 'el suelo', cuerpo: 'la silla' },
  pie: { pies: 'el suelo', cuerpo: 'tu propio peso' },
  cama: { pies: 'la cama', cuerpo: 'la cama' },
};

const GUION: Readonly<Record<Voz, Readonly<Record<Zona, string>>>> = {
  calida: {
    pies: 'Lleva la atención a tus pies. Nota si sientes el contacto con {pies}: el peso, la temperatura, lo que haya. No hace falta cambiar nada.',
    piernas:
      'Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo.',
    abdomen:
      'Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla.',
    pecho:
      'Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay.',
    brazos:
      'Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura.',
    cabeza:
      'Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo.',
  },
  seca: {
    pies: 'Pies. Nota el contacto con {pies}.',
    piernas: 'Piernas. Nota si pesan o no, si están tensas o sueltas.',
    abdomen: 'Abdomen. Nota cómo se mueve al respirar.',
    pecho: 'Pecho. Nota si se mueve y si siente algo.',
    brazos: 'Brazos y manos. Nota el contacto y la temperatura.',
    cabeza: 'Cabeza y cara. Nota la frente, los ojos y la mandíbula.',
  },
  breve: {
    pies: 'Tus pies: lo que sientas.',
    piernas: 'Tus piernas: lo que sientas.',
    abdomen: 'Tu abdomen: lo que sientas.',
    pecho: 'Tu pecho: lo que sientas.',
    brazos: 'Tus brazos y manos: lo que sientas.',
    cabeza: 'Tu cabeza y tu cara: lo que sientas.',
  },
};

const INTRO_POR_POSICION: Readonly<Record<Posicion, string>> = {
  silla: 'Siéntate con la espalda cómoda y los pies en el suelo.',
  pie: 'Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale.',
  cama: 'Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados.',
};

const LUGAR: Readonly<Record<Posicion, string>> = {
  silla: 'en la silla',
  pie: 'de pie',
  cama: 'en la cama',
};

const ADVERTENCIA =
  'Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.';

function zonasDe(orden: Orden, indice: number): readonly Zona[] {
  switch (orden) {
    case 'abajo-arriba':
      return DE_ABAJO_ARRIBA;
    case 'arriba-abajo':
      return [...DE_ABAJO_ARRIBA].reverse();
    case 'mitad':
      // La mitad de abajo y la de arriba se alternan.
      return indice % 2 === 0 ? DE_ABAJO_ARRIBA.slice(0, 3) : DE_ABAJO_ARRIBA.slice(3);
  }
}

function sesionDe(
  posicion: number,
  orden: Orden,
  cuerpo: Posicion,
  voz: Voz,
  segundos: number,
  indice: number,
): SesionDeContenido {
  const zonas = zonasDe(orden, indice);
  const apoyo = APOYO[cuerpo];
  const sugerencia =
    voz === 'breve'
      ? ''
      : ` Quédate aquí unos ${segundos} segundos, o pasa a la siguiente cuando quieras.`;
  const nombreDelOrden: Readonly<Record<Orden, string>> = {
    'abajo-arriba': 'de abajo a arriba',
    'arriba-abajo': 'de arriba a abajo',
    mitad: zonas[0] === 'pies' ? 'solo la mitad de abajo' : 'solo la mitad de arriba',
  };
  const minutos = Math.max(1, Math.round((zonas.length * segundos) / 60));

  return sesion(
    'BIE-06',
    posicion,
    `Escaneo ${nombreDelOrden[orden]}, ${LUGAR[cuerpo]}, ${voz === 'calida' ? `${segundos} s` : `voz ${voz}`}`,
    {
      modo: 'pasos',
      advertenciaInicial: ADVERTENCIA,
      intro: `${INTRO_POR_POSICION[cuerpo]} Vamos a recorrer el cuerpo con la atención, zona por zona, ${nombreDelOrden[orden]}. No hay nada que cambiar. Dura unos ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}.`,
      avance: 'manual',
      pasos: zonas.map((zona) => ({
        titulo: NOMBRE_DE_LA_ZONA[zona],
        texto: `${GUION[voz][zona].replace('{pies}', apoyo.pies)}${sugerencia}`,
      })),
      cierre: 'Gracias por escucharte un rato.',
      avisoSiempre: 'Puedes saltarte una zona o parar cuando quieras.',
    },
  );
}

export function sesionesDeEscaneo(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  const ordenes: readonly Orden[] = ['abajo-arriba', 'arriba-abajo', 'mitad'];
  const posiciones: readonly Posicion[] = ['silla', 'pie', 'cama'];
  const ritmos = [20, 30, 45] as const;
  let posicion = 0;

  // 27 con la voz calida.
  for (const orden of ordenes) {
    for (const cuerpo of posiciones) {
      for (const segundos of ritmos) {
        posicion += 1;
        sesiones.push(sesionDe(posicion, orden, cuerpo, 'calida', segundos, posicion));
      }
    }
  }

  // 13 con otra voz: siete mas secas y seis mas breves, combinando orden y posicion.
  const otras: readonly { voz: Voz; orden: Orden; cuerpo: Posicion }[] = [
    { voz: 'seca', orden: 'abajo-arriba', cuerpo: 'silla' },
    { voz: 'seca', orden: 'arriba-abajo', cuerpo: 'silla' },
    { voz: 'seca', orden: 'abajo-arriba', cuerpo: 'cama' },
    { voz: 'seca', orden: 'arriba-abajo', cuerpo: 'pie' },
    { voz: 'seca', orden: 'mitad', cuerpo: 'silla' },
    { voz: 'seca', orden: 'mitad', cuerpo: 'cama' },
    { voz: 'seca', orden: 'abajo-arriba', cuerpo: 'pie' },
    { voz: 'breve', orden: 'abajo-arriba', cuerpo: 'silla' },
    { voz: 'breve', orden: 'arriba-abajo', cuerpo: 'cama' },
    { voz: 'breve', orden: 'mitad', cuerpo: 'pie' },
    { voz: 'breve', orden: 'abajo-arriba', cuerpo: 'cama' },
    { voz: 'breve', orden: 'arriba-abajo', cuerpo: 'silla' },
    { voz: 'breve', orden: 'mitad', cuerpo: 'cama' },
  ];

  for (const { voz, orden, cuerpo } of otras) {
    posicion += 1;
    sesiones.push(sesionDe(posicion, orden, cuerpo, voz, 30, posicion));
  }

  return sesiones;
}
