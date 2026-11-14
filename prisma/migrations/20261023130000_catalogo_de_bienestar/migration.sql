-- El catalogo de Bienestar (SCRUM-223, ADR 0030 y 0031): BIE-01 hasta 40 sesiones y BIE-02 a BIE-09.
--
-- Solo DATOS y aditiva: no toca el esquema ni cambia ninguna actividad ni sesion ya sembradas.
--
--   1. se siembran ocho mecanicas nuevas, todas `rotativa` y con su `motor` (BIE-02 a BIE-09). BIE-07
--      («Antes de dormir») trae su franja: `noche`, de 19:00 a 4:59 en la hora de la persona;
--   2. se siembran sus sesiones, y las 37 que faltan de «Respiracion guiada» (BIE-01).
--
-- ## NADA SE PUBLICA
--
-- Ninguna mecanica de Bienestar puntua, y todas piden revision (profesional, o ligera en BIE-05, 08 y 09): las
-- sesiones entran `pendiente` y SIN PUBLICAR. La base impide publicarlas asi
-- (sesion_de_actividad_publicada_revisada). Mientras una mecanica no tenga una sesion publicada, no se ofrece a
-- nadie: el sendero de todas las personas queda como esta. Publicar es una migracion aparte, que se genera de la
-- hoja de aprobacion cuando una persona con formacion revisa, y queda dicho quien y cuando.
--
-- Los textos son BORRADORES para quien revise (practicas de sueno, estiramientos, guiones de atencion al cuerpo).
-- Que esten en la base no los aprueba. Una sesion `revisada` no se edita: si la revision cambia un texto, se
-- retira y se agrega otra con otro identificador.
--
-- ## Como se genero
--
-- NO se escribe a mano: lo genera `src/pruebas/catalogo/generar.ts` desde `src/pruebas/catalogo/bienestar/`, y
-- una prueba comprueba que lo que esta aqui es lo que el generador produce. Cada sesion pasa antes por el contrato
-- de su motor, el lenguaje clinico (R6) y la lista de exclusion (R14).
--
-- Es idempotente: los `INSERT` ignoran un identificador ya sembrado.
--
-- ORDEN: primero las mecanicas y despues sus sesiones. Necesita `actividad.franja` (SCRUM-221).
--
-- Para deshacerla (nadie puede haber hecho estas sesiones mientras no se publiquen):
--   DELETE FROM "sesion_de_actividad" WHERE "id_sesion"::text LIKE '5e5102%';
--   DELETE FROM "actividad" WHERE "id_actividad"::text LIKE '0acd0000-0000-4000-8000-0000000002%';

