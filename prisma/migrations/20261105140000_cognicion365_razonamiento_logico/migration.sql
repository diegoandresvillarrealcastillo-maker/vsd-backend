-- Cognición 365 · COG-11: cuarenta silogismos con grupos y relaciones distintos.
-- La nueva mecanica y sus sesiones quedan pendientes de revision y no se publican.

-- ---------------------------------------------------------------------------
-- 1. Las mecanicas, PRIMERO (1)
-- ---------------------------------------------------------------------------

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor", "franja"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000111',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'La conclusión que se sostiene',
    'juego',
    'Relaciona premisas y selecciona una conclusión válida.',
    TRUE,
    'mayor_es_mejor',
    1,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Conectaste las premisas con cuidado.","en_seguimiento":"Leíste las premisas y elegiste una conclusión.","requiere_atencion":"Hoy costó conectar las ideas. Puedes volver a probar otro día."}'::jsonb,
    'rotativa',
    'deduccion_logica',
    NULL
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Sus sesiones (40)
-- ---------------------------------------------------------------------------

-- COG-11 · La conclusión que se sostiene: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510111-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 01 · animales',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «perro», «gato», «caballo» pertenecen a la categoría «animales».","«perro» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«perro» pertenece a «animales».","correcta":true},{"clave":"intruso","texto":"«mesa» pertenece a «animales».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «animales» es «perro».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «animales» y el segundo incluye allí a «perro».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 02 · frutas',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «mango», «lulo», «papaya» pertenecen a la categoría «frutas».","«mango» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«mango» pertenece a «frutas».","correcta":true},{"clave":"intruso","texto":"«zanahoria» pertenece a «frutas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «frutas» es «mango».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «frutas» y el segundo incluye allí a «mango».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 03 · muebles',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «silla», «cama», «sofá» pertenecen a la categoría «muebles».","«silla» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«silla» pertenece a «muebles».","correcta":true},{"clave":"intruso","texto":"«banano» pertenece a «muebles».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «muebles» es «silla».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «muebles» y el segundo incluye allí a «silla».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 04 · transporte',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «bus», «taxi», «bicicleta» pertenecen a la categoría «transporte».","«bus» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«bus» pertenece a «transporte».","correcta":true},{"clave":"intruso","texto":"«cuchara» pertenece a «transporte».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «transporte» es «bus».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «transporte» y el segundo incluye allí a «bus».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 05 · ropa',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «camisa», «pantalón», «falda» pertenecen a la categoría «ropa».","«camisa» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«camisa» pertenece a «ropa».","correcta":true},{"clave":"intruso","texto":"«piedra» pertenece a «ropa».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «ropa» es «camisa».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «ropa» y el segundo incluye allí a «camisa».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 06 · colores',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «rojo», «azul», «verde» pertenecen a la categoría «colores».","«rojo» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«rojo» pertenece a «colores».","correcta":true},{"clave":"intruso","texto":"«lápiz» pertenece a «colores».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «colores» es «rojo».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «colores» y el segundo incluye allí a «rojo».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 07 · bebidas',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «tinto», «jugo», «agua» pertenecen a la categoría «bebidas».","«tinto» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«tinto» pertenece a «bebidas».","correcta":true},{"clave":"intruso","texto":"«zapato» pertenece a «bebidas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «bebidas» es «tinto».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «bebidas» y el segundo incluye allí a «tinto».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 08 · cuerpo',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «mano», «pie», «cabeza» pertenecen a la categoría «cuerpo».","«mano» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«mano» pertenece a «cuerpo».","correcta":true},{"clave":"intruso","texto":"«puerta» pertenece a «cuerpo».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «cuerpo» es «mano».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «cuerpo» y el segundo incluye allí a «mano».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 09 · instrumentos',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «guitarra», «tambor», «flauta» pertenecen a la categoría «instrumentos».","«guitarra» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«guitarra» pertenece a «instrumentos».","correcta":true},{"clave":"intruso","texto":"«pelota» pertenece a «instrumentos».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «instrumentos» es «guitarra».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «instrumentos» y el segundo incluye allí a «guitarra».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 10 · aves',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «loro», «águila», «colibrí» pertenecen a la categoría «aves».","«loro» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«loro» pertenece a «aves».","correcta":true},{"clave":"intruso","texto":"«vaca» pertenece a «aves».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «aves» es «loro».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «aves» y el segundo incluye allí a «loro».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 11 · útiles',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «cuaderno», «lápiz», «borrador» pertenecen a la categoría «útiles».","«cuaderno» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«cuaderno» pertenece a «útiles».","correcta":true},{"clave":"intruso","texto":"«sartén» pertenece a «útiles».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «útiles» es «cuaderno».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «útiles» y el segundo incluye allí a «cuaderno».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 12 · cocina',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «olla», «cuchara», «plato» pertenecen a la categoría «cocina».","«olla» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«olla» pertenece a «cocina».","correcta":true},{"clave":"intruso","texto":"«árbol» pertenece a «cocina».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «cocina» es «olla».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «cocina» y el segundo incluye allí a «olla».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 13 · verduras',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «cebolla», «zanahoria», «lechuga» pertenecen a la categoría «verduras».","«cebolla» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«cebolla» pertenece a «verduras».","correcta":true},{"clave":"intruso","texto":"«mango» pertenece a «verduras».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «verduras» es «cebolla».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «verduras» y el segundo incluye allí a «cebolla».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 14 · lugares',
    1,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «parque», «escuela», «tienda» pertenecen a la categoría «lugares».","«parque» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«parque» pertenece a «lugares».","correcta":true},{"clave":"intruso","texto":"«nube» pertenece a «lugares».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «lugares» es «parque».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «lugares» y el segundo incluye allí a «parque».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 15 · frutas',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «mango», «papaya», «guayaba» pertenecen a la categoría «frutas».","«mango» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«mango» pertenece a «frutas».","correcta":true},{"clave":"intruso","texto":"«papa» pertenece a «frutas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «frutas» es «mango».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «frutas» y el segundo incluye allí a «mango».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 16 · raíces',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «papa», «yuca», «arracacha» pertenecen a la categoría «raíces».","«papa» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«papa» pertenece a «raíces».","correcta":true},{"clave":"intruso","texto":"«lechuga» pertenece a «raíces».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «raíces» es «papa».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «raíces» y el segundo incluye allí a «papa».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 17 · mamíferos',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «perro», «vaca», «delfín» pertenecen a la categoría «mamíferos».","«perro» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«perro» pertenece a «mamíferos».","correcta":true},{"clave":"intruso","texto":"«gallina» pertenece a «mamíferos».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «mamíferos» es «perro».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «mamíferos» y el segundo incluye allí a «perro».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 18 · aves',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «pato», «gallina», «pavo» pertenecen a la categoría «aves».","«pato» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«pato» pertenece a «aves».","correcta":true},{"clave":"intruso","texto":"«murciélago» pertenece a «aves».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «aves» es «pato».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «aves» y el segundo incluye allí a «pato».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 19 · reptiles',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «lagarto», «tortuga», «iguana» pertenecen a la categoría «reptiles».","«lagarto» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«lagarto» pertenece a «reptiles».","correcta":true},{"clave":"intruso","texto":"«rana» pertenece a «reptiles».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «reptiles» es «lagarto».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «reptiles» y el segundo incluye allí a «lagarto».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 20 · vuelan',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «avión», «helicóptero», «cometa» pertenecen a la categoría «vuelan».","«avión» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«avión» pertenece a «vuelan».","correcta":true},{"clave":"intruso","texto":"«bicicleta» pertenece a «vuelan».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «vuelan» es «avión».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «vuelan» y el segundo incluye allí a «avión».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 21 · cuerdas',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «guitarra», «violín», «arpa» pertenecen a la categoría «cuerdas».","«guitarra» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«guitarra» pertenece a «cuerdas».","correcta":true},{"clave":"intruso","texto":"«tambor» pertenece a «cuerdas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «cuerdas» es «guitarra».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «cuerdas» y el segundo incluye allí a «guitarra».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 22 · viento',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «flauta», «trompeta», «clarinete» pertenecen a la categoría «viento».","«flauta» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«flauta» pertenece a «viento».","correcta":true},{"clave":"intruso","texto":"«piano» pertenece a «viento».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «viento» es «flauta».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «viento» y el segundo incluye allí a «flauta».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 23 · calientes',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «tinto», «chocolate», «aguapanela» pertenecen a la categoría «calientes».","«tinto» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«tinto» pertenece a «calientes».","correcta":true},{"clave":"intruso","texto":"«limonada» pertenece a «calientes».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «calientes» es «tinto».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «calientes» y el segundo incluye allí a «tinto».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 24 · desayuno',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «arepa», «huevo», «pan» pertenecen a la categoría «desayuno».","«arepa» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«arepa» pertenece a «desayuno».","correcta":true},{"clave":"intruso","texto":"«sancocho» pertenece a «desayuno».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «desayuno» es «arepa».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «desayuno» y el segundo incluye allí a «arepa».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 25 · sopas',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «sancocho», «ajiaco», «mondongo» pertenecen a la categoría «sopas».","«sancocho» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«sancocho» pertenece a «sopas».","correcta":true},{"clave":"intruso","texto":"«arepa» pertenece a «sopas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «sopas» es «sancocho».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «sopas» y el segundo incluye allí a «sancocho».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 26 · público',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «bus», «metro», «taxi» pertenecen a la categoría «público».","«bus» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«bus» pertenece a «público».","correcta":true},{"clave":"intruso","texto":"«patineta» pertenece a «público».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «público» es «bus».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «público» y el segundo incluye allí a «bus».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 27 · ruedas',
    2,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «carro», «bicicleta», «patineta» pertenecen a la categoría «ruedas».","«carro» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«carro» pertenece a «ruedas».","correcta":true},{"clave":"intruso","texto":"«canoa» pertenece a «ruedas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «ruedas» es «carro».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «ruedas» y el segundo incluye allí a «carro».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 28 · doblar',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «papel», «toalla», «camisa» pertenecen a la categoría «doblar».","«papel» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«papel» pertenece a «doblar».","correcta":true},{"clave":"intruso","texto":"«piedra» pertenece a «doblar».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «doblar» es «papel».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «doblar» y el segundo incluye allí a «papel».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 29 · teclas',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «piano», «computador», «calculadora» pertenecen a la categoría «teclas».","«piano» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«piano» pertenece a «teclas».","correcta":true},{"clave":"intruso","texto":"«cuaderno» pertenece a «teclas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «teclas» es «piano».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «teclas» y el segundo incluye allí a «piano».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 30 · alas',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «ave», «avión», «mariposa» pertenecen a la categoría «alas».","«ave» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«ave» pertenece a «alas».","correcta":true},{"clave":"intruso","texto":"«pez» pertenece a «alas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «alas» es «ave».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «alas» y el segundo incluye allí a «ave».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 31 · abrir y cerrar',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «puerta», «ventana», «paraguas» pertenecen a la categoría «abrir y cerrar».","«puerta» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«puerta» pertenece a «abrir y cerrar».","correcta":true},{"clave":"intruso","texto":"«piedra» pertenece a «abrir y cerrar».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «abrir y cerrar» es «puerta».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «abrir y cerrar» y el segundo incluye allí a «puerta».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 32 · pelar',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «naranja», «banano», «papa» pertenecen a la categoría «pelar».","«naranja» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«naranja» pertenece a «pelar».","correcta":true},{"clave":"intruso","texto":"«uva» pertenece a «pelar».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «pelar» es «naranja».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «pelar» y el segundo incluye allí a «naranja».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 33 · patas',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «mesa», «silla», «cama» pertenecen a la categoría «patas».","«mesa» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«mesa» pertenece a «patas».","correcta":true},{"clave":"intruso","texto":"«cuaderno» pertenece a «patas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «patas» es «mesa».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «patas» y el segundo incluye allí a «mesa».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 34 · girar',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «rueda», «trompo», «ventilador» pertenecen a la categoría «girar».","«rueda» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«rueda» pertenece a «girar».","correcta":true},{"clave":"intruso","texto":"«mesa» pertenece a «girar».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «girar» es «rueda».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «girar» y el segundo incluye allí a «rueda».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 35 · absorber',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «esponja», «toalla», «pañuelo» pertenecen a la categoría «absorber».","«esponja» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«esponja» pertenece a «absorber».","correcta":true},{"clave":"intruso","texto":"«plástico» pertenece a «absorber».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «absorber» es «esponja».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «absorber» y el segundo incluye allí a «esponja».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 36 · luz',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «estrella», «luciérnaga», «linterna» pertenecen a la categoría «luz».","«estrella» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«estrella» pertenece a «luz».","correcta":true},{"clave":"intruso","texto":"«piedra» pertenece a «luz».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «luz» es «estrella».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «luz» y el segundo incluye allí a «estrella».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 37 · atar',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «zapato», «cinta», «globo» pertenecen a la categoría «atar».","«zapato» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«zapato» pertenece a «atar».","correcta":true},{"clave":"intruso","texto":"«libro» pertenece a «atar».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «atar» es «zapato».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «atar» y el segundo incluye allí a «zapato».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 38 · agujas',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «reloj», «brújula», «pino» pertenecen a la categoría «agujas».","«reloj» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«reloj» pertenece a «agujas».","correcta":true},{"clave":"intruso","texto":"«taza» pertenece a «agujas».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «agujas» es «reloj».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «agujas» y el segundo incluye allí a «reloj».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 39 · pico',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «ave», «montaña», «jarra» pertenecen a la categoría «pico».","«ave» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«ave» pertenece a «pico».","correcta":true},{"clave":"intruso","texto":"«mano» pertenece a «pico».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «pico» es «ave».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «pico» y el segundo incluye allí a «ave».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510111-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000111',
    'Conclusión 40 · cola',
    3,
    '{"modo":"deduccion_logica","premisas":["Los ejemplos «cometa», «perro», «avión» pertenecen a la categoría «cola».","«cometa» es uno de esos ejemplos."],"opciones":[{"clave":"categoria","texto":"«cometa» pertenece a «cola».","correcta":true},{"clave":"intruso","texto":"«mesa» pertenece a «cola».","correcta":false},{"clave":"generalizar","texto":"Todo lo que pertenece a «cola» es «cometa».","correcta":false}],"explicacion":"El primer enunciado ubica los ejemplos en «cola» y el segundo incluye allí a «cometa».","puntosMaximos":1}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;
