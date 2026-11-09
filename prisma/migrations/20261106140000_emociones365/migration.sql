-- Emociones 365 · 357 actividades únicas que completan las ocho fichas existentes.
--
-- Cada ficha tiene identificador, nombre y consigna propios. Se usan solo motores y vistas VSD existentes;
-- no se alteran tipografía, paleta, botones, animaciones ni estilos.
--
-- El contenido emocional queda SIN PUBLICAR y pendiente de revisión profesional. Esta migración solo carga
-- borradores: ninguna actividad se ofrece a las personas hasta completar y registrar esa revisión.
-- Las invitaciones son optativas, no puntúan, no diagnostican ni interpretan lo que siente la persona.
--

-- ---------------------------------------------------------------------------
-- 1. Las mecanicas, PRIMERO (357)
-- ---------------------------------------------------------------------------

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor", "franja"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000310',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: El color del momento',
    'bitacora',
    'Color del momento',
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
    '0acd0000-0000-4000-8000-000000000311',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Una palabra más precisa',
    'bitacora',
    'Palabra más precisa',
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
    '0acd0000-0000-4000-8000-000000000312',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Entre dos nombres',
    'bitacora',
    'Dos nombres',
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
    '0acd0000-0000-4000-8000-000000000313',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Lo que no sé nombrar',
    'bitacora',
    'Sé nombrar',
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
    '0acd0000-0000-4000-8000-000000000314',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Un matiz inesperado',
    'bitacora',
    'Matiz inesperado',
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
    '0acd0000-0000-4000-8000-000000000315',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La emoción de fondo',
    'bitacora',
    'Emoción de fondo',
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
    '0acd0000-0000-4000-8000-000000000316',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La emoción más visible',
    'bitacora',
    'Emoción más visible',
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
    '0acd0000-0000-4000-8000-000000000317',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Una mezcla posible',
    'bitacora',
    'Mezcla posible',
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
    '0acd0000-0000-4000-8000-000000000318',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Cerca de la calma',
    'bitacora',
    'Cerca calma',
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
    '0acd0000-0000-4000-8000-000000000319',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Cerca de la curiosidad',
    'bitacora',
    'Cerca curiosidad',
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
    '0acd0000-0000-4000-8000-000000000320',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La emoción pequeña',
    'bitacora',
    'Emoción pequeña',
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
    '0acd0000-0000-4000-8000-000000000321',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Una emoción amplia',
    'bitacora',
    'Emoción amplia',
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
    '0acd0000-0000-4000-8000-000000000322',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La palabra de hoy',
    'bitacora',
    'Palabra de hoy',
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
    '0acd0000-0000-4000-8000-000000000323',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Un matiz corporal',
    'bitacora',
    'Matiz corporal',
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
    '0acd0000-0000-4000-8000-000000000324',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La emoción que cambia',
    'bitacora',
    'Emoción que cambia',
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
    '0acd0000-0000-4000-8000-000000000325',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Una emoción neutral',
    'bitacora',
    'Emoción neutral',
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
    '0acd0000-0000-4000-8000-000000000326',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: El matiz difícil',
    'bitacora',
    'Matiz difícil',
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
    '0acd0000-0000-4000-8000-000000000327',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La emoción de una escena',
    'bitacora',
    'Emoción escena',
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
    '0acd0000-0000-4000-8000-000000000328',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Un nombre prestado',
    'bitacora',
    'Nombre prestado',
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
    '0acd0000-0000-4000-8000-000000000329',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Emoción sin explicación',
    'bitacora',
    'Emoción sin explicación',
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
    '0acd0000-0000-4000-8000-000000000330',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La palabra que falta',
    'bitacora',
    'Palabra que falta',
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
    '0acd0000-0000-4000-8000-000000000331',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Dos emociones a la vez',
    'bitacora',
    'Dos emociones',
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
    '0acd0000-0000-4000-8000-000000000332',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: El matiz que acompaña',
    'bitacora',
    'Matiz que acompaña',
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
    '0acd0000-0000-4000-8000-000000000333',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Emoción y energía',
    'bitacora',
    'Emoción y energía',
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
    '0acd0000-0000-4000-8000-000000000334',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Lo que sí aparece',
    'bitacora',
    'Sí aparece',
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
    '0acd0000-0000-4000-8000-000000000335',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Un matiz de alivio',
    'bitacora',
    'Matiz de alivio',
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
    '0acd0000-0000-4000-8000-000000000336',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Una emoción sin etiqueta',
    'bitacora',
    'Emoción sin etiqueta',
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
    '0acd0000-0000-4000-8000-000000000337',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: El matiz de una pausa',
    'bitacora',
    'Matiz pausa',
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
    '0acd0000-0000-4000-8000-000000000338',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: La emoción que se mueve',
    'bitacora',
    'Emoción que se',
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
    '0acd0000-0000-4000-8000-000000000339',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Matices del ánimo: Un cierre con nombre',
    'bitacora',
    'Cierre con nombre',
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
    '0acd0000-0000-4000-8000-000000000340',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Mapa de señales',
    'bitacora',
    'Mapa de señales',
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
    '0acd0000-0000-4000-8000-000000000341',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Ritmo interior',
    'bitacora',
    'Ritmo interior',
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
    '0acd0000-0000-4000-8000-000000000342',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: El primer aviso',
    'bitacora',
    'Primer aviso',
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
    '0acd0000-0000-4000-8000-000000000343',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de descanso',
    'bitacora',
    'Señal de descanso',
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
    '0acd0000-0000-4000-8000-000000000344',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de interés',
    'bitacora',
    'Señal de interés',
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
    '0acd0000-0000-4000-8000-000000000345',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de incomodidad',
    'bitacora',
    'Señal de incomodidad',
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
    '0acd0000-0000-4000-8000-000000000346',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de conexión',
    'bitacora',
    'Señal de conexión',
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
    '0acd0000-0000-4000-8000-000000000347',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de distancia',
    'bitacora',
    'Señal de distancia',
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
    '0acd0000-0000-4000-8000-000000000348',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Un cambio de energía',
    'bitacora',
    'Cambio de energía',
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
    '0acd0000-0000-4000-8000-000000000349',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: La señal de curiosidad',
    'bitacora',
    'Señal de curiosidad',
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
    '0acd0000-0000-4000-8000-000000000350',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Tono de voz propio',
    'bitacora',
    'Tono de voz',
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
    '0acd0000-0000-4000-8000-000000000351',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: La postura del momento',
    'bitacora',
    'Postura del momento',
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
    '0acd0000-0000-4000-8000-000000000352',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Lo que pide atención',
    'bitacora',
    'Pide atención',
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
    '0acd0000-0000-4000-8000-000000000353',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de incertidumbre',
    'bitacora',
    'Señal de incertidumbre',
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
    '0acd0000-0000-4000-8000-000000000354',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de entusiasmo',
    'bitacora',
    'Señal de entusiasmo',
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
    '0acd0000-0000-4000-8000-000000000355',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de fastidio',
    'bitacora',
    'Señal de fastidio',
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
    '0acd0000-0000-4000-8000-000000000356',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: La señal de alivio',
    'bitacora',
    'Señal de alivio',
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
    '0acd0000-0000-4000-8000-000000000357',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de saturación',
    'bitacora',
    'Señal de saturación',
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
    '0acd0000-0000-4000-8000-000000000358',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Un momento de quietud',
    'bitacora',
    'Momento de quietud',
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
    '0acd0000-0000-4000-8000-000000000359',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de confianza',
    'bitacora',
    'Señal de confianza',
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
    '0acd0000-0000-4000-8000-000000000360',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de duda',
    'bitacora',
    'Señal de duda',
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
    '0acd0000-0000-4000-8000-000000000361',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de cansancio emocional',
    'bitacora',
    'Señal de cansancio',
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
    '0acd0000-0000-4000-8000-000000000362',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de alegría tranquila',
    'bitacora',
    'Señal de alegría',
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
    '0acd0000-0000-4000-8000-000000000363',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de necesidad',
    'bitacora',
    'Señal de necesidad',
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
    '0acd0000-0000-4000-8000-000000000364',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de pausa social',
    'bitacora',
    'Señal de pausa',
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
    '0acd0000-0000-4000-8000-000000000365',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: La emoción en las manos',
    'bitacora',
    'Emoción manos',
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
    '0acd0000-0000-4000-8000-000000000366',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: La emoción en el rostro',
    'bitacora',
    'Emoción rostro',
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
    '0acd0000-0000-4000-8000-000000000367',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Una señal de seguridad',
    'bitacora',
    'Señal de seguridad',
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
    '0acd0000-0000-4000-8000-000000000368',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Señal de cambio',
    'bitacora',
    'Señal de cambio',
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
    '0acd0000-0000-4000-8000-000000000369',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Señales que noto: Lo que prefiero no notar',
    'bitacora',
    'Prefiero no notar',
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
    '0acd0000-0000-4000-8000-000000000370',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un mensaje sin respuesta',
    'bitacora',
    'Mensaje sin respuesta',
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
    '0acd0000-0000-4000-8000-000000000371',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un plan que cambia',
    'bitacora',
    'Plan que cambia',
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
    '0acd0000-0000-4000-8000-000000000372',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una invitación inesperada',
    'bitacora',
    'Invitación inesperada',
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
    '0acd0000-0000-4000-8000-000000000373',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una tarea terminada',
    'bitacora',
    'Tarea terminada',
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
    '0acd0000-0000-4000-8000-000000000374',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un elogio en público',
    'bitacora',
    'Elogio en público',
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
    '0acd0000-0000-4000-8000-000000000375',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una espera larga',
    'bitacora',
    'Espera larga',
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
    '0acd0000-0000-4000-8000-000000000376',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: La charla por empezar',
    'bitacora',
    'Charla por empezar',
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
    '0acd0000-0000-4000-8000-000000000377',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una noticia ambigua',
    'bitacora',
    'Noticia ambigua',
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
    '0acd0000-0000-4000-8000-000000000378',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un día con poco ruido',
    'bitacora',
    'Día con poco',
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
    '0acd0000-0000-4000-8000-000000000379',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una despedida breve',
    'bitacora',
    'Despedida breve',
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
    '0acd0000-0000-4000-8000-000000000380',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una meta compartida',
    'bitacora',
    'Meta compartida',
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
    '0acd0000-0000-4000-8000-000000000381',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un error pequeño',
    'bitacora',
    'Error pequeño',
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
    '0acd0000-0000-4000-8000-000000000382',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una visita sorpresa',
    'bitacora',
    'Visita sorpresa',
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
    '0acd0000-0000-4000-8000-000000000383',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un recuerdo que aparece',
    'bitacora',
    'Recuerdo que aparece',
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
    '0acd0000-0000-4000-8000-000000000384',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una decisión aplazada',
    'bitacora',
    'Decisión aplazada',
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
    '0acd0000-0000-4000-8000-000000000385',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un lugar conocido',
    'bitacora',
    'Lugar conocido',
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
    '0acd0000-0000-4000-8000-000000000386',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un favor que cuesta pedir',
    'bitacora',
    'Favor que cuesta',
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
    '0acd0000-0000-4000-8000-000000000387',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una opinión diferente',
    'bitacora',
    'Opinión diferente',
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
    '0acd0000-0000-4000-8000-000000000388',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una pausa en el trabajo',
    'bitacora',
    'Pausa trabajo',
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
    '0acd0000-0000-4000-8000-000000000389',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una despedida de un objeto',
    'bitacora',
    'Despedida objeto',
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
    '0acd0000-0000-4000-8000-000000000390',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una puerta que se abre',
    'bitacora',
    'Puerta que se',
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
    '0acd0000-0000-4000-8000-000000000391',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un logro ajeno',
    'bitacora',
    'Logro ajeno',
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
    '0acd0000-0000-4000-8000-000000000392',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una pregunta difícil',
    'bitacora',
    'Pregunta difícil',
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
    '0acd0000-0000-4000-8000-000000000393',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una tarde sin planes',
    'bitacora',
    'Tarde sin planes',
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
    '0acd0000-0000-4000-8000-000000000394',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un cambio de horario',
    'bitacora',
    'Cambio de horario',
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
    '0acd0000-0000-4000-8000-000000000395',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una conversación que termina',
    'bitacora',
    'Conversación que termina',
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
    '0acd0000-0000-4000-8000-000000000396',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una sorpresa agradable',
    'bitacora',
    'Sorpresa agradable',
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
    '0acd0000-0000-4000-8000-000000000397',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Una opinión propia',
    'bitacora',
    'Opinión propia',
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
    '0acd0000-0000-4000-8000-000000000398',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un objeto perdido',
    'bitacora',
    'Objeto perdido',
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
    '0acd0000-0000-4000-8000-000000000399',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Escenas cotidianas: Un primer intento',
    'bitacora',
    'Primer intento',
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
    '0acd0000-0000-4000-8000-000000003100',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una frase para el ánimo',
    'bitacora',
    'Frase ánimo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003101',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Lo que me gustaría decir',
    'bitacora',
    'Me gustaría decir',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003102',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Un nombre provisional',
    'bitacora',
    'Nombre provisional',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003103',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: La emoción como clima',
    'bitacora',
    'Emoción como clima',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003104',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Un color sin significado',
    'bitacora',
    'Color sin significado',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003105',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una nota sin destinatario',
    'bitacora',
    'Nota sin destinatario',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003106',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una pregunta amable',
    'bitacora',
    'Pregunta amable',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003107',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Un título para hoy',
    'bitacora',
    'Título para hoy',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003108',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Lo que no voy a resolver',
    'bitacora',
    'Voy a resolver',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003109',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: La palabra más cercana',
    'bitacora',
    'Palabra más cercana',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003110',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una frase de permiso',
    'bitacora',
    'Frase de permiso',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003111',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Un borde claro',
    'bitacora',
    'Borde claro',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003112',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una emoción en tres palabras',
    'bitacora',
    'Emoción en tres',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003113',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una respuesta que espero',
    'bitacora',
    'Respuesta que espero',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003114',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Lo que quiero conservar',
    'bitacora',
    'Quiero conservar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003115',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una frase para una pausa',
    'bitacora',
    'Frase pausa',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003116',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Algo que cambió',
    'bitacora',
    'Algo que cambió',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003117',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Algo que sigue igual',
    'bitacora',
    'Algo que sigue',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003118',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: La emoción y su volumen',
    'bitacora',
    'Emoción y su',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003119',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Un mensaje sin enviar',
    'bitacora',
    'Mensaje sin enviar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003120',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: La parte que necesita tiempo',
    'bitacora',
    'Parte que necesita',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003121',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Lo que me gustaría preguntar',
    'bitacora',
    'Me gustaría preguntar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003122',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una descripción sencilla',
    'bitacora',
    'Descripción sencilla',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003123',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una idea que puedo pausar',
    'bitacora',
    'Idea que puedo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003124',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Mi espacio de hoy',
    'bitacora',
    'Espacio de hoy',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003125',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: El recuerdo sin juicio',
    'bitacora',
    'Recuerdo sin juicio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003126',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una palabra que aprendí',
    'bitacora',
    'Palabra que aprendí',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003127',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una línea para mañana',
    'bitacora',
    'Línea para mañana',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003128',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: El final de esta frase',
    'bitacora',
    'Final de esta',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003129',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Palabras propias: Una nota para mí',
    'bitacora',
    'Nota para mí',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003130',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito espacio',
    'bitacora',
    'Necesito espacio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003131',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito claridad',
    'bitacora',
    'Necesito claridad',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003132',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Una preferencia pequeña',
    'bitacora',
    'Preferencia pequeña',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003133',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Lo que puede esperar',
    'bitacora',
    'Puede esperar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003134',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito compañía',
    'bitacora',
    'Necesito compañía',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003135',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Un ritmo posible',
    'bitacora',
    'Ritmo posible',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003136',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito información',
    'bitacora',
    'Necesito información',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003137',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Una opción más cómoda',
    'bitacora',
    'Opción más cómoda',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003138',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Pedir una pausa',
    'bitacora',
    'Pedir una pausa',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003139',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Lo que quiero cuidar',
    'bitacora',
    'Quiero cuidar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003140',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito silencio',
    'bitacora',
    'Necesito silencio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003141',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Una decisión sin prisa',
    'bitacora',
    'Decisión sin prisa',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003142',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Puedo elegir el cómo',
    'bitacora',
    'Elegir el cómo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003143',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Una ayuda concreta',
    'bitacora',
    'Ayuda concreta',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003144',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito un límite',
    'bitacora',
    'Necesito un límite',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003145',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Elijo no responder',
    'bitacora',
    'Elijo no responder',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003146',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: La compañía adecuada',
    'bitacora',
    'Compañía adecuada',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003147',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Una actividad que sí quiero',
    'bitacora',
    'Actividad que sí',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003148',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito menos opciones',
    'bitacora',
    'Necesito menos opciones',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003149',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Necesito más tiempo',
    'bitacora',
    'Necesito más tiempo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003150',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Mi forma de participar',
    'bitacora',
    'Forma de participar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003151',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Una necesidad sin culpa',
    'bitacora',
    'Necesidad sin culpa',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003152',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Lo que sí puedo cambiar',
    'bitacora',
    'Sí puedo cambiar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003153',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Una expectativa propia',
    'bitacora',
    'Expectativa propia',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003154',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: El tipo de apoyo',
    'bitacora',
    'Tipo de apoyo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003155',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Un acuerdo conmigo',
    'bitacora',
    'Acuerdo conmigo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003156',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Lo que me resulta suficiente',
    'bitacora',
    'Me resulta suficiente',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003157',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Elegir con el cuerpo cómodo',
    'bitacora',
    'Cuerpo cómodo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003158',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Un «no» posible',
    'bitacora',
    'Necesidades y preferencias',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003159',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Necesidades y preferencias: Un «sí» propio',
    'bitacora',
    'Sí propio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003160',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Escucha sin arreglar',
    'bitacora',
    'Escucha sin arreglar',
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
    '0acd0000-0000-4000-8000-000000003161',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Agradecer a mi manera',
    'bitacora',
    'Agradecer a mi',
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
    '0acd0000-0000-4000-8000-000000003162',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Una llamada de reencuentro',
    'bitacora',
    'Llamada de reencuentro',
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
    '0acd0000-0000-4000-8000-000000003163',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Pedir que me escuchen',
    'bitacora',
    'Pedir que me',
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
    '0acd0000-0000-4000-8000-000000003164',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Compartir una buena noticia',
    'bitacora',
    'Compartir una buena',
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
    '0acd0000-0000-4000-8000-000000003165',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Reparar un malentendido',
    'bitacora',
    'Reparar un malentendido',
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
    '0acd0000-0000-4000-8000-000000003166',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Una charla con pausas',
    'bitacora',
    'Charla con pausas',
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
    '0acd0000-0000-4000-8000-000000003167',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Reconocer el esfuerzo ajeno',
    'bitacora',
    'Reconocer el esfuerzo',
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
    '0acd0000-0000-4000-8000-000000003168',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Un saludo que me representa',
    'bitacora',
    'Saludo que me',
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
    '0acd0000-0000-4000-8000-000000003169',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Hacer una pregunta abierta',
    'bitacora',
    'Hacer una pregunta',
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
    '0acd0000-0000-4000-8000-000000003170',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Compartir silencio',
    'bitacora',
    'Compartir silencio',
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
    '0acd0000-0000-4000-8000-000000003171',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Responder más tarde',
    'bitacora',
    'Responder más tarde',
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
    '0acd0000-0000-4000-8000-000000003172',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Decir que no entendí',
    'bitacora',
    'Decir entendí',
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
    '0acd0000-0000-4000-8000-000000003173',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Celebrar sin comparar',
    'bitacora',
    'Celebrar sin comparar',
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
    '0acd0000-0000-4000-8000-000000003174',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Cuidar una confidencia',
    'bitacora',
    'Cuidar una confidencia',
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
    '0acd0000-0000-4000-8000-000000003175',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Aclarar una preferencia',
    'bitacora',
    'Aclarar una preferencia',
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
    '0acd0000-0000-4000-8000-000000003176',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Recibir un cumplido',
    'bitacora',
    'Recibir un cumplido',
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
    '0acd0000-0000-4000-8000-000000003177',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Un contacto que me hace bien',
    'bitacora',
    'Contacto que me',
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
    '0acd0000-0000-4000-8000-000000003178',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Poner fin a una charla',
    'bitacora',
    'Poner fin',
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
    '0acd0000-0000-4000-8000-000000003179',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Escuchar otra experiencia',
    'bitacora',
    'Escuchar otra experiencia',
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
    '0acd0000-0000-4000-8000-000000003180',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Pedir una aclaración',
    'bitacora',
    'Pedir una aclaración',
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
    '0acd0000-0000-4000-8000-000000003181',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Expresar desacuerdo',
    'bitacora',
    'Expresar desacuerdo',
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
    '0acd0000-0000-4000-8000-000000003182',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Aceptar una invitación',
    'bitacora',
    'Aceptar una invitación',
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
    '0acd0000-0000-4000-8000-000000003183',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Rechazar un plan',
    'bitacora',
    'Rechazar un plan',
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
    '0acd0000-0000-4000-8000-000000003184',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Un mensaje de apoyo',
    'bitacora',
    'Mensaje de apoyo',
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
    '0acd0000-0000-4000-8000-000000003185',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Pedir ayuda concreta',
    'bitacora',
    'Pedir ayuda concreta',
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
    '0acd0000-0000-4000-8000-000000003186',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Hablar desde mí',
    'bitacora',
    'Hablar desde mí',
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
    '0acd0000-0000-4000-8000-000000003187',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Dar espacio a otra voz',
    'bitacora',
    'Espacio a otra',
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
    '0acd0000-0000-4000-8000-000000003188',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Cuidar mi intimidad',
    'bitacora',
    'Cuidar mi intimidad',
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
    '0acd0000-0000-4000-8000-000000003189',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Vínculos y comunicación: Reconectar sin obligación',
    'bitacora',
    'Reconectar sin obligación',
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
    '0acd0000-0000-4000-8000-000000003190',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: El límite del horario',
    'bitacora',
    'Límite del horario',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003191',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Una tarea compartida',
    'bitacora',
    'Tarea compartida',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003192',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Una pregunta personal',
    'bitacora',
    'Pregunta personal',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003193',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: El espacio físico',
    'bitacora',
    'Espacio físico',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003194',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Cambiar de opinión',
    'bitacora',
    'Cambiar de opinión',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003195',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Una petición incómoda',
    'bitacora',
    'Petición incómoda',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003196',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: El tiempo propio',
    'bitacora',
    'Tiempo propio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003197',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Un límite digital',
    'bitacora',
    'Límite digital',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003198',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Un tema que pauso',
    'bitacora',
    'Tema que pauso',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003199',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Decir «hasta aquí»',
    'bitacora',
    'Decir hasta aquí',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003200',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: No decidir por presión',
    'bitacora',
    'Decidir por presión',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003201',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Una decisión compartida',
    'bitacora',
    'Decisión compartida',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003202',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Mi espacio de trabajo',
    'bitacora',
    'Espacio de trabajo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003203',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Una expectativa ajena',
    'bitacora',
    'Expectativa ajena',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003204',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: El límite de una broma',
    'bitacora',
    'Límite broma',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003205',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Un favor posible',
    'bitacora',
    'Favor posible',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003206',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Cuidar una conversación',
    'bitacora',
    'Cuidar una conversación',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003207',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Elegir lo que cuento',
    'bitacora',
    'Elegir cuento',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003208',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Mi respuesta auténtica',
    'bitacora',
    'Mi respuesta auténtica',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003209',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Un cambio de plan',
    'bitacora',
    'Cambio de plan',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003210',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Una pausa antes del sí',
    'bitacora',
    'Antes del sí',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003211',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Un límite con amabilidad',
    'bitacora',
    'Límite con amabilidad',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003212',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Una tarea que no me toca',
    'bitacora',
    'Me toca',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003213',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: El momento de retirarme',
    'bitacora',
    'Momento de retirarme',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003214',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Un acuerdo que revisar',
    'bitacora',
    'Acuerdo que revisar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003215',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Lo que acepto hoy',
    'bitacora',
    'Acepto hoy',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003216',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: El límite del consejo',
    'bitacora',
    'Límite del consejo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003217',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: La puerta entreabierta',
    'bitacora',
    'Puerta entreabierta',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003218',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Un espacio para pensar',
    'bitacora',
    'Espacio para pensar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003219',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Límites y decisiones: Mi decisión pequeña',
    'bitacora',
    'Mi decisión pequeña',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003220',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Dos cosas verdaderas',
    'bitacora',
    'Dos cosas verdaderas',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003221',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Agridulce',
    'bitacora',
    'Emociones mezcladas Agridulce',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003222',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Querer y dudar',
    'bitacora',
    'Querer y dudar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003223',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Alivio con cansancio',
    'bitacora',
    'Alivio con cansancio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003224',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Alegría con nervios',
    'bitacora',
    'Alegría con nervios',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003225',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Cariño y distancia',
    'bitacora',
    'Cariño y distancia',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003226',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Nostalgia y presente',
    'bitacora',
    'Nostalgia y presente',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003227',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Orgullo y humildad',
    'bitacora',
    'Orgullo y humildad',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003228',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Tranquilidad e incertidumbre',
    'bitacora',
    'Tranquilidad e incertidumbre',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003229',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Curiosidad con cautela',
    'bitacora',
    'Curiosidad con cautela',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003230',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Fastidio y cuidado',
    'bitacora',
    'Fastidio y cuidado',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003231',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Pena y compañía',
    'bitacora',
    'Pena y compañía',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003232',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Confianza con preguntas',
    'bitacora',
    'Confianza con preguntas',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003233',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Emoción sin conclusión',
    'bitacora',
    'Emoción sin conclusión',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003234',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Un sí y un no',
    'bitacora',
    'Mezcladas Un sí',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003235',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Recuerdo que cambia',
    'bitacora',
    'Recuerdo que cambia',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003236',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Esperanza con paciencia',
    'bitacora',
    'Esperanza con paciencia',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003237',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Duda con interés',
    'bitacora',
    'Duda con interés',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003238',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Energía irregular',
    'bitacora',
    'Energía irregular',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003239',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Una mezcla sin nombre',
    'bitacora',
    'Mezcla sin nombre',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003240',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Risa y preocupación',
    'bitacora',
    'Risa y preocupación',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003241',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Despedida y comienzo',
    'bitacora',
    'Despedida y comienzo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003242',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Deseo y realidad',
    'bitacora',
    'Deseo y realidad',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003243',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Satisfacción con cansancio',
    'bitacora',
    'Satisfacción con cansancio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003244',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Confusión con una pista',
    'bitacora',
    'Confusión pista',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003245',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Entusiasmo y pausa',
    'bitacora',
    'Entusiasmo y pausa',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003246',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Afecto y desacuerdo',
    'bitacora',
    'Afecto y desacuerdo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003247',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Cambio y familiaridad',
    'bitacora',
    'Cambio y familiaridad',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003248',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Lo que convive hoy',
    'bitacora',
    'Convive hoy',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003249',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Emociones mezcladas: Un final abierto',
    'bitacora',
    'Final abierto',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003250',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un paisaje interior',
    'bitacora',
    'Paisaje interior',
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
    '0acd0000-0000-4000-8000-000000003251',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: La paleta del momento',
    'bitacora',
    'Paleta del momento',
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
    '0acd0000-0000-4000-8000-000000003252',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una forma para la emoción',
    'bitacora',
    'Forma emoción',
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
    '0acd0000-0000-4000-8000-000000003253',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Ritmo emocional',
    'bitacora',
    'Ritmo emocional',
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
    '0acd0000-0000-4000-8000-000000003254',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una canción sin letra',
    'bitacora',
    'Canción sin letra',
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
    '0acd0000-0000-4000-8000-000000003255',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Objeto imaginario',
    'bitacora',
    'Objeto imaginario',
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
    '0acd0000-0000-4000-8000-000000003256',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un personaje de hoy',
    'bitacora',
    'Personaje de hoy',
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
    '0acd0000-0000-4000-8000-000000003257',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: La forma de una pausa',
    'bitacora',
    'Forma pausa',
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
    '0acd0000-0000-4000-8000-000000003258',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un símbolo personal',
    'bitacora',
    'Símbolo personal',
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
    '0acd0000-0000-4000-8000-000000003259',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una viñeta sin palabras',
    'bitacora',
    'Viñeta sin palabras',
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
    '0acd0000-0000-4000-8000-000000003260',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un mapa de colores',
    'bitacora',
    'Mapa de colores',
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
    '0acd0000-0000-4000-8000-000000003261',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: La emoción como sonido',
    'bitacora',
    'Emoción como sonido',
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
    '0acd0000-0000-4000-8000-000000003262',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un título de película',
    'bitacora',
    'Título de película',
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
    '0acd0000-0000-4000-8000-000000003263',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un objeto compañero',
    'bitacora',
    'Objeto compañero',
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
    '0acd0000-0000-4000-8000-000000003264',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: El clima en tres formas',
    'bitacora',
    'Clima en tres',
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
    '0acd0000-0000-4000-8000-000000003265',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un movimiento de lápiz',
    'bitacora',
    'Movimiento de lápiz',
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
    '0acd0000-0000-4000-8000-000000003266',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una escena con distancia',
    'bitacora',
    'Escena con distancia',
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
    '0acd0000-0000-4000-8000-000000003267',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una metáfora propia',
    'bitacora',
    'Metáfora propia',
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
    '0acd0000-0000-4000-8000-000000003268',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un color que falta',
    'bitacora',
    'Color que falta',
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
    '0acd0000-0000-4000-8000-000000003269',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un ritmo con las manos',
    'bitacora',
    'Ritmo manos',
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
    '0acd0000-0000-4000-8000-000000003270',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: La emoción en una postal',
    'bitacora',
    'Emoción postal',
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
    '0acd0000-0000-4000-8000-000000003271',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un collage de sensaciones',
    'bitacora',
    'Collage de sensaciones',
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
    '0acd0000-0000-4000-8000-000000003272',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: El nombre de una nube',
    'bitacora',
    'Nombre nube',
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
    '0acd0000-0000-4000-8000-000000003273',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una escena en pausa',
    'bitacora',
    'Escena en pausa',
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
    '0acd0000-0000-4000-8000-000000003274',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Un gesto de personaje',
    'bitacora',
    'Gesto de personaje',
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
    '0acd0000-0000-4000-8000-000000003275',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una emoción con forma',
    'bitacora',
    'Emoción con forma',
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
    '0acd0000-0000-4000-8000-000000003276',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una palabra dibujada',
    'bitacora',
    'Palabra dibujada',
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
    '0acd0000-0000-4000-8000-000000003277',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una caja imaginaria',
    'bitacora',
    'Caja imaginaria',
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
    '0acd0000-0000-4000-8000-000000003278',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: Una escena de dos colores',
    'bitacora',
    'Escena de dos',
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
    '0acd0000-0000-4000-8000-000000003279',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Expresión creativa: El final que elijo',
    'bitacora',
    'Final que elijo',
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
    '0acd0000-0000-4000-8000-000000003280',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Ventana de sonidos',
    'bitacora',
    'Ventana de sonidos',
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
    '0acd0000-0000-4000-8000-000000003281',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Texturas a mano',
    'bitacora',
    'Texturas a mano',
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
    '0acd0000-0000-4000-8000-000000003282',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Mirada que descansa',
    'bitacora',
    'Mirada que descansa',
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
    '0acd0000-0000-4000-8000-000000003283',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Apoyo de los pies',
    'bitacora',
    'Apoyo pies',
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
    '0acd0000-0000-4000-8000-000000003284',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Un objeto cercano',
    'bitacora',
    'Objeto cercano',
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
    '0acd0000-0000-4000-8000-000000003285',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Temperatura del aire',
    'bitacora',
    'Temperatura del aire',
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
    '0acd0000-0000-4000-8000-000000003286',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Orientarme en el lugar',
    'bitacora',
    'Orientarme lugar',
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
    '0acd0000-0000-4000-8000-000000003287',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Una pausa visual',
    'bitacora',
    'Pausa visual',
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
    '0acd0000-0000-4000-8000-000000003288',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Sonido que se aleja',
    'bitacora',
    'Sonido que se',
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
    '0acd0000-0000-4000-8000-000000003289',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Contacto con la silla',
    'bitacora',
    'Contacto silla',
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
    '0acd0000-0000-4000-8000-000000003290',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Una forma en el entorno',
    'bitacora',
    'Forma entorno',
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
    '0acd0000-0000-4000-8000-000000003291',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Pausa entre tareas',
    'bitacora',
    'Pausa entre tareas',
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
    '0acd0000-0000-4000-8000-000000003292',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Un color presente',
    'bitacora',
    'Color presente',
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
    '0acd0000-0000-4000-8000-000000003293',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: La habitación en silencio',
    'bitacora',
    'Habitación en silencio',
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
    '0acd0000-0000-4000-8000-000000003294',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: El peso de un objeto',
    'bitacora',
    'Peso objeto',
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
    '0acd0000-0000-4000-8000-000000003295',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Un punto de apoyo',
    'bitacora',
    'Punto de apoyo',
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
    '0acd0000-0000-4000-8000-000000003296',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Una línea que guía',
    'bitacora',
    'Línea que guía',
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
    '0acd0000-0000-4000-8000-000000003297',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Distancias del lugar',
    'bitacora',
    'Distancias del lugar',
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
    '0acd0000-0000-4000-8000-000000003298',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Manos en reposo',
    'bitacora',
    'Manos en reposo',
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
    '0acd0000-0000-4000-8000-000000003299',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Una cosa estable',
    'bitacora',
    'Cosa estable',
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
    '0acd0000-0000-4000-8000-000000003300',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Un minuto sin tarea',
    'bitacora',
    'Minuto sin tarea',
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
    '0acd0000-0000-4000-8000-000000003301',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Vuelvo a mis sentidos',
    'bitacora',
    'Vuelvo a mis',
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
    '0acd0000-0000-4000-8000-000000003302',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: El borde de un objeto',
    'bitacora',
    'Borde objeto',
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
    '0acd0000-0000-4000-8000-000000003303',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: El entorno por capas',
    'bitacora',
    'Entorno por capas',
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
    '0acd0000-0000-4000-8000-000000003304',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Una pausa en movimiento',
    'bitacora',
    'Pausa en movimiento',
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
    '0acd0000-0000-4000-8000-000000003305',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Una luz del lugar',
    'bitacora',
    'Luz del lugar',
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
    '0acd0000-0000-4000-8000-000000003306',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: La distancia que prefiero',
    'bitacora',
    'Distancia que prefiero',
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
    '0acd0000-0000-4000-8000-000000003307',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Una respiración libre',
    'bitacora',
    'Respiración libre',
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
    '0acd0000-0000-4000-8000-000000003308',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Vuelvo al presente sentado',
    'bitacora',
    'Vuelvo al presente',
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
    '0acd0000-0000-4000-8000-000000003309',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Pausa y presencia: Cerrar la pausa',
    'bitacora',
    'Cerrar la pausa',
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
    '0acd0000-0000-4000-8000-000000003310',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Elegir cómo seguir',
    'bitacora',
    'Elegir cómo seguir',
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
    '0acd0000-0000-4000-8000-000000003311',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Una opción amable',
    'bitacora',
    'Opción amable',
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
    '0acd0000-0000-4000-8000-000000003312',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Cambiar el plan',
    'bitacora',
    'Cambiar el plan',
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
    '0acd0000-0000-4000-8000-000000003313',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Pedir claridad',
    'bitacora',
    'Pedir claridad',
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
    '0acd0000-0000-4000-8000-000000003314',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Un gesto pequeño',
    'bitacora',
    'Gesto pequeño',
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
    '0acd0000-0000-4000-8000-000000003315',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Una respuesta posible',
    'bitacora',
    'Respuesta posible',
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
    '0acd0000-0000-4000-8000-000000003316',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: El siguiente paso',
    'bitacora',
    'Siguiente paso',
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
    '0acd0000-0000-4000-8000-000000003317',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Mi espacio ahora',
    'bitacora',
    'Mi espacio ahora',
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
    '0acd0000-0000-4000-8000-000000003318',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Lo que quiero escuchar',
    'bitacora',
    'Quiero escuchar',
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
    '0acd0000-0000-4000-8000-000000003319',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Mi transición elegida',
    'bitacora',
    'Mi transición elegida',
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
    '0acd0000-0000-4000-8000-000000003320',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Una idea para después',
    'bitacora',
    'Idea para después',
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
    '0acd0000-0000-4000-8000-000000003321',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Cómo cerrar una tarea',
    'bitacora',
    'Cerrar una tarea',
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
    '0acd0000-0000-4000-8000-000000003322',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Un plan flexible',
    'bitacora',
    'Plan flexible',
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
    '0acd0000-0000-4000-8000-000000003323',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Elijo mi compañía',
    'bitacora',
    'Elijo mi compañía',
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
    '0acd0000-0000-4000-8000-000000003324',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Un mensaje pendiente',
    'bitacora',
    'Mensaje pendiente',
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
    '0acd0000-0000-4000-8000-000000003325',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Una pregunta antes de sí',
    'bitacora',
    'Antes de sí',
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
    '0acd0000-0000-4000-8000-000000003326',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Una versión más fácil',
    'bitacora',
    'Versión más fácil',
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
    '0acd0000-0000-4000-8000-000000003327',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Hacer una pausa social',
    'bitacora',
    'Hacer una pausa',
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
    '0acd0000-0000-4000-8000-000000003328',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Un descanso elegido',
    'bitacora',
    'Descanso elegido',
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
    '0acd0000-0000-4000-8000-000000003329',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: La primera prioridad',
    'bitacora',
    'Primera prioridad',
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
    '0acd0000-0000-4000-8000-000000003330',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Un compromiso posible',
    'bitacora',
    'Compromiso posible',
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
    '0acd0000-0000-4000-8000-000000003331',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Cambiar de tema',
    'bitacora',
    'Cambiar de tema',
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
    '0acd0000-0000-4000-8000-000000003332',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Dejar algo sin responder',
    'bitacora',
    'Algo sin responder',
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
    '0acd0000-0000-4000-8000-000000003333',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Un lugar cómodo',
    'bitacora',
    'Lugar cómodo',
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
    '0acd0000-0000-4000-8000-000000003334',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Hacerlo acompañado',
    'bitacora',
    'Hacerlo acompañado',
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
    '0acd0000-0000-4000-8000-000000003335',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Mi manera de agradecer',
    'bitacora',
    'Manera de agradecer',
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
    '0acd0000-0000-4000-8000-000000003336',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Pedir un cambio',
    'bitacora',
    'Pedir un cambio',
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
    '0acd0000-0000-4000-8000-000000003337',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Decir lo que prefiero',
    'bitacora',
    'Decir prefiero',
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
    '0acd0000-0000-4000-8000-000000003338',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Pausar el teléfono',
    'bitacora',
    'Pausar el teléfono',
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
    '0acd0000-0000-4000-8000-000000003339',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Elecciones pequeñas: Terminar a mi ritmo',
    'bitacora',
    'Terminar a mi',
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
    '0acd0000-0000-4000-8000-000000003340',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Mi forma de recibir apoyo',
    'bitacora',
    'Forma de recibir',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003341',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una conversación cómoda',
    'bitacora',
    'Conversación cómoda',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003342',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una invitación ideal',
    'bitacora',
    'Invitación ideal',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003343',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Mi señal de pausa',
    'bitacora',
    'Mi señal',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003344',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una forma de celebrar',
    'bitacora',
    'Forma de celebrar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003345',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una preferencia que cambia',
    'bitacora',
    'Preferencia que cambia',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003346',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Mi espacio para decidir',
    'bitacora',
    'Espacio para decidir',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003347',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una pregunta que me sirve',
    'bitacora',
    'Pregunta que me',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003348',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Un límite que quiero cuidar',
    'bitacora',
    'Límite que quiero',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003349',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: La palabra para pedir tiempo',
    'bitacora',
    'Palabra para pedir',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003350',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Mi manera de decir gracias',
    'bitacora',
    'Manera de decir',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003351',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una conversación que puedo posponer',
    'bitacora',
    'Conversación que puedo',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003352',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Cómo me gusta escuchar',
    'bitacora',
    'Cómo me gusta',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003353',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una frase que me representa',
    'bitacora',
    'Frase que me',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003354',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Lo que prefiero reservar',
    'bitacora',
    'Prefiero reservar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003355',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una forma de pedir claridad',
    'bitacora',
    'Forma de pedir',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003356',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Mi ritmo al responder',
    'bitacora',
    'Ritmo al responder',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003357',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Un plan con alternativas',
    'bitacora',
    'Plan con alternativas',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003358',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: La compañía que prefiero',
    'bitacora',
    'Compañía que prefiero',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003359',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una voz que escucho',
    'bitacora',
    'Voz que escucho',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003360',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Lo que sí quiero compartir',
    'bitacora',
    'Sí quiero compartir',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003361',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Mi manera de cambiar de opinión',
    'bitacora',
    'Manera de cambiar',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003362',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Un espacio propio',
    'bitacora',
    'Espacio propio',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003363',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una petición sencilla',
    'bitacora',
    'Petición sencilla',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003364',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Un acuerdo flexible',
    'bitacora',
    'Acuerdo flexible',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003365',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Mi señal de comodidad',
    'bitacora',
    'Señal de comodidad',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000003366',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Emociones'),
    'Preferencias y expresión: Una elección sin testigos',
    'bitacora',
    'Elección sin testigos',
    TRUE,
    'sin_puntaje',
    NULL,
    NULL,
    NULL,
    'rotativa',
    'escritura_breve',
    NULL
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Sus sesiones (357)
-- ---------------------------------------------------------------------------

