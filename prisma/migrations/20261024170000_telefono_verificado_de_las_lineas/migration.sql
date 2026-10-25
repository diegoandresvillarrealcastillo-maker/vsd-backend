-- ============================================================================
-- El telefono verificado de cada linea de atencion, para «Llamar ahora» (SCRUM-257)
-- ============================================================================
--
-- Hasta aqui el numero de una linea solo estaba escrito dentro de su titulo y
-- su descripcion, y quien lo necesitaba tenia que copiarlo y pegarlo en el
-- marcador: en una crisis, una friccion grave (ADR 0034, punto 4).
--
-- Una columna nueva, `telefono`, con lo que se marca y nada mas: cifras, con un
-- `+` delante si lleva prefijo de pais. Dos restricciones:
--
--   * el formato, para que lo que acaba en un `tel:` sea siempre marcable;
--   * que solo la tenga un contacto. Y un contacto ya no entra sin fuente ni
--     fecha de verificacion (`recurso_apoyo_contacto_con_fuente`), asi que **un
--     numero que se marca con un boton siempre viene de una linea verificada**.
--
-- No se anade ningun numero nuevo: cada uno de abajo ya esta escrito en el
-- titulo o la descripcion de su fila, que una persona confirmo en su fuente
-- oficial (ADR 0015). Aqui solo se copia a la columna lo que la fila ya dice.
-- La Linea 192 y la 988 piden elegir una opcion al contestar (la 4, el 2): la
-- opcion sigue en la descripcion y el boton no la marca sola.
--
-- El directorio internacional no lleva ninguno, a proposito: no se sabe cual
-- seria el de esa persona.
--
-- Agregar o corregir un numero es una migracion nueva, no editar esta.

-- AlterTable
ALTER TABLE "recurso_apoyo" ADD COLUMN "telefono" VARCHAR(16);

-- Colombia
UPDATE "recurso_apoyo" SET "telefono" = '192'
WHERE "id_recurso" = '0192c0de-0000-4000-8000-000000000192' AND "tipo" = 'contacto';

UPDATE "recurso_apoyo" SET "telefono" = '123'
WHERE "id_recurso" = '0123c0de-0000-4000-8000-000000000123' AND "tipo" = 'contacto';

UPDATE "recurso_apoyo" SET "telefono" = '106'
WHERE "id_recurso" = '0106c0de-0000-4000-8000-000000000106' AND "tipo" = 'contacto';


-- Mexico
UPDATE "recurso_apoyo" SET "telefono" = '8009112000'
WHERE "id_recurso" = '8009c0de-0000-4000-8000-000000911200' AND "tipo" = 'contacto';

UPDATE "recurso_apoyo" SET "telefono" = '911'
WHERE "id_recurso" = '0911c0de-0000-4000-8000-000000000911' AND "tipo" = 'contacto';


-- Espana
UPDATE "recurso_apoyo" SET "telefono" = '024'
WHERE "id_recurso" = '0024c0de-0000-4000-8000-000000000024' AND "tipo" = 'contacto';

UPDATE "recurso_apoyo" SET "telefono" = '112'
WHERE "id_recurso" = '0112c0de-0000-4000-8000-000000000112' AND "tipo" = 'contacto';


-- Estados Unidos
UPDATE "recurso_apoyo" SET "telefono" = '988'
WHERE "id_recurso" = '0988c0de-0000-4000-8000-000000000988' AND "tipo" = 'contacto';

UPDATE "recurso_apoyo" SET "telefono" = '911'
WHERE "id_recurso" = '1911c0de-0000-4000-8000-000000000911' AND "tipo" = 'contacto';

-- Las restricciones, una vez que lo que ya existia las cumple
ALTER TABLE "recurso_apoyo"
  ADD CONSTRAINT "recurso_apoyo_telefono_formato"
  CHECK ("telefono" IS NULL OR "telefono" ~ '^[+]?[0-9]{3,15}$');

ALTER TABLE "recurso_apoyo"
  ADD CONSTRAINT "recurso_apoyo_telefono_solo_en_contactos"
  CHECK ("telefono" IS NULL OR "tipo" = 'contacto');
