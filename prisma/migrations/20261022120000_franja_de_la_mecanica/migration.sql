-- ---------------------------------------------------------------------------
-- La franja del dia de una mecanica (SCRUM-221, ADR 0030 punto 8)
--
-- ## Que hace
--
-- Una columna `actividad.franja`: la franja del dia en que el sendero ofrece la mecanica (`manana`, `tarde`
-- o `noche`; vacia = a cualquier hora). Casi todas valen a cualquier hora. La usan «Antes de dormir» (BIE-07)
-- y «El cierre del dia» (EMO-09), que hablan de la noche.
--
-- ## Es aditiva
--
-- Una columna nullable sin valor por omision: ninguna fila cambia, ninguna actividad se oculta. La franja la
-- ponen las migraciones que siembran las mecanicas que la usan. La franja decide QUE SE OFRECE, no que se
-- puede hacer: la actividad sigue en el catalogo y se abre a cualquier hora.
--
-- ## Lo que la base garantiza
--
-- Solo las tres franjas del dominio (`Franja.ts`). Si una cambia sin la otra, una mecanica valida en un lado la
-- rechaza el otro.
--
-- Para deshacerla: ALTER TABLE "actividad" DROP COLUMN "franja";
-- (el CHECK se va con la columna).
-- ---------------------------------------------------------------------------

ALTER TABLE "actividad" ADD COLUMN "franja" VARCHAR(10);

ALTER TABLE "actividad"
  ADD CONSTRAINT "actividad_franja_valida" CHECK (
    "franja" IS NULL OR "franja" IN ('manana', 'tarde', 'noche')
  );
