import { clave } from '../cognicion/cestas.ts';
import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * EMO-01 · «Rueda de emociones» (motor `cuestionario_corto`, modo `rueda`): 40 sesiones.
 *
 * Ponerle nombre, con matiz, a lo que se siente: la persona elige un circulo grande (6), despues uno mas fino (30)
 * y, si quiere, el mas fino (90, las emociones con su definicion de una linea). Puede escribir una linea opcional,
 * que pasa por la deteccion de riesgo como cualquier texto libre (R8).
 *
 * Las 40 sesiones son 6 «puertas de entrada» (por el cuerpo, la situacion, el color, el clima, la energia y
 * «hoy frente a ayer») x ~7 cierres, y la rueda es la misma en todas.
 *
 * Barandas de la ficha: **no hay emociones buenas ni malas**; ninguna definicion interpreta («eso significa
 * que...») ni sugiere una causa; nada suena a diagnostico (R6: sin ansiedad, depresion ni parecidos) y la lista
 * incluye emociones que cuesta nombrar. Pide revision de psicologia: la taxonomia y las definiciones.
 *
 * Pesa unos 12 KB por sesion (la rueda entera viaja en la sesion de hoy): se mide antes de crecer (ADR 0030).
 */

interface Hoja {
  readonly nombre: string;
  readonly definicion: string;
}

interface Matiz {
  readonly nombre: string;
  readonly hojas: readonly [Hoja, Hoja, Hoja];
}

interface Familia {
  readonly nombre: string;
  readonly matices: readonly [Matiz, Matiz, Matiz, Matiz, Matiz];
}

const h = (nombre: string, definicion: string): Hoja => ({ nombre, definicion });
const m = (nombre: string, a: Hoja, b: Hoja, c: Hoja): Matiz => ({ nombre, hojas: [a, b, c] });

