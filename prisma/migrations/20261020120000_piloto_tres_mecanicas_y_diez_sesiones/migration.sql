-- El piloto del catalogo "mecanica x sesion" (SCRUM-212, ADR 0030): tres mecanicas nuevas y las
-- diez sesiones con que se prueban. NADA SE PUBLICA.
--
-- Solo DATOS y aditiva: no toca el esquema ni cambia ninguna de las nueve actividades de siempre.
--
--   1. se siembran las tres mecanicas, todas `rotativa` y con su `motor`:
--        Recuerda los colores  (Cognicion, juego, `secuencia`)           COG-01
--        Respiracion guiada    (Bienestar, sin puntaje, `guia_paso_a_paso`) BIE-01
--        Tres cosas buenas     (Emociones, sin puntaje, `escritura_breve`)  EMO-02
--   2. se siembran sus diez sesiones (cuatro, tres y tres), TODAS SIN PUBLICAR.
--
-- Mientras una mecanica no tenga una sesion publicada, no se ofrece a nadie: el sendero de todas las
-- personas queda como esta. Publicar es un cambio aparte (`[C7-43]`), de quien revise.
--
-- ## La revision
--
--   * COG-01 (4 sesiones) NO pide revision profesional: `no_requiere`. Siguen sin publicar hasta que
--     se decida, y publicarlas es un solo UPDATE de `publicado`.
--   * BIE-01 (3) y EMO-02 (3) SI la piden: `pendiente`. La base impide publicarlas asi
--     (`sesion_de_actividad_publicada_revisada`), y una sesion `revisada` no se edita: si la revision
--     cambia un texto, se retira y se agrega otra con otro identificador.
--
-- El contenido de BIE-01 y EMO-02 son BORRADORES (PLAN-FASE-0-Y-PILOTO.md, §5): las frases, la
-- advertencia, las invitaciones y el apoyo salen de las fichas y esperan a quien revise el tono. Que
-- esten en la base no los aprueba.
--
-- ## Por que `rondas` es 12 en las cuatro de COG-01
--
-- `puntaje_maximo` es de la ACTIVIDAD, no de la sesion: un puntaje de 9 rondas y otro de 12 no se
-- pueden comparar si comparten maximo. Una ronda acertada vale un punto, asi que todas las sesiones
-- de la mecanica juegan las mismas rondas que el maximo (12, como la secuencia de numeros). Lo que
-- cambia entre ellas es la dificultad: cuantas casillas, el largo con que empieza y la velocidad.
--
-- ## Lo que dejo fuera, a proposito
--
--   * `ambientacion` y `haptico` de la respiracion: la pantalla todavia no tiene estilos por
--     ambientacion, y una vibracion por omision no la pidio nadie. Son opcionales y se agregan con
--     la sesion que los use.
--
-- Es idempotente: los `INSERT` ignoran un identificador ya sembrado, asi que aplicarla dos veces deja
-- lo mismo. Los identificadores son fijos para que sean los mismos en los tres ambientes, como los
-- de las actividades y los de la Fase 0.
--
-- El contenido de `parametros` cumple el contrato de `ParametrosDelMotor.ts`; la prueba contra
-- PostgreSQL (`SesionesSembradas.integracion.spec.ts`) lo comprueba con la base de verdad, junto con
-- el lenguaje clinico (R6) y la lista de exclusion (R14).
--
-- ORDEN: primero la mecanica y despues sus sesiones (una sesion necesita su actividad).
--
-- Para deshacerla (nadie puede haber hecho estas sesiones mientras no se publiquen:
-- `resultado.id_sesion` es RESTRICT):
--   DELETE FROM "sesion_de_actividad" WHERE "id_sesion" IN (<las diez de abajo>);
--   DELETE FROM "actividad" WHERE "id_actividad" IN (<las tres de abajo>);

