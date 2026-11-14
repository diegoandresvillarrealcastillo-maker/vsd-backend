-- ---------------------------------------------------------------------------
-- Avisos por Web Push (SCRUM-102)
--
-- Dos tablas, las dos de la persona y aisladas como el resto:
--
-- - SUSCRIPCION_PUSH: cada navegador donde la persona acepto los avisos. Es
--   la direccion a la que el servicio de push del navegador entrega.
-- - PREFERENCIA_AVISO: a que hora quiere cada aviso, en hora de Colombia, y
--   el ultimo dia que se envio, para no repetirlo.
--
-- Ninguna guarda datos de salud: horas, fechas y la direccion del navegador.
-- ---------------------------------------------------------------------------

CREATE TABLE "suscripcion_push" (
    "id_suscripcion" UUID NOT NULL,
    "id_usuario"     UUID NOT NULL,

    -- La direccion del servicio de push del navegador. Es unica en toda la
    -- tabla: un mismo navegador solo entrega los avisos de una persona.
    "endpoint"       TEXT NOT NULL,

    -- Las claves con las que se cifra cada aviso para ese navegador.
    "clave_p256dh"   TEXT NOT NULL,
    "clave_auth"     TEXT NOT NULL,

    "fecha_creacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscripcion_push_pkey" PRIMARY KEY ("id_suscripcion"),
    CONSTRAINT "suscripcion_push_endpoint_https" CHECK ("endpoint" LIKE 'https://%')
);

CREATE UNIQUE INDEX "suscripcion_push_endpoint_key" ON "suscripcion_push" ("endpoint");
CREATE INDEX "suscripcion_push_id_usuario_idx" ON "suscripcion_push" ("id_usuario");

ALTER TABLE "suscripcion_push"
    ADD CONSTRAINT "suscripcion_push_id_usuario_fkey" FOREIGN KEY ("id_usuario")
    REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "preferencia_aviso" (
    "id_usuario"            UUID NOT NULL,

    -- A que hora, en hora de Colombia, contada en minutos desde la
    -- medianoche: 480 son las 8:00. NULL es apagado: cada aviso se apaga por
    -- separado. Minutos y no TIME porque el adaptador de Prisma convierte
    -- TIME en una fecha completa, y con ella vuelven los problemas de zona.
    "minuto_semaforo"       SMALLINT,
    "minuto_racha"          SMALLINT,

    -- El ultimo dia, en hora de Colombia, en que se reviso cada aviso. Con
    -- esto un aviso sale como mucho una vez al dia, aunque el servicio se
    -- reinicie o la revision corra dos veces.
    "ultimo_aviso_semaforo" DATE,
    "ultimo_aviso_racha"    DATE,

    "fecha_edicion"         TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preferencia_aviso_pkey" PRIMARY KEY ("id_usuario"),
    CONSTRAINT "preferencia_aviso_minuto_semaforo_del_dia"
        CHECK ("minuto_semaforo" BETWEEN 0 AND 1439),
    CONSTRAINT "preferencia_aviso_minuto_racha_del_dia"
        CHECK ("minuto_racha" BETWEEN 0 AND 1439)
);

ALTER TABLE "preferencia_aviso"
    ADD CONSTRAINT "preferencia_aviso_id_usuario_fkey" FOREIGN KEY ("id_usuario")
    REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- La revision de cada minuto busca por hora.
CREATE INDEX "preferencia_aviso_minuto_semaforo_idx" ON "preferencia_aviso" ("minuto_semaforo");
CREATE INDEX "preferencia_aviso_minuto_racha_idx" ON "preferencia_aviso" ("minuto_racha");

-- ---------------------------------------------------------------------------
-- Aislamiento
--
-- Lo de siempre: cada persona ve y toca solo sus filas, y FORCE para que ni
-- el dueno de las tablas se salte las politicas.
--
-- Mas dos excepciones, cada una tan estrecha como se pudo:
--
-- 1. La tarea que revisa cada minuto a quien le toca un aviso necesita mirar
--    las horas de todos. Declara `vsd.tarea_actual = 'avisos'` y entonces
--    puede LEER preferencia_aviso, y nada mas: ni escribirla, ni ninguna otra
--    tabla. Lo que encuentra son identificadores y horas; para lo demas
--    (pendientes, actividades, suscripciones) pasa a actuar en nombre de cada
--    persona, con las politicas normales.
--
-- 2. Un navegador que ya entregaba los avisos de otra persona (alguien cerro
--    sesion sin apagarlos, y otra entro en el mismo equipo) tiene que dejar
--    de hacerlo. Quien presenta la direccion del navegador puede BORRAR la
--    fila con esa direccion, sea de quien sea. Tener la direccion es estar en
--    ese navegador.
--
--    PostgreSQL exige que un DELETE con WHERE tambien pase una politica de
--    lectura, asi que hay una para esa misma fila y ninguna otra. Lo que deja
--    ver es la suscripcion de ese navegador, que ya esta en ese navegador; la
--    aplicacion no la lee: solo la borra.
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON "suscripcion_push" TO vsd_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON "preferencia_aviso" TO vsd_app;

ALTER TABLE "suscripcion_push" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "suscripcion_push" FORCE ROW LEVEL SECURITY;
ALTER TABLE "preferencia_aviso" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "preferencia_aviso" FORCE ROW LEVEL SECURITY;

CREATE POLICY "suscripcion_push_solo_la_propia" ON "suscripcion_push"
  FOR ALL
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

CREATE POLICY "suscripcion_push_soltar_el_navegador" ON "suscripcion_push"
  FOR DELETE
  USING ("endpoint" = NULLIF(current_setting('vsd.endpoint_actual', true), ''));

CREATE POLICY "suscripcion_push_encontrar_el_navegador" ON "suscripcion_push"
  FOR SELECT
  USING ("endpoint" = NULLIF(current_setting('vsd.endpoint_actual', true), ''));

CREATE POLICY "preferencia_aviso_solo_la_propia" ON "preferencia_aviso"
  FOR ALL
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

CREATE POLICY "preferencia_aviso_leer_para_avisar" ON "preferencia_aviso"
  FOR SELECT
  USING (COALESCE(current_setting('vsd.tarea_actual', true) = 'avisos', false));
