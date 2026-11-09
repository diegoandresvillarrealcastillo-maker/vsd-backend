-- Cognición 365 · COG-10: cuarenta cuadrículas espaciales distintas.
--
-- La mecánica y sus sesiones quedan PENDIENTES de revisión y no se publican.
-- Requiere aplicar antes 20261105110000_motor_deduccion_espacial.
--
-- Se conserva la migracion del catalogo anterior sin reescribirla. Esta siembra es nueva, aditiva e idempotente.

-- ---------------------------------------------------------------------------
-- 1. Las mecanicas, PRIMERO (1)
-- ---------------------------------------------------------------------------

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor", "franja"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000110',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'El lugar de la figura',
    'juego',
    'Cruza pistas de forma y posición para encontrar una casilla en la cuadrícula.',
    TRUE,
    'mayor_es_mejor',
    1,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Encontraste la casilla que cumplía las pistas.","en_seguimiento":"Revisaste las pistas y elegiste una casilla.","requiere_atencion":"Hoy costó cruzar las pistas. Puedes volver a intentarlo otro día."}'::jsonb,
    'rotativa',
    'deduccion_espacial',
    NULL
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Sus sesiones (40)
-- ---------------------------------------------------------------------------

-- COG-10 · El lugar de la figura: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510110-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 1',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color rojo.","Está en la fila 3."],"solucion":"circulo-rojo","explicacion":"La círculo rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 2',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color azul.","Está en la fila 2."],"solucion":"triangulo-azul","explicacion":"La triángulo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 3',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color azul.","Está en la fila 2."],"solucion":"circulo-azul","explicacion":"La círculo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 4',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":3},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 1."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 5',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 3."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 6',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 3."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 7',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color azul.","Está en la fila 2."],"solucion":"triangulo-azul","explicacion":"La triángulo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 8',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 1."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 9',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":3},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 1."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 10',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":3},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color amarillo.","Está en la fila 3."],"solucion":"circulo-amarillo","explicacion":"La círculo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 11',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":2,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 2."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 12',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color rojo.","Está en la fila 2."],"solucion":"triangulo-rojo","explicacion":"La triángulo rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 13',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color azul.","Está en la fila 1."],"solucion":"cuadrado-azul","explicacion":"La cuadrado azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 14',
    1,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color azul.","Está en la fila 3."],"solucion":"circulo-azul","explicacion":"La círculo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 15',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 3."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 16',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":2,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 2."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 17',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color rojo.","Está en la fila 1."],"solucion":"triangulo-rojo","explicacion":"La triángulo rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 18',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":3},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":2,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 1."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 19',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color azul.","Está en la fila 3."],"solucion":"triangulo-azul","explicacion":"La triángulo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 20',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color amarillo.","Está en la fila 2."],"solucion":"cuadrado-amarillo","explicacion":"La cuadrado amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 21',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":3},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":2,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 2."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 22',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 1."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 23',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":3},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 3."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 24',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color azul.","Está en la fila 3."],"solucion":"cuadrado-azul","explicacion":"La cuadrado azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 25',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color azul.","Está en la fila 2."],"solucion":"cuadrado-azul","explicacion":"La cuadrado azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 26',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color rojo.","Está en la fila 1."],"solucion":"circulo-rojo","explicacion":"La círculo rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 27',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 1."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 28',
    2,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":3},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color rojo.","Está en la fila 3."],"solucion":"cuadrado-rojo","explicacion":"La cuadrado rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 29',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":3},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color azul.","Está en la fila 2."],"solucion":"circulo-azul","explicacion":"La círculo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 30',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color rojo.","Está en la fila 2."],"solucion":"triangulo-rojo","explicacion":"La triángulo rojo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 31',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color amarillo.","Está en la fila 1."],"solucion":"cuadrado-amarillo","explicacion":"La cuadrado amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 32',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 3."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 33',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":3,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color azul.","Está en la fila 3."],"solucion":"triangulo-azul","explicacion":"La triángulo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 34',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":1,"columna":3},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color azul.","Está en la fila 2."],"solucion":"cuadrado-azul","explicacion":"La cuadrado azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 35',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":3},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":3},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":2},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color azul.","Está en la fila 1."],"solucion":"triangulo-azul","explicacion":"La triángulo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 36',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":1,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":2},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":3},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":2,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":2,"columna":3},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":3}],"pistas":["Tiene cuatro lados.","Es de color azul.","Está en la fila 1."],"solucion":"cuadrado-azul","explicacion":"La cuadrado azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 37',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":1,"columna":3},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":2},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":2,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":3,"columna":1},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":2},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color amarillo.","Está en la fila 3."],"solucion":"circulo-amarillo","explicacion":"La círculo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 38',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":1,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":2,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":3},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":1},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":3,"columna":2},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color amarillo.","Está en la fila 2."],"solucion":"circulo-amarillo","explicacion":"La círculo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 39',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":1,"columna":1},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":1,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":1},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":2,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":2,"columna":3},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":3,"columna":1},{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":3,"columna":2},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":3}],"pistas":["No tiene lados rectos.","Es de color azul.","Está en la fila 2."],"solucion":"circulo-azul","explicacion":"La círculo azul es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510110-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000110',
    'Cruce de pistas 40',
    3,
    '{"modo":"deduccion_espacial","filas":3,"columnas":3,"celdas":[{"clave":"cuadrado-amarillo","etiqueta":"Cuadrado amarillo","fila":1,"columna":1},{"clave":"triangulo-amarillo","etiqueta":"Triángulo amarillo","fila":1,"columna":2},{"clave":"triangulo-rojo","etiqueta":"Triángulo rojo","fila":1,"columna":3},{"clave":"circulo-azul","etiqueta":"Círculo azul","fila":2,"columna":1},{"clave":"cuadrado-rojo","etiqueta":"Cuadrado rojo","fila":2,"columna":2},{"clave":"triangulo-azul","etiqueta":"Triángulo azul","fila":2,"columna":3},{"clave":"cuadrado-azul","etiqueta":"Cuadrado azul","fila":3,"columna":1},{"clave":"circulo-rojo","etiqueta":"Círculo rojo","fila":3,"columna":2},{"clave":"circulo-amarillo","etiqueta":"Círculo amarillo","fila":3,"columna":3}],"pistas":["Tiene tres lados.","Es de color amarillo.","Está en la fila 1."],"solucion":"triangulo-amarillo","explicacion":"La triángulo amarillo es la única que cumple las tres pistas.","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;
