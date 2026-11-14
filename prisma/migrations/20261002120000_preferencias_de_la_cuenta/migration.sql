-- ---------------------------------------------------------------------------
--  Preferencias de la cuenta: modulos activos y mascota (SCRUM-88)
-- ---------------------------------------------------------------------------
--
-- ## Modulos activos
--
-- Cada persona empieza solo con los modulos que elige, para no recibir toda la
-- aplicacion de golpe. Se guardan con claves estables —cognicion, bienestar,
-- emociones— y no con el nombre ni el identificador de la categoria: el nombre
-- es texto visible y ya cambio una vez, y el identificador puede variar entre
-- bases porque la siembra empareja por nombre.
--
-- Una lista vacia significa "todavia no eligio", y el frontend lleva a esa
-- persona a la bienvenida. Eso incluye a las cuentas que ya existian: no se les
-- activan los tres modulos aqui, y es deliberado. La eleccion es nueva en este
-- sprint, y lo honesto es preguntarle a cada quien en lugar de suponer.
--
-- Que nunca se pueda quedar en cero una vez elegido lo impone el dominio. Aqui
-- se impone lo que la base si puede comprobar sin conocer el flujo: que no
-- entre una clave que no existe.
--
-- ## Mascota
--
-- Forma, color, accesorio y nombre, en JSONB. Sin valor se usa la de siempre.
-- La forma y el accesorio no se restringen a una lista: los modelos
-- definitivos todavia no existen, y cada modelo nuevo no deberia exigir una
-- migracion.
--
-- ## Aislamiento
--
-- No hace falta una politica nueva. Las columnas son de `usuario`, y
-- `usuario_solo_el_propio` ya limita cada sesion a su propia fila.

ALTER TABLE "usuario"
  ADD COLUMN "modulos_activos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "mascota" JSONB;

ALTER TABLE "usuario"
  ADD CONSTRAINT "usuario_modulos_conocidos"
  CHECK ("modulos_activos" <@ ARRAY['cognicion', 'bienestar', 'emociones']::TEXT[]);

ALTER TABLE "usuario"
  ADD CONSTRAINT "usuario_mascota_es_objeto"
  CHECK ("mascota" IS NULL OR jsonb_typeof("mascota") = 'object');

COMMENT ON COLUMN "usuario"."modulos_activos" IS
  'Modulos que la persona eligio. Vacio mientras no ha pasado por la bienvenida.';

COMMENT ON COLUMN "usuario"."mascota" IS
  'Forma, color, accesorio y nombre de la mascota. NULL usa la de siempre.';
