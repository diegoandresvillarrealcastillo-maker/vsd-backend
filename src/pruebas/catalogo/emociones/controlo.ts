import { clave } from '../cognicion/cestas.ts';
import { sesion } from '../comun.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * EMO-04 · «Lo que si controlo» (motor `clasificar`, modo `cestas`, **sin respuesta correcta**): 40 sesiones.
 *
 * Una situacion del dia en tarjetas (**nunca se pide la propia**: es la de otra persona, neutra) y seis
 * tarjetas que la persona lleva a «Depende de mi», «Depende en parte» o «No depende de mi». Es un ejercicio de
 * reflexion: no se puntua, y no hay una cesta «correcta». Opcionalmente, una linea sobre que haria.
 *
 * Barandas de la ficha: **no culpa** («si tu quisieras, podrias») ni minimiza problemas estructurales (dinero,
 * violencia, salud): siempre existen «Depende en parte» y «No depende de mi», y las tarjetas de dinero no dicen
 * que bastaria con querer. Nunca una conclusion que diga como debe sentirse. Pide revision de psicologia.
 *
 * 40 situaciones x 6 tarjetas = 240 tarjetas.
 */

type Situacion = readonly [
  situacion: string,
  tarjetas: readonly [string, string, string, string, string, string],
];

const SITUACIONES: readonly Situacion[] = [
  [
    'Una persona tiene un examen la próxima semana.',
    [
      'Cuánto estudia hoy',
      'Qué preguntas pondrán',
      'A qué hora duerme',
      'Qué tan difícil sea',
      'Pedir ayuda a un compañero',
      'Cómo organiza su semana',
    ],
  ],
  [
    'Una persona tiene una entrevista de trabajo mañana.',
    [
      'Qué ropa se pone',
      'Si llega a tiempo',
      'Qué preguntas le harán',
      'Cómo se prepara',
      'Si el puesto ya tiene a alguien en mente',
      'Cómo respira antes de entrar',
    ],
  ],
  [
    'Una persona viaja en bus seis horas.',
    [
      'Qué lleva para el camino',
      'El tráfico de la vía',
      'Con quién se sienta',
      'Qué escucha durante el viaje',
      'Si hay un retraso',
      'A qué hora sale',
    ],
  ],
  [
    'Una persona se muda a otra casa.',
    [
      'Cómo empaca sus cosas',
      'El precio del arriendo',
      'Cuándo empieza a ordenar',
      'Cómo son los vecinos',
      'A quién le pide ayuda',
      'El clima del día de la mudanza',
    ],
  ],
  [
    'Un equipo tiene un proyecto con fecha límite.',
    [
      'Su parte del trabajo',
      'Lo que hagan los demás',
      'Cómo se comunica con el equipo',
      'La fecha de entrega',
      'Cuándo pide ayuda',
      'Cómo descansa entre tareas',
    ],
  ],
  [
    'Una persona debe pagar una cuenta esta semana.',
    [
      'Cuándo la paga',
      'Cuánto cuesta',
      'Si pide más plazo',
      'En qué más gasta',
      'Si le llega a tiempo un ingreso',
      'Cómo organiza lo que tiene',
    ],
  ],
  [
    'Una persona se encuentra con alguien que no ve hace tiempo.',
    [
      'Qué le cuenta',
      'Cómo la recibe la otra persona',
      'A qué hora se ven',
      'Qué pregunta',
      'Si el encuentro sale como imaginó',
      'Si decide irse cuando quiera',
    ],
  ],
  [
    'Hay una fiesta de familia.',
    [
      'A qué hora llega',
      'Cómo se comporta cada invitado',
      'Qué lleva para compartir',
      'De qué se habla',
      'Cuánto tiempo se queda',
      'Si hay un momento a solas',
    ],
  ],
  [
    'Es lunes y hay muchas tareas.',
    [
      'Por cuál empieza',
      'Cuántas tareas llegaron',
      'Cuándo toma un descanso',
      'Qué pide que le ayuden a hacer',
      'Cómo anota lo pendiente',
      'Lo que dicen los demás de su trabajo',
    ],
  ],
  [
    'Hay un día de lluvia con planes al aire libre.',
    [
      'Si lleva paraguas',
      'Que llueva o no',
      'Si cambia el plan',
      'A qué hora sale',
      'Cómo se siente con el cambio',
      'Qué hace en lugar de eso',
    ],
  ],
  [
    'Una persona expone frente a la clase.',
    [
      'Cómo prepara su exposición',
      'Cómo reaccionan los demás',
      'Cuántas veces ensaya',
      'Si hay preguntas difíciles',
      'Cómo respira antes de empezar',
      'El tiempo que le dan',
    ],
  ],
  [
    'Una persona debe hacer un trámite en una oficina.',
    [
      'Qué documentos lleva',
      'Cuánto dura la espera',
      'A qué hora llega',
      'Cómo trata a quien la atiende',
      'Si el sistema funciona',
      'Qué lleva para la espera',
    ],
  ],
  [
    'Una persona tiene una conversación difícil con una amistad.',
    [
      'Cómo empieza la conversación',
      'Cómo reacciona la otra persona',
      'Qué dice y qué calla',
      'Cuándo elige hablar',
      'Si lo hablan en persona o por mensaje',
      'Si el final es el que quería',
    ],
  ],
  [
    'Cambian el horario de trabajo.',
    [
      'Cómo se organiza con el nuevo horario',
      'La decisión de la empresa',
      'Cómo lo conversa con su jefe',
      'Qué hace con su tiempo libre',
      'Cómo se lo cuenta a su familia',
      'Cuándo empieza a cambiar sus rutinas',
    ],
  ],
  [
    'Hay un partido importante.',
    [
      'Cuánto entrena antes',
      'Lo que haga el otro equipo',
      'Cómo duerme la noche anterior',
      'El resultado',
      'Cómo juega su parte',
      'Cómo se siente al terminar',
    ],
  ],
  [
    'Un trabajo no salió como se esperaba.',
    [
      'Qué aprende de eso',
      'Lo que opinan los demás',
      'Cómo lo revisa con calma',
      'Si le dan otra oportunidad',
      'Qué hace distinto la próxima vez',
      'Cuánto tiempo se queda pensando en eso',
    ],
  ],
  [
    'A una persona se le dañó el celular.',
    [
      'Cuándo lo lleva a revisar',
      'Por qué se dañó',
      'Cuánto cuesta arreglarlo',
      'Cómo se comunica mientras tanto',
      'Qué hace con su tiempo sin él',
      'Si lo arreglan rápido',
    ],
  ],
  [
    'El transporte se retrasó.',
    [
      'A quién avisa',
      'Cuánto tarda en llegar',
      'Qué hace mientras espera',
      'Si busca otra ruta',
      'Cómo se habla a sí misma',
      'Lo que piensan los demás por la demora',
    ],
  ],
  [
    'Llegó una invitación a último momento.',
    [
      'Si acepta o no',
      'Que la hayan avisado tarde',
      'Cómo responde',
      'Qué plan tenía antes',
      'Cómo se siente con el cambio',
      'Cuándo contesta',
    ],
  ],
  [
    'Una receta nueva no salió como se esperaba.',
    [
      'Qué hace con el resultado',
      'Que el horno estuviera muy caliente',
      'Si lo intenta otra vez',
      'Con qué la acompaña',
      'Qué ingredientes tenía',
      'Cómo lo toma',
    ],
  ],
  [
    'Una persona espera la nota de un examen.',
    [
      'En qué piensa mientras espera',
      'Qué nota salga',
      'Qué hace mientras tanto',
      'Cuándo publican la nota',
      'Con quién lo conversa',
      'Cómo se cuida esos días',
    ],
  ],
  [
    'Un vecino hace mucho ruido.',
    [
      'Si lo conversa con él',
      'Que haga ruido',
      'Qué hace para dormir mejor',
      'A qué hora lo hace',
      'A quién le pide ayuda',
      'Cómo se siente cuando ocurre',
    ],
  ],
  [
    'Una persona tiene poco dinero esta semana.',
    [
      'En qué lo usa primero',
      'Cuánto tiene',
      'Qué pide prestado, si lo necesita',
      'Qué planes gratis elige',
      'Si le llega un ingreso',
      'Cómo lo habla con quienes viven con ella',
    ],
  ],
  [
    'Una persona se cambia de ciudad.',
    [
      'Cómo conoce el lugar',
      'El clima de la ciudad nueva',
      'A quién conoce primero',
      'Cómo mantiene sus lazos',
      'Qué lleva de su casa anterior',
      'Cuánto tarda en sentirse en casa',
    ],
  ],
  [
    'Hay una discusión en el grupo de mensajes.',
    [
      'Si responde o no',
      'Lo que escriben los demás',
      'Cuándo sale del grupo a descansar',
      'Cómo escribe lo que piensa',
      'Cómo se siente al leerlo',
      'Si lo habla aparte con alguien',
    ],
  ],
  [
    'Un correo importante no tiene respuesta.',
    [
      'Cuándo vuelve a escribir',
      'Cuándo responden',
      'Qué hace mientras espera',
      'Cómo redacta su mensaje',
      'Si llama o escribe de otra forma',
      'Cuánto se preocupa',
    ],
  ],
  [
    'Una tarea se fue acumulando.',
    [
      'Por dónde empieza',
      'Que haya tanto por hacer',
      'Cuánto tiempo le dedica hoy',
      'A quién le pide ayuda',
      'Cómo la divide en pedazos',
      'Cuánto se exige',
    ],
  ],
  [
    'Un compañero se va de la empresa.',
    [
      'Qué le dice al despedirse',
      'La decisión de irse',
      'Cómo mantiene el contacto',
      'Cómo se organiza el trabajo',
      'Cómo se siente con el cambio',
      'Cuándo se ve con él',
    ],
  ],
  [
    'Hay un paseo con la familia.',
    [
      'Qué lleva',
      'A dónde van',
      'Lo que opine cada quien',
      'A qué hora se regresan',
      'Cuánto disfruta el momento',
      'El clima',
    ],
  ],
  [
    'Un trabajo escolar tiene fecha de entrega.',
    [
      'Cuándo empieza a hacerlo',
      'Qué pide el profesor',
      'Cómo se organiza',
      'Lo que hagan sus compañeros',
      'Cuántas veces lo revisa',
      'La fecha de entrega',
    ],
  ],
  [
    'Una persona tiene un día con poca energía.',
    [
      'Qué cosas hace hoy',
      'Que haya poca energía',
      'Cuándo descansa',
      'A qué le dice que no',
      'A quién le cuenta cómo está',
      'Cómo se trata a sí misma',
    ],
  ],
  [
    'Un plan se canceló.',
    [
      'Qué hace con ese tiempo',
      'Que se haya cancelado',
      'Cómo lo comunica a otros',
      'Cómo se siente con el cambio',
      'Si propone otro día',
      'Con quién lo reemplaza',
    ],
  ],
  [
    'Una persona espera en una fila larga.',
    [
      'Qué hace mientras espera',
      'Cuánto dura la fila',
      'Si cambia de fila',
      'Cómo respira',
      'Lo que hacen los demás',
      'Qué piensa mientras espera',
    ],
  ],
  [
    'Hay una noticia del barrio que preocupa.',
    [
      'Cuánto se informa y cuándo',
      'Lo que ocurre en el barrio',
      'Con quién lo conversa',
      'Qué hace para cuidarse',
      'Si desconecta un rato',
      'Si ayuda en algo cercano',
    ],
  ],
  [
    'Una persona debe decidir entre dos opciones.',
    [
      'Qué información busca',
      'Lo que opinen los demás',
      'Cuándo decide',
      'Qué aprende de cada opción',
      'Lo que pasa después',
      'A quién le pide consejo',
    ],
  ],
  [
    'Un cumpleaños llega sin muchos planes.',
    [
      'Qué hace para celebrarlo',
      'Quién se acuerda',
      'A quién invita',
      'Cómo se trata ese día',
      'Qué espera del día',
      'Cómo lo pasa',
    ],
  ],
  [
    'La cuenta de un servicio de la casa subió.',
    [
      'Cómo revisa el consumo',
      'El precio del servicio',
      'Qué cambia en sus hábitos',
      'A quién le pregunta',
      'Cómo se organiza con ese gasto',
      'Si reclama o consulta',
    ],
  ],
  [
    'Un compañero no cumplió con su parte.',
    [
      'Cómo se lo dice',
      'Que no haya cumplido',
      'Cómo organiza lo que falta',
      'A quién le cuenta',
      'Qué hace distinto la próxima vez',
      'Cómo se siente al respecto',
    ],
  ],
  [
    'Una persona empieza un nuevo curso.',
    [
      'Cómo se presenta',
      'Cómo son los demás',
      'Cuánto estudia al principio',
      'A quién le pregunta',
      'Cómo es el profesor',
      'Cómo se cuida las primeras semanas',
    ],
  ],
  [
    'Llega un fin de semana largo.',
    [
      'Cómo lo organiza',
      'El clima',
      'Qué descansa y qué hace',
      'Con quién lo pasa',
      'Lo que haga el resto',
      'Cómo se acompaña si está sola',
    ],
  ],
];

const CESTAS = [
  { clave: 'mi', nombre: 'Depende de mí' },
  { clave: 'parte', nombre: 'Depende en parte' },
  { clave: 'no', nombre: 'No depende de mí' },
] as const;

export function sesionesDeControlo(): SesionDeContenido[] {
  return SITUACIONES.map(([situacion, tarjetas], i) =>
    sesion('EMO-04', i + 1, situacion.replace(/\.$/u, ''), {
      modo: 'cestas',
      indicacion: `${situacion} Lleva cada tarjeta a donde te parezca que va.`,
      cestas: CESTAS,
      elementos: tarjetas.map((texto, k) => ({
        clave: `${clave(texto).slice(0, 17)}-${k + 1}`,
        nombre: texto,
      })),
      linea: { invitacion: 'Si quieres, escribe una cosa que harías tú.', largoMaximo: 200 },
      cierre: 'Separarlo ya ordena un poco. Gracias.',
    }),
  );
}