-- EMO-10 · Matices del ánimo: El color del momento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510310-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000310',
    'El color del momento',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"El color del momento","texto":"Elige en la rueda una emoción que se acerque a este instante, aunque no sea exacta."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-11 · Matices del ánimo: Una palabra más precisa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510311-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000311',
    'Una palabra más precisa',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Una palabra más precisa","texto":"Busca un matiz más específico que la primera palabra que te vino."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-12 · Matices del ánimo: Entre dos nombres: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510312-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000312',
    'Entre dos nombres',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Entre dos nombres","texto":"Compara dos emociones cercanas en la rueda y elige la que hoy se aproxima más."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-13 · Matices del ánimo: Lo que no sé nombrar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510313-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000313',
    'Lo que no sé nombrar',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Lo que no sé nombrar","texto":"Explora la rueda sin obligación de escoger; puedes dejarlo sin nombre."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-14 · Matices del ánimo: Un matiz inesperado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510314-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000314',
    'Un matiz inesperado',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Un matiz inesperado","texto":"Recorre una familia que casi nunca eliges y mira si alguna palabra te sirve."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-15 · Matices del ánimo: La emoción de fondo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510315-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000315',
    'La emoción de fondo',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La emoción de fondo","texto":"Elige una emoción suave que acompañe el momento, incluso si otra se nota más."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-16 · Matices del ánimo: La emoción más visible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510316-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000316',
    'La emoción más visible',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La emoción más visible","texto":"Señala el matiz que ocupa más espacio ahora, o pasa si no quieres elegir."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-17 · Matices del ánimo: Una mezcla posible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510317-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000317',
    'Una mezcla posible',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Una mezcla posible","texto":"Busca dos matices que puedan convivir hoy; no hace falta resolver la mezcla."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-18 · Matices del ánimo: Cerca de la calma: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510318-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000318',
    'Cerca de la calma',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Cerca de la calma","texto":"Explora qué palabra queda cerca de la calma para ti, sin perseguirla."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-19 · Matices del ánimo: Cerca de la curiosidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510319-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000319',
    'Cerca de la curiosidad',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Cerca de la curiosidad","texto":"Mira los matices vecinos de la curiosidad y escoge uno solo si te representa."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-20 · Matices del ánimo: La emoción pequeña: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510320-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000320',
    'La emoción pequeña',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La emoción pequeña","texto":"Busca una emoción de baja intensidad que normalmente podría pasar desapercibida."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-21 · Matices del ánimo: Una emoción amplia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510321-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000321',
    'Una emoción amplia',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Una emoción amplia","texto":"Elige una familia general y observa cuál de sus matices te llama la atención."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-22 · Matices del ánimo: La palabra de hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510322-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000322',
    'La palabra de hoy',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La palabra de hoy","texto":"Quédate con una palabra de la rueda que describa el día sin resumirlo todo."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-23 · Matices del ánimo: Un matiz corporal: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510323-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000323',
    'Un matiz corporal',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Un matiz corporal","texto":"Elige una palabra emocional y nota si te evoca alguna sensación, sin interpretarla."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-24 · Matices del ánimo: La emoción que cambia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510324-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000324',
    'La emoción que cambia',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La emoción que cambia","texto":"Compara dos matices y escoge cuál describe mejor el momento presente."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-25 · Matices del ánimo: Una emoción neutral: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510325-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000325',
    'Una emoción neutral',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Una emoción neutral","texto":"Explora la neutralidad y decide si alguna palabra cercana te resulta útil hoy."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-26 · Matices del ánimo: El matiz difícil: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510326-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000326',
    'El matiz difícil',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"El matiz difícil","texto":"Busca una emoción que cueste decir en voz alta; también puedes no elegir ninguna."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-27 · Matices del ánimo: La emoción de una escena: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510327-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000327',
    'La emoción de una escena',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La emoción de una escena","texto":"Piensa en una escena cotidiana y elige en la rueda un matiz que podría aparecer."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-28 · Matices del ánimo: Un nombre prestado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510328-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000328',
    'Un nombre prestado',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Un nombre prestado","texto":"Prueba una palabra nueva de la rueda y decide si te sirve o la dejas pasar."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-29 · Matices del ánimo: Emoción sin explicación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510329-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000329',
    'Emoción sin explicación',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Emoción sin explicación","texto":"Elige un matiz sin buscar la causa ni convertirlo en una conclusión."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-30 · Matices del ánimo: La palabra que falta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510330-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000330',
    'La palabra que falta',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La palabra que falta","texto":"Recorre la rueda pensando en una sensación sin nombre y mira qué palabra se aproxima."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-31 · Matices del ánimo: Dos emociones a la vez: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510331-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000331',
    'Dos emociones a la vez',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Dos emociones a la vez","texto":"Marca dos matices que puedan estar juntos, sin escoger cuál debería ganar."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-32 · Matices del ánimo: El matiz que acompaña: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510332-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000332',
    'El matiz que acompaña',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"El matiz que acompaña","texto":"Busca una emoción secundaria que esté junto a la más evidente, si la hay."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-33 · Matices del ánimo: Emoción y energía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510333-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000333',
    'Emoción y energía',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Emoción y energía","texto":"Elige un matiz y observa si se siente más quieto o más activo para ti."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-34 · Matices del ánimo: Lo que sí aparece: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510334-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000334',
    'Lo que sí aparece',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Lo que sí aparece","texto":"Escoge una emoción presente, aunque sea tenue o distinta de la esperada."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-35 · Matices del ánimo: Un matiz de alivio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510335-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000335',
    'Un matiz de alivio',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Un matiz de alivio","texto":"Mira la zona del alivio y decide si alguna palabra cercana encaja contigo hoy."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-36 · Matices del ánimo: Una emoción sin etiqueta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510336-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000336',
    'Una emoción sin etiqueta',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Una emoción sin etiqueta","texto":"Navega por la rueda sin escoger; nota qué nombres te resultan familiares."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-37 · Matices del ánimo: El matiz de una pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510337-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000337',
    'El matiz de una pausa',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"El matiz de una pausa","texto":"Piensa en una pausa reciente y busca una palabra que la acompañe."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-38 · Matices del ánimo: La emoción que se mueve: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510338-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000338',
    'La emoción que se mueve',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"La emoción que se mueve","texto":"Elige un matiz que haya cambiado durante el día, sin medir cuánto."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-39 · Matices del ánimo: Un cierre con nombre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510339-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000339',
    'Un cierre con nombre',
    1,
    '{"modo":"rueda","indicacion":"Elige un matiz si te sirve; también puedes dejar la rueda sin respuesta.","puerta":{"titulo":"Un cierre con nombre","texto":"Escoge una emoción para cerrar este minuto o déjala sin nombrar."},"rueda":[{"clave":"alegria","nombre":"Alegría","hijos":[{"clave":"m-contento","nombre":"Contento","hijos":[{"clave":"e-contento","nombre":"Contento","definicion":"Estar bien con lo que pasa ahora."},{"clave":"e-satisfaccion","nombre":"Satisfacción","definicion":"Sentir que algo salió como esperabas o mejor."},{"clave":"e-bienestar","nombre":"Bienestar","definicion":"Sentir que, por ahora, las cosas están bien."}]},{"clave":"m-entusiasmo","nombre":"Entusiasmo","hijos":[{"clave":"e-entusiasmo","nombre":"Entusiasmo","definicion":"Ganas de que algo empiece."},{"clave":"e-ilusion","nombre":"Ilusión","definicion":"Esperar algo con cariño."},{"clave":"e-animo","nombre":"Ánimo","definicion":"Sentir fuerza para hacer algo."}]},{"clave":"m-gratitud","nombre":"Gratitud","hijos":[{"clave":"e-gratitud","nombre":"Gratitud","definicion":"Valorar lo que alguien o algo te dio."},{"clave":"e-alivio","nombre":"Alivio","definicion":"Sentir que algo pesado ya pasó."},{"clave":"e-carino","nombre":"Cariño","definicion":"Sentir afecto por alguien."}]},{"clave":"m-diversion","nombre":"Diversión","hijos":[{"clave":"e-diversion","nombre":"Diversión","definicion":"Pasarla bien, reírte."},{"clave":"e-ganas-de-jugar","nombre":"Ganas de jugar","definicion":"Querer jugar sin ningún objetivo."},{"clave":"e-ligereza","nombre":"Ligereza","definicion":"Sentir que las cosas pesan poco."}]},{"clave":"m-orgullo","nombre":"Orgullo","hijos":[{"clave":"e-orgullo","nombre":"Orgullo","definicion":"Valorar algo que hiciste o lograste."},{"clave":"e-logro","nombre":"Logro","definicion":"Sentir que terminaste algo que querías."},{"clave":"e-valoracion","nombre":"Valoración","definicion":"Reconocer lo que vales o lo que haces."}]}]},{"clave":"tristeza","nombre":"Tristeza","hijos":[{"clave":"m-desanimo","nombre":"Desánimo","hijos":[{"clave":"e-desanimo","nombre":"Desánimo","definicion":"Sentir pocas ganas de hacer cosas."},{"clave":"e-cansancio-por-dent","nombre":"Cansancio por dentro","definicion":"Sentirte sin energía, aunque hayas descansado."},{"clave":"e-desgano","nombre":"Desgano","definicion":"No tener ganas de nada en particular."}]},{"clave":"m-pena","nombre":"Pena","hijos":[{"clave":"e-pena","nombre":"Pena","definicion":"Sentir dolor por algo que pasó."},{"clave":"e-nostalgia","nombre":"Nostalgia","definicion":"Extrañar algo o a alguien del pasado."},{"clave":"e-anoranza","nombre":"Añoranza","definicion":"Querer volver a algo que ya no está."}]},{"clave":"m-soledad","nombre":"Soledad","hijos":[{"clave":"e-soledad","nombre":"Soledad","definicion":"Sentir que falta compañía."},{"clave":"e-vacio","nombre":"Vacío","definicion":"Sentir que algo falta y no saber qué."},{"clave":"e-lejania","nombre":"Lejanía","definicion":"Sentir que estás lejos de los demás."}]},{"clave":"m-decepcion","nombre":"Decepción","hijos":[{"clave":"e-decepcion","nombre":"Decepción","definicion":"Sentir que algo no fue lo que esperabas."},{"clave":"e-desilusion","nombre":"Desilusión","definicion":"Perder una ilusión que tenías."},{"clave":"e-resignacion","nombre":"Resignación","definicion":"Aceptar algo con pena."}]},{"clave":"m-melancolia","nombre":"Melancolía","hijos":[{"clave":"e-melancolia","nombre":"Melancolía","definicion":"Una tristeza suave y pensativa."},{"clave":"e-desconsuelo","nombre":"Desconsuelo","definicion":"Mucha pena y pocas ganas de seguir."},{"clave":"e-recuerdo-querido","nombre":"Recuerdo querido","definicion":"Un recuerdo que duele un poco y también se quiere."}]}]},{"clave":"miedo","nombre":"Miedo","hijos":[{"clave":"m-inquietud","nombre":"Inquietud","hijos":[{"clave":"e-inquietud","nombre":"Inquietud","definicion":"Sentir que algo podría pasar y no saber qué."},{"clave":"e-nervios","nombre":"Nervios","definicion":"Sentir el cuerpo agitado antes de algo."},{"clave":"e-preocupacion","nombre":"Preocupación","definicion":"Darle vueltas a algo que podría salir mal."}]},{"clave":"m-temor","nombre":"Temor","hijos":[{"clave":"e-temor","nombre":"Temor","definicion":"Sentir que algo te puede hacer daño."},{"clave":"e-susto","nombre":"Susto","definicion":"Una reacción rápida ante algo inesperado."},{"clave":"e-recelo","nombre":"Recelo","definicion":"No confiar del todo en algo."}]},{"clave":"m-inseguridad","nombre":"Inseguridad","hijos":[{"clave":"e-inseguridad","nombre":"Inseguridad","definicion":"Dudar de ti o de lo que haces."},{"clave":"e-verguenza","nombre":"Vergüenza","definicion":"Sentir que los demás te miran con juicio."},{"clave":"e-timidez","nombre":"Timidez","definicion":"Sentir un freno para mostrarte."}]},{"clave":"m-agobio","nombre":"Agobio","hijos":[{"clave":"e-agobio","nombre":"Agobio","definicion":"Sentir que son demasiadas cosas a la vez."},{"clave":"e-presion","nombre":"Presión","definicion":"Sentir que se espera algo de ti."},{"clave":"e-bloqueo","nombre":"Bloqueo","definicion":"No saber por dónde empezar."}]},{"clave":"m-incertidumbre","nombre":"Incertidumbre","hijos":[{"clave":"e-incertidumbre","nombre":"Incertidumbre","definicion":"No saber qué va a pasar."},{"clave":"e-duda","nombre":"Duda","definicion":"No tener claro qué hacer."},{"clave":"e-confusion","nombre":"Confusión","definicion":"Sentir que las ideas están revueltas."}]}]},{"clave":"enojo","nombre":"Enojo","hijos":[{"clave":"m-irritacion","nombre":"Irritación","hijos":[{"clave":"e-irritacion","nombre":"Irritación","definicion":"Sentir que algo te molesta una y otra vez."},{"clave":"e-fastidio","nombre":"Fastidio","definicion":"Sentir que algo es pesado de aguantar."},{"clave":"e-impaciencia","nombre":"Impaciencia","definicion":"Querer que algo pase más rápido."}]},{"clave":"m-rabia","nombre":"Rabia","hijos":[{"clave":"e-rabia","nombre":"Rabia","definicion":"Sentir mucha fuerza por algo que te pareció injusto."},{"clave":"e-indignacion","nombre":"Indignación","definicion":"Enojo por algo que consideras injusto."},{"clave":"e-resentimiento","nombre":"Resentimiento","definicion":"Guardar molestia por algo del pasado."}]},{"clave":"m-frustracion","nombre":"Frustración","hijos":[{"clave":"e-frustracion","nombre":"Frustración","definicion":"Querer algo y no poder lograrlo."},{"clave":"e-impotencia","nombre":"Impotencia","definicion":"Sentir que no puedes cambiar algo."},{"clave":"e-hartazgo","nombre":"Hartazgo","definicion":"Sentir que ya es demasiado de lo mismo."}]},{"clave":"m-celos-y-envidia","nombre":"Celos y envidia","hijos":[{"clave":"e-celos","nombre":"Celos","definicion":"Temer perder algo o a alguien."},{"clave":"e-envidia","nombre":"Envidia","definicion":"Querer lo que otra persona tiene."},{"clave":"e-rivalidad","nombre":"Rivalidad","definicion":"Sentirte en competencia."}]},{"clave":"m-desacuerdo","nombre":"Desacuerdo","hijos":[{"clave":"e-desacuerdo","nombre":"Desacuerdo","definicion":"No estar de acuerdo con algo."},{"clave":"e-molestia","nombre":"Molestia","definicion":"Algo no te cayó bien."},{"clave":"e-terquedad","nombre":"Terquedad","definicion":"Querer sostener tu idea."}]}]},{"clave":"calma","nombre":"Calma","hijos":[{"clave":"m-tranquilidad","nombre":"Tranquilidad","hijos":[{"clave":"e-tranquilidad","nombre":"Tranquilidad","definicion":"Sentir que todo está en su sitio."},{"clave":"e-serenidad","nombre":"Serenidad","definicion":"Estar en calma incluso con ruido alrededor."},{"clave":"e-descanso","nombre":"Descanso","definicion":"Sentir que el cuerpo y la mente pueden parar."}]},{"clave":"m-seguridad","nombre":"Seguridad","hijos":[{"clave":"e-seguridad","nombre":"Seguridad","definicion":"Sentir que puedes con lo que viene."},{"clave":"e-confianza","nombre":"Confianza","definicion":"Creer en ti o en alguien."},{"clave":"e-firmeza","nombre":"Firmeza","definicion":"Saber lo que quieres hacer."}]},{"clave":"m-presente","nombre":"Presente","hijos":[{"clave":"e-atencion","nombre":"Atención","definicion":"Estar en lo que haces, sin distraerte."},{"clave":"e-curiosidad","nombre":"Curiosidad","definicion":"Querer saber o explorar algo."},{"clave":"e-interes","nombre":"Interés","definicion":"Que algo te llame la atención."}]},{"clave":"m-conexion","nombre":"Conexión","hijos":[{"clave":"e-compania","nombre":"Compañía","definicion":"Sentir que alguien está contigo."},{"clave":"e-pertenencia","nombre":"Pertenencia","definicion":"Sentir que formas parte de un grupo."},{"clave":"e-ternura","nombre":"Ternura","definicion":"Sentir un cuidado suave hacia algo o alguien."}]},{"clave":"m-aceptacion","nombre":"Aceptación","hijos":[{"clave":"e-aceptacion","nombre":"Aceptación","definicion":"Dejar que algo sea como es."},{"clave":"e-paciencia","nombre":"Paciencia","definicion":"Poder esperar sin molestia."},{"clave":"e-equilibrio","nombre":"Equilibrio","definicion":"Sentir que tus cosas están parejas."}]}]},{"clave":"sorpresa-y-lo-difici","nombre":"Sorpresa y lo difícil de nombrar","hijos":[{"clave":"m-asombro","nombre":"Asombro","hijos":[{"clave":"e-asombro","nombre":"Asombro","definicion":"Quedarte mirando algo que te impresiona."},{"clave":"e-admiracion","nombre":"Admiración","definicion":"Valorar mucho algo o a alguien."},{"clave":"e-maravilla","nombre":"Maravilla","definicion":"Sentir que algo es muy bonito o muy grande."}]},{"clave":"m-desconcierto","nombre":"Desconcierto","hijos":[{"clave":"e-desconcierto","nombre":"Desconcierto","definicion":"No saber cómo reaccionar."},{"clave":"e-extraneza","nombre":"Extrañeza","definicion":"Sentir que algo no encaja."},{"clave":"e-perplejidad","nombre":"Perplejidad","definicion":"Quedarte sin palabras."}]},{"clave":"m-mezcla","nombre":"Mezcla","hijos":[{"clave":"e-emociones-mezclada","nombre":"Emociones mezcladas","definicion":"Sentir varias cosas a la vez."},{"clave":"e-ambivalencia","nombre":"Ambivalencia","definicion":"Querer y no querer algo a la vez."},{"clave":"e-agridulce","nombre":"Agridulce","definicion":"Alegría y tristeza juntas."}]},{"clave":"m-sin-nombre","nombre":"Sin nombre","hijos":[{"clave":"e-sin-palabras","nombre":"Sin palabras","definicion":"Sentir algo que todavía no sabes nombrar."},{"clave":"e-neutralidad","nombre":"Neutralidad","definicion":"No sentir nada en particular."},{"clave":"e-cambio","nombre":"Cambio","definicion":"Sentir que algo se está moviendo."}]},{"clave":"m-energia","nombre":"Energía","hijos":[{"clave":"e-energia-alta","nombre":"Energía alta","definicion":"Mucho movimiento por dentro."},{"clave":"e-energia-baja","nombre":"Energía baja","definicion":"Poco movimiento por dentro."},{"clave":"e-quietud","nombre":"Quietud","definicion":"Mucha calma y poco movimiento."}]}]}],"linea":{"invitacion":"Si quieres, cuéntalo en una línea.","largoMaximo":200},"cierre":"Gracias por tomarte este momento."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-40 · Señales que noto: Mapa de señales: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510340-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000340',
    'Mapa de señales',
    1,
    '{"modo":"lista","indicacion":"Marca qué notas ahora: una sensación, un pensamiento, una acción o ninguna de ellas.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-41 · Señales que noto: Ritmo interior: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510341-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000341',
    'Ritmo interior',
    1,
    '{"modo":"lista","indicacion":"Identifica si tu ritmo de este momento se siente pausado, cambiante o difícil de distinguir.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-42 · Señales que noto: El primer aviso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510342-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000342',
    'El primer aviso',
    1,
    '{"modo":"lista","indicacion":"Elige una señal temprana que te avisa que algo se está moviendo por dentro.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-43 · Señales que noto: Señal de descanso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510343-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000343',
    'Señal de descanso',
    1,
    '{"modo":"lista","indicacion":"Marca qué gesto suele mostrarte que necesitas una pausa, sin convertirlo en una obligación.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-44 · Señales que noto: Señal de interés: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510344-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000344',
    'Señal de interés',
    1,
    '{"modo":"lista","indicacion":"Reconoce cómo se manifiesta la curiosidad en ti: pregunta, mirada, movimiento u otra forma.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-45 · Señales que noto: Señal de incomodidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510345-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000345',
    'Señal de incomodidad',
    1,
    '{"modo":"lista","indicacion":"Escoge una señal que te ayuda a notar incomodidad y una opción para hacer una pausa.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-46 · Señales que noto: Señal de conexión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510346-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000346',
    'Señal de conexión',
    1,
    '{"modo":"lista","indicacion":"Marca qué te hace notar que estás a gusto con alguien, si aparece alguna señal.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-47 · Señales que noto: Señal de distancia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510347-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000347',
    'Señal de distancia',
    1,
    '{"modo":"lista","indicacion":"Identifica una señal de que quieres más espacio; puedes dejar la lista vacía.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-48 · Señales que noto: Un cambio de energía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510348-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000348',
    'Un cambio de energía',
    1,
    '{"modo":"lista","indicacion":"Selecciona qué suele cambiar primero cuando varía tu energía: cuerpo, voz, atención o ganas.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-49 · Señales que noto: La señal de curiosidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510349-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000349',
    'La señal de curiosidad',
    1,
    '{"modo":"lista","indicacion":"Marca qué haces cuando algo despierta tu interés, sin juzgar si es suficiente.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-50 · Señales que noto: Tono de voz propio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510350-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000350',
    'Tono de voz propio',
    1,
    '{"modo":"lista","indicacion":"Nota si tu voz se siente hoy suave, firme, rápida, callada o de otra manera.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-51 · Señales que noto: La postura del momento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510351-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000351',
    'La postura del momento',
    1,
    '{"modo":"lista","indicacion":"Observa una postura que tienes ahora y elige si quieres mantenerla o cambiarla.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-52 · Señales que noto: Lo que pide atención: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510352-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000352',
    'Lo que pide atención',
    1,
    '{"modo":"lista","indicacion":"Marca una señal que te indique dónde está puesta tu atención en este momento.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-53 · Señales que noto: Señal de incertidumbre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510353-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000353',
    'Señal de incertidumbre',
    1,
    '{"modo":"lista","indicacion":"Elige cómo notas la incertidumbre: preguntas, quietud, búsqueda de información u otra opción.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-54 · Señales que noto: Señal de entusiasmo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510354-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000354',
    'Señal de entusiasmo',
    1,
    '{"modo":"lista","indicacion":"Reconoce una señal personal de entusiasmo, aunque sea pequeña o poco visible.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-55 · Señales que noto: Señal de fastidio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510355-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000355',
    'Señal de fastidio',
    1,
    '{"modo":"lista","indicacion":"Marca qué notas cuando algo te fastidia y qué distancia te resulta cómoda.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-56 · Señales que noto: La señal de alivio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510356-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000356',
    'La señal de alivio',
    1,
    '{"modo":"lista","indicacion":"Identifica cómo notas el alivio cuando llega, sin esperar que tenga una forma concreta.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-57 · Señales que noto: Señal de saturación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510357-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000357',
    'Señal de saturación',
    1,
    '{"modo":"lista","indicacion":"Elige qué te muestra que hay demasiados estímulos y cuál puedes pausar primero.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-58 · Señales que noto: Un momento de quietud: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510358-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000358',
    'Un momento de quietud',
    1,
    '{"modo":"lista","indicacion":"Marca si hoy hubo un instante de quietud; también vale no recordar ninguno.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-59 · Señales que noto: Señal de confianza: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510359-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000359',
    'Señal de confianza',
    1,
    '{"modo":"lista","indicacion":"Selecciona un gesto propio que aparece cuando te sientes en confianza.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-60 · Señales que noto: Señal de duda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510360-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000360',
    'Señal de duda',
    1,
    '{"modo":"lista","indicacion":"Reconoce cómo se nota una duda en ti y si necesitas tiempo antes de decidir.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-61 · Señales que noto: Señal de cansancio emocional: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510361-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000361',
    'Señal de cansancio emocional',
    1,
    '{"modo":"lista","indicacion":"Marca una pista que te invita a bajar el ritmo; no tienes que hacer nada con ella ahora.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-62 · Señales que noto: Señal de alegría tranquila: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510362-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000362',
    'Señal de alegría tranquila',
    1,
    '{"modo":"lista","indicacion":"Encuentra una forma discreta en que se asoma el disfrute en tu día.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-63 · Señales que noto: Señal de necesidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510363-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000363',
    'Señal de necesidad',
    1,
    '{"modo":"lista","indicacion":"Elige qué pista te ayuda a notar una necesidad: sensación, pensamiento, límite o petición.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-64 · Señales que noto: Señal de pausa social: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510364-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000364',
    'Señal de pausa social',
    1,
    '{"modo":"lista","indicacion":"Identifica cuándo una conversación te pide silencio, cambio de tema o un descanso.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-65 · Señales que noto: La emoción en las manos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510365-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000365',
    'La emoción en las manos',
    1,
    '{"modo":"lista","indicacion":"Nota cómo están tus manos y elige si esa sensación te resulta cómoda, neutra o distinta.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-66 · Señales que noto: La emoción en el rostro: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510366-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000366',
    'La emoción en el rostro',
    1,
    '{"modo":"lista","indicacion":"Observa tu expresión sin corregirla y elige una palabra que describa el gesto.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-67 · Señales que noto: Una señal de seguridad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510367-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000367',
    'Una señal de seguridad',
    1,
    '{"modo":"lista","indicacion":"Marca qué detalle del entorno te ayuda a sentirte más cómodo ahora, si lo hay.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-68 · Señales que noto: Señal de cambio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510368-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000368',
    'Señal de cambio',
    1,
    '{"modo":"lista","indicacion":"Escoge una pista que te muestre que tu estado actual no es exactamente igual al de antes.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-69 · Señales que noto: Lo que prefiero no notar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510369-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000369',
    'Lo que prefiero no notar',
    1,
    '{"modo":"lista","indicacion":"Elige qué señal puedes dejar para otro momento y cierra la lista cuando quieras.","items":[{"clave":"opcion-1","texto":"Una sensación física"},{"clave":"opcion-2","texto":"Un pensamiento o palabra"},{"clave":"opcion-3","texto":"Un gesto o impulso"},{"clave":"opcion-4","texto":"Prefiero pasar"}],"cierre":"Puedes marcar una, varias o ninguna."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-70 · Escenas cotidianas: Un mensaje sin respuesta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510370-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000370',
    'Un mensaje sin respuesta',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"En una escena imaginaria, alguien no recibe respuesta a un mensaje. ¿Qué emociones podrían aparecer, sin adivinar una sola?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-71 · Escenas cotidianas: Un plan que cambia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510371-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000371',
    'Un plan que cambia',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una salida se aplaza por lluvia. ¿Qué respuestas emocionales distintas podrían ser válidas?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-72 · Escenas cotidianas: Una invitación inesperada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510372-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000372',
    'Una invitación inesperada',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien recibe una invitación para mañana. ¿Qué podría sentir antes de decidir?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-73 · Escenas cotidianas: Una tarea terminada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510373-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000373',
    'Una tarea terminada',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona termina algo que le tomó tiempo. ¿Qué matices podrían acompañar ese cierre?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-74 · Escenas cotidianas: Un elogio en público: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510374-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000374',
    'Un elogio en público',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien recibe un elogio frente a otras personas. ¿Qué reacciones diferentes podría tener?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-75 · Escenas cotidianas: Una espera larga: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510375-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000375',
    'Una espera larga',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una fila avanza despacio. ¿Qué podría notar la persona además de impaciencia?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-76 · Escenas cotidianas: La charla por empezar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510376-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000376',
    'La charla por empezar',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Dos personas deben hablar de un desacuerdo. ¿Qué emociones podrían coexistir antes de hablar?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-77 · Escenas cotidianas: Una noticia ambigua: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510377-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000377',
    'Una noticia ambigua',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Llega una noticia que no queda del todo clara. ¿Qué respuesta emocional podría aparecer primero?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-78 · Escenas cotidianas: Un día con poco ruido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510378-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000378',
    'Un día con poco ruido',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona pasa un rato en silencio. ¿Qué podría sentir además de tranquilidad?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-79 · Escenas cotidianas: Una despedida breve: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510379-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000379',
    'Una despedida breve',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien se despide por un tiempo. ¿Qué matices podrían acompañar el momento?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-80 · Escenas cotidianas: Una meta compartida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510380-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000380',
    'Una meta compartida',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Un grupo acuerda un objetivo. ¿Qué emociones distintas pueden aparecer entre sus integrantes?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-81 · Escenas cotidianas: Un error pequeño: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510381-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000381',
    'Un error pequeño',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien se equivoca en un detalle y lo corrige. ¿Qué podría sentir durante el proceso?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-82 · Escenas cotidianas: Una visita sorpresa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510382-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000382',
    'Una visita sorpresa',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Llega una visita sin aviso. ¿Qué respuestas posibles tendría quien abre la puerta?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-83 · Escenas cotidianas: Un recuerdo que aparece: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510383-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000383',
    'Un recuerdo que aparece',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una canción trae un recuerdo. ¿Qué emociones distintas podrían venir juntas?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-84 · Escenas cotidianas: Una decisión aplazada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510384-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000384',
    'Una decisión aplazada',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona decide esperar antes de responder. ¿Qué podría sentir mientras se da ese tiempo?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-85 · Escenas cotidianas: Un lugar conocido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510385-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000385',
    'Un lugar conocido',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien vuelve a un sitio familiar después de mucho tiempo. ¿Qué matices podrían aparecer?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-86 · Escenas cotidianas: Un favor que cuesta pedir: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510386-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000386',
    'Un favor que cuesta pedir',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona necesita ayuda con una tarea. ¿Qué puede sentir antes de hacer la petición?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-87 · Escenas cotidianas: Una opinión diferente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510387-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000387',
    'Una opinión diferente',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"En una conversación aparece un punto de vista distinto. ¿Qué respuestas emocionales podrían ser compatibles?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-88 · Escenas cotidianas: Una pausa en el trabajo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510388-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000388',
    'Una pausa en el trabajo',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien deja una tarea por unos minutos. ¿Qué podría notar al cambiar de ritmo?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-89 · Escenas cotidianas: Una despedida de un objeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510389-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000389',
    'Una despedida de un objeto',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona guarda un objeto querido. ¿Qué emociones variadas podría despertar ese gesto?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-90 · Escenas cotidianas: Una puerta que se abre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510390-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000390',
    'Una puerta que se abre',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien empieza una actividad nueva sin saber cómo saldrá. ¿Qué podría sentir al comenzar?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-91 · Escenas cotidianas: Un logro ajeno: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510391-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000391',
    'Un logro ajeno',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una amistad cuenta algo que logró. ¿Qué emociones pueden convivir al escuchar la noticia?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-92 · Escenas cotidianas: Una pregunta difícil: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510392-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000392',
    'Una pregunta difícil',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"En una reunión alguien recibe una pregunta inesperada. ¿Qué podría notar antes de responder?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-93 · Escenas cotidianas: Una tarde sin planes: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510393-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000393',
    'Una tarde sin planes',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona tiene una tarde libre. ¿Qué emociones podrían aparecer ante el espacio abierto?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-94 · Escenas cotidianas: Un cambio de horario: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510394-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000394',
    'Un cambio de horario',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una cita cambia de hora el mismo día. ¿Qué respuestas diferentes podrían ser razonables?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-95 · Escenas cotidianas: Una conversación que termina: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510395-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000395',
    'Una conversación que termina',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien cierra una charla importante. ¿Qué puede quedar después, además de alivio?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-96 · Escenas cotidianas: Una sorpresa agradable: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510396-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000396',
    'Una sorpresa agradable',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona encuentra un detalle que no esperaba. ¿Qué matices podrían acompañar la sorpresa?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-97 · Escenas cotidianas: Una opinión propia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510397-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000397',
    'Una opinión propia',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien comparte una preferencia y otra persona no coincide. ¿Qué podría sentir cada quien?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-98 · Escenas cotidianas: Un objeto perdido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510398-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000398',
    'Un objeto perdido',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Una persona no encuentra sus llaves y luego aparecen. ¿Qué emociones pueden cambiar durante la búsqueda?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-99 · Escenas cotidianas: Un primer intento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510399-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000399',
    'Un primer intento',
    1,
    '{"modo":"preguntas","indicacion":"No hay respuestas correctas. Elige una o pasa.","preguntas":[{"clave":"eleccion","texto":"Alguien prueba una habilidad por primera vez. ¿Qué emociones podrían estar presentes al mismo tiempo?","tipo":"opcion","opciones":[{"clave":"primera","texto":"Podrían aparecer varias"},{"clave":"segunda","texto":"Depende de cada persona"},{"clave":"paso","texto":"Prefiero pasar"}]}],"enlaceAlAviso":false,"cierre":"Tu respuesta no necesita explicación."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-100 · Palabras propias: Una frase para el ánimo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503100-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003100',
    'Una frase para el ánimo',
    1,
    '{"modo":"escritura","invitacion":"Completa a tu manera: «Ahora mismo, por dentro se parece a…». Puedes dejarlo vacío.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-101 · Palabras propias: Lo que me gustaría decir: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503101-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003101',
    'Lo que me gustaría decir',
    1,
    '{"modo":"escritura","invitacion":"Escribe una frase que exprese algo que hoy te cuesta poner en palabras. No tienes que compartirla.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-102 · Palabras propias: Un nombre provisional: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503102-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003102',
    'Un nombre provisional',
    1,
    '{"modo":"escritura","invitacion":"Ponle un nombre temporal a lo que sientes, sabiendo que puedes cambiarlo después.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-103 · Palabras propias: La emoción como clima: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503103-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003103',
    'La emoción como clima',
    1,
    '{"modo":"escritura","invitacion":"Describe tu momento con una imagen del clima, sin explicar por qué.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-104 · Palabras propias: Un color sin significado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503104-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003104',
    'Un color sin significado',
    1,
    '{"modo":"escritura","invitacion":"Elige un color para este instante y escribe una palabra sobre él. No hace falta interpretarlo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-105 · Palabras propias: Una nota sin destinatario: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503105-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003105',
    'Una nota sin destinatario',
    1,
    '{"modo":"escritura","invitacion":"Escribe una nota breve sobre una emoción que pasó por tu día. Puedes borrarla al terminar.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-106 · Palabras propias: Una pregunta amable: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503106-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003106',
    'Una pregunta amable',
    1,
    '{"modo":"escritura","invitacion":"Anota una pregunta que te gustaría hacerte con curiosidad, sin exigir una respuesta.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-107 · Palabras propias: Un título para hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503107-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003107',
    'Un título para hoy',
    1,
    '{"modo":"escritura","invitacion":"Ponle un título corto al momento que estás viviendo ahora.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-108 · Palabras propias: Lo que no voy a resolver: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503108-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003108',
    'Lo que no voy a resolver',
    1,
    '{"modo":"escritura","invitacion":"Escribe una cosa que puedes dejar sin resolver durante este minuto.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-109 · Palabras propias: La palabra más cercana: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503109-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003109',
    'La palabra más cercana',
    1,
    '{"modo":"escritura","invitacion":"Anota una palabra que se acerque a tu estado, aunque no lo describa del todo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-110 · Palabras propias: Una frase de permiso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503110-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003110',
    'Una frase de permiso',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Hoy puedo permitirme…». La respuesta puede ser «nada por ahora».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-111 · Palabras propias: Un borde claro: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503111-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003111',
    'Un borde claro',
    1,
    '{"modo":"escritura","invitacion":"Escribe una frase que te ayude a expresar un límite sin explicar más de lo que quieres.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-112 · Palabras propias: Una emoción en tres palabras: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503112-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003112',
    'Una emoción en tres palabras',
    1,
    '{"modo":"escritura","invitacion":"Describe el momento usando hasta tres palabras, sin buscar que suene bonito.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-113 · Palabras propias: Una respuesta que espero: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503113-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003113',
    'Una respuesta que espero',
    1,
    '{"modo":"escritura","invitacion":"Escribe qué te gustaría escuchar de alguien, sin obligación de pedirlo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-114 · Palabras propias: Lo que quiero conservar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503114-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003114',
    'Lo que quiero conservar',
    1,
    '{"modo":"escritura","invitacion":"Anota un detalle de hoy que quieras recordar, aunque sea pequeño o neutro.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-115 · Palabras propias: Una frase para una pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503115-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003115',
    'Una frase para una pausa',
    1,
    '{"modo":"escritura","invitacion":"Escribe una frase breve que puedas usar para pedir un momento antes de responder.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-116 · Palabras propias: Algo que cambió: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503116-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003116',
    'Algo que cambió',
    1,
    '{"modo":"escritura","invitacion":"Cuenta en una línea qué cambió en tu ánimo desde la mañana, si lo sabes.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-117 · Palabras propias: Algo que sigue igual: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503117-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003117',
    'Algo que sigue igual',
    1,
    '{"modo":"escritura","invitacion":"Nombra una sensación o idea que se ha mantenido hoy, sin calificarla.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-118 · Palabras propias: La emoción y su volumen: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503118-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003118',
    'La emoción y su volumen',
    1,
    '{"modo":"escritura","invitacion":"Escribe si lo que sientes está bajo, medio, alto o sin volumen claro.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-119 · Palabras propias: Un mensaje sin enviar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503119-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003119',
    'Un mensaje sin enviar',
    1,
    '{"modo":"escritura","invitacion":"Redacta una frase que no tienes que enviarle a nadie. Decide luego si la guardas o la borras.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-120 · Palabras propias: La parte que necesita tiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503120-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003120',
    'La parte que necesita tiempo',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Una parte de mí necesita tiempo para…». Puedes pasar.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-121 · Palabras propias: Lo que me gustaría preguntar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503121-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003121',
    'Lo que me gustaría preguntar',
    1,
    '{"modo":"escritura","invitacion":"Escribe una pregunta que te ayude a entender tu preferencia en una situación cotidiana.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-122 · Palabras propias: Una descripción sencilla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503122-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003122',
    'Una descripción sencilla',
    1,
    '{"modo":"escritura","invitacion":"Describe tu estado como si contaras el color de una pared: con palabras simples y sin explicación.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-123 · Palabras propias: Una idea que puedo pausar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503123-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003123',
    'Una idea que puedo pausar',
    1,
    '{"modo":"escritura","invitacion":"Anota un pensamiento que puedes dejar en espera mientras haces otra cosa.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-124 · Palabras propias: Mi espacio de hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503124-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003124',
    'Mi espacio de hoy',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Para estar a gusto ahora, me serviría…». No tiene que ser posible hacerlo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-125 · Palabras propias: El recuerdo sin juicio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503125-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003125',
    'El recuerdo sin juicio',
    1,
    '{"modo":"escritura","invitacion":"Escribe un detalle de un momento reciente sin decir si fue bueno o malo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-126 · Palabras propias: Una palabra que aprendí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503126-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003126',
    'Una palabra que aprendí',
    1,
    '{"modo":"escritura","invitacion":"Anota una palabra emocional nueva o una que hoy entiendas de otra manera.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-127 · Palabras propias: Una línea para mañana: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503127-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003127',
    'Una línea para mañana',
    1,
    '{"modo":"escritura","invitacion":"Deja una frase neutral para leer mañana, sin pedirte cambiar nada.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-128 · Palabras propias: El final de esta frase: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503128-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003128',
    'El final de esta frase',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Puedo sentir esto y aun así…». Si no te nace, déjala así.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-129 · Palabras propias: Una nota para mí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503129-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003129',
    'Una nota para mí',
    1,
    '{"modo":"escritura","invitacion":"Escríbete una nota breve como hablarías con alguien a quien respetas.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-130 · Necesidades y preferencias: Necesito espacio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503130-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003130',
    'Necesito espacio',
    1,
    '{"modo":"escritura","invitacion":"En este momento, ¿te serviría más espacio, compañía, información o no decidir todavía?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-131 · Necesidades y preferencias: Necesito claridad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503131-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003131',
    'Necesito claridad',
    1,
    '{"modo":"escritura","invitacion":"¿Qué dato concreto te ayudaría a sentirte orientado en una situación cotidiana?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-132 · Necesidades y preferencias: Una preferencia pequeña: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503132-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003132',
    'Una preferencia pequeña',
    1,
    '{"modo":"escritura","invitacion":"¿Qué preferencia tuya podrías nombrar hoy, aunque sea sobre algo sencillo?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-133 · Necesidades y preferencias: Lo que puede esperar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503133-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003133',
    'Lo que puede esperar',
    1,
    '{"modo":"escritura","invitacion":"¿Cuál de estas cosas puede esperar sin que tengas que resolverla ahora?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-134 · Necesidades y preferencias: Necesito compañía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503134-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003134',
    'Necesito compañía',
    1,
    '{"modo":"escritura","invitacion":"¿Qué tipo de compañía te resulta más cómoda hoy: conversar, compartir silencio o escribir?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-135 · Necesidades y preferencias: Un ritmo posible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503135-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003135',
    'Un ritmo posible',
    1,
    '{"modo":"escritura","invitacion":"¿Qué ritmo te gustaría probar en la próxima tarea: lento, habitual o con pausas?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-136 · Necesidades y preferencias: Necesito información: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503136-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003136',
    'Necesito información',
    1,
    '{"modo":"escritura","invitacion":"¿Qué pregunta concreta te falta responder antes de tomar una decisión?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-137 · Necesidades y preferencias: Una opción más cómoda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503137-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003137',
    'Una opción más cómoda',
    1,
    '{"modo":"escritura","invitacion":"¿Qué ajuste pequeño haría una actividad cotidiana más cómoda para ti?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-138 · Necesidades y preferencias: Pedir una pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503138-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003138',
    'Pedir una pausa',
    1,
    '{"modo":"escritura","invitacion":"¿Qué palabras podrías usar para pedir una pausa breve en una conversación?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-139 · Necesidades y preferencias: Lo que quiero cuidar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503139-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003139',
    'Lo que quiero cuidar',
    1,
    '{"modo":"escritura","invitacion":"¿Qué aspecto de tu tiempo o energía te gustaría cuidar durante la próxima hora?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-140 · Necesidades y preferencias: Necesito silencio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503140-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003140',
    'Necesito silencio',
    1,
    '{"modo":"escritura","invitacion":"¿Qué señal podrías dar para pedir un momento de silencio sin explicar el motivo?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-141 · Necesidades y preferencias: Una decisión sin prisa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503141-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003141',
    'Una decisión sin prisa',
    1,
    '{"modo":"escritura","invitacion":"¿Qué elección podrías dejar abierta hasta tener más información o ganas?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-142 · Necesidades y preferencias: Puedo elegir el cómo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503142-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003142',
    'Puedo elegir el cómo',
    1,
    '{"modo":"escritura","invitacion":"En una tarea pendiente, ¿qué parte del modo de hacerla sí puedes escoger?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-143 · Necesidades y preferencias: Una ayuda concreta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503143-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003143',
    'Una ayuda concreta',
    1,
    '{"modo":"escritura","invitacion":"¿Qué petición pequeña te resultaría clara y específica si decidieras hacerla?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-144 · Necesidades y preferencias: Necesito un límite: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503144-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003144',
    'Necesito un límite',
    1,
    '{"modo":"escritura","invitacion":"¿Qué límite de tiempo o espacio te gustaría tener presente hoy?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-145 · Necesidades y preferencias: Elijo no responder: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503145-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003145',
    'Elijo no responder',
    1,
    '{"modo":"escritura","invitacion":"¿Qué frase breve podrías usar si hoy no quieres responder una pregunta personal?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-146 · Necesidades y preferencias: La compañía adecuada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503146-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003146',
    'La compañía adecuada',
    1,
    '{"modo":"escritura","invitacion":"¿Qué hace que una conversación se sienta cómoda para ti: escucha, humor, pausas u otra cosa?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-147 · Necesidades y preferencias: Una actividad que sí quiero: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503147-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003147',
    'Una actividad que sí quiero',
    1,
    '{"modo":"escritura","invitacion":"¿Qué actividad cotidiana te gustaría elegir por gusto, sin convertirla en tarea?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-148 · Necesidades y preferencias: Necesito menos opciones: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503148-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003148',
    'Necesito menos opciones',
    1,
    '{"modo":"escritura","invitacion":"¿Qué decisión sería más fácil si redujeras las alternativas a dos?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-149 · Necesidades y preferencias: Necesito más tiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503149-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003149',
    'Necesito más tiempo',
    1,
    '{"modo":"escritura","invitacion":"¿En qué situación te vendría bien decir «lo pienso y te cuento»?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-150 · Necesidades y preferencias: Mi forma de participar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503150-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003150',
    'Mi forma de participar',
    1,
    '{"modo":"escritura","invitacion":"¿Cómo te gusta participar cuando hay un plan grupal: proponiendo, escuchando o eligiendo después?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-151 · Necesidades y preferencias: Una necesidad sin culpa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503151-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003151',
    'Una necesidad sin culpa',
    1,
    '{"modo":"escritura","invitacion":"¿Qué necesidad puedes reconocer sin tener que justificarla ante nadie?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-152 · Necesidades y preferencias: Lo que sí puedo cambiar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503152-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003152',
    'Lo que sí puedo cambiar',
    1,
    '{"modo":"escritura","invitacion":"¿Qué detalle del entorno puedes ajustar para sentirte más cómodo?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-153 · Necesidades y preferencias: Una expectativa propia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503153-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003153',
    'Una expectativa propia',
    1,
    '{"modo":"escritura","invitacion":"¿Qué expectativa sobre ti podrías volver más flexible durante este día?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-154 · Necesidades y preferencias: El tipo de apoyo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503154-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003154',
    'El tipo de apoyo',
    1,
    '{"modo":"escritura","invitacion":"Si quisieras apoyo, ¿preferirías una idea, compañía, escucha o ayuda práctica?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-155 · Necesidades y preferencias: Un acuerdo conmigo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503155-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003155',
    'Un acuerdo conmigo',
    1,
    '{"modo":"escritura","invitacion":"¿Qué acuerdo pequeño y realista te gustaría hacer contigo para la próxima hora?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-156 · Necesidades y preferencias: Lo que me resulta suficiente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503156-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003156',
    'Lo que me resulta suficiente',
    1,
    '{"modo":"escritura","invitacion":"¿Qué cantidad de conversación, silencio o actividad te parece suficiente hoy?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-157 · Necesidades y preferencias: Elegir con el cuerpo cómodo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503157-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003157',
    'Elegir con el cuerpo cómodo',
    1,
    '{"modo":"escritura","invitacion":"¿Qué postura o lugar te ayudaría a elegir con más comodidad?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-158 · Necesidades y preferencias: Un «no» posible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503158-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003158',
    'Un «no» posible',
    1,
    '{"modo":"escritura","invitacion":"¿Qué respuesta corta podrías dar cuando algo no te viene bien?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-159 · Necesidades y preferencias: Un «sí» propio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503159-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003159',
    'Un «sí» propio',
    1,
    '{"modo":"escritura","invitacion":"¿Qué actividad te gustaría aceptar porque sí quieres, no por compromiso?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-160 · Vínculos y comunicación: Escucha sin arreglar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503160-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003160',
    'Escucha sin arreglar',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Escucha sin arreglar","texto":"Lee una escena: una amistad cuenta que tuvo un día difícil. Elige una respuesta que primero escuche.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-161 · Vínculos y comunicación: Agradecer a mi manera: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503161-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003161',
    'Agradecer a mi manera',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Agradecer a mi manera","texto":"Piensa en alguien a quien quieras agradecer algo concreto. Elige si prefieres decirlo, escribirlo o guardarlo.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-162 · Vínculos y comunicación: Una llamada de reencuentro: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503162-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003162',
    'Una llamada de reencuentro',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una llamada de reencuentro","texto":"Hace tiempo que no hablas con alguien y recibes un mensaje suyo. Elige cómo te gustaría empezar, si quieres responder.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-163 · Vínculos y comunicación: Pedir que me escuchen: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503163-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003163',
    'Pedir que me escuchen',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Pedir que me escuchen","texto":"Elige una frase para pedir escucha sin recibir consejos de inmediato.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-164 · Vínculos y comunicación: Compartir una buena noticia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503164-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003164',
    'Compartir una buena noticia',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Compartir una buena noticia","texto":"Decide cómo te gustaría compartir una noticia que te alegra, si quieres compartirla.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-165 · Vínculos y comunicación: Reparar un malentendido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503165-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003165',
    'Reparar un malentendido',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Reparar un malentendido","texto":"Ante un malentendido pequeño, elige entre preguntar, aclarar tu intención o tomar tiempo.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-166 · Vínculos y comunicación: Una charla con pausas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503166-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003166',
    'Una charla con pausas',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una charla con pausas","texto":"Escoge una manera de pausar una conversación si necesitas ordenar tus ideas.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-167 · Vínculos y comunicación: Reconocer el esfuerzo ajeno: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503167-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003167',
    'Reconocer el esfuerzo ajeno',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Reconocer el esfuerzo ajeno","texto":"Elige una forma concreta de reconocer algo que otra persona hizo, sin exagerar.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-168 · Vínculos y comunicación: Un saludo que me representa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503168-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003168',
    'Un saludo que me representa',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un saludo que me representa","texto":"Escoge cómo saludarías hoy a alguien importante para ti: con palabras, gesto o mensaje.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-169 · Vínculos y comunicación: Hacer una pregunta abierta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503169-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003169',
    'Hacer una pregunta abierta',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Hacer una pregunta abierta","texto":"Elige una pregunta respetuosa que invite a alguien a contar solo lo que quiera.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-170 · Vínculos y comunicación: Compartir silencio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503170-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003170',
    'Compartir silencio',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Compartir silencio","texto":"Piensa en una compañía con la que puedes estar en silencio. Decide si hoy te gustaría buscarla.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-171 · Vínculos y comunicación: Responder más tarde: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503171-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003171',
    'Responder más tarde',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Responder más tarde","texto":"Escoge una frase breve para avisar que responderás un mensaje cuando puedas.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-172 · Vínculos y comunicación: Decir que no entendí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503172-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003172',
    'Decir que no entendí',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Decir que no entendí","texto":"Elige una frase para pedir que expliquen algo de otra manera.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-173 · Vínculos y comunicación: Celebrar sin comparar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503173-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003173',
    'Celebrar sin comparar',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Celebrar sin comparar","texto":"Piensa en un logro ajeno y escoge una forma de alegrarte por esa persona a tu manera.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-174 · Vínculos y comunicación: Cuidar una confidencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503174-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003174',
    'Cuidar una confidencia',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Cuidar una confidencia","texto":"Si alguien te cuenta algo privado, elige qué conducta muestra respeto por su confianza.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-175 · Vínculos y comunicación: Aclarar una preferencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503175-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003175',
    'Aclarar una preferencia',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Aclarar una preferencia","texto":"Elige cómo podrías contar qué plan te gusta más sin descartar las ideas de otras personas.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-176 · Vínculos y comunicación: Recibir un cumplido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503176-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003176',
    'Recibir un cumplido',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Recibir un cumplido","texto":"Cuando alguien te dice algo amable, escoge cómo te gustaría responder, incluso con un simple gracias.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-177 · Vínculos y comunicación: Un contacto que me hace bien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503177-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003177',
    'Un contacto que me hace bien',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un contacto que me hace bien","texto":"Elige si hoy te gustaría escribir, llamar, encontrarte o no contactar a nadie.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-178 · Vínculos y comunicación: Poner fin a una charla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503178-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003178',
    'Poner fin a una charla',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Poner fin a una charla","texto":"Escoge una forma amable y clara de terminar una conversación cuando necesites seguir con tu día.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-179 · Vínculos y comunicación: Escuchar otra experiencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503179-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003179',
    'Escuchar otra experiencia',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Escuchar otra experiencia","texto":"Elige una pregunta que permita escuchar a alguien sin asumir que siente lo mismo que tú.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-180 · Vínculos y comunicación: Pedir una aclaración: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503180-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003180',
    'Pedir una aclaración',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Pedir una aclaración","texto":"Ante una frase que no entiendes, decide si prefieres preguntar, confirmar o volver al tema luego.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-181 · Vínculos y comunicación: Expresar desacuerdo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503181-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003181',
    'Expresar desacuerdo',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Expresar desacuerdo","texto":"Escoge una manera de decir que ves una situación distinto y mantener el respeto.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-182 · Vínculos y comunicación: Aceptar una invitación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503182-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003182',
    'Aceptar una invitación',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Aceptar una invitación","texto":"Una persona te invita a un plan. Elige cómo decidir según tus ganas y tu disponibilidad.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-183 · Vínculos y comunicación: Rechazar un plan: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503183-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003183',
    'Rechazar un plan',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Rechazar un plan","texto":"Escoge una frase honesta para declinar un plan sin inventar explicaciones.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-184 · Vínculos y comunicación: Un mensaje de apoyo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503184-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003184',
    'Un mensaje de apoyo',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un mensaje de apoyo","texto":"Elige una frase breve que podrías enviar a alguien sin prometer resolver su problema.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-185 · Vínculos y comunicación: Pedir ayuda concreta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503185-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003185',
    'Pedir ayuda concreta',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Pedir ayuda concreta","texto":"Selecciona qué petición sería más clara: qué necesitas, cuándo y con qué parte.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-186 · Vínculos y comunicación: Hablar desde mí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503186-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003186',
    'Hablar desde mí',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Hablar desde mí","texto":"Escoge una frase que empiece por «yo prefiero» para expresar una necesidad propia.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-187 · Vínculos y comunicación: Dar espacio a otra voz: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503187-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003187',
    'Dar espacio a otra voz',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Dar espacio a otra voz","texto":"En una conversación grupal, elige cómo invitar a participar sin presionar a nadie.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-188 · Vínculos y comunicación: Cuidar mi intimidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503188-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003188',
    'Cuidar mi intimidad',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Cuidar mi intimidad","texto":"Elige qué información personal prefieres no compartir en una conversación.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-189 · Vínculos y comunicación: Reconectar sin obligación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503189-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003189',
    'Reconectar sin obligación',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Reconectar sin obligación","texto":"Piensa en alguien a quien extrañas y decide si escribirle, recordarle o dejarlo para otro día.","opciones":[{"clave":"primera","texto":"Escucho primero"},{"clave":"segunda","texto":"Pregunto qué necesita"},{"clave":"paso","texto":"Prefiero pasar"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-190 · Límites y decisiones: El límite del horario: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503190-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003190',
    'El límite del horario',
    1,
    '{"modo":"escritura","invitacion":"¿Qué frase usarías para cerrar una conversación cuando ya necesitas continuar con otra cosa?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-191 · Límites y decisiones: Una tarea compartida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503191-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003191',
    'Una tarea compartida',
    1,
    '{"modo":"escritura","invitacion":"¿Qué parte de una tarea compartida te corresponde y qué parte conviene conversar?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-192 · Límites y decisiones: Una pregunta personal: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503192-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003192',
    'Una pregunta personal',
    1,
    '{"modo":"escritura","invitacion":"¿Qué podrías responder si no quieres hablar de un asunto personal ahora?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-193 · Límites y decisiones: El espacio físico: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503193-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003193',
    'El espacio físico',
    1,
    '{"modo":"escritura","invitacion":"¿Cómo expresarías que necesitas más espacio físico en una situación cotidiana?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-194 · Límites y decisiones: Cambiar de opinión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503194-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003194',
    'Cambiar de opinión',
    1,
    '{"modo":"escritura","invitacion":"¿Qué palabras te ayudarían a cambiar un plan que aceptaste antes?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-195 · Límites y decisiones: Una petición incómoda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503195-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003195',
    'Una petición incómoda',
    1,
    '{"modo":"escritura","invitacion":"¿Qué dato necesitas para decidir si aceptas una petición de alguien?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-196 · Límites y decisiones: El tiempo propio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503196-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003196',
    'El tiempo propio',
    1,
    '{"modo":"escritura","invitacion":"¿Qué actividad de tu día necesita un límite de tiempo para no ocuparlo todo?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-197 · Límites y decisiones: Un límite digital: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503197-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003197',
    'Un límite digital',
    1,
    '{"modo":"escritura","invitacion":"¿Qué aviso del teléfono puedes silenciar por un rato si así lo decides?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-198 · Límites y decisiones: Un tema que pauso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503198-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003198',
    'Un tema que pauso',
    1,
    '{"modo":"escritura","invitacion":"¿Cómo podrías pedir que un tema se retome en otro momento?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-199 · Límites y decisiones: Decir «hasta aquí»: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503199-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003199',
    'Decir «hasta aquí»',
    1,
    '{"modo":"escritura","invitacion":"¿Qué señal te indicaría que una actividad ya es suficiente por hoy?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-200 · Límites y decisiones: No decidir por presión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503200-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003200',
    'No decidir por presión',
    1,
    '{"modo":"escritura","invitacion":"¿Qué frase podrías usar para pedir tiempo antes de aceptar una propuesta?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-201 · Límites y decisiones: Una decisión compartida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503201-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003201',
    'Una decisión compartida',
    1,
    '{"modo":"escritura","invitacion":"¿Qué opción te permitiría expresar tu preferencia y escuchar la de otra persona?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-202 · Límites y decisiones: Mi espacio de trabajo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503202-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003202',
    'Mi espacio de trabajo',
    1,
    '{"modo":"escritura","invitacion":"¿Qué límite sencillo haría más claro el inicio o el cierre de tu jornada?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-203 · Límites y decisiones: Una expectativa ajena: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503203-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003203',
    'Una expectativa ajena',
    1,
    '{"modo":"escritura","invitacion":"¿Qué parte de una expectativa de otra persona necesitas aclarar antes de responder?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-204 · Límites y decisiones: El límite de una broma: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503204-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003204',
    'El límite de una broma',
    1,
    '{"modo":"escritura","invitacion":"¿Qué frase breve usarías si una broma no te resulta cómoda?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-205 · Límites y decisiones: Un favor posible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503205-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003205',
    'Un favor posible',
    1,
    '{"modo":"escritura","invitacion":"¿Qué parte de una petición sí podrías hacer y qué parte no te corresponde?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-206 · Límites y decisiones: Cuidar una conversación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503206-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003206',
    'Cuidar una conversación',
    1,
    '{"modo":"escritura","invitacion":"¿Qué acuerdo ayudaría a que una conversación difícil tenga un principio y un final claros?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-207 · Límites y decisiones: Elegir lo que cuento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503207-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003207',
    'Elegir lo que cuento',
    1,
    '{"modo":"escritura","invitacion":"¿Qué detalle decides reservar para ti aunque otras personas pregunten?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-208 · Límites y decisiones: Mi respuesta auténtica: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503208-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003208',
    'Mi respuesta auténtica',
    1,
    '{"modo":"escritura","invitacion":"¿Cómo distinguirías entre aceptar por ganas y aceptar solo para evitar incomodidad?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-209 · Límites y decisiones: Un cambio de plan: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503209-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003209',
    'Un cambio de plan',
    1,
    '{"modo":"escritura","invitacion":"¿Qué necesitas saber para decidir si un cambio de plan te viene bien?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-210 · Límites y decisiones: Una pausa antes del sí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503210-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003210',
    'Una pausa antes del sí',
    1,
    '{"modo":"escritura","invitacion":"¿Qué pregunta podrías hacerte antes de comprometer tiempo que todavía no tienes?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-211 · Límites y decisiones: Un límite con amabilidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503211-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003211',
    'Un límite con amabilidad',
    1,
    '{"modo":"escritura","invitacion":"¿Qué frase clara y respetuosa podría expresar un «no» en esta situación?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-212 · Límites y decisiones: Una tarea que no me toca: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503212-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003212',
    'Una tarea que no me toca',
    1,
    '{"modo":"escritura","invitacion":"¿Qué pregunta te ayudaría a aclarar quién se encarga de un pendiente compartido?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-213 · Límites y decisiones: El momento de retirarme: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503213-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003213',
    'El momento de retirarme',
    1,
    '{"modo":"escritura","invitacion":"¿Qué señal te indicaría que quieres dejar una reunión o cambiar de espacio?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-214 · Límites y decisiones: Un acuerdo que revisar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503214-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003214',
    'Un acuerdo que revisar',
    1,
    '{"modo":"escritura","invitacion":"¿Qué acuerdo cotidiano podrías revisar si ya no te resulta práctico?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-215 · Límites y decisiones: Lo que acepto hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503215-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003215',
    'Lo que acepto hoy',
    1,
    '{"modo":"escritura","invitacion":"¿Qué compromiso de hoy eliges mantener, ajustar o conversar?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-216 · Límites y decisiones: El límite del consejo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503216-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003216',
    'El límite del consejo',
    1,
    '{"modo":"escritura","invitacion":"¿Qué frase usarías para agradecer un consejo y explicar que quieres decidir por tu cuenta?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-217 · Límites y decisiones: La puerta entreabierta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503217-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003217',
    'La puerta entreabierta',
    1,
    '{"modo":"escritura","invitacion":"¿Qué tema preferirías conversar solo con alguien de confianza?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-218 · Límites y decisiones: Un espacio para pensar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503218-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003218',
    'Un espacio para pensar',
    1,
    '{"modo":"escritura","invitacion":"¿Cómo pedirías un momento a solas antes de responder a una situación?","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-219 · Límites y decisiones: Mi decisión pequeña: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503219-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003219',
    'Mi decisión pequeña',
    1,
    '{"modo":"escritura","invitacion":"Elige una decisión cotidiana que quieras tomar a tu ritmo y sin pedir permiso.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-220 · Emociones mezcladas: Dos cosas verdaderas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503220-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003220',
    'Dos cosas verdaderas',
    1,
    '{"modo":"escritura","invitacion":"Escribe dos emociones que puedan coexistir hoy sin tener que escoger una.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-221 · Emociones mezcladas: Agridulce: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503221-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003221',
    'Agridulce',
    1,
    '{"modo":"escritura","invitacion":"Describe un momento que tuvo una parte agradable y otra difícil, solo si quieres.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-222 · Emociones mezcladas: Querer y dudar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503222-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003222',
    'Querer y dudar',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Me interesa… y todavía tengo dudas sobre…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-223 · Emociones mezcladas: Alivio con cansancio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503223-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003223',
    'Alivio con cansancio',
    1,
    '{"modo":"escritura","invitacion":"Anota cómo conviven el alivio y el cansancio después de terminar algo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-224 · Emociones mezcladas: Alegría con nervios: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503224-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003224',
    'Alegría con nervios',
    1,
    '{"modo":"escritura","invitacion":"Pon en palabras una situación donde puedan aparecer ilusión y nervios al mismo tiempo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-225 · Emociones mezcladas: Cariño y distancia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503225-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003225',
    'Cariño y distancia',
    1,
    '{"modo":"escritura","invitacion":"Escribe una frase sobre querer a alguien y necesitar también tu espacio.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-226 · Emociones mezcladas: Nostalgia y presente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503226-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003226',
    'Nostalgia y presente',
    1,
    '{"modo":"escritura","invitacion":"Nombra un recuerdo que extrañas y un detalle que te acompaña ahora.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-227 · Emociones mezcladas: Orgullo y humildad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503227-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003227',
    'Orgullo y humildad',
    1,
    '{"modo":"escritura","invitacion":"Describe un logro propio sin quitarle valor ni compararlo con nadie.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-228 · Emociones mezcladas: Tranquilidad e incertidumbre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503228-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003228',
    'Tranquilidad e incertidumbre',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Puedo sentir calma sobre… y no saber todavía…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-229 · Emociones mezcladas: Curiosidad con cautela: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503229-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003229',
    'Curiosidad con cautela',
    1,
    '{"modo":"escritura","invitacion":"Escribe qué te da curiosidad y qué prefieres observar antes de acercarte.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-230 · Emociones mezcladas: Fastidio y cuidado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503230-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003230',
    'Fastidio y cuidado',
    1,
    '{"modo":"escritura","invitacion":"Anota algo que te molesta y una manera de cuidar tu espacio mientras pasa.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-231 · Emociones mezcladas: Pena y compañía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503231-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003231',
    'Pena y compañía',
    1,
    '{"modo":"escritura","invitacion":"Escribe qué tipo de compañía te gustaría tener cuando aparece la pena, si alguna.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-232 · Emociones mezcladas: Confianza con preguntas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503232-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003232',
    'Confianza con preguntas',
    1,
    '{"modo":"escritura","invitacion":"Nombra algo en lo que confías y una pregunta que todavía mantienes abierta.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-233 · Emociones mezcladas: Emoción sin conclusión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503233-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003233',
    'Emoción sin conclusión',
    1,
    '{"modo":"escritura","invitacion":"Describe dos sensaciones distintas sin explicar qué significan.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-234 · Emociones mezcladas: Un sí y un no: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503234-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003234',
    'Un sí y un no',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Una parte de mí dice sí a… y otra parte pide…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-235 · Emociones mezcladas: Recuerdo que cambia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503235-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003235',
    'Recuerdo que cambia',
    1,
    '{"modo":"escritura","invitacion":"Escribe cómo puede sentirse distinto un mismo recuerdo según el día, sin decidir cuál versión vale.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-236 · Emociones mezcladas: Esperanza con paciencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503236-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003236',
    'Esperanza con paciencia',
    1,
    '{"modo":"escritura","invitacion":"Anota algo que esperas y cuánto espacio quieres darte mientras llega.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-237 · Emociones mezcladas: Duda con interés: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503237-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003237',
    'Duda con interés',
    1,
    '{"modo":"escritura","invitacion":"Escribe una pregunta que conserve tu interés sin obligarte a resolver la duda.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-238 · Emociones mezcladas: Energía irregular: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503238-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003238',
    'Energía irregular',
    1,
    '{"modo":"escritura","invitacion":"Describe cómo es tener ganas para una cosa y poca energía para otra.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-239 · Emociones mezcladas: Una mezcla sin nombre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503239-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003239',
    'Una mezcla sin nombre',
    1,
    '{"modo":"escritura","invitacion":"Pon una imagen o palabra a una combinación emocional que aún no sabes nombrar.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-240 · Emociones mezcladas: Risa y preocupación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503240-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003240',
    'Risa y preocupación',
    1,
    '{"modo":"escritura","invitacion":"Nombra si hoy hubo un momento divertido junto a algo que todavía te ocupa.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-241 · Emociones mezcladas: Despedida y comienzo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503241-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003241',
    'Despedida y comienzo',
    1,
    '{"modo":"escritura","invitacion":"Escribe dos palabras para algo que termina y algo que empieza.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-242 · Emociones mezcladas: Deseo y realidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503242-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003242',
    'Deseo y realidad',
    1,
    '{"modo":"escritura","invitacion":"Describe algo que deseas y una condición real que necesitas considerar, sin juzgarla.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-243 · Emociones mezcladas: Satisfacción con cansancio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503243-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003243',
    'Satisfacción con cansancio',
    1,
    '{"modo":"escritura","invitacion":"Nombra una tarea que te dejó satisfecho y también te agotó.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-244 · Emociones mezcladas: Confusión con una pista: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503244-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003244',
    'Confusión con una pista',
    1,
    '{"modo":"escritura","invitacion":"Escribe una pequeña pista que sí tienes aunque el panorama siga confuso.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-245 · Emociones mezcladas: Entusiasmo y pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503245-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003245',
    'Entusiasmo y pausa',
    1,
    '{"modo":"escritura","invitacion":"Anota qué te entusiasma y qué pausa te ayudaría a disfrutarlo a tu ritmo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-246 · Emociones mezcladas: Afecto y desacuerdo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503246-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003246',
    'Afecto y desacuerdo',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Puedo querer a alguien y pensar distinto sobre…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-247 · Emociones mezcladas: Cambio y familiaridad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503247-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003247',
    'Cambio y familiaridad',
    1,
    '{"modo":"escritura","invitacion":"Nombra algo que está cambiando y algo conocido que permanece.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-248 · Emociones mezcladas: Lo que convive hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503248-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003248',
    'Lo que convive hoy',
    1,
    '{"modo":"escritura","invitacion":"Haz una lista de dos emociones presentes y deja ambas sin explicación.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-249 · Emociones mezcladas: Un final abierto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503249-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003249',
    'Un final abierto',
    1,
    '{"modo":"escritura","invitacion":"Termina esta frase: «No tengo que elegir entre… y…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-250 · Expresión creativa: Un paisaje interior: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503250-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003250',
    'Un paisaje interior',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un paisaje interior","texto":"Arma un paisaje emocional eligiendo elementos, sin darles una interpretación fija.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-251 · Expresión creativa: La paleta del momento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503251-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003251',
    'La paleta del momento',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"La paleta del momento","texto":"Elige colores que se parezcan al momento actual; puedes elegir ninguno.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-252 · Expresión creativa: Una forma para la emoción: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503252-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003252',
    'Una forma para la emoción',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una forma para la emoción","texto":"Selecciona una forma, una textura y un tamaño para representar tu estado.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-253 · Expresión creativa: Ritmo emocional: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503253-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003253',
    'Ritmo emocional',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Ritmo emocional","texto":"Marca qué ritmo tendría tu momento: pausado, entrecortado, constante, cambiante o silencioso.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-254 · Expresión creativa: Una canción sin letra: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503254-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003254',
    'Una canción sin letra',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una canción sin letra","texto":"Piensa en una melodía instrumental que acompañe tu ánimo y señala qué ritmo tendría.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-255 · Expresión creativa: Objeto imaginario: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503255-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003255',
    'Objeto imaginario',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Objeto imaginario","texto":"Diseña un objeto imaginario que represente cómo quieres sentirte en tu espacio.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-256 · Expresión creativa: Un personaje de hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503256-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003256',
    'Un personaje de hoy',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un personaje de hoy","texto":"Elige tres rasgos para un personaje que atraviesa una situación parecida a la de hoy.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-257 · Expresión creativa: La forma de una pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503257-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003257',
    'La forma de una pausa',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"La forma de una pausa","texto":"Escoge una imagen para una pausa: banco, nube, ventana, manta u otra que inventes.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-258 · Expresión creativa: Un símbolo personal: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503258-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003258',
    'Un símbolo personal',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un símbolo personal","texto":"Selecciona un símbolo que represente una emoción sin convertirlo en una explicación.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-259 · Expresión creativa: Una viñeta sin palabras: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503259-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003259',
    'Una viñeta sin palabras',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una viñeta sin palabras","texto":"Imagina una viñeta de tres cuadros sobre tu día y elige qué aparece en cada uno.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-260 · Expresión creativa: Un mapa de colores: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503260-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003260',
    'Un mapa de colores',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un mapa de colores","texto":"Asigna un color a tres momentos distintos, sin decidir si alguno fue mejor.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-261 · Expresión creativa: La emoción como sonido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503261-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003261',
    'La emoción como sonido',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"La emoción como sonido","texto":"Elige si tu emoción se parecería a un sonido largo, breve, suave, repetido o al silencio.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-262 · Expresión creativa: Un título de película: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503262-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003262',
    'Un título de película',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un título de película","texto":"Ponle un título de película a este momento, realista o disparatado.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-263 · Expresión creativa: Un objeto compañero: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503263-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003263',
    'Un objeto compañero',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un objeto compañero","texto":"Escoge un objeto cotidiano que acompañaría a tu estado de ánimo y cuenta por qué te llamó.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-264 · Expresión creativa: El clima en tres formas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503264-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003264',
    'El clima en tres formas',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"El clima en tres formas","texto":"Elige una forma para el cielo, otra para el suelo y otra para tu estado de hoy.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-265 · Expresión creativa: Un movimiento de lápiz: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503265-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003265',
    'Un movimiento de lápiz',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un movimiento de lápiz","texto":"Imagina un trazo que acompañe tu emoción: recto, curvo, suave, fuerte o discontinuo.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-266 · Expresión creativa: Una escena con distancia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503266-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003266',
    'Una escena con distancia',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una escena con distancia","texto":"Dibuja mentalmente una escena y decide dónde ubicarías a quien la observa.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-267 · Expresión creativa: Una metáfora propia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503267-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003267',
    'Una metáfora propia',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una metáfora propia","texto":"Escoge una metáfora nueva para tu estado, evitando buscar una explicación.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-268 · Expresión creativa: Un color que falta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503268-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003268',
    'Un color que falta',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un color que falta","texto":"Añade un color inesperado a la paleta de hoy y decide si quieres conservarlo.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-269 · Expresión creativa: Un ritmo con las manos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503269-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003269',
    'Un ritmo con las manos',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un ritmo con las manos","texto":"Elige un patrón breve de palmas o dedos que acompañe tu energía, sin acelerar.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-270 · Expresión creativa: La emoción en una postal: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503270-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003270',
    'La emoción en una postal',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"La emoción en una postal","texto":"Compón una postal imaginaria con un lugar, un objeto y una frase corta.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-271 · Expresión creativa: Un collage de sensaciones: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503271-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003271',
    'Un collage de sensaciones',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un collage de sensaciones","texto":"Combina una textura, una temperatura y un sonido que describan este instante.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-272 · Expresión creativa: El nombre de una nube: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503272-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003272',
    'El nombre de una nube',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"El nombre de una nube","texto":"Inventa un nombre para una nube que se parezca a una emoción sin nombre.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-273 · Expresión creativa: Una escena en pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503273-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003273',
    'Una escena en pausa',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una escena en pausa","texto":"Elige qué parte de una escena cotidiana dejarías quieta por un momento.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-274 · Expresión creativa: Un gesto de personaje: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503274-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003274',
    'Un gesto de personaje',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un gesto de personaje","texto":"Escoge un gesto que mostraría tu personaje y otro que preferiría guardar.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-275 · Expresión creativa: Una emoción con forma: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503275-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003275',
    'Una emoción con forma',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una emoción con forma","texto":"Elige entre círculo, espiral, línea o forma libre para representar una sensación.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-276 · Expresión creativa: Una palabra dibujada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503276-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003276',
    'Una palabra dibujada',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una palabra dibujada","texto":"Escoge una palabra y piensa cómo cambiaría su forma si la dibujaras.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-277 · Expresión creativa: Una caja imaginaria: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503277-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003277',
    'Una caja imaginaria',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una caja imaginaria","texto":"Elige qué emoción guardarías en una caja por hoy y cuál dejarías afuera.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-278 · Expresión creativa: Una escena de dos colores: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503278-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003278',
    'Una escena de dos colores',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una escena de dos colores","texto":"Describe una escena usando solo dos colores que convivan en tu día.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-279 · Expresión creativa: El final que elijo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503279-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003279',
    'El final que elijo',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"El final que elijo","texto":"Imagina un final para una escena cotidiana que te deje con una sensación de elección.","opciones":[{"clave":"primera","texto":"Una imagen o color"},{"clave":"segunda","texto":"Un sonido o ritmo"},{"clave":"paso","texto":"Prefiero no elegir"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-280 · Pausa y presencia: Ventana de sonidos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503280-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003280',
    'Ventana de sonidos',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Elige un sonido","texto":"Quédate en una postura cómoda y elige un sonido cercano o lejano. Escúchalo unos segundos sin intentar cambiarlo."},{"titulo":"Amplía la escucha","texto":"Deja que aparezcan otros sonidos. Nota cuál parece más cerca y cuál más lejos; no hace falta nombrarlos."},{"titulo":"Vuelve al espacio","texto":"Escucha el conjunto del lugar una vez más y termina cuando quieras."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-281 · Pausa y presencia: Texturas a mano: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503281-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003281',
    'Texturas a mano',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Elige una textura","texto":"Busca un objeto que ya tengas cerca. Si te resulta cómodo, tócala; también puedes observarla sin tocarla."},{"titulo":"Nota dos detalles","texto":"Fíjate si se siente lisa, rugosa, blanda o firme. Elige solo una o dos palabras, sin buscar una respuesta correcta."},{"titulo":"Deja el objeto","texto":"Vuelve a apoyar el objeto donde estaba y sigue a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-282 · Pausa y presencia: Mirada que descansa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503282-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003282',
    'Mirada que descansa',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Busca un punto cómodo","texto":"Elige un objeto o una zona tranquila del entorno. No hace falta mantener la mirada fija."},{"titulo":"Suaviza la mirada","texto":"Mira ese punto y permite que también aparezca lo que lo rodea. Parpadea con normalidad."},{"titulo":"Mira alrededor","texto":"Aparta la vista cuando lo prefieras y nota de nuevo el espacio completo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-283 · Pausa y presencia: Apoyo de los pies: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503283-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003283',
    'Apoyo de los pies',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Nota el apoyo de tus pies o elige otra parte del cuerpo que te resulte cómoda."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-284 · Pausa y presencia: Un objeto cercano: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503284-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003284',
    'Un objeto cercano',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Mira un objeto cotidiano y observa un detalle que no habías notado."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-285 · Pausa y presencia: Temperatura del aire: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503285-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003285',
    'Temperatura del aire',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Nota si el aire se siente fresco, tibio o difícil de distinguir."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-286 · Pausa y presencia: Orientarme en el lugar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503286-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003286',
    'Orientarme en el lugar',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Mira una señal","texto":"Encuentra un detalle visible del lugar, como una puerta, una ventana o una lámpara."},{"titulo":"Encuentra otra","texto":"Elige una segunda señal y nómbrala mentalmente, si te sirve. No necesitas moverte."},{"titulo":"Ubícate a tu manera","texto":"Piensa dónde estás ahora o simplemente vuelve a mirar alrededor. Puedes cerrar la pausa aquí."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-287 · Pausa y presencia: Una pausa visual: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503287-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003287',
    'Una pausa visual',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Elige una distancia","texto":"Decide si te apetece mirar algo cercano o algo más lejano desde donde estás."},{"titulo":"Observa sin fijar","texto":"Nota una forma o un color durante unos segundos, sin forzar la vista ni sostener la mirada."},{"titulo":"Cambia el foco","texto":"Mira otro punto del espacio cuando quieras y continúa con tu día."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-288 · Pausa y presencia: Sonido que se aleja: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503288-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003288',
    'Sonido que se aleja',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Escoge un sonido","texto":"Elige un sonido que ya esté ocurriendo. No tienes que buscarlo ni acercarte."},{"titulo":"Nota el cambio","texto":"Escucha si se vuelve más suave, cambia o termina. Si sigue igual, también está bien."},{"titulo":"Suelta la escucha","texto":"Deja de seguir ese sonido y vuelve a escuchar el ambiente completo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-289 · Pausa y presencia: Contacto con la silla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503289-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003289',
    'Contacto con la silla',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Nota el contacto con el asiento y cambia de postura si lo deseas."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-290 · Pausa y presencia: Una forma en el entorno: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503290-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003290',
    'Una forma en el entorno',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Encuentra una forma","texto":"Mira un objeto que tenga un contorno fácil de ver, como una mesa, una ventana o un libro."},{"titulo":"Recorre el contorno","texto":"Sigue su borde solo con la mirada, a la velocidad que te resulte cómoda."},{"titulo":"Vuelve al conjunto","texto":"Aparta la mirada y nota el resto del espacio. No hace falta encontrar otra forma."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-291 · Pausa y presencia: Pausa entre tareas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503291-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003291',
    'Pausa entre tareas',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Deja quietas las manos un momento y decide qué tarea viene después."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-292 · Pausa y presencia: Un color presente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503292-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003292',
    'Un color presente',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Elige un color","texto":"Mira alrededor y quédate con un color que ya esté en el lugar."},{"titulo":"Encuentra sus apariciones","texto":"Busca hasta tres objetos de ese color. Si solo encuentras uno, basta."},{"titulo":"Cierra la búsqueda","texto":"Deja de buscar y mira el espacio como un todo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-293 · Pausa y presencia: La habitación en silencio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503293-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003293',
    'La habitación en silencio',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Haz una pausa","texto":"Quédate donde estás y escucha durante unos segundos, sin necesidad de cerrar los ojos."},{"titulo":"Nota lo que sí suena","texto":"Si hay sonidos suaves, elige uno; si no distingues ninguno, nota esa quietud."},{"titulo":"Regresa cuando quieras","texto":"Mueve la atención de nuevo a lo que estabas haciendo o termina aquí."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-294 · Pausa y presencia: El peso de un objeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503294-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003294',
    'El peso de un objeto',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Elige algo liviano","texto":"Si tienes un objeto a mano y te resulta cómodo, apóyalo en la palma o sostenlo con suavidad."},{"titulo":"Nota cómo se apoya","texto":"Percibe su peso y dónde descansa en tu mano. No necesitas calcularlo ni describirlo."},{"titulo":"Déjalo en su sitio","texto":"Apoya el objeto de nuevo y nota cómo queda tu mano después."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-295 · Pausa y presencia: Un punto de apoyo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503295-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003295',
    'Un punto de apoyo',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Escoge un apoyo","texto":"Puede ser el asiento, el respaldo, los pies o cualquier contacto cómodo. No tienes que cambiar de postura."},{"titulo":"Percibe el contacto","texto":"Nota durante unos segundos dónde sientes ese apoyo, o elige otro si este no te resulta cómodo."},{"titulo":"Sigue a tu ritmo","texto":"Vuelve a la actividad que prefieras; no hay una sensación que debas encontrar."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-296 · Pausa y presencia: Una línea que guía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503296-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003296',
    'Una línea que guía',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Encuentra una línea","texto":"Elige un borde visible del entorno, como el de una mesa, una pared o una página."},{"titulo":"Sigue su recorrido","texto":"Recórrela con la mirada desde un extremo hasta donde te resulte fácil; no necesitas mover la cabeza."},{"titulo":"Suelta el recorrido","texto":"Mira otro punto y deja que la vista descanse donde prefiera."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-297 · Pausa y presencia: Distancias del lugar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503297-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003297',
    'Distancias del lugar',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Mira algo cercano","texto":"Desde donde estás, encuentra un objeto que tengas a poca distancia."},{"titulo":"Busca dos distancias más","texto":"Mira algo a media distancia y luego algo más lejano. No necesitas acercarte a nada."},{"titulo":"Vuelve a tu ritmo","texto":"Elige dónde quieres dejar la mirada y continúa cuando estés listo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-298 · Pausa y presencia: Manos en reposo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503298-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003298',
    'Manos en reposo',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Deja las manos en una posición cómoda y nota qué quieres hacer después."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-299 · Pausa y presencia: Una cosa estable: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503299-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003299',
    'Una cosa estable',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Encuentra un detalle que permanezca quieto mientras otras cosas se mueven."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-300 · Pausa y presencia: Un minuto sin tarea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503300-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003300',
    'Un minuto sin tarea',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Deja la tarea en pausa","texto":"Durante unos segundos, no intentes resolver ni completar nada. Puedes dejar las manos como están."},{"titulo":"Permite un momento libre","texto":"Mira el entorno o descansa la atención. No tienes que respirar de una forma especial."},{"titulo":"Retoma o termina","texto":"Cuando quieras, elige si vuelves a tu tarea o cierras esta pausa."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-301 · Pausa y presencia: Vuelvo a mis sentidos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503301-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003301',
    'Vuelvo a mis sentidos',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Encuentra algo que ves","texto":"Elige un detalle visible del lugar y nómbralo mentalmente, si quieres."},{"titulo":"Escucha y nota el tacto","texto":"Reconoce un sonido y una sensación de contacto que ya esté presente. No busques sensaciones nuevas."},{"titulo":"Reúne los tres detalles","texto":"Recuerda lo que viste, oíste y sentiste al tacto. Puedes terminar aquí."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-302 · Pausa y presencia: El borde de un objeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503302-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003302',
    'El borde de un objeto',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Observa el borde de un objeto cotidiano y vuelve al espacio a tu ritmo."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-303 · Pausa y presencia: El entorno por capas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503303-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003303',
    'El entorno por capas',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Elige un objeto","texto":"Mira un objeto concreto que esté en tu entorno."},{"titulo":"Añade un sonido","texto":"Sin dejar de estar donde estás, nota un sonido cercano o lejano."},{"titulo":"Mira el espacio entre ambos","texto":"Nota el espacio que parece separarlos y vuelve a mirar alrededor."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-304 · Pausa y presencia: Una pausa en movimiento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503304-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003304',
    'Una pausa en movimiento',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Si te resulta cómodo, cambia de postura una vez y observa el nuevo apoyo."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-305 · Pausa y presencia: Una luz del lugar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503305-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003305',
    'Una luz del lugar',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Encuentra una zona iluminada","texto":"Mira una parte del lugar donde llegue más luz, sin mirar directamente a una lámpara o al sol."},{"titulo":"Encuentra una sombra","texto":"Observa una zona más oscura y nota el contraste entre ambas."},{"titulo":"Vuelve al espacio","texto":"Mira alrededor con naturalidad y termina cuando te resulte bien."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-306 · Pausa y presencia: La distancia que prefiero: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503306-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003306',
    'La distancia que prefiero',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Elige si quieres estar más cerca o más lejos de un objeto del entorno."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-307 · Pausa y presencia: Una respiración libre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503307-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003307',
    'Una respiración libre',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Deja que ocurra","texto":"No cambies el ritmo ni tomes una respiración más grande: solo nota una respiración tal como llega."},{"titulo":"Sigue con normalidad","texto":"Deja que la siguiente respiración ocurra sola, sin contarla ni alargarla."},{"titulo":"Vuelve a lo que hacías","texto":"Suelta la atención de la respiración y continúa a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-308 · Pausa y presencia: Vuelvo al presente sentado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503308-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003308',
    'Vuelvo al presente sentado',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Nota el contacto con el lugar donde estás y nombra mentalmente el espacio."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-309 · Pausa y presencia: Cerrar la pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503309-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003309',
    'Cerrar la pausa',
    1,
    '{"modo":"pasos","intro":"Esta pausa es breve y puedes terminarla cuando quieras.","avance":"manual","pasos":[{"titulo":"Nota un detalle","texto":"Elige un detalle del entorno para llevarte al siguiente momento."},{"titulo":"Cierra la pausa","texto":"Puedes terminar aquí y seguir a tu ritmo."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes saltarte un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-310 · Elecciones pequeñas: Elegir cómo seguir: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503310-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003310',
    'Elegir cómo seguir',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Elegir cómo seguir","texto":"Piensa en una actividad pendiente y escoge una forma de continuar: empezar, pedir ayuda o pausarla.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-311 · Elecciones pequeñas: Una opción amable: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503311-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003311',
    'Una opción amable',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una opción amable","texto":"Elige qué te conviene más para la siguiente hora: compañía, silencio o flexibilidad.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-312 · Elecciones pequeñas: Cambiar el plan: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503312-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003312',
    'Cambiar el plan',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Cambiar el plan","texto":"Escoge si quieres mantener, ajustar o aplazar un plan que no te resulta cómodo.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-313 · Elecciones pequeñas: Pedir claridad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503313-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003313',
    'Pedir claridad',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Pedir claridad","texto":"Decide qué paso te serviría más: hacer una pregunta, revisar un dato o esperar.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-314 · Elecciones pequeñas: Un gesto pequeño: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503314-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003314',
    'Un gesto pequeño',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un gesto pequeño","texto":"Elige un gesto de cuidado emocional: hablarlo, escribirlo, tomar aire libre o no hacer nada.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-315 · Elecciones pequeñas: Una respuesta posible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503315-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003315',
    'Una respuesta posible',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una respuesta posible","texto":"Ante una invitación, escoge la respuesta más honesta para tus ganas y tu tiempo.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-316 · Elecciones pequeñas: El siguiente paso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503316-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003316',
    'El siguiente paso',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"El siguiente paso","texto":"Elige entre avanzar un poco, dividir la tarea o dejarla para otro momento.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-317 · Elecciones pequeñas: Mi espacio ahora: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503317-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003317',
    'Mi espacio ahora',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Mi espacio ahora","texto":"Decide si quieres estar a solas, con alguien conocido o en un espacio compartido.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-318 · Elecciones pequeñas: Lo que quiero escuchar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503318-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003318',
    'Lo que quiero escuchar',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Lo que quiero escuchar","texto":"Escoge una frase que te gustaría recibir hoy: una pregunta, una escucha o un ánimo.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-319 · Elecciones pequeñas: Mi transición elegida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503319-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003319',
    'Mi transición elegida',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Mi transición elegida","texto":"Entre dos tareas, elige una transición que te sirva: ordenar el espacio, cambiar de actividad o tomar un momento.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-320 · Elecciones pequeñas: Una idea para después: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503320-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003320',
    'Una idea para después',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una idea para después","texto":"Decide qué asunto dejarás en pausa y cuándo te gustaría retomarlo, si lo sabes.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-321 · Elecciones pequeñas: Cómo cerrar una tarea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503321-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003321',
    'Cómo cerrar una tarea',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Cómo cerrar una tarea","texto":"Elige un cierre sencillo: guardar, anotar el siguiente paso o pedir que te releven.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-322 · Elecciones pequeñas: Un plan flexible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503322-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003322',
    'Un plan flexible',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un plan flexible","texto":"Escoge qué parte de un plan puedes cambiar si tus necesidades cambian.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-323 · Elecciones pequeñas: Elijo mi compañía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503323-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003323',
    'Elijo mi compañía',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Elijo mi compañía","texto":"Decide qué compañía te gustaría tener en una actividad cotidiana, si alguna.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-324 · Elecciones pequeñas: Un mensaje pendiente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503324-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003324',
    'Un mensaje pendiente',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un mensaje pendiente","texto":"Escoge si responderás ahora, más tarde o cuando tengas claro qué quieres decir.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-325 · Elecciones pequeñas: Una pregunta antes de sí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503325-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003325',
    'Una pregunta antes de sí',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una pregunta antes de sí","texto":"Elige qué preguntarías antes de aceptar: duración, responsabilidades o posibilidad de cambiar.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-326 · Elecciones pequeñas: Una versión más fácil: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503326-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003326',
    'Una versión más fácil',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Una versión más fácil","texto":"Selecciona una forma de reducir una tarea sin abandonar lo que te importa de ella.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-327 · Elecciones pequeñas: Hacer una pausa social: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503327-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003327',
    'Hacer una pausa social',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Hacer una pausa social","texto":"Escoge una señal para darte una pausa en una reunión o conversación.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-328 · Elecciones pequeñas: Un descanso elegido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503328-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003328',
    'Un descanso elegido',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un descanso elegido","texto":"Decide qué tipo de descanso te apetece probar: quietud, distracción o compañía.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-329 · Elecciones pequeñas: La primera prioridad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503329-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003329',
    'La primera prioridad',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"La primera prioridad","texto":"Elige qué necesidad atender primero: tiempo, información, espacio o ayuda práctica.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-330 · Elecciones pequeñas: Un compromiso posible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503330-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003330',
    'Un compromiso posible',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un compromiso posible","texto":"Escoge una versión realista de un compromiso para hoy o decide no asumirlo.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-331 · Elecciones pequeñas: Cambiar de tema: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503331-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003331',
    'Cambiar de tema',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Cambiar de tema","texto":"Elige una frase para cambiar de tema cuando ya no quieres continuar con uno.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-332 · Elecciones pequeñas: Dejar algo sin responder: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503332-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003332',
    'Dejar algo sin responder',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Dejar algo sin responder","texto":"Decide si una pregunta puede quedarse abierta hasta que tengas más ganas.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-333 · Elecciones pequeñas: Un lugar cómodo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503333-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003333',
    'Un lugar cómodo',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Un lugar cómodo","texto":"Escoge dónde te gustaría conversar: en un sitio familiar, neutral o por mensaje.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-334 · Elecciones pequeñas: Hacerlo acompañado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503334-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003334',
    'Hacerlo acompañado',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Hacerlo acompañado","texto":"Elige si prefieres hacer una tarea con compañía, con apoyo puntual o por tu cuenta.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-335 · Elecciones pequeñas: Mi manera de agradecer: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503335-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003335',
    'Mi manera de agradecer',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Mi manera de agradecer","texto":"Decide cómo expresarías agradecimiento: en persona, con una nota o sin decirlo todavía.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-336 · Elecciones pequeñas: Pedir un cambio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503336-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003336',
    'Pedir un cambio',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Pedir un cambio","texto":"Elige una forma clara de proponer un cambio pequeño en un acuerdo.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-337 · Elecciones pequeñas: Decir lo que prefiero: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503337-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003337',
    'Decir lo que prefiero',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Decir lo que prefiero","texto":"Escoge una frase que exprese tu preferencia sin pedir disculpas por tenerla.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-338 · Elecciones pequeñas: Pausar el teléfono: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503338-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003338',
    'Pausar el teléfono',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Pausar el teléfono","texto":"Elige si quieres silenciar avisos durante un rato, mantenerlos o decidirlo luego.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-339 · Elecciones pequeñas: Terminar a mi ritmo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503339-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003339',
    'Terminar a mi ritmo',
    1,
    '{"modo":"tarjeta","indicacion":"No hay una respuesta que debas elegir.","titulo":"Terminar a mi ritmo","texto":"Decide qué señal te indicará que es suficiente por ahora.","opciones":[{"clave":"primera","texto":"Lo intento ahora"},{"clave":"segunda","texto":"Lo adapto a mi manera"},{"clave":"paso","texto":"Lo dejo para otro momento"}],"cierre":"Gracias por elegir a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-340 · Preferencias y expresión: Mi forma de recibir apoyo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503340-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003340',
    'Mi forma de recibir apoyo',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Cuando quiero apoyo, me ayuda más…». Puedes escribir una opción o dejarlo vacío.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-341 · Preferencias y expresión: Una conversación cómoda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503341-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003341',
    'Una conversación cómoda',
    1,
    '{"modo":"escritura","invitacion":"Describe una condición que hace más cómoda para ti una conversación importante.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-342 · Preferencias y expresión: Una invitación ideal: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503342-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003342',
    'Una invitación ideal',
    1,
    '{"modo":"escritura","invitacion":"Escribe cómo sería una invitación que te permitiera responder con libertad.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-343 · Preferencias y expresión: Mi señal de pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503343-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003343',
    'Mi señal de pausa',
    1,
    '{"modo":"escritura","invitacion":"Inventa una palabra o gesto que puedas usar para pedir una pausa.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-344 · Preferencias y expresión: Una forma de celebrar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503344-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003344',
    'Una forma de celebrar',
    1,
    '{"modo":"escritura","invitacion":"Anota cómo te gusta celebrar algo pequeño, incluso si prefieres no celebrarlo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-345 · Preferencias y expresión: Una preferencia que cambia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503345-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003345',
    'Una preferencia que cambia',
    1,
    '{"modo":"escritura","invitacion":"Nombra una preferencia que puede variar según el día y está bien que cambie.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-346 · Preferencias y expresión: Mi espacio para decidir: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503346-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003346',
    'Mi espacio para decidir',
    1,
    '{"modo":"escritura","invitacion":"Escribe qué necesitas para sentir que una decisión es realmente tuya.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-347 · Preferencias y expresión: Una pregunta que me sirve: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503347-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003347',
    'Una pregunta que me sirve',
    1,
    '{"modo":"escritura","invitacion":"Anota una pregunta que te ayude a reconocer lo que prefieres en un momento social.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-348 · Preferencias y expresión: Un límite que quiero cuidar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503348-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003348',
    'Un límite que quiero cuidar',
    1,
    '{"modo":"escritura","invitacion":"Escribe un límite cotidiano que te gustaría recordar, sin tener que aplicarlo ahora.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-349 · Preferencias y expresión: La palabra para pedir tiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503349-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003349',
    'La palabra para pedir tiempo',
    1,
    '{"modo":"escritura","invitacion":"Elige una palabra que te ayude a no responder con prisa y escribe una frase con ella.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-350 · Preferencias y expresión: Mi manera de decir gracias: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503350-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003350',
    'Mi manera de decir gracias',
    1,
    '{"modo":"escritura","invitacion":"Describe qué forma de agradecimiento se siente más natural para ti.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-351 · Preferencias y expresión: Una conversación que puedo posponer: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503351-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003351',
    'Una conversación que puedo posponer',
    1,
    '{"modo":"escritura","invitacion":"Nombra un tema que no necesitas hablar hoy y una fecha o señal para retomarlo, si quieres.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-352 · Preferencias y expresión: Cómo me gusta escuchar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503352-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003352',
    'Cómo me gusta escuchar',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Cuando cuento algo, prefiero que la otra persona…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-353 · Preferencias y expresión: Una frase que me representa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503353-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003353',
    'Una frase que me representa',
    1,
    '{"modo":"escritura","invitacion":"Escribe una frase breve que exprese una opinión propia sin compararte con nadie.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-354 · Preferencias y expresión: Lo que prefiero reservar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503354-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003354',
    'Lo que prefiero reservar',
    1,
    '{"modo":"escritura","invitacion":"Nombra un tema personal que eliges guardar para ti por ahora.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-355 · Preferencias y expresión: Una forma de pedir claridad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503355-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003355',
    'Una forma de pedir claridad',
    1,
    '{"modo":"escritura","invitacion":"Redacta una pregunta sencilla que podrías hacer cuando algo no queda claro.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-356 · Preferencias y expresión: Mi ritmo al responder: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503356-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003356',
    'Mi ritmo al responder',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Para responder con calma, me sirve…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-357 · Preferencias y expresión: Un plan con alternativas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503357-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003357',
    'Un plan con alternativas',
    1,
    '{"modo":"escritura","invitacion":"Escribe dos maneras distintas de participar en un plan sin tener que elegir todavía.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-358 · Preferencias y expresión: La compañía que prefiero: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503358-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003358',
    'La compañía que prefiero',
    1,
    '{"modo":"escritura","invitacion":"Describe qué tipo de compañía te apetece en una tarde tranquila.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-359 · Preferencias y expresión: Una voz que escucho: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503359-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003359',
    'Una voz que escucho',
    1,
    '{"modo":"escritura","invitacion":"Anota una frase que te gustaría escuchar cuando compartes una duda.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-360 · Preferencias y expresión: Lo que sí quiero compartir: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503360-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003360',
    'Lo que sí quiero compartir',
    1,
    '{"modo":"escritura","invitacion":"Elige algo que sí te gusta contar de ti y escríbelo en una línea.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-361 · Preferencias y expresión: Mi manera de cambiar de opinión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503361-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003361',
    'Mi manera de cambiar de opinión',
    1,
    '{"modo":"escritura","invitacion":"Escribe una frase para explicar que cambiaste de parecer.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-362 · Preferencias y expresión: Un espacio propio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503362-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003362',
    'Un espacio propio',
    1,
    '{"modo":"escritura","invitacion":"Nombra un lugar o momento del día en el que te gusta tener espacio propio.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-363 · Preferencias y expresión: Una petición sencilla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503363-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003363',
    'Una petición sencilla',
    1,
    '{"modo":"escritura","invitacion":"Redacta una petición concreta que te haría más fácil una tarea cotidiana.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-364 · Preferencias y expresión: Un acuerdo flexible: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503364-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003364',
    'Un acuerdo flexible',
    1,
    '{"modo":"escritura","invitacion":"Completa: «Un acuerdo me funciona mejor cuando…».","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-365 · Preferencias y expresión: Mi señal de comodidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503365-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003365',
    'Mi señal de comodidad',
    1,
    '{"modo":"escritura","invitacion":"Describe un detalle que te hace sentir cómodo al conocer un lugar nuevo.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- EMO-366 · Preferencias y expresión: Una elección sin testigos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e503366-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000003366',
    'Una elección sin testigos',
    1,
    '{"modo":"escritura","invitacion":"Anota una decisión pequeña que prefieres tomar sin que nadie la califique.","campos":1,"minimo":0,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Puedes guardar, borrar o dejarlo en blanco."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;
