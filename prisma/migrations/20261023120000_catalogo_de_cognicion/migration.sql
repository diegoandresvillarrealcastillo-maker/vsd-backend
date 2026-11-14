-- El catalogo de Cognicion (SCRUM-222, ADR 0030 y 0031): COG-01 hasta 40 sesiones y COG-02 a COG-09.
--
-- Solo DATOS y aditiva: no toca el esquema ni cambia ninguna actividad ni sesion ya sembradas.
--
--   1. se siembran ocho mecanicas nuevas, todas `rotativa` y con su `motor` (COG-02 a COG-09);
--   2. se siembran sus sesiones, y las 36 que faltan de «Recuerda los colores» (COG-01).
--
-- ## Que sale publicado y que no
--
--   * COG-01 a COG-07 y COG-09 NO piden revision profesional (`no_requiere`): salen PUBLICADAS. Si algo falla
--     en la prueba en PRE, se retira con `UPDATE ... SET publicado = FALSE` (retirar no borra, ADR 0025).
--   * COG-08 pide una revision ligera (que no se confunda con una prueba): `pendiente`, SIN PUBLICAR. La
--     base impide publicarla asi (sesion_de_actividad_publicada_revisada). Mientras no tenga una publicada, no
--     se ofrece a nadie.
--
-- ## Como se genero
--
-- Este archivo NO se escribe a mano: lo genera `src/pruebas/catalogo/generar.ts` desde el contenido que esta en
-- `src/pruebas/catalogo/cognicion/`, y una prueba comprueba que lo que esta aqui es lo que el generador
-- produce. Para cambiar un texto se cambia alli y se vuelve a generar... pero una sesion ya sembrada no se
-- edita (ADR 0030): si cambia, se retira y se agrega otra con otro identificador.
--
-- ## Las cuentas
--
--   * 8 mecanicas nuevas y 36 sesiones nuevas de COG-01 mas 8 x 40 de las demas: 356 sesiones.
--   * Un elemento de un banco (un grupo, una mesa, una palabra, una lista) esta en dos sesiones a lo sumo
--     (ADR 0031), y la prueba lo comprueba.
--
-- Es idempotente: los `INSERT` ignoran un identificador ya sembrado, asi que aplicarla dos veces deja lo
-- mismo. Los identificadores son fijos para que sean los mismos en los tres ambientes.
--
-- ORDEN: primero las mecanicas y despues sus sesiones (una sesion necesita su actividad). Necesita la columna
-- `actividad.franja` (SCRUM-221), que va antes.
--
-- Para deshacerla (si nadie las ha hecho; `resultado.id_sesion` es RESTRICT, y las que ya se usaron se retiran
-- con `publicado = FALSE` y no se borran):
--   DELETE FROM "sesion_de_actividad" WHERE "id_sesion"::text LIKE '5e5101%';
--   DELETE FROM "actividad" WHERE "id_actividad" IN (
--     '0acd0000-0000-4000-8000-000000000102', '0acd0000-0000-4000-8000-000000000103',
--     '0acd0000-0000-4000-8000-000000000104', '0acd0000-0000-4000-8000-000000000105',
--     '0acd0000-0000-4000-8000-000000000106', '0acd0000-0000-4000-8000-000000000107',
--     '0acd0000-0000-4000-8000-000000000108', '0acd0000-0000-4000-8000-000000000109');

-- ---------------------------------------------------------------------------
-- 1. Las mecanicas, PRIMERO (8)
-- ---------------------------------------------------------------------------

