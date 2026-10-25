-- ---------------------------------------------------------------------------
-- Quitar lo que agrego la migracion 20261024130000 al diario
--
-- La «carta a mi de manana» con texto sellado no se va a implementar (SCRUM-230,
-- decision de Samuel). La migracion que la preparo ya esta aplicada en PRE, asi que
-- no se borra ni se edita: esta la deshace, en orden inverso.
--
--   1. El disparador de la hora para editar vuelve a ser el que era, sin la salida
--      que dejaba marcar una carta como abierta.
--   2. Se quitan el CHECK y las dos columnas (`carta_a_manana`, `carta_abierta_en`).
--
-- Las anotaciones que se hubieran escrito como carta siguen existiendo como
-- anotaciones corrientes del diario: no se borra ninguna fila ni ningun texto.
--
-- El paso 1 va antes que el 2 a proposito: el disparador de ahora lee
-- `carta_abierta_en`, y si la columna desaparece primero, la siguiente edicion de
-- una anotacion fallaria.
--
-- LA APLICA UNA PERSONA, en PRE y despues en PROD (donde nunca llego a aplicarse la
-- anterior, esta no hace nada que no se pueda repetir). Desplegar primero el
-- frontend y el backend que ya no usan las columnas, y despues aplicar esta.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. El disparador, como estaba antes de las cartas
--
-- Se fija el `search_path` (aviso `function_search_path_mutable` del asistente de
-- seguridad de Supabase): la funcion solo usa `now()`, que vive en `pg_catalog`.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.vsd_acotar_la_edicion_del_diario() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = pg_catalog, public
AS $$
DECLARE
  declarada timestamptz;
  hora      timestamptz;
BEGIN
  declarada := CASE
    WHEN NEW."fecha_edicion" IS DISTINCT FROM OLD."fecha_edicion" THEN NEW."fecha_edicion"
    ELSE now()
  END;

  hora := LEAST(
    GREATEST(declarada, OLD."fecha_creacion", OLD."fecha_edicion", now() - interval '30 days'),
    now() + interval '5 minutes'
  );

  -- Pasada la primera hora desde que se escribio: no se toca.
  IF OLD."fecha_creacion" <= hora - interval '60 minutes' THEN
    RETURN NULL;
  END IF;

  NEW."fecha_edicion" := hora;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Las columnas
--
-- Quitar `carta_abierta_en` tambien quita el permiso de UPDATE por columna que se
-- le dio a `vsd_app`.
-- ---------------------------------------------------------------------------

ALTER TABLE "entrada_diario" DROP CONSTRAINT "entrada_diario_solo_una_carta_se_abre";

ALTER TABLE "entrada_diario"
  DROP COLUMN "carta_abierta_en",
  DROP COLUMN "carta_a_manana";
