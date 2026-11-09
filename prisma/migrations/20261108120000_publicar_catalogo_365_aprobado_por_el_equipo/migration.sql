-- Publicar el catalogo revisado (SCRUM-228, ADR 0030).
--
-- Revisiones de: Diego y Samuel (equipo VSD Health).
-- Publica 1861 sesion(es) de 1087 mecanica(s).
-- Solo datos. La aplica una persona; nada se publica a mano en el panel de Supabase.
-- Cada UPDATE nombra las sesiones una por una y exige `revision = pendiente`: aplicarla dos veces no hace
-- nada la segunda vez, y la base no deja publicar lo que pide revision y no la tiene.
-- COG-08 · Une los puntos en orden: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000108'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510108-0000-4000-8000-000000000001',
    '5e510108-0000-4000-8000-000000000002',
    '5e510108-0000-4000-8000-000000000003',
    '5e510108-0000-4000-8000-000000000004',
    '5e510108-0000-4000-8000-000000000005',
    '5e510108-0000-4000-8000-000000000006',
    '5e510108-0000-4000-8000-000000000007',
    '5e510108-0000-4000-8000-000000000008',
    '5e510108-0000-4000-8000-000000000009',
    '5e510108-0000-4000-8000-000000000010',
    '5e510108-0000-4000-8000-000000000011',
    '5e510108-0000-4000-8000-000000000012',
    '5e510108-0000-4000-8000-000000000013',
    '5e510108-0000-4000-8000-000000000014',
    '5e510108-0000-4000-8000-000000000015',
    '5e510108-0000-4000-8000-000000000016',
    '5e510108-0000-4000-8000-000000000017',
    '5e510108-0000-4000-8000-000000000018',
    '5e510108-0000-4000-8000-000000000019',
    '5e510108-0000-4000-8000-000000000020',
    '5e510108-0000-4000-8000-000000000021',
    '5e510108-0000-4000-8000-000000000022',
    '5e510108-0000-4000-8000-000000000023',
    '5e510108-0000-4000-8000-000000000024',
    '5e510108-0000-4000-8000-000000000025',
    '5e510108-0000-4000-8000-000000000026',
    '5e510108-0000-4000-8000-000000000027',
    '5e510108-0000-4000-8000-000000000028',
    '5e510108-0000-4000-8000-000000000029',
    '5e510108-0000-4000-8000-000000000030',
    '5e510108-0000-4000-8000-000000000031',
    '5e510108-0000-4000-8000-000000000032',
    '5e510108-0000-4000-8000-000000000033',
    '5e510108-0000-4000-8000-000000000034',
    '5e510108-0000-4000-8000-000000000035',
    '5e510108-0000-4000-8000-000000000036',
    '5e510108-0000-4000-8000-000000000037',
    '5e510108-0000-4000-8000-000000000038',
    '5e510108-0000-4000-8000-000000000039',
    '5e510108-0000-4000-8000-000000000040'
  );

-- COG-10 · El lugar de la figura: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000110'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510110-0000-4000-8000-000000000001',
    '5e510110-0000-4000-8000-000000000002',
    '5e510110-0000-4000-8000-000000000003',
    '5e510110-0000-4000-8000-000000000004',
    '5e510110-0000-4000-8000-000000000005',
    '5e510110-0000-4000-8000-000000000006',
    '5e510110-0000-4000-8000-000000000007',
    '5e510110-0000-4000-8000-000000000008',
    '5e510110-0000-4000-8000-000000000009',
    '5e510110-0000-4000-8000-000000000010',
    '5e510110-0000-4000-8000-000000000011',
    '5e510110-0000-4000-8000-000000000012',
    '5e510110-0000-4000-8000-000000000013',
    '5e510110-0000-4000-8000-000000000014',
    '5e510110-0000-4000-8000-000000000015',
    '5e510110-0000-4000-8000-000000000016',
    '5e510110-0000-4000-8000-000000000017',
    '5e510110-0000-4000-8000-000000000018',
    '5e510110-0000-4000-8000-000000000019',
    '5e510110-0000-4000-8000-000000000020',
    '5e510110-0000-4000-8000-000000000021',
    '5e510110-0000-4000-8000-000000000022',
    '5e510110-0000-4000-8000-000000000023',
    '5e510110-0000-4000-8000-000000000024',
    '5e510110-0000-4000-8000-000000000025',
    '5e510110-0000-4000-8000-000000000026',
    '5e510110-0000-4000-8000-000000000027',
    '5e510110-0000-4000-8000-000000000028',
    '5e510110-0000-4000-8000-000000000029',
    '5e510110-0000-4000-8000-000000000030',
    '5e510110-0000-4000-8000-000000000031',
    '5e510110-0000-4000-8000-000000000032',
    '5e510110-0000-4000-8000-000000000033',
    '5e510110-0000-4000-8000-000000000034',
    '5e510110-0000-4000-8000-000000000035',
    '5e510110-0000-4000-8000-000000000036',
    '5e510110-0000-4000-8000-000000000037',
    '5e510110-0000-4000-8000-000000000038',
    '5e510110-0000-4000-8000-000000000039',
    '5e510110-0000-4000-8000-000000000040'
  );

-- COG-11 · La conclusión que se sostiene: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000111'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510111-0000-4000-8000-000000000001',
    '5e510111-0000-4000-8000-000000000002',
    '5e510111-0000-4000-8000-000000000003',
    '5e510111-0000-4000-8000-000000000004',
    '5e510111-0000-4000-8000-000000000005',
    '5e510111-0000-4000-8000-000000000006',
    '5e510111-0000-4000-8000-000000000007',
    '5e510111-0000-4000-8000-000000000008',
    '5e510111-0000-4000-8000-000000000009',
    '5e510111-0000-4000-8000-000000000010',
    '5e510111-0000-4000-8000-000000000011',
    '5e510111-0000-4000-8000-000000000012',
    '5e510111-0000-4000-8000-000000000013',
    '5e510111-0000-4000-8000-000000000014',
    '5e510111-0000-4000-8000-000000000015',
    '5e510111-0000-4000-8000-000000000016',
    '5e510111-0000-4000-8000-000000000017',
    '5e510111-0000-4000-8000-000000000018',
    '5e510111-0000-4000-8000-000000000019',
    '5e510111-0000-4000-8000-000000000020',
    '5e510111-0000-4000-8000-000000000021',
    '5e510111-0000-4000-8000-000000000022',
    '5e510111-0000-4000-8000-000000000023',
    '5e510111-0000-4000-8000-000000000024',
    '5e510111-0000-4000-8000-000000000025',
    '5e510111-0000-4000-8000-000000000026',
    '5e510111-0000-4000-8000-000000000027',
    '5e510111-0000-4000-8000-000000000028',
    '5e510111-0000-4000-8000-000000000029',
    '5e510111-0000-4000-8000-000000000030',
    '5e510111-0000-4000-8000-000000000031',
    '5e510111-0000-4000-8000-000000000032',
    '5e510111-0000-4000-8000-000000000033',
    '5e510111-0000-4000-8000-000000000034',
    '5e510111-0000-4000-8000-000000000035',
    '5e510111-0000-4000-8000-000000000036',
    '5e510111-0000-4000-8000-000000000037',
    '5e510111-0000-4000-8000-000000000038',
    '5e510111-0000-4000-8000-000000000039',
    '5e510111-0000-4000-8000-000000000040'
  );

-- COG-12 · Reto 012 · Escena · Secuencia · Cálculo · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000112'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510112-0000-4000-8000-000000000001'
  );

-- COG-13 · Reto 013 · Palabras · Secuencia · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000113'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510113-0000-4000-8000-000000000001'
  );

-- COG-14 · Reto 014 · Recuerdo · Memoria · Categorías · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000114'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510114-0000-4000-8000-000000000001'
  );

-- COG-15 · Reto 015 · Intruso · Atención · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000115'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510115-0000-4000-8000-000000000001'
  );

-- COG-16 · Reto 016 · Secuencia · Atención · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000116'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510116-0000-4000-8000-000000000001'
  );

-- COG-17 · Reto 017 · Intruso · Palabras · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000117'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510117-0000-4000-8000-000000000001'
  );

-- COG-18 · Reto 018 · Memoria · Recuerdo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000118'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510118-0000-4000-8000-000000000001'
  );

-- COG-19 · Reto 019 · Atención · Cálculo · Recuerdo · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000119'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510119-0000-4000-8000-000000000001'
  );

-- COG-20 · Reto 020 · Atención · Recuerdo · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000120'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510120-0000-4000-8000-000000000001'
  );

-- COG-21 · Reto 021 · Intruso · Categorías · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000121'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510121-0000-4000-8000-000000000001'
  );

-- COG-22 · Reto 022 · Espacio · Memoria · Escena · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000122'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510122-0000-4000-8000-000000000001'
  );

-- COG-23 · Reto 023 · Palabras · Secuencia · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000123'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510123-0000-4000-8000-000000000001'
  );

-- COG-24 · Reto 024 · Atención · Secuencia · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000124'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510124-0000-4000-8000-000000000001'
  );

-- COG-25 · Reto 025 · Atención · Recuerdo · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000125'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510125-0000-4000-8000-000000000001'
  );

-- COG-26 · Reto 026 · Memoria · Inferencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000126'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510126-0000-4000-8000-000000000001'
  );

-- COG-27 · Reto 027 · Cálculo · Atención · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000127'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510127-0000-4000-8000-000000000001'
  );

-- COG-28 · Reto 028 · Secuencia · Espacio · Cálculo · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000128'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510128-0000-4000-8000-000000000001'
  );

-- COG-29 · Reto 029 · Escena · Memoria · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000129'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510129-0000-4000-8000-000000000001'
  );

-- COG-30 · Reto 030 · Memoria · Escena · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000130'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510130-0000-4000-8000-000000000001'
  );

-- COG-31 · Reto 031 · Categorías · Espacio · Intruso · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000131'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510131-0000-4000-8000-000000000001'
  );

-- COG-32 · Reto 032 · Memoria · Escena · Recuerdo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000132'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510132-0000-4000-8000-000000000001'
  );

-- COG-33 · Reto 033 · Atención · Cálculo · Memoria · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000133'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510133-0000-4000-8000-000000000001'
  );

-- COG-34 · Reto 034 · Secuencia · Cálculo · Categorías · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000134'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510134-0000-4000-8000-000000000001'
  );

-- COG-35 · Reto 035 · Atención · Categorías · Palabras · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000135'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510135-0000-4000-8000-000000000001'
  );

-- COG-36 · Reto 036 · Atención · Espacio · Escena · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000136'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510136-0000-4000-8000-000000000001'
  );

-- COG-37 · Reto 037 · Escena · Cálculo · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000137'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510137-0000-4000-8000-000000000001'
  );

-- COG-38 · Reto 038 · Secuencia · Atención · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000138'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510138-0000-4000-8000-000000000001'
  );

-- COG-39 · Reto 039 · Secuencia · Memoria · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000139'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510139-0000-4000-8000-000000000001'
  );

-- COG-40 · Reto 040 · Cálculo · Memoria · Categorías · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000140'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510140-0000-4000-8000-000000000001'
  );

-- COG-41 · Reto 041 · Secuencia · Espacio · Inferencia · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000141'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510141-0000-4000-8000-000000000001'
  );

-- COG-42 · Reto 042 · Espacio · Palabras · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000142'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510142-0000-4000-8000-000000000001'
  );

-- COG-43 · Reto 043 · Secuencia · Memoria · Espacio · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000143'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510143-0000-4000-8000-000000000001'
  );

-- COG-44 · Reto 044 · Cálculo · Escena · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000144'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510144-0000-4000-8000-000000000001'
  );

-- COG-45 · Reto 045 · Inferencia · Intruso · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000145'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510145-0000-4000-8000-000000000001'
  );

-- COG-46 · Reto 046 · Memoria · Escena · Categorías · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000146'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510146-0000-4000-8000-000000000001'
  );

-- COG-47 · Reto 047 · Intruso · Cálculo · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000147'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510147-0000-4000-8000-000000000001'
  );

-- COG-48 · Reto 048 · Atención · Intruso · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000148'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510148-0000-4000-8000-000000000001'
  );

-- COG-49 · Reto 049 · Cálculo · Atención · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000149'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510149-0000-4000-8000-000000000001'
  );

-- COG-50 · Reto 050 · Espacio · Atención · Cálculo · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000150'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510150-0000-4000-8000-000000000001'
  );

-- COG-51 · Reto 051 · Memoria · Inferencia · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000151'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510151-0000-4000-8000-000000000001'
  );

-- COG-52 · Reto 052 · Palabras · Secuencia · Escena · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000152'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510152-0000-4000-8000-000000000001'
  );

-- COG-53 · Reto 053 · Escena · Inferencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000153'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510153-0000-4000-8000-000000000001'
  );

-- COG-54 · Reto 054 · Inferencia · Espacio · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000154'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510154-0000-4000-8000-000000000001'
  );

-- COG-55 · Reto 055 · Recuerdo · Secuencia · Palabras · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000155'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510155-0000-4000-8000-000000000001'
  );

-- COG-56 · Reto 056 · Atención · Inferencia · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000156'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510156-0000-4000-8000-000000000001'
  );

-- COG-57 · Reto 057 · Recuerdo · Palabras · Secuencia · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000157'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510157-0000-4000-8000-000000000001'
  );

-- COG-58 · Reto 058 · Memoria · Cálculo · Palabras · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000158'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510158-0000-4000-8000-000000000001'
  );

-- COG-59 · Reto 059 · Escena · Intruso · Memoria · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000159'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510159-0000-4000-8000-000000000001'
  );

-- COG-60 · Reto 060 · Categorías · Espacio · Escena · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000160'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510160-0000-4000-8000-000000000001'
  );

-- COG-61 · Reto 061 · Intruso · Palabras · Secuencia · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000161'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510161-0000-4000-8000-000000000001'
  );

-- COG-62 · Reto 062 · Palabras · Memoria · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000162'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510162-0000-4000-8000-000000000001'
  );

-- COG-63 · Reto 063 · Palabras · Escena · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000163'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510163-0000-4000-8000-000000000001'
  );

-- COG-64 · Reto 064 · Intruso · Inferencia · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000164'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510164-0000-4000-8000-000000000001'
  );

-- COG-65 · Reto 065 · Inferencia · Cálculo · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000165'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510165-0000-4000-8000-000000000001'
  );

-- COG-66 · Reto 066 · Escena · Recuerdo · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000166'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510166-0000-4000-8000-000000000001'
  );

-- COG-67 · Reto 067 · Espacio · Memoria · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000167'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510167-0000-4000-8000-000000000001'
  );

-- COG-68 · Reto 068 · Espacio · Memoria · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000168'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510168-0000-4000-8000-000000000001'
  );

-- COG-69 · Reto 069 · Secuencia · Recuerdo · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000169'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510169-0000-4000-8000-000000000001'
  );

-- COG-70 · Reto 070 · Recuerdo · Intruso · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000170'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510170-0000-4000-8000-000000000001'
  );

-- COG-71 · Reto 071 · Atención · Inferencia · Intruso · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000171'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510171-0000-4000-8000-000000000001'
  );

-- COG-72 · Reto 072 · Cálculo · Memoria · Espacio · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000172'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510172-0000-4000-8000-000000000001'
  );

-- COG-73 · Reto 073 · Inferencia · Recuerdo · Categorías · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000173'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510173-0000-4000-8000-000000000001'
  );

-- COG-74 · Reto 074 · Recuerdo · Cálculo · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000174'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510174-0000-4000-8000-000000000001'
  );

-- COG-75 · Reto 075 · Recuerdo · Memoria · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000175'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510175-0000-4000-8000-000000000001'
  );

-- COG-76 · Reto 076 · Secuencia · Intruso · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000176'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510176-0000-4000-8000-000000000001'
  );

-- COG-77 · Reto 077 · Memoria · Espacio · Secuencia · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000177'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510177-0000-4000-8000-000000000001'
  );

-- COG-78 · Reto 078 · Categorías · Atención · Inferencia · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000178'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510178-0000-4000-8000-000000000001'
  );

-- COG-79 · Reto 079 · Categorías · Secuencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000179'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510179-0000-4000-8000-000000000001'
  );

-- COG-80 · Reto 080 · Intruso · Memoria · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000180'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510180-0000-4000-8000-000000000001'
  );

-- COG-81 · Reto 081 · Palabras · Espacio · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000181'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510181-0000-4000-8000-000000000001'
  );

-- COG-82 · Reto 082 · Categorías · Inferencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000182'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510182-0000-4000-8000-000000000001'
  );

-- COG-83 · Reto 083 · Atención · Memoria · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000183'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510183-0000-4000-8000-000000000001'
  );

-- COG-84 · Reto 084 · Palabras · Categorías · Memoria · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000184'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510184-0000-4000-8000-000000000001'
  );

-- COG-85 · Reto 085 · Cálculo · Espacio · Inferencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000185'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510185-0000-4000-8000-000000000001'
  );

-- COG-86 · Reto 086 · Espacio · Cálculo · Memoria · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000186'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510186-0000-4000-8000-000000000001'
  );

-- COG-87 · Reto 087 · Espacio · Secuencia · Intruso · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000187'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510187-0000-4000-8000-000000000001'
  );

-- COG-88 · Reto 088 · Espacio · Recuerdo · Categorías · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000188'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510188-0000-4000-8000-000000000001'
  );

-- COG-89 · Reto 089 · Secuencia · Categorías · Inferencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000189'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510189-0000-4000-8000-000000000001'
  );

-- COG-90 · Reto 090 · Escena · Categorías · Palabras · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000190'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510190-0000-4000-8000-000000000001'
  );

-- COG-91 · Reto 091 · Palabras · Secuencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000191'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510191-0000-4000-8000-000000000001'
  );

-- COG-92 · Reto 092 · Inferencia · Espacio · Memoria · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000192'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510192-0000-4000-8000-000000000001'
  );

-- COG-93 · Reto 093 · Recuerdo · Inferencia · Atención · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000193'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510193-0000-4000-8000-000000000001'
  );

-- COG-94 · Reto 094 · Atención · Espacio · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000194'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510194-0000-4000-8000-000000000001'
  );

-- COG-95 · Reto 095 · Intruso · Escena · Cálculo · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000195'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510195-0000-4000-8000-000000000001'
  );

-- COG-96 · Reto 096 · Atención · Escena · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000196'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510196-0000-4000-8000-000000000001'
  );

-- COG-97 · Reto 097 · Categorías · Atención · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000197'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510197-0000-4000-8000-000000000001'
  );

-- COG-98 · Reto 098 · Inferencia · Espacio · Categorías · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000198'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510198-0000-4000-8000-000000000001'
  );

-- COG-99 · Reto 099 · Atención · Intruso · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000199'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510199-0000-4000-8000-000000000001'
  );

-- COG-100 · Reto 100 · Intruso · Escena · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001100'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501100-0000-4000-8000-000000000001'
  );

-- COG-101 · Reto 101 · Inferencia · Secuencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001101'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501101-0000-4000-8000-000000000001'
  );

-- COG-102 · Reto 102 · Cálculo · Memoria · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001102'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501102-0000-4000-8000-000000000001'
  );

-- COG-103 · Reto 103 · Intruso · Secuencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001103'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501103-0000-4000-8000-000000000001'
  );

-- COG-104 · Reto 104 · Atención · Recuerdo · Cálculo · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001104'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501104-0000-4000-8000-000000000001'
  );

-- COG-105 · Reto 105 · Escena · Inferencia · Palabras · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001105'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501105-0000-4000-8000-000000000001'
  );

-- COG-106 · Reto 106 · Espacio · Inferencia · Memoria · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001106'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501106-0000-4000-8000-000000000001'
  );

-- COG-107 · Reto 107 · Escena · Secuencia · Palabras · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001107'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501107-0000-4000-8000-000000000001'
  );

-- COG-108 · Reto 108 · Secuencia · Espacio · Palabras · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001108'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501108-0000-4000-8000-000000000001'
  );

-- COG-109 · Reto 109 · Espacio · Categorías · Intruso · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001109'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501109-0000-4000-8000-000000000001'
  );

-- COG-110 · Reto 110 · Palabras · Recuerdo · Categorías · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001110'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501110-0000-4000-8000-000000000001'
  );

-- COG-111 · Reto 111 · Secuencia · Intruso · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001111'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501111-0000-4000-8000-000000000001'
  );

-- COG-112 · Reto 112 · Inferencia · Atención · Cálculo · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001112'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501112-0000-4000-8000-000000000001'
  );

-- COG-113 · Reto 113 · Palabras · Espacio · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001113'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501113-0000-4000-8000-000000000001'
  );

-- COG-114 · Reto 114 · Espacio · Cálculo · Secuencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001114'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501114-0000-4000-8000-000000000001'
  );

-- COG-115 · Reto 115 · Memoria · Cálculo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001115'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501115-0000-4000-8000-000000000001'
  );

-- COG-116 · Reto 116 · Recuerdo · Palabras · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001116'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501116-0000-4000-8000-000000000001'
  );

-- COG-117 · Reto 117 · Memoria · Secuencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001117'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501117-0000-4000-8000-000000000001'
  );

-- COG-118 · Reto 118 · Cálculo · Memoria · Inferencia · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001118'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501118-0000-4000-8000-000000000001'
  );

-- COG-119 · Reto 119 · Secuencia · Memoria · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001119'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501119-0000-4000-8000-000000000001'
  );

-- COG-120 · Reto 120 · Categorías · Inferencia · Escena · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001120'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501120-0000-4000-8000-000000000001'
  );

-- COG-121 · Reto 121 · Cálculo · Secuencia · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001121'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501121-0000-4000-8000-000000000001'
  );

-- COG-122 · Reto 122 · Palabras · Memoria · Intruso · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001122'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501122-0000-4000-8000-000000000001'
  );

-- COG-123 · Reto 123 · Cálculo · Memoria · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001123'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501123-0000-4000-8000-000000000001'
  );

-- COG-124 · Reto 124 · Memoria · Inferencia · Espacio · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001124'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501124-0000-4000-8000-000000000001'
  );

-- COG-125 · Reto 125 · Memoria · Intruso · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001125'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501125-0000-4000-8000-000000000001'
  );

-- COG-126 · Reto 126 · Secuencia · Palabras · Atención · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001126'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501126-0000-4000-8000-000000000001'
  );

-- COG-127 · Reto 127 · Inferencia · Escena · Memoria · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001127'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501127-0000-4000-8000-000000000001'
  );

-- COG-128 · Reto 128 · Escena · Memoria · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001128'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501128-0000-4000-8000-000000000001'
  );

-- COG-129 · Reto 129 · Inferencia · Escena · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001129'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501129-0000-4000-8000-000000000001'
  );

