-- Registra el motor que ensambla tres mecánicas base en un reto compuesto.
-- No modifica actividades ni resultados existentes.

ALTER TABLE "actividad" DROP CONSTRAINT "actividad_motor_valido";

ALTER TABLE "actividad"
  ADD CONSTRAINT "actividad_motor_valido" CHECK (
    "motor" IS NULL OR "motor" IN (
      'secuencia',
      'tocar_el_objetivo',
      'ver_ocultar_recordar',
      'clasificar',
      'palabras',
      'calculo',
      'guia_paso_a_paso',
      'cuestionario_corto',
      'escritura_breve',
      'deduccion_espacial',
      'deduccion_logica',
      'reto_compuesto_cognitivo'
    )
  );
