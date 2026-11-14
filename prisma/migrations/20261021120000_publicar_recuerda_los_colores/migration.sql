-- Publicar «Recuerda los colores» (COG-01) en el piloto (SCRUM-217, ADR 0030).
--
-- Solo DATOS: un UPDATE de `publicado`. No toca el esquema ni siembra nada. Pone a la vista las
-- cuatro sesiones que `20261020120000_piloto_tres_mecanicas_y_diez_sesiones` dejo sin publicar:
--
--   5e510001-...-0001  Cuatro colores             (nivel 1, 4 casillas, largo inicial 3)
--   5e510001-...-0002  Seis colores               (nivel 2, 6 casillas, largo inicial 3)
--   5e510001-...-0003  Nueve colores              (nivel 3, 9 casillas, largo inicial 4)
--   5e510001-...-0004  Cuatro colores, con calma  (nivel 1, destello de 1.100 ms y pausa de 600 ms)
--
-- ## Lo que cambia a la vista
--
-- En el ambiente donde se aplique, «Recuerda los colores» empieza a ofrecerse en Cognicion, rotando
-- entre sus cuatro sesiones (a cada persona le toca una distinta cada vez, y una que ya hizo no vuelve
-- hasta pasado un ano). Es lo unico que cambia: las otras dos mecanicas del piloto siguen sin ofrecerse.
--
-- ## Por que solo COG-01
--
-- Es la unica del piloto que no pide revision profesional (`no_requiere`). Respiracion guiada (BIE-01) y
-- Tres cosas buenas (EMO-02) siguen `pendiente` y sin publicar, y la base impide publicarlas asi
-- (`sesion_de_actividad_publicada_revisada`). Su publicacion va en `[C7-43]`, cuando exista quien las
-- revise.
--
-- ## Las protecciones del UPDATE
--
--   * Nombra las cuatro por su identificador y NO por la mecanica: una sesion que se siembre despues en
--     «Recuerda los colores» no se publica sola al aplicar esta migracion en una base nueva.
--   * `revision = 'no_requiere'`: si una de las cuatro llegara a pedir revision, no se publica.
--   * `NOT publicado`: aplicarla dos veces deja lo mismo.
--
-- ## Antes de aplicarla en PRE (lo hace una persona)
--
-- Tomar la linea base del peso de `GET /api/progreso` ANTES de aplicarla (guia de prueba del piloto, §3):
-- despues de publicar ya no se puede medir «antes».
--
-- ## PROD
--
-- Esta migracion viaja con la cadena de promociones. Al promoverla a PROD se publicaria tambien alli:
-- PROD sigue en pausa, y esa decision se toma cuando se retome.
--
-- Para deshacerla (retirar no borra: quien ya hizo una la conserva en su historial, y
-- `resultado.id_sesion` es RESTRICT):
--   UPDATE "sesion_de_actividad" SET "publicado" = FALSE WHERE "id_sesion" IN (<las cuatro de arriba>);

UPDATE "sesion_de_actividad"
SET "publicado" = TRUE
WHERE "id_sesion" IN (
    '5e510001-0000-4000-8000-000000000001',
    '5e510001-0000-4000-8000-000000000002',
    '5e510001-0000-4000-8000-000000000003',
    '5e510001-0000-4000-8000-000000000004'
  )
  AND "revision" = 'no_requiere'
  AND NOT "publicado";
