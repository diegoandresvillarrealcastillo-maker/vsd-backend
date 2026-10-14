-- ---------------------------------------------------------------------------
-- Dar de baja la cuenta con constancia (SCRUM-190, ADR 0026)
--
-- Hasta ahora borrar la cuenta lo borraba todo, incluida la prueba de que la
-- persona habia autorizado el tratamiento de sus datos. La Ley 1581 de 2012 obliga
-- a poder demostrar esa autorizacion, y no se puede demostrar con lo que se borro.
--
-- ## Que se hace
--
-- Al dar de baja la cuenta se sigue borrando **todo** lo vivo: la fila de `usuario`
-- y, por ON DELETE CASCADE, resultados, diario, pendientes, avisos y el cursor del
-- dato curioso. La diferencia es que antes de eso se anota una **constancia
-- minima** en dos tablas nuevas:
--
-- - `cuenta_inactiva`: que la cuenta existio, cuando se creo, cuando se dio de baja
--   y el identificador que el proveedor le dio a la identidad.
-- - `consentimiento_de_cuenta_inactiva`: lo que acepto, version por version y con
--   su fecha.
--
-- ## Lo que NO guardan
--
-- Nombre, correo, fecha de nacimiento, foto, mascota, diario, respuestas: nada de
-- lo que la persona escribio o hizo. Una constancia demuestra una autorizacion, no
-- identifica a nadie.
--
-- ## Por que tablas aparte y no una columna `estado` en `usuario`
--
-- Se considero dejar la fila de `usuario` con un estado INACTIVA y anonimizarla en
-- el sitio. Se descarto porque falla hacia el lado malo: cada tabla y cada columna
-- nueva que guarde algo personal tendria que acordarse de limpiarse en la baja, y
-- el olvido deja datos de salud de una persona que pidio que se borraran. Con
-- tablas aparte, lo nuevo se borra solo por la clave foranea (como hasta hoy y como
-- ya comprueba la prueba que recorre toda tabla con `id_usuario`), y lo unico que
-- sobrevive es lo que esta escrito aqui.
--
-- Tambien evita dos problemas de la fila anonimizada: que el correo siga ocupado
-- (la unicidad impediria volver a registrarse con el mismo) y que una peticion en
-- vuelo pudiera anadir datos a una cuenta dada de baja.
--
-- ## Para que sirve `id_proveedor_auth` aqui
--
-- Un token que Supabase firmo sigue valiendo hasta que caduca, aunque la identidad
-- ya no exista. Sin saber que ese identificador es de una cuenta dada de baja, el
-- alta crearia una cuenta nueva para una identidad que ya no existe. La API
-- consulta esta tabla para rechazarlo con 401 y cerrar la sesion.
--
-- ## Nombres de las columnas
--
-- La clave se llama `id_cuenta` y no `id_usuario` a proposito: la prueba de borrado
-- recorre toda tabla con una columna `id_usuario` y exige que quede vacia para la
-- persona. Esto no es un dato vivo suyo, es la constancia.
-- ---------------------------------------------------------------------------

CREATE TABLE "cuenta_inactiva" (
    -- El identificador que tuvo la cuenta. Ya no apunta a nada.
    "id_cuenta"                    UUID NOT NULL,

    -- El que el proveedor de autenticacion le dio a la identidad, que ya no existe.
    "id_proveedor_auth"            VARCHAR(255) NOT NULL,

    "fecha_registro"               TIMESTAMPTZ(3) NOT NULL,
    "inactivada_el"                TIMESTAMPTZ(3) NOT NULL,

    -- Lo ultimo que acepto, como lo guardaba `usuario`. El historial completo esta
    -- en `consentimiento_de_cuenta_inactiva`.
    "version_politica_aceptada"    VARCHAR(20) NOT NULL,
    "fecha_aceptacion_politica"    TIMESTAMPTZ(3) NOT NULL,
    "version_terminos_aceptada"    VARCHAR(20),
    "fecha_aceptacion_terminos"    TIMESTAMPTZ(3),

    CONSTRAINT "cuenta_inactiva_pkey" PRIMARY KEY ("id_cuenta")
);

CREATE UNIQUE INDEX "cuenta_inactiva_id_proveedor_auth_key"
    ON "cuenta_inactiva" ("id_proveedor_auth");