export const FAMILIAS: readonly Familia[] = [
  {
    nombre: 'Alegría',
    matices: [
      m(
        'Contento',
        h('Contento', 'Estar bien con lo que pasa ahora.'),
        h('Satisfacción', 'Sentir que algo salió como esperabas o mejor.'),
        h('Bienestar', 'Sentir que, por ahora, las cosas están bien.'),
      ),
      m(
        'Entusiasmo',
        h('Entusiasmo', 'Ganas de que algo empiece.'),
        h('Ilusión', 'Esperar algo con cariño.'),
        h('Ánimo', 'Sentir fuerza para hacer algo.'),
      ),
      m(
        'Gratitud',
        h('Gratitud', 'Valorar lo que alguien o algo te dio.'),
        h('Alivio', 'Sentir que algo pesado ya pasó.'),
        h('Cariño', 'Sentir afecto por alguien.'),
      ),
      m(
        'Diversión',
        h('Diversión', 'Pasarla bien, reírte.'),
        h('Ganas de jugar', 'Querer jugar sin ningún objetivo.'),
        h('Ligereza', 'Sentir que las cosas pesan poco.'),
      ),
      m(
        'Orgullo',
        h('Orgullo', 'Valorar algo que hiciste o lograste.'),
        h('Logro', 'Sentir que terminaste algo que querías.'),
        h('Valoración', 'Reconocer lo que vales o lo que haces.'),
      ),
    ],
  },
  {
    nombre: 'Tristeza',
    matices: [
      m(
        'Desánimo',
        h('Desánimo', 'Sentir pocas ganas de hacer cosas.'),
        h('Cansancio por dentro', 'Sentirte sin energía, aunque hayas descansado.'),
        h('Desgano', 'No tener ganas de nada en particular.'),
      ),
      m(
        'Pena',
        h('Pena', 'Sentir dolor por algo que pasó.'),
        h('Nostalgia', 'Extrañar algo o a alguien del pasado.'),
        h('Añoranza', 'Querer volver a algo que ya no está.'),
      ),
      m(
        'Soledad',
        h('Soledad', 'Sentir que falta compañía.'),
        h('Vacío', 'Sentir que algo falta y no saber qué.'),
        h('Lejanía', 'Sentir que estás lejos de los demás.'),
      ),
      m(
        'Decepción',
        h('Decepción', 'Sentir que algo no fue lo que esperabas.'),
        h('Desilusión', 'Perder una ilusión que tenías.'),
        h('Resignación', 'Aceptar algo con pena.'),
      ),
      m(
        'Melancolía',
        h('Melancolía', 'Una tristeza suave y pensativa.'),
        h('Desconsuelo', 'Mucha pena y pocas ganas de seguir.'),
        h('Recuerdo querido', 'Un recuerdo que duele un poco y también se quiere.'),
      ),
    ],
  },
  {
    nombre: 'Miedo',
    matices: [
      m(
        'Inquietud',
        h('Inquietud', 'Sentir que algo podría pasar y no saber qué.'),
        h('Nervios', 'Sentir el cuerpo agitado antes de algo.'),
        h('Preocupación', 'Darle vueltas a algo que podría salir mal.'),
      ),
      m(
        'Temor',
        h('Temor', 'Sentir que algo te puede hacer daño.'),
        h('Susto', 'Una reacción rápida ante algo inesperado.'),
        h('Recelo', 'No confiar del todo en algo.'),
      ),
      m(
        'Inseguridad',
        h('Inseguridad', 'Dudar de ti o de lo que haces.'),
        h('Vergüenza', 'Sentir que los demás te miran con juicio.'),
        h('Timidez', 'Sentir un freno para mostrarte.'),
      ),
      m(
        'Agobio',
        h('Agobio', 'Sentir que son demasiadas cosas a la vez.'),
        h('Presión', 'Sentir que se espera algo de ti.'),
        h('Bloqueo', 'No saber por dónde empezar.'),
      ),
      m(
        'Incertidumbre',
        h('Incertidumbre', 'No saber qué va a pasar.'),
        h('Duda', 'No tener claro qué hacer.'),
        h('Confusión', 'Sentir que las ideas están revueltas.'),
      ),
    ],
  },
  {
    nombre: 'Enojo',
    matices: [
      m(
        'Irritación',
        h('Irritación', 'Sentir que algo te molesta una y otra vez.'),
        h('Fastidio', 'Sentir que algo es pesado de aguantar.'),
        h('Impaciencia', 'Querer que algo pase más rápido.'),
      ),
      m(
        'Rabia',
        h('Rabia', 'Sentir mucha fuerza por algo que te pareció injusto.'),
        h('Indignación', 'Enojo por algo que consideras injusto.'),
        h('Resentimiento', 'Guardar molestia por algo del pasado.'),
      ),
      m(
        'Frustración',
        h('Frustración', 'Querer algo y no poder lograrlo.'),
        h('Impotencia', 'Sentir que no puedes cambiar algo.'),
        h('Hartazgo', 'Sentir que ya es demasiado de lo mismo.'),
      ),
      m(
        'Celos y envidia',
        h('Celos', 'Temer perder algo o a alguien.'),
        h('Envidia', 'Querer lo que otra persona tiene.'),
        h('Rivalidad', 'Sentirte en competencia.'),
      ),
      m(
        'Desacuerdo',
        h('Desacuerdo', 'No estar de acuerdo con algo.'),
        h('Molestia', 'Algo no te cayó bien.'),
        h('Terquedad', 'Querer sostener tu idea.'),
      ),
    ],
  },
  {
    nombre: 'Calma',
    matices: [
      m(
        'Tranquilidad',
        h('Tranquilidad', 'Sentir que todo está en su sitio.'),
        h('Serenidad', 'Estar en calma incluso con ruido alrededor.'),
        h('Descanso', 'Sentir que el cuerpo y la mente pueden parar.'),
      ),
      m(
        'Seguridad',
        h('Seguridad', 'Sentir que puedes con lo que viene.'),
        h('Confianza', 'Creer en ti o en alguien.'),
        h('Firmeza', 'Saber lo que quieres hacer.'),
      ),
      m(
        'Presente',
        h('Atención', 'Estar en lo que haces, sin distraerte.'),
        h('Curiosidad', 'Querer saber o explorar algo.'),
        h('Interés', 'Que algo te llame la atención.'),
      ),
      m(
        'Conexión',
        h('Compañía', 'Sentir que alguien está contigo.'),
        h('Pertenencia', 'Sentir que formas parte de un grupo.'),
        h('Ternura', 'Sentir un cuidado suave hacia algo o alguien.'),
      ),
      m(
        'Aceptación',
        h('Aceptación', 'Dejar que algo sea como es.'),
        h('Paciencia', 'Poder esperar sin molestia.'),
        h('Equilibrio', 'Sentir que tus cosas están parejas.'),
      ),
    ],
  },
  {
    nombre: 'Sorpresa y lo difícil de nombrar',
    matices: [
      m(
        'Asombro',
        h('Asombro', 'Quedarte mirando algo que te impresiona.'),
        h('Admiración', 'Valorar mucho algo o a alguien.'),
        h('Maravilla', 'Sentir que algo es muy bonito o muy grande.'),
      ),
      m(
        'Desconcierto',
        h('Desconcierto', 'No saber cómo reaccionar.'),
        h('Extrañeza', 'Sentir que algo no encaja.'),
        h('Perplejidad', 'Quedarte sin palabras.'),
      ),
      m(
        'Mezcla',
        h('Emociones mezcladas', 'Sentir varias cosas a la vez.'),
        h('Ambivalencia', 'Querer y no querer algo a la vez.'),
        h('Agridulce', 'Alegría y tristeza juntas.'),
      ),
      m(
        'Sin nombre',
        h('Sin palabras', 'Sentir algo que todavía no sabes nombrar.'),
        h('Neutralidad', 'No sentir nada en particular.'),
        h('Cambio', 'Sentir que algo se está moviendo.'),
      ),
      m(
        'Energía',
        h('Energía alta', 'Mucho movimiento por dentro.'),
        h('Energía baja', 'Poco movimiento por dentro.'),
        h('Quietud', 'Mucha calma y poco movimiento.'),
      ),
    ],
  },
];