INSERT INTO "actividad" (
  "id_actividad", "id_categoria", "nombre", "tipo", "descripcion", "estado",
  "direccion_escala", "puntaje_maximo", "umbrales", "textos_nivel", "frecuencia", "motor", "franja"
)
VALUES
  (
    '0acd0000-0000-4000-8000-000000000102',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'La palabra que sobra',
    'juego',
    'Cuatro palabras: tres tienen algo en común y una no. Encuentra la que sobra. Seis rondas, unos dos minutos.',
    TRUE,
    'mayor_es_mejor',
    6,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Encontraste los intrusos con soltura.","en_seguimiento":"Algunos se te colaron, que es normal.","requiere_atencion":"Hoy costó ver lo que une a las demás. Puede ser cansancio."}'::jsonb,
    'rotativa',
    'clasificar',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000103',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Ordena por categoría',
    'juego',
    'Lleva cada cosa a su cesta, de una en una. Ocho cosas, unos dos minutos.',
    TRUE,
    'mayor_es_mejor',
    8,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Ordenaste todo sin perder el criterio.","en_seguimiento":"Casi todo en su sitio.","requiere_atencion":"Hoy se mezclaron varias. Un día suelto no dice nada."}'::jsonb,
    'rotativa',
    'clasificar',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000104',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Cuentas con calma',
    'juego',
    'Ocho cuentas cortas, sin cronómetro. Elige la respuesta con todo el tiempo que quieras.',
    TRUE,
    'mayor_es_mejor',
    8,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Resolviste las cuentas con calma.","en_seguimiento":"Algunas salieron, otras pedían más tiempo.","requiere_atencion":"Hoy las cuentas costaron. Pasa con cansancio."}'::jsonb,
    'rotativa',
    'calculo',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000105',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Toca solo lo que cambia',
    'juego',
    'Unos símbolos van apareciendo. Toca solo cuando salga el que te pedimos. Un minuto y medio, más o menos.',
    TRUE,
    'mayor_es_mejor',
    15,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Mantuviste la atención todo el ejercicio.","en_seguimiento":"La atención te acompañó a ratos.","requiere_atencion":"Hoy costó sostener la mirada. Puede ser cansancio, sin más."}'::jsonb,
    'rotativa',
    'tocar_el_objetivo',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000106',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Recuerda la lista',
    'juego',
    'Mira una lista unos segundos; cuando se oculte, elige lo que había. Unos dos minutos.',
    TRUE,
    'mayor_es_mejor',
    8,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Recordaste la lista casi completa.","en_seguimiento":"Recordaste buena parte.","requiere_atencion":"Hoy la lista se te escapó. Pasa cuando hay prisa o poco sueño."}'::jsonb,
    'rotativa',
    'ver_ocultar_recordar',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000107',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Completa la palabra',
    'juego',
    'Seis palabras con letras que faltan o revueltas, y una pista. Sin tiempo.',
    TRUE,
    'mayor_es_mejor',
    6,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Completaste las palabras con soltura.","en_seguimiento":"Algunas costaron.","requiere_atencion":"Hoy las palabras no salieron fácil. Puede ser cansancio."}'::jsonb,
    'rotativa',
    'palabras',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000108',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Une los puntos en orden',
    'juego',
    'Toca los puntos en orden, del primero al último. Sin cronómetro: al ritmo que quieras.',
    TRUE,
    'mayor_es_mejor',
    10,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Seguiste el orden hasta el final.","en_seguimiento":"Algunos saltos, nada raro.","requiere_atencion":"Hoy se perdió el hilo antes. Un día suelto no dice nada."}'::jsonb,
    'rotativa',
    'tocar_el_objetivo',
    NULL
  ),
  (
    '0acd0000-0000-4000-8000-000000000109',
    (SELECT "id_categoria" FROM "categoria" WHERE "nombre" = 'Cognición'),
    'Lo que vi',
    'juego',
    'Mira unas figuras unos segundos; cuando se oculten, di qué había en cada lugar. Unos dos minutos.',
    TRUE,
    'mayor_es_mejor',
    5,
    '{"primero":0.35,"segundo":0.7}'::jsonb,
    '{"favorable":"Recordaste muchos detalles de la escena.","en_seguimiento":"Recordaste lo principal.","requiere_atencion":"Hoy los detalles se desdibujaron. Puede ser cansancio."}'::jsonb,
    'rotativa',
    'ver_ocultar_recordar',
    NULL
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Sus sesiones (356)
-- ---------------------------------------------------------------------------

-- COG-01 · Recuerda los colores: 36 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510101-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del amanecer, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"estrella","nombre":"estrella ámbar","forma":"estrella","color":"ambar"},{"clave":"circulo","nombre":"círculo naranja","forma":"circulo","color":"naranja"},{"clave":"triangulo","nombre":"triángulo rosa","forma":"triangulo","color":"rosa"},{"clave":"rombo","nombre":"rombo violeta","forma":"rombo","color":"violeta"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del amanecer, seis símbolos',
    2,
    '{"casillas":[{"clave":"estrella","nombre":"estrella ámbar","forma":"estrella","color":"ambar"},{"clave":"circulo","nombre":"círculo naranja","forma":"circulo","color":"naranja"},{"clave":"triangulo","nombre":"triángulo rosa","forma":"triangulo","color":"rosa"},{"clave":"rombo","nombre":"rombo violeta","forma":"rombo","color":"violeta"},{"clave":"cuadrado","nombre":"cuadrado marrón","forma":"cuadrado","color":"marron"},{"clave":"hoja","nombre":"hoja verde","forma":"hoja","color":"verde"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del amanecer, nueve símbolos',
    3,
    '{"casillas":[{"clave":"estrella","nombre":"estrella ámbar","forma":"estrella","color":"ambar"},{"clave":"circulo","nombre":"círculo naranja","forma":"circulo","color":"naranja"},{"clave":"triangulo","nombre":"triángulo rosa","forma":"triangulo","color":"rosa"},{"clave":"rombo","nombre":"rombo violeta","forma":"rombo","color":"violeta"},{"clave":"cuadrado","nombre":"cuadrado marrón","forma":"cuadrado","color":"marron"},{"clave":"hoja","nombre":"hoja verde","forma":"hoja","color":"verde"},{"clave":"gota","nombre":"gota turquesa","forma":"gota","color":"turquesa"},{"clave":"luna","nombre":"luna gris","forma":"luna","color":"gris"},{"clave":"nube","nombre":"nube azul","forma":"nube","color":"azul"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del amanecer, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"estrella","nombre":"estrella ámbar","forma":"estrella","color":"ambar"},{"clave":"circulo","nombre":"círculo naranja","forma":"circulo","color":"naranja"},{"clave":"triangulo","nombre":"triángulo rosa","forma":"triangulo","color":"rosa"},{"clave":"rombo","nombre":"rombo violeta","forma":"rombo","color":"violeta"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del bosque, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"hoja","nombre":"hoja verde","forma":"hoja","color":"verde"},{"clave":"gota","nombre":"gota marrón","forma":"gota","color":"marron"},{"clave":"triangulo","nombre":"triángulo ámbar","forma":"triangulo","color":"ambar"},{"clave":"cuadrado","nombre":"cuadrado turquesa","forma":"cuadrado","color":"turquesa"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del bosque, seis símbolos',
    2,
    '{"casillas":[{"clave":"hoja","nombre":"hoja verde","forma":"hoja","color":"verde"},{"clave":"gota","nombre":"gota marrón","forma":"gota","color":"marron"},{"clave":"triangulo","nombre":"triángulo ámbar","forma":"triangulo","color":"ambar"},{"clave":"cuadrado","nombre":"cuadrado turquesa","forma":"cuadrado","color":"turquesa"},{"clave":"circulo","nombre":"círculo naranja","forma":"circulo","color":"naranja"},{"clave":"rombo","nombre":"rombo gris","forma":"rombo","color":"gris"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del bosque, nueve símbolos',
    3,
    '{"casillas":[{"clave":"hoja","nombre":"hoja verde","forma":"hoja","color":"verde"},{"clave":"gota","nombre":"gota marrón","forma":"gota","color":"marron"},{"clave":"triangulo","nombre":"triángulo ámbar","forma":"triangulo","color":"ambar"},{"clave":"cuadrado","nombre":"cuadrado turquesa","forma":"cuadrado","color":"turquesa"},{"clave":"circulo","nombre":"círculo naranja","forma":"circulo","color":"naranja"},{"clave":"rombo","nombre":"rombo gris","forma":"rombo","color":"gris"},{"clave":"nube","nombre":"nube azul","forma":"nube","color":"azul"},{"clave":"estrella","nombre":"estrella violeta","forma":"estrella","color":"violeta"},{"clave":"luna","nombre":"luna rosa","forma":"luna","color":"rosa"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del bosque, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"hoja","nombre":"hoja verde","forma":"hoja","color":"verde"},{"clave":"gota","nombre":"gota marrón","forma":"gota","color":"marron"},{"clave":"triangulo","nombre":"triángulo ámbar","forma":"triangulo","color":"ambar"},{"clave":"cuadrado","nombre":"cuadrado turquesa","forma":"cuadrado","color":"turquesa"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del mar, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"gota","nombre":"gota azul","forma":"gota","color":"azul"},{"clave":"luna","nombre":"luna turquesa","forma":"luna","color":"turquesa"},{"clave":"nube","nombre":"nube gris","forma":"nube","color":"gris"},{"clave":"circulo","nombre":"círculo verde","forma":"circulo","color":"verde"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del mar, seis símbolos',
    2,
    '{"casillas":[{"clave":"gota","nombre":"gota azul","forma":"gota","color":"azul"},{"clave":"luna","nombre":"luna turquesa","forma":"luna","color":"turquesa"},{"clave":"nube","nombre":"nube gris","forma":"nube","color":"gris"},{"clave":"circulo","nombre":"círculo verde","forma":"circulo","color":"verde"},{"clave":"cuadrado","nombre":"cuadrado violeta","forma":"cuadrado","color":"violeta"},{"clave":"rombo","nombre":"rombo rosa","forma":"rombo","color":"rosa"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del mar, nueve símbolos',
    3,
    '{"casillas":[{"clave":"gota","nombre":"gota azul","forma":"gota","color":"azul"},{"clave":"luna","nombre":"luna turquesa","forma":"luna","color":"turquesa"},{"clave":"nube","nombre":"nube gris","forma":"nube","color":"gris"},{"clave":"circulo","nombre":"círculo verde","forma":"circulo","color":"verde"},{"clave":"cuadrado","nombre":"cuadrado violeta","forma":"cuadrado","color":"violeta"},{"clave":"rombo","nombre":"rombo rosa","forma":"rombo","color":"rosa"},{"clave":"estrella","nombre":"estrella ámbar","forma":"estrella","color":"ambar"},{"clave":"triangulo","nombre":"triángulo naranja","forma":"triangulo","color":"naranja"},{"clave":"hoja","nombre":"hoja marrón","forma":"hoja","color":"marron"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-00000000000a',
    'Paleta del mar, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"gota","nombre":"gota azul","forma":"gota","color":"azul"},{"clave":"luna","nombre":"luna turquesa","forma":"luna","color":"turquesa"},{"clave":"nube","nombre":"nube gris","forma":"nube","color":"gris"},{"clave":"circulo","nombre":"círculo verde","forma":"circulo","color":"verde"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-00000000000a',
    'Frutas, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"manzana","nombre":"manzana","forma":"manzana","color":"verde"},{"clave":"pera","nombre":"pera","forma":"pera","color":"azul"},{"clave":"uva","nombre":"uvas","forma":"uva","color":"ambar"},{"clave":"naranja","nombre":"naranja","forma":"naranja","color":"violeta"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-00000000000a',
    'Frutas, seis símbolos',
    2,
    '{"casillas":[{"clave":"manzana","nombre":"manzana","forma":"manzana","color":"verde"},{"clave":"pera","nombre":"pera","forma":"pera","color":"azul"},{"clave":"uva","nombre":"uvas","forma":"uva","color":"ambar"},{"clave":"naranja","nombre":"naranja","forma":"naranja","color":"violeta"},{"clave":"banano","nombre":"banano","forma":"banano","color":"rosa"},{"clave":"fresa","nombre":"fresa","forma":"fresa","color":"turquesa"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-00000000000a',
    'Frutas, nueve símbolos',
    3,
    '{"casillas":[{"clave":"manzana","nombre":"manzana","forma":"manzana","color":"verde"},{"clave":"pera","nombre":"pera","forma":"pera","color":"azul"},{"clave":"uva","nombre":"uvas","forma":"uva","color":"ambar"},{"clave":"naranja","nombre":"naranja","forma":"naranja","color":"violeta"},{"clave":"banano","nombre":"banano","forma":"banano","color":"rosa"},{"clave":"fresa","nombre":"fresa","forma":"fresa","color":"turquesa"},{"clave":"limon","nombre":"limón","forma":"limon","color":"gris"},{"clave":"cereza","nombre":"cerezas","forma":"cereza","color":"naranja"},{"clave":"pina","nombre":"piña","forma":"pina","color":"marron"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-00000000000a',
    'Frutas, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"manzana","nombre":"manzana","forma":"manzana","color":"verde"},{"clave":"pera","nombre":"pera","forma":"pera","color":"azul"},{"clave":"uva","nombre":"uvas","forma":"uva","color":"ambar"},{"clave":"naranja","nombre":"naranja","forma":"naranja","color":"violeta"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-00000000000a',
    'Animales, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"gato","nombre":"gato","forma":"gato","color":"ambar"},{"clave":"perro","nombre":"perro","forma":"perro","color":"violeta"},{"clave":"pez","nombre":"pez","forma":"pez","color":"rosa"},{"clave":"ave","nombre":"ave","forma":"ave","color":"turquesa"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-00000000000a',
    'Animales, seis símbolos',
    2,
    '{"casillas":[{"clave":"gato","nombre":"gato","forma":"gato","color":"ambar"},{"clave":"perro","nombre":"perro","forma":"perro","color":"violeta"},{"clave":"pez","nombre":"pez","forma":"pez","color":"rosa"},{"clave":"ave","nombre":"ave","forma":"ave","color":"turquesa"},{"clave":"mariposa","nombre":"mariposa","forma":"mariposa","color":"gris"},{"clave":"tortuga","nombre":"tortuga","forma":"tortuga","color":"naranja"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-00000000000a',
    'Animales, nueve símbolos',
    3,
    '{"casillas":[{"clave":"gato","nombre":"gato","forma":"gato","color":"ambar"},{"clave":"perro","nombre":"perro","forma":"perro","color":"violeta"},{"clave":"pez","nombre":"pez","forma":"pez","color":"rosa"},{"clave":"ave","nombre":"ave","forma":"ave","color":"turquesa"},{"clave":"mariposa","nombre":"mariposa","forma":"mariposa","color":"gris"},{"clave":"tortuga","nombre":"tortuga","forma":"tortuga","color":"naranja"},{"clave":"conejo","nombre":"conejo","forma":"conejo","color":"marron"},{"clave":"abeja","nombre":"abeja","forma":"abeja","color":"verde"},{"clave":"caracol","nombre":"caracol","forma":"caracol","color":"azul"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-00000000000a',
    'Animales, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"gato","nombre":"gato","forma":"gato","color":"ambar"},{"clave":"perro","nombre":"perro","forma":"perro","color":"violeta"},{"clave":"pez","nombre":"pez","forma":"pez","color":"rosa"},{"clave":"ave","nombre":"ave","forma":"ave","color":"turquesa"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-00000000000a',
    'Clima, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"sol","nombre":"sol","forma":"sol","color":"rosa"},{"clave":"lluvia","nombre":"lluvia","forma":"lluvia","color":"turquesa"},{"clave":"rayo","nombre":"rayo","forma":"rayo","color":"gris"},{"clave":"copo","nombre":"copo de nieve","forma":"copo","color":"naranja"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-00000000000a',
    'Clima, seis símbolos',
    2,
    '{"casillas":[{"clave":"sol","nombre":"sol","forma":"sol","color":"rosa"},{"clave":"lluvia","nombre":"lluvia","forma":"lluvia","color":"turquesa"},{"clave":"rayo","nombre":"rayo","forma":"rayo","color":"gris"},{"clave":"copo","nombre":"copo de nieve","forma":"copo","color":"naranja"},{"clave":"viento","nombre":"viento","forma":"viento","color":"marron"},{"clave":"arcoiris","nombre":"arcoíris","forma":"arcoiris","color":"verde"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-00000000000a',
    'Clima, nueve símbolos',
    3,
    '{"casillas":[{"clave":"sol","nombre":"sol","forma":"sol","color":"rosa"},{"clave":"lluvia","nombre":"lluvia","forma":"lluvia","color":"turquesa"},{"clave":"rayo","nombre":"rayo","forma":"rayo","color":"gris"},{"clave":"copo","nombre":"copo de nieve","forma":"copo","color":"naranja"},{"clave":"viento","nombre":"viento","forma":"viento","color":"marron"},{"clave":"arcoiris","nombre":"arcoíris","forma":"arcoiris","color":"verde"},{"clave":"sombrilla","nombre":"sombrilla","forma":"sombrilla","color":"azul"},{"clave":"luna","nombre":"luna","forma":"luna","color":"ambar"},{"clave":"nube","nombre":"nube","forma":"nube","color":"violeta"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-00000000000a',
    'Clima, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"sol","nombre":"sol","forma":"sol","color":"rosa"},{"clave":"lluvia","nombre":"lluvia","forma":"lluvia","color":"turquesa"},{"clave":"rayo","nombre":"rayo","forma":"rayo","color":"gris"},{"clave":"copo","nombre":"copo de nieve","forma":"copo","color":"naranja"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-00000000000a',
    'Naturaleza, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"arbol","nombre":"árbol","forma":"arbol","color":"gris"},{"clave":"flor","nombre":"flor","forma":"flor","color":"naranja"},{"clave":"montana","nombre":"montaña","forma":"montana","color":"marron"},{"clave":"ola","nombre":"ola","forma":"ola","color":"verde"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-00000000000a',
    'Naturaleza, seis símbolos',
    2,
    '{"casillas":[{"clave":"arbol","nombre":"árbol","forma":"arbol","color":"gris"},{"clave":"flor","nombre":"flor","forma":"flor","color":"naranja"},{"clave":"montana","nombre":"montaña","forma":"montana","color":"marron"},{"clave":"ola","nombre":"ola","forma":"ola","color":"verde"},{"clave":"hongo","nombre":"hongo","forma":"hongo","color":"azul"},{"clave":"palmera","nombre":"palmera","forma":"palmera","color":"ambar"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-00000000000a',
    'Naturaleza, nueve símbolos',
    3,
    '{"casillas":[{"clave":"arbol","nombre":"árbol","forma":"arbol","color":"gris"},{"clave":"flor","nombre":"flor","forma":"flor","color":"naranja"},{"clave":"montana","nombre":"montaña","forma":"montana","color":"marron"},{"clave":"ola","nombre":"ola","forma":"ola","color":"verde"},{"clave":"hongo","nombre":"hongo","forma":"hongo","color":"azul"},{"clave":"palmera","nombre":"palmera","forma":"palmera","color":"ambar"},{"clave":"cactus","nombre":"cactus","forma":"cactus","color":"violeta"},{"clave":"trebol","nombre":"trébol","forma":"trebol","color":"rosa"},{"clave":"hoja","nombre":"hoja","forma":"hoja","color":"turquesa"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-00000000000a',
    'Naturaleza, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"arbol","nombre":"árbol","forma":"arbol","color":"gris"},{"clave":"flor","nombre":"flor","forma":"flor","color":"naranja"},{"clave":"montana","nombre":"montaña","forma":"montana","color":"marron"},{"clave":"ola","nombre":"ola","forma":"ola","color":"verde"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-00000000000a',
    'En casa, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"llave","nombre":"llave","forma":"llave","color":"marron"},{"clave":"taza","nombre":"taza","forma":"taza","color":"verde"},{"clave":"silla","nombre":"silla","forma":"silla","color":"azul"},{"clave":"lampara","nombre":"lámpara","forma":"lampara","color":"ambar"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-00000000000a',
    'En casa, seis símbolos',
    2,
    '{"casillas":[{"clave":"llave","nombre":"llave","forma":"llave","color":"marron"},{"clave":"taza","nombre":"taza","forma":"taza","color":"verde"},{"clave":"silla","nombre":"silla","forma":"silla","color":"azul"},{"clave":"lampara","nombre":"lámpara","forma":"lampara","color":"ambar"},{"clave":"puerta","nombre":"puerta","forma":"puerta","color":"violeta"},{"clave":"ventana","nombre":"ventana","forma":"ventana","color":"rosa"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-00000000000a',
    'En casa, nueve símbolos',
    3,
    '{"casillas":[{"clave":"llave","nombre":"llave","forma":"llave","color":"marron"},{"clave":"taza","nombre":"taza","forma":"taza","color":"verde"},{"clave":"silla","nombre":"silla","forma":"silla","color":"azul"},{"clave":"lampara","nombre":"lámpara","forma":"lampara","color":"ambar"},{"clave":"puerta","nombre":"puerta","forma":"puerta","color":"violeta"},{"clave":"ventana","nombre":"ventana","forma":"ventana","color":"rosa"},{"clave":"libro","nombre":"libro","forma":"libro","color":"turquesa"},{"clave":"reloj","nombre":"reloj","forma":"reloj","color":"gris"},{"clave":"cama","nombre":"cama","forma":"cama","color":"naranja"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-00000000000a',
    'En casa, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"llave","nombre":"llave","forma":"llave","color":"marron"},{"clave":"taza","nombre":"taza","forma":"taza","color":"verde"},{"clave":"silla","nombre":"silla","forma":"silla","color":"azul"},{"clave":"lampara","nombre":"lámpara","forma":"lampara","color":"ambar"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-00000000000a',
    'Transporte, cuatro símbolos',
    1,
    '{"casillas":[{"clave":"bus","nombre":"bus","forma":"bus","color":"azul"},{"clave":"bicicleta","nombre":"bicicleta","forma":"bicicleta","color":"ambar"},{"clave":"barco","nombre":"barco","forma":"barco","color":"violeta"},{"clave":"avion","nombre":"avión","forma":"avion","color":"rosa"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-00000000000a',
    'Transporte, seis símbolos',
    2,
    '{"casillas":[{"clave":"bus","nombre":"bus","forma":"bus","color":"azul"},{"clave":"bicicleta","nombre":"bicicleta","forma":"bicicleta","color":"ambar"},{"clave":"barco","nombre":"barco","forma":"barco","color":"violeta"},{"clave":"avion","nombre":"avión","forma":"avion","color":"rosa"},{"clave":"tren","nombre":"tren","forma":"tren","color":"turquesa"},{"clave":"carro","nombre":"carro","forma":"carro","color":"gris"}],"largoInicial":3,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-00000000000a',
    'Transporte, nueve símbolos',
    3,
    '{"casillas":[{"clave":"bus","nombre":"bus","forma":"bus","color":"azul"},{"clave":"bicicleta","nombre":"bicicleta","forma":"bicicleta","color":"ambar"},{"clave":"barco","nombre":"barco","forma":"barco","color":"violeta"},{"clave":"avion","nombre":"avión","forma":"avion","color":"rosa"},{"clave":"tren","nombre":"tren","forma":"tren","color":"turquesa"},{"clave":"carro","nombre":"carro","forma":"carro","color":"gris"},{"clave":"moto","nombre":"moto","forma":"moto","color":"naranja"},{"clave":"cohete","nombre":"cohete","forma":"cohete","color":"marron"},{"clave":"globo","nombre":"globo aerostático","forma":"globo","color":"verde"}],"largoInicial":4,"rondas":12,"msPorElemento":1000,"msDeMargen":1000,"msDestello":700}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510101-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-00000000000a',
    'Transporte, cuatro símbolos, con calma',
    1,
    '{"casillas":[{"clave":"bus","nombre":"bus","forma":"bus","color":"azul"},{"clave":"bicicleta","nombre":"bicicleta","forma":"bicicleta","color":"ambar"},{"clave":"barco","nombre":"barco","forma":"barco","color":"violeta"},{"clave":"avion","nombre":"avión","forma":"avion","color":"rosa"}],"largoInicial":3,"rondas":12,"msPorElemento":1700,"msDeMargen":1000,"msDestello":1100}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-02 · La palabra que sobra: 40 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510102-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 1',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["mesa","caballo","gato","perro"],"intruso":0,"razon":"Las otras son animales."},{"palabras":["mango","zanahoria","papaya","lulo"],"intruso":1,"razon":"Las otras son frutas."},{"palabras":["sofá","silla","banano","cama"],"intruso":2,"razon":"Las otras son muebles."},{"palabras":["taxi","cuchara","bicicleta","bus"],"intruso":1,"razon":"Las otras sirven para moverse."},{"palabras":["pantalón","camisa","piedra","falda"],"intruso":2,"razon":"Las otras son ropa."},{"palabras":["rojo","lápiz","azul","verde"],"intruso":1,"razon":"Las otras son colores."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 2',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["jugo","agua","tinto","zapato"],"intruso":3,"razon":"Las otras se toman."},{"palabras":["cabeza","pie","mano","puerta"],"intruso":3,"razon":"Las otras son partes del cuerpo."},{"palabras":["guitarra","tambor","flauta","pelota"],"intruso":3,"razon":"Las otras son instrumentos musicales."},{"palabras":["loro","vaca","águila","colibrí"],"intruso":1,"razon":"Las otras son aves."},{"palabras":["lápiz","borrador","sartén","cuaderno"],"intruso":2,"razon":"Las otras son útiles escolares."},{"palabras":["olla","plato","árbol","cuchara"],"intruso":2,"razon":"Las otras se usan en la cocina."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 3',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["cebolla","lechuga","mango","zanahoria"],"intruso":2,"razon":"Las otras son verduras."},{"palabras":["escuela","parque","nube","tienda"],"intruso":2,"razon":"Las otras son lugares de una ciudad."},{"palabras":["viento","silla","nieve","lluvia"],"intruso":1,"razon":"Las otras tienen que ver con el clima."},{"palabras":["martillo","serrucho","helado","destornillador"],"intruso":2,"razon":"Las otras son herramientas."},{"palabras":["camión","girasol","margarita","rosa"],"intruso":0,"razon":"Las otras son flores."},{"palabras":["jueves","enero","martes","lunes"],"intruso":1,"razon":"Las otras son días de la semana."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 4',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["marzo","domingo","enero","julio"],"intruso":1,"razon":"Las otras son meses del año."},{"palabras":["azul","cinco","uno","nueve"],"intruso":0,"razon":"Las otras son números."},{"palabras":["círculo","cuadrado","triángulo","mesa"],"intruso":3,"razon":"Las otras son figuras geométricas."},{"palabras":["galleta","helado","tenedor","torta"],"intruso":2,"razon":"Las otras son postres."},{"palabras":["atún","trucha","pato","sardina"],"intruso":2,"razon":"Las otras son peces."},{"palabras":["balón","cometa","trompo","martillo"],"intruso":3,"razon":"Las otras son juguetes."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 5',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["sala","carro","cocina","baño"],"intruso":1,"razon":"Las otras son partes de una casa."},{"palabras":["panadero","pintor","tijera","maestro"],"intruso":2,"razon":"Las otras son personas con un oficio."},{"palabras":["abeja","mosca","hormiga","elefante"],"intruso":3,"razon":"Las otras son insectos."},{"palabras":["natación","ciclismo","fútbol","sombrero"],"intruso":3,"razon":"Las otras son deportes."},{"palabras":["ola","bufanda","arena","concha"],"intruso":1,"razon":"Las otras son de la playa."},{"palabras":["cama","cobija","almohada","balón"],"intruso":3,"razon":"Las otras sirven para dormir."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 6',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["carta","teléfono","correo","árbol"],"intruso":3,"razon":"Las otras sirven para comunicarse."},{"palabras":["tronco","raíz","hoja","pared"],"intruso":3,"razon":"Las otras son partes de un árbol."},{"palabras":["maíz","arroz","pantalón","fríjol"],"intruso":2,"razon":"Las otras son granos."},{"palabras":["leche","yogur","queso","pan"],"intruso":3,"razon":"Las otras se hacen con leche."},{"palabras":["oveja","gallina","pingüino","cerdo"],"intruso":2,"razon":"Las otras son animales de granja."},{"palabras":["marcador","cuchara","esfero","lápiz"],"intruso":1,"razon":"Las otras sirven para escribir."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 7',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["barco","canoa","lancha","bicicleta"],"intruso":3,"razon":"Las otras van por el agua."},{"palabras":["naranja","limón","mandarina","banano"],"intruso":3,"razon":"Las otras son frutas cítricas."},{"palabras":["estrella","sol","zapato","luna"],"intruso":2,"razon":"Las otras se ven en el cielo."},{"palabras":["perro","tambor","gato","hámster"],"intruso":1,"razon":"Las otras son animales que se tienen en casa."},{"palabras":["gato","perro","mesa","caballo"],"intruso":2,"razon":"Las otras son animales."},{"palabras":["zanahoria","papaya","mango","lulo"],"intruso":0,"razon":"Las otras son frutas."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 8',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["silla","cama","sofá","banano"],"intruso":3,"razon":"Las otras son muebles."},{"palabras":["bus","taxi","cuchara","bicicleta"],"intruso":2,"razon":"Las otras sirven para moverse."},{"palabras":["falda","camisa","pantalón","piedra"],"intruso":3,"razon":"Las otras son ropa."},{"palabras":["verde","rojo","lápiz","azul"],"intruso":2,"razon":"Las otras son colores."},{"palabras":["jugo","zapato","tinto","agua"],"intruso":1,"razon":"Las otras se toman."},{"palabras":["puerta","mano","pie","cabeza"],"intruso":0,"razon":"Las otras son partes del cuerpo."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 9',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["tambor","flauta","pelota","guitarra"],"intruso":2,"razon":"Las otras son instrumentos musicales."},{"palabras":["águila","colibrí","vaca","loro"],"intruso":2,"razon":"Las otras son aves."},{"palabras":["borrador","lápiz","sartén","cuaderno"],"intruso":2,"razon":"Las otras son útiles escolares."},{"palabras":["árbol","olla","plato","cuchara"],"intruso":0,"razon":"Las otras se usan en la cocina."},{"palabras":["zanahoria","mango","cebolla","lechuga"],"intruso":1,"razon":"Las otras son verduras."},{"palabras":["parque","tienda","nube","escuela"],"intruso":2,"razon":"Las otras son lugares de una ciudad."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 10',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["viento","lluvia","nieve","silla"],"intruso":3,"razon":"Las otras tienen que ver con el clima."},{"palabras":["helado","destornillador","serrucho","martillo"],"intruso":0,"razon":"Las otras son herramientas."},{"palabras":["camión","margarita","rosa","girasol"],"intruso":0,"razon":"Las otras son flores."},{"palabras":["enero","jueves","lunes","martes"],"intruso":0,"razon":"Las otras son días de la semana."},{"palabras":["julio","domingo","marzo","enero"],"intruso":1,"razon":"Las otras son meses del año."},{"palabras":["cinco","azul","uno","nueve"],"intruso":1,"razon":"Las otras son números."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 11',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["cuadrado","mesa","círculo","triángulo"],"intruso":1,"razon":"Las otras son figuras geométricas."},{"palabras":["tenedor","galleta","helado","torta"],"intruso":0,"razon":"Las otras son postres."},{"palabras":["sardina","pato","trucha","atún"],"intruso":1,"razon":"Las otras son peces."},{"palabras":["balón","trompo","cometa","martillo"],"intruso":3,"razon":"Las otras son juguetes."},{"palabras":["baño","carro","sala","cocina"],"intruso":1,"razon":"Las otras son partes de una casa."},{"palabras":["pintor","tijera","panadero","maestro"],"intruso":1,"razon":"Las otras son personas con un oficio."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 12',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["mosca","elefante","abeja","hormiga"],"intruso":1,"razon":"Las otras son insectos."},{"palabras":["sombrero","ciclismo","fútbol","natación"],"intruso":0,"razon":"Las otras son deportes."},{"palabras":["concha","bufanda","arena","ola"],"intruso":1,"razon":"Las otras son de la playa."},{"palabras":["cama","balón","cobija","almohada"],"intruso":1,"razon":"Las otras sirven para dormir."},{"palabras":["correo","árbol","teléfono","carta"],"intruso":1,"razon":"Las otras sirven para comunicarse."},{"palabras":["hoja","pared","tronco","raíz"],"intruso":1,"razon":"Las otras son partes de un árbol."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso evidente, 13',
    1,
    '{"modo":"intruso","rondas":[{"palabras":["maíz","fríjol","arroz","pantalón"],"intruso":3,"razon":"Las otras son granos."},{"palabras":["yogur","queso","pan","leche"],"intruso":2,"razon":"Las otras se hacen con leche."},{"palabras":["cerdo","gallina","pingüino","oveja"],"intruso":2,"razon":"Las otras son animales de granja."},{"palabras":["cuchara","esfero","lápiz","marcador"],"intruso":0,"razon":"Las otras sirven para escribir."},{"palabras":["bicicleta","barco","canoa","lancha"],"intruso":0,"razon":"Las otras van por el agua."},{"palabras":["naranja","mandarina","limón","banano"],"intruso":3,"razon":"Las otras son frutas cítricas."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 1',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["guayaba","papaya","papa","mango"],"intruso":2,"razon":"Las otras son frutas; la papa es un tubérculo."},{"palabras":["lechuga","arracacha","yuca","papa"],"intruso":0,"razon":"Las otras son raíces que se cocinan."},{"palabras":["perro","vaca","gallina","delfín"],"intruso":2,"razon":"Las otras son mamíferos."},{"palabras":["pavo","pato","gallina","murciélago"],"intruso":3,"razon":"Las otras son aves; el murciélago es un mamífero."},{"palabras":["rana","tortuga","iguana","lagarto"],"intruso":0,"razon":"Las otras son reptiles; la rana es un anfibio."},{"palabras":["bicicleta","avión","cometa","helicóptero"],"intruso":0,"razon":"Las otras vuelan."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 2',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["violín","guitarra","tambor","arpa"],"intruso":2,"razon":"Las otras tienen cuerdas."},{"palabras":["piano","clarinete","trompeta","flauta"],"intruso":0,"razon":"Las otras se soplan."},{"palabras":["aguapanela","chocolate","limonada","tinto"],"intruso":2,"razon":"Las otras se toman calientes."},{"palabras":["huevo","arepa","pan","sancocho"],"intruso":3,"razon":"Las otras son comunes en el desayuno."},{"palabras":["arepa","sancocho","ajiaco","mondongo"],"intruso":0,"razon":"Las otras son sopas."},{"palabras":["metro","bus","patineta","taxi"],"intruso":2,"razon":"Las otras son transporte público."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 3',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["patineta","carro","canoa","bicicleta"],"intruso":2,"razon":"Las otras tienen ruedas."},{"palabras":["cuadrado","triángulo","rectángulo","círculo"],"intruso":3,"razon":"Las otras tienen lados rectos."},{"palabras":["azúcar","limón","panela","miel"],"intruso":1,"razon":"Las otras son dulces."},{"palabras":["jabón","cuchara","toalla","cepillo"],"intruso":1,"razon":"Las otras son para el aseo personal."},{"palabras":["estufa","licuadora","nevera","almohada"],"intruso":3,"razon":"Las otras se usan en la cocina."},{"palabras":["albañil","plomero","carpintero","pastelero"],"intruso":3,"razon":"Las otras trabajan en construcción."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 4',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["capítulo","página","tinta","portada"],"intruso":2,"razon":"Las otras son partes de un libro."},{"palabras":["periódico","vidrio","carta","cuaderno"],"intruso":1,"razon":"Las otras son de papel."},{"palabras":["ventana","vaso","espejo","cartón"],"intruso":3,"razon":"Las otras son de vidrio."},{"palabras":["escritorio","mesa","puerta","cadena"],"intruso":3,"razon":"Las otras suelen ser de madera."},{"palabras":["libro","moneda","pelota","plato"],"intruso":0,"razon":"Las otras son redondas."},{"palabras":["cobija","lámpara","estufa","vela"],"intruso":0,"razon":"Las otras se encienden."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 5',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["libro","revista","periódico","tambor"],"intruso":3,"razon":"Las otras se leen."},{"palabras":["nube","estrella","luna","montaña"],"intruso":3,"razon":"Las otras se ven en el cielo."},{"palabras":["río","camino","piedra","ola"],"intruso":3,"razon":"Las otras se ven en el campo; la ola es del mar."},{"palabras":["acelga","zanahoria","lechuga","espinaca"],"intruso":1,"razon":"Las otras son verduras de hoja."},{"palabras":["cereza","fresa","banano","mora"],"intruso":2,"razon":"Las otras son frutas rojas o moradas."},{"palabras":["búho","gallina","luciérnaga","murciélago"],"intruso":1,"razon":"Las otras salen de noche."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 6',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["martillo","rastrillo","pala","azadón"],"intruso":0,"razon":"Las otras se usan en el jardín."},{"palabras":["tijera","regla","metro","balanza"],"intruso":0,"razon":"Las otras sirven para medir."},{"palabras":["botas","impermeable","paraguas","sombrero"],"intruso":3,"razon":"Las otras sirven cuando llueve."},{"palabras":["gorra","bloqueador","bufanda","sombrero"],"intruso":2,"razon":"Las otras protegen del sol."},{"palabras":["transferencia","efectivo","tarjeta","cuaderno"],"intruso":3,"razon":"Las otras son maneras de pagar."},{"palabras":["francés","español","inglés","colombiano"],"intruso":3,"razon":"Las otras son idiomas; colombiano es un gentilicio."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 7',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["Quito","Cali","Bogotá","Medellín"],"intruso":0,"razon":"Las otras son ciudades de Colombia."},{"palabras":["Perú","España","Brasil","Chile"],"intruso":1,"razon":"Las otras son países de Sudamérica."},{"palabras":["yogur","almojábana","pan","torta"],"intruso":0,"razon":"Las otras se hornean."},{"palabras":["noche","tarde","lunes","mañana"],"intruso":2,"razon":"Las otras son momentos del día."},{"palabras":["mango","papaya","papa","guayaba"],"intruso":2,"razon":"Las otras son frutas; la papa es un tubérculo."},{"palabras":["papa","arracacha","yuca","lechuga"],"intruso":3,"razon":"Las otras son raíces que se cocinan."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 8',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["perro","vaca","gallina","delfín"],"intruso":2,"razon":"Las otras son mamíferos."},{"palabras":["pato","pavo","gallina","murciélago"],"intruso":3,"razon":"Las otras son aves; el murciélago es un mamífero."},{"palabras":["rana","iguana","lagarto","tortuga"],"intruso":0,"razon":"Las otras son reptiles; la rana es un anfibio."},{"palabras":["avión","bicicleta","cometa","helicóptero"],"intruso":1,"razon":"Las otras vuelan."},{"palabras":["arpa","guitarra","violín","tambor"],"intruso":3,"razon":"Las otras tienen cuerdas."},{"palabras":["trompeta","flauta","clarinete","piano"],"intruso":3,"razon":"Las otras se soplan."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 9',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["limonada","tinto","aguapanela","chocolate"],"intruso":0,"razon":"Las otras se toman calientes."},{"palabras":["pan","huevo","arepa","sancocho"],"intruso":3,"razon":"Las otras son comunes en el desayuno."},{"palabras":["sancocho","arepa","ajiaco","mondongo"],"intruso":1,"razon":"Las otras son sopas."},{"palabras":["patineta","bus","metro","taxi"],"intruso":0,"razon":"Las otras son transporte público."},{"palabras":["patineta","carro","bicicleta","canoa"],"intruso":3,"razon":"Las otras tienen ruedas."},{"palabras":["círculo","rectángulo","cuadrado","triángulo"],"intruso":0,"razon":"Las otras tienen lados rectos."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 10',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["azúcar","limón","miel","panela"],"intruso":1,"razon":"Las otras son dulces."},{"palabras":["cuchara","toalla","jabón","cepillo"],"intruso":0,"razon":"Las otras son para el aseo personal."},{"palabras":["nevera","licuadora","almohada","estufa"],"intruso":2,"razon":"Las otras se usan en la cocina."},{"palabras":["carpintero","albañil","pastelero","plomero"],"intruso":2,"razon":"Las otras trabajan en construcción."},{"palabras":["capítulo","portada","tinta","página"],"intruso":2,"razon":"Las otras son partes de un libro."},{"palabras":["carta","cuaderno","periódico","vidrio"],"intruso":3,"razon":"Las otras son de papel."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 11',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["vaso","cartón","ventana","espejo"],"intruso":1,"razon":"Las otras son de vidrio."},{"palabras":["mesa","escritorio","cadena","puerta"],"intruso":2,"razon":"Las otras suelen ser de madera."},{"palabras":["libro","pelota","plato","moneda"],"intruso":0,"razon":"Las otras son redondas."},{"palabras":["vela","lámpara","estufa","cobija"],"intruso":3,"razon":"Las otras se encienden."},{"palabras":["periódico","libro","tambor","revista"],"intruso":2,"razon":"Las otras se leen."},{"palabras":["montaña","luna","estrella","nube"],"intruso":0,"razon":"Las otras se ven en el cielo."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 12',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["camino","ola","río","piedra"],"intruso":1,"razon":"Las otras se ven en el campo; la ola es del mar."},{"palabras":["espinaca","acelga","zanahoria","lechuga"],"intruso":2,"razon":"Las otras son verduras de hoja."},{"palabras":["banano","fresa","mora","cereza"],"intruso":0,"razon":"Las otras son frutas rojas o moradas."},{"palabras":["búho","murciélago","luciérnaga","gallina"],"intruso":3,"razon":"Las otras salen de noche."},{"palabras":["pala","martillo","rastrillo","azadón"],"intruso":1,"razon":"Las otras se usan en el jardín."},{"palabras":["metro","regla","balanza","tijera"],"intruso":3,"razon":"Las otras sirven para medir."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso cercanas, 13',
    2,
    '{"modo":"intruso","rondas":[{"palabras":["paraguas","botas","impermeable","sombrero"],"intruso":3,"razon":"Las otras sirven cuando llueve."},{"palabras":["bloqueador","gorra","bufanda","sombrero"],"intruso":2,"razon":"Las otras protegen del sol."},{"palabras":["efectivo","cuaderno","tarjeta","transferencia"],"intruso":1,"razon":"Las otras son maneras de pagar."},{"palabras":["francés","colombiano","inglés","español"],"intruso":1,"razon":"Las otras son idiomas; colombiano es un gentilicio."},{"palabras":["Bogotá","Cali","Medellín","Quito"],"intruso":3,"razon":"Las otras son ciudades de Colombia."},{"palabras":["Perú","Brasil","España","Chile"],"intruso":2,"razon":"Las otras son países de Sudamérica."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 1',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["toalla","papel","piedra","camisa"],"intruso":2,"razon":"Las otras se pueden doblar."},{"palabras":["piano","cuaderno","computador","calculadora"],"intruso":1,"razon":"Las otras tienen teclas."},{"palabras":["avión","mariposa","pez","ave"],"intruso":2,"razon":"Las otras tienen alas."},{"palabras":["puerta","ventana","piedra","paraguas"],"intruso":2,"razon":"Las otras se abren y se cierran."},{"palabras":["banano","naranja","uva","papa"],"intruso":2,"razon":"Las otras se pelan antes de comerlas."},{"palabras":["silla","cuaderno","cama","mesa"],"intruso":1,"razon":"Las otras tienen patas."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 2',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["mesa","rueda","ventilador","trompo"],"intruso":0,"razon":"Las otras giran."},{"palabras":["esponja","pañuelo","toalla","plástico"],"intruso":3,"razon":"Las otras absorben agua."},{"palabras":["piedra","estrella","luciérnaga","linterna"],"intruso":0,"razon":"Las otras producen luz."},{"palabras":["globo","zapato","libro","cinta"],"intruso":2,"razon":"Las otras se atan."},{"palabras":["brújula","reloj","pino","taza"],"intruso":3,"razon":"Las otras tienen agujas."},{"palabras":["jarra","ave","montaña","mano"],"intruso":3,"razon":"Las otras tienen pico."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 3',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["perro","cometa","avión","mesa"],"intruso":3,"razon":"Las otras tienen cola."},{"palabras":["mesa","río","cueva","botella"],"intruso":0,"razon":"Las otras tienen boca."},{"palabras":["libro","taza","burro","montaña"],"intruso":1,"razon":"Las otras tienen lomo."},{"palabras":["camisa","jirafa","botella","mesa"],"intruso":3,"razon":"Las otras tienen cuello."},{"palabras":["resorte","chicle","liga","vidrio"],"intruso":3,"razon":"Las otras se estiran."},{"palabras":["radio","luz","televisor","puerta"],"intruso":3,"razon":"Las otras se prenden y se apagan."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 4',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["libro","tambor","guitarra","piano"],"intruso":0,"razon":"Las otras se tocan para hacer música."},{"palabras":["gelatina","galleta","torta","pan"],"intruso":0,"razon":"Las otras se hornean."},{"palabras":["cebolla","maíz","camisa","fríjol"],"intruso":2,"razon":"Las otras se siembran."},{"palabras":["serpiente","pez","gato","lagarto"],"intruso":2,"razon":"Las otras tienen escamas."},{"palabras":["manzana","pescado","rosa","cactus"],"intruso":0,"razon":"Las otras tienen espinas."},{"palabras":["piedra","mantequilla","helado","vela"],"intruso":0,"razon":"Las otras se derriten con el calor."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 5',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["cinta","cable","puerta","manguera"],"intruso":2,"razon":"Las otras se pueden enrollar."},{"palabras":["limón","esponja","naranja","zapato"],"intruso":3,"razon":"Las otras se exprimen."},{"palabras":["lámpara","ropa","cuadro","piedra"],"intruso":3,"razon":"Las otras se cuelgan."},{"palabras":["cajas","agua","libros","platos"],"intruso":1,"razon":"Las otras se pueden apilar."},{"palabras":["banano","hoja","cielo","piedra"],"intruso":3,"razon":"Las otras cambian de color con el tiempo."},{"palabras":["rueda","cuadrado","balón","moneda"],"intruso":1,"razon":"Las otras ruedan."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 6',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["olla","frasco","lápiz","caja"],"intruso":2,"razon":"Las otras tienen tapa."},{"palabras":["plato","maleta","chaqueta","cartuchera"],"intruso":0,"razon":"Las otras tienen cremallera."},{"palabras":["almohada","alarma","campana","timbre"],"intruso":0,"razon":"Las otras hacen sonido."},{"palabras":["balón","sartén","paraguas","escoba"],"intruso":0,"razon":"Las otras tienen mango."},{"palabras":["bandera","cebra","moneda","cuaderno"],"intruso":2,"razon":"Las otras tienen rayas."},{"palabras":["jabón","control","camisa","timbre"],"intruso":0,"razon":"Las otras tienen botones."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 7',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["avión","maleta","bus","casa"],"intruso":1,"razon":"Las otras tienen ventanas."},{"palabras":["ventilador","helicóptero","cama","barco"],"intruso":2,"razon":"Las otras tienen hélices."},{"palabras":["espejo","estadio","escalera","edificio"],"intruso":0,"razon":"Las otras tienen escalones."},{"palabras":["televisor","cuaderno","computador","celular"],"intruso":1,"razon":"Las otras tienen pantalla."},{"palabras":["piano","mesa","máquina de coser","bicicleta"],"intruso":1,"razon":"Las otras tienen pedales."},{"palabras":["espejo","árbol","edificio","sombrilla"],"intruso":0,"razon":"Las otras dan sombra."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 8',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["toalla","camisa","piedra","papel"],"intruso":2,"razon":"Las otras se pueden doblar."},{"palabras":["cuaderno","computador","piano","calculadora"],"intruso":0,"razon":"Las otras tienen teclas."},{"palabras":["avión","pez","ave","mariposa"],"intruso":1,"razon":"Las otras tienen alas."},{"palabras":["ventana","piedra","paraguas","puerta"],"intruso":1,"razon":"Las otras se abren y se cierran."},{"palabras":["uva","banano","naranja","papa"],"intruso":0,"razon":"Las otras se pelan antes de comerlas."},{"palabras":["cama","mesa","silla","cuaderno"],"intruso":3,"razon":"Las otras tienen patas."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 9',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["ventilador","mesa","trompo","rueda"],"intruso":1,"razon":"Las otras giran."},{"palabras":["toalla","esponja","pañuelo","plástico"],"intruso":3,"razon":"Las otras absorben agua."},{"palabras":["estrella","piedra","linterna","luciérnaga"],"intruso":1,"razon":"Las otras producen luz."},{"palabras":["zapato","libro","cinta","globo"],"intruso":1,"razon":"Las otras se atan."},{"palabras":["brújula","reloj","taza","pino"],"intruso":2,"razon":"Las otras tienen agujas."},{"palabras":["mano","ave","montaña","jarra"],"intruso":0,"razon":"Las otras tienen pico."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 10',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["mesa","cometa","avión","perro"],"intruso":0,"razon":"Las otras tienen cola."},{"palabras":["botella","mesa","río","cueva"],"intruso":1,"razon":"Las otras tienen boca."},{"palabras":["montaña","burro","taza","libro"],"intruso":2,"razon":"Las otras tienen lomo."},{"palabras":["camisa","mesa","jirafa","botella"],"intruso":1,"razon":"Las otras tienen cuello."},{"palabras":["chicle","liga","resorte","vidrio"],"intruso":3,"razon":"Las otras se estiran."},{"palabras":["luz","radio","televisor","puerta"],"intruso":3,"razon":"Las otras se prenden y se apagan."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 11',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["guitarra","piano","tambor","libro"],"intruso":3,"razon":"Las otras se tocan para hacer música."},{"palabras":["gelatina","galleta","torta","pan"],"intruso":0,"razon":"Las otras se hornean."},{"palabras":["fríjol","cebolla","maíz","camisa"],"intruso":3,"razon":"Las otras se siembran."},{"palabras":["lagarto","pez","gato","serpiente"],"intruso":2,"razon":"Las otras tienen escamas."},{"palabras":["pescado","cactus","manzana","rosa"],"intruso":2,"razon":"Las otras tienen espinas."},{"palabras":["helado","vela","piedra","mantequilla"],"intruso":2,"razon":"Las otras se derriten con el calor."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 12',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["cable","cinta","puerta","manguera"],"intruso":2,"razon":"Las otras se pueden enrollar."},{"palabras":["naranja","esponja","zapato","limón"],"intruso":2,"razon":"Las otras se exprimen."},{"palabras":["ropa","cuadro","piedra","lámpara"],"intruso":2,"razon":"Las otras se cuelgan."},{"palabras":["cajas","libros","agua","platos"],"intruso":2,"razon":"Las otras se pueden apilar."},{"palabras":["banano","piedra","cielo","hoja"],"intruso":1,"razon":"Las otras cambian de color con el tiempo."},{"palabras":["balón","rueda","cuadrado","moneda"],"intruso":2,"razon":"Las otras ruedan."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 13',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["caja","frasco","lápiz","olla"],"intruso":2,"razon":"Las otras tienen tapa."},{"palabras":["chaqueta","cartuchera","maleta","plato"],"intruso":3,"razon":"Las otras tienen cremallera."},{"palabras":["almohada","alarma","timbre","campana"],"intruso":0,"razon":"Las otras hacen sonido."},{"palabras":["escoba","sartén","paraguas","balón"],"intruso":3,"razon":"Las otras tienen mango."},{"palabras":["cebra","cuaderno","bandera","moneda"],"intruso":3,"razon":"Las otras tienen rayas."},{"palabras":["control","camisa","timbre","jabón"],"intruso":3,"razon":"Las otras tienen botones."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510102-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000102',
    'Intruso menos obvio, 14',
    3,
    '{"modo":"intruso","rondas":[{"palabras":["bus","maleta","casa","avión"],"intruso":1,"razon":"Las otras tienen ventanas."},{"palabras":["barco","helicóptero","ventilador","cama"],"intruso":3,"razon":"Las otras tienen hélices."},{"palabras":["espejo","escalera","estadio","edificio"],"intruso":0,"razon":"Las otras tienen escalones."},{"palabras":["televisor","celular","cuaderno","computador"],"intruso":2,"razon":"Las otras tienen pantalla."},{"palabras":["máquina de coser","mesa","piano","bicicleta"],"intruso":1,"razon":"Las otras tienen pedales."},{"palabras":["sombrilla","espejo","edificio","árbol"],"intruso":1,"razon":"Las otras dan sombra."}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-03 · Ordena por categoría: 40 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510103-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: frutas, verduras (1)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"frutas","nombre":"Frutas"},{"clave":"verduras","nombre":"Verduras"}],"elementos":[{"clave":"espinaca","nombre":"espinaca","cesta":"verduras"},{"clave":"lulo","nombre":"lulo","cesta":"frutas"},{"clave":"mango","nombre":"mango","cesta":"frutas"},{"clave":"zanahoria","nombre":"zanahoria","cesta":"verduras"},{"clave":"mora","nombre":"mora","cesta":"frutas"},{"clave":"pepino","nombre":"pepino","cesta":"verduras"},{"clave":"guayaba","nombre":"guayaba","cesta":"frutas"},{"clave":"cebolla","nombre":"cebolla","cesta":"verduras"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: animales, plantas (2)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"animales","nombre":"Animales"},{"clave":"plantas","nombre":"Plantas"}],"elementos":[{"clave":"loro","nombre":"loro","cesta":"animales"},{"clave":"pez","nombre":"pez","cesta":"animales"},{"clave":"gato","nombre":"gato","cesta":"animales"},{"clave":"helecho","nombre":"helecho","cesta":"plantas"},{"clave":"flor","nombre":"flor","cesta":"plantas"},{"clave":"cactus","nombre":"cactus","cesta":"plantas"},{"clave":"arbol","nombre":"árbol","cesta":"plantas"},{"clave":"perro","nombre":"perro","cesta":"animales"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: cocina, baño (3)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"cocina","nombre":"Cocina"},{"clave":"bano","nombre":"Baño"}],"elementos":[{"clave":"olla","nombre":"olla","cesta":"cocina"},{"clave":"espejo","nombre":"espejo","cesta":"bano"},{"clave":"plato","nombre":"plato","cesta":"cocina"},{"clave":"cepillo","nombre":"cepillo","cesta":"bano"},{"clave":"cuchara","nombre":"cuchara","cesta":"cocina"},{"clave":"toalla","nombre":"toalla","cesta":"bano"},{"clave":"sarten","nombre":"sartén","cesta":"cocina"},{"clave":"jabon","nombre":"jabón","cesta":"bano"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: ropa de abrigo, ropa fresca (4)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"ropa-de-abrigo","nombre":"Ropa de abrigo"},{"clave":"ropa-fresca","nombre":"Ropa fresca"}],"elementos":[{"clave":"camiseta","nombre":"camiseta","cesta":"ropa-fresca"},{"clave":"sandalias","nombre":"sandalias","cesta":"ropa-fresca"},{"clave":"gorra","nombre":"gorra","cesta":"ropa-fresca"},{"clave":"chaqueta","nombre":"chaqueta","cesta":"ropa-de-abrigo"},{"clave":"pantaloneta","nombre":"pantaloneta","cesta":"ropa-fresca"},{"clave":"bufanda","nombre":"bufanda","cesta":"ropa-de-abrigo"},{"clave":"guantes","nombre":"guantes","cesta":"ropa-de-abrigo"},{"clave":"gorro","nombre":"gorro","cesta":"ropa-de-abrigo"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: se come, se toma (5)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"se-come","nombre":"Se come"},{"clave":"se-toma","nombre":"Se toma"}],"elementos":[{"clave":"papa","nombre":"papa","cesta":"se-come"},{"clave":"queso","nombre":"queso","cesta":"se-come"},{"clave":"arepa","nombre":"arepa","cesta":"se-come"},{"clave":"agua","nombre":"agua","cesta":"se-toma"},{"clave":"jugo","nombre":"jugo","cesta":"se-toma"},{"clave":"huevo","nombre":"huevo","cesta":"se-come"},{"clave":"leche","nombre":"leche","cesta":"se-toma"},{"clave":"tinto","nombre":"tinto","cesta":"se-toma"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: de día, de noche (6)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"de-dia","nombre":"De día"},{"clave":"de-noche","nombre":"De noche"}],"elementos":[{"clave":"almuerzo","nombre":"almuerzo","cesta":"de-dia"},{"clave":"cobija","nombre":"cobija","cesta":"de-noche"},{"clave":"luna","nombre":"luna","cesta":"de-noche"},{"clave":"estrellas","nombre":"estrellas","cesta":"de-noche"},{"clave":"recreo","nombre":"recreo","cesta":"de-dia"},{"clave":"pijama","nombre":"pijama","cesta":"de-noche"},{"clave":"sol","nombre":"sol","cesta":"de-dia"},{"clave":"amanecer","nombre":"amanecer","cesta":"de-dia"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: para escribir, para leer (7)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"para-escribir","nombre":"Para escribir"},{"clave":"para-leer","nombre":"Para leer"}],"elementos":[{"clave":"libro","nombre":"libro","cesta":"para-leer"},{"clave":"periodico","nombre":"periódico","cesta":"para-leer"},{"clave":"lapiz","nombre":"lápiz","cesta":"para-escribir"},{"clave":"esfero","nombre":"esfero","cesta":"para-escribir"},{"clave":"marcador","nombre":"marcador","cesta":"para-escribir"},{"clave":"tiza","nombre":"tiza","cesta":"para-escribir"},{"clave":"revista","nombre":"revista","cesta":"para-leer"},{"clave":"cuento","nombre":"cuento","cesta":"para-leer"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: por tierra, por agua o aire (8)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"por-tierra","nombre":"Por tierra"},{"clave":"por-agua-o-aire","nombre":"Por agua o aire"}],"elementos":[{"clave":"barco","nombre":"barco","cesta":"por-agua-o-aire"},{"clave":"bicicleta","nombre":"bicicleta","cesta":"por-tierra"},{"clave":"avion","nombre":"avión","cesta":"por-agua-o-aire"},{"clave":"bus","nombre":"bus","cesta":"por-tierra"},{"clave":"helicoptero","nombre":"helicóptero","cesta":"por-agua-o-aire"},{"clave":"lancha","nombre":"lancha","cesta":"por-agua-o-aire"},{"clave":"tren","nombre":"tren","cesta":"por-tierra"},{"clave":"moto","nombre":"moto","cesta":"por-tierra"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: de cuerda, de percusión (9)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"de-cuerda","nombre":"De cuerda"},{"clave":"de-percusion","nombre":"De percusión"}],"elementos":[{"clave":"guitarra","nombre":"guitarra","cesta":"de-cuerda"},{"clave":"tambor","nombre":"tambor","cesta":"de-percusion"},{"clave":"pandereta","nombre":"pandereta","cesta":"de-percusion"},{"clave":"arpa","nombre":"arpa","cesta":"de-cuerda"},{"clave":"bongo","nombre":"bongó","cesta":"de-percusion"},{"clave":"violin","nombre":"violín","cesta":"de-cuerda"},{"clave":"maracas","nombre":"maracas","cesta":"de-percusion"},{"clave":"tiple","nombre":"tiple","cesta":"de-cuerda"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: herramientas, útiles escolares (10)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"herramientas","nombre":"Herramientas"},{"clave":"utiles-escolares","nombre":"Útiles escolares"}],"elementos":[{"clave":"destornillador","nombre":"destornillador","cesta":"herramientas"},{"clave":"borrador","nombre":"borrador","cesta":"utiles-escolares"},{"clave":"martillo","nombre":"martillo","cesta":"herramientas"},{"clave":"cuaderno","nombre":"cuaderno","cesta":"utiles-escolares"},{"clave":"serrucho","nombre":"serrucho","cesta":"herramientas"},{"clave":"taladro","nombre":"taladro","cesta":"herramientas"},{"clave":"regla","nombre":"regla","cesta":"utiles-escolares"},{"clave":"sacapuntas","nombre":"sacapuntas","cesta":"utiles-escolares"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: en la casa, en el colegio (11)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"en-la-casa","nombre":"En la casa"},{"clave":"en-el-colegio","nombre":"En el colegio"}],"elementos":[{"clave":"cama","nombre":"cama","cesta":"en-la-casa"},{"clave":"nevera","nombre":"nevera","cesta":"en-la-casa"},{"clave":"estufa","nombre":"estufa","cesta":"en-la-casa"},{"clave":"pupitre","nombre":"pupitre","cesta":"en-el-colegio"},{"clave":"biblioteca","nombre":"biblioteca","cesta":"en-el-colegio"},{"clave":"sofa","nombre":"sofá","cesta":"en-la-casa"},{"clave":"tablero","nombre":"tablero","cesta":"en-el-colegio"},{"clave":"patio-de-recreo","nombre":"patio de recreo","cesta":"en-el-colegio"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: dulce, salado (12)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"dulce","nombre":"Dulce"},{"clave":"salado","nombre":"Salado"}],"elementos":[{"clave":"panela","nombre":"panela","cesta":"dulce"},{"clave":"aceitunas","nombre":"aceitunas","cesta":"salado"},{"clave":"helado","nombre":"helado","cesta":"dulce"},{"clave":"chicharron","nombre":"chicharrón","cesta":"salado"},{"clave":"miel","nombre":"miel","cesta":"dulce"},{"clave":"empanada","nombre":"empanada","cesta":"salado"},{"clave":"torta","nombre":"torta","cesta":"dulce"},{"clave":"mani","nombre":"maní","cesta":"salado"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000103',
    'Dos cestas: grande, pequeño (13)',
    1,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Puedes arrastrarla o tocar la cesta.","cestas":[{"clave":"grande","nombre":"Grande"},{"clave":"pequeno","nombre":"Pequeño"}],"elementos":[{"clave":"elefante","nombre":"elefante","cesta":"grande"},{"clave":"edificio","nombre":"edificio","cesta":"grande"},{"clave":"boton","nombre":"botón","cesta":"pequeno"},{"clave":"camion","nombre":"camión","cesta":"grande"},{"clave":"moneda","nombre":"moneda","cesta":"pequeno"},{"clave":"grano-de-arroz","nombre":"grano de arroz","cesta":"pequeno"},{"clave":"ballena","nombre":"ballena","cesta":"grande"},{"clave":"hormiga","nombre":"hormiga","cesta":"pequeno"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: frutas, verduras, granos (1)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"frutas","nombre":"Frutas"},{"clave":"verduras","nombre":"Verduras"},{"clave":"granos","nombre":"Granos"}],"elementos":[{"clave":"frijol","nombre":"fríjol","cesta":"granos"},{"clave":"zanahoria","nombre":"zanahoria","cesta":"verduras"},{"clave":"mango","nombre":"mango","cesta":"frutas"},{"clave":"mora","nombre":"mora","cesta":"frutas"},{"clave":"lechuga","nombre":"lechuga","cesta":"verduras"},{"clave":"lulo","nombre":"lulo","cesta":"frutas"},{"clave":"arroz","nombre":"arroz","cesta":"granos"},{"clave":"cebolla","nombre":"cebolla","cesta":"verduras"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: mamíferos, aves, peces (2)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"mamiferos","nombre":"Mamíferos"},{"clave":"aves","nombre":"Aves"},{"clave":"peces","nombre":"Peces"}],"elementos":[{"clave":"vaca","nombre":"vaca","cesta":"mamiferos"},{"clave":"loro","nombre":"loro","cesta":"aves"},{"clave":"ballena","nombre":"ballena","cesta":"mamiferos"},{"clave":"perro","nombre":"perro","cesta":"mamiferos"},{"clave":"gallina","nombre":"gallina","cesta":"aves"},{"clave":"atun","nombre":"atún","cesta":"peces"},{"clave":"aguila","nombre":"águila","cesta":"aves"},{"clave":"trucha","nombre":"trucha","cesta":"peces"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: sala, cocina, baño (3)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"sala","nombre":"Sala"},{"clave":"cocina","nombre":"Cocina"},{"clave":"bano","nombre":"Baño"}],"elementos":[{"clave":"ducha","nombre":"ducha","cesta":"bano"},{"clave":"lavamanos","nombre":"lavamanos","cesta":"bano"},{"clave":"olla","nombre":"olla","cesta":"cocina"},{"clave":"televisor","nombre":"televisor","cesta":"sala"},{"clave":"lampara-de-pie","nombre":"lámpara de pie","cesta":"sala"},{"clave":"nevera","nombre":"nevera","cesta":"cocina"},{"clave":"sofa","nombre":"sofá","cesta":"sala"},{"clave":"estufa","nombre":"estufa","cesta":"cocina"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: mañana, tarde, noche (4)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"manana","nombre":"Mañana"},{"clave":"tarde","nombre":"Tarde"},{"clave":"noche","nombre":"Noche"}],"elementos":[{"clave":"luna","nombre":"luna","cesta":"noche"},{"clave":"despertador","nombre":"despertador","cesta":"manana"},{"clave":"atardecer","nombre":"atardecer","cesta":"tarde"},{"clave":"almuerzo","nombre":"almuerzo","cesta":"tarde"},{"clave":"desayuno","nombre":"desayuno","cesta":"manana"},{"clave":"cena","nombre":"cena","cesta":"noche"},{"clave":"amanecer","nombre":"amanecer","cesta":"manana"},{"clave":"siesta","nombre":"siesta","cesta":"tarde"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: trabajo, estudio, descanso (5)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"trabajo","nombre":"Trabajo"},{"clave":"estudio","nombre":"Estudio"},{"clave":"descanso","nombre":"Descanso"}],"elementos":[{"clave":"oficina","nombre":"oficina","cesta":"trabajo"},{"clave":"examen","nombre":"examen","cesta":"estudio"},{"clave":"reunion","nombre":"reunión","cesta":"trabajo"},{"clave":"cuaderno","nombre":"cuaderno","cesta":"estudio"},{"clave":"hamaca","nombre":"hamaca","cesta":"descanso"},{"clave":"siesta","nombre":"siesta","cesta":"descanso"},{"clave":"tarea","nombre":"tarea","cesta":"estudio"},{"clave":"factura","nombre":"factura","cesta":"trabajo"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: tierra, agua, aire (6)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"tierra","nombre":"Tierra"},{"clave":"agua","nombre":"Agua"},{"clave":"aire","nombre":"Aire"}],"elementos":[{"clave":"pez","nombre":"pez","cesta":"agua"},{"clave":"conejo","nombre":"conejo","cesta":"tierra"},{"clave":"medusa","nombre":"medusa","cesta":"agua"},{"clave":"hormiga","nombre":"hormiga","cesta":"tierra"},{"clave":"caballo","nombre":"caballo","cesta":"tierra"},{"clave":"mariposa","nombre":"mariposa","cesta":"aire"},{"clave":"delfin","nombre":"delfín","cesta":"agua"},{"clave":"aguila","nombre":"águila","cesta":"aire"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: papel, vidrio, metal (7)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"papel","nombre":"Papel"},{"clave":"vidrio","nombre":"Vidrio"},{"clave":"metal","nombre":"Metal"}],"elementos":[{"clave":"olla","nombre":"olla","cesta":"metal"},{"clave":"carta","nombre":"carta","cesta":"papel"},{"clave":"vaso","nombre":"vaso","cesta":"vidrio"},{"clave":"llave","nombre":"llave","cesta":"metal"},{"clave":"cuaderno","nombre":"cuaderno","cesta":"papel"},{"clave":"periodico","nombre":"periódico","cesta":"papel"},{"clave":"espejo","nombre":"espejo","cesta":"vidrio"},{"clave":"ventana","nombre":"ventana","cesta":"vidrio"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: con balón, en el agua, en pista (8)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"con-balon","nombre":"Con balón"},{"clave":"en-el-agua","nombre":"En el agua"},{"clave":"en-pista","nombre":"En pista"}],"elementos":[{"clave":"atletismo","nombre":"atletismo","cesta":"en-pista"},{"clave":"voleibol","nombre":"voleibol","cesta":"con-balon"},{"clave":"ciclismo","nombre":"ciclismo","cesta":"en-pista"},{"clave":"baloncesto","nombre":"baloncesto","cesta":"con-balon"},{"clave":"futbol","nombre":"fútbol","cesta":"con-balon"},{"clave":"natacion","nombre":"natación","cesta":"en-el-agua"},{"clave":"remo","nombre":"remo","cesta":"en-el-agua"},{"clave":"buceo","nombre":"buceo","cesta":"en-el-agua"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: cálidos, fríos, neutros (9)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"calidos","nombre":"Cálidos"},{"clave":"frios","nombre":"Fríos"},{"clave":"neutros","nombre":"Neutros"}],"elementos":[{"clave":"verde","nombre":"verde","cesta":"frios"},{"clave":"azul","nombre":"azul","cesta":"frios"},{"clave":"rojo","nombre":"rojo","cesta":"calidos"},{"clave":"naranja","nombre":"naranja","cesta":"calidos"},{"clave":"gris","nombre":"gris","cesta":"neutros"},{"clave":"blanco","nombre":"blanco","cesta":"neutros"},{"clave":"violeta","nombre":"violeta","cesta":"frios"},{"clave":"amarillo","nombre":"amarillo","cesta":"calidos"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: de cuerda, de viento, de percusión (10)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"de-cuerda","nombre":"De cuerda"},{"clave":"de-viento","nombre":"De viento"},{"clave":"de-percusion","nombre":"De percusión"}],"elementos":[{"clave":"flauta","nombre":"flauta","cesta":"de-viento"},{"clave":"clarinete","nombre":"clarinete","cesta":"de-viento"},{"clave":"tambor","nombre":"tambor","cesta":"de-percusion"},{"clave":"guitarra","nombre":"guitarra","cesta":"de-cuerda"},{"clave":"trompeta","nombre":"trompeta","cesta":"de-viento"},{"clave":"arpa","nombre":"arpa","cesta":"de-cuerda"},{"clave":"violin","nombre":"violín","cesta":"de-cuerda"},{"clave":"maracas","nombre":"maracas","cesta":"de-percusion"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: en el mar, en el río, en la montaña (11)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"en-el-mar","nombre":"En el mar"},{"clave":"en-el-rio","nombre":"En el río"},{"clave":"en-la-montana","nombre":"En la montaña"}],"elementos":[{"clave":"ola","nombre":"ola","cesta":"en-el-mar"},{"clave":"orilla","nombre":"orilla","cesta":"en-el-rio"},{"clave":"concha","nombre":"concha","cesta":"en-el-mar"},{"clave":"canoa","nombre":"canoa","cesta":"en-el-rio"},{"clave":"cima","nombre":"cima","cesta":"en-la-montana"},{"clave":"playa","nombre":"playa","cesta":"en-el-mar"},{"clave":"puente","nombre":"puente","cesta":"en-el-rio"},{"clave":"neblina","nombre":"neblina","cesta":"en-la-montana"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: cabeza, brazos y manos, piernas y pies (12)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"cabeza","nombre":"Cabeza"},{"clave":"brazos-y-manos","nombre":"Brazos y manos"},{"clave":"piernas-y-pies","nombre":"Piernas y pies"}],"elementos":[{"clave":"ojo","nombre":"ojo","cesta":"cabeza"},{"clave":"tobillo","nombre":"tobillo","cesta":"piernas-y-pies"},{"clave":"dedo","nombre":"dedo","cesta":"brazos-y-manos"},{"clave":"rodilla","nombre":"rodilla","cesta":"piernas-y-pies"},{"clave":"oreja","nombre":"oreja","cesta":"cabeza"},{"clave":"nariz","nombre":"nariz","cesta":"cabeza"},{"clave":"muneca","nombre":"muñeca","cesta":"brazos-y-manos"},{"clave":"codo","nombre":"codo","cesta":"brazos-y-manos"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas: pueblo, ciudad, campo (13)',
    2,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"pueblo","nombre":"Pueblo"},{"clave":"ciudad","nombre":"Ciudad"},{"clave":"campo","nombre":"Campo"}],"elementos":[{"clave":"semaforo","nombre":"semáforo","cesta":"ciudad"},{"clave":"metro","nombre":"metro","cesta":"ciudad"},{"clave":"rascacielos","nombre":"rascacielos","cesta":"ciudad"},{"clave":"finca","nombre":"finca","cesta":"campo"},{"clave":"mercado","nombre":"mercado","cesta":"pueblo"},{"clave":"cosecha","nombre":"cosecha","cesta":"campo"},{"clave":"plaza","nombre":"plaza","cesta":"pueblo"},{"clave":"kiosco","nombre":"kiosco","cesta":"pueblo"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: fruta, verdura, condimento (1)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"fruta","nombre":"Fruta"},{"clave":"verdura","nombre":"Verdura"},{"clave":"condimento","nombre":"Condimento"}],"elementos":[{"clave":"tomate","nombre":"tomate","cesta":["fruta","verdura"]},{"clave":"mango","nombre":"mango","cesta":"fruta"},{"clave":"zanahoria","nombre":"zanahoria","cesta":"verdura"},{"clave":"ajo","nombre":"ajo","cesta":"condimento"},{"clave":"cilantro","nombre":"cilantro","cesta":"condimento"},{"clave":"lulo","nombre":"lulo","cesta":"fruta"},{"clave":"lechuga","nombre":"lechuga","cesta":"verdura"},{"clave":"aguacate","nombre":"aguacate","cesta":["fruta","verdura"]}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: desayuno, almuerzo, postre (2)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"desayuno","nombre":"Desayuno"},{"clave":"almuerzo","nombre":"Almuerzo"},{"clave":"postre","nombre":"Postre"}],"elementos":[{"clave":"huevo","nombre":"huevo","cesta":"desayuno"},{"clave":"arepa","nombre":"arepa","cesta":["desayuno","almuerzo"]},{"clave":"sopa","nombre":"sopa","cesta":"almuerzo"},{"clave":"helado","nombre":"helado","cesta":"postre"},{"clave":"flan","nombre":"flan","cesta":"postre"},{"clave":"arroz","nombre":"arroz","cesta":"almuerzo"},{"clave":"chocolate","nombre":"chocolate","cesta":"desayuno"},{"clave":"fruta-picada","nombre":"fruta picada","cesta":["desayuno","postre"]}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: vuela, nada, camina (3)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"vuela","nombre":"Vuela"},{"clave":"nada","nombre":"Nada"},{"clave":"camina","nombre":"Camina"}],"elementos":[{"clave":"mariposa","nombre":"mariposa","cesta":"vuela"},{"clave":"tortuga","nombre":"tortuga","cesta":["nada","camina"]},{"clave":"delfin","nombre":"delfín","cesta":"nada"},{"clave":"pez","nombre":"pez","cesta":"nada"},{"clave":"caballo","nombre":"caballo","cesta":"camina"},{"clave":"aguila","nombre":"águila","cesta":"vuela"},{"clave":"pato","nombre":"pato","cesta":["vuela","nada","camina"]},{"clave":"conejo","nombre":"conejo","cesta":"camina"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: para escribir, para pegar o cortar, para medir (4)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"para-escribir","nombre":"Para escribir"},{"clave":"para-pegar-o-cortar","nombre":"Para pegar o cortar"},{"clave":"para-medir","nombre":"Para medir"}],"elementos":[{"clave":"pegante","nombre":"pegante","cesta":"para-pegar-o-cortar"},{"clave":"metro","nombre":"metro","cesta":"para-medir"},{"clave":"cinta","nombre":"cinta","cesta":["para-pegar-o-cortar","para-medir"]},{"clave":"tijera","nombre":"tijera","cesta":"para-pegar-o-cortar"},{"clave":"regla","nombre":"regla","cesta":"para-medir"},{"clave":"esfero","nombre":"esfero","cesta":"para-escribir"},{"clave":"tiza","nombre":"tiza","cesta":"para-escribir"},{"clave":"lapiz","nombre":"lápiz","cesta":"para-escribir"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: madera, metal, plástico (5)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"madera","nombre":"Madera"},{"clave":"metal","nombre":"Metal"},{"clave":"plastico","nombre":"Plástico"}],"elementos":[{"clave":"botella","nombre":"botella","cesta":"plastico"},{"clave":"silla","nombre":"silla","cesta":["madera","plastico"]},{"clave":"balde","nombre":"balde","cesta":"plastico"},{"clave":"llave","nombre":"llave","cesta":"metal"},{"clave":"mesa","nombre":"mesa","cesta":"madera"},{"clave":"puerta","nombre":"puerta","cesta":"madera"},{"clave":"olla","nombre":"olla","cesta":"metal"},{"clave":"cuchara","nombre":"cuchara","cesta":["madera","metal"]}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: en equipo, individual, con raqueta (6)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"en-equipo","nombre":"En equipo"},{"clave":"individual","nombre":"Individual"},{"clave":"con-raqueta","nombre":"Con raqueta"}],"elementos":[{"clave":"natacion","nombre":"natación","cesta":"individual"},{"clave":"futbol","nombre":"fútbol","cesta":"en-equipo"},{"clave":"badminton","nombre":"bádminton","cesta":["individual","con-raqueta"]},{"clave":"voleibol","nombre":"voleibol","cesta":"en-equipo"},{"clave":"tenis-de-mesa","nombre":"tenis de mesa","cesta":"con-raqueta"},{"clave":"tenis","nombre":"tenis","cesta":["individual","con-raqueta"]},{"clave":"baloncesto","nombre":"baloncesto","cesta":"en-equipo"},{"clave":"atletismo","nombre":"atletismo","cesta":"individual"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: mañana, tarde, noche (7)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"manana","nombre":"Mañana"},{"clave":"tarde","nombre":"Tarde"},{"clave":"noche","nombre":"Noche"}],"elementos":[{"clave":"almuerzo","nombre":"almuerzo","cesta":"tarde"},{"clave":"tarea","nombre":"tarea","cesta":["tarde","noche"]},{"clave":"atardecer","nombre":"atardecer","cesta":"tarde"},{"clave":"cena","nombre":"cena","cesta":"noche"},{"clave":"pijama","nombre":"pijama","cesta":"noche"},{"clave":"desayuno","nombre":"desayuno","cesta":"manana"},{"clave":"cafe","nombre":"café","cesta":["manana","tarde"]},{"clave":"despertador","nombre":"despertador","cesta":"manana"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: rojo, verde, amarillo (8)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"rojo","nombre":"Rojo"},{"clave":"verde","nombre":"Verde"},{"clave":"amarillo","nombre":"Amarillo"}],"elementos":[{"clave":"cereza","nombre":"cereza","cesta":"rojo"},{"clave":"girasol","nombre":"girasol","cesta":"amarillo"},{"clave":"limon","nombre":"limón","cesta":["verde","amarillo"]},{"clave":"lechuga","nombre":"lechuga","cesta":"verde"},{"clave":"mango","nombre":"mango","cesta":["verde","amarillo"]},{"clave":"hoja","nombre":"hoja","cesta":"verde"},{"clave":"fresa","nombre":"fresa","cesta":"rojo"},{"clave":"banano","nombre":"banano","cesta":"amarillo"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: se enciende, se abre, se llena (9)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"se-enciende","nombre":"Se enciende"},{"clave":"se-abre","nombre":"Se abre"},{"clave":"se-llena","nombre":"Se llena"}],"elementos":[{"clave":"llave-del-agua","nombre":"llave del agua","cesta":["se-abre","se-llena"]},{"clave":"luz","nombre":"luz","cesta":"se-enciende"},{"clave":"nevera","nombre":"nevera","cesta":["se-abre","se-enciende"]},{"clave":"ventana","nombre":"ventana","cesta":"se-abre"},{"clave":"puerta","nombre":"puerta","cesta":"se-abre"},{"clave":"vaso","nombre":"vaso","cesta":"se-llena"},{"clave":"tanque","nombre":"tanque","cesta":"se-llena"},{"clave":"estufa","nombre":"estufa","cesta":"se-enciende"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: de hoja, de raíz, de fruto (10)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"de-hoja","nombre":"De hoja"},{"clave":"de-raiz","nombre":"De raíz"},{"clave":"de-fruto","nombre":"De fruto"}],"elementos":[{"clave":"espinaca","nombre":"espinaca","cesta":"de-hoja"},{"clave":"pepino","nombre":"pepino","cesta":"de-fruto"},{"clave":"ahuyama","nombre":"ahuyama","cesta":"de-fruto"},{"clave":"remolacha","nombre":"remolacha","cesta":["de-raiz","de-hoja"]},{"clave":"pimenton","nombre":"pimentón","cesta":"de-fruto"},{"clave":"zanahoria","nombre":"zanahoria","cesta":"de-raiz"},{"clave":"lechuga","nombre":"lechuga","cesta":"de-hoja"},{"clave":"yuca","nombre":"yuca","cesta":"de-raiz"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: en la casa, en la calle, en el parque (11)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"en-la-casa","nombre":"En la casa"},{"clave":"en-la-calle","nombre":"En la calle"},{"clave":"en-el-parque","nombre":"En el parque"}],"elementos":[{"clave":"semaforo","nombre":"semáforo","cesta":"en-la-calle"},{"clave":"nevera","nombre":"nevera","cesta":"en-la-casa"},{"clave":"bicicleta","nombre":"bicicleta","cesta":["en-la-casa","en-la-calle"]},{"clave":"fuente","nombre":"fuente","cesta":"en-el-parque"},{"clave":"anden","nombre":"andén","cesta":"en-la-calle"},{"clave":"columpio","nombre":"columpio","cesta":"en-el-parque"},{"clave":"cama","nombre":"cama","cesta":"en-la-casa"},{"clave":"banca","nombre":"banca","cesta":["en-la-calle","en-el-parque"]}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: se escucha, se ve, se toca (12)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"se-escucha","nombre":"Se escucha"},{"clave":"se-ve","nombre":"Se ve"},{"clave":"se-toca","nombre":"Se toca"}],"elementos":[{"clave":"lana","nombre":"lana","cesta":"se-toca"},{"clave":"campana","nombre":"campana","cesta":"se-escucha"},{"clave":"arena","nombre":"arena","cesta":"se-toca"},{"clave":"piano","nombre":"piano","cesta":["se-escucha","se-toca"]},{"clave":"musica","nombre":"música","cesta":"se-escucha"},{"clave":"fuego","nombre":"fuego","cesta":["se-ve","se-toca"]},{"clave":"arcoiris","nombre":"arcoíris","cesta":"se-ve"},{"clave":"estrella","nombre":"estrella","cesta":"se-ve"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: se usa en la lluvia, se usa con el sol, se usa con frío (13)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"se-usa-en-la-lluvia","nombre":"Se usa en la lluvia"},{"clave":"se-usa-con-el-sol","nombre":"Se usa con el sol"},{"clave":"se-usa-con-frio","nombre":"Se usa con frío"}],"elementos":[{"clave":"guantes","nombre":"guantes","cesta":"se-usa-con-frio"},{"clave":"botas-de-caucho","nombre":"botas de caucho","cesta":"se-usa-en-la-lluvia"},{"clave":"gafas","nombre":"gafas","cesta":"se-usa-con-el-sol"},{"clave":"bloqueador","nombre":"bloqueador","cesta":"se-usa-con-el-sol"},{"clave":"bufanda","nombre":"bufanda","cesta":"se-usa-con-frio"},{"clave":"paraguas","nombre":"paraguas","cesta":"se-usa-en-la-lluvia"},{"clave":"chaqueta","nombre":"chaqueta","cesta":["se-usa-con-frio","se-usa-en-la-lluvia"]},{"clave":"sombrero","nombre":"sombrero","cesta":["se-usa-con-el-sol","se-usa-en-la-lluvia"]}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510103-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000103',
    'Tres cestas, con dudas: se cocina, se come crudo, se toma (14)',
    3,
    '{"modo":"cestas","indicacion":"Lleva cada cosa a su cesta. Si una cabe en dos, vale cualquiera de las dos.","cestas":[{"clave":"se-cocina","nombre":"Se cocina"},{"clave":"se-come-crudo","nombre":"Se come crudo"},{"clave":"se-toma","nombre":"Se toma"}],"elementos":[{"clave":"sopa","nombre":"sopa","cesta":["se-cocina","se-toma"]},{"clave":"mango","nombre":"mango","cesta":"se-come-crudo"},{"clave":"lechuga","nombre":"lechuga","cesta":"se-come-crudo"},{"clave":"zanahoria","nombre":"zanahoria","cesta":["se-cocina","se-come-crudo"]},{"clave":"arroz","nombre":"arroz","cesta":"se-cocina"},{"clave":"agua-de-panela","nombre":"agua de panela","cesta":"se-toma"},{"clave":"jugo","nombre":"jugo","cesta":"se-toma"},{"clave":"frijol","nombre":"fríjol","cesta":"se-cocina"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-04 · Cuentas con calma: 40 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510104-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000104',
    'Sumas sin llevada, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuánto es 67 + 2?","opciones":["69","79","68"],"correcta":0},{"enunciado":"¿Cuánto es 15 + 31?","opciones":["47","46","55"],"correcta":1},{"enunciado":"¿Cuánto es 77 + 1?","opciones":["78","87","77"],"correcta":0},{"enunciado":"¿Cuánto es 46 + 13?","opciones":["59","57","48"],"correcta":0},{"enunciado":"¿Cuánto es 37 + 51?","opciones":["88","99","89"],"correcta":0},{"enunciado":"¿Cuánto es 35 + 32?","opciones":["77","66","67"],"correcta":2},{"enunciado":"¿Cuánto es 68 + 31?","opciones":["110","101","99"],"correcta":2},{"enunciado":"¿Cuánto es 17 + 41?","opciones":["56","57","58"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000104',
    'Sumas con llevada, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuánto es 38 + 16?","opciones":["43","64","54"],"correcta":2},{"enunciado":"¿Cuánto es 31 + 39?","opciones":["80","61","70"],"correcta":2},{"enunciado":"¿Cuánto es 19 + 36?","opciones":["55","66","46"],"correcta":0},{"enunciado":"¿Cuánto es 19 + 25?","opciones":["43","44","54"],"correcta":1},{"enunciado":"¿Cuánto es 33 + 17?","opciones":["50","39","40"],"correcta":0},{"enunciado":"¿Cuánto es 36 + 29?","opciones":["66","76","65"],"correcta":2},{"enunciado":"¿Cuánto es 25 + 35?","opciones":["60","69","70"],"correcta":0},{"enunciado":"¿Cuánto es 28 + 24?","opciones":["63","54","52"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000104',
    'Restas, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuánto es 48 - 38?","opciones":["1","10","21"],"correcta":1},{"enunciado":"¿Cuánto es 56 - 38?","opciones":["18","17","9"],"correcta":0},{"enunciado":"¿Cuánto es 49 - 28?","opciones":["30","10","21"],"correcta":2},{"enunciado":"¿Cuánto es 29 - 18?","opciones":["22","11","20"],"correcta":1},{"enunciado":"¿Cuánto es 31 - 20?","opciones":["21","11","1"],"correcta":1},{"enunciado":"¿Cuánto es 61 - 40?","opciones":["21","23","10"],"correcta":0},{"enunciado":"¿Cuánto es 45 - 15?","opciones":["29","19","30"],"correcta":2},{"enunciado":"¿Cuánto es 22 - 16?","opciones":["6","5","7"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000104',
    'Dobles, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuál es el doble de 16?","opciones":["43","32","30"],"correcta":1},{"enunciado":"¿Cuál es el doble de 19?","opciones":["28","49","38"],"correcta":2},{"enunciado":"¿Cuál es el doble de 12?","opciones":["15","26","24"],"correcta":2},{"enunciado":"¿Cuál es el doble de 7?","opciones":["14","5","24"],"correcta":0},{"enunciado":"¿Cuál es el doble de 23?","opciones":["36","48","46"],"correcta":2},{"enunciado":"¿Cuál es el doble de 8?","opciones":["16","25","17"],"correcta":0},{"enunciado":"¿Cuál es el doble de 14?","opciones":["29","37","28"],"correcta":2},{"enunciado":"¿Cuál es el doble de 11?","opciones":["23","22","33"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000104',
    'Mitades, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuál es la mitad de 20?","opciones":["19","10","20"],"correcta":1},{"enunciado":"¿Cuál es la mitad de 6?","opciones":["3","13","5"],"correcta":0},{"enunciado":"¿Cuál es la mitad de 12?","opciones":["6","5","7"],"correcta":0},{"enunciado":"¿Cuál es la mitad de 18?","opciones":["10","11","9"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 22?","opciones":["9","22","11"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 10?","opciones":["15","14","5"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 8?","opciones":["6","3","4"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 16?","opciones":["7","6","8"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000104',
    'Tablas, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuánto es 4 × 3?","opciones":["12","10","14"],"correcta":0},{"enunciado":"¿Cuánto es 2 × 3?","opciones":["4","6","15"],"correcta":1},{"enunciado":"¿Cuánto es 2 × 2?","opciones":["4","13","2"],"correcta":0},{"enunciado":"¿Cuánto es 4 × 4?","opciones":["5","25","16"],"correcta":2},{"enunciado":"¿Cuánto es 5 × 4?","opciones":["20","10","22"],"correcta":0},{"enunciado":"¿Cuánto es 3 × 5?","opciones":["26","13","15"],"correcta":2},{"enunciado":"¿Cuánto es 5 × 2?","opciones":["8","19","10"],"correcta":2},{"enunciado":"¿Cuánto es 4 × 2?","opciones":["8","7","9"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000104',
    'Completar la decena, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuánto falta para llegar a 50 desde 48?","opciones":["11","2","3"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 20 desde 13?","opciones":["18","7","8"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 60 desde 54?","opciones":["8","6","7"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 20 desde 14?","opciones":["4","8","6"],"correcta":2},{"enunciado":"¿Cuánto falta para llegar a 60 desde 56?","opciones":["2","4","13"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 50 desde 41?","opciones":["18","20","9"],"correcta":2},{"enunciado":"¿Cuánto falta para llegar a 20 desde 17?","opciones":["1","3","4"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 60 desde 52?","opciones":["7","6","8"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000104',
    'Redondear, nivel 1',
    1,
    '{"rondas":[{"enunciado":"Redondea 31 a la decena más cercana.","opciones":["40","30","20"],"correcta":1},{"enunciado":"Redondea 53 a la decena más cercana.","opciones":["50","60","40"],"correcta":0},{"enunciado":"Redondea 73 a la decena más cercana.","opciones":["80","70","60"],"correcta":1},{"enunciado":"Redondea 47 a la decena más cercana.","opciones":["40","50","60"],"correcta":1},{"enunciado":"Redondea 71 a la decena más cercana.","opciones":["80","70","60"],"correcta":1},{"enunciado":"Redondea 94 a la decena más cercana.","opciones":["90","100","80"],"correcta":0},{"enunciado":"Redondea 77 a la decena más cercana.","opciones":["90","70","80"],"correcta":2},{"enunciado":"Redondea 82 a la decena más cercana.","opciones":["90","80","70"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000104',
    'Tres números, nivel 1',
    1,
    '{"rondas":[{"enunciado":"¿Cuánto es 9 + 2 + 4?","opciones":["25","15","17"],"correcta":1},{"enunciado":"¿Cuánto es 6 + 9 + 5?","opciones":["10","18","20"],"correcta":2},{"enunciado":"¿Cuánto es 5 + 8 + 5?","opciones":["29","28","18"],"correcta":2},{"enunciado":"¿Cuánto es 8 + 8 + 9?","opciones":["24","27","25"],"correcta":2},{"enunciado":"¿Cuánto es 6 + 7 + 5?","opciones":["27","18","28"],"correcta":1},{"enunciado":"¿Cuánto es 7 + 6 + 8?","opciones":["21","11","32"],"correcta":0},{"enunciado":"¿Cuánto es 2 + 6 + 5?","opciones":["11","24","13"],"correcta":2},{"enunciado":"¿Cuánto es 4 + 2 + 9?","opciones":["25","5","15"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000104',
    'Cuánto falta, nivel 1',
    1,
    '{"rondas":[{"enunciado":"19 + ? = 23. ¿Qué número falta?","opciones":["13","6","4"],"correcta":2},{"enunciado":"26 + ? = 29. ¿Qué número falta?","opciones":["13","3","14"],"correcta":1},{"enunciado":"24 + ? = 30. ¿Qué número falta?","opciones":["6","17","8"],"correcta":0},{"enunciado":"10 + ? = 20. ¿Qué número falta?","opciones":["12","8","10"],"correcta":2},{"enunciado":"20 + ? = 27. ¿Qué número falta?","opciones":["16","9","7"],"correcta":2},{"enunciado":"15 + ? = 24. ¿Qué número falta?","opciones":["9","7","18"],"correcta":0},{"enunciado":"12 + ? = 20. ¿Qué número falta?","opciones":["17","19","8"],"correcta":2},{"enunciado":"13 + ? = 17. ¿Qué número falta?","opciones":["4","6","15"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000104',
    'Sumas sin llevada, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuánto es 167 + 601?","opciones":["757","768","769"],"correcta":1},{"enunciado":"¿Cuánto es 658 + 331?","opciones":["1000","989","978"],"correcta":1},{"enunciado":"¿Cuánto es 523 + 242?","opciones":["775","765","776"],"correcta":1},{"enunciado":"¿Cuánto es 656 + 211?","opciones":["868","865","867"],"correcta":2},{"enunciado":"¿Cuánto es 322 + 556?","opciones":["888","877","878"],"correcta":2},{"enunciado":"¿Cuánto es 742 + 127?","opciones":["871","879","869"],"correcta":2},{"enunciado":"¿Cuánto es 787 + 111?","opciones":["899","898","889"],"correcta":1},{"enunciado":"¿Cuánto es 108 + 721?","opciones":["829","838","828"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000104',
    'Sumas con llevada, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuánto es 37 + 85?","opciones":["122","112","111"],"correcta":0},{"enunciado":"¿Cuánto es 92 + 88?","opciones":["169","179","180"],"correcta":2},{"enunciado":"¿Cuánto es 59 + 83?","opciones":["131","142","141"],"correcta":1},{"enunciado":"¿Cuánto es 48 + 79?","opciones":["127","117","116"],"correcta":0},{"enunciado":"¿Cuánto es 76 + 48?","opciones":["124","135","123"],"correcta":0},{"enunciado":"¿Cuánto es 65 + 56?","opciones":["123","121","112"],"correcta":1},{"enunciado":"¿Cuánto es 57 + 36?","opciones":["93","84","91"],"correcta":0},{"enunciado":"¿Cuánto es 58 + 58?","opciones":["117","116","127"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000104',
    'Restas, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuánto es 110 - 50?","opciones":["58","60","69"],"correcta":1},{"enunciado":"¿Cuánto es 104 - 38?","opciones":["57","76","66"],"correcta":2},{"enunciado":"¿Cuánto es 96 - 28?","opciones":["59","68","78"],"correcta":1},{"enunciado":"¿Cuánto es 108 - 35?","opciones":["84","83","73"],"correcta":2},{"enunciado":"¿Cuánto es 93 - 65?","opciones":["28","18","39"],"correcta":0},{"enunciado":"¿Cuánto es 38 - 28?","opciones":["10","12","21"],"correcta":0},{"enunciado":"¿Cuánto es 103 - 47?","opciones":["66","55","56"],"correcta":2},{"enunciado":"¿Cuánto es 108 - 33?","opciones":["74","75","64"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000104',
    'Dobles, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuál es el doble de 29?","opciones":["68","56","58"],"correcta":2},{"enunciado":"¿Cuál es el doble de 59?","opciones":["129","127","118"],"correcta":2},{"enunciado":"¿Cuál es el doble de 62?","opciones":["123","124","134"],"correcta":1},{"enunciado":"¿Cuál es el doble de 60?","opciones":["120","119","109"],"correcta":0},{"enunciado":"¿Cuál es el doble de 42?","opciones":["83","85","84"],"correcta":2},{"enunciado":"¿Cuál es el doble de 49?","opciones":["96","98","97"],"correcta":1},{"enunciado":"¿Cuál es el doble de 71?","opciones":["152","142","153"],"correcta":1},{"enunciado":"¿Cuál es el doble de 33?","opciones":["66","68","75"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000104',
    'Mitades, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuál es la mitad de 56?","opciones":["39","37","28"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 32?","opciones":["27","16","7"],"correcta":1},{"enunciado":"¿Cuál es la mitad de 28?","opciones":["4","16","14"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 50?","opciones":["16","14","25"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 78?","opciones":["28","49","39"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 46?","opciones":["21","23","34"],"correcta":1},{"enunciado":"¿Cuál es la mitad de 66?","opciones":["43","33","22"],"correcta":1},{"enunciado":"¿Cuál es la mitad de 26?","opciones":["2","13","11"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000104',
    'Tablas, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuánto es 8 × 3?","opciones":["24","25","35"],"correcta":0},{"enunciado":"¿Cuánto es 8 × 4?","opciones":["41","33","32"],"correcta":2},{"enunciado":"¿Cuánto es 4 × 7?","opciones":["29","28","30"],"correcta":1},{"enunciado":"¿Cuánto es 3 × 7?","opciones":["11","21","31"],"correcta":1},{"enunciado":"¿Cuánto es 7 × 8?","opciones":["45","67","56"],"correcta":2},{"enunciado":"¿Cuánto es 5 × 5?","opciones":["25","27","15"],"correcta":0},{"enunciado":"¿Cuánto es 8 × 9?","opciones":["72","74","82"],"correcta":0},{"enunciado":"¿Cuánto es 6 × 5?","opciones":["30","21","28"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000104',
    'Completar la decena, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuánto falta para llegar a 150 desde 145?","opciones":["5","3","15"],"correcta":0},{"enunciado":"¿Cuánto falta para llegar a 160 desde 157?","opciones":["13","5","3"],"correcta":2},{"enunciado":"¿Cuánto falta para llegar a 100 desde 96?","opciones":["15","14","4"],"correcta":2},{"enunciado":"¿Cuánto falta para llegar a 90 desde 84?","opciones":["15","6","5"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 90 desde 83?","opciones":["18","7","17"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 150 desde 144?","opciones":["6","4","15"],"correcta":0},{"enunciado":"¿Cuánto falta para llegar a 130 desde 129?","opciones":["3","1","11"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 100 desde 95?","opciones":["16","3","5"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000104',
    'Redondear, nivel 2',
    2,
    '{"rondas":[{"enunciado":"Redondea 354 a la decena más cercana.","opciones":["340","350","360"],"correcta":1},{"enunciado":"Redondea 372 a la decena más cercana.","opciones":["360","380","370"],"correcta":2},{"enunciado":"Redondea 348 a la decena más cercana.","opciones":["350","340","360"],"correcta":0},{"enunciado":"Redondea 497 a la decena más cercana.","opciones":["510","500","490"],"correcta":1},{"enunciado":"Redondea 144 a la decena más cercana.","opciones":["130","150","140"],"correcta":2},{"enunciado":"Redondea 167 a la decena más cercana.","opciones":["180","170","160"],"correcta":1},{"enunciado":"Redondea 349 a la decena más cercana.","opciones":["340","360","350"],"correcta":2},{"enunciado":"Redondea 302 a la decena más cercana.","opciones":["290","310","300"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000104',
    'Tres números, nivel 2',
    2,
    '{"rondas":[{"enunciado":"¿Cuánto es 5 + 9 + 21?","opciones":["35","45","34"],"correcta":0},{"enunciado":"¿Cuánto es 12 + 2 + 11?","opciones":["24","35","25"],"correcta":2},{"enunciado":"¿Cuánto es 7 + 25 + 5?","opciones":["26","37","27"],"correcta":1},{"enunciado":"¿Cuánto es 16 + 2 + 21?","opciones":["28","39","37"],"correcta":1},{"enunciado":"¿Cuánto es 6 + 2 + 13?","opciones":["21","30","10"],"correcta":0},{"enunciado":"¿Cuánto es 7 + 8 + 11?","opciones":["26","17","27"],"correcta":0},{"enunciado":"¿Cuánto es 15 + 25 + 8?","opciones":["57","49","48"],"correcta":2},{"enunciado":"¿Cuánto es 3 + 16 + 22?","opciones":["30","41","40"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000104',
    'Cuánto falta, nivel 2',
    2,
    '{"rondas":[{"enunciado":"32 + ? = 48. ¿Qué número falta?","opciones":["15","7","16"],"correcta":2},{"enunciado":"30 + ? = 54. ¿Qué número falta?","opciones":["22","24","15"],"correcta":1},{"enunciado":"42 + ? = 69. ¿Qué número falta?","opciones":["25","27","16"],"correcta":1},{"enunciado":"30 + ? = 58. ¿Qué número falta?","opciones":["39","19","28"],"correcta":2},{"enunciado":"38 + ? = 41. ¿Qué número falta?","opciones":["3","13","5"],"correcta":0},{"enunciado":"81 + ? = 137. ¿Qué número falta?","opciones":["66","58","56"],"correcta":2},{"enunciado":"69 + ? = 78. ¿Qué número falta?","opciones":["8","10","9"],"correcta":2},{"enunciado":"50 + ? = 98. ¿Qué número falta?","opciones":["58","48","46"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000104',
    'Sumas sin llevada, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuánto es 8707 + 1221?","opciones":["9928","9918","9927"],"correcta":0},{"enunciado":"¿Cuánto es 2721 + 6023?","opciones":["8742","8744","8733"],"correcta":1},{"enunciado":"¿Cuánto es 7522 + 365?","opciones":["7887","7896","7889"],"correcta":0},{"enunciado":"¿Cuánto es 1601 + 1116?","opciones":["2727","2728","2717"],"correcta":2},{"enunciado":"¿Cuánto es 2776 + 5012?","opciones":["7798","7789","7788"],"correcta":2},{"enunciado":"¿Cuánto es 7702 + 144?","opciones":["7837","7846","7856"],"correcta":1},{"enunciado":"¿Cuánto es 3154 + 2014?","opciones":["5170","5168","5167"],"correcta":1},{"enunciado":"¿Cuánto es 1641 + 8136?","opciones":["9777","9768","9766"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000104',
    'Sumas con llevada, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuánto es 339 + 149?","opciones":["489","478","488"],"correcta":2},{"enunciado":"¿Cuánto es 198 + 105?","opciones":["305","303","292"],"correcta":1},{"enunciado":"¿Cuánto es 138 + 412?","opciones":["539","550","541"],"correcta":1},{"enunciado":"¿Cuánto es 409 + 278?","opciones":["687","686","697"],"correcta":0},{"enunciado":"¿Cuánto es 268 + 474?","opciones":["741","742","752"],"correcta":1},{"enunciado":"¿Cuánto es 329 + 157?","opciones":["497","496","486"],"correcta":2},{"enunciado":"¿Cuánto es 425 + 426?","opciones":["860","861","851"],"correcta":2},{"enunciado":"¿Cuánto es 348 + 107?","opciones":["454","455","456"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000104',
    'Restas, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuánto es 715 - 467?","opciones":["246","249","248"],"correcta":2},{"enunciado":"¿Cuánto es 342 - 169?","opciones":["182","173","164"],"correcta":1},{"enunciado":"¿Cuánto es 407 - 388?","opciones":["10","18","19"],"correcta":2},{"enunciado":"¿Cuánto es 305 - 125?","opciones":["191","180","189"],"correcta":1},{"enunciado":"¿Cuánto es 610 - 461?","opciones":["138","139","149"],"correcta":2},{"enunciado":"¿Cuánto es 490 - 397?","opciones":["91","93","103"],"correcta":1},{"enunciado":"¿Cuánto es 183 - 149?","opciones":["36","34","35"],"correcta":1},{"enunciado":"¿Cuánto es 362 - 326?","opciones":["26","36","35"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000104',
    'Dobles, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuál es el doble de 90?","opciones":["182","180","171"],"correcta":1},{"enunciado":"¿Cuál es el doble de 128?","opciones":["258","256","254"],"correcta":1},{"enunciado":"¿Cuál es el doble de 417?","opciones":["835","834","824"],"correcta":1},{"enunciado":"¿Cuál es el doble de 259?","opciones":["517","518","516"],"correcta":1},{"enunciado":"¿Cuál es el doble de 86?","opciones":["172","171","173"],"correcta":0},{"enunciado":"¿Cuál es el doble de 205?","opciones":["410","400","411"],"correcta":0},{"enunciado":"¿Cuál es el doble de 112?","opciones":["226","214","224"],"correcta":2},{"enunciado":"¿Cuál es el doble de 141?","opciones":["284","282","280"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000104',
    'Mitades, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuál es la mitad de 354?","opciones":["166","177","176"],"correcta":1},{"enunciado":"¿Cuál es la mitad de 148?","opciones":["74","85","83"],"correcta":0},{"enunciado":"¿Cuál es la mitad de 206?","opciones":["104","112","103"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 432?","opciones":["225","207","216"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 378?","opciones":["200","189","190"],"correcta":1},{"enunciado":"¿Cuál es la mitad de 250?","opciones":["114","124","125"],"correcta":2},{"enunciado":"¿Cuál es la mitad de 426?","opciones":["213","212","204"],"correcta":0},{"enunciado":"¿Cuál es la mitad de 92?","opciones":["46","48","56"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000104',
    'Tablas, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuánto es 10 × 8?","opciones":["91","80","79"],"correcta":1},{"enunciado":"¿Cuánto es 12 × 7?","opciones":["82","84","86"],"correcta":1},{"enunciado":"¿Cuánto es 6 × 9?","opciones":["55","54","43"],"correcta":1},{"enunciado":"¿Cuánto es 7 × 11?","opciones":["77","75","67"],"correcta":0},{"enunciado":"¿Cuánto es 8 × 9?","opciones":["72","82","70"],"correcta":0},{"enunciado":"¿Cuánto es 7 × 8?","opciones":["46","56","58"],"correcta":1},{"enunciado":"¿Cuánto es 9 × 10?","opciones":["90","92","99"],"correcta":0},{"enunciado":"¿Cuánto es 12 × 8?","opciones":["96","95","86"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000104',
    'Completar la decena, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuánto falta para llegar a 280 desde 278?","opciones":["12","2","4"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 660 desde 658?","opciones":["3","2","4"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 250 desde 248?","opciones":["2","12","13"],"correcta":0},{"enunciado":"¿Cuánto falta para llegar a 460 desde 451?","opciones":["18","9","10"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 200 desde 197?","opciones":["3","1","5"],"correcta":0},{"enunciado":"¿Cuánto falta para llegar a 760 desde 755?","opciones":["3","14","5"],"correcta":2},{"enunciado":"¿Cuánto falta para llegar a 580 desde 576?","opciones":["6","4","2"],"correcta":1},{"enunciado":"¿Cuánto falta para llegar a 540 desde 535?","opciones":["6","4","5"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000104',
    'Redondear, nivel 3',
    3,
    '{"rondas":[{"enunciado":"Redondea 798 a la decena más cercana.","opciones":["810","790","800"],"correcta":2},{"enunciado":"Redondea 847 a la decena más cercana.","opciones":["850","860","840"],"correcta":0},{"enunciado":"Redondea 667 a la decena más cercana.","opciones":["680","660","670"],"correcta":2},{"enunciado":"Redondea 704 a la decena más cercana.","opciones":["700","690","710"],"correcta":0},{"enunciado":"Redondea 648 a la decena más cercana.","opciones":["660","640","650"],"correcta":2},{"enunciado":"Redondea 777 a la decena más cercana.","opciones":["770","780","790"],"correcta":1},{"enunciado":"Redondea 869 a la decena más cercana.","opciones":["860","880","870"],"correcta":2},{"enunciado":"Redondea 638 a la decena más cercana.","opciones":["630","640","650"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000104',
    'Tres números, nivel 3',
    3,
    '{"rondas":[{"enunciado":"¿Cuánto es 43 + 53 + 3?","opciones":["89","101","99"],"correcta":2},{"enunciado":"¿Cuánto es 47 + 34 + 23?","opciones":["95","94","104"],"correcta":2},{"enunciado":"¿Cuánto es 25 + 51 + 48?","opciones":["115","124","114"],"correcta":1},{"enunciado":"¿Cuánto es 47 + 46 + 12?","opciones":["115","95","105"],"correcta":2},{"enunciado":"¿Cuánto es 36 + 55 + 20?","opciones":["120","121","111"],"correcta":2},{"enunciado":"¿Cuánto es 39 + 36 + 22?","opciones":["99","97","108"],"correcta":1},{"enunciado":"¿Cuánto es 33 + 20 + 19?","opciones":["70","72","63"],"correcta":1},{"enunciado":"¿Cuánto es 19 + 42 + 55?","opciones":["125","107","116"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000104',
    'Cuánto falta, nivel 3',
    3,
    '{"rondas":[{"enunciado":"632 + ? = 823. ¿Qué número falta?","opciones":["193","191","181"],"correcta":1},{"enunciado":"523 + ? = 661. ¿Qué número falta?","opciones":["139","137","138"],"correcta":2},{"enunciado":"710 + ? = 757. ¿Qué número falta?","opciones":["45","47","57"],"correcta":1},{"enunciado":"473 + ? = 489. ¿Qué número falta?","opciones":["16","14","18"],"correcta":0},{"enunciado":"379 + ? = 420. ¿Qué número falta?","opciones":["41","52","50"],"correcta":0},{"enunciado":"547 + ? = 696. ¿Qué número falta?","opciones":["151","149","140"],"correcta":1},{"enunciado":"418 + ? = 449. ¿Qué número falta?","opciones":["41","31","21"],"correcta":1},{"enunciado":"195 + ? = 328. ¿Qué número falta?","opciones":["142","122","133"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: El cambio de una compra',
    2,
    '{"rondas":[{"enunciado":"Pagas con $20.000 una compra de $13.000. ¿Cuánto te devuelven?","opciones":["$9.000","$7.000","$6.000"],"correcta":1},{"enunciado":"Pagas con $10.000 una compra de $4.000. ¿Cuánto te devuelven?","opciones":["$6.000","$4.000","$6.500"],"correcta":0},{"enunciado":"Pagas con $20.000 una compra de $10.500. ¿Cuánto te devuelven?","opciones":["$11.500","$10.500","$9.500"],"correcta":2},{"enunciado":"Pagas con $20.000 una compra de $11.500. ¿Cuánto te devuelven?","opciones":["$9.000","$8.500","$8.000"],"correcta":1},{"enunciado":"Pagas con $10.000 una compra de $8.000. ¿Cuánto te devuelven?","opciones":["$2.000","$1.000","$4.000"],"correcta":0},{"enunciado":"Pagas con $20.000 una compra de $16.000. ¿Cuánto te devuelven?","opciones":["$3.000","$4.000","$2.000"],"correcta":1},{"enunciado":"Pagas con $20.000 una compra de $15.500. ¿Cuánto te devuelven?","opciones":["$4.500","$5.000","$3.500"],"correcta":0},{"enunciado":"Pagas con $20.000 una compra de $13.500. ¿Cuánto te devuelven?","opciones":["$7.500","$6.000","$6.500"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: Dos cosas, un total',
    1,
    '{"rondas":[{"enunciado":"Un pan cuesta $3.500 y un jugo $6.000. ¿Cuánto pagas por los dos?","opciones":["$9.500","$10.500","$8.500"],"correcta":0},{"enunciado":"Un pan cuesta $3.000 y un jugo $5.500. ¿Cuánto pagas por los dos?","opciones":["$9.500","$8.500","$9.000"],"correcta":1},{"enunciado":"Un pan cuesta $4.000 y un jugo $4.000. ¿Cuánto pagas por los dos?","opciones":["$6.000","$9.000","$8.000"],"correcta":2},{"enunciado":"Un pan cuesta $1.000 y un jugo $2.000. ¿Cuánto pagas por los dos?","opciones":["$3.000","$1.000","$3.500"],"correcta":0},{"enunciado":"Un pan cuesta $1.500 y un jugo $3.500. ¿Cuánto pagas por los dos?","opciones":["$5.000","$5.500","$7.000"],"correcta":0},{"enunciado":"Un pan cuesta $2.500 y un jugo $3.000. ¿Cuánto pagas por los dos?","opciones":["$5.500","$3.500","$6.500"],"correcta":0},{"enunciado":"Un pan cuesta $4.500 y un jugo $4.000. ¿Cuánto pagas por los dos?","opciones":["$8.500","$6.500","$9.500"],"correcta":0},{"enunciado":"Un pan cuesta $2.000 y un jugo $1.000. ¿Cuánto pagas por los dos?","opciones":["$4.000","$3.000","$1.000"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: Varias iguales',
    1,
    '{"rondas":[{"enunciado":"4 empanadas de $2.000 cada una. ¿Cuánto cuestan en total?","opciones":["$9.000","$8.000","$7.000"],"correcta":1},{"enunciado":"2 empanadas de $1.000 cada una. ¿Cuánto cuestan en total?","opciones":["$2.000","$4.000","$3.000"],"correcta":0},{"enunciado":"2 empanadas de $2.000 cada una. ¿Cuánto cuestan en total?","opciones":["$4.000","$2.000","$4.500"],"correcta":0},{"enunciado":"4 empanadas de $1.500 cada una. ¿Cuánto cuestan en total?","opciones":["$8.000","$6.000","$5.000"],"correcta":1},{"enunciado":"3 empanadas de $3.000 cada una. ¿Cuánto cuestan en total?","opciones":["$9.000","$8.000","$8.500"],"correcta":0},{"enunciado":"3 empanadas de $1.500 cada una. ¿Cuánto cuestan en total?","opciones":["$4.500","$5.000","$6.500"],"correcta":0},{"enunciado":"5 empanadas de $3.500 cada una. ¿Cuánto cuestan en total?","opciones":["$18.000","$17.500","$16.500"],"correcta":1},{"enunciado":"5 empanadas de $1.000 cada una. ¿Cuánto cuestan en total?","opciones":["$5.500","$6.000","$5.000"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: La cuenta entre dos',
    2,
    '{"rondas":[{"enunciado":"La cuenta es de $17.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$9.000","$8.500","$10.500"],"correcta":1},{"enunciado":"La cuenta es de $16.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$6.000","$7.500","$8.000"],"correcta":2},{"enunciado":"La cuenta es de $38.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$18.500","$18.000","$19.000"],"correcta":2},{"enunciado":"La cuenta es de $27.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$13.500","$12.500","$13.000"],"correcta":0},{"enunciado":"La cuenta es de $7.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$4.500","$3.500","$1.500"],"correcta":1},{"enunciado":"La cuenta es de $26.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$13.000","$13.500","$12.000"],"correcta":0},{"enunciado":"La cuenta es de $23.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$13.500","$11.500","$12.500"],"correcta":1},{"enunciado":"La cuenta es de $13.000 y se divide entre dos. ¿Cuánto pone cada quien?","opciones":["$8.500","$6.500","$7.000"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: El trayecto de ida y vuelta',
    1,
    '{"rondas":[{"enunciado":"Un trayecto dura 30 minutos de ida y otros 30 de vuelta. ¿Cuántos minutos son en total?","opciones":["60","71","59"],"correcta":0},{"enunciado":"Un trayecto dura 41 minutos de ida y otros 41 de vuelta. ¿Cuántos minutos son en total?","opciones":["80","91","82"],"correcta":2},{"enunciado":"Un trayecto dura 11 minutos de ida y otros 11 de vuelta. ¿Cuántos minutos son en total?","opciones":["22","11","23"],"correcta":0},{"enunciado":"Un trayecto dura 38 minutos de ida y otros 38 de vuelta. ¿Cuántos minutos son en total?","opciones":["74","76","87"],"correcta":1},{"enunciado":"Un trayecto dura 25 minutos de ida y otros 25 de vuelta. ¿Cuántos minutos son en total?","opciones":["61","50","59"],"correcta":1},{"enunciado":"Un trayecto dura 9 minutos de ida y otros 9 de vuelta. ¿Cuántos minutos son en total?","opciones":["27","17","18"],"correcta":2},{"enunciado":"Un trayecto dura 44 minutos de ida y otros 44 de vuelta. ¿Cuántos minutos son en total?","opciones":["77","88","89"],"correcta":1},{"enunciado":"Un trayecto dura 34 minutos de ida y otros 34 de vuelta. ¿Cuántos minutos son en total?","opciones":["67","70","68"],"correcta":2}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: Con descuento',
    2,
    '{"rondas":[{"enunciado":"Una camiseta de $27.000 tiene $6.000 de descuento. ¿Cuánto pagas?","opciones":["$22.000","$21.000","$20.000"],"correcta":1},{"enunciado":"Una camiseta de $53.000 tiene $2.000 de descuento. ¿Cuánto pagas?","opciones":["$51.000","$50.500","$50.000"],"correcta":0},{"enunciado":"Una camiseta de $24.000 tiene $5.000 de descuento. ¿Cuánto pagas?","opciones":["$20.000","$18.500","$19.000"],"correcta":2},{"enunciado":"Una camiseta de $24.000 tiene $7.000 de descuento. ¿Cuánto pagas?","opciones":["$15.000","$17.000","$18.000"],"correcta":1},{"enunciado":"Una camiseta de $42.000 tiene $4.000 de descuento. ¿Cuánto pagas?","opciones":["$39.000","$38.000","$37.000"],"correcta":1},{"enunciado":"Una camiseta de $51.000 tiene $3.000 de descuento. ¿Cuánto pagas?","opciones":["$48.000","$47.000","$47.500"],"correcta":0},{"enunciado":"Una camiseta de $28.000 tiene $3.000 de descuento. ¿Cuánto pagas?","opciones":["$24.000","$25.500","$25.000"],"correcta":2},{"enunciado":"Una camiseta de $27.000 tiene $5.000 de descuento. ¿Cuánto pagas?","opciones":["$22.000","$23.000","$21.500"],"correcta":0}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: Lo que se ahorra',
    2,
    '{"rondas":[{"enunciado":"Ahorras $3.000 cada semana. ¿Cuánto tienes después de 6 semanas?","opciones":["$17.000","$18.000","$18.500"],"correcta":1},{"enunciado":"Ahorras $3.000 cada semana. ¿Cuánto tienes después de 5 semanas?","opciones":["$15.000","$14.000","$16.000"],"correcta":0},{"enunciado":"Ahorras $5.000 cada semana. ¿Cuánto tienes después de 5 semanas?","opciones":["$26.000","$25.500","$25.000"],"correcta":2},{"enunciado":"Ahorras $4.000 cada semana. ¿Cuánto tienes después de 5 semanas?","opciones":["$20.000","$21.000","$18.000"],"correcta":0},{"enunciado":"Ahorras $3.000 cada semana. ¿Cuánto tienes después de 3 semanas?","opciones":["$10.000","$9.000","$8.500"],"correcta":1},{"enunciado":"Ahorras $8.000 cada semana. ¿Cuánto tienes después de 5 semanas?","opciones":["$40.000","$39.000","$39.500"],"correcta":0},{"enunciado":"Ahorras $4.000 cada semana. ¿Cuánto tienes después de 3 semanas?","opciones":["$12.000","$12.500","$13.000"],"correcta":0},{"enunciado":"Ahorras $4.000 cada semana. ¿Cuánto tienes después de 4 semanas?","opciones":["$17.000","$16.000","$15.000"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: Las páginas que faltan',
    3,
    '{"rondas":[{"enunciado":"Un libro tiene 93 páginas y llevas 53. ¿Cuántas te faltan?","opciones":["30","40","42"],"correcta":1},{"enunciado":"Un libro tiene 160 páginas y llevas 71. ¿Cuántas te faltan?","opciones":["91","89","80"],"correcta":1},{"enunciado":"Un libro tiene 167 páginas y llevas 22. ¿Cuántas te faltan?","opciones":["134","145","135"],"correcta":1},{"enunciado":"Un libro tiene 118 páginas y llevas 70. ¿Cuántas te faltan?","opciones":["48","49","58"],"correcta":0},{"enunciado":"Un libro tiene 100 páginas y llevas 83. ¿Cuántas te faltan?","opciones":["17","8","15"],"correcta":0},{"enunciado":"Un libro tiene 86 páginas y llevas 63. ¿Cuántas te faltan?","opciones":["33","34","23"],"correcta":2},{"enunciado":"Un libro tiene 128 páginas y llevas 46. ¿Cuántas te faltan?","opciones":["93","71","82"],"correcta":2},{"enunciado":"Un libro tiene 189 páginas y llevas 161. ¿Cuántas te faltan?","opciones":["37","28","19"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: El reparto parejo',
    3,
    '{"rondas":[{"enunciado":"Tienes 21 galletas para repartir entre 3 personas. ¿Cuántas le tocan a cada una?","opciones":["17","7","16"],"correcta":1},{"enunciado":"Tienes 24 galletas para repartir entre 4 personas. ¿Cuántas le tocan a cada una?","opciones":["16","17","6"],"correcta":2},{"enunciado":"Tienes 32 galletas para repartir entre 4 personas. ¿Cuántas le tocan a cada una?","opciones":["7","8","6"],"correcta":1},{"enunciado":"Tienes 35 galletas para repartir entre 5 personas. ¿Cuántas le tocan a cada una?","opciones":["5","7","8"],"correcta":1},{"enunciado":"Tienes 48 galletas para repartir entre 6 personas. ¿Cuántas le tocan a cada una?","opciones":["6","8","9"],"correcta":1},{"enunciado":"Tienes 9 galletas para repartir entre 3 personas. ¿Cuántas le tocan a cada una?","opciones":["3","5","13"],"correcta":0},{"enunciado":"Tienes 30 galletas para repartir entre 6 personas. ¿Cuántas le tocan a cada una?","opciones":["16","6","5"],"correcta":2},{"enunciado":"Tienes 6 galletas para repartir entre 3 personas. ¿Cuántas le tocan a cada una?","opciones":["4","2","3"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510104-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000104',
    'Día a día: Las monedas',
    3,
    '{"rondas":[{"enunciado":"Tienes 4 monedas de $500 y 2 de $200. ¿Cuánto dinero tienes?","opciones":["$1.900","$2.900","$2.400"],"correcta":2},{"enunciado":"Tienes 5 monedas de $500 y 5 de $200. ¿Cuánto dinero tienes?","opciones":["$5.500","$3.500","$4.500"],"correcta":1},{"enunciado":"Tienes 4 monedas de $500 y 4 de $200. ¿Cuánto dinero tienes?","opciones":["$3.800","$2.800","$1.800"],"correcta":1},{"enunciado":"Tienes 2 monedas de $500 y 2 de $200. ¿Cuánto dinero tienes?","opciones":["$2.400","$1.400","$3.400"],"correcta":1},{"enunciado":"Tienes 5 monedas de $500 y 4 de $200. ¿Cuánto dinero tienes?","opciones":["$3.300","$5.300","$2.300"],"correcta":0},{"enunciado":"Tienes 4 monedas de $500 y 5 de $200. ¿Cuánto dinero tienes?","opciones":["$2.000","$3.000","$4.000"],"correcta":1},{"enunciado":"Tienes 3 monedas de $500 y 3 de $200. ¿Cuánto dinero tienes?","opciones":["$1.100","$2.100","$2.600"],"correcta":1},{"enunciado":"Tienes 2 monedas de $500 y 4 de $200. ¿Cuánto dinero tienes?","opciones":["$2.800","$1.800","$2.300"],"correcta":1}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-05 · Toca solo lo que cambia: 40 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510105-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca estrella, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"estrella","nombre":"estrella","pictograma":"estrella"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"triangulo","nombre":"triángulo","pictograma":"triangulo"},{"clave":"rombo","nombre":"rombo","pictograma":"rombo"}],"secuencia":["triangulo","estrella","triangulo","cuadrado","estrella","circulo","triangulo","estrella","triangulo","rombo","estrella","rombo","estrella","circulo","estrella","cuadrado","rombo","circulo","estrella","cuadrado","circulo","estrella","circulo","estrella","cuadrado","estrella","circulo","triangulo","cuadrado","estrella","rombo","triangulo","circulo","rombo","cuadrado","triangulo","estrella","circulo","triangulo","estrella","triangulo","circulo","estrella","circulo","estrella"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca estrella, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"estrella","nombre":"estrella","pictograma":"estrella"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"triangulo","nombre":"triángulo","pictograma":"triangulo"},{"clave":"rombo","nombre":"rombo","pictograma":"rombo"}],"secuencia":["rombo","estrella","rombo","triangulo","estrella","cuadrado","circulo","estrella","triangulo","estrella","circulo","rombo","estrella","rombo","cuadrado","estrella","triangulo","rombo","estrella","circulo","estrella","cuadrado","circulo","estrella","circulo","cuadrado","rombo","estrella","triangulo","cuadrado","triangulo","rombo","estrella","circulo","rombo","triangulo","circulo","estrella","cuadrado","estrella","cuadrado","rombo","estrella","circulo","estrella"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca estrella, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"estrella","nombre":"estrella","pictograma":"estrella"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"triangulo","nombre":"triángulo","pictograma":"triangulo"},{"clave":"rombo","nombre":"rombo","pictograma":"rombo"}],"secuencia":["estrella","triangulo","estrella","triangulo","rombo","circulo","estrella","triangulo","rombo","estrella","triangulo","estrella","triangulo","estrella","triangulo","estrella","triangulo","rombo","estrella","cuadrado","estrella","cuadrado","triangulo","cuadrado","estrella","circulo","estrella","rombo","estrella","cuadrado","triangulo","rombo","circulo","cuadrado","rombo","circulo","estrella","circulo","rombo","circulo","cuadrado","rombo","estrella","triangulo","estrella"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca sol, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"sol","nombre":"sol","pictograma":"sol"}],"otros":[{"clave":"luna","nombre":"luna","pictograma":"luna"},{"clave":"nube","nombre":"nube","pictograma":"nube"},{"clave":"gota","nombre":"gota","pictograma":"gota"},{"clave":"rayo","nombre":"rayo","pictograma":"rayo"}],"secuencia":["rayo","gota","rayo","gota","sol","nube","sol","gota","nube","rayo","gota","luna","gota","sol","nube","sol","nube","sol","luna","sol","rayo","sol","luna","sol","rayo","sol","rayo","sol","rayo","nube","sol","gota","sol","luna","sol","rayo","luna","gota","rayo","sol","luna","sol","nube","luna","gota"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca sol, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"sol","nombre":"sol","pictograma":"sol"}],"otros":[{"clave":"luna","nombre":"luna","pictograma":"luna"},{"clave":"nube","nombre":"nube","pictograma":"nube"},{"clave":"gota","nombre":"gota","pictograma":"gota"},{"clave":"rayo","nombre":"rayo","pictograma":"rayo"}],"secuencia":["sol","nube","gota","luna","sol","nube","luna","rayo","sol","luna","sol","luna","sol","rayo","gota","rayo","sol","rayo","nube","rayo","sol","nube","sol","luna","sol","luna","rayo","luna","sol","gota","rayo","luna","sol","nube","rayo","sol","rayo","sol","gota","nube","luna","sol","gota","sol","rayo"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca sol, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"sol","nombre":"sol","pictograma":"sol"}],"otros":[{"clave":"luna","nombre":"luna","pictograma":"luna"},{"clave":"nube","nombre":"nube","pictograma":"nube"},{"clave":"gota","nombre":"gota","pictograma":"gota"},{"clave":"rayo","nombre":"rayo","pictograma":"rayo"}],"secuencia":["nube","luna","nube","luna","rayo","sol","luna","nube","luna","sol","rayo","sol","gota","sol","gota","rayo","sol","rayo","sol","nube","gota","rayo","gota","sol","rayo","sol","nube","sol","nube","luna","sol","gota","sol","luna","sol","rayo","sol","luna","rayo","nube","sol","rayo","sol","rayo","nube"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca manzana, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"manzana","nombre":"manzana","pictograma":"manzana"}],"otros":[{"clave":"pera","nombre":"pera","pictograma":"pera"},{"clave":"uva","nombre":"uvas","pictograma":"uva"},{"clave":"naranja","nombre":"naranja","pictograma":"naranja"},{"clave":"banano","nombre":"banano","pictograma":"banano"}],"secuencia":["manzana","pera","manzana","naranja","manzana","uva","manzana","naranja","manzana","pera","naranja","uva","pera","uva","manzana","banano","manzana","pera","uva","manzana","pera","manzana","uva","manzana","pera","banano","uva","manzana","uva","naranja","banano","manzana","pera","manzana","banano","uva","naranja","manzana","naranja","banano","manzana","naranja","uva","banano","uva"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca manzana, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"manzana","nombre":"manzana","pictograma":"manzana"}],"otros":[{"clave":"pera","nombre":"pera","pictograma":"pera"},{"clave":"uva","nombre":"uvas","pictograma":"uva"},{"clave":"naranja","nombre":"naranja","pictograma":"naranja"},{"clave":"banano","nombre":"banano","pictograma":"banano"}],"secuencia":["uva","banano","manzana","pera","manzana","pera","manzana","naranja","uva","manzana","banano","manzana","banano","manzana","banano","pera","manzana","uva","naranja","manzana","banano","pera","manzana","pera","manzana","naranja","pera","manzana","uva","pera","manzana","uva","manzana","uva","banano","manzana","pera","naranja","banano","uva","banano","pera","manzana","naranja","uva"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca manzana, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"manzana","nombre":"manzana","pictograma":"manzana"}],"otros":[{"clave":"pera","nombre":"pera","pictograma":"pera"},{"clave":"uva","nombre":"uvas","pictograma":"uva"},{"clave":"naranja","nombre":"naranja","pictograma":"naranja"},{"clave":"banano","nombre":"banano","pictograma":"banano"}],"secuencia":["pera","naranja","manzana","uva","naranja","manzana","pera","manzana","banano","naranja","uva","naranja","manzana","uva","manzana","naranja","manzana","naranja","manzana","banano","manzana","naranja","pera","uva","manzana","uva","pera","naranja","manzana","pera","banano","pera","manzana","banano","manzana","naranja","manzana","pera","manzana","uva","banano","naranja","manzana","banano","pera"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gato, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"gato","nombre":"gato","pictograma":"gato"}],"otros":[{"clave":"perro","nombre":"perro","pictograma":"perro"},{"clave":"pez","nombre":"pez","pictograma":"pez"},{"clave":"conejo","nombre":"conejo","pictograma":"conejo"},{"clave":"tortuga","nombre":"tortuga","pictograma":"tortuga"}],"secuencia":["tortuga","gato","perro","tortuga","pez","gato","conejo","gato","conejo","gato","pez","perro","gato","perro","gato","pez","gato","pez","gato","perro","gato","perro","tortuga","gato","conejo","pez","perro","gato","tortuga","perro","gato","conejo","tortuga","perro","conejo","gato","tortuga","gato","tortuga","conejo","tortuga","gato","pez","perro","pez"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gato, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"gato","nombre":"gato","pictograma":"gato"}],"otros":[{"clave":"perro","nombre":"perro","pictograma":"perro"},{"clave":"pez","nombre":"pez","pictograma":"pez"},{"clave":"conejo","nombre":"conejo","pictograma":"conejo"},{"clave":"tortuga","nombre":"tortuga","pictograma":"tortuga"}],"secuencia":["perro","pez","conejo","pez","gato","pez","gato","perro","gato","pez","perro","gato","pez","gato","conejo","gato","perro","conejo","gato","conejo","gato","pez","perro","gato","pez","gato","perro","gato","perro","gato","tortuga","conejo","gato","conejo","gato","tortuga","conejo","perro","tortuga","gato","pez","conejo","pez","conejo","pez"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gato, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"gato","nombre":"gato","pictograma":"gato"}],"otros":[{"clave":"perro","nombre":"perro","pictograma":"perro"},{"clave":"pez","nombre":"pez","pictograma":"pez"},{"clave":"conejo","nombre":"conejo","pictograma":"conejo"},{"clave":"tortuga","nombre":"tortuga","pictograma":"tortuga"}],"secuencia":["gato","conejo","tortuga","pez","gato","pez","perro","gato","pez","gato","tortuga","gato","perro","gato","pez","gato","perro","pez","conejo","pez","gato","pez","gato","tortuga","perro","gato","tortuga","perro","conejo","gato","pez","perro","conejo","perro","gato","perro","pez","tortuga","conejo","gato","tortuga","conejo","gato","tortuga","gato"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca árbol, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"arbol","nombre":"árbol","pictograma":"arbol"}],"otros":[{"clave":"flor","nombre":"flor","pictograma":"flor"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"hongo","nombre":"hongo","pictograma":"hongo"},{"clave":"cactus","nombre":"cactus","pictograma":"cactus"}],"secuencia":["arbol","hoja","cactus","arbol","hongo","arbol","cactus","arbol","hongo","flor","cactus","hongo","cactus","hongo","arbol","flor","hongo","flor","hongo","flor","arbol","flor","hoja","arbol","cactus","arbol","hongo","arbol","hongo","arbol","hoja","arbol","flor","arbol","flor","arbol","hoja","hongo","cactus","arbol","hoja","cactus","hongo","arbol","hongo"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca árbol, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"arbol","nombre":"árbol","pictograma":"arbol"}],"otros":[{"clave":"flor","nombre":"flor","pictograma":"flor"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"hongo","nombre":"hongo","pictograma":"hongo"},{"clave":"cactus","nombre":"cactus","pictograma":"cactus"}],"secuencia":["hongo","arbol","cactus","hongo","arbol","hongo","arbol","hoja","flor","arbol","hoja","cactus","hongo","cactus","hongo","flor","arbol","flor","cactus","arbol","flor","arbol","cactus","flor","hongo","arbol","flor","hongo","arbol","flor","arbol","cactus","arbol","hoja","hongo","cactus","arbol","flor","hoja","arbol","cactus","flor","arbol","hongo","arbol"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca árbol, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"arbol","nombre":"árbol","pictograma":"arbol"}],"otros":[{"clave":"flor","nombre":"flor","pictograma":"flor"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"hongo","nombre":"hongo","pictograma":"hongo"},{"clave":"cactus","nombre":"cactus","pictograma":"cactus"}],"secuencia":["arbol","hoja","hongo","arbol","hoja","arbol","hoja","arbol","flor","cactus","flor","hongo","arbol","cactus","arbol","hongo","arbol","flor","arbol","flor","hoja","hongo","flor","arbol","hongo","hoja","flor","hongo","flor","hoja","arbol","cactus","arbol","hoja","arbol","flor","cactus","arbol","hongo","cactus","arbol","cactus","flor","hoja","arbol"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca llave, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"llave","nombre":"llave","pictograma":"llave"}],"otros":[{"clave":"taza","nombre":"taza","pictograma":"taza"},{"clave":"silla","nombre":"silla","pictograma":"silla"},{"clave":"libro","nombre":"libro","pictograma":"libro"},{"clave":"reloj","nombre":"reloj","pictograma":"reloj"}],"secuencia":["llave","silla","libro","taza","llave","taza","llave","silla","reloj","silla","llave","silla","llave","libro","silla","llave","reloj","llave","silla","llave","libro","llave","reloj","taza","llave","silla","llave","silla","taza","reloj","taza","libro","llave","silla","reloj","silla","llave","libro","llave","taza","libro","llave","reloj","taza","reloj"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca llave, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"llave","nombre":"llave","pictograma":"llave"}],"otros":[{"clave":"taza","nombre":"taza","pictograma":"taza"},{"clave":"silla","nombre":"silla","pictograma":"silla"},{"clave":"libro","nombre":"libro","pictograma":"libro"},{"clave":"reloj","nombre":"reloj","pictograma":"reloj"}],"secuencia":["llave","libro","taza","silla","libro","reloj","llave","reloj","llave","silla","llave","reloj","llave","reloj","llave","taza","libro","reloj","libro","llave","reloj","llave","reloj","libro","llave","taza","reloj","libro","reloj","silla","llave","taza","libro","llave","reloj","llave","taza","llave","silla","llave","silla","taza","llave","reloj","silla"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca llave, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"llave","nombre":"llave","pictograma":"llave"}],"otros":[{"clave":"taza","nombre":"taza","pictograma":"taza"},{"clave":"silla","nombre":"silla","pictograma":"silla"},{"clave":"libro","nombre":"libro","pictograma":"libro"},{"clave":"reloj","nombre":"reloj","pictograma":"reloj"}],"secuencia":["taza","silla","taza","llave","taza","llave","libro","silla","llave","reloj","libro","silla","llave","libro","llave","reloj","silla","llave","taza","llave","reloj","llave","silla","reloj","libro","llave","taza","reloj","llave","reloj","llave","libro","taza","llave","silla","taza","llave","silla","taza","silla","reloj","taza","llave","taza","llave"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca bus, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"bus","nombre":"bus","pictograma":"bus"}],"otros":[{"clave":"tren","nombre":"tren","pictograma":"tren"},{"clave":"barco","nombre":"barco","pictograma":"barco"},{"clave":"carro","nombre":"carro","pictograma":"carro"},{"clave":"moto","nombre":"moto","pictograma":"moto"}],"secuencia":["bus","barco","carro","moto","bus","carro","bus","tren","moto","carro","tren","moto","tren","bus","tren","bus","carro","tren","moto","carro","bus","moto","barco","bus","barco","carro","barco","tren","bus","barco","bus","moto","bus","carro","tren","bus","barco","bus","moto","bus","barco","bus","barco","tren","bus"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca bus, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"bus","nombre":"bus","pictograma":"bus"}],"otros":[{"clave":"tren","nombre":"tren","pictograma":"tren"},{"clave":"barco","nombre":"barco","pictograma":"barco"},{"clave":"carro","nombre":"carro","pictograma":"carro"},{"clave":"moto","nombre":"moto","pictograma":"moto"}],"secuencia":["bus","barco","carro","tren","barco","bus","moto","barco","bus","tren","bus","moto","bus","barco","tren","bus","barco","moto","barco","bus","barco","moto","bus","barco","tren","barco","tren","bus","carro","bus","tren","bus","moto","bus","tren","bus","tren","moto","barco","tren","bus","carro","bus","carro","moto"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca bus, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"bus","nombre":"bus","pictograma":"bus"}],"otros":[{"clave":"tren","nombre":"tren","pictograma":"tren"},{"clave":"barco","nombre":"barco","pictograma":"barco"},{"clave":"carro","nombre":"carro","pictograma":"carro"},{"clave":"moto","nombre":"moto","pictograma":"moto"}],"secuencia":["bus","carro","tren","bus","moto","barco","bus","barco","bus","carro","moto","carro","barco","bus","carro","moto","tren","barco","bus","tren","barco","moto","carro","bus","carro","bus","barco","moto","carro","bus","tren","carro","bus","barco","carro","bus","tren","bus","barco","bus","carro","bus","barco","bus","moto"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca mariposa, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"mariposa","nombre":"mariposa","pictograma":"mariposa"}],"otros":[{"clave":"abeja","nombre":"abeja","pictograma":"abeja"},{"clave":"ave","nombre":"ave","pictograma":"ave"},{"clave":"caracol","nombre":"caracol","pictograma":"caracol"},{"clave":"pez","nombre":"pez","pictograma":"pez"}],"secuencia":["mariposa","caracol","mariposa","pez","mariposa","abeja","pez","mariposa","pez","mariposa","abeja","caracol","mariposa","pez","abeja","caracol","abeja","pez","mariposa","ave","mariposa","abeja","mariposa","pez","abeja","mariposa","abeja","ave","pez","abeja","ave","mariposa","caracol","mariposa","caracol","mariposa","caracol","abeja","pez","mariposa","pez","ave","abeja","ave","mariposa"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca mariposa, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"mariposa","nombre":"mariposa","pictograma":"mariposa"}],"otros":[{"clave":"abeja","nombre":"abeja","pictograma":"abeja"},{"clave":"ave","nombre":"ave","pictograma":"ave"},{"clave":"caracol","nombre":"caracol","pictograma":"caracol"},{"clave":"pez","nombre":"pez","pictograma":"pez"}],"secuencia":["caracol","mariposa","caracol","abeja","mariposa","caracol","abeja","mariposa","abeja","pez","ave","mariposa","caracol","ave","mariposa","pez","caracol","pez","mariposa","pez","abeja","mariposa","pez","mariposa","abeja","caracol","mariposa","abeja","mariposa","pez","ave","mariposa","abeja","ave","mariposa","ave","pez","mariposa","abeja","mariposa","abeja","ave","mariposa","abeja","caracol"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca mariposa, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"mariposa","nombre":"mariposa","pictograma":"mariposa"}],"otros":[{"clave":"abeja","nombre":"abeja","pictograma":"abeja"},{"clave":"ave","nombre":"ave","pictograma":"ave"},{"clave":"caracol","nombre":"caracol","pictograma":"caracol"},{"clave":"pez","nombre":"pez","pictograma":"pez"}],"secuencia":["mariposa","caracol","mariposa","ave","mariposa","abeja","mariposa","ave","pez","mariposa","abeja","mariposa","abeja","mariposa","abeja","mariposa","pez","caracol","ave","caracol","pez","caracol","abeja","mariposa","pez","caracol","abeja","mariposa","caracol","pez","ave","caracol","ave","mariposa","ave","mariposa","abeja","ave","mariposa","pez","caracol","pez","mariposa","pez","mariposa"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gota, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"gota","nombre":"gota","pictograma":"gota"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"nube","nombre":"nube","pictograma":"nube"}],"secuencia":["hoja","nube","gota","circulo","gota","nube","gota","nube","cuadrado","circulo","nube","gota","cuadrado","circulo","cuadrado","circulo","gota","hoja","gota","cuadrado","circulo","gota","circulo","gota","circulo","hoja","circulo","gota","cuadrado","nube","gota","hoja","gota","hoja","cuadrado","circulo","cuadrado","gota","nube","gota","hoja","gota","cuadrado","gota","hoja"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gota, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"gota","nombre":"gota","pictograma":"gota"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"nube","nombre":"nube","pictograma":"nube"}],"secuencia":["nube","cuadrado","gota","nube","gota","circulo","hoja","gota","nube","gota","hoja","gota","nube","hoja","cuadrado","gota","nube","gota","nube","circulo","hoja","gota","nube","gota","nube","gota","cuadrado","gota","cuadrado","gota","cuadrado","nube","gota","cuadrado","circulo","nube","hoja","nube","hoja","circulo","hoja","gota","nube","gota","circulo"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gota, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"gota","nombre":"gota","pictograma":"gota"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"nube","nombre":"nube","pictograma":"nube"}],"secuencia":["gota","hoja","gota","circulo","cuadrado","hoja","gota","hoja","gota","circulo","cuadrado","circulo","nube","gota","nube","cuadrado","circulo","gota","cuadrado","hoja","nube","gota","nube","circulo","gota","nube","gota","circulo","gota","nube","hoja","gota","nube","gota","nube","circulo","gota","cuadrado","nube","cuadrado","nube","circulo","gota","cuadrado","gota"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca lluvia, a tu ritmo',
    1,
    '{"modo":"flujo","objetivos":[{"clave":"lluvia","nombre":"lluvia","pictograma":"lluvia"}],"otros":[{"clave":"sol","nombre":"sol","pictograma":"sol"},{"clave":"viento","nombre":"viento","pictograma":"viento"},{"clave":"copo","nombre":"copo de nieve","pictograma":"copo"},{"clave":"arcoiris","nombre":"arcoíris","pictograma":"arcoiris"}],"secuencia":["viento","arcoiris","viento","lluvia","viento","lluvia","sol","copo","lluvia","copo","lluvia","copo","lluvia","viento","lluvia","arcoiris","viento","arcoiris","lluvia","viento","copo","lluvia","arcoiris","lluvia","sol","lluvia","arcoiris","sol","copo","arcoiris","lluvia","copo","lluvia","arcoiris","copo","viento","sol","copo","viento","copo","lluvia","viento","lluvia","copo","lluvia"],"msPorEstimulo":2000,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca lluvia, con ritmo',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"lluvia","nombre":"lluvia","pictograma":"lluvia"}],"otros":[{"clave":"sol","nombre":"sol","pictograma":"sol"},{"clave":"viento","nombre":"viento","pictograma":"viento"},{"clave":"copo","nombre":"copo de nieve","pictograma":"copo"},{"clave":"arcoiris","nombre":"arcoíris","pictograma":"arcoiris"}],"secuencia":["lluvia","copo","arcoiris","sol","viento","arcoiris","lluvia","viento","arcoiris","lluvia","copo","lluvia","arcoiris","viento","lluvia","sol","arcoiris","sol","lluvia","viento","lluvia","viento","sol","lluvia","sol","lluvia","viento","lluvia","arcoiris","lluvia","viento","lluvia","copo","lluvia","copo","viento","arcoiris","lluvia","arcoiris","copo","arcoiris","viento","sol","lluvia","sol"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca lluvia, ligero',
    3,
    '{"modo":"flujo","objetivos":[{"clave":"lluvia","nombre":"lluvia","pictograma":"lluvia"}],"otros":[{"clave":"sol","nombre":"sol","pictograma":"sol"},{"clave":"viento","nombre":"viento","pictograma":"viento"},{"clave":"copo","nombre":"copo de nieve","pictograma":"copo"},{"clave":"arcoiris","nombre":"arcoíris","pictograma":"arcoiris"}],"secuencia":["arcoiris","lluvia","copo","lluvia","arcoiris","viento","lluvia","sol","lluvia","sol","copo","arcoiris","copo","viento","lluvia","arcoiris","lluvia","viento","sol","lluvia","sol","lluvia","viento","lluvia","viento","lluvia","sol","viento","sol","lluvia","viento","lluvia","copo","arcoiris","viento","sol","lluvia","arcoiris","copo","arcoiris","lluvia","arcoiris","sol","lluvia","arcoiris"],"msPorEstimulo":1200,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca estrella y gato',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"estrella","nombre":"estrella","pictograma":"estrella"},{"clave":"gato","nombre":"gato","pictograma":"gato"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"triangulo","nombre":"triángulo","pictograma":"triangulo"},{"clave":"rombo","nombre":"rombo","pictograma":"rombo"}],"secuencia":["cuadrado","gato","triangulo","estrella","circulo","estrella","cuadrado","rombo","estrella","cuadrado","rombo","estrella","circulo","rombo","circulo","gato","circulo","rombo","gato","circulo","cuadrado","gato","rombo","circulo","triangulo","cuadrado","gato","triangulo","estrella","rombo","cuadrado","gato","circulo","estrella","rombo","cuadrado","triangulo","estrella","cuadrado","circulo","estrella","circulo","triangulo","gato","rombo"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca sol y árbol',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"sol","nombre":"sol","pictograma":"sol"},{"clave":"arbol","nombre":"árbol","pictograma":"arbol"}],"otros":[{"clave":"luna","nombre":"luna","pictograma":"luna"},{"clave":"nube","nombre":"nube","pictograma":"nube"},{"clave":"gota","nombre":"gota","pictograma":"gota"},{"clave":"rayo","nombre":"rayo","pictograma":"rayo"}],"secuencia":["arbol","luna","sol","nube","gota","nube","arbol","rayo","gota","sol","luna","arbol","nube","luna","sol","luna","rayo","sol","luna","arbol","nube","luna","arbol","rayo","luna","arbol","nube","sol","luna","gota","nube","sol","rayo","luna","sol","nube","arbol","gota","sol","nube","gota","rayo","nube","luna","nube"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca manzana y llave',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"manzana","nombre":"manzana","pictograma":"manzana"},{"clave":"llave","nombre":"llave","pictograma":"llave"}],"otros":[{"clave":"pera","nombre":"pera","pictograma":"pera"},{"clave":"uva","nombre":"uvas","pictograma":"uva"},{"clave":"naranja","nombre":"naranja","pictograma":"naranja"},{"clave":"banano","nombre":"banano","pictograma":"banano"}],"secuencia":["llave","banano","manzana","banano","llave","banano","pera","manzana","uva","pera","llave","pera","naranja","manzana","uva","naranja","manzana","uva","banano","pera","naranja","pera","uva","manzana","banano","manzana","banano","manzana","pera","naranja","llave","uva","banano","naranja","llave","banano","llave","pera","uva","pera","llave","banano","pera","manzana","banano"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gato y bus',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"gato","nombre":"gato","pictograma":"gato"},{"clave":"bus","nombre":"bus","pictograma":"bus"}],"otros":[{"clave":"perro","nombre":"perro","pictograma":"perro"},{"clave":"pez","nombre":"pez","pictograma":"pez"},{"clave":"conejo","nombre":"conejo","pictograma":"conejo"},{"clave":"tortuga","nombre":"tortuga","pictograma":"tortuga"}],"secuencia":["bus","tortuga","pez","conejo","gato","perro","pez","perro","gato","perro","conejo","perro","bus","pez","gato","pez","tortuga","gato","tortuga","conejo","tortuga","conejo","gato","pez","perro","bus","perro","gato","pez","tortuga","gato","conejo","bus","perro","tortuga","bus","conejo","bus","pez","gato","tortuga","pez","perro","bus","perro"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca árbol y mariposa',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"arbol","nombre":"árbol","pictograma":"arbol"},{"clave":"mariposa","nombre":"mariposa","pictograma":"mariposa"}],"otros":[{"clave":"flor","nombre":"flor","pictograma":"flor"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"hongo","nombre":"hongo","pictograma":"hongo"},{"clave":"cactus","nombre":"cactus","pictograma":"cactus"}],"secuencia":["hongo","cactus","mariposa","cactus","arbol","flor","mariposa","hoja","hongo","arbol","hoja","hongo","hoja","cactus","arbol","hongo","arbol","flor","mariposa","hongo","flor","mariposa","flor","arbol","hoja","arbol","hongo","mariposa","hongo","hoja","hongo","mariposa","hongo","cactus","flor","hongo","hoja","arbol","hongo","cactus","hongo","mariposa","cactus","hongo","arbol"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca llave y gota',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"llave","nombre":"llave","pictograma":"llave"},{"clave":"gota","nombre":"gota","pictograma":"gota"}],"otros":[{"clave":"taza","nombre":"taza","pictograma":"taza"},{"clave":"silla","nombre":"silla","pictograma":"silla"},{"clave":"libro","nombre":"libro","pictograma":"libro"},{"clave":"reloj","nombre":"reloj","pictograma":"reloj"}],"secuencia":["llave","libro","llave","reloj","taza","gota","libro","taza","gota","silla","llave","silla","libro","taza","gota","libro","llave","taza","reloj","silla","llave","silla","libro","reloj","libro","gota","reloj","silla","taza","reloj","gota","taza","llave","taza","libro","gota","libro","reloj","taza","llave","libro","gota","reloj","taza","llave"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca bus y lluvia',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"bus","nombre":"bus","pictograma":"bus"},{"clave":"lluvia","nombre":"lluvia","pictograma":"lluvia"}],"otros":[{"clave":"tren","nombre":"tren","pictograma":"tren"},{"clave":"barco","nombre":"barco","pictograma":"barco"},{"clave":"carro","nombre":"carro","pictograma":"carro"},{"clave":"moto","nombre":"moto","pictograma":"moto"}],"secuencia":["tren","lluvia","moto","carro","barco","carro","moto","tren","lluvia","moto","tren","lluvia","moto","barco","bus","barco","tren","barco","carro","tren","bus","moto","bus","carro","lluvia","moto","bus","moto","bus","barco","tren","moto","bus","barco","lluvia","moto","bus","tren","lluvia","carro","barco","tren","lluvia","barco","bus"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca mariposa y estrella',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"mariposa","nombre":"mariposa","pictograma":"mariposa"},{"clave":"estrella","nombre":"estrella","pictograma":"estrella"}],"otros":[{"clave":"abeja","nombre":"abeja","pictograma":"abeja"},{"clave":"ave","nombre":"ave","pictograma":"ave"},{"clave":"caracol","nombre":"caracol","pictograma":"caracol"},{"clave":"pez","nombre":"pez","pictograma":"pez"}],"secuencia":["estrella","pez","mariposa","ave","estrella","pez","caracol","abeja","ave","pez","estrella","abeja","estrella","caracol","abeja","ave","abeja","estrella","ave","caracol","ave","abeja","mariposa","ave","estrella","pez","mariposa","caracol","mariposa","caracol","pez","caracol","estrella","caracol","pez","mariposa","caracol","abeja","caracol","mariposa","pez","mariposa","pez","mariposa","pez"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca gota y sol',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"gota","nombre":"gota","pictograma":"gota"},{"clave":"sol","nombre":"sol","pictograma":"sol"}],"otros":[{"clave":"circulo","nombre":"círculo","pictograma":"circulo"},{"clave":"cuadrado","nombre":"cuadrado","pictograma":"cuadrado"},{"clave":"hoja","nombre":"hoja","pictograma":"hoja"},{"clave":"nube","nombre":"nube","pictograma":"nube"}],"secuencia":["gota","nube","cuadrado","hoja","nube","sol","hoja","cuadrado","gota","hoja","circulo","sol","hoja","sol","hoja","circulo","sol","cuadrado","gota","cuadrado","gota","cuadrado","hoja","nube","cuadrado","nube","circulo","cuadrado","circulo","gota","cuadrado","gota","hoja","nube","gota","nube","sol","hoja","nube","sol","cuadrado","hoja","sol","hoja","gota"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510105-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000105',
    'Toca lluvia y manzana',
    2,
    '{"modo":"flujo","objetivos":[{"clave":"lluvia","nombre":"lluvia","pictograma":"lluvia"},{"clave":"manzana","nombre":"manzana","pictograma":"manzana"}],"otros":[{"clave":"sol","nombre":"sol","pictograma":"sol"},{"clave":"viento","nombre":"viento","pictograma":"viento"},{"clave":"copo","nombre":"copo de nieve","pictograma":"copo"},{"clave":"arcoiris","nombre":"arcoíris","pictograma":"arcoiris"}],"secuencia":["viento","manzana","sol","copo","arcoiris","sol","manzana","copo","arcoiris","sol","lluvia","copo","sol","lluvia","copo","arcoiris","manzana","sol","lluvia","viento","lluvia","copo","manzana","arcoiris","copo","lluvia","arcoiris","lluvia","sol","copo","sol","lluvia","sol","arcoiris","lluvia","viento","manzana","viento","copo","manzana","arcoiris","copo","manzana","copo","arcoiris"],"msPorEstimulo":1600,"puntosMaximos":15}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-06 · Recuerda la lista: 40 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510106-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000106',
    'En el mercado (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En el mercado","segundosVista":10,"elementos":[{"clave":"papa","nombre":"papa"},{"clave":"tomate","nombre":"tomate"},{"clave":"arroz","nombre":"arroz"},{"clave":"huevos","nombre":"huevos"}],"distractores":[{"clave":"leche","nombre":"leche"},{"clave":"cebolla","nombre":"cebolla"},{"clave":"aguacate","nombre":"aguacate"},{"clave":"pan","nombre":"pan"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000106',
    'Para el desayuno (4 cosas)',
    1,
    '{"modo":"lista","contexto":"Para el desayuno","segundosVista":10,"elementos":[{"clave":"arepa","nombre":"arepa"},{"clave":"huevo","nombre":"huevo"},{"clave":"cafe","nombre":"café"},{"clave":"queso","nombre":"queso"}],"distractores":[{"clave":"chocolate","nombre":"chocolate"},{"clave":"pan","nombre":"pan"},{"clave":"jugo","nombre":"jugo"},{"clave":"mantequilla","nombre":"mantequilla"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000106',
    'En la mochila del colegio (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En la mochila del colegio","segundosVista":10,"elementos":[{"clave":"cuaderno","nombre":"cuaderno"},{"clave":"lapiz","nombre":"lápiz"},{"clave":"regla","nombre":"regla"},{"clave":"borrador","nombre":"borrador"}],"distractores":[{"clave":"tijeras","nombre":"tijeras"},{"clave":"colores","nombre":"colores"},{"clave":"libro","nombre":"libro"},{"clave":"calculadora","nombre":"calculadora"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000106',
    'En la maleta de viaje (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En la maleta de viaje","segundosVista":10,"elementos":[{"clave":"camisa","nombre":"camisa"},{"clave":"zapatos","nombre":"zapatos"},{"clave":"cepillo","nombre":"cepillo"},{"clave":"toalla","nombre":"toalla"}],"distractores":[{"clave":"medias","nombre":"medias"},{"clave":"pijama","nombre":"pijama"},{"clave":"gorra","nombre":"gorra"},{"clave":"chaqueta","nombre":"chaqueta"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000106',
    'Para una caminata (4 cosas)',
    1,
    '{"modo":"lista","contexto":"Para una caminata","segundosVista":10,"elementos":[{"clave":"agua","nombre":"agua"},{"clave":"gorra","nombre":"gorra"},{"clave":"bloqueador","nombre":"bloqueador"},{"clave":"mapa","nombre":"mapa"}],"distractores":[{"clave":"linterna","nombre":"linterna"},{"clave":"cuerda","nombre":"cuerda"},{"clave":"panuelo","nombre":"pañuelo"},{"clave":"binoculares","nombre":"binoculares"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000106',
    'En el botiquín de la casa (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En el botiquín de la casa","segundosVista":10,"elementos":[{"clave":"curitas","nombre":"curitas"},{"clave":"gasas","nombre":"gasas"},{"clave":"algodon","nombre":"algodón"},{"clave":"venda","nombre":"venda"}],"distractores":[{"clave":"cinta","nombre":"cinta"},{"clave":"tijeras","nombre":"tijeras"},{"clave":"toallitas","nombre":"toallitas"},{"clave":"guantes","nombre":"guantes"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000106',
    'En la cocina (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En la cocina","segundosVista":10,"elementos":[{"clave":"olla","nombre":"olla"},{"clave":"sarten","nombre":"sartén"},{"clave":"cuchara","nombre":"cuchara"},{"clave":"colador","nombre":"colador"}],"distractores":[{"clave":"jarra","nombre":"jarra"},{"clave":"plato","nombre":"plato"},{"clave":"tenedor","nombre":"tenedor"},{"clave":"tabla","nombre":"tabla"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000106',
    'En el jardín (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En el jardín","segundosVista":10,"elementos":[{"clave":"pala","nombre":"pala"},{"clave":"regadera","nombre":"regadera"},{"clave":"semillas","nombre":"semillas"},{"clave":"guantes","nombre":"guantes"}],"distractores":[{"clave":"maceta","nombre":"maceta"},{"clave":"tierra","nombre":"tierra"},{"clave":"manguera","nombre":"manguera"},{"clave":"rastrillo","nombre":"rastrillo"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000106',
    'Para una fiesta de cumpleaños (4 cosas)',
    1,
    '{"modo":"lista","contexto":"Para una fiesta de cumpleaños","segundosVista":10,"elementos":[{"clave":"globos","nombre":"globos"},{"clave":"torta","nombre":"torta"},{"clave":"velas","nombre":"velas"},{"clave":"serpentinas","nombre":"serpentinas"}],"distractores":[{"clave":"mantel","nombre":"mantel"},{"clave":"regalo","nombre":"regalo"},{"clave":"platos","nombre":"platos"},{"clave":"vasos","nombre":"vasos"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000106',
    'En el escritorio (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En el escritorio","segundosVista":10,"elementos":[{"clave":"lampara","nombre":"lámpara"},{"clave":"libreta","nombre":"libreta"},{"clave":"esfero","nombre":"esfero"},{"clave":"computador","nombre":"computador"}],"distractores":[{"clave":"reloj","nombre":"reloj"},{"clave":"calculadora","nombre":"calculadora"},{"clave":"agenda","nombre":"agenda"},{"clave":"grapadora","nombre":"grapadora"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000106',
    'Para el picnic (4 cosas)',
    1,
    '{"modo":"lista","contexto":"Para el picnic","segundosVista":10,"elementos":[{"clave":"manta","nombre":"manta"},{"clave":"sandwiches","nombre":"sándwiches"},{"clave":"jugo","nombre":"jugo"},{"clave":"frutas","nombre":"frutas"}],"distractores":[{"clave":"servilletas","nombre":"servilletas"},{"clave":"termo","nombre":"termo"},{"clave":"canasta","nombre":"canasta"},{"clave":"galletas","nombre":"galletas"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000106',
    'En la sala (4 cosas)',
    1,
    '{"modo":"lista","contexto":"En la sala","segundosVista":10,"elementos":[{"clave":"sofa","nombre":"sofá"},{"clave":"televisor","nombre":"televisor"},{"clave":"lampara","nombre":"lámpara"},{"clave":"tapete","nombre":"tapete"}],"distractores":[{"clave":"cuadro","nombre":"cuadro"},{"clave":"mesa","nombre":"mesa"},{"clave":"cojin","nombre":"cojín"},{"clave":"planta","nombre":"planta"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000106',
    'Para un día de lluvia (4 cosas)',
    1,
    '{"modo":"lista","contexto":"Para un día de lluvia","segundosVista":10,"elementos":[{"clave":"paraguas","nombre":"paraguas"},{"clave":"botas","nombre":"botas"},{"clave":"impermeable","nombre":"impermeable"},{"clave":"toalla","nombre":"toalla"}],"distractores":[{"clave":"bolsa","nombre":"bolsa"},{"clave":"gorra","nombre":"gorra"},{"clave":"sombrilla","nombre":"sombrilla"},{"clave":"medias-secas","nombre":"medias secas"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000106',
    'En el mercado grande (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En el mercado grande","segundosVista":12,"elementos":[{"clave":"platano","nombre":"plátano"},{"clave":"yuca","nombre":"yuca"},{"clave":"cilantro","nombre":"cilantro"},{"clave":"pollo","nombre":"pollo"},{"clave":"frijol","nombre":"fríjol"},{"clave":"panela","nombre":"panela"}],"distractores":[{"clave":"maiz","nombre":"maíz"},{"clave":"tomate","nombre":"tomate"},{"clave":"limon","nombre":"limón"},{"clave":"cebolla","nombre":"cebolla"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000106',
    'Los útiles del colegio (6 cosas)',
    2,
    '{"modo":"lista","contexto":"Los útiles del colegio","segundosVista":12,"elementos":[{"clave":"cuaderno","nombre":"cuaderno"},{"clave":"lapiz","nombre":"lápiz"},{"clave":"borrador","nombre":"borrador"},{"clave":"regla","nombre":"regla"},{"clave":"sacapuntas","nombre":"sacapuntas"},{"clave":"colores","nombre":"colores"}],"distractores":[{"clave":"tijeras","nombre":"tijeras"},{"clave":"marcador","nombre":"marcador"},{"clave":"pegante","nombre":"pegante"},{"clave":"carpeta","nombre":"carpeta"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000106',
    'En la maleta de playa (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En la maleta de playa","segundosVista":12,"elementos":[{"clave":"toalla","nombre":"toalla"},{"clave":"sandalias","nombre":"sandalias"},{"clave":"bloqueador","nombre":"bloqueador"},{"clave":"gorra","nombre":"gorra"},{"clave":"gafas","nombre":"gafas"},{"clave":"botella","nombre":"botella"}],"distractores":[{"clave":"banador","nombre":"bañador"},{"clave":"pelota","nombre":"pelota"},{"clave":"libro","nombre":"libro"},{"clave":"sombrilla","nombre":"sombrilla"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000106',
    'En la cocina (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En la cocina","segundosVista":12,"elementos":[{"clave":"olla","nombre":"olla"},{"clave":"sarten","nombre":"sartén"},{"clave":"cuchara","nombre":"cuchara"},{"clave":"colador","nombre":"colador"},{"clave":"plato","nombre":"plato"},{"clave":"vaso","nombre":"vaso"}],"distractores":[{"clave":"tenedor","nombre":"tenedor"},{"clave":"taza","nombre":"taza"},{"clave":"jarra","nombre":"jarra"},{"clave":"licuadora","nombre":"licuadora"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000106',
    'En el taller (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En el taller","segundosVista":12,"elementos":[{"clave":"martillo","nombre":"martillo"},{"clave":"serrucho","nombre":"serrucho"},{"clave":"lija","nombre":"lija"},{"clave":"clavos","nombre":"clavos"},{"clave":"metro","nombre":"metro"},{"clave":"tornillos","nombre":"tornillos"}],"distractores":[{"clave":"taladro","nombre":"taladro"},{"clave":"pegante","nombre":"pegante"},{"clave":"gafas","nombre":"gafas"},{"clave":"pintura","nombre":"pintura"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000106',
    'En la papelería (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En la papelería","segundosVista":12,"elementos":[{"clave":"hojas","nombre":"hojas"},{"clave":"carpeta","nombre":"carpeta"},{"clave":"sobres","nombre":"sobres"},{"clave":"grapas","nombre":"grapas"},{"clave":"clips","nombre":"clips"},{"clave":"resaltador","nombre":"resaltador"}],"distractores":[{"clave":"pegante","nombre":"pegante"},{"clave":"regla","nombre":"regla"},{"clave":"cuaderno","nombre":"cuaderno"},{"clave":"tijeras","nombre":"tijeras"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000106',
    'El desayuno del domingo (6 cosas)',
    2,
    '{"modo":"lista","contexto":"El desayuno del domingo","segundosVista":12,"elementos":[{"clave":"arepas","nombre":"arepas"},{"clave":"huevos","nombre":"huevos"},{"clave":"queso","nombre":"queso"},{"clave":"cafe","nombre":"café"},{"clave":"chocolate","nombre":"chocolate"},{"clave":"mantequilla","nombre":"mantequilla"}],"distractores":[{"clave":"tamal","nombre":"tamal"},{"clave":"pan","nombre":"pan"},{"clave":"jugo","nombre":"jugo"},{"clave":"fruta","nombre":"fruta"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000106',
    'En el cuarto (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En el cuarto","segundosVista":12,"elementos":[{"clave":"cama","nombre":"cama"},{"clave":"almohada","nombre":"almohada"},{"clave":"cobija","nombre":"cobija"},{"clave":"lampara","nombre":"lámpara"},{"clave":"ropero","nombre":"ropero"},{"clave":"tapete","nombre":"tapete"}],"distractores":[{"clave":"silla","nombre":"silla"},{"clave":"reloj","nombre":"reloj"},{"clave":"espejo","nombre":"espejo"},{"clave":"cortina","nombre":"cortina"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000106',
    'Para una excursión (6 cosas)',
    2,
    '{"modo":"lista","contexto":"Para una excursión","segundosVista":12,"elementos":[{"clave":"mochila","nombre":"mochila"},{"clave":"botella","nombre":"botella"},{"clave":"linterna","nombre":"linterna"},{"clave":"mapa","nombre":"mapa"},{"clave":"gorra","nombre":"gorra"},{"clave":"impermeable","nombre":"impermeable"}],"distractores":[{"clave":"camara","nombre":"cámara"},{"clave":"binoculares","nombre":"binoculares"},{"clave":"baston","nombre":"bastón"},{"clave":"snacks","nombre":"snacks"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000106',
    'En el baño (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En el baño","segundosVista":12,"elementos":[{"clave":"jabon","nombre":"jabón"},{"clave":"toalla","nombre":"toalla"},{"clave":"cepillo","nombre":"cepillo"},{"clave":"peine","nombre":"peine"},{"clave":"champu","nombre":"champú"},{"clave":"espejo","nombre":"espejo"}],"distractores":[{"clave":"tapete","nombre":"tapete"},{"clave":"vaso","nombre":"vaso"},{"clave":"esponja","nombre":"esponja"},{"clave":"crema","nombre":"crema"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000106',
    'En la floristería (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En la floristería","segundosVista":12,"elementos":[{"clave":"rosas","nombre":"rosas"},{"clave":"margaritas","nombre":"margaritas"},{"clave":"girasoles","nombre":"girasoles"},{"clave":"lirios","nombre":"lirios"},{"clave":"jarron","nombre":"jarrón"},{"clave":"cinta","nombre":"cinta"}],"distractores":[{"clave":"tulipanes","nombre":"tulipanes"},{"clave":"tijeras","nombre":"tijeras"},{"clave":"orquideas","nombre":"orquídeas"},{"clave":"maceta","nombre":"maceta"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000106',
    'En la frutería (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En la frutería","segundosVista":12,"elementos":[{"clave":"mango","nombre":"mango"},{"clave":"lulo","nombre":"lulo"},{"clave":"mora","nombre":"mora"},{"clave":"guayaba","nombre":"guayaba"},{"clave":"papaya","nombre":"papaya"},{"clave":"pina","nombre":"piña"}],"distractores":[{"clave":"naranja","nombre":"naranja"},{"clave":"uvas","nombre":"uvas"},{"clave":"fresa","nombre":"fresa"},{"clave":"banano","nombre":"banano"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000106',
    'En la biblioteca (6 cosas)',
    2,
    '{"modo":"lista","contexto":"En la biblioteca","segundosVista":12,"elementos":[{"clave":"libro","nombre":"libro"},{"clave":"revista","nombre":"revista"},{"clave":"mapa","nombre":"mapa"},{"clave":"diccionario","nombre":"diccionario"},{"clave":"periodico","nombre":"periódico"},{"clave":"enciclopedia","nombre":"enciclopedia"}],"distractores":[{"clave":"atlas","nombre":"atlas"},{"clave":"folleto","nombre":"folleto"},{"clave":"cuaderno","nombre":"cuaderno"},{"clave":"novela","nombre":"novela"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000106',
    'El mercado de la semana (8 cosas)',
    3,
    '{"modo":"lista","contexto":"El mercado de la semana","segundosVista":15,"elementos":[{"clave":"papa","nombre":"papa"},{"clave":"yuca","nombre":"yuca"},{"clave":"platano","nombre":"plátano"},{"clave":"cebolla","nombre":"cebolla"},{"clave":"tomate","nombre":"tomate"},{"clave":"zanahoria","nombre":"zanahoria"},{"clave":"huevos","nombre":"huevos"},{"clave":"arroz","nombre":"arroz"}],"distractores":[{"clave":"leche","nombre":"leche"},{"clave":"pimenton","nombre":"pimentón"},{"clave":"ajo","nombre":"ajo"},{"clave":"lentejas","nombre":"lentejas"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000106',
    'La maleta de una semana (8 cosas)',
    3,
    '{"modo":"lista","contexto":"La maleta de una semana","segundosVista":15,"elementos":[{"clave":"camisas","nombre":"camisas"},{"clave":"pantalones","nombre":"pantalones"},{"clave":"medias","nombre":"medias"},{"clave":"zapatos","nombre":"zapatos"},{"clave":"cepillo","nombre":"cepillo"},{"clave":"toalla","nombre":"toalla"},{"clave":"chaqueta","nombre":"chaqueta"},{"clave":"pijama","nombre":"pijama"}],"distractores":[{"clave":"paraguas","nombre":"paraguas"},{"clave":"libro","nombre":"libro"},{"clave":"cargador","nombre":"cargador"},{"clave":"gorra","nombre":"gorra"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000106',
    'Una cocina completa (8 cosas)',
    3,
    '{"modo":"lista","contexto":"Una cocina completa","segundosVista":15,"elementos":[{"clave":"olla","nombre":"olla"},{"clave":"sarten","nombre":"sartén"},{"clave":"cuchara","nombre":"cuchara"},{"clave":"tenedor","nombre":"tenedor"},{"clave":"plato","nombre":"plato"},{"clave":"vaso","nombre":"vaso"},{"clave":"colador","nombre":"colador"},{"clave":"licuadora","nombre":"licuadora"}],"distractores":[{"clave":"taza","nombre":"taza"},{"clave":"cucharon","nombre":"cucharón"},{"clave":"jarra","nombre":"jarra"},{"clave":"tabla","nombre":"tabla"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000106',
    'Una oficina (8 cosas)',
    3,
    '{"modo":"lista","contexto":"Una oficina","segundosVista":15,"elementos":[{"clave":"lapiz","nombre":"lápiz"},{"clave":"esfero","nombre":"esfero"},{"clave":"resaltador","nombre":"resaltador"},{"clave":"grapadora","nombre":"grapadora"},{"clave":"clips","nombre":"clips"},{"clave":"carpeta","nombre":"carpeta"},{"clave":"calculadora","nombre":"calculadora"},{"clave":"agenda","nombre":"agenda"}],"distractores":[{"clave":"regla","nombre":"regla"},{"clave":"libreta","nombre":"libreta"},{"clave":"tijeras","nombre":"tijeras"},{"clave":"sobres","nombre":"sobres"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000106',
    'La fiesta (8 cosas)',
    3,
    '{"modo":"lista","contexto":"La fiesta","segundosVista":15,"elementos":[{"clave":"globos","nombre":"globos"},{"clave":"torta","nombre":"torta"},{"clave":"velas","nombre":"velas"},{"clave":"serpentinas","nombre":"serpentinas"},{"clave":"platos","nombre":"platos"},{"clave":"vasos","nombre":"vasos"},{"clave":"mantel","nombre":"mantel"},{"clave":"regalo","nombre":"regalo"}],"distractores":[{"clave":"pinata","nombre":"piñata"},{"clave":"sillas","nombre":"sillas"},{"clave":"gorros","nombre":"gorros"},{"clave":"musica","nombre":"música"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000106',
    'El jardín (8 cosas)',
    3,
    '{"modo":"lista","contexto":"El jardín","segundosVista":15,"elementos":[{"clave":"pala","nombre":"pala"},{"clave":"regadera","nombre":"regadera"},{"clave":"semillas","nombre":"semillas"},{"clave":"guantes","nombre":"guantes"},{"clave":"maceta","nombre":"maceta"},{"clave":"tierra","nombre":"tierra"},{"clave":"manguera","nombre":"manguera"},{"clave":"rastrillo","nombre":"rastrillo"}],"distractores":[{"clave":"abono","nombre":"abono"},{"clave":"carretilla","nombre":"carretilla"},{"clave":"tijeras-de-podar","nombre":"tijeras de podar"},{"clave":"sombrero","nombre":"sombrero"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000106',
    'La casa (8 cosas)',
    3,
    '{"modo":"lista","contexto":"La casa","segundosVista":15,"elementos":[{"clave":"sofa","nombre":"sofá"},{"clave":"mesa","nombre":"mesa"},{"clave":"silla","nombre":"silla"},{"clave":"lampara","nombre":"lámpara"},{"clave":"tapete","nombre":"tapete"},{"clave":"cuadro","nombre":"cuadro"},{"clave":"cojin","nombre":"cojín"},{"clave":"cortina","nombre":"cortina"}],"distractores":[{"clave":"florero","nombre":"florero"},{"clave":"espejo","nombre":"espejo"},{"clave":"planta","nombre":"planta"},{"clave":"reloj","nombre":"reloj"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000106',
    'El salón de clase (8 cosas)',
    3,
    '{"modo":"lista","contexto":"El salón de clase","segundosVista":15,"elementos":[{"clave":"cuaderno","nombre":"cuaderno"},{"clave":"lapiz","nombre":"lápiz"},{"clave":"regla","nombre":"regla"},{"clave":"borrador","nombre":"borrador"},{"clave":"sacapuntas","nombre":"sacapuntas"},{"clave":"colores","nombre":"colores"},{"clave":"tijeras","nombre":"tijeras"},{"clave":"pegante","nombre":"pegante"}],"distractores":[{"clave":"marcadores","nombre":"marcadores"},{"clave":"compas","nombre":"compás"},{"clave":"carpeta","nombre":"carpeta"},{"clave":"calculadora","nombre":"calculadora"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000106',
    'La tienda del barrio (8 cosas)',
    3,
    '{"modo":"lista","contexto":"La tienda del barrio","segundosVista":15,"elementos":[{"clave":"arroz","nombre":"arroz"},{"clave":"aceite","nombre":"aceite"},{"clave":"sal","nombre":"sal"},{"clave":"azucar","nombre":"azúcar"},{"clave":"panela","nombre":"panela"},{"clave":"frijol","nombre":"fríjol"},{"clave":"cafe","nombre":"café"},{"clave":"pasta","nombre":"pasta"}],"distractores":[{"clave":"leche","nombre":"leche"},{"clave":"harina","nombre":"harina"},{"clave":"huevos","nombre":"huevos"},{"clave":"galletas","nombre":"galletas"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000106',
    'Una excursión larga (8 cosas)',
    3,
    '{"modo":"lista","contexto":"Una excursión larga","segundosVista":15,"elementos":[{"clave":"mochila","nombre":"mochila"},{"clave":"botella","nombre":"botella"},{"clave":"linterna","nombre":"linterna"},{"clave":"mapa","nombre":"mapa"},{"clave":"gorra","nombre":"gorra"},{"clave":"impermeable","nombre":"impermeable"},{"clave":"bloqueador","nombre":"bloqueador"},{"clave":"snacks","nombre":"snacks"}],"distractores":[{"clave":"brujula","nombre":"brújula"},{"clave":"binoculares","nombre":"binoculares"},{"clave":"manta","nombre":"manta"},{"clave":"cuerda","nombre":"cuerda"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000106',
    'Un cuarto (8 cosas)',
    3,
    '{"modo":"lista","contexto":"Un cuarto","segundosVista":15,"elementos":[{"clave":"cama","nombre":"cama"},{"clave":"almohada","nombre":"almohada"},{"clave":"cobija","nombre":"cobija"},{"clave":"lampara","nombre":"lámpara"},{"clave":"ropero","nombre":"ropero"},{"clave":"tapete","nombre":"tapete"},{"clave":"espejo","nombre":"espejo"},{"clave":"cortina","nombre":"cortina"}],"distractores":[{"clave":"reloj","nombre":"reloj"},{"clave":"silla","nombre":"silla"},{"clave":"cajonera","nombre":"cajonera"},{"clave":"cuadro","nombre":"cuadro"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000106',
    'La panadería (8 cosas)',
    3,
    '{"modo":"lista","contexto":"La panadería","segundosVista":15,"elementos":[{"clave":"pan","nombre":"pan"},{"clave":"almojabana","nombre":"almojábana"},{"clave":"pandebono","nombre":"pandebono"},{"clave":"bunuelo","nombre":"buñuelo"},{"clave":"torta","nombre":"torta"},{"clave":"galleta","nombre":"galleta"},{"clave":"croissant","nombre":"croissant"},{"clave":"mantecada","nombre":"mantecada"}],"distractores":[{"clave":"arepa","nombre":"arepa"},{"clave":"empanada","nombre":"empanada"},{"clave":"tamal","nombre":"tamal"},{"clave":"mogolla","nombre":"mogolla"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000106',
    'La tienda de ropa (8 cosas)',
    3,
    '{"modo":"lista","contexto":"La tienda de ropa","segundosVista":15,"elementos":[{"clave":"camisa","nombre":"camisa"},{"clave":"pantalon","nombre":"pantalón"},{"clave":"falda","nombre":"falda"},{"clave":"chaqueta","nombre":"chaqueta"},{"clave":"vestido","nombre":"vestido"},{"clave":"bufanda","nombre":"bufanda"},{"clave":"gorra","nombre":"gorra"},{"clave":"zapatos","nombre":"zapatos"}],"distractores":[{"clave":"guantes","nombre":"guantes"},{"clave":"medias","nombre":"medias"},{"clave":"correa","nombre":"correa"},{"clave":"saco","nombre":"saco"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510106-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000106',
    'Un viaje en bus (8 cosas)',
    3,
    '{"modo":"lista","contexto":"Un viaje en bus","segundosVista":15,"elementos":[{"clave":"tiquete","nombre":"tiquete"},{"clave":"documento","nombre":"documento"},{"clave":"cargador","nombre":"cargador"},{"clave":"audifonos","nombre":"audífonos"},{"clave":"botella","nombre":"botella"},{"clave":"snack","nombre":"snack"},{"clave":"cobija","nombre":"cobija"},{"clave":"libro","nombre":"libro"}],"distractores":[{"clave":"almohada","nombre":"almohada"},{"clave":"revista","nombre":"revista"},{"clave":"panuelo","nombre":"pañuelo"},{"clave":"maleta","nombre":"maleta"}],"puntosMaximos":8}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-07 · Completa la palabra: 40 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510107-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 1',
    1,
    '{"modo":"completar","palabras":[{"pista":"Una fruta","palabra":"manzana","faltan":[3]},{"pista":"Una fruta amarilla","palabra":"banano","faltan":[3]},{"pista":"Un animal que ladra","palabra":"perro","faltan":[2]},{"pista":"Un animal de casa","palabra":"gato","faltan":[2]},{"pista":"Sirve para escribir","palabra":"lápiz","faltan":[2]},{"pista":"Un lugar para aprender","palabra":"escuela","faltan":[2]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 2',
    1,
    '{"modo":"completar","palabras":[{"pista":"Un medio de transporte","palabra":"tren","faltan":[1]},{"pista":"Una verdura","palabra":"cebolla","faltan":[3]},{"pista":"Una fruta y un color","palabra":"naranja","faltan":[1]},{"pista":"Se abre y se cierra","palabra":"puerta","faltan":[1]},{"pista":"Deja entrar la luz","palabra":"ventana","faltan":[1]},{"pista":"Se usa para tomar la sopa","palabra":"cuchara","faltan":[5]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 3',
    1,
    '{"modo":"completar","palabras":[{"pista":"Una prenda de vestir","palabra":"camisa","faltan":[1]},{"pista":"Se usa en los pies","palabra":"zapato","faltan":[4]},{"pista":"Está en el cielo","palabra":"nube","faltan":[2]},{"pista":"Un lugar muy alto","palabra":"montaña","faltan":[1]},{"pista":"Donde crecen las flores","palabra":"jardín","faltan":[2]},{"pista":"Un lugar para jugar","palabra":"parque","faltan":[1]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 4',
    1,
    '{"modo":"completar","palabras":[{"pista":"Allí se compra","palabra":"tienda","faltan":[4]},{"pista":"Dice la hora","palabra":"reloj","faltan":[3]},{"pista":"Se lee","palabra":"libro","faltan":[2]},{"pista":"Un mueble para comer","palabra":"mesa","faltan":[2]},{"pista":"Un mueble para sentarse","palabra":"silla","faltan":[3]},{"pista":"Sirve para dormir","palabra":"cama","faltan":[1]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 5',
    1,
    '{"modo":"completar","palabras":[{"pista":"La comida del mediodía","palabra":"almuerzo","faltan":[6]},{"pista":"La primera comida del día","palabra":"desayuno","faltan":[2]},{"pista":"La comida de la noche","palabra":"cena","faltan":[2]},{"pista":"Un familiar mayor","palabra":"abuelo","faltan":[2]},{"pista":"Un familiar","palabra":"hermano","faltan":[2]},{"pista":"Alguien cercano","palabra":"amigo","faltan":[3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 6',
    1,
    '{"modo":"completar","palabras":[{"pista":"Enseña en la escuela","palabra":"maestro","faltan":[5]},{"pista":"Hace el pan","palabra":"panadero","faltan":[6]},{"pista":"Pinta cuadros","palabra":"pintor","faltan":[1]},{"pista":"Un animal grande","palabra":"caballo","faltan":[3]},{"pista":"Un animal de orejas largas","palabra":"conejo","faltan":[2]},{"pista":"Un animal lento","palabra":"tortuga","faltan":[3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 7',
    1,
    '{"modo":"completar","palabras":[{"pista":"Un insecto de colores","palabra":"mariposa","faltan":[1]},{"pista":"Hace la miel","palabra":"abeja","faltan":[2]},{"pista":"Se usa en la cabeza","palabra":"sombrero","faltan":[6]},{"pista":"Un instrumento de cuerdas","palabra":"guitarra","faltan":[2]},{"pista":"Una fruta","palabra":"manzana","faltan":[2]},{"pista":"Una fruta amarilla","palabra":"banano","faltan":[2]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 8',
    1,
    '{"modo":"completar","palabras":[{"pista":"Un animal que ladra","palabra":"perro","faltan":[3]},{"pista":"Un animal de casa","palabra":"gato","faltan":[2]},{"pista":"Sirve para escribir","palabra":"lápiz","faltan":[3]},{"pista":"Un lugar para aprender","palabra":"escuela","faltan":[5]},{"pista":"Un medio de transporte","palabra":"tren","faltan":[1]},{"pista":"Una verdura","palabra":"cebolla","faltan":[3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 9',
    1,
    '{"modo":"completar","palabras":[{"pista":"Una fruta y un color","palabra":"naranja","faltan":[5]},{"pista":"Se abre y se cierra","palabra":"puerta","faltan":[3]},{"pista":"Deja entrar la luz","palabra":"ventana","faltan":[3]},{"pista":"Se usa para tomar la sopa","palabra":"cuchara","faltan":[1]},{"pista":"Una prenda de vestir","palabra":"camisa","faltan":[2]},{"pista":"Se usa en los pies","palabra":"zapato","faltan":[2]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 10',
    1,
    '{"modo":"completar","palabras":[{"pista":"Está en el cielo","palabra":"nube","faltan":[1]},{"pista":"Un lugar muy alto","palabra":"montaña","faltan":[5]},{"pista":"Donde crecen las flores","palabra":"jardín","faltan":[4]},{"pista":"Un lugar para jugar","palabra":"parque","faltan":[2]},{"pista":"Allí se compra","palabra":"tienda","faltan":[3]},{"pista":"Dice la hora","palabra":"reloj","faltan":[3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 11',
    1,
    '{"modo":"completar","palabras":[{"pista":"Se lee","palabra":"libro","faltan":[1]},{"pista":"Un mueble para comer","palabra":"mesa","faltan":[2]},{"pista":"Un mueble para sentarse","palabra":"silla","faltan":[2]},{"pista":"Sirve para dormir","palabra":"cama","faltan":[2]},{"pista":"La comida del mediodía","palabra":"almuerzo","faltan":[3]},{"pista":"La primera comida del día","palabra":"desayuno","faltan":[4]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 12',
    1,
    '{"modo":"completar","palabras":[{"pista":"La comida de la noche","palabra":"cena","faltan":[2]},{"pista":"Un familiar mayor","palabra":"abuelo","faltan":[1]},{"pista":"Un familiar","palabra":"hermano","faltan":[4]},{"pista":"Alguien cercano","palabra":"amigo","faltan":[2]},{"pista":"Enseña en la escuela","palabra":"maestro","faltan":[3]},{"pista":"Hace el pan","palabra":"panadero","faltan":[5]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000107',
    'Una letra, 13',
    1,
    '{"modo":"completar","palabras":[{"pista":"Pinta cuadros","palabra":"pintor","faltan":[3]},{"pista":"Un animal grande","palabra":"caballo","faltan":[2]},{"pista":"Un animal de orejas largas","palabra":"conejo","faltan":[4]},{"pista":"Un animal lento","palabra":"tortuga","faltan":[1]},{"pista":"Un insecto de colores","palabra":"mariposa","faltan":[5]},{"pista":"Hace la miel","palabra":"abeja","faltan":[3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 1',
    2,
    '{"modo":"completar","palabras":[{"pista":"Se cocina o se come maduro","palabra":"plátano","faltan":[1,5]},{"pista":"Una fruta tropical","palabra":"mango","faltan":[1,2]},{"pista":"Una fruta dulce","palabra":"guayaba","faltan":[1,3]},{"pista":"Vive en el agua","palabra":"pescado","faltan":[2,3]},{"pista":"Pone huevos","palabra":"gallina","faltan":[2,4]},{"pista":"Da lana","palabra":"oveja","faltan":[1,2]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 2',
    2,
    '{"modo":"completar","palabras":[{"pista":"Sirve para tomar notas","palabra":"cuaderno","faltan":[2,4]},{"pista":"Está en el salón de clase","palabra":"tablero","faltan":[1,3]},{"pista":"Da aire","palabra":"abanico","faltan":[1,2]},{"pista":"Abriga el cuello","palabra":"bufanda","faltan":[3,5]},{"pista":"Una prenda que abriga","palabra":"chaqueta","faltan":[3,6]},{"pista":"Protege de la lluvia","palabra":"paraguas","faltan":[3,5]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 3',
    2,
    '{"modo":"completar","palabras":[{"pista":"Brilla de noche","palabra":"estrella","faltan":[2,4]},{"pista":"Suena en la tormenta","palabra":"trueno","faltan":[3,4]},{"pista":"Tiene arena y mar","palabra":"playa","faltan":[1,2]},{"pista":"Cruza un río","palabra":"puente","faltan":[3,4]},{"pista":"Lleva de un lugar a otro","palabra":"camino","faltan":[2,4]},{"pista":"Tiene muchas casas y calles","palabra":"ciudad","faltan":[1,4]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 4',
    2,
    '{"modo":"completar","palabras":[{"pista":"Más pequeño que una ciudad","palabra":"pueblo","faltan":[2,3]},{"pista":"Un lugar abierto en el centro","palabra":"plaza","faltan":[1,3]},{"pista":"Allí se vende comida","palabra":"mercado","faltan":[3,4]},{"pista":"Donde se prepara la comida","palabra":"cocina","faltan":[1,3]},{"pista":"Un cuarto de la casa","palabra":"cuarto","faltan":[1,2]},{"pista":"Se asoma a la calle","palabra":"balcón","faltan":[2,3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 5',
    2,
    '{"modo":"completar","palabras":[{"pista":"Sirve para subir","palabra":"escalera","faltan":[3,6]},{"pista":"Da luz","palabra":"bombilla","faltan":[4,5]},{"pista":"Sirve para abrigarse","palabra":"cobija","faltan":[2,4]},{"pista":"Para apoyar la cabeza","palabra":"almohada","faltan":[4,6]},{"pista":"Muestra el reflejo","palabra":"espejo","faltan":[1,2]},{"pista":"Sirve para peinarse","palabra":"peine","faltan":[1,2]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 6',
    2,
    '{"modo":"completar","palabras":[{"pista":"Sirve para lavarse","palabra":"jabón","faltan":[2,3]},{"pista":"Sirve para secarse","palabra":"toalla","faltan":[1,4]},{"pista":"Sirve para viajar","palabra":"maleta","faltan":[2,4]},{"pista":"Para subir al bus","palabra":"tiquete","faltan":[1,2]},{"pista":"Representa la Tierra","palabra":"globo","faltan":[2,3]},{"pista":"Señala el norte","palabra":"brújula","faltan":[1,4]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 7',
    2,
    '{"modo":"completar","palabras":[{"pista":"Da luz y se lleva en la mano","palabra":"linterna","faltan":[1,6]},{"pista":"Tiene muchos árboles","palabra":"bosque","faltan":[1,2]},{"pista":"Agua que cae desde lo alto","palabra":"cascada","faltan":[3,4]},{"pista":"Un ave pequeña","palabra":"colibrí","faltan":[4,5]},{"pista":"Se cocina o se come maduro","palabra":"plátano","faltan":[2,4]},{"pista":"Una fruta tropical","palabra":"mango","faltan":[1,2]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 8',
    2,
    '{"modo":"completar","palabras":[{"pista":"Una fruta dulce","palabra":"guayaba","faltan":[1,2]},{"pista":"Vive en el agua","palabra":"pescado","faltan":[4,5]},{"pista":"Pone huevos","palabra":"gallina","faltan":[4,5]},{"pista":"Da lana","palabra":"oveja","faltan":[2,3]},{"pista":"Sirve para tomar notas","palabra":"cuaderno","faltan":[1,6]},{"pista":"Está en el salón de clase","palabra":"tablero","faltan":[1,5]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 9',
    2,
    '{"modo":"completar","palabras":[{"pista":"Da aire","palabra":"abanico","faltan":[1,4]},{"pista":"Abriga el cuello","palabra":"bufanda","faltan":[3,4]},{"pista":"Una prenda que abriga","palabra":"chaqueta","faltan":[3,4]},{"pista":"Protege de la lluvia","palabra":"paraguas","faltan":[3,4]},{"pista":"Brilla de noche","palabra":"estrella","faltan":[2,4]},{"pista":"Suena en la tormenta","palabra":"trueno","faltan":[3,4]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 10',
    2,
    '{"modo":"completar","palabras":[{"pista":"Tiene arena y mar","palabra":"playa","faltan":[2,3]},{"pista":"Cruza un río","palabra":"puente","faltan":[1,2]},{"pista":"Lleva de un lugar a otro","palabra":"camino","faltan":[2,4]},{"pista":"Tiene muchas casas y calles","palabra":"ciudad","faltan":[3,4]},{"pista":"Más pequeño que una ciudad","palabra":"pueblo","faltan":[3,4]},{"pista":"Un lugar abierto en el centro","palabra":"plaza","faltan":[2,3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 11',
    2,
    '{"modo":"completar","palabras":[{"pista":"Allí se vende comida","palabra":"mercado","faltan":[1,5]},{"pista":"Donde se prepara la comida","palabra":"cocina","faltan":[3,4]},{"pista":"Un cuarto de la casa","palabra":"cuarto","faltan":[2,3]},{"pista":"Se asoma a la calle","palabra":"balcón","faltan":[3,4]},{"pista":"Sirve para subir","palabra":"escalera","faltan":[3,6]},{"pista":"Da luz","palabra":"bombilla","faltan":[1,3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 12',
    2,
    '{"modo":"completar","palabras":[{"pista":"Sirve para abrigarse","palabra":"cobija","faltan":[1,3]},{"pista":"Para apoyar la cabeza","palabra":"almohada","faltan":[4,6]},{"pista":"Muestra el reflejo","palabra":"espejo","faltan":[2,3]},{"pista":"Sirve para peinarse","palabra":"peine","faltan":[1,2]},{"pista":"Sirve para lavarse","palabra":"jabón","faltan":[1,3]},{"pista":"Sirve para secarse","palabra":"toalla","faltan":[1,2]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000107',
    'Dos letras, 13',
    2,
    '{"modo":"completar","palabras":[{"pista":"Sirve para viajar","palabra":"maleta","faltan":[2,4]},{"pista":"Para subir al bus","palabra":"tiquete","faltan":[1,5]},{"pista":"Representa la Tierra","palabra":"globo","faltan":[1,3]},{"pista":"Señala el norte","palabra":"brújula","faltan":[1,5]},{"pista":"Da luz y se lleva en la mano","palabra":"linterna","faltan":[1,2]},{"pista":"Tiene muchos árboles","palabra":"bosque","faltan":[2,3]}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 1',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Un instrumento que se golpea","palabra":"tambor","revuelta":"rtoabm"},{"pista":"Un instrumento que se sopla","palabra":"flauta","revuelta":"tualfa"},{"pista":"Un instrumento de cuerda con arco","palabra":"violín","revuelta":"ívinlo"},{"pista":"Una fruta ácida","palabra":"limón","revuelta":"nilóm"},{"pista":"Una fruta grande y roja por dentro","palabra":"sandía","revuelta":"díasna"},{"pista":"Una fruta de piel suave","palabra":"durazno","revuelta":"uradnzo"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 2',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Una verdura verde y alargada","palabra":"pepino","revuelta":"neiopp"},{"pista":"Una verdura de hoja","palabra":"lechuga","revuelta":"eaclghu"},{"pista":"Una semilla verde y pequeña","palabra":"arveja","revuelta":"raejav"},{"pista":"Un espacio de la casa para dormir","palabra":"alcoba","revuelta":"balcao"},{"pista":"Cubre la ventana","palabra":"cortina","revuelta":"atcorin"},{"pista":"Cubre el piso","palabra":"tapete","revuelta":"teteap"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 3',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Se cuelga en la pared","palabra":"cuadro","revuelta":"crouda"},{"pista":"Sostiene las flores","palabra":"florero","revuelta":"frloore"},{"pista":"Suave, para apoyarse","palabra":"cojín","revuelta":"cíjno"},{"pista":"Un río muy pequeño","palabra":"arroyo","revuelta":"oorayr"},{"pista":"Agua rodeada de tierra","palabra":"laguna","revuelta":"lauagn"},{"pista":"Una montaña pequeña","palabra":"colina","revuelta":"aniloc"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 4',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Tierra entre montañas","palabra":"valle","revuelta":"vllae"},{"pista":"Muchos árboles y animales","palabra":"selva","revuelta":"alesv"},{"pista":"Transporta cargas grandes","palabra":"camión","revuelta":"iócman"},{"pista":"Vuela con pasajeros","palabra":"avión","revuelta":"ivnaó"},{"pista":"Navega por el agua","palabra":"barco","revuelta":"oabrc"},{"pista":"Un tren de ciudad","palabra":"metro","revuelta":"teorm"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 5',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Con ruedas, para deslizarse","palabra":"patines","revuelta":"pnistae"},{"pista":"Se lanza y se patea","palabra":"pelota","revuelta":"aepotl"},{"pista":"Vuela con el viento","palabra":"cometa","revuelta":"catmoe"},{"pista":"Gira en el suelo","palabra":"trompo","revuelta":"mooptr"},{"pista":"El último día de la semana","palabra":"domingo","revuelta":"iondomg"},{"pista":"El día después del lunes","palabra":"martes","revuelta":"amrtes"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 6',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Un mes del año","palabra":"octubre","revuelta":"ocretub"},{"pista":"Siete días","palabra":"semana","revuelta":"enaams"},{"pista":"La primera parte del día","palabra":"mañana","revuelta":"añamna"},{"pista":"Después del mediodía","palabra":"tarde","revuelta":"eratd"},{"pista":"Cuando oscurece","palabra":"noche","revuelta":"ehnco"},{"pista":"La hija de tus padres","palabra":"hermana","revuelta":"namrahe"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 7',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Vive cerca de ti","palabra":"vecino","revuelta":"nicove"},{"pista":"Conduce un bus","palabra":"chofer","revuelta":"ehrcof"},{"pista":"Prepara la comida","palabra":"cocinero","revuelta":"icoenroc"},{"pista":"Construye casas","palabra":"albañil","revuelta":"biallañ"},{"pista":"Un gesto cariñoso con los brazos","palabra":"abrazo","revuelta":"oabzra"},{"pista":"Un gesto alegre en la cara","palabra":"sonrisa","revuelta":"ssrnaio"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 8',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Un instrumento que se golpea","palabra":"tambor","revuelta":"abomtr"},{"pista":"Un instrumento que se sopla","palabra":"flauta","revuelta":"afulat"},{"pista":"Un instrumento de cuerda con arco","palabra":"violín","revuelta":"livnío"},{"pista":"Una fruta ácida","palabra":"limón","revuelta":"ómnli"},{"pista":"Una fruta grande y roja por dentro","palabra":"sandía","revuelta":"nsadía"},{"pista":"Una fruta de piel suave","palabra":"durazno","revuelta":"unzoard"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 9',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Una verdura verde y alargada","palabra":"pepino","revuelta":"nipope"},{"pista":"Una verdura de hoja","palabra":"lechuga","revuelta":"uaechgl"},{"pista":"Una semilla verde y pequeña","palabra":"arveja","revuelta":"araejv"},{"pista":"Un espacio de la casa para dormir","palabra":"alcoba","revuelta":"laobca"},{"pista":"Cubre la ventana","palabra":"cortina","revuelta":"ntorcia"},{"pista":"Cubre el piso","palabra":"tapete","revuelta":"pteate"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 10',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Se cuelga en la pared","palabra":"cuadro","revuelta":"cdroua"},{"pista":"Sostiene las flores","palabra":"florero","revuelta":"reofrol"},{"pista":"Suave, para apoyarse","palabra":"cojín","revuelta":"noícj"},{"pista":"Un río muy pequeño","palabra":"arroyo","revuelta":"aorroy"},{"pista":"Agua rodeada de tierra","palabra":"laguna","revuelta":"naalgu"},{"pista":"Una montaña pequeña","palabra":"colina","revuelta":"ocilan"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 11',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Tierra entre montañas","palabra":"valle","revuelta":"avell"},{"pista":"Muchos árboles y animales","palabra":"selva","revuelta":"velas"},{"pista":"Transporta cargas grandes","palabra":"camión","revuelta":"micnaó"},{"pista":"Vuela con pasajeros","palabra":"avión","revuelta":"ióvan"},{"pista":"Navega por el agua","palabra":"barco","revuelta":"croba"},{"pista":"Un tren de ciudad","palabra":"metro","revuelta":"rtmeo"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 12',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Con ruedas, para deslizarse","palabra":"patines","revuelta":"aistenp"},{"pista":"Se lanza y se patea","palabra":"pelota","revuelta":"tlpoea"},{"pista":"Vuela con el viento","palabra":"cometa","revuelta":"meaoct"},{"pista":"Gira en el suelo","palabra":"trompo","revuelta":"torpmo"},{"pista":"El último día de la semana","palabra":"domingo","revuelta":"moonigd"},{"pista":"El día después del lunes","palabra":"martes","revuelta":"taserm"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 13',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Un mes del año","palabra":"octubre","revuelta":"oburetc"},{"pista":"Siete días","palabra":"semana","revuelta":"asmnae"},{"pista":"La primera parte del día","palabra":"mañana","revuelta":"anaañm"},{"pista":"Después del mediodía","palabra":"tarde","revuelta":"adtre"},{"pista":"Cuando oscurece","palabra":"noche","revuelta":"oench"},{"pista":"La hija de tus padres","palabra":"hermana","revuelta":"enmarah"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510107-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000107',
    'Anagramas, 14',
    3,
    '{"modo":"anagrama","palabras":[{"pista":"Vive cerca de ti","palabra":"vecino","revuelta":"ivnceo"},{"pista":"Conduce un bus","palabra":"chofer","revuelta":"ocrefh"},{"pista":"Prepara la comida","palabra":"cocinero","revuelta":"erccioon"},{"pista":"Construye casas","palabra":"albañil","revuelta":"abilñla"},{"pista":"Un gesto cariñoso con los brazos","palabra":"abrazo","revuelta":"azaorb"},{"pista":"Un gesto alegre en la cara","palabra":"sonrisa","revuelta":"nrasios"}],"puntosMaximos":6}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-08 · Une los puntos en orden: 40 sesiones, SIN PUBLICAR (revision: pendiente).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510108-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 1',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":47,"y":46},{"etiqueta":"2","x":92,"y":18},{"etiqueta":"3","x":89,"y":84},{"etiqueta":"4","x":16,"y":9},{"etiqueta":"5","x":45,"y":14},{"etiqueta":"6","x":92,"y":46},{"etiqueta":"7","x":11,"y":49},{"etiqueta":"8","x":12,"y":86}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 2',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":52,"y":10},{"etiqueta":"2","x":56,"y":94},{"etiqueta":"3","x":87,"y":82},{"etiqueta":"4","x":7,"y":89},{"etiqueta":"5","x":10,"y":46},{"etiqueta":"6","x":93,"y":8},{"etiqueta":"7","x":17,"y":15},{"etiqueta":"8","x":47,"y":54}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 3',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":85,"y":16},{"etiqueta":"2","x":49,"y":84},{"etiqueta":"3","x":15,"y":15},{"etiqueta":"4","x":90,"y":49},{"etiqueta":"5","x":12,"y":51},{"etiqueta":"6","x":7,"y":92},{"etiqueta":"7","x":90,"y":89},{"etiqueta":"8","x":55,"y":8}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 4',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":7,"y":54},{"etiqueta":"2","x":14,"y":12},{"etiqueta":"3","x":48,"y":7},{"etiqueta":"4","x":89,"y":93},{"etiqueta":"5","x":56,"y":90},{"etiqueta":"6","x":93,"y":45},{"etiqueta":"7","x":11,"y":94},{"etiqueta":"8","x":94,"y":17}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 5',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":90,"y":9},{"etiqueta":"2","x":84,"y":83},{"etiqueta":"3","x":45,"y":90},{"etiqueta":"4","x":87,"y":47},{"etiqueta":"5","x":10,"y":86},{"etiqueta":"6","x":51,"y":48},{"etiqueta":"7","x":14,"y":16},{"etiqueta":"8","x":53,"y":12}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 6',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":45,"y":47},{"etiqueta":"2","x":93,"y":52},{"etiqueta":"3","x":54,"y":11},{"etiqueta":"4","x":46,"y":91},{"etiqueta":"5","x":83,"y":7},{"etiqueta":"6","x":11,"y":86},{"etiqueta":"7","x":7,"y":16},{"etiqueta":"8","x":94,"y":83}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 7',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":84,"y":7},{"etiqueta":"2","x":18,"y":8},{"etiqueta":"3","x":17,"y":47},{"etiqueta":"4","x":18,"y":93},{"etiqueta":"5","x":50,"y":7},{"etiqueta":"6","x":91,"y":51},{"etiqueta":"7","x":55,"y":54},{"etiqueta":"8","x":85,"y":82}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 8',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":93,"y":44},{"etiqueta":"2","x":51,"y":45},{"etiqueta":"3","x":12,"y":94},{"etiqueta":"4","x":90,"y":14},{"etiqueta":"5","x":47,"y":14},{"etiqueta":"6","x":49,"y":88},{"etiqueta":"7","x":10,"y":15},{"etiqueta":"8","x":16,"y":49}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 9',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":87,"y":54},{"etiqueta":"2","x":55,"y":46},{"etiqueta":"3","x":93,"y":90},{"etiqueta":"4","x":11,"y":6},{"etiqueta":"5","x":47,"y":91},{"etiqueta":"6","x":17,"y":49},{"etiqueta":"7","x":87,"y":15},{"etiqueta":"8","x":55,"y":18}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 10',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":86,"y":52},{"etiqueta":"2","x":55,"y":17},{"etiqueta":"3","x":6,"y":49},{"etiqueta":"4","x":47,"y":47},{"etiqueta":"5","x":93,"y":18},{"etiqueta":"6","x":91,"y":89},{"etiqueta":"7","x":12,"y":90},{"etiqueta":"8","x":45,"y":84}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 11',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":53,"y":87},{"etiqueta":"2","x":86,"y":6},{"etiqueta":"3","x":14,"y":91},{"etiqueta":"4","x":7,"y":13},{"etiqueta":"5","x":53,"y":9},{"etiqueta":"6","x":53,"y":52},{"etiqueta":"7","x":91,"y":46},{"etiqueta":"8","x":88,"y":85}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 12',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":91,"y":11},{"etiqueta":"2","x":56,"y":48},{"etiqueta":"3","x":8,"y":9},{"etiqueta":"4","x":93,"y":48},{"etiqueta":"5","x":6,"y":47},{"etiqueta":"6","x":12,"y":92},{"etiqueta":"7","x":47,"y":89},{"etiqueta":"8","x":93,"y":83}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000108',
    'Ocho puntos, 13',
    1,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":90,"y":7},{"etiqueta":"2","x":50,"y":86},{"etiqueta":"3","x":90,"y":84},{"etiqueta":"4","x":50,"y":56},{"etiqueta":"5","x":16,"y":56},{"etiqueta":"6","x":11,"y":12},{"etiqueta":"7","x":13,"y":88},{"etiqueta":"8","x":50,"y":16}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 1',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":38,"y":50},{"etiqueta":"2","x":87,"y":52},{"etiqueta":"3","x":87,"y":87},{"etiqueta":"4","x":61,"y":85},{"etiqueta":"5","x":10,"y":16},{"etiqueta":"6","x":85,"y":10},{"etiqueta":"7","x":62,"y":49},{"etiqueta":"8","x":38,"y":90},{"etiqueta":"9","x":34,"y":9},{"etiqueta":"10","x":62,"y":11},{"etiqueta":"11","x":10,"y":90},{"etiqueta":"12","x":9,"y":51}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 2',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":14,"y":51},{"etiqueta":"2","x":64,"y":52},{"etiqueta":"3","x":63,"y":92},{"etiqueta":"4","x":91,"y":54},{"etiqueta":"5","x":10,"y":88},{"etiqueta":"6","x":37,"y":46},{"etiqueta":"7","x":63,"y":16},{"etiqueta":"8","x":34,"y":13},{"etiqueta":"9","x":37,"y":91},{"etiqueta":"10","x":10,"y":16},{"etiqueta":"11","x":91,"y":15},{"etiqueta":"12","x":84,"y":88}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 3',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":88,"y":84},{"etiqueta":"2","x":89,"y":10},{"etiqueta":"3","x":15,"y":8},{"etiqueta":"4","x":63,"y":88},{"etiqueta":"5","x":63,"y":51},{"etiqueta":"6","x":33,"y":54},{"etiqueta":"7","x":39,"y":88},{"etiqueta":"8","x":63,"y":14},{"etiqueta":"9","x":8,"y":54},{"etiqueta":"10","x":13,"y":87},{"etiqueta":"11","x":34,"y":15},{"etiqueta":"12","x":92,"y":48}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 4',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":36,"y":88},{"etiqueta":"2","x":63,"y":53},{"etiqueta":"3","x":85,"y":86},{"etiqueta":"4","x":13,"y":91},{"etiqueta":"5","x":59,"y":16},{"etiqueta":"6","x":84,"y":9},{"etiqueta":"7","x":10,"y":51},{"etiqueta":"8","x":64,"y":89},{"etiqueta":"9","x":39,"y":8},{"etiqueta":"10","x":91,"y":48},{"etiqueta":"11","x":12,"y":11},{"etiqueta":"12","x":38,"y":46}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 5',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":34,"y":16},{"etiqueta":"2","x":16,"y":53},{"etiqueta":"3","x":66,"y":90},{"etiqueta":"4","x":15,"y":91},{"etiqueta":"5","x":62,"y":49},{"etiqueta":"6","x":37,"y":50},{"etiqueta":"7","x":63,"y":11},{"etiqueta":"8","x":34,"y":90},{"etiqueta":"9","x":12,"y":15},{"etiqueta":"10","x":89,"y":88},{"etiqueta":"11","x":87,"y":53},{"etiqueta":"12","x":92,"y":15}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 6',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":16,"y":50},{"etiqueta":"2","x":36,"y":49},{"etiqueta":"3","x":66,"y":92},{"etiqueta":"4","x":34,"y":84},{"etiqueta":"5","x":64,"y":13},{"etiqueta":"6","x":92,"y":87},{"etiqueta":"7","x":62,"y":51},{"etiqueta":"8","x":88,"y":14},{"etiqueta":"9","x":89,"y":48},{"etiqueta":"10","x":35,"y":13},{"etiqueta":"11","x":16,"y":88},{"etiqueta":"12","x":15,"y":15}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 7',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":66,"y":84},{"etiqueta":"2","x":35,"y":14},{"etiqueta":"3","x":85,"y":12},{"etiqueta":"4","x":35,"y":54},{"etiqueta":"5","x":85,"y":51},{"etiqueta":"6","x":33,"y":87},{"etiqueta":"7","x":11,"y":54},{"etiqueta":"8","x":61,"y":13},{"etiqueta":"9","x":91,"y":90},{"etiqueta":"10","x":59,"y":53},{"etiqueta":"11","x":9,"y":91},{"etiqueta":"12","x":8,"y":13}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 8',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":33,"y":48},{"etiqueta":"2","x":15,"y":48},{"etiqueta":"3","x":62,"y":10},{"etiqueta":"4","x":39,"y":13},{"etiqueta":"5","x":88,"y":91},{"etiqueta":"6","x":11,"y":9},{"etiqueta":"7","x":91,"y":52},{"etiqueta":"8","x":89,"y":8},{"etiqueta":"9","x":8,"y":91},{"etiqueta":"10","x":66,"y":87},{"etiqueta":"11","x":38,"y":87},{"etiqueta":"12","x":60,"y":49}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 9',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":36,"y":46},{"etiqueta":"2","x":87,"y":9},{"etiqueta":"3","x":33,"y":84},{"etiqueta":"4","x":66,"y":46},{"etiqueta":"5","x":61,"y":91},{"etiqueta":"6","x":10,"y":16},{"etiqueta":"7","x":87,"y":89},{"etiqueta":"8","x":65,"y":12},{"etiqueta":"9","x":16,"y":48},{"etiqueta":"10","x":35,"y":14},{"etiqueta":"11","x":16,"y":90},{"etiqueta":"12","x":88,"y":51}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 10',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":38,"y":87},{"etiqueta":"2","x":11,"y":91},{"etiqueta":"3","x":62,"y":53},{"etiqueta":"4","x":16,"y":8},{"etiqueta":"5","x":90,"y":49},{"etiqueta":"6","x":62,"y":10},{"etiqueta":"7","x":87,"y":92},{"etiqueta":"8","x":36,"y":54},{"etiqueta":"9","x":89,"y":14},{"etiqueta":"10","x":11,"y":47},{"etiqueta":"11","x":39,"y":14},{"etiqueta":"12","x":59,"y":91}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 11',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":12,"y":16},{"etiqueta":"2","x":85,"y":84},{"etiqueta":"3","x":41,"y":49},{"etiqueta":"4","x":62,"y":91},{"etiqueta":"5","x":86,"y":9},{"etiqueta":"6","x":65,"y":46},{"etiqueta":"7","x":10,"y":46},{"etiqueta":"8","x":38,"y":10},{"etiqueta":"9","x":12,"y":88},{"etiqueta":"10","x":65,"y":10},{"etiqueta":"11","x":88,"y":54},{"etiqueta":"12","x":34,"y":89}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 12',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":12,"y":52},{"etiqueta":"2","x":64,"y":84},{"etiqueta":"3","x":64,"y":50},{"etiqueta":"4","x":40,"y":87},{"etiqueta":"5","x":10,"y":92},{"etiqueta":"6","x":90,"y":46},{"etiqueta":"7","x":37,"y":53},{"etiqueta":"8","x":89,"y":88},{"etiqueta":"9","x":64,"y":14},{"etiqueta":"10","x":87,"y":8},{"etiqueta":"11","x":12,"y":8},{"etiqueta":"12","x":41,"y":9}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000108',
    'Doce puntos, 13',
    2,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden: 1, 2, 3…","puntos":[{"etiqueta":"1","x":15,"y":90},{"etiqueta":"2","x":66,"y":13},{"etiqueta":"3","x":37,"y":15},{"etiqueta":"4","x":39,"y":87},{"etiqueta":"5","x":14,"y":14},{"etiqueta":"6","x":90,"y":8},{"etiqueta":"7","x":92,"y":86},{"etiqueta":"8","x":61,"y":86},{"etiqueta":"9","x":88,"y":48},{"etiqueta":"10","x":60,"y":54},{"etiqueta":"11","x":40,"y":50},{"etiqueta":"12","x":16,"y":52}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 1',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":63,"y":34},{"etiqueta":"A","x":36,"y":11},{"etiqueta":"2","x":60,"y":9},{"etiqueta":"B","x":15,"y":38},{"etiqueta":"3","x":88,"y":63},{"etiqueta":"C","x":59,"y":87},{"etiqueta":"4","x":84,"y":37},{"etiqueta":"D","x":59,"y":66},{"etiqueta":"5","x":88,"y":15},{"etiqueta":"E","x":92,"y":87},{"etiqueta":"6","x":14,"y":61},{"etiqueta":"F","x":37,"y":60},{"etiqueta":"7","x":39,"y":40},{"etiqueta":"G","x":8,"y":85},{"etiqueta":"8","x":36,"y":84},{"etiqueta":"H","x":16,"y":11}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 2',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":36,"y":65},{"etiqueta":"A","x":16,"y":89},{"etiqueta":"2","x":61,"y":37},{"etiqueta":"B","x":15,"y":41},{"etiqueta":"3","x":35,"y":87},{"etiqueta":"C","x":87,"y":66},{"etiqueta":"4","x":89,"y":92},{"etiqueta":"D","x":63,"y":67},{"etiqueta":"5","x":87,"y":8},{"etiqueta":"E","x":67,"y":9},{"etiqueta":"6","x":13,"y":64},{"etiqueta":"F","x":41,"y":9},{"etiqueta":"7","x":85,"y":36},{"etiqueta":"G","x":38,"y":36},{"etiqueta":"8","x":13,"y":15},{"etiqueta":"H","x":64,"y":92}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 3',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":16,"y":41},{"etiqueta":"A","x":62,"y":61},{"etiqueta":"2","x":91,"y":89},{"etiqueta":"B","x":39,"y":34},{"etiqueta":"3","x":84,"y":11},{"etiqueta":"C","x":41,"y":86},{"etiqueta":"4","x":90,"y":38},{"etiqueta":"D","x":64,"y":36},{"etiqueta":"5","x":8,"y":61},{"etiqueta":"E","x":33,"y":66},{"etiqueta":"6","x":63,"y":8},{"etiqueta":"F","x":60,"y":88},{"etiqueta":"7","x":85,"y":66},{"etiqueta":"G","x":13,"y":12},{"etiqueta":"8","x":13,"y":85},{"etiqueta":"H","x":41,"y":13}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 4',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":10,"y":35},{"etiqueta":"A","x":16,"y":64},{"etiqueta":"2","x":37,"y":8},{"etiqueta":"B","x":89,"y":36},{"etiqueta":"3","x":86,"y":84},{"etiqueta":"C","x":62,"y":10},{"etiqueta":"4","x":36,"y":67},{"etiqueta":"D","x":90,"y":62},{"etiqueta":"5","x":90,"y":15},{"etiqueta":"E","x":13,"y":14},{"etiqueta":"6","x":62,"y":41},{"etiqueta":"F","x":37,"y":40},{"etiqueta":"7","x":67,"y":87},{"etiqueta":"G","x":65,"y":61},{"etiqueta":"8","x":9,"y":84},{"etiqueta":"H","x":41,"y":91}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 5',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":15,"y":66},{"etiqueta":"A","x":37,"y":9},{"etiqueta":"2","x":9,"y":91},{"etiqueta":"B","x":84,"y":8},{"etiqueta":"3","x":41,"y":60},{"etiqueta":"C","x":41,"y":92},{"etiqueta":"4","x":66,"y":67},{"etiqueta":"D","x":66,"y":88},{"etiqueta":"5","x":14,"y":12},{"etiqueta":"E","x":85,"y":90},{"etiqueta":"6","x":89,"y":67},{"etiqueta":"F","x":64,"y":11},{"etiqueta":"7","x":16,"y":35},{"etiqueta":"G","x":88,"y":35},{"etiqueta":"8","x":62,"y":37},{"etiqueta":"H","x":39,"y":41}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 6',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":14,"y":36},{"etiqueta":"A","x":62,"y":87},{"etiqueta":"2","x":34,"y":84},{"etiqueta":"B","x":40,"y":33},{"etiqueta":"3","x":61,"y":64},{"etiqueta":"C","x":92,"y":36},{"etiqueta":"4","x":36,"y":11},{"etiqueta":"D","x":92,"y":90},{"etiqueta":"5","x":36,"y":66},{"etiqueta":"E","x":9,"y":89},{"etiqueta":"6","x":86,"y":63},{"etiqueta":"F","x":89,"y":16},{"etiqueta":"7","x":14,"y":10},{"etiqueta":"G","x":63,"y":34},{"etiqueta":"8","x":14,"y":61},{"etiqueta":"H","x":61,"y":8}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 7',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":91,"y":15},{"etiqueta":"A","x":64,"y":15},{"etiqueta":"2","x":12,"y":90},{"etiqueta":"B","x":35,"y":12},{"etiqueta":"3","x":63,"y":62},{"etiqueta":"C","x":84,"y":91},{"etiqueta":"4","x":89,"y":38},{"etiqueta":"D","x":9,"y":36},{"etiqueta":"5","x":33,"y":67},{"etiqueta":"E","x":65,"y":37},{"etiqueta":"6","x":40,"y":38},{"etiqueta":"F","x":92,"y":66},{"etiqueta":"7","x":61,"y":91},{"etiqueta":"G","x":12,"y":16},{"etiqueta":"8","x":33,"y":92},{"etiqueta":"H","x":9,"y":65}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 8',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":66,"y":36},{"etiqueta":"A","x":61,"y":8},{"etiqueta":"2","x":67,"y":59},{"etiqueta":"B","x":13,"y":91},{"etiqueta":"3","x":91,"y":39},{"etiqueta":"C","x":92,"y":87},{"etiqueta":"4","x":8,"y":35},{"etiqueta":"D","x":12,"y":11},{"etiqueta":"5","x":65,"y":90},{"etiqueta":"E","x":35,"y":61},{"etiqueta":"6","x":88,"y":13},{"etiqueta":"F","x":36,"y":38},{"etiqueta":"7","x":34,"y":12},{"etiqueta":"G","x":34,"y":90},{"etiqueta":"8","x":15,"y":65},{"etiqueta":"H","x":92,"y":65}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 9',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":12,"y":90},{"etiqueta":"A","x":12,"y":36},{"etiqueta":"2","x":65,"y":87},{"etiqueta":"B","x":66,"y":37},{"etiqueta":"3","x":88,"y":59},{"etiqueta":"C","x":92,"y":33},{"etiqueta":"4","x":35,"y":85},{"etiqueta":"D","x":12,"y":62},{"etiqueta":"5","x":86,"y":11},{"etiqueta":"E","x":33,"y":39},{"etiqueta":"6","x":62,"y":60},{"etiqueta":"F","x":14,"y":9},{"etiqueta":"7","x":34,"y":8},{"etiqueta":"G","x":63,"y":8},{"etiqueta":"8","x":87,"y":91},{"etiqueta":"H","x":38,"y":64}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 10',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":65,"y":34},{"etiqueta":"A","x":89,"y":9},{"etiqueta":"2","x":34,"y":65},{"etiqueta":"B","x":10,"y":64},{"etiqueta":"3","x":84,"y":66},{"etiqueta":"C","x":60,"y":61},{"etiqueta":"4","x":65,"y":85},{"etiqueta":"D","x":38,"y":92},{"etiqueta":"5","x":8,"y":11},{"etiqueta":"E","x":40,"y":40},{"etiqueta":"6","x":86,"y":90},{"etiqueta":"F","x":60,"y":15},{"etiqueta":"7","x":92,"y":37},{"etiqueta":"G","x":8,"y":84},{"etiqueta":"8","x":13,"y":39},{"etiqueta":"H","x":37,"y":8}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 11',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":84,"y":14},{"etiqueta":"A","x":12,"y":8},{"etiqueta":"2","x":8,"y":89},{"etiqueta":"B","x":8,"y":60},{"etiqueta":"3","x":11,"y":38},{"etiqueta":"C","x":34,"y":88},{"etiqueta":"4","x":63,"y":67},{"etiqueta":"D","x":86,"y":85},{"etiqueta":"5","x":65,"y":92},{"etiqueta":"E","x":88,"y":60},{"etiqueta":"6","x":89,"y":33},{"etiqueta":"F","x":62,"y":11},{"etiqueta":"7","x":59,"y":34},{"etiqueta":"G","x":33,"y":66},{"etiqueta":"8","x":41,"y":38},{"etiqueta":"H","x":40,"y":13}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 12',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":63,"y":65},{"etiqueta":"A","x":60,"y":11},{"etiqueta":"2","x":36,"y":15},{"etiqueta":"B","x":39,"y":64},{"etiqueta":"3","x":85,"y":37},{"etiqueta":"C","x":16,"y":35},{"etiqueta":"4","x":13,"y":64},{"etiqueta":"D","x":11,"y":86},{"etiqueta":"5","x":89,"y":10},{"etiqueta":"E","x":89,"y":87},{"etiqueta":"6","x":62,"y":91},{"etiqueta":"F","x":61,"y":38},{"etiqueta":"7","x":39,"y":87},{"etiqueta":"G","x":12,"y":16},{"etiqueta":"8","x":40,"y":37},{"etiqueta":"H","x":88,"y":66}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 13',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":8,"y":67},{"etiqueta":"A","x":87,"y":62},{"etiqueta":"2","x":14,"y":15},{"etiqueta":"B","x":9,"y":33},{"etiqueta":"3","x":86,"y":35},{"etiqueta":"C","x":36,"y":35},{"etiqueta":"4","x":63,"y":38},{"etiqueta":"D","x":34,"y":10},{"etiqueta":"5","x":60,"y":16},{"etiqueta":"E","x":37,"y":91},{"etiqueta":"6","x":89,"y":14},{"etiqueta":"F","x":13,"y":92},{"etiqueta":"7","x":41,"y":64},{"etiqueta":"G","x":59,"y":59},{"etiqueta":"8","x":60,"y":86},{"etiqueta":"H","x":90,"y":88}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  ),
  (
    '5e510108-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000108',
    'Dieciséis puntos, números y letras, 14',
    3,
    '{"modo":"puntos","indicacion":"Toca los puntos en orden, alternando números y letras: 1, A, 2, B…","puntos":[{"etiqueta":"1","x":62,"y":61},{"etiqueta":"A","x":8,"y":61},{"etiqueta":"2","x":37,"y":12},{"etiqueta":"B","x":87,"y":36},{"etiqueta":"3","x":33,"y":61},{"etiqueta":"C","x":66,"y":87},{"etiqueta":"4","x":63,"y":13},{"etiqueta":"D","x":84,"y":62},{"etiqueta":"5","x":12,"y":41},{"etiqueta":"E","x":14,"y":9},{"etiqueta":"6","x":66,"y":37},{"etiqueta":"F","x":39,"y":35},{"etiqueta":"7","x":92,"y":88},{"etiqueta":"G","x":35,"y":91},{"etiqueta":"8","x":11,"y":85},{"etiqueta":"H","x":88,"y":11}],"puntosMaximos":10}'::jsonb,
    FALSE,
    'pendiente'
  )