-- COG-130 · Reto 130 · Memoria · Escena · Atención · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001130'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501130-0000-4000-8000-000000000001'
  );

-- COG-131 · Reto 131 · Inferencia · Atención · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001131'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501131-0000-4000-8000-000000000001'
  );

-- COG-132 · Reto 132 · Escena · Cálculo · Categorías · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001132'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501132-0000-4000-8000-000000000001'
  );

-- COG-133 · Reto 133 · Cálculo · Recuerdo · Espacio · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001133'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501133-0000-4000-8000-000000000001'
  );

-- COG-134 · Reto 134 · Escena · Intruso · Cálculo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001134'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501134-0000-4000-8000-000000000001'
  );

-- COG-135 · Reto 135 · Intruso · Escena · Cálculo · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001135'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501135-0000-4000-8000-000000000001'
  );

-- COG-136 · Reto 136 · Escena · Categorías · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001136'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501136-0000-4000-8000-000000000001'
  );

-- COG-137 · Reto 137 · Memoria · Espacio · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001137'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501137-0000-4000-8000-000000000001'
  );

-- COG-138 · Reto 138 · Palabras · Espacio · Recuerdo · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001138'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501138-0000-4000-8000-000000000001'
  );

-- COG-139 · Reto 139 · Escena · Inferencia · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001139'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501139-0000-4000-8000-000000000001'
  );

-- COG-140 · Reto 140 · Recuerdo · Cálculo · Inferencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001140'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501140-0000-4000-8000-000000000001'
  );

-- COG-141 · Reto 141 · Categorías · Palabras · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001141'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501141-0000-4000-8000-000000000001'
  );

-- COG-142 · Reto 142 · Palabras · Inferencia · Escena · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001142'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501142-0000-4000-8000-000000000001'
  );

-- COG-143 · Reto 143 · Atención · Escena · Inferencia · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001143'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501143-0000-4000-8000-000000000001'
  );

-- COG-144 · Reto 144 · Secuencia · Memoria · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001144'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501144-0000-4000-8000-000000000001'
  );

-- COG-145 · Reto 145 · Cálculo · Palabras · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001145'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501145-0000-4000-8000-000000000001'
  );

-- COG-146 · Reto 146 · Categorías · Espacio · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001146'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501146-0000-4000-8000-000000000001'
  );

-- COG-147 · Reto 147 · Categorías · Atención · Memoria · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001147'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501147-0000-4000-8000-000000000001'
  );

-- COG-148 · Reto 148 · Categorías · Atención · Cálculo · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001148'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501148-0000-4000-8000-000000000001'
  );

-- COG-149 · Reto 149 · Categorías · Atención · Recuerdo · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001149'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501149-0000-4000-8000-000000000001'
  );

-- COG-150 · Reto 150 · Espacio · Memoria · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001150'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501150-0000-4000-8000-000000000001'
  );

-- COG-151 · Reto 151 · Atención · Secuencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001151'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501151-0000-4000-8000-000000000001'
  );

-- COG-152 · Reto 152 · Intruso · Espacio · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001152'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501152-0000-4000-8000-000000000001'
  );

-- COG-153 · Reto 153 · Cálculo · Inferencia · Categorías · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001153'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501153-0000-4000-8000-000000000001'
  );

-- COG-154 · Reto 154 · Espacio · Intruso · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001154'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501154-0000-4000-8000-000000000001'
  );

-- COG-155 · Reto 155 · Categorías · Cálculo · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001155'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501155-0000-4000-8000-000000000001'
  );

-- COG-156 · Reto 156 · Recuerdo · Espacio · Inferencia · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001156'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501156-0000-4000-8000-000000000001'
  );

-- COG-157 · Reto 157 · Categorías · Escena · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001157'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501157-0000-4000-8000-000000000001'
  );

-- COG-158 · Reto 158 · Intruso · Categorías · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001158'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501158-0000-4000-8000-000000000001'
  );

-- COG-159 · Reto 159 · Recuerdo · Espacio · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001159'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501159-0000-4000-8000-000000000001'
  );

-- COG-160 · Reto 160 · Memoria · Inferencia · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001160'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501160-0000-4000-8000-000000000001'
  );

-- COG-161 · Reto 161 · Inferencia · Palabras · Espacio · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001161'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501161-0000-4000-8000-000000000001'
  );

-- COG-162 · Reto 162 · Atención · Memoria · Espacio · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001162'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501162-0000-4000-8000-000000000001'
  );

-- COG-163 · Reto 163 · Inferencia · Atención · Recuerdo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001163'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501163-0000-4000-8000-000000000001'
  );

-- COG-164 · Reto 164 · Secuencia · Escena · Intruso · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001164'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501164-0000-4000-8000-000000000001'
  );

-- COG-165 · Reto 165 · Palabras · Categorías · Inferencia · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001165'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501165-0000-4000-8000-000000000001'
  );

-- COG-166 · Reto 166 · Intruso · Cálculo · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001166'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501166-0000-4000-8000-000000000001'
  );

-- COG-167 · Reto 167 · Memoria · Intruso · Espacio · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001167'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501167-0000-4000-8000-000000000001'
  );

-- COG-168 · Reto 168 · Palabras · Recuerdo · Categorías · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001168'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501168-0000-4000-8000-000000000001'
  );

-- COG-169 · Reto 169 · Inferencia · Recuerdo · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001169'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501169-0000-4000-8000-000000000001'
  );

-- COG-170 · Reto 170 · Cálculo · Secuencia · Atención · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001170'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501170-0000-4000-8000-000000000001'
  );

-- COG-171 · Reto 171 · Intruso · Espacio · Memoria · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001171'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501171-0000-4000-8000-000000000001'
  );

-- COG-172 · Reto 172 · Cálculo · Intruso · Escena · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001172'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501172-0000-4000-8000-000000000001'
  );

-- COG-173 · Reto 173 · Recuerdo · Categorías · Palabras · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001173'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501173-0000-4000-8000-000000000001'
  );

-- COG-174 · Reto 174 · Escena · Cálculo · Intruso · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001174'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501174-0000-4000-8000-000000000001'
  );

-- COG-175 · Reto 175 · Inferencia · Secuencia · Intruso · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001175'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501175-0000-4000-8000-000000000001'
  );

-- COG-176 · Reto 176 · Categorías · Secuencia · Intruso · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001176'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501176-0000-4000-8000-000000000001'
  );

-- COG-177 · Reto 177 · Espacio · Atención · Palabras · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001177'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501177-0000-4000-8000-000000000001'
  );

-- COG-178 · Reto 178 · Espacio · Inferencia · Categorías · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001178'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501178-0000-4000-8000-000000000001'
  );

-- COG-179 · Reto 179 · Atención · Palabras · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001179'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501179-0000-4000-8000-000000000001'
  );

-- COG-180 · Reto 180 · Espacio · Secuencia · Memoria · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001180'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501180-0000-4000-8000-000000000001'
  );

-- COG-181 · Reto 181 · Atención · Intruso · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001181'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501181-0000-4000-8000-000000000001'
  );

-- COG-182 · Reto 182 · Atención · Espacio · Inferencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001182'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501182-0000-4000-8000-000000000001'
  );

-- COG-183 · Reto 183 · Cálculo · Secuencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001183'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501183-0000-4000-8000-000000000001'
  );

-- COG-184 · Reto 184 · Palabras · Inferencia · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001184'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501184-0000-4000-8000-000000000001'
  );

-- COG-185 · Reto 185 · Espacio · Palabras · Recuerdo · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001185'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501185-0000-4000-8000-000000000001'
  );

-- COG-186 · Reto 186 · Palabras · Cálculo · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001186'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501186-0000-4000-8000-000000000001'
  );

-- COG-187 · Reto 187 · Recuerdo · Espacio · Inferencia · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001187'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501187-0000-4000-8000-000000000001'
  );

-- COG-188 · Reto 188 · Memoria · Secuencia · Palabras · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001188'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501188-0000-4000-8000-000000000001'
  );

-- COG-189 · Reto 189 · Categorías · Secuencia · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001189'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501189-0000-4000-8000-000000000001'
  );

-- COG-190 · Reto 190 · Atención · Espacio · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001190'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501190-0000-4000-8000-000000000001'
  );

-- COG-191 · Reto 191 · Intruso · Secuencia · Inferencia · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001191'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501191-0000-4000-8000-000000000001'
  );

-- COG-192 · Reto 192 · Inferencia · Espacio · Atención · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001192'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501192-0000-4000-8000-000000000001'
  );

-- COG-193 · Reto 193 · Recuerdo · Escena · Cálculo · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001193'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501193-0000-4000-8000-000000000001'
  );

-- COG-194 · Reto 194 · Atención · Intruso · Palabras · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001194'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501194-0000-4000-8000-000000000001'
  );

-- COG-195 · Reto 195 · Secuencia · Espacio · Atención · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001195'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501195-0000-4000-8000-000000000001'
  );

-- COG-196 · Reto 196 · Escena · Espacio · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001196'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501196-0000-4000-8000-000000000001'
  );

-- COG-197 · Reto 197 · Escena · Inferencia · Memoria · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001197'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501197-0000-4000-8000-000000000001'
  );

-- COG-198 · Reto 198 · Espacio · Secuencia · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001198'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501198-0000-4000-8000-000000000001'
  );

-- COG-199 · Reto 199 · Secuencia · Memoria · Palabras · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001199'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501199-0000-4000-8000-000000000001'
  );

-- COG-200 · Reto 200 · Categorías · Palabras · Atención · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001200'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501200-0000-4000-8000-000000000001'
  );

-- COG-201 · Reto 201 · Cálculo · Secuencia · Espacio · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001201'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501201-0000-4000-8000-000000000001'
  );

-- COG-202 · Reto 202 · Palabras · Secuencia · Recuerdo · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001202'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501202-0000-4000-8000-000000000001'
  );

-- COG-203 · Reto 203 · Intruso · Memoria · Inferencia · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001203'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501203-0000-4000-8000-000000000001'
  );

-- COG-204 · Reto 204 · Intruso · Secuencia · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001204'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501204-0000-4000-8000-000000000001'
  );

-- COG-205 · Reto 205 · Cálculo · Inferencia · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001205'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501205-0000-4000-8000-000000000001'
  );

-- COG-206 · Reto 206 · Intruso · Cálculo · Recuerdo · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001206'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501206-0000-4000-8000-000000000001'
  );

-- COG-207 · Reto 207 · Atención · Categorías · Espacio · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001207'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501207-0000-4000-8000-000000000001'
  );

-- COG-208 · Reto 208 · Palabras · Espacio · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001208'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501208-0000-4000-8000-000000000001'
  );

-- COG-209 · Reto 209 · Escena · Atención · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001209'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501209-0000-4000-8000-000000000001'
  );

-- COG-210 · Reto 210 · Palabras · Recuerdo · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001210'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501210-0000-4000-8000-000000000001'
  );

-- COG-211 · Reto 211 · Palabras · Atención · Espacio · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001211'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501211-0000-4000-8000-000000000001'
  );

-- COG-212 · Reto 212 · Atención · Recuerdo · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001212'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501212-0000-4000-8000-000000000001'
  );

-- COG-213 · Reto 213 · Recuerdo · Intruso · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001213'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501213-0000-4000-8000-000000000001'
  );

-- COG-214 · Reto 214 · Palabras · Inferencia · Espacio · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001214'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501214-0000-4000-8000-000000000001'
  );

-- COG-215 · Reto 215 · Secuencia · Memoria · Palabras · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001215'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501215-0000-4000-8000-000000000001'
  );

-- COG-216 · Reto 216 · Cálculo · Escena · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001216'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501216-0000-4000-8000-000000000001'
  );

-- COG-217 · Reto 217 · Inferencia · Atención · Secuencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001217'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501217-0000-4000-8000-000000000001'
  );

-- COG-218 · Reto 218 · Cálculo · Inferencia · Atención · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001218'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501218-0000-4000-8000-000000000001'
  );

-- COG-219 · Reto 219 · Inferencia · Espacio · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001219'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501219-0000-4000-8000-000000000001'
  );

-- COG-220 · Reto 220 · Palabras · Secuencia · Memoria · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001220'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501220-0000-4000-8000-000000000001'
  );

-- COG-221 · Reto 221 · Recuerdo · Secuencia · Atención · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001221'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501221-0000-4000-8000-000000000001'
  );

-- COG-222 · Reto 222 · Cálculo · Inferencia · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001222'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501222-0000-4000-8000-000000000001'
  );

-- COG-223 · Reto 223 · Atención · Recuerdo · Intruso · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001223'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501223-0000-4000-8000-000000000001'
  );

-- COG-224 · Reto 224 · Intruso · Atención · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001224'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501224-0000-4000-8000-000000000001'
  );

-- COG-225 · Reto 225 · Palabras · Atención · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001225'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501225-0000-4000-8000-000000000001'
  );

-- COG-226 · Reto 226 · Inferencia · Categorías · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001226'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501226-0000-4000-8000-000000000001'
  );

-- COG-227 · Reto 227 · Espacio · Palabras · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001227'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501227-0000-4000-8000-000000000001'
  );

-- COG-228 · Reto 228 · Atención · Secuencia · Cálculo · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001228'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501228-0000-4000-8000-000000000001'
  );

-- COG-229 · Reto 229 · Atención · Cálculo · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001229'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501229-0000-4000-8000-000000000001'
  );

-- COG-230 · Reto 230 · Categorías · Atención · Palabras · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001230'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501230-0000-4000-8000-000000000001'
  );

-- COG-231 · Reto 231 · Escena · Recuerdo · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001231'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501231-0000-4000-8000-000000000001'
  );

-- COG-232 · Reto 232 · Categorías · Secuencia · Espacio · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001232'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501232-0000-4000-8000-000000000001'
  );

-- COG-233 · Reto 233 · Palabras · Memoria · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001233'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501233-0000-4000-8000-000000000001'
  );

-- COG-234 · Reto 234 · Atención · Categorías · Escena · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001234'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501234-0000-4000-8000-000000000001'
  );

-- COG-235 · Reto 235 · Secuencia · Inferencia · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001235'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501235-0000-4000-8000-000000000001'
  );

-- COG-236 · Reto 236 · Intruso · Escena · Inferencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001236'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501236-0000-4000-8000-000000000001'
  );

-- COG-237 · Reto 237 · Categorías · Recuerdo · Secuencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001237'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501237-0000-4000-8000-000000000001'
  );

-- COG-238 · Reto 238 · Memoria · Atención · Espacio · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001238'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501238-0000-4000-8000-000000000001'
  );

-- COG-239 · Reto 239 · Atención · Memoria · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001239'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501239-0000-4000-8000-000000000001'
  );

-- COG-240 · Reto 240 · Atención · Intruso · Palabras · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001240'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501240-0000-4000-8000-000000000001'
  );

-- COG-241 · Reto 241 · Cálculo · Categorías · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001241'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501241-0000-4000-8000-000000000001'
  );

-- COG-242 · Reto 242 · Memoria · Palabras · Inferencia · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001242'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501242-0000-4000-8000-000000000001'
  );

-- COG-243 · Reto 243 · Inferencia · Categorías · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001243'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501243-0000-4000-8000-000000000001'
  );

-- COG-244 · Reto 244 · Atención · Categorías · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001244'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501244-0000-4000-8000-000000000001'
  );

-- COG-245 · Reto 245 · Secuencia · Memoria · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001245'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501245-0000-4000-8000-000000000001'
  );

-- COG-246 · Reto 246 · Recuerdo · Palabras · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001246'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501246-0000-4000-8000-000000000001'
  );

-- COG-247 · Reto 247 · Inferencia · Secuencia · Escena · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001247'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501247-0000-4000-8000-000000000001'
  );

-- COG-248 · Reto 248 · Atención · Intruso · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001248'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501248-0000-4000-8000-000000000001'
  );

-- COG-249 · Reto 249 · Intruso · Escena · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001249'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501249-0000-4000-8000-000000000001'
  );

-- COG-250 · Reto 250 · Escena · Espacio · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001250'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501250-0000-4000-8000-000000000001'
  );

-- COG-251 · Reto 251 · Cálculo · Secuencia · Atención · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001251'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501251-0000-4000-8000-000000000001'
  );

-- COG-252 · Reto 252 · Espacio · Secuencia · Intruso · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001252'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501252-0000-4000-8000-000000000001'
  );

-- COG-253 · Reto 253 · Intruso · Inferencia · Palabras · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001253'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501253-0000-4000-8000-000000000001'
  );

-- COG-254 · Reto 254 · Atención · Categorías · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001254'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501254-0000-4000-8000-000000000001'
  );

-- COG-255 · Reto 255 · Memoria · Intruso · Atención · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001255'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501255-0000-4000-8000-000000000001'
  );

-- COG-256 · Reto 256 · Espacio · Inferencia · Escena · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001256'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501256-0000-4000-8000-000000000001'
  );

-- COG-257 · Reto 257 · Atención · Categorías · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001257'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501257-0000-4000-8000-000000000001'
  );

-- COG-258 · Reto 258 · Intruso · Escena · Memoria · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001258'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501258-0000-4000-8000-000000000001'
  );

-- COG-259 · Reto 259 · Secuencia · Categorías · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001259'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501259-0000-4000-8000-000000000001'
  );

-- COG-260 · Reto 260 · Escena · Atención · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001260'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501260-0000-4000-8000-000000000001'
  );

-- COG-261 · Reto 261 · Categorías · Inferencia · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001261'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501261-0000-4000-8000-000000000001'
  );

-- COG-262 · Reto 262 · Espacio · Secuencia · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001262'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501262-0000-4000-8000-000000000001'
  );

-- COG-263 · Reto 263 · Espacio · Intruso · Palabras · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001263'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501263-0000-4000-8000-000000000001'
  );

-- COG-264 · Reto 264 · Secuencia · Espacio · Recuerdo · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001264'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501264-0000-4000-8000-000000000001'
  );

-- COG-265 · Reto 265 · Escena · Inferencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001265'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501265-0000-4000-8000-000000000001'
  );

-- COG-266 · Reto 266 · Memoria · Recuerdo · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001266'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501266-0000-4000-8000-000000000001'
  );

-- COG-267 · Reto 267 · Atención · Inferencia · Espacio · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001267'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501267-0000-4000-8000-000000000001'
  );

-- COG-268 · Reto 268 · Inferencia · Recuerdo · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001268'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501268-0000-4000-8000-000000000001'
  );

-- COG-269 · Reto 269 · Categorías · Espacio · Escena · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001269'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501269-0000-4000-8000-000000000001'
  );

-- COG-270 · Reto 270 · Cálculo · Inferencia · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001270'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501270-0000-4000-8000-000000000001'
  );

-- COG-271 · Reto 271 · Categorías · Memoria · Recuerdo · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001271'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501271-0000-4000-8000-000000000001'
  );

-- COG-272 · Reto 272 · Categorías · Escena · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001272'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501272-0000-4000-8000-000000000001'
  );

-- COG-273 · Reto 273 · Espacio · Atención · Memoria · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001273'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501273-0000-4000-8000-000000000001'
  );

-- COG-274 · Reto 274 · Atención · Intruso · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001274'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501274-0000-4000-8000-000000000001'
  );

-- COG-275 · Reto 275 · Intruso · Escena · Recuerdo · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001275'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501275-0000-4000-8000-000000000001'
  );

-- COG-276 · Reto 276 · Atención · Secuencia · Cálculo · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001276'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501276-0000-4000-8000-000000000001'
  );

-- COG-277 · Reto 277 · Recuerdo · Espacio · Escena · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001277'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501277-0000-4000-8000-000000000001'
  );

-- COG-278 · Reto 278 · Inferencia · Espacio · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001278'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501278-0000-4000-8000-000000000001'
  );

-- COG-279 · Reto 279 · Secuencia · Recuerdo · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001279'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501279-0000-4000-8000-000000000001'
  );

-- COG-280 · Reto 280 · Secuencia · Escena · Cálculo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001280'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501280-0000-4000-8000-000000000001'
  );

-- COG-281 · Reto 281 · Memoria · Inferencia · Atención · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001281'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501281-0000-4000-8000-000000000001'
  );

-- COG-282 · Reto 282 · Espacio · Atención · Recuerdo · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001282'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501282-0000-4000-8000-000000000001'
  );

-- COG-283 · Reto 283 · Espacio · Palabras · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001283'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501283-0000-4000-8000-000000000001'
  );

-- COG-284 · Reto 284 · Escena · Palabras · Inferencia · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001284'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501284-0000-4000-8000-000000000001'
  );

-- COG-285 · Reto 285 · Secuencia · Recuerdo · Categorías · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001285'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501285-0000-4000-8000-000000000001'
  );

-- COG-286 · Reto 286 · Cálculo · Categorías · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001286'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501286-0000-4000-8000-000000000001'
  );

-- COG-287 · Reto 287 · Secuencia · Inferencia · Recuerdo · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001287'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501287-0000-4000-8000-000000000001'
  );

-- COG-288 · Reto 288 · Inferencia · Intruso · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001288'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501288-0000-4000-8000-000000000001'
  );

-- COG-289 · Reto 289 · Secuencia · Espacio · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001289'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501289-0000-4000-8000-000000000001'
  );

-- COG-290 · Reto 290 · Cálculo · Recuerdo · Palabras · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001290'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501290-0000-4000-8000-000000000001'
  );

-- COG-291 · Reto 291 · Atención · Secuencia · Categorías · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001291'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501291-0000-4000-8000-000000000001'
  );

-- COG-292 · Reto 292 · Atención · Secuencia · Recuerdo · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001292'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501292-0000-4000-8000-000000000001'
  );

-- COG-293 · Reto 293 · Secuencia · Inferencia · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001293'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501293-0000-4000-8000-000000000001'
  );

-- COG-294 · Reto 294 · Atención · Espacio · Cálculo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001294'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501294-0000-4000-8000-000000000001'
  );

-- COG-295 · Reto 295 · Palabras · Intruso · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001295'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501295-0000-4000-8000-000000000001'
  );

-- COG-296 · Reto 296 · Palabras · Recuerdo · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001296'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501296-0000-4000-8000-000000000001'
  );

-- COG-297 · Reto 297 · Inferencia · Palabras · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001297'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501297-0000-4000-8000-000000000001'
  );

-- COG-298 · Reto 298 · Atención · Cálculo · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001298'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501298-0000-4000-8000-000000000001'
  );

-- COG-299 · Reto 299 · Espacio · Categorías · Escena · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001299'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501299-0000-4000-8000-000000000001'
  );

-- COG-300 · Reto 300 · Secuencia · Categorías · Atención · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001300'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501300-0000-4000-8000-000000000001'
  );

