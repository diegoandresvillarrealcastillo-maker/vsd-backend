-- ---------------------------------------------------------------------------
-- La zona horaria de cada persona (SCRUM-123, ADR 0014)
--
-- Hasta ahora todo el sistema contaba el dia en hora de Colombia. Desde aqui
-- cada cuenta guarda su zona, la informa su dispositivo y decide que dia es
-- para ella: sus actividades, su sendero, su diario, su semaforo y la hora de
-- sus avisos.
--
-- Tres cambios, y ninguno borra ni reescribe lo que ya existe:
--
-- 1. USUARIO.zona_horaria: donde esta la persona.
-- 2. PREFERENCIA_AVISO.zona_horaria: la misma zona, copiada por la base.
-- 3. RESULTADO.dia: el dia de cada resultado, guardado.
--
-- Todo lo anterior a esta migracion ocurrio en hora de Colombia, y por eso es
-- el valor con el que se rellena.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. La zona de la persona
--
-- Se valida en la API contra la base de zonas IANA del servidor; aqui solo se
-- impide lo que nunca puede ser una zona. Las cuentas que ya existen quedan en
-- America/Bogota, que es lo que venian usando.
-- ---------------------------------------------------------------------------

ALTER TABLE "usuario"
  ADD COLUMN "zona_horaria" VARCHAR(64) NOT NULL DEFAULT 'America/Bogota',
  ADD CONSTRAINT "usuario_zona_horaria_con_nombre" CHECK (length(btrim("zona_horaria")) > 0);

-- ---------------------------------------------------------------------------
-- 2. La zona en que se leen las horas de los avisos
--
-- La tarea que revisa cada minuto a quien le toca un aviso solo puede leer
-- PREFERENCIA_AVISO (ver la migracion de los avisos), y ahi las horas son
-- minutos del dia de *esa* persona: las 8:00 de Bogota no son las 8:00 de
-- Madrid. Para saber en que zona leer cada hora necesita la zona en esa misma
-- tabla. No se le abre USUARIO para eso: tendria acceso al correo y a todo lo
-- demas de cada cuenta, y la tarea justo esta hecha para no tenerlo.
--
-- La copia la hace la base y no la aplicacion, con dos disparadores. Asi hay
-- una sola fuente (USUARIO) y ningun camino de codigo que pueda olvidarse de
-- mantenerla. Nadie la escribe desde la aplicacion.
-- ---------------------------------------------------------------------------

ALTER TABLE "preferencia_aviso"
  ADD COLUMN "zona_horaria" VARCHAR(64) NOT NULL DEFAULT 'America/Bogota';

-- Al crear las preferencias de una persona, nacen en su zona.
CREATE FUNCTION public.vsd_zona_de_los_avisos() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW."zona_horaria" := COALESCE(
    (SELECT u."zona_horaria" FROM public."usuario" u WHERE u."id_usuario" = NEW."id_usuario"),
    NEW."zona_horaria"
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER "preferencia_aviso_nace_en_su_zona"
  BEFORE INSERT ON "preferencia_aviso"
  FOR EACH ROW
  EXECUTE FUNCTION public.vsd_zona_de_los_avisos();

-- Si la persona cambia de zona, sus horas pasan a leerse en la nueva.
--
-- Se ejecuta con los permisos de quien actualiza la cuenta, que actua en
-- nombre de esa misma persona: la politica de PREFERENCIA_AVISO le deja tocar
-- su fila y ninguna otra.
CREATE FUNCTION public.vsd_llevar_la_zona_a_los_avisos() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public."preferencia_aviso"
     SET "zona_horaria" = NEW."zona_horaria"
   WHERE "id_usuario" = NEW."id_usuario";

  RETURN NULL;
END;
$$;

CREATE TRIGGER "usuario_cambia_de_zona"
  AFTER UPDATE OF "zona_horaria" ON "usuario"
  FOR EACH ROW
  WHEN (OLD."zona_horaria" IS DISTINCT FROM NEW."zona_horaria")
  EXECUTE FUNCTION public.vsd_llevar_la_zona_a_los_avisos();

-- ---------------------------------------------------------------------------
-- 3. El dia de cada resultado
--
-- Hasta ahora el dia de un resultado se calculaba al leer, a partir de su
-- instante y de la zona del servidor. Con una zona por persona eso es un
-- error: al viajar, cada resultado antiguo se moveria de dia y las rachas ya
-- ganadas se romperian. Un dia que ocurrio no cambia porque la persona cambie
-- de lugar, asi que se guarda cuando el resultado se registra.
-- ---------------------------------------------------------------------------

ALTER TABLE "resultado" ADD COLUMN "dia" DATE;

-- Los resultados que ya existen son de hora de Colombia. El dueno de la tabla
-- esta sujeto a las politicas (FORCE), asi que se suspenden solo mientras se
-- rellena; sin eso el UPDATE no veria ninguna fila y el NOT NULL de abajo
-- fallaria. Es el mismo procedimiento que uso el diario (SCRUM-95).
ALTER TABLE "resultado" NO FORCE ROW LEVEL SECURITY;

UPDATE "resultado"
   SET "dia" = ("fecha" AT TIME ZONE 'America/Bogota')::date;

ALTER TABLE "resultado" FORCE ROW LEVEL SECURITY;

-- El valor por defecto es "hoy en Colombia". La API siempre manda el dia, asi
-- que solo lo usa quien inserta directo contra la base, como las pruebas.
ALTER TABLE "resultado"
  ALTER COLUMN "dia" SET DEFAULT ((now() AT TIME ZONE 'America/Bogota'::text))::date,
  ALTER COLUMN "dia" SET NOT NULL;

-- El progreso se calcula por persona y por dia.
CREATE INDEX "resultado_id_usuario_dia_idx" ON "resultado" ("id_usuario", "dia");
