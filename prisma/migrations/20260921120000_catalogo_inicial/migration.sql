-- ============================================================================
-- El catalogo: tres categorias y nueve actividades (SCRUM-9)
-- ============================================================================
--
-- Hasta aqui CATEGORIA y ACTIVIDAD existian vacias. Una base con el esquema
-- perfecto y sin una sola actividad es una aplicacion que abre y no tiene nada
-- que ofrecer, asi que esto es lo que faltaba para poder decir que la
-- persistencia esta terminada.
--
-- Las tres categorias son las del entregable: Cognicion, Bienestar y
-- Emociones. Las actividades se siembran con la migracion y no desde el panel
-- porque tienen que ser **las mismas en los tres ambientes**: si PRE y PROD
-- tuvieran catalogos distintos, probar en PRE dejaria de significar algo.
--
-- Los identificadores de las actividades estan escritos a mano por la misma
-- razon. Un `gen_random_uuid()` daria valores distintos en cada ambiente, y
-- entonces el resultado que alguien registro en PRE no podria compararse con el
-- de PROD ni moverse entre ambientes.
--
-- La categoria de cada actividad, en cambio, se busca por nombre en vez de
-- fijarla. Asi la migracion no falla en una base que ya tuviera una categoria
-- con ese nombre y otro identificador, que es exactamente lo que pasa en las
-- bases de desarrollo donde han corrido las pruebas de integracion.
--
-- ---------------------------------------------------------------------------
-- Sobre los textos
-- ---------------------------------------------------------------------------
--
-- Cada actividad trae los suyos porque el mismo nivel significa cosas
-- distintas segun lo que se hizo. "Requiere atencion" en un juego de memoria
-- es un dia flojo; en un cuestionario sobre la carga de la semana es otra
-- cosa. Un texto generico para las dos seria, en el mejor caso, inutil.
--
-- Ninguno nombra una condicion, ninguno opina sobre la persona y ninguno
-- afirma nada que no salga de lo que ella misma registro. Todos hablan de la
-- actividad o del dia. Hay una prueba automatica que falla si alguno usara
-- lenguaje clinico.
--
-- El puntaje no aparece en ninguno: no se le ensena a la persona. Lo que ve es
-- este texto.
--
-- ---------------------------------------------------------------------------
-- Sobre los umbrales
-- ---------------------------------------------------------------------------
--
-- Cada actividad quiebra donde le corresponde y no en tercios. Los
-- cuestionarios de carga cortan antes (0,30 y 0,60) que los juegos (0,40 y
-- 0,70): equivocarse hacia el lado de mostrar apoyo de mas es preferible a
-- callar cuando hacia falta, y es el mismo criterio con el que el asistente
-- decide ensenar las lineas de atencion.
--
-- Son un punto de partida, no una medida. Se ajustan con una migracion nueva
-- cuando haya uso real; no se editan estas filas a mano en el panel, o los
-- ambientes dejarian de coincidir.
--
-- ON CONFLICT DO NOTHING sin columna: asi volver a aplicar las migraciones
-- sobre una base que ya las tiene no falla, y tampoco falla si alguien ya
-- tenia una categoria con uno de estos nombres.

-- ---------------------------------------------------------------------------
-- Categorias
-- ---------------------------------------------------------------------------