-- COG-301 · Reto 301 · Intruso · Espacio · Inferencia · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001301'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501301-0000-4000-8000-000000000001'
  );

-- COG-302 · Reto 302 · Escena · Recuerdo · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001302'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501302-0000-4000-8000-000000000001'
  );

-- COG-303 · Reto 303 · Palabras · Atención · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001303'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501303-0000-4000-8000-000000000001'
  );

-- COG-304 · Reto 304 · Memoria · Categorías · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001304'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501304-0000-4000-8000-000000000001'
  );

-- COG-305 · Reto 305 · Categorías · Inferencia · Espacio · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001305'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501305-0000-4000-8000-000000000001'
  );

-- COG-306 · Reto 306 · Memoria · Palabras · Recuerdo · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001306'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501306-0000-4000-8000-000000000001'
  );

-- COG-307 · Reto 307 · Inferencia · Secuencia · Cálculo · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001307'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501307-0000-4000-8000-000000000001'
  );

-- COG-308 · Reto 308 · Atención · Espacio · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001308'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501308-0000-4000-8000-000000000001'
  );

-- COG-309 · Reto 309 · Escena · Recuerdo · Secuencia · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001309'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501309-0000-4000-8000-000000000001'
  );

-- COG-310 · Reto 310 · Escena · Memoria · Recuerdo · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001310'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501310-0000-4000-8000-000000000001'
  );

-- COG-311 · Reto 311 · Atención · Categorías · Intruso · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001311'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501311-0000-4000-8000-000000000001'
  );

-- COG-312 · Reto 312 · Intruso · Palabras · Inferencia · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001312'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501312-0000-4000-8000-000000000001'
  );

-- COG-313 · Reto 313 · Secuencia · Palabras · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001313'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501313-0000-4000-8000-000000000001'
  );

-- COG-314 · Reto 314 · Recuerdo · Palabras · Espacio · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001314'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501314-0000-4000-8000-000000000001'
  );

-- COG-315 · Reto 315 · Cálculo · Categorías · Memoria · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001315'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501315-0000-4000-8000-000000000001'
  );

-- COG-316 · Reto 316 · Recuerdo · Palabras · Cálculo · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001316'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501316-0000-4000-8000-000000000001'
  );

-- COG-317 · Reto 317 · Escena · Cálculo · Inferencia · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001317'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501317-0000-4000-8000-000000000001'
  );

-- COG-318 · Reto 318 · Palabras · Recuerdo · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001318'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501318-0000-4000-8000-000000000001'
  );

-- COG-319 · Reto 319 · Palabras · Cálculo · Atención · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001319'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501319-0000-4000-8000-000000000001'
  );

-- COG-320 · Reto 320 · Secuencia · Cálculo · Categorías · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001320'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501320-0000-4000-8000-000000000001'
  );

-- COG-321 · Reto 321 · Cálculo · Categorías · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001321'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501321-0000-4000-8000-000000000001'
  );

-- COG-322 · Reto 322 · Cálculo · Intruso · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001322'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501322-0000-4000-8000-000000000001'
  );

-- COG-323 · Reto 323 · Memoria · Secuencia · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001323'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501323-0000-4000-8000-000000000001'
  );

-- COG-324 · Reto 324 · Categorías · Palabras · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001324'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501324-0000-4000-8000-000000000001'
  );

-- COG-325 · Reto 325 · Intruso · Memoria · Palabras · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001325'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501325-0000-4000-8000-000000000001'
  );

-- COG-326 · Reto 326 · Cálculo · Secuencia · Atención · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001326'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501326-0000-4000-8000-000000000001'
  );

-- COG-327 · Reto 327 · Inferencia · Categorías · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001327'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501327-0000-4000-8000-000000000001'
  );

-- COG-328 · Reto 328 · Categorías · Secuencia · Inferencia · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001328'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501328-0000-4000-8000-000000000001'
  );

-- COG-329 · Reto 329 · Cálculo · Memoria · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001329'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501329-0000-4000-8000-000000000001'
  );

-- COG-330 · Reto 330 · Intruso · Espacio · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001330'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501330-0000-4000-8000-000000000001'
  );

-- COG-331 · Reto 331 · Atención · Inferencia · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001331'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501331-0000-4000-8000-000000000001'
  );

-- COG-332 · Reto 332 · Memoria · Espacio · Intruso · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001332'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501332-0000-4000-8000-000000000001'
  );

-- COG-333 · Reto 333 · Cálculo · Escena · Inferencia · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001333'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501333-0000-4000-8000-000000000001'
  );

-- COG-334 · Reto 334 · Intruso · Palabras · Escena · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001334'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501334-0000-4000-8000-000000000001'
  );

-- COG-335 · Reto 335 · Espacio · Categorías · Atención · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001335'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501335-0000-4000-8000-000000000001'
  );

-- COG-336 · Reto 336 · Escena · Inferencia · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001336'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501336-0000-4000-8000-000000000001'
  );

-- COG-337 · Reto 337 · Recuerdo · Intruso · Memoria · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001337'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501337-0000-4000-8000-000000000001'
  );

-- COG-338 · Reto 338 · Intruso · Secuencia · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001338'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501338-0000-4000-8000-000000000001'
  );

-- COG-339 · Reto 339 · Categorías · Cálculo · Memoria · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001339'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501339-0000-4000-8000-000000000001'
  );

-- COG-340 · Reto 340 · Intruso · Memoria · Categorías · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001340'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501340-0000-4000-8000-000000000001'
  );

-- COG-341 · Reto 341 · Intruso · Espacio · Palabras · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001341'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501341-0000-4000-8000-000000000001'
  );

-- COG-342 · Reto 342 · Espacio · Cálculo · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001342'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501342-0000-4000-8000-000000000001'
  );

-- COG-343 · Reto 343 · Inferencia · Palabras · Categorías · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001343'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501343-0000-4000-8000-000000000001'
  );

-- COG-344 · Reto 344 · Atención · Escena · Recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001344'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501344-0000-4000-8000-000000000001'
  );

-- COG-345 · Reto 345 · Intruso · Recuerdo · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001345'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501345-0000-4000-8000-000000000001'
  );

-- COG-346 · Reto 346 · Intruso · Recuerdo · Atención · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001346'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501346-0000-4000-8000-000000000001'
  );

-- COG-347 · Reto 347 · Secuencia · Espacio · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001347'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501347-0000-4000-8000-000000000001'
  );

-- COG-348 · Reto 348 · Recuerdo · Atención · Intruso · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001348'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501348-0000-4000-8000-000000000001'
  );

-- COG-349 · Reto 349 · Secuencia · Palabras · Categorías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001349'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501349-0000-4000-8000-000000000001'
  );

-- COG-350 · Reto 350 · Inferencia · Categorías · Espacio · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001350'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501350-0000-4000-8000-000000000001'
  );

-- COG-351 · Reto 351 · Memoria · Espacio · Escena · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001351'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501351-0000-4000-8000-000000000001'
  );

-- COG-352 · Reto 352 · Atención · Recuerdo · Escena · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001352'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501352-0000-4000-8000-000000000001'
  );

-- COG-353 · Reto 353 · Espacio · Categorías · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001353'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501353-0000-4000-8000-000000000001'
  );

-- COG-354 · Reto 354 · Palabras · Inferencia · Recuerdo · Escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001354'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501354-0000-4000-8000-000000000001'
  );

-- COG-355 · Reto 355 · Categorías · Espacio · Intruso · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001355'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501355-0000-4000-8000-000000000001'
  );

-- COG-356 · Reto 356 · Categorías · Intruso · Secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001356'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501356-0000-4000-8000-000000000001'
  );

-- COG-357 · Reto 357 · Cálculo · Escena · Palabras · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001357'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501357-0000-4000-8000-000000000001'
  );

-- COG-358 · Reto 358 · Intruso · Categorías · Inferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001358'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501358-0000-4000-8000-000000000001'
  );

-- COG-359 · Reto 359 · Memoria · Atención · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001359'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501359-0000-4000-8000-000000000001'
  );

-- COG-360 · Reto 360 · Categorías · Cálculo · Palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001360'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501360-0000-4000-8000-000000000001'
  );

-- COG-361 · Reto 361 · Espacio · Palabras · Memoria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001361'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501361-0000-4000-8000-000000000001'
  );

-- COG-362 · Reto 362 · Inferencia · Cálculo · Intruso · Espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001362'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501362-0000-4000-8000-000000000001'
  );

-- COG-363 · Reto 363 · Memoria · Palabras · Intruso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001363'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501363-0000-4000-8000-000000000001'
  );

-- COG-364 · Reto 364 · Escena · Recuerdo · Cálculo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001364'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501364-0000-4000-8000-000000000001'
  );

-- COG-365 · Reto 365 · Escena · Memoria · Atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000001365'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e501365-0000-4000-8000-000000000001'
  );

-- BIE-01 · Respiración guiada: 37 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-00000000000b'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510201-0000-4000-8000-000000000004',
    '5e510201-0000-4000-8000-000000000005',
    '5e510201-0000-4000-8000-000000000006',
    '5e510201-0000-4000-8000-000000000007',
    '5e510201-0000-4000-8000-000000000008',
    '5e510201-0000-4000-8000-000000000009',
    '5e510201-0000-4000-8000-000000000010',
    '5e510201-0000-4000-8000-000000000011',
    '5e510201-0000-4000-8000-000000000012',
    '5e510201-0000-4000-8000-000000000013',
    '5e510201-0000-4000-8000-000000000014',
    '5e510201-0000-4000-8000-000000000015',
    '5e510201-0000-4000-8000-000000000016',
    '5e510201-0000-4000-8000-000000000017',
    '5e510201-0000-4000-8000-000000000018',
    '5e510201-0000-4000-8000-000000000019',
    '5e510201-0000-4000-8000-000000000020',
    '5e510201-0000-4000-8000-000000000021',
    '5e510201-0000-4000-8000-000000000022',
    '5e510201-0000-4000-8000-000000000023',
    '5e510201-0000-4000-8000-000000000024',
    '5e510201-0000-4000-8000-000000000025',
    '5e510201-0000-4000-8000-000000000026',
    '5e510201-0000-4000-8000-000000000027',
    '5e510201-0000-4000-8000-000000000028',
    '5e510201-0000-4000-8000-000000000029',
    '5e510201-0000-4000-8000-000000000030',
    '5e510201-0000-4000-8000-000000000031',
    '5e510201-0000-4000-8000-000000000032',
    '5e510201-0000-4000-8000-000000000033',
    '5e510201-0000-4000-8000-000000000034',
    '5e510201-0000-4000-8000-000000000035',
    '5e510201-0000-4000-8000-000000000036',
    '5e510201-0000-4000-8000-000000000037',
    '5e510201-0000-4000-8000-000000000038',
    '5e510201-0000-4000-8000-000000000039',
    '5e510201-0000-4000-8000-000000000040'
  );

-- BIE-02 · Pausa de estiramiento: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000202'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510202-0000-4000-8000-000000000001',
    '5e510202-0000-4000-8000-000000000002',
    '5e510202-0000-4000-8000-000000000003',
    '5e510202-0000-4000-8000-000000000004',
    '5e510202-0000-4000-8000-000000000005',
    '5e510202-0000-4000-8000-000000000006',
    '5e510202-0000-4000-8000-000000000007',
    '5e510202-0000-4000-8000-000000000008',
    '5e510202-0000-4000-8000-000000000009',
    '5e510202-0000-4000-8000-000000000010',
    '5e510202-0000-4000-8000-000000000011',
    '5e510202-0000-4000-8000-000000000012',
    '5e510202-0000-4000-8000-000000000013',
    '5e510202-0000-4000-8000-000000000014',
    '5e510202-0000-4000-8000-000000000015',
    '5e510202-0000-4000-8000-000000000016',
    '5e510202-0000-4000-8000-000000000017',
    '5e510202-0000-4000-8000-000000000018',
    '5e510202-0000-4000-8000-000000000019',
    '5e510202-0000-4000-8000-000000000020',
    '5e510202-0000-4000-8000-000000000021',
    '5e510202-0000-4000-8000-000000000022',
    '5e510202-0000-4000-8000-000000000023',
    '5e510202-0000-4000-8000-000000000024',
    '5e510202-0000-4000-8000-000000000025',
    '5e510202-0000-4000-8000-000000000026',
    '5e510202-0000-4000-8000-000000000027',
    '5e510202-0000-4000-8000-000000000028',
    '5e510202-0000-4000-8000-000000000029',
    '5e510202-0000-4000-8000-000000000030',
    '5e510202-0000-4000-8000-000000000031',
    '5e510202-0000-4000-8000-000000000032',
    '5e510202-0000-4000-8000-000000000033',
    '5e510202-0000-4000-8000-000000000034',
    '5e510202-0000-4000-8000-000000000035',
    '5e510202-0000-4000-8000-000000000036',
    '5e510202-0000-4000-8000-000000000037',
    '5e510202-0000-4000-8000-000000000038',
    '5e510202-0000-4000-8000-000000000039',
    '5e510202-0000-4000-8000-000000000040'
  );

-- BIE-03 · El hábito de sueño de hoy: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000203'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510203-0000-4000-8000-000000000001',
    '5e510203-0000-4000-8000-000000000002',
    '5e510203-0000-4000-8000-000000000003',
    '5e510203-0000-4000-8000-000000000004',
    '5e510203-0000-4000-8000-000000000005',
    '5e510203-0000-4000-8000-000000000006',
    '5e510203-0000-4000-8000-000000000007',
    '5e510203-0000-4000-8000-000000000008',
    '5e510203-0000-4000-8000-000000000009',
    '5e510203-0000-4000-8000-000000000010',
    '5e510203-0000-4000-8000-000000000011',
    '5e510203-0000-4000-8000-000000000012',
    '5e510203-0000-4000-8000-000000000013',
    '5e510203-0000-4000-8000-000000000014',
    '5e510203-0000-4000-8000-000000000015',
    '5e510203-0000-4000-8000-000000000016',
    '5e510203-0000-4000-8000-000000000017',
    '5e510203-0000-4000-8000-000000000018',
    '5e510203-0000-4000-8000-000000000019',
    '5e510203-0000-4000-8000-000000000020',
    '5e510203-0000-4000-8000-000000000021',
    '5e510203-0000-4000-8000-000000000022',
    '5e510203-0000-4000-8000-000000000023',
    '5e510203-0000-4000-8000-000000000024',
    '5e510203-0000-4000-8000-000000000025',
    '5e510203-0000-4000-8000-000000000026',
    '5e510203-0000-4000-8000-000000000027',
    '5e510203-0000-4000-8000-000000000028',
    '5e510203-0000-4000-8000-000000000029',
    '5e510203-0000-4000-8000-000000000030',
    '5e510203-0000-4000-8000-000000000031',
    '5e510203-0000-4000-8000-000000000032',
    '5e510203-0000-4000-8000-000000000033',
    '5e510203-0000-4000-8000-000000000034',
    '5e510203-0000-4000-8000-000000000035',
    '5e510203-0000-4000-8000-000000000036',
    '5e510203-0000-4000-8000-000000000037',
    '5e510203-0000-4000-8000-000000000038',
    '5e510203-0000-4000-8000-000000000039',
    '5e510203-0000-4000-8000-000000000040'
  );

-- BIE-04 · Un cuidado pequeño de hoy: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000204'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510204-0000-4000-8000-000000000001',
    '5e510204-0000-4000-8000-000000000002',
    '5e510204-0000-4000-8000-000000000003',
    '5e510204-0000-4000-8000-000000000004',
    '5e510204-0000-4000-8000-000000000005',
    '5e510204-0000-4000-8000-000000000006',
    '5e510204-0000-4000-8000-000000000007',
    '5e510204-0000-4000-8000-000000000008',
    '5e510204-0000-4000-8000-000000000009',
    '5e510204-0000-4000-8000-000000000010',
    '5e510204-0000-4000-8000-000000000011',
    '5e510204-0000-4000-8000-000000000012',
    '5e510204-0000-4000-8000-000000000013',
    '5e510204-0000-4000-8000-000000000014',
    '5e510204-0000-4000-8000-000000000015',
    '5e510204-0000-4000-8000-000000000016',
    '5e510204-0000-4000-8000-000000000017',
    '5e510204-0000-4000-8000-000000000018',
    '5e510204-0000-4000-8000-000000000019',
    '5e510204-0000-4000-8000-000000000020',
    '5e510204-0000-4000-8000-000000000021',
    '5e510204-0000-4000-8000-000000000022',
    '5e510204-0000-4000-8000-000000000023',
    '5e510204-0000-4000-8000-000000000024',
    '5e510204-0000-4000-8000-000000000025',
    '5e510204-0000-4000-8000-000000000026',
    '5e510204-0000-4000-8000-000000000027',
    '5e510204-0000-4000-8000-000000000028',
    '5e510204-0000-4000-8000-000000000029',
    '5e510204-0000-4000-8000-000000000030',
    '5e510204-0000-4000-8000-000000000031',
    '5e510204-0000-4000-8000-000000000032',
    '5e510204-0000-4000-8000-000000000033',
    '5e510204-0000-4000-8000-000000000034',
    '5e510204-0000-4000-8000-000000000035',
    '5e510204-0000-4000-8000-000000000036',
    '5e510204-0000-4000-8000-000000000037',
    '5e510204-0000-4000-8000-000000000038',
    '5e510204-0000-4000-8000-000000000039',
    '5e510204-0000-4000-8000-000000000040'
  );

-- BIE-05 · La caminata del día: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000205'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510205-0000-4000-8000-000000000001',
    '5e510205-0000-4000-8000-000000000002',
    '5e510205-0000-4000-8000-000000000003',
    '5e510205-0000-4000-8000-000000000004',
    '5e510205-0000-4000-8000-000000000005',
    '5e510205-0000-4000-8000-000000000006',
    '5e510205-0000-4000-8000-000000000007',
    '5e510205-0000-4000-8000-000000000008',
    '5e510205-0000-4000-8000-000000000009',
    '5e510205-0000-4000-8000-000000000010',
    '5e510205-0000-4000-8000-000000000011',
    '5e510205-0000-4000-8000-000000000012',
    '5e510205-0000-4000-8000-000000000013',
    '5e510205-0000-4000-8000-000000000014',
    '5e510205-0000-4000-8000-000000000015',
    '5e510205-0000-4000-8000-000000000016',
    '5e510205-0000-4000-8000-000000000017',
    '5e510205-0000-4000-8000-000000000018',
    '5e510205-0000-4000-8000-000000000019',
    '5e510205-0000-4000-8000-000000000020',
    '5e510205-0000-4000-8000-000000000021',
    '5e510205-0000-4000-8000-000000000022',
    '5e510205-0000-4000-8000-000000000023',
    '5e510205-0000-4000-8000-000000000024',
    '5e510205-0000-4000-8000-000000000025',
    '5e510205-0000-4000-8000-000000000026',
    '5e510205-0000-4000-8000-000000000027',
    '5e510205-0000-4000-8000-000000000028',
    '5e510205-0000-4000-8000-000000000029',
    '5e510205-0000-4000-8000-000000000030',
    '5e510205-0000-4000-8000-000000000031',
    '5e510205-0000-4000-8000-000000000032',
    '5e510205-0000-4000-8000-000000000033',
    '5e510205-0000-4000-8000-000000000034',
    '5e510205-0000-4000-8000-000000000035',
    '5e510205-0000-4000-8000-000000000036',
    '5e510205-0000-4000-8000-000000000037',
    '5e510205-0000-4000-8000-000000000038',
    '5e510205-0000-4000-8000-000000000039',
    '5e510205-0000-4000-8000-000000000040'
  );

-- BIE-06 · Escaneo corporal: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000206'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510206-0000-4000-8000-000000000001',
    '5e510206-0000-4000-8000-000000000002',
    '5e510206-0000-4000-8000-000000000003',
    '5e510206-0000-4000-8000-000000000004',
    '5e510206-0000-4000-8000-000000000005',
    '5e510206-0000-4000-8000-000000000006',
    '5e510206-0000-4000-8000-000000000007',
    '5e510206-0000-4000-8000-000000000008',
    '5e510206-0000-4000-8000-000000000009',
    '5e510206-0000-4000-8000-000000000010',
    '5e510206-0000-4000-8000-000000000011',
    '5e510206-0000-4000-8000-000000000012',
    '5e510206-0000-4000-8000-000000000013',
    '5e510206-0000-4000-8000-000000000014',
    '5e510206-0000-4000-8000-000000000015',
    '5e510206-0000-4000-8000-000000000016',
    '5e510206-0000-4000-8000-000000000017',
    '5e510206-0000-4000-8000-000000000018',
    '5e510206-0000-4000-8000-000000000019',
    '5e510206-0000-4000-8000-000000000020',
    '5e510206-0000-4000-8000-000000000021',
    '5e510206-0000-4000-8000-000000000022',
    '5e510206-0000-4000-8000-000000000023',
    '5e510206-0000-4000-8000-000000000024',
    '5e510206-0000-4000-8000-000000000025',
    '5e510206-0000-4000-8000-000000000026',
    '5e510206-0000-4000-8000-000000000027',
    '5e510206-0000-4000-8000-000000000028',
    '5e510206-0000-4000-8000-000000000029',
    '5e510206-0000-4000-8000-000000000030',
    '5e510206-0000-4000-8000-000000000031',
    '5e510206-0000-4000-8000-000000000032',
    '5e510206-0000-4000-8000-000000000033',
    '5e510206-0000-4000-8000-000000000034',
    '5e510206-0000-4000-8000-000000000035',
    '5e510206-0000-4000-8000-000000000036',
    '5e510206-0000-4000-8000-000000000037',
    '5e510206-0000-4000-8000-000000000038',
    '5e510206-0000-4000-8000-000000000039',
    '5e510206-0000-4000-8000-000000000040'
  );

