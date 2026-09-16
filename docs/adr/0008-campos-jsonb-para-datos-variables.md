# ADR 0008 — Campos JSONB para los datos que varían por actividad

Estado: aceptado · 15/09/2026

## Contexto

VSD Health tiene tres áreas y va a ir sumando actividades a lo largo del
proyecto: juegos de memoria, cuestionarios orientativos, bitácoras de sueño,
registros de ánimo. Cada tipo guarda información distinta.

Una bitácora de sueño necesita horas dormidas, despertares y cómo amaneció la
persona. Un registro emocional necesita las respuestas que marcó. Un juego de
atención necesita aciertos y tiempos de reacción. No hay un conjunto de columnas
que sirva para todos.

Lo mismo ocurre con la configuración de cada actividad: los cortes que separan
un nivel del siguiente y los textos que ve la persona son distintos en cada una
y no tienen una forma fija.

El entregable de levantamiento ya resolvió parte de esto al declarar
`RESULTADO.metadata` como JSONB y justificarlo con el requerimiento no funcional
de escalabilidad: _"debe ser posible crear nuevas categorías o actividades usando
la misma estructura existente"_.

## Decisión

Se usa JSONB en cinco campos: `RESULTADO.metadata`, `ACTIVIDAD.umbrales`,
`ACTIVIDAD.textos_nivel`, `ENTRADA_DIARIO.etiquetas` y
`ENTRADA_DIARIO.adjuntos`.

**La regla que decide qué va en JSONB y qué va en una columna:** si el sistema
necesita consultarlo, filtrarlo, ordenarlo o imponerle una restricción, es una
columna. Si solo necesita guardarlo y devolverlo tal cual, puede ir en JSONB.

Por eso `puntaje` y `nivel_orientativo` son columnas —se consultan para calcular
tendencias y dibujar el progreso— mientras que las respuestas concretas que
produjeron ese puntaje van en `metadata`.

`metadata` no puede contener claves que dupliquen columnas existentes. Dos
verdades sobre el mismo dato terminan divergiendo.

## Alternativas consideradas

**Una tabla por tipo de actividad.** Normaliza de verdad y permite restricciones
por campo. Se descarta porque obliga a crear una tabla y una migración cada vez
que se añade una actividad, que es justo lo que el requerimiento de escalabilidad
pide evitar. Con dos personas y un semestre, cada migración es tiempo que no se
dedica al producto.

**Tabla genérica de atributo y valor.** Una fila por cada dato, con nombre y
valor en texto. Evita crear tablas pero pierde los tipos, complica las consultas
y produce muchísimas filas por cada resultado. Es el patrón que suele acabar
siendo el problema del proyecto.

**Una columna de texto con JSON dentro.** Más simple, pero PostgreSQL no puede
indexar ni consultar dentro. JSONB cuesta lo mismo de escribir y permite
consultar el contenido si algún día hace falta.

## Consecuencias

**A favor.** Añadir una actividad nueva no requiere migración. El diseño queda
alineado con el entregable. La configuración de nivel vive junto a la actividad
que la define, que es donde tiene sentido buscarla.

**En contra.** La base no valida la forma del contenido de esos campos: eso queda
del lado del dominio, y hay que probarlo. Un campo libre invita a meter ahí cosas
que deberían ser columnas, y la revisión de cada Pull Request tiene que
vigilarlo. Consultar dentro de JSONB es más lento que una columna indexada, lo
cual es aceptable porque no se consulta por esos campos en el flujo principal.

**A vigilar.** Si alguna clave de `metadata` empieza a consultarse con
frecuencia, deja de ser metadata y debe promoverse a columna con su migración.
