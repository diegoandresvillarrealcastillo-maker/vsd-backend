-- ---------------------------------------------------------------------------
--  Sendero por modulo: frecuencia de cada actividad y modulo de cada
--  categoria (SCRUM-91)
-- ---------------------------------------------------------------------------
--
-- ## Frecuencia
--
-- Para saber que le toca a alguien hoy, cada actividad dice cada cuanto se
-- hace: todos los dias, ciertos dias de la semana o una sola vez. Y desde que
-- sesion del modulo aparece, para que el sendero se abra poco a poco.
--
-- Las nueve actividades actuales quedan diarias y disponibles desde la primera
-- sesion: es lo que ya eran en la practica. Ajustarlas es trabajo de
-- contenido, no de esquema.
--
-- ## Modulo de cada categoria
--
-- Las preferencias guardan los modulos con una clave estable (cognicion,
-- bienestar, emociones). Para unir una actividad con su modulo hace falta que
-- la categoria tambien la tenga. No se usa el nombre: es texto visible y ya
-- cambio una vez.
--
-- Se empareja por nombre con y sin tilde, porque segun el ambiente la
-- migracion de tildes puede haber corrido o no cuando llegue esta.
--
-- ## Aislamiento
--
-- `categoria` y `actividad` no tienen FORCE ROW LEVEL SECURITY, asi que estos
-- UPDATE, que corre el dueno de las tablas, si se aplican.

CREATE TYPE "frecuencia_actividad" AS ENUM ('diaria', 'semanal', 'unica');

ALTER TABLE "actividad"
  ADD COLUMN "frecuencia" "frecuencia_actividad" NOT NULL DEFAULT 'diaria',
  ADD COLUMN "dias_semana" SMALLINT[] NOT NULL DEFAULT ARRAY[]::SMALLINT[],
  ADD COLUMN "desde_sesion" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "actividad"
  ADD CONSTRAINT "actividad_desde_sesion_positiva" CHECK ("desde_sesion" >= 1);

ALTER TABLE "actividad"
  ADD CONSTRAINT "actividad_dias_de_la_semana" CHECK (
    "dias_semana" <@ ARRAY[1, 2, 3, 4, 5, 6, 7]::SMALLINT[]
    AND ("frecuencia" <> 'semanal' OR cardinality("dias_semana") >= 1)
  );

ALTER TABLE "categoria"
  ADD COLUMN "modulo" VARCHAR(20);

ALTER TABLE "categoria"
  ADD CONSTRAINT "categoria_modulo_unico" UNIQUE ("modulo");

ALTER TABLE "categoria"
  ADD CONSTRAINT "categoria_modulo_conocido"
  CHECK ("modulo" IS NULL OR "modulo" IN ('cognicion', 'bienestar', 'emociones'));

UPDATE "categoria" SET "modulo" = 'cognicion' WHERE "nombre" IN ('Cognición', 'Cognicion');
UPDATE "categoria" SET "modulo" = 'bienestar' WHERE "nombre" = 'Bienestar';
UPDATE "categoria" SET "modulo" = 'emociones' WHERE "nombre" = 'Emociones';

COMMENT ON COLUMN "actividad"."frecuencia" IS
  'Cada cuanto toca: diaria, semanal (dias_semana) o unica.';
COMMENT ON COLUMN "actividad"."desde_sesion" IS
  'Desde que sesion del modulo aparece. La primera es 1.';
COMMENT ON COLUMN "categoria"."modulo" IS
  'Clave estable del modulo. NULL en categorias que no son de ningun modulo.';