-- BIE-07 · Antes de dormir: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000207'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510207-0000-4000-8000-000000000001',
    '5e510207-0000-4000-8000-000000000002',
    '5e510207-0000-4000-8000-000000000003',
    '5e510207-0000-4000-8000-000000000004',
    '5e510207-0000-4000-8000-000000000005',
    '5e510207-0000-4000-8000-000000000006',
    '5e510207-0000-4000-8000-000000000007',
    '5e510207-0000-4000-8000-000000000008',
    '5e510207-0000-4000-8000-000000000009',
    '5e510207-0000-4000-8000-000000000010',
    '5e510207-0000-4000-8000-000000000011',
    '5e510207-0000-4000-8000-000000000012',
    '5e510207-0000-4000-8000-000000000013',
    '5e510207-0000-4000-8000-000000000014',
    '5e510207-0000-4000-8000-000000000015',
    '5e510207-0000-4000-8000-000000000016',
    '5e510207-0000-4000-8000-000000000017',
    '5e510207-0000-4000-8000-000000000018',
    '5e510207-0000-4000-8000-000000000019',
    '5e510207-0000-4000-8000-000000000020',
    '5e510207-0000-4000-8000-000000000021',
    '5e510207-0000-4000-8000-000000000022',
    '5e510207-0000-4000-8000-000000000023',
    '5e510207-0000-4000-8000-000000000024',
    '5e510207-0000-4000-8000-000000000025',
    '5e510207-0000-4000-8000-000000000026',
    '5e510207-0000-4000-8000-000000000027',
    '5e510207-0000-4000-8000-000000000028',
    '5e510207-0000-4000-8000-000000000029',
    '5e510207-0000-4000-8000-000000000030',
    '5e510207-0000-4000-8000-000000000031',
    '5e510207-0000-4000-8000-000000000032',
    '5e510207-0000-4000-8000-000000000033',
    '5e510207-0000-4000-8000-000000000034',
    '5e510207-0000-4000-8000-000000000035',
    '5e510207-0000-4000-8000-000000000036',
    '5e510207-0000-4000-8000-000000000037',
    '5e510207-0000-4000-8000-000000000038',
    '5e510207-0000-4000-8000-000000000039',
    '5e510207-0000-4000-8000-000000000040'
  );

-- BIE-08 · El descanso de mañana: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000208'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510208-0000-4000-8000-000000000001',
    '5e510208-0000-4000-8000-000000000002',
    '5e510208-0000-4000-8000-000000000003',
    '5e510208-0000-4000-8000-000000000004',
    '5e510208-0000-4000-8000-000000000005',
    '5e510208-0000-4000-8000-000000000006',
    '5e510208-0000-4000-8000-000000000007',
    '5e510208-0000-4000-8000-000000000008',
    '5e510208-0000-4000-8000-000000000009',
    '5e510208-0000-4000-8000-000000000010',
    '5e510208-0000-4000-8000-000000000011',
    '5e510208-0000-4000-8000-000000000012',
    '5e510208-0000-4000-8000-000000000013',
    '5e510208-0000-4000-8000-000000000014',
    '5e510208-0000-4000-8000-000000000015',
    '5e510208-0000-4000-8000-000000000016',
    '5e510208-0000-4000-8000-000000000017',
    '5e510208-0000-4000-8000-000000000018',
    '5e510208-0000-4000-8000-000000000019',
    '5e510208-0000-4000-8000-000000000020',
    '5e510208-0000-4000-8000-000000000021',
    '5e510208-0000-4000-8000-000000000022',
    '5e510208-0000-4000-8000-000000000023',
    '5e510208-0000-4000-8000-000000000024',
    '5e510208-0000-4000-8000-000000000025',
    '5e510208-0000-4000-8000-000000000026',
    '5e510208-0000-4000-8000-000000000027',
    '5e510208-0000-4000-8000-000000000028',
    '5e510208-0000-4000-8000-000000000029',
    '5e510208-0000-4000-8000-000000000030',
    '5e510208-0000-4000-8000-000000000031',
    '5e510208-0000-4000-8000-000000000032',
    '5e510208-0000-4000-8000-000000000033',
    '5e510208-0000-4000-8000-000000000034',
    '5e510208-0000-4000-8000-000000000035',
    '5e510208-0000-4000-8000-000000000036',
    '5e510208-0000-4000-8000-000000000037',
    '5e510208-0000-4000-8000-000000000038',
    '5e510208-0000-4000-8000-000000000039',
    '5e510208-0000-4000-8000-000000000040'
  );

-- BIE-09 · Un respiro en medio del día: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000209'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510209-0000-4000-8000-000000000001',
    '5e510209-0000-4000-8000-000000000002',
    '5e510209-0000-4000-8000-000000000003',
    '5e510209-0000-4000-8000-000000000004',
    '5e510209-0000-4000-8000-000000000005',
    '5e510209-0000-4000-8000-000000000006',
    '5e510209-0000-4000-8000-000000000007',
    '5e510209-0000-4000-8000-000000000008',
    '5e510209-0000-4000-8000-000000000009',
    '5e510209-0000-4000-8000-000000000010',
    '5e510209-0000-4000-8000-000000000011',
    '5e510209-0000-4000-8000-000000000012',
    '5e510209-0000-4000-8000-000000000013',
    '5e510209-0000-4000-8000-000000000014',
    '5e510209-0000-4000-8000-000000000015',
    '5e510209-0000-4000-8000-000000000016',
    '5e510209-0000-4000-8000-000000000017',
    '5e510209-0000-4000-8000-000000000018',
    '5e510209-0000-4000-8000-000000000019',
    '5e510209-0000-4000-8000-000000000020',
    '5e510209-0000-4000-8000-000000000021',
    '5e510209-0000-4000-8000-000000000022',
    '5e510209-0000-4000-8000-000000000023',
    '5e510209-0000-4000-8000-000000000024',
    '5e510209-0000-4000-8000-000000000025',
    '5e510209-0000-4000-8000-000000000026',
    '5e510209-0000-4000-8000-000000000027',
    '5e510209-0000-4000-8000-000000000028',
    '5e510209-0000-4000-8000-000000000029',
    '5e510209-0000-4000-8000-000000000030',
    '5e510209-0000-4000-8000-000000000031',
    '5e510209-0000-4000-8000-000000000032',
    '5e510209-0000-4000-8000-000000000033',
    '5e510209-0000-4000-8000-000000000034',
    '5e510209-0000-4000-8000-000000000035',
    '5e510209-0000-4000-8000-000000000036',
    '5e510209-0000-4000-8000-000000000037',
    '5e510209-0000-4000-8000-000000000038',
    '5e510209-0000-4000-8000-000000000039',
    '5e510209-0000-4000-8000-000000000040'
  );

-- BIE-10 · Cuidado diario: Prepara un lugar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000210'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510210-0000-4000-8000-000000000001'
  );

-- BIE-11 · Movimiento amable: Haz una ronda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000211'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510211-0000-4000-8000-000000000001'
  );

-- BIE-12 · Descanso y ritmo: Escoge una señal: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000212'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510212-0000-4000-8000-000000000001'
  );

-- BIE-13 · Vínculos: Envía a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000213'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510213-0000-4000-8000-000000000001'
  );

-- BIE-14 · Creación: Inventa un título: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000214'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510214-0000-4000-8000-000000000001'
  );

-- BIE-15 · Regulación emocional: Pon palabra perfecta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000215'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510215-0000-4000-8000-000000000001'
  );

-- BIE-16 · Organización cotidiana: Divide un pendiente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000216'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510216-0000-4000-8000-000000000001'
  );

-- BIE-17 · Comer con flexibilidad: Elige una comida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000217'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510217-0000-4000-8000-000000000001'
  );

-- BIE-18 · Autonomía y límites: Ensaya una respuesta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000218'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510218-0000-4000-8000-000000000001'
  );

-- BIE-19 · Juego y disfrute: Arma un rompecabezas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000219'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510219-0000-4000-8000-000000000001'
  );

-- BIE-20 · Bienestar digital: Silencia respuesta inmediata: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000220'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510220-0000-4000-8000-000000000001'
  );

-- BIE-21 · Aire libre y comunidad: Elige un trayecto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000221'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510221-0000-4000-8000-000000000001'
  );

-- BIE-22 · Aprendizaje cotidiano: Aprende una palabra: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000222'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510222-0000-4000-8000-000000000001'
  );

-- BIE-23 · Cuidado diario: Escoge una prenda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000223'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510223-0000-4000-8000-000000000001'
  );

-- BIE-24 · Movimiento amable: Prueba una secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000224'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510224-0000-4000-8000-000000000001'
  );

-- BIE-25 · Descanso y ritmo: Elige qué actividad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000225'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510225-0000-4000-8000-000000000001'
  );

-- BIE-26 · Vínculos: Pregunta conversar hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000226'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510226-0000-4000-8000-000000000001'
  );

-- BIE-27 · Creación: Dibuja un objeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000227'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510227-0000-4000-8000-000000000001'
  );

-- BIE-28 · Regulación emocional: Separa en dos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000228'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510228-0000-4000-8000-000000000001'
  );

-- BIE-29 · Organización cotidiana: Agrupa tus tareas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000229'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510229-0000-4000-8000-000000000001'
  );

-- BIE-30 · Comer con flexibilidad: Prueba una combinación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000230'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510230-0000-4000-8000-000000000001'
  );

-- BIE-31 · Autonomía y límites: Elige qué información: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000231'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510231-0000-4000-8000-000000000001'
  );

-- BIE-32 · Juego y disfrute: Elige una canción: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000232'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510232-0000-4000-8000-000000000001'
  );

-- BIE-33 · Bienestar digital: Revisa qué aplicaciones: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000233'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510233-0000-4000-8000-000000000001'
  );

-- BIE-34 · Aire libre y comunidad: Si te es: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000234'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510234-0000-4000-8000-000000000001'
  );

-- BIE-35 · Aprendizaje cotidiano: Pídele a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000235'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510235-0000-4000-8000-000000000001'
  );

-- BIE-36 · Cuidado diario: Haz una lista: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000236'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510236-0000-4000-8000-000000000001'
  );

-- BIE-37 · Movimiento amable: Dibuja en el: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000237'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510237-0000-4000-8000-000000000001'
  );

-- BIE-38 · Descanso y ritmo: Haz una pantalla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000238'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510238-0000-4000-8000-000000000001'
  );

-- BIE-39 · Vínculos: Comparte un recuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000239'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510239-0000-4000-8000-000000000001'
  );

-- BIE-40 · Creación: Escribe un diálogo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000240'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510240-0000-4000-8000-000000000001'
  );

-- BIE-41 · Regulación emocional: Elige una frase: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000241'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510241-0000-4000-8000-000000000001'
  );

-- BIE-42 · Organización cotidiana: Elige una tarea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000242'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510242-0000-4000-8000-000000000001'
  );

-- BIE-43 · Comer con flexibilidad: Prepara un acompañamiento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000243'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510243-0000-4000-8000-000000000001'
  );

-- BIE-44 · Autonomía y límites: Pide otra manera: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000244'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510244-0000-4000-8000-000000000001'
  );

-- BIE-45 · Juego y disfrute: Juega una ronda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000245'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510245-0000-4000-8000-000000000001'
  );

-- BIE-46 · Bienestar digital: Elimina una captura: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000246'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510246-0000-4000-8000-000000000001'
  );

-- BIE-47 · Aire libre y comunidad: Sal harás allí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000247'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510247-0000-4000-8000-000000000001'
  );

-- BIE-48 · Aprendizaje cotidiano: Elige sus pasos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000248'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510248-0000-4000-8000-000000000001'
  );

-- BIE-49 · Cuidado diario: Cambia de sitio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000249'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510249-0000-4000-8000-000000000001'
  );

-- BIE-50 · Movimiento amable: Cambia de postura: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000250'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510250-0000-4000-8000-000000000001'
  );

-- BIE-51 · Descanso y ritmo: Decide qué conversación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000251'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510251-0000-4000-8000-000000000001'
  );

-- BIE-52 · Vínculos: Agradece una ayuda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000252'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510252-0000-4000-8000-000000000001'
  );

-- BIE-53 · Creación: Crea una lista: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000253'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510253-0000-4000-8000-000000000001'
  );

-- BIE-54 · Regulación emocional: Escribe qué necesitarías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000254'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510254-0000-4000-8000-000000000001'
  );

-- BIE-55 · Organización cotidiana: Prepara una lista: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000255'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510255-0000-4000-8000-000000000001'
  );

-- BIE-56 · Comer con flexibilidad: Escoge una receta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000256'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510256-0000-4000-8000-000000000001'
  );

-- BIE-57 · Autonomía y límites: Decide cuánto tiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000257'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510257-0000-4000-8000-000000000001'
  );

-- BIE-58 · Juego y disfrute: Haz planearlas aún: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000258'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510258-0000-4000-8000-000000000001'
  );

-- BIE-59 · Bienestar digital: Deja el teléfono: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000259'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510259-0000-4000-8000-000000000001'
  );

-- BIE-60 · Aire libre y comunidad: Visita una tienda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000260'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510260-0000-4000-8000-000000000001'
  );

-- BIE-61 · Aprendizaje cotidiano: Mira un tutorial: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000261'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510261-0000-4000-8000-000000000001'
  );

-- BIE-62 · Cuidado diario: Deja que disfrutes: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000262'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510262-0000-4000-8000-000000000001'
  );

-- BIE-63 · Movimiento amable: Haz una secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000263'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510263-0000-4000-8000-000000000001'
  );

-- BIE-64 · Descanso y ritmo: Prueba una nota: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000264'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510264-0000-4000-8000-000000000001'
  );

-- BIE-65 · Vínculos: Invita a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000265'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510265-0000-4000-8000-000000000001'
  );

-- BIE-66 · Creación: Diseña en papel: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000266'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510266-0000-4000-8000-000000000001'
  );

-- BIE-67 · Regulación emocional: Haz una tarjeta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000267'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510267-0000-4000-8000-000000000001'
  );

-- BIE-68 · Organización cotidiana: Agrupa en el: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000268'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510268-0000-4000-8000-000000000001'
  );

-- BIE-69 · Comer con flexibilidad: Arma un plato: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000269'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510269-0000-4000-8000-000000000001'
  );

-- BIE-70 · Autonomía y límites: Practica otro momento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000270'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510270-0000-4000-8000-000000000001'
  );

-- BIE-71 · Juego y disfrute: Construye una figura: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000271'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510271-0000-4000-8000-000000000001'
  );

-- BIE-72 · Bienestar digital: Configura un modo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000272'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510272-0000-4000-8000-000000000001'
  );

-- BIE-73 · Aire libre y comunidad: Busca una banca: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000273'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510273-0000-4000-8000-000000000001'
  );

-- BIE-74 · Aprendizaje cotidiano: Lee una página: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000274'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510274-0000-4000-8000-000000000001'
  );

-- BIE-75 · Cuidado diario: Elige cinco minutos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000275'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510275-0000-4000-8000-000000000001'
  );

-- BIE-76 · Movimiento amable: Coordina una mano: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000276'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510276-0000-4000-8000-000000000001'
  );

-- BIE-77 · Descanso y ritmo: Elige una hora: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000277'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510277-0000-4000-8000-000000000001'
  );

-- BIE-78 · Vínculos: Escucha una historia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000278'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510278-0000-4000-8000-000000000001'
  );

-- BIE-79 · Creación: Escribe una receta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000279'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510279-0000-4000-8000-000000000001'
  );

-- BIE-80 · Regulación emocional: Piensa que hiciste: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000280'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510280-0000-4000-8000-000000000001'
  );

-- BIE-81 · Organización cotidiana: Crea un recordatorio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000281'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510281-0000-4000-8000-000000000001'
  );

-- BIE-82 · Comer con flexibilidad: Elige qué te: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000282'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510282-0000-4000-8000-000000000001'
  );

-- BIE-83 · Autonomía y límites: Elige una preferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000283'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510283-0000-4000-8000-000000000001'
  );

-- BIE-84 · Juego y disfrute: Busca una palabra: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000284'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510284-0000-4000-8000-000000000001'
  );

-- BIE-85 · Bienestar digital: Cancela una notificación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000285'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510285-0000-4000-8000-000000000001'
  );

-- BIE-86 · Aire libre y comunidad: Saluda tengas confianza: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000286'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510286-0000-4000-8000-000000000001'
  );

-- BIE-87 · Aprendizaje cotidiano: Practica una frase: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000287'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510287-0000-4000-8000-000000000001'
  );

-- BIE-88 · Cuidado diario: Revisa qué objeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000288'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510288-0000-4000-8000-000000000001'
  );

-- BIE-89 · Movimiento amable: Sigue con los: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000289'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510289-0000-4000-8000-000000000001'
  );

-- BIE-90 · Descanso y ritmo: Prepara una transición: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000290'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510290-0000-4000-8000-000000000001'
  );

-- BIE-91 · Vínculos: Escribe un mensaje: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000291'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510291-0000-4000-8000-000000000001'
  );

-- BIE-92 · Creación: Haz un mapa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000292'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510292-0000-4000-8000-000000000001'
  );

-- BIE-93 · Regulación emocional: Elige una acción: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000293'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510293-0000-4000-8000-000000000001'
  );

-- BIE-94 · Organización cotidiana: Elimina una tarea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000294'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510294-0000-4000-8000-000000000001'
  );

-- BIE-95 · Comer con flexibilidad: Prueba mismo tiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000295'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510295-0000-4000-8000-000000000001'
  );

-- BIE-96 · Autonomía y límites: Escribe una frase: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000296'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510296-0000-4000-8000-000000000001'
  );

-- BIE-97 · Juego y disfrute: Elige un pasatiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000297'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510297-0000-4000-8000-000000000001'
  );

-- BIE-98 · Bienestar digital: Organiza tus fotos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000298'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510298-0000-4000-8000-000000000001'
  );

-- BIE-99 · Aire libre y comunidad: Elige un lugar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000299'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510299-0000-4000-8000-000000000001'
  );

-- BIE-100 · Aprendizaje cotidiano: Pregunta su familia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002100'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502100-0000-4000-8000-000000000001'
  );

-- BIE-101 · Cuidado diario: Acomoda una silla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002101'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502101-0000-4000-8000-000000000001'
  );

-- BIE-102 · Movimiento amable: Practica para ti: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002102'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502102-0000-4000-8000-000000000001'
  );

-- BIE-103 · Descanso y ritmo: Anota qué te: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002103'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502103-0000-4000-8000-000000000001'
  );

-- BIE-104 · Vínculos: Pide haría bien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002104'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502104-0000-4000-8000-000000000001'
  );

-- BIE-105 · Creación: Inventa un final: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002105'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502105-0000-4000-8000-000000000001'
  );

-- BIE-106 · Regulación emocional: Practica para pensarlo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002106'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502106-0000-4000-8000-000000000001'
  );

-- BIE-107 · Organización cotidiana: Ordena un archivo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002107'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502107-0000-4000-8000-000000000001'
  );

-- BIE-108 · Comer con flexibilidad: Invita una comida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002108'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502108-0000-4000-8000-000000000001'
  );

-- BIE-109 · Autonomía y límites: Decide qué parte: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002109'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502109-0000-4000-8000-000000000001'
  );

-- BIE-110 · Juego y disfrute: Haz una competencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002110'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502110-0000-4000-8000-000000000001'
  );

-- BIE-111 · Bienestar digital: Haz una pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002111'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502111-0000-4000-8000-000000000001'
  );

-- BIE-112 · Aire libre y comunidad: Recoge un papel: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002112'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502112-0000-4000-8000-000000000001'
  );

-- BIE-113 · Aprendizaje cotidiano: Identifica una herramienta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002113'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502113-0000-4000-8000-000000000001'
  );

-- BIE-114 · Cuidado diario: Prepara los materiales: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002114'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502114-0000-4000-8000-000000000001'
  );

-- BIE-115 · Movimiento amable: Haz una ruta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002115'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502115-0000-4000-8000-000000000001'
  );

-- BIE-116 · Descanso y ritmo: Cambia una actividad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002116'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502116-0000-4000-8000-000000000001'
  );

-- BIE-117 · Vínculos: Propón una conversación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002117'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502117-0000-4000-8000-000000000001'
  );

-- BIE-118 · Creación: Crea un ritmo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002118'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502118-0000-4000-8000-000000000001'
  );

-- BIE-119 · Regulación emocional: Nombra para aclararlo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002119'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502119-0000-4000-8000-000000000001'
  );

-- BIE-120 · Organización cotidiana: Deja una nota: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002120'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502120-0000-4000-8000-000000000001'
  );

-- BIE-121 · Comer con flexibilidad: Elige una fruta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002121'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502121-0000-4000-8000-000000000001'
  );

-- BIE-122 · Autonomía y límites: Practica mensaje importante: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002122'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502122-0000-4000-8000-000000000001'
  );

-- BIE-123 · Juego y disfrute: Crea una adivinanza: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002123'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502123-0000-4000-8000-000000000001'
  );

-- BIE-124 · Bienestar digital: Revisa quién puede: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002124'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502124-0000-4000-8000-000000000001'
  );

-- BIE-125 · Aire libre y comunidad: Llama te interese: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002125'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502125-0000-4000-8000-000000000001'
  );

-- BIE-126 · Aprendizaje cotidiano: Enséñale a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002126'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502126-0000-4000-8000-000000000001'
  );

-- BIE-127 · Cuidado diario: Decide qué pendiente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002127'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502127-0000-4000-8000-000000000001'
  );

-- BIE-128 · Movimiento amable: Alterna el pulgar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002128'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502128-0000-4000-8000-000000000001'
  );

-- BIE-129 · Descanso y ritmo: Escoge un sonido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002129'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502129-0000-4000-8000-000000000001'
  );

-- BIE-130 · Vínculos: Reconoce ejemplo específico: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002130'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502130-0000-4000-8000-000000000001'
  );

-- BIE-131 · Creación: Escribe una nota: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002131'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502131-0000-4000-8000-000000000001'
  );

-- BIE-132 · Regulación emocional: Escoge una actividad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002132'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502132-0000-4000-8000-000000000001'
  );

-- BIE-133 · Organización cotidiana: Crea pueden esperar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002133'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502133-0000-4000-8000-000000000001'
  );

-- BIE-134 · Comer con flexibilidad: Prepara poco tiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002134'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502134-0000-4000-8000-000000000001'
  );

-- BIE-135 · Autonomía y límites: Elige un compromiso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002135'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502135-0000-4000-8000-000000000001'
  );

-- BIE-136 · Juego y disfrute: Elige una fotografía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002136'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502136-0000-4000-8000-000000000001'
  );

-- BIE-137 · Bienestar digital: Cierra este dispositivo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002137'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502137-0000-4000-8000-000000000001'
  );

-- BIE-138 · Aire libre y comunidad: Explora una ruta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002138'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502138-0000-4000-8000-000000000001'
  );

-- BIE-139 · Aprendizaje cotidiano: Elige una actividad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002139'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502139-0000-4000-8000-000000000001'
  );

-- BIE-140 · Cuidado diario: Limpia con frecuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002140'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502140-0000-4000-8000-000000000001'
  );

-- BIE-141 · Movimiento amable: Prueba el cuello: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002141'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502141-0000-4000-8000-000000000001'
  );

-- BIE-142 · Descanso y ritmo: Identifica una tarea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002142'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502142-0000-4000-8000-000000000001'
  );

-- BIE-143 · Vínculos: Comparte una foto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002143'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502143-0000-4000-8000-000000000001'
  );

-- BIE-144 · Creación: Dibuja una escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002144'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502144-0000-4000-8000-000000000001'
  );

-- BIE-145 · Regulación emocional: Escribe cómo explicarías: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002145'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502145-0000-4000-8000-000000000001'
  );

-- BIE-146 · Organización cotidiana: Compara dos formas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002146'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502146-0000-4000-8000-000000000001'
  );

-- BIE-147 · Comer con flexibilidad: Prueba un utensilio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002147'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502147-0000-4000-8000-000000000001'
  );

