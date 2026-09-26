-- ---------------------------------------------------------------------------
--  Tildes y enes en todo lo que lee la persona
-- ---------------------------------------------------------------------------
--
-- El catalogo y los recursos de apoyo se sembraron sin tildes, siguiendo la
-- costumbre del codigo. Fue un error de criterio: en el codigo esa costumbre
-- evita problemas de codificacion entre editores y terminales, pero estos
-- textos **no son codigo**. Son lo que aparece en pantalla.
--
-- "Cognicion", "habitos", "Secuencia de numeros" o "por pequena que sea" se
-- leen mal en una aplicacion de bienestar, y la ultima ademas cambia de
-- significado. En una herramienta que trata temas delicados, el cuidado del
-- texto es parte del producto.
--
-- ## Que NO se toca
--
-- Las columnas `tipo`, `tema`, `cobertura` y `direccion_escala` se quedan
-- igual. Parecen texto pero son **claves internas**: el asistente empareja por
-- `tema = 'sueno'` y el dominio compara `direccion_escala` contra valores
-- fijos del codigo. Ponerles tilde romperia el emparejamiento sin dar ningun
-- error, que es la peor forma de romper algo.
--
-- Tampoco se tocan los nombres de las categorias como identificador: 'Cognicion'
-- si cambia a 'Cognición' porque es lo que se muestra, y las actividades se
-- relacionan por `id_categoria`, no por nombre.
--
-- ## Por que una migracion y no editar la anterior
--
-- Una migracion aplicada no se edita: PRE y PROD ya la corrieron, y cambiarla
-- dejaria el historial diciendo una cosa y las bases otra.

-- ---------------------------------------------------------------------------
-- Categorias
-- ---------------------------------------------------------------------------

-- Las categorias se emparejan por `nombre` y no por identificador, al reves
-- que las actividades. El motivo: `nombre` es UNIQUE y la siembra usaba
-- ON CONFLICT DO NOTHING, asi que en una base donde ya existiera una categoria
-- con ese nombre —por ejemplo una que dejara una prueba— la fila conservada
-- seria la anterior, con otro identificador. Emparejar por identificador ahi no
-- haria nada, y sin dar ningun error.
--
-- Emparejar por el nombre que queremos corregir funciona en los dos casos, y
-- ademas es idempotente: despues de esto no queda ninguna fila llamada
-- 'Cognicion'.

UPDATE "categoria" SET
  "nombre" = 'Cognición',
  "descripcion" = 'Ejercicios breves de memoria, atención y concentración. Miden cómo respondiste hoy en esa tarea concreta, no cómo eres.'
WHERE "nombre" = 'Cognicion';

UPDATE "categoria" SET
  "descripcion" = 'Registro de hábitos que sostienen el día a día: descanso, movimiento y la carga de la semana.'
WHERE "nombre" = 'Bienestar';

UPDATE "categoria" SET
  "descripcion" = 'Espacio para registrar cómo te sientes, sin tener que explicarlo ni resolverlo.'
WHERE "nombre" = 'Emociones';

-- ---------------------------------------------------------------------------
-- Cognicion
-- ---------------------------------------------------------------------------

UPDATE "actividad" SET
  "descripcion" = 'Encuentra las parejas iguales en el menor número de intentos. Dura unos tres minutos.',
  "textos_nivel" = '{"favorable": "Hoy encontraste las parejas con soltura.", "en_seguimiento": "Un día corriente en este ejercicio. Cambia bastante según cómo hayas dormido.", "requiere_atencion": "Hoy costó más de lo habitual. Un día suelto no dice nada: mira cómo va a lo largo de la semana."}'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000001';

UPDATE "actividad" SET
  "nombre" = 'Secuencia de números',
  "descripcion" = 'Repite la secuencia que aparece en pantalla. Cada acierto la alarga un dígito.',
  "textos_nivel" = '{"favorable": "Sostuviste secuencias largas sin perderte.", "en_seguimiento": "Llegaste hasta donde llega la mayoría de los días.", "requiere_atencion": "Hoy la secuencia se te escapó antes. Suele pasar cuando hay prisa o poco descanso."}'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000002';

UPDATE "actividad" SET
  "descripcion" = 'Localiza lo que cambia entre dos imágenes muy parecidas, contra reloj.',
  "textos_nivel" = '{"favorable": "Mantuviste la atención puesta todo el ejercicio.", "en_seguimiento": "La atención te acompañó a ratos, que es lo normal.", "requiere_atencion": "Hoy costó sostener la mirada en el detalle. Puede ser cansancio, sin más."}'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000003';

-- ---------------------------------------------------------------------------
-- Bienestar
-- ---------------------------------------------------------------------------

UPDATE "actividad" SET
  "nombre" = 'Cómo dormiste anoche',
  "descripcion" = 'Cuatro preguntas rápidas sobre la noche: a qué hora, cuánto, cuántas veces te despertaste y cómo amaneciste.',
  "textos_nivel" = '{"favorable": "Anoche descansaste bien, según lo que registraste.", "en_seguimiento": "Una noche irregular. Si se repite varios días, suele notarse en lo demás.", "requiere_atencion": "Anoche descansaste poco. Acostarte a la misma hora es el cambio con más efecto y el más fácil de sostener."}'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000004';