INSERT INTO "categoria" ("id_categoria", "nombre", "descripcion")
VALUES
  (
    '0ca70000-0000-4000-8000-000000000001',
    'Cognicion',
    'Ejercicios breves de memoria, atencion y concentracion. Miden como respondiste hoy en esa tarea concreta, no como eres.'
  ),
  (
    '0ca70000-0000-4000-8000-000000000002',
    'Bienestar',
    'Registro de habitos que sostienen el dia a dia: descanso, movimiento y la carga de la semana.'
  ),
  (
    '0ca70000-0000-4000-8000-000000000003',
    'Emociones',
    'Espacio para registrar como te sientes, sin tener que explicarlo ni resolverlo.'
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Cognicion: mas puntaje es mejor
-- ---------------------------------------------------------------------------
--
-- Son juegos. El puntaje sube cuando la tarea sale bien, asi que la escala va
-- en la direccion intuitiva. El texto insiste en que un dia suelto no dice
-- nada, porque el rendimiento en estas tareas se mueve muchisimo con el
-- descanso y con lo que haya pasado ese dia.

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000001',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognicion'),
    'Parejas de cartas',
    'juego',
    'Encuentra las parejas iguales en el menor numero de intentos. Dura unos tres minutos.',
    TRUE,
    'mayor_es_mejor',
    20.00,
    '{"primero": 0.40, "segundo": 0.70}',
    '{"favorable": "Hoy encontraste las parejas con soltura.", "en_seguimiento": "Un dia corriente en este ejercicio. Cambia bastante segun como hayas dormido.", "requiere_atencion": "Hoy costo mas de lo habitual. Un dia suelto no dice nada: mira como va a lo largo de la semana."}'
  ),
  (
    '0acd0000-0000-4000-8000-000000000002',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognicion'),
    'Secuencia de numeros',
    'juego',
    'Repite la secuencia que aparece en pantalla. Cada acierto la alarga un digito.',
    TRUE,
    'mayor_es_mejor',
    12.00,
    '{"primero": 0.35, "segundo": 0.70}',
    '{"favorable": "Sostuviste secuencias largas sin perderte.", "en_seguimiento": "Llegaste hasta donde llega la mayoria de los dias.", "requiere_atencion": "Hoy la secuencia se te escapo antes. Suele pasar cuando hay prisa o poco descanso."}'
  ),
  (
    '0acd0000-0000-4000-8000-000000000003',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognicion'),
    'Encuentra la diferencia',
    'juego',
    'Localiza lo que cambia entre dos imagenes muy parecidas, contra reloj.',
    TRUE,
    'mayor_es_mejor',
    15.00,
    '{"primero": 0.40, "segundo": 0.75}',
    '{"favorable": "Mantuviste la atencion puesta todo el ejercicio.", "en_seguimiento": "La atencion te acompano a ratos, que es lo normal.", "requiere_atencion": "Hoy costo sostener la mirada en el detalle. Puede ser cansancio, sin mas."}'
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Bienestar: dos escalas distintas y una sin puntaje
-- ---------------------------------------------------------------------------
--
-- Aqui se ve por que la direccion de la escala tiene que declararla cada
-- actividad. En "Como dormiste" un numero alto es bueno. En "La carga de tu
-- semana" un numero alto es justo lo contrario. Derivar el nivel igual para
-- las dos le mostraria un resultado favorable a quien peor esta.
--
-- "Movimiento del dia" no puntua: es una bitacora, y ponerle nota a si alguien
-- salio a caminar convierte un registro en un examen.

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000004',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Como dormiste anoche',
    'bitacora',
    'Cuatro preguntas rapidas sobre la noche: a que hora, cuanto, cuantas veces te despertaste y como amaneciste.',
    TRUE,
    'mayor_es_mejor',
    10.00,
    '{"primero": 0.40, "segundo": 0.70}',
    '{"favorable": "Anoche descansaste bien, segun lo que registraste.", "en_seguimiento": "Una noche irregular. Si se repite varios dias, suele notarse en lo demas.", "requiere_atencion": "Anoche descansaste poco. Acostarte a la misma hora es el cambio con mas efecto y el mas facil de sostener."}'
  ),
  (
    '0acd0000-0000-4000-8000-000000000005',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'La carga de tu semana',
    'preguntas',
    'Como viene la semana en estudio, tiempo propio y descanso. Se responde una vez por semana.',
    TRUE,
    'mayor_requiere_atencion',
    20.00,
    '{"primero": 0.30, "segundo": 0.60}',
    '{"favorable": "Semana llevadera, por lo que cuentas.", "en_seguimiento": "Se acumulo algo esta semana. Vale la pena mirar que se puede soltar.", "requiere_atencion": "Esta semana viene cargada. Si se repite, contarselo a alguien de confianza ayuda mas que aguantar."}'
  ),
  (
    '0acd0000-0000-4000-8000-000000000006',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento del dia',
    'bitacora',
    'Anota si te moviste hoy y cuanto. Sin metas ni objetivos: es un registro, no un reto.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Emociones
-- ---------------------------------------------------------------------------
--
-- La categoria mas delicada, y por eso la que menos afirma. Los textos no
-- interpretan lo que la persona siente ni le proponen una explicacion: repiten
-- lo que ella registro y, cuando la carga es alta, senalan que hay donde
-- apoyarse.
--
-- "Un momento bueno del dia" no puntua a proposito. Es lo contrario de una
-- medicion: existe para dejar constancia de algo que estuvo bien, y un numero
-- al lado lo estropearia.

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000007',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Como te sientes hoy',
    'preguntas',
    'Cinco preguntas breves sobre el animo de hoy. Menos de un minuto.',
    TRUE,
    'mayor_requiere_atencion',
    10.00,
    '{"primero": 0.30, "segundo": 0.60}',
    '{"favorable": "Hoy lo registraste como un dia tranquilo.", "en_seguimiento": "Un dia con altibajos, de los que tiene cualquiera.", "requiere_atencion": "Hoy lo estas pasando mal. No tienes que resolverlo hoy, y no tienes que hacerlo en solitario."}'
  ),
  (
    '0acd0000-0000-4000-8000-000000000008',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Que te esta pesando',
    'preguntas',
    'Marca lo que te esta costando estos dias. Puedes elegir varias o ninguna.',
    TRUE,
    'mayor_requiere_atencion',
    15.00,
    '{"primero": 0.30, "segundo": 0.60}',
    '{"favorable": "Ahora mismo no hay mucho pesandote, por lo que marcaste.", "en_seguimiento": "Hay un par de cosas ocupando espacio estos dias.", "requiere_atencion": "Se te estan juntando varias cosas a la vez. Ponerlo en palabras con alguien suele quitarle peso."}'
  ),
  (
    '0acd0000-0000-4000-8000-000000000009',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Un momento bueno del dia',
    'bitacora',
    'Una sola cosa del dia que estuviera bien, por pequena que sea. No hay respuesta incorrecta.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL
  )
ON CONFLICT DO NOTHING;
