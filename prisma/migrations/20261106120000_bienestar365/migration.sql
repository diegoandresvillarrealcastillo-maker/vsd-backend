-- Bienestar 365 · 356 actividades concretas para completar las 365 fichas.
--
-- Solo datos, aditiva e idempotente. Usa el motor cuestionario_corto y la pantalla VSD existente.
-- Todas quedan pendientes de revisión profesional y sin publicar. La migración no aprueba ni habilita contenido.
-- La publicación requiere una revisión registrada en la hoja oficial de SCRUM-228.
--

-- ---------------------------------------------------------------------------
-- 1. Las mecanicas, PRIMERO (356)
-- ---------------------------------------------------------------------------

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor", "franja"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000210',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Prepara un lugar',
    'bitacora',
    'Prepara un lugar',
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
    '0acd0000-0000-4000-8000-000000000211',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Haz una ronda',
    'bitacora',
    'Haz una ronda',
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
    '0acd0000-0000-4000-8000-000000000212',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Escoge una señal',
    'bitacora',
    'Escoge una señal',
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
    '0acd0000-0000-4000-8000-000000000213',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Envía a alguien',
    'bitacora',
    'Envía a alguien',
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
    '0acd0000-0000-4000-8000-000000000214',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Inventa un título',
    'bitacora',
    'Inventa un título',
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
    '0acd0000-0000-4000-8000-000000000215',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Pon palabra perfecta',
    'bitacora',
    'Pon palabra perfecta',
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
    '0acd0000-0000-4000-8000-000000000216',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Divide un pendiente',
    'bitacora',
    'Divide un pendiente',
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
    '0acd0000-0000-4000-8000-000000000217',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Elige una comida',
    'bitacora',
    'Elige una comida',
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
    '0acd0000-0000-4000-8000-000000000218',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Ensaya una respuesta',
    'bitacora',
    'Ensaya una respuesta',
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
    '0acd0000-0000-4000-8000-000000000219',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Resuelve una sección',
    'bitacora',
    'Resuelve una sección',
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
    '0acd0000-0000-4000-8000-000000000220',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Silencia respuesta inmediata',
    'bitacora',
    'Silencia respuesta inmediata',
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
    '0acd0000-0000-4000-8000-000000000221',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Elige un trayecto',
    'bitacora',
    'Elige un trayecto',
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
    '0acd0000-0000-4000-8000-000000000222',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Aprende una palabra',
    'bitacora',
    'Aprende una palabra',
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
    '0acd0000-0000-4000-8000-000000000223',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Escoge una prenda',
    'bitacora',
    'Escoge una prenda',
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
    '0acd0000-0000-4000-8000-000000000224',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Prueba una secuencia',
    'bitacora',
    'Prueba una secuencia',
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
    '0acd0000-0000-4000-8000-000000000225',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Elige qué actividad',
    'bitacora',
    'Elige qué actividad',
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
    '0acd0000-0000-4000-8000-000000000226',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Pregunta conversar hoy',
    'bitacora',
    'Pregunta conversar hoy',
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
    '0acd0000-0000-4000-8000-000000000227',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Dibuja un objeto',
    'bitacora',
    'Dibuja un objeto',
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
    '0acd0000-0000-4000-8000-000000000228',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Separa en dos',
    'bitacora',
    'Separa en dos',
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
    '0acd0000-0000-4000-8000-000000000229',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Agrupa tus tareas',
    'bitacora',
    'Agrupa tus tareas',
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
    '0acd0000-0000-4000-8000-000000000230',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prueba una combinación',
    'bitacora',
    'Prueba una combinación',
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
    '0acd0000-0000-4000-8000-000000000231',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Elige qué información',
    'bitacora',
    'Elige qué información',
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
    '0acd0000-0000-4000-8000-000000000232',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Elige una canción',
    'bitacora',
    'Elige una canción',
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
    '0acd0000-0000-4000-8000-000000000233',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Revisa qué aplicaciones',
    'bitacora',
    'Revisa qué aplicaciones',
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
    '0acd0000-0000-4000-8000-000000000234',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Si te es',
    'bitacora',
    'Si te es',
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
    '0acd0000-0000-4000-8000-000000000235',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Pídele a alguien',
    'bitacora',
    'Pídele a alguien',
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
    '0acd0000-0000-4000-8000-000000000236',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Haz una lista',
    'bitacora',
    'Haz una lista',
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
    '0acd0000-0000-4000-8000-000000000237',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Dibuja en el',
    'bitacora',
    'Dibuja en el',
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
    '0acd0000-0000-4000-8000-000000000238',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Haz una pantalla',
    'bitacora',
    'Haz una pantalla',
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
    '0acd0000-0000-4000-8000-000000000239',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Comparte un recuerdo',
    'bitacora',
    'Comparte un recuerdo',
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
    '0acd0000-0000-4000-8000-000000000240',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Escribe un diálogo',
    'bitacora',
    'Escribe un diálogo',
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
    '0acd0000-0000-4000-8000-000000000241',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Elige una frase',
    'bitacora',
    'Elige una frase',
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
    '0acd0000-0000-4000-8000-000000000242',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Elige una tarea',
    'bitacora',
    'Elige una tarea',
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
    '0acd0000-0000-4000-8000-000000000243',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prepara un acompañamiento',
    'bitacora',
    'Prepara un acompañamiento',
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
    '0acd0000-0000-4000-8000-000000000244',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Pide otra manera',
    'bitacora',
    'Pide otra manera',
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
    '0acd0000-0000-4000-8000-000000000245',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Juega una ronda',
    'bitacora',
    'Juega una ronda',
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
    '0acd0000-0000-4000-8000-000000000246',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Elimina una captura',
    'bitacora',
    'Elimina una captura',
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
    '0acd0000-0000-4000-8000-000000000247',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Sal harás allí',
    'bitacora',
    'Sal harás allí',
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
    '0acd0000-0000-4000-8000-000000000248',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Elige sus pasos',
    'bitacora',
    'Elige sus pasos',
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
    '0acd0000-0000-4000-8000-000000000249',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Cambia de sitio',
    'bitacora',
    'Cambia de sitio',
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
    '0acd0000-0000-4000-8000-000000000250',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Cambia de postura',
    'bitacora',
    'Cambia de postura',
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
    '0acd0000-0000-4000-8000-000000000251',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Decide qué conversación',
    'bitacora',
    'Decide qué conversación',
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
    '0acd0000-0000-4000-8000-000000000252',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Agradece una ayuda',
    'bitacora',
    'Agradece una ayuda',
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
    '0acd0000-0000-4000-8000-000000000253',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Crea una lista',
    'bitacora',
    'Crea una lista',
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
    '0acd0000-0000-4000-8000-000000000254',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Escribe qué necesitarías',
    'bitacora',
    'Escribe qué necesitarías',
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
    '0acd0000-0000-4000-8000-000000000255',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Prepara una lista',
    'bitacora',
    'Prepara una lista',
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
    '0acd0000-0000-4000-8000-000000000256',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Escoge una receta',
    'bitacora',
    'Escoge una receta',
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
    '0acd0000-0000-4000-8000-000000000257',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Decide cuánto tiempo',
    'bitacora',
    'Decide cuánto tiempo',
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
    '0acd0000-0000-4000-8000-000000000258',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Haz planearlas aún',
    'bitacora',
    'Haz planearlas aún',
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
    '0acd0000-0000-4000-8000-000000000259',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Deja el teléfono',
    'bitacora',
    'Deja el teléfono',
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
    '0acd0000-0000-4000-8000-000000000260',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Visita una tienda',
    'bitacora',
    'Visita una tienda',
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
    '0acd0000-0000-4000-8000-000000000261',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Mira un tutorial',
    'bitacora',
    'Mira un tutorial',
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
    '0acd0000-0000-4000-8000-000000000262',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Deja que disfrutes',
    'bitacora',
    'Deja que disfrutes',
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
    '0acd0000-0000-4000-8000-000000000263',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Haz una secuencia',
    'bitacora',
    'Haz una secuencia',
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
    '0acd0000-0000-4000-8000-000000000264',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Prueba una nota',
    'bitacora',
    'Prueba una nota',
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
    '0acd0000-0000-4000-8000-000000000265',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Invita a alguien',
    'bitacora',
    'Invita a alguien',
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
    '0acd0000-0000-4000-8000-000000000266',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Diseña en papel',
    'bitacora',
    'Diseña en papel',
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
    '0acd0000-0000-4000-8000-000000000267',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Haz una tarjeta',
    'bitacora',
    'Haz una tarjeta',
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
    '0acd0000-0000-4000-8000-000000000268',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Agrupa en el',
    'bitacora',
    'Agrupa en el',
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
    '0acd0000-0000-4000-8000-000000000269',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Combina dos texturas',
    'bitacora',
    'Combina dos texturas',
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
    '0acd0000-0000-4000-8000-000000000270',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Practica otro momento',
    'bitacora',
    'Practica otro momento',
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
    '0acd0000-0000-4000-8000-000000000271',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Construye una figura',
    'bitacora',
    'Construye una figura',
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
    '0acd0000-0000-4000-8000-000000000272',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Configura un modo',
    'bitacora',
    'Configura un modo',
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
    '0acd0000-0000-4000-8000-000000000273',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Busca una banca',
    'bitacora',
    'Busca una banca',
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
    '0acd0000-0000-4000-8000-000000000274',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Lee una página',
    'bitacora',
    'Lee una página',
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
    '0acd0000-0000-4000-8000-000000000275',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Elige cinco minutos',
    'bitacora',
    'Elige cinco minutos',
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
    '0acd0000-0000-4000-8000-000000000276',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Coordina una mano',
    'bitacora',
    'Coordina una mano',
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
    '0acd0000-0000-4000-8000-000000000277',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Elige una hora',
    'bitacora',
    'Elige una hora',
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
    '0acd0000-0000-4000-8000-000000000278',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Escucha una historia',
    'bitacora',
    'Escucha una historia',
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
    '0acd0000-0000-4000-8000-000000000279',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Escribe una receta',
    'bitacora',
    'Escribe una receta',
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
    '0acd0000-0000-4000-8000-000000000280',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Piensa que hiciste',
    'bitacora',
    'Piensa que hiciste',
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
    '0acd0000-0000-4000-8000-000000000281',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Crea un recordatorio',
    'bitacora',
    'Crea un recordatorio',
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
    '0acd0000-0000-4000-8000-000000000282',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Elige qué te',
    'bitacora',
    'Elige qué te',
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
    '0acd0000-0000-4000-8000-000000000283',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Elige una preferencia',
    'bitacora',
    'Elige una preferencia',
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
    '0acd0000-0000-4000-8000-000000000284',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Busca una palabra',
    'bitacora',
    'Busca una palabra',
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
    '0acd0000-0000-4000-8000-000000000285',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Cancela una notificación',
    'bitacora',
    'Cancela una notificación',
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
    '0acd0000-0000-4000-8000-000000000286',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Saluda tengas confianza',
    'bitacora',
    'Saluda tengas confianza',
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
    '0acd0000-0000-4000-8000-000000000287',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Practica una frase',
    'bitacora',
    'Practica una frase',
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
    '0acd0000-0000-4000-8000-000000000288',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Revisa qué objeto',
    'bitacora',
    'Revisa qué objeto',
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
    '0acd0000-0000-4000-8000-000000000289',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Sigue con los',
    'bitacora',
    'Sigue con los',
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
    '0acd0000-0000-4000-8000-000000000290',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Prepara una transición',
    'bitacora',
    'Prepara una transición',
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
    '0acd0000-0000-4000-8000-000000000291',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Escribe un mensaje',
    'bitacora',
    'Escribe un mensaje',
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
    '0acd0000-0000-4000-8000-000000000292',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Haz un mapa',
    'bitacora',
    'Haz un mapa',
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
    '0acd0000-0000-4000-8000-000000000293',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Elige una acción',
    'bitacora',
    'Elige una acción',
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
    '0acd0000-0000-4000-8000-000000000294',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Elimina una tarea',
    'bitacora',
    'Elimina una tarea',
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
    '0acd0000-0000-4000-8000-000000000295',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prueba mismo tiempo',
    'bitacora',
    'Prueba mismo tiempo',
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
    '0acd0000-0000-4000-8000-000000000296',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Escribe una frase',
    'bitacora',
    'Escribe una frase',
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
    '0acd0000-0000-4000-8000-000000000297',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Elige un pasatiempo',
    'bitacora',
    'Elige un pasatiempo',
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
    '0acd0000-0000-4000-8000-000000000298',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Organiza tus fotos',
    'bitacora',
    'Organiza tus fotos',
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
    '0acd0000-0000-4000-8000-000000000299',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Elige un lugar',
    'bitacora',
    'Elige un lugar',
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
    '0acd0000-0000-4000-8000-000000002100',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Pregunta su familia',
    'bitacora',
    'Pregunta su familia',
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
    '0acd0000-0000-4000-8000-000000002101',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Acomoda una silla',
    'bitacora',
    'Acomoda una silla',
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
    '0acd0000-0000-4000-8000-000000002102',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Practica para ti',
    'bitacora',
    'Practica para ti',
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
    '0acd0000-0000-4000-8000-000000002103',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Anota qué te',
    'bitacora',
    'Anota qué te',
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
    '0acd0000-0000-4000-8000-000000002104',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Pide haría bien',
    'bitacora',
    'Pide haría bien',
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
    '0acd0000-0000-4000-8000-000000002105',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Inventa un final',
    'bitacora',
    'Inventa un final',
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
    '0acd0000-0000-4000-8000-000000002106',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Practica para pensarlo',
    'bitacora',
    'Practica para pensarlo',
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
    '0acd0000-0000-4000-8000-000000002107',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Ordena un archivo',
    'bitacora',
    'Ordena un archivo',
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
    '0acd0000-0000-4000-8000-000000002108',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Invita una comida',
    'bitacora',
    'Invita una comida',
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
    '0acd0000-0000-4000-8000-000000002109',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Decide qué parte',
    'bitacora',
    'Decide qué parte',
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
    '0acd0000-0000-4000-8000-000000002110',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Haz una competencia',
    'bitacora',
    'Haz una competencia',
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
    '0acd0000-0000-4000-8000-000000002111',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Haz una pausa',
    'bitacora',
    'Haz una pausa',
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
    '0acd0000-0000-4000-8000-000000002112',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Recoge un papel',
    'bitacora',
    'Recoge un papel',
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
    '0acd0000-0000-4000-8000-000000002113',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Identifica una herramienta',
    'bitacora',
    'Identifica una herramienta',
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
    '0acd0000-0000-4000-8000-000000002114',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Prepara los materiales',
    'bitacora',
    'Prepara los materiales',
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
    '0acd0000-0000-4000-8000-000000002115',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Haz una ruta',
    'bitacora',
    'Haz una ruta',
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
    '0acd0000-0000-4000-8000-000000002116',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Cambia una actividad',
    'bitacora',
    'Cambia una actividad',
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
    '0acd0000-0000-4000-8000-000000002117',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Propón una conversación',
    'bitacora',
    'Propón una conversación',
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
    '0acd0000-0000-4000-8000-000000002118',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Crea un ritmo',
    'bitacora',
    'Crea un ritmo',
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
    '0acd0000-0000-4000-8000-000000002119',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Nombra para aclararlo',
    'bitacora',
    'Nombra para aclararlo',
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
    '0acd0000-0000-4000-8000-000000002120',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Deja una nota',
    'bitacora',
    'Deja una nota',
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
    '0acd0000-0000-4000-8000-000000002121',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Elige una fruta',
    'bitacora',
    'Elige una fruta',
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
    '0acd0000-0000-4000-8000-000000002122',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Practica mensaje importante',
    'bitacora',
    'Practica mensaje importante',
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
    '0acd0000-0000-4000-8000-000000002123',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Crea una adivinanza',
    'bitacora',
    'Crea una adivinanza',
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
    '0acd0000-0000-4000-8000-000000002124',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Revisa quién puede',
    'bitacora',
    'Revisa quién puede',
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
    '0acd0000-0000-4000-8000-000000002125',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Llama te interese',
    'bitacora',
    'Llama te interese',
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
    '0acd0000-0000-4000-8000-000000002126',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Enséñale a alguien',
    'bitacora',
    'Enséñale a alguien',
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
    '0acd0000-0000-4000-8000-000000002127',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Decide qué pendiente',
    'bitacora',
    'Decide qué pendiente',
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
    '0acd0000-0000-4000-8000-000000002128',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Alterna el pulgar',
    'bitacora',
    'Alterna el pulgar',
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
    '0acd0000-0000-4000-8000-000000002129',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Escoge un sonido',
    'bitacora',
    'Escoge un sonido',
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
    '0acd0000-0000-4000-8000-000000002130',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Reconoce ejemplo específico',
    'bitacora',
    'Reconoce ejemplo específico',
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
    '0acd0000-0000-4000-8000-000000002131',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Escribe una nota',
    'bitacora',
    'Escribe una nota',
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
    '0acd0000-0000-4000-8000-000000002132',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Escoge una actividad',
    'bitacora',
    'Escoge una actividad',
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
    '0acd0000-0000-4000-8000-000000002133',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Crea pueden esperar',
    'bitacora',
    'Crea pueden esperar',
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
    '0acd0000-0000-4000-8000-000000002134',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prepara poco tiempo',
    'bitacora',
    'Prepara poco tiempo',
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
    '0acd0000-0000-4000-8000-000000002135',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Elige un compromiso',
    'bitacora',
    'Elige un compromiso',
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
    '0acd0000-0000-4000-8000-000000002136',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Elige una fotografía',
    'bitacora',
    'Elige una fotografía',
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
    '0acd0000-0000-4000-8000-000000002137',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Cierra este dispositivo',
    'bitacora',
    'Cierra este dispositivo',
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
    '0acd0000-0000-4000-8000-000000002138',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Explora una ruta',
    'bitacora',
    'Explora una ruta',
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
    '0acd0000-0000-4000-8000-000000002139',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Elige una actividad',
    'bitacora',
    'Elige una actividad',
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
    '0acd0000-0000-4000-8000-000000002140',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Limpia con frecuencia',
    'bitacora',
    'Limpia con frecuencia',
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
    '0acd0000-0000-4000-8000-000000002141',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Prueba el cuello',
    'bitacora',
    'Prueba el cuello',
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
    '0acd0000-0000-4000-8000-000000002142',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Identifica una tarea',
    'bitacora',
    'Identifica una tarea',
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
    '0acd0000-0000-4000-8000-000000002143',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Comparte una foto',
    'bitacora',
    'Comparte una foto',
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
    '0acd0000-0000-4000-8000-000000002144',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Dibuja una escena',
    'bitacora',
    'Dibuja una escena',
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
    '0acd0000-0000-4000-8000-000000002145',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Escribe cómo explicarías',
    'bitacora',
    'Escribe cómo explicarías',
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
    '0acd0000-0000-4000-8000-000000002146',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Compara dos formas',
    'bitacora',
    'Compara dos formas',
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
    '0acd0000-0000-4000-8000-000000002147',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prueba un utensilio',
    'bitacora',
    'Prueba un utensilio',
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
    '0acd0000-0000-4000-8000-000000002148',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Formula una petición',
    'bitacora',
    'Formula una petición',
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
    '0acd0000-0000-4000-8000-000000002149',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Escoge tres canciones',
    'bitacora',
    'Escoge tres canciones',
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
    '0acd0000-0000-4000-8000-000000002150',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Elige una franja',
    'bitacora',
    'Elige una franja',
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
    '0acd0000-0000-4000-8000-000000002151',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Pasa la comunidad',
    'bitacora',
    'Pasa la comunidad',
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
    '0acd0000-0000-4000-8000-000000002152',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Anota una pregunta',
    'bitacora',
    'Anota una pregunta',
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
    '0acd0000-0000-4000-8000-000000002153',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Elige una cosa',
    'bitacora',
    'Elige una cosa',
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
    '0acd0000-0000-4000-8000-000000002154',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Imita con las',
    'bitacora',
    'Imita con las',
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
    '0acd0000-0000-4000-8000-000000002155',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Haz sin calificarlas',
    'bitacora',
    'Haz sin calificarlas',
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
    '0acd0000-0000-4000-8000-000000002156',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Pregunta a alguien',
    'bitacora',
    'Pregunta a alguien',
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
    '0acd0000-0000-4000-8000-000000002157',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Inventa una palabra',
    'bitacora',
    'Inventa una palabra',
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
    '0acd0000-0000-4000-8000-000000002158',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Prioriza una decisión',
    'bitacora',
    'Prioriza una decisión',
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
    '0acd0000-0000-4000-8000-000000002159',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Agrupa los objetos',
    'bitacora',
    'Agrupa los objetos',
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
    '0acd0000-0000-4000-8000-000000002160',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Elige una música',
    'bitacora',
    'Elige una música',
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
    '0acd0000-0000-4000-8000-000000002161',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Decide qué horario',
    'bitacora',
    'Decide qué horario',
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
    '0acd0000-0000-4000-8000-000000002162',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Prueba una receta',
    'bitacora',
    'Prueba una receta',
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
    '0acd0000-0000-4000-8000-000000002163',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Cambia el fondo',
    'bitacora',
    'Cambia el fondo',
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
    '0acd0000-0000-4000-8000-000000002164',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Elige un punto',
    'bitacora',
    'Elige un punto',
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
    '0acd0000-0000-4000-8000-000000002165',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Aprende un dato',
    'bitacora',
    'Aprende un dato',
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
    '0acd0000-0000-4000-8000-000000002166',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Separa o bolsillo',
    'bitacora',
    'Separa o bolsillo',
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
    '0acd0000-0000-4000-8000-000000002167',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Haz lo necesitas',
    'bitacora',
    'Haz lo necesitas',
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
    '0acd0000-0000-4000-8000-000000002168',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Elige un espacio',
    'bitacora',
    'Elige un espacio',
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
    '0acd0000-0000-4000-8000-000000002169',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Invita su manera',
    'bitacora',
    'Invita su manera',
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
    '0acd0000-0000-4000-8000-000000002170',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Crea una postal',
    'bitacora',
    'Crea una postal',
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
    '0acd0000-0000-4000-8000-000000002171',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Elige a quién',
    'bitacora',
    'Elige a quién',
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
    '0acd0000-0000-4000-8000-000000002172',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Revisa tus compromisos',
    'bitacora',
    'Revisa tus compromisos',
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
    '0acd0000-0000-4000-8000-000000002173',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prepara una merienda',
    'bitacora',
    'Prepara una merienda',
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
    '0acd0000-0000-4000-8000-000000002174',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Practica una decisión',
    'bitacora',
    'Practica una decisión',
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
    '0acd0000-0000-4000-8000-000000002175',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Dibuja un mapa',
    'bitacora',
    'Dibuja un mapa',
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
    '0acd0000-0000-4000-8000-000000002176',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Guarda una página',
    'bitacora',
    'Guarda una página',
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
    '0acd0000-0000-4000-8000-000000002177',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Deja un libro',
    'bitacora',
    'Deja un libro',
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
    '0acd0000-0000-4000-8000-000000002178',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Practica paso olvidaste',
    'bitacora',
    'Practica paso olvidaste',
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
    '0acd0000-0000-4000-8000-000000002179',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Haz del lugar',
    'bitacora',
    'Haz del lugar',
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
    '0acd0000-0000-4000-8000-000000002180',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Pasa una pelota',
    'bitacora',
    'Pasa una pelota',
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
    '0acd0000-0000-4000-8000-000000002181',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Decide si esta',
    'bitacora',
    'Decide si esta',
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
    '0acd0000-0000-4000-8000-000000002182',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Ofrece persona decida',
    'bitacora',
    'Ofrece persona decida',
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
    '0acd0000-0000-4000-8000-000000002183',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Escribe una historia',
    'bitacora',
    'Escribe una historia',
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
    '0acd0000-0000-4000-8000-000000002184',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Describe un momento',
    'bitacora',
    'Describe un momento',
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
    '0acd0000-0000-4000-8000-000000002185',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Elige un cajón',
    'bitacora',
    'Elige un cajón',
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
    '0acd0000-0000-4000-8000-000000002186',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Recuerda una comida',
    'bitacora',
    'Recuerda una comida',
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
    '0acd0000-0000-4000-8000-000000002187',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Elige una responsabilidad',
    'bitacora',
    'Elige una responsabilidad',
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
    '0acd0000-0000-4000-8000-000000002188',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Elige una película',
    'bitacora',
    'Elige una película',
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
    '0acd0000-0000-4000-8000-000000002189',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Revisa qué permisos',
    'bitacora',
    'Revisa qué permisos',
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
    '0acd0000-0000-4000-8000-000000002190',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Busca un evento',
    'bitacora',
    'Busca un evento',
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
    '0acd0000-0000-4000-8000-000000002191',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Elige un objeto',
    'bitacora',
    'Elige un objeto',
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
    '0acd0000-0000-4000-8000-000000002192',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Deja empezar mañana',
    'bitacora',
    'Deja empezar mañana',
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
    '0acd0000-0000-4000-8000-000000002193',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Acompaña una canción',
    'bitacora',
    'Acompaña una canción',
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
    '0acd0000-0000-4000-8000-000000002194',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Prepara una nota',
    'bitacora',
    'Prepara una nota',
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
    '0acd0000-0000-4000-8000-000000002195',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Solicita una explicación',
    'bitacora',
    'Solicita una explicación',
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
    '0acd0000-0000-4000-8000-000000002196',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Diseña una portada',
    'bitacora',
    'Diseña una portada',
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
    '0acd0000-0000-4000-8000-000000002197',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Haz una conversación',
    'bitacora',
    'Haz una conversación',
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
    '0acd0000-0000-4000-8000-000000002198',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Convierte una instrucción',
    'bitacora',
    'Convierte una instrucción',
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
    '0acd0000-0000-4000-8000-000000002199',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Organiza los ingredientes',
    'bitacora',
    'Organiza los ingredientes',
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
    '0acd0000-0000-4000-8000-000000002200',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Escribe una respuesta',
    'bitacora',
    'Escribe una respuesta',
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
    '0acd0000-0000-4000-8000-000000002201',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Juega a describir',
    'bitacora',
    'Juega a describir',
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
    '0acd0000-0000-4000-8000-000000002202',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Ordena la pantalla',
    'bitacora',
    'Ordena la pantalla',
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
    '0acd0000-0000-4000-8000-000000002203',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Riega una planta',
    'bitacora',
    'Riega una planta',
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
    '0acd0000-0000-4000-8000-000000002204',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Pídele parecido útil',
    'bitacora',
    'Pídele parecido útil',
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
    '0acd0000-0000-4000-8000-000000002205',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Pon a cargar',
    'bitacora',
    'Pon a cargar',
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
    '0acd0000-0000-4000-8000-000000002206',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Estira una pierna',
    'bitacora',
    'Estira una pierna',
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
    '0acd0000-0000-4000-8000-000000002207',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Escoge la vez',
    'bitacora',
    'Escoge la vez',
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
    '0acd0000-0000-4000-8000-000000002208',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Cuéntale a alguien',
    'bitacora',
    'Cuéntale a alguien',
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
    '0acd0000-0000-4000-8000-000000002209',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Haz un collage',
    'bitacora',
    'Haz un collage',
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
    '0acd0000-0000-4000-8000-000000002210',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Recuerda una ocasión',
    'bitacora',
    'Recuerda una ocasión',
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
    '0acd0000-0000-4000-8000-000000002211',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Marca qué tarea',
    'bitacora',
    'Marca qué tarea',
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
    '0acd0000-0000-4000-8000-000000002212',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Elige un alimento',
    'bitacora',
    'Elige un alimento',
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
    '0acd0000-0000-4000-8000-000000002213',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Señala qué condición',
    'bitacora',
    'Señala qué condición',
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
    '0acd0000-0000-4000-8000-000000002214',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Crea una categoría',
    'bitacora',
    'Crea una categoría',
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
    '0acd0000-0000-4000-8000-000000002215',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Establece un límite',
    'bitacora',
    'Establece un límite',
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
    '0acd0000-0000-4000-8000-000000002216',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Elige un comercio',
    'bitacora',
    'Elige un comercio',
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
    '0acd0000-0000-4000-8000-000000002217',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Aprende una regla',
    'bitacora',
    'Aprende una regla',
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
    '0acd0000-0000-4000-8000-000000002218',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Prepara un espacio',
    'bitacora',
    'Prepara un espacio',
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
    '0acd0000-0000-4000-8000-000000002219',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Haz una coreografía',
    'bitacora',
    'Haz una coreografía',
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
    '0acd0000-0000-4000-8000-000000002220',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Deja un margen',
    'bitacora',
    'Deja un margen',
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
    '0acd0000-0000-4000-8000-000000002221',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Propón una llamada',
    'bitacora',
    'Propón una llamada',
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
    '0acd0000-0000-4000-8000-000000002222',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Describe un color',
    'bitacora',
    'Describe un color',
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
    '0acd0000-0000-4000-8000-000000002223',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Cambia una autocrítica',
    'bitacora',
    'Cambia una autocrítica',
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
    '0acd0000-0000-4000-8000-000000002224',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Prepara un menú',
    'bitacora',
    'Prepara un menú',
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
    '0acd0000-0000-4000-8000-000000002225',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prepara una bebida',
    'bitacora',
    'Prepara una bebida',
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
    '0acd0000-0000-4000-8000-000000002226',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Elige si quieres',
    'bitacora',
    'Elige si quieres',
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
    '0acd0000-0000-4000-8000-000000002227',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Inventa un nombre',
    'bitacora',
    'Inventa un nombre',
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
    '0acd0000-0000-4000-8000-000000002228',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Lee un mensaje',
    'bitacora',
    'Lee un mensaje',
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
    '0acd0000-0000-4000-8000-000000002229',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Si ya tienes',
    'bitacora',
    'Si ya tienes',
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
    '0acd0000-0000-4000-8000-000000002230',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Prueba una técnica',
    'bitacora',
    'Prueba una técnica',
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
    '0acd0000-0000-4000-8000-000000002231',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Guarda un objeto',
    'bitacora',
    'Guarda un objeto',
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
    '0acd0000-0000-4000-8000-000000002232',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Practica al inicio',
    'bitacora',
    'Practica al inicio',
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
    '0acd0000-0000-4000-8000-000000002233',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Elige puede esperar',
    'bitacora',
    'Elige puede esperar',
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
    '0acd0000-0000-4000-8000-000000002234',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Haz una pregunta',
    'bitacora',
    'Haz una pregunta',
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
    '0acd0000-0000-4000-8000-000000002235',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Inventa una celebración',
    'bitacora',
    'Inventa una celebración',
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
    '0acd0000-0000-4000-8000-000000002236',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Elige una preocupación',
    'bitacora',
    'Elige una preocupación',
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
    '0acd0000-0000-4000-8000-000000002237',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Configura una alarma',
    'bitacora',
    'Configura una alarma',
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
    '0acd0000-0000-4000-8000-000000002238',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Haz algún día',
    'bitacora',
    'Haz algún día',
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
    '0acd0000-0000-4000-8000-000000002239',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Practica con claridad',
    'bitacora',
    'Practica con claridad',
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
    '0acd0000-0000-4000-8000-000000002240',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Haz opciones curiosas',
    'bitacora',
    'Haz opciones curiosas',
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
    '0acd0000-0000-4000-8000-000000002241',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Pasa una actividad',
    'bitacora',
    'Pasa una actividad',
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
    '0acd0000-0000-4000-8000-000000002242',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Haz un recorrido',
    'bitacora',
    'Haz un recorrido',
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
    '0acd0000-0000-4000-8000-000000002243',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Busca el significado',
    'bitacora',
    'Busca el significado',
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
    '0acd0000-0000-4000-8000-000000002244',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Elige más cómoda',
    'bitacora',
    'Elige más cómoda',
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
    '0acd0000-0000-4000-8000-000000002245',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Ponte de pie',
    'bitacora',
    'Ponte de pie',
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
    '0acd0000-0000-4000-8000-000000002246',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Planea una pausa',
    'bitacora',
    'Planea una pausa',
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
    '0acd0000-0000-4000-8000-000000002247',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Expresa una preferencia',
    'bitacora',
    'Expresa una preferencia',
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
    '0acd0000-0000-4000-8000-000000002248',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Escribe tres versos',
    'bitacora',
    'Escribe tres versos',
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
    '0acd0000-0000-4000-8000-000000002249',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Escribe dos respuestas',
    'bitacora',
    'Escribe dos respuestas',
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
    '0acd0000-0000-4000-8000-000000002250',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Cierra las pestañas',
    'bitacora',
    'Cierra las pestañas',
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
    '0acd0000-0000-4000-8000-000000002251',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Pregunta o comunidad',
    'bitacora',
    'Pregunta o comunidad',
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
    '0acd0000-0000-4000-8000-000000002252',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Decide qué tema',
    'bitacora',
    'Decide qué tema',
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
    '0acd0000-0000-4000-8000-000000002253',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Elige terminarla hoy',
    'bitacora',
    'Elige terminarla hoy',
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
    '0acd0000-0000-4000-8000-000000002254',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Haz una copia',
    'bitacora',
    'Haz una copia',
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
    '0acd0000-0000-4000-8000-000000002255',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Lleva una bolsa',
    'bitacora',
    'Lleva una bolsa',
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
    '0acd0000-0000-4000-8000-000000002256',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Compara dos instrucciones',
    'bitacora',
    'Compara dos instrucciones',
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
    '0acd0000-0000-4000-8000-000000002257',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Ajusta la altura',
    'bitacora',
    'Ajusta la altura',
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
    '0acd0000-0000-4000-8000-000000002258',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Realiza una secuencia',
    'bitacora',
    'Realiza una secuencia',
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
    '0acd0000-0000-4000-8000-000000002259',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Haz elegir ahora',
    'bitacora',
    'Haz elegir ahora',
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
    '0acd0000-0000-4000-8000-000000002260',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Dile a alguien',
    'bitacora',
    'Dile a alguien',
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
    '0acd0000-0000-4000-8000-000000002261',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Dibuja un recorrido',
    'bitacora',
    'Dibuja un recorrido',
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
    '0acd0000-0000-4000-8000-000000002262',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Pon un nombre',
    'bitacora',
    'Pon un nombre',
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
    '0acd0000-0000-4000-8000-000000002263',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Elige una superficie',
    'bitacora',
    'Elige una superficie',
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
    '0acd0000-0000-4000-8000-000000002264',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Elige cómoda hoy',
    'bitacora',
    'Elige cómoda hoy',
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
    '0acd0000-0000-4000-8000-000000002265',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Pide más equilibrada',
    'bitacora',
    'Pide más equilibrada',
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
    '0acd0000-0000-4000-8000-000000002266',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Construye una torre',
    'bitacora',
    'Construye una torre',
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
    '0acd0000-0000-4000-8000-000000002267',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Quita de favoritos',
    'bitacora',
    'Quita de favoritos',
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
    '0acd0000-0000-4000-8000-000000002268',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Pregunta la zona',
    'bitacora',
    'Pregunta la zona',
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
    '0acd0000-0000-4000-8000-000000002269',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Practica una habilidad',
    'bitacora',
    'Practica una habilidad',
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
    '0acd0000-0000-4000-8000-000000002270',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Reúne al salir',
    'bitacora',
    'Reúne al salir',
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
    '0acd0000-0000-4000-8000-000000002271',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Imita un movimiento',
    'bitacora',
    'Imita un movimiento',
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
    '0acd0000-0000-4000-8000-000000002272',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Decide simplificar hoy',
    'bitacora',
    'Decide simplificar hoy',
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
    '0acd0000-0000-4000-8000-000000002273',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Comparte una recomendación',
    'bitacora',
    'Comparte una recomendación',
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
    '0acd0000-0000-4000-8000-000000002274',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Crea una mini',
    'bitacora',
    'Crea una mini',
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
    '0acd0000-0000-4000-8000-000000002275',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Decide qué información',
    'bitacora',
    'Decide qué información',
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
    '0acd0000-0000-4000-8000-000000002276',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Haz último minuto',
    'bitacora',
    'Haz último minuto',
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
    '0acd0000-0000-4000-8000-000000002277',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Prueba hayas juntado',
    'bitacora',
    'Prueba hayas juntado',
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
    '0acd0000-0000-4000-8000-000000002278',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Elige qué notificaciones',
    'bitacora',
    'Elige qué notificaciones',
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
    '0acd0000-0000-4000-8000-000000002279',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Crea por gusto',
    'bitacora',
    'Crea por gusto',
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
    '0acd0000-0000-4000-8000-000000002280',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Escoge espera breve',
    'bitacora',
    'Escoge espera breve',
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
    '0acd0000-0000-4000-8000-000000002281',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Elige gusto allí',
    'bitacora',
    'Elige gusto allí',
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
    '0acd0000-0000-4000-8000-000000002282',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Elige un tema',
    'bitacora',
    'Elige un tema',
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
    '0acd0000-0000-4000-8000-000000002283',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Escoge tu jornada',
    'bitacora',
    'Escoge tu jornada',
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
    '0acd0000-0000-4000-8000-000000002284',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Coordina un paso',
    'bitacora',
    'Coordina un paso',
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
    '0acd0000-0000-4000-8000-000000002285',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Termina el día',
    'bitacora',
    'Termina el día',
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
    '0acd0000-0000-4000-8000-000000002286',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Responde un mensaje',
    'bitacora',
    'Responde un mensaje',
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
    '0acd0000-0000-4000-8000-000000002287',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Inventa un juego',
    'bitacora',
    'Inventa un juego',
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
    '0acd0000-0000-4000-8000-000000002288',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Haz día complicado',
    'bitacora',
    'Haz día complicado',
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
    '0acd0000-0000-4000-8000-000000002289',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Separa los mensajes',
    'bitacora',
    'Separa los mensajes',
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
    '0acd0000-0000-4000-8000-000000002290',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Elige a solas',
    'bitacora',
    'Elige a solas',
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
    '0acd0000-0000-4000-8000-000000002291',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Explica qué tipo',
    'bitacora',
    'Explica qué tipo',
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
    '0acd0000-0000-4000-8000-000000002292',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Imita un personaje',
    'bitacora',
    'Imita un personaje',
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
    '0acd0000-0000-4000-8000-000000002293',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Revisa tu lista',
    'bitacora',
    'Revisa tu lista',
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
    '0acd0000-0000-4000-8000-000000002294',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Pasa un rato',
    'bitacora',
    'Pasa un rato',
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
    '0acd0000-0000-4000-8000-000000002295',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Pide quieras probar',
    'bitacora',
    'Pide quieras probar',
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
    '0acd0000-0000-4000-8000-000000002296',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Abre una ventana',
    'bitacora',
    'Abre una ventana',
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
    '0acd0000-0000-4000-8000-000000002297',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Haz en reposo',
    'bitacora',
    'Haz en reposo',
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
    '0acd0000-0000-4000-8000-000000002298',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Deja quieras disfrutar',
    'bitacora',
    'Deja quieras disfrutar',
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
    '0acd0000-0000-4000-8000-000000002299',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Pide a alguien',
    'bitacora',
    'Pide a alguien',
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
    '0acd0000-0000-4000-8000-000000002300',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Escribe un anuncio',
    'bitacora',
    'Escribe un anuncio',
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
    '0acd0000-0000-4000-8000-000000002301',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Practica responder lo',
    'bitacora',
    'Practica responder lo',
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
    '0acd0000-0000-4000-8000-000000002302',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Revisa una rutina',
    'bitacora',
    'Revisa una rutina',
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
    '0acd0000-0000-4000-8000-000000002303',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Pon la mesa',
    'bitacora',
    'Pon la mesa',
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
    '0acd0000-0000-4000-8000-000000002304',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Decide si quieres',
    'bitacora',
    'Decide si quieres',
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
    '0acd0000-0000-4000-8000-000000002305',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Diseña una búsqueda',
    'bitacora',
    'Diseña una búsqueda',
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
    '0acd0000-0000-4000-8000-000000002306',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Escribe de enviarla',
    'bitacora',
    'Escribe de enviarla',
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
    '0acd0000-0000-4000-8000-000000002307',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Toma una foto',
    'bitacora',
    'Toma una foto',
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
    '0acd0000-0000-4000-8000-000000002308',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Aprende cómo se',
    'bitacora',
    'Aprende cómo se',
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
    '0acd0000-0000-4000-8000-000000002309',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Prepara una bolsa',
    'bitacora',
    'Prepara una bolsa',
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
    '0acd0000-0000-4000-8000-000000002310',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Sigue un patrón',
    'bitacora',
    'Sigue un patrón',
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
    '0acd0000-0000-4000-8000-000000002311',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Elige ya empezó',
    'bitacora',
    'Elige ya empezó',
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
    '0acd0000-0000-4000-8000-000000002312',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Celebra un logro',
    'bitacora',
    'Celebra un logro',
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
    '0acd0000-0000-4000-8000-000000002313',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Combina dos actividades',
    'bitacora',
    'Combina dos actividades',
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
    '0acd0000-0000-4000-8000-000000002314',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Identifica una emoción',
    'bitacora',
    'Identifica una emoción',
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
    '0acd0000-0000-4000-8000-000000002315',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Elige al momento',
    'bitacora',
    'Elige al momento',
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
    '0acd0000-0000-4000-8000-000000002316',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Explora el aroma',
    'bitacora',
    'Explora el aroma',
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
    '0acd0000-0000-4000-8000-000000002317',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Practica o llamada',
    'bitacora',
    'Practica o llamada',
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
    '0acd0000-0000-4000-8000-000000002318',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Encuentra un juego',
    'bitacora',
    'Encuentra un juego',
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
    '0acd0000-0000-4000-8000-000000002319',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Cambia el tamaño',
    'bitacora',
    'Cambia el tamaño',
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
    '0acd0000-0000-4000-8000-000000002320',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Comprueba si hay',
    'bitacora',
    'Comprueba si hay',
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
    '0acd0000-0000-4000-8000-000000002321',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Explica con tus',
    'bitacora',
    'Explica con tus',
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
    '0acd0000-0000-4000-8000-000000002322',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Decide qué aviso',
    'bitacora',
    'Decide qué aviso',
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
    '0acd0000-0000-4000-8000-000000002323',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Mueve los dedos',
    'bitacora',
    'Mueve los dedos',
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
    '0acd0000-0000-4000-8000-000000002324',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Haz por hoy',
    'bitacora',
    'Haz por hoy',
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
    '0acd0000-0000-4000-8000-000000002325',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Agradece a alguien',
    'bitacora',
    'Agradece a alguien',
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
    '0acd0000-0000-4000-8000-000000002326',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Haz canción inventada',
    'bitacora',
    'Haz canción inventada',
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
    '0acd0000-0000-4000-8000-000000002327',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Elige más disponibilidad',
    'bitacora',
    'Elige más disponibilidad',
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
    '0acd0000-0000-4000-8000-000000002328',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Guarda un documento',
    'bitacora',
    'Guarda un documento',
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
    '0acd0000-0000-4000-8000-000000002329',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Escoge con anticipación',
    'bitacora',
    'Escoge con anticipación',
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
    '0acd0000-0000-4000-8000-000000002330',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Escoge una decisión',
    'bitacora',
    'Escoge una decisión',
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
    '0acd0000-0000-4000-8000-000000002331',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Haz una foto',
    'bitacora',
    'Haz una foto',
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
    '0acd0000-0000-4000-8000-000000002332',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Elige un momento',
    'bitacora',
    'Elige un momento',
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
    '0acd0000-0000-4000-8000-000000002333',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Lleva una nota',
    'bitacora',
    'Lleva una nota',
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
    '0acd0000-0000-4000-8000-000000002334',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Elige una receta',
    'bitacora',
    'Elige una receta',
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
    '0acd0000-0000-4000-8000-000000002335',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Busca una forma',
    'bitacora',
    'Busca una forma',
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
    '0acd0000-0000-4000-8000-000000002336',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Cambia de mano',
    'bitacora',
    'Cambia de mano',
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
    '0acd0000-0000-4000-8000-000000002337',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Ajusta tu plan',
    'bitacora',
    'Ajusta tu plan',
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
    '0acd0000-0000-4000-8000-000000002338',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Propón un plan',
    'bitacora',
    'Propón un plan',
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
    '0acd0000-0000-4000-8000-000000002339',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Diseña una etiqueta',
    'bitacora',
    'Diseña una etiqueta',
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
    '0acd0000-0000-4000-8000-000000002340',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Escribe un plan',
    'bitacora',
    'Escribe un plan',
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
    '0acd0000-0000-4000-8000-000000002341',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Haz tengas pendiente',
    'bitacora',
    'Haz tengas pendiente',
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
    '0acd0000-0000-4000-8000-000000002342',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Comparte una comida',
    'bitacora',
    'Comparte una comida',
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
    '0acd0000-0000-4000-8000-000000002343',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Escribe una discusión',
    'bitacora',
    'Escribe una discusión',
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
    '0acd0000-0000-4000-8000-000000002344',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Elige sobre ella',
    'bitacora',
    'Elige sobre ella',
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
    '0acd0000-0000-4000-8000-000000002345',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Guarda el teléfono',
    'bitacora',
    'Guarda el teléfono',
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
    '0acd0000-0000-4000-8000-000000002346',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Elige el tiempo',
    'bitacora',
    'Elige el tiempo',
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
    '0acd0000-0000-4000-8000-000000002347',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Busca parecía complicado',
    'bitacora',
    'Busca parecía complicado',
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
    '0acd0000-0000-4000-8000-000000002348',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Haz de mañana',
    'bitacora',
    'Haz de mañana',
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
    '0acd0000-0000-4000-8000-000000002349',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Haz el otro',
    'bitacora',
    'Haz el otro',
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
    '0acd0000-0000-4000-8000-000000002350',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Escoge qué tarea',
    'bitacora',
    'Escoge qué tarea',
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
    '0acd0000-0000-4000-8000-000000002351',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Aclara con respeto',
    'bitacora',
    'Aclara con respeto',
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
    '0acd0000-0000-4000-8000-000000002352',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Escribe una pregunta',
    'bitacora',
    'Escribe una pregunta',
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
    '0acd0000-0000-4000-8000-000000002353',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Regulación emocional: Decide o energía',
    'bitacora',
    'Decide o energía',
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
    '0acd0000-0000-4000-8000-000000002354',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Organización cotidiana: Deja a la',
    'bitacora',
    'Deja a la',
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
    '0acd0000-0000-4000-8000-000000002355',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Comer con flexibilidad: Anota una idea',
    'bitacora',
    'Anota una idea',
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
    '0acd0000-0000-4000-8000-000000002356',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Autonomía y límites: Decide qué favor',
    'bitacora',
    'Decide qué favor',
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
    '0acd0000-0000-4000-8000-000000002357',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Juego y disfrute: Inventa una tradición',
    'bitacora',
    'Inventa una tradición',
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
    '0acd0000-0000-4000-8000-000000002358',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Bienestar digital: Revisa una carpeta',
    'bitacora',
    'Revisa una carpeta',
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
    '0acd0000-0000-4000-8000-000000002359',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aire libre y comunidad: Busca un lugar',
    'bitacora',
    'Busca un lugar',
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
    '0acd0000-0000-4000-8000-000000002360',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Aprendizaje cotidiano: Anota qué habilidad',
    'bitacora',
    'Anota qué habilidad',
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
    '0acd0000-0000-4000-8000-000000002361',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Cuidado diario: Elige cómo quieres',
    'bitacora',
    'Elige cómo quieres',
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
    '0acd0000-0000-4000-8000-000000002362',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Movimiento amable: Elige un movimiento',
    'bitacora',
    'Elige un movimiento',
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
    '0acd0000-0000-4000-8000-000000002363',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Descanso y ritmo: Cierra una pestaña',
    'bitacora',
    'Cierra una pestaña',
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
    '0acd0000-0000-4000-8000-000000002364',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Vínculos: Despídete por compromiso',
    'bitacora',
    'Despídete por compromiso',
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
    '0acd0000-0000-4000-8000-000000002365',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Bienestar'),
    'Creación: Crea un patrón',
    'bitacora',
    'Crea un patrón',
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
-- 2. Sus sesiones (356)
-- ---------------------------------------------------------------------------

