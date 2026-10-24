-- ---------------------------------------------------------------------------
-- «Carta a mi de manana» (EMO-05, SCRUM-230)
--
-- Una anotacion del diario puede ser una carta: se escribe hoy, su texto no sale
-- por la API hasta que la persona la abre (desde el dia siguiente) y se puede
-- borrar sin abrirla. Decision D-C5 de la ficha: una entrada del diario con
-- etiqueta, que ya tiene aislamiento por persona, exportacion y borrado.
--
-- Es un cambio aditivo: las anotaciones que ya existen no son cartas.
--
-- LA APLICA UNA PERSONA, en PRE y despues en PROD. Ver ADR 0033.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Las dos columnas
-- ---------------------------------------------------------------------------

ALTER TABLE "entrada_diario"
  ADD COLUMN "carta_a_manana"  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "carta_abierta_en" TIMESTAMPTZ(3);

-- Solo una carta se abre: una anotacion corriente nunca tiene hora de apertura.
ALTER TABLE "entrada_diario"
  ADD CONSTRAINT "entrada_diario_solo_una_carta_se_abre"
  CHECK ("carta_abierta_en" IS NULL OR "carta_a_manana");

-- ---------------------------------------------------------------------------
-- 2. Abrir una carta no es editarla
--
-- La hora para editar es la primera. Abrir una carta pasa un dia despues, y el
-- disparador de la edicion devuelve NULL (no toca nada) pasada esa hora: sin
-- esta salida, marcar una carta como abierta seria imposible.
--
-- La salida es estrecha. Solo se deja pasar un UPDATE que **no cambia nada mas**
-- que `carta_abierta_en`, y solo de vacio a un valor: ni el texto, ni la version,
-- ni la hora de edicion se pueden tocar por aqui, asi que no abre la edicion de
-- nada. Cualquier otro UPDATE sigue el camino de siempre, y en ese camino
-- `carta_abierta_en` se queda como estaba.
--
-- La hora que se guarda se acota como las otras horas del diario: nunca en el
-- futuro (mas alla de 5 minutos de reloj adelantado) ni de hace mas de un dia.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.vsd_acotar_la_edicion_del_diario() RETURNS trigger
  LANGUAGE plpgsql
AS $$
DECLARE
  declarada timestamptz;
  hora      timestamptz;
BEGIN
  IF OLD."carta_abierta_en" IS NULL
     AND NEW."carta_abierta_en" IS NOT NULL
     AND (to_jsonb(NEW) - 'carta_abierta_en') = (to_jsonb(OLD) - 'carta_abierta_en')
  THEN
    NEW."carta_abierta_en" := LEAST(
      GREATEST(NEW."carta_abierta_en", now() - interval '1 day'),
      now() + interval '5 minutes'
    );

    RETURN NEW;
  END IF;

  -- Una edicion no abre ni cierra cartas.
  NEW."carta_abierta_en" := OLD."carta_abierta_en";

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
-- 3. Que columnas se pueden editar
--
-- Se suma `carta_abierta_en` a las que ya se podian escribir. `carta_a_manana` se
-- decide al escribir la anotacion y no cambia despues: convertir en carta algo
-- ya escrito, o dejar de serlo, no es una edicion.
--
-- Borrar no necesita nada nuevo: la politica `entrada_diario_borrar_la_propia` y
-- el permiso DELETE ya existen, y borrar una carta sin abrirla es un DELETE.
-- ---------------------------------------------------------------------------

GRANT UPDATE ("carta_abierta_en") ON "entrada_diario" TO vsd_app;