-- BIE-148 · Autonomía y límites: Formula una petición: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002148'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502148-0000-4000-8000-000000000001'
  );

-- BIE-149 · Juego y disfrute: Arma una lista: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002149'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502149-0000-4000-8000-000000000001'
  );

-- BIE-150 · Bienestar digital: Elige una franja: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002150'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502150-0000-4000-8000-000000000001'
  );

-- BIE-151 · Aire libre y comunidad: Pasa la comunidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002151'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502151-0000-4000-8000-000000000001'
  );

-- BIE-152 · Aprendizaje cotidiano: Anota una pregunta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002152'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502152-0000-4000-8000-000000000001'
  );

-- BIE-153 · Cuidado diario: Elige una cosa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002153'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502153-0000-4000-8000-000000000001'
  );

-- BIE-154 · Movimiento amable: Imita con las: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002154'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502154-0000-4000-8000-000000000001'
  );

-- BIE-155 · Descanso y ritmo: Haz sin calificarlas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002155'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502155-0000-4000-8000-000000000001'
  );

-- BIE-156 · Vínculos: Pregunta a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002156'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502156-0000-4000-8000-000000000001'
  );

-- BIE-157 · Creación: Inventa una palabra: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002157'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502157-0000-4000-8000-000000000001'
  );

-- BIE-158 · Regulación emocional: Piensa para ti: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002158'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502158-0000-4000-8000-000000000001'
  );

-- BIE-159 · Organización cotidiana: Agrupa los objetos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002159'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502159-0000-4000-8000-000000000001'
  );

-- BIE-160 · Comer con flexibilidad: Elige una música: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002160'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502160-0000-4000-8000-000000000001'
  );

-- BIE-161 · Autonomía y límites: Decide qué horario: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002161'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502161-0000-4000-8000-000000000001'
  );

-- BIE-162 · Juego y disfrute: Prueba una receta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002162'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502162-0000-4000-8000-000000000001'
  );

-- BIE-163 · Bienestar digital: Cambia el fondo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002163'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502163-0000-4000-8000-000000000001'
  );

-- BIE-164 · Aire libre y comunidad: Elige un punto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002164'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502164-0000-4000-8000-000000000001'
  );

-- BIE-165 · Aprendizaje cotidiano: Aprende un dato: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002165'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502165-0000-4000-8000-000000000001'
  );

-- BIE-166 · Cuidado diario: Separa o bolsillo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002166'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502166-0000-4000-8000-000000000001'
  );

-- BIE-167 · Movimiento amable: Haz lo necesitas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002167'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502167-0000-4000-8000-000000000001'
  );

-- BIE-168 · Descanso y ritmo: Elige un espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002168'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502168-0000-4000-8000-000000000001'
  );

-- BIE-169 · Vínculos: Invita su manera: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002169'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502169-0000-4000-8000-000000000001'
  );

-- BIE-170 · Creación: Crea una postal: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002170'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502170-0000-4000-8000-000000000001'
  );

-- BIE-171 · Regulación emocional: Elige a quién: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002171'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502171-0000-4000-8000-000000000001'
  );

-- BIE-172 · Organización cotidiana: Revisa tus compromisos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002172'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502172-0000-4000-8000-000000000001'
  );

-- BIE-173 · Comer con flexibilidad: Arma una merienda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002173'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502173-0000-4000-8000-000000000001'
  );

-- BIE-174 · Autonomía y límites: Practica una decisión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002174'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502174-0000-4000-8000-000000000001'
  );

-- BIE-175 · Juego y disfrute: Dibuja un mapa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002175'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502175-0000-4000-8000-000000000001'
  );

-- BIE-176 · Bienestar digital: Guarda una página: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002176'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502176-0000-4000-8000-000000000001'
  );

-- BIE-177 · Aire libre y comunidad: Deja un libro: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002177'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502177-0000-4000-8000-000000000001'
  );

-- BIE-178 · Aprendizaje cotidiano: Practica paso olvidaste: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002178'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502178-0000-4000-8000-000000000001'
  );

-- BIE-179 · Cuidado diario: Haz del lugar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002179'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502179-0000-4000-8000-000000000001'
  );

-- BIE-180 · Movimiento amable: Pasa una pelota: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002180'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502180-0000-4000-8000-000000000001'
  );

-- BIE-181 · Descanso y ritmo: Decide si esta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002181'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502181-0000-4000-8000-000000000001'
  );

-- BIE-182 · Vínculos: Ofrece persona decida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002182'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502182-0000-4000-8000-000000000001'
  );

-- BIE-183 · Creación: Escribe una historia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002183'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502183-0000-4000-8000-000000000001'
  );

-- BIE-184 · Regulación emocional: Describe un momento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002184'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502184-0000-4000-8000-000000000001'
  );

-- BIE-185 · Organización cotidiana: Elige un cajón: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002185'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502185-0000-4000-8000-000000000001'
  );

-- BIE-186 · Comer con flexibilidad: Recuerda una comida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002186'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502186-0000-4000-8000-000000000001'
  );

-- BIE-187 · Autonomía y límites: Elige una responsabilidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002187'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502187-0000-4000-8000-000000000001'
  );

-- BIE-188 · Juego y disfrute: Elige una película: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002188'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502188-0000-4000-8000-000000000001'
  );

-- BIE-189 · Bienestar digital: Revisa qué permisos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002189'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502189-0000-4000-8000-000000000001'
  );

-- BIE-190 · Aire libre y comunidad: Busca un evento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002190'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502190-0000-4000-8000-000000000001'
  );

-- BIE-191 · Aprendizaje cotidiano: Elige un objeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002191'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502191-0000-4000-8000-000000000001'
  );

-- BIE-192 · Cuidado diario: Deja empezar mañana: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002192'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502192-0000-4000-8000-000000000001'
  );

-- BIE-193 · Movimiento amable: Acompaña una canción: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002193'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502193-0000-4000-8000-000000000001'
  );

-- BIE-194 · Descanso y ritmo: Prepara una nota: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002194'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502194-0000-4000-8000-000000000001'
  );

-- BIE-195 · Vínculos: Pide que te: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002195'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502195-0000-4000-8000-000000000001'
  );

-- BIE-196 · Creación: Diseña una portada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002196'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502196-0000-4000-8000-000000000001'
  );

-- BIE-197 · Regulación emocional: Haz una conversación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002197'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502197-0000-4000-8000-000000000001'
  );

-- BIE-198 · Organización cotidiana: Convierte una instrucción: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002198'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502198-0000-4000-8000-000000000001'
  );

-- BIE-199 · Comer con flexibilidad: Organiza los ingredientes: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002199'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502199-0000-4000-8000-000000000001'
  );

-- BIE-200 · Autonomía y límites: Escribe una respuesta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002200'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502200-0000-4000-8000-000000000001'
  );

-- BIE-201 · Juego y disfrute: Juega a describir: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002201'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502201-0000-4000-8000-000000000001'
  );

-- BIE-202 · Bienestar digital: Ordena la pantalla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002202'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502202-0000-4000-8000-000000000001'
  );

-- BIE-203 · Aire libre y comunidad: Riega una planta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002203'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502203-0000-4000-8000-000000000001'
  );

-- BIE-204 · Aprendizaje cotidiano: Pídele parecido útil: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002204'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502204-0000-4000-8000-000000000001'
  );

-- BIE-205 · Cuidado diario: Pon a cargar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002205'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502205-0000-4000-8000-000000000001'
  );

-- BIE-206 · Movimiento amable: Estira una pierna: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002206'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502206-0000-4000-8000-000000000001'
  );

-- BIE-207 · Descanso y ritmo: Escoge la vez: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002207'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502207-0000-4000-8000-000000000001'
  );

-- BIE-208 · Vínculos: Cuéntale a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002208'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502208-0000-4000-8000-000000000001'
  );

-- BIE-209 · Creación: Haz un collage: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002209'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502209-0000-4000-8000-000000000001'
  );

-- BIE-210 · Regulación emocional: Recuerda una ocasión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002210'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502210-0000-4000-8000-000000000001'
  );

-- BIE-211 · Organización cotidiana: Marca qué tarea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002211'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502211-0000-4000-8000-000000000001'
  );

-- BIE-212 · Comer con flexibilidad: Elige un alimento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002212'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502212-0000-4000-8000-000000000001'
  );

-- BIE-213 · Autonomía y límites: Señala qué condición: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002213'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502213-0000-4000-8000-000000000001'
  );

-- BIE-214 · Juego y disfrute: Crea una categoría: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002214'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502214-0000-4000-8000-000000000001'
  );

-- BIE-215 · Bienestar digital: Establece un límite: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002215'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502215-0000-4000-8000-000000000001'
  );

-- BIE-216 · Aire libre y comunidad: Elige un comercio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002216'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502216-0000-4000-8000-000000000001'
  );

-- BIE-217 · Aprendizaje cotidiano: Aprende una regla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002217'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502217-0000-4000-8000-000000000001'
  );

-- BIE-218 · Cuidado diario: Prepara un espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002218'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502218-0000-4000-8000-000000000001'
  );

-- BIE-219 · Movimiento amable: Haz una coreografía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002219'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502219-0000-4000-8000-000000000001'
  );

-- BIE-220 · Descanso y ritmo: Deja un margen: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002220'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502220-0000-4000-8000-000000000001'
  );

-- BIE-221 · Vínculos: Propón una llamada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002221'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502221-0000-4000-8000-000000000001'
  );

-- BIE-222 · Creación: Describe un color: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002222'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502222-0000-4000-8000-000000000001'
  );

-- BIE-223 · Regulación emocional: Cambia una autocrítica: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002223'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502223-0000-4000-8000-000000000001'
  );

-- BIE-224 · Organización cotidiana: Prepara un menú: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002224'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502224-0000-4000-8000-000000000001'
  );

-- BIE-225 · Comer con flexibilidad: Prepara una bebida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002225'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502225-0000-4000-8000-000000000001'
  );

-- BIE-226 · Autonomía y límites: Elige si quieres: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002226'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502226-0000-4000-8000-000000000001'
  );

-- BIE-227 · Juego y disfrute: Inventa un nombre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002227'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502227-0000-4000-8000-000000000001'
  );

-- BIE-228 · Bienestar digital: Lee un mensaje: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002228'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502228-0000-4000-8000-000000000001'
  );

-- BIE-229 · Aire libre y comunidad: Si ya tienes: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002229'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502229-0000-4000-8000-000000000001'
  );

-- BIE-230 · Aprendizaje cotidiano: Prueba una técnica: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002230'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502230-0000-4000-8000-000000000001'
  );

-- BIE-231 · Cuidado diario: Guarda un objeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002231'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502231-0000-4000-8000-000000000001'
  );

-- BIE-232 · Movimiento amable: Practica al inicio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002232'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502232-0000-4000-8000-000000000001'
  );

-- BIE-233 · Descanso y ritmo: Elige puede esperar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002233'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502233-0000-4000-8000-000000000001'
  );

-- BIE-234 · Vínculos: Haz una pregunta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002234'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502234-0000-4000-8000-000000000001'
  );

-- BIE-235 · Creación: Inventa una celebración: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002235'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502235-0000-4000-8000-000000000001'
  );

-- BIE-236 · Regulación emocional: Elige una preocupación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002236'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502236-0000-4000-8000-000000000001'
  );

-- BIE-237 · Organización cotidiana: Configura una alarma: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002237'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502237-0000-4000-8000-000000000001'
  );

-- BIE-238 · Comer con flexibilidad: Haz algún día: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002238'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502238-0000-4000-8000-000000000001'
  );

-- BIE-239 · Autonomía y límites: Practica con claridad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002239'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502239-0000-4000-8000-000000000001'
  );

-- BIE-240 · Juego y disfrute: Haz opciones curiosas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002240'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502240-0000-4000-8000-000000000001'
  );

-- BIE-241 · Bienestar digital: Pasa una actividad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002241'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502241-0000-4000-8000-000000000001'
  );

-- BIE-242 · Aire libre y comunidad: Haz un recorrido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002242'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502242-0000-4000-8000-000000000001'
  );

-- BIE-243 · Aprendizaje cotidiano: Busca el significado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002243'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502243-0000-4000-8000-000000000001'
  );

-- BIE-244 · Cuidado diario: Elige más cómoda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002244'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502244-0000-4000-8000-000000000001'
  );

-- BIE-245 · Movimiento amable: Ponte de pie: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002245'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502245-0000-4000-8000-000000000001'
  );

-- BIE-246 · Descanso y ritmo: Planea una pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002246'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502246-0000-4000-8000-000000000001'
  );

-- BIE-247 · Vínculos: Expresa una preferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002247'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502247-0000-4000-8000-000000000001'
  );

-- BIE-248 · Creación: Escribe tres versos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002248'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502248-0000-4000-8000-000000000001'
  );

-- BIE-249 · Regulación emocional: Escribe dos respuestas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002249'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502249-0000-4000-8000-000000000001'
  );

-- BIE-250 · Organización cotidiana: Cierra las pestañas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002250'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502250-0000-4000-8000-000000000001'
  );

-- BIE-251 · Comer con flexibilidad: Pregunta o comunidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002251'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502251-0000-4000-8000-000000000001'
  );

-- BIE-252 · Autonomía y límites: Decide qué tema: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002252'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502252-0000-4000-8000-000000000001'
  );

-- BIE-253 · Juego y disfrute: Elige terminarla hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002253'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502253-0000-4000-8000-000000000001'
  );

-- BIE-254 · Bienestar digital: Haz una copia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002254'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502254-0000-4000-8000-000000000001'
  );

-- BIE-255 · Aire libre y comunidad: Lleva una bolsa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002255'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502255-0000-4000-8000-000000000001'
  );

-- BIE-256 · Aprendizaje cotidiano: Compara dos instrucciones: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002256'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502256-0000-4000-8000-000000000001'
  );

-- BIE-257 · Cuidado diario: Ajusta la altura: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002257'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502257-0000-4000-8000-000000000001'
  );

-- BIE-258 · Movimiento amable: Realiza una secuencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002258'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502258-0000-4000-8000-000000000001'
  );

-- BIE-259 · Descanso y ritmo: Haz elegir ahora: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002259'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502259-0000-4000-8000-000000000001'
  );

-- BIE-260 · Vínculos: Dile a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002260'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502260-0000-4000-8000-000000000001'
  );

-- BIE-261 · Creación: Dibuja un recorrido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002261'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502261-0000-4000-8000-000000000001'
  );

-- BIE-262 · Regulación emocional: Pon un nombre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002262'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502262-0000-4000-8000-000000000001'
  );

-- BIE-263 · Organización cotidiana: Elige una superficie: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002263'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502263-0000-4000-8000-000000000001'
  );

-- BIE-264 · Comer con flexibilidad: Elige cómoda hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002264'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502264-0000-4000-8000-000000000001'
  );

-- BIE-265 · Autonomía y límites: Pide más equilibrada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002265'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502265-0000-4000-8000-000000000001'
  );

-- BIE-266 · Juego y disfrute: Construye una torre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002266'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502266-0000-4000-8000-000000000001'
  );

-- BIE-267 · Bienestar digital: Quita de favoritos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002267'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502267-0000-4000-8000-000000000001'
  );

-- BIE-268 · Aire libre y comunidad: Pregunta la zona: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002268'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502268-0000-4000-8000-000000000001'
  );

-- BIE-269 · Aprendizaje cotidiano: Practica una habilidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002269'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502269-0000-4000-8000-000000000001'
  );

-- BIE-270 · Cuidado diario: Reúne al salir: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002270'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502270-0000-4000-8000-000000000001'
  );

-- BIE-271 · Movimiento amable: Imita un movimiento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002271'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502271-0000-4000-8000-000000000001'
  );

-- BIE-272 · Descanso y ritmo: Decide simplificar hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002272'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502272-0000-4000-8000-000000000001'
  );

-- BIE-273 · Vínculos: Comparte una recomendación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002273'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502273-0000-4000-8000-000000000001'
  );

-- BIE-274 · Creación: Crea una mini: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002274'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502274-0000-4000-8000-000000000001'
  );

-- BIE-275 · Regulación emocional: Decide qué información: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002275'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502275-0000-4000-8000-000000000001'
  );

-- BIE-276 · Organización cotidiana: Haz último minuto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002276'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502276-0000-4000-8000-000000000001'
  );

-- BIE-277 · Comer con flexibilidad: Prueba hayas juntado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002277'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502277-0000-4000-8000-000000000001'
  );

-- BIE-278 · Autonomía y límites: Elige qué notificaciones: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002278'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502278-0000-4000-8000-000000000001'
  );

-- BIE-279 · Juego y disfrute: Crea por gusto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002279'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502279-0000-4000-8000-000000000001'
  );

-- BIE-280 · Bienestar digital: Escoge espera breve: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002280'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502280-0000-4000-8000-000000000001'
  );

-- BIE-281 · Aire libre y comunidad: Elige gusto allí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002281'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502281-0000-4000-8000-000000000001'
  );

-- BIE-282 · Aprendizaje cotidiano: Elige un tema: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002282'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502282-0000-4000-8000-000000000001'
  );

-- BIE-283 · Cuidado diario: Escoge tu jornada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002283'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502283-0000-4000-8000-000000000001'
  );

-- BIE-284 · Movimiento amable: Coordina un paso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002284'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502284-0000-4000-8000-000000000001'
  );

-- BIE-285 · Descanso y ritmo: Termina el día: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002285'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502285-0000-4000-8000-000000000001'
  );

-- BIE-286 · Vínculos: Responde un mensaje: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002286'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502286-0000-4000-8000-000000000001'
  );

-- BIE-287 · Creación: Inventa un juego: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002287'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502287-0000-4000-8000-000000000001'
  );

-- BIE-288 · Regulación emocional: Haz día complicado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002288'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502288-0000-4000-8000-000000000001'
  );

-- BIE-289 · Organización cotidiana: Separa los mensajes: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002289'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502289-0000-4000-8000-000000000001'
  );

-- BIE-290 · Comer con flexibilidad: Elige a solas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002290'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502290-0000-4000-8000-000000000001'
  );

-- BIE-291 · Autonomía y límites: Explica qué tipo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002291'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502291-0000-4000-8000-000000000001'
  );

-- BIE-292 · Juego y disfrute: Imita un personaje: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002292'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502292-0000-4000-8000-000000000001'
  );

-- BIE-293 · Bienestar digital: Revisa tu lista: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002293'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502293-0000-4000-8000-000000000001'
  );

-- BIE-294 · Aire libre y comunidad: Pasa un rato: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002294'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502294-0000-4000-8000-000000000001'
  );

-- BIE-295 · Aprendizaje cotidiano: Pide quieras probar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002295'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502295-0000-4000-8000-000000000001'
  );

-- BIE-296 · Cuidado diario: Abre una ventana: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002296'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502296-0000-4000-8000-000000000001'
  );

-- BIE-297 · Movimiento amable: Haz en reposo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002297'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502297-0000-4000-8000-000000000001'
  );

-- BIE-298 · Descanso y ritmo: Deja quieras disfrutar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002298'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502298-0000-4000-8000-000000000001'
  );

-- BIE-299 · Vínculos: Pide a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002299'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502299-0000-4000-8000-000000000001'
  );

-- BIE-300 · Creación: Escribe un anuncio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002300'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502300-0000-4000-8000-000000000001'
  );

-- BIE-301 · Regulación emocional: Practica responder lo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002301'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502301-0000-4000-8000-000000000001'
  );

-- BIE-302 · Organización cotidiana: Revisa una rutina: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002302'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502302-0000-4000-8000-000000000001'
  );

-- BIE-303 · Comer con flexibilidad: Pon la mesa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002303'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502303-0000-4000-8000-000000000001'
  );

-- BIE-304 · Autonomía y límites: Decide si quieres: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002304'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502304-0000-4000-8000-000000000001'
  );

-- BIE-305 · Juego y disfrute: Diseña una búsqueda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002305'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502305-0000-4000-8000-000000000001'
  );

-- BIE-306 · Bienestar digital: Escribe de enviarla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002306'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502306-0000-4000-8000-000000000001'
  );

-- BIE-307 · Aire libre y comunidad: Toma una foto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002307'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502307-0000-4000-8000-000000000001'
  );

-- BIE-308 · Aprendizaje cotidiano: Aprende cómo se: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002308'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502308-0000-4000-8000-000000000001'
  );

-- BIE-309 · Cuidado diario: Prepara una bolsa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002309'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502309-0000-4000-8000-000000000001'
  );

-- BIE-310 · Movimiento amable: Sigue un patrón: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002310'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502310-0000-4000-8000-000000000001'
  );

-- BIE-311 · Descanso y ritmo: Elige ya empezó: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002311'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502311-0000-4000-8000-000000000001'
  );

-- BIE-312 · Vínculos: Celebra un logro: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002312'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502312-0000-4000-8000-000000000001'
  );

-- BIE-313 · Creación: Combina dos actividades: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002313'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502313-0000-4000-8000-000000000001'
  );

-- BIE-314 · Regulación emocional: Identifica una emoción: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002314'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502314-0000-4000-8000-000000000001'
  );

-- BIE-315 · Organización cotidiana: Elige al momento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002315'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502315-0000-4000-8000-000000000001'
  );

-- BIE-316 · Comer con flexibilidad: Explora el aroma: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002316'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502316-0000-4000-8000-000000000001'
  );

-- BIE-317 · Autonomía y límites: Practica o llamada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002317'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502317-0000-4000-8000-000000000001'
  );

-- BIE-318 · Juego y disfrute: Encuentra un juego: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002318'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502318-0000-4000-8000-000000000001'
  );

-- BIE-319 · Bienestar digital: Cambia el tamaño: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002319'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502319-0000-4000-8000-000000000001'
  );

-- BIE-320 · Aire libre y comunidad: Comprueba si hay: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002320'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502320-0000-4000-8000-000000000001'
  );

-- BIE-321 · Aprendizaje cotidiano: Explica con tus: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002321'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502321-0000-4000-8000-000000000001'
  );

-- BIE-322 · Cuidado diario: Decide qué aviso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002322'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502322-0000-4000-8000-000000000001'
  );

-- BIE-323 · Movimiento amable: Mueve los dedos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002323'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502323-0000-4000-8000-000000000001'
  );

-- BIE-324 · Descanso y ritmo: Haz por hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002324'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502324-0000-4000-8000-000000000001'
  );

-- BIE-325 · Vínculos: Agradece a alguien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002325'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502325-0000-4000-8000-000000000001'
  );

-- BIE-326 · Creación: Haz canción inventada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002326'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502326-0000-4000-8000-000000000001'
  );

-- BIE-327 · Regulación emocional: Elige más disponibilidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002327'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502327-0000-4000-8000-000000000001'
  );

-- BIE-328 · Organización cotidiana: Guarda un documento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002328'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502328-0000-4000-8000-000000000001'
  );

-- BIE-329 · Comer con flexibilidad: Escoge con anticipación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002329'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502329-0000-4000-8000-000000000001'
  );

-- BIE-330 · Autonomía y límites: Escoge una decisión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002330'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502330-0000-4000-8000-000000000001'
  );

