-- ---------------------------------------------------------------------------
-- El semaforo de pendientes (SCRUM-97)
--
-- Lo que la persona tiene pendiente, con su color: urgente, prioridad o
-- aplazable. Son datos personales como cualquier otro: se guardan en el
-- servidor, aislados por persona, y se borran con la cuenta.
-- ---------------------------------------------------------------------------

CREATE TYPE "nivel_pendiente" AS ENUM ('urgente', 'prioridad', 'aplazable');

CREATE TABLE "pendiente" (
    "id_pendiente"         UUID NOT NULL,
    "id_usuario"           UUID NOT NULL,
    "texto"                VARCHAR(280) NOT NULL,
    "nivel"                "nivel_pendiente" NOT NULL,
    "hecho"                BOOLEAN NOT NULL DEFAULT false,

    -- Mientras no llegue esta fecha, el pendiente no recuerda nada. Es lo que
    -- deja posponer una semana sin tener que borrar ni cambiar de nivel.
    "posponer_hasta"       TIMESTAMPTZ(3),

    -- Unico por persona, igual que en RESULTADO y ENTRADA_DIARIO: un reintento
    -- sin conexion no deja el mismo pendiente dos veces.
    "id_operacion_cliente" UUID NOT NULL,

    "fecha_creacion"       TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_edicion"        TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pendiente_pkey" PRIMARY KEY ("id_pendiente"),

    -- Un pendiente vacio no es un pendiente. La API lo rechaza antes; esto es
    -- para quien escriba directo contra la base.
    CONSTRAINT "pendiente_texto_no_vacio" CHECK (length(btrim("texto")) > 0)
);

CREATE UNIQUE INDEX "pendiente_id_usuario_id_operacion_cliente_key"
    ON "pendiente" ("id_usuario", "id_operacion_cliente");

CREATE INDEX "pendiente_id_usuario_hecho_idx" ON "pendiente" ("id_usuario", "hecho");

-- Se borran con la cuenta (RF12). La prueba de borrado de cuenta recorre cada
-- tabla con `id_usuario` y falla si alguna conserva filas.
ALTER TABLE "pendiente"
    ADD CONSTRAINT "pendiente_id_usuario_fkey" FOREIGN KEY ("id_usuario")
    REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Aislamiento: la misma politica que RESULTADO
--
-- Una tabla nueva nace sin acceso para vsd_app (migracion
-- 20260916120000_aislamiento_por_rls): hay que concederlo a proposito. Y
-- FORCE, para que ni el dueno de la tabla se salte la politica.
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON "pendiente" TO vsd_app;

ALTER TABLE "pendiente" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pendiente" FORCE ROW LEVEL SECURITY;

CREATE POLICY "pendiente_solo_el_propio" ON "pendiente"
  FOR ALL
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());