-- ---------------------------------------------------------------------------
-- 1. Las tres mecanicas, PRIMERO
-- ---------------------------------------------------------------------------

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor"
)
VALUES
  -- Recuerda los colores: un juego. Una ronda acertada, un punto; el maximo, 12, es el de sus rondas.
  -- Los cortes son los de la secuencia de numeros, que se juega igual. El texto es el de la ficha.
  (
    '0acd0000-0000-4000-8000-00000000000a',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Recuerda los colores',
    'juego',
    'Mira cómo se iluminan las casillas, una a una, y tócalas en el mismo orden. Cada acierto alarga la secuencia.',
    TRUE,
    'mayor_es_mejor',
    12.00,
    '{"primero": 0.35, "segundo": 0.70}'::jsonb,
    '{"favorable": "Seguiste la secuencia hasta el final.", "en_seguimiento": "Llegaste hasta donde llega la mayoría de los días.", "requiere_atencion": "Hoy se escapó antes. Pasa con prisa o poco descanso."}'::jsonb,
    'rotativa',
    'secuencia'
  ),
  -- Respiracion guiada: sin puntaje. No se presenta como un tratamiento ni promete nada.
  (
    '0acd0000-0000-4000-8000-00000000000b',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Respiración guiada',
    'bitacora',
    'Un círculo que se abre y se cierra para acompañar tu respiración, a tu ritmo. Dos minutos, y puedes parar cuando quieras.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'guia_paso_a_paso'
  ),
  -- Tres cosas buenas: sin puntaje, como "Un momento bueno del dia". Con una basta, y hay dias en que
  -- no sale ninguna: tambien eso se registra.
  (
    '0acd0000-0000-4000-8000-00000000000c',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Tres cosas buenas',
    'bitacora',
    'Hasta tres cosas del día que estuvieron bien, por pequeñas que sean. Con una basta, y hay días en que no sale ninguna.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve'
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Sus diez sesiones, SIN PUBLICAR
-- ---------------------------------------------------------------------------

INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  -- COG-01 · Recuerda los colores (`no_requiere`). Cada casilla lleva forma, nombre y color, no solo
  -- color (R10), y se ilumina al menos 600 ms. Sin sonido. Las casillas de cada sesion son las
  -- primeras de la misma paleta: circulo verde, cuadrado azul, triangulo ambar, rombo violeta,
  -- estrella rosa, hoja turquesa, gota gris, luna naranja y nube marron.
  (
    '5e510001-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-00000000000a',
    'Cuatro colores',
    1,
    '{
      "casillas": [
        {"clave": "circulo", "nombre": "círculo verde", "forma": "circulo", "color": "verde"},
        {"clave": "cuadrado", "nombre": "cuadrado azul", "forma": "cuadrado", "color": "azul"},
        {"clave": "triangulo", "nombre": "triángulo ámbar", "forma": "triangulo", "color": "ambar"},
        {"clave": "rombo", "nombre": "rombo violeta", "forma": "rombo", "color": "violeta"}
      ],
      "largoInicial": 3,
      "rondas": 12,
      "msPorElemento": 1000,
      "msDeMargen": 1000,
      "msDestello": 700
    }'::jsonb,
    FALSE,
    'no_requiere'
  ),
  (
    '5e510001-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-00000000000a',
    'Seis colores',
    2,
    '{
      "casillas": [
        {"clave": "circulo", "nombre": "círculo verde", "forma": "circulo", "color": "verde"},
        {"clave": "cuadrado", "nombre": "cuadrado azul", "forma": "cuadrado", "color": "azul"},
        {"clave": "triangulo", "nombre": "triángulo ámbar", "forma": "triangulo", "color": "ambar"},
        {"clave": "rombo", "nombre": "rombo violeta", "forma": "rombo", "color": "violeta"},
        {"clave": "estrella", "nombre": "estrella rosa", "forma": "estrella", "color": "rosa"},
        {"clave": "hoja", "nombre": "hoja turquesa", "forma": "hoja", "color": "turquesa"}
      ],
      "largoInicial": 3,
      "rondas": 12,
      "msPorElemento": 1000,
      "msDeMargen": 1000,
      "msDestello": 700
    }'::jsonb,
    FALSE,
    'no_requiere'
  ),
  (
    '5e510001-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-00000000000a',
    'Nueve colores',
    3,
    '{
      "casillas": [
        {"clave": "circulo", "nombre": "círculo verde", "forma": "circulo", "color": "verde"},
        {"clave": "cuadrado", "nombre": "cuadrado azul", "forma": "cuadrado", "color": "azul"},
        {"clave": "triangulo", "nombre": "triángulo ámbar", "forma": "triangulo", "color": "ambar"},
        {"clave": "rombo", "nombre": "rombo violeta", "forma": "rombo", "color": "violeta"},
        {"clave": "estrella", "nombre": "estrella rosa", "forma": "estrella", "color": "rosa"},
        {"clave": "hoja", "nombre": "hoja turquesa", "forma": "hoja", "color": "turquesa"},
        {"clave": "gota", "nombre": "gota gris", "forma": "gota", "color": "gris"},
        {"clave": "luna", "nombre": "luna naranja", "forma": "luna", "color": "naranja"},
        {"clave": "nube", "nombre": "nube marrón", "forma": "nube", "color": "marron"}
      ],
      "largoInicial": 4,
      "rondas": 12,
      "msPorElemento": 1000,
      "msDeMargen": 1000,
      "msDestello": 700
    }'::jsonb,
    FALSE,
    'no_requiere'
  ),
  -- La lenta: 1.100 ms iluminada y 600 ms de pausa, para quien necesita mas tiempo.
  (
    '5e510001-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-00000000000a',
    'Cuatro colores, con calma',
    1,
    '{
      "casillas": [
        {"clave": "circulo", "nombre": "círculo verde", "forma": "circulo", "color": "verde"},
        {"clave": "cuadrado", "nombre": "cuadrado azul", "forma": "cuadrado", "color": "azul"},
        {"clave": "triangulo", "nombre": "triángulo ámbar", "forma": "triangulo", "color": "ambar"},
        {"clave": "rombo", "nombre": "rombo violeta", "forma": "rombo", "color": "violeta"}
      ],
      "largoInicial": 3,
      "rondas": 12,
      "msPorElemento": 1700,
      "msDeMargen": 1000,
      "msDestello": 1100
    }'::jsonb,
    FALSE,
    'no_requiere'
  ),
  -- BIE-01 · Respiracion guiada (`pendiente`: revision profesional, corta). La advertencia va a la
  -- vista y antes de empezar. Ninguna retencion de mas de 4 s ni ritmos rapidos; no se presenta como
  -- un tratamiento. Las frases acompanan, una por ciclo; quien revise las puede podar o cambiar.
  (
    '5e510001-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6',
    1,
    '{
      "advertenciaInicial": "Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.",
      "patron": {"inhalaSegundos": 4, "exhalaSegundos": 6, "pausaSegundos": 0},
      "duracionSegundos": 120,
      "frases": [
        "Sin prisa.",
        "Deja que el aire entre y salga a tu ritmo.",
        "Si se te va la atención, vuelve cuando quieras.",
        "Un poco más suave."
      ]
    }'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510001-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco',
    1,
    '{
      "advertenciaInicial": "Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.",
      "patron": {"inhalaSegundos": 5, "exhalaSegundos": 5, "pausaSegundos": 0},
      "duracionSegundos": 120,
      "frases": [
        "Sin prisa.",
        "Deja que el aire entre y salga a tu ritmo.",
        "Si se te va la atención, vuelve cuando quieras.",
        "Un poco más suave."
      ]
    }'::jsonb,
    FALSE,
    'pendiente'
  ),
  -- Con una pausa de 2 s entre inhalar y exhalar: la unica que la tiene, y nunca de mas de 4 s.
  (
    '5e510001-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa',
    1,
    '{
      "advertenciaInicial": "Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.",
      "patron": {"inhalaSegundos": 4, "exhalaSegundos": 4, "pausaSegundos": 2},
      "duracionSegundos": 120,
      "frases": [
        "Sin prisa.",
        "Deja que el aire entre y salga a tu ritmo.",
        "Si se te va la atención, vuelve cuando quieras.",
        "Un poco más suave."
      ]
    }'::jsonb,
    FALSE,
    'pendiente'
  ),
  -- EMO-02 · Tres cosas buenas (`pendiente`: revision profesional, de tono). Hasta tres campos, con
  -- una basta, y siempre «hoy no me sale ninguna». Sin ideas de arranque: la invitacion del dia es el
  -- lente. Nada de «deberias estar agradecida», y el apoyo no valora lo que se escribe.
  (
    '5e510001-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-00000000000c',
    'Algo que probaste',
    1,
    '{
      "invitacion": "Algo que probaste hoy, aunque sea pequeño.",
      "campos": 3,
      "minimo": 1,
      "largoMaximo": 200,
      "permiteNingunaHoy": true
    }'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510001-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-00000000000c',
    'Alguien que…',
    1,
    '{
      "invitacion": "Alguien que te hizo el rato más fácil.",
      "campos": 3,
      "minimo": 1,
      "largoMaximo": 200,
      "permiteNingunaHoy": true
    }'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510001-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-00000000000c',
    'Un lugar',
    1,
    '{
      "invitacion": "Un lugar donde estuviste a gusto.",
      "campos": 3,
      "minimo": 1,
      "largoMaximo": 200,
      "permiteNingunaHoy": true
    }'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;
