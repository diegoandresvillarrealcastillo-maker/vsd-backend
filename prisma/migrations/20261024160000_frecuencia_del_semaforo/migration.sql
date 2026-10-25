-- ---------------------------------------------------------------------------
-- La frecuencia del semaforo (SCRUM-146, ADR 0036)
--
-- El semaforo avisa de los pendientes a una hora que la persona elige. Esta migracion le
-- agrega **cuantas veces al dia**: solo en la manana, solo en la noche o dos veces.
--
-- - frecuencia_semaforo: `manana` por omision. Es lo que el semaforo ya hacia (una vez, a la hora
--   elegida), asi que **todas las filas que ya existen quedan exactamente como estaban**, tambien
--   las de quien eligio una hora de la tarde. Nadie recibe un aviso nuevo que no pidio.
-- - ultimo_aviso_semaforo_noche: el ultimo dia en que se reviso el **segundo** aviso del semaforo,
--   con el mismo molde que `ultimo_aviso_semaforo`, para que cada uno salga una sola vez al dia.
--   NULL en las filas que ya existen.
--
-- `minuto_semaforo` sigue siendo la hora que la persona eligio: los minutos en que sale cada aviso
-- salen de ella y de la frecuencia (nada de eso se guarda aparte, no hay dos valores que puedan
-- quedar distintos). Con una hora desde las 12:00, el segundo aviso nunca cruza la medianoche:
-- ver el ADR 0036.
--
-- No cambia el aislamiento: son columnas de una tabla que ya tiene RLS forzado, su politica de
-- lectura para la tarea de avisos y los permisos de vsd_app, que son de la tabla entera. Ningun
-- dato de salud: una frecuencia y una fecha. Los tipos enumerados los puede usar cualquiera.
--
-- LA APLICA UNA PERSONA, en PRE y despues en PROD, antes de desplegar este backend. Quien la
-- aplique despues del backend veria fallar `preferenciasDe` (la columna no existiria).
-- ---------------------------------------------------------------------------

CREATE TYPE "frecuencia_del_semaforo" AS ENUM ('manana', 'noche', 'dos_veces');

ALTER TABLE "preferencia_aviso"
  ADD COLUMN "frecuencia_semaforo"         "frecuencia_del_semaforo" NOT NULL DEFAULT 'manana',
  ADD COLUMN "ultimo_aviso_semaforo_noche" DATE;
