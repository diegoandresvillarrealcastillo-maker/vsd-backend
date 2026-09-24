-- ---------------------------------------------------------------------------
--  Poder encontrar la cuenta propia partiendo del token
-- ---------------------------------------------------------------------------
--
-- ## El problema
--
-- La politica `usuario_solo_el_propio` compara `id_usuario` con
-- `vsd.usuario_actual`. Para leer tu propia fila hay que saber ya tu
-- `id_usuario`.
--
-- Pero un token de Supabase no trae ese dato. Trae el identificador que asigna
-- el proveedor, que en nuestra tabla es `id_proveedor_auth`, una columna
-- distinta y tambien unica. Son dos identificadores diferentes a proposito: el
-- nuestro es nuestro, y no queremos que la clave primaria de toda la base
-- quede atada al proveedor de autenticacion del que dependamos hoy.
--
-- El resultado es un huevo y la gallina: para leer tu fila hay que saber quien
-- eres, y para saber quien eres hay que leer tu fila. Sin resolverlo, la
-- primera peticion de cualquier persona recien registrada no encuentra su
-- cuenta y no puede hacer nada.
--
-- ## Lo que se hace
--
-- Una segunda variable de sesion, `vsd.proveedor_actual`, con el identificador
-- que venia en el token **ya verificado**, y una politica que deja leer
-- exactamente la fila cuyo `id_proveedor_auth` coincide.
--
-- El aislamiento no se afloja: se sigue pudiendo alcanzar una sola fila, la
-- propia, y solo presentando un token que Supabase firmo. Lo que cambia es que
-- ahora hay dos maneras de nombrarla, y las dos llevan al mismo sitio.
--
-- ## Lo que esta politica NO permite
--
-- Solo SELECT.
--
-- No se anade a INSERT, UPDATE ni DELETE, y no es un olvido. Crear la cuenta
-- se hace con `vsd.usuario_actual`, porque el identificador lo generamos
-- nosotros y lo conocemos antes de insertar. Dar por esta via permiso de
-- escritura significaria que quien controle el valor de `vsd.proveedor_actual`
-- puede modificar una fila, y una variable de texto libre es mas facil de
-- equivocar que un UUID que ya tenemos en la mano.
--
-- Leer para identificarse es lo minimo que hace falta. Se concede eso y nada
-- mas.

-- El mismo patron que `vsd_usuario_actual`: el tercer argumento en true
-- devuelve NULL en vez de lanzar cuando la variable no esta fijada, que es lo
-- que ocurre durante las migraciones y en una conexion de mantenimiento.
--
-- Aqui no hay casteo a uuid: el identificador del proveedor es texto y no
-- tiene por que ser un UUID. Hoy Supabase entrega uno, pero eso es cosa suya y
-- puede cambiar.
CREATE OR REPLACE FUNCTION public.vsd_proveedor_actual()
  RETURNS text
  LANGUAGE sql
  STABLE
  SET search_path = ''
AS $$
  SELECT NULLIF(current_setting('vsd.proveedor_actual', true), '')
$$;

COMMENT ON FUNCTION public.vsd_proveedor_actual() IS
  'Identificador del proveedor de autenticacion que venia en el token verificado. NULL si no se fijo.';

-- El NULL importa. Sin esta comparacion, una conexion que no fijara la
-- variable veria las filas cuyo `id_proveedor_auth` fuera NULL; la columna es
-- NOT NULL y hoy no puede pasar, pero la politica no debe depender de eso.
-- Escrita asi, no fijar la variable significa no ver nada, que es como se
-- comporta el resto del sistema.
CREATE POLICY "usuario_encontrarse_por_el_proveedor" ON "usuario"
  FOR SELECT
  USING (
    public.vsd_proveedor_actual() IS NOT NULL
    AND "id_proveedor_auth" = public.vsd_proveedor_actual()
  );

COMMENT ON POLICY "usuario_encontrarse_por_el_proveedor" ON "usuario" IS
  'Deja que alguien encuentre su propia cuenta partiendo del identificador que trae su token, antes de conocer su id_usuario. Solo lectura, y solo de su propia fila.';
