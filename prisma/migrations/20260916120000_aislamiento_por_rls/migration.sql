-- ============================================================================
-- Aislamiento entre personas impuesto por la base de datos (SCRUM-59)
-- ============================================================================
--
-- Hasta aqui, la regla de que nadie ve datos de otro vivia solo en el caso de
-- uso. Funciona mientras cada consulta se acuerde de filtrar por persona. El
-- dia que alguien escriba una consulta nueva y lo olvide, no hay nada debajo
-- que lo detenga, y el fallo no se nota: devuelve datos de mas sin dar ningun
-- error.
--
-- Row Level Security mueve esa regla al motor. A partir de aqui una consulta
-- sin filtro no devuelve de mas: devuelve de menos.
--
-- ## Como sabe la base quien esta preguntando
--
-- No hay un usuario de PostgreSQL por persona: son miles y la conexion se
-- reutiliza. Quien pregunta viaja en una variable de sesion,
-- `vsd.usuario_actual`, que la aplicacion fija con SET LOCAL dentro de la
-- transaccion. Al terminar la transaccion desaparece, y por eso es seguro con
-- un pool en modo transaccion como el de Supabase.
--
-- Si nadie la fija vale NULL, y toda comparacion contra NULL es falsa: sin
-- sesion no se ve nada. Se cierra por defecto, no se abre por defecto.
--
-- ## Hasta donde protege, y hasta donde no
--
-- Esto protege contra un fallo nuestro: una consulta mal escrita, un filtro
-- olvidado, un endpoint nuevo que no repita la comprobacion. No protege
-- contra un backend comprometido, que podria declarar la identidad que
-- quisiera. Esa capa es la autenticacion, y llega en el Ciclo 5.
--
-- Tampoco protege si la aplicacion se conecta como dueno de las tablas o con
-- un rol que tenga BYPASSRLS: ahi las politicas ni se evaluan. Por eso existe
-- el rol vsd_app, y por eso la aplicacion comprueba al arrancar que el rol con
-- el que se conecto esta realmente sujeto a las politicas.

-- ---------------------------------------------------------------------------
-- 1. Rol con el que se conecta la aplicacion
-- ---------------------------------------------------------------------------
--
-- Se crea SIN contrasena y SIN permiso de conexion a proposito: una migracion
-- se versiona en Git, y una contrasena en Git es una contrasena publicada.
--
-- Darle acceso es un paso manual y deliberado, una sola vez por ambiente:
--
--   ALTER ROLE vsd_app WITH LOGIN PASSWORD '<la que se guarde en el gestor>';
--
-- No es superusuario, no es dueno de ninguna tabla y no tiene BYPASSRLS. Es
-- justo eso lo que lo deja sujeto a las politicas de abajo.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'vsd_app') THEN
    CREATE ROLE vsd_app NOLOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO vsd_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON "usuario", "resultado", "entrada_diario" TO vsd_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON "categoria", "actividad", "recurso_apoyo" TO vsd_app;

-- Deliberadamente NO se usa ALTER DEFAULT PRIVILEGES. Una tabla nueva nace sin
-- acceso para vsd_app, asi que quien la cree tiene que decidir a proposito
-- quien la lee. Falla haciendo ruido en lugar de conceder en silencio.

-- ---------------------------------------------------------------------------
-- 2. Quien pregunta, y con que rol
-- ---------------------------------------------------------------------------
--
-- El tercer argumento de current_setting en true significa "devuelve NULL si
-- no existe" en vez de lanzar un error: la variable no esta fijada durante las
-- migraciones ni en una conexion de mantenimiento.
--
-- El NULLIF cubre el caso de la cadena vacia, que castear a uuid si daria
-- error.

CREATE OR REPLACE FUNCTION public.vsd_usuario_actual()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SET search_path = ''
AS $$
  SELECT NULLIF(current_setting('vsd.usuario_actual', true), '')::uuid
$$;

