-- ---------------------------------------------------------------------------
-- El diario no se lee sin permiso (SCRUM-108)
--
-- Decision de Diego: nadie se mete en lo que alguien escribe en su diario.
-- Solo si la persona lo permite, el servidor busca en lo que escribe una
-- senal de riesgo para ofrecerle las lineas de atencion.
--
-- Apagado por defecto. Las cuentas que ya existen quedan apagadas tambien:
-- nadie dio ese permiso, asi que no se supone.
-- ---------------------------------------------------------------------------

ALTER TABLE "usuario"
  ADD COLUMN "diario_con_recomendaciones" BOOLEAN NOT NULL DEFAULT false;
