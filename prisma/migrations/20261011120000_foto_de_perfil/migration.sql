-- ---------------------------------------------------------------------------
-- La foto de perfil (SCRUM-120, ADR 0016)
--
-- La foto en si NO vive en la base: son bytes, y los guarda Supabase Storage en
-- un bucket privado. Aqui solo queda la marca de que existe y desde cuando.
--
-- Para que sirve la marca:
--
-- 1. Saber si hay foto sin preguntarle a Storage. La pantalla la lee en cada
--    cuenta, y una cuenta sin foto no debe costar una llamada de red.
-- 2. Saber cuando cambio. Es lo que le dice al navegador que la que guardo ya
--    no es la vigente, sin descargarla para compararla.
--
-- Una sola columna, sin valor por defecto: NULL es «no tiene». Las cuentas que
-- ya existen quedan sin foto, que es lo cierto. No cambia ninguna politica de
-- seguridad: la fila sigue siendo de su dueno y de nadie mas.
--
-- El bucket no se crea aqui. Una migracion de Prisma no puede tocar de forma
-- soportada el esquema `storage` de Supabase, que ademas no existe en la base
-- local ni en la del CI. Lo crea la API la primera vez que guarda una foto, con
-- su limite de peso y sus tipos permitidos (ver AlmacenPersonalEnSupabase).
--
-- El borrado de cuenta (SCRUM-75) no necesita nada nuevo en la base: la marca
-- vive en la fila de `usuario`, que ya se borra. El archivo lo borra la API
-- antes de confirmar el borrado, dentro de la misma operacion.
-- ---------------------------------------------------------------------------

ALTER TABLE "usuario" ADD COLUMN "foto_actualizada_el" TIMESTAMPTZ(3);

COMMENT ON COLUMN "usuario"."foto_actualizada_el" IS
  'Cuando se guardo la foto de perfil. NULL si no tiene. La foto en si vive en Supabase Storage, no en la base.';
