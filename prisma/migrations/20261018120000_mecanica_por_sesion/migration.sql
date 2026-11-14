-- ---------------------------------------------------------------------------
-- Una actividad es una mecanica; lo que cambia cada dia es su sesion
-- (SCRUM-204, ADR 0030)
--
-- ## Que hace
--
-- Prepara la base para que cada modulo ofrezca muchas sesiones distintas sin
-- convertir cada una en una fila de `actividad`:
--
--   1. `actividad.motor`: que componente pinta la mecanica (nueve posibles).
--   2. `frecuencia_actividad` gana `rotativa`.
--   3. `sesion_de_actividad`: el contenido de una vez de una mecanica.
--   4. `resultado.id_sesion`: que sesion se hizo.
--
-- ## Es aditiva
--
-- No borra ni reescribe nada. Las nueve actividades actuales quedan con
-- `motor` vacio hasta la Fase 0, y todo `resultado` existente queda con
-- `id_sesion` vacio. Ninguna fila usa `rotativa` todavia. **No siembra
-- contenido:** las sesiones llegan con el piloto, ya revisadas.
--
-- ## Lo que la base garantiza, y no solo el codigo
--
-- Un contenido se agrega con SQL, y el codigo puede fallar. Por eso lo que el
-- ADR llama garantia vive aqui:
--
--   * lo que pide revision y no la tiene, no se publica (CHECK);
--   * una revisada dice quien la reviso y cuando, y las demas no inventan una
--     constancia (CHECK);
--   * una revisada no se edita: se retira y se agrega otra (disparador). Sin
--     esto, bastaria un UPDATE sobre el texto de una sesion ya revisada para
--     que lo no revisado llegara a una persona, que es justo lo que el CHECK
--     de arriba existe para impedir. Este disparador no esta en el ADR: es la
--     misma garantia llevada a UPDATE, y puede quitarse sin tocar lo demas.
--
-- ## Que NO valida la base
--
-- El contenido de `parametros`: lo valida el dominio (ADR 0008).
--
-- ## Aislamiento
--
-- `sesion_de_actividad` no es un dato personal: lectura abierta y escritura de
-- administrador, como `recurso_apoyo` y `dato_curioso`. La aplicacion solo lee.
-- Tener un `id_sesion` en `resultado` no cambia las politicas de `resultado`.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. El motor de la mecanica
--
-- NULL hasta la Fase 0 para las nueve que ya existen. Los nueve valores son los
-- de las fichas (M1 a M9) y los de `Motor` en el dominio: si uno cambia sin el
-- otro, una mecanica valida en un lado la rechaza el otro.
-- ---------------------------------------------------------------------------

ALTER TABLE "actividad" ADD COLUMN "motor" VARCHAR(30);

ALTER TABLE "actividad"
  ADD CONSTRAINT "actividad_motor_valido" CHECK (
    "motor" IS NULL OR "motor" IN (
      'secuencia',
      'tocar_el_objetivo',
      'ver_ocultar_recordar',
      'clasificar',
      'palabras',
      'calculo',
      'guia_paso_a_paso',
      'cuestionario_corto',
      'escritura_breve'
    )
  );

-- ---------------------------------------------------------------------------
-- 2. La frecuencia rotativa
--
-- Una mecanica rotativa no toca todos los dias: la rotacion elige hasta tres
-- por modulo y por dia (ADR 0030, punto 7). Es un valor nuevo del tipo, asi
-- que ninguna fila actual cambia. PostgreSQL no deja USAR un valor agregado en
-- la misma transaccion que lo agrega; esta migracion no lo usa.
-- ---------------------------------------------------------------------------

ALTER TYPE "frecuencia_actividad" ADD VALUE IF NOT EXISTS 'rotativa';

-- ---------------------------------------------------------------------------
-- 3. La sesion: el contenido de una vez de una mecanica
-- ---------------------------------------------------------------------------

CREATE TABLE "sesion_de_actividad" (
    "id_sesion"    UUID NOT NULL,
    "id_actividad" UUID NOT NULL,

    -- Nombre corto, para la exportacion y la revision.
    "titulo"       VARCHAR(100) NOT NULL,

    -- Dificultad o profundidad. 1 para las mecanicas que no tienen niveles.
    "nivel"        SMALLINT NOT NULL DEFAULT 1,

    -- Lo que el motor necesita: tamano, simbolos, guion, invitacion, pasos...
    "parametros"   JSONB NOT NULL,

    -- Solo se sirven las publicadas. Retirar no borra (ADR 0025): quien ya la
    -- hizo la conserva en su historial.
    "publicado"    BOOLEAN NOT NULL DEFAULT false,

    -- `no_requiere`, `pendiente` o `revisada`. Nace pendiente: publicar exige
    -- decirlo, no olvidarlo.
    "revision"     VARCHAR(20) NOT NULL DEFAULT 'pendiente',

    -- Rol o nombre de quien reviso, y cuando. Sin datos de contacto.
    "revisada_por" VARCHAR(100),
    "revisada_el"  TIMESTAMPTZ(3),

    "creada_en"    TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesion_de_actividad_pkey" PRIMARY KEY ("id_sesion"),
    CONSTRAINT "sesion_de_actividad_titulo_no_vacio" CHECK (length(btrim("titulo")) > 0),
    CONSTRAINT "sesion_de_actividad_nivel_valido" CHECK ("nivel" BETWEEN 1 AND 3),
    CONSTRAINT "sesion_de_actividad_parametros_objeto" CHECK (jsonb_typeof("parametros") = 'object'),
    CONSTRAINT "sesion_de_actividad_revision_valida"
      CHECK ("revision" IN ('no_requiere', 'pendiente', 'revisada')),

    -- La regla de Samuel (15/10/2026) convertida en garantia de la base: lo que
    -- pide revision no sale hasta que una persona con formacion lo aprueba.
    CONSTRAINT "sesion_de_actividad_publicada_revisada"
      CHECK (NOT "publicado" OR "revision" IN ('no_requiere', 'revisada')),

    -- Una revisada dice quien y cuando; las demas no traen constancia de una
    -- revision que no hubo.
    CONSTRAINT "sesion_de_actividad_constancia_coherente" CHECK (
      ("revision" = 'revisada'
        AND "revisada_por" IS NOT NULL
        AND length(btrim("revisada_por")) > 0
        AND "revisada_el" IS NOT NULL)
      OR
      ("revision" <> 'revisada'
        AND "revisada_por" IS NULL
        AND "revisada_el" IS NULL)
    )
);

