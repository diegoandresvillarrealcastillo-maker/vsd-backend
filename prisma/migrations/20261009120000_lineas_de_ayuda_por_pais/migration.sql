-- ============================================================================
-- Lineas de ayuda segun el pais, sacado de la zona horaria (SCRUM-124)
-- ============================================================================
--
-- Un numero equivocado en una crisis es el peor error posible. Hasta aqui las
-- lineas eran todas colombianas y se ensenaban a cualquiera, y eso estaba bien
-- mientras toda la gente estuviera en Colombia. Con la zona horaria por persona
-- (SCRUM-123, ADR 0014) deja de estarlo: alguien en Madrid o en Ciudad de
-- Mexico recibiria el 192 y el 123 como si fueran suyos.
--
-- Tres columnas nuevas:
--
--   `pais`          el codigo ISO de dos letras donde sirve la linea. Vacio
--                   cuando sirve en cualquier parte.
--   `fuente`        la pagina oficial donde se confirmo el dato.
--   `verificado_el` el dia en que una persona lo confirmo ahi.
--
-- Y una restriccion: **un contacto sin fuente ni fecha no entra a la tabla.**
-- Es la forma de que "cada linea tiene fuente y fecha de verificacion" no
-- dependa de acordarse.
--
-- El pais de la persona se deduce de su zona horaria y nunca de su ubicacion
-- (`src/domain/model/PaisDeAyuda.ts`). Solo hay pais para los paises de abajo,
-- cuyas lineas se leyeron en la pagina oficial. Cualquier otra zona recibe la
-- fila sin pais: el directorio internacional, y no el telefono de otro pais.
--
-- Agregar un pais mas es una migracion nueva, no editar esta.

-- AlterTable
ALTER TABLE "recurso_apoyo"
  ADD COLUMN "pais" VARCHAR(2),
  ADD COLUMN "fuente" VARCHAR(255),
  ADD COLUMN "verificado_el" DATE;

-- ---------------------------------------------------------------------------
-- Colombia: las tres lineas que ya estaban, con su fuente
-- ---------------------------------------------------------------------------
--
-- La 192 conserva la fecha con la que se sembro (2026-09-16). Las otras dos se
-- volvieron a leer en su pagina oficial el 2026-10-06.

UPDATE "recurso_apoyo"
SET "pais" = 'CO',
    "fuente" = 'https://www.minsalud.gov.co',
    "verificado_el" = DATE '2026-09-16'
WHERE "id_recurso" = '0192c0de-0000-4000-8000-000000000192';

UPDATE "recurso_apoyo"
SET "pais" = 'CO',
    "fuente" = 'https://www1.funcionpublica.gov.co/preguntas-frecuentes/-/asset_publisher/sqxafjubsrEu/content/linea-unica-de-emergencias-nacional-123/28585938',
    "verificado_el" = DATE '2026-10-06'
WHERE "id_recurso" = '0123c0de-0000-4000-8000-000000000123';

UPDATE "recurso_apoyo"
SET "pais" = 'CO',
    "fuente" = 'https://literalmente.saludcapital.gov.co/salud-mental/que-tipo-de-ayuda-necesitas/lineas-de-atencion/',
    "verificado_el" = DATE '2026-10-06'
WHERE "id_recurso" = '0106c0de-0000-4000-8000-000000000106';

-- ---------------------------------------------------------------------------
-- Las restricciones, una vez que lo que ya existia las cumple
-- ---------------------------------------------------------------------------

ALTER TABLE "recurso_apoyo"
  ADD CONSTRAINT "recurso_apoyo_contacto_con_fuente"
  CHECK (
    "tipo" <> 'contacto'
    OR ("fuente" IS NOT NULL AND btrim("fuente") <> '' AND "verificado_el" IS NOT NULL)
  );

ALTER TABLE "recurso_apoyo"
  ADD CONSTRAINT "recurso_apoyo_pais_iso"
  CHECK ("pais" IS NULL OR "pais" ~ '^[A-Z]{2}$');

-- CreateIndex
CREATE INDEX "recurso_apoyo_tipo_pais_idx" ON "recurso_apoyo"("tipo", "pais");

