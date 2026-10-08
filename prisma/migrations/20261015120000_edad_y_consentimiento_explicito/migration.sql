-- ---------------------------------------------------------------------------
-- La edad y el consentimiento explicito (auditoria 360: S-01, S-02 y L-05)
--
-- VSD Health es solo para mayores de 18 anos, y hasta ahora nada lo comprobaba:
-- el registro no pedia fecha de nacimiento. Ademas el consentimiento se
-- registraba solo, al entrar, sin que la persona marcara nada. Esta migracion
-- guarda lo que hace falta para exigir las dos cosas:
--
-- 1. En USUARIO: la fecha de nacimiento declarada y los terminos aceptados
--    (version y fecha, como el aviso de privacidad).
--
-- 2. La tabla CONSENTIMIENTO: el historial de lo aceptado. Las columnas de
--    USUARIO dicen lo vigente; si se sobrescribieran al aceptar de nuevo se
--    perderia la prueba de lo que se acepto antes. Aqui solo se anade.
--
-- Es aditiva y no bloquea: columnas que aceptan NULL y una tabla nueva. Las
-- cuentas que ya existen quedan sin fecha de nacimiento ni terminos, y la API
-- las trata como registro incompleto: pueden ver, exportar y borrar lo suyo,
-- pero para usar lo demas tienen que completarlo (ADR 0021).
-- ---------------------------------------------------------------------------

ALTER TABLE "usuario"
    ADD COLUMN "fecha_nacimiento"           DATE,
    ADD COLUMN "version_terminos_aceptada"  VARCHAR(20),
    ADD COLUMN "fecha_aceptacion_terminos"  TIMESTAMPTZ(3);

-- Los terminos se guardan con su version y su fecha, o con ninguna de las dos.
ALTER TABLE "usuario"
    ADD CONSTRAINT "usuario_terminos_completos"
    CHECK (("version_terminos_aceptada" IS NULL) = ("fecha_aceptacion_terminos" IS NULL));

-- Ultima defensa de la regla de los 18 anos. La que manda es la API, que cuenta
-- la edad con el dia de la persona; esta existe para que un error de
-- programacion no deje pasar a un menor sin que nadie lo note.
--
-- Deja un dia de margen (`CURRENT_DATE + 1`) porque la fecha de la base es la
-- de UTC y la de una persona en Asia ya puede ser la del dia siguiente: sin el
-- margen se rechazaria a quien cumple 18 hoy en su zona. Ademas descarta
-- fechas absurdas por lo antiguas.
ALTER TABLE "usuario"
    ADD CONSTRAINT "usuario_fecha_nacimiento_de_un_adulto"
    CHECK (
        "fecha_nacimiento" IS NULL
        OR (
            "fecha_nacimiento" > DATE '1890-01-01'
            AND "fecha_nacimiento" <= ((CURRENT_DATE + 1) - INTERVAL '18 years')
        )
    );

COMMENT ON COLUMN "usuario"."fecha_nacimiento" IS
  'Fecha de nacimiento declarada. NULL en las cuentas anteriores a que se pidiera. Solo se escribe tras comprobar que la persona es mayor de 18 anos.';
COMMENT ON COLUMN "usuario"."version_terminos_aceptada" IS
  'Version de los terminos que la persona acepto con su casilla. NULL en las cuentas anteriores.';
COMMENT ON COLUMN "usuario"."fecha_aceptacion_terminos" IS
  'Cuando acepto los terminos. NULL en las cuentas anteriores.';

CREATE TABLE "consentimiento" (
    "id_consentimiento" UUID NOT NULL,
    "id_usuario"        UUID NOT NULL,

    -- Que se acepto: el aviso de privacidad o los terminos.
    "tipo"              VARCHAR(30) NOT NULL,

    -- La version del texto, la misma cadena que devuelve GET /api/aviso.
    "version"           VARCHAR(20) NOT NULL,

    "aceptado_en"       TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "consentimiento_pkey" PRIMARY KEY ("id_consentimiento"),
    CONSTRAINT "consentimiento_tipo_conocido"
        CHECK ("tipo" IN ('aviso_de_privacidad', 'terminos')),
    CONSTRAINT "consentimiento_version_con_texto" CHECK (btrim("version") <> '')
);

-- Una fila por cada vez que la persona acepto. Guardar la cuenta otra vez con el
-- mismo consentimiento no duplica nada (misma version y misma fecha); aceptar de
-- nuevo la misma version, como hacen las cuentas anteriores al completar su
-- registro con las casillas, anade una fila y deja la anterior.
CREATE UNIQUE INDEX "consentimiento_id_usuario_tipo_version_aceptado_en_key"
    ON "consentimiento" ("id_usuario", "tipo", "version", "aceptado_en");
CREATE INDEX "consentimiento_id_usuario_idx" ON "consentimiento" ("id_usuario");

ALTER TABLE "consentimiento"
    ADD CONSTRAINT "consentimiento_id_usuario_fkey" FOREIGN KEY ("id_usuario")
    REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- Lo que las cuentas ya existentes aceptaron al registrarse queda en el
-- historial: es lo unico que prueba a que dieron permiso, y las columnas de
-- USUARIO se reemplazaran cuando completen su registro. Va antes de activar el
-- aislamiento, mientras esta tabla todavia puede escribirse sin pasar por una
-- persona concreta.
INSERT INTO "consentimiento" ("id_consentimiento", "id_usuario", "tipo", "version", "aceptado_en")
SELECT gen_random_uuid(), "id_usuario", 'aviso_de_privacidad',
       "version_politica_aceptada", "fecha_aceptacion_politica"
FROM "usuario"
WHERE btrim("version_politica_aceptada") <> '';

-- ---------------------------------------------------------------------------
-- Aislamiento
--
-- Como el resto: cada persona ve las suyas, y FORCE para que ni el dueno de la
-- tabla se salte las politicas.
--
-- Y una diferencia a proposito: la aplicacion solo puede LEER y ANADIR. No
-- tiene permiso de UPDATE ni de DELETE, y por eso tampoco hay politicas para
-- ellos. Un historial que la propia aplicacion pudiera reescribir no probaria
-- nada. Borrar la cuenta lo borra igual, por el ON DELETE CASCADE: eso lo hace
-- la base con los permisos del dueno de la tabla, no la aplicacion.
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT ON "consentimiento" TO vsd_app;

ALTER TABLE "consentimiento" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consentimiento" FORCE ROW LEVEL SECURITY;

CREATE POLICY "consentimiento_leer_el_propio" ON "consentimiento"
  FOR SELECT
  USING ("id_usuario" = public.vsd_usuario_actual());

CREATE POLICY "consentimiento_anadir_el_propio" ON "consentimiento"
  FOR INSERT
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());
