-- ---------------------------------------------------------------------------
-- El diario por dia, con una hora para editar (SCRUM-95)
--
-- Cada anotacion es una fila y pertenece a un dia del calendario de Colombia.
-- Se puede corregir durante la primera hora; despues, lo que se quiera anadir
-- va en una anotacion nueva y la original queda como se escribio (ADR 0009).
--
-- Esa hora la impone la base y no la API. Si la regla viviera solo en el
-- codigo, cualquiera con acceso a la conexion de la aplicacion podria
-- reescribir una anotacion de hace un mes con un UPDATE directo.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. El dia al que pertenece cada anotacion
--
-- No se deriva de `fecha_creacion` al leer porque no siempre coinciden: se
-- puede anadir algo a un dia pasado, y la anotacion conserva la hora real en
-- que se escribio.
-- ---------------------------------------------------------------------------

ALTER TABLE "entrada_diario" ADD COLUMN "dia" DATE;

-- Las filas que ya existan pertenecen al dia en que se escribieron, en hora de
-- Colombia. El dueno de la tabla esta sujeto a las politicas (FORCE), asi que
-- se suspenden solo mientras se rellena; sin eso el UPDATE no veria ninguna
-- fila y el NOT NULL de abajo fallaria.
ALTER TABLE "entrada_diario" NO FORCE ROW LEVEL SECURITY;

UPDATE "entrada_diario"
   SET "dia" = ("fecha_creacion" AT TIME ZONE 'America/Bogota')::date;

ALTER TABLE "entrada_diario" FORCE ROW LEVEL SECURITY;

-- El valor por defecto es "hoy en Colombia". La API siempre manda el dia, asi
-- que solo lo usa quien inserta directo contra la base, como las pruebas.
ALTER TABLE "entrada_diario"
  ALTER COLUMN "dia" SET DEFAULT ((now() AT TIME ZONE 'America/Bogota')::date),
  ALTER COLUMN "dia" SET NOT NULL;

-- El diario se consulta por rango de dias, siempre de una sola persona.
CREATE INDEX "entrada_diario_id_usuario_dia_idx" ON "entrada_diario" ("id_usuario", "dia");

-- ---------------------------------------------------------------------------
-- 2. La hora de creacion la pone la base
--
-- La ventana de edicion se cuenta desde `fecha_creacion`. Si quien inserta
-- pudiera elegirla, bastaria con escribir una fecha futura para editar
-- siempre. El disparador la fija al insertar, venga lo que venga.
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.vsd_fijar_creacion_del_diario() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW."fecha_creacion" := now();

  RETURN NEW;
END;
$$;

CREATE TRIGGER "entrada_diario_fecha_de_creacion"
  BEFORE INSERT ON "entrada_diario"
  FOR EACH ROW EXECUTE FUNCTION public.vsd_fijar_creacion_del_diario();

-- ---------------------------------------------------------------------------
-- 3. Que columnas se pueden editar
--
-- Solo lo que la persona escribe y lo que acompana a una edicion. Ni el dueno
-- de la anotacion, ni su dia, ni su hora de creacion, ni su identificador de
-- operacion: cambiar `fecha_creacion` alargaria la ventana, y cambiar el dia
-- moveria lo escrito a otra fecha del historial.
--
-- Es un permiso por columna y no una comprobacion: un UPDATE que toque una de
-- las protegidas falla con un error, en lugar de ignorarse en silencio.
-- ---------------------------------------------------------------------------

REVOKE UPDATE ON "entrada_diario" FROM vsd_app;

GRANT UPDATE ("titulo", "contenido", "formato", "etiquetas", "adjuntos", "version", "fecha_edicion")
  ON "entrada_diario" TO vsd_app;

-- ---------------------------------------------------------------------------
-- 4. Politicas: una por operacion
--
-- La politica anterior servia para todo con una sola condicion. Ahora la
-- edicion lleva una mas, y una politica FOR ALL no puede tener condiciones
-- distintas por operacion.
--
-- Nadie mas lee el diario, tampoco el administrador: ninguna de estas mira
-- `vsd.rol_actual`.
-- ---------------------------------------------------------------------------

DROP POLICY "entrada_diario_solo_la_propia" ON "entrada_diario";

CREATE POLICY "entrada_diario_leer_la_propia" ON "entrada_diario"
  FOR SELECT
  USING ("id_usuario" = public.vsd_usuario_actual());

CREATE POLICY "entrada_diario_escribir_la_propia" ON "entrada_diario"
  FOR INSERT
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

-- La hora para editar. `now()` es la hora de la base, que es la misma para
-- todas las conexiones: ni el reloj del dispositivo ni el de la API cuentan.
-- Fuera de la ventana el UPDATE no encuentra la fila y no cambia nada.
CREATE POLICY "entrada_diario_editar_en_la_primera_hora" ON "entrada_diario"
  FOR UPDATE
  USING (
    "id_usuario" = public.vsd_usuario_actual()
    AND "fecha_creacion" > now() - interval '60 minutes'
  )
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

CREATE POLICY "entrada_diario_borrar_la_propia" ON "entrada_diario"
  FOR DELETE
  USING ("id_usuario" = public.vsd_usuario_actual());
