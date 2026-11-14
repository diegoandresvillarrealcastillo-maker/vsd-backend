-- ---------------------------------------------------------------------------
-- Datos curiosos del dia (SCRUM-185, ADR 0025)
--
-- Una frase corta de cultura general que la persona ve cada dia en su panel.
--
-- ## Dos tablas
--
-- `dato_curioso` es el catalogo: lo mismo para todas las personas, con lectura
-- abierta y escritura de administrador, igual que `recurso_apoyo`.
--
-- `dato_curioso_cursor` es por donde va cada persona: una fila con el ultimo dato
-- que se le dio y el dia. Es lo unico que se guarda de ella. El orden en que ve los
-- datos no se guarda: se calcula en cada consulta con un hash del identificador de
-- la persona y el del dato, asi que no hay 100 mil filas por cuenta.
--
-- ## Por que un cursor y no «el dia numero N»
--
-- Si el dato de hoy saliera del numero de dia, agregar o retirar un dato a mitad
-- del ciclo movería todo y repetiria uno ya visto. Con el cursor se pasa «al
-- siguiente despues del ultimo»: lo nuevo entra donde le toca, lo retirado se
-- salta, y nada se repite hasta terminar el ciclo.
--
-- ## Personal o no
--
-- El cursor lleva `id_usuario` y un dia: es un dato personal, asi que sale en la
-- exportacion y se borra con la cuenta (ON DELETE CASCADE, y la prueba de borrado
-- recorre cada tabla con `id_usuario`).
--
-- ## Datos iniciales
--
-- 98 datos de cultura general: hongos, naturaleza, animales, cuerpo, espacio,
-- Colombia, ciencia y lenguaje. **Ninguno es un consejo de salud.** Entran como
-- `publicado = true`; quien los revise puede retirar uno con
--   UPDATE dato_curioso SET publicado = false WHERE id_dato = '...';
-- y deja de salir sin tocar a quien ya lo tenia como el del dia.
-- ---------------------------------------------------------------------------

CREATE TABLE "dato_curioso" (
    "id_dato"    UUID NOT NULL,
    "texto"      VARCHAR(280) NOT NULL,
    "tema"       VARCHAR(40) NOT NULL,

    -- Un dato retirado deja de salir pero la fila se queda: quien ya lo tiene como
    -- el del dia lo conserva hasta que termine el dia.
    "publicado"  BOOLEAN NOT NULL DEFAULT false,
    "creado_en"  TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dato_curioso_pkey" PRIMARY KEY ("id_dato"),
    CONSTRAINT "dato_curioso_texto_no_vacio" CHECK (length(btrim("texto")) > 0)
);

CREATE INDEX "dato_curioso_publicado_idx" ON "dato_curioso" ("publicado");

CREATE TABLE "dato_curioso_cursor" (
    "id_usuario"     UUID NOT NULL,

    -- El dato que se le dio. NULL si despues se borro del catalogo: el cursor sigue
    -- sirviendo, porque lo que cuenta es `clave`.
    "id_dato"        UUID,

    -- Donde cayo ese dato en el orden de esta persona (un hash de su identificador
    -- y el del dato). El siguiente es el de clave mayor mas cercana.
    "clave"          BIGINT NOT NULL,

    -- El dia, en el calendario de la persona, en que se le dio.
    "dia"            DATE NOT NULL,

    "actualizado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dato_curioso_cursor_pkey" PRIMARY KEY ("id_usuario")
);

ALTER TABLE "dato_curioso_cursor"
    ADD CONSTRAINT "dato_curioso_cursor_id_usuario_fkey" FOREIGN KEY ("id_usuario")
    REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dato_curioso_cursor"
    ADD CONSTRAINT "dato_curioso_cursor_id_dato_fkey" FOREIGN KEY ("id_dato")
    REFERENCES "dato_curioso"("id_dato") ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Aislamiento
--
-- El catalogo es de todos: lectura abierta y escritura de administrador, como
-- `recurso_apoyo`. La API solo lee. El cursor es de su dueno y de nadie mas, con
-- la misma politica que RESULTADO y FORCE.
-- ---------------------------------------------------------------------------

GRANT SELECT ON "dato_curioso" TO vsd_app;