CREATE TABLE "consentimiento_de_cuenta_inactiva" (
    "id_consentimiento" UUID NOT NULL,

    -- A que cuenta dada de baja pertenece. Sin clave foranea a proposito: lo que
    -- hace esta tabla es sobrevivir a la fila de `usuario`.
    "id_cuenta"         UUID NOT NULL,

    "tipo"              VARCHAR(30) NOT NULL,
    "version"           VARCHAR(20) NOT NULL,
    "aceptado_en"       TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "consentimiento_de_cuenta_inactiva_pkey" PRIMARY KEY ("id_consentimiento"),
    CONSTRAINT "consentimiento_de_cuenta_inactiva_tipo_conocido"
        CHECK ("tipo" IN ('aviso_de_privacidad', 'terminos'))
);

CREATE INDEX "consentimiento_de_cuenta_inactiva_id_cuenta_idx"
    ON "consentimiento_de_cuenta_inactiva" ("id_cuenta");

-- ---------------------------------------------------------------------------
-- Aislamiento
--
-- Es lo mas cerrado posible, porque es lo unico que sobrevive a la persona:
--
-- - Solo se puede ANADIR, y solo a nombre de la persona que esta dando de baja su
--   propia cuenta (`vsd_usuario_actual()`), y en la misma transaccion que borra la
--   fila de `usuario`. La aplicacion no tiene permiso de UPDATE ni de DELETE: una
--   constancia que la propia aplicacion pudiera reescribir no probaria nada.
-- - Solo se puede LEER la fila cuyo `id_proveedor_auth` coincide con el del token
--   verificado (es lo que necesita la guardia para saber que la sesion es de una
--   cuenta dada de baja) o la de la propia sesion, y nada mas que `cuenta_inactiva`.
--   Del historial de consentimientos no se lee nada desde la aplicacion.
-- - FORCE, como el resto, para que ni el dueno de la tabla se salte las politicas.
--   Quien opera la base (mantenimiento) lo hace con un rol que las ignora.
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT ON "cuenta_inactiva" TO vsd_app;

ALTER TABLE "cuenta_inactiva" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cuenta_inactiva" FORCE ROW LEVEL SECURITY;

CREATE POLICY "cuenta_inactiva_anadir_la_propia" ON "cuenta_inactiva"
  FOR INSERT
  WITH CHECK ("id_cuenta" = public.vsd_usuario_actual());

-- Y la sesion de la persona ve la suya: es lo que deja a `save` comprobar que no esta
-- guardando una cuenta que ya se dio de baja. Una orden que cargo la cuenta antes de la baja y
-- llega despues no puede volver a crearla con sus datos.
CREATE POLICY "cuenta_inactiva_leer_la_propia" ON "cuenta_inactiva"
  FOR SELECT
  USING ("id_cuenta" = public.vsd_usuario_actual());

CREATE POLICY "cuenta_inactiva_encontrarse_por_el_proveedor" ON "cuenta_inactiva"
  FOR SELECT
  USING (
    public.vsd_proveedor_actual() IS NOT NULL
    AND "id_proveedor_auth" = public.vsd_proveedor_actual()
  );

GRANT INSERT ON "consentimiento_de_cuenta_inactiva" TO vsd_app;

ALTER TABLE "consentimiento_de_cuenta_inactiva" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consentimiento_de_cuenta_inactiva" FORCE ROW LEVEL SECURITY;

CREATE POLICY "consentimiento_de_cuenta_inactiva_anadir_el_propio"
  ON "consentimiento_de_cuenta_inactiva"
  FOR INSERT
  WITH CHECK ("id_cuenta" = public.vsd_usuario_actual());

COMMENT ON TABLE "cuenta_inactiva" IS
  'Constancia minima de una cuenta dada de baja (SCRUM-190, ADR 0026): que existio, cuando y con que identificador del proveedor. Sin nombre, correo ni fecha de nacimiento.';

COMMENT ON TABLE "consentimiento_de_cuenta_inactiva" IS
  'Lo que acepto una cuenta dada de baja, version por version: la prueba de la autorizacion que exige la Ley 1581 de 2012. Solo admite altas.';