-- BIE-331 · Juego y disfrute: Haz una foto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002331'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502331-0000-4000-8000-000000000001'
  );

-- BIE-332 · Bienestar digital: Elige un momento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002332'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502332-0000-4000-8000-000000000001'
  );

-- BIE-333 · Aire libre y comunidad: Lleva una nota: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002333'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502333-0000-4000-8000-000000000001'
  );

-- BIE-334 · Aprendizaje cotidiano: Elige una receta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002334'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502334-0000-4000-8000-000000000001'
  );

-- BIE-335 · Cuidado diario: Busca una forma: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002335'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502335-0000-4000-8000-000000000001'
  );

-- BIE-336 · Movimiento amable: Cambia de mano: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002336'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502336-0000-4000-8000-000000000001'
  );

-- BIE-337 · Descanso y ritmo: Ajusta tu plan: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002337'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502337-0000-4000-8000-000000000001'
  );

-- BIE-338 · Vínculos: Propón un plan: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002338'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502338-0000-4000-8000-000000000001'
  );

-- BIE-339 · Creación: Diseña una etiqueta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002339'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502339-0000-4000-8000-000000000001'
  );

-- BIE-340 · Regulación emocional: Escribe un plan: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002340'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502340-0000-4000-8000-000000000001'
  );

-- BIE-341 · Organización cotidiana: Haz tengas pendiente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002341'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502341-0000-4000-8000-000000000001'
  );

-- BIE-342 · Comer con flexibilidad: Comparte una comida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002342'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502342-0000-4000-8000-000000000001'
  );

-- BIE-343 · Autonomía y límites: Escribe una discusión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002343'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502343-0000-4000-8000-000000000001'
  );

-- BIE-344 · Juego y disfrute: Elige sobre ella: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002344'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502344-0000-4000-8000-000000000001'
  );

-- BIE-345 · Bienestar digital: Guarda el teléfono: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002345'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502345-0000-4000-8000-000000000001'
  );

-- BIE-346 · Aire libre y comunidad: Elige el tiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002346'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502346-0000-4000-8000-000000000001'
  );

-- BIE-347 · Aprendizaje cotidiano: Busca parecía complicado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002347'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502347-0000-4000-8000-000000000001'
  );

-- BIE-348 · Cuidado diario: Haz de mañana: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002348'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502348-0000-4000-8000-000000000001'
  );

-- BIE-349 · Movimiento amable: Haz el otro: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002349'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502349-0000-4000-8000-000000000001'
  );

-- BIE-350 · Descanso y ritmo: Escoge qué tarea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002350'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502350-0000-4000-8000-000000000001'
  );

-- BIE-351 · Vínculos: Aclara con respeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002351'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502351-0000-4000-8000-000000000001'
  );

-- BIE-352 · Creación: Escribe una pregunta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002352'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502352-0000-4000-8000-000000000001'
  );

-- BIE-353 · Regulación emocional: Decide o energía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002353'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502353-0000-4000-8000-000000000001'
  );

-- BIE-354 · Organización cotidiana: Deja a la: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002354'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502354-0000-4000-8000-000000000001'
  );

-- BIE-355 · Comer con flexibilidad: Anota una idea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002355'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502355-0000-4000-8000-000000000001'
  );

-- BIE-356 · Autonomía y límites: Decide qué favor: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002356'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502356-0000-4000-8000-000000000001'
  );

-- BIE-357 · Juego y disfrute: Inventa una tradición: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002357'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502357-0000-4000-8000-000000000001'
  );

-- BIE-358 · Bienestar digital: Revisa una carpeta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002358'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502358-0000-4000-8000-000000000001'
  );

-- BIE-359 · Aire libre y comunidad: Busca un lugar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002359'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502359-0000-4000-8000-000000000001'
  );

-- BIE-360 · Aprendizaje cotidiano: Anota qué habilidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002360'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502360-0000-4000-8000-000000000001'
  );

-- BIE-361 · Cuidado diario: Elige cómo quieres: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002361'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502361-0000-4000-8000-000000000001'
  );

-- BIE-362 · Movimiento amable: Elige un movimiento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002362'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502362-0000-4000-8000-000000000001'
  );

-- BIE-363 · Descanso y ritmo: Cierra una pestaña: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002363'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502363-0000-4000-8000-000000000001'
  );

-- BIE-364 · Vínculos: Despídete por compromiso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002364'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502364-0000-4000-8000-000000000001'
  );

-- BIE-365 · Creación: Crea un patrón: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000002365'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e502365-0000-4000-8000-000000000001'
  );

-- EMO-01 · Rueda de emociones: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000301'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510301-0000-4000-8000-000000000001',
    '5e510301-0000-4000-8000-000000000002',
    '5e510301-0000-4000-8000-000000000003',
    '5e510301-0000-4000-8000-000000000004',
    '5e510301-0000-4000-8000-000000000005',
    '5e510301-0000-4000-8000-000000000006',
    '5e510301-0000-4000-8000-000000000007',
    '5e510301-0000-4000-8000-000000000008',
    '5e510301-0000-4000-8000-000000000009',
    '5e510301-0000-4000-8000-000000000010',
    '5e510301-0000-4000-8000-000000000011',
    '5e510301-0000-4000-8000-000000000012',
    '5e510301-0000-4000-8000-000000000013',
    '5e510301-0000-4000-8000-000000000014',
    '5e510301-0000-4000-8000-000000000015',
    '5e510301-0000-4000-8000-000000000016',
    '5e510301-0000-4000-8000-000000000017',
    '5e510301-0000-4000-8000-000000000018',
    '5e510301-0000-4000-8000-000000000019',
    '5e510301-0000-4000-8000-000000000020',
    '5e510301-0000-4000-8000-000000000021',
    '5e510301-0000-4000-8000-000000000022',
    '5e510301-0000-4000-8000-000000000023',
    '5e510301-0000-4000-8000-000000000024',
    '5e510301-0000-4000-8000-000000000025',
    '5e510301-0000-4000-8000-000000000026',
    '5e510301-0000-4000-8000-000000000027',
    '5e510301-0000-4000-8000-000000000028',
    '5e510301-0000-4000-8000-000000000029',
    '5e510301-0000-4000-8000-000000000030',
    '5e510301-0000-4000-8000-000000000031',
    '5e510301-0000-4000-8000-000000000032',
    '5e510301-0000-4000-8000-000000000033',
    '5e510301-0000-4000-8000-000000000034',
    '5e510301-0000-4000-8000-000000000035',
    '5e510301-0000-4000-8000-000000000036',
    '5e510301-0000-4000-8000-000000000037',
    '5e510301-0000-4000-8000-000000000038',
    '5e510301-0000-4000-8000-000000000039',
    '5e510301-0000-4000-8000-000000000040'
  );

-- EMO-02 · Tres cosas buenas: 37 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-00000000000c'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510302-0000-4000-8000-000000000004',
    '5e510302-0000-4000-8000-000000000005',
    '5e510302-0000-4000-8000-000000000006',
    '5e510302-0000-4000-8000-000000000007',
    '5e510302-0000-4000-8000-000000000008',
    '5e510302-0000-4000-8000-000000000009',
    '5e510302-0000-4000-8000-000000000010',
    '5e510302-0000-4000-8000-000000000011',
    '5e510302-0000-4000-8000-000000000012',
    '5e510302-0000-4000-8000-000000000013',
    '5e510302-0000-4000-8000-000000000014',
    '5e510302-0000-4000-8000-000000000015',
    '5e510302-0000-4000-8000-000000000016',
    '5e510302-0000-4000-8000-000000000017',
    '5e510302-0000-4000-8000-000000000018',
    '5e510302-0000-4000-8000-000000000019',
    '5e510302-0000-4000-8000-000000000020',
    '5e510302-0000-4000-8000-000000000021',
    '5e510302-0000-4000-8000-000000000022',
    '5e510302-0000-4000-8000-000000000023',
    '5e510302-0000-4000-8000-000000000024',
    '5e510302-0000-4000-8000-000000000025',
    '5e510302-0000-4000-8000-000000000026',
    '5e510302-0000-4000-8000-000000000027',
    '5e510302-0000-4000-8000-000000000028',
    '5e510302-0000-4000-8000-000000000029',
    '5e510302-0000-4000-8000-000000000030',
    '5e510302-0000-4000-8000-000000000031',
    '5e510302-0000-4000-8000-000000000032',
    '5e510302-0000-4000-8000-000000000033',
    '5e510302-0000-4000-8000-000000000034',
    '5e510302-0000-4000-8000-000000000035',
    '5e510302-0000-4000-8000-000000000036',
    '5e510302-0000-4000-8000-000000000037',
    '5e510302-0000-4000-8000-000000000038',
    '5e510302-0000-4000-8000-000000000039',
    '5e510302-0000-4000-8000-000000000040'
  );

-- EMO-03 · Ancla 5-4-3-2-1: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000303'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510303-0000-4000-8000-000000000001',
    '5e510303-0000-4000-8000-000000000002',
    '5e510303-0000-4000-8000-000000000003',
    '5e510303-0000-4000-8000-000000000004',
    '5e510303-0000-4000-8000-000000000005',
    '5e510303-0000-4000-8000-000000000006',
    '5e510303-0000-4000-8000-000000000007',
    '5e510303-0000-4000-8000-000000000008',
    '5e510303-0000-4000-8000-000000000009',
    '5e510303-0000-4000-8000-000000000010',
    '5e510303-0000-4000-8000-000000000011',
    '5e510303-0000-4000-8000-000000000012',
    '5e510303-0000-4000-8000-000000000013',
    '5e510303-0000-4000-8000-000000000014',
    '5e510303-0000-4000-8000-000000000015',
    '5e510303-0000-4000-8000-000000000016',
    '5e510303-0000-4000-8000-000000000017',
    '5e510303-0000-4000-8000-000000000018',
    '5e510303-0000-4000-8000-000000000019',
    '5e510303-0000-4000-8000-000000000020',
    '5e510303-0000-4000-8000-000000000021',
    '5e510303-0000-4000-8000-000000000022',
    '5e510303-0000-4000-8000-000000000023',
    '5e510303-0000-4000-8000-000000000024',
    '5e510303-0000-4000-8000-000000000025',
    '5e510303-0000-4000-8000-000000000026',
    '5e510303-0000-4000-8000-000000000027',
    '5e510303-0000-4000-8000-000000000028',
    '5e510303-0000-4000-8000-000000000029',
    '5e510303-0000-4000-8000-000000000030',
    '5e510303-0000-4000-8000-000000000031',
    '5e510303-0000-4000-8000-000000000032',
    '5e510303-0000-4000-8000-000000000033',
    '5e510303-0000-4000-8000-000000000034',
    '5e510303-0000-4000-8000-000000000035',
    '5e510303-0000-4000-8000-000000000036',
    '5e510303-0000-4000-8000-000000000037',
    '5e510303-0000-4000-8000-000000000038',
    '5e510303-0000-4000-8000-000000000039',
    '5e510303-0000-4000-8000-000000000040'
  );

-- EMO-04 · Lo que sí controlo: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000304'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510304-0000-4000-8000-000000000001',
    '5e510304-0000-4000-8000-000000000002',
    '5e510304-0000-4000-8000-000000000003',
    '5e510304-0000-4000-8000-000000000004',
    '5e510304-0000-4000-8000-000000000005',
    '5e510304-0000-4000-8000-000000000006',
    '5e510304-0000-4000-8000-000000000007',
    '5e510304-0000-4000-8000-000000000008',
    '5e510304-0000-4000-8000-000000000009',
    '5e510304-0000-4000-8000-000000000010',
    '5e510304-0000-4000-8000-000000000011',
    '5e510304-0000-4000-8000-000000000012',
    '5e510304-0000-4000-8000-000000000013',
    '5e510304-0000-4000-8000-000000000014',
    '5e510304-0000-4000-8000-000000000015',
    '5e510304-0000-4000-8000-000000000016',
    '5e510304-0000-4000-8000-000000000017',
    '5e510304-0000-4000-8000-000000000018',
    '5e510304-0000-4000-8000-000000000019',
    '5e510304-0000-4000-8000-000000000020',
    '5e510304-0000-4000-8000-000000000021',
    '5e510304-0000-4000-8000-000000000022',
    '5e510304-0000-4000-8000-000000000023',
    '5e510304-0000-4000-8000-000000000024',
    '5e510304-0000-4000-8000-000000000025',
    '5e510304-0000-4000-8000-000000000026',
    '5e510304-0000-4000-8000-000000000027',
    '5e510304-0000-4000-8000-000000000028',
    '5e510304-0000-4000-8000-000000000029',
    '5e510304-0000-4000-8000-000000000030',
    '5e510304-0000-4000-8000-000000000031',
    '5e510304-0000-4000-8000-000000000032',
    '5e510304-0000-4000-8000-000000000033',
    '5e510304-0000-4000-8000-000000000034',
    '5e510304-0000-4000-8000-000000000035',
    '5e510304-0000-4000-8000-000000000036',
    '5e510304-0000-4000-8000-000000000037',
    '5e510304-0000-4000-8000-000000000038',
    '5e510304-0000-4000-8000-000000000039',
    '5e510304-0000-4000-8000-000000000040'
  );

-- EMO-05 · Carta a mí de mañana: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000305'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510305-0000-4000-8000-000000000001',
    '5e510305-0000-4000-8000-000000000002',
    '5e510305-0000-4000-8000-000000000003',
    '5e510305-0000-4000-8000-000000000004',
    '5e510305-0000-4000-8000-000000000005',
    '5e510305-0000-4000-8000-000000000006',
    '5e510305-0000-4000-8000-000000000007',
    '5e510305-0000-4000-8000-000000000008',
    '5e510305-0000-4000-8000-000000000009',
    '5e510305-0000-4000-8000-000000000010',
    '5e510305-0000-4000-8000-000000000011',
    '5e510305-0000-4000-8000-000000000012',
    '5e510305-0000-4000-8000-000000000013',
    '5e510305-0000-4000-8000-000000000014',
    '5e510305-0000-4000-8000-000000000015',
    '5e510305-0000-4000-8000-000000000016',
    '5e510305-0000-4000-8000-000000000017',
    '5e510305-0000-4000-8000-000000000018',
    '5e510305-0000-4000-8000-000000000019',
    '5e510305-0000-4000-8000-000000000020',
    '5e510305-0000-4000-8000-000000000021',
    '5e510305-0000-4000-8000-000000000022',
    '5e510305-0000-4000-8000-000000000023',
    '5e510305-0000-4000-8000-000000000024',
    '5e510305-0000-4000-8000-000000000025',
    '5e510305-0000-4000-8000-000000000026',
    '5e510305-0000-4000-8000-000000000027',
    '5e510305-0000-4000-8000-000000000028',
    '5e510305-0000-4000-8000-000000000029',
    '5e510305-0000-4000-8000-000000000030',
    '5e510305-0000-4000-8000-000000000031',
    '5e510305-0000-4000-8000-000000000032',
    '5e510305-0000-4000-8000-000000000033',
    '5e510305-0000-4000-8000-000000000034',
    '5e510305-0000-4000-8000-000000000035',
    '5e510305-0000-4000-8000-000000000036',
    '5e510305-0000-4000-8000-000000000037',
    '5e510305-0000-4000-8000-000000000038',
    '5e510305-0000-4000-8000-000000000039',
    '5e510305-0000-4000-8000-000000000040'
  );

-- EMO-07 · Mi lugar tranquilo: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000307'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510307-0000-4000-8000-000000000001',
    '5e510307-0000-4000-8000-000000000002',
    '5e510307-0000-4000-8000-000000000003',
    '5e510307-0000-4000-8000-000000000004',
    '5e510307-0000-4000-8000-000000000005',
    '5e510307-0000-4000-8000-000000000006',
    '5e510307-0000-4000-8000-000000000007',
    '5e510307-0000-4000-8000-000000000008',
    '5e510307-0000-4000-8000-000000000009',
    '5e510307-0000-4000-8000-000000000010',
    '5e510307-0000-4000-8000-000000000011',
    '5e510307-0000-4000-8000-000000000012',
    '5e510307-0000-4000-8000-000000000013',
    '5e510307-0000-4000-8000-000000000014',
    '5e510307-0000-4000-8000-000000000015',
    '5e510307-0000-4000-8000-000000000016',
    '5e510307-0000-4000-8000-000000000017',
    '5e510307-0000-4000-8000-000000000018',
    '5e510307-0000-4000-8000-000000000019',
    '5e510307-0000-4000-8000-000000000020',
    '5e510307-0000-4000-8000-000000000021',
    '5e510307-0000-4000-8000-000000000022',
    '5e510307-0000-4000-8000-000000000023',
    '5e510307-0000-4000-8000-000000000024',
    '5e510307-0000-4000-8000-000000000025',
    '5e510307-0000-4000-8000-000000000026',
    '5e510307-0000-4000-8000-000000000027',
    '5e510307-0000-4000-8000-000000000028',
    '5e510307-0000-4000-8000-000000000029',
    '5e510307-0000-4000-8000-000000000030',
    '5e510307-0000-4000-8000-000000000031',
    '5e510307-0000-4000-8000-000000000032',
    '5e510307-0000-4000-8000-000000000033',
    '5e510307-0000-4000-8000-000000000034',
    '5e510307-0000-4000-8000-000000000035',
    '5e510307-0000-4000-8000-000000000036',
    '5e510307-0000-4000-8000-000000000037',
    '5e510307-0000-4000-8000-000000000038',
    '5e510307-0000-4000-8000-000000000039',
    '5e510307-0000-4000-8000-000000000040'
  );

-- EMO-08 · Quién me acompaña: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000308'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510308-0000-4000-8000-000000000001',
    '5e510308-0000-4000-8000-000000000002',
    '5e510308-0000-4000-8000-000000000003',
    '5e510308-0000-4000-8000-000000000004',
    '5e510308-0000-4000-8000-000000000005',
    '5e510308-0000-4000-8000-000000000006',
    '5e510308-0000-4000-8000-000000000007',
    '5e510308-0000-4000-8000-000000000008',
    '5e510308-0000-4000-8000-000000000009',
    '5e510308-0000-4000-8000-000000000010',
    '5e510308-0000-4000-8000-000000000011',
    '5e510308-0000-4000-8000-000000000012',
    '5e510308-0000-4000-8000-000000000013',
    '5e510308-0000-4000-8000-000000000014',
    '5e510308-0000-4000-8000-000000000015',
    '5e510308-0000-4000-8000-000000000016',
    '5e510308-0000-4000-8000-000000000017',
    '5e510308-0000-4000-8000-000000000018',
    '5e510308-0000-4000-8000-000000000019',
    '5e510308-0000-4000-8000-000000000020',
    '5e510308-0000-4000-8000-000000000021',
    '5e510308-0000-4000-8000-000000000022',
    '5e510308-0000-4000-8000-000000000023',
    '5e510308-0000-4000-8000-000000000024',
    '5e510308-0000-4000-8000-000000000025',
    '5e510308-0000-4000-8000-000000000026',
    '5e510308-0000-4000-8000-000000000027',
    '5e510308-0000-4000-8000-000000000028',
    '5e510308-0000-4000-8000-000000000029',
    '5e510308-0000-4000-8000-000000000030',
    '5e510308-0000-4000-8000-000000000031',
    '5e510308-0000-4000-8000-000000000032',
    '5e510308-0000-4000-8000-000000000033',
    '5e510308-0000-4000-8000-000000000034',
    '5e510308-0000-4000-8000-000000000035',
    '5e510308-0000-4000-8000-000000000036',
    '5e510308-0000-4000-8000-000000000037',
    '5e510308-0000-4000-8000-000000000038',
    '5e510308-0000-4000-8000-000000000039',
    '5e510308-0000-4000-8000-000000000040'
  );

-- EMO-09 · El cierre del día: 40 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000309'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510309-0000-4000-8000-000000000001',
    '5e510309-0000-4000-8000-000000000002',
    '5e510309-0000-4000-8000-000000000003',
    '5e510309-0000-4000-8000-000000000004',
    '5e510309-0000-4000-8000-000000000005',
    '5e510309-0000-4000-8000-000000000006',
    '5e510309-0000-4000-8000-000000000007',
    '5e510309-0000-4000-8000-000000000008',
    '5e510309-0000-4000-8000-000000000009',
    '5e510309-0000-4000-8000-000000000010',
    '5e510309-0000-4000-8000-000000000011',
    '5e510309-0000-4000-8000-000000000012',
    '5e510309-0000-4000-8000-000000000013',
    '5e510309-0000-4000-8000-000000000014',
    '5e510309-0000-4000-8000-000000000015',
    '5e510309-0000-4000-8000-000000000016',
    '5e510309-0000-4000-8000-000000000017',
    '5e510309-0000-4000-8000-000000000018',
    '5e510309-0000-4000-8000-000000000019',
    '5e510309-0000-4000-8000-000000000020',
    '5e510309-0000-4000-8000-000000000021',
    '5e510309-0000-4000-8000-000000000022',
    '5e510309-0000-4000-8000-000000000023',
    '5e510309-0000-4000-8000-000000000024',
    '5e510309-0000-4000-8000-000000000025',
    '5e510309-0000-4000-8000-000000000026',
    '5e510309-0000-4000-8000-000000000027',
    '5e510309-0000-4000-8000-000000000028',
    '5e510309-0000-4000-8000-000000000029',
    '5e510309-0000-4000-8000-000000000030',
    '5e510309-0000-4000-8000-000000000031',
    '5e510309-0000-4000-8000-000000000032',
    '5e510309-0000-4000-8000-000000000033',
    '5e510309-0000-4000-8000-000000000034',
    '5e510309-0000-4000-8000-000000000035',
    '5e510309-0000-4000-8000-000000000036',
    '5e510309-0000-4000-8000-000000000037',
    '5e510309-0000-4000-8000-000000000038',
    '5e510309-0000-4000-8000-000000000039',
    '5e510309-0000-4000-8000-000000000040'
  );

-- EMO-10 · Matices del ánimo: El color del momento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000310'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510310-0000-4000-8000-000000000001'
  );

-- EMO-11 · Matices del ánimo: Una palabra más precisa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000311'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510311-0000-4000-8000-000000000001'
  );

-- EMO-12 · Matices del ánimo: Entre dos nombres: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000312'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510312-0000-4000-8000-000000000001'
  );

-- EMO-13 · Matices del ánimo: Lo que no sé nombrar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000313'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510313-0000-4000-8000-000000000001'
  );

-- EMO-14 · Matices del ánimo: Un matiz inesperado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000314'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510314-0000-4000-8000-000000000001'
  );

-- EMO-15 · Matices del ánimo: La emoción de fondo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000315'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510315-0000-4000-8000-000000000001'
  );

-- EMO-16 · Matices del ánimo: La emoción más visible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000316'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510316-0000-4000-8000-000000000001'
  );

-- EMO-17 · Matices del ánimo: Una mezcla posible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000317'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510317-0000-4000-8000-000000000001'
  );