COMMENT ON FUNCTION public.vsd_usuario_actual() IS
  'Identidad de la persona en cuyo nombre se ejecuta la transaccion. NULL si no se fijo.';

CREATE OR REPLACE FUNCTION public.vsd_es_administrador()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SET search_path = ''
AS $$
  SELECT COALESCE(current_setting('vsd.rol_actual', true) = 'administrador', false)
$$;

COMMENT ON FUNCTION public.vsd_es_administrador() IS
  'Cierto solo si la transaccion declara el rol administrador. Falso si no se fijo.';

-- ---------------------------------------------------------------------------
-- 3. Datos personales: cada fila es de quien es
-- ---------------------------------------------------------------------------
--
-- FORCE ademas de ENABLE porque ENABLE por si solo exime al dueno de las
-- tablas. Sin FORCE bastaria con conectar la aplicacion con el usuario de las
-- migraciones para que todo esto dejara de aplicarse sin que nadie lo notara.
--
-- Las politicas no llevan clausula TO: valen para cualquier rol. Restringirlas
-- al rol de la aplicacion habria dejado a los demas roles sin ninguna politica
-- aplicable, que bajo FORCE significa no ver nada, y habria hecho imposible
-- cualquier mantenimiento.
--
-- Fijarse en lo que NO dicen estas politicas: no mencionan el rol
-- administrador. Un administrador es una persona mas, y ve sus propias filas y
-- ninguna otra. El entregable dice que gestiona categorias, actividades y
-- recursos, no personas; aqui eso deja de ser una promesa del documento y pasa
-- a ser algo que el motor no permite.

ALTER TABLE "usuario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "usuario" FORCE ROW LEVEL SECURITY;

CREATE POLICY "usuario_solo_el_propio" ON "usuario"
  FOR ALL
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

ALTER TABLE "resultado" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "resultado" FORCE ROW LEVEL SECURITY;

CREATE POLICY "resultado_solo_el_propio" ON "resultado"
  FOR ALL
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

ALTER TABLE "entrada_diario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "entrada_diario" FORCE ROW LEVEL SECURITY;

CREATE POLICY "entrada_diario_solo_la_propia" ON "entrada_diario"
  FOR ALL
  USING ("id_usuario" = public.vsd_usuario_actual())
  WITH CHECK ("id_usuario" = public.vsd_usuario_actual());

-- ---------------------------------------------------------------------------
-- 4. Catalogo: lo lee cualquiera, lo escribe el administrador
-- ---------------------------------------------------------------------------
--
-- Aqui no hay FORCE: las migraciones y las cargas de catalogo las hace el
-- dueno, y no tiene sentido pedirle que se declare administrador para sembrar
-- las actividades iniciales.
--
-- Las politicas permisivas se suman con OR. La de lectura deja ver el catalogo
-- a cualquier sesion; la de escritura es la unica que aplica a INSERT, UPDATE
-- y DELETE, y exige el rol administrador.

ALTER TABLE "categoria" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categoria_lectura_abierta" ON "categoria"
  FOR SELECT
  USING (true);

CREATE POLICY "categoria_escritura_administrador" ON "categoria"
  FOR ALL
  USING (public.vsd_es_administrador())
  WITH CHECK (public.vsd_es_administrador());

ALTER TABLE "actividad" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "actividad_lectura_abierta" ON "actividad"
  FOR SELECT
  USING (true);

CREATE POLICY "actividad_escritura_administrador" ON "actividad"
  FOR ALL
  USING (public.vsd_es_administrador())
  WITH CHECK (public.vsd_es_administrador());

ALTER TABLE "recurso_apoyo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recurso_apoyo_lectura_abierta" ON "recurso_apoyo"
  FOR SELECT
  USING (true);

CREATE POLICY "recurso_apoyo_escritura_administrador" ON "recurso_apoyo"
  FOR ALL
  USING (public.vsd_es_administrador())
  WITH CHECK (public.vsd_es_administrador());