-- BIE-10 · Cuidado diario: Prepara un lugar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510210-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000210',
    'Cuidado diario: Prepara un lugar',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Prepara un lugar","texto":"Prepara un lugar cómodo para dejar tus cosas al llegar a casa.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-11 · Movimiento amable: Haz una ronda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510211-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000211',
    'Movimiento amable: Haz una ronda',
    1,
    '{"modo":"pasos","intro":"Haz una ronda de movimientos de manos: palma abierta, puño suave y dedos extendidos.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz una ronda de movimientos de manos: palma abierta, puño suave y dedos extendidos."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Haz una ronda» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-12 · Descanso y ritmo: Escoge una señal: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510212-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000212',
    'Descanso y ritmo: Escoge una señal',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Escoge una señal», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Escoge una señal"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Escoge una señal"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-13 · Vínculos: Envía a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510213-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000213',
    'Vínculos: Envía a alguien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Envía a alguien de confianza un saludo que no requiera respuesta inmediata.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Envía a alguien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-14 · Creación: Inventa un título: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510214-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000214',
    'Creación: Inventa un título',
    1,
    '{"invitacion":"Inventa un título para el día de hoy y acompáñalo con una frase.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-15 · Regulación emocional: Pon palabra perfecta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510215-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000215',
    'Regulación emocional: Pon palabra perfecta',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pon nombre a una emoción usando una palabra propia, sin buscar la palabra perfecta.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Pon palabra perfecta» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-16 · Organización cotidiana: Divide un pendiente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510216-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000216',
    'Organización cotidiana: Divide un pendiente',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Divide un pendiente», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Divide un pendiente"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Divide un pendiente"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-17 · Comer con flexibilidad: Elige una comida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510217-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000217',
    'Comer con flexibilidad: Elige una comida',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una comida que ya ibas a disfrutar y sírvela en un recipiente que te guste.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Elige una comida» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-18 · Autonomía y límites: Ensaya una respuesta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510218-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000218',
    'Autonomía y límites: Ensaya una respuesta',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Ensaya una respuesta breve para rechazar una invitación con respeto.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Ensaya una respuesta» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-19 · Juego y disfrute: Resuelve una sección: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510219-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000219',
    'Juego y disfrute: Resuelve una sección',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Resuelve una sección","texto":"Resuelve una sección de un rompecabezas pequeño o continúa uno que ya tengas empezado.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-20 · Bienestar digital: Silencia respuesta inmediata: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510220-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000220',
    'Bienestar digital: Silencia respuesta inmediata',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Silencia respuesta inmediata», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Silencia respuesta inmediata"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Silencia respuesta inmediata"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-21 · Aire libre y comunidad: Elige un trayecto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510221-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000221',
    'Aire libre y comunidad: Elige un trayecto',
    1,
    '{"modo":"pasos","intro":"Elige un trayecto cotidiano y cambia una calle o pasillo por una ruta distinta y segura.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Elige un trayecto cotidiano y cambia una calle o pasillo por una ruta distinta y segura."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Elige un trayecto» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-22 · Aprendizaje cotidiano: Aprende una palabra: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510222-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000222',
    'Aprendizaje cotidiano: Aprende una palabra',
    1,
    '{"invitacion":"Aprende una palabra nueva y úsala en una frase sobre tu día.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-23 · Cuidado diario: Escoge una prenda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510223-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000223',
    'Cuidado diario: Escoge una prenda',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Escoge una prenda","texto":"Escoge una prenda para mañana según el clima y tus planes.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-24 · Movimiento amable: Prueba una secuencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510224-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000224',
    'Movimiento amable: Prueba una secuencia',
    1,
    '{"modo":"pasos","intro":"Prueba una secuencia sentada de talones, puntas y apoyo completo de los pies.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Prueba una secuencia sentada de talones, puntas y apoyo completo de los pies."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Prueba una secuencia» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-25 · Descanso y ritmo: Elige qué actividad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510225-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000225',
    'Descanso y ritmo: Elige qué actividad',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Elige qué actividad», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Elige qué actividad"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Elige qué actividad"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-26 · Vínculos: Pregunta conversar hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510226-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000226',
    'Vínculos: Pregunta conversar hoy',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pregunta a una persona cercana qué tema le gustaría conversar hoy.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Pregunta conversar hoy» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-27 · Creación: Dibuja un objeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510227-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000227',
    'Creación: Dibuja un objeto',
    1,
    '{"invitacion":"Dibuja un objeto cotidiano usando solo círculos, líneas y puntos.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-28 · Regulación emocional: Separa en dos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510228-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000228',
    'Regulación emocional: Separa en dos',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Separa en dos columnas lo que puedes atender hoy y lo que depende de otras personas.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Separa en dos» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-29 · Organización cotidiana: Agrupa tus tareas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510229-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000229',
    'Organización cotidiana: Agrupa tus tareas',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Agrupa tus tareas», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Agrupa tus tareas"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Agrupa tus tareas"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-30 · Comer con flexibilidad: Prueba una combinación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510230-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000230',
    'Comer con flexibilidad: Prueba una combinación',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prueba una combinación de sabores con ingredientes que ya tengas disponibles.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prueba una combinación» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-31 · Autonomía y límites: Elige qué información: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510231-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000231',
    'Autonomía y límites: Elige qué información',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige qué información personal prefieres no compartir en una conversación.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Elige qué información» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-32 · Juego y disfrute: Elige una canción: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510232-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000232',
    'Juego y disfrute: Elige una canción',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Elige una canción","texto":"Elige una canción y crea una portada dibujada para ella.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-33 · Bienestar digital: Revisa qué aplicaciones: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510233-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000233',
    'Bienestar digital: Revisa qué aplicaciones',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Revisa qué aplicaciones», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Revisa qué aplicaciones"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Revisa qué aplicaciones"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-34 · Aire libre y comunidad: Si te es: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510234-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000234',
    'Aire libre y comunidad: Si te es',
    1,
    '{"modo":"pasos","intro":"Si te es posible, pasa unos minutos en un espacio común del edificio o barrio.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Si te es posible, pasa unos minutos en un espacio común del edificio o barrio."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Si te es» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-35 · Aprendizaje cotidiano: Pídele a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510235-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000235',
    'Aprendizaje cotidiano: Pídele a alguien',
    1,
    '{"invitacion":"Pídele a alguien que te enseñe un atajo o habilidad que use con frecuencia.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-36 · Cuidado diario: Haz una lista: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510236-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000236',
    'Cuidado diario: Haz una lista',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Haz una lista","texto":"Haz una lista corta de lo que te gustaría tener a mano hoy.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-37 · Movimiento amable: Dibuja en el: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510237-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000237',
    'Movimiento amable: Dibuja en el',
    1,
    '{"modo":"pasos","intro":"Dibuja en el aire una figura grande con cada brazo, dentro de un rango cómodo.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Dibuja en el aire una figura grande con cada brazo, dentro de un rango cómodo."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Dibuja en el» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-38 · Descanso y ritmo: Haz una pantalla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510238-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000238',
    'Descanso y ritmo: Haz una pantalla',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Haz una pantalla», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Haz una pantalla"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Haz una pantalla"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-39 · Vínculos: Comparte un recuerdo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510239-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000239',
    'Vínculos: Comparte un recuerdo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Comparte un recuerdo amable con alguien que también lo vivió.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Comparte un recuerdo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-40 · Creación: Escribe un diálogo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510240-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000240',
    'Creación: Escribe un diálogo',
    1,
    '{"invitacion":"Escribe un diálogo breve entre dos objetos que tengas cerca.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-41 · Regulación emocional: Elige una frase: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510241-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000241',
    'Regulación emocional: Elige una frase',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una frase neutral para describir un error antes de decidir qué hacer.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Elige una frase» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-42 · Organización cotidiana: Elige una tarea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510242-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000242',
    'Organización cotidiana: Elige una tarea',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Elige una tarea», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Elige una tarea"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Elige una tarea"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-43 · Comer con flexibilidad: Prepara un acompañamiento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510243-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000243',
    'Comer con flexibilidad: Prepara un acompañamiento',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prepara un acompañamiento sencillo para una comida habitual, si te apetece.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prepara un acompañamiento» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-44 · Autonomía y límites: Pide otra manera: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510244-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000244',
    'Autonomía y límites: Pide otra manera',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pide que una instrucción se repita o se explique de otra manera.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Pide otra manera» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-45 · Juego y disfrute: Juega una ronda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510245-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000245',
    'Juego y disfrute: Juega una ronda',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Juega una ronda","texto":"Juega una ronda de un juego conocido cambiando una regla sencilla.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-46 · Bienestar digital: Elimina una captura: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510246-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000246',
    'Bienestar digital: Elimina una captura',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Elimina una captura», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Elimina una captura"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Elimina una captura"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-47 · Aire libre y comunidad: Sal harás allí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510247-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000247',
    'Aire libre y comunidad: Sal harás allí',
    1,
    '{"modo":"pasos","intro":"Sal a un balcón, patio o entrada y decide qué actividad breve harás allí.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Sal a un balcón, patio o entrada y decide qué actividad breve harás allí."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Sal harás allí» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-48 · Aprendizaje cotidiano: Elige sus pasos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510248-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000248',
    'Aprendizaje cotidiano: Elige sus pasos',
    1,
    '{"invitacion":"Elige una tarea conocida y descubre una forma distinta de hacer uno de sus pasos.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-49 · Cuidado diario: Cambia de sitio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510249-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000249',
    'Cuidado diario: Cambia de sitio',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Cambia de sitio","texto":"Cambia de sitio un objeto que siempre te estorba al pasar.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-50 · Movimiento amable: Cambia de postura: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510250-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000250',
    'Movimiento amable: Cambia de postura',
    1,
    '{"modo":"pasos","intro":"Cambia de postura tres veces y observa cuál te sostiene mejor.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Cambia de postura tres veces y observa cuál te sostiene mejor."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Cambia de postura» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-51 · Descanso y ritmo: Decide qué conversación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510251-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000251',
    'Descanso y ritmo: Decide qué conversación',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Decide qué conversación», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Decide qué conversación"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Decide qué conversación"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-52 · Vínculos: Agradece una ayuda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510252-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000252',
    'Vínculos: Agradece una ayuda',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Agradece una ayuda concreta mencionando qué diferencia hizo para ti.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Agradece una ayuda» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-53 · Creación: Crea una lista: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510253-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000253',
    'Creación: Crea una lista',
    1,
    '{"invitacion":"Crea una lista de cinco nombres posibles para una cafetería imaginaria.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-54 · Regulación emocional: Escribe qué necesitarías: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510254-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000254',
    'Regulación emocional: Escribe qué necesitarías',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe qué necesitarías escuchar de alguien y decide si quieres pedírselo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Escribe qué necesitarías» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-55 · Organización cotidiana: Prepara una lista: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510255-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000255',
    'Organización cotidiana: Prepara una lista',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Prepara una lista», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Prepara una lista"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Prepara una lista"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-56 · Comer con flexibilidad: Escoge una receta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510256-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000256',
    'Comer con flexibilidad: Escoge una receta',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escoge una receta familiar y cambia un detalle por curiosidad, no por obligación.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Escoge una receta» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-57 · Autonomía y límites: Decide cuánto tiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510257-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000257',
    'Autonomía y límites: Decide cuánto tiempo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide cuánto tiempo necesitas antes de aceptar un compromiso nuevo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Decide cuánto tiempo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-58 · Juego y disfrute: Haz planearlas aún: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510258-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000258',
    'Juego y disfrute: Haz planearlas aún',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Haz planearlas aún","texto":"Haz una lista de cinco cosas que te gustaría probar por diversión, sin planearlas aún.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-59 · Bienestar digital: Deja el teléfono: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510259-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000259',
    'Bienestar digital: Deja el teléfono',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Deja el teléfono», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Deja el teléfono"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Deja el teléfono"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-60 · Aire libre y comunidad: Visita una tienda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510260-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000260',
    'Aire libre y comunidad: Visita una tienda',
    1,
    '{"modo":"pasos","intro":"Visita una tienda cercana para comprar algo que ya necesitabas, si es seguro hacerlo.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Visita una tienda cercana para comprar algo que ya necesitabas, si es seguro hacerlo."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Visita una tienda» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-61 · Aprendizaje cotidiano: Mira un tutorial: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510261-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000261',
    'Aprendizaje cotidiano: Mira un tutorial',
    1,
    '{"invitacion":"Mira un tutorial breve sobre una habilidad práctica que de verdad quieras aprender.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-62 · Cuidado diario: Deja que disfrutes: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510262-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000262',
    'Cuidado diario: Deja que disfrutes',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Deja que disfrutes","texto":"Deja listo un recipiente limpio para llevar una bebida que disfrutes.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-63 · Movimiento amable: Haz una secuencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510263-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000263',
    'Movimiento amable: Haz una secuencia',
    1,
    '{"modo":"pasos","intro":"Haz una secuencia de equilibrio sentado: lleva el peso a un lado y luego al otro.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz una secuencia de equilibrio sentado: lleva el peso a un lado y luego al otro."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Haz una secuencia» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-64 · Descanso y ritmo: Prueba una nota: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510264-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000264',
    'Descanso y ritmo: Prueba una nota',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Prueba una nota», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Prueba una nota"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Prueba una nota"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-65 · Vínculos: Invita a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510265-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000265',
    'Vínculos: Invita a alguien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Invita a alguien a compartir una actividad sencilla que ambos disfruten.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Invita a alguien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-66 · Creación: Diseña en papel: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510266-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000266',
    'Creación: Diseña en papel',
    1,
    '{"invitacion":"Diseña en papel un emblema para una actividad que disfrutas.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-67 · Regulación emocional: Haz una tarjeta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510267-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000267',
    'Regulación emocional: Haz una tarjeta',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Haz una tarjeta con una opción de apoyo para un momento difícil.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Haz una tarjeta» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-68 · Organización cotidiana: Agrupa en el: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510268-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000268',
    'Organización cotidiana: Agrupa en el',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Agrupa en el», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Agrupa en el"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Agrupa en el"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-69 · Comer con flexibilidad: Combina dos texturas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510269-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000269',
    'Comer con flexibilidad: Combina dos texturas',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Combina dos texturas distintas usando alimentos que ya tengas disponibles.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Combina dos texturas» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-70 · Autonomía y límites: Practica otro momento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510270-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000270',
    'Autonomía y límites: Practica otro momento',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Practica pedir que una conversación continúe en otro momento.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Practica otro momento» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-71 · Juego y disfrute: Construye una figura: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510271-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000271',
    'Juego y disfrute: Construye una figura',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Construye una figura","texto":"Construye una figura con objetos seguros que tengas a mano y ponle nombre.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-72 · Bienestar digital: Configura un modo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510272-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000272',
    'Bienestar digital: Configura un modo',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Configura un modo», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Configura un modo"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Configura un modo"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-73 · Aire libre y comunidad: Busca una banca: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510273-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000273',
    'Aire libre y comunidad: Busca una banca',
    1,
    '{"modo":"pasos","intro":"Busca una banca o lugar público accesible donde puedas sentarte un rato.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Busca una banca o lugar público accesible donde puedas sentarte un rato."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Busca una banca» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-74 · Aprendizaje cotidiano: Lee una página: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510274-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000274',
    'Aprendizaje cotidiano: Lee una página',
    1,
    '{"invitacion":"Lee una página sobre un tema que siempre te haya dado curiosidad.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-75 · Cuidado diario: Elige cinco minutos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510275-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000275',
    'Cuidado diario: Elige cinco minutos',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Elige cinco minutos","texto":"Elige una tarea doméstica y decide cuál es su versión de cinco minutos.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-76 · Movimiento amable: Coordina una mano: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510276-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000276',
    'Movimiento amable: Coordina una mano',
    1,
    '{"modo":"pasos","intro":"Coordina una mano haciendo círculos mientras la otra marca puntos en el aire.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Coordina una mano haciendo círculos mientras la otra marca puntos en el aire."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Coordina una mano» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-77 · Descanso y ritmo: Elige una hora: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510277-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000277',
    'Descanso y ritmo: Elige una hora',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Elige una hora», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Elige una hora"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Elige una hora"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-78 · Vínculos: Escucha una historia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510278-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000278',
    'Vínculos: Escucha una historia',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escucha una historia de otra persona y espera a que termine antes de responder.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Escucha una historia» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-79 · Creación: Escribe una receta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510279-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000279',
    'Creación: Escribe una receta',
    1,
    '{"invitacion":"Escribe una receta ficticia para preparar una tarde tranquila, con ingredientes inventados.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-80 · Regulación emocional: Piensa que hiciste: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510280-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000280',
    'Regulación emocional: Piensa que hiciste',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Piensa en una situación reciente y distingue el hecho de la interpretación que hiciste.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Piensa que hiciste» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-81 · Organización cotidiana: Crea un recordatorio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510281-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000281',
    'Organización cotidiana: Crea un recordatorio',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Crea un recordatorio», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Crea un recordatorio"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Crea un recordatorio"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-82 · Comer con flexibilidad: Elige qué te: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510282-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000282',
    'Comer con flexibilidad: Elige qué te',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige qué te gustaría beber junto con tu próxima comida, según lo que tengas a mano.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Elige qué te» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-83 · Autonomía y límites: Elige una preferencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510283-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000283',
    'Autonomía y límites: Elige una preferencia',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una preferencia que sueles callar y exprésala en un plan sencillo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Elige una preferencia» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-84 · Juego y disfrute: Busca una palabra: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510284-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000284',
    'Juego y disfrute: Busca una palabra',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Busca una palabra","texto":"Busca una palabra al azar en un libro y crea una frase con ella.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-85 · Bienestar digital: Cancela una notificación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510285-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000285',
    'Bienestar digital: Cancela una notificación',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Cancela una notificación», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Cancela una notificación"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Cancela una notificación"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-86 · Aire libre y comunidad: Saluda tengas confianza: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510286-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000286',
    'Aire libre y comunidad: Saluda tengas confianza',
    1,
    '{"modo":"pasos","intro":"Saluda a una persona del vecindario con quien ya tengas confianza.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Saluda a una persona del vecindario con quien ya tengas confianza."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Saluda tengas confianza» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-87 · Aprendizaje cotidiano: Practica una frase: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510287-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000287',
    'Aprendizaje cotidiano: Practica una frase',
    1,
    '{"invitacion":"Practica una frase en otro idioma y úsala en un contexto inventado.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-88 · Cuidado diario: Revisa qué objeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510288-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000288',
    'Cuidado diario: Revisa qué objeto',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Revisa qué objeto","texto":"Revisa qué objeto de uso diario necesita volver a su lugar.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-89 · Movimiento amable: Sigue con los: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510289-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000289',
    'Movimiento amable: Sigue con los',
    1,
    '{"modo":"pasos","intro":"Sigue con los dedos el ritmo de una canción y cambia el patrón a mitad de camino.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Sigue con los dedos el ritmo de una canción y cambia el patrón a mitad de camino."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Sigue con los» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-90 · Descanso y ritmo: Prepara una transición: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510290-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000290',
    'Descanso y ritmo: Prepara una transición',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Prepara una transición», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Prepara una transición"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Prepara una transición"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-91 · Vínculos: Escribe un mensaje: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510291-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000291',
    'Vínculos: Escribe un mensaje',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe un mensaje para retomar contacto con alguien; puedes guardarlo sin enviarlo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Escribe un mensaje» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-92 · Creación: Haz un mapa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510292-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000292',
    'Creación: Haz un mapa',
    1,
    '{"invitacion":"Haz un mapa sencillo de un lugar conocido sin escribir sus nombres.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-93 · Regulación emocional: Elige una acción: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510293-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000293',
    'Regulación emocional: Elige una acción',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una acción pequeña que te ayude a pasar de la preocupación al siguiente paso.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Elige una acción» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-94 · Organización cotidiana: Elimina una tarea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510294-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000294',
    'Organización cotidiana: Elimina una tarea',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Elimina una tarea», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Elimina una tarea"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Elimina una tarea"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-95 · Comer con flexibilidad: Prueba mismo tiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510295-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000295',
    'Comer con flexibilidad: Prueba mismo tiempo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prueba comer una parte de tu comida sin hacer otra tarea al mismo tiempo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prueba mismo tiempo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-96 · Autonomía y límites: Escribe una frase: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510296-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000296',
    'Autonomía y límites: Escribe una frase',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe una frase para solicitar que respeten tu espacio o tus pertenencias.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Escribe una frase» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-97 · Juego y disfrute: Elige un pasatiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510297-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000297',
    'Juego y disfrute: Elige un pasatiempo',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Elige un pasatiempo","texto":"Elige un pasatiempo que abandonaste y prepara el material para retomarlo diez minutos.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-98 · Bienestar digital: Organiza tus fotos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510298-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000298',
    'Bienestar digital: Organiza tus fotos',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Organiza tus fotos», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Organiza tus fotos"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Organiza tus fotos"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-99 · Aire libre y comunidad: Elige un lugar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510299-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000299',
    'Aire libre y comunidad: Elige un lugar',
    1,
    '{"modo":"pasos","intro":"Elige un lugar al aire libre y haz un dibujo rápido de su distribución.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Elige un lugar al aire libre y haz un dibujo rápido de su distribución."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Elige un lugar» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-100 · Aprendizaje cotidiano: Pregunta su familia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502100-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002100',
    'Aprendizaje cotidiano: Pregunta su familia',
    1,
    '{"invitacion":"Pregunta a una persona mayor qué habilidad cotidiana aprendió de su familia.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-101 · Cuidado diario: Acomoda una silla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502101-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002101',
    'Cuidado diario: Acomoda una silla',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Acomoda una silla","texto":"Acomoda una silla, cojín o apoyo para estar más a gusto.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-102 · Movimiento amable: Practica para ti: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502102-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002102',
    'Movimiento amable: Practica para ti',
    1,
    '{"modo":"pasos","intro":"Practica levantarte y volver a sentarte solo si es seguro y habitual para ti.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Practica levantarte y volver a sentarte solo si es seguro y habitual para ti."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Practica para ti» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-103 · Descanso y ritmo: Anota qué te: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502103-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002103',
    'Descanso y ritmo: Anota qué te',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Anota qué te», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Anota qué te"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Anota qué te"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-104 · Vínculos: Pide haría bien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502104-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002104',
    'Vínculos: Pide haría bien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pide compañía para una tarea cotidiana si eso te haría bien.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Pide haría bien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-105 · Creación: Inventa un final: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502105-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002105',
    'Creación: Inventa un final',
    1,
    '{"invitacion":"Inventa un final distinto para una historia, serie o película que recuerdes.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-106 · Regulación emocional: Practica para pensarlo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502106-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002106',
    'Regulación emocional: Practica para pensarlo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Practica decir en voz baja: “Necesito un momento para pensarlo”.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Practica para pensarlo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-107 · Organización cotidiana: Ordena un archivo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502107-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002107',
    'Organización cotidiana: Ordena un archivo',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Ordena un archivo», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Ordena un archivo"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Ordena un archivo"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-108 · Comer con flexibilidad: Invita una comida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502108-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002108',
    'Comer con flexibilidad: Invita una comida',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Invita a alguien a compartir una receta o recuerdo relacionado con una comida.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Invita una comida» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-109 · Autonomía y límites: Decide qué parte: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502109-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002109',
    'Autonomía y límites: Decide qué parte',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide qué parte de una tarea compartida quieres hacer y cuál quieres negociar.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Decide qué parte» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-110 · Juego y disfrute: Haz una competencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502110-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002110',
    'Juego y disfrute: Haz una competencia',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Haz una competencia","texto":"Haz una competencia amistosa contigo: encuentra usos nuevos para un objeto cotidiano.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-111 · Bienestar digital: Haz una pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502111-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002111',
    'Bienestar digital: Haz una pausa',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Haz una pausa», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Haz una pausa"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Haz una pausa"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-112 · Aire libre y comunidad: Recoge un papel: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502112-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002112',
    'Aire libre y comunidad: Recoge un papel',
    1,
    '{"modo":"pasos","intro":"Recoge un papel suelto del suelo solo si puedes hacerlo con seguridad y desecharlo bien.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Recoge un papel suelto del suelo solo si puedes hacerlo con seguridad y desecharlo bien."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Recoge un papel» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-113 · Aprendizaje cotidiano: Identifica una herramienta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502113-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002113',
    'Aprendizaje cotidiano: Identifica una herramienta',
    1,
    '{"invitacion":"Identifica una herramienta que no sepas usar y busca su guía antes de probarla.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-114 · Cuidado diario: Prepara los materiales: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502114-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002114',
    'Cuidado diario: Prepara los materiales',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Prepara los materiales","texto":"Prepara los materiales de una actividad que te gustaría retomar.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-115 · Movimiento amable: Haz una ruta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502115-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002115',
    'Movimiento amable: Haz una ruta',
    1,
    '{"modo":"pasos","intro":"Haz una ruta corta por casa para llevar un objeto que ya necesites mover.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz una ruta corta por casa para llevar un objeto que ya necesites mover."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Haz una ruta» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-116 · Descanso y ritmo: Cambia una actividad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502116-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002116',
    'Descanso y ritmo: Cambia una actividad',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Cambia una actividad», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Cambia una actividad"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Cambia una actividad"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-117 · Vínculos: Propón una conversación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502117-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002117',
    'Vínculos: Propón una conversación',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Propón una conversación breve sobre música, series, deportes o juegos.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Propón una conversación» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-118 · Creación: Crea un ritmo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502118-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002118',
    'Creación: Crea un ritmo',
    1,
    '{"invitacion":"Crea un ritmo de cuatro golpes con los dedos y ponle un nombre.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-119 · Regulación emocional: Nombra para aclararlo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502119-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002119',
    'Regulación emocional: Nombra para aclararlo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Nombra algo que te preocupa y anota una pregunta concreta para aclararlo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Nombra para aclararlo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-120 · Organización cotidiana: Deja una nota: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502120-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002120',
    'Organización cotidiana: Deja una nota',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Deja una nota», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Deja una nota"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Deja una nota"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-121 · Comer con flexibilidad: Elige una fruta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502121-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002121',
    'Comer con flexibilidad: Elige una fruta',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una fruta o preparación que ya tengas y sírvela de una forma diferente.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Elige una fruta» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-122 · Autonomía y límites: Practica mensaje importante: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502122-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002122',
    'Autonomía y límites: Practica mensaje importante',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Practica pedir una pausa antes de responder a un mensaje importante.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Practica mensaje importante» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-123 · Juego y disfrute: Crea una adivinanza: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502123-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002123',
    'Juego y disfrute: Crea una adivinanza',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Crea una adivinanza","texto":"Crea una adivinanza cuya respuesta sea un objeto de tu casa.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-124 · Bienestar digital: Revisa quién puede: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502124-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002124',
    'Bienestar digital: Revisa quién puede',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Revisa quién puede», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Revisa quién puede"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Revisa quién puede"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-125 · Aire libre y comunidad: Llama te interese: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502125-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002125',
    'Aire libre y comunidad: Llama te interese',
    1,
    '{"modo":"pasos","intro":"Llama a una organización comunitaria para consultar una actividad abierta que te interese.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Llama a una organización comunitaria para consultar una actividad abierta que te interese."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Llama te interese» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-126 · Aprendizaje cotidiano: Enséñale a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502126-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002126',
    'Aprendizaje cotidiano: Enséñale a alguien',
    1,
    '{"invitacion":"Enséñale a alguien un conocimiento pequeño que te resulte fácil compartir.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-127 · Cuidado diario: Decide qué pendiente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502127-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002127',
    'Cuidado diario: Decide qué pendiente',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Decide qué pendiente","texto":"Decide qué pendiente puede esperar sin afectar tu día.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-128 · Movimiento amable: Alterna el pulgar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502128-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002128',
    'Movimiento amable: Alterna el pulgar',
    1,
    '{"modo":"pasos","intro":"Alterna abrir y cerrar las manos con tocar cada dedo con el pulgar.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Alterna abrir y cerrar las manos con tocar cada dedo con el pulgar."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Alterna el pulgar» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-129 · Descanso y ritmo: Escoge un sonido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502129-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002129',
    'Descanso y ritmo: Escoge un sonido',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Escoge un sonido», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Escoge un sonido"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Escoge un sonido"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-130 · Vínculos: Reconoce ejemplo específico: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502130-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002130',
    'Vínculos: Reconoce ejemplo específico',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Reconoce algo que admiras de alguien con un ejemplo específico.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Reconoce ejemplo específico» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-131 · Creación: Escribe una nota: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502131-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002131',
    'Creación: Escribe una nota',
    1,
    '{"invitacion":"Escribe una nota dirigida a ti dentro de un mes con un deseo realista.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-132 · Regulación emocional: Escoge una actividad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502132-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002132',
    'Regulación emocional: Escoge una actividad',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escoge una actividad que te ayude a cambiar de foco sin negar lo que sientes.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Escoge una actividad» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-133 · Organización cotidiana: Crea pueden esperar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502133-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002133',
    'Organización cotidiana: Crea pueden esperar',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Crea pueden esperar», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Crea pueden esperar"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Crea pueden esperar"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-134 · Comer con flexibilidad: Prepara poco tiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502134-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002134',
    'Comer con flexibilidad: Prepara poco tiempo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prepara una lista de comidas sencillas que disfrutas para esos días con poco tiempo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prepara poco tiempo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-135 · Autonomía y límites: Elige un compromiso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502135-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002135',
    'Autonomía y límites: Elige un compromiso',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige un compromiso que puedas renegociar en lugar de cancelarlo por completo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Elige un compromiso» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-136 · Juego y disfrute: Elige una fotografía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502136-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002136',
    'Juego y disfrute: Elige una fotografía',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Elige una fotografía","texto":"Elige una fotografía propia y escribe un pie de foto divertido.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-137 · Bienestar digital: Cierra este dispositivo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502137-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002137',
    'Bienestar digital: Cierra este dispositivo',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Cierra este dispositivo», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Cierra este dispositivo"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Cierra este dispositivo"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-138 · Aire libre y comunidad: Explora una ruta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502138-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002138',
    'Aire libre y comunidad: Explora una ruta',
    1,
    '{"modo":"pasos","intro":"Explora una ruta accesible nueva acompañado si así te sientes más cómodo.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Explora una ruta accesible nueva acompañado si así te sientes más cómodo."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Explora una ruta» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-139 · Aprendizaje cotidiano: Elige una actividad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502139-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002139',
    'Aprendizaje cotidiano: Elige una actividad',
    1,
    '{"invitacion":"Elige una actividad creativa y aprende una técnica nueva en una sola sesión.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-140 · Cuidado diario: Limpia con frecuencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502140-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002140',
    'Cuidado diario: Limpia con frecuencia',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Limpia con frecuencia","texto":"Limpia solo una superficie que uses con frecuencia.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-141 · Movimiento amable: Prueba el cuello: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502141-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002141',
    'Movimiento amable: Prueba el cuello',
    1,
    '{"modo":"pasos","intro":"Prueba movimientos de hombros hacia delante y atrás, sin forzar el cuello.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Prueba movimientos de hombros hacia delante y atrás, sin forzar el cuello."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Prueba el cuello» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-142 · Descanso y ritmo: Identifica una tarea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502142-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002142',
    'Descanso y ritmo: Identifica una tarea',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Identifica una tarea», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Identifica una tarea"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Identifica una tarea"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-143 · Vínculos: Comparte una foto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502143-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002143',
    'Vínculos: Comparte una foto',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Comparte una foto de algo cotidiano que te recordó a una persona querida.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Comparte una foto» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-144 · Creación: Dibuja una escena: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502144-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002144',
    'Creación: Dibuja una escena',
    1,
    '{"invitacion":"Dibuja una escena usando la mano que no sueles utilizar, si te resulta cómodo.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-145 · Regulación emocional: Escribe cómo explicarías: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502145-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002145',
    'Regulación emocional: Escribe cómo explicarías',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe cómo explicarías un límite usando una frase corta y respetuosa.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Escribe cómo explicarías» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-146 · Organización cotidiana: Compara dos formas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502146-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002146',
    'Organización cotidiana: Compara dos formas',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Compara dos formas», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Compara dos formas"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Compara dos formas"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-147 · Comer con flexibilidad: Prueba un utensilio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502147-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002147',
    'Comer con flexibilidad: Prueba un utensilio',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prueba un utensilio distinto para una comida que ya conoces, si te resulta cómodo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prueba un utensilio» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-148 · Autonomía y límites: Formula una petición: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502148-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002148',
    'Autonomía y límites: Formula una petición',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Formula una petición concreta comenzando con “¿Podrías ayudarme con…?”.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Formula una petición» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-149 · Juego y disfrute: Escoge tres canciones: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502149-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002149',
    'Juego y disfrute: Escoge tres canciones',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Escoge tres canciones","texto":"Escoge tres canciones que representen el estado de ánimo que elijas y organízalas en una lista.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-150 · Bienestar digital: Elige una franja: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502150-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002150',
    'Bienestar digital: Elige una franja',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Elige una franja», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Elige una franja"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Elige una franja"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-151 · Aire libre y comunidad: Pasa la comunidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502151-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002151',
    'Aire libre y comunidad: Pasa la comunidad',
    1,
    '{"modo":"pasos","intro":"Pasa por un espacio público que te guste y nombra tres usos que le da la comunidad.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Pasa por un espacio público que te guste y nombra tres usos que le da la comunidad."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Pasa la comunidad» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-152 · Aprendizaje cotidiano: Anota una pregunta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502152-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002152',
    'Aprendizaje cotidiano: Anota una pregunta',
    1,
    '{"invitacion":"Anota una pregunta que surgió hoy y qué fuente fiable consultarías para responderla.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-153 · Cuidado diario: Elige una cosa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502153-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002153',
    'Cuidado diario: Elige una cosa',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Elige una cosa","texto":"Elige una cosa que puedas delegar o pedir que te ayuden a hacer.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-154 · Movimiento amable: Imita con las: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502154-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002154',
    'Movimiento amable: Imita con las',
    1,
    '{"modo":"pasos","intro":"Imita con las manos dos formas distintas de una ola: alta y baja.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Imita con las manos dos formas distintas de una ola: alta y baja."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Imita con las» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-155 · Descanso y ritmo: Haz sin calificarlas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502155-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002155',
    'Descanso y ritmo: Haz sin calificarlas',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Haz sin calificarlas», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Haz sin calificarlas"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Haz sin calificarlas"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-156 · Vínculos: Pregunta a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502156-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002156',
    'Vínculos: Pregunta a alguien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pregunta a alguien cómo prefiere recibir apoyo cuando tiene un día difícil.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Pregunta a alguien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-157 · Creación: Inventa una palabra: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502157-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002157',
    'Creación: Inventa una palabra',
    1,
    '{"invitacion":"Inventa una palabra para describir un momento que no tiene nombre.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-158 · Regulación emocional: Prioriza una decisión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502158-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002158',
    'Regulación emocional: Prioriza una decisión',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prioriza una decisión pendiente y separa los pasos que te parecen importantes.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Prioriza una decisión» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-159 · Organización cotidiana: Agrupa los objetos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502159-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002159',
    'Organización cotidiana: Agrupa los objetos',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Agrupa los objetos», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Agrupa los objetos"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Agrupa los objetos"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-160 · Comer con flexibilidad: Elige una música: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502160-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002160',
    'Comer con flexibilidad: Elige una música',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una música para acompañar una comida y nota cómo cambia el ambiente.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Elige una música» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-161 · Autonomía y límites: Decide qué horario: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502161-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002161',
    'Autonomía y límites: Decide qué horario',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide qué horario te funciona para recibir llamadas o mensajes.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Decide qué horario» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-162 · Juego y disfrute: Prueba una receta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502162-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002162',
    'Juego y disfrute: Prueba una receta',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Prueba una receta","texto":"Prueba una receta creativa de origami o doblado de papel que ya conozcas.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-163 · Bienestar digital: Cambia el fondo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502163-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002163',
    'Bienestar digital: Cambia el fondo',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Cambia el fondo», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Cambia el fondo"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Cambia el fondo"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-164 · Aire libre y comunidad: Elige un punto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502164-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002164',
    'Aire libre y comunidad: Elige un punto',
    1,
    '{"modo":"pasos","intro":"Elige un punto cercano para observar cómo cambia el movimiento del lugar durante unos minutos.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Elige un punto cercano para observar cómo cambia el movimiento del lugar durante unos minutos."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Elige un punto» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-165 · Aprendizaje cotidiano: Aprende un dato: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502165-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002165',
    'Aprendizaje cotidiano: Aprende un dato',
    1,
    '{"invitacion":"Aprende un dato sobre un lugar cercano y compártelo con alguien interesado.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-166 · Cuidado diario: Separa o bolsillo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502166-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002166',
    'Cuidado diario: Separa o bolsillo',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Separa o bolsillo","texto":"Separa lo que necesitas para salir de casa en una sola bandeja o bolsillo.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-167 · Movimiento amable: Haz lo necesitas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502167-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002167',
    'Movimiento amable: Haz lo necesitas',
    1,
    '{"modo":"pasos","intro":"Haz una secuencia de pasos en el sitio al ritmo que tú elijas, con apoyo si lo necesitas.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz una secuencia de pasos en el sitio al ritmo que tú elijas, con apoyo si lo necesitas."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Haz lo necesitas» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-168 · Descanso y ritmo: Elige un espacio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502168-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002168',
    'Descanso y ritmo: Elige un espacio',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Elige un espacio», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Elige un espacio"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Elige un espacio"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-169 · Vínculos: Invita su manera: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502169-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002169',
    'Vínculos: Invita su manera',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Invita a una persona a hacer una pausa compartida, cada quien a su manera.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Invita su manera» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-170 · Creación: Crea una postal: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502170-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002170',
    'Creación: Crea una postal',
    1,
    '{"invitacion":"Crea una postal imaginaria de un lugar que te gustaría visitar.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-171 · Regulación emocional: Elige a quién: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502171-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002171',
    'Regulación emocional: Elige a quién',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige a quién podrías acudir para recibir compañía práctica o una escucha.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Elige a quién» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-172 · Organización cotidiana: Revisa tus compromisos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502172-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002172',
    'Organización cotidiana: Revisa tus compromisos',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Revisa tus compromisos», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Revisa tus compromisos"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Revisa tus compromisos"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-173 · Comer con flexibilidad: Prepara una merienda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502173-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002173',
    'Comer con flexibilidad: Prepara una merienda',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prepara una merienda con lo que ya está disponible, sin convertirlo en una meta.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prepara una merienda» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-174 · Autonomía y límites: Practica una decisión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502174-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002174',
    'Autonomía y límites: Practica una decisión',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Practica explicar que necesitas más contexto antes de tomar una decisión.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Practica una decisión» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-175 · Juego y disfrute: Dibuja un mapa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502175-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002175',
    'Juego y disfrute: Dibuja un mapa',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Dibuja un mapa","texto":"Dibuja un mapa del tesoro que lleve a un lugar cotidiano de tu casa.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-176 · Bienestar digital: Guarda una página: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502176-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002176',
    'Bienestar digital: Guarda una página',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Guarda una página», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Guarda una página"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Guarda una página"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-177 · Aire libre y comunidad: Deja un libro: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502177-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002177',
    'Aire libre y comunidad: Deja un libro',
    1,
    '{"modo":"pasos","intro":"Deja un libro en una caja comunitaria o toma uno, si existe y te interesa.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Deja un libro en una caja comunitaria o toma uno, si existe y te interesa."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Deja un libro» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-178 · Aprendizaje cotidiano: Practica paso olvidaste: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502178-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002178',
    'Aprendizaje cotidiano: Practica paso olvidaste',
    1,
    '{"invitacion":"Practica recordar una receta o instrucción y comprueba qué paso olvidaste.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-179 · Cuidado diario: Haz del lugar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502179-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002179',
    'Cuidado diario: Haz del lugar',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Haz del lugar","texto":"Haz una pausa para comprobar si necesitas ajustar la luz o el sonido del lugar.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-180 · Movimiento amable: Pasa una pelota: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502180-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002180',
    'Movimiento amable: Pasa una pelota',
    1,
    '{"modo":"pasos","intro":"Pasa una pelota blanda de una mano a otra o rueda una prenda hecha bola.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Pasa una pelota blanda de una mano a otra o rueda una prenda hecha bola."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Pasa una pelota» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-181 · Descanso y ritmo: Decide si esta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502181-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002181',
    'Descanso y ritmo: Decide si esta',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Decide si esta», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Decide si esta"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Decide si esta"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-182 · Vínculos: Ofrece persona decida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502182-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002182',
    'Vínculos: Ofrece persona decida',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Ofrece ayuda en una tarea concreta y deja que la otra persona decida.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Ofrece persona decida» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-183 · Creación: Escribe una historia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502183-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002183',
    'Creación: Escribe una historia',
    1,
    '{"invitacion":"Escribe una historia de seis líneas donde un objeto encuentra un nuevo uso.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-184 · Regulación emocional: Describe un momento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502184-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002184',
    'Regulación emocional: Describe un momento',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Describe un momento incómodo como si fueras una persona observadora, sin insultarte.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Describe un momento» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-185 · Organización cotidiana: Elige un cajón: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502185-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002185',
    'Organización cotidiana: Elige un cajón',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Elige un cajón», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Elige un cajón"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Elige un cajón"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-186 · Comer con flexibilidad: Recuerda una comida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502186-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002186',
    'Comer con flexibilidad: Recuerda una comida',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Recuerda una comida que compartiste con alguien y cuéntale por qué la recuerdas.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Recuerda una comida» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-187 · Autonomía y límites: Elige una responsabilidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502187-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002187',
    'Autonomía y límites: Elige una responsabilidad',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una responsabilidad que no te corresponde resolver a solas.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Elige una responsabilidad» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-188 · Juego y disfrute: Elige una película: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502188-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002188',
    'Juego y disfrute: Elige una película',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Elige una película","texto":"Elige una película o serie y propón un final alternativo en tres frases.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-189 · Bienestar digital: Revisa qué permisos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502189-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002189',
    'Bienestar digital: Revisa qué permisos',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Revisa qué permisos», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Revisa qué permisos"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Revisa qué permisos"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-190 · Aire libre y comunidad: Busca un evento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502190-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002190',
    'Aire libre y comunidad: Busca un evento',
    1,
    '{"modo":"pasos","intro":"Busca un evento gratuito en tu barrio y decide si quieres asistir o invitar a alguien.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Busca un evento gratuito en tu barrio y decide si quieres asistir o invitar a alguien."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Busca un evento» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-191 · Aprendizaje cotidiano: Elige un objeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502191-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002191',
    'Aprendizaje cotidiano: Elige un objeto',
    1,
    '{"invitacion":"Elige un objeto cotidiano y averigua cómo se fabrica o para qué se diseñó.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-192 · Cuidado diario: Deja empezar mañana: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502192-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002192',
    'Cuidado diario: Deja empezar mañana',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Deja empezar mañana","texto":"Deja una nota amable donde la encuentres al empezar mañana.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-193 · Movimiento amable: Acompaña una canción: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502193-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002193',
    'Movimiento amable: Acompaña una canción',
    1,
    '{"modo":"pasos","intro":"Acompaña una canción con palmas suaves, muslos o dedos, según prefieras.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Acompaña una canción con palmas suaves, muslos o dedos, según prefieras."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Acompaña una canción» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-194 · Descanso y ritmo: Prepara una nota: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502194-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002194',
    'Descanso y ritmo: Prepara una nota',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Prepara una nota», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Prepara una nota"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Prepara una nota"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-195 · Vínculos: Solicita una explicación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502195-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002195',
    'Vínculos: Solicita una explicación',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Solicita una explicación clara cuando una indicación no te quede clara.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Solicita una explicación» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-196 · Creación: Diseña una portada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502196-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002196',
    'Creación: Diseña una portada',
    1,
    '{"invitacion":"Diseña una portada para una lista de canciones que represente tu semana.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-197 · Regulación emocional: Haz una conversación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502197-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002197',
    'Regulación emocional: Haz una conversación',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Haz una lista de tres maneras distintas de pedir una pausa en una conversación.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Haz una conversación» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-198 · Organización cotidiana: Convierte una instrucción: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502198-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002198',
    'Organización cotidiana: Convierte una instrucción',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Convierte una instrucción», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Convierte una instrucción"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Convierte una instrucción"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-199 · Comer con flexibilidad: Organiza los ingredientes: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502199-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002199',
    'Comer con flexibilidad: Organiza los ingredientes',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Organiza los ingredientes de una receta antes de comenzar a prepararla.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Organiza los ingredientes» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-200 · Autonomía y límites: Escribe una respuesta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502200-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002200',
    'Autonomía y límites: Escribe una respuesta',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe una respuesta para pedir más tiempo sin justificarte de más.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Escribe una respuesta» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-201 · Juego y disfrute: Juega a describir: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502201-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002201',
    'Juego y disfrute: Juega a describir',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Juega a describir","texto":"Juega a describir un objeto sin decir su nombre y deja que alguien lo adivine.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-202 · Bienestar digital: Ordena la pantalla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502202-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002202',
    'Bienestar digital: Ordena la pantalla',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Ordena la pantalla», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Ordena la pantalla"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Ordena la pantalla"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-203 · Aire libre y comunidad: Riega una planta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502203-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002203',
    'Aire libre y comunidad: Riega una planta',
    1,
    '{"modo":"pasos","intro":"Riega una planta propia o comunitaria si está permitido y necesita agua.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Riega una planta propia o comunitaria si está permitido y necesita agua."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Riega una planta» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-204 · Aprendizaje cotidiano: Pídele parecido útil: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502204-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002204',
    'Aprendizaje cotidiano: Pídele parecido útil',
    1,
    '{"invitacion":"Pídele a alguien que te muestre cómo hace una tarea que siempre te ha parecido útil.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-205 · Cuidado diario: Pon a cargar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502205-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002205',
    'Cuidado diario: Pon a cargar',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Pon a cargar","texto":"Pon a cargar un dispositivo en un sitio que no interrumpa tu descanso.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-206 · Movimiento amable: Estira una pierna: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502206-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002206',
    'Movimiento amable: Estira una pierna',
    1,
    '{"modo":"pasos","intro":"Estira una pierna sentado y dibuja un círculo pequeño con el pie; cambia de lado.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Estira una pierna sentado y dibuja un círculo pequeño con el pie; cambia de lado."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Estira una pierna» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-207 · Descanso y ritmo: Escoge la vez: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502207-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002207',
    'Descanso y ritmo: Escoge la vez',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Escoge la vez», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Escoge la vez"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Escoge la vez"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-208 · Vínculos: Cuéntale a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502208-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002208',
    'Vínculos: Cuéntale a alguien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Cuéntale a alguien una pequeña cosa que te salió bien hoy.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Cuéntale a alguien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-209 · Creación: Haz un collage: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502209-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002209',
    'Creación: Haz un collage',
    1,
    '{"invitacion":"Haz un collage con formas o palabras recortadas de papel que ya no uses.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-210 · Regulación emocional: Recuerda una ocasión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502210-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002210',
    'Regulación emocional: Recuerda una ocasión',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Recuerda una ocasión en que resolviste algo difícil y señala qué recurso usaste.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Recuerda una ocasión» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-211 · Organización cotidiana: Marca qué tarea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502211-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002211',
    'Organización cotidiana: Marca qué tarea',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Marca qué tarea», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Marca qué tarea"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Marca qué tarea"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-212 · Comer con flexibilidad: Elige un alimento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502212-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002212',
    'Comer con flexibilidad: Elige un alimento',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige un alimento por su textura y describe la sensación con tus propias palabras.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Elige un alimento» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-213 · Autonomía y límites: Señala qué condición: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502213-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002213',
    'Autonomía y límites: Señala qué condición',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Señala qué condición haría que un plan compartido te resultara más cómodo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Señala qué condición» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-214 · Juego y disfrute: Crea una categoría: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502214-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002214',
    'Juego y disfrute: Crea una categoría',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Crea una categoría","texto":"Crea una categoría inesperada y busca objetos que pertenezcan a ella.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-215 · Bienestar digital: Establece un límite: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502215-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002215',
    'Bienestar digital: Establece un límite',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Establece un límite», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Establece un límite"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Establece un límite"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-216 · Aire libre y comunidad: Elige un comercio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502216-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002216',
    'Aire libre y comunidad: Elige un comercio',
    1,
    '{"modo":"pasos","intro":"Elige un comercio local y averigua qué producto o servicio ofrece.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Elige un comercio local y averigua qué producto o servicio ofrece."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Elige un comercio» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-217 · Aprendizaje cotidiano: Aprende una regla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502217-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002217',
    'Aprendizaje cotidiano: Aprende una regla',
    1,
    '{"invitacion":"Aprende una regla de un juego nuevo y explícasela a otra persona.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-218 · Cuidado diario: Prepara un espacio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502218-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002218',
    'Cuidado diario: Prepara un espacio',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Prepara un espacio","texto":"Prepara un espacio sencillo para la próxima comida, sin cambiar lo que vas a comer.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-219 · Movimiento amable: Haz una coreografía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502219-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002219',
    'Movimiento amable: Haz una coreografía',
    1,
    '{"modo":"pasos","intro":"Haz una coreografía de cuatro gestos cotidianos: saludar, alcanzar, girar y descansar.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz una coreografía de cuatro gestos cotidianos: saludar, alcanzar, girar y descansar."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Haz una coreografía» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-220 · Descanso y ritmo: Deja un margen: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502220-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002220',
    'Descanso y ritmo: Deja un margen',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Deja un margen», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Deja un margen"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Deja un margen"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-221 · Vínculos: Propón una llamada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502221-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002221',
    'Vínculos: Propón una llamada',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Propón una llamada o intercambio de audios a alguien con quien quieras hablar.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Propón una llamada» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-222 · Creación: Describe un color: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502222-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002222',
    'Creación: Describe un color',
    1,
    '{"invitacion":"Describe un color sin nombrarlo y deja que otra persona lo adivine, si quieres.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-223 · Regulación emocional: Cambia una autocrítica: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502223-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002223',
    'Regulación emocional: Cambia una autocrítica',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Cambia una autocrítica por una descripción concreta de lo que pasó.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Cambia una autocrítica» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-224 · Organización cotidiana: Prepara un menú: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502224-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002224',
    'Organización cotidiana: Prepara un menú',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Prepara un menú», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Prepara un menú"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Prepara un menú"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-225 · Comer con flexibilidad: Prepara una bebida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502225-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002225',
    'Comer con flexibilidad: Prepara una bebida',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prepara una bebida que ya disfrutas y elige una taza o vaso que te agrade.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prepara una bebida» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-226 · Autonomía y límites: Elige si quieres: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502226-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002226',
    'Autonomía y límites: Elige si quieres',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige si quieres participar, observar o retirarte de una actividad social.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Elige si quieres» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-227 · Juego y disfrute: Inventa un nombre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502227-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002227',
    'Juego y disfrute: Inventa un nombre',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Inventa un nombre","texto":"Inventa un nombre para una banda formada por tus objetos favoritos.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-228 · Bienestar digital: Lee un mensaje: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502228-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002228',
    'Bienestar digital: Lee un mensaje',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Lee un mensaje», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Lee un mensaje"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Lee un mensaje"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-229 · Aire libre y comunidad: Si ya tienes: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502229-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002229',
    'Aire libre y comunidad: Si ya tienes',
    1,
    '{"modo":"pasos","intro":"Si ya tienes una salida, identifica un lugar donde podrías detenerte a descansar.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Si ya tienes una salida, identifica un lugar donde podrías detenerte a descansar."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Si ya tienes» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-230 · Aprendizaje cotidiano: Prueba una técnica: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502230-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002230',
    'Aprendizaje cotidiano: Prueba una técnica',
    1,
    '{"invitacion":"Prueba una técnica para tomar notas y decide si te sirve para una próxima reunión.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-231 · Cuidado diario: Guarda un objeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502231-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002231',
    'Cuidado diario: Guarda un objeto',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Guarda un objeto","texto":"Guarda un objeto que ya cumplió su función por hoy.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-232 · Movimiento amable: Practica al inicio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502232-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002232',
    'Movimiento amable: Practica al inicio',
    1,
    '{"modo":"pasos","intro":"Practica tocar con cada dedo de la mano una superficie cercana y vuelve al inicio.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Practica tocar con cada dedo de la mano una superficie cercana y vuelve al inicio."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Practica al inicio» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-233 · Descanso y ritmo: Elige puede esperar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502233-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002233',
    'Descanso y ritmo: Elige puede esperar',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Elige puede esperar», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Elige puede esperar"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Elige puede esperar"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-234 · Vínculos: Haz una pregunta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502234-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002234',
    'Vínculos: Haz una pregunta',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Haz una pregunta abierta y escucha la respuesta sin cambiar el tema enseguida.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Haz una pregunta» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-235 · Creación: Inventa una celebración: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502235-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002235',
    'Creación: Inventa una celebración',
    1,
    '{"invitacion":"Inventa una celebración pequeña para marcar el final de una tarea.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-236 · Regulación emocional: Elige una preocupación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502236-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002236',
    'Regulación emocional: Elige una preocupación',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una preocupación que puedas dejar anotada para retomarla en otro momento.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Elige una preocupación» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-237 · Organización cotidiana: Configura una alarma: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502237-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002237',
    'Organización cotidiana: Configura una alarma',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Configura una alarma», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Configura una alarma"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Configura una alarma"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-238 · Comer con flexibilidad: Haz algún día: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502238-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002238',
    'Comer con flexibilidad: Haz algún día',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Haz una lista de sabores que te gustaría volver a probar algún día.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Haz algún día» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-239 · Autonomía y límites: Practica con claridad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502239-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002239',
    'Autonomía y límites: Practica con claridad',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Practica cambiar de opinión sobre un plan y comunicarlo con claridad.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Practica con claridad» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-240 · Juego y disfrute: Haz opciones curiosas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502240-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002240',
    'Juego y disfrute: Haz opciones curiosas',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Haz opciones curiosas","texto":"Haz una ronda de “esto o aquello” con alguien: elijan entre dos opciones curiosas.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-241 · Bienestar digital: Pasa una actividad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502241-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002241',
    'Bienestar digital: Pasa una actividad',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Pasa una actividad», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Pasa una actividad"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Pasa una actividad"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-242 · Aire libre y comunidad: Haz un recorrido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502242-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002242',
    'Aire libre y comunidad: Haz un recorrido',
    1,
    '{"modo":"pasos","intro":"Haz un recorrido breve hasta un punto conocido usando una alternativa segura.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz un recorrido breve hasta un punto conocido usando una alternativa segura."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Haz un recorrido» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-243 · Aprendizaje cotidiano: Busca el significado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502243-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002243',
    'Aprendizaje cotidiano: Busca el significado',
    1,
    '{"invitacion":"Busca el significado de una palabra que oíste y escribe un ejemplo propio.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-244 · Cuidado diario: Elige más cómoda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502244-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002244',
    'Cuidado diario: Elige más cómoda',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Elige más cómoda","texto":"Elige una tarea que harás sentado si así te resulta más cómoda.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-245 · Movimiento amable: Ponte de pie: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502245-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002245',
    'Movimiento amable: Ponte de pie',
    1,
    '{"modo":"pasos","intro":"Ponte de pie con apoyo, cambia el peso de un pie al otro y vuelve a sentarte si es seguro.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Ponte de pie con apoyo, cambia el peso de un pie al otro y vuelve a sentarte si es seguro."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Ponte de pie» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-246 · Descanso y ritmo: Planea una pausa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502246-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002246',
    'Descanso y ritmo: Planea una pausa',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Planea una pausa», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Planea una pausa"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Planea una pausa"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-247 · Vínculos: Expresa una preferencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502247-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002247',
    'Vínculos: Expresa una preferencia',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Expresa una preferencia sencilla al organizar un plan compartido.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Expresa una preferencia» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-248 · Creación: Escribe tres versos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502248-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002248',
    'Creación: Escribe tres versos',
    1,
    '{"invitacion":"Escribe tres versos libres sobre algo cotidiano que te resulte agradable.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-249 · Regulación emocional: Escribe dos respuestas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502249-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002249',
    'Regulación emocional: Escribe dos respuestas',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe dos respuestas posibles a una situación y elige cuál cuida mejor tus necesidades.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Escribe dos respuestas» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-250 · Organización cotidiana: Cierra las pestañas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502250-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002250',
    'Organización cotidiana: Cierra las pestañas',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Cierra las pestañas», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Cierra las pestañas"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Cierra las pestañas"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-251 · Comer con flexibilidad: Pregunta o comunidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502251-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002251',
    'Comer con flexibilidad: Pregunta o comunidad',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pregunta a alguien por una receta que aprendió de su familia o comunidad.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Pregunta o comunidad» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-252 · Autonomía y límites: Decide qué tema: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502252-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002252',
    'Autonomía y límites: Decide qué tema',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide qué tema prefieres no conversar hoy y prepara una frase para decirlo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Decide qué tema» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-253 · Juego y disfrute: Elige terminarla hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502253-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002253',
    'Juego y disfrute: Elige terminarla hoy',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Elige terminarla hoy","texto":"Elige una actividad recreativa que puedas disfrutar sin terminarla hoy.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-254 · Bienestar digital: Haz una copia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502254-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002254',
    'Bienestar digital: Haz una copia',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Haz una copia», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Haz una copia"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Haz una copia"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-255 · Aire libre y comunidad: Lleva una bolsa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502255-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002255',
    'Aire libre y comunidad: Lleva una bolsa',
    1,
    '{"modo":"pasos","intro":"Lleva una bolsa reutilizable en una diligencia que ya tenías planeada.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Lleva una bolsa reutilizable en una diligencia que ya tenías planeada."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Lleva una bolsa» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-256 · Aprendizaje cotidiano: Compara dos instrucciones: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502256-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002256',
    'Aprendizaje cotidiano: Compara dos instrucciones',
    1,
    '{"invitacion":"Compara dos instrucciones para una tarea y elige cuál te resulta más clara.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-257 · Cuidado diario: Ajusta la altura: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502257-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002257',
    'Cuidado diario: Ajusta la altura',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Ajusta la altura","texto":"Ajusta la altura de la pantalla o del asiento para mirar con comodidad.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-258 · Movimiento amable: Realiza una secuencia: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502258-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002258',
    'Movimiento amable: Realiza una secuencia',
    1,
    '{"modo":"pasos","intro":"Realiza una secuencia lenta de muñecas: arriba, abajo, círculos y descanso.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Realiza una secuencia lenta de muñecas: arriba, abajo, círculos y descanso."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Realiza una secuencia» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-259 · Descanso y ritmo: Haz elegir ahora: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502259-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002259',
    'Descanso y ritmo: Haz elegir ahora',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Haz elegir ahora», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Haz elegir ahora"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Haz elegir ahora"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-260 · Vínculos: Dile a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502260-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002260',
    'Vínculos: Dile a alguien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Dile a alguien qué tipo de compañía te vendría bien esta semana.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Dile a alguien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-261 · Creación: Dibuja un recorrido: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502261-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002261',
    'Creación: Dibuja un recorrido',
    1,
    '{"invitacion":"Dibuja un recorrido fantástico entre dos lugares conocidos.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-262 · Regulación emocional: Pon un nombre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502262-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002262',
    'Regulación emocional: Pon un nombre',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pon un nombre a la intensidad del día usando una escala inventada por ti.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Pon un nombre» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-263 · Organización cotidiana: Elige una superficie: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502263-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002263',
    'Organización cotidiana: Elige una superficie',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Elige una superficie», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Elige una superficie"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Elige una superficie"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-264 · Comer con flexibilidad: Elige cómoda hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502264-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002264',
    'Comer con flexibilidad: Elige cómoda hoy',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una comida conocida y sirve una porción que te resulte cómoda hoy.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Elige cómoda hoy» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-265 · Autonomía y límites: Pide más equilibrada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502265-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002265',
    'Autonomía y límites: Pide más equilibrada',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pide que una tarea se reparta de una forma más equilibrada.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Pide más equilibrada» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-266 · Juego y disfrute: Construye una torre: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502266-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002266',
    'Juego y disfrute: Construye una torre',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Construye una torre","texto":"Construye una torre baja con piezas u objetos ligeros y cambia su base.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-267 · Bienestar digital: Quita de favoritos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502267-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002267',
    'Bienestar digital: Quita de favoritos',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Quita de favoritos», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Quita de favoritos"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Quita de favoritos"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-268 · Aire libre y comunidad: Pregunta la zona: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502268-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002268',
    'Aire libre y comunidad: Pregunta la zona',
    1,
    '{"modo":"pasos","intro":"Pregunta a alguien del barrio cuál es su lugar favorito de la zona.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Pregunta a alguien del barrio cuál es su lugar favorito de la zona."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Pregunta la zona» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-269 · Aprendizaje cotidiano: Practica una habilidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502269-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002269',
    'Aprendizaje cotidiano: Practica una habilidad',
    1,
    '{"invitacion":"Practica una habilidad manual con materiales que ya tengas, sin buscar que quede perfecta.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-270 · Cuidado diario: Reúne al salir: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502270-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002270',
    'Cuidado diario: Reúne al salir',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Reúne al salir","texto":"Reúne en un mismo lugar los elementos que usas al salir.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-271 · Movimiento amable: Imita un movimiento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502271-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002271',
    'Movimiento amable: Imita un movimiento',
    1,
    '{"modo":"pasos","intro":"Imita un movimiento de animal usando solo las manos o los brazos.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Imita un movimiento de animal usando solo las manos o los brazos."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Imita un movimiento» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-272 · Descanso y ritmo: Decide simplificar hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502272-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002272',
    'Descanso y ritmo: Decide simplificar hoy',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Decide simplificar hoy», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Decide simplificar hoy"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Decide simplificar hoy"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-273 · Vínculos: Comparte una recomendación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502273-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002273',
    'Vínculos: Comparte una recomendación',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Comparte una recomendación de libro, canción o lugar con alguien que la disfrutaría.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Comparte una recomendación» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-274 · Creación: Crea una mini: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502274-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002274',
    'Creación: Crea una mini',
    1,
    '{"invitacion":"Crea una mini historieta de tres cuadros sobre una situación cotidiana.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-275 · Regulación emocional: Decide qué información: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502275-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002275',
    'Regulación emocional: Decide qué información',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide qué información necesitas antes de responder a una petición.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Decide qué información» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-276 · Organización cotidiana: Haz último minuto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502276-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002276',
    'Organización cotidiana: Haz último minuto',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Haz último minuto», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Haz último minuto"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Haz último minuto"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-277 · Comer con flexibilidad: Prueba hayas juntado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502277-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002277',
    'Comer con flexibilidad: Prueba hayas juntado',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Prueba una combinación de dos alimentos habituales que nunca hayas juntado.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Prueba hayas juntado» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-278 · Autonomía y límites: Elige qué notificaciones: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502278-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002278',
    'Autonomía y límites: Elige qué notificaciones',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige qué notificaciones quieres mantener activas durante tu tiempo libre.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Elige qué notificaciones» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-279 · Juego y disfrute: Crea por gusto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502279-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002279',
    'Juego y disfrute: Crea por gusto',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Crea por gusto","texto":"Crea una lista de lugares cercanos que te gustaría visitar por gusto.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-280 · Bienestar digital: Escoge espera breve: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502280-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002280',
    'Bienestar digital: Escoge espera breve',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Escoge espera breve», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Escoge espera breve"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Escoge espera breve"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-281 · Aire libre y comunidad: Elige gusto allí: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502281-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002281',
    'Aire libre y comunidad: Elige gusto allí',
    1,
    '{"modo":"pasos","intro":"Elige una actividad comunitaria y anota qué necesitarías para sentirte a gusto allí.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Elige una actividad comunitaria y anota qué necesitarías para sentirte a gusto allí."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Elige gusto allí» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-282 · Aprendizaje cotidiano: Elige un tema: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502282-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002282',
    'Aprendizaje cotidiano: Elige un tema',
    1,
    '{"invitacion":"Elige un tema que te interese y crea tres preguntas para seguir aprendiendo.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-283 · Cuidado diario: Escoge tu jornada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502283-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002283',
    'Cuidado diario: Escoge tu jornada',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Escoge tu jornada","texto":"Escoge una actividad agradable para hacer después de terminar tu jornada.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-284 · Movimiento amable: Coordina un paso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502284-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002284',
    'Movimiento amable: Coordina un paso',
    1,
    '{"modo":"pasos","intro":"Coordina un paso lateral con una palmada suave; también puedes hacerlo sentado con las manos.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Coordina un paso lateral con una palmada suave; también puedes hacerlo sentado con las manos."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Coordina un paso» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-285 · Descanso y ritmo: Termina el día: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502285-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002285',
    'Descanso y ritmo: Termina el día',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Termina el día», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Termina el día"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Termina el día"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-286 · Vínculos: Responde un mensaje: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502286-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002286',
    'Vínculos: Responde un mensaje',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Responde un mensaje pendiente con una frase honesta sobre cuándo podrás conversar.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Responde un mensaje» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-287 · Creación: Inventa un juego: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502287-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002287',
    'Creación: Inventa un juego',
    1,
    '{"invitacion":"Inventa un juego de palabras con el nombre de un objeto cercano.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-288 · Regulación emocional: Haz día complicado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502288-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002288',
    'Regulación emocional: Haz día complicado',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Haz una lista de recursos que ya tienes para afrontar un día complicado.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Haz día complicado» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-289 · Organización cotidiana: Separa los mensajes: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502289-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002289',
    'Organización cotidiana: Separa los mensajes',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Separa los mensajes», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Separa los mensajes"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Separa los mensajes"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-290 · Comer con flexibilidad: Elige a solas: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502290-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002290',
    'Comer con flexibilidad: Elige a solas',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una comida que puedas preparar con ayuda si hoy no quieres hacerla a solas.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Elige a solas» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-291 · Autonomía y límites: Explica qué tipo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502291-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002291',
    'Autonomía y límites: Explica qué tipo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Explica qué tipo de ayuda sí te sirve y cuál prefieres recibir de otra manera.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Explica qué tipo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-292 · Juego y disfrute: Imita un personaje: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502292-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002292',
    'Juego y disfrute: Imita un personaje',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Imita un personaje","texto":"Imita un personaje ficticio durante una tarea sencilla, si te divierte hacerlo.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-293 · Bienestar digital: Revisa tu lista: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502293-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002293',
    'Bienestar digital: Revisa tu lista',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Revisa tu lista», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Revisa tu lista"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Revisa tu lista"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-294 · Aire libre y comunidad: Pasa un rato: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502294-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002294',
    'Aire libre y comunidad: Pasa un rato',
    1,
    '{"modo":"pasos","intro":"Pasa un rato en un espacio abierto y escucha una canción que hayas elegido antes.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Pasa un rato en un espacio abierto y escucha una canción que hayas elegido antes."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Pasa un rato» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-295 · Aprendizaje cotidiano: Pide quieras probar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502295-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002295',
    'Aprendizaje cotidiano: Pide quieras probar',
    1,
    '{"invitacion":"Pide retroalimentación sobre una tarea y escoge una sugerencia que quieras probar.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-296 · Cuidado diario: Abre una ventana: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502296-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002296',
    'Cuidado diario: Abre una ventana',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Abre una ventana","texto":"Abre una ventana o cambia el aire del espacio solo si te resulta cómodo.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-297 · Movimiento amable: Haz en reposo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502297-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002297',
    'Movimiento amable: Haz en reposo',
    1,
    '{"modo":"pasos","intro":"Haz una secuencia de alcance: objeto cercano, objeto a media distancia y manos en reposo.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz una secuencia de alcance: objeto cercano, objeto a media distancia y manos en reposo."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Haz en reposo» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-298 · Descanso y ritmo: Deja quieras disfrutar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502298-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002298',
    'Descanso y ritmo: Deja quieras disfrutar',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Deja quieras disfrutar», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Deja quieras disfrutar"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Deja quieras disfrutar"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-299 · Vínculos: Pide a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502299-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002299',
    'Vínculos: Pide a alguien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pide a alguien que te acompañe mientras empiezas una tarea que has postergado.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Pide a alguien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-300 · Creación: Escribe un anuncio: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502300-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002300',
    'Creación: Escribe un anuncio',
    1,
    '{"invitacion":"Escribe un anuncio divertido para una planta, taza o herramienta imaginaria.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-301 · Regulación emocional: Practica responder lo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502301-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002301',
    'Regulación emocional: Practica responder lo',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Practica responder “lo voy a pensar” ante una decisión que no quieres tomar de inmediato.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Practica responder lo» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-302 · Organización cotidiana: Revisa una rutina: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502302-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002302',
    'Organización cotidiana: Revisa una rutina',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Revisa una rutina», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Revisa una rutina"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Revisa una rutina"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-303 · Comer con flexibilidad: Pon la mesa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502303-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002303',
    'Comer con flexibilidad: Pon la mesa',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Pon la mesa de una manera distinta usando solo lo que ya tienes.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Pon la mesa» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-304 · Autonomía y límites: Decide si quieres: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502304-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002304',
    'Autonomía y límites: Decide si quieres',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide si quieres contestar ahora, después o no contestar a una solicitud.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Decide si quieres» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-305 · Juego y disfrute: Diseña una búsqueda: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502305-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002305',
    'Juego y disfrute: Diseña una búsqueda',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Diseña una búsqueda","texto":"Diseña una búsqueda del tesoro de tres pistas para alguien de tu hogar.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-306 · Bienestar digital: Escribe de enviarla: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502306-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002306',
    'Bienestar digital: Escribe de enviarla',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Escribe de enviarla», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Escribe de enviarla"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Escribe de enviarla"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-307 · Aire libre y comunidad: Toma una foto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502307-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002307',
    'Aire libre y comunidad: Toma una foto',
    1,
    '{"modo":"pasos","intro":"Toma una foto de una señal, mural o fachada que cuente algo de tu comunidad.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Toma una foto de una señal, mural o fachada que cuente algo de tu comunidad."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Toma una foto» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-308 · Aprendizaje cotidiano: Aprende cómo se: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502308-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002308',
    'Aprendizaje cotidiano: Aprende cómo se',
    1,
    '{"invitacion":"Aprende cómo se organiza una actividad cultural o deportiva de tu comunidad.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-309 · Cuidado diario: Prepara una bolsa: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502309-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002309',
    'Cuidado diario: Prepara una bolsa',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Prepara una bolsa","texto":"Prepara una bolsa reutilizable para tenerla lista en tu próxima salida.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-310 · Movimiento amable: Sigue un patrón: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502310-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002310',
    'Movimiento amable: Sigue un patrón',
    1,
    '{"modo":"pasos","intro":"Sigue un patrón motor de dos tiempos y luego inventa un tercero.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Sigue un patrón motor de dos tiempos y luego inventa un tercero."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Sigue un patrón» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-311 · Descanso y ritmo: Elige ya empezó: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502311-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002311',
    'Descanso y ritmo: Elige ya empezó',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Elige ya empezó», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Elige ya empezó"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Elige ya empezó"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-312 · Vínculos: Celebra un logro: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502312-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002312',
    'Vínculos: Celebra un logro',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Celebra un logro de otra persona con palabras que mencionen su esfuerzo concreto.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Celebra un logro» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-313 · Creación: Combina dos actividades: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502313-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002313',
    'Creación: Combina dos actividades',
    1,
    '{"invitacion":"Combina dos actividades que disfrutas y ponle un nombre a la mezcla.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-314 · Regulación emocional: Identifica una emoción: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502314-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002314',
    'Regulación emocional: Identifica una emoción',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Identifica una emoción que aparece junto con otra y escribe cómo se relacionan.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Identifica una emoción» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-315 · Organización cotidiana: Elige al momento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502315-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002315',
    'Organización cotidiana: Elige al momento',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Elige al momento», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Elige al momento"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Elige al momento"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-316 · Comer con flexibilidad: Explora el aroma: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502316-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002316',
    'Comer con flexibilidad: Explora el aroma',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Explora el aroma de una comida mientras se prepara, sin necesidad de describirlo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Explora el aroma» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-317 · Autonomía y límites: Practica o llamada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502317-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002317',
    'Autonomía y límites: Practica o llamada',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Practica poner un límite de tiempo a una reunión o llamada.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Practica o llamada» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-318 · Juego y disfrute: Encuentra un juego: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502318-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002318',
    'Juego y disfrute: Encuentra un juego',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Encuentra un juego","texto":"Encuentra un juego de mesa o aplicación cooperativa y acuerda una partida corta.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-319 · Bienestar digital: Cambia el tamaño: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502319-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002319',
    'Bienestar digital: Cambia el tamaño',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Cambia el tamaño», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Cambia el tamaño"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Cambia el tamaño"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-320 · Aire libre y comunidad: Comprueba si hay: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502320-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002320',
    'Aire libre y comunidad: Comprueba si hay',
    1,
    '{"modo":"pasos","intro":"Comprueba si hay una ruta o servicio accesible que facilite una salida futura.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Comprueba si hay una ruta o servicio accesible que facilite una salida futura."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Comprueba si hay» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-321 · Aprendizaje cotidiano: Explica con tus: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502321-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002321',
    'Aprendizaje cotidiano: Explica con tus',
    1,
    '{"invitacion":"Explica con tus palabras algo que aprendiste recientemente, aunque sea en una nota privada.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-322 · Cuidado diario: Decide qué aviso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502322-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002322',
    'Cuidado diario: Decide qué aviso',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Decide qué aviso","texto":"Decide qué aviso del teléfono puede esperar hasta más tarde.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-323 · Movimiento amable: Mueve los dedos: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502323-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002323',
    'Movimiento amable: Mueve los dedos',
    1,
    '{"modo":"pasos","intro":"Mueve los dedos de los pies dentro del calzado y después apóyalos con comodidad.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Mueve los dedos de los pies dentro del calzado y después apóyalos con comodidad."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Mueve los dedos» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-324 · Descanso y ritmo: Haz por hoy: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502324-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002324',
    'Descanso y ritmo: Haz por hoy',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Haz por hoy», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Haz por hoy"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Haz por hoy"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-325 · Vínculos: Agradece a alguien: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502325-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002325',
    'Vínculos: Agradece a alguien',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Agradece a alguien una costumbre pequeña que valoras de esa persona.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Agradece a alguien» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-326 · Creación: Haz canción inventada: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502326-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002326',
    'Creación: Haz canción inventada',
    1,
    '{"invitacion":"Haz una lista de sonidos y conviértela en el título de una canción inventada.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-327 · Regulación emocional: Elige más disponibilidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502327-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002327',
    'Regulación emocional: Elige más disponibilidad',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Elige una tarea que puedas dejar para cuando tengas más disponibilidad.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Elige más disponibilidad» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-328 · Organización cotidiana: Guarda un documento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502328-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002328',
    'Organización cotidiana: Guarda un documento',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Guarda un documento», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Guarda un documento"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Guarda un documento"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-329 · Comer con flexibilidad: Escoge con anticipación: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502329-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002329',
    'Comer con flexibilidad: Escoge con anticipación',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escoge una receta breve y decide qué paso puedes dejar preparado con anticipación.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Escoge con anticipación» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-330 · Autonomía y límites: Escoge una decisión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502330-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002330',
    'Autonomía y límites: Escoge una decisión',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escoge una decisión pequeña que puedas tomar sin pedir permiso a todo el mundo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Escoge una decisión» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-331 · Juego y disfrute: Haz una foto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502331-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002331',
    'Juego y disfrute: Haz una foto',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Haz una foto","texto":"Haz una foto creativa de un objeto cotidiano desde un ángulo poco habitual.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-332 · Bienestar digital: Elige un momento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502332-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002332',
    'Bienestar digital: Elige un momento',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Elige un momento», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Elige un momento"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Elige un momento"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-333 · Aire libre y comunidad: Lleva una nota: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502333-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002333',
    'Aire libre y comunidad: Lleva una nota',
    1,
    '{"modo":"pasos","intro":"Lleva una nota o paquete a alguien cercano si ya ibas a salir.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Lleva una nota o paquete a alguien cercano si ya ibas a salir."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Lleva una nota» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-334 · Aprendizaje cotidiano: Elige una receta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502334-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002334',
    'Aprendizaje cotidiano: Elige una receta',
    1,
    '{"invitacion":"Elige una receta, juego o manualidad y lee todos los pasos antes de empezar.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-335 · Cuidado diario: Busca una forma: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502335-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002335',
    'Cuidado diario: Busca una forma',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Busca una forma","texto":"Busca una forma de hacer más fácil una tarea que repites cada semana.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-336 · Movimiento amable: Cambia de mano: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502336-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002336',
    'Movimiento amable: Cambia de mano',
    1,
    '{"modo":"pasos","intro":"Cambia de mano para una tarea ligera y cotidiana si hacerlo te resulta práctico.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Cambia de mano para una tarea ligera y cotidiana si hacerlo te resulta práctico."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Cambia de mano» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-337 · Descanso y ritmo: Ajusta tu plan: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502337-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002337',
    'Descanso y ritmo: Ajusta tu plan',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Ajusta tu plan», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Ajusta tu plan"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Ajusta tu plan"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-338 · Vínculos: Propón un plan: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502338-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002338',
    'Vínculos: Propón un plan',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Propón un plan que permita conversar y también guardar ratos de silencio.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Propón un plan» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-339 · Creación: Diseña una etiqueta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502339-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002339',
    'Creación: Diseña una etiqueta',
    1,
    '{"invitacion":"Diseña una etiqueta para una caja donde guardarías recuerdos importantes.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-340 · Regulación emocional: Escribe un plan: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502340-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002340',
    'Regulación emocional: Escribe un plan',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe un plan alternativo por si una actividad de hoy no sale como esperabas.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Escribe un plan» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-341 · Organización cotidiana: Haz tengas pendiente: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502341-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002341',
    'Organización cotidiana: Haz tengas pendiente',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Haz tengas pendiente», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Haz tengas pendiente"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Haz tengas pendiente"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-342 · Comer con flexibilidad: Comparte una comida: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502342-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002342',
    'Comer con flexibilidad: Comparte una comida',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Comparte una comida con alguien y propongan un tema agradable para conversar.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Comparte una comida» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-343 · Autonomía y límites: Escribe una discusión: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502343-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002343',
    'Autonomía y límites: Escribe una discusión',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Escribe una frase para defender una necesidad sin convertirla en una discusión.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Escribe una discusión» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-344 · Juego y disfrute: Elige sobre ella: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502344-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002344',
    'Juego y disfrute: Elige sobre ella',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Elige sobre ella","texto":"Elige una actividad que te hacía reír y comparte una anécdota sobre ella.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-345 · Bienestar digital: Guarda el teléfono: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502345-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002345',
    'Bienestar digital: Guarda el teléfono',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Guarda el teléfono», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Guarda el teléfono"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Guarda el teléfono"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-346 · Aire libre y comunidad: Elige el tiempo: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502346-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002346',
    'Aire libre y comunidad: Elige el tiempo',
    1,
    '{"modo":"pasos","intro":"Elige una actividad al aire libre que puedas compartir sin necesidad de conversar todo el tiempo.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Elige una actividad al aire libre que puedas compartir sin necesidad de conversar todo el tiempo."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Elige el tiempo» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-347 · Aprendizaje cotidiano: Busca parecía complicado: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502347-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002347',
    'Aprendizaje cotidiano: Busca parecía complicado',
    1,
    '{"invitacion":"Busca una forma accesible de aprender algo que antes te parecía complicado.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-348 · Cuidado diario: Haz de mañana: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502348-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002348',
    'Cuidado diario: Haz de mañana',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Haz de mañana","texto":"Haz una lista de tres cosas que te facilitarían el comienzo de mañana.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-349 · Movimiento amable: Haz el otro: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502349-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002349',
    'Movimiento amable: Haz el otro',
    1,
    '{"modo":"pasos","intro":"Haz una secuencia espejo: mueve un brazo y luego intenta repetirlo con el otro.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Haz una secuencia espejo: mueve un brazo y luego intenta repetirlo con el otro."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Haz el otro» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-350 · Descanso y ritmo: Escoge qué tarea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502350-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002350',
    'Descanso y ritmo: Escoge qué tarea',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Escoge qué tarea», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Escoge qué tarea"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Escoge qué tarea"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-351 · Vínculos: Aclara con respeto: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502351-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002351',
    'Vínculos: Aclara con respeto',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Aclara con respeto qué necesitas para sentirte cómodo en un plan compartido.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Aclara con respeto» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-352 · Creación: Escribe una pregunta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502352-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002352',
    'Creación: Escribe una pregunta',
    1,
    '{"invitacion":"Escribe una pregunta curiosa que te gustaría explorar sin buscar respuesta hoy.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-353 · Regulación emocional: Decide o energía: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502353-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002353',
    'Regulación emocional: Decide o energía',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide qué conversación puedes retomar cuando tengas más tiempo o energía.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Regulación emocional: Decide o energía» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-354 · Organización cotidiana: Deja a la: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502354-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002354',
    'Organización cotidiana: Deja a la',
    1,
    '{"modo":"lista","indicacion":"Para «Organización cotidiana: Deja a la», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Organización cotidiana: Deja a la"},{"clave":"adaptar","texto":"Adaptar: Organización cotidiana: Deja a la"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-355 · Comer con flexibilidad: Anota una idea: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502355-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002355',
    'Comer con flexibilidad: Anota una idea',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Anota una idea de comida que te gustaría preparar cuando tengas tiempo.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Comer con flexibilidad: Anota una idea» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-356 · Autonomía y límites: Decide qué favor: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502356-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002356',
    'Autonomía y límites: Decide qué favor',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Decide qué favor puedes ofrecer sin comprometer tu propio descanso.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Autonomía y límites: Decide qué favor» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-357 · Juego y disfrute: Inventa una tradición: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502357-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002357',
    'Juego y disfrute: Inventa una tradición',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Juego y disfrute: Inventa una tradición","texto":"Inventa una tradición pequeña para celebrar el final de la semana.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-358 · Bienestar digital: Revisa una carpeta: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502358-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002358',
    'Bienestar digital: Revisa una carpeta',
    1,
    '{"modo":"lista","indicacion":"Para «Bienestar digital: Revisa una carpeta», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Bienestar digital: Revisa una carpeta"},{"clave":"adaptar","texto":"Adaptar: Bienestar digital: Revisa una carpeta"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-359 · Aire libre y comunidad: Busca un lugar: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502359-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002359',
    'Aire libre y comunidad: Busca un lugar',
    1,
    '{"modo":"pasos","intro":"Busca un lugar cubierto desde donde puedas disfrutar el exterior si el clima cambia.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Busca un lugar cubierto desde donde puedas disfrutar el exterior si el clima cambia."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Aire libre y comunidad: Busca un lugar» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-360 · Aprendizaje cotidiano: Anota qué habilidad: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502360-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002360',
    'Aprendizaje cotidiano: Anota qué habilidad',
    1,
    '{"invitacion":"Anota qué habilidad te gustaría compartir con otra persona y cómo podrías enseñarla.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-361 · Cuidado diario: Elige cómo quieres: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502361-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002361',
    'Cuidado diario: Elige cómo quieres',
    1,
    '{"modo":"tarjeta","indicacion":"Sin respuestas buenas o malas. Tú eliges si probarlo.","titulo":"Cuidado diario: Elige cómo quieres","texto":"Elige cómo quieres cerrar una tarea antes de pasar a otra.","opciones":[{"clave":"ahora","texto":"Lo intentaré ahora"},{"clave":"despues","texto":"Quizá en otro momento"},{"clave":"hoy-no","texto":"Hoy no"}],"cierre":"Gracias por hacer una pausa a tu manera."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-362 · Movimiento amable: Elige un movimiento: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502362-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002362',
    'Movimiento amable: Elige un movimiento',
    1,
    '{"modo":"pasos","intro":"Elige un movimiento habitual y encuentra una versión más pequeña y cómoda.","avance":"manual","pasos":[{"titulo":"Empieza","texto":"Elige un movimiento habitual y encuentra una versión más pequeña y cómoda."},{"titulo":"Hazlo a tu manera","texto":"Elige un detalle de «Movimiento amable: Elige un movimiento» y pruébalo solo si te resulta cómodo."},{"titulo":"Cierra","texto":"Decide si quieres repetirlo, ajustarlo o dejarlo por hoy."}],"cierre":"Gracias por darte este momento.","avisoSiempre":"Puedes pasar un paso o parar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-363 · Descanso y ritmo: Cierra una pestaña: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502363-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002363',
    'Descanso y ritmo: Cierra una pestaña',
    1,
    '{"modo":"lista","indicacion":"Para «Descanso y ritmo: Cierra una pestaña», marca lo que te gustaría probar. También puedes no marcar nada.","items":[{"clave":"probar","texto":"Probar: Descanso y ritmo: Cierra una pestaña"},{"clave":"adaptar","texto":"Adaptar: Descanso y ritmo: Cierra una pestaña"},{"clave":"despues","texto":"Dejarlo para otro momento"}],"cierre":"La lista queda a tu manera, sin puntaje."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-364 · Vínculos: Despídete por compromiso: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502364-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002364',
    'Vínculos: Despídete por compromiso',
    1,
    '{"modo":"preguntas","indicacion":"Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.","preguntas":[{"clave":"momento","texto":"¿Cuándo te gustaría probarlo? Despídete de una conversación con una frase cálida y sin alargarla por compromiso.","tipo":"opcion","opciones":[{"clave":"inicio","texto":"Al empezar el día"},{"clave":"entre","texto":"Entre dos actividades"},{"clave":"cuando-pueda","texto":"Cuando me venga bien"}]},{"clave":"ajuste","texto":"¿Qué versión de «Vínculos: Despídete por compromiso» te resulta posible hoy?","tipo":"opcion","opciones":[{"clave":"igual","texto":"Tal como está"},{"clave":"pequeno","texto":"En una versión pequeña"},{"clave":"despues","texto":"Quizá otro día"}]}],"enlaceAlAviso":false,"conLineasDeAyuda":false,"cierre":"Tu plan puede cambiar cuando quieras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- BIE-365 · Creación: Crea un patrón: 1 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e502365-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000002365',
    'Creación: Crea un patrón',
    1,
    '{"invitacion":"Crea un patrón visual con tres formas y cambia el orden en cada línea.","campos":1,"minimo":1,"largoMaximo":240,"permiteNingunaHoy":true,"cierre":"Gracias por dejar esta idea en tus palabras."}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;