-- EMO-18 · Matices del ánimo: Cerca de la calma: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000318'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510318-0000-4000-8000-000000000001'
  );

-- EMO-19 · Matices del ánimo: Cerca de la curiosidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000319'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510319-0000-4000-8000-000000000001'
  );

-- EMO-20 · Matices del ánimo: La emoción pequeña: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000320'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510320-0000-4000-8000-000000000001'
  );

-- EMO-21 · Matices del ánimo: Una emoción amplia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000321'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510321-0000-4000-8000-000000000001'
  );

-- EMO-22 · Matices del ánimo: La palabra de hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000322'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510322-0000-4000-8000-000000000001'
  );

-- EMO-23 · Matices del ánimo: Un matiz corporal: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000323'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510323-0000-4000-8000-000000000001'
  );

-- EMO-24 · Matices del ánimo: La emoción que cambia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000324'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510324-0000-4000-8000-000000000001'
  );

-- EMO-25 · Matices del ánimo: Una emoción neutral: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000325'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510325-0000-4000-8000-000000000001'
  );

-- EMO-26 · Matices del ánimo: El matiz difícil: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000326'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510326-0000-4000-8000-000000000001'
  );

-- EMO-27 · Matices del ánimo: La emoción de una escena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000327'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510327-0000-4000-8000-000000000001'
  );

-- EMO-28 · Matices del ánimo: Un nombre prestado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000328'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510328-0000-4000-8000-000000000001'
  );

-- EMO-29 · Matices del ánimo: Emoción sin explicación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000329'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510329-0000-4000-8000-000000000001'
  );

-- EMO-30 · Matices del ánimo: La palabra que falta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000330'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510330-0000-4000-8000-000000000001'
  );

-- EMO-31 · Matices del ánimo: Dos emociones a la vez: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000331'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510331-0000-4000-8000-000000000001'
  );

-- EMO-32 · Matices del ánimo: El matiz que acompaña: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000332'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510332-0000-4000-8000-000000000001'
  );

-- EMO-33 · Matices del ánimo: Emoción y energía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000333'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510333-0000-4000-8000-000000000001'
  );

-- EMO-34 · Matices del ánimo: Lo que sí aparece: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000334'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510334-0000-4000-8000-000000000001'
  );

-- EMO-35 · Matices del ánimo: Un matiz de alivio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000335'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510335-0000-4000-8000-000000000001'
  );

-- EMO-36 · Matices del ánimo: Una emoción sin etiqueta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000336'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510336-0000-4000-8000-000000000001'
  );

-- EMO-37 · Matices del ánimo: El matiz de una pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000337'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510337-0000-4000-8000-000000000001'
  );

-- EMO-38 · Matices del ánimo: La emoción que se mueve: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000338'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510338-0000-4000-8000-000000000001'
  );

-- EMO-39 · Matices del ánimo: Un cierre con nombre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000339'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510339-0000-4000-8000-000000000001'
  );

-- EMO-40 · Señales que noto: Mapa de señales: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000340'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510340-0000-4000-8000-000000000001'
  );

-- EMO-41 · Señales que noto: Ritmo interior: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000341'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510341-0000-4000-8000-000000000001'
  );

-- EMO-42 · Señales que noto: El primer aviso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000342'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510342-0000-4000-8000-000000000001'
  );

-- EMO-43 · Señales que noto: Señal de descanso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000343'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510343-0000-4000-8000-000000000001'
  );

-- EMO-44 · Señales que noto: Señal de interés: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000344'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510344-0000-4000-8000-000000000001'
  );

-- EMO-45 · Señales que noto: Señal de incomodidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000345'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510345-0000-4000-8000-000000000001'
  );

-- EMO-46 · Señales que noto: Señal de conexión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000346'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510346-0000-4000-8000-000000000001'
  );

-- EMO-47 · Señales que noto: Señal de distancia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000347'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510347-0000-4000-8000-000000000001'
  );

-- EMO-48 · Señales que noto: Un cambio de energía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000348'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510348-0000-4000-8000-000000000001'
  );

-- EMO-49 · Señales que noto: La señal de curiosidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000349'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510349-0000-4000-8000-000000000001'
  );

-- EMO-50 · Señales que noto: Tono de voz propio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000350'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510350-0000-4000-8000-000000000001'
  );

-- EMO-51 · Señales que noto: La postura del momento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000351'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510351-0000-4000-8000-000000000001'
  );

-- EMO-52 · Señales que noto: Lo que pide atención: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000352'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510352-0000-4000-8000-000000000001'
  );

-- EMO-53 · Señales que noto: Señal de incertidumbre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000353'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510353-0000-4000-8000-000000000001'
  );

-- EMO-54 · Señales que noto: Señal de entusiasmo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000354'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510354-0000-4000-8000-000000000001'
  );

-- EMO-55 · Señales que noto: Señal de fastidio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000355'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510355-0000-4000-8000-000000000001'
  );

-- EMO-56 · Señales que noto: La señal de alivio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000356'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510356-0000-4000-8000-000000000001'
  );

-- EMO-57 · Señales que noto: Señal de saturación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000357'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510357-0000-4000-8000-000000000001'
  );

-- EMO-58 · Señales que noto: Un momento de quietud: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000358'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510358-0000-4000-8000-000000000001'
  );

-- EMO-59 · Señales que noto: Señal de confianza: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000359'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510359-0000-4000-8000-000000000001'
  );

-- EMO-60 · Señales que noto: Señal de duda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000360'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510360-0000-4000-8000-000000000001'
  );

-- EMO-61 · Señales que noto: Señal de cansancio emocional: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000361'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510361-0000-4000-8000-000000000001'
  );

-- EMO-62 · Señales que noto: Señal de alegría tranquila: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000362'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510362-0000-4000-8000-000000000001'
  );

-- EMO-63 · Señales que noto: Señal de necesidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000363'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510363-0000-4000-8000-000000000001'
  );

-- EMO-64 · Señales que noto: Señal de pausa social: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000364'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510364-0000-4000-8000-000000000001'
  );

-- EMO-65 · Señales que noto: La emoción en las manos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000365'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510365-0000-4000-8000-000000000001'
  );

-- EMO-66 · Señales que noto: La emoción en el rostro: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000366'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510366-0000-4000-8000-000000000001'
  );

-- EMO-67 · Señales que noto: Una señal de seguridad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000367'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510367-0000-4000-8000-000000000001'
  );

-- EMO-68 · Señales que noto: Señal de cambio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000368'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510368-0000-4000-8000-000000000001'
  );

-- EMO-69 · Señales que noto: Lo que prefiero no notar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000369'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510369-0000-4000-8000-000000000001'
  );

-- EMO-70 · Escenas cotidianas: Un mensaje sin respuesta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000370'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510370-0000-4000-8000-000000000001'
  );

-- EMO-71 · Escenas cotidianas: Un plan que cambia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000371'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510371-0000-4000-8000-000000000001'
  );

-- EMO-72 · Escenas cotidianas: Una invitación inesperada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000372'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510372-0000-4000-8000-000000000001'
  );

-- EMO-73 · Escenas cotidianas: Una tarea terminada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000373'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510373-0000-4000-8000-000000000001'
  );

-- EMO-74 · Escenas cotidianas: Un elogio en público: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000374'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510374-0000-4000-8000-000000000001'
  );

-- EMO-75 · Escenas cotidianas: Una espera larga: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000375'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510375-0000-4000-8000-000000000001'
  );

-- EMO-76 · Escenas cotidianas: La charla por empezar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000376'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510376-0000-4000-8000-000000000001'
  );

-- EMO-77 · Escenas cotidianas: Una noticia ambigua: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000377'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510377-0000-4000-8000-000000000001'
  );

-- EMO-78 · Escenas cotidianas: Un día con poco ruido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000378'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510378-0000-4000-8000-000000000001'
  );

-- EMO-79 · Escenas cotidianas: Una despedida breve: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000379'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510379-0000-4000-8000-000000000001'
  );

-- EMO-80 · Escenas cotidianas: Una meta compartida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000380'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510380-0000-4000-8000-000000000001'
  );

-- EMO-81 · Escenas cotidianas: Un error pequeño: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000381'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510381-0000-4000-8000-000000000001'
  );

-- EMO-82 · Escenas cotidianas: Una visita sorpresa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000382'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510382-0000-4000-8000-000000000001'
  );

-- EMO-83 · Escenas cotidianas: Un recuerdo que aparece: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000383'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510383-0000-4000-8000-000000000001'
  );

-- EMO-84 · Escenas cotidianas: Una decisión aplazada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000384'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510384-0000-4000-8000-000000000001'
  );

-- EMO-85 · Escenas cotidianas: Un lugar conocido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000385'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510385-0000-4000-8000-000000000001'
  );

-- EMO-86 · Escenas cotidianas: Un favor que cuesta pedir: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000386'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510386-0000-4000-8000-000000000001'
  );

-- EMO-87 · Escenas cotidianas: Una opinión diferente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000387'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510387-0000-4000-8000-000000000001'
  );

-- EMO-88 · Escenas cotidianas: Una pausa en el trabajo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000388'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510388-0000-4000-8000-000000000001'
  );

-- EMO-89 · Escenas cotidianas: Una despedida de un objeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000389'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510389-0000-4000-8000-000000000001'
  );

-- EMO-90 · Escenas cotidianas: Una puerta que se abre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000390'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510390-0000-4000-8000-000000000001'
  );

-- EMO-91 · Escenas cotidianas: Un logro ajeno: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000391'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510391-0000-4000-8000-000000000001'
  );

-- EMO-92 · Escenas cotidianas: Una pregunta difícil: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000392'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510392-0000-4000-8000-000000000001'
  );

-- EMO-93 · Escenas cotidianas: Una tarde sin planes: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000393'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510393-0000-4000-8000-000000000001'
  );

-- EMO-94 · Escenas cotidianas: Un cambio de horario: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000394'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510394-0000-4000-8000-000000000001'
  );

-- EMO-95 · Escenas cotidianas: Una conversación que termina: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000395'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510395-0000-4000-8000-000000000001'
  );

-- EMO-96 · Escenas cotidianas: Una sorpresa agradable: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000396'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510396-0000-4000-8000-000000000001'
  );

-- EMO-97 · Escenas cotidianas: Una opinión propia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000397'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510397-0000-4000-8000-000000000001'
  );

-- EMO-98 · Escenas cotidianas: Un objeto perdido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000398'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510398-0000-4000-8000-000000000001'
  );

-- EMO-99 · Escenas cotidianas: Un primer intento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000399'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e510399-0000-4000-8000-000000000001'
  );

-- EMO-100 · Palabras propias: Una frase para el ánimo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003100'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503100-0000-4000-8000-000000000001'
  );

-- EMO-101 · Palabras propias: Lo que me gustaría decir: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003101'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503101-0000-4000-8000-000000000001'
  );

-- EMO-102 · Palabras propias: Un nombre provisional: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003102'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503102-0000-4000-8000-000000000001'
  );

-- EMO-103 · Palabras propias: La emoción como clima: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003103'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503103-0000-4000-8000-000000000001'
  );

-- EMO-104 · Palabras propias: Un color sin significado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003104'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503104-0000-4000-8000-000000000001'
  );

-- EMO-105 · Palabras propias: Una nota sin destinatario: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003105'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503105-0000-4000-8000-000000000001'
  );

-- EMO-106 · Palabras propias: Una pregunta amable: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003106'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503106-0000-4000-8000-000000000001'
  );

-- EMO-107 · Palabras propias: Un título para hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003107'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503107-0000-4000-8000-000000000001'
  );

-- EMO-108 · Palabras propias: Lo que no voy a resolver: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003108'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503108-0000-4000-8000-000000000001'
  );

-- EMO-109 · Palabras propias: La palabra más cercana: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003109'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503109-0000-4000-8000-000000000001'
  );

-- EMO-110 · Palabras propias: Una frase de permiso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003110'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503110-0000-4000-8000-000000000001'
  );

-- EMO-111 · Palabras propias: Un borde claro: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003111'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503111-0000-4000-8000-000000000001'
  );

-- EMO-112 · Palabras propias: Una emoción en tres palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003112'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503112-0000-4000-8000-000000000001'
  );

-- EMO-113 · Palabras propias: Una respuesta que espero: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003113'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503113-0000-4000-8000-000000000001'
  );

-- EMO-114 · Palabras propias: Lo que quiero conservar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003114'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503114-0000-4000-8000-000000000001'
  );

-- EMO-115 · Palabras propias: Una frase para una pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003115'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503115-0000-4000-8000-000000000001'
  );

-- EMO-116 · Palabras propias: Algo que cambió: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003116'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503116-0000-4000-8000-000000000001'
  );

-- EMO-117 · Palabras propias: Algo que sigue igual: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003117'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503117-0000-4000-8000-000000000001'
  );

-- EMO-118 · Palabras propias: La emoción y su volumen: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003118'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503118-0000-4000-8000-000000000001'
  );

-- EMO-119 · Palabras propias: Un mensaje sin enviar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003119'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503119-0000-4000-8000-000000000001'
  );

-- EMO-120 · Palabras propias: La parte que necesita tiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003120'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503120-0000-4000-8000-000000000001'
  );

-- EMO-121 · Palabras propias: Lo que me gustaría preguntar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003121'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503121-0000-4000-8000-000000000001'
  );

-- EMO-122 · Palabras propias: Una descripción sencilla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003122'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503122-0000-4000-8000-000000000001'
  );

-- EMO-123 · Palabras propias: Una idea que puedo pausar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003123'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503123-0000-4000-8000-000000000001'
  );

-- EMO-124 · Palabras propias: Mi espacio de hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003124'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503124-0000-4000-8000-000000000001'
  );

-- EMO-125 · Palabras propias: El recuerdo sin juicio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003125'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503125-0000-4000-8000-000000000001'
  );

-- EMO-126 · Palabras propias: Una palabra que aprendí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003126'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503126-0000-4000-8000-000000000001'
  );

-- EMO-127 · Palabras propias: Una línea para mañana: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003127'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503127-0000-4000-8000-000000000001'
  );

-- EMO-128 · Palabras propias: El final de esta frase: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003128'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503128-0000-4000-8000-000000000001'
  );

-- EMO-129 · Palabras propias: Una nota para mí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003129'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503129-0000-4000-8000-000000000001'
  );

-- EMO-130 · Necesidades y preferencias: Necesito espacio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003130'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503130-0000-4000-8000-000000000001'
  );

-- EMO-131 · Necesidades y preferencias: Necesito claridad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003131'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503131-0000-4000-8000-000000000001'
  );

-- EMO-132 · Necesidades y preferencias: Una preferencia pequeña: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003132'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503132-0000-4000-8000-000000000001'
  );

-- EMO-133 · Necesidades y preferencias: Lo que puede esperar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003133'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503133-0000-4000-8000-000000000001'
  );

-- EMO-134 · Necesidades y preferencias: Necesito compañía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003134'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503134-0000-4000-8000-000000000001'
  );

-- EMO-135 · Necesidades y preferencias: Un ritmo posible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003135'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503135-0000-4000-8000-000000000001'
  );

-- EMO-136 · Necesidades y preferencias: Necesito información: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003136'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503136-0000-4000-8000-000000000001'
  );

-- EMO-137 · Necesidades y preferencias: Una opción más cómoda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003137'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503137-0000-4000-8000-000000000001'
  );

-- EMO-138 · Necesidades y preferencias: Pedir una pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003138'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503138-0000-4000-8000-000000000001'
  );

-- EMO-139 · Necesidades y preferencias: Lo que quiero cuidar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003139'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503139-0000-4000-8000-000000000001'
  );

-- EMO-140 · Necesidades y preferencias: Necesito silencio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003140'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503140-0000-4000-8000-000000000001'
  );

-- EMO-141 · Necesidades y preferencias: Una decisión sin prisa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003141'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503141-0000-4000-8000-000000000001'
  );

-- EMO-142 · Necesidades y preferencias: Puedo elegir el cómo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003142'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503142-0000-4000-8000-000000000001'
  );

-- EMO-143 · Necesidades y preferencias: Una ayuda concreta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003143'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503143-0000-4000-8000-000000000001'
  );

-- EMO-144 · Necesidades y preferencias: Necesito un límite: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003144'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503144-0000-4000-8000-000000000001'
  );

-- EMO-145 · Necesidades y preferencias: Elijo no responder: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003145'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503145-0000-4000-8000-000000000001'
  );

-- EMO-146 · Necesidades y preferencias: La compañía adecuada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003146'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503146-0000-4000-8000-000000000001'
  );

-- EMO-147 · Necesidades y preferencias: Una actividad que sí quiero: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003147'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503147-0000-4000-8000-000000000001'
  );

-- EMO-148 · Necesidades y preferencias: Necesito menos opciones: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003148'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503148-0000-4000-8000-000000000001'
  );

-- EMO-149 · Necesidades y preferencias: Necesito más tiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003149'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503149-0000-4000-8000-000000000001'
  );

-- EMO-150 · Necesidades y preferencias: Mi forma de participar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003150'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503150-0000-4000-8000-000000000001'
  );

-- EMO-151 · Necesidades y preferencias: Una necesidad sin culpa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003151'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503151-0000-4000-8000-000000000001'
  );

-- EMO-152 · Necesidades y preferencias: Lo que sí puedo cambiar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003152'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503152-0000-4000-8000-000000000001'
  );

-- EMO-153 · Necesidades y preferencias: Una expectativa propia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003153'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503153-0000-4000-8000-000000000001'
  );

-- EMO-154 · Necesidades y preferencias: El tipo de apoyo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003154'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503154-0000-4000-8000-000000000001'
  );

-- EMO-155 · Necesidades y preferencias: Un acuerdo conmigo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003155'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503155-0000-4000-8000-000000000001'
  );

-- EMO-156 · Necesidades y preferencias: Lo que me resulta suficiente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003156'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503156-0000-4000-8000-000000000001'
  );

-- EMO-157 · Necesidades y preferencias: Elegir con el cuerpo cómodo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003157'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503157-0000-4000-8000-000000000001'
  );

-- EMO-158 · Necesidades y preferencias: Un «no» posible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003158'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503158-0000-4000-8000-000000000001'
  );

-- EMO-159 · Necesidades y preferencias: Un «sí» propio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003159'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503159-0000-4000-8000-000000000001'
  );

-- EMO-160 · Vínculos y comunicación: Escucha sin arreglar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003160'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503160-0000-4000-8000-000000000001'
  );

-- EMO-161 · Vínculos y comunicación: Agradecer a mi manera: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003161'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503161-0000-4000-8000-000000000001'
  );

-- EMO-162 · Vínculos y comunicación: Una llamada de reencuentro: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003162'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503162-0000-4000-8000-000000000001'
  );

-- EMO-163 · Vínculos y comunicación: Pedir que me escuchen: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003163'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503163-0000-4000-8000-000000000001'
  );

-- EMO-164 · Vínculos y comunicación: Compartir una buena noticia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003164'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503164-0000-4000-8000-000000000001'
  );

-- EMO-165 · Vínculos y comunicación: Reparar un malentendido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003165'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503165-0000-4000-8000-000000000001'
  );

-- EMO-166 · Vínculos y comunicación: Una charla con pausas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003166'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503166-0000-4000-8000-000000000001'
  );

-- EMO-167 · Vínculos y comunicación: Reconocer el esfuerzo ajeno: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003167'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503167-0000-4000-8000-000000000001'
  );

-- EMO-168 · Vínculos y comunicación: Un saludo que me representa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003168'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503168-0000-4000-8000-000000000001'
  );

-- EMO-169 · Vínculos y comunicación: Hacer una pregunta abierta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003169'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503169-0000-4000-8000-000000000001'
  );

-- EMO-170 · Vínculos y comunicación: Compartir silencio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003170'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503170-0000-4000-8000-000000000001'
  );

-- EMO-171 · Vínculos y comunicación: Responder más tarde: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003171'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503171-0000-4000-8000-000000000001'
  );

-- EMO-172 · Vínculos y comunicación: Decir que no entendí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003172'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503172-0000-4000-8000-000000000001'
  );

-- EMO-173 · Vínculos y comunicación: Celebrar sin comparar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003173'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503173-0000-4000-8000-000000000001'
  );

-- EMO-174 · Vínculos y comunicación: Cuidar una confidencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003174'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503174-0000-4000-8000-000000000001'
  );

-- EMO-175 · Vínculos y comunicación: Aclarar una preferencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003175'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503175-0000-4000-8000-000000000001'
  );

-- EMO-176 · Vínculos y comunicación: Recibir un cumplido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003176'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503176-0000-4000-8000-000000000001'
  );

-- EMO-177 · Vínculos y comunicación: Un contacto que me hace bien: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003177'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503177-0000-4000-8000-000000000001'
  );

-- EMO-178 · Vínculos y comunicación: Poner fin a una charla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003178'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503178-0000-4000-8000-000000000001'
  );

-- EMO-179 · Vínculos y comunicación: Escuchar otra experiencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003179'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503179-0000-4000-8000-000000000001'
  );

-- EMO-180 · Vínculos y comunicación: Pedir una aclaración: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003180'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503180-0000-4000-8000-000000000001'
  );

-- EMO-181 · Vínculos y comunicación: Expresar desacuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003181'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503181-0000-4000-8000-000000000001'
  );

-- EMO-182 · Vínculos y comunicación: Aceptar una invitación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003182'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503182-0000-4000-8000-000000000001'
  );

-- EMO-183 · Vínculos y comunicación: Rechazar un plan: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003183'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503183-0000-4000-8000-000000000001'
  );

-- EMO-184 · Vínculos y comunicación: Un mensaje de apoyo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003184'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503184-0000-4000-8000-000000000001'
  );

-- EMO-185 · Vínculos y comunicación: Pedir ayuda concreta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003185'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503185-0000-4000-8000-000000000001'
  );

-- EMO-186 · Vínculos y comunicación: Hablar desde mí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003186'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503186-0000-4000-8000-000000000001'
  );

-- EMO-187 · Vínculos y comunicación: Dar espacio a otra voz: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003187'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503187-0000-4000-8000-000000000001'
  );

-- EMO-188 · Vínculos y comunicación: Cuidar mi intimidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003188'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503188-0000-4000-8000-000000000001'
  );

-- EMO-189 · Vínculos y comunicación: Reconectar sin obligación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003189'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503189-0000-4000-8000-000000000001'
  );

-- EMO-190 · Límites y decisiones: El límite del horario: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003190'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503190-0000-4000-8000-000000000001'
  );

-- EMO-191 · Límites y decisiones: Una tarea compartida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003191'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503191-0000-4000-8000-000000000001'
  );

-- EMO-192 · Límites y decisiones: Una pregunta personal: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003192'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503192-0000-4000-8000-000000000001'
  );

-- EMO-193 · Límites y decisiones: El espacio físico: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003193'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503193-0000-4000-8000-000000000001'
  );

-- EMO-194 · Límites y decisiones: Cambiar de opinión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003194'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503194-0000-4000-8000-000000000001'
  );

