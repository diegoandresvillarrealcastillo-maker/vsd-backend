-- ---------------------------------------------------------------------------
-- Retirar al personaje Trama (SCRUM-121)
--
-- Trama deja de ser una mascota que se pueda elegir. Quien la tenia guardada
-- pasa a Fungito, que es la de siempre, y abre el panel sin ningun error.
--
-- La columna `usuario.mascota` es un JSONB con la forma, el nombre y, del modelo
-- anterior, un color y un accesorio. No tiene ninguna restriccion sobre la
-- forma, a proposito: cada personaje es cosa del frontend (ver la migracion de
-- las preferencias). Por eso esta migracion solo toca datos y no el esquema.
--
-- Dos reglas, para no pisar lo que la persona decidio:
--
-- 1. La forma pasa a `fungito`, siempre.
-- 2. El nombre pasa a `Fungito` solo si todavia era el que traia el personaje
--    («Trama», sin importar mayusculas ni espacios). Una mascota a la que la
--    persona le puso otro nombre, por ejemplo «Hilo», lo conserva.
--
-- El color y el accesorio, si los habia, se quedan como estaban.
--
-- Es idempotente: una segunda ejecucion no encuentra nada que cambiar.
-- ---------------------------------------------------------------------------

-- El dueno de la tabla esta sujeto a las politicas (FORCE), asi que se suspenden
-- solo mientras se actualiza; sin eso el UPDATE no veria ninguna fila. Es el
-- mismo procedimiento que usaron la zona horaria (SCRUM-123) y el diario
-- (SCRUM-95).
ALTER TABLE "usuario" NO FORCE ROW LEVEL SECURITY;

UPDATE "usuario"
   SET "mascota" = jsonb_set(
         jsonb_set("mascota", '{forma}', '"fungito"'::jsonb),
         '{nombre}',
         CASE
           WHEN lower(btrim(COALESCE("mascota"->>'nombre', ''))) IN ('trama', '')
             THEN '"Fungito"'::jsonb
           ELSE "mascota"->'nombre'
         END
       )
 WHERE "mascota"->>'forma' = 'trama';

ALTER TABLE "usuario" FORCE ROW LEVEL SECURITY;
