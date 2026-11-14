-- ---------------------------------------------------------------------------
-- La mascota propia, un SVG que sube la persona (SCRUM-122, ADR 0017)
--
-- Igual que la foto de perfil (ADR 0016), el archivo NO vive en la base: lo
-- guarda Supabase Storage en un bucket privado, y aqui solo queda la marca de
-- que existe y desde cuando.
--
-- Para que sirve la marca:
--
-- 1. Saber si hay mascota propia sin preguntarle a Storage. La pantalla lee la
--    cuenta en cada entrada, y una cuenta sin mascota propia no debe costar una
--    llamada de red.
-- 2. Saber cuando cambio. Es lo que le dice al navegador que la que tenia
--    guardada ya no es la vigente, sin descargarla para compararla.
--
-- Una sola columna, sin valor por defecto: NULL es «no tiene». Las cuentas que
-- ya existen quedan sin mascota propia, que es lo cierto. No cambia ninguna
-- politica de seguridad: la fila sigue siendo de su dueno y de nadie mas.
--
-- Elegirla como mascota no necesita nada nuevo en la base: `usuario.mascota`
-- (JSONB) ya admite cualquier forma por formato, y la API exige que la marca
-- exista antes de aceptar la forma `propia`.
--
-- El bucket (`mascotas-propias`) no se crea aqui, por lo mismo que el de las
-- fotos: lo crea la API la primera vez que guarda un archivo.
--
-- El borrado de cuenta no necesita nada nuevo en la base: la marca vive en la
-- fila de `usuario`, que ya se borra. El archivo lo borra la API antes de
-- confirmar el borrado, dentro de la misma operacion.
-- ---------------------------------------------------------------------------

ALTER TABLE "usuario" ADD COLUMN "mascota_propia_actualizada_el" TIMESTAMPTZ(3);

COMMENT ON COLUMN "usuario"."mascota_propia_actualizada_el" IS
  'Cuando se guardo la mascota propia (un SVG). NULL si no tiene. El archivo vive en Supabase Storage, no en la base.';