const PUERTAS = [
  {
    titulo: 'Por el cuerpo',
    texto:
      'Piensa dónde lo notas en el cuerpo: el pecho, el estómago, los hombros. Con eso en mente, elige el círculo que más se acerque.',
  },
  {
    titulo: 'Por la situación',
    texto: 'Piensa en lo que pasó hoy. ¿Qué círculo se acerca más a cómo te sentiste?',
  },
  {
    titulo: 'Por el color',
    texto:
      'Si lo que sientes tuviera un color, ¿cuál sería? Elige el círculo que mejor le queda a ese color.',
  },
  {
    titulo: 'Por el clima',
    texto:
      'Si lo que sientes fuera un clima (lluvia, sol, viento, neblina), ¿cuál sería? Elige el círculo que más se parezca.',
  },
  {
    titulo: 'Por la energía',
    texto:
      '¿Cuánta energía tienes ahora: mucha, poca, algo en medio? Elige el círculo que más se acerque.',
  },
  {
    titulo: 'Hoy frente a ayer',
    texto: 'Compara con ayer, sin juzgar: ¿hoy se parece o es distinto? Elige el círculo de hoy.',
  },
] as const;

const CIERRES = [
  'Nombrarlo ya es un paso. Gracias.',
  'Gracias por ponerle nombre.',
  'Lo que sientes tiene lugar aquí.',
  'Con palabras o sin ellas, vale.',
  'Gracias por tomarte este momento.',
  'Cualquier emoción es bienvenida aquí.',
  'Otro día puedes elegir otra: cambiar es normal.',
] as const;

/** La rueda completa, la misma en las 40 sesiones. */
export function laRueda() {
  return FAMILIAS.map((familia) => ({
    clave: clave(familia.nombre),
    nombre: familia.nombre,
    hijos: familia.matices.map((matiz) => ({
      clave: `m-${clave(matiz.nombre)}`.slice(0, 20),
      nombre: matiz.nombre,
      hijos: matiz.hojas.map((hoja) => ({
        clave: `e-${clave(hoja.nombre)}`.slice(0, 20),
        nombre: hoja.nombre,
        definicion: hoja.definicion,
      })),
    })),
  }));
}

export function sesionesDeRueda(): SesionDeContenido[] {
  const rueda = laRueda();
  const sesiones: SesionDeContenido[] = [];
  let posicion = 0;

  for (const puerta of PUERTAS) {
    for (const [j, cierre] of CIERRES.entries()) {
      // 6 puertas x 7 cierres = 42; la ficha pide 40, asi que la ultima puerta se queda con cinco cierres.
      if (posicion >= 40) {
        break;
      }

      posicion += 1;
      sesiones.push(
        sesion('EMO-01', posicion, `${puerta.titulo}, cierre ${j + 1}`, {
          modo: 'rueda',
          indicacion:
            'Elige un círculo grande, después uno más fino y, si quieres, el más fino de todos. No hay emociones buenas ni malas.',
          puerta: { titulo: puerta.titulo, texto: puerta.texto },
          rueda,
          linea: { invitacion: 'Si quieres, cuéntalo en una línea.', largoMaximo: 200 },
          cierre,
        }),
      );
    }
  }

  return sesiones;
}
