-- ---------------------------------------------------------------------------
-- La fecha limite del pendiente, opcional (SCRUM-119)
--
-- Un pendiente puede tener un dia limite o no tenerlo: hay cosas que no vencen
-- un dia concreto. Es un DATE y no un instante, porque es "el dia 12" donde
-- esta la persona, y ese dia no cambia si despues viaja (ADR 0014).
--
-- NULL es "sin fecha", y es el valor de todos los pendientes que ya existen:
-- siguen recordando a los 7, 21 o 30 dias de su color, como hasta ahora.
-- ---------------------------------------------------------------------------

ALTER TABLE "pendiente" ADD COLUMN "fecha_limite" DATE;