-- ---------------------------------------------------------------------------
-- Los otros paises
-- ---------------------------------------------------------------------------
--
-- Cada fila trae lo que dice su fuente y nada mas. Se leyeron en la pagina
-- oficial el 2026-10-06. Si alguna cambia, se corrige con una migracion nueva.
--
-- ON CONFLICT DO NOTHING para que volver a aplicar las migraciones sobre una
-- base que ya las tiene no falle.

INSERT INTO "recurso_apoyo"
  ("id_recurso", "titulo", "descripcion", "tipo", "tema", "cobertura", "enlace", "pais", "fuente", "verificado_el")
VALUES
  -- Mexico
  (
    '8009c0de-0000-4000-8000-000000911200',
    'Línea de la Vida, 800 911 2000',
    'Orientación gratuita en salud mental de la Secretaría de Salud, las 24 horas, todos los días del año. Se marca 800 911 2000.',
    'contacto',
    NULL,
    'nacional',
    'https://www.gob.mx/lineadelavida',
    'MX',
    'https://www.gob.mx/salud/prensa/239-linea-de-la-vida-celebra-25-anos-de-servicio-humano-para-poblacion-con-problemas-de-salud-mental',
    DATE '2026-10-06'
  ),
  (
    '0911c0de-0000-4000-8000-000000000911',
    'Línea 911',
    'Línea única de emergencias, en todo el país, las 24 horas, todos los días del año. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    'contacto',
    NULL,
    'nacional',
    NULL,
    'MX',
    'https://www.gob.mx/911/articulos/que-es-9-1-1-conoce-mas-de-911emergencias',
    DATE '2026-10-06'
  ),
  -- Espana
  (
    '0024c0de-0000-4000-8000-000000000024',
    'Línea 024, llama a la vida',
    'Línea del Ministerio de Sanidad: gratuita, confidencial y las 24 horas, todos los días del año. Escucha a quien lo está pasando mal y también a su familia y sus allegados. Se marca 024.',
    'contacto',
    NULL,
    'nacional',
    'https://www.sanidad.gob.es/linea024/home.htm',
    'ES',
    'https://www.sanidad.gob.es/linea024/home.htm',
    DATE '2026-10-06'
  ),
  (
    '0112c0de-0000-4000-8000-000000000112',
    'Línea 112',
    'Teléfono de emergencias. Es el que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    'contacto',
    NULL,
    'nacional',
    NULL,
    'ES',
    'https://www.sanidad.gob.es/linea024/home.htm',
    DATE '2026-10-06'
  ),
  -- Estados Unidos
  (
    '0988c0de-0000-4000-8000-000000000988',
    'Línea 988',
    'Apoyo gratuito y confidencial por llamada, mensaje de texto o chat, las 24 horas, todos los días del año. Para hablar en español, marca 988 y presiona 2, o envía AYUDA por mensaje de texto al 988.',
    'contacto',
    NULL,
    'nacional',
    'https://988lifeline.org/get-help/',
    'US',
    'https://988lifeline.org/get-help/',
    DATE '2026-10-06'
  ),
  (
    '1911c0de-0000-4000-8000-000000000911',
    'Línea 911',
    'Número de emergencias, las 24 horas. Es el que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    'contacto',
    NULL,
    'nacional',
    NULL,
    'US',
    'https://www.usa.gov/features/the-988-lifeline-and-other-mental-health-services',
    DATE '2026-10-06'
  ),
  -- Sin pais: lo que recibe quien esta en un lugar sin lineas verificadas.
  -- No lleva ningun telefono, a proposito: no se sabe cual seria el suyo.
  (
    '0ffec0de-0000-4000-8000-00000000f1de',
    'Directorio internacional de líneas de ayuda',
    'Todavía no tenemos verificadas las líneas del lugar donde estás, y preferimos no darte un número que podría no ser el tuyo. Este directorio, que recomienda la Asociación Internacional para la Prevención del Suicidio, reúne líneas gratuitas de muchos países, por teléfono, chat o mensaje. Si hay riesgo inmediato para la vida de alguien, llama al número de emergencias del lugar donde estás.',
    'contacto',
    NULL,
    'internacional',
    'https://findahelpline.com/',
    NULL,
    'https://www.iasp.info/crisis-centres-helplines/',
    DATE '2026-10-06'
  )
ON CONFLICT ("id_recurso") DO NOTHING;