-- EMO-195 · Límites y decisiones: Una petición incómoda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003195'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503195-0000-4000-8000-000000000001'
  );

-- EMO-196 · Límites y decisiones: El tiempo propio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003196'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503196-0000-4000-8000-000000000001'
  );

-- EMO-197 · Límites y decisiones: Un límite digital: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003197'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503197-0000-4000-8000-000000000001'
  );

-- EMO-198 · Límites y decisiones: Un tema que pauso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003198'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503198-0000-4000-8000-000000000001'
  );

-- EMO-199 · Límites y decisiones: Decir «hasta aquí»: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003199'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503199-0000-4000-8000-000000000001'
  );

-- EMO-200 · Límites y decisiones: No decidir por presión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003200'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503200-0000-4000-8000-000000000001'
  );

-- EMO-201 · Límites y decisiones: Una decisión compartida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003201'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503201-0000-4000-8000-000000000001'
  );

-- EMO-202 · Límites y decisiones: Mi espacio de trabajo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003202'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503202-0000-4000-8000-000000000001'
  );

-- EMO-203 · Límites y decisiones: Una expectativa ajena: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003203'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503203-0000-4000-8000-000000000001'
  );

-- EMO-204 · Límites y decisiones: El límite de una broma: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003204'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503204-0000-4000-8000-000000000001'
  );

-- EMO-205 · Límites y decisiones: Un favor posible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003205'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503205-0000-4000-8000-000000000001'
  );

-- EMO-206 · Límites y decisiones: Cuidar una conversación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003206'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503206-0000-4000-8000-000000000001'
  );

-- EMO-207 · Límites y decisiones: Elegir lo que cuento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003207'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503207-0000-4000-8000-000000000001'
  );

-- EMO-208 · Límites y decisiones: Mi respuesta auténtica: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003208'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503208-0000-4000-8000-000000000001'
  );

-- EMO-209 · Límites y decisiones: Un cambio de plan: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003209'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503209-0000-4000-8000-000000000001'
  );

-- EMO-210 · Límites y decisiones: Una pausa antes del sí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003210'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503210-0000-4000-8000-000000000001'
  );

-- EMO-211 · Límites y decisiones: Un límite con amabilidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003211'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503211-0000-4000-8000-000000000001'
  );

-- EMO-212 · Límites y decisiones: Una tarea que no me toca: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003212'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503212-0000-4000-8000-000000000001'
  );

-- EMO-213 · Límites y decisiones: El momento de retirarme: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003213'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503213-0000-4000-8000-000000000001'
  );

-- EMO-214 · Límites y decisiones: Un acuerdo que revisar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003214'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503214-0000-4000-8000-000000000001'
  );

-- EMO-215 · Límites y decisiones: Lo que acepto hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003215'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503215-0000-4000-8000-000000000001'
  );

-- EMO-216 · Límites y decisiones: El límite del consejo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003216'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503216-0000-4000-8000-000000000001'
  );

-- EMO-217 · Límites y decisiones: La puerta entreabierta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003217'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503217-0000-4000-8000-000000000001'
  );

-- EMO-218 · Límites y decisiones: Un espacio para pensar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003218'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503218-0000-4000-8000-000000000001'
  );

-- EMO-219 · Límites y decisiones: Mi decisión pequeña: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003219'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503219-0000-4000-8000-000000000001'
  );

-- EMO-220 · Emociones mezcladas: Dos cosas verdaderas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003220'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503220-0000-4000-8000-000000000001'
  );

-- EMO-221 · Emociones mezcladas: Agridulce: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003221'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503221-0000-4000-8000-000000000001'
  );

-- EMO-222 · Emociones mezcladas: Querer y dudar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003222'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503222-0000-4000-8000-000000000001'
  );

-- EMO-223 · Emociones mezcladas: Alivio con cansancio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003223'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503223-0000-4000-8000-000000000001'
  );

-- EMO-224 · Emociones mezcladas: Alegría con nervios: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003224'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503224-0000-4000-8000-000000000001'
  );

-- EMO-225 · Emociones mezcladas: Cariño y distancia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003225'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503225-0000-4000-8000-000000000001'
  );

-- EMO-226 · Emociones mezcladas: Nostalgia y presente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003226'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503226-0000-4000-8000-000000000001'
  );

-- EMO-227 · Emociones mezcladas: Orgullo y humildad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003227'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503227-0000-4000-8000-000000000001'
  );

-- EMO-228 · Emociones mezcladas: Tranquilidad e incertidumbre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003228'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503228-0000-4000-8000-000000000001'
  );

-- EMO-229 · Emociones mezcladas: Curiosidad con cautela: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003229'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503229-0000-4000-8000-000000000001'
  );

-- EMO-230 · Emociones mezcladas: Fastidio y cuidado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003230'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503230-0000-4000-8000-000000000001'
  );

-- EMO-231 · Emociones mezcladas: Pena y compañía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003231'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503231-0000-4000-8000-000000000001'
  );

-- EMO-232 · Emociones mezcladas: Confianza con preguntas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003232'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503232-0000-4000-8000-000000000001'
  );

-- EMO-233 · Emociones mezcladas: Emoción sin conclusión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003233'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503233-0000-4000-8000-000000000001'
  );

-- EMO-234 · Emociones mezcladas: Un sí y un no: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003234'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503234-0000-4000-8000-000000000001'
  );

-- EMO-235 · Emociones mezcladas: Recuerdo que cambia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003235'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503235-0000-4000-8000-000000000001'
  );

-- EMO-236 · Emociones mezcladas: Esperanza con paciencia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003236'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503236-0000-4000-8000-000000000001'
  );

-- EMO-237 · Emociones mezcladas: Duda con interés: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003237'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503237-0000-4000-8000-000000000001'
  );

-- EMO-238 · Emociones mezcladas: Energía irregular: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003238'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503238-0000-4000-8000-000000000001'
  );

-- EMO-239 · Emociones mezcladas: Una mezcla sin nombre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003239'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503239-0000-4000-8000-000000000001'
  );

-- EMO-240 · Emociones mezcladas: Risa y preocupación: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003240'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503240-0000-4000-8000-000000000001'
  );

-- EMO-241 · Emociones mezcladas: Despedida y comienzo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003241'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503241-0000-4000-8000-000000000001'
  );

-- EMO-242 · Emociones mezcladas: Deseo y realidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003242'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503242-0000-4000-8000-000000000001'
  );

-- EMO-243 · Emociones mezcladas: Satisfacción con cansancio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003243'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503243-0000-4000-8000-000000000001'
  );

-- EMO-244 · Emociones mezcladas: Confusión con una pista: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003244'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503244-0000-4000-8000-000000000001'
  );

-- EMO-245 · Emociones mezcladas: Entusiasmo y pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003245'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503245-0000-4000-8000-000000000001'
  );

-- EMO-246 · Emociones mezcladas: Afecto y desacuerdo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003246'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503246-0000-4000-8000-000000000001'
  );

-- EMO-247 · Emociones mezcladas: Cambio y familiaridad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003247'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503247-0000-4000-8000-000000000001'
  );

-- EMO-248 · Emociones mezcladas: Lo que convive hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003248'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503248-0000-4000-8000-000000000001'
  );

-- EMO-249 · Emociones mezcladas: Un final abierto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003249'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503249-0000-4000-8000-000000000001'
  );

-- EMO-250 · Expresión creativa: Un paisaje interior: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003250'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503250-0000-4000-8000-000000000001'
  );

-- EMO-251 · Expresión creativa: La paleta del momento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003251'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503251-0000-4000-8000-000000000001'
  );

-- EMO-252 · Expresión creativa: Una forma para la emoción: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003252'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503252-0000-4000-8000-000000000001'
  );

-- EMO-253 · Expresión creativa: Ritmo emocional: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003253'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503253-0000-4000-8000-000000000001'
  );

-- EMO-254 · Expresión creativa: Una canción sin letra: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003254'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503254-0000-4000-8000-000000000001'
  );

-- EMO-255 · Expresión creativa: Objeto imaginario: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003255'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503255-0000-4000-8000-000000000001'
  );

-- EMO-256 · Expresión creativa: Un personaje de hoy: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003256'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503256-0000-4000-8000-000000000001'
  );

-- EMO-257 · Expresión creativa: La forma de una pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003257'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503257-0000-4000-8000-000000000001'
  );

-- EMO-258 · Expresión creativa: Un símbolo personal: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003258'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503258-0000-4000-8000-000000000001'
  );

-- EMO-259 · Expresión creativa: Una viñeta sin palabras: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003259'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503259-0000-4000-8000-000000000001'
  );

-- EMO-260 · Expresión creativa: Un mapa de colores: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003260'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503260-0000-4000-8000-000000000001'
  );

-- EMO-261 · Expresión creativa: La emoción como sonido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003261'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503261-0000-4000-8000-000000000001'
  );

-- EMO-262 · Expresión creativa: Un título de película: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003262'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503262-0000-4000-8000-000000000001'
  );

-- EMO-263 · Expresión creativa: Un objeto compañero: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003263'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503263-0000-4000-8000-000000000001'
  );

-- EMO-264 · Expresión creativa: El clima en tres formas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003264'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503264-0000-4000-8000-000000000001'
  );

-- EMO-265 · Expresión creativa: Un movimiento de lápiz: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003265'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503265-0000-4000-8000-000000000001'
  );

-- EMO-266 · Expresión creativa: Una escena con distancia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003266'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503266-0000-4000-8000-000000000001'
  );

-- EMO-267 · Expresión creativa: Una metáfora propia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003267'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503267-0000-4000-8000-000000000001'
  );

-- EMO-268 · Expresión creativa: Un color que falta: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003268'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503268-0000-4000-8000-000000000001'
  );

-- EMO-269 · Expresión creativa: Un ritmo con las manos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003269'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503269-0000-4000-8000-000000000001'
  );

-- EMO-270 · Expresión creativa: La emoción en una postal: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003270'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503270-0000-4000-8000-000000000001'
  );

-- EMO-271 · Expresión creativa: Un collage de sensaciones: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003271'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503271-0000-4000-8000-000000000001'
  );

-- EMO-272 · Expresión creativa: El nombre de una nube: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003272'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503272-0000-4000-8000-000000000001'
  );

-- EMO-273 · Expresión creativa: Una escena en pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003273'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503273-0000-4000-8000-000000000001'
  );

-- EMO-274 · Expresión creativa: Un gesto de personaje: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003274'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503274-0000-4000-8000-000000000001'
  );

-- EMO-275 · Expresión creativa: Una emoción con forma: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003275'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503275-0000-4000-8000-000000000001'
  );

-- EMO-276 · Expresión creativa: Una palabra dibujada: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003276'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503276-0000-4000-8000-000000000001'
  );

-- EMO-277 · Expresión creativa: Una caja imaginaria: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003277'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503277-0000-4000-8000-000000000001'
  );

-- EMO-278 · Expresión creativa: Una escena de dos colores: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003278'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503278-0000-4000-8000-000000000001'
  );

-- EMO-279 · Expresión creativa: El final que elijo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003279'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503279-0000-4000-8000-000000000001'
  );

-- EMO-280 · Pausa y presencia: Ventana de sonidos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003280'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503280-0000-4000-8000-000000000001'
  );

-- EMO-281 · Pausa y presencia: Texturas a mano: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003281'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503281-0000-4000-8000-000000000001'
  );

-- EMO-282 · Pausa y presencia: Mirada que descansa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003282'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503282-0000-4000-8000-000000000001'
  );

-- EMO-283 · Pausa y presencia: Apoyo de los pies: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003283'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503283-0000-4000-8000-000000000001'
  );

-- EMO-284 · Pausa y presencia: Un objeto cercano: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003284'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503284-0000-4000-8000-000000000001'
  );

-- EMO-285 · Pausa y presencia: Temperatura del aire: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003285'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503285-0000-4000-8000-000000000001'
  );

-- EMO-286 · Pausa y presencia: Orientarme en el lugar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003286'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503286-0000-4000-8000-000000000001'
  );

-- EMO-287 · Pausa y presencia: Una pausa visual: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003287'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503287-0000-4000-8000-000000000001'
  );

-- EMO-288 · Pausa y presencia: Sonido que se aleja: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003288'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503288-0000-4000-8000-000000000001'
  );

-- EMO-289 · Pausa y presencia: Contacto con la silla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003289'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503289-0000-4000-8000-000000000001'
  );

-- EMO-290 · Pausa y presencia: Una forma en el entorno: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003290'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503290-0000-4000-8000-000000000001'
  );

-- EMO-291 · Pausa y presencia: Pausa entre tareas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003291'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503291-0000-4000-8000-000000000001'
  );

-- EMO-292 · Pausa y presencia: Un color presente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003292'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503292-0000-4000-8000-000000000001'
  );

-- EMO-293 · Pausa y presencia: La habitación en silencio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003293'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503293-0000-4000-8000-000000000001'
  );

-- EMO-294 · Pausa y presencia: El peso de un objeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003294'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503294-0000-4000-8000-000000000001'
  );

-- EMO-295 · Pausa y presencia: Un punto de apoyo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003295'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503295-0000-4000-8000-000000000001'
  );

-- EMO-296 · Pausa y presencia: Una línea que guía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003296'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503296-0000-4000-8000-000000000001'
  );

-- EMO-297 · Pausa y presencia: Distancias del lugar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003297'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503297-0000-4000-8000-000000000001'
  );

-- EMO-298 · Pausa y presencia: Manos en reposo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003298'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503298-0000-4000-8000-000000000001'
  );

-- EMO-299 · Pausa y presencia: Una cosa estable: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003299'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503299-0000-4000-8000-000000000001'
  );

-- EMO-300 · Pausa y presencia: Un minuto sin tarea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003300'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503300-0000-4000-8000-000000000001'
  );

-- EMO-301 · Pausa y presencia: Vuelvo a mis sentidos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003301'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503301-0000-4000-8000-000000000001'
  );

-- EMO-302 · Pausa y presencia: El borde de un objeto: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003302'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503302-0000-4000-8000-000000000001'
  );

-- EMO-303 · Pausa y presencia: El entorno por capas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003303'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503303-0000-4000-8000-000000000001'
  );

-- EMO-304 · Pausa y presencia: Una pausa en movimiento: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003304'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503304-0000-4000-8000-000000000001'
  );

-- EMO-305 · Pausa y presencia: Una luz del lugar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003305'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503305-0000-4000-8000-000000000001'
  );

-- EMO-306 · Pausa y presencia: La distancia que prefiero: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003306'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503306-0000-4000-8000-000000000001'
  );

-- EMO-307 · Pausa y presencia: Una respiración libre: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003307'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503307-0000-4000-8000-000000000001'
  );

-- EMO-308 · Pausa y presencia: Vuelvo al presente sentado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003308'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503308-0000-4000-8000-000000000001'
  );

-- EMO-309 · Pausa y presencia: Cerrar la pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003309'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503309-0000-4000-8000-000000000001'
  );

-- EMO-310 · Elecciones pequeñas: Elegir cómo seguir: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003310'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503310-0000-4000-8000-000000000001'
  );

-- EMO-311 · Elecciones pequeñas: Una opción amable: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003311'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503311-0000-4000-8000-000000000001'
  );

-- EMO-312 · Elecciones pequeñas: Cambiar el plan: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003312'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503312-0000-4000-8000-000000000001'
  );

-- EMO-313 · Elecciones pequeñas: Pedir claridad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003313'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503313-0000-4000-8000-000000000001'
  );

-- EMO-314 · Elecciones pequeñas: Un gesto pequeño: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003314'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503314-0000-4000-8000-000000000001'
  );

-- EMO-315 · Elecciones pequeñas: Una respuesta posible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003315'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503315-0000-4000-8000-000000000001'
  );

-- EMO-316 · Elecciones pequeñas: El siguiente paso: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003316'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503316-0000-4000-8000-000000000001'
  );

-- EMO-317 · Elecciones pequeñas: Mi espacio ahora: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003317'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503317-0000-4000-8000-000000000001'
  );

-- EMO-318 · Elecciones pequeñas: Lo que quiero escuchar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003318'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503318-0000-4000-8000-000000000001'
  );

-- EMO-319 · Elecciones pequeñas: Mi transición elegida: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003319'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503319-0000-4000-8000-000000000001'
  );

-- EMO-320 · Elecciones pequeñas: Una idea para después: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003320'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503320-0000-4000-8000-000000000001'
  );

-- EMO-321 · Elecciones pequeñas: Cómo cerrar una tarea: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003321'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503321-0000-4000-8000-000000000001'
  );

-- EMO-322 · Elecciones pequeñas: Un plan flexible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003322'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503322-0000-4000-8000-000000000001'
  );

-- EMO-323 · Elecciones pequeñas: Elijo mi compañía: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003323'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503323-0000-4000-8000-000000000001'
  );

-- EMO-324 · Elecciones pequeñas: Un mensaje pendiente: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003324'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503324-0000-4000-8000-000000000001'
  );

-- EMO-325 · Elecciones pequeñas: Una pregunta antes de sí: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003325'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503325-0000-4000-8000-000000000001'
  );

-- EMO-326 · Elecciones pequeñas: Una versión más fácil: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003326'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503326-0000-4000-8000-000000000001'
  );

-- EMO-327 · Elecciones pequeñas: Hacer una pausa social: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003327'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503327-0000-4000-8000-000000000001'
  );

-- EMO-328 · Elecciones pequeñas: Un descanso elegido: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003328'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503328-0000-4000-8000-000000000001'
  );

-- EMO-329 · Elecciones pequeñas: La primera prioridad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003329'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503329-0000-4000-8000-000000000001'
  );

-- EMO-330 · Elecciones pequeñas: Un compromiso posible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003330'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503330-0000-4000-8000-000000000001'
  );

-- EMO-331 · Elecciones pequeñas: Cambiar de tema: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003331'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503331-0000-4000-8000-000000000001'
  );

-- EMO-332 · Elecciones pequeñas: Dejar algo sin responder: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003332'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503332-0000-4000-8000-000000000001'
  );

-- EMO-333 · Elecciones pequeñas: Un lugar cómodo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003333'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503333-0000-4000-8000-000000000001'
  );

-- EMO-334 · Elecciones pequeñas: Hacerlo acompañado: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003334'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503334-0000-4000-8000-000000000001'
  );

-- EMO-335 · Elecciones pequeñas: Mi manera de agradecer: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003335'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503335-0000-4000-8000-000000000001'
  );

-- EMO-336 · Elecciones pequeñas: Pedir un cambio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003336'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503336-0000-4000-8000-000000000001'
  );

-- EMO-337 · Elecciones pequeñas: Decir lo que prefiero: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003337'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503337-0000-4000-8000-000000000001'
  );

-- EMO-338 · Elecciones pequeñas: Pausar el teléfono: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003338'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503338-0000-4000-8000-000000000001'
  );

-- EMO-339 · Elecciones pequeñas: Terminar a mi ritmo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003339'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503339-0000-4000-8000-000000000001'
  );

-- EMO-340 · Preferencias y expresión: Mi forma de recibir apoyo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003340'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503340-0000-4000-8000-000000000001'
  );

-- EMO-341 · Preferencias y expresión: Una conversación cómoda: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003341'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503341-0000-4000-8000-000000000001'
  );

-- EMO-342 · Preferencias y expresión: Una invitación ideal: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003342'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503342-0000-4000-8000-000000000001'
  );

-- EMO-343 · Preferencias y expresión: Mi señal de pausa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003343'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503343-0000-4000-8000-000000000001'
  );

-- EMO-344 · Preferencias y expresión: Una forma de celebrar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003344'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503344-0000-4000-8000-000000000001'
  );

-- EMO-345 · Preferencias y expresión: Una preferencia que cambia: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003345'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503345-0000-4000-8000-000000000001'
  );

-- EMO-346 · Preferencias y expresión: Mi espacio para decidir: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003346'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503346-0000-4000-8000-000000000001'
  );

-- EMO-347 · Preferencias y expresión: Una pregunta que me sirve: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003347'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503347-0000-4000-8000-000000000001'
  );

-- EMO-348 · Preferencias y expresión: Un límite que quiero cuidar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003348'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503348-0000-4000-8000-000000000001'
  );

-- EMO-349 · Preferencias y expresión: La palabra para pedir tiempo: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003349'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503349-0000-4000-8000-000000000001'
  );

-- EMO-350 · Preferencias y expresión: Mi manera de decir gracias: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003350'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503350-0000-4000-8000-000000000001'
  );

-- EMO-351 · Preferencias y expresión: Una conversación que puedo posponer: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003351'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503351-0000-4000-8000-000000000001'
  );

-- EMO-352 · Preferencias y expresión: Cómo me gusta escuchar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003352'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503352-0000-4000-8000-000000000001'
  );

-- EMO-353 · Preferencias y expresión: Una frase que me representa: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003353'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503353-0000-4000-8000-000000000001'
  );

-- EMO-354 · Preferencias y expresión: Lo que prefiero reservar: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003354'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503354-0000-4000-8000-000000000001'
  );

-- EMO-355 · Preferencias y expresión: Una forma de pedir claridad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003355'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503355-0000-4000-8000-000000000001'
  );

-- EMO-356 · Preferencias y expresión: Mi ritmo al responder: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003356'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503356-0000-4000-8000-000000000001'
  );

-- EMO-357 · Preferencias y expresión: Un plan con alternativas: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003357'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503357-0000-4000-8000-000000000001'
  );

-- EMO-358 · Preferencias y expresión: La compañía que prefiero: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003358'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503358-0000-4000-8000-000000000001'
  );

-- EMO-359 · Preferencias y expresión: Una voz que escucho: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003359'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503359-0000-4000-8000-000000000001'
  );

-- EMO-360 · Preferencias y expresión: Lo que sí quiero compartir: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003360'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503360-0000-4000-8000-000000000001'
  );

-- EMO-361 · Preferencias y expresión: Mi manera de cambiar de opinión: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003361'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503361-0000-4000-8000-000000000001'
  );

-- EMO-362 · Preferencias y expresión: Un espacio propio: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003362'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503362-0000-4000-8000-000000000001'
  );

-- EMO-363 · Preferencias y expresión: Una petición sencilla: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003363'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503363-0000-4000-8000-000000000001'
  );

-- EMO-364 · Preferencias y expresión: Un acuerdo flexible: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003364'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503364-0000-4000-8000-000000000001'
  );

-- EMO-365 · Preferencias y expresión: Mi señal de comodidad: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003365'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503365-0000-4000-8000-000000000001'
  );

-- EMO-366 · Preferencias y expresión: Una elección sin testigos: 1 sesion(es), revision de Diego y Samuel (equipo VSD Health)
UPDATE "sesion_de_actividad"
SET "revision" = 'revisada',
    "revisada_por" = 'Diego y Samuel (equipo VSD Health)',
    "revisada_el" = '2026-11-08T12:00:00-05:00'::timestamptz,
    "publicado" = TRUE
WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000003366'
  AND "revision" = 'pendiente'
  AND "id_sesion" IN (
    '5e503366-0000-4000-8000-000000000001'
  );