ON CONFLICT ("id_sesion") DO NOTHING;

-- COG-09 · Lo que vi: 40 sesiones, PUBLICADAS (revision: no_requiere).
INSERT INTO "sesion_de_actividad" (
  "id_sesion", "id_actividad", "titulo", "nivel", "parametros", "publicado", "revision"
)
VALUES
  (
    '5e510109-0000-4000-8000-000000000001',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 1',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":2,"columna":2,"pictograma":"rayo","nombre":"rayo"},{"fila":2,"columna":1,"pictograma":"sol","nombre":"sol"},{"fila":1,"columna":2,"pictograma":"silla","nombre":"silla"},{"fila":3,"columna":3,"pictograma":"circulo","nombre":"círculo"},{"fila":1,"columna":1,"pictograma":"ola","nombre":"ola"},{"fila":3,"columna":1,"pictograma":"hoja","nombre":"hoja"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"ola","nombre":"ola"},{"pictograma":"trebol","nombre":"trébol"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"pera","nombre":"pera"},{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"bicicleta","nombre":"bicicleta"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"circulo","nombre":"círculo"},{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"ventana","nombre":"ventana"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"limon","nombre":"limón"},{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"sol","nombre":"sol"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"viento","nombre":"viento"},{"pictograma":"pez","nombre":"pez"},{"pictograma":"silla","nombre":"silla"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000002',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 2',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":1,"pictograma":"rayo","nombre":"rayo"},{"fila":2,"columna":3,"pictograma":"hoja","nombre":"hoja"},{"fila":3,"columna":2,"pictograma":"uva","nombre":"uvas"},{"fila":1,"columna":3,"pictograma":"montana","nombre":"montaña"},{"fila":2,"columna":1,"pictograma":"bicicleta","nombre":"bicicleta"},{"fila":3,"columna":1,"pictograma":"lluvia","nombre":"lluvia"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"pina","nombre":"piña"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"bus","nombre":"bus"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"carro","nombre":"carro"},{"pictograma":"cama","nombre":"cama"},{"pictograma":"bicicleta","nombre":"bicicleta"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"moto","nombre":"moto"},{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"flor","nombre":"flor"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"reloj","nombre":"reloj"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000003',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 3',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":3,"pictograma":"triangulo","nombre":"triángulo"},{"fila":1,"columna":1,"pictograma":"conejo","nombre":"conejo"},{"fila":3,"columna":3,"pictograma":"fresa","nombre":"fresa"},{"fila":2,"columna":1,"pictograma":"manzana","nombre":"manzana"},{"fila":3,"columna":2,"pictograma":"sombrilla","nombre":"sombrilla"},{"fila":2,"columna":3,"pictograma":"avion","nombre":"avión"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"cama","nombre":"cama"},{"pictograma":"fresa","nombre":"fresa"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"pez","nombre":"pez"},{"pictograma":"ave","nombre":"ave"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"bicicleta","nombre":"bicicleta"},{"pictograma":"avion","nombre":"avión"},{"pictograma":"flor","nombre":"flor"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"pera","nombre":"pera"},{"pictograma":"limon","nombre":"limón"},{"pictograma":"triangulo","nombre":"triángulo"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"gota","nombre":"gota"},{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"rayo","nombre":"rayo"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000004',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 4',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":2,"pictograma":"globo","nombre":"globo aerostático"},{"fila":1,"columna":3,"pictograma":"cohete","nombre":"cohete"},{"fila":1,"columna":1,"pictograma":"avion","nombre":"avión"},{"fila":3,"columna":2,"pictograma":"montana","nombre":"montaña"},{"fila":2,"columna":3,"pictograma":"lluvia","nombre":"lluvia"},{"fila":2,"columna":2,"pictograma":"tren","nombre":"tren"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"tren","nombre":"tren"},{"pictograma":"viento","nombre":"viento"},{"pictograma":"ave","nombre":"ave"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"bicicleta","nombre":"bicicleta"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"pera","nombre":"pera"},{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"libro","nombre":"libro"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"cuadrado","nombre":"cuadrado"},{"pictograma":"perro","nombre":"perro"},{"pictograma":"montana","nombre":"montaña"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"cama","nombre":"cama"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000005',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 5',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":2,"pictograma":"llave","nombre":"llave"},{"fila":3,"columna":2,"pictograma":"montana","nombre":"montaña"},{"fila":2,"columna":3,"pictograma":"pera","nombre":"pera"},{"fila":2,"columna":1,"pictograma":"avion","nombre":"avión"},{"fila":2,"columna":2,"pictograma":"abeja","nombre":"abeja"},{"fila":1,"columna":1,"pictograma":"arcoiris","nombre":"arcoíris"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"ola","nombre":"ola"},{"pictograma":"avion","nombre":"avión"},{"pictograma":"globo","nombre":"globo aerostático"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"llave","nombre":"llave"},{"pictograma":"copo","nombre":"copo de nieve"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"taza","nombre":"taza"},{"pictograma":"mariposa","nombre":"mariposa"},{"pictograma":"pera","nombre":"pera"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"cereza","nombre":"cerezas"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"pez","nombre":"pez"},{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"libro","nombre":"libro"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000006',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 6',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":2,"columna":2,"pictograma":"puerta","nombre":"puerta"},{"fila":2,"columna":1,"pictograma":"montana","nombre":"montaña"},{"fila":2,"columna":3,"pictograma":"barco","nombre":"barco"},{"fila":3,"columna":2,"pictograma":"ventana","nombre":"ventana"},{"fila":1,"columna":1,"pictograma":"taza","nombre":"taza"},{"fila":1,"columna":2,"pictograma":"pez","nombre":"pez"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"barco","nombre":"barco"},{"pictograma":"fresa","nombre":"fresa"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"fresa","nombre":"fresa"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"sombrilla","nombre":"sombrilla"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"cactus","nombre":"cactus"},{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"pez","nombre":"pez"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"flor","nombre":"flor"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000007',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 7',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":2,"pictograma":"arbol","nombre":"árbol"},{"fila":2,"columna":2,"pictograma":"taza","nombre":"taza"},{"fila":2,"columna":1,"pictograma":"carro","nombre":"carro"},{"fila":3,"columna":2,"pictograma":"lampara","nombre":"lámpara"},{"fila":1,"columna":3,"pictograma":"fresa","nombre":"fresa"},{"fila":1,"columna":1,"pictograma":"cactus","nombre":"cactus"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"lampara","nombre":"lámpara"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"cohete","nombre":"cohete"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"nube","nombre":"nube"},{"pictograma":"moto","nombre":"moto"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"nube","nombre":"nube"},{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"arbol","nombre":"árbol"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"carro","nombre":"carro"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"fresa","nombre":"fresa"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000008',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 8',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":3,"pictograma":"bus","nombre":"bus"},{"fila":2,"columna":2,"pictograma":"bicicleta","nombre":"bicicleta"},{"fila":3,"columna":1,"pictograma":"triangulo","nombre":"triángulo"},{"fila":1,"columna":2,"pictograma":"gota","nombre":"gota"},{"fila":3,"columna":2,"pictograma":"mariposa","nombre":"mariposa"},{"fila":2,"columna":3,"pictograma":"sol","nombre":"sol"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"ola","nombre":"ola"},{"pictograma":"copo","nombre":"copo de nieve"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"perro","nombre":"perro"},{"pictograma":"taza","nombre":"taza"},{"pictograma":"mariposa","nombre":"mariposa"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"ave","nombre":"ave"},{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"gota","nombre":"gota"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"gato","nombre":"gato"},{"pictograma":"perro","nombre":"perro"},{"pictograma":"bus","nombre":"bus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"cuadrado","nombre":"cuadrado"},{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"bicicleta","nombre":"bicicleta"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000009',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 9',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":3,"pictograma":"pez","nombre":"pez"},{"fila":2,"columna":2,"pictograma":"libro","nombre":"libro"},{"fila":2,"columna":3,"pictograma":"pina","nombre":"piña"},{"fila":3,"columna":3,"pictograma":"trebol","nombre":"trébol"},{"fila":2,"columna":1,"pictograma":"caracol","nombre":"caracol"},{"fila":3,"columna":1,"pictograma":"fresa","nombre":"fresa"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"pina","nombre":"piña"},{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"gota","nombre":"gota"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"montana","nombre":"montaña"},{"pictograma":"carro","nombre":"carro"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"perro","nombre":"perro"},{"pictograma":"pez","nombre":"pez"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"hoja","nombre":"hoja"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"fresa","nombre":"fresa"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000010',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 10',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":3,"columna":2,"pictograma":"pera","nombre":"pera"},{"fila":1,"columna":1,"pictograma":"avion","nombre":"avión"},{"fila":2,"columna":3,"pictograma":"bicicleta","nombre":"bicicleta"},{"fila":3,"columna":3,"pictograma":"pina","nombre":"piña"},{"fila":1,"columna":3,"pictograma":"llave","nombre":"llave"},{"fila":1,"columna":2,"pictograma":"uva","nombre":"uvas"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"avion","nombre":"avión"},{"pictograma":"moto","nombre":"moto"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"pina","nombre":"piña"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"gota","nombre":"gota"},{"pictograma":"llave","nombre":"llave"},{"pictograma":"palmera","nombre":"palmera"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"nube","nombre":"nube"},{"pictograma":"bicicleta","nombre":"bicicleta"},{"pictograma":"manzana","nombre":"manzana"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"tren","nombre":"tren"},{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"uva","nombre":"uvas"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000011',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 11',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":1,"pictograma":"gota","nombre":"gota"},{"fila":1,"columna":2,"pictograma":"hoja","nombre":"hoja"},{"fila":3,"columna":2,"pictograma":"cama","nombre":"cama"},{"fila":3,"columna":3,"pictograma":"lluvia","nombre":"lluvia"},{"fila":1,"columna":3,"pictograma":"uva","nombre":"uvas"},{"fila":2,"columna":3,"pictograma":"reloj","nombre":"reloj"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"mariposa","nombre":"mariposa"},{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"naranja","nombre":"naranja"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"uva","nombre":"uvas"},{"pictograma":"fresa","nombre":"fresa"},{"pictograma":"sombrilla","nombre":"sombrilla"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"tortuga","nombre":"tortuga"},{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"caracol","nombre":"caracol"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"nube","nombre":"nube"},{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"cama","nombre":"cama"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"arbol","nombre":"árbol"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"moto","nombre":"moto"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000012',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 12',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":1,"columna":1,"pictograma":"limon","nombre":"limón"},{"fila":3,"columna":2,"pictograma":"abeja","nombre":"abeja"},{"fila":2,"columna":2,"pictograma":"carro","nombre":"carro"},{"fila":2,"columna":3,"pictograma":"uva","nombre":"uvas"},{"fila":2,"columna":1,"pictograma":"naranja","nombre":"naranja"},{"fila":3,"columna":3,"pictograma":"luna","nombre":"luna"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"perro","nombre":"perro"},{"pictograma":"carro","nombre":"carro"},{"pictograma":"hoja","nombre":"hoja"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"nube","nombre":"nube"},{"pictograma":"limon","nombre":"limón"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"luna","nombre":"luna"},{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"reloj","nombre":"reloj"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"pina","nombre":"piña"},{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"hoja","nombre":"hoja"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"naranja","nombre":"naranja"},{"pictograma":"cohete","nombre":"cohete"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000013',
    '0acd0000-0000-4000-8000-000000000109',
    'Seis figuras, 13',
    1,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":3,"celdas":[{"fila":3,"columna":2,"pictograma":"ave","nombre":"ave"},{"fila":1,"columna":2,"pictograma":"naranja","nombre":"naranja"},{"fila":2,"columna":2,"pictograma":"ola","nombre":"ola"},{"fila":1,"columna":1,"pictograma":"gato","nombre":"gato"},{"fila":3,"columna":1,"pictograma":"banano","nombre":"banano"},{"fila":3,"columna":3,"pictograma":"puerta","nombre":"puerta"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"circulo","nombre":"círculo"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"trebol","nombre":"trébol"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"cama","nombre":"cama"},{"pictograma":"carro","nombre":"carro"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"naranja","nombre":"naranja"},{"pictograma":"reloj","nombre":"reloj"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"banano","nombre":"banano"},{"pictograma":"bus","nombre":"bus"},{"pictograma":"silla","nombre":"silla"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"ola","nombre":"ola"},{"pictograma":"arbol","nombre":"árbol"},{"pictograma":"bicicleta","nombre":"bicicleta"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000014',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 1',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":2,"columna":1,"pictograma":"barco","nombre":"barco"},{"fila":1,"columna":1,"pictograma":"circulo","nombre":"círculo"},{"fila":3,"columna":1,"pictograma":"flor","nombre":"flor"},{"fila":2,"columna":3,"pictograma":"limon","nombre":"limón"},{"fila":1,"columna":3,"pictograma":"gato","nombre":"gato"},{"fila":2,"columna":2,"pictograma":"carro","nombre":"carro"},{"fila":3,"columna":3,"pictograma":"lampara","nombre":"lámpara"},{"fila":1,"columna":2,"pictograma":"abeja","nombre":"abeja"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"cuadrado","nombre":"cuadrado"},{"pictograma":"viento","nombre":"viento"},{"pictograma":"flor","nombre":"flor"},{"pictograma":"taza","nombre":"taza"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"ola","nombre":"ola"},{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"circulo","nombre":"círculo"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"bus","nombre":"bus"},{"pictograma":"palmera","nombre":"palmera"},{"pictograma":"barco","nombre":"barco"},{"pictograma":"arbol","nombre":"árbol"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"viento","nombre":"viento"},{"pictograma":"nube","nombre":"nube"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"lampara","nombre":"lámpara"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"limon","nombre":"limón"},{"pictograma":"silla","nombre":"silla"},{"pictograma":"tortuga","nombre":"tortuga"},{"pictograma":"arcoiris","nombre":"arcoíris"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000015',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 2',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":1,"columna":3,"pictograma":"cama","nombre":"cama"},{"fila":2,"columna":4,"pictograma":"barco","nombre":"barco"},{"fila":2,"columna":1,"pictograma":"carro","nombre":"carro"},{"fila":3,"columna":1,"pictograma":"rombo","nombre":"rombo"},{"fila":1,"columna":2,"pictograma":"tortuga","nombre":"tortuga"},{"fila":1,"columna":4,"pictograma":"gota","nombre":"gota"},{"fila":2,"columna":2,"pictograma":"bicicleta","nombre":"bicicleta"},{"fila":1,"columna":1,"pictograma":"libro","nombre":"libro"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"cuadrado","nombre":"cuadrado"},{"pictograma":"libro","nombre":"libro"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"perro","nombre":"perro"},{"pictograma":"carro","nombre":"carro"},{"pictograma":"tren","nombre":"tren"},{"pictograma":"trebol","nombre":"trébol"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"luna","nombre":"luna"},{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"cama","nombre":"cama"},{"pictograma":"arcoiris","nombre":"arcoíris"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"avion","nombre":"avión"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"barco","nombre":"barco"},{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"circulo","nombre":"círculo"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000016',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 3',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":2,"columna":3,"pictograma":"fresa","nombre":"fresa"},{"fila":1,"columna":1,"pictograma":"limon","nombre":"limón"},{"fila":3,"columna":2,"pictograma":"rayo","nombre":"rayo"},{"fila":1,"columna":2,"pictograma":"pera","nombre":"pera"},{"fila":3,"columna":3,"pictograma":"perro","nombre":"perro"},{"fila":2,"columna":4,"pictograma":"silla","nombre":"silla"},{"fila":2,"columna":2,"pictograma":"sombrilla","nombre":"sombrilla"},{"fila":1,"columna":4,"pictograma":"viento","nombre":"viento"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"limon","nombre":"limón"},{"pictograma":"sol","nombre":"sol"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"taza","nombre":"taza"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"taza","nombre":"taza"},{"pictograma":"viento","nombre":"viento"},{"pictograma":"cuadrado","nombre":"cuadrado"},{"pictograma":"bicicleta","nombre":"bicicleta"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"fresa","nombre":"fresa"},{"pictograma":"ola","nombre":"ola"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"carro","nombre":"carro"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"ave","nombre":"ave"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"montana","nombre":"montaña"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"perro","nombre":"perro"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000017',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 4',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":3,"columna":1,"pictograma":"mariposa","nombre":"mariposa"},{"fila":3,"columna":3,"pictograma":"cereza","nombre":"cerezas"},{"fila":2,"columna":4,"pictograma":"rombo","nombre":"rombo"},{"fila":1,"columna":4,"pictograma":"limon","nombre":"limón"},{"fila":1,"columna":3,"pictograma":"nube","nombre":"nube"},{"fila":2,"columna":3,"pictograma":"ave","nombre":"ave"},{"fila":3,"columna":4,"pictograma":"barco","nombre":"barco"},{"fila":2,"columna":1,"pictograma":"perro","nombre":"perro"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"flor","nombre":"flor"},{"pictograma":"mariposa","nombre":"mariposa"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"ventana","nombre":"ventana"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"moto","nombre":"moto"},{"pictograma":"barco","nombre":"barco"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"cohete","nombre":"cohete"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"flor","nombre":"flor"},{"pictograma":"nube","nombre":"nube"},{"pictograma":"lampara","nombre":"lámpara"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"sol","nombre":"sol"},{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"viento","nombre":"viento"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"perro","nombre":"perro"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"arcoiris","nombre":"arcoíris"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000018',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 5',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":2,"columna":3,"pictograma":"estrella","nombre":"estrella"},{"fila":3,"columna":1,"pictograma":"rombo","nombre":"rombo"},{"fila":3,"columna":4,"pictograma":"taza","nombre":"taza"},{"fila":1,"columna":4,"pictograma":"mariposa","nombre":"mariposa"},{"fila":1,"columna":3,"pictograma":"viento","nombre":"viento"},{"fila":1,"columna":2,"pictograma":"pera","nombre":"pera"},{"fila":2,"columna":4,"pictograma":"puerta","nombre":"puerta"},{"fila":2,"columna":2,"pictograma":"caracol","nombre":"caracol"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"perro","nombre":"perro"},{"pictograma":"pera","nombre":"pera"},{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"limon","nombre":"limón"},{"pictograma":"llave","nombre":"llave"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"ave","nombre":"ave"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"taza","nombre":"taza"},{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"trebol","nombre":"trébol"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"silla","nombre":"silla"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"sol","nombre":"sol"},{"pictograma":"barco","nombre":"barco"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"viento","nombre":"viento"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000019',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 6',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":2,"columna":4,"pictograma":"sombrilla","nombre":"sombrilla"},{"fila":3,"columna":4,"pictograma":"cama","nombre":"cama"},{"fila":2,"columna":2,"pictograma":"luna","nombre":"luna"},{"fila":2,"columna":3,"pictograma":"cereza","nombre":"cerezas"},{"fila":3,"columna":2,"pictograma":"hongo","nombre":"hongo"},{"fila":3,"columna":3,"pictograma":"ola","nombre":"ola"},{"fila":1,"columna":3,"pictograma":"moto","nombre":"moto"},{"fila":1,"columna":4,"pictograma":"reloj","nombre":"reloj"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"barco","nombre":"barco"},{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"pina","nombre":"piña"},{"pictograma":"cereza","nombre":"cerezas"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"uva","nombre":"uvas"},{"pictograma":"barco","nombre":"barco"},{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"luna","nombre":"luna"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"copo","nombre":"copo de nieve"},{"pictograma":"pina","nombre":"piña"},{"pictograma":"ola","nombre":"ola"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"libro","nombre":"libro"},{"pictograma":"cama","nombre":"cama"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000020',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 7',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":1,"columna":3,"pictograma":"perro","nombre":"perro"},{"fila":3,"columna":1,"pictograma":"conejo","nombre":"conejo"},{"fila":2,"columna":2,"pictograma":"flor","nombre":"flor"},{"fila":3,"columna":4,"pictograma":"fresa","nombre":"fresa"},{"fila":1,"columna":4,"pictograma":"pina","nombre":"piña"},{"fila":3,"columna":2,"pictograma":"mariposa","nombre":"mariposa"},{"fila":1,"columna":2,"pictograma":"ola","nombre":"ola"},{"fila":2,"columna":3,"pictograma":"arcoiris","nombre":"arcoíris"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"viento","nombre":"viento"},{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"taza","nombre":"taza"},{"pictograma":"arcoiris","nombre":"arcoíris"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"perro","nombre":"perro"},{"pictograma":"silla","nombre":"silla"},{"pictograma":"cereza","nombre":"cerezas"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"montana","nombre":"montaña"},{"pictograma":"tortuga","nombre":"tortuga"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"cuadrado","nombre":"cuadrado"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"mariposa","nombre":"mariposa"},{"pictograma":"cama","nombre":"cama"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"limon","nombre":"limón"},{"pictograma":"fresa","nombre":"fresa"},{"pictograma":"naranja","nombre":"naranja"},{"pictograma":"globo","nombre":"globo aerostático"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000021',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 8',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":3,"columna":3,"pictograma":"cereza","nombre":"cerezas"},{"fila":1,"columna":2,"pictograma":"estrella","nombre":"estrella"},{"fila":2,"columna":1,"pictograma":"bus","nombre":"bus"},{"fila":3,"columna":4,"pictograma":"tren","nombre":"tren"},{"fila":1,"columna":3,"pictograma":"conejo","nombre":"conejo"},{"fila":1,"columna":1,"pictograma":"cohete","nombre":"cohete"},{"fila":1,"columna":4,"pictograma":"banano","nombre":"banano"},{"fila":2,"columna":3,"pictograma":"ave","nombre":"ave"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"bicicleta","nombre":"bicicleta"},{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"lampara","nombre":"lámpara"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"sol","nombre":"sol"},{"pictograma":"banano","nombre":"banano"},{"pictograma":"perro","nombre":"perro"},{"pictograma":"pera","nombre":"pera"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"caracol","nombre":"caracol"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"nube","nombre":"nube"},{"pictograma":"cama","nombre":"cama"},{"pictograma":"estrella","nombre":"estrella"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"tortuga","nombre":"tortuga"},{"pictograma":"bus","nombre":"bus"},{"pictograma":"cama","nombre":"cama"},{"pictograma":"llave","nombre":"llave"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000022',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 9',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":3,"columna":3,"pictograma":"cohete","nombre":"cohete"},{"fila":2,"columna":3,"pictograma":"rombo","nombre":"rombo"},{"fila":3,"columna":1,"pictograma":"tren","nombre":"tren"},{"fila":1,"columna":4,"pictograma":"rayo","nombre":"rayo"},{"fila":1,"columna":3,"pictograma":"hoja","nombre":"hoja"},{"fila":3,"columna":2,"pictograma":"sol","nombre":"sol"},{"fila":2,"columna":2,"pictograma":"lluvia","nombre":"lluvia"},{"fila":2,"columna":4,"pictograma":"perro","nombre":"perro"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"flor","nombre":"flor"},{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"avion","nombre":"avión"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"uva","nombre":"uvas"},{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"pera","nombre":"pera"},{"pictograma":"trebol","nombre":"trébol"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"pina","nombre":"piña"},{"pictograma":"libro","nombre":"libro"},{"pictograma":"tren","nombre":"tren"},{"pictograma":"estrella","nombre":"estrella"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"circulo","nombre":"círculo"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"cactus","nombre":"cactus"},{"pictograma":"taza","nombre":"taza"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000023',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 10',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":3,"columna":2,"pictograma":"perro","nombre":"perro"},{"fila":3,"columna":1,"pictograma":"viento","nombre":"viento"},{"fila":1,"columna":2,"pictograma":"palmera","nombre":"palmera"},{"fila":2,"columna":3,"pictograma":"ave","nombre":"ave"},{"fila":2,"columna":4,"pictograma":"conejo","nombre":"conejo"},{"fila":3,"columna":3,"pictograma":"arbol","nombre":"árbol"},{"fila":1,"columna":1,"pictograma":"abeja","nombre":"abeja"},{"fila":2,"columna":1,"pictograma":"pina","nombre":"piña"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"taza","nombre":"taza"},{"pictograma":"libro","nombre":"libro"},{"pictograma":"ola","nombre":"ola"},{"pictograma":"viento","nombre":"viento"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"palmera","nombre":"palmera"},{"pictograma":"tren","nombre":"tren"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"mariposa","nombre":"mariposa"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"moto","nombre":"moto"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"perro","nombre":"perro"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"flor","nombre":"flor"},{"pictograma":"taza","nombre":"taza"},{"pictograma":"arbol","nombre":"árbol"},{"pictograma":"lampara","nombre":"lámpara"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"carro","nombre":"carro"},{"pictograma":"sol","nombre":"sol"},{"pictograma":"ave","nombre":"ave"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000024',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 11',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":2,"columna":3,"pictograma":"barco","nombre":"barco"},{"fila":3,"columna":4,"pictograma":"luna","nombre":"luna"},{"fila":3,"columna":3,"pictograma":"cama","nombre":"cama"},{"fila":1,"columna":2,"pictograma":"limon","nombre":"limón"},{"fila":3,"columna":2,"pictograma":"bus","nombre":"bus"},{"fila":2,"columna":1,"pictograma":"ola","nombre":"ola"},{"fila":3,"columna":1,"pictograma":"montana","nombre":"montaña"},{"fila":1,"columna":4,"pictograma":"ave","nombre":"ave"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"ola","nombre":"ola"},{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"rayo","nombre":"rayo"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"moto","nombre":"moto"},{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"limon","nombre":"limón"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"pez","nombre":"pez"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"barco","nombre":"barco"},{"pictograma":"tortuga","nombre":"tortuga"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"fresa","nombre":"fresa"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"bus","nombre":"bus"},{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"carro","nombre":"carro"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000025',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 12',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":2,"columna":3,"pictograma":"silla","nombre":"silla"},{"fila":3,"columna":4,"pictograma":"mariposa","nombre":"mariposa"},{"fila":3,"columna":1,"pictograma":"puerta","nombre":"puerta"},{"fila":1,"columna":4,"pictograma":"pina","nombre":"piña"},{"fila":3,"columna":3,"pictograma":"circulo","nombre":"círculo"},{"fila":3,"columna":2,"pictograma":"palmera","nombre":"palmera"},{"fila":1,"columna":2,"pictograma":"abeja","nombre":"abeja"},{"fila":1,"columna":3,"pictograma":"manzana","nombre":"manzana"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"bus","nombre":"bus"},{"pictograma":"circulo","nombre":"círculo"},{"pictograma":"fresa","nombre":"fresa"},{"pictograma":"ola","nombre":"ola"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"barco","nombre":"barco"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"carro","nombre":"carro"},{"pictograma":"banano","nombre":"banano"},{"pictograma":"gota","nombre":"gota"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"avion","nombre":"avión"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"silla","nombre":"silla"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"viento","nombre":"viento"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"cohete","nombre":"cohete"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000026',
    '0acd0000-0000-4000-8000-000000000109',
    'Ocho figuras, 13',
    2,
    '{"modo":"escena","segundosVista":10,"filas":3,"columnas":4,"celdas":[{"fila":3,"columna":1,"pictograma":"globo","nombre":"globo aerostático"},{"fila":2,"columna":1,"pictograma":"cereza","nombre":"cerezas"},{"fila":2,"columna":3,"pictograma":"uva","nombre":"uvas"},{"fila":3,"columna":3,"pictograma":"pina","nombre":"piña"},{"fila":1,"columna":4,"pictograma":"ola","nombre":"ola"},{"fila":3,"columna":4,"pictograma":"arbol","nombre":"árbol"},{"fila":1,"columna":1,"pictograma":"gota","nombre":"gota"},{"fila":3,"columna":2,"pictograma":"luna","nombre":"luna"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"cama","nombre":"cama"},{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"circulo","nombre":"círculo"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"arbol","nombre":"árbol"},{"pictograma":"conejo","nombre":"conejo"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"bicicleta","nombre":"bicicleta"},{"pictograma":"estrella","nombre":"estrella"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"mariposa","nombre":"mariposa"},{"pictograma":"bicicleta","nombre":"bicicleta"},{"pictograma":"uva","nombre":"uvas"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"sol","nombre":"sol"},{"pictograma":"ola","nombre":"ola"},{"pictograma":"copo","nombre":"copo de nieve"},{"pictograma":"arcoiris","nombre":"arcoíris"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000027',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 1',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":2,"columna":1,"pictograma":"hongo","nombre":"hongo"},{"fila":3,"columna":1,"pictograma":"nube","nombre":"nube"},{"fila":1,"columna":1,"pictograma":"sombrilla","nombre":"sombrilla"},{"fila":4,"columna":4,"pictograma":"barco","nombre":"barco"},{"fila":2,"columna":2,"pictograma":"arbol","nombre":"árbol"},{"fila":2,"columna":3,"pictograma":"puerta","nombre":"puerta"},{"fila":4,"columna":3,"pictograma":"fresa","nombre":"fresa"},{"fila":3,"columna":3,"pictograma":"pera","nombre":"pera"},{"fila":1,"columna":2,"pictograma":"ave","nombre":"ave"},{"fila":4,"columna":1,"pictograma":"conejo","nombre":"conejo"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"pera","nombre":"pera"},{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"limon","nombre":"limón"},{"pictograma":"ventana","nombre":"ventana"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"pera","nombre":"pera"},{"pictograma":"moto","nombre":"moto"},{"pictograma":"caracol","nombre":"caracol"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"fresa","nombre":"fresa"},{"pictograma":"avion","nombre":"avión"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"globo","nombre":"globo aerostático"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"montana","nombre":"montaña"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"viento","nombre":"viento"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 1)","fila":4,"columna":1,"opciones":[{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"fresa","nombre":"fresa"},{"pictograma":"viento","nombre":"viento"},{"pictograma":"conejo","nombre":"conejo"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000028',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 2',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":1,"columna":1,"pictograma":"arcoiris","nombre":"arcoíris"},{"fila":3,"columna":1,"pictograma":"cama","nombre":"cama"},{"fila":4,"columna":4,"pictograma":"abeja","nombre":"abeja"},{"fila":4,"columna":2,"pictograma":"rayo","nombre":"rayo"},{"fila":2,"columna":4,"pictograma":"taza","nombre":"taza"},{"fila":1,"columna":3,"pictograma":"luna","nombre":"luna"},{"fila":3,"columna":2,"pictograma":"pera","nombre":"pera"},{"fila":2,"columna":2,"pictograma":"sombrilla","nombre":"sombrilla"},{"fila":2,"columna":1,"pictograma":"banano","nombre":"banano"},{"fila":4,"columna":3,"pictograma":"cereza","nombre":"cerezas"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"arbol","nombre":"árbol"},{"pictograma":"flor","nombre":"flor"},{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"moto","nombre":"moto"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 3)","fila":4,"columna":3,"opciones":[{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"pera","nombre":"pera"},{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"cereza","nombre":"cerezas"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"taza","nombre":"taza"},{"pictograma":"banano","nombre":"banano"},{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"rayo","nombre":"rayo"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"tren","nombre":"tren"},{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"libro","nombre":"libro"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"pera","nombre":"pera"},{"pictograma":"sol","nombre":"sol"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"silla","nombre":"silla"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000029',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 3',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":2,"columna":4,"pictograma":"triangulo","nombre":"triángulo"},{"fila":4,"columna":3,"pictograma":"ola","nombre":"ola"},{"fila":2,"columna":1,"pictograma":"lluvia","nombre":"lluvia"},{"fila":1,"columna":2,"pictograma":"cama","nombre":"cama"},{"fila":1,"columna":4,"pictograma":"gota","nombre":"gota"},{"fila":3,"columna":4,"pictograma":"fresa","nombre":"fresa"},{"fila":1,"columna":3,"pictograma":"limon","nombre":"limón"},{"fila":1,"columna":1,"pictograma":"barco","nombre":"barco"},{"fila":4,"columna":2,"pictograma":"lampara","nombre":"lámpara"},{"fila":3,"columna":1,"pictograma":"mariposa","nombre":"mariposa"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"libro","nombre":"libro"},{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"cama","nombre":"cama"},{"pictograma":"sombrilla","nombre":"sombrilla"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"barco","nombre":"barco"},{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"hoja","nombre":"hoja"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"fresa","nombre":"fresa"},{"pictograma":"libro","nombre":"libro"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"sol","nombre":"sol"},{"pictograma":"manzana","nombre":"manzana"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 2)","fila":4,"columna":2,"opciones":[{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"libro","nombre":"libro"},{"pictograma":"lampara","nombre":"lámpara"},{"pictograma":"ola","nombre":"ola"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000030',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 4',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":3,"columna":1,"pictograma":"ventana","nombre":"ventana"},{"fila":4,"columna":1,"pictograma":"cactus","nombre":"cactus"},{"fila":2,"columna":3,"pictograma":"triangulo","nombre":"triángulo"},{"fila":2,"columna":1,"pictograma":"bicicleta","nombre":"bicicleta"},{"fila":3,"columna":4,"pictograma":"montana","nombre":"montaña"},{"fila":1,"columna":4,"pictograma":"uva","nombre":"uvas"},{"fila":3,"columna":2,"pictograma":"ave","nombre":"ave"},{"fila":1,"columna":3,"pictograma":"cereza","nombre":"cerezas"},{"fila":2,"columna":4,"pictograma":"hongo","nombre":"hongo"},{"fila":4,"columna":3,"pictograma":"avion","nombre":"avión"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"avion","nombre":"avión"},{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"arcoiris","nombre":"arcoíris"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"cama","nombre":"cama"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"manzana","nombre":"manzana"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"gota","nombre":"gota"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"circulo","nombre":"círculo"},{"pictograma":"llave","nombre":"llave"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 1)","fila":4,"columna":1,"opciones":[{"pictograma":"taza","nombre":"taza"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"cactus","nombre":"cactus"},{"pictograma":"hongo","nombre":"hongo"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000031',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 5',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":3,"columna":4,"pictograma":"reloj","nombre":"reloj"},{"fila":3,"columna":1,"pictograma":"bus","nombre":"bus"},{"fila":2,"columna":3,"pictograma":"avion","nombre":"avión"},{"fila":1,"columna":4,"pictograma":"conejo","nombre":"conejo"},{"fila":3,"columna":2,"pictograma":"copo","nombre":"copo de nieve"},{"fila":2,"columna":1,"pictograma":"rayo","nombre":"rayo"},{"fila":1,"columna":1,"pictograma":"rombo","nombre":"rombo"},{"fila":4,"columna":2,"pictograma":"taza","nombre":"taza"},{"fila":4,"columna":1,"pictograma":"tortuga","nombre":"tortuga"},{"fila":4,"columna":3,"pictograma":"pera","nombre":"pera"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"carro","nombre":"carro"},{"pictograma":"rayo","nombre":"rayo"},{"pictograma":"sol","nombre":"sol"},{"pictograma":"cama","nombre":"cama"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 3)","fila":4,"columna":3,"opciones":[{"pictograma":"montana","nombre":"montaña"},{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"pera","nombre":"pera"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"mariposa","nombre":"mariposa"},{"pictograma":"ola","nombre":"ola"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"ave","nombre":"ave"},{"pictograma":"taza","nombre":"taza"},{"pictograma":"conejo","nombre":"conejo"},{"pictograma":"bus","nombre":"bus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 2)","fila":4,"columna":2,"opciones":[{"pictograma":"nube","nombre":"nube"},{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"taza","nombre":"taza"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":2}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000032',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 6',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":4,"columna":4,"pictograma":"puerta","nombre":"puerta"},{"fila":2,"columna":3,"pictograma":"luna","nombre":"luna"},{"fila":3,"columna":4,"pictograma":"montana","nombre":"montaña"},{"fila":2,"columna":4,"pictograma":"gota","nombre":"gota"},{"fila":1,"columna":1,"pictograma":"limon","nombre":"limón"},{"fila":3,"columna":1,"pictograma":"moto","nombre":"moto"},{"fila":3,"columna":3,"pictograma":"arcoiris","nombre":"arcoíris"},{"fila":4,"columna":2,"pictograma":"caracol","nombre":"caracol"},{"fila":1,"columna":3,"pictograma":"cama","nombre":"cama"},{"fila":1,"columna":4,"pictograma":"flor","nombre":"flor"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"lampara","nombre":"lámpara"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"pina","nombre":"piña"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"pera","nombre":"pera"},{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"limon","nombre":"limón"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 4)","fila":4,"columna":4,"opciones":[{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"copo","nombre":"copo de nieve"},{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"cuadrado","nombre":"cuadrado"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"hoja","nombre":"hoja"},{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"flor","nombre":"flor"},{"pictograma":"cereza","nombre":"cerezas"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"pina","nombre":"piña"},{"pictograma":"ola","nombre":"ola"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000033',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 7',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":1,"columna":2,"pictograma":"limon","nombre":"limón"},{"fila":1,"columna":1,"pictograma":"hoja","nombre":"hoja"},{"fila":2,"columna":4,"pictograma":"hongo","nombre":"hongo"},{"fila":1,"columna":3,"pictograma":"triangulo","nombre":"triángulo"},{"fila":3,"columna":1,"pictograma":"puerta","nombre":"puerta"},{"fila":3,"columna":3,"pictograma":"lluvia","nombre":"lluvia"},{"fila":3,"columna":2,"pictograma":"abeja","nombre":"abeja"},{"fila":4,"columna":3,"pictograma":"gota","nombre":"gota"},{"fila":1,"columna":4,"pictograma":"estrella","nombre":"estrella"},{"fila":4,"columna":4,"pictograma":"montana","nombre":"montaña"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"abeja","nombre":"abeja"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"ave","nombre":"ave"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"limon","nombre":"limón"},{"pictograma":"rombo","nombre":"rombo"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 3)","fila":4,"columna":3,"opciones":[{"pictograma":"barco","nombre":"barco"},{"pictograma":"tren","nombre":"tren"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"gota","nombre":"gota"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"viento","nombre":"viento"},{"pictograma":"tren","nombre":"tren"},{"pictograma":"arbol","nombre":"árbol"},{"pictograma":"hongo","nombre":"hongo"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"sol","nombre":"sol"},{"pictograma":"cuadrado","nombre":"cuadrado"},{"pictograma":"silla","nombre":"silla"},{"pictograma":"hoja","nombre":"hoja"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000034',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 8',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":4,"columna":3,"pictograma":"ola","nombre":"ola"},{"fila":3,"columna":4,"pictograma":"trebol","nombre":"trébol"},{"fila":1,"columna":2,"pictograma":"cactus","nombre":"cactus"},{"fila":2,"columna":4,"pictograma":"gota","nombre":"gota"},{"fila":3,"columna":3,"pictograma":"barco","nombre":"barco"},{"fila":2,"columna":1,"pictograma":"nube","nombre":"nube"},{"fila":4,"columna":1,"pictograma":"luna","nombre":"luna"},{"fila":1,"columna":4,"pictograma":"carro","nombre":"carro"},{"fila":2,"columna":2,"pictograma":"sol","nombre":"sol"},{"fila":3,"columna":1,"pictograma":"mariposa","nombre":"mariposa"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"carro","nombre":"carro"},{"pictograma":"cama","nombre":"cama"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 2)","fila":1,"columna":2,"opciones":[{"pictograma":"cactus","nombre":"cactus"},{"pictograma":"copo","nombre":"copo de nieve"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"fresa","nombre":"fresa"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 3)","fila":4,"columna":3,"opciones":[{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"lampara","nombre":"lámpara"},{"pictograma":"ola","nombre":"ola"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"perro","nombre":"perro"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"tortuga","nombre":"tortuga"},{"pictograma":"nube","nombre":"nube"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"tortuga","nombre":"tortuga"},{"pictograma":"mariposa","nombre":"mariposa"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"sombrilla","nombre":"sombrilla"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000035',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 9',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":4,"columna":4,"pictograma":"palmera","nombre":"palmera"},{"fila":1,"columna":4,"pictograma":"ventana","nombre":"ventana"},{"fila":3,"columna":4,"pictograma":"manzana","nombre":"manzana"},{"fila":2,"columna":4,"pictograma":"viento","nombre":"viento"},{"fila":4,"columna":3,"pictograma":"pina","nombre":"piña"},{"fila":3,"columna":1,"pictograma":"abeja","nombre":"abeja"},{"fila":3,"columna":3,"pictograma":"montana","nombre":"montaña"},{"fila":2,"columna":1,"pictograma":"mariposa","nombre":"mariposa"},{"fila":3,"columna":2,"pictograma":"estrella","nombre":"estrella"},{"fila":1,"columna":2,"pictograma":"banano","nombre":"banano"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"moto","nombre":"moto"},{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"avion","nombre":"avión"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 4)","fila":4,"columna":4,"opciones":[{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"palmera","nombre":"palmera"},{"pictograma":"moto","nombre":"moto"},{"pictograma":"estrella","nombre":"estrella"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 3)","fila":4,"columna":3,"opciones":[{"pictograma":"pina","nombre":"piña"},{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"ave","nombre":"ave"},{"pictograma":"globo","nombre":"globo aerostático"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 4)","fila":1,"columna":4,"opciones":[{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"uva","nombre":"uvas"}],"correcta":1}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000036',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 10',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":2,"columna":4,"pictograma":"moto","nombre":"moto"},{"fila":3,"columna":3,"pictograma":"luna","nombre":"luna"},{"fila":4,"columna":2,"pictograma":"pina","nombre":"piña"},{"fila":2,"columna":2,"pictograma":"manzana","nombre":"manzana"},{"fila":3,"columna":4,"pictograma":"pera","nombre":"pera"},{"fila":3,"columna":2,"pictograma":"lluvia","nombre":"lluvia"},{"fila":4,"columna":4,"pictograma":"uva","nombre":"uvas"},{"fila":1,"columna":3,"pictograma":"cereza","nombre":"cerezas"},{"fila":3,"columna":1,"pictograma":"gota","nombre":"gota"},{"fila":4,"columna":3,"pictograma":"naranja","nombre":"naranja"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"hongo","nombre":"hongo"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 1)","fila":3,"columna":1,"opciones":[{"pictograma":"sol","nombre":"sol"},{"pictograma":"pez","nombre":"pez"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"lampara","nombre":"lámpara"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"arbol","nombre":"árbol"},{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"avion","nombre":"avión"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"viento","nombre":"viento"},{"pictograma":"luna","nombre":"luna"},{"pictograma":"pera","nombre":"pera"},{"pictograma":"manzana","nombre":"manzana"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"silla","nombre":"silla"},{"pictograma":"banano","nombre":"banano"},{"pictograma":"tren","nombre":"tren"},{"pictograma":"luna","nombre":"luna"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000037',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 11',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":4,"columna":1,"pictograma":"caracol","nombre":"caracol"},{"fila":3,"columna":2,"pictograma":"pera","nombre":"pera"},{"fila":1,"columna":1,"pictograma":"avion","nombre":"avión"},{"fila":3,"columna":1,"pictograma":"cereza","nombre":"cerezas"},{"fila":2,"columna":3,"pictograma":"gota","nombre":"gota"},{"fila":2,"columna":2,"pictograma":"perro","nombre":"perro"},{"fila":3,"columna":4,"pictograma":"libro","nombre":"libro"},{"fila":2,"columna":4,"pictograma":"naranja","nombre":"naranja"},{"fila":1,"columna":3,"pictograma":"pez","nombre":"pez"},{"fila":2,"columna":1,"pictograma":"hoja","nombre":"hoja"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 1)","fila":1,"columna":1,"opciones":[{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"globo","nombre":"globo aerostático"},{"pictograma":"avion","nombre":"avión"},{"pictograma":"montana","nombre":"montaña"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"pez","nombre":"pez"},{"pictograma":"lampara","nombre":"lámpara"},{"pictograma":"nube","nombre":"nube"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 1)","fila":4,"columna":1,"opciones":[{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"circulo","nombre":"círculo"},{"pictograma":"bus","nombre":"bus"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"cohete","nombre":"cohete"},{"pictograma":"libro","nombre":"libro"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"luna","nombre":"luna"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 4)","fila":2,"columna":4,"opciones":[{"pictograma":"naranja","nombre":"naranja"},{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"sol","nombre":"sol"},{"pictograma":"carro","nombre":"carro"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000038',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 12',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":3,"columna":4,"pictograma":"palmera","nombre":"palmera"},{"fila":4,"columna":3,"pictograma":"gato","nombre":"gato"},{"fila":1,"columna":2,"pictograma":"cuadrado","nombre":"cuadrado"},{"fila":1,"columna":1,"pictograma":"trebol","nombre":"trébol"},{"fila":2,"columna":1,"pictograma":"estrella","nombre":"estrella"},{"fila":3,"columna":1,"pictograma":"hoja","nombre":"hoja"},{"fila":2,"columna":3,"pictograma":"conejo","nombre":"conejo"},{"fila":2,"columna":2,"pictograma":"barco","nombre":"barco"},{"fila":3,"columna":2,"pictograma":"cohete","nombre":"cohete"},{"fila":3,"columna":3,"pictograma":"abeja","nombre":"abeja"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 3)","fila":4,"columna":3,"opciones":[{"pictograma":"rombo","nombre":"rombo"},{"pictograma":"sombrilla","nombre":"sombrilla"},{"pictograma":"triangulo","nombre":"triángulo"},{"pictograma":"gato","nombre":"gato"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"pera","nombre":"pera"},{"pictograma":"copo","nombre":"copo de nieve"},{"pictograma":"moto","nombre":"moto"},{"pictograma":"conejo","nombre":"conejo"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"abeja","nombre":"abeja"},{"pictograma":"ventana","nombre":"ventana"},{"pictograma":"rayo","nombre":"rayo"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"barco","nombre":"barco"},{"pictograma":"nube","nombre":"nube"},{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"perro","nombre":"perro"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 4)","fila":3,"columna":4,"opciones":[{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"montana","nombre":"montaña"},{"pictograma":"reloj","nombre":"reloj"},{"pictograma":"palmera","nombre":"palmera"}],"correcta":3}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000039',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 13',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":1,"columna":1,"pictograma":"rombo","nombre":"rombo"},{"fila":4,"columna":4,"pictograma":"pina","nombre":"piña"},{"fila":3,"columna":4,"pictograma":"avion","nombre":"avión"},{"fila":3,"columna":2,"pictograma":"estrella","nombre":"estrella"},{"fila":3,"columna":3,"pictograma":"manzana","nombre":"manzana"},{"fila":4,"columna":1,"pictograma":"taza","nombre":"taza"},{"fila":2,"columna":3,"pictograma":"tren","nombre":"tren"},{"fila":2,"columna":4,"pictograma":"abeja","nombre":"abeja"},{"fila":2,"columna":2,"pictograma":"pez","nombre":"pez"},{"fila":1,"columna":2,"pictograma":"cereza","nombre":"cerezas"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 2)","fila":3,"columna":2,"opciones":[{"pictograma":"caracol","nombre":"caracol"},{"pictograma":"estrella","nombre":"estrella"},{"pictograma":"lluvia","nombre":"lluvia"},{"pictograma":"mariposa","nombre":"mariposa"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 4)","fila":4,"columna":4,"opciones":[{"pictograma":"carro","nombre":"carro"},{"pictograma":"pina","nombre":"piña"},{"pictograma":"tortuga","nombre":"tortuga"},{"pictograma":"silla","nombre":"silla"}],"correcta":1},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"arcoiris","nombre":"arcoíris"},{"pictograma":"silla","nombre":"silla"},{"pictograma":"trebol","nombre":"trébol"},{"pictograma":"manzana","nombre":"manzana"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 2)","fila":2,"columna":2,"opciones":[{"pictograma":"hongo","nombre":"hongo"},{"pictograma":"moto","nombre":"moto"},{"pictograma":"pez","nombre":"pez"},{"pictograma":"cactus","nombre":"cactus"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"tren","nombre":"tren"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"gota","nombre":"gota"},{"pictograma":"lluvia","nombre":"lluvia"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  ),
  (
    '5e510109-0000-4000-8000-000000000040',
    '0acd0000-0000-4000-8000-000000000109',
    'Diez figuras, 14',
    3,
    '{"modo":"escena","segundosVista":12,"filas":4,"columnas":4,"celdas":[{"fila":1,"columna":3,"pictograma":"barco","nombre":"barco"},{"fila":3,"columna":4,"pictograma":"limon","nombre":"limón"},{"fila":4,"columna":2,"pictograma":"circulo","nombre":"círculo"},{"fila":4,"columna":1,"pictograma":"carro","nombre":"carro"},{"fila":2,"columna":4,"pictograma":"viento","nombre":"viento"},{"fila":2,"columna":3,"pictograma":"naranja","nombre":"naranja"},{"fila":1,"columna":2,"pictograma":"globo","nombre":"globo aerostático"},{"fila":1,"columna":1,"pictograma":"banano","nombre":"banano"},{"fila":2,"columna":1,"pictograma":"avion","nombre":"avión"},{"fila":3,"columna":3,"pictograma":"nube","nombre":"nube"}],"preguntas":[{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 1)","fila":2,"columna":1,"opciones":[{"pictograma":"silla","nombre":"silla"},{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"barco","nombre":"barco"},{"pictograma":"avion","nombre":"avión"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 1, columna 3)","fila":1,"columna":3,"opciones":[{"pictograma":"barco","nombre":"barco"},{"pictograma":"lampara","nombre":"lámpara"},{"pictograma":"cereza","nombre":"cerezas"},{"pictograma":"conejo","nombre":"conejo"}],"correcta":0},{"texto":"¿Qué había en el lugar marcado? (fila 2, columna 3)","fila":2,"columna":3,"opciones":[{"pictograma":"manzana","nombre":"manzana"},{"pictograma":"taza","nombre":"taza"},{"pictograma":"uva","nombre":"uvas"},{"pictograma":"naranja","nombre":"naranja"}],"correcta":3},{"texto":"¿Qué había en el lugar marcado? (fila 4, columna 1)","fila":4,"columna":1,"opciones":[{"pictograma":"lampara","nombre":"lámpara"},{"pictograma":"puerta","nombre":"puerta"},{"pictograma":"carro","nombre":"carro"},{"pictograma":"avion","nombre":"avión"}],"correcta":2},{"texto":"¿Qué había en el lugar marcado? (fila 3, columna 3)","fila":3,"columna":3,"opciones":[{"pictograma":"nube","nombre":"nube"},{"pictograma":"pez","nombre":"pez"},{"pictograma":"silla","nombre":"silla"},{"pictograma":"manzana","nombre":"manzana"}],"correcta":0}],"puntosMaximos":5}'::jsonb,
    TRUE,
    'no_requiere'
  )
ON CONFLICT ("id_sesion") DO NOTHING;
