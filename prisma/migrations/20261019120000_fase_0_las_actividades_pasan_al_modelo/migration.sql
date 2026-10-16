-- Fase 0 del catalogo "mecanica x sesion" (SCRUM-207, ADR 0030): cinco de las nueve actividades que
-- ya existen pasan al modelo SIN CAMBIAR LO QUE SE VE.
--
-- Solo DATOS y aditiva: no toca el esquema. Para cada una:
--
--   1. se siembra su unica sesion, con los numeros y los textos que hasta hoy estaban escritos en el
--      codigo del frontend: nivel 1, `no_requiere` (el texto ya esta en uso y no cambia) y publicada, y
--   2. se le pone su `motor` (el componente que la pinta).
--
-- La frecuencia NO cambia: siguen saliendo como hoy. La rotacion (`rotativa`) es para las mecanicas nuevas.
--
-- Quedan SIN motor las cuatro que son pantallas propias, no un componente compartido: Parejas de cartas,
-- Como dormiste anoche, Movimiento del dia y Que te esta pesando. El modelo lo admite a proposito.
--
-- Es idempotente: el `UPDATE` solo toca el motor vacio y los `INSERT` ignoran un identificador ya
-- sembrado, asi que aplicarla dos veces deja lo mismo. Los identificadores de las sesiones son fijos para
-- que sean los mismos en los tres ambientes, como los de las actividades.
--
-- El contenido de `parametros` cumple el contrato de `ParametrosDelMotor.ts`; una prueba contra
-- PostgreSQL (`SesionesSembradas.integracion.spec.ts`) lo comprueba con la base de verdad, junto con el
-- lenguaje clinico (R6) y la lista de exclusion (R14).
--
-- ORDEN: primero la sesion y despues el motor. Una mecanica con motor y sin sesion que dar no se ofrece
-- (desaparece del sendero); al reves, una sesion sin motor no se usa. Asi no hay ningun estado intermedio
-- malo, aunque la migracion se interrumpiera a la mitad.
--
-- Para deshacerla (solo antes de que alguien haga una de estas sesiones: `resultado.id_sesion` es RESTRICT):
--   UPDATE "actividad" SET "motor" = NULL WHERE "id_actividad" IN (<los cinco de abajo>);
--   DELETE FROM "sesion_de_actividad" WHERE "id_sesion" IN (<los cinco de abajo>);

-- ---------------------------------------------------------------------------
-- 1. Su unica sesion, PRIMERO
-- ---------------------------------------------------------------------------

INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  -- Secuencia de numeros: los diez digitos, tres de largo al empezar, doce rondas, y cada digito a la
  -- vista 700 ms mas un segundo de margen. Una ronda acertada, un punto: el maximo del catalogo es 12.
  (
    '5e510000-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000002',
    'Secuencia de números, versión original',
    1,
    '{
      "casillas": [
        {"clave": "0", "nombre": "0"}, {"clave": "1", "nombre": "1"}, {"clave": "2", "nombre": "2"},
        {"clave": "3", "nombre": "3"}, {"clave": "4", "nombre": "4"}, {"clave": "5", "nombre": "5"},
        {"clave": "6", "nombre": "6"}, {"clave": "7", "nombre": "7"}, {"clave": "8", "nombre": "8"},
        {"clave": "9", "nombre": "9"}
      ],
      "largoInicial": 3,
      "rondas": 12,
      "msPorElemento": 700,
      "msDeMargen": 1000
    }'::jsonb,
    TRUE,
    'no_requiere'
  ),
  -- Encuentra la diferencia: quince rondas de quince segundos; el tablero crece de 3x3 a 4x4 y a 5x5.
  -- Una diferencia encontrada, un punto: el maximo del catalogo es 15.
  (
    '5e510000-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000003',
    'Encuentra la diferencia, versión original',
    1,
    '{"rondas": 15, "segundosPorRonda": 15, "lados": [3, 4, 5]}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  -- La carga de tu semana: cinco preguntas de 0 a 4, todas en el mismo sentido ("Mucho" siempre suma
  -- carga). El maximo, 5 x 4 = 20, no se guarda: sale de aqui y coincide con el del catalogo.
  (
    '5e510000-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000005',
    'La carga de tu semana, versión original',
    1,
    '{
      "indicacion": "Piensa en los últimos siete días. No hay respuestas buenas ni malas.",
      "preguntas": [
        {"clave": "pendientes", "texto": "¿Cuánto trabajo o estudio pendiente sientes que tienes?"},
        {"clave": "horario", "texto": "¿Qué tan apretado ha estado tu horario?"},
        {"clave": "tiempoPropio", "texto": "¿Cuánto te ha faltado tiempo para ti: descansar, tus aficiones, la gente que quieres?"},
        {"clave": "desconectar", "texto": "¿Cuánto te ha costado desconectarte al terminar el día?"},
        {"clave": "loQueViene", "texto": "¿Cuánto te pesa lo que viene en los próximos días?"}
      ],
      "opciones": [
        {"valor": 0, "texto": "Nada"},
        {"valor": 1, "texto": "Poco"},
        {"valor": 2, "texto": "Algo"},
        {"valor": 3, "texto": "Bastante"},
        {"valor": 4, "texto": "Mucho"}
      ]
    }'::jsonb,
    TRUE,
    'no_requiere'
  ),
  -- Como te sientes hoy: cinco preguntas de 0 a 2 (tres opciones, no cinco: en un dia dificil afinar entre
  -- "Bastante" y "Mucho" es pedir demasiado). El maximo, 5 x 2 = 10, coincide con el del catalogo.
  (
    '5e510000-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000007',
    'Cómo te sientes hoy, versión original',
    1,
    '{
      "indicacion": "Piensa solo en hoy. No hay respuestas buenas ni malas.",
      "preguntas": [
        {"clave": "arrancar", "texto": "¿Cuánto te costó arrancar el día?"},
        {"clave": "tension", "texto": "¿Cuánta tensión has cargado hoy?"},
        {"clave": "disfrutar", "texto": "¿Cuánto te costó disfrutar de lo que normalmente te gusta?"},
        {"clave": "vueltas", "texto": "¿Cuánto te han dado vueltas pensamientos que no te dejan en paz?"},
        {"clave": "compania", "texto": "¿Cuánto has echado en falta a alguien con quien hablar?"}
      ],
      "opciones": [
        {"valor": 0, "texto": "Nada"},
        {"valor": 1, "texto": "Algo"},
        {"valor": 2, "texto": "Mucho"}
      ]
    }'::jsonb,
    TRUE,
    'no_requiere'
  ),
  -- Un momento bueno del dia: texto libre sin puntaje, un solo campo de hasta 500 caracteres, cinco ideas
  -- de arranque a un toque y siempre el boton "Hoy no me sale ninguno".
  (
    '5e510000-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000009',
    'Un momento bueno del día, versión original',
    1,
    '{
      "invitacion": "¿Qué estuvo bien hoy?",
      "ideas": [
        "Un café a buena hora",
        "Una conversación bonita",
        "Algo salió mejor de lo esperado",
        "Un rato de descanso",
        "Algo rico para comer"
      ],
      "campos": 1,
      "minimo": 1,
      "largoMaximo": 500,
      "permiteNingunaHoy": true
    }'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. El motor de cada una, DESPUES de su sesion
-- ---------------------------------------------------------------------------

UPDATE "actividad" SET "motor" = 'secuencia'
  WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000002' AND "motor" IS NULL;

UPDATE "actividad" SET "motor" = 'tocar_el_objetivo'
  WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000003' AND "motor" IS NULL;

UPDATE "actividad" SET "motor" = 'cuestionario_corto'
  WHERE "id_actividad" IN (
    '0acd0000-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000007'
  ) AND "motor" IS NULL;

UPDATE "actividad" SET "motor" = 'escritura_breve'
  WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000009' AND "motor" IS NULL;
