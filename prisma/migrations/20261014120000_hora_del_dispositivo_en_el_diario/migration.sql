-- ---------------------------------------------------------------------------
-- La hora de una anotacion del diario puede ser la del dispositivo (SCRUM-144)
--
-- Hasta ahora la base fijaba `fecha_creacion` con su propio reloj al insertar y
-- contaba la hora para editar desde el reloj de la base. Con el modo sin conexion
-- eso falla de dos maneras:
--
--   1. Una anotacion escrita a las 9:00 sin conexion y recibida a las 14:00
--      aparecia en el historial como de las 14:00.
--   2. Una correccion hecha a las 9:30 y recibida a las 14:00 llegaba fuera de
--      plazo y se guardaba como una anotacion nueva: dos donde se escribio una.
--
-- Ahora quien escribe manda la hora, y la base ya no la impone sino que la
-- **acota**: nunca en el futuro (mas alla de 5 minutos de reloj adelantado) y
-- nunca de hace mas de 30 dias. Es una regla de producto y no un limite de
-- seguridad: nadie puede demostrar a que hora escribio algo. Lo que se acota es
-- cuanto, y esas dos cotas son las que impiden que una hora inventada abra una
-- anotacion antigua a la edicion. Ver el ADR 0020.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Al insertar: la hora que mande quien escribe, acotada
--
-- `fecha_edicion` de una anotacion recien escrita es su `fecha_creacion`.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.vsd_fijar_creacion_del_diario() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW."fecha_creacion" := LEAST(
    GREATEST(NEW."fecha_creacion", now() - interval '30 days'),
    now() + interval '5 minutes'
  );
  NEW."fecha_edicion" := NEW."fecha_creacion";

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Al editar: la hora de la edicion decide si esta dentro de la hora
--
-- La hora para editar ya no se mide contra el reloj de la base sino contra la
-- hora de la edicion que manda el dispositivo, acotada igual que arriba y ademas
-- **nunca antes de haberse escrito la anotacion ni de su ultima edicion**.
--
-- Si quien actualiza no cambia `fecha_edicion` (un UPDATE directo que solo toca
-- el texto), no hay hora que acotar: la edicion es de ahora, como siempre. Sin
-- esto, dejar `fecha_edicion` como estaba bastaria para editar siempre "en el
-- momento en que se escribio".
--
-- Fuera de la hora el disparador devuelve NULL: el UPDATE no encuentra fila y no
-- cambia nada, sin error, igual que antes con la politica. La API averigua el
-- motivo.
--
-- Esto lo hace un disparador y no una politica porque una politica de UPDATE
-- solo ve la fila vieja (USING) o la nueva (WITH CHECK, que ademas falla con un
-- error en lugar de no tocar nada), y aqui hacen falta las dos.
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.vsd_acotar_la_edicion_del_diario() RETURNS trigger
  LANGUAGE plpgsql
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

CREATE TRIGGER "entrada_diario_hora_de_edicion"
  BEFORE UPDATE ON "entrada_diario"
  FOR EACH ROW EXECUTE FUNCTION public.vsd_acotar_la_edicion_del_diario();

-- ---------------------------------------------------------------------------
-- 3. La politica de edicion deja de mirar el reloj
--
-- Ahora solo dice de quien es la anotacion; la hora la comprueba el disparador.
-- Seguir exigiendo `fecha_creacion > now() - 60 minutes` impediria aplicar una
-- correccion hecha dentro de la hora y recibida despues.
--
-- Nadie mas lee ni toca el diario, tampoco el administrador: esta politica no
-- mira `vsd.rol_actual`.
-- ---------------------------------------------------------------------------

DROP POLICY "entrada_diario_editar_en_la_primera_hora" ON "entrada_diario";

CREATE POLICY "entrada_diario_editar_la_propia" ON "entrada_diario"
  FOR UPDATE
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

-- ---------------------------------------------------------------------------
-- 4. Que columnas se pueden editar
--
-- Sin cambios: `fecha_edicion` ya se podia escribir (la pone cada edicion) y
-- `fecha_creacion` sigue sin poderse tocar despues de insertar. Cambiarla
-- alargaria la hora para editar.
-- ---------------------------------------------------------------------------
