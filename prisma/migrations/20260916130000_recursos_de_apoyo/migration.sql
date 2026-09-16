-- ============================================================================
-- RECURSO_APOYO pasa a ser la base de conocimiento del asistente (SCRUM-60)
-- ============================================================================
--
-- Hasta aqui era un catalogo de enlaces. A partir de aqui es de donde el
-- asistente saca lo que responde: si un texto hay que cambiarlo, se cambia una
-- fila y no se toca el codigo ni hace falta desplegar.
--
-- Dos columnas nuevas:
--
-- `tema` es lo que permite responder a una intencion con contenido de la base.
-- Sin el, las respuestas acabarian escritas dentro del adaptador, que es justo
-- lo que se quiere evitar.
--
-- `cobertura` dice donde sirve cada recurso, y no es un adorno. La Linea 106 es
-- un servicio del Distrito y se marca desde Bogota; la sede principal de la
-- Universidad de Cundinamarca esta en Fusagasuga, y hay sedes en Girardot,
-- Ubate, Chia, Facatativa, Soacha, Zipaquira y Chocontá. Darle solo ese numero
-- a quien esta fuera de Bogota es darle un telefono que no va a contestar. En
-- una situacion de riesgo eso no es un detalle menor.
--
-- Por eso el asistente ordena por cobertura y lo nacional va primero.

-- AlterTable
ALTER TABLE "recurso_apoyo" ADD COLUMN     "cobertura" VARCHAR(30),
ADD COLUMN     "tema" VARCHAR(30);

-- CreateIndex
CREATE INDEX "recurso_apoyo_tipo_tema_idx" ON "recurso_apoyo"("tipo", "tema");

-- ---------------------------------------------------------------------------
-- Lineas de atencion
-- ---------------------------------------------------------------------------
--
-- Estas filas no son datos de ejemplo. Son las que el asistente devuelve
-- siempre que detecta una senal de riesgo, asi que se siembran con la
-- migracion: si faltaran, el asistente responderia una lista vacia justo en el
-- unico momento en el que no puede fallar. Hay una prueba que comprueba que
-- estan.
--
-- Los datos se verificaron en las fuentes oficiales el 2026-09-16. Si alguno
-- cambia, se corrige con una migracion nueva, no editando esta.
--
-- ON CONFLICT DO NOTHING para que volver a aplicar las migraciones sobre una
-- base que ya las tiene no falle.

INSERT INTO "recurso_apoyo" ("id_recurso", "titulo", "descripcion", "tipo", "tema", "cobertura", "enlace")
VALUES
  (
    '0192c0de-0000-4000-8000-000000000192',
    'Linea 192, opcion 4',
    'Orientacion en salud mental del Ministerio de Salud. Funciona en todo el pais: se marca 192 y se elige la opcion 4. Atiende un equipo de profesionales.',
    'contacto',
    NULL,
    'nacional',
    'https://www.minsalud.gov.co'
  ),
  (
    '0123c0de-0000-4000-8000-000000000123',
    'Linea 123',
    'Linea unica de emergencias, en todo el pais. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    'contacto',
    NULL,
    'nacional',
    NULL
  ),
  (
    '0106c0de-0000-4000-8000-000000000106',
    'Linea 106, el poder de ser escuchado',
    'Apoyo psicologico gratuito de la Secretaria Distrital de Salud, las 24 horas, todos los dias del ano. Se marca 106 desde Bogota; tambien responde por WhatsApp al 300 754 8933 y en linea106@saludcapital.gov.co.',
    'contacto',
    NULL,
    'bogota',
    'https://www.saludcapital.gov.co'
  )
ON CONFLICT ("id_recurso") DO NOTHING;

-- ---------------------------------------------------------------------------
-- Contenido de apoyo para las demas intenciones
-- ---------------------------------------------------------------------------
--
-- Textos cortos a proposito. Son lo que el asistente responde cuando reconoce
-- una intencion, y un parrafo largo en pantalla no lo lee nadie.
--
-- Ninguno nombra una condicion ni sugiere un diagnostico. Hay una prueba que
-- falla si alguno lo hiciera.

INSERT INTO "recurso_apoyo" ("id_recurso", "titulo", "descripcion", "tipo", "tema", "cobertura", "enlace")
VALUES
  (
    '0a000000-0000-4000-8000-000000000001',
    'Que significa tu nivel',
    'El nivel resume como te fue en esa actividad concreta, ese dia. No dice nada sobre ti como persona, y un mismo nivel puede significar cosas distintas segun la actividad.',
    'lectura',
    'resultado',
    'nacional',
    NULL
  ),
  (
    '0a000000-0000-4000-8000-000000000002',
    'Rutina para descansar mejor',
    'Acostarte y levantarte a la misma hora, dejar las pantallas media hora antes y bajar la luz de la habitacion son los tres cambios con mas efecto y los mas faciles de sostener.',
    'lectura',
    'sueno',
    'nacional',
    NULL
  ),
  (
    '0a000000-0000-4000-8000-000000000003',
    'Cuando el dia viene pesado',
    'Sentirte mal un dia no requiere explicacion ni solucion inmediata. Ayuda moverte un rato, tomar agua, y contarselo a alguien de confianza antes de que se acumule.',
    'lectura',
    'animo',
    'nacional',
    NULL
  ),
  (
    '0a000000-0000-4000-8000-000000000004',
    'Bienestar universitario',
    'La Universidad de Cundinamarca tiene acompanamiento psicologico gratuito para estudiantes. Se pide por Bienestar Universitario en tu sede.',
    'contacto',
    'ayuda',
    'universidad',
    NULL
  )
ON CONFLICT ("id_recurso") DO NOTHING;