-- ---------------------------------------------------------------------------
-- 1. Las mecanicas, PRIMERO (8)
-- ---------------------------------------------------------------------------

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor", "franja"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000202',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Pausa de estiramiento',
    'bitacora',
    'Cuatro movimientos suaves para soltar el cuerpo, uno tras otro, desde una silla. Unos dos minutos.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'guia_paso_a_paso',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000203',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'El hábito de sueño de hoy',
    'bitacora',
    'Una práctica pequeña para cuidar tu descanso, una por día. Tú decides si la pruebas. Un minuto.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'cuestionario_corto',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000204',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Un cuidado pequeño de hoy',
    'bitacora',
    'Un gesto de uno a cinco minutos para cuidarte hoy. Sin metas ni cuentas.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'cuestionario_corto',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000205',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'La caminata del día',
    'bitacora',
    'Una invitación para salir a caminar, grande o pequeña, y contarla. Sin metas ni pasos contados.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'cuestionario_corto',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000206',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Escaneo corporal',
    'bitacora',
    'Llevar la atención al cuerpo, zona por zona, sin cambiar nada. De uno a tres minutos, y puedes parar cuando quieras.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'guia_paso_a_paso',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000207',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Antes de dormir',
    'bitacora',
    'Cuatro gestos suaves para preparar la noche. Solo se ofrece por la noche.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'cuestionario_corto',
    'noche'
  ),
  (
    '0acd0000-0000-4000-8000-000000000208',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'El descanso de mañana',
    'bitacora',
    'Planear con calma cómo bajar el ritmo esta noche. Un minuto.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'cuestionario_corto',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000209',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Un respiro en medio del día',
    'bitacora',
    'Una pausa de uno o dos minutos para el trabajo o el estudio. Tú eliges entre tres.',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'guia_paso_a_paso',
    NULL
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Sus sesiones (357)
-- ---------------------------------------------------------------------------

-- BIE-01 · Respiración guiada: 37 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510201-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 1 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"bosque","frases":["El círculo te marca el ritmo.","Así está bien.","Un momento solo para ti.","Acompaña el círculo, sin forzar.","Si algo molesta, vuelve a respirar como siempre."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 2 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"bosque","frases":["Poco a poco.","A tu manera.","Un respiro más.","Quédate aquí un rato.","Respira suave."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 3 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"bosque","frases":["Sin prisa.","Deja que el aire entre y salga a tu ritmo.","Si se te va la atención, vuelve cuando quieras.","Un poco más suave.","No hay una manera correcta de hacerlo."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 1 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"bosque","frases":["Nota cómo se mueve tu pecho.","Si quieres, baja la mirada.","Puedes parar cuando quieras.","Cada respiración es una nueva.","Aquí no hay nada que lograr."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 2 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"bosque","frases":["Respira como te salga.","Nota el aire que entra y el que sale.","Un ciclo a la vez.","Tu cuerpo ya sabe hacerlo.","Sigue el círculo con la mirada."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 3 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"bosque","frases":["Si te distraes, es normal.","Puedes cerrar los ojos o dejarlos abiertos.","Mira cómo se abre el círculo.","Suelta el aire con calma.","No hace falta apurarse."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 1 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":60,"ambientacion":"bosque","frases":["El círculo te marca el ritmo.","Así está bien.","Un momento solo para ti.","Acompaña el círculo, sin forzar.","Si algo molesta, vuelve a respirar como siempre."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 2 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":120,"ambientacion":"bosque","frases":["Poco a poco.","A tu manera.","Un respiro más.","Quédate aquí un rato.","Respira suave."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 3 min · bosque',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":180,"ambientacion":"bosque","frases":["Sin prisa.","Deja que el aire entre y salga a tu ritmo.","Si se te va la atención, vuelve cuando quieras.","Un poco más suave.","No hay una manera correcta de hacerlo."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 1 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"mar","frases":["Nota cómo se mueve tu pecho.","Si quieres, baja la mirada.","Puedes parar cuando quieras.","Cada respiración es una nueva.","Aquí no hay nada que lograr."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 2 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"mar","frases":["Respira como te salga.","Nota el aire que entra y el que sale.","Un ciclo a la vez.","Tu cuerpo ya sabe hacerlo.","Sigue el círculo con la mirada."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 3 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"mar","frases":["Si te distraes, es normal.","Puedes cerrar los ojos o dejarlos abiertos.","Mira cómo se abre el círculo.","Suelta el aire con calma.","No hace falta apurarse."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 1 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"mar","frases":["El círculo te marca el ritmo.","Así está bien.","Un momento solo para ti.","Acompaña el círculo, sin forzar.","Si algo molesta, vuelve a respirar como siempre."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 2 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"mar","frases":["Poco a poco.","A tu manera.","Un respiro más.","Quédate aquí un rato.","Respira suave."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 3 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"mar","frases":["Sin prisa.","Deja que el aire entre y salga a tu ritmo.","Si se te va la atención, vuelve cuando quieras.","Un poco más suave.","No hay una manera correcta de hacerlo."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 1 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":60,"ambientacion":"mar","frases":["Nota cómo se mueve tu pecho.","Si quieres, baja la mirada.","Puedes parar cuando quieras.","Cada respiración es una nueva.","Aquí no hay nada que lograr."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 2 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":120,"ambientacion":"mar","frases":["Respira como te salga.","Nota el aire que entra y el que sale.","Un ciclo a la vez.","Tu cuerpo ya sabe hacerlo.","Sigue el círculo con la mirada."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 3 min · mar',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":180,"ambientacion":"mar","frases":["Si te distraes, es normal.","Puedes cerrar los ojos o dejarlos abiertos.","Mira cómo se abre el círculo.","Suelta el aire con calma.","No hace falta apurarse."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 1 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"amanecer","frases":["El círculo te marca el ritmo.","Así está bien.","Un momento solo para ti.","Acompaña el círculo, sin forzar.","Si algo molesta, vuelve a respirar como siempre."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 2 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"amanecer","frases":["Poco a poco.","A tu manera.","Un respiro más.","Quédate aquí un rato.","Respira suave."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 3 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"amanecer","frases":["Sin prisa.","Deja que el aire entre y salga a tu ritmo.","Si se te va la atención, vuelve cuando quieras.","Un poco más suave.","No hay una manera correcta de hacerlo."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 1 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"amanecer","frases":["Nota cómo se mueve tu pecho.","Si quieres, baja la mirada.","Puedes parar cuando quieras.","Cada respiración es una nueva.","Aquí no hay nada que lograr."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 2 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"amanecer","frases":["Respira como te salga.","Nota el aire que entra y el que sale.","Un ciclo a la vez.","Tu cuerpo ya sabe hacerlo.","Sigue el círculo con la mirada."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 3 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"amanecer","frases":["Si te distraes, es normal.","Puedes cerrar los ojos o dejarlos abiertos.","Mira cómo se abre el círculo.","Suelta el aire con calma.","No hace falta apurarse."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 1 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":60,"ambientacion":"amanecer","frases":["El círculo te marca el ritmo.","Así está bien.","Un momento solo para ti.","Acompaña el círculo, sin forzar.","Si algo molesta, vuelve a respirar como siempre."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 2 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":120,"ambientacion":"amanecer","frases":["Poco a poco.","A tu manera.","Un respiro más.","Quédate aquí un rato.","Respira suave."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 3 min · amanecer',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":180,"ambientacion":"amanecer","frases":["Sin prisa.","Deja que el aire entre y salga a tu ritmo.","Si se te va la atención, vuelve cuando quieras.","Un poco más suave.","No hay una manera correcta de hacerlo."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 1 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"noche","frases":["Nota cómo se mueve tu pecho.","Si quieres, baja la mirada.","Puedes parar cuando quieras.","Cada respiración es una nueva.","Aquí no hay nada que lograr."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 2 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"noche","frases":["Respira como te salga.","Nota el aire que entra y el que sale.","Un ciclo a la vez.","Tu cuerpo ya sabe hacerlo.","Sigue el círculo con la mirada."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 3 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"noche","frases":["Si te distraes, es normal.","Puedes cerrar los ojos o dejarlos abiertos.","Mira cómo se abre el círculo.","Suelta el aire con calma.","No hace falta apurarse."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 1 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":60,"ambientacion":"noche","frases":["El círculo te marca el ritmo.","Así está bien.","Un momento solo para ti.","Acompaña el círculo, sin forzar.","Si algo molesta, vuelve a respirar como siempre."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 2 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":120,"ambientacion":"noche","frases":["Poco a poco.","A tu manera.","Un respiro más.","Quédate aquí un rato.","Respira suave."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cinco y cinco · 3 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":5,"exhalaSegundos":5,"pausaSegundos":0},"duracionSegundos":180,"ambientacion":"noche","frases":["Sin prisa.","Deja que el aire entre y salga a tu ritmo.","Si se te va la atención, vuelve cuando quieras.","Un poco más suave.","No hay una manera correcta de hacerlo."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 1 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":60,"ambientacion":"noche","frases":["Nota cómo se mueve tu pecho.","Si quieres, baja la mirada.","Puedes parar cuando quieras.","Cada respiración es una nueva.","Aquí no hay nada que lograr."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 2 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":120,"ambientacion":"noche","frases":["Respira como te salga.","Nota el aire que entra y el que sale.","Un ciclo a la vez.","Tu cuerpo ya sabe hacerlo.","Sigue el círculo con la mirada."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-00000000000b',
    'Cuatro y cuatro, con pausa · 3 min · noche',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":4,"pausaSegundos":2},"duracionSegundos":180,"ambientacion":"noche","frases":["Si te distraes, es normal.","Puedes cerrar los ojos o dejarlos abiertos.","Mira cómo se abre el círculo.","Suelta el aire con calma.","No hace falta apurarse."]}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510201-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-00000000000b',
    'Inhalar 4, exhalar 6 · 1 min · sin fondo',
    1,
    '{"advertenciaInicial":"Si te mareas o te incomoda, suelta el patrón y respira como siempre. Puedes parar cuando quieras.","patron":{"inhalaSegundos":4,"exhalaSegundos":6,"pausaSegundos":0},"duracionSegundos":60,"frases":["El círculo te marca el ritmo.","Así está bien.","Un momento solo para ti.","Acompaña el círculo, sin forzar.","Si algo molesta, vuelve a respirar como siempre."]}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-02 · Pausa de estiramiento: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510202-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000202',
    'Cuello, rutina 1',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: la oreja al hombro derecho","texto":"Deja caer la oreja derecha hacia el hombro derecho, despacio y sin forzar. Respira normal unos 25 segundos.","pictograma":"cuello:inclinar-der"},{"titulo":"Cuello: la oreja al hombro izquierdo","texto":"Ahora la oreja izquierda hacia el hombro izquierdo, despacio y sin forzar. Respira normal unos 25 segundos.","pictograma":"cuello:inclinar-izq"},{"titulo":"Cuello: mirar un poco a la derecha","texto":"Gira la cabeza un poco hacia la derecha, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.","pictograma":"cuello:girar-der"},{"titulo":"Cuello: mirar un poco a la izquierda","texto":"Gira la cabeza un poco hacia la izquierda, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.","pictograma":"cuello:girar-izq"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000202',
    'Cuello, rutina 2',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: la oreja al hombro izquierdo","texto":"Ahora la oreja izquierda hacia el hombro izquierdo, despacio y sin forzar. Respira normal unos 25 segundos.","pictograma":"cuello:inclinar-izq"},{"titulo":"Cuello: mirar un poco a la derecha","texto":"Gira la cabeza un poco hacia la derecha, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.","pictograma":"cuello:girar-der"},{"titulo":"Cuello: mirar un poco a la izquierda","texto":"Gira la cabeza un poco hacia la izquierda, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.","pictograma":"cuello:girar-izq"},{"titulo":"Cuello: la barbilla al pecho","texto":"Baja la barbilla hacia el pecho, despacio. Deja que el peso de la cabeza haga el trabajo, unos 25 segundos.","pictograma":"cuello:bajar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000202',
    'Cuello, rutina 3',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: mirar un poco a la derecha","texto":"Gira la cabeza un poco hacia la derecha, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.","pictograma":"cuello:girar-der"},{"titulo":"Cuello: mirar un poco a la izquierda","texto":"Gira la cabeza un poco hacia la izquierda, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.","pictograma":"cuello:girar-izq"},{"titulo":"Cuello: la barbilla al pecho","texto":"Baja la barbilla hacia el pecho, despacio. Deja que el peso de la cabeza haga el trabajo, unos 25 segundos.","pictograma":"cuello:bajar"},{"titulo":"Cuello: alargarlo","texto":"Imagina un hilo que te estira desde la coronilla. Alarga el cuello sin subir los hombros, unos 25 segundos.","pictograma":"cuello:alargar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000202',
    'Cuello, rutina 4',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: mirar un poco a la izquierda","texto":"Gira la cabeza un poco hacia la izquierda, solo hasta donde se sienta bien, y vuelve al centro. Sin prisa.","pictograma":"cuello:girar-izq"},{"titulo":"Cuello: la barbilla al pecho","texto":"Baja la barbilla hacia el pecho, despacio. Deja que el peso de la cabeza haga el trabajo, unos 25 segundos.","pictograma":"cuello:bajar"},{"titulo":"Cuello: alargarlo","texto":"Imagina un hilo que te estira desde la coronilla. Alarga el cuello sin subir los hombros, unos 25 segundos.","pictograma":"cuello:alargar"},{"titulo":"Cuello: soltarlo","texto":"Deja que los hombros bajen y el cuello se quede largo. Respira con calma unos 25 segundos.","pictograma":"cuello:soltar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000202',
    'Cuello, rutina 5',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: alargarlo","texto":"Imagina un hilo que te estira desde la coronilla. Alarga el cuello sin subir los hombros, unos 25 segundos.","pictograma":"cuello:alargar"},{"titulo":"Cuello: soltarlo","texto":"Deja que los hombros bajen y el cuello se quede largo. Respira con calma unos 25 segundos.","pictograma":"cuello:soltar"},{"titulo":"Cuello: con las manos en las rodillas","texto":"Apoya las manos en las rodillas, mira al frente y respira con calma tres veces, con el cuello suelto.","pictograma":"cuello:respirar"},{"titulo":"Cuello: la oreja al hombro derecho","texto":"Deja caer la oreja derecha hacia el hombro derecho, despacio y sin forzar. Respira normal unos 25 segundos.","pictograma":"cuello:inclinar-der"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000202',
    'Cuello, rutina 6',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: soltarlo","texto":"Deja que los hombros bajen y el cuello se quede largo. Respira con calma unos 25 segundos.","pictograma":"cuello:soltar"},{"titulo":"Cuello: con las manos en las rodillas","texto":"Apoya las manos en las rodillas, mira al frente y respira con calma tres veces, con el cuello suelto.","pictograma":"cuello:respirar"},{"titulo":"Cuello: la oreja al hombro derecho","texto":"Deja caer la oreja derecha hacia el hombro derecho, despacio y sin forzar. Respira normal unos 25 segundos.","pictograma":"cuello:inclinar-der"},{"titulo":"Cuello: la oreja al hombro izquierdo","texto":"Ahora la oreja izquierda hacia el hombro izquierdo, despacio y sin forzar. Respira normal unos 25 segundos.","pictograma":"cuello:inclinar-izq"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000202',
    'Hombros, rutina 1',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Hombros: subir y soltar","texto":"Sube los hombros hacia las orejas al inhalar y suéltalos al exhalar. Repite tres veces, despacio.","pictograma":"hombros:subir"},{"titulo":"Hombros: círculos hacia atrás","texto":"Dibuja círculos pequeños con los hombros hacia atrás, sin apurarte, unas cinco veces.","pictograma":"hombros:circulo-atras"},{"titulo":"Hombros: círculos hacia adelante","texto":"Ahora círculos pequeños con los hombros hacia adelante, sin apurarte, unas cinco veces.","pictograma":"hombros:circulo-adelante"},{"titulo":"Hombros: llevarlos atrás","texto":"Lleva los hombros un poco hacia atrás, como juntando los omóplatos, y suelta. Dos o tres veces.","pictograma":"hombros:juntar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000202',
    'Hombros, rutina 2',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Hombros: círculos hacia atrás","texto":"Dibuja círculos pequeños con los hombros hacia atrás, sin apurarte, unas cinco veces.","pictograma":"hombros:circulo-atras"},{"titulo":"Hombros: círculos hacia adelante","texto":"Ahora círculos pequeños con los hombros hacia adelante, sin apurarte, unas cinco veces.","pictograma":"hombros:circulo-adelante"},{"titulo":"Hombros: llevarlos atrás","texto":"Lleva los hombros un poco hacia atrás, como juntando los omóplatos, y suelta. Dos o tres veces.","pictograma":"hombros:juntar"},{"titulo":"Hombros: un abrazo","texto":"Cruza los brazos sobre el pecho como en un abrazo y respira con calma unos 25 segundos.","pictograma":"hombros:abrazo"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000202',
    'Hombros, rutina 3',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Hombros: círculos hacia adelante","texto":"Ahora círculos pequeños con los hombros hacia adelante, sin apurarte, unas cinco veces.","pictograma":"hombros:circulo-adelante"},{"titulo":"Hombros: llevarlos atrás","texto":"Lleva los hombros un poco hacia atrás, como juntando los omóplatos, y suelta. Dos o tres veces.","pictograma":"hombros:juntar"},{"titulo":"Hombros: un abrazo","texto":"Cruza los brazos sobre el pecho como en un abrazo y respira con calma unos 25 segundos.","pictograma":"hombros:abrazo"},{"titulo":"Hombros: el brazo derecho al otro lado","texto":"Lleva el brazo derecho al otro lado del pecho y apóyalo con la mano izquierda, sin empujar fuerte. Unos 20 segundos.","pictograma":"hombros:cruzar-der"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000202',
    'Hombros, rutina 4',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Hombros: llevarlos atrás","texto":"Lleva los hombros un poco hacia atrás, como juntando los omóplatos, y suelta. Dos o tres veces.","pictograma":"hombros:juntar"},{"titulo":"Hombros: un abrazo","texto":"Cruza los brazos sobre el pecho como en un abrazo y respira con calma unos 25 segundos.","pictograma":"hombros:abrazo"},{"titulo":"Hombros: el brazo derecho al otro lado","texto":"Lleva el brazo derecho al otro lado del pecho y apóyalo con la mano izquierda, sin empujar fuerte. Unos 20 segundos.","pictograma":"hombros:cruzar-der"},{"titulo":"Hombros: el brazo izquierdo al otro lado","texto":"Lleva el brazo izquierdo al otro lado del pecho y apóyalo con la mano derecha, sin empujar fuerte. Unos 20 segundos.","pictograma":"hombros:cruzar-izq"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000202',
    'Hombros, rutina 5',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Hombros: el brazo derecho al otro lado","texto":"Lleva el brazo derecho al otro lado del pecho y apóyalo con la mano izquierda, sin empujar fuerte. Unos 20 segundos.","pictograma":"hombros:cruzar-der"},{"titulo":"Hombros: el brazo izquierdo al otro lado","texto":"Lleva el brazo izquierdo al otro lado del pecho y apóyalo con la mano derecha, sin empujar fuerte. Unos 20 segundos.","pictograma":"hombros:cruzar-izq"},{"titulo":"Hombros: abrir los brazos","texto":"Abre los brazos a los lados, como dejando entrar el aire, y vuelve a bajarlos despacio. Tres veces.","pictograma":"hombros:abrir"},{"titulo":"Hombros: subir y soltar","texto":"Sube los hombros hacia las orejas al inhalar y suéltalos al exhalar. Repite tres veces, despacio.","pictograma":"hombros:subir"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000202',
    'Hombros, rutina 6',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Hombros: el brazo izquierdo al otro lado","texto":"Lleva el brazo izquierdo al otro lado del pecho y apóyalo con la mano derecha, sin empujar fuerte. Unos 20 segundos.","pictograma":"hombros:cruzar-izq"},{"titulo":"Hombros: abrir los brazos","texto":"Abre los brazos a los lados, como dejando entrar el aire, y vuelve a bajarlos despacio. Tres veces.","pictograma":"hombros:abrir"},{"titulo":"Hombros: subir y soltar","texto":"Sube los hombros hacia las orejas al inhalar y suéltalos al exhalar. Repite tres veces, despacio.","pictograma":"hombros:subir"},{"titulo":"Hombros: círculos hacia atrás","texto":"Dibuja círculos pequeños con los hombros hacia atrás, sin apurarte, unas cinco veces.","pictograma":"hombros:circulo-atras"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000202',
    'Muñecas y manos, rutina 1',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Muñecas: círculos suaves","texto":"Haz círculos suaves con las muñecas, cinco hacia un lado y cinco hacia el otro.","pictograma":"manos:circulo"},{"titulo":"Muñecas: palma hacia arriba","texto":"Estira un brazo al frente con la palma hacia arriba y, con la otra mano, lleva los dedos suavemente hacia abajo. Luego cambia.","pictograma":"manos:palma-arriba"},{"titulo":"Muñecas: palma hacia abajo","texto":"Estira un brazo al frente con la palma hacia abajo y, con la otra mano, lleva los dedos suavemente hacia ti. Luego cambia.","pictograma":"manos:palma-abajo"},{"titulo":"Manos: abrir y cerrar","texto":"Abre las manos bien y ciérralas despacio, varias veces, sin apretar fuerte.","pictograma":"manos:abrir-cerrar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000202',
    'Muñecas y manos, rutina 2',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Muñecas: palma hacia arriba","texto":"Estira un brazo al frente con la palma hacia arriba y, con la otra mano, lleva los dedos suavemente hacia abajo. Luego cambia.","pictograma":"manos:palma-arriba"},{"titulo":"Muñecas: palma hacia abajo","texto":"Estira un brazo al frente con la palma hacia abajo y, con la otra mano, lleva los dedos suavemente hacia ti. Luego cambia.","pictograma":"manos:palma-abajo"},{"titulo":"Manos: abrir y cerrar","texto":"Abre las manos bien y ciérralas despacio, varias veces, sin apretar fuerte.","pictograma":"manos:abrir-cerrar"},{"titulo":"Manos: dedos como una estrella","texto":"Separa los dedos como una estrella y júntalos, despacio, unas cinco veces.","pictograma":"manos:dedos"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000202',
    'Muñecas y manos, rutina 3',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Muñecas: palma hacia abajo","texto":"Estira un brazo al frente con la palma hacia abajo y, con la otra mano, lleva los dedos suavemente hacia ti. Luego cambia.","pictograma":"manos:palma-abajo"},{"titulo":"Manos: abrir y cerrar","texto":"Abre las manos bien y ciérralas despacio, varias veces, sin apretar fuerte.","pictograma":"manos:abrir-cerrar"},{"titulo":"Manos: dedos como una estrella","texto":"Separa los dedos como una estrella y júntalos, despacio, unas cinco veces.","pictograma":"manos:dedos"},{"titulo":"Manos: palmas juntas","texto":"Junta las palmas frente al pecho y baja un poco las manos, sin separar las palmas. Unos 15 segundos.","pictograma":"manos:oracion"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000202',
    'Muñecas y manos, rutina 4',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Manos: abrir y cerrar","texto":"Abre las manos bien y ciérralas despacio, varias veces, sin apretar fuerte.","pictograma":"manos:abrir-cerrar"},{"titulo":"Manos: dedos como una estrella","texto":"Separa los dedos como una estrella y júntalos, despacio, unas cinco veces.","pictograma":"manos:dedos"},{"titulo":"Manos: palmas juntas","texto":"Junta las palmas frente al pecho y baja un poco las manos, sin separar las palmas. Unos 15 segundos.","pictograma":"manos:oracion"},{"titulo":"Manos: sacudirlas","texto":"Sacude las manos con suavidad, como quitando gotas de agua, unos 10 segundos.","pictograma":"manos:sacudir"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000202',
    'Muñecas y manos, rutina 5',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Manos: palmas juntas","texto":"Junta las palmas frente al pecho y baja un poco las manos, sin separar las palmas. Unos 15 segundos.","pictograma":"manos:oracion"},{"titulo":"Manos: sacudirlas","texto":"Sacude las manos con suavidad, como quitando gotas de agua, unos 10 segundos.","pictograma":"manos:sacudir"},{"titulo":"Manos: una pelota imaginaria","texto":"Aprieta con suavidad una pelota imaginaria entre las manos y suelta, varias veces.","pictograma":"manos:presionar"},{"titulo":"Muñecas: círculos suaves","texto":"Haz círculos suaves con las muñecas, cinco hacia un lado y cinco hacia el otro.","pictograma":"manos:circulo"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000202',
    'Muñecas y manos, rutina 6',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Manos: sacudirlas","texto":"Sacude las manos con suavidad, como quitando gotas de agua, unos 10 segundos.","pictograma":"manos:sacudir"},{"titulo":"Manos: una pelota imaginaria","texto":"Aprieta con suavidad una pelota imaginaria entre las manos y suelta, varias veces.","pictograma":"manos:presionar"},{"titulo":"Muñecas: círculos suaves","texto":"Haz círculos suaves con las muñecas, cinco hacia un lado y cinco hacia el otro.","pictograma":"manos:circulo"},{"titulo":"Muñecas: palma hacia arriba","texto":"Estira un brazo al frente con la palma hacia arriba y, con la otra mano, lleva los dedos suavemente hacia abajo. Luego cambia.","pictograma":"manos:palma-arriba"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000202',
    'Espalda, rutina 1',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Espalda: crecer sin tensar","texto":"Siéntate con la espalda larga y los pies apoyados. Siente cómo te creces, sin tensar, unos 20 segundos.","pictograma":"espalda:alargar"},{"titulo":"Espalda: girar un poco a la derecha","texto":"Con la espalda larga, gira el torso un poco hacia la derecha, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-der"},{"titulo":"Espalda: girar un poco a la izquierda","texto":"Con la espalda larga, gira el torso un poco hacia la izquierda, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-izq"},{"titulo":"Espalda: redondearla","texto":"Redondea la espalda hacia adelante, como un gato, y deja caer los brazos. Unos 15 segundos.","pictograma":"espalda:redondear"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000202',
    'Espalda, rutina 2',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Espalda: girar un poco a la derecha","texto":"Con la espalda larga, gira el torso un poco hacia la derecha, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-der"},{"titulo":"Espalda: girar un poco a la izquierda","texto":"Con la espalda larga, gira el torso un poco hacia la izquierda, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-izq"},{"titulo":"Espalda: redondearla","texto":"Redondea la espalda hacia adelante, como un gato, y deja caer los brazos. Unos 15 segundos.","pictograma":"espalda:redondear"},{"titulo":"Espalda: el pecho hacia adelante","texto":"Lleva el pecho un poco hacia adelante, sin arquear de más, y vuelve al centro. Tres veces.","pictograma":"espalda:arco"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000202',
    'Espalda, rutina 3',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Espalda: girar un poco a la izquierda","texto":"Con la espalda larga, gira el torso un poco hacia la izquierda, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-izq"},{"titulo":"Espalda: redondearla","texto":"Redondea la espalda hacia adelante, como un gato, y deja caer los brazos. Unos 15 segundos.","pictograma":"espalda:redondear"},{"titulo":"Espalda: el pecho hacia adelante","texto":"Lleva el pecho un poco hacia adelante, sin arquear de más, y vuelve al centro. Tres veces.","pictograma":"espalda:arco"},{"titulo":"Espalda: inclinarse a la derecha","texto":"Con una mano en el muslo, inclina el torso un poco hacia la derecha; el otro brazo puede subir al lado.","pictograma":"espalda:inclinar-der"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000202',
    'Espalda, rutina 4',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Espalda: redondearla","texto":"Redondea la espalda hacia adelante, como un gato, y deja caer los brazos. Unos 15 segundos.","pictograma":"espalda:redondear"},{"titulo":"Espalda: el pecho hacia adelante","texto":"Lleva el pecho un poco hacia adelante, sin arquear de más, y vuelve al centro. Tres veces.","pictograma":"espalda:arco"},{"titulo":"Espalda: inclinarse a la derecha","texto":"Con una mano en el muslo, inclina el torso un poco hacia la derecha; el otro brazo puede subir al lado.","pictograma":"espalda:inclinar-der"},{"titulo":"Espalda: inclinarse a la izquierda","texto":"Con una mano en el muslo, inclina el torso un poco hacia la izquierda; el otro brazo puede subir al lado.","pictograma":"espalda:inclinar-izq"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000202',
    'Espalda, rutina 5',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Espalda: inclinarse a la derecha","texto":"Con una mano en el muslo, inclina el torso un poco hacia la derecha; el otro brazo puede subir al lado.","pictograma":"espalda:inclinar-der"},{"titulo":"Espalda: inclinarse a la izquierda","texto":"Con una mano en el muslo, inclina el torso un poco hacia la izquierda; el otro brazo puede subir al lado.","pictograma":"espalda:inclinar-izq"},{"titulo":"Espalda: inclinarse hacia adelante","texto":"Inclínate hacia adelante desde las caderas, con las manos en los muslos, y vuelve despacio.","pictograma":"espalda:adelante"},{"titulo":"Espalda: crecer sin tensar","texto":"Siéntate con la espalda larga y los pies apoyados. Siente cómo te creces, sin tensar, unos 20 segundos.","pictograma":"espalda:alargar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000202',
    'Espalda, rutina 6',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Espalda: inclinarse a la izquierda","texto":"Con una mano en el muslo, inclina el torso un poco hacia la izquierda; el otro brazo puede subir al lado.","pictograma":"espalda:inclinar-izq"},{"titulo":"Espalda: inclinarse hacia adelante","texto":"Inclínate hacia adelante desde las caderas, con las manos en los muslos, y vuelve despacio.","pictograma":"espalda:adelante"},{"titulo":"Espalda: crecer sin tensar","texto":"Siéntate con la espalda larga y los pies apoyados. Siente cómo te creces, sin tensar, unos 20 segundos.","pictograma":"espalda:alargar"},{"titulo":"Espalda: girar un poco a la derecha","texto":"Con la espalda larga, gira el torso un poco hacia la derecha, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-der"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000202',
    'Piernas, rutina 1',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Piernas: círculos con el tobillo","texto":"Levanta un pie y haz círculos suaves con el tobillo, cinco para cada lado; luego cambia de pie.","pictograma":"piernas:tobillos"},{"titulo":"Piernas: estirar una al frente","texto":"Estira una pierna al frente, con el talón en el suelo, y nota el estiramiento detrás del muslo. Luego cambia.","pictograma":"piernas:estirar"},{"titulo":"Piernas: puntas y talones","texto":"Sin levantar los pies del suelo, sube las puntas y luego los talones, alternando, unas diez veces.","pictograma":"piernas:punta-talon"},{"titulo":"Piernas: marchar desde la silla","texto":"Desde la silla, sube una rodilla y luego la otra, como marchando despacio, unas diez veces.","pictograma":"piernas:marchar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000202',
    'Piernas, rutina 2',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Piernas: estirar una al frente","texto":"Estira una pierna al frente, con el talón en el suelo, y nota el estiramiento detrás del muslo. Luego cambia.","pictograma":"piernas:estirar"},{"titulo":"Piernas: puntas y talones","texto":"Sin levantar los pies del suelo, sube las puntas y luego los talones, alternando, unas diez veces.","pictograma":"piernas:punta-talon"},{"titulo":"Piernas: marchar desde la silla","texto":"Desde la silla, sube una rodilla y luego la otra, como marchando despacio, unas diez veces.","pictograma":"piernas:marchar"},{"titulo":"Piernas: empujar el suelo","texto":"Empuja el suelo con los pies, como para ponerte de pie, y suelta. Tres veces.","pictograma":"piernas:empujar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000202',
    'Piernas, rutina 3',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Piernas: puntas y talones","texto":"Sin levantar los pies del suelo, sube las puntas y luego los talones, alternando, unas diez veces.","pictograma":"piernas:punta-talon"},{"titulo":"Piernas: marchar desde la silla","texto":"Desde la silla, sube una rodilla y luego la otra, como marchando despacio, unas diez veces.","pictograma":"piernas:marchar"},{"titulo":"Piernas: empujar el suelo","texto":"Empuja el suelo con los pies, como para ponerte de pie, y suelta. Tres veces.","pictograma":"piernas:empujar"},{"titulo":"Piernas: un tobillo sobre la rodilla","texto":"Cruza un tobillo sobre la rodilla contraria, solo si es cómodo, y descansa la pierna. Luego cambia.","pictograma":"piernas:cruzar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000202',
    'Piernas, rutina 4',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Piernas: marchar desde la silla","texto":"Desde la silla, sube una rodilla y luego la otra, como marchando despacio, unas diez veces.","pictograma":"piernas:marchar"},{"titulo":"Piernas: empujar el suelo","texto":"Empuja el suelo con los pies, como para ponerte de pie, y suelta. Tres veces.","pictograma":"piernas:empujar"},{"titulo":"Piernas: un tobillo sobre la rodilla","texto":"Cruza un tobillo sobre la rodilla contraria, solo si es cómodo, y descansa la pierna. Luego cambia.","pictograma":"piernas:cruzar"},{"titulo":"Piernas: subir los talones","texto":"Apoya las puntas de los pies y sube los talones un poco, bajando despacio, unas ocho veces.","pictograma":"piernas:pantorrillas"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000202',
    'Piernas, rutina 5',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Piernas: un tobillo sobre la rodilla","texto":"Cruza un tobillo sobre la rodilla contraria, solo si es cómodo, y descansa la pierna. Luego cambia.","pictograma":"piernas:cruzar"},{"titulo":"Piernas: subir los talones","texto":"Apoya las puntas de los pies y sube los talones un poco, bajando despacio, unas ocho veces.","pictograma":"piernas:pantorrillas"},{"titulo":"Piernas: sacudirlas","texto":"Sacude las piernas con suavidad, una por una, para soltar el cansancio.","pictograma":"piernas:sacudir"},{"titulo":"Piernas: círculos con el tobillo","texto":"Levanta un pie y haz círculos suaves con el tobillo, cinco para cada lado; luego cambia de pie.","pictograma":"piernas:tobillos"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000202',
    'Piernas, rutina 6',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Piernas: subir los talones","texto":"Apoya las puntas de los pies y sube los talones un poco, bajando despacio, unas ocho veces.","pictograma":"piernas:pantorrillas"},{"titulo":"Piernas: sacudirlas","texto":"Sacude las piernas con suavidad, una por una, para soltar el cansancio.","pictograma":"piernas:sacudir"},{"titulo":"Piernas: círculos con el tobillo","texto":"Levanta un pie y haz círculos suaves con el tobillo, cinco para cada lado; luego cambia de pie.","pictograma":"piernas:tobillos"},{"titulo":"Piernas: estirar una al frente","texto":"Estira una pierna al frente, con el talón en el suelo, y nota el estiramiento detrás del muslo. Luego cambia.","pictograma":"piernas:estirar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000202',
    'Ojos, rutina 1',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Ojos: mirar lejos","texto":"Mira por la ventana o hacia lo más lejos que veas, unos 20 segundos.","pictograma":"ojos:lejos"},{"titulo":"Ojos: de cerca a lejos","texto":"Mira un objeto cercano unos segundos y luego uno lejano, alternando varias veces.","pictograma":"ojos:cerca-lejos"},{"titulo":"Ojos: parpadear suave","texto":"Parpadea suave y seguido unos 10 segundos, y luego cierra los ojos un momento.","pictograma":"ojos:parpadear"},{"titulo":"Ojos: arriba y abajo","texto":"Sin mover la cabeza, mira hacia arriba y luego hacia abajo, despacio, cinco veces.","pictograma":"ojos:arriba-abajo"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000202',
    'Ojos, rutina 2',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Ojos: de cerca a lejos","texto":"Mira un objeto cercano unos segundos y luego uno lejano, alternando varias veces.","pictograma":"ojos:cerca-lejos"},{"titulo":"Ojos: parpadear suave","texto":"Parpadea suave y seguido unos 10 segundos, y luego cierra los ojos un momento.","pictograma":"ojos:parpadear"},{"titulo":"Ojos: arriba y abajo","texto":"Sin mover la cabeza, mira hacia arriba y luego hacia abajo, despacio, cinco veces.","pictograma":"ojos:arriba-abajo"},{"titulo":"Ojos: derecha e izquierda","texto":"Sin mover la cabeza, mira hacia la derecha y luego hacia la izquierda, despacio, cinco veces.","pictograma":"ojos:der-izq"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000202',
    'Ojos, rutina 3',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Ojos: parpadear suave","texto":"Parpadea suave y seguido unos 10 segundos, y luego cierra los ojos un momento.","pictograma":"ojos:parpadear"},{"titulo":"Ojos: arriba y abajo","texto":"Sin mover la cabeza, mira hacia arriba y luego hacia abajo, despacio, cinco veces.","pictograma":"ojos:arriba-abajo"},{"titulo":"Ojos: derecha e izquierda","texto":"Sin mover la cabeza, mira hacia la derecha y luego hacia la izquierda, despacio, cinco veces.","pictograma":"ojos:der-izq"},{"titulo":"Ojos: las manos tibias","texto":"Frota las manos para calentarlas y apóyalas sobre los ojos cerrados, sin presionar, unos 20 segundos.","pictograma":"ojos:palmas"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000202',
    'Ojos, rutina 4',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Ojos: arriba y abajo","texto":"Sin mover la cabeza, mira hacia arriba y luego hacia abajo, despacio, cinco veces.","pictograma":"ojos:arriba-abajo"},{"titulo":"Ojos: derecha e izquierda","texto":"Sin mover la cabeza, mira hacia la derecha y luego hacia la izquierda, despacio, cinco veces.","pictograma":"ojos:der-izq"},{"titulo":"Ojos: las manos tibias","texto":"Frota las manos para calentarlas y apóyalas sobre los ojos cerrados, sin presionar, unos 20 segundos.","pictograma":"ojos:palmas"},{"titulo":"Ojos: un círculo con la mirada","texto":"Dibuja con la mirada un círculo grande, despacio, hacia un lado y luego hacia el otro.","pictograma":"ojos:circulo"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000202',
    'Ojos, rutina 5',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Ojos: las manos tibias","texto":"Frota las manos para calentarlas y apóyalas sobre los ojos cerrados, sin presionar, unos 20 segundos.","pictograma":"ojos:palmas"},{"titulo":"Ojos: un círculo con la mirada","texto":"Dibuja con la mirada un círculo grande, despacio, hacia un lado y luego hacia el otro.","pictograma":"ojos:circulo"},{"titulo":"Ojos: dejarlos descansar","texto":"Cierra los ojos y déjalos descansar unos 20 segundos, respirando normal.","pictograma":"ojos:cerrar"},{"titulo":"Ojos: mirar lejos","texto":"Mira por la ventana o hacia lo más lejos que veas, unos 20 segundos.","pictograma":"ojos:lejos"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000202',
    'Ojos, rutina 6',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Ojos: un círculo con la mirada","texto":"Dibuja con la mirada un círculo grande, despacio, hacia un lado y luego hacia el otro.","pictograma":"ojos:circulo"},{"titulo":"Ojos: dejarlos descansar","texto":"Cierra los ojos y déjalos descansar unos 20 segundos, respirando normal.","pictograma":"ojos:cerrar"},{"titulo":"Ojos: mirar lejos","texto":"Mira por la ventana o hacia lo más lejos que veas, unos 20 segundos.","pictograma":"ojos:lejos"},{"titulo":"Ojos: de cerca a lejos","texto":"Mira un objeto cercano unos segundos y luego uno lejano, alternando varias veces.","pictograma":"ojos:cerca-lejos"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000202',
    'Pausa de escritorio',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: la oreja al hombro derecho","texto":"Deja caer la oreja derecha hacia el hombro derecho, despacio y sin forzar. Respira normal unos 25 segundos.","pictograma":"cuello:inclinar-der"},{"titulo":"Hombros: subir y soltar","texto":"Sube los hombros hacia las orejas al inhalar y suéltalos al exhalar. Repite tres veces, despacio.","pictograma":"hombros:subir"},{"titulo":"Muñecas: círculos suaves","texto":"Haz círculos suaves con las muñecas, cinco hacia un lado y cinco hacia el otro.","pictograma":"manos:circulo"},{"titulo":"Ojos: mirar lejos","texto":"Mira por la ventana o hacia lo más lejos que veas, unos 20 segundos.","pictograma":"ojos:lejos"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000202',
    'Pausa larga desde la silla',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Espalda: crecer sin tensar","texto":"Siéntate con la espalda larga y los pies apoyados. Siente cómo te creces, sin tensar, unos 20 segundos.","pictograma":"espalda:alargar"},{"titulo":"Espalda: girar un poco a la derecha","texto":"Con la espalda larga, gira el torso un poco hacia la derecha, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-der"},{"titulo":"Espalda: girar un poco a la izquierda","texto":"Con la espalda larga, gira el torso un poco hacia la izquierda, apoyando la mano en el respaldo, solo hasta donde se sienta bien.","pictograma":"espalda:torcer-izq"},{"titulo":"Piernas: estirar una al frente","texto":"Estira una pierna al frente, con el talón en el suelo, y nota el estiramiento detrás del muslo. Luego cambia.","pictograma":"piernas:estirar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000202',
    'Pausa de la tarde',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Hombros: un abrazo","texto":"Cruza los brazos sobre el pecho como en un abrazo y respira con calma unos 25 segundos.","pictograma":"hombros:abrazo"},{"titulo":"Manos: sacudirlas","texto":"Sacude las manos con suavidad, como quitando gotas de agua, unos 10 segundos.","pictograma":"manos:sacudir"},{"titulo":"Piernas: círculos con el tobillo","texto":"Levanta un pie y haz círculos suaves con el tobillo, cinco para cada lado; luego cambia de pie.","pictograma":"piernas:tobillos"},{"titulo":"Ojos: las manos tibias","texto":"Frota las manos para calentarlas y apóyalas sobre los ojos cerrados, sin presionar, unos 20 segundos.","pictograma":"ojos:palmas"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510202-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000202',
    'Pausa de la mañana',
    1,
    '{"modo":"pasos","advertenciaInicial":"Hazlo sin dolor: si algo duele, para. Es una pausa suave, no un ejercicio fuerte, y no sustituye la atención médica ni la fisioterapia. Se puede hacer desde una silla.","intro":"Cuatro movimientos suaves, uno tras otro, desde una silla. Pasa al siguiente cuando quieras.","avance":"manual","pasos":[{"titulo":"Cuello: alargarlo","texto":"Imagina un hilo que te estira desde la coronilla. Alarga el cuello sin subir los hombros, unos 25 segundos.","pictograma":"cuello:alargar"},{"titulo":"Hombros: círculos hacia atrás","texto":"Dibuja círculos pequeños con los hombros hacia atrás, sin apurarte, unas cinco veces.","pictograma":"hombros:circulo-atras"},{"titulo":"Espalda: redondearla","texto":"Redondea la espalda hacia adelante, como un gato, y deja caer los brazos. Unos 15 segundos.","pictograma":"espalda:redondear"},{"titulo":"Piernas: marchar desde la silla","texto":"Desde la silla, sube una rodilla y luego la otra, como marchando despacio, unas diez veces.","pictograma":"piernas:marchar"}],"cierre":"Eso es todo. Tu cuerpo lo nota.","avisoSiempre":"Si algo duele, para."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-03 · El hábito de sueño de hoy: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510203-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000203',
    'Luz de la mañana',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Luz de la mañana","texto":"Sal a la luz natural un rato después de despertarte: a la ventana, al balcón o a la calle.","porQue":"Suele ayudar a que el cuerpo reconozca que ya es de día.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000203',
    'Una hora parecida',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una hora parecida","texto":"Hoy intenta acostarte a una hora parecida a la de ayer.","porQue":"Un horario parecido suele ayudar al cuerpo a saber cuándo toca descansar.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000203',
    'Un cuarto fresco',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Un cuarto fresco","texto":"Ventila el cuarto antes de dormir y busca que quede fresco.","porQue":"Un cuarto fresco suele ser más cómodo para dormir.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000203',
    'Un cuarto oscuro',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Un cuarto oscuro","texto":"Baja las luces del cuarto y tapa las que puedas.","porQue":"Menos luz suele ayudar a que llegue el sueño.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000203',
    'La pantalla lejos de la cama',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"La pantalla lejos de la cama","texto":"Deja el celular y las pantallas lejos de la cama un rato antes de dormir.","porQue":"Suele ayudar a que la mente baje el ritmo.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000203',
    'Una cena ligera',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una cena ligera","texto":"Cena algo ligero y a una hora que te deje un rato antes de acostarte.","porQue":"Las comidas muy pesadas tarde suelen hacer más difícil descansar.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000203',
    'La cafeína, más temprano',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"La cafeína, más temprano","texto":"Si tomas café o bebidas con cafeína, hoy déjalas para antes de la tarde.","porQue":"La cafeína de la tarde suele quedarse en el cuerpo hasta la noche.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000203',
    'Una ducha tibia',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una ducha tibia","texto":"Date una ducha tibia antes de dormir, sin prisa.","porQue":"Suele ayudar a bajar el ritmo antes de acostarse.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000203',
    'Estirar un poco',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Estirar un poco","texto":"Estira el cuello y los hombros con suavidad antes de acostarte.","porQue":"Soltar la tensión suele hacer más cómodo el rato de dormir.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000203',
    'Un rincón ordenado',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Un rincón ordenado","texto":"Ordena un poco el cuarto antes de dormir: una silla, la mesa, la ropa.","porQue":"Un espacio ordenado suele sentirse más tranquilo.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000203',
    'Los pendientes en un papel',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Los pendientes en un papel","texto":"Anota en un papel lo que te preocupa o te falta por hacer, y déjalo ahí.","porQue":"Sacar los pendientes de la cabeza suele ayudar a que se calme.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000203',
    'Tres respiraciones',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Tres respiraciones","texto":"Ya en la cama, respira con calma tres veces antes de cerrar los ojos.","porQue":"Fijarse en la respiración suele ayudar a bajar el ritmo.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000203',
    'Unas páginas de papel',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Unas páginas de papel","texto":"Lee unas páginas de un libro de papel antes de dormir.","porQue":"Leer algo tranquilo suele ayudar a cambiar de ritmo.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000203',
    'Luces más suaves',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Luces más suaves","texto":"Una hora antes de dormir, usa luces más suaves en la casa.","porQue":"Las luces suaves suelen avisarle al cuerpo que se acerca la noche.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000203',
    'Sonidos suaves',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Sonidos suaves","texto":"Si te gusta, pon sonidos tranquilos o música suave a poco volumen.","porQue":"Un fondo suave suele ayudar a algunas personas a soltar el día.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000203',
    'Una caminata en la tarde',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una caminata en la tarde","texto":"Si puedes, camina un rato en la tarde.","porQue":"Moverse durante el día suele ayudar a descansar mejor de noche.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000203',
    'Comer a sus horas',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Comer a sus horas","texto":"Intenta comer hoy a horas parecidas a las de otros días.","porQue":"Los horarios parecidos suelen ayudar al cuerpo a organizarse.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000203',
    'Una almohada cómoda',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una almohada cómoda","texto":"Revisa si tu almohada está cómoda; acomódala o cámbiala de posición.","porQue":"Sentirse a gusto suele hacer más fácil conciliar el sueño.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000203',
    'La cobija justa',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"La cobija justa","texto":"Elige la cobija según el clima, para no sentir ni frío ni calor.","porQue":"La temperatura cómoda suele ayudar a dormir sin interrupciones.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000203',
    'El ejercicio, antes de la noche',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"El ejercicio, antes de la noche","texto":"Si haces ejercicio fuerte, déjalo para antes de que anochezca.","porQue":"El ejercicio intenso muy tarde suele dificultar el descanso a algunas personas.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000203',
    'La cama para dormir',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"La cama para dormir","texto":"Usa la cama sobre todo para dormir y descansar.","porQue":"Asociar la cama con dormir suele ayudar.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000203',
    'Si el sueño no llega',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Si el sueño no llega","texto":"Si te acuestas y el sueño no llega, levántate un rato a hacer algo tranquilo con luz suave.","porQue":"Suele ayudar más que dar vueltas en la cama.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000203',
    'Despertar a la misma hora',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Despertar a la misma hora","texto":"Intenta despertarte hoy a una hora parecida a la de ayer.","porQue":"Una hora de despertar estable suele ayudar a ordenar el resto del día.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000203',
    'Siestas cortas',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Siestas cortas","texto":"Si haces siesta, que sea corta y no muy tarde.","porQue":"Una siesta larga o tardía suele quitar sueño de la noche.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000203',
    'Una pijama cómoda',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una pijama cómoda","texto":"Ponte una pijama o ropa cómoda para dormir.","porQue":"La ropa cómoda suele ayudar a sentirse más a gusto al acostarse.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000203',
    'Ventilar la casa',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Ventilar la casa","texto":"Abre un rato las ventanas de la casa durante el día.","porQue":"El aire renovado suele hacer más agradable el cuarto por la noche.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000203',
    'Agua cerca',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Agua cerca","texto":"Deja un vaso de agua cerca de la cama.","porQue":"Tenerla a mano suele evitar levantarse del todo si te da sed.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000203',
    'Notificaciones en silencio',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Notificaciones en silencio","texto":"Silencia las notificaciones del celular para la noche.","porQue":"Menos avisos suelen significar menos interrupciones.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000203',
    'Una canción tranquila',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una canción tranquila","texto":"Escucha una canción lenta que te guste.","porQue":"Una música tranquila suele ayudar a cambiar de ritmo.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000203',
    'Algo agradable del día',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Algo agradable del día","texto":"Antes de dormir, piensa en algo agradable que te pasó hoy, por pequeño que sea.","porQue":"Terminar el día con algo amable suele sentirse bien.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000203',
    'La ropa de mañana lista',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"La ropa de mañana lista","texto":"Deja lista la ropa que usarás mañana.","porQue":"Tener algo resuelto suele quitar peso de la cabeza.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000203',
    'El cargador fuera de la cama',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"El cargador fuera de la cama","texto":"Carga el celular lejos de la cama.","porQue":"Tenerlo lejos suele ayudar a no revisarlo de más.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000203',
    'No mirar el reloj',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"No mirar el reloj","texto":"Si te despiertas de noche, intenta no mirar el reloj.","porQue":"Contar las horas que quedan suele hacer más difícil volver a dormirse.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000203',
    'Pensar el problema de día',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Pensar el problema de día","texto":"Si algo te preocupa, trata de pensarlo durante el día y no en la cama.","porQue":"Darle un momento al día suele dejar la noche más libre.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000203',
    'El sol de la tarde',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"El sol de la tarde","texto":"Si puedes, sal un rato a la luz de la tarde.","porQue":"La luz natural durante el día suele ayudar a que de noche haya sueño.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000203',
    'Cenar un poco antes',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Cenar un poco antes","texto":"Hoy intenta cenar un poco más temprano que de costumbre.","porQue":"Cenar con tiempo suele hacer más cómodo acostarse.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000203',
    'Una comida liviana',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una comida liviana","texto":"Si cenas tarde, elige algo liviano.","porQue":"Las comidas livianas suelen caer mejor antes de dormir.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000203',
    'Un ritual corto',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Un ritual corto","texto":"Haz lo mismo cada noche unos diez minutos antes de acostarte: lavarte los dientes, apagar una luz, estirarte.","porQue":"Repetir los mismos gestos suele avisarle al cuerpo que ya es hora.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000203',
    'Cortinas o antifaz',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Cortinas o antifaz","texto":"Si entra mucha luz, cierra las cortinas o usa un antifaz.","porQue":"Menos luz suele ayudar a dormir más seguido.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510203-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000203',
    'Una temperatura estable',
    1,
    '{"modo":"tarjeta","indicacion":"Una práctica pequeña para esta noche. Las tres respuestas cuentan igual.","titulo":"Una temperatura estable","texto":"Busca que el cuarto no tenga cambios fuertes de temperatura en la noche.","porQue":"Una temperatura estable suele ayudar a no despertarse.","opciones":[{"clave":"esta-noche","texto":"La pruebo esta noche"},{"clave":"ya","texto":"Ya la hago"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Si dormir te cuesta mucho durante mucho tiempo, vale la pena hablarlo con un profesional de la salud.","cierre":"Anotado. Mañana, otra pequeña."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-04 · Un cuidado pequeño de hoy: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510204-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000204',
    'Un vaso de agua, despacio',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Un vaso de agua, despacio","texto":"Toma un vaso de agua despacio, notando cómo se siente.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000204',
    'Mirar el cielo',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Mirar el cielo","texto":"Sal a mirar el cielo un minuto, o míralo desde una ventana.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000204',
    'Lavarte la cara con calma',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Lavarte la cara con calma","texto":"Lávate la cara con agua tibia, sin prisa.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000204',
    'Ordenar un solo rincón',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Ordenar un solo rincón","texto":"Elige un solo rincón y déjalo ordenado, solo ese.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000204',
    'Escribirle a alguien que quieres',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Escribirle a alguien que quieres","texto":"Mándale un mensaje breve a alguien que quieres.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000204',
    'Estirar los brazos',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Estirar los brazos","texto":"Estira los brazos hacia arriba y suéltalos, despacio.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000204',
    'Abrir una ventana',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Abrir una ventana","texto":"Abre una ventana y respira el aire de afuera.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000204',
    'Poner una canción que te guste',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Poner una canción que te guste","texto":"Escucha una canción que te guste, de principio a fin.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000204',
    'Mirar una foto bonita',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Mirar una foto bonita","texto":"Busca una foto que te guste y mírala un momento.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000204',
    'Regar una planta',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Regar una planta","texto":"Riega una planta, o míralas un rato si tienes.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000204',
    'Tu bebida favorita, sin pantalla',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Tu bebida favorita, sin pantalla","texto":"Toma algo que te guste sin mirar ninguna pantalla.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000204',
    'Ropa cómoda',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Ropa cómoda","texto":"Cámbiate a algo cómodo si puedes.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000204',
    'Peinarte con calma',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Peinarte con calma","texto":"Péinate o arréglate el cabello sin apuro.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000204',
    'Tres respiraciones',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Tres respiraciones","texto":"Respira con calma tres veces, a tu ritmo.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000204',
    'Un minuto junto a la ventana',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Un minuto junto a la ventana","texto":"Quédate un minuto mirando por la ventana.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000204',
    'Cantar',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Cantar","texto":"Canta una canción, aunque sea bajito.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000204',
    'Un abrazo',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Un abrazo","texto":"Si te nace, abraza a alguien que quieras.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000204',
    'Saludar a una mascota',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Saludar a una mascota","texto":"Si tienes mascota, dale unos minutos de tu atención.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000204',
    'Algo rico para ti',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Algo rico para ti","texto":"Prepárate algo rico que te guste, sin pensar en cuentas.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000204',
    'Una luz cálida',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Una luz cálida","texto":"Prende una luz cálida en el lugar donde estás.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000204',
    'Crema en las manos',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Crema en las manos","texto":"Ponte crema en las manos y masajéalas un momento.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000204',
    'Caminar descalzo en casa',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Caminar descalzo en casa","texto":"Camina un rato por la casa sin zapatos, notando el suelo.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000204',
    'Sentarte al sol',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Sentarte al sol","texto":"Siéntate donde dé el sol unos minutos.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000204',
    'Una frase amable',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Una frase amable","texto":"Escribe una frase amable para ti.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000204',
    'Ordenar el escritorio',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Ordenar el escritorio","texto":"Deja ordenada una parte de tu escritorio o mesa.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000204',
    'Cerrar los ojos un minuto',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Cerrar los ojos un minuto","texto":"Cierra los ojos un minuto, si estás en un lugar cómodo.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000204',
    'Llamar a alguien',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Llamar a alguien","texto":"Llama a alguien con quien te guste hablar.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000204',
    'Tender la cama',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Tender la cama","texto":"Tiende la cama con calma.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000204',
    'Tu sitio favorito',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Tu sitio favorito","texto":"Siéntate un rato en tu sitio favorito de la casa.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000204',
    'Oler algo agradable',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Oler algo agradable","texto":"Huele algo que te guste: café, una fruta, un jabón.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000204',
    'Recordar un buen día',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Recordar un buen día","texto":"Piensa en un día que recuerdes con cariño.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000204',
    'Tres palabras que te gustan',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Tres palabras que te gustan","texto":"Escribe tres palabras que te gusten.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000204',
    'Cambiar de aire',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Cambiar de aire","texto":"Sal un momento al balcón, al patio o a la puerta.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000204',
    'Lavar una taza con calma',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Lavar una taza con calma","texto":"Lava una taza o un plato sin apuro.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000204',
    'Una alarma amable',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Una alarma amable","texto":"Pon una alarma con un sonido suave para algo que quieras hacer.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000204',
    'Dar las gracias',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Dar las gracias","texto":"Dale las gracias a alguien por algo pequeño.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000204',
    'El celular lejos un rato',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"El celular lejos un rato","texto":"Deja el celular lejos diez minutos.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000204',
    'Una pausa sin hacer nada',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Una pausa sin hacer nada","texto":"Siéntate un momento sin hacer nada.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000204',
    'Mirar algo verde',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Mirar algo verde","texto":"Busca algo verde y míralo un momento: una planta, una hoja.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510204-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000204',
    'Estirar el cuello',
    1,
    '{"modo":"tarjeta","indicacion":"Un gesto pequeño, de uno a cinco minutos. Las tres respuestas cuentan igual.","titulo":"Estirar el cuello","texto":"Estira el cuello con suavidad hacia un lado y hacia el otro.","opciones":[{"clave":"lo-hice","texto":"Lo hice"},{"clave":"luego","texto":"Lo hago luego"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Sin metas ni cuentas: lo que hagas hoy es suficiente.","cierre":"Gracias por cuidarte un poquito."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-05 · La caminata del día: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510205-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000205',
    'Una cuadra sin el celular',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una cuadra sin el celular","texto":"Camina una cuadra sin el celular en la mano. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000205',
    'Mirar hacia arriba',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Mirar hacia arriba","texto":"Mientras camines, mira hacia arriba una vez: al cielo, a los árboles, a un balcón. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000205',
    'Una calle distinta',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una calle distinta","texto":"Toma hoy una calle distinta a la de siempre, si es un lugar que conoces. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000205',
    'Al ritmo de una canción',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Al ritmo de una canción","texto":"Camina al ritmo de una canción que te guste. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000205',
    'Contar colores',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Contar colores","texto":"Mientras caminas, cuenta cuántos colores distintos ves. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000205',
    'Hasta la tienda de la esquina',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Hasta la tienda de la esquina","texto":"Camina hasta la tienda más cercana y vuelve despacio. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000205',
    'Al patio o al balcón',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Al patio o al balcón","texto":"Sal al patio, al balcón o a la puerta y camina ahí unos pasos. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000205',
    'Dar una vuelta por la casa',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Dar una vuelta por la casa","texto":"Camina por dentro de la casa, de un cuarto a otro, despacio. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000205',
    'Tres árboles',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Tres árboles","texto":"Fíjate en tres árboles o plantas distintas mientras caminas. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000205',
    'Una vuelta a la manzana',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una vuelta a la manzana","texto":"Da una vuelta a la manzana, sin prisa. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000205',
    'Escuchar los sonidos',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Escuchar los sonidos","texto":"Camina escuchando los sonidos que te rodean, sin audífonos. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000205',
    'Hasta el parque',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Hasta el parque","texto":"Camina hasta un parque cercano y siéntate un rato, si puedes. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000205',
    'Un paso un poco más lento',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Un paso un poco más lento","texto":"Camina hoy un poco más lento que de costumbre. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000205',
    'Saludar a alguien',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Saludar a alguien","texto":"Mientras caminas, saluda a alguien con una sonrisa o un gesto. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000205',
    'Mirar los techos',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Mirar los techos","texto":"Fíjate en cómo son los techos de las casas por donde pasas. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000205',
    'Sentir el suelo',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Sentir el suelo","texto":"Camina notando cómo apoyas los pies. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000205',
    'Una caminata con una persona',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una caminata con una persona","texto":"Si puedes, invita a alguien a caminar contigo. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000205',
    'Hasta donde llegue la luz',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Hasta donde llegue la luz","texto":"Camina mientras haya luz natural y regresa antes de que oscurezca. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000205',
    'Un lugar con sombra',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Un lugar con sombra","texto":"Busca un lugar con sombra y camina ahí un rato. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000205',
    'Observar el cielo',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Observar el cielo","texto":"Camina y mira cómo está el cielo hoy. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000205',
    'Al sol de la mañana',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Al sol de la mañana","texto":"Si puedes, camina un rato al sol de la mañana. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000205',
    'Sin destino',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Sin destino","texto":"Camina sin un destino fijo, por un lugar seguro y conocido. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000205',
    'Hasta la panadería',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Hasta la panadería","texto":"Camina hasta donde compres el pan y vuelve. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000205',
    'Notar los olores',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Notar los olores","texto":"Camina notando qué olores encuentras. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000205',
    'Contar flores',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Contar flores","texto":"Cuenta las flores que veas en el camino. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000205',
    'Una caminata pequeña',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una caminata pequeña","texto":"Camina lo que hoy te parezca razonable, aunque sea muy poco. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000205',
    'Mirar las nubes',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Mirar las nubes","texto":"Mira las nubes un rato mientras caminas o desde una ventana. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000205',
    'Cambiar de acera',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Cambiar de acera","texto":"Camina por la otra acera hoy, si es seguro. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000205',
    'Hasta un lugar que te guste',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Hasta un lugar que te guste","texto":"Camina hasta un lugar cercano que te guste. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000205',
    'Sacudir las piernas al salir',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Sacudir las piernas al salir","texto":"Al empezar, sacude un poco las piernas y camina despacio. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000205',
    'Notar tu respiración',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Notar tu respiración","texto":"Mientras caminas, fíjate en cómo respiras, sin cambiarla. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000205',
    'Un recado a pie',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Un recado a pie","texto":"Haz un recado cercano a pie en vez de en transporte. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000205',
    'Escuchar a los pájaros',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Escuchar a los pájaros","texto":"Camina fijándote si hay pájaros cerca. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000205',
    'Una caminata en la tarde',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una caminata en la tarde","texto":"Si puedes, sal a caminar al final de la tarde, con luz. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000205',
    'Caminar con una intención',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Caminar con una intención","texto":"Camina pensando en algo que te gustaría agradecer. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000205',
    'Una pausa en el camino',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una pausa en el camino","texto":"Camina y detente un momento en algún lugar agradable. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000205',
    'Mirar a lo lejos',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Mirar a lo lejos","texto":"Mientras caminas, mira de vez en cuando lo más lejano que veas. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000205',
    'Cambiar de paso',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Cambiar de paso","texto":"Camina un rato más rápido y otro más lento, como te sientas. Unos 10 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000205',
    'Junto a una ventana',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Junto a una ventana","texto":"Si hoy no puedes salir, pasa un rato junto a una ventana, mirando afuera. Unos 5 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510205-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000205',
    'Una caminata de ida y vuelta',
    1,
    '{"modo":"tarjeta","indicacion":"Una invitación, siempre opcional. Las tres respuestas cuentan igual.","titulo":"Una caminata de ida y vuelta","texto":"Camina hasta donde quieras y regresa por el mismo camino. Unos 20 minutos.","opciones":[{"clave":"la-hice","texto":"La hice"},{"clave":"un-poco","texto":"Hice un poco"},{"clave":"hoy-no","texto":"Hoy no"}],"nota":"Elige un lugar y una hora que te parezcan seguros. Si hoy no puedes salir, pasa un rato junto a una ventana: también cuenta.","cierre":"Gracias por contarlo. Cada paso suma, sin cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-06 · Escaneo corporal: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510206-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la silla, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la silla, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la silla, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 5 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, de pie, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, de pie, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, de pie, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 5 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la cama, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con la cama: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la cama, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con la cama: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la cama, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 5 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con la cama: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la silla, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la silla, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la silla, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 5 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, de pie, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, de pie, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, de pie, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 5 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la cama, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con la cama: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la cama, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con la cama: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la cama, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 5 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con la cama: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de arriba, en la silla, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de arriba. No hay nada que cambiar. Dura unos 1 minuto.","avance":"manual","pasos":[{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de abajo, en la silla, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de arriba, en la silla, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de abajo, de pie, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de abajo. No hay nada que cambiar. Dura unos 1 minuto.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de arriba, de pie, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de abajo, de pie, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con el suelo: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de arriba, en la cama, 20 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de arriba. No hay nada que cambiar. Dura unos 1 minuto.","avance":"manual","pasos":[{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 20 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de abajo, en la cama, 30 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Lleva la atención a tus pies. Nota si sientes el contacto con la cama: el peso, la temperatura, lo que haya. No hace falta cambiar nada. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Sube la atención a las piernas. Nota si se sienten pesadas o livianas, tensas o sueltas, sin juzgarlo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Lleva la atención al abdomen. Nota cómo se mueve con cada respiración, sin intentar cambiarla. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de arriba, en la cama, 45 s',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"El pecho","texto":"Nota tu pecho: si se mueve, si se siente cálido, si hay algo de presión. Solo observa lo que hay. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Lleva la atención a los brazos y a las manos. Nota el contacto con lo que tocan y su temperatura. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Termina en la cabeza y la cara: la frente, los ojos, la mandíbula. Nota lo que haya, sin cambiarlo. Quédate aquí unos 45 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la silla, voz seca',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Pies. Nota el contacto con el suelo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Piernas. Nota si pesan o no, si están tensas o sueltas. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Abdomen. Nota cómo se mueve al respirar. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Pecho. Nota si se mueve y si siente algo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Brazos y manos. Nota el contacto y la temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Cabeza y cara. Nota la frente, los ojos y la mandíbula. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la silla, voz seca',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Cabeza y cara. Nota la frente, los ojos y la mandíbula. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Brazos y manos. Nota el contacto y la temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Pecho. Nota si se mueve y si siente algo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Abdomen. Nota cómo se mueve al respirar. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Piernas. Nota si pesan o no, si están tensas o sueltas. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Pies. Nota el contacto con el suelo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la cama, voz seca',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Pies. Nota el contacto con la cama. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Piernas. Nota si pesan o no, si están tensas o sueltas. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Abdomen. Nota cómo se mueve al respirar. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Pecho. Nota si se mueve y si siente algo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Brazos y manos. Nota el contacto y la temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Cabeza y cara. Nota la frente, los ojos y la mandíbula. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, de pie, voz seca',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Cabeza y cara. Nota la frente, los ojos y la mandíbula. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Brazos y manos. Nota el contacto y la temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Pecho. Nota si se mueve y si siente algo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Abdomen. Nota cómo se mueve al respirar. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Piernas. Nota si pesan o no, si están tensas o sueltas. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los pies","texto":"Pies. Nota el contacto con el suelo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de abajo, en la silla, voz seca',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Pies. Nota el contacto con el suelo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Piernas. Nota si pesan o no, si están tensas o sueltas. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Abdomen. Nota cómo se mueve al respirar. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de arriba, en la cama, voz seca',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"El pecho","texto":"Pecho. Nota si se mueve y si siente algo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Brazos y manos. Nota el contacto y la temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Cabeza y cara. Nota la frente, los ojos y la mandíbula. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, de pie, voz seca',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Pies. Nota el contacto con el suelo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Las piernas","texto":"Piernas. Nota si pesan o no, si están tensas o sueltas. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El abdomen","texto":"Abdomen. Nota cómo se mueve al respirar. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"El pecho","texto":"Pecho. Nota si se mueve y si siente algo. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"Los brazos y las manos","texto":"Brazos y manos. Nota el contacto y la temperatura. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."},{"titulo":"La cabeza y la cara","texto":"Cabeza y cara. Nota la frente, los ojos y la mandíbula. Quédate aquí unos 30 segundos, o pasa a la siguiente cuando quieras."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la silla, voz breve',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Tus pies: lo que sientas."},{"titulo":"Las piernas","texto":"Tus piernas: lo que sientas."},{"titulo":"El abdomen","texto":"Tu abdomen: lo que sientas."},{"titulo":"El pecho","texto":"Tu pecho: lo que sientas."},{"titulo":"Los brazos y las manos","texto":"Tus brazos y manos: lo que sientas."},{"titulo":"La cabeza y la cara","texto":"Tu cabeza y tu cara: lo que sientas."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la cama, voz breve',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Tu cabeza y tu cara: lo que sientas."},{"titulo":"Los brazos y las manos","texto":"Tus brazos y manos: lo que sientas."},{"titulo":"El pecho","texto":"Tu pecho: lo que sientas."},{"titulo":"El abdomen","texto":"Tu abdomen: lo que sientas."},{"titulo":"Las piernas","texto":"Tus piernas: lo que sientas."},{"titulo":"Los pies","texto":"Tus pies: lo que sientas."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de arriba, de pie, voz breve',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Ponte de pie con los pies separados al ancho de la cadera. Si hoy se te hace difícil, siéntate: también vale. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de arriba. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"El pecho","texto":"Tu pecho: lo que sientas."},{"titulo":"Los brazos y las manos","texto":"Tus brazos y manos: lo que sientas."},{"titulo":"La cabeza y la cara","texto":"Tu cabeza y tu cara: lo que sientas."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de abajo a arriba, en la cama, voz breve',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, de abajo a arriba. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Tus pies: lo que sientas."},{"titulo":"Las piernas","texto":"Tus piernas: lo que sientas."},{"titulo":"El abdomen","texto":"Tu abdomen: lo que sientas."},{"titulo":"El pecho","texto":"Tu pecho: lo que sientas."},{"titulo":"Los brazos y las manos","texto":"Tus brazos y manos: lo que sientas."},{"titulo":"La cabeza y la cara","texto":"Tu cabeza y tu cara: lo que sientas."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo de arriba a abajo, en la silla, voz breve',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Siéntate con la espalda cómoda y los pies en el suelo. Vamos a recorrer el cuerpo con la atención, zona por zona, de arriba a abajo. No hay nada que cambiar. Dura unos 3 minutos.","avance":"manual","pasos":[{"titulo":"La cabeza y la cara","texto":"Tu cabeza y tu cara: lo que sientas."},{"titulo":"Los brazos y las manos","texto":"Tus brazos y manos: lo que sientas."},{"titulo":"El pecho","texto":"Tu pecho: lo que sientas."},{"titulo":"El abdomen","texto":"Tu abdomen: lo que sientas."},{"titulo":"Las piernas","texto":"Tus piernas: lo que sientas."},{"titulo":"Los pies","texto":"Tus pies: lo que sientas."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510206-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000206',
    'Escaneo solo la mitad de abajo, en la cama, voz breve',
    1,
    '{"modo":"pasos","advertenciaInicial":"Puedes saltarte una zona o parar cuando quieras. Si algo te incomoda, cambia a la respiración o cierra: no pasa nada.","intro":"Acuéstate boca arriba en un lugar cómodo, con los brazos a los lados. Vamos a recorrer el cuerpo con la atención, zona por zona, solo la mitad de abajo. No hay nada que cambiar. Dura unos 2 minutos.","avance":"manual","pasos":[{"titulo":"Los pies","texto":"Tus pies: lo que sientas."},{"titulo":"Las piernas","texto":"Tus piernas: lo que sientas."},{"titulo":"El abdomen","texto":"Tu abdomen: lo que sientas."}],"cierre":"Gracias por escucharte un rato.","avisoSiempre":"Puedes saltarte una zona o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-07 · Antes de dormir: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510207-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 1',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar el celular lejos de la cama"},{"clave":"g2","texto":"Poner música suave a poco volumen"},{"clave":"g3","texto":"Apagar las luces que no necesitas"},{"clave":"g4","texto":"Ventilar el cuarto"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 2',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Silenciar las notificaciones"},{"clave":"g2","texto":"Apagar el televisor"},{"clave":"g3","texto":"Decirle buenas noches a alguien de la casa"},{"clave":"g4","texto":"Estirar el cuello y los hombros con suavidad"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 3',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Ponerte la pijama"},{"clave":"g2","texto":"Tomar una ducha tibia"},{"clave":"g3","texto":"Cepillarte los dientes con calma"},{"clave":"g4","texto":"Pensar en algo agradable del día"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 4',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Lavarte las manos con calma"},{"clave":"g2","texto":"Dejar la ropa de mañana lista"},{"clave":"g3","texto":"Revisar que la casa esté cerrada"},{"clave":"g4","texto":"Dejar el cargador lejos de la cama"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 5',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Cerrar las pantallas"},{"clave":"g2","texto":"Anotar un pendiente de mañana en un papel"},{"clave":"g3","texto":"Dejar los zapatos en su lugar"},{"clave":"g4","texto":"Bajar la luz del cuarto"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 6',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Lavarte la cara con agua tibia"},{"clave":"g2","texto":"Respirar con calma tres veces"},{"clave":"g3","texto":"Acomodar la almohada"},{"clave":"g4","texto":"Ordenar lo que quedó en la mesa"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 7',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Cerrar las cortinas"},{"clave":"g2","texto":"Leer unas páginas"},{"clave":"g3","texto":"Dejar un vaso de agua cerca"},{"clave":"g4","texto":"Preparar la cobija que necesitas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 8',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar la alarma lista"},{"clave":"g2","texto":"Dejar el celular lejos de la cama"},{"clave":"g3","texto":"Poner música suave a poco volumen"},{"clave":"g4","texto":"Apagar las luces que no necesitas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 9',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar la mochila o el bolso listos"},{"clave":"g2","texto":"Silenciar las notificaciones"},{"clave":"g3","texto":"Apagar el televisor"},{"clave":"g4","texto":"Decirle buenas noches a alguien de la casa"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 10',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Ventilar el cuarto"},{"clave":"g2","texto":"Ponerte la pijama"},{"clave":"g3","texto":"Tomar una ducha tibia"},{"clave":"g4","texto":"Cepillarte los dientes con calma"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 11',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Estirar el cuello y los hombros con suavidad"},{"clave":"g2","texto":"Lavarte las manos con calma"},{"clave":"g3","texto":"Dejar la ropa de mañana lista"},{"clave":"g4","texto":"Revisar que la casa esté cerrada"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 12',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Pensar en algo agradable del día"},{"clave":"g2","texto":"Cerrar las pantallas"},{"clave":"g3","texto":"Anotar un pendiente de mañana en un papel"},{"clave":"g4","texto":"Dejar los zapatos en su lugar"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 13',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar el cargador lejos de la cama"},{"clave":"g2","texto":"Lavarte la cara con agua tibia"},{"clave":"g3","texto":"Respirar con calma tres veces"},{"clave":"g4","texto":"Acomodar la almohada"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 14',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Bajar la luz del cuarto"},{"clave":"g2","texto":"Cerrar las cortinas"},{"clave":"g3","texto":"Leer unas páginas"},{"clave":"g4","texto":"Dejar un vaso de agua cerca"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 15',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Ordenar lo que quedó en la mesa"},{"clave":"g2","texto":"Dejar la alarma lista"},{"clave":"g3","texto":"Dejar el celular lejos de la cama"},{"clave":"g4","texto":"Poner música suave a poco volumen"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 16',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Preparar la cobija que necesitas"},{"clave":"g2","texto":"Dejar la mochila o el bolso listos"},{"clave":"g3","texto":"Silenciar las notificaciones"},{"clave":"g4","texto":"Apagar el televisor"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 17',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Apagar las luces que no necesitas"},{"clave":"g2","texto":"Ventilar el cuarto"},{"clave":"g3","texto":"Ponerte la pijama"},{"clave":"g4","texto":"Tomar una ducha tibia"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 18',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Decirle buenas noches a alguien de la casa"},{"clave":"g2","texto":"Estirar el cuello y los hombros con suavidad"},{"clave":"g3","texto":"Lavarte las manos con calma"},{"clave":"g4","texto":"Dejar la ropa de mañana lista"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 19',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Cepillarte los dientes con calma"},{"clave":"g2","texto":"Pensar en algo agradable del día"},{"clave":"g3","texto":"Cerrar las pantallas"},{"clave":"g4","texto":"Anotar un pendiente de mañana en un papel"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 20',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Revisar que la casa esté cerrada"},{"clave":"g2","texto":"Dejar el cargador lejos de la cama"},{"clave":"g3","texto":"Lavarte la cara con agua tibia"},{"clave":"g4","texto":"Respirar con calma tres veces"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 21',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar los zapatos en su lugar"},{"clave":"g2","texto":"Bajar la luz del cuarto"},{"clave":"g3","texto":"Cerrar las cortinas"},{"clave":"g4","texto":"Leer unas páginas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 22',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Acomodar la almohada"},{"clave":"g2","texto":"Ordenar lo que quedó en la mesa"},{"clave":"g3","texto":"Dejar la alarma lista"},{"clave":"g4","texto":"Dejar el celular lejos de la cama"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 23',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar un vaso de agua cerca"},{"clave":"g2","texto":"Preparar la cobija que necesitas"},{"clave":"g3","texto":"Dejar la mochila o el bolso listos"},{"clave":"g4","texto":"Silenciar las notificaciones"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 24',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Poner música suave a poco volumen"},{"clave":"g2","texto":"Apagar las luces que no necesitas"},{"clave":"g3","texto":"Ventilar el cuarto"},{"clave":"g4","texto":"Ponerte la pijama"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 25',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Apagar el televisor"},{"clave":"g2","texto":"Decirle buenas noches a alguien de la casa"},{"clave":"g3","texto":"Estirar el cuello y los hombros con suavidad"},{"clave":"g4","texto":"Lavarte las manos con calma"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 26',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Tomar una ducha tibia"},{"clave":"g2","texto":"Cepillarte los dientes con calma"},{"clave":"g3","texto":"Pensar en algo agradable del día"},{"clave":"g4","texto":"Cerrar las pantallas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 27',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar la ropa de mañana lista"},{"clave":"g2","texto":"Revisar que la casa esté cerrada"},{"clave":"g3","texto":"Dejar el cargador lejos de la cama"},{"clave":"g4","texto":"Lavarte la cara con agua tibia"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 28',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Anotar un pendiente de mañana en un papel"},{"clave":"g2","texto":"Dejar los zapatos en su lugar"},{"clave":"g3","texto":"Bajar la luz del cuarto"},{"clave":"g4","texto":"Cerrar las cortinas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 29',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Respirar con calma tres veces"},{"clave":"g2","texto":"Acomodar la almohada"},{"clave":"g3","texto":"Ordenar lo que quedó en la mesa"},{"clave":"g4","texto":"Dejar la alarma lista"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 30',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Leer unas páginas"},{"clave":"g2","texto":"Dejar un vaso de agua cerca"},{"clave":"g3","texto":"Preparar la cobija que necesitas"},{"clave":"g4","texto":"Dejar la mochila o el bolso listos"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 31',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar el celular lejos de la cama"},{"clave":"g2","texto":"Revisar que la casa esté cerrada"},{"clave":"g3","texto":"Dejar la mochila o el bolso listos"},{"clave":"g4","texto":"Anotar un pendiente de mañana en un papel"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 32',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Silenciar las notificaciones"},{"clave":"g2","texto":"Dejar los zapatos en su lugar"},{"clave":"g3","texto":"Ventilar el cuarto"},{"clave":"g4","texto":"Respirar con calma tres veces"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 33',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Ponerte la pijama"},{"clave":"g2","texto":"Acomodar la almohada"},{"clave":"g3","texto":"Estirar el cuello y los hombros con suavidad"},{"clave":"g4","texto":"Leer unas páginas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 34',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Lavarte las manos con calma"},{"clave":"g2","texto":"Dejar un vaso de agua cerca"},{"clave":"g3","texto":"Pensar en algo agradable del día"},{"clave":"g4","texto":"Dejar el celular lejos de la cama"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 35',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Cerrar las pantallas"},{"clave":"g2","texto":"Poner música suave a poco volumen"},{"clave":"g3","texto":"Dejar el cargador lejos de la cama"},{"clave":"g4","texto":"Silenciar las notificaciones"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 36',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Lavarte la cara con agua tibia"},{"clave":"g2","texto":"Apagar el televisor"},{"clave":"g3","texto":"Bajar la luz del cuarto"},{"clave":"g4","texto":"Ponerte la pijama"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 37',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Cerrar las cortinas"},{"clave":"g2","texto":"Tomar una ducha tibia"},{"clave":"g3","texto":"Ordenar lo que quedó en la mesa"},{"clave":"g4","texto":"Lavarte las manos con calma"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 38',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar la alarma lista"},{"clave":"g2","texto":"Dejar la ropa de mañana lista"},{"clave":"g3","texto":"Preparar la cobija que necesitas"},{"clave":"g4","texto":"Cerrar las pantallas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 39',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Dejar la mochila o el bolso listos"},{"clave":"g2","texto":"Anotar un pendiente de mañana en un papel"},{"clave":"g3","texto":"Apagar las luces que no necesitas"},{"clave":"g4","texto":"Lavarte la cara con agua tibia"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510207-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000207',
    'Antes de dormir, 40',
    1,
    '{"modo":"lista","indicacion":"Marca los gestos que hiciste o que harás esta noche. Si no marcas ninguno, también está bien.","items":[{"clave":"g1","texto":"Ventilar el cuarto"},{"clave":"g2","texto":"Respirar con calma tres veces"},{"clave":"g3","texto":"Decirle buenas noches a alguien de la casa"},{"clave":"g4","texto":"Cerrar las cortinas"}],"cierre":"Que descanses. Esto ya quedó."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-08 · El descanso de mañana: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510208-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 1, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cuánto rato antes de acostarte quieres bajar el ritmo?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Unos 15 minutos"},{"clave":"o2","texto":"Media hora"},{"clave":"o3","texto":"Una hora"},{"clave":"o4","texto":"Lo decido esta noche"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 1, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cuánto rato antes de acostarte quieres bajar el ritmo?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Unos 15 minutos"},{"clave":"o2","texto":"Media hora"},{"clave":"o3","texto":"Una hora"},{"clave":"o4","texto":"Lo decido esta noche"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 1, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cuánto rato antes de acostarte quieres bajar el ritmo?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Unos 15 minutos"},{"clave":"o2","texto":"Media hora"},{"clave":"o3","texto":"Una hora"},{"clave":"o4","texto":"Lo decido esta noche"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 1, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cuánto rato antes de acostarte quieres bajar el ritmo?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Unos 15 minutos"},{"clave":"o2","texto":"Media hora"},{"clave":"o3","texto":"Una hora"},{"clave":"o4","texto":"Lo decido esta noche"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 1, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cuánto rato antes de acostarte quieres bajar el ritmo?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Unos 15 minutos"},{"clave":"o2","texto":"Media hora"},{"clave":"o3","texto":"Una hora"},{"clave":"o4","texto":"Lo decido esta noche"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 2, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Dónde dejarás el celular esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Lejos de la cama"},{"clave":"o2","texto":"En otro cuarto"},{"clave":"o3","texto":"Con el sonido bajo"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 2, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Dónde dejarás el celular esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Lejos de la cama"},{"clave":"o2","texto":"En otro cuarto"},{"clave":"o3","texto":"Con el sonido bajo"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 2, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Dónde dejarás el celular esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Lejos de la cama"},{"clave":"o2","texto":"En otro cuarto"},{"clave":"o3","texto":"Con el sonido bajo"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 2, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Dónde dejarás el celular esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Lejos de la cama"},{"clave":"o2","texto":"En otro cuarto"},{"clave":"o3","texto":"Con el sonido bajo"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 2, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Dónde dejarás el celular esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Lejos de la cama"},{"clave":"o2","texto":"En otro cuarto"},{"clave":"o3","texto":"Con el sonido bajo"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 3, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría dejar listo para mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La ropa"},{"clave":"o2","texto":"La mochila o el bolso"},{"clave":"o3","texto":"El desayuno"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 3, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría dejar listo para mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La ropa"},{"clave":"o2","texto":"La mochila o el bolso"},{"clave":"o3","texto":"El desayuno"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 3, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría dejar listo para mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La ropa"},{"clave":"o2","texto":"La mochila o el bolso"},{"clave":"o3","texto":"El desayuno"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 3, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría dejar listo para mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La ropa"},{"clave":"o2","texto":"La mochila o el bolso"},{"clave":"o3","texto":"El desayuno"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 3, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría dejar listo para mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La ropa"},{"clave":"o2","texto":"La mochila o el bolso"},{"clave":"o3","texto":"El desayuno"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 4, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría cerrar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con música suave"},{"clave":"o2","texto":"Leyendo un rato"},{"clave":"o3","texto":"En silencio"},{"clave":"o4","texto":"Hablando con alguien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 4, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría cerrar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con música suave"},{"clave":"o2","texto":"Leyendo un rato"},{"clave":"o3","texto":"En silencio"},{"clave":"o4","texto":"Hablando con alguien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 4, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría cerrar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con música suave"},{"clave":"o2","texto":"Leyendo un rato"},{"clave":"o3","texto":"En silencio"},{"clave":"o4","texto":"Hablando con alguien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 4, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría cerrar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con música suave"},{"clave":"o2","texto":"Leyendo un rato"},{"clave":"o3","texto":"En silencio"},{"clave":"o4","texto":"Hablando con alguien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 4, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría cerrar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con música suave"},{"clave":"o2","texto":"Leyendo un rato"},{"clave":"o3","texto":"En silencio"},{"clave":"o4","texto":"Hablando con alguien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 5, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te ayudaría a soltar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Anotar pendientes"},{"clave":"o2","texto":"Una ducha tibia"},{"clave":"o3","texto":"Estirarme"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 5, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te ayudaría a soltar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Anotar pendientes"},{"clave":"o2","texto":"Una ducha tibia"},{"clave":"o3","texto":"Estirarme"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 5, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te ayudaría a soltar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Anotar pendientes"},{"clave":"o2","texto":"Una ducha tibia"},{"clave":"o3","texto":"Estirarme"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 5, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te ayudaría a soltar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Anotar pendientes"},{"clave":"o2","texto":"Una ducha tibia"},{"clave":"o3","texto":"Estirarme"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 5, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te ayudaría a soltar el día?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Anotar pendientes"},{"clave":"o2","texto":"Una ducha tibia"},{"clave":"o3","texto":"Estirarme"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 6, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría despertar mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con una alarma suave"},{"clave":"o2","texto":"Con la luz de la ventana"},{"clave":"o3","texto":"Con calma, sin prisa"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 6, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría despertar mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con una alarma suave"},{"clave":"o2","texto":"Con la luz de la ventana"},{"clave":"o3","texto":"Con calma, sin prisa"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 6, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría despertar mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con una alarma suave"},{"clave":"o2","texto":"Con la luz de la ventana"},{"clave":"o3","texto":"Con calma, sin prisa"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 6, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría despertar mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con una alarma suave"},{"clave":"o2","texto":"Con la luz de la ventana"},{"clave":"o3","texto":"Con calma, sin prisa"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 6, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Cómo te gustaría despertar mañana?","tipo":"opcion","opciones":[{"clave":"o1","texto":"Con una alarma suave"},{"clave":"o2","texto":"Con la luz de la ventana"},{"clave":"o3","texto":"Con calma, sin prisa"},{"clave":"o4","texto":"Aún no lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 7, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué parte de la noche te gustaría cuidar más?","tipo":"opcion","opciones":[{"clave":"o1","texto":"El rato antes de acostarme"},{"clave":"o2","texto":"El momento de dormirme"},{"clave":"o3","texto":"Lo que pase de madrugada"},{"clave":"o4","texto":"No lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 7, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué parte de la noche te gustaría cuidar más?","tipo":"opcion","opciones":[{"clave":"o1","texto":"El rato antes de acostarme"},{"clave":"o2","texto":"El momento de dormirme"},{"clave":"o3","texto":"Lo que pase de madrugada"},{"clave":"o4","texto":"No lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 7, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué parte de la noche te gustaría cuidar más?","tipo":"opcion","opciones":[{"clave":"o1","texto":"El rato antes de acostarme"},{"clave":"o2","texto":"El momento de dormirme"},{"clave":"o3","texto":"Lo que pase de madrugada"},{"clave":"o4","texto":"No lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 7, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué parte de la noche te gustaría cuidar más?","tipo":"opcion","opciones":[{"clave":"o1","texto":"El rato antes de acostarme"},{"clave":"o2","texto":"El momento de dormirme"},{"clave":"o3","texto":"Lo que pase de madrugada"},{"clave":"o4","texto":"No lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 7, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué parte de la noche te gustaría cuidar más?","tipo":"opcion","opciones":[{"clave":"o1","texto":"El rato antes de acostarme"},{"clave":"o2","texto":"El momento de dormirme"},{"clave":"o3","texto":"Lo que pase de madrugada"},{"clave":"o4","texto":"No lo sé"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 8, gesto 1: Dejar la ropa lista',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría que fuera distinto esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La hora de dormir"},{"clave":"o2","texto":"El ruido o la luz"},{"clave":"o3","texto":"Lo que hago antes de acostarme"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar la ropa lista. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 8, gesto 2: Poner una alarma de aviso para empezar a bajar el ritmo',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría que fuera distinto esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La hora de dormir"},{"clave":"o2","texto":"El ruido o la luz"},{"clave":"o3","texto":"Lo que hago antes de acostarme"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: poner una alarma de aviso para empezar a bajar el ritmo. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 8, gesto 3: Bajar la luz del cuarto',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría que fuera distinto esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La hora de dormir"},{"clave":"o2","texto":"El ruido o la luz"},{"clave":"o3","texto":"Lo que hago antes de acostarme"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: bajar la luz del cuarto. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 8, gesto 4: Dejar el cuarto ordenado',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría que fuera distinto esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La hora de dormir"},{"clave":"o2","texto":"El ruido o la luz"},{"clave":"o3","texto":"Lo que hago antes de acostarme"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: dejar el cuarto ordenado. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510208-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000208',
    'Plan 8, gesto 5: Anotar un pendiente en un papel',
    1,
    '{"modo":"preguntas","indicacion":"Sin respuestas buenas ni malas: es solo para planear la noche.","preguntas":[{"clave":"hora","texto":"¿A qué hora piensas acostarte?","tipo":"hora"},{"clave":"plan","texto":"¿Qué te gustaría que fuera distinto esta noche?","tipo":"opcion","opciones":[{"clave":"o1","texto":"La hora de dormir"},{"clave":"o2","texto":"El ruido o la luz"},{"clave":"o3","texto":"Lo que hago antes de acostarme"},{"clave":"o4","texto":"Nada, así está bien"}]},{"clave":"apoyo","texto":"Un gesto de apoyo: anotar un pendiente en un papel. ¿Te sirve para esta noche?","tipo":"opcion","opciones":[{"clave":"si","texto":"Sí, lo haré"},{"clave":"quiza","texto":"Quizá"},{"clave":"hoy-no","texto":"Hoy no"}]}],"enlaceAlAviso":true,"cierre":"Plan hecho. Mañana lo cuentas."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-09 · Un respiro en medio del día: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510209-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 1: Mirar lejos, Mirar por la ventana, Oler algo agradable',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"mirar-lejos","nombre":"Mirar lejos","descripcion":"Descansar la vista mirando hacia lo lejano.","pasos":[{"texto":"Levanta la vista de lo que estás haciendo."},{"texto":"Mira hacia lo más lejos que veas, por una ventana o al fondo del cuarto."},{"texto":"Quédate ahí unos segundos y vuelve a lo tuyo."}]},{"clave":"mirar-por-la-ventana","nombre":"Mirar por la ventana","descripcion":"Seguir algo que se mueva.","pasos":[{"texto":"Mira por la ventana, si hay una cerca."},{"texto":"Fíjate en algo que se mueva: una nube, una hoja, un carro."},{"texto":"Sigue con la mirada unos segundos."}]},{"clave":"oler-algo-agradable","nombre":"Oler algo agradable","descripcion":"Café, una fruta, un jabón.","pasos":[{"texto":"Busca algo que huela rico: café, una fruta, un jabón."},{"texto":"Acércalo y respira."},{"texto":"Nota qué te recuerda."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 2: Soltar los hombros, Beber algo despacio, Ver tres cosas',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"soltar-los-hombros","nombre":"Soltar los hombros","descripcion":"Subirlos y soltarlos, tres veces.","pasos":[{"texto":"Sube los hombros hacia las orejas al inhalar."},{"texto":"Suéltalos al exhalar, despacio."},{"texto":"Repite una vez más y nota cómo quedan."}]},{"clave":"beber-algo-despacio","nombre":"Beber algo despacio","descripcion":"Una bebida, en sorbos pequeños.","pasos":[{"texto":"Alcanza una bebida que te guste."},{"texto":"Tómala en sorbos pequeños."},{"texto":"Nota el calor o el frío en las manos."}]},{"clave":"ver-tres-cosas","nombre":"Ver tres cosas","descripcion":"Nombrarlas en voz baja.","pasos":[{"texto":"Mira a tu alrededor."},{"texto":"Nombra en voz baja tres cosas que ves."},{"texto":"Respira y sigue."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 3: Un vaso de agua, Calentar las manos, Aflojar la mandíbula',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"un-vaso-de-agua","nombre":"Un vaso de agua","descripcion":"Unos sorbos de agua, con atención.","pasos":[{"texto":"Alcanza tu vaso o tu botella de agua."},{"texto":"Toma unos sorbos despacio."},{"texto":"Nota la temperatura y el sabor del agua."}]},{"clave":"calentar-las-manos","nombre":"Calentar las manos","descripcion":"Frotarlas hasta que estén tibias.","pasos":[{"texto":"Frota las palmas entre sí hasta calentarlas."},{"texto":"Presiona suave el centro de cada palma."},{"texto":"Apóyalas sobre las piernas."}]},{"clave":"aflojar-la-mandibula","nombre":"Aflojar la mandíbula","descripcion":"Dientes separados y lengua suelta.","pasos":[{"texto":"Nota cómo está tu mandíbula."},{"texto":"Separa un poco los dientes y suelta la lengua."},{"texto":"Respira con calma."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 4: Abrir la ventana, Mover los dedos de los pies, Moverte en la silla',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"abrir-la-ventana","nombre":"Abrir la ventana","descripcion":"Un poco de aire de afuera.","pasos":[{"texto":"Si hay una ventana cerca, ábrela un poco; si no puedes, mírala."},{"texto":"Respira el aire de afuera un par de veces."},{"texto":"Escucha un sonido de afuera."}]},{"clave":"mover-los-dedos-de-l","nombre":"Mover los dedos de los pies","descripcion":"Dentro de los zapatos o sin ellos.","pasos":[{"texto":"Mueve los dedos de los pies, dentro de los zapatos o sin ellos."},{"texto":"Ábrelos y ciérralos, despacio."},{"texto":"Nota cómo se sienten tus pies."}]},{"clave":"moverte-en-la-silla","nombre":"Moverte en la silla","descripcion":"Mover hombros y espalda, y acomodarte.","pasos":[{"texto":"Mueve un poco los hombros y la espalda."},{"texto":"Cambia de posición con calma."},{"texto":"Vuelve a una posición cómoda."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 5: Tres respiraciones, Alargar el cuello, Mirar el cielo',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"tres-respiraciones","nombre":"Tres respiraciones","descripcion":"Respirar con calma, tres veces.","pasos":[{"texto":"Apoya la espalda en la silla."},{"texto":"Respira con calma tres veces, a tu ritmo."},{"texto":"Vuelve a lo tuyo cuando quieras."}]},{"clave":"alargar-el-cuello","nombre":"Alargar el cuello","descripcion":"Espalda larga y hombros sueltos.","pasos":[{"texto":"Siéntate con la espalda larga."},{"texto":"Imagina un hilo que te estira desde la coronilla."},{"texto":"Deja los hombros sueltos."}]},{"clave":"mirar-el-cielo","nombre":"Mirar el cielo","descripcion":"Por una ventana, si hay una cerca.","pasos":[{"texto":"Si hay una ventana, mira hacia el cielo."},{"texto":"Fíjate en el color y en las nubes."},{"texto":"Quédate un momento mirándolo."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 6: Estirar las manos, Contar hacia atrás, Un recuerdo bonito',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"estirar-las-manos","nombre":"Estirar las manos","descripcion":"Abrir, cerrar y sacudir las manos.","pasos":[{"texto":"Abre las manos bien y ciérralas despacio."},{"texto":"Sacúdelas con suavidad unos segundos."},{"texto":"Apóyalas sobre las piernas y nota cómo se sienten."}]},{"clave":"contar-hacia-atras","nombre":"Contar hacia atrás","descripcion":"De cinco a uno, soltando el aire.","pasos":[{"texto":"Cuenta despacio de cinco a uno."},{"texto":"En cada número, suelta un poco el aire."},{"texto":"Al llegar a uno, mira a tu alrededor."}]},{"clave":"un-recuerdo-bonito","nombre":"Un recuerdo bonito","descripcion":"Un lugar donde estuviste a gusto.","pasos":[{"texto":"Recuerda un lugar donde estuviste a gusto."},{"texto":"Mira por dentro un detalle: un color, un olor, un sonido."},{"texto":"Vuelve cuando quieras."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 7: Cerrar los ojos, Parpadear, Las manos en el pecho',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"cerrar-los-ojos","nombre":"Cerrar los ojos","descripcion":"Un momento con los ojos cerrados.","pasos":[{"texto":"Si puedes, cierra los ojos un momento."},{"texto":"Deja que la cara se afloje."},{"texto":"Ábrelos con calma cuando quieras."}]},{"clave":"parpadear","nombre":"Parpadear","descripcion":"Parpadear suave y cerrar un momento.","pasos":[{"texto":"Parpadea suave y seguido unos segundos."},{"texto":"Cierra los ojos un momento."},{"texto":"Ábrelos y mira hacia lejos."}]},{"clave":"las-manos-en-el-pech","nombre":"Las manos en el pecho","descripcion":"Sentir cómo suben y bajan al respirar.","pasos":[{"texto":"Apoya una mano en el pecho y otra en el abdomen."},{"texto":"Nota cómo suben y bajan con cada respiración."},{"texto":"Respira como siempre."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 8: Mirar un color, Mirar algo lejano, Estirar una pierna',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"mirar-un-color","nombre":"Mirar un color","descripcion":"Buscar un color a tu alrededor.","pasos":[{"texto":"Busca un color a tu alrededor."},{"texto":"Mira todas las cosas que tengan ese color."},{"texto":"Quédate un momento con lo que viste."}]},{"clave":"mirar-algo-lejano","nombre":"Mirar algo lejano","descripcion":"Elegir un punto y mantener la mirada.","pasos":[{"texto":"Elige un punto lejano."},{"texto":"Mantén la mirada ahí unos segundos."},{"texto":"Vuelve a mirar de cerca, con calma."}]},{"clave":"estirar-una-pierna","nombre":"Estirar una pierna","descripcion":"Con el talón en el suelo, y luego la otra.","pasos":[{"texto":"Estira una pierna al frente, con el talón en el suelo."},{"texto":"Cambia de pierna."},{"texto":"Vuelve a apoyar los pies."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 9: Escuchar los sonidos, Una canción por dentro, Mirar un objeto con atención',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"escuchar-los-sonidos","nombre":"Escuchar los sonidos","descripcion":"Los cercanos y los lejanos.","pasos":[{"texto":"Deja lo que haces un momento."},{"texto":"Escucha los sonidos cercanos y los lejanos."},{"texto":"Quédate con el que más te guste."}]},{"clave":"una-cancion-por-dent","nombre":"Una canción por dentro","descripcion":"Recordar una canción que te guste.","pasos":[{"texto":"Recuerda una canción que te guste."},{"texto":"Escúchala por dentro un momento."},{"texto":"Vuelve cuando termine."}]},{"clave":"mirar-un-objeto-con","nombre":"Mirar un objeto con atención","descripcion":"Su forma, su color y su textura.","pasos":[{"texto":"Elige un objeto cerca de ti."},{"texto":"Mira su forma, su color y su textura."},{"texto":"Descríbelo en tu cabeza con tres palabras."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 10: Apoyar los pies, Estirar los brazos, Apoyar la espalda',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"apoyar-los-pies","nombre":"Apoyar los pies","descripcion":"Sentir el contacto con el suelo.","pasos":[{"texto":"Apoya los dos pies en el suelo."},{"texto":"Nota el contacto y el peso de tus piernas."},{"texto":"Respira una vez con calma."}]},{"clave":"estirar-los-brazos","nombre":"Estirar los brazos","descripcion":"Hacia el frente y hacia arriba.","pasos":[{"texto":"Estira los brazos al frente, sin tensar."},{"texto":"Llévalos hacia arriba si hay espacio, y bájalos."},{"texto":"Respira con calma."}]},{"clave":"apoyar-la-espalda","nombre":"Apoyar la espalda","descripcion":"Dejar los brazos sueltos.","pasos":[{"texto":"Apoya la espalda contra el respaldo."},{"texto":"Deja los brazos sueltos."},{"texto":"Respira con calma dos veces."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 11: Sentir la silla, Sentir las manos, Escuchar tu respiración',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"sentir-la-silla","nombre":"Sentir la silla","descripcion":"Notar cómo te sostiene.","pasos":[{"texto":"Nota cómo te sostiene la silla."},{"texto":"Deja que tu espalda se apoye un poco más."},{"texto":"Respira con calma y sigue."}]},{"clave":"sentir-las-manos","nombre":"Sentir las manos","descripcion":"Su peso y su temperatura.","pasos":[{"texto":"Apoya las manos sobre las piernas."},{"texto":"Nota su peso y su temperatura."},{"texto":"Respira una vez con calma."}]},{"clave":"escuchar-tu-respirac","nombre":"Escuchar tu respiración","descripcion":"Sin cambiarla.","pasos":[{"texto":"Fíjate en tu respiración, sin cambiarla."},{"texto":"Nota dónde la sientes más: nariz, pecho o abdomen."},{"texto":"Sigue unos segundos."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 12: Algo que te guste, Un pensamiento amable, Círculos con los hombros',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"algo-que-te-guste","nombre":"Algo que te guste","descripcion":"Pensar en algo pequeño y bueno.","pasos":[{"texto":"Piensa en algo que te guste, aunque sea pequeño."},{"texto":"Deja que la cara se suavice, con o sin sonrisa."},{"texto":"Vuelve a lo tuyo con eso en mente."}]},{"clave":"un-pensamiento-amabl","nombre":"Un pensamiento amable","descripcion":"Pensar en alguien que te cae bien.","pasos":[{"texto":"Piensa en alguien que te cae bien."},{"texto":"Imagina qué te diría hoy."},{"texto":"Quédate con esa idea un momento."}]},{"clave":"circulos-con-los-hom","nombre":"Círculos con los hombros","descripcion":"Pequeños y hacia atrás.","pasos":[{"texto":"Dibuja círculos pequeños con los hombros."},{"texto":"Cinco hacia atrás, despacio."},{"texto":"Nota cómo quedan."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 13: Un rincón ordenado, Dejar de hacer, Algo que salió bien',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"un-rincon-ordenado","nombre":"Un rincón ordenado","descripcion":"Ordenar una sola cosa.","pasos":[{"texto":"Elige una sola cosa de tu espacio."},{"texto":"Colócala en su lugar."},{"texto":"Mira el resultado un momento."}]},{"clave":"dejar-de-hacer","nombre":"Dejar de hacer","descripcion":"Manos quietas, un momento.","pasos":[{"texto":"Deja las manos quietas, sin hacer nada."},{"texto":"Respira con calma un momento."},{"texto":"Retoma cuando quieras."}]},{"clave":"algo-que-salio-bien","nombre":"Algo que salió bien","descripcion":"Recordar una cosa pequeña de hoy.","pasos":[{"texto":"Piensa en algo que hoy salió bien, aunque sea pequeño."},{"texto":"Recuerda cómo fue."},{"texto":"Quédate con eso un momento."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 14: Mirar por la ventana, Oler algo agradable, Descansar los ojos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"mirar-por-la-ventana","nombre":"Mirar por la ventana","descripcion":"Seguir algo que se mueva.","pasos":[{"texto":"Mira por la ventana, si hay una cerca."},{"texto":"Fíjate en algo que se mueva: una nube, una hoja, un carro."},{"texto":"Sigue con la mirada unos segundos."}]},{"clave":"oler-algo-agradable","nombre":"Oler algo agradable","descripcion":"Café, una fruta, un jabón.","pasos":[{"texto":"Busca algo que huela rico: café, una fruta, un jabón."},{"texto":"Acércalo y respira."},{"texto":"Nota qué te recuerda."}]},{"clave":"descansar-los-ojos","nombre":"Descansar los ojos","descripcion":"Con las manos tibias encima.","pasos":[{"texto":"Frota las manos para calentarlas."},{"texto":"Apóyalas sobre los ojos cerrados, sin presionar."},{"texto":"Quédate unos segundos y ábrelos."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 15: Beber algo despacio, Ver tres cosas, Mirar lejos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"beber-algo-despacio","nombre":"Beber algo despacio","descripcion":"Una bebida, en sorbos pequeños.","pasos":[{"texto":"Alcanza una bebida que te guste."},{"texto":"Tómala en sorbos pequeños."},{"texto":"Nota el calor o el frío en las manos."}]},{"clave":"ver-tres-cosas","nombre":"Ver tres cosas","descripcion":"Nombrarlas en voz baja.","pasos":[{"texto":"Mira a tu alrededor."},{"texto":"Nombra en voz baja tres cosas que ves."},{"texto":"Respira y sigue."}]},{"clave":"mirar-lejos","nombre":"Mirar lejos","descripcion":"Descansar la vista mirando hacia lo lejano.","pasos":[{"texto":"Levanta la vista de lo que estás haciendo."},{"texto":"Mira hacia lo más lejos que veas, por una ventana o al fondo del cuarto."},{"texto":"Quédate ahí unos segundos y vuelve a lo tuyo."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 16: Calentar las manos, Aflojar la mandíbula, Soltar los hombros',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"calentar-las-manos","nombre":"Calentar las manos","descripcion":"Frotarlas hasta que estén tibias.","pasos":[{"texto":"Frota las palmas entre sí hasta calentarlas."},{"texto":"Presiona suave el centro de cada palma."},{"texto":"Apóyalas sobre las piernas."}]},{"clave":"aflojar-la-mandibula","nombre":"Aflojar la mandíbula","descripcion":"Dientes separados y lengua suelta.","pasos":[{"texto":"Nota cómo está tu mandíbula."},{"texto":"Separa un poco los dientes y suelta la lengua."},{"texto":"Respira con calma."}]},{"clave":"soltar-los-hombros","nombre":"Soltar los hombros","descripcion":"Subirlos y soltarlos, tres veces.","pasos":[{"texto":"Sube los hombros hacia las orejas al inhalar."},{"texto":"Suéltalos al exhalar, despacio."},{"texto":"Repite una vez más y nota cómo quedan."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 17: Mover los dedos de los pies, Moverte en la silla, Un vaso de agua',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"mover-los-dedos-de-l","nombre":"Mover los dedos de los pies","descripcion":"Dentro de los zapatos o sin ellos.","pasos":[{"texto":"Mueve los dedos de los pies, dentro de los zapatos o sin ellos."},{"texto":"Ábrelos y ciérralos, despacio."},{"texto":"Nota cómo se sienten tus pies."}]},{"clave":"moverte-en-la-silla","nombre":"Moverte en la silla","descripcion":"Mover hombros y espalda, y acomodarte.","pasos":[{"texto":"Mueve un poco los hombros y la espalda."},{"texto":"Cambia de posición con calma."},{"texto":"Vuelve a una posición cómoda."}]},{"clave":"un-vaso-de-agua","nombre":"Un vaso de agua","descripcion":"Unos sorbos de agua, con atención.","pasos":[{"texto":"Alcanza tu vaso o tu botella de agua."},{"texto":"Toma unos sorbos despacio."},{"texto":"Nota la temperatura y el sabor del agua."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 18: Alargar el cuello, Mirar el cielo, Abrir la ventana',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"alargar-el-cuello","nombre":"Alargar el cuello","descripcion":"Espalda larga y hombros sueltos.","pasos":[{"texto":"Siéntate con la espalda larga."},{"texto":"Imagina un hilo que te estira desde la coronilla."},{"texto":"Deja los hombros sueltos."}]},{"clave":"mirar-el-cielo","nombre":"Mirar el cielo","descripcion":"Por una ventana, si hay una cerca.","pasos":[{"texto":"Si hay una ventana, mira hacia el cielo."},{"texto":"Fíjate en el color y en las nubes."},{"texto":"Quédate un momento mirándolo."}]},{"clave":"abrir-la-ventana","nombre":"Abrir la ventana","descripcion":"Un poco de aire de afuera.","pasos":[{"texto":"Si hay una ventana cerca, ábrela un poco; si no puedes, mírala."},{"texto":"Respira el aire de afuera un par de veces."},{"texto":"Escucha un sonido de afuera."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 19: Contar hacia atrás, Un recuerdo bonito, Tres respiraciones',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"contar-hacia-atras","nombre":"Contar hacia atrás","descripcion":"De cinco a uno, soltando el aire.","pasos":[{"texto":"Cuenta despacio de cinco a uno."},{"texto":"En cada número, suelta un poco el aire."},{"texto":"Al llegar a uno, mira a tu alrededor."}]},{"clave":"un-recuerdo-bonito","nombre":"Un recuerdo bonito","descripcion":"Un lugar donde estuviste a gusto.","pasos":[{"texto":"Recuerda un lugar donde estuviste a gusto."},{"texto":"Mira por dentro un detalle: un color, un olor, un sonido."},{"texto":"Vuelve cuando quieras."}]},{"clave":"tres-respiraciones","nombre":"Tres respiraciones","descripcion":"Respirar con calma, tres veces.","pasos":[{"texto":"Apoya la espalda en la silla."},{"texto":"Respira con calma tres veces, a tu ritmo."},{"texto":"Vuelve a lo tuyo cuando quieras."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 20: Parpadear, Las manos en el pecho, Estirar las manos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"parpadear","nombre":"Parpadear","descripcion":"Parpadear suave y cerrar un momento.","pasos":[{"texto":"Parpadea suave y seguido unos segundos."},{"texto":"Cierra los ojos un momento."},{"texto":"Ábrelos y mira hacia lejos."}]},{"clave":"las-manos-en-el-pech","nombre":"Las manos en el pecho","descripcion":"Sentir cómo suben y bajan al respirar.","pasos":[{"texto":"Apoya una mano en el pecho y otra en el abdomen."},{"texto":"Nota cómo suben y bajan con cada respiración."},{"texto":"Respira como siempre."}]},{"clave":"estirar-las-manos","nombre":"Estirar las manos","descripcion":"Abrir, cerrar y sacudir las manos.","pasos":[{"texto":"Abre las manos bien y ciérralas despacio."},{"texto":"Sacúdelas con suavidad unos segundos."},{"texto":"Apóyalas sobre las piernas y nota cómo se sienten."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 21: Mirar algo lejano, Estirar una pierna, Cerrar los ojos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"mirar-algo-lejano","nombre":"Mirar algo lejano","descripcion":"Elegir un punto y mantener la mirada.","pasos":[{"texto":"Elige un punto lejano."},{"texto":"Mantén la mirada ahí unos segundos."},{"texto":"Vuelve a mirar de cerca, con calma."}]},{"clave":"estirar-una-pierna","nombre":"Estirar una pierna","descripcion":"Con el talón en el suelo, y luego la otra.","pasos":[{"texto":"Estira una pierna al frente, con el talón en el suelo."},{"texto":"Cambia de pierna."},{"texto":"Vuelve a apoyar los pies."}]},{"clave":"cerrar-los-ojos","nombre":"Cerrar los ojos","descripcion":"Un momento con los ojos cerrados.","pasos":[{"texto":"Si puedes, cierra los ojos un momento."},{"texto":"Deja que la cara se afloje."},{"texto":"Ábrelos con calma cuando quieras."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 22: Una canción por dentro, Mirar un objeto con atención, Mirar un color',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"una-cancion-por-dent","nombre":"Una canción por dentro","descripcion":"Recordar una canción que te guste.","pasos":[{"texto":"Recuerda una canción que te guste."},{"texto":"Escúchala por dentro un momento."},{"texto":"Vuelve cuando termine."}]},{"clave":"mirar-un-objeto-con","nombre":"Mirar un objeto con atención","descripcion":"Su forma, su color y su textura.","pasos":[{"texto":"Elige un objeto cerca de ti."},{"texto":"Mira su forma, su color y su textura."},{"texto":"Descríbelo en tu cabeza con tres palabras."}]},{"clave":"mirar-un-color","nombre":"Mirar un color","descripcion":"Buscar un color a tu alrededor.","pasos":[{"texto":"Busca un color a tu alrededor."},{"texto":"Mira todas las cosas que tengan ese color."},{"texto":"Quédate un momento con lo que viste."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 23: Estirar los brazos, Apoyar la espalda, Escuchar los sonidos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"estirar-los-brazos","nombre":"Estirar los brazos","descripcion":"Hacia el frente y hacia arriba.","pasos":[{"texto":"Estira los brazos al frente, sin tensar."},{"texto":"Llévalos hacia arriba si hay espacio, y bájalos."},{"texto":"Respira con calma."}]},{"clave":"apoyar-la-espalda","nombre":"Apoyar la espalda","descripcion":"Dejar los brazos sueltos.","pasos":[{"texto":"Apoya la espalda contra el respaldo."},{"texto":"Deja los brazos sueltos."},{"texto":"Respira con calma dos veces."}]},{"clave":"escuchar-los-sonidos","nombre":"Escuchar los sonidos","descripcion":"Los cercanos y los lejanos.","pasos":[{"texto":"Deja lo que haces un momento."},{"texto":"Escucha los sonidos cercanos y los lejanos."},{"texto":"Quédate con el que más te guste."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 24: Sentir las manos, Escuchar tu respiración, Apoyar los pies',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"sentir-las-manos","nombre":"Sentir las manos","descripcion":"Su peso y su temperatura.","pasos":[{"texto":"Apoya las manos sobre las piernas."},{"texto":"Nota su peso y su temperatura."},{"texto":"Respira una vez con calma."}]},{"clave":"escuchar-tu-respirac","nombre":"Escuchar tu respiración","descripcion":"Sin cambiarla.","pasos":[{"texto":"Fíjate en tu respiración, sin cambiarla."},{"texto":"Nota dónde la sientes más: nariz, pecho o abdomen."},{"texto":"Sigue unos segundos."}]},{"clave":"apoyar-los-pies","nombre":"Apoyar los pies","descripcion":"Sentir el contacto con el suelo.","pasos":[{"texto":"Apoya los dos pies en el suelo."},{"texto":"Nota el contacto y el peso de tus piernas."},{"texto":"Respira una vez con calma."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 25: Un pensamiento amable, Círculos con los hombros, Sentir la silla',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"un-pensamiento-amabl","nombre":"Un pensamiento amable","descripcion":"Pensar en alguien que te cae bien.","pasos":[{"texto":"Piensa en alguien que te cae bien."},{"texto":"Imagina qué te diría hoy."},{"texto":"Quédate con esa idea un momento."}]},{"clave":"circulos-con-los-hom","nombre":"Círculos con los hombros","descripcion":"Pequeños y hacia atrás.","pasos":[{"texto":"Dibuja círculos pequeños con los hombros."},{"texto":"Cinco hacia atrás, despacio."},{"texto":"Nota cómo quedan."}]},{"clave":"sentir-la-silla","nombre":"Sentir la silla","descripcion":"Notar cómo te sostiene.","pasos":[{"texto":"Nota cómo te sostiene la silla."},{"texto":"Deja que tu espalda se apoye un poco más."},{"texto":"Respira con calma y sigue."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 26: Dejar de hacer, Algo que salió bien, Algo que te guste',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"dejar-de-hacer","nombre":"Dejar de hacer","descripcion":"Manos quietas, un momento.","pasos":[{"texto":"Deja las manos quietas, sin hacer nada."},{"texto":"Respira con calma un momento."},{"texto":"Retoma cuando quieras."}]},{"clave":"algo-que-salio-bien","nombre":"Algo que salió bien","descripcion":"Recordar una cosa pequeña de hoy.","pasos":[{"texto":"Piensa en algo que hoy salió bien, aunque sea pequeño."},{"texto":"Recuerda cómo fue."},{"texto":"Quédate con eso un momento."}]},{"clave":"algo-que-te-guste","nombre":"Algo que te guste","descripcion":"Pensar en algo pequeño y bueno.","pasos":[{"texto":"Piensa en algo que te guste, aunque sea pequeño."},{"texto":"Deja que la cara se suavice, con o sin sonrisa."},{"texto":"Vuelve a lo tuyo con eso en mente."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 27: Oler algo agradable, Descansar los ojos, Un rincón ordenado',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"oler-algo-agradable","nombre":"Oler algo agradable","descripcion":"Café, una fruta, un jabón.","pasos":[{"texto":"Busca algo que huela rico: café, una fruta, un jabón."},{"texto":"Acércalo y respira."},{"texto":"Nota qué te recuerda."}]},{"clave":"descansar-los-ojos","nombre":"Descansar los ojos","descripcion":"Con las manos tibias encima.","pasos":[{"texto":"Frota las manos para calentarlas."},{"texto":"Apóyalas sobre los ojos cerrados, sin presionar."},{"texto":"Quédate unos segundos y ábrelos."}]},{"clave":"un-rincon-ordenado","nombre":"Un rincón ordenado","descripcion":"Ordenar una sola cosa.","pasos":[{"texto":"Elige una sola cosa de tu espacio."},{"texto":"Colócala en su lugar."},{"texto":"Mira el resultado un momento."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 28: Ver tres cosas, Mirar lejos, Mirar por la ventana',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"ver-tres-cosas","nombre":"Ver tres cosas","descripcion":"Nombrarlas en voz baja.","pasos":[{"texto":"Mira a tu alrededor."},{"texto":"Nombra en voz baja tres cosas que ves."},{"texto":"Respira y sigue."}]},{"clave":"mirar-lejos","nombre":"Mirar lejos","descripcion":"Descansar la vista mirando hacia lo lejano.","pasos":[{"texto":"Levanta la vista de lo que estás haciendo."},{"texto":"Mira hacia lo más lejos que veas, por una ventana o al fondo del cuarto."},{"texto":"Quédate ahí unos segundos y vuelve a lo tuyo."}]},{"clave":"mirar-por-la-ventana","nombre":"Mirar por la ventana","descripcion":"Seguir algo que se mueva.","pasos":[{"texto":"Mira por la ventana, si hay una cerca."},{"texto":"Fíjate en algo que se mueva: una nube, una hoja, un carro."},{"texto":"Sigue con la mirada unos segundos."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 29: Aflojar la mandíbula, Soltar los hombros, Beber algo despacio',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"aflojar-la-mandibula","nombre":"Aflojar la mandíbula","descripcion":"Dientes separados y lengua suelta.","pasos":[{"texto":"Nota cómo está tu mandíbula."},{"texto":"Separa un poco los dientes y suelta la lengua."},{"texto":"Respira con calma."}]},{"clave":"soltar-los-hombros","nombre":"Soltar los hombros","descripcion":"Subirlos y soltarlos, tres veces.","pasos":[{"texto":"Sube los hombros hacia las orejas al inhalar."},{"texto":"Suéltalos al exhalar, despacio."},{"texto":"Repite una vez más y nota cómo quedan."}]},{"clave":"beber-algo-despacio","nombre":"Beber algo despacio","descripcion":"Una bebida, en sorbos pequeños.","pasos":[{"texto":"Alcanza una bebida que te guste."},{"texto":"Tómala en sorbos pequeños."},{"texto":"Nota el calor o el frío en las manos."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 30: Moverte en la silla, Un vaso de agua, Calentar las manos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"moverte-en-la-silla","nombre":"Moverte en la silla","descripcion":"Mover hombros y espalda, y acomodarte.","pasos":[{"texto":"Mueve un poco los hombros y la espalda."},{"texto":"Cambia de posición con calma."},{"texto":"Vuelve a una posición cómoda."}]},{"clave":"un-vaso-de-agua","nombre":"Un vaso de agua","descripcion":"Unos sorbos de agua, con atención.","pasos":[{"texto":"Alcanza tu vaso o tu botella de agua."},{"texto":"Toma unos sorbos despacio."},{"texto":"Nota la temperatura y el sabor del agua."}]},{"clave":"calentar-las-manos","nombre":"Calentar las manos","descripcion":"Frotarlas hasta que estén tibias.","pasos":[{"texto":"Frota las palmas entre sí hasta calentarlas."},{"texto":"Presiona suave el centro de cada palma."},{"texto":"Apóyalas sobre las piernas."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 31: Mirar el cielo, Abrir la ventana, Mover los dedos de los pies',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"mirar-el-cielo","nombre":"Mirar el cielo","descripcion":"Por una ventana, si hay una cerca.","pasos":[{"texto":"Si hay una ventana, mira hacia el cielo."},{"texto":"Fíjate en el color y en las nubes."},{"texto":"Quédate un momento mirándolo."}]},{"clave":"abrir-la-ventana","nombre":"Abrir la ventana","descripcion":"Un poco de aire de afuera.","pasos":[{"texto":"Si hay una ventana cerca, ábrela un poco; si no puedes, mírala."},{"texto":"Respira el aire de afuera un par de veces."},{"texto":"Escucha un sonido de afuera."}]},{"clave":"mover-los-dedos-de-l","nombre":"Mover los dedos de los pies","descripcion":"Dentro de los zapatos o sin ellos.","pasos":[{"texto":"Mueve los dedos de los pies, dentro de los zapatos o sin ellos."},{"texto":"Ábrelos y ciérralos, despacio."},{"texto":"Nota cómo se sienten tus pies."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 32: Un recuerdo bonito, Tres respiraciones, Alargar el cuello',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"un-recuerdo-bonito","nombre":"Un recuerdo bonito","descripcion":"Un lugar donde estuviste a gusto.","pasos":[{"texto":"Recuerda un lugar donde estuviste a gusto."},{"texto":"Mira por dentro un detalle: un color, un olor, un sonido."},{"texto":"Vuelve cuando quieras."}]},{"clave":"tres-respiraciones","nombre":"Tres respiraciones","descripcion":"Respirar con calma, tres veces.","pasos":[{"texto":"Apoya la espalda en la silla."},{"texto":"Respira con calma tres veces, a tu ritmo."},{"texto":"Vuelve a lo tuyo cuando quieras."}]},{"clave":"alargar-el-cuello","nombre":"Alargar el cuello","descripcion":"Espalda larga y hombros sueltos.","pasos":[{"texto":"Siéntate con la espalda larga."},{"texto":"Imagina un hilo que te estira desde la coronilla."},{"texto":"Deja los hombros sueltos."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 33: Las manos en el pecho, Estirar las manos, Contar hacia atrás',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"las-manos-en-el-pech","nombre":"Las manos en el pecho","descripcion":"Sentir cómo suben y bajan al respirar.","pasos":[{"texto":"Apoya una mano en el pecho y otra en el abdomen."},{"texto":"Nota cómo suben y bajan con cada respiración."},{"texto":"Respira como siempre."}]},{"clave":"estirar-las-manos","nombre":"Estirar las manos","descripcion":"Abrir, cerrar y sacudir las manos.","pasos":[{"texto":"Abre las manos bien y ciérralas despacio."},{"texto":"Sacúdelas con suavidad unos segundos."},{"texto":"Apóyalas sobre las piernas y nota cómo se sienten."}]},{"clave":"contar-hacia-atras","nombre":"Contar hacia atrás","descripcion":"De cinco a uno, soltando el aire.","pasos":[{"texto":"Cuenta despacio de cinco a uno."},{"texto":"En cada número, suelta un poco el aire."},{"texto":"Al llegar a uno, mira a tu alrededor."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 34: Estirar una pierna, Cerrar los ojos, Parpadear',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"estirar-una-pierna","nombre":"Estirar una pierna","descripcion":"Con el talón en el suelo, y luego la otra.","pasos":[{"texto":"Estira una pierna al frente, con el talón en el suelo."},{"texto":"Cambia de pierna."},{"texto":"Vuelve a apoyar los pies."}]},{"clave":"cerrar-los-ojos","nombre":"Cerrar los ojos","descripcion":"Un momento con los ojos cerrados.","pasos":[{"texto":"Si puedes, cierra los ojos un momento."},{"texto":"Deja que la cara se afloje."},{"texto":"Ábrelos con calma cuando quieras."}]},{"clave":"parpadear","nombre":"Parpadear","descripcion":"Parpadear suave y cerrar un momento.","pasos":[{"texto":"Parpadea suave y seguido unos segundos."},{"texto":"Cierra los ojos un momento."},{"texto":"Ábrelos y mira hacia lejos."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 35: Mirar un objeto con atención, Mirar un color, Mirar algo lejano',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"mirar-un-objeto-con","nombre":"Mirar un objeto con atención","descripcion":"Su forma, su color y su textura.","pasos":[{"texto":"Elige un objeto cerca de ti."},{"texto":"Mira su forma, su color y su textura."},{"texto":"Descríbelo en tu cabeza con tres palabras."}]},{"clave":"mirar-un-color","nombre":"Mirar un color","descripcion":"Buscar un color a tu alrededor.","pasos":[{"texto":"Busca un color a tu alrededor."},{"texto":"Mira todas las cosas que tengan ese color."},{"texto":"Quédate un momento con lo que viste."}]},{"clave":"mirar-algo-lejano","nombre":"Mirar algo lejano","descripcion":"Elegir un punto y mantener la mirada.","pasos":[{"texto":"Elige un punto lejano."},{"texto":"Mantén la mirada ahí unos segundos."},{"texto":"Vuelve a mirar de cerca, con calma."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 36: Apoyar la espalda, Escuchar los sonidos, Una canción por dentro',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"apoyar-la-espalda","nombre":"Apoyar la espalda","descripcion":"Dejar los brazos sueltos.","pasos":[{"texto":"Apoya la espalda contra el respaldo."},{"texto":"Deja los brazos sueltos."},{"texto":"Respira con calma dos veces."}]},{"clave":"escuchar-los-sonidos","nombre":"Escuchar los sonidos","descripcion":"Los cercanos y los lejanos.","pasos":[{"texto":"Deja lo que haces un momento."},{"texto":"Escucha los sonidos cercanos y los lejanos."},{"texto":"Quédate con el que más te guste."}]},{"clave":"una-cancion-por-dent","nombre":"Una canción por dentro","descripcion":"Recordar una canción que te guste.","pasos":[{"texto":"Recuerda una canción que te guste."},{"texto":"Escúchala por dentro un momento."},{"texto":"Vuelve cuando termine."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 37: Escuchar tu respiración, Apoyar los pies, Estirar los brazos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"escuchar-tu-respirac","nombre":"Escuchar tu respiración","descripcion":"Sin cambiarla.","pasos":[{"texto":"Fíjate en tu respiración, sin cambiarla."},{"texto":"Nota dónde la sientes más: nariz, pecho o abdomen."},{"texto":"Sigue unos segundos."}]},{"clave":"apoyar-los-pies","nombre":"Apoyar los pies","descripcion":"Sentir el contacto con el suelo.","pasos":[{"texto":"Apoya los dos pies en el suelo."},{"texto":"Nota el contacto y el peso de tus piernas."},{"texto":"Respira una vez con calma."}]},{"clave":"estirar-los-brazos","nombre":"Estirar los brazos","descripcion":"Hacia el frente y hacia arriba.","pasos":[{"texto":"Estira los brazos al frente, sin tensar."},{"texto":"Llévalos hacia arriba si hay espacio, y bájalos."},{"texto":"Respira con calma."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 38: Círculos con los hombros, Sentir la silla, Sentir las manos',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"circulos-con-los-hom","nombre":"Círculos con los hombros","descripcion":"Pequeños y hacia atrás.","pasos":[{"texto":"Dibuja círculos pequeños con los hombros."},{"texto":"Cinco hacia atrás, despacio."},{"texto":"Nota cómo quedan."}]},{"clave":"sentir-la-silla","nombre":"Sentir la silla","descripcion":"Notar cómo te sostiene.","pasos":[{"texto":"Nota cómo te sostiene la silla."},{"texto":"Deja que tu espalda se apoye un poco más."},{"texto":"Respira con calma y sigue."}]},{"clave":"sentir-las-manos","nombre":"Sentir las manos","descripcion":"Su peso y su temperatura.","pasos":[{"texto":"Apoya las manos sobre las piernas."},{"texto":"Nota su peso y su temperatura."},{"texto":"Respira una vez con calma."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 39: Algo que salió bien, Algo que te guste, Un pensamiento amable',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"algo-que-salio-bien","nombre":"Algo que salió bien","descripcion":"Recordar una cosa pequeña de hoy.","pasos":[{"texto":"Piensa en algo que hoy salió bien, aunque sea pequeño."},{"texto":"Recuerda cómo fue."},{"texto":"Quédate con eso un momento."}]},{"clave":"algo-que-te-guste","nombre":"Algo que te guste","descripcion":"Pensar en algo pequeño y bueno.","pasos":[{"texto":"Piensa en algo que te guste, aunque sea pequeño."},{"texto":"Deja que la cara se suavice, con o sin sonrisa."},{"texto":"Vuelve a lo tuyo con eso en mente."}]},{"clave":"un-pensamiento-amabl","nombre":"Un pensamiento amable","descripcion":"Pensar en alguien que te cae bien.","pasos":[{"texto":"Piensa en alguien que te cae bien."},{"texto":"Imagina qué te diría hoy."},{"texto":"Quédate con esa idea un momento."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510209-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000209',
    'Un respiro, 40: Descansar los ojos, Un rincón ordenado, Dejar de hacer',
    1,
    '{"modo":"pasos","intro":"Una pausa de uno o dos minutos. Elige la que te venga mejor ahora; no hace falta levantarte.","avance":"manual","elecciones":[{"clave":"descansar-los-ojos","nombre":"Descansar los ojos","descripcion":"Con las manos tibias encima.","pasos":[{"texto":"Frota las manos para calentarlas."},{"texto":"Apóyalas sobre los ojos cerrados, sin presionar."},{"texto":"Quédate unos segundos y ábrelos."}]},{"clave":"un-rincon-ordenado","nombre":"Un rincón ordenado","descripcion":"Ordenar una sola cosa.","pasos":[{"texto":"Elige una sola cosa de tu espacio."},{"texto":"Colócala en su lugar."},{"texto":"Mira el resultado un momento."}]},{"clave":"dejar-de-hacer","nombre":"Dejar de hacer","descripcion":"Manos quietas, un momento.","pasos":[{"texto":"Deja las manos quietas, sin hacer nada."},{"texto":"Respira con calma un momento."},{"texto":"Retoma cuando quieras."}]}],"cierre":"Volvamos con calma.","avisoSiempre":"Puedes parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;
