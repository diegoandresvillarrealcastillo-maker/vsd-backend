-- ---------------------------------------------------------------------------
-- El acompanamiento por dias seguidos no se calcula sin permiso (SCRUM-177)
--
-- Decision de Diego (ADR 0034, pregunta 3): mirar los resultados de una persona,
-- dia tras dia, para ofrecerle acompanamiento es una inferencia sobre su estado
-- de animo. Aunque nada salga de su cuenta, se hace solo si ella lo permite,
-- igual que el diario (SCRUM-108).
--
-- Apagado por defecto. Las cuentas que ya existen quedan apagadas tambien:
-- nadie dio ese permiso, asi que no se supone.
--
-- Es aditivo y no toca ningun dato. LA APLICA UNA PERSONA, en PRE y despues en PROD,
-- antes de desplegar el backend: sin la columna, leer una cuenta falla.
-- ---------------------------------------------------------------------------

ALTER TABLE "usuario"
  ADD COLUMN "acompanamiento_por_dias" BOOLEAN NOT NULL DEFAULT false;