UPDATE "actividad" SET
  "descripcion" = 'Cómo viene la semana en estudio, tiempo propio y descanso. Se responde una vez por semana.',
  "textos_nivel" = '{"favorable": "Semana llevadera, por lo que cuentas.", "en_seguimiento": "Se acumuló algo esta semana. Vale la pena mirar qué se puede soltar.", "requiere_atencion": "Esta semana viene cargada. Si se repite, contárselo a alguien de confianza ayuda más que aguantar."}'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000005';

UPDATE "actividad" SET
  "nombre" = 'Movimiento del día',
  "descripcion" = 'Anota si te moviste hoy y cuánto. Sin metas ni objetivos: es un registro, no un reto.'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000006';

-- ---------------------------------------------------------------------------
-- Emociones
-- ---------------------------------------------------------------------------

UPDATE "actividad" SET
  "nombre" = 'Cómo te sientes hoy',
  "descripcion" = 'Cinco preguntas breves sobre el ánimo de hoy. Menos de un minuto.',
  "textos_nivel" = '{"favorable": "Hoy lo registraste como un día tranquilo.", "en_seguimiento": "Un día con altibajos, de los que tiene cualquiera.", "requiere_atencion": "Hoy lo estás pasando mal. No tienes que resolverlo hoy, y no tienes que hacerlo en solitario."}'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000007';

UPDATE "actividad" SET
  "nombre" = 'Qué te está pesando',
  "descripcion" = 'Marca lo que te está costando estos días. Puedes elegir varias o ninguna.',
  "textos_nivel" = '{"favorable": "Ahora mismo no hay mucho pesándote, por lo que marcaste.", "en_seguimiento": "Hay un par de cosas ocupando espacio estos días.", "requiere_atencion": "Se te están juntando varias cosas a la vez. Ponerlo en palabras con alguien suele quitarle peso."}'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000008';

-- "por pequena que sea" no era solo una tilde ausente: cambiaba la palabra.
UPDATE "actividad" SET
  "nombre" = 'Un momento bueno del día',
  "descripcion" = 'Una sola cosa del día que estuviera bien, por pequeña que sea. No hay respuesta incorrecta.'
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000009';

-- ---------------------------------------------------------------------------
-- Lineas de atencion
--
-- Son los textos mas delicados del sistema: lo que alguien lee en el peor
-- momento. Que esten bien escritos no es cosmetica.
-- ---------------------------------------------------------------------------

UPDATE "recurso_apoyo" SET
  "titulo" = 'Línea 192, opción 4',
  "descripcion" = 'Orientación en salud mental del Ministerio de Salud. Funciona en todo el país: se marca 192 y se elige la opción 4. Atiende un equipo de profesionales.'
WHERE "id_recurso" = '0192c0de-0000-4000-8000-000000000192';

UPDATE "recurso_apoyo" SET
  "titulo" = 'Línea 123',
  "descripcion" = 'Línea única de emergencias, en todo el país. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.'
WHERE "id_recurso" = '0123c0de-0000-4000-8000-000000000123';

UPDATE "recurso_apoyo" SET
  "titulo" = 'Línea 106, el poder de ser escuchado',
  "descripcion" = 'Apoyo psicológico gratuito de la Secretaría Distrital de Salud, las 24 horas, todos los días del año. Se marca 106 desde Bogotá; también responde por WhatsApp al 300 754 8933 y en linea106@saludcapital.gov.co.'
WHERE "id_recurso" = '0106c0de-0000-4000-8000-000000000106';

-- ---------------------------------------------------------------------------
-- Lecturas de orientacion
-- ---------------------------------------------------------------------------

UPDATE "recurso_apoyo" SET
  "titulo" = 'Qué significa tu nivel',
  "descripcion" = 'El nivel resume cómo te fue en esa actividad concreta, ese día. No dice nada sobre ti como persona, y un mismo nivel puede significar cosas distintas según la actividad.'
WHERE "id_recurso" = '0a000000-0000-4000-8000-000000000001';

UPDATE "recurso_apoyo" SET
  "descripcion" = 'Acostarte y levantarte a la misma hora, dejar las pantallas media hora antes y bajar la luz de la habitación son los tres cambios con más efecto y los más fáciles de sostener.'
WHERE "id_recurso" = '0a000000-0000-4000-8000-000000000002';

UPDATE "recurso_apoyo" SET
  "titulo" = 'Cuando el día viene pesado',
  "descripcion" = 'Sentirte mal un día no requiere explicación ni solución inmediata. Ayuda moverte un rato, tomar agua, y contárselo a alguien de confianza antes de que se acumule.'
WHERE "id_recurso" = '0a000000-0000-4000-8000-000000000003';