ALTER TABLE "dato_curioso" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dato_curioso_lectura_abierta" ON "dato_curioso"
  FOR SELECT
  USING (true);

CREATE POLICY "dato_curioso_escritura_administrador" ON "dato_curioso"
  FOR ALL
  USING (public.vsd_es_administrador())
  WITH CHECK (public.vsd_es_administrador());

GRANT SELECT, INSERT, UPDATE, DELETE ON "dato_curioso_cursor" TO vsd_app;

ALTER TABLE "dato_curioso_cursor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "dato_curioso_cursor" FORCE ROW LEVEL SECURITY;

CREATE POLICY "dato_curioso_cursor_solo_el_propio" ON "dato_curioso_cursor"
  FOR ALL
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

-- ---------------------------------------------------------------------------
-- Los 98 datos iniciales
--
-- El identificador sale del texto (`md5(...)::uuid`): el mismo dato tiene el mismo
-- identificador en cada ambiente, y volver a correr esto no lo duplica.
-- ---------------------------------------------------------------------------

INSERT INTO "dato_curioso" ("id_dato", "texto", "tema", "publicado")
SELECT md5("texto")::uuid, "texto", "tema", true
FROM (VALUES
  -- Hongos
  ('Los hongos están más emparentados con los animales que con las plantas.', 'hongos'),
  ('Lo que vemos de una seta es solo una parte del hongo: el resto es una red de filamentos, el micelio, que se extiende bajo la tierra.', 'hongos'),
  ('Un hongo del género Armillaria, en Oregón (Estados Unidos), cubre más de 9 kilómetros cuadrados y es uno de los organismos más grandes que se conocen.', 'hongos'),
  ('La penicilina, uno de los primeros antibióticos, se descubrió en 1928 a partir de un moho.', 'hongos'),
  ('La levadura es un hongo microscópico: es la que hace crecer el pan.', 'hongos'),
  ('Algunas setas brillan en la oscuridad. Se llama bioluminiscencia y la tienen decenas de especies.', 'hongos'),
  ('Los hongos no hacen fotosíntesis: se alimentan de materia que descomponen o de otros organismos.', 'hongos'),
  ('Muchos árboles intercambian nutrientes con hongos que viven en sus raíces. Esa alianza se llama micorriza.', 'hongos'),
  ('Las células de los hongos tienen quitina, la misma sustancia del caparazón de los insectos.', 'hongos'),
  ('El champiñón, la seta más cultivada del mundo, es la misma especie en sus versiones blanca, café y portobello.', 'hongos'),
  ('Se han descrito unas 150 000 especies de hongos, pero se calcula que hay millones por descubrir.', 'hongos'),
  ('Algunas setas aparecen en círculos llamados «anillos de hadas», porque el micelio crece hacia afuera desde un punto.', 'hongos'),
  -- Naturaleza
  ('Un árbol grande puede liberar cientos de litros de agua al aire en un día caluroso a través de sus hojas.', 'naturaleza'),
  ('Una nube de las de algodón puede pesar unas 500 toneladas, aunque flote sin esfuerzo.', 'naturaleza'),
  ('La Amazonía produce y recicla buena parte de su propia lluvia gracias al agua que liberan sus árboles.', 'naturaleza'),
  ('El agua es la única sustancia común que se encuentra en la naturaleza en sus tres estados: sólido, líquido y gas.', 'naturaleza'),
  ('El hielo flota porque, al congelarse, el agua ocupa más espacio y se vuelve menos densa.', 'naturaleza'),
  ('Un rayo puede alcanzar unos 30 000 grados, mucho más que la superficie del Sol.', 'naturaleza'),
  ('Un arcoíris es en realidad un círculo completo; desde el suelo solo vemos la mitad.', 'naturaleza'),
  ('Los copos de nieve tienen seis lados.', 'naturaleza'),
  ('El mar cubre cerca de siete de cada diez partes de la superficie de la Tierra.', 'naturaleza'),
  ('Las abejas obreras fabrican la cera con su propio cuerpo para construir celdas en forma de hexágono.', 'naturaleza'),
  ('Las abejas comunican con una danza en qué dirección y a qué distancia están las flores.', 'naturaleza'),
  ('La Tierra no es una esfera perfecta: está un poco achatada en los polos.', 'naturaleza'),
  ('El Sol tiene más del 99 % de toda la masa de nuestro sistema solar.', 'naturaleza'),
  ('Las mariposas pueden saborear con las patas.', 'naturaleza'),
  -- Animales
  ('Los colibríes pueden batir las alas más de 50 veces por segundo.', 'animales'),
  ('Los pulpos tienen tres corazones.', 'animales'),
  ('Una ballena azul puede medir hasta 30 metros: es el animal más grande que ha existido.', 'animales'),
  ('Los koalas duermen hasta 20 horas al día.', 'animales'),
  ('Las jirafas tienen siete huesos en el cuello, los mismos que las personas.', 'animales'),
  ('Los elefantes se reconocen en un espejo, algo que muy pocos animales logran.', 'animales'),
  ('Las rayas de cada cebra son únicas, como una huella digital.', 'animales'),
  ('Los gatos pasan entre 12 y 16 horas al día durmiendo.', 'animales'),
  ('Los delfines duermen con una mitad del cerebro a la vez para poder seguir respirando.', 'animales'),
  ('Muchas tortugas marinas vuelven a poner sus huevos en la playa donde nacieron.', 'animales'),
  ('Las hormigas pueden cargar objetos que pesan decenas de veces lo que ellas.', 'animales'),
  ('Los búhos pueden girar la cabeza unos 270 grados.', 'animales'),
  ('Los murciélagos son los únicos mamíferos que vuelan de verdad.', 'animales'),
  ('Los caracoles tienen miles de dientes diminutos en una lengua llamada rádula.', 'animales'),
  ('Las tortugas gigantes de las Galápagos pueden vivir más de 100 años.', 'animales'),
  ('El olfato de un perro detecta olores muchísimo más débiles que los que percibimos nosotros.', 'animales'),
  -- Cuerpo y mente
  ('Una persona adulta tiene 206 huesos.', 'cuerpo'),
  ('El corazón empieza a latir antes de nacer: hacia la sexta semana del embarazo ya se puede detectar.', 'cuerpo'),
  ('El cerebro usa cerca del 20 % de la energía del cuerpo, aunque pesa solo alrededor de 1,4 kilos.', 'cuerpo'),
  ('Los huesos más pequeños del cuerpo están en el oído: el martillo, el yunque y el estribo.', 'cuerpo'),
  ('Las huellas dactilares se forman antes de nacer y no se conocen dos iguales.', 'cuerpo'),
  ('El cuerpo humano tiene alrededor de 600 músculos.', 'cuerpo'),
  ('Las células del gusto de la lengua se renuevan cada una o dos semanas.', 'cuerpo'),
  ('Parpadeamos entre 15 y 20 veces por minuto sin darnos cuenta.', 'cuerpo'),
  ('El olfato está muy ligado a la memoria: un olor puede traer un recuerdo de golpe.', 'cuerpo'),
  ('Bostezar es contagioso: ver o escuchar un bostezo suele provocarnos otro.', 'cuerpo'),
  ('Las plantas de los pies tienen muchas terminaciones nerviosas; por eso son tan sensibles al cosquilleo.', 'cuerpo'),
  ('Reírse activa varias zonas del cerebro a la vez.', 'cuerpo'),
  -- Espacio
  ('Un día en Venus es más largo que su año: tarda más en girar sobre sí misma que en darle la vuelta al Sol.', 'espacio'),
  ('La luz del Sol tarda unos 8 minutos en llegar a la Tierra.', 'espacio'),
  ('La Luna se aleja de la Tierra unos 3,8 centímetros cada año.', 'espacio'),
  ('Saturno es tan poco denso que flotaría en una bañera lo bastante grande.', 'espacio'),
  ('En el espacio no se escucha el sonido, porque no hay aire que lo lleve.', 'espacio'),
  ('Júpiter tiene decenas de lunas conocidas.', 'espacio'),
  ('Nuestra galaxia, la Vía Láctea, tiene cientos de miles de millones de estrellas.', 'espacio'),
  ('La luz de algunas estrellas sale tan lejos de nosotros que tarda miles de años en llegar a nuestros ojos.', 'espacio'),
  ('Marte se ve rojizo por el óxido de hierro que cubre su superficie.', 'espacio'),
  ('Un año en Mercurio dura solo 88 días terrestres.', 'espacio'),
  -- Colombia
  ('Colombia es el único país de Sudamérica con costas en el océano Pacífico y en el mar Caribe.', 'colombia'),
  ('El río Magdalena es el principal río de Colombia y atraviesa el país de sur a norte.', 'colombia'),
  ('Caño Cristales, en la Serranía de la Macarena, es conocido como «el río de los cinco colores».', 'colombia'),
  ('Los picos más altos de Colombia están en la Sierra Nevada de Santa Marta y rondan los 5 700 metros.', 'colombia'),
  ('La Sierra Nevada de Santa Marta es la montaña costera más alta del mundo.', 'colombia'),
  ('La palma de cera del Quindío es el árbol nacional de Colombia y puede superar los 50 metros de altura.', 'colombia'),
  ('El Paisaje Cultural Cafetero de Colombia es Patrimonio Mundial de la UNESCO desde 2011.', 'colombia'),
  ('Cartagena de Indias conserva una de las murallas coloniales más largas de América.', 'colombia'),
  ('Colombia alberga cerca de la mitad de los páramos del mundo.', 'colombia'),
  ('El Chocó es una de las regiones más lluviosas del planeta.', 'colombia'),
  ('Colombia es el país con más especies de aves del mundo: supera las 1 900.', 'colombia'),
  ('Colombia es uno de los países megadiversos del planeta.', 'colombia'),
  -- Ciencia e inventos
  ('La miel casi no se echa a perder: se han encontrado vasijas de hace miles de años con miel todavía en buen estado.', 'ciencia'),
  ('El primer sitio web de la historia se publicó en 1991.', 'ciencia'),
  ('El papel moneda nació en China hace más de mil años.', 'ciencia'),
  ('Se cree que la rueda se usó primero para hacer cerámica, y solo después para mover carros.', 'ciencia'),
  ('Los primeros anteojos aparecieron en Italia hacia el siglo XIII.', 'ciencia'),
  ('Los números que usamos hoy llegaron a Europa a través de los árabes, pero nacieron en la India.', 'ciencia'),
  ('El cero como número se desarrolló en la India.', 'ciencia'),
  ('La imprenta de tipos móviles de Gutenberg se inventó hacia 1450.', 'ciencia'),
  ('Un año luz es la distancia que recorre la luz en un año: casi 9,5 billones de kilómetros.', 'ciencia'),
  ('El número pi tiene infinitos decimales y nunca se repiten en un patrón.', 'ciencia'),
  ('La Tierra da una vuelta sobre sí misma en unas 23 horas y 56 minutos, no en 24.', 'ciencia'),
  ('Existen años bisiestos porque la Tierra tarda unas 6 horas más que 365 días en darle la vuelta al Sol.', 'ciencia'),
  -- Lenguaje y cultura
  ('La palabra «ojalá» viene del árabe y significaba algo parecido a «quiera Dios».', 'lenguaje'),
  ('El español es la segunda lengua del mundo por número de hablantes nativos.', 'lenguaje'),
  ('La «ñ» nació cuando los copistas medievales escribían una «n» pequeña sobre otra para abreviar «nn».', 'lenguaje'),
  ('La palabra «murciélago» contiene las cinco vocales.', 'lenguaje'),
  ('En el mundo se hablan más de 7 000 lenguas.', 'lenguaje'),
  ('El alfabeto latino que usamos viene, a través de los etruscos, del alfabeto griego.', 'lenguaje'),
  ('La arepa se prepara con maíz desde mucho antes de la llegada de los españoles.', 'lenguaje'),
  ('El maíz es originario de América y hoy se cultiva en casi todo el mundo.', 'lenguaje'),
  ('El cacao crece en una franja cercana al ecuador.', 'lenguaje'),
  ('La palabra «chocolate» viene del náhuatl, la lengua de los mexicas.', 'lenguaje')
) AS "datos"("texto", "tema")
ON CONFLICT ("id_dato") DO NOTHING;

COMMENT ON TABLE "dato_curioso" IS
  'Catalogo de datos curiosos (SCRUM-185). Lectura abierta; solo se sirven los publicados.';
COMMENT ON TABLE "dato_curioso_cursor" IS
  'Por donde va cada persona en el ciclo de datos curiosos: el ultimo que se le dio y el dia. Una fila por persona.';
