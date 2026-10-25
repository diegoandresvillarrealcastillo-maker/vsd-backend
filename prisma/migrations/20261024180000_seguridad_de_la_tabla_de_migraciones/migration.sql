-- ---------------------------------------------------------------------------
-- La tabla de migraciones y las funciones de la base (avisos del asesor de
-- seguridad de Supabase, revision del 24/10/2026)
--
-- Dos cosas y ninguna toca datos de personas:
--
-- 1. `_prisma_migrations`, la tabla donde Prisma anota que migraciones se
--    aplicaron, vive en `public` sin Row Level Security y con todos los
--    permisos para `anon` y `authenticated`. Con la API REST de Supabase
--    activa, quien tenga la clave publica podria leerla o alterarla, y
--    alterarla basta para romper un despliegue. No guarda datos de personas.
--
-- 2. Cuatro funciones `vsd_*` (disparadores) no fijaban su `search_path`. Una
--    funcion sin eso resuelve los nombres con el de quien la llama. Aqui el
--    riesgo es bajo, pero las demas funciones del proyecto ya lo fijan y esta
--    prueba (`aislamiento.integracion.spec.ts`) exige que todas lo hagan.
--
-- Lo que no cambia: Prisma conecta con el dueno de la tabla, que no esta
-- sujeto a las politicas (aqui no se usa FORCE), asi que sigue anotando sus
-- migraciones igual. `vsd_app` nunca la ha usado.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. La tabla de migraciones
--
-- Sin politicas: con RLS activa y ninguna politica, nadie que este sujeto a
-- ellas ve ni toca una fila.
-- ---------------------------------------------------------------------------

ALTER TABLE public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- `anon` y `authenticated` solo existen en Supabase: en una base local o en la
-- del CI no hay a quien quitarle nada, y la migracion no debe fallar por eso.
DO $$
DECLARE
  rol text;
BEGIN
  FOREACH rol IN ARRAY ARRAY['anon', 'authenticated']
  LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = rol) THEN
      EXECUTE format('REVOKE ALL ON TABLE public."_prisma_migrations" FROM %I', rol);
    END IF;
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- 2. Las funciones
--
-- Ninguna usa un nombre sin calificar: las tablas van con `public.` y lo demas
-- (`now`, `to_jsonb`, `LEAST`...) vive en `pg_catalog`, que se busca siempre.
-- Por eso un `search_path` vacio no les cambia el resultado.
-- ---------------------------------------------------------------------------

ALTER FUNCTION public.vsd_zona_de_los_avisos() SET search_path = '';
ALTER FUNCTION public.vsd_llevar_la_zona_a_los_avisos() SET search_path = '';
ALTER FUNCTION public.vsd_fijar_creacion_del_diario() SET search_path = '';
ALTER FUNCTION public.vsd_acotar_la_edicion_del_diario() SET search_path = '';
