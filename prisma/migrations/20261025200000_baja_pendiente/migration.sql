-- ---------------------------------------------------------------------------
-- La baja de la cuenta deja una marca antes de lo irreversible (SCRUM-267, ADR 0040)
--
-- Hasta ahora la baja era una sola transaccion: la constancia, el borrado de las
-- filas y, **dentro** de ella, el borrado de los archivos y de la identidad en el
-- proveedor. Eso retenia una conexion de la base mientras se esperaba a la red, y
-- dejaba abierto el hueco de que la base fallara al confirmar despues de que el
-- proveedor ya hubiera borrado la identidad.
--
-- ## Que se hace
--
-- 1. Se deja una marca en `baja_pendiente` (transaccion corta).
-- 2. Se borran los archivos y la identidad, sin transaccion (los dos pasos se
--    pueden repetir).
-- 3. Se borran las filas y, si corresponde, se anota la constancia (transaccion
--    corta). La marca se va sola con la fila de `usuario`.
--
-- Si algo falla despues del paso 1, la marca se queda y una tarea del API termina
-- la baja. Esta migracion solo crea la tabla de marcas y sus permisos.
--
-- ## Por que lleva clave foranea con ON DELETE CASCADE
--
-- Para que la marca no se pueda olvidar: desaparece con la cuenta, como toda tabla
-- con `id_usuario`. La prueba de borrado recorre cada tabla con esa columna y exige
-- que quede vacia, y esta lo cumple por si misma.
--
-- ## Lo que NO guarda
--
-- Ningun dato personal: solo el identificador (que ya existe en `usuario`), si lleva
-- constancia y cuando se pidio.
-- ---------------------------------------------------------------------------

CREATE TABLE "baja_pendiente" (
    "id_usuario"     UUID NOT NULL,

    -- Si al terminar se anota la constancia minima (la baja que pide la persona) o
    -- no (el rechazo de un menor, que no tiene una autorizacion valida que probar).
    "con_constancia" BOOLEAN NOT NULL,

    "pedida_el"      TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "baja_pendiente_pkey" PRIMARY KEY ("id_usuario")
);

-- La tarea pide "las mas antiguas primero, las que llevan mas de un rato".
CREATE INDEX "baja_pendiente_pedida_el_idx" ON "baja_pendiente" ("pedida_el");

ALTER TABLE "baja_pendiente"
    ADD CONSTRAINT "baja_pendiente_id_usuario_fkey" FOREIGN KEY ("id_usuario")
    REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Aislamiento
--
-- - La persona solo puede anadir y ver **su** marca. No hay UPDATE ni DELETE: la
--   marca no se edita, y se va sola con la cuenta por la clave foranea (la cascada
--   no pasa por las politicas).
-- - La tarea que termina las bajas declara `vsd.tarea_actual = 'bajas'` y entonces
--   puede LEER las marcas, y nada mas: ni escribirlas, ni ninguna otra tabla. Lo que
--   encuentra son identificadores y fechas; para actuar pasa a ser, una por una, la
--   persona de cada marca, con las politicas normales.
-- - FORCE, como el resto, para que ni el dueno de la tabla se salte las politicas.
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT ON "baja_pendiente" TO vsd_app;

ALTER TABLE "baja_pendiente" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "baja_pendiente" FORCE ROW LEVEL SECURITY;

CREATE POLICY "baja_pendiente_solo_la_propia" ON "baja_pendiente"
  FOR SELECT
  USING ("id_usuario" = public.vsd_usuario_actual());

CREATE POLICY "baja_pendiente_anadir_la_propia" ON "baja_pendiente"
  FOR INSERT
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

CREATE POLICY "baja_pendiente_leer_para_terminar" ON "baja_pendiente"
  FOR SELECT
  USING (COALESCE(current_setting('vsd.tarea_actual', true) = 'bajas', false));

COMMENT ON TABLE "baja_pendiente" IS
  'Marca de una baja de cuenta pedida y sin terminar (SCRUM-267, ADR 0040). Se va con la fila de usuario; si queda una, la tarea del API termina la baja.';
