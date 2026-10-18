import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * BIE-07 · «Antes de dormir» y BIE-08 · «El descanso de manana» (motor `cuestionario_corto`, sin puntaje).
 *
 * - **BIE-07** (modo `lista`, solo de noche): una lista de 4 gestos suaves, que se marcan los que se hicieron o
 *   se haran. 40 listas armadas de un banco de **30 gestos**. No hay obligacion de marcar nada. Misma baranda de
 *   salud del sueno que BIE-03: sin alcohol ni suplementos ni medicamentos.
 * - **BIE-08** (modo `preguntas`): planear a que hora y como bajar el ritmo esta noche. 8 preguntas de plan x 5
 *   gestos de apoyo = 40. El aviso de la noche se **ofrece**, no se activa solo: la persona decide en su perfil.
 *   No se pide la hora de levantarse como meta ni se sugieren horas de sueno «ideales».
 *
 * Los dos piden revision (BIE-07 junto con BIE-03, profesional; BIE-08, ligera).
 */

const GESTOS = [
  'Dejar el celular lejos de la cama',
  'Bajar la luz del cuarto',
  'Dejar la ropa de mañana lista',
  'Ventilar el cuarto',
  'Dejar un vaso de agua cerca',
  'Lavarte la cara con agua tibia',
  'Cepillarte los dientes con calma',
  'Silenciar las notificaciones',
  'Ordenar lo que quedó en la mesa',
  'Anotar un pendiente de mañana en un papel',
  'Estirar el cuello y los hombros con suavidad',
  'Poner música suave a poco volumen',
  'Cerrar las cortinas',
  'Revisar que la casa esté cerrada',
  'Ponerte la pijama',
  'Preparar la cobija que necesitas',
  'Respirar con calma tres veces',
  'Pensar en algo agradable del día',
  'Apagar el televisor',
  'Dejar la alarma lista',
  'Dejar los zapatos en su lugar',
  'Lavarte las manos con calma',
  'Apagar las luces que no necesitas',
  'Leer unas páginas',
  'Dejar el cargador lejos de la cama',
  'Tomar una ducha tibia',
  'Dejar la mochila o el bolso listos',
  'Acomodar la almohada',
  'Cerrar las pantallas',
  'Decirle buenas noches a alguien de la casa',
] as const;

const GESTOS_POR_LISTA = 4;

/** La lista numero `n` (desde 0): cuatro gestos que nunca se repiten, y ninguna lista igual a otra. */
function gestosDe(n: number): string[] {
  // 7, 11 y 13 son primos con 30: cuatro saltos seguidos nunca repiten un gesto. Las primeras 30 listas empiezan
  // en cada uno de los 30 gestos con saltos de 11; las otras 10 usan saltos de 13, que arman otras listas.
  const salto = n < GESTOS.length ? 11 : 13;
  const inicio = (n * 7) % GESTOS.length;

  return Array.from(
    { length: GESTOS_POR_LISTA },
    (_, k) => GESTOS[(inicio + k * salto) % GESTOS.length] as string,
  );
}

export function sesionesDeAntesDeDormir(): SesionDeContenido[] {
  return Array.from({ length: 40 }, (_, n) => {
    const gestos = gestosDe(n);

    return sesion('BIE-07', n + 1, `Antes de dormir, ${n + 1}`, {
      modo: 'lista',
      indicacion:
        'Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.',
      items: gestos.map((texto, i) => ({ clave: `g${i + 1}`, texto })),
      cierre: 'Que descanses. Esto ya quedó.',
    });
  });
}

// ---------------------------------------------------------------------------
// BIE-08
// ---------------------------------------------------------------------------

interface PreguntaDePlan {
  readonly texto: string;
  readonly opciones: readonly string[];
}

const PREGUNTAS_DE_PLAN: readonly PreguntaDePlan[] = [
  {
    texto: '¿Cuánto rato antes de acostarte quieres bajar el ritmo?',
    opciones: ['Unos 15 minutos', 'Media hora', 'Una hora', 'Lo decido esta noche'],
  },
  {
    texto: '¿Dónde dejarás el celular esta noche?',
    opciones: ['Lejos de la cama', 'En otro cuarto', 'Con el sonido bajo', 'Aún no lo sé'],
  },
  {
    texto: '¿Qué te gustaría dejar listo para mañana?',
    opciones: ['La ropa', 'La mochila o el bolso', 'El desayuno', 'Nada, así está bien'],
  },
  {
    texto: '¿Cómo te gustaría cerrar el día?',
    opciones: ['Con música suave', 'Leyendo un rato', 'En silencio', 'Hablando con alguien'],
  },
  {
    texto: '¿Qué te ayudaría a soltar el día?',
    opciones: ['Anotar pendientes', 'Una ducha tibia', 'Estirarme', 'Aún no lo sé'],
  },
  {
    texto: '¿Cómo te gustaría despertar mañana?',
    opciones: [
      'Con una alarma suave',
      'Con la luz de la ventana',
      'Con calma, sin prisa',
      'Aún no lo sé',
    ],
  },
  {
    texto: '¿Qué parte de la noche te gustaría cuidar más?',
    opciones: [
      'El rato antes de acostarme',
      'El momento de dormirme',
      'Lo que pase de madrugada',
      'No lo sé',
    ],
  },
  {
    texto: '¿Qué te gustaría que fuera distinto esta noche?',
    opciones: [
      'La hora de dormir',
      'El ruido o la luz',
      'Lo que hago antes de acostarme',
      'Nada, así está bien',
    ],
  },
];

const GESTOS_DE_APOYO = [
  'Dejar la ropa lista',
  'Poner una alarma de aviso para empezar a bajar el ritmo',
  'Bajar la luz del cuarto',
  'Dejar el cuarto ordenado',
  'Anotar un pendiente en un papel',
] as const;

const clave = (indice: number) => `o${indice + 1}`;

export function sesionesDeDescanso(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let posicion = 0;

  for (const [i, plan] of PREGUNTAS_DE_PLAN.entries()) {
    for (const [j, gesto] of GESTOS_DE_APOYO.entries()) {
      posicion += 1;
      sesiones.push(
        sesion('BIE-08', posicion, `Plan ${i + 1}, gesto ${j + 1}: ${gesto}`.slice(0, 100), {
          modo: 'preguntas',
          indicacion: 'Sin respuestas buenas ni malas: es solo para planear la noche.',
          preguntas: [
            { clave: 'hora', texto: '¿A qué hora piensas acostarte?', tipo: 'hora' },
            {
              clave: 'plan',
              texto: plan.texto,
              tipo: 'opcion',
              opciones: plan.opciones.map((texto, k) => ({ clave: clave(k), texto })),
            },
            {
              clave: 'apoyo',
              texto: `Un gesto de apoyo: ${gesto.charAt(0).toLowerCase()}${gesto.slice(1)}. ¿Te sirve para esta noche?`,
              tipo: 'opcion',
              opciones: [
                { clave: 'si', texto: 'Sí, lo haré' },
                { clave: 'quiza', texto: 'Quizá' },
                { clave: 'hoy-no', texto: 'Hoy no' },
              ],
            },
          ],
          enlaceAlAviso: true,
          cierre: 'Plan hecho. Mañana lo cuentas.',
        }),
      );
    }
  }

  return sesiones;
}