ALTER TABLE "sesion_de_actividad"
  ADD CONSTRAINT "sesion_de_actividad_id_actividad_fkey" FOREIGN KEY ("id_actividad")
  REFERENCES "actividad"("id_actividad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Elegir la sesion de hoy cruza las publicadas de una mecanica con lo que la
-- persona hizo en ella.
CREATE INDEX "sesion_de_actividad_id_actividad_publicado_idx"
  ON "sesion_de_actividad" ("id_actividad", "publicado");

-- ---------------------------------------------------------------------------
-- 3.1 Una sesion revisada no se edita
--
-- Si el texto cambia, se retira y se agrega otra con otro identificador, que
-- queda pendiente hasta que se revise. Asi el historial de una persona apunta
-- siempre al contenido que de verdad vio.
--
-- Sobre una revisada solo se puede cambiar `publicado`: retirarla o volver a
-- publicarla es el mismo contenido. Tampoco se puede «des-revisar» una para
-- editarla despues: `revision`, `revisada_por` y `revisada_el` quedan fijas.
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.vsd_sesion_revisada_no_se_edita() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  IF OLD."revision" = 'revisada' AND (
       NEW."id_sesion"    IS DISTINCT FROM OLD."id_sesion"
    OR NEW."id_actividad" IS DISTINCT FROM OLD."id_actividad"
    OR NEW."titulo"       IS DISTINCT FROM OLD."titulo"
    OR NEW."nivel"        IS DISTINCT FROM OLD."nivel"
    OR NEW."parametros"   IS DISTINCT FROM OLD."parametros"
    OR NEW."revision"     IS DISTINCT FROM OLD."revision"
    OR NEW."revisada_por" IS DISTINCT FROM OLD."revisada_por"
    OR NEW."revisada_el"  IS DISTINCT FROM OLD."revisada_el"
    OR NEW."creada_en"    IS DISTINCT FROM OLD."creada_en"
  ) THEN
    RAISE EXCEPTION
      'Una sesion revisada no se edita: se retira y se agrega otra con otro identificador (%).',
      OLD."id_sesion"
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER "sesion_de_actividad_revisada_no_se_edita"
  BEFORE UPDATE ON "sesion_de_actividad"
  FOR EACH ROW EXECUTE FUNCTION public.vsd_sesion_revisada_no_se_edita();

-- ---------------------------------------------------------------------------
-- 4. Que sesion se hizo
--
-- NULL en todo lo que existe hoy y en las nueve actividades actuales, que no
-- tienen sesiones. ON DELETE RESTRICT: una sesion que alguien ya hizo no se
-- borra; se retira (`publicado = false`).
-- ---------------------------------------------------------------------------

ALTER TABLE "resultado" ADD COLUMN "id_sesion" UUID;

ALTER TABLE "resultado"
  ADD CONSTRAINT "resultado_id_sesion_fkey" FOREIGN KEY ("id_sesion")
  REFERENCES "sesion_de_actividad"("id_sesion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Para la FK: borrar o actualizar una sesion no recorre todos los resultados.
CREATE INDEX "resultado_id_sesion_idx" ON "resultado" ("id_sesion");

-- Para «que sesion toca»: lo que una persona hizo en una mecanica durante el
-- ultimo ano.
CREATE INDEX "resultado_id_usuario_id_actividad_dia_idx"
  ON "resultado" ("id_usuario", "id_actividad", "dia");

-- ---------------------------------------------------------------------------
-- 5. Aislamiento: lectura abierta y escritura de administrador
--
-- Sin FORCE, como `recurso_apoyo` y `dato_curioso`: las cargas de contenido las
-- hace el dueno de la tabla. La aplicacion (`vsd_app`) solo lee.
-- ---------------------------------------------------------------------------

ALTER TABLE "sesion_de_actividad" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sesion_de_actividad_lectura_abierta" ON "sesion_de_actividad"
  FOR SELECT
  USING (true);

CREATE POLICY "sesion_de_actividad_escritura_administrador" ON "sesion_de_actividad"
  FOR ALL
  USING (public.vsd_es_administrador())
  WITH CHECK (public.vsd_es_administrador());

GRANT SELECT ON "sesion_de_actividad" TO vsd_app;
