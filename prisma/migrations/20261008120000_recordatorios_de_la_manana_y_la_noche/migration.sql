-- ---------------------------------------------------------------------------
-- Los recordatorios de las 8:00 y de las 20:00 (SCRUM-126)
--
-- Dos avisos nuevos dentro de PREFERENCIA_AVISO, con el mismo molde que el del
-- semaforo y el de la racha: una hora, en minutos desde la medianoche de la
-- persona (su zona esta en la misma tabla, SCRUM-123), y el ultimo dia en que
-- se reviso, para que salga una sola vez al dia.
--
-- - minuto_manana: 480 son las 8:00. Sale siempre.
-- - minuto_noche: 1200 son las 20:00. Solo sale si ese dia no hubo actividad.
--
-- NULL es apagado, y es lo que queda para todas las filas que ya existen: nadie
-- recibe un aviso que no pidio. La hora no se mueve (la aplicacion solo escribe
-- esos dos valores), pero se guarda como minuto y no como un interruptor para
-- que la busqueda de cada minuto sea la misma de los otros avisos.
--
-- No cambia el aislamiento: son columnas de una tabla que ya tiene RLS forzado,
-- su politica de lectura para la tarea de avisos y los permisos de vsd_app, que
-- son de la tabla entera. Ningun dato de salud: horas y fechas.
-- ---------------------------------------------------------------------------

ALTER TABLE "preferencia_aviso"
  ADD COLUMN "minuto_manana"       SMALLINT,
  ADD COLUMN "minuto_noche"        SMALLINT,
  ADD COLUMN "ultimo_aviso_manana" DATE,
  ADD COLUMN "ultimo_aviso_noche"  DATE,
  ADD CONSTRAINT "preferencia_aviso_minuto_manana_del_dia"
    CHECK ("minuto_manana" BETWEEN 0 AND 1439),
  ADD CONSTRAINT "preferencia_aviso_minuto_noche_del_dia"
    CHECK ("minuto_noche" BETWEEN 0 AND 1439);

-- La revision de cada minuto busca por hora.
CREATE INDEX "preferencia_aviso_minuto_manana_idx" ON "preferencia_aviso" ("minuto_manana");
CREATE INDEX "preferencia_aviso_minuto_noche_idx" ON "preferencia_aviso" ("minuto_noche");
