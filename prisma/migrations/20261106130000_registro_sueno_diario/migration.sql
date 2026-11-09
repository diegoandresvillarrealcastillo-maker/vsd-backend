-- El registro «Cómo dormiste anoche» debe estar disponible cada día.
-- Es una bitácora fija del módulo, no ocupa uno de los tres lugares rotativos.

DO $$
BEGIN
  UPDATE "actividad"
  SET
    "frecuencia" = 'diaria',
    "dias_semana" = ARRAY[]::SMALLINT[],
    "desde_sesion" = 1
  WHERE "id_actividad" = '0acd0000-0000-4000-8000-000000000004';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró la actividad «Cómo dormiste anoche» para hacerla diaria.';
  END IF;
END $$;
